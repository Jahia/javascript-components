#!/usr/bin/env node
const rollup = require('rollup');
const babel = require('@babel/core');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const fx = require('mkdir-recursive');
var UglifyJS = require("uglify-js");

let code = babel.transformFileSync('./rollup.config.js',  {presets: ['@babel/env']}).code;
let config = eval(code);

let {output: outputOptions, ...inputOptions} = config;

async function build() {
    const bundle = await rollup.rollup(inputOptions);
    await bundle.generate(outputOptions);
    await bundle.write(outputOptions);
    console.log(bundle);

    // var code = "function add(first, second) { return first + second; }";

    let result = UglifyJS.minify(code);

    console.log(result.code);
}

build();

