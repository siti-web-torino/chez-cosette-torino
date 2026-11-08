# Chez Cosette · Torino

Sito vetrina per il café bistrot francese di Via Saluzzo 32, San Salvario, Torino. La direzione visiva riprende i bistrot parigini e i salotti letterari: carta avorio e crema, bordeaux, blu fiordaliso e filetti in ottone.

## Sviluppo e pubblicazione

Node.js 24; nessuna dipendenza da installare.

```sh
npm start
npm run check
npm test
npm run build
```

Il server locale risponde su `http://127.0.0.1:4173`. `npm run check` verifica la sintassi JavaScript. `npm run build` rigenera `dist/` con i soli file effettivamente utilizzati, escludendo le vecchie immagini segnaposto dei piatti. Il progetto Vercel esistente usa `vercel.json` e pubblica `dist/` a ogni aggiornamento di `main`.

## Contenuti e struttura

- `index.html`: hero con facciata ad arco, sala, menu a due colonne, tre momenti della giornata, storia del nome e cartolina con indirizzo.
- `style.css`: palette, tipografia Bodoni/Jost, cornici, layout e versioni responsive.
- `creative.css`: sipario bordeaux, scenografia della hero, ornamenti, dettagli interattivi e finitura della carta. Su mobile la fotografia segue subito il titolo.
- `interactions.js`: menu mobile accessibile, focus da tastiera e navigazione tra le sezioni. Senza JavaScript i link del menu restano disponibili.
- `site.js`: apertura di 1,65 secondi, titoli in sequenza, ingressi in scroll, lieve profondità fotografica e indicatore di lettura. Nessuna libreria aggiuntiva.
- `tests/motion.test.mjs`: otto test Node sui comportamenti dell’intro, sulle preferenze di movimento e sui fallback; non sostituiscono il controllo grafico nel browser.

## Movimento e accessibilità

Il sipario compare una volta per sessione, non attende immagini o font e si può rivedere con «Rivedi l’apertura». Un link diretto a una sezione o una posizione di scroll ripristinata evita l’intro. «Passa al bistrot», tastiera, scroll e tocco la interrompono immediatamente. Un limite CSS indipendente impedisce che il sipario rimanga visibile se JavaScript si interrompe. Nessun blocco dello scroll o cursore personalizzato.

`prefers-reduced-motion: reduce` disattiva intro, animazioni in scroll, inclinazione, parallasse e trasformazioni interattive; la preferenza viene rispettata anche se cambia durante la visita. I contenuti sono visibili senza JavaScript, IntersectionObserver o Web Animations API. I movimenti fotografici sono limitati, aggiornati con un solo frame per evento e sospesi fuori dallo schermo; non ci sono animazioni decorative infinite.

Prenotazioni e informazioni sul brunch rimandano a [@chez_cosette_bistrot](https://www.instagram.com/chez_cosette_bistrot). Le indicazioni aprono Google Maps. Orari, valutazione e numero di recensioni sono i dati forniti nel brief del restyling: vanno aggiornati nel testo quando cambiano. Non è presente un sistema automatico di prenotazione.

La facciata compare una sola volta nella hero; la sala una sola volta nella sezione bistrot. I cinque asset indicati nel brief sono conservati senza modifiche. Le vecchie immagini illustrative dei piatti restano nell’archivio sorgente ma non sono referenziate né pubblicate.

## Materiali

Il sito mantiene `noindex,nofollow` della versione precedente. Le fotografie del locale sono i materiali ritoccati già presenti nel progetto. Logo e immagini restano dei rispettivi titolari; la presenza nel repository non concede una licenza sul marchio o sulle fotografie. Le licenze SIL Open Font License di Bodoni Moda e Jost sono incluse in `assets/`.
