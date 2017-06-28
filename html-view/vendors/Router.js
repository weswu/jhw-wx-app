(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.Router = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  exports.__esModule = true;

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Router = function () {
    function Router(conf) {
      _classCallCheck(this, Router);

      this.routes = {};

      if (conf.constructor === Array) conf = { ALL: conf };

      for (var method in conf) {
        var routes = conf[method];
        var rts = this.routes[method] = {
          string: {},
          regex: []
        };

        var _loop = function _loop() {
          if (_isArray) {
            if (_i >= _iterator.length) return 'break';
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) return 'break';
            _ref = _i.value;
          }

          var _rt = _ref;

          var pattern = void 0,
              replacement = void 0,
              params = void 0,
              options = void 0;

          if (_rt.constructor === String) {
            pattern = _rt;
            replacement = '$&';
            params = [];
            options = {};
          } else {
            var rt = _rt.concat();
            pattern = rt.shift();
            replacement = rt.shift() || '$&';
            options = _typeof(rt[rt.length - 1]) == 'object' ? rt.pop() : {};
            params = rt;
          }

          if (pattern.constructor === RegExp) {
            rts.regex.push({
              pattern: pattern,
              replacement: replacement,
              params: params,
              options: options,
              origin: _rt
            });
          } else {
            if (!/:|\*|\$/.test(pattern)) {
              rts.string[pattern] = {
                replacement: replacement === '$&' ? pattern : replacement,
                options: options,
                origin: _rt
              };
            } else {
              params = [];

              pattern = pattern.replace(/[\\&()+.[?^{|]/g, '\\$&').replace(/:(\w+)/g, function (str, key) {
                params.push(key);
                return '([^/]+)';
              }).replace(/\*/g, '.*');

              rts.regex.push({
                pattern: new RegExp('^' + pattern + '$'),
                replacement: replacement,
                params: params,
                options: options,
                origin: _rt
              });
            }
          }
        };

        for (var _iterator = routes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          var _ret = _loop();

          if (_ret === 'break') break;
        }
      }
    }

    Router.prototype.match = function match(path) {
      var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ALL';

      var rts = this.routes[method];

      if (rts) {
        if (rts.string[path]) {
          var match = {
            path: rts.string[path].replacement,
            params: {},
            options: rts.string[path].options,
            origin: rts.string[path].origin
          };

          if (Router.log) {
            console.log('path:', path, '\n', 'method:', method, '\n', 'match:', match); // eslint-disable-line
          }

          return match;
        }

        var _replacement = void 0;
        var _params = {};
        for (var _iterator2 = rts.regex, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
          var _ref2;

          if (_isArray2) {
            if (_i2 >= _iterator2.length) break;
            _ref2 = _iterator2[_i2++];
          } else {
            _i2 = _iterator2.next();
            if (_i2.done) break;
            _ref2 = _i2.value;
          }

          var rt = _ref2;

          var matches = path.match(rt.pattern);
          if (matches) {
            _replacement = rt.replacement;
            if (_replacement.indexOf('$') !== -1) {
              _replacement = _replacement === '$&' ? path : path.replace(rt.pattern, _replacement);
            }

            matches.shift();
            for (var j = 0; j < rt.params.length; j++) {
              if (rt.params[j]) {
                _params[rt.params[j]] = matches[j];
              }
            }

            var _match = {
              path: _replacement,
              params: _params,
              options: rt.options,
              origin: rt.origin
            };

            if (Router.log) {
              console.log('path:', path, '\n', 'method:', method, '\n', 'match:', _match); // eslint-disable-line
            }

            return _match;
          }
        }
      }

      if (Router.log) {
        console.log('path:', path, '\n', 'method:', method, '\n', 'match:', null); // eslint-disable-line
      }

      return method === 'ALL' ? null : this.match(path);
    };

    return Router;
  }();

  exports.default = Router;
  module.exports = exports['default'];
});