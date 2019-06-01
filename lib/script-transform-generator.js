'use strict';

const fs = require('fs');
const path = require('path');
const is = require('is-explicit').default;
const babel = require('babel-core');

const BabelOptions = {
    presets: [
        require('babel-preset-es2015')
    ],
    plugins: [
        require('babel-plugin-transform-es3-member-expression-literals'),
        require('babel-plugin-transform-es3-property-literals'),
        require('babel-plugin-transform-es5-property-mutators')
    ],
    sourceRoot: __dirname
};

function generatedScriptFile() {
    return path.join(process.cwd(),`after-effects-generated-script.js`);
}

function resultsFile() {
    return path.join(process.cwd(),`after-effects-script-results.json`);
}

function logFile() {
    return path.join(process.cwd(),`after_effects-script.log`);
}

function makeSource(afterEffectsFunctionArguments, code, includes) {
    let args = '';
    if (is(afterEffectsFunctionArguments, Array) && afterEffectsFunctionArguments.length > 0)
        args = JSON.stringify(afterEffectsFunctionArguments);
    args = splitStringIntoLines(args) // split args as lines too long cause issues

    const logPath = logFile().replace(/\\/g, '\\\\')  // must add double backslash as it will be escaped when making the main script string
    const resultFile = resultsFile().replace(/\\/g, '\\\\')  // must add double backslash as it will be escaped when making the main script string
    console.log('Result File: ' + resultFile)

    const includeModuleSource = includes.join(';');
    const source = `
            ${includeModuleSource}
            app.beginUndoGroup('node-script');
            app.beginSuppressDialogs();

            try {
                var log = makeLogger('script logger', '${logPath}');
                var inputFromNode = ${args};
                var scriptResult = ${code}.apply(this, inputFromNode);
                scriptResult = cloneAsSafeValue(scriptResult, 5);

                $.result = scriptResult;
                log.info('script complete')
            } catch (err) {
                if (err.message) {
                    err = {
                        result: 'ERROR',
                        name: err.name,
                        message: err.message,
                        description: err.description,
                        number: err.number,
                        filename: err.fileName,
                        line: err.line
                    }
                }
                $.result = err;
            }

            (function(result){
                var file = File('${resultFile}');
                log.info('result file: ' + file.fsName)
                file.open("w");
                file.write(result);
                file.close();
                delete $.result;
            })(JSON.stringify($.result));

            app.endUndoGroup();
            app.endSuppressDialogs(false);
            log.close();
            `;

    return source;
}

function splitStringIntoLines(string) {
    let result = string.split('}') 
    return result.join('}\n')
}

function transform(code) {
    return babel.transform(code, BabelOptions).code;
}

function transformIncludes(includes) {
    if (!is(includes, Array)) return [];

    return includes.map(file => {
        if (!is(file, String)) return null;
        file = path.resolve(file);
        try {
            fs.accessSync(file, fs.R_OK);
        } catch (err) {
            throw new Error(`Cannot include file at path ${file}, non-existent or can't be read.`);
        }

        let code = fs.readFileSync(file, { encoding: 'utf-8' });

        if (path.extname(file) !== '.jsx') {
            code = transform(code);
        }

        return code;

    }).filter(inc => is(inc, String));
}

function makeTransformGenerator(originalFunction, functionParameters, options) {

    //Babelify function as an expression otherwise it breaks when isolated
    const es3_transformedFunction = transform(`(${originalFunction.toString()})`);

    //Isolate babelified code to just the function expression (remove any babelified includes and the final ;)
    const funcStart = es3_transformedFunction.indexOf('(function');
    const code = es3_transformedFunction.substring(funcStart, es3_transformedFunction.length - 1);

    //Isolate babelified includes (without the 'use strict' cause AE doesn't use it)
    const babelIncludes = es3_transformedFunction.substring(0, funcStart).replace('"use strict";\n', '');

    const includes = [...transformIncludes(options.includes), babelIncludes];

    return {
        options,
        code,
        includes,
        generatedScriptFile,
        resultsFile,
        makeSource: () => makeSource(functionParameters, code, includes)
    }
}

exports.makeTransformGenerator = makeTransformGenerator
