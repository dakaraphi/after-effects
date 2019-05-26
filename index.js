'use strict';

const os = 		  require('os');
const fs =      require('fs');
const path =    require('path');
const uuid = 		require('uuid');
const makeTransformGenerator = require('./lib/script-transform-generator').makeTransformGenerator;

const Tail = require('tail').Tail;

const options = {
	errorHandling: true,
  program: null,
  includes: [
		path.join(__dirname, '/lib/includes/es5-shim.jsx'),
		path.join(__dirname, '/lib/includes/es6-shim.js'),
		path.join(__dirname, '/lib/includes/json2.js'),
    path.join(__dirname, '/lib/includes/ae-lib.js'),
  	]
};

const platform = (() => {

 const platform_name = os.platform();
 if (platform_name.includes('win')) { //windows 32 or 64
   return require('./lib/process-execution.js');
 } else
   throw new Error(Errors.UnsupportedPlatform);

})();

/*******************************************************************/
// ERRORS
/*******************************************************************/

const Errors = {
  UnsupportedPlatform : 'Cannot run After Effects commands in an environment it can\'t be installed in.',
  BadExecuteArgument : 'execute expects a function or AfterEffectsCommand instance.',
  ApplicationNotFound : 'Cannot execute command, After Effects could not be found in your application directory. Install After Effects in your application directory, or provide a path in program option.',
  NoResult : 'Could not get results from After Effects. Ensure that Preferences > General > Allow Scripts to Write Files and Access Network is enabled.'
};

function tailLogToConsole() {
  const logFile = path.join(process.cwd(), "after_effects-script.log")
  console.log('creating log file: ' + logFile)
  fs.writeFileSync(logFile, '') // create or clear previous log
  const tailOptions = {fromBeginning: true}
  const tail = new Tail(logFile, tailOptions);
  
  tail.on("line", function(data) {
    console.log(data);
  });
  
  tail.on("error", function(error) {
    console.log('ERROR: ', error);
  });

  return tail;
}

function create_result_file_name() {
  return `ae-result-${uuid.v4()}.json`;
}

function get_results(resultFile) {

  let results = {};

  try {
    //For macs, the javascript function inside After Effects that points toward
    //the operating systems temp folder is slightly different than os.tmpdir,
    //having a 'TemporaryItems' subfolder.
    const sub_temp_dir = os.platform() === 'darwin' ? 'TemporaryItems' : '';
    const jsfile = path.join(os.tmpdir(), sub_temp_dir, resultFile);
    results = require(jsfile);

    fs.unlink(jsfile, function(err) {
      if (err)
        console.error (err)
    });

  } catch (err) {

    return err;
  }

  return results;
}

function executeSync(afterEffectsFn, ...parameters) {

  const resultFile = create_result_file_name();
  const tail = tailLogToConsole()

  const transformGenerator = makeTransformGenerator(afterEffectsFn, parameters, options, resultFile)
  const scriptFile = path.join(process.cwd(),`after-effects-generated-script.js`);
  const scriptContent = transformGenerator.makeSource();
  const program_path = path.join(options.program, 'Support Files')


  console.log('After Effects Location: ' + program_path.toString())
  try {
    console.log('Created script for execution: ' + scriptFile)
    fs.writeFileSync(scriptFile, scriptContent, 'utf-8');
  } catch (err) {
    throw Error('Could not create jsx script for execution. Check permissions.');
  }

  platform.executeSync(scriptFile, program_path);

  const results = get_results(resultFile);
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


module.exports = function() {
  return executeSync.apply(null, arguments);
};

module.exports.executeSync = executeSync;
module.exports.options = options;