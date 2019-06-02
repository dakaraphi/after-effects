# after-effects-node
___

Originally forked from `After Effects`, but is now mostly a complete rewrite.

Currently this is experimental.  Expect all updates will likely break things.

## Notable Features plus Differences between original fork

* Same Features
    * Send a JS Function from Node environment and execute within After Effects process
    * Transforms ES6 into ES3 for compatibility in After Effects JS environment
* Differences
    * Support some additinoal ES6
    * Improved ability to send and receive JSON objects between Node and After Effects
    * Ability to turn After Effects objects into JSON
    * Error reporting back to the Node process with line # and line text of the source of error
    * Logger called by invoking `log.info()`
        * Logger automatically converts After Script objects into JSON that can be logged
        * Logging occurrs to a log file as well as to the Node console
    * All files generated in current working directory for easier debugging
        * All files persist after script execution for easier debugging
        * Generated JS file can be run in After Effects debugger environment as well to assist with debugging
    * Automatically adds undo group around executing script
    * Only supporting Windows ( the only environment I have to develop and test )
    * Much simplified API
        * I'm building and supporting only what I'm using at the moment, much of the original API was removed.
        * Automatically scales all clips added to layer to match the composition size

## Future considerations

* Convert library to TypeScript

## Sample Usage
This script will do the following
* Import all .mp4 files from a directory
* Add all imported files to a composition
* Layout all clips with overlapping 2 seconds
* Return back to the Node process all of the video clip end times between clips

```javascript
const makeAfterEffectsInterface = require('./index.js').makeAfterEffectsInterface

// These options will be passed to the after effects process and our function will receive them as a paramter to the function
const options = {
    "assetFolder": "C:\\development\\projects\\snackbar\\output",
    "compositionMain": {
        "name": "render main",
        "layerOverlapSeconds": 2,
        "videoLengthLimitSeconds": 120
    },
}

const aeInterface = makeAfterEffectsInterface({afterEffectsPath: 'C:\\Program Files\\Adobe\\Adobe After Effects CC 2019'})
const result = aeInterface.executeFunctionInAfterEffects(optionsFromNode => {
    log.info('begin after effects script execution')

    const {options} = optionsFromNode
    const assetsInterface = makeAssetsInterface(app.project)
    const projectInterface = makeProjectInterface(app.project)
    const layersInterface = makeLayersInterface(assetsInterface.findByName(options.compositionMain.name))
    const importedAssets = projectInterface.importAssets(options.assetFolder, '*.mp4')
    
    const videoEndTimes = []

    log.info('creating layers')
    layersInterface.addAll(importedAssets, options.compositionMain.layerOverlapSeconds, (layer, previousLayer) => {
        log.info('  adding layer: ' + layer.name)

        if (previousLayer) {
            // make a list of the transition times to be used later
            videoEndTimes.push(previousLayer.outPoint)
        }

        if (layer.outPoint > options.compositionMain.videoLengthLimitSeconds) return true // don't add anymore beyond time limit
    })

    log.info('After Effects finished processing script')
    return videoEndTimes
}, {options});

// log list of video clip end times
console.dir(result, {depth: null})
```