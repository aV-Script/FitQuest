/**
 * Backfill timestamp sui log entry — RankEX
 *
 * Per ogni client in tutte le organizzazioni:
 *   - Le entry di log prive di `ts` vengono aggiornate con un timestamp
 *     stimato dalla stringa `date` ("28 apr") assumento l'anno corrente
 *     o quello precedente se il mese è successivo al mese odierno.
 *   - Le entry già dotate di `ts` vengono saltate (idempotente).
 *
 * Utilizzo:
 *   node scripts/migrate-logTimestamps.mjs <email> <password> [--prod] [--dry-run]
 *
 * Flag:
 *   --prod     usa .env.production (default: .env.development)
 *   --dry-run  simula senza scrivere su Firestore
 */

import { readFileSync }                           from 'fs'
import { resolve, dirname }                       from 'path'
import { fileURLToPath }                          from 'url'
import { initializeApp }                          from 'firebase/app'
import { getAuth, signInWithEmailAndPassword }    from 'firebase/auth'
import { getFirestore, collection, getDocs,
         doc, writeBatch }                        from 'firebase/firestore'

// ── Resolve root ──────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT      = resolve(__dirname, '..')

// ── Args ──────────────────────────────────────────────────────────────────────

const args   = process.argv.slice(2)
const email  = args.find(a => !a.startsWith('--'))
const pass   = args.filter(a => !a.startsWith('--'))[1]
const isProd = args.includes('--prod')
const dryRun = args.includes('--dry-run')

if (!email || !pass) {
  console.error('Utilizzo: node scripts/migrate-logTimestamps.mjs <email> <password> [--prod] [--dry-run]')
  process.exit(1)
}

// ── Firebase config ───────────────────────────────────────────────────────────

function parseEnvFile(filePath) {
  const text = readFileSync(filePath, 'utf8')
  const env  = {}
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
  }
  return env
}

const envFile = isProd ? '.env.production' : '.env.development'
const env     = parseEnvFile(resolve(ROOT, envFile))

const firebaseConfig = {
  apiKey:            env.VITE_FIREBASE_API_KEY,
  authDomain:        env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             env.VITE_FIREBASE_APP_ID,
}

// ── Init ──────────────────────────────────────────────────────────────────────

const app  = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db   = getFirestore(app)

// ── Parse "28 apr" → unix ms ──────────────────────────────────────────────────

const IT_MONTHS = {
  gen: 0, feb: 1, mar: 2, apr: 3, mag: 4, giu: 5,
  lug: 6, ago: 7, set: 8, ott: 9, nov: 10, dic: 11,
}

function parseDateString(dateStr) {
  if (!dateStr) return null
  const parts    = dateStr.trim().toLowerCase().replace(/\./g, '').split(/\s+/)
  if (parts.length < 2) return null
  const day      = parseInt(parts[0], 10)
  const monthIdx = IT_MONTHS[parts[1]]
  if (isNaN(day) || monthIdx === undefined) return null
  const now  = new Date()
  const year = monthIdx > now.getMonth() ? now.getFullYear() - 1 : now.getFullYear()
  return new Date(year, monthIdx, day, 12, 0, 0).getTime()
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔧  Backfill log timestamps')
  console.log(`    Progetto : ${env.VITE_FIREBASE_PROJECT_ID}`)
  console.log(`    Env file : ${envFile}`)
  console.log(`    Modalità : ${dryRun ? 'DRY-RUN (nessuna scrittura)' : 'LIVE'}`)
  console.log()

  console.log(`🔑  Login come ${email}…`)
  await signInWithEmailAndPassword(auth, email, pass)
  console.log('    ✓ autenticato\n')

  const orgsSnap = await getDocs(collection(db, 'organizations'))
  console.log(`📦  Trovate ${orgsSnap.size} organizzazioni\n`)

  const stats = {
    orgs: orgsSnap.size, clients: 0,
    entryAggiornate: 0, entryGiaSalvate: 0, entryNonParsabili: 0,
    clientiAggiornati: 0, clientiSaltati: 0,
  }

  let batch      = writeBatch(db)
  let batchCount = 0

  for (const orgDoc of orgsSnap.docs) {
    const orgId      = orgDoc.id
    const orgName    = orgDoc.data().name ?? orgId
    const clientsSnap = await getDocs(collection(db, 'organizations', orgId, 'clients'))

    if (clientsSnap.empty) continue
    console.log(`  Org: ${orgName} (${orgId}) — ${clientsSnap.size} clienti`)

    for (const clientDoc of clientsSnap.docs) {
      stats.clients++
      const data = clientDoc.data()
      const log  = data.log ?? []

      if (log.length === 0 || log.every(e => e.ts)) {
        stats.clientiSaltati++
        continue
      }

      let modified = false
      const newLog = log.map(entry => {
        if (entry.ts) {
          stats.entryGiaSalvate++
          return entry
        }
        const ts = parseDateString(entry.date)
        if (!ts) {
          stats.entryNonParsabili++
          console.warn(`    ⚠  ${data.name ?? clientDoc.id} — data non parsabile: "${entry.date}"`)
          return entry
        }
        stats.entryAggiornate++
        modified = true
        return { ...entry, ts }
      })

      if (!modified) { stats.clientiSaltati++; continue }

      console.log(`    ✓  ${data.name ?? clientDoc.id} — ${newLog.filter(e => e.ts && !log.find(o => o === e)).length} entry aggiornate`)
      stats.clientiAggiornati++

      if (!dryRun) {
        batch.update(doc(db, 'organizations', orgId, 'clients', clientDoc.id), { log: newLog })
        batchCount++

        if (batchCount >= 499) {
          await batch.commit()
          batch      = writeBatch(db)
          batchCount = 0
        }
      }
    }
  }

  if (!dryRun && batchCount > 0) await batch.commit()

  console.log()
  console.log('─'.repeat(50))
  console.log('📊  Report')
  console.log(`    Organizzazioni      : ${stats.orgs}`)
  console.log(`    Clienti totali      : ${stats.clients}`)
  console.log(`    Clienti aggiornati  : ${stats.clientiAggiornati}`)
  console.log(`    Clienti saltati     : ${stats.clientiSaltati}`)
  console.log(`    Entry aggiornate    : ${stats.entryAggiornate}`)
  console.log(`    Entry già ok        : ${stats.entryGiaSalvate}`)
  console.log(`    Entry non parsabili : ${stats.entryNonParsabili}`)
  console.log('─'.repeat(50))

  if (dryRun) {
    console.log('\n🔵  DRY-RUN completato — nessuna scrittura effettuata.')
    console.log('    Rilancia senza --dry-run per applicare le modifiche.')
  } else {
    console.log('\n✅  Migrazione completata.')
  }
}

main().catch(err => {
  console.error('\n❌  Errore:', err.message)
  process.exit(1)
})
