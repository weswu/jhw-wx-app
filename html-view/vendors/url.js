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
    global.url = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  exports.__esModule = true;
  function parseQuery(str) {
    var query = {};
    if (str.length) {
      str.replace(/\+/g, ' ').split('&').forEach(function (s) {
        var pair = s.split('=');
        var key = decodeURIComponent(pair[0]);
        var val = pair.length === 1 ? '' : decodeURIComponent(pair[1]);
        if (query[key] == null) {
          query[key] = val;
        } else {
          if (query[key].constructor !== Array) query[key] = [query[key]];
          query[key].push(val);
        }
      });
    }
    return query;
  }

  function formatQuery(obj) {
    var str = '';

    var _loop = function _loop(p) {
      var key = encodeURIComponent(p);
      [].concat(obj[p]).forEach(function (val) {
        if (val == null) return;
        str += '&' + key;
        if (val !== '') str += '=' + encodeURIComponent(val);
      });
    };

    for (var p in obj) {
      _loop(p);
    }
    return str.slice(1);
  }

  function parse(str) {
    var m = /^(?:([^:/?#]+:))?(?:\/\/(?:(([^:@]*)(?::([^:@]*))?)?@)?(([^:/?#]*)(?::(\d*))?))?(((?:[^?#/]*\/)*[^?#]*)(?:(\?[^#]*))?)(?:(#.*))?/.exec(str);
    var url = {};['href', 'protocol', 'auth', 'username', 'password', 'host', 'hostname', 'port', 'path', 'pathname', 'search', 'hash'].forEach(function (key, i) {
      return url[key] = m[i] || '';
    });
    if (!url.path && !url.pathname) url.path = url.pathname = '/';
    url.query = parseQuery(url.search.slice(1));
    return url;
  }

  function format() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$protocol = _ref.protocol,
        protocol = _ref$protocol === undefined ? '' : _ref$protocol,
        _ref$auth = _ref.auth,
        auth = _ref$auth === undefined ? '' : _ref$auth,
        _ref$username = _ref.username,
        username = _ref$username === undefined ? '' : _ref$username,
        _ref$password = _ref.password,
        password = _ref$password === undefined ? '' : _ref$password,
        _ref$host = _ref.host,
        host = _ref$host === undefined ? '' : _ref$host,
        _ref$hostname = _ref.hostname,
        hostname = _ref$hostname === undefined ? '' : _ref$hostname,
        _ref$port = _ref.port,
        port = _ref$port === undefined ? '' : _ref$port,
        _ref$path = _ref.path,
        path = _ref$path === undefined ? '' : _ref$path,
        _ref$pathname = _ref.pathname,
        pathname = _ref$pathname === undefined ? '' : _ref$pathname,
        _ref$search = _ref.search,
        search = _ref$search === undefined ? '' : _ref$search,
        _ref$query = _ref.query,
        query = _ref$query === undefined ? null : _ref$query,
        _ref$hash = _ref.hash,
        hash = _ref$hash === undefined ? '' : _ref$hash;

    var str = '';

    if (protocol) {
      str += protocol;
      if (protocol.slice(-1) !== ':') str += ':';
    }

    if (protocol || host || hostname) str += '//';

    if (host || hostname) {
      if (auth) {
        str += auth + '@';
      } else if (username) {
        str += username;
        if (password) str += ':' + password;
        str += '@';
      }

      if (host) {
        str += host;
      } else {
        str += hostname;
        if (port) str += ':' + port;
      }
    }

    if (path) {
      str += path;
    } else {
      str += pathname || '/';

      if (search) {
        str += search;
      } else if (query) {
        var q = formatQuery(query);
        if (q) str += '?' + q;
      }
    }

    str += hash;

    return str;
  }

  function resolve(from, to) {
    from = parse(from);
    to = parse(to);

    // 'to' is an absolute URL
    if (to.protocol) return to.href;

    // 'to' only need to complete the protocol
    if (to.host) {
      to.protocol = from.protocol;
      return format(to);
    }

    // 'to' has aboslute path
    if (to.path[0] === '/') {
      from.path = to.path;
      from.pathname = from.search = '';
      from.query = null;
      from.hash = to.hash;
      return format(from);
    }

    if (to.pathname) {
      (function () {
        var dirFrom = from.pathname.split('/');
        // pop the filename
        dirFrom.pop();

        to.pathname.split('/').forEach(function (d) {
          switch (d) {
            case '.':
              return;
            case '..':
              return dirFrom.length > 1 ? dirFrom.pop() : null;
            default:
              dirFrom.push(d);
          }
        });

        from.pathname = dirFrom.join('/');
      })();
    }

    from.path = '';
    from.search = to.search;
    from.query = null;
    from.hash = to.hash;
    return format(from);
  }

  exports.default = { parse: parse, format: format, resolve: resolve, parseQuery: parseQuery, formatQuery: formatQuery };
  module.exports = exports['default'];
});