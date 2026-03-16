/**
 * Guide dettagliate per l'esecuzione dei test base.
 * Ogni guida include: descrizione, attrezzatura, riscaldamento,
 * protocollo passo-passo, note su come registrare il dato.
 */
export const TEST_GUIDES = {

  mobilita: {
    name:      'Sit and Reach',
    stat:      'Mobilità',
    unit:      'cm',
    duration:  '10 minuti',
    equipment: ['Panca o cassetta sit-and-reach (o metro a nastro + nastro adesivo sul pavimento)'],
    warmup: [
      'Camminata lenta 3 minuti',
      'Rotazioni del busto 10 ripetizioni per lato',
      'Stretching dinamico degli ischio-crurali: leg swing avanti-indietro 10 per lato',
      'Flessione in piedi con ginocchia morbide: 5 respiri profondi',
    ],
    protocol: [
      'Il cliente si siede sul pavimento a gambe estese e unite, piedi perpendicolari al pavimento (90°) contro la cassetta o il nastro di riferimento (zero = punta dei piedi).',
      'Mani sovrapposte, palmo contro il dorso della mano opposta, dita allineate.',
      'Inspirare profondamente. Nell\'espirazione, flettere lentamente il busto in avanti mantenendo le ginocchia a contatto con il suolo.',
      'Raggiungere la posizione massima e MANTENERLA per almeno 2 secondi prima di leggere il valore.',
      'Eseguire 3 tentativi con 30 secondi di recupero tra uno e l\'altro.',
      'Registrare il VALORE MIGLIORE dei 3 tentativi.',
    ],
    notes: [
      'Valori positivi = oltre la punta dei piedi. Valori negativi = non si raggiunge la punta.',
      'Il dato registrato è il migliore dei 3 tentativi, non la media.',
      'Il soggetto non deve fare rimbalzi o movimenti a molla: solo flessione controllata.',
    ],
  },

  equilibrio: {
    name:      'Flamingo Test',
    stat:      'Equilibrio',
    unit:      'n° cadute in 60s',
    duration:  '15 minuti',
    equipment: ['Cronometro', 'Tappetino (opzionale, consigliato per uniformità)', 'Area libera 2x2m'],
    warmup: [
      'Camminata su linea retta 2 minuti',
      'Stazione su un piede per lato 3 × 20 secondi',
      'Rotazioni caviglia 10 per lato',
    ],
    protocol: [
      'Il cliente si posiziona su un piede (piede nudo sul tappetino, se disponibile), con l\'altra gamba flessa a 90° e tenuta con la mano ipsilaterale.',
      'Mani sui fianchi (non tenere la gamba flessa durante il test ufficiale).',
      'Al via del cronometro, mantenere l\'equilibrio per 60 secondi.',
      'Ogni volta che il piede di supporto tocca il suolo, o la posizione si perde, si conta una CADUTA. Il cronometro NON si ferma.',
      'Eseguire 2 tentativi per piede destro e 2 per piede sinistro (4 tentativi totali).',
      'Registrare il VALORE MIGLIORE (numero di cadute più basso) tra i 4 tentativi.',
    ],
    notes: [
      'Meno cadute = punteggio migliore (statistica inversa).',
      'Se il soggetto non cade mai nei 60s, il valore è 0 — punteggio perfetto.',
      'Attendere almeno 30 secondi tra un tentativo e l\'altro.',
      'Piedi nudi per uniformità tra le sessioni di campionamento.',
    ],
  },

  forza: {
    name:      'Dinamometro Hand Grip',
    stat:      'Forza',
    unit:      'kg',
    duration:  '10 minuti',
    equipment: ['Dinamometro a mano (handgrip dynamometer)', 'Sedia con schienale'],
    warmup: [
      'Apertura e chiusura del pugno 20 volte per mano',
      'Stretching flessori del polso: 30 secondi per lato',
      '1 prova submassimale con ciascuna mano (circa 60% dello sforzo)',
    ],
    protocol: [
      'Il cliente è seduto con la schiena aderente allo schienale, piedi a terra.',
      'Il gomito è flesso a 90°, avambraccio parallelo al suolo, polso in posizione neutra.',
      'Regolare il dinamometro alla dimensione della mano del soggetto (secondo dito in flessione a 90° nella maniglia).',
      'Al segnale, stringere con la forza massima per 3-5 secondi senza muovere il braccio.',
      'Eseguire 3 tentativi per mano alternando (Dx → Sx → Dx → Sx → Dx → Sx) con 60 secondi di recupero tra ogni prova.',
      'Registrare il VALORE MIGLIORE tra tutti i tentativi (indipendentemente dalla mano).',
    ],
    notes: [
      'Non oscillare il braccio o usare il peso corporeo per aumentare la forza.',
      'Il soggetto non deve trattenere il respiro: espirazione durante lo sforzo.',
      'Il valore da registrare è il picco più alto tra tutti i 6 tentativi.',
    ],
  },

  esplosivita: {
    name:      '5 Times Sit to Stand',
    stat:      'Esplosività',
    unit:      'secondi',
    duration:  '10 minuti',
    equipment: ['Sedia standard H=46cm senza braccioli (o con braccioli legati)', 'Cronometro'],
    warmup: [
      'Camminata 2 minuti',
      '5 alzate lente dalla sedia senza cronometro',
      'Stretching quadricipiti 20 secondi per lato',
    ],
    protocol: [
      'Il cliente è seduto al centro della sedia, schiena non appoggiata allo schienale, braccia incrociate sul petto.',
      'Ginocchia flesse a 90°, piedi a larghezza spalle, appoggiati a terra.',
      'Al segnale del cronometro, alzarsi completamente in piedi e risedersi per 5 volte il più velocemente possibile.',
      'Il cronometro si ferma quando il soggetto si siede per la quinta volta.',
      'Eseguire 3 tentativi con 2 minuti di riposo tra uno e l\'altro.',
      'Registrare il TEMPO MIGLIORE dei 3 tentativi.',
    ],
    notes: [
      'Meno secondi = punteggio migliore (statistica inversa).',
      'Il soggetto deve estendere completamente le ginocchia ad ogni alzata.',
      'Non è consentito utilizzare le mani per spingersi dalla sedia.',
      'Se il soggetto perde l\'equilibrio o non estende completamente, il tentativo non è valido.',
    ],
  },

  resistenza: {
    name:      'YMCA Step Test',
    stat:      'Resistenza',
    unit:      'bpm',
    duration:  '8 minuti',
    equipment: ['Step o gradino H=30.5cm (12 pollici)', 'Metronomo (ritmo: 96 bpm = 24 cicli/min)', 'Cronometro', 'Cardiofrequenzimetro o accesso al polso'],
    warmup: [
      'NON eseguire riscaldamento cardiovascolare prima di questo test: altera i risultati.',
      'Misurare la frequenza cardiaca a riposo dopo almeno 5 minuti di seduta tranquilla.',
    ],
    protocol: [
      'Impostare il metronomo a 96 bpm. Ogni 4 battiti = 1 ciclo completo (su-su-giù-giù). Ritmo: 24 cicli al minuto.',
      'Al via, il soggetto sale e scende dallo step al ritmo del metronomo per 3 minuti esatti senza fermarsi.',
      'Schema: piede sx su → piede dx su → piede sx giù → piede dx giù (o speculare).',
      'Immediatamente al termine dei 3 minuti, il soggetto si siede.',
      'Misurare la frequenza cardiaca: contare i battiti per 60 secondi (o 15s × 4) partendo subito dopo la fine del test.',
      'Registrare il valore in BPM.',
    ],
    notes: [
      'Meno bpm = recupero migliore = punteggio migliore (statistica inversa).',
      'Il test misura la FC di RECUPERO al minuto post-esercizio, non quella durante.',
      'Se il soggetto non riesce a mantenere il ritmo per 3 minuti, annotarlo e registrare il dato comunque.',
      'Condizioni ideali: temperatura ambiente 18-22°C, nessun pasto nelle 2 ore precedenti.',
    ],
  },
}
