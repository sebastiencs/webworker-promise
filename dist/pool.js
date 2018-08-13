(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["webworker-promise-pool"] = factory();
	else
		root["WebWorkerPromisePool"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebWorkerPromise = __webpack_require__(1);

var WorkerPool = function () {
  function WorkerPool(_ref) {
    var create = _ref.create,
        maxThreads = _ref.maxThreads,
        terminateAfterDelay = _ref.terminateAfterDelay,
        maxConcurrentPerWorker = _ref.maxConcurrentPerWorker;

    _classCallCheck(this, WorkerPool);

    this._queue = [];
    this._workers = [];
    this._createWorker = create;
    this._maxThreads = maxThreads;
    this._terminateAfterDelay = terminateAfterDelay;
    this._maxConcurrentPerWorker = maxConcurrentPerWorker;

    var worker = this._createWebWorker();
    this._workers.push(worker);
  }

  /**
   const pool = WorkerPool.create({
    src: 'my-worker.js',
    // or create: () => new Worker()
    maxThreads: 2
   });
   */

  _createClass(WorkerPool, [{
    key: 'exec',
    value: function exec() {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var worker = this.getFreeWorkerOrCreate();
      if (worker) return this._exec(worker, 'exec', args);

      return new Promise(function (res) {
        return _this._queue.push(['exec', args, res]);
      });
    }
  }, {
    key: 'postMessage',
    value: function postMessage() {
      var _this2 = this;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var worker = this.getFreeWorkerOrCreate();
      if (worker) {
        return this._exec(worker, 'postMessage', args);
      }

      return new Promise(function (res) {
        return _this2._queue.push(['postMessage', args, res]);
      });
    }
  }, {
    key: '_exec',
    value: function _exec(worker, method, args) {
      var _this3 = this;

      return new Promise(function (res, rej) {
        worker[method].apply(worker, _toConsumableArray(args)).then(function (result) {
          _this3._onWorkDone(worker);
          res(result);
        }).catch(function (e) {
          _this3._onWorkDone(worker);
          rej(e);
        });
      });
    }

    // if there is unresolved jobs, run them
    // or remove unused workers

  }, {
    key: '_onWorkDone',
    value: function _onWorkDone() {
      if (this._queue.length) {
        var worker = void 0;
        while (this._queue.length && (worker = this.getFreeWorkerOrCreate())) {
          var _queue$shift = this._queue.shift(),
              _queue$shift2 = _slicedToArray(_queue$shift, 3),
              method = _queue$shift2[0],
              args = _queue$shift2[1],
              cb = _queue$shift2[2];

          cb(this._exec(worker, method, args));
        }
      }

      var freeWorkers = this.getAllFreeWorkers();
      if (freeWorkers.length) {
        this._waitAndRemoveWorkers(freeWorkers);
      }
    }

    // remove workers if its not using after delay

  }, {
    key: '_waitAndRemoveWorkers',
    value: function _waitAndRemoveWorkers(workers) {
      var _this4 = this;

      setTimeout(function () {
        // only one worker should be alive always
        workers = workers.filter(function (w) {
          return w.isFree();
        }).slice(0, _this4._workers.length - 1);
        workers.forEach(function (worker) {
          return _this4._removeWorker(worker);
        });
      }, this._terminateAfterDelay);
    }
  }, {
    key: '_removeWorker',
    value: function _removeWorker(worker) {
      this._workers = this._workers.filter(function (w) {
        return w._id !== worker._id;
      });
      worker.terminate();
    }
  }, {
    key: 'getAllFreeWorkers',
    value: function getAllFreeWorkers() {
      var _this5 = this;

      return this._workers.filter(function (w) {
        return w.jobsLength() < _this5._maxConcurrentPerWorker;
      });
    }
  }, {
    key: 'getFreeWorkerOrCreate',
    value: function getFreeWorkerOrCreate() {
      var _this6 = this;

      var freeWorker = this._workers.find(function (w) {
        return w.jobsLength() < _this6._maxConcurrentPerWorker;
      });

      if (!freeWorker && this._workers.length < this._maxThreads) {
        var worker = this._createWebWorker();
        this._workers.push(worker);
        return worker;
      }

      return freeWorker;
    }
  }, {
    key: '_createWebWorker',
    value: function _createWebWorker() {
      return new WebWorkerPromise(this._createWorker());
    }
  }], [{
    key: 'create',
    value: function create(opts) {
      if (!opts.create) opts.create = function () {
        return new Worker(opts.src);
      };

      if (!opts.terminateAfterDelay) opts.terminateAfterDelay = 5000;
      if (!opts.maxThreads) opts.maxThreads = 2;
      if (!opts.maxConcurrentPerWorker) {
        opts.maxConcurrentPerWorker = 1;
      }

      return new WorkerPool(opts);
    }
  }]);

  return WorkerPool;
}();

module.exports = WorkerPool;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TinyEmitter = __webpack_require__(2);

var MESSAGE_RESULT = 0;
var MESSAGE_EVENT = 1;

var RESULT_ERROR = 0;
var RESULT_SUCCESS = 1;

var Worker = function (_TinyEmitter) {
  _inherits(Worker, _TinyEmitter);

  /**
   *
   * @param worker {Worker}
   */
  function Worker(worker) {
    _classCallCheck(this, Worker);

    var _this = _possibleConstructorReturn(this, (Worker.__proto__ || Object.getPrototypeOf(Worker)).call(this));

    _this._messageId = 1;
    _this._messages = new Map();

    _this._worker = worker;
    _this._worker.onmessage = _this._onMessage.bind(_this);
    _this._id = Math.ceil(Math.random() * 10000000);
    return _this;
  }

  _createClass(Worker, [{
    key: 'terminate',
    value: function terminate() {
      this._worker.terminate();
    }

    /**
     * return true if there is no unresolved jobs
     * @returns {boolean}
     */

  }, {
    key: 'isFree',
    value: function isFree() {
      return this._messages.size === 0;
    }
  }, {
    key: 'jobsLength',
    value: function jobsLength() {
      return this._messages.size;
    }

    /**
     * @param operationName string
     * @param data any
     * @param transferable array
     * @param onEvent function
     * @returns {Promise}
     */

  }, {
    key: 'exec',
    value: function exec(operationName) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var _this2 = this;

      var transferable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var onEvent = arguments[3];

      return new Promise(function (res, rej) {
        var messageId = _this2._messageId++;
        _this2._messages.set(messageId, [res, rej, onEvent]);
        _this2._worker.postMessage([messageId, data, operationName], transferable || []);
      });
    }

    /**
     *
     * @param data any
     * @param transferable array
     * @param onEvent function
     * @returns {Promise}
     */

  }, {
    key: 'postMessage',
    value: function postMessage() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var _this3 = this;

      var transferable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var onEvent = arguments[2];

      return new Promise(function (res, rej) {
        var messageId = _this3._messageId++;
        _this3._messages.set(messageId, [res, rej, onEvent]);
        _this3._worker.postMessage([messageId, data], transferable || []);
      });
    }
  }, {
    key: 'emit',
    value: function emit(eventName) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      this._worker.postMessage({ eventName: eventName, args: args });
    }
  }, {
    key: '_onMessage',
    value: function _onMessage(e) {
      //if we got usual event, just emit it locally
      if (!Array.isArray(e.data) && e.data.eventName) {
        var _get2;

        return (_get2 = _get(Worker.prototype.__proto__ || Object.getPrototypeOf(Worker.prototype), 'emit', this)).call.apply(_get2, [this, e.data.eventName].concat(_toConsumableArray(e.data.args)));
      }

      var _e$data = _toArray(e.data),
          type = _e$data[0],
          args = _e$data.slice(1);

      if (type === MESSAGE_EVENT) this._onEvent.apply(this, _toConsumableArray(args));else if (type === MESSAGE_RESULT) this._onResult.apply(this, _toConsumableArray(args));else throw new Error('Wrong message type \'' + type + '\'');
    }
  }, {
    key: '_onResult',
    value: function _onResult(messageId, success, payload) {
      var _messages$get = this._messages.get(messageId),
          _messages$get2 = _slicedToArray(_messages$get, 2),
          res = _messages$get2[0],
          rej = _messages$get2[1];

      this._messages.delete(messageId);

      return success === RESULT_SUCCESS ? res(payload) : rej(payload);
    }
  }, {
    key: '_onEvent',
    value: function _onEvent(messageId, eventName, data) {
      var _messages$get3 = this._messages.get(messageId),
          _messages$get4 = _slicedToArray(_messages$get3, 3),
          onEvent = _messages$get4[2];

      if (onEvent) {
        onEvent(eventName, data);
      }
    }
  }]);

  return Worker;
}(TinyEmitter);

module.exports = Worker;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TinyEmitter = function () {
  function TinyEmitter() {
    _classCallCheck(this, TinyEmitter);

    Object.defineProperty(this, '__listeners', {
      value: {},
      enumerable: false,
      writable: false
    });
  }

  _createClass(TinyEmitter, [{
    key: 'emit',
    value: function emit(eventName) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.__listeners[eventName][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var handler = _step.value;

          handler.apply(undefined, args);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return this;
    }
  }, {
    key: 'once',
    value: function once(eventName, handler) {
      var _this = this;

      var once = function once() {
        _this.off(eventName, once);
        handler.apply(undefined, arguments);
      };

      return this.on(eventName, once);
    }
  }, {
    key: 'on',
    value: function on(eventName, handler) {
      if (!this.__listeners[eventName]) this.__listeners[eventName] = [];

      this.__listeners[eventName].push(handler);

      return this;
    }
  }, {
    key: 'off',
    value: function off(eventName, handler) {
      if (handler) this.__listeners[eventName] = this.__listeners[eventName].filter(function (h) {
        return h !== handler;
      });else this.__listeners[eventName] = [];

      return this;
    }
  }]);

  return TinyEmitter;
}();

module.exports = TinyEmitter;

/***/ })
/******/ ]);
});