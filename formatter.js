import * as pretty from '@rdfjs-elements/formats-pretty';
import * as plain from '@rdfjs/formats-common';

import { createReadStream, createWriteStream } from 'fs';
import { RdfaParser } from 'rdfa-streaming-parser';

/**
 * A map of all supported extensions and their mapping to 
 * supported mimetypes for RDF conversion
 */
export const EXTENSION_MAPPING = {
  'json-ld': 'application/ld+json',
  jsonld: 'application/ld+json',
  json: 'application/ld+json',
  nt: 'application/n-triples',
  nq: 'application/n-quads',
  n3: 'text/n3',
  owl: 'application/rdf+xml',
  rdf: 'application/rdf+xml',
  xml: 'application/rdf+xml',
  trig: 'application/trig',
  turtle: 'text/turtle',
  ttl: 'text/turtle',
  html: 'text/html',
  htm: 'text/html'
};


// Add RDFa parsers
plain.parsers.set('text/html', new RdfaParser({ baseIRI: 'http://example.com', contentType: 'text/html' }));
pretty.default.parsers.set('text/html', new RdfaParser({ baseIRI: 'http://example.com', contentType: 'text/html' }));

/**
 * A set of all supported mimetypes
 */
export const SUPPORTED_MIMETYPES = new Set(Object.values(EXTENSION_MAPPING));

/**
 * Given a fileName, guess it's mimetype
 *
 * @param {*} fileName the filename to check
 * @returns the associated mimetype or undefined
 */
export function guessFormat(fileName) {
  const ext = fileName.split('.').slice(-1)[0];
  return EXTENSION_MAPPING[ext];
}

/**
 * Converts an input rdf file to an output rdf file. Guesses mimetype based on extension.
 *
 * @param {string} inputFile the input file to convert
 * @param {string} outputFile the output file to create
 * @param {object} prefixes an optional dictionary of prefixes to use when creating the output
 */
export async function rdfGuessAndFormat(inputFile, outputFile, prefixes = {}) {
  const inputFormat = guessFormat(inputFile);
  const outputFormat = guessFormat(outputFile);
  await rdfFormatter(inputFile, inputFormat, outputFile, outputFormat, prefixes);
}

/**
 * Converts an input rdf file to an output rdf file
 *
 * @param {string} inputFile the input file to convert, '-' reads from stdin
 * @param {string} inputFormat the mimetype of the input file
 * @param {string} outputFile the output file to create, '-' writes to stdout
 * @param {string} outputFormat the mimetype of the output file
 * @param {object} prefixes an optional dictionary of prefixes to use when creating the output
 * @param {boolean} [prettyPrint=true] pretty print the output, defaults to true
 */
export async function rdfFormatter(inputFile, inputFormat, outputFile, outputFormat, prefixes = {}, prettyPrint = true) {
  // Choose the right formatter
  const formats = prettyPrint ? pretty.default : plain;

  if (outputFormat === 'text/html') {
    console.error('text/html (RDFa) is not supported as an output format at this time.');
    process.exit(-1);
  }

  // Create read and write streams from given files
  const readStream = inputFile === '-' ? process.stdin : createReadStream(inputFile);
  const writeStream = outputFile === '-' ? process.stdout : createWriteStream(outputFile);

  // Create parser to read and parse the inputFile
  const parser = formats.parsers.import(inputFormat, readStream);

  // Create serializer to serialize the parsed RDF data
  const serializer = formats.serializers.import(outputFormat, parser, { prefixes });

  // Pipe the output of the serializer to the outputFile
  serializer.pipe(writeStream);
}
