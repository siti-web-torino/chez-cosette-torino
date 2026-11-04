import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

// Vercel pubblica solo i file statici usati dal sito.
const root=path.dirname(fileURLToPath(import.meta.url));
const output=path.join(root,'dist');
const files=['index.html','style.css','creative.css','site.js','interactions.js',
 'assets/bodoni.ttf','assets/bodonimoda-OFL.txt','assets/jost.ttf','assets/jost-OFL.txt',
 'assets/logo-originale.png','assets/facciata-senza-auto.webp','assets/sala-ritoccata.webp'];

// Rifiuta un collegamento o una cartella inattesa prima di scrivere l'output.
try{const info=await fs.lstat(output);if(!info.isDirectory()||info.isSymbolicLink())throw Error('dist deve essere una cartella normale');}catch(error){if(error.code!=='ENOENT')throw error;}
await fs.mkdir(output,{recursive:true});
// Pulisce gli output obsoleti mantenendo stabile la cartella dell'anteprima.
for(const entry of await fs.readdir(output)){
 await fs.rm(path.join(output,entry),{recursive:true,force:true});
}
for(const file of files){
 const destination=path.join(output,file);
 await fs.mkdir(path.dirname(destination),{recursive:true});
 await fs.copyFile(path.join(root,file),destination);
}
console.log(`Build statico pronto: ${files.length} file in dist/`);
