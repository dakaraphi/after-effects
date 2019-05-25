'use strict';

/*******************************************************************/
// DEPENDENCIES
/*******************************************************************/
const fs = require('fs'),
    path = require('path'),
    is = require('is-explicit').default,
    babel = require('babel-core');

//don't require ae here, as the circular dependencies will result in a {}
//until initial requires are complete.
let ae = null;

/*******************************************************************/
// CONSTANTS
/*******************************************************************/

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

/*******************************************************************/
// HELPERS
/*******************************************************************/

function stringify() { /* private dangler */
    let err_open = '', err_close = '';


    console.log(err_close)

    let args = '';
    if (is(this.arguments, Array) && this.arguments.length > 0)
        args = JSON.stringify(this.arguments);

    const logFile = path.join(process.cwd(), 'after_effects-script.log').replace(/\\/g, '\\\\')  // must add double backslash as it will be escaped when making the main script string
    // split args as lines too long cause issues
    args = splitStringIntoLines(args)
    console.log('Result File: ' + this.result_file)
    const main = `
            app.beginSuppressDialogs();
            try {
                var log = makeLogger('script logger', '${logFile}');
                var inputFromNode = ${args};
                var scriptResult = ${this.code}.apply(this, inputFromNode);
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
                log.info(err)
                $.result = err;
            }

            (function(result){
                var file = File(Folder.temp.absoluteURI+"/${this.result_file}");
                log.info('result file: ' + file.fsName)
                file.open("w");
                file.write(result);
                file.close();
                delete $.result;
            })(JSON.stringify($.result));

            log.close();
            `;

    const inc = this.includes.join(';');

    return inc + main;
}

function splitStringIntoLines(string) {
    let result = string.split('}') 
    return result.join('}\n')
}
function babelify(code) {
    return babel.transform(code, BabelOptions).code;
}

function codify_includes(includes) {
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
            code = babelify(code);
        }

        return code;

    }).filter(inc => is(inc, String));
}

function execute_args(command, input_args) {
    const args = [command];
    for (let i = 0; i < input_args.length; i++) args.push(input_args[i]);

    return args;
}

/*******************************************************************/
// CODIFICATION
/*******************************************************************/

module.exports = class Command {

    constructor(func, options) {

        if (ae === null)
            ae = require('../index');

        if (!is(func, Function))
            throw new Error('Commands must be constructed with a function argument.');

        if (!is(options, Object)) options = {};

        this.options = Object.assign({}, ae.options, options);

        //Babelify function as an expression otherwise it breaks when isolated
        const babelified = babelify(`(${func.toString()})`);

        //Isolate babelified code to just the function expression (remove any babelified includes and the final ;)
        const funcStart = babelified.indexOf('(function');
        this.code = babelified.substring(funcStart, babelified.length - 1);

        //Isolate babelified includes (without the 'use strict' cause AE doesn't use it)
        const babelIncludes = babelified.substring(0, funcStart).replace('"use strict";\n', '');

        this.includes = [...codify_includes(this.options.includes), babelIncludes];

        Object.freeze(this.options);
        Object.freeze(this.options.includes);

    }

    toString() {
        return stringify.call(this);
    }

    execute() {
        const args = execute_args(this, arguments);
        return ae.execute.apply(null, args);
    }

    executeSync() {
        const args = execute_args(this, arguments);
        return ae.executeSync.apply(null, args);
    }
};
