# rdf-formatter

A CLI for converting between RDF formats. RDF Formatter uses the parsers and serializers available in [@rdfjs-elements/formats-pretty](https://www.npmjs.com/package/@rdfjs-elements/formats-pretty), [@rdfjs/formats-common](https://www.npmjs.com/package/@rdfjs/formats-common), and [rdfa-streaming-parser](https://www.npmjs.com/package/rdfa-streaming-parser) to make a unix command-line friendly CLI application. See [Usage](#usage) below for supported RDF formats.

[![npm version](https://badge.fury.io/js/rdf-formatter.svg)](https://badge.fury.io/js/rdf-formatter) ![npm](https://img.shields.io/npm/l/rdf-formatter)

## Installation

You can install globally via npm: `npm install -g rdf-formatter`. Afterwards, the `rdf-formatter` CLI will be available on command-line.

## Usage

```bash
Usage: rdf-formatter [options] <inputFile> <outputFile>

A CLI for converting between RDF formats

Supported RDF formats:

Extension       Mimetype
.json-ld        application/ld+json
.jsonld         application/ld+json
.json           application/ld+json
.nt             application/n-triples
.nq             application/n-quads
.n3             text/n3
.owl            application/rdf+xml
.rdf            application/rdf+xml
.xml            application/rdf+xml
.trig           application/trig
.turtle         text/turtle
.ttl            text/turtle
.html           text/html (RDFa - only as an input format)
.htm            text/html (RDFa - only as an input format)

Arguments:
  inputFile                         The input file in an RDF format, use - for stdin
  outputFile                        The output file in an RDF format, use - for stdout

Options:
  -i, --input-type <inputFormat>    Input RDF format mimetype, will guess from file extension otherwise.
  -o, --output-type <outputFormat>  Output RDF format mimetype, will guess from file extension otherwise.
  --prefixes <prefixFile>           JSON file with prefixes to use in formatting
  --ns [prefix...]                  Add an individual namespace prefix using format: prefixname=http://ex.com/
  --pretty                          Use pretty print formatting
  -h, --help                        display help for command
```
