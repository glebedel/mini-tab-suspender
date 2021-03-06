import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const scriptFile = 'dist/index.js';
const templateFile = 'tools/tampermonkey.hbs';
const outputFile = 'dist/tampermonkey.js';

// Get the template tampermonkey file in which we'll insert the built script
const template = readFileSync(path.join(__dirname, '..', templateFile));

// Get the content of the built script
const script = readFileSync(path.join(__dirname, '..', scriptFile));

// Template in the built script in the Tampermonkey template
const outputString = template.toString().replace('{{script}}', script.toString());

// Output the result in a file
writeFileSync(outputFile, outputString);
