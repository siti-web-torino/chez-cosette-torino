# Chez Cosette · Torino

Sito vetrina per il café bistrot francese di Via Saluzzo 32, San Salvario, Torino. La direzione visiva riprende i bistrot parigini e i salotti letterari: carta avorio e crema, bordeaux, blu fiordaliso e filetti in ottone.

## Sviluppo e pubblicazione

Node.js 24; nessuna dipendenza da installare.

```sh
npm start
npm run check
npm run build
```

Il server locale risponde su `http://127.0.0.1:4173`. `npm run check` verifica la sintassi JavaScript. `npm run build` rigenera `dist/` con i soli file effettivamente utilizzati, escludendo le vecchie immagini segnaposto dei piatti. Il progetto Vercel esistente usa `vercel.json` e pubblica `dist/` a ogni aggiornamento di `main`.

## Contenuti e struttura

- `index.html`: hero con facciata ad arco, sala, menu a due colonne, tre momenti della giornata, storia del nome e cartolina con indirizzo.
- `style.css`: palette, tipografia Bodoni/Jost, cornici, layout e versioni responsive.
- `creative.css`: tenda bordeaux e crema, ornamenti e finitura della carta.
- `interactions.js`: menu mobile accessibile e navigazione tra le sezioni.
- `site.js`: animazioni discrete con rispetto di `prefers-reduced-motion`; i testi sono sempre visibili anche senza animazioni.

Prenotazioni e informazioni sul brunch rimandano a [@chez_cosette_bistrot](https://www.instagram.com/chez_cosette_bistrot). Le indicazioni aprono Google Maps. Orari, valutazione e numero di recensioni sono i dati forniti nel brief del restyling: vanno aggiornati nel testo quando cambiano. Non è presente un sistema automatico di prenotazione.

La facciata compare una sola volta nella hero; la sala una sola volta nella sezione bistrot. I cinque asset indicati nel brief sono conservati senza modifiche. Le vecchie immagini illustrative dei piatti restano nell’archivio sorgente ma non sono referenziate né pubblicate.

## Materiali

Il sito mantiene `noindex,nofollow` della versione precedente. Le fotografie del locale sono i materiali ritoccati già presenti nel progetto. Logo e immagini restano dei rispettivi titolari; la presenza nel repository non concede una licenza sul marchio o sulle fotografie. Le licenze SIL Open Font License di Bodoni Moda e Jost sono incluse in `assets/`.
