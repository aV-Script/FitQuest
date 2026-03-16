// ─── Rank basato sulla media delle 5 statistiche ──────────────────────────────
export const RANKS = [
  { min: 95,  label: 'EX',  color: '#ffd700' },
  { min: 90,  label: 'SS+', color: '#ff6b6b' },
  { min: 85,  label: 'SS',  color: '#ff8e53' },
  { min: 80,  label: 'S+',  color: '#ff6fd8' },
  { min: 75,  label: 'S',   color: '#c77dff' },
  { min: 70,  label: 'A+',  color: '#a78bfa' },
  { min: 65,  label: 'A',   color: '#60a5fa' },
  { min: 60,  label: 'B+',  color: '#38bdf8' },
  { min: 55,  label: 'B',   color: '#34d399' },
  { min: 50,  label: 'C+',  color: '#6ee7b7' },
  { min: 45,  label: 'C',   color: '#a3e635' },
  { min: 40,  label: 'D+',  color: '#facc15' },
  { min: 35,  label: 'D',   color: '#fb923c' },
  { min: 30,  label: 'E+',  color: '#f87171' },
  { min: 25,  label: 'E',   color: '#f43f5e' },
  { min: 20,  label: 'F+',  color: '#9ca3af' },
  { min: 0,   label: 'F',   color: '#6b7280' },
]

export function getRankFromMedia(media) {
  return RANKS.find(r => media >= r.min) ?? RANKS[RANKS.length - 1]
}

// ─── Statistiche base — ordine: M · EQ · F · ES · R ──────────────────────────
export const STATS = [
  { key: 'mobilita',    icon: '', label: 'Mobilità',    unit: 'cm',      test: 'Sit and Reach',         desc: 'Misura la flessibilità della catena posteriore.' },
  { key: 'equilibrio',  icon: '', label: 'Equilibrio',  unit: 'cadute',  test: 'Flamingo Test',         desc: "Numero di volte in cui si perde l'equilibrio in 60 secondi." },
  { key: 'forza',       icon: '', label: 'Forza',       unit: 'kg',      test: 'Dinamometro Hand Grip', desc: 'Misura la forza massima di presa della mano dominante.' },
  { key: 'esplosivita', icon: '', label: 'Esplosività', unit: 'secondi', test: '5 Time Sit to Stand',   desc: 'Tempo per alzarsi e sedersi 5 volte dalla sedia.' },
  { key: 'resistenza',  icon: '', label: 'Resistenza',  unit: 'bpm',     test: 'YMCA Step Test',        desc: 'Frequenza cardiaca al termine del test a gradino YMCA.' },
]

export const STAT_KEYS = STATS.map(s => s.key)

// ─── Classi base — sbloccate con il primo campionamento ──────────────────────
// Requisito: una sola statistica ≥ 65
export const BASE_CLASSES = [
  {
    id:        'guerriero',
    name:      'Guerriero',
    archetype: 'Fighter',
    color:     '#ef4444',
    requires:  { forza: 65 },
    description: 'Forza bruta e potenza fisica. Domina nei test di resistenza muscolare.',
  },
  {
    id:        'danzatore',
    name:      'Danzatore',
    archetype: 'Monk',
    color:     '#8b5cf6',
    requires:  { mobilita: 65 },
    description: 'Flessibilità e controllo del corpo. Mobilità fuori dal comune.',
  },
  {
    id:        'sentinella',
    name:      'Sentinella',
    archetype: 'Ranger',
    color:     '#10b981',
    requires:  { equilibrio: 75 },
    description: 'Stabilità e propriocezione eccellenti. Controllo posturale avanzato.',
  },
  {
    id:        'velocista',
    name:      'Velocista',
    archetype: 'Rogue',
    color:     '#f59e0b',
    requires:  { esplosivita: 65 },
    description: 'Potenza esplosiva e reattività. Scatto e accelerazione come punti di forza.',
  },
  {
    id:        'corridore',
    name:      'Corridore',
    archetype: 'Barbarian',
    color:     '#3b82f6',
    requires:  { resistenza: 65 },
    description: 'Resistenza cardiovascolare d\'élite. Capace di sostenere sforzi prolungati.',
  },
]

// ─── SPEC (multiclasse) — sbloccate quando più statistiche superano la soglia ─
export const SPECS = [
  {
    id:        'predatore',
    name:      'Predatore',
    archetype: 'Berserker',
    color:     '#dc2626',
    requires:  { forza: 65, esplosivita: 65 },
    description: 'Combina forza esplosiva e potenza muscolare. Eccelle in sport di contatto e atletica.',
    tests: [
      { key: 'vertical_jump',   label: 'Vertical Jump',        unit: 'cm',      desc: 'Altezza salto verticale da fermo. Misura la potenza esplosiva degli arti inferiori.' },
      { key: 'broad_jump',      label: 'Broad Jump',           unit: 'cm',      desc: 'Salto in lungo da fermo. Valuta forza esplosiva orizzontale.' },
      { key: 'medball_throw',   label: 'Medicine Ball Throw',  unit: 'cm',      desc: 'Lancio palla medica 3kg da seduto. Misura la potenza esplosiva del tronco e degli arti superiori.' },
    ],
  },
  {
    id:        'acrobata',
    name:      'Acrobata',
    archetype: 'Bladedancer',
    color:     '#7c3aed',
    requires:  { mobilita: 65, equilibrio: 75 },
    description: 'Mobilità e controllo neuromuscolare combinati. Profilo ideale per ginnastica e arti marziali.',
    tests: [
      { key: 'y_balance',       label: 'Y-Balance Test',               unit: '%',       desc: 'Media dei 3 raggi (anteriore, postero-mediale, postero-laterale) normalizzata sulla lunghezza dell\'arto. Valuta stabilità dinamica.' },
      { key: 'leg_raise',       label: 'Active Straight Leg Raise',    unit: 'gradi',   desc: 'Gradi di escursione dell\'anca a gamba estesa. Misura flessibilità ischio-crurali e mobilità dell\'anca.' },
      { key: 'shoulder_mob',    label: 'Shoulder Mobility',            unit: 'cm',      desc: 'Distanza tra i pugni dietro la schiena (spalla interna-rotazione + spalla esterna-rotazione). Valuta mobilità scapolo-omerale.' },
    ],
  },
  {
    id:        'guerriero_elite',
    name:      'Guerriero d\'Élite',
    archetype: 'Champion',
    color:     '#b45309',
    requires:  { forza: 70, resistenza: 65 },
    description: 'Forza e resistenza in simbiosi. Il profilo del atleta funzionale completo.',
    tests: [
      { key: 'chair_stand_30',  label: '30s Chair Stand',              unit: 'reps',    desc: 'Ripetizioni di alzata dalla sedia in 30 secondi. Valuta forza funzionale degli arti inferiori e resistenza muscolare.' },
      { key: 'isometric_pull',  label: 'Isometric Mid-Thigh Pull',     unit: 'kg',      desc: 'Forza isometrica massima misurata con dinamometro in posizione di stacco a metà coscia. Forza massimale del sistema.' },
      { key: 'walk_6min',       label: '6-Minute Walk Test',           unit: 'm',       desc: 'Distanza percorsa a passo sostenuto in 6 minuti. Standard clinico per capacità aerobica funzionale.' },
    ],
  },
  {
    id:        'fantasma',
    name:      'Fantasma',
    archetype: 'Shadow',
    color:     '#0891b2',
    requires:  { equilibrio: 75, esplosivita: 65 },
    description: 'Agilità e controllo del corpo in movimento. Profilo da sport di squadra e arti marziali.',
    tests: [
      { key: 'single_leg_hop',  label: 'Single Leg Hop',               unit: 'cm',      desc: 'Salto monopodalico per distanza, atterraggio stabile per 3 secondi. Valuta potenza e controllo monopodalico.' },
      { key: 'star_excursion',  label: 'Star Excursion Balance',       unit: '%',       desc: 'Punteggio composito normalizzato: media di 8 direzioni di reach in equilibrio monopodalico. Valuta stabilità dinamica avanzata.' },
      { key: 't_test',          label: 'Reactive Agility T-Test',      unit: 'secondi', desc: 'Tempo su percorso a T (9m avanti, 4.5m laterale dx, 9m laterale sx, 4.5m laterale dx, 9m indietro) con stimolo visivo reattivo.' },
    ],
  },
  {
    id:        'maratoneta',
    name:      'Maratoneta',
    archetype: 'Endurance Master',
    color:     '#059669',
    requires:  { resistenza: 70, mobilita: 60 },
    description: 'Resistenza aerobica e mobilità funzionale. Il profilo dell\'atleta di endurance.',
    tests: [
      { key: 'walk_2km',        label: '2km Walk Test',                unit: 'secondi', desc: 'Tempo di percorrenza di 2km a passo sostenuto. Indice validato di capacità aerobica submassimale.' },
      { key: 'ruffier',         label: 'Ruffier-Dickson Index',        unit: 'punti',   desc: 'Indice da 30 squat in 45 secondi + misura FC a riposo, post-sforzo, dopo 1 min recupero. Valori bassi = ottima capacità di recupero cardiovascolare.' },
      { key: 'thomas_test',     label: 'Hip Flexor Mobility',          unit: 'gradi',   desc: 'Thomas Test modificato: angolo di deficit del flessore dell\'anca in posizione supina con gamba opposta al petto. Valuta retrazione del m. ileopsoas.' },
    ],
  },
  {
    id:        'titano',
    name:      'Titano',
    archetype: 'Juggernaut',
    color:     '#92400e',
    requires:  { forza: 75, equilibrio: 70 },
    description: 'Forza massimale e stabilità strutturale. Profilo da sport di forza e powerlifting funzionale.',
    tests: [
      { key: 'farmers_walk',    label: "Farmer's Walk",                unit: 'kg',      desc: 'Peso massimo trasportabile per 10 metri in sicurezza. Valuta forza di presa, stabilità del core e resistenza muscolare.' },
      { key: 'pistol_squat',    label: 'Single Leg Squat',             unit: 'reps',    desc: 'Ripetizioni complete di squat monopodalico (pistol squat) per lato. Valuta forza funzionale, mobilità e controllo motorio.' },
      { key: 'back_scratch',    label: 'Back Scratch Test',            unit: 'cm',      desc: 'Differenza di altezza tra i due lati nel test di raggiungimento dietro la schiena. Valuta asimmetrie di mobilità scapolo-omerale.' },
    ],
  },
  {
    id:        'artista_marziale',
    name:      'Artista Marziale',
    archetype: 'Martial Artist',
    color:     '#be185d',
    requires:  { mobilita: 70, forza: 60, equilibrio: 70 },
    description: 'Mobilità, forza e controllo integrati. Il profilo più tecnico e completo.',
    tests: [
      { key: 'rotational_power',label: 'Rotational Power Test',        unit: 'cm',      desc: 'Lancio rotazionale palla medica 2kg da posizione in piedi. Valuta la potenza rotatoria del tronco e la coordinazione segmentaria.' },
      { key: 'wall_squat',      label: 'Wall Squat Test',              unit: 'gradi',   desc: 'Angolo del ginocchio al punto più basso dello squat con schiena al muro e talloni a 30cm. Valuta mobilità di caviglia e anche.' },
      { key: 'stork_reach',     label: 'Stork Balance + Reach',        unit: 'cm',      desc: 'Distanza massima di reach con il piede in equilibrio monopodalico. Combina equilibrio statico avanzato e mobilità funzionale.' },
    ],
  },
  {
    id:        'atleta_completo',
    name:      'Atleta Completo',
    archetype: 'Paladin',
    color:     '#d97706',
    requires:  { forza: 55, mobilita: 55, equilibrio: 65, esplosivita: 55, resistenza: 55 },
    description: 'Eccellenza in tutte le dimensioni della fitness. Il profilo più raro e ambito.',
    tests: [
      { key: 'illinois',        label: 'Illinois Agility Test',        unit: 'secondi', desc: 'Tempo su percorso a slalom con cambio di direzione (10x5m). Test di riferimento per agilità, velocità e coordinazione.' },
      { key: 'beep_test',       label: 'Beep Test (20m Shuttle Run)',  unit: 'livello', desc: 'Livello raggiunto nel test di corsa navetta progressiva. Standard internazionale per la capacità aerobica massimale.' },
      { key: 'ohsquat_depth',   label: 'Overhead Squat Depth',         unit: 'cm',      desc: 'Distanza dal pavimento al punto più basso dei glutei durante uno squat con braccia alzate. Misura mobilità globale del sistema.' },
    ],
  },
]

// ─── Utilities classi e SPEC ──────────────────────────────────────────────────

/**
 * Ritorna le classi base sbloccate dato un oggetto stats { forza, mobilita, ... }
 */
export function getUnlockedClasses(stats = {}) {
  return BASE_CLASSES.filter(cls =>
    Object.entries(cls.requires).every(([key, threshold]) => (stats[key] ?? 0) >= threshold)
  )
}

/**
 * Ritorna le SPEC sbloccate dato un oggetto stats
 */
export function getUnlockedSpecs(stats = {}) {
  return SPECS.filter(spec =>
    Object.entries(spec.requires).every(([key, threshold]) => (stats[key] ?? 0) >= threshold)
  )
}

/**
 * Ritorna tutte le SPEC che potrebbero sbloccarsi migliorando le statistiche attuali.
 * Utile per suggerire obiettivi al cliente.
 * threshold: quanto manca per ogni requisito non soddisfatto
 */
export function getSuggestedSpecs(stats = {}, maxGap = 20) {
  return SPECS
    .filter(spec => {
      const gaps = Object.entries(spec.requires)
        .filter(([key, threshold]) => (stats[key] ?? 0) < threshold)
        .map(([key, threshold]) => threshold - (stats[key] ?? 0))
      return gaps.length > 0 && Math.max(...gaps) <= maxGap
    })
    .map(spec => ({
      ...spec,
      gaps: Object.entries(spec.requires)
        .filter(([key, threshold]) => (stats[key] ?? 0) < threshold)
        .map(([key, threshold]) => ({ stat: key, missing: threshold - (stats[key] ?? 0) })),
    }))
}

// ─── Categorie e defaults ─────────────────────────────────────────────────────
export const CATEGORIE = ['Agonista', 'Amatoriale', 'Fragile']

export const NEW_CLIENT_DEFAULTS = {
  level:       1,
  rank:        'F',
  rankColor:   '#6b7280',
  xp:          0,
  xpNext:      700,
  stats:       { mobilita: 0, equilibrio: 0, forza: 0, esplosivita: 0, resistenza: 0 },
  classes:     [],   // classi base sbloccate [ { id, unlockedAt } ]
  specs:       [],   // SPEC sbloccate [ { id, unlockedAt, tests: {} } ]
  badges:      ['New Challenger'],
  log:         [],
  campionamenti: [],
}

export const XP_PER_LEVEL_MULTIPLIER = 1.3
export const LOG_MAX_ENTRIES         = 20
export const LEVEL_PER_RANK          = 4
