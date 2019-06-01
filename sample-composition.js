const ae = require('./index.js')

// These options will be passed to the after effects process and our function will receive them as a paramter to the function
const options = {
    "afterEffectsPath": "C:\\Program Files\\Adobe\\Adobe After Effects CC 2019",
    "assetFolder": "C:\\development\\projects\\snackbar\\output",
    "compositionMain": {
        "name": "render main",
        "layerOverlapSeconds": 2,
        "videoLengthLimitSeconds": 120
    },
}

ae.options.afterEffectsPath = options.afterEffectsPath
const result = ae(optionsFromNode => {
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


console.dir(result, {depth: null})