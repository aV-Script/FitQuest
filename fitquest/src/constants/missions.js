export const DEFAULT_MISSION_TEMPLATES = [
  { id: 'tpl_1', name: '7 giorni consecutivi',       description: 'Allenati 7 giorni di fila senza saltare una sessione.',          xp: 200 },
  { id: 'tpl_2', name: 'Prima sessione cardio',       description: 'Completa la tua prima sessione di allenamento cardio.',          xp: 100 },
  { id: 'tpl_3', name: 'Obiettivo peso',              description: 'Raggiungi il peso target concordato con il trainer.',            xp: 500 },
  { id: 'tpl_4', name: '10 sessioni completate',      description: 'Porta a termine 10 sessioni di allenamento totali.',             xp: 300 },
  { id: 'tpl_5', name: 'Migliora la forza +10%',      description: 'Aumenta il punteggio di Forza di almeno 10 punti.',              xp: 350 },
  { id: 'tpl_6', name: 'Migliora la resistenza +10%', description: 'Aumenta il punteggio di Resistenza di almeno 10 punti.',         xp: 350 },
  { id: 'tpl_7', name: 'Sfida mobilità',              description: 'Raggiungi un punteggio di Mobilità superiore a 50.',             xp: 250 },
  { id: 'tpl_8', name: 'Mese completo',               description: 'Porta a termine tutte le sessioni previste in un mese intero.',  xp: 600 },
]

export const MISSION_STATUS = {
  ACTIVE:    'active',
  COMPLETED: 'completed',
}
