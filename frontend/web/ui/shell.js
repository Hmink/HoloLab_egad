function Lh(_) {
  return _ && _.__esModule && Object.prototype.hasOwnProperty.call(_, "default") ? _.default : _;
}
var ei = { exports: {} }, Y = {};
var vv;
function xh() {
  if (vv) return Y;
  vv = 1;
  var _ = Symbol.for("react.transitional.element"), il = Symbol.for("react.portal"), I = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), kl = Symbol.for("react.profiler"), Ql = Symbol.for("react.consumer"), Bl = Symbol.for("react.context"), Ol = Symbol.for("react.forward_ref"), H = Symbol.for("react.suspense"), T = Symbol.for("react.memo"), w = Symbol.for("react.lazy"), q = Symbol.for("react.activity"), P = Symbol.iterator;
  function Ml(y) {
    return y === null || typeof y != "object" ? null : (y = P && y[P] || y["@@iterator"], typeof y == "function" ? y : null);
  }
  var ql = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, Dl = Object.assign, bt = {};
  function Yl(y, r, M) {
    this.props = y, this.context = r, this.refs = bt, this.updater = M || ql;
  }
  Yl.prototype.isReactComponent = {}, Yl.prototype.setState = function(y, r) {
    if (typeof y != "object" && typeof y != "function" && y != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, y, r, "setState");
  }, Yl.prototype.forceUpdate = function(y) {
    this.updater.enqueueForceUpdate(this, y, "forceUpdate");
  };
  function ct() {
  }
  ct.prototype = Yl.prototype;
  function D(y, r, M) {
    this.props = y, this.context = r, this.refs = bt, this.updater = M || ql;
  }
  var vl = D.prototype = new ct();
  vl.constructor = D, Dl(vl, Yl.prototype), vl.isPureReactComponent = !0;
  var At = Array.isArray;
  function jl() {
  }
  var K = { H: null, A: null, T: null, S: null }, Zl = Object.prototype.hasOwnProperty;
  function _t(y, r, M) {
    var p = M.ref;
    return {
      $$typeof: _,
      type: y,
      key: r,
      ref: p !== void 0 ? p : null,
      props: M
    };
  }
  function Za(y, r) {
    return _t(y.type, r, y.props);
  }
  function Ot(y) {
    return typeof y == "object" && y !== null && y.$$typeof === _;
  }
  function Vl(y) {
    var r = { "=": "=0", ":": "=2" };
    return "$" + y.replace(/[=:]/g, function(M) {
      return r[M];
    });
  }
  var ra = /\/+/g;
  function Nt(y, r) {
    return typeof y == "object" && y !== null && y.key != null ? Vl("" + y.key) : r.toString(36);
  }
  function Et(y) {
    switch (y.status) {
      case "fulfilled":
        return y.value;
      case "rejected":
        throw y.reason;
      default:
        switch (typeof y.status == "string" ? y.then(jl, jl) : (y.status = "pending", y.then(
          function(r) {
            y.status === "pending" && (y.status = "fulfilled", y.value = r);
          },
          function(r) {
            y.status === "pending" && (y.status = "rejected", y.reason = r);
          }
        )), y.status) {
          case "fulfilled":
            return y.value;
          case "rejected":
            throw y.reason;
        }
    }
    throw y;
  }
  function b(y, r, M, p, G) {
    var j = typeof y;
    (j === "undefined" || j === "boolean") && (y = null);
    var F = !1;
    if (y === null) F = !0;
    else
      switch (j) {
        case "bigint":
        case "string":
        case "number":
          F = !0;
          break;
        case "object":
          switch (y.$$typeof) {
            case _:
            case il:
              F = !0;
              break;
            case w:
              return F = y._init, b(
                F(y._payload),
                r,
                M,
                p,
                G
              );
          }
      }
    if (F)
      return G = G(y), F = p === "" ? "." + Nt(y, 0) : p, At(G) ? (M = "", F != null && (M = F.replace(ra, "$&/") + "/"), b(G, r, M, "", function(Mu) {
        return Mu;
      })) : G != null && (Ot(G) && (G = Za(
        G,
        M + (G.key == null || y && y.key === G.key ? "" : ("" + G.key).replace(
          ra,
          "$&/"
        ) + "/") + F
      )), r.push(G)), 1;
    F = 0;
    var Gl = p === "" ? "." : p + ":";
    if (At(y))
      for (var ol = 0; ol < y.length; ol++)
        p = y[ol], j = Gl + Nt(p, ol), F += b(
          p,
          r,
          M,
          j,
          G
        );
    else if (ol = Ml(y), typeof ol == "function")
      for (y = ol.call(y), ol = 0; !(p = y.next()).done; )
        p = p.value, j = Gl + Nt(p, ol++), F += b(
          p,
          r,
          M,
          j,
          G
        );
    else if (j === "object") {
      if (typeof y.then == "function")
        return b(
          Et(y),
          r,
          M,
          p,
          G
        );
      throw r = String(y), Error(
        "Objects are not valid as a React child (found: " + (r === "[object Object]" ? "object with keys {" + Object.keys(y).join(", ") + "}" : r) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return F;
  }
  function O(y, r, M) {
    if (y == null) return y;
    var p = [], G = 0;
    return b(y, p, "", "", function(j) {
      return r.call(M, j, G++);
    }), p;
  }
  function B(y) {
    if (y._status === -1) {
      var r = y._result;
      r = r(), r.then(
        function(M) {
          (y._status === 0 || y._status === -1) && (y._status = 1, y._result = M);
        },
        function(M) {
          (y._status === 0 || y._status === -1) && (y._status = 2, y._result = M);
        }
      ), y._status === -1 && (y._status = 0, y._result = r);
    }
    if (y._status === 1) return y._result.default;
    throw y._result;
  }
  var al = typeof reportError == "function" ? reportError : function(y) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var r = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof y == "object" && y !== null && typeof y.message == "string" ? String(y.message) : String(y),
        error: y
      });
      if (!window.dispatchEvent(r)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", y);
      return;
    }
    console.error(y);
  }, fl = {
    map: O,
    forEach: function(y, r, M) {
      O(
        y,
        function() {
          r.apply(this, arguments);
        },
        M
      );
    },
    count: function(y) {
      var r = 0;
      return O(y, function() {
        r++;
      }), r;
    },
    toArray: function(y) {
      return O(y, function(r) {
        return r;
      }) || [];
    },
    only: function(y) {
      if (!Ot(y))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return y;
    }
  };
  return Y.Activity = q, Y.Children = fl, Y.Component = Yl, Y.Fragment = I, Y.Profiler = kl, Y.PureComponent = D, Y.StrictMode = o, Y.Suspense = H, Y.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = K, Y.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(y) {
      return K.H.useMemoCache(y);
    }
  }, Y.cache = function(y) {
    return function() {
      return y.apply(null, arguments);
    };
  }, Y.cacheSignal = function() {
    return null;
  }, Y.cloneElement = function(y, r, M) {
    if (y == null)
      throw Error(
        "The argument must be a React element, but you passed " + y + "."
      );
    var p = Dl({}, y.props), G = y.key;
    if (r != null)
      for (j in r.key !== void 0 && (G = "" + r.key), r)
        !Zl.call(r, j) || j === "key" || j === "__self" || j === "__source" || j === "ref" && r.ref === void 0 || (p[j] = r[j]);
    var j = arguments.length - 2;
    if (j === 1) p.children = M;
    else if (1 < j) {
      for (var F = Array(j), Gl = 0; Gl < j; Gl++)
        F[Gl] = arguments[Gl + 2];
      p.children = F;
    }
    return _t(y.type, G, p);
  }, Y.createContext = function(y) {
    return y = {
      $$typeof: Bl,
      _currentValue: y,
      _currentValue2: y,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, y.Provider = y, y.Consumer = {
      $$typeof: Ql,
      _context: y
    }, y;
  }, Y.createElement = function(y, r, M) {
    var p, G = {}, j = null;
    if (r != null)
      for (p in r.key !== void 0 && (j = "" + r.key), r)
        Zl.call(r, p) && p !== "key" && p !== "__self" && p !== "__source" && (G[p] = r[p]);
    var F = arguments.length - 2;
    if (F === 1) G.children = M;
    else if (1 < F) {
      for (var Gl = Array(F), ol = 0; ol < F; ol++)
        Gl[ol] = arguments[ol + 2];
      G.children = Gl;
    }
    if (y && y.defaultProps)
      for (p in F = y.defaultProps, F)
        G[p] === void 0 && (G[p] = F[p]);
    return _t(y, j, G);
  }, Y.createRef = function() {
    return { current: null };
  }, Y.forwardRef = function(y) {
    return { $$typeof: Ol, render: y };
  }, Y.isValidElement = Ot, Y.lazy = function(y) {
    return {
      $$typeof: w,
      _payload: { _status: -1, _result: y },
      _init: B
    };
  }, Y.memo = function(y, r) {
    return {
      $$typeof: T,
      type: y,
      compare: r === void 0 ? null : r
    };
  }, Y.startTransition = function(y) {
    var r = K.T, M = {};
    K.T = M;
    try {
      var p = y(), G = K.S;
      G !== null && G(M, p), typeof p == "object" && p !== null && typeof p.then == "function" && p.then(jl, al);
    } catch (j) {
      al(j);
    } finally {
      r !== null && M.types !== null && (r.types = M.types), K.T = r;
    }
  }, Y.unstable_useCacheRefresh = function() {
    return K.H.useCacheRefresh();
  }, Y.use = function(y) {
    return K.H.use(y);
  }, Y.useActionState = function(y, r, M) {
    return K.H.useActionState(y, r, M);
  }, Y.useCallback = function(y, r) {
    return K.H.useCallback(y, r);
  }, Y.useContext = function(y) {
    return K.H.useContext(y);
  }, Y.useDebugValue = function() {
  }, Y.useDeferredValue = function(y, r) {
    return K.H.useDeferredValue(y, r);
  }, Y.useEffect = function(y, r) {
    return K.H.useEffect(y, r);
  }, Y.useEffectEvent = function(y) {
    return K.H.useEffectEvent(y);
  }, Y.useId = function() {
    return K.H.useId();
  }, Y.useImperativeHandle = function(y, r, M) {
    return K.H.useImperativeHandle(y, r, M);
  }, Y.useInsertionEffect = function(y, r) {
    return K.H.useInsertionEffect(y, r);
  }, Y.useLayoutEffect = function(y, r) {
    return K.H.useLayoutEffect(y, r);
  }, Y.useMemo = function(y, r) {
    return K.H.useMemo(y, r);
  }, Y.useOptimistic = function(y, r) {
    return K.H.useOptimistic(y, r);
  }, Y.useReducer = function(y, r, M) {
    return K.H.useReducer(y, r, M);
  }, Y.useRef = function(y) {
    return K.H.useRef(y);
  }, Y.useState = function(y) {
    return K.H.useState(y);
  }, Y.useSyncExternalStore = function(y, r, M) {
    return K.H.useSyncExternalStore(
      y,
      r,
      M
    );
  }, Y.useTransition = function() {
    return K.H.useTransition();
  }, Y.version = "19.2.0", Y;
}
var sv;
function mi() {
  return sv || (sv = 1, ei.exports = xh()), ei.exports;
}
var $t = mi();
const A = /* @__PURE__ */ Lh($t);
var ni = { exports: {} }, Ee = {}, fi = { exports: {} }, ci = {};
var hv;
function Kh() {
  return hv || (hv = 1, (function(_) {
    function il(b, O) {
      var B = b.length;
      b.push(O);
      l: for (; 0 < B; ) {
        var al = B - 1 >>> 1, fl = b[al];
        if (0 < kl(fl, O))
          b[al] = O, b[B] = fl, B = al;
        else break l;
      }
    }
    function I(b) {
      return b.length === 0 ? null : b[0];
    }
    function o(b) {
      if (b.length === 0) return null;
      var O = b[0], B = b.pop();
      if (B !== O) {
        b[0] = B;
        l: for (var al = 0, fl = b.length, y = fl >>> 1; al < y; ) {
          var r = 2 * (al + 1) - 1, M = b[r], p = r + 1, G = b[p];
          if (0 > kl(M, B))
            p < fl && 0 > kl(G, M) ? (b[al] = G, b[p] = B, al = p) : (b[al] = M, b[r] = B, al = r);
          else if (p < fl && 0 > kl(G, B))
            b[al] = G, b[p] = B, al = p;
          else break l;
        }
      }
      return O;
    }
    function kl(b, O) {
      var B = b.sortIndex - O.sortIndex;
      return B !== 0 ? B : b.id - O.id;
    }
    if (_.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var Ql = performance;
      _.unstable_now = function() {
        return Ql.now();
      };
    } else {
      var Bl = Date, Ol = Bl.now();
      _.unstable_now = function() {
        return Bl.now() - Ol;
      };
    }
    var H = [], T = [], w = 1, q = null, P = 3, Ml = !1, ql = !1, Dl = !1, bt = !1, Yl = typeof setTimeout == "function" ? setTimeout : null, ct = typeof clearTimeout == "function" ? clearTimeout : null, D = typeof setImmediate < "u" ? setImmediate : null;
    function vl(b) {
      for (var O = I(T); O !== null; ) {
        if (O.callback === null) o(T);
        else if (O.startTime <= b)
          o(T), O.sortIndex = O.expirationTime, il(H, O);
        else break;
        O = I(T);
      }
    }
    function At(b) {
      if (Dl = !1, vl(b), !ql)
        if (I(H) !== null)
          ql = !0, jl || (jl = !0, Vl());
        else {
          var O = I(T);
          O !== null && Et(At, O.startTime - b);
        }
    }
    var jl = !1, K = -1, Zl = 5, _t = -1;
    function Za() {
      return bt ? !0 : !(_.unstable_now() - _t < Zl);
    }
    function Ot() {
      if (bt = !1, jl) {
        var b = _.unstable_now();
        _t = b;
        var O = !0;
        try {
          l: {
            ql = !1, Dl && (Dl = !1, ct(K), K = -1), Ml = !0;
            var B = P;
            try {
              t: {
                for (vl(b), q = I(H); q !== null && !(q.expirationTime > b && Za()); ) {
                  var al = q.callback;
                  if (typeof al == "function") {
                    q.callback = null, P = q.priorityLevel;
                    var fl = al(
                      q.expirationTime <= b
                    );
                    if (b = _.unstable_now(), typeof fl == "function") {
                      q.callback = fl, vl(b), O = !0;
                      break t;
                    }
                    q === I(H) && o(H), vl(b);
                  } else o(H);
                  q = I(H);
                }
                if (q !== null) O = !0;
                else {
                  var y = I(T);
                  y !== null && Et(
                    At,
                    y.startTime - b
                  ), O = !1;
                }
              }
              break l;
            } finally {
              q = null, P = B, Ml = !1;
            }
            O = void 0;
          }
        } finally {
          O ? Vl() : jl = !1;
        }
      }
    }
    var Vl;
    if (typeof D == "function")
      Vl = function() {
        D(Ot);
      };
    else if (typeof MessageChannel < "u") {
      var ra = new MessageChannel(), Nt = ra.port2;
      ra.port1.onmessage = Ot, Vl = function() {
        Nt.postMessage(null);
      };
    } else
      Vl = function() {
        Yl(Ot, 0);
      };
    function Et(b, O) {
      K = Yl(function() {
        b(_.unstable_now());
      }, O);
    }
    _.unstable_IdlePriority = 5, _.unstable_ImmediatePriority = 1, _.unstable_LowPriority = 4, _.unstable_NormalPriority = 3, _.unstable_Profiling = null, _.unstable_UserBlockingPriority = 2, _.unstable_cancelCallback = function(b) {
      b.callback = null;
    }, _.unstable_forceFrameRate = function(b) {
      0 > b || 125 < b ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : Zl = 0 < b ? Math.floor(1e3 / b) : 5;
    }, _.unstable_getCurrentPriorityLevel = function() {
      return P;
    }, _.unstable_next = function(b) {
      switch (P) {
        case 1:
        case 2:
        case 3:
          var O = 3;
          break;
        default:
          O = P;
      }
      var B = P;
      P = O;
      try {
        return b();
      } finally {
        P = B;
      }
    }, _.unstable_requestPaint = function() {
      bt = !0;
    }, _.unstable_runWithPriority = function(b, O) {
      switch (b) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          b = 3;
      }
      var B = P;
      P = b;
      try {
        return O();
      } finally {
        P = B;
      }
    }, _.unstable_scheduleCallback = function(b, O, B) {
      var al = _.unstable_now();
      switch (typeof B == "object" && B !== null ? (B = B.delay, B = typeof B == "number" && 0 < B ? al + B : al) : B = al, b) {
        case 1:
          var fl = -1;
          break;
        case 2:
          fl = 250;
          break;
        case 5:
          fl = 1073741823;
          break;
        case 4:
          fl = 1e4;
          break;
        default:
          fl = 5e3;
      }
      return fl = B + fl, b = {
        id: w++,
        callback: O,
        priorityLevel: b,
        startTime: B,
        expirationTime: fl,
        sortIndex: -1
      }, B > al ? (b.sortIndex = B, il(T, b), I(H) === null && b === I(T) && (Dl ? (ct(K), K = -1) : Dl = !0, Et(At, B - al))) : (b.sortIndex = fl, il(H, b), ql || Ml || (ql = !0, jl || (jl = !0, Vl()))), b;
    }, _.unstable_shouldYield = Za, _.unstable_wrapCallback = function(b) {
      var O = P;
      return function() {
        var B = P;
        P = O;
        try {
          return b.apply(this, arguments);
        } finally {
          P = B;
        }
      };
    };
  })(ci)), ci;
}
var dv;
function Jh() {
  return dv || (dv = 1, fi.exports = Kh()), fi.exports;
}
var ii = { exports: {} }, Rl = {};
var ov;
function wh() {
  if (ov) return Rl;
  ov = 1;
  var _ = mi();
  function il(H) {
    var T = "https://react.dev/errors/" + H;
    if (1 < arguments.length) {
      T += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var w = 2; w < arguments.length; w++)
        T += "&args[]=" + encodeURIComponent(arguments[w]);
    }
    return "Minified React error #" + H + "; visit " + T + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function I() {
  }
  var o = {
    d: {
      f: I,
      r: function() {
        throw Error(il(522));
      },
      D: I,
      C: I,
      L: I,
      m: I,
      X: I,
      S: I,
      M: I
    },
    p: 0,
    findDOMNode: null
  }, kl = Symbol.for("react.portal");
  function Ql(H, T, w) {
    var q = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: kl,
      key: q == null ? null : "" + q,
      children: H,
      containerInfo: T,
      implementation: w
    };
  }
  var Bl = _.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function Ol(H, T) {
    if (H === "font") return "";
    if (typeof T == "string")
      return T === "use-credentials" ? T : "";
  }
  return Rl.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, Rl.createPortal = function(H, T) {
    var w = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!T || T.nodeType !== 1 && T.nodeType !== 9 && T.nodeType !== 11)
      throw Error(il(299));
    return Ql(H, T, null, w);
  }, Rl.flushSync = function(H) {
    var T = Bl.T, w = o.p;
    try {
      if (Bl.T = null, o.p = 2, H) return H();
    } finally {
      Bl.T = T, o.p = w, o.d.f();
    }
  }, Rl.preconnect = function(H, T) {
    typeof H == "string" && (T ? (T = T.crossOrigin, T = typeof T == "string" ? T === "use-credentials" ? T : "" : void 0) : T = null, o.d.C(H, T));
  }, Rl.prefetchDNS = function(H) {
    typeof H == "string" && o.d.D(H);
  }, Rl.preinit = function(H, T) {
    if (typeof H == "string" && T && typeof T.as == "string") {
      var w = T.as, q = Ol(w, T.crossOrigin), P = typeof T.integrity == "string" ? T.integrity : void 0, Ml = typeof T.fetchPriority == "string" ? T.fetchPriority : void 0;
      w === "style" ? o.d.S(
        H,
        typeof T.precedence == "string" ? T.precedence : void 0,
        {
          crossOrigin: q,
          integrity: P,
          fetchPriority: Ml
        }
      ) : w === "script" && o.d.X(H, {
        crossOrigin: q,
        integrity: P,
        fetchPriority: Ml,
        nonce: typeof T.nonce == "string" ? T.nonce : void 0
      });
    }
  }, Rl.preinitModule = function(H, T) {
    if (typeof H == "string")
      if (typeof T == "object" && T !== null) {
        if (T.as == null || T.as === "script") {
          var w = Ol(
            T.as,
            T.crossOrigin
          );
          o.d.M(H, {
            crossOrigin: w,
            integrity: typeof T.integrity == "string" ? T.integrity : void 0,
            nonce: typeof T.nonce == "string" ? T.nonce : void 0
          });
        }
      } else T == null && o.d.M(H);
  }, Rl.preload = function(H, T) {
    if (typeof H == "string" && typeof T == "object" && T !== null && typeof T.as == "string") {
      var w = T.as, q = Ol(w, T.crossOrigin);
      o.d.L(H, w, {
        crossOrigin: q,
        integrity: typeof T.integrity == "string" ? T.integrity : void 0,
        nonce: typeof T.nonce == "string" ? T.nonce : void 0,
        type: typeof T.type == "string" ? T.type : void 0,
        fetchPriority: typeof T.fetchPriority == "string" ? T.fetchPriority : void 0,
        referrerPolicy: typeof T.referrerPolicy == "string" ? T.referrerPolicy : void 0,
        imageSrcSet: typeof T.imageSrcSet == "string" ? T.imageSrcSet : void 0,
        imageSizes: typeof T.imageSizes == "string" ? T.imageSizes : void 0,
        media: typeof T.media == "string" ? T.media : void 0
      });
    }
  }, Rl.preloadModule = function(H, T) {
    if (typeof H == "string")
      if (T) {
        var w = Ol(T.as, T.crossOrigin);
        o.d.m(H, {
          as: typeof T.as == "string" && T.as !== "script" ? T.as : void 0,
          crossOrigin: w,
          integrity: typeof T.integrity == "string" ? T.integrity : void 0
        });
      } else o.d.m(H);
  }, Rl.requestFormReset = function(H) {
    o.d.r(H);
  }, Rl.unstable_batchedUpdates = function(H, T) {
    return H(T);
  }, Rl.useFormState = function(H, T, w) {
    return Bl.H.useFormState(H, T, w);
  }, Rl.useFormStatus = function() {
    return Bl.H.useHostTransitionStatus();
  }, Rl.version = "19.2.0", Rl;
}
var gv;
function Wh() {
  if (gv) return ii.exports;
  gv = 1;
  function _() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(_);
      } catch (il) {
        console.error(il);
      }
  }
  return _(), ii.exports = wh(), ii.exports;
}
var Sv;
function $h() {
  if (Sv) return Ee;
  Sv = 1;
  var _ = Jh(), il = mi(), I = Wh();
  function o(l) {
    var t = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var a = 2; a < arguments.length; a++)
        t += "&args[]=" + encodeURIComponent(arguments[a]);
    }
    return "Minified React error #" + l + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function kl(l) {
    return !(!l || l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11);
  }
  function Ql(l) {
    var t = l, a = l;
    if (l.alternate) for (; t.return; ) t = t.return;
    else {
      l = t;
      do
        t = l, (t.flags & 4098) !== 0 && (a = t.return), l = t.return;
      while (l);
    }
    return t.tag === 3 ? a : null;
  }
  function Bl(l) {
    if (l.tag === 13) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function Ol(l) {
    if (l.tag === 31) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function H(l) {
    if (Ql(l) !== l)
      throw Error(o(188));
  }
  function T(l) {
    var t = l.alternate;
    if (!t) {
      if (t = Ql(l), t === null) throw Error(o(188));
      return t !== l ? null : l;
    }
    for (var a = l, u = t; ; ) {
      var e = a.return;
      if (e === null) break;
      var n = e.alternate;
      if (n === null) {
        if (u = e.return, u !== null) {
          a = u;
          continue;
        }
        break;
      }
      if (e.child === n.child) {
        for (n = e.child; n; ) {
          if (n === a) return H(e), l;
          if (n === u) return H(e), t;
          n = n.sibling;
        }
        throw Error(o(188));
      }
      if (a.return !== u.return) a = e, u = n;
      else {
        for (var f = !1, c = e.child; c; ) {
          if (c === a) {
            f = !0, a = e, u = n;
            break;
          }
          if (c === u) {
            f = !0, u = e, a = n;
            break;
          }
          c = c.sibling;
        }
        if (!f) {
          for (c = n.child; c; ) {
            if (c === a) {
              f = !0, a = n, u = e;
              break;
            }
            if (c === u) {
              f = !0, u = n, a = e;
              break;
            }
            c = c.sibling;
          }
          if (!f) throw Error(o(189));
        }
      }
      if (a.alternate !== u) throw Error(o(190));
    }
    if (a.tag !== 3) throw Error(o(188));
    return a.stateNode.current === a ? l : t;
  }
  function w(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l;
    for (l = l.child; l !== null; ) {
      if (t = w(l), t !== null) return t;
      l = l.sibling;
    }
    return null;
  }
  var q = Object.assign, P = Symbol.for("react.element"), Ml = Symbol.for("react.transitional.element"), ql = Symbol.for("react.portal"), Dl = Symbol.for("react.fragment"), bt = Symbol.for("react.strict_mode"), Yl = Symbol.for("react.profiler"), ct = Symbol.for("react.consumer"), D = Symbol.for("react.context"), vl = Symbol.for("react.forward_ref"), At = Symbol.for("react.suspense"), jl = Symbol.for("react.suspense_list"), K = Symbol.for("react.memo"), Zl = Symbol.for("react.lazy"), _t = Symbol.for("react.activity"), Za = Symbol.for("react.memo_cache_sentinel"), Ot = Symbol.iterator;
  function Vl(l) {
    return l === null || typeof l != "object" ? null : (l = Ot && l[Ot] || l["@@iterator"], typeof l == "function" ? l : null);
  }
  var ra = Symbol.for("react.client.reference");
  function Nt(l) {
    if (l == null) return null;
    if (typeof l == "function")
      return l.$$typeof === ra ? null : l.displayName || l.name || null;
    if (typeof l == "string") return l;
    switch (l) {
      case Dl:
        return "Fragment";
      case Yl:
        return "Profiler";
      case bt:
        return "StrictMode";
      case At:
        return "Suspense";
      case jl:
        return "SuspenseList";
      case _t:
        return "Activity";
    }
    if (typeof l == "object")
      switch (l.$$typeof) {
        case ql:
          return "Portal";
        case D:
          return l.displayName || "Context";
        case ct:
          return (l._context.displayName || "Context") + ".Consumer";
        case vl:
          var t = l.render;
          return l = l.displayName, l || (l = t.displayName || t.name || "", l = l !== "" ? "ForwardRef(" + l + ")" : "ForwardRef"), l;
        case K:
          return t = l.displayName || null, t !== null ? t : Nt(l.type) || "Memo";
        case Zl:
          t = l._payload, l = l._init;
          try {
            return Nt(l(t));
          } catch {
          }
      }
    return null;
  }
  var Et = Array.isArray, b = il.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, O = I.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, B = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, al = [], fl = -1;
  function y(l) {
    return { current: l };
  }
  function r(l) {
    0 > fl || (l.current = al[fl], al[fl] = null, fl--);
  }
  function M(l, t) {
    fl++, al[fl] = l.current, l.current = t;
  }
  var p = y(null), G = y(null), j = y(null), F = y(null);
  function Gl(l, t) {
    switch (M(j, t), M(G, l), M(p, null), t.nodeType) {
      case 9:
      case 11:
        l = (l = t.documentElement) && (l = l.namespaceURI) ? Ry(l) : 0;
        break;
      default:
        if (l = t.tagName, t = t.namespaceURI)
          t = Ry(t), l = By(t, l);
        else
          switch (l) {
            case "svg":
              l = 1;
              break;
            case "math":
              l = 2;
              break;
            default:
              l = 0;
          }
    }
    r(p), M(p, l);
  }
  function ol() {
    r(p), r(G), r(j);
  }
  function Mu(l) {
    l.memoizedState !== null && M(F, l);
    var t = p.current, a = By(t, l.type);
    t !== a && (M(G, l), M(p, a));
  }
  function ze(l) {
    G.current === l && (r(p), r(G)), F.current === l && (r(F), oe._currentValue = B);
  }
  var Qn, yi;
  function Ta(l) {
    if (Qn === void 0)
      try {
        throw Error();
      } catch (a) {
        var t = a.stack.trim().match(/\n( *(at )?)/);
        Qn = t && t[1] || "", yi = -1 < a.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < a.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Qn + l + yi;
  }
  var jn = !1;
  function Zn(l, t) {
    if (!l || jn) return "";
    jn = !0;
    var a = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var u = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var z = function() {
                throw Error();
              };
              if (Object.defineProperty(z.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(z, []);
                } catch (g) {
                  var d = g;
                }
                Reflect.construct(l, [], z);
              } else {
                try {
                  z.call();
                } catch (g) {
                  d = g;
                }
                l.call(z.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (g) {
                d = g;
              }
              (z = l()) && typeof z.catch == "function" && z.catch(function() {
              });
            }
          } catch (g) {
            if (g && d && typeof g.stack == "string")
              return [g.stack, d.stack];
          }
          return [null, null];
        }
      };
      u.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var e = Object.getOwnPropertyDescriptor(
        u.DetermineComponentFrameRoot,
        "name"
      );
      e && e.configurable && Object.defineProperty(
        u.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var n = u.DetermineComponentFrameRoot(), f = n[0], c = n[1];
      if (f && c) {
        var i = f.split(`
`), h = c.split(`
`);
        for (e = u = 0; u < i.length && !i[u].includes("DetermineComponentFrameRoot"); )
          u++;
        for (; e < h.length && !h[e].includes(
          "DetermineComponentFrameRoot"
        ); )
          e++;
        if (u === i.length || e === h.length)
          for (u = i.length - 1, e = h.length - 1; 1 <= u && 0 <= e && i[u] !== h[e]; )
            e--;
        for (; 1 <= u && 0 <= e; u--, e--)
          if (i[u] !== h[e]) {
            if (u !== 1 || e !== 1)
              do
                if (u--, e--, 0 > e || i[u] !== h[e]) {
                  var S = `
` + i[u].replace(" at new ", " at ");
                  return l.displayName && S.includes("<anonymous>") && (S = S.replace("<anonymous>", l.displayName)), S;
                }
              while (1 <= u && 0 <= e);
            break;
          }
      }
    } finally {
      jn = !1, Error.prepareStackTrace = a;
    }
    return (a = l ? l.displayName || l.name : "") ? Ta(a) : "";
  }
  function zv(l, t) {
    switch (l.tag) {
      case 26:
      case 27:
      case 5:
        return Ta(l.type);
      case 16:
        return Ta("Lazy");
      case 13:
        return l.child !== t && t !== null ? Ta("Suspense Fallback") : Ta("Suspense");
      case 19:
        return Ta("SuspenseList");
      case 0:
      case 15:
        return Zn(l.type, !1);
      case 11:
        return Zn(l.type.render, !1);
      case 1:
        return Zn(l.type, !0);
      case 31:
        return Ta("Activity");
      default:
        return "";
    }
  }
  function vi(l) {
    try {
      var t = "", a = null;
      do
        t += zv(l, a), a = l, l = l.return;
      while (l);
      return t;
    } catch (u) {
      return `
Error generating stack: ` + u.message + `
` + u.stack;
    }
  }
  var Vn = Object.prototype.hasOwnProperty, Ln = _.unstable_scheduleCallback, xn = _.unstable_cancelCallback, rv = _.unstable_shouldYield, Tv = _.unstable_requestPaint, Fl = _.unstable_now, Av = _.unstable_getCurrentPriorityLevel, si = _.unstable_ImmediatePriority, hi = _.unstable_UserBlockingPriority, re = _.unstable_NormalPriority, _v = _.unstable_LowPriority, di = _.unstable_IdlePriority, Ov = _.log, Mv = _.unstable_setDisableYieldValue, Du = null, Il = null;
  function kt(l) {
    if (typeof Ov == "function" && Mv(l), Il && typeof Il.setStrictMode == "function")
      try {
        Il.setStrictMode(Du, l);
      } catch {
      }
  }
  var Pl = Math.clz32 ? Math.clz32 : pv, Dv = Math.log, Uv = Math.LN2;
  function pv(l) {
    return l >>>= 0, l === 0 ? 32 : 31 - (Dv(l) / Uv | 0) | 0;
  }
  var Te = 256, Ae = 262144, _e = 4194304;
  function Aa(l) {
    var t = l & 42;
    if (t !== 0) return t;
    switch (l & -l) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return l & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return l & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return l & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return l;
    }
  }
  function Oe(l, t, a) {
    var u = l.pendingLanes;
    if (u === 0) return 0;
    var e = 0, n = l.suspendedLanes, f = l.pingedLanes;
    l = l.warmLanes;
    var c = u & 134217727;
    return c !== 0 ? (u = c & ~n, u !== 0 ? e = Aa(u) : (f &= c, f !== 0 ? e = Aa(f) : a || (a = c & ~l, a !== 0 && (e = Aa(a))))) : (c = u & ~n, c !== 0 ? e = Aa(c) : f !== 0 ? e = Aa(f) : a || (a = u & ~l, a !== 0 && (e = Aa(a)))), e === 0 ? 0 : t !== 0 && t !== e && (t & n) === 0 && (n = e & -e, a = t & -t, n >= a || n === 32 && (a & 4194048) !== 0) ? t : e;
  }
  function Uu(l, t) {
    return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & t) === 0;
  }
  function Nv(l, t) {
    switch (l) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function oi() {
    var l = _e;
    return _e <<= 1, (_e & 62914560) === 0 && (_e = 4194304), l;
  }
  function Kn(l) {
    for (var t = [], a = 0; 31 > a; a++) t.push(l);
    return t;
  }
  function pu(l, t) {
    l.pendingLanes |= t, t !== 268435456 && (l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0);
  }
  function Hv(l, t, a, u, e, n) {
    var f = l.pendingLanes;
    l.pendingLanes = a, l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0, l.expiredLanes &= a, l.entangledLanes &= a, l.errorRecoveryDisabledLanes &= a, l.shellSuspendCounter = 0;
    var c = l.entanglements, i = l.expirationTimes, h = l.hiddenUpdates;
    for (a = f & ~a; 0 < a; ) {
      var S = 31 - Pl(a), z = 1 << S;
      c[S] = 0, i[S] = -1;
      var d = h[S];
      if (d !== null)
        for (h[S] = null, S = 0; S < d.length; S++) {
          var g = d[S];
          g !== null && (g.lane &= -536870913);
        }
      a &= ~z;
    }
    u !== 0 && gi(l, u, 0), n !== 0 && e === 0 && l.tag !== 0 && (l.suspendedLanes |= n & ~(f & ~t));
  }
  function gi(l, t, a) {
    l.pendingLanes |= t, l.suspendedLanes &= ~t;
    var u = 31 - Pl(t);
    l.entangledLanes |= t, l.entanglements[u] = l.entanglements[u] | 1073741824 | a & 261930;
  }
  function Si(l, t) {
    var a = l.entangledLanes |= t;
    for (l = l.entanglements; a; ) {
      var u = 31 - Pl(a), e = 1 << u;
      e & t | l[u] & t && (l[u] |= t), a &= ~e;
    }
  }
  function bi(l, t) {
    var a = t & -t;
    return a = (a & 42) !== 0 ? 1 : Jn(a), (a & (l.suspendedLanes | t)) !== 0 ? 0 : a;
  }
  function Jn(l) {
    switch (l) {
      case 2:
        l = 1;
        break;
      case 8:
        l = 4;
        break;
      case 32:
        l = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        l = 128;
        break;
      case 268435456:
        l = 134217728;
        break;
      default:
        l = 0;
    }
    return l;
  }
  function wn(l) {
    return l &= -l, 2 < l ? 8 < l ? (l & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Ei() {
    var l = O.p;
    return l !== 0 ? l : (l = window.event, l === void 0 ? 32 : ev(l.type));
  }
  function zi(l, t) {
    var a = O.p;
    try {
      return O.p = l, t();
    } finally {
      O.p = a;
    }
  }
  var Ft = Math.random().toString(36).slice(2), Ul = "__reactFiber$" + Ft, Ll = "__reactProps$" + Ft, Va = "__reactContainer$" + Ft, Wn = "__reactEvents$" + Ft, Cv = "__reactListeners$" + Ft, qv = "__reactHandles$" + Ft, ri = "__reactResources$" + Ft, Nu = "__reactMarker$" + Ft;
  function $n(l) {
    delete l[Ul], delete l[Ll], delete l[Wn], delete l[Cv], delete l[qv];
  }
  function La(l) {
    var t = l[Ul];
    if (t) return t;
    for (var a = l.parentNode; a; ) {
      if (t = a[Va] || a[Ul]) {
        if (a = t.alternate, t.child !== null || a !== null && a.child !== null)
          for (l = Vy(l); l !== null; ) {
            if (a = l[Ul]) return a;
            l = Vy(l);
          }
        return t;
      }
      l = a, a = l.parentNode;
    }
    return null;
  }
  function xa(l) {
    if (l = l[Ul] || l[Va]) {
      var t = l.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return l;
    }
    return null;
  }
  function Hu(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l.stateNode;
    throw Error(o(33));
  }
  function Ka(l) {
    var t = l[ri];
    return t || (t = l[ri] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function Al(l) {
    l[Nu] = !0;
  }
  var Ti = /* @__PURE__ */ new Set(), Ai = {};
  function _a(l, t) {
    Ja(l, t), Ja(l + "Capture", t);
  }
  function Ja(l, t) {
    for (Ai[l] = t, l = 0; l < t.length; l++)
      Ti.add(t[l]);
  }
  var Rv = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), _i = {}, Oi = {};
  function Bv(l) {
    return Vn.call(Oi, l) ? !0 : Vn.call(_i, l) ? !1 : Rv.test(l) ? Oi[l] = !0 : (_i[l] = !0, !1);
  }
  function Me(l, t, a) {
    if (Bv(t))
      if (a === null) l.removeAttribute(t);
      else {
        switch (typeof a) {
          case "undefined":
          case "function":
          case "symbol":
            l.removeAttribute(t);
            return;
          case "boolean":
            var u = t.toLowerCase().slice(0, 5);
            if (u !== "data-" && u !== "aria-") {
              l.removeAttribute(t);
              return;
            }
        }
        l.setAttribute(t, "" + a);
      }
  }
  function De(l, t, a) {
    if (a === null) l.removeAttribute(t);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(t);
          return;
      }
      l.setAttribute(t, "" + a);
    }
  }
  function Ht(l, t, a, u) {
    if (u === null) l.removeAttribute(a);
    else {
      switch (typeof u) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(a);
          return;
      }
      l.setAttributeNS(t, a, "" + u);
    }
  }
  function it(l) {
    switch (typeof l) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return l;
      case "object":
        return l;
      default:
        return "";
    }
  }
  function Mi(l) {
    var t = l.type;
    return (l = l.nodeName) && l.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function Yv(l, t, a) {
    var u = Object.getOwnPropertyDescriptor(
      l.constructor.prototype,
      t
    );
    if (!l.hasOwnProperty(t) && typeof u < "u" && typeof u.get == "function" && typeof u.set == "function") {
      var e = u.get, n = u.set;
      return Object.defineProperty(l, t, {
        configurable: !0,
        get: function() {
          return e.call(this);
        },
        set: function(f) {
          a = "" + f, n.call(this, f);
        }
      }), Object.defineProperty(l, t, {
        enumerable: u.enumerable
      }), {
        getValue: function() {
          return a;
        },
        setValue: function(f) {
          a = "" + f;
        },
        stopTracking: function() {
          l._valueTracker = null, delete l[t];
        }
      };
    }
  }
  function kn(l) {
    if (!l._valueTracker) {
      var t = Mi(l) ? "checked" : "value";
      l._valueTracker = Yv(
        l,
        t,
        "" + l[t]
      );
    }
  }
  function Di(l) {
    if (!l) return !1;
    var t = l._valueTracker;
    if (!t) return !0;
    var a = t.getValue(), u = "";
    return l && (u = Mi(l) ? l.checked ? "true" : "false" : l.value), l = u, l !== a ? (t.setValue(l), !0) : !1;
  }
  function Ue(l) {
    if (l = l || (typeof document < "u" ? document : void 0), typeof l > "u") return null;
    try {
      return l.activeElement || l.body;
    } catch {
      return l.body;
    }
  }
  var Gv = /[\n"\\]/g;
  function mt(l) {
    return l.replace(
      Gv,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Fn(l, t, a, u, e, n, f, c) {
    l.name = "", f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" ? l.type = f : l.removeAttribute("type"), t != null ? f === "number" ? (t === 0 && l.value === "" || l.value != t) && (l.value = "" + it(t)) : l.value !== "" + it(t) && (l.value = "" + it(t)) : f !== "submit" && f !== "reset" || l.removeAttribute("value"), t != null ? In(l, f, it(t)) : a != null ? In(l, f, it(a)) : u != null && l.removeAttribute("value"), e == null && n != null && (l.defaultChecked = !!n), e != null && (l.checked = e && typeof e != "function" && typeof e != "symbol"), c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? l.name = "" + it(c) : l.removeAttribute("name");
  }
  function Ui(l, t, a, u, e, n, f, c) {
    if (n != null && typeof n != "function" && typeof n != "symbol" && typeof n != "boolean" && (l.type = n), t != null || a != null) {
      if (!(n !== "submit" && n !== "reset" || t != null)) {
        kn(l);
        return;
      }
      a = a != null ? "" + it(a) : "", t = t != null ? "" + it(t) : a, c || t === l.value || (l.value = t), l.defaultValue = t;
    }
    u = u ?? e, u = typeof u != "function" && typeof u != "symbol" && !!u, l.checked = c ? l.checked : !!u, l.defaultChecked = !!u, f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" && (l.name = f), kn(l);
  }
  function In(l, t, a) {
    t === "number" && Ue(l.ownerDocument) === l || l.defaultValue === "" + a || (l.defaultValue = "" + a);
  }
  function wa(l, t, a, u) {
    if (l = l.options, t) {
      t = {};
      for (var e = 0; e < a.length; e++)
        t["$" + a[e]] = !0;
      for (a = 0; a < l.length; a++)
        e = t.hasOwnProperty("$" + l[a].value), l[a].selected !== e && (l[a].selected = e), e && u && (l[a].defaultSelected = !0);
    } else {
      for (a = "" + it(a), t = null, e = 0; e < l.length; e++) {
        if (l[e].value === a) {
          l[e].selected = !0, u && (l[e].defaultSelected = !0);
          return;
        }
        t !== null || l[e].disabled || (t = l[e]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function pi(l, t, a) {
    if (t != null && (t = "" + it(t), t !== l.value && (l.value = t), a == null)) {
      l.defaultValue !== t && (l.defaultValue = t);
      return;
    }
    l.defaultValue = a != null ? "" + it(a) : "";
  }
  function Ni(l, t, a, u) {
    if (t == null) {
      if (u != null) {
        if (a != null) throw Error(o(92));
        if (Et(u)) {
          if (1 < u.length) throw Error(o(93));
          u = u[0];
        }
        a = u;
      }
      a == null && (a = ""), t = a;
    }
    a = it(t), l.defaultValue = a, u = l.textContent, u === a && u !== "" && u !== null && (l.value = u), kn(l);
  }
  function Wa(l, t) {
    if (t) {
      var a = l.firstChild;
      if (a && a === l.lastChild && a.nodeType === 3) {
        a.nodeValue = t;
        return;
      }
    }
    l.textContent = t;
  }
  var Xv = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Hi(l, t, a) {
    var u = t.indexOf("--") === 0;
    a == null || typeof a == "boolean" || a === "" ? u ? l.setProperty(t, "") : t === "float" ? l.cssFloat = "" : l[t] = "" : u ? l.setProperty(t, a) : typeof a != "number" || a === 0 || Xv.has(t) ? t === "float" ? l.cssFloat = a : l[t] = ("" + a).trim() : l[t] = a + "px";
  }
  function Ci(l, t, a) {
    if (t != null && typeof t != "object")
      throw Error(o(62));
    if (l = l.style, a != null) {
      for (var u in a)
        !a.hasOwnProperty(u) || t != null && t.hasOwnProperty(u) || (u.indexOf("--") === 0 ? l.setProperty(u, "") : u === "float" ? l.cssFloat = "" : l[u] = "");
      for (var e in t)
        u = t[e], t.hasOwnProperty(e) && a[e] !== u && Hi(l, e, u);
    } else
      for (var n in t)
        t.hasOwnProperty(n) && Hi(l, n, t[n]);
  }
  function Pn(l) {
    if (l.indexOf("-") === -1) return !1;
    switch (l) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Qv = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), jv = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function pe(l) {
    return jv.test("" + l) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : l;
  }
  function Ct() {
  }
  var lf = null;
  function tf(l) {
    return l = l.target || l.srcElement || window, l.correspondingUseElement && (l = l.correspondingUseElement), l.nodeType === 3 ? l.parentNode : l;
  }
  var $a = null, ka = null;
  function qi(l) {
    var t = xa(l);
    if (t && (l = t.stateNode)) {
      var a = l[Ll] || null;
      l: switch (l = t.stateNode, t.type) {
        case "input":
          if (Fn(
            l,
            a.value,
            a.defaultValue,
            a.defaultValue,
            a.checked,
            a.defaultChecked,
            a.type,
            a.name
          ), t = a.name, a.type === "radio" && t != null) {
            for (a = l; a.parentNode; ) a = a.parentNode;
            for (a = a.querySelectorAll(
              'input[name="' + mt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < a.length; t++) {
              var u = a[t];
              if (u !== l && u.form === l.form) {
                var e = u[Ll] || null;
                if (!e) throw Error(o(90));
                Fn(
                  u,
                  e.value,
                  e.defaultValue,
                  e.defaultValue,
                  e.checked,
                  e.defaultChecked,
                  e.type,
                  e.name
                );
              }
            }
            for (t = 0; t < a.length; t++)
              u = a[t], u.form === l.form && Di(u);
          }
          break l;
        case "textarea":
          pi(l, a.value, a.defaultValue);
          break l;
        case "select":
          t = a.value, t != null && wa(l, !!a.multiple, t, !1);
      }
    }
  }
  var af = !1;
  function Ri(l, t, a) {
    if (af) return l(t, a);
    af = !0;
    try {
      var u = l(t);
      return u;
    } finally {
      if (af = !1, ($a !== null || ka !== null) && (Sn(), $a && (t = $a, l = ka, ka = $a = null, qi(t), l)))
        for (t = 0; t < l.length; t++) qi(l[t]);
    }
  }
  function Cu(l, t) {
    var a = l.stateNode;
    if (a === null) return null;
    var u = a[Ll] || null;
    if (u === null) return null;
    a = u[t];
    l: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (u = !u.disabled) || (l = l.type, u = !(l === "button" || l === "input" || l === "select" || l === "textarea")), l = !u;
        break l;
      default:
        l = !1;
    }
    if (l) return null;
    if (a && typeof a != "function")
      throw Error(
        o(231, t, typeof a)
      );
    return a;
  }
  var qt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), uf = !1;
  if (qt)
    try {
      var qu = {};
      Object.defineProperty(qu, "passive", {
        get: function() {
          uf = !0;
        }
      }), window.addEventListener("test", qu, qu), window.removeEventListener("test", qu, qu);
    } catch {
      uf = !1;
    }
  var It = null, ef = null, Ne = null;
  function Bi() {
    if (Ne) return Ne;
    var l, t = ef, a = t.length, u, e = "value" in It ? It.value : It.textContent, n = e.length;
    for (l = 0; l < a && t[l] === e[l]; l++) ;
    var f = a - l;
    for (u = 1; u <= f && t[a - u] === e[n - u]; u++) ;
    return Ne = e.slice(l, 1 < u ? 1 - u : void 0);
  }
  function He(l) {
    var t = l.keyCode;
    return "charCode" in l ? (l = l.charCode, l === 0 && t === 13 && (l = 13)) : l = t, l === 10 && (l = 13), 32 <= l || l === 13 ? l : 0;
  }
  function Ce() {
    return !0;
  }
  function Yi() {
    return !1;
  }
  function xl(l) {
    function t(a, u, e, n, f) {
      this._reactName = a, this._targetInst = e, this.type = u, this.nativeEvent = n, this.target = f, this.currentTarget = null;
      for (var c in l)
        l.hasOwnProperty(c) && (a = l[c], this[c] = a ? a(n) : n[c]);
      return this.isDefaultPrevented = (n.defaultPrevented != null ? n.defaultPrevented : n.returnValue === !1) ? Ce : Yi, this.isPropagationStopped = Yi, this;
    }
    return q(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var a = this.nativeEvent;
        a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = Ce);
      },
      stopPropagation: function() {
        var a = this.nativeEvent;
        a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = Ce);
      },
      persist: function() {
      },
      isPersistent: Ce
    }), t;
  }
  var Oa = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(l) {
      return l.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, qe = xl(Oa), Ru = q({}, Oa, { view: 0, detail: 0 }), Zv = xl(Ru), nf, ff, Bu, Re = q({}, Ru, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: mf,
    button: 0,
    buttons: 0,
    relatedTarget: function(l) {
      return l.relatedTarget === void 0 ? l.fromElement === l.srcElement ? l.toElement : l.fromElement : l.relatedTarget;
    },
    movementX: function(l) {
      return "movementX" in l ? l.movementX : (l !== Bu && (Bu && l.type === "mousemove" ? (nf = l.screenX - Bu.screenX, ff = l.screenY - Bu.screenY) : ff = nf = 0, Bu = l), nf);
    },
    movementY: function(l) {
      return "movementY" in l ? l.movementY : ff;
    }
  }), Gi = xl(Re), Vv = q({}, Re, { dataTransfer: 0 }), Lv = xl(Vv), xv = q({}, Ru, { relatedTarget: 0 }), cf = xl(xv), Kv = q({}, Oa, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Jv = xl(Kv), wv = q({}, Oa, {
    clipboardData: function(l) {
      return "clipboardData" in l ? l.clipboardData : window.clipboardData;
    }
  }), Wv = xl(wv), $v = q({}, Oa, { data: 0 }), Xi = xl($v), kv = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Fv = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Iv = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Pv(l) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(l) : (l = Iv[l]) ? !!t[l] : !1;
  }
  function mf() {
    return Pv;
  }
  var ls = q({}, Ru, {
    key: function(l) {
      if (l.key) {
        var t = kv[l.key] || l.key;
        if (t !== "Unidentified") return t;
      }
      return l.type === "keypress" ? (l = He(l), l === 13 ? "Enter" : String.fromCharCode(l)) : l.type === "keydown" || l.type === "keyup" ? Fv[l.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: mf,
    charCode: function(l) {
      return l.type === "keypress" ? He(l) : 0;
    },
    keyCode: function(l) {
      return l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    },
    which: function(l) {
      return l.type === "keypress" ? He(l) : l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    }
  }), ts = xl(ls), as = q({}, Re, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), Qi = xl(as), us = q({}, Ru, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: mf
  }), es = xl(us), ns = q({}, Oa, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), fs = xl(ns), cs = q({}, Re, {
    deltaX: function(l) {
      return "deltaX" in l ? l.deltaX : "wheelDeltaX" in l ? -l.wheelDeltaX : 0;
    },
    deltaY: function(l) {
      return "deltaY" in l ? l.deltaY : "wheelDeltaY" in l ? -l.wheelDeltaY : "wheelDelta" in l ? -l.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), is = xl(cs), ms = q({}, Oa, {
    newState: 0,
    oldState: 0
  }), ys = xl(ms), vs = [9, 13, 27, 32], yf = qt && "CompositionEvent" in window, Yu = null;
  qt && "documentMode" in document && (Yu = document.documentMode);
  var ss = qt && "TextEvent" in window && !Yu, ji = qt && (!yf || Yu && 8 < Yu && 11 >= Yu), Zi = " ", Vi = !1;
  function Li(l, t) {
    switch (l) {
      case "keyup":
        return vs.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function xi(l) {
    return l = l.detail, typeof l == "object" && "data" in l ? l.data : null;
  }
  var Fa = !1;
  function hs(l, t) {
    switch (l) {
      case "compositionend":
        return xi(t);
      case "keypress":
        return t.which !== 32 ? null : (Vi = !0, Zi);
      case "textInput":
        return l = t.data, l === Zi && Vi ? null : l;
      default:
        return null;
    }
  }
  function ds(l, t) {
    if (Fa)
      return l === "compositionend" || !yf && Li(l, t) ? (l = Bi(), Ne = ef = It = null, Fa = !1, l) : null;
    switch (l) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length)
            return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return ji && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var os = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function Ki(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t === "input" ? !!os[l.type] : t === "textarea";
  }
  function Ji(l, t, a, u) {
    $a ? ka ? ka.push(u) : ka = [u] : $a = u, t = _n(t, "onChange"), 0 < t.length && (a = new qe(
      "onChange",
      "change",
      null,
      a,
      u
    ), l.push({ event: a, listeners: t }));
  }
  var Gu = null, Xu = null;
  function gs(l) {
    Uy(l, 0);
  }
  function Be(l) {
    var t = Hu(l);
    if (Di(t)) return l;
  }
  function wi(l, t) {
    if (l === "change") return t;
  }
  var Wi = !1;
  if (qt) {
    var vf;
    if (qt) {
      var sf = "oninput" in document;
      if (!sf) {
        var $i = document.createElement("div");
        $i.setAttribute("oninput", "return;"), sf = typeof $i.oninput == "function";
      }
      vf = sf;
    } else vf = !1;
    Wi = vf && (!document.documentMode || 9 < document.documentMode);
  }
  function ki() {
    Gu && (Gu.detachEvent("onpropertychange", Fi), Xu = Gu = null);
  }
  function Fi(l) {
    if (l.propertyName === "value" && Be(Xu)) {
      var t = [];
      Ji(
        t,
        Xu,
        l,
        tf(l)
      ), Ri(gs, t);
    }
  }
  function Ss(l, t, a) {
    l === "focusin" ? (ki(), Gu = t, Xu = a, Gu.attachEvent("onpropertychange", Fi)) : l === "focusout" && ki();
  }
  function bs(l) {
    if (l === "selectionchange" || l === "keyup" || l === "keydown")
      return Be(Xu);
  }
  function Es(l, t) {
    if (l === "click") return Be(t);
  }
  function zs(l, t) {
    if (l === "input" || l === "change")
      return Be(t);
  }
  function rs(l, t) {
    return l === t && (l !== 0 || 1 / l === 1 / t) || l !== l && t !== t;
  }
  var lt = typeof Object.is == "function" ? Object.is : rs;
  function Qu(l, t) {
    if (lt(l, t)) return !0;
    if (typeof l != "object" || l === null || typeof t != "object" || t === null)
      return !1;
    var a = Object.keys(l), u = Object.keys(t);
    if (a.length !== u.length) return !1;
    for (u = 0; u < a.length; u++) {
      var e = a[u];
      if (!Vn.call(t, e) || !lt(l[e], t[e]))
        return !1;
    }
    return !0;
  }
  function Ii(l) {
    for (; l && l.firstChild; ) l = l.firstChild;
    return l;
  }
  function Pi(l, t) {
    var a = Ii(l);
    l = 0;
    for (var u; a; ) {
      if (a.nodeType === 3) {
        if (u = l + a.textContent.length, l <= t && u >= t)
          return { node: a, offset: t - l };
        l = u;
      }
      l: {
        for (; a; ) {
          if (a.nextSibling) {
            a = a.nextSibling;
            break l;
          }
          a = a.parentNode;
        }
        a = void 0;
      }
      a = Ii(a);
    }
  }
  function l0(l, t) {
    return l && t ? l === t ? !0 : l && l.nodeType === 3 ? !1 : t && t.nodeType === 3 ? l0(l, t.parentNode) : "contains" in l ? l.contains(t) : l.compareDocumentPosition ? !!(l.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function t0(l) {
    l = l != null && l.ownerDocument != null && l.ownerDocument.defaultView != null ? l.ownerDocument.defaultView : window;
    for (var t = Ue(l.document); t instanceof l.HTMLIFrameElement; ) {
      try {
        var a = typeof t.contentWindow.location.href == "string";
      } catch {
        a = !1;
      }
      if (a) l = t.contentWindow;
      else break;
      t = Ue(l.document);
    }
    return t;
  }
  function hf(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t && (t === "input" && (l.type === "text" || l.type === "search" || l.type === "tel" || l.type === "url" || l.type === "password") || t === "textarea" || l.contentEditable === "true");
  }
  var Ts = qt && "documentMode" in document && 11 >= document.documentMode, Ia = null, df = null, ju = null, of = !1;
  function a0(l, t, a) {
    var u = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
    of || Ia == null || Ia !== Ue(u) || (u = Ia, "selectionStart" in u && hf(u) ? u = { start: u.selectionStart, end: u.selectionEnd } : (u = (u.ownerDocument && u.ownerDocument.defaultView || window).getSelection(), u = {
      anchorNode: u.anchorNode,
      anchorOffset: u.anchorOffset,
      focusNode: u.focusNode,
      focusOffset: u.focusOffset
    }), ju && Qu(ju, u) || (ju = u, u = _n(df, "onSelect"), 0 < u.length && (t = new qe(
      "onSelect",
      "select",
      null,
      t,
      a
    ), l.push({ event: t, listeners: u }), t.target = Ia)));
  }
  function Ma(l, t) {
    var a = {};
    return a[l.toLowerCase()] = t.toLowerCase(), a["Webkit" + l] = "webkit" + t, a["Moz" + l] = "moz" + t, a;
  }
  var Pa = {
    animationend: Ma("Animation", "AnimationEnd"),
    animationiteration: Ma("Animation", "AnimationIteration"),
    animationstart: Ma("Animation", "AnimationStart"),
    transitionrun: Ma("Transition", "TransitionRun"),
    transitionstart: Ma("Transition", "TransitionStart"),
    transitioncancel: Ma("Transition", "TransitionCancel"),
    transitionend: Ma("Transition", "TransitionEnd")
  }, gf = {}, u0 = {};
  qt && (u0 = document.createElement("div").style, "AnimationEvent" in window || (delete Pa.animationend.animation, delete Pa.animationiteration.animation, delete Pa.animationstart.animation), "TransitionEvent" in window || delete Pa.transitionend.transition);
  function Da(l) {
    if (gf[l]) return gf[l];
    if (!Pa[l]) return l;
    var t = Pa[l], a;
    for (a in t)
      if (t.hasOwnProperty(a) && a in u0)
        return gf[l] = t[a];
    return l;
  }
  var e0 = Da("animationend"), n0 = Da("animationiteration"), f0 = Da("animationstart"), As = Da("transitionrun"), _s = Da("transitionstart"), Os = Da("transitioncancel"), c0 = Da("transitionend"), i0 = /* @__PURE__ */ new Map(), Sf = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Sf.push("scrollEnd");
  function zt(l, t) {
    i0.set(l, t), _a(t, [l]);
  }
  var Ye = typeof reportError == "function" ? reportError : function(l) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var t = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof l == "object" && l !== null && typeof l.message == "string" ? String(l.message) : String(l),
        error: l
      });
      if (!window.dispatchEvent(t)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", l);
      return;
    }
    console.error(l);
  }, yt = [], lu = 0, bf = 0;
  function Ge() {
    for (var l = lu, t = bf = lu = 0; t < l; ) {
      var a = yt[t];
      yt[t++] = null;
      var u = yt[t];
      yt[t++] = null;
      var e = yt[t];
      yt[t++] = null;
      var n = yt[t];
      if (yt[t++] = null, u !== null && e !== null) {
        var f = u.pending;
        f === null ? e.next = e : (e.next = f.next, f.next = e), u.pending = e;
      }
      n !== 0 && m0(a, e, n);
    }
  }
  function Xe(l, t, a, u) {
    yt[lu++] = l, yt[lu++] = t, yt[lu++] = a, yt[lu++] = u, bf |= u, l.lanes |= u, l = l.alternate, l !== null && (l.lanes |= u);
  }
  function Ef(l, t, a, u) {
    return Xe(l, t, a, u), Qe(l);
  }
  function Ua(l, t) {
    return Xe(l, null, null, t), Qe(l);
  }
  function m0(l, t, a) {
    l.lanes |= a;
    var u = l.alternate;
    u !== null && (u.lanes |= a);
    for (var e = !1, n = l.return; n !== null; )
      n.childLanes |= a, u = n.alternate, u !== null && (u.childLanes |= a), n.tag === 22 && (l = n.stateNode, l === null || l._visibility & 1 || (e = !0)), l = n, n = n.return;
    return l.tag === 3 ? (n = l.stateNode, e && t !== null && (e = 31 - Pl(a), l = n.hiddenUpdates, u = l[e], u === null ? l[e] = [t] : u.push(t), t.lane = a | 536870912), n) : null;
  }
  function Qe(l) {
    if (50 < ie)
      throw ie = 0, Uc = null, Error(o(185));
    for (var t = l.return; t !== null; )
      l = t, t = l.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var tu = {};
  function Ms(l, t, a, u) {
    this.tag = l, this.key = a, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = u, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function tt(l, t, a, u) {
    return new Ms(l, t, a, u);
  }
  function zf(l) {
    return l = l.prototype, !(!l || !l.isReactComponent);
  }
  function Rt(l, t) {
    var a = l.alternate;
    return a === null ? (a = tt(
      l.tag,
      t,
      l.key,
      l.mode
    ), a.elementType = l.elementType, a.type = l.type, a.stateNode = l.stateNode, a.alternate = l, l.alternate = a) : (a.pendingProps = t, a.type = l.type, a.flags = 0, a.subtreeFlags = 0, a.deletions = null), a.flags = l.flags & 65011712, a.childLanes = l.childLanes, a.lanes = l.lanes, a.child = l.child, a.memoizedProps = l.memoizedProps, a.memoizedState = l.memoizedState, a.updateQueue = l.updateQueue, t = l.dependencies, a.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, a.sibling = l.sibling, a.index = l.index, a.ref = l.ref, a.refCleanup = l.refCleanup, a;
  }
  function y0(l, t) {
    l.flags &= 65011714;
    var a = l.alternate;
    return a === null ? (l.childLanes = 0, l.lanes = t, l.child = null, l.subtreeFlags = 0, l.memoizedProps = null, l.memoizedState = null, l.updateQueue = null, l.dependencies = null, l.stateNode = null) : (l.childLanes = a.childLanes, l.lanes = a.lanes, l.child = a.child, l.subtreeFlags = 0, l.deletions = null, l.memoizedProps = a.memoizedProps, l.memoizedState = a.memoizedState, l.updateQueue = a.updateQueue, l.type = a.type, t = a.dependencies, l.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), l;
  }
  function je(l, t, a, u, e, n) {
    var f = 0;
    if (u = l, typeof l == "function") zf(l) && (f = 1);
    else if (typeof l == "string")
      f = Hh(
        l,
        a,
        p.current
      ) ? 26 : l === "html" || l === "head" || l === "body" ? 27 : 5;
    else
      l: switch (l) {
        case _t:
          return l = tt(31, a, t, e), l.elementType = _t, l.lanes = n, l;
        case Dl:
          return pa(a.children, e, n, t);
        case bt:
          f = 8, e |= 24;
          break;
        case Yl:
          return l = tt(12, a, t, e | 2), l.elementType = Yl, l.lanes = n, l;
        case At:
          return l = tt(13, a, t, e), l.elementType = At, l.lanes = n, l;
        case jl:
          return l = tt(19, a, t, e), l.elementType = jl, l.lanes = n, l;
        default:
          if (typeof l == "object" && l !== null)
            switch (l.$$typeof) {
              case D:
                f = 10;
                break l;
              case ct:
                f = 9;
                break l;
              case vl:
                f = 11;
                break l;
              case K:
                f = 14;
                break l;
              case Zl:
                f = 16, u = null;
                break l;
            }
          f = 29, a = Error(
            o(130, l === null ? "null" : typeof l, "")
          ), u = null;
      }
    return t = tt(f, a, t, e), t.elementType = l, t.type = u, t.lanes = n, t;
  }
  function pa(l, t, a, u) {
    return l = tt(7, l, u, t), l.lanes = a, l;
  }
  function rf(l, t, a) {
    return l = tt(6, l, null, t), l.lanes = a, l;
  }
  function v0(l) {
    var t = tt(18, null, null, 0);
    return t.stateNode = l, t;
  }
  function Tf(l, t, a) {
    return t = tt(
      4,
      l.children !== null ? l.children : [],
      l.key,
      t
    ), t.lanes = a, t.stateNode = {
      containerInfo: l.containerInfo,
      pendingChildren: null,
      implementation: l.implementation
    }, t;
  }
  var s0 = /* @__PURE__ */ new WeakMap();
  function vt(l, t) {
    if (typeof l == "object" && l !== null) {
      var a = s0.get(l);
      return a !== void 0 ? a : (t = {
        value: l,
        source: t,
        stack: vi(t)
      }, s0.set(l, t), t);
    }
    return {
      value: l,
      source: t,
      stack: vi(t)
    };
  }
  var au = [], uu = 0, Ze = null, Zu = 0, st = [], ht = 0, Pt = null, Mt = 1, Dt = "";
  function Bt(l, t) {
    au[uu++] = Zu, au[uu++] = Ze, Ze = l, Zu = t;
  }
  function h0(l, t, a) {
    st[ht++] = Mt, st[ht++] = Dt, st[ht++] = Pt, Pt = l;
    var u = Mt;
    l = Dt;
    var e = 32 - Pl(u) - 1;
    u &= ~(1 << e), a += 1;
    var n = 32 - Pl(t) + e;
    if (30 < n) {
      var f = e - e % 5;
      n = (u & (1 << f) - 1).toString(32), u >>= f, e -= f, Mt = 1 << 32 - Pl(t) + e | a << e | u, Dt = n + l;
    } else
      Mt = 1 << n | a << e | u, Dt = l;
  }
  function Af(l) {
    l.return !== null && (Bt(l, 1), h0(l, 1, 0));
  }
  function _f(l) {
    for (; l === Ze; )
      Ze = au[--uu], au[uu] = null, Zu = au[--uu], au[uu] = null;
    for (; l === Pt; )
      Pt = st[--ht], st[ht] = null, Dt = st[--ht], st[ht] = null, Mt = st[--ht], st[ht] = null;
  }
  function d0(l, t) {
    st[ht++] = Mt, st[ht++] = Dt, st[ht++] = Pt, Mt = t.id, Dt = t.overflow, Pt = l;
  }
  var pl = null, ml = null, J = !1, la = null, dt = !1, Of = Error(o(519));
  function ta(l) {
    var t = Error(
      o(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Vu(vt(t, l)), Of;
  }
  function o0(l) {
    var t = l.stateNode, a = l.type, u = l.memoizedProps;
    switch (t[Ul] = l, t[Ll] = u, a) {
      case "dialog":
        V("cancel", t), V("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        V("load", t);
        break;
      case "video":
      case "audio":
        for (a = 0; a < ye.length; a++)
          V(ye[a], t);
        break;
      case "source":
        V("error", t);
        break;
      case "img":
      case "image":
      case "link":
        V("error", t), V("load", t);
        break;
      case "details":
        V("toggle", t);
        break;
      case "input":
        V("invalid", t), Ui(
          t,
          u.value,
          u.defaultValue,
          u.checked,
          u.defaultChecked,
          u.type,
          u.name,
          !0
        );
        break;
      case "select":
        V("invalid", t);
        break;
      case "textarea":
        V("invalid", t), Ni(t, u.value, u.defaultValue, u.children);
    }
    a = u.children, typeof a != "string" && typeof a != "number" && typeof a != "bigint" || t.textContent === "" + a || u.suppressHydrationWarning === !0 || Cy(t.textContent, a) ? (u.popover != null && (V("beforetoggle", t), V("toggle", t)), u.onScroll != null && V("scroll", t), u.onScrollEnd != null && V("scrollend", t), u.onClick != null && (t.onclick = Ct), t = !0) : t = !1, t || ta(l, !0);
  }
  function g0(l) {
    for (pl = l.return; pl; )
      switch (pl.tag) {
        case 5:
        case 31:
        case 13:
          dt = !1;
          return;
        case 27:
        case 3:
          dt = !0;
          return;
        default:
          pl = pl.return;
      }
  }
  function eu(l) {
    if (l !== pl) return !1;
    if (!J) return g0(l), J = !0, !1;
    var t = l.tag, a;
    if ((a = t !== 3 && t !== 27) && ((a = t === 5) && (a = l.type, a = !(a !== "form" && a !== "button") || Lc(l.type, l.memoizedProps)), a = !a), a && ml && ta(l), g0(l), t === 13) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(o(317));
      ml = Zy(l);
    } else if (t === 31) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(o(317));
      ml = Zy(l);
    } else
      t === 27 ? (t = ml, oa(l.type) ? (l = Wc, Wc = null, ml = l) : ml = t) : ml = pl ? gt(l.stateNode.nextSibling) : null;
    return !0;
  }
  function Na() {
    ml = pl = null, J = !1;
  }
  function Mf() {
    var l = la;
    return l !== null && (Wl === null ? Wl = l : Wl.push.apply(
      Wl,
      l
    ), la = null), l;
  }
  function Vu(l) {
    la === null ? la = [l] : la.push(l);
  }
  var Df = y(null), Ha = null, Yt = null;
  function aa(l, t, a) {
    M(Df, t._currentValue), t._currentValue = a;
  }
  function Gt(l) {
    l._currentValue = Df.current, r(Df);
  }
  function Uf(l, t, a) {
    for (; l !== null; ) {
      var u = l.alternate;
      if ((l.childLanes & t) !== t ? (l.childLanes |= t, u !== null && (u.childLanes |= t)) : u !== null && (u.childLanes & t) !== t && (u.childLanes |= t), l === a) break;
      l = l.return;
    }
  }
  function pf(l, t, a, u) {
    var e = l.child;
    for (e !== null && (e.return = l); e !== null; ) {
      var n = e.dependencies;
      if (n !== null) {
        var f = e.child;
        n = n.firstContext;
        l: for (; n !== null; ) {
          var c = n;
          n = e;
          for (var i = 0; i < t.length; i++)
            if (c.context === t[i]) {
              n.lanes |= a, c = n.alternate, c !== null && (c.lanes |= a), Uf(
                n.return,
                a,
                l
              ), u || (f = null);
              break l;
            }
          n = c.next;
        }
      } else if (e.tag === 18) {
        if (f = e.return, f === null) throw Error(o(341));
        f.lanes |= a, n = f.alternate, n !== null && (n.lanes |= a), Uf(f, a, l), f = null;
      } else f = e.child;
      if (f !== null) f.return = e;
      else
        for (f = e; f !== null; ) {
          if (f === l) {
            f = null;
            break;
          }
          if (e = f.sibling, e !== null) {
            e.return = f.return, f = e;
            break;
          }
          f = f.return;
        }
      e = f;
    }
  }
  function nu(l, t, a, u) {
    l = null;
    for (var e = t, n = !1; e !== null; ) {
      if (!n) {
        if ((e.flags & 524288) !== 0) n = !0;
        else if ((e.flags & 262144) !== 0) break;
      }
      if (e.tag === 10) {
        var f = e.alternate;
        if (f === null) throw Error(o(387));
        if (f = f.memoizedProps, f !== null) {
          var c = e.type;
          lt(e.pendingProps.value, f.value) || (l !== null ? l.push(c) : l = [c]);
        }
      } else if (e === F.current) {
        if (f = e.alternate, f === null) throw Error(o(387));
        f.memoizedState.memoizedState !== e.memoizedState.memoizedState && (l !== null ? l.push(oe) : l = [oe]);
      }
      e = e.return;
    }
    l !== null && pf(
      t,
      l,
      a,
      u
    ), t.flags |= 262144;
  }
  function Ve(l) {
    for (l = l.firstContext; l !== null; ) {
      if (!lt(
        l.context._currentValue,
        l.memoizedValue
      ))
        return !0;
      l = l.next;
    }
    return !1;
  }
  function Ca(l) {
    Ha = l, Yt = null, l = l.dependencies, l !== null && (l.firstContext = null);
  }
  function Nl(l) {
    return S0(Ha, l);
  }
  function Le(l, t) {
    return Ha === null && Ca(l), S0(l, t);
  }
  function S0(l, t) {
    var a = t._currentValue;
    if (t = { context: t, memoizedValue: a, next: null }, Yt === null) {
      if (l === null) throw Error(o(308));
      Yt = t, l.dependencies = { lanes: 0, firstContext: t }, l.flags |= 524288;
    } else Yt = Yt.next = t;
    return a;
  }
  var Ds = typeof AbortController < "u" ? AbortController : function() {
    var l = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(a, u) {
        l.push(u);
      }
    };
    this.abort = function() {
      t.aborted = !0, l.forEach(function(a) {
        return a();
      });
    };
  }, Us = _.unstable_scheduleCallback, ps = _.unstable_NormalPriority, bl = {
    $$typeof: D,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Nf() {
    return {
      controller: new Ds(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Lu(l) {
    l.refCount--, l.refCount === 0 && Us(ps, function() {
      l.controller.abort();
    });
  }
  var xu = null, Hf = 0, fu = 0, cu = null;
  function Ns(l, t) {
    if (xu === null) {
      var a = xu = [];
      Hf = 0, fu = Rc(), cu = {
        status: "pending",
        value: void 0,
        then: function(u) {
          a.push(u);
        }
      };
    }
    return Hf++, t.then(b0, b0), t;
  }
  function b0() {
    if (--Hf === 0 && xu !== null) {
      cu !== null && (cu.status = "fulfilled");
      var l = xu;
      xu = null, fu = 0, cu = null;
      for (var t = 0; t < l.length; t++) (0, l[t])();
    }
  }
  function Hs(l, t) {
    var a = [], u = {
      status: "pending",
      value: null,
      reason: null,
      then: function(e) {
        a.push(e);
      }
    };
    return l.then(
      function() {
        u.status = "fulfilled", u.value = t;
        for (var e = 0; e < a.length; e++) (0, a[e])(t);
      },
      function(e) {
        for (u.status = "rejected", u.reason = e, e = 0; e < a.length; e++)
          (0, a[e])(void 0);
      }
    ), u;
  }
  var E0 = b.S;
  b.S = function(l, t) {
    ay = Fl(), typeof t == "object" && t !== null && typeof t.then == "function" && Ns(l, t), E0 !== null && E0(l, t);
  };
  var qa = y(null);
  function Cf() {
    var l = qa.current;
    return l !== null ? l : cl.pooledCache;
  }
  function xe(l, t) {
    t === null ? M(qa, qa.current) : M(qa, t.pool);
  }
  function z0() {
    var l = Cf();
    return l === null ? null : { parent: bl._currentValue, pool: l };
  }
  var iu = Error(o(460)), qf = Error(o(474)), Ke = Error(o(542)), Je = { then: function() {
  } };
  function r0(l) {
    return l = l.status, l === "fulfilled" || l === "rejected";
  }
  function T0(l, t, a) {
    switch (a = l[a], a === void 0 ? l.push(t) : a !== t && (t.then(Ct, Ct), t = a), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw l = t.reason, _0(l), l;
      default:
        if (typeof t.status == "string") t.then(Ct, Ct);
        else {
          if (l = cl, l !== null && 100 < l.shellSuspendCounter)
            throw Error(o(482));
          l = t, l.status = "pending", l.then(
            function(u) {
              if (t.status === "pending") {
                var e = t;
                e.status = "fulfilled", e.value = u;
              }
            },
            function(u) {
              if (t.status === "pending") {
                var e = t;
                e.status = "rejected", e.reason = u;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw l = t.reason, _0(l), l;
        }
        throw Ba = t, iu;
    }
  }
  function Ra(l) {
    try {
      var t = l._init;
      return t(l._payload);
    } catch (a) {
      throw a !== null && typeof a == "object" && typeof a.then == "function" ? (Ba = a, iu) : a;
    }
  }
  var Ba = null;
  function A0() {
    if (Ba === null) throw Error(o(459));
    var l = Ba;
    return Ba = null, l;
  }
  function _0(l) {
    if (l === iu || l === Ke)
      throw Error(o(483));
  }
  var mu = null, Ku = 0;
  function we(l) {
    var t = Ku;
    return Ku += 1, mu === null && (mu = []), T0(mu, l, t);
  }
  function Ju(l, t) {
    t = t.props.ref, l.ref = t !== void 0 ? t : null;
  }
  function We(l, t) {
    throw t.$$typeof === P ? Error(o(525)) : (l = Object.prototype.toString.call(t), Error(
      o(
        31,
        l === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : l
      )
    ));
  }
  function O0(l) {
    function t(v, m) {
      if (l) {
        var s = v.deletions;
        s === null ? (v.deletions = [m], v.flags |= 16) : s.push(m);
      }
    }
    function a(v, m) {
      if (!l) return null;
      for (; m !== null; )
        t(v, m), m = m.sibling;
      return null;
    }
    function u(v) {
      for (var m = /* @__PURE__ */ new Map(); v !== null; )
        v.key !== null ? m.set(v.key, v) : m.set(v.index, v), v = v.sibling;
      return m;
    }
    function e(v, m) {
      return v = Rt(v, m), v.index = 0, v.sibling = null, v;
    }
    function n(v, m, s) {
      return v.index = s, l ? (s = v.alternate, s !== null ? (s = s.index, s < m ? (v.flags |= 67108866, m) : s) : (v.flags |= 67108866, m)) : (v.flags |= 1048576, m);
    }
    function f(v) {
      return l && v.alternate === null && (v.flags |= 67108866), v;
    }
    function c(v, m, s, E) {
      return m === null || m.tag !== 6 ? (m = rf(s, v.mode, E), m.return = v, m) : (m = e(m, s), m.return = v, m);
    }
    function i(v, m, s, E) {
      var C = s.type;
      return C === Dl ? S(
        v,
        m,
        s.props.children,
        E,
        s.key
      ) : m !== null && (m.elementType === C || typeof C == "object" && C !== null && C.$$typeof === Zl && Ra(C) === m.type) ? (m = e(m, s.props), Ju(m, s), m.return = v, m) : (m = je(
        s.type,
        s.key,
        s.props,
        null,
        v.mode,
        E
      ), Ju(m, s), m.return = v, m);
    }
    function h(v, m, s, E) {
      return m === null || m.tag !== 4 || m.stateNode.containerInfo !== s.containerInfo || m.stateNode.implementation !== s.implementation ? (m = Tf(s, v.mode, E), m.return = v, m) : (m = e(m, s.children || []), m.return = v, m);
    }
    function S(v, m, s, E, C) {
      return m === null || m.tag !== 7 ? (m = pa(
        s,
        v.mode,
        E,
        C
      ), m.return = v, m) : (m = e(m, s), m.return = v, m);
    }
    function z(v, m, s) {
      if (typeof m == "string" && m !== "" || typeof m == "number" || typeof m == "bigint")
        return m = rf(
          "" + m,
          v.mode,
          s
        ), m.return = v, m;
      if (typeof m == "object" && m !== null) {
        switch (m.$$typeof) {
          case Ml:
            return s = je(
              m.type,
              m.key,
              m.props,
              null,
              v.mode,
              s
            ), Ju(s, m), s.return = v, s;
          case ql:
            return m = Tf(
              m,
              v.mode,
              s
            ), m.return = v, m;
          case Zl:
            return m = Ra(m), z(v, m, s);
        }
        if (Et(m) || Vl(m))
          return m = pa(
            m,
            v.mode,
            s,
            null
          ), m.return = v, m;
        if (typeof m.then == "function")
          return z(v, we(m), s);
        if (m.$$typeof === D)
          return z(
            v,
            Le(v, m),
            s
          );
        We(v, m);
      }
      return null;
    }
    function d(v, m, s, E) {
      var C = m !== null ? m.key : null;
      if (typeof s == "string" && s !== "" || typeof s == "number" || typeof s == "bigint")
        return C !== null ? null : c(v, m, "" + s, E);
      if (typeof s == "object" && s !== null) {
        switch (s.$$typeof) {
          case Ml:
            return s.key === C ? i(v, m, s, E) : null;
          case ql:
            return s.key === C ? h(v, m, s, E) : null;
          case Zl:
            return s = Ra(s), d(v, m, s, E);
        }
        if (Et(s) || Vl(s))
          return C !== null ? null : S(v, m, s, E, null);
        if (typeof s.then == "function")
          return d(
            v,
            m,
            we(s),
            E
          );
        if (s.$$typeof === D)
          return d(
            v,
            m,
            Le(v, s),
            E
          );
        We(v, s);
      }
      return null;
    }
    function g(v, m, s, E, C) {
      if (typeof E == "string" && E !== "" || typeof E == "number" || typeof E == "bigint")
        return v = v.get(s) || null, c(m, v, "" + E, C);
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case Ml:
            return v = v.get(
              E.key === null ? s : E.key
            ) || null, i(m, v, E, C);
          case ql:
            return v = v.get(
              E.key === null ? s : E.key
            ) || null, h(m, v, E, C);
          case Zl:
            return E = Ra(E), g(
              v,
              m,
              s,
              E,
              C
            );
        }
        if (Et(E) || Vl(E))
          return v = v.get(s) || null, S(m, v, E, C, null);
        if (typeof E.then == "function")
          return g(
            v,
            m,
            s,
            we(E),
            C
          );
        if (E.$$typeof === D)
          return g(
            v,
            m,
            s,
            Le(m, E),
            C
          );
        We(m, E);
      }
      return null;
    }
    function U(v, m, s, E) {
      for (var C = null, W = null, N = m, Q = m = 0, x = null; N !== null && Q < s.length; Q++) {
        N.index > Q ? (x = N, N = null) : x = N.sibling;
        var $ = d(
          v,
          N,
          s[Q],
          E
        );
        if ($ === null) {
          N === null && (N = x);
          break;
        }
        l && N && $.alternate === null && t(v, N), m = n($, m, Q), W === null ? C = $ : W.sibling = $, W = $, N = x;
      }
      if (Q === s.length)
        return a(v, N), J && Bt(v, Q), C;
      if (N === null) {
        for (; Q < s.length; Q++)
          N = z(v, s[Q], E), N !== null && (m = n(
            N,
            m,
            Q
          ), W === null ? C = N : W.sibling = N, W = N);
        return J && Bt(v, Q), C;
      }
      for (N = u(N); Q < s.length; Q++)
        x = g(
          N,
          v,
          Q,
          s[Q],
          E
        ), x !== null && (l && x.alternate !== null && N.delete(
          x.key === null ? Q : x.key
        ), m = n(
          x,
          m,
          Q
        ), W === null ? C = x : W.sibling = x, W = x);
      return l && N.forEach(function(za) {
        return t(v, za);
      }), J && Bt(v, Q), C;
    }
    function R(v, m, s, E) {
      if (s == null) throw Error(o(151));
      for (var C = null, W = null, N = m, Q = m = 0, x = null, $ = s.next(); N !== null && !$.done; Q++, $ = s.next()) {
        N.index > Q ? (x = N, N = null) : x = N.sibling;
        var za = d(v, N, $.value, E);
        if (za === null) {
          N === null && (N = x);
          break;
        }
        l && N && za.alternate === null && t(v, N), m = n(za, m, Q), W === null ? C = za : W.sibling = za, W = za, N = x;
      }
      if ($.done)
        return a(v, N), J && Bt(v, Q), C;
      if (N === null) {
        for (; !$.done; Q++, $ = s.next())
          $ = z(v, $.value, E), $ !== null && (m = n($, m, Q), W === null ? C = $ : W.sibling = $, W = $);
        return J && Bt(v, Q), C;
      }
      for (N = u(N); !$.done; Q++, $ = s.next())
        $ = g(N, v, Q, $.value, E), $ !== null && (l && $.alternate !== null && N.delete($.key === null ? Q : $.key), m = n($, m, Q), W === null ? C = $ : W.sibling = $, W = $);
      return l && N.forEach(function(Vh) {
        return t(v, Vh);
      }), J && Bt(v, Q), C;
    }
    function nl(v, m, s, E) {
      if (typeof s == "object" && s !== null && s.type === Dl && s.key === null && (s = s.props.children), typeof s == "object" && s !== null) {
        switch (s.$$typeof) {
          case Ml:
            l: {
              for (var C = s.key; m !== null; ) {
                if (m.key === C) {
                  if (C = s.type, C === Dl) {
                    if (m.tag === 7) {
                      a(
                        v,
                        m.sibling
                      ), E = e(
                        m,
                        s.props.children
                      ), E.return = v, v = E;
                      break l;
                    }
                  } else if (m.elementType === C || typeof C == "object" && C !== null && C.$$typeof === Zl && Ra(C) === m.type) {
                    a(
                      v,
                      m.sibling
                    ), E = e(m, s.props), Ju(E, s), E.return = v, v = E;
                    break l;
                  }
                  a(v, m);
                  break;
                } else t(v, m);
                m = m.sibling;
              }
              s.type === Dl ? (E = pa(
                s.props.children,
                v.mode,
                E,
                s.key
              ), E.return = v, v = E) : (E = je(
                s.type,
                s.key,
                s.props,
                null,
                v.mode,
                E
              ), Ju(E, s), E.return = v, v = E);
            }
            return f(v);
          case ql:
            l: {
              for (C = s.key; m !== null; ) {
                if (m.key === C)
                  if (m.tag === 4 && m.stateNode.containerInfo === s.containerInfo && m.stateNode.implementation === s.implementation) {
                    a(
                      v,
                      m.sibling
                    ), E = e(m, s.children || []), E.return = v, v = E;
                    break l;
                  } else {
                    a(v, m);
                    break;
                  }
                else t(v, m);
                m = m.sibling;
              }
              E = Tf(s, v.mode, E), E.return = v, v = E;
            }
            return f(v);
          case Zl:
            return s = Ra(s), nl(
              v,
              m,
              s,
              E
            );
        }
        if (Et(s))
          return U(
            v,
            m,
            s,
            E
          );
        if (Vl(s)) {
          if (C = Vl(s), typeof C != "function") throw Error(o(150));
          return s = C.call(s), R(
            v,
            m,
            s,
            E
          );
        }
        if (typeof s.then == "function")
          return nl(
            v,
            m,
            we(s),
            E
          );
        if (s.$$typeof === D)
          return nl(
            v,
            m,
            Le(v, s),
            E
          );
        We(v, s);
      }
      return typeof s == "string" && s !== "" || typeof s == "number" || typeof s == "bigint" ? (s = "" + s, m !== null && m.tag === 6 ? (a(v, m.sibling), E = e(m, s), E.return = v, v = E) : (a(v, m), E = rf(s, v.mode, E), E.return = v, v = E), f(v)) : a(v, m);
    }
    return function(v, m, s, E) {
      try {
        Ku = 0;
        var C = nl(
          v,
          m,
          s,
          E
        );
        return mu = null, C;
      } catch (N) {
        if (N === iu || N === Ke) throw N;
        var W = tt(29, N, null, v.mode);
        return W.lanes = E, W.return = v, W;
      } finally {
      }
    };
  }
  var Ya = O0(!0), M0 = O0(!1), ua = !1;
  function Rf(l) {
    l.updateQueue = {
      baseState: l.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Bf(l, t) {
    l = l.updateQueue, t.updateQueue === l && (t.updateQueue = {
      baseState: l.baseState,
      firstBaseUpdate: l.firstBaseUpdate,
      lastBaseUpdate: l.lastBaseUpdate,
      shared: l.shared,
      callbacks: null
    });
  }
  function ea(l) {
    return { lane: l, tag: 0, payload: null, callback: null, next: null };
  }
  function na(l, t, a) {
    var u = l.updateQueue;
    if (u === null) return null;
    if (u = u.shared, (k & 2) !== 0) {
      var e = u.pending;
      return e === null ? t.next = t : (t.next = e.next, e.next = t), u.pending = t, t = Qe(l), m0(l, null, a), t;
    }
    return Xe(l, u, t, a), Qe(l);
  }
  function wu(l, t, a) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (a & 4194048) !== 0)) {
      var u = t.lanes;
      u &= l.pendingLanes, a |= u, t.lanes = a, Si(l, a);
    }
  }
  function Yf(l, t) {
    var a = l.updateQueue, u = l.alternate;
    if (u !== null && (u = u.updateQueue, a === u)) {
      var e = null, n = null;
      if (a = a.firstBaseUpdate, a !== null) {
        do {
          var f = {
            lane: a.lane,
            tag: a.tag,
            payload: a.payload,
            callback: null,
            next: null
          };
          n === null ? e = n = f : n = n.next = f, a = a.next;
        } while (a !== null);
        n === null ? e = n = t : n = n.next = t;
      } else e = n = t;
      a = {
        baseState: u.baseState,
        firstBaseUpdate: e,
        lastBaseUpdate: n,
        shared: u.shared,
        callbacks: u.callbacks
      }, l.updateQueue = a;
      return;
    }
    l = a.lastBaseUpdate, l === null ? a.firstBaseUpdate = t : l.next = t, a.lastBaseUpdate = t;
  }
  var Gf = !1;
  function Wu() {
    if (Gf) {
      var l = cu;
      if (l !== null) throw l;
    }
  }
  function $u(l, t, a, u) {
    Gf = !1;
    var e = l.updateQueue;
    ua = !1;
    var n = e.firstBaseUpdate, f = e.lastBaseUpdate, c = e.shared.pending;
    if (c !== null) {
      e.shared.pending = null;
      var i = c, h = i.next;
      i.next = null, f === null ? n = h : f.next = h, f = i;
      var S = l.alternate;
      S !== null && (S = S.updateQueue, c = S.lastBaseUpdate, c !== f && (c === null ? S.firstBaseUpdate = h : c.next = h, S.lastBaseUpdate = i));
    }
    if (n !== null) {
      var z = e.baseState;
      f = 0, S = h = i = null, c = n;
      do {
        var d = c.lane & -536870913, g = d !== c.lane;
        if (g ? (L & d) === d : (u & d) === d) {
          d !== 0 && d === fu && (Gf = !0), S !== null && (S = S.next = {
            lane: 0,
            tag: c.tag,
            payload: c.payload,
            callback: null,
            next: null
          });
          l: {
            var U = l, R = c;
            d = t;
            var nl = a;
            switch (R.tag) {
              case 1:
                if (U = R.payload, typeof U == "function") {
                  z = U.call(nl, z, d);
                  break l;
                }
                z = U;
                break l;
              case 3:
                U.flags = U.flags & -65537 | 128;
              case 0:
                if (U = R.payload, d = typeof U == "function" ? U.call(nl, z, d) : U, d == null) break l;
                z = q({}, z, d);
                break l;
              case 2:
                ua = !0;
            }
          }
          d = c.callback, d !== null && (l.flags |= 64, g && (l.flags |= 8192), g = e.callbacks, g === null ? e.callbacks = [d] : g.push(d));
        } else
          g = {
            lane: d,
            tag: c.tag,
            payload: c.payload,
            callback: c.callback,
            next: null
          }, S === null ? (h = S = g, i = z) : S = S.next = g, f |= d;
        if (c = c.next, c === null) {
          if (c = e.shared.pending, c === null)
            break;
          g = c, c = g.next, g.next = null, e.lastBaseUpdate = g, e.shared.pending = null;
        }
      } while (!0);
      S === null && (i = z), e.baseState = i, e.firstBaseUpdate = h, e.lastBaseUpdate = S, n === null && (e.shared.lanes = 0), ya |= f, l.lanes = f, l.memoizedState = z;
    }
  }
  function D0(l, t) {
    if (typeof l != "function")
      throw Error(o(191, l));
    l.call(t);
  }
  function U0(l, t) {
    var a = l.callbacks;
    if (a !== null)
      for (l.callbacks = null, l = 0; l < a.length; l++)
        D0(a[l], t);
  }
  var yu = y(null), $e = y(0);
  function p0(l, t) {
    l = Jt, M($e, l), M(yu, t), Jt = l | t.baseLanes;
  }
  function Xf() {
    M($e, Jt), M(yu, yu.current);
  }
  function Qf() {
    Jt = $e.current, r(yu), r($e);
  }
  var at = y(null), ot = null;
  function fa(l) {
    var t = l.alternate;
    M(gl, gl.current & 1), M(at, l), ot === null && (t === null || yu.current !== null || t.memoizedState !== null) && (ot = l);
  }
  function jf(l) {
    M(gl, gl.current), M(at, l), ot === null && (ot = l);
  }
  function N0(l) {
    l.tag === 22 ? (M(gl, gl.current), M(at, l), ot === null && (ot = l)) : ca();
  }
  function ca() {
    M(gl, gl.current), M(at, at.current);
  }
  function ut(l) {
    r(at), ot === l && (ot = null), r(gl);
  }
  var gl = y(0);
  function ke(l) {
    for (var t = l; t !== null; ) {
      if (t.tag === 13) {
        var a = t.memoizedState;
        if (a !== null && (a = a.dehydrated, a === null || Jc(a) || wc(a)))
          return t;
      } else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === l) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === l) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var Xt = 0, X = null, ul = null, El = null, Fe = !1, vu = !1, Ga = !1, Ie = 0, ku = 0, su = null, Cs = 0;
  function hl() {
    throw Error(o(321));
  }
  function Zf(l, t) {
    if (t === null) return !1;
    for (var a = 0; a < t.length && a < l.length; a++)
      if (!lt(l[a], t[a])) return !1;
    return !0;
  }
  function Vf(l, t, a, u, e, n) {
    return Xt = n, X = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, b.H = l === null || l.memoizedState === null ? hm : uc, Ga = !1, n = a(u, e), Ga = !1, vu && (n = C0(
      t,
      a,
      u,
      e
    )), H0(l), n;
  }
  function H0(l) {
    b.H = Pu;
    var t = ul !== null && ul.next !== null;
    if (Xt = 0, El = ul = X = null, Fe = !1, ku = 0, su = null, t) throw Error(o(300));
    l === null || zl || (l = l.dependencies, l !== null && Ve(l) && (zl = !0));
  }
  function C0(l, t, a, u) {
    X = l;
    var e = 0;
    do {
      if (vu && (su = null), ku = 0, vu = !1, 25 <= e) throw Error(o(301));
      if (e += 1, El = ul = null, l.updateQueue != null) {
        var n = l.updateQueue;
        n.lastEffect = null, n.events = null, n.stores = null, n.memoCache != null && (n.memoCache.index = 0);
      }
      b.H = dm, n = t(a, u);
    } while (vu);
    return n;
  }
  function qs() {
    var l = b.H, t = l.useState()[0];
    return t = typeof t.then == "function" ? Fu(t) : t, l = l.useState()[0], (ul !== null ? ul.memoizedState : null) !== l && (X.flags |= 1024), t;
  }
  function Lf() {
    var l = Ie !== 0;
    return Ie = 0, l;
  }
  function xf(l, t, a) {
    t.updateQueue = l.updateQueue, t.flags &= -2053, l.lanes &= ~a;
  }
  function Kf(l) {
    if (Fe) {
      for (l = l.memoizedState; l !== null; ) {
        var t = l.queue;
        t !== null && (t.pending = null), l = l.next;
      }
      Fe = !1;
    }
    Xt = 0, El = ul = X = null, vu = !1, ku = Ie = 0, su = null;
  }
  function Xl() {
    var l = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return El === null ? X.memoizedState = El = l : El = El.next = l, El;
  }
  function Sl() {
    if (ul === null) {
      var l = X.alternate;
      l = l !== null ? l.memoizedState : null;
    } else l = ul.next;
    var t = El === null ? X.memoizedState : El.next;
    if (t !== null)
      El = t, ul = l;
    else {
      if (l === null)
        throw X.alternate === null ? Error(o(467)) : Error(o(310));
      ul = l, l = {
        memoizedState: ul.memoizedState,
        baseState: ul.baseState,
        baseQueue: ul.baseQueue,
        queue: ul.queue,
        next: null
      }, El === null ? X.memoizedState = El = l : El = El.next = l;
    }
    return El;
  }
  function Pe() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Fu(l) {
    var t = ku;
    return ku += 1, su === null && (su = []), l = T0(su, l, t), t = X, (El === null ? t.memoizedState : El.next) === null && (t = t.alternate, b.H = t === null || t.memoizedState === null ? hm : uc), l;
  }
  function ln(l) {
    if (l !== null && typeof l == "object") {
      if (typeof l.then == "function") return Fu(l);
      if (l.$$typeof === D) return Nl(l);
    }
    throw Error(o(438, String(l)));
  }
  function Jf(l) {
    var t = null, a = X.updateQueue;
    if (a !== null && (t = a.memoCache), t == null) {
      var u = X.alternate;
      u !== null && (u = u.updateQueue, u !== null && (u = u.memoCache, u != null && (t = {
        data: u.data.map(function(e) {
          return e.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), a === null && (a = Pe(), X.updateQueue = a), a.memoCache = t, a = t.data[t.index], a === void 0)
      for (a = t.data[t.index] = Array(l), u = 0; u < l; u++)
        a[u] = Za;
    return t.index++, a;
  }
  function Qt(l, t) {
    return typeof t == "function" ? t(l) : t;
  }
  function tn(l) {
    var t = Sl();
    return wf(t, ul, l);
  }
  function wf(l, t, a) {
    var u = l.queue;
    if (u === null) throw Error(o(311));
    u.lastRenderedReducer = a;
    var e = l.baseQueue, n = u.pending;
    if (n !== null) {
      if (e !== null) {
        var f = e.next;
        e.next = n.next, n.next = f;
      }
      t.baseQueue = e = n, u.pending = null;
    }
    if (n = l.baseState, e === null) l.memoizedState = n;
    else {
      t = e.next;
      var c = f = null, i = null, h = t, S = !1;
      do {
        var z = h.lane & -536870913;
        if (z !== h.lane ? (L & z) === z : (Xt & z) === z) {
          var d = h.revertLane;
          if (d === 0)
            i !== null && (i = i.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: h.action,
              hasEagerState: h.hasEagerState,
              eagerState: h.eagerState,
              next: null
            }), z === fu && (S = !0);
          else if ((Xt & d) === d) {
            h = h.next, d === fu && (S = !0);
            continue;
          } else
            z = {
              lane: 0,
              revertLane: h.revertLane,
              gesture: null,
              action: h.action,
              hasEagerState: h.hasEagerState,
              eagerState: h.eagerState,
              next: null
            }, i === null ? (c = i = z, f = n) : i = i.next = z, X.lanes |= d, ya |= d;
          z = h.action, Ga && a(n, z), n = h.hasEagerState ? h.eagerState : a(n, z);
        } else
          d = {
            lane: z,
            revertLane: h.revertLane,
            gesture: h.gesture,
            action: h.action,
            hasEagerState: h.hasEagerState,
            eagerState: h.eagerState,
            next: null
          }, i === null ? (c = i = d, f = n) : i = i.next = d, X.lanes |= z, ya |= z;
        h = h.next;
      } while (h !== null && h !== t);
      if (i === null ? f = n : i.next = c, !lt(n, l.memoizedState) && (zl = !0, S && (a = cu, a !== null)))
        throw a;
      l.memoizedState = n, l.baseState = f, l.baseQueue = i, u.lastRenderedState = n;
    }
    return e === null && (u.lanes = 0), [l.memoizedState, u.dispatch];
  }
  function Wf(l) {
    var t = Sl(), a = t.queue;
    if (a === null) throw Error(o(311));
    a.lastRenderedReducer = l;
    var u = a.dispatch, e = a.pending, n = t.memoizedState;
    if (e !== null) {
      a.pending = null;
      var f = e = e.next;
      do
        n = l(n, f.action), f = f.next;
      while (f !== e);
      lt(n, t.memoizedState) || (zl = !0), t.memoizedState = n, t.baseQueue === null && (t.baseState = n), a.lastRenderedState = n;
    }
    return [n, u];
  }
  function q0(l, t, a) {
    var u = X, e = Sl(), n = J;
    if (n) {
      if (a === void 0) throw Error(o(407));
      a = a();
    } else a = t();
    var f = !lt(
      (ul || e).memoizedState,
      a
    );
    if (f && (e.memoizedState = a, zl = !0), e = e.queue, Ff(Y0.bind(null, u, e, l), [
      l
    ]), e.getSnapshot !== t || f || El !== null && El.memoizedState.tag & 1) {
      if (u.flags |= 2048, hu(
        9,
        { destroy: void 0 },
        B0.bind(
          null,
          u,
          e,
          a,
          t
        ),
        null
      ), cl === null) throw Error(o(349));
      n || (Xt & 127) !== 0 || R0(u, t, a);
    }
    return a;
  }
  function R0(l, t, a) {
    l.flags |= 16384, l = { getSnapshot: t, value: a }, t = X.updateQueue, t === null ? (t = Pe(), X.updateQueue = t, t.stores = [l]) : (a = t.stores, a === null ? t.stores = [l] : a.push(l));
  }
  function B0(l, t, a, u) {
    t.value = a, t.getSnapshot = u, G0(t) && X0(l);
  }
  function Y0(l, t, a) {
    return a(function() {
      G0(t) && X0(l);
    });
  }
  function G0(l) {
    var t = l.getSnapshot;
    l = l.value;
    try {
      var a = t();
      return !lt(l, a);
    } catch {
      return !0;
    }
  }
  function X0(l) {
    var t = Ua(l, 2);
    t !== null && $l(t, l, 2);
  }
  function $f(l) {
    var t = Xl();
    if (typeof l == "function") {
      var a = l;
      if (l = a(), Ga) {
        kt(!0);
        try {
          a();
        } finally {
          kt(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = l, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Qt,
      lastRenderedState: l
    }, t;
  }
  function Q0(l, t, a, u) {
    return l.baseState = a, wf(
      l,
      ul,
      typeof u == "function" ? u : Qt
    );
  }
  function Rs(l, t, a, u, e) {
    if (en(l)) throw Error(o(485));
    if (l = t.action, l !== null) {
      var n = {
        payload: e,
        action: l,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(f) {
          n.listeners.push(f);
        }
      };
      b.T !== null ? a(!0) : n.isTransition = !1, u(n), a = t.pending, a === null ? (n.next = t.pending = n, j0(t, n)) : (n.next = a.next, t.pending = a.next = n);
    }
  }
  function j0(l, t) {
    var a = t.action, u = t.payload, e = l.state;
    if (t.isTransition) {
      var n = b.T, f = {};
      b.T = f;
      try {
        var c = a(e, u), i = b.S;
        i !== null && i(f, c), Z0(l, t, c);
      } catch (h) {
        kf(l, t, h);
      } finally {
        n !== null && f.types !== null && (n.types = f.types), b.T = n;
      }
    } else
      try {
        n = a(e, u), Z0(l, t, n);
      } catch (h) {
        kf(l, t, h);
      }
  }
  function Z0(l, t, a) {
    a !== null && typeof a == "object" && typeof a.then == "function" ? a.then(
      function(u) {
        V0(l, t, u);
      },
      function(u) {
        return kf(l, t, u);
      }
    ) : V0(l, t, a);
  }
  function V0(l, t, a) {
    t.status = "fulfilled", t.value = a, L0(t), l.state = a, t = l.pending, t !== null && (a = t.next, a === t ? l.pending = null : (a = a.next, t.next = a, j0(l, a)));
  }
  function kf(l, t, a) {
    var u = l.pending;
    if (l.pending = null, u !== null) {
      u = u.next;
      do
        t.status = "rejected", t.reason = a, L0(t), t = t.next;
      while (t !== u);
    }
    l.action = null;
  }
  function L0(l) {
    l = l.listeners;
    for (var t = 0; t < l.length; t++) (0, l[t])();
  }
  function x0(l, t) {
    return t;
  }
  function K0(l, t) {
    if (J) {
      var a = cl.formState;
      if (a !== null) {
        l: {
          var u = X;
          if (J) {
            if (ml) {
              t: {
                for (var e = ml, n = dt; e.nodeType !== 8; ) {
                  if (!n) {
                    e = null;
                    break t;
                  }
                  if (e = gt(
                    e.nextSibling
                  ), e === null) {
                    e = null;
                    break t;
                  }
                }
                n = e.data, e = n === "F!" || n === "F" ? e : null;
              }
              if (e) {
                ml = gt(
                  e.nextSibling
                ), u = e.data === "F!";
                break l;
              }
            }
            ta(u);
          }
          u = !1;
        }
        u && (t = a[0]);
      }
    }
    return a = Xl(), a.memoizedState = a.baseState = t, u = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: x0,
      lastRenderedState: t
    }, a.queue = u, a = ym.bind(
      null,
      X,
      u
    ), u.dispatch = a, u = $f(!1), n = ac.bind(
      null,
      X,
      !1,
      u.queue
    ), u = Xl(), e = {
      state: t,
      dispatch: null,
      action: l,
      pending: null
    }, u.queue = e, a = Rs.bind(
      null,
      X,
      e,
      n,
      a
    ), e.dispatch = a, u.memoizedState = l, [t, a, !1];
  }
  function J0(l) {
    var t = Sl();
    return w0(t, ul, l);
  }
  function w0(l, t, a) {
    if (t = wf(
      l,
      t,
      x0
    )[0], l = tn(Qt)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var u = Fu(t);
      } catch (f) {
        throw f === iu ? Ke : f;
      }
    else u = t;
    t = Sl();
    var e = t.queue, n = e.dispatch;
    return a !== t.memoizedState && (X.flags |= 2048, hu(
      9,
      { destroy: void 0 },
      Bs.bind(null, e, a),
      null
    )), [u, n, l];
  }
  function Bs(l, t) {
    l.action = t;
  }
  function W0(l) {
    var t = Sl(), a = ul;
    if (a !== null)
      return w0(t, a, l);
    Sl(), t = t.memoizedState, a = Sl();
    var u = a.queue.dispatch;
    return a.memoizedState = l, [t, u, !1];
  }
  function hu(l, t, a, u) {
    return l = { tag: l, create: a, deps: u, inst: t, next: null }, t = X.updateQueue, t === null && (t = Pe(), X.updateQueue = t), a = t.lastEffect, a === null ? t.lastEffect = l.next = l : (u = a.next, a.next = l, l.next = u, t.lastEffect = l), l;
  }
  function $0() {
    return Sl().memoizedState;
  }
  function an(l, t, a, u) {
    var e = Xl();
    X.flags |= l, e.memoizedState = hu(
      1 | t,
      { destroy: void 0 },
      a,
      u === void 0 ? null : u
    );
  }
  function un(l, t, a, u) {
    var e = Sl();
    u = u === void 0 ? null : u;
    var n = e.memoizedState.inst;
    ul !== null && u !== null && Zf(u, ul.memoizedState.deps) ? e.memoizedState = hu(t, n, a, u) : (X.flags |= l, e.memoizedState = hu(
      1 | t,
      n,
      a,
      u
    ));
  }
  function k0(l, t) {
    an(8390656, 8, l, t);
  }
  function Ff(l, t) {
    un(2048, 8, l, t);
  }
  function Ys(l) {
    X.flags |= 4;
    var t = X.updateQueue;
    if (t === null)
      t = Pe(), X.updateQueue = t, t.events = [l];
    else {
      var a = t.events;
      a === null ? t.events = [l] : a.push(l);
    }
  }
  function F0(l) {
    var t = Sl().memoizedState;
    return Ys({ ref: t, nextImpl: l }), function() {
      if ((k & 2) !== 0) throw Error(o(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function I0(l, t) {
    return un(4, 2, l, t);
  }
  function P0(l, t) {
    return un(4, 4, l, t);
  }
  function lm(l, t) {
    if (typeof t == "function") {
      l = l();
      var a = t(l);
      return function() {
        typeof a == "function" ? a() : t(null);
      };
    }
    if (t != null)
      return l = l(), t.current = l, function() {
        t.current = null;
      };
  }
  function tm(l, t, a) {
    a = a != null ? a.concat([l]) : null, un(4, 4, lm.bind(null, t, l), a);
  }
  function If() {
  }
  function am(l, t) {
    var a = Sl();
    t = t === void 0 ? null : t;
    var u = a.memoizedState;
    return t !== null && Zf(t, u[1]) ? u[0] : (a.memoizedState = [l, t], l);
  }
  function um(l, t) {
    var a = Sl();
    t = t === void 0 ? null : t;
    var u = a.memoizedState;
    if (t !== null && Zf(t, u[1]))
      return u[0];
    if (u = l(), Ga) {
      kt(!0);
      try {
        l();
      } finally {
        kt(!1);
      }
    }
    return a.memoizedState = [u, t], u;
  }
  function Pf(l, t, a) {
    return a === void 0 || (Xt & 1073741824) !== 0 && (L & 261930) === 0 ? l.memoizedState = t : (l.memoizedState = a, l = ey(), X.lanes |= l, ya |= l, a);
  }
  function em(l, t, a, u) {
    return lt(a, t) ? a : yu.current !== null ? (l = Pf(l, a, u), lt(l, t) || (zl = !0), l) : (Xt & 42) === 0 || (Xt & 1073741824) !== 0 && (L & 261930) === 0 ? (zl = !0, l.memoizedState = a) : (l = ey(), X.lanes |= l, ya |= l, t);
  }
  function nm(l, t, a, u, e) {
    var n = O.p;
    O.p = n !== 0 && 8 > n ? n : 8;
    var f = b.T, c = {};
    b.T = c, ac(l, !1, t, a);
    try {
      var i = e(), h = b.S;
      if (h !== null && h(c, i), i !== null && typeof i == "object" && typeof i.then == "function") {
        var S = Hs(
          i,
          u
        );
        Iu(
          l,
          t,
          S,
          ft(l)
        );
      } else
        Iu(
          l,
          t,
          u,
          ft(l)
        );
    } catch (z) {
      Iu(
        l,
        t,
        { then: function() {
        }, status: "rejected", reason: z },
        ft()
      );
    } finally {
      O.p = n, f !== null && c.types !== null && (f.types = c.types), b.T = f;
    }
  }
  function Gs() {
  }
  function lc(l, t, a, u) {
    if (l.tag !== 5) throw Error(o(476));
    var e = fm(l).queue;
    nm(
      l,
      e,
      t,
      B,
      a === null ? Gs : function() {
        return cm(l), a(u);
      }
    );
  }
  function fm(l) {
    var t = l.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: B,
      baseState: B,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Qt,
        lastRenderedState: B
      },
      next: null
    };
    var a = {};
    return t.next = {
      memoizedState: a,
      baseState: a,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Qt,
        lastRenderedState: a
      },
      next: null
    }, l.memoizedState = t, l = l.alternate, l !== null && (l.memoizedState = t), t;
  }
  function cm(l) {
    var t = fm(l);
    t.next === null && (t = l.alternate.memoizedState), Iu(
      l,
      t.next.queue,
      {},
      ft()
    );
  }
  function tc() {
    return Nl(oe);
  }
  function im() {
    return Sl().memoizedState;
  }
  function mm() {
    return Sl().memoizedState;
  }
  function Xs(l) {
    for (var t = l.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var a = ft();
          l = ea(a);
          var u = na(t, l, a);
          u !== null && ($l(u, t, a), wu(u, t, a)), t = { cache: Nf() }, l.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function Qs(l, t, a) {
    var u = ft();
    a = {
      lane: u,
      revertLane: 0,
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, en(l) ? vm(t, a) : (a = Ef(l, t, a, u), a !== null && ($l(a, l, u), sm(a, t, u)));
  }
  function ym(l, t, a) {
    var u = ft();
    Iu(l, t, a, u);
  }
  function Iu(l, t, a, u) {
    var e = {
      lane: u,
      revertLane: 0,
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (en(l)) vm(t, e);
    else {
      var n = l.alternate;
      if (l.lanes === 0 && (n === null || n.lanes === 0) && (n = t.lastRenderedReducer, n !== null))
        try {
          var f = t.lastRenderedState, c = n(f, a);
          if (e.hasEagerState = !0, e.eagerState = c, lt(c, f))
            return Xe(l, t, e, 0), cl === null && Ge(), !1;
        } catch {
        } finally {
        }
      if (a = Ef(l, t, e, u), a !== null)
        return $l(a, l, u), sm(a, t, u), !0;
    }
    return !1;
  }
  function ac(l, t, a, u) {
    if (u = {
      lane: 2,
      revertLane: Rc(),
      gesture: null,
      action: u,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, en(l)) {
      if (t) throw Error(o(479));
    } else
      t = Ef(
        l,
        a,
        u,
        2
      ), t !== null && $l(t, l, 2);
  }
  function en(l) {
    var t = l.alternate;
    return l === X || t !== null && t === X;
  }
  function vm(l, t) {
    vu = Fe = !0;
    var a = l.pending;
    a === null ? t.next = t : (t.next = a.next, a.next = t), l.pending = t;
  }
  function sm(l, t, a) {
    if ((a & 4194048) !== 0) {
      var u = t.lanes;
      u &= l.pendingLanes, a |= u, t.lanes = a, Si(l, a);
    }
  }
  var Pu = {
    readContext: Nl,
    use: ln,
    useCallback: hl,
    useContext: hl,
    useEffect: hl,
    useImperativeHandle: hl,
    useLayoutEffect: hl,
    useInsertionEffect: hl,
    useMemo: hl,
    useReducer: hl,
    useRef: hl,
    useState: hl,
    useDebugValue: hl,
    useDeferredValue: hl,
    useTransition: hl,
    useSyncExternalStore: hl,
    useId: hl,
    useHostTransitionStatus: hl,
    useFormState: hl,
    useActionState: hl,
    useOptimistic: hl,
    useMemoCache: hl,
    useCacheRefresh: hl
  };
  Pu.useEffectEvent = hl;
  var hm = {
    readContext: Nl,
    use: ln,
    useCallback: function(l, t) {
      return Xl().memoizedState = [
        l,
        t === void 0 ? null : t
      ], l;
    },
    useContext: Nl,
    useEffect: k0,
    useImperativeHandle: function(l, t, a) {
      a = a != null ? a.concat([l]) : null, an(
        4194308,
        4,
        lm.bind(null, t, l),
        a
      );
    },
    useLayoutEffect: function(l, t) {
      return an(4194308, 4, l, t);
    },
    useInsertionEffect: function(l, t) {
      an(4, 2, l, t);
    },
    useMemo: function(l, t) {
      var a = Xl();
      t = t === void 0 ? null : t;
      var u = l();
      if (Ga) {
        kt(!0);
        try {
          l();
        } finally {
          kt(!1);
        }
      }
      return a.memoizedState = [u, t], u;
    },
    useReducer: function(l, t, a) {
      var u = Xl();
      if (a !== void 0) {
        var e = a(t);
        if (Ga) {
          kt(!0);
          try {
            a(t);
          } finally {
            kt(!1);
          }
        }
      } else e = t;
      return u.memoizedState = u.baseState = e, l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: l,
        lastRenderedState: e
      }, u.queue = l, l = l.dispatch = Qs.bind(
        null,
        X,
        l
      ), [u.memoizedState, l];
    },
    useRef: function(l) {
      var t = Xl();
      return l = { current: l }, t.memoizedState = l;
    },
    useState: function(l) {
      l = $f(l);
      var t = l.queue, a = ym.bind(null, X, t);
      return t.dispatch = a, [l.memoizedState, a];
    },
    useDebugValue: If,
    useDeferredValue: function(l, t) {
      var a = Xl();
      return Pf(a, l, t);
    },
    useTransition: function() {
      var l = $f(!1);
      return l = nm.bind(
        null,
        X,
        l.queue,
        !0,
        !1
      ), Xl().memoizedState = l, [!1, l];
    },
    useSyncExternalStore: function(l, t, a) {
      var u = X, e = Xl();
      if (J) {
        if (a === void 0)
          throw Error(o(407));
        a = a();
      } else {
        if (a = t(), cl === null)
          throw Error(o(349));
        (L & 127) !== 0 || R0(u, t, a);
      }
      e.memoizedState = a;
      var n = { value: a, getSnapshot: t };
      return e.queue = n, k0(Y0.bind(null, u, n, l), [
        l
      ]), u.flags |= 2048, hu(
        9,
        { destroy: void 0 },
        B0.bind(
          null,
          u,
          n,
          a,
          t
        ),
        null
      ), a;
    },
    useId: function() {
      var l = Xl(), t = cl.identifierPrefix;
      if (J) {
        var a = Dt, u = Mt;
        a = (u & ~(1 << 32 - Pl(u) - 1)).toString(32) + a, t = "_" + t + "R_" + a, a = Ie++, 0 < a && (t += "H" + a.toString(32)), t += "_";
      } else
        a = Cs++, t = "_" + t + "r_" + a.toString(32) + "_";
      return l.memoizedState = t;
    },
    useHostTransitionStatus: tc,
    useFormState: K0,
    useActionState: K0,
    useOptimistic: function(l) {
      var t = Xl();
      t.memoizedState = t.baseState = l;
      var a = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = a, t = ac.bind(
        null,
        X,
        !0,
        a
      ), a.dispatch = t, [l, t];
    },
    useMemoCache: Jf,
    useCacheRefresh: function() {
      return Xl().memoizedState = Xs.bind(
        null,
        X
      );
    },
    useEffectEvent: function(l) {
      var t = Xl(), a = { impl: l };
      return t.memoizedState = a, function() {
        if ((k & 2) !== 0)
          throw Error(o(440));
        return a.impl.apply(void 0, arguments);
      };
    }
  }, uc = {
    readContext: Nl,
    use: ln,
    useCallback: am,
    useContext: Nl,
    useEffect: Ff,
    useImperativeHandle: tm,
    useInsertionEffect: I0,
    useLayoutEffect: P0,
    useMemo: um,
    useReducer: tn,
    useRef: $0,
    useState: function() {
      return tn(Qt);
    },
    useDebugValue: If,
    useDeferredValue: function(l, t) {
      var a = Sl();
      return em(
        a,
        ul.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = tn(Qt)[0], t = Sl().memoizedState;
      return [
        typeof l == "boolean" ? l : Fu(l),
        t
      ];
    },
    useSyncExternalStore: q0,
    useId: im,
    useHostTransitionStatus: tc,
    useFormState: J0,
    useActionState: J0,
    useOptimistic: function(l, t) {
      var a = Sl();
      return Q0(a, ul, l, t);
    },
    useMemoCache: Jf,
    useCacheRefresh: mm
  };
  uc.useEffectEvent = F0;
  var dm = {
    readContext: Nl,
    use: ln,
    useCallback: am,
    useContext: Nl,
    useEffect: Ff,
    useImperativeHandle: tm,
    useInsertionEffect: I0,
    useLayoutEffect: P0,
    useMemo: um,
    useReducer: Wf,
    useRef: $0,
    useState: function() {
      return Wf(Qt);
    },
    useDebugValue: If,
    useDeferredValue: function(l, t) {
      var a = Sl();
      return ul === null ? Pf(a, l, t) : em(
        a,
        ul.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = Wf(Qt)[0], t = Sl().memoizedState;
      return [
        typeof l == "boolean" ? l : Fu(l),
        t
      ];
    },
    useSyncExternalStore: q0,
    useId: im,
    useHostTransitionStatus: tc,
    useFormState: W0,
    useActionState: W0,
    useOptimistic: function(l, t) {
      var a = Sl();
      return ul !== null ? Q0(a, ul, l, t) : (a.baseState = l, [l, a.queue.dispatch]);
    },
    useMemoCache: Jf,
    useCacheRefresh: mm
  };
  dm.useEffectEvent = F0;
  function ec(l, t, a, u) {
    t = l.memoizedState, a = a(u, t), a = a == null ? t : q({}, t, a), l.memoizedState = a, l.lanes === 0 && (l.updateQueue.baseState = a);
  }
  var nc = {
    enqueueSetState: function(l, t, a) {
      l = l._reactInternals;
      var u = ft(), e = ea(u);
      e.payload = t, a != null && (e.callback = a), t = na(l, e, u), t !== null && ($l(t, l, u), wu(t, l, u));
    },
    enqueueReplaceState: function(l, t, a) {
      l = l._reactInternals;
      var u = ft(), e = ea(u);
      e.tag = 1, e.payload = t, a != null && (e.callback = a), t = na(l, e, u), t !== null && ($l(t, l, u), wu(t, l, u));
    },
    enqueueForceUpdate: function(l, t) {
      l = l._reactInternals;
      var a = ft(), u = ea(a);
      u.tag = 2, t != null && (u.callback = t), t = na(l, u, a), t !== null && ($l(t, l, a), wu(t, l, a));
    }
  };
  function om(l, t, a, u, e, n, f) {
    return l = l.stateNode, typeof l.shouldComponentUpdate == "function" ? l.shouldComponentUpdate(u, n, f) : t.prototype && t.prototype.isPureReactComponent ? !Qu(a, u) || !Qu(e, n) : !0;
  }
  function gm(l, t, a, u) {
    l = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, u), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, u), t.state !== l && nc.enqueueReplaceState(t, t.state, null);
  }
  function Xa(l, t) {
    var a = t;
    if ("ref" in t) {
      a = {};
      for (var u in t)
        u !== "ref" && (a[u] = t[u]);
    }
    if (l = l.defaultProps) {
      a === t && (a = q({}, a));
      for (var e in l)
        a[e] === void 0 && (a[e] = l[e]);
    }
    return a;
  }
  function Sm(l) {
    Ye(l);
  }
  function bm(l) {
    console.error(l);
  }
  function Em(l) {
    Ye(l);
  }
  function nn(l, t) {
    try {
      var a = l.onUncaughtError;
      a(t.value, { componentStack: t.stack });
    } catch (u) {
      setTimeout(function() {
        throw u;
      });
    }
  }
  function zm(l, t, a) {
    try {
      var u = l.onCaughtError;
      u(a.value, {
        componentStack: a.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (e) {
      setTimeout(function() {
        throw e;
      });
    }
  }
  function fc(l, t, a) {
    return a = ea(a), a.tag = 3, a.payload = { element: null }, a.callback = function() {
      nn(l, t);
    }, a;
  }
  function rm(l) {
    return l = ea(l), l.tag = 3, l;
  }
  function Tm(l, t, a, u) {
    var e = a.type.getDerivedStateFromError;
    if (typeof e == "function") {
      var n = u.value;
      l.payload = function() {
        return e(n);
      }, l.callback = function() {
        zm(t, a, u);
      };
    }
    var f = a.stateNode;
    f !== null && typeof f.componentDidCatch == "function" && (l.callback = function() {
      zm(t, a, u), typeof e != "function" && (va === null ? va = /* @__PURE__ */ new Set([this]) : va.add(this));
      var c = u.stack;
      this.componentDidCatch(u.value, {
        componentStack: c !== null ? c : ""
      });
    });
  }
  function js(l, t, a, u, e) {
    if (a.flags |= 32768, u !== null && typeof u == "object" && typeof u.then == "function") {
      if (t = a.alternate, t !== null && nu(
        t,
        a,
        e,
        !0
      ), a = at.current, a !== null) {
        switch (a.tag) {
          case 31:
          case 13:
            return ot === null ? bn() : a.alternate === null && dl === 0 && (dl = 3), a.flags &= -257, a.flags |= 65536, a.lanes = e, u === Je ? a.flags |= 16384 : (t = a.updateQueue, t === null ? a.updateQueue = /* @__PURE__ */ new Set([u]) : t.add(u), Hc(l, u, e)), !1;
          case 22:
            return a.flags |= 65536, u === Je ? a.flags |= 16384 : (t = a.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([u])
            }, a.updateQueue = t) : (a = t.retryQueue, a === null ? t.retryQueue = /* @__PURE__ */ new Set([u]) : a.add(u)), Hc(l, u, e)), !1;
        }
        throw Error(o(435, a.tag));
      }
      return Hc(l, u, e), bn(), !1;
    }
    if (J)
      return t = at.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = e, u !== Of && (l = Error(o(422), { cause: u }), Vu(vt(l, a)))) : (u !== Of && (t = Error(o(423), {
        cause: u
      }), Vu(
        vt(t, a)
      )), l = l.current.alternate, l.flags |= 65536, e &= -e, l.lanes |= e, u = vt(u, a), e = fc(
        l.stateNode,
        u,
        e
      ), Yf(l, e), dl !== 4 && (dl = 2)), !1;
    var n = Error(o(520), { cause: u });
    if (n = vt(n, a), ce === null ? ce = [n] : ce.push(n), dl !== 4 && (dl = 2), t === null) return !0;
    u = vt(u, a), a = t;
    do {
      switch (a.tag) {
        case 3:
          return a.flags |= 65536, l = e & -e, a.lanes |= l, l = fc(a.stateNode, u, l), Yf(a, l), !1;
        case 1:
          if (t = a.type, n = a.stateNode, (a.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || n !== null && typeof n.componentDidCatch == "function" && (va === null || !va.has(n))))
            return a.flags |= 65536, e &= -e, a.lanes |= e, e = rm(e), Tm(
              e,
              l,
              a,
              u
            ), Yf(a, e), !1;
      }
      a = a.return;
    } while (a !== null);
    return !1;
  }
  var cc = Error(o(461)), zl = !1;
  function Hl(l, t, a, u) {
    t.child = l === null ? M0(t, null, a, u) : Ya(
      t,
      l.child,
      a,
      u
    );
  }
  function Am(l, t, a, u, e) {
    a = a.render;
    var n = t.ref;
    if ("ref" in u) {
      var f = {};
      for (var c in u)
        c !== "ref" && (f[c] = u[c]);
    } else f = u;
    return Ca(t), u = Vf(
      l,
      t,
      a,
      f,
      n,
      e
    ), c = Lf(), l !== null && !zl ? (xf(l, t, e), jt(l, t, e)) : (J && c && Af(t), t.flags |= 1, Hl(l, t, u, e), t.child);
  }
  function _m(l, t, a, u, e) {
    if (l === null) {
      var n = a.type;
      return typeof n == "function" && !zf(n) && n.defaultProps === void 0 && a.compare === null ? (t.tag = 15, t.type = n, Om(
        l,
        t,
        n,
        u,
        e
      )) : (l = je(
        a.type,
        null,
        u,
        t,
        t.mode,
        e
      ), l.ref = t.ref, l.return = t, t.child = l);
    }
    if (n = l.child, !oc(l, e)) {
      var f = n.memoizedProps;
      if (a = a.compare, a = a !== null ? a : Qu, a(f, u) && l.ref === t.ref)
        return jt(l, t, e);
    }
    return t.flags |= 1, l = Rt(n, u), l.ref = t.ref, l.return = t, t.child = l;
  }
  function Om(l, t, a, u, e) {
    if (l !== null) {
      var n = l.memoizedProps;
      if (Qu(n, u) && l.ref === t.ref)
        if (zl = !1, t.pendingProps = u = n, oc(l, e))
          (l.flags & 131072) !== 0 && (zl = !0);
        else
          return t.lanes = l.lanes, jt(l, t, e);
    }
    return ic(
      l,
      t,
      a,
      u,
      e
    );
  }
  function Mm(l, t, a, u) {
    var e = u.children, n = l !== null ? l.memoizedState : null;
    if (l === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), u.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (n = n !== null ? n.baseLanes | a : a, l !== null) {
          for (u = t.child = l.child, e = 0; u !== null; )
            e = e | u.lanes | u.childLanes, u = u.sibling;
          u = e & ~n;
        } else u = 0, t.child = null;
        return Dm(
          l,
          t,
          n,
          a,
          u
        );
      }
      if ((a & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, l !== null && xe(
          t,
          n !== null ? n.cachePool : null
        ), n !== null ? p0(t, n) : Xf(), N0(t);
      else
        return u = t.lanes = 536870912, Dm(
          l,
          t,
          n !== null ? n.baseLanes | a : a,
          a,
          u
        );
    } else
      n !== null ? (xe(t, n.cachePool), p0(t, n), ca(), t.memoizedState = null) : (l !== null && xe(t, null), Xf(), ca());
    return Hl(l, t, e, a), t.child;
  }
  function le(l, t) {
    return l !== null && l.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function Dm(l, t, a, u, e) {
    var n = Cf();
    return n = n === null ? null : { parent: bl._currentValue, pool: n }, t.memoizedState = {
      baseLanes: a,
      cachePool: n
    }, l !== null && xe(t, null), Xf(), N0(t), l !== null && nu(l, t, u, !0), t.childLanes = e, null;
  }
  function fn(l, t) {
    return t = mn(
      { mode: t.mode, children: t.children },
      l.mode
    ), t.ref = l.ref, l.child = t, t.return = l, t;
  }
  function Um(l, t, a) {
    return Ya(t, l.child, null, a), l = fn(t, t.pendingProps), l.flags |= 2, ut(t), t.memoizedState = null, l;
  }
  function Zs(l, t, a) {
    var u = t.pendingProps, e = (t.flags & 128) !== 0;
    if (t.flags &= -129, l === null) {
      if (J) {
        if (u.mode === "hidden")
          return l = fn(t, u), t.lanes = 536870912, le(null, l);
        if (jf(t), (l = ml) ? (l = jy(
          l,
          dt
        ), l = l !== null && l.data === "&" ? l : null, l !== null && (t.memoizedState = {
          dehydrated: l,
          treeContext: Pt !== null ? { id: Mt, overflow: Dt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, a = v0(l), a.return = t, t.child = a, pl = t, ml = null)) : l = null, l === null) throw ta(t);
        return t.lanes = 536870912, null;
      }
      return fn(t, u);
    }
    var n = l.memoizedState;
    if (n !== null) {
      var f = n.dehydrated;
      if (jf(t), e)
        if (t.flags & 256)
          t.flags &= -257, t = Um(
            l,
            t,
            a
          );
        else if (t.memoizedState !== null)
          t.child = l.child, t.flags |= 128, t = null;
        else throw Error(o(558));
      else if (zl || nu(l, t, a, !1), e = (a & l.childLanes) !== 0, zl || e) {
        if (u = cl, u !== null && (f = bi(u, a), f !== 0 && f !== n.retryLane))
          throw n.retryLane = f, Ua(l, f), $l(u, l, f), cc;
        bn(), t = Um(
          l,
          t,
          a
        );
      } else
        l = n.treeContext, ml = gt(f.nextSibling), pl = t, J = !0, la = null, dt = !1, l !== null && d0(t, l), t = fn(t, u), t.flags |= 4096;
      return t;
    }
    return l = Rt(l.child, {
      mode: u.mode,
      children: u.children
    }), l.ref = t.ref, t.child = l, l.return = t, l;
  }
  function cn(l, t) {
    var a = t.ref;
    if (a === null)
      l !== null && l.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof a != "function" && typeof a != "object")
        throw Error(o(284));
      (l === null || l.ref !== a) && (t.flags |= 4194816);
    }
  }
  function ic(l, t, a, u, e) {
    return Ca(t), a = Vf(
      l,
      t,
      a,
      u,
      void 0,
      e
    ), u = Lf(), l !== null && !zl ? (xf(l, t, e), jt(l, t, e)) : (J && u && Af(t), t.flags |= 1, Hl(l, t, a, e), t.child);
  }
  function pm(l, t, a, u, e, n) {
    return Ca(t), t.updateQueue = null, a = C0(
      t,
      u,
      a,
      e
    ), H0(l), u = Lf(), l !== null && !zl ? (xf(l, t, n), jt(l, t, n)) : (J && u && Af(t), t.flags |= 1, Hl(l, t, a, n), t.child);
  }
  function Nm(l, t, a, u, e) {
    if (Ca(t), t.stateNode === null) {
      var n = tu, f = a.contextType;
      typeof f == "object" && f !== null && (n = Nl(f)), n = new a(u, n), t.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null, n.updater = nc, t.stateNode = n, n._reactInternals = t, n = t.stateNode, n.props = u, n.state = t.memoizedState, n.refs = {}, Rf(t), f = a.contextType, n.context = typeof f == "object" && f !== null ? Nl(f) : tu, n.state = t.memoizedState, f = a.getDerivedStateFromProps, typeof f == "function" && (ec(
        t,
        a,
        f,
        u
      ), n.state = t.memoizedState), typeof a.getDerivedStateFromProps == "function" || typeof n.getSnapshotBeforeUpdate == "function" || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (f = n.state, typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount(), f !== n.state && nc.enqueueReplaceState(n, n.state, null), $u(t, u, n, e), Wu(), n.state = t.memoizedState), typeof n.componentDidMount == "function" && (t.flags |= 4194308), u = !0;
    } else if (l === null) {
      n = t.stateNode;
      var c = t.memoizedProps, i = Xa(a, c);
      n.props = i;
      var h = n.context, S = a.contextType;
      f = tu, typeof S == "object" && S !== null && (f = Nl(S));
      var z = a.getDerivedStateFromProps;
      S = typeof z == "function" || typeof n.getSnapshotBeforeUpdate == "function", c = t.pendingProps !== c, S || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (c || h !== f) && gm(
        t,
        n,
        u,
        f
      ), ua = !1;
      var d = t.memoizedState;
      n.state = d, $u(t, u, n, e), Wu(), h = t.memoizedState, c || d !== h || ua ? (typeof z == "function" && (ec(
        t,
        a,
        z,
        u
      ), h = t.memoizedState), (i = ua || om(
        t,
        a,
        i,
        u,
        d,
        h,
        f
      )) ? (S || typeof n.UNSAFE_componentWillMount != "function" && typeof n.componentWillMount != "function" || (typeof n.componentWillMount == "function" && n.componentWillMount(), typeof n.UNSAFE_componentWillMount == "function" && n.UNSAFE_componentWillMount()), typeof n.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = u, t.memoizedState = h), n.props = u, n.state = h, n.context = f, u = i) : (typeof n.componentDidMount == "function" && (t.flags |= 4194308), u = !1);
    } else {
      n = t.stateNode, Bf(l, t), f = t.memoizedProps, S = Xa(a, f), n.props = S, z = t.pendingProps, d = n.context, h = a.contextType, i = tu, typeof h == "object" && h !== null && (i = Nl(h)), c = a.getDerivedStateFromProps, (h = typeof c == "function" || typeof n.getSnapshotBeforeUpdate == "function") || typeof n.UNSAFE_componentWillReceiveProps != "function" && typeof n.componentWillReceiveProps != "function" || (f !== z || d !== i) && gm(
        t,
        n,
        u,
        i
      ), ua = !1, d = t.memoizedState, n.state = d, $u(t, u, n, e), Wu();
      var g = t.memoizedState;
      f !== z || d !== g || ua || l !== null && l.dependencies !== null && Ve(l.dependencies) ? (typeof c == "function" && (ec(
        t,
        a,
        c,
        u
      ), g = t.memoizedState), (S = ua || om(
        t,
        a,
        S,
        u,
        d,
        g,
        i
      ) || l !== null && l.dependencies !== null && Ve(l.dependencies)) ? (h || typeof n.UNSAFE_componentWillUpdate != "function" && typeof n.componentWillUpdate != "function" || (typeof n.componentWillUpdate == "function" && n.componentWillUpdate(u, g, i), typeof n.UNSAFE_componentWillUpdate == "function" && n.UNSAFE_componentWillUpdate(
        u,
        g,
        i
      )), typeof n.componentDidUpdate == "function" && (t.flags |= 4), typeof n.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof n.componentDidUpdate != "function" || f === l.memoizedProps && d === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || f === l.memoizedProps && d === l.memoizedState || (t.flags |= 1024), t.memoizedProps = u, t.memoizedState = g), n.props = u, n.state = g, n.context = i, u = S) : (typeof n.componentDidUpdate != "function" || f === l.memoizedProps && d === l.memoizedState || (t.flags |= 4), typeof n.getSnapshotBeforeUpdate != "function" || f === l.memoizedProps && d === l.memoizedState || (t.flags |= 1024), u = !1);
    }
    return n = u, cn(l, t), u = (t.flags & 128) !== 0, n || u ? (n = t.stateNode, a = u && typeof a.getDerivedStateFromError != "function" ? null : n.render(), t.flags |= 1, l !== null && u ? (t.child = Ya(
      t,
      l.child,
      null,
      e
    ), t.child = Ya(
      t,
      null,
      a,
      e
    )) : Hl(l, t, a, e), t.memoizedState = n.state, l = t.child) : l = jt(
      l,
      t,
      e
    ), l;
  }
  function Hm(l, t, a, u) {
    return Na(), t.flags |= 256, Hl(l, t, a, u), t.child;
  }
  var mc = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function yc(l) {
    return { baseLanes: l, cachePool: z0() };
  }
  function vc(l, t, a) {
    return l = l !== null ? l.childLanes & ~a : 0, t && (l |= nt), l;
  }
  function Cm(l, t, a) {
    var u = t.pendingProps, e = !1, n = (t.flags & 128) !== 0, f;
    if ((f = n) || (f = l !== null && l.memoizedState === null ? !1 : (gl.current & 2) !== 0), f && (e = !0, t.flags &= -129), f = (t.flags & 32) !== 0, t.flags &= -33, l === null) {
      if (J) {
        if (e ? fa(t) : ca(), (l = ml) ? (l = jy(
          l,
          dt
        ), l = l !== null && l.data !== "&" ? l : null, l !== null && (t.memoizedState = {
          dehydrated: l,
          treeContext: Pt !== null ? { id: Mt, overflow: Dt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, a = v0(l), a.return = t, t.child = a, pl = t, ml = null)) : l = null, l === null) throw ta(t);
        return wc(l) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var c = u.children;
      return u = u.fallback, e ? (ca(), e = t.mode, c = mn(
        { mode: "hidden", children: c },
        e
      ), u = pa(
        u,
        e,
        a,
        null
      ), c.return = t, u.return = t, c.sibling = u, t.child = c, u = t.child, u.memoizedState = yc(a), u.childLanes = vc(
        l,
        f,
        a
      ), t.memoizedState = mc, le(null, u)) : (fa(t), sc(t, c));
    }
    var i = l.memoizedState;
    if (i !== null && (c = i.dehydrated, c !== null)) {
      if (n)
        t.flags & 256 ? (fa(t), t.flags &= -257, t = hc(
          l,
          t,
          a
        )) : t.memoizedState !== null ? (ca(), t.child = l.child, t.flags |= 128, t = null) : (ca(), c = u.fallback, e = t.mode, u = mn(
          { mode: "visible", children: u.children },
          e
        ), c = pa(
          c,
          e,
          a,
          null
        ), c.flags |= 2, u.return = t, c.return = t, u.sibling = c, t.child = u, Ya(
          t,
          l.child,
          null,
          a
        ), u = t.child, u.memoizedState = yc(a), u.childLanes = vc(
          l,
          f,
          a
        ), t.memoizedState = mc, t = le(null, u));
      else if (fa(t), wc(c)) {
        if (f = c.nextSibling && c.nextSibling.dataset, f) var h = f.dgst;
        f = h, u = Error(o(419)), u.stack = "", u.digest = f, Vu({ value: u, source: null, stack: null }), t = hc(
          l,
          t,
          a
        );
      } else if (zl || nu(l, t, a, !1), f = (a & l.childLanes) !== 0, zl || f) {
        if (f = cl, f !== null && (u = bi(f, a), u !== 0 && u !== i.retryLane))
          throw i.retryLane = u, Ua(l, u), $l(f, l, u), cc;
        Jc(c) || bn(), t = hc(
          l,
          t,
          a
        );
      } else
        Jc(c) ? (t.flags |= 192, t.child = l.child, t = null) : (l = i.treeContext, ml = gt(
          c.nextSibling
        ), pl = t, J = !0, la = null, dt = !1, l !== null && d0(t, l), t = sc(
          t,
          u.children
        ), t.flags |= 4096);
      return t;
    }
    return e ? (ca(), c = u.fallback, e = t.mode, i = l.child, h = i.sibling, u = Rt(i, {
      mode: "hidden",
      children: u.children
    }), u.subtreeFlags = i.subtreeFlags & 65011712, h !== null ? c = Rt(
      h,
      c
    ) : (c = pa(
      c,
      e,
      a,
      null
    ), c.flags |= 2), c.return = t, u.return = t, u.sibling = c, t.child = u, le(null, u), u = t.child, c = l.child.memoizedState, c === null ? c = yc(a) : (e = c.cachePool, e !== null ? (i = bl._currentValue, e = e.parent !== i ? { parent: i, pool: i } : e) : e = z0(), c = {
      baseLanes: c.baseLanes | a,
      cachePool: e
    }), u.memoizedState = c, u.childLanes = vc(
      l,
      f,
      a
    ), t.memoizedState = mc, le(l.child, u)) : (fa(t), a = l.child, l = a.sibling, a = Rt(a, {
      mode: "visible",
      children: u.children
    }), a.return = t, a.sibling = null, l !== null && (f = t.deletions, f === null ? (t.deletions = [l], t.flags |= 16) : f.push(l)), t.child = a, t.memoizedState = null, a);
  }
  function sc(l, t) {
    return t = mn(
      { mode: "visible", children: t },
      l.mode
    ), t.return = l, l.child = t;
  }
  function mn(l, t) {
    return l = tt(22, l, null, t), l.lanes = 0, l;
  }
  function hc(l, t, a) {
    return Ya(t, l.child, null, a), l = sc(
      t,
      t.pendingProps.children
    ), l.flags |= 2, t.memoizedState = null, l;
  }
  function qm(l, t, a) {
    l.lanes |= t;
    var u = l.alternate;
    u !== null && (u.lanes |= t), Uf(l.return, t, a);
  }
  function dc(l, t, a, u, e, n) {
    var f = l.memoizedState;
    f === null ? l.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: u,
      tail: a,
      tailMode: e,
      treeForkCount: n
    } : (f.isBackwards = t, f.rendering = null, f.renderingStartTime = 0, f.last = u, f.tail = a, f.tailMode = e, f.treeForkCount = n);
  }
  function Rm(l, t, a) {
    var u = t.pendingProps, e = u.revealOrder, n = u.tail;
    u = u.children;
    var f = gl.current, c = (f & 2) !== 0;
    if (c ? (f = f & 1 | 2, t.flags |= 128) : f &= 1, M(gl, f), Hl(l, t, u, a), u = J ? Zu : 0, !c && l !== null && (l.flags & 128) !== 0)
      l: for (l = t.child; l !== null; ) {
        if (l.tag === 13)
          l.memoizedState !== null && qm(l, a, t);
        else if (l.tag === 19)
          qm(l, a, t);
        else if (l.child !== null) {
          l.child.return = l, l = l.child;
          continue;
        }
        if (l === t) break l;
        for (; l.sibling === null; ) {
          if (l.return === null || l.return === t)
            break l;
          l = l.return;
        }
        l.sibling.return = l.return, l = l.sibling;
      }
    switch (e) {
      case "forwards":
        for (a = t.child, e = null; a !== null; )
          l = a.alternate, l !== null && ke(l) === null && (e = a), a = a.sibling;
        a = e, a === null ? (e = t.child, t.child = null) : (e = a.sibling, a.sibling = null), dc(
          t,
          !1,
          e,
          a,
          n,
          u
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (a = null, e = t.child, t.child = null; e !== null; ) {
          if (l = e.alternate, l !== null && ke(l) === null) {
            t.child = e;
            break;
          }
          l = e.sibling, e.sibling = a, a = e, e = l;
        }
        dc(
          t,
          !0,
          a,
          null,
          n,
          u
        );
        break;
      case "together":
        dc(
          t,
          !1,
          null,
          null,
          void 0,
          u
        );
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function jt(l, t, a) {
    if (l !== null && (t.dependencies = l.dependencies), ya |= t.lanes, (a & t.childLanes) === 0)
      if (l !== null) {
        if (nu(
          l,
          t,
          a,
          !1
        ), (a & t.childLanes) === 0)
          return null;
      } else return null;
    if (l !== null && t.child !== l.child)
      throw Error(o(153));
    if (t.child !== null) {
      for (l = t.child, a = Rt(l, l.pendingProps), t.child = a, a.return = t; l.sibling !== null; )
        l = l.sibling, a = a.sibling = Rt(l, l.pendingProps), a.return = t;
      a.sibling = null;
    }
    return t.child;
  }
  function oc(l, t) {
    return (l.lanes & t) !== 0 ? !0 : (l = l.dependencies, !!(l !== null && Ve(l)));
  }
  function Vs(l, t, a) {
    switch (t.tag) {
      case 3:
        Gl(t, t.stateNode.containerInfo), aa(t, bl, l.memoizedState.cache), Na();
        break;
      case 27:
      case 5:
        Mu(t);
        break;
      case 4:
        Gl(t, t.stateNode.containerInfo);
        break;
      case 10:
        aa(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, jf(t), null;
        break;
      case 13:
        var u = t.memoizedState;
        if (u !== null)
          return u.dehydrated !== null ? (fa(t), t.flags |= 128, null) : (a & t.child.childLanes) !== 0 ? Cm(l, t, a) : (fa(t), l = jt(
            l,
            t,
            a
          ), l !== null ? l.sibling : null);
        fa(t);
        break;
      case 19:
        var e = (l.flags & 128) !== 0;
        if (u = (a & t.childLanes) !== 0, u || (nu(
          l,
          t,
          a,
          !1
        ), u = (a & t.childLanes) !== 0), e) {
          if (u)
            return Rm(
              l,
              t,
              a
            );
          t.flags |= 128;
        }
        if (e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null, e.lastEffect = null), M(gl, gl.current), u) break;
        return null;
      case 22:
        return t.lanes = 0, Mm(
          l,
          t,
          a,
          t.pendingProps
        );
      case 24:
        aa(t, bl, l.memoizedState.cache);
    }
    return jt(l, t, a);
  }
  function Bm(l, t, a) {
    if (l !== null)
      if (l.memoizedProps !== t.pendingProps)
        zl = !0;
      else {
        if (!oc(l, a) && (t.flags & 128) === 0)
          return zl = !1, Vs(
            l,
            t,
            a
          );
        zl = (l.flags & 131072) !== 0;
      }
    else
      zl = !1, J && (t.flags & 1048576) !== 0 && h0(t, Zu, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        l: {
          var u = t.pendingProps;
          if (l = Ra(t.elementType), t.type = l, typeof l == "function")
            zf(l) ? (u = Xa(l, u), t.tag = 1, t = Nm(
              null,
              t,
              l,
              u,
              a
            )) : (t.tag = 0, t = ic(
              null,
              t,
              l,
              u,
              a
            ));
          else {
            if (l != null) {
              var e = l.$$typeof;
              if (e === vl) {
                t.tag = 11, t = Am(
                  null,
                  t,
                  l,
                  u,
                  a
                );
                break l;
              } else if (e === K) {
                t.tag = 14, t = _m(
                  null,
                  t,
                  l,
                  u,
                  a
                );
                break l;
              }
            }
            throw t = Nt(l) || l, Error(o(306, t, ""));
          }
        }
        return t;
      case 0:
        return ic(
          l,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 1:
        return u = t.type, e = Xa(
          u,
          t.pendingProps
        ), Nm(
          l,
          t,
          u,
          e,
          a
        );
      case 3:
        l: {
          if (Gl(
            t,
            t.stateNode.containerInfo
          ), l === null) throw Error(o(387));
          u = t.pendingProps;
          var n = t.memoizedState;
          e = n.element, Bf(l, t), $u(t, u, null, a);
          var f = t.memoizedState;
          if (u = f.cache, aa(t, bl, u), u !== n.cache && pf(
            t,
            [bl],
            a,
            !0
          ), Wu(), u = f.element, n.isDehydrated)
            if (n = {
              element: u,
              isDehydrated: !1,
              cache: f.cache
            }, t.updateQueue.baseState = n, t.memoizedState = n, t.flags & 256) {
              t = Hm(
                l,
                t,
                u,
                a
              );
              break l;
            } else if (u !== e) {
              e = vt(
                Error(o(424)),
                t
              ), Vu(e), t = Hm(
                l,
                t,
                u,
                a
              );
              break l;
            } else {
              switch (l = t.stateNode.containerInfo, l.nodeType) {
                case 9:
                  l = l.body;
                  break;
                default:
                  l = l.nodeName === "HTML" ? l.ownerDocument.body : l;
              }
              for (ml = gt(l.firstChild), pl = t, J = !0, la = null, dt = !0, a = M0(
                t,
                null,
                u,
                a
              ), t.child = a; a; )
                a.flags = a.flags & -3 | 4096, a = a.sibling;
            }
          else {
            if (Na(), u === e) {
              t = jt(
                l,
                t,
                a
              );
              break l;
            }
            Hl(l, t, u, a);
          }
          t = t.child;
        }
        return t;
      case 26:
        return cn(l, t), l === null ? (a = Jy(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = a : J || (a = t.type, l = t.pendingProps, u = On(
          j.current
        ).createElement(a), u[Ul] = t, u[Ll] = l, Cl(u, a, l), Al(u), t.stateNode = u) : t.memoizedState = Jy(
          t.type,
          l.memoizedProps,
          t.pendingProps,
          l.memoizedState
        ), null;
      case 27:
        return Mu(t), l === null && J && (u = t.stateNode = Ly(
          t.type,
          t.pendingProps,
          j.current
        ), pl = t, dt = !0, e = ml, oa(t.type) ? (Wc = e, ml = gt(u.firstChild)) : ml = e), Hl(
          l,
          t,
          t.pendingProps.children,
          a
        ), cn(l, t), l === null && (t.flags |= 4194304), t.child;
      case 5:
        return l === null && J && ((e = u = ml) && (u = bh(
          u,
          t.type,
          t.pendingProps,
          dt
        ), u !== null ? (t.stateNode = u, pl = t, ml = gt(u.firstChild), dt = !1, e = !0) : e = !1), e || ta(t)), Mu(t), e = t.type, n = t.pendingProps, f = l !== null ? l.memoizedProps : null, u = n.children, Lc(e, n) ? u = null : f !== null && Lc(e, f) && (t.flags |= 32), t.memoizedState !== null && (e = Vf(
          l,
          t,
          qs,
          null,
          null,
          a
        ), oe._currentValue = e), cn(l, t), Hl(l, t, u, a), t.child;
      case 6:
        return l === null && J && ((l = a = ml) && (a = Eh(
          a,
          t.pendingProps,
          dt
        ), a !== null ? (t.stateNode = a, pl = t, ml = null, l = !0) : l = !1), l || ta(t)), null;
      case 13:
        return Cm(l, t, a);
      case 4:
        return Gl(
          t,
          t.stateNode.containerInfo
        ), u = t.pendingProps, l === null ? t.child = Ya(
          t,
          null,
          u,
          a
        ) : Hl(l, t, u, a), t.child;
      case 11:
        return Am(
          l,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 7:
        return Hl(
          l,
          t,
          t.pendingProps,
          a
        ), t.child;
      case 8:
        return Hl(
          l,
          t,
          t.pendingProps.children,
          a
        ), t.child;
      case 12:
        return Hl(
          l,
          t,
          t.pendingProps.children,
          a
        ), t.child;
      case 10:
        return u = t.pendingProps, aa(t, t.type, u.value), Hl(l, t, u.children, a), t.child;
      case 9:
        return e = t.type._context, u = t.pendingProps.children, Ca(t), e = Nl(e), u = u(e), t.flags |= 1, Hl(l, t, u, a), t.child;
      case 14:
        return _m(
          l,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 15:
        return Om(
          l,
          t,
          t.type,
          t.pendingProps,
          a
        );
      case 19:
        return Rm(l, t, a);
      case 31:
        return Zs(l, t, a);
      case 22:
        return Mm(
          l,
          t,
          a,
          t.pendingProps
        );
      case 24:
        return Ca(t), u = Nl(bl), l === null ? (e = Cf(), e === null && (e = cl, n = Nf(), e.pooledCache = n, n.refCount++, n !== null && (e.pooledCacheLanes |= a), e = n), t.memoizedState = { parent: u, cache: e }, Rf(t), aa(t, bl, e)) : ((l.lanes & a) !== 0 && (Bf(l, t), $u(t, null, null, a), Wu()), e = l.memoizedState, n = t.memoizedState, e.parent !== u ? (e = { parent: u, cache: u }, t.memoizedState = e, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = e), aa(t, bl, u)) : (u = n.cache, aa(t, bl, u), u !== e.cache && pf(
          t,
          [bl],
          a,
          !0
        ))), Hl(
          l,
          t,
          t.pendingProps.children,
          a
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(o(156, t.tag));
  }
  function Zt(l) {
    l.flags |= 4;
  }
  function gc(l, t, a, u, e) {
    if ((t = (l.mode & 32) !== 0) && (t = !1), t) {
      if (l.flags |= 16777216, (e & 335544128) === e)
        if (l.stateNode.complete) l.flags |= 8192;
        else if (iy()) l.flags |= 8192;
        else
          throw Ba = Je, qf;
    } else l.flags &= -16777217;
  }
  function Ym(l, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      l.flags &= -16777217;
    else if (l.flags |= 16777216, !Fy(t))
      if (iy()) l.flags |= 8192;
      else
        throw Ba = Je, qf;
  }
  function yn(l, t) {
    t !== null && (l.flags |= 4), l.flags & 16384 && (t = l.tag !== 22 ? oi() : 536870912, l.lanes |= t, Su |= t);
  }
  function te(l, t) {
    if (!J)
      switch (l.tailMode) {
        case "hidden":
          t = l.tail;
          for (var a = null; t !== null; )
            t.alternate !== null && (a = t), t = t.sibling;
          a === null ? l.tail = null : a.sibling = null;
          break;
        case "collapsed":
          a = l.tail;
          for (var u = null; a !== null; )
            a.alternate !== null && (u = a), a = a.sibling;
          u === null ? t || l.tail === null ? l.tail = null : l.tail.sibling = null : u.sibling = null;
      }
  }
  function yl(l) {
    var t = l.alternate !== null && l.alternate.child === l.child, a = 0, u = 0;
    if (t)
      for (var e = l.child; e !== null; )
        a |= e.lanes | e.childLanes, u |= e.subtreeFlags & 65011712, u |= e.flags & 65011712, e.return = l, e = e.sibling;
    else
      for (e = l.child; e !== null; )
        a |= e.lanes | e.childLanes, u |= e.subtreeFlags, u |= e.flags, e.return = l, e = e.sibling;
    return l.subtreeFlags |= u, l.childLanes = a, t;
  }
  function Ls(l, t, a) {
    var u = t.pendingProps;
    switch (_f(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return yl(t), null;
      case 1:
        return yl(t), null;
      case 3:
        return a = t.stateNode, u = null, l !== null && (u = l.memoizedState.cache), t.memoizedState.cache !== u && (t.flags |= 2048), Gt(bl), ol(), a.pendingContext && (a.context = a.pendingContext, a.pendingContext = null), (l === null || l.child === null) && (eu(t) ? Zt(t) : l === null || l.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Mf())), yl(t), null;
      case 26:
        var e = t.type, n = t.memoizedState;
        return l === null ? (Zt(t), n !== null ? (yl(t), Ym(t, n)) : (yl(t), gc(
          t,
          e,
          null,
          u,
          a
        ))) : n ? n !== l.memoizedState ? (Zt(t), yl(t), Ym(t, n)) : (yl(t), t.flags &= -16777217) : (l = l.memoizedProps, l !== u && Zt(t), yl(t), gc(
          t,
          e,
          l,
          u,
          a
        )), null;
      case 27:
        if (ze(t), a = j.current, e = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== u && Zt(t);
        else {
          if (!u) {
            if (t.stateNode === null)
              throw Error(o(166));
            return yl(t), null;
          }
          l = p.current, eu(t) ? o0(t) : (l = Ly(e, u, a), t.stateNode = l, Zt(t));
        }
        return yl(t), null;
      case 5:
        if (ze(t), e = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== u && Zt(t);
        else {
          if (!u) {
            if (t.stateNode === null)
              throw Error(o(166));
            return yl(t), null;
          }
          if (n = p.current, eu(t))
            o0(t);
          else {
            var f = On(
              j.current
            );
            switch (n) {
              case 1:
                n = f.createElementNS(
                  "http://www.w3.org/2000/svg",
                  e
                );
                break;
              case 2:
                n = f.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  e
                );
                break;
              default:
                switch (e) {
                  case "svg":
                    n = f.createElementNS(
                      "http://www.w3.org/2000/svg",
                      e
                    );
                    break;
                  case "math":
                    n = f.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      e
                    );
                    break;
                  case "script":
                    n = f.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(
                      n.firstChild
                    );
                    break;
                  case "select":
                    n = typeof u.is == "string" ? f.createElement("select", {
                      is: u.is
                    }) : f.createElement("select"), u.multiple ? n.multiple = !0 : u.size && (n.size = u.size);
                    break;
                  default:
                    n = typeof u.is == "string" ? f.createElement(e, { is: u.is }) : f.createElement(e);
                }
            }
            n[Ul] = t, n[Ll] = u;
            l: for (f = t.child; f !== null; ) {
              if (f.tag === 5 || f.tag === 6)
                n.appendChild(f.stateNode);
              else if (f.tag !== 4 && f.tag !== 27 && f.child !== null) {
                f.child.return = f, f = f.child;
                continue;
              }
              if (f === t) break l;
              for (; f.sibling === null; ) {
                if (f.return === null || f.return === t)
                  break l;
                f = f.return;
              }
              f.sibling.return = f.return, f = f.sibling;
            }
            t.stateNode = n;
            l: switch (Cl(n, e, u), e) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                u = !!u.autoFocus;
                break l;
              case "img":
                u = !0;
                break l;
              default:
                u = !1;
            }
            u && Zt(t);
          }
        }
        return yl(t), gc(
          t,
          t.type,
          l === null ? null : l.memoizedProps,
          t.pendingProps,
          a
        ), null;
      case 6:
        if (l && t.stateNode != null)
          l.memoizedProps !== u && Zt(t);
        else {
          if (typeof u != "string" && t.stateNode === null)
            throw Error(o(166));
          if (l = j.current, eu(t)) {
            if (l = t.stateNode, a = t.memoizedProps, u = null, e = pl, e !== null)
              switch (e.tag) {
                case 27:
                case 5:
                  u = e.memoizedProps;
              }
            l[Ul] = t, l = !!(l.nodeValue === a || u !== null && u.suppressHydrationWarning === !0 || Cy(l.nodeValue, a)), l || ta(t, !0);
          } else
            l = On(l).createTextNode(
              u
            ), l[Ul] = t, t.stateNode = l;
        }
        return yl(t), null;
      case 31:
        if (a = t.memoizedState, l === null || l.memoizedState !== null) {
          if (u = eu(t), a !== null) {
            if (l === null) {
              if (!u) throw Error(o(318));
              if (l = t.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(o(557));
              l[Ul] = t;
            } else
              Na(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            yl(t), l = !1;
          } else
            a = Mf(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = a), l = !0;
          if (!l)
            return t.flags & 256 ? (ut(t), t) : (ut(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(o(558));
        }
        return yl(t), null;
      case 13:
        if (u = t.memoizedState, l === null || l.memoizedState !== null && l.memoizedState.dehydrated !== null) {
          if (e = eu(t), u !== null && u.dehydrated !== null) {
            if (l === null) {
              if (!e) throw Error(o(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(o(317));
              e[Ul] = t;
            } else
              Na(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            yl(t), e = !1;
          } else
            e = Mf(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = e), e = !0;
          if (!e)
            return t.flags & 256 ? (ut(t), t) : (ut(t), null);
        }
        return ut(t), (t.flags & 128) !== 0 ? (t.lanes = a, t) : (a = u !== null, l = l !== null && l.memoizedState !== null, a && (u = t.child, e = null, u.alternate !== null && u.alternate.memoizedState !== null && u.alternate.memoizedState.cachePool !== null && (e = u.alternate.memoizedState.cachePool.pool), n = null, u.memoizedState !== null && u.memoizedState.cachePool !== null && (n = u.memoizedState.cachePool.pool), n !== e && (u.flags |= 2048)), a !== l && a && (t.child.flags |= 8192), yn(t, t.updateQueue), yl(t), null);
      case 4:
        return ol(), l === null && Xc(t.stateNode.containerInfo), yl(t), null;
      case 10:
        return Gt(t.type), yl(t), null;
      case 19:
        if (r(gl), u = t.memoizedState, u === null) return yl(t), null;
        if (e = (t.flags & 128) !== 0, n = u.rendering, n === null)
          if (e) te(u, !1);
          else {
            if (dl !== 0 || l !== null && (l.flags & 128) !== 0)
              for (l = t.child; l !== null; ) {
                if (n = ke(l), n !== null) {
                  for (t.flags |= 128, te(u, !1), l = n.updateQueue, t.updateQueue = l, yn(t, l), t.subtreeFlags = 0, l = a, a = t.child; a !== null; )
                    y0(a, l), a = a.sibling;
                  return M(
                    gl,
                    gl.current & 1 | 2
                  ), J && Bt(t, u.treeForkCount), t.child;
                }
                l = l.sibling;
              }
            u.tail !== null && Fl() > on && (t.flags |= 128, e = !0, te(u, !1), t.lanes = 4194304);
          }
        else {
          if (!e)
            if (l = ke(n), l !== null) {
              if (t.flags |= 128, e = !0, l = l.updateQueue, t.updateQueue = l, yn(t, l), te(u, !0), u.tail === null && u.tailMode === "hidden" && !n.alternate && !J)
                return yl(t), null;
            } else
              2 * Fl() - u.renderingStartTime > on && a !== 536870912 && (t.flags |= 128, e = !0, te(u, !1), t.lanes = 4194304);
          u.isBackwards ? (n.sibling = t.child, t.child = n) : (l = u.last, l !== null ? l.sibling = n : t.child = n, u.last = n);
        }
        return u.tail !== null ? (l = u.tail, u.rendering = l, u.tail = l.sibling, u.renderingStartTime = Fl(), l.sibling = null, a = gl.current, M(
          gl,
          e ? a & 1 | 2 : a & 1
        ), J && Bt(t, u.treeForkCount), l) : (yl(t), null);
      case 22:
      case 23:
        return ut(t), Qf(), u = t.memoizedState !== null, l !== null ? l.memoizedState !== null !== u && (t.flags |= 8192) : u && (t.flags |= 8192), u ? (a & 536870912) !== 0 && (t.flags & 128) === 0 && (yl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : yl(t), a = t.updateQueue, a !== null && yn(t, a.retryQueue), a = null, l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (a = l.memoizedState.cachePool.pool), u = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (u = t.memoizedState.cachePool.pool), u !== a && (t.flags |= 2048), l !== null && r(qa), null;
      case 24:
        return a = null, l !== null && (a = l.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), Gt(bl), yl(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function xs(l, t) {
    switch (_f(t), t.tag) {
      case 1:
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 3:
        return Gt(bl), ol(), l = t.flags, (l & 65536) !== 0 && (l & 128) === 0 ? (t.flags = l & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return ze(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (ut(t), t.alternate === null)
            throw Error(o(340));
          Na();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 13:
        if (ut(t), l = t.memoizedState, l !== null && l.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(o(340));
          Na();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 19:
        return r(gl), null;
      case 4:
        return ol(), null;
      case 10:
        return Gt(t.type), null;
      case 22:
      case 23:
        return ut(t), Qf(), l !== null && r(qa), l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 24:
        return Gt(bl), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Gm(l, t) {
    switch (_f(t), t.tag) {
      case 3:
        Gt(bl), ol();
        break;
      case 26:
      case 27:
      case 5:
        ze(t);
        break;
      case 4:
        ol();
        break;
      case 31:
        t.memoizedState !== null && ut(t);
        break;
      case 13:
        ut(t);
        break;
      case 19:
        r(gl);
        break;
      case 10:
        Gt(t.type);
        break;
      case 22:
      case 23:
        ut(t), Qf(), l !== null && r(qa);
        break;
      case 24:
        Gt(bl);
    }
  }
  function ae(l, t) {
    try {
      var a = t.updateQueue, u = a !== null ? a.lastEffect : null;
      if (u !== null) {
        var e = u.next;
        a = e;
        do {
          if ((a.tag & l) === l) {
            u = void 0;
            var n = a.create, f = a.inst;
            u = n(), f.destroy = u;
          }
          a = a.next;
        } while (a !== e);
      }
    } catch (c) {
      tl(t, t.return, c);
    }
  }
  function ia(l, t, a) {
    try {
      var u = t.updateQueue, e = u !== null ? u.lastEffect : null;
      if (e !== null) {
        var n = e.next;
        u = n;
        do {
          if ((u.tag & l) === l) {
            var f = u.inst, c = f.destroy;
            if (c !== void 0) {
              f.destroy = void 0, e = t;
              var i = a, h = c;
              try {
                h();
              } catch (S) {
                tl(
                  e,
                  i,
                  S
                );
              }
            }
          }
          u = u.next;
        } while (u !== n);
      }
    } catch (S) {
      tl(t, t.return, S);
    }
  }
  function Xm(l) {
    var t = l.updateQueue;
    if (t !== null) {
      var a = l.stateNode;
      try {
        U0(t, a);
      } catch (u) {
        tl(l, l.return, u);
      }
    }
  }
  function Qm(l, t, a) {
    a.props = Xa(
      l.type,
      l.memoizedProps
    ), a.state = l.memoizedState;
    try {
      a.componentWillUnmount();
    } catch (u) {
      tl(l, t, u);
    }
  }
  function ue(l, t) {
    try {
      var a = l.ref;
      if (a !== null) {
        switch (l.tag) {
          case 26:
          case 27:
          case 5:
            var u = l.stateNode;
            break;
          case 30:
            u = l.stateNode;
            break;
          default:
            u = l.stateNode;
        }
        typeof a == "function" ? l.refCleanup = a(u) : a.current = u;
      }
    } catch (e) {
      tl(l, t, e);
    }
  }
  function Ut(l, t) {
    var a = l.ref, u = l.refCleanup;
    if (a !== null)
      if (typeof u == "function")
        try {
          u();
        } catch (e) {
          tl(l, t, e);
        } finally {
          l.refCleanup = null, l = l.alternate, l != null && (l.refCleanup = null);
        }
      else if (typeof a == "function")
        try {
          a(null);
        } catch (e) {
          tl(l, t, e);
        }
      else a.current = null;
  }
  function jm(l) {
    var t = l.type, a = l.memoizedProps, u = l.stateNode;
    try {
      l: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && u.focus();
          break l;
        case "img":
          a.src ? u.src = a.src : a.srcSet && (u.srcset = a.srcSet);
      }
    } catch (e) {
      tl(l, l.return, e);
    }
  }
  function Sc(l, t, a) {
    try {
      var u = l.stateNode;
      sh(u, l.type, a, t), u[Ll] = t;
    } catch (e) {
      tl(l, l.return, e);
    }
  }
  function Zm(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 26 || l.tag === 27 && oa(l.type) || l.tag === 4;
  }
  function bc(l) {
    l: for (; ; ) {
      for (; l.sibling === null; ) {
        if (l.return === null || Zm(l.return)) return null;
        l = l.return;
      }
      for (l.sibling.return = l.return, l = l.sibling; l.tag !== 5 && l.tag !== 6 && l.tag !== 18; ) {
        if (l.tag === 27 && oa(l.type) || l.flags & 2 || l.child === null || l.tag === 4) continue l;
        l.child.return = l, l = l.child;
      }
      if (!(l.flags & 2)) return l.stateNode;
    }
  }
  function Ec(l, t, a) {
    var u = l.tag;
    if (u === 5 || u === 6)
      l = l.stateNode, t ? (a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a).insertBefore(l, t) : (t = a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a, t.appendChild(l), a = a._reactRootContainer, a != null || t.onclick !== null || (t.onclick = Ct));
    else if (u !== 4 && (u === 27 && oa(l.type) && (a = l.stateNode, t = null), l = l.child, l !== null))
      for (Ec(l, t, a), l = l.sibling; l !== null; )
        Ec(l, t, a), l = l.sibling;
  }
  function vn(l, t, a) {
    var u = l.tag;
    if (u === 5 || u === 6)
      l = l.stateNode, t ? a.insertBefore(l, t) : a.appendChild(l);
    else if (u !== 4 && (u === 27 && oa(l.type) && (a = l.stateNode), l = l.child, l !== null))
      for (vn(l, t, a), l = l.sibling; l !== null; )
        vn(l, t, a), l = l.sibling;
  }
  function Vm(l) {
    var t = l.stateNode, a = l.memoizedProps;
    try {
      for (var u = l.type, e = t.attributes; e.length; )
        t.removeAttributeNode(e[0]);
      Cl(t, u, a), t[Ul] = l, t[Ll] = a;
    } catch (n) {
      tl(l, l.return, n);
    }
  }
  var Vt = !1, rl = !1, zc = !1, Lm = typeof WeakSet == "function" ? WeakSet : Set, _l = null;
  function Ks(l, t) {
    if (l = l.containerInfo, Zc = Cn, l = t0(l), hf(l)) {
      if ("selectionStart" in l)
        var a = {
          start: l.selectionStart,
          end: l.selectionEnd
        };
      else
        l: {
          a = (a = l.ownerDocument) && a.defaultView || window;
          var u = a.getSelection && a.getSelection();
          if (u && u.rangeCount !== 0) {
            a = u.anchorNode;
            var e = u.anchorOffset, n = u.focusNode;
            u = u.focusOffset;
            try {
              a.nodeType, n.nodeType;
            } catch {
              a = null;
              break l;
            }
            var f = 0, c = -1, i = -1, h = 0, S = 0, z = l, d = null;
            t: for (; ; ) {
              for (var g; z !== a || e !== 0 && z.nodeType !== 3 || (c = f + e), z !== n || u !== 0 && z.nodeType !== 3 || (i = f + u), z.nodeType === 3 && (f += z.nodeValue.length), (g = z.firstChild) !== null; )
                d = z, z = g;
              for (; ; ) {
                if (z === l) break t;
                if (d === a && ++h === e && (c = f), d === n && ++S === u && (i = f), (g = z.nextSibling) !== null) break;
                z = d, d = z.parentNode;
              }
              z = g;
            }
            a = c === -1 || i === -1 ? null : { start: c, end: i };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (Vc = { focusedElem: l, selectionRange: a }, Cn = !1, _l = t; _l !== null; )
      if (t = _l, l = t.child, (t.subtreeFlags & 1028) !== 0 && l !== null)
        l.return = t, _l = l;
      else
        for (; _l !== null; ) {
          switch (t = _l, n = t.alternate, l = t.flags, t.tag) {
            case 0:
              if ((l & 4) !== 0 && (l = t.updateQueue, l = l !== null ? l.events : null, l !== null))
                for (a = 0; a < l.length; a++)
                  e = l[a], e.ref.impl = e.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((l & 1024) !== 0 && n !== null) {
                l = void 0, a = t, e = n.memoizedProps, n = n.memoizedState, u = a.stateNode;
                try {
                  var U = Xa(
                    a.type,
                    e
                  );
                  l = u.getSnapshotBeforeUpdate(
                    U,
                    n
                  ), u.__reactInternalSnapshotBeforeUpdate = l;
                } catch (R) {
                  tl(
                    a,
                    a.return,
                    R
                  );
                }
              }
              break;
            case 3:
              if ((l & 1024) !== 0) {
                if (l = t.stateNode.containerInfo, a = l.nodeType, a === 9)
                  Kc(l);
                else if (a === 1)
                  switch (l.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Kc(l);
                      break;
                    default:
                      l.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((l & 1024) !== 0) throw Error(o(163));
          }
          if (l = t.sibling, l !== null) {
            l.return = t.return, _l = l;
            break;
          }
          _l = t.return;
        }
  }
  function xm(l, t, a) {
    var u = a.flags;
    switch (a.tag) {
      case 0:
      case 11:
      case 15:
        xt(l, a), u & 4 && ae(5, a);
        break;
      case 1:
        if (xt(l, a), u & 4)
          if (l = a.stateNode, t === null)
            try {
              l.componentDidMount();
            } catch (f) {
              tl(a, a.return, f);
            }
          else {
            var e = Xa(
              a.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              l.componentDidUpdate(
                e,
                t,
                l.__reactInternalSnapshotBeforeUpdate
              );
            } catch (f) {
              tl(
                a,
                a.return,
                f
              );
            }
          }
        u & 64 && Xm(a), u & 512 && ue(a, a.return);
        break;
      case 3:
        if (xt(l, a), u & 64 && (l = a.updateQueue, l !== null)) {
          if (t = null, a.child !== null)
            switch (a.child.tag) {
              case 27:
              case 5:
                t = a.child.stateNode;
                break;
              case 1:
                t = a.child.stateNode;
            }
          try {
            U0(l, t);
          } catch (f) {
            tl(a, a.return, f);
          }
        }
        break;
      case 27:
        t === null && u & 4 && Vm(a);
      case 26:
      case 5:
        xt(l, a), t === null && u & 4 && jm(a), u & 512 && ue(a, a.return);
        break;
      case 12:
        xt(l, a);
        break;
      case 31:
        xt(l, a), u & 4 && wm(l, a);
        break;
      case 13:
        xt(l, a), u & 4 && Wm(l, a), u & 64 && (l = a.memoizedState, l !== null && (l = l.dehydrated, l !== null && (a = lh.bind(
          null,
          a
        ), zh(l, a))));
        break;
      case 22:
        if (u = a.memoizedState !== null || Vt, !u) {
          t = t !== null && t.memoizedState !== null || rl, e = Vt;
          var n = rl;
          Vt = u, (rl = t) && !n ? Kt(
            l,
            a,
            (a.subtreeFlags & 8772) !== 0
          ) : xt(l, a), Vt = e, rl = n;
        }
        break;
      case 30:
        break;
      default:
        xt(l, a);
    }
  }
  function Km(l) {
    var t = l.alternate;
    t !== null && (l.alternate = null, Km(t)), l.child = null, l.deletions = null, l.sibling = null, l.tag === 5 && (t = l.stateNode, t !== null && $n(t)), l.stateNode = null, l.return = null, l.dependencies = null, l.memoizedProps = null, l.memoizedState = null, l.pendingProps = null, l.stateNode = null, l.updateQueue = null;
  }
  var sl = null, Kl = !1;
  function Lt(l, t, a) {
    for (a = a.child; a !== null; )
      Jm(l, t, a), a = a.sibling;
  }
  function Jm(l, t, a) {
    if (Il && typeof Il.onCommitFiberUnmount == "function")
      try {
        Il.onCommitFiberUnmount(Du, a);
      } catch {
      }
    switch (a.tag) {
      case 26:
        rl || Ut(a, t), Lt(
          l,
          t,
          a
        ), a.memoizedState ? a.memoizedState.count-- : a.stateNode && (a = a.stateNode, a.parentNode.removeChild(a));
        break;
      case 27:
        rl || Ut(a, t);
        var u = sl, e = Kl;
        oa(a.type) && (sl = a.stateNode, Kl = !1), Lt(
          l,
          t,
          a
        ), se(a.stateNode), sl = u, Kl = e;
        break;
      case 5:
        rl || Ut(a, t);
      case 6:
        if (u = sl, e = Kl, sl = null, Lt(
          l,
          t,
          a
        ), sl = u, Kl = e, sl !== null)
          if (Kl)
            try {
              (sl.nodeType === 9 ? sl.body : sl.nodeName === "HTML" ? sl.ownerDocument.body : sl).removeChild(a.stateNode);
            } catch (n) {
              tl(
                a,
                t,
                n
              );
            }
          else
            try {
              sl.removeChild(a.stateNode);
            } catch (n) {
              tl(
                a,
                t,
                n
              );
            }
        break;
      case 18:
        sl !== null && (Kl ? (l = sl, Xy(
          l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l,
          a.stateNode
        ), Ou(l)) : Xy(sl, a.stateNode));
        break;
      case 4:
        u = sl, e = Kl, sl = a.stateNode.containerInfo, Kl = !0, Lt(
          l,
          t,
          a
        ), sl = u, Kl = e;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        ia(2, a, t), rl || ia(4, a, t), Lt(
          l,
          t,
          a
        );
        break;
      case 1:
        rl || (Ut(a, t), u = a.stateNode, typeof u.componentWillUnmount == "function" && Qm(
          a,
          t,
          u
        )), Lt(
          l,
          t,
          a
        );
        break;
      case 21:
        Lt(
          l,
          t,
          a
        );
        break;
      case 22:
        rl = (u = rl) || a.memoizedState !== null, Lt(
          l,
          t,
          a
        ), rl = u;
        break;
      default:
        Lt(
          l,
          t,
          a
        );
    }
  }
  function wm(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null))) {
      l = l.dehydrated;
      try {
        Ou(l);
      } catch (a) {
        tl(t, t.return, a);
      }
    }
  }
  function Wm(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null && (l = l.dehydrated, l !== null))))
      try {
        Ou(l);
      } catch (a) {
        tl(t, t.return, a);
      }
  }
  function Js(l) {
    switch (l.tag) {
      case 31:
      case 13:
      case 19:
        var t = l.stateNode;
        return t === null && (t = l.stateNode = new Lm()), t;
      case 22:
        return l = l.stateNode, t = l._retryCache, t === null && (t = l._retryCache = new Lm()), t;
      default:
        throw Error(o(435, l.tag));
    }
  }
  function sn(l, t) {
    var a = Js(l);
    t.forEach(function(u) {
      if (!a.has(u)) {
        a.add(u);
        var e = th.bind(null, l, u);
        u.then(e, e);
      }
    });
  }
  function Jl(l, t) {
    var a = t.deletions;
    if (a !== null)
      for (var u = 0; u < a.length; u++) {
        var e = a[u], n = l, f = t, c = f;
        l: for (; c !== null; ) {
          switch (c.tag) {
            case 27:
              if (oa(c.type)) {
                sl = c.stateNode, Kl = !1;
                break l;
              }
              break;
            case 5:
              sl = c.stateNode, Kl = !1;
              break l;
            case 3:
            case 4:
              sl = c.stateNode.containerInfo, Kl = !0;
              break l;
          }
          c = c.return;
        }
        if (sl === null) throw Error(o(160));
        Jm(n, f, e), sl = null, Kl = !1, n = e.alternate, n !== null && (n.return = null), e.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        $m(t, l), t = t.sibling;
  }
  var rt = null;
  function $m(l, t) {
    var a = l.alternate, u = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        Jl(t, l), wl(l), u & 4 && (ia(3, l, l.return), ae(3, l), ia(5, l, l.return));
        break;
      case 1:
        Jl(t, l), wl(l), u & 512 && (rl || a === null || Ut(a, a.return)), u & 64 && Vt && (l = l.updateQueue, l !== null && (u = l.callbacks, u !== null && (a = l.shared.hiddenCallbacks, l.shared.hiddenCallbacks = a === null ? u : a.concat(u))));
        break;
      case 26:
        var e = rt;
        if (Jl(t, l), wl(l), u & 512 && (rl || a === null || Ut(a, a.return)), u & 4) {
          var n = a !== null ? a.memoizedState : null;
          if (u = l.memoizedState, a === null)
            if (u === null)
              if (l.stateNode === null) {
                l: {
                  u = l.type, a = l.memoizedProps, e = e.ownerDocument || e;
                  t: switch (u) {
                    case "title":
                      n = e.getElementsByTagName("title")[0], (!n || n[Nu] || n[Ul] || n.namespaceURI === "http://www.w3.org/2000/svg" || n.hasAttribute("itemprop")) && (n = e.createElement(u), e.head.insertBefore(
                        n,
                        e.querySelector("head > title")
                      )), Cl(n, u, a), n[Ul] = l, Al(n), u = n;
                      break l;
                    case "link":
                      var f = $y(
                        "link",
                        "href",
                        e
                      ).get(u + (a.href || ""));
                      if (f) {
                        for (var c = 0; c < f.length; c++)
                          if (n = f[c], n.getAttribute("href") === (a.href == null || a.href === "" ? null : a.href) && n.getAttribute("rel") === (a.rel == null ? null : a.rel) && n.getAttribute("title") === (a.title == null ? null : a.title) && n.getAttribute("crossorigin") === (a.crossOrigin == null ? null : a.crossOrigin)) {
                            f.splice(c, 1);
                            break t;
                          }
                      }
                      n = e.createElement(u), Cl(n, u, a), e.head.appendChild(n);
                      break;
                    case "meta":
                      if (f = $y(
                        "meta",
                        "content",
                        e
                      ).get(u + (a.content || ""))) {
                        for (c = 0; c < f.length; c++)
                          if (n = f[c], n.getAttribute("content") === (a.content == null ? null : "" + a.content) && n.getAttribute("name") === (a.name == null ? null : a.name) && n.getAttribute("property") === (a.property == null ? null : a.property) && n.getAttribute("http-equiv") === (a.httpEquiv == null ? null : a.httpEquiv) && n.getAttribute("charset") === (a.charSet == null ? null : a.charSet)) {
                            f.splice(c, 1);
                            break t;
                          }
                      }
                      n = e.createElement(u), Cl(n, u, a), e.head.appendChild(n);
                      break;
                    default:
                      throw Error(o(468, u));
                  }
                  n[Ul] = l, Al(n), u = n;
                }
                l.stateNode = u;
              } else
                ky(
                  e,
                  l.type,
                  l.stateNode
                );
            else
              l.stateNode = Wy(
                e,
                u,
                l.memoizedProps
              );
          else
            n !== u ? (n === null ? a.stateNode !== null && (a = a.stateNode, a.parentNode.removeChild(a)) : n.count--, u === null ? ky(
              e,
              l.type,
              l.stateNode
            ) : Wy(
              e,
              u,
              l.memoizedProps
            )) : u === null && l.stateNode !== null && Sc(
              l,
              l.memoizedProps,
              a.memoizedProps
            );
        }
        break;
      case 27:
        Jl(t, l), wl(l), u & 512 && (rl || a === null || Ut(a, a.return)), a !== null && u & 4 && Sc(
          l,
          l.memoizedProps,
          a.memoizedProps
        );
        break;
      case 5:
        if (Jl(t, l), wl(l), u & 512 && (rl || a === null || Ut(a, a.return)), l.flags & 32) {
          e = l.stateNode;
          try {
            Wa(e, "");
          } catch (U) {
            tl(l, l.return, U);
          }
        }
        u & 4 && l.stateNode != null && (e = l.memoizedProps, Sc(
          l,
          e,
          a !== null ? a.memoizedProps : e
        )), u & 1024 && (zc = !0);
        break;
      case 6:
        if (Jl(t, l), wl(l), u & 4) {
          if (l.stateNode === null)
            throw Error(o(162));
          u = l.memoizedProps, a = l.stateNode;
          try {
            a.nodeValue = u;
          } catch (U) {
            tl(l, l.return, U);
          }
        }
        break;
      case 3:
        if (Un = null, e = rt, rt = Mn(t.containerInfo), Jl(t, l), rt = e, wl(l), u & 4 && a !== null && a.memoizedState.isDehydrated)
          try {
            Ou(t.containerInfo);
          } catch (U) {
            tl(l, l.return, U);
          }
        zc && (zc = !1, km(l));
        break;
      case 4:
        u = rt, rt = Mn(
          l.stateNode.containerInfo
        ), Jl(t, l), wl(l), rt = u;
        break;
      case 12:
        Jl(t, l), wl(l);
        break;
      case 31:
        Jl(t, l), wl(l), u & 4 && (u = l.updateQueue, u !== null && (l.updateQueue = null, sn(l, u)));
        break;
      case 13:
        Jl(t, l), wl(l), l.child.flags & 8192 && l.memoizedState !== null != (a !== null && a.memoizedState !== null) && (dn = Fl()), u & 4 && (u = l.updateQueue, u !== null && (l.updateQueue = null, sn(l, u)));
        break;
      case 22:
        e = l.memoizedState !== null;
        var i = a !== null && a.memoizedState !== null, h = Vt, S = rl;
        if (Vt = h || e, rl = S || i, Jl(t, l), rl = S, Vt = h, wl(l), u & 8192)
          l: for (t = l.stateNode, t._visibility = e ? t._visibility & -2 : t._visibility | 1, e && (a === null || i || Vt || rl || Qa(l)), a = null, t = l; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (a === null) {
                i = a = t;
                try {
                  if (n = i.stateNode, e)
                    f = n.style, typeof f.setProperty == "function" ? f.setProperty("display", "none", "important") : f.display = "none";
                  else {
                    c = i.stateNode;
                    var z = i.memoizedProps.style, d = z != null && z.hasOwnProperty("display") ? z.display : null;
                    c.style.display = d == null || typeof d == "boolean" ? "" : ("" + d).trim();
                  }
                } catch (U) {
                  tl(i, i.return, U);
                }
              }
            } else if (t.tag === 6) {
              if (a === null) {
                i = t;
                try {
                  i.stateNode.nodeValue = e ? "" : i.memoizedProps;
                } catch (U) {
                  tl(i, i.return, U);
                }
              }
            } else if (t.tag === 18) {
              if (a === null) {
                i = t;
                try {
                  var g = i.stateNode;
                  e ? Qy(g, !0) : Qy(i.stateNode, !1);
                } catch (U) {
                  tl(i, i.return, U);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === l) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === l) break l;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === l) break l;
              a === t && (a = null), t = t.return;
            }
            a === t && (a = null), t.sibling.return = t.return, t = t.sibling;
          }
        u & 4 && (u = l.updateQueue, u !== null && (a = u.retryQueue, a !== null && (u.retryQueue = null, sn(l, a))));
        break;
      case 19:
        Jl(t, l), wl(l), u & 4 && (u = l.updateQueue, u !== null && (l.updateQueue = null, sn(l, u)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        Jl(t, l), wl(l);
    }
  }
  function wl(l) {
    var t = l.flags;
    if (t & 2) {
      try {
        for (var a, u = l.return; u !== null; ) {
          if (Zm(u)) {
            a = u;
            break;
          }
          u = u.return;
        }
        if (a == null) throw Error(o(160));
        switch (a.tag) {
          case 27:
            var e = a.stateNode, n = bc(l);
            vn(l, n, e);
            break;
          case 5:
            var f = a.stateNode;
            a.flags & 32 && (Wa(f, ""), a.flags &= -33);
            var c = bc(l);
            vn(l, c, f);
            break;
          case 3:
          case 4:
            var i = a.stateNode.containerInfo, h = bc(l);
            Ec(
              l,
              h,
              i
            );
            break;
          default:
            throw Error(o(161));
        }
      } catch (S) {
        tl(l, l.return, S);
      }
      l.flags &= -3;
    }
    t & 4096 && (l.flags &= -4097);
  }
  function km(l) {
    if (l.subtreeFlags & 1024)
      for (l = l.child; l !== null; ) {
        var t = l;
        km(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), l = l.sibling;
      }
  }
  function xt(l, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        xm(l, t.alternate, t), t = t.sibling;
  }
  function Qa(l) {
    for (l = l.child; l !== null; ) {
      var t = l;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          ia(4, t, t.return), Qa(t);
          break;
        case 1:
          Ut(t, t.return);
          var a = t.stateNode;
          typeof a.componentWillUnmount == "function" && Qm(
            t,
            t.return,
            a
          ), Qa(t);
          break;
        case 27:
          se(t.stateNode);
        case 26:
        case 5:
          Ut(t, t.return), Qa(t);
          break;
        case 22:
          t.memoizedState === null && Qa(t);
          break;
        case 30:
          Qa(t);
          break;
        default:
          Qa(t);
      }
      l = l.sibling;
    }
  }
  function Kt(l, t, a) {
    for (a = a && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var u = t.alternate, e = l, n = t, f = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          Kt(
            e,
            n,
            a
          ), ae(4, n);
          break;
        case 1:
          if (Kt(
            e,
            n,
            a
          ), u = n, e = u.stateNode, typeof e.componentDidMount == "function")
            try {
              e.componentDidMount();
            } catch (h) {
              tl(u, u.return, h);
            }
          if (u = n, e = u.updateQueue, e !== null) {
            var c = u.stateNode;
            try {
              var i = e.shared.hiddenCallbacks;
              if (i !== null)
                for (e.shared.hiddenCallbacks = null, e = 0; e < i.length; e++)
                  D0(i[e], c);
            } catch (h) {
              tl(u, u.return, h);
            }
          }
          a && f & 64 && Xm(n), ue(n, n.return);
          break;
        case 27:
          Vm(n);
        case 26:
        case 5:
          Kt(
            e,
            n,
            a
          ), a && u === null && f & 4 && jm(n), ue(n, n.return);
          break;
        case 12:
          Kt(
            e,
            n,
            a
          );
          break;
        case 31:
          Kt(
            e,
            n,
            a
          ), a && f & 4 && wm(e, n);
          break;
        case 13:
          Kt(
            e,
            n,
            a
          ), a && f & 4 && Wm(e, n);
          break;
        case 22:
          n.memoizedState === null && Kt(
            e,
            n,
            a
          ), ue(n, n.return);
          break;
        case 30:
          break;
        default:
          Kt(
            e,
            n,
            a
          );
      }
      t = t.sibling;
    }
  }
  function rc(l, t) {
    var a = null;
    l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (a = l.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== a && (l != null && l.refCount++, a != null && Lu(a));
  }
  function Tc(l, t) {
    l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && Lu(l));
  }
  function Tt(l, t, a, u) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        Fm(
          l,
          t,
          a,
          u
        ), t = t.sibling;
  }
  function Fm(l, t, a, u) {
    var e = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Tt(
          l,
          t,
          a,
          u
        ), e & 2048 && ae(9, t);
        break;
      case 1:
        Tt(
          l,
          t,
          a,
          u
        );
        break;
      case 3:
        Tt(
          l,
          t,
          a,
          u
        ), e & 2048 && (l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && Lu(l)));
        break;
      case 12:
        if (e & 2048) {
          Tt(
            l,
            t,
            a,
            u
          ), l = t.stateNode;
          try {
            var n = t.memoizedProps, f = n.id, c = n.onPostCommit;
            typeof c == "function" && c(
              f,
              t.alternate === null ? "mount" : "update",
              l.passiveEffectDuration,
              -0
            );
          } catch (i) {
            tl(t, t.return, i);
          }
        } else
          Tt(
            l,
            t,
            a,
            u
          );
        break;
      case 31:
        Tt(
          l,
          t,
          a,
          u
        );
        break;
      case 13:
        Tt(
          l,
          t,
          a,
          u
        );
        break;
      case 23:
        break;
      case 22:
        n = t.stateNode, f = t.alternate, t.memoizedState !== null ? n._visibility & 2 ? Tt(
          l,
          t,
          a,
          u
        ) : ee(l, t) : n._visibility & 2 ? Tt(
          l,
          t,
          a,
          u
        ) : (n._visibility |= 2, du(
          l,
          t,
          a,
          u,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), e & 2048 && rc(f, t);
        break;
      case 24:
        Tt(
          l,
          t,
          a,
          u
        ), e & 2048 && Tc(t.alternate, t);
        break;
      default:
        Tt(
          l,
          t,
          a,
          u
        );
    }
  }
  function du(l, t, a, u, e) {
    for (e = e && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var n = l, f = t, c = a, i = u, h = f.flags;
      switch (f.tag) {
        case 0:
        case 11:
        case 15:
          du(
            n,
            f,
            c,
            i,
            e
          ), ae(8, f);
          break;
        case 23:
          break;
        case 22:
          var S = f.stateNode;
          f.memoizedState !== null ? S._visibility & 2 ? du(
            n,
            f,
            c,
            i,
            e
          ) : ee(
            n,
            f
          ) : (S._visibility |= 2, du(
            n,
            f,
            c,
            i,
            e
          )), e && h & 2048 && rc(
            f.alternate,
            f
          );
          break;
        case 24:
          du(
            n,
            f,
            c,
            i,
            e
          ), e && h & 2048 && Tc(f.alternate, f);
          break;
        default:
          du(
            n,
            f,
            c,
            i,
            e
          );
      }
      t = t.sibling;
    }
  }
  function ee(l, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var a = l, u = t, e = u.flags;
        switch (u.tag) {
          case 22:
            ee(a, u), e & 2048 && rc(
              u.alternate,
              u
            );
            break;
          case 24:
            ee(a, u), e & 2048 && Tc(u.alternate, u);
            break;
          default:
            ee(a, u);
        }
        t = t.sibling;
      }
  }
  var ne = 8192;
  function ou(l, t, a) {
    if (l.subtreeFlags & ne)
      for (l = l.child; l !== null; )
        Im(
          l,
          t,
          a
        ), l = l.sibling;
  }
  function Im(l, t, a) {
    switch (l.tag) {
      case 26:
        ou(
          l,
          t,
          a
        ), l.flags & ne && l.memoizedState !== null && Ch(
          a,
          rt,
          l.memoizedState,
          l.memoizedProps
        );
        break;
      case 5:
        ou(
          l,
          t,
          a
        );
        break;
      case 3:
      case 4:
        var u = rt;
        rt = Mn(l.stateNode.containerInfo), ou(
          l,
          t,
          a
        ), rt = u;
        break;
      case 22:
        l.memoizedState === null && (u = l.alternate, u !== null && u.memoizedState !== null ? (u = ne, ne = 16777216, ou(
          l,
          t,
          a
        ), ne = u) : ou(
          l,
          t,
          a
        ));
        break;
      default:
        ou(
          l,
          t,
          a
        );
    }
  }
  function Pm(l) {
    var t = l.alternate;
    if (t !== null && (l = t.child, l !== null)) {
      t.child = null;
      do
        t = l.sibling, l.sibling = null, l = t;
      while (l !== null);
    }
  }
  function fe(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var a = 0; a < t.length; a++) {
          var u = t[a];
          _l = u, ty(
            u,
            l
          );
        }
      Pm(l);
    }
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; )
        ly(l), l = l.sibling;
  }
  function ly(l) {
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        fe(l), l.flags & 2048 && ia(9, l, l.return);
        break;
      case 3:
        fe(l);
        break;
      case 12:
        fe(l);
        break;
      case 22:
        var t = l.stateNode;
        l.memoizedState !== null && t._visibility & 2 && (l.return === null || l.return.tag !== 13) ? (t._visibility &= -3, hn(l)) : fe(l);
        break;
      default:
        fe(l);
    }
  }
  function hn(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var a = 0; a < t.length; a++) {
          var u = t[a];
          _l = u, ty(
            u,
            l
          );
        }
      Pm(l);
    }
    for (l = l.child; l !== null; ) {
      switch (t = l, t.tag) {
        case 0:
        case 11:
        case 15:
          ia(8, t, t.return), hn(t);
          break;
        case 22:
          a = t.stateNode, a._visibility & 2 && (a._visibility &= -3, hn(t));
          break;
        default:
          hn(t);
      }
      l = l.sibling;
    }
  }
  function ty(l, t) {
    for (; _l !== null; ) {
      var a = _l;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          ia(8, a, t);
          break;
        case 23:
        case 22:
          if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
            var u = a.memoizedState.cachePool.pool;
            u != null && u.refCount++;
          }
          break;
        case 24:
          Lu(a.memoizedState.cache);
      }
      if (u = a.child, u !== null) u.return = a, _l = u;
      else
        l: for (a = l; _l !== null; ) {
          u = _l;
          var e = u.sibling, n = u.return;
          if (Km(u), u === a) {
            _l = null;
            break l;
          }
          if (e !== null) {
            e.return = n, _l = e;
            break l;
          }
          _l = n;
        }
    }
  }
  var ws = {
    getCacheForType: function(l) {
      var t = Nl(bl), a = t.data.get(l);
      return a === void 0 && (a = l(), t.data.set(l, a)), a;
    },
    cacheSignal: function() {
      return Nl(bl).controller.signal;
    }
  }, Ws = typeof WeakMap == "function" ? WeakMap : Map, k = 0, cl = null, Z = null, L = 0, ll = 0, et = null, ma = !1, gu = !1, Ac = !1, Jt = 0, dl = 0, ya = 0, ja = 0, _c = 0, nt = 0, Su = 0, ce = null, Wl = null, Oc = !1, dn = 0, ay = 0, on = 1 / 0, gn = null, va = null, Tl = 0, sa = null, bu = null, wt = 0, Mc = 0, Dc = null, uy = null, ie = 0, Uc = null;
  function ft() {
    return (k & 2) !== 0 && L !== 0 ? L & -L : b.T !== null ? Rc() : Ei();
  }
  function ey() {
    if (nt === 0)
      if ((L & 536870912) === 0 || J) {
        var l = Ae;
        Ae <<= 1, (Ae & 3932160) === 0 && (Ae = 262144), nt = l;
      } else nt = 536870912;
    return l = at.current, l !== null && (l.flags |= 32), nt;
  }
  function $l(l, t, a) {
    (l === cl && (ll === 2 || ll === 9) || l.cancelPendingCommit !== null) && (Eu(l, 0), ha(
      l,
      L,
      nt,
      !1
    )), pu(l, a), ((k & 2) === 0 || l !== cl) && (l === cl && ((k & 2) === 0 && (ja |= a), dl === 4 && ha(
      l,
      L,
      nt,
      !1
    )), pt(l));
  }
  function ny(l, t, a) {
    if ((k & 6) !== 0) throw Error(o(327));
    var u = !a && (t & 127) === 0 && (t & l.expiredLanes) === 0 || Uu(l, t), e = u ? Fs(l, t) : Nc(l, t, !0), n = u;
    do {
      if (e === 0) {
        gu && !u && ha(l, t, 0, !1);
        break;
      } else {
        if (a = l.current.alternate, n && !$s(a)) {
          e = Nc(l, t, !1), n = !1;
          continue;
        }
        if (e === 2) {
          if (n = t, l.errorRecoveryDisabledLanes & n)
            var f = 0;
          else
            f = l.pendingLanes & -536870913, f = f !== 0 ? f : f & 536870912 ? 536870912 : 0;
          if (f !== 0) {
            t = f;
            l: {
              var c = l;
              e = ce;
              var i = c.current.memoizedState.isDehydrated;
              if (i && (Eu(c, f).flags |= 256), f = Nc(
                c,
                f,
                !1
              ), f !== 2) {
                if (Ac && !i) {
                  c.errorRecoveryDisabledLanes |= n, ja |= n, e = 4;
                  break l;
                }
                n = Wl, Wl = e, n !== null && (Wl === null ? Wl = n : Wl.push.apply(
                  Wl,
                  n
                ));
              }
              e = f;
            }
            if (n = !1, e !== 2) continue;
          }
        }
        if (e === 1) {
          Eu(l, 0), ha(l, t, 0, !0);
          break;
        }
        l: {
          switch (u = l, n = e, n) {
            case 0:
            case 1:
              throw Error(o(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              ha(
                u,
                t,
                nt,
                !ma
              );
              break l;
            case 2:
              Wl = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && (e = dn + 300 - Fl(), 10 < e)) {
            if (ha(
              u,
              t,
              nt,
              !ma
            ), Oe(u, 0, !0) !== 0) break l;
            wt = t, u.timeoutHandle = Yy(
              fy.bind(
                null,
                u,
                a,
                Wl,
                gn,
                Oc,
                t,
                nt,
                ja,
                Su,
                ma,
                n,
                "Throttled",
                -0,
                0
              ),
              e
            );
            break l;
          }
          fy(
            u,
            a,
            Wl,
            gn,
            Oc,
            t,
            nt,
            ja,
            Su,
            ma,
            n,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    pt(l);
  }
  function fy(l, t, a, u, e, n, f, c, i, h, S, z, d, g) {
    if (l.timeoutHandle = -1, z = t.subtreeFlags, z & 8192 || (z & 16785408) === 16785408) {
      z = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Ct
      }, Im(
        t,
        n,
        z
      );
      var U = (n & 62914560) === n ? dn - Fl() : (n & 4194048) === n ? ay - Fl() : 0;
      if (U = qh(
        z,
        U
      ), U !== null) {
        wt = n, l.cancelPendingCommit = U(
          dy.bind(
            null,
            l,
            t,
            n,
            a,
            u,
            e,
            f,
            c,
            i,
            S,
            z,
            null,
            d,
            g
          )
        ), ha(l, n, f, !h);
        return;
      }
    }
    dy(
      l,
      t,
      n,
      a,
      u,
      e,
      f,
      c,
      i
    );
  }
  function $s(l) {
    for (var t = l; ; ) {
      var a = t.tag;
      if ((a === 0 || a === 11 || a === 15) && t.flags & 16384 && (a = t.updateQueue, a !== null && (a = a.stores, a !== null)))
        for (var u = 0; u < a.length; u++) {
          var e = a[u], n = e.getSnapshot;
          e = e.value;
          try {
            if (!lt(n(), e)) return !1;
          } catch {
            return !1;
          }
        }
      if (a = t.child, t.subtreeFlags & 16384 && a !== null)
        a.return = t, t = a;
      else {
        if (t === l) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === l) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function ha(l, t, a, u) {
    t &= ~_c, t &= ~ja, l.suspendedLanes |= t, l.pingedLanes &= ~t, u && (l.warmLanes |= t), u = l.expirationTimes;
    for (var e = t; 0 < e; ) {
      var n = 31 - Pl(e), f = 1 << n;
      u[n] = -1, e &= ~f;
    }
    a !== 0 && gi(l, a, t);
  }
  function Sn() {
    return (k & 6) === 0 ? (me(0), !1) : !0;
  }
  function pc() {
    if (Z !== null) {
      if (ll === 0)
        var l = Z.return;
      else
        l = Z, Yt = Ha = null, Kf(l), mu = null, Ku = 0, l = Z;
      for (; l !== null; )
        Gm(l.alternate, l), l = l.return;
      Z = null;
    }
  }
  function Eu(l, t) {
    var a = l.timeoutHandle;
    a !== -1 && (l.timeoutHandle = -1, oh(a)), a = l.cancelPendingCommit, a !== null && (l.cancelPendingCommit = null, a()), wt = 0, pc(), cl = l, Z = a = Rt(l.current, null), L = t, ll = 0, et = null, ma = !1, gu = Uu(l, t), Ac = !1, Su = nt = _c = ja = ya = dl = 0, Wl = ce = null, Oc = !1, (t & 8) !== 0 && (t |= t & 32);
    var u = l.entangledLanes;
    if (u !== 0)
      for (l = l.entanglements, u &= t; 0 < u; ) {
        var e = 31 - Pl(u), n = 1 << e;
        t |= l[e], u &= ~n;
      }
    return Jt = t, Ge(), a;
  }
  function cy(l, t) {
    X = null, b.H = Pu, t === iu || t === Ke ? (t = A0(), ll = 3) : t === qf ? (t = A0(), ll = 4) : ll = t === cc ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, et = t, Z === null && (dl = 1, nn(
      l,
      vt(t, l.current)
    ));
  }
  function iy() {
    var l = at.current;
    return l === null ? !0 : (L & 4194048) === L ? ot === null : (L & 62914560) === L || (L & 536870912) !== 0 ? l === ot : !1;
  }
  function my() {
    var l = b.H;
    return b.H = Pu, l === null ? Pu : l;
  }
  function yy() {
    var l = b.A;
    return b.A = ws, l;
  }
  function bn() {
    dl = 4, ma || (L & 4194048) !== L && at.current !== null || (gu = !0), (ya & 134217727) === 0 && (ja & 134217727) === 0 || cl === null || ha(
      cl,
      L,
      nt,
      !1
    );
  }
  function Nc(l, t, a) {
    var u = k;
    k |= 2;
    var e = my(), n = yy();
    (cl !== l || L !== t) && (gn = null, Eu(l, t)), t = !1;
    var f = dl;
    l: do
      try {
        if (ll !== 0 && Z !== null) {
          var c = Z, i = et;
          switch (ll) {
            case 8:
              pc(), f = 6;
              break l;
            case 3:
            case 2:
            case 9:
            case 6:
              at.current === null && (t = !0);
              var h = ll;
              if (ll = 0, et = null, zu(l, c, i, h), a && gu) {
                f = 0;
                break l;
              }
              break;
            default:
              h = ll, ll = 0, et = null, zu(l, c, i, h);
          }
        }
        ks(), f = dl;
        break;
      } catch (S) {
        cy(l, S);
      }
    while (!0);
    return t && l.shellSuspendCounter++, Yt = Ha = null, k = u, b.H = e, b.A = n, Z === null && (cl = null, L = 0, Ge()), f;
  }
  function ks() {
    for (; Z !== null; ) vy(Z);
  }
  function Fs(l, t) {
    var a = k;
    k |= 2;
    var u = my(), e = yy();
    cl !== l || L !== t ? (gn = null, on = Fl() + 500, Eu(l, t)) : gu = Uu(
      l,
      t
    );
    l: do
      try {
        if (ll !== 0 && Z !== null) {
          t = Z;
          var n = et;
          t: switch (ll) {
            case 1:
              ll = 0, et = null, zu(l, t, n, 1);
              break;
            case 2:
            case 9:
              if (r0(n)) {
                ll = 0, et = null, sy(t);
                break;
              }
              t = function() {
                ll !== 2 && ll !== 9 || cl !== l || (ll = 7), pt(l);
              }, n.then(t, t);
              break l;
            case 3:
              ll = 7;
              break l;
            case 4:
              ll = 5;
              break l;
            case 7:
              r0(n) ? (ll = 0, et = null, sy(t)) : (ll = 0, et = null, zu(l, t, n, 7));
              break;
            case 5:
              var f = null;
              switch (Z.tag) {
                case 26:
                  f = Z.memoizedState;
                case 5:
                case 27:
                  var c = Z;
                  if (f ? Fy(f) : c.stateNode.complete) {
                    ll = 0, et = null;
                    var i = c.sibling;
                    if (i !== null) Z = i;
                    else {
                      var h = c.return;
                      h !== null ? (Z = h, En(h)) : Z = null;
                    }
                    break t;
                  }
              }
              ll = 0, et = null, zu(l, t, n, 5);
              break;
            case 6:
              ll = 0, et = null, zu(l, t, n, 6);
              break;
            case 8:
              pc(), dl = 6;
              break l;
            default:
              throw Error(o(462));
          }
        }
        Is();
        break;
      } catch (S) {
        cy(l, S);
      }
    while (!0);
    return Yt = Ha = null, b.H = u, b.A = e, k = a, Z !== null ? 0 : (cl = null, L = 0, Ge(), dl);
  }
  function Is() {
    for (; Z !== null && !rv(); )
      vy(Z);
  }
  function vy(l) {
    var t = Bm(l.alternate, l, Jt);
    l.memoizedProps = l.pendingProps, t === null ? En(l) : Z = t;
  }
  function sy(l) {
    var t = l, a = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = pm(
          a,
          t,
          t.pendingProps,
          t.type,
          void 0,
          L
        );
        break;
      case 11:
        t = pm(
          a,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          L
        );
        break;
      case 5:
        Kf(t);
      default:
        Gm(a, t), t = Z = y0(t, Jt), t = Bm(a, t, Jt);
    }
    l.memoizedProps = l.pendingProps, t === null ? En(l) : Z = t;
  }
  function zu(l, t, a, u) {
    Yt = Ha = null, Kf(t), mu = null, Ku = 0;
    var e = t.return;
    try {
      if (js(
        l,
        e,
        t,
        a,
        L
      )) {
        dl = 1, nn(
          l,
          vt(a, l.current)
        ), Z = null;
        return;
      }
    } catch (n) {
      if (e !== null) throw Z = e, n;
      dl = 1, nn(
        l,
        vt(a, l.current)
      ), Z = null;
      return;
    }
    t.flags & 32768 ? (J || u === 1 ? l = !0 : gu || (L & 536870912) !== 0 ? l = !1 : (ma = l = !0, (u === 2 || u === 9 || u === 3 || u === 6) && (u = at.current, u !== null && u.tag === 13 && (u.flags |= 16384))), hy(t, l)) : En(t);
  }
  function En(l) {
    var t = l;
    do {
      if ((t.flags & 32768) !== 0) {
        hy(
          t,
          ma
        );
        return;
      }
      l = t.return;
      var a = Ls(
        t.alternate,
        t,
        Jt
      );
      if (a !== null) {
        Z = a;
        return;
      }
      if (t = t.sibling, t !== null) {
        Z = t;
        return;
      }
      Z = t = l;
    } while (t !== null);
    dl === 0 && (dl = 5);
  }
  function hy(l, t) {
    do {
      var a = xs(l.alternate, l);
      if (a !== null) {
        a.flags &= 32767, Z = a;
        return;
      }
      if (a = l.return, a !== null && (a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null), !t && (l = l.sibling, l !== null)) {
        Z = l;
        return;
      }
      Z = l = a;
    } while (l !== null);
    dl = 6, Z = null;
  }
  function dy(l, t, a, u, e, n, f, c, i) {
    l.cancelPendingCommit = null;
    do
      zn();
    while (Tl !== 0);
    if ((k & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === l.current) throw Error(o(177));
      if (n = t.lanes | t.childLanes, n |= bf, Hv(
        l,
        a,
        n,
        f,
        c,
        i
      ), l === cl && (Z = cl = null, L = 0), bu = t, sa = l, wt = a, Mc = n, Dc = e, uy = u, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (l.callbackNode = null, l.callbackPriority = 0, ah(re, function() {
        return Ey(), null;
      })) : (l.callbackNode = null, l.callbackPriority = 0), u = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || u) {
        u = b.T, b.T = null, e = O.p, O.p = 2, f = k, k |= 4;
        try {
          Ks(l, t, a);
        } finally {
          k = f, O.p = e, b.T = u;
        }
      }
      Tl = 1, oy(), gy(), Sy();
    }
  }
  function oy() {
    if (Tl === 1) {
      Tl = 0;
      var l = sa, t = bu, a = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || a) {
        a = b.T, b.T = null;
        var u = O.p;
        O.p = 2;
        var e = k;
        k |= 4;
        try {
          $m(t, l);
          var n = Vc, f = t0(l.containerInfo), c = n.focusedElem, i = n.selectionRange;
          if (f !== c && c && c.ownerDocument && l0(
            c.ownerDocument.documentElement,
            c
          )) {
            if (i !== null && hf(c)) {
              var h = i.start, S = i.end;
              if (S === void 0 && (S = h), "selectionStart" in c)
                c.selectionStart = h, c.selectionEnd = Math.min(
                  S,
                  c.value.length
                );
              else {
                var z = c.ownerDocument || document, d = z && z.defaultView || window;
                if (d.getSelection) {
                  var g = d.getSelection(), U = c.textContent.length, R = Math.min(i.start, U), nl = i.end === void 0 ? R : Math.min(i.end, U);
                  !g.extend && R > nl && (f = nl, nl = R, R = f);
                  var v = Pi(
                    c,
                    R
                  ), m = Pi(
                    c,
                    nl
                  );
                  if (v && m && (g.rangeCount !== 1 || g.anchorNode !== v.node || g.anchorOffset !== v.offset || g.focusNode !== m.node || g.focusOffset !== m.offset)) {
                    var s = z.createRange();
                    s.setStart(v.node, v.offset), g.removeAllRanges(), R > nl ? (g.addRange(s), g.extend(m.node, m.offset)) : (s.setEnd(m.node, m.offset), g.addRange(s));
                  }
                }
              }
            }
            for (z = [], g = c; g = g.parentNode; )
              g.nodeType === 1 && z.push({
                element: g,
                left: g.scrollLeft,
                top: g.scrollTop
              });
            for (typeof c.focus == "function" && c.focus(), c = 0; c < z.length; c++) {
              var E = z[c];
              E.element.scrollLeft = E.left, E.element.scrollTop = E.top;
            }
          }
          Cn = !!Zc, Vc = Zc = null;
        } finally {
          k = e, O.p = u, b.T = a;
        }
      }
      l.current = t, Tl = 2;
    }
  }
  function gy() {
    if (Tl === 2) {
      Tl = 0;
      var l = sa, t = bu, a = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || a) {
        a = b.T, b.T = null;
        var u = O.p;
        O.p = 2;
        var e = k;
        k |= 4;
        try {
          xm(l, t.alternate, t);
        } finally {
          k = e, O.p = u, b.T = a;
        }
      }
      Tl = 3;
    }
  }
  function Sy() {
    if (Tl === 4 || Tl === 3) {
      Tl = 0, Tv();
      var l = sa, t = bu, a = wt, u = uy;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? Tl = 5 : (Tl = 0, bu = sa = null, by(l, l.pendingLanes));
      var e = l.pendingLanes;
      if (e === 0 && (va = null), wn(a), t = t.stateNode, Il && typeof Il.onCommitFiberRoot == "function")
        try {
          Il.onCommitFiberRoot(
            Du,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (u !== null) {
        t = b.T, e = O.p, O.p = 2, b.T = null;
        try {
          for (var n = l.onRecoverableError, f = 0; f < u.length; f++) {
            var c = u[f];
            n(c.value, {
              componentStack: c.stack
            });
          }
        } finally {
          b.T = t, O.p = e;
        }
      }
      (wt & 3) !== 0 && zn(), pt(l), e = l.pendingLanes, (a & 261930) !== 0 && (e & 42) !== 0 ? l === Uc ? ie++ : (ie = 0, Uc = l) : ie = 0, me(0);
    }
  }
  function by(l, t) {
    (l.pooledCacheLanes &= t) === 0 && (t = l.pooledCache, t != null && (l.pooledCache = null, Lu(t)));
  }
  function zn() {
    return oy(), gy(), Sy(), Ey();
  }
  function Ey() {
    if (Tl !== 5) return !1;
    var l = sa, t = Mc;
    Mc = 0;
    var a = wn(wt), u = b.T, e = O.p;
    try {
      O.p = 32 > a ? 32 : a, b.T = null, a = Dc, Dc = null;
      var n = sa, f = wt;
      if (Tl = 0, bu = sa = null, wt = 0, (k & 6) !== 0) throw Error(o(331));
      var c = k;
      if (k |= 4, ly(n.current), Fm(
        n,
        n.current,
        f,
        a
      ), k = c, me(0, !1), Il && typeof Il.onPostCommitFiberRoot == "function")
        try {
          Il.onPostCommitFiberRoot(Du, n);
        } catch {
        }
      return !0;
    } finally {
      O.p = e, b.T = u, by(l, t);
    }
  }
  function zy(l, t, a) {
    t = vt(a, t), t = fc(l.stateNode, t, 2), l = na(l, t, 2), l !== null && (pu(l, 2), pt(l));
  }
  function tl(l, t, a) {
    if (l.tag === 3)
      zy(l, l, a);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          zy(
            t,
            l,
            a
          );
          break;
        } else if (t.tag === 1) {
          var u = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof u.componentDidCatch == "function" && (va === null || !va.has(u))) {
            l = vt(a, l), a = rm(2), u = na(t, a, 2), u !== null && (Tm(
              a,
              u,
              t,
              l
            ), pu(u, 2), pt(u));
            break;
          }
        }
        t = t.return;
      }
  }
  function Hc(l, t, a) {
    var u = l.pingCache;
    if (u === null) {
      u = l.pingCache = new Ws();
      var e = /* @__PURE__ */ new Set();
      u.set(t, e);
    } else
      e = u.get(t), e === void 0 && (e = /* @__PURE__ */ new Set(), u.set(t, e));
    e.has(a) || (Ac = !0, e.add(a), l = Ps.bind(null, l, t, a), t.then(l, l));
  }
  function Ps(l, t, a) {
    var u = l.pingCache;
    u !== null && u.delete(t), l.pingedLanes |= l.suspendedLanes & a, l.warmLanes &= ~a, cl === l && (L & a) === a && (dl === 4 || dl === 3 && (L & 62914560) === L && 300 > Fl() - dn ? (k & 2) === 0 && Eu(l, 0) : _c |= a, Su === L && (Su = 0)), pt(l);
  }
  function ry(l, t) {
    t === 0 && (t = oi()), l = Ua(l, t), l !== null && (pu(l, t), pt(l));
  }
  function lh(l) {
    var t = l.memoizedState, a = 0;
    t !== null && (a = t.retryLane), ry(l, a);
  }
  function th(l, t) {
    var a = 0;
    switch (l.tag) {
      case 31:
      case 13:
        var u = l.stateNode, e = l.memoizedState;
        e !== null && (a = e.retryLane);
        break;
      case 19:
        u = l.stateNode;
        break;
      case 22:
        u = l.stateNode._retryCache;
        break;
      default:
        throw Error(o(314));
    }
    u !== null && u.delete(t), ry(l, a);
  }
  function ah(l, t) {
    return Ln(l, t);
  }
  var rn = null, ru = null, Cc = !1, Tn = !1, qc = !1, da = 0;
  function pt(l) {
    l !== ru && l.next === null && (ru === null ? rn = ru = l : ru = ru.next = l), Tn = !0, Cc || (Cc = !0, eh());
  }
  function me(l, t) {
    if (!qc && Tn) {
      qc = !0;
      do
        for (var a = !1, u = rn; u !== null; ) {
          if (l !== 0) {
            var e = u.pendingLanes;
            if (e === 0) var n = 0;
            else {
              var f = u.suspendedLanes, c = u.pingedLanes;
              n = (1 << 31 - Pl(42 | l) + 1) - 1, n &= e & ~(f & ~c), n = n & 201326741 ? n & 201326741 | 1 : n ? n | 2 : 0;
            }
            n !== 0 && (a = !0, Oy(u, n));
          } else
            n = L, n = Oe(
              u,
              u === cl ? n : 0,
              u.cancelPendingCommit !== null || u.timeoutHandle !== -1
            ), (n & 3) === 0 || Uu(u, n) || (a = !0, Oy(u, n));
          u = u.next;
        }
      while (a);
      qc = !1;
    }
  }
  function uh() {
    Ty();
  }
  function Ty() {
    Tn = Cc = !1;
    var l = 0;
    da !== 0 && dh() && (l = da);
    for (var t = Fl(), a = null, u = rn; u !== null; ) {
      var e = u.next, n = Ay(u, t);
      n === 0 ? (u.next = null, a === null ? rn = e : a.next = e, e === null && (ru = a)) : (a = u, (l !== 0 || (n & 3) !== 0) && (Tn = !0)), u = e;
    }
    Tl !== 0 && Tl !== 5 || me(l), da !== 0 && (da = 0);
  }
  function Ay(l, t) {
    for (var a = l.suspendedLanes, u = l.pingedLanes, e = l.expirationTimes, n = l.pendingLanes & -62914561; 0 < n; ) {
      var f = 31 - Pl(n), c = 1 << f, i = e[f];
      i === -1 ? ((c & a) === 0 || (c & u) !== 0) && (e[f] = Nv(c, t)) : i <= t && (l.expiredLanes |= c), n &= ~c;
    }
    if (t = cl, a = L, a = Oe(
      l,
      l === t ? a : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), u = l.callbackNode, a === 0 || l === t && (ll === 2 || ll === 9) || l.cancelPendingCommit !== null)
      return u !== null && u !== null && xn(u), l.callbackNode = null, l.callbackPriority = 0;
    if ((a & 3) === 0 || Uu(l, a)) {
      if (t = a & -a, t === l.callbackPriority) return t;
      switch (u !== null && xn(u), wn(a)) {
        case 2:
        case 8:
          a = hi;
          break;
        case 32:
          a = re;
          break;
        case 268435456:
          a = di;
          break;
        default:
          a = re;
      }
      return u = _y.bind(null, l), a = Ln(a, u), l.callbackPriority = t, l.callbackNode = a, t;
    }
    return u !== null && u !== null && xn(u), l.callbackPriority = 2, l.callbackNode = null, 2;
  }
  function _y(l, t) {
    if (Tl !== 0 && Tl !== 5)
      return l.callbackNode = null, l.callbackPriority = 0, null;
    var a = l.callbackNode;
    if (zn() && l.callbackNode !== a)
      return null;
    var u = L;
    return u = Oe(
      l,
      l === cl ? u : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), u === 0 ? null : (ny(l, u, t), Ay(l, Fl()), l.callbackNode != null && l.callbackNode === a ? _y.bind(null, l) : null);
  }
  function Oy(l, t) {
    if (zn()) return null;
    ny(l, t, !0);
  }
  function eh() {
    gh(function() {
      (k & 6) !== 0 ? Ln(
        si,
        uh
      ) : Ty();
    });
  }
  function Rc() {
    if (da === 0) {
      var l = fu;
      l === 0 && (l = Te, Te <<= 1, (Te & 261888) === 0 && (Te = 256)), da = l;
    }
    return da;
  }
  function My(l) {
    return l == null || typeof l == "symbol" || typeof l == "boolean" ? null : typeof l == "function" ? l : pe("" + l);
  }
  function Dy(l, t) {
    var a = t.ownerDocument.createElement("input");
    return a.name = t.name, a.value = t.value, l.id && a.setAttribute("form", l.id), t.parentNode.insertBefore(a, t), l = new FormData(l), a.parentNode.removeChild(a), l;
  }
  function nh(l, t, a, u, e) {
    if (t === "submit" && a && a.stateNode === e) {
      var n = My(
        (e[Ll] || null).action
      ), f = u.submitter;
      f && (t = (t = f[Ll] || null) ? My(t.formAction) : f.getAttribute("formAction"), t !== null && (n = t, f = null));
      var c = new qe(
        "action",
        "action",
        null,
        u,
        e
      );
      l.push({
        event: c,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (u.defaultPrevented) {
                if (da !== 0) {
                  var i = f ? Dy(e, f) : new FormData(e);
                  lc(
                    a,
                    {
                      pending: !0,
                      data: i,
                      method: e.method,
                      action: n
                    },
                    null,
                    i
                  );
                }
              } else
                typeof n == "function" && (c.preventDefault(), i = f ? Dy(e, f) : new FormData(e), lc(
                  a,
                  {
                    pending: !0,
                    data: i,
                    method: e.method,
                    action: n
                  },
                  n,
                  i
                ));
            },
            currentTarget: e
          }
        ]
      });
    }
  }
  for (var Bc = 0; Bc < Sf.length; Bc++) {
    var Yc = Sf[Bc], fh = Yc.toLowerCase(), ch = Yc[0].toUpperCase() + Yc.slice(1);
    zt(
      fh,
      "on" + ch
    );
  }
  zt(e0, "onAnimationEnd"), zt(n0, "onAnimationIteration"), zt(f0, "onAnimationStart"), zt("dblclick", "onDoubleClick"), zt("focusin", "onFocus"), zt("focusout", "onBlur"), zt(As, "onTransitionRun"), zt(_s, "onTransitionStart"), zt(Os, "onTransitionCancel"), zt(c0, "onTransitionEnd"), Ja("onMouseEnter", ["mouseout", "mouseover"]), Ja("onMouseLeave", ["mouseout", "mouseover"]), Ja("onPointerEnter", ["pointerout", "pointerover"]), Ja("onPointerLeave", ["pointerout", "pointerover"]), _a(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), _a(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), _a("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), _a(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), _a(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), _a(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var ye = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), ih = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(ye)
  );
  function Uy(l, t) {
    t = (t & 4) !== 0;
    for (var a = 0; a < l.length; a++) {
      var u = l[a], e = u.event;
      u = u.listeners;
      l: {
        var n = void 0;
        if (t)
          for (var f = u.length - 1; 0 <= f; f--) {
            var c = u[f], i = c.instance, h = c.currentTarget;
            if (c = c.listener, i !== n && e.isPropagationStopped())
              break l;
            n = c, e.currentTarget = h;
            try {
              n(e);
            } catch (S) {
              Ye(S);
            }
            e.currentTarget = null, n = i;
          }
        else
          for (f = 0; f < u.length; f++) {
            if (c = u[f], i = c.instance, h = c.currentTarget, c = c.listener, i !== n && e.isPropagationStopped())
              break l;
            n = c, e.currentTarget = h;
            try {
              n(e);
            } catch (S) {
              Ye(S);
            }
            e.currentTarget = null, n = i;
          }
      }
    }
  }
  function V(l, t) {
    var a = t[Wn];
    a === void 0 && (a = t[Wn] = /* @__PURE__ */ new Set());
    var u = l + "__bubble";
    a.has(u) || (py(t, l, 2, !1), a.add(u));
  }
  function Gc(l, t, a) {
    var u = 0;
    t && (u |= 4), py(
      a,
      l,
      u,
      t
    );
  }
  var An = "_reactListening" + Math.random().toString(36).slice(2);
  function Xc(l) {
    if (!l[An]) {
      l[An] = !0, Ti.forEach(function(a) {
        a !== "selectionchange" && (ih.has(a) || Gc(a, !1, l), Gc(a, !0, l));
      });
      var t = l.nodeType === 9 ? l : l.ownerDocument;
      t === null || t[An] || (t[An] = !0, Gc("selectionchange", !1, t));
    }
  }
  function py(l, t, a, u) {
    switch (ev(t)) {
      case 2:
        var e = Yh;
        break;
      case 8:
        e = Gh;
        break;
      default:
        e = Pc;
    }
    a = e.bind(
      null,
      t,
      a,
      l
    ), e = void 0, !uf || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (e = !0), u ? e !== void 0 ? l.addEventListener(t, a, {
      capture: !0,
      passive: e
    }) : l.addEventListener(t, a, !0) : e !== void 0 ? l.addEventListener(t, a, {
      passive: e
    }) : l.addEventListener(t, a, !1);
  }
  function Qc(l, t, a, u, e) {
    var n = u;
    if ((t & 1) === 0 && (t & 2) === 0 && u !== null)
      l: for (; ; ) {
        if (u === null) return;
        var f = u.tag;
        if (f === 3 || f === 4) {
          var c = u.stateNode.containerInfo;
          if (c === e) break;
          if (f === 4)
            for (f = u.return; f !== null; ) {
              var i = f.tag;
              if ((i === 3 || i === 4) && f.stateNode.containerInfo === e)
                return;
              f = f.return;
            }
          for (; c !== null; ) {
            if (f = La(c), f === null) return;
            if (i = f.tag, i === 5 || i === 6 || i === 26 || i === 27) {
              u = n = f;
              continue l;
            }
            c = c.parentNode;
          }
        }
        u = u.return;
      }
    Ri(function() {
      var h = n, S = tf(a), z = [];
      l: {
        var d = i0.get(l);
        if (d !== void 0) {
          var g = qe, U = l;
          switch (l) {
            case "keypress":
              if (He(a) === 0) break l;
            case "keydown":
            case "keyup":
              g = ts;
              break;
            case "focusin":
              U = "focus", g = cf;
              break;
            case "focusout":
              U = "blur", g = cf;
              break;
            case "beforeblur":
            case "afterblur":
              g = cf;
              break;
            case "click":
              if (a.button === 2) break l;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              g = Gi;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              g = Lv;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              g = es;
              break;
            case e0:
            case n0:
            case f0:
              g = Jv;
              break;
            case c0:
              g = fs;
              break;
            case "scroll":
            case "scrollend":
              g = Zv;
              break;
            case "wheel":
              g = is;
              break;
            case "copy":
            case "cut":
            case "paste":
              g = Wv;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              g = Qi;
              break;
            case "toggle":
            case "beforetoggle":
              g = ys;
          }
          var R = (t & 4) !== 0, nl = !R && (l === "scroll" || l === "scrollend"), v = R ? d !== null ? d + "Capture" : null : d;
          R = [];
          for (var m = h, s; m !== null; ) {
            var E = m;
            if (s = E.stateNode, E = E.tag, E !== 5 && E !== 26 && E !== 27 || s === null || v === null || (E = Cu(m, v), E != null && R.push(
              ve(m, E, s)
            )), nl) break;
            m = m.return;
          }
          0 < R.length && (d = new g(
            d,
            U,
            null,
            a,
            S
          ), z.push({ event: d, listeners: R }));
        }
      }
      if ((t & 7) === 0) {
        l: {
          if (d = l === "mouseover" || l === "pointerover", g = l === "mouseout" || l === "pointerout", d && a !== lf && (U = a.relatedTarget || a.fromElement) && (La(U) || U[Va]))
            break l;
          if ((g || d) && (d = S.window === S ? S : (d = S.ownerDocument) ? d.defaultView || d.parentWindow : window, g ? (U = a.relatedTarget || a.toElement, g = h, U = U ? La(U) : null, U !== null && (nl = Ql(U), R = U.tag, U !== nl || R !== 5 && R !== 27 && R !== 6) && (U = null)) : (g = null, U = h), g !== U)) {
            if (R = Gi, E = "onMouseLeave", v = "onMouseEnter", m = "mouse", (l === "pointerout" || l === "pointerover") && (R = Qi, E = "onPointerLeave", v = "onPointerEnter", m = "pointer"), nl = g == null ? d : Hu(g), s = U == null ? d : Hu(U), d = new R(
              E,
              m + "leave",
              g,
              a,
              S
            ), d.target = nl, d.relatedTarget = s, E = null, La(S) === h && (R = new R(
              v,
              m + "enter",
              U,
              a,
              S
            ), R.target = s, R.relatedTarget = nl, E = R), nl = E, g && U)
              t: {
                for (R = mh, v = g, m = U, s = 0, E = v; E; E = R(E))
                  s++;
                E = 0;
                for (var C = m; C; C = R(C))
                  E++;
                for (; 0 < s - E; )
                  v = R(v), s--;
                for (; 0 < E - s; )
                  m = R(m), E--;
                for (; s--; ) {
                  if (v === m || m !== null && v === m.alternate) {
                    R = v;
                    break t;
                  }
                  v = R(v), m = R(m);
                }
                R = null;
              }
            else R = null;
            g !== null && Ny(
              z,
              d,
              g,
              R,
              !1
            ), U !== null && nl !== null && Ny(
              z,
              nl,
              U,
              R,
              !0
            );
          }
        }
        l: {
          if (d = h ? Hu(h) : window, g = d.nodeName && d.nodeName.toLowerCase(), g === "select" || g === "input" && d.type === "file")
            var W = wi;
          else if (Ki(d))
            if (Wi)
              W = zs;
            else {
              W = bs;
              var N = Ss;
            }
          else
            g = d.nodeName, !g || g.toLowerCase() !== "input" || d.type !== "checkbox" && d.type !== "radio" ? h && Pn(h.elementType) && (W = wi) : W = Es;
          if (W && (W = W(l, h))) {
            Ji(
              z,
              W,
              a,
              S
            );
            break l;
          }
          N && N(l, d, h), l === "focusout" && h && d.type === "number" && h.memoizedProps.value != null && In(d, "number", d.value);
        }
        switch (N = h ? Hu(h) : window, l) {
          case "focusin":
            (Ki(N) || N.contentEditable === "true") && (Ia = N, df = h, ju = null);
            break;
          case "focusout":
            ju = df = Ia = null;
            break;
          case "mousedown":
            of = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            of = !1, a0(z, a, S);
            break;
          case "selectionchange":
            if (Ts) break;
          case "keydown":
          case "keyup":
            a0(z, a, S);
        }
        var Q;
        if (yf)
          l: {
            switch (l) {
              case "compositionstart":
                var x = "onCompositionStart";
                break l;
              case "compositionend":
                x = "onCompositionEnd";
                break l;
              case "compositionupdate":
                x = "onCompositionUpdate";
                break l;
            }
            x = void 0;
          }
        else
          Fa ? Li(l, a) && (x = "onCompositionEnd") : l === "keydown" && a.keyCode === 229 && (x = "onCompositionStart");
        x && (ji && a.locale !== "ko" && (Fa || x !== "onCompositionStart" ? x === "onCompositionEnd" && Fa && (Q = Bi()) : (It = S, ef = "value" in It ? It.value : It.textContent, Fa = !0)), N = _n(h, x), 0 < N.length && (x = new Xi(
          x,
          l,
          null,
          a,
          S
        ), z.push({ event: x, listeners: N }), Q ? x.data = Q : (Q = xi(a), Q !== null && (x.data = Q)))), (Q = ss ? hs(l, a) : ds(l, a)) && (x = _n(h, "onBeforeInput"), 0 < x.length && (N = new Xi(
          "onBeforeInput",
          "beforeinput",
          null,
          a,
          S
        ), z.push({
          event: N,
          listeners: x
        }), N.data = Q)), nh(
          z,
          l,
          h,
          a,
          S
        );
      }
      Uy(z, t);
    });
  }
  function ve(l, t, a) {
    return {
      instance: l,
      listener: t,
      currentTarget: a
    };
  }
  function _n(l, t) {
    for (var a = t + "Capture", u = []; l !== null; ) {
      var e = l, n = e.stateNode;
      if (e = e.tag, e !== 5 && e !== 26 && e !== 27 || n === null || (e = Cu(l, a), e != null && u.unshift(
        ve(l, e, n)
      ), e = Cu(l, t), e != null && u.push(
        ve(l, e, n)
      )), l.tag === 3) return u;
      l = l.return;
    }
    return [];
  }
  function mh(l) {
    if (l === null) return null;
    do
      l = l.return;
    while (l && l.tag !== 5 && l.tag !== 27);
    return l || null;
  }
  function Ny(l, t, a, u, e) {
    for (var n = t._reactName, f = []; a !== null && a !== u; ) {
      var c = a, i = c.alternate, h = c.stateNode;
      if (c = c.tag, i !== null && i === u) break;
      c !== 5 && c !== 26 && c !== 27 || h === null || (i = h, e ? (h = Cu(a, n), h != null && f.unshift(
        ve(a, h, i)
      )) : e || (h = Cu(a, n), h != null && f.push(
        ve(a, h, i)
      ))), a = a.return;
    }
    f.length !== 0 && l.push({ event: t, listeners: f });
  }
  var yh = /\r\n?/g, vh = /\u0000|\uFFFD/g;
  function Hy(l) {
    return (typeof l == "string" ? l : "" + l).replace(yh, `
`).replace(vh, "");
  }
  function Cy(l, t) {
    return t = Hy(t), Hy(l) === t;
  }
  function el(l, t, a, u, e, n) {
    switch (a) {
      case "children":
        typeof u == "string" ? t === "body" || t === "textarea" && u === "" || Wa(l, u) : (typeof u == "number" || typeof u == "bigint") && t !== "body" && Wa(l, "" + u);
        break;
      case "className":
        De(l, "class", u);
        break;
      case "tabIndex":
        De(l, "tabindex", u);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        De(l, a, u);
        break;
      case "style":
        Ci(l, u, n);
        break;
      case "data":
        if (t !== "object") {
          De(l, "data", u);
          break;
        }
      case "src":
      case "href":
        if (u === "" && (t !== "a" || a !== "href")) {
          l.removeAttribute(a);
          break;
        }
        if (u == null || typeof u == "function" || typeof u == "symbol" || typeof u == "boolean") {
          l.removeAttribute(a);
          break;
        }
        u = pe("" + u), l.setAttribute(a, u);
        break;
      case "action":
      case "formAction":
        if (typeof u == "function") {
          l.setAttribute(
            a,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof n == "function" && (a === "formAction" ? (t !== "input" && el(l, t, "name", e.name, e, null), el(
            l,
            t,
            "formEncType",
            e.formEncType,
            e,
            null
          ), el(
            l,
            t,
            "formMethod",
            e.formMethod,
            e,
            null
          ), el(
            l,
            t,
            "formTarget",
            e.formTarget,
            e,
            null
          )) : (el(l, t, "encType", e.encType, e, null), el(l, t, "method", e.method, e, null), el(l, t, "target", e.target, e, null)));
        if (u == null || typeof u == "symbol" || typeof u == "boolean") {
          l.removeAttribute(a);
          break;
        }
        u = pe("" + u), l.setAttribute(a, u);
        break;
      case "onClick":
        u != null && (l.onclick = Ct);
        break;
      case "onScroll":
        u != null && V("scroll", l);
        break;
      case "onScrollEnd":
        u != null && V("scrollend", l);
        break;
      case "dangerouslySetInnerHTML":
        if (u != null) {
          if (typeof u != "object" || !("__html" in u))
            throw Error(o(61));
          if (a = u.__html, a != null) {
            if (e.children != null) throw Error(o(60));
            l.innerHTML = a;
          }
        }
        break;
      case "multiple":
        l.multiple = u && typeof u != "function" && typeof u != "symbol";
        break;
      case "muted":
        l.muted = u && typeof u != "function" && typeof u != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (u == null || typeof u == "function" || typeof u == "boolean" || typeof u == "symbol") {
          l.removeAttribute("xlink:href");
          break;
        }
        a = pe("" + u), l.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          a
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        u != null && typeof u != "function" && typeof u != "symbol" ? l.setAttribute(a, "" + u) : l.removeAttribute(a);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        u && typeof u != "function" && typeof u != "symbol" ? l.setAttribute(a, "") : l.removeAttribute(a);
        break;
      case "capture":
      case "download":
        u === !0 ? l.setAttribute(a, "") : u !== !1 && u != null && typeof u != "function" && typeof u != "symbol" ? l.setAttribute(a, u) : l.removeAttribute(a);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        u != null && typeof u != "function" && typeof u != "symbol" && !isNaN(u) && 1 <= u ? l.setAttribute(a, u) : l.removeAttribute(a);
        break;
      case "rowSpan":
      case "start":
        u == null || typeof u == "function" || typeof u == "symbol" || isNaN(u) ? l.removeAttribute(a) : l.setAttribute(a, u);
        break;
      case "popover":
        V("beforetoggle", l), V("toggle", l), Me(l, "popover", u);
        break;
      case "xlinkActuate":
        Ht(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          u
        );
        break;
      case "xlinkArcrole":
        Ht(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          u
        );
        break;
      case "xlinkRole":
        Ht(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          u
        );
        break;
      case "xlinkShow":
        Ht(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          u
        );
        break;
      case "xlinkTitle":
        Ht(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          u
        );
        break;
      case "xlinkType":
        Ht(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          u
        );
        break;
      case "xmlBase":
        Ht(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          u
        );
        break;
      case "xmlLang":
        Ht(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          u
        );
        break;
      case "xmlSpace":
        Ht(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          u
        );
        break;
      case "is":
        Me(l, "is", u);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < a.length) || a[0] !== "o" && a[0] !== "O" || a[1] !== "n" && a[1] !== "N") && (a = Qv.get(a) || a, Me(l, a, u));
    }
  }
  function jc(l, t, a, u, e, n) {
    switch (a) {
      case "style":
        Ci(l, u, n);
        break;
      case "dangerouslySetInnerHTML":
        if (u != null) {
          if (typeof u != "object" || !("__html" in u))
            throw Error(o(61));
          if (a = u.__html, a != null) {
            if (e.children != null) throw Error(o(60));
            l.innerHTML = a;
          }
        }
        break;
      case "children":
        typeof u == "string" ? Wa(l, u) : (typeof u == "number" || typeof u == "bigint") && Wa(l, "" + u);
        break;
      case "onScroll":
        u != null && V("scroll", l);
        break;
      case "onScrollEnd":
        u != null && V("scrollend", l);
        break;
      case "onClick":
        u != null && (l.onclick = Ct);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!Ai.hasOwnProperty(a))
          l: {
            if (a[0] === "o" && a[1] === "n" && (e = a.endsWith("Capture"), t = a.slice(2, e ? a.length - 7 : void 0), n = l[Ll] || null, n = n != null ? n[a] : null, typeof n == "function" && l.removeEventListener(t, n, e), typeof u == "function")) {
              typeof n != "function" && n !== null && (a in l ? l[a] = null : l.hasAttribute(a) && l.removeAttribute(a)), l.addEventListener(t, u, e);
              break l;
            }
            a in l ? l[a] = u : u === !0 ? l.setAttribute(a, "") : Me(l, a, u);
          }
    }
  }
  function Cl(l, t, a) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        V("error", l), V("load", l);
        var u = !1, e = !1, n;
        for (n in a)
          if (a.hasOwnProperty(n)) {
            var f = a[n];
            if (f != null)
              switch (n) {
                case "src":
                  u = !0;
                  break;
                case "srcSet":
                  e = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(o(137, t));
                default:
                  el(l, t, n, f, a, null);
              }
          }
        e && el(l, t, "srcSet", a.srcSet, a, null), u && el(l, t, "src", a.src, a, null);
        return;
      case "input":
        V("invalid", l);
        var c = n = f = e = null, i = null, h = null;
        for (u in a)
          if (a.hasOwnProperty(u)) {
            var S = a[u];
            if (S != null)
              switch (u) {
                case "name":
                  e = S;
                  break;
                case "type":
                  f = S;
                  break;
                case "checked":
                  i = S;
                  break;
                case "defaultChecked":
                  h = S;
                  break;
                case "value":
                  n = S;
                  break;
                case "defaultValue":
                  c = S;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (S != null)
                    throw Error(o(137, t));
                  break;
                default:
                  el(l, t, u, S, a, null);
              }
          }
        Ui(
          l,
          n,
          c,
          i,
          h,
          f,
          e,
          !1
        );
        return;
      case "select":
        V("invalid", l), u = f = n = null;
        for (e in a)
          if (a.hasOwnProperty(e) && (c = a[e], c != null))
            switch (e) {
              case "value":
                n = c;
                break;
              case "defaultValue":
                f = c;
                break;
              case "multiple":
                u = c;
              default:
                el(l, t, e, c, a, null);
            }
        t = n, a = f, l.multiple = !!u, t != null ? wa(l, !!u, t, !1) : a != null && wa(l, !!u, a, !0);
        return;
      case "textarea":
        V("invalid", l), n = e = u = null;
        for (f in a)
          if (a.hasOwnProperty(f) && (c = a[f], c != null))
            switch (f) {
              case "value":
                u = c;
                break;
              case "defaultValue":
                e = c;
                break;
              case "children":
                n = c;
                break;
              case "dangerouslySetInnerHTML":
                if (c != null) throw Error(o(91));
                break;
              default:
                el(l, t, f, c, a, null);
            }
        Ni(l, u, e, n);
        return;
      case "option":
        for (i in a)
          if (a.hasOwnProperty(i) && (u = a[i], u != null))
            switch (i) {
              case "selected":
                l.selected = u && typeof u != "function" && typeof u != "symbol";
                break;
              default:
                el(l, t, i, u, a, null);
            }
        return;
      case "dialog":
        V("beforetoggle", l), V("toggle", l), V("cancel", l), V("close", l);
        break;
      case "iframe":
      case "object":
        V("load", l);
        break;
      case "video":
      case "audio":
        for (u = 0; u < ye.length; u++)
          V(ye[u], l);
        break;
      case "image":
        V("error", l), V("load", l);
        break;
      case "details":
        V("toggle", l);
        break;
      case "embed":
      case "source":
      case "link":
        V("error", l), V("load", l);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (h in a)
          if (a.hasOwnProperty(h) && (u = a[h], u != null))
            switch (h) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, t));
              default:
                el(l, t, h, u, a, null);
            }
        return;
      default:
        if (Pn(t)) {
          for (S in a)
            a.hasOwnProperty(S) && (u = a[S], u !== void 0 && jc(
              l,
              t,
              S,
              u,
              a,
              void 0
            ));
          return;
        }
    }
    for (c in a)
      a.hasOwnProperty(c) && (u = a[c], u != null && el(l, t, c, u, a, null));
  }
  function sh(l, t, a, u) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var e = null, n = null, f = null, c = null, i = null, h = null, S = null;
        for (g in a) {
          var z = a[g];
          if (a.hasOwnProperty(g) && z != null)
            switch (g) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                i = z;
              default:
                u.hasOwnProperty(g) || el(l, t, g, null, u, z);
            }
        }
        for (var d in u) {
          var g = u[d];
          if (z = a[d], u.hasOwnProperty(d) && (g != null || z != null))
            switch (d) {
              case "type":
                n = g;
                break;
              case "name":
                e = g;
                break;
              case "checked":
                h = g;
                break;
              case "defaultChecked":
                S = g;
                break;
              case "value":
                f = g;
                break;
              case "defaultValue":
                c = g;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (g != null)
                  throw Error(o(137, t));
                break;
              default:
                g !== z && el(
                  l,
                  t,
                  d,
                  g,
                  u,
                  z
                );
            }
        }
        Fn(
          l,
          f,
          c,
          i,
          h,
          S,
          n,
          e
        );
        return;
      case "select":
        g = f = c = d = null;
        for (n in a)
          if (i = a[n], a.hasOwnProperty(n) && i != null)
            switch (n) {
              case "value":
                break;
              case "multiple":
                g = i;
              default:
                u.hasOwnProperty(n) || el(
                  l,
                  t,
                  n,
                  null,
                  u,
                  i
                );
            }
        for (e in u)
          if (n = u[e], i = a[e], u.hasOwnProperty(e) && (n != null || i != null))
            switch (e) {
              case "value":
                d = n;
                break;
              case "defaultValue":
                c = n;
                break;
              case "multiple":
                f = n;
              default:
                n !== i && el(
                  l,
                  t,
                  e,
                  n,
                  u,
                  i
                );
            }
        t = c, a = f, u = g, d != null ? wa(l, !!a, d, !1) : !!u != !!a && (t != null ? wa(l, !!a, t, !0) : wa(l, !!a, a ? [] : "", !1));
        return;
      case "textarea":
        g = d = null;
        for (c in a)
          if (e = a[c], a.hasOwnProperty(c) && e != null && !u.hasOwnProperty(c))
            switch (c) {
              case "value":
                break;
              case "children":
                break;
              default:
                el(l, t, c, null, u, e);
            }
        for (f in u)
          if (e = u[f], n = a[f], u.hasOwnProperty(f) && (e != null || n != null))
            switch (f) {
              case "value":
                d = e;
                break;
              case "defaultValue":
                g = e;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (e != null) throw Error(o(91));
                break;
              default:
                e !== n && el(l, t, f, e, u, n);
            }
        pi(l, d, g);
        return;
      case "option":
        for (var U in a)
          if (d = a[U], a.hasOwnProperty(U) && d != null && !u.hasOwnProperty(U))
            switch (U) {
              case "selected":
                l.selected = !1;
                break;
              default:
                el(
                  l,
                  t,
                  U,
                  null,
                  u,
                  d
                );
            }
        for (i in u)
          if (d = u[i], g = a[i], u.hasOwnProperty(i) && d !== g && (d != null || g != null))
            switch (i) {
              case "selected":
                l.selected = d && typeof d != "function" && typeof d != "symbol";
                break;
              default:
                el(
                  l,
                  t,
                  i,
                  d,
                  u,
                  g
                );
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var R in a)
          d = a[R], a.hasOwnProperty(R) && d != null && !u.hasOwnProperty(R) && el(l, t, R, null, u, d);
        for (h in u)
          if (d = u[h], g = a[h], u.hasOwnProperty(h) && d !== g && (d != null || g != null))
            switch (h) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (d != null)
                  throw Error(o(137, t));
                break;
              default:
                el(
                  l,
                  t,
                  h,
                  d,
                  u,
                  g
                );
            }
        return;
      default:
        if (Pn(t)) {
          for (var nl in a)
            d = a[nl], a.hasOwnProperty(nl) && d !== void 0 && !u.hasOwnProperty(nl) && jc(
              l,
              t,
              nl,
              void 0,
              u,
              d
            );
          for (S in u)
            d = u[S], g = a[S], !u.hasOwnProperty(S) || d === g || d === void 0 && g === void 0 || jc(
              l,
              t,
              S,
              d,
              u,
              g
            );
          return;
        }
    }
    for (var v in a)
      d = a[v], a.hasOwnProperty(v) && d != null && !u.hasOwnProperty(v) && el(l, t, v, null, u, d);
    for (z in u)
      d = u[z], g = a[z], !u.hasOwnProperty(z) || d === g || d == null && g == null || el(l, t, z, d, u, g);
  }
  function qy(l) {
    switch (l) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function hh() {
    if (typeof performance.getEntriesByType == "function") {
      for (var l = 0, t = 0, a = performance.getEntriesByType("resource"), u = 0; u < a.length; u++) {
        var e = a[u], n = e.transferSize, f = e.initiatorType, c = e.duration;
        if (n && c && qy(f)) {
          for (f = 0, c = e.responseEnd, u += 1; u < a.length; u++) {
            var i = a[u], h = i.startTime;
            if (h > c) break;
            var S = i.transferSize, z = i.initiatorType;
            S && qy(z) && (i = i.responseEnd, f += S * (i < c ? 1 : (c - h) / (i - h)));
          }
          if (--u, t += 8 * (n + f) / (e.duration / 1e3), l++, 10 < l) break;
        }
      }
      if (0 < l) return t / l / 1e6;
    }
    return navigator.connection && (l = navigator.connection.downlink, typeof l == "number") ? l : 5;
  }
  var Zc = null, Vc = null;
  function On(l) {
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  function Ry(l) {
    switch (l) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function By(l, t) {
    if (l === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return l === 1 && t === "foreignObject" ? 0 : l;
  }
  function Lc(l, t) {
    return l === "textarea" || l === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var xc = null;
  function dh() {
    var l = window.event;
    return l && l.type === "popstate" ? l === xc ? !1 : (xc = l, !0) : (xc = null, !1);
  }
  var Yy = typeof setTimeout == "function" ? setTimeout : void 0, oh = typeof clearTimeout == "function" ? clearTimeout : void 0, Gy = typeof Promise == "function" ? Promise : void 0, gh = typeof queueMicrotask == "function" ? queueMicrotask : typeof Gy < "u" ? function(l) {
    return Gy.resolve(null).then(l).catch(Sh);
  } : Yy;
  function Sh(l) {
    setTimeout(function() {
      throw l;
    });
  }
  function oa(l) {
    return l === "head";
  }
  function Xy(l, t) {
    var a = t, u = 0;
    do {
      var e = a.nextSibling;
      if (l.removeChild(a), e && e.nodeType === 8)
        if (a = e.data, a === "/$" || a === "/&") {
          if (u === 0) {
            l.removeChild(e), Ou(t);
            return;
          }
          u--;
        } else if (a === "$" || a === "$?" || a === "$~" || a === "$!" || a === "&")
          u++;
        else if (a === "html")
          se(l.ownerDocument.documentElement);
        else if (a === "head") {
          a = l.ownerDocument.head, se(a);
          for (var n = a.firstChild; n; ) {
            var f = n.nextSibling, c = n.nodeName;
            n[Nu] || c === "SCRIPT" || c === "STYLE" || c === "LINK" && n.rel.toLowerCase() === "stylesheet" || a.removeChild(n), n = f;
          }
        } else
          a === "body" && se(l.ownerDocument.body);
      a = e;
    } while (a);
    Ou(t);
  }
  function Qy(l, t) {
    var a = l;
    l = 0;
    do {
      var u = a.nextSibling;
      if (a.nodeType === 1 ? t ? (a._stashedDisplay = a.style.display, a.style.display = "none") : (a.style.display = a._stashedDisplay || "", a.getAttribute("style") === "" && a.removeAttribute("style")) : a.nodeType === 3 && (t ? (a._stashedText = a.nodeValue, a.nodeValue = "") : a.nodeValue = a._stashedText || ""), u && u.nodeType === 8)
        if (a = u.data, a === "/$") {
          if (l === 0) break;
          l--;
        } else
          a !== "$" && a !== "$?" && a !== "$~" && a !== "$!" || l++;
      a = u;
    } while (a);
  }
  function Kc(l) {
    var t = l.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var a = t;
      switch (t = t.nextSibling, a.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Kc(a), $n(a);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (a.rel.toLowerCase() === "stylesheet") continue;
      }
      l.removeChild(a);
    }
  }
  function bh(l, t, a, u) {
    for (; l.nodeType === 1; ) {
      var e = a;
      if (l.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!u && (l.nodeName !== "INPUT" || l.type !== "hidden"))
          break;
      } else if (u) {
        if (!l[Nu])
          switch (t) {
            case "meta":
              if (!l.hasAttribute("itemprop")) break;
              return l;
            case "link":
              if (n = l.getAttribute("rel"), n === "stylesheet" && l.hasAttribute("data-precedence"))
                break;
              if (n !== e.rel || l.getAttribute("href") !== (e.href == null || e.href === "" ? null : e.href) || l.getAttribute("crossorigin") !== (e.crossOrigin == null ? null : e.crossOrigin) || l.getAttribute("title") !== (e.title == null ? null : e.title))
                break;
              return l;
            case "style":
              if (l.hasAttribute("data-precedence")) break;
              return l;
            case "script":
              if (n = l.getAttribute("src"), (n !== (e.src == null ? null : e.src) || l.getAttribute("type") !== (e.type == null ? null : e.type) || l.getAttribute("crossorigin") !== (e.crossOrigin == null ? null : e.crossOrigin)) && n && l.hasAttribute("async") && !l.hasAttribute("itemprop"))
                break;
              return l;
            default:
              return l;
          }
      } else if (t === "input" && l.type === "hidden") {
        var n = e.name == null ? null : "" + e.name;
        if (e.type === "hidden" && l.getAttribute("name") === n)
          return l;
      } else return l;
      if (l = gt(l.nextSibling), l === null) break;
    }
    return null;
  }
  function Eh(l, t, a) {
    if (t === "") return null;
    for (; l.nodeType !== 3; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !a || (l = gt(l.nextSibling), l === null)) return null;
    return l;
  }
  function jy(l, t) {
    for (; l.nodeType !== 8; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !t || (l = gt(l.nextSibling), l === null)) return null;
    return l;
  }
  function Jc(l) {
    return l.data === "$?" || l.data === "$~";
  }
  function wc(l) {
    return l.data === "$!" || l.data === "$?" && l.ownerDocument.readyState !== "loading";
  }
  function zh(l, t) {
    var a = l.ownerDocument;
    if (l.data === "$~") l._reactRetry = t;
    else if (l.data !== "$?" || a.readyState !== "loading")
      t();
    else {
      var u = function() {
        t(), a.removeEventListener("DOMContentLoaded", u);
      };
      a.addEventListener("DOMContentLoaded", u), l._reactRetry = u;
    }
  }
  function gt(l) {
    for (; l != null; l = l.nextSibling) {
      var t = l.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = l.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F")
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return l;
  }
  var Wc = null;
  function Zy(l) {
    l = l.nextSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var a = l.data;
        if (a === "/$" || a === "/&") {
          if (t === 0)
            return gt(l.nextSibling);
          t--;
        } else
          a !== "$" && a !== "$!" && a !== "$?" && a !== "$~" && a !== "&" || t++;
      }
      l = l.nextSibling;
    }
    return null;
  }
  function Vy(l) {
    l = l.previousSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var a = l.data;
        if (a === "$" || a === "$!" || a === "$?" || a === "$~" || a === "&") {
          if (t === 0) return l;
          t--;
        } else a !== "/$" && a !== "/&" || t++;
      }
      l = l.previousSibling;
    }
    return null;
  }
  function Ly(l, t, a) {
    switch (t = On(a), l) {
      case "html":
        if (l = t.documentElement, !l) throw Error(o(452));
        return l;
      case "head":
        if (l = t.head, !l) throw Error(o(453));
        return l;
      case "body":
        if (l = t.body, !l) throw Error(o(454));
        return l;
      default:
        throw Error(o(451));
    }
  }
  function se(l) {
    for (var t = l.attributes; t.length; )
      l.removeAttributeNode(t[0]);
    $n(l);
  }
  var St = /* @__PURE__ */ new Map(), xy = /* @__PURE__ */ new Set();
  function Mn(l) {
    return typeof l.getRootNode == "function" ? l.getRootNode() : l.nodeType === 9 ? l : l.ownerDocument;
  }
  var Wt = O.d;
  O.d = {
    f: rh,
    r: Th,
    D: Ah,
    C: _h,
    L: Oh,
    m: Mh,
    X: Uh,
    S: Dh,
    M: ph
  };
  function rh() {
    var l = Wt.f(), t = Sn();
    return l || t;
  }
  function Th(l) {
    var t = xa(l);
    t !== null && t.tag === 5 && t.type === "form" ? cm(t) : Wt.r(l);
  }
  var Tu = typeof document > "u" ? null : document;
  function Ky(l, t, a) {
    var u = Tu;
    if (u && typeof t == "string" && t) {
      var e = mt(t);
      e = 'link[rel="' + l + '"][href="' + e + '"]', typeof a == "string" && (e += '[crossorigin="' + a + '"]'), xy.has(e) || (xy.add(e), l = { rel: l, crossOrigin: a, href: t }, u.querySelector(e) === null && (t = u.createElement("link"), Cl(t, "link", l), Al(t), u.head.appendChild(t)));
    }
  }
  function Ah(l) {
    Wt.D(l), Ky("dns-prefetch", l, null);
  }
  function _h(l, t) {
    Wt.C(l, t), Ky("preconnect", l, t);
  }
  function Oh(l, t, a) {
    Wt.L(l, t, a);
    var u = Tu;
    if (u && l && t) {
      var e = 'link[rel="preload"][as="' + mt(t) + '"]';
      t === "image" && a && a.imageSrcSet ? (e += '[imagesrcset="' + mt(
        a.imageSrcSet
      ) + '"]', typeof a.imageSizes == "string" && (e += '[imagesizes="' + mt(
        a.imageSizes
      ) + '"]')) : e += '[href="' + mt(l) + '"]';
      var n = e;
      switch (t) {
        case "style":
          n = Au(l);
          break;
        case "script":
          n = _u(l);
      }
      St.has(n) || (l = q(
        {
          rel: "preload",
          href: t === "image" && a && a.imageSrcSet ? void 0 : l,
          as: t
        },
        a
      ), St.set(n, l), u.querySelector(e) !== null || t === "style" && u.querySelector(he(n)) || t === "script" && u.querySelector(de(n)) || (t = u.createElement("link"), Cl(t, "link", l), Al(t), u.head.appendChild(t)));
    }
  }
  function Mh(l, t) {
    Wt.m(l, t);
    var a = Tu;
    if (a && l) {
      var u = t && typeof t.as == "string" ? t.as : "script", e = 'link[rel="modulepreload"][as="' + mt(u) + '"][href="' + mt(l) + '"]', n = e;
      switch (u) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          n = _u(l);
      }
      if (!St.has(n) && (l = q({ rel: "modulepreload", href: l }, t), St.set(n, l), a.querySelector(e) === null)) {
        switch (u) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (a.querySelector(de(n)))
              return;
        }
        u = a.createElement("link"), Cl(u, "link", l), Al(u), a.head.appendChild(u);
      }
    }
  }
  function Dh(l, t, a) {
    Wt.S(l, t, a);
    var u = Tu;
    if (u && l) {
      var e = Ka(u).hoistableStyles, n = Au(l);
      t = t || "default";
      var f = e.get(n);
      if (!f) {
        var c = { loading: 0, preload: null };
        if (f = u.querySelector(
          he(n)
        ))
          c.loading = 5;
        else {
          l = q(
            { rel: "stylesheet", href: l, "data-precedence": t },
            a
          ), (a = St.get(n)) && $c(l, a);
          var i = f = u.createElement("link");
          Al(i), Cl(i, "link", l), i._p = new Promise(function(h, S) {
            i.onload = h, i.onerror = S;
          }), i.addEventListener("load", function() {
            c.loading |= 1;
          }), i.addEventListener("error", function() {
            c.loading |= 2;
          }), c.loading |= 4, Dn(f, t, u);
        }
        f = {
          type: "stylesheet",
          instance: f,
          count: 1,
          state: c
        }, e.set(n, f);
      }
    }
  }
  function Uh(l, t) {
    Wt.X(l, t);
    var a = Tu;
    if (a && l) {
      var u = Ka(a).hoistableScripts, e = _u(l), n = u.get(e);
      n || (n = a.querySelector(de(e)), n || (l = q({ src: l, async: !0 }, t), (t = St.get(e)) && kc(l, t), n = a.createElement("script"), Al(n), Cl(n, "link", l), a.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, u.set(e, n));
    }
  }
  function ph(l, t) {
    Wt.M(l, t);
    var a = Tu;
    if (a && l) {
      var u = Ka(a).hoistableScripts, e = _u(l), n = u.get(e);
      n || (n = a.querySelector(de(e)), n || (l = q({ src: l, async: !0, type: "module" }, t), (t = St.get(e)) && kc(l, t), n = a.createElement("script"), Al(n), Cl(n, "link", l), a.head.appendChild(n)), n = {
        type: "script",
        instance: n,
        count: 1,
        state: null
      }, u.set(e, n));
    }
  }
  function Jy(l, t, a, u) {
    var e = (e = j.current) ? Mn(e) : null;
    if (!e) throw Error(o(446));
    switch (l) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof a.precedence == "string" && typeof a.href == "string" ? (t = Au(a.href), a = Ka(
          e
        ).hoistableStyles, u = a.get(t), u || (u = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, a.set(t, u)), u) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (a.rel === "stylesheet" && typeof a.href == "string" && typeof a.precedence == "string") {
          l = Au(a.href);
          var n = Ka(
            e
          ).hoistableStyles, f = n.get(l);
          if (f || (e = e.ownerDocument || e, f = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, n.set(l, f), (n = e.querySelector(
            he(l)
          )) && !n._p && (f.instance = n, f.state.loading = 5), St.has(l) || (a = {
            rel: "preload",
            as: "style",
            href: a.href,
            crossOrigin: a.crossOrigin,
            integrity: a.integrity,
            media: a.media,
            hrefLang: a.hrefLang,
            referrerPolicy: a.referrerPolicy
          }, St.set(l, a), n || Nh(
            e,
            l,
            a,
            f.state
          ))), t && u === null)
            throw Error(o(528, ""));
          return f;
        }
        if (t && u !== null)
          throw Error(o(529, ""));
        return null;
      case "script":
        return t = a.async, a = a.src, typeof a == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = _u(a), a = Ka(
          e
        ).hoistableScripts, u = a.get(t), u || (u = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, a.set(t, u)), u) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(o(444, l));
    }
  }
  function Au(l) {
    return 'href="' + mt(l) + '"';
  }
  function he(l) {
    return 'link[rel="stylesheet"][' + l + "]";
  }
  function wy(l) {
    return q({}, l, {
      "data-precedence": l.precedence,
      precedence: null
    });
  }
  function Nh(l, t, a, u) {
    l.querySelector('link[rel="preload"][as="style"][' + t + "]") ? u.loading = 1 : (t = l.createElement("link"), u.preload = t, t.addEventListener("load", function() {
      return u.loading |= 1;
    }), t.addEventListener("error", function() {
      return u.loading |= 2;
    }), Cl(t, "link", a), Al(t), l.head.appendChild(t));
  }
  function _u(l) {
    return '[src="' + mt(l) + '"]';
  }
  function de(l) {
    return "script[async]" + l;
  }
  function Wy(l, t, a) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var u = l.querySelector(
            'style[data-href~="' + mt(a.href) + '"]'
          );
          if (u)
            return t.instance = u, Al(u), u;
          var e = q({}, a, {
            "data-href": a.href,
            "data-precedence": a.precedence,
            href: null,
            precedence: null
          });
          return u = (l.ownerDocument || l).createElement(
            "style"
          ), Al(u), Cl(u, "style", e), Dn(u, a.precedence, l), t.instance = u;
        case "stylesheet":
          e = Au(a.href);
          var n = l.querySelector(
            he(e)
          );
          if (n)
            return t.state.loading |= 4, t.instance = n, Al(n), n;
          u = wy(a), (e = St.get(e)) && $c(u, e), n = (l.ownerDocument || l).createElement("link"), Al(n);
          var f = n;
          return f._p = new Promise(function(c, i) {
            f.onload = c, f.onerror = i;
          }), Cl(n, "link", u), t.state.loading |= 4, Dn(n, a.precedence, l), t.instance = n;
        case "script":
          return n = _u(a.src), (e = l.querySelector(
            de(n)
          )) ? (t.instance = e, Al(e), e) : (u = a, (e = St.get(n)) && (u = q({}, a), kc(u, e)), l = l.ownerDocument || l, e = l.createElement("script"), Al(e), Cl(e, "link", u), l.head.appendChild(e), t.instance = e);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (u = t.instance, t.state.loading |= 4, Dn(u, a.precedence, l));
    return t.instance;
  }
  function Dn(l, t, a) {
    for (var u = a.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), e = u.length ? u[u.length - 1] : null, n = e, f = 0; f < u.length; f++) {
      var c = u[f];
      if (c.dataset.precedence === t) n = c;
      else if (n !== e) break;
    }
    n ? n.parentNode.insertBefore(l, n.nextSibling) : (t = a.nodeType === 9 ? a.head : a, t.insertBefore(l, t.firstChild));
  }
  function $c(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.title == null && (l.title = t.title);
  }
  function kc(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.integrity == null && (l.integrity = t.integrity);
  }
  var Un = null;
  function $y(l, t, a) {
    if (Un === null) {
      var u = /* @__PURE__ */ new Map(), e = Un = /* @__PURE__ */ new Map();
      e.set(a, u);
    } else
      e = Un, u = e.get(a), u || (u = /* @__PURE__ */ new Map(), e.set(a, u));
    if (u.has(l)) return u;
    for (u.set(l, null), a = a.getElementsByTagName(l), e = 0; e < a.length; e++) {
      var n = a[e];
      if (!(n[Nu] || n[Ul] || l === "link" && n.getAttribute("rel") === "stylesheet") && n.namespaceURI !== "http://www.w3.org/2000/svg") {
        var f = n.getAttribute(t) || "";
        f = l + f;
        var c = u.get(f);
        c ? c.push(n) : u.set(f, [n]);
      }
    }
    return u;
  }
  function ky(l, t, a) {
    l = l.ownerDocument || l, l.head.insertBefore(
      a,
      t === "title" ? l.querySelector("head > title") : null
    );
  }
  function Hh(l, t, a) {
    if (a === 1 || t.itemProp != null) return !1;
    switch (l) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
          break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
          break;
        switch (t.rel) {
          case "stylesheet":
            return l = t.disabled, typeof t.precedence == "string" && l == null;
          default:
            return !0;
        }
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
          return !0;
    }
    return !1;
  }
  function Fy(l) {
    return !(l.type === "stylesheet" && (l.state.loading & 3) === 0);
  }
  function Ch(l, t, a, u) {
    if (a.type === "stylesheet" && (typeof u.media != "string" || matchMedia(u.media).matches !== !1) && (a.state.loading & 4) === 0) {
      if (a.instance === null) {
        var e = Au(u.href), n = t.querySelector(
          he(e)
        );
        if (n) {
          t = n._p, t !== null && typeof t == "object" && typeof t.then == "function" && (l.count++, l = pn.bind(l), t.then(l, l)), a.state.loading |= 4, a.instance = n, Al(n);
          return;
        }
        n = t.ownerDocument || t, u = wy(u), (e = St.get(e)) && $c(u, e), n = n.createElement("link"), Al(n);
        var f = n;
        f._p = new Promise(function(c, i) {
          f.onload = c, f.onerror = i;
        }), Cl(n, "link", u), a.instance = n;
      }
      l.stylesheets === null && (l.stylesheets = /* @__PURE__ */ new Map()), l.stylesheets.set(a, t), (t = a.state.preload) && (a.state.loading & 3) === 0 && (l.count++, a = pn.bind(l), t.addEventListener("load", a), t.addEventListener("error", a));
    }
  }
  var Fc = 0;
  function qh(l, t) {
    return l.stylesheets && l.count === 0 && Hn(l, l.stylesheets), 0 < l.count || 0 < l.imgCount ? function(a) {
      var u = setTimeout(function() {
        if (l.stylesheets && Hn(l, l.stylesheets), l.unsuspend) {
          var n = l.unsuspend;
          l.unsuspend = null, n();
        }
      }, 6e4 + t);
      0 < l.imgBytes && Fc === 0 && (Fc = 62500 * hh());
      var e = setTimeout(
        function() {
          if (l.waitingForImages = !1, l.count === 0 && (l.stylesheets && Hn(l, l.stylesheets), l.unsuspend)) {
            var n = l.unsuspend;
            l.unsuspend = null, n();
          }
        },
        (l.imgBytes > Fc ? 50 : 800) + t
      );
      return l.unsuspend = a, function() {
        l.unsuspend = null, clearTimeout(u), clearTimeout(e);
      };
    } : null;
  }
  function pn() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) Hn(this, this.stylesheets);
      else if (this.unsuspend) {
        var l = this.unsuspend;
        this.unsuspend = null, l();
      }
    }
  }
  var Nn = null;
  function Hn(l, t) {
    l.stylesheets = null, l.unsuspend !== null && (l.count++, Nn = /* @__PURE__ */ new Map(), t.forEach(Rh, l), Nn = null, pn.call(l));
  }
  function Rh(l, t) {
    if (!(t.state.loading & 4)) {
      var a = Nn.get(l);
      if (a) var u = a.get(null);
      else {
        a = /* @__PURE__ */ new Map(), Nn.set(l, a);
        for (var e = l.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), n = 0; n < e.length; n++) {
          var f = e[n];
          (f.nodeName === "LINK" || f.getAttribute("media") !== "not all") && (a.set(f.dataset.precedence, f), u = f);
        }
        u && a.set(null, u);
      }
      e = t.instance, f = e.getAttribute("data-precedence"), n = a.get(f) || u, n === u && a.set(null, e), a.set(f, e), this.count++, u = pn.bind(this), e.addEventListener("load", u), e.addEventListener("error", u), n ? n.parentNode.insertBefore(e, n.nextSibling) : (l = l.nodeType === 9 ? l.head : l, l.insertBefore(e, l.firstChild)), t.state.loading |= 4;
    }
  }
  var oe = {
    $$typeof: D,
    Provider: null,
    Consumer: null,
    _currentValue: B,
    _currentValue2: B,
    _threadCount: 0
  };
  function Bh(l, t, a, u, e, n, f, c, i) {
    this.tag = 1, this.containerInfo = l, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Kn(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Kn(0), this.hiddenUpdates = Kn(null), this.identifierPrefix = u, this.onUncaughtError = e, this.onCaughtError = n, this.onRecoverableError = f, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = i, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Iy(l, t, a, u, e, n, f, c, i, h, S, z) {
    return l = new Bh(
      l,
      t,
      a,
      f,
      i,
      h,
      S,
      z,
      c
    ), t = 1, n === !0 && (t |= 24), n = tt(3, null, null, t), l.current = n, n.stateNode = l, t = Nf(), t.refCount++, l.pooledCache = t, t.refCount++, n.memoizedState = {
      element: u,
      isDehydrated: a,
      cache: t
    }, Rf(n), l;
  }
  function Py(l) {
    return l ? (l = tu, l) : tu;
  }
  function lv(l, t, a, u, e, n) {
    e = Py(e), u.context === null ? u.context = e : u.pendingContext = e, u = ea(t), u.payload = { element: a }, n = n === void 0 ? null : n, n !== null && (u.callback = n), a = na(l, u, t), a !== null && ($l(a, l, t), wu(a, l, t));
  }
  function tv(l, t) {
    if (l = l.memoizedState, l !== null && l.dehydrated !== null) {
      var a = l.retryLane;
      l.retryLane = a !== 0 && a < t ? a : t;
    }
  }
  function Ic(l, t) {
    tv(l, t), (l = l.alternate) && tv(l, t);
  }
  function av(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = Ua(l, 67108864);
      t !== null && $l(t, l, 67108864), Ic(l, 67108864);
    }
  }
  function uv(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = ft();
      t = Jn(t);
      var a = Ua(l, t);
      a !== null && $l(a, l, t), Ic(l, t);
    }
  }
  var Cn = !0;
  function Yh(l, t, a, u) {
    var e = b.T;
    b.T = null;
    var n = O.p;
    try {
      O.p = 2, Pc(l, t, a, u);
    } finally {
      O.p = n, b.T = e;
    }
  }
  function Gh(l, t, a, u) {
    var e = b.T;
    b.T = null;
    var n = O.p;
    try {
      O.p = 8, Pc(l, t, a, u);
    } finally {
      O.p = n, b.T = e;
    }
  }
  function Pc(l, t, a, u) {
    if (Cn) {
      var e = li(u);
      if (e === null)
        Qc(
          l,
          t,
          u,
          qn,
          a
        ), nv(l, u);
      else if (Qh(
        e,
        l,
        t,
        a,
        u
      ))
        u.stopPropagation();
      else if (nv(l, u), t & 4 && -1 < Xh.indexOf(l)) {
        for (; e !== null; ) {
          var n = xa(e);
          if (n !== null)
            switch (n.tag) {
              case 3:
                if (n = n.stateNode, n.current.memoizedState.isDehydrated) {
                  var f = Aa(n.pendingLanes);
                  if (f !== 0) {
                    var c = n;
                    for (c.pendingLanes |= 2, c.entangledLanes |= 2; f; ) {
                      var i = 1 << 31 - Pl(f);
                      c.entanglements[1] |= i, f &= ~i;
                    }
                    pt(n), (k & 6) === 0 && (on = Fl() + 500, me(0));
                  }
                }
                break;
              case 31:
              case 13:
                c = Ua(n, 2), c !== null && $l(c, n, 2), Sn(), Ic(n, 2);
            }
          if (n = li(u), n === null && Qc(
            l,
            t,
            u,
            qn,
            a
          ), n === e) break;
          e = n;
        }
        e !== null && u.stopPropagation();
      } else
        Qc(
          l,
          t,
          u,
          null,
          a
        );
    }
  }
  function li(l) {
    return l = tf(l), ti(l);
  }
  var qn = null;
  function ti(l) {
    if (qn = null, l = La(l), l !== null) {
      var t = Ql(l);
      if (t === null) l = null;
      else {
        var a = t.tag;
        if (a === 13) {
          if (l = Bl(t), l !== null) return l;
          l = null;
        } else if (a === 31) {
          if (l = Ol(t), l !== null) return l;
          l = null;
        } else if (a === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          l = null;
        } else t !== l && (l = null);
      }
    }
    return qn = l, null;
  }
  function ev(l) {
    switch (l) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (Av()) {
          case si:
            return 2;
          case hi:
            return 8;
          case re:
          case _v:
            return 32;
          case di:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var ai = !1, ga = null, Sa = null, ba = null, ge = /* @__PURE__ */ new Map(), Se = /* @__PURE__ */ new Map(), Ea = [], Xh = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function nv(l, t) {
    switch (l) {
      case "focusin":
      case "focusout":
        ga = null;
        break;
      case "dragenter":
      case "dragleave":
        Sa = null;
        break;
      case "mouseover":
      case "mouseout":
        ba = null;
        break;
      case "pointerover":
      case "pointerout":
        ge.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Se.delete(t.pointerId);
    }
  }
  function be(l, t, a, u, e, n) {
    return l === null || l.nativeEvent !== n ? (l = {
      blockedOn: t,
      domEventName: a,
      eventSystemFlags: u,
      nativeEvent: n,
      targetContainers: [e]
    }, t !== null && (t = xa(t), t !== null && av(t)), l) : (l.eventSystemFlags |= u, t = l.targetContainers, e !== null && t.indexOf(e) === -1 && t.push(e), l);
  }
  function Qh(l, t, a, u, e) {
    switch (t) {
      case "focusin":
        return ga = be(
          ga,
          l,
          t,
          a,
          u,
          e
        ), !0;
      case "dragenter":
        return Sa = be(
          Sa,
          l,
          t,
          a,
          u,
          e
        ), !0;
      case "mouseover":
        return ba = be(
          ba,
          l,
          t,
          a,
          u,
          e
        ), !0;
      case "pointerover":
        var n = e.pointerId;
        return ge.set(
          n,
          be(
            ge.get(n) || null,
            l,
            t,
            a,
            u,
            e
          )
        ), !0;
      case "gotpointercapture":
        return n = e.pointerId, Se.set(
          n,
          be(
            Se.get(n) || null,
            l,
            t,
            a,
            u,
            e
          )
        ), !0;
    }
    return !1;
  }
  function fv(l) {
    var t = La(l.target);
    if (t !== null) {
      var a = Ql(t);
      if (a !== null) {
        if (t = a.tag, t === 13) {
          if (t = Bl(a), t !== null) {
            l.blockedOn = t, zi(l.priority, function() {
              uv(a);
            });
            return;
          }
        } else if (t === 31) {
          if (t = Ol(a), t !== null) {
            l.blockedOn = t, zi(l.priority, function() {
              uv(a);
            });
            return;
          }
        } else if (t === 3 && a.stateNode.current.memoizedState.isDehydrated) {
          l.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
          return;
        }
      }
    }
    l.blockedOn = null;
  }
  function Rn(l) {
    if (l.blockedOn !== null) return !1;
    for (var t = l.targetContainers; 0 < t.length; ) {
      var a = li(l.nativeEvent);
      if (a === null) {
        a = l.nativeEvent;
        var u = new a.constructor(
          a.type,
          a
        );
        lf = u, a.target.dispatchEvent(u), lf = null;
      } else
        return t = xa(a), t !== null && av(t), l.blockedOn = a, !1;
      t.shift();
    }
    return !0;
  }
  function cv(l, t, a) {
    Rn(l) && a.delete(t);
  }
  function jh() {
    ai = !1, ga !== null && Rn(ga) && (ga = null), Sa !== null && Rn(Sa) && (Sa = null), ba !== null && Rn(ba) && (ba = null), ge.forEach(cv), Se.forEach(cv);
  }
  function Bn(l, t) {
    l.blockedOn === t && (l.blockedOn = null, ai || (ai = !0, _.unstable_scheduleCallback(
      _.unstable_NormalPriority,
      jh
    )));
  }
  var Yn = null;
  function iv(l) {
    Yn !== l && (Yn = l, _.unstable_scheduleCallback(
      _.unstable_NormalPriority,
      function() {
        Yn === l && (Yn = null);
        for (var t = 0; t < l.length; t += 3) {
          var a = l[t], u = l[t + 1], e = l[t + 2];
          if (typeof u != "function") {
            if (ti(u || a) === null)
              continue;
            break;
          }
          var n = xa(a);
          n !== null && (l.splice(t, 3), t -= 3, lc(
            n,
            {
              pending: !0,
              data: e,
              method: a.method,
              action: u
            },
            u,
            e
          ));
        }
      }
    ));
  }
  function Ou(l) {
    function t(i) {
      return Bn(i, l);
    }
    ga !== null && Bn(ga, l), Sa !== null && Bn(Sa, l), ba !== null && Bn(ba, l), ge.forEach(t), Se.forEach(t);
    for (var a = 0; a < Ea.length; a++) {
      var u = Ea[a];
      u.blockedOn === l && (u.blockedOn = null);
    }
    for (; 0 < Ea.length && (a = Ea[0], a.blockedOn === null); )
      fv(a), a.blockedOn === null && Ea.shift();
    if (a = (l.ownerDocument || l).$$reactFormReplay, a != null)
      for (u = 0; u < a.length; u += 3) {
        var e = a[u], n = a[u + 1], f = e[Ll] || null;
        if (typeof n == "function")
          f || iv(a);
        else if (f) {
          var c = null;
          if (n && n.hasAttribute("formAction")) {
            if (e = n, f = n[Ll] || null)
              c = f.formAction;
            else if (ti(e) !== null) continue;
          } else c = f.action;
          typeof c == "function" ? a[u + 1] = c : (a.splice(u, 3), u -= 3), iv(a);
        }
      }
  }
  function mv() {
    function l(n) {
      n.canIntercept && n.info === "react-transition" && n.intercept({
        handler: function() {
          return new Promise(function(f) {
            return e = f;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      e !== null && (e(), e = null), u || setTimeout(a, 20);
    }
    function a() {
      if (!u && !navigation.transition) {
        var n = navigation.currentEntry;
        n && n.url != null && navigation.navigate(n.url, {
          state: n.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var u = !1, e = null;
      return navigation.addEventListener("navigate", l), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(a, 100), function() {
        u = !0, navigation.removeEventListener("navigate", l), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), e !== null && (e(), e = null);
      };
    }
  }
  function ui(l) {
    this._internalRoot = l;
  }
  Gn.prototype.render = ui.prototype.render = function(l) {
    var t = this._internalRoot;
    if (t === null) throw Error(o(409));
    var a = t.current, u = ft();
    lv(a, u, l, t, null, null);
  }, Gn.prototype.unmount = ui.prototype.unmount = function() {
    var l = this._internalRoot;
    if (l !== null) {
      this._internalRoot = null;
      var t = l.containerInfo;
      lv(l.current, 2, null, l, null, null), Sn(), t[Va] = null;
    }
  };
  function Gn(l) {
    this._internalRoot = l;
  }
  Gn.prototype.unstable_scheduleHydration = function(l) {
    if (l) {
      var t = Ei();
      l = { blockedOn: null, target: l, priority: t };
      for (var a = 0; a < Ea.length && t !== 0 && t < Ea[a].priority; a++) ;
      Ea.splice(a, 0, l), a === 0 && fv(l);
    }
  };
  var yv = il.version;
  if (yv !== "19.2.0")
    throw Error(
      o(
        527,
        yv,
        "19.2.0"
      )
    );
  O.findDOMNode = function(l) {
    var t = l._reactInternals;
    if (t === void 0)
      throw typeof l.render == "function" ? Error(o(188)) : (l = Object.keys(l).join(","), Error(o(268, l)));
    return l = T(t), l = l !== null ? w(l) : null, l = l === null ? null : l.stateNode, l;
  };
  var Zh = {
    bundleType: 0,
    version: "19.2.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: b,
    reconcilerVersion: "19.2.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Xn = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Xn.isDisabled && Xn.supportsFiber)
      try {
        Du = Xn.inject(
          Zh
        ), Il = Xn;
      } catch {
      }
  }
  return Ee.createRoot = function(l, t) {
    if (!kl(l)) throw Error(o(299));
    var a = !1, u = "", e = Sm, n = bm, f = Em;
    return t != null && (t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onUncaughtError !== void 0 && (e = t.onUncaughtError), t.onCaughtError !== void 0 && (n = t.onCaughtError), t.onRecoverableError !== void 0 && (f = t.onRecoverableError)), t = Iy(
      l,
      1,
      !1,
      null,
      null,
      a,
      u,
      null,
      e,
      n,
      f,
      mv
    ), l[Va] = t.current, Xc(l), new ui(t);
  }, Ee.hydrateRoot = function(l, t, a) {
    if (!kl(l)) throw Error(o(299));
    var u = !1, e = "", n = Sm, f = bm, c = Em, i = null;
    return a != null && (a.unstable_strictMode === !0 && (u = !0), a.identifierPrefix !== void 0 && (e = a.identifierPrefix), a.onUncaughtError !== void 0 && (n = a.onUncaughtError), a.onCaughtError !== void 0 && (f = a.onCaughtError), a.onRecoverableError !== void 0 && (c = a.onRecoverableError), a.formState !== void 0 && (i = a.formState)), t = Iy(
      l,
      1,
      !0,
      t,
      a ?? null,
      u,
      e,
      i,
      n,
      f,
      c,
      mv
    ), t.context = Py(null), a = t.current, u = ft(), u = Jn(u), e = ea(u), e.callback = null, na(a, e, u), a = u, t.current.lanes = a, pu(t, a), pt(t), l[Va] = t.current, Xc(l), new Gn(t);
  }, Ee.version = "19.2.0", Ee;
}
var bv;
function kh() {
  if (bv) return ni.exports;
  bv = 1;
  function _() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(_);
      } catch (il) {
        console.error(il);
      }
  }
  return _(), ni.exports = $h(), ni.exports;
}
var Fh = kh();
function Ev({ color: _ = "#81bdd5", kind: il = "tube" }) {
  return /* @__PURE__ */ A.createElement("svg", { viewBox: "0 0 320 150", "aria-hidden": "true" }, /* @__PURE__ */ A.createElement("defs", null, /* @__PURE__ */ A.createElement("linearGradient", { id: "glass-" + il }, /* @__PURE__ */ A.createElement("stop", { stopColor: "#effcff", stopOpacity: ".55" }), /* @__PURE__ */ A.createElement("stop", { offset: ".35", stopColor: "#c0d4df", stopOpacity: ".05" }), /* @__PURE__ */ A.createElement("stop", { offset: "1", stopColor: "#effcff", stopOpacity: ".7" }))), /* @__PURE__ */ A.createElement("ellipse", { cx: "160", cy: "132", rx: "100", ry: "7", fill: "#151e28", opacity: ".35" }), /* @__PURE__ */ A.createElement("path", { d: "M65 25h34v87q0 20-17 20t-17-20z", fill: "url(#glass-" + il + ")", stroke: "#d2e4eb", strokeWidth: "2" }), /* @__PURE__ */ A.createElement("path", { d: "M69 80h26v31q0 17-13 17t-13-17z", fill: _, opacity: ".75" }), /* @__PURE__ */ A.createElement("path", { d: "M156 25h25v35l30 62q3 8-5 8h-77q-8 0-5-8l32-62z", fill: "url(#glass-" + il + ")", stroke: "#d2e4eb", strokeWidth: "2" }), /* @__PURE__ */ A.createElement("path", { d: "M142 90h52l14 33h-82z", fill: _, opacity: ".6" }), /* @__PURE__ */ A.createElement("path", { d: "M240 55h43l-4 69q0 5-5 5h-28q-5 0-5-5z", fill: "url(#glass-" + il + ")", stroke: "#d2e4eb", strokeWidth: "2" }), /* @__PURE__ */ A.createElement("path", { d: "M243 97h34v28h-32z", fill: _, opacity: ".5" }), /* @__PURE__ */ A.createElement("path", { d: "M247 78h12m-12 12h8m-8 12h12", stroke: "#fff", opacity: ".7" }));
}
function Ih({ api: _ }) {
  const [il, I] = $t.useState(!new URLSearchParams(location.search).has("test")), [o, kl] = $t.useState("all"), [Ql, Bl] = $t.useState(""), [Ol, H] = $t.useState(null), [T, w] = $t.useState("move"), [q, P] = $t.useState(""), [Ml, ql] = $t.useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hololab-saved-v38") || "[]");
    } catch {
      return [];
    }
  });
  $t.useEffect(() => {
    const D = document.getElementById("sidebar-toggle"), vl = D.onclick;
    return D.onclick = () => {
      _.release(), I(!0);
    }, () => {
      D.onclick = vl;
    };
  }, []);
  const Dl = (D) => {
    _.setMode(D), w(D);
  }, bt = (D) => {
    _.start(D), I(!1), H(null);
  }, Yl = () => {
    try {
      const D = [{ name: _.title(), date: (/* @__PURE__ */ new Date()).toLocaleString("vi-VN"), data: _.snapshot() }, ...Ml].slice(0, 12);
      localStorage.setItem("hololab-saved-v38", JSON.stringify(D)), ql(D), P("Đã lưu trên trình duyệt này.");
    } catch (D) {
      P("Không lưu được: " + D.message);
    }
  }, ct = async (D) => {
    try {
      await D();
    } catch (vl) {
      P(vl.message);
    }
  };
  return /* @__PURE__ */ A.createElement(A.Fragment, null, /* @__PURE__ */ A.createElement("nav", { className: "lab-mouse-toolbar", "aria-label": "Điều khiển bằng chuột" }, /* @__PURE__ */ A.createElement("button", { onClick: () => {
    _.release(), I(!0);
  } }, "‹ Thư viện"), /* @__PURE__ */ A.createElement("div", { className: "mode-switch" }, [["move", "Di chuyển"], ["rotate", "Nghiêng / rót"], ["depth", "Gần / xa"]].map(([D, vl]) => /* @__PURE__ */ A.createElement("button", { key: D, "aria-pressed": T === D, onClick: () => Dl(D) }, vl))), /* @__PURE__ */ A.createElement("button", { onClick: () => _.upright() }, "Dựng thẳng"), /* @__PURE__ */ A.createElement("button", { onClick: () => {
    const D = document.getElementById("learning-panel");
    D.open = !0, D.scrollIntoView({ behavior: "smooth", block: "start" });
  } }, "EGAD · Giải thích"), /* @__PURE__ */ A.createElement("button", { onClick: Yl }, "Lưu"), /* @__PURE__ */ A.createElement("button", { onClick: () => ct(_.undo) }, "Hoàn tác"), /* @__PURE__ */ A.createElement("button", { onClick: () => ct(_.redo) }, "Làm lại"), /* @__PURE__ */ A.createElement("button", { onClick: () => _.reset() }, "Bắt đầu lại"), /* @__PURE__ */ A.createElement("button", { onClick: () => _.remove() }, "Xóa vật"), /* @__PURE__ */ A.createElement("button", { onClick: () => document.getElementById("mouse-help").showModal() }, "?")), /* @__PURE__ */ A.createElement("div", { className: "mouse-hint" }, T === "move" ? "Giữ chuột trái trên bình để kéo · Thả chuột: bình rơi" : T === "rotate" ? "Giữ chuột và kéo ngang để nghiêng bình · Kéo dọc để xoay trước/sau" : "Giữ chuột và kéo lên/xuống để đổi chiều sâu", " · Chuột phải + kéo: nghiêng nhanh"), q && /* @__PURE__ */ A.createElement("div", { className: "mouse-notice", role: "status", onClick: () => P("") }, q, " ×"), /* @__PURE__ */ A.createElement("dialog", { id: "mouse-help" }, /* @__PURE__ */ A.createElement("h2", null, "Thực hành bằng chuột"), /* @__PURE__ */ A.createElement("p", null, "Chọn bài → chọn chế độ → giữ chuột trên dụng cụ."), /* @__PURE__ */ A.createElement("ul", null, /* @__PURE__ */ A.createElement("li", null, "Di chuyển: kéo bình đến vị trí mong muốn."), /* @__PURE__ */ A.createElement("li", null, "Nghiêng / rót: kéo ngang khoảng 350 px để dốc ngược. Giữ chuột để tiếp tục rót."), /* @__PURE__ */ A.createElement("li", null, "Gần / xa: kéo dọc để căn miệng bình theo chiều sâu."), /* @__PURE__ */ A.createElement("li", null, "Chỉ rót vào bình nhận khi dòng chảy đi qua miệng bình; lệch miệng sẽ đổ ra bàn."), /* @__PURE__ */ A.createElement("li", null, "Thả chuột trả vật về hệ vật lý. Camera không cần bật."), /* @__PURE__ */ A.createElement("li", null, "Lưu giữ phiên trong trình duyệt; xuất JSON trong bảng công cụ để chuyển máy.")), /* @__PURE__ */ A.createElement("button", { onClick: () => document.getElementById("mouse-help").close() }, "Đã hiểu")), il && /* @__PURE__ */ A.createElement("section", { className: "experiment-library", "aria-label": "Thư viện HoloLab" }, /* @__PURE__ */ A.createElement("aside", null, /* @__PURE__ */ A.createElement("h1", null, "HoloLab", /* @__PURE__ */ A.createElement("span", null, "ChemLab")), /* @__PURE__ */ A.createElement("p", null, "Phòng thí nghiệm Hóa học"), /* @__PURE__ */ A.createElement("button", { className: "active" }, "Thí nghiệm"), /* @__PURE__ */ A.createElement("button", { onClick: () => {
    document.getElementById("saved-experiments").scrollIntoView();
  } }, "Phiên đã lưu"), /* @__PURE__ */ A.createElement("p", { className: "library-note" }, "Điều khiển bằng chuột", /* @__PURE__ */ A.createElement("br", null), "Lớp 10 · 11 · 12")), /* @__PURE__ */ A.createElement("article", null, /* @__PURE__ */ A.createElement("header", null, /* @__PURE__ */ A.createElement("div", null, /* @__PURE__ */ A.createElement("small", null, "Khám phá qua thực hành"), /* @__PURE__ */ A.createElement("h2", null, "Thư viện thí nghiệm")), /* @__PURE__ */ A.createElement("button", { onClick: () => {
    _.free(), I(!1);
  } }, "＋ Bàn thí nghiệm mới")), /* @__PURE__ */ A.createElement("div", { className: "library-filters" }, /* @__PURE__ */ A.createElement("input", { "aria-label": "Tìm thí nghiệm", placeholder: "Tìm tên bài hoặc chủ đề…", value: Ql, onChange: (D) => Bl(D.target.value) }), /* @__PURE__ */ A.createElement("select", { "aria-label": "Lọc lớp", value: o, onChange: (D) => kl(D.target.value) }, /* @__PURE__ */ A.createElement("option", { value: "all" }, "Tất cả lớp"), [10, 11, 12].map((D) => /* @__PURE__ */ A.createElement("option", { key: D, value: D }, "Lớp ", D)))), /* @__PURE__ */ A.createElement("div", { className: "experiment-grid" }, _.lessons.filter((D) => D.status === "ready" && (o === "all" || D.grade === +o) && `${D.title} ${D.topic}`.toLocaleLowerCase("vi").includes(Ql.toLocaleLowerCase("vi"))).map((D, vl) => /* @__PURE__ */ A.createElement("button", { className: "experiment-card", key: D.id, onClick: () => H(D) }, /* @__PURE__ */ A.createElement("div", { className: "experiment-image" }, /* @__PURE__ */ A.createElement(Ev, { color: ["#dde9ec", "#ef9cc9", "#a4d2ea", "#77b5df", "#c19be1"][vl % 5], kind: D.id })), /* @__PURE__ */ A.createElement("span", { className: "grade" }, "Lớp ", D.grade), /* @__PURE__ */ A.createElement("h3", null, D.title), /* @__PURE__ */ A.createElement("p", null, D.topic, D.curriculum?.verified === !1 ? " · Phân lớp đề xuất" : ""), /* @__PURE__ */ A.createElement("span", null, "Xem bài thực hành →")))), /* @__PURE__ */ A.createElement("h2", { id: "saved-experiments" }, "Phiên đã lưu"), !Ml.length && /* @__PURE__ */ A.createElement("p", null, "Chưa có phiên đã lưu trên trình duyệt này."), Ml.map((D, vl) => /* @__PURE__ */ A.createElement("button", { className: "saved-session", key: vl, onClick: () => ct(async () => {
    await _.restore(D.data), I(!1);
  }) }, D.name, /* @__PURE__ */ A.createElement("small", null, D.date))))), Ol && /* @__PURE__ */ A.createElement("div", { className: "preview-scrim" }, /* @__PURE__ */ A.createElement("section", { role: "dialog", "aria-modal": "true", "aria-label": "Xem trước thí nghiệm" }, /* @__PURE__ */ A.createElement("button", { className: "preview-close", onClick: () => H(null) }, "Đóng"), /* @__PURE__ */ A.createElement(Ev, { kind: "preview" }), /* @__PURE__ */ A.createElement("h2", null, Ol.title), /* @__PURE__ */ A.createElement("p", null, Ol.objective), /* @__PURE__ */ A.createElement("ol", null, Ol.steps.map((D, vl) => /* @__PURE__ */ A.createElement("li", { key: vl }, D.replaceAll("Gắp", "Nhấc").replaceAll("thả tay", "thả chuột")))), /* @__PURE__ */ A.createElement("button", { className: "primary", onClick: () => bt(Ol.id) }, "Bắt đầu thực hành"))));
}
function Ph(_) {
  const il = document.createElement("div");
  il.id = "mouse-shell", document.querySelector("main").prepend(il), Fh.createRoot(il).render(/* @__PURE__ */ A.createElement(Ih, { api: _ })), document.body.classList.add("mouse-first", "sidebar-closed");
}
export {
  Ph as initMouseShell
};
