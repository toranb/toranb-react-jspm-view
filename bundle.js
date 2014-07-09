"format register";

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/events", [], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/events";
  var $__default;
  function indexOf(callbacks, callback) {
    for (var i = 0,
        l = callbacks.length; i < l; i++) {
      if (callbacks[i] === callback) {
        return i;
      }
    }
    return -1;
  }
  function callbacksFor(object) {
    var callbacks = object._promiseCallbacks;
    if (!callbacks) {
      callbacks = object._promiseCallbacks = {};
    }
    return callbacks;
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      ;
      $__default = {
        mixin: function(object) {
          object.on = this.on;
          object.off = this.off;
          object.trigger = this.trigger;
          object._promiseCallbacks = undefined;
          return object;
        },
        on: function(eventName, callback) {
          var allCallbacks = callbacksFor(this),
              callbacks;
          callbacks = allCallbacks[eventName];
          if (!callbacks) {
            callbacks = allCallbacks[eventName] = [];
          }
          if (indexOf(callbacks, callback) === -1) {
            callbacks.push(callback);
          }
        },
        off: function(eventName, callback) {
          var allCallbacks = callbacksFor(this),
              callbacks,
              index;
          if (!callback) {
            allCallbacks[eventName] = [];
            return;
          }
          callbacks = allCallbacks[eventName];
          index = indexOf(callbacks, callback);
          if (index !== -1) {
            callbacks.splice(index, 1);
          }
        },
        trigger: function(eventName, options) {
          var allCallbacks = callbacksFor(this),
              callbacks,
              callbackTuple,
              callback,
              binding;
          if (callbacks = allCallbacks[eventName]) {
            for (var i = 0; i < callbacks.length; i++) {
              callback = callbacks[i];
              callback(options);
            }
          }
        }
      };
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/utils", [], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/utils";
  var _isArray,
      isArray,
      now,
      o_create;
  function objectOrFunction(x) {
    return typeof x === "function" || (typeof x === "object" && x !== null);
  }
  function isFunction(x) {
    return typeof x === "function";
  }
  function isMaybeThenable(x) {
    return typeof x === 'object' && x !== null;
  }
  return {
    exports: {
      get objectOrFunction() {
        return objectOrFunction;
      },
      get isFunction() {
        return isFunction;
      },
      get isMaybeThenable() {
        return isMaybeThenable;
      },
      get isArray() {
        return isArray;
      },
      get now() {
        return now;
      },
      get o_create() {
        return o_create;
      },
      set objectOrFunction(value) {
        objectOrFunction = value;
      },
      set isFunction(value) {
        isFunction = value;
      },
      set isMaybeThenable(value) {
        isMaybeThenable = value;
      },
      set isArray(value) {
        isArray = value;
      },
      set now(value) {
        now = value;
      },
      set o_create(value) {
        o_create = value;
      }
    },
    execute: function() {
      ;
      ;
      ;
      if (!Array.isArray) {
        _isArray = function(x) {
          return Object.prototype.toString.call(x) === "[object Array]";
        };
      } else {
        _isArray = Array.isArray;
      }
      isArray = _isArray;
      now = Date.now || function() {
        return new Date().getTime();
      };
      o_create = (Object.create || function(object) {
        var o = function() {};
        o.prototype = object;
        return o;
      });
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/-internal", ["./utils", "./instrument", "./config"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/-internal";
  var PENDING,
      FULFILLED,
      REJECTED,
      GET_THEN_ERROR,
      TRY_CATCH_ERROR;
  function noop() {}
  function getThen(promise) {
    try {
      return promise.then;
    } catch (error) {
      GET_THEN_ERROR.error = error;
      return GET_THEN_ERROR;
    }
  }
  function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
    try {
      then.call(value, fulfillmentHandler, rejectionHandler);
    } catch (e) {
      return e;
    }
  }
  function handleForeignThenable(promise, thenable, then) {
    $__0[2]["config"].async(function(promise) {
      var sealed = false;
      var error = tryThen(then, thenable, function(value) {
        if (sealed) {
          return;
        }
        sealed = true;
        if (thenable !== value) {
          resolve(promise, value);
        } else {
          fulfill(promise, value);
        }
      }, function(reason) {
        if (sealed) {
          return;
        }
        sealed = true;
        reject(promise, reason);
      }, 'Settle: ' + (promise._label || ' unknown promise'));
      if (!sealed && error) {
        sealed = true;
        reject(promise, error);
      }
    }, promise);
  }
  function handleOwnThenable(promise, thenable) {
    if (thenable._state === FULFILLED) {
      fulfill(promise, thenable._result);
    } else if (promise._state === REJECTED) {
      reject(promise, thenable._result);
    } else {
      subscribe(thenable, undefined, function(value) {
        if (thenable !== value) {
          resolve(promise, value);
        } else {
          fulfill(promise, value);
        }
      }, function(reason) {
        reject(promise, reason);
      });
    }
  }
  function handleMaybeThenable(promise, maybeThenable) {
    if (maybeThenable instanceof promise.constructor) {
      handleOwnThenable(promise, maybeThenable);
    } else {
      var then = getThen(maybeThenable);
      if (then === GET_THEN_ERROR) {
        reject(promise, GET_THEN_ERROR.error);
      } else if (then === undefined) {
        fulfill(promise, maybeThenable);
      } else if ($__0[0]["isFunction"](then)) {
        handleForeignThenable(promise, maybeThenable, then);
      } else {
        fulfill(promise, maybeThenable);
      }
    }
  }
  function resolve(promise, value) {
    if (promise === value) {
      fulfill(promise, value);
    } else if ($__0[0]["objectOrFunction"](value)) {
      handleMaybeThenable(promise, value);
    } else {
      fulfill(promise, value);
    }
  }
  function publishRejection(promise) {
    if (promise._onerror) {
      promise._onerror(promise._result);
    }
    publish(promise);
  }
  function fulfill(promise, value) {
    if (promise._state !== PENDING) {
      return;
    }
    promise._result = value;
    promise._state = FULFILLED;
    if (promise._subscribers.length === 0) {
      if ($__0[2]["config"].instrument) {
        $__0[1]["default"]('fulfilled', promise);
      }
    } else {
      $__0[2]["config"].async(publish, promise);
    }
  }
  function reject(promise, reason) {
    if (promise._state !== PENDING) {
      return;
    }
    promise._state = REJECTED;
    promise._result = reason;
    $__0[2]["config"].async(publishRejection, promise);
  }
  function subscribe(parent, child, onFulfillment, onRejection) {
    var subscribers = parent._subscribers;
    var length = subscribers.length;
    subscribers[length] = child;
    subscribers[length + FULFILLED] = onFulfillment;
    subscribers[length + REJECTED] = onRejection;
    if (length === 0 && parent._state) {
      $__0[2]["config"].async(publish, parent);
    }
  }
  function publish(promise) {
    var subscribers = promise._subscribers;
    var settled = promise._state;
    if ($__0[2]["config"].instrument) {
      $__0[1]["default"](settled === FULFILLED ? 'fulfilled' : 'rejected', promise);
    }
    if (subscribers.length === 0) {
      return;
    }
    var child,
        callback,
        detail = promise._result;
    for (var i = 0; i < subscribers.length; i += 3) {
      child = subscribers[i];
      callback = subscribers[i + settled];
      if (child) {
        invokeCallback(settled, child, callback, detail);
      } else {
        callback(detail);
      }
    }
    promise._subscribers.length = 0;
  }
  function ErrorObject() {
    this.error = null;
  }
  function tryCatch(callback, detail) {
    try {
      return callback(detail);
    } catch (e) {
      TRY_CATCH_ERROR.error = e;
      return TRY_CATCH_ERROR;
    }
  }
  function invokeCallback(settled, promise, callback, detail) {
    var hasCallback = $__0[0]["isFunction"](callback),
        value,
        error,
        succeeded,
        failed;
    if (hasCallback) {
      value = tryCatch(callback, detail);
      if (value === TRY_CATCH_ERROR) {
        failed = true;
        error = value.error;
        value = null;
      } else {
        succeeded = true;
      }
      if (promise === value) {
        reject(promise, new TypeError('A promises callback cannot return that same promise.'));
        return;
      }
    } else {
      value = detail;
      succeeded = true;
    }
    if (promise._state !== PENDING) {} else if (hasCallback && succeeded) {
      resolve(promise, value);
    } else if (failed) {
      reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      reject(promise, value);
    }
  }
  function initializePromise(promise, resolver) {
    try {
      resolver(function resolvePromise(value) {
        resolve(promise, value);
      }, function rejectPromise(reason) {
        reject(promise, reason);
      });
    } catch (e) {
      reject(promise, e);
    }
  }
  return {
    exports: {
      get noop() {
        return noop;
      },
      get resolve() {
        return resolve;
      },
      get reject() {
        return reject;
      },
      get fulfill() {
        return fulfill;
      },
      get subscribe() {
        return subscribe;
      },
      get publish() {
        return publish;
      },
      get publishRejection() {
        return publishRejection;
      },
      get initializePromise() {
        return initializePromise;
      },
      get invokeCallback() {
        return invokeCallback;
      },
      get FULFILLED() {
        return FULFILLED;
      },
      get REJECTED() {
        return REJECTED;
      },
      set noop(value) {
        noop = value;
      },
      set resolve(value) {
        resolve = value;
      },
      set reject(value) {
        reject = value;
      },
      set fulfill(value) {
        fulfill = value;
      },
      set subscribe(value) {
        subscribe = value;
      },
      set publish(value) {
        publish = value;
      },
      set publishRejection(value) {
        publishRejection = value;
      },
      set initializePromise(value) {
        initializePromise = value;
      },
      set invokeCallback(value) {
        invokeCallback = value;
      },
      set FULFILLED(value) {
        FULFILLED = value;
      },
      set REJECTED(value) {
        REJECTED = value;
      }
    },
    execute: function() {
      ;
      ;
      ;
      ;
      PENDING = void 0;
      FULFILLED = 1;
      REJECTED = 2;
      GET_THEN_ERROR = new ErrorObject();
      ;
      ;
      ;
      ;
      ;
      ;
      ;
      ;
      ;
      ;
      ;
      ;
      TRY_CATCH_ERROR = new ErrorObject();
      ;
      ;
      ;
      ;
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/promise/resolve", ["../-internal"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/promise/resolve";
  var $__default;
  function resolve(object, label) {
    var Constructor = this;
    if (object && typeof object === 'object' && object.constructor === Constructor) {
      return object;
    }
    var promise = new Constructor($__0[0]["noop"], label);
    $__0[0]["resolve"](promise, object);
    return promise;
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      ;
      $__default = resolve;
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/enumerator", ["./utils", "./-internal"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/enumerator";
  var ABORT_ON_REJECTION,
      $__default;
  function makeSettledResult(state, position, value) {
    if (state === $__0[1]["FULFILLED"]) {
      return {
        state: 'fulfilled',
        value: value
      };
    } else {
      return {
        state: 'rejected',
        reason: value
      };
    }
  }
  function Enumerator(Constructor, input, abortOnReject, label) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor($__0[1]["noop"], label);
    this._abortOnReject = abortOnReject;
    if (this._validateInput(input)) {
      this._input = input;
      this.length = input.length;
      this._remaining = input.length;
      this._init();
      if (this.length === 0) {
        $__0[1]["fulfill"](this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate();
        if (this._remaining === 0) {
          $__0[1]["fulfill"](this.promise, this._result);
        }
      }
    } else {
      $__0[1]["reject"](this.promise, this._validationError());
    }
  }
  return {
    exports: {
      get ABORT_ON_REJECTION() {
        return ABORT_ON_REJECTION;
      },
      get makeSettledResult() {
        return makeSettledResult;
      },
      get default() {
        return $__default;
      },
      set ABORT_ON_REJECTION(value) {
        ABORT_ON_REJECTION = value;
      },
      set makeSettledResult(value) {
        makeSettledResult = value;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      ;
      ABORT_ON_REJECTION = true;
      ;
      ;
      Enumerator.prototype._validateInput = function(input) {
        return $__0[0]["isArray"](input);
      };
      Enumerator.prototype._validationError = function() {
        return new Error("Array Methods must be provided an Array");
      };
      Enumerator.prototype._init = function() {
        this._result = new Array(this.length);
      };
      $__default = Enumerator;
      Enumerator.prototype._enumerate = function() {
        var length = this.length;
        var promise = this.promise;
        var input = this._input;
        for (var i = 0; promise._state === $__0[1]["PENDING"] && i < length; i++) {
          this._eachEntry(input[i], i);
        }
      };
      Enumerator.prototype._eachEntry = function(entry, i) {
        var c = this._instanceConstructor;
        if ($__0[0]["isMaybeThenable"](entry)) {
          if (entry.constructor === c && entry._state !== $__0[1]["PENDING"]) {
            this._settledAt(entry._state, i, entry._result);
          } else {
            this._willSettleAt(c.resolve(entry), i);
          }
        } else {
          this._remaining--;
          this._result[i] = this._makeResult($__0[1]["FULFILLED"], i, entry);
        }
      };
      Enumerator.prototype._settledAt = function(state, i, value) {
        var promise = this.promise;
        if (promise._state === $__0[1]["PENDING"]) {
          this._remaining--;
          if (this._abortOnReject && state === $__0[1]["REJECTED"]) {
            $__0[1]["reject"](promise, value);
          } else {
            this._result[i] = this._makeResult(state, i, value);
          }
        }
        if (this._remaining === 0) {
          $__0[1]["fulfill"](promise, this._result);
        }
      };
      Enumerator.prototype._makeResult = function(state, i, value) {
        return value;
      };
      Enumerator.prototype._willSettleAt = function(promise, i) {
        var enumerator = this;
        $__0[1]["subscribe"](promise, undefined, function(value) {
          enumerator._settledAt($__0[1]["FULFILLED"], i, value);
        }, function(reason) {
          enumerator._settledAt($__0[1]["REJECTED"], i, reason);
        });
      };
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/promise/race", ["../utils", "../-internal"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/promise/race";
  var $__default;
  function race(entries, label) {
    var Constructor = this,
        entry;
    var promise = new Constructor($__0[1]["noop"], label);
    if (!$__0[0]["isArray"](entries)) {
      $__0[1]["reject"](promise, new TypeError('You must pass an array to race.'));
      return promise;
    }
    var length = entries.length;
    function onFulfillment(value) {
      $__0[1]["resolve"](promise, value);
    }
    function onRejection(reason) {
      $__0[1]["reject"](promise, reason);
    }
    for (var i = 0; promise._state === $__0[1]["PENDING"] && i < length; i++) {
      $__0[1]["subscribe"](Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
    }
    return promise;
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      ;
      ;
      $__default = race;
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/promise/reject", ["../-internal"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/promise/reject";
  var $__default;
  function reject(reason, label) {
    var Constructor = this;
    var promise = new Constructor($__0[0]["noop"], label);
    $__0[0]["reject"](promise, reason);
    return promise;
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      ;
      $__default = reject;
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/node", ["./promise", "./utils"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/node";
  var $__default;
  function denodeify(nodeFunc, argumentNames) {
    var asArray = argumentNames === true;
    var asHash = $__0[1]["isArray"](argumentNames);
    function denodeifiedFunction() {
      var nodeArgs = arraySlice(arguments);
      var thisArg;
      if (!asArray && !asHash && argumentNames) {
        if (typeof console === 'object') {
          console.warn('Deprecation: RSVP.denodeify() doesn\'t allow setting the ' + '"this" binding anymore. Use yourFunction.bind(yourThis) instead.');
        }
        thisArg = argumentNames;
      } else {
        thisArg = this;
      }
      return $__0[0]["default"].all(nodeArgs).then(function(nodeArgs) {
        return new $__0[0]["default"](resolver);
        function resolver(resolve, reject) {
          function callback() {
            var args = arraySlice(arguments);
            var error = args[0];
            var value = args[1];
            if (error) {
              reject(error);
            } else if (asArray) {
              resolve(args.slice(1));
            } else if (asHash) {
              var obj = {};
              var successArguments = args.slice(1);
              var name;
              var i;
              for (i = 0; i < argumentNames.length; i++) {
                name = argumentNames[i];
                obj[name] = successArguments[i];
              }
              resolve(obj);
            } else {
              resolve(value);
            }
          }
          nodeArgs.push(callback);
          nodeFunc.apply(thisArg, nodeArgs);
        }
      });
    }
    denodeifiedFunction.__proto__ = nodeFunc;
    return denodeifiedFunction;
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      ;
      ;
      $__default = denodeify;
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/all", ["./promise"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/all";
  var $__default;
  function all(array, label) {
    return $__0[0]["default"].all(array, label);
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      ;
      $__default = all;
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/all-settled", ["./enumerator", "./promise", "./utils"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/all-settled";
  var $__default;
  function AllSettled(Constructor, entries, label) {
    this._superConstructor(Constructor, entries, false, label);
  }
  function allSettled(entries, label) {
    return new AllSettled($__0[1]["default"], entries, label).promise;
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      ;
      ;
      ;
      ;
      AllSettled.prototype = $__0[2]["o_create"]($__0[0]["default"].prototype);
      AllSettled.prototype._superConstructor = $__0[0]["default"];
      AllSettled.prototype._makeResult = $__0[0]["makeSettledResult"];
      AllSettled.prototype._validationError = function() {
        return new Error("allSettled must be called with an array");
      };
      ;
      $__default = allSettled;
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/race", ["./promise"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/race";
  var $__default;
  function race(array, label) {
    return $__0[0]["default"].race(array, label);
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      ;
      $__default = race;
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/promise-hash", ["./enumerator", "./-internal", "./utils"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/promise-hash";
  var $__default;
  function PromiseHash(Constructor, object, label) {
    this._superConstructor(Constructor, object, true, label);
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      ;
      ;
      ;
      $__default = PromiseHash;
      PromiseHash.prototype = $__0[2]["o_create"]($__0[0]["default"].prototype);
      PromiseHash.prototype._superConstructor = $__0[0]["default"];
      PromiseHash.prototype._init = function() {
        this._result = {};
      };
      PromiseHash.prototype._validateInput = function(input) {
        return input && typeof input === "object";
      };
      PromiseHash.prototype._validationError = function() {
        return new Error("Promise.hash must be called with an object");
      };
      PromiseHash.prototype._enumerate = function() {
        var promise = this.promise;
        var input = this._input;
        var results = [];
        for (var key in input) {
          if (promise._state === $__0[1]["PENDING"] && input.hasOwnProperty(key)) {
            results.push({
              position: key,
              entry: input[key]
            });
          }
        }
        var length = results.length;
        this._remaining = length;
        var result;
        for (var i = 0; promise._state === $__0[1]["PENDING"] && i < length; i++) {
          result = results[i];
          this._eachEntry(result.entry, result.position);
        }
      };
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/hash-settled", ["./promise", "./enumerator", "./promise-hash", "./utils"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/hash-settled";
  var $__default;
  function HashSettled(Constructor, object, label) {
    this._superConstructor(Constructor, object, false, label);
  }
  function hashSettled(object, label) {
    return new HashSettled($__0[0]["default"], object, label).promise;
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      ;
      ;
      ;
      ;
      ;
      HashSettled.prototype = $__0[3]["o_create"]($__0[2]["default"].prototype);
      HashSettled.prototype._superConstructor = $__0[1]["default"];
      HashSettled.prototype._makeResult = $__0[1]["makeSettledResult"];
      HashSettled.prototype._validationError = function() {
        return new Error("hashSettled must be called with an object");
      };
      ;
      $__default = hashSettled;
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/rethrow", [], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/rethrow";
  var $__default;
  function rethrow(reason) {
    setTimeout(function() {
      throw reason;
    });
    throw reason;
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      $__default = rethrow;
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/defer", ["./promise"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/defer";
  var $__default;
  function defer(label) {
    var deferred = {};
    deferred.promise = new $__0[0]["default"](function(resolve, reject) {
      deferred.resolve = resolve;
      deferred.reject = reject;
    }, label);
    return deferred;
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      ;
      $__default = defer;
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/map", ["./promise", "./utils"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/map";
  var $__default;
  function map(promises, mapFn, label) {
    return $__0[0]["default"].all(promises, label).then(function(values) {
      if (!$__0[1]["isFunction"](mapFn)) {
        throw new TypeError("You must pass a function as map's second argument.");
      }
      var length = values.length;
      var results = new Array(length);
      for (var i = 0; i < length; i++) {
        results[i] = mapFn(values[i]);
      }
      return $__0[0]["default"].all(results, label);
    });
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      ;
      ;
      $__default = map;
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/resolve", ["./promise"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/resolve";
  var $__default;
  function resolve(value, label) {
    return $__0[0]["default"].resolve(value, label);
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      ;
      $__default = resolve;
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/reject", ["./promise"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/reject";
  var $__default;
  function reject(reason, label) {
    return $__0[0]["default"].reject(reason, label);
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      ;
      $__default = reject;
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/filter", ["./promise", "./utils"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/filter";
  var $__default;
  function filter(promises, filterFn, label) {
    return $__0[0]["default"].all(promises, label).then(function(values) {
      if (!$__0[1]["isFunction"](filterFn)) {
        throw new TypeError("You must pass a function as filter's second argument.");
      }
      var length = values.length;
      var filtered = new Array(length);
      for (var i = 0; i < length; i++) {
        filtered[i] = filterFn(values[i]);
      }
      return $__0[0]["default"].all(filtered, label).then(function(filtered) {
        var results = new Array(length);
        var newLength = 0;
        for (var i = 0; i < length; i++) {
          if (filtered[i]) {
            results[newLength] = values[i];
            newLength++;
          }
        }
        results.length = newLength;
        return results;
      });
    });
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      ;
      ;
      $__default = filter;
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/asap", [], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/asap";
  var length,
      $__default,
      browserGlobal,
      BrowserMutationObserver,
      isWorker,
      queue,
      scheduleFlush;
  function asap(callback, arg) {
    queue[length] = callback;
    queue[length + 1] = arg;
    length += 2;
    if (length === 2) {
      scheduleFlush();
    }
  }
  function useNextTick() {
    return function() {
      process.nextTick(flush);
    };
  }
  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, {characterData: true});
    return function() {
      node.data = (iterations = ++iterations % 2);
    };
  }
  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function() {
      channel.port2.postMessage(0);
    };
  }
  function useSetTimeout() {
    return function() {
      setTimeout(flush, 1);
    };
  }
  function flush() {
    for (var i = 0; i < length; i += 2) {
      var callback = queue[i];
      var arg = queue[i + 1];
      callback(arg);
      queue[i] = undefined;
      queue[i + 1] = undefined;
    }
    length = 0;
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      length = 0;
      ;
      $__default = asap;
      browserGlobal = (typeof window !== 'undefined') ? window : {};
      BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
      isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';
      ;
      ;
      ;
      ;
      queue = new Array(1000);
      ;
      if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
        scheduleFlush = useNextTick();
      } else if (BrowserMutationObserver) {
        scheduleFlush = useMutationObserver();
      } else if (isWorker) {
        scheduleFlush = useMessageChannel();
      } else {
        scheduleFlush = useSetTimeout();
      }
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/config", ["./events"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/config";
  var config;
  function configure(name, value) {
    if (name === 'onerror') {
      config.on('error', value);
      return;
    }
    if (arguments.length === 2) {
      config[name] = value;
    } else {
      return config[name];
    }
  }
  return {
    exports: {
      get config() {
        return config;
      },
      get configure() {
        return configure;
      },
      set config(value) {
        config = value;
      },
      set configure(value) {
        configure = value;
      }
    },
    execute: function() {
      ;
      config = {instrument: false};
      $__0[0]["default"].mixin(config);
      ;
      ;
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/instrument", ["./config", "./utils"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/instrument";
  var queue,
      $__default;
  function instrument(eventName, promise, child) {
    if (1 === queue.push({
      name: eventName,
      payload: {
        guid: promise._guidKey + promise._id,
        eventName: eventName,
        detail: promise._result,
        childGuid: child && promise._guidKey + child._id,
        label: promise._label,
        timeStamp: $__0[1]["now"](),
        stack: new Error(promise._label).stack
      }
    })) {
      setTimeout(function() {
        var entry;
        for (var i = 0; i < queue.length; i++) {
          entry = queue[i];
          $__0[0]["config"].trigger(entry.name, entry.payload);
        }
        queue.length = 0;
      }, 50);
    }
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      ;
      queue = [];
      ;
      $__default = instrument;
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/promise/cast", ["./resolve"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/promise/cast";
  var $__default;
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      $__default = $__0[0]["default"];
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/promise/all", ["../enumerator"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/promise/all";
  var $__default;
  function all(entries, label) {
    return new $__0[0]["default"](this, entries, true, label).promise;
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      ;
      $__default = all;
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/hash", ["./promise", "./promise-hash", "./enumerator"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/hash";
  var $__default;
  function hash(object, label) {
    return new $__0[1]["default"]($__0[0]["default"], object, label).promise;
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      ;
      ;
      ;
      $__default = hash;
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp/promise", ["./config", "./events", "./instrument", "./utils", "./-internal", "./promise/cast", "./promise/all", "./promise/race", "./promise/resolve", "./promise/reject"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp/promise";
  var guidKey,
      counter,
      $__default;
  function needsResolver() {
    throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
  }
  function needsNew() {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
  }
  function Promise(resolver, label) {
    this._id = counter++;
    this._label = label;
    this._subscribers = [];
    if ($__0[0]["config"].instrument) {
      $__0[2]["default"]('created', this);
    }
    if ($__0[4]["noop"] !== resolver) {
      if (!$__0[3]["isFunction"](resolver)) {
        needsResolver();
      }
      if (!(this instanceof Promise)) {
        needsNew();
      }
      $__0[4]["initializePromise"](this, resolver);
    }
  }
  return {
    exports: {
      get default() {
        return $__default;
      },
      set default(value) {
        $__default = value;
      }
    },
    execute: function() {
      ;
      ;
      ;
      ;
      ;
      ;
      ;
      ;
      ;
      ;
      guidKey = 'rsvp_' + $__0[3]["now"]() + '-';
      counter = 0;
      ;
      ;
      $__default = Promise;
      ;
      Promise.cast = $__0[5]["default"];
      Promise.all = $__0[6]["default"];
      Promise.race = $__0[7]["default"];
      Promise.resolve = $__0[8]["default"];
      Promise.reject = $__0[9]["default"];
      Promise.prototype = {
        constructor: Promise,
        _id: undefined,
        _guidKey: guidKey,
        _label: undefined,
        _state: undefined,
        _result: undefined,
        _subscribers: undefined,
        _onerror: function(reason) {
          $__0[0]["config"].trigger('error', reason);
        },
        then: function(onFulfillment, onRejection, label) {
          var parent = this;
          parent._onerror = null;
          var child = new this.constructor($__0[4]["noop"], label);
          var state = parent._state;
          var result = parent._result;
          if ($__0[0]["config"].instrument) {
            $__0[2]["default"]('chained', parent, child);
          }
          if (state === $__0[4]["FULFILLED"] && onFulfillment) {
            $__0[0]["config"].async(function() {
              $__0[4]["invokeCallback"](state, child, onFulfillment, result);
            });
          } else {
            $__0[4]["subscribe"](parent, child, onFulfillment, onRejection);
          }
          return child;
        },
        'catch': function(onRejection, label) {
          return this.then(null, onRejection, label);
        },
        'finally': function(callback, label) {
          var constructor = this.constructor;
          return this.then(function(value) {
            return constructor.resolve(callback()).then(function() {
              return value;
            });
          }, function(reason) {
            return constructor.resolve(callback()).then(function() {
              throw reason;
            });
          }, label);
        }
      };
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7/rsvp.js", ["./rsvp/promise", "./rsvp/events", "./rsvp/node", "./rsvp/all", "./rsvp/all-settled", "./rsvp/race", "./rsvp/hash", "./rsvp/hash-settled", "./rsvp/rethrow", "./rsvp/defer", "./rsvp/config", "./rsvp/map", "./rsvp/resolve", "./rsvp/reject", "./rsvp/filter", "./rsvp/asap"], function($__0) {
  "use strict";
  var __moduleName = "github:tildeio/rsvp.js@3.0.7/rsvp.js";
  var callbacks,
      eventName;
  function async(callback, arg) {
    $__0[10]["config"].async(callback, arg);
  }
  function on() {
    $__0[10]["config"].on.apply($__0[10]["config"], arguments);
  }
  function off() {
    $__0[10]["config"].off.apply($__0[10]["config"], arguments);
  }
  return {
    exports: {
      get Promise() {
        return $__0[0]["default"];
      },
      get EventTarget() {
        return $__0[1]["default"];
      },
      get all() {
        return $__0[3]["default"];
      },
      get allSettled() {
        return $__0[4]["default"];
      },
      get race() {
        return $__0[5]["default"];
      },
      get hash() {
        return $__0[6]["default"];
      },
      get hashSettled() {
        return $__0[7]["default"];
      },
      get rethrow() {
        return $__0[8]["default"];
      },
      get defer() {
        return $__0[9]["default"];
      },
      get denodeify() {
        return $__0[2]["default"];
      },
      get configure() {
        return $__0[10]["configure"];
      },
      get on() {
        return on;
      },
      get off() {
        return off;
      },
      get resolve() {
        return $__0[12]["default"];
      },
      get reject() {
        return $__0[13]["default"];
      },
      get async() {
        return async;
      },
      get map() {
        return $__0[11]["default"];
      },
      get filter() {
        return $__0[14]["default"];
      },
      set Promise(value) {
        $__0[0]["default"] = value;
      },
      set EventTarget(value) {
        $__0[1]["default"] = value;
      },
      set all(value) {
        $__0[3]["default"] = value;
      },
      set allSettled(value) {
        $__0[4]["default"] = value;
      },
      set race(value) {
        $__0[5]["default"] = value;
      },
      set hash(value) {
        $__0[6]["default"] = value;
      },
      set hashSettled(value) {
        $__0[7]["default"] = value;
      },
      set rethrow(value) {
        $__0[8]["default"] = value;
      },
      set defer(value) {
        $__0[9]["default"] = value;
      },
      set denodeify(value) {
        $__0[2]["default"] = value;
      },
      set configure(value) {
        $__0[10]["configure"] = value;
      },
      set on(value) {
        on = value;
      },
      set off(value) {
        off = value;
      },
      set resolve(value) {
        $__0[12]["default"] = value;
      },
      set reject(value) {
        $__0[13]["default"] = value;
      },
      set async(value) {
        async = value;
      },
      set map(value) {
        $__0[11]["default"] = value;
      },
      set filter(value) {
        $__0[14]["default"] = value;
      }
    },
    execute: function() {
      ;
      ;
      ;
      ;
      ;
      ;
      ;
      ;
      ;
      ;
      ;
      ;
      ;
      ;
      ;
      ;
      $__0[10]["config"].async = $__0[15]["default"];
      ;
      ;
      ;
      if (typeof window !== 'undefined' && typeof window.__PROMISE_INSTRUMENTATION__ === 'object') {
        callbacks = window.__PROMISE_INSTRUMENTATION__;
        $__0[10]["configure"]('instrument', true);
        for (eventName in callbacks) {
          if (callbacks.hasOwnProperty(eventName)) {
            on(eventName, callbacks[eventName]);
          }
        }
      }
      ;
    }
  };
});

System.register("github:tildeio/rsvp.js@3.0.7", ["github:tildeio/rsvp.js@3.0.7/rsvp.js"], true, function(require, exports, __moduleName) {
  var global = System.global;
  var __define = global.define;
  global.define = undefined;
  var module = { exports: exports };
  var process = System.get("@@nodeProcess")["default"];
    var __filename = "jspm_packages/github/tildeio/rsvp.js@3.0.7.js";
    var __dirname = "jspm_packages/github/tildeio";
  module.exports = require("github:tildeio/rsvp.js@3.0.7/rsvp.js");
  
  global.define = __define;
  return module.exports;
});

define("github:toranb/toranb-react-amd-rsvp-promise-mixin@0.1.2/main", ["rsvp"], function(RSVP) {
    "use strict";

    var PromiseMixin = (function() {
        var mixin = function() {
        };
        mixin.prototype.promise = function(url, type, hash) {
            return new RSVP.Promise(function(resolve, reject) {
              hash.success = function(json) {
                return resolve(json);
              };
              hash.error = function(json) {
                if (json && json.then) {
                  json.then = null;
                }
                return reject(json);
              };
              $.ajax(hash);
            });
        }
        return mixin;
    })();

    return PromiseMixin;
});

System.register("github:toranb/toranb-react-amd-rsvp-promise-mixin@0.1.2", ["github:toranb/toranb-react-amd-rsvp-promise-mixin@0.1.2/main"], true, function(require, exports, __moduleName) {
  var global = System.global;
  var __define = global.define;
  global.define = undefined;
  var module = { exports: exports };
  var process = System.get("@@nodeProcess")["default"];
    var __filename = "jspm_packages/github/toranb/toranb-react-amd-rsvp-promise-mixin@0.1.2.js";
    var __dirname = "jspm_packages/github/toranb";
  module.exports = require("github:toranb/toranb-react-amd-rsvp-promise-mixin@0.1.2/main");
  
  global.define = __define;
  return module.exports;
});

System.register("final", ["react","promise-mixin"], true, function(require, exports, __moduleName) {
  var global = System.global;
  var __define = global.define;
  global.define = undefined;
  var module = { exports: exports };
  var process = System.get("@@nodeProcess")["default"];
    var __filename = "final.js";
    var __dirname = ".";
  var React = require('react');
  var PromiseMixin = require('promise-mixin');
  
  var Final = React.createClass({
      render: function() {
          var hash = {};
          hash.url = "/api/incoming";
          hash.type = "GET";
          hash.dataType = "json";
          var mixin = new PromiseMixin();
          mixin.promise("/api/incoming", "GET", hash).then(function(response) {
              response.forEach(function(item) {
                  console.log("final promise-mixin invoked!");
                  console.log(item);
              });
          });
          return (
              React.DOM.div(null, 
                  React.DOM.h1(null, "Final!")
              )
          );
      }
  });
  
  module.exports = Final;
  
  global.define = __define;
  return module.exports;
});
