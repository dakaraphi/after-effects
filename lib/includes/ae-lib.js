// ExtendScript - http://estk.aenhancers.com/index.html

/**
 * Returns a String of properties and method names of an object
 * @param {*} object 
 */
function describe(object) {
    let result = 'default'
    if (object === null || typeof object === 'undefined') {
        return "Object has no value"
    }
    result = "properties of :: " +object.toString() + '\n'
    // Use ExtendScript reflection methods to get info about the object
    object.reflect.methods.map(function(item) {result += "   method: " + item.name + '\n'});
    object.reflect.properties.map(function(item) {
        try {
            result += "   property: " + item.name + "=" + object[item.name].toString() + '\n'
        } catch (e) {
            result += "   property: " + item.name + " - " + e.toString() + '\n'
        }
    });
    return result
}

function isCopyableKey(key) {
    key = key.toString()
    let copyable = true
    try {
        if (key.indexOf('__') === 0 ||
            key === 'reflect' || 
            key === 'length' ||
            key === 'parentProperty'  // prevent circular references
            )
            copyable = false
    } catch(error) {copyable = false}
    return copyable
}

function isPrimitive(arg) {
    if (arg === null || arg === undefined ) return true
    const type = typeof arg;
    return(type != "object" && type != "function");
  }

function cloneAsSafeValue(object, depth, logErrors) {
    if (depth === undefined) depth = 1
    const isObject = object instanceof Object
    const isArray = object instanceof Array
    if (isPrimitive(object)) return object

    if (depth === 0) return isPrimitive(object) ? object : object.toString()

    const properties = object.reflect.properties
    let result = isArray ? []:{}
    
    if (properties.length === 0 && !isArray)
    result = {'__':'__'} // default value to prevent silly bug when object empty which adds a \n causing it to not be parsed
    
    // handle object
    for (let index = 0; index < properties.length; index++) {
        const key = properties[index].toString();
        
        try {
            if (!isCopyableKey(key)) continue
            const propertyValue = object[key];
            const safeValue = cloneAsSafeValue(propertyValue, depth - 1);
            if (safeValue === undefined) continue

            if (!isArray)
                result[key] = safeValue;
            else 
                result.push(safeValue);
            
        } catch (e) {
            if (logErrors)
                log.error(e.toString())
        }
    }
    //return result
    return result
}

function makeLogger(name, logLocation) {
    const logFile = File(logLocation);
    logFile.open("w");  // open for writing and replace contents
    logFile.encoding = "UTF-8";
    logFile.writeln('created logger: ' + name)
    function expandObject(object) {
        if (object instanceof Object) {
            return JSON.stringify(cloneAsSafeValue(object, 10))
        }
        return object
    }

    return {
        info: message => logFile.writeln('info: ' + expandObject(message)),
        error: message => logFile.writeln('error: ' + expandObject(message)),
        close: () => logFile.close()
    }
}

// AE Functions
function writeParentTree(property) {
    var parent = property;
    while (parent) {
        log.write(parent.name + " < ");
        parent = parent.parentProperty;
    }
    log.writeln();
}


function forEachKeyFrame(property, fn) {
    if (property.matchName === "ADBE Marker") return;
    if (property.numKeys > 0) {
        //write("Processing " + property.numKeys + " keyframes for: " + property.matchName + " - " + property.name);
    }
    for (var keyIndex=1; keyIndex<= property.numKeys; keyIndex++) {
        var keyTime = property.keyTime(keyIndex);
        var keyValue = property.keyValue(keyIndex);
        fn(property, keyIndex, keyTime, keyValue)
        //property.setValueAtTime(keyTime, [100, 500]);
    }
}

/**
 * Deeply traverse all properties
 * @param {*} layerOrProperty 
 * @param {*} fn 
 */
function forEachProperty(layerOrProperty, fn) {
    //write("Processing node: " + node.matchName + " - " + node.name);
    for (var propertyIndex=1; propertyIndex<=layerOrProperty.numProperties; propertyIndex++) {
        property = layerOrProperty.property(propertyIndex);
        fn(property);
        if (property.propertyType == PropertyType.INDEXED_GROUP || property.propertyType == PropertyType.NAMED_GROUP) 
            forEachProperty(property, fn);
    }
}

function propertySettingsAsJSON(layer) {
    const lookupMap = {}
    const propertiesJSON = []
    forEachProperty(layer, (property, parentProperty) => {
        let value = null;
        try {value = property.value.toString()} catch(e) {}

        const propertySettings = {
            name: property.name,
            matchName: property.matchName,
            value: value,
            isEffect: property.isEffect,
            properties: []
        }

        if (true) {
            if (property.propertyDepth > 1) {
                lookupMap[property.parentProperty.name].properties.push(propertySettings)
            } else {
                // top level list
                propertiesJSON.push(propertySettings)
            }
        }

        lookupMap[propertySettings.name] = propertySettings
    })

    return propertiesJSON
}

function findProperties(layers, filters) {
    var foundProperties = [];
    layers.map(function(node){
        forEachProperty(node, function(property) {
            if (!filters) foundProperties.push(property);
            else if (isFiltersMatched(property, filters)) foundProperties.push(property);
        });
    });
    return foundProperties;
}

function isFiltersMatched(property, filters) {
    // last filter must match current property
    // any previous filters must match one of any parent properties
    var lastFilter = filters[filters.length - 1];
    if (!isFilterMatched(property, lastFilter)) return false;
    if (filters.length === 1) return true;
    
    var matchFound = true;
    var parent = property;
    for (var filterIndex = filters.length -2; filterIndex >= 0; filterIndex--) {
        parent = findMatchingAncestor(parent, filters[filterIndex]);
        if (!parent) {
            matchFound = false;
            break;
        }
    }
    return matchFound;
}

function findMatchingAncestor(property, filter) {
    var parents = [];
    var parent = property.parentProperty;
    while(parent) {
        // writeParentTree(parent);
        // writeProperties(filter);
        var matched = isFilterMatched(parent, filter);
        if (matched) return parent;
        parent = parent.parentProperty;
    }
    return null;
}

function isFilterMatched(property, filter) {
    if (!filter) return false;
    var noMatch = false;
    for( var key in filter ) {
        if (filter[key] instanceof RegExp) {
            if (!filter[key].test(property[key])) {
                noMatch = true;
                break;
            }
        } else if (property[key] !== filter[key]) {
            noMatch = true;
            break;
        }
    }
    return !noMatch;
}

function findOrCreateNullLayer(composite, name) {
    var nullLayer = findLayerByName(composite, name);
    if (nullLayer) return nullLayer;

    nullLayer = composite.layers.addNull();
    nullLayer.name = name;
    return nullLayer;
}

function findLayerByName(composite, name) {
    var foundLayer = null;
    layers(composite).map(function(layer) {
        write("layer name: " + layer.name);
        if (layer.name === name) foundLayer = layer; 
    });
    return foundLayer;
}

function findOrCreateProperty(parent, type, name) {
    write("find name: " + name);
    var properties = findProperties([parent], [{name: name}]);
    if (properties.length === 1) return properties[0];

    return parent.addProperty(type);
}

function findOrCreateSlider(parent, name) {
    var effectsProperty = parent.property("ADBE Effect Parade");
    var sliderControl = findOrCreateProperty(effectsProperty, "ADBE Slider Control", name);
    
    if (sliderControl !== null) {
        sliderControl.name = name;
    }
    return sliderControl.property("ADBE Slider Control-0001");
}

function createKeyFrame(property, time, value) {
    var keyIndex = property.addKey(time);
    property.setValueAtKey(keyIndex, value);
    return keyIndex;
}

function makeLayersInterface(composite) {
    function layers() {
        const layerList = [];
        for(var index = 1; index <= composite.numLayers; index++) {
            layerList.push(composite.layer(index));
        }
        return layerList;
    }

    function find(findFn) {
        const layerList = layers()
        for (let index = 0; index < layerList.length; index++) {
            const layer = layerList[index]
            if (findFn(layer)) return layer
        }
    }

    function findPrevious(currentLayer) {
        const index = currentLayer.index // index seems to be starting at 1 vs 0
        if (index > 1) return layers()[index - 2]
    }

    function findNext(currentLayer) {
        const index = currentLayer.index // index seems to be starting at 1 vs 0
        const currentLayers = layers()
        const length = currentLayers.length
        if (index <= length) return layers()[index]
    }

    function add(asset) {
        const layer = composite.layers.add(asset)
        layer.moveToEnd()
        return layer;
    }

    function addAll(assets, layerOverlap, onAddFn) {
        for (let index = 0; index < assets.length; index++) {
            const asset = assets[index];
            const layer = add(asset)
            let previousLayer = null
            if (index > 0) {
                previousLayer = findPrevious(layer)
                layer.startTime = previousLayer.outPoint - layerOverlap
            }
            autoScaleToComposite(layer)
            if (onAddFn(layer, previousLayer)) break;
        }
    }

    function addAdjustment(targetLayer, duration) {
        duration = duration ? duration : composite.duration
        const layer = composite.layers.addSolid([1,1,1], name, composite.width, composite.height, composite.pixelAspect, composite.duration);
        layer.adjustmentLayer = true;
        layer.moveAbove(targetLayer);
        return layer
    }

    /**
     * 
     * @param {*} originalLayer layer to be duplicated
     * @param {*} targetPlacement layer at which duplicate should be placed
     * @param {*} relativeLayerPosition relative position to target layer. -1 for above, 1 for below
     * @param {*} relativeTimePosition 0 to start at same time as target
     */
    function duplicate(originalLayer, targetPlacementLayer, relativeLayerPosition, relativeTimePosition, useInPointForRelativePosition) {
        const duplicateLayer = originalLayer.duplicate()
        const relativeTargetLayer = layers()[targetPlacementLayer.index + relativeLayerPosition]
        if (relativeLayerPosition < 0)
            duplicateLayer.moveBefore(relativeTargetLayer)
        else
            duplicateLayer.moveAfter(relativeTargetLayer)

        duplicateLayer.startTime = targetPlacementLayer.startTime + relativeTimePosition
        // adjust startTime based on inPoint.  Useful when copying effect layers as templates
        if (useInPointForRelativePosition) duplicateLayer.startTime += - (duplicateLayer.inPoint - duplicateLayer.startTime)
        duplicateLayer.enabled = true
        duplicateLayer.name = originalLayer.name
        return duplicateLayer
    }

    function autoScaleToComposite(layer) {
        const layerDimensions = layer.sourceRectAtTime(0,false);
        const scale = layer.property("Scale").value;
        const newScale = scale * Math.min(composite.width / layerDimensions.width, composite.height / layerDimensions.height);
        layer.property("Scale").setValue(newScale);
    }

    function findAllProperties(layerFilterFn, filters) {
        const filterLayers = layers().filter(layerFilterFn)
        return findProperties(filterLayers, filters);
    }

    return {
        layers,
        find,
        findPrevious,
        findNext,
        add,
        addAll,
        addAdjustment,
        duplicate,
        autoScaleToComposite,
        findAllProperties
    }
}

function makeAssetsInterface(project) {
    function assets() {
        var assets = [];
        for(var index = 1; index <= project.numItems; index++) {
            assets.push(project.item(index));
        }
        return assets;
    }

    function find(findFn) {
        const assetList = assets()
        for (let index = 0; index < assetList.length; index++) {
            const asset = assetList[index]
            if (findFn(asset)) return asset
        }
    }

    return {
        assets,
        find
    }
}

function makeProjectInterface(project) {
    function importAssets(directory, fileFilterFn) {
        const path = new Folder(directory)
        log.info('importing assets from: ' + path.toString())
        const files = path.getFiles(fileFilterFn)
        const importedAssets = []
        files.map(file => {
            if (file instanceof File) { // some could be folders
                const asset = project.importFile(new ImportOptions(file))
                importedAssets.push(asset)
            }
        })
        return importedAssets
    }

    function importAsset(path) {
        const file = new File(path)
        const asset = project.importFile(new ImportOptions(file))
        return asset
    }

    function addComposition(name, width, height, pixelAspect, duration, frameRate) {
        return project.items.addComp(name, width, height, pixelAspect, duration, frameRate)
    }

    return {
        importAssets,
        importAsset, 
        addComposition
    }
}

function makeInterfaces() {
    const assetsInterface = makeAssetsInterface(app.project)
    const projectInterface = makeProjectInterface(app.project)
    const composite = assetsInterface.find(asset => asset.typeName === 'Composition') // find existing composite.  Assumes only 1
    const layersInterface = makeLayersInterface(composite)
    return {assetsInterface, projectInterface, layersInterface}
}