# Chez Cosette · Torino

Proposta indipendente di sito vetrina per un café bistrot francese in via Saluzzo 32, Torino. **Non è il sito ufficiale e non implica un incarico da parte dell’attività.**

Il progetto riprende il rosso della facciata, il blu fiordaliso del marchio, le tende a righe e le insegne parigine. Comprende presentazione, sala, due riquadri separati per salato e dolce, foto ingrandibili, orari e indicazioni.

## Anteprima locale

Richiede Node.js 18 o successivo. Non servono dipendenze da installare.

```sh
npm start
```

Aprire `http://127.0.0.1:4173`. Il server ascolta solo sul computer locale. In alternativa, aprire `index.html` direttamente nel browser. Il sito può essere servito da un normale hosting statico.

```sh
npm run check
```

Controlla la sintassi dei file JavaScript. Le verifiche di impaginazione e interazione vanno effettuate nel browser.

## Contenuti provvisori

- Le immagini dei piatti sono segnaposto generati con IA e non rappresentano le preparazioni effettive del locale.
- Le fotografie del locale fornite come riferimento sono state ritoccate con IA. Vanno sostituite con originali autorizzati prima dell’uso definitivo.
- Testi, ingredienti indicativi, menu, orari e dati dell’attività devono essere confermati dal titolare.
- Il sito mantiene `noindex,nofollow` durante la fase di proposta.
- Nessun modulo invia prenotazioni o messaggi. Il pulsante delle indicazioni apre Google Maps.

Logo e materiali di riferimento restano dei rispettivi titolari: la presenza nel repository non concede una licenza sulle immagini o sul marchio. Bodoni Moda e Jost sono distribuiti con le licenze SIL Open Font License incluse in `assets/`.

## Struttura

`index.html` contiene i testi; `style.css` la composizione di base; `creative.css` la direzione visiva aggiunta; `site.js` le entrate delle sezioni; `interactions.js` la navigazione e il dialogo delle foto. Gli asset ottimizzati WebP e i font sono nella cartella `assets/`.

Il repository pubblica il codice della proposta. La creazione del repository non pubblica automaticamente un sito web.
