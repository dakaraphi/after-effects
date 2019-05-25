'use strict';

const fs = 		require('fs'),
      child = require('child_process'),
      path =  require('path')

const exec =      child.exec,
      execSync =  child.execSync;

/******************************************************************************/
// HELPERS
/******************************************************************************/

function create_jsx_script(command, sync) {
  const jsx_script_file = path.join(process.cwd(),`after-effects-generated-script.js`);
  command.generatedScriptFile = jsx_script_file;
  const jsx_script = command.toString();
  const program_path = path.join(command.options.program, 'Support Files')

  console.log('After Effects Location: ' + program_path.toString())
  if (sync) {
    try {
      console.log('Created script for execution: ' + jsx_script_file)
      fs.writeFileSync(jsx_script_file, jsx_script, 'utf-8');
    } catch (err) {
      throw Error('Could not create jsx script for execution. Check permissions.');
    }
    return {script: jsx_script_file, program_path};
  }
  //async
  return new Promise((resolve, reject)=> {
    fs.writeFile(jsx_script_file, jsx_script, 'utf-8', err => {
      if (err)
        return reject(err);
      resolve({script: jsx_script_file, program_path});
    });
  });
}

/******************************************************************************/
// EXPORT
/******************************************************************************/

module.exports = {

  execute : function(command) {

    return create_jsx_script(command)
    //Execute JSX Script
    .then( jsx => new Promise( resolve => {
      exec(`afterfx.exe -r ${jsx.script}`, {cwd: jsx.program_path}, (/*err, stdout, stderr*/) => {
        // see * below
        //if (err) return reject(err);
        //if (stderr) return reject(stderr);

        resolve();
      });
    }));
  },

  executeSync : function(command) {

    const jsx = create_jsx_script(command, true);
    //Execute JSX
    try {
      execSync(`afterfx.exe -r ${jsx.script}`, {cwd: jsx.program_path});
    } catch (err) {
      //TODO *
      //I don't know why, executing a child process always throws an error in
      //windows, despite the AfterEffects execution working perfectly.
      //For now, we just ignore errors on execSync
    }
  },

  scriptsDir: function(command){
      return path.join(command.options.program, 'Support Files', 'Scripts');
  }
};
