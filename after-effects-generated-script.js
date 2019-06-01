
            /*
  This is a include file that can be included in the after effects Scripts/Startup folder
  that will act as an es5 shim for the Adobe After Effects scripting environment.
*/

/* globals $ */
/* eslint-disable no-var */

/****************************************************************/
// Array Shims
/****************************************************************/
Array.isArray = Array.isArray ? Array.isArray : function(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
};

Array.prototype.every = Array.prototype.every ? Array.prototype.every : function(callbackfn, thisArg) {
  'use strict';
  var T, k;

  if (this == null) {
    throw new TypeError('this is null or not defined');
  }

  // 1. Let O be the result of calling ToObject passing the this
  //    value as the argument.
  var O = Object(this);

  // 2. Let lenValue be the result of calling the Get internal method
  //    of O with the argument "length".
  // 3. Let len be ToUint32(lenValue).
  var len = O.length >>> 0;

  // 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
  if (typeof callbackfn !== 'function') {
    throw new TypeError();
  }

  // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
  if (arguments.length > 1) {
    T = thisArg;
  }

  // 6. Let k be 0.
  k = 0;

  // 7. Repeat, while k < len
  while (k < len) {

    var kValue;

    // a. Let Pk be ToString(k).
    //   This is implicit for LHS operands of the in operator
    // b. Let kPresent be the result of calling the HasProperty internal
    //    method of O with argument Pk.
    //   This step can be combined with c
    // c. If kPresent is true, then
    if (k in O) {

      // i. Let kValue be the result of calling the Get internal method
      //    of O with argument Pk.
      kValue = O[k];

      // ii. Let testResult be the result of calling the Call internal method
      //     of callbackfn with T as the this value and argument list
      //     containing kValue, k, and O.
      var testResult = callbackfn.call(T, kValue, k, O);

      // iii. If ToBoolean(testResult) is false, return false.
      if (!testResult) {
        return false;
      }
    }
    k++;
  }
  return true;
};

Array.prototype.filter = Array.prototype.filter ? Array.prototype.filter : function(fun/*, thisArg*/) {
  'use strict';

  if (this === void 0 || this === null) {
    throw new TypeError();
  }

  var t = Object(this);
  var len = t.length >>> 0;
  if (typeof fun !== 'function') {
    throw new TypeError();
  }

  var res = [];
  var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
  for (var i = 0; i < len; i++) {
    if (i in t) {
      var val = t[i];

      // NOTE: Technically this should Object.defineProperty at
      //       the next index, as push can be affected by
      //       properties on Object.prototype and Array.prototype.
      //       But that method's new, and collisions should be
      //       rare, so use the more-compatible alternative.
      if (fun.call(thisArg, val, i, t)) {
        res.push(val);
      }
    }
  }

  return res;
};

Array.prototype.forEach = Array.prototype.forEach ? Array.prototype.forEach : function(callback, thisArg) {

  var T, k;

  if (this == null) {
    throw new TypeError(' this is null or not defined');
  }

  // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
  var O = Object(this);

  // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
  // 3. Let len be ToUint32(lenValue).
  var len = O.length >>> 0;

  // 4. If IsCallable(callback) is false, throw a TypeError exception.
  // See: http://es5.github.com/#x9.11
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }

  // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
  if (arguments.length > 1) {
    T = thisArg;
  }

  // 6. Let k be 0
  k = 0;

  // 7. Repeat, while k < len
  while (k < len) {

    var kValue;

    // a. Let Pk be ToString(k).
    //   This is implicit for LHS operands of the in operator
    // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
    //   This step can be combined with c
    // c. If kPresent is true, then
    if (k in O) {

      // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
      kValue = O[k];

      // ii. Call the Call internal method of callback with T as the this value and
      // argument list containing kValue, k, and O.
      callback.call(T, kValue, k, O);
    }
    // d. Increase k by 1.
    k++;
  }
  // 8. return undefined
};

Array.prototype.indexOf = Array.prototype.indexOf ? Array.prototype.indexOf : function(searchElement, fromIndex) {

  var k;

  // 1. Let o be the result of calling ToObject passing
  //    the this value as the argument.
  if (this == null) {
    throw new TypeError('"this" is null or not defined');
  }

  var o = Object(this);

  // 2. Let lenValue be the result of calling the Get
  //    internal method of o with the argument "length".
  // 3. Let len be ToUint32(lenValue).
  var len = o.length >>> 0;

  // 4. If len is 0, return -1.
  if (len === 0) {
    return -1;
  }

  // 5. If argument fromIndex was passed let n be
  //    ToInteger(fromIndex); else let n be 0.
  var n = +fromIndex || 0;

  if (Math.abs(n) === Infinity) {
    n = 0;
  }

  // 6. If n >= len, return -1.
  if (n >= len) {
    return -1;
  }

  // 7. If n >= 0, then Let k be n.
  // 8. Else, n<0, Let k be len - abs(n).
  //    If k is less than 0, then let k be 0.
  k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

  // 9. Repeat, while k < len
  while (k < len) {
    // a. Let Pk be ToString(k).
    //   This is implicit for LHS operands of the in operator
    // b. Let kPresent be the result of calling the
    //    HasProperty internal method of o with argument Pk.
    //   This step can be combined with c
    // c. If kPresent is true, then
    //    i.  Let elementK be the result of calling the Get
    //        internal method of o with the argument ToString(k).
    //   ii.  Let same be the result of applying the
    //        Strict Equality Comparison Algorithm to
    //        searchElement and elementK.
    //  iii.  If same is true, return k.
    if (k in o && o[k] === searchElement) {
      return k;
    }
    k++;
  }
  return -1;
};

Array.prototype.lastIndexOf = Array.prototype.lastIndexOf ? Array.prototype.lastIndexOf : function(searchElement /*, fromIndex*/) {
  'use strict';

  if (this === void 0 || this === null) {
    throw new TypeError();
  }

  var n, k,
    t = Object(this),
    len = t.length >>> 0;
  if (len === 0) {
    return -1;
  }

  n = len - 1;
  if (arguments.length > 1) {
    n = Number(arguments[1]);
    if (n != n) {
      n = 0;
    }
    else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) { //eslint-disable-line no-extra-parens
      n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
  }

  for (k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--) {
    if (k in t && t[k] === searchElement) {
      return k;
    }
  }
  return -1;
};

Array.prototype.map = Array.prototype.map ? Array.prototype.map : function(callback, thisArg) {

  var T, A, k;

  if (this == null) {
    throw new TypeError(' this is null or not defined');
  }

  // 1. Let O be the result of calling ToObject passing the |this|
  //    value as the argument.
  var O = Object(this);

  // 2. Let lenValue be the result of calling the Get internal
  //    method of O with the argument "length".
  // 3. Let len be ToUint32(lenValue).
  var len = O.length >>> 0;

  // 4. If IsCallable(callback) is false, throw a TypeError exception.
  // See: http://es5.github.com/#x9.11
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }

  // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
  if (arguments.length > 1) {
    T = thisArg;
  }

  // 6. Let A be a new array created as if by the expression new Array(len)
  //    where Array is the standard built-in constructor with that name and
  //    len is the value of len.
  A = new Array(len);

  // 7. Let k be 0
  k = 0;

  // 8. Repeat, while k < len
  while (k < len) {

    var kValue, mappedValue;

    // a. Let Pk be ToString(k).
    //   This is implicit for LHS operands of the in operator
    // b. Let kPresent be the result of calling the HasProperty internal
    //    method of O with argument Pk.
    //   This step can be combined with c
    // c. If kPresent is true, then
    if (k in O) {

      // i. Let kValue be the result of calling the Get internal
      //    method of O with argument Pk.
      kValue = O[k];

      // ii. Let mappedValue be the result of calling the Call internal
      //     method of callback with T as the this value and argument
      //     list containing kValue, k, and O.
      mappedValue = callback.call(T, kValue, k, O);

      // iii. Call the DefineOwnProperty internal method of A with arguments
      // Pk, Property Descriptor
      // { Value: mappedValue,
      //   Writable: true,
      //   Enumerable: true,
      //   Configurable: true },
      // and false.

      // In browsers that support Object.defineProperty, use the following:
      // Object.defineProperty(A, k, {
      //   value: mappedValue,
      //   writable: true,
      //   enumerable: true,
      //   configurable: true
      // });

      // For best browser support, use the following:
      A[k] = mappedValue;
    }
    // d. Increase k by 1.
    k++;
  }

  // 9. return A
  return A;
};

Array.prototype.reduce = Array.prototype.reduce ? Array.prototype.reduce : function(callback /*, initialValue*/) {
  'use strict';
  if (this == null) {
    throw new TypeError('Array.prototype.reduce called on null or undefined');
  }
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }
  var t = Object(this), len = t.length >>> 0, k = 0, value;
  if (arguments.length == 2) {
    value = arguments[1];
  } else {
    while (k < len && !(k in t)) {
      k++;
    }
    if (k >= len) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    value = t[k++];
  }
  for (; k < len; k++) {
    if (k in t) {
      value = callback(value, t[k], k, t);
    }
  }
  return value;
};

Array.prototype.reduceRight = Array.prototype.reduceRight ? Array.prototype.reduceRight : function(callback /*, initialValue*/) {
  'use strict';
  if (null === this || 'undefined' === typeof this) {
    throw new TypeError('Array.prototype.reduce called on null or undefined' );
  }
  if ('function' !== typeof callback) {
    throw new TypeError(callback + ' is not a function');
  }
  var t = Object(this), len = t.length >>> 0, k = len - 1, value;
  if (arguments.length >= 2) {
    value = arguments[1];
  } else {
    while (k >= 0 && !(k in t)) {
      k--;
    }
    if (k < 0) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    value = t[k--];
  }
  for (; k >= 0; k--) {
    if (k in t) {
      value = callback(value, t[k], k, t);
    }
  }
  return value;
};

Array.prototype.some = Array.prototype.some ? Array.prototype.some : function(fun/*, thisArg*/) {
  'use strict';

  if (this == null) {
    throw new TypeError('Array.prototype.some called on null or undefined');
  }

  if (typeof fun !== 'function') {
    throw new TypeError();
  }

  var t = Object(this);
  var len = t.length >>> 0;

  var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
  for (var i = 0; i < len; i++) {
    if (i in t && fun.call(thisArg, t[i], i, t)) {
      return true;
    }
  }

  return false;
};

/****************************************************************/
// Date Polyfill
/****************************************************************/

if (!Date.prototype.toISOString) {
  (function() {

    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }

    Date.prototype.toISOString = function() {
      return this.getUTCFullYear() +
        '-' + pad(this.getUTCMonth() + 1) +
        '-' + pad(this.getUTCDate()) +
        'T' + pad(this.getUTCHours()) +
        ':' + pad(this.getUTCMinutes()) +
        ':' + pad(this.getUTCSeconds()) +
        '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        'Z';
    };

  }());
}

Date.prototype.toJSON = Date.prototype.toJSON ? Date.prototype.toJSON : function () {
  return this.toISOString(this);
};

/****************************************************************/
// Function Shims
/****************************************************************/

Function.prototype.bind = Function.prototype.bind ? Function.prototype.bind : function(oThis) {
  if (typeof this !== 'function') {
    // closest thing possible to the ECMAScript 5
    // internal IsCallable function
    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
  }

  var aArgs   = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP    = function() {},
      fBound  = function() {
        return fToBind.apply(this instanceof fNOP
               ? this
               : oThis,
               aArgs.concat(Array.prototype.slice.call(arguments)));
      };

  if (this.prototype) {
    // Function.prototype don't have a prototype property
    fNOP.prototype = this.prototype;
  }
  fBound.prototype = new fNOP();

  return fBound;
};


/****************************************************************/
// Object Shims
/****************************************************************/

if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'), //eslint-disable-line no-extra-parens
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

/****************************************************************/
// String Shims
/****************************************************************/

String.prototype.trim = String.prototype.trim ? String.prototype.trim : function() {
  return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};

String.prototype.includes = String.prototype.includes ? String.prototype.includes : function(search, start) {
  'use strict';
  if (typeof start !== 'number') {
    start = 0;
  }

  if (start + search.length > this.length) {
    return false;
  } else {
    return this.indexOf(search, start) !== -1;
  }
};

/****************************************************************/
// Object Shams
/****************************************************************/
/*!
 * https://github.com/es-shims/es5-shim
 * @license es5-shim Copyright 2009-2015 by contributors, MIT License
 * see https://github.com/es-shims/es5-shim/blob/master/LICENSE
 */

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
  'use strict';

  /* global define, exports, module */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.returnExports = factory();
  }
}($.global, function () {

var call = Function.call;
var prototypeOfObject = Object.prototype;
var owns = call.bind(prototypeOfObject.hasOwnProperty);
var isEnumerable = call.bind(prototypeOfObject.propertyIsEnumerable);
var toStr = call.bind(prototypeOfObject.toString);

// If JS engine supports accessors creating shortcuts.
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors = owns(prototypeOfObject, '__defineGetter__');
if (supportsAccessors) {
  /* eslint-disable no-underscore-dangle */
  defineGetter = call.bind(prototypeOfObject.__defineGetter__);
  defineSetter = call.bind(prototypeOfObject.__defineSetter__);
  lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
  lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
  /* eslint-enable no-underscore-dangle */
}

// ES5 15.2.3.2
// http://es5.github.com/#x15.2.3.2
if (!Object.getPrototypeOf) {
  // https://github.com/es-shims/es5-shim/issues#issue/2
  // http://ejohn.org/blog/objectgetprototypeof/
  // recommended by fschaefer on github
  //
  // sure, and webreflection says ^_^
  // ... this will nerever possibly return null
  // ... Opera Mini breaks here with infinite loops
  Object.getPrototypeOf = function getPrototypeOf(object) {
    /* eslint-disable no-proto */
    var proto = object.__proto__;
    /* eslint-enable no-proto */
    if (proto || proto === null) {
      return proto;
    } else if (toStr(object.constructor) === '[object Function]') {
      return object.constructor.prototype;
    } else if (object instanceof Object) {
      return prototypeOfObject;
    } else {
      // Correctly return null for Objects created with `Object.create(null)`
      // (shammed or native) or `{ __proto__: null}`.  Also returns null for
      // cross-realm objects on browsers that lack `__proto__` support (like
      // IE <11), but that's the best we can do.
      return null;
    }
  };
}

// ES5 15.2.3.3
// http://es5.github.com/#x15.2.3.3

var doesGetOwnPropertyDescriptorWork = function doesGetOwnPropertyDescriptorWork(object) {
  try {
    object.sentinel = 0;
    return Object.getOwnPropertyDescriptor(object, 'sentinel').value === 0;
  } catch (exception) {
    return false;
  }
};

// check whether getOwnPropertyDescriptor works if it's given. Otherwise, shim partially.
if (Object.defineProperty) {
  var getOwnPropertyDescriptorWorksOnObject = doesGetOwnPropertyDescriptorWork({});
  var getOwnPropertyDescriptorWorksOnDom = typeof document === 'undefined' ||
  doesGetOwnPropertyDescriptorWork(document.createElement('div'));
  if (!getOwnPropertyDescriptorWorksOnDom || !getOwnPropertyDescriptorWorksOnObject) {
    var getOwnPropertyDescriptorFallback = Object.getOwnPropertyDescriptor;
  }
}

if (!Object.getOwnPropertyDescriptor || getOwnPropertyDescriptorFallback) {
  var ERR_NON_OBJECT = 'Object.getOwnPropertyDescriptor called on a non-object: ';

  /* eslint-disable no-proto */
  Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
    if (typeof object !== 'object' && typeof object !== 'function' || object === null) {
      throw new TypeError(ERR_NON_OBJECT + object);
    }

    // make a valiant attempt to use the real getOwnPropertyDescriptor
    // for I8's DOM elements.
    if (getOwnPropertyDescriptorFallback) {
      try {
        return getOwnPropertyDescriptorFallback.call(Object, object, property);
      } catch (exception) {
        // try the shim if the real one doesn't work
      }
    }

    var descriptor;

    // If object does not owns property return undefined immediately.
    if (!owns(object, property)) {
      return descriptor;
    }

    // If object has a property then it's for sure `configurable`, and
    // probably `enumerable`. Detect enumerability though.
    descriptor = {
      enumerable: isEnumerable(object, property),
      configurable: true
    };

    // If JS engine supports accessor properties then property may be a
    // getter or setter.
    if (supportsAccessors) {
      // Unfortunately `__lookupGetter__` will return a getter even
      // if object has own non getter property along with a same named
      // inherited getter. To avoid misbehavior we temporary remove
      // `__proto__` so that `__lookupGetter__` will return getter only
      // if it's owned by an object.
      var prototype = object.__proto__;
      var notPrototypeOfObject = object !== prototypeOfObject;
      // avoid recursion problem, breaking in Opera Mini when
      // Object.getOwnPropertyDescriptor(Object.prototype, 'toString')
      // or any other Object.prototype accessor
      if (notPrototypeOfObject) {
        object.__proto__ = prototypeOfObject;
      }

      var getter = lookupGetter(object, property);
      var setter = lookupSetter(object, property);

      if (notPrototypeOfObject) {
        // Once we have getter and setter we can put values back.
        object.__proto__ = prototype;
      }

      if (getter || setter) {
        if (getter) {
          descriptor.get = getter;
        }
        if (setter) {
          descriptor.set = setter;
        }
        // If it was accessor property we're done and return here
        // in order to avoid adding `value` to the descriptor.
        return descriptor;
      }
    }

    // If we got this far we know that object has an own property that is
    // not an accessor so we set it as a value and return descriptor.
    descriptor.value = object[property];
    descriptor.writable = true;
    return descriptor;
  };
  /* eslint-enable no-proto */
}

// ES5 15.2.3.4
// http://es5.github.com/#x15.2.3.4
if (!Object.getOwnPropertyNames) {
  Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
    return Object.keys(object);
  };
}

// ES5 15.2.3.5
// http://es5.github.com/#x15.2.3.5
if (!Object.create) {

  // Contributed by Brandon Benvie, October, 2012
  var createEmpty;
  var supportsProto = !({ __proto__: null } instanceof Object);
            // the following produces false positives
            // in Opera Mini => not a reliable check
            // Object.prototype.__proto__ === null

  // Check for document.domain and active x support
  // No need to use active x approach when document.domain is not set
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  /* global ActiveXObject */
  var shouldUseActiveX = function shouldUseActiveX() {
    // return early if document.domain not set
    if (!document.domain) {
      return false;
    }

    try {
      return !!new ActiveXObject('htmlfile');
    } catch (exception) {
      return false;
    }
  };

  // This supports IE8 when document.domain is used
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  var getEmptyViaActiveX = function getEmptyViaActiveX() {
    var empty;
    var xDoc;

    xDoc = new ActiveXObject('htmlfile');

    xDoc.write('<script><\/script>');
    xDoc.close();

    empty = xDoc.parentWindow.Object.prototype;
    xDoc = null;

    return empty;
  };

  // The original implementation using an iframe
  // before the activex approach was added
  // see https://github.com/es-shims/es5-shim/issues/150
  var getEmptyViaIFrame = function getEmptyViaIFrame() {
    var iframe = document.createElement('iframe');
    var parent = document.body || document.documentElement;
    var empty;

    iframe.style.display = 'none';
    parent.appendChild(iframe);
    /* eslint-disable no-script-url */
    iframe.src = 'javascript:';
    /* eslint-enable no-script-url */

    empty = iframe.contentWindow.Object.prototype;
    parent.removeChild(iframe);
    iframe = null;

    return empty;
  };

  /* global document */
  if (supportsProto || typeof document === 'undefined') {
    createEmpty = function () {
      return { __proto__: null };
    };
  } else {
    // In old IE __proto__ can't be used to manually set `null`, nor does
    // any other method exist to make an object that inherits from nothing,
    // aside from Object.prototype itself. Instead, create a new global
    // object and *steal* its Object.prototype and strip it bare. This is
    // used as the prototype to create nullary objects.
    createEmpty = function () {
      // Determine which approach to use
      // see https://github.com/es-shims/es5-shim/issues/150
      var empty = shouldUseActiveX() ? getEmptyViaActiveX() : getEmptyViaIFrame();

      delete empty.constructor;
      delete empty.hasOwnProperty;
      delete empty.propertyIsEnumerable;
      delete empty.isPrototypeOf;
      delete empty.toLocaleString;
      delete empty.toString;
      delete empty.valueOf;

      var Empty = function Empty() {};
      Empty.prototype = empty;
      // short-circuit future calls
      createEmpty = function () {
        return new Empty();
      };
      return new Empty();
    };
  }

  Object.create = function create(prototype, properties) {

    var object;
    var Type = function Type() {}; // An empty constructor.

    if (prototype === null) {
      object = createEmpty();
    } else {
      if (typeof prototype !== 'object' && typeof prototype !== 'function') {
        // In the native implementation `parent` can be `null`
        // OR *any* `instanceof Object`  (Object|Function|Array|RegExp|etc)
        // Use `typeof` tho, b/c in old IE, DOM elements are not `instanceof Object`
        // like they are in modern browsers. Using `Object.create` on DOM elements
        // is...err...probably inappropriate, but the native version allows for it.
        throw new TypeError('Object prototype may only be an Object or null'); // same msg as Chrome
      }
      Type.prototype = prototype;
      object = new Type();
      // IE has no built-in implementation of `Object.getPrototypeOf`
      // neither `__proto__`, but this manually setting `__proto__` will
      // guarantee that `Object.getPrototypeOf` will work as expected with
      // objects created using `Object.create`
      /* eslint-disable no-proto */
      object.__proto__ = prototype;
      /* eslint-enable no-proto */
    }

    if (properties !== void 0) {
      Object.defineProperties(object, properties);
    }

    return object;
  };
}

// ES5 15.2.3.6
// http://es5.github.com/#x15.2.3.6

// Patch for WebKit and IE8 standard mode
// Designed by hax <hax.github.com>
// related issue: https://github.com/es-shims/es5-shim/issues#issue/5
// IE8 Reference:
//   http://msdn.microsoft.com/en-us/library/dd282900.aspx
//   http://msdn.microsoft.com/en-us/library/dd229916.aspx
// WebKit Bugs:
//   https://bugs.webkit.org/show_bug.cgi?id=36423

var doesDefinePropertyWork = function doesDefinePropertyWork(object) {
  try {
    Object.defineProperty(object, 'sentinel', {});
    return 'sentinel' in object;
  } catch (exception) {
    return false;
  }
};

// check whether defineProperty works if it's given. Otherwise,
// shim partially.
if (Object.defineProperty) {
  var definePropertyWorksOnObject = doesDefinePropertyWork({});
  var definePropertyWorksOnDom = typeof document === 'undefined' ||
    doesDefinePropertyWork(document.createElement('div'));
  if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
    var definePropertyFallback = Object.defineProperty,
      definePropertiesFallback = Object.defineProperties;
  }
}

if (!Object.defineProperty || definePropertyFallback) {
  var ERR_NON_OBJECT_DESCRIPTOR = 'Property description must be an object: ';
  var ERR_NON_OBJECT_TARGET = 'Object.defineProperty called on non-object: ';
  var ERR_ACCESSORS_NOT_SUPPORTED = 'getters & setters can not be defined on this javascript engine';

  Object.defineProperty = function defineProperty(object, property, descriptor) {
    if (typeof object !== 'object' && typeof object !== 'function' || object === null) {
      throw new TypeError(ERR_NON_OBJECT_TARGET + object);
    }
    if (typeof descriptor !== 'object' && typeof descriptor !== 'function' || descriptor === null) {
      throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
    }
    // make a valiant attempt to use the real defineProperty
    // for I8's DOM elements.
    if (definePropertyFallback) {
      try {
        return definePropertyFallback.call(Object, object, property, descriptor);
      } catch (exception) {
        // try the shim if the real one doesn't work
      }
    }

    // If it's a data property.
    if ('value' in descriptor) {
      // fail silently if 'writable', 'enumerable', or 'configurable'
      // are requested but not supported
      /*
      // alternate approach:
      if ( // can't implement these features; allow false but not true
        ('writable' in descriptor && !descriptor.writable) ||
        ('enumerable' in descriptor && !descriptor.enumerable) ||
        ('configurable' in descriptor && !descriptor.configurable)
      ))
        throw new RangeError(
          'This implementation of Object.defineProperty does not support configurable, enumerable, or writable.'
        );
      */

      if (supportsAccessors && (lookupGetter(object, property) || lookupSetter(object, property))) {
        // As accessors are supported only on engines implementing
        // `__proto__` we can safely override `__proto__` while defining
        // a property to make sure that we don't hit an inherited
        // accessor.
        /* eslint-disable no-proto */
        var prototype = object.__proto__;
        object.__proto__ = prototypeOfObject;
        // Deleting a property anyway since getter / setter may be
        // defined on object itself.
        delete object[property];
        object[property] = descriptor.value;
        // Setting original `__proto__` back now.
        object.__proto__ = prototype;
        /* eslint-enable no-proto */
      } else {
        object[property] = descriptor.value;
      }
    } else {
      if (!supportsAccessors && ('get' in descriptor || 'set' in descriptor)) {
        throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
      }
      // If we got that far then getters and setters can be defined !!
      if ('get' in descriptor) {
        defineGetter(object, property, descriptor.get);
      }
      if ('set' in descriptor) {
        defineSetter(object, property, descriptor.set);
      }
    }
    return object;
  };
}

// ES5 15.2.3.7
// http://es5.github.com/#x15.2.3.7
if (!Object.defineProperties || definePropertiesFallback) {
  Object.defineProperties = function defineProperties(object, properties) {
    // make a valiant attempt to use the real defineProperties
    if (definePropertiesFallback) {
      try {
        return definePropertiesFallback.call(Object, object, properties);
      } catch (exception) {
        // try the shim if the real one doesn't work
      }
    }

    Object.keys(properties).forEach(function (property) {
      if (property !== '__proto__') {
        Object.defineProperty(object, property, properties[property]);
      }
    });
    return object;
  };
}

// ES5 15.2.3.8
// http://es5.github.com/#x15.2.3.8
if (!Object.seal) {
  Object.seal = function seal(object) {
    if (Object(object) !== object) {
      throw new TypeError('Object.seal can only be called on Objects.');
    }
    // this is misleading and breaks feature-detection, but
    // allows "securable" code to "gracefully" degrade to working
    // but insecure code.
    return object;
  };
}

// ES5 15.2.3.9
// http://es5.github.com/#x15.2.3.9
if (!Object.freeze) {
  Object.freeze = function freeze(object) {
    if (Object(object) !== object) {
      throw new TypeError('Object.freeze can only be called on Objects.');
    }
    // this is misleading and breaks feature-detection, but
    // allows "securable" code to "gracefully" degrade to working
    // but insecure code.
    return object;
  };
}

// detect a Rhino bug and patch it
try {
  Object.freeze(function () {});
} catch (exception) {
  Object.freeze = (function (freezeObject) {
    return function freeze(object) {
      if (typeof object === 'function') {
        return object;
      } else {
        return freezeObject(object);
      }
    };
  }(Object.freeze));
}

// ES5 15.2.3.10
// http://es5.github.com/#x15.2.3.10
if (!Object.preventExtensions) {
  Object.preventExtensions = function preventExtensions(object) {
    if (Object(object) !== object) {
      throw new TypeError('Object.preventExtensions can only be called on Objects.');
    }
    // this is misleading and breaks feature-detection, but
    // allows "securable" code to "gracefully" degrade to working
    // but insecure code.
    return object;
  };
}

// ES5 15.2.3.11
// http://es5.github.com/#x15.2.3.11
if (!Object.isSealed) {
  Object.isSealed = function isSealed(object) {
    if (Object(object) !== object) {
      throw new TypeError('Object.isSealed can only be called on Objects.');
    }
    return false;
  };
}

// ES5 15.2.3.12
// http://es5.github.com/#x15.2.3.12
if (!Object.isFrozen) {
  Object.isFrozen = function isFrozen(object) {
    if (Object(object) !== object) {
      throw new TypeError('Object.isFrozen can only be called on Objects.');
    }
    return false;
  };
}

// ES5 15.2.3.13
// http://es5.github.com/#x15.2.3.13
if (!Object.isExtensible) {
  Object.isExtensible = function isExtensible(object) {
    // 1. If Type(O) is not Object throw a TypeError exception.
    if (Object(object) !== object) {
      throw new TypeError('Object.isExtensible can only be called on Objects.');
    }
    // 2. Return the Boolean value of the [[Extensible]] internal property of O.
    var name = '';
    while (owns(object, name)) {
      name += '?';
    }
    object[name] = true;
    var returnValue = owns(object, name);
    delete object[name];
    return returnValue;
  };
}

}));
;'use strict';

if (!Array.prototype.find) {
      Object.defineProperty(Array.prototype, 'find', {
            value: function value(predicate) {
                  // 1. Let O be ? ToObject(this value).
                  if (this == null) {
                        throw new TypeError('"this" is null or not defined');
                  }

                  var o = Object(this);

                  // 2. Let len be ? ToLength(? Get(O, "length")).
                  var len = o.length >>> 0;

                  // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                  if (typeof predicate !== 'function') {
                        throw new TypeError('predicate must be a function');
                  }

                  // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                  var thisArg = arguments[1];

                  // 5. Let k be 0.
                  var k = 0;

                  // 6. Repeat, while k < len
                  while (k < len) {
                        // a. Let Pk be ! ToString(k).
                        // b. Let kValue be ? Get(O, Pk).
                        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                        // d. If testResult is true, return kValue.
                        var kValue = o[k];
                        if (predicate.call(thisArg, kValue, k, o)) {
                              return kValue;
                        }
                        // e. Increase k by 1.
                        k++;
                  }

                  // 7. Return undefined.
                  return undefined;
            },
            configurable: true,
            writable: true
      });
};"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//  json2.js
//  2017-06-12
//  Public Domain.
//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
//  NOT CONTROL.

//  This file creates a global JSON object containing two methods: stringify
//  and parse. This file provides the ES5 JSON capability to ES3 systems.
//  If a project might run on IE8 or earlier, then this file should be included.
//  This file does nothing on ES5 systems.

//      JSON.stringify(value, replacer, space)
//          value       any JavaScript value, usually an object or array.
//          replacer    an optional parameter that determines how object
//                      values are stringified for objects. It can be a
//                      function or an array of strings.
//          space       an optional parameter that specifies the indentation
//                      of nested structures. If it is omitted, the text will
//                      be packed without extra whitespace. If it is a number,
//                      it will specify the number of spaces to indent at each
//                      level. If it is a string (such as "\t" or "&nbsp;"),
//                      it contains the characters used to indent at each level.
//          This method produces a JSON text from a JavaScript value.
//          When an object value is found, if the object contains a toJSON
//          method, its toJSON method will be called and the result will be
//          stringified. A toJSON method does not serialize: it returns the
//          value represented by the name/value pair that should be serialized,
//          or undefined if nothing should be serialized. The toJSON method
//          will be passed the key associated with the value, and this will be
//          bound to the value.

//          For example, this would serialize Dates as ISO strings.

//              Date.prototype.toJSON = function (key) {
//                  function f(n) {
//                      // Format integers to have at least two digits.
//                      return (n < 10)
//                          ? "0" + n
//                          : n;
//                  }
//                  return this.getUTCFullYear()   + "-" +
//                       f(this.getUTCMonth() + 1) + "-" +
//                       f(this.getUTCDate())      + "T" +
//                       f(this.getUTCHours())     + ":" +
//                       f(this.getUTCMinutes())   + ":" +
//                       f(this.getUTCSeconds())   + "Z";
//              };

//          You can provide an optional replacer method. It will be passed the
//          key and value of each member, with this bound to the containing
//          object. The value that is returned from your method will be
//          serialized. If your method returns undefined, then the member will
//          be excluded from the serialization.

//          If the replacer parameter is an array of strings, then it will be
//          used to select the members to be serialized. It filters the results
//          such that only members with keys listed in the replacer array are
//          stringified.

//          Values that do not have JSON representations, such as undefined or
//          functions, will not be serialized. Such values in objects will be
//          dropped; in arrays they will be replaced with null. You can use
//          a replacer function to replace those with JSON values.

//          JSON.stringify(undefined) returns undefined.

//          The optional space parameter produces a stringification of the
//          value that is filled with line breaks and indentation to make it
//          easier to read.

//          If the space parameter is a non-empty string, then that string will
//          be used for indentation. If the space parameter is a number, then
//          the indentation will be that many spaces.

//          Example:

//          text = JSON.stringify(["e", {pluribus: "unum"}]);
//          // text is '["e",{"pluribus":"unum"}]'

//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

//          text = JSON.stringify([new Date()], function (key, value) {
//              return this[key] instanceof Date
//                  ? "Date(" + this[key] + ")"
//                  : value;
//          });
//          // text is '["Date(---current time---)"]'

//      JSON.parse(text, reviver)
//          This method parses a JSON text to produce an object or array.
//          It can throw a SyntaxError exception.

//          The optional reviver parameter is a function that can filter and
//          transform the results. It receives each of the keys and values,
//          and its return value is used instead of the original value.
//          If it returns what it received, then the structure is not modified.
//          If it returns undefined then the member is deleted.

//          Example:

//          // Parse the text. Values that look like ISO date strings will
//          // be converted to Date objects.

//          myData = JSON.parse(text, function (key, value) {
//              var a;
//              if (typeof value === "string") {
//                  a =
//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
//                  if (a) {
//                      return new Date(Date.UTC(
//                         +a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]
//                      ));
//                  }
//                  return value;
//              }
//          });

//          myData = JSON.parse(
//              "[\"Date(09/09/2001)\"]",
//              function (key, value) {
//                  var d;
//                  if (
//                      typeof value === "string"
//                      && value.slice(0, 5) === "Date("
//                      && value.slice(-1) === ")"
//                  ) {
//                      d = new Date(value.slice(5, -1));
//                      if (d) {
//                          return d;
//                      }
//                  }
//                  return value;
//              }
//          );

//  This is a reference implementation. You are free to copy, modify, or
//  redistribute.

/*jslint
    eval, for, this
*/

/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if ((typeof JSON === "undefined" ? "undefined" : _typeof(JSON)) !== "object") {
    JSON = {};
}

(function () {
    "use strict";

    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? "0" + n : n;
    }

    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== "function") {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap;
    var indent;
    var meta;
    var rep;

    function quote(string) {

        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string) ? "\"" + string.replace(rx_escapable, function (a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        }) + "\"" : "\"" + string + "\"";
    }

    function str(key, holder) {

        // Produce a string from holder[key].

        var i; // The loop counter.
        var k; // The member key.
        var v; // The member value.
        var length;
        var mind = gap;
        var partial;
        var value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.

        if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === "function") {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.

        switch (typeof value === "undefined" ? "undefined" : _typeof(value)) {
            case "string":
                return quote(value);

            case "number":

                // JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : "null";

            case "boolean":
            case "null":

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce "null". The case is included here in
                // the remote chance that this gets fixed someday.

                return String(value);

            // If the type is "object", we might be dealing with an object or an array or
            // null.

            case "object":

                // Due to a specification blunder in ECMAScript, typeof null is "object",
                // so watch out for that case.

                if (!value) {
                    return "null";
                }

                // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === "[object Array]") {

                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null";
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.

                    v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && (typeof rep === "undefined" ? "undefined" : _typeof(rep)) === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === "string") {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v);
                            }
                        }
                    }
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ": " : ":") + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                gap = mind;
                return v;
        }
    }

    // If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== "function") {
        meta = { // table of character substitutions
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
        JSON.stringify = function (value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i;
            gap = "";
            indent = "";

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " ";
                }

                // If the space parameter is a string, it will be used as the indent string.
            } else if (typeof space === "string") {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== "function" && ((typeof replacer === "undefined" ? "undefined" : _typeof(replacer)) !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
            }

            // Make a fake root object containing our value under the key of "".
            // Return the result of stringifying the value.

            return str("", { "": value });
        };
    }

    // If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== "function") {
        JSON.parse = function (text, reviver) {

            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                var k;
                var v;
                var value = holder[key];
                if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }

            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with "()" and "new"
            // because they can cause invocation, and "=" because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.

            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
            // replace all simple value tokens with "]" characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or "]" or
            // "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

            if (rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) {

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The "{" operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval("(" + text + ")");

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return typeof reviver === "function" ? walk({ "": j }, "") : j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError("JSON.parse");
        };
    }
})();;'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// ExtendScript - http://estk.aenhancers.com/index.html

/**
 * Returns a String of properties and method names of an object
 * @param {*} object 
 */
function describe(object) {
    var result = 'default';
    if (object === null || typeof object === 'undefined') {
        return "Object has no value";
    }
    result = "properties of :: " + object.toString() + '\n';
    // Use ExtendScript reflection methods to get info about the object
    object.reflect.methods.map(function (item) {
        result += "   method: " + item.name + '\n';
    });
    object.reflect.properties.map(function (item) {
        try {
            result += "   property: " + item.name + "=" + object[item.name].toString() + '\n';
        } catch (e) {
            result += "   property: " + item.name + " - " + e.toString() + '\n';
        }
    });
    return result;
}

function isCopyableKey(key) {
    key = key.toString();
    var copyable = true;
    try {
        if (key.indexOf('__') === 0 || key === 'reflect' || key === 'length' || key === 'parentProperty' // prevent circular references
        ) copyable = false;
    } catch (error) {
        copyable = false;
    }
    return copyable;
}

function isPrimitive(arg) {
    if (arg === null || arg === undefined) return true;
    var type = typeof arg === 'undefined' ? 'undefined' : _typeof(arg);
    return type != "object" && type != "function";
}

function cloneAsSafeValue(object, depth, logErrors) {
    if (depth === undefined) depth = 1;
    var isObject = object instanceof Object;
    var isArray = object instanceof Array;
    if (isPrimitive(object)) return object;

    if (depth === 0) return isPrimitive(object) ? object : object.toString();

    var properties = object.reflect.properties;
    var result = isArray ? [] : {};

    if (properties.length === 0 && !isArray) result = { '__': '__' // default value to prevent silly bug when object empty which adds a \n causing it to not be parsed

        // handle object
    };for (var index = 0; index < properties.length; index++) {
        var key = properties[index].toString();

        try {
            if (!isCopyableKey(key)) continue;
            var propertyValue = object[key];
            var safeValue = cloneAsSafeValue(propertyValue, depth - 1);
            if (safeValue === undefined) continue;

            if (!isArray) result[key] = safeValue;else result.push(safeValue);
        } catch (e) {
            if (logErrors) log.error(e.toString());
        }
    }
    //return result
    return result;
}

function makeLogger(name, logLocation) {
    var logFile = File(logLocation);
    logFile.open("w"); // open for writing and replace contents
    logFile.encoding = "UTF-8";
    logFile.writeln('created logger: ' + name);
    function expandObject(object) {
        if (object instanceof Object) {
            return JSON.stringify(cloneAsSafeValue(object, 10));
        }
        return object;
    }

    return {
        info: function info(message) {
            return logFile.writeln('info: ' + expandObject(message));
        },
        error: function error(message) {
            return logFile.writeln('error: ' + expandObject(message));
        },
        close: function close() {
            return logFile.close();
        }
    };
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

    for (var keyIndex = 1; keyIndex <= property.numKeys; keyIndex++) {
        var keyframe = {
            index: keyIndex,
            time: property.keyTime(keyIndex),
            value: property.keyValue(keyIndex),
            keyInInterpolationType: property.keyInInterpolationType(keyIndex),
            keyInSpatialTangent: property.keyInSpatialTangent(keyIndex),
            keyInTemporalEase: property.keyInTemporalEase(keyIndex),
            keySpatialContinuous: property.keySpatialContinuous(keyIndex),
            keyTemporalAutoBezier: property.keyTemporalAutoBezier(keyIndex),
            keyOutInterpolationType: property.keyOutInterpolationType(keyIndex),
            keyOutSpatialTangent: property.keyOutSpatialTangent(keyIndex),
            keyOutTemporalEase: property.keyOutTemporalEase(keyIndex),
            keyRoving: property.keyRoving(keyIndex)
        };
        fn(keyframe);
    }
}

function createKeyFrame(property, keyframe) {
    var keyIndex = property.addKey(keyframe.time);

    property.setValueAtKey(keyIndex, keyframe.value);
    property.setInterpolationTypeAtKey(keyIndex, keyframe.keyInInterpolationType, keyframe.keyOutInterpolationType);
    property.setSpatialTangentsAtKey(keyIndex, keyframe.keyInSpatialTangent, keyframe.keyOutSpatialTangent);
    property.setTemporalEaseAtKey(keyIndex, keyframe.keyInTemporalEase, keyframe.keyOutTemporalEase);
    property.setSpatialContinuousAtKey(keyIndex, keyframe.keySpatialContinuous);
    property.setTemporalAutoBezierAtKey(keyIndex, keyframe.keyTemporalAutoBezier);
    property.setRovingAtKey(keyIndex, keyframe.keyRoving);

    return keyIndex;
}

function copyKeyFramesFromLayerToLayer(sourceLayer, targetLayer, keyFramesOfProperty, adjustKeyframeFn) {
    var pointProperties = findProperties([sourceLayer], [{ name: keyFramesOfProperty }]);
    var targetPoints = findProperties([targetLayer], [{ name: keyFramesOfProperty }]);

    pointProperties.forEach(function (pointProperty) {
        forEachKeyFrame(pointProperty, function (keyframe) {
            // need to copy to the same point control by same name
            var targetPoint = targetPoints.find(function (point) {
                return point.parentProperty.name === pointProperty.parentProperty.name;
            });
            adjustKeyframeFn(keyframe);
            createKeyFrame(targetPoint, keyframe);
        });
    });
}

/**
 * Deeply traverse all properties
 * @param {*} layerOrProperty 
 * @param {*} fn 
 */
function forEachProperty(layerOrProperty, fn) {
    //write("Processing node: " + node.matchName + " - " + node.name);
    for (var propertyIndex = 1; propertyIndex <= layerOrProperty.numProperties; propertyIndex++) {
        property = layerOrProperty.property(propertyIndex);
        fn(property);
        if (property.propertyType == PropertyType.INDEXED_GROUP || property.propertyType == PropertyType.NAMED_GROUP) forEachProperty(property, fn);
    }
}

function propertySettingsAsJSON(layer) {
    var lookupMap = {};
    var propertiesJSON = [];
    forEachProperty(layer, function (property, parentProperty) {
        var value = null;
        try {
            value = property.value.toString();
        } catch (e) {}

        var propertySettings = {
            name: property.name,
            matchName: property.matchName,
            value: value,
            isEffect: property.isEffect,
            properties: []
        };

        if (true) {
            if (property.propertyDepth > 1) {
                lookupMap[property.parentProperty.name].properties.push(propertySettings);
            } else {
                // top level list
                propertiesJSON.push(propertySettings);
            }
        }

        lookupMap[propertySettings.name] = propertySettings;
    });

    return propertiesJSON;
}

function findProperties(layers, filters) {
    var foundProperties = [];
    layers.map(function (node) {
        forEachProperty(node, function (property) {
            if (!filters) foundProperties.push(property);else if (isFiltersMatched(property, filters)) foundProperties.push(property);
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
    for (var filterIndex = filters.length - 2; filterIndex >= 0; filterIndex--) {
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
    while (parent) {
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
    for (var key in filter) {
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

function findOrCreateProperty(parent, type, name) {
    write("find name: " + name);
    var properties = findProperties([parent], [{ name: name }]);
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

function makeLayersInterface(composite) {
    function layers() {
        var layerList = [];
        for (var index = 1; index <= composite.numLayers; index++) {
            layerList.push(composite.layer(index));
        }
        return layerList;
    }

    function findByName(name) {
        var foundLayer = null;
        layers().map(function (layer) {
            if (layer.name === name) foundLayer = layer;
        });
        return foundLayer;
    }

    function find(findFn) {
        var layerList = layers();
        for (var index = 0; index < layerList.length; index++) {
            var layer = layerList[index];
            if (findFn(layer)) return layer;
        }
    }

    function findPrevious(currentLayer) {
        var index = currentLayer.index; // index seems to be starting at 1 vs 0
        if (index > 1) return layers()[index - 2];
    }

    function findNext(currentLayer) {
        var index = currentLayer.index; // index seems to be starting at 1 vs 0
        var currentLayers = layers();
        var length = currentLayers.length;
        if (index <= length) return layers()[index];
    }

    function add(asset) {
        var layer = composite.layers.add(asset);
        layer.moveToEnd();
        return layer;
    }

    function addAll(assets, layerOverlap, onAddFn) {
        for (var index = 0; index < assets.length; index++) {
            var asset = assets[index];
            var layer = add(asset);
            var previousLayer = null;
            if (index > 0) {
                previousLayer = findPrevious(layer);
                layer.startTime = previousLayer.outPoint - layerOverlap;
            }
            autoScaleToComposite(layer);
            if (onAddFn(layer, previousLayer)) break;
        }
    }

    function addAdjustment(targetLayer, duration) {
        duration = duration ? duration : composite.duration;
        var layer = composite.layers.addSolid([1, 1, 1], name, composite.width, composite.height, composite.pixelAspect, composite.duration);
        layer.adjustmentLayer = true;
        layer.moveAbove(targetLayer);
        return layer;
    }

    /**
     * 
     * @param {*} originalLayer layer to be duplicated
     * @param {*} targetPlacement layer at which duplicate should be placed
     * @param {*} relativeLayerPosition relative position to target layer. -1 for above, 1 for below
     * @param {*} relativeTimePosition 0 to start at same time as target
     */
    function duplicate(originalLayer, targetPlacementLayer, relativeLayerPosition, relativeTimePosition, useInPointForRelativePosition) {
        var duplicateLayer = originalLayer.duplicate();
        var relativeTargetLayer = layers()[targetPlacementLayer.index + relativeLayerPosition];
        if (relativeLayerPosition < 0) duplicateLayer.moveBefore(relativeTargetLayer);else duplicateLayer.moveAfter(relativeTargetLayer);

        duplicateLayer.startTime = targetPlacementLayer.startTime + relativeTimePosition;
        // adjust startTime based on inPoint.  Useful when copying effect layers as templates
        if (useInPointForRelativePosition) duplicateLayer.startTime += -(duplicateLayer.inPoint - duplicateLayer.startTime);
        duplicateLayer.enabled = true;
        duplicateLayer.name = originalLayer.name;
        return duplicateLayer;
    }

    function autoScaleToComposite(layer) {
        var layerDimensions = layer.sourceRectAtTime(0, false);
        var scale = layer.property("Scale").value;
        var newScale = scale * Math.min(composite.width / layerDimensions.width, composite.height / layerDimensions.height);
        layer.property("Scale").setValue(newScale);
    }

    function findAllProperties(layerFilterFn, filters) {
        var filterLayers = layers().filter(layerFilterFn);
        return findProperties(filterLayers, filters);
    }

    return {
        layers: layers,
        findByName: findByName,
        find: find,
        findPrevious: findPrevious,
        findNext: findNext,
        add: add,
        addAll: addAll,
        addAdjustment: addAdjustment,
        duplicate: duplicate,
        autoScaleToComposite: autoScaleToComposite,
        findAllProperties: findAllProperties
    };
}

function makeAssetsInterface(project) {
    function assets() {
        var assets = [];
        for (var index = 1; index <= project.numItems; index++) {
            assets.push(project.item(index));
        }
        return assets;
    }

    function findByName(name) {
        var assetList = assets();
        for (var index = 0; index < assetList.length; index++) {
            var asset = assetList[index];
            if (asset.name === name) return asset;
        }
    }

    function find(findFn) {
        var assetList = assets();
        for (var index = 0; index < assetList.length; index++) {
            var asset = assetList[index];
            if (findFn(asset)) return asset;
        }
    }

    return {
        assets: assets,
        find: find,
        findByName: findByName
    };
}

function makeProjectInterface(project) {
    function importAssets(directory, fileFilterFn) {
        var path = new Folder(directory);
        log.info('importing assets from: ' + path.toString());
        var files = path.getFiles(fileFilterFn);
        var importedAssets = [];
        files.map(function (file) {
            if (file instanceof File) {
                // some could be folders
                var asset = project.importFile(new ImportOptions(file));
                importedAssets.push(asset);
            }
        });
        return importedAssets;
    }

    function importAsset(path) {
        var file = new File(path);
        var asset = project.importFile(new ImportOptions(file));
        return asset;
    }

    function addComposition(name, width, height, pixelAspect, duration, frameRate) {
        return project.items.addComp(name, width, height, pixelAspect, duration, frameRate);
    }

    return {
        importAssets: importAssets,
        importAsset: importAsset,
        addComposition: addComposition
    };
}

function makeInterfaces() {
    var assetsInterface = makeAssetsInterface(app.project);
    var projectInterface = makeProjectInterface(app.project);
    var composite = assetsInterface.find(function (asset) {
        return asset.typeName === 'Composition';
    }); // find existing composite.  Assumes only 1
    var layersInterface = makeLayersInterface(composite);
    return { assetsInterface: assetsInterface, projectInterface: projectInterface, layersInterface: layersInterface };
};'use strict';


            app.beginUndoGroup('node-script');
            app.beginSuppressDialogs();

            try {
                var log = makeLogger('script logger', 'C:\\development\\projects\\after-effects\\after_effects-script.log');
                var inputFromNode = [{"options":{"afterEffectsPath":"C:\\Program Files\\Adobe\\Adobe After Effects CC 2019","assetFolder":"C:\\development\\projects\\snackbar\\output","compositionMain":{"name":"render main","layerOverlapSeconds":2,"videoLengthLimitSeconds":120}
}
}
];
                var scriptResult = (function (optionsFromNode) {
    log.info('begin after effects script execution');

    var options = optionsFromNode.options;

    var assetsInterface = makeAssetsInterface(app.project);
    var projectInterface = makeProjectInterface(app.project);
    var layersInterface = makeLayersInterface(assetsInterface.findByName(options.compositionMain.name));
    var importedAssets = projectInterface.importAssets(options.assetFolder, '*.mp4');

    var videoEndTimes = [];

    log.info('creating layers');
    layersInterface.addAll(importedAssets, options.compositionMain.layerOverlapSeconds, function (layer, previousLayer) {
        log.info('  adding layer: ' + layer.name);

        if (previousLayer) {
            // make a list of the transition times to be used later
            videoEndTimes.push(previousLayer.outPoint);
        }

        if (layer.outPoint > options.compositionMain.videoLengthLimitSeconds) return true; // don't add anymore beyond 2 min
    });

    log.info('After Effects finished processing script');
    return videoEndTimes;
}).apply(this, inputFromNode);
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
                var file = File('C:\\development\\projects\\after-effects\\after-effects-script-results.json');
                log.info('result file: ' + file.fsName)
                file.open("w");
                file.write(result);
                file.close();
                delete $.result;
            })(JSON.stringify($.result));

            app.endUndoGroup();
            app.endSuppressDialogs(false);
            log.close();
            