function ly(f) {
  return f && f.__esModule && Object.prototype.hasOwnProperty.call(f, "default") ? f.default : f;
}
var Af = { exports: {} }, $ = {};
var Vh;
function ay() {
  if (Vh) return $;
  Vh = 1;
  var f = Symbol.for("react.transitional.element"), h = Symbol.for("react.portal"), d = Symbol.for("react.fragment"), s = Symbol.for("react.strict_mode"), S = Symbol.for("react.profiler"), D = Symbol.for("react.consumer"), O = Symbol.for("react.context"), Y = Symbol.for("react.forward_ref"), C = Symbol.for("react.suspense"), z = Symbol.for("react.memo"), F = Symbol.for("react.lazy"), B = Symbol.for("react.activity"), Z = Symbol.iterator;
  function te(y) {
    return y === null || typeof y != "object" ? null : (y = Z && y[Z] || y["@@iterator"], typeof y == "function" ? y : null);
  }
  var k = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, X = Object.assign, re = {};
  function ue(y, _, U) {
    this.props = y, this.context = _, this.refs = re, this.updater = U || k;
  }
  ue.prototype.isReactComponent = {}, ue.prototype.setState = function(y, _) {
    if (typeof y != "object" && typeof y != "function" && y != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, y, _, "setState");
  }, ue.prototype.forceUpdate = function(y) {
    this.updater.enqueueForceUpdate(this, y, "forceUpdate");
  };
  function Le() {
  }
  Le.prototype = ue.prototype;
  function De(y, _, U) {
    this.props = y, this.context = _, this.refs = re, this.updater = U || k;
  }
  var Oe = De.prototype = new Le();
  Oe.constructor = De, X(Oe, ue.prototype), Oe.isPureReactComponent = !0;
  var V = Array.isArray;
  function pe() {
  }
  var I = { H: null, A: null, T: null, S: null }, R = Object.prototype.hasOwnProperty;
  function oe(y, _, U) {
    var G = U.ref;
    return {
      $$typeof: f,
      type: y,
      key: _,
      ref: G !== void 0 ? G : null,
      props: U
    };
  }
  function qe(y, _) {
    return oe(y.type, _, y.props);
  }
  function at(y) {
    return typeof y == "object" && y !== null && y.$$typeof === f;
  }
  function Be(y) {
    var _ = { "=": "=0", ":": "=2" };
    return "$" + y.replace(/[=:]/g, function(U) {
      return _[U];
    });
  }
  var Ze = /\/+/g;
  function Ae(y, _) {
    return typeof y == "object" && y !== null && y.key != null ? Be("" + y.key) : _.toString(36);
  }
  function Fe(y) {
    switch (y.status) {
      case "fulfilled":
        return y.value;
      case "rejected":
        throw y.reason;
      default:
        switch (typeof y.status == "string" ? y.then(pe, pe) : (y.status = "pending", y.then(
          function(_) {
            y.status === "pending" && (y.status = "fulfilled", y.value = _);
          },
          function(_) {
            y.status === "pending" && (y.status = "rejected", y.reason = _);
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
  function T(y, _, U, G, W) {
    var P = typeof y;
    (P === "undefined" || P === "boolean") && (y = null);
    var se = !1;
    if (y === null) se = !0;
    else
      switch (P) {
        case "bigint":
        case "string":
        case "number":
          se = !0;
          break;
        case "object":
          switch (y.$$typeof) {
            case f:
            case h:
              se = !0;
              break;
            case F:
              return se = y._init, T(
                se(y._payload),
                _,
                U,
                G,
                W
              );
          }
      }
    if (se)
      return W = W(y), se = G === "" ? "." + Ae(y, 0) : G, V(W) ? (U = "", se != null && (U = se.replace(Ze, "$&/") + "/"), T(W, _, U, "", function(we) {
        return we;
      })) : W != null && (at(W) && (W = qe(
        W,
        U + (W.key == null || y && y.key === W.key ? "" : ("" + W.key).replace(
          Ze,
          "$&/"
        ) + "/") + se
      )), _.push(W)), 1;
    se = 0;
    var Je = G === "" ? "." : G + ":";
    if (V(y))
      for (var q = 0; q < y.length; q++)
        G = y[q], P = Je + Ae(G, q), se += T(
          G,
          _,
          U,
          P,
          W
        );
    else if (q = te(y), typeof q == "function")
      for (y = q.call(y), q = 0; !(G = y.next()).done; )
        G = G.value, P = Je + Ae(G, q++), se += T(
          G,
          _,
          U,
          P,
          W
        );
    else if (P === "object") {
      if (typeof y.then == "function")
        return T(
          Fe(y),
          _,
          U,
          G,
          W
        );
      throw _ = String(y), Error(
        "Objects are not valid as a React child (found: " + (_ === "[object Object]" ? "object with keys {" + Object.keys(y).join(", ") + "}" : _) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return se;
  }
  function H(y, _, U) {
    if (y == null) return y;
    var G = [], W = 0;
    return T(y, G, "", "", function(P) {
      return _.call(U, P, W++);
    }), G;
  }
  function J(y) {
    if (y._status === -1) {
      var _ = y._result;
      _ = _(), _.then(
        function(U) {
          (y._status === 0 || y._status === -1) && (y._status = 1, y._result = U);
        },
        function(U) {
          (y._status === 0 || y._status === -1) && (y._status = 2, y._result = U);
        }
      ), y._status === -1 && (y._status = 0, y._result = _);
    }
    if (y._status === 1) return y._result.default;
    throw y._result;
  }
  var ge = typeof reportError == "function" ? reportError : function(y) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var _ = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof y == "object" && y !== null && typeof y.message == "string" ? String(y.message) : String(y),
        error: y
      });
      if (!window.dispatchEvent(_)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", y);
      return;
    }
    console.error(y);
  }, de = {
    map: H,
    forEach: function(y, _, U) {
      H(
        y,
        function() {
          _.apply(this, arguments);
        },
        U
      );
    },
    count: function(y) {
      var _ = 0;
      return H(y, function() {
        _++;
      }), _;
    },
    toArray: function(y) {
      return H(y, function(_) {
        return _;
      }) || [];
    },
    only: function(y) {
      if (!at(y))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return y;
    }
  };
  return $.Activity = B, $.Children = de, $.Component = ue, $.Fragment = d, $.Profiler = S, $.PureComponent = De, $.StrictMode = s, $.Suspense = C, $.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = I, $.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(y) {
      return I.H.useMemoCache(y);
    }
  }, $.cache = function(y) {
    return function() {
      return y.apply(null, arguments);
    };
  }, $.cacheSignal = function() {
    return null;
  }, $.cloneElement = function(y, _, U) {
    if (y == null)
      throw Error(
        "The argument must be a React element, but you passed " + y + "."
      );
    var G = X({}, y.props), W = y.key;
    if (_ != null)
      for (P in _.key !== void 0 && (W = "" + _.key), _)
        !R.call(_, P) || P === "key" || P === "__self" || P === "__source" || P === "ref" && _.ref === void 0 || (G[P] = _[P]);
    var P = arguments.length - 2;
    if (P === 1) G.children = U;
    else if (1 < P) {
      for (var se = Array(P), Je = 0; Je < P; Je++)
        se[Je] = arguments[Je + 2];
      G.children = se;
    }
    return oe(y.type, W, G);
  }, $.createContext = function(y) {
    return y = {
      $$typeof: O,
      _currentValue: y,
      _currentValue2: y,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, y.Provider = y, y.Consumer = {
      $$typeof: D,
      _context: y
    }, y;
  }, $.createElement = function(y, _, U) {
    var G, W = {}, P = null;
    if (_ != null)
      for (G in _.key !== void 0 && (P = "" + _.key), _)
        R.call(_, G) && G !== "key" && G !== "__self" && G !== "__source" && (W[G] = _[G]);
    var se = arguments.length - 2;
    if (se === 1) W.children = U;
    else if (1 < se) {
      for (var Je = Array(se), q = 0; q < se; q++)
        Je[q] = arguments[q + 2];
      W.children = Je;
    }
    if (y && y.defaultProps)
      for (G in se = y.defaultProps, se)
        W[G] === void 0 && (W[G] = se[G]);
    return oe(y, P, W);
  }, $.createRef = function() {
    return { current: null };
  }, $.forwardRef = function(y) {
    return { $$typeof: Y, render: y };
  }, $.isValidElement = at, $.lazy = function(y) {
    return {
      $$typeof: F,
      _payload: { _status: -1, _result: y },
      _init: J
    };
  }, $.memo = function(y, _) {
    return {
      $$typeof: z,
      type: y,
      compare: _ === void 0 ? null : _
    };
  }, $.startTransition = function(y) {
    var _ = I.T, U = {};
    I.T = U;
    try {
      var G = y(), W = I.S;
      W !== null && W(U, G), typeof G == "object" && G !== null && typeof G.then == "function" && G.then(pe, ge);
    } catch (P) {
      ge(P);
    } finally {
      _ !== null && U.types !== null && (_.types = U.types), I.T = _;
    }
  }, $.unstable_useCacheRefresh = function() {
    return I.H.useCacheRefresh();
  }, $.use = function(y) {
    return I.H.use(y);
  }, $.useActionState = function(y, _, U) {
    return I.H.useActionState(y, _, U);
  }, $.useCallback = function(y, _) {
    return I.H.useCallback(y, _);
  }, $.useContext = function(y) {
    return I.H.useContext(y);
  }, $.useDebugValue = function() {
  }, $.useDeferredValue = function(y, _) {
    return I.H.useDeferredValue(y, _);
  }, $.useEffect = function(y, _) {
    return I.H.useEffect(y, _);
  }, $.useEffectEvent = function(y) {
    return I.H.useEffectEvent(y);
  }, $.useId = function() {
    return I.H.useId();
  }, $.useImperativeHandle = function(y, _, U) {
    return I.H.useImperativeHandle(y, _, U);
  }, $.useInsertionEffect = function(y, _) {
    return I.H.useInsertionEffect(y, _);
  }, $.useLayoutEffect = function(y, _) {
    return I.H.useLayoutEffect(y, _);
  }, $.useMemo = function(y, _) {
    return I.H.useMemo(y, _);
  }, $.useOptimistic = function(y, _) {
    return I.H.useOptimistic(y, _);
  }, $.useReducer = function(y, _, U) {
    return I.H.useReducer(y, _, U);
  }, $.useRef = function(y) {
    return I.H.useRef(y);
  }, $.useState = function(y) {
    return I.H.useState(y);
  }, $.useSyncExternalStore = function(y, _, U) {
    return I.H.useSyncExternalStore(
      y,
      _,
      U
    );
  }, $.useTransition = function() {
    return I.H.useTransition();
  }, $.version = "19.2.0", $;
}
var Kh;
function Gf() {
  return Kh || (Kh = 1, Af.exports = ay()), Af.exports;
}
var L = Gf();
const c = /* @__PURE__ */ ly(L);
var Nf = { exports: {} }, qn = {}, _f = { exports: {} }, Df = {};
var Fh;
function ny() {
  return Fh || (Fh = 1, (function(f) {
    function h(T, H) {
      var J = T.length;
      T.push(H);
      e: for (; 0 < J; ) {
        var ge = J - 1 >>> 1, de = T[ge];
        if (0 < S(de, H))
          T[ge] = H, T[J] = de, J = ge;
        else break e;
      }
    }
    function d(T) {
      return T.length === 0 ? null : T[0];
    }
    function s(T) {
      if (T.length === 0) return null;
      var H = T[0], J = T.pop();
      if (J !== H) {
        T[0] = J;
        e: for (var ge = 0, de = T.length, y = de >>> 1; ge < y; ) {
          var _ = 2 * (ge + 1) - 1, U = T[_], G = _ + 1, W = T[G];
          if (0 > S(U, J))
            G < de && 0 > S(W, U) ? (T[ge] = W, T[G] = J, ge = G) : (T[ge] = U, T[_] = J, ge = _);
          else if (G < de && 0 > S(W, J))
            T[ge] = W, T[G] = J, ge = G;
          else break e;
        }
      }
      return H;
    }
    function S(T, H) {
      var J = T.sortIndex - H.sortIndex;
      return J !== 0 ? J : T.id - H.id;
    }
    if (f.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var D = performance;
      f.unstable_now = function() {
        return D.now();
      };
    } else {
      var O = Date, Y = O.now();
      f.unstable_now = function() {
        return O.now() - Y;
      };
    }
    var C = [], z = [], F = 1, B = null, Z = 3, te = !1, k = !1, X = !1, re = !1, ue = typeof setTimeout == "function" ? setTimeout : null, Le = typeof clearTimeout == "function" ? clearTimeout : null, De = typeof setImmediate < "u" ? setImmediate : null;
    function Oe(T) {
      for (var H = d(z); H !== null; ) {
        if (H.callback === null) s(z);
        else if (H.startTime <= T)
          s(z), H.sortIndex = H.expirationTime, h(C, H);
        else break;
        H = d(z);
      }
    }
    function V(T) {
      if (X = !1, Oe(T), !k)
        if (d(C) !== null)
          k = !0, pe || (pe = !0, Be());
        else {
          var H = d(z);
          H !== null && Fe(V, H.startTime - T);
        }
    }
    var pe = !1, I = -1, R = 5, oe = -1;
    function qe() {
      return re ? !0 : !(f.unstable_now() - oe < R);
    }
    function at() {
      if (re = !1, pe) {
        var T = f.unstable_now();
        oe = T;
        var H = !0;
        try {
          e: {
            k = !1, X && (X = !1, Le(I), I = -1), te = !0;
            var J = Z;
            try {
              t: {
                for (Oe(T), B = d(C); B !== null && !(B.expirationTime > T && qe()); ) {
                  var ge = B.callback;
                  if (typeof ge == "function") {
                    B.callback = null, Z = B.priorityLevel;
                    var de = ge(
                      B.expirationTime <= T
                    );
                    if (T = f.unstable_now(), typeof de == "function") {
                      B.callback = de, Oe(T), H = !0;
                      break t;
                    }
                    B === d(C) && s(C), Oe(T);
                  } else s(C);
                  B = d(C);
                }
                if (B !== null) H = !0;
                else {
                  var y = d(z);
                  y !== null && Fe(
                    V,
                    y.startTime - T
                  ), H = !1;
                }
              }
              break e;
            } finally {
              B = null, Z = J, te = !1;
            }
            H = void 0;
          }
        } finally {
          H ? Be() : pe = !1;
        }
      }
    }
    var Be;
    if (typeof De == "function")
      Be = function() {
        De(at);
      };
    else if (typeof MessageChannel < "u") {
      var Ze = new MessageChannel(), Ae = Ze.port2;
      Ze.port1.onmessage = at, Be = function() {
        Ae.postMessage(null);
      };
    } else
      Be = function() {
        ue(at, 0);
      };
    function Fe(T, H) {
      I = ue(function() {
        T(f.unstable_now());
      }, H);
    }
    f.unstable_IdlePriority = 5, f.unstable_ImmediatePriority = 1, f.unstable_LowPriority = 4, f.unstable_NormalPriority = 3, f.unstable_Profiling = null, f.unstable_UserBlockingPriority = 2, f.unstable_cancelCallback = function(T) {
      T.callback = null;
    }, f.unstable_forceFrameRate = function(T) {
      0 > T || 125 < T ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : R = 0 < T ? Math.floor(1e3 / T) : 5;
    }, f.unstable_getCurrentPriorityLevel = function() {
      return Z;
    }, f.unstable_next = function(T) {
      switch (Z) {
        case 1:
        case 2:
        case 3:
          var H = 3;
          break;
        default:
          H = Z;
      }
      var J = Z;
      Z = H;
      try {
        return T();
      } finally {
        Z = J;
      }
    }, f.unstable_requestPaint = function() {
      re = !0;
    }, f.unstable_runWithPriority = function(T, H) {
      switch (T) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          T = 3;
      }
      var J = Z;
      Z = T;
      try {
        return H();
      } finally {
        Z = J;
      }
    }, f.unstable_scheduleCallback = function(T, H, J) {
      var ge = f.unstable_now();
      switch (typeof J == "object" && J !== null ? (J = J.delay, J = typeof J == "number" && 0 < J ? ge + J : ge) : J = ge, T) {
        case 1:
          var de = -1;
          break;
        case 2:
          de = 250;
          break;
        case 5:
          de = 1073741823;
          break;
        case 4:
          de = 1e4;
          break;
        default:
          de = 5e3;
      }
      return de = J + de, T = {
        id: F++,
        callback: H,
        priorityLevel: T,
        startTime: J,
        expirationTime: de,
        sortIndex: -1
      }, J > ge ? (T.sortIndex = J, h(z, T), d(C) === null && T === d(z) && (X ? (Le(I), I = -1) : X = !0, Fe(V, J - ge))) : (T.sortIndex = de, h(C, T), k || te || (k = !0, pe || (pe = !0, Be()))), T;
    }, f.unstable_shouldYield = qe, f.unstable_wrapCallback = function(T) {
      var H = Z;
      return function() {
        var J = Z;
        Z = H;
        try {
          return T.apply(this, arguments);
        } finally {
          Z = J;
        }
      };
    };
  })(Df)), Df;
}
var Jh;
function uy() {
  return Jh || (Jh = 1, _f.exports = ny()), _f.exports;
}
var Of = { exports: {} }, lt = {};
var wh;
function cy() {
  if (wh) return lt;
  wh = 1;
  var f = Gf();
  function h(C) {
    var z = "https://react.dev/errors/" + C;
    if (1 < arguments.length) {
      z += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var F = 2; F < arguments.length; F++)
        z += "&args[]=" + encodeURIComponent(arguments[F]);
    }
    return "Minified React error #" + C + "; visit " + z + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function d() {
  }
  var s = {
    d: {
      f: d,
      r: function() {
        throw Error(h(522));
      },
      D: d,
      C: d,
      L: d,
      m: d,
      X: d,
      S: d,
      M: d
    },
    p: 0,
    findDOMNode: null
  }, S = Symbol.for("react.portal");
  function D(C, z, F) {
    var B = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: S,
      key: B == null ? null : "" + B,
      children: C,
      containerInfo: z,
      implementation: F
    };
  }
  var O = f.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function Y(C, z) {
    if (C === "font") return "";
    if (typeof z == "string")
      return z === "use-credentials" ? z : "";
  }
  return lt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = s, lt.createPortal = function(C, z) {
    var F = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!z || z.nodeType !== 1 && z.nodeType !== 9 && z.nodeType !== 11)
      throw Error(h(299));
    return D(C, z, null, F);
  }, lt.flushSync = function(C) {
    var z = O.T, F = s.p;
    try {
      if (O.T = null, s.p = 2, C) return C();
    } finally {
      O.T = z, s.p = F, s.d.f();
    }
  }, lt.preconnect = function(C, z) {
    typeof C == "string" && (z ? (z = z.crossOrigin, z = typeof z == "string" ? z === "use-credentials" ? z : "" : void 0) : z = null, s.d.C(C, z));
  }, lt.prefetchDNS = function(C) {
    typeof C == "string" && s.d.D(C);
  }, lt.preinit = function(C, z) {
    if (typeof C == "string" && z && typeof z.as == "string") {
      var F = z.as, B = Y(F, z.crossOrigin), Z = typeof z.integrity == "string" ? z.integrity : void 0, te = typeof z.fetchPriority == "string" ? z.fetchPriority : void 0;
      F === "style" ? s.d.S(
        C,
        typeof z.precedence == "string" ? z.precedence : void 0,
        {
          crossOrigin: B,
          integrity: Z,
          fetchPriority: te
        }
      ) : F === "script" && s.d.X(C, {
        crossOrigin: B,
        integrity: Z,
        fetchPriority: te,
        nonce: typeof z.nonce == "string" ? z.nonce : void 0
      });
    }
  }, lt.preinitModule = function(C, z) {
    if (typeof C == "string")
      if (typeof z == "object" && z !== null) {
        if (z.as == null || z.as === "script") {
          var F = Y(
            z.as,
            z.crossOrigin
          );
          s.d.M(C, {
            crossOrigin: F,
            integrity: typeof z.integrity == "string" ? z.integrity : void 0,
            nonce: typeof z.nonce == "string" ? z.nonce : void 0
          });
        }
      } else z == null && s.d.M(C);
  }, lt.preload = function(C, z) {
    if (typeof C == "string" && typeof z == "object" && z !== null && typeof z.as == "string") {
      var F = z.as, B = Y(F, z.crossOrigin);
      s.d.L(C, F, {
        crossOrigin: B,
        integrity: typeof z.integrity == "string" ? z.integrity : void 0,
        nonce: typeof z.nonce == "string" ? z.nonce : void 0,
        type: typeof z.type == "string" ? z.type : void 0,
        fetchPriority: typeof z.fetchPriority == "string" ? z.fetchPriority : void 0,
        referrerPolicy: typeof z.referrerPolicy == "string" ? z.referrerPolicy : void 0,
        imageSrcSet: typeof z.imageSrcSet == "string" ? z.imageSrcSet : void 0,
        imageSizes: typeof z.imageSizes == "string" ? z.imageSizes : void 0,
        media: typeof z.media == "string" ? z.media : void 0
      });
    }
  }, lt.preloadModule = function(C, z) {
    if (typeof C == "string")
      if (z) {
        var F = Y(z.as, z.crossOrigin);
        s.d.m(C, {
          as: typeof z.as == "string" && z.as !== "script" ? z.as : void 0,
          crossOrigin: F,
          integrity: typeof z.integrity == "string" ? z.integrity : void 0
        });
      } else s.d.m(C);
  }, lt.requestFormReset = function(C) {
    s.d.r(C);
  }, lt.unstable_batchedUpdates = function(C, z) {
    return C(z);
  }, lt.useFormState = function(C, z, F) {
    return O.H.useFormState(C, z, F);
  }, lt.useFormStatus = function() {
    return O.H.useHostTransitionStatus();
  }, lt.version = "19.2.0", lt;
}
var Wh;
function mm() {
  if (Wh) return Of.exports;
  Wh = 1;
  function f() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(f);
      } catch (h) {
        console.error(h);
      }
  }
  return f(), Of.exports = cy(), Of.exports;
}
var $h;
function iy() {
  if ($h) return qn;
  $h = 1;
  var f = uy(), h = Gf(), d = mm();
  function s(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++)
        t += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function S(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function D(e) {
    var t = e, l = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do
        t = e, (t.flags & 4098) !== 0 && (l = t.return), e = t.return;
      while (e);
    }
    return t.tag === 3 ? l : null;
  }
  function O(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function Y(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function C(e) {
    if (D(e) !== e)
      throw Error(s(188));
  }
  function z(e) {
    var t = e.alternate;
    if (!t) {
      if (t = D(e), t === null) throw Error(s(188));
      return t !== e ? null : e;
    }
    for (var l = e, a = t; ; ) {
      var n = l.return;
      if (n === null) break;
      var u = n.alternate;
      if (u === null) {
        if (a = n.return, a !== null) {
          l = a;
          continue;
        }
        break;
      }
      if (n.child === u.child) {
        for (u = n.child; u; ) {
          if (u === l) return C(n), e;
          if (u === a) return C(n), t;
          u = u.sibling;
        }
        throw Error(s(188));
      }
      if (l.return !== a.return) l = n, a = u;
      else {
        for (var i = !1, r = n.child; r; ) {
          if (r === l) {
            i = !0, l = n, a = u;
            break;
          }
          if (r === a) {
            i = !0, a = n, l = u;
            break;
          }
          r = r.sibling;
        }
        if (!i) {
          for (r = u.child; r; ) {
            if (r === l) {
              i = !0, l = u, a = n;
              break;
            }
            if (r === a) {
              i = !0, a = u, l = n;
              break;
            }
            r = r.sibling;
          }
          if (!i) throw Error(s(189));
        }
      }
      if (l.alternate !== a) throw Error(s(190));
    }
    if (l.tag !== 3) throw Error(s(188));
    return l.stateNode.current === l ? e : t;
  }
  function F(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = F(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var B = Object.assign, Z = Symbol.for("react.element"), te = Symbol.for("react.transitional.element"), k = Symbol.for("react.portal"), X = Symbol.for("react.fragment"), re = Symbol.for("react.strict_mode"), ue = Symbol.for("react.profiler"), Le = Symbol.for("react.consumer"), De = Symbol.for("react.context"), Oe = Symbol.for("react.forward_ref"), V = Symbol.for("react.suspense"), pe = Symbol.for("react.suspense_list"), I = Symbol.for("react.memo"), R = Symbol.for("react.lazy"), oe = Symbol.for("react.activity"), qe = Symbol.for("react.memo_cache_sentinel"), at = Symbol.iterator;
  function Be(e) {
    return e === null || typeof e != "object" ? null : (e = at && e[at] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var Ze = Symbol.for("react.client.reference");
  function Ae(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === Ze ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case X:
        return "Fragment";
      case ue:
        return "Profiler";
      case re:
        return "StrictMode";
      case V:
        return "Suspense";
      case pe:
        return "SuspenseList";
      case oe:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case k:
          return "Portal";
        case De:
          return e.displayName || "Context";
        case Le:
          return (e._context.displayName || "Context") + ".Consumer";
        case Oe:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case I:
          return t = e.displayName || null, t !== null ? t : Ae(e.type) || "Memo";
        case R:
          t = e._payload, e = e._init;
          try {
            return Ae(e(t));
          } catch {
          }
      }
    return null;
  }
  var Fe = Array.isArray, T = h.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, H = d.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, J = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, ge = [], de = -1;
  function y(e) {
    return { current: e };
  }
  function _(e) {
    0 > de || (e.current = ge[de], ge[de] = null, de--);
  }
  function U(e, t) {
    de++, ge[de] = e.current, e.current = t;
  }
  var G = y(null), W = y(null), P = y(null), se = y(null);
  function Je(e, t) {
    switch (U(P, t), U(W, e), U(G, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? dh(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = dh(t), e = yh(t, e);
        else
          switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    _(G), U(G, e);
  }
  function q() {
    _(G), _(W), _(P);
  }
  function we(e) {
    e.memoizedState !== null && U(se, e);
    var t = G.current, l = yh(t, e.type);
    t !== l && (U(W, e), U(G, l));
  }
  function ql(e) {
    W.current === e && (_(G), _(W)), se.current === e && (_(se), _n._currentValue = J);
  }
  var cc, Qf;
  function Hl(e) {
    if (cc === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        cc = t && t[1] || "", Qf = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + cc + e + Qf;
  }
  var ic = !1;
  function fc(e, t) {
    if (!e || ic) return "";
    ic = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var N = function() {
                throw Error();
              };
              if (Object.defineProperty(N.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(N, []);
                } catch (p) {
                  var b = p;
                }
                Reflect.construct(e, [], N);
              } else {
                try {
                  N.call();
                } catch (p) {
                  b = p;
                }
                e.call(N.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (p) {
                b = p;
              }
              (N = e()) && typeof N.catch == "function" && N.catch(function() {
              });
            }
          } catch (p) {
            if (p && b && typeof p.stack == "string")
              return [p.stack, b.stack];
          }
          return [null, null];
        }
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var n = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name"
      );
      n && n.configurable && Object.defineProperty(
        a.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var u = a.DetermineComponentFrameRoot(), i = u[0], r = u[1];
      if (i && r) {
        var o = i.split(`
`), E = r.split(`
`);
        for (n = a = 0; a < o.length && !o[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; n < E.length && !E[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (a === o.length || n === E.length)
          for (a = o.length - 1, n = E.length - 1; 1 <= a && 0 <= n && o[a] !== E[n]; )
            n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (o[a] !== E[n]) {
            if (a !== 1 || n !== 1)
              do
                if (a--, n--, 0 > n || o[a] !== E[n]) {
                  var M = `
` + o[a].replace(" at new ", " at ");
                  return e.displayName && M.includes("<anonymous>") && (M = M.replace("<anonymous>", e.displayName)), M;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      ic = !1, Error.prepareStackTrace = l;
    }
    return (l = e ? e.displayName || e.name : "") ? Hl(l) : "";
  }
  function Um(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return Hl(e.type);
      case 16:
        return Hl("Lazy");
      case 13:
        return e.child !== t && t !== null ? Hl("Suspense Fallback") : Hl("Suspense");
      case 19:
        return Hl("SuspenseList");
      case 0:
      case 15:
        return fc(e.type, !1);
      case 11:
        return fc(e.type.render, !1);
      case 1:
        return fc(e.type, !0);
      case 31:
        return Hl("Activity");
      default:
        return "";
    }
  }
  function Zf(e) {
    try {
      var t = "", l = null;
      do
        t += Um(e, l), l = e, e = e.return;
      while (e);
      return t;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var rc = Object.prototype.hasOwnProperty, sc = f.unstable_scheduleCallback, oc = f.unstable_cancelCallback, Bm = f.unstable_shouldYield, Rm = f.unstable_requestPaint, mt = f.unstable_now, xm = f.unstable_getCurrentPriorityLevel, Vf = f.unstable_ImmediatePriority, Kf = f.unstable_UserBlockingPriority, Bn = f.unstable_NormalPriority, Lm = f.unstable_LowPriority, Ff = f.unstable_IdlePriority, Gm = f.log, Ym = f.unstable_setDisableYieldValue, Ga = null, dt = null;
  function ul(e) {
    if (typeof Gm == "function" && Ym(e), dt && typeof dt.setStrictMode == "function")
      try {
        dt.setStrictMode(Ga, e);
      } catch {
      }
  }
  var yt = Math.clz32 ? Math.clz32 : Xm, km = Math.log, jm = Math.LN2;
  function Xm(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (km(e) / jm | 0) | 0;
  }
  var Rn = 256, xn = 262144, Ln = 4194304;
  function Ul(e) {
    var t = e & 42;
    if (t !== 0) return t;
    switch (e & -e) {
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
        return e & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
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
        return e;
    }
  }
  function Gn(e, t, l) {
    var a = e.pendingLanes;
    if (a === 0) return 0;
    var n = 0, u = e.suspendedLanes, i = e.pingedLanes;
    e = e.warmLanes;
    var r = a & 134217727;
    return r !== 0 ? (a = r & ~u, a !== 0 ? n = Ul(a) : (i &= r, i !== 0 ? n = Ul(i) : l || (l = r & ~e, l !== 0 && (n = Ul(l))))) : (r = a & ~u, r !== 0 ? n = Ul(r) : i !== 0 ? n = Ul(i) : l || (l = a & ~e, l !== 0 && (n = Ul(l)))), n === 0 ? 0 : t !== 0 && t !== n && (t & u) === 0 && (u = n & -n, l = t & -t, u >= l || u === 32 && (l & 4194048) !== 0) ? t : n;
  }
  function Ya(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function Qm(e, t) {
    switch (e) {
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
  function Jf() {
    var e = Ln;
    return Ln <<= 1, (Ln & 62914560) === 0 && (Ln = 4194304), e;
  }
  function hc(e) {
    for (var t = [], l = 0; 31 > l; l++) t.push(e);
    return t;
  }
  function ka(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function Zm(e, t, l, a, n, u) {
    var i = e.pendingLanes;
    e.pendingLanes = l, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= l, e.entangledLanes &= l, e.errorRecoveryDisabledLanes &= l, e.shellSuspendCounter = 0;
    var r = e.entanglements, o = e.expirationTimes, E = e.hiddenUpdates;
    for (l = i & ~l; 0 < l; ) {
      var M = 31 - yt(l), N = 1 << M;
      r[M] = 0, o[M] = -1;
      var b = E[M];
      if (b !== null)
        for (E[M] = null, M = 0; M < b.length; M++) {
          var p = b[M];
          p !== null && (p.lane &= -536870913);
        }
      l &= ~N;
    }
    a !== 0 && wf(e, a, 0), u !== 0 && n === 0 && e.tag !== 0 && (e.suspendedLanes |= u & ~(i & ~t));
  }
  function wf(e, t, l) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var a = 31 - yt(t);
    e.entangledLanes |= t, e.entanglements[a] = e.entanglements[a] | 1073741824 | l & 261930;
  }
  function Wf(e, t) {
    var l = e.entangledLanes |= t;
    for (e = e.entanglements; l; ) {
      var a = 31 - yt(l), n = 1 << a;
      n & t | e[a] & t && (e[a] |= t), l &= ~n;
    }
  }
  function $f(e, t) {
    var l = t & -t;
    return l = (l & 42) !== 0 ? 1 : mc(l), (l & (e.suspendedLanes | t)) !== 0 ? 0 : l;
  }
  function mc(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
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
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function dc(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function If() {
    var e = H.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : Gh(e.type));
  }
  function Pf(e, t) {
    var l = H.p;
    try {
      return H.p = e, t();
    } finally {
      H.p = l;
    }
  }
  var cl = Math.random().toString(36).slice(2), We = "__reactFiber$" + cl, ut = "__reactProps$" + cl, $l = "__reactContainer$" + cl, yc = "__reactEvents$" + cl, Vm = "__reactListeners$" + cl, Km = "__reactHandles$" + cl, er = "__reactResources$" + cl, ja = "__reactMarker$" + cl;
  function vc(e) {
    delete e[We], delete e[ut], delete e[yc], delete e[Vm], delete e[Km];
  }
  function Il(e) {
    var t = e[We];
    if (t) return t;
    for (var l = e.parentNode; l; ) {
      if (t = l[$l] || l[We]) {
        if (l = t.alternate, t.child !== null || l !== null && l.child !== null)
          for (e = zh(e); e !== null; ) {
            if (l = e[We]) return l;
            e = zh(e);
          }
        return t;
      }
      e = l, l = e.parentNode;
    }
    return null;
  }
  function Pl(e) {
    if (e = e[We] || e[$l]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function Xa(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(s(33));
  }
  function ea(e) {
    var t = e[er];
    return t || (t = e[er] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function Ve(e) {
    e[ja] = !0;
  }
  var tr = /* @__PURE__ */ new Set(), lr = {};
  function Bl(e, t) {
    ta(e, t), ta(e + "Capture", t);
  }
  function ta(e, t) {
    for (lr[e] = t, e = 0; e < t.length; e++)
      tr.add(t[e]);
  }
  var Fm = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), ar = {}, nr = {};
  function Jm(e) {
    return rc.call(nr, e) ? !0 : rc.call(ar, e) ? !1 : Fm.test(e) ? nr[e] = !0 : (ar[e] = !0, !1);
  }
  function Yn(e, t, l) {
    if (Jm(t))
      if (l === null) e.removeAttribute(t);
      else {
        switch (typeof l) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var a = t.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + l);
      }
  }
  function kn(e, t, l) {
    if (l === null) e.removeAttribute(t);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, "" + l);
    }
  }
  function jt(e, t, l, a) {
    if (a === null) e.removeAttribute(l);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(l);
          return;
      }
      e.setAttributeNS(t, l, "" + a);
    }
  }
  function Mt(e) {
    switch (typeof e) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function ur(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function wm(e, t, l) {
    var a = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    );
    if (!e.hasOwnProperty(t) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var n = a.get, u = a.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return n.call(this);
        },
        set: function(i) {
          l = "" + i, u.call(this, i);
        }
      }), Object.defineProperty(e, t, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return l;
        },
        setValue: function(i) {
          l = "" + i;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function gc(e) {
    if (!e._valueTracker) {
      var t = ur(e) ? "checked" : "value";
      e._valueTracker = wm(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function cr(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(), a = "";
    return e && (a = ur(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== l ? (t.setValue(e), !0) : !1;
  }
  function jn(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var Wm = /[\n"\\]/g;
  function Tt(e) {
    return e.replace(
      Wm,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Ec(e, t, l, a, n, u, i, r) {
    e.name = "", i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" ? e.type = i : e.removeAttribute("type"), t != null ? i === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + Mt(t)) : e.value !== "" + Mt(t) && (e.value = "" + Mt(t)) : i !== "submit" && i !== "reset" || e.removeAttribute("value"), t != null ? bc(e, i, Mt(t)) : l != null ? bc(e, i, Mt(l)) : a != null && e.removeAttribute("value"), n == null && u != null && (e.defaultChecked = !!u), n != null && (e.checked = n && typeof n != "function" && typeof n != "symbol"), r != null && typeof r != "function" && typeof r != "symbol" && typeof r != "boolean" ? e.name = "" + Mt(r) : e.removeAttribute("name");
  }
  function ir(e, t, l, a, n, u, i, r) {
    if (u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (e.type = u), t != null || l != null) {
      if (!(u !== "submit" && u !== "reset" || t != null)) {
        gc(e);
        return;
      }
      l = l != null ? "" + Mt(l) : "", t = t != null ? "" + Mt(t) : l, r || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = r ? e.checked : !!a, e.defaultChecked = !!a, i != null && typeof i != "function" && typeof i != "symbol" && typeof i != "boolean" && (e.name = i), gc(e);
  }
  function bc(e, t, l) {
    t === "number" && jn(e.ownerDocument) === e || e.defaultValue === "" + l || (e.defaultValue = "" + l);
  }
  function la(e, t, l, a) {
    if (e = e.options, t) {
      t = {};
      for (var n = 0; n < l.length; n++)
        t["$" + l[n]] = !0;
      for (l = 0; l < e.length; l++)
        n = t.hasOwnProperty("$" + e[l].value), e[l].selected !== n && (e[l].selected = n), n && a && (e[l].defaultSelected = !0);
    } else {
      for (l = "" + Mt(l), t = null, n = 0; n < e.length; n++) {
        if (e[n].value === l) {
          e[n].selected = !0, a && (e[n].defaultSelected = !0);
          return;
        }
        t !== null || e[n].disabled || (t = e[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function fr(e, t, l) {
    if (t != null && (t = "" + Mt(t), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + Mt(l) : "";
  }
  function rr(e, t, l, a) {
    if (t == null) {
      if (a != null) {
        if (l != null) throw Error(s(92));
        if (Fe(a)) {
          if (1 < a.length) throw Error(s(93));
          a = a[0];
        }
        l = a;
      }
      l == null && (l = ""), t = l;
    }
    l = Mt(t), e.defaultValue = l, a = e.textContent, a === l && a !== "" && a !== null && (e.value = a), gc(e);
  }
  function aa(e, t) {
    if (t) {
      var l = e.firstChild;
      if (l && l === e.lastChild && l.nodeType === 3) {
        l.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var $m = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function sr(e, t, l) {
    var a = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, l) : typeof l != "number" || l === 0 || $m.has(t) ? t === "float" ? e.cssFloat = l : e[t] = ("" + l).trim() : e[t] = l + "px";
  }
  function or(e, t, l) {
    if (t != null && typeof t != "object")
      throw Error(s(62));
    if (e = e.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "");
      for (var n in t)
        a = t[n], t.hasOwnProperty(n) && l[n] !== a && sr(e, n, a);
    } else
      for (var u in t)
        t.hasOwnProperty(u) && sr(e, u, t[u]);
  }
  function pc(e) {
    if (e.indexOf("-") === -1) return !1;
    switch (e) {
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
  var Im = /* @__PURE__ */ new Map([
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
  ]), Pm = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Xn(e) {
    return Pm.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function Xt() {
  }
  var Sc = null;
  function zc(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var na = null, ua = null;
  function hr(e) {
    var t = Pl(e);
    if (t && (e = t.stateNode)) {
      var l = e[ut] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (Ec(
            e,
            l.value,
            l.defaultValue,
            l.defaultValue,
            l.checked,
            l.defaultChecked,
            l.type,
            l.name
          ), t = l.name, l.type === "radio" && t != null) {
            for (l = e; l.parentNode; ) l = l.parentNode;
            for (l = l.querySelectorAll(
              'input[name="' + Tt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < l.length; t++) {
              var a = l[t];
              if (a !== e && a.form === e.form) {
                var n = a[ut] || null;
                if (!n) throw Error(s(90));
                Ec(
                  a,
                  n.value,
                  n.defaultValue,
                  n.defaultValue,
                  n.checked,
                  n.defaultChecked,
                  n.type,
                  n.name
                );
              }
            }
            for (t = 0; t < l.length; t++)
              a = l[t], a.form === e.form && cr(a);
          }
          break e;
        case "textarea":
          fr(e, l.value, l.defaultValue);
          break e;
        case "select":
          t = l.value, t != null && la(e, !!l.multiple, t, !1);
      }
    }
  }
  var Mc = !1;
  function mr(e, t, l) {
    if (Mc) return e(t, l);
    Mc = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (Mc = !1, (na !== null || ua !== null) && (Ou(), na && (t = na, e = ua, ua = na = null, hr(t), e)))
        for (t = 0; t < e.length; t++) hr(e[t]);
    }
  }
  function Qa(e, t) {
    var l = e.stateNode;
    if (l === null) return null;
    var a = l[ut] || null;
    if (a === null) return null;
    l = a[t];
    e: switch (t) {
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
        (a = !a.disabled) || (e = e.type, a = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !a;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (l && typeof l != "function")
      throw Error(
        s(231, t, typeof l)
      );
    return l;
  }
  var Qt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Tc = !1;
  if (Qt)
    try {
      var Za = {};
      Object.defineProperty(Za, "passive", {
        get: function() {
          Tc = !0;
        }
      }), window.addEventListener("test", Za, Za), window.removeEventListener("test", Za, Za);
    } catch {
      Tc = !1;
    }
  var il = null, Ac = null, Qn = null;
  function dr() {
    if (Qn) return Qn;
    var e, t = Ac, l = t.length, a, n = "value" in il ? il.value : il.textContent, u = n.length;
    for (e = 0; e < l && t[e] === n[e]; e++) ;
    var i = l - e;
    for (a = 1; a <= i && t[l - a] === n[u - a]; a++) ;
    return Qn = n.slice(e, 1 < a ? 1 - a : void 0);
  }
  function Zn(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Vn() {
    return !0;
  }
  function yr() {
    return !1;
  }
  function ct(e) {
    function t(l, a, n, u, i) {
      this._reactName = l, this._targetInst = n, this.type = a, this.nativeEvent = u, this.target = i, this.currentTarget = null;
      for (var r in e)
        e.hasOwnProperty(r) && (l = e[r], this[r] = l ? l(u) : u[r]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? Vn : yr, this.isPropagationStopped = yr, this;
    }
    return B(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = Vn);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = Vn);
      },
      persist: function() {
      },
      isPersistent: Vn
    }), t;
  }
  var Rl = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Kn = ct(Rl), Va = B({}, Rl, { view: 0, detail: 0 }), ed = ct(Va), Nc, _c, Ka, Fn = B({}, Va, {
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
    getModifierState: Oc,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== Ka && (Ka && e.type === "mousemove" ? (Nc = e.screenX - Ka.screenX, _c = e.screenY - Ka.screenY) : _c = Nc = 0, Ka = e), Nc);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : _c;
    }
  }), vr = ct(Fn), td = B({}, Fn, { dataTransfer: 0 }), ld = ct(td), ad = B({}, Va, { relatedTarget: 0 }), Dc = ct(ad), nd = B({}, Rl, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), ud = ct(nd), cd = B({}, Rl, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), id = ct(cd), fd = B({}, Rl, { data: 0 }), gr = ct(fd), rd = {
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
  }, sd = {
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
  }, od = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function hd(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = od[e]) ? !!t[e] : !1;
  }
  function Oc() {
    return hd;
  }
  var md = B({}, Va, {
    key: function(e) {
      if (e.key) {
        var t = rd[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Zn(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? sd[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Oc,
    charCode: function(e) {
      return e.type === "keypress" ? Zn(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Zn(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), dd = ct(md), yd = B({}, Fn, {
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
  }), Er = ct(yd), vd = B({}, Va, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Oc
  }), gd = ct(vd), Ed = B({}, Rl, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), bd = ct(Ed), pd = B({}, Fn, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Sd = ct(pd), zd = B({}, Rl, {
    newState: 0,
    oldState: 0
  }), Md = ct(zd), Td = [9, 13, 27, 32], Cc = Qt && "CompositionEvent" in window, Fa = null;
  Qt && "documentMode" in document && (Fa = document.documentMode);
  var Ad = Qt && "TextEvent" in window && !Fa, br = Qt && (!Cc || Fa && 8 < Fa && 11 >= Fa), pr = " ", Sr = !1;
  function zr(e, t) {
    switch (e) {
      case "keyup":
        return Td.indexOf(t.keyCode) !== -1;
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
  function Mr(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var ca = !1;
  function Nd(e, t) {
    switch (e) {
      case "compositionend":
        return Mr(t);
      case "keypress":
        return t.which !== 32 ? null : (Sr = !0, pr);
      case "textInput":
        return e = t.data, e === pr && Sr ? null : e;
      default:
        return null;
    }
  }
  function _d(e, t) {
    if (ca)
      return e === "compositionend" || !Cc && zr(e, t) ? (e = dr(), Qn = Ac = il = null, ca = !1, e) : null;
    switch (e) {
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
        return br && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Dd = {
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
  function Tr(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Dd[e.type] : t === "textarea";
  }
  function Ar(e, t, l, a) {
    na ? ua ? ua.push(a) : ua = [a] : na = a, t = xu(t, "onChange"), 0 < t.length && (l = new Kn(
      "onChange",
      "change",
      null,
      l,
      a
    ), e.push({ event: l, listeners: t }));
  }
  var Ja = null, wa = null;
  function Od(e) {
    fh(e, 0);
  }
  function Jn(e) {
    var t = Xa(e);
    if (cr(t)) return e;
  }
  function Nr(e, t) {
    if (e === "change") return t;
  }
  var _r = !1;
  if (Qt) {
    var qc;
    if (Qt) {
      var Hc = "oninput" in document;
      if (!Hc) {
        var Dr = document.createElement("div");
        Dr.setAttribute("oninput", "return;"), Hc = typeof Dr.oninput == "function";
      }
      qc = Hc;
    } else qc = !1;
    _r = qc && (!document.documentMode || 9 < document.documentMode);
  }
  function Or() {
    Ja && (Ja.detachEvent("onpropertychange", Cr), wa = Ja = null);
  }
  function Cr(e) {
    if (e.propertyName === "value" && Jn(wa)) {
      var t = [];
      Ar(
        t,
        wa,
        e,
        zc(e)
      ), mr(Od, t);
    }
  }
  function Cd(e, t, l) {
    e === "focusin" ? (Or(), Ja = t, wa = l, Ja.attachEvent("onpropertychange", Cr)) : e === "focusout" && Or();
  }
  function qd(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Jn(wa);
  }
  function Hd(e, t) {
    if (e === "click") return Jn(t);
  }
  function Ud(e, t) {
    if (e === "input" || e === "change")
      return Jn(t);
  }
  function Bd(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var vt = typeof Object.is == "function" ? Object.is : Bd;
  function Wa(e, t) {
    if (vt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var l = Object.keys(e), a = Object.keys(t);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var n = l[a];
      if (!rc.call(t, n) || !vt(e[n], t[n]))
        return !1;
    }
    return !0;
  }
  function qr(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Hr(e, t) {
    var l = qr(e);
    e = 0;
    for (var a; l; ) {
      if (l.nodeType === 3) {
        if (a = e + l.textContent.length, e <= t && a >= t)
          return { node: l, offset: t - e };
        e = a;
      }
      e: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break e;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = qr(l);
    }
  }
  function Ur(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Ur(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Br(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = jn(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = jn(e.document);
    }
    return t;
  }
  function Uc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var Rd = Qt && "documentMode" in document && 11 >= document.documentMode, ia = null, Bc = null, $a = null, Rc = !1;
  function Rr(e, t, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    Rc || ia == null || ia !== jn(a) || (a = ia, "selectionStart" in a && Uc(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), $a && Wa($a, a) || ($a = a, a = xu(Bc, "onSelect"), 0 < a.length && (t = new Kn(
      "onSelect",
      "select",
      null,
      t,
      l
    ), e.push({ event: t, listeners: a }), t.target = ia)));
  }
  function xl(e, t) {
    var l = {};
    return l[e.toLowerCase()] = t.toLowerCase(), l["Webkit" + e] = "webkit" + t, l["Moz" + e] = "moz" + t, l;
  }
  var fa = {
    animationend: xl("Animation", "AnimationEnd"),
    animationiteration: xl("Animation", "AnimationIteration"),
    animationstart: xl("Animation", "AnimationStart"),
    transitionrun: xl("Transition", "TransitionRun"),
    transitionstart: xl("Transition", "TransitionStart"),
    transitioncancel: xl("Transition", "TransitionCancel"),
    transitionend: xl("Transition", "TransitionEnd")
  }, xc = {}, xr = {};
  Qt && (xr = document.createElement("div").style, "AnimationEvent" in window || (delete fa.animationend.animation, delete fa.animationiteration.animation, delete fa.animationstart.animation), "TransitionEvent" in window || delete fa.transitionend.transition);
  function Ll(e) {
    if (xc[e]) return xc[e];
    if (!fa[e]) return e;
    var t = fa[e], l;
    for (l in t)
      if (t.hasOwnProperty(l) && l in xr)
        return xc[e] = t[l];
    return e;
  }
  var Lr = Ll("animationend"), Gr = Ll("animationiteration"), Yr = Ll("animationstart"), xd = Ll("transitionrun"), Ld = Ll("transitionstart"), Gd = Ll("transitioncancel"), kr = Ll("transitionend"), jr = /* @__PURE__ */ new Map(), Lc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Lc.push("scrollEnd");
  function Ut(e, t) {
    jr.set(e, t), Bl(t, [e]);
  }
  var wn = typeof reportError == "function" ? reportError : function(e) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var t = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
        error: e
      });
      if (!window.dispatchEvent(t)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", e);
      return;
    }
    console.error(e);
  }, At = [], ra = 0, Gc = 0;
  function Wn() {
    for (var e = ra, t = Gc = ra = 0; t < e; ) {
      var l = At[t];
      At[t++] = null;
      var a = At[t];
      At[t++] = null;
      var n = At[t];
      At[t++] = null;
      var u = At[t];
      if (At[t++] = null, a !== null && n !== null) {
        var i = a.pending;
        i === null ? n.next = n : (n.next = i.next, i.next = n), a.pending = n;
      }
      u !== 0 && Xr(l, n, u);
    }
  }
  function $n(e, t, l, a) {
    At[ra++] = e, At[ra++] = t, At[ra++] = l, At[ra++] = a, Gc |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function Yc(e, t, l, a) {
    return $n(e, t, l, a), In(e);
  }
  function Gl(e, t) {
    return $n(e, null, null, t), In(e);
  }
  function Xr(e, t, l) {
    e.lanes |= l;
    var a = e.alternate;
    a !== null && (a.lanes |= l);
    for (var n = !1, u = e.return; u !== null; )
      u.childLanes |= l, a = u.alternate, a !== null && (a.childLanes |= l), u.tag === 22 && (e = u.stateNode, e === null || e._visibility & 1 || (n = !0)), e = u, u = u.return;
    return e.tag === 3 ? (u = e.stateNode, n && t !== null && (n = 31 - yt(l), e = u.hiddenUpdates, a = e[n], a === null ? e[n] = [t] : a.push(t), t.lane = l | 536870912), u) : null;
  }
  function In(e) {
    if (50 < pn)
      throw pn = 0, Ji = null, Error(s(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var sa = {};
  function Yd(e, t, l, a) {
    this.tag = e, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function gt(e, t, l, a) {
    return new Yd(e, t, l, a);
  }
  function kc(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Zt(e, t) {
    var l = e.alternate;
    return l === null ? (l = gt(
      e.tag,
      t,
      e.key,
      e.mode
    ), l.elementType = e.elementType, l.type = e.type, l.stateNode = e.stateNode, l.alternate = e, e.alternate = l) : (l.pendingProps = t, l.type = e.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = e.flags & 65011712, l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, t = e.dependencies, l.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, l.sibling = e.sibling, l.index = e.index, l.ref = e.ref, l.refCleanup = e.refCleanup, l;
  }
  function Qr(e, t) {
    e.flags &= 65011714;
    var l = e.alternate;
    return l === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, e.type = l.type, t = l.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function Pn(e, t, l, a, n, u) {
    var i = 0;
    if (a = e, typeof e == "function") kc(e) && (i = 1);
    else if (typeof e == "string")
      i = Z0(
        e,
        l,
        G.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (e) {
        case oe:
          return e = gt(31, l, t, n), e.elementType = oe, e.lanes = u, e;
        case X:
          return Yl(l.children, n, u, t);
        case re:
          i = 8, n |= 24;
          break;
        case ue:
          return e = gt(12, l, t, n | 2), e.elementType = ue, e.lanes = u, e;
        case V:
          return e = gt(13, l, t, n), e.elementType = V, e.lanes = u, e;
        case pe:
          return e = gt(19, l, t, n), e.elementType = pe, e.lanes = u, e;
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case De:
                i = 10;
                break e;
              case Le:
                i = 9;
                break e;
              case Oe:
                i = 11;
                break e;
              case I:
                i = 14;
                break e;
              case R:
                i = 16, a = null;
                break e;
            }
          i = 29, l = Error(
            s(130, e === null ? "null" : typeof e, "")
          ), a = null;
      }
    return t = gt(i, l, t, n), t.elementType = e, t.type = a, t.lanes = u, t;
  }
  function Yl(e, t, l, a) {
    return e = gt(7, e, a, t), e.lanes = l, e;
  }
  function jc(e, t, l) {
    return e = gt(6, e, null, t), e.lanes = l, e;
  }
  function Zr(e) {
    var t = gt(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function Xc(e, t, l) {
    return t = gt(
      4,
      e.children !== null ? e.children : [],
      e.key,
      t
    ), t.lanes = l, t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    }, t;
  }
  var Vr = /* @__PURE__ */ new WeakMap();
  function Nt(e, t) {
    if (typeof e == "object" && e !== null) {
      var l = Vr.get(e);
      return l !== void 0 ? l : (t = {
        value: e,
        source: t,
        stack: Zf(t)
      }, Vr.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: Zf(t)
    };
  }
  var oa = [], ha = 0, eu = null, Ia = 0, _t = [], Dt = 0, fl = null, Lt = 1, Gt = "";
  function Vt(e, t) {
    oa[ha++] = Ia, oa[ha++] = eu, eu = e, Ia = t;
  }
  function Kr(e, t, l) {
    _t[Dt++] = Lt, _t[Dt++] = Gt, _t[Dt++] = fl, fl = e;
    var a = Lt;
    e = Gt;
    var n = 32 - yt(a) - 1;
    a &= ~(1 << n), l += 1;
    var u = 32 - yt(t) + n;
    if (30 < u) {
      var i = n - n % 5;
      u = (a & (1 << i) - 1).toString(32), a >>= i, n -= i, Lt = 1 << 32 - yt(t) + n | l << n | a, Gt = u + e;
    } else
      Lt = 1 << u | l << n | a, Gt = e;
  }
  function Qc(e) {
    e.return !== null && (Vt(e, 1), Kr(e, 1, 0));
  }
  function Zc(e) {
    for (; e === eu; )
      eu = oa[--ha], oa[ha] = null, Ia = oa[--ha], oa[ha] = null;
    for (; e === fl; )
      fl = _t[--Dt], _t[Dt] = null, Gt = _t[--Dt], _t[Dt] = null, Lt = _t[--Dt], _t[Dt] = null;
  }
  function Fr(e, t) {
    _t[Dt++] = Lt, _t[Dt++] = Gt, _t[Dt++] = fl, Lt = t.id, Gt = t.overflow, fl = e;
  }
  var $e = null, Ne = null, fe = !1, rl = null, Ot = !1, Vc = Error(s(519));
  function sl(e) {
    var t = Error(
      s(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Pa(Nt(t, e)), Vc;
  }
  function Jr(e) {
    var t = e.stateNode, l = e.type, a = e.memoizedProps;
    switch (t[We] = e, t[ut] = a, l) {
      case "dialog":
        ne("cancel", t), ne("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        ne("load", t);
        break;
      case "video":
      case "audio":
        for (l = 0; l < zn.length; l++)
          ne(zn[l], t);
        break;
      case "source":
        ne("error", t);
        break;
      case "img":
      case "image":
      case "link":
        ne("error", t), ne("load", t);
        break;
      case "details":
        ne("toggle", t);
        break;
      case "input":
        ne("invalid", t), ir(
          t,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        );
        break;
      case "select":
        ne("invalid", t);
        break;
      case "textarea":
        ne("invalid", t), rr(t, a.value, a.defaultValue, a.children);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || t.textContent === "" + l || a.suppressHydrationWarning === !0 || hh(t.textContent, l) ? (a.popover != null && (ne("beforetoggle", t), ne("toggle", t)), a.onScroll != null && ne("scroll", t), a.onScrollEnd != null && ne("scrollend", t), a.onClick != null && (t.onclick = Xt), t = !0) : t = !1, t || sl(e, !0);
  }
  function wr(e) {
    for ($e = e.return; $e; )
      switch ($e.tag) {
        case 5:
        case 31:
        case 13:
          Ot = !1;
          return;
        case 27:
        case 3:
          Ot = !0;
          return;
        default:
          $e = $e.return;
      }
  }
  function ma(e) {
    if (e !== $e) return !1;
    if (!fe) return wr(e), fe = !0, !1;
    var t = e.tag, l;
    if ((l = t !== 3 && t !== 27) && ((l = t === 5) && (l = e.type, l = !(l !== "form" && l !== "button") || sf(e.type, e.memoizedProps)), l = !l), l && Ne && sl(e), wr(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(317));
      Ne = Sh(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(317));
      Ne = Sh(e);
    } else
      t === 27 ? (t = Ne, Tl(e.type) ? (e = yf, yf = null, Ne = e) : Ne = t) : Ne = $e ? qt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function kl() {
    Ne = $e = null, fe = !1;
  }
  function Kc() {
    var e = rl;
    return e !== null && (st === null ? st = e : st.push.apply(
      st,
      e
    ), rl = null), e;
  }
  function Pa(e) {
    rl === null ? rl = [e] : rl.push(e);
  }
  var Fc = y(null), jl = null, Kt = null;
  function ol(e, t, l) {
    U(Fc, t._currentValue), t._currentValue = l;
  }
  function Ft(e) {
    e._currentValue = Fc.current, _(Fc);
  }
  function Jc(e, t, l) {
    for (; e !== null; ) {
      var a = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), e === l) break;
      e = e.return;
    }
  }
  function wc(e, t, l, a) {
    var n = e.child;
    for (n !== null && (n.return = e); n !== null; ) {
      var u = n.dependencies;
      if (u !== null) {
        var i = n.child;
        u = u.firstContext;
        e: for (; u !== null; ) {
          var r = u;
          u = n;
          for (var o = 0; o < t.length; o++)
            if (r.context === t[o]) {
              u.lanes |= l, r = u.alternate, r !== null && (r.lanes |= l), Jc(
                u.return,
                l,
                e
              ), a || (i = null);
              break e;
            }
          u = r.next;
        }
      } else if (n.tag === 18) {
        if (i = n.return, i === null) throw Error(s(341));
        i.lanes |= l, u = i.alternate, u !== null && (u.lanes |= l), Jc(i, l, e), i = null;
      } else i = n.child;
      if (i !== null) i.return = n;
      else
        for (i = n; i !== null; ) {
          if (i === e) {
            i = null;
            break;
          }
          if (n = i.sibling, n !== null) {
            n.return = i.return, i = n;
            break;
          }
          i = i.return;
        }
      n = i;
    }
  }
  function da(e, t, l, a) {
    e = null;
    for (var n = t, u = !1; n !== null; ) {
      if (!u) {
        if ((n.flags & 524288) !== 0) u = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var i = n.alternate;
        if (i === null) throw Error(s(387));
        if (i = i.memoizedProps, i !== null) {
          var r = n.type;
          vt(n.pendingProps.value, i.value) || (e !== null ? e.push(r) : e = [r]);
        }
      } else if (n === se.current) {
        if (i = n.alternate, i === null) throw Error(s(387));
        i.memoizedState.memoizedState !== n.memoizedState.memoizedState && (e !== null ? e.push(_n) : e = [_n]);
      }
      n = n.return;
    }
    e !== null && wc(
      t,
      e,
      l,
      a
    ), t.flags |= 262144;
  }
  function tu(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!vt(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function Xl(e) {
    jl = e, Kt = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function Ie(e) {
    return Wr(jl, e);
  }
  function lu(e, t) {
    return jl === null && Xl(e), Wr(e, t);
  }
  function Wr(e, t) {
    var l = t._currentValue;
    if (t = { context: t, memoizedValue: l, next: null }, Kt === null) {
      if (e === null) throw Error(s(308));
      Kt = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else Kt = Kt.next = t;
    return l;
  }
  var kd = typeof AbortController < "u" ? AbortController : function() {
    var e = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(l, a) {
        e.push(a);
      }
    };
    this.abort = function() {
      t.aborted = !0, e.forEach(function(l) {
        return l();
      });
    };
  }, jd = f.unstable_scheduleCallback, Xd = f.unstable_NormalPriority, Ge = {
    $$typeof: De,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Wc() {
    return {
      controller: new kd(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function en(e) {
    e.refCount--, e.refCount === 0 && jd(Xd, function() {
      e.controller.abort();
    });
  }
  var tn = null, $c = 0, ya = 0, va = null;
  function Qd(e, t) {
    if (tn === null) {
      var l = tn = [];
      $c = 0, ya = ef(), va = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return $c++, t.then($r, $r), t;
  }
  function $r() {
    if (--$c === 0 && tn !== null) {
      va !== null && (va.status = "fulfilled");
      var e = tn;
      tn = null, ya = 0, va = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function Zd(e, t) {
    var l = [], a = {
      status: "pending",
      value: null,
      reason: null,
      then: function(n) {
        l.push(n);
      }
    };
    return e.then(
      function() {
        a.status = "fulfilled", a.value = t;
        for (var n = 0; n < l.length; n++) (0, l[n])(t);
      },
      function(n) {
        for (a.status = "rejected", a.reason = n, n = 0; n < l.length; n++)
          (0, l[n])(void 0);
      }
    ), a;
  }
  var Ir = T.S;
  T.S = function(e, t) {
    xo = mt(), typeof t == "object" && t !== null && typeof t.then == "function" && Qd(e, t), Ir !== null && Ir(e, t);
  };
  var Ql = y(null);
  function Ic() {
    var e = Ql.current;
    return e !== null ? e : Te.pooledCache;
  }
  function au(e, t) {
    t === null ? U(Ql, Ql.current) : U(Ql, t.pool);
  }
  function Pr() {
    var e = Ic();
    return e === null ? null : { parent: Ge._currentValue, pool: e };
  }
  var ga = Error(s(460)), Pc = Error(s(474)), nu = Error(s(542)), uu = { then: function() {
  } };
  function es(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function ts(e, t, l) {
    switch (l = e[l], l === void 0 ? e.push(t) : l !== t && (t.then(Xt, Xt), t = l), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, as(e), e;
      default:
        if (typeof t.status == "string") t.then(Xt, Xt);
        else {
          if (e = Te, e !== null && 100 < e.shellSuspendCounter)
            throw Error(s(482));
          e = t, e.status = "pending", e.then(
            function(a) {
              if (t.status === "pending") {
                var n = t;
                n.status = "fulfilled", n.value = a;
              }
            },
            function(a) {
              if (t.status === "pending") {
                var n = t;
                n.status = "rejected", n.reason = a;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, as(e), e;
        }
        throw Vl = t, ga;
    }
  }
  function Zl(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (l) {
      throw l !== null && typeof l == "object" && typeof l.then == "function" ? (Vl = l, ga) : l;
    }
  }
  var Vl = null;
  function ls() {
    if (Vl === null) throw Error(s(459));
    var e = Vl;
    return Vl = null, e;
  }
  function as(e) {
    if (e === ga || e === nu)
      throw Error(s(483));
  }
  var Ea = null, ln = 0;
  function cu(e) {
    var t = ln;
    return ln += 1, Ea === null && (Ea = []), ts(Ea, e, t);
  }
  function an(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function iu(e, t) {
    throw t.$$typeof === Z ? Error(s(525)) : (e = Object.prototype.toString.call(t), Error(
      s(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function ns(e) {
    function t(v, m) {
      if (e) {
        var g = v.deletions;
        g === null ? (v.deletions = [m], v.flags |= 16) : g.push(m);
      }
    }
    function l(v, m) {
      if (!e) return null;
      for (; m !== null; )
        t(v, m), m = m.sibling;
      return null;
    }
    function a(v) {
      for (var m = /* @__PURE__ */ new Map(); v !== null; )
        v.key !== null ? m.set(v.key, v) : m.set(v.index, v), v = v.sibling;
      return m;
    }
    function n(v, m) {
      return v = Zt(v, m), v.index = 0, v.sibling = null, v;
    }
    function u(v, m, g) {
      return v.index = g, e ? (g = v.alternate, g !== null ? (g = g.index, g < m ? (v.flags |= 67108866, m) : g) : (v.flags |= 67108866, m)) : (v.flags |= 1048576, m);
    }
    function i(v) {
      return e && v.alternate === null && (v.flags |= 67108866), v;
    }
    function r(v, m, g, A) {
      return m === null || m.tag !== 6 ? (m = jc(g, v.mode, A), m.return = v, m) : (m = n(m, g), m.return = v, m);
    }
    function o(v, m, g, A) {
      var Q = g.type;
      return Q === X ? M(
        v,
        m,
        g.props.children,
        A,
        g.key
      ) : m !== null && (m.elementType === Q || typeof Q == "object" && Q !== null && Q.$$typeof === R && Zl(Q) === m.type) ? (m = n(m, g.props), an(m, g), m.return = v, m) : (m = Pn(
        g.type,
        g.key,
        g.props,
        null,
        v.mode,
        A
      ), an(m, g), m.return = v, m);
    }
    function E(v, m, g, A) {
      return m === null || m.tag !== 4 || m.stateNode.containerInfo !== g.containerInfo || m.stateNode.implementation !== g.implementation ? (m = Xc(g, v.mode, A), m.return = v, m) : (m = n(m, g.children || []), m.return = v, m);
    }
    function M(v, m, g, A, Q) {
      return m === null || m.tag !== 7 ? (m = Yl(
        g,
        v.mode,
        A,
        Q
      ), m.return = v, m) : (m = n(m, g), m.return = v, m);
    }
    function N(v, m, g) {
      if (typeof m == "string" && m !== "" || typeof m == "number" || typeof m == "bigint")
        return m = jc(
          "" + m,
          v.mode,
          g
        ), m.return = v, m;
      if (typeof m == "object" && m !== null) {
        switch (m.$$typeof) {
          case te:
            return g = Pn(
              m.type,
              m.key,
              m.props,
              null,
              v.mode,
              g
            ), an(g, m), g.return = v, g;
          case k:
            return m = Xc(
              m,
              v.mode,
              g
            ), m.return = v, m;
          case R:
            return m = Zl(m), N(v, m, g);
        }
        if (Fe(m) || Be(m))
          return m = Yl(
            m,
            v.mode,
            g,
            null
          ), m.return = v, m;
        if (typeof m.then == "function")
          return N(v, cu(m), g);
        if (m.$$typeof === De)
          return N(
            v,
            lu(v, m),
            g
          );
        iu(v, m);
      }
      return null;
    }
    function b(v, m, g, A) {
      var Q = m !== null ? m.key : null;
      if (typeof g == "string" && g !== "" || typeof g == "number" || typeof g == "bigint")
        return Q !== null ? null : r(v, m, "" + g, A);
      if (typeof g == "object" && g !== null) {
        switch (g.$$typeof) {
          case te:
            return g.key === Q ? o(v, m, g, A) : null;
          case k:
            return g.key === Q ? E(v, m, g, A) : null;
          case R:
            return g = Zl(g), b(v, m, g, A);
        }
        if (Fe(g) || Be(g))
          return Q !== null ? null : M(v, m, g, A, null);
        if (typeof g.then == "function")
          return b(
            v,
            m,
            cu(g),
            A
          );
        if (g.$$typeof === De)
          return b(
            v,
            m,
            lu(v, g),
            A
          );
        iu(v, g);
      }
      return null;
    }
    function p(v, m, g, A, Q) {
      if (typeof A == "string" && A !== "" || typeof A == "number" || typeof A == "bigint")
        return v = v.get(g) || null, r(m, v, "" + A, Q);
      if (typeof A == "object" && A !== null) {
        switch (A.$$typeof) {
          case te:
            return v = v.get(
              A.key === null ? g : A.key
            ) || null, o(m, v, A, Q);
          case k:
            return v = v.get(
              A.key === null ? g : A.key
            ) || null, E(m, v, A, Q);
          case R:
            return A = Zl(A), p(
              v,
              m,
              g,
              A,
              Q
            );
        }
        if (Fe(A) || Be(A))
          return v = v.get(g) || null, M(m, v, A, Q, null);
        if (typeof A.then == "function")
          return p(
            v,
            m,
            g,
            cu(A),
            Q
          );
        if (A.$$typeof === De)
          return p(
            v,
            m,
            g,
            lu(m, A),
            Q
          );
        iu(m, A);
      }
      return null;
    }
    function x(v, m, g, A) {
      for (var Q = null, he = null, j = m, le = m = 0, ie = null; j !== null && le < g.length; le++) {
        j.index > le ? (ie = j, j = null) : ie = j.sibling;
        var me = b(
          v,
          j,
          g[le],
          A
        );
        if (me === null) {
          j === null && (j = ie);
          break;
        }
        e && j && me.alternate === null && t(v, j), m = u(me, m, le), he === null ? Q = me : he.sibling = me, he = me, j = ie;
      }
      if (le === g.length)
        return l(v, j), fe && Vt(v, le), Q;
      if (j === null) {
        for (; le < g.length; le++)
          j = N(v, g[le], A), j !== null && (m = u(
            j,
            m,
            le
          ), he === null ? Q = j : he.sibling = j, he = j);
        return fe && Vt(v, le), Q;
      }
      for (j = a(j); le < g.length; le++)
        ie = p(
          j,
          v,
          le,
          g[le],
          A
        ), ie !== null && (e && ie.alternate !== null && j.delete(
          ie.key === null ? le : ie.key
        ), m = u(
          ie,
          m,
          le
        ), he === null ? Q = ie : he.sibling = ie, he = ie);
      return e && j.forEach(function(Ol) {
        return t(v, Ol);
      }), fe && Vt(v, le), Q;
    }
    function K(v, m, g, A) {
      if (g == null) throw Error(s(151));
      for (var Q = null, he = null, j = m, le = m = 0, ie = null, me = g.next(); j !== null && !me.done; le++, me = g.next()) {
        j.index > le ? (ie = j, j = null) : ie = j.sibling;
        var Ol = b(v, j, me.value, A);
        if (Ol === null) {
          j === null && (j = ie);
          break;
        }
        e && j && Ol.alternate === null && t(v, j), m = u(Ol, m, le), he === null ? Q = Ol : he.sibling = Ol, he = Ol, j = ie;
      }
      if (me.done)
        return l(v, j), fe && Vt(v, le), Q;
      if (j === null) {
        for (; !me.done; le++, me = g.next())
          me = N(v, me.value, A), me !== null && (m = u(me, m, le), he === null ? Q = me : he.sibling = me, he = me);
        return fe && Vt(v, le), Q;
      }
      for (j = a(j); !me.done; le++, me = g.next())
        me = p(j, v, le, me.value, A), me !== null && (e && me.alternate !== null && j.delete(me.key === null ? le : me.key), m = u(me, m, le), he === null ? Q = me : he.sibling = me, he = me);
      return e && j.forEach(function(ty) {
        return t(v, ty);
      }), fe && Vt(v, le), Q;
    }
    function Me(v, m, g, A) {
      if (typeof g == "object" && g !== null && g.type === X && g.key === null && (g = g.props.children), typeof g == "object" && g !== null) {
        switch (g.$$typeof) {
          case te:
            e: {
              for (var Q = g.key; m !== null; ) {
                if (m.key === Q) {
                  if (Q = g.type, Q === X) {
                    if (m.tag === 7) {
                      l(
                        v,
                        m.sibling
                      ), A = n(
                        m,
                        g.props.children
                      ), A.return = v, v = A;
                      break e;
                    }
                  } else if (m.elementType === Q || typeof Q == "object" && Q !== null && Q.$$typeof === R && Zl(Q) === m.type) {
                    l(
                      v,
                      m.sibling
                    ), A = n(m, g.props), an(A, g), A.return = v, v = A;
                    break e;
                  }
                  l(v, m);
                  break;
                } else t(v, m);
                m = m.sibling;
              }
              g.type === X ? (A = Yl(
                g.props.children,
                v.mode,
                A,
                g.key
              ), A.return = v, v = A) : (A = Pn(
                g.type,
                g.key,
                g.props,
                null,
                v.mode,
                A
              ), an(A, g), A.return = v, v = A);
            }
            return i(v);
          case k:
            e: {
              for (Q = g.key; m !== null; ) {
                if (m.key === Q)
                  if (m.tag === 4 && m.stateNode.containerInfo === g.containerInfo && m.stateNode.implementation === g.implementation) {
                    l(
                      v,
                      m.sibling
                    ), A = n(m, g.children || []), A.return = v, v = A;
                    break e;
                  } else {
                    l(v, m);
                    break;
                  }
                else t(v, m);
                m = m.sibling;
              }
              A = Xc(g, v.mode, A), A.return = v, v = A;
            }
            return i(v);
          case R:
            return g = Zl(g), Me(
              v,
              m,
              g,
              A
            );
        }
        if (Fe(g))
          return x(
            v,
            m,
            g,
            A
          );
        if (Be(g)) {
          if (Q = Be(g), typeof Q != "function") throw Error(s(150));
          return g = Q.call(g), K(
            v,
            m,
            g,
            A
          );
        }
        if (typeof g.then == "function")
          return Me(
            v,
            m,
            cu(g),
            A
          );
        if (g.$$typeof === De)
          return Me(
            v,
            m,
            lu(v, g),
            A
          );
        iu(v, g);
      }
      return typeof g == "string" && g !== "" || typeof g == "number" || typeof g == "bigint" ? (g = "" + g, m !== null && m.tag === 6 ? (l(v, m.sibling), A = n(m, g), A.return = v, v = A) : (l(v, m), A = jc(g, v.mode, A), A.return = v, v = A), i(v)) : l(v, m);
    }
    return function(v, m, g, A) {
      try {
        ln = 0;
        var Q = Me(
          v,
          m,
          g,
          A
        );
        return Ea = null, Q;
      } catch (j) {
        if (j === ga || j === nu) throw j;
        var he = gt(29, j, null, v.mode);
        return he.lanes = A, he.return = v, he;
      } finally {
      }
    };
  }
  var Kl = ns(!0), us = ns(!1), hl = !1;
  function ei(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function ti(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function ml(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function dl(e, t, l) {
    var a = e.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (ye & 2) !== 0) {
      var n = a.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = In(e), Xr(e, null, l), t;
    }
    return $n(e, a, t, l), In(e);
  }
  function nn(e, t, l) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (l & 4194048) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, Wf(e, l);
    }
  }
  function li(e, t) {
    var l = e.updateQueue, a = e.alternate;
    if (a !== null && (a = a.updateQueue, l === a)) {
      var n = null, u = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var i = {
            lane: l.lane,
            tag: l.tag,
            payload: l.payload,
            callback: null,
            next: null
          };
          u === null ? n = u = i : u = u.next = i, l = l.next;
        } while (l !== null);
        u === null ? n = u = t : u = u.next = t;
      } else n = u = t;
      l = {
        baseState: a.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: u,
        shared: a.shared,
        callbacks: a.callbacks
      }, e.updateQueue = l;
      return;
    }
    e = l.lastBaseUpdate, e === null ? l.firstBaseUpdate = t : e.next = t, l.lastBaseUpdate = t;
  }
  var ai = !1;
  function un() {
    if (ai) {
      var e = va;
      if (e !== null) throw e;
    }
  }
  function cn(e, t, l, a) {
    ai = !1;
    var n = e.updateQueue;
    hl = !1;
    var u = n.firstBaseUpdate, i = n.lastBaseUpdate, r = n.shared.pending;
    if (r !== null) {
      n.shared.pending = null;
      var o = r, E = o.next;
      o.next = null, i === null ? u = E : i.next = E, i = o;
      var M = e.alternate;
      M !== null && (M = M.updateQueue, r = M.lastBaseUpdate, r !== i && (r === null ? M.firstBaseUpdate = E : r.next = E, M.lastBaseUpdate = o));
    }
    if (u !== null) {
      var N = n.baseState;
      i = 0, M = E = o = null, r = u;
      do {
        var b = r.lane & -536870913, p = b !== r.lane;
        if (p ? (ce & b) === b : (a & b) === b) {
          b !== 0 && b === ya && (ai = !0), M !== null && (M = M.next = {
            lane: 0,
            tag: r.tag,
            payload: r.payload,
            callback: null,
            next: null
          });
          e: {
            var x = e, K = r;
            b = t;
            var Me = l;
            switch (K.tag) {
              case 1:
                if (x = K.payload, typeof x == "function") {
                  N = x.call(Me, N, b);
                  break e;
                }
                N = x;
                break e;
              case 3:
                x.flags = x.flags & -65537 | 128;
              case 0:
                if (x = K.payload, b = typeof x == "function" ? x.call(Me, N, b) : x, b == null) break e;
                N = B({}, N, b);
                break e;
              case 2:
                hl = !0;
            }
          }
          b = r.callback, b !== null && (e.flags |= 64, p && (e.flags |= 8192), p = n.callbacks, p === null ? n.callbacks = [b] : p.push(b));
        } else
          p = {
            lane: b,
            tag: r.tag,
            payload: r.payload,
            callback: r.callback,
            next: null
          }, M === null ? (E = M = p, o = N) : M = M.next = p, i |= b;
        if (r = r.next, r === null) {
          if (r = n.shared.pending, r === null)
            break;
          p = r, r = p.next, p.next = null, n.lastBaseUpdate = p, n.shared.pending = null;
        }
      } while (!0);
      M === null && (o = N), n.baseState = o, n.firstBaseUpdate = E, n.lastBaseUpdate = M, u === null && (n.shared.lanes = 0), bl |= i, e.lanes = i, e.memoizedState = N;
    }
  }
  function cs(e, t) {
    if (typeof e != "function")
      throw Error(s(191, e));
    e.call(t);
  }
  function is(e, t) {
    var l = e.callbacks;
    if (l !== null)
      for (e.callbacks = null, e = 0; e < l.length; e++)
        cs(l[e], t);
  }
  var ba = y(null), fu = y(0);
  function fs(e, t) {
    e = ll, U(fu, e), U(ba, t), ll = e | t.baseLanes;
  }
  function ni() {
    U(fu, ll), U(ba, ba.current);
  }
  function ui() {
    ll = fu.current, _(ba), _(fu);
  }
  var Et = y(null), Ct = null;
  function yl(e) {
    var t = e.alternate;
    U(Re, Re.current & 1), U(Et, e), Ct === null && (t === null || ba.current !== null || t.memoizedState !== null) && (Ct = e);
  }
  function ci(e) {
    U(Re, Re.current), U(Et, e), Ct === null && (Ct = e);
  }
  function rs(e) {
    e.tag === 22 ? (U(Re, Re.current), U(Et, e), Ct === null && (Ct = e)) : vl();
  }
  function vl() {
    U(Re, Re.current), U(Et, Et.current);
  }
  function bt(e) {
    _(Et), Ct === e && (Ct = null), _(Re);
  }
  var Re = y(0);
  function ru(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var l = t.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || mf(l) || df(l)))
          return t;
      } else if (t.tag === 19 && (t.memoizedProps.revealOrder === "forwards" || t.memoizedProps.revealOrder === "backwards" || t.memoizedProps.revealOrder === "unstable_legacy-backwards" || t.memoizedProps.revealOrder === "together")) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var Jt = 0, ee = null, Se = null, Ye = null, su = !1, pa = !1, Fl = !1, ou = 0, fn = 0, Sa = null, Vd = 0;
  function He() {
    throw Error(s(321));
  }
  function ii(e, t) {
    if (t === null) return !1;
    for (var l = 0; l < t.length && l < e.length; l++)
      if (!vt(e[l], t[l])) return !1;
    return !0;
  }
  function fi(e, t, l, a, n, u) {
    return Jt = u, ee = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, T.H = e === null || e.memoizedState === null ? Ks : Mi, Fl = !1, u = l(a, n), Fl = !1, pa && (u = os(
      t,
      l,
      a,
      n
    )), ss(e), u;
  }
  function ss(e) {
    T.H = on;
    var t = Se !== null && Se.next !== null;
    if (Jt = 0, Ye = Se = ee = null, su = !1, fn = 0, Sa = null, t) throw Error(s(300));
    e === null || ke || (e = e.dependencies, e !== null && tu(e) && (ke = !0));
  }
  function os(e, t, l, a) {
    ee = e;
    var n = 0;
    do {
      if (pa && (Sa = null), fn = 0, pa = !1, 25 <= n) throw Error(s(301));
      if (n += 1, Ye = Se = null, e.updateQueue != null) {
        var u = e.updateQueue;
        u.lastEffect = null, u.events = null, u.stores = null, u.memoCache != null && (u.memoCache.index = 0);
      }
      T.H = Fs, u = t(l, a);
    } while (pa);
    return u;
  }
  function Kd() {
    var e = T.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? rn(t) : t, e = e.useState()[0], (Se !== null ? Se.memoizedState : null) !== e && (ee.flags |= 1024), t;
  }
  function ri() {
    var e = ou !== 0;
    return ou = 0, e;
  }
  function si(e, t, l) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l;
  }
  function oi(e) {
    if (su) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      su = !1;
    }
    Jt = 0, Ye = Se = ee = null, pa = !1, fn = ou = 0, Sa = null;
  }
  function nt() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Ye === null ? ee.memoizedState = Ye = e : Ye = Ye.next = e, Ye;
  }
  function xe() {
    if (Se === null) {
      var e = ee.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Se.next;
    var t = Ye === null ? ee.memoizedState : Ye.next;
    if (t !== null)
      Ye = t, Se = e;
    else {
      if (e === null)
        throw ee.alternate === null ? Error(s(467)) : Error(s(310));
      Se = e, e = {
        memoizedState: Se.memoizedState,
        baseState: Se.baseState,
        baseQueue: Se.baseQueue,
        queue: Se.queue,
        next: null
      }, Ye === null ? ee.memoizedState = Ye = e : Ye = Ye.next = e;
    }
    return Ye;
  }
  function hu() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function rn(e) {
    var t = fn;
    return fn += 1, Sa === null && (Sa = []), e = ts(Sa, e, t), t = ee, (Ye === null ? t.memoizedState : Ye.next) === null && (t = t.alternate, T.H = t === null || t.memoizedState === null ? Ks : Mi), e;
  }
  function mu(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return rn(e);
      if (e.$$typeof === De) return Ie(e);
    }
    throw Error(s(438, String(e)));
  }
  function hi(e) {
    var t = null, l = ee.updateQueue;
    if (l !== null && (t = l.memoCache), t == null) {
      var a = ee.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), l === null && (l = hu(), ee.updateQueue = l), l.memoCache = t, l = t.data[t.index], l === void 0)
      for (l = t.data[t.index] = Array(e), a = 0; a < e; a++)
        l[a] = qe;
    return t.index++, l;
  }
  function wt(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function du(e) {
    var t = xe();
    return mi(t, Se, e);
  }
  function mi(e, t, l) {
    var a = e.queue;
    if (a === null) throw Error(s(311));
    a.lastRenderedReducer = l;
    var n = e.baseQueue, u = a.pending;
    if (u !== null) {
      if (n !== null) {
        var i = n.next;
        n.next = u.next, u.next = i;
      }
      t.baseQueue = n = u, a.pending = null;
    }
    if (u = e.baseState, n === null) e.memoizedState = u;
    else {
      t = n.next;
      var r = i = null, o = null, E = t, M = !1;
      do {
        var N = E.lane & -536870913;
        if (N !== E.lane ? (ce & N) === N : (Jt & N) === N) {
          var b = E.revertLane;
          if (b === 0)
            o !== null && (o = o.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: E.action,
              hasEagerState: E.hasEagerState,
              eagerState: E.eagerState,
              next: null
            }), N === ya && (M = !0);
          else if ((Jt & b) === b) {
            E = E.next, b === ya && (M = !0);
            continue;
          } else
            N = {
              lane: 0,
              revertLane: E.revertLane,
              gesture: null,
              action: E.action,
              hasEagerState: E.hasEagerState,
              eagerState: E.eagerState,
              next: null
            }, o === null ? (r = o = N, i = u) : o = o.next = N, ee.lanes |= b, bl |= b;
          N = E.action, Fl && l(u, N), u = E.hasEagerState ? E.eagerState : l(u, N);
        } else
          b = {
            lane: N,
            revertLane: E.revertLane,
            gesture: E.gesture,
            action: E.action,
            hasEagerState: E.hasEagerState,
            eagerState: E.eagerState,
            next: null
          }, o === null ? (r = o = b, i = u) : o = o.next = b, ee.lanes |= N, bl |= N;
        E = E.next;
      } while (E !== null && E !== t);
      if (o === null ? i = u : o.next = r, !vt(u, e.memoizedState) && (ke = !0, M && (l = va, l !== null)))
        throw l;
      e.memoizedState = u, e.baseState = i, e.baseQueue = o, a.lastRenderedState = u;
    }
    return n === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function di(e) {
    var t = xe(), l = t.queue;
    if (l === null) throw Error(s(311));
    l.lastRenderedReducer = e;
    var a = l.dispatch, n = l.pending, u = t.memoizedState;
    if (n !== null) {
      l.pending = null;
      var i = n = n.next;
      do
        u = e(u, i.action), i = i.next;
      while (i !== n);
      vt(u, t.memoizedState) || (ke = !0), t.memoizedState = u, t.baseQueue === null && (t.baseState = u), l.lastRenderedState = u;
    }
    return [u, a];
  }
  function hs(e, t, l) {
    var a = ee, n = xe(), u = fe;
    if (u) {
      if (l === void 0) throw Error(s(407));
      l = l();
    } else l = t();
    var i = !vt(
      (Se || n).memoizedState,
      l
    );
    if (i && (n.memoizedState = l, ke = !0), n = n.queue, gi(ys.bind(null, a, n, e), [
      e
    ]), n.getSnapshot !== t || i || Ye !== null && Ye.memoizedState.tag & 1) {
      if (a.flags |= 2048, za(
        9,
        { destroy: void 0 },
        ds.bind(
          null,
          a,
          n,
          l,
          t
        ),
        null
      ), Te === null) throw Error(s(349));
      u || (Jt & 127) !== 0 || ms(a, t, l);
    }
    return l;
  }
  function ms(e, t, l) {
    e.flags |= 16384, e = { getSnapshot: t, value: l }, t = ee.updateQueue, t === null ? (t = hu(), ee.updateQueue = t, t.stores = [e]) : (l = t.stores, l === null ? t.stores = [e] : l.push(e));
  }
  function ds(e, t, l, a) {
    t.value = l, t.getSnapshot = a, vs(t) && gs(e);
  }
  function ys(e, t, l) {
    return l(function() {
      vs(t) && gs(e);
    });
  }
  function vs(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var l = t();
      return !vt(e, l);
    } catch {
      return !0;
    }
  }
  function gs(e) {
    var t = Gl(e, 2);
    t !== null && ot(t, e, 2);
  }
  function yi(e) {
    var t = nt();
    if (typeof e == "function") {
      var l = e;
      if (e = l(), Fl) {
        ul(!0);
        try {
          l();
        } finally {
          ul(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: wt,
      lastRenderedState: e
    }, t;
  }
  function Es(e, t, l, a) {
    return e.baseState = l, mi(
      e,
      Se,
      typeof a == "function" ? a : wt
    );
  }
  function Fd(e, t, l, a, n) {
    if (gu(e)) throw Error(s(485));
    if (e = t.action, e !== null) {
      var u = {
        payload: n,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(i) {
          u.listeners.push(i);
        }
      };
      T.T !== null ? l(!0) : u.isTransition = !1, a(u), l = t.pending, l === null ? (u.next = t.pending = u, bs(t, u)) : (u.next = l.next, t.pending = l.next = u);
    }
  }
  function bs(e, t) {
    var l = t.action, a = t.payload, n = e.state;
    if (t.isTransition) {
      var u = T.T, i = {};
      T.T = i;
      try {
        var r = l(n, a), o = T.S;
        o !== null && o(i, r), ps(e, t, r);
      } catch (E) {
        vi(e, t, E);
      } finally {
        u !== null && i.types !== null && (u.types = i.types), T.T = u;
      }
    } else
      try {
        u = l(n, a), ps(e, t, u);
      } catch (E) {
        vi(e, t, E);
      }
  }
  function ps(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        Ss(e, t, a);
      },
      function(a) {
        return vi(e, t, a);
      }
    ) : Ss(e, t, l);
  }
  function Ss(e, t, l) {
    t.status = "fulfilled", t.value = l, zs(t), e.state = l, t = e.pending, t !== null && (l = t.next, l === t ? e.pending = null : (l = l.next, t.next = l, bs(e, l)));
  }
  function vi(e, t, l) {
    var a = e.pending;
    if (e.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = l, zs(t), t = t.next;
      while (t !== a);
    }
    e.action = null;
  }
  function zs(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function Ms(e, t) {
    return t;
  }
  function Ts(e, t) {
    if (fe) {
      var l = Te.formState;
      if (l !== null) {
        e: {
          var a = ee;
          if (fe) {
            if (Ne) {
              t: {
                for (var n = Ne, u = Ot; n.nodeType !== 8; ) {
                  if (!u) {
                    n = null;
                    break t;
                  }
                  if (n = qt(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break t;
                  }
                }
                u = n.data, n = u === "F!" || u === "F" ? n : null;
              }
              if (n) {
                Ne = qt(
                  n.nextSibling
                ), a = n.data === "F!";
                break e;
              }
            }
            sl(a);
          }
          a = !1;
        }
        a && (t = l[0]);
      }
    }
    return l = nt(), l.memoizedState = l.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Ms,
      lastRenderedState: t
    }, l.queue = a, l = Qs.bind(
      null,
      ee,
      a
    ), a.dispatch = l, a = yi(!1), u = zi.bind(
      null,
      ee,
      !1,
      a.queue
    ), a = nt(), n = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, a.queue = n, l = Fd.bind(
      null,
      ee,
      n,
      u,
      l
    ), n.dispatch = l, a.memoizedState = e, [t, l, !1];
  }
  function As(e) {
    var t = xe();
    return Ns(t, Se, e);
  }
  function Ns(e, t, l) {
    if (t = mi(
      e,
      t,
      Ms
    )[0], e = du(wt)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = rn(t);
      } catch (i) {
        throw i === ga ? nu : i;
      }
    else a = t;
    t = xe();
    var n = t.queue, u = n.dispatch;
    return l !== t.memoizedState && (ee.flags |= 2048, za(
      9,
      { destroy: void 0 },
      Jd.bind(null, n, l),
      null
    )), [a, u, e];
  }
  function Jd(e, t) {
    e.action = t;
  }
  function _s(e) {
    var t = xe(), l = Se;
    if (l !== null)
      return Ns(t, l, e);
    xe(), t = t.memoizedState, l = xe();
    var a = l.queue.dispatch;
    return l.memoizedState = e, [t, a, !1];
  }
  function za(e, t, l, a) {
    return e = { tag: e, create: l, deps: a, inst: t, next: null }, t = ee.updateQueue, t === null && (t = hu(), ee.updateQueue = t), l = t.lastEffect, l === null ? t.lastEffect = e.next = e : (a = l.next, l.next = e, e.next = a, t.lastEffect = e), e;
  }
  function Ds() {
    return xe().memoizedState;
  }
  function yu(e, t, l, a) {
    var n = nt();
    ee.flags |= e, n.memoizedState = za(
      1 | t,
      { destroy: void 0 },
      l,
      a === void 0 ? null : a
    );
  }
  function vu(e, t, l, a) {
    var n = xe();
    a = a === void 0 ? null : a;
    var u = n.memoizedState.inst;
    Se !== null && a !== null && ii(a, Se.memoizedState.deps) ? n.memoizedState = za(t, u, l, a) : (ee.flags |= e, n.memoizedState = za(
      1 | t,
      u,
      l,
      a
    ));
  }
  function Os(e, t) {
    yu(8390656, 8, e, t);
  }
  function gi(e, t) {
    vu(2048, 8, e, t);
  }
  function wd(e) {
    ee.flags |= 4;
    var t = ee.updateQueue;
    if (t === null)
      t = hu(), ee.updateQueue = t, t.events = [e];
    else {
      var l = t.events;
      l === null ? t.events = [e] : l.push(e);
    }
  }
  function Cs(e) {
    var t = xe().memoizedState;
    return wd({ ref: t, nextImpl: e }), function() {
      if ((ye & 2) !== 0) throw Error(s(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function qs(e, t) {
    return vu(4, 2, e, t);
  }
  function Hs(e, t) {
    return vu(4, 4, e, t);
  }
  function Us(e, t) {
    if (typeof t == "function") {
      e = e();
      var l = t(e);
      return function() {
        typeof l == "function" ? l() : t(null);
      };
    }
    if (t != null)
      return e = e(), t.current = e, function() {
        t.current = null;
      };
  }
  function Bs(e, t, l) {
    l = l != null ? l.concat([e]) : null, vu(4, 4, Us.bind(null, t, e), l);
  }
  function Ei() {
  }
  function Rs(e, t) {
    var l = xe();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    return t !== null && ii(t, a[1]) ? a[0] : (l.memoizedState = [e, t], e);
  }
  function xs(e, t) {
    var l = xe();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    if (t !== null && ii(t, a[1]))
      return a[0];
    if (a = e(), Fl) {
      ul(!0);
      try {
        e();
      } finally {
        ul(!1);
      }
    }
    return l.memoizedState = [a, t], a;
  }
  function bi(e, t, l) {
    return l === void 0 || (Jt & 1073741824) !== 0 && (ce & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = l, e = Go(), ee.lanes |= e, bl |= e, l);
  }
  function Ls(e, t, l, a) {
    return vt(l, t) ? l : ba.current !== null ? (e = bi(e, l, a), vt(e, t) || (ke = !0), e) : (Jt & 42) === 0 || (Jt & 1073741824) !== 0 && (ce & 261930) === 0 ? (ke = !0, e.memoizedState = l) : (e = Go(), ee.lanes |= e, bl |= e, t);
  }
  function Gs(e, t, l, a, n) {
    var u = H.p;
    H.p = u !== 0 && 8 > u ? u : 8;
    var i = T.T, r = {};
    T.T = r, zi(e, !1, t, l);
    try {
      var o = n(), E = T.S;
      if (E !== null && E(r, o), o !== null && typeof o == "object" && typeof o.then == "function") {
        var M = Zd(
          o,
          a
        );
        sn(
          e,
          t,
          M,
          zt(e)
        );
      } else
        sn(
          e,
          t,
          a,
          zt(e)
        );
    } catch (N) {
      sn(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: N },
        zt()
      );
    } finally {
      H.p = u, i !== null && r.types !== null && (i.types = r.types), T.T = i;
    }
  }
  function Wd() {
  }
  function pi(e, t, l, a) {
    if (e.tag !== 5) throw Error(s(476));
    var n = Ys(e).queue;
    Gs(
      e,
      n,
      t,
      J,
      l === null ? Wd : function() {
        return ks(e), l(a);
      }
    );
  }
  function Ys(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: J,
      baseState: J,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: wt,
        lastRenderedState: J
      },
      next: null
    };
    var l = {};
    return t.next = {
      memoizedState: l,
      baseState: l,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: wt,
        lastRenderedState: l
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function ks(e) {
    var t = Ys(e);
    t.next === null && (t = e.alternate.memoizedState), sn(
      e,
      t.next.queue,
      {},
      zt()
    );
  }
  function Si() {
    return Ie(_n);
  }
  function js() {
    return xe().memoizedState;
  }
  function Xs() {
    return xe().memoizedState;
  }
  function $d(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = zt();
          e = ml(l);
          var a = dl(t, e, l);
          a !== null && (ot(a, t, l), nn(a, t, l)), t = { cache: Wc() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function Id(e, t, l) {
    var a = zt();
    l = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, gu(e) ? Zs(t, l) : (l = Yc(e, t, l, a), l !== null && (ot(l, e, a), Vs(l, t, a)));
  }
  function Qs(e, t, l) {
    var a = zt();
    sn(e, t, l, a);
  }
  function sn(e, t, l, a) {
    var n = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (gu(e)) Zs(t, n);
    else {
      var u = e.alternate;
      if (e.lanes === 0 && (u === null || u.lanes === 0) && (u = t.lastRenderedReducer, u !== null))
        try {
          var i = t.lastRenderedState, r = u(i, l);
          if (n.hasEagerState = !0, n.eagerState = r, vt(r, i))
            return $n(e, t, n, 0), Te === null && Wn(), !1;
        } catch {
        } finally {
        }
      if (l = Yc(e, t, n, a), l !== null)
        return ot(l, e, a), Vs(l, t, a), !0;
    }
    return !1;
  }
  function zi(e, t, l, a) {
    if (a = {
      lane: 2,
      revertLane: ef(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, gu(e)) {
      if (t) throw Error(s(479));
    } else
      t = Yc(
        e,
        l,
        a,
        2
      ), t !== null && ot(t, e, 2);
  }
  function gu(e) {
    var t = e.alternate;
    return e === ee || t !== null && t === ee;
  }
  function Zs(e, t) {
    pa = su = !0;
    var l = e.pending;
    l === null ? t.next = t : (t.next = l.next, l.next = t), e.pending = t;
  }
  function Vs(e, t, l) {
    if ((l & 4194048) !== 0) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, Wf(e, l);
    }
  }
  var on = {
    readContext: Ie,
    use: mu,
    useCallback: He,
    useContext: He,
    useEffect: He,
    useImperativeHandle: He,
    useLayoutEffect: He,
    useInsertionEffect: He,
    useMemo: He,
    useReducer: He,
    useRef: He,
    useState: He,
    useDebugValue: He,
    useDeferredValue: He,
    useTransition: He,
    useSyncExternalStore: He,
    useId: He,
    useHostTransitionStatus: He,
    useFormState: He,
    useActionState: He,
    useOptimistic: He,
    useMemoCache: He,
    useCacheRefresh: He
  };
  on.useEffectEvent = He;
  var Ks = {
    readContext: Ie,
    use: mu,
    useCallback: function(e, t) {
      return nt().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: Ie,
    useEffect: Os,
    useImperativeHandle: function(e, t, l) {
      l = l != null ? l.concat([e]) : null, yu(
        4194308,
        4,
        Us.bind(null, t, e),
        l
      );
    },
    useLayoutEffect: function(e, t) {
      return yu(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      yu(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var l = nt();
      t = t === void 0 ? null : t;
      var a = e();
      if (Fl) {
        ul(!0);
        try {
          e();
        } finally {
          ul(!1);
        }
      }
      return l.memoizedState = [a, t], a;
    },
    useReducer: function(e, t, l) {
      var a = nt();
      if (l !== void 0) {
        var n = l(t);
        if (Fl) {
          ul(!0);
          try {
            l(t);
          } finally {
            ul(!1);
          }
        }
      } else n = t;
      return a.memoizedState = a.baseState = n, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: n
      }, a.queue = e, e = e.dispatch = Id.bind(
        null,
        ee,
        e
      ), [a.memoizedState, e];
    },
    useRef: function(e) {
      var t = nt();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = yi(e);
      var t = e.queue, l = Qs.bind(null, ee, t);
      return t.dispatch = l, [e.memoizedState, l];
    },
    useDebugValue: Ei,
    useDeferredValue: function(e, t) {
      var l = nt();
      return bi(l, e, t);
    },
    useTransition: function() {
      var e = yi(!1);
      return e = Gs.bind(
        null,
        ee,
        e.queue,
        !0,
        !1
      ), nt().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, l) {
      var a = ee, n = nt();
      if (fe) {
        if (l === void 0)
          throw Error(s(407));
        l = l();
      } else {
        if (l = t(), Te === null)
          throw Error(s(349));
        (ce & 127) !== 0 || ms(a, t, l);
      }
      n.memoizedState = l;
      var u = { value: l, getSnapshot: t };
      return n.queue = u, Os(ys.bind(null, a, u, e), [
        e
      ]), a.flags |= 2048, za(
        9,
        { destroy: void 0 },
        ds.bind(
          null,
          a,
          u,
          l,
          t
        ),
        null
      ), l;
    },
    useId: function() {
      var e = nt(), t = Te.identifierPrefix;
      if (fe) {
        var l = Gt, a = Lt;
        l = (a & ~(1 << 32 - yt(a) - 1)).toString(32) + l, t = "_" + t + "R_" + l, l = ou++, 0 < l && (t += "H" + l.toString(32)), t += "_";
      } else
        l = Vd++, t = "_" + t + "r_" + l.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: Si,
    useFormState: Ts,
    useActionState: Ts,
    useOptimistic: function(e) {
      var t = nt();
      t.memoizedState = t.baseState = e;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = l, t = zi.bind(
        null,
        ee,
        !0,
        l
      ), l.dispatch = t, [e, t];
    },
    useMemoCache: hi,
    useCacheRefresh: function() {
      return nt().memoizedState = $d.bind(
        null,
        ee
      );
    },
    useEffectEvent: function(e) {
      var t = nt(), l = { impl: e };
      return t.memoizedState = l, function() {
        if ((ye & 2) !== 0)
          throw Error(s(440));
        return l.impl.apply(void 0, arguments);
      };
    }
  }, Mi = {
    readContext: Ie,
    use: mu,
    useCallback: Rs,
    useContext: Ie,
    useEffect: gi,
    useImperativeHandle: Bs,
    useInsertionEffect: qs,
    useLayoutEffect: Hs,
    useMemo: xs,
    useReducer: du,
    useRef: Ds,
    useState: function() {
      return du(wt);
    },
    useDebugValue: Ei,
    useDeferredValue: function(e, t) {
      var l = xe();
      return Ls(
        l,
        Se.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = du(wt)[0], t = xe().memoizedState;
      return [
        typeof e == "boolean" ? e : rn(e),
        t
      ];
    },
    useSyncExternalStore: hs,
    useId: js,
    useHostTransitionStatus: Si,
    useFormState: As,
    useActionState: As,
    useOptimistic: function(e, t) {
      var l = xe();
      return Es(l, Se, e, t);
    },
    useMemoCache: hi,
    useCacheRefresh: Xs
  };
  Mi.useEffectEvent = Cs;
  var Fs = {
    readContext: Ie,
    use: mu,
    useCallback: Rs,
    useContext: Ie,
    useEffect: gi,
    useImperativeHandle: Bs,
    useInsertionEffect: qs,
    useLayoutEffect: Hs,
    useMemo: xs,
    useReducer: di,
    useRef: Ds,
    useState: function() {
      return di(wt);
    },
    useDebugValue: Ei,
    useDeferredValue: function(e, t) {
      var l = xe();
      return Se === null ? bi(l, e, t) : Ls(
        l,
        Se.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = di(wt)[0], t = xe().memoizedState;
      return [
        typeof e == "boolean" ? e : rn(e),
        t
      ];
    },
    useSyncExternalStore: hs,
    useId: js,
    useHostTransitionStatus: Si,
    useFormState: _s,
    useActionState: _s,
    useOptimistic: function(e, t) {
      var l = xe();
      return Se !== null ? Es(l, Se, e, t) : (l.baseState = e, [e, l.queue.dispatch]);
    },
    useMemoCache: hi,
    useCacheRefresh: Xs
  };
  Fs.useEffectEvent = Cs;
  function Ti(e, t, l, a) {
    t = e.memoizedState, l = l(a, t), l = l == null ? t : B({}, t, l), e.memoizedState = l, e.lanes === 0 && (e.updateQueue.baseState = l);
  }
  var Ai = {
    enqueueSetState: function(e, t, l) {
      e = e._reactInternals;
      var a = zt(), n = ml(a);
      n.payload = t, l != null && (n.callback = l), t = dl(e, n, a), t !== null && (ot(t, e, a), nn(t, e, a));
    },
    enqueueReplaceState: function(e, t, l) {
      e = e._reactInternals;
      var a = zt(), n = ml(a);
      n.tag = 1, n.payload = t, l != null && (n.callback = l), t = dl(e, n, a), t !== null && (ot(t, e, a), nn(t, e, a));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var l = zt(), a = ml(l);
      a.tag = 2, t != null && (a.callback = t), t = dl(e, a, l), t !== null && (ot(t, e, l), nn(t, e, l));
    }
  };
  function Js(e, t, l, a, n, u, i) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, u, i) : t.prototype && t.prototype.isPureReactComponent ? !Wa(l, a) || !Wa(n, u) : !0;
  }
  function ws(e, t, l, a) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(l, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(l, a), t.state !== e && Ai.enqueueReplaceState(t, t.state, null);
  }
  function Jl(e, t) {
    var l = t;
    if ("ref" in t) {
      l = {};
      for (var a in t)
        a !== "ref" && (l[a] = t[a]);
    }
    if (e = e.defaultProps) {
      l === t && (l = B({}, l));
      for (var n in e)
        l[n] === void 0 && (l[n] = e[n]);
    }
    return l;
  }
  function Ws(e) {
    wn(e);
  }
  function $s(e) {
    console.error(e);
  }
  function Is(e) {
    wn(e);
  }
  function Eu(e, t) {
    try {
      var l = e.onUncaughtError;
      l(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function Ps(e, t, l) {
    try {
      var a = e.onCaughtError;
      a(l.value, {
        componentStack: l.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  function Ni(e, t, l) {
    return l = ml(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      Eu(e, t);
    }, l;
  }
  function eo(e) {
    return e = ml(e), e.tag = 3, e;
  }
  function to(e, t, l, a) {
    var n = l.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var u = a.value;
      e.payload = function() {
        return n(u);
      }, e.callback = function() {
        Ps(t, l, a);
      };
    }
    var i = l.stateNode;
    i !== null && typeof i.componentDidCatch == "function" && (e.callback = function() {
      Ps(t, l, a), typeof n != "function" && (pl === null ? pl = /* @__PURE__ */ new Set([this]) : pl.add(this));
      var r = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: r !== null ? r : ""
      });
    });
  }
  function Pd(e, t, l, a, n) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = l.alternate, t !== null && da(
        t,
        l,
        n,
        !0
      ), l = Et.current, l !== null) {
        switch (l.tag) {
          case 31:
          case 13:
            return Ct === null ? Cu() : l.alternate === null && Ue === 0 && (Ue = 3), l.flags &= -257, l.flags |= 65536, l.lanes = n, a === uu ? l.flags |= 16384 : (t = l.updateQueue, t === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), $i(e, a, n)), !1;
          case 22:
            return l.flags |= 65536, a === uu ? l.flags |= 16384 : (t = l.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = t) : (l = t.retryQueue, l === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), $i(e, a, n)), !1;
        }
        throw Error(s(435, l.tag));
      }
      return $i(e, a, n), Cu(), !1;
    }
    if (fe)
      return t = Et.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== Vc && (e = Error(s(422), { cause: a }), Pa(Nt(e, l)))) : (a !== Vc && (t = Error(s(423), {
        cause: a
      }), Pa(
        Nt(t, l)
      )), e = e.current.alternate, e.flags |= 65536, n &= -n, e.lanes |= n, a = Nt(a, l), n = Ni(
        e.stateNode,
        a,
        n
      ), li(e, n), Ue !== 4 && (Ue = 2)), !1;
    var u = Error(s(520), { cause: a });
    if (u = Nt(u, l), bn === null ? bn = [u] : bn.push(u), Ue !== 4 && (Ue = 2), t === null) return !0;
    a = Nt(a, l), l = t;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, e = n & -n, l.lanes |= e, e = Ni(l.stateNode, a, e), li(l, e), !1;
        case 1:
          if (t = l.type, u = l.stateNode, (l.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || u !== null && typeof u.componentDidCatch == "function" && (pl === null || !pl.has(u))))
            return l.flags |= 65536, n &= -n, l.lanes |= n, n = eo(n), to(
              n,
              e,
              l,
              a
            ), li(l, n), !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var _i = Error(s(461)), ke = !1;
  function Pe(e, t, l, a) {
    t.child = e === null ? us(t, null, l, a) : Kl(
      t,
      e.child,
      l,
      a
    );
  }
  function lo(e, t, l, a, n) {
    l = l.render;
    var u = t.ref;
    if ("ref" in a) {
      var i = {};
      for (var r in a)
        r !== "ref" && (i[r] = a[r]);
    } else i = a;
    return Xl(t), a = fi(
      e,
      t,
      l,
      i,
      u,
      n
    ), r = ri(), e !== null && !ke ? (si(e, t, n), Wt(e, t, n)) : (fe && r && Qc(t), t.flags |= 1, Pe(e, t, a, n), t.child);
  }
  function ao(e, t, l, a, n) {
    if (e === null) {
      var u = l.type;
      return typeof u == "function" && !kc(u) && u.defaultProps === void 0 && l.compare === null ? (t.tag = 15, t.type = u, no(
        e,
        t,
        u,
        a,
        n
      )) : (e = Pn(
        l.type,
        null,
        a,
        t,
        t.mode,
        n
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (u = e.child, !Ri(e, n)) {
      var i = u.memoizedProps;
      if (l = l.compare, l = l !== null ? l : Wa, l(i, a) && e.ref === t.ref)
        return Wt(e, t, n);
    }
    return t.flags |= 1, e = Zt(u, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function no(e, t, l, a, n) {
    if (e !== null) {
      var u = e.memoizedProps;
      if (Wa(u, a) && e.ref === t.ref)
        if (ke = !1, t.pendingProps = a = u, Ri(e, n))
          (e.flags & 131072) !== 0 && (ke = !0);
        else
          return t.lanes = e.lanes, Wt(e, t, n);
    }
    return Di(
      e,
      t,
      l,
      a,
      n
    );
  }
  function uo(e, t, l, a) {
    var n = a.children, u = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (u = u !== null ? u.baseLanes | l : l, e !== null) {
          for (a = t.child = e.child, n = 0; a !== null; )
            n = n | a.lanes | a.childLanes, a = a.sibling;
          a = n & ~u;
        } else a = 0, t.child = null;
        return co(
          e,
          t,
          u,
          l,
          a
        );
      }
      if ((l & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && au(
          t,
          u !== null ? u.cachePool : null
        ), u !== null ? fs(t, u) : ni(), rs(t);
      else
        return a = t.lanes = 536870912, co(
          e,
          t,
          u !== null ? u.baseLanes | l : l,
          l,
          a
        );
    } else
      u !== null ? (au(t, u.cachePool), fs(t, u), vl(), t.memoizedState = null) : (e !== null && au(t, null), ni(), vl());
    return Pe(e, t, n, l), t.child;
  }
  function hn(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function co(e, t, l, a, n) {
    var u = Ic();
    return u = u === null ? null : { parent: Ge._currentValue, pool: u }, t.memoizedState = {
      baseLanes: l,
      cachePool: u
    }, e !== null && au(t, null), ni(), rs(t), e !== null && da(e, t, a, !0), t.childLanes = n, null;
  }
  function bu(e, t) {
    return t = Su(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function io(e, t, l) {
    return Kl(t, e.child, null, l), e = bu(t, t.pendingProps), e.flags |= 2, bt(t), t.memoizedState = null, e;
  }
  function e0(e, t, l) {
    var a = t.pendingProps, n = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (fe) {
        if (a.mode === "hidden")
          return e = bu(t, a), t.lanes = 536870912, hn(null, e);
        if (ci(t), (e = Ne) ? (e = ph(
          e,
          Ot
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: fl !== null ? { id: Lt, overflow: Gt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Zr(e), l.return = t, t.child = l, $e = t, Ne = null)) : e = null, e === null) throw sl(t);
        return t.lanes = 536870912, null;
      }
      return bu(t, a);
    }
    var u = e.memoizedState;
    if (u !== null) {
      var i = u.dehydrated;
      if (ci(t), n)
        if (t.flags & 256)
          t.flags &= -257, t = io(
            e,
            t,
            l
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(s(558));
      else if (ke || da(e, t, l, !1), n = (l & e.childLanes) !== 0, ke || n) {
        if (a = Te, a !== null && (i = $f(a, l), i !== 0 && i !== u.retryLane))
          throw u.retryLane = i, Gl(e, i), ot(a, e, i), _i;
        Cu(), t = io(
          e,
          t,
          l
        );
      } else
        e = u.treeContext, Ne = qt(i.nextSibling), $e = t, fe = !0, rl = null, Ot = !1, e !== null && Fr(t, e), t = bu(t, a), t.flags |= 4096;
      return t;
    }
    return e = Zt(e.child, {
      mode: a.mode,
      children: a.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function pu(e, t) {
    var l = t.ref;
    if (l === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(s(284));
      (e === null || e.ref !== l) && (t.flags |= 4194816);
    }
  }
  function Di(e, t, l, a, n) {
    return Xl(t), l = fi(
      e,
      t,
      l,
      a,
      void 0,
      n
    ), a = ri(), e !== null && !ke ? (si(e, t, n), Wt(e, t, n)) : (fe && a && Qc(t), t.flags |= 1, Pe(e, t, l, n), t.child);
  }
  function fo(e, t, l, a, n, u) {
    return Xl(t), t.updateQueue = null, l = os(
      t,
      a,
      l,
      n
    ), ss(e), a = ri(), e !== null && !ke ? (si(e, t, u), Wt(e, t, u)) : (fe && a && Qc(t), t.flags |= 1, Pe(e, t, l, u), t.child);
  }
  function ro(e, t, l, a, n) {
    if (Xl(t), t.stateNode === null) {
      var u = sa, i = l.contextType;
      typeof i == "object" && i !== null && (u = Ie(i)), u = new l(a, u), t.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null, u.updater = Ai, t.stateNode = u, u._reactInternals = t, u = t.stateNode, u.props = a, u.state = t.memoizedState, u.refs = {}, ei(t), i = l.contextType, u.context = typeof i == "object" && i !== null ? Ie(i) : sa, u.state = t.memoizedState, i = l.getDerivedStateFromProps, typeof i == "function" && (Ti(
        t,
        l,
        i,
        a
      ), u.state = t.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof u.getSnapshotBeforeUpdate == "function" || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (i = u.state, typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(), i !== u.state && Ai.enqueueReplaceState(u, u.state, null), cn(t, a, u, n), un(), u.state = t.memoizedState), typeof u.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      u = t.stateNode;
      var r = t.memoizedProps, o = Jl(l, r);
      u.props = o;
      var E = u.context, M = l.contextType;
      i = sa, typeof M == "object" && M !== null && (i = Ie(M));
      var N = l.getDerivedStateFromProps;
      M = typeof N == "function" || typeof u.getSnapshotBeforeUpdate == "function", r = t.pendingProps !== r, M || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (r || E !== i) && ws(
        t,
        u,
        a,
        i
      ), hl = !1;
      var b = t.memoizedState;
      u.state = b, cn(t, a, u, n), un(), E = t.memoizedState, r || b !== E || hl ? (typeof N == "function" && (Ti(
        t,
        l,
        N,
        a
      ), E = t.memoizedState), (o = hl || Js(
        t,
        l,
        o,
        a,
        b,
        E,
        i
      )) ? (M || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = E), u.props = a, u.state = E, u.context = i, a = o) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      u = t.stateNode, ti(e, t), i = t.memoizedProps, M = Jl(l, i), u.props = M, N = t.pendingProps, b = u.context, E = l.contextType, o = sa, typeof E == "object" && E !== null && (o = Ie(E)), r = l.getDerivedStateFromProps, (E = typeof r == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (i !== N || b !== o) && ws(
        t,
        u,
        a,
        o
      ), hl = !1, b = t.memoizedState, u.state = b, cn(t, a, u, n), un();
      var p = t.memoizedState;
      i !== N || b !== p || hl || e !== null && e.dependencies !== null && tu(e.dependencies) ? (typeof r == "function" && (Ti(
        t,
        l,
        r,
        a
      ), p = t.memoizedState), (M = hl || Js(
        t,
        l,
        M,
        a,
        b,
        p,
        o
      ) || e !== null && e.dependencies !== null && tu(e.dependencies)) ? (E || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(a, p, o), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(
        a,
        p,
        o
      )), typeof u.componentDidUpdate == "function" && (t.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || i === e.memoizedProps && b === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || i === e.memoizedProps && b === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = p), u.props = a, u.state = p, u.context = o, a = M) : (typeof u.componentDidUpdate != "function" || i === e.memoizedProps && b === e.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || i === e.memoizedProps && b === e.memoizedState || (t.flags |= 1024), a = !1);
    }
    return u = a, pu(e, t), a = (t.flags & 128) !== 0, u || a ? (u = t.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : u.render(), t.flags |= 1, e !== null && a ? (t.child = Kl(
      t,
      e.child,
      null,
      n
    ), t.child = Kl(
      t,
      null,
      l,
      n
    )) : Pe(e, t, l, n), t.memoizedState = u.state, e = t.child) : e = Wt(
      e,
      t,
      n
    ), e;
  }
  function so(e, t, l, a) {
    return kl(), t.flags |= 256, Pe(e, t, l, a), t.child;
  }
  var Oi = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function Ci(e) {
    return { baseLanes: e, cachePool: Pr() };
  }
  function qi(e, t, l) {
    return e = e !== null ? e.childLanes & ~l : 0, t && (e |= St), e;
  }
  function oo(e, t, l) {
    var a = t.pendingProps, n = !1, u = (t.flags & 128) !== 0, i;
    if ((i = u) || (i = e !== null && e.memoizedState === null ? !1 : (Re.current & 2) !== 0), i && (n = !0, t.flags &= -129), i = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (fe) {
        if (n ? yl(t) : vl(), (e = Ne) ? (e = ph(
          e,
          Ot
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: fl !== null ? { id: Lt, overflow: Gt } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Zr(e), l.return = t, t.child = l, $e = t, Ne = null)) : e = null, e === null) throw sl(t);
        return df(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var r = a.children;
      return a = a.fallback, n ? (vl(), n = t.mode, r = Su(
        { mode: "hidden", children: r },
        n
      ), a = Yl(
        a,
        n,
        l,
        null
      ), r.return = t, a.return = t, r.sibling = a, t.child = r, a = t.child, a.memoizedState = Ci(l), a.childLanes = qi(
        e,
        i,
        l
      ), t.memoizedState = Oi, hn(null, a)) : (yl(t), Hi(t, r));
    }
    var o = e.memoizedState;
    if (o !== null && (r = o.dehydrated, r !== null)) {
      if (u)
        t.flags & 256 ? (yl(t), t.flags &= -257, t = Ui(
          e,
          t,
          l
        )) : t.memoizedState !== null ? (vl(), t.child = e.child, t.flags |= 128, t = null) : (vl(), r = a.fallback, n = t.mode, a = Su(
          { mode: "visible", children: a.children },
          n
        ), r = Yl(
          r,
          n,
          l,
          null
        ), r.flags |= 2, a.return = t, r.return = t, a.sibling = r, t.child = a, Kl(
          t,
          e.child,
          null,
          l
        ), a = t.child, a.memoizedState = Ci(l), a.childLanes = qi(
          e,
          i,
          l
        ), t.memoizedState = Oi, t = hn(null, a));
      else if (yl(t), df(r)) {
        if (i = r.nextSibling && r.nextSibling.dataset, i) var E = i.dgst;
        i = E, a = Error(s(419)), a.stack = "", a.digest = i, Pa({ value: a, source: null, stack: null }), t = Ui(
          e,
          t,
          l
        );
      } else if (ke || da(e, t, l, !1), i = (l & e.childLanes) !== 0, ke || i) {
        if (i = Te, i !== null && (a = $f(i, l), a !== 0 && a !== o.retryLane))
          throw o.retryLane = a, Gl(e, a), ot(i, e, a), _i;
        mf(r) || Cu(), t = Ui(
          e,
          t,
          l
        );
      } else
        mf(r) ? (t.flags |= 192, t.child = e.child, t = null) : (e = o.treeContext, Ne = qt(
          r.nextSibling
        ), $e = t, fe = !0, rl = null, Ot = !1, e !== null && Fr(t, e), t = Hi(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return n ? (vl(), r = a.fallback, n = t.mode, o = e.child, E = o.sibling, a = Zt(o, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = o.subtreeFlags & 65011712, E !== null ? r = Zt(
      E,
      r
    ) : (r = Yl(
      r,
      n,
      l,
      null
    ), r.flags |= 2), r.return = t, a.return = t, a.sibling = r, t.child = a, hn(null, a), a = t.child, r = e.child.memoizedState, r === null ? r = Ci(l) : (n = r.cachePool, n !== null ? (o = Ge._currentValue, n = n.parent !== o ? { parent: o, pool: o } : n) : n = Pr(), r = {
      baseLanes: r.baseLanes | l,
      cachePool: n
    }), a.memoizedState = r, a.childLanes = qi(
      e,
      i,
      l
    ), t.memoizedState = Oi, hn(e.child, a)) : (yl(t), l = e.child, e = l.sibling, l = Zt(l, {
      mode: "visible",
      children: a.children
    }), l.return = t, l.sibling = null, e !== null && (i = t.deletions, i === null ? (t.deletions = [e], t.flags |= 16) : i.push(e)), t.child = l, t.memoizedState = null, l);
  }
  function Hi(e, t) {
    return t = Su(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function Su(e, t) {
    return e = gt(22, e, null, t), e.lanes = 0, e;
  }
  function Ui(e, t, l) {
    return Kl(t, e.child, null, l), e = Hi(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function ho(e, t, l) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), Jc(e.return, t, l);
  }
  function Bi(e, t, l, a, n, u) {
    var i = e.memoizedState;
    i === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: l,
      tailMode: n,
      treeForkCount: u
    } : (i.isBackwards = t, i.rendering = null, i.renderingStartTime = 0, i.last = a, i.tail = l, i.tailMode = n, i.treeForkCount = u);
  }
  function mo(e, t, l) {
    var a = t.pendingProps, n = a.revealOrder, u = a.tail;
    a = a.children;
    var i = Re.current, r = (i & 2) !== 0;
    if (r ? (i = i & 1 | 2, t.flags |= 128) : i &= 1, U(Re, i), Pe(e, t, a, l), a = fe ? Ia : 0, !r && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && ho(e, l, t);
        else if (e.tag === 19)
          ho(e, l, t);
        else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t)
            break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    switch (n) {
      case "forwards":
        for (l = t.child, n = null; l !== null; )
          e = l.alternate, e !== null && ru(e) === null && (n = l), l = l.sibling;
        l = n, l === null ? (n = t.child, t.child = null) : (n = l.sibling, l.sibling = null), Bi(
          t,
          !1,
          n,
          l,
          u,
          a
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (l = null, n = t.child, t.child = null; n !== null; ) {
          if (e = n.alternate, e !== null && ru(e) === null) {
            t.child = n;
            break;
          }
          e = n.sibling, n.sibling = l, l = n, n = e;
        }
        Bi(
          t,
          !0,
          l,
          null,
          u,
          a
        );
        break;
      case "together":
        Bi(
          t,
          !1,
          null,
          null,
          void 0,
          a
        );
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function Wt(e, t, l) {
    if (e !== null && (t.dependencies = e.dependencies), bl |= t.lanes, (l & t.childLanes) === 0)
      if (e !== null) {
        if (da(
          e,
          t,
          l,
          !1
        ), (l & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(s(153));
    if (t.child !== null) {
      for (e = t.child, l = Zt(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null; )
        e = e.sibling, l = l.sibling = Zt(e, e.pendingProps), l.return = t;
      l.sibling = null;
    }
    return t.child;
  }
  function Ri(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && tu(e)));
  }
  function t0(e, t, l) {
    switch (t.tag) {
      case 3:
        Je(t, t.stateNode.containerInfo), ol(t, Ge, e.memoizedState.cache), kl();
        break;
      case 27:
      case 5:
        we(t);
        break;
      case 4:
        Je(t, t.stateNode.containerInfo);
        break;
      case 10:
        ol(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, ci(t), null;
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (yl(t), t.flags |= 128, null) : (l & t.child.childLanes) !== 0 ? oo(e, t, l) : (yl(t), e = Wt(
            e,
            t,
            l
          ), e !== null ? e.sibling : null);
        yl(t);
        break;
      case 19:
        var n = (e.flags & 128) !== 0;
        if (a = (l & t.childLanes) !== 0, a || (da(
          e,
          t,
          l,
          !1
        ), a = (l & t.childLanes) !== 0), n) {
          if (a)
            return mo(
              e,
              t,
              l
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), U(Re, Re.current), a) break;
        return null;
      case 22:
        return t.lanes = 0, uo(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        ol(t, Ge, e.memoizedState.cache);
    }
    return Wt(e, t, l);
  }
  function yo(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        ke = !0;
      else {
        if (!Ri(e, l) && (t.flags & 128) === 0)
          return ke = !1, t0(
            e,
            t,
            l
          );
        ke = (e.flags & 131072) !== 0;
      }
    else
      ke = !1, fe && (t.flags & 1048576) !== 0 && Kr(t, Ia, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var a = t.pendingProps;
          if (e = Zl(t.elementType), t.type = e, typeof e == "function")
            kc(e) ? (a = Jl(e, a), t.tag = 1, t = ro(
              null,
              t,
              e,
              a,
              l
            )) : (t.tag = 0, t = Di(
              null,
              t,
              e,
              a,
              l
            ));
          else {
            if (e != null) {
              var n = e.$$typeof;
              if (n === Oe) {
                t.tag = 11, t = lo(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              } else if (n === I) {
                t.tag = 14, t = ao(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              }
            }
            throw t = Ae(e) || e, Error(s(306, t, ""));
          }
        }
        return t;
      case 0:
        return Di(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 1:
        return a = t.type, n = Jl(
          a,
          t.pendingProps
        ), ro(
          e,
          t,
          a,
          n,
          l
        );
      case 3:
        e: {
          if (Je(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(s(387));
          a = t.pendingProps;
          var u = t.memoizedState;
          n = u.element, ti(e, t), cn(t, a, null, l);
          var i = t.memoizedState;
          if (a = i.cache, ol(t, Ge, a), a !== u.cache && wc(
            t,
            [Ge],
            l,
            !0
          ), un(), a = i.element, u.isDehydrated)
            if (u = {
              element: a,
              isDehydrated: !1,
              cache: i.cache
            }, t.updateQueue.baseState = u, t.memoizedState = u, t.flags & 256) {
              t = so(
                e,
                t,
                a,
                l
              );
              break e;
            } else if (a !== n) {
              n = Nt(
                Error(s(424)),
                t
              ), Pa(n), t = so(
                e,
                t,
                a,
                l
              );
              break e;
            } else {
              switch (e = t.stateNode.containerInfo, e.nodeType) {
                case 9:
                  e = e.body;
                  break;
                default:
                  e = e.nodeName === "HTML" ? e.ownerDocument.body : e;
              }
              for (Ne = qt(e.firstChild), $e = t, fe = !0, rl = null, Ot = !0, l = us(
                t,
                null,
                a,
                l
              ), t.child = l; l; )
                l.flags = l.flags & -3 | 4096, l = l.sibling;
            }
          else {
            if (kl(), a === n) {
              t = Wt(
                e,
                t,
                l
              );
              break e;
            }
            Pe(e, t, a, l);
          }
          t = t.child;
        }
        return t;
      case 26:
        return pu(e, t), e === null ? (l = Nh(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = l : fe || (l = t.type, e = t.pendingProps, a = Lu(
          P.current
        ).createElement(l), a[We] = t, a[ut] = e, et(a, l, e), Ve(a), t.stateNode = a) : t.memoizedState = Nh(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return we(t), e === null && fe && (a = t.stateNode = Mh(
          t.type,
          t.pendingProps,
          P.current
        ), $e = t, Ot = !0, n = Ne, Tl(t.type) ? (yf = n, Ne = qt(a.firstChild)) : Ne = n), Pe(
          e,
          t,
          t.pendingProps.children,
          l
        ), pu(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && fe && ((n = a = Ne) && (a = q0(
          a,
          t.type,
          t.pendingProps,
          Ot
        ), a !== null ? (t.stateNode = a, $e = t, Ne = qt(a.firstChild), Ot = !1, n = !0) : n = !1), n || sl(t)), we(t), n = t.type, u = t.pendingProps, i = e !== null ? e.memoizedProps : null, a = u.children, sf(n, u) ? a = null : i !== null && sf(n, i) && (t.flags |= 32), t.memoizedState !== null && (n = fi(
          e,
          t,
          Kd,
          null,
          null,
          l
        ), _n._currentValue = n), pu(e, t), Pe(e, t, a, l), t.child;
      case 6:
        return e === null && fe && ((e = l = Ne) && (l = H0(
          l,
          t.pendingProps,
          Ot
        ), l !== null ? (t.stateNode = l, $e = t, Ne = null, e = !0) : e = !1), e || sl(t)), null;
      case 13:
        return oo(e, t, l);
      case 4:
        return Je(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, e === null ? t.child = Kl(
          t,
          null,
          a,
          l
        ) : Pe(e, t, a, l), t.child;
      case 11:
        return lo(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 7:
        return Pe(
          e,
          t,
          t.pendingProps,
          l
        ), t.child;
      case 8:
        return Pe(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 12:
        return Pe(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 10:
        return a = t.pendingProps, ol(t, t.type, a.value), Pe(e, t, a.children, l), t.child;
      case 9:
        return n = t.type._context, a = t.pendingProps.children, Xl(t), n = Ie(n), a = a(n), t.flags |= 1, Pe(e, t, a, l), t.child;
      case 14:
        return ao(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 15:
        return no(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 19:
        return mo(e, t, l);
      case 31:
        return e0(e, t, l);
      case 22:
        return uo(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        return Xl(t), a = Ie(Ge), e === null ? (n = Ic(), n === null && (n = Te, u = Wc(), n.pooledCache = u, u.refCount++, u !== null && (n.pooledCacheLanes |= l), n = u), t.memoizedState = { parent: a, cache: n }, ei(t), ol(t, Ge, n)) : ((e.lanes & l) !== 0 && (ti(e, t), cn(t, null, null, l), un()), n = e.memoizedState, u = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), ol(t, Ge, a)) : (a = u.cache, ol(t, Ge, a), a !== n.cache && wc(
          t,
          [Ge],
          l,
          !0
        ))), Pe(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(s(156, t.tag));
  }
  function $t(e) {
    e.flags |= 4;
  }
  function xi(e, t, l, a, n) {
    if ((t = (e.mode & 32) !== 0) && (t = !1), t) {
      if (e.flags |= 16777216, (n & 335544128) === n)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (Xo()) e.flags |= 8192;
        else
          throw Vl = uu, Pc;
    } else e.flags &= -16777217;
  }
  function vo(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !qh(t))
      if (Xo()) e.flags |= 8192;
      else
        throw Vl = uu, Pc;
  }
  function zu(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Jf() : 536870912, e.lanes |= t, Na |= t);
  }
  function mn(e, t) {
    if (!fe)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var l = null; t !== null; )
            t.alternate !== null && (l = t), t = t.sibling;
          l === null ? e.tail = null : l.sibling = null;
          break;
        case "collapsed":
          l = e.tail;
          for (var a = null; l !== null; )
            l.alternate !== null && (a = l), l = l.sibling;
          a === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : a.sibling = null;
      }
  }
  function _e(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, l = 0, a = 0;
    if (t)
      for (var n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags & 65011712, a |= n.flags & 65011712, n.return = e, n = n.sibling;
    else
      for (n = e.child; n !== null; )
        l |= n.lanes | n.childLanes, a |= n.subtreeFlags, a |= n.flags, n.return = e, n = n.sibling;
    return e.subtreeFlags |= a, e.childLanes = l, t;
  }
  function l0(e, t, l) {
    var a = t.pendingProps;
    switch (Zc(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return _e(t), null;
      case 1:
        return _e(t), null;
      case 3:
        return l = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), Ft(Ge), q(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (e === null || e.child === null) && (ma(t) ? $t(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Kc())), _e(t), null;
      case 26:
        var n = t.type, u = t.memoizedState;
        return e === null ? ($t(t), u !== null ? (_e(t), vo(t, u)) : (_e(t), xi(
          t,
          n,
          null,
          a,
          l
        ))) : u ? u !== e.memoizedState ? ($t(t), _e(t), vo(t, u)) : (_e(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== a && $t(t), _e(t), xi(
          t,
          n,
          e,
          a,
          l
        )), null;
      case 27:
        if (ql(t), l = P.current, n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && $t(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(s(166));
            return _e(t), null;
          }
          e = G.current, ma(t) ? Jr(t) : (e = Mh(n, a, l), t.stateNode = e, $t(t));
        }
        return _e(t), null;
      case 5:
        if (ql(t), n = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && $t(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(s(166));
            return _e(t), null;
          }
          if (u = G.current, ma(t))
            Jr(t);
          else {
            var i = Lu(
              P.current
            );
            switch (u) {
              case 1:
                u = i.createElementNS(
                  "http://www.w3.org/2000/svg",
                  n
                );
                break;
              case 2:
                u = i.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  n
                );
                break;
              default:
                switch (n) {
                  case "svg":
                    u = i.createElementNS(
                      "http://www.w3.org/2000/svg",
                      n
                    );
                    break;
                  case "math":
                    u = i.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      n
                    );
                    break;
                  case "script":
                    u = i.createElement("div"), u.innerHTML = "<script><\/script>", u = u.removeChild(
                      u.firstChild
                    );
                    break;
                  case "select":
                    u = typeof a.is == "string" ? i.createElement("select", {
                      is: a.is
                    }) : i.createElement("select"), a.multiple ? u.multiple = !0 : a.size && (u.size = a.size);
                    break;
                  default:
                    u = typeof a.is == "string" ? i.createElement(n, { is: a.is }) : i.createElement(n);
                }
            }
            u[We] = t, u[ut] = a;
            e: for (i = t.child; i !== null; ) {
              if (i.tag === 5 || i.tag === 6)
                u.appendChild(i.stateNode);
              else if (i.tag !== 4 && i.tag !== 27 && i.child !== null) {
                i.child.return = i, i = i.child;
                continue;
              }
              if (i === t) break e;
              for (; i.sibling === null; ) {
                if (i.return === null || i.return === t)
                  break e;
                i = i.return;
              }
              i.sibling.return = i.return, i = i.sibling;
            }
            t.stateNode = u;
            e: switch (et(u, n, a), n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break e;
              case "img":
                a = !0;
                break e;
              default:
                a = !1;
            }
            a && $t(t);
          }
        }
        return _e(t), xi(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          l
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== a && $t(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(s(166));
          if (e = P.current, ma(t)) {
            if (e = t.stateNode, l = t.memoizedProps, a = null, n = $e, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            e[We] = t, e = !!(e.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || hh(e.nodeValue, l)), e || sl(t, !0);
          } else
            e = Lu(e).createTextNode(
              a
            ), e[We] = t, t.stateNode = e;
        }
        return _e(t), null;
      case 31:
        if (l = t.memoizedState, e === null || e.memoizedState !== null) {
          if (a = ma(t), l !== null) {
            if (e === null) {
              if (!a) throw Error(s(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(s(557));
              e[We] = t;
            } else
              kl(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            _e(t), e = !1;
          } else
            l = Kc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = l), e = !0;
          if (!e)
            return t.flags & 256 ? (bt(t), t) : (bt(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(s(558));
        }
        return _e(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (n = ma(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!n) throw Error(s(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(s(317));
              n[We] = t;
            } else
              kl(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            _e(t), n = !1;
          } else
            n = Kc(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (bt(t), t) : (bt(t), null);
        }
        return bt(t), (t.flags & 128) !== 0 ? (t.lanes = l, t) : (l = a !== null, e = e !== null && e.memoizedState !== null, l && (a = t.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool), u = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (u = a.memoizedState.cachePool.pool), u !== n && (a.flags |= 2048)), l !== e && l && (t.child.flags |= 8192), zu(t, t.updateQueue), _e(t), null);
      case 4:
        return q(), e === null && nf(t.stateNode.containerInfo), _e(t), null;
      case 10:
        return Ft(t.type), _e(t), null;
      case 19:
        if (_(Re), a = t.memoizedState, a === null) return _e(t), null;
        if (n = (t.flags & 128) !== 0, u = a.rendering, u === null)
          if (n) mn(a, !1);
          else {
            if (Ue !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (u = ru(e), u !== null) {
                  for (t.flags |= 128, mn(a, !1), e = u.updateQueue, t.updateQueue = e, zu(t, e), t.subtreeFlags = 0, e = l, l = t.child; l !== null; )
                    Qr(l, e), l = l.sibling;
                  return U(
                    Re,
                    Re.current & 1 | 2
                  ), fe && Vt(t, a.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            a.tail !== null && mt() > _u && (t.flags |= 128, n = !0, mn(a, !1), t.lanes = 4194304);
          }
        else {
          if (!n)
            if (e = ru(u), e !== null) {
              if (t.flags |= 128, n = !0, e = e.updateQueue, t.updateQueue = e, zu(t, e), mn(a, !0), a.tail === null && a.tailMode === "hidden" && !u.alternate && !fe)
                return _e(t), null;
            } else
              2 * mt() - a.renderingStartTime > _u && l !== 536870912 && (t.flags |= 128, n = !0, mn(a, !1), t.lanes = 4194304);
          a.isBackwards ? (u.sibling = t.child, t.child = u) : (e = a.last, e !== null ? e.sibling = u : t.child = u, a.last = u);
        }
        return a.tail !== null ? (e = a.tail, a.rendering = e, a.tail = e.sibling, a.renderingStartTime = mt(), e.sibling = null, l = Re.current, U(
          Re,
          n ? l & 1 | 2 : l & 1
        ), fe && Vt(t, a.treeForkCount), e) : (_e(t), null);
      case 22:
      case 23:
        return bt(t), ui(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (_e(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : _e(t), l = t.updateQueue, l !== null && zu(t, l.retryQueue), l = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== l && (t.flags |= 2048), e !== null && _(Ql), null;
      case 24:
        return l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), Ft(Ge), _e(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(s(156, t.tag));
  }
  function a0(e, t) {
    switch (Zc(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Ft(Ge), q(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return ql(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (bt(t), t.alternate === null)
            throw Error(s(340));
          kl();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (bt(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(s(340));
          kl();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return _(Re), null;
      case 4:
        return q(), null;
      case 10:
        return Ft(t.type), null;
      case 22:
      case 23:
        return bt(t), ui(), e !== null && _(Ql), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return Ft(Ge), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function go(e, t) {
    switch (Zc(t), t.tag) {
      case 3:
        Ft(Ge), q();
        break;
      case 26:
      case 27:
      case 5:
        ql(t);
        break;
      case 4:
        q();
        break;
      case 31:
        t.memoizedState !== null && bt(t);
        break;
      case 13:
        bt(t);
        break;
      case 19:
        _(Re);
        break;
      case 10:
        Ft(t.type);
        break;
      case 22:
      case 23:
        bt(t), ui(), e !== null && _(Ql);
        break;
      case 24:
        Ft(Ge);
    }
  }
  function dn(e, t) {
    try {
      var l = t.updateQueue, a = l !== null ? l.lastEffect : null;
      if (a !== null) {
        var n = a.next;
        l = n;
        do {
          if ((l.tag & e) === e) {
            a = void 0;
            var u = l.create, i = l.inst;
            a = u(), i.destroy = a;
          }
          l = l.next;
        } while (l !== n);
      }
    } catch (r) {
      be(t, t.return, r);
    }
  }
  function gl(e, t, l) {
    try {
      var a = t.updateQueue, n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var u = n.next;
        a = u;
        do {
          if ((a.tag & e) === e) {
            var i = a.inst, r = i.destroy;
            if (r !== void 0) {
              i.destroy = void 0, n = t;
              var o = l, E = r;
              try {
                E();
              } catch (M) {
                be(
                  n,
                  o,
                  M
                );
              }
            }
          }
          a = a.next;
        } while (a !== u);
      }
    } catch (M) {
      be(t, t.return, M);
    }
  }
  function Eo(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var l = e.stateNode;
      try {
        is(t, l);
      } catch (a) {
        be(e, e.return, a);
      }
    }
  }
  function bo(e, t, l) {
    l.props = Jl(
      e.type,
      e.memoizedProps
    ), l.state = e.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      be(e, t, a);
    }
  }
  function yn(e, t) {
    try {
      var l = e.ref;
      if (l !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var a = e.stateNode;
            break;
          case 30:
            a = e.stateNode;
            break;
          default:
            a = e.stateNode;
        }
        typeof l == "function" ? e.refCleanup = l(a) : l.current = a;
      }
    } catch (n) {
      be(e, t, n);
    }
  }
  function Yt(e, t) {
    var l = e.ref, a = e.refCleanup;
    if (l !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          be(e, t, n);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (n) {
          be(e, t, n);
        }
      else l.current = null;
  }
  function po(e) {
    var t = e.type, l = e.memoizedProps, a = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          l.autoFocus && a.focus();
          break e;
        case "img":
          l.src ? a.src = l.src : l.srcSet && (a.srcset = l.srcSet);
      }
    } catch (n) {
      be(e, e.return, n);
    }
  }
  function Li(e, t, l) {
    try {
      var a = e.stateNode;
      A0(a, e.type, l, t), a[ut] = t;
    } catch (n) {
      be(e, e.return, n);
    }
  }
  function So(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Tl(e.type) || e.tag === 4;
  }
  function Gi(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || So(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && Tl(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Yi(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(e, t) : (t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, t.appendChild(e), l = l._reactRootContainer, l != null || t.onclick !== null || (t.onclick = Xt));
    else if (a !== 4 && (a === 27 && Tl(e.type) && (l = e.stateNode, t = null), e = e.child, e !== null))
      for (Yi(e, t, l), e = e.sibling; e !== null; )
        Yi(e, t, l), e = e.sibling;
  }
  function Mu(e, t, l) {
    var a = e.tag;
    if (a === 5 || a === 6)
      e = e.stateNode, t ? l.insertBefore(e, t) : l.appendChild(e);
    else if (a !== 4 && (a === 27 && Tl(e.type) && (l = e.stateNode), e = e.child, e !== null))
      for (Mu(e, t, l), e = e.sibling; e !== null; )
        Mu(e, t, l), e = e.sibling;
  }
  function zo(e) {
    var t = e.stateNode, l = e.memoizedProps;
    try {
      for (var a = e.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      et(t, a, l), t[We] = e, t[ut] = l;
    } catch (u) {
      be(e, e.return, u);
    }
  }
  var It = !1, je = !1, ki = !1, Mo = typeof WeakSet == "function" ? WeakSet : Set, Ke = null;
  function n0(e, t) {
    if (e = e.containerInfo, ff = Zu, e = Br(e), Uc(e)) {
      if ("selectionStart" in e)
        var l = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      else
        e: {
          l = (l = e.ownerDocument) && l.defaultView || window;
          var a = l.getSelection && l.getSelection();
          if (a && a.rangeCount !== 0) {
            l = a.anchorNode;
            var n = a.anchorOffset, u = a.focusNode;
            a = a.focusOffset;
            try {
              l.nodeType, u.nodeType;
            } catch {
              l = null;
              break e;
            }
            var i = 0, r = -1, o = -1, E = 0, M = 0, N = e, b = null;
            t: for (; ; ) {
              for (var p; N !== l || n !== 0 && N.nodeType !== 3 || (r = i + n), N !== u || a !== 0 && N.nodeType !== 3 || (o = i + a), N.nodeType === 3 && (i += N.nodeValue.length), (p = N.firstChild) !== null; )
                b = N, N = p;
              for (; ; ) {
                if (N === e) break t;
                if (b === l && ++E === n && (r = i), b === u && ++M === a && (o = i), (p = N.nextSibling) !== null) break;
                N = b, b = N.parentNode;
              }
              N = p;
            }
            l = r === -1 || o === -1 ? null : { start: r, end: o };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (rf = { focusedElem: e, selectionRange: l }, Zu = !1, Ke = t; Ke !== null; )
      if (t = Ke, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null)
        e.return = t, Ke = e;
      else
        for (; Ke !== null; ) {
          switch (t = Ke, u = t.alternate, e = t.flags, t.tag) {
            case 0:
              if ((e & 4) !== 0 && (e = t.updateQueue, e = e !== null ? e.events : null, e !== null))
                for (l = 0; l < e.length; l++)
                  n = e[l], n.ref.impl = n.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && u !== null) {
                e = void 0, l = t, n = u.memoizedProps, u = u.memoizedState, a = l.stateNode;
                try {
                  var x = Jl(
                    l.type,
                    n
                  );
                  e = a.getSnapshotBeforeUpdate(
                    x,
                    u
                  ), a.__reactInternalSnapshotBeforeUpdate = e;
                } catch (K) {
                  be(
                    l,
                    l.return,
                    K
                  );
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (e = t.stateNode.containerInfo, l = e.nodeType, l === 9)
                  hf(e);
                else if (l === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      hf(e);
                      break;
                    default:
                      e.textContent = "";
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
              if ((e & 1024) !== 0) throw Error(s(163));
          }
          if (e = t.sibling, e !== null) {
            e.return = t.return, Ke = e;
            break;
          }
          Ke = t.return;
        }
  }
  function To(e, t, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        el(e, l), a & 4 && dn(5, l);
        break;
      case 1:
        if (el(e, l), a & 4)
          if (e = l.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (i) {
              be(l, l.return, i);
            }
          else {
            var n = Jl(
              l.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              e.componentDidUpdate(
                n,
                t,
                e.__reactInternalSnapshotBeforeUpdate
              );
            } catch (i) {
              be(
                l,
                l.return,
                i
              );
            }
          }
        a & 64 && Eo(l), a & 512 && yn(l, l.return);
        break;
      case 3:
        if (el(e, l), a & 64 && (e = l.updateQueue, e !== null)) {
          if (t = null, l.child !== null)
            switch (l.child.tag) {
              case 27:
              case 5:
                t = l.child.stateNode;
                break;
              case 1:
                t = l.child.stateNode;
            }
          try {
            is(e, t);
          } catch (i) {
            be(l, l.return, i);
          }
        }
        break;
      case 27:
        t === null && a & 4 && zo(l);
      case 26:
      case 5:
        el(e, l), t === null && a & 4 && po(l), a & 512 && yn(l, l.return);
        break;
      case 12:
        el(e, l);
        break;
      case 31:
        el(e, l), a & 4 && _o(e, l);
        break;
      case 13:
        el(e, l), a & 4 && Do(e, l), a & 64 && (e = l.memoizedState, e !== null && (e = e.dehydrated, e !== null && (l = m0.bind(
          null,
          l
        ), U0(e, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || It, !a) {
          t = t !== null && t.memoizedState !== null || je, n = It;
          var u = je;
          It = a, (je = t) && !u ? tl(
            e,
            l,
            (l.subtreeFlags & 8772) !== 0
          ) : el(e, l), It = n, je = u;
        }
        break;
      case 30:
        break;
      default:
        el(e, l);
    }
  }
  function Ao(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Ao(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && vc(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var Ce = null, it = !1;
  function Pt(e, t, l) {
    for (l = l.child; l !== null; )
      No(e, t, l), l = l.sibling;
  }
  function No(e, t, l) {
    if (dt && typeof dt.onCommitFiberUnmount == "function")
      try {
        dt.onCommitFiberUnmount(Ga, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        je || Yt(l, t), Pt(
          e,
          t,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        je || Yt(l, t);
        var a = Ce, n = it;
        Tl(l.type) && (Ce = l.stateNode, it = !1), Pt(
          e,
          t,
          l
        ), Tn(l.stateNode), Ce = a, it = n;
        break;
      case 5:
        je || Yt(l, t);
      case 6:
        if (a = Ce, n = it, Ce = null, Pt(
          e,
          t,
          l
        ), Ce = a, it = n, Ce !== null)
          if (it)
            try {
              (Ce.nodeType === 9 ? Ce.body : Ce.nodeName === "HTML" ? Ce.ownerDocument.body : Ce).removeChild(l.stateNode);
            } catch (u) {
              be(
                l,
                t,
                u
              );
            }
          else
            try {
              Ce.removeChild(l.stateNode);
            } catch (u) {
              be(
                l,
                t,
                u
              );
            }
        break;
      case 18:
        Ce !== null && (it ? (e = Ce, Eh(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          l.stateNode
        ), Ba(e)) : Eh(Ce, l.stateNode));
        break;
      case 4:
        a = Ce, n = it, Ce = l.stateNode.containerInfo, it = !0, Pt(
          e,
          t,
          l
        ), Ce = a, it = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        gl(2, l, t), je || gl(4, l, t), Pt(
          e,
          t,
          l
        );
        break;
      case 1:
        je || (Yt(l, t), a = l.stateNode, typeof a.componentWillUnmount == "function" && bo(
          l,
          t,
          a
        )), Pt(
          e,
          t,
          l
        );
        break;
      case 21:
        Pt(
          e,
          t,
          l
        );
        break;
      case 22:
        je = (a = je) || l.memoizedState !== null, Pt(
          e,
          t,
          l
        ), je = a;
        break;
      default:
        Pt(
          e,
          t,
          l
        );
    }
  }
  function _o(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        Ba(e);
      } catch (l) {
        be(t, t.return, l);
      }
    }
  }
  function Do(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        Ba(e);
      } catch (l) {
        be(t, t.return, l);
      }
  }
  function u0(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new Mo()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new Mo()), t;
      default:
        throw Error(s(435, e.tag));
    }
  }
  function Tu(e, t) {
    var l = u0(e);
    t.forEach(function(a) {
      if (!l.has(a)) {
        l.add(a);
        var n = d0.bind(null, e, a);
        a.then(n, n);
      }
    });
  }
  function ft(e, t) {
    var l = t.deletions;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var n = l[a], u = e, i = t, r = i;
        e: for (; r !== null; ) {
          switch (r.tag) {
            case 27:
              if (Tl(r.type)) {
                Ce = r.stateNode, it = !1;
                break e;
              }
              break;
            case 5:
              Ce = r.stateNode, it = !1;
              break e;
            case 3:
            case 4:
              Ce = r.stateNode.containerInfo, it = !0;
              break e;
          }
          r = r.return;
        }
        if (Ce === null) throw Error(s(160));
        No(u, i, n), Ce = null, it = !1, u = n.alternate, u !== null && (u.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        Oo(t, e), t = t.sibling;
  }
  var Bt = null;
  function Oo(e, t) {
    var l = e.alternate, a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        ft(t, e), rt(e), a & 4 && (gl(3, e, e.return), dn(3, e), gl(5, e, e.return));
        break;
      case 1:
        ft(t, e), rt(e), a & 512 && (je || l === null || Yt(l, l.return)), a & 64 && It && (e = e.updateQueue, e !== null && (a = e.callbacks, a !== null && (l = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = l === null ? a : l.concat(a))));
        break;
      case 26:
        var n = Bt;
        if (ft(t, e), rt(e), a & 512 && (je || l === null || Yt(l, l.return)), a & 4) {
          var u = l !== null ? l.memoizedState : null;
          if (a = e.memoizedState, l === null)
            if (a === null)
              if (e.stateNode === null) {
                e: {
                  a = e.type, l = e.memoizedProps, n = n.ownerDocument || n;
                  t: switch (a) {
                    case "title":
                      u = n.getElementsByTagName("title")[0], (!u || u[ja] || u[We] || u.namespaceURI === "http://www.w3.org/2000/svg" || u.hasAttribute("itemprop")) && (u = n.createElement(a), n.head.insertBefore(
                        u,
                        n.querySelector("head > title")
                      )), et(u, a, l), u[We] = e, Ve(u), a = u;
                      break e;
                    case "link":
                      var i = Oh(
                        "link",
                        "href",
                        n
                      ).get(a + (l.href || ""));
                      if (i) {
                        for (var r = 0; r < i.length; r++)
                          if (u = i[r], u.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) && u.getAttribute("rel") === (l.rel == null ? null : l.rel) && u.getAttribute("title") === (l.title == null ? null : l.title) && u.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin)) {
                            i.splice(r, 1);
                            break t;
                          }
                      }
                      u = n.createElement(a), et(u, a, l), n.head.appendChild(u);
                      break;
                    case "meta":
                      if (i = Oh(
                        "meta",
                        "content",
                        n
                      ).get(a + (l.content || ""))) {
                        for (r = 0; r < i.length; r++)
                          if (u = i[r], u.getAttribute("content") === (l.content == null ? null : "" + l.content) && u.getAttribute("name") === (l.name == null ? null : l.name) && u.getAttribute("property") === (l.property == null ? null : l.property) && u.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) && u.getAttribute("charset") === (l.charSet == null ? null : l.charSet)) {
                            i.splice(r, 1);
                            break t;
                          }
                      }
                      u = n.createElement(a), et(u, a, l), n.head.appendChild(u);
                      break;
                    default:
                      throw Error(s(468, a));
                  }
                  u[We] = e, Ve(u), a = u;
                }
                e.stateNode = a;
              } else
                Ch(
                  n,
                  e.type,
                  e.stateNode
                );
            else
              e.stateNode = Dh(
                n,
                a,
                e.memoizedProps
              );
          else
            u !== a ? (u === null ? l.stateNode !== null && (l = l.stateNode, l.parentNode.removeChild(l)) : u.count--, a === null ? Ch(
              n,
              e.type,
              e.stateNode
            ) : Dh(
              n,
              a,
              e.memoizedProps
            )) : a === null && e.stateNode !== null && Li(
              e,
              e.memoizedProps,
              l.memoizedProps
            );
        }
        break;
      case 27:
        ft(t, e), rt(e), a & 512 && (je || l === null || Yt(l, l.return)), l !== null && a & 4 && Li(
          e,
          e.memoizedProps,
          l.memoizedProps
        );
        break;
      case 5:
        if (ft(t, e), rt(e), a & 512 && (je || l === null || Yt(l, l.return)), e.flags & 32) {
          n = e.stateNode;
          try {
            aa(n, "");
          } catch (x) {
            be(e, e.return, x);
          }
        }
        a & 4 && e.stateNode != null && (n = e.memoizedProps, Li(
          e,
          n,
          l !== null ? l.memoizedProps : n
        )), a & 1024 && (ki = !0);
        break;
      case 6:
        if (ft(t, e), rt(e), a & 4) {
          if (e.stateNode === null)
            throw Error(s(162));
          a = e.memoizedProps, l = e.stateNode;
          try {
            l.nodeValue = a;
          } catch (x) {
            be(e, e.return, x);
          }
        }
        break;
      case 3:
        if (ku = null, n = Bt, Bt = Gu(t.containerInfo), ft(t, e), Bt = n, rt(e), a & 4 && l !== null && l.memoizedState.isDehydrated)
          try {
            Ba(t.containerInfo);
          } catch (x) {
            be(e, e.return, x);
          }
        ki && (ki = !1, Co(e));
        break;
      case 4:
        a = Bt, Bt = Gu(
          e.stateNode.containerInfo
        ), ft(t, e), rt(e), Bt = a;
        break;
      case 12:
        ft(t, e), rt(e);
        break;
      case 31:
        ft(t, e), rt(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Tu(e, a)));
        break;
      case 13:
        ft(t, e), rt(e), e.child.flags & 8192 && e.memoizedState !== null != (l !== null && l.memoizedState !== null) && (Nu = mt()), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Tu(e, a)));
        break;
      case 22:
        n = e.memoizedState !== null;
        var o = l !== null && l.memoizedState !== null, E = It, M = je;
        if (It = E || n, je = M || o, ft(t, e), je = M, It = E, rt(e), a & 8192)
          e: for (t = e.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, n && (l === null || o || It || je || wl(e)), l = null, t = e; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (l === null) {
                o = l = t;
                try {
                  if (u = o.stateNode, n)
                    i = u.style, typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none";
                  else {
                    r = o.stateNode;
                    var N = o.memoizedProps.style, b = N != null && N.hasOwnProperty("display") ? N.display : null;
                    r.style.display = b == null || typeof b == "boolean" ? "" : ("" + b).trim();
                  }
                } catch (x) {
                  be(o, o.return, x);
                }
              }
            } else if (t.tag === 6) {
              if (l === null) {
                o = t;
                try {
                  o.stateNode.nodeValue = n ? "" : o.memoizedProps;
                } catch (x) {
                  be(o, o.return, x);
                }
              }
            } else if (t.tag === 18) {
              if (l === null) {
                o = t;
                try {
                  var p = o.stateNode;
                  n ? bh(p, !0) : bh(o.stateNode, !1);
                } catch (x) {
                  be(o, o.return, x);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === e) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === e) break e;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === e) break e;
              l === t && (l = null), t = t.return;
            }
            l === t && (l = null), t.sibling.return = t.return, t = t.sibling;
          }
        a & 4 && (a = e.updateQueue, a !== null && (l = a.retryQueue, l !== null && (a.retryQueue = null, Tu(e, l))));
        break;
      case 19:
        ft(t, e), rt(e), a & 4 && (a = e.updateQueue, a !== null && (e.updateQueue = null, Tu(e, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        ft(t, e), rt(e);
    }
  }
  function rt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var l, a = e.return; a !== null; ) {
          if (So(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        if (l == null) throw Error(s(160));
        switch (l.tag) {
          case 27:
            var n = l.stateNode, u = Gi(e);
            Mu(e, u, n);
            break;
          case 5:
            var i = l.stateNode;
            l.flags & 32 && (aa(i, ""), l.flags &= -33);
            var r = Gi(e);
            Mu(e, r, i);
            break;
          case 3:
          case 4:
            var o = l.stateNode.containerInfo, E = Gi(e);
            Yi(
              e,
              E,
              o
            );
            break;
          default:
            throw Error(s(161));
        }
      } catch (M) {
        be(e, e.return, M);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Co(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        Co(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), e = e.sibling;
      }
  }
  function el(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        To(e, t.alternate, t), t = t.sibling;
  }
  function wl(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          gl(4, t, t.return), wl(t);
          break;
        case 1:
          Yt(t, t.return);
          var l = t.stateNode;
          typeof l.componentWillUnmount == "function" && bo(
            t,
            t.return,
            l
          ), wl(t);
          break;
        case 27:
          Tn(t.stateNode);
        case 26:
        case 5:
          Yt(t, t.return), wl(t);
          break;
        case 22:
          t.memoizedState === null && wl(t);
          break;
        case 30:
          wl(t);
          break;
        default:
          wl(t);
      }
      e = e.sibling;
    }
  }
  function tl(e, t, l) {
    for (l = l && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate, n = e, u = t, i = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          tl(
            n,
            u,
            l
          ), dn(4, u);
          break;
        case 1:
          if (tl(
            n,
            u,
            l
          ), a = u, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (E) {
              be(a, a.return, E);
            }
          if (a = u, n = a.updateQueue, n !== null) {
            var r = a.stateNode;
            try {
              var o = n.shared.hiddenCallbacks;
              if (o !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < o.length; n++)
                  cs(o[n], r);
            } catch (E) {
              be(a, a.return, E);
            }
          }
          l && i & 64 && Eo(u), yn(u, u.return);
          break;
        case 27:
          zo(u);
        case 26:
        case 5:
          tl(
            n,
            u,
            l
          ), l && a === null && i & 4 && po(u), yn(u, u.return);
          break;
        case 12:
          tl(
            n,
            u,
            l
          );
          break;
        case 31:
          tl(
            n,
            u,
            l
          ), l && i & 4 && _o(n, u);
          break;
        case 13:
          tl(
            n,
            u,
            l
          ), l && i & 4 && Do(n, u);
          break;
        case 22:
          u.memoizedState === null && tl(
            n,
            u,
            l
          ), yn(u, u.return);
          break;
        case 30:
          break;
        default:
          tl(
            n,
            u,
            l
          );
      }
      t = t.sibling;
    }
  }
  function ji(e, t) {
    var l = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== l && (e != null && e.refCount++, l != null && en(l));
  }
  function Xi(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && en(e));
  }
  function Rt(e, t, l, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        qo(
          e,
          t,
          l,
          a
        ), t = t.sibling;
  }
  function qo(e, t, l, a) {
    var n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Rt(
          e,
          t,
          l,
          a
        ), n & 2048 && dn(9, t);
        break;
      case 1:
        Rt(
          e,
          t,
          l,
          a
        );
        break;
      case 3:
        Rt(
          e,
          t,
          l,
          a
        ), n & 2048 && (e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && en(e)));
        break;
      case 12:
        if (n & 2048) {
          Rt(
            e,
            t,
            l,
            a
          ), e = t.stateNode;
          try {
            var u = t.memoizedProps, i = u.id, r = u.onPostCommit;
            typeof r == "function" && r(
              i,
              t.alternate === null ? "mount" : "update",
              e.passiveEffectDuration,
              -0
            );
          } catch (o) {
            be(t, t.return, o);
          }
        } else
          Rt(
            e,
            t,
            l,
            a
          );
        break;
      case 31:
        Rt(
          e,
          t,
          l,
          a
        );
        break;
      case 13:
        Rt(
          e,
          t,
          l,
          a
        );
        break;
      case 23:
        break;
      case 22:
        u = t.stateNode, i = t.alternate, t.memoizedState !== null ? u._visibility & 2 ? Rt(
          e,
          t,
          l,
          a
        ) : vn(e, t) : u._visibility & 2 ? Rt(
          e,
          t,
          l,
          a
        ) : (u._visibility |= 2, Ma(
          e,
          t,
          l,
          a,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), n & 2048 && ji(i, t);
        break;
      case 24:
        Rt(
          e,
          t,
          l,
          a
        ), n & 2048 && Xi(t.alternate, t);
        break;
      default:
        Rt(
          e,
          t,
          l,
          a
        );
    }
  }
  function Ma(e, t, l, a, n) {
    for (n = n && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var u = e, i = t, r = l, o = a, E = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          Ma(
            u,
            i,
            r,
            o,
            n
          ), dn(8, i);
          break;
        case 23:
          break;
        case 22:
          var M = i.stateNode;
          i.memoizedState !== null ? M._visibility & 2 ? Ma(
            u,
            i,
            r,
            o,
            n
          ) : vn(
            u,
            i
          ) : (M._visibility |= 2, Ma(
            u,
            i,
            r,
            o,
            n
          )), n && E & 2048 && ji(
            i.alternate,
            i
          );
          break;
        case 24:
          Ma(
            u,
            i,
            r,
            o,
            n
          ), n && E & 2048 && Xi(i.alternate, i);
          break;
        default:
          Ma(
            u,
            i,
            r,
            o,
            n
          );
      }
      t = t.sibling;
    }
  }
  function vn(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var l = e, a = t, n = a.flags;
        switch (a.tag) {
          case 22:
            vn(l, a), n & 2048 && ji(
              a.alternate,
              a
            );
            break;
          case 24:
            vn(l, a), n & 2048 && Xi(a.alternate, a);
            break;
          default:
            vn(l, a);
        }
        t = t.sibling;
      }
  }
  var gn = 8192;
  function Ta(e, t, l) {
    if (e.subtreeFlags & gn)
      for (e = e.child; e !== null; )
        Ho(
          e,
          t,
          l
        ), e = e.sibling;
  }
  function Ho(e, t, l) {
    switch (e.tag) {
      case 26:
        Ta(
          e,
          t,
          l
        ), e.flags & gn && e.memoizedState !== null && V0(
          l,
          Bt,
          e.memoizedState,
          e.memoizedProps
        );
        break;
      case 5:
        Ta(
          e,
          t,
          l
        );
        break;
      case 3:
      case 4:
        var a = Bt;
        Bt = Gu(e.stateNode.containerInfo), Ta(
          e,
          t,
          l
        ), Bt = a;
        break;
      case 22:
        e.memoizedState === null && (a = e.alternate, a !== null && a.memoizedState !== null ? (a = gn, gn = 16777216, Ta(
          e,
          t,
          l
        ), gn = a) : Ta(
          e,
          t,
          l
        ));
        break;
      default:
        Ta(
          e,
          t,
          l
        );
    }
  }
  function Uo(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function En(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          Ke = a, Ro(
            a,
            e
          );
        }
      Uo(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        Bo(e), e = e.sibling;
  }
  function Bo(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        En(e), e.flags & 2048 && gl(9, e, e.return);
        break;
      case 3:
        En(e);
        break;
      case 12:
        En(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, Au(e)) : En(e);
        break;
      default:
        En(e);
    }
  }
  function Au(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          Ke = a, Ro(
            a,
            e
          );
        }
      Uo(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          gl(8, t, t.return), Au(t);
          break;
        case 22:
          l = t.stateNode, l._visibility & 2 && (l._visibility &= -3, Au(t));
          break;
        default:
          Au(t);
      }
      e = e.sibling;
    }
  }
  function Ro(e, t) {
    for (; Ke !== null; ) {
      var l = Ke;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          gl(8, l, t);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          en(l.memoizedState.cache);
      }
      if (a = l.child, a !== null) a.return = l, Ke = a;
      else
        e: for (l = e; Ke !== null; ) {
          a = Ke;
          var n = a.sibling, u = a.return;
          if (Ao(a), a === l) {
            Ke = null;
            break e;
          }
          if (n !== null) {
            n.return = u, Ke = n;
            break e;
          }
          Ke = u;
        }
    }
  }
  var c0 = {
    getCacheForType: function(e) {
      var t = Ie(Ge), l = t.data.get(e);
      return l === void 0 && (l = e(), t.data.set(e, l)), l;
    },
    cacheSignal: function() {
      return Ie(Ge).controller.signal;
    }
  }, i0 = typeof WeakMap == "function" ? WeakMap : Map, ye = 0, Te = null, ae = null, ce = 0, Ee = 0, pt = null, El = !1, Aa = !1, Qi = !1, ll = 0, Ue = 0, bl = 0, Wl = 0, Zi = 0, St = 0, Na = 0, bn = null, st = null, Vi = !1, Nu = 0, xo = 0, _u = 1 / 0, Du = null, pl = null, Qe = 0, Sl = null, _a = null, al = 0, Ki = 0, Fi = null, Lo = null, pn = 0, Ji = null;
  function zt() {
    return (ye & 2) !== 0 && ce !== 0 ? ce & -ce : T.T !== null ? ef() : If();
  }
  function Go() {
    if (St === 0)
      if ((ce & 536870912) === 0 || fe) {
        var e = xn;
        xn <<= 1, (xn & 3932160) === 0 && (xn = 262144), St = e;
      } else St = 536870912;
    return e = Et.current, e !== null && (e.flags |= 32), St;
  }
  function ot(e, t, l) {
    (e === Te && (Ee === 2 || Ee === 9) || e.cancelPendingCommit !== null) && (Da(e, 0), zl(
      e,
      ce,
      St,
      !1
    )), ka(e, l), ((ye & 2) === 0 || e !== Te) && (e === Te && ((ye & 2) === 0 && (Wl |= l), Ue === 4 && zl(
      e,
      ce,
      St,
      !1
    )), kt(e));
  }
  function Yo(e, t, l) {
    if ((ye & 6) !== 0) throw Error(s(327));
    var a = !l && (t & 127) === 0 && (t & e.expiredLanes) === 0 || Ya(e, t), n = a ? s0(e, t) : Wi(e, t, !0), u = a;
    do {
      if (n === 0) {
        Aa && !a && zl(e, t, 0, !1);
        break;
      } else {
        if (l = e.current.alternate, u && !f0(l)) {
          n = Wi(e, t, !1), u = !1;
          continue;
        }
        if (n === 2) {
          if (u = t, e.errorRecoveryDisabledLanes & u)
            var i = 0;
          else
            i = e.pendingLanes & -536870913, i = i !== 0 ? i : i & 536870912 ? 536870912 : 0;
          if (i !== 0) {
            t = i;
            e: {
              var r = e;
              n = bn;
              var o = r.current.memoizedState.isDehydrated;
              if (o && (Da(r, i).flags |= 256), i = Wi(
                r,
                i,
                !1
              ), i !== 2) {
                if (Qi && !o) {
                  r.errorRecoveryDisabledLanes |= u, Wl |= u, n = 4;
                  break e;
                }
                u = st, st = n, u !== null && (st === null ? st = u : st.push.apply(
                  st,
                  u
                ));
              }
              n = i;
            }
            if (u = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          Da(e, 0), zl(e, t, 0, !0);
          break;
        }
        e: {
          switch (a = e, u = n, u) {
            case 0:
            case 1:
              throw Error(s(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              zl(
                a,
                t,
                St,
                !El
              );
              break e;
            case 2:
              st = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(s(329));
          }
          if ((t & 62914560) === t && (n = Nu + 300 - mt(), 10 < n)) {
            if (zl(
              a,
              t,
              St,
              !El
            ), Gn(a, 0, !0) !== 0) break e;
            al = t, a.timeoutHandle = vh(
              ko.bind(
                null,
                a,
                l,
                st,
                Du,
                Vi,
                t,
                St,
                Wl,
                Na,
                El,
                u,
                "Throttled",
                -0,
                0
              ),
              n
            );
            break e;
          }
          ko(
            a,
            l,
            st,
            Du,
            Vi,
            t,
            St,
            Wl,
            Na,
            El,
            u,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    kt(e);
  }
  function ko(e, t, l, a, n, u, i, r, o, E, M, N, b, p) {
    if (e.timeoutHandle = -1, N = t.subtreeFlags, N & 8192 || (N & 16785408) === 16785408) {
      N = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Xt
      }, Ho(
        t,
        u,
        N
      );
      var x = (u & 62914560) === u ? Nu - mt() : (u & 4194048) === u ? xo - mt() : 0;
      if (x = K0(
        N,
        x
      ), x !== null) {
        al = u, e.cancelPendingCommit = x(
          Jo.bind(
            null,
            e,
            t,
            u,
            l,
            a,
            n,
            i,
            r,
            o,
            M,
            N,
            null,
            b,
            p
          )
        ), zl(e, u, i, !E);
        return;
      }
    }
    Jo(
      e,
      t,
      u,
      l,
      a,
      n,
      i,
      r,
      o
    );
  }
  function f0(e) {
    for (var t = e; ; ) {
      var l = t.tag;
      if ((l === 0 || l === 11 || l === 15) && t.flags & 16384 && (l = t.updateQueue, l !== null && (l = l.stores, l !== null)))
        for (var a = 0; a < l.length; a++) {
          var n = l[a], u = n.getSnapshot;
          n = n.value;
          try {
            if (!vt(u(), n)) return !1;
          } catch {
            return !1;
          }
        }
      if (l = t.child, t.subtreeFlags & 16384 && l !== null)
        l.return = t, t = l;
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function zl(e, t, l, a) {
    t &= ~Zi, t &= ~Wl, e.suspendedLanes |= t, e.pingedLanes &= ~t, a && (e.warmLanes |= t), a = e.expirationTimes;
    for (var n = t; 0 < n; ) {
      var u = 31 - yt(n), i = 1 << u;
      a[u] = -1, n &= ~i;
    }
    l !== 0 && wf(e, l, t);
  }
  function Ou() {
    return (ye & 6) === 0 ? (Sn(0), !1) : !0;
  }
  function wi() {
    if (ae !== null) {
      if (Ee === 0)
        var e = ae.return;
      else
        e = ae, Kt = jl = null, oi(e), Ea = null, ln = 0, e = ae;
      for (; e !== null; )
        go(e.alternate, e), e = e.return;
      ae = null;
    }
  }
  function Da(e, t) {
    var l = e.timeoutHandle;
    l !== -1 && (e.timeoutHandle = -1, D0(l)), l = e.cancelPendingCommit, l !== null && (e.cancelPendingCommit = null, l()), al = 0, wi(), Te = e, ae = l = Zt(e.current, null), ce = t, Ee = 0, pt = null, El = !1, Aa = Ya(e, t), Qi = !1, Na = St = Zi = Wl = bl = Ue = 0, st = bn = null, Vi = !1, (t & 8) !== 0 && (t |= t & 32);
    var a = e.entangledLanes;
    if (a !== 0)
      for (e = e.entanglements, a &= t; 0 < a; ) {
        var n = 31 - yt(a), u = 1 << n;
        t |= e[n], a &= ~u;
      }
    return ll = t, Wn(), l;
  }
  function jo(e, t) {
    ee = null, T.H = on, t === ga || t === nu ? (t = ls(), Ee = 3) : t === Pc ? (t = ls(), Ee = 4) : Ee = t === _i ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, pt = t, ae === null && (Ue = 1, Eu(
      e,
      Nt(t, e.current)
    ));
  }
  function Xo() {
    var e = Et.current;
    return e === null ? !0 : (ce & 4194048) === ce ? Ct === null : (ce & 62914560) === ce || (ce & 536870912) !== 0 ? e === Ct : !1;
  }
  function Qo() {
    var e = T.H;
    return T.H = on, e === null ? on : e;
  }
  function Zo() {
    var e = T.A;
    return T.A = c0, e;
  }
  function Cu() {
    Ue = 4, El || (ce & 4194048) !== ce && Et.current !== null || (Aa = !0), (bl & 134217727) === 0 && (Wl & 134217727) === 0 || Te === null || zl(
      Te,
      ce,
      St,
      !1
    );
  }
  function Wi(e, t, l) {
    var a = ye;
    ye |= 2;
    var n = Qo(), u = Zo();
    (Te !== e || ce !== t) && (Du = null, Da(e, t)), t = !1;
    var i = Ue;
    e: do
      try {
        if (Ee !== 0 && ae !== null) {
          var r = ae, o = pt;
          switch (Ee) {
            case 8:
              wi(), i = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              Et.current === null && (t = !0);
              var E = Ee;
              if (Ee = 0, pt = null, Oa(e, r, o, E), l && Aa) {
                i = 0;
                break e;
              }
              break;
            default:
              E = Ee, Ee = 0, pt = null, Oa(e, r, o, E);
          }
        }
        r0(), i = Ue;
        break;
      } catch (M) {
        jo(e, M);
      }
    while (!0);
    return t && e.shellSuspendCounter++, Kt = jl = null, ye = a, T.H = n, T.A = u, ae === null && (Te = null, ce = 0, Wn()), i;
  }
  function r0() {
    for (; ae !== null; ) Vo(ae);
  }
  function s0(e, t) {
    var l = ye;
    ye |= 2;
    var a = Qo(), n = Zo();
    Te !== e || ce !== t ? (Du = null, _u = mt() + 500, Da(e, t)) : Aa = Ya(
      e,
      t
    );
    e: do
      try {
        if (Ee !== 0 && ae !== null) {
          t = ae;
          var u = pt;
          t: switch (Ee) {
            case 1:
              Ee = 0, pt = null, Oa(e, t, u, 1);
              break;
            case 2:
            case 9:
              if (es(u)) {
                Ee = 0, pt = null, Ko(t);
                break;
              }
              t = function() {
                Ee !== 2 && Ee !== 9 || Te !== e || (Ee = 7), kt(e);
              }, u.then(t, t);
              break e;
            case 3:
              Ee = 7;
              break e;
            case 4:
              Ee = 5;
              break e;
            case 7:
              es(u) ? (Ee = 0, pt = null, Ko(t)) : (Ee = 0, pt = null, Oa(e, t, u, 7));
              break;
            case 5:
              var i = null;
              switch (ae.tag) {
                case 26:
                  i = ae.memoizedState;
                case 5:
                case 27:
                  var r = ae;
                  if (i ? qh(i) : r.stateNode.complete) {
                    Ee = 0, pt = null;
                    var o = r.sibling;
                    if (o !== null) ae = o;
                    else {
                      var E = r.return;
                      E !== null ? (ae = E, qu(E)) : ae = null;
                    }
                    break t;
                  }
              }
              Ee = 0, pt = null, Oa(e, t, u, 5);
              break;
            case 6:
              Ee = 0, pt = null, Oa(e, t, u, 6);
              break;
            case 8:
              wi(), Ue = 6;
              break e;
            default:
              throw Error(s(462));
          }
        }
        o0();
        break;
      } catch (M) {
        jo(e, M);
      }
    while (!0);
    return Kt = jl = null, T.H = a, T.A = n, ye = l, ae !== null ? 0 : (Te = null, ce = 0, Wn(), Ue);
  }
  function o0() {
    for (; ae !== null && !Bm(); )
      Vo(ae);
  }
  function Vo(e) {
    var t = yo(e.alternate, e, ll);
    e.memoizedProps = e.pendingProps, t === null ? qu(e) : ae = t;
  }
  function Ko(e) {
    var t = e, l = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = fo(
          l,
          t,
          t.pendingProps,
          t.type,
          void 0,
          ce
        );
        break;
      case 11:
        t = fo(
          l,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          ce
        );
        break;
      case 5:
        oi(t);
      default:
        go(l, t), t = ae = Qr(t, ll), t = yo(l, t, ll);
    }
    e.memoizedProps = e.pendingProps, t === null ? qu(e) : ae = t;
  }
  function Oa(e, t, l, a) {
    Kt = jl = null, oi(t), Ea = null, ln = 0;
    var n = t.return;
    try {
      if (Pd(
        e,
        n,
        t,
        l,
        ce
      )) {
        Ue = 1, Eu(
          e,
          Nt(l, e.current)
        ), ae = null;
        return;
      }
    } catch (u) {
      if (n !== null) throw ae = n, u;
      Ue = 1, Eu(
        e,
        Nt(l, e.current)
      ), ae = null;
      return;
    }
    t.flags & 32768 ? (fe || a === 1 ? e = !0 : Aa || (ce & 536870912) !== 0 ? e = !1 : (El = e = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = Et.current, a !== null && a.tag === 13 && (a.flags |= 16384))), Fo(t, e)) : qu(t);
  }
  function qu(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Fo(
          t,
          El
        );
        return;
      }
      e = t.return;
      var l = l0(
        t.alternate,
        t,
        ll
      );
      if (l !== null) {
        ae = l;
        return;
      }
      if (t = t.sibling, t !== null) {
        ae = t;
        return;
      }
      ae = t = e;
    } while (t !== null);
    Ue === 0 && (Ue = 5);
  }
  function Fo(e, t) {
    do {
      var l = a0(e.alternate, e);
      if (l !== null) {
        l.flags &= 32767, ae = l;
        return;
      }
      if (l = e.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !t && (e = e.sibling, e !== null)) {
        ae = e;
        return;
      }
      ae = e = l;
    } while (e !== null);
    Ue = 6, ae = null;
  }
  function Jo(e, t, l, a, n, u, i, r, o) {
    e.cancelPendingCommit = null;
    do
      Hu();
    while (Qe !== 0);
    if ((ye & 6) !== 0) throw Error(s(327));
    if (t !== null) {
      if (t === e.current) throw Error(s(177));
      if (u = t.lanes | t.childLanes, u |= Gc, Zm(
        e,
        l,
        u,
        i,
        r,
        o
      ), e === Te && (ae = Te = null, ce = 0), _a = t, Sl = e, al = l, Ki = u, Fi = n, Lo = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, y0(Bn, function() {
        return Po(), null;
      })) : (e.callbackNode = null, e.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = T.T, T.T = null, n = H.p, H.p = 2, i = ye, ye |= 4;
        try {
          n0(e, t, l);
        } finally {
          ye = i, H.p = n, T.T = a;
        }
      }
      Qe = 1, wo(), Wo(), $o();
    }
  }
  function wo() {
    if (Qe === 1) {
      Qe = 0;
      var e = Sl, t = _a, l = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || l) {
        l = T.T, T.T = null;
        var a = H.p;
        H.p = 2;
        var n = ye;
        ye |= 4;
        try {
          Oo(t, e);
          var u = rf, i = Br(e.containerInfo), r = u.focusedElem, o = u.selectionRange;
          if (i !== r && r && r.ownerDocument && Ur(
            r.ownerDocument.documentElement,
            r
          )) {
            if (o !== null && Uc(r)) {
              var E = o.start, M = o.end;
              if (M === void 0 && (M = E), "selectionStart" in r)
                r.selectionStart = E, r.selectionEnd = Math.min(
                  M,
                  r.value.length
                );
              else {
                var N = r.ownerDocument || document, b = N && N.defaultView || window;
                if (b.getSelection) {
                  var p = b.getSelection(), x = r.textContent.length, K = Math.min(o.start, x), Me = o.end === void 0 ? K : Math.min(o.end, x);
                  !p.extend && K > Me && (i = Me, Me = K, K = i);
                  var v = Hr(
                    r,
                    K
                  ), m = Hr(
                    r,
                    Me
                  );
                  if (v && m && (p.rangeCount !== 1 || p.anchorNode !== v.node || p.anchorOffset !== v.offset || p.focusNode !== m.node || p.focusOffset !== m.offset)) {
                    var g = N.createRange();
                    g.setStart(v.node, v.offset), p.removeAllRanges(), K > Me ? (p.addRange(g), p.extend(m.node, m.offset)) : (g.setEnd(m.node, m.offset), p.addRange(g));
                  }
                }
              }
            }
            for (N = [], p = r; p = p.parentNode; )
              p.nodeType === 1 && N.push({
                element: p,
                left: p.scrollLeft,
                top: p.scrollTop
              });
            for (typeof r.focus == "function" && r.focus(), r = 0; r < N.length; r++) {
              var A = N[r];
              A.element.scrollLeft = A.left, A.element.scrollTop = A.top;
            }
          }
          Zu = !!ff, rf = ff = null;
        } finally {
          ye = n, H.p = a, T.T = l;
        }
      }
      e.current = t, Qe = 2;
    }
  }
  function Wo() {
    if (Qe === 2) {
      Qe = 0;
      var e = Sl, t = _a, l = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || l) {
        l = T.T, T.T = null;
        var a = H.p;
        H.p = 2;
        var n = ye;
        ye |= 4;
        try {
          To(e, t.alternate, t);
        } finally {
          ye = n, H.p = a, T.T = l;
        }
      }
      Qe = 3;
    }
  }
  function $o() {
    if (Qe === 4 || Qe === 3) {
      Qe = 0, Rm();
      var e = Sl, t = _a, l = al, a = Lo;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? Qe = 5 : (Qe = 0, _a = Sl = null, Io(e, e.pendingLanes));
      var n = e.pendingLanes;
      if (n === 0 && (pl = null), dc(l), t = t.stateNode, dt && typeof dt.onCommitFiberRoot == "function")
        try {
          dt.onCommitFiberRoot(
            Ga,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        t = T.T, n = H.p, H.p = 2, T.T = null;
        try {
          for (var u = e.onRecoverableError, i = 0; i < a.length; i++) {
            var r = a[i];
            u(r.value, {
              componentStack: r.stack
            });
          }
        } finally {
          T.T = t, H.p = n;
        }
      }
      (al & 3) !== 0 && Hu(), kt(e), n = e.pendingLanes, (l & 261930) !== 0 && (n & 42) !== 0 ? e === Ji ? pn++ : (pn = 0, Ji = e) : pn = 0, Sn(0);
    }
  }
  function Io(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, en(t)));
  }
  function Hu() {
    return wo(), Wo(), $o(), Po();
  }
  function Po() {
    if (Qe !== 5) return !1;
    var e = Sl, t = Ki;
    Ki = 0;
    var l = dc(al), a = T.T, n = H.p;
    try {
      H.p = 32 > l ? 32 : l, T.T = null, l = Fi, Fi = null;
      var u = Sl, i = al;
      if (Qe = 0, _a = Sl = null, al = 0, (ye & 6) !== 0) throw Error(s(331));
      var r = ye;
      if (ye |= 4, Bo(u.current), qo(
        u,
        u.current,
        i,
        l
      ), ye = r, Sn(0, !1), dt && typeof dt.onPostCommitFiberRoot == "function")
        try {
          dt.onPostCommitFiberRoot(Ga, u);
        } catch {
        }
      return !0;
    } finally {
      H.p = n, T.T = a, Io(e, t);
    }
  }
  function eh(e, t, l) {
    t = Nt(l, t), t = Ni(e.stateNode, t, 2), e = dl(e, t, 2), e !== null && (ka(e, 2), kt(e));
  }
  function be(e, t, l) {
    if (e.tag === 3)
      eh(e, e, l);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          eh(
            t,
            e,
            l
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (pl === null || !pl.has(a))) {
            e = Nt(l, e), l = eo(2), a = dl(t, l, 2), a !== null && (to(
              l,
              a,
              t,
              e
            ), ka(a, 2), kt(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function $i(e, t, l) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new i0();
      var n = /* @__PURE__ */ new Set();
      a.set(t, n);
    } else
      n = a.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(t, n));
    n.has(l) || (Qi = !0, n.add(l), e = h0.bind(null, e, t, l), t.then(e, e));
  }
  function h0(e, t, l) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & l, e.warmLanes &= ~l, Te === e && (ce & l) === l && (Ue === 4 || Ue === 3 && (ce & 62914560) === ce && 300 > mt() - Nu ? (ye & 2) === 0 && Da(e, 0) : Zi |= l, Na === ce && (Na = 0)), kt(e);
  }
  function th(e, t) {
    t === 0 && (t = Jf()), e = Gl(e, t), e !== null && (ka(e, t), kt(e));
  }
  function m0(e) {
    var t = e.memoizedState, l = 0;
    t !== null && (l = t.retryLane), th(e, l);
  }
  function d0(e, t) {
    var l = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var a = e.stateNode, n = e.memoizedState;
        n !== null && (l = n.retryLane);
        break;
      case 19:
        a = e.stateNode;
        break;
      case 22:
        a = e.stateNode._retryCache;
        break;
      default:
        throw Error(s(314));
    }
    a !== null && a.delete(t), th(e, l);
  }
  function y0(e, t) {
    return sc(e, t);
  }
  var Uu = null, Ca = null, Ii = !1, Bu = !1, Pi = !1, Ml = 0;
  function kt(e) {
    e !== Ca && e.next === null && (Ca === null ? Uu = Ca = e : Ca = Ca.next = e), Bu = !0, Ii || (Ii = !0, g0());
  }
  function Sn(e, t) {
    if (!Pi && Bu) {
      Pi = !0;
      do
        for (var l = !1, a = Uu; a !== null; ) {
          if (e !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var u = 0;
            else {
              var i = a.suspendedLanes, r = a.pingedLanes;
              u = (1 << 31 - yt(42 | e) + 1) - 1, u &= n & ~(i & ~r), u = u & 201326741 ? u & 201326741 | 1 : u ? u | 2 : 0;
            }
            u !== 0 && (l = !0, uh(a, u));
          } else
            u = ce, u = Gn(
              a,
              a === Te ? u : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (u & 3) === 0 || Ya(a, u) || (l = !0, uh(a, u));
          a = a.next;
        }
      while (l);
      Pi = !1;
    }
  }
  function v0() {
    lh();
  }
  function lh() {
    Bu = Ii = !1;
    var e = 0;
    Ml !== 0 && _0() && (e = Ml);
    for (var t = mt(), l = null, a = Uu; a !== null; ) {
      var n = a.next, u = ah(a, t);
      u === 0 ? (a.next = null, l === null ? Uu = n : l.next = n, n === null && (Ca = l)) : (l = a, (e !== 0 || (u & 3) !== 0) && (Bu = !0)), a = n;
    }
    Qe !== 0 && Qe !== 5 || Sn(e), Ml !== 0 && (Ml = 0);
  }
  function ah(e, t) {
    for (var l = e.suspendedLanes, a = e.pingedLanes, n = e.expirationTimes, u = e.pendingLanes & -62914561; 0 < u; ) {
      var i = 31 - yt(u), r = 1 << i, o = n[i];
      o === -1 ? ((r & l) === 0 || (r & a) !== 0) && (n[i] = Qm(r, t)) : o <= t && (e.expiredLanes |= r), u &= ~r;
    }
    if (t = Te, l = ce, l = Gn(
      e,
      e === t ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a = e.callbackNode, l === 0 || e === t && (Ee === 2 || Ee === 9) || e.cancelPendingCommit !== null)
      return a !== null && a !== null && oc(a), e.callbackNode = null, e.callbackPriority = 0;
    if ((l & 3) === 0 || Ya(e, l)) {
      if (t = l & -l, t === e.callbackPriority) return t;
      switch (a !== null && oc(a), dc(l)) {
        case 2:
        case 8:
          l = Kf;
          break;
        case 32:
          l = Bn;
          break;
        case 268435456:
          l = Ff;
          break;
        default:
          l = Bn;
      }
      return a = nh.bind(null, e), l = sc(l, a), e.callbackPriority = t, e.callbackNode = l, t;
    }
    return a !== null && a !== null && oc(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function nh(e, t) {
    if (Qe !== 0 && Qe !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var l = e.callbackNode;
    if (Hu() && e.callbackNode !== l)
      return null;
    var a = ce;
    return a = Gn(
      e,
      e === Te ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a === 0 ? null : (Yo(e, a, t), ah(e, mt()), e.callbackNode != null && e.callbackNode === l ? nh.bind(null, e) : null);
  }
  function uh(e, t) {
    if (Hu()) return null;
    Yo(e, t, !0);
  }
  function g0() {
    O0(function() {
      (ye & 6) !== 0 ? sc(
        Vf,
        v0
      ) : lh();
    });
  }
  function ef() {
    if (Ml === 0) {
      var e = ya;
      e === 0 && (e = Rn, Rn <<= 1, (Rn & 261888) === 0 && (Rn = 256)), Ml = e;
    }
    return Ml;
  }
  function ch(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : Xn("" + e);
  }
  function ih(e, t) {
    var l = t.ownerDocument.createElement("input");
    return l.name = t.name, l.value = t.value, e.id && l.setAttribute("form", e.id), t.parentNode.insertBefore(l, t), e = new FormData(e), l.parentNode.removeChild(l), e;
  }
  function E0(e, t, l, a, n) {
    if (t === "submit" && l && l.stateNode === n) {
      var u = ch(
        (n[ut] || null).action
      ), i = a.submitter;
      i && (t = (t = i[ut] || null) ? ch(t.formAction) : i.getAttribute("formAction"), t !== null && (u = t, i = null));
      var r = new Kn(
        "action",
        "action",
        null,
        a,
        n
      );
      e.push({
        event: r,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Ml !== 0) {
                  var o = i ? ih(n, i) : new FormData(n);
                  pi(
                    l,
                    {
                      pending: !0,
                      data: o,
                      method: n.method,
                      action: u
                    },
                    null,
                    o
                  );
                }
              } else
                typeof u == "function" && (r.preventDefault(), o = i ? ih(n, i) : new FormData(n), pi(
                  l,
                  {
                    pending: !0,
                    data: o,
                    method: n.method,
                    action: u
                  },
                  u,
                  o
                ));
            },
            currentTarget: n
          }
        ]
      });
    }
  }
  for (var tf = 0; tf < Lc.length; tf++) {
    var lf = Lc[tf], b0 = lf.toLowerCase(), p0 = lf[0].toUpperCase() + lf.slice(1);
    Ut(
      b0,
      "on" + p0
    );
  }
  Ut(Lr, "onAnimationEnd"), Ut(Gr, "onAnimationIteration"), Ut(Yr, "onAnimationStart"), Ut("dblclick", "onDoubleClick"), Ut("focusin", "onFocus"), Ut("focusout", "onBlur"), Ut(xd, "onTransitionRun"), Ut(Ld, "onTransitionStart"), Ut(Gd, "onTransitionCancel"), Ut(kr, "onTransitionEnd"), ta("onMouseEnter", ["mouseout", "mouseover"]), ta("onMouseLeave", ["mouseout", "mouseover"]), ta("onPointerEnter", ["pointerout", "pointerover"]), ta("onPointerLeave", ["pointerout", "pointerover"]), Bl(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Bl(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Bl("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Bl(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Bl(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Bl(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var zn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), S0 = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(zn)
  );
  function fh(e, t) {
    t = (t & 4) !== 0;
    for (var l = 0; l < e.length; l++) {
      var a = e[l], n = a.event;
      a = a.listeners;
      e: {
        var u = void 0;
        if (t)
          for (var i = a.length - 1; 0 <= i; i--) {
            var r = a[i], o = r.instance, E = r.currentTarget;
            if (r = r.listener, o !== u && n.isPropagationStopped())
              break e;
            u = r, n.currentTarget = E;
            try {
              u(n);
            } catch (M) {
              wn(M);
            }
            n.currentTarget = null, u = o;
          }
        else
          for (i = 0; i < a.length; i++) {
            if (r = a[i], o = r.instance, E = r.currentTarget, r = r.listener, o !== u && n.isPropagationStopped())
              break e;
            u = r, n.currentTarget = E;
            try {
              u(n);
            } catch (M) {
              wn(M);
            }
            n.currentTarget = null, u = o;
          }
      }
    }
  }
  function ne(e, t) {
    var l = t[yc];
    l === void 0 && (l = t[yc] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    l.has(a) || (rh(t, e, 2, !1), l.add(a));
  }
  function af(e, t, l) {
    var a = 0;
    t && (a |= 4), rh(
      l,
      e,
      a,
      t
    );
  }
  var Ru = "_reactListening" + Math.random().toString(36).slice(2);
  function nf(e) {
    if (!e[Ru]) {
      e[Ru] = !0, tr.forEach(function(l) {
        l !== "selectionchange" && (S0.has(l) || af(l, !1, e), af(l, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Ru] || (t[Ru] = !0, af("selectionchange", !1, t));
    }
  }
  function rh(e, t, l, a) {
    switch (Gh(t)) {
      case 2:
        var n = w0;
        break;
      case 8:
        n = W0;
        break;
      default:
        n = pf;
    }
    l = n.bind(
      null,
      t,
      l,
      e
    ), n = void 0, !Tc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), a ? n !== void 0 ? e.addEventListener(t, l, {
      capture: !0,
      passive: n
    }) : e.addEventListener(t, l, !0) : n !== void 0 ? e.addEventListener(t, l, {
      passive: n
    }) : e.addEventListener(t, l, !1);
  }
  function uf(e, t, l, a, n) {
    var u = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      e: for (; ; ) {
        if (a === null) return;
        var i = a.tag;
        if (i === 3 || i === 4) {
          var r = a.stateNode.containerInfo;
          if (r === n) break;
          if (i === 4)
            for (i = a.return; i !== null; ) {
              var o = i.tag;
              if ((o === 3 || o === 4) && i.stateNode.containerInfo === n)
                return;
              i = i.return;
            }
          for (; r !== null; ) {
            if (i = Il(r), i === null) return;
            if (o = i.tag, o === 5 || o === 6 || o === 26 || o === 27) {
              a = u = i;
              continue e;
            }
            r = r.parentNode;
          }
        }
        a = a.return;
      }
    mr(function() {
      var E = u, M = zc(l), N = [];
      e: {
        var b = jr.get(e);
        if (b !== void 0) {
          var p = Kn, x = e;
          switch (e) {
            case "keypress":
              if (Zn(l) === 0) break e;
            case "keydown":
            case "keyup":
              p = dd;
              break;
            case "focusin":
              x = "focus", p = Dc;
              break;
            case "focusout":
              x = "blur", p = Dc;
              break;
            case "beforeblur":
            case "afterblur":
              p = Dc;
              break;
            case "click":
              if (l.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              p = vr;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              p = ld;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              p = gd;
              break;
            case Lr:
            case Gr:
            case Yr:
              p = ud;
              break;
            case kr:
              p = bd;
              break;
            case "scroll":
            case "scrollend":
              p = ed;
              break;
            case "wheel":
              p = Sd;
              break;
            case "copy":
            case "cut":
            case "paste":
              p = id;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              p = Er;
              break;
            case "toggle":
            case "beforetoggle":
              p = Md;
          }
          var K = (t & 4) !== 0, Me = !K && (e === "scroll" || e === "scrollend"), v = K ? b !== null ? b + "Capture" : null : b;
          K = [];
          for (var m = E, g; m !== null; ) {
            var A = m;
            if (g = A.stateNode, A = A.tag, A !== 5 && A !== 26 && A !== 27 || g === null || v === null || (A = Qa(m, v), A != null && K.push(
              Mn(m, A, g)
            )), Me) break;
            m = m.return;
          }
          0 < K.length && (b = new p(
            b,
            x,
            null,
            l,
            M
          ), N.push({ event: b, listeners: K }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (b = e === "mouseover" || e === "pointerover", p = e === "mouseout" || e === "pointerout", b && l !== Sc && (x = l.relatedTarget || l.fromElement) && (Il(x) || x[$l]))
            break e;
          if ((p || b) && (b = M.window === M ? M : (b = M.ownerDocument) ? b.defaultView || b.parentWindow : window, p ? (x = l.relatedTarget || l.toElement, p = E, x = x ? Il(x) : null, x !== null && (Me = D(x), K = x.tag, x !== Me || K !== 5 && K !== 27 && K !== 6) && (x = null)) : (p = null, x = E), p !== x)) {
            if (K = vr, A = "onMouseLeave", v = "onMouseEnter", m = "mouse", (e === "pointerout" || e === "pointerover") && (K = Er, A = "onPointerLeave", v = "onPointerEnter", m = "pointer"), Me = p == null ? b : Xa(p), g = x == null ? b : Xa(x), b = new K(
              A,
              m + "leave",
              p,
              l,
              M
            ), b.target = Me, b.relatedTarget = g, A = null, Il(M) === E && (K = new K(
              v,
              m + "enter",
              x,
              l,
              M
            ), K.target = g, K.relatedTarget = Me, A = K), Me = A, p && x)
              t: {
                for (K = z0, v = p, m = x, g = 0, A = v; A; A = K(A))
                  g++;
                A = 0;
                for (var Q = m; Q; Q = K(Q))
                  A++;
                for (; 0 < g - A; )
                  v = K(v), g--;
                for (; 0 < A - g; )
                  m = K(m), A--;
                for (; g--; ) {
                  if (v === m || m !== null && v === m.alternate) {
                    K = v;
                    break t;
                  }
                  v = K(v), m = K(m);
                }
                K = null;
              }
            else K = null;
            p !== null && sh(
              N,
              b,
              p,
              K,
              !1
            ), x !== null && Me !== null && sh(
              N,
              Me,
              x,
              K,
              !0
            );
          }
        }
        e: {
          if (b = E ? Xa(E) : window, p = b.nodeName && b.nodeName.toLowerCase(), p === "select" || p === "input" && b.type === "file")
            var he = Nr;
          else if (Tr(b))
            if (_r)
              he = Ud;
            else {
              he = qd;
              var j = Cd;
            }
          else
            p = b.nodeName, !p || p.toLowerCase() !== "input" || b.type !== "checkbox" && b.type !== "radio" ? E && pc(E.elementType) && (he = Nr) : he = Hd;
          if (he && (he = he(e, E))) {
            Ar(
              N,
              he,
              l,
              M
            );
            break e;
          }
          j && j(e, b, E), e === "focusout" && E && b.type === "number" && E.memoizedProps.value != null && bc(b, "number", b.value);
        }
        switch (j = E ? Xa(E) : window, e) {
          case "focusin":
            (Tr(j) || j.contentEditable === "true") && (ia = j, Bc = E, $a = null);
            break;
          case "focusout":
            $a = Bc = ia = null;
            break;
          case "mousedown":
            Rc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Rc = !1, Rr(N, l, M);
            break;
          case "selectionchange":
            if (Rd) break;
          case "keydown":
          case "keyup":
            Rr(N, l, M);
        }
        var le;
        if (Cc)
          e: {
            switch (e) {
              case "compositionstart":
                var ie = "onCompositionStart";
                break e;
              case "compositionend":
                ie = "onCompositionEnd";
                break e;
              case "compositionupdate":
                ie = "onCompositionUpdate";
                break e;
            }
            ie = void 0;
          }
        else
          ca ? zr(e, l) && (ie = "onCompositionEnd") : e === "keydown" && l.keyCode === 229 && (ie = "onCompositionStart");
        ie && (br && l.locale !== "ko" && (ca || ie !== "onCompositionStart" ? ie === "onCompositionEnd" && ca && (le = dr()) : (il = M, Ac = "value" in il ? il.value : il.textContent, ca = !0)), j = xu(E, ie), 0 < j.length && (ie = new gr(
          ie,
          e,
          null,
          l,
          M
        ), N.push({ event: ie, listeners: j }), le ? ie.data = le : (le = Mr(l), le !== null && (ie.data = le)))), (le = Ad ? Nd(e, l) : _d(e, l)) && (ie = xu(E, "onBeforeInput"), 0 < ie.length && (j = new gr(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          M
        ), N.push({
          event: j,
          listeners: ie
        }), j.data = le)), E0(
          N,
          e,
          E,
          l,
          M
        );
      }
      fh(N, t);
    });
  }
  function Mn(e, t, l) {
    return {
      instance: e,
      listener: t,
      currentTarget: l
    };
  }
  function xu(e, t) {
    for (var l = t + "Capture", a = []; e !== null; ) {
      var n = e, u = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || u === null || (n = Qa(e, l), n != null && a.unshift(
        Mn(e, n, u)
      ), n = Qa(e, t), n != null && a.push(
        Mn(e, n, u)
      )), e.tag === 3) return a;
      e = e.return;
    }
    return [];
  }
  function z0(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function sh(e, t, l, a, n) {
    for (var u = t._reactName, i = []; l !== null && l !== a; ) {
      var r = l, o = r.alternate, E = r.stateNode;
      if (r = r.tag, o !== null && o === a) break;
      r !== 5 && r !== 26 && r !== 27 || E === null || (o = E, n ? (E = Qa(l, u), E != null && i.unshift(
        Mn(l, E, o)
      )) : n || (E = Qa(l, u), E != null && i.push(
        Mn(l, E, o)
      ))), l = l.return;
    }
    i.length !== 0 && e.push({ event: t, listeners: i });
  }
  var M0 = /\r\n?/g, T0 = /\u0000|\uFFFD/g;
  function oh(e) {
    return (typeof e == "string" ? e : "" + e).replace(M0, `
`).replace(T0, "");
  }
  function hh(e, t) {
    return t = oh(t), oh(e) === t;
  }
  function ze(e, t, l, a, n, u) {
    switch (l) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || aa(e, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && aa(e, "" + a);
        break;
      case "className":
        kn(e, "class", a);
        break;
      case "tabIndex":
        kn(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        kn(e, l, a);
        break;
      case "style":
        or(e, a, u);
        break;
      case "data":
        if (t !== "object") {
          kn(e, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (t !== "a" || l !== "href")) {
          e.removeAttribute(l);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = Xn("" + a), e.setAttribute(l, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          e.setAttribute(
            l,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof u == "function" && (l === "formAction" ? (t !== "input" && ze(e, t, "name", n.name, n, null), ze(
            e,
            t,
            "formEncType",
            n.formEncType,
            n,
            null
          ), ze(
            e,
            t,
            "formMethod",
            n.formMethod,
            n,
            null
          ), ze(
            e,
            t,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (ze(e, t, "encType", n.encType, n, null), ze(e, t, "method", n.method, n, null), ze(e, t, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = Xn("" + a), e.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (e.onclick = Xt);
        break;
      case "onScroll":
        a != null && ne("scroll", e);
        break;
      case "onScrollEnd":
        a != null && ne("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(s(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(s(60));
            e.innerHTML = l;
          }
        }
        break;
      case "multiple":
        e.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        e.muted = a && typeof a != "function" && typeof a != "symbol";
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
        if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        l = Xn("" + a), e.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          l
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
        a != null && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, "" + a) : e.removeAttribute(l);
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
        a && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, "") : e.removeAttribute(l);
        break;
      case "capture":
      case "download":
        a === !0 ? e.setAttribute(l, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, a) : e.removeAttribute(l);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? e.setAttribute(l, a) : e.removeAttribute(l);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? e.removeAttribute(l) : e.setAttribute(l, a);
        break;
      case "popover":
        ne("beforetoggle", e), ne("toggle", e), Yn(e, "popover", a);
        break;
      case "xlinkActuate":
        jt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        jt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        jt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        jt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        jt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        jt(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        jt(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        jt(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        jt(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        Yn(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N") && (l = Im.get(l) || l, Yn(e, l, a));
    }
  }
  function cf(e, t, l, a, n, u) {
    switch (l) {
      case "style":
        or(e, a, u);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(s(61));
          if (l = a.__html, l != null) {
            if (n.children != null) throw Error(s(60));
            e.innerHTML = l;
          }
        }
        break;
      case "children":
        typeof a == "string" ? aa(e, a) : (typeof a == "number" || typeof a == "bigint") && aa(e, "" + a);
        break;
      case "onScroll":
        a != null && ne("scroll", e);
        break;
      case "onScrollEnd":
        a != null && ne("scrollend", e);
        break;
      case "onClick":
        a != null && (e.onclick = Xt);
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
        if (!lr.hasOwnProperty(l))
          e: {
            if (l[0] === "o" && l[1] === "n" && (n = l.endsWith("Capture"), t = l.slice(2, n ? l.length - 7 : void 0), u = e[ut] || null, u = u != null ? u[l] : null, typeof u == "function" && e.removeEventListener(t, u, n), typeof a == "function")) {
              typeof u != "function" && u !== null && (l in e ? e[l] = null : e.hasAttribute(l) && e.removeAttribute(l)), e.addEventListener(t, a, n);
              break e;
            }
            l in e ? e[l] = a : a === !0 ? e.setAttribute(l, "") : Yn(e, l, a);
          }
    }
  }
  function et(e, t, l) {
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
        ne("error", e), ne("load", e);
        var a = !1, n = !1, u;
        for (u in l)
          if (l.hasOwnProperty(u)) {
            var i = l[u];
            if (i != null)
              switch (u) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  n = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(s(137, t));
                default:
                  ze(e, t, u, i, l, null);
              }
          }
        n && ze(e, t, "srcSet", l.srcSet, l, null), a && ze(e, t, "src", l.src, l, null);
        return;
      case "input":
        ne("invalid", e);
        var r = u = i = n = null, o = null, E = null;
        for (a in l)
          if (l.hasOwnProperty(a)) {
            var M = l[a];
            if (M != null)
              switch (a) {
                case "name":
                  n = M;
                  break;
                case "type":
                  i = M;
                  break;
                case "checked":
                  o = M;
                  break;
                case "defaultChecked":
                  E = M;
                  break;
                case "value":
                  u = M;
                  break;
                case "defaultValue":
                  r = M;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (M != null)
                    throw Error(s(137, t));
                  break;
                default:
                  ze(e, t, a, M, l, null);
              }
          }
        ir(
          e,
          u,
          r,
          o,
          E,
          i,
          n,
          !1
        );
        return;
      case "select":
        ne("invalid", e), a = i = u = null;
        for (n in l)
          if (l.hasOwnProperty(n) && (r = l[n], r != null))
            switch (n) {
              case "value":
                u = r;
                break;
              case "defaultValue":
                i = r;
                break;
              case "multiple":
                a = r;
              default:
                ze(e, t, n, r, l, null);
            }
        t = u, l = i, e.multiple = !!a, t != null ? la(e, !!a, t, !1) : l != null && la(e, !!a, l, !0);
        return;
      case "textarea":
        ne("invalid", e), u = n = a = null;
        for (i in l)
          if (l.hasOwnProperty(i) && (r = l[i], r != null))
            switch (i) {
              case "value":
                a = r;
                break;
              case "defaultValue":
                n = r;
                break;
              case "children":
                u = r;
                break;
              case "dangerouslySetInnerHTML":
                if (r != null) throw Error(s(91));
                break;
              default:
                ze(e, t, i, r, l, null);
            }
        rr(e, a, n, u);
        return;
      case "option":
        for (o in l)
          if (l.hasOwnProperty(o) && (a = l[o], a != null))
            switch (o) {
              case "selected":
                e.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                ze(e, t, o, a, l, null);
            }
        return;
      case "dialog":
        ne("beforetoggle", e), ne("toggle", e), ne("cancel", e), ne("close", e);
        break;
      case "iframe":
      case "object":
        ne("load", e);
        break;
      case "video":
      case "audio":
        for (a = 0; a < zn.length; a++)
          ne(zn[a], e);
        break;
      case "image":
        ne("error", e), ne("load", e);
        break;
      case "details":
        ne("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        ne("error", e), ne("load", e);
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
        for (E in l)
          if (l.hasOwnProperty(E) && (a = l[E], a != null))
            switch (E) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(s(137, t));
              default:
                ze(e, t, E, a, l, null);
            }
        return;
      default:
        if (pc(t)) {
          for (M in l)
            l.hasOwnProperty(M) && (a = l[M], a !== void 0 && cf(
              e,
              t,
              M,
              a,
              l,
              void 0
            ));
          return;
        }
    }
    for (r in l)
      l.hasOwnProperty(r) && (a = l[r], a != null && ze(e, t, r, a, l, null));
  }
  function A0(e, t, l, a) {
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
        var n = null, u = null, i = null, r = null, o = null, E = null, M = null;
        for (p in l) {
          var N = l[p];
          if (l.hasOwnProperty(p) && N != null)
            switch (p) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                o = N;
              default:
                a.hasOwnProperty(p) || ze(e, t, p, null, a, N);
            }
        }
        for (var b in a) {
          var p = a[b];
          if (N = l[b], a.hasOwnProperty(b) && (p != null || N != null))
            switch (b) {
              case "type":
                u = p;
                break;
              case "name":
                n = p;
                break;
              case "checked":
                E = p;
                break;
              case "defaultChecked":
                M = p;
                break;
              case "value":
                i = p;
                break;
              case "defaultValue":
                r = p;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (p != null)
                  throw Error(s(137, t));
                break;
              default:
                p !== N && ze(
                  e,
                  t,
                  b,
                  p,
                  a,
                  N
                );
            }
        }
        Ec(
          e,
          i,
          r,
          o,
          E,
          M,
          u,
          n
        );
        return;
      case "select":
        p = i = r = b = null;
        for (u in l)
          if (o = l[u], l.hasOwnProperty(u) && o != null)
            switch (u) {
              case "value":
                break;
              case "multiple":
                p = o;
              default:
                a.hasOwnProperty(u) || ze(
                  e,
                  t,
                  u,
                  null,
                  a,
                  o
                );
            }
        for (n in a)
          if (u = a[n], o = l[n], a.hasOwnProperty(n) && (u != null || o != null))
            switch (n) {
              case "value":
                b = u;
                break;
              case "defaultValue":
                r = u;
                break;
              case "multiple":
                i = u;
              default:
                u !== o && ze(
                  e,
                  t,
                  n,
                  u,
                  a,
                  o
                );
            }
        t = r, l = i, a = p, b != null ? la(e, !!l, b, !1) : !!a != !!l && (t != null ? la(e, !!l, t, !0) : la(e, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        p = b = null;
        for (r in l)
          if (n = l[r], l.hasOwnProperty(r) && n != null && !a.hasOwnProperty(r))
            switch (r) {
              case "value":
                break;
              case "children":
                break;
              default:
                ze(e, t, r, null, a, n);
            }
        for (i in a)
          if (n = a[i], u = l[i], a.hasOwnProperty(i) && (n != null || u != null))
            switch (i) {
              case "value":
                b = n;
                break;
              case "defaultValue":
                p = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(s(91));
                break;
              default:
                n !== u && ze(e, t, i, n, a, u);
            }
        fr(e, b, p);
        return;
      case "option":
        for (var x in l)
          if (b = l[x], l.hasOwnProperty(x) && b != null && !a.hasOwnProperty(x))
            switch (x) {
              case "selected":
                e.selected = !1;
                break;
              default:
                ze(
                  e,
                  t,
                  x,
                  null,
                  a,
                  b
                );
            }
        for (o in a)
          if (b = a[o], p = l[o], a.hasOwnProperty(o) && b !== p && (b != null || p != null))
            switch (o) {
              case "selected":
                e.selected = b && typeof b != "function" && typeof b != "symbol";
                break;
              default:
                ze(
                  e,
                  t,
                  o,
                  b,
                  a,
                  p
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
        for (var K in l)
          b = l[K], l.hasOwnProperty(K) && b != null && !a.hasOwnProperty(K) && ze(e, t, K, null, a, b);
        for (E in a)
          if (b = a[E], p = l[E], a.hasOwnProperty(E) && b !== p && (b != null || p != null))
            switch (E) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (b != null)
                  throw Error(s(137, t));
                break;
              default:
                ze(
                  e,
                  t,
                  E,
                  b,
                  a,
                  p
                );
            }
        return;
      default:
        if (pc(t)) {
          for (var Me in l)
            b = l[Me], l.hasOwnProperty(Me) && b !== void 0 && !a.hasOwnProperty(Me) && cf(
              e,
              t,
              Me,
              void 0,
              a,
              b
            );
          for (M in a)
            b = a[M], p = l[M], !a.hasOwnProperty(M) || b === p || b === void 0 && p === void 0 || cf(
              e,
              t,
              M,
              b,
              a,
              p
            );
          return;
        }
    }
    for (var v in l)
      b = l[v], l.hasOwnProperty(v) && b != null && !a.hasOwnProperty(v) && ze(e, t, v, null, a, b);
    for (N in a)
      b = a[N], p = l[N], !a.hasOwnProperty(N) || b === p || b == null && p == null || ze(e, t, N, b, a, p);
  }
  function mh(e) {
    switch (e) {
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
  function N0() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, l = performance.getEntriesByType("resource"), a = 0; a < l.length; a++) {
        var n = l[a], u = n.transferSize, i = n.initiatorType, r = n.duration;
        if (u && r && mh(i)) {
          for (i = 0, r = n.responseEnd, a += 1; a < l.length; a++) {
            var o = l[a], E = o.startTime;
            if (E > r) break;
            var M = o.transferSize, N = o.initiatorType;
            M && mh(N) && (o = o.responseEnd, i += M * (o < r ? 1 : (r - E) / (o - E)));
          }
          if (--a, t += 8 * (u + i) / (n.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var ff = null, rf = null;
  function Lu(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function dh(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function yh(e, t) {
    if (e === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return e === 1 && t === "foreignObject" ? 0 : e;
  }
  function sf(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var of = null;
  function _0() {
    var e = window.event;
    return e && e.type === "popstate" ? e === of ? !1 : (of = e, !0) : (of = null, !1);
  }
  var vh = typeof setTimeout == "function" ? setTimeout : void 0, D0 = typeof clearTimeout == "function" ? clearTimeout : void 0, gh = typeof Promise == "function" ? Promise : void 0, O0 = typeof queueMicrotask == "function" ? queueMicrotask : typeof gh < "u" ? function(e) {
    return gh.resolve(null).then(e).catch(C0);
  } : vh;
  function C0(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Tl(e) {
    return e === "head";
  }
  function Eh(e, t) {
    var l = t, a = 0;
    do {
      var n = l.nextSibling;
      if (e.removeChild(l), n && n.nodeType === 8)
        if (l = n.data, l === "/$" || l === "/&") {
          if (a === 0) {
            e.removeChild(n), Ba(t);
            return;
          }
          a--;
        } else if (l === "$" || l === "$?" || l === "$~" || l === "$!" || l === "&")
          a++;
        else if (l === "html")
          Tn(e.ownerDocument.documentElement);
        else if (l === "head") {
          l = e.ownerDocument.head, Tn(l);
          for (var u = l.firstChild; u; ) {
            var i = u.nextSibling, r = u.nodeName;
            u[ja] || r === "SCRIPT" || r === "STYLE" || r === "LINK" && u.rel.toLowerCase() === "stylesheet" || l.removeChild(u), u = i;
          }
        } else
          l === "body" && Tn(e.ownerDocument.body);
      l = n;
    } while (l);
    Ba(t);
  }
  function bh(e, t) {
    var l = e;
    e = 0;
    do {
      var a = l.nextSibling;
      if (l.nodeType === 1 ? t ? (l._stashedDisplay = l.style.display, l.style.display = "none") : (l.style.display = l._stashedDisplay || "", l.getAttribute("style") === "" && l.removeAttribute("style")) : l.nodeType === 3 && (t ? (l._stashedText = l.nodeValue, l.nodeValue = "") : l.nodeValue = l._stashedText || ""), a && a.nodeType === 8)
        if (l = a.data, l === "/$") {
          if (e === 0) break;
          e--;
        } else
          l !== "$" && l !== "$?" && l !== "$~" && l !== "$!" || e++;
      l = a;
    } while (l);
  }
  function hf(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var l = t;
      switch (t = t.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          hf(l), vc(l);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (l.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(l);
    }
  }
  function q0(e, t, l, a) {
    for (; e.nodeType === 1; ) {
      var n = l;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (a) {
        if (!e[ja])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (u = e.getAttribute("rel"), u === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (u !== n.rel || e.getAttribute("href") !== (n.href == null || n.href === "" ? null : n.href) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin) || e.getAttribute("title") !== (n.title == null ? null : n.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (u = e.getAttribute("src"), (u !== (n.src == null ? null : n.src) || e.getAttribute("type") !== (n.type == null ? null : n.type) || e.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin)) && u && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var u = n.name == null ? null : "" + n.name;
        if (n.type === "hidden" && e.getAttribute("name") === u)
          return e;
      } else return e;
      if (e = qt(e.nextSibling), e === null) break;
    }
    return null;
  }
  function H0(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l || (e = qt(e.nextSibling), e === null)) return null;
    return e;
  }
  function ph(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = qt(e.nextSibling), e === null)) return null;
    return e;
  }
  function mf(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function df(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function U0(e, t) {
    var l = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;
    else if (e.data !== "$?" || l.readyState !== "loading")
      t();
    else {
      var a = function() {
        t(), l.removeEventListener("DOMContentLoaded", a);
      };
      l.addEventListener("DOMContentLoaded", a), e._reactRetry = a;
    }
  }
  function qt(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F")
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return e;
  }
  var yf = null;
  function Sh(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var l = e.data;
        if (l === "/$" || l === "/&") {
          if (t === 0)
            return qt(e.nextSibling);
          t--;
        } else
          l !== "$" && l !== "$!" && l !== "$?" && l !== "$~" && l !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function zh(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var l = e.data;
        if (l === "$" || l === "$!" || l === "$?" || l === "$~" || l === "&") {
          if (t === 0) return e;
          t--;
        } else l !== "/$" && l !== "/&" || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function Mh(e, t, l) {
    switch (t = Lu(l), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(s(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(s(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(s(454));
        return e;
      default:
        throw Error(s(451));
    }
  }
  function Tn(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    vc(e);
  }
  var Ht = /* @__PURE__ */ new Map(), Th = /* @__PURE__ */ new Set();
  function Gu(e) {
    return typeof e.getRootNode == "function" ? e.getRootNode() : e.nodeType === 9 ? e : e.ownerDocument;
  }
  var nl = H.d;
  H.d = {
    f: B0,
    r: R0,
    D: x0,
    C: L0,
    L: G0,
    m: Y0,
    X: j0,
    S: k0,
    M: X0
  };
  function B0() {
    var e = nl.f(), t = Ou();
    return e || t;
  }
  function R0(e) {
    var t = Pl(e);
    t !== null && t.tag === 5 && t.type === "form" ? ks(t) : nl.r(e);
  }
  var qa = typeof document > "u" ? null : document;
  function Ah(e, t, l) {
    var a = qa;
    if (a && typeof t == "string" && t) {
      var n = Tt(t);
      n = 'link[rel="' + e + '"][href="' + n + '"]', typeof l == "string" && (n += '[crossorigin="' + l + '"]'), Th.has(n) || (Th.add(n), e = { rel: e, crossOrigin: l, href: t }, a.querySelector(n) === null && (t = a.createElement("link"), et(t, "link", e), Ve(t), a.head.appendChild(t)));
    }
  }
  function x0(e) {
    nl.D(e), Ah("dns-prefetch", e, null);
  }
  function L0(e, t) {
    nl.C(e, t), Ah("preconnect", e, t);
  }
  function G0(e, t, l) {
    nl.L(e, t, l);
    var a = qa;
    if (a && e && t) {
      var n = 'link[rel="preload"][as="' + Tt(t) + '"]';
      t === "image" && l && l.imageSrcSet ? (n += '[imagesrcset="' + Tt(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (n += '[imagesizes="' + Tt(
        l.imageSizes
      ) + '"]')) : n += '[href="' + Tt(e) + '"]';
      var u = n;
      switch (t) {
        case "style":
          u = Ha(e);
          break;
        case "script":
          u = Ua(e);
      }
      Ht.has(u) || (e = B(
        {
          rel: "preload",
          href: t === "image" && l && l.imageSrcSet ? void 0 : e,
          as: t
        },
        l
      ), Ht.set(u, e), a.querySelector(n) !== null || t === "style" && a.querySelector(An(u)) || t === "script" && a.querySelector(Nn(u)) || (t = a.createElement("link"), et(t, "link", e), Ve(t), a.head.appendChild(t)));
    }
  }
  function Y0(e, t) {
    nl.m(e, t);
    var l = qa;
    if (l && e) {
      var a = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + Tt(a) + '"][href="' + Tt(e) + '"]', u = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = Ua(e);
      }
      if (!Ht.has(u) && (e = B({ rel: "modulepreload", href: e }, t), Ht.set(u, e), l.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(Nn(u)))
              return;
        }
        a = l.createElement("link"), et(a, "link", e), Ve(a), l.head.appendChild(a);
      }
    }
  }
  function k0(e, t, l) {
    nl.S(e, t, l);
    var a = qa;
    if (a && e) {
      var n = ea(a).hoistableStyles, u = Ha(e);
      t = t || "default";
      var i = n.get(u);
      if (!i) {
        var r = { loading: 0, preload: null };
        if (i = a.querySelector(
          An(u)
        ))
          r.loading = 5;
        else {
          e = B(
            { rel: "stylesheet", href: e, "data-precedence": t },
            l
          ), (l = Ht.get(u)) && vf(e, l);
          var o = i = a.createElement("link");
          Ve(o), et(o, "link", e), o._p = new Promise(function(E, M) {
            o.onload = E, o.onerror = M;
          }), o.addEventListener("load", function() {
            r.loading |= 1;
          }), o.addEventListener("error", function() {
            r.loading |= 2;
          }), r.loading |= 4, Yu(i, t, a);
        }
        i = {
          type: "stylesheet",
          instance: i,
          count: 1,
          state: r
        }, n.set(u, i);
      }
    }
  }
  function j0(e, t) {
    nl.X(e, t);
    var l = qa;
    if (l && e) {
      var a = ea(l).hoistableScripts, n = Ua(e), u = a.get(n);
      u || (u = l.querySelector(Nn(n)), u || (e = B({ src: e, async: !0 }, t), (t = Ht.get(n)) && gf(e, t), u = l.createElement("script"), Ve(u), et(u, "link", e), l.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, a.set(n, u));
    }
  }
  function X0(e, t) {
    nl.M(e, t);
    var l = qa;
    if (l && e) {
      var a = ea(l).hoistableScripts, n = Ua(e), u = a.get(n);
      u || (u = l.querySelector(Nn(n)), u || (e = B({ src: e, async: !0, type: "module" }, t), (t = Ht.get(n)) && gf(e, t), u = l.createElement("script"), Ve(u), et(u, "link", e), l.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, a.set(n, u));
    }
  }
  function Nh(e, t, l, a) {
    var n = (n = P.current) ? Gu(n) : null;
    if (!n) throw Error(s(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (t = Ha(l.href), l = ea(
          n
        ).hoistableStyles, a = l.get(t), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          e = Ha(l.href);
          var u = ea(
            n
          ).hoistableStyles, i = u.get(e);
          if (i || (n = n.ownerDocument || n, i = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, u.set(e, i), (u = n.querySelector(
            An(e)
          )) && !u._p && (i.instance = u, i.state.loading = 5), Ht.has(e) || (l = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, Ht.set(e, l), u || Q0(
            n,
            e,
            l,
            i.state
          ))), t && a === null)
            throw Error(s(528, ""));
          return i;
        }
        if (t && a !== null)
          throw Error(s(529, ""));
        return null;
      case "script":
        return t = l.async, l = l.src, typeof l == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = Ua(l), l = ea(
          n
        ).hoistableScripts, a = l.get(t), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, l.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(s(444, e));
    }
  }
  function Ha(e) {
    return 'href="' + Tt(e) + '"';
  }
  function An(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function _h(e) {
    return B({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function Q0(e, t, l, a) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = e.createElement("link"), a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    }), et(t, "link", l), Ve(t), e.head.appendChild(t));
  }
  function Ua(e) {
    return '[src="' + Tt(e) + '"]';
  }
  function Nn(e) {
    return "script[async]" + e;
  }
  function Dh(e, t, l) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = e.querySelector(
            'style[data-href~="' + Tt(l.href) + '"]'
          );
          if (a)
            return t.instance = a, Ve(a), a;
          var n = B({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (e.ownerDocument || e).createElement(
            "style"
          ), Ve(a), et(a, "style", n), Yu(a, l.precedence, e), t.instance = a;
        case "stylesheet":
          n = Ha(l.href);
          var u = e.querySelector(
            An(n)
          );
          if (u)
            return t.state.loading |= 4, t.instance = u, Ve(u), u;
          a = _h(l), (n = Ht.get(n)) && vf(a, n), u = (e.ownerDocument || e).createElement("link"), Ve(u);
          var i = u;
          return i._p = new Promise(function(r, o) {
            i.onload = r, i.onerror = o;
          }), et(u, "link", a), t.state.loading |= 4, Yu(u, l.precedence, e), t.instance = u;
        case "script":
          return u = Ua(l.src), (n = e.querySelector(
            Nn(u)
          )) ? (t.instance = n, Ve(n), n) : (a = l, (n = Ht.get(u)) && (a = B({}, l), gf(a, n)), e = e.ownerDocument || e, n = e.createElement("script"), Ve(n), et(n, "link", a), e.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(s(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, Yu(a, l.precedence, e));
    return t.instance;
  }
  function Yu(e, t, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, u = n, i = 0; i < a.length; i++) {
      var r = a[i];
      if (r.dataset.precedence === t) u = r;
      else if (u !== n) break;
    }
    u ? u.parentNode.insertBefore(e, u.nextSibling) : (t = l.nodeType === 9 ? l.head : l, t.insertBefore(e, t.firstChild));
  }
  function vf(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function gf(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var ku = null;
  function Oh(e, t, l) {
    if (ku === null) {
      var a = /* @__PURE__ */ new Map(), n = ku = /* @__PURE__ */ new Map();
      n.set(l, a);
    } else
      n = ku, a = n.get(l), a || (a = /* @__PURE__ */ new Map(), n.set(l, a));
    if (a.has(e)) return a;
    for (a.set(e, null), l = l.getElementsByTagName(e), n = 0; n < l.length; n++) {
      var u = l[n];
      if (!(u[ja] || u[We] || e === "link" && u.getAttribute("rel") === "stylesheet") && u.namespaceURI !== "http://www.w3.org/2000/svg") {
        var i = u.getAttribute(t) || "";
        i = e + i;
        var r = a.get(i);
        r ? r.push(u) : a.set(i, [u]);
      }
    }
    return a;
  }
  function Ch(e, t, l) {
    e = e.ownerDocument || e, e.head.insertBefore(
      l,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function Z0(e, t, l) {
    if (l === 1 || t.itemProp != null) return !1;
    switch (e) {
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
            return e = t.disabled, typeof t.precedence == "string" && e == null;
          default:
            return !0;
        }
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
          return !0;
    }
    return !1;
  }
  function qh(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function V0(e, t, l, a) {
    if (l.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (l.state.loading & 4) === 0) {
      if (l.instance === null) {
        var n = Ha(a.href), u = t.querySelector(
          An(n)
        );
        if (u) {
          t = u._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = ju.bind(e), t.then(e, e)), l.state.loading |= 4, l.instance = u, Ve(u);
          return;
        }
        u = t.ownerDocument || t, a = _h(a), (n = Ht.get(n)) && vf(a, n), u = u.createElement("link"), Ve(u);
        var i = u;
        i._p = new Promise(function(r, o) {
          i.onload = r, i.onerror = o;
        }), et(u, "link", a), l.instance = u;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(l, t), (t = l.state.preload) && (l.state.loading & 3) === 0 && (e.count++, l = ju.bind(e), t.addEventListener("load", l), t.addEventListener("error", l));
    }
  }
  var Ef = 0;
  function K0(e, t) {
    return e.stylesheets && e.count === 0 && Qu(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(l) {
      var a = setTimeout(function() {
        if (e.stylesheets && Qu(e, e.stylesheets), e.unsuspend) {
          var u = e.unsuspend;
          e.unsuspend = null, u();
        }
      }, 6e4 + t);
      0 < e.imgBytes && Ef === 0 && (Ef = 62500 * N0());
      var n = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && Qu(e, e.stylesheets), e.unsuspend)) {
            var u = e.unsuspend;
            e.unsuspend = null, u();
          }
        },
        (e.imgBytes > Ef ? 50 : 800) + t
      );
      return e.unsuspend = l, function() {
        e.unsuspend = null, clearTimeout(a), clearTimeout(n);
      };
    } : null;
  }
  function ju() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) Qu(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        this.unsuspend = null, e();
      }
    }
  }
  var Xu = null;
  function Qu(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Xu = /* @__PURE__ */ new Map(), t.forEach(F0, e), Xu = null, ju.call(e));
  }
  function F0(e, t) {
    if (!(t.state.loading & 4)) {
      var l = Xu.get(e);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), Xu.set(e, l);
        for (var n = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), u = 0; u < n.length; u++) {
          var i = n[u];
          (i.nodeName === "LINK" || i.getAttribute("media") !== "not all") && (l.set(i.dataset.precedence, i), a = i);
        }
        a && l.set(null, a);
      }
      n = t.instance, i = n.getAttribute("data-precedence"), u = l.get(i) || a, u === a && l.set(null, n), l.set(i, n), this.count++, a = ju.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), u ? u.parentNode.insertBefore(n, u.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(n, e.firstChild)), t.state.loading |= 4;
    }
  }
  var _n = {
    $$typeof: De,
    Provider: null,
    Consumer: null,
    _currentValue: J,
    _currentValue2: J,
    _threadCount: 0
  };
  function J0(e, t, l, a, n, u, i, r, o) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = hc(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = hc(0), this.hiddenUpdates = hc(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = u, this.onRecoverableError = i, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = o, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Hh(e, t, l, a, n, u, i, r, o, E, M, N) {
    return e = new J0(
      e,
      t,
      l,
      i,
      o,
      E,
      M,
      N,
      r
    ), t = 1, u === !0 && (t |= 24), u = gt(3, null, null, t), e.current = u, u.stateNode = e, t = Wc(), t.refCount++, e.pooledCache = t, t.refCount++, u.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: t
    }, ei(u), e;
  }
  function Uh(e) {
    return e ? (e = sa, e) : sa;
  }
  function Bh(e, t, l, a, n, u) {
    n = Uh(n), a.context === null ? a.context = n : a.pendingContext = n, a = ml(t), a.payload = { element: l }, u = u === void 0 ? null : u, u !== null && (a.callback = u), l = dl(e, a, t), l !== null && (ot(l, e, t), nn(l, e, t));
  }
  function Rh(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function bf(e, t) {
    Rh(e, t), (e = e.alternate) && Rh(e, t);
  }
  function xh(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Gl(e, 67108864);
      t !== null && ot(t, e, 67108864), bf(e, 67108864);
    }
  }
  function Lh(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = zt();
      t = mc(t);
      var l = Gl(e, t);
      l !== null && ot(l, e, t), bf(e, t);
    }
  }
  var Zu = !0;
  function w0(e, t, l, a) {
    var n = T.T;
    T.T = null;
    var u = H.p;
    try {
      H.p = 2, pf(e, t, l, a);
    } finally {
      H.p = u, T.T = n;
    }
  }
  function W0(e, t, l, a) {
    var n = T.T;
    T.T = null;
    var u = H.p;
    try {
      H.p = 8, pf(e, t, l, a);
    } finally {
      H.p = u, T.T = n;
    }
  }
  function pf(e, t, l, a) {
    if (Zu) {
      var n = Sf(a);
      if (n === null)
        uf(
          e,
          t,
          a,
          Vu,
          l
        ), Yh(e, a);
      else if (I0(
        n,
        e,
        t,
        l,
        a
      ))
        a.stopPropagation();
      else if (Yh(e, a), t & 4 && -1 < $0.indexOf(e)) {
        for (; n !== null; ) {
          var u = Pl(n);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (u = u.stateNode, u.current.memoizedState.isDehydrated) {
                  var i = Ul(u.pendingLanes);
                  if (i !== 0) {
                    var r = u;
                    for (r.pendingLanes |= 2, r.entangledLanes |= 2; i; ) {
                      var o = 1 << 31 - yt(i);
                      r.entanglements[1] |= o, i &= ~o;
                    }
                    kt(u), (ye & 6) === 0 && (_u = mt() + 500, Sn(0));
                  }
                }
                break;
              case 31:
              case 13:
                r = Gl(u, 2), r !== null && ot(r, u, 2), Ou(), bf(u, 2);
            }
          if (u = Sf(a), u === null && uf(
            e,
            t,
            a,
            Vu,
            l
          ), u === n) break;
          n = u;
        }
        n !== null && a.stopPropagation();
      } else
        uf(
          e,
          t,
          a,
          null,
          l
        );
    }
  }
  function Sf(e) {
    return e = zc(e), zf(e);
  }
  var Vu = null;
  function zf(e) {
    if (Vu = null, e = Il(e), e !== null) {
      var t = D(e);
      if (t === null) e = null;
      else {
        var l = t.tag;
        if (l === 13) {
          if (e = O(t), e !== null) return e;
          e = null;
        } else if (l === 31) {
          if (e = Y(t), e !== null) return e;
          e = null;
        } else if (l === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return Vu = e, null;
  }
  function Gh(e) {
    switch (e) {
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
        switch (xm()) {
          case Vf:
            return 2;
          case Kf:
            return 8;
          case Bn:
          case Lm:
            return 32;
          case Ff:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Mf = !1, Al = null, Nl = null, _l = null, Dn = /* @__PURE__ */ new Map(), On = /* @__PURE__ */ new Map(), Dl = [], $0 = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function Yh(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Al = null;
        break;
      case "dragenter":
      case "dragleave":
        Nl = null;
        break;
      case "mouseover":
      case "mouseout":
        _l = null;
        break;
      case "pointerover":
      case "pointerout":
        Dn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        On.delete(t.pointerId);
    }
  }
  function Cn(e, t, l, a, n, u) {
    return e === null || e.nativeEvent !== u ? (e = {
      blockedOn: t,
      domEventName: l,
      eventSystemFlags: a,
      nativeEvent: u,
      targetContainers: [n]
    }, t !== null && (t = Pl(t), t !== null && xh(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), e);
  }
  function I0(e, t, l, a, n) {
    switch (t) {
      case "focusin":
        return Al = Cn(
          Al,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "dragenter":
        return Nl = Cn(
          Nl,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "mouseover":
        return _l = Cn(
          _l,
          e,
          t,
          l,
          a,
          n
        ), !0;
      case "pointerover":
        var u = n.pointerId;
        return Dn.set(
          u,
          Cn(
            Dn.get(u) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
      case "gotpointercapture":
        return u = n.pointerId, On.set(
          u,
          Cn(
            On.get(u) || null,
            e,
            t,
            l,
            a,
            n
          )
        ), !0;
    }
    return !1;
  }
  function kh(e) {
    var t = Il(e.target);
    if (t !== null) {
      var l = D(t);
      if (l !== null) {
        if (t = l.tag, t === 13) {
          if (t = O(l), t !== null) {
            e.blockedOn = t, Pf(e.priority, function() {
              Lh(l);
            });
            return;
          }
        } else if (t === 31) {
          if (t = Y(l), t !== null) {
            e.blockedOn = t, Pf(e.priority, function() {
              Lh(l);
            });
            return;
          }
        } else if (t === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Ku(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var l = Sf(e.nativeEvent);
      if (l === null) {
        l = e.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        Sc = a, l.target.dispatchEvent(a), Sc = null;
      } else
        return t = Pl(l), t !== null && xh(t), e.blockedOn = l, !1;
      t.shift();
    }
    return !0;
  }
  function jh(e, t, l) {
    Ku(e) && l.delete(t);
  }
  function P0() {
    Mf = !1, Al !== null && Ku(Al) && (Al = null), Nl !== null && Ku(Nl) && (Nl = null), _l !== null && Ku(_l) && (_l = null), Dn.forEach(jh), On.forEach(jh);
  }
  function Fu(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Mf || (Mf = !0, f.unstable_scheduleCallback(
      f.unstable_NormalPriority,
      P0
    )));
  }
  var Ju = null;
  function Xh(e) {
    Ju !== e && (Ju = e, f.unstable_scheduleCallback(
      f.unstable_NormalPriority,
      function() {
        Ju === e && (Ju = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t], a = e[t + 1], n = e[t + 2];
          if (typeof a != "function") {
            if (zf(a || l) === null)
              continue;
            break;
          }
          var u = Pl(l);
          u !== null && (e.splice(t, 3), t -= 3, pi(
            u,
            {
              pending: !0,
              data: n,
              method: l.method,
              action: a
            },
            a,
            n
          ));
        }
      }
    ));
  }
  function Ba(e) {
    function t(o) {
      return Fu(o, e);
    }
    Al !== null && Fu(Al, e), Nl !== null && Fu(Nl, e), _l !== null && Fu(_l, e), Dn.forEach(t), On.forEach(t);
    for (var l = 0; l < Dl.length; l++) {
      var a = Dl[l];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < Dl.length && (l = Dl[0], l.blockedOn === null); )
      kh(l), l.blockedOn === null && Dl.shift();
    if (l = (e.ownerDocument || e).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var n = l[a], u = l[a + 1], i = n[ut] || null;
        if (typeof u == "function")
          i || Xh(l);
        else if (i) {
          var r = null;
          if (u && u.hasAttribute("formAction")) {
            if (n = u, i = u[ut] || null)
              r = i.formAction;
            else if (zf(n) !== null) continue;
          } else r = i.action;
          typeof r == "function" ? l[a + 1] = r : (l.splice(a, 3), a -= 3), Xh(l);
        }
      }
  }
  function Qh() {
    function e(u) {
      u.canIntercept && u.info === "react-transition" && u.intercept({
        handler: function() {
          return new Promise(function(i) {
            return n = i;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      n !== null && (n(), n = null), a || setTimeout(l, 20);
    }
    function l() {
      if (!a && !navigation.transition) {
        var u = navigation.currentEntry;
        u && u.url != null && navigation.navigate(u.url, {
          state: u.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var a = !1, n = null;
      return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(l, 100), function() {
        a = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), n !== null && (n(), n = null);
      };
    }
  }
  function Tf(e) {
    this._internalRoot = e;
  }
  wu.prototype.render = Tf.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(s(409));
    var l = t.current, a = zt();
    Bh(l, a, e, t, null, null);
  }, wu.prototype.unmount = Tf.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Bh(e.current, 2, null, e, null, null), Ou(), t[$l] = null;
    }
  };
  function wu(e) {
    this._internalRoot = e;
  }
  wu.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = If();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < Dl.length && t !== 0 && t < Dl[l].priority; l++) ;
      Dl.splice(l, 0, e), l === 0 && kh(e);
    }
  };
  var Zh = h.version;
  if (Zh !== "19.2.0")
    throw Error(
      s(
        527,
        Zh,
        "19.2.0"
      )
    );
  H.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(s(188)) : (e = Object.keys(e).join(","), Error(s(268, e)));
    return e = z(t), e = e !== null ? F(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var ey = {
    bundleType: 0,
    version: "19.2.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: T,
    reconcilerVersion: "19.2.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Wu = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Wu.isDisabled && Wu.supportsFiber)
      try {
        Ga = Wu.inject(
          ey
        ), dt = Wu;
      } catch {
      }
  }
  return qn.createRoot = function(e, t) {
    if (!S(e)) throw Error(s(299));
    var l = !1, a = "", n = Ws, u = $s, i = Is;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (u = t.onCaughtError), t.onRecoverableError !== void 0 && (i = t.onRecoverableError)), t = Hh(
      e,
      1,
      !1,
      null,
      null,
      l,
      a,
      null,
      n,
      u,
      i,
      Qh
    ), e[$l] = t.current, nf(e), new Tf(t);
  }, qn.hydrateRoot = function(e, t, l) {
    if (!S(e)) throw Error(s(299));
    var a = !1, n = "", u = Ws, i = $s, r = Is, o = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (n = l.identifierPrefix), l.onUncaughtError !== void 0 && (u = l.onUncaughtError), l.onCaughtError !== void 0 && (i = l.onCaughtError), l.onRecoverableError !== void 0 && (r = l.onRecoverableError), l.formState !== void 0 && (o = l.formState)), t = Hh(
      e,
      1,
      !0,
      t,
      l ?? null,
      a,
      n,
      o,
      u,
      i,
      r,
      Qh
    ), t.context = Uh(null), l = t.current, a = zt(), a = mc(a), n = ml(a), n.callback = null, dl(l, n, a), l = a, t.current.lanes = l, ka(t, l), kt(t), e[$l] = t.current, nf(e), new wu(t);
  }, qn.version = "19.2.0", qn;
}
var Ih;
function fy() {
  if (Ih) return Nf.exports;
  Ih = 1;
  function f() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(f);
      } catch (h) {
        console.error(h);
      }
  }
  return f(), Nf.exports = iy(), Nf.exports;
}
var ry = fy(), sy = mm();
function oy(f = "") {
  const d = String(f).replace(/^#/, "").split("?")[0].split("/").filter(Boolean).map((s) => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  });
  if (!d.length) return { name: "intro" };
  if (d[0] === "login" || d[0] === "register") return { name: d[0] };
  if (d[0] === "learn") {
    if (d[1] === "experiments" && d[2]) return { name: "practice", id: d[2] };
    if (["overview", "experiments", "history"].includes(d[1])) return { name: d[1] };
    if (!d[1]) return { name: "overview" };
  }
  return { name: "intro", unknown: !0 };
}
const ve = {
  intro: "#/",
  login: "#/login",
  register: "#/register",
  overview: "#/learn/overview",
  experiments: "#/learn/experiments",
  history: "#/learn/history",
  practice: (f) => `#/learn/experiments/${encodeURIComponent(f)}`
}, hy = (f) => ["overview", "experiments", "history"].includes(f.name), my = /* @__PURE__ */ new Set(["llm_unavailable", "model_not_found", "not_configured", "network"]);
function dm(f) {
  return (f?.questions || []).map((h, d) => h && typeof (h.text ?? h.prompt) == "string" ? { id: String(h.id ?? `q${d + 1}`), text: h.text ?? h.prompt } : null).filter(Boolean);
}
function dy(f) {
  return f.key !== "Enter" || f.shiftKey || f.isComposing || f.nativeEvent?.isComposing || f.keyCode === 229 ? null : "send";
}
function Ph(f) {
  return my.has(f?.code);
}
const Hn = /* @__PURE__ */ new Map(), Pu = /* @__PURE__ */ new Set();
let ym = !1;
function ec(f) {
  return Hn.has(f) || Hn.set(f, { lessonId: f, sessionId: null, question: 0, messages: [] }), Hn.get(f);
}
function Ra(f, h) {
  const d = { ...ec(f), ...h(ec(f)) };
  return Hn.set(f, d), Pu.forEach((s) => s()), d;
}
function vm(f) {
  return Pu.add(f), () => Pu.delete(f);
}
const yy = () => ym;
function vy(f) {
  ym = !!f, Pu.forEach((h) => h());
}
function gy() {
  const f = [];
  for (const h of Hn.values()) {
    const d = [];
    let s = null;
    for (const S of h.messages) {
      S.kind === "question" && (s = S.text), S.kind === "answer" && d.push({ question: s, answer: S.text, at: S.at, result: null, error: null, id: S.id });
      const D = d.find((O) => O.id === S.answerId);
      D && S.kind === "result" && Object.assign(D, { result: S.result, error: null }), D && S.kind === "error" && Object.assign(D, { error: S.error });
    }
    d.length && f.push({ lessonId: h.lessonId, turns: d, last: d.at(-1).at });
  }
  return f.sort((h, d) => d.last.localeCompare(h.last));
}
function em(f) {
  return String(f ?? "").normalize("NFKC").toLocaleLowerCase("vi").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/\s+/g, " ").trim();
}
function Ey(f, h) {
  const d = new Map((h || []).map((S) => [S.id, S])), s = {};
  for (const S of f || [])
    s[S.id] = (S.setup || []).map((D) => d.get(D.stock)).filter(Boolean).map((D) => ({ name: D.name, formula: D.formula }));
  return s;
}
function by(f) {
  return [...new Set((f || []).map((h) => h.topic).filter(Boolean))].sort((h, d) => h.localeCompare(d, "vi"));
}
function py(f, { query: h = "", grade: d = "all", topic: s = "all" } = {}, S = {}) {
  const D = em(h);
  return (f || []).filter((O) => {
    if (O.status !== "ready" || d !== "all" && O.grade !== Number(d) || s !== "all" && O.topic !== s) return !1;
    if (!D) return !0;
    const Y = (S[O.id] || []).map((C) => `${C.name} ${C.formula}`).join(" ");
    return em(`${O.title} ${O.topic} ${O.objective || ""} ${Y}`).includes(D);
  });
}
function nc(f) {
  const h = f?.data;
  return h?.schema === "hololab-lesson-1" && typeof h.model?.lesson == "string" ? h.model.lesson : null;
}
function tc(f) {
  const h = f?.data?.model;
  return nc(f) ? h?.complete ? "Đã làm hết các bước" : h?.observed ? "Đã quan sát hiện tượng" : "Đang làm dở" : "Bàn thí nghiệm tự do";
}
function Sy({ saved: f = [], lessons: h = [], turns: d = [] }) {
  const s = new Map(h.map((S) => [S.id, S]));
  return {
    source: "browser",
    sessions: f.map((S, D) => {
      const O = nc(S);
      return { key: `${D}-${S.date}`, title: S.name, lessonId: O, lesson: s.get(O) || null, date: S.date, status: tc(S), raw: S };
    }),
    live: d.map((S) => ({ ...S, lesson: s.get(S.lessonId) || null }))
  };
}
const w = "#2B2A3A", $u = "#F7D2B6", Cf = "#EDB896", qf = "#4A2C20", tm = "#6B4130", xt = "#FFFFFF", ht = {
  red: "#E8473F",
  orange: "#F59A2A",
  yellow: "#F6C934",
  green: "#45B46A",
  blue: "#3A8EDB",
  purple: "#8E5BD0",
  pink: "#E9579C",
  cyan: "#2FB7C9"
};
function xa({ x: f, top: h = 300, height: d = 78, color: s, level: S = 0.6, w: D = 14 }) {
  const O = h + d, Y = D / 2, C = O - d * S;
  return /* @__PURE__ */ c.createElement("g", null, /* @__PURE__ */ c.createElement("path", { d: `M${f} ${C}h${D}v${O - C - Y}a${Y} ${Y} 0 0 1 -${D} 0z`, fill: s }), /* @__PURE__ */ c.createElement("path", { d: `M${f} ${h}h${D}v${d - Y}a${Y} ${Y} 0 0 1 -${D} 0z`, fill: xt, fillOpacity: ".25", stroke: w, strokeWidth: "2.4", strokeLinejoin: "round" }), /* @__PURE__ */ c.createElement("rect", { x: f - 2, y: h - 4, width: D + 4, height: "6", rx: "3", fill: xt, stroke: w, strokeWidth: "2.2" }), /* @__PURE__ */ c.createElement("path", { d: `M${f + 3.5} ${h + 8}v${d - 22}`, stroke: "#FFFFFF", strokeWidth: "2.4", strokeLinecap: "round", opacity: ".75" }));
}
function Hf({ x: f, size: h = 1, color: d }) {
  const s = h;
  return /* @__PURE__ */ c.createElement("g", { transform: `translate(${f} 382) scale(${s})` }, /* @__PURE__ */ c.createElement("path", { d: "M-30 -6l20 -34h20l20 34q3 6 -4 6h-52q-7 0 -4 -6z", fill: d }), /* @__PURE__ */ c.createElement("path", { d: "M-9 -78v28l-26 44q-3 6 4 6h62q7 0 4 -6l-26 -44v-28", fill: xt, fillOpacity: ".22", stroke: w, strokeWidth: "2.6", strokeLinejoin: "round" }), /* @__PURE__ */ c.createElement("rect", { x: "-13", y: "-84", width: "26", height: "7", rx: "3.5", fill: xt, stroke: w, strokeWidth: "2.4" }), /* @__PURE__ */ c.createElement("path", { d: "M-18 -20l8 -14", stroke: "#FFFFFF", strokeWidth: "3", strokeLinecap: "round", opacity: ".8" }), /* @__PURE__ */ c.createElement("circle", { cx: "6", cy: "-18", r: "3", fill: "#FFFFFF", opacity: ".7" }), /* @__PURE__ */ c.createElement("circle", { cx: "-4", cy: "-28", r: "2", fill: "#FFFFFF", opacity: ".7" }));
}
function zy({ x: f, r: h = 34, color: d }) {
  const s = 382 - h - 2;
  return /* @__PURE__ */ c.createElement("g", null, /* @__PURE__ */ c.createElement("rect", { x: f - h * 0.55, y: 378, width: h * 1.1, height: "6", rx: "3", fill: "#C9A77F" }), /* @__PURE__ */ c.createElement("path", { d: `M${f - h + 4} ${s + 6}a${h - 4} ${h - 4} 0 0 0 ${2 * (h - 4)} 0z`, fill: d }), /* @__PURE__ */ c.createElement("path", { d: `M${f - h + 4} ${s + 6}q${h - 4} -10 ${2 * (h - 4)} 0`, fill: d, opacity: ".9" }), /* @__PURE__ */ c.createElement("circle", { cx: f, cy: s, r: h, fill: xt, fillOpacity: ".2", stroke: w, strokeWidth: "2.6" }), /* @__PURE__ */ c.createElement("path", { d: `M${f - 9} ${s - h + 2}v-34h18v34`, fill: xt, fillOpacity: ".3", stroke: w, strokeWidth: "2.6", strokeLinejoin: "round" }), /* @__PURE__ */ c.createElement("rect", { x: f - 12, y: s - h - 38, width: "24", height: "7", rx: "3.5", fill: xt, stroke: w, strokeWidth: "2.4" }), /* @__PURE__ */ c.createElement("path", { d: `M${f - h + 12} ${s - 10}q4 -14 16 -20`, stroke: "#FFFFFF", strokeWidth: "3.5", fill: "none", strokeLinecap: "round", opacity: ".85" }), /* @__PURE__ */ c.createElement("circle", { cx: f + 10, cy: s + 14, r: "3.4", fill: "#FFFFFF", opacity: ".7" }), /* @__PURE__ */ c.createElement("circle", { cx: f - 6, cy: s + 20, r: "2.2", fill: "#FFFFFF", opacity: ".7" }));
}
function lm({ x: f, w: h = 44, h: d = 50, color: s }) {
  const S = 382 - d;
  return /* @__PURE__ */ c.createElement("g", null, /* @__PURE__ */ c.createElement("path", { d: `M${f + 3} ${S + d * 0.45}h${h - 6}v${d * 0.55 - 6}q0 4 -4 4h${-(h - 14)}q-4 0 -4 -4z`, fill: s }), /* @__PURE__ */ c.createElement("path", { d: `M${f - 4} ${S}h${h + 4}M${f} ${S}v${d - 4}q0 4 4 4h${h - 8}q4 0 4 -4v${-(d - 4)}`, fill: xt, fillOpacity: ".2", stroke: w, strokeWidth: "2.6", strokeLinejoin: "round", strokeLinecap: "round" }), /* @__PURE__ */ c.createElement("path", { d: `M${f + 7} ${S + 8}v${d - 20}`, stroke: "#FFFFFF", strokeWidth: "3", strokeLinecap: "round", opacity: ".8" }), [0.3, 0.5, 0.7].map((D) => /* @__PURE__ */ c.createElement("path", { key: D, d: `M${f + h - 12} ${S + d * D}h6`, stroke: w, strokeWidth: "1.6", opacity: ".55" })));
}
function My() {
  return /* @__PURE__ */ c.createElement(
    "svg",
    {
      className: "hl-hero-art",
      viewBox: "0 0 600 470",
      role: "img",
      "aria-label": "Minh họa: nữ sinh vui vẻ giơ ống nghiệm, bên bàn thí nghiệm có nhiều bình dung dịch nhiều màu, cùng trợ lý EGAD hỏi “Vì sao?”"
    },
    /* @__PURE__ */ c.createElement("path", { d: "M70 150C90 60 220 20 330 40s240 40 250 150-40 230-190 250S90 430 60 330 50 240 70 150z", fill: "#E7EEDC" }),
    /* @__PURE__ */ c.createElement("circle", { cx: "520", cy: "70", r: "26", fill: "#F1D780" }),
    /* @__PURE__ */ c.createElement("g", { fill: "#FFFFFF", opacity: ".9" }, /* @__PURE__ */ c.createElement("path", { d: "M462 120l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" }), /* @__PURE__ */ c.createElement("path", { d: "M120 230l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" })),
    /* @__PURE__ */ c.createElement("g", { transform: "translate(78 92)" }, /* @__PURE__ */ c.createElement("path", { d: "M0 -6q-2-26 24-28h70q16 0 16 16v16q0 16-16 16H56l-16 14v-14H16Q0 16 0 -6z", fill: "#FFFFFF", stroke: w, strokeWidth: "2.4" }), /* @__PURE__ */ c.createElement("text", { x: "54", y: "0", textAnchor: "middle", fontFamily: "Lora, Georgia, serif", fontSize: "19", fill: w }, "Vì sao?"), /* @__PURE__ */ c.createElement("g", { transform: "translate(14 32) scale(.8)" }, /* @__PURE__ */ c.createElement("path", { d: "M32 30L14 46M32 30l18 16", stroke: w, strokeWidth: "3", strokeLinecap: "round" }), /* @__PURE__ */ c.createElement("circle", { cx: "14", cy: "47", r: "9", fill: "#D4E2B8", stroke: w, strokeWidth: "2.5" }), /* @__PURE__ */ c.createElement("circle", { cx: "50", cy: "47", r: "9", fill: "#F1D780", stroke: w, strokeWidth: "2.5" }), /* @__PURE__ */ c.createElement("circle", { cx: "32", cy: "26", r: "17", fill: "#FFFFFF", stroke: w, strokeWidth: "2.5" }), /* @__PURE__ */ c.createElement("circle", { cx: "26", cy: "25", r: "2.4", fill: w }), /* @__PURE__ */ c.createElement("circle", { cx: "38", cy: "25", r: "2.4", fill: w }), /* @__PURE__ */ c.createElement("path", { d: "M26 32q6 5 12 0", stroke: w, strokeWidth: "2.4", fill: "none", strokeLinecap: "round" }))),
    /* @__PURE__ */ c.createElement("path", { d: "M232 150q-46 6-52 54-4 34 16 58 4-30 18-46 10 18 6 40 26-24 26-62 0-26-14-44z", fill: qf }),
    /* @__PURE__ */ c.createElement("path", { d: "M200 206q2 20 10 32", stroke: tm, strokeWidth: "4", fill: "none", strokeLinecap: "round", opacity: ".7" }),
    /* @__PURE__ */ c.createElement("path", { d: "M214 382q-4-92 34-120 20-12 52-12t52 12q38 28 34 120z", fill: "#FFFFFF", stroke: w, strokeWidth: "3", strokeLinejoin: "round" }),
    /* @__PURE__ */ c.createElement("path", { d: "M248 382q-2-78 18-114l34 44 34-44q20 36 18 114z", fill: "#4F4E8E", stroke: w, strokeWidth: "3", strokeLinejoin: "round" }),
    /* @__PURE__ */ c.createElement("path", { d: "M300 312v70", stroke: "#3E3D75", strokeWidth: "2.4" }),
    /* @__PURE__ */ c.createElement("circle", { cx: "300", cy: "334", r: "3", fill: "#E9E6F7" }),
    /* @__PURE__ */ c.createElement("circle", { cx: "300", cy: "356", r: "3", fill: "#E9E6F7" }),
    /* @__PURE__ */ c.createElement("path", { d: "M266 268l34 44 34-44", fill: "none", stroke: w, strokeWidth: "2.6", strokeLinejoin: "round" }),
    /* @__PURE__ */ c.createElement("path", { d: "M282 252l18 18 18-18", fill: "#FFFFFF", stroke: w, strokeWidth: "2.6", strokeLinejoin: "round" }),
    /* @__PURE__ */ c.createElement("path", { d: "M300 270l-26-12q-6 0-6 6v14q0 6 6 6z", fill: "#D2346E", stroke: w, strokeWidth: "2.4", strokeLinejoin: "round" }),
    /* @__PURE__ */ c.createElement("path", { d: "M300 270l26-12q6 0 6 6v14q0 6-6 6z", fill: "#D2346E", stroke: w, strokeWidth: "2.4", strokeLinejoin: "round" }),
    /* @__PURE__ */ c.createElement("path", { d: "M300 270l-12 30M300 270l12 30", stroke: "#B52A5E", strokeWidth: "5", strokeLinecap: "round" }),
    /* @__PURE__ */ c.createElement("rect", { x: "292", y: "262", width: "16", height: "16", rx: "5", fill: "#E0457F", stroke: w, strokeWidth: "2.4" }),
    /* @__PURE__ */ c.createElement("path", { d: "M286 222h28v26q-14 10-28 0z", fill: Cf }),
    /* @__PURE__ */ c.createElement("ellipse", { cx: "300", cy: "160", rx: "66", ry: "68", fill: $u, stroke: w, strokeWidth: "2.6" }),
    /* @__PURE__ */ c.createElement("ellipse", { cx: "236", cy: "168", rx: "9", ry: "13", fill: $u, stroke: w, strokeWidth: "2.4" }),
    /* @__PURE__ */ c.createElement("path", { d: "M232 168q-10-92 70-98 76 0 68 92-8-38-32-50-6 22-38 28 12-12 10-26-22 24-62 26-12 12-16 28z", fill: qf, stroke: w, strokeWidth: "2.4", strokeLinejoin: "round" }),
    /* @__PURE__ */ c.createElement("path", { d: "M270 92q20-10 48-6", stroke: tm, strokeWidth: "5", fill: "none", strokeLinecap: "round", opacity: ".8" }),
    /* @__PURE__ */ c.createElement("g", { transform: "translate(232 118) rotate(-24)" }, /* @__PURE__ */ c.createElement("path", { d: "M0 0l-24-14q-6-2-6 4v20q0 6 6 4z", fill: "#E9579C", stroke: w, strokeWidth: "2.4", strokeLinejoin: "round" }), /* @__PURE__ */ c.createElement("path", { d: "M0 0l24-14q6-2 6 4v20q0 6-6 4z", fill: "#E9579C", stroke: w, strokeWidth: "2.4", strokeLinejoin: "round" }), /* @__PURE__ */ c.createElement("circle", { r: "7", fill: "#F27DB2", stroke: w, strokeWidth: "2.4" })),
    /* @__PURE__ */ c.createElement("path", { d: "M258 140q12-8 26-2M316 138q14-6 26 2", stroke: qf, strokeWidth: "4", fill: "none", strokeLinecap: "round" }),
    [[272, 166], [328, 166]].map(([f, h]) => /* @__PURE__ */ c.createElement("g", { key: f }, /* @__PURE__ */ c.createElement("ellipse", { cx: f, cy: h, rx: "15", ry: "18", fill: "#FFFFFF", stroke: w, strokeWidth: "2.4" }), /* @__PURE__ */ c.createElement("ellipse", { cx: f + 1, cy: h + 2, rx: "10.5", ry: "13", fill: "#2FA4C8" }), /* @__PURE__ */ c.createElement("ellipse", { cx: f + 1, cy: h + 3, rx: "6", ry: "7.5", fill: "#1B2433" }), /* @__PURE__ */ c.createElement("circle", { cx: f - 3, cy: h - 3, r: "3.6", fill: "#FFFFFF" }), /* @__PURE__ */ c.createElement("circle", { cx: f + 5, cy: h + 7, r: "1.8", fill: "#FFFFFF" }), /* @__PURE__ */ c.createElement("path", { d: `M${f - 16} ${h - 10}q16-16 32 0`, stroke: w, strokeWidth: "3.4", fill: "none", strokeLinecap: "round" }))),
    /* @__PURE__ */ c.createElement("path", { d: "M254 158l-6-4M346 158l6-4", stroke: w, strokeWidth: "2.6", strokeLinecap: "round" }),
    /* @__PURE__ */ c.createElement("ellipse", { cx: "252", cy: "194", rx: "11", ry: "7", fill: "#F49A9A", opacity: ".55" }),
    /* @__PURE__ */ c.createElement("ellipse", { cx: "348", cy: "194", rx: "11", ry: "7", fill: "#F49A9A", opacity: ".55" }),
    /* @__PURE__ */ c.createElement("path", { d: "M298 186q3 3 6 0", stroke: Cf, strokeWidth: "3", fill: "none", strokeLinecap: "round" }),
    /* @__PURE__ */ c.createElement("path", { d: "M280 200q20 22 40 0z", fill: "#9E2F3A", stroke: w, strokeWidth: "2.6", strokeLinejoin: "round" }),
    /* @__PURE__ */ c.createElement("path", { d: "M288 208q12 8 24 0q-12-6-24 0z", fill: "#F07C86" }),
    /* @__PURE__ */ c.createElement("path", { d: "M283 201h34", stroke: "#FFFFFF", strokeWidth: "3", strokeLinecap: "round" }),
    /* @__PURE__ */ c.createElement("path", { d: "M228 284q-30 34-12 64 6 10 22 8", fill: "none", stroke: w, strokeWidth: "31", strokeLinecap: "round" }),
    /* @__PURE__ */ c.createElement("path", { d: "M228 284q-30 34-12 64 6 10 22 8", fill: "none", stroke: "#FFFFFF", strokeWidth: "25.5", strokeLinecap: "round" }),
    /* @__PURE__ */ c.createElement("circle", { cx: "244", cy: "352", r: "13", fill: $u, stroke: w, strokeWidth: "2.4" }),
    /* @__PURE__ */ c.createElement("path", { d: "M250 322v42", stroke: w, strokeWidth: "2.4" }),
    /* @__PURE__ */ c.createElement("rect", { x: "246", y: "306", width: "9", height: "20", rx: "4.5", fill: "#E8473F", stroke: w, strokeWidth: "2.2" }),
    /* @__PURE__ */ c.createElement("path", { d: "M247 336h7v26l-3.5 8-3.5-8z", fill: xt, fillOpacity: ".6", stroke: w, strokeWidth: "2", strokeLinejoin: "round" }),
    /* @__PURE__ */ c.createElement("path", { d: "M248.5 352h4v10l-2 5-2-5z", fill: ht.green }),
    /* @__PURE__ */ c.createElement("path", { d: "M366 286q38-18 44-60 3-24 2-40", fill: "none", stroke: w, strokeWidth: "31", strokeLinecap: "round" }),
    /* @__PURE__ */ c.createElement("path", { d: "M366 286q38-18 44-60 3-24 2-40", fill: "none", stroke: "#FFFFFF", strokeWidth: "25.5", strokeLinecap: "round" }),
    /* @__PURE__ */ c.createElement("path", { d: "M352 268q14 2 26 10", fill: "none", stroke: "#FFFFFF", strokeWidth: "18", strokeLinecap: "round" }),
    /* @__PURE__ */ c.createElement("rect", { x: "398", y: "176", width: "28", height: "12", rx: "6", fill: "#E9E6F7", stroke: w, strokeWidth: "2.4" }),
    /* @__PURE__ */ c.createElement("g", { transform: "rotate(12 422 120)" }, /* @__PURE__ */ c.createElement("path", { d: "M414 100h16v68a8 8 0 0 1-16 0z", fill: ht.orange }), /* @__PURE__ */ c.createElement("path", { d: "M414 70h16v98a8 8 0 0 1-16 0z", fill: xt, fillOpacity: ".3", stroke: w, strokeWidth: "2.6", strokeLinejoin: "round" }), /* @__PURE__ */ c.createElement("rect", { x: "411", y: "65", width: "22", height: "7", rx: "3.5", fill: xt, stroke: w, strokeWidth: "2.4" }), /* @__PURE__ */ c.createElement("path", { d: "M418 80v70", stroke: "#FFFFFF", strokeWidth: "2.6", strokeLinecap: "round", opacity: ".85" }), /* @__PURE__ */ c.createElement("circle", { cx: "424", cy: "116", r: "2.4", fill: "#FFFFFF", opacity: ".8" }), /* @__PURE__ */ c.createElement("circle", { cx: "420", cy: "128", r: "1.8", fill: "#FFFFFF", opacity: ".8" })),
    /* @__PURE__ */ c.createElement("ellipse", { cx: "412", cy: "160", rx: "16", ry: "14", fill: $u, stroke: w, strokeWidth: "2.4" }),
    /* @__PURE__ */ c.createElement("path", { d: "M400 152q8-4 16 0M400 160q8-4 16 0", stroke: Cf, strokeWidth: "2.4", fill: "none", strokeLinecap: "round" }),
    /* @__PURE__ */ c.createElement("g", { fill: "#F6C934", stroke: w, strokeWidth: "1.6", strokeLinejoin: "round" }, /* @__PURE__ */ c.createElement("path", { d: "M466 92l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" }), /* @__PURE__ */ c.createElement("path", { d: "M452 46l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" })),
    /* @__PURE__ */ c.createElement("rect", { x: "30", y: "380", width: "540", height: "22", rx: "10", fill: "#C9A77F" }),
    /* @__PURE__ */ c.createElement("rect", { x: "30", y: "380", width: "540", height: "6", rx: "3", fill: "#D9BC95" }),
    /* @__PURE__ */ c.createElement("rect", { x: "62", y: "402", width: "16", height: "56", rx: "4", fill: "#B08C63" }),
    /* @__PURE__ */ c.createElement("rect", { x: "522", y: "402", width: "16", height: "56", rx: "4", fill: "#B08C63" }),
    /* @__PURE__ */ c.createElement("rect", { x: "44", y: "352", width: "104", height: "10", rx: "4", fill: "#9CC08F", stroke: w, strokeWidth: "2" }),
    /* @__PURE__ */ c.createElement("rect", { x: "50", y: "362", width: "6", height: "20", fill: "#9CC08F" }),
    /* @__PURE__ */ c.createElement("rect", { x: "136", y: "362", width: "6", height: "20", fill: "#9CC08F" }),
    /* @__PURE__ */ c.createElement(xa, { x: 56, top: 300, color: ht.red, level: 0.7 }),
    /* @__PURE__ */ c.createElement(xa, { x: 78, top: 292, height: 86, color: ht.yellow, level: 0.75 }),
    /* @__PURE__ */ c.createElement(xa, { x: 100, top: 300, color: ht.blue, level: 0.55 }),
    /* @__PURE__ */ c.createElement(xa, { x: 122, top: 296, height: 82, color: ht.purple, level: 0.65 }),
    /* @__PURE__ */ c.createElement(Hf, { x: 186, size: 0.82, color: ht.green }),
    /* @__PURE__ */ c.createElement(lm, { x: 410, w: 40, h: 46, color: ht.cyan }),
    /* @__PURE__ */ c.createElement(Hf, { x: 474, size: 0.72, color: ht.pink }),
    /* @__PURE__ */ c.createElement(zy, { x: 530, r: 30, color: ht.orange }),
    /* @__PURE__ */ c.createElement(Hf, { x: 258, size: 0.66, color: ht.purple }),
    /* @__PURE__ */ c.createElement(lm, { x: 318, w: 36, h: 40, color: ht.red }),
    /* @__PURE__ */ c.createElement(xa, { x: 366, top: 318, height: 62, color: ht.green, level: 0.6, w: 12 }),
    /* @__PURE__ */ c.createElement(xa, { x: 384, top: 322, height: 58, color: ht.yellow, level: 0.5, w: 12 }),
    /* @__PURE__ */ c.createElement("g", { transform: "translate(150 368) rotate(-6)" }, /* @__PURE__ */ c.createElement("rect", { width: "46", height: "12", rx: "2", fill: "#3A8EDB", stroke: w, strokeWidth: "2" }), /* @__PURE__ */ c.createElement("path", { d: "M6 3h30", stroke: "#FFFFFF", strokeWidth: "2", opacity: ".8" })),
    /* @__PURE__ */ c.createElement("path", { d: "M574 376q-6-40 18-60 10 30-18 60z", fill: "#9CC08F" }),
    /* @__PURE__ */ c.createElement("path", { d: "M28 376q-2-36-24-52-6 30 24 52z", fill: "#527A50", opacity: ".8" })
  );
}
const tt = "#243C32";
function gm({ size: f = 40 }) {
  return /* @__PURE__ */ c.createElement("svg", { className: "hl-logo-mark", width: f, height: f, viewBox: "0 0 48 48", "aria-hidden": "true" }, /* @__PURE__ */ c.createElement("circle", { cx: "24", cy: "24", r: "23", fill: "#E7EEDC" }), /* @__PURE__ */ c.createElement("path", { d: "M19 9h10M21 9v11L12 36q-2 4 3 4h18q5 0 3-4l-9-16V9", fill: "#FFFFFF", stroke: tt, strokeWidth: "2.4", strokeLinejoin: "round" }), /* @__PURE__ */ c.createElement("path", { d: "M15.5 31h17l2.5 5q1 2-1.5 2h-19q-2.5 0-1.5-2z", fill: "#9CC08F" }), /* @__PURE__ */ c.createElement("circle", { cx: "22", cy: "27", r: "1.8", fill: "#9CC08F" }), /* @__PURE__ */ c.createElement("circle", { cx: "27", cy: "23.5", r: "1.3", fill: "#9CC08F" }), /* @__PURE__ */ c.createElement("path", { d: "M31 14q5-6 10-3-3 6-10 3z", fill: "#527A50" }));
}
function Em({ size: f = 44 }) {
  return /* @__PURE__ */ c.createElement("svg", { className: "hl-assistant", width: f, height: f, viewBox: "0 0 64 64", "aria-hidden": "true" }, /* @__PURE__ */ c.createElement("path", { d: "M32 30L14 46M32 30l18 16", stroke: tt, strokeWidth: "3", strokeLinecap: "round" }), /* @__PURE__ */ c.createElement("circle", { cx: "14", cy: "47", r: "9", fill: "#D4E2B8", stroke: tt, strokeWidth: "2.5" }), /* @__PURE__ */ c.createElement("circle", { cx: "50", cy: "47", r: "9", fill: "#F1D780", stroke: tt, strokeWidth: "2.5" }), /* @__PURE__ */ c.createElement("circle", { cx: "32", cy: "26", r: "17", fill: "#FFFFFF", stroke: tt, strokeWidth: "2.5" }), /* @__PURE__ */ c.createElement("circle", { cx: "26", cy: "25", r: "2.4", fill: tt }), /* @__PURE__ */ c.createElement("circle", { cx: "38", cy: "25", r: "2.4", fill: tt }), /* @__PURE__ */ c.createElement("path", { d: "M26 32q6 5 12 0", stroke: tt, strokeWidth: "2.4", fill: "none", strokeLinecap: "round" }), /* @__PURE__ */ c.createElement("circle", { cx: "21.5", cy: "30", r: "2.2", fill: "#F4B9A8", opacity: ".8" }), /* @__PURE__ */ c.createElement("circle", { cx: "42.5", cy: "30", r: "2.2", fill: "#F4B9A8", opacity: ".8" }));
}
function Ty() {
  return /* @__PURE__ */ c.createElement("svg", { className: "hl-about-art", viewBox: "0 0 440 330", role: "img", "aria-label": "Minh họa: sổ ghi chép mở với phương trình phản ứng, mô hình phân tử và bong bóng hội thoại" }, /* @__PURE__ */ c.createElement("path", { d: "M40 120C60 40 180 20 270 40s160 70 150 160-110 120-220 110S20 200 40 120z", fill: "#E7EEDC" }), /* @__PURE__ */ c.createElement("path", { d: "M80 230l130 26V130L80 104z", fill: "#FFFFFF", stroke: tt, strokeWidth: "3", strokeLinejoin: "round" }), /* @__PURE__ */ c.createElement("path", { d: "M340 230l-130 26V130l130-26z", fill: "#FFFFFF", stroke: tt, strokeWidth: "3", strokeLinejoin: "round" }), /* @__PURE__ */ c.createElement("path", { d: "M100 134l88 17M100 154l70 13M100 174l84 16", stroke: "#9CC08F", strokeWidth: "5", strokeLinecap: "round" }), /* @__PURE__ */ c.createElement("text", { x: "274", y: "166", textAnchor: "middle", fontFamily: "Lora, Georgia, serif", fontSize: "14", fill: tt, transform: "rotate(-11 274 166)" }, "Ag⁺ + Cl⁻ → AgCl↓"), /* @__PURE__ */ c.createElement("path", { d: "M232 196l88-17", stroke: "#F1D780", strokeWidth: "6", strokeLinecap: "round" }), /* @__PURE__ */ c.createElement("g", { stroke: tt, strokeWidth: "3" }, /* @__PURE__ */ c.createElement("path", { d: "M330 70l30 24M330 70l-22 30" }), /* @__PURE__ */ c.createElement("circle", { cx: "330", cy: "70", r: "14", fill: "#F2B6CB" }), /* @__PURE__ */ c.createElement("circle", { cx: "362", cy: "96", r: "10", fill: "#FFFFFF" }), /* @__PURE__ */ c.createElement("circle", { cx: "306", cy: "102", r: "10", fill: "#FFFFFF" })), /* @__PURE__ */ c.createElement("path", { d: "M70 60q0-16 16-16h72q16 0 16 16v28q0 16-16 16h-46l-22 18v-18q-20 0-20-16z", fill: "#FFFFFF", stroke: tt, strokeWidth: "3" }), /* @__PURE__ */ c.createElement("path", { d: "M92 66h56M92 82h38", stroke: "#527A50", strokeWidth: "5", strokeLinecap: "round" }), /* @__PURE__ */ c.createElement("path", { d: "M380 250q-4-36 20-56 8 30-20 56z", fill: "#9CC08F" }));
}
const am = ["#F7DDD1", "#E7EEDC", "#FBF0C9", "#DCECF4", "#ECE1F4"], nm = ["#9CC08F", "#F2B6CB", "#A9D2EA", "#F1C76E", "#C6AEE6"];
function Yf({ index: f = 0 }) {
  const h = am[f % am.length], d = nm[f % nm.length];
  return /* @__PURE__ */ c.createElement("svg", { className: "hl-thumb", viewBox: "0 0 96 72", "aria-hidden": "true" }, /* @__PURE__ */ c.createElement("rect", { width: "96", height: "72", rx: "16", fill: h }), /* @__PURE__ */ c.createElement("path", { d: "M18 18h12v34q0 7-6 7t-6-7z", fill: "#FFFFFF", stroke: tt, strokeWidth: "2" }), /* @__PURE__ */ c.createElement("path", { d: "M20 40h8v12q0 4-4 4t-4-4z", fill: d }), /* @__PURE__ */ c.createElement("path", { d: "M44 14h10M46 14v13L36 50q-2 6 4 6h18q6 0 4-6L52 27V14", fill: "#FFFFFF", stroke: tt, strokeWidth: "2", strokeLinejoin: "round" }), /* @__PURE__ */ c.createElement("path", { d: "M38 44h22l3 7q1 3-2 3H37q-3 0-2-3z", fill: d }), /* @__PURE__ */ c.createElement("path", { d: "M68 30h16l-2 24q0 3-3 3h-6q-3 0-3-3z", fill: "#FFFFFF", stroke: tt, strokeWidth: "2", strokeLinejoin: "round" }), /* @__PURE__ */ c.createElement("path", { d: "M70 44h12l-1 9q0 2-2 2h-6q-2 0-2-2z", fill: d, opacity: ".85" }));
}
function Ay() {
  return /* @__PURE__ */ c.createElement("svg", { className: "hl-empty-art", viewBox: "0 0 160 110", "aria-hidden": "true" }, /* @__PURE__ */ c.createElement("ellipse", { cx: "80", cy: "96", rx: "64", ry: "12", fill: "#E7EEDC" }), /* @__PURE__ */ c.createElement("path", { d: "M68 18h24M71 18v22L52 80q-3 10 8 10h40q11 0 8-10L89 40V18", fill: "#FFFFFF", stroke: tt, strokeWidth: "3", strokeLinejoin: "round" }), /* @__PURE__ */ c.createElement("path", { d: "M58 72h44l4 9q1 4-4 4H58q-5 0-4-4z", fill: "#D4E2B8" }), /* @__PURE__ */ c.createElement("path", { d: "M116 40l3 7 7 3-7 3-3 7-3-7-7-3 7-3z", fill: "#F1D780" }));
}
function Xe({ children: f, label: h, size: d = 22 }) {
  return /* @__PURE__ */ c.createElement(
    "svg",
    {
      className: "hl-icon",
      width: d,
      height: d,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      role: h ? "img" : void 0,
      "aria-label": h,
      "aria-hidden": h ? void 0 : !0
    },
    f
  );
}
const Ny = (f) => /* @__PURE__ */ c.createElement(Xe, { ...f }, /* @__PURE__ */ c.createElement("path", { d: "M4 11l8-7 8 7" }), /* @__PURE__ */ c.createElement("path", { d: "M6 10v9h12v-9" }), /* @__PURE__ */ c.createElement("path", { d: "M10 19v-5h4v5" })), kf = (f) => /* @__PURE__ */ c.createElement(Xe, { ...f }, /* @__PURE__ */ c.createElement("path", { d: "M9 3h6M10 3v6l-5 9q-1 3 2 3h10q3 0 2-3l-5-9V3" }), /* @__PURE__ */ c.createElement("path", { d: "M7.5 15h9" })), bm = (f) => /* @__PURE__ */ c.createElement(Xe, { ...f }, /* @__PURE__ */ c.createElement("path", { d: "M3 12a9 9 0 1 0 3-6.7" }), /* @__PURE__ */ c.createElement("path", { d: "M3 4v4h4" }), /* @__PURE__ */ c.createElement("path", { d: "M12 8v4l3 2" })), pm = (f) => /* @__PURE__ */ c.createElement(Xe, { ...f }, /* @__PURE__ */ c.createElement("path", { d: "M4 7h16M4 12h16M4 17h16" })), Sm = (f) => /* @__PURE__ */ c.createElement(Xe, { ...f }, /* @__PURE__ */ c.createElement("path", { d: "M6 6l12 12M18 6L6 18" })), _y = (f) => /* @__PURE__ */ c.createElement(Xe, { ...f }, /* @__PURE__ */ c.createElement("path", { d: "M15 6l-6 6 6 6" })), zm = (f) => /* @__PURE__ */ c.createElement(Xe, { ...f }, /* @__PURE__ */ c.createElement("path", { d: "M9 6l6 6-6 6" })), Dy = (f) => /* @__PURE__ */ c.createElement(Xe, { ...f }, /* @__PURE__ */ c.createElement("circle", { cx: "11", cy: "11", r: "6.5" }), /* @__PURE__ */ c.createElement("path", { d: "M20 20l-4.2-4.2" })), Mm = (f) => /* @__PURE__ */ c.createElement(Xe, { ...f }, /* @__PURE__ */ c.createElement("path", { d: "M5 12h14M13 6l6 6-6 6" })), Oy = (f) => /* @__PURE__ */ c.createElement(Xe, { ...f }, /* @__PURE__ */ c.createElement("path", { d: "M8 13V6.5a1.5 1.5 0 0 1 3 0V12V4.5a1.5 1.5 0 0 1 3 0V12V6a1.5 1.5 0 0 1 3 0v8q0 6-6 7-4 0-6-4l-2-4q-1-2 1-2.5t3 1.5z" })), Tm = (f) => /* @__PURE__ */ c.createElement(Xe, { ...f }, /* @__PURE__ */ c.createElement("path", { d: "M4 6q0-2 2-2h12q2 0 2 2v8q0 2-2 2h-7l-5 4v-4q-2 0-2-2z" }), /* @__PURE__ */ c.createElement("path", { d: "M8 9h8M8 12h5" })), Am = (f) => /* @__PURE__ */ c.createElement(Xe, { ...f }, /* @__PURE__ */ c.createElement("path", { d: "M20 12a8 8 0 1 1-2.3-5.6" }), /* @__PURE__ */ c.createElement("path", { d: "M20 4v5h-5" })), Cy = (f) => /* @__PURE__ */ c.createElement(Xe, { ...f }, /* @__PURE__ */ c.createElement("rect", { x: "5", y: "10", width: "14", height: "10", rx: "2" }), /* @__PURE__ */ c.createElement("path", { d: "M8 10V7a4 4 0 0 1 8 0v3" })), qy = (f) => /* @__PURE__ */ c.createElement(Xe, { ...f }, /* @__PURE__ */ c.createElement("path", { d: "M4 12l16-8-6 16-2.5-6.5z" }), /* @__PURE__ */ c.createElement("path", { d: "M11.5 13.5L20 4" })), Hy = (f) => /* @__PURE__ */ c.createElement(Xe, { ...f }, /* @__PURE__ */ c.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ c.createElement("path", { d: "M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3q-1 .5-1 1.7" }), /* @__PURE__ */ c.createElement("path", { d: "M12 17h.01" })), Uy = (f) => /* @__PURE__ */ c.createElement(Xe, { ...f }, /* @__PURE__ */ c.createElement("path", { d: "M5 4h11l3 3v13H5z" }), /* @__PURE__ */ c.createElement("path", { d: "M8 4v5h7V4M8 20v-6h8v6" })), By = (f) => /* @__PURE__ */ c.createElement(Xe, { ...f }, /* @__PURE__ */ c.createElement("path", { d: "M9 14L4 9l5-5" }), /* @__PURE__ */ c.createElement("path", { d: "M4 9h10a6 6 0 0 1 0 12h-3" })), Ry = (f) => /* @__PURE__ */ c.createElement(Xe, { ...f }, /* @__PURE__ */ c.createElement("path", { d: "M15 14l5-5-5-5" }), /* @__PURE__ */ c.createElement("path", { d: "M20 9H10a6 6 0 0 0 0 12h3" })), xy = (f) => /* @__PURE__ */ c.createElement(Xe, { ...f }, /* @__PURE__ */ c.createElement("path", { d: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" })), Ly = (f) => /* @__PURE__ */ c.createElement(Xe, { ...f }, /* @__PURE__ */ c.createElement("path", { d: "M12 20V5M7 9l5-5 5 5" }), /* @__PURE__ */ c.createElement("path", { d: "M6 20h12" })), um = "hololab-sidebar-collapsed", Gy = (f) => {
  try {
    return localStorage.getItem(f);
  } catch {
    return null;
  }
}, Yy = (f, h) => {
  try {
    localStorage.setItem(f, h);
  } catch {
  }
};
function ky({ route: f, user: h, onSignOut: d }) {
  const [s, S] = L.useState(!1), D = ["overview", "experiments", "history"].includes(f.name);
  L.useEffect(() => S(!1), [f.name]), L.useEffect(() => {
    if (!s) return;
    const Y = (C) => C.key === "Escape" && S(!1);
    return addEventListener("keydown", Y), () => removeEventListener("keydown", Y);
  }, [s]);
  const O = (Y, C, z) => /* @__PURE__ */ c.createElement("a", { href: Y, "aria-current": z ? "page" : void 0 }, C);
  return /* @__PURE__ */ c.createElement("header", { className: "hl-topnav" }, /* @__PURE__ */ c.createElement("a", { className: "hl-brand", href: ve.intro, "aria-label": "HoloLab: trang giới thiệu" }, /* @__PURE__ */ c.createElement(gm, null), /* @__PURE__ */ c.createElement("span", null, /* @__PURE__ */ c.createElement("strong", null, "HoloLab"), /* @__PURE__ */ c.createElement("small", null, "Phòng thí nghiệm Hóa học ảo"))), /* @__PURE__ */ c.createElement("nav", { className: "hl-topnav-main", "aria-label": "Điều hướng chính" }, O(ve.intro, "Giới thiệu", f.name === "intro"), O(ve.overview, "Học tập", D)), /* @__PURE__ */ c.createElement("div", { className: "hl-topnav-account" }, h ? /* @__PURE__ */ c.createElement(c.Fragment, null, /* @__PURE__ */ c.createElement("span", { className: "hl-user", title: h.role === "teacher" ? "Giáo viên" : "Học sinh" }, h.username), /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-btn hl-btn-ghost", onClick: d }, "Đăng xuất")) : /* @__PURE__ */ c.createElement(c.Fragment, null, /* @__PURE__ */ c.createElement("a", { className: "hl-link-quiet", href: ve.login, "aria-current": f.name === "login" ? "page" : void 0 }, "Đăng nhập"), /* @__PURE__ */ c.createElement("a", { className: "hl-btn hl-btn-primary", href: ve.register, "aria-current": f.name === "register" ? "page" : void 0 }, "Đăng ký"))), /* @__PURE__ */ c.createElement(
    "button",
    {
      type: "button",
      className: "hl-icon-btn hl-topnav-toggle",
      "aria-expanded": s,
      "aria-controls": "hl-topnav-menu",
      "aria-label": s ? "Đóng menu" : "Mở menu",
      onClick: () => S((Y) => !Y)
    },
    s ? /* @__PURE__ */ c.createElement(Sm, null) : /* @__PURE__ */ c.createElement(pm, null)
  ), s && /* @__PURE__ */ c.createElement("div", { className: "hl-topnav-menu", id: "hl-topnav-menu" }, O(ve.intro, "Giới thiệu", f.name === "intro"), O(ve.overview, "Học tập", D), h ? /* @__PURE__ */ c.createElement(c.Fragment, null, /* @__PURE__ */ c.createElement("span", { className: "hl-user" }, h.username), /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-btn hl-btn-ghost", onClick: d }, "Đăng xuất")) : /* @__PURE__ */ c.createElement(c.Fragment, null, O(ve.login, "Đăng nhập", f.name === "login"), /* @__PURE__ */ c.createElement("a", { className: "hl-btn hl-btn-primary", href: ve.register }, "Đăng ký"))));
}
const jy = [
  ["overview", "Tổng quan", Ny, ve.overview],
  ["experiments", "Thư viện thí nghiệm", kf, ve.experiments],
  ["history", "Lịch sử học", bm, ve.history]
];
function Xy({ route: f, children: h }) {
  const [d, s] = L.useState(() => Gy(um) === "1"), [S, D] = L.useState(!1), O = L.useRef(null);
  L.useEffect(() => D(!1), [f.name]), L.useEffect(() => {
    if (!S) return;
    O.current?.querySelector("a")?.focus();
    const z = (F) => F.key === "Escape" && D(!1);
    return addEventListener("keydown", z), () => removeEventListener("keydown", z);
  }, [S]);
  const Y = () => s((z) => (Yy(um, z ? "0" : "1"), !z)), C = /* @__PURE__ */ c.createElement("nav", { "aria-label": "Khu học tập" }, jy.map(([z, F, B, Z]) => /* @__PURE__ */ c.createElement("a", { key: z, href: Z, className: "hl-side-link", "aria-current": f.name === z ? "page" : void 0, title: d ? F : void 0 }, /* @__PURE__ */ c.createElement(B, null), /* @__PURE__ */ c.createElement("span", null, F))));
  return /* @__PURE__ */ c.createElement("div", { className: "hl-learn" + (d ? " is-collapsed" : "") }, /* @__PURE__ */ c.createElement("aside", { className: "hl-sidebar", "aria-label": "Thanh bên" }, C, /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-side-collapse", onClick: Y, "aria-label": d ? "Mở rộng thanh bên" : "Thu gọn thanh bên" }, d ? /* @__PURE__ */ c.createElement(zm, null) : /* @__PURE__ */ c.createElement(_y, null), /* @__PURE__ */ c.createElement("span", null, "Thu gọn"))), S && /* @__PURE__ */ c.createElement("div", { className: "hl-drawer-scrim", onClick: () => D(!1) }), S && /* @__PURE__ */ c.createElement("aside", { className: "hl-drawer", ref: O, "aria-label": "Menu khu học tập" }, /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-icon-btn hl-drawer-close", onClick: () => D(!1), "aria-label": "Đóng menu" }, /* @__PURE__ */ c.createElement(Sm, null)), C), /* @__PURE__ */ c.createElement("div", { className: "hl-learn-main", id: "hl-content" }, /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-btn hl-btn-ghost hl-drawer-open", onClick: () => D(!0), "aria-label": "Mở menu khu học tập" }, /* @__PURE__ */ c.createElement(pm, null), " Menu học tập"), h));
}
function Qy() {
  L.useEffect(() => {
    const f = document.querySelector("main"), h = document.getElementById("workspace");
    if (!f || !h || typeof ResizeObserver > "u") return;
    let d = -1;
    const s = () => {
      const D = Math.round(h.getBoundingClientRect().top - f.getBoundingClientRect().top + f.scrollTop);
      D > 0 && D !== d && (d = D, document.body.style.setProperty("--hl-bench-top", `${D}px`));
    }, S = new ResizeObserver(s);
    for (const D of [document.getElementById("mouse-shell"), document.querySelector(".camera-deck"), document.getElementById("settings-notice")]) D && S.observe(D);
    return addEventListener("resize", s), s(), () => {
      S.disconnect(), removeEventListener("resize", s);
    };
  }, []);
}
const Zy = [["move", "Di chuyển"], ["rotate", "Nghiêng / rót"], ["depth", "Gần / xa"]], Vy = {
  move: "Giữ chuột trái trên bình để kéo · Thả chuột: bình rơi",
  rotate: "Giữ chuột và kéo ngang để nghiêng bình · Kéo dọc để xoay trước/sau",
  depth: "Giữ chuột và kéo lên/xuống để đổi chiều sâu"
};
function Ky({ title: f, mode: h, onMode: d, onLibrary: s, onUpright: S, onSave: D, onUndo: O, onRedo: Y, onReset: C, onRemove: z, onHelp: F, egadOpen: B, onEgad: Z }) {
  const te = L.useRef(null);
  L.useEffect(() => {
    const X = document.querySelector("main > .toolbar");
    X && te.current && X.parentElement !== te.current && te.current.append(X);
  }, []), Qy();
  const k = (X, re, ue, Le = {}) => /* @__PURE__ */ c.createElement("button", { type: "button", onClick: re, title: X, ...Le }, ue && /* @__PURE__ */ c.createElement(ue, { size: 18 }), /* @__PURE__ */ c.createElement("span", { className: "hl-tool-label" }, X));
  return /* @__PURE__ */ c.createElement(c.Fragment, null, /* @__PURE__ */ c.createElement("div", { className: "hl-practice-head" }, /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-back", onClick: s }, "‹ Thư viện"), /* @__PURE__ */ c.createElement("h1", { className: "hl-practice-title" }, f), /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-egad-toggle", "aria-controls": "egad-dock", "aria-expanded": B, onClick: Z }, /* @__PURE__ */ c.createElement(Tm, { size: 18 }), "EGAD")), /* @__PURE__ */ c.createElement("nav", { className: "lab-mouse-toolbar", "aria-label": "Công cụ thực hành" }, /* @__PURE__ */ c.createElement("div", { className: "hl-tool-group mode-switch", role: "group", "aria-label": "Chế độ chuột" }, Zy.map(([X, re]) => /* @__PURE__ */ c.createElement("button", { type: "button", key: X, "aria-pressed": h === X, onClick: () => d(X) }, re))), /* @__PURE__ */ c.createElement("div", { className: "hl-tool-group", role: "group", "aria-label": "Chỉnh sửa" }, k("Dựng thẳng", S, Ly), k("Hoàn tác", O, By), k("Làm lại", Y, Ry), k("Bắt đầu lại", C, Am), k("Xóa vật", z, xy), k("Lưu", D, Uy)), /* @__PURE__ */ c.createElement("div", { className: "hl-tool-group hl-lab-tools", ref: te, role: "group", "aria-label": "Kho, camera và hiển thị" }), k("Trợ giúp", F, Hy, { className: "hl-help-btn" })), /* @__PURE__ */ c.createElement("div", { className: "mouse-hint" }, Vy[h], " · Chuột phải + kéo: nghiêng nhanh"));
}
class cm extends Error {
  // code: backend error_code (or 'network'); retryable: show "Thử chấm lại"
  constructor(h, { code: d = "unknown", retryable: s = !1, status: S = 0 } = {}) {
    super(h), Object.assign(this, { code: d, retryable: s, status: S });
  }
}
async function Fy(f, h) {
  let d;
  try {
    d = await fetch(f, h);
  } catch {
    throw new cm('Không kết nối được backend. Đã chạy "python server.py" trong thư mục backend chưa?', { code: "network", retryable: !0 });
  }
  let s = null;
  try {
    s = await d.json();
  } catch {
  }
  if (!d.ok)
    throw new cm(s?.error ?? `Backend trả lỗi HTTP ${d.status}.`, {
      code: s?.error_code ?? "unknown",
      retryable: s?.retryable === !0,
      status: d.status
    });
  return s;
}
const Jy = (f) => Fy("/api/egad/assess", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(f)
}), lc = 1e3, wy = {
  correct: { text: "Đúng", tone: "ok" },
  incomplete: { text: "Chưa đầy đủ", tone: "warn" },
  misconception: { text: "Hiểu sai", tone: "bad" },
  insufficient: { text: "Chưa đủ thông tin", tone: "muted" }
};
function Bf(f) {
  return wy[f] ?? { text: String(f), tone: "muted" };
}
function Wy(f) {
  return f.trim().length === 0 ? "Hãy nhập câu trả lời." : f.length > lc ? `Tối đa ${lc} ký tự (đang ${f.length}).` : null;
}
function $y() {
  return (globalThis.crypto?.randomUUID?.() ?? `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`).slice(0, 64);
}
function Iy({ lessonId: f, questionId: h, sessionId: d, answer: s }) {
  const S = { lesson: f, answer: s.trim(), consent: !0 };
  return h && (S.question_id = h), d && (S.session_id = d), S;
}
function Py(f) {
  return Object.fromEntries((f?.concepts || []).map((h) => [h.id, h.name ?? h.title ?? h.id]));
}
const e1 = "Dự đoán của AI, chưa được giáo viên xác nhận.";
let t1 = null;
const l1 = () => t1 ??= fetch("/data/egad-rubrics.json").then((f) => f.ok ? f.json() : {}).catch(() => ({}));
let a1 = 0;
const La = () => `m${++a1}`;
function im(f) {
  const h = dm(f), d = [{ id: La(), kind: "intro" }];
  return h.length && d.push({ id: La(), kind: "question", qid: h[0].id, text: h[0].text, n: 1, total: h.length }), { messages: d, question: 0 };
}
function n1({ result: f, names: h }) {
  const d = Bf(f.label);
  return /* @__PURE__ */ c.createElement(c.Fragment, null, /* @__PURE__ */ c.createElement("p", null, f.feedback), /* @__PURE__ */ c.createElement("p", { className: "hl-ai-note" }, e1), /* @__PURE__ */ c.createElement("details", { className: "hl-msg-details" }, /* @__PURE__ */ c.createElement("summary", null, "Xem nhận xét chi tiết"), /* @__PURE__ */ c.createElement("p", null, "Nhận định chung: ", /* @__PURE__ */ c.createElement("span", { className: `hl-label hl-label-${d.tone}` }, d.text)), /* @__PURE__ */ c.createElement("ul", null, (f.concepts || []).map((s) => {
    const S = Bf(s.label);
    return /* @__PURE__ */ c.createElement("li", { key: s.id }, /* @__PURE__ */ c.createElement("strong", null, h[s.id] || s.id), " ", /* @__PURE__ */ c.createElement("span", { className: `hl-label hl-label-${S.tone}` }, S.text), s.reason && /* @__PURE__ */ c.createElement("span", { className: "hl-msg-reason" }, s.reason), s.evidence?.length > 0 && /* @__PURE__ */ c.createElement("span", { className: "hl-msg-evidence" }, "Trích từ câu trả lời: “", s.evidence.join("”; “"), "”"));
  })), f.source && /* @__PURE__ */ c.createElement("p", { className: "hl-muted" }, "Nguồn: ", f.source)));
}
function u1({ lesson: f, onClose: h, onOpenRubric: d, onLibrary: s }) {
  const [, S] = L.useReducer((R) => R + 1, 0), [D, O] = L.useState(""), [Y, C] = L.useState(""), [z, F] = L.useState({}), B = L.useRef(null), Z = f?.id || null, te = dm(f);
  L.useEffect(() => vm(S), []), L.useEffect(() => {
    f && (l1().then((R) => F(Py(R[f.id]))), ec(f.id).messages.length || Ra(f.id, () => im(f)), O(""), C(""));
  }, [Z]);
  const k = Z ? ec(Z) : null, X = k?.messages || [], re = !!k?.pending, ue = yy();
  L.useEffect(() => {
    B.current && (B.current.scrollTop = B.current.scrollHeight);
  }, [X.length, re]);
  async function Le(R, oe, qe) {
    const at = k.sessionId || $y(), Be = (/* @__PURE__ */ new Date()).toISOString();
    Ra(Z, (Ae) => ({
      sessionId: at,
      pending: qe,
      messages: Ae.messages.some((Fe) => Fe.id === qe) ? Ae.messages : [...Ae.messages, { id: qe, kind: "answer", text: R, qid: oe, at: Be }]
    }));
    let Ze;
    try {
      const Ae = await Jy(Iy({ lessonId: Z, questionId: oe, sessionId: at, answer: R }));
      Ze = { id: La(), kind: "result", answerId: qe, result: Ae };
    } catch (Ae) {
      Ze = { id: La(), kind: "error", answerId: qe, text: R, qid: oe, error: { message: Ae.message, code: Ae.code || "unknown", retryable: Ae.retryable === !0 } };
    }
    Ra(Z, (Ae) => ({ pending: null, messages: [...Ae.messages, Ze] }));
  }
  function De() {
    if (re) return;
    if (!ue) {
      C("Hãy đánh dấu đồng ý trước khi gửi.");
      return;
    }
    const R = Wy(D);
    if (R) {
      C(R);
      return;
    }
    const oe = te[k.question];
    C(""), O(""), Le(D.trim(), oe?.id, La());
  }
  function Oe(R) {
    re || (Ra(Z, (oe) => ({ messages: oe.messages.map((qe) => qe.id === R.id ? { ...qe, retried: !0 } : qe) })), Le(R.text, R.qid, R.answerId));
  }
  function V() {
    if (!te.length || re) return;
    const R = (k.question + 1) % te.length, oe = te[R];
    Ra(Z, (qe) => ({ question: R, messages: [...qe.messages, { id: La(), kind: "question", qid: oe.id, text: oe.text, n: R + 1, total: te.length }] }));
  }
  function pe() {
    re || Ra(Z, () => ({ ...im(f), sessionId: null }));
  }
  const I = te[k?.question ?? 0];
  return /* @__PURE__ */ c.createElement(
    "section",
    {
      className: "hl-chat",
      "aria-labelledby": "hl-chat-title",
      onKeyDown: (R) => {
        R.key === "Escape" && matchMedia("(max-width: 900px)").matches && h();
      }
    },
    /* @__PURE__ */ c.createElement("header", { className: "hl-chat-head" }, /* @__PURE__ */ c.createElement(Em, { size: 42 }), /* @__PURE__ */ c.createElement("div", null, /* @__PURE__ */ c.createElement("h2", { id: "hl-chat-title" }, "EGAD"), /* @__PURE__ */ c.createElement("p", null, "Trợ lý giải thích hiện tượng")), /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-icon-btn", onClick: h, "aria-label": "Thu gọn khung EGAD", title: "Thu gọn" }, /* @__PURE__ */ c.createElement(zm, null))),
    f ? /* @__PURE__ */ c.createElement(c.Fragment, null, /* @__PURE__ */ c.createElement("div", { className: "hl-chat-log", ref: B, role: "log", "aria-live": "polite", "aria-label": "Hội thoại với EGAD" }, X.map((R) => R.kind === "intro" ? /* @__PURE__ */ c.createElement("div", { key: R.id, className: "hl-msg hl-msg-egad" }, /* @__PURE__ */ c.createElement("p", null, "Chào bạn! Sau khi quan sát hiện tượng, hãy giải thích bằng lời của bạn."), /* @__PURE__ */ c.createElement("p", { className: "hl-ai-note" }, "Mỗi câu trả lời được phân tích riêng: EGAD chưa nhớ các câu trả lời trước.")) : R.kind === "question" ? /* @__PURE__ */ c.createElement("div", { key: R.id, className: "hl-msg hl-msg-egad hl-msg-question" }, /* @__PURE__ */ c.createElement("span", { className: "hl-msg-tag" }, "Câu hỏi ", R.n, "/", R.total), /* @__PURE__ */ c.createElement("p", null, R.text)) : R.kind === "answer" ? /* @__PURE__ */ c.createElement("div", { key: R.id, className: "hl-msg hl-msg-student" }, /* @__PURE__ */ c.createElement("span", { className: "hl-sr" }, "Bạn trả lời: "), /* @__PURE__ */ c.createElement("p", null, R.text)) : R.kind === "result" ? /* @__PURE__ */ c.createElement("div", { key: R.id, className: "hl-msg hl-msg-egad" }, /* @__PURE__ */ c.createElement("span", { className: "hl-sr" }, "EGAD phản hồi: "), /* @__PURE__ */ c.createElement(n1, { result: R.result, names: z })) : R.kind === "error" ? /* @__PURE__ */ c.createElement("div", { key: R.id, className: "hl-msg hl-msg-error", role: "alert" }, /* @__PURE__ */ c.createElement("p", null, R.error.message), Ph(R.error) && /* @__PURE__ */ c.createElement("p", null, "EGAD chưa dùng được mô hình trên máy chủ này. Bạn vẫn có thể tự kiểm tra bằng bảng tiêu chí của bài."), /* @__PURE__ */ c.createElement("div", { className: "hl-msg-actions" }, R.error.retryable && !R.retried && /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-btn hl-btn-ghost hl-btn-sm", onClick: () => Oe(R), disabled: re }, /* @__PURE__ */ c.createElement(Am, { size: 16 }), " Thử lại"), Ph(R.error) && /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-btn hl-btn-quiet hl-btn-sm", onClick: d }, "Mở bảng tiêu chí"))) : null), re && /* @__PURE__ */ c.createElement("div", { className: "hl-msg hl-msg-egad hl-msg-pending", "aria-busy": "true" }, /* @__PURE__ */ c.createElement("p", null, "EGAD đang đọc câu trả lời…"))), /* @__PURE__ */ c.createElement("div", { className: "hl-chat-compose" }, /* @__PURE__ */ c.createElement("label", { className: "hl-consent" }, /* @__PURE__ */ c.createElement("input", { type: "checkbox", checked: ue, onChange: (R) => {
      vy(R.target.checked), C("");
    } }), /* @__PURE__ */ c.createElement("span", null, "Tôi đồng ý gửi câu trả lời tới EGAD chạy trên máy chủ của lớp để phân tích. Không nhập họ tên hay thông tin cá nhân.")), /* @__PURE__ */ c.createElement("div", { className: "hl-chat-q" }, /* @__PURE__ */ c.createElement("span", null, I ? `Đang trả lời câu ${k.question + 1}/${te.length}` : "Bài này chưa có câu hỏi"), te.length > 1 && /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-link-btn", onClick: V, disabled: re }, "Câu hỏi khác")), /* @__PURE__ */ c.createElement("div", { className: "hl-chat-input" }, /* @__PURE__ */ c.createElement(
      "textarea",
      {
        "aria-label": "Câu trả lời của bạn",
        placeholder: "Giải thích bằng lời của bạn…",
        rows: 3,
        maxLength: lc,
        value: D,
        onChange: (R) => {
          O(R.target.value), Y && C("");
        },
        onKeyDown: (R) => {
          dy(R) === "send" && (R.preventDefault(), De());
        }
      }
    ), /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-btn hl-btn-primary hl-chat-send", onClick: De, disabled: re || !ue || !D.trim(), "aria-label": "Gửi câu trả lời" }, /* @__PURE__ */ c.createElement(qy, { size: 20 }), /* @__PURE__ */ c.createElement("span", null, "Gửi"))), Y && /* @__PURE__ */ c.createElement("p", { className: "hl-chat-problem", role: "alert" }, Y), /* @__PURE__ */ c.createElement("div", { className: "hl-chat-foot" }, /* @__PURE__ */ c.createElement("span", null, "Enter để gửi · Shift+Enter xuống dòng · ", D.length, "/", lc), /* @__PURE__ */ c.createElement("span", { className: "hl-chat-links" }, /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-link-btn", onClick: d }, "Bảng tiêu chí"), /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-link-btn", onClick: pe, disabled: re || X.length <= 2 }, "Xóa hội thoại"))))) : /* @__PURE__ */ c.createElement("div", { className: "hl-chat-empty" }, /* @__PURE__ */ c.createElement("p", null, "EGAD đặt câu hỏi theo từng bài thực hành. Hãy chọn một bài trong thư viện để bắt đầu giải thích cùng EGAD."), /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-btn hl-btn-ghost hl-btn-sm", onClick: s }, /* @__PURE__ */ c.createElement(kf, { size: 18 }), " Mở thư viện"))
  );
}
const c1 = [
  [Oy, "Thực hành trực quan", "Tương tác với dụng cụ và hóa chất 3D bằng chuột, hoặc bằng bàn tay trước webcam."],
  [Tm, "Giải thích cùng EGAD", "Viết cách bạn hiểu hiện tượng, nhận câu hỏi gợi mở để làm rõ. Phản hồi là dự đoán của AI, chưa được giáo viên xác nhận."],
  [bm, "Nhìn lại tiến trình", "Mở lại các phiên đã lưu và những gì bạn đã làm, để biết phần nào cần ôn thêm."]
], fm = ["Chọn thí nghiệm", "Thực hành", "Giải thích", "Vận dụng"];
function rm({ fill: f, className: h = "" }) {
  return /* @__PURE__ */ c.createElement("svg", { className: "hl-wave " + h, viewBox: "0 0 1440 80", preserveAspectRatio: "none", "aria-hidden": "true" }, /* @__PURE__ */ c.createElement("path", { d: "M0 46C200 6 380 4 580 36s360 44 560 10 240-30 300-14v102H0z", fill: f }));
}
function i1({ lessonCount: f, onHelp: h }) {
  return /* @__PURE__ */ c.createElement("div", { className: "hl-intro" }, /* @__PURE__ */ c.createElement("section", { className: "hl-hero", "aria-labelledby": "hl-hero-title" }, /* @__PURE__ */ c.createElement("div", { className: "hl-hero-text" }, /* @__PURE__ */ c.createElement("p", { className: "hl-eyebrow" }, "Phòng thí nghiệm Hóa học ảo cho THPT"), /* @__PURE__ */ c.createElement("h1", { id: "hl-hero-title" }, "Tự tay khám phá.", /* @__PURE__ */ c.createElement("br", null), /* @__PURE__ */ c.createElement("span", null, "Tự mình hiểu sâu.")), /* @__PURE__ */ c.createElement("p", { className: "hl-lead" }, "Thực hành thí nghiệm 3D, giải thích hiện tượng cùng EGAD và nhìn lại quá trình học của bạn."), /* @__PURE__ */ c.createElement("div", { className: "hl-actions" }, /* @__PURE__ */ c.createElement("a", { className: "hl-btn hl-btn-primary hl-btn-lg", href: ve.overview }, "Bắt đầu học"), /* @__PURE__ */ c.createElement("a", { className: "hl-btn hl-btn-ghost hl-btn-lg", href: ve.experiments }, "Khám phá thí nghiệm")), f > 0 && /* @__PURE__ */ c.createElement("p", { className: "hl-hero-note" }, f, " bài thực hành lớp 10–12 · Chạy offline trên máy của bạn")), /* @__PURE__ */ c.createElement(My, null)), /* @__PURE__ */ c.createElement(rm, { fill: "#E7EEDC" }), /* @__PURE__ */ c.createElement("section", { className: "hl-band hl-band-sage", "aria-labelledby": "hl-about-title" }, /* @__PURE__ */ c.createElement("div", { className: "hl-about" }, /* @__PURE__ */ c.createElement(Ty, null), /* @__PURE__ */ c.createElement("div", null, /* @__PURE__ */ c.createElement("h2", { id: "hl-about-title" }, "Một không gian để thử, hỏi và hiểu"), /* @__PURE__ */ c.createElement("p", null, "Ở HoloLab, bạn tự rót, trộn và quan sát: kết tủa xuất hiện, dung dịch đổi màu, khí thoát ra. Lượng chất được tính toán và bảo toàn, nên mỗi thao tác đều có hệ quả."), /* @__PURE__ */ c.createElement("p", null, "Sau khi quan sát, bạn viết lời giải thích của mình. EGAD không đưa đáp án ngay mà đặt câu hỏi gợi mở, giúp bạn tự nhận ra chỗ còn thiếu."), /* @__PURE__ */ c.createElement("p", { className: "hl-fineprint" }, "Đây là mô hình giáo dục có giới hạn, không thay thế thí nghiệm thật và hướng dẫn an toàn của giáo viên.")))), /* @__PURE__ */ c.createElement("section", { className: "hl-band hl-band-sage", "aria-labelledby": "hl-features-title" }, /* @__PURE__ */ c.createElement("h2", { id: "hl-features-title", className: "hl-center" }, "Học bằng cách làm, rồi tự giải thích"), /* @__PURE__ */ c.createElement("ul", { className: "hl-features" }, c1.map(([d, s, S], D) => /* @__PURE__ */ c.createElement("li", { key: s }, /* @__PURE__ */ c.createElement("span", { className: "hl-feature-icon hl-tint-" + D }, /* @__PURE__ */ c.createElement(d, { size: 30 })), /* @__PURE__ */ c.createElement("h3", null, s), /* @__PURE__ */ c.createElement("p", null, S))))), /* @__PURE__ */ c.createElement(rm, { fill: "#FAF8F1", className: "hl-wave-on-sage" }), /* @__PURE__ */ c.createElement("section", { className: "hl-band", "aria-labelledby": "hl-steps-title" }, /* @__PURE__ */ c.createElement("h2", { id: "hl-steps-title", className: "hl-center" }, "Một bài thực hành diễn ra thế nào"), /* @__PURE__ */ c.createElement("ol", { className: "hl-steps" }, fm.map((d, s) => /* @__PURE__ */ c.createElement("li", { key: d }, /* @__PURE__ */ c.createElement("span", { className: "hl-step-num" }, s + 1), /* @__PURE__ */ c.createElement("strong", null, d), s < fm.length - 1 && /* @__PURE__ */ c.createElement(Mm, { size: 20 }))))), /* @__PURE__ */ c.createElement("section", { className: "hl-band", "aria-labelledby": "hl-cta-title" }, /* @__PURE__ */ c.createElement("div", { className: "hl-cta" }, /* @__PURE__ */ c.createElement(Em, { size: 72 }), /* @__PURE__ */ c.createElement("div", null, /* @__PURE__ */ c.createElement("h2", { id: "hl-cta-title" }, "Sẵn sàng bắt đầu thí nghiệm đầu tiên?"), /* @__PURE__ */ c.createElement("p", null, "Chọn một bài, đọc mục tiêu, rồi bắt tay vào làm.")), /* @__PURE__ */ c.createElement("a", { className: "hl-btn hl-btn-primary hl-btn-lg", href: ve.experiments }, "Vào thư viện thí nghiệm"))), /* @__PURE__ */ c.createElement("footer", { className: "hl-footer" }, /* @__PURE__ */ c.createElement("div", { className: "hl-footer-brand" }, /* @__PURE__ */ c.createElement("span", { className: "hl-brand" }, /* @__PURE__ */ c.createElement(gm, null), /* @__PURE__ */ c.createElement("span", null, /* @__PURE__ */ c.createElement("strong", null, "HoloLab"), /* @__PURE__ */ c.createElement("small", null, "Phòng thí nghiệm Hóa học ảo"))), /* @__PURE__ */ c.createElement("p", null, "Thực hành an toàn, quan sát kỹ và tự giải thích hiện tượng.")), /* @__PURE__ */ c.createElement("nav", { "aria-label": "Liên kết chân trang" }, /* @__PURE__ */ c.createElement("h3", null, "Khám phá"), /* @__PURE__ */ c.createElement("a", { href: ve.intro }, "Giới thiệu"), /* @__PURE__ */ c.createElement("a", { href: ve.overview }, "Học tập"), /* @__PURE__ */ c.createElement("button", { type: "button", onClick: h }, "Hướng dẫn thao tác")), /* @__PURE__ */ c.createElement("div", null, /* @__PURE__ */ c.createElement("h3", null, "Quyền riêng tư"), /* @__PURE__ */ c.createElement("p", null, "Hình ảnh webcam chỉ được xử lý trên máy này, không lưu và không gửi đi. Phiên đã lưu nằm trong trình duyệt của bạn.")), /* @__PURE__ */ c.createElement("p", { className: "hl-copy" }, "© 2026 HoloLab")));
}
const ac = "Lưu trên trình duyệt này";
function jf({ title: f, text: h, action: d }) {
  return /* @__PURE__ */ c.createElement("div", { className: "hl-empty" }, /* @__PURE__ */ c.createElement(Ay, null), /* @__PURE__ */ c.createElement("h3", null, f), h && /* @__PURE__ */ c.createElement("p", null, h), d);
}
function f1({ lessons: f, saved: h, onOpenSaved: d, user: s }) {
  const S = h[0], D = f.filter((O) => O.status === "ready");
  return /* @__PURE__ */ c.createElement("div", { className: "hl-page" }, /* @__PURE__ */ c.createElement("header", { className: "hl-page-head" }, /* @__PURE__ */ c.createElement("h1", null, s ? `Chào ${s.username}!` : "Chào bạn!"), /* @__PURE__ */ c.createElement("p", null, "Hôm nay bạn muốn thử thí nghiệm nào?")), /* @__PURE__ */ c.createElement("div", { className: "hl-overview" }, /* @__PURE__ */ c.createElement("section", { className: "hl-panel hl-continue", "aria-labelledby": "hl-continue-title" }, /* @__PURE__ */ c.createElement("h2", { id: "hl-continue-title" }, "Tiếp tục"), S ? /* @__PURE__ */ c.createElement("div", { className: "hl-continue-body" }, /* @__PURE__ */ c.createElement(Yf, { index: Math.max(0, D.findIndex((O) => O.id === nc(S))) }), /* @__PURE__ */ c.createElement("div", null, /* @__PURE__ */ c.createElement("strong", null, S.name), /* @__PURE__ */ c.createElement("span", { className: "hl-muted" }, tc(S), " · ", S.date), /* @__PURE__ */ c.createElement("span", { className: "hl-chip hl-chip-quiet" }, ac)), /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-btn hl-btn-primary", onClick: () => d(S) }, "Tiếp tục")) : /* @__PURE__ */ c.createElement(
    jf,
    {
      title: "Bạn chưa có phiên nào được lưu",
      text: "Khi thực hành, bấm “Lưu” để có thể quay lại làm tiếp.",
      action: /* @__PURE__ */ c.createElement("a", { className: "hl-btn hl-btn-primary", href: ve.experiments }, "Chọn thí nghiệm đầu tiên")
    }
  )), /* @__PURE__ */ c.createElement("section", { className: "hl-panel hl-shortcut", "aria-labelledby": "hl-shortcut-title" }, /* @__PURE__ */ c.createElement("span", { className: "hl-feature-icon hl-tint-1" }, /* @__PURE__ */ c.createElement(kf, { size: 28 })), /* @__PURE__ */ c.createElement("h2", { id: "hl-shortcut-title" }, "Thư viện thí nghiệm"), /* @__PURE__ */ c.createElement("p", null, D.length, " bài thực hành lớp 10–12, có mục tiêu và các bước cho từng bài."), /* @__PURE__ */ c.createElement("a", { className: "hl-btn hl-btn-ghost", href: ve.experiments }, "Mở thư viện ", /* @__PURE__ */ c.createElement(Mm, { size: 18 }))), /* @__PURE__ */ c.createElement("section", { className: "hl-panel hl-recent", "aria-labelledby": "hl-recent-title" }, /* @__PURE__ */ c.createElement("div", { className: "hl-panel-head" }, /* @__PURE__ */ c.createElement("h2", { id: "hl-recent-title" }, "Hoạt động gần đây"), /* @__PURE__ */ c.createElement("span", { className: "hl-muted" }, ac)), h.length ? /* @__PURE__ */ c.createElement("ul", { className: "hl-list" }, h.slice(0, 5).map((O, Y) => /* @__PURE__ */ c.createElement("li", { key: Y }, /* @__PURE__ */ c.createElement("div", null, /* @__PURE__ */ c.createElement("strong", null, O.name), /* @__PURE__ */ c.createElement("span", { className: "hl-muted" }, tc(O), " · ", O.date)), /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-btn hl-btn-ghost hl-btn-sm", onClick: () => d(O) }, "Mở lại")))) : /* @__PURE__ */ c.createElement("p", { className: "hl-muted" }, "Chưa có hoạt động nào trên trình duyệt này."))));
}
function r1({ lessons: f, stocks: h, saved: d, onPreview: s, onOpenSaved: S, onFree: D, notice: O }) {
  const [Y, C] = L.useState(""), [z, F] = L.useState("all"), [B, Z] = L.useState("all"), te = !f.length, k = L.useMemo(() => f.filter((V) => V.status === "ready"), [f]), X = L.useMemo(() => Ey(f, h), [f, h]), re = L.useMemo(() => by(k), [k]), ue = L.useMemo(() => py(f, { query: Y, grade: z, topic: B }, X), [f, Y, z, B, X]), Le = Y.trim() !== "" || z !== "all" || B !== "all", De = () => {
    C(""), F("all"), Z("all");
  }, Oe = (V) => d.find((pe) => nc(pe) === V);
  return /* @__PURE__ */ c.createElement("div", { className: "hl-page" }, /* @__PURE__ */ c.createElement("header", { className: "hl-page-head hl-page-head-row" }, /* @__PURE__ */ c.createElement("div", null, /* @__PURE__ */ c.createElement("h1", null, "Thư viện thí nghiệm"), /* @__PURE__ */ c.createElement("p", null, "Chọn một bài để xem mục tiêu và các bước, rồi bắt đầu thực hành trên bàn thí nghiệm 3D.")), /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-btn hl-btn-ghost", onClick: D }, "＋ Bàn thí nghiệm mới")), O && /* @__PURE__ */ c.createElement("p", { className: "hl-notice", role: "status" }, O), d.length > 0 && /* @__PURE__ */ c.createElement("section", { className: "hl-saved-strip", "aria-labelledby": "hl-saved-title" }, /* @__PURE__ */ c.createElement("h2", { id: "hl-saved-title" }, "Tiếp tục phiên đã lưu ", /* @__PURE__ */ c.createElement("span", { className: "hl-muted" }, "· ", ac)), /* @__PURE__ */ c.createElement("div", null, d.slice(0, 4).map((V, pe) => /* @__PURE__ */ c.createElement("button", { type: "button", className: "saved-session", key: pe, onClick: () => S(V) }, /* @__PURE__ */ c.createElement("strong", null, V.name), /* @__PURE__ */ c.createElement("small", null, tc(V), " · ", V.date))))), /* @__PURE__ */ c.createElement("div", { className: "hl-filters", role: "search" }, /* @__PURE__ */ c.createElement("label", { className: "hl-search" }, /* @__PURE__ */ c.createElement(Dy, null), /* @__PURE__ */ c.createElement("input", { type: "search", "aria-label": "Tìm thí nghiệm", placeholder: "Tìm theo tên bài, chủ đề hoặc hóa chất…", value: Y, onChange: (V) => C(V.target.value) })), /* @__PURE__ */ c.createElement("select", { "aria-label": "Lọc lớp", value: z, onChange: (V) => F(V.target.value) }, /* @__PURE__ */ c.createElement("option", { value: "all" }, "Tất cả lớp"), [10, 11, 12].map((V) => /* @__PURE__ */ c.createElement("option", { key: V, value: V }, "Lớp ", V))), /* @__PURE__ */ c.createElement("select", { "aria-label": "Lọc chủ đề", value: B, onChange: (V) => Z(V.target.value) }, /* @__PURE__ */ c.createElement("option", { value: "all" }, "Tất cả chủ đề"), re.map((V) => /* @__PURE__ */ c.createElement("option", { key: V, value: V }, V))), Le && /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-btn hl-btn-quiet", onClick: De }, "Xóa bộ lọc")), !te && /* @__PURE__ */ c.createElement("p", { className: "hl-count", "aria-live": "polite" }, "Hiển thị ", ue.length, "/", k.length, " bài"), te ? /* @__PURE__ */ c.createElement("ul", { className: "hl-rows", "aria-busy": "true", "aria-label": "Đang tải danh sách thí nghiệm" }, [0, 1, 2].map((V) => /* @__PURE__ */ c.createElement("li", { key: V, className: "hl-row hl-skeleton" }, /* @__PURE__ */ c.createElement("span", null), /* @__PURE__ */ c.createElement("span", null), /* @__PURE__ */ c.createElement("span", null)))) : ue.length ? /* @__PURE__ */ c.createElement("ul", { className: "hl-rows" }, ue.map((V) => {
    const pe = k.indexOf(V), I = Oe(V.id), R = X[V.id] || [];
    return /* @__PURE__ */ c.createElement("li", { key: V.id }, /* @__PURE__ */ c.createElement("article", { className: "hl-row experiment-card", onClick: (oe) => {
      oe.target.closest("button") || s(V);
    } }, /* @__PURE__ */ c.createElement(Yf, { index: pe }), /* @__PURE__ */ c.createElement("div", { className: "hl-row-body" }, /* @__PURE__ */ c.createElement("h3", null, V.title), /* @__PURE__ */ c.createElement("p", { className: "hl-clamp" }, V.objective), /* @__PURE__ */ c.createElement("div", { className: "hl-tags" }, /* @__PURE__ */ c.createElement("span", { className: "hl-chip" }, "Lớp ", V.grade), /* @__PURE__ */ c.createElement("span", { className: "hl-chip hl-chip-quiet" }, V.topic), V.curriculum?.verified === !1 && /* @__PURE__ */ c.createElement("span", { className: "hl-chip hl-chip-warn" }, "Phân lớp đề xuất")), R.length > 0 && /* @__PURE__ */ c.createElement("p", { className: "hl-chem" }, "Hóa chất: ", R.map((oe) => oe.name).join(", "))), /* @__PURE__ */ c.createElement("div", { className: "hl-row-actions" }, I && /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-btn hl-btn-ghost hl-btn-sm", onClick: () => S(I) }, "Học tiếp"), /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-btn hl-btn-primary hl-btn-sm", onClick: () => s(V), "aria-label": `Bắt đầu: ${V.title}` }, "Bắt đầu"))));
  })) : /* @__PURE__ */ c.createElement(
    jf,
    {
      title: "Không tìm thấy thí nghiệm phù hợp",
      text: "Thử từ khóa khác, ví dụ tên một hóa chất như “NaOH” hoặc “bạc”.",
      action: /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-btn hl-btn-primary", onClick: De }, "Xóa bộ lọc")
    }
  ));
}
function s1({ turn: f }) {
  const h = f.result ? Bf(f.result.label) : null;
  return /* @__PURE__ */ c.createElement("li", { className: "hl-turn" }, f.question && /* @__PURE__ */ c.createElement("p", { className: "hl-turn-q" }, f.question), /* @__PURE__ */ c.createElement("p", { className: "hl-turn-a" }, /* @__PURE__ */ c.createElement("span", { className: "hl-muted" }, "Bạn trả lời:"), " ", f.answer), f.result ? /* @__PURE__ */ c.createElement("div", { className: "hl-turn-r" }, /* @__PURE__ */ c.createElement("p", null, /* @__PURE__ */ c.createElement("span", { className: "hl-muted" }, "EGAD:"), " ", f.result.feedback), /* @__PURE__ */ c.createElement("p", { className: "hl-ai-note" }, "Nhận định: ", /* @__PURE__ */ c.createElement("span", { className: `hl-label hl-label-${h.tone}` }, h.text), " · Dự đoán của AI, chưa được giáo viên xác nhận.")) : f.error ? /* @__PURE__ */ c.createElement("p", { className: "hl-turn-r hl-muted" }, "Chưa phân tích được: ", f.error.message) : /* @__PURE__ */ c.createElement("p", { className: "hl-turn-r hl-muted" }, "Đang chờ phản hồi…"));
}
function o1({ data: f, onOpenSaved: h }) {
  const { sessions: d, live: s } = f, [S, D] = L.useState(null);
  return /* @__PURE__ */ c.createElement("div", { className: "hl-page" }, /* @__PURE__ */ c.createElement("header", { className: "hl-page-head" }, /* @__PURE__ */ c.createElement("h1", null, "Lịch sử học"), /* @__PURE__ */ c.createElement("p", null, "Các phiên thực hành bạn đã lưu và các câu trả lời EGAD trong lần mở trang này. Lưu trên máy chủ và hội thoại EGAD đầy đủ sẽ có khi máy chủ hỗ trợ phiên học.")), s.length > 0 && /* @__PURE__ */ c.createElement("section", { className: "hl-panel hl-live", "aria-labelledby": "hl-live-title" }, /* @__PURE__ */ c.createElement("div", { className: "hl-panel-head" }, /* @__PURE__ */ c.createElement("h2", { id: "hl-live-title" }, "Câu trả lời EGAD trong lần mở trang này"), /* @__PURE__ */ c.createElement("span", { className: "hl-chip hl-chip-warn" }, "Chưa lưu · mất khi tải lại trang")), s.map((O) => /* @__PURE__ */ c.createElement("details", { key: O.lessonId, className: "hl-live-group" }, /* @__PURE__ */ c.createElement("summary", null, /* @__PURE__ */ c.createElement("strong", null, O.lesson?.title || O.lessonId), " ", /* @__PURE__ */ c.createElement("span", { className: "hl-muted" }, "· ", O.turns.length, " câu trả lời")), /* @__PURE__ */ c.createElement("ol", { className: "hl-turns" }, O.turns.map((Y) => /* @__PURE__ */ c.createElement(s1, { key: Y.id, turn: Y })))))), d.length ? /* @__PURE__ */ c.createElement("ul", { className: "hl-rows" }, d.map((O) => {
    const Y = S === O.key, C = `hl-session-${O.key}`;
    return /* @__PURE__ */ c.createElement("li", { key: O.key }, /* @__PURE__ */ c.createElement("article", { className: "hl-row hl-history-row" }, /* @__PURE__ */ c.createElement("div", { className: "hl-row-body" }, /* @__PURE__ */ c.createElement("h3", null, O.title), /* @__PURE__ */ c.createElement("p", { className: "hl-muted" }, O.date), /* @__PURE__ */ c.createElement("div", { className: "hl-tags" }, /* @__PURE__ */ c.createElement("span", { className: "hl-chip" }, O.status), /* @__PURE__ */ c.createElement("span", { className: "hl-chip hl-chip-quiet" }, ac))), /* @__PURE__ */ c.createElement("div", { className: "hl-row-actions" }, /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-btn hl-btn-ghost hl-btn-sm", "aria-expanded": Y, "aria-controls": C, onClick: () => D(Y ? null : O.key) }, Y ? "Ẩn chi tiết" : "Chi tiết"), /* @__PURE__ */ c.createElement("button", { type: "button", className: "hl-btn hl-btn-primary hl-btn-sm", onClick: () => h(O.raw) }, "Xem lại")), Y && /* @__PURE__ */ c.createElement("div", { className: "hl-session-detail", id: C }, /* @__PURE__ */ c.createElement("dl", null, /* @__PURE__ */ c.createElement("div", null, /* @__PURE__ */ c.createElement("dt", null, "Bài"), /* @__PURE__ */ c.createElement("dd", null, O.lesson ? `${O.lesson.title} · Lớp ${O.lesson.grade}` : "Bàn thí nghiệm tự do")), /* @__PURE__ */ c.createElement("div", null, /* @__PURE__ */ c.createElement("dt", null, "Trạng thái"), /* @__PURE__ */ c.createElement("dd", null, O.status)), /* @__PURE__ */ c.createElement("div", null, /* @__PURE__ */ c.createElement("dt", null, "Thời gian lưu"), /* @__PURE__ */ c.createElement("dd", null, O.date)), O.lesson?.objective && /* @__PURE__ */ c.createElement("div", null, /* @__PURE__ */ c.createElement("dt", null, "Mục tiêu"), /* @__PURE__ */ c.createElement("dd", null, O.lesson.objective)), /* @__PURE__ */ c.createElement("div", null, /* @__PURE__ */ c.createElement("dt", null, "EGAD"), /* @__PURE__ */ c.createElement("dd", null, "Phiên lưu trên trình duyệt chỉ gồm bàn thí nghiệm, không kèm câu trả lời EGAD."))))));
  })) : /* @__PURE__ */ c.createElement(
    jf,
    {
      title: "Chưa có phiên nào được lưu",
      text: "Lịch sử xuất hiện khi bạn bấm “Lưu” trong lúc thực hành.",
      action: /* @__PURE__ */ c.createElement("a", { className: "hl-btn hl-btn-primary", href: ve.experiments }, "Chọn thí nghiệm đầu tiên")
    }
  ));
}
function h1({ lesson: f, index: h = 0, onClose: d, onStart: s }) {
  return /* @__PURE__ */ c.createElement("div", { className: "preview-scrim", onClick: (S) => {
    S.target === S.currentTarget && d();
  } }, /* @__PURE__ */ c.createElement("section", { role: "dialog", "aria-modal": "true", "aria-label": "Xem trước thí nghiệm" }, /* @__PURE__ */ c.createElement("button", { type: "button", className: "preview-close", onClick: d }, "Đóng"), /* @__PURE__ */ c.createElement("div", { className: "hl-preview-head" }, /* @__PURE__ */ c.createElement(Yf, { index: h }), /* @__PURE__ */ c.createElement("div", null, /* @__PURE__ */ c.createElement("p", { className: "hl-eyebrow" }, "Lớp ", f.grade, " · ", f.topic), /* @__PURE__ */ c.createElement("h2", null, f.title))), /* @__PURE__ */ c.createElement("h3", null, "Mục tiêu"), /* @__PURE__ */ c.createElement("p", null, f.objective), /* @__PURE__ */ c.createElement("h3", null, "Các bước"), /* @__PURE__ */ c.createElement("ol", null, f.steps.map((S, D) => /* @__PURE__ */ c.createElement("li", { key: D }, S.replaceAll("Gắp", "Nhấc").replaceAll("thả tay", "thả chuột")))), /* @__PURE__ */ c.createElement("button", { type: "button", className: "primary hl-btn hl-btn-primary hl-btn-lg", onClick: s }, "Bắt đầu thực hành")));
}
const m1 = "/api/v1/auth", d1 = "hololab-consent-2026-11", y1 = "Tôi đồng ý để HoloLab lưu tên đăng nhập, câu trả lời và quá trình thực hành của tôi trên máy chủ của lớp, để giáo viên xem và để tôi xem lại. Dữ liệu được giữ tối đa 1 tháng và không gửi ra dịch vụ bên ngoài.", v1 = /^[a-z0-9_.-]{3,32}$/, Rf = 10, xf = 128;
class Cl extends Error {
  constructor(h, { code: d = "unknown", status: s = 0, retryAfter: S = null, field: D = null } = {}) {
    super(h), Object.assign(this, { code: d, status: s, retryAfter: S, field: D });
  }
}
const sm = "Chức năng đăng nhập chưa được kích hoạt trên máy chủ này. Bạn vẫn dùng được mọi thí nghiệm mà không cần tài khoản.", Nm = (f) => String(f).trim().toLowerCase();
function g1(f) {
  return f ? f.length < 3 || f.length > 32 ? "Tên đăng nhập dài 3–32 ký tự." : v1.test(f) ? null : "Chỉ dùng chữ thường không dấu, số và các dấu _ . -" : "Hãy nhập tên đăng nhập.";
}
function E1(f, h = "") {
  return f ? f.length < Rf ? `Mật khẩu cần ít nhất ${Rf} ký tự.` : f.length > xf ? `Mật khẩu tối đa ${xf} ký tự.` : h && f.toLowerCase().includes(h) ? "Mật khẩu không được chứa tên đăng nhập." : null : "Hãy nhập mật khẩu.";
}
function b1({ username: f, password: h }) {
  const d = {};
  return f || (d.username = "Hãy nhập tên đăng nhập."), h || (d.password = "Hãy nhập mật khẩu."), d;
}
function p1({ username: f, password: h, confirm: d, consent: s }) {
  const S = {}, D = g1(f);
  D && (S.username = D);
  const O = E1(h, f);
  return O && (S.password = O), d ? d !== h && (S.confirm = "Hai mật khẩu chưa khớp.") : S.confirm = "Hãy nhập lại mật khẩu.", s || (S.consent = "Cần đồng ý để tạo tài khoản."), S;
}
const om = {
  invalid_credentials: "Tên đăng nhập hoặc mật khẩu không đúng.",
  username_taken: "Tên đăng nhập này đã có người dùng. Hãy chọn tên khác.",
  account_disabled: "Tài khoản đã bị khóa. Hãy liên hệ giáo viên.",
  unauthenticated: "Bạn chưa đăng nhập hoặc phiên đã hết hạn.",
  forbidden: "Bạn không có quyền thực hiện thao tác này."
};
function S1(f, h) {
  const d = h?.error_code;
  if (d === "rate_limited") {
    const s = Number(h.retry_after_seconds), S = Number.isFinite(s) && s > 0 ? `${Math.ceil(s)} giây` : "một lúc";
    return new Cl(`Bạn đã thử quá nhiều lần. Hãy đợi ${S} rồi thử lại.`, { code: d, status: f, retryAfter: Number.isFinite(s) ? s : null });
  }
  if (d === "invalid_input" || d === "invalid_field") {
    const s = h?.details?.field ?? null;
    return new Cl(h?.error || "Thông tin chưa hợp lệ.", { code: d, status: f, field: s });
  }
  return om[d] ? new Cl(om[d], { code: d, status: f }) : new Cl(h?.error || `Máy chủ báo lỗi (HTTP ${f}). Hãy thử lại sau.`, { code: d || "unknown", status: f });
}
async function uc(f, { method: h = "GET", body: d, fetchImpl: s = globalThis.fetch } = {}) {
  let S;
  try {
    S = await s(`${m1}/${f}`, {
      method: h,
      credentials: "same-origin",
      // session cookie; never an Authorization header
      headers: d === void 0 ? { Accept: "application/json" } : { Accept: "application/json", "Content-Type": "application/json" },
      body: d === void 0 ? void 0 : JSON.stringify(d)
    });
  } catch {
    throw new Cl("Không kết nối được máy chủ HoloLab. Máy chủ (python server.py) còn chạy không?", { code: "network" });
  }
  if (S.status === 204) return null;
  const D = (S.headers?.get?.("Content-Type") || "").includes("application/json");
  let O = null;
  if (D)
    try {
      O = await S.json();
    } catch {
      O = null;
    }
  if ([404, 405, 501].includes(S.status) && !O?.error_code) throw new Cl(sm, { code: "not_enabled", status: S.status });
  if (S.ok && !D) throw new Cl(sm, { code: "not_enabled", status: S.status });
  if (!S.ok) throw S1(S.status, O);
  return O;
}
const Xf = (f) => {
  const h = f?.user;
  if (!h || typeof h.username != "string" || !["student", "teacher"].includes(h.role))
    throw new Cl("Máy chủ trả dữ liệu tài khoản không hợp lệ.", { code: "bad_response" });
  return { id: h.id, username: h.username, role: h.role, created_at: h.created_at ?? null };
};
async function z1({ username: f, password: h }, d) {
  return Xf(await uc("login", { method: "POST", body: { username: f, password: h }, ...d }));
}
async function M1({ username: f, password: h }, d) {
  return Xf(await uc("register", { method: "POST", body: { username: f, password: h, consent: { version: d1 } }, ...d }));
}
async function T1(f) {
  try {
    await uc("logout", { method: "POST", body: {}, ...f });
  } catch (h) {
    if (h.code !== "unauthenticated" && h.code !== "not_enabled") throw h;
  }
}
async function A1(f) {
  try {
    return { enabled: !0, user: Xf(await uc("me", f)) };
  } catch (h) {
    return h.code === "unauthenticated" ? { enabled: !0, user: null } : h.code === "not_enabled" ? { enabled: !1, user: null } : { enabled: null, user: null, error: h };
  }
}
function Un({ id: f, label: h, hint: d, error: s, children: S }) {
  const D = [d && `${f}-hint`, s && `${f}-error`].filter(Boolean).join(" ") || void 0;
  return /* @__PURE__ */ c.createElement("div", { className: "hl-field" + (s ? " has-error" : "") }, /* @__PURE__ */ c.createElement("label", { htmlFor: f }, h), S({ id: f, "aria-invalid": s ? !0 : void 0, "aria-describedby": D }), d && /* @__PURE__ */ c.createElement("p", { className: "hl-field-hint", id: `${f}-hint` }, d), s && /* @__PURE__ */ c.createElement("p", { className: "hl-field-error", id: `${f}-error` }, s));
}
function Lf({ show: f, onToggle: h, ...d }) {
  return /* @__PURE__ */ c.createElement("div", { className: "hl-password" }, /* @__PURE__ */ c.createElement("input", { ...d, type: f ? "text" : "password", spellCheck: !1, autoCapitalize: "none", maxLength: xf }), /* @__PURE__ */ c.createElement(
    "button",
    {
      type: "button",
      className: "hl-password-toggle",
      onClick: h,
      "aria-pressed": f,
      "aria-label": f ? "Ẩn mật khẩu" : "Hiện mật khẩu"
    },
    f ? "Ẩn" : "Hiện"
  ));
}
function _m({ error: f, alertRef: h }) {
  return f ? /* @__PURE__ */ c.createElement("div", { className: "hl-form-alert", role: "alert", tabIndex: -1, ref: h }, f) : null;
}
function Dm(f) {
  const [h, d] = L.useState(!1), [s, S] = L.useState(""), [D, O] = L.useState(0), Y = L.useRef(null);
  return L.useEffect(() => {
    s && !h && Y.current?.focus();
  }, [D, h]), { busy: h, error: s, alertRef: Y, run: async (...z) => {
    d(!0), S("");
    try {
      await f(...z);
    } catch (F) {
      S(F.message), O((B) => B + 1);
    } finally {
      d(!1);
    }
  } };
}
const Om = (f, h) => {
  const d = Object.keys(h)[0];
  d && f.querySelector(`[name="${d}"]`)?.focus();
};
function Cm({ title: f, lead: h, children: d, footer: s }) {
  return /* @__PURE__ */ c.createElement("div", { className: "hl-auth" }, /* @__PURE__ */ c.createElement("section", { className: "hl-panel hl-auth-card", "aria-labelledby": "hl-auth-title" }, /* @__PURE__ */ c.createElement("span", { className: "hl-feature-icon hl-tint-1" }, /* @__PURE__ */ c.createElement(Cy, { size: 28 })), /* @__PURE__ */ c.createElement("h1", { id: "hl-auth-title" }, f), h && /* @__PURE__ */ c.createElement("p", { className: "hl-muted" }, h), d, s && /* @__PURE__ */ c.createElement("div", { className: "hl-auth-foot" }, s)));
}
function N1({ onSignedIn: f }) {
  const h = L.useId(), [d, s] = L.useState({ username: "", password: "" }), [S, D] = L.useState({}), [O, Y] = L.useState(!1), { busy: C, error: z, alertRef: F, run: B } = Dm(async () => f(await z1(d))), Z = (k) => (X) => {
    const re = k === "username" ? Nm(X.target.value) : X.target.value;
    s((ue) => ({ ...ue, [k]: re })), D((ue) => ({ ...ue, [k]: void 0 }));
  }, te = (k) => {
    k.preventDefault();
    const X = b1(d);
    if (D(X), Object.keys(X).length) {
      Om(k.currentTarget, X);
      return;
    }
    B();
  };
  return /* @__PURE__ */ c.createElement(
    Cm,
    {
      title: "Đăng nhập",
      lead: "Đăng nhập để lưu quá trình học trên máy chủ của lớp.",
      footer: /* @__PURE__ */ c.createElement(c.Fragment, null, /* @__PURE__ */ c.createElement("p", null, "Chưa có tài khoản? ", /* @__PURE__ */ c.createElement("a", { href: ve.register }, "Đăng ký")), /* @__PURE__ */ c.createElement("p", { className: "hl-muted" }, "Quên mật khẩu? Hãy nhờ giáo viên đặt lại (HoloLab không dùng email)."), /* @__PURE__ */ c.createElement("p", { className: "hl-muted" }, "Không đăng nhập vẫn làm được mọi thí nghiệm. ", /* @__PURE__ */ c.createElement("a", { href: ve.overview }, "Vào khu học tập")))
    },
    /* @__PURE__ */ c.createElement("form", { className: "hl-form", onSubmit: te, noValidate: !0, "aria-busy": C }, /* @__PURE__ */ c.createElement(_m, { error: z, alertRef: F }), /* @__PURE__ */ c.createElement(Un, { id: `${h}-u`, label: "Tên đăng nhập", error: S.username }, (k) => /* @__PURE__ */ c.createElement(
      "input",
      {
        ...k,
        name: "username",
        autoComplete: "username",
        autoCapitalize: "none",
        spellCheck: !1,
        maxLength: 32,
        value: d.username,
        onChange: Z("username"),
        disabled: C
      }
    )), /* @__PURE__ */ c.createElement(Un, { id: `${h}-p`, label: "Mật khẩu", error: S.password }, (k) => /* @__PURE__ */ c.createElement(
      Lf,
      {
        ...k,
        name: "password",
        autoComplete: "current-password",
        value: d.password,
        onChange: Z("password"),
        disabled: C,
        show: O,
        onToggle: () => Y((X) => !X)
      }
    )), /* @__PURE__ */ c.createElement("button", { type: "submit", className: "hl-btn hl-btn-primary hl-btn-lg hl-form-submit", disabled: C }, C ? "Đang đăng nhập…" : "Đăng nhập"))
  );
}
function _1({ onSignedIn: f }) {
  const h = L.useId(), [d, s] = L.useState({ username: "", password: "", confirm: "", consent: !1 }), [S, D] = L.useState({}), [O, Y] = L.useState(!1), { busy: C, error: z, alertRef: F, run: B } = Dm(async () => f(await M1(d))), Z = (k) => (X) => {
    const re = k === "consent" ? X.target.checked : k === "username" ? Nm(X.target.value) : X.target.value;
    s((ue) => ({ ...ue, [k]: re })), D((ue) => ({ ...ue, [k]: void 0 }));
  }, te = (k) => {
    k.preventDefault();
    const X = p1(d);
    if (D(X), Object.keys(X).length) {
      Om(k.currentTarget, X);
      return;
    }
    B();
  };
  return /* @__PURE__ */ c.createElement(
    Cm,
    {
      title: "Đăng ký tài khoản học sinh",
      lead: "Tài khoản giúp lưu bài làm và câu trả lời EGAD trên máy chủ của lớp, để bạn và giáo viên xem lại.",
      footer: /* @__PURE__ */ c.createElement(c.Fragment, null, /* @__PURE__ */ c.createElement("p", null, "Đã có tài khoản? ", /* @__PURE__ */ c.createElement("a", { href: ve.login }, "Đăng nhập")), /* @__PURE__ */ c.createElement("p", { className: "hl-muted" }, "Tài khoản giáo viên do người quản trị tạo trên máy chủ, không đăng ký ở đây."))
    },
    /* @__PURE__ */ c.createElement("form", { className: "hl-form", onSubmit: te, noValidate: !0, "aria-busy": C }, /* @__PURE__ */ c.createElement(_m, { error: z, alertRef: F }), /* @__PURE__ */ c.createElement(
      Un,
      {
        id: `${h}-u`,
        label: "Tên đăng nhập",
        error: S.username,
        hint: "3–32 ký tự: chữ thường không dấu, số, _ . -  Không dùng họ tên thật (ví dụ: hs.lop10a.07, tho_xanh)"
      },
      (k) => /* @__PURE__ */ c.createElement(
        "input",
        {
          ...k,
          name: "username",
          autoComplete: "username",
          autoCapitalize: "none",
          spellCheck: !1,
          maxLength: 32,
          value: d.username,
          onChange: Z("username"),
          disabled: C
        }
      )
    ), /* @__PURE__ */ c.createElement(
      Un,
      {
        id: `${h}-p`,
        label: "Mật khẩu",
        error: S.password,
        hint: `Ít nhất ${Rf} ký tự. Một câu ngắn dễ nhớ là mật khẩu tốt (ví dụ ba từ ghép lại).`
      },
      (k) => /* @__PURE__ */ c.createElement(
        Lf,
        {
          ...k,
          name: "password",
          autoComplete: "new-password",
          value: d.password,
          onChange: Z("password"),
          disabled: C,
          show: O,
          onToggle: () => Y((X) => !X)
        }
      )
    ), /* @__PURE__ */ c.createElement(Un, { id: `${h}-c`, label: "Nhập lại mật khẩu", error: S.confirm }, (k) => /* @__PURE__ */ c.createElement(
      Lf,
      {
        ...k,
        name: "confirm",
        autoComplete: "new-password",
        value: d.confirm,
        onChange: Z("confirm"),
        disabled: C,
        show: O,
        onToggle: () => Y((X) => !X)
      }
    )), /* @__PURE__ */ c.createElement("div", { className: "hl-field hl-check" + (S.consent ? " has-error" : "") }, /* @__PURE__ */ c.createElement("label", null, /* @__PURE__ */ c.createElement(
      "input",
      {
        type: "checkbox",
        name: "consent",
        checked: d.consent,
        onChange: Z("consent"),
        disabled: C,
        "aria-invalid": S.consent ? !0 : void 0,
        "aria-describedby": S.consent ? `${h}-consent-error` : void 0
      }
    ), /* @__PURE__ */ c.createElement("span", null, y1)), S.consent && /* @__PURE__ */ c.createElement("p", { className: "hl-field-error", id: `${h}-consent-error` }, S.consent)), /* @__PURE__ */ c.createElement("button", { type: "submit", className: "hl-btn hl-btn-primary hl-btn-lg hl-form-submit", disabled: C }, C ? "Đang tạo tài khoản…" : "Tạo tài khoản"))
  );
}
const hm = "hololab-saved-v38", qm = "hololab-egad-open", D1 = { intro: "Giới thiệu", login: "Đăng nhập", register: "Đăng ký", overview: "Tổng quan", experiments: "Thư viện thí nghiệm", history: "Lịch sử học" }, Hm = 1360, O1 = 900, Uf = () => innerWidth < Hm && innerWidth > O1, Iu = () => !document.body.classList.contains("supplies-closed"), C1 = () => {
  try {
    const f = localStorage.getItem(qm);
    if (f === "1" || f === "0") return f === "1";
  } catch {
  }
  return innerWidth >= Hm;
}, q1 = (f) => {
  try {
    localStorage.setItem(qm, f ? "1" : "0");
  } catch {
  }
};
function H1() {
  const [f, h] = L.useState(location.hash);
  return L.useEffect(() => {
    const d = () => h(location.hash);
    return addEventListener("hashchange", d), () => removeEventListener("hashchange", d);
  }, []), [f, h];
}
function U1({ api: f, dock: h }) {
  const d = new URLSearchParams(location.search).has("test"), [s, S] = H1(), D = oy(s), O = (q) => {
    location.hash !== q && (location.hash = q), S(q);
  }, Y = D.name === "practice" || d && !s, [C, z] = L.useState(null), [F, B] = L.useState("move"), [Z, te] = L.useState(""), [k, X] = L.useState(""), [re, ue] = L.useState({ enabled: null, user: null });
  L.useEffect(() => {
    A1().then(ue);
  }, []);
  const [Le, De] = L.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(hm) || "[]");
    } catch {
      return [];
    }
  }), [Oe, V] = L.useState(C1), [pe, I] = L.useState(() => ({ title: f.title(), lesson: f.lesson() })), [, R] = L.useState(0), oe = L.useRef(null), qe = L.useRef(null), at = L.useRef(document.title), Be = f.lessons.filter((q) => q.status === "ready"), Ze = () => I({ title: f.title(), lesson: f.lesson() }), Ae = () => {
    f.release(), O(ve.experiments);
  };
  L.useEffect(() => {
    const q = document.getElementById("sidebar-toggle"), we = q.onclick;
    return q.onclick = Ae, () => {
      q.onclick = we;
    };
  }, []), L.useEffect(() => {
    const q = document.getElementById("lab-title"), we = new MutationObserver(Ze);
    return we.observe(q, { childList: !0, characterData: !0, subtree: !0 }), () => we.disconnect();
  }, []), L.useEffect(() => vm(() => R((q) => q + 1)), []), L.useEffect(() => {
    document.body.classList.toggle("egad-open", Oe);
  }, [Oe]);
  const Fe = L.useRef(Oe);
  Fe.current = Oe, L.useEffect(() => {
    Iu() && (innerWidth <= 600 || Oe && Uf()) && document.getElementById("supplies-toggle")?.click();
  }, []), L.useEffect(() => {
    let q = Iu();
    const we = new MutationObserver(() => {
      const ql = Iu();
      ql && !q && Fe.current && Uf() && V(!1), q = ql;
    });
    return we.observe(document.body, { attributes: !0, attributeFilter: ["class"] }), () => we.disconnect();
  }, []), L.useEffect(() => {
    if (D.name !== "practice") {
      f.release();
      return;
    }
    const q = D.id;
    if (oe.current !== q) {
      if (q === "session") {
        O(ve.history);
        return;
      }
      if (q === "free") {
        f.free(), oe.current = q, Ze();
        return;
      }
      if (Be.some((we) => we.id === q)) {
        f.start(q), oe.current = q, Ze();
        return;
      }
      X(`Không tìm thấy bài thực hành “${q}”. Hãy chọn một bài trong thư viện.`), O(ve.experiments);
    }
  }, [D.name, D.id]), L.useEffect(() => {
    qe.current && (qe.current.scrollTop = 0), document.title = Y ? pe.lesson ? `${pe.title} · HoloLab` : at.current : `${D1[D.name] || "HoloLab"} · HoloLab`, D.name !== "experiments" && X("");
  }, [D.name, Y, pe.title]);
  const T = (q) => {
    f.setMode(q), B(q);
  }, H = (q) => {
    f.start(q), oe.current = q, Ze(), z(null), O(ve.practice(q));
  }, J = () => {
    f.free(), oe.current = "free", Ze(), O(ve.practice("free"));
  }, ge = () => {
    try {
      const q = [{ name: f.title(), date: (/* @__PURE__ */ new Date()).toLocaleString("vi-VN"), data: f.snapshot() }, ...Le].slice(0, 12);
      localStorage.setItem(hm, JSON.stringify(q)), De(q), te("Đã lưu trên trình duyệt này.");
    } catch (q) {
      te("Không lưu được: " + q.message);
    }
  }, de = async (q) => {
    try {
      await q();
    } catch (we) {
      te(we.message);
    }
  }, y = (q) => de(async () => {
    await f.restore(q.data), oe.current = "session", Ze(), O(ve.practice("session"));
  }), _ = () => document.getElementById("mouse-help").showModal(), U = () => {
    const q = !Fe.current;
    q1(q), q && Uf() && Iu() && document.getElementById("supplies-toggle")?.click(), V(q);
  }, G = () => {
    const q = document.getElementById("learning-panel");
    q.open = !0, q.scrollIntoView({ behavior: "smooth", block: "start" });
  }, W = Be.find((q) => q.id === pe.lesson) || null;
  let P = null;
  const se = (q) => {
    ue({ enabled: !0, user: q }), O(ve.overview);
  }, Je = async () => {
    try {
      await T1(), ue((q) => ({ ...q, user: null })), O(ve.intro);
    } catch (q) {
      te("Chưa đăng xuất được: " + q.message);
    }
  };
  return D.name === "overview" && (P = /* @__PURE__ */ c.createElement(f1, { lessons: f.lessons, saved: Le, onOpenSaved: y, user: re.user })), D.name === "experiments" && (P = /* @__PURE__ */ c.createElement(r1, { lessons: f.lessons, stocks: f.stocks || [], saved: Le, onPreview: z, onOpenSaved: y, onFree: J, notice: k })), D.name === "history" && (P = /* @__PURE__ */ c.createElement(o1, { data: Sy({ saved: Le, lessons: f.lessons, turns: gy() }), onOpenSaved: y })), /* @__PURE__ */ c.createElement(c.Fragment, null, /* @__PURE__ */ c.createElement(
    Ky,
    {
      title: pe.title,
      mode: F,
      onMode: T,
      onLibrary: Ae,
      onUpright: () => f.upright(),
      onSave: ge,
      onUndo: () => de(f.undo),
      onRedo: () => de(f.redo),
      onReset: () => f.reset(),
      onRemove: () => f.remove(),
      onHelp: _,
      egadOpen: Oe,
      onEgad: U
    }
  ), Z && /* @__PURE__ */ c.createElement("div", { className: "mouse-notice", role: "status", onClick: () => te("") }, Z, " ×"), /* @__PURE__ */ c.createElement("dialog", { id: "mouse-help" }, /* @__PURE__ */ c.createElement("h2", null, "Thực hành bằng chuột"), /* @__PURE__ */ c.createElement("p", null, "Chọn bài → chọn chế độ → giữ chuột trên dụng cụ."), /* @__PURE__ */ c.createElement("ul", null, /* @__PURE__ */ c.createElement("li", null, "Di chuyển: kéo bình đến vị trí mong muốn."), /* @__PURE__ */ c.createElement("li", null, "Nghiêng / rót: kéo ngang khoảng 350 px để dốc ngược. Giữ chuột để tiếp tục rót."), /* @__PURE__ */ c.createElement("li", null, "Gần / xa: kéo dọc để căn miệng bình theo chiều sâu."), /* @__PURE__ */ c.createElement("li", null, "Chỉ rót vào bình nhận khi dòng chảy đi qua miệng bình; lệch miệng sẽ đổ ra bàn."), /* @__PURE__ */ c.createElement("li", null, "Thả chuột trả vật về hệ vật lý. Camera không cần bật."), /* @__PURE__ */ c.createElement("li", null, "Lưu giữ phiên trong trình duyệt; xuất JSON trong bảng công cụ để chuyển máy."), /* @__PURE__ */ c.createElement("li", null, "EGAD ở khung bên phải: trả lời câu hỏi của bài bằng lời của bạn. Bấm “EGAD” trên thanh công cụ để mở hoặc thu gọn.")), /* @__PURE__ */ c.createElement("button", { onClick: () => document.getElementById("mouse-help").close() }, "Đã hiểu")), Oe && sy.createPortal(/* @__PURE__ */ c.createElement(u1, { lesson: W, onClose: U, onOpenRubric: G, onLibrary: Ae }), h), !Y && /* @__PURE__ */ c.createElement("div", { className: "hl-app", ref: qe }, /* @__PURE__ */ c.createElement(ky, { route: D, user: re.user, onSignOut: Je }), Z && !Y && /* @__PURE__ */ c.createElement("div", { className: "hl-app-notice", role: "status", onClick: () => te("") }, Z, " ×"), D.name === "intro" && /* @__PURE__ */ c.createElement(i1, { lessonCount: Be.length, onHelp: _ }), D.name === "login" && /* @__PURE__ */ c.createElement(N1, { onSignedIn: se }), D.name === "register" && /* @__PURE__ */ c.createElement(_1, { onSignedIn: se }), hy(D) && /* @__PURE__ */ c.createElement(Xy, { route: D }, P)), C && /* @__PURE__ */ c.createElement(h1, { lesson: C, index: Be.indexOf(C), onClose: () => z(null), onStart: () => H(C.id) }));
}
function B1(f) {
  const h = document.createElement("div");
  h.id = "mouse-shell", document.querySelector("main").prepend(h);
  const d = document.createElement("aside");
  d.id = "egad-dock", d.setAttribute("aria-label", "Trợ lý EGAD"), document.body.append(d), ry.createRoot(h).render(/* @__PURE__ */ c.createElement(U1, { api: f, dock: d })), document.body.classList.add("mouse-first", "sidebar-closed");
}
export {
  B1 as initMouseShell
};
