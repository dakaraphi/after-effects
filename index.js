'use strict';

const fs = require('fs');
const path = require('path');
const afterEffectsExecutor = require('./lib/process-execution.js');
const makeTransformGenerator = require('./lib/script-transform-generator').makeTransformGenerator;

const Tail = require('tail').Tail;

const options = {
    afterEffectsPath: null,
    includes: [
        path.join(__dirname, '/lib/includes/es5-shim.jsx'),
        path.join(__dirname, '/lib/includes/es6-shim.js'),
        path.join(__dirname, '/lib/includes/json2.js'),
        path.join(__dirname, '/lib/includes/ae-lib.js'),
    ]
};

function tailLogToConsole() {
    const logFile = path.join(process.cwd(), "after_effects-script.log")
    console.log('creating log file: ' + logFile)
    fs.writeFileSync(logFile, '') // create or clear previous log
    const tailOptions = { fromBeginning: true }
    const tail = new Tail(logFile, tailOptions);

    tail.on("line", function (data) {
        console.log(data);
    });

    tail.on("error", function (error) {
        console.log('ERROR: ', error);
    });

    return tail;
}

function executeSync(afterEffectsFn, ...parameters) {

    const tail = tailLogToConsole()

    const transformGenerator = makeTransformGenerator(afterEffectsFn, parameters, options)
    const scriptContent = transformGenerator.makeSource();
    const scriptFile = transformGenerator.generatedScriptFile();
    const resultFile = transformGenerator.resultsFile();

    try {
        console.log('Created script for execution: ' + scriptFile)
        fs.writeFileSync(scriptFile, scriptContent, 'utf-8');
    } catch (err) {
        throw Error('Could not create jsx script for execution. Check permissions.');
    }

    afterEffectsExecutor.executeSync(scriptFile, options);

    const results = require(resultFile);
    attachLineInfoOnError(results, scriptFile)
    closeLogWatcher(tail)

    return results;
}

function closeLogWatcher(tail) {
    setTimeout(() => tail.unwatch(), 2000)
}

function readLineOfFile(file, lineNumber) {
    const lines = fs.readFileSync(file, 'utf-8').split(/\r?\n/);
    let lineCount = 1
    for (const line of lines) {
        if (lineCount++ === lineNumber) return line
    }
    return null
}

function attachLineInfoOnError(results, file) {
    if (!results || results.result !== 'ERROR') return
    const lineText = readLineOfFile(file, results.line)
    results.lineText = lineText;
}


module.exports = function () {
    return executeSync.apply(null, arguments);
};

module.exports.executeSync = executeSync;
module.exports.options = options;