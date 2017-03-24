(function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var vue = createCommonjsModule(function (module, exports) {
/*!
 * Vue.js v2.2.5
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
(function (global, factory) {
	module.exports = factory();
}(commonjsGlobal, (function () { 'use strict';

/*  */

/**
 * Convert a value to a string that is actually rendered.
 */
function _toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /([^-])([A-Z])/g;
var hyphenate = cached(function (str) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
var toString = Object.prototype.toString;
var OBJECT_STRING = '[object Object]';
function isPlainObject (obj) {
  return toString.call(obj) === OBJECT_STRING
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 */
function noop () {}

/**
 * Always return false.
 */
var no = function () { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      return JSON.stringify(a) === JSON.stringify(b)
    } catch (e) {
      // possible circular reference
      return a === b
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn();
    }
  }
}

/*  */

var config = {
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * List of asset types that a component can own.
   */
  _assetTypes: [
    'component',
    'directive',
    'filter'
  ],

  /**
   * List of lifecycle hooks.
   */
  _lifecycleHooks: [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated'
  ],

  /**
   * Max circular updates allowed in a scheduler flush cycle.
   */
  _maxUpdateCount: 100
};

/*  */

var emptyObject = Object.freeze({});

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */
/* globals MutationObserver */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof commonjsGlobal !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = commonjsGlobal['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

/**
 * Defer a task to execute it asynchronously.
 */
var nextTick = (function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;

  function nextTickHandler () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    var logError = function (err) { console.error(err); };
    timerFunc = function () {
      p.then(nextTickHandler).catch(logError);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
  } else if (typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS IE11, iOS7, Android 4.4
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = function () {
      setTimeout(nextTickHandler, 0);
    };
  }

  return function queueNextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) { cb.call(ctx); }
      if (_resolve) { _resolve(ctx); }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve) {
        _resolve = resolve;
      })
    }
  }
})();

var _Set;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

var warn = noop;
var tip = noop;
var formatComponentName;

{
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.error("[Vue warn]: " + msg + " " + (
        vm ? formatLocation(formatComponentName(vm)) : ''
      ));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + " " + (
        vm ? formatLocation(formatComponentName(vm)) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var name = typeof vm === 'string'
      ? vm
      : typeof vm === 'function' && vm.options
        ? vm.options.name
        : vm._isVue
          ? vm.$options.name || vm.$options._componentTag
          : vm.name;

    var file = vm._isVue && vm.$options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var formatLocation = function (str) {
    if (str === "<Anonymous>") {
      str += " - use the \"name\" option for better debugging messages.";
    }
    return ("\n(found in " + str + ")")
  };
}

/*  */


var uid$1 = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid$1++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var arguments$1 = arguments;

    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length;
    var args = new Array(i);
    while (i--) {
      args[i] = arguments$1[i];
    }
    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
        inserted = args;
        break
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true,
  isSettingProps: false
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value)) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ("development" !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && typeof key === 'number') {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (hasOwn(target, key)) {
    target[key] = val;
    return val
  }
  var ob = (target ).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && typeof key === 'number') {
    target.splice(key, 1);
    return
  }
  var ob = (target ).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
{
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (typeof childVal !== 'function') {
      "development" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        childVal.call(this),
        parentVal.call(this)
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : undefined;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

config._lifecycleHooks.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (parentVal, childVal) {
  var res = Object.create(parentVal || null);
  return childVal
    ? extend(res, childVal)
    : res
}

config._assetTypes.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal) {
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key in childVal) {
    var parent = ret[key];
    var child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent
      ? parent.concat(child)
      : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.computed = function (parentVal, childVal) {
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  extend(ret, childVal);
  return ret
};

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    var lower = key.toLowerCase();
    if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + key
      );
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  }
  options.props = res;
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  {
    checkComponents(child);
  }
  normalizeProps(child);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = typeof extendsFrom === 'function'
      ? mergeOptions(parent, extendsFrom.options, vm)
      : mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      var mixin = child.mixins[i];
      if (mixin.prototype instanceof Vue$3) {
        mixin = mixin.options;
      }
      parent = mergeOptions(parent, mixin, vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ("development" !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ("development" !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      'Invalid prop: type check failed for prop "' + name + '".' +
      ' Expected ' + expectedTypes.map(capitalize).join(', ') +
      ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.',
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

/**
 * Assert the type of a value
 */
function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (expectedType === 'String') {
    valid = typeof value === (expectedType = 'string');
  } else if (expectedType === 'Number') {
    valid = typeof value === (expectedType = 'number');
  } else if (expectedType === 'Boolean') {
    valid = typeof value === (expectedType = 'boolean');
  } else if (expectedType === 'Function') {
    valid = typeof value === (expectedType = 'function');
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match && match[1]
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}

function handleError (err, vm, info) {
  if (config.errorHandler) {
    config.errorHandler.call(null, err, vm, info);
  } else {
    {
      warn(("Error in " + info + ":"), vm);
    }
    /* istanbul ignore else */
    if (inBrowser && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }
}

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

{
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      "referenced during render. Make sure to declare reactive data " +
      "properties in the data option.",
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

var mark;
var measure;

{
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.functionalContext = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
};

var prototypeAccessors = { child: {} };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function () {
  var node = new VNode();
  node.text = '';
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isCloned = true;
  return cloned
}

function cloneVNodes (vnodes) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i]);
  }
  return res
}

/*  */

var normalizeEvent = cached(function (name) {
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      for (var i = 0; i < fns.length; i++) {
        fns[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, cur, old, event;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (!cur) {
      "development" !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (!old) {
      if (!cur.fns) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (!on[name]) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (!oldHook) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (oldHook.fns && oldHook.merged) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (c == null || typeof c === 'boolean') { continue }
    last = res[res.length - 1];
    //  nested
    if (Array.isArray(c)) {
      res.push.apply(res, normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i)));
    } else if (isPrimitive(c)) {
      if (last && last.text) {
        last.text += String(c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (c.text && last && last.text) {
        res[res.length - 1] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (c.tag && c.key == null && nestedIndex != null) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function getFirstComponentChild (children) {
  return children && children.filter(function (c) { return c && c.componentOptions; })[0]
}

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once$$1) {
  if (once$$1) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        this$1.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (arguments.length === 1) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        cbs[i].apply(vm, args);
      }
    }
    return vm
  };
}

/*  */

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  var defaultSlot = [];
  var name, child;
  for (var i = 0, l = children.length; i < l; i++) {
    child = children[i];
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.functionalContext === context) &&
        child.data && (name = child.data.slot)) {
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      defaultSlot.push(child);
    }
  }
  // ignore whitespace
  if (!defaultSlot.every(isWhitespace)) {
    slots.default = defaultSlot;
  }
  return slots
}

function isWhitespace (node) {
  return node.isComment || node.text === ' '
}

function resolveScopedSlots (
  fns
) {
  var res = {};
  for (var i = 0; i < fns.length; i++) {
    res[fns[i][0]] = fns[i][1];
  }
  return res
}

/*  */

var activeInstance = null;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if ("development" !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure((name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure((name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  vm._watcher = new Watcher(vm, updateComponent, noop);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render
  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    {
      observerState.isSettingProps = true;
    }
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    {
      observerState.isSettingProps = false;
    }
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive == null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */


var queue = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  queue.length = 0;
  has = {};
  {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id, vm;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ("development" !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > config._maxUpdateCount) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // reset scheduler before updated hook called
  var oldQueue = queue.slice();
  resetSchedulerState();

  // call updated hooks
  index = oldQueue.length;
  while (index--) {
    watcher = oldQueue[index];
    vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i >= 0 && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(Math.max(i, index) + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options
) {
  this.vm = vm;
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = expOrFn.toString();
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      "development" !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  if (this.user) {
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    }
  } else {
    value = this.getter.call(vm, vm);
  }
  // "touch" every property so they are all tracked as
  // dependencies for deep watching
  if (this.deep) {
    traverse(value);
  }
  popTarget();
  this.cleanupDeps();
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
var seenObjects = new _Set();
function traverse (val) {
  seenObjects.clear();
  _traverse(val, seenObjects);
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch) { initWatch(vm, opts.watch); }
}

var isReservedProp = { key: 1, ref: 1, slot: 1 };

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    {
      if (isReservedProp[key]) {
        warn(
          ("\"" + key + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (vm.$parent && !observerState.isSettingProps) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    "development" !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var i = keys.length;
  while (i--) {
    if (props && hasOwn(props, keys[i])) {
      "development" !== 'production' && warn(
        "The data property \"" + (keys[i]) + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(keys[i])) {
      proxy(vm, "_data", keys[i]);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  try {
    return data.call(vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  var watchers = vm._computedWatchers = Object.create(null);

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    // create internal watcher for the computed property.
    watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions);

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    }
  }
}

function defineComputed (target, key, userDef) {
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
    {
      if (methods[key] == null) {
        warn(
          "method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
    }
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (vm, key, handler) {
  var options;
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  vm.$watch(key, handler, options);
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    if (!vnode.componentInstance._isMounted) {
      vnode.componentInstance._isMounted = true;
      callHook(vnode.componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      activateChildComponent(vnode.componentInstance, true /* direct */);
    }
  },

  destroy: function destroy (vnode) {
    if (!vnode.componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        vnode.componentInstance.$destroy();
      } else {
        deactivateChildComponent(vnode.componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (!Ctor) {
    return
  }

  var baseCtor = context.$options._base;
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  if (typeof Ctor !== 'function') {
    {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  if (!Ctor.cid) {
    if (Ctor.resolved) {
      Ctor = Ctor.resolved;
    } else {
      Ctor = resolveAsyncComponent(Ctor, baseCtor, function () {
        // it's ok to queue this on every render because
        // $forceUpdate is buffered by the scheduler.
        context.$forceUpdate();
      });
      if (!Ctor) {
        // return nothing if this is indeed an async component
        // wait for the callback to trigger parent update.
        return
      }
    }
  }

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  data = data || {};

  // transform component v-model data into props & events
  if (data.model) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractProps(data, Ctor, tag);

  // functional component
  if (Ctor.options.functional) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  data.on = data.nativeOn;

  if (Ctor.options.abstract) {
    // abstract components do not keep anything
    // other than props & listeners
    data = {};
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }
  );
  return vnode
}

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  context,
  children
) {
  var props = {};
  var propOptions = Ctor.options.props;
  if (propOptions) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData);
    }
  }
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var _context = Object.create(context);
  var h = function (a, b, c, d) { return createElement(_context, a, b, c, d, true); };
  var vnode = Ctor.options.render.call(null, h, {
    props: props,
    data: data,
    parent: context,
    children: children,
    slots: function () { return resolveSlots(children, context); }
  });
  if (vnode instanceof VNode) {
    vnode.functionalContext = context;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (inlineTemplate) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options)
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  cb
) {
  if (factory.requested) {
    // pool callbacks
    factory.pendingCallbacks.push(cb);
  } else {
    factory.requested = true;
    var cbs = factory.pendingCallbacks = [cb];
    var sync = true;

    var resolve = function (res) {
      if (isObject(res)) {
        res = baseCtor.extend(res);
      }
      // cache resolved
      factory.resolved = res;
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        for (var i = 0, l = cbs.length; i < l; i++) {
          cbs[i](res);
        }
      }
    };

    var reject = function (reason) {
      "development" !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
    };

    var res = factory(resolve, reject);

    // handle promise
    if (res && typeof res.then === 'function' && !factory.resolved) {
      res.then(resolve, reject);
    }

    sync = false;
    // return in case resolved synchronously
    return factory.resolved
  }
}

function extractProps (data, Ctor, tag) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (!propOptions) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  var domProps = data.domProps;
  if (attrs || props || domProps) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && attrs.hasOwnProperty(keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the delared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey) ||
      checkProp(res, domProps, key, altKey);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (hash) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (on[event]) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (alwaysNormalize) { normalizationType = ALWAYS_NORMALIZE; }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (data && data.__ob__) {
    "development" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
      typeof children[0] === 'function') {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (vnode) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    return
  }
  if (vnode.children) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (child.tag && !child.ns) {
        applyNS(child, ns);
      }
    }
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      extend(props, bindObject);
    }
    return scopedSlotFn(props) || fallback
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes && "development" !== 'production') {
      slotNodes._rendered && warn(
        "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
        "- this will likely cause render errors.",
        this
      );
      slotNodes._rendered = true;
    }
    return slotNodes || fallback
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias
) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (Array.isArray(keyCodes)) {
    return keyCodes.indexOf(eventKeyCode) === -1
  } else {
    return keyCodes !== eventKeyCode
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp
) {
  if (value) {
    if (!isObject(value)) {
      "development" !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      for (var key in value) {
        if (key === 'class' || key === 'style') {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];
        }
      }
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var tree = this._staticTrees[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = this._staticTrees[index] =
    this.$options.staticRenderFns[index].call(this._renderProxy);
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function initRender (vm) {
  vm.$vnode = null; // the placeholder node in parent tree
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null;
  var parentVnode = vm.$options._parentVnode;
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };
}

function renderMixin (Vue) {
  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var staticRenderFns = ref.staticRenderFns;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // clone slot nodes on re-renders
      for (var key in vm.$slots) {
        vm.$slots[key] = cloneVNodes(vm.$slots[key]);
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

    if (staticRenderFns && !vm._staticTrees) {
      vm._staticTrees = [];
    }
    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render function");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      {
        vnode = vm.$options.renderError
          ? vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
          : vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ("development" !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };

  // internal render helpers.
  // these are exposed on the instance prototype to reduce generated render
  // code size.
  Vue.prototype._o = markOnce;
  Vue.prototype._n = toNumber;
  Vue.prototype._s = _toString;
  Vue.prototype._l = renderList;
  Vue.prototype._t = renderSlot;
  Vue.prototype._q = looseEqual;
  Vue.prototype._i = looseIndexOf;
  Vue.prototype._m = renderStatic;
  Vue.prototype._f = resolveFilter;
  Vue.prototype._k = checkKeyCodes;
  Vue.prototype._b = bindObjectProps;
  Vue.prototype._v = createTextVNode;
  Vue.prototype._e = createEmptyVNode;
  Vue.prototype._u = resolveScopedSlots;
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var inject = vm.$options.inject;
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    // isArray here
    var isArray = Array.isArray(inject);
    var keys = isArray
      ? inject
      : hasSymbol
        ? Reflect.ownKeys(inject)
        : Object.keys(inject);

    var loop = function ( i ) {
      var key = keys[i];
      var provideKey = isArray ? key : inject[key];
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          /* istanbul ignore else */
          {
            defineReactive$$1(vm, key, source._provided[provideKey], function () {
              warn(
                "Avoid mutating an injected value directly since the changes will be " +
                "overwritten whenever the provided component re-renders. " +
                "injection being mutated: \"" + key + "\"",
                vm
              );
            });
          }
          break
        }
        source = source.$parent;
      }
    };

    for (var i = 0; i < keys.length; i++) loop( i );
  }
}

/*  */

var uid = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      startTag = "vue-perf-init:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    {
      initProxy(vm);
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(((vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent;
  opts.propsData = options.propsData;
  opts._parentVnode = options._parentVnode;
  opts._parentListeners = options._parentListeners;
  opts._renderChildren = options._renderChildren;
  opts._componentTag = options._componentTag;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;
  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    for (var i = 0; i < latest.length; i++) {
      if (sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue$3 (options) {
  if ("development" !== 'production' &&
    !(this instanceof Vue$3)) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    /* istanbul ignore if */
    if (plugin.installed) {
      return
    }
    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    plugin.installed = true;
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characters and the hyphen, ' +
          'and must start with a letter.'
        );
      }
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    config._assetTypes.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  config._assetTypes.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            );
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

var patternTypes = [String, RegExp];

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (pattern instanceof RegExp) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (cache, filter) {
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cachedNode);
        cache[key] = null;
      }
    }
  }
}

function pruneCacheEntry (vnode) {
  if (vnode) {
    if (!vnode.componentInstance._inactive) {
      callHook(vnode.componentInstance, 'deactivated');
    }
    vnode.componentInstance.$destroy();
  }
}

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes
  },

  created: function created () {
    this.cache = Object.create(null);
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache[key]);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this.cache, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this.cache, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var vnode = getFirstComponentChild(this.$slots.default);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      if (name && (
        (this.include && !matches(this.include, name)) ||
        (this.exclude && matches(this.exclude, name))
      )) {
        return vnode
      }
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (this.cache[key]) {
        vnode.componentInstance = this.cache[key].componentInstance;
      } else {
        this.cache[key] = vnode;
      }
      vnode.data.keepAlive = true;
    }
    return vnode
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  config._assetTypes.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Vue$3.version = '2.2.5';

/*  */

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (childNode.componentInstance) {
    childNode = childNode.componentInstance._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return genClassFromData(data)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: child.class
      ? [child.class, parent.class]
      : parent.class
  }
}

function genClassFromData (data) {
  var dynamicClass = data.class;
  var staticClass = data.staticClass;
  if (staticClass || dynamicClass) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  var res = '';
  if (!value) {
    return res
  }
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value)) {
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
      if (value[i]) {
        if ((stringified = stringifyClass(value[i]))) {
          res += stringified + ' ';
        }
      }
    }
    return res.slice(0, -1)
  }
  if (isObject(value)) {
    for (var key in value) {
      if (value[key]) { res += key + ' '; }
    }
    return res.slice(0, -1)
  }
  /* istanbul ignore next */
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      "development" !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (Array.isArray(refs[key]) && refs[key].indexOf(ref) < 0) {
        refs[key].push(ref);
      } else {
        refs[key] = [ref];
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *

/*
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function sameVnode (a, b) {
  return (
    a.key === b.key &&
    a.tag === b.tag &&
    a.isComment === b.isComment &&
    isDef(a.data) === isDef(b.data) &&
    sameInputType(a, b)
  )
}

// Some browsers do not support dynamically changing type for <input>
// so they need to be treated as different nodes
function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove$$1 () {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  var inPre = 0;
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      {
        if (data && data.pre) {
          inPre++;
        }
        if (
          !inPre &&
          !vnode.ns &&
          !(config.ignoredElements.length && config.ignoredElements.indexOf(tag) > -1) &&
          config.isUnknownElement(tag)
        ) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if ("development" !== 'production' && data && data.pre) {
        inPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref) {
    if (isDef(parent)) {
      if (isDef(ref)) {
        nodeOps.insertBefore(parent, elm, ref);
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    var ancestor = vnode;
    while (ancestor) {
      if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
        nodeOps.setAttribute(vnode.elm, i, '');
      }
      ancestor = ancestor.parent;
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
        i !== vnode.context &&
        isDef(i = i.$options._scopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if ("development" !== 'production' && !elmToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            );
          }
          if (sameVnode(elmToMove, newStartVnode)) {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          }
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }
    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
        isTrue(oldVnode.isStatic) &&
        vnode.key === oldVnode.key &&
        (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))) {
      vnode.elm = oldVnode.elm;
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }
    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }
    var elm = vnode.elm = oldVnode.elm;
    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var bailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  var isRenderedModule = makeMap('attrs,style,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue) {
    {
      if (!assertNodeMatch(elm, vnode)) {
        return false
      }
    }
    vnode.elm = elm;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          var childrenMatch = true;
          var childNode = elm.firstChild;
          for (var i$1 = 0; i$1 < children.length; i$1++) {
            if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue)) {
              childrenMatch = false;
              break
            }
            childNode = childNode.nextSibling;
          }
          // if childNode is not null, it means the actual childNodes list is
          // longer than the virtual children list.
          if (!childrenMatch || childNode) {
            if ("development" !== 'production' &&
                typeof console !== 'undefined' &&
                !bailed) {
              bailed = true;
              console.warn('Parent: ', elm);
              console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
            }
            return false
          }
        }
      }
      if (isDef(data)) {
        for (var key in data) {
          if (!isRenderedModule(key)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode) {
    if (isDef(vnode.tag)) {
      return (
        vnode.tag.indexOf('vue-component') === 0 ||
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute('server-rendered')) {
            oldVnode.removeAttribute('server-rendered');
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }
        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        if (isDef(vnode.parent)) {
          // component root element replaced.
          // update parent placeholder node element, recursively
          var ancestor = vnode.parent;
          while (ancestor) {
            ancestor.elm = vnode.elm;
            ancestor = ancestor.parent;
          }
          if (isPatchable(vnode)) {
            for (var i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, vnode.parent);
            }
          }
        }

        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  if (!oldVnode.data.attrs && !vnode.data.attrs) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (attrs.__ob__) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  /* istanbul ignore if */
  if (isIE9 && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (attrs[key] == null) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, key);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (!data.staticClass && !data.class &&
      (!oldData || (!oldData.staticClass && !oldData.class))) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (transitionClass) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + "," + args)
  }
}

/*  */

function baseWarn (msg) {
  console.error(("[Vue compiler]: " + msg));
}

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
}

function addAttr (el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important
) {
  // check capture modifier
  if (modifiers && modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers && modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  var events;
  if (modifiers && modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }
  var newHandler = { value: value, modifiers: modifiers };
  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

function getAndRemoveAttr (el, name) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  return val
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
        "? " + baseValueExpression + ".trim()" +
        ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: ("\"" + value + "\""),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode (
  value,
  assignment
) {
  var modelRs = parseModel(value);
  if (modelRs.idx === null) {
    return (value + "=" + assignment)
  } else {
    return "var $$exp = " + (modelRs.exp) + ", $$idx = " + (modelRs.idx) + ";" +
      "if (!Array.isArray($$exp)){" +
        value + "=" + assignment + "}" +
      "else{$$exp.splice($$idx, 1, " + assignment + ")}"
  }
}

/**
 * parse directive model to do the array update transform. a[idx] = val => $$a.splice($$idx, 1, val)
 *
 * for loop possible cases:
 *
 * - test
 * - test[idx]
 * - test[test1[idx]]
 * - test["a"][idx]
 * - xxx.test[a[a].test1[idx]]
 * - test.xxx.a["asa"][test1[idx]]
 *
 */

var len;
var str;
var chr;
var index$1;
var expressionPos;
var expressionEndPos;

function parseModel (val) {
  str = val;
  len = str.length;
  index$1 = expressionPos = expressionEndPos = 0;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    return {
      exp: val,
      idx: null
    }
  }

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.substring(0, expressionPos),
    idx: val.substring(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index$1)
}

function eof () {
  return index$1 >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index$1;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index$1;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model (
  el,
  dir,
  _warn
) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  {
    var dynamicType = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
    if (tag === 'input' && dynamicType) {
      warn$1(
        "<input :type=\"" + dynamicType + "\" v-model=\"" + value + "\">:\n" +
        "v-model does not support dynamic input types. Use v-if branches instead."
      );
    }
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead."
      );
    }
  }

  if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else {
    warn$1(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    );
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
      "?_i(" + value + "," + valueBinding + ")>-1" + (
        trueValueBinding === 'true'
          ? (":(" + value + ")")
          : (":_q(" + value + "," + trueValueBinding + ")")
      )
  );
  addHandler(el, CHECKBOX_RADIO_TOKEN,
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$c){$$i<0&&(" + value + "=$$a.concat($$v))}" +
      "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
    "}else{" + value + "=$$c}",
    null, true
  );
}

function genRadioModel (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, CHECKBOX_RADIO_TOKEN, genAssignmentCode(value, valueBinding), null, true);
}

function genSelect (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  var type = el.attrsMap.type;
  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number || type === 'number') {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  var event;
  /* istanbul ignore if */
  if (on[RANGE_TOKEN]) {
    // IE input[type=range] only supports `change` event
    event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  if (on[CHECKBOX_RADIO_TOKEN]) {
    // Chrome fires microtasks in between click/change, leads to #4521
    event = isChrome ? 'click' : 'change';
    on[event] = [].concat(on[CHECKBOX_RADIO_TOKEN], on[event] || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function add$1 (
  event,
  handler,
  once,
  capture
) {
  if (once) {
    var oldHandler = handler;
    var _target = target$1; // save current target element in closure
    handler = function (ev) {
      var res = arguments.length === 1
        ? oldHandler(ev)
        : oldHandler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, handler, capture, _target);
      }
    };
  }
  target$1.addEventListener(event, handler, capture);
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(event, handler, capture);
}

function updateDOMListeners (oldVnode, vnode) {
  if (!oldVnode.data.on && !vnode.data.on) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (!oldVnode.data.domProps && !vnode.data.domProps) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (props.__ob__) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (props[key] == null) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = cur == null ? '' : String(cur);
      if (shouldUpdateValue(elm, vnode, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (
  elm,
  vnode,
  checkVal
) {
  return (!elm.composing && (
    vnode.tag === 'option' ||
    isDirty(elm, checkVal) ||
    isInputChanged(elm, checkVal)
  ))
}

function isDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is not equal to the updated value
  return document.activeElement !== elm && elm.value !== checkVal
}

function isInputChanged (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if ((modifiers && modifiers.number) || elm.type === 'number') {
    return toNumber(value) !== toNumber(newVal)
  }
  if (modifiers && modifiers.trim) {
    return value.trim() !== newVal.trim()
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    el.style[normalize(name)] = val;
  }
};

var prefixes = ['Webkit', 'Moz', 'ms'];

var testEl;
var normalize = cached(function (prop) {
  testEl = testEl || document.createElement('div');
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in testEl.style)) {
    return prop
  }
  var upper = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < prefixes.length; i++) {
    var prefixed = prefixes[i] + upper;
    if (prefixed in testEl.style) {
      return prefixed
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (!data.staticStyle && !data.style &&
      !oldData.staticStyle && !oldData.style) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldVnode.data.staticStyle;
  var oldStyleBinding = oldVnode.data.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  vnode.data.style = style.__ob__ ? extend({}, style) : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (newStyle[name] == null) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    el.setAttribute('class', cur.trim());
  }
}

/*  */

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser && window.requestAnimationFrame
  ? window.requestAnimationFrame.bind(window)
  : setTimeout;

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  (el._transitionClasses || (el._transitionClasses = [])).push(cls);
  addClass(el, cls);
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (el._leaveCb) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (!data) {
    return
  }

  /* istanbul ignore if */
  if (el._enterCb || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if ("development" !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
          pendingNode.tag === vnode.tag &&
          pendingNode.elm._leaveCb) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (el._enterCb) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (!data) {
    return rm()
  }

  /* istanbul ignore if */
  if (el._leaveCb || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if ("development" !== 'production' && explicitLeaveDuration != null) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (!fn) { return false }
  var invokerFns = fn.fns;
  if (invokerFns) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (!vnode.data.show) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (!vnode.data.show) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var model$1 = {
  inserted: function inserted (el, binding, vnode) {
    if (vnode.tag === 'select') {
      var cb = function () {
        setSelected(el, binding, vnode.context);
      };
      cb();
      /* istanbul ignore if */
      if (isIE || isEdge) {
        setTimeout(cb, 0);
      }
    } else if (vnode.tag === 'textarea' || el.type === 'text' || el.type === 'password') {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },
  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var needReset = el.multiple
        ? binding.value.some(function (v) { return hasNoMatchingOption(v, el.options); })
        : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, el.options);
      if (needReset) {
        trigger(el, 'change');
      }
    }
  }
};

function setSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    "development" !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  for (var i = 0, l = options.length; i < l; i++) {
    if (looseEqual(getValue(options[i]), value)) {
      return false
    }
  }
  return true
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition && !isIE9) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition = vnode.data && vnode.data.transition;
    if (transition && !isIE9) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: model$1,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  return /\d-keep-alive$/.test(rawChild.tag)
    ? h('keep-alive')
    : null
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag; });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if ("development" !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if ("development" !== 'production' &&
        mode && mode !== 'in-out' && mode !== 'out-in') {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (oldChild && oldChild.data && !isSameChild(child, oldChild)) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild && (oldChild.data.transition = extend({}, data));
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    var body = document.body;
    var f = body.offsetHeight; // eslint-disable-line

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      if (this._hasMove != null) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
setTimeout(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if ("development" !== 'production' && isChrome) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
  if ("development" !== 'production' &&
      config.productionTip !== false &&
      inBrowser && typeof console !== 'undefined') {
    console[console.info ? 'info' : 'log'](
      "You are running Vue in development mode.\n" +
      "Make sure to turn on production mode when deploying for production.\n" +
      "See more tips at https://vuejs.org/guide/deployment.html"
    );
  }
}, 0);

/*  */

// check whether current browser encodes a char inside attribute values
function shouldDecode (content, encoded) {
  var div = document.createElement('div');
  div.innerHTML = "<div a=\"" + content + "\">";
  return div.innerHTML.indexOf(encoded) > 0
}

// #3663
// IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? shouldDecode('\n', '&#10;') : false;

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/*  */

var decoder;

function decode (html) {
  decoder = decoder || document.createElement('div');
  decoder.innerHTML = html;
  return decoder.textContent
}

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
var singleAttrIdentifier = /([^\s"'<>/=]+)/;
var singleAttrAssign = /(?:=)/;
var singleAttrValues = [
  // attr value double quotes
  /"([^"]*)"+/.source,
  // attr value, single quotes
  /'([^']*)'+/.source,
  // attr value, no quotes
  /([^\s"'=<>`]+)/.source
];
var attribute = new RegExp(
  '^\\s*' + singleAttrIdentifier.source +
  '(?:\\s*(' + singleAttrAssign.source + ')' +
  '\\s*(?:' + singleAttrValues.join('|') + '))?'
);

// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
var startTagOpen = new RegExp('^<' + qnameCapture);
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
var doctype = /^<!DOCTYPE [^>]+>/i;
var comment = /^<!--/;
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10);/g;

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          continue
        }
      }

      var text = (void 0), rest$1 = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest$1 = html.slice(textEnd);
        while (
          !endTag.test(rest$1) &&
          !startTagOpen.test(rest$1) &&
          !comment.test(rest$1) &&
          !conditionalComment.test(rest$1)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest$1.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest$1 = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var endTagLength = 0;
      var rest = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest.length;
      html = rest;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if ("development" !== 'production' && !stack.length && options.warn) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || tagName === 'html' && lastTag === 'head' || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3]; }
        if (args[4] === '') { delete args[4]; }
        if (args[5] === '') { delete args[5]; }
      }
      var value = args[3] || args[4] || args[5] || '';
      attrs[i] = {
        name: args[1],
        value: decodeAttr(
          value,
          options.shouldDecodeNewlines
        )
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if ("development" !== 'production' &&
            (i > pos || !tagName) &&
            options.warn) {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});

function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)));
  }
  return tokens.join('+')
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
var forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;

var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(decode);

// configurable state
var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn$2 = options.warn || baseWarn;
  platformGetTagNamespace = options.getTagNamespace || no;
  platformMustUseProp = options.mustUseProp || no;
  platformIsPreTag = options.isPreTag || no;
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  transforms = pluckModuleFunction(options.modules, 'transformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');
  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce (msg) {
    if (!warned) {
      warned = true;
      warn$2(msg);
    }
  }

  function endPre (element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    start: function start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = {
        type: 1,
        tag: tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        parent: currentParent,
        children: []
      };
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        "development" !== 'production' && warn$2(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        preTransforms[i](element, options);
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else {
        processFor(element);
        processIf(element);
        processOnce(element);
        processKey(element);

        // determine whether this is a plain element after
        // removing structural attributes
        element.plain = !element.key && !attrs.length;

        processRef(element);
        processSlot(element);
        processComponent(element);
        for (var i$1 = 0; i$1 < transforms.length; i$1++) {
          transforms[i$1](element, options);
        }
        processAttrs(element);
      }

      function checkRootConstraints (el) {
        {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes.'
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            );
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead."
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) { // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        endPre(element);
      }
      // apply post-transforms
      for (var i$2 = 0; i$2 < postTransforms.length; i$2++) {
        postTransforms[i$2](element, options);
      }
    },

    end: function end () {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      endPre(element);
    },

    chars: function chars (text) {
      if (!currentParent) {
        {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } else if ((text = text.trim())) {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored.")
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
          currentParent.tag === 'textarea' &&
          currentParent.attrsMap.placeholder === text) {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var expression;
        if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: expression,
            text: text
          });
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if ("development" !== 'production' && el.tag === 'template') {
      warn$2("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var inMatch = exp.match(forAliasRE);
    if (!inMatch) {
      "development" !== 'production' && warn$2(
        ("Invalid v-for expression: " + exp)
      );
      return
    }
    el.for = inMatch[2].trim();
    var alias = inMatch[1].trim();
    var iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      el.alias = iteratorMatch[1].trim();
      el.iterator1 = iteratorMatch[2].trim();
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim();
      }
    } else {
      el.alias = alias;
    }
  }
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else {
    warn$2(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if ("development" !== 'production' && children[i].text !== ' ') {
        warn$2(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored."
        );
      }
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if ("development" !== 'production' && el.key) {
      warn$2(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead."
      );
    }
  } else {
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
    }
    if (el.tag === 'template') {
      el.slotScope = getAndRemoveAttr(el, 'scope');
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
        }
        if (isProp || platformMustUseProp(el.tag, el.attrsMap.type, name)) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if ("development" !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      {
        var expression = parseText(value, delimiters);
        if (expression) {
          warn$2(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          );
        }
      }
      addAttr(el, name, JSON.stringify(value));
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if ("development" !== 'production' && map[attrs[i].name] && !isIE) {
      warn$2('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic$1(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function markStatic$1 (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);
      if (!child.static) {
        node.static = false;
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      walkThroughConditionsBlocks(node.ifConditions, isInFor);
    }
  }
}

function walkThroughConditionsBlocks (conditionBlocks, isInFor) {
  for (var i = 1, len = conditionBlocks.length; i < len; i++) {
    markStaticRoots(conditionBlocks[i].block, isInFor);
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

// keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers (events, native) {
  var res = native ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    res += "\"" + name + "\":" + (genHandler(name, events[name])) + ",";
  }
  return res.slice(0, -1) + '}'
}

function genHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    return isMethodPath || isFunctionExpression
      ? handler.value
      : ("function($event){" + (handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? handler.value + '($event)'
      : isFunctionExpression
        ? ("(" + (handler.value) + ")($event)")
        : handler.value;
    return ("function($event){" + code + handlerCode + "}")
  }
}

function genKeyFilter (keys) {
  return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var alias = keyCodes[key];
  return ("_k($event.keyCode," + (JSON.stringify(key)) + (alias ? ',' + JSON.stringify(alias) : '') + ")")
}

/*  */

function bind$1 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + (dir.modifiers && dir.modifiers.prop ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  bind: bind$1,
  cloak: noop
};

/*  */

// configurable state
var warn$3;
var transforms$1;
var dataGenFns;
var platformDirectives$1;
var isPlatformReservedTag$1;
var staticRenderFns;
var onceCount;
var currentOptions;

function generate (
  ast,
  options
) {
  // save previous staticRenderFns so generate calls can be nested
  var prevStaticRenderFns = staticRenderFns;
  var currentStaticRenderFns = staticRenderFns = [];
  var prevOnceCount = onceCount;
  onceCount = 0;
  currentOptions = options;
  warn$3 = options.warn || baseWarn;
  transforms$1 = pluckModuleFunction(options.modules, 'transformCode');
  dataGenFns = pluckModuleFunction(options.modules, 'genData');
  platformDirectives$1 = options.directives || {};
  isPlatformReservedTag$1 = options.isReservedTag || no;
  var code = ast ? genElement(ast) : '_c("div")';
  staticRenderFns = prevStaticRenderFns;
  onceCount = prevOnceCount;
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: currentStaticRenderFns
  }
}

function genElement (el) {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el)
  } else if (el.for && !el.forProcessed) {
    return genFor(el)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el);
    } else {
      var data = el.plain ? undefined : genData(el);

      var children = el.inlineTemplate ? null : genChildren(el, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < transforms$1.length; i++) {
      code = transforms$1[i](el, code);
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el) {
  el.staticProcessed = true;
  staticRenderFns.push(("with(this){return " + (genElement(el)) + "}"));
  return ("_m(" + (staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}

// v-once
function genOnce (el) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      "development" !== 'production' && warn$3(
        "v-once can only be used inside v-for that is keyed. "
      );
      return genElement(el)
    }
    return ("_o(" + (genElement(el)) + "," + (onceCount++) + (key ? ("," + key) : "") + ")")
  } else {
    return genStatic(el)
  }
}

function genIf (el) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice())
}

function genIfConditions (conditions) {
  if (!conditions.length) {
    return '_e()'
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions)))
  } else {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return el.once ? genOnce(el) : genElement(el)
  }
}

function genFor (el) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if (
    "development" !== 'production' &&
    maybeComponent(el) && el.tag !== 'slot' && el.tag !== 'template' && !el.key
  ) {
    warn$3(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genElement(el)) +
    '})'
}

function genData (el) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < dataGenFns.length; i++) {
    data += dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true)) + ",";
  }
  // slot target
  if (el.slotTarget) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el.scopedSlots)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  return data
}

function genDirectives (el) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = platformDirectives$1[dir.name] || baseDirectives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, warn$3);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el) {
  var ast = el.children[0];
  if ("development" !== 'production' && (
    el.children.length > 1 || ast.type !== 1
  )) {
    warn$3('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, currentOptions);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots (slots) {
  return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) { return genScopedSlot(key, slots[key]); }).join(',')) + "])")
}

function genScopedSlot (key, el) {
  return "[" + key + ",function(" + (String(el.attrsMap.scope)) + "){" +
    "return " + (el.tag === 'template'
      ? genChildren(el) || 'void 0'
      : genElement(el)) + "}]"
}

function genChildren (el, checkSkip) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
        el$1.for &&
        el$1.tag !== 'template' &&
        el$1.tag !== 'slot') {
      return genElement(el$1)
    }
    var normalizationType = checkSkip ? getNormalizationType(children) : 0;
    return ("[" + (children.map(genNode).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (children) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function maybeComponent (el) {
  return !isPlatformReservedTag$1(el.tag)
}

function genNode (node) {
  if (node.type === 1) {
    return genElement(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genSlot (el) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs = el.attrs && ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (componentName, el) {
  var children = el.inlineTemplate ? null : genChildren(el, true);
  return ("_c(" + componentName + "," + (genData(el)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var res = '';
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
  }
  return res.slice(0, -1)
}

// #3895, #4268
function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// check valid identifier for v-for
var identRE = /[A-Za-z_$][\w$]*/;

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode (node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else if (onRE.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent (exp, text, errors) {
  var keywordMatch = exp.replace(stripStringRE, '').match(unaryOperatorsRE);
  if (keywordMatch) {
    errors.push(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
    );
  }
  checkExpression(exp, text, errors);
}

function checkFor (node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier (ident, type, text, errors) {
  if (typeof ident === 'string' && !identRE.test(ident)) {
    errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
  }
}

function checkExpression (exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
      );
    } else {
      errors.push(("invalid expression: " + (text.trim())));
    }
  }
}

/*  */

function baseCompile (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  optimize(ast, options);
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
}

function makeFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop
  }
}

function createCompiler (baseOptions) {
  var functionCompileCache = Object.create(null);

  function compile (
    template,
    options
  ) {
    var finalOptions = Object.create(baseOptions);
    var errors = [];
    var tips = [];
    finalOptions.warn = function (msg, tip$$1) {
      (tip$$1 ? tips : errors).push(msg);
    };

    if (options) {
      // merge custom modules
      if (options.modules) {
        finalOptions.modules = (baseOptions.modules || []).concat(options.modules);
      }
      // merge custom directives
      if (options.directives) {
        finalOptions.directives = extend(
          Object.create(baseOptions.directives),
          options.directives
        );
      }
      // copy other options
      for (var key in options) {
        if (key !== 'modules' && key !== 'directives') {
          finalOptions[key] = options[key];
        }
      }
    }

    var compiled = baseCompile(template, finalOptions);
    {
      errors.push.apply(errors, detectErrors(compiled.ast));
    }
    compiled.errors = errors;
    compiled.tips = tips;
    return compiled
  }

  function compileToFunctions (
    template,
    options,
    vm
  ) {
    options = options || {};

    /* istanbul ignore if */
    {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (functionCompileCache[key]) {
      return functionCompileCache[key]
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    {
      if (compiled.errors && compiled.errors.length) {
        warn(
          "Error compiling template:\n\n" + template + "\n\n" +
          compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
          vm
        );
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(function (msg) { return tip(msg, vm); });
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = makeFunction(compiled.render, fnGenErrors);
    var l = compiled.staticRenderFns.length;
    res.staticRenderFns = new Array(l);
    for (var i = 0; i < l; i++) {
      res.staticRenderFns[i] = makeFunction(compiled.staticRenderFns[i], fnGenErrors);
    }

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn(
          "Failed to generate render function:\n\n" +
          fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return ((err.toString()) + " in\n\n" + code + "\n");
        }).join('\n'),
          vm
        );
      }
    }

    return (functionCompileCache[key] = res)
  }

  return {
    compile: compile,
    compileToFunctions: compileToFunctions
  }
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if ("development" !== 'production' && staticClass) {
    var expression = parseText(staticClass, options.delimiters);
    if (expression) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData$1
};

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    {
      var expression = parseText(staticStyle, options.delimiters);
      if (expression) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$2 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$2
};

var modules$1 = [
  klass$1,
  style$1
];

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

var directives$1 = {
  model: model,
  text: text,
  html: html
};

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

var ref$1 = createCompiler(baseOptions);
var compileToFunctions = ref$1.compileToFunctions;

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});

var mount = Vue$3.prototype.$mount;
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    "development" !== 'production' && warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if ("development" !== 'production' && !template) {
            warn(
              ("Template element not found or is empty: " + (options.template)),
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile');
      }

      var ref = compileToFunctions(template, {
        shouldDecodeNewlines: shouldDecodeNewlines,
        delimiters: options.delimiters
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if ("development" !== 'production' && config.performance && mark) {
        mark('compile end');
        measure(((this._name) + " compile"), 'compile', 'compile end');
      }
    }
  }
  return mount.call(this, el, hydrating)
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue$3.compile = compileToFunctions;

return Vue$3;

})));
});

var index = function (byte) {
  if (byte < 1024) return byte + ' B';
  return 'KB, MB, GB, TB'.split(', ').reduce((current, next) => {
    if ( typeof current === 'string') return current;
    const format = current / 1024;
    return format <= 1024 ? format.toFixed(2) + ' ' + next : format;
  }, byte);
};

const $textarea = document.querySelector('paste');

var Item = { render: function () {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('li', { staticClass: "upload-item" }, [_c('span', { staticClass: "file-name" }, [_vm._v(_vm._s(_vm.file.name))]), _vm._v(" "), _c('span', { staticClass: "file-size" }, [_vm._v(_vm._s(_vm.size))]), _c('div', { staticClass: "progress" }, [_c('span', { ref: "bar", staticClass: "bar" })]), _vm.completed ? _c('button', { ref: "preview", staticClass: "preview", on: { "click": _vm.preview } }, [_vm._v("预览")]) : _vm._e(), _vm._v(" "), _vm.completed ? _c('button', { ref: "preview", staticClass: "copy-path", on: { "click": _vm.copyPath } }, [_vm._v("复制地址")]) : _vm._e(), _vm._v(" "), _c('input', { ref: "url", staticClass: "hide", attrs: { "name": "" } })]);
  }, staticRenderFns: [],
  name: 'upload-item',
  props: ['file'],
  data() {
    return {
      completed: false
    };
  },
  mounted() {
    this.bar = this.$refs.bar;
    this.urlInput = this.$refs.url;
  },
  methods: {
    complete() {
      this.completed = true;
      this.urlInput.value = this.file.sourceLink;
      console.info(this.file);
    },
    copyPath() {
      this.urlInput.value = this.file.sourceLink;
      this.urlInput.select();
      if (document.execCommand('copy')) {
        alert('复制成功， 可以粘贴使用了O(∩_∩)O');
      } else {
        $textarea.value = $textarea.value + this.file.sourceLink + '\n';
        alert('复制失败, 请手动复制上面文本框内的内容进行粘贴');
      }
    },
    preview() {
      window.open(this.file.sourceLink);
    }
  },
  computed: {
    size() {
      return index(this.file.size);
    }
  },
  watch: {
    'file.percent': function (val) {
      this.bar.style.width = val + '%';
      if (val === 100) {
        this.complete();
      }
    }
  }
};

var App = { render: function () {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { attrs: { "id": "upload-data" } }, _vm._l(_vm.files, function (file, index) {
      return _c('item', { attrs: { "file": file } });
    }));
  }, staticRenderFns: [],
  name: 'upload-data',
  data() {
    return {
      files: window.uploader.files
    };
  },
  components: {
    Item
  },
  methods: {},
  computed: {}
};

/*
* @Author: Jiang Guoxi
* @Date:   2017-03-25 00:05:04
* @Last Modified by:   Jiang Guoxi
* @Last Modified time: 2017-03-25 00:05:24
*/
var public_conf = {
  DOMAIN_NAME: 'http://onbsowgv2.bkt.clouddn.com/',
  // 空间名
  BUCKET_NAME: 'test-2'
};

window.isHttp = public_conf.DOMAIN_NAME.indexOf('https') !== 0;

var moxie$1 = createCommonjsModule(function (module) {
var MXI_DEBUG = true;
/**
 * mOxie - multi-runtime File API & XMLHttpRequest L2 Polyfill
 * v1.5.3
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 *
 * Date: 2017-02-02
 */
(function (global, factory) {
  var extract = function () {
    var ctx = {};
    factory.apply(ctx, arguments);
    return ctx.moxie;
  };

  if (typeof undefined === "function" && undefined.amd) {
    undefined("moxie", [], extract);
  } else if ('object' === "object" && module.exports) {
    module.exports = extract();
  } else {
    global.moxie = extract();
  }
})(commonjsGlobal || window, function () {
  /**
   * Compiled inline version. (Library mode)
   */

  /*jshint smarttabs:true, undef:true, latedef:true, curly:true, bitwise:true, camelcase:true */
  /*globals $code */

  (function (exports, undefined) {
    "use strict";

    var modules = {};

    function require(ids, callback) {
      var module,
          defs = [];

      for (var i = 0; i < ids.length; ++i) {
        module = modules[ids[i]] || resolve(ids[i]);
        if (!module) {
          throw 'module definition dependecy not found: ' + ids[i];
        }

        defs.push(module);
      }

      callback.apply(null, defs);
    }

    function define(id, dependencies, definition) {
      if (typeof id !== 'string') {
        throw 'invalid module definition, module id must be defined and be a string';
      }

      if (dependencies === undefined) {
        throw 'invalid module definition, dependencies must be specified';
      }

      if (definition === undefined) {
        throw 'invalid module definition, definition function must be specified';
      }

      require(dependencies, function () {
        modules[id] = definition.apply(null, arguments);
      });
    }

    function defined(id) {
      return !!modules[id];
    }

    function resolve(id) {
      var target = exports;
      var fragments = id.split(/[.\/]/);

      for (var fi = 0; fi < fragments.length; ++fi) {
        if (!target[fragments[fi]]) {
          return;
        }

        target = target[fragments[fi]];
      }

      return target;
    }

    function expose(ids) {
      for (var i = 0; i < ids.length; i++) {
        var target = exports;
        var id = ids[i];
        var fragments = id.split(/[.\/]/);

        for (var fi = 0; fi < fragments.length - 1; ++fi) {
          if (target[fragments[fi]] === undefined) {
            target[fragments[fi]] = {};
          }

          target = target[fragments[fi]];
        }

        target[fragments[fragments.length - 1]] = modules[id];
      }
    }

    // Included from: src/javascript/core/utils/Basic.js

    /**
     * Basic.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/core/utils/Basic
    @public
    @static
    */
    define('moxie/core/utils/Basic', [], function () {
      /**
      Gets the true type of the built-in object (better version of typeof).
      @author Angus Croll (http://javascriptweblog.wordpress.com/)
        @method typeOf
      @for Utils
      @static
      @param {Object} o Object to check.
      @return {String} Object [[Class]]
      */
      function typeOf(o) {
        var undef;

        if (o === undef) {
          return 'undefined';
        } else if (o === null) {
          return 'null';
        } else if (o.nodeType) {
          return 'node';
        }

        // the snippet below is awesome, however it fails to detect null, undefined and arguments types in IE lte 8
        return {}.toString.call(o).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
      }

      /**
      Extends the specified object with another object(s).
        @method extend
      @static
      @param {Object} target Object to extend.
      @param {Object} [obj]* Multiple objects to extend with.
      @return {Object} Same as target, the extended object.
      */
      function extend() {
        return merge(false, false, arguments);
      }

      /**
      Extends the specified object with another object(s), but only if the property exists in the target.
        @method extendIf
      @static
      @param {Object} target Object to extend.
      @param {Object} [obj]* Multiple objects to extend with.
      @return {Object} Same as target, the extended object.
      */
      function extendIf() {
        return merge(true, false, arguments);
      }

      function extendImmutable() {
        return merge(false, true, arguments);
      }

      function extendImmutableIf() {
        return merge(true, true, arguments);
      }

      function shallowCopy(obj) {
        switch (typeOf(obj)) {
          case 'array':
            return Array.prototype.slice.call(obj);

          case 'object':
            return extend({}, obj);
        }
        return obj;
      }

      function merge(strict, immutable, args) {
        var undef;
        var target = args[0];

        each(args, function (arg, i) {
          if (i > 0) {
            each(arg, function (value, key) {
              var isComplex = inArray(typeOf(value), ['array', 'object']) !== -1;

              if (value === undef || strict && target[key] === undef) {
                return true;
              }

              if (isComplex && immutable) {
                value = shallowCopy(value);
              }

              if (typeOf(target[key]) === typeOf(value) && isComplex) {
                merge(strict, immutable, [target[key], value]);
              } else {
                target[key] = value;
              }
            });
          }
        });

        return target;
      }

      /**
      A way to inherit one `class` from another in a consisstent way (more or less)
        @method inherit
      @static
      @since >1.4.1
      @param {Function} child
      @param {Function} parent
      @return {Function} Prepared constructor
      */
      function inherit(child, parent) {
        // copy over all parent properties
        for (var key in parent) {
          if ({}.hasOwnProperty.call(parent, key)) {
            child[key] = parent[key];
          }
        }

        // give child `class` a place to define its own methods
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();

        // keep a way to reference parent methods
        child.__parent__ = parent.prototype;
        return child;
      }

      /**
      Executes the callback function for each item in array/object. If you return false in the
      callback it will break the loop.
        @method each
      @static
      @param {Object} obj Object to iterate.
      @param {function} callback Callback function to execute for each item.
      */
      function each(obj, callback) {
        var length, key, i, undef;

        if (obj) {
          try {
            length = obj.length;
          } catch (ex) {
            length = undef;
          }

          if (length === undef || typeof length !== 'number') {
            // Loop object items
            for (key in obj) {
              if (obj.hasOwnProperty(key)) {
                if (callback(obj[key], key) === false) {
                  return;
                }
              }
            }
          } else {
            // Loop array items
            for (i = 0; i < length; i++) {
              if (callback(obj[i], i) === false) {
                return;
              }
            }
          }
        }
      }

      /**
      Checks if object is empty.
        @method isEmptyObj
      @static
      @param {Object} o Object to check.
      @return {Boolean}
      */
      function isEmptyObj(obj) {
        var prop;

        if (!obj || typeOf(obj) !== 'object') {
          return true;
        }

        for (prop in obj) {
          return false;
        }

        return true;
      }

      /**
      Recieve an array of functions (usually async) to call in sequence, each  function
      receives a callback as first argument that it should call, when it completes. Finally,
      after everything is complete, main callback is called. Passing truthy value to the
      callback as a first argument will interrupt the sequence and invoke main callback
      immediately.
        @method inSeries
      @static
      @param {Array} queue Array of functions to call in sequence
      @param {Function} cb Main callback that is called in the end, or in case of error
      */
      function inSeries(queue, cb) {
        var i = 0,
            length = queue.length;

        if (typeOf(cb) !== 'function') {
          cb = function () {};
        }

        if (!queue || !queue.length) {
          cb();
        }

        function callNext(i) {
          if (typeOf(queue[i]) === 'function') {
            queue[i](function (error) {
              /*jshint expr:true */
              ++i < length && !error ? callNext(i) : cb(error);
            });
          }
        }
        callNext(i);
      }

      /**
      Recieve an array of functions (usually async) to call in parallel, each  function
      receives a callback as first argument that it should call, when it completes. After
      everything is complete, main callback is called. Passing truthy value to the
      callback as a first argument will interrupt the process and invoke main callback
      immediately.
        @method inParallel
      @static
      @param {Array} queue Array of functions to call in sequence
      @param {Function} cb Main callback that is called in the end, or in case of erro
      */
      function inParallel(queue, cb) {
        var count = 0,
            num = queue.length,
            cbArgs = new Array(num);

        each(queue, function (fn, i) {
          fn(function (error) {
            if (error) {
              return cb(error);
            }

            var args = [].slice.call(arguments);
            args.shift(); // strip error - undefined or not

            cbArgs[i] = args;
            count++;

            if (count === num) {
              cbArgs.unshift(null);
              cb.apply(this, cbArgs);
            }
          });
        });
      }

      /**
      Find an element in array and return it's index if present, otherwise return -1.
        @method inArray
      @static
      @param {Mixed} needle Element to find
      @param {Array} array
      @return {Int} Index of the element, or -1 if not found
      */
      function inArray(needle, array) {
        if (array) {
          if (Array.prototype.indexOf) {
            return Array.prototype.indexOf.call(array, needle);
          }

          for (var i = 0, length = array.length; i < length; i++) {
            if (array[i] === needle) {
              return i;
            }
          }
        }
        return -1;
      }

      /**
      Returns elements of first array if they are not present in second. And false - otherwise.
        @private
      @method arrayDiff
      @param {Array} needles
      @param {Array} array
      @return {Array|Boolean}
      */
      function arrayDiff(needles, array) {
        var diff = [];

        if (typeOf(needles) !== 'array') {
          needles = [needles];
        }

        if (typeOf(array) !== 'array') {
          array = [array];
        }

        for (var i in needles) {
          if (inArray(needles[i], array) === -1) {
            diff.push(needles[i]);
          }
        }
        return diff.length ? diff : false;
      }

      /**
      Find intersection of two arrays.
        @private
      @method arrayIntersect
      @param {Array} array1
      @param {Array} array2
      @return {Array} Intersection of two arrays or null if there is none
      */
      function arrayIntersect(array1, array2) {
        var result = [];
        each(array1, function (item) {
          if (inArray(item, array2) !== -1) {
            result.push(item);
          }
        });
        return result.length ? result : null;
      }

      /**
      Forces anything into an array.
        @method toArray
      @static
      @param {Object} obj Object with length field.
      @return {Array} Array object containing all items.
      */
      function toArray(obj) {
        var i,
            arr = [];

        for (i = 0; i < obj.length; i++) {
          arr[i] = obj[i];
        }

        return arr;
      }

      /**
      Generates an unique ID. The only way a user would be able to get the same ID is if the two persons
      at the same exact millisecond manage to get the same 5 random numbers between 0-65535; it also uses
      a counter so each ID is guaranteed to be unique for the given page. It is more probable for the earth
      to be hit with an asteroid.
        @method guid
      @static
      @param {String} prefix to prepend (by default 'o' will be prepended).
      @method guid
      @return {String} Virtually unique id.
      */
      var guid = function () {
        var counter = 0;

        return function (prefix) {
          var guid = new Date().getTime().toString(32),
              i;

          for (i = 0; i < 5; i++) {
            guid += Math.floor(Math.random() * 65535).toString(32);
          }

          return (prefix || 'o_') + guid + (counter++).toString(32);
        };
      }();

      /**
      Trims white spaces around the string
        @method trim
      @static
      @param {String} str
      @return {String}
      */
      function trim(str) {
        if (!str) {
          return str;
        }
        return String.prototype.trim ? String.prototype.trim.call(str) : str.toString().replace(/^\s*/, '').replace(/\s*$/, '');
      }

      /**
      Parses the specified size string into a byte value. For example 10kb becomes 10240.
        @method parseSizeStr
      @static
      @param {String/Number} size String to parse or number to just pass through.
      @return {Number} Size in bytes.
      */
      function parseSizeStr(size) {
        if (typeof size !== 'string') {
          return size;
        }

        var muls = {
          t: 1099511627776,
          g: 1073741824,
          m: 1048576,
          k: 1024
        },
            mul;

        size = /^([0-9\.]+)([tmgk]?)$/.exec(size.toLowerCase().replace(/[^0-9\.tmkg]/g, ''));
        mul = size[2];
        size = +size[1];

        if (muls.hasOwnProperty(mul)) {
          size *= muls[mul];
        }
        return Math.floor(size);
      }

      /**
       * Pseudo sprintf implementation - simple way to replace tokens with specified values.
       *
       * @param {String} str String with tokens
       * @return {String} String with replaced tokens
       */
      function sprintf(str) {
        var args = [].slice.call(arguments, 1);

        return str.replace(/%[a-z]/g, function () {
          var value = args.shift();
          return typeOf(value) !== 'undefined' ? value : '';
        });
      }

      function delay(cb, timeout) {
        var self = this;
        setTimeout(function () {
          cb.call(self);
        }, timeout || 1);
      }

      return {
        guid: guid,
        typeOf: typeOf,
        extend: extend,
        extendIf: extendIf,
        extendImmutable: extendImmutable,
        extendImmutableIf: extendImmutableIf,
        inherit: inherit,
        each: each,
        isEmptyObj: isEmptyObj,
        inSeries: inSeries,
        inParallel: inParallel,
        inArray: inArray,
        arrayDiff: arrayDiff,
        arrayIntersect: arrayIntersect,
        toArray: toArray,
        trim: trim,
        sprintf: sprintf,
        parseSizeStr: parseSizeStr,
        delay: delay
      };
    });

    // Included from: src/javascript/core/utils/Encode.js

    /**
     * Encode.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define('moxie/core/utils/Encode', [], function () {

      /**
      @class moxie/core/utils/Encode
      */

      /**
      Encode string with UTF-8
        @method utf8_encode
      @for Utils
      @static
      @param {String} str String to encode
      @return {String} UTF-8 encoded string
      */
      var utf8_encode = function (str) {
        return unescape(encodeURIComponent(str));
      };

      /**
      Decode UTF-8 encoded string
        @method utf8_decode
      @static
      @param {String} str String to decode
      @return {String} Decoded string
      */
      var utf8_decode = function (str_data) {
        return decodeURIComponent(escape(str_data));
      };

      /**
      Decode Base64 encoded string (uses browser's default method if available),
      from: https://raw.github.com/kvz/phpjs/master/functions/url/base64_decode.js
        @method atob
      @static
      @param {String} data String to decode
      @return {String} Decoded string
      */
      var atob = function (data, utf8) {
        if (typeof window.atob === 'function') {
          return utf8 ? utf8_decode(window.atob(data)) : window.atob(data);
        }

        // http://kevin.vanzonneveld.net
        // +   original by: Tyler Akins (http://rumkin.com)
        // +   improved by: Thunder.m
        // +      input by: Aman Gupta
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfixed by: Onno Marsman
        // +   bugfixed by: Pellentesque Malesuada
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +      input by: Brett Zamir (http://brett-zamir.me)
        // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
        // *     returns 1: 'Kevin van Zonneveld'
        // mozilla has this native
        // - but breaks in 2.0.0.12!
        //if (typeof this.window.atob == 'function') {
        //    return atob(data);
        //}
        var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var o1,
            o2,
            o3,
            h1,
            h2,
            h3,
            h4,
            bits,
            i = 0,
            ac = 0,
            dec = "",
            tmp_arr = [];

        if (!data) {
          return data;
        }

        data += '';

        do {
          // unpack four hexets into three octets using index points in b64
          h1 = b64.indexOf(data.charAt(i++));
          h2 = b64.indexOf(data.charAt(i++));
          h3 = b64.indexOf(data.charAt(i++));
          h4 = b64.indexOf(data.charAt(i++));

          bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

          o1 = bits >> 16 & 0xff;
          o2 = bits >> 8 & 0xff;
          o3 = bits & 0xff;

          if (h3 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1);
          } else if (h4 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1, o2);
          } else {
            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
          }
        } while (i < data.length);

        dec = tmp_arr.join('');

        return utf8 ? utf8_decode(dec) : dec;
      };

      /**
      Base64 encode string (uses browser's default method if available),
      from: https://raw.github.com/kvz/phpjs/master/functions/url/base64_encode.js
        @method btoa
      @static
      @param {String} data String to encode
      @return {String} Base64 encoded string
      */
      var btoa = function (data, utf8) {
        if (utf8) {
          data = utf8_encode(data);
        }

        if (typeof window.btoa === 'function') {
          return window.btoa(data);
        }

        // http://kevin.vanzonneveld.net
        // +   original by: Tyler Akins (http://rumkin.com)
        // +   improved by: Bayron Guevara
        // +   improved by: Thunder.m
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfixed by: Pellentesque Malesuada
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   improved by: Rafał Kukawski (http://kukawski.pl)
        // *     example 1: base64_encode('Kevin van Zonneveld');
        // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
        // mozilla has this native
        // - but breaks in 2.0.0.12!
        var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var o1,
            o2,
            o3,
            h1,
            h2,
            h3,
            h4,
            bits,
            i = 0,
            ac = 0,
            enc = "",
            tmp_arr = [];

        if (!data) {
          return data;
        }

        do {
          // pack three octets into four hexets
          o1 = data.charCodeAt(i++);
          o2 = data.charCodeAt(i++);
          o3 = data.charCodeAt(i++);

          bits = o1 << 16 | o2 << 8 | o3;

          h1 = bits >> 18 & 0x3f;
          h2 = bits >> 12 & 0x3f;
          h3 = bits >> 6 & 0x3f;
          h4 = bits & 0x3f;

          // use hexets to index into b64, and append result to encoded string
          tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
        } while (i < data.length);

        enc = tmp_arr.join('');

        var r = data.length % 3;

        return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
      };

      return {
        utf8_encode: utf8_encode,
        utf8_decode: utf8_decode,
        atob: atob,
        btoa: btoa
      };
    });

    // Included from: src/javascript/core/utils/Env.js

    /**
     * Env.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define("moxie/core/utils/Env", ["moxie/core/utils/Basic"], function (Basic) {

      /**
       * UAParser.js v0.7.7
       * Lightweight JavaScript-based User-Agent string parser
       * https://github.com/faisalman/ua-parser-js
       *
       * Copyright © 2012-2015 Faisal Salman <fyzlman@gmail.com>
       * Dual licensed under GPLv2 & MIT
       */
      var UAParser = function (undefined) {

        //////////////
        // Constants
        /////////////


        var EMPTY = '',
            UNKNOWN = '?',
            FUNC_TYPE = 'function',
            UNDEF_TYPE = 'undefined',
            OBJ_TYPE = 'object',
            MAJOR = 'major',
            MODEL = 'model',
            NAME = 'name',
            TYPE = 'type',
            VENDOR = 'vendor',
            VERSION = 'version',
            ARCHITECTURE = 'architecture',
            CONSOLE = 'console',
            MOBILE = 'mobile',
            TABLET = 'tablet';

        ///////////
        // Helper
        //////////


        var util = {
          has: function (str1, str2) {
            return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
          },
          lowerize: function (str) {
            return str.toLowerCase();
          }
        };

        ///////////////
        // Map helper
        //////////////


        var mapper = {

          rgx: function () {

            // loop through all regexes maps
            for (var result, i = 0, j, k, p, q, matches, match, args = arguments; i < args.length; i += 2) {

              var regex = args[i],
                  // even sequence (0,2,4,..)
              props = args[i + 1]; // odd sequence (1,3,5,..)

              // construct object barebones
              if (typeof result === UNDEF_TYPE) {
                result = {};
                for (p in props) {
                  q = props[p];
                  if (typeof q === OBJ_TYPE) {
                    result[q[0]] = undefined;
                  } else {
                    result[q] = undefined;
                  }
                }
              }

              // try matching uastring with regexes
              for (j = k = 0; j < regex.length; j++) {
                matches = regex[j].exec(this.getUA());
                if (!!matches) {
                  for (p = 0; p < props.length; p++) {
                    match = matches[++k];
                    q = props[p];
                    // check if given property is actually array
                    if (typeof q === OBJ_TYPE && q.length > 0) {
                      if (q.length == 2) {
                        if (typeof q[1] == FUNC_TYPE) {
                          // assign modified match
                          result[q[0]] = q[1].call(this, match);
                        } else {
                          // assign given value, ignore regex match
                          result[q[0]] = q[1];
                        }
                      } else if (q.length == 3) {
                        // check whether function or regex
                        if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                          // call function (usually string mapper)
                          result[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                        } else {
                          // sanitize match using given regex
                          result[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                        }
                      } else if (q.length == 4) {
                        result[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                      }
                    } else {
                      result[q] = match ? match : undefined;
                    }
                  }
                  break;
                }
              }

              if (!!matches) break; // break the loop immediately if match found
            }
            return result;
          },

          str: function (str, map) {

            for (var i in map) {
              // check if array
              if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
                for (var j = 0; j < map[i].length; j++) {
                  if (util.has(map[i][j], str)) {
                    return i === UNKNOWN ? undefined : i;
                  }
                }
              } else if (util.has(map[i], str)) {
                return i === UNKNOWN ? undefined : i;
              }
            }
            return str;
          }
        };

        ///////////////
        // String map
        //////////////


        var maps = {

          browser: {
            oldsafari: {
              major: {
                '1': ['/8', '/1', '/3'],
                '2': '/4',
                '?': '/'
              },
              version: {
                '1.0': '/8',
                '1.2': '/1',
                '1.3': '/3',
                '2.0': '/412',
                '2.0.2': '/416',
                '2.0.3': '/417',
                '2.0.4': '/419',
                '?': '/'
              }
            }
          },

          device: {
            sprint: {
              model: {
                'Evo Shift 4G': '7373KT'
              },
              vendor: {
                'HTC': 'APA',
                'Sprint': 'Sprint'
              }
            }
          },

          os: {
            windows: {
              version: {
                'ME': '4.90',
                'NT 3.11': 'NT3.51',
                'NT 4.0': 'NT4.0',
                '2000': 'NT 5.0',
                'XP': ['NT 5.1', 'NT 5.2'],
                'Vista': 'NT 6.0',
                '7': 'NT 6.1',
                '8': 'NT 6.2',
                '8.1': 'NT 6.3',
                'RT': 'ARM'
              }
            }
          }
        };

        //////////////
        // Regex map
        /////////////


        var regexes = {

          browser: [[

          // Presto based
          /(opera\smini)\/([\w\.-]+)/i, // Opera Mini
          /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i, // Opera Mobi/Tablet
          /(opera).+version\/([\w\.]+)/i, // Opera > 9.80
          /(opera)[\/\s]+([\w\.]+)/i // Opera < 9.80

          ], [NAME, VERSION], [/\s(opr)\/([\w\.]+)/i // Opera Webkit
          ], [[NAME, 'Opera'], VERSION], [

          // Mixed
          /(kindle)\/([\w\.]+)/i, // Kindle
          /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,
          // Lunascape/Maxthon/Netfront/Jasmine/Blazer

          // Trident based
          /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
          // Avant/IEMobile/SlimBrowser/Baidu
          /(?:ms|\()(ie)\s([\w\.]+)/i, // Internet Explorer

          // Webkit/KHTML based
          /(rekonq)\/([\w\.]+)*/i, // Rekonq
          /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi)\/([\w\.-]+)/i
          // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron
          ], [NAME, VERSION], [/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i // IE11
          ], [[NAME, 'IE'], VERSION], [/(edge)\/((\d+)?[\w\.]+)/i // Microsoft Edge
          ], [NAME, VERSION], [/(yabrowser)\/([\w\.]+)/i // Yandex
          ], [[NAME, 'Yandex'], VERSION], [/(comodo_dragon)\/([\w\.]+)/i // Comodo Dragon
          ], [[NAME, /_/g, ' '], VERSION], [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i,
          // Chrome/OmniWeb/Arora/Tizen/Nokia
          /(uc\s?browser|qqbrowser)[\/\s]?([\w\.]+)/i
          // UCBrowser/QQBrowser
          ], [NAME, VERSION], [/(dolfin)\/([\w\.]+)/i // Dolphin
          ], [[NAME, 'Dolphin'], VERSION], [/((?:android.+)crmo|crios)\/([\w\.]+)/i // Chrome for Android/iOS
          ], [[NAME, 'Chrome'], VERSION], [/XiaoMi\/MiuiBrowser\/([\w\.]+)/i // MIUI Browser
          ], [VERSION, [NAME, 'MIUI Browser']], [/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)/i // Android Browser
          ], [VERSION, [NAME, 'Android Browser']], [/FBAV\/([\w\.]+);/i // Facebook App for iOS
          ], [VERSION, [NAME, 'Facebook']], [/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i // Mobile Safari
          ], [VERSION, [NAME, 'Mobile Safari']], [/version\/([\w\.]+).+?(mobile\s?safari|safari)/i // Safari & Safari Mobile
          ], [VERSION, NAME], [/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i // Safari < 3.0
          ], [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]], [/(konqueror)\/([\w\.]+)/i, // Konqueror
          /(webkit|khtml)\/([\w\.]+)/i], [NAME, VERSION], [

          // Gecko based
          /(navigator|netscape)\/([\w\.-]+)/i // Netscape
          ], [[NAME, 'Netscape'], VERSION], [/(swiftfox)/i, // Swiftfox
          /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
          // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
          /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,
          // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
          /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i, // Mozilla

          // Other
          /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf)[\/\s]?([\w\.]+)/i,
          // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf
          /(links)\s\(([\w\.]+)/i, // Links
          /(gobrowser)\/?([\w\.]+)*/i, // GoBrowser
          /(ice\s?browser)\/v?([\w\._]+)/i, // ICE Browser
          /(mosaic)[\/\s]([\w\.]+)/i // Mosaic
          ], [NAME, VERSION]],

          engine: [[/windows.+\sedge\/([\w\.]+)/i // EdgeHTML
          ], [VERSION, [NAME, 'EdgeHTML']], [/(presto)\/([\w\.]+)/i, // Presto
          /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i, // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m
          /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, // KHTML/Tasman/Links
          /(icab)[\/\s]([23]\.[\d\.]+)/i // iCab
          ], [NAME, VERSION], [/rv\:([\w\.]+).*(gecko)/i // Gecko
          ], [VERSION, NAME]],

          os: [[

          // Windows based
          /microsoft\s(windows)\s(vista|xp)/i // Windows (iTunes)
          ], [NAME, VERSION], [/(windows)\snt\s6\.2;\s(arm)/i, // Windows RT
          /(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i], [NAME, [VERSION, mapper.str, maps.os.windows.version]], [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i], [[NAME, 'Windows'], [VERSION, mapper.str, maps.os.windows.version]], [

          // Mobile/Embedded OS
          /\((bb)(10);/i // BlackBerry 10
          ], [[NAME, 'BlackBerry'], VERSION], [/(blackberry)\w*\/?([\w\.]+)*/i, // Blackberry
          /(tizen)[\/\s]([\w\.]+)/i, // Tizen
          /(android|webos|palm\os|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,
          // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki
          /linux;.+(sailfish);/i // Sailfish OS
          ], [NAME, VERSION], [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i // Symbian
          ], [[NAME, 'Symbian'], VERSION], [/\((series40);/i // Series 40
          ], [NAME], [/mozilla.+\(mobile;.+gecko.+firefox/i // Firefox OS
          ], [[NAME, 'Firefox OS'], VERSION], [

          // Console
          /(nintendo|playstation)\s([wids3portablevu]+)/i, // Nintendo/Playstation

          // GNU/Linux based
          /(mint)[\/\s\(]?(\w+)*/i, // Mint
          /(mageia|vectorlinux)[;\s]/i, // Mageia/VectorLinux
          /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i,
          // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
          // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
          /(hurd|linux)\s?([\w\.]+)*/i, // Hurd/Linux
          /(gnu)\s?([\w\.]+)*/i // GNU
          ], [NAME, VERSION], [/(cros)\s[\w]+\s([\w\.]+\w)/i // Chromium OS
          ], [[NAME, 'Chromium OS'], VERSION], [

          // Solaris
          /(sunos)\s?([\w\.]+\d)*/i // Solaris
          ], [[NAME, 'Solaris'], VERSION], [

          // BSD based
          /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
          ], [NAME, VERSION], [/(ip[honead]+)(?:.*os\s*([\w]+)*\slike\smac|;\sopera)/i // iOS
          ], [[NAME, 'iOS'], [VERSION, /_/g, '.']], [/(mac\sos\sx)\s?([\w\s\.]+\w)*/i, /(macintosh|mac(?=_powerpc)\s)/i // Mac OS
          ], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [

          // Other
          /((?:open)?solaris)[\/\s-]?([\w\.]+)*/i, // Solaris
          /(haiku)\s(\w+)/i, // Haiku
          /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i, // AIX
          /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,
          // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS
          /(unix)\s?([\w\.]+)*/i // UNIX
          ], [NAME, VERSION]]
        };

        /////////////////
        // Constructor
        ////////////////


        var UAParser = function (uastring) {

          var ua = uastring || (window && window.navigator && window.navigator.userAgent ? window.navigator.userAgent : EMPTY);

          this.getBrowser = function () {
            return mapper.rgx.apply(this, regexes.browser);
          };
          this.getEngine = function () {
            return mapper.rgx.apply(this, regexes.engine);
          };
          this.getOS = function () {
            return mapper.rgx.apply(this, regexes.os);
          };
          this.getResult = function () {
            return {
              ua: this.getUA(),
              browser: this.getBrowser(),
              engine: this.getEngine(),
              os: this.getOS()
            };
          };
          this.getUA = function () {
            return ua;
          };
          this.setUA = function (uastring) {
            ua = uastring;
            return this;
          };
          this.setUA(ua);
        };

        return UAParser;
      }();

      function version_compare(v1, v2, operator) {
        // From: http://phpjs.org/functions
        // +      original by: Philippe Jausions (http://pear.php.net/user/jausions)
        // +      original by: Aidan Lister (http://aidanlister.com/)
        // + reimplemented by: Kankrelune (http://www.webfaktory.info/)
        // +      improved by: Brett Zamir (http://brett-zamir.me)
        // +      improved by: Scott Baker
        // +      improved by: Theriault
        // *        example 1: version_compare('8.2.5rc', '8.2.5a');
        // *        returns 1: 1
        // *        example 2: version_compare('8.2.50', '8.2.52', '<');
        // *        returns 2: true
        // *        example 3: version_compare('5.3.0-dev', '5.3.0');
        // *        returns 3: -1
        // *        example 4: version_compare('4.1.0.52','4.01.0.51');
        // *        returns 4: 1

        // Important: compare must be initialized at 0.
        var i = 0,
            x = 0,
            compare = 0,

        // vm maps textual PHP versions to negatives so they're less than 0.
        // PHP currently defines these as CASE-SENSITIVE. It is important to
        // leave these as negatives so that they can come before numerical versions
        // and as if no letters were there to begin with.
        // (1alpha is < 1 and < 1.1 but > 1dev1)
        // If a non-numerical value can't be mapped to this table, it receives
        // -7 as its value.
        vm = {
          'dev': -6,
          'alpha': -5,
          'a': -5,
          'beta': -4,
          'b': -4,
          'RC': -3,
          'rc': -3,
          '#': -2,
          'p': 1,
          'pl': 1
        },

        // This function will be called to prepare each version argument.
        // It replaces every _, -, and + with a dot.
        // It surrounds any nonsequence of numbers/dots with dots.
        // It replaces sequences of dots with a single dot.
        //    version_compare('4..0', '4.0') == 0
        // Important: A string of 0 length needs to be converted into a value
        // even less than an unexisting value in vm (-7), hence [-8].
        // It's also important to not strip spaces because of this.
        //   version_compare('', ' ') == 1
        prepVersion = function (v) {
          v = ('' + v).replace(/[_\-+]/g, '.');
          v = v.replace(/([^.\d]+)/g, '.$1.').replace(/\.{2,}/g, '.');
          return !v.length ? [-8] : v.split('.');
        },

        // This converts a version component to a number.
        // Empty component becomes 0.
        // Non-numerical component becomes a negative number.
        // Numerical component becomes itself as an integer.
        numVersion = function (v) {
          return !v ? 0 : isNaN(v) ? vm[v] || -7 : parseInt(v, 10);
        };

        v1 = prepVersion(v1);
        v2 = prepVersion(v2);
        x = Math.max(v1.length, v2.length);
        for (i = 0; i < x; i++) {
          if (v1[i] == v2[i]) {
            continue;
          }
          v1[i] = numVersion(v1[i]);
          v2[i] = numVersion(v2[i]);
          if (v1[i] < v2[i]) {
            compare = -1;
            break;
          } else if (v1[i] > v2[i]) {
            compare = 1;
            break;
          }
        }
        if (!operator) {
          return compare;
        }

        // Important: operator is CASE-SENSITIVE.
        // "No operator" seems to be treated as "<."
        // Any other values seem to make the function return null.
        switch (operator) {
          case '>':
          case 'gt':
            return compare > 0;
          case '>=':
          case 'ge':
            return compare >= 0;
          case '<=':
          case 'le':
            return compare <= 0;
          case '==':
          case '=':
          case 'eq':
            return compare === 0;
          case '<>':
          case '!=':
          case 'ne':
            return compare !== 0;
          case '':
          case '<':
          case 'lt':
            return compare < 0;
          default:
            return null;
        }
      }

      var can = function () {
        var caps = {
          define_property: function () {
            /* // currently too much extra code required, not exactly worth it
            try { // as of IE8, getters/setters are supported only on DOM elements
              var obj = {};
              if (Object.defineProperty) {
                Object.defineProperty(obj, 'prop', {
                  enumerable: true,
                  configurable: true
                });
                return true;
              }
            } catch(ex) {}
              if (Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__) {
              return true;
            }*/
            return false;
          }(),

          create_canvas: function () {
            // On the S60 and BB Storm, getContext exists, but always returns undefined
            // so we actually have to call getContext() to verify
            // github.com/Modernizr/Modernizr/issues/issue/97/
            var el = document.createElement('canvas');
            return !!(el.getContext && el.getContext('2d'));
          }(),

          return_response_type: function (responseType) {
            try {
              if (Basic.inArray(responseType, ['', 'text', 'document']) !== -1) {
                return true;
              } else if (window.XMLHttpRequest) {
                var xhr = new XMLHttpRequest();
                xhr.open('get', '/'); // otherwise Gecko throws an exception
                if ('responseType' in xhr) {
                  xhr.responseType = responseType;
                  // as of 23.0.1271.64, Chrome switched from throwing exception to merely logging it to the console (why? o why?)
                  if (xhr.responseType !== responseType) {
                    return false;
                  }
                  return true;
                }
              }
            } catch (ex) {}
            return false;
          },

          // ideas for this heavily come from Modernizr (http://modernizr.com/)
          use_data_uri: function () {
            var du = new Image();

            du.onload = function () {
              caps.use_data_uri = du.width === 1 && du.height === 1;
            };

            setTimeout(function () {
              du.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP8AAAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
            }, 1);
            return false;
          }(),

          use_data_uri_over32kb: function () {
            // IE8
            return caps.use_data_uri && (Env.browser !== 'IE' || Env.version >= 9);
          },

          use_data_uri_of: function (bytes) {
            return caps.use_data_uri && bytes < 33000 || caps.use_data_uri_over32kb();
          },

          use_fileinput: function () {
            if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
              return false;
            }

            var el = document.createElement('input');
            el.setAttribute('type', 'file');
            return !el.disabled;
          }
        };

        return function (cap) {
          var args = [].slice.call(arguments);
          args.shift(); // shift of cap
          return Basic.typeOf(caps[cap]) === 'function' ? caps[cap].apply(this, args) : !!caps[cap];
        };
      }();

      var uaResult = new UAParser().getResult();

      var Env = {
        can: can,

        uaParser: UAParser,

        browser: uaResult.browser.name,
        version: uaResult.browser.version,
        os: uaResult.os.name, // everybody intuitively types it in a lowercase for some reason
        osVersion: uaResult.os.version,

        verComp: version_compare,

        swf_url: "../flash/Moxie.swf",
        xap_url: "../silverlight/Moxie.xap",
        global_event_dispatcher: "moxie.core.EventTarget.instance.dispatchEvent"
      };

      // for backward compatibility
      // @deprecated Use `Env.os` instead
      Env.OS = Env.os;

      if (MXI_DEBUG) {
        Env.debug = {
          runtime: true,
          events: false
        };

        Env.log = function () {

          function logObj(data) {
            // TODO: this should recursively print out the object in a pretty way
            console.appendChild(document.createTextNode(data + "\n"));
          }

          var data = arguments[0];

          if (Basic.typeOf(data) === 'string') {
            data = Basic.sprintf.apply(this, arguments);
          }

          if (window && window.console && window.console.log) {
            window.console.log(data);
          } else if (document) {
            var console = document.getElementById('moxie-console');
            if (!console) {
              console = document.createElement('pre');
              console.id = 'moxie-console';
              //console.style.display = 'none';
              document.body.appendChild(console);
            }

            if (Basic.inArray(Basic.typeOf(data), ['object', 'array']) !== -1) {
              logObj(data);
            } else {
              console.appendChild(document.createTextNode(data + "\n"));
            }
          }
        };
      }

      return Env;
    });

    // Included from: src/javascript/core/Exceptions.js

    /**
     * Exceptions.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define('moxie/core/Exceptions', ['moxie/core/utils/Basic'], function (Basic) {

      function _findKey(obj, value) {
        var key;
        for (key in obj) {
          if (obj[key] === value) {
            return key;
          }
        }
        return null;
      }

      /**
      @class moxie/core/Exception
      */
      return {
        RuntimeError: function () {
          var namecodes = {
            NOT_INIT_ERR: 1,
            EXCEPTION_ERR: 3,
            NOT_SUPPORTED_ERR: 9,
            JS_ERR: 4
          };

          function RuntimeError(code, message) {
            this.code = code;
            this.name = _findKey(namecodes, code);
            this.message = this.name + (message || ": RuntimeError " + this.code);
          }

          Basic.extend(RuntimeError, namecodes);
          RuntimeError.prototype = Error.prototype;
          return RuntimeError;
        }(),

        OperationNotAllowedException: function () {

          function OperationNotAllowedException(code) {
            this.code = code;
            this.name = 'OperationNotAllowedException';
          }

          Basic.extend(OperationNotAllowedException, {
            NOT_ALLOWED_ERR: 1
          });

          OperationNotAllowedException.prototype = Error.prototype;

          return OperationNotAllowedException;
        }(),

        ImageError: function () {
          var namecodes = {
            WRONG_FORMAT: 1,
            MAX_RESOLUTION_ERR: 2,
            INVALID_META_ERR: 3
          };

          function ImageError(code) {
            this.code = code;
            this.name = _findKey(namecodes, code);
            this.message = this.name + ": ImageError " + this.code;
          }

          Basic.extend(ImageError, namecodes);
          ImageError.prototype = Error.prototype;

          return ImageError;
        }(),

        FileException: function () {
          var namecodes = {
            NOT_FOUND_ERR: 1,
            SECURITY_ERR: 2,
            ABORT_ERR: 3,
            NOT_READABLE_ERR: 4,
            ENCODING_ERR: 5,
            NO_MODIFICATION_ALLOWED_ERR: 6,
            INVALID_STATE_ERR: 7,
            SYNTAX_ERR: 8
          };

          function FileException(code) {
            this.code = code;
            this.name = _findKey(namecodes, code);
            this.message = this.name + ": FileException " + this.code;
          }

          Basic.extend(FileException, namecodes);
          FileException.prototype = Error.prototype;
          return FileException;
        }(),

        DOMException: function () {
          var namecodes = {
            INDEX_SIZE_ERR: 1,
            DOMSTRING_SIZE_ERR: 2,
            HIERARCHY_REQUEST_ERR: 3,
            WRONG_DOCUMENT_ERR: 4,
            INVALID_CHARACTER_ERR: 5,
            NO_DATA_ALLOWED_ERR: 6,
            NO_MODIFICATION_ALLOWED_ERR: 7,
            NOT_FOUND_ERR: 8,
            NOT_SUPPORTED_ERR: 9,
            INUSE_ATTRIBUTE_ERR: 10,
            INVALID_STATE_ERR: 11,
            SYNTAX_ERR: 12,
            INVALID_MODIFICATION_ERR: 13,
            NAMESPACE_ERR: 14,
            INVALID_ACCESS_ERR: 15,
            VALIDATION_ERR: 16,
            TYPE_MISMATCH_ERR: 17,
            SECURITY_ERR: 18,
            NETWORK_ERR: 19,
            ABORT_ERR: 20,
            URL_MISMATCH_ERR: 21,
            QUOTA_EXCEEDED_ERR: 22,
            TIMEOUT_ERR: 23,
            INVALID_NODE_TYPE_ERR: 24,
            DATA_CLONE_ERR: 25
          };

          function DOMException(code) {
            this.code = code;
            this.name = _findKey(namecodes, code);
            this.message = this.name + ": DOMException " + this.code;
          }

          Basic.extend(DOMException, namecodes);
          DOMException.prototype = Error.prototype;
          return DOMException;
        }(),

        EventException: function () {
          function EventException(code) {
            this.code = code;
            this.name = 'EventException';
          }

          Basic.extend(EventException, {
            UNSPECIFIED_EVENT_TYPE_ERR: 0
          });

          EventException.prototype = Error.prototype;

          return EventException;
        }()
      };
    });

    // Included from: src/javascript/core/utils/Dom.js

    /**
     * Dom.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define('moxie/core/utils/Dom', ['moxie/core/utils/Env'], function (Env) {

      /**
      Get DOM Element by it's id.
        @method get
      @for Utils
      @param {String} id Identifier of the DOM Element
      @return {DOMElement}
      */
      var get = function (id) {
        if (typeof id !== 'string') {
          return id;
        }
        return document.getElementById(id);
      };

      /**
      Checks if specified DOM element has specified class.
        @method hasClass
      @static
      @param {Object} obj DOM element like object to add handler to.
      @param {String} name Class name
      */
      var hasClass = function (obj, name) {
        if (!obj.className) {
          return false;
        }

        var regExp = new RegExp("(^|\\s+)" + name + "(\\s+|$)");
        return regExp.test(obj.className);
      };

      /**
      Adds specified className to specified DOM element.
        @method addClass
      @static
      @param {Object} obj DOM element like object to add handler to.
      @param {String} name Class name
      */
      var addClass = function (obj, name) {
        if (!hasClass(obj, name)) {
          obj.className = !obj.className ? name : obj.className.replace(/\s+$/, '') + ' ' + name;
        }
      };

      /**
      Removes specified className from specified DOM element.
        @method removeClass
      @static
      @param {Object} obj DOM element like object to add handler to.
      @param {String} name Class name
      */
      var removeClass = function (obj, name) {
        if (obj.className) {
          var regExp = new RegExp("(^|\\s+)" + name + "(\\s+|$)");
          obj.className = obj.className.replace(regExp, function ($0, $1, $2) {
            return $1 === ' ' && $2 === ' ' ? ' ' : '';
          });
        }
      };

      /**
      Returns a given computed style of a DOM element.
        @method getStyle
      @static
      @param {Object} obj DOM element like object.
      @param {String} name Style you want to get from the DOM element
      */
      var getStyle = function (obj, name) {
        if (obj.currentStyle) {
          return obj.currentStyle[name];
        } else if (window.getComputedStyle) {
          return window.getComputedStyle(obj, null)[name];
        }
      };

      /**
      Returns the absolute x, y position of an Element. The position will be returned in a object with x, y fields.
        @method getPos
      @static
      @param {Element} node HTML element or element id to get x, y position from.
      @param {Element} root Optional root element to stop calculations at.
      @return {object} Absolute position of the specified element object with x, y fields.
      */
      var getPos = function (node, root) {
        var x = 0,
            y = 0,
            parent,
            doc = document,
            nodeRect,
            rootRect;

        node = node;
        root = root || doc.body;

        // Returns the x, y cordinate for an element on IE 6 and IE 7
        function getIEPos(node) {
          var bodyElm,
              rect,
              x = 0,
              y = 0;

          if (node) {
            rect = node.getBoundingClientRect();
            bodyElm = doc.compatMode === "CSS1Compat" ? doc.documentElement : doc.body;
            x = rect.left + bodyElm.scrollLeft;
            y = rect.top + bodyElm.scrollTop;
          }

          return {
            x: x,
            y: y
          };
        }

        // Use getBoundingClientRect on IE 6 and IE 7 but not on IE 8 in standards mode
        if (node && node.getBoundingClientRect && Env.browser === 'IE' && (!doc.documentMode || doc.documentMode < 8)) {
          nodeRect = getIEPos(node);
          rootRect = getIEPos(root);

          return {
            x: nodeRect.x - rootRect.x,
            y: nodeRect.y - rootRect.y
          };
        }

        parent = node;
        while (parent && parent != root && parent.nodeType) {
          x += parent.offsetLeft || 0;
          y += parent.offsetTop || 0;
          parent = parent.offsetParent;
        }

        parent = node.parentNode;
        while (parent && parent != root && parent.nodeType) {
          x -= parent.scrollLeft || 0;
          y -= parent.scrollTop || 0;
          parent = parent.parentNode;
        }

        return {
          x: x,
          y: y
        };
      };

      /**
      Returns the size of the specified node in pixels.
        @method getSize
      @static
      @param {Node} node Node to get the size of.
      @return {Object} Object with a w and h property.
      */
      var getSize = function (node) {
        return {
          w: node.offsetWidth || node.clientWidth,
          h: node.offsetHeight || node.clientHeight
        };
      };

      return {
        get: get,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        getStyle: getStyle,
        getPos: getPos,
        getSize: getSize
      };
    });

    // Included from: src/javascript/core/EventTarget.js

    /**
     * EventTarget.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define('moxie/core/EventTarget', ['moxie/core/utils/Env', 'moxie/core/Exceptions', 'moxie/core/utils/Basic'], function (Env, x, Basic) {

      // hash of event listeners by object uid
      var eventpool = {};

      /**
      Parent object for all event dispatching components and objects
        @class moxie/core/EventTarget
      @constructor EventTarget
      */
      function EventTarget() {
        /**
        Unique id of the event dispatcher, usually overriden by children
          @property uid
        @type String
        */
        this.uid = Basic.guid();
      }

      Basic.extend(EventTarget.prototype, {

        /**
        Can be called from within a child  in order to acquire uniqie id in automated manner
          @method init
        */
        init: function () {
          if (!this.uid) {
            this.uid = Basic.guid('uid_');
          }
        },

        /**
        Register a handler to a specific event dispatched by the object
          @method addEventListener
        @param {String} type Type or basically a name of the event to subscribe to
        @param {Function} fn Callback function that will be called when event happens
        @param {Number} [priority=0] Priority of the event handler - handlers with higher priorities will be called first
        @param {Object} [scope=this] A scope to invoke event handler in
        */
        addEventListener: function (type, fn, priority, scope) {
          var self = this,
              list;

          // without uid no event handlers can be added, so make sure we got one
          if (!this.hasOwnProperty('uid')) {
            this.uid = Basic.guid('uid_');
          }

          type = Basic.trim(type);

          if (/\s/.test(type)) {
            // multiple event types were passed for one handler
            Basic.each(type.split(/\s+/), function (type) {
              self.addEventListener(type, fn, priority, scope);
            });
            return;
          }

          type = type.toLowerCase();
          priority = parseInt(priority, 10) || 0;

          list = eventpool[this.uid] && eventpool[this.uid][type] || [];
          list.push({ fn: fn, priority: priority, scope: scope || this });

          if (!eventpool[this.uid]) {
            eventpool[this.uid] = {};
          }
          eventpool[this.uid][type] = list;
        },

        /**
        Check if any handlers were registered to the specified event
          @method hasEventListener
        @param {String} [type] Type or basically a name of the event to check
        @return {Mixed} Returns a handler if it was found and false, if - not
        */
        hasEventListener: function (type) {
          var list;
          if (type) {
            type = type.toLowerCase();
            list = eventpool[this.uid] && eventpool[this.uid][type];
          } else {
            list = eventpool[this.uid];
          }
          return list ? list : false;
        },

        /**
        Unregister the handler from the event, or if former was not specified - unregister all handlers
          @method removeEventListener
        @param {String} type Type or basically a name of the event
        @param {Function} [fn] Handler to unregister
        */
        removeEventListener: function (type, fn) {
          var self = this,
              list,
              i;

          type = type.toLowerCase();

          if (/\s/.test(type)) {
            // multiple event types were passed for one handler
            Basic.each(type.split(/\s+/), function (type) {
              self.removeEventListener(type, fn);
            });
            return;
          }

          list = eventpool[this.uid] && eventpool[this.uid][type];

          if (list) {
            if (fn) {
              for (i = list.length - 1; i >= 0; i--) {
                if (list[i].fn === fn) {
                  list.splice(i, 1);
                  break;
                }
              }
            } else {
              list = [];
            }

            // delete event list if it has become empty
            if (!list.length) {
              delete eventpool[this.uid][type];

              // and object specific entry in a hash if it has no more listeners attached
              if (Basic.isEmptyObj(eventpool[this.uid])) {
                delete eventpool[this.uid];
              }
            }
          }
        },

        /**
        Remove all event handlers from the object
          @method removeAllEventListeners
        */
        removeAllEventListeners: function () {
          if (eventpool[this.uid]) {
            delete eventpool[this.uid];
          }
        },

        /**
        Dispatch the event
          @method dispatchEvent
        @param {String/Object} Type of event or event object to dispatch
        @param {Mixed} [...] Variable number of arguments to be passed to a handlers
        @return {Boolean} true by default and false if any handler returned false
        */
        dispatchEvent: function (type) {
          var uid,
              list,
              args,
              tmpEvt,
              evt = {},
              result = true,
              undef;

          if (Basic.typeOf(type) !== 'string') {
            // we can't use original object directly (because of Silverlight)
            tmpEvt = type;

            if (Basic.typeOf(tmpEvt.type) === 'string') {
              type = tmpEvt.type;

              if (tmpEvt.total !== undef && tmpEvt.loaded !== undef) {
                // progress event
                evt.total = tmpEvt.total;
                evt.loaded = tmpEvt.loaded;
              }
              evt.async = tmpEvt.async || false;
            } else {
              throw new x.EventException(x.EventException.UNSPECIFIED_EVENT_TYPE_ERR);
            }
          }

          // check if event is meant to be dispatched on an object having specific uid
          if (type.indexOf('::') !== -1) {
            (function (arr) {
              uid = arr[0];
              type = arr[1];
            })(type.split('::'));
          } else {
            uid = this.uid;
          }

          type = type.toLowerCase();

          list = eventpool[uid] && eventpool[uid][type];

          if (list) {
            // sort event list by prority
            list.sort(function (a, b) {
              return b.priority - a.priority;
            });

            args = [].slice.call(arguments);

            // first argument will be pseudo-event object
            args.shift();
            evt.type = type;
            args.unshift(evt);

            if (MXI_DEBUG && Env.debug.events) {
              Env.log("Event '%s' fired on %u", evt.type, uid);
            }

            // Dispatch event to all listeners
            var queue = [];
            Basic.each(list, function (handler) {
              // explicitly set the target, otherwise events fired from shims do not get it
              args[0].target = handler.scope;
              // if event is marked as async, detach the handler
              if (evt.async) {
                queue.push(function (cb) {
                  setTimeout(function () {
                    cb(handler.fn.apply(handler.scope, args) === false);
                  }, 1);
                });
              } else {
                queue.push(function (cb) {
                  cb(handler.fn.apply(handler.scope, args) === false); // if handler returns false stop propagation
                });
              }
            });
            if (queue.length) {
              Basic.inSeries(queue, function (err) {
                result = !err;
              });
            }
          }
          return result;
        },

        /**
        Register a handler to the event type that will run only once
          @method bindOnce
        @since >1.4.1
        @param {String} type Type or basically a name of the event to subscribe to
        @param {Function} fn Callback function that will be called when event happens
        @param {Number} [priority=0] Priority of the event handler - handlers with higher priorities will be called first
        @param {Object} [scope=this] A scope to invoke event handler in
        */
        bindOnce: function (type, fn, priority, scope) {
          var self = this;
          self.bind.call(this, type, function cb() {
            self.unbind(type, cb);
            return fn.apply(this, arguments);
          }, priority, scope);
        },

        /**
        Alias for addEventListener
          @method bind
        @protected
        */
        bind: function () {
          this.addEventListener.apply(this, arguments);
        },

        /**
        Alias for removeEventListener
          @method unbind
        @protected
        */
        unbind: function () {
          this.removeEventListener.apply(this, arguments);
        },

        /**
        Alias for removeAllEventListeners
          @method unbindAll
        @protected
        */
        unbindAll: function () {
          this.removeAllEventListeners.apply(this, arguments);
        },

        /**
        Alias for dispatchEvent
          @method trigger
        @protected
        */
        trigger: function () {
          return this.dispatchEvent.apply(this, arguments);
        },

        /**
        Handle properties of on[event] type.
          @method handleEventProps
        @private
        */
        handleEventProps: function (dispatches) {
          var self = this;

          this.bind(dispatches.join(' '), function (e) {
            var prop = 'on' + e.type.toLowerCase();
            if (Basic.typeOf(this[prop]) === 'function') {
              this[prop].apply(this, arguments);
            }
          });

          // object must have defined event properties, even if it doesn't make use of them
          Basic.each(dispatches, function (prop) {
            prop = 'on' + prop.toLowerCase(prop);
            if (Basic.typeOf(self[prop]) === 'undefined') {
              self[prop] = null;
            }
          });
        }

      });

      EventTarget.instance = new EventTarget();

      return EventTarget;
    });

    // Included from: src/javascript/runtime/Runtime.js

    /**
     * Runtime.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define('moxie/runtime/Runtime', ["moxie/core/utils/Env", "moxie/core/utils/Basic", "moxie/core/utils/Dom", "moxie/core/EventTarget"], function (Env, Basic, Dom, EventTarget) {
      var runtimeConstructors = {},
          runtimes = {};

      /**
      Common set of methods and properties for every runtime instance
        @class moxie/runtime/Runtime
        @param {Object} options
      @param {String} type Sanitized name of the runtime
      @param {Object} [caps] Set of capabilities that differentiate specified runtime
      @param {Object} [modeCaps] Set of capabilities that do require specific operational mode
      @param {String} [preferredMode='browser'] Preferred operational mode to choose if no required capabilities were requested
      */
      function Runtime(options, type, caps, modeCaps, preferredMode) {
        /**
        Dispatched when runtime is initialized and ready.
        Results in RuntimeInit on a connected component.
          @event Init
        */

        /**
        Dispatched when runtime fails to initialize.
        Results in RuntimeError on a connected component.
          @event Error
        */

        var self = this,
            _shim,
            _uid = Basic.guid(type + '_'),
            defaultMode = preferredMode || 'browser';

        options = options || {};

        // register runtime in private hash
        runtimes[_uid] = this;

        /**
        Default set of capabilities, which can be redifined later by specific runtime
          @private
        @property caps
        @type Object
        */
        caps = Basic.extend({
          // Runtime can:
          // provide access to raw binary data of the file
          access_binary: false,
          // provide access to raw binary data of the image (image extension is optional)
          access_image_binary: false,
          // display binary data as thumbs for example
          display_media: false,
          // make cross-domain requests
          do_cors: false,
          // accept files dragged and dropped from the desktop
          drag_and_drop: false,
          // filter files in selection dialog by their extensions
          filter_by_extension: true,
          // resize image (and manipulate it raw data of any file in general)
          resize_image: false,
          // periodically report how many bytes of total in the file were uploaded (loaded)
          report_upload_progress: false,
          // provide access to the headers of http response
          return_response_headers: false,
          // support response of specific type, which should be passed as an argument
          // e.g. runtime.can('return_response_type', 'blob')
          return_response_type: false,
          // return http status code of the response
          return_status_code: true,
          // send custom http header with the request
          send_custom_headers: false,
          // pick up the files from a dialog
          select_file: false,
          // select whole folder in file browse dialog
          select_folder: false,
          // select multiple files at once in file browse dialog
          select_multiple: true,
          // send raw binary data, that is generated after image resizing or manipulation of other kind
          send_binary_string: false,
          // send cookies with http request and therefore retain session
          send_browser_cookies: true,
          // send data formatted as multipart/form-data
          send_multipart: true,
          // slice the file or blob to smaller parts
          slice_blob: false,
          // upload file without preloading it to memory, stream it out directly from disk
          stream_upload: false,
          // programmatically trigger file browse dialog
          summon_file_dialog: false,
          // upload file of specific size, size should be passed as argument
          // e.g. runtime.can('upload_filesize', '500mb')
          upload_filesize: true,
          // initiate http request with specific http method, method should be passed as argument
          // e.g. runtime.can('use_http_method', 'put')
          use_http_method: true
        }, caps);

        // default to the mode that is compatible with preferred caps
        if (options.preferred_caps) {
          defaultMode = Runtime.getMode(modeCaps, options.preferred_caps, defaultMode);
        }

        if (MXI_DEBUG && Env.debug.runtime) {
          Env.log("\tdefault mode: %s", defaultMode);
        }

        // small extension factory here (is meant to be extended with actual extensions constructors)
        _shim = function () {
          var objpool = {};
          return {
            exec: function (uid, comp, fn, args) {
              if (_shim[comp]) {
                if (!objpool[uid]) {
                  objpool[uid] = {
                    context: this,
                    instance: new _shim[comp]()
                  };
                }
                if (objpool[uid].instance[fn]) {
                  return objpool[uid].instance[fn].apply(this, args);
                }
              }
            },

            removeInstance: function (uid) {
              delete objpool[uid];
            },

            removeAllInstances: function () {
              var self = this;
              Basic.each(objpool, function (obj, uid) {
                if (Basic.typeOf(obj.instance.destroy) === 'function') {
                  obj.instance.destroy.call(obj.context);
                }
                self.removeInstance(uid);
              });
            }
          };
        }();

        // public methods
        Basic.extend(this, {
          /**
          Specifies whether runtime instance was initialized or not
            @property initialized
          @type {Boolean}
          @default false
          */
          initialized: false, // shims require this flag to stop initialization retries

          /**
          Unique ID of the runtime
            @property uid
          @type {String}
          */
          uid: _uid,

          /**
          Runtime type (e.g. flash, html5, etc)
            @property type
          @type {String}
          */
          type: type,

          /**
          Runtime (not native one) may operate in browser or client mode.
            @property mode
          @private
          @type {String|Boolean} current mode or false, if none possible
          */
          mode: Runtime.getMode(modeCaps, options.required_caps, defaultMode),

          /**
          id of the DOM container for the runtime (if available)
            @property shimid
          @type {String}
          */
          shimid: _uid + '_container',

          /**
          Number of connected clients. If equal to zero, runtime can be destroyed
            @property clients
          @type {Number}
          */
          clients: 0,

          /**
          Runtime initialization options
            @property options
          @type {Object}
          */
          options: options,

          /**
          Checks if the runtime has specific capability
            @method can
          @param {String} cap Name of capability to check
          @param {Mixed} [value] If passed, capability should somehow correlate to the value
          @param {Object} [refCaps] Set of capabilities to check the specified cap against (defaults to internal set)
          @return {Boolean} true if runtime has such capability and false, if - not
          */
          can: function (cap, value) {
            var refCaps = arguments[2] || caps;

            // if cap var is a comma-separated list of caps, convert it to object (key/value)
            if (Basic.typeOf(cap) === 'string' && Basic.typeOf(value) === 'undefined') {
              cap = Runtime.parseCaps(cap);
            }

            if (Basic.typeOf(cap) === 'object') {
              for (var key in cap) {
                if (!this.can(key, cap[key], refCaps)) {
                  return false;
                }
              }
              return true;
            }

            // check the individual cap
            if (Basic.typeOf(refCaps[cap]) === 'function') {
              return refCaps[cap].call(this, value);
            } else {
              return value === refCaps[cap];
            }
          },

          /**
          Returns container for the runtime as DOM element
            @method getShimContainer
          @return {DOMElement}
          */
          getShimContainer: function () {
            var container,
                shimContainer = Dom.get(this.shimid);

            // if no container for shim, create one
            if (!shimContainer) {
              container = Dom.get(this.options.container) || document.body;

              // create shim container and insert it at an absolute position into the outer container
              shimContainer = document.createElement('div');
              shimContainer.id = this.shimid;
              shimContainer.className = 'moxie-shim moxie-shim-' + this.type;

              Basic.extend(shimContainer.style, {
                position: 'absolute',
                top: '0px',
                left: '0px',
                width: '1px',
                height: '1px',
                overflow: 'hidden'
              });

              container.appendChild(shimContainer);
              container = null;
            }

            return shimContainer;
          },

          /**
          Returns runtime as DOM element (if appropriate)
            @method getShim
          @return {DOMElement}
          */
          getShim: function () {
            return _shim;
          },

          /**
          Invokes a method within the runtime itself (might differ across the runtimes)
            @method shimExec
          @param {Mixed} []
          @protected
          @return {Mixed} Depends on the action and component
          */
          shimExec: function (component, action) {
            var args = [].slice.call(arguments, 2);
            return self.getShim().exec.call(this, this.uid, component, action, args);
          },

          /**
          Operaional interface that is used by components to invoke specific actions on the runtime
          (is invoked in the scope of component)
            @method exec
          @param {Mixed} []*
          @protected
          @return {Mixed} Depends on the action and component
          */
          exec: function (component, action) {
            // this is called in the context of component, not runtime
            var args = [].slice.call(arguments, 2);

            if (self[component] && self[component][action]) {
              return self[component][action].apply(this, args);
            }
            return self.shimExec.apply(this, arguments);
          },

          /**
          Destroys the runtime (removes all events and deletes DOM structures)
            @method destroy
          */
          destroy: function () {
            if (!self) {
              return; // obviously already destroyed
            }

            var shimContainer = Dom.get(this.shimid);
            if (shimContainer) {
              shimContainer.parentNode.removeChild(shimContainer);
            }

            if (_shim) {
              _shim.removeAllInstances();
            }

            this.unbindAll();
            delete runtimes[this.uid];
            this.uid = null; // mark this runtime as destroyed
            _uid = self = _shim = shimContainer = null;
          }
        });

        // once we got the mode, test against all caps
        if (this.mode && options.required_caps && !this.can(options.required_caps)) {
          this.mode = false;
        }
      }

      /**
      Default order to try different runtime types
        @property order
      @type String
      @static
      */
      Runtime.order = 'html5,flash,silverlight,html4';

      /**
      Retrieves runtime from private hash by it's uid
        @method getRuntime
      @private
      @static
      @param {String} uid Unique identifier of the runtime
      @return {Runtime|Boolean} Returns runtime, if it exists and false, if - not
      */
      Runtime.getRuntime = function (uid) {
        return runtimes[uid] ? runtimes[uid] : false;
      };

      /**
      Register constructor for the Runtime of new (or perhaps modified) type
        @method addConstructor
      @static
      @param {String} type Runtime type (e.g. flash, html5, etc)
      @param {Function} construct Constructor for the Runtime type
      */
      Runtime.addConstructor = function (type, constructor) {
        constructor.prototype = EventTarget.instance;
        runtimeConstructors[type] = constructor;
      };

      /**
      Get the constructor for the specified type.
        method getConstructor
      @static
      @param {String} type Runtime type (e.g. flash, html5, etc)
      @return {Function} Constructor for the Runtime type
      */
      Runtime.getConstructor = function (type) {
        return runtimeConstructors[type] || null;
      };

      /**
      Get info about the runtime (uid, type, capabilities)
        @method getInfo
      @static
      @param {String} uid Unique identifier of the runtime
      @return {Mixed} Info object or null if runtime doesn't exist
      */
      Runtime.getInfo = function (uid) {
        var runtime = Runtime.getRuntime(uid);

        if (runtime) {
          return {
            uid: runtime.uid,
            type: runtime.type,
            mode: runtime.mode,
            can: function () {
              return runtime.can.apply(runtime, arguments);
            }
          };
        }
        return null;
      };

      /**
      Convert caps represented by a comma-separated string to the object representation.
        @method parseCaps
      @static
      @param {String} capStr Comma-separated list of capabilities
      @return {Object}
      */
      Runtime.parseCaps = function (capStr) {
        var capObj = {};

        if (Basic.typeOf(capStr) !== 'string') {
          return capStr || {};
        }

        Basic.each(capStr.split(','), function (key) {
          capObj[key] = true; // we assume it to be - true
        });

        return capObj;
      };

      /**
      Test the specified runtime for specific capabilities.
        @method can
      @static
      @param {String} type Runtime type (e.g. flash, html5, etc)
      @param {String|Object} caps Set of capabilities to check
      @return {Boolean} Result of the test
      */
      Runtime.can = function (type, caps) {
        var runtime,
            constructor = Runtime.getConstructor(type),
            mode;
        if (constructor) {
          runtime = new constructor({
            required_caps: caps
          });
          mode = runtime.mode;
          runtime.destroy();
          return !!mode;
        }
        return false;
      };

      /**
      Figure out a runtime that supports specified capabilities.
        @method thatCan
      @static
      @param {String|Object} caps Set of capabilities to check
      @param {String} [runtimeOrder] Comma-separated list of runtimes to check against
      @return {String} Usable runtime identifier or null
      */
      Runtime.thatCan = function (caps, runtimeOrder) {
        var types = (runtimeOrder || Runtime.order).split(/\s*,\s*/);
        for (var i in types) {
          if (Runtime.can(types[i], caps)) {
            return types[i];
          }
        }
        return null;
      };

      /**
      Figure out an operational mode for the specified set of capabilities.
        @method getMode
      @static
      @param {Object} modeCaps Set of capabilities that depend on particular runtime mode
      @param {Object} [requiredCaps] Supplied set of capabilities to find operational mode for
      @param {String|Boolean} [defaultMode='browser'] Default mode to use
      @return {String|Boolean} Compatible operational mode
      */
      Runtime.getMode = function (modeCaps, requiredCaps, defaultMode) {
        var mode = null;

        if (Basic.typeOf(defaultMode) === 'undefined') {
          // only if not specified
          defaultMode = 'browser';
        }

        if (requiredCaps && !Basic.isEmptyObj(modeCaps)) {
          // loop over required caps and check if they do require the same mode
          Basic.each(requiredCaps, function (value, cap) {
            if (modeCaps.hasOwnProperty(cap)) {
              var capMode = modeCaps[cap](value);

              // make sure we always have an array
              if (typeof capMode === 'string') {
                capMode = [capMode];
              }

              if (!mode) {
                mode = capMode;
              } else if (!(mode = Basic.arrayIntersect(mode, capMode))) {
                // if cap requires conflicting mode - runtime cannot fulfill required caps

                if (MXI_DEBUG && Env.debug.runtime) {
                  Env.log("\t\t%c: %v (conflicting mode requested: %s)", cap, value, capMode);
                }

                return mode = false;
              }
            }

            if (MXI_DEBUG && Env.debug.runtime) {
              Env.log("\t\t%c: %v (compatible modes: %s)", cap, value, mode);
            }
          });

          if (mode) {
            return Basic.inArray(defaultMode, mode) !== -1 ? defaultMode : mode[0];
          } else if (mode === false) {
            return false;
          }
        }
        return defaultMode;
      };

      /**
      Capability check that always returns true
        @private
      @static
      @return {True}
      */
      Runtime.capTrue = function () {
        return true;
      };

      /**
      Capability check that always returns false
        @private
      @static
      @return {False}
      */
      Runtime.capFalse = function () {
        return false;
      };

      /**
      Evaluate the expression to boolean value and create a function that always returns it.
        @private
      @static
      @param {Mixed} expr Expression to evaluate
      @return {Function} Function returning the result of evaluation
      */
      Runtime.capTest = function (expr) {
        return function () {
          return !!expr;
        };
      };

      return Runtime;
    });

    // Included from: src/javascript/runtime/RuntimeClient.js

    /**
     * RuntimeClient.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define('moxie/runtime/RuntimeClient', ['moxie/core/utils/Env', 'moxie/core/Exceptions', 'moxie/core/utils/Basic', 'moxie/runtime/Runtime'], function (Env, x, Basic, Runtime) {
      /**
      Set of methods and properties, required by a component to acquire ability to connect to a runtime
        @class moxie/runtime/RuntimeClient
      */
      return function RuntimeClient() {
        var runtime;

        Basic.extend(this, {
          /**
          Connects to the runtime specified by the options. Will either connect to existing runtime or create a new one.
          Increments number of clients connected to the specified runtime.
            @private
          @method connectRuntime
          @param {Mixed} options Can be a runtme uid or a set of key-value pairs defining requirements and pre-requisites
          */
          connectRuntime: function (options) {
            var comp = this,
                ruid;

            function initialize(items) {
              var type, constructor;

              // if we ran out of runtimes
              if (!items.length) {
                comp.trigger('RuntimeError', new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));
                runtime = null;
                return;
              }

              type = items.shift().toLowerCase();
              constructor = Runtime.getConstructor(type);
              if (!constructor) {
                if (MXI_DEBUG && Env.debug.runtime) {
                  Env.log("Constructor for '%s' runtime is not available.", type);
                }
                initialize(items);
                return;
              }

              if (MXI_DEBUG && Env.debug.runtime) {
                Env.log("Trying runtime: %s", type);
                Env.log(options);
              }

              // try initializing the runtime
              runtime = new constructor(options);

              runtime.bind('Init', function () {
                // mark runtime as initialized
                runtime.initialized = true;

                if (MXI_DEBUG && Env.debug.runtime) {
                  Env.log("Runtime '%s' initialized", runtime.type);
                }

                // jailbreak ...
                setTimeout(function () {
                  runtime.clients++;
                  comp.ruid = runtime.uid;
                  // this will be triggered on component
                  comp.trigger('RuntimeInit', runtime);
                }, 1);
              });

              runtime.bind('Error', function () {
                if (MXI_DEBUG && Env.debug.runtime) {
                  Env.log("Runtime '%s' failed to initialize", runtime.type);
                }

                runtime.destroy(); // runtime cannot destroy itself from inside at a right moment, thus we do it here
                initialize(items);
              });

              runtime.bind('Exception', function (e, err) {
                var message = err.name + "(#" + err.code + ")" + (err.message ? ", from: " + err.message : '');

                if (MXI_DEBUG && Env.debug.runtime) {
                  Env.log("Runtime '%s' has thrown an exception: %s", this.type, message);
                }
                comp.trigger('RuntimeError', new x.RuntimeError(x.RuntimeError.EXCEPTION_ERR, message));
              });

              if (MXI_DEBUG && Env.debug.runtime) {
                Env.log("\tselected mode: %s", runtime.mode);
              }

              // check if runtime managed to pick-up operational mode
              if (!runtime.mode) {
                runtime.trigger('Error');
                return;
              }

              runtime.init();
            }

            // check if a particular runtime was requested
            if (Basic.typeOf(options) === 'string') {
              ruid = options;
            } else if (Basic.typeOf(options.ruid) === 'string') {
              ruid = options.ruid;
            }

            if (ruid) {
              runtime = Runtime.getRuntime(ruid);
              if (runtime) {
                comp.ruid = ruid;
                runtime.clients++;
                return runtime;
              } else {
                // there should be a runtime and there's none - weird case
                throw new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR);
              }
            }

            // initialize a fresh one, that fits runtime list and required features best
            initialize((options.runtime_order || Runtime.order).split(/\s*,\s*/));
          },

          /**
          Disconnects from the runtime. Decrements number of clients connected to the specified runtime.
            @private
          @method disconnectRuntime
          */
          disconnectRuntime: function () {
            if (runtime && --runtime.clients <= 0) {
              runtime.destroy();
            }

            // once the component is disconnected, it shouldn't have access to the runtime
            runtime = null;
          },

          /**
          Returns the runtime to which the client is currently connected.
            @method getRuntime
          @return {Runtime} Runtime or null if client is not connected
          */
          getRuntime: function () {
            if (runtime && runtime.uid) {
              return runtime;
            }
            return runtime = null; // make sure we do not leave zombies rambling around
          },

          /**
          Handy shortcut to safely invoke runtime extension methods.
            @private
          @method exec
          @return {Mixed} Whatever runtime extension method returns
          */
          exec: function () {
            return runtime ? runtime.exec.apply(this, arguments) : null;
          },

          /**
          Test runtime client for specific capability
            @method can
          @param {String} cap
          @return {Bool}
          */
          can: function (cap) {
            return runtime ? runtime.can(cap) : false;
          }

        });
      };
    });

    // Included from: src/javascript/file/Blob.js

    /**
     * Blob.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define('moxie/file/Blob', ['moxie/core/utils/Basic', 'moxie/core/utils/Encode', 'moxie/runtime/RuntimeClient'], function (Basic, Encode, RuntimeClient) {

      var blobpool = {};

      /**
      @class moxie/file/Blob
      @constructor
      @param {String} ruid Unique id of the runtime, to which this blob belongs to
      @param {Object} blob Object "Native" blob object, as it is represented in the runtime
      */
      function Blob(ruid, blob) {

        function _sliceDetached(start, end, type) {
          var blob,
              data = blobpool[this.uid];

          if (Basic.typeOf(data) !== 'string' || !data.length) {
            return null; // or throw exception
          }

          blob = new Blob(null, {
            type: type,
            size: end - start
          });
          blob.detach(data.substr(start, blob.size));

          return blob;
        }

        RuntimeClient.call(this);

        if (ruid) {
          this.connectRuntime(ruid);
        }

        if (!blob) {
          blob = {};
        } else if (Basic.typeOf(blob) === 'string') {
          // dataUrl or binary string
          blob = { data: blob };
        }

        Basic.extend(this, {

          /**
          Unique id of the component
            @property uid
          @type {String}
          */
          uid: blob.uid || Basic.guid('uid_'),

          /**
          Unique id of the connected runtime, if falsy, then runtime will have to be initialized
          before this Blob can be used, modified or sent
            @property ruid
          @type {String}
          */
          ruid: ruid,

          /**
          Size of blob
            @property size
          @type {Number}
          @default 0
          */
          size: blob.size || 0,

          /**
          Mime type of blob
            @property type
          @type {String}
          @default ''
          */
          type: blob.type || '',

          /**
          @method slice
          @param {Number} [start=0]
          */
          slice: function (start, end, type) {
            if (this.isDetached()) {
              return _sliceDetached.apply(this, arguments);
            }
            return this.getRuntime().exec.call(this, 'Blob', 'slice', this.getSource(), start, end, type);
          },

          /**
          Returns "native" blob object (as it is represented in connected runtime) or null if not found
            @method getSource
          @return {Blob} Returns "native" blob object or null if not found
          */
          getSource: function () {
            if (!blobpool[this.uid]) {
              return null;
            }
            return blobpool[this.uid];
          },

          /**
          Detaches blob from any runtime that it depends on and initialize with standalone value
            @method detach
          @protected
          @param {DOMString} [data=''] Standalone value
          */
          detach: function (data) {
            if (this.ruid) {
              this.getRuntime().exec.call(this, 'Blob', 'destroy');
              this.disconnectRuntime();
              this.ruid = null;
            }

            data = data || '';

            // if dataUrl, convert to binary string
            if (data.substr(0, 5) == 'data:') {
              var base64Offset = data.indexOf(';base64,');
              this.type = data.substring(5, base64Offset);
              data = Encode.atob(data.substring(base64Offset + 8));
            }

            this.size = data.length;

            blobpool[this.uid] = data;
          },

          /**
          Checks if blob is standalone (detached of any runtime)
            @method isDetached
          @protected
          @return {Boolean}
          */
          isDetached: function () {
            return !this.ruid && Basic.typeOf(blobpool[this.uid]) === 'string';
          },

          /**
          Destroy Blob and free any resources it was using
            @method destroy
          */
          destroy: function () {
            this.detach();
            delete blobpool[this.uid];
          }
        });

        if (blob.data) {
          this.detach(blob.data); // auto-detach if payload has been passed
        } else {
          blobpool[this.uid] = blob;
        }
      }

      return Blob;
    });

    // Included from: src/javascript/core/I18n.js

    /**
     * I18n.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define("moxie/core/I18n", ["moxie/core/utils/Basic"], function (Basic) {
      var i18n = {};

      /**
      @class moxie/core/I18n
      */
      return {
        /**
         * Extends the language pack object with new items.
         *
         * @param {Object} pack Language pack items to add.
         * @return {Object} Extended language pack object.
         */
        addI18n: function (pack) {
          return Basic.extend(i18n, pack);
        },

        /**
         * Translates the specified string by checking for the english string in the language pack lookup.
         *
         * @param {String} str String to look for.
         * @return {String} Translated string or the input string if it wasn't found.
         */
        translate: function (str) {
          return i18n[str] || str;
        },

        /**
         * Shortcut for translate function
         *
         * @param {String} str String to look for.
         * @return {String} Translated string or the input string if it wasn't found.
         */
        _: function (str) {
          return this.translate(str);
        },

        /**
         * Pseudo sprintf implementation - simple way to replace tokens with specified values.
         *
         * @param {String} str String with tokens
         * @return {String} String with replaced tokens
         */
        sprintf: function (str) {
          var args = [].slice.call(arguments, 1);

          return str.replace(/%[a-z]/g, function () {
            var value = args.shift();
            return Basic.typeOf(value) !== 'undefined' ? value : '';
          });
        }
      };
    });

    // Included from: src/javascript/core/utils/Mime.js

    /**
     * Mime.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define("moxie/core/utils/Mime", ["moxie/core/utils/Basic", "moxie/core/I18n"], function (Basic, I18n) {

      var mimeData = "" + "application/msword,doc dot," + "application/pdf,pdf," + "application/pgp-signature,pgp," + "application/postscript,ps ai eps," + "application/rtf,rtf," + "application/vnd.ms-excel,xls xlb," + "application/vnd.ms-powerpoint,ppt pps pot," + "application/zip,zip," + "application/x-shockwave-flash,swf swfl," + "application/vnd.openxmlformats-officedocument.wordprocessingml.document,docx," + "application/vnd.openxmlformats-officedocument.wordprocessingml.template,dotx," + "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,xlsx," + "application/vnd.openxmlformats-officedocument.presentationml.presentation,pptx," + "application/vnd.openxmlformats-officedocument.presentationml.template,potx," + "application/vnd.openxmlformats-officedocument.presentationml.slideshow,ppsx," + "application/x-javascript,js," + "application/json,json," + "audio/mpeg,mp3 mpga mpega mp2," + "audio/x-wav,wav," + "audio/x-m4a,m4a," + "audio/ogg,oga ogg," + "audio/aiff,aiff aif," + "audio/flac,flac," + "audio/aac,aac," + "audio/ac3,ac3," + "audio/x-ms-wma,wma," + "image/bmp,bmp," + "image/gif,gif," + "image/jpeg,jpg jpeg jpe," + "image/photoshop,psd," + "image/png,png," + "image/svg+xml,svg svgz," + "image/tiff,tiff tif," + "text/plain,asc txt text diff log," + "text/html,htm html xhtml," + "text/css,css," + "text/csv,csv," + "text/rtf,rtf," + "video/mpeg,mpeg mpg mpe m2v," + "video/quicktime,qt mov," + "video/mp4,mp4," + "video/x-m4v,m4v," + "video/x-flv,flv," + "video/x-ms-wmv,wmv," + "video/avi,avi," + "video/webm,webm," + "video/3gpp,3gpp 3gp," + "video/3gpp2,3g2," + "video/vnd.rn-realvideo,rv," + "video/ogg,ogv," + "video/x-matroska,mkv," + "application/vnd.oasis.opendocument.formula-template,otf," + "application/octet-stream,exe";

      var Mime = {

        mimes: {},

        extensions: {},

        // Parses the default mime types string into a mimes and extensions lookup maps
        addMimeType: function (mimeData) {
          var items = mimeData.split(/,/),
              i,
              ii,
              ext;

          for (i = 0; i < items.length; i += 2) {
            ext = items[i + 1].split(/ /);

            // extension to mime lookup
            for (ii = 0; ii < ext.length; ii++) {
              this.mimes[ext[ii]] = items[i];
            }
            // mime to extension lookup
            this.extensions[items[i]] = ext;
          }
        },

        extList2mimes: function (filters, addMissingExtensions) {
          var self = this,
              ext,
              i,
              ii,
              type,
              mimes = [];

          // convert extensions to mime types list
          for (i = 0; i < filters.length; i++) {
            ext = filters[i].extensions.toLowerCase().split(/\s*,\s*/);

            for (ii = 0; ii < ext.length; ii++) {

              // if there's an asterisk in the list, then accept attribute is not required
              if (ext[ii] === '*') {
                return [];
              }

              type = self.mimes[ext[ii]];

              // future browsers should filter by extension, finally
              if (addMissingExtensions && /^\w+$/.test(ext[ii])) {
                mimes.push('.' + ext[ii]);
              } else if (type && Basic.inArray(type, mimes) === -1) {
                mimes.push(type);
              } else if (!type) {
                // if we have no type in our map, then accept all
                return [];
              }
            }
          }
          return mimes;
        },

        mimes2exts: function (mimes) {
          var self = this,
              exts = [];

          Basic.each(mimes, function (mime) {
            mime = mime.toLowerCase();

            if (mime === '*') {
              exts = [];
              return false;
            }

            // check if this thing looks like mime type
            var m = mime.match(/^(\w+)\/(\*|\w+)$/);
            if (m) {
              if (m[2] === '*') {
                // wildcard mime type detected
                Basic.each(self.extensions, function (arr, mime) {
                  if (new RegExp('^' + m[1] + '/').test(mime)) {
                    [].push.apply(exts, self.extensions[mime]);
                  }
                });
              } else if (self.extensions[mime]) {
                [].push.apply(exts, self.extensions[mime]);
              }
            }
          });
          return exts;
        },

        mimes2extList: function (mimes) {
          var accept = [],
              exts = [];

          if (Basic.typeOf(mimes) === 'string') {
            mimes = Basic.trim(mimes).split(/\s*,\s*/);
          }

          exts = this.mimes2exts(mimes);

          accept.push({
            title: I18n.translate('Files'),
            extensions: exts.length ? exts.join(',') : '*'
          });

          // save original mimes string
          accept.mimes = mimes;

          return accept;
        },

        getFileExtension: function (fileName) {
          var matches = fileName && fileName.match(/\.([^.]+)$/);
          if (matches) {
            return matches[1].toLowerCase();
          }
          return '';
        },

        getFileMime: function (fileName) {
          return this.mimes[this.getFileExtension(fileName)] || '';
        }
      };

      Mime.addMimeType(mimeData);

      return Mime;
    });

    // Included from: src/javascript/file/FileInput.js

    /**
     * FileInput.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define('moxie/file/FileInput', ['moxie/core/utils/Basic', 'moxie/core/utils/Env', 'moxie/core/utils/Mime', 'moxie/core/utils/Dom', 'moxie/core/Exceptions', 'moxie/core/EventTarget', 'moxie/core/I18n', 'moxie/runtime/Runtime', 'moxie/runtime/RuntimeClient'], function (Basic, Env, Mime, Dom, x, EventTarget, I18n, Runtime, RuntimeClient) {
      /**
      Provides a convenient way to create cross-browser file-picker. Generates file selection dialog on click,
      converts selected files to _File_ objects, to be used in conjunction with _Image_, preloaded in memory
      with _FileReader_ or uploaded to a server through _XMLHttpRequest_.
        @class moxie/file/FileInput
      @constructor
      @extends EventTarget
      @uses RuntimeClient
      @param {Object|String|DOMElement} options If options is string or node, argument is considered as _browse\_button_.
        @param {String|DOMElement} options.browse_button DOM Element to turn into file picker.
        @param {Array} [options.accept] Array of mime types to accept. By default accepts all.
        @param {Boolean} [options.multiple=false] Enable selection of multiple files.
        @param {Boolean} [options.directory=false] Turn file input into the folder input (cannot be both at the same time).
        @param {String|DOMElement} [options.container] DOM Element to use as a container for file-picker. Defaults to parentNode
        for _browse\_button_.
        @param {Object|String} [options.required_caps] Set of required capabilities, that chosen runtime must support.
        @example
        <div id="container">
          <a id="file-picker" href="javascript:;">Browse...</a>
        </div>
          <script>
          var fileInput = new mOxie.FileInput({
            browse_button: 'file-picker', // or document.getElementById('file-picker')
            container: 'container',
            accept: [
              {title: "Image files", extensions: "jpg,gif,png"} // accept only images
            ],
            multiple: true // allow multiple file selection
          });
            fileInput.onchange = function(e) {
            // do something to files array
            console.info(e.target.files); // or this.files or fileInput.files
          };
            fileInput.init(); // initialize
        </script>
      */
      var dispatches = [
      /**
      Dispatched when runtime is connected and file-picker is ready to be used.
        @event ready
      @param {Object} event
      */
      'ready',

      /**
      Dispatched right after [ready](#event_ready) event, and whenever [refresh()](#method_refresh) is invoked.
      Check [corresponding documentation entry](#method_refresh) for more info.
        @event refresh
      @param {Object} event
      */

      /**
      Dispatched when selection of files in the dialog is complete.
        @event change
      @param {Object} event
      */
      'change', 'cancel', // TODO: might be useful

      /**
      Dispatched when mouse cursor enters file-picker area. Can be used to style element
      accordingly.
        @event mouseenter
      @param {Object} event
      */
      'mouseenter',

      /**
      Dispatched when mouse cursor leaves file-picker area. Can be used to style element
      accordingly.
        @event mouseleave
      @param {Object} event
      */
      'mouseleave',

      /**
      Dispatched when functional mouse button is pressed on top of file-picker area.
        @event mousedown
      @param {Object} event
      */
      'mousedown',

      /**
      Dispatched when functional mouse button is released on top of file-picker area.
        @event mouseup
      @param {Object} event
      */
      'mouseup'];

      function FileInput(options) {
        if (MXI_DEBUG) {
          Env.log("Instantiating FileInput...");
        }

        var container, browseButton, defaults;

        // if flat argument passed it should be browse_button id
        if (Basic.inArray(Basic.typeOf(options), ['string', 'node']) !== -1) {
          options = { browse_button: options };
        }

        // this will help us to find proper default container
        browseButton = Dom.get(options.browse_button);
        if (!browseButton) {
          // browse button is required
          throw new x.DOMException(x.DOMException.NOT_FOUND_ERR);
        }

        // figure out the options
        defaults = {
          accept: [{
            title: I18n.translate('All Files'),
            extensions: '*'
          }],
          multiple: false,
          required_caps: false,
          container: browseButton.parentNode || document.body
        };

        options = Basic.extend({}, defaults, options);

        // convert to object representation
        if (typeof options.required_caps === 'string') {
          options.required_caps = Runtime.parseCaps(options.required_caps);
        }

        // normalize accept option (could be list of mime types or array of title/extensions pairs)
        if (typeof options.accept === 'string') {
          options.accept = Mime.mimes2extList(options.accept);
        }

        container = Dom.get(options.container);
        // make sure we have container
        if (!container) {
          container = document.body;
        }

        // make container relative, if it's not
        if (Dom.getStyle(container, 'position') === 'static') {
          container.style.position = 'relative';
        }

        container = browseButton = null; // IE

        RuntimeClient.call(this);

        Basic.extend(this, {
          /**
          Unique id of the component
            @property uid
          @protected
          @readOnly
          @type {String}
          @default UID
          */
          uid: Basic.guid('uid_'),

          /**
          Unique id of the connected runtime, if any.
            @property ruid
          @protected
          @type {String}
          */
          ruid: null,

          /**
          Unique id of the runtime container. Useful to get hold of it for various manipulations.
            @property shimid
          @protected
          @type {String}
          */
          shimid: null,

          /**
          Array of selected mOxie.File objects
            @property files
          @type {Array}
          @default null
          */
          files: null,

          /**
          Initializes the file-picker, connects it to runtime and dispatches event ready when done.
            @method init
          */
          init: function () {
            var self = this;

            self.bind('RuntimeInit', function (e, runtime) {
              self.ruid = runtime.uid;
              self.shimid = runtime.shimid;

              self.bind("Ready", function () {
                self.trigger("Refresh");
              }, 999);

              // re-position and resize shim container
              self.bind('Refresh', function () {
                var pos, size, browseButton, shimContainer, zIndex;

                browseButton = Dom.get(options.browse_button);
                shimContainer = Dom.get(runtime.shimid); // do not use runtime.getShimContainer(), since it will create container if it doesn't exist

                if (browseButton) {
                  pos = Dom.getPos(browseButton, Dom.get(options.container));
                  size = Dom.getSize(browseButton);
                  zIndex = parseInt(Dom.getStyle(browseButton, 'z-index'), 10) || 0;

                  if (shimContainer) {
                    Basic.extend(shimContainer.style, {
                      top: pos.y + 'px',
                      left: pos.x + 'px',
                      width: size.w + 'px',
                      height: size.h + 'px',
                      zIndex: zIndex + 1
                    });
                  }
                }
                shimContainer = browseButton = null;
              });

              runtime.exec.call(self, 'FileInput', 'init', options);
            });

            // runtime needs: options.required_features, options.runtime_order and options.container
            self.connectRuntime(Basic.extend({}, options, {
              required_caps: {
                select_file: true
              }
            }));
          },

          /**
           * Get current option value by its name
           *
           * @method getOption
           * @param name
           * @return {Mixed}
           */
          getOption: function (name) {
            return options[name];
          },

          /**
           * Sets a new value for the option specified by name
           *
           * @method setOption
           * @param name
           * @param value
           */
          setOption: function (name, value) {
            if (!options.hasOwnProperty(name)) {
              return;
            }

            var oldValue = options[name];

            switch (name) {
              case 'accept':
                if (typeof value === 'string') {
                  value = Mime.mimes2extList(value);
                }
                break;

              case 'container':
              case 'required_caps':
                throw new x.FileException(x.FileException.NO_MODIFICATION_ALLOWED_ERR);
            }

            options[name] = value;
            this.exec('FileInput', 'setOption', name, value);

            this.trigger('OptionChanged', name, value, oldValue);
          },

          /**
          Disables file-picker element, so that it doesn't react to mouse clicks.
            @method disable
          @param {Boolean} [state=true] Disable component if - true, enable if - false
          */
          disable: function (state) {
            var runtime = this.getRuntime();
            if (runtime) {
              this.exec('FileInput', 'disable', Basic.typeOf(state) === 'undefined' ? true : state);
            }
          },

          /**
          Reposition and resize dialog trigger to match the position and size of browse_button element.
            @method refresh
          */
          refresh: function () {
            this.trigger("Refresh");
          },

          /**
          Destroy component.
            @method destroy
          */
          destroy: function () {
            var runtime = this.getRuntime();
            if (runtime) {
              runtime.exec.call(this, 'FileInput', 'destroy');
              this.disconnectRuntime();
            }

            if (Basic.typeOf(this.files) === 'array') {
              // no sense in leaving associated files behind
              Basic.each(this.files, function (file) {
                file.destroy();
              });
            }
            this.files = null;

            this.unbindAll();
          }
        });

        this.handleEventProps(dispatches);
      }

      FileInput.prototype = EventTarget.instance;

      return FileInput;
    });

    // Included from: src/javascript/file/File.js

    /**
     * File.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define('moxie/file/File', ['moxie/core/utils/Basic', 'moxie/core/utils/Mime', 'moxie/file/Blob'], function (Basic, Mime, Blob) {
      /**
      @class moxie/file/File
      @extends Blob
      @constructor
      @param {String} ruid Unique id of the runtime, to which this blob belongs to
      @param {Object} file Object "Native" file object, as it is represented in the runtime
      */
      function File(ruid, file) {
        if (!file) {
          // avoid extra errors in case we overlooked something
          file = {};
        }

        Blob.apply(this, arguments);

        if (!this.type) {
          this.type = Mime.getFileMime(file.name);
        }

        // sanitize file name or generate new one
        var name;
        if (file.name) {
          name = file.name.replace(/\\/g, '/');
          name = name.substr(name.lastIndexOf('/') + 1);
        } else if (this.type) {
          var prefix = this.type.split('/')[0];
          name = Basic.guid((prefix !== '' ? prefix : 'file') + '_');

          if (Mime.extensions[this.type]) {
            name += '.' + Mime.extensions[this.type][0]; // append proper extension if possible
          }
        }

        Basic.extend(this, {
          /**
          File name
            @property name
          @type {String}
          @default UID
          */
          name: name || Basic.guid('file_'),

          /**
          Relative path to the file inside a directory
            @property relativePath
          @type {String}
          @default ''
          */
          relativePath: '',

          /**
          Date of last modification
            @property lastModifiedDate
          @type {String}
          @default now
          */
          lastModifiedDate: file.lastModifiedDate || new Date().toLocaleString() // Thu Aug 23 2012 19:40:00 GMT+0400 (GET)
        });
      }

      File.prototype = Blob.prototype;

      return File;
    });

    // Included from: src/javascript/file/FileDrop.js

    /**
     * FileDrop.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define('moxie/file/FileDrop', ['moxie/core/I18n', 'moxie/core/utils/Dom', 'moxie/core/Exceptions', 'moxie/core/utils/Basic', 'moxie/core/utils/Env', 'moxie/file/File', 'moxie/runtime/RuntimeClient', 'moxie/core/EventTarget', 'moxie/core/utils/Mime'], function (I18n, Dom, x, Basic, Env, File, RuntimeClient, EventTarget, Mime) {
      /**
      Turn arbitrary DOM element to a drop zone accepting files. Converts selected files to _File_ objects, to be used
      in conjunction with _Image_, preloaded in memory with _FileReader_ or uploaded to a server through
      _XMLHttpRequest_.
        @example
        <div id="drop_zone">
          Drop files here
        </div>
        <br />
        <div id="filelist"></div>
          <script type="text/javascript">
          var fileDrop = new mOxie.FileDrop('drop_zone'), fileList = mOxie.get('filelist');
            fileDrop.ondrop = function() {
            mOxie.each(this.files, function(file) {
              fileList.innerHTML += '<div>' + file.name + '</div>';
            });
          };
            fileDrop.init();
        </script>
        @class moxie/file/FileDrop
      @constructor
      @extends EventTarget
      @uses RuntimeClient
      @param {Object|String} options If options has typeof string, argument is considered as options.drop_zone
        @param {String|DOMElement} options.drop_zone DOM Element to turn into a drop zone
        @param {Array} [options.accept] Array of mime types to accept. By default accepts all
        @param {Object|String} [options.required_caps] Set of required capabilities, that chosen runtime must support
      */
      var dispatches = [
      /**
      Dispatched when runtime is connected and drop zone is ready to accept files.
        @event ready
      @param {Object} event
      */
      'ready',

      /**
      Dispatched when dragging cursor enters the drop zone.
        @event dragenter
      @param {Object} event
      */
      'dragenter',

      /**
      Dispatched when dragging cursor leaves the drop zone.
        @event dragleave
      @param {Object} event
      */
      'dragleave',

      /**
      Dispatched when file is dropped onto the drop zone.
        @event drop
      @param {Object} event
      */
      'drop',

      /**
      Dispatched if error occurs.
        @event error
      @param {Object} event
      */
      'error'];

      function FileDrop(options) {
        if (MXI_DEBUG) {
          Env.log("Instantiating FileDrop...");
        }

        var self = this,
            defaults;

        // if flat argument passed it should be drop_zone id
        if (typeof options === 'string') {
          options = { drop_zone: options };
        }

        // figure out the options
        defaults = {
          accept: [{
            title: I18n.translate('All Files'),
            extensions: '*'
          }],
          required_caps: {
            drag_and_drop: true
          }
        };

        options = typeof options === 'object' ? Basic.extend({}, defaults, options) : defaults;

        // this will help us to find proper default container
        options.container = Dom.get(options.drop_zone) || document.body;

        // make container relative, if it is not
        if (Dom.getStyle(options.container, 'position') === 'static') {
          options.container.style.position = 'relative';
        }

        // normalize accept option (could be list of mime types or array of title/extensions pairs)
        if (typeof options.accept === 'string') {
          options.accept = Mime.mimes2extList(options.accept);
        }

        RuntimeClient.call(self);

        Basic.extend(self, {
          uid: Basic.guid('uid_'),

          ruid: null,

          files: null,

          init: function () {
            self.bind('RuntimeInit', function (e, runtime) {
              self.ruid = runtime.uid;
              runtime.exec.call(self, 'FileDrop', 'init', options);
              self.dispatchEvent('ready');
            });

            // runtime needs: options.required_features, options.runtime_order and options.container
            self.connectRuntime(options); // throws RuntimeError
          },

          destroy: function () {
            var runtime = this.getRuntime();
            if (runtime) {
              runtime.exec.call(this, 'FileDrop', 'destroy');
              this.disconnectRuntime();
            }
            this.files = null;

            this.unbindAll();
          }
        });

        this.handleEventProps(dispatches);
      }

      FileDrop.prototype = EventTarget.instance;

      return FileDrop;
    });

    // Included from: src/javascript/file/FileReader.js

    /**
     * FileReader.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define('moxie/file/FileReader', ['moxie/core/utils/Basic', 'moxie/core/utils/Encode', 'moxie/core/Exceptions', 'moxie/core/EventTarget', 'moxie/file/Blob', 'moxie/runtime/RuntimeClient'], function (Basic, Encode, x, EventTarget, Blob, RuntimeClient) {
      /**
      Utility for preloading o.Blob/o.File objects in memory. By design closely follows [W3C FileReader](http://www.w3.org/TR/FileAPI/#dfn-filereader)
      interface. Where possible uses native FileReader, where - not falls back to shims.
        @class moxie/file/FileReader
      @constructor FileReader
      @extends EventTarget
      @uses RuntimeClient
      */
      var dispatches = [

      /**
      Dispatched when the read starts.
        @event loadstart
      @param {Object} event
      */
      'loadstart',

      /**
      Dispatched while reading (and decoding) blob, and reporting partial Blob data (progess.loaded/progress.total).
        @event progress
      @param {Object} event
      */
      'progress',

      /**
      Dispatched when the read has successfully completed.
        @event load
      @param {Object} event
      */
      'load',

      /**
      Dispatched when the read has been aborted. For instance, by invoking the abort() method.
        @event abort
      @param {Object} event
      */
      'abort',

      /**
      Dispatched when the read has failed.
        @event error
      @param {Object} event
      */
      'error',

      /**
      Dispatched when the request has completed (either in success or failure).
        @event loadend
      @param {Object} event
      */
      'loadend'];

      function FileReader() {

        RuntimeClient.call(this);

        Basic.extend(this, {
          /**
          UID of the component instance.
            @property uid
          @type {String}
          */
          uid: Basic.guid('uid_'),

          /**
          Contains current state of FileReader object. Can take values of FileReader.EMPTY, FileReader.LOADING
          and FileReader.DONE.
            @property readyState
          @type {Number}
          @default FileReader.EMPTY
          */
          readyState: FileReader.EMPTY,

          /**
          Result of the successful read operation.
            @property result
          @type {String}
          */
          result: null,

          /**
          Stores the error of failed asynchronous read operation.
            @property error
          @type {DOMError}
          */
          error: null,

          /**
          Initiates reading of File/Blob object contents to binary string.
            @method readAsBinaryString
          @param {Blob|File} blob Object to preload
          */
          readAsBinaryString: function (blob) {
            _read.call(this, 'readAsBinaryString', blob);
          },

          /**
          Initiates reading of File/Blob object contents to dataURL string.
            @method readAsDataURL
          @param {Blob|File} blob Object to preload
          */
          readAsDataURL: function (blob) {
            _read.call(this, 'readAsDataURL', blob);
          },

          /**
          Initiates reading of File/Blob object contents to string.
            @method readAsText
          @param {Blob|File} blob Object to preload
          */
          readAsText: function (blob) {
            _read.call(this, 'readAsText', blob);
          },

          /**
          Aborts preloading process.
            @method abort
          */
          abort: function () {
            this.result = null;

            if (Basic.inArray(this.readyState, [FileReader.EMPTY, FileReader.DONE]) !== -1) {
              return;
            } else if (this.readyState === FileReader.LOADING) {
              this.readyState = FileReader.DONE;
            }

            this.exec('FileReader', 'abort');

            this.trigger('abort');
            this.trigger('loadend');
          },

          /**
          Destroy component and release resources.
            @method destroy
          */
          destroy: function () {
            this.abort();
            this.exec('FileReader', 'destroy');
            this.disconnectRuntime();
            this.unbindAll();
          }
        });

        // uid must already be assigned
        this.handleEventProps(dispatches);

        this.bind('Error', function (e, err) {
          this.readyState = FileReader.DONE;
          this.error = err;
        }, 999);

        this.bind('Load', function (e) {
          this.readyState = FileReader.DONE;
        }, 999);

        function _read(op, blob) {
          var self = this;

          this.trigger('loadstart');

          if (this.readyState === FileReader.LOADING) {
            this.trigger('error', new x.DOMException(x.DOMException.INVALID_STATE_ERR));
            this.trigger('loadend');
            return;
          }

          // if source is not o.Blob/o.File
          if (!(blob instanceof Blob)) {
            this.trigger('error', new x.DOMException(x.DOMException.NOT_FOUND_ERR));
            this.trigger('loadend');
            return;
          }

          this.result = null;
          this.readyState = FileReader.LOADING;

          if (blob.isDetached()) {
            var src = blob.getSource();
            switch (op) {
              case 'readAsText':
              case 'readAsBinaryString':
                this.result = src;
                break;
              case 'readAsDataURL':
                this.result = 'data:' + blob.type + ';base64,' + Encode.btoa(src);
                break;
            }
            this.readyState = FileReader.DONE;
            this.trigger('load');
            this.trigger('loadend');
          } else {
            this.connectRuntime(blob.ruid);
            this.exec('FileReader', 'read', op, blob);
          }
        }
      }

      /**
      Initial FileReader state
        @property EMPTY
      @type {Number}
      @final
      @static
      @default 0
      */
      FileReader.EMPTY = 0;

      /**
      FileReader switches to this state when it is preloading the source
        @property LOADING
      @type {Number}
      @final
      @static
      @default 1
      */
      FileReader.LOADING = 1;

      /**
      Preloading is complete, this is a final state
        @property DONE
      @type {Number}
      @final
      @static
      @default 2
      */
      FileReader.DONE = 2;

      FileReader.prototype = EventTarget.instance;

      return FileReader;
    });

    // Included from: src/javascript/core/utils/Url.js

    /**
     * Url.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define('moxie/core/utils/Url', ['moxie/core/utils/Basic'], function (Basic) {
      /**
      Parse url into separate components and fill in absent parts with parts from current url,
      based on https://raw.github.com/kvz/phpjs/master/functions/url/parse_url.js
        @method parseUrl
      @for Utils
      @static
      @param {String} url Url to parse (defaults to empty string if undefined)
      @return {Object} Hash containing extracted uri components
      */
      var parseUrl = function (url, currentUrl) {
        var key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment'],
            i = key.length,
            ports = {
          http: 80,
          https: 443
        },
            uri = {},
            regex = /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@\/]*):?([^:@\/]*))?@)?(\[[\da-fA-F:]+\]|[^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\\?([^#]*))?(?:#(.*))?)/,
            m = regex.exec(url || ''),
            isRelative,
            isSchemeLess = /^\/\/\w/.test(url);

        switch (Basic.typeOf(currentUrl)) {
          case 'undefined':
            currentUrl = parseUrl(document.location.href, false);
            break;

          case 'string':
            currentUrl = parseUrl(currentUrl, false);
            break;
        }

        while (i--) {
          if (m[i]) {
            uri[key[i]] = m[i];
          }
        }

        isRelative = !isSchemeLess && !uri.scheme;

        if (isSchemeLess || isRelative) {
          uri.scheme = currentUrl.scheme;
        }

        // when url is relative, we set the origin and the path ourselves
        if (isRelative) {
          uri.host = currentUrl.host;
          uri.port = currentUrl.port;

          var path = '';
          // for urls without trailing slash we need to figure out the path
          if (/^[^\/]/.test(uri.path)) {
            path = currentUrl.path;
            // if path ends with a filename, strip it
            if (/\/[^\/]*\.[^\/]*$/.test(path)) {
              path = path.replace(/\/[^\/]+$/, '/');
            } else {
              // avoid double slash at the end (see #127)
              path = path.replace(/\/?$/, '/');
            }
          }
          uri.path = path + (uri.path || ''); // site may reside at domain.com or domain.com/subdir
        }

        if (!uri.port) {
          uri.port = ports[uri.scheme] || 80;
        }

        uri.port = parseInt(uri.port, 10);

        if (!uri.path) {
          uri.path = "/";
        }

        delete uri.source;

        return uri;
      };

      /**
      Resolve url - among other things will turn relative url to absolute
        @method resolveUrl
      @static
      @param {String|Object} url Either absolute or relative, or a result of parseUrl call
      @return {String} Resolved, absolute url
      */
      var resolveUrl = function (url) {
        var ports = { // we ignore default ports
          http: 80,
          https: 443
        },
            urlp = typeof url === 'object' ? url : parseUrl(url);
        

        return urlp.scheme + '://' + urlp.host + (urlp.port !== ports[urlp.scheme] ? ':' + urlp.port : '') + urlp.path + (urlp.query ? urlp.query : '');
      };

      /**
      Check if specified url has the same origin as the current document
        @method hasSameOrigin
      @param {String|Object} url
      @return {Boolean}
      */
      var hasSameOrigin = function (url) {
        function origin(url) {
          return [url.scheme, url.host, url.port].join('/');
        }

        if (typeof url === 'string') {
          url = parseUrl(url);
        }

        return origin(parseUrl()) === origin(url);
      };

      return {
        parseUrl: parseUrl,
        resolveUrl: resolveUrl,
        hasSameOrigin: hasSameOrigin
      };
    });

    // Included from: src/javascript/runtime/RuntimeTarget.js

    /**
     * RuntimeTarget.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define('moxie/runtime/RuntimeTarget', ['moxie/core/utils/Basic', 'moxie/runtime/RuntimeClient', "moxie/core/EventTarget"], function (Basic, RuntimeClient, EventTarget) {
      /**
      Instance of this class can be used as a target for the events dispatched by shims,
      when allowing them onto components is for either reason inappropriate
        @class moxie/runtime/RuntimeTarget
      @constructor
      @protected
      @extends EventTarget
      */
      function RuntimeTarget() {
        this.uid = Basic.guid('uid_');

        RuntimeClient.call(this);

        this.destroy = function () {
          this.disconnectRuntime();
          this.unbindAll();
        };
      }

      RuntimeTarget.prototype = EventTarget.instance;

      return RuntimeTarget;
    });

    // Included from: src/javascript/file/FileReaderSync.js

    /**
     * FileReaderSync.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define('moxie/file/FileReaderSync', ['moxie/core/utils/Basic', 'moxie/runtime/RuntimeClient', 'moxie/core/utils/Encode'], function (Basic, RuntimeClient, Encode) {
      /**
      Synchronous FileReader implementation. Something like this is available in WebWorkers environment, here
      it can be used to read only preloaded blobs/files and only below certain size (not yet sure what that'd be,
      but probably < 1mb). Not meant to be used directly by user.
        @class moxie/file/FileReaderSync
      @private
      @constructor
      */
      return function () {
        RuntimeClient.call(this);

        Basic.extend(this, {
          uid: Basic.guid('uid_'),

          readAsBinaryString: function (blob) {
            return _read.call(this, 'readAsBinaryString', blob);
          },

          readAsDataURL: function (blob) {
            return _read.call(this, 'readAsDataURL', blob);
          },

          /*readAsArrayBuffer: function(blob) {
            return _read.call(this, 'readAsArrayBuffer', blob);
          },*/

          readAsText: function (blob) {
            return _read.call(this, 'readAsText', blob);
          }
        });

        function _read(op, blob) {
          if (blob.isDetached()) {
            var src = blob.getSource();
            switch (op) {
              case 'readAsBinaryString':
                return src;
              case 'readAsDataURL':
                return 'data:' + blob.type + ';base64,' + Encode.btoa(src);
              case 'readAsText':
                var txt = '';
                for (var i = 0, length = src.length; i < length; i++) {
                  txt += String.fromCharCode(src[i]);
                }
                return txt;
            }
          } else {
            var result = this.connectRuntime(blob.ruid).exec.call(this, 'FileReaderSync', 'read', op, blob);
            this.disconnectRuntime();
            return result;
          }
        }
      };
    });

    // Included from: src/javascript/xhr/FormData.js

    /**
     * FormData.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define("moxie/xhr/FormData", ["moxie/core/Exceptions", "moxie/core/utils/Basic", "moxie/file/Blob"], function (x, Basic, Blob) {
      /**
      FormData
        @class moxie/xhr/FormData
      @constructor
      */
      function FormData() {
        var _blob,
            _fields = [];

        Basic.extend(this, {
          /**
          Append another key-value pair to the FormData object
            @method append
          @param {String} name Name for the new field
          @param {String|Blob|Array|Object} value Value for the field
          */
          append: function (name, value) {
            var self = this,
                valueType = Basic.typeOf(value);

            // according to specs value might be either Blob or String
            if (value instanceof Blob) {
              _blob = {
                name: name,
                value: value // unfortunately we can only send single Blob in one FormData
              };
            } else if ('array' === valueType) {
              name += '[]';

              Basic.each(value, function (value) {
                self.append(name, value);
              });
            } else if ('object' === valueType) {
              Basic.each(value, function (value, key) {
                self.append(name + '[' + key + ']', value);
              });
            } else if ('null' === valueType || 'undefined' === valueType || 'number' === valueType && isNaN(value)) {
              self.append(name, "false");
            } else {
              _fields.push({
                name: name,
                value: value.toString()
              });
            }
          },

          /**
          Checks if FormData contains Blob.
            @method hasBlob
          @return {Boolean}
          */
          hasBlob: function () {
            return !!this.getBlob();
          },

          /**
          Retrieves blob.
            @method getBlob
          @return {Object} Either Blob if found or null
          */
          getBlob: function () {
            return _blob && _blob.value || null;
          },

          /**
          Retrieves blob field name.
            @method getBlobName
          @return {String} Either Blob field name or null
          */
          getBlobName: function () {
            return _blob && _blob.name || null;
          },

          /**
          Loop over the fields in FormData and invoke the callback for each of them.
            @method each
          @param {Function} cb Callback to call for each field
          */
          each: function (cb) {
            Basic.each(_fields, function (field) {
              cb(field.value, field.name);
            });

            if (_blob) {
              cb(_blob.value, _blob.name);
            }
          },

          destroy: function () {
            _blob = null;
            _fields = [];
          }
        });
      }

      return FormData;
    });

    // Included from: src/javascript/xhr/XMLHttpRequest.js

    /**
     * XMLHttpRequest.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define("moxie/xhr/XMLHttpRequest", ["moxie/core/utils/Basic", "moxie/core/Exceptions", "moxie/core/EventTarget", "moxie/core/utils/Encode", "moxie/core/utils/Url", "moxie/runtime/Runtime", "moxie/runtime/RuntimeTarget", "moxie/file/Blob", "moxie/file/FileReaderSync", "moxie/xhr/FormData", "moxie/core/utils/Env", "moxie/core/utils/Mime"], function (Basic, x, EventTarget, Encode, Url, Runtime, RuntimeTarget, Blob, FileReaderSync, FormData, Env, Mime) {

      var httpCode = {
        100: 'Continue',
        101: 'Switching Protocols',
        102: 'Processing',

        200: 'OK',
        201: 'Created',
        202: 'Accepted',
        203: 'Non-Authoritative Information',
        204: 'No Content',
        205: 'Reset Content',
        206: 'Partial Content',
        207: 'Multi-Status',
        226: 'IM Used',

        300: 'Multiple Choices',
        301: 'Moved Permanently',
        302: 'Found',
        303: 'See Other',
        304: 'Not Modified',
        305: 'Use Proxy',
        306: 'Reserved',
        307: 'Temporary Redirect',

        400: 'Bad Request',
        401: 'Unauthorized',
        402: 'Payment Required',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        406: 'Not Acceptable',
        407: 'Proxy Authentication Required',
        408: 'Request Timeout',
        409: 'Conflict',
        410: 'Gone',
        411: 'Length Required',
        412: 'Precondition Failed',
        413: 'Request Entity Too Large',
        414: 'Request-URI Too Long',
        415: 'Unsupported Media Type',
        416: 'Requested Range Not Satisfiable',
        417: 'Expectation Failed',
        422: 'Unprocessable Entity',
        423: 'Locked',
        424: 'Failed Dependency',
        426: 'Upgrade Required',

        500: 'Internal Server Error',
        501: 'Not Implemented',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout',
        505: 'HTTP Version Not Supported',
        506: 'Variant Also Negotiates',
        507: 'Insufficient Storage',
        510: 'Not Extended'
      };

      function XMLHttpRequestUpload() {
        this.uid = Basic.guid('uid_');
      }

      XMLHttpRequestUpload.prototype = EventTarget.instance;

      /**
      Implementation of XMLHttpRequest
        @class moxie/xhr/XMLHttpRequest
      @constructor
      @uses RuntimeClient
      @extends EventTarget
      */
      var dispatches = ['loadstart', 'progress', 'abort', 'error', 'load', 'timeout', 'loadend'

      // readystatechange (for historical reasons)
      ];

      var NATIVE = 1,
          RUNTIME = 2;

      function XMLHttpRequest() {
        var self = this,

        // this (together with _p() @see below) is here to gracefully upgrade to setter/getter syntax where possible
        props = {
          /**
          The amount of milliseconds a request can take before being terminated. Initially zero. Zero means there is no timeout.
            @property timeout
          @type Number
          @default 0
          */
          timeout: 0,

          /**
          Current state, can take following values:
          UNSENT (numeric value 0)
          The object has been constructed.
            OPENED (numeric value 1)
          The open() method has been successfully invoked. During this state request headers can be set using setRequestHeader() and the request can be made using the send() method.
            HEADERS_RECEIVED (numeric value 2)
          All redirects (if any) have been followed and all HTTP headers of the final response have been received. Several response members of the object are now available.
            LOADING (numeric value 3)
          The response entity body is being received.
            DONE (numeric value 4)
            @property readyState
          @type Number
          @default 0 (UNSENT)
          */
          readyState: XMLHttpRequest.UNSENT,

          /**
          True when user credentials are to be included in a cross-origin request. False when they are to be excluded
          in a cross-origin request and when cookies are to be ignored in its response. Initially false.
            @property withCredentials
          @type Boolean
          @default false
          */
          withCredentials: false,

          /**
          Returns the HTTP status code.
            @property status
          @type Number
          @default 0
          */
          status: 0,

          /**
          Returns the HTTP status text.
            @property statusText
          @type String
          */
          statusText: "",

          /**
          Returns the response type. Can be set to change the response type. Values are:
          the empty string (default), "arraybuffer", "blob", "document", "json", and "text".
            @property responseType
          @type String
          */
          responseType: "",

          /**
          Returns the document response entity body.
            Throws an "InvalidStateError" exception if responseType is not the empty string or "document".
            @property responseXML
          @type Document
          */
          responseXML: null,

          /**
          Returns the text response entity body.
            Throws an "InvalidStateError" exception if responseType is not the empty string or "text".
            @property responseText
          @type String
          */
          responseText: null,

          /**
          Returns the response entity body (http://www.w3.org/TR/XMLHttpRequest/#response-entity-body).
          Can become: ArrayBuffer, Blob, Document, JSON, Text
            @property response
          @type Mixed
          */
          response: null
        },
            _async = true,
            _url,
            _method,
            _headers = {},
            _user,
            _password,
            _encoding = null,
            _mimeType = null,


        // flags
        _sync_flag = false,
            _send_flag = false,
            _upload_events_flag = false,
            _upload_complete_flag = false,
            _error_flag = false,
            _same_origin_flag = false,


        // times
        _start_time,
            _timeoutset_time,
            _finalMime = null,
            _finalCharset = null,
            _options = {},
            _xhr,
            _responseHeaders = '',
            _responseHeadersBag;

        Basic.extend(this, props, {
          /**
          Unique id of the component
            @property uid
          @type String
          */
          uid: Basic.guid('uid_'),

          /**
          Target for Upload events
            @property upload
          @type XMLHttpRequestUpload
          */
          upload: new XMLHttpRequestUpload(),

          /**
          Sets the request method, request URL, synchronous flag, request username, and request password.
            Throws a "SyntaxError" exception if one of the following is true:
            method is not a valid HTTP method.
          url cannot be resolved.
          url contains the "user:password" format in the userinfo production.
          Throws a "SecurityError" exception if method is a case-insensitive match for CONNECT, TRACE or TRACK.
            Throws an "InvalidAccessError" exception if one of the following is true:
            Either user or password is passed as argument and the origin of url does not match the XMLHttpRequest origin.
          There is an associated XMLHttpRequest document and either the timeout attribute is not zero,
          the withCredentials attribute is true, or the responseType attribute is not the empty string.
              @method open
          @param {String} method HTTP method to use on request
          @param {String} url URL to request
          @param {Boolean} [async=true] If false request will be done in synchronous manner. Asynchronous by default.
          @param {String} [user] Username to use in HTTP authentication process on server-side
          @param {String} [password] Password to use in HTTP authentication process on server-side
          */
          open: function (method, url, async, user, password) {
            var urlp;

            // first two arguments are required
            if (!method || !url) {
              throw new x.DOMException(x.DOMException.SYNTAX_ERR);
            }

            // 2 - check if any code point in method is higher than U+00FF or after deflating method it does not match the method
            if (/[\u0100-\uffff]/.test(method) || Encode.utf8_encode(method) !== method) {
              throw new x.DOMException(x.DOMException.SYNTAX_ERR);
            }

            // 3
            if (!!~Basic.inArray(method.toUpperCase(), ['CONNECT', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'TRACE', 'TRACK'])) {
              _method = method.toUpperCase();
            }

            // 4 - allowing these methods poses a security risk
            if (!!~Basic.inArray(_method, ['CONNECT', 'TRACE', 'TRACK'])) {
              throw new x.DOMException(x.DOMException.SECURITY_ERR);
            }

            // 5
            url = Encode.utf8_encode(url);

            // 6 - Resolve url relative to the XMLHttpRequest base URL. If the algorithm returns an error, throw a "SyntaxError".
            urlp = Url.parseUrl(url);

            _same_origin_flag = Url.hasSameOrigin(urlp);

            // 7 - manually build up absolute url
            _url = Url.resolveUrl(url);

            // 9-10, 12-13
            if ((user || password) && !_same_origin_flag) {
              throw new x.DOMException(x.DOMException.INVALID_ACCESS_ERR);
            }

            _user = user || urlp.user;
            _password = password || urlp.pass;

            // 11
            _async = async || true;

            if (_async === false && (_p('timeout') || _p('withCredentials') || _p('responseType') !== "")) {
              throw new x.DOMException(x.DOMException.INVALID_ACCESS_ERR);
            }

            // 14 - terminate abort()

            // 15 - terminate send()

            // 18
            _sync_flag = !_async;
            _send_flag = false;
            _headers = {};
            _reset.call(this);

            // 19
            _p('readyState', XMLHttpRequest.OPENED);

            // 20
            this.dispatchEvent('readystatechange');
          },

          /**
          Appends an header to the list of author request headers, or if header is already
          in the list of author request headers, combines its value with value.
            Throws an "InvalidStateError" exception if the state is not OPENED or if the send() flag is set.
          Throws a "SyntaxError" exception if header is not a valid HTTP header field name or if value
          is not a valid HTTP header field value.
            @method setRequestHeader
          @param {String} header
          @param {String|Number} value
          */
          setRequestHeader: function (header, value) {
            var uaHeaders = [// these headers are controlled by the user agent
            "accept-charset", "accept-encoding", "access-control-request-headers", "access-control-request-method", "connection", "content-length", "cookie", "cookie2", "content-transfer-encoding", "date", "expect", "host", "keep-alive", "origin", "referer", "te", "trailer", "transfer-encoding", "upgrade", "user-agent", "via"];

            // 1-2
            if (_p('readyState') !== XMLHttpRequest.OPENED || _send_flag) {
              throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
            }

            // 3
            if (/[\u0100-\uffff]/.test(header) || Encode.utf8_encode(header) !== header) {
              throw new x.DOMException(x.DOMException.SYNTAX_ERR);
            }

            // 4
            /* this step is seemingly bypassed in browsers, probably to allow various unicode characters in header values
            if (/[\u0100-\uffff]/.test(value) || Encode.utf8_encode(value) !== value) {
              throw new x.DOMException(x.DOMException.SYNTAX_ERR);
            }*/

            header = Basic.trim(header).toLowerCase();

            // setting of proxy-* and sec-* headers is prohibited by spec
            if (!!~Basic.inArray(header, uaHeaders) || /^(proxy\-|sec\-)/.test(header)) {
              return false;
            }

            // camelize
            // browsers lowercase header names (at least for custom ones)
            // header = header.replace(/\b\w/g, function($1) { return $1.toUpperCase(); });

            if (!_headers[header]) {
              _headers[header] = value;
            } else {
              // http://tools.ietf.org/html/rfc2616#section-4.2 (last paragraph)
              _headers[header] += ', ' + value;
            }
            return true;
          },

          /**
           * Test if the specified header is already set on this request.
           * Returns a header value or boolean false if it's not yet set.
           *
           * @method hasRequestHeader
           * @param {String} header Name of the header to test
           * @return {Boolean|String}
           */
          hasRequestHeader: function (header) {
            return header && _headers[header.toLowerCase()] || false;
          },

          /**
          Returns all headers from the response, with the exception of those whose field name is Set-Cookie or Set-Cookie2.
            @method getAllResponseHeaders
          @return {String} reponse headers or empty string
          */
          getAllResponseHeaders: function () {
            return _responseHeaders || '';
          },

          /**
          Returns the header field value from the response of which the field name matches header,
          unless the field name is Set-Cookie or Set-Cookie2.
            @method getResponseHeader
          @param {String} header
          @return {String} value(s) for the specified header or null
          */
          getResponseHeader: function (header) {
            header = header.toLowerCase();

            if (_error_flag || !!~Basic.inArray(header, ['set-cookie', 'set-cookie2'])) {
              return null;
            }

            if (_responseHeaders && _responseHeaders !== '') {
              // if we didn't parse response headers until now, do it and keep for later
              if (!_responseHeadersBag) {
                _responseHeadersBag = {};
                Basic.each(_responseHeaders.split(/\r\n/), function (line) {
                  var pair = line.split(/:\s+/);
                  if (pair.length === 2) {
                    // last line might be empty, omit
                    pair[0] = Basic.trim(pair[0]); // just in case
                    _responseHeadersBag[pair[0].toLowerCase()] = { // simply to retain header name in original form
                      header: pair[0],
                      value: Basic.trim(pair[1])
                    };
                  }
                });
              }
              if (_responseHeadersBag.hasOwnProperty(header)) {
                return _responseHeadersBag[header].header + ': ' + _responseHeadersBag[header].value;
              }
            }
            return null;
          },

          /**
          Sets the Content-Type header for the response to mime.
          Throws an "InvalidStateError" exception if the state is LOADING or DONE.
          Throws a "SyntaxError" exception if mime is not a valid media type.
            @method overrideMimeType
          @param String mime Mime type to set
          */
          overrideMimeType: function (mime) {
            var matches, charset;

            // 1
            if (!!~Basic.inArray(_p('readyState'), [XMLHttpRequest.LOADING, XMLHttpRequest.DONE])) {
              throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
            }

            // 2
            mime = Basic.trim(mime.toLowerCase());

            if (/;/.test(mime) && (matches = mime.match(/^([^;]+)(?:;\scharset\=)?(.*)$/))) {
              mime = matches[1];
              if (matches[2]) {
                charset = matches[2];
              }
            }

            if (!Mime.mimes[mime]) {
              throw new x.DOMException(x.DOMException.SYNTAX_ERR);
            }

            // 3-4
            _finalMime = mime;
            _finalCharset = charset;
          },

          /**
          Initiates the request. The optional argument provides the request entity body.
          The argument is ignored if request method is GET or HEAD.
            Throws an "InvalidStateError" exception if the state is not OPENED or if the send() flag is set.
            @method send
          @param {Blob|Document|String|FormData} [data] Request entity body
          @param {Object} [options] Set of requirements and pre-requisities for runtime initialization
          */
          send: function (data, options) {
            if (Basic.typeOf(options) === 'string') {
              _options = { ruid: options };
            } else if (!options) {
              _options = {};
            } else {
              _options = options;
            }

            // 1-2
            if (this.readyState !== XMLHttpRequest.OPENED || _send_flag) {
              throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
            }

            // 3
            // sending Blob
            if (data instanceof Blob) {
              _options.ruid = data.ruid;
              _mimeType = data.type || 'application/octet-stream';
            }

            // FormData
            else if (data instanceof FormData) {
                if (data.hasBlob()) {
                  var blob = data.getBlob();
                  _options.ruid = blob.ruid;
                  _mimeType = blob.type || 'application/octet-stream';
                }
              }

              // DOMString
              else if (typeof data === 'string') {
                  _encoding = 'UTF-8';
                  _mimeType = 'text/plain;charset=UTF-8';

                  // data should be converted to Unicode and encoded as UTF-8
                  data = Encode.utf8_encode(data);
                }

            // if withCredentials not set, but requested, set it automatically
            if (!this.withCredentials) {
              this.withCredentials = _options.required_caps && _options.required_caps.send_browser_cookies && !_same_origin_flag;
            }

            // 4 - storage mutex
            // 5
            _upload_events_flag = !_sync_flag && this.upload.hasEventListener(); // DSAP
            // 6
            _error_flag = false;
            // 7
            _upload_complete_flag = !data;
            // 8 - Asynchronous steps
            if (!_sync_flag) {
              // 8.1
              _send_flag = true;
              // 8.2
              // this.dispatchEvent('loadstart'); // will be dispatched either by native or runtime xhr
              // 8.3
              //if (!_upload_complete_flag) {
              // this.upload.dispatchEvent('loadstart');  // will be dispatched either by native or runtime xhr
              //}
            }
            // 8.5 - Return the send() method call, but continue running the steps in this algorithm.
            _doXHR.call(this, data);
          },

          /**
          Cancels any network activity.
            @method abort
          */
          abort: function () {
            _error_flag = true;
            _sync_flag = false;

            if (!~Basic.inArray(_p('readyState'), [XMLHttpRequest.UNSENT, XMLHttpRequest.OPENED, XMLHttpRequest.DONE])) {
              _p('readyState', XMLHttpRequest.DONE);
              _send_flag = false;

              if (_xhr) {
                _xhr.getRuntime().exec.call(_xhr, 'XMLHttpRequest', 'abort', _upload_complete_flag);
              } else {
                throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
              }

              _upload_complete_flag = true;
            } else {
              _p('readyState', XMLHttpRequest.UNSENT);
            }
          },

          destroy: function () {
            if (_xhr) {
              if (Basic.typeOf(_xhr.destroy) === 'function') {
                _xhr.destroy();
              }
              _xhr = null;
            }

            this.unbindAll();

            if (this.upload) {
              this.upload.unbindAll();
              this.upload = null;
            }
          }
        });

        this.handleEventProps(dispatches.concat(['readystatechange'])); // for historical reasons
        this.upload.handleEventProps(dispatches);

        /* this is nice, but maybe too lengthy
          // if supported by JS version, set getters/setters for specific properties
        o.defineProperty(this, 'readyState', {
          configurable: false,
            get: function() {
            return _p('readyState');
          }
        });
          o.defineProperty(this, 'timeout', {
          configurable: false,
            get: function() {
            return _p('timeout');
          },
            set: function(value) {
              if (_sync_flag) {
              throw new x.DOMException(x.DOMException.INVALID_ACCESS_ERR);
            }
              // timeout still should be measured relative to the start time of request
            _timeoutset_time = (new Date).getTime();
              _p('timeout', value);
          }
        });
          // the withCredentials attribute has no effect when fetching same-origin resources
        o.defineProperty(this, 'withCredentials', {
          configurable: false,
            get: function() {
            return _p('withCredentials');
          },
            set: function(value) {
            // 1-2
            if (!~o.inArray(_p('readyState'), [XMLHttpRequest.UNSENT, XMLHttpRequest.OPENED]) || _send_flag) {
              throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
            }
              // 3-4
            if (_anonymous_flag || _sync_flag) {
              throw new x.DOMException(x.DOMException.INVALID_ACCESS_ERR);
            }
              // 5
            _p('withCredentials', value);
          }
        });
          o.defineProperty(this, 'status', {
          configurable: false,
            get: function() {
            return _p('status');
          }
        });
          o.defineProperty(this, 'statusText', {
          configurable: false,
            get: function() {
            return _p('statusText');
          }
        });
          o.defineProperty(this, 'responseType', {
          configurable: false,
            get: function() {
            return _p('responseType');
          },
            set: function(value) {
            // 1
            if (!!~o.inArray(_p('readyState'), [XMLHttpRequest.LOADING, XMLHttpRequest.DONE])) {
              throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
            }
              // 2
            if (_sync_flag) {
              throw new x.DOMException(x.DOMException.INVALID_ACCESS_ERR);
            }
              // 3
            _p('responseType', value.toLowerCase());
          }
        });
          o.defineProperty(this, 'responseText', {
          configurable: false,
            get: function() {
            // 1
            if (!~o.inArray(_p('responseType'), ['', 'text'])) {
              throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
            }
              // 2-3
            if (_p('readyState') !== XMLHttpRequest.DONE && _p('readyState') !== XMLHttpRequest.LOADING || _error_flag) {
              throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
            }
              return _p('responseText');
          }
        });
          o.defineProperty(this, 'responseXML', {
          configurable: false,
            get: function() {
            // 1
            if (!~o.inArray(_p('responseType'), ['', 'document'])) {
              throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
            }
              // 2-3
            if (_p('readyState') !== XMLHttpRequest.DONE || _error_flag) {
              throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
            }
              return _p('responseXML');
          }
        });
          o.defineProperty(this, 'response', {
          configurable: false,
            get: function() {
            if (!!~o.inArray(_p('responseType'), ['', 'text'])) {
              if (_p('readyState') !== XMLHttpRequest.DONE && _p('readyState') !== XMLHttpRequest.LOADING || _error_flag) {
                return '';
              }
            }
              if (_p('readyState') !== XMLHttpRequest.DONE || _error_flag) {
              return null;
            }
              return _p('response');
          }
        });
          */

        function _p(prop, value) {
          if (!props.hasOwnProperty(prop)) {
            return;
          }
          if (arguments.length === 1) {
            // get
            return Env.can('define_property') ? props[prop] : self[prop];
          } else {
            // set
            if (Env.can('define_property')) {
              props[prop] = value;
            } else {
              self[prop] = value;
            }
          }
        }

        /*
        function _toASCII(str, AllowUnassigned, UseSTD3ASCIIRules) {
          // TODO: http://tools.ietf.org/html/rfc3490#section-4.1
          return str.toLowerCase();
        }
        */

        function _doXHR(data) {
          var self = this;

          _start_time = new Date().getTime();

          _xhr = new RuntimeTarget();

          function loadEnd() {
            if (_xhr) {
              // it could have been destroyed by now
              _xhr.destroy();
              _xhr = null;
            }
            self.dispatchEvent('loadend');
            self = null;
          }

          function exec(runtime) {
            _xhr.bind('LoadStart', function (e) {
              _p('readyState', XMLHttpRequest.LOADING);
              self.dispatchEvent('readystatechange');

              self.dispatchEvent(e);

              if (_upload_events_flag) {
                self.upload.dispatchEvent(e);
              }
            });

            _xhr.bind('Progress', function (e) {
              if (_p('readyState') !== XMLHttpRequest.LOADING) {
                _p('readyState', XMLHttpRequest.LOADING); // LoadStart unreliable (in Flash for example)
                self.dispatchEvent('readystatechange');
              }
              self.dispatchEvent(e);
            });

            _xhr.bind('UploadProgress', function (e) {
              if (_upload_events_flag) {
                self.upload.dispatchEvent({
                  type: 'progress',
                  lengthComputable: false,
                  total: e.total,
                  loaded: e.loaded
                });
              }
            });

            _xhr.bind('Load', function (e) {
              _p('readyState', XMLHttpRequest.DONE);
              _p('status', Number(runtime.exec.call(_xhr, 'XMLHttpRequest', 'getStatus') || 0));
              _p('statusText', httpCode[_p('status')] || "");

              _p('response', runtime.exec.call(_xhr, 'XMLHttpRequest', 'getResponse', _p('responseType')));

              if (!!~Basic.inArray(_p('responseType'), ['text', ''])) {
                _p('responseText', _p('response'));
              } else if (_p('responseType') === 'document') {
                _p('responseXML', _p('response'));
              }

              _responseHeaders = runtime.exec.call(_xhr, 'XMLHttpRequest', 'getAllResponseHeaders');

              self.dispatchEvent('readystatechange');

              if (_p('status') > 0) {
                // status 0 usually means that server is unreachable
                if (_upload_events_flag) {
                  self.upload.dispatchEvent(e);
                }
                self.dispatchEvent(e);
              } else {
                _error_flag = true;
                self.dispatchEvent('error');
              }
              loadEnd();
            });

            _xhr.bind('Abort', function (e) {
              self.dispatchEvent(e);
              loadEnd();
            });

            _xhr.bind('Error', function (e) {
              _error_flag = true;
              _p('readyState', XMLHttpRequest.DONE);
              self.dispatchEvent('readystatechange');
              _upload_complete_flag = true;
              self.dispatchEvent(e);
              loadEnd();
            });

            runtime.exec.call(_xhr, 'XMLHttpRequest', 'send', {
              url: _url,
              method: _method,
              async: _async,
              user: _user,
              password: _password,
              headers: _headers,
              mimeType: _mimeType,
              encoding: _encoding,
              responseType: self.responseType,
              withCredentials: self.withCredentials,
              options: _options
            }, data);
          }

          // clarify our requirements
          if (typeof _options.required_caps === 'string') {
            _options.required_caps = Runtime.parseCaps(_options.required_caps);
          }

          _options.required_caps = Basic.extend({}, _options.required_caps, {
            return_response_type: self.responseType
          });

          if (data instanceof FormData) {
            _options.required_caps.send_multipart = true;
          }

          if (!Basic.isEmptyObj(_headers)) {
            _options.required_caps.send_custom_headers = true;
          }

          if (!_same_origin_flag) {
            _options.required_caps.do_cors = true;
          }

          if (_options.ruid) {
            // we do not need to wait if we can connect directly
            exec(_xhr.connectRuntime(_options));
          } else {
            _xhr.bind('RuntimeInit', function (e, runtime) {
              exec(runtime);
            });
            _xhr.bind('RuntimeError', function (e, err) {
              self.dispatchEvent('RuntimeError', err);
            });
            _xhr.connectRuntime(_options);
          }
        }

        function _reset() {
          _p('responseText', "");
          _p('responseXML', null);
          _p('response', null);
          _p('status', 0);
          _p('statusText', "");
          _start_time = _timeoutset_time = null;
        }
      }

      XMLHttpRequest.UNSENT = 0;
      XMLHttpRequest.OPENED = 1;
      XMLHttpRequest.HEADERS_RECEIVED = 2;
      XMLHttpRequest.LOADING = 3;
      XMLHttpRequest.DONE = 4;

      XMLHttpRequest.prototype = EventTarget.instance;

      return XMLHttpRequest;
    });

    // Included from: src/javascript/runtime/Transporter.js

    /**
     * Transporter.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define("moxie/runtime/Transporter", ["moxie/core/utils/Basic", "moxie/core/utils/Encode", "moxie/runtime/RuntimeClient", "moxie/core/EventTarget"], function (Basic, Encode, RuntimeClient, EventTarget) {

      /**
      @class moxie/runtime/Transporter
      @constructor
      */
      function Transporter() {
        var mod, _runtime, _data, _size, _pos, _chunk_size;

        RuntimeClient.call(this);

        Basic.extend(this, {
          uid: Basic.guid('uid_'),

          state: Transporter.IDLE,

          result: null,

          transport: function (data, type, options) {
            var self = this;

            options = Basic.extend({
              chunk_size: 204798
            }, options);

            // should divide by three, base64 requires this
            if (mod = options.chunk_size % 3) {
              options.chunk_size += 3 - mod;
            }

            _chunk_size = options.chunk_size;

            _reset.call(this);
            _data = data;
            _size = data.length;

            if (Basic.typeOf(options) === 'string' || options.ruid) {
              _run.call(self, type, this.connectRuntime(options));
            } else {
              // we require this to run only once
              var cb = function (e, runtime) {
                self.unbind("RuntimeInit", cb);
                _run.call(self, type, runtime);
              };
              this.bind("RuntimeInit", cb);
              this.connectRuntime(options);
            }
          },

          abort: function () {
            var self = this;

            self.state = Transporter.IDLE;
            if (_runtime) {
              _runtime.exec.call(self, 'Transporter', 'clear');
              self.trigger("TransportingAborted");
            }

            _reset.call(self);
          },

          destroy: function () {
            this.unbindAll();
            _runtime = null;
            this.disconnectRuntime();
            _reset.call(this);
          }
        });

        function _reset() {
          _size = _pos = 0;
          _data = this.result = null;
        }

        function _run(type, runtime) {
          var self = this;

          _runtime = runtime;

          //self.unbind("RuntimeInit");

          self.bind("TransportingProgress", function (e) {
            _pos = e.loaded;

            if (_pos < _size && Basic.inArray(self.state, [Transporter.IDLE, Transporter.DONE]) === -1) {
              _transport.call(self);
            }
          }, 999);

          self.bind("TransportingComplete", function () {
            _pos = _size;
            self.state = Transporter.DONE;
            _data = null; // clean a bit
            self.result = _runtime.exec.call(self, 'Transporter', 'getAsBlob', type || '');
          }, 999);

          self.state = Transporter.BUSY;
          self.trigger("TransportingStarted");
          _transport.call(self);
        }

        function _transport() {
          var self = this,
              chunk,
              bytesLeft = _size - _pos;

          if (_chunk_size > bytesLeft) {
            _chunk_size = bytesLeft;
          }

          chunk = Encode.btoa(_data.substr(_pos, _chunk_size));
          _runtime.exec.call(self, 'Transporter', 'receive', chunk, _size);
        }
      }

      Transporter.IDLE = 0;
      Transporter.BUSY = 1;
      Transporter.DONE = 2;

      Transporter.prototype = EventTarget.instance;

      return Transporter;
    });

    // Included from: src/javascript/image/Image.js

    /**
     * Image.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define("moxie/image/Image", ["moxie/core/utils/Basic", "moxie/core/utils/Dom", "moxie/core/Exceptions", "moxie/file/FileReaderSync", "moxie/xhr/XMLHttpRequest", "moxie/runtime/Runtime", "moxie/runtime/RuntimeClient", "moxie/runtime/Transporter", "moxie/core/utils/Env", "moxie/core/EventTarget", "moxie/file/Blob", "moxie/file/File", "moxie/core/utils/Encode"], function (Basic, Dom, x, FileReaderSync, XMLHttpRequest, Runtime, RuntimeClient, Transporter, Env, EventTarget, Blob, File, Encode) {
      /**
      Image preloading and manipulation utility. Additionally it provides access to image meta info (Exif, GPS) and raw binary data.
        @class moxie/image/Image
      @constructor
      @extends EventTarget
      */
      var dispatches = ['progress',

      /**
      Dispatched when loading is complete.
        @event load
      @param {Object} event
      */
      'load', 'error',

      /**
      Dispatched when resize operation is complete.
        @event resize
      @param {Object} event
      */
      'resize',

      /**
      Dispatched when visual representation of the image is successfully embedded
      into the corresponsing container.
        @event embedded
      @param {Object} event
      */
      'embedded'];

      function Image() {

        RuntimeClient.call(this);

        Basic.extend(this, {
          /**
          Unique id of the component
            @property uid
          @type {String}
          */
          uid: Basic.guid('uid_'),

          /**
          Unique id of the connected runtime, if any.
            @property ruid
          @type {String}
          */
          ruid: null,

          /**
          Name of the file, that was used to create an image, if available. If not equals to empty string.
            @property name
          @type {String}
          @default ""
          */
          name: "",

          /**
          Size of the image in bytes. Actual value is set only after image is preloaded.
            @property size
          @type {Number}
          @default 0
          */
          size: 0,

          /**
          Width of the image. Actual value is set only after image is preloaded.
            @property width
          @type {Number}
          @default 0
          */
          width: 0,

          /**
          Height of the image. Actual value is set only after image is preloaded.
            @property height
          @type {Number}
          @default 0
          */
          height: 0,

          /**
          Mime type of the image. Currently only image/jpeg and image/png are supported. Actual value is set only after image is preloaded.
            @property type
          @type {String}
          @default ""
          */
          type: "",

          /**
          Holds meta info (Exif, GPS). Is populated only for image/jpeg. Actual value is set only after image is preloaded.
            @property meta
          @type {Object}
          @default {}
          */
          meta: {},

          /**
          Alias for load method, that takes another mOxie.Image object as a source (see load).
            @method clone
          @param {Image} src Source for the image
          @param {Boolean} [exact=false] Whether to activate in-depth clone mode
          */
          clone: function () {
            this.load.apply(this, arguments);
          },

          /**
          Loads image from various sources. Currently the source for new image can be: mOxie.Image, mOxie.Blob/mOxie.File,
          native Blob/File, dataUrl or URL. Depending on the type of the source, arguments - differ. When source is URL,
          Image will be downloaded from remote destination and loaded in memory.
            @example
            var img = new mOxie.Image();
            img.onload = function() {
              var blob = img.getAsBlob();
                var formData = new mOxie.FormData();
              formData.append('file', blob);
                var xhr = new mOxie.XMLHttpRequest();
              xhr.onload = function() {
                // upload complete
              };
              xhr.open('post', 'upload.php');
              xhr.send(formData);
            };
            img.load("http://www.moxiecode.com/images/mox-logo.jpg"); // notice file extension (.jpg)
              @method load
          @param {Image|Blob|File|String} src Source for the image
          @param {Boolean|Object} [mixed]
          */
          load: function () {
            _load.apply(this, arguments);
          },

          /**
          Resizes the image to fit the specified width/height. If crop is specified, image will also be
          cropped to the exact dimensions.
            @method resize
          @since 3.0
          @param {Object} options
            @param {Number} options.width Resulting width
            @param {Number} [options.height=width] Resulting height (optional, if not supplied will default to width)
            @param {String} [options.type='image/jpeg'] MIME type of the resulting image
            @param {Number} [options.quality=90] In the case of JPEG, controls the quality of resulting image
            @param {Boolean} [options.crop='cc'] If not falsy, image will be cropped, by default from center
            @param {Boolean} [options.fit=true] In case of crop whether to upscale the image to fit the exact dimensions
            @param {Boolean} [options.preserveHeaders=true] Whether to preserve meta headers (on JPEGs after resize)
            @param {String} [options.resample='default'] Resampling algorithm to use during resize
            @param {Boolean} [options.multipass=true] Whether to scale the image in steps (results in better quality)
          */
          resize: function (options) {
            var self = this;
            var orientation;
            var scale;

            var srcRect = {
              x: 0,
              y: 0,
              width: self.width,
              height: self.height
            };

            var opts = Basic.extendIf({
              width: self.width,
              height: self.height,
              type: self.type || 'image/jpeg',
              quality: 90,
              crop: false,
              fit: true,
              preserveHeaders: true,
              resample: 'default',
              multipass: true
            }, options);

            try {
              if (!self.size) {
                // only preloaded image objects can be used as source
                throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
              }

              // no way to reliably intercept the crash due to high resolution, so we simply avoid it
              if (self.width > Image.MAX_RESIZE_WIDTH || self.height > Image.MAX_RESIZE_HEIGHT) {
                throw new x.ImageError(x.ImageError.MAX_RESOLUTION_ERR);
              }

              // take into account orientation tag
              orientation = self.meta && self.meta.tiff && self.meta.tiff.Orientation || 1;

              if (Basic.inArray(orientation, [5, 6, 7, 8]) !== -1) {
                // values that require 90 degree rotation
                var tmp = opts.width;
                opts.width = opts.height;
                opts.height = tmp;
              }

              if (opts.crop) {
                scale = Math.max(opts.width / self.width, opts.height / self.height);

                if (options.fit) {
                  // first scale it up or down to fit the original image
                  srcRect.width = Math.min(Math.ceil(opts.width / scale), self.width);
                  srcRect.height = Math.min(Math.ceil(opts.height / scale), self.height);

                  // recalculate the scale for adapted dimensions
                  scale = opts.width / srcRect.width;
                } else {
                  srcRect.width = Math.min(opts.width, self.width);
                  srcRect.height = Math.min(opts.height, self.height);

                  // now we do not need to scale it any further
                  scale = 1;
                }

                if (typeof opts.crop === 'boolean') {
                  opts.crop = 'cc';
                }

                switch (opts.crop.toLowerCase().replace(/_/, '-')) {
                  case 'rb':
                  case 'right-bottom':
                    srcRect.x = self.width - srcRect.width;
                    srcRect.y = self.height - srcRect.height;
                    break;

                  case 'cb':
                  case 'center-bottom':
                    srcRect.x = Math.floor((self.width - srcRect.width) / 2);
                    srcRect.y = self.height - srcRect.height;
                    break;

                  case 'lb':
                  case 'left-bottom':
                    srcRect.x = 0;
                    srcRect.y = self.height - srcRect.height;
                    break;

                  case 'lt':
                  case 'left-top':
                    srcRect.x = 0;
                    srcRect.y = 0;
                    break;

                  case 'ct':
                  case 'center-top':
                    srcRect.x = Math.floor((self.width - srcRect.width) / 2);
                    srcRect.y = 0;
                    break;

                  case 'rt':
                  case 'right-top':
                    srcRect.x = self.width - srcRect.width;
                    srcRect.y = 0;
                    break;

                  case 'rc':
                  case 'right-center':
                  case 'right-middle':
                    srcRect.x = self.width - srcRect.width;
                    srcRect.y = Math.floor((self.height - srcRect.height) / 2);
                    break;

                  case 'lc':
                  case 'left-center':
                  case 'left-middle':
                    srcRect.x = 0;
                    srcRect.y = Math.floor((self.height - srcRect.height) / 2);
                    break;

                  case 'cc':
                  case 'center-center':
                  case 'center-middle':
                  default:
                    srcRect.x = Math.floor((self.width - srcRect.width) / 2);
                    srcRect.y = Math.floor((self.height - srcRect.height) / 2);
                }

                // original image might be smaller than requested crop, so - avoid negative values
                srcRect.x = Math.max(srcRect.x, 0);
                srcRect.y = Math.max(srcRect.y, 0);
              } else {
                scale = Math.min(opts.width / self.width, opts.height / self.height);
              }

              this.exec('Image', 'resize', srcRect, scale, opts);
            } catch (ex) {
              // for now simply trigger error event
              self.trigger('error', ex.code);
            }
          },

          /**
          Downsizes the image to fit the specified width/height. If crop is supplied, image will be cropped to exact dimensions.
            @method downsize
          @deprecated use resize()
          */
          downsize: function (options) {
            var defaults = {
              width: this.width,
              height: this.height,
              type: this.type || 'image/jpeg',
              quality: 90,
              crop: false,
              preserveHeaders: true,
              resample: 'default'
            },
                opts;

            if (typeof options === 'object') {
              opts = Basic.extend(defaults, options);
            } else {
              // for backward compatibility
              opts = Basic.extend(defaults, {
                width: arguments[0],
                height: arguments[1],
                crop: arguments[2],
                preserveHeaders: arguments[3]
              });
            }

            this.resize(opts);
          },

          /**
          Alias for downsize(width, height, true). (see downsize)
            @method crop
          @param {Number} width Resulting width
          @param {Number} [height=width] Resulting height (optional, if not supplied will default to width)
          @param {Boolean} [preserveHeaders=true] Whether to preserve meta headers (on JPEGs after resize)
          */
          crop: function (width, height, preserveHeaders) {
            this.downsize(width, height, true, preserveHeaders);
          },

          getAsCanvas: function () {
            if (!Env.can('create_canvas')) {
              throw new x.RuntimeError(x.RuntimeError.NOT_SUPPORTED_ERR);
            }
            return this.exec('Image', 'getAsCanvas');
          },

          /**
          Retrieves image in it's current state as mOxie.Blob object. Cannot be run on empty or image in progress (throws
          DOMException.INVALID_STATE_ERR).
            @method getAsBlob
          @param {String} [type="image/jpeg"] Mime type of resulting blob. Can either be image/jpeg or image/png
          @param {Number} [quality=90] Applicable only together with mime type image/jpeg
          @return {Blob} Image as Blob
          */
          getAsBlob: function (type, quality) {
            if (!this.size) {
              throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
            }
            return this.exec('Image', 'getAsBlob', type || 'image/jpeg', quality || 90);
          },

          /**
          Retrieves image in it's current state as dataURL string. Cannot be run on empty or image in progress (throws
          DOMException.INVALID_STATE_ERR).
            @method getAsDataURL
          @param {String} [type="image/jpeg"] Mime type of resulting blob. Can either be image/jpeg or image/png
          @param {Number} [quality=90] Applicable only together with mime type image/jpeg
          @return {String} Image as dataURL string
          */
          getAsDataURL: function (type, quality) {
            if (!this.size) {
              throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
            }
            return this.exec('Image', 'getAsDataURL', type || 'image/jpeg', quality || 90);
          },

          /**
          Retrieves image in it's current state as binary string. Cannot be run on empty or image in progress (throws
          DOMException.INVALID_STATE_ERR).
            @method getAsBinaryString
          @param {String} [type="image/jpeg"] Mime type of resulting blob. Can either be image/jpeg or image/png
          @param {Number} [quality=90] Applicable only together with mime type image/jpeg
          @return {String} Image as binary string
          */
          getAsBinaryString: function (type, quality) {
            var dataUrl = this.getAsDataURL(type, quality);
            return Encode.atob(dataUrl.substring(dataUrl.indexOf('base64,') + 7));
          },

          /**
          Embeds a visual representation of the image into the specified node. Depending on the runtime,
          it might be a canvas, an img node or a thrid party shim object (Flash or SilverLight - very rare,
          can be used in legacy browsers that do not have canvas or proper dataURI support).
            @method embed
          @param {DOMElement} el DOM element to insert the image object into
          @param {Object} [options]
            @param {Number} [options.width] The width of an embed (defaults to the image width)
            @param {Number} [options.height] The height of an embed (defaults to the image height)
            @param {String} [options.type="image/jpeg"] Mime type
            @param {Number} [options.quality=90] Quality of an embed, if mime type is image/jpeg
            @param {Boolean} [options.crop=false] Whether to crop an embed to the specified dimensions
          */
          embed: function (el, options) {
            var self = this,
                runtime;

            var opts = Basic.extend({
              width: this.width,
              height: this.height,
              type: this.type || 'image/jpeg',
              quality: 90
            }, options);

            function render(type, quality) {
              var img = this;

              // if possible, embed a canvas element directly
              if (Env.can('create_canvas')) {
                var canvas = img.getAsCanvas();
                if (canvas) {
                  el.appendChild(canvas);
                  canvas = null;
                  img.destroy();
                  self.trigger('embedded');
                  return;
                }
              }

              var dataUrl = img.getAsDataURL(type, quality);
              if (!dataUrl) {
                throw new x.ImageError(x.ImageError.WRONG_FORMAT);
              }

              if (Env.can('use_data_uri_of', dataUrl.length)) {
                el.innerHTML = '<img src="' + dataUrl + '" width="' + img.width + '" height="' + img.height + '" />';
                img.destroy();
                self.trigger('embedded');
              } else {
                var tr = new Transporter();

                tr.bind("TransportingComplete", function () {
                  runtime = self.connectRuntime(this.result.ruid);

                  self.bind("Embedded", function () {
                    // position and size properly
                    Basic.extend(runtime.getShimContainer().style, {
                      //position: 'relative',
                      top: '0px',
                      left: '0px',
                      width: img.width + 'px',
                      height: img.height + 'px'
                    });

                    // some shims (Flash/SilverLight) reinitialize, if parent element is hidden, reordered or it's
                    // position type changes (in Gecko), but since we basically need this only in IEs 6/7 and
                    // sometimes 8 and they do not have this problem, we can comment this for now
                    /*tr.bind("RuntimeInit", function(e, runtime) {
                      tr.destroy();
                      runtime.destroy();
                      onResize.call(self); // re-feed our image data
                    });*/

                    runtime = null; // release
                  }, 999);

                  runtime.exec.call(self, "ImageView", "display", this.result.uid, width, height);
                  img.destroy();
                });

                tr.transport(Encode.atob(dataUrl.substring(dataUrl.indexOf('base64,') + 7)), type, {
                  required_caps: {
                    display_media: true
                  },
                  runtime_order: 'flash,silverlight',
                  container: el
                });
              }
            }

            try {
              if (!(el = Dom.get(el))) {
                throw new x.DOMException(x.DOMException.INVALID_NODE_TYPE_ERR);
              }

              if (!this.size) {
                // only preloaded image objects can be used as source
                throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
              }

              // high-resolution images cannot be consistently handled across the runtimes
              if (this.width > Image.MAX_RESIZE_WIDTH || this.height > Image.MAX_RESIZE_HEIGHT) {
                //throw new x.ImageError(x.ImageError.MAX_RESOLUTION_ERR);
              }

              var imgCopy = new Image();

              imgCopy.bind("Resize", function () {
                render.call(this, opts.type, opts.quality);
              });

              imgCopy.bind("Load", function () {
                this.downsize(opts);
              });

              // if embedded thumb data is available and dimensions are big enough, use it
              if (this.meta.thumb && this.meta.thumb.width >= opts.width && this.meta.thumb.height >= opts.height) {
                imgCopy.load(this.meta.thumb.data);
              } else {
                imgCopy.clone(this, false);
              }

              return imgCopy;
            } catch (ex) {
              // for now simply trigger error event
              this.trigger('error', ex.code);
            }
          },

          /**
          Properly destroys the image and frees resources in use. If any. Recommended way to dispose mOxie.Image object.
            @method destroy
          */
          destroy: function () {
            if (this.ruid) {
              this.getRuntime().exec.call(this, 'Image', 'destroy');
              this.disconnectRuntime();
            }
            if (this.meta && this.meta.thumb) {
              // thumb is blob, make sure we destroy it first
              this.meta.thumb.data.destroy();
            }
            this.unbindAll();
          }
        });

        // this is here, because in order to bind properly, we need uid, which is created above
        this.handleEventProps(dispatches);

        this.bind('Load Resize', function () {
          return _updateInfo.call(this); // if operation fails (e.g. image is neither PNG nor JPEG) cancel all pending events
        }, 999);

        function _updateInfo(info) {
          try {
            if (!info) {
              info = this.exec('Image', 'getInfo');
            }

            this.size = info.size;
            this.width = info.width;
            this.height = info.height;
            this.type = info.type;
            this.meta = info.meta;

            // update file name, only if empty
            if (this.name === '') {
              this.name = info.name;
            }

            return true;
          } catch (ex) {
            this.trigger('error', ex.code);
            return false;
          }
        }

        function _load(src) {
          var srcType = Basic.typeOf(src);

          try {
            // if source is Image
            if (src instanceof Image) {
              if (!src.size) {
                // only preloaded image objects can be used as source
                throw new x.DOMException(x.DOMException.INVALID_STATE_ERR);
              }
              _loadFromImage.apply(this, arguments);
            }
            // if source is o.Blob/o.File
            else if (src instanceof Blob) {
                if (!~Basic.inArray(src.type, ['image/jpeg', 'image/png'])) {
                  throw new x.ImageError(x.ImageError.WRONG_FORMAT);
                }
                _loadFromBlob.apply(this, arguments);
              }
              // if native blob/file
              else if (Basic.inArray(srcType, ['blob', 'file']) !== -1) {
                  _load.call(this, new File(null, src), arguments[1]);
                }
                // if String
                else if (srcType === 'string') {
                    // if dataUrl String
                    if (src.substr(0, 5) === 'data:') {
                      _load.call(this, new Blob(null, { data: src }), arguments[1]);
                    }
                    // else assume Url, either relative or absolute
                    else {
                        _loadFromUrl.apply(this, arguments);
                      }
                  }
                  // if source seems to be an img node
                  else if (srcType === 'node' && src.nodeName.toLowerCase() === 'img') {
                      _load.call(this, src.src, arguments[1]);
                    } else {
                      throw new x.DOMException(x.DOMException.TYPE_MISMATCH_ERR);
                    }
          } catch (ex) {
            // for now simply trigger error event
            this.trigger('error', ex.code);
          }
        }

        function _loadFromImage(img, exact) {
          var runtime = this.connectRuntime(img.ruid);
          this.ruid = runtime.uid;
          runtime.exec.call(this, 'Image', 'loadFromImage', img, Basic.typeOf(exact) === 'undefined' ? true : exact);
        }

        function _loadFromBlob(blob, options) {
          var self = this;

          self.name = blob.name || '';

          function exec(runtime) {
            self.ruid = runtime.uid;
            runtime.exec.call(self, 'Image', 'loadFromBlob', blob);
          }

          if (blob.isDetached()) {
            this.bind('RuntimeInit', function (e, runtime) {
              exec(runtime);
            });

            // convert to object representation
            if (options && typeof options.required_caps === 'string') {
              options.required_caps = Runtime.parseCaps(options.required_caps);
            }

            this.connectRuntime(Basic.extend({
              required_caps: {
                access_image_binary: true,
                resize_image: true
              }
            }, options));
          } else {
            exec(this.connectRuntime(blob.ruid));
          }
        }

        function _loadFromUrl(url, options) {
          var self = this,
              xhr;

          xhr = new XMLHttpRequest();

          xhr.open('get', url);
          xhr.responseType = 'blob';

          xhr.onprogress = function (e) {
            self.trigger(e);
          };

          xhr.onload = function () {
            _loadFromBlob.call(self, xhr.response, true);
          };

          xhr.onerror = function (e) {
            self.trigger(e);
          };

          xhr.onloadend = function () {
            xhr.destroy();
          };

          xhr.bind('RuntimeError', function (e, err) {
            self.trigger('RuntimeError', err);
          });

          xhr.send(null, options);
        }
      }

      // virtual world will crash on you if image has a resolution higher than this:
      Image.MAX_RESIZE_WIDTH = 8192;
      Image.MAX_RESIZE_HEIGHT = 8192;

      Image.prototype = EventTarget.instance;

      return Image;
    });

    // Included from: src/javascript/runtime/html5/Runtime.js

    /**
     * Runtime.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /*global File:true */

    /**
    Defines constructor for HTML5 runtime.
    
    @class moxie/runtime/html5/Runtime
    @private
    */
    define("moxie/runtime/html5/Runtime", ["moxie/core/utils/Basic", "moxie/core/Exceptions", "moxie/runtime/Runtime", "moxie/core/utils/Env"], function (Basic, x, Runtime, Env) {

      var type = "html5",
          extensions = {};

      function Html5Runtime(options) {
        var I = this,
            Test = Runtime.capTest,
            True = Runtime.capTrue;

        var caps = Basic.extend({
          access_binary: Test(window.FileReader || window.File && window.File.getAsDataURL),
          access_image_binary: function () {
            return I.can('access_binary') && !!extensions.Image;
          },
          display_media: Test((Env.can('create_canvas') || Env.can('use_data_uri_over32kb')) && defined('moxie/image/Image')),
          do_cors: Test(window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()),
          drag_and_drop: Test(function () {
            // this comes directly from Modernizr: http://www.modernizr.com/
            var div = document.createElement('div');
            // IE has support for drag and drop since version 5, but doesn't support dropping files from desktop
            return ('draggable' in div || 'ondragstart' in div && 'ondrop' in div) && (Env.browser !== 'IE' || Env.verComp(Env.version, 9, '>'));
          }()),
          filter_by_extension: Test(function () {
            // if you know how to feature-detect this, please suggest
            return !(Env.browser === 'Chrome' && Env.verComp(Env.version, 28, '<') || Env.browser === 'IE' && Env.verComp(Env.version, 10, '<') || Env.browser === 'Safari' && Env.verComp(Env.version, 7, '<') || Env.browser === 'Firefox' && Env.verComp(Env.version, 37, '<'));
          }()),
          return_response_headers: True,
          return_response_type: function (responseType) {
            if (responseType === 'json' && !!window.JSON) {
              // we can fake this one even if it's not supported
              return true;
            }
            return Env.can('return_response_type', responseType);
          },
          return_status_code: True,
          report_upload_progress: Test(window.XMLHttpRequest && new XMLHttpRequest().upload),
          resize_image: function () {
            return I.can('access_binary') && Env.can('create_canvas');
          },
          select_file: function () {
            return Env.can('use_fileinput') && window.File;
          },
          select_folder: function () {
            return I.can('select_file') && (Env.browser === 'Chrome' && Env.verComp(Env.version, 21, '>=') || Env.browser === 'Firefox' && Env.verComp(Env.version, 42, '>=') // https://developer.mozilla.org/en-US/Firefox/Releases/42
            );
          },
          select_multiple: function () {
            // it is buggy on Safari Windows and iOS
            return I.can('select_file') && !(Env.browser === 'Safari' && Env.os === 'Windows') && !(Env.os === 'iOS' && Env.verComp(Env.osVersion, "7.0.0", '>') && Env.verComp(Env.osVersion, "8.0.0", '<'));
          },
          send_binary_string: Test(window.XMLHttpRequest && (new XMLHttpRequest().sendAsBinary || window.Uint8Array && window.ArrayBuffer)),
          send_custom_headers: Test(window.XMLHttpRequest),
          send_multipart: function () {
            return !!(window.XMLHttpRequest && new XMLHttpRequest().upload && window.FormData) || I.can('send_binary_string');
          },
          slice_blob: Test(window.File && (File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice)),
          stream_upload: function () {
            return I.can('slice_blob') && I.can('send_multipart');
          },
          summon_file_dialog: function () {
            // yeah... some dirty sniffing here...
            return I.can('select_file') && (Env.browser === 'Firefox' && Env.verComp(Env.version, 4, '>=') || Env.browser === 'Opera' && Env.verComp(Env.version, 12, '>=') || Env.browser === 'IE' && Env.verComp(Env.version, 10, '>=') || !!~Basic.inArray(Env.browser, ['Chrome', 'Safari', 'Edge']));
          },
          upload_filesize: True,
          use_http_method: True
        }, arguments[2]);

        Runtime.call(this, options, arguments[1] || type, caps);

        Basic.extend(this, {

          init: function () {
            this.trigger("Init");
          },

          destroy: function (destroy) {
            // extend default destroy method
            return function () {
              destroy.call(I);
              destroy = I = null;
            };
          }(this.destroy)
        });

        Basic.extend(this.getShim(), extensions);
      }

      Runtime.addConstructor(type, Html5Runtime);

      return extensions;
    });

    // Included from: src/javascript/runtime/html5/file/Blob.js

    /**
     * Blob.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/html5/file/Blob
    @private
    */
    define("moxie/runtime/html5/file/Blob", ["moxie/runtime/html5/Runtime", "moxie/file/Blob"], function (extensions, Blob) {

      function HTML5Blob() {
        function w3cBlobSlice(blob, start, end) {
          var blobSlice;

          if (window.File.prototype.slice) {
            try {
              blob.slice(); // depricated version will throw WRONG_ARGUMENTS_ERR exception
              return blob.slice(start, end);
            } catch (e) {
              // depricated slice method
              return blob.slice(start, end - start);
            }
            // slice method got prefixed: https://bugzilla.mozilla.org/show_bug.cgi?id=649672
          } else if (blobSlice = window.File.prototype.webkitSlice || window.File.prototype.mozSlice) {
            return blobSlice.call(blob, start, end);
          } else {
            return null; // or throw some exception
          }
        }

        this.slice = function () {
          return new Blob(this.getRuntime().uid, w3cBlobSlice.apply(this, arguments));
        };
      }

      return extensions.Blob = HTML5Blob;
    });

    // Included from: src/javascript/core/utils/Events.js

    /**
     * Events.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    define('moxie/core/utils/Events', ['moxie/core/utils/Basic'], function (Basic) {
      var eventhash = {},
          uid = 'moxie_' + Basic.guid();

      // IE W3C like event funcs
      function preventDefault() {
        this.returnValue = false;
      }

      function stopPropagation() {
        this.cancelBubble = true;
      }

      /**
      Adds an event handler to the specified object and store reference to the handler
      in objects internal Plupload registry (@see removeEvent).
        @method addEvent
      @for Utils
      @static
      @param {Object} obj DOM element like object to add handler to.
      @param {String} name Name to add event listener to.
      @param {Function} callback Function to call when event occurs.
      @param {String} [key] that might be used to add specifity to the event record.
      */
      var addEvent = function (obj, name, callback, key) {
        var func, events;

        name = name.toLowerCase();

        // Add event listener
        if (obj.addEventListener) {
          func = callback;

          obj.addEventListener(name, func, false);
        } else if (obj.attachEvent) {
          func = function () {
            var evt = window.event;

            if (!evt.target) {
              evt.target = evt.srcElement;
            }

            evt.preventDefault = preventDefault;
            evt.stopPropagation = stopPropagation;

            callback(evt);
          };

          obj.attachEvent('on' + name, func);
        }

        // Log event handler to objects internal mOxie registry
        if (!obj[uid]) {
          obj[uid] = Basic.guid();
        }

        if (!eventhash.hasOwnProperty(obj[uid])) {
          eventhash[obj[uid]] = {};
        }

        events = eventhash[obj[uid]];

        if (!events.hasOwnProperty(name)) {
          events[name] = [];
        }

        events[name].push({
          func: func,
          orig: callback, // store original callback for IE
          key: key
        });
      };

      /**
      Remove event handler from the specified object. If third argument (callback)
      is not specified remove all events with the specified name.
        @method removeEvent
      @static
      @param {Object} obj DOM element to remove event listener(s) from.
      @param {String} name Name of event listener to remove.
      @param {Function|String} [callback] might be a callback or unique key to match.
      */
      var removeEvent = function (obj, name, callback) {
        var type, undef;

        name = name.toLowerCase();

        if (obj[uid] && eventhash[obj[uid]] && eventhash[obj[uid]][name]) {
          type = eventhash[obj[uid]][name];
        } else {
          return;
        }

        for (var i = type.length - 1; i >= 0; i--) {
          // undefined or not, key should match
          if (type[i].orig === callback || type[i].key === callback) {
            if (obj.removeEventListener) {
              obj.removeEventListener(name, type[i].func, false);
            } else if (obj.detachEvent) {
              obj.detachEvent('on' + name, type[i].func);
            }

            type[i].orig = null;
            type[i].func = null;
            type.splice(i, 1);

            // If callback was passed we are done here, otherwise proceed
            if (callback !== undef) {
              break;
            }
          }
        }

        // If event array got empty, remove it
        if (!type.length) {
          delete eventhash[obj[uid]][name];
        }

        // If mOxie registry has become empty, remove it
        if (Basic.isEmptyObj(eventhash[obj[uid]])) {
          delete eventhash[obj[uid]];

          // IE doesn't let you remove DOM object property with - delete
          try {
            delete obj[uid];
          } catch (e) {
            obj[uid] = undef;
          }
        }
      };

      /**
      Remove all kind of events from the specified object
        @method removeAllEvents
      @static
      @param {Object} obj DOM element to remove event listeners from.
      @param {String} [key] unique key to match, when removing events.
      */
      var removeAllEvents = function (obj, key) {
        if (!obj || !obj[uid]) {
          return;
        }

        Basic.each(eventhash[obj[uid]], function (events, name) {
          removeEvent(obj, name, key);
        });
      };

      return {
        addEvent: addEvent,
        removeEvent: removeEvent,
        removeAllEvents: removeAllEvents
      };
    });

    // Included from: src/javascript/runtime/html5/file/FileInput.js

    /**
     * FileInput.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/html5/file/FileInput
    @private
    */
    define("moxie/runtime/html5/file/FileInput", ["moxie/runtime/html5/Runtime", "moxie/file/File", "moxie/core/utils/Basic", "moxie/core/utils/Dom", "moxie/core/utils/Events", "moxie/core/utils/Mime", "moxie/core/utils/Env"], function (extensions, File, Basic, Dom, Events, Mime, Env) {

      function FileInput() {
        var _options, _browseBtnZIndex; // save original z-index

        Basic.extend(this, {
          init: function (options) {
            var comp = this,
                I = comp.getRuntime(),
                input,
                shimContainer,
                mimes,
                browseButton,
                zIndex,
                top;

            _options = options;

            // figure out accept string
            mimes = _options.accept.mimes || Mime.extList2mimes(_options.accept, I.can('filter_by_extension'));

            shimContainer = I.getShimContainer();

            shimContainer.innerHTML = '<input id="' + I.uid + '" type="file" style="font-size:999px;opacity:0;"' + (_options.multiple && I.can('select_multiple') ? 'multiple' : '') + (_options.directory && I.can('select_folder') ? 'webkitdirectory directory' : '') + ( // Chrome 11+
            mimes ? ' accept="' + mimes.join(',') + '"' : '') + ' />';

            input = Dom.get(I.uid);

            // prepare file input to be placed underneath the browse_button element
            Basic.extend(input.style, {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            });

            browseButton = Dom.get(_options.browse_button);
            _browseBtnZIndex = Dom.getStyle(browseButton, 'z-index') || 'auto';

            // Route click event to the input[type=file] element for browsers that support such behavior
            if (I.can('summon_file_dialog')) {
              if (Dom.getStyle(browseButton, 'position') === 'static') {
                browseButton.style.position = 'relative';
              }

              Events.addEvent(browseButton, 'click', function (e) {
                var input = Dom.get(I.uid);
                if (input && !input.disabled) {
                  // for some reason FF (up to 8.0.1 so far) lets to click disabled input[type=file]
                  input.click();
                }
                e.preventDefault();
              }, comp.uid);

              comp.bind('Refresh', function () {
                zIndex = parseInt(_browseBtnZIndex, 10) || 1;

                Dom.get(_options.browse_button).style.zIndex = zIndex;
                this.getRuntime().getShimContainer().style.zIndex = zIndex - 1;
              });
            }

            /* Since we have to place input[type=file] on top of the browse_button for some browsers,
            browse_button loses interactivity, so we restore it here */
            top = I.can('summon_file_dialog') ? browseButton : shimContainer;

            Events.addEvent(top, 'mouseover', function () {
              comp.trigger('mouseenter');
            }, comp.uid);

            Events.addEvent(top, 'mouseout', function () {
              comp.trigger('mouseleave');
            }, comp.uid);

            Events.addEvent(top, 'mousedown', function () {
              comp.trigger('mousedown');
            }, comp.uid);

            Events.addEvent(Dom.get(_options.container), 'mouseup', function () {
              comp.trigger('mouseup');
            }, comp.uid);

            input.onchange = function onChange(e) {
              // there should be only one handler for this
              comp.files = [];

              Basic.each(this.files, function (file) {
                var relativePath = '';

                if (_options.directory) {
                  // folders are represented by dots, filter them out (Chrome 11+)
                  if (file.name == ".") {
                    // if it looks like a folder...
                    return true;
                  }
                }

                if (file.webkitRelativePath) {
                  relativePath = '/' + file.webkitRelativePath.replace(/^\//, '');
                }

                file = new File(I.uid, file);
                file.relativePath = relativePath;

                comp.files.push(file);
              });

              // clearing the value enables the user to select the same file again if they want to
              if (Env.browser !== 'IE' && Env.browser !== 'IEMobile') {
                this.value = '';
              } else {
                // in IE input[type="file"] is read-only so the only way to reset it is to re-insert it
                var clone = this.cloneNode(true);
                this.parentNode.replaceChild(clone, this);
                clone.onchange = onChange;
              }

              if (comp.files.length) {
                comp.trigger('change');
              }
            };

            // ready event is perfectly asynchronous
            comp.trigger({
              type: 'ready',
              async: true
            });

            shimContainer = null;
          },

          setOption: function (name, value) {
            var I = this.getRuntime();
            var input = Dom.get(I.uid);

            switch (name) {
              case 'accept':
                if (value) {
                  var mimes = value.mimes || Mime.extList2mimes(value, I.can('filter_by_extension'));
                  input.setAttribute('accept', mimes.join(','));
                } else {
                  input.removeAttribute('accept');
                }
                break;

              case 'directory':
                if (value && I.can('select_folder')) {
                  input.setAttribute('directory', '');
                  input.setAttribute('webkitdirectory', '');
                } else {
                  input.removeAttribute('directory');
                  input.removeAttribute('webkitdirectory');
                }
                break;

              case 'multiple':
                if (value && I.can('select_multiple')) {
                  input.setAttribute('multiple', '');
                } else {
                  input.removeAttribute('multiple');
                }

            }
          },

          disable: function (state) {
            var I = this.getRuntime(),
                input;

            if (input = Dom.get(I.uid)) {
              input.disabled = !!state;
            }
          },

          destroy: function () {
            var I = this.getRuntime(),
                shim = I.getShim(),
                shimContainer = I.getShimContainer(),
                container = _options && Dom.get(_options.container),
                browseButton = _options && Dom.get(_options.browse_button);

            if (container) {
              Events.removeAllEvents(container, this.uid);
            }

            if (browseButton) {
              Events.removeAllEvents(browseButton, this.uid);
              browseButton.style.zIndex = _browseBtnZIndex; // reset to original value
            }

            if (shimContainer) {
              Events.removeAllEvents(shimContainer, this.uid);
              shimContainer.innerHTML = '';
            }

            shim.removeInstance(this.uid);

            _options = shimContainer = container = browseButton = shim = null;
          }
        });
      }

      return extensions.FileInput = FileInput;
    });

    // Included from: src/javascript/runtime/html5/file/FileDrop.js

    /**
     * FileDrop.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/html5/file/FileDrop
    @private
    */
    define("moxie/runtime/html5/file/FileDrop", ["moxie/runtime/html5/Runtime", 'moxie/file/File', "moxie/core/utils/Basic", "moxie/core/utils/Dom", "moxie/core/utils/Events", "moxie/core/utils/Mime"], function (extensions, File, Basic, Dom, Events, Mime) {

      function FileDrop() {
        var _files = [],
            _allowedExts = [],
            _options,
            _ruid;

        Basic.extend(this, {
          init: function (options) {
            var comp = this,
                dropZone;

            _options = options;
            _ruid = comp.ruid; // every dropped-in file should have a reference to the runtime
            _allowedExts = _extractExts(_options.accept);
            dropZone = _options.container;

            Events.addEvent(dropZone, 'dragover', function (e) {
              if (!_hasFiles(e)) {
                return;
              }
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
            }, comp.uid);

            Events.addEvent(dropZone, 'drop', function (e) {
              if (!_hasFiles(e)) {
                return;
              }
              e.preventDefault();

              _files = [];

              // Chrome 21+ accepts folders via Drag'n'Drop
              if (e.dataTransfer.items && e.dataTransfer.items[0].webkitGetAsEntry) {
                _readItems(e.dataTransfer.items, function () {
                  comp.files = _files;
                  comp.trigger("drop");
                });
              } else {
                Basic.each(e.dataTransfer.files, function (file) {
                  _addFile(file);
                });
                comp.files = _files;
                comp.trigger("drop");
              }
            }, comp.uid);

            Events.addEvent(dropZone, 'dragenter', function (e) {
              comp.trigger("dragenter");
            }, comp.uid);

            Events.addEvent(dropZone, 'dragleave', function (e) {
              comp.trigger("dragleave");
            }, comp.uid);
          },

          destroy: function () {
            Events.removeAllEvents(_options && Dom.get(_options.container), this.uid);
            _ruid = _files = _allowedExts = _options = null;
          }
        });

        function _hasFiles(e) {
          if (!e.dataTransfer || !e.dataTransfer.types) {
            // e.dataTransfer.files is not available in Gecko during dragover
            return false;
          }

          var types = Basic.toArray(e.dataTransfer.types || []);

          return Basic.inArray("Files", types) !== -1 || Basic.inArray("public.file-url", types) !== -1 || // Safari < 5
          Basic.inArray("application/x-moz-file", types) !== -1 // Gecko < 1.9.2 (< Firefox 3.6)
          ;
        }

        function _addFile(file, relativePath) {
          if (_isAcceptable(file)) {
            var fileObj = new File(_ruid, file);
            fileObj.relativePath = relativePath || '';
            _files.push(fileObj);
          }
        }

        function _extractExts(accept) {
          var exts = [];
          for (var i = 0; i < accept.length; i++) {
            [].push.apply(exts, accept[i].extensions.split(/\s*,\s*/));
          }
          return Basic.inArray('*', exts) === -1 ? exts : [];
        }

        function _isAcceptable(file) {
          if (!_allowedExts.length) {
            return true;
          }
          var ext = Mime.getFileExtension(file.name);
          return !ext || Basic.inArray(ext, _allowedExts) !== -1;
        }

        function _readItems(items, cb) {
          var entries = [];
          Basic.each(items, function (item) {
            var entry = item.webkitGetAsEntry();
            // Address #998 (https://code.google.com/p/chromium/issues/detail?id=332579)
            if (entry) {
              // file() fails on OSX when the filename contains a special character (e.g. umlaut): see #61
              if (entry.isFile) {
                _addFile(item.getAsFile(), entry.fullPath);
              } else {
                entries.push(entry);
              }
            }
          });

          if (entries.length) {
            _readEntries(entries, cb);
          } else {
            cb();
          }
        }

        function _readEntries(entries, cb) {
          var queue = [];
          Basic.each(entries, function (entry) {
            queue.push(function (cbcb) {
              _readEntry(entry, cbcb);
            });
          });
          Basic.inSeries(queue, function () {
            cb();
          });
        }

        function _readEntry(entry, cb) {
          if (entry.isFile) {
            entry.file(function (file) {
              _addFile(file, entry.fullPath);
              cb();
            }, function () {
              // fire an error event maybe
              cb();
            });
          } else if (entry.isDirectory) {
            _readDirEntry(entry, cb);
          } else {
            cb(); // not file, not directory? what then?..
          }
        }

        function _readDirEntry(dirEntry, cb) {
          var entries = [],
              dirReader = dirEntry.createReader();

          // keep quering recursively till no more entries
          function getEntries(cbcb) {
            dirReader.readEntries(function (moreEntries) {
              if (moreEntries.length) {
                [].push.apply(entries, moreEntries);
                getEntries(cbcb);
              } else {
                cbcb();
              }
            }, cbcb);
          }

          // ...and you thought FileReader was crazy...
          getEntries(function () {
            _readEntries(entries, cb);
          });
        }
      }

      return extensions.FileDrop = FileDrop;
    });

    // Included from: src/javascript/runtime/html5/file/FileReader.js

    /**
     * FileReader.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/html5/file/FileReader
    @private
    */
    define("moxie/runtime/html5/file/FileReader", ["moxie/runtime/html5/Runtime", "moxie/core/utils/Encode", "moxie/core/utils/Basic"], function (extensions, Encode, Basic) {

      function FileReader() {
        var _fr,
            _convertToBinary = false;

        Basic.extend(this, {

          read: function (op, blob) {
            var comp = this;

            comp.result = '';

            _fr = new window.FileReader();

            _fr.addEventListener('progress', function (e) {
              comp.trigger(e);
            });

            _fr.addEventListener('load', function (e) {
              comp.result = _convertToBinary ? _toBinary(_fr.result) : _fr.result;
              comp.trigger(e);
            });

            _fr.addEventListener('error', function (e) {
              comp.trigger(e, _fr.error);
            });

            _fr.addEventListener('loadend', function (e) {
              _fr = null;
              comp.trigger(e);
            });

            if (Basic.typeOf(_fr[op]) === 'function') {
              _convertToBinary = false;
              _fr[op](blob.getSource());
            } else if (op === 'readAsBinaryString') {
              // readAsBinaryString is depricated in general and never existed in IE10+
              _convertToBinary = true;
              _fr.readAsDataURL(blob.getSource());
            }
          },

          abort: function () {
            if (_fr) {
              _fr.abort();
            }
          },

          destroy: function () {
            _fr = null;
          }
        });

        function _toBinary(str) {
          return Encode.atob(str.substring(str.indexOf('base64,') + 7));
        }
      }

      return extensions.FileReader = FileReader;
    });

    // Included from: src/javascript/runtime/html5/xhr/XMLHttpRequest.js

    /**
     * XMLHttpRequest.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /*global ActiveXObject:true */

    /**
    @class moxie/runtime/html5/xhr/XMLHttpRequest
    @private
    */
    define("moxie/runtime/html5/xhr/XMLHttpRequest", ["moxie/runtime/html5/Runtime", "moxie/core/utils/Basic", "moxie/core/utils/Mime", "moxie/core/utils/Url", "moxie/file/File", "moxie/file/Blob", "moxie/xhr/FormData", "moxie/core/Exceptions", "moxie/core/utils/Env"], function (extensions, Basic, Mime, Url, File, Blob, FormData, x, Env) {

      function XMLHttpRequest() {
        var self = this,
            _xhr,
            _filename;

        Basic.extend(this, {
          send: function (meta, data) {
            var target = this,
                isGecko2_5_6 = Env.browser === 'Mozilla' && Env.verComp(Env.version, 4, '>=') && Env.verComp(Env.version, 7, '<'),
                isAndroidBrowser = Env.browser === 'Android Browser',
                mustSendAsBinary = false;

            // extract file name
            _filename = meta.url.replace(/^.+?\/([\w\-\.]+)$/, '$1').toLowerCase();

            _xhr = _getNativeXHR();
            _xhr.open(meta.method, meta.url, meta.async, meta.user, meta.password);

            // prepare data to be sent
            if (data instanceof Blob) {
              if (data.isDetached()) {
                mustSendAsBinary = true;
              }
              data = data.getSource();
            } else if (data instanceof FormData) {

              if (data.hasBlob()) {
                if (data.getBlob().isDetached()) {
                  data = _prepareMultipart.call(target, data); // _xhr must be instantiated and be in OPENED state
                  mustSendAsBinary = true;
                } else if ((isGecko2_5_6 || isAndroidBrowser) && Basic.typeOf(data.getBlob().getSource()) === 'blob' && window.FileReader) {
                  // Gecko 2/5/6 can't send blob in FormData: https://bugzilla.mozilla.org/show_bug.cgi?id=649150
                  // Android browsers (default one and Dolphin) seem to have the same issue, see: #613
                  _preloadAndSend.call(target, meta, data);
                  return; // _preloadAndSend will reinvoke send() with transmutated FormData =%D
                }
              }

              // transfer fields to real FormData
              if (data instanceof FormData) {
                // if still a FormData, e.g. not mangled by _prepareMultipart()
                var fd = new window.FormData();
                data.each(function (value, name) {
                  if (value instanceof Blob) {
                    fd.append(name, value.getSource());
                  } else {
                    fd.append(name, value);
                  }
                });
                data = fd;
              }
            }

            // if XHR L2
            if (_xhr.upload) {
              if (meta.withCredentials) {
                _xhr.withCredentials = true;
              }

              _xhr.addEventListener('load', function (e) {
                target.trigger(e);
              });

              _xhr.addEventListener('error', function (e) {
                target.trigger(e);
              });

              // additionally listen to progress events
              _xhr.addEventListener('progress', function (e) {
                target.trigger(e);
              });

              _xhr.upload.addEventListener('progress', function (e) {
                target.trigger({
                  type: 'UploadProgress',
                  loaded: e.loaded,
                  total: e.total
                });
              });
              // ... otherwise simulate XHR L2
            } else {
              _xhr.onreadystatechange = function onReadyStateChange() {

                // fake Level 2 events
                switch (_xhr.readyState) {

                  case 1:
                    // XMLHttpRequest.OPENED
                    // readystatechanged is fired twice for OPENED state (in IE and Mozilla) - neu
                    break;

                  // looks like HEADERS_RECEIVED (state 2) is not reported in Opera (or it's old versions) - neu
                  case 2:
                    // XMLHttpRequest.HEADERS_RECEIVED
                    break;

                  case 3:
                    // XMLHttpRequest.LOADING
                    // try to fire progress event for not XHR L2
                    var total, loaded;

                    try {
                      if (Url.hasSameOrigin(meta.url)) {
                        // Content-Length not accessible for cross-domain on some browsers
                        total = _xhr.getResponseHeader('Content-Length') || 0; // old Safari throws an exception here
                      }

                      if (_xhr.responseText) {
                        // responseText was introduced in IE7
                        loaded = _xhr.responseText.length;
                      }
                    } catch (ex) {
                      total = loaded = 0;
                    }

                    target.trigger({
                      type: 'progress',
                      lengthComputable: !!total,
                      total: parseInt(total, 10),
                      loaded: loaded
                    });
                    break;

                  case 4:
                    // XMLHttpRequest.DONE
                    // release readystatechange handler (mostly for IE)
                    _xhr.onreadystatechange = function () {};

                    // usually status 0 is returned when server is unreachable, but FF also fails to status 0 for 408 timeout
                    if (_xhr.status === 0) {
                      target.trigger('error');
                    } else {
                      target.trigger('load');
                    }
                    break;
                }
              };
            }

            // set request headers
            if (!Basic.isEmptyObj(meta.headers)) {
              Basic.each(meta.headers, function (value, header) {
                _xhr.setRequestHeader(header, value);
              });
            }

            // request response type
            if ("" !== meta.responseType && 'responseType' in _xhr) {
              if ('json' === meta.responseType && !Env.can('return_response_type', 'json')) {
                // we can fake this one
                _xhr.responseType = 'text';
              } else {
                _xhr.responseType = meta.responseType;
              }
            }

            // send ...
            if (!mustSendAsBinary) {
              _xhr.send(data);
            } else {
              if (_xhr.sendAsBinary) {
                // Gecko
                _xhr.sendAsBinary(data);
              } else {
                // other browsers having support for typed arrays
                (function () {
                  // mimic Gecko's sendAsBinary
                  var ui8a = new Uint8Array(data.length);
                  for (var i = 0; i < data.length; i++) {
                    ui8a[i] = data.charCodeAt(i) & 0xff;
                  }
                  _xhr.send(ui8a.buffer);
                })();
              }
            }

            target.trigger('loadstart');
          },

          getStatus: function () {
            // according to W3C spec it should return 0 for readyState < 3, but instead it throws an exception
            try {
              if (_xhr) {
                return _xhr.status;
              }
            } catch (ex) {}
            return 0;
          },

          getResponse: function (responseType) {
            var I = this.getRuntime();

            try {
              switch (responseType) {
                case 'blob':
                  var file = new File(I.uid, _xhr.response);

                  // try to extract file name from content-disposition if possible (might be - not, if CORS for example)
                  var disposition = _xhr.getResponseHeader('Content-Disposition');
                  if (disposition) {
                    // extract filename from response header if available
                    var match = disposition.match(/filename=([\'\"'])([^\1]+)\1/);
                    if (match) {
                      _filename = match[2];
                    }
                  }
                  file.name = _filename;

                  // pre-webkit Opera doesn't set type property on the blob response
                  if (!file.type) {
                    file.type = Mime.getFileMime(_filename);
                  }
                  return file;

                case 'json':
                  if (!Env.can('return_response_type', 'json')) {
                    return _xhr.status === 200 && !!window.JSON ? JSON.parse(_xhr.responseText) : null;
                  }
                  return _xhr.response;

                case 'document':
                  return _getDocument(_xhr);

                default:
                  return _xhr.responseText !== '' ? _xhr.responseText : null; // against the specs, but for consistency across the runtimes
              }
            } catch (ex) {
              return null;
            }
          },

          getAllResponseHeaders: function () {
            try {
              return _xhr.getAllResponseHeaders();
            } catch (ex) {}
            return '';
          },

          abort: function () {
            if (_xhr) {
              _xhr.abort();
            }
          },

          destroy: function () {
            self = _filename = null;
          }
        });

        // here we go... ugly fix for ugly bug
        function _preloadAndSend(meta, data) {
          var target = this,
              blob,
              fr;

          // get original blob
          blob = data.getBlob().getSource();

          // preload blob in memory to be sent as binary string
          fr = new window.FileReader();
          fr.onload = function () {
            // overwrite original blob
            data.append(data.getBlobName(), new Blob(null, {
              type: blob.type,
              data: fr.result
            }));
            // invoke send operation again
            self.send.call(target, meta, data);
          };
          fr.readAsBinaryString(blob);
        }

        function _getNativeXHR() {
          if (window.XMLHttpRequest && !(Env.browser === 'IE' && Env.verComp(Env.version, 8, '<'))) {
            // IE7 has native XHR but it's buggy
            return new window.XMLHttpRequest();
          } else {
            return function () {
              var progIDs = ['Msxml2.XMLHTTP.6.0', 'Microsoft.XMLHTTP']; // if 6.0 available, use it, otherwise failback to default 3.0
              for (var i = 0; i < progIDs.length; i++) {
                try {
                  return new ActiveXObject(progIDs[i]);
                } catch (ex) {}
              }
            }();
          }
        }

        // @credits Sergey Ilinsky  (http://www.ilinsky.com/)
        function _getDocument(xhr) {
          var rXML = xhr.responseXML;
          var rText = xhr.responseText;

          // Try parsing responseText (@see: http://www.ilinsky.com/articles/XMLHttpRequest/#bugs-ie-responseXML-content-type)
          if (Env.browser === 'IE' && rText && rXML && !rXML.documentElement && /[^\/]+\/[^\+]+\+xml/.test(xhr.getResponseHeader("Content-Type"))) {
            rXML = new window.ActiveXObject("Microsoft.XMLDOM");
            rXML.async = false;
            rXML.validateOnParse = false;
            rXML.loadXML(rText);
          }

          // Check if there is no error in document
          if (rXML) {
            if (Env.browser === 'IE' && rXML.parseError !== 0 || !rXML.documentElement || rXML.documentElement.tagName === "parsererror") {
              return null;
            }
          }
          return rXML;
        }

        function _prepareMultipart(fd) {
          var boundary = '----moxieboundary' + new Date().getTime(),
              dashdash = '--',
              crlf = '\r\n',
              multipart = '',
              I = this.getRuntime();

          if (!I.can('send_binary_string')) {
            throw new x.RuntimeError(x.RuntimeError.NOT_SUPPORTED_ERR);
          }

          _xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);

          // append multipart parameters
          fd.each(function (value, name) {
            // Firefox 3.6 failed to convert multibyte characters to UTF-8 in sendAsBinary(),
            // so we try it here ourselves with: unescape(encodeURIComponent(value))
            if (value instanceof Blob) {
              // Build RFC2388 blob
              multipart += dashdash + boundary + crlf + 'Content-Disposition: form-data; name="' + name + '"; filename="' + unescape(encodeURIComponent(value.name || 'blob')) + '"' + crlf + 'Content-Type: ' + (value.type || 'application/octet-stream') + crlf + crlf + value.getSource() + crlf;
            } else {
              multipart += dashdash + boundary + crlf + 'Content-Disposition: form-data; name="' + name + '"' + crlf + crlf + unescape(encodeURIComponent(value)) + crlf;
            }
          });

          multipart += dashdash + boundary + dashdash + crlf;

          return multipart;
        }
      }

      return extensions.XMLHttpRequest = XMLHttpRequest;
    });

    // Included from: src/javascript/runtime/html5/utils/BinaryReader.js

    /**
     * BinaryReader.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/html5/utils/BinaryReader
    @private
    */
    define("moxie/runtime/html5/utils/BinaryReader", ["moxie/core/utils/Basic"], function (Basic) {

      function BinaryReader(data) {
        if (data instanceof ArrayBuffer) {
          ArrayBufferReader.apply(this, arguments);
        } else {
          UTF16StringReader.apply(this, arguments);
        }
      }

      Basic.extend(BinaryReader.prototype, {

        littleEndian: false,

        read: function (idx, size) {
          var sum, mv, i;

          if (idx + size > this.length()) {
            throw new Error("You are trying to read outside the source boundaries.");
          }

          mv = this.littleEndian ? 0 : -8 * (size - 1);

          for (i = 0, sum = 0; i < size; i++) {
            sum |= this.readByteAt(idx + i) << Math.abs(mv + i * 8);
          }
          return sum;
        },

        write: function (idx, num, size) {
          var mv,
              i,
              str = '';

          if (idx > this.length()) {
            throw new Error("You are trying to write outside the source boundaries.");
          }

          mv = this.littleEndian ? 0 : -8 * (size - 1);

          for (i = 0; i < size; i++) {
            this.writeByteAt(idx + i, num >> Math.abs(mv + i * 8) & 255);
          }
        },

        BYTE: function (idx) {
          return this.read(idx, 1);
        },

        SHORT: function (idx) {
          return this.read(idx, 2);
        },

        LONG: function (idx) {
          return this.read(idx, 4);
        },

        SLONG: function (idx) {
          // 2's complement notation
          var num = this.read(idx, 4);
          return num > 2147483647 ? num - 4294967296 : num;
        },

        CHAR: function (idx) {
          return String.fromCharCode(this.read(idx, 1));
        },

        STRING: function (idx, count) {
          return this.asArray('CHAR', idx, count).join('');
        },

        asArray: function (type, idx, count) {
          var values = [];

          for (var i = 0; i < count; i++) {
            values[i] = this[type](idx + i);
          }
          return values;
        }
      });

      function ArrayBufferReader(data) {
        var _dv = new DataView(data);

        Basic.extend(this, {

          readByteAt: function (idx) {
            return _dv.getUint8(idx);
          },

          writeByteAt: function (idx, value) {
            _dv.setUint8(idx, value);
          },

          SEGMENT: function (idx, size, value) {
            switch (arguments.length) {
              case 2:
                return data.slice(idx, idx + size);

              case 1:
                return data.slice(idx);

              case 3:
                if (value === null) {
                  value = new ArrayBuffer();
                }

                if (value instanceof ArrayBuffer) {
                  var arr = new Uint8Array(this.length() - size + value.byteLength);
                  if (idx > 0) {
                    arr.set(new Uint8Array(data.slice(0, idx)), 0);
                  }
                  arr.set(new Uint8Array(value), idx);
                  arr.set(new Uint8Array(data.slice(idx + size)), idx + value.byteLength);

                  this.clear();
                  data = arr.buffer;
                  _dv = new DataView(data);
                  break;
                }

              default:
                return data;
            }
          },

          length: function () {
            return data ? data.byteLength : 0;
          },

          clear: function () {
            _dv = data = null;
          }
        });
      }

      function UTF16StringReader(data) {
        Basic.extend(this, {

          readByteAt: function (idx) {
            return data.charCodeAt(idx);
          },

          writeByteAt: function (idx, value) {
            putstr(String.fromCharCode(value), idx, 1);
          },

          SEGMENT: function (idx, length, segment) {
            switch (arguments.length) {
              case 1:
                return data.substr(idx);
              case 2:
                return data.substr(idx, length);
              case 3:
                putstr(segment !== null ? segment : '', idx, length);
                break;
              default:
                return data;
            }
          },

          length: function () {
            return data ? data.length : 0;
          },

          clear: function () {
            data = null;
          }
        });

        function putstr(segment, idx, length) {
          length = arguments.length === 3 ? length : data.length - idx - 1;
          data = data.substr(0, idx) + segment + data.substr(length + idx);
        }
      }

      return BinaryReader;
    });

    // Included from: src/javascript/runtime/html5/image/JPEGHeaders.js

    /**
     * JPEGHeaders.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/html5/image/JPEGHeaders
    @private
    */
    define("moxie/runtime/html5/image/JPEGHeaders", ["moxie/runtime/html5/utils/BinaryReader", "moxie/core/Exceptions"], function (BinaryReader, x) {

      return function JPEGHeaders(data) {
        var headers = [],
            _br,
            idx,
            marker,
            length = 0;

        _br = new BinaryReader(data);

        // Check if data is jpeg
        if (_br.SHORT(0) !== 0xFFD8) {
          _br.clear();
          throw new x.ImageError(x.ImageError.WRONG_FORMAT);
        }

        idx = 2;

        while (idx <= _br.length()) {
          marker = _br.SHORT(idx);

          // omit RST (restart) markers
          if (marker >= 0xFFD0 && marker <= 0xFFD7) {
            idx += 2;
            continue;
          }

          // no headers allowed after SOS marker
          if (marker === 0xFFDA || marker === 0xFFD9) {
            break;
          }

          length = _br.SHORT(idx + 2) + 2;

          // APPn marker detected
          if (marker >= 0xFFE1 && marker <= 0xFFEF) {
            headers.push({
              hex: marker,
              name: 'APP' + (marker & 0x000F),
              start: idx,
              length: length,
              segment: _br.SEGMENT(idx, length)
            });
          }

          idx += length;
        }

        _br.clear();

        return {
          headers: headers,

          restore: function (data) {
            var max, i, br;

            br = new BinaryReader(data);

            idx = br.SHORT(2) == 0xFFE0 ? 4 + br.SHORT(4) : 2;

            for (i = 0, max = headers.length; i < max; i++) {
              br.SEGMENT(idx, 0, headers[i].segment);
              idx += headers[i].length;
            }

            data = br.SEGMENT();
            br.clear();
            return data;
          },

          strip: function (data) {
            var br, headers, jpegHeaders, i;

            jpegHeaders = new JPEGHeaders(data);
            headers = jpegHeaders.headers;
            jpegHeaders.purge();

            br = new BinaryReader(data);

            i = headers.length;
            while (i--) {
              br.SEGMENT(headers[i].start, headers[i].length, '');
            }

            data = br.SEGMENT();
            br.clear();
            return data;
          },

          get: function (name) {
            var array = [];

            for (var i = 0, max = headers.length; i < max; i++) {
              if (headers[i].name === name.toUpperCase()) {
                array.push(headers[i].segment);
              }
            }
            return array;
          },

          set: function (name, segment) {
            var array = [],
                i,
                ii,
                max;

            if (typeof segment === 'string') {
              array.push(segment);
            } else {
              array = segment;
            }

            for (i = ii = 0, max = headers.length; i < max; i++) {
              if (headers[i].name === name.toUpperCase()) {
                headers[i].segment = array[ii];
                headers[i].length = array[ii].length;
                ii++;
              }
              if (ii >= array.length) {
                break;
              }
            }
          },

          purge: function () {
            this.headers = headers = [];
          }
        };
      };
    });

    // Included from: src/javascript/runtime/html5/image/ExifParser.js

    /**
     * ExifParser.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/html5/image/ExifParser
    @private
    */
    define("moxie/runtime/html5/image/ExifParser", ["moxie/core/utils/Basic", "moxie/runtime/html5/utils/BinaryReader", "moxie/core/Exceptions"], function (Basic, BinaryReader, x) {

      function ExifParser(data) {
        var __super__, tags, tagDescs, offsets, idx, Tiff;

        BinaryReader.call(this, data);

        tags = {
          tiff: {
            /*
            The image orientation viewed in terms of rows and columns.
              1 = The 0th row is at the visual top of the image, and the 0th column is the visual left-hand side.
            2 = The 0th row is at the visual top of the image, and the 0th column is the visual right-hand side.
            3 = The 0th row is at the visual bottom of the image, and the 0th column is the visual right-hand side.
            4 = The 0th row is at the visual bottom of the image, and the 0th column is the visual left-hand side.
            5 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual top.
            6 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual top.
            7 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual bottom.
            8 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual bottom.
            */
            0x0112: 'Orientation',
            0x010E: 'ImageDescription',
            0x010F: 'Make',
            0x0110: 'Model',
            0x0131: 'Software',
            0x8769: 'ExifIFDPointer',
            0x8825: 'GPSInfoIFDPointer'
          },
          exif: {
            0x9000: 'ExifVersion',
            0xA001: 'ColorSpace',
            0xA002: 'PixelXDimension',
            0xA003: 'PixelYDimension',
            0x9003: 'DateTimeOriginal',
            0x829A: 'ExposureTime',
            0x829D: 'FNumber',
            0x8827: 'ISOSpeedRatings',
            0x9201: 'ShutterSpeedValue',
            0x9202: 'ApertureValue',
            0x9207: 'MeteringMode',
            0x9208: 'LightSource',
            0x9209: 'Flash',
            0x920A: 'FocalLength',
            0xA402: 'ExposureMode',
            0xA403: 'WhiteBalance',
            0xA406: 'SceneCaptureType',
            0xA404: 'DigitalZoomRatio',
            0xA408: 'Contrast',
            0xA409: 'Saturation',
            0xA40A: 'Sharpness'
          },
          gps: {
            0x0000: 'GPSVersionID',
            0x0001: 'GPSLatitudeRef',
            0x0002: 'GPSLatitude',
            0x0003: 'GPSLongitudeRef',
            0x0004: 'GPSLongitude'
          },

          thumb: {
            0x0201: 'JPEGInterchangeFormat',
            0x0202: 'JPEGInterchangeFormatLength'
          }
        };

        tagDescs = {
          'ColorSpace': {
            1: 'sRGB',
            0: 'Uncalibrated'
          },

          'MeteringMode': {
            0: 'Unknown',
            1: 'Average',
            2: 'CenterWeightedAverage',
            3: 'Spot',
            4: 'MultiSpot',
            5: 'Pattern',
            6: 'Partial',
            255: 'Other'
          },

          'LightSource': {
            1: 'Daylight',
            2: 'Fliorescent',
            3: 'Tungsten',
            4: 'Flash',
            9: 'Fine weather',
            10: 'Cloudy weather',
            11: 'Shade',
            12: 'Daylight fluorescent (D 5700 - 7100K)',
            13: 'Day white fluorescent (N 4600 -5400K)',
            14: 'Cool white fluorescent (W 3900 - 4500K)',
            15: 'White fluorescent (WW 3200 - 3700K)',
            17: 'Standard light A',
            18: 'Standard light B',
            19: 'Standard light C',
            20: 'D55',
            21: 'D65',
            22: 'D75',
            23: 'D50',
            24: 'ISO studio tungsten',
            255: 'Other'
          },

          'Flash': {
            0x0000: 'Flash did not fire',
            0x0001: 'Flash fired',
            0x0005: 'Strobe return light not detected',
            0x0007: 'Strobe return light detected',
            0x0009: 'Flash fired, compulsory flash mode',
            0x000D: 'Flash fired, compulsory flash mode, return light not detected',
            0x000F: 'Flash fired, compulsory flash mode, return light detected',
            0x0010: 'Flash did not fire, compulsory flash mode',
            0x0018: 'Flash did not fire, auto mode',
            0x0019: 'Flash fired, auto mode',
            0x001D: 'Flash fired, auto mode, return light not detected',
            0x001F: 'Flash fired, auto mode, return light detected',
            0x0020: 'No flash function',
            0x0041: 'Flash fired, red-eye reduction mode',
            0x0045: 'Flash fired, red-eye reduction mode, return light not detected',
            0x0047: 'Flash fired, red-eye reduction mode, return light detected',
            0x0049: 'Flash fired, compulsory flash mode, red-eye reduction mode',
            0x004D: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected',
            0x004F: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light detected',
            0x0059: 'Flash fired, auto mode, red-eye reduction mode',
            0x005D: 'Flash fired, auto mode, return light not detected, red-eye reduction mode',
            0x005F: 'Flash fired, auto mode, return light detected, red-eye reduction mode'
          },

          'ExposureMode': {
            0: 'Auto exposure',
            1: 'Manual exposure',
            2: 'Auto bracket'
          },

          'WhiteBalance': {
            0: 'Auto white balance',
            1: 'Manual white balance'
          },

          'SceneCaptureType': {
            0: 'Standard',
            1: 'Landscape',
            2: 'Portrait',
            3: 'Night scene'
          },

          'Contrast': {
            0: 'Normal',
            1: 'Soft',
            2: 'Hard'
          },

          'Saturation': {
            0: 'Normal',
            1: 'Low saturation',
            2: 'High saturation'
          },

          'Sharpness': {
            0: 'Normal',
            1: 'Soft',
            2: 'Hard'
          },

          // GPS related
          'GPSLatitudeRef': {
            N: 'North latitude',
            S: 'South latitude'
          },

          'GPSLongitudeRef': {
            E: 'East longitude',
            W: 'West longitude'
          }
        };

        offsets = {
          tiffHeader: 10
        };

        idx = offsets.tiffHeader;

        __super__ = {
          clear: this.clear
        };

        // Public functions
        Basic.extend(this, {

          read: function () {
            try {
              return ExifParser.prototype.read.apply(this, arguments);
            } catch (ex) {
              throw new x.ImageError(x.ImageError.INVALID_META_ERR);
            }
          },

          write: function () {
            try {
              return ExifParser.prototype.write.apply(this, arguments);
            } catch (ex) {
              throw new x.ImageError(x.ImageError.INVALID_META_ERR);
            }
          },

          UNDEFINED: function () {
            return this.BYTE.apply(this, arguments);
          },

          RATIONAL: function (idx) {
            return this.LONG(idx) / this.LONG(idx + 4);
          },

          SRATIONAL: function (idx) {
            return this.SLONG(idx) / this.SLONG(idx + 4);
          },

          ASCII: function (idx) {
            return this.CHAR(idx);
          },

          TIFF: function () {
            return Tiff || null;
          },

          EXIF: function () {
            var Exif = null;

            if (offsets.exifIFD) {
              try {
                Exif = extractTags.call(this, offsets.exifIFD, tags.exif);
              } catch (ex) {
                return null;
              }

              // Fix formatting of some tags
              if (Exif.ExifVersion && Basic.typeOf(Exif.ExifVersion) === 'array') {
                for (var i = 0, exifVersion = ''; i < Exif.ExifVersion.length; i++) {
                  exifVersion += String.fromCharCode(Exif.ExifVersion[i]);
                }
                Exif.ExifVersion = exifVersion;
              }
            }

            return Exif;
          },

          GPS: function () {
            var GPS = null;

            if (offsets.gpsIFD) {
              try {
                GPS = extractTags.call(this, offsets.gpsIFD, tags.gps);
              } catch (ex) {
                return null;
              }

              // iOS devices (and probably some others) do not put in GPSVersionID tag (why?..)
              if (GPS.GPSVersionID && Basic.typeOf(GPS.GPSVersionID) === 'array') {
                GPS.GPSVersionID = GPS.GPSVersionID.join('.');
              }
            }

            return GPS;
          },

          thumb: function () {
            if (offsets.IFD1) {
              try {
                var IFD1Tags = extractTags.call(this, offsets.IFD1, tags.thumb);

                if ('JPEGInterchangeFormat' in IFD1Tags) {
                  return this.SEGMENT(offsets.tiffHeader + IFD1Tags.JPEGInterchangeFormat, IFD1Tags.JPEGInterchangeFormatLength);
                }
              } catch (ex) {}
            }
            return null;
          },

          setExif: function (tag, value) {
            // Right now only setting of width/height is possible
            if (tag !== 'PixelXDimension' && tag !== 'PixelYDimension') {
              return false;
            }

            return setTag.call(this, 'exif', tag, value);
          },

          clear: function () {
            __super__.clear();
            data = tags = tagDescs = Tiff = offsets = __super__ = null;
          }
        });

        // Check if that's APP1 and that it has EXIF
        if (this.SHORT(0) !== 0xFFE1 || this.STRING(4, 5).toUpperCase() !== "EXIF\0") {
          throw new x.ImageError(x.ImageError.INVALID_META_ERR);
        }

        // Set read order of multi-byte data
        this.littleEndian = this.SHORT(idx) == 0x4949;

        // Check if always present bytes are indeed present
        if (this.SHORT(idx += 2) !== 0x002A) {
          throw new x.ImageError(x.ImageError.INVALID_META_ERR);
        }

        offsets.IFD0 = offsets.tiffHeader + this.LONG(idx += 2);
        Tiff = extractTags.call(this, offsets.IFD0, tags.tiff);

        if ('ExifIFDPointer' in Tiff) {
          offsets.exifIFD = offsets.tiffHeader + Tiff.ExifIFDPointer;
          delete Tiff.ExifIFDPointer;
        }

        if ('GPSInfoIFDPointer' in Tiff) {
          offsets.gpsIFD = offsets.tiffHeader + Tiff.GPSInfoIFDPointer;
          delete Tiff.GPSInfoIFDPointer;
        }

        if (Basic.isEmptyObj(Tiff)) {
          Tiff = null;
        }

        // check if we have a thumb as well
        var IFD1Offset = this.LONG(offsets.IFD0 + this.SHORT(offsets.IFD0) * 12 + 2);
        if (IFD1Offset) {
          offsets.IFD1 = offsets.tiffHeader + IFD1Offset;
        }

        function extractTags(IFD_offset, tags2extract) {
          var data = this;
          var length,
              i,
              tag,
              type,
              count,
              size,
              offset,
              value,
              values = [],
              hash = {};

          var types = {
            1: 'BYTE',
            7: 'UNDEFINED',
            2: 'ASCII',
            3: 'SHORT',
            4: 'LONG',
            5: 'RATIONAL',
            9: 'SLONG',
            10: 'SRATIONAL'
          };

          var sizes = {
            'BYTE': 1,
            'UNDEFINED': 1,
            'ASCII': 1,
            'SHORT': 2,
            'LONG': 4,
            'RATIONAL': 8,
            'SLONG': 4,
            'SRATIONAL': 8
          };

          length = data.SHORT(IFD_offset);

          // The size of APP1 including all these elements shall not exceed the 64 Kbytes specified in the JPEG standard.

          for (i = 0; i < length; i++) {
            values = [];

            // Set binary reader pointer to beginning of the next tag
            offset = IFD_offset + 2 + i * 12;

            tag = tags2extract[data.SHORT(offset)];

            if (tag === undefined) {
              continue; // Not the tag we requested
            }

            type = types[data.SHORT(offset += 2)];
            count = data.LONG(offset += 2);
            size = sizes[type];

            if (!size) {
              throw new x.ImageError(x.ImageError.INVALID_META_ERR);
            }

            offset += 4;

            // tag can only fit 4 bytes of data, if data is larger we should look outside
            if (size * count > 4) {
              // instead of data tag contains an offset of the data
              offset = data.LONG(offset) + offsets.tiffHeader;
            }

            // in case we left the boundaries of data throw an early exception
            if (offset + size * count >= this.length()) {
              throw new x.ImageError(x.ImageError.INVALID_META_ERR);
            }

            // special care for the string
            if (type === 'ASCII') {
              hash[tag] = Basic.trim(data.STRING(offset, count).replace(/\0$/, '')); // strip trailing NULL
              continue;
            } else {
              values = data.asArray(type, offset, count);
              value = count == 1 ? values[0] : values;

              if (tagDescs.hasOwnProperty(tag) && typeof value != 'object') {
                hash[tag] = tagDescs[tag][value];
              } else {
                hash[tag] = value;
              }
            }
          }

          return hash;
        }

        // At the moment only setting of simple (LONG) values, that do not require offset recalculation, is supported
        function setTag(ifd, tag, value) {
          var offset,
              length,
              tagOffset,
              valueOffset = 0;

          // If tag name passed translate into hex key
          if (typeof tag === 'string') {
            var tmpTags = tags[ifd.toLowerCase()];
            for (var hex in tmpTags) {
              if (tmpTags[hex] === tag) {
                tag = hex;
                break;
              }
            }
          }
          offset = offsets[ifd.toLowerCase() + 'IFD'];
          length = this.SHORT(offset);

          for (var i = 0; i < length; i++) {
            tagOffset = offset + 12 * i + 2;

            if (this.SHORT(tagOffset) == tag) {
              valueOffset = tagOffset + 8;
              break;
            }
          }

          if (!valueOffset) {
            return false;
          }

          try {
            this.write(valueOffset, value, 4);
          } catch (ex) {
            return false;
          }

          return true;
        }
      }

      ExifParser.prototype = BinaryReader.prototype;

      return ExifParser;
    });

    // Included from: src/javascript/runtime/html5/image/JPEG.js

    /**
     * JPEG.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/html5/image/JPEG
    @private
    */
    define("moxie/runtime/html5/image/JPEG", ["moxie/core/utils/Basic", "moxie/core/Exceptions", "moxie/runtime/html5/image/JPEGHeaders", "moxie/runtime/html5/utils/BinaryReader", "moxie/runtime/html5/image/ExifParser"], function (Basic, x, JPEGHeaders, BinaryReader, ExifParser) {

      function JPEG(data) {
        var _br, _hm, _ep, _info;

        _br = new BinaryReader(data);

        // check if it is jpeg
        if (_br.SHORT(0) !== 0xFFD8) {
          throw new x.ImageError(x.ImageError.WRONG_FORMAT);
        }

        // backup headers
        _hm = new JPEGHeaders(data);

        // extract exif info
        try {
          _ep = new ExifParser(_hm.get('app1')[0]);
        } catch (ex) {}

        // get dimensions
        _info = _getDimensions.call(this);

        Basic.extend(this, {
          type: 'image/jpeg',

          size: _br.length(),

          width: _info && _info.width || 0,

          height: _info && _info.height || 0,

          setExif: function (tag, value) {
            if (!_ep) {
              return false; // or throw an exception
            }

            if (Basic.typeOf(tag) === 'object') {
              Basic.each(tag, function (value, tag) {
                _ep.setExif(tag, value);
              });
            } else {
              _ep.setExif(tag, value);
            }

            // update internal headers
            _hm.set('app1', _ep.SEGMENT());
          },

          writeHeaders: function () {
            if (!arguments.length) {
              // if no arguments passed, update headers internally
              return _hm.restore(data);
            }
            return _hm.restore(arguments[0]);
          },

          stripHeaders: function (data) {
            return _hm.strip(data);
          },

          purge: function () {
            _purge.call(this);
          }
        });

        if (_ep) {
          this.meta = {
            tiff: _ep.TIFF(),
            exif: _ep.EXIF(),
            gps: _ep.GPS(),
            thumb: _getThumb()
          };
        }

        function _getDimensions(br) {
          var idx = 0,
              marker,
              length;

          if (!br) {
            br = _br;
          }

          // examine all through the end, since some images might have very large APP segments
          while (idx <= br.length()) {
            marker = br.SHORT(idx += 2);

            if (marker >= 0xFFC0 && marker <= 0xFFC3) {
              // SOFn
              idx += 5; // marker (2 bytes) + length (2 bytes) + Sample precision (1 byte)
              return {
                height: br.SHORT(idx),
                width: br.SHORT(idx += 2)
              };
            }
            length = br.SHORT(idx += 2);
            idx += length - 2;
          }
          return null;
        }

        function _getThumb() {
          var data = _ep.thumb(),
              br,
              info;

          if (data) {
            br = new BinaryReader(data);
            info = _getDimensions(br);
            br.clear();

            if (info) {
              info.data = data;
              return info;
            }
          }
          return null;
        }

        function _purge() {
          if (!_ep || !_hm || !_br) {
            return; // ignore any repeating purge requests
          }
          _ep.clear();
          _hm.purge();
          _br.clear();
          _info = _hm = _ep = _br = null;
        }
      }

      return JPEG;
    });

    // Included from: src/javascript/runtime/html5/image/PNG.js

    /**
     * PNG.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/html5/image/PNG
    @private
    */
    define("moxie/runtime/html5/image/PNG", ["moxie/core/Exceptions", "moxie/core/utils/Basic", "moxie/runtime/html5/utils/BinaryReader"], function (x, Basic, BinaryReader) {

      function PNG(data) {
        var _br, _hm, _ep, _info;

        _br = new BinaryReader(data);

        // check if it's png
        (function () {
          var idx = 0,
              i = 0,
              signature = [0x8950, 0x4E47, 0x0D0A, 0x1A0A];

          for (i = 0; i < signature.length; i++, idx += 2) {
            if (signature[i] != _br.SHORT(idx)) {
              throw new x.ImageError(x.ImageError.WRONG_FORMAT);
            }
          }
        })();

        function _getDimensions() {
          var chunk, idx;

          chunk = _getChunkAt.call(this, 8);

          if (chunk.type == 'IHDR') {
            idx = chunk.start;
            return {
              width: _br.LONG(idx),
              height: _br.LONG(idx += 4)
            };
          }
          return null;
        }

        function _purge() {
          if (!_br) {
            return; // ignore any repeating purge requests
          }
          _br.clear();
          data = _info = _hm = _ep = _br = null;
        }

        _info = _getDimensions.call(this);

        Basic.extend(this, {
          type: 'image/png',

          size: _br.length(),

          width: _info.width,

          height: _info.height,

          purge: function () {
            _purge.call(this);
          }
        });

        // for PNG we can safely trigger purge automatically, as we do not keep any data for later
        _purge.call(this);

        function _getChunkAt(idx) {
          var length, type, start, CRC;

          length = _br.LONG(idx);
          type = _br.STRING(idx += 4, 4);
          start = idx += 4;
          CRC = _br.LONG(idx + length);

          return {
            length: length,
            type: type,
            start: start,
            CRC: CRC
          };
        }
      }

      return PNG;
    });

    // Included from: src/javascript/runtime/html5/image/ImageInfo.js

    /**
     * ImageInfo.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/html5/image/ImageInfo
    @private
    */
    define("moxie/runtime/html5/image/ImageInfo", ["moxie/core/utils/Basic", "moxie/core/Exceptions", "moxie/runtime/html5/image/JPEG", "moxie/runtime/html5/image/PNG"], function (Basic, x, JPEG, PNG) {
      /**
      Optional image investigation tool for HTML5 runtime. Provides the following features:
      - ability to distinguish image type (JPEG or PNG) by signature
      - ability to extract image width/height directly from it's internals, without preloading in memory (fast)
      - ability to extract APP headers from JPEGs (Exif, GPS, etc)
      - ability to replace width/height tags in extracted JPEG headers
      - ability to restore APP headers, that were for example stripped during image manipulation
        @class ImageInfo
      @constructor
      @param {String} data Image source as binary string
      */
      return function (data) {
        var _cs = [JPEG, PNG],
            _img;

        // figure out the format, throw: ImageError.WRONG_FORMAT if not supported
        _img = function () {
          for (var i = 0; i < _cs.length; i++) {
            try {
              return new _cs[i](data);
            } catch (ex) {
              // console.info(ex);
            }
          }
          throw new x.ImageError(x.ImageError.WRONG_FORMAT);
        }();

        Basic.extend(this, {
          /**
          Image Mime Type extracted from it's depths
            @property type
          @type {String}
          @default ''
          */
          type: '',

          /**
          Image size in bytes
            @property size
          @type {Number}
          @default 0
          */
          size: 0,

          /**
          Image width extracted from image source
            @property width
          @type {Number}
          @default 0
          */
          width: 0,

          /**
          Image height extracted from image source
            @property height
          @type {Number}
          @default 0
          */
          height: 0,

          /**
          Sets Exif tag. Currently applicable only for width and height tags. Obviously works only with JPEGs.
            @method setExif
          @param {String} tag Tag to set
          @param {Mixed} value Value to assign to the tag
          */
          setExif: function () {},

          /**
          Restores headers to the source.
            @method writeHeaders
          @param {String} data Image source as binary string
          @return {String} Updated binary string
          */
          writeHeaders: function (data) {
            return data;
          },

          /**
          Strip all headers from the source.
            @method stripHeaders
          @param {String} data Image source as binary string
          @return {String} Updated binary string
          */
          stripHeaders: function (data) {
            return data;
          },

          /**
          Dispose resources.
            @method purge
          */
          purge: function () {
            data = null;
          }
        });

        Basic.extend(this, _img);

        this.purge = function () {
          _img.purge();
          _img = null;
        };
      };
    });

    // Included from: src/javascript/runtime/html5/image/ResizerCanvas.js

    /**
     * ResizerCanvas.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
     * Resizes image/canvas using canvas
     */
    define("moxie/runtime/html5/image/ResizerCanvas", [], function () {

      function scale(image, ratio) {
        var sW = image.width;
        var dW = Math.floor(sW * ratio);
        var scaleCapped = false;

        if (ratio < 0.5 || ratio > 2) {
          ratio = ratio < 0.5 ? 0.5 : 2;
          scaleCapped = true;
        }

        var tCanvas = _scale(image, ratio);

        if (scaleCapped) {
          return scale(tCanvas, dW / tCanvas.width);
        } else {
          return tCanvas;
        }
      }

      function _scale(image, ratio) {
        var sW = image.width;
        var sH = image.height;
        var dW = Math.floor(sW * ratio);
        var dH = Math.floor(sH * ratio);

        var canvas = document.createElement('canvas');
        canvas.width = dW;
        canvas.height = dH;
        canvas.getContext("2d").drawImage(image, 0, 0, sW, sH, 0, 0, dW, dH);

        image = null; // just in case
        return canvas;
      }

      return {
        scale: scale
      };
    });

    // Included from: src/javascript/runtime/html5/image/Image.js

    /**
     * Image.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/html5/image/Image
    @private
    */
    define("moxie/runtime/html5/image/Image", ["moxie/runtime/html5/Runtime", "moxie/core/utils/Basic", "moxie/core/Exceptions", "moxie/core/utils/Encode", "moxie/file/Blob", "moxie/file/File", "moxie/runtime/html5/image/ImageInfo", "moxie/runtime/html5/image/ResizerCanvas", "moxie/core/utils/Mime", "moxie/core/utils/Env"], function (extensions, Basic, x, Encode, Blob, File, ImageInfo, ResizerCanvas, Mime, Env) {

      function HTML5Image() {
        var me = this,
            _img,
            _imgInfo,
            _canvas,
            _binStr,
            _blob,
            _modified = false // is set true whenever image is modified
        ,
            _preserveHeaders = true;

        Basic.extend(this, {
          loadFromBlob: function (blob) {
            var I = this.getRuntime(),
                asBinary = arguments.length > 1 ? arguments[1] : true;

            if (!I.can('access_binary')) {
              throw new x.RuntimeError(x.RuntimeError.NOT_SUPPORTED_ERR);
            }

            _blob = blob;

            if (blob.isDetached()) {
              _binStr = blob.getSource();
              _preload.call(this, _binStr);
              return;
            } else {
              _readAsDataUrl.call(this, blob.getSource(), function (dataUrl) {
                if (asBinary) {
                  _binStr = _toBinary(dataUrl);
                }
                _preload.call(this, dataUrl);
              });
            }
          },

          loadFromImage: function (img, exact) {
            this.meta = img.meta;

            _blob = new File(null, {
              name: img.name,
              size: img.size,
              type: img.type
            });

            _preload.call(this, exact ? _binStr = img.getAsBinaryString() : img.getAsDataURL());
          },

          getInfo: function () {
            var I = this.getRuntime(),
                info;

            if (!_imgInfo && _binStr && I.can('access_image_binary')) {
              _imgInfo = new ImageInfo(_binStr);
            }

            // this stuff below is definitely having fun with itself
            info = {
              width: _getImg().width || 0,
              height: _getImg().height || 0,
              type: _blob.type || Mime.getFileMime(_blob.name),
              size: _binStr && _binStr.length || _blob.size || 0,
              name: _blob.name || '',
              meta: null
            };

            if (_preserveHeaders) {
              info.meta = _imgInfo && _imgInfo.meta || this.meta || {};

              // if data was taken from ImageInfo it will be a binary string, so we convert it to blob
              if (info.meta && info.meta.thumb && !(info.meta.thumb.data instanceof Blob)) {
                info.meta.thumb.data = new Blob(null, {
                  type: 'image/jpeg',
                  data: info.meta.thumb.data
                });
              }
            }

            return info;
          },

          resize: function (rect, ratio, options) {
            var canvas = document.createElement('canvas');
            canvas.width = rect.width;
            canvas.height = rect.height;

            canvas.getContext("2d").drawImage(_getImg(), rect.x, rect.y, rect.width, rect.height, 0, 0, canvas.width, canvas.height);

            _canvas = ResizerCanvas.scale(canvas, ratio);

            _preserveHeaders = options.preserveHeaders;

            // rotate if required, according to orientation tag
            if (!_preserveHeaders) {
              var orientation = this.meta && this.meta.tiff && this.meta.tiff.Orientation || 1;
              _canvas = _rotateToOrientaion(_canvas, orientation);
            }

            this.width = _canvas.width;
            this.height = _canvas.height;

            _modified = true;

            this.trigger('Resize');
          },

          getAsCanvas: function () {
            if (!_canvas) {
              _canvas = _getCanvas();
            }
            _canvas.id = this.uid + '_canvas';
            return _canvas;
          },

          getAsBlob: function (type, quality) {
            if (type !== this.type) {
              _modified = true; // reconsider the state
              return new File(null, {
                name: _blob.name || '',
                type: type,
                data: me.getAsDataURL(type, quality)
              });
            }
            return new File(null, {
              name: _blob.name || '',
              type: type,
              data: me.getAsBinaryString(type, quality)
            });
          },

          getAsDataURL: function (type) {
            var quality = arguments[1] || 90;

            // if image has not been modified, return the source right away
            if (!_modified) {
              return _img.src;
            }

            // make sure we have a canvas to work with
            _getCanvas();

            if ('image/jpeg' !== type) {
              return _canvas.toDataURL('image/png');
            } else {
              try {
                // older Geckos used to result in an exception on quality argument
                return _canvas.toDataURL('image/jpeg', quality / 100);
              } catch (ex) {
                return _canvas.toDataURL('image/jpeg');
              }
            }
          },

          getAsBinaryString: function (type, quality) {
            // if image has not been modified, return the source right away
            if (!_modified) {
              // if image was not loaded from binary string
              if (!_binStr) {
                _binStr = _toBinary(me.getAsDataURL(type, quality));
              }
              return _binStr;
            }

            if ('image/jpeg' !== type) {
              _binStr = _toBinary(me.getAsDataURL(type, quality));
            } else {
              var dataUrl;

              // if jpeg
              if (!quality) {
                quality = 90;
              }

              // make sure we have a canvas to work with
              _getCanvas();

              try {
                // older Geckos used to result in an exception on quality argument
                dataUrl = _canvas.toDataURL('image/jpeg', quality / 100);
              } catch (ex) {
                dataUrl = _canvas.toDataURL('image/jpeg');
              }

              _binStr = _toBinary(dataUrl);

              if (_imgInfo) {
                _binStr = _imgInfo.stripHeaders(_binStr);

                if (_preserveHeaders) {
                  // update dimensions info in exif
                  if (_imgInfo.meta && _imgInfo.meta.exif) {
                    _imgInfo.setExif({
                      PixelXDimension: this.width,
                      PixelYDimension: this.height
                    });
                  }

                  // re-inject the headers
                  _binStr = _imgInfo.writeHeaders(_binStr);
                }

                // will be re-created from fresh on next getInfo call
                _imgInfo.purge();
                _imgInfo = null;
              }
            }

            _modified = false;

            return _binStr;
          },

          destroy: function () {
            me = null;
            _purge.call(this);
            this.getRuntime().getShim().removeInstance(this.uid);
          }
        });

        function _getImg() {
          if (!_canvas && !_img) {
            throw new x.ImageError(x.DOMException.INVALID_STATE_ERR);
          }
          return _canvas || _img;
        }

        function _getCanvas() {
          var canvas = _getImg();
          if (canvas.nodeName.toLowerCase() == 'canvas') {
            return canvas;
          }
          _canvas = document.createElement('canvas');
          _canvas.width = canvas.width;
          _canvas.height = canvas.height;
          _canvas.getContext("2d").drawImage(canvas, 0, 0);
          return _canvas;
        }

        function _toBinary(str) {
          return Encode.atob(str.substring(str.indexOf('base64,') + 7));
        }

        function _toDataUrl(str, type) {
          return 'data:' + (type || '') + ';base64,' + Encode.btoa(str);
        }

        function _preload(str) {
          var comp = this;

          _img = new Image();
          _img.onerror = function () {
            _purge.call(this);
            comp.trigger('error', x.ImageError.WRONG_FORMAT);
          };
          _img.onload = function () {
            comp.trigger('load');
          };

          _img.src = str.substr(0, 5) == 'data:' ? str : _toDataUrl(str, _blob.type);
        }

        function _readAsDataUrl(file, callback) {
          var comp = this,
              fr;

          // use FileReader if it's available
          if (window.FileReader) {
            fr = new FileReader();
            fr.onload = function () {
              callback.call(comp, this.result);
            };
            fr.onerror = function () {
              comp.trigger('error', x.ImageError.WRONG_FORMAT);
            };
            fr.readAsDataURL(file);
          } else {
            return callback.call(this, file.getAsDataURL());
          }
        }

        /**
        * Transform canvas coordination according to specified frame size and orientation
        * Orientation value is from EXIF tag
        * @author Shinichi Tomita <shinichi.tomita@gmail.com>
        */
        function _rotateToOrientaion(img, orientation) {
          var RADIANS = Math.PI / 180;
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          var width = img.width;
          var height = img.height;

          if (Basic.inArray(orientation, [5, 6, 7, 8]) > -1) {
            canvas.width = height;
            canvas.height = width;
          } else {
            canvas.width = width;
            canvas.height = height;
          }

          /**
          1 = The 0th row is at the visual top of the image, and the 0th column is the visual left-hand side.
          2 = The 0th row is at the visual top of the image, and the 0th column is the visual right-hand side.
          3 = The 0th row is at the visual bottom of the image, and the 0th column is the visual right-hand side.
          4 = The 0th row is at the visual bottom of the image, and the 0th column is the visual left-hand side.
          5 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual top.
          6 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual top.
          7 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual bottom.
          8 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual bottom.
          */
          switch (orientation) {
            case 2:
              // horizontal flip
              ctx.translate(width, 0);
              ctx.scale(-1, 1);
              break;
            case 3:
              // 180 rotate left
              ctx.translate(width, height);
              ctx.rotate(180 * RADIANS);
              break;
            case 4:
              // vertical flip
              ctx.translate(0, height);
              ctx.scale(1, -1);
              break;
            case 5:
              // vertical flip + 90 rotate right
              ctx.rotate(90 * RADIANS);
              ctx.scale(1, -1);
              break;
            case 6:
              // 90 rotate right
              ctx.rotate(90 * RADIANS);
              ctx.translate(0, -height);
              break;
            case 7:
              // horizontal flip + 90 rotate right
              ctx.rotate(90 * RADIANS);
              ctx.translate(width, -height);
              ctx.scale(-1, 1);
              break;
            case 8:
              // 90 rotate left
              ctx.rotate(-90 * RADIANS);
              ctx.translate(-width, 0);
              break;
          }

          ctx.drawImage(img, 0, 0, width, height);
          return canvas;
        }

        function _purge() {
          if (_imgInfo) {
            _imgInfo.purge();
            _imgInfo = null;
          }

          _binStr = _img = _canvas = _blob = null;
          _modified = false;
        }
      }

      return extensions.Image = HTML5Image;
    });

    // Included from: src/javascript/runtime/flash/Runtime.js

    /**
     * Runtime.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /*global ActiveXObject:true */

    /**
    Defines constructor for Flash runtime.
    
    @class moxie/runtime/flash/Runtime
    @private
    */
    define("moxie/runtime/flash/Runtime", ["moxie/core/utils/Basic", "moxie/core/utils/Env", "moxie/core/utils/Dom", "moxie/core/Exceptions", "moxie/runtime/Runtime"], function (Basic, Env, Dom, x, Runtime) {

      var type = 'flash',
          extensions = {};

      /**
      Get the version of the Flash Player
        @method getShimVersion
      @private
      @return {Number} Flash Player version
      */
      function getShimVersion() {
        var version;

        try {
          version = navigator.plugins['Shockwave Flash'];
          version = version.description;
        } catch (e1) {
          try {
            version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
          } catch (e2) {
            version = '0.0';
          }
        }
        version = version.match(/\d+/g);
        return parseFloat(version[0] + '.' + version[1]);
      }

      /**
      Cross-browser SWF removal
          - Especially needed to safely and completely remove a SWF in Internet Explorer
          Originated from SWFObject v2.2 <http://code.google.com/p/swfobject/>
      */
      function removeSWF(id) {
        var obj = Dom.get(id);
        if (obj && obj.nodeName == "OBJECT") {
          if (Env.browser === 'IE') {
            obj.style.display = "none";
            (function onInit() {
              // http://msdn.microsoft.com/en-us/library/ie/ms534360(v=vs.85).aspx
              if (obj.readyState == 4) {
                removeObjectInIE(id);
              } else {
                setTimeout(onInit, 10);
              }
            })();
          } else {
            obj.parentNode.removeChild(obj);
          }
        }
      }

      function removeObjectInIE(id) {
        var obj = Dom.get(id);
        if (obj) {
          for (var i in obj) {
            if (typeof obj[i] == "function") {
              obj[i] = null;
            }
          }
          obj.parentNode.removeChild(obj);
        }
      }

      /**
      Constructor for the Flash Runtime
        @class FlashRuntime
      @extends Runtime
      */
      function FlashRuntime(options) {
        var I = this,
            initTimer;

        options = Basic.extend({ swf_url: Env.swf_url }, options);

        Runtime.call(this, options, type, {
          access_binary: function (value) {
            return value && I.mode === 'browser';
          },
          access_image_binary: function (value) {
            return value && I.mode === 'browser';
          },
          display_media: Runtime.capTest(defined('moxie/image/Image')),
          do_cors: Runtime.capTrue,
          drag_and_drop: false,
          report_upload_progress: function () {
            return I.mode === 'client';
          },
          resize_image: Runtime.capTrue,
          return_response_headers: false,
          return_response_type: function (responseType) {
            if (responseType === 'json' && !!window.JSON) {
              return true;
            }
            return !Basic.arrayDiff(responseType, ['', 'text', 'document']) || I.mode === 'browser';
          },
          return_status_code: function (code) {
            return I.mode === 'browser' || !Basic.arrayDiff(code, [200, 404]);
          },
          select_file: Runtime.capTrue,
          select_multiple: Runtime.capTrue,
          send_binary_string: function (value) {
            return value && I.mode === 'browser';
          },
          send_browser_cookies: function (value) {
            return value && I.mode === 'browser';
          },
          send_custom_headers: function (value) {
            return value && I.mode === 'browser';
          },
          send_multipart: Runtime.capTrue,
          slice_blob: function (value) {
            return value && I.mode === 'browser';
          },
          stream_upload: function (value) {
            return value && I.mode === 'browser';
          },
          summon_file_dialog: false,
          upload_filesize: function (size) {
            return Basic.parseSizeStr(size) <= 2097152 || I.mode === 'client';
          },
          use_http_method: function (methods) {
            return !Basic.arrayDiff(methods, ['GET', 'POST']);
          }
        }, {
          // capabilities that require specific mode
          access_binary: function (value) {
            return value ? 'browser' : 'client';
          },
          access_image_binary: function (value) {
            return value ? 'browser' : 'client';
          },
          report_upload_progress: function (value) {
            return value ? 'browser' : 'client';
          },
          return_response_type: function (responseType) {
            return Basic.arrayDiff(responseType, ['', 'text', 'json', 'document']) ? 'browser' : ['client', 'browser'];
          },
          return_status_code: function (code) {
            return Basic.arrayDiff(code, [200, 404]) ? 'browser' : ['client', 'browser'];
          },
          send_binary_string: function (value) {
            return value ? 'browser' : 'client';
          },
          send_browser_cookies: function (value) {
            return value ? 'browser' : 'client';
          },
          send_custom_headers: function (value) {
            return value ? 'browser' : 'client';
          },
          slice_blob: function (value) {
            return value ? 'browser' : 'client';
          },
          stream_upload: function (value) {
            return value ? 'client' : 'browser';
          },
          upload_filesize: function (size) {
            return Basic.parseSizeStr(size) >= 2097152 ? 'client' : 'browser';
          }
        }, 'client');

        // minimal requirement for Flash Player version
        if (getShimVersion() < 11.3) {
          if (MXI_DEBUG && Env.debug.runtime) {
            Env.log("\tFlash didn't meet minimal version requirement (11.3).");
          }

          this.mode = false; // with falsy mode, runtime won't operable, no matter what the mode was before
        }

        Basic.extend(this, {

          getShim: function () {
            return Dom.get(this.uid);
          },

          shimExec: function (component, action) {
            var args = [].slice.call(arguments, 2);
            return I.getShim().exec(this.uid, component, action, args);
          },

          init: function () {
            var html, el, container;

            container = this.getShimContainer();

            // if not the minimal height, shims are not initialized in older browsers (e.g FF3.6, IE6,7,8, Safari 4.0,5.0, etc)
            Basic.extend(container.style, {
              position: 'absolute',
              top: '-8px',
              left: '-8px',
              width: '9px',
              height: '9px',
              overflow: 'hidden'
            });

            // insert flash object
            html = '<object id="' + this.uid + '" type="application/x-shockwave-flash" data="' + options.swf_url + '" ';

            if (Env.browser === 'IE') {
              html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
            }

            html += 'width="100%" height="100%" style="outline:0">' + '<param name="movie" value="' + options.swf_url + '" />' + '<param name="flashvars" value="uid=' + escape(this.uid) + '&target=' + Env.global_event_dispatcher + '" />' + '<param name="wmode" value="transparent" />' + '<param name="allowscriptaccess" value="always" />' + '</object>';

            if (Env.browser === 'IE') {
              el = document.createElement('div');
              container.appendChild(el);
              el.outerHTML = html;
              el = container = null; // just in case
            } else {
              container.innerHTML = html;
            }

            // Init is dispatched by the shim
            initTimer = setTimeout(function () {
              if (I && !I.initialized) {
                // runtime might be already destroyed by this moment
                I.trigger("Error", new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));

                if (MXI_DEBUG && Env.debug.runtime) {
                  Env.log("\tFlash failed to initialize within a specified period of time (typically 5s).");
                }
              }
            }, 5000);
          },

          destroy: function (destroy) {
            // extend default destroy method
            return function () {
              removeSWF(I.uid); // SWF removal requires special care in IE

              destroy.call(I);
              clearTimeout(initTimer); // initialization check might be still onwait
              options = initTimer = destroy = I = null;
            };
          }(this.destroy)

        }, extensions);
      }

      Runtime.addConstructor(type, FlashRuntime);

      return extensions;
    });

    // Included from: src/javascript/runtime/flash/file/Blob.js

    /**
     * Blob.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/flash/file/Blob
    @private
    */
    define("moxie/runtime/flash/file/Blob", ["moxie/runtime/flash/Runtime", "moxie/file/Blob"], function (extensions, Blob) {

      var FlashBlob = {
        slice: function (blob, start, end, type) {
          var self = this.getRuntime();

          if (start < 0) {
            start = Math.max(blob.size + start, 0);
          } else if (start > 0) {
            start = Math.min(start, blob.size);
          }

          if (end < 0) {
            end = Math.max(blob.size + end, 0);
          } else if (end > 0) {
            end = Math.min(end, blob.size);
          }

          blob = self.shimExec.call(this, 'Blob', 'slice', start, end, type || '');

          if (blob) {
            blob = new Blob(self.uid, blob);
          }
          return blob;
        }
      };

      return extensions.Blob = FlashBlob;
    });

    // Included from: src/javascript/runtime/flash/file/FileInput.js

    /**
     * FileInput.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/flash/file/FileInput
    @private
    */
    define("moxie/runtime/flash/file/FileInput", ["moxie/runtime/flash/Runtime", "moxie/file/File", "moxie/core/utils/Basic"], function (extensions, File, Basic) {

      var FileInput = {
        init: function (options) {
          var comp = this,
              I = this.getRuntime();

          this.bind("Change", function () {
            var files = I.shimExec.call(comp, 'FileInput', 'getFiles');
            comp.files = [];
            Basic.each(files, function (file) {
              comp.files.push(new File(I.uid, file));
            });
          }, 999);

          this.getRuntime().shimExec.call(this, 'FileInput', 'init', {
            accept: options.accept,
            multiple: options.multiple
          });

          this.trigger('ready');
        }
      };

      return extensions.FileInput = FileInput;
    });

    // Included from: src/javascript/runtime/flash/file/FileReader.js

    /**
     * FileReader.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/flash/file/FileReader
    @private
    */
    define("moxie/runtime/flash/file/FileReader", ["moxie/runtime/flash/Runtime", "moxie/core/utils/Encode"], function (extensions, Encode) {

      function _formatData(data, op) {
        switch (op) {
          case 'readAsText':
            return Encode.atob(data, 'utf8');
          case 'readAsBinaryString':
            return Encode.atob(data);
          case 'readAsDataURL':
            return data;
        }
        return null;
      }

      var FileReader = {
        read: function (op, blob) {
          var comp = this;

          comp.result = '';

          // special prefix for DataURL read mode
          if (op === 'readAsDataURL') {
            comp.result = 'data:' + (blob.type || '') + ';base64,';
          }

          comp.bind('Progress', function (e, data) {
            if (data) {
              comp.result += _formatData(data, op);
            }
          }, 999);

          return comp.getRuntime().shimExec.call(this, 'FileReader', 'readAsBase64', blob.uid);
        }
      };

      return extensions.FileReader = FileReader;
    });

    // Included from: src/javascript/runtime/flash/file/FileReaderSync.js

    /**
     * FileReaderSync.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/flash/file/FileReaderSync
    @private
    */
    define("moxie/runtime/flash/file/FileReaderSync", ["moxie/runtime/flash/Runtime", "moxie/core/utils/Encode"], function (extensions, Encode) {

      function _formatData(data, op) {
        switch (op) {
          case 'readAsText':
            return Encode.atob(data, 'utf8');
          case 'readAsBinaryString':
            return Encode.atob(data);
          case 'readAsDataURL':
            return data;
        }
        return null;
      }

      var FileReaderSync = {
        read: function (op, blob) {
          var result,
              self = this.getRuntime();

          result = self.shimExec.call(this, 'FileReaderSync', 'readAsBase64', blob.uid);
          if (!result) {
            return null; // or throw ex
          }

          // special prefix for DataURL read mode
          if (op === 'readAsDataURL') {
            result = 'data:' + (blob.type || '') + ';base64,' + result;
          }

          return _formatData(result, op, blob.type);
        }
      };

      return extensions.FileReaderSync = FileReaderSync;
    });

    // Included from: src/javascript/runtime/flash/runtime/Transporter.js

    /**
     * Transporter.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/flash/runtime/Transporter
    @private
    */
    define("moxie/runtime/flash/runtime/Transporter", ["moxie/runtime/flash/Runtime", "moxie/file/Blob"], function (extensions, Blob) {

      var Transporter = {
        getAsBlob: function (type) {
          var self = this.getRuntime(),
              blob = self.shimExec.call(this, 'Transporter', 'getAsBlob', type);
          if (blob) {
            return new Blob(self.uid, blob);
          }
          return null;
        }
      };

      return extensions.Transporter = Transporter;
    });

    // Included from: src/javascript/runtime/flash/xhr/XMLHttpRequest.js

    /**
     * XMLHttpRequest.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/flash/xhr/XMLHttpRequest
    @private
    */
    define("moxie/runtime/flash/xhr/XMLHttpRequest", ["moxie/runtime/flash/Runtime", "moxie/core/utils/Basic", "moxie/file/Blob", "moxie/file/File", "moxie/file/FileReaderSync", "moxie/runtime/flash/file/FileReaderSync", "moxie/xhr/FormData", "moxie/runtime/Transporter", "moxie/runtime/flash/runtime/Transporter"], function (extensions, Basic, Blob, File, FileReaderSync, FileReaderSyncFlash, FormData, Transporter, TransporterFlash) {

      var XMLHttpRequest = {

        send: function (meta, data) {
          var target = this,
              self = target.getRuntime();

          function send() {
            meta.transport = self.mode;
            self.shimExec.call(target, 'XMLHttpRequest', 'send', meta, data);
          }

          function appendBlob(name, blob) {
            self.shimExec.call(target, 'XMLHttpRequest', 'appendBlob', name, blob.uid);
            data = null;
            send();
          }

          function attachBlob(blob, cb) {
            var tr = new Transporter();

            tr.bind("TransportingComplete", function () {
              cb(this.result);
            });

            tr.transport(blob.getSource(), blob.type, {
              ruid: self.uid
            });
          }

          // copy over the headers if any
          if (!Basic.isEmptyObj(meta.headers)) {
            Basic.each(meta.headers, function (value, header) {
              self.shimExec.call(target, 'XMLHttpRequest', 'setRequestHeader', header, value.toString()); // Silverlight doesn't accept integers into the arguments of type object
            });
          }

          // transfer over multipart params and blob itself
          if (data instanceof FormData) {
            var blobField;
            data.each(function (value, name) {
              if (value instanceof Blob) {
                blobField = name;
              } else {
                self.shimExec.call(target, 'XMLHttpRequest', 'append', name, value);
              }
            });

            if (!data.hasBlob()) {
              data = null;
              send();
            } else {
              var blob = data.getBlob();
              if (blob.isDetached()) {
                attachBlob(blob, function (attachedBlob) {
                  blob.destroy();
                  appendBlob(blobField, attachedBlob);
                });
              } else {
                appendBlob(blobField, blob);
              }
            }
          } else if (data instanceof Blob) {
            if (data.isDetached()) {
              attachBlob(data, function (attachedBlob) {
                data.destroy();
                data = attachedBlob.uid;
                send();
              });
            } else {
              data = data.uid;
              send();
            }
          } else {
            send();
          }
        },

        getResponse: function (responseType) {
          var frs,
              blob,
              self = this.getRuntime();

          blob = self.shimExec.call(this, 'XMLHttpRequest', 'getResponseAsBlob');

          if (blob) {
            blob = new File(self.uid, blob);

            if ('blob' === responseType) {
              return blob;
            }

            try {
              frs = new FileReaderSync();

              if (!!~Basic.inArray(responseType, ["", "text"])) {
                return frs.readAsText(blob);
              } else if ('json' === responseType && !!window.JSON) {
                return JSON.parse(frs.readAsText(blob));
              }
            } finally {
              blob.destroy();
            }
          }
          return null;
        },

        abort: function (upload_complete_flag) {
          var self = this.getRuntime();

          self.shimExec.call(this, 'XMLHttpRequest', 'abort');

          this.dispatchEvent('readystatechange');
          // this.dispatchEvent('progress');
          this.dispatchEvent('abort');

          //if (!upload_complete_flag) {
          // this.dispatchEvent('uploadprogress');
          //}
        }
      };

      return extensions.XMLHttpRequest = XMLHttpRequest;
    });

    // Included from: src/javascript/runtime/flash/image/Image.js

    /**
     * Image.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/flash/image/Image
    @private
    */
    define("moxie/runtime/flash/image/Image", ["moxie/runtime/flash/Runtime", "moxie/core/utils/Basic", "moxie/runtime/Transporter", "moxie/file/Blob", "moxie/file/FileReaderSync"], function (extensions, Basic, Transporter, Blob, FileReaderSync) {

      var Image = {
        loadFromBlob: function (blob) {
          var comp = this,
              self = comp.getRuntime();

          function exec(srcBlob) {
            self.shimExec.call(comp, 'Image', 'loadFromBlob', srcBlob.uid);
            comp = self = null;
          }

          if (blob.isDetached()) {
            // binary string
            var tr = new Transporter();
            tr.bind("TransportingComplete", function () {
              exec(tr.result.getSource());
            });
            tr.transport(blob.getSource(), blob.type, { ruid: self.uid });
          } else {
            exec(blob.getSource());
          }
        },

        loadFromImage: function (img) {
          var self = this.getRuntime();
          return self.shimExec.call(this, 'Image', 'loadFromImage', img.uid);
        },

        getInfo: function () {
          var self = this.getRuntime(),
              info = self.shimExec.call(this, 'Image', 'getInfo');

          if (info.meta && info.meta.thumb && info.meta.thumb.data && !(self.meta.thumb.data instanceof Blob)) {
            info.meta.thumb.data = new Blob(self.uid, info.meta.thumb.data);
          }
          return info;
        },

        getAsBlob: function (type, quality) {
          var self = this.getRuntime(),
              blob = self.shimExec.call(this, 'Image', 'getAsBlob', type, quality);
          if (blob) {
            return new Blob(self.uid, blob);
          }
          return null;
        },

        getAsDataURL: function () {
          var self = this.getRuntime(),
              blob = self.Image.getAsBlob.apply(this, arguments),
              frs;
          if (!blob) {
            return null;
          }
          frs = new FileReaderSync();
          return frs.readAsDataURL(blob);
        }
      };

      return extensions.Image = Image;
    });

    // Included from: src/javascript/runtime/silverlight/Runtime.js

    /**
     * RunTime.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /*global ActiveXObject:true */

    /**
    Defines constructor for Silverlight runtime.
    
    @class moxie/runtime/silverlight/Runtime
    @private
    */
    define("moxie/runtime/silverlight/Runtime", ["moxie/core/utils/Basic", "moxie/core/utils/Env", "moxie/core/utils/Dom", "moxie/core/Exceptions", "moxie/runtime/Runtime"], function (Basic, Env, Dom, x, Runtime) {

      var type = "silverlight",
          extensions = {};

      function isInstalled(version) {
        var isVersionSupported = false,
            control = null,
            actualVer,
            actualVerArray,
            reqVerArray,
            requiredVersionPart,
            actualVersionPart,
            index = 0;

        try {
          try {
            control = new ActiveXObject('AgControl.AgControl');

            if (control.IsVersionSupported(version)) {
              isVersionSupported = true;
            }

            control = null;
          } catch (e) {
            var plugin = navigator.plugins["Silverlight Plug-In"];

            if (plugin) {
              actualVer = plugin.description;

              if (actualVer === "1.0.30226.2") {
                actualVer = "2.0.30226.2";
              }

              actualVerArray = actualVer.split(".");

              while (actualVerArray.length > 3) {
                actualVerArray.pop();
              }

              while (actualVerArray.length < 4) {
                actualVerArray.push(0);
              }

              reqVerArray = version.split(".");

              while (reqVerArray.length > 4) {
                reqVerArray.pop();
              }

              do {
                requiredVersionPart = parseInt(reqVerArray[index], 10);
                actualVersionPart = parseInt(actualVerArray[index], 10);
                index++;
              } while (index < reqVerArray.length && requiredVersionPart === actualVersionPart);

              if (requiredVersionPart <= actualVersionPart && !isNaN(requiredVersionPart)) {
                isVersionSupported = true;
              }
            }
          }
        } catch (e2) {
          isVersionSupported = false;
        }

        return isVersionSupported;
      }

      /**
      Constructor for the Silverlight Runtime
        @class SilverlightRuntime
      @extends Runtime
      */
      function SilverlightRuntime(options) {
        var I = this,
            initTimer;

        options = Basic.extend({ xap_url: Env.xap_url }, options);

        Runtime.call(this, options, type, {
          access_binary: Runtime.capTrue,
          access_image_binary: Runtime.capTrue,
          display_media: Runtime.capTest(defined('moxie/image/Image')),
          do_cors: Runtime.capTrue,
          drag_and_drop: false,
          report_upload_progress: Runtime.capTrue,
          resize_image: Runtime.capTrue,
          return_response_headers: function (value) {
            return value && I.mode === 'client';
          },
          return_response_type: function (responseType) {
            if (responseType !== 'json') {
              return true;
            } else {
              return !!window.JSON;
            }
          },
          return_status_code: function (code) {
            return I.mode === 'client' || !Basic.arrayDiff(code, [200, 404]);
          },
          select_file: Runtime.capTrue,
          select_multiple: Runtime.capTrue,
          send_binary_string: Runtime.capTrue,
          send_browser_cookies: function (value) {
            return value && I.mode === 'browser';
          },
          send_custom_headers: function (value) {
            return value && I.mode === 'client';
          },
          send_multipart: Runtime.capTrue,
          slice_blob: Runtime.capTrue,
          stream_upload: true,
          summon_file_dialog: false,
          upload_filesize: Runtime.capTrue,
          use_http_method: function (methods) {
            return I.mode === 'client' || !Basic.arrayDiff(methods, ['GET', 'POST']);
          }
        }, {
          // capabilities that require specific mode
          return_response_headers: function (value) {
            return value ? 'client' : 'browser';
          },
          return_status_code: function (code) {
            return Basic.arrayDiff(code, [200, 404]) ? 'client' : ['client', 'browser'];
          },
          send_browser_cookies: function (value) {
            return value ? 'browser' : 'client';
          },
          send_custom_headers: function (value) {
            return value ? 'client' : 'browser';
          },
          use_http_method: function (methods) {
            return Basic.arrayDiff(methods, ['GET', 'POST']) ? 'client' : ['client', 'browser'];
          }
        });

        // minimal requirement
        if (!isInstalled('2.0.31005.0') || Env.browser === 'Opera') {
          if (MXI_DEBUG && Env.debug.runtime) {
            Env.log("\tSilverlight is not installed or minimal version (2.0.31005.0) requirement not met (not likely).");
          }

          this.mode = false;
        }

        Basic.extend(this, {
          getShim: function () {
            return Dom.get(this.uid).content.Moxie;
          },

          shimExec: function (component, action) {
            var args = [].slice.call(arguments, 2);
            return I.getShim().exec(this.uid, component, action, args);
          },

          init: function () {
            var container;

            container = this.getShimContainer();

            container.innerHTML = '<object id="' + this.uid + '" data="data:application/x-silverlight," type="application/x-silverlight-2" width="100%" height="100%" style="outline:none;">' + '<param name="source" value="' + options.xap_url + '"/>' + '<param name="background" value="Transparent"/>' + '<param name="windowless" value="true"/>' + '<param name="enablehtmlaccess" value="true"/>' + '<param name="initParams" value="uid=' + this.uid + ',target=' + Env.global_event_dispatcher + '"/>' + '</object>';

            // Init is dispatched by the shim
            initTimer = setTimeout(function () {
              if (I && !I.initialized) {
                // runtime might be already destroyed by this moment
                I.trigger("Error", new x.RuntimeError(x.RuntimeError.NOT_INIT_ERR));

                if (MXI_DEBUG && Env.debug.runtime) {
                  Env.log("\Silverlight failed to initialize within a specified period of time (5-10s).");
                }
              }
            }, Env.OS !== 'Windows' ? 10000 : 5000); // give it more time to initialize in non Windows OS (like Mac)
          },

          destroy: function (destroy) {
            // extend default destroy method
            return function () {
              destroy.call(I);
              clearTimeout(initTimer); // initialization check might be still onwait
              options = initTimer = destroy = I = null;
            };
          }(this.destroy)

        }, extensions);
      }

      Runtime.addConstructor(type, SilverlightRuntime);

      return extensions;
    });

    // Included from: src/javascript/runtime/silverlight/file/Blob.js

    /**
     * Blob.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/silverlight/file/Blob
    @private
    */
    define("moxie/runtime/silverlight/file/Blob", ["moxie/runtime/silverlight/Runtime", "moxie/core/utils/Basic", "moxie/runtime/flash/file/Blob"], function (extensions, Basic, Blob) {
      return extensions.Blob = Basic.extend({}, Blob);
    });

    // Included from: src/javascript/runtime/silverlight/file/FileInput.js

    /**
     * FileInput.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/silverlight/file/FileInput
    @private
    */
    define("moxie/runtime/silverlight/file/FileInput", ["moxie/runtime/silverlight/Runtime", "moxie/file/File", "moxie/core/utils/Basic"], function (extensions, File, Basic) {

      function toFilters(accept) {
        var filter = '';
        for (var i = 0; i < accept.length; i++) {
          filter += (filter !== '' ? '|' : '') + accept[i].title + " | *." + accept[i].extensions.replace(/,/g, ';*.');
        }
        return filter;
      }

      var FileInput = {
        init: function (options) {
          var comp = this,
              I = this.getRuntime();

          this.bind("Change", function () {
            var files = I.shimExec.call(comp, 'FileInput', 'getFiles');
            comp.files = [];
            Basic.each(files, function (file) {
              comp.files.push(new File(I.uid, file));
            });
          }, 999);

          I.shimExec.call(this, 'FileInput', 'init', toFilters(options.accept), options.multiple);
          this.trigger('ready');
        },

        setOption: function (name, value) {
          if (name == 'accept') {
            value = toFilters(value);
          }
          this.getRuntime().shimExec.call(this, 'FileInput', 'setOption', name, value);
        }
      };

      return extensions.FileInput = FileInput;
    });

    // Included from: src/javascript/runtime/silverlight/file/FileDrop.js

    /**
     * FileDrop.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/silverlight/file/FileDrop
    @private
    */
    define("moxie/runtime/silverlight/file/FileDrop", ["moxie/runtime/silverlight/Runtime", "moxie/core/utils/Dom", "moxie/core/utils/Events"], function (extensions, Dom, Events) {

      // not exactly useful, since works only in safari (...crickets...)
      var FileDrop = {
        init: function () {
          var comp = this,
              self = comp.getRuntime(),
              dropZone;

          dropZone = self.getShimContainer();

          Events.addEvent(dropZone, 'dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'copy';
          }, comp.uid);

          Events.addEvent(dropZone, 'dragenter', function (e) {
            e.preventDefault();
            var flag = Dom.get(self.uid).dragEnter(e);
            // If handled, then stop propagation of event in DOM
            if (flag) {
              e.stopPropagation();
            }
          }, comp.uid);

          Events.addEvent(dropZone, 'drop', function (e) {
            e.preventDefault();
            var flag = Dom.get(self.uid).dragDrop(e);
            // If handled, then stop propagation of event in DOM
            if (flag) {
              e.stopPropagation();
            }
          }, comp.uid);

          return self.shimExec.call(this, 'FileDrop', 'init');
        }
      };

      return extensions.FileDrop = FileDrop;
    });

    // Included from: src/javascript/runtime/silverlight/file/FileReader.js

    /**
     * FileReader.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/silverlight/file/FileReader
    @private
    */
    define("moxie/runtime/silverlight/file/FileReader", ["moxie/runtime/silverlight/Runtime", "moxie/core/utils/Basic", "moxie/runtime/flash/file/FileReader"], function (extensions, Basic, FileReader) {
      return extensions.FileReader = Basic.extend({}, FileReader);
    });

    // Included from: src/javascript/runtime/silverlight/file/FileReaderSync.js

    /**
     * FileReaderSync.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/silverlight/file/FileReaderSync
    @private
    */
    define("moxie/runtime/silverlight/file/FileReaderSync", ["moxie/runtime/silverlight/Runtime", "moxie/core/utils/Basic", "moxie/runtime/flash/file/FileReaderSync"], function (extensions, Basic, FileReaderSync) {
      return extensions.FileReaderSync = Basic.extend({}, FileReaderSync);
    });

    // Included from: src/javascript/runtime/silverlight/runtime/Transporter.js

    /**
     * Transporter.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/silverlight/runtime/Transporter
    @private
    */
    define("moxie/runtime/silverlight/runtime/Transporter", ["moxie/runtime/silverlight/Runtime", "moxie/core/utils/Basic", "moxie/runtime/flash/runtime/Transporter"], function (extensions, Basic, Transporter) {
      return extensions.Transporter = Basic.extend({}, Transporter);
    });

    // Included from: src/javascript/runtime/silverlight/xhr/XMLHttpRequest.js

    /**
     * XMLHttpRequest.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/silverlight/xhr/XMLHttpRequest
    @private
    */
    define("moxie/runtime/silverlight/xhr/XMLHttpRequest", ["moxie/runtime/silverlight/Runtime", "moxie/core/utils/Basic", "moxie/runtime/flash/xhr/XMLHttpRequest", "moxie/runtime/silverlight/file/FileReaderSync", "moxie/runtime/silverlight/runtime/Transporter"], function (extensions, Basic, XMLHttpRequest, FileReaderSyncSilverlight, TransporterSilverlight) {
      return extensions.XMLHttpRequest = Basic.extend({}, XMLHttpRequest);
    });

    // Included from: src/javascript/runtime/silverlight/image/Image.js

    /**
     * Image.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/silverlight/image/Image
    @private
    */
    define("moxie/runtime/silverlight/image/Image", ["moxie/runtime/silverlight/Runtime", "moxie/core/utils/Basic", "moxie/file/Blob", "moxie/runtime/flash/image/Image"], function (extensions, Basic, Blob, Image) {
      return extensions.Image = Basic.extend({}, Image, {

        getInfo: function () {
          var self = this.getRuntime(),
              grps = ['tiff', 'exif', 'gps', 'thumb'],
              info = { meta: {} },
              rawInfo = self.shimExec.call(this, 'Image', 'getInfo');

          if (rawInfo.meta) {
            Basic.each(grps, function (grp) {
              var meta = rawInfo.meta[grp],
                  tag,
                  i,
                  length,
                  value;
              if (meta && meta.keys) {
                info.meta[grp] = {};
                for (i = 0, length = meta.keys.length; i < length; i++) {
                  tag = meta.keys[i];
                  value = meta[tag];
                  if (value) {
                    // convert numbers
                    if (/^(\d|[1-9]\d+)$/.test(value)) {
                      // integer (make sure doesn't start with zero)
                      value = parseInt(value, 10);
                    } else if (/^\d*\.\d+$/.test(value)) {
                      // double
                      value = parseFloat(value);
                    }
                    info.meta[grp][tag] = value;
                  }
                }
              }
            });

            // save thumb data as blob
            if (info.meta && info.meta.thumb && info.meta.thumb.data && !(self.meta.thumb.data instanceof Blob)) {
              info.meta.thumb.data = new Blob(self.uid, info.meta.thumb.data);
            }
          }

          info.width = parseInt(rawInfo.width, 10);
          info.height = parseInt(rawInfo.height, 10);
          info.size = parseInt(rawInfo.size, 10);
          info.type = rawInfo.type;
          info.name = rawInfo.name;

          return info;
        },

        resize: function (rect, ratio, opts) {
          this.getRuntime().shimExec.call(this, 'Image', 'resize', rect.x, rect.y, rect.width, rect.height, ratio, opts.preserveHeaders, opts.resample);
        }
      });
    });

    // Included from: src/javascript/runtime/html4/Runtime.js

    /**
     * Runtime.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /*global File:true */

    /**
    Defines constructor for HTML4 runtime.
    
    @class moxie/runtime/html4/Runtime
    @private
    */
    define("moxie/runtime/html4/Runtime", ["moxie/core/utils/Basic", "moxie/core/Exceptions", "moxie/runtime/Runtime", "moxie/core/utils/Env"], function (Basic, x, Runtime, Env) {

      var type = 'html4',
          extensions = {};

      function Html4Runtime(options) {
        var I = this,
            Test = Runtime.capTest,
            True = Runtime.capTrue;

        Runtime.call(this, options, type, {
          access_binary: Test(window.FileReader || window.File && File.getAsDataURL),
          access_image_binary: false,
          display_media: Test((Env.can('create_canvas') || Env.can('use_data_uri_over32kb')) && defined('moxie/image/Image')),
          do_cors: false,
          drag_and_drop: false,
          filter_by_extension: Test(function () {
            // if you know how to feature-detect this, please suggest
            return !(Env.browser === 'Chrome' && Env.verComp(Env.version, 28, '<') || Env.browser === 'IE' && Env.verComp(Env.version, 10, '<') || Env.browser === 'Safari' && Env.verComp(Env.version, 7, '<') || Env.browser === 'Firefox' && Env.verComp(Env.version, 37, '<'));
          }()),
          resize_image: function () {
            return extensions.Image && I.can('access_binary') && Env.can('create_canvas');
          },
          report_upload_progress: false,
          return_response_headers: false,
          return_response_type: function (responseType) {
            if (responseType === 'json' && !!window.JSON) {
              return true;
            }
            return !!~Basic.inArray(responseType, ['text', 'document', '']);
          },
          return_status_code: function (code) {
            return !Basic.arrayDiff(code, [200, 404]);
          },
          select_file: function () {
            return Env.can('use_fileinput');
          },
          select_multiple: false,
          send_binary_string: false,
          send_custom_headers: false,
          send_multipart: true,
          slice_blob: false,
          stream_upload: function () {
            return I.can('select_file');
          },
          summon_file_dialog: function () {
            // yeah... some dirty sniffing here...
            return I.can('select_file') && (Env.browser === 'Firefox' && Env.verComp(Env.version, 4, '>=') || Env.browser === 'Opera' && Env.verComp(Env.version, 12, '>=') || Env.browser === 'IE' && Env.verComp(Env.version, 10, '>=') || !!~Basic.inArray(Env.browser, ['Chrome', 'Safari']));
          },
          upload_filesize: True,
          use_http_method: function (methods) {
            return !Basic.arrayDiff(methods, ['GET', 'POST']);
          }
        });

        Basic.extend(this, {
          init: function () {
            this.trigger("Init");
          },

          destroy: function (destroy) {
            // extend default destroy method
            return function () {
              destroy.call(I);
              destroy = I = null;
            };
          }(this.destroy)
        });

        Basic.extend(this.getShim(), extensions);
      }

      Runtime.addConstructor(type, Html4Runtime);

      return extensions;
    });

    // Included from: src/javascript/runtime/html4/file/FileInput.js

    /**
     * FileInput.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/html4/file/FileInput
    @private
    */
    define("moxie/runtime/html4/file/FileInput", ["moxie/runtime/html4/Runtime", "moxie/file/File", "moxie/core/utils/Basic", "moxie/core/utils/Dom", "moxie/core/utils/Events", "moxie/core/utils/Mime", "moxie/core/utils/Env"], function (extensions, File, Basic, Dom, Events, Mime, Env) {

      function FileInput() {
        var _uid,
            _mimes = [],
            _options,
            _browseBtnZIndex; // save original z-index;

        function addInput() {
          var comp = this,
              I = comp.getRuntime(),
              shimContainer,
              browseButton,
              currForm,
              form,
              input,
              uid;

          uid = Basic.guid('uid_');

          shimContainer = I.getShimContainer(); // we get new ref every time to avoid memory leaks in IE

          if (_uid) {
            // move previous form out of the view
            currForm = Dom.get(_uid + '_form');
            if (currForm) {
              Basic.extend(currForm.style, { top: '100%' });
            }
          }

          // build form in DOM, since innerHTML version not able to submit file for some reason
          form = document.createElement('form');
          form.setAttribute('id', uid + '_form');
          form.setAttribute('method', 'post');
          form.setAttribute('enctype', 'multipart/form-data');
          form.setAttribute('encoding', 'multipart/form-data');

          Basic.extend(form.style, {
            overflow: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          });

          input = document.createElement('input');
          input.setAttribute('id', uid);
          input.setAttribute('type', 'file');
          input.setAttribute('accept', _mimes.join(','));

          Basic.extend(input.style, {
            fontSize: '999px',
            opacity: 0
          });

          form.appendChild(input);
          shimContainer.appendChild(form);

          // prepare file input to be placed underneath the browse_button element
          Basic.extend(input.style, {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          });

          if (Env.browser === 'IE' && Env.verComp(Env.version, 10, '<')) {
            Basic.extend(input.style, {
              filter: "progid:DXImageTransform.Microsoft.Alpha(opacity=0)"
            });
          }

          input.onchange = function () {
            // there should be only one handler for this
            var file;

            if (!this.value) {
              return;
            }

            if (this.files) {
              // check if browser is fresh enough
              file = this.files[0];

              // ignore empty files (IE10 for example hangs if you try to send them via XHR)
              if (file.size === 0) {
                form.parentNode.removeChild(form);
                return;
              }
            } else {
              file = {
                name: this.value
              };
            }

            file = new File(I.uid, file);

            // clear event handler
            this.onchange = function () {};
            addInput.call(comp);

            comp.files = [file];

            // substitute all ids with file uids (consider file.uid read-only - we cannot do it the other way around)
            input.setAttribute('id', file.uid);
            form.setAttribute('id', file.uid + '_form');

            comp.trigger('change');

            input = form = null;
          };

          // route click event to the input
          if (I.can('summon_file_dialog')) {
            browseButton = Dom.get(_options.browse_button);
            Events.removeEvent(browseButton, 'click', comp.uid);
            Events.addEvent(browseButton, 'click', function (e) {
              if (input && !input.disabled) {
                // for some reason FF (up to 8.0.1 so far) lets to click disabled input[type=file]
                input.click();
              }
              e.preventDefault();
            }, comp.uid);
          }

          _uid = uid;

          shimContainer = currForm = browseButton = null;
        }

        Basic.extend(this, {
          init: function (options) {
            var comp = this,
                I = comp.getRuntime(),
                shimContainer;

            // figure out accept string
            _options = options;
            _mimes = options.accept.mimes || Mime.extList2mimes(options.accept, I.can('filter_by_extension'));

            shimContainer = I.getShimContainer();

            (function () {
              var browseButton, zIndex, top;

              browseButton = Dom.get(options.browse_button);
              _browseBtnZIndex = Dom.getStyle(browseButton, 'z-index') || 'auto';

              // Route click event to the input[type=file] element for browsers that support such behavior
              if (I.can('summon_file_dialog')) {
                if (Dom.getStyle(browseButton, 'position') === 'static') {
                  browseButton.style.position = 'relative';
                }

                comp.bind('Refresh', function () {
                  zIndex = parseInt(_browseBtnZIndex, 10) || 1;

                  Dom.get(_options.browse_button).style.zIndex = zIndex;
                  this.getRuntime().getShimContainer().style.zIndex = zIndex - 1;
                });
              }

              /* Since we have to place input[type=file] on top of the browse_button for some browsers,
              browse_button loses interactivity, so we restore it here */
              top = I.can('summon_file_dialog') ? browseButton : shimContainer;

              Events.addEvent(top, 'mouseover', function () {
                comp.trigger('mouseenter');
              }, comp.uid);

              Events.addEvent(top, 'mouseout', function () {
                comp.trigger('mouseleave');
              }, comp.uid);

              Events.addEvent(top, 'mousedown', function () {
                comp.trigger('mousedown');
              }, comp.uid);

              Events.addEvent(Dom.get(options.container), 'mouseup', function () {
                comp.trigger('mouseup');
              }, comp.uid);

              browseButton = null;
            })();

            addInput.call(this);

            shimContainer = null;

            // trigger ready event asynchronously
            comp.trigger({
              type: 'ready',
              async: true
            });
          },

          setOption: function (name, value) {
            var I = this.getRuntime();
            var input;

            if (name == 'accept') {
              _mimes = value.mimes || Mime.extList2mimes(value, I.can('filter_by_extension'));
            }

            // update current input
            input = Dom.get(_uid);
            if (input) {
              input.setAttribute('accept', _mimes.join(','));
            }
          },

          disable: function (state) {
            var input;

            if (input = Dom.get(_uid)) {
              input.disabled = !!state;
            }
          },

          destroy: function () {
            var I = this.getRuntime(),
                shim = I.getShim(),
                shimContainer = I.getShimContainer(),
                container = _options && Dom.get(_options.container),
                browseButton = _options && Dom.get(_options.browse_button);

            if (container) {
              Events.removeAllEvents(container, this.uid);
            }

            if (browseButton) {
              Events.removeAllEvents(browseButton, this.uid);
              browseButton.style.zIndex = _browseBtnZIndex; // reset to original value
            }

            if (shimContainer) {
              Events.removeAllEvents(shimContainer, this.uid);
              shimContainer.innerHTML = '';
            }

            shim.removeInstance(this.uid);

            _uid = _mimes = _options = shimContainer = container = browseButton = shim = null;
          }
        });
      }

      return extensions.FileInput = FileInput;
    });

    // Included from: src/javascript/runtime/html4/file/FileReader.js

    /**
     * FileReader.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/html4/file/FileReader
    @private
    */
    define("moxie/runtime/html4/file/FileReader", ["moxie/runtime/html4/Runtime", "moxie/runtime/html5/file/FileReader"], function (extensions, FileReader) {
      return extensions.FileReader = FileReader;
    });

    // Included from: src/javascript/runtime/html4/xhr/XMLHttpRequest.js

    /**
     * XMLHttpRequest.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/html4/xhr/XMLHttpRequest
    @private
    */
    define("moxie/runtime/html4/xhr/XMLHttpRequest", ["moxie/runtime/html4/Runtime", "moxie/core/utils/Basic", "moxie/core/utils/Dom", "moxie/core/utils/Url", "moxie/core/Exceptions", "moxie/core/utils/Events", "moxie/file/Blob", "moxie/xhr/FormData"], function (extensions, Basic, Dom, Url, x, Events, Blob, FormData) {

      function XMLHttpRequest() {
        var _status, _response, _iframe;

        function cleanup(cb) {
          var target = this,
              uid,
              form,
              inputs,
              i,
              hasFile = false;

          if (!_iframe) {
            return;
          }

          uid = _iframe.id.replace(/_iframe$/, '');

          form = Dom.get(uid + '_form');
          if (form) {
            inputs = form.getElementsByTagName('input');
            i = inputs.length;

            while (i--) {
              switch (inputs[i].getAttribute('type')) {
                case 'hidden':
                  inputs[i].parentNode.removeChild(inputs[i]);
                  break;
                case 'file':
                  hasFile = true; // flag the case for later
                  break;
              }
            }
            inputs = [];

            if (!hasFile) {
              // we need to keep the form for sake of possible retries
              form.parentNode.removeChild(form);
            }
            form = null;
          }

          // without timeout, request is marked as canceled (in console)
          setTimeout(function () {
            Events.removeEvent(_iframe, 'load', target.uid);
            if (_iframe.parentNode) {
              // #382
              _iframe.parentNode.removeChild(_iframe);
            }

            // check if shim container has any other children, if - not, remove it as well
            var shimContainer = target.getRuntime().getShimContainer();
            if (!shimContainer.children.length) {
              shimContainer.parentNode.removeChild(shimContainer);
            }

            shimContainer = _iframe = null;
            cb();
          }, 1);
        }

        Basic.extend(this, {
          send: function (meta, data) {
            var target = this,
                I = target.getRuntime(),
                uid,
                form,
                input,
                blob;

            _status = _response = null;

            function createIframe() {
              var container = I.getShimContainer() || document.body,
                  temp = document.createElement('div');

              // IE 6 won't be able to set the name using setAttribute or iframe.name
              temp.innerHTML = '<iframe id="' + uid + '_iframe" name="' + uid + '_iframe" src="javascript:&quot;&quot;" style="display:none"></iframe>';
              _iframe = temp.firstChild;
              container.appendChild(_iframe);

              /* _iframe.onreadystatechange = function() {
                console.info(_iframe.readyState);
              };*/

              Events.addEvent(_iframe, 'load', function () {
                // _iframe.onload doesn't work in IE lte 8
                var el;

                try {
                  el = _iframe.contentWindow.document || _iframe.contentDocument || window.frames[_iframe.id].document;

                  // try to detect some standard error pages
                  if (/^4(0[0-9]|1[0-7]|2[2346])\s/.test(el.title)) {
                    // test if title starts with 4xx HTTP error
                    _status = el.title.replace(/^(\d+).*$/, '$1');
                  } else {
                    _status = 200;
                    // get result
                    _response = Basic.trim(el.body.innerHTML);

                    // we need to fire these at least once
                    target.trigger({
                      type: 'progress',
                      loaded: _response.length,
                      total: _response.length
                    });

                    if (blob) {
                      // if we were uploading a file
                      target.trigger({
                        type: 'uploadprogress',
                        loaded: blob.size || 1025,
                        total: blob.size || 1025
                      });
                    }
                  }
                } catch (ex) {
                  if (Url.hasSameOrigin(meta.url)) {
                    // if response is sent with error code, iframe in IE gets redirected to res://ieframe.dll/http_x.htm
                    // which obviously results to cross domain error (wtf?)
                    _status = 404;
                  } else {
                    cleanup.call(target, function () {
                      target.trigger('error');
                    });
                    return;
                  }
                }

                cleanup.call(target, function () {
                  target.trigger('load');
                });
              }, target.uid);
            } // end createIframe

            // prepare data to be sent and convert if required
            if (data instanceof FormData && data.hasBlob()) {
              blob = data.getBlob();
              uid = blob.uid;
              input = Dom.get(uid);
              form = Dom.get(uid + '_form');
              if (!form) {
                throw new x.DOMException(x.DOMException.NOT_FOUND_ERR);
              }
            } else {
              uid = Basic.guid('uid_');

              form = document.createElement('form');
              form.setAttribute('id', uid + '_form');
              form.setAttribute('method', meta.method);
              form.setAttribute('enctype', 'multipart/form-data');
              form.setAttribute('encoding', 'multipart/form-data');

              I.getShimContainer().appendChild(form);
            }

            // set upload target
            form.setAttribute('target', uid + '_iframe');

            if (data instanceof FormData) {
              data.each(function (value, name) {
                if (value instanceof Blob) {
                  if (input) {
                    input.setAttribute('name', name);
                  }
                } else {
                  var hidden = document.createElement('input');

                  Basic.extend(hidden, {
                    type: 'hidden',
                    name: name,
                    value: value
                  });

                  // make sure that input[type="file"], if it's there, comes last
                  if (input) {
                    form.insertBefore(hidden, input);
                  } else {
                    form.appendChild(hidden);
                  }
                }
              });
            }

            // set destination url
            form.setAttribute("action", meta.url);

            createIframe();
            form.submit();
            target.trigger('loadstart');
          },

          getStatus: function () {
            return _status;
          },

          getResponse: function (responseType) {
            if ('json' === responseType) {
              // strip off <pre>..</pre> tags that might be enclosing the response
              if (Basic.typeOf(_response) === 'string' && !!window.JSON) {
                try {
                  return JSON.parse(_response.replace(/^\s*<pre[^>]*>/, '').replace(/<\/pre>\s*$/, ''));
                } catch (ex) {
                  return null;
                }
              }
            } else if ('document' === responseType) {}
            return _response;
          },

          abort: function () {
            var target = this;

            if (_iframe && _iframe.contentWindow) {
              if (_iframe.contentWindow.stop) {
                // FireFox/Safari/Chrome
                _iframe.contentWindow.stop();
              } else if (_iframe.contentWindow.document.execCommand) {
                // IE
                _iframe.contentWindow.document.execCommand('Stop');
              } else {
                _iframe.src = "about:blank";
              }
            }

            cleanup.call(this, function () {
              // target.dispatchEvent('readystatechange');
              target.dispatchEvent('abort');
            });
          }
        });
      }

      return extensions.XMLHttpRequest = XMLHttpRequest;
    });

    // Included from: src/javascript/runtime/html4/image/Image.js

    /**
     * Image.js
     *
     * Copyright 2013, Moxiecode Systems AB
     * Released under GPL License.
     *
     * License: http://www.plupload.com/license
     * Contributing: http://www.plupload.com/contributing
     */

    /**
    @class moxie/runtime/html4/image/Image
    @private
    */
    define("moxie/runtime/html4/image/Image", ["moxie/runtime/html4/Runtime", "moxie/runtime/html5/image/Image"], function (extensions, Image) {
      return extensions.Image = Image;
    });

    expose(["moxie/core/utils/Basic", "moxie/core/utils/Encode", "moxie/core/utils/Env", "moxie/core/Exceptions", "moxie/core/utils/Dom", "moxie/core/EventTarget", "moxie/runtime/Runtime", "moxie/runtime/RuntimeClient", "moxie/file/Blob", "moxie/core/I18n", "moxie/core/utils/Mime", "moxie/file/FileInput", "moxie/file/File", "moxie/file/FileDrop", "moxie/file/FileReader", "moxie/core/utils/Url", "moxie/runtime/RuntimeTarget", "moxie/xhr/FormData", "moxie/xhr/XMLHttpRequest", "moxie/runtime/Transporter", "moxie/image/Image", "moxie/core/utils/Events", "moxie/runtime/html5/image/ResizerCanvas"]);
  })(this);
});
});

var plupload$1 = createCommonjsModule(function (module) {
/**
 * Plupload - multi-runtime File Uploader
 * v2.3.1
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 *
 * Date: 2017-02-06
 */
(function (global, factory) {
  var extract = function () {
    var ctx = {};
    factory.apply(ctx, arguments);
    return ctx.plupload;
  };

  if (typeof undefined === "function" && undefined.amd) {
    undefined("plupload", ['./moxie'], extract);
  } else if ('object' === "object" && module.exports) {
    module.exports = extract(moxie$1);
  } else {
    global.plupload = extract(global.moxie);
  }
})(commonjsGlobal || window, function (moxie) {
  /**
   * Plupload.js
   *
   * Copyright 2013, Moxiecode Systems AB
   * Released under GPL License.
   *
   * License: http://www.plupload.com/license
   * Contributing: http://www.plupload.com/contributing
   */

  (function (exports, o, undef) {

    var delay = window.setTimeout;
    var fileFilters = {};
    var u = o.core.utils;
    var Runtime = o.runtime.Runtime;

    // convert plupload features to caps acceptable by mOxie
    function normalizeCaps(settings) {
      var features = settings.required_features,
          caps = {};

      function resolve(feature, value, strict) {
        // Feature notation is deprecated, use caps (this thing here is required for backward compatibility)
        var map = {
          chunks: 'slice_blob',
          jpgresize: 'send_binary_string',
          pngresize: 'send_binary_string',
          progress: 'report_upload_progress',
          multi_selection: 'select_multiple',
          dragdrop: 'drag_and_drop',
          drop_element: 'drag_and_drop',
          headers: 'send_custom_headers',
          urlstream_upload: 'send_binary_string',
          canSendBinary: 'send_binary',
          triggerDialog: 'summon_file_dialog'
        };

        if (map[feature]) {
          caps[map[feature]] = value;
        } else if (!strict) {
          caps[feature] = value;
        }
      }

      if (typeof features === 'string') {
        plupload.each(features.split(/\s*,\s*/), function (feature) {
          resolve(feature, true);
        });
      } else if (typeof features === 'object') {
        plupload.each(features, function (value, feature) {
          resolve(feature, value);
        });
      } else if (features === true) {
        // check settings for required features
        if (settings.chunk_size && settings.chunk_size > 0) {
          caps.slice_blob = true;
        }

        if (!plupload.isEmptyObj(settings.resize) || settings.multipart === false) {
          caps.send_binary_string = true;
        }

        if (settings.http_method) {
          caps.use_http_method = settings.http_method;
        }

        plupload.each(settings, function (value, feature) {
          resolve(feature, !!value, true); // strict check
        });
      }

      return caps;
    }

    /**
     * @module plupload
     * @static
     */
    var plupload = {
      /**
       * Plupload version will be replaced on build.
       *
       * @property VERSION
       * @for Plupload
       * @static
       * @final
       */
      VERSION: '2.3.1',

      /**
       * The state of the queue before it has started and after it has finished
       *
       * @property STOPPED
       * @static
       * @final
       */
      STOPPED: 1,

      /**
       * Upload process is running
       *
       * @property STARTED
       * @static
       * @final
       */
      STARTED: 2,

      /**
       * File is queued for upload
       *
       * @property QUEUED
       * @static
       * @final
       */
      QUEUED: 1,

      /**
       * File is being uploaded
       *
       * @property UPLOADING
       * @static
       * @final
       */
      UPLOADING: 2,

      /**
       * File has failed to be uploaded
       *
       * @property FAILED
       * @static
       * @final
       */
      FAILED: 4,

      /**
       * File has been uploaded successfully
       *
       * @property DONE
       * @static
       * @final
       */
      DONE: 5,

      // Error constants used by the Error event

      /**
       * Generic error for example if an exception is thrown inside Silverlight.
       *
       * @property GENERIC_ERROR
       * @static
       * @final
       */
      GENERIC_ERROR: -100,

      /**
       * HTTP transport error. For example if the server produces a HTTP status other than 200.
       *
       * @property HTTP_ERROR
       * @static
       * @final
       */
      HTTP_ERROR: -200,

      /**
       * Generic I/O error. For example if it wasn't possible to open the file stream on local machine.
       *
       * @property IO_ERROR
       * @static
       * @final
       */
      IO_ERROR: -300,

      /**
       * @property SECURITY_ERROR
       * @static
       * @final
       */
      SECURITY_ERROR: -400,

      /**
       * Initialization error. Will be triggered if no runtime was initialized.
       *
       * @property INIT_ERROR
       * @static
       * @final
       */
      INIT_ERROR: -500,

      /**
       * File size error. If the user selects a file that is too large it will be blocked and an error of this type will be triggered.
       *
       * @property FILE_SIZE_ERROR
       * @static
       * @final
       */
      FILE_SIZE_ERROR: -600,

      /**
       * File extension error. If the user selects a file that isn't valid according to the filters setting.
       *
       * @property FILE_EXTENSION_ERROR
       * @static
       * @final
       */
      FILE_EXTENSION_ERROR: -601,

      /**
       * Duplicate file error. If prevent_duplicates is set to true and user selects the same file again.
       *
       * @property FILE_DUPLICATE_ERROR
       * @static
       * @final
       */
      FILE_DUPLICATE_ERROR: -602,

      /**
       * Runtime will try to detect if image is proper one. Otherwise will throw this error.
       *
       * @property IMAGE_FORMAT_ERROR
       * @static
       * @final
       */
      IMAGE_FORMAT_ERROR: -700,

      /**
       * While working on files runtime may run out of memory and will throw this error.
       *
       * @since 2.1.2
       * @property MEMORY_ERROR
       * @static
       * @final
       */
      MEMORY_ERROR: -701,

      /**
       * Each runtime has an upper limit on a dimension of the image it can handle. If bigger, will throw this error.
       *
       * @property IMAGE_DIMENSIONS_ERROR
       * @static
       * @final
       */
      IMAGE_DIMENSIONS_ERROR: -702,

      /**
       * Mime type lookup table.
       *
       * @property mimeTypes
       * @type Object
       * @final
       */
      mimeTypes: u.Mime.mimes,

      /**
       * In some cases sniffing is the only way around :(
       */
      ua: u.Env,

      /**
       * Gets the true type of the built-in object (better version of typeof).
       * @credits Angus Croll (http://javascriptweblog.wordpress.com/)
       *
       * @method typeOf
       * @static
       * @param {Object} o Object to check.
       * @return {String} Object [[Class]]
       */
      typeOf: u.Basic.typeOf,

      /**
       * Extends the specified object with another object.
       *
       * @method extend
       * @static
       * @param {Object} target Object to extend.
       * @param {Object..} obj Multiple objects to extend with.
       * @return {Object} Same as target, the extended object.
       */
      extend: u.Basic.extend,

      /**
       * Generates an unique ID. This is 99.99% unique since it takes the current time and 5 random numbers.
       * The only way a user would be able to get the same ID is if the two persons at the same exact millisecond manages
       * to get 5 the same random numbers between 0-65535 it also uses a counter so each call will be guaranteed to be page unique.
       * It's more probable for the earth to be hit with an asteriod. You can also if you want to be 100% sure set the plupload.guidPrefix property
       * to an user unique key.
       *
       * @method guid
       * @static
       * @return {String} Virtually unique id.
       */
      guid: u.Basic.guid,

      /**
       * Get array of DOM Elements by their ids.
       *
       * @method get
       * @param {String} id Identifier of the DOM Element
       * @return {Array}
      */
      getAll: function get(ids) {
        var els = [],
            el;

        if (plupload.typeOf(ids) !== 'array') {
          ids = [ids];
        }

        var i = ids.length;
        while (i--) {
          el = plupload.get(ids[i]);
          if (el) {
            els.push(el);
          }
        }

        return els.length ? els : null;
      },

      /**
      Get DOM element by id
        @method get
      @param {String} id Identifier of the DOM Element
      @return {Node}
      */
      get: u.Dom.get,

      /**
       * Executes the callback function for each item in array/object. If you return false in the
       * callback it will break the loop.
       *
       * @method each
       * @static
       * @param {Object} obj Object to iterate.
       * @param {function} callback Callback function to execute for each item.
       */
      each: u.Basic.each,

      /**
       * Returns the absolute x, y position of an Element. The position will be returned in a object with x, y fields.
       *
       * @method getPos
       * @static
       * @param {Element} node HTML element or element id to get x, y position from.
       * @param {Element} root Optional root element to stop calculations at.
       * @return {object} Absolute position of the specified element object with x, y fields.
       */
      getPos: u.Dom.getPos,

      /**
       * Returns the size of the specified node in pixels.
       *
       * @method getSize
       * @static
       * @param {Node} node Node to get the size of.
       * @return {Object} Object with a w and h property.
       */
      getSize: u.Dom.getSize,

      /**
       * Encodes the specified string.
       *
       * @method xmlEncode
       * @static
       * @param {String} s String to encode.
       * @return {String} Encoded string.
       */
      xmlEncode: function (str) {
        var xmlEncodeChars = { '<': 'lt', '>': 'gt', '&': 'amp', '"': 'quot', '\'': '#39' },
            xmlEncodeRegExp = /[<>&\"\']/g;

        return str ? ('' + str).replace(xmlEncodeRegExp, function (chr) {
          return xmlEncodeChars[chr] ? '&' + xmlEncodeChars[chr] + ';' : chr;
        }) : str;
      },

      /**
       * Forces anything into an array.
       *
       * @method toArray
       * @static
       * @param {Object} obj Object with length field.
       * @return {Array} Array object containing all items.
       */
      toArray: u.Basic.toArray,

      /**
       * Find an element in array and return its index if present, otherwise return -1.
       *
       * @method inArray
       * @static
       * @param {mixed} needle Element to find
       * @param {Array} array
       * @return {Int} Index of the element, or -1 if not found
       */
      inArray: u.Basic.inArray,

      /**
      Recieve an array of functions (usually async) to call in sequence, each  function
      receives a callback as first argument that it should call, when it completes. Finally,
      after everything is complete, main callback is called. Passing truthy value to the
      callback as a first argument will interrupt the sequence and invoke main callback
      immediately.
        @method inSeries
      @static
      @param {Array} queue Array of functions to call in sequence
      @param {Function} cb Main callback that is called in the end, or in case of error
      */
      inSeries: u.Basic.inSeries,

      /**
       * Extends the language pack object with new items.
       *
       * @method addI18n
       * @static
       * @param {Object} pack Language pack items to add.
       * @return {Object} Extended language pack object.
       */
      addI18n: o.core.I18n.addI18n,

      /**
       * Translates the specified string by checking for the english string in the language pack lookup.
       *
       * @method translate
       * @static
       * @param {String} str String to look for.
       * @return {String} Translated string or the input string if it wasn't found.
       */
      translate: o.core.I18n.translate,

      /**
       * Pseudo sprintf implementation - simple way to replace tokens with specified values.
       *
       * @param {String} str String with tokens
       * @return {String} String with replaced tokens
       */
      sprintf: u.Basic.sprintf,

      /**
       * Checks if object is empty.
       *
       * @method isEmptyObj
       * @static
       * @param {Object} obj Object to check.
       * @return {Boolean}
       */
      isEmptyObj: u.Basic.isEmptyObj,

      /**
       * Checks if specified DOM element has specified class.
       *
       * @method hasClass
       * @static
       * @param {Object} obj DOM element like object to add handler to.
       * @param {String} name Class name
       */
      hasClass: u.Dom.hasClass,

      /**
       * Adds specified className to specified DOM element.
       *
       * @method addClass
       * @static
       * @param {Object} obj DOM element like object to add handler to.
       * @param {String} name Class name
       */
      addClass: u.Dom.addClass,

      /**
       * Removes specified className from specified DOM element.
       *
       * @method removeClass
       * @static
       * @param {Object} obj DOM element like object to add handler to.
       * @param {String} name Class name
       */
      removeClass: u.Dom.removeClass,

      /**
       * Returns a given computed style of a DOM element.
       *
       * @method getStyle
       * @static
       * @param {Object} obj DOM element like object.
       * @param {String} name Style you want to get from the DOM element
       */
      getStyle: u.Dom.getStyle,

      /**
       * Adds an event handler to the specified object and store reference to the handler
       * in objects internal Plupload registry (@see removeEvent).
       *
       * @method addEvent
       * @static
       * @param {Object} obj DOM element like object to add handler to.
       * @param {String} name Name to add event listener to.
       * @param {Function} callback Function to call when event occurs.
       * @param {String} (optional) key that might be used to add specifity to the event record.
       */
      addEvent: u.Events.addEvent,

      /**
       * Remove event handler from the specified object. If third argument (callback)
       * is not specified remove all events with the specified name.
       *
       * @method removeEvent
       * @static
       * @param {Object} obj DOM element to remove event listener(s) from.
       * @param {String} name Name of event listener to remove.
       * @param {Function|String} (optional) might be a callback or unique key to match.
       */
      removeEvent: u.Events.removeEvent,

      /**
       * Remove all kind of events from the specified object
       *
       * @method removeAllEvents
       * @static
       * @param {Object} obj DOM element to remove event listeners from.
       * @param {String} (optional) unique key to match, when removing events.
       */
      removeAllEvents: u.Events.removeAllEvents,

      /**
       * Cleans the specified name from national characters (diacritics). The result will be a name with only a-z, 0-9 and _.
       *
       * @method cleanName
       * @static
       * @param {String} s String to clean up.
       * @return {String} Cleaned string.
       */
      cleanName: function (name) {
        var i, lookup;

        // Replace diacritics
        lookup = [/[\300-\306]/g, 'A', /[\340-\346]/g, 'a', /\307/g, 'C', /\347/g, 'c', /[\310-\313]/g, 'E', /[\350-\353]/g, 'e', /[\314-\317]/g, 'I', /[\354-\357]/g, 'i', /\321/g, 'N', /\361/g, 'n', /[\322-\330]/g, 'O', /[\362-\370]/g, 'o', /[\331-\334]/g, 'U', /[\371-\374]/g, 'u'];

        for (i = 0; i < lookup.length; i += 2) {
          name = name.replace(lookup[i], lookup[i + 1]);
        }

        // Replace whitespace
        name = name.replace(/\s+/g, '_');

        // Remove anything else
        name = name.replace(/[^a-z0-9_\-\.]+/gi, '');

        return name;
      },

      /**
       * Builds a full url out of a base URL and an object with items to append as query string items.
       *
       * @method buildUrl
       * @static
       * @param {String} url Base URL to append query string items to.
       * @param {Object} items Name/value object to serialize as a querystring.
       * @return {String} String with url + serialized query string items.
       */
      buildUrl: function (url, items) {
        var query = '';

        plupload.each(items, function (value, name) {
          query += (query ? '&' : '') + encodeURIComponent(name) + '=' + encodeURIComponent(value);
        });

        if (query) {
          url += (url.indexOf('?') > 0 ? '&' : '?') + query;
        }

        return url;
      },

      /**
       * Formats the specified number as a size string for example 1024 becomes 1 KB.
       *
       * @method formatSize
       * @static
       * @param {Number} size Size to format as string.
       * @return {String} Formatted size string.
       */
      formatSize: function (size) {

        if (size === undef || /\D/.test(size)) {
          return plupload.translate('N/A');
        }

        function round(num, precision) {
          return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
        }

        var boundary = Math.pow(1024, 4);

        // TB
        if (size > boundary) {
          return round(size / boundary, 1) + " " + plupload.translate('tb');
        }

        // GB
        if (size > (boundary /= 1024)) {
          return round(size / boundary, 1) + " " + plupload.translate('gb');
        }

        // MB
        if (size > (boundary /= 1024)) {
          return round(size / boundary, 1) + " " + plupload.translate('mb');
        }

        // KB
        if (size > 1024) {
          return Math.round(size / 1024) + " " + plupload.translate('kb');
        }

        return size + " " + plupload.translate('b');
      },

      /**
       * Parses the specified size string into a byte value. For example 10kb becomes 10240.
       *
       * @method parseSize
       * @static
       * @param {String|Number} size String to parse or number to just pass through.
       * @return {Number} Size in bytes.
       */
      parseSize: u.Basic.parseSizeStr,

      /**
       * A way to predict what runtime will be choosen in the current environment with the
       * specified settings.
       *
       * @method predictRuntime
       * @static
       * @param {Object|String} config Plupload settings to check
       * @param {String} [runtimes] Comma-separated list of runtimes to check against
       * @return {String} Type of compatible runtime
       */
      predictRuntime: function (config, runtimes) {
        var up, runtime;

        up = new plupload.Uploader(config);
        runtime = Runtime.thatCan(up.getOption().required_features, runtimes || config.runtimes);
        up.destroy();
        return runtime;
      },

      /**
       * Registers a filter that will be executed for each file added to the queue.
       * If callback returns false, file will not be added.
       *
       * Callback receives two arguments: a value for the filter as it was specified in settings.filters
       * and a file to be filtered. Callback is executed in the context of uploader instance.
       *
       * @method addFileFilter
       * @static
       * @param {String} name Name of the filter by which it can be referenced in settings.filters
       * @param {String} cb Callback - the actual routine that every added file must pass
       */
      addFileFilter: function (name, cb) {
        fileFilters[name] = cb;
      }
    };

    plupload.addFileFilter('mime_types', function (filters, file, cb) {
      if (filters.length && !filters.regexp.test(file.name)) {
        this.trigger('Error', {
          code: plupload.FILE_EXTENSION_ERROR,
          message: plupload.translate('File extension error.'),
          file: file
        });
        cb(false);
      } else {
        cb(true);
      }
    });

    plupload.addFileFilter('max_file_size', function (maxSize, file, cb) {
      var undef;

      maxSize = plupload.parseSize(maxSize);

      // Invalid file size
      if (file.size !== undef && maxSize && file.size > maxSize) {
        this.trigger('Error', {
          code: plupload.FILE_SIZE_ERROR,
          message: plupload.translate('File size error.'),
          file: file
        });
        cb(false);
      } else {
        cb(true);
      }
    });

    plupload.addFileFilter('prevent_duplicates', function (value, file, cb) {
      if (value) {
        var ii = this.files.length;
        while (ii--) {
          // Compare by name and size (size might be 0 or undefined, but still equivalent for both)
          if (file.name === this.files[ii].name && file.size === this.files[ii].size) {
            this.trigger('Error', {
              code: plupload.FILE_DUPLICATE_ERROR,
              message: plupload.translate('Duplicate file error.'),
              file: file
            });
            cb(false);
            return;
          }
        }
      }
      cb(true);
    });

    /**
    @class Uploader
    @constructor
    
    @param {Object} settings For detailed information about each option check documentation.
      @param {String|DOMElement} settings.browse_button id of the DOM element or DOM element itself to use as file dialog trigger.
      @param {Number|String} [settings.chunk_size=0] Chunk size in bytes to slice the file into. Shorcuts with b, kb, mb, gb, tb suffixes also supported. `e.g. 204800 or "204800b" or "200kb"`. By default - disabled.
      @param {String|DOMElement} [settings.container] id of the DOM element or DOM element itself that will be used to wrap uploader structures. Defaults to immediate parent of the `browse_button` element.
      @param {String|DOMElement} [settings.drop_element] id of the DOM element or DOM element itself to use as a drop zone for Drag-n-Drop.
      @param {String} [settings.file_data_name="file"] Name for the file field in Multipart formated message.
      @param {Object} [settings.filters={}] Set of file type filters.
        @param {String|Number} [settings.filters.max_file_size=0] Maximum file size that the user can pick, in bytes. Optionally supports b, kb, mb, gb, tb suffixes. `e.g. "10mb" or "1gb"`. By default - not set. Dispatches `plupload.FILE_SIZE_ERROR`.
        @param {Array} [settings.filters.mime_types=[]] List of file types to accept, each one defined by title and list of extensions. `e.g. {title : "Image files", extensions : "jpg,jpeg,gif,png"}`. Dispatches `plupload.FILE_EXTENSION_ERROR`
        @param {Boolean} [settings.filters.prevent_duplicates=false] Do not let duplicates into the queue. Dispatches `plupload.FILE_DUPLICATE_ERROR`.
      @param {String} [settings.flash_swf_url] URL of the Flash swf.
      @param {Object} [settings.headers] Custom headers to send with the upload. Hash of name/value pairs.
      @param {String} [settings.http_method="POST"] HTTP method to use during upload (only PUT or POST allowed).
      @param {Number} [settings.max_retries=0] How many times to retry the chunk or file, before triggering Error event.
      @param {Boolean} [settings.multipart=true] Whether to send file and additional parameters as Multipart formated message.
      @param {Object} [settings.multipart_params] Hash of key/value pairs to send with every file upload.
      @param {Boolean} [settings.multi_selection=true] Enable ability to select multiple files at once in file dialog.
      @param {String|Object} [settings.required_features] Either comma-separated list or hash of required features that chosen runtime should absolutely possess.
      @param {Object} [settings.resize] Enable resizng of images on client-side. Applies to `image/jpeg` and `image/png` only. `e.g. {width : 200, height : 200, quality : 90, crop: true}`
        @param {Number} [settings.resize.width] If image is bigger, it will be resized.
        @param {Number} [settings.resize.height] If image is bigger, it will be resized.
        @param {Number} [settings.resize.quality=90] Compression quality for jpegs (1-100).
        @param {Boolean} [settings.resize.crop=false] Whether to crop images to exact dimensions. By default they will be resized proportionally.
      @param {String} [settings.runtimes="html5,flash,silverlight,html4"] Comma separated list of runtimes, that Plupload will try in turn, moving to the next if previous fails.
      @param {String} [settings.silverlight_xap_url] URL of the Silverlight xap.
      @param {Boolean} [settings.send_chunk_number=true] Whether to send chunks and chunk numbers, or total and offset bytes.
      @param {Boolean} [settings.send_file_name=true] Whether to send file name as additional argument - 'name' (required for chunked uploads and some other cases where file name cannot be sent via normal ways).
      @param {String} settings.url URL of the server-side upload handler.
      @param {Boolean} [settings.unique_names=false] If true will generate unique filenames for uploaded files.
    
    */
    plupload.Uploader = function (options) {
      /**
      Fires when the current RunTime has been initialized.
        @event Init
      @param {plupload.Uploader} uploader Uploader instance sending the event.
       */

      /**
      Fires after the init event incase you need to perform actions there.
        @event PostInit
      @param {plupload.Uploader} uploader Uploader instance sending the event.
       */

      /**
      Fires when the option is changed in via uploader.setOption().
        @event OptionChanged
      @since 2.1
      @param {plupload.Uploader} uploader Uploader instance sending the event.
      @param {String} name Name of the option that was changed
      @param {Mixed} value New value for the specified option
      @param {Mixed} oldValue Previous value of the option
       */

      /**
      Fires when the silverlight/flash or other shim needs to move.
        @event Refresh
      @param {plupload.Uploader} uploader Uploader instance sending the event.
       */

      /**
      Fires when the overall state is being changed for the upload queue.
        @event StateChanged
      @param {plupload.Uploader} uploader Uploader instance sending the event.
       */

      /**
      Fires when browse_button is clicked and browse dialog shows.
        @event Browse
      @since 2.1.2
      @param {plupload.Uploader} uploader Uploader instance sending the event.
       */

      /**
      Fires for every filtered file before it is added to the queue.
        @event FileFiltered
      @since 2.1
      @param {plupload.Uploader} uploader Uploader instance sending the event.
      @param {plupload.File} file Another file that has to be added to the queue.
       */

      /**
      Fires when the file queue is changed. In other words when files are added/removed to the files array of the uploader instance.
        @event QueueChanged
      @param {plupload.Uploader} uploader Uploader instance sending the event.
       */

      /**
      Fires after files were filtered and added to the queue.
        @event FilesAdded
      @param {plupload.Uploader} uploader Uploader instance sending the event.
      @param {Array} files Array of file objects that were added to queue by the user.
       */

      /**
      Fires when file is removed from the queue.
        @event FilesRemoved
      @param {plupload.Uploader} uploader Uploader instance sending the event.
      @param {Array} files Array of files that got removed.
       */

      /**
      Fires just before a file is uploaded. Can be used to cancel the upload for the specified file
      by returning false from the handler.
        @event BeforeUpload
      @param {plupload.Uploader} uploader Uploader instance sending the event.
      @param {plupload.File} file File to be uploaded.
       */

      /**
      Fires when a file is to be uploaded by the runtime.
        @event UploadFile
      @param {plupload.Uploader} uploader Uploader instance sending the event.
      @param {plupload.File} file File to be uploaded.
       */

      /**
      Fires while a file is being uploaded. Use this event to update the current file upload progress.
        @event UploadProgress
      @param {plupload.Uploader} uploader Uploader instance sending the event.
      @param {plupload.File} file File that is currently being uploaded.
       */

      /**
      * Fires just before a chunk is uploaded. This event enables you to override settings
      * on the uploader instance before the chunk is uploaded.
      *
      * @event BeforeChunkUpload
      * @param {plupload.Uploader} uploader Uploader instance sending the event.
      * @param {plupload.File} file File to be uploaded.
      * @param {Object} args POST params to be sent.
      * @param {Blob} chunkBlob Current blob.
      * @param {offset} offset Current offset.
      */

      /**
      Fires when file chunk is uploaded.
        @event ChunkUploaded
      @param {plupload.Uploader} uploader Uploader instance sending the event.
      @param {plupload.File} file File that the chunk was uploaded for.
      @param {Object} result Object with response properties.
        @param {Number} result.offset The amount of bytes the server has received so far, including this chunk.
        @param {Number} result.total The size of the file.
        @param {String} result.response The response body sent by the server.
        @param {Number} result.status The HTTP status code sent by the server.
        @param {String} result.responseHeaders All the response headers as a single string.
       */

      /**
      Fires when a file is successfully uploaded.
        @event FileUploaded
      @param {plupload.Uploader} uploader Uploader instance sending the event.
      @param {plupload.File} file File that was uploaded.
      @param {Object} result Object with response properties.
        @param {String} result.response The response body sent by the server.
        @param {Number} result.status The HTTP status code sent by the server.
        @param {String} result.responseHeaders All the response headers as a single string.
       */

      /**
      Fires when all files in a queue are uploaded.
        @event UploadComplete
      @param {plupload.Uploader} uploader Uploader instance sending the event.
      @param {Array} files Array of file objects that was added to queue/selected by the user.
       */

      /**
      Fires when a error occurs.
        @event Error
      @param {plupload.Uploader} uploader Uploader instance sending the event.
      @param {Object} error Contains code, message and sometimes file and other details.
        @param {Number} error.code The plupload error code.
        @param {String} error.message Description of the error (uses i18n).
       */

      /**
      Fires when destroy method is called.
        @event Destroy
      @param {plupload.Uploader} uploader Uploader instance sending the event.
       */
      var uid = plupload.guid(),
          settings,
          files = [],
          preferred_caps = {},
          fileInputs = [],
          fileDrops = [],
          startTime,
          total,
          disabled = false,
          xhr;

      // Private methods
      function uploadNext() {
        var file,
            count = 0,
            i;

        if (this.state == plupload.STARTED) {
          // Find first QUEUED file
          for (i = 0; i < files.length; i++) {
            if (!file && files[i].status == plupload.QUEUED) {
              file = files[i];
              if (this.trigger("BeforeUpload", file)) {
                file.status = plupload.UPLOADING;
                this.trigger("UploadFile", file);
              }
            } else {
              count++;
            }
          }

          // All files are DONE or FAILED
          if (count == files.length) {
            if (this.state !== plupload.STOPPED) {
              this.state = plupload.STOPPED;
              this.trigger("StateChanged");
            }
            this.trigger("UploadComplete", files);
          }
        }
      }

      function calcFile(file) {
        file.percent = file.size > 0 ? Math.ceil(file.loaded / file.size * 100) : 100;
        calc();
      }

      function calc() {
        var i, file;
        var loaded;
        var loadedDuringCurrentSession = 0;

        // Reset stats
        total.reset();

        // Check status, size, loaded etc on all files
        for (i = 0; i < files.length; i++) {
          file = files[i];

          if (file.size !== undef) {
            // We calculate totals based on original file size
            total.size += file.origSize;

            // Since we cannot predict file size after resize, we do opposite and
            // interpolate loaded amount to match magnitude of total
            loaded = file.loaded * file.origSize / file.size;

            if (!file.completeTimestamp || file.completeTimestamp > startTime) {
              loadedDuringCurrentSession += loaded;
            }

            total.loaded += loaded;
          } else {
            total.size = undef;
          }

          if (file.status == plupload.DONE) {
            total.uploaded++;
          } else if (file.status == plupload.FAILED) {
            total.failed++;
          } else {
            total.queued++;
          }
        }

        // If we couldn't calculate a total file size then use the number of files to calc percent
        if (total.size === undef) {
          total.percent = files.length > 0 ? Math.ceil(total.uploaded / files.length * 100) : 0;
        } else {
          total.bytesPerSec = Math.ceil(loadedDuringCurrentSession / ((+new Date() - startTime || 1) / 1000.0));
          total.percent = total.size > 0 ? Math.ceil(total.loaded / total.size * 100) : 0;
        }
      }

      function getRUID() {
        var ctrl = fileInputs[0] || fileDrops[0];
        if (ctrl) {
          return ctrl.getRuntime().uid;
        }
        return false;
      }

      function runtimeCan(file, cap) {
        if (file.ruid) {
          var info = Runtime.getInfo(file.ruid);
          if (info) {
            return info.can(cap);
          }
        }
        return false;
      }

      function bindEventListeners() {
        this.bind('FilesAdded FilesRemoved', function (up) {
          up.trigger('QueueChanged');
          up.refresh();
        });

        this.bind('CancelUpload', onCancelUpload);

        this.bind('BeforeUpload', onBeforeUpload);

        this.bind('UploadFile', onUploadFile);

        this.bind('UploadProgress', onUploadProgress);

        this.bind('StateChanged', onStateChanged);

        this.bind('QueueChanged', calc);

        this.bind('Error', onError);

        this.bind('FileUploaded', onFileUploaded);

        this.bind('Destroy', onDestroy);
      }

      function initControls(settings, cb) {
        var self = this,
            inited = 0,
            queue = [];

        // common settings
        var options = {
          runtime_order: settings.runtimes,
          required_caps: settings.required_features,
          preferred_caps: preferred_caps,
          swf_url: settings.flash_swf_url,
          xap_url: settings.silverlight_xap_url
        };

        // add runtime specific options if any
        plupload.each(settings.runtimes.split(/\s*,\s*/), function (runtime) {
          if (settings[runtime]) {
            options[runtime] = settings[runtime];
          }
        });

        // initialize file pickers - there can be many
        if (settings.browse_button) {
          plupload.each(settings.browse_button, function (el) {
            queue.push(function (cb) {
              var fileInput = new o.file.FileInput(plupload.extend({}, options, {
                accept: settings.filters.mime_types,
                name: settings.file_data_name,
                multiple: settings.multi_selection,
                container: settings.container,
                browse_button: el
              }));

              fileInput.onready = function () {
                var info = Runtime.getInfo(this.ruid);

                // for backward compatibility
                plupload.extend(self.features, {
                  chunks: info.can('slice_blob'),
                  multipart: info.can('send_multipart'),
                  multi_selection: info.can('select_multiple')
                });

                inited++;
                fileInputs.push(this);
                cb();
              };

              fileInput.onchange = function () {
                self.addFile(this.files);
              };

              fileInput.bind('mouseenter mouseleave mousedown mouseup', function (e) {
                if (!disabled) {
                  if (settings.browse_button_hover) {
                    if ('mouseenter' === e.type) {
                      plupload.addClass(el, settings.browse_button_hover);
                    } else if ('mouseleave' === e.type) {
                      plupload.removeClass(el, settings.browse_button_hover);
                    }
                  }

                  if (settings.browse_button_active) {
                    if ('mousedown' === e.type) {
                      plupload.addClass(el, settings.browse_button_active);
                    } else if ('mouseup' === e.type) {
                      plupload.removeClass(el, settings.browse_button_active);
                    }
                  }
                }
              });

              fileInput.bind('mousedown', function () {
                self.trigger('Browse');
              });

              fileInput.bind('error runtimeerror', function () {
                fileInput = null;
                cb();
              });

              fileInput.init();
            });
          });
        }

        // initialize drop zones
        if (settings.drop_element) {
          plupload.each(settings.drop_element, function (el) {
            queue.push(function (cb) {
              var fileDrop = new o.file.FileDrop(plupload.extend({}, options, {
                drop_zone: el
              }));

              fileDrop.onready = function () {
                var info = Runtime.getInfo(this.ruid);

                // for backward compatibility
                plupload.extend(self.features, {
                  chunks: info.can('slice_blob'),
                  multipart: info.can('send_multipart'),
                  dragdrop: info.can('drag_and_drop')
                });

                inited++;
                fileDrops.push(this);
                cb();
              };

              fileDrop.ondrop = function () {
                self.addFile(this.files);
              };

              fileDrop.bind('error runtimeerror', function () {
                fileDrop = null;
                cb();
              });

              fileDrop.init();
            });
          });
        }

        plupload.inSeries(queue, function () {
          if (typeof cb === 'function') {
            cb(inited);
          }
        });
      }

      function resizeImage(blob, params, cb) {
        var img = new o.image.Image();

        try {
          img.onload = function () {
            // no manipulation required if...
            if (params.width > this.width && params.height > this.height && params.quality === undef && params.preserve_headers && !params.crop) {
              this.destroy();
              return cb(blob);
            }
            // otherwise downsize
            img.downsize(params.width, params.height, params.crop, params.preserve_headers);
          };

          img.onresize = function () {
            cb(this.getAsBlob(blob.type, params.quality));
            this.destroy();
          };

          img.onerror = function () {
            cb(blob);
          };

          img.load(blob);
        } catch (ex) {
          cb(blob);
        }
      }

      function setOption(option, value, init) {
        var self = this,
            reinitRequired = false;

        function _setOption(option, value, init) {
          var oldValue = settings[option];

          switch (option) {
            case 'max_file_size':
              if (option === 'max_file_size') {
                settings.max_file_size = settings.filters.max_file_size = value;
              }
              break;

            case 'chunk_size':
              if (value = plupload.parseSize(value)) {
                settings[option] = value;
                settings.send_file_name = true;
              }
              break;

            case 'multipart':
              settings[option] = value;
              if (!value) {
                settings.send_file_name = true;
              }
              break;

            case 'http_method':
              settings[option] = value.toUpperCase() === 'PUT' ? 'PUT' : 'POST';
              break;

            case 'unique_names':
              settings[option] = value;
              if (value) {
                settings.send_file_name = true;
              }
              break;

            case 'filters':
              // for sake of backward compatibility
              if (plupload.typeOf(value) === 'array') {
                value = {
                  mime_types: value
                };
              }

              if (init) {
                plupload.extend(settings.filters, value);
              } else {
                settings.filters = value;
              }

              // if file format filters are being updated, regenerate the matching expressions
              if (value.mime_types) {
                if (plupload.typeOf(value.mime_types) === 'string') {
                  value.mime_types = o.core.utils.Mime.mimes2extList(value.mime_types);
                }

                value.mime_types.regexp = function (filters) {
                  var extensionsRegExp = [];

                  plupload.each(filters, function (filter) {
                    plupload.each(filter.extensions.split(/,/), function (ext) {
                      if (/^\s*\*\s*$/.test(ext)) {
                        extensionsRegExp.push('\\.*');
                      } else {
                        extensionsRegExp.push('\\.' + ext.replace(new RegExp('[' + '/^$.*+?|()[]{}\\'.replace(/./g, '\\$&') + ']', 'g'), '\\$&'));
                      }
                    });
                  });

                  return new RegExp('(' + extensionsRegExp.join('|') + ')$', 'i');
                }(value.mime_types);

                settings.filters.mime_types = value.mime_types;
              }
              break;

            case 'resize':
              if (value) {
                settings.resize = plupload.extend({
                  preserve_headers: true,
                  crop: false
                }, value);
              } else {
                settings.resize = false;
              }
              break;

            case 'prevent_duplicates':
              settings.prevent_duplicates = settings.filters.prevent_duplicates = !!value;
              break;

            // options that require reinitialisation
            case 'container':
            case 'browse_button':
            case 'drop_element':
              value = 'container' === option ? plupload.get(value) : plupload.getAll(value);

            case 'runtimes':
            case 'multi_selection':
            case 'flash_swf_url':
            case 'silverlight_xap_url':
              settings[option] = value;
              if (!init) {
                reinitRequired = true;
              }
              break;

            default:
              settings[option] = value;
          }

          if (!init) {
            self.trigger('OptionChanged', option, value, oldValue);
          }
        }

        if (typeof option === 'object') {
          plupload.each(option, function (value, option) {
            _setOption(option, value, init);
          });
        } else {
          _setOption(option, value, init);
        }

        if (init) {
          // Normalize the list of required capabilities
          settings.required_features = normalizeCaps(plupload.extend({}, settings));

          // Come up with the list of capabilities that can affect default mode in a multi-mode runtimes
          preferred_caps = normalizeCaps(plupload.extend({}, settings, {
            required_features: true
          }));
        } else if (reinitRequired) {
          self.trigger('Destroy');

          initControls.call(self, settings, function (inited) {
            if (inited) {
              self.runtime = Runtime.getInfo(getRUID()).type;
              self.trigger('Init', { runtime: self.runtime });
              self.trigger('PostInit');
            } else {
              self.trigger('Error', {
                code: plupload.INIT_ERROR,
                message: plupload.translate('Init error.')
              });
            }
          });
        }
      }

      // Internal event handlers
      function onBeforeUpload(up, file) {
        // Generate unique target filenames
        if (up.settings.unique_names) {
          var matches = file.name.match(/\.([^.]+)$/),
              ext = "part";
          if (matches) {
            ext = matches[1];
          }
          file.target_name = file.id + '.' + ext;
        }
      }

      function onUploadFile(up, file) {
        var url = up.settings.url,
            chunkSize = up.settings.chunk_size,
            retries = up.settings.max_retries,
            features = up.features,
            offset = 0,
            blob;

        // make sure we start at a predictable offset
        if (file.loaded) {
          offset = file.loaded = chunkSize ? chunkSize * Math.floor(file.loaded / chunkSize) : 0;
        }

        function handleError() {
          if (retries-- > 0) {
            delay(uploadNextChunk, 1000);
          } else {
            file.loaded = offset; // reset all progress

            up.trigger('Error', {
              code: plupload.HTTP_ERROR,
              message: plupload.translate('HTTP Error.'),
              file: file,
              response: xhr.responseText,
              status: xhr.status,
              responseHeaders: xhr.getAllResponseHeaders()
            });
          }
        }

        function uploadNextChunk() {
          var chunkBlob,
              args = {},
              curChunkSize;

          // make sure that file wasn't cancelled and upload is not stopped in general
          if (file.status !== plupload.UPLOADING || up.state === plupload.STOPPED) {
            return;
          }

          // send additional 'name' parameter only if required
          if (up.settings.send_file_name) {
            args.name = file.target_name || file.name;
          }

          if (chunkSize && features.chunks && blob.size > chunkSize) {
            // blob will be of type string if it was loaded in memory
            curChunkSize = Math.min(chunkSize, blob.size - offset);
            chunkBlob = blob.slice(offset, offset + curChunkSize);
          } else {
            curChunkSize = blob.size;
            chunkBlob = blob;
          }

          // If chunking is enabled add corresponding args, no matter if file is bigger than chunk or smaller
          if (chunkSize && features.chunks) {
            // Setup query string arguments
            if (up.settings.send_chunk_number) {
              args.chunk = Math.ceil(offset / chunkSize);
              args.chunks = Math.ceil(blob.size / chunkSize);
            } else {
              // keep support for experimental chunk format, just in case
              args.offset = offset;
              args.total = blob.size;
            }
          }

          if (up.trigger('BeforeChunkUpload', file, args, chunkBlob, offset)) {
            uploadChunk(args, chunkBlob, curChunkSize);
          }
        }

        function uploadChunk(args, chunkBlob, curChunkSize) {
          var formData;

          xhr = new o.xhr.XMLHttpRequest();

          // Do we have upload progress support
          if (xhr.upload) {
            xhr.upload.onprogress = function (e) {
              file.loaded = Math.min(file.size, offset + e.loaded);
              up.trigger('UploadProgress', file);
            };
          }

          xhr.onload = function () {
            // check if upload made itself through
            if (xhr.status >= 400) {
              handleError();
              return;
            }

            retries = up.settings.max_retries; // reset the counter

            // Handle chunk response
            if (curChunkSize < blob.size) {
              chunkBlob.destroy();

              offset += curChunkSize;
              file.loaded = Math.min(offset, blob.size);

              up.trigger('ChunkUploaded', file, {
                offset: file.loaded,
                total: blob.size,
                response: xhr.responseText,
                status: xhr.status,
                responseHeaders: xhr.getAllResponseHeaders()
              });

              // stock Android browser doesn't fire upload progress events, but in chunking mode we can fake them
              if (plupload.ua.browser === 'Android Browser') {
                // doesn't harm in general, but is not required anywhere else
                up.trigger('UploadProgress', file);
              }
            } else {
              file.loaded = file.size;
            }

            chunkBlob = formData = null; // Free memory

            // Check if file is uploaded
            if (!offset || offset >= blob.size) {
              // If file was modified, destory the copy
              if (file.size != file.origSize) {
                blob.destroy();
                blob = null;
              }

              up.trigger('UploadProgress', file);

              file.status = plupload.DONE;
              file.completeTimestamp = +new Date();

              up.trigger('FileUploaded', file, {
                response: xhr.responseText,
                status: xhr.status,
                responseHeaders: xhr.getAllResponseHeaders()
              });
            } else {
              // Still chunks left
              delay(uploadNextChunk, 1); // run detached, otherwise event handlers interfere
            }
          };

          xhr.onerror = function () {
            handleError();
          };

          xhr.onloadend = function () {
            this.destroy();
            xhr = null;
          };

          // Build multipart request
          if (up.settings.multipart && features.multipart) {
            xhr.open(up.settings.http_method, url, true);

            // Set custom headers
            plupload.each(up.settings.headers, function (value, name) {
              xhr.setRequestHeader(name, value);
            });

            formData = new o.xhr.FormData();

            // Add multipart params
            plupload.each(plupload.extend(args, up.settings.multipart_params), function (value, name) {
              formData.append(name, value);
            });

            // Add file and send it
            formData.append(up.settings.file_data_name, chunkBlob);
            xhr.send(formData, {
              runtime_order: up.settings.runtimes,
              required_caps: up.settings.required_features,
              preferred_caps: preferred_caps,
              swf_url: up.settings.flash_swf_url,
              xap_url: up.settings.silverlight_xap_url
            });
          } else {
            // if no multipart, send as binary stream
            url = plupload.buildUrl(up.settings.url, plupload.extend(args, up.settings.multipart_params));

            xhr.open(up.settings.http_method, url, true);

            // Set custom headers
            plupload.each(up.settings.headers, function (value, name) {
              xhr.setRequestHeader(name, value);
            });

            // do not set Content-Type, if it was defined previously (see #1203)
            if (!xhr.hasRequestHeader('Content-Type')) {
              xhr.setRequestHeader('Content-Type', 'application/octet-stream'); // Binary stream header
            }

            xhr.send(chunkBlob, {
              runtime_order: up.settings.runtimes,
              required_caps: up.settings.required_features,
              preferred_caps: preferred_caps,
              swf_url: up.settings.flash_swf_url,
              xap_url: up.settings.silverlight_xap_url
            });
          }
        }

        blob = file.getSource();

        // Start uploading chunks
        if (!plupload.isEmptyObj(up.settings.resize) && runtimeCan(blob, 'send_binary_string') && plupload.inArray(blob.type, ['image/jpeg', 'image/png']) !== -1) {
          // Resize if required
          resizeImage.call(this, blob, up.settings.resize, function (resizedBlob) {
            blob = resizedBlob;
            file.size = resizedBlob.size;
            uploadNextChunk();
          });
        } else {
          uploadNextChunk();
        }
      }

      function onUploadProgress(up, file) {
        calcFile(file);
      }

      function onStateChanged(up) {
        if (up.state == plupload.STARTED) {
          // Get start time to calculate bps
          startTime = +new Date();
        } else if (up.state == plupload.STOPPED) {
          // Reset currently uploading files
          for (var i = up.files.length - 1; i >= 0; i--) {
            if (up.files[i].status == plupload.UPLOADING) {
              up.files[i].status = plupload.QUEUED;
              calc();
            }
          }
        }
      }

      function onCancelUpload() {
        if (xhr) {
          xhr.abort();
        }
      }

      function onFileUploaded(up) {
        calc();

        // Upload next file but detach it from the error event
        // since other custom listeners might want to stop the queue
        delay(function () {
          uploadNext.call(up);
        }, 1);
      }

      function onError(up, err) {
        if (err.code === plupload.INIT_ERROR) {
          up.destroy();
        }
        // Set failed status if an error occured on a file
        else if (err.code === plupload.HTTP_ERROR) {
            err.file.status = plupload.FAILED;
            err.file.completeTimestamp = +new Date();
            calcFile(err.file);

            // Upload next file but detach it from the error event
            // since other custom listeners might want to stop the queue
            if (up.state == plupload.STARTED) {
              // upload in progress
              up.trigger('CancelUpload');
              delay(function () {
                uploadNext.call(up);
              }, 1);
            }
          }
      }

      function onDestroy(up) {
        up.stop();

        // Purge the queue
        plupload.each(files, function (file) {
          file.destroy();
        });
        files = [];

        if (fileInputs.length) {
          plupload.each(fileInputs, function (fileInput) {
            fileInput.destroy();
          });
          fileInputs = [];
        }

        if (fileDrops.length) {
          plupload.each(fileDrops, function (fileDrop) {
            fileDrop.destroy();
          });
          fileDrops = [];
        }

        preferred_caps = {};
        disabled = false;
        startTime = xhr = null;
        total.reset();
      }

      // Default settings
      settings = {
        chunk_size: 0,
        file_data_name: 'file',
        filters: {
          mime_types: [],
          prevent_duplicates: false,
          max_file_size: 0
        },
        flash_swf_url: 'js/Moxie.swf',
        http_method: 'POST',
        max_retries: 0,
        multipart: true,
        multi_selection: true,
        resize: false,
        runtimes: Runtime.order,
        send_file_name: true,
        send_chunk_number: true,
        silverlight_xap_url: 'js/Moxie.xap'
      };

      setOption.call(this, options, null, true);

      // Inital total state
      total = new plupload.QueueProgress();

      // Add public methods
      plupload.extend(this, {

        /**
         * Unique id for the Uploader instance.
         *
         * @property id
         * @type String
         */
        id: uid,
        uid: uid, // mOxie uses this to differentiate between event targets

        /**
         * Current state of the total uploading progress. This one can either be plupload.STARTED or plupload.STOPPED.
         * These states are controlled by the stop/start methods. The default value is STOPPED.
         *
         * @property state
         * @type Number
         */
        state: plupload.STOPPED,

        /**
         * Map of features that are available for the uploader runtime. Features will be filled
         * before the init event is called, these features can then be used to alter the UI for the end user.
         * Some of the current features that might be in this map is: dragdrop, chunks, jpgresize, pngresize.
         *
         * @property features
         * @type Object
         */
        features: {},

        /**
         * Current runtime name.
         *
         * @property runtime
         * @type String
         */
        runtime: null,

        /**
         * Current upload queue, an array of File instances.
         *
         * @property files
         * @type Array
         * @see plupload.File
         */
        files: files,

        /**
         * Object with name/value settings.
         *
         * @property settings
         * @type Object
         */
        settings: settings,

        /**
         * Total progess information. How many files has been uploaded, total percent etc.
         *
         * @property total
         * @type plupload.QueueProgress
         */
        total: total,

        /**
         * Initializes the Uploader instance and adds internal event listeners.
         *
         * @method init
         */
        init: function () {
          var self = this,
              opt,
              preinitOpt,
              err;

          preinitOpt = self.getOption('preinit');
          if (typeof preinitOpt == "function") {
            preinitOpt(self);
          } else {
            plupload.each(preinitOpt, function (func, name) {
              self.bind(name, func);
            });
          }

          bindEventListeners.call(self);

          // Check for required options
          plupload.each(['container', 'browse_button', 'drop_element'], function (el) {
            if (self.getOption(el) === null) {
              err = {
                code: plupload.INIT_ERROR,
                message: plupload.sprintf(plupload.translate("%s specified, but cannot be found."), el)
              };
              return false;
            }
          });

          if (err) {
            return self.trigger('Error', err);
          }

          if (!settings.browse_button && !settings.drop_element) {
            return self.trigger('Error', {
              code: plupload.INIT_ERROR,
              message: plupload.translate("You must specify either browse_button or drop_element.")
            });
          }

          initControls.call(self, settings, function (inited) {
            var initOpt = self.getOption('init');
            if (typeof initOpt == "function") {
              initOpt(self);
            } else {
              plupload.each(initOpt, function (func, name) {
                self.bind(name, func);
              });
            }

            if (inited) {
              self.runtime = Runtime.getInfo(getRUID()).type;
              self.trigger('Init', { runtime: self.runtime });
              self.trigger('PostInit');
            } else {
              self.trigger('Error', {
                code: plupload.INIT_ERROR,
                message: plupload.translate('Init error.')
              });
            }
          });
        },

        /**
         * Set the value for the specified option(s).
         *
         * @method setOption
         * @since 2.1
         * @param {String|Object} option Name of the option to change or the set of key/value pairs
         * @param {Mixed} [value] Value for the option (is ignored, if first argument is object)
         */
        setOption: function (option, value) {
          setOption.call(this, option, value, !this.runtime); // until runtime not set we do not need to reinitialize
        },

        /**
         * Get the value for the specified option or the whole configuration, if not specified.
         *
         * @method getOption
         * @since 2.1
         * @param {String} [option] Name of the option to get
         * @return {Mixed} Value for the option or the whole set
         */
        getOption: function (option) {
          if (!option) {
            return settings;
          }
          return settings[option];
        },

        /**
         * Refreshes the upload instance by dispatching out a refresh event to all runtimes.
         * This would for example reposition flash/silverlight shims on the page.
         *
         * @method refresh
         */
        refresh: function () {
          if (fileInputs.length) {
            plupload.each(fileInputs, function (fileInput) {
              fileInput.trigger('Refresh');
            });
          }
          this.trigger('Refresh');
        },

        /**
         * Starts uploading the queued files.
         *
         * @method start
         */
        start: function () {
          if (this.state != plupload.STARTED) {
            this.state = plupload.STARTED;
            this.trigger('StateChanged');

            uploadNext.call(this);
          }
        },

        /**
         * Stops the upload of the queued files.
         *
         * @method stop
         */
        stop: function () {
          if (this.state != plupload.STOPPED) {
            this.state = plupload.STOPPED;
            this.trigger('StateChanged');
            this.trigger('CancelUpload');
          }
        },

        /**
         * Disables/enables browse button on request.
         *
         * @method disableBrowse
         * @param {Boolean} disable Whether to disable or enable (default: true)
         */
        disableBrowse: function () {
          disabled = arguments[0] !== undef ? arguments[0] : true;

          if (fileInputs.length) {
            plupload.each(fileInputs, function (fileInput) {
              fileInput.disable(disabled);
            });
          }

          this.trigger('DisableBrowse', disabled);
        },

        /**
         * Returns the specified file object by id.
         *
         * @method getFile
         * @param {String} id File id to look for.
         * @return {plupload.File} File object or undefined if it wasn't found;
         */
        getFile: function (id) {
          var i;
          for (i = files.length - 1; i >= 0; i--) {
            if (files[i].id === id) {
              return files[i];
            }
          }
        },

        /**
         * Adds file to the queue programmatically. Can be native file, instance of Plupload.File,
         * instance of mOxie.File, input[type="file"] element, or array of these. Fires FilesAdded,
         * if any files were added to the queue. Otherwise nothing happens.
         *
         * @method addFile
         * @since 2.0
         * @param {plupload.File|mOxie.File|File|Node|Array} file File or files to add to the queue.
         * @param {String} [fileName] If specified, will be used as a name for the file
         */
        addFile: function (file, fileName) {
          var self = this,
              queue = [],
              filesAdded = [],
              ruid;

          function filterFile(file, cb) {
            var queue = [];
            plupload.each(self.settings.filters, function (rule, name) {
              if (fileFilters[name]) {
                queue.push(function (cb) {
                  fileFilters[name].call(self, rule, file, function (res) {
                    cb(!res);
                  });
                });
              }
            });
            plupload.inSeries(queue, cb);
          }

          /**
           * @method resolveFile
           * @private
           * @param {moxie.file.File|moxie.file.Blob|plupload.File|File|Blob|input[type="file"]} file
           */
          function resolveFile(file) {
            var type = plupload.typeOf(file);

            // moxie.file.File
            if (file instanceof o.file.File) {
              if (!file.ruid && !file.isDetached()) {
                if (!ruid) {
                  // weird case
                  return false;
                }
                file.ruid = ruid;
                file.connectRuntime(ruid);
              }
              resolveFile(new plupload.File(file));
            }
            // moxie.file.Blob
            else if (file instanceof o.file.Blob) {
                resolveFile(file.getSource());
                file.destroy();
              }
              // plupload.File - final step for other branches
              else if (file instanceof plupload.File) {
                  if (fileName) {
                    file.name = fileName;
                  }

                  queue.push(function (cb) {
                    // run through the internal and user-defined filters, if any
                    filterFile(file, function (err) {
                      if (!err) {
                        // make files available for the filters by updating the main queue directly
                        files.push(file);
                        // collect the files that will be passed to FilesAdded event
                        filesAdded.push(file);

                        self.trigger("FileFiltered", file);
                      }
                      delay(cb, 1); // do not build up recursions or eventually we might hit the limits
                    });
                  });
                }
                // native File or blob
                else if (plupload.inArray(type, ['file', 'blob']) !== -1) {
                    resolveFile(new o.file.File(null, file));
                  }
                  // input[type="file"]
                  else if (type === 'node' && plupload.typeOf(file.files) === 'filelist') {
                      // if we are dealing with input[type="file"]
                      plupload.each(file.files, resolveFile);
                    }
                    // mixed array of any supported types (see above)
                    else if (type === 'array') {
                        fileName = null; // should never happen, but unset anyway to avoid funny situations
                        plupload.each(file, resolveFile);
                      }
          }

          ruid = getRUID();

          resolveFile(file);

          if (queue.length) {
            plupload.inSeries(queue, function () {
              // if any files left after filtration, trigger FilesAdded
              if (filesAdded.length) {
                self.trigger("FilesAdded", filesAdded);
              }
            });
          }
        },

        /**
         * Removes a specific file.
         *
         * @method removeFile
         * @param {plupload.File|String} file File to remove from queue.
         */
        removeFile: function (file) {
          var id = typeof file === 'string' ? file : file.id;

          for (var i = files.length - 1; i >= 0; i--) {
            if (files[i].id === id) {
              return this.splice(i, 1)[0];
            }
          }
        },

        /**
         * Removes part of the queue and returns the files removed. This will also trigger the FilesRemoved and QueueChanged events.
         *
         * @method splice
         * @param {Number} start (Optional) Start index to remove from.
         * @param {Number} length (Optional) Lengh of items to remove.
         * @return {Array} Array of files that was removed.
         */
        splice: function (start, length) {
          // Splice and trigger events
          var removed = files.splice(start === undef ? 0 : start, length === undef ? files.length : length);

          // if upload is in progress we need to stop it and restart after files are removed
          var restartRequired = false;
          if (this.state == plupload.STARTED) {
            // upload in progress
            plupload.each(removed, function (file) {
              if (file.status === plupload.UPLOADING) {
                restartRequired = true; // do not restart, unless file that is being removed is uploading
                return false;
              }
            });

            if (restartRequired) {
              this.stop();
            }
          }

          this.trigger("FilesRemoved", removed);

          // Dispose any resources allocated by those files
          plupload.each(removed, function (file) {
            file.destroy();
          });

          if (restartRequired) {
            this.start();
          }

          return removed;
        },

        /**
        Dispatches the specified event name and its arguments to all listeners.
          @method trigger
        @param {String} name Event name to fire.
        @param {Object..} Multiple arguments to pass along to the listener functions.
        */

        // override the parent method to match Plupload-like event logic
        dispatchEvent: function (type) {
          var list, args, result;

          type = type.toLowerCase();

          list = this.hasEventListener(type);

          if (list) {
            // sort event list by priority
            list.sort(function (a, b) {
              return b.priority - a.priority;
            });

            // first argument should be current plupload.Uploader instance
            args = [].slice.call(arguments);
            args.shift();
            args.unshift(this);

            for (var i = 0; i < list.length; i++) {
              // Fire event, break chain if false is returned
              if (list[i].fn.apply(list[i].scope, args) === false) {
                return false;
              }
            }
          }
          return true;
        },

        /**
        Check whether uploader has any listeners to the specified event.
          @method hasEventListener
        @param {String} name Event name to check for.
        */

        /**
        Adds an event listener by name.
          @method bind
        @param {String} name Event name to listen for.
        @param {function} fn Function to call ones the event gets fired.
        @param {Object} [scope] Optional scope to execute the specified function in.
        @param {Number} [priority=0] Priority of the event handler - handlers with higher priorities will be called first
        */
        bind: function (name, fn, scope, priority) {
          // adapt moxie EventTarget style to Plupload-like
          plupload.Uploader.prototype.bind.call(this, name, fn, priority, scope);
        },

        /**
        Removes the specified event listener.
          @method unbind
        @param {String} name Name of event to remove.
        @param {function} fn Function to remove from listener.
        */

        /**
        Removes all event listeners.
          @method unbindAll
        */

        /**
         * Destroys Plupload instance and cleans after itself.
         *
         * @method destroy
         */
        destroy: function () {
          this.trigger('Destroy');
          settings = total = null; // purge these exclusively
          this.unbindAll();
        }
      });
    };

    plupload.Uploader.prototype = o.core.EventTarget.instance;

    /**
     * Constructs a new file instance.
     *
     * @class File
     * @constructor
     *
     * @param {Object} file Object containing file properties
     * @param {String} file.name Name of the file.
     * @param {Number} file.size File size.
     */
    plupload.File = function () {
      var filepool = {};

      function PluploadFile(file) {

        plupload.extend(this, {

          /**
           * File id this is a globally unique id for the specific file.
           *
           * @property id
           * @type String
           */
          id: plupload.guid(),

          /**
           * File name for example "myfile.gif".
           *
           * @property name
           * @type String
           */
          name: file.name || file.fileName,

          /**
           * File type, `e.g image/jpeg`
           *
           * @property type
           * @type String
           */
          type: file.type || '',

          /**
           * File size in bytes (may change after client-side manupilation).
           *
           * @property size
           * @type Number
           */
          size: file.size || file.fileSize,

          /**
           * Original file size in bytes.
           *
           * @property origSize
           * @type Number
           */
          origSize: file.size || file.fileSize,

          /**
           * Number of bytes uploaded of the files total size.
           *
           * @property loaded
           * @type Number
           */
          loaded: 0,

          /**
           * Number of percentage uploaded of the file.
           *
           * @property percent
           * @type Number
           */
          percent: 0,

          /**
           * Status constant matching the plupload states QUEUED, UPLOADING, FAILED, DONE.
           *
           * @property status
           * @type Number
           * @see plupload
           */
          status: plupload.QUEUED,

          /**
           * Date of last modification.
           *
           * @property lastModifiedDate
           * @type {String}
           */
          lastModifiedDate: file.lastModifiedDate || new Date().toLocaleString(), // Thu Aug 23 2012 19:40:00 GMT+0400 (GET)


          /**
           * Set when file becomes plupload.DONE or plupload.FAILED. Is used to calculate proper plupload.QueueProgress.bytesPerSec.
           * @private
           * @property completeTimestamp
           * @type {Number}
           */
          completeTimestamp: 0,

          /**
           * Returns native window.File object, when it's available.
           *
           * @method getNative
           * @return {window.File} or null, if plupload.File is of different origin
           */
          getNative: function () {
            var file = this.getSource().getSource();
            return plupload.inArray(plupload.typeOf(file), ['blob', 'file']) !== -1 ? file : null;
          },

          /**
           * Returns mOxie.File - unified wrapper object that can be used across runtimes.
           *
           * @method getSource
           * @return {mOxie.File} or null
           */
          getSource: function () {
            if (!filepool[this.id]) {
              return null;
            }
            return filepool[this.id];
          },

          /**
           * Destroys plupload.File object.
           *
           * @method destroy
           */
          destroy: function () {
            var src = this.getSource();
            if (src) {
              src.destroy();
              delete filepool[this.id];
            }
          }
        });

        filepool[this.id] = file;
      }

      return PluploadFile;
    }();

    /**
     * Constructs a queue progress.
     *
     * @class QueueProgress
     * @constructor
     */
    plupload.QueueProgress = function () {
      var self = this; // Setup alias for self to reduce code size when it's compressed

      /**
       * Total queue file size.
       *
       * @property size
       * @type Number
       */
      self.size = 0;

      /**
       * Total bytes uploaded.
       *
       * @property loaded
       * @type Number
       */
      self.loaded = 0;

      /**
       * Number of files uploaded.
       *
       * @property uploaded
       * @type Number
       */
      self.uploaded = 0;

      /**
       * Number of files failed to upload.
       *
       * @property failed
       * @type Number
       */
      self.failed = 0;

      /**
       * Number of files yet to be uploaded.
       *
       * @property queued
       * @type Number
       */
      self.queued = 0;

      /**
       * Total percent of the uploaded bytes.
       *
       * @property percent
       * @type Number
       */
      self.percent = 0;

      /**
       * Bytes uploaded per second.
       *
       * @property bytesPerSec
       * @type Number
       */
      self.bytesPerSec = 0;

      /**
       * Resets the progress to its initial values.
       *
       * @method reset
       */
      self.reset = function () {
        self.size = self.loaded = self.uploaded = self.failed = self.queued = self.percent = self.bytesPerSec = 0;
      };
    };

    exports.plupload = plupload;
  })(this, moxie);
});
});

/*!
 * qiniu-js-sdk v1.0.20
 *
 * Copyright 2015 by Qiniu
 * Released under GPL V2 License.
 *
 * GitHub: http://github.com/qiniu/js-sdk
 *
 * Date: 2017-3-23
*/

/*global plupload ,moxie*/
/*global ActiveXObject */
/*exported Qiniu */
/*exported QiniuJsSDK */

(function (global) {
    var isHttps = !window.isHttp;
    /**
     * Creates new cookie or removes cookie with negative expiration
     * @param  key       The key or identifier for the store
     * @param  value     Contents of the store
     * @param  exp       Expiration - creation defaults to 30 days
     */
    function createCookie(key, value, exp) {
        var date = new Date();
        date.setTime(date.getTime() + exp * 24 * 60 * 60 * 1000);
        var expires = "; expires=" + date.toGMTString();
        document.cookie = key + "=" + value + expires + "; path=/";
    }

    /**
     * Returns contents of cookie
     * @param  key       The key or identifier for the store
     */
    function readCookie(key) {
        var nameEQ = key + "=";
        var ca = document.cookie.split(';');
        for (var i = 0, max = ca.length; i < max; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    }

    // if current browser is not support localStorage
    // use cookie to make a polyfill
    if (!window.localStorage) {
        window.localStorage = {
            setItem: function (key, value) {
                createCookie(key, value, 30);
            },
            getItem: function (key) {
                return readCookie(key);
            },
            removeItem: function (key) {
                createCookie(key, '', -1);
            }
        };
    }

    function QiniuJsSDK() {

        var that = this;

        /**
         * detect IE version
         * if current browser is not IE
         *     it will return false
         * else
         *     it will return version of current IE browser
         * @return {Number|Boolean} IE version or false
         */
        this.detectIEVersion = function () {
            var v = 4,
                div = document.createElement('div'),
                all = div.getElementsByTagName('i');
            while (div.innerHTML = '<!--[if gt IE ' + v + ']><i></i><![endif]-->', all[0]) {
                v++;
            }
            return v > 4 ? v : false;
        };

        var logger = {
            MUTE: 0,
            FATA: 1,
            ERROR: 2,
            WARN: 3,
            INFO: 4,
            DEBUG: 5,
            TRACE: 6,
            level: 0
        };

        function log(type, args) {
            var header = "[qiniu-js-sdk][" + type + "]";
            var msg = header;
            for (var i = 0; i < args.length; i++) {
                if (typeof args[i] === "string") {
                    msg += " " + args[i];
                } else {
                    msg += " " + that.stringifyJSON(args[i]);
                }
            }
            if (that.detectIEVersion()) {
                // http://stackoverflow.com/questions/5538972/console-log-apply-not-working-in-ie9
                //var log = Function.prototype.bind.call(console.log, console);
                //log.apply(console, args);
                console.log(msg);
            } else {
                args.unshift(header);
                console.log.apply(console, args);
            }
            if (document.getElementById('qiniu-js-sdk-log')) {
                document.getElementById('qiniu-js-sdk-log').innerHTML += '<p>' + msg + '</p>';
            }
        }

        function makeLogFunc(code) {
            var func = code.toLowerCase();
            logger[func] = function () {
                // logger[func].history = logger[func].history || [];
                // logger[func].history.push(arguments);
                if (window.console && window.console.log && logger.level >= logger[code]) {
                    var args = Array.prototype.slice.call(arguments);
                    log(func, args);
                }
            };
        }

        for (var property in logger) {
            if (logger.hasOwnProperty(property) && typeof logger[property] === "number" && !logger.hasOwnProperty(property.toLowerCase())) {
                makeLogFunc(property);
            }
        }

        var qiniuUploadUrl;
        // if (window.location.protocol === 'https:') {
        if (isHttps) {
            qiniuUploadUrl = 'https://up.qbox.me';
        } else {
            qiniuUploadUrl = 'http://upload.qiniu.com';
        }

        /**
         * qiniu upload urls
         * 'qiniuUploadUrls' is used to change target when current url is not avaliable
         * @type {Array}
         */
        var qiniuUploadUrls = ["http://upload.qiniu.com", "http://up.qiniu.com"];

        var qiniuUpHosts = {
            "http": ["http://upload.qiniu.com", "http://up.qiniu.com"],
            "https": ["https://up.qbox.me"]
        };

        var changeUrlTimes = 0;

        /**
         * reset upload url
         * if current page protocal is https
         *     it will always return 'https://up.qbox.me'
         * else
         *     it will set 'qiniuUploadUrl' value with 'qiniuUploadUrls' looply
         */
        this.resetUploadUrl = function () {
            // var hosts = window.location.protocol === 'https:' ? qiniuUpHosts.https : qiniuUpHosts.http;
            var hosts = isHttps ? qiniuUpHosts.https : qiniuUpHosts.http;
            var i = changeUrlTimes % hosts.length;
            qiniuUploadUrl = hosts[i];
            changeUrlTimes++;
            logger.debug('resetUploadUrl: ' + qiniuUploadUrl);
        };

        // this.resetUploadUrl();


        /**
         * is image
         * @param  {String}  url of a file
         * @return {Boolean} file is a image or not
         */
        this.isImage = function (url) {
            url = url.split(/[?#]/)[0];
            return (/\.(png|jpg|jpeg|gif|bmp)$/i.test(url)
            );
        };

        /**
         * get file extension
         * @param  {String} filename
         * @return {String} file extension
         * @example
         *     input: test.txt
         *     output: txt
         */
        this.getFileExtension = function (filename) {
            var tempArr = filename.split(".");
            var ext;
            if (tempArr.length === 1 || tempArr[0] === "" && tempArr.length === 2) {
                ext = "";
            } else {
                ext = tempArr.pop().toLowerCase(); //get the extension and make it lower-case
            }
            return ext;
        };

        /**
         * encode string by utf8
         * @param  {String} string to encode
         * @return {String} encoded string
         */
        this.utf8_encode = function (argString) {
            // http://kevin.vanzonneveld.net
            // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
            // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // +   improved by: sowberry
            // +    tweaked by: Jack
            // +   bugfixed by: Onno Marsman
            // +   improved by: Yves Sucaet
            // +   bugfixed by: Onno Marsman
            // +   bugfixed by: Ulrich
            // +   bugfixed by: Rafal Kukawski
            // +   improved by: kirilloid
            // +   bugfixed by: kirilloid
            // *     example 1: this.utf8_encode('Kevin van Zonneveld');
            // *     returns 1: 'Kevin van Zonneveld'

            if (argString === null || typeof argString === 'undefined') {
                return '';
            }

            var string = argString + ''; // .replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            var utftext = '',
                start,
                end,
                stringl = 0;

            start = end = 0;
            stringl = string.length;
            for (var n = 0; n < stringl; n++) {
                var c1 = string.charCodeAt(n);
                var enc = null;

                if (c1 < 128) {
                    end++;
                } else if (c1 > 127 && c1 < 2048) {
                    enc = String.fromCharCode(c1 >> 6 | 192, c1 & 63 | 128);
                } else if (c1 & 0xF800 ^ 0xD800 > 0) {
                    enc = String.fromCharCode(c1 >> 12 | 224, c1 >> 6 & 63 | 128, c1 & 63 | 128);
                } else {
                    // surrogate pairs
                    if (c1 & 0xFC00 ^ 0xD800 > 0) {
                        throw new RangeError('Unmatched trail surrogate at ' + n);
                    }
                    var c2 = string.charCodeAt(++n);
                    if (c2 & 0xFC00 ^ 0xDC00 > 0) {
                        throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
                    }
                    c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
                    enc = String.fromCharCode(c1 >> 18 | 240, c1 >> 12 & 63 | 128, c1 >> 6 & 63 | 128, c1 & 63 | 128);
                }
                if (enc !== null) {
                    if (end > start) {
                        utftext += string.slice(start, end);
                    }
                    utftext += enc;
                    start = end = n + 1;
                }
            }

            if (end > start) {
                utftext += string.slice(start, stringl);
            }

            return utftext;
        };

        this.base64_decode = function (data) {
            // http://kevin.vanzonneveld.net
            // +   original by: Tyler Akins (http://rumkin.com)
            // +   improved by: Thunder.m
            // +      input by: Aman Gupta
            // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // +   bugfixed by: Onno Marsman
            // +   bugfixed by: Pellentesque Malesuada
            // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // +      input by: Brett Zamir (http://brett-zamir.me)
            // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
            // *     returns 1: 'Kevin van Zonneveld'
            // mozilla has this native
            // - but breaks in 2.0.0.12!
            //if (typeof this.window['atob'] == 'function') {
            //    return atob(data);
            //}
            var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var o1,
                o2,
                o3,
                h1,
                h2,
                h3,
                h4,
                bits,
                i = 0,
                ac = 0,
                dec = "",
                tmp_arr = [];

            if (!data) {
                return data;
            }

            data += '';

            do {
                // unpack four hexets into three octets using index points in b64
                h1 = b64.indexOf(data.charAt(i++));
                h2 = b64.indexOf(data.charAt(i++));
                h3 = b64.indexOf(data.charAt(i++));
                h4 = b64.indexOf(data.charAt(i++));

                bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

                o1 = bits >> 16 & 0xff;
                o2 = bits >> 8 & 0xff;
                o3 = bits & 0xff;

                if (h3 === 64) {
                    tmp_arr[ac++] = String.fromCharCode(o1);
                } else if (h4 === 64) {
                    tmp_arr[ac++] = String.fromCharCode(o1, o2);
                } else {
                    tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
                }
            } while (i < data.length);

            dec = tmp_arr.join('');

            return dec;
        };

        /**
         * encode data by base64
         * @param  {String} data to encode
         * @return {String} encoded data
         */
        this.base64_encode = function (data) {
            // http://kevin.vanzonneveld.net
            // +   original by: Tyler Akins (http://rumkin.com)
            // +   improved by: Bayron Guevara
            // +   improved by: Thunder.m
            // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // +   bugfixed by: Pellentesque Malesuada
            // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // -    depends on: this.utf8_encode
            // *     example 1: this.base64_encode('Kevin van Zonneveld');
            // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
            // mozilla has this native
            // - but breaks in 2.0.0.12!
            //if (typeof this.window['atob'] == 'function') {
            //    return atob(data);
            //}
            var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            var o1,
                o2,
                o3,
                h1,
                h2,
                h3,
                h4,
                bits,
                i = 0,
                ac = 0,
                enc = '',
                tmp_arr = [];

            if (!data) {
                return data;
            }

            data = this.utf8_encode(data + '');

            do {
                // pack three octets into four hexets
                o1 = data.charCodeAt(i++);
                o2 = data.charCodeAt(i++);
                o3 = data.charCodeAt(i++);

                bits = o1 << 16 | o2 << 8 | o3;

                h1 = bits >> 18 & 0x3f;
                h2 = bits >> 12 & 0x3f;
                h3 = bits >> 6 & 0x3f;
                h4 = bits & 0x3f;

                // use hexets to index into b64, and append result to encoded string
                tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
            } while (i < data.length);

            enc = tmp_arr.join('');

            switch (data.length % 3) {
                case 1:
                    enc = enc.slice(0, -2) + '==';
                    break;
                case 2:
                    enc = enc.slice(0, -1) + '=';
                    break;
            }

            return enc;
        };

        /**
         * encode string in url by base64
         * @param {String} string in url
         * @return {String} encoded string
         */
        this.URLSafeBase64Encode = function (v) {
            v = this.base64_encode(v);
            return v.replace(/\//g, '_').replace(/\+/g, '-');
        };

        this.URLSafeBase64Decode = function (v) {
            v = v.replace(/_/g, '/').replace(/-/g, '+');
            return this.base64_decode(v);
        };

        // TODO: use mOxie
        /**
         * craete object used to AJAX
         * @return {Object}
         */
        this.createAjax = function (argument) {
            var xmlhttp = {};
            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            } else {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            return xmlhttp;
        };

        // TODO: enhance IE compatibility
        /**
         * parse json string to javascript object
         * @param  {String} json string
         * @return {Object} object
         */
        this.parseJSON = function (data) {
            return window.JSON.parse(data);
            // Attempt to parse using the native JSON parser first
            // if (window.JSON && window.JSON.parse) {
            //     return window.JSON.parse(data);
            // }

            // //var rx_one = /^[\],:{}\s]*$/,
            // //    rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
            // //    rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
            // //    rx_four = /(?:^|:|,)(?:\s*\[)+/g,
            // var    rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

            // //var json;

            // var text = String(data);
            // rx_dangerous.lastIndex = 0;
            // if(rx_dangerous.test(text)){
            //     text = text.replace(rx_dangerous, function(a){
            //        return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            //     });
            // }

            // // todo 使用一下判断,增加安全性
            // //if (
            // //    rx_one.test(
            // //        text
            // //            .replace(rx_two, '@')
            // //            .replace(rx_three, ']')
            // //            .replace(rx_four, '')
            // //    )
            // //) {
            // //    return eval('(' + text + ')');
            // //}

            // return eval('('+text+')');
        };

        /**
         * parse javascript object to json string
         * @param  {Object} object
         * @return {String} json string
         */
        this.stringifyJSON = function (obj) {
            // Attempt to parse using the native JSON parser first
            if (window.JSON && window.JSON.stringify) {
                return window.JSON.stringify(obj);
            }
            switch (typeof obj) {
                case 'string':
                    return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
                case 'array':
                    return '[' + obj.map(that.stringifyJSON).join(',') + ']';
                case 'object':
                    if (obj instanceof Array) {
                        var strArr = [];
                        var len = obj.length;
                        for (var i = 0; i < len; i++) {
                            strArr.push(that.stringifyJSON(obj[i]));
                        }
                        return '[' + strArr.join(',') + ']';
                    } else if (obj === null) {
                        return 'null';
                    } else {
                        var string = [];
                        for (var property in obj) {
                            if (obj.hasOwnProperty(property)) {
                                string.push(that.stringifyJSON(property) + ':' + that.stringifyJSON(obj[property]));
                            }
                        }
                        return '{' + string.join(',') + '}';
                    }
                    break;
                case 'number':
                    return obj;
                case false:
                    return obj;
                case 'boolean':
                    return obj;
            }
        };

        /**
         * trim space beside text
         * @param  {String} untrimed string
         * @return {String} trimed string
         */
        this.trim = function (text) {
            return text === null ? "" : text.replace(/^\s+|\s+$/g, '');
        };

        /**
         * create a uploader by QiniuJsSDK
         * @param  {object} options to create a new uploader
         * @return {object} uploader
         */
        this.uploader = function (op) {

            /********** inner function define start **********/

            // according the different condition to reset chunk size
            // and the upload strategy according with the chunk size
            // when chunk size is zero will cause to direct upload
            // see the statement binded on 'BeforeUpload' event
            var reset_chunk_size = function () {
                var ie = that.detectIEVersion();
                var BLOCK_BITS, MAX_CHUNK_SIZE, chunk_size;
                // case Safari 5、Windows 7、iOS 7 set isSpecialSafari to true
                var isSpecialSafari = moxie.core.utils.Env.browser === "Safari" && moxie.core.utils.Env.version <= 5 && moxie.core.utils.Env.os === "Windows" && moxie.core.utils.Env.osVersion === "7" || moxie.core.utils.Env.browser === "Safari" && moxie.core.utils.Env.os === "iOS" && moxie.core.utils.Env.osVersion === "7";
                // case IE 9-，chunk_size is not empty and flash is included in runtimes
                // set op.chunk_size to zero
                //if (ie && ie < 9 && op.chunk_size && op.runtimes.indexOf('flash') >= 0) {
                if (ie && ie < 9 && op.chunk_size && op.runtimes.indexOf('flash') >= 0) {
                    //  link: http://www.plupload.com/docs/Frequently-Asked-Questions#when-to-use-chunking-and-when-not
                    //  when plupload chunk_size setting is't null ,it cause bug in ie8/9  which runs  flash runtimes (not support html5) .
                    op.chunk_size = 0;
                } else if (isSpecialSafari) {
                    // win7 safari / iOS7 safari have bug when in chunk upload mode
                    // reset chunk_size to 0
                    // disable chunk in special version safari
                    op.chunk_size = 0;
                } else {
                    BLOCK_BITS = 20;
                    MAX_CHUNK_SIZE = 4 << BLOCK_BITS; //4M

                    chunk_size = plupload.parseSize(op.chunk_size);
                    if (chunk_size > MAX_CHUNK_SIZE) {
                        op.chunk_size = MAX_CHUNK_SIZE;
                    }
                    // qiniu service  max_chunk_size is 4m
                    // reset chunk_size to max_chunk_size(4m) when chunk_size > 4m
                }
                // if op.chunk_size set 0 will be cause to direct upload
            };

            var getHosts = function (hosts) {
                var result = [];
                var uploadIndex = -1;
                for (var i = 0; i < hosts.length; i++) {
                    var host = hosts[i];
                    if (host.indexOf("upload") !== -1) {
                        uploadIndex = i;
                    }
                    if (host.indexOf('-H') === 0) {
                        result.push(host.split(' ')[2]);
                    } else {
                        result.push(host);
                    }
                }

                if (uploadIndex !== -1) {
                    //make upload domains first
                    var uploadDomain = result[uploadIndex];
                    result[uploadIndex] = result[0];
                    result[0] = uploadDomain;
                }
                return result;
            };

            var getPutPolicy = function (uptoken) {
                var segments = uptoken.split(":");
                var ak = segments[0];
                var putPolicy = that.parseJSON(that.URLSafeBase64Decode(segments[2]));
                putPolicy.ak = ak;
                if (putPolicy.scope.indexOf(":") >= 0) {
                    putPolicy.bucket = putPolicy.scope.split(":")[0];
                    putPolicy.key = putPolicy.scope.split(":")[1];
                } else {
                    putPolicy.bucket = putPolicy.scope;
                }
                return putPolicy;
            };

            var getUpHosts = function (uptoken) {
                var putPolicy = getPutPolicy(uptoken);
                // var uphosts_url = "//uc.qbox.me/v1/query?ak="+ak+"&bucket="+putPolicy.scope;
                // IE9 does not support protocol relative url
                var uphosts_url = (isHttps ? 'https:' : 'http:') + "//uc.qbox.me/v1/query?ak=" + putPolicy.ak + "&bucket=" + putPolicy.bucket;
                // var uphosts_url = 'https:' + "//uc.qbox.me/v1/query?ak=" + putPolicy.ak + "&bucket=" + putPolicy.bucket;
                logger.debug("putPolicy: ", putPolicy);
                logger.debug("get uphosts from: ", uphosts_url);
                var ie = that.detectIEVersion();
                var ajax;
                if (ie && ie <= 9) {
                    ajax = new moxie.xhr.XMLHttpRequest();
                    moxie.core.utils.Env.swf_url = op.flash_swf_url;
                } else {
                    ajax = that.createAjax();
                }
                ajax.open('GET', uphosts_url, false);
                var onreadystatechange = function () {
                    logger.debug("ajax.readyState: ", ajax.readyState);
                    if (ajax.readyState === 4) {
                        logger.debug("ajax.status: ", ajax.status);
                        if (ajax.status < 400) {
                            var res = that.parseJSON(ajax.responseText);
                            qiniuUpHosts.http = getHosts(res.http.up);
                            qiniuUpHosts.https = getHosts(res.https.up);
                            logger.debug("get new uphosts: ", qiniuUpHosts);
                            that.resetUploadUrl();
                        } else {
                            logger.error("get uphosts error: ", ajax.responseText);
                        }
                    }
                };
                if (ie && ie <= 9) {
                    ajax.bind('readystatechange', onreadystatechange);
                } else {
                    ajax.onreadystatechange = onreadystatechange;
                }
                ajax.send();
                // ajax.send();
                // if (ajax.status < 400) {
                //     var res = that.parseJSON(ajax.responseText);
                //     qiniuUpHosts.http = getHosts(res.http.up);
                //     qiniuUpHosts.https = getHosts(res.https.up);
                //     logger.debug("get new uphosts: ", qiniuUpHosts);
                //     that.resetUploadUrl();
                // } else {
                //     logger.error("get uphosts error: ", ajax.responseText);
                // }
                return;
            };

            var getUptoken = function (file) {
                if (!that.token || op.uptoken_url && that.tokenInfo.isExpired()) {
                    return getNewUpToken(file);
                } else {
                    return that.token;
                }
            };

            // getNewUptoken maybe called at Init Event or BeforeUpload Event
            // case Init Event, the file param of getUptken will be set a null value
            // if op.uptoken has value, set uptoken with op.uptoken
            // else if op.uptoken_url has value, set uptoken from op.uptoken_url
            // else if op.uptoken_func has value, set uptoken by result of op.uptoken_func
            var getNewUpToken = function (file) {
                if (op.uptoken) {
                    that.token = op.uptoken;
                } else if (op.uptoken_url) {
                    logger.debug("get uptoken from: ", that.uptoken_url);
                    // TODO: use mOxie
                    var ajax = that.createAjax();
                    ajax.open('GET', that.uptoken_url, false);
                    ajax.setRequestHeader("If-Modified-Since", "0");
                    // ajax.onreadystatechange = function() {
                    //     if (ajax.readyState === 4 && ajax.status === 200) {
                    //         var res = that.parseJSON(ajax.responseText);
                    //         that.token = res.uptoken;
                    //     }
                    // };
                    ajax.send();
                    if (ajax.status === 200) {
                        var res = that.parseJSON(ajax.responseText);
                        that.token = res.uptoken;
                        var segments = that.token.split(":");
                        var putPolicy = that.parseJSON(that.URLSafeBase64Decode(segments[2]));
                        if (!that.tokenMap) {
                            that.tokenMap = {};
                        }
                        var getTimestamp = function (time) {
                            return Math.ceil(time.getTime() / 1000);
                        };
                        var serverTime = getTimestamp(new Date(ajax.getResponseHeader("date")));
                        var clientTime = getTimestamp(new Date());
                        that.tokenInfo = {
                            serverDelay: clientTime - serverTime,
                            deadline: putPolicy.deadline,
                            isExpired: function () {
                                var leftTime = this.deadline - getTimestamp(new Date()) + this.serverDelay;
                                return leftTime < 600;
                            }
                        };
                        logger.debug("get new uptoken: ", that.token);
                        logger.debug("get token info: ", that.tokenInfo);
                    } else {
                        logger.error("get uptoken error: ", ajax.responseText);
                    }
                } else if (op.uptoken_func) {
                    logger.debug("get uptoken from uptoken_func");
                    that.token = op.uptoken_func(file);
                    logger.debug("get new uptoken: ", that.token);
                } else {
                    logger.error("one of [uptoken, uptoken_url, uptoken_func] settings in options is required!");
                }
                if (that.token) {
                    getUpHosts(that.token);
                }
                return that.token;
            };

            // get file key according with the user passed options
            var getFileKey = function (up, file, func) {
                // WARNING
                // When you set the key in putPolicy by "scope": "bucket:key"
                // You should understand the risk of override a file in the bucket
                // So the code below that automatically get key from uptoken has been commented
                // var putPolicy = getPutPolicy(that.token)
                // if (putPolicy.key) {
                //     logger.debug("key is defined in putPolicy.scope: ", putPolicy.key)
                //     return putPolicy.key
                // }
                var key = '',
                    unique_names = false;
                if (!op.save_key) {
                    unique_names = up.getOption && up.getOption('unique_names');
                    unique_names = unique_names || up.settings && up.settings.unique_names;
                    if (unique_names) {
                        var ext = that.getFileExtension(file.name);
                        key = ext ? file.id + '.' + ext : file.id;
                    } else if (typeof func === 'function') {
                        key = func(up, file);
                    } else {
                        key = file.name;
                    }
                }
                return key;
            };

            /********** inner function define end **********/

            if (op.log_level) {
                logger.level = op.log_level;
            }

            if (!op.domain) {
                throw 'domain setting in options is required!';
            }

            if (!op.browse_button) {
                throw 'browse_button setting in options is required!';
            }

            if (!op.uptoken && !op.uptoken_url && !op.uptoken_func) {
                throw 'one of [uptoken, uptoken_url, uptoken_func] settings in options is required!';
            }

            logger.debug("init uploader start");

            logger.debug("environment: ", moxie.core.utils.Env);

            logger.debug("userAgent: ", navigator.userAgent);

            var option = {};

            // hold the handler from user passed options
            var _Error_Handler = op.init && op.init.Error;
            var _FileUploaded_Handler = op.init && op.init.FileUploaded;

            // replace the handler for intercept
            op.init.Error = function () {};
            op.init.FileUploaded = function () {};

            that.uptoken_url = op.uptoken_url;
            that.token = '';
            that.key_handler = typeof op.init.Key === 'function' ? op.init.Key : '';
            this.domain = op.domain;
            // TODO: ctx is global in scope of a uploader instance
            // this maybe cause error
            var ctx = '';
            var speedCalInfo = {
                isResumeUpload: false,
                resumeFilesize: 0,
                startTime: '',
                currentTime: ''
            };

            reset_chunk_size();
            logger.debug("invoke reset_chunk_size()");
            logger.debug("op.chunk_size: ", op.chunk_size);

            var defaultSetting = {
                url: qiniuUploadUrl,
                multipart_params: {
                    token: ''
                }
            };
            var ie = that.detectIEVersion();
            // case IE 9-
            // add accept in multipart params
            if (ie && ie <= 9) {
                defaultSetting.multipart_params.accept = 'text/plain; charset=utf-8';
                logger.debug("add accept text/plain in multipart params");
            }

            // compose options with user passed options and default setting
            plupload.extend(option, op, defaultSetting);

            logger.debug("option: ", option);

            // create a new uploader with composed options
            var uploader = new plupload.Uploader(option);

            logger.debug("new plupload.Uploader(option)");

            // bind getNewUpToken to 'Init' event
            uploader.bind('Init', function (up, params) {
                logger.debug("Init event activated");
                // if op.get_new_uptoken is not true
                //      invoke getNewUptoken when uploader init
                // else
                //      getNewUptoken everytime before a new file upload
                if (!op.get_new_uptoken) {
                    getNewUpToken(null);
                }
                //getNewUpToken(null);
            });

            logger.debug("bind Init event");

            // bind 'FilesAdded' event
            // when file be added and auto_start has set value
            // uploader will auto start upload the file
            uploader.bind('FilesAdded', function (up, files) {
                logger.debug("FilesAdded event activated");
                var auto_start = up.getOption && up.getOption('auto_start');
                auto_start = auto_start || up.settings && up.settings.auto_start;
                logger.debug("auto_start: ", auto_start);
                logger.debug("files: ", files);

                // detect is iOS
                var is_ios = function () {
                    if (moxie.core.utils.Env.OS.toLowerCase() === "ios") {
                        return true;
                    } else {
                        return false;
                    }
                };

                // if current env os is iOS change file name to [time].[ext]
                if (is_ios()) {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        var ext = that.getFileExtension(file.name);
                        file.name = file.id + "." + ext;
                    }
                }

                if (auto_start) {
                    setTimeout(function () {
                        up.start();
                        logger.debug("invoke up.start()");
                    }, 0);
                    // up.start();
                    // plupload.each(files, function(i, file) {
                    //     up.start();
                    //     logger.debug("invoke up.start()")
                    //     logger.debug("file: ", file);
                    // });
                }
                up.refresh(); // Reposition Flash/Silverlight
            });

            logger.debug("bind FilesAdded event");

            // bind 'BeforeUpload' event
            // intercept the process of upload
            // - prepare uptoken
            // - according the chunk size to make differnt upload strategy
            // - resume upload with the last breakpoint of file
            uploader.bind('BeforeUpload', function (up, file) {
                logger.debug("BeforeUpload event activated");
                // add a key named speed for file object
                file.speed = file.speed || 0;
                ctx = '';

                if (op.get_new_uptoken) {
                    getNewUpToken(file);
                }

                var directUpload = function (up, file, func) {
                    speedCalInfo.startTime = new Date().getTime();
                    var multipart_params_obj;
                    if (op.save_key) {
                        multipart_params_obj = {
                            'token': that.token
                        };
                    } else {
                        multipart_params_obj = {
                            'key': getFileKey(up, file, func),
                            'token': that.token
                        };
                    }
                    var ie = that.detectIEVersion();
                    // case IE 9-
                    // add accept in multipart params
                    if (ie && ie <= 9) {
                        multipart_params_obj.accept = 'text/plain; charset=utf-8';
                        logger.debug("add accept text/plain in multipart params");
                    }

                    logger.debug("directUpload multipart_params_obj: ", multipart_params_obj);

                    var x_vars = op.x_vars;
                    if (x_vars !== undefined && typeof x_vars === 'object') {
                        for (var x_key in x_vars) {
                            if (x_vars.hasOwnProperty(x_key)) {
                                if (typeof x_vars[x_key] === 'function') {
                                    multipart_params_obj['x:' + x_key] = x_vars[x_key](up, file);
                                } else if (typeof x_vars[x_key] !== 'object') {
                                    multipart_params_obj['x:' + x_key] = x_vars[x_key];
                                }
                            }
                        }
                    }

                    up.setOption({
                        'url': qiniuUploadUrl,
                        'multipart': true,
                        'chunk_size': is_android_weixin_or_qq() ? op.max_file_size : undefined,
                        'multipart_params': multipart_params_obj
                    });
                };

                // detect is weixin or qq inner browser
                var is_android_weixin_or_qq = function () {
                    var ua = navigator.userAgent.toLowerCase();
                    if ((ua.match(/MicroMessenger/i) || moxie.core.utils.Env.browser === "QQBrowser" || ua.match(/V1_AND_SQ/i)) && moxie.core.utils.Env.OS.toLowerCase() === "android") {
                        return true;
                    } else {
                        return false;
                    }
                };

                var chunk_size = up.getOption && up.getOption('chunk_size');
                chunk_size = chunk_size || up.settings && up.settings.chunk_size;

                logger.debug("uploader.runtime: ", uploader.runtime);
                logger.debug("chunk_size: ", chunk_size);

                // TODO: flash support chunk upload
                if ((uploader.runtime === 'html5' || uploader.runtime === 'flash') && chunk_size) {
                    if (file.size < chunk_size || is_android_weixin_or_qq()) {
                        logger.debug("directUpload because file.size < chunk_size || is_android_weixin_or_qq()");
                        // direct upload if file size is less then the chunk size
                        directUpload(up, file, that.key_handler);
                    } else {
                        // TODO: need a polifill to make it work in IE 9-
                        // ISSUE: if file.name is existed in localStorage
                        // but not the same file maybe cause error
                        var localFileInfo = localStorage.getItem(file.name);
                        var blockSize = chunk_size;
                        if (localFileInfo) {
                            // TODO: although only the html5 runtime will enter this statement
                            // but need uniform way to make convertion between string and json
                            localFileInfo = that.parseJSON(localFileInfo);
                            var now = new Date().getTime();
                            var before = localFileInfo.time || 0;
                            var aDay = 24 * 60 * 60 * 1000; //  milliseconds of one day
                            // if the last upload time is within one day
                            //      will upload continuously follow the last breakpoint
                            // else
                            //      will reupload entire file
                            if (now - before < aDay) {

                                if (localFileInfo.percent !== 100) {
                                    if (file.size === localFileInfo.total) {
                                        // TODO: if file.name and file.size is the same
                                        // but not the same file will cause error
                                        file.percent = localFileInfo.percent;
                                        file.loaded = localFileInfo.offset;
                                        ctx = localFileInfo.ctx;

                                        // set speed info
                                        speedCalInfo.isResumeUpload = true;
                                        speedCalInfo.resumeFilesize = localFileInfo.offset;

                                        // set block size
                                        if (localFileInfo.offset + blockSize > file.size) {
                                            blockSize = file.size - localFileInfo.offset;
                                        }
                                    } else {
                                        // remove file info when file.size is conflict with file info
                                        localStorage.removeItem(file.name);
                                    }
                                } else {
                                    // remove file info when upload percent is 100%
                                    // avoid 499 bug
                                    localStorage.removeItem(file.name);
                                }
                            } else {
                                // remove file info when last upload time is over one day
                                localStorage.removeItem(file.name);
                            }
                        }
                        speedCalInfo.startTime = new Date().getTime();
                        var multipart_params_obj = {};
                        var ie = that.detectIEVersion();
                        // case IE 9-
                        // add accept in multipart params
                        if (ie && ie <= 9) {
                            multipart_params_obj.accept = 'text/plain; charset=utf-8';
                            logger.debug("add accept text/plain in multipart params");
                        }
                        // TODO: to support bput
                        // http://developer.qiniu.com/docs/v6/api/reference/up/bput.html
                        up.setOption({
                            'url': qiniuUploadUrl + '/mkblk/' + blockSize,
                            'multipart': false,
                            'chunk_size': chunk_size,
                            'required_features': "chunks",
                            'headers': {
                                'Authorization': 'UpToken ' + getUptoken(file)
                            },
                            'multipart_params': multipart_params_obj
                        });
                    }
                } else {
                    logger.debug("directUpload because uploader.runtime !== 'html5' || uploader.runtime !== 'flash' || !chunk_size");
                    // direct upload if runtime is not html5
                    directUpload(up, file, that.key_handler);
                }
            });

            logger.debug("bind BeforeUpload event");

            // bind 'UploadProgress' event
            // calculate upload speed
            uploader.bind('UploadProgress', function (up, file) {
                logger.trace("UploadProgress event activated");
                speedCalInfo.currentTime = new Date().getTime();
                var timeUsed = speedCalInfo.currentTime - speedCalInfo.startTime; // ms
                var fileUploaded = file.loaded || 0;
                if (speedCalInfo.isResumeUpload) {
                    fileUploaded = file.loaded - speedCalInfo.resumeFilesize;
                }
                file.speed = (fileUploaded / timeUsed * 1000).toFixed(0) || 0; // unit: byte/s
            });

            logger.debug("bind UploadProgress event");

            // bind 'ChunkUploaded' event
            // store the chunk upload info and set next chunk upload url
            uploader.bind('ChunkUploaded', function (up, file, info) {
                logger.debug("ChunkUploaded event activated");
                logger.debug("ChunkUploaded file: ", file);
                logger.debug("ChunkUploaded info: ", info);
                var res = that.parseJSON(info.response);
                logger.debug("ChunkUploaded res: ", res);
                // ctx should look like '[chunk01_ctx],[chunk02_ctx],[chunk03_ctx],...'
                ctx = ctx ? ctx + ',' + res.ctx : res.ctx;
                var leftSize = info.total - info.offset;
                var chunk_size = up.getOption && up.getOption('chunk_size');
                chunk_size = chunk_size || up.settings && up.settings.chunk_size;
                if (leftSize < chunk_size) {
                    up.setOption({
                        'url': qiniuUploadUrl + '/mkblk/' + leftSize
                    });
                    logger.debug("up.setOption url: ", qiniuUploadUrl + '/mkblk/' + leftSize);
                }
                up.setOption({
                    'headers': {
                        'Authorization': 'UpToken ' + getUptoken(file)
                    }
                });
                localStorage.setItem(file.name, that.stringifyJSON({
                    ctx: ctx,
                    percent: file.percent,
                    total: info.total,
                    offset: info.offset,
                    time: new Date().getTime()
                }));
            });

            logger.debug("bind ChunkUploaded event");

            var retries = qiniuUploadUrls.length;

            // if error is unkown switch upload url and retry
            var unknow_error_retry = function (file) {
                if (retries-- > 0) {
                    setTimeout(function () {
                        that.resetUploadUrl();
                        file.status = plupload.QUEUED;
                        uploader.stop();
                        uploader.start();
                    }, 0);
                    return true;
                } else {
                    retries = qiniuUploadUrls.length;
                    return false;
                }
            };

            // bind 'Error' event
            // check the err.code and return the errTip
            uploader.bind('Error', function (_Error_Handler) {
                return function (up, err) {
                    logger.error("Error event activated");
                    logger.error("err: ", err);
                    var errTip = '';
                    var file = err.file;
                    if (file) {
                        switch (err.code) {
                            case plupload.FAILED:
                                errTip = '上传失败。请稍后再试。';
                                break;
                            case plupload.FILE_SIZE_ERROR:
                                var max_file_size = up.getOption && up.getOption('max_file_size');
                                max_file_size = max_file_size || up.settings && up.settings.max_file_size;
                                errTip = '浏览器最大可上传' + max_file_size + '。更大文件请使用命令行工具。';
                                break;
                            case plupload.FILE_EXTENSION_ERROR:
                                errTip = '文件验证失败。请稍后重试。';
                                break;
                            case plupload.HTTP_ERROR:
                                if (err.response === '') {
                                    // Fix parseJSON error ,when http error is like net::ERR_ADDRESS_UNREACHABLE
                                    errTip = err.message || '未知网络错误。';
                                    if (!unknow_error_retry(file)) {
                                        return;
                                    }
                                    break;
                                }
                                var errorObj = that.parseJSON(err.response);
                                var errorText = errorObj.error;
                                switch (err.status) {
                                    case 400:
                                        errTip = "请求报文格式错误。";
                                        break;
                                    case 401:
                                        errTip = "客户端认证授权失败。请重试或提交反馈。";
                                        break;
                                    case 405:
                                        errTip = "客户端请求错误。请重试或提交反馈。";
                                        break;
                                    case 579:
                                        errTip = "资源上传成功，但回调失败。";
                                        break;
                                    case 599:
                                        errTip = "网络连接异常。请重试或提交反馈。";
                                        if (!unknow_error_retry(file)) {
                                            return;
                                        }
                                        break;
                                    case 614:
                                        errTip = "文件已存在。";
                                        try {
                                            errorObj = that.parseJSON(errorObj.error);
                                            errorText = errorObj.error || 'file exists';
                                        } catch (e) {
                                            errorText = errorObj.error || 'file exists';
                                        }
                                        break;
                                    case 631:
                                        errTip = "指定空间不存在。";
                                        break;
                                    case 701:
                                        errTip = "上传数据块校验出错。请重试或提交反馈。";
                                        break;
                                    default:
                                        errTip = "未知错误。";
                                        if (!unknow_error_retry(file)) {
                                            return;
                                        }
                                        break;
                                }
                                errTip = errTip + '(' + err.status + '：' + errorText + ')';
                                break;
                            case plupload.SECURITY_ERROR:
                                errTip = '安全配置错误。请联系网站管理员。';
                                break;
                            case plupload.GENERIC_ERROR:
                                errTip = '上传失败。请稍后再试。';
                                break;
                            case plupload.IO_ERROR:
                                errTip = '上传失败。请稍后再试。';
                                break;
                            case plupload.INIT_ERROR:
                                errTip = '网站配置错误。请联系网站管理员。';
                                uploader.destroy();
                                break;
                            default:
                                errTip = err.message + err.details;
                                if (!unknow_error_retry(file)) {
                                    return;
                                }
                                break;
                        }
                        if (_Error_Handler) {
                            _Error_Handler(up, err, errTip);
                        }
                    }
                    up.refresh(); // Reposition Flash/Silverlight
                };
            }(_Error_Handler));

            logger.debug("bind Error event");

            // bind 'FileUploaded' event
            // intercept the complete of upload
            // - get downtoken from downtoken_url if bucket is private
            // - invoke mkfile api to compose chunks if upload strategy is chunk upload
            uploader.bind('FileUploaded', function (_FileUploaded_Handler) {
                return function (up, file, info) {
                    logger.debug("FileUploaded event activated");
                    logger.debug("FileUploaded file: ", file);
                    logger.debug("FileUploaded info: ", info);
                    var last_step = function (up, file, info) {
                        logger.debug("FileUploaded last step:", info);
                        if (op.downtoken_url) {
                            // if op.dowontoken_url is not empty
                            // need get downtoken before invoke the _FileUploaded_Handler
                            var ajax_downtoken = that.createAjax();
                            ajax_downtoken.open('POST', op.downtoken_url, true);
                            ajax_downtoken.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                            ajax_downtoken.onreadystatechange = function () {
                                if (ajax_downtoken.readyState === 4) {
                                    if (ajax_downtoken.status === 200) {
                                        var res_downtoken;
                                        try {
                                            res_downtoken = that.parseJSON(ajax_downtoken.responseText);
                                        } catch (e) {
                                            throw 'invalid json format';
                                        }
                                        var info_extended = {};
                                        plupload.extend(info_extended, that.parseJSON(info.response), res_downtoken);
                                        if (_FileUploaded_Handler) {
                                            _FileUploaded_Handler(up, file, that.stringifyJSON(info_extended));
                                        }
                                    } else {
                                        uploader.trigger('Error', {
                                            status: ajax_downtoken.status,
                                            response: ajax_downtoken.responseText,
                                            file: file,
                                            code: plupload.HTTP_ERROR
                                        });
                                    }
                                }
                            };
                            ajax_downtoken.send('key=' + that.parseJSON(info.response).key + '&domain=' + op.domain);
                        } else if (_FileUploaded_Handler) {
                            _FileUploaded_Handler(up, file, info);
                        }
                    };

                    var res = that.parseJSON(info.response);
                    ctx = ctx ? ctx : res.ctx;
                    // if ctx is not empty
                    //      that means the upload strategy is chunk upload
                    //      before the invoke the last_step
                    //      we need request the mkfile to compose all uploaded chunks
                    // else
                    //      invoke the last_step
                    logger.debug("ctx: ", ctx);
                    if (ctx) {
                        var key = '';
                        logger.debug("save_key: ", op.save_key);
                        if (!op.save_key) {
                            key = getFileKey(up, file, that.key_handler);
                            key = key ? '/key/' + that.URLSafeBase64Encode(key) : '';
                        }

                        var fname = '/fname/' + that.URLSafeBase64Encode(file.name);

                        logger.debug("op.x_vars: ", op.x_vars);
                        var x_vars = op.x_vars,
                            x_val = '',
                            x_vars_url = '';
                        if (x_vars !== undefined && typeof x_vars === 'object') {
                            for (var x_key in x_vars) {
                                if (x_vars.hasOwnProperty(x_key)) {
                                    if (typeof x_vars[x_key] === 'function') {
                                        x_val = that.URLSafeBase64Encode(x_vars[x_key](up, file));
                                    } else if (typeof x_vars[x_key] !== 'object') {
                                        x_val = that.URLSafeBase64Encode(x_vars[x_key]);
                                    }
                                    x_vars_url += '/x:' + x_key + '/' + x_val;
                                }
                            }
                        }

                        var url = qiniuUploadUrl + '/mkfile/' + file.size + key + fname + x_vars_url;

                        var ie = that.detectIEVersion();
                        var ajax;
                        if (ie && ie <= 9) {
                            ajax = new moxie.xhr.XMLHttpRequest();
                            moxie.core.utils.Env.swf_url = op.flash_swf_url;
                        } else {
                            ajax = that.createAjax();
                        }
                        ajax.open('POST', url, true);
                        ajax.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
                        ajax.setRequestHeader('Authorization', 'UpToken ' + that.token);
                        var onreadystatechange = function () {
                            logger.debug("ajax.readyState: ", ajax.readyState);
                            if (ajax.readyState === 4) {
                                localStorage.removeItem(file.name);
                                var ajaxInfo;
                                if (ajax.status === 200) {
                                    ajaxInfo = {
                                        status: ajax.status,
                                        response: ajax.responseText,
                                        responseHeaders: ajax.getAllResponseHeaders()
                                    };
                                    logger.debug("mkfile is success: ", ajaxInfo);
                                    last_step(up, file, ajaxInfo);
                                } else {
                                    ajaxInfo = {
                                        status: ajax.status,
                                        response: ajax.responseText,
                                        file: file,
                                        code: -200,
                                        responseHeaders: ajax.getAllResponseHeaders()
                                    };
                                    logger.debug("mkfile is error: ", ajaxInfo);
                                    uploader.trigger('Error', ajaxInfo);
                                }
                            }
                        };
                        if (ie && ie <= 9) {
                            ajax.bind('readystatechange', onreadystatechange);
                        } else {
                            ajax.onreadystatechange = onreadystatechange;
                        }
                        ajax.send(ctx);
                        logger.debug("mkfile: ", url);
                    } else {
                        last_step(up, file, info);
                    }
                };
            }(_FileUploaded_Handler));

            logger.debug("bind FileUploaded event");

            // init uploader
            uploader.init();
            logger.debug("invoke uploader.init()");

            logger.debug("init uploader end");

            return uploader;
        };

        /**
         * get url by key
         * @param  {String} key of file
         * @return {String} url of file
         */
        this.getUrl = function (key) {
            if (!key) {
                return false;
            }
            key = encodeURI(key);
            var domain = this.domain;
            if (domain.slice(domain.length - 1) !== '/') {
                domain = domain + '/';
            }
            return domain + key;
        };

        /**
         * invoke the imageView2 api of Qiniu
         * @param  {Object} api params
         * @param  {String} key of file
         * @return {String} url of processed image
         */
        this.imageView2 = function (op, key) {

            if (!/^\d$/.test(op.mode)) {
                return false;
            }

            var mode = op.mode,
                w = op.w || '',
                h = op.h || '',
                q = op.q || '',
                format = op.format || '';

            if (!w && !h) {
                return false;
            }

            var imageUrl = 'imageView2/' + mode;
            imageUrl += w ? '/w/' + w : '';
            imageUrl += h ? '/h/' + h : '';
            imageUrl += q ? '/q/' + q : '';
            imageUrl += format ? '/format/' + format : '';
            if (key) {
                imageUrl = this.getUrl(key) + '?' + imageUrl;
            }
            return imageUrl;
        };

        /**
         * invoke the imageMogr2 api of Qiniu
         * @param  {Object} api params
         * @param  {String} key of file
         * @return {String} url of processed image
         */
        this.imageMogr2 = function (op, key) {
            var auto_orient = op['auto-orient'] || '',
                thumbnail = op.thumbnail || '',
                strip = op.strip || '',
                gravity = op.gravity || '',
                crop = op.crop || '',
                quality = op.quality || '',
                rotate = op.rotate || '',
                format = op.format || '',
                blur = op.blur || '';
            //Todo check option

            var imageUrl = 'imageMogr2';

            imageUrl += auto_orient ? '/auto-orient' : '';
            imageUrl += thumbnail ? '/thumbnail/' + thumbnail : '';
            imageUrl += strip ? '/strip' : '';
            imageUrl += gravity ? '/gravity/' + gravity : '';
            imageUrl += quality ? '/quality/' + quality : '';
            imageUrl += crop ? '/crop/' + crop : '';
            imageUrl += rotate ? '/rotate/' + rotate : '';
            imageUrl += format ? '/format/' + format : '';
            imageUrl += blur ? '/blur/' + blur : '';

            if (key) {
                imageUrl = this.getUrl(key) + '?' + imageUrl;
            }
            return imageUrl;
        };

        /**
         * invoke the watermark api of Qiniu
         * @param  {Object} api params
         * @param  {String} key of file
         * @return {String} url of processed image
         */
        this.watermark = function (op, key) {
            var mode = op.mode;
            if (!mode) {
                return false;
            }

            var imageUrl = 'watermark/' + mode;

            if (mode === 1) {
                var image = op.image || '';
                if (!image) {
                    return false;
                }
                imageUrl += image ? '/image/' + this.URLSafeBase64Encode(image) : '';
            } else if (mode === 2) {
                var text = op.text ? op.text : '',
                    font = op.font ? op.font : '',
                    fontsize = op.fontsize ? op.fontsize : '',
                    fill = op.fill ? op.fill : '';
                if (!text) {
                    return false;
                }
                imageUrl += text ? '/text/' + this.URLSafeBase64Encode(text) : '';
                imageUrl += font ? '/font/' + this.URLSafeBase64Encode(font) : '';
                imageUrl += fontsize ? '/fontsize/' + fontsize : '';
                imageUrl += fill ? '/fill/' + this.URLSafeBase64Encode(fill) : '';
            } else {
                // Todo mode3
                return false;
            }

            var dissolve = op.dissolve || '',
                gravity = op.gravity || '',
                dx = op.dx || '',
                dy = op.dy || '';

            imageUrl += dissolve ? '/dissolve/' + dissolve : '';
            imageUrl += gravity ? '/gravity/' + gravity : '';
            imageUrl += dx ? '/dx/' + dx : '';
            imageUrl += dy ? '/dy/' + dy : '';

            if (key) {
                imageUrl = this.getUrl(key) + '?' + imageUrl;
            }
            return imageUrl;
        };

        /**
         * invoke the imageInfo api of Qiniu
         * @param  {String} key of file
         * @return {Object} image info
         */
        this.imageInfo = function (key) {
            if (!key) {
                return false;
            }
            var url = this.getUrl(key) + '?imageInfo';
            var xhr = this.createAjax();
            var info;
            var that = this;
            xhr.open('GET', url, false);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    info = that.parseJSON(xhr.responseText);
                }
            };
            xhr.send();
            return info;
        };

        /**
         * invoke the exif api of Qiniu
         * @param  {String} key of file
         * @return {Object} image exif
         */
        this.exif = function (key) {
            if (!key) {
                return false;
            }
            var url = this.getUrl(key) + '?exif';
            var xhr = this.createAjax();
            var info;
            var that = this;
            xhr.open('GET', url, false);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    info = that.parseJSON(xhr.responseText);
                }
            };
            xhr.send();
            return info;
        };

        /**
         * invoke the exif or imageInfo api of Qiniu
         * according with type param
         * @param  {String} ['exif'|'imageInfo']type of info
         * @param  {String} key of file
         * @return {Object} image exif or info
         */
        this.get = function (type, key) {
            if (!key || !type) {
                return false;
            }
            if (type === 'exif') {
                return this.exif(key);
            } else if (type === 'imageInfo') {
                return this.imageInfo(key);
            }
            return false;
        };

        /**
         * invoke api of Qiniu like a pipeline
         * @param  {Array of Object} params of a series api call
         * each object in array is options of api which name is set as 'fop' property
         * each api's output will be next api's input
         * @param  {String} key of file
         * @return {String|Boolean} url of processed image
         */
        this.pipeline = function (arr, key) {
            var isArray = Object.prototype.toString.call(arr) === '[object Array]';
            var option,
                errOp,
                imageUrl = '';
            if (isArray) {
                for (var i = 0, len = arr.length; i < len; i++) {
                    option = arr[i];
                    if (!option.fop) {
                        return false;
                    }
                    switch (option.fop) {
                        case 'watermark':
                            imageUrl += this.watermark(option) + '|';
                            break;
                        case 'imageView2':
                            imageUrl += this.imageView2(option) + '|';
                            break;
                        case 'imageMogr2':
                            imageUrl += this.imageMogr2(option) + '|';
                            break;
                        default:
                            errOp = true;
                            break;
                    }
                    if (errOp) {
                        return false;
                    }
                }
                if (key) {
                    imageUrl = this.getUrl(key) + '?' + imageUrl;
                    var length = imageUrl.length;
                    if (imageUrl.slice(length - 1) === '|') {
                        imageUrl = imageUrl.slice(0, length - 1);
                    }
                }
                return imageUrl;
            }
            return false;
        };
    }

    var Qiniu = new QiniuJsSDK();

    global.Qiniu = Qiniu;

    global.QiniuJsSDK = QiniuJsSDK;
})(window);

// import './plupload.min.js';
// import './qiniu-sdk.js';
window.moxie = moxie$1;
window.plupload = plupload$1;

// import conf from '../../qiniu.conf';
const domain = public_conf.DOMAIN_NAME;

const nameSpace = 'testUpload';

const random = () => Math.random() * 1e5 | 0;

const getName = () => {
  return nameSpace + '/' + new Date().toLocaleDateString() + '/' + random() + '/';
};

var uploader = Qiniu.uploader({
    runtimes: 'html5,flash,html4', // 上传模式,依次退化
    browse_button: 'pickfiles', // 上传选择的点选按钮，**必需**
    // 在初始化时，uptoken, uptoken_url, uptoken_func 三个参数中必须有一个被设置
    // 切如果提供了多个，其优先级为 uptoken > uptoken_url > uptoken_func
    // 其中 uptoken 是直接提供上传凭证，uptoken_url 是提供了获取上传凭证的地址，如果需要定制获取 uptoken 的过程则可以设置 uptoken_func
    // uptoken : '<Your upload token>', // uptoken 是上传凭证，由其他程序生成
    uptoken_url: '/getToken', // Ajax 请求 uptoken 的 Url，**强烈建议设置**（服务端提供）
    uptoken_func: function (file) {
        // 在需要获取 uptoken 时，该方法会被调用
        // do something
        return uptoken + file;
    },
    // get_new_uptoken: true,             // 设置上传文件的时候是否每次都重新获取新的 uptoken
    // downtoken_url: '/downtoken',
    // Ajax请求downToken的Url，私有空间时使用,JS-SDK 将向该地址POST文件的key和domain,服务端返回的JSON必须包含`url`字段，`url`值为该文件的下载地址
    unique_names: false, // 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）
    // save_key: true,                  // 默认 false。若在服务端生成 uptoken 的上传策略中指定了 `save_key`，则开启，SDK在前端将不对key进行任何处理
    // domain: 'https://assets.noteawesome.com/',     // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
    domain: domain, // bucket 域名，下载资源时用到，如：'http://xxx.bkt.clouddn.com/' **必需**
    container: 'container', // 上传区域 DOM ID，默认是 browser_button 的父元素，
    max_file_size: '100mb', // 最大文件体积限制
    // flash_swf_url: 'path/of/plupload/Moxie.swf',  //引入 flash,相对路径
    max_retries: 3, // 上传失败最大重试次数
    dragdrop: true, // 开启可拖曳上传
    drop_element: 'container', // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
    chunk_size: '4mb', // 分块上传时，每块的体积
    auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
    //x_vars : {
    //    自定义变量，参考http://developer.qiniu.com/docs/v6/api/overview/up/response/vars.html
    //    'time' : function(up,file) {
    //        var time = (new Date()).getTime();
    // do something with 'time'
    //        return time;
    //    },
    //    'size' : function(up,file) {
    //        var size = file.size;
    // do something with 'size'
    //        return size;
    //    }
    //},
    init: {
        'FilesAdded': function (up, files) {
            plupload.each(files, function (file) {
                // console.info('FilesAdded => ', file);
                // 文件添加进队列后,处理相关的事情
            });
        },
        'BeforeUpload': function (up, file) {
            // console.info('BeforeUpload => ', up, file);
            // 每个文件上传前,处理相关的事情
        },
        'UploadProgress': function (up, file) {
            // console.info('UploadProgress => ', up, file);

            // 每个文件上传时,处理相关的事情
        },
        'FileUploaded': function (up, file, info) {
            // file.info = info;
            // console.info('FileUploaded => ', up, file, info);
            // 每个文件上传成功后,处理相关的事情
            // 其中 info 是文件上传成功后，服务端返回的json，形式如
            // {
            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
            //    "key": "gogopher.jpg"
            //  }
            // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
            var domain$$1 = up.getOption('domain');
            var res = JSON.parse(info.response);
            var sourceLink = domain$$1 + res.key; //获取上传成功后的文件的Url
            file.sourceLink = sourceLink;
        },
        'Error': function (up, err, errTip) {
            // console.info('Error => ', err, err, errTip);
            //上传出错时,处理相关的事情
        },
        'UploadComplete': function () {
            // console.info('UploadComplete => ', arguments);
            //队列文件处理完毕后,处理相关的事情
        },
        'Key': function (up, file) {
            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
            // 该配置必须要在 unique_names: false , save_key: false 时才生效
            return getName() + file.name;
            // var key = Date.now() + '/' + file.name;
            // do something with key here
            // return key
        }
    }
});
window.uploader = uploader;

const $pasteEle = document.getElementById('paste');

$pasteEle.addEventListener('paste', e => {
  const items = e.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    // 检测是否为图片类型
    if (item.kind == "file" && /image\//.test(item.type)) {
      const file = item.getAsFile();
      window.uploader.addFile(file);
      break;
    }
  }
});

window.vueUploader = new vue({
  el: '#upload-data',
  render: h => h(App)
});

}());
//# sourceMappingURL=index.js.map
