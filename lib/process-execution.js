'use strict';

const child = require('child_process')
const path = require('path');
const execSync = child.execSync

module.exports = {

    executeSync: function (scriptFile, options) {
        const supportFilesPath = path.join(options.afterEffectsPath, 'Support Files')
        console.log('After Effects Location: ' + supportFilesPath)

        try {
            execSync(`afterfx.exe -r ${scriptFile}`, { cwd: supportFilesPath });
        } catch (err) {
            // after effects always returns status code 1
        }
    }
};
