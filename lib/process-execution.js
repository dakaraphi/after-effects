'use strict';

const child = require('child_process')
const execSync =  child.execSync

module.exports = {

  executeSync : function(scriptFile, afterEffectsPath) {

    try {
      execSync(`afterfx.exe -r ${scriptFile}`, {cwd: afterEffectsPath});
    } catch (err) {
      // after effects always returns status code 1
    }
  }
};
