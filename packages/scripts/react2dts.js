#!/usr/bin/env node
const fs = require('fs');
const {generateFromFile} = require('react-to-typescript-definitions');

function dtsGen(source) {
    const target = source.slice(0, -4) + '.d.ts';
    fs.writeFileSync(target, generateFromFile(null, source));
    console.log(`Generated ${target}`);
}

dtsGen(process.argv[2]);
