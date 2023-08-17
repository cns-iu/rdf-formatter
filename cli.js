#!/usr/bin/env node

import { Command } from 'commander';
import { existsSync, readFileSync } from 'fs';
import { EXTENSION_MAPPING, SUPPORTED_MIMETYPES, guessFormat, rdfFormatter } from './formatter.js';

/**
 * Normalize mimetype based on filename if no mimetype is given. Checks against
 * supported mimetypes and exits the program if not found.
 *
 * @param {string} fileName the filename
 * @param {string} mimeType a mimetype, otherwise guessed from fileName
 * @returns the mimetype or undefined
 */
function normalizeMimeType(fileName, mimeType) {
  if (!mimeType) {
    mimeType = guessFormat(fileName);
    if (!mimeType) {
      console.error('Unable to determine mimetype of input file based on extension.');
      process.exit(-1);
    }
  }
  if (!SUPPORTED_MIMETYPES.has(mimeType)) {
    console.error(`Unsupported mimetype ${mimeType}.`);
    process.exit(-1);
  }
  return mimeType;
}

const extensionsTable =
  'Extension\tMimetype\n' +
  Object.entries(EXTENSION_MAPPING)
    .map(([ext, mimeType]) => {
      if (ext.length < 7) {
        return `.${ext}\t\t${mimeType}`;
      } else {
        return `.${ext}\t${mimeType}`;
      }
    })
    .join('\n');

// Our CLI Program
const program = new Command();

program
  .name('rdf-formatter')
  .description(`A CLI for converting between RDF formats\n\nSupported RDF formats: \n\n${extensionsTable}`)
  .argument('<inputFile>', 'The input file in an RDF format, use - for stdin')
  .argument('<outputFile>', 'The output file in an RDF format, use - for stdout')
  .option('-i, --input-type <inputFormat>', 'Input RDF format mimetype, will guess from file extension otherwise.')
  .option('-o, --output-type <outputFormat>', 'Output RDF format mimetype, will guess from file extension otherwise.')
  .option('--prefixes <prefixFile>', 'JSON file with prefixes to use in formatting')
  .option('--ns [prefix...]', 'Add an individual namespace prefix using format: prefixname=http://ex.com/')
  .option('--pretty', 'Use pretty print formatting')
  .action((inputFile, outputFile, { inputType, outputType, prefixes, ns, pretty }) => {
    // Normalize input and output mimetypes
    inputType = normalizeMimeType(inputFile, inputType);
    outputType = normalizeMimeType(outputFile, outputType);

    // Create prefixes object
    if (prefixes && existsSync(prefixes)) {
      prefixes = JSON.parse(readFileSync(prefixes).toString());
    } else {
      prefixes = {};
    }
    if (ns?.length > 0) {
      for (const prefixString of ns) {
        const prefixAndString = prefixString.split('=');
        if (prefixAndString.length > 2) {
          prefixes[prefixAndString[0]] = prefixAndString.slice(1).join('=');
        }
      }
    }

    // Determine whether to pretty print
    const prettyPrint = pretty === true;

    // Convert!
    rdfFormatter(inputFile, inputType, outputFile, outputType, prefixes, prettyPrint);
  });

program.parse(process.argv);
