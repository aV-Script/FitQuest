/**
 * Catalogo badge — due tipi:
 *
 * cosmetic    → sblocca un titolo che il cliente può impostare nel profilo
 * progression → assegna XP bonus fisso al momento dello sblocco
 *
 * Struttura documento Firestore (nell'array badges del cliente):
 * { id, type, unlockedAt, xpAwarded? }
 */

export const BADGE_CATALOG = [

  // ── PROGRESSIONE RANK ─────────────────────────────────────────────────────
  { id: 'rank_b',    type: 'progression', xp: 50,  name: 'Rank B',       desc: 'Raggiunto il rank B',       condition: 'rank_reached' },
  { id: 'rank_a',    type: 'progression', xp: 100, name: 'Rank A',       desc: 'Raggiunto il rank A',       condition: 'rank_reached' },
  { id: 'rank_s',    type: 'progression', xp: 200, name: 'Rank S',       desc: 'Raggiunto il rank S',       condition: 'rank_reached' },
  { id: 'rank_ss',   type: 'progression', xp: 300, name: 'Rank SS',      desc: 'Raggiunto il rank SS',      condition: 'rank_reached' },
  { id: 'rank_ex',   type: 'progression', xp: 500, name: 'Rank EX',      desc: 'Raggiunto il rank EX — il massimo', condition: 'rank_reached' },

  // ── STATISTICHE A 100 ─────────────────────────────────────────────────────
  { id: 'stat_100_forza',       type: 'progression', xp: 150, name: 'Presa di Ferro',      desc: 'Forza al massimo percentile',       condition: 'stat_100' },
  { id: 'stat_100_mobilita',    type: 'progression', xp: 150, name: 'Corpo di Seta',        desc: 'Mobilità al massimo percentile',    condition: 'stat_100' },
  { id: 'stat_100_equilibrio',  type: 'progression', xp: 150, name: 'Roccia Immobile',      desc: 'Equilibrio al massimo percentile',  condition: 'stat_100' },
  { id: 'stat_100_esplosivita', type: 'progression', xp: 150, name: 'Fulmine',              desc: 'Esplosività al massimo percentile', condition: 'stat_100' },
  { id: 'stat_100_resistenza',  type: 'progression', xp: 150, name: 'Cuore d\'Acciaio',     desc: 'Resistenza al massimo percentile',  condition: 'stat_100' },

  // ── CLASSI SBLOCCATE ──────────────────────────────────────────────────────
  { id: 'class_guerriero',  type: 'cosmetic', title: 'Il Guerriero',   name: 'Guerriero',         desc: 'Classe Guerriero sbloccata',         condition: 'class_unlocked' },
  { id: 'class_danzatore',  type: 'cosmetic', title: 'Il Danzatore',   name: 'Danzatore',         desc: 'Classe Danzatore sbloccata',         condition: 'class_unlocked' },
  { id: 'class_sentinella', type: 'cosmetic', title: 'La Sentinella',  name: 'Sentinella',        desc: 'Classe Sentinella sbloccata',        condition: 'class_unlocked' },
  { id: 'class_velocista',  type: 'cosmetic', title: 'Il Velocista',   name: 'Velocista',         desc: 'Classe Velocista sbloccata',         condition: 'class_unlocked' },
  { id: 'class_corridore',  type: 'cosmetic', title: 'Il Corridore',   name: 'Corridore',         desc: 'Classe Corridore sbloccata',         condition: 'class_unlocked' },

  // ── SPEC SBLOCCATE ────────────────────────────────────────────────────────
  { id: 'spec_predatore',        type: 'cosmetic', title: 'Il Predatore',          name: 'Predatore',          desc: 'SPEC Predatore sbloccata',          condition: 'spec_unlocked' },
  { id: 'spec_acrobata',         type: 'cosmetic', title: "L'Acrobata",            name: 'Acrobata',           desc: 'SPEC Acrobata sbloccata',           condition: 'spec_unlocked' },
  { id: 'spec_guerriero_elite',  type: 'cosmetic', title: "Il Guerriero d'Élite",  name: "Guerriero d'Élite",  desc: "SPEC Guerriero d'Élite sbloccata",  condition: 'spec_unlocked' },
  { id: 'spec_fantasma',         type: 'cosmetic', title: 'Il Fantasma',           name: 'Fantasma',           desc: 'SPEC Fantasma sbloccata',           condition: 'spec_unlocked' },
  { id: 'spec_maratoneta',       type: 'cosmetic', title: 'Il Maratoneta',         name: 'Maratoneta',         desc: 'SPEC Maratoneta sbloccata',         condition: 'spec_unlocked' },
  { id: 'spec_titano',           type: 'cosmetic', title: 'Il Titano',             name: 'Titano',             desc: 'SPEC Titano sbloccata',             condition: 'spec_unlocked' },
  { id: 'spec_artista_marziale', type: 'cosmetic', title: "L'Artista Marziale",    name: 'Artista Marziale',   desc: 'SPEC Artista Marziale sbloccata',   condition: 'spec_unlocked' },
  { id: 'spec_atleta_completo',  type: 'cosmetic', title: "L'Atleta Completo",     name: 'Atleta Completo',    desc: 'SPEC Atleta Completo sbloccata',    condition: 'spec_unlocked' },

  // ── TRAGUARDI SPECIALI ────────────────────────────────────────────────────
  { id: 'first_camp',     type: 'cosmetic',    title: 'L\'Inizio',         name: 'Primo Campionamento', desc: 'Hai completato il tuo primo campionamento',           condition: 'manual' },
  { id: 'level_10',       type: 'progression', xp: 250, name: 'Veterano',   desc: 'Raggiunto il livello 10',                             condition: 'level_reached' },
  { id: 'level_25',       type: 'progression', xp: 500, name: 'Esperto',    desc: 'Raggiunto il livello 25',                             condition: 'level_reached' },
  { id: 'full_month',     type: 'cosmetic',    title: 'Costanza',          name: 'Mese Perfetto',       desc: 'Completato il 100% degli allenamenti in un mese',     condition: 'manual' },
  { id: 'all_classes',    type: 'cosmetic',    title: 'Il Poliedrico',     name: 'Tutte le Classi',     desc: 'Sbloccate tutte e 5 le classi base',                  condition: 'all_classes' },
]

export const getBadgeById = (id) => BADGE_CATALOG.find(b => b.id === id)

/**
 * Ritorna tutti i badge cosmetic che hanno un titolo sbloccato dal cliente.
 */
export function getUnlockedTitles(clientBadges = []) {
  return clientBadges
    .map(b => {
      const def = getBadgeById(typeof b === 'string' ? b : b.id)
      return def?.type === 'cosmetic' ? def : null
    })
    .filter(Boolean)
}
