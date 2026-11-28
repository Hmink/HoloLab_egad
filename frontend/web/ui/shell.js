function od(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var mf = { exports: {} }, Q = {};
var pr;
function dd() {
  if (pr) return Q;
  pr = 1;
  var r = Symbol.for("react.transitional.element"), N = Symbol.for("react.portal"), M = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), X = Symbol.for("react.profiler"), R = Symbol.for("react.consumer"), k = Symbol.for("react.context"), yl = Symbol.for("react.forward_ref"), U = Symbol.for("react.suspense"), z = Symbol.for("react.memo"), j = Symbol.for("react.lazy"), q = Symbol.for("react.activity"), tl = Symbol.iterator;
  function Ml(s) {
    return s === null || typeof s != "object" ? null : (s = tl && s[tl] || s["@@iterator"], typeof s == "function" ? s : null);
  }
  var Nl = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, gl = Object.assign, kl = {};
  function Rl(s, A, O) {
    this.props = s, this.context = A, this.refs = kl, this.updater = O || Nl;
  }
  Rl.prototype.isReactComponent = {}, Rl.prototype.setState = function(s, A) {
    if (typeof s != "object" && typeof s != "function" && s != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, s, A, "setState");
  }, Rl.prototype.forceUpdate = function(s) {
    this.updater.enqueueForceUpdate(this, s, "forceUpdate");
  };
  function Il() {
  }
  Il.prototype = Rl.prototype;
  function pl(s, A, O) {
    this.props = s, this.context = A, this.refs = kl, this.updater = O || Nl;
  }
  var Kl = pl.prototype = new Il();
  Kl.constructor = pl, gl(Kl, Rl.prototype), Kl.isPureReactComponent = !0;
  var x = Array.isArray;
  function zl() {
  }
  var J = { H: null, A: null, T: null, S: null }, _l = Object.prototype.hasOwnProperty;
  function Gl(s, A, O) {
    var C = O.ref;
    return {
      $$typeof: r,
      type: s,
      key: A,
      ref: C !== void 0 ? C : null,
      props: O
    };
  }
  function le(s, A) {
    return Gl(s.type, A, s.props);
  }
  function wl(s) {
    return typeof s == "object" && s !== null && s.$$typeof === r;
  }
  function Y(s) {
    var A = { "=": "=0", ":": "=2" };
    return "$" + s.replace(/[=:]/g, function(O) {
      return A[O];
    });
  }
  var Fl = /\/+/g;
  function Rt(s, A) {
    return typeof s == "object" && s !== null && s.key != null ? Y("" + s.key) : A.toString(36);
  }
  function _t(s) {
    switch (s.status) {
      case "fulfilled":
        return s.value;
      case "rejected":
        throw s.reason;
      default:
        switch (typeof s.status == "string" ? s.then(zl, zl) : (s.status = "pending", s.then(
          function(A) {
            s.status === "pending" && (s.status = "fulfilled", s.value = A);
          },
          function(A) {
            s.status === "pending" && (s.status = "rejected", s.reason = A);
          }
        )), s.status) {
          case "fulfilled":
            return s.value;
          case "rejected":
            throw s.reason;
        }
    }
    throw s;
  }
  function S(s, A, O, C, Z) {
    var w = typeof s;
    (w === "undefined" || w === "boolean") && (s = null);
    var ul = !1;
    if (s === null) ul = !0;
    else
      switch (w) {
        case "bigint":
        case "string":
        case "number":
          ul = !0;
          break;
        case "object":
          switch (s.$$typeof) {
            case r:
            case N:
              ul = !0;
              break;
            case j:
              return ul = s._init, S(
                ul(s._payload),
                A,
                O,
                C,
                Z
              );
          }
      }
    if (ul)
      return Z = Z(s), ul = C === "" ? "." + Rt(s, 0) : C, x(Z) ? (O = "", ul != null && (O = ul.replace(Fl, "$&/") + "/"), S(Z, A, O, "", function(Ua) {
        return Ua;
      })) : Z != null && (wl(Z) && (Z = le(
        Z,
        O + (Z.key == null || s && s.key === Z.key ? "" : ("" + Z.key).replace(
          Fl,
          "$&/"
        ) + "/") + ul
      )), A.push(Z)), 1;
    ul = 0;
    var Wl = C === "" ? "." : C + ":";
    if (x(s))
      for (var Ol = 0; Ol < s.length; Ol++)
        C = s[Ol], w = Wl + Rt(C, Ol), ul += S(
          C,
          A,
          O,
          w,
          Z
        );
    else if (Ol = Ml(s), typeof Ol == "function")
      for (s = Ol.call(s), Ol = 0; !(C = s.next()).done; )
        C = C.value, w = Wl + Rt(C, Ol++), ul += S(
          C,
          A,
          O,
          w,
          Z
        );
    else if (w === "object") {
      if (typeof s.then == "function")
        return S(
          _t(s),
          A,
          O,
          C,
          Z
        );
      throw A = String(s), Error(
        "Objects are not valid as a React child (found: " + (A === "[object Object]" ? "object with keys {" + Object.keys(s).join(", ") + "}" : A) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return ul;
  }
  function _(s, A, O) {
    if (s == null) return s;
    var C = [], Z = 0;
    return S(s, C, "", "", function(w) {
      return A.call(O, w, Z++);
    }), C;
  }
  function L(s) {
    if (s._status === -1) {
      var A = s._result;
      A = A(), A.then(
        function(O) {
          (s._status === 0 || s._status === -1) && (s._status = 1, s._result = O);
        },
        function(O) {
          (s._status === 0 || s._status === -1) && (s._status = 2, s._result = O);
        }
      ), s._status === -1 && (s._status = 0, s._result = A);
    }
    if (s._status === 1) return s._result.default;
    throw s._result;
  }
  var hl = typeof reportError == "function" ? reportError : function(s) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var A = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof s == "object" && s !== null && typeof s.message == "string" ? String(s.message) : String(s),
        error: s
      });
      if (!window.dispatchEvent(A)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", s);
      return;
    }
    console.error(s);
  }, ol = {
    map: _,
    forEach: function(s, A, O) {
      _(
        s,
        function() {
          A.apply(this, arguments);
        },
        O
      );
    },
    count: function(s) {
      var A = 0;
      return _(s, function() {
        A++;
      }), A;
    },
    toArray: function(s) {
      return _(s, function(A) {
        return A;
      }) || [];
    },
    only: function(s) {
      if (!wl(s))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return s;
    }
  };
  return Q.Activity = q, Q.Children = ol, Q.Component = Rl, Q.Fragment = M, Q.Profiler = X, Q.PureComponent = pl, Q.StrictMode = o, Q.Suspense = U, Q.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = J, Q.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(s) {
      return J.H.useMemoCache(s);
    }
  }, Q.cache = function(s) {
    return function() {
      return s.apply(null, arguments);
    };
  }, Q.cacheSignal = function() {
    return null;
  }, Q.cloneElement = function(s, A, O) {
    if (s == null)
      throw Error(
        "The argument must be a React element, but you passed " + s + "."
      );
    var C = gl({}, s.props), Z = s.key;
    if (A != null)
      for (w in A.key !== void 0 && (Z = "" + A.key), A)
        !_l.call(A, w) || w === "key" || w === "__self" || w === "__source" || w === "ref" && A.ref === void 0 || (C[w] = A[w]);
    var w = arguments.length - 2;
    if (w === 1) C.children = O;
    else if (1 < w) {
      for (var ul = Array(w), Wl = 0; Wl < w; Wl++)
        ul[Wl] = arguments[Wl + 2];
      C.children = ul;
    }
    return Gl(s.type, Z, C);
  }, Q.createContext = function(s) {
    return s = {
      $$typeof: k,
      _currentValue: s,
      _currentValue2: s,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, s.Provider = s, s.Consumer = {
      $$typeof: R,
      _context: s
    }, s;
  }, Q.createElement = function(s, A, O) {
    var C, Z = {}, w = null;
    if (A != null)
      for (C in A.key !== void 0 && (w = "" + A.key), A)
        _l.call(A, C) && C !== "key" && C !== "__self" && C !== "__source" && (Z[C] = A[C]);
    var ul = arguments.length - 2;
    if (ul === 1) Z.children = O;
    else if (1 < ul) {
      for (var Wl = Array(ul), Ol = 0; Ol < ul; Ol++)
        Wl[Ol] = arguments[Ol + 2];
      Z.children = Wl;
    }
    if (s && s.defaultProps)
      for (C in ul = s.defaultProps, ul)
        Z[C] === void 0 && (Z[C] = ul[C]);
    return Gl(s, w, Z);
  }, Q.createRef = function() {
    return { current: null };
  }, Q.forwardRef = function(s) {
    return { $$typeof: yl, render: s };
  }, Q.isValidElement = wl, Q.lazy = function(s) {
    return {
      $$typeof: j,
      _payload: { _status: -1, _result: s },
      _init: L
    };
  }, Q.memo = function(s, A) {
    return {
      $$typeof: z,
      type: s,
      compare: A === void 0 ? null : A
    };
  }, Q.startTransition = function(s) {
    var A = J.T, O = {};
    J.T = O;
    try {
      var C = s(), Z = J.S;
      Z !== null && Z(O, C), typeof C == "object" && C !== null && typeof C.then == "function" && C.then(zl, hl);
    } catch (w) {
      hl(w);
    } finally {
      A !== null && O.types !== null && (A.types = O.types), J.T = A;
    }
  }, Q.unstable_useCacheRefresh = function() {
    return J.H.useCacheRefresh();
  }, Q.use = function(s) {
    return J.H.use(s);
  }, Q.useActionState = function(s, A, O) {
    return J.H.useActionState(s, A, O);
  }, Q.useCallback = function(s, A) {
    return J.H.useCallback(s, A);
  }, Q.useContext = function(s) {
    return J.H.useContext(s);
  }, Q.useDebugValue = function() {
  }, Q.useDeferredValue = function(s, A) {
    return J.H.useDeferredValue(s, A);
  }, Q.useEffect = function(s, A) {
    return J.H.useEffect(s, A);
  }, Q.useEffectEvent = function(s) {
    return J.H.useEffectEvent(s);
  }, Q.useId = function() {
    return J.H.useId();
  }, Q.useImperativeHandle = function(s, A, O) {
    return J.H.useImperativeHandle(s, A, O);
  }, Q.useInsertionEffect = function(s, A) {
    return J.H.useInsertionEffect(s, A);
  }, Q.useLayoutEffect = function(s, A) {
    return J.H.useLayoutEffect(s, A);
  }, Q.useMemo = function(s, A) {
    return J.H.useMemo(s, A);
  }, Q.useOptimistic = function(s, A) {
    return J.H.useOptimistic(s, A);
  }, Q.useReducer = function(s, A, O) {
    return J.H.useReducer(s, A, O);
  }, Q.useRef = function(s) {
    return J.H.useRef(s);
  }, Q.useState = function(s) {
    return J.H.useState(s);
  }, Q.useSyncExternalStore = function(s, A, O) {
    return J.H.useSyncExternalStore(
      s,
      A,
      O
    );
  }, Q.useTransition = function() {
    return J.H.useTransition();
  }, Q.version = "19.2.0", Q;
}
var zr;
function yf() {
  return zr || (zr = 1, mf.exports = dd()), mf.exports;
}
var fl = yf();
const i = /* @__PURE__ */ od(fl);
var sf = { exports: {} }, An = {}, rf = { exports: {} }, of = {};
var Tr;
function vd() {
  return Tr || (Tr = 1, (function(r) {
    function N(S, _) {
      var L = S.length;
      S.push(_);
      l: for (; 0 < L; ) {
        var hl = L - 1 >>> 1, ol = S[hl];
        if (0 < X(ol, _))
          S[hl] = _, S[L] = ol, L = hl;
        else break l;
      }
    }
    function M(S) {
      return S.length === 0 ? null : S[0];
    }
    function o(S) {
      if (S.length === 0) return null;
      var _ = S[0], L = S.pop();
      if (L !== _) {
        S[0] = L;
        l: for (var hl = 0, ol = S.length, s = ol >>> 1; hl < s; ) {
          var A = 2 * (hl + 1) - 1, O = S[A], C = A + 1, Z = S[C];
          if (0 > X(O, L))
            C < ol && 0 > X(Z, O) ? (S[hl] = Z, S[C] = L, hl = C) : (S[hl] = O, S[A] = L, hl = A);
          else if (C < ol && 0 > X(Z, L))
            S[hl] = Z, S[C] = L, hl = C;
          else break l;
        }
      }
      return _;
    }
    function X(S, _) {
      var L = S.sortIndex - _.sortIndex;
      return L !== 0 ? L : S.id - _.id;
    }
    if (r.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var R = performance;
      r.unstable_now = function() {
        return R.now();
      };
    } else {
      var k = Date, yl = k.now();
      r.unstable_now = function() {
        return k.now() - yl;
      };
    }
    var U = [], z = [], j = 1, q = null, tl = 3, Ml = !1, Nl = !1, gl = !1, kl = !1, Rl = typeof setTimeout == "function" ? setTimeout : null, Il = typeof clearTimeout == "function" ? clearTimeout : null, pl = typeof setImmediate < "u" ? setImmediate : null;
    function Kl(S) {
      for (var _ = M(z); _ !== null; ) {
        if (_.callback === null) o(z);
        else if (_.startTime <= S)
          o(z), _.sortIndex = _.expirationTime, N(U, _);
        else break;
        _ = M(z);
      }
    }
    function x(S) {
      if (gl = !1, Kl(S), !Nl)
        if (M(U) !== null)
          Nl = !0, zl || (zl = !0, Y());
        else {
          var _ = M(z);
          _ !== null && _t(x, _.startTime - S);
        }
    }
    var zl = !1, J = -1, _l = 5, Gl = -1;
    function le() {
      return kl ? !0 : !(r.unstable_now() - Gl < _l);
    }
    function wl() {
      if (kl = !1, zl) {
        var S = r.unstable_now();
        Gl = S;
        var _ = !0;
        try {
          l: {
            Nl = !1, gl && (gl = !1, Il(J), J = -1), Ml = !0;
            var L = tl;
            try {
              t: {
                for (Kl(S), q = M(U); q !== null && !(q.expirationTime > S && le()); ) {
                  var hl = q.callback;
                  if (typeof hl == "function") {
                    q.callback = null, tl = q.priorityLevel;
                    var ol = hl(
                      q.expirationTime <= S
                    );
                    if (S = r.unstable_now(), typeof ol == "function") {
                      q.callback = ol, Kl(S), _ = !0;
                      break t;
                    }
                    q === M(U) && o(U), Kl(S);
                  } else o(U);
                  q = M(U);
                }
                if (q !== null) _ = !0;
                else {
                  var s = M(z);
                  s !== null && _t(
                    x,
                    s.startTime - S
                  ), _ = !1;
                }
              }
              break l;
            } finally {
              q = null, tl = L, Ml = !1;
            }
            _ = void 0;
          }
        } finally {
          _ ? Y() : zl = !1;
        }
      }
    }
    var Y;
    if (typeof pl == "function")
      Y = function() {
        pl(wl);
      };
    else if (typeof MessageChannel < "u") {
      var Fl = new MessageChannel(), Rt = Fl.port2;
      Fl.port1.onmessage = wl, Y = function() {
        Rt.postMessage(null);
      };
    } else
      Y = function() {
        Rl(wl, 0);
      };
    function _t(S, _) {
      J = Rl(function() {
        S(r.unstable_now());
      }, _);
    }
    r.unstable_IdlePriority = 5, r.unstable_ImmediatePriority = 1, r.unstable_LowPriority = 4, r.unstable_NormalPriority = 3, r.unstable_Profiling = null, r.unstable_UserBlockingPriority = 2, r.unstable_cancelCallback = function(S) {
      S.callback = null;
    }, r.unstable_forceFrameRate = function(S) {
      0 > S || 125 < S ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : _l = 0 < S ? Math.floor(1e3 / S) : 5;
    }, r.unstable_getCurrentPriorityLevel = function() {
      return tl;
    }, r.unstable_next = function(S) {
      switch (tl) {
        case 1:
        case 2:
        case 3:
          var _ = 3;
          break;
        default:
          _ = tl;
      }
      var L = tl;
      tl = _;
      try {
        return S();
      } finally {
        tl = L;
      }
    }, r.unstable_requestPaint = function() {
      kl = !0;
    }, r.unstable_runWithPriority = function(S, _) {
      switch (S) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          S = 3;
      }
      var L = tl;
      tl = S;
      try {
        return _();
      } finally {
        tl = L;
      }
    }, r.unstable_scheduleCallback = function(S, _, L) {
      var hl = r.unstable_now();
      switch (typeof L == "object" && L !== null ? (L = L.delay, L = typeof L == "number" && 0 < L ? hl + L : hl) : L = hl, S) {
        case 1:
          var ol = -1;
          break;
        case 2:
          ol = 250;
          break;
        case 5:
          ol = 1073741823;
          break;
        case 4:
          ol = 1e4;
          break;
        default:
          ol = 5e3;
      }
      return ol = L + ol, S = {
        id: j++,
        callback: _,
        priorityLevel: S,
        startTime: L,
        expirationTime: ol,
        sortIndex: -1
      }, L > hl ? (S.sortIndex = L, N(z, S), M(U) === null && S === M(z) && (gl ? (Il(J), J = -1) : gl = !0, _t(x, L - hl))) : (S.sortIndex = ol, N(U, S), Nl || Ml || (Nl = !0, zl || (zl = !0, Y()))), S;
    }, r.unstable_shouldYield = le, r.unstable_wrapCallback = function(S) {
      var _ = tl;
      return function() {
        var L = tl;
        tl = _;
        try {
          return S.apply(this, arguments);
        } finally {
          tl = L;
        }
      };
    };
  })(of)), of;
}
var Ar;
function yd() {
  return Ar || (Ar = 1, rf.exports = vd()), rf.exports;
}
var df = { exports: {} }, Jl = {};
var Mr;
function gd() {
  if (Mr) return Jl;
  Mr = 1;
  var r = yf();
  function N(U) {
    var z = "https://react.dev/errors/" + U;
    if (1 < arguments.length) {
      z += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var j = 2; j < arguments.length; j++)
        z += "&args[]=" + encodeURIComponent(arguments[j]);
    }
    return "Minified React error #" + U + "; visit " + z + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function M() {
  }
  var o = {
    d: {
      f: M,
      r: function() {
        throw Error(N(522));
      },
      D: M,
      C: M,
      L: M,
      m: M,
      X: M,
      S: M,
      M
    },
    p: 0,
    findDOMNode: null
  }, X = Symbol.for("react.portal");
  function R(U, z, j) {
    var q = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: X,
      key: q == null ? null : "" + q,
      children: U,
      containerInfo: z,
      implementation: j
    };
  }
  var k = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function yl(U, z) {
    if (U === "font") return "";
    if (typeof z == "string")
      return z === "use-credentials" ? z : "";
  }
  return Jl.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o, Jl.createPortal = function(U, z) {
    var j = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!z || z.nodeType !== 1 && z.nodeType !== 9 && z.nodeType !== 11)
      throw Error(N(299));
    return R(U, z, null, j);
  }, Jl.flushSync = function(U) {
    var z = k.T, j = o.p;
    try {
      if (k.T = null, o.p = 2, U) return U();
    } finally {
      k.T = z, o.p = j, o.d.f();
    }
  }, Jl.preconnect = function(U, z) {
    typeof U == "string" && (z ? (z = z.crossOrigin, z = typeof z == "string" ? z === "use-credentials" ? z : "" : void 0) : z = null, o.d.C(U, z));
  }, Jl.prefetchDNS = function(U) {
    typeof U == "string" && o.d.D(U);
  }, Jl.preinit = function(U, z) {
    if (typeof U == "string" && z && typeof z.as == "string") {
      var j = z.as, q = yl(j, z.crossOrigin), tl = typeof z.integrity == "string" ? z.integrity : void 0, Ml = typeof z.fetchPriority == "string" ? z.fetchPriority : void 0;
      j === "style" ? o.d.S(
        U,
        typeof z.precedence == "string" ? z.precedence : void 0,
        {
          crossOrigin: q,
          integrity: tl,
          fetchPriority: Ml
        }
      ) : j === "script" && o.d.X(U, {
        crossOrigin: q,
        integrity: tl,
        fetchPriority: Ml,
        nonce: typeof z.nonce == "string" ? z.nonce : void 0
      });
    }
  }, Jl.preinitModule = function(U, z) {
    if (typeof U == "string")
      if (typeof z == "object" && z !== null) {
        if (z.as == null || z.as === "script") {
          var j = yl(
            z.as,
            z.crossOrigin
          );
          o.d.M(U, {
            crossOrigin: j,
            integrity: typeof z.integrity == "string" ? z.integrity : void 0,
            nonce: typeof z.nonce == "string" ? z.nonce : void 0
          });
        }
      } else z == null && o.d.M(U);
  }, Jl.preload = function(U, z) {
    if (typeof U == "string" && typeof z == "object" && z !== null && typeof z.as == "string") {
      var j = z.as, q = yl(j, z.crossOrigin);
      o.d.L(U, j, {
        crossOrigin: q,
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
  }, Jl.preloadModule = function(U, z) {
    if (typeof U == "string")
      if (z) {
        var j = yl(z.as, z.crossOrigin);
        o.d.m(U, {
          as: typeof z.as == "string" && z.as !== "script" ? z.as : void 0,
          crossOrigin: j,
          integrity: typeof z.integrity == "string" ? z.integrity : void 0
        });
      } else o.d.m(U);
  }, Jl.requestFormReset = function(U) {
    o.d.r(U);
  }, Jl.unstable_batchedUpdates = function(U, z) {
    return U(z);
  }, Jl.useFormState = function(U, z, j) {
    return k.H.useFormState(U, z, j);
  }, Jl.useFormStatus = function() {
    return k.H.useHostTransitionStatus();
  }, Jl.version = "19.2.0", Jl;
}
var Nr;
function Ed() {
  if (Nr) return df.exports;
  Nr = 1;
  function r() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r);
      } catch (N) {
        console.error(N);
      }
  }
  return r(), df.exports = gd(), df.exports;
}
var _r;
function bd() {
  if (_r) return An;
  _r = 1;
  var r = yd(), N = yf(), M = Ed();
  function o(l) {
    var t = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var e = 2; e < arguments.length; e++)
        t += "&args[]=" + encodeURIComponent(arguments[e]);
    }
    return "Minified React error #" + l + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function X(l) {
    return !(!l || l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11);
  }
  function R(l) {
    var t = l, e = l;
    if (l.alternate) for (; t.return; ) t = t.return;
    else {
      l = t;
      do
        t = l, (t.flags & 4098) !== 0 && (e = t.return), l = t.return;
      while (l);
    }
    return t.tag === 3 ? e : null;
  }
  function k(l) {
    if (l.tag === 13) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function yl(l) {
    if (l.tag === 31) {
      var t = l.memoizedState;
      if (t === null && (l = l.alternate, l !== null && (t = l.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function U(l) {
    if (R(l) !== l)
      throw Error(o(188));
  }
  function z(l) {
    var t = l.alternate;
    if (!t) {
      if (t = R(l), t === null) throw Error(o(188));
      return t !== l ? null : l;
    }
    for (var e = l, a = t; ; ) {
      var n = e.return;
      if (n === null) break;
      var u = n.alternate;
      if (u === null) {
        if (a = n.return, a !== null) {
          e = a;
          continue;
        }
        break;
      }
      if (n.child === u.child) {
        for (u = n.child; u; ) {
          if (u === e) return U(n), l;
          if (u === a) return U(n), t;
          u = u.sibling;
        }
        throw Error(o(188));
      }
      if (e.return !== a.return) e = n, a = u;
      else {
        for (var c = !1, f = n.child; f; ) {
          if (f === e) {
            c = !0, e = n, a = u;
            break;
          }
          if (f === a) {
            c = !0, a = n, e = u;
            break;
          }
          f = f.sibling;
        }
        if (!c) {
          for (f = u.child; f; ) {
            if (f === e) {
              c = !0, e = u, a = n;
              break;
            }
            if (f === a) {
              c = !0, a = u, e = n;
              break;
            }
            f = f.sibling;
          }
          if (!c) throw Error(o(189));
        }
      }
      if (e.alternate !== a) throw Error(o(190));
    }
    if (e.tag !== 3) throw Error(o(188));
    return e.stateNode.current === e ? l : t;
  }
  function j(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l;
    for (l = l.child; l !== null; ) {
      if (t = j(l), t !== null) return t;
      l = l.sibling;
    }
    return null;
  }
  var q = Object.assign, tl = Symbol.for("react.element"), Ml = Symbol.for("react.transitional.element"), Nl = Symbol.for("react.portal"), gl = Symbol.for("react.fragment"), kl = Symbol.for("react.strict_mode"), Rl = Symbol.for("react.profiler"), Il = Symbol.for("react.consumer"), pl = Symbol.for("react.context"), Kl = Symbol.for("react.forward_ref"), x = Symbol.for("react.suspense"), zl = Symbol.for("react.suspense_list"), J = Symbol.for("react.memo"), _l = Symbol.for("react.lazy"), Gl = Symbol.for("react.activity"), le = Symbol.for("react.memo_cache_sentinel"), wl = Symbol.iterator;
  function Y(l) {
    return l === null || typeof l != "object" ? null : (l = wl && l[wl] || l["@@iterator"], typeof l == "function" ? l : null);
  }
  var Fl = Symbol.for("react.client.reference");
  function Rt(l) {
    if (l == null) return null;
    if (typeof l == "function")
      return l.$$typeof === Fl ? null : l.displayName || l.name || null;
    if (typeof l == "string") return l;
    switch (l) {
      case gl:
        return "Fragment";
      case Rl:
        return "Profiler";
      case kl:
        return "StrictMode";
      case x:
        return "Suspense";
      case zl:
        return "SuspenseList";
      case Gl:
        return "Activity";
    }
    if (typeof l == "object")
      switch (l.$$typeof) {
        case Nl:
          return "Portal";
        case pl:
          return l.displayName || "Context";
        case Il:
          return (l._context.displayName || "Context") + ".Consumer";
        case Kl:
          var t = l.render;
          return l = l.displayName, l || (l = t.displayName || t.name || "", l = l !== "" ? "ForwardRef(" + l + ")" : "ForwardRef"), l;
        case J:
          return t = l.displayName || null, t !== null ? t : Rt(l.type) || "Memo";
        case _l:
          t = l._payload, l = l._init;
          try {
            return Rt(l(t));
          } catch {
          }
      }
    return null;
  }
  var _t = Array.isArray, S = N.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, _ = M.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, L = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, hl = [], ol = -1;
  function s(l) {
    return { current: l };
  }
  function A(l) {
    0 > ol || (l.current = hl[ol], hl[ol] = null, ol--);
  }
  function O(l, t) {
    ol++, hl[ol] = l.current, l.current = t;
  }
  var C = s(null), Z = s(null), w = s(null), ul = s(null);
  function Wl(l, t) {
    switch (O(w, t), O(Z, l), O(C, null), t.nodeType) {
      case 9:
      case 11:
        l = (l = t.documentElement) && (l = l.namespaceURI) ? Vs(l) : 0;
        break;
      default:
        if (l = t.tagName, t = t.namespaceURI)
          t = Vs(t), l = Ks(t, l);
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
    A(C), O(C, l);
  }
  function Ol() {
    A(C), A(Z), A(w);
  }
  function Ua(l) {
    l.memoizedState !== null && O(ul, l);
    var t = C.current, e = Ks(t, l.type);
    t !== e && (O(Z, l), O(C, e));
  }
  function Mn(l) {
    Z.current === l && (A(C), A(Z)), ul.current === l && (A(ul), Sn._currentValue = L);
  }
  var Ku, Sf;
  function Ne(l) {
    if (Ku === void 0)
      try {
        throw Error();
      } catch (e) {
        var t = e.stack.trim().match(/\n( *(at )?)/);
        Ku = t && t[1] || "", Sf = -1 < e.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < e.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Ku + l + Sf;
  }
  var Ju = !1;
  function ku(l, t) {
    if (!l || Ju) return "";
    Ju = !0;
    var e = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var T = function() {
                throw Error();
              };
              if (Object.defineProperty(T.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(T, []);
                } catch (E) {
                  var g = E;
                }
                Reflect.construct(l, [], T);
              } else {
                try {
                  T.call();
                } catch (E) {
                  g = E;
                }
                l.call(T.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (E) {
                g = E;
              }
              (T = l()) && typeof T.catch == "function" && T.catch(function() {
              });
            }
          } catch (E) {
            if (E && g && typeof E.stack == "string")
              return [E.stack, g.stack];
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
      var u = a.DetermineComponentFrameRoot(), c = u[0], f = u[1];
      if (c && f) {
        var h = c.split(`
`), y = f.split(`
`);
        for (n = a = 0; a < h.length && !h[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; n < y.length && !y[n].includes(
          "DetermineComponentFrameRoot"
        ); )
          n++;
        if (a === h.length || n === y.length)
          for (a = h.length - 1, n = y.length - 1; 1 <= a && 0 <= n && h[a] !== y[n]; )
            n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (h[a] !== y[n]) {
            if (a !== 1 || n !== 1)
              do
                if (a--, n--, 0 > n || h[a] !== y[n]) {
                  var b = `
` + h[a].replace(" at new ", " at ");
                  return l.displayName && b.includes("<anonymous>") && (b = b.replace("<anonymous>", l.displayName)), b;
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      Ju = !1, Error.prepareStackTrace = e;
    }
    return (e = l ? l.displayName || l.name : "") ? Ne(e) : "";
  }
  function Zr(l, t) {
    switch (l.tag) {
      case 26:
      case 27:
      case 5:
        return Ne(l.type);
      case 16:
        return Ne("Lazy");
      case 13:
        return l.child !== t && t !== null ? Ne("Suspense Fallback") : Ne("Suspense");
      case 19:
        return Ne("SuspenseList");
      case 0:
      case 15:
        return ku(l.type, !1);
      case 11:
        return ku(l.type.render, !1);
      case 1:
        return ku(l.type, !0);
      case 31:
        return Ne("Activity");
      default:
        return "";
    }
  }
  function pf(l) {
    try {
      var t = "", e = null;
      do
        t += Zr(l, e), e = l, l = l.return;
      while (l);
      return t;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var wu = Object.prototype.hasOwnProperty, Fu = r.unstable_scheduleCallback, Wu = r.unstable_cancelCallback, Vr = r.unstable_shouldYield, Kr = r.unstable_requestPaint, ct = r.unstable_now, Jr = r.unstable_getCurrentPriorityLevel, zf = r.unstable_ImmediatePriority, Tf = r.unstable_UserBlockingPriority, Nn = r.unstable_NormalPriority, kr = r.unstable_LowPriority, Af = r.unstable_IdlePriority, wr = r.log, Fr = r.unstable_setDisableYieldValue, Ca = null, it = null;
  function te(l) {
    if (typeof wr == "function" && Fr(l), it && typeof it.setStrictMode == "function")
      try {
        it.setStrictMode(Ca, l);
      } catch {
      }
  }
  var ft = Math.clz32 ? Math.clz32 : Ir, Wr = Math.log, $r = Math.LN2;
  function Ir(l) {
    return l >>>= 0, l === 0 ? 32 : 31 - (Wr(l) / $r | 0) | 0;
  }
  var _n = 256, On = 262144, Dn = 4194304;
  function _e(l) {
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
  function Un(l, t, e) {
    var a = l.pendingLanes;
    if (a === 0) return 0;
    var n = 0, u = l.suspendedLanes, c = l.pingedLanes;
    l = l.warmLanes;
    var f = a & 134217727;
    return f !== 0 ? (a = f & ~u, a !== 0 ? n = _e(a) : (c &= f, c !== 0 ? n = _e(c) : e || (e = f & ~l, e !== 0 && (n = _e(e))))) : (f = a & ~u, f !== 0 ? n = _e(f) : c !== 0 ? n = _e(c) : e || (e = a & ~l, e !== 0 && (n = _e(e)))), n === 0 ? 0 : t !== 0 && t !== n && (t & u) === 0 && (u = n & -n, e = t & -t, u >= e || u === 32 && (e & 4194048) !== 0) ? t : n;
  }
  function Ha(l, t) {
    return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & t) === 0;
  }
  function Pr(l, t) {
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
  function Mf() {
    var l = Dn;
    return Dn <<= 1, (Dn & 62914560) === 0 && (Dn = 4194304), l;
  }
  function $u(l) {
    for (var t = [], e = 0; 31 > e; e++) t.push(l);
    return t;
  }
  function qa(l, t) {
    l.pendingLanes |= t, t !== 268435456 && (l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0);
  }
  function lo(l, t, e, a, n, u) {
    var c = l.pendingLanes;
    l.pendingLanes = e, l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0, l.expiredLanes &= e, l.entangledLanes &= e, l.errorRecoveryDisabledLanes &= e, l.shellSuspendCounter = 0;
    var f = l.entanglements, h = l.expirationTimes, y = l.hiddenUpdates;
    for (e = c & ~e; 0 < e; ) {
      var b = 31 - ft(e), T = 1 << b;
      f[b] = 0, h[b] = -1;
      var g = y[b];
      if (g !== null)
        for (y[b] = null, b = 0; b < g.length; b++) {
          var E = g[b];
          E !== null && (E.lane &= -536870913);
        }
      e &= ~T;
    }
    a !== 0 && Nf(l, a, 0), u !== 0 && n === 0 && l.tag !== 0 && (l.suspendedLanes |= u & ~(c & ~t));
  }
  function Nf(l, t, e) {
    l.pendingLanes |= t, l.suspendedLanes &= ~t;
    var a = 31 - ft(t);
    l.entangledLanes |= t, l.entanglements[a] = l.entanglements[a] | 1073741824 | e & 261930;
  }
  function _f(l, t) {
    var e = l.entangledLanes |= t;
    for (l = l.entanglements; e; ) {
      var a = 31 - ft(e), n = 1 << a;
      n & t | l[a] & t && (l[a] |= t), e &= ~n;
    }
  }
  function Of(l, t) {
    var e = t & -t;
    return e = (e & 42) !== 0 ? 1 : Iu(e), (e & (l.suspendedLanes | t)) !== 0 ? 0 : e;
  }
  function Iu(l) {
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
  function Pu(l) {
    return l &= -l, 2 < l ? 8 < l ? (l & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Df() {
    var l = _.p;
    return l !== 0 ? l : (l = window.event, l === void 0 ? 32 : dr(l.type));
  }
  function Uf(l, t) {
    var e = _.p;
    try {
      return _.p = l, t();
    } finally {
      _.p = e;
    }
  }
  var ee = Math.random().toString(36).slice(2), Xl = "__reactFiber$" + ee, Pl = "__reactProps$" + ee, Ke = "__reactContainer$" + ee, lc = "__reactEvents$" + ee, to = "__reactListeners$" + ee, eo = "__reactHandles$" + ee, Cf = "__reactResources$" + ee, Ba = "__reactMarker$" + ee;
  function tc(l) {
    delete l[Xl], delete l[Pl], delete l[lc], delete l[to], delete l[eo];
  }
  function Je(l) {
    var t = l[Xl];
    if (t) return t;
    for (var e = l.parentNode; e; ) {
      if (t = e[Ke] || e[Xl]) {
        if (e = t.alternate, t.child !== null || e !== null && e.child !== null)
          for (l = Is(l); l !== null; ) {
            if (e = l[Xl]) return e;
            l = Is(l);
          }
        return t;
      }
      l = e, e = l.parentNode;
    }
    return null;
  }
  function ke(l) {
    if (l = l[Xl] || l[Ke]) {
      var t = l.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return l;
    }
    return null;
  }
  function Ra(l) {
    var t = l.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return l.stateNode;
    throw Error(o(33));
  }
  function we(l) {
    var t = l[Cf];
    return t || (t = l[Cf] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function xl(l) {
    l[Ba] = !0;
  }
  var Hf = /* @__PURE__ */ new Set(), qf = {};
  function Oe(l, t) {
    Fe(l, t), Fe(l + "Capture", t);
  }
  function Fe(l, t) {
    for (qf[l] = t, l = 0; l < t.length; l++)
      Hf.add(t[l]);
  }
  var ao = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Bf = {}, Rf = {};
  function no(l) {
    return wu.call(Rf, l) ? !0 : wu.call(Bf, l) ? !1 : ao.test(l) ? Rf[l] = !0 : (Bf[l] = !0, !1);
  }
  function Cn(l, t, e) {
    if (no(t))
      if (e === null) l.removeAttribute(t);
      else {
        switch (typeof e) {
          case "undefined":
          case "function":
          case "symbol":
            l.removeAttribute(t);
            return;
          case "boolean":
            var a = t.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              l.removeAttribute(t);
              return;
            }
        }
        l.setAttribute(t, "" + e);
      }
  }
  function Hn(l, t, e) {
    if (e === null) l.removeAttribute(t);
    else {
      switch (typeof e) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(t);
          return;
      }
      l.setAttribute(t, "" + e);
    }
  }
  function Yt(l, t, e, a) {
    if (a === null) l.removeAttribute(e);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(e);
          return;
      }
      l.setAttributeNS(t, e, "" + a);
    }
  }
  function yt(l) {
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
  function Yf(l) {
    var t = l.type;
    return (l = l.nodeName) && l.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function uo(l, t, e) {
    var a = Object.getOwnPropertyDescriptor(
      l.constructor.prototype,
      t
    );
    if (!l.hasOwnProperty(t) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var n = a.get, u = a.set;
      return Object.defineProperty(l, t, {
        configurable: !0,
        get: function() {
          return n.call(this);
        },
        set: function(c) {
          e = "" + c, u.call(this, c);
        }
      }), Object.defineProperty(l, t, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return e;
        },
        setValue: function(c) {
          e = "" + c;
        },
        stopTracking: function() {
          l._valueTracker = null, delete l[t];
        }
      };
    }
  }
  function ec(l) {
    if (!l._valueTracker) {
      var t = Yf(l) ? "checked" : "value";
      l._valueTracker = uo(
        l,
        t,
        "" + l[t]
      );
    }
  }
  function Gf(l) {
    if (!l) return !1;
    var t = l._valueTracker;
    if (!t) return !0;
    var e = t.getValue(), a = "";
    return l && (a = Yf(l) ? l.checked ? "true" : "false" : l.value), l = a, l !== e ? (t.setValue(l), !0) : !1;
  }
  function qn(l) {
    if (l = l || (typeof document < "u" ? document : void 0), typeof l > "u") return null;
    try {
      return l.activeElement || l.body;
    } catch {
      return l.body;
    }
  }
  var co = /[\n"\\]/g;
  function gt(l) {
    return l.replace(
      co,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function ac(l, t, e, a, n, u, c, f) {
    l.name = "", c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" ? l.type = c : l.removeAttribute("type"), t != null ? c === "number" ? (t === 0 && l.value === "" || l.value != t) && (l.value = "" + yt(t)) : l.value !== "" + yt(t) && (l.value = "" + yt(t)) : c !== "submit" && c !== "reset" || l.removeAttribute("value"), t != null ? nc(l, c, yt(t)) : e != null ? nc(l, c, yt(e)) : a != null && l.removeAttribute("value"), n == null && u != null && (l.defaultChecked = !!u), n != null && (l.checked = n && typeof n != "function" && typeof n != "symbol"), f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" ? l.name = "" + yt(f) : l.removeAttribute("name");
  }
  function xf(l, t, e, a, n, u, c, f) {
    if (u != null && typeof u != "function" && typeof u != "symbol" && typeof u != "boolean" && (l.type = u), t != null || e != null) {
      if (!(u !== "submit" && u !== "reset" || t != null)) {
        ec(l);
        return;
      }
      e = e != null ? "" + yt(e) : "", t = t != null ? "" + yt(t) : e, f || t === l.value || (l.value = t), l.defaultValue = t;
    }
    a = a ?? n, a = typeof a != "function" && typeof a != "symbol" && !!a, l.checked = f ? l.checked : !!a, l.defaultChecked = !!a, c != null && typeof c != "function" && typeof c != "symbol" && typeof c != "boolean" && (l.name = c), ec(l);
  }
  function nc(l, t, e) {
    t === "number" && qn(l.ownerDocument) === l || l.defaultValue === "" + e || (l.defaultValue = "" + e);
  }
  function We(l, t, e, a) {
    if (l = l.options, t) {
      t = {};
      for (var n = 0; n < e.length; n++)
        t["$" + e[n]] = !0;
      for (e = 0; e < l.length; e++)
        n = t.hasOwnProperty("$" + l[e].value), l[e].selected !== n && (l[e].selected = n), n && a && (l[e].defaultSelected = !0);
    } else {
      for (e = "" + yt(e), t = null, n = 0; n < l.length; n++) {
        if (l[n].value === e) {
          l[n].selected = !0, a && (l[n].defaultSelected = !0);
          return;
        }
        t !== null || l[n].disabled || (t = l[n]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Lf(l, t, e) {
    if (t != null && (t = "" + yt(t), t !== l.value && (l.value = t), e == null)) {
      l.defaultValue !== t && (l.defaultValue = t);
      return;
    }
    l.defaultValue = e != null ? "" + yt(e) : "";
  }
  function Xf(l, t, e, a) {
    if (t == null) {
      if (a != null) {
        if (e != null) throw Error(o(92));
        if (_t(a)) {
          if (1 < a.length) throw Error(o(93));
          a = a[0];
        }
        e = a;
      }
      e == null && (e = ""), t = e;
    }
    e = yt(t), l.defaultValue = e, a = l.textContent, a === e && a !== "" && a !== null && (l.value = a), ec(l);
  }
  function $e(l, t) {
    if (t) {
      var e = l.firstChild;
      if (e && e === l.lastChild && e.nodeType === 3) {
        e.nodeValue = t;
        return;
      }
    }
    l.textContent = t;
  }
  var io = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Qf(l, t, e) {
    var a = t.indexOf("--") === 0;
    e == null || typeof e == "boolean" || e === "" ? a ? l.setProperty(t, "") : t === "float" ? l.cssFloat = "" : l[t] = "" : a ? l.setProperty(t, e) : typeof e != "number" || e === 0 || io.has(t) ? t === "float" ? l.cssFloat = e : l[t] = ("" + e).trim() : l[t] = e + "px";
  }
  function jf(l, t, e) {
    if (t != null && typeof t != "object")
      throw Error(o(62));
    if (l = l.style, e != null) {
      for (var a in e)
        !e.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? l.setProperty(a, "") : a === "float" ? l.cssFloat = "" : l[a] = "");
      for (var n in t)
        a = t[n], t.hasOwnProperty(n) && e[n] !== a && Qf(l, n, a);
    } else
      for (var u in t)
        t.hasOwnProperty(u) && Qf(l, u, t[u]);
  }
  function uc(l) {
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
  var fo = /* @__PURE__ */ new Map([
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
  ]), ho = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Bn(l) {
    return ho.test("" + l) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : l;
  }
  function Gt() {
  }
  var cc = null;
  function ic(l) {
    return l = l.target || l.srcElement || window, l.correspondingUseElement && (l = l.correspondingUseElement), l.nodeType === 3 ? l.parentNode : l;
  }
  var Ie = null, Pe = null;
  function Zf(l) {
    var t = ke(l);
    if (t && (l = t.stateNode)) {
      var e = l[Pl] || null;
      l: switch (l = t.stateNode, t.type) {
        case "input":
          if (ac(
            l,
            e.value,
            e.defaultValue,
            e.defaultValue,
            e.checked,
            e.defaultChecked,
            e.type,
            e.name
          ), t = e.name, e.type === "radio" && t != null) {
            for (e = l; e.parentNode; ) e = e.parentNode;
            for (e = e.querySelectorAll(
              'input[name="' + gt(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < e.length; t++) {
              var a = e[t];
              if (a !== l && a.form === l.form) {
                var n = a[Pl] || null;
                if (!n) throw Error(o(90));
                ac(
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
            for (t = 0; t < e.length; t++)
              a = e[t], a.form === l.form && Gf(a);
          }
          break l;
        case "textarea":
          Lf(l, e.value, e.defaultValue);
          break l;
        case "select":
          t = e.value, t != null && We(l, !!e.multiple, t, !1);
      }
    }
  }
  var fc = !1;
  function Vf(l, t, e) {
    if (fc) return l(t, e);
    fc = !0;
    try {
      var a = l(t);
      return a;
    } finally {
      if (fc = !1, (Ie !== null || Pe !== null) && (pu(), Ie && (t = Ie, l = Pe, Pe = Ie = null, Zf(t), l)))
        for (t = 0; t < l.length; t++) Zf(l[t]);
    }
  }
  function Ya(l, t) {
    var e = l.stateNode;
    if (e === null) return null;
    var a = e[Pl] || null;
    if (a === null) return null;
    e = a[t];
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
        (a = !a.disabled) || (l = l.type, a = !(l === "button" || l === "input" || l === "select" || l === "textarea")), l = !a;
        break l;
      default:
        l = !1;
    }
    if (l) return null;
    if (e && typeof e != "function")
      throw Error(
        o(231, t, typeof e)
      );
    return e;
  }
  var xt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), hc = !1;
  if (xt)
    try {
      var Ga = {};
      Object.defineProperty(Ga, "passive", {
        get: function() {
          hc = !0;
        }
      }), window.addEventListener("test", Ga, Ga), window.removeEventListener("test", Ga, Ga);
    } catch {
      hc = !1;
    }
  var ae = null, mc = null, Rn = null;
  function Kf() {
    if (Rn) return Rn;
    var l, t = mc, e = t.length, a, n = "value" in ae ? ae.value : ae.textContent, u = n.length;
    for (l = 0; l < e && t[l] === n[l]; l++) ;
    var c = e - l;
    for (a = 1; a <= c && t[e - a] === n[u - a]; a++) ;
    return Rn = n.slice(l, 1 < a ? 1 - a : void 0);
  }
  function Yn(l) {
    var t = l.keyCode;
    return "charCode" in l ? (l = l.charCode, l === 0 && t === 13 && (l = 13)) : l = t, l === 10 && (l = 13), 32 <= l || l === 13 ? l : 0;
  }
  function Gn() {
    return !0;
  }
  function Jf() {
    return !1;
  }
  function lt(l) {
    function t(e, a, n, u, c) {
      this._reactName = e, this._targetInst = n, this.type = a, this.nativeEvent = u, this.target = c, this.currentTarget = null;
      for (var f in l)
        l.hasOwnProperty(f) && (e = l[f], this[f] = e ? e(u) : u[f]);
      return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? Gn : Jf, this.isPropagationStopped = Jf, this;
    }
    return q(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var e = this.nativeEvent;
        e && (e.preventDefault ? e.preventDefault() : typeof e.returnValue != "unknown" && (e.returnValue = !1), this.isDefaultPrevented = Gn);
      },
      stopPropagation: function() {
        var e = this.nativeEvent;
        e && (e.stopPropagation ? e.stopPropagation() : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0), this.isPropagationStopped = Gn);
      },
      persist: function() {
      },
      isPersistent: Gn
    }), t;
  }
  var De = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(l) {
      return l.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, xn = lt(De), xa = q({}, De, { view: 0, detail: 0 }), mo = lt(xa), sc, rc, La, Ln = q({}, xa, {
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
    getModifierState: dc,
    button: 0,
    buttons: 0,
    relatedTarget: function(l) {
      return l.relatedTarget === void 0 ? l.fromElement === l.srcElement ? l.toElement : l.fromElement : l.relatedTarget;
    },
    movementX: function(l) {
      return "movementX" in l ? l.movementX : (l !== La && (La && l.type === "mousemove" ? (sc = l.screenX - La.screenX, rc = l.screenY - La.screenY) : rc = sc = 0, La = l), sc);
    },
    movementY: function(l) {
      return "movementY" in l ? l.movementY : rc;
    }
  }), kf = lt(Ln), so = q({}, Ln, { dataTransfer: 0 }), ro = lt(so), oo = q({}, xa, { relatedTarget: 0 }), oc = lt(oo), vo = q({}, De, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), yo = lt(vo), go = q({}, De, {
    clipboardData: function(l) {
      return "clipboardData" in l ? l.clipboardData : window.clipboardData;
    }
  }), Eo = lt(go), bo = q({}, De, { data: 0 }), wf = lt(bo), So = {
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
  }, po = {
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
  }, zo = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function To(l) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(l) : (l = zo[l]) ? !!t[l] : !1;
  }
  function dc() {
    return To;
  }
  var Ao = q({}, xa, {
    key: function(l) {
      if (l.key) {
        var t = So[l.key] || l.key;
        if (t !== "Unidentified") return t;
      }
      return l.type === "keypress" ? (l = Yn(l), l === 13 ? "Enter" : String.fromCharCode(l)) : l.type === "keydown" || l.type === "keyup" ? po[l.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: dc,
    charCode: function(l) {
      return l.type === "keypress" ? Yn(l) : 0;
    },
    keyCode: function(l) {
      return l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    },
    which: function(l) {
      return l.type === "keypress" ? Yn(l) : l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    }
  }), Mo = lt(Ao), No = q({}, Ln, {
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
  }), Ff = lt(No), _o = q({}, xa, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: dc
  }), Oo = lt(_o), Do = q({}, De, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), Uo = lt(Do), Co = q({}, Ln, {
    deltaX: function(l) {
      return "deltaX" in l ? l.deltaX : "wheelDeltaX" in l ? -l.wheelDeltaX : 0;
    },
    deltaY: function(l) {
      return "deltaY" in l ? l.deltaY : "wheelDeltaY" in l ? -l.wheelDeltaY : "wheelDelta" in l ? -l.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Ho = lt(Co), qo = q({}, De, {
    newState: 0,
    oldState: 0
  }), Bo = lt(qo), Ro = [9, 13, 27, 32], vc = xt && "CompositionEvent" in window, Xa = null;
  xt && "documentMode" in document && (Xa = document.documentMode);
  var Yo = xt && "TextEvent" in window && !Xa, Wf = xt && (!vc || Xa && 8 < Xa && 11 >= Xa), $f = " ", If = !1;
  function Pf(l, t) {
    switch (l) {
      case "keyup":
        return Ro.indexOf(t.keyCode) !== -1;
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
  function lh(l) {
    return l = l.detail, typeof l == "object" && "data" in l ? l.data : null;
  }
  var la = !1;
  function Go(l, t) {
    switch (l) {
      case "compositionend":
        return lh(t);
      case "keypress":
        return t.which !== 32 ? null : (If = !0, $f);
      case "textInput":
        return l = t.data, l === $f && If ? null : l;
      default:
        return null;
    }
  }
  function xo(l, t) {
    if (la)
      return l === "compositionend" || !vc && Pf(l, t) ? (l = Kf(), Rn = mc = ae = null, la = !1, l) : null;
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
        return Wf && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Lo = {
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
  function th(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t === "input" ? !!Lo[l.type] : t === "textarea";
  }
  function eh(l, t, e, a) {
    Ie ? Pe ? Pe.push(a) : Pe = [a] : Ie = a, t = Ou(t, "onChange"), 0 < t.length && (e = new xn(
      "onChange",
      "change",
      null,
      e,
      a
    ), l.push({ event: e, listeners: t }));
  }
  var Qa = null, ja = null;
  function Xo(l) {
    xs(l, 0);
  }
  function Xn(l) {
    var t = Ra(l);
    if (Gf(t)) return l;
  }
  function ah(l, t) {
    if (l === "change") return t;
  }
  var nh = !1;
  if (xt) {
    var yc;
    if (xt) {
      var gc = "oninput" in document;
      if (!gc) {
        var uh = document.createElement("div");
        uh.setAttribute("oninput", "return;"), gc = typeof uh.oninput == "function";
      }
      yc = gc;
    } else yc = !1;
    nh = yc && (!document.documentMode || 9 < document.documentMode);
  }
  function ch() {
    Qa && (Qa.detachEvent("onpropertychange", ih), ja = Qa = null);
  }
  function ih(l) {
    if (l.propertyName === "value" && Xn(ja)) {
      var t = [];
      eh(
        t,
        ja,
        l,
        ic(l)
      ), Vf(Xo, t);
    }
  }
  function Qo(l, t, e) {
    l === "focusin" ? (ch(), Qa = t, ja = e, Qa.attachEvent("onpropertychange", ih)) : l === "focusout" && ch();
  }
  function jo(l) {
    if (l === "selectionchange" || l === "keyup" || l === "keydown")
      return Xn(ja);
  }
  function Zo(l, t) {
    if (l === "click") return Xn(t);
  }
  function Vo(l, t) {
    if (l === "input" || l === "change")
      return Xn(t);
  }
  function Ko(l, t) {
    return l === t && (l !== 0 || 1 / l === 1 / t) || l !== l && t !== t;
  }
  var ht = typeof Object.is == "function" ? Object.is : Ko;
  function Za(l, t) {
    if (ht(l, t)) return !0;
    if (typeof l != "object" || l === null || typeof t != "object" || t === null)
      return !1;
    var e = Object.keys(l), a = Object.keys(t);
    if (e.length !== a.length) return !1;
    for (a = 0; a < e.length; a++) {
      var n = e[a];
      if (!wu.call(t, n) || !ht(l[n], t[n]))
        return !1;
    }
    return !0;
  }
  function fh(l) {
    for (; l && l.firstChild; ) l = l.firstChild;
    return l;
  }
  function hh(l, t) {
    var e = fh(l);
    l = 0;
    for (var a; e; ) {
      if (e.nodeType === 3) {
        if (a = l + e.textContent.length, l <= t && a >= t)
          return { node: e, offset: t - l };
        l = a;
      }
      l: {
        for (; e; ) {
          if (e.nextSibling) {
            e = e.nextSibling;
            break l;
          }
          e = e.parentNode;
        }
        e = void 0;
      }
      e = fh(e);
    }
  }
  function mh(l, t) {
    return l && t ? l === t ? !0 : l && l.nodeType === 3 ? !1 : t && t.nodeType === 3 ? mh(l, t.parentNode) : "contains" in l ? l.contains(t) : l.compareDocumentPosition ? !!(l.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function sh(l) {
    l = l != null && l.ownerDocument != null && l.ownerDocument.defaultView != null ? l.ownerDocument.defaultView : window;
    for (var t = qn(l.document); t instanceof l.HTMLIFrameElement; ) {
      try {
        var e = typeof t.contentWindow.location.href == "string";
      } catch {
        e = !1;
      }
      if (e) l = t.contentWindow;
      else break;
      t = qn(l.document);
    }
    return t;
  }
  function Ec(l) {
    var t = l && l.nodeName && l.nodeName.toLowerCase();
    return t && (t === "input" && (l.type === "text" || l.type === "search" || l.type === "tel" || l.type === "url" || l.type === "password") || t === "textarea" || l.contentEditable === "true");
  }
  var Jo = xt && "documentMode" in document && 11 >= document.documentMode, ta = null, bc = null, Va = null, Sc = !1;
  function rh(l, t, e) {
    var a = e.window === e ? e.document : e.nodeType === 9 ? e : e.ownerDocument;
    Sc || ta == null || ta !== qn(a) || (a = ta, "selectionStart" in a && Ec(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), Va && Za(Va, a) || (Va = a, a = Ou(bc, "onSelect"), 0 < a.length && (t = new xn(
      "onSelect",
      "select",
      null,
      t,
      e
    ), l.push({ event: t, listeners: a }), t.target = ta)));
  }
  function Ue(l, t) {
    var e = {};
    return e[l.toLowerCase()] = t.toLowerCase(), e["Webkit" + l] = "webkit" + t, e["Moz" + l] = "moz" + t, e;
  }
  var ea = {
    animationend: Ue("Animation", "AnimationEnd"),
    animationiteration: Ue("Animation", "AnimationIteration"),
    animationstart: Ue("Animation", "AnimationStart"),
    transitionrun: Ue("Transition", "TransitionRun"),
    transitionstart: Ue("Transition", "TransitionStart"),
    transitioncancel: Ue("Transition", "TransitionCancel"),
    transitionend: Ue("Transition", "TransitionEnd")
  }, pc = {}, oh = {};
  xt && (oh = document.createElement("div").style, "AnimationEvent" in window || (delete ea.animationend.animation, delete ea.animationiteration.animation, delete ea.animationstart.animation), "TransitionEvent" in window || delete ea.transitionend.transition);
  function Ce(l) {
    if (pc[l]) return pc[l];
    if (!ea[l]) return l;
    var t = ea[l], e;
    for (e in t)
      if (t.hasOwnProperty(e) && e in oh)
        return pc[l] = t[e];
    return l;
  }
  var dh = Ce("animationend"), vh = Ce("animationiteration"), yh = Ce("animationstart"), ko = Ce("transitionrun"), wo = Ce("transitionstart"), Fo = Ce("transitioncancel"), gh = Ce("transitionend"), Eh = /* @__PURE__ */ new Map(), zc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  zc.push("scrollEnd");
  function Ot(l, t) {
    Eh.set(l, t), Oe(t, [l]);
  }
  var Qn = typeof reportError == "function" ? reportError : function(l) {
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
  }, Et = [], aa = 0, Tc = 0;
  function jn() {
    for (var l = aa, t = Tc = aa = 0; t < l; ) {
      var e = Et[t];
      Et[t++] = null;
      var a = Et[t];
      Et[t++] = null;
      var n = Et[t];
      Et[t++] = null;
      var u = Et[t];
      if (Et[t++] = null, a !== null && n !== null) {
        var c = a.pending;
        c === null ? n.next = n : (n.next = c.next, c.next = n), a.pending = n;
      }
      u !== 0 && bh(e, n, u);
    }
  }
  function Zn(l, t, e, a) {
    Et[aa++] = l, Et[aa++] = t, Et[aa++] = e, Et[aa++] = a, Tc |= a, l.lanes |= a, l = l.alternate, l !== null && (l.lanes |= a);
  }
  function Ac(l, t, e, a) {
    return Zn(l, t, e, a), Vn(l);
  }
  function He(l, t) {
    return Zn(l, null, null, t), Vn(l);
  }
  function bh(l, t, e) {
    l.lanes |= e;
    var a = l.alternate;
    a !== null && (a.lanes |= e);
    for (var n = !1, u = l.return; u !== null; )
      u.childLanes |= e, a = u.alternate, a !== null && (a.childLanes |= e), u.tag === 22 && (l = u.stateNode, l === null || l._visibility & 1 || (n = !0)), l = u, u = u.return;
    return l.tag === 3 ? (u = l.stateNode, n && t !== null && (n = 31 - ft(e), l = u.hiddenUpdates, a = l[n], a === null ? l[n] = [t] : a.push(t), t.lane = e | 536870912), u) : null;
  }
  function Vn(l) {
    if (50 < on)
      throw on = 0, qi = null, Error(o(185));
    for (var t = l.return; t !== null; )
      l = t, t = l.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var na = {};
  function Wo(l, t, e, a) {
    this.tag = l, this.key = e, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function mt(l, t, e, a) {
    return new Wo(l, t, e, a);
  }
  function Mc(l) {
    return l = l.prototype, !(!l || !l.isReactComponent);
  }
  function Lt(l, t) {
    var e = l.alternate;
    return e === null ? (e = mt(
      l.tag,
      t,
      l.key,
      l.mode
    ), e.elementType = l.elementType, e.type = l.type, e.stateNode = l.stateNode, e.alternate = l, l.alternate = e) : (e.pendingProps = t, e.type = l.type, e.flags = 0, e.subtreeFlags = 0, e.deletions = null), e.flags = l.flags & 65011712, e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, t = l.dependencies, e.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, e.sibling = l.sibling, e.index = l.index, e.ref = l.ref, e.refCleanup = l.refCleanup, e;
  }
  function Sh(l, t) {
    l.flags &= 65011714;
    var e = l.alternate;
    return e === null ? (l.childLanes = 0, l.lanes = t, l.child = null, l.subtreeFlags = 0, l.memoizedProps = null, l.memoizedState = null, l.updateQueue = null, l.dependencies = null, l.stateNode = null) : (l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.subtreeFlags = 0, l.deletions = null, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, l.type = e.type, t = e.dependencies, l.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), l;
  }
  function Kn(l, t, e, a, n, u) {
    var c = 0;
    if (a = l, typeof l == "function") Mc(l) && (c = 1);
    else if (typeof l == "string")
      c = td(
        l,
        e,
        C.current
      ) ? 26 : l === "html" || l === "head" || l === "body" ? 27 : 5;
    else
      l: switch (l) {
        case Gl:
          return l = mt(31, e, t, n), l.elementType = Gl, l.lanes = u, l;
        case gl:
          return qe(e.children, n, u, t);
        case kl:
          c = 8, n |= 24;
          break;
        case Rl:
          return l = mt(12, e, t, n | 2), l.elementType = Rl, l.lanes = u, l;
        case x:
          return l = mt(13, e, t, n), l.elementType = x, l.lanes = u, l;
        case zl:
          return l = mt(19, e, t, n), l.elementType = zl, l.lanes = u, l;
        default:
          if (typeof l == "object" && l !== null)
            switch (l.$$typeof) {
              case pl:
                c = 10;
                break l;
              case Il:
                c = 9;
                break l;
              case Kl:
                c = 11;
                break l;
              case J:
                c = 14;
                break l;
              case _l:
                c = 16, a = null;
                break l;
            }
          c = 29, e = Error(
            o(130, l === null ? "null" : typeof l, "")
          ), a = null;
      }
    return t = mt(c, e, t, n), t.elementType = l, t.type = a, t.lanes = u, t;
  }
  function qe(l, t, e, a) {
    return l = mt(7, l, a, t), l.lanes = e, l;
  }
  function Nc(l, t, e) {
    return l = mt(6, l, null, t), l.lanes = e, l;
  }
  function ph(l) {
    var t = mt(18, null, null, 0);
    return t.stateNode = l, t;
  }
  function _c(l, t, e) {
    return t = mt(
      4,
      l.children !== null ? l.children : [],
      l.key,
      t
    ), t.lanes = e, t.stateNode = {
      containerInfo: l.containerInfo,
      pendingChildren: null,
      implementation: l.implementation
    }, t;
  }
  var zh = /* @__PURE__ */ new WeakMap();
  function bt(l, t) {
    if (typeof l == "object" && l !== null) {
      var e = zh.get(l);
      return e !== void 0 ? e : (t = {
        value: l,
        source: t,
        stack: pf(t)
      }, zh.set(l, t), t);
    }
    return {
      value: l,
      source: t,
      stack: pf(t)
    };
  }
  var ua = [], ca = 0, Jn = null, Ka = 0, St = [], pt = 0, ne = null, Ct = 1, Ht = "";
  function Xt(l, t) {
    ua[ca++] = Ka, ua[ca++] = Jn, Jn = l, Ka = t;
  }
  function Th(l, t, e) {
    St[pt++] = Ct, St[pt++] = Ht, St[pt++] = ne, ne = l;
    var a = Ct;
    l = Ht;
    var n = 32 - ft(a) - 1;
    a &= ~(1 << n), e += 1;
    var u = 32 - ft(t) + n;
    if (30 < u) {
      var c = n - n % 5;
      u = (a & (1 << c) - 1).toString(32), a >>= c, n -= c, Ct = 1 << 32 - ft(t) + n | e << n | a, Ht = u + l;
    } else
      Ct = 1 << u | e << n | a, Ht = l;
  }
  function Oc(l) {
    l.return !== null && (Xt(l, 1), Th(l, 1, 0));
  }
  function Dc(l) {
    for (; l === Jn; )
      Jn = ua[--ca], ua[ca] = null, Ka = ua[--ca], ua[ca] = null;
    for (; l === ne; )
      ne = St[--pt], St[pt] = null, Ht = St[--pt], St[pt] = null, Ct = St[--pt], St[pt] = null;
  }
  function Ah(l, t) {
    St[pt++] = Ct, St[pt++] = Ht, St[pt++] = ne, Ct = t.id, Ht = t.overflow, ne = l;
  }
  var Ql = null, El = null, ll = !1, ue = null, zt = !1, Uc = Error(o(519));
  function ce(l) {
    var t = Error(
      o(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Ja(bt(t, l)), Uc;
  }
  function Mh(l) {
    var t = l.stateNode, e = l.type, a = l.memoizedProps;
    switch (t[Xl] = l, t[Pl] = a, e) {
      case "dialog":
        W("cancel", t), W("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        W("load", t);
        break;
      case "video":
      case "audio":
        for (e = 0; e < vn.length; e++)
          W(vn[e], t);
        break;
      case "source":
        W("error", t);
        break;
      case "img":
      case "image":
      case "link":
        W("error", t), W("load", t);
        break;
      case "details":
        W("toggle", t);
        break;
      case "input":
        W("invalid", t), xf(
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
        W("invalid", t);
        break;
      case "textarea":
        W("invalid", t), Xf(t, a.value, a.defaultValue, a.children);
    }
    e = a.children, typeof e != "string" && typeof e != "number" && typeof e != "bigint" || t.textContent === "" + e || a.suppressHydrationWarning === !0 || js(t.textContent, e) ? (a.popover != null && (W("beforetoggle", t), W("toggle", t)), a.onScroll != null && W("scroll", t), a.onScrollEnd != null && W("scrollend", t), a.onClick != null && (t.onclick = Gt), t = !0) : t = !1, t || ce(l, !0);
  }
  function Nh(l) {
    for (Ql = l.return; Ql; )
      switch (Ql.tag) {
        case 5:
        case 31:
        case 13:
          zt = !1;
          return;
        case 27:
        case 3:
          zt = !0;
          return;
        default:
          Ql = Ql.return;
      }
  }
  function ia(l) {
    if (l !== Ql) return !1;
    if (!ll) return Nh(l), ll = !0, !1;
    var t = l.tag, e;
    if ((e = t !== 3 && t !== 27) && ((e = t === 5) && (e = l.type, e = !(e !== "form" && e !== "button") || wi(l.type, l.memoizedProps)), e = !e), e && El && ce(l), Nh(l), t === 13) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(o(317));
      El = $s(l);
    } else if (t === 31) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(o(317));
      El = $s(l);
    } else
      t === 27 ? (t = El, Se(l.type) ? (l = Pi, Pi = null, El = l) : El = t) : El = Ql ? At(l.stateNode.nextSibling) : null;
    return !0;
  }
  function Be() {
    El = Ql = null, ll = !1;
  }
  function Cc() {
    var l = ue;
    return l !== null && (nt === null ? nt = l : nt.push.apply(
      nt,
      l
    ), ue = null), l;
  }
  function Ja(l) {
    ue === null ? ue = [l] : ue.push(l);
  }
  var Hc = s(null), Re = null, Qt = null;
  function ie(l, t, e) {
    O(Hc, t._currentValue), t._currentValue = e;
  }
  function jt(l) {
    l._currentValue = Hc.current, A(Hc);
  }
  function qc(l, t, e) {
    for (; l !== null; ) {
      var a = l.alternate;
      if ((l.childLanes & t) !== t ? (l.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), l === e) break;
      l = l.return;
    }
  }
  function Bc(l, t, e, a) {
    var n = l.child;
    for (n !== null && (n.return = l); n !== null; ) {
      var u = n.dependencies;
      if (u !== null) {
        var c = n.child;
        u = u.firstContext;
        l: for (; u !== null; ) {
          var f = u;
          u = n;
          for (var h = 0; h < t.length; h++)
            if (f.context === t[h]) {
              u.lanes |= e, f = u.alternate, f !== null && (f.lanes |= e), qc(
                u.return,
                e,
                l
              ), a || (c = null);
              break l;
            }
          u = f.next;
        }
      } else if (n.tag === 18) {
        if (c = n.return, c === null) throw Error(o(341));
        c.lanes |= e, u = c.alternate, u !== null && (u.lanes |= e), qc(c, e, l), c = null;
      } else c = n.child;
      if (c !== null) c.return = n;
      else
        for (c = n; c !== null; ) {
          if (c === l) {
            c = null;
            break;
          }
          if (n = c.sibling, n !== null) {
            n.return = c.return, c = n;
            break;
          }
          c = c.return;
        }
      n = c;
    }
  }
  function fa(l, t, e, a) {
    l = null;
    for (var n = t, u = !1; n !== null; ) {
      if (!u) {
        if ((n.flags & 524288) !== 0) u = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var c = n.alternate;
        if (c === null) throw Error(o(387));
        if (c = c.memoizedProps, c !== null) {
          var f = n.type;
          ht(n.pendingProps.value, c.value) || (l !== null ? l.push(f) : l = [f]);
        }
      } else if (n === ul.current) {
        if (c = n.alternate, c === null) throw Error(o(387));
        c.memoizedState.memoizedState !== n.memoizedState.memoizedState && (l !== null ? l.push(Sn) : l = [Sn]);
      }
      n = n.return;
    }
    l !== null && Bc(
      t,
      l,
      e,
      a
    ), t.flags |= 262144;
  }
  function kn(l) {
    for (l = l.firstContext; l !== null; ) {
      if (!ht(
        l.context._currentValue,
        l.memoizedValue
      ))
        return !0;
      l = l.next;
    }
    return !1;
  }
  function Ye(l) {
    Re = l, Qt = null, l = l.dependencies, l !== null && (l.firstContext = null);
  }
  function jl(l) {
    return _h(Re, l);
  }
  function wn(l, t) {
    return Re === null && Ye(l), _h(l, t);
  }
  function _h(l, t) {
    var e = t._currentValue;
    if (t = { context: t, memoizedValue: e, next: null }, Qt === null) {
      if (l === null) throw Error(o(308));
      Qt = t, l.dependencies = { lanes: 0, firstContext: t }, l.flags |= 524288;
    } else Qt = Qt.next = t;
    return e;
  }
  var $o = typeof AbortController < "u" ? AbortController : function() {
    var l = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(e, a) {
        l.push(a);
      }
    };
    this.abort = function() {
      t.aborted = !0, l.forEach(function(e) {
        return e();
      });
    };
  }, Io = r.unstable_scheduleCallback, Po = r.unstable_NormalPriority, Cl = {
    $$typeof: pl,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Rc() {
    return {
      controller: new $o(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function ka(l) {
    l.refCount--, l.refCount === 0 && Io(Po, function() {
      l.controller.abort();
    });
  }
  var wa = null, Yc = 0, ha = 0, ma = null;
  function l0(l, t) {
    if (wa === null) {
      var e = wa = [];
      Yc = 0, ha = Li(), ma = {
        status: "pending",
        value: void 0,
        then: function(a) {
          e.push(a);
        }
      };
    }
    return Yc++, t.then(Oh, Oh), t;
  }
  function Oh() {
    if (--Yc === 0 && wa !== null) {
      ma !== null && (ma.status = "fulfilled");
      var l = wa;
      wa = null, ha = 0, ma = null;
      for (var t = 0; t < l.length; t++) (0, l[t])();
    }
  }
  function t0(l, t) {
    var e = [], a = {
      status: "pending",
      value: null,
      reason: null,
      then: function(n) {
        e.push(n);
      }
    };
    return l.then(
      function() {
        a.status = "fulfilled", a.value = t;
        for (var n = 0; n < e.length; n++) (0, e[n])(t);
      },
      function(n) {
        for (a.status = "rejected", a.reason = n, n = 0; n < e.length; n++)
          (0, e[n])(void 0);
      }
    ), a;
  }
  var Dh = S.S;
  S.S = function(l, t) {
    rs = ct(), typeof t == "object" && t !== null && typeof t.then == "function" && l0(l, t), Dh !== null && Dh(l, t);
  };
  var Ge = s(null);
  function Gc() {
    var l = Ge.current;
    return l !== null ? l : dl.pooledCache;
  }
  function Fn(l, t) {
    t === null ? O(Ge, Ge.current) : O(Ge, t.pool);
  }
  function Uh() {
    var l = Gc();
    return l === null ? null : { parent: Cl._currentValue, pool: l };
  }
  var sa = Error(o(460)), xc = Error(o(474)), Wn = Error(o(542)), $n = { then: function() {
  } };
  function Ch(l) {
    return l = l.status, l === "fulfilled" || l === "rejected";
  }
  function Hh(l, t, e) {
    switch (e = l[e], e === void 0 ? l.push(t) : e !== t && (t.then(Gt, Gt), t = e), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw l = t.reason, Bh(l), l;
      default:
        if (typeof t.status == "string") t.then(Gt, Gt);
        else {
          if (l = dl, l !== null && 100 < l.shellSuspendCounter)
            throw Error(o(482));
          l = t, l.status = "pending", l.then(
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
            throw l = t.reason, Bh(l), l;
        }
        throw Le = t, sa;
    }
  }
  function xe(l) {
    try {
      var t = l._init;
      return t(l._payload);
    } catch (e) {
      throw e !== null && typeof e == "object" && typeof e.then == "function" ? (Le = e, sa) : e;
    }
  }
  var Le = null;
  function qh() {
    if (Le === null) throw Error(o(459));
    var l = Le;
    return Le = null, l;
  }
  function Bh(l) {
    if (l === sa || l === Wn)
      throw Error(o(483));
  }
  var ra = null, Fa = 0;
  function In(l) {
    var t = Fa;
    return Fa += 1, ra === null && (ra = []), Hh(ra, l, t);
  }
  function Wa(l, t) {
    t = t.props.ref, l.ref = t !== void 0 ? t : null;
  }
  function Pn(l, t) {
    throw t.$$typeof === tl ? Error(o(525)) : (l = Object.prototype.toString.call(t), Error(
      o(
        31,
        l === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : l
      )
    ));
  }
  function Rh(l) {
    function t(d, m) {
      if (l) {
        var v = d.deletions;
        v === null ? (d.deletions = [m], d.flags |= 16) : v.push(m);
      }
    }
    function e(d, m) {
      if (!l) return null;
      for (; m !== null; )
        t(d, m), m = m.sibling;
      return null;
    }
    function a(d) {
      for (var m = /* @__PURE__ */ new Map(); d !== null; )
        d.key !== null ? m.set(d.key, d) : m.set(d.index, d), d = d.sibling;
      return m;
    }
    function n(d, m) {
      return d = Lt(d, m), d.index = 0, d.sibling = null, d;
    }
    function u(d, m, v) {
      return d.index = v, l ? (v = d.alternate, v !== null ? (v = v.index, v < m ? (d.flags |= 67108866, m) : v) : (d.flags |= 67108866, m)) : (d.flags |= 1048576, m);
    }
    function c(d) {
      return l && d.alternate === null && (d.flags |= 67108866), d;
    }
    function f(d, m, v, p) {
      return m === null || m.tag !== 6 ? (m = Nc(v, d.mode, p), m.return = d, m) : (m = n(m, v), m.return = d, m);
    }
    function h(d, m, v, p) {
      var B = v.type;
      return B === gl ? b(
        d,
        m,
        v.props.children,
        p,
        v.key
      ) : m !== null && (m.elementType === B || typeof B == "object" && B !== null && B.$$typeof === _l && xe(B) === m.type) ? (m = n(m, v.props), Wa(m, v), m.return = d, m) : (m = Kn(
        v.type,
        v.key,
        v.props,
        null,
        d.mode,
        p
      ), Wa(m, v), m.return = d, m);
    }
    function y(d, m, v, p) {
      return m === null || m.tag !== 4 || m.stateNode.containerInfo !== v.containerInfo || m.stateNode.implementation !== v.implementation ? (m = _c(v, d.mode, p), m.return = d, m) : (m = n(m, v.children || []), m.return = d, m);
    }
    function b(d, m, v, p, B) {
      return m === null || m.tag !== 7 ? (m = qe(
        v,
        d.mode,
        p,
        B
      ), m.return = d, m) : (m = n(m, v), m.return = d, m);
    }
    function T(d, m, v) {
      if (typeof m == "string" && m !== "" || typeof m == "number" || typeof m == "bigint")
        return m = Nc(
          "" + m,
          d.mode,
          v
        ), m.return = d, m;
      if (typeof m == "object" && m !== null) {
        switch (m.$$typeof) {
          case Ml:
            return v = Kn(
              m.type,
              m.key,
              m.props,
              null,
              d.mode,
              v
            ), Wa(v, m), v.return = d, v;
          case Nl:
            return m = _c(
              m,
              d.mode,
              v
            ), m.return = d, m;
          case _l:
            return m = xe(m), T(d, m, v);
        }
        if (_t(m) || Y(m))
          return m = qe(
            m,
            d.mode,
            v,
            null
          ), m.return = d, m;
        if (typeof m.then == "function")
          return T(d, In(m), v);
        if (m.$$typeof === pl)
          return T(
            d,
            wn(d, m),
            v
          );
        Pn(d, m);
      }
      return null;
    }
    function g(d, m, v, p) {
      var B = m !== null ? m.key : null;
      if (typeof v == "string" && v !== "" || typeof v == "number" || typeof v == "bigint")
        return B !== null ? null : f(d, m, "" + v, p);
      if (typeof v == "object" && v !== null) {
        switch (v.$$typeof) {
          case Ml:
            return v.key === B ? h(d, m, v, p) : null;
          case Nl:
            return v.key === B ? y(d, m, v, p) : null;
          case _l:
            return v = xe(v), g(d, m, v, p);
        }
        if (_t(v) || Y(v))
          return B !== null ? null : b(d, m, v, p, null);
        if (typeof v.then == "function")
          return g(
            d,
            m,
            In(v),
            p
          );
        if (v.$$typeof === pl)
          return g(
            d,
            m,
            wn(d, v),
            p
          );
        Pn(d, v);
      }
      return null;
    }
    function E(d, m, v, p, B) {
      if (typeof p == "string" && p !== "" || typeof p == "number" || typeof p == "bigint")
        return d = d.get(v) || null, f(m, d, "" + p, B);
      if (typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case Ml:
            return d = d.get(
              p.key === null ? v : p.key
            ) || null, h(m, d, p, B);
          case Nl:
            return d = d.get(
              p.key === null ? v : p.key
            ) || null, y(m, d, p, B);
          case _l:
            return p = xe(p), E(
              d,
              m,
              v,
              p,
              B
            );
        }
        if (_t(p) || Y(p))
          return d = d.get(v) || null, b(m, d, p, B, null);
        if (typeof p.then == "function")
          return E(
            d,
            m,
            v,
            In(p),
            B
          );
        if (p.$$typeof === pl)
          return E(
            d,
            m,
            v,
            wn(m, p),
            B
          );
        Pn(m, p);
      }
      return null;
    }
    function D(d, m, v, p) {
      for (var B = null, el = null, H = m, K = m = 0, I = null; H !== null && K < v.length; K++) {
        H.index > K ? (I = H, H = null) : I = H.sibling;
        var al = g(
          d,
          H,
          v[K],
          p
        );
        if (al === null) {
          H === null && (H = I);
          break;
        }
        l && H && al.alternate === null && t(d, H), m = u(al, m, K), el === null ? B = al : el.sibling = al, el = al, H = I;
      }
      if (K === v.length)
        return e(d, H), ll && Xt(d, K), B;
      if (H === null) {
        for (; K < v.length; K++)
          H = T(d, v[K], p), H !== null && (m = u(
            H,
            m,
            K
          ), el === null ? B = H : el.sibling = H, el = H);
        return ll && Xt(d, K), B;
      }
      for (H = a(H); K < v.length; K++)
        I = E(
          H,
          d,
          K,
          v[K],
          p
        ), I !== null && (l && I.alternate !== null && H.delete(
          I.key === null ? K : I.key
        ), m = u(
          I,
          m,
          K
        ), el === null ? B = I : el.sibling = I, el = I);
      return l && H.forEach(function(Me) {
        return t(d, Me);
      }), ll && Xt(d, K), B;
    }
    function G(d, m, v, p) {
      if (v == null) throw Error(o(151));
      for (var B = null, el = null, H = m, K = m = 0, I = null, al = v.next(); H !== null && !al.done; K++, al = v.next()) {
        H.index > K ? (I = H, H = null) : I = H.sibling;
        var Me = g(d, H, al.value, p);
        if (Me === null) {
          H === null && (H = I);
          break;
        }
        l && H && Me.alternate === null && t(d, H), m = u(Me, m, K), el === null ? B = Me : el.sibling = Me, el = Me, H = I;
      }
      if (al.done)
        return e(d, H), ll && Xt(d, K), B;
      if (H === null) {
        for (; !al.done; K++, al = v.next())
          al = T(d, al.value, p), al !== null && (m = u(al, m, K), el === null ? B = al : el.sibling = al, el = al);
        return ll && Xt(d, K), B;
      }
      for (H = a(H); !al.done; K++, al = v.next())
        al = E(H, d, K, al.value, p), al !== null && (l && al.alternate !== null && H.delete(al.key === null ? K : al.key), m = u(al, m, K), el === null ? B = al : el.sibling = al, el = al);
      return l && H.forEach(function(rd) {
        return t(d, rd);
      }), ll && Xt(d, K), B;
    }
    function rl(d, m, v, p) {
      if (typeof v == "object" && v !== null && v.type === gl && v.key === null && (v = v.props.children), typeof v == "object" && v !== null) {
        switch (v.$$typeof) {
          case Ml:
            l: {
              for (var B = v.key; m !== null; ) {
                if (m.key === B) {
                  if (B = v.type, B === gl) {
                    if (m.tag === 7) {
                      e(
                        d,
                        m.sibling
                      ), p = n(
                        m,
                        v.props.children
                      ), p.return = d, d = p;
                      break l;
                    }
                  } else if (m.elementType === B || typeof B == "object" && B !== null && B.$$typeof === _l && xe(B) === m.type) {
                    e(
                      d,
                      m.sibling
                    ), p = n(m, v.props), Wa(p, v), p.return = d, d = p;
                    break l;
                  }
                  e(d, m);
                  break;
                } else t(d, m);
                m = m.sibling;
              }
              v.type === gl ? (p = qe(
                v.props.children,
                d.mode,
                p,
                v.key
              ), p.return = d, d = p) : (p = Kn(
                v.type,
                v.key,
                v.props,
                null,
                d.mode,
                p
              ), Wa(p, v), p.return = d, d = p);
            }
            return c(d);
          case Nl:
            l: {
              for (B = v.key; m !== null; ) {
                if (m.key === B)
                  if (m.tag === 4 && m.stateNode.containerInfo === v.containerInfo && m.stateNode.implementation === v.implementation) {
                    e(
                      d,
                      m.sibling
                    ), p = n(m, v.children || []), p.return = d, d = p;
                    break l;
                  } else {
                    e(d, m);
                    break;
                  }
                else t(d, m);
                m = m.sibling;
              }
              p = _c(v, d.mode, p), p.return = d, d = p;
            }
            return c(d);
          case _l:
            return v = xe(v), rl(
              d,
              m,
              v,
              p
            );
        }
        if (_t(v))
          return D(
            d,
            m,
            v,
            p
          );
        if (Y(v)) {
          if (B = Y(v), typeof B != "function") throw Error(o(150));
          return v = B.call(v), G(
            d,
            m,
            v,
            p
          );
        }
        if (typeof v.then == "function")
          return rl(
            d,
            m,
            In(v),
            p
          );
        if (v.$$typeof === pl)
          return rl(
            d,
            m,
            wn(d, v),
            p
          );
        Pn(d, v);
      }
      return typeof v == "string" && v !== "" || typeof v == "number" || typeof v == "bigint" ? (v = "" + v, m !== null && m.tag === 6 ? (e(d, m.sibling), p = n(m, v), p.return = d, d = p) : (e(d, m), p = Nc(v, d.mode, p), p.return = d, d = p), c(d)) : e(d, m);
    }
    return function(d, m, v, p) {
      try {
        Fa = 0;
        var B = rl(
          d,
          m,
          v,
          p
        );
        return ra = null, B;
      } catch (H) {
        if (H === sa || H === Wn) throw H;
        var el = mt(29, H, null, d.mode);
        return el.lanes = p, el.return = d, el;
      } finally {
      }
    };
  }
  var Xe = Rh(!0), Yh = Rh(!1), fe = !1;
  function Lc(l) {
    l.updateQueue = {
      baseState: l.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Xc(l, t) {
    l = l.updateQueue, t.updateQueue === l && (t.updateQueue = {
      baseState: l.baseState,
      firstBaseUpdate: l.firstBaseUpdate,
      lastBaseUpdate: l.lastBaseUpdate,
      shared: l.shared,
      callbacks: null
    });
  }
  function he(l) {
    return { lane: l, tag: 0, payload: null, callback: null, next: null };
  }
  function me(l, t, e) {
    var a = l.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (nl & 2) !== 0) {
      var n = a.pending;
      return n === null ? t.next = t : (t.next = n.next, n.next = t), a.pending = t, t = Vn(l), bh(l, null, e), t;
    }
    return Zn(l, a, t, e), Vn(l);
  }
  function $a(l, t, e) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (e & 4194048) !== 0)) {
      var a = t.lanes;
      a &= l.pendingLanes, e |= a, t.lanes = e, _f(l, e);
    }
  }
  function Qc(l, t) {
    var e = l.updateQueue, a = l.alternate;
    if (a !== null && (a = a.updateQueue, e === a)) {
      var n = null, u = null;
      if (e = e.firstBaseUpdate, e !== null) {
        do {
          var c = {
            lane: e.lane,
            tag: e.tag,
            payload: e.payload,
            callback: null,
            next: null
          };
          u === null ? n = u = c : u = u.next = c, e = e.next;
        } while (e !== null);
        u === null ? n = u = t : u = u.next = t;
      } else n = u = t;
      e = {
        baseState: a.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: u,
        shared: a.shared,
        callbacks: a.callbacks
      }, l.updateQueue = e;
      return;
    }
    l = e.lastBaseUpdate, l === null ? e.firstBaseUpdate = t : l.next = t, e.lastBaseUpdate = t;
  }
  var jc = !1;
  function Ia() {
    if (jc) {
      var l = ma;
      if (l !== null) throw l;
    }
  }
  function Pa(l, t, e, a) {
    jc = !1;
    var n = l.updateQueue;
    fe = !1;
    var u = n.firstBaseUpdate, c = n.lastBaseUpdate, f = n.shared.pending;
    if (f !== null) {
      n.shared.pending = null;
      var h = f, y = h.next;
      h.next = null, c === null ? u = y : c.next = y, c = h;
      var b = l.alternate;
      b !== null && (b = b.updateQueue, f = b.lastBaseUpdate, f !== c && (f === null ? b.firstBaseUpdate = y : f.next = y, b.lastBaseUpdate = h));
    }
    if (u !== null) {
      var T = n.baseState;
      c = 0, b = y = h = null, f = u;
      do {
        var g = f.lane & -536870913, E = g !== f.lane;
        if (E ? ($ & g) === g : (a & g) === g) {
          g !== 0 && g === ha && (jc = !0), b !== null && (b = b.next = {
            lane: 0,
            tag: f.tag,
            payload: f.payload,
            callback: null,
            next: null
          });
          l: {
            var D = l, G = f;
            g = t;
            var rl = e;
            switch (G.tag) {
              case 1:
                if (D = G.payload, typeof D == "function") {
                  T = D.call(rl, T, g);
                  break l;
                }
                T = D;
                break l;
              case 3:
                D.flags = D.flags & -65537 | 128;
              case 0:
                if (D = G.payload, g = typeof D == "function" ? D.call(rl, T, g) : D, g == null) break l;
                T = q({}, T, g);
                break l;
              case 2:
                fe = !0;
            }
          }
          g = f.callback, g !== null && (l.flags |= 64, E && (l.flags |= 8192), E = n.callbacks, E === null ? n.callbacks = [g] : E.push(g));
        } else
          E = {
            lane: g,
            tag: f.tag,
            payload: f.payload,
            callback: f.callback,
            next: null
          }, b === null ? (y = b = E, h = T) : b = b.next = E, c |= g;
        if (f = f.next, f === null) {
          if (f = n.shared.pending, f === null)
            break;
          E = f, f = E.next, E.next = null, n.lastBaseUpdate = E, n.shared.pending = null;
        }
      } while (!0);
      b === null && (h = T), n.baseState = h, n.firstBaseUpdate = y, n.lastBaseUpdate = b, u === null && (n.shared.lanes = 0), ve |= c, l.lanes = c, l.memoizedState = T;
    }
  }
  function Gh(l, t) {
    if (typeof l != "function")
      throw Error(o(191, l));
    l.call(t);
  }
  function xh(l, t) {
    var e = l.callbacks;
    if (e !== null)
      for (l.callbacks = null, l = 0; l < e.length; l++)
        Gh(e[l], t);
  }
  var oa = s(null), lu = s(0);
  function Lh(l, t) {
    l = $t, O(lu, l), O(oa, t), $t = l | t.baseLanes;
  }
  function Zc() {
    O(lu, $t), O(oa, oa.current);
  }
  function Vc() {
    $t = lu.current, A(oa), A(lu);
  }
  var st = s(null), Tt = null;
  function se(l) {
    var t = l.alternate;
    O(Dl, Dl.current & 1), O(st, l), Tt === null && (t === null || oa.current !== null || t.memoizedState !== null) && (Tt = l);
  }
  function Kc(l) {
    O(Dl, Dl.current), O(st, l), Tt === null && (Tt = l);
  }
  function Xh(l) {
    l.tag === 22 ? (O(Dl, Dl.current), O(st, l), Tt === null && (Tt = l)) : re();
  }
  function re() {
    O(Dl, Dl.current), O(st, st.current);
  }
  function rt(l) {
    A(st), Tt === l && (Tt = null), A(Dl);
  }
  var Dl = s(0);
  function tu(l) {
    for (var t = l; t !== null; ) {
      if (t.tag === 13) {
        var e = t.memoizedState;
        if (e !== null && (e = e.dehydrated, e === null || $i(e) || Ii(e)))
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
  var Zt = 0, V = null, ml = null, Hl = null, eu = !1, da = !1, Qe = !1, au = 0, ln = 0, va = null, e0 = 0;
  function Tl() {
    throw Error(o(321));
  }
  function Jc(l, t) {
    if (t === null) return !1;
    for (var e = 0; e < t.length && e < l.length; e++)
      if (!ht(l[e], t[e])) return !1;
    return !0;
  }
  function kc(l, t, e, a, n, u) {
    return Zt = u, V = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, S.H = l === null || l.memoizedState === null ? Tm : fi, Qe = !1, u = e(a, n), Qe = !1, da && (u = jh(
      t,
      e,
      a,
      n
    )), Qh(l), u;
  }
  function Qh(l) {
    S.H = an;
    var t = ml !== null && ml.next !== null;
    if (Zt = 0, Hl = ml = V = null, eu = !1, ln = 0, va = null, t) throw Error(o(300));
    l === null || ql || (l = l.dependencies, l !== null && kn(l) && (ql = !0));
  }
  function jh(l, t, e, a) {
    V = l;
    var n = 0;
    do {
      if (da && (va = null), ln = 0, da = !1, 25 <= n) throw Error(o(301));
      if (n += 1, Hl = ml = null, l.updateQueue != null) {
        var u = l.updateQueue;
        u.lastEffect = null, u.events = null, u.stores = null, u.memoCache != null && (u.memoCache.index = 0);
      }
      S.H = Am, u = t(e, a);
    } while (da);
    return u;
  }
  function a0() {
    var l = S.H, t = l.useState()[0];
    return t = typeof t.then == "function" ? tn(t) : t, l = l.useState()[0], (ml !== null ? ml.memoizedState : null) !== l && (V.flags |= 1024), t;
  }
  function wc() {
    var l = au !== 0;
    return au = 0, l;
  }
  function Fc(l, t, e) {
    t.updateQueue = l.updateQueue, t.flags &= -2053, l.lanes &= ~e;
  }
  function Wc(l) {
    if (eu) {
      for (l = l.memoizedState; l !== null; ) {
        var t = l.queue;
        t !== null && (t.pending = null), l = l.next;
      }
      eu = !1;
    }
    Zt = 0, Hl = ml = V = null, da = !1, ln = au = 0, va = null;
  }
  function $l() {
    var l = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Hl === null ? V.memoizedState = Hl = l : Hl = Hl.next = l, Hl;
  }
  function Ul() {
    if (ml === null) {
      var l = V.alternate;
      l = l !== null ? l.memoizedState : null;
    } else l = ml.next;
    var t = Hl === null ? V.memoizedState : Hl.next;
    if (t !== null)
      Hl = t, ml = l;
    else {
      if (l === null)
        throw V.alternate === null ? Error(o(467)) : Error(o(310));
      ml = l, l = {
        memoizedState: ml.memoizedState,
        baseState: ml.baseState,
        baseQueue: ml.baseQueue,
        queue: ml.queue,
        next: null
      }, Hl === null ? V.memoizedState = Hl = l : Hl = Hl.next = l;
    }
    return Hl;
  }
  function nu() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function tn(l) {
    var t = ln;
    return ln += 1, va === null && (va = []), l = Hh(va, l, t), t = V, (Hl === null ? t.memoizedState : Hl.next) === null && (t = t.alternate, S.H = t === null || t.memoizedState === null ? Tm : fi), l;
  }
  function uu(l) {
    if (l !== null && typeof l == "object") {
      if (typeof l.then == "function") return tn(l);
      if (l.$$typeof === pl) return jl(l);
    }
    throw Error(o(438, String(l)));
  }
  function $c(l) {
    var t = null, e = V.updateQueue;
    if (e !== null && (t = e.memoCache), t == null) {
      var a = V.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(n) {
          return n.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), e === null && (e = nu(), V.updateQueue = e), e.memoCache = t, e = t.data[t.index], e === void 0)
      for (e = t.data[t.index] = Array(l), a = 0; a < l; a++)
        e[a] = le;
    return t.index++, e;
  }
  function Vt(l, t) {
    return typeof t == "function" ? t(l) : t;
  }
  function cu(l) {
    var t = Ul();
    return Ic(t, ml, l);
  }
  function Ic(l, t, e) {
    var a = l.queue;
    if (a === null) throw Error(o(311));
    a.lastRenderedReducer = e;
    var n = l.baseQueue, u = a.pending;
    if (u !== null) {
      if (n !== null) {
        var c = n.next;
        n.next = u.next, u.next = c;
      }
      t.baseQueue = n = u, a.pending = null;
    }
    if (u = l.baseState, n === null) l.memoizedState = u;
    else {
      t = n.next;
      var f = c = null, h = null, y = t, b = !1;
      do {
        var T = y.lane & -536870913;
        if (T !== y.lane ? ($ & T) === T : (Zt & T) === T) {
          var g = y.revertLane;
          if (g === 0)
            h !== null && (h = h.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: y.action,
              hasEagerState: y.hasEagerState,
              eagerState: y.eagerState,
              next: null
            }), T === ha && (b = !0);
          else if ((Zt & g) === g) {
            y = y.next, g === ha && (b = !0);
            continue;
          } else
            T = {
              lane: 0,
              revertLane: y.revertLane,
              gesture: null,
              action: y.action,
              hasEagerState: y.hasEagerState,
              eagerState: y.eagerState,
              next: null
            }, h === null ? (f = h = T, c = u) : h = h.next = T, V.lanes |= g, ve |= g;
          T = y.action, Qe && e(u, T), u = y.hasEagerState ? y.eagerState : e(u, T);
        } else
          g = {
            lane: T,
            revertLane: y.revertLane,
            gesture: y.gesture,
            action: y.action,
            hasEagerState: y.hasEagerState,
            eagerState: y.eagerState,
            next: null
          }, h === null ? (f = h = g, c = u) : h = h.next = g, V.lanes |= T, ve |= T;
        y = y.next;
      } while (y !== null && y !== t);
      if (h === null ? c = u : h.next = f, !ht(u, l.memoizedState) && (ql = !0, b && (e = ma, e !== null)))
        throw e;
      l.memoizedState = u, l.baseState = c, l.baseQueue = h, a.lastRenderedState = u;
    }
    return n === null && (a.lanes = 0), [l.memoizedState, a.dispatch];
  }
  function Pc(l) {
    var t = Ul(), e = t.queue;
    if (e === null) throw Error(o(311));
    e.lastRenderedReducer = l;
    var a = e.dispatch, n = e.pending, u = t.memoizedState;
    if (n !== null) {
      e.pending = null;
      var c = n = n.next;
      do
        u = l(u, c.action), c = c.next;
      while (c !== n);
      ht(u, t.memoizedState) || (ql = !0), t.memoizedState = u, t.baseQueue === null && (t.baseState = u), e.lastRenderedState = u;
    }
    return [u, a];
  }
  function Zh(l, t, e) {
    var a = V, n = Ul(), u = ll;
    if (u) {
      if (e === void 0) throw Error(o(407));
      e = e();
    } else e = t();
    var c = !ht(
      (ml || n).memoizedState,
      e
    );
    if (c && (n.memoizedState = e, ql = !0), n = n.queue, ei(Jh.bind(null, a, n, l), [
      l
    ]), n.getSnapshot !== t || c || Hl !== null && Hl.memoizedState.tag & 1) {
      if (a.flags |= 2048, ya(
        9,
        { destroy: void 0 },
        Kh.bind(
          null,
          a,
          n,
          e,
          t
        ),
        null
      ), dl === null) throw Error(o(349));
      u || (Zt & 127) !== 0 || Vh(a, t, e);
    }
    return e;
  }
  function Vh(l, t, e) {
    l.flags |= 16384, l = { getSnapshot: t, value: e }, t = V.updateQueue, t === null ? (t = nu(), V.updateQueue = t, t.stores = [l]) : (e = t.stores, e === null ? t.stores = [l] : e.push(l));
  }
  function Kh(l, t, e, a) {
    t.value = e, t.getSnapshot = a, kh(t) && wh(l);
  }
  function Jh(l, t, e) {
    return e(function() {
      kh(t) && wh(l);
    });
  }
  function kh(l) {
    var t = l.getSnapshot;
    l = l.value;
    try {
      var e = t();
      return !ht(l, e);
    } catch {
      return !0;
    }
  }
  function wh(l) {
    var t = He(l, 2);
    t !== null && ut(t, l, 2);
  }
  function li(l) {
    var t = $l();
    if (typeof l == "function") {
      var e = l;
      if (l = e(), Qe) {
        te(!0);
        try {
          e();
        } finally {
          te(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = l, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Vt,
      lastRenderedState: l
    }, t;
  }
  function Fh(l, t, e, a) {
    return l.baseState = e, Ic(
      l,
      ml,
      typeof a == "function" ? a : Vt
    );
  }
  function n0(l, t, e, a, n) {
    if (hu(l)) throw Error(o(485));
    if (l = t.action, l !== null) {
      var u = {
        payload: n,
        action: l,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(c) {
          u.listeners.push(c);
        }
      };
      S.T !== null ? e(!0) : u.isTransition = !1, a(u), e = t.pending, e === null ? (u.next = t.pending = u, Wh(t, u)) : (u.next = e.next, t.pending = e.next = u);
    }
  }
  function Wh(l, t) {
    var e = t.action, a = t.payload, n = l.state;
    if (t.isTransition) {
      var u = S.T, c = {};
      S.T = c;
      try {
        var f = e(n, a), h = S.S;
        h !== null && h(c, f), $h(l, t, f);
      } catch (y) {
        ti(l, t, y);
      } finally {
        u !== null && c.types !== null && (u.types = c.types), S.T = u;
      }
    } else
      try {
        u = e(n, a), $h(l, t, u);
      } catch (y) {
        ti(l, t, y);
      }
  }
  function $h(l, t, e) {
    e !== null && typeof e == "object" && typeof e.then == "function" ? e.then(
      function(a) {
        Ih(l, t, a);
      },
      function(a) {
        return ti(l, t, a);
      }
    ) : Ih(l, t, e);
  }
  function Ih(l, t, e) {
    t.status = "fulfilled", t.value = e, Ph(t), l.state = e, t = l.pending, t !== null && (e = t.next, e === t ? l.pending = null : (e = e.next, t.next = e, Wh(l, e)));
  }
  function ti(l, t, e) {
    var a = l.pending;
    if (l.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = e, Ph(t), t = t.next;
      while (t !== a);
    }
    l.action = null;
  }
  function Ph(l) {
    l = l.listeners;
    for (var t = 0; t < l.length; t++) (0, l[t])();
  }
  function lm(l, t) {
    return t;
  }
  function tm(l, t) {
    if (ll) {
      var e = dl.formState;
      if (e !== null) {
        l: {
          var a = V;
          if (ll) {
            if (El) {
              t: {
                for (var n = El, u = zt; n.nodeType !== 8; ) {
                  if (!u) {
                    n = null;
                    break t;
                  }
                  if (n = At(
                    n.nextSibling
                  ), n === null) {
                    n = null;
                    break t;
                  }
                }
                u = n.data, n = u === "F!" || u === "F" ? n : null;
              }
              if (n) {
                El = At(
                  n.nextSibling
                ), a = n.data === "F!";
                break l;
              }
            }
            ce(a);
          }
          a = !1;
        }
        a && (t = e[0]);
      }
    }
    return e = $l(), e.memoizedState = e.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: lm,
      lastRenderedState: t
    }, e.queue = a, e = Sm.bind(
      null,
      V,
      a
    ), a.dispatch = e, a = li(!1), u = ii.bind(
      null,
      V,
      !1,
      a.queue
    ), a = $l(), n = {
      state: t,
      dispatch: null,
      action: l,
      pending: null
    }, a.queue = n, e = n0.bind(
      null,
      V,
      n,
      u,
      e
    ), n.dispatch = e, a.memoizedState = l, [t, e, !1];
  }
  function em(l) {
    var t = Ul();
    return am(t, ml, l);
  }
  function am(l, t, e) {
    if (t = Ic(
      l,
      t,
      lm
    )[0], l = cu(Vt)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = tn(t);
      } catch (c) {
        throw c === sa ? Wn : c;
      }
    else a = t;
    t = Ul();
    var n = t.queue, u = n.dispatch;
    return e !== t.memoizedState && (V.flags |= 2048, ya(
      9,
      { destroy: void 0 },
      u0.bind(null, n, e),
      null
    )), [a, u, l];
  }
  function u0(l, t) {
    l.action = t;
  }
  function nm(l) {
    var t = Ul(), e = ml;
    if (e !== null)
      return am(t, e, l);
    Ul(), t = t.memoizedState, e = Ul();
    var a = e.queue.dispatch;
    return e.memoizedState = l, [t, a, !1];
  }
  function ya(l, t, e, a) {
    return l = { tag: l, create: e, deps: a, inst: t, next: null }, t = V.updateQueue, t === null && (t = nu(), V.updateQueue = t), e = t.lastEffect, e === null ? t.lastEffect = l.next = l : (a = e.next, e.next = l, l.next = a, t.lastEffect = l), l;
  }
  function um() {
    return Ul().memoizedState;
  }
  function iu(l, t, e, a) {
    var n = $l();
    V.flags |= l, n.memoizedState = ya(
      1 | t,
      { destroy: void 0 },
      e,
      a === void 0 ? null : a
    );
  }
  function fu(l, t, e, a) {
    var n = Ul();
    a = a === void 0 ? null : a;
    var u = n.memoizedState.inst;
    ml !== null && a !== null && Jc(a, ml.memoizedState.deps) ? n.memoizedState = ya(t, u, e, a) : (V.flags |= l, n.memoizedState = ya(
      1 | t,
      u,
      e,
      a
    ));
  }
  function cm(l, t) {
    iu(8390656, 8, l, t);
  }
  function ei(l, t) {
    fu(2048, 8, l, t);
  }
  function c0(l) {
    V.flags |= 4;
    var t = V.updateQueue;
    if (t === null)
      t = nu(), V.updateQueue = t, t.events = [l];
    else {
      var e = t.events;
      e === null ? t.events = [l] : e.push(l);
    }
  }
  function im(l) {
    var t = Ul().memoizedState;
    return c0({ ref: t, nextImpl: l }), function() {
      if ((nl & 2) !== 0) throw Error(o(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function fm(l, t) {
    return fu(4, 2, l, t);
  }
  function hm(l, t) {
    return fu(4, 4, l, t);
  }
  function mm(l, t) {
    if (typeof t == "function") {
      l = l();
      var e = t(l);
      return function() {
        typeof e == "function" ? e() : t(null);
      };
    }
    if (t != null)
      return l = l(), t.current = l, function() {
        t.current = null;
      };
  }
  function sm(l, t, e) {
    e = e != null ? e.concat([l]) : null, fu(4, 4, mm.bind(null, t, l), e);
  }
  function ai() {
  }
  function rm(l, t) {
    var e = Ul();
    t = t === void 0 ? null : t;
    var a = e.memoizedState;
    return t !== null && Jc(t, a[1]) ? a[0] : (e.memoizedState = [l, t], l);
  }
  function om(l, t) {
    var e = Ul();
    t = t === void 0 ? null : t;
    var a = e.memoizedState;
    if (t !== null && Jc(t, a[1]))
      return a[0];
    if (a = l(), Qe) {
      te(!0);
      try {
        l();
      } finally {
        te(!1);
      }
    }
    return e.memoizedState = [a, t], a;
  }
  function ni(l, t, e) {
    return e === void 0 || (Zt & 1073741824) !== 0 && ($ & 261930) === 0 ? l.memoizedState = t : (l.memoizedState = e, l = ds(), V.lanes |= l, ve |= l, e);
  }
  function dm(l, t, e, a) {
    return ht(e, t) ? e : oa.current !== null ? (l = ni(l, e, a), ht(l, t) || (ql = !0), l) : (Zt & 42) === 0 || (Zt & 1073741824) !== 0 && ($ & 261930) === 0 ? (ql = !0, l.memoizedState = e) : (l = ds(), V.lanes |= l, ve |= l, t);
  }
  function vm(l, t, e, a, n) {
    var u = _.p;
    _.p = u !== 0 && 8 > u ? u : 8;
    var c = S.T, f = {};
    S.T = f, ii(l, !1, t, e);
    try {
      var h = n(), y = S.S;
      if (y !== null && y(f, h), h !== null && typeof h == "object" && typeof h.then == "function") {
        var b = t0(
          h,
          a
        );
        en(
          l,
          t,
          b,
          vt(l)
        );
      } else
        en(
          l,
          t,
          a,
          vt(l)
        );
    } catch (T) {
      en(
        l,
        t,
        { then: function() {
        }, status: "rejected", reason: T },
        vt()
      );
    } finally {
      _.p = u, c !== null && f.types !== null && (c.types = f.types), S.T = c;
    }
  }
  function i0() {
  }
  function ui(l, t, e, a) {
    if (l.tag !== 5) throw Error(o(476));
    var n = ym(l).queue;
    vm(
      l,
      n,
      t,
      L,
      e === null ? i0 : function() {
        return gm(l), e(a);
      }
    );
  }
  function ym(l) {
    var t = l.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: L,
      baseState: L,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Vt,
        lastRenderedState: L
      },
      next: null
    };
    var e = {};
    return t.next = {
      memoizedState: e,
      baseState: e,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Vt,
        lastRenderedState: e
      },
      next: null
    }, l.memoizedState = t, l = l.alternate, l !== null && (l.memoizedState = t), t;
  }
  function gm(l) {
    var t = ym(l);
    t.next === null && (t = l.alternate.memoizedState), en(
      l,
      t.next.queue,
      {},
      vt()
    );
  }
  function ci() {
    return jl(Sn);
  }
  function Em() {
    return Ul().memoizedState;
  }
  function bm() {
    return Ul().memoizedState;
  }
  function f0(l) {
    for (var t = l.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var e = vt();
          l = he(e);
          var a = me(t, l, e);
          a !== null && (ut(a, t, e), $a(a, t, e)), t = { cache: Rc() }, l.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function h0(l, t, e) {
    var a = vt();
    e = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, hu(l) ? pm(t, e) : (e = Ac(l, t, e, a), e !== null && (ut(e, l, a), zm(e, t, a)));
  }
  function Sm(l, t, e) {
    var a = vt();
    en(l, t, e, a);
  }
  function en(l, t, e, a) {
    var n = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (hu(l)) pm(t, n);
    else {
      var u = l.alternate;
      if (l.lanes === 0 && (u === null || u.lanes === 0) && (u = t.lastRenderedReducer, u !== null))
        try {
          var c = t.lastRenderedState, f = u(c, e);
          if (n.hasEagerState = !0, n.eagerState = f, ht(f, c))
            return Zn(l, t, n, 0), dl === null && jn(), !1;
        } catch {
        } finally {
        }
      if (e = Ac(l, t, n, a), e !== null)
        return ut(e, l, a), zm(e, t, a), !0;
    }
    return !1;
  }
  function ii(l, t, e, a) {
    if (a = {
      lane: 2,
      revertLane: Li(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, hu(l)) {
      if (t) throw Error(o(479));
    } else
      t = Ac(
        l,
        e,
        a,
        2
      ), t !== null && ut(t, l, 2);
  }
  function hu(l) {
    var t = l.alternate;
    return l === V || t !== null && t === V;
  }
  function pm(l, t) {
    da = eu = !0;
    var e = l.pending;
    e === null ? t.next = t : (t.next = e.next, e.next = t), l.pending = t;
  }
  function zm(l, t, e) {
    if ((e & 4194048) !== 0) {
      var a = t.lanes;
      a &= l.pendingLanes, e |= a, t.lanes = e, _f(l, e);
    }
  }
  var an = {
    readContext: jl,
    use: uu,
    useCallback: Tl,
    useContext: Tl,
    useEffect: Tl,
    useImperativeHandle: Tl,
    useLayoutEffect: Tl,
    useInsertionEffect: Tl,
    useMemo: Tl,
    useReducer: Tl,
    useRef: Tl,
    useState: Tl,
    useDebugValue: Tl,
    useDeferredValue: Tl,
    useTransition: Tl,
    useSyncExternalStore: Tl,
    useId: Tl,
    useHostTransitionStatus: Tl,
    useFormState: Tl,
    useActionState: Tl,
    useOptimistic: Tl,
    useMemoCache: Tl,
    useCacheRefresh: Tl
  };
  an.useEffectEvent = Tl;
  var Tm = {
    readContext: jl,
    use: uu,
    useCallback: function(l, t) {
      return $l().memoizedState = [
        l,
        t === void 0 ? null : t
      ], l;
    },
    useContext: jl,
    useEffect: cm,
    useImperativeHandle: function(l, t, e) {
      e = e != null ? e.concat([l]) : null, iu(
        4194308,
        4,
        mm.bind(null, t, l),
        e
      );
    },
    useLayoutEffect: function(l, t) {
      return iu(4194308, 4, l, t);
    },
    useInsertionEffect: function(l, t) {
      iu(4, 2, l, t);
    },
    useMemo: function(l, t) {
      var e = $l();
      t = t === void 0 ? null : t;
      var a = l();
      if (Qe) {
        te(!0);
        try {
          l();
        } finally {
          te(!1);
        }
      }
      return e.memoizedState = [a, t], a;
    },
    useReducer: function(l, t, e) {
      var a = $l();
      if (e !== void 0) {
        var n = e(t);
        if (Qe) {
          te(!0);
          try {
            e(t);
          } finally {
            te(!1);
          }
        }
      } else n = t;
      return a.memoizedState = a.baseState = n, l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: l,
        lastRenderedState: n
      }, a.queue = l, l = l.dispatch = h0.bind(
        null,
        V,
        l
      ), [a.memoizedState, l];
    },
    useRef: function(l) {
      var t = $l();
      return l = { current: l }, t.memoizedState = l;
    },
    useState: function(l) {
      l = li(l);
      var t = l.queue, e = Sm.bind(null, V, t);
      return t.dispatch = e, [l.memoizedState, e];
    },
    useDebugValue: ai,
    useDeferredValue: function(l, t) {
      var e = $l();
      return ni(e, l, t);
    },
    useTransition: function() {
      var l = li(!1);
      return l = vm.bind(
        null,
        V,
        l.queue,
        !0,
        !1
      ), $l().memoizedState = l, [!1, l];
    },
    useSyncExternalStore: function(l, t, e) {
      var a = V, n = $l();
      if (ll) {
        if (e === void 0)
          throw Error(o(407));
        e = e();
      } else {
        if (e = t(), dl === null)
          throw Error(o(349));
        ($ & 127) !== 0 || Vh(a, t, e);
      }
      n.memoizedState = e;
      var u = { value: e, getSnapshot: t };
      return n.queue = u, cm(Jh.bind(null, a, u, l), [
        l
      ]), a.flags |= 2048, ya(
        9,
        { destroy: void 0 },
        Kh.bind(
          null,
          a,
          u,
          e,
          t
        ),
        null
      ), e;
    },
    useId: function() {
      var l = $l(), t = dl.identifierPrefix;
      if (ll) {
        var e = Ht, a = Ct;
        e = (a & ~(1 << 32 - ft(a) - 1)).toString(32) + e, t = "_" + t + "R_" + e, e = au++, 0 < e && (t += "H" + e.toString(32)), t += "_";
      } else
        e = e0++, t = "_" + t + "r_" + e.toString(32) + "_";
      return l.memoizedState = t;
    },
    useHostTransitionStatus: ci,
    useFormState: tm,
    useActionState: tm,
    useOptimistic: function(l) {
      var t = $l();
      t.memoizedState = t.baseState = l;
      var e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = e, t = ii.bind(
        null,
        V,
        !0,
        e
      ), e.dispatch = t, [l, t];
    },
    useMemoCache: $c,
    useCacheRefresh: function() {
      return $l().memoizedState = f0.bind(
        null,
        V
      );
    },
    useEffectEvent: function(l) {
      var t = $l(), e = { impl: l };
      return t.memoizedState = e, function() {
        if ((nl & 2) !== 0)
          throw Error(o(440));
        return e.impl.apply(void 0, arguments);
      };
    }
  }, fi = {
    readContext: jl,
    use: uu,
    useCallback: rm,
    useContext: jl,
    useEffect: ei,
    useImperativeHandle: sm,
    useInsertionEffect: fm,
    useLayoutEffect: hm,
    useMemo: om,
    useReducer: cu,
    useRef: um,
    useState: function() {
      return cu(Vt);
    },
    useDebugValue: ai,
    useDeferredValue: function(l, t) {
      var e = Ul();
      return dm(
        e,
        ml.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = cu(Vt)[0], t = Ul().memoizedState;
      return [
        typeof l == "boolean" ? l : tn(l),
        t
      ];
    },
    useSyncExternalStore: Zh,
    useId: Em,
    useHostTransitionStatus: ci,
    useFormState: em,
    useActionState: em,
    useOptimistic: function(l, t) {
      var e = Ul();
      return Fh(e, ml, l, t);
    },
    useMemoCache: $c,
    useCacheRefresh: bm
  };
  fi.useEffectEvent = im;
  var Am = {
    readContext: jl,
    use: uu,
    useCallback: rm,
    useContext: jl,
    useEffect: ei,
    useImperativeHandle: sm,
    useInsertionEffect: fm,
    useLayoutEffect: hm,
    useMemo: om,
    useReducer: Pc,
    useRef: um,
    useState: function() {
      return Pc(Vt);
    },
    useDebugValue: ai,
    useDeferredValue: function(l, t) {
      var e = Ul();
      return ml === null ? ni(e, l, t) : dm(
        e,
        ml.memoizedState,
        l,
        t
      );
    },
    useTransition: function() {
      var l = Pc(Vt)[0], t = Ul().memoizedState;
      return [
        typeof l == "boolean" ? l : tn(l),
        t
      ];
    },
    useSyncExternalStore: Zh,
    useId: Em,
    useHostTransitionStatus: ci,
    useFormState: nm,
    useActionState: nm,
    useOptimistic: function(l, t) {
      var e = Ul();
      return ml !== null ? Fh(e, ml, l, t) : (e.baseState = l, [l, e.queue.dispatch]);
    },
    useMemoCache: $c,
    useCacheRefresh: bm
  };
  Am.useEffectEvent = im;
  function hi(l, t, e, a) {
    t = l.memoizedState, e = e(a, t), e = e == null ? t : q({}, t, e), l.memoizedState = e, l.lanes === 0 && (l.updateQueue.baseState = e);
  }
  var mi = {
    enqueueSetState: function(l, t, e) {
      l = l._reactInternals;
      var a = vt(), n = he(a);
      n.payload = t, e != null && (n.callback = e), t = me(l, n, a), t !== null && (ut(t, l, a), $a(t, l, a));
    },
    enqueueReplaceState: function(l, t, e) {
      l = l._reactInternals;
      var a = vt(), n = he(a);
      n.tag = 1, n.payload = t, e != null && (n.callback = e), t = me(l, n, a), t !== null && (ut(t, l, a), $a(t, l, a));
    },
    enqueueForceUpdate: function(l, t) {
      l = l._reactInternals;
      var e = vt(), a = he(e);
      a.tag = 2, t != null && (a.callback = t), t = me(l, a, e), t !== null && (ut(t, l, e), $a(t, l, e));
    }
  };
  function Mm(l, t, e, a, n, u, c) {
    return l = l.stateNode, typeof l.shouldComponentUpdate == "function" ? l.shouldComponentUpdate(a, u, c) : t.prototype && t.prototype.isPureReactComponent ? !Za(e, a) || !Za(n, u) : !0;
  }
  function Nm(l, t, e, a) {
    l = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(e, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(e, a), t.state !== l && mi.enqueueReplaceState(t, t.state, null);
  }
  function je(l, t) {
    var e = t;
    if ("ref" in t) {
      e = {};
      for (var a in t)
        a !== "ref" && (e[a] = t[a]);
    }
    if (l = l.defaultProps) {
      e === t && (e = q({}, e));
      for (var n in l)
        e[n] === void 0 && (e[n] = l[n]);
    }
    return e;
  }
  function _m(l) {
    Qn(l);
  }
  function Om(l) {
    console.error(l);
  }
  function Dm(l) {
    Qn(l);
  }
  function mu(l, t) {
    try {
      var e = l.onUncaughtError;
      e(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function Um(l, t, e) {
    try {
      var a = l.onCaughtError;
      a(e.value, {
        componentStack: e.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  function si(l, t, e) {
    return e = he(e), e.tag = 3, e.payload = { element: null }, e.callback = function() {
      mu(l, t);
    }, e;
  }
  function Cm(l) {
    return l = he(l), l.tag = 3, l;
  }
  function Hm(l, t, e, a) {
    var n = e.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var u = a.value;
      l.payload = function() {
        return n(u);
      }, l.callback = function() {
        Um(t, e, a);
      };
    }
    var c = e.stateNode;
    c !== null && typeof c.componentDidCatch == "function" && (l.callback = function() {
      Um(t, e, a), typeof n != "function" && (ye === null ? ye = /* @__PURE__ */ new Set([this]) : ye.add(this));
      var f = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: f !== null ? f : ""
      });
    });
  }
  function m0(l, t, e, a, n) {
    if (e.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = e.alternate, t !== null && fa(
        t,
        e,
        n,
        !0
      ), e = st.current, e !== null) {
        switch (e.tag) {
          case 31:
          case 13:
            return Tt === null ? zu() : e.alternate === null && Al === 0 && (Al = 3), e.flags &= -257, e.flags |= 65536, e.lanes = n, a === $n ? e.flags |= 16384 : (t = e.updateQueue, t === null ? e.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), Yi(l, a, n)), !1;
          case 22:
            return e.flags |= 65536, a === $n ? e.flags |= 16384 : (t = e.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, e.updateQueue = t) : (e = t.retryQueue, e === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : e.add(a)), Yi(l, a, n)), !1;
        }
        throw Error(o(435, e.tag));
      }
      return Yi(l, a, n), zu(), !1;
    }
    if (ll)
      return t = st.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = n, a !== Uc && (l = Error(o(422), { cause: a }), Ja(bt(l, e)))) : (a !== Uc && (t = Error(o(423), {
        cause: a
      }), Ja(
        bt(t, e)
      )), l = l.current.alternate, l.flags |= 65536, n &= -n, l.lanes |= n, a = bt(a, e), n = si(
        l.stateNode,
        a,
        n
      ), Qc(l, n), Al !== 4 && (Al = 2)), !1;
    var u = Error(o(520), { cause: a });
    if (u = bt(u, e), rn === null ? rn = [u] : rn.push(u), Al !== 4 && (Al = 2), t === null) return !0;
    a = bt(a, e), e = t;
    do {
      switch (e.tag) {
        case 3:
          return e.flags |= 65536, l = n & -n, e.lanes |= l, l = si(e.stateNode, a, l), Qc(e, l), !1;
        case 1:
          if (t = e.type, u = e.stateNode, (e.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || u !== null && typeof u.componentDidCatch == "function" && (ye === null || !ye.has(u))))
            return e.flags |= 65536, n &= -n, e.lanes |= n, n = Cm(n), Hm(
              n,
              l,
              e,
              a
            ), Qc(e, n), !1;
      }
      e = e.return;
    } while (e !== null);
    return !1;
  }
  var ri = Error(o(461)), ql = !1;
  function Zl(l, t, e, a) {
    t.child = l === null ? Yh(t, null, e, a) : Xe(
      t,
      l.child,
      e,
      a
    );
  }
  function qm(l, t, e, a, n) {
    e = e.render;
    var u = t.ref;
    if ("ref" in a) {
      var c = {};
      for (var f in a)
        f !== "ref" && (c[f] = a[f]);
    } else c = a;
    return Ye(t), a = kc(
      l,
      t,
      e,
      c,
      u,
      n
    ), f = wc(), l !== null && !ql ? (Fc(l, t, n), Kt(l, t, n)) : (ll && f && Oc(t), t.flags |= 1, Zl(l, t, a, n), t.child);
  }
  function Bm(l, t, e, a, n) {
    if (l === null) {
      var u = e.type;
      return typeof u == "function" && !Mc(u) && u.defaultProps === void 0 && e.compare === null ? (t.tag = 15, t.type = u, Rm(
        l,
        t,
        u,
        a,
        n
      )) : (l = Kn(
        e.type,
        null,
        a,
        t,
        t.mode,
        n
      ), l.ref = t.ref, l.return = t, t.child = l);
    }
    if (u = l.child, !Si(l, n)) {
      var c = u.memoizedProps;
      if (e = e.compare, e = e !== null ? e : Za, e(c, a) && l.ref === t.ref)
        return Kt(l, t, n);
    }
    return t.flags |= 1, l = Lt(u, a), l.ref = t.ref, l.return = t, t.child = l;
  }
  function Rm(l, t, e, a, n) {
    if (l !== null) {
      var u = l.memoizedProps;
      if (Za(u, a) && l.ref === t.ref)
        if (ql = !1, t.pendingProps = a = u, Si(l, n))
          (l.flags & 131072) !== 0 && (ql = !0);
        else
          return t.lanes = l.lanes, Kt(l, t, n);
    }
    return oi(
      l,
      t,
      e,
      a,
      n
    );
  }
  function Ym(l, t, e, a) {
    var n = a.children, u = l !== null ? l.memoizedState : null;
    if (l === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (u = u !== null ? u.baseLanes | e : e, l !== null) {
          for (a = t.child = l.child, n = 0; a !== null; )
            n = n | a.lanes | a.childLanes, a = a.sibling;
          a = n & ~u;
        } else a = 0, t.child = null;
        return Gm(
          l,
          t,
          u,
          e,
          a
        );
      }
      if ((e & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, l !== null && Fn(
          t,
          u !== null ? u.cachePool : null
        ), u !== null ? Lh(t, u) : Zc(), Xh(t);
      else
        return a = t.lanes = 536870912, Gm(
          l,
          t,
          u !== null ? u.baseLanes | e : e,
          e,
          a
        );
    } else
      u !== null ? (Fn(t, u.cachePool), Lh(t, u), re(), t.memoizedState = null) : (l !== null && Fn(t, null), Zc(), re());
    return Zl(l, t, n, e), t.child;
  }
  function nn(l, t) {
    return l !== null && l.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function Gm(l, t, e, a, n) {
    var u = Gc();
    return u = u === null ? null : { parent: Cl._currentValue, pool: u }, t.memoizedState = {
      baseLanes: e,
      cachePool: u
    }, l !== null && Fn(t, null), Zc(), Xh(t), l !== null && fa(l, t, a, !0), t.childLanes = n, null;
  }
  function su(l, t) {
    return t = ou(
      { mode: t.mode, children: t.children },
      l.mode
    ), t.ref = l.ref, l.child = t, t.return = l, t;
  }
  function xm(l, t, e) {
    return Xe(t, l.child, null, e), l = su(t, t.pendingProps), l.flags |= 2, rt(t), t.memoizedState = null, l;
  }
  function s0(l, t, e) {
    var a = t.pendingProps, n = (t.flags & 128) !== 0;
    if (t.flags &= -129, l === null) {
      if (ll) {
        if (a.mode === "hidden")
          return l = su(t, a), t.lanes = 536870912, nn(null, l);
        if (Kc(t), (l = El) ? (l = Ws(
          l,
          zt
        ), l = l !== null && l.data === "&" ? l : null, l !== null && (t.memoizedState = {
          dehydrated: l,
          treeContext: ne !== null ? { id: Ct, overflow: Ht } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, e = ph(l), e.return = t, t.child = e, Ql = t, El = null)) : l = null, l === null) throw ce(t);
        return t.lanes = 536870912, null;
      }
      return su(t, a);
    }
    var u = l.memoizedState;
    if (u !== null) {
      var c = u.dehydrated;
      if (Kc(t), n)
        if (t.flags & 256)
          t.flags &= -257, t = xm(
            l,
            t,
            e
          );
        else if (t.memoizedState !== null)
          t.child = l.child, t.flags |= 128, t = null;
        else throw Error(o(558));
      else if (ql || fa(l, t, e, !1), n = (e & l.childLanes) !== 0, ql || n) {
        if (a = dl, a !== null && (c = Of(a, e), c !== 0 && c !== u.retryLane))
          throw u.retryLane = c, He(l, c), ut(a, l, c), ri;
        zu(), t = xm(
          l,
          t,
          e
        );
      } else
        l = u.treeContext, El = At(c.nextSibling), Ql = t, ll = !0, ue = null, zt = !1, l !== null && Ah(t, l), t = su(t, a), t.flags |= 4096;
      return t;
    }
    return l = Lt(l.child, {
      mode: a.mode,
      children: a.children
    }), l.ref = t.ref, t.child = l, l.return = t, l;
  }
  function ru(l, t) {
    var e = t.ref;
    if (e === null)
      l !== null && l.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof e != "function" && typeof e != "object")
        throw Error(o(284));
      (l === null || l.ref !== e) && (t.flags |= 4194816);
    }
  }
  function oi(l, t, e, a, n) {
    return Ye(t), e = kc(
      l,
      t,
      e,
      a,
      void 0,
      n
    ), a = wc(), l !== null && !ql ? (Fc(l, t, n), Kt(l, t, n)) : (ll && a && Oc(t), t.flags |= 1, Zl(l, t, e, n), t.child);
  }
  function Lm(l, t, e, a, n, u) {
    return Ye(t), t.updateQueue = null, e = jh(
      t,
      a,
      e,
      n
    ), Qh(l), a = wc(), l !== null && !ql ? (Fc(l, t, u), Kt(l, t, u)) : (ll && a && Oc(t), t.flags |= 1, Zl(l, t, e, u), t.child);
  }
  function Xm(l, t, e, a, n) {
    if (Ye(t), t.stateNode === null) {
      var u = na, c = e.contextType;
      typeof c == "object" && c !== null && (u = jl(c)), u = new e(a, u), t.memoizedState = u.state !== null && u.state !== void 0 ? u.state : null, u.updater = mi, t.stateNode = u, u._reactInternals = t, u = t.stateNode, u.props = a, u.state = t.memoizedState, u.refs = {}, Lc(t), c = e.contextType, u.context = typeof c == "object" && c !== null ? jl(c) : na, u.state = t.memoizedState, c = e.getDerivedStateFromProps, typeof c == "function" && (hi(
        t,
        e,
        c,
        a
      ), u.state = t.memoizedState), typeof e.getDerivedStateFromProps == "function" || typeof u.getSnapshotBeforeUpdate == "function" || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (c = u.state, typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount(), c !== u.state && mi.enqueueReplaceState(u, u.state, null), Pa(t, a, u, n), Ia(), u.state = t.memoizedState), typeof u.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (l === null) {
      u = t.stateNode;
      var f = t.memoizedProps, h = je(e, f);
      u.props = h;
      var y = u.context, b = e.contextType;
      c = na, typeof b == "object" && b !== null && (c = jl(b));
      var T = e.getDerivedStateFromProps;
      b = typeof T == "function" || typeof u.getSnapshotBeforeUpdate == "function", f = t.pendingProps !== f, b || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (f || y !== c) && Nm(
        t,
        u,
        a,
        c
      ), fe = !1;
      var g = t.memoizedState;
      u.state = g, Pa(t, a, u, n), Ia(), y = t.memoizedState, f || g !== y || fe ? (typeof T == "function" && (hi(
        t,
        e,
        T,
        a
      ), y = t.memoizedState), (h = fe || Mm(
        t,
        e,
        h,
        a,
        g,
        y,
        c
      )) ? (b || typeof u.UNSAFE_componentWillMount != "function" && typeof u.componentWillMount != "function" || (typeof u.componentWillMount == "function" && u.componentWillMount(), typeof u.UNSAFE_componentWillMount == "function" && u.UNSAFE_componentWillMount()), typeof u.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = y), u.props = a, u.state = y, u.context = c, a = h) : (typeof u.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      u = t.stateNode, Xc(l, t), c = t.memoizedProps, b = je(e, c), u.props = b, T = t.pendingProps, g = u.context, y = e.contextType, h = na, typeof y == "object" && y !== null && (h = jl(y)), f = e.getDerivedStateFromProps, (y = typeof f == "function" || typeof u.getSnapshotBeforeUpdate == "function") || typeof u.UNSAFE_componentWillReceiveProps != "function" && typeof u.componentWillReceiveProps != "function" || (c !== T || g !== h) && Nm(
        t,
        u,
        a,
        h
      ), fe = !1, g = t.memoizedState, u.state = g, Pa(t, a, u, n), Ia();
      var E = t.memoizedState;
      c !== T || g !== E || fe || l !== null && l.dependencies !== null && kn(l.dependencies) ? (typeof f == "function" && (hi(
        t,
        e,
        f,
        a
      ), E = t.memoizedState), (b = fe || Mm(
        t,
        e,
        b,
        a,
        g,
        E,
        h
      ) || l !== null && l.dependencies !== null && kn(l.dependencies)) ? (y || typeof u.UNSAFE_componentWillUpdate != "function" && typeof u.componentWillUpdate != "function" || (typeof u.componentWillUpdate == "function" && u.componentWillUpdate(a, E, h), typeof u.UNSAFE_componentWillUpdate == "function" && u.UNSAFE_componentWillUpdate(
        a,
        E,
        h
      )), typeof u.componentDidUpdate == "function" && (t.flags |= 4), typeof u.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof u.componentDidUpdate != "function" || c === l.memoizedProps && g === l.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || c === l.memoizedProps && g === l.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = E), u.props = a, u.state = E, u.context = h, a = b) : (typeof u.componentDidUpdate != "function" || c === l.memoizedProps && g === l.memoizedState || (t.flags |= 4), typeof u.getSnapshotBeforeUpdate != "function" || c === l.memoizedProps && g === l.memoizedState || (t.flags |= 1024), a = !1);
    }
    return u = a, ru(l, t), a = (t.flags & 128) !== 0, u || a ? (u = t.stateNode, e = a && typeof e.getDerivedStateFromError != "function" ? null : u.render(), t.flags |= 1, l !== null && a ? (t.child = Xe(
      t,
      l.child,
      null,
      n
    ), t.child = Xe(
      t,
      null,
      e,
      n
    )) : Zl(l, t, e, n), t.memoizedState = u.state, l = t.child) : l = Kt(
      l,
      t,
      n
    ), l;
  }
  function Qm(l, t, e, a) {
    return Be(), t.flags |= 256, Zl(l, t, e, a), t.child;
  }
  var di = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function vi(l) {
    return { baseLanes: l, cachePool: Uh() };
  }
  function yi(l, t, e) {
    return l = l !== null ? l.childLanes & ~e : 0, t && (l |= dt), l;
  }
  function jm(l, t, e) {
    var a = t.pendingProps, n = !1, u = (t.flags & 128) !== 0, c;
    if ((c = u) || (c = l !== null && l.memoizedState === null ? !1 : (Dl.current & 2) !== 0), c && (n = !0, t.flags &= -129), c = (t.flags & 32) !== 0, t.flags &= -33, l === null) {
      if (ll) {
        if (n ? se(t) : re(), (l = El) ? (l = Ws(
          l,
          zt
        ), l = l !== null && l.data !== "&" ? l : null, l !== null && (t.memoizedState = {
          dehydrated: l,
          treeContext: ne !== null ? { id: Ct, overflow: Ht } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, e = ph(l), e.return = t, t.child = e, Ql = t, El = null)) : l = null, l === null) throw ce(t);
        return Ii(l) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      var f = a.children;
      return a = a.fallback, n ? (re(), n = t.mode, f = ou(
        { mode: "hidden", children: f },
        n
      ), a = qe(
        a,
        n,
        e,
        null
      ), f.return = t, a.return = t, f.sibling = a, t.child = f, a = t.child, a.memoizedState = vi(e), a.childLanes = yi(
        l,
        c,
        e
      ), t.memoizedState = di, nn(null, a)) : (se(t), gi(t, f));
    }
    var h = l.memoizedState;
    if (h !== null && (f = h.dehydrated, f !== null)) {
      if (u)
        t.flags & 256 ? (se(t), t.flags &= -257, t = Ei(
          l,
          t,
          e
        )) : t.memoizedState !== null ? (re(), t.child = l.child, t.flags |= 128, t = null) : (re(), f = a.fallback, n = t.mode, a = ou(
          { mode: "visible", children: a.children },
          n
        ), f = qe(
          f,
          n,
          e,
          null
        ), f.flags |= 2, a.return = t, f.return = t, a.sibling = f, t.child = a, Xe(
          t,
          l.child,
          null,
          e
        ), a = t.child, a.memoizedState = vi(e), a.childLanes = yi(
          l,
          c,
          e
        ), t.memoizedState = di, t = nn(null, a));
      else if (se(t), Ii(f)) {
        if (c = f.nextSibling && f.nextSibling.dataset, c) var y = c.dgst;
        c = y, a = Error(o(419)), a.stack = "", a.digest = c, Ja({ value: a, source: null, stack: null }), t = Ei(
          l,
          t,
          e
        );
      } else if (ql || fa(l, t, e, !1), c = (e & l.childLanes) !== 0, ql || c) {
        if (c = dl, c !== null && (a = Of(c, e), a !== 0 && a !== h.retryLane))
          throw h.retryLane = a, He(l, a), ut(c, l, a), ri;
        $i(f) || zu(), t = Ei(
          l,
          t,
          e
        );
      } else
        $i(f) ? (t.flags |= 192, t.child = l.child, t = null) : (l = h.treeContext, El = At(
          f.nextSibling
        ), Ql = t, ll = !0, ue = null, zt = !1, l !== null && Ah(t, l), t = gi(
          t,
          a.children
        ), t.flags |= 4096);
      return t;
    }
    return n ? (re(), f = a.fallback, n = t.mode, h = l.child, y = h.sibling, a = Lt(h, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = h.subtreeFlags & 65011712, y !== null ? f = Lt(
      y,
      f
    ) : (f = qe(
      f,
      n,
      e,
      null
    ), f.flags |= 2), f.return = t, a.return = t, a.sibling = f, t.child = a, nn(null, a), a = t.child, f = l.child.memoizedState, f === null ? f = vi(e) : (n = f.cachePool, n !== null ? (h = Cl._currentValue, n = n.parent !== h ? { parent: h, pool: h } : n) : n = Uh(), f = {
      baseLanes: f.baseLanes | e,
      cachePool: n
    }), a.memoizedState = f, a.childLanes = yi(
      l,
      c,
      e
    ), t.memoizedState = di, nn(l.child, a)) : (se(t), e = l.child, l = e.sibling, e = Lt(e, {
      mode: "visible",
      children: a.children
    }), e.return = t, e.sibling = null, l !== null && (c = t.deletions, c === null ? (t.deletions = [l], t.flags |= 16) : c.push(l)), t.child = e, t.memoizedState = null, e);
  }
  function gi(l, t) {
    return t = ou(
      { mode: "visible", children: t },
      l.mode
    ), t.return = l, l.child = t;
  }
  function ou(l, t) {
    return l = mt(22, l, null, t), l.lanes = 0, l;
  }
  function Ei(l, t, e) {
    return Xe(t, l.child, null, e), l = gi(
      t,
      t.pendingProps.children
    ), l.flags |= 2, t.memoizedState = null, l;
  }
  function Zm(l, t, e) {
    l.lanes |= t;
    var a = l.alternate;
    a !== null && (a.lanes |= t), qc(l.return, t, e);
  }
  function bi(l, t, e, a, n, u) {
    var c = l.memoizedState;
    c === null ? l.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: e,
      tailMode: n,
      treeForkCount: u
    } : (c.isBackwards = t, c.rendering = null, c.renderingStartTime = 0, c.last = a, c.tail = e, c.tailMode = n, c.treeForkCount = u);
  }
  function Vm(l, t, e) {
    var a = t.pendingProps, n = a.revealOrder, u = a.tail;
    a = a.children;
    var c = Dl.current, f = (c & 2) !== 0;
    if (f ? (c = c & 1 | 2, t.flags |= 128) : c &= 1, O(Dl, c), Zl(l, t, a, e), a = ll ? Ka : 0, !f && l !== null && (l.flags & 128) !== 0)
      l: for (l = t.child; l !== null; ) {
        if (l.tag === 13)
          l.memoizedState !== null && Zm(l, e, t);
        else if (l.tag === 19)
          Zm(l, e, t);
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
    switch (n) {
      case "forwards":
        for (e = t.child, n = null; e !== null; )
          l = e.alternate, l !== null && tu(l) === null && (n = e), e = e.sibling;
        e = n, e === null ? (n = t.child, t.child = null) : (n = e.sibling, e.sibling = null), bi(
          t,
          !1,
          n,
          e,
          u,
          a
        );
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (e = null, n = t.child, t.child = null; n !== null; ) {
          if (l = n.alternate, l !== null && tu(l) === null) {
            t.child = n;
            break;
          }
          l = n.sibling, n.sibling = e, e = n, n = l;
        }
        bi(
          t,
          !0,
          e,
          null,
          u,
          a
        );
        break;
      case "together":
        bi(
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
  function Kt(l, t, e) {
    if (l !== null && (t.dependencies = l.dependencies), ve |= t.lanes, (e & t.childLanes) === 0)
      if (l !== null) {
        if (fa(
          l,
          t,
          e,
          !1
        ), (e & t.childLanes) === 0)
          return null;
      } else return null;
    if (l !== null && t.child !== l.child)
      throw Error(o(153));
    if (t.child !== null) {
      for (l = t.child, e = Lt(l, l.pendingProps), t.child = e, e.return = t; l.sibling !== null; )
        l = l.sibling, e = e.sibling = Lt(l, l.pendingProps), e.return = t;
      e.sibling = null;
    }
    return t.child;
  }
  function Si(l, t) {
    return (l.lanes & t) !== 0 ? !0 : (l = l.dependencies, !!(l !== null && kn(l)));
  }
  function r0(l, t, e) {
    switch (t.tag) {
      case 3:
        Wl(t, t.stateNode.containerInfo), ie(t, Cl, l.memoizedState.cache), Be();
        break;
      case 27:
      case 5:
        Ua(t);
        break;
      case 4:
        Wl(t, t.stateNode.containerInfo);
        break;
      case 10:
        ie(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, Kc(t), null;
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null)
          return a.dehydrated !== null ? (se(t), t.flags |= 128, null) : (e & t.child.childLanes) !== 0 ? jm(l, t, e) : (se(t), l = Kt(
            l,
            t,
            e
          ), l !== null ? l.sibling : null);
        se(t);
        break;
      case 19:
        var n = (l.flags & 128) !== 0;
        if (a = (e & t.childLanes) !== 0, a || (fa(
          l,
          t,
          e,
          !1
        ), a = (e & t.childLanes) !== 0), n) {
          if (a)
            return Vm(
              l,
              t,
              e
            );
          t.flags |= 128;
        }
        if (n = t.memoizedState, n !== null && (n.rendering = null, n.tail = null, n.lastEffect = null), O(Dl, Dl.current), a) break;
        return null;
      case 22:
        return t.lanes = 0, Ym(
          l,
          t,
          e,
          t.pendingProps
        );
      case 24:
        ie(t, Cl, l.memoizedState.cache);
    }
    return Kt(l, t, e);
  }
  function Km(l, t, e) {
    if (l !== null)
      if (l.memoizedProps !== t.pendingProps)
        ql = !0;
      else {
        if (!Si(l, e) && (t.flags & 128) === 0)
          return ql = !1, r0(
            l,
            t,
            e
          );
        ql = (l.flags & 131072) !== 0;
      }
    else
      ql = !1, ll && (t.flags & 1048576) !== 0 && Th(t, Ka, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        l: {
          var a = t.pendingProps;
          if (l = xe(t.elementType), t.type = l, typeof l == "function")
            Mc(l) ? (a = je(l, a), t.tag = 1, t = Xm(
              null,
              t,
              l,
              a,
              e
            )) : (t.tag = 0, t = oi(
              null,
              t,
              l,
              a,
              e
            ));
          else {
            if (l != null) {
              var n = l.$$typeof;
              if (n === Kl) {
                t.tag = 11, t = qm(
                  null,
                  t,
                  l,
                  a,
                  e
                );
                break l;
              } else if (n === J) {
                t.tag = 14, t = Bm(
                  null,
                  t,
                  l,
                  a,
                  e
                );
                break l;
              }
            }
            throw t = Rt(l) || l, Error(o(306, t, ""));
          }
        }
        return t;
      case 0:
        return oi(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 1:
        return a = t.type, n = je(
          a,
          t.pendingProps
        ), Xm(
          l,
          t,
          a,
          n,
          e
        );
      case 3:
        l: {
          if (Wl(
            t,
            t.stateNode.containerInfo
          ), l === null) throw Error(o(387));
          a = t.pendingProps;
          var u = t.memoizedState;
          n = u.element, Xc(l, t), Pa(t, a, null, e);
          var c = t.memoizedState;
          if (a = c.cache, ie(t, Cl, a), a !== u.cache && Bc(
            t,
            [Cl],
            e,
            !0
          ), Ia(), a = c.element, u.isDehydrated)
            if (u = {
              element: a,
              isDehydrated: !1,
              cache: c.cache
            }, t.updateQueue.baseState = u, t.memoizedState = u, t.flags & 256) {
              t = Qm(
                l,
                t,
                a,
                e
              );
              break l;
            } else if (a !== n) {
              n = bt(
                Error(o(424)),
                t
              ), Ja(n), t = Qm(
                l,
                t,
                a,
                e
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
              for (El = At(l.firstChild), Ql = t, ll = !0, ue = null, zt = !0, e = Yh(
                t,
                null,
                a,
                e
              ), t.child = e; e; )
                e.flags = e.flags & -3 | 4096, e = e.sibling;
            }
          else {
            if (Be(), a === n) {
              t = Kt(
                l,
                t,
                e
              );
              break l;
            }
            Zl(l, t, a, e);
          }
          t = t.child;
        }
        return t;
      case 26:
        return ru(l, t), l === null ? (e = er(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = e : ll || (e = t.type, l = t.pendingProps, a = Du(
          w.current
        ).createElement(e), a[Xl] = t, a[Pl] = l, Vl(a, e, l), xl(a), t.stateNode = a) : t.memoizedState = er(
          t.type,
          l.memoizedProps,
          t.pendingProps,
          l.memoizedState
        ), null;
      case 27:
        return Ua(t), l === null && ll && (a = t.stateNode = Ps(
          t.type,
          t.pendingProps,
          w.current
        ), Ql = t, zt = !0, n = El, Se(t.type) ? (Pi = n, El = At(a.firstChild)) : El = n), Zl(
          l,
          t,
          t.pendingProps.children,
          e
        ), ru(l, t), l === null && (t.flags |= 4194304), t.child;
      case 5:
        return l === null && ll && ((n = a = El) && (a = j0(
          a,
          t.type,
          t.pendingProps,
          zt
        ), a !== null ? (t.stateNode = a, Ql = t, El = At(a.firstChild), zt = !1, n = !0) : n = !1), n || ce(t)), Ua(t), n = t.type, u = t.pendingProps, c = l !== null ? l.memoizedProps : null, a = u.children, wi(n, u) ? a = null : c !== null && wi(n, c) && (t.flags |= 32), t.memoizedState !== null && (n = kc(
          l,
          t,
          a0,
          null,
          null,
          e
        ), Sn._currentValue = n), ru(l, t), Zl(l, t, a, e), t.child;
      case 6:
        return l === null && ll && ((l = e = El) && (e = Z0(
          e,
          t.pendingProps,
          zt
        ), e !== null ? (t.stateNode = e, Ql = t, El = null, l = !0) : l = !1), l || ce(t)), null;
      case 13:
        return jm(l, t, e);
      case 4:
        return Wl(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, l === null ? t.child = Xe(
          t,
          null,
          a,
          e
        ) : Zl(l, t, a, e), t.child;
      case 11:
        return qm(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 7:
        return Zl(
          l,
          t,
          t.pendingProps,
          e
        ), t.child;
      case 8:
        return Zl(
          l,
          t,
          t.pendingProps.children,
          e
        ), t.child;
      case 12:
        return Zl(
          l,
          t,
          t.pendingProps.children,
          e
        ), t.child;
      case 10:
        return a = t.pendingProps, ie(t, t.type, a.value), Zl(l, t, a.children, e), t.child;
      case 9:
        return n = t.type._context, a = t.pendingProps.children, Ye(t), n = jl(n), a = a(n), t.flags |= 1, Zl(l, t, a, e), t.child;
      case 14:
        return Bm(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 15:
        return Rm(
          l,
          t,
          t.type,
          t.pendingProps,
          e
        );
      case 19:
        return Vm(l, t, e);
      case 31:
        return s0(l, t, e);
      case 22:
        return Ym(
          l,
          t,
          e,
          t.pendingProps
        );
      case 24:
        return Ye(t), a = jl(Cl), l === null ? (n = Gc(), n === null && (n = dl, u = Rc(), n.pooledCache = u, u.refCount++, u !== null && (n.pooledCacheLanes |= e), n = u), t.memoizedState = { parent: a, cache: n }, Lc(t), ie(t, Cl, n)) : ((l.lanes & e) !== 0 && (Xc(l, t), Pa(t, null, null, e), Ia()), n = l.memoizedState, u = t.memoizedState, n.parent !== a ? (n = { parent: a, cache: a }, t.memoizedState = n, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = n), ie(t, Cl, a)) : (a = u.cache, ie(t, Cl, a), a !== n.cache && Bc(
          t,
          [Cl],
          e,
          !0
        ))), Zl(
          l,
          t,
          t.pendingProps.children,
          e
        ), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(o(156, t.tag));
  }
  function Jt(l) {
    l.flags |= 4;
  }
  function pi(l, t, e, a, n) {
    if ((t = (l.mode & 32) !== 0) && (t = !1), t) {
      if (l.flags |= 16777216, (n & 335544128) === n)
        if (l.stateNode.complete) l.flags |= 8192;
        else if (Es()) l.flags |= 8192;
        else
          throw Le = $n, xc;
    } else l.flags &= -16777217;
  }
  function Jm(l, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      l.flags &= -16777217;
    else if (l.flags |= 16777216, !ir(t))
      if (Es()) l.flags |= 8192;
      else
        throw Le = $n, xc;
  }
  function du(l, t) {
    t !== null && (l.flags |= 4), l.flags & 16384 && (t = l.tag !== 22 ? Mf() : 536870912, l.lanes |= t, Sa |= t);
  }
  function un(l, t) {
    if (!ll)
      switch (l.tailMode) {
        case "hidden":
          t = l.tail;
          for (var e = null; t !== null; )
            t.alternate !== null && (e = t), t = t.sibling;
          e === null ? l.tail = null : e.sibling = null;
          break;
        case "collapsed":
          e = l.tail;
          for (var a = null; e !== null; )
            e.alternate !== null && (a = e), e = e.sibling;
          a === null ? t || l.tail === null ? l.tail = null : l.tail.sibling = null : a.sibling = null;
      }
  }
  function bl(l) {
    var t = l.alternate !== null && l.alternate.child === l.child, e = 0, a = 0;
    if (t)
      for (var n = l.child; n !== null; )
        e |= n.lanes | n.childLanes, a |= n.subtreeFlags & 65011712, a |= n.flags & 65011712, n.return = l, n = n.sibling;
    else
      for (n = l.child; n !== null; )
        e |= n.lanes | n.childLanes, a |= n.subtreeFlags, a |= n.flags, n.return = l, n = n.sibling;
    return l.subtreeFlags |= a, l.childLanes = e, t;
  }
  function o0(l, t, e) {
    var a = t.pendingProps;
    switch (Dc(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return bl(t), null;
      case 1:
        return bl(t), null;
      case 3:
        return e = t.stateNode, a = null, l !== null && (a = l.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), jt(Cl), Ol(), e.pendingContext && (e.context = e.pendingContext, e.pendingContext = null), (l === null || l.child === null) && (ia(t) ? Jt(t) : l === null || l.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, Cc())), bl(t), null;
      case 26:
        var n = t.type, u = t.memoizedState;
        return l === null ? (Jt(t), u !== null ? (bl(t), Jm(t, u)) : (bl(t), pi(
          t,
          n,
          null,
          a,
          e
        ))) : u ? u !== l.memoizedState ? (Jt(t), bl(t), Jm(t, u)) : (bl(t), t.flags &= -16777217) : (l = l.memoizedProps, l !== a && Jt(t), bl(t), pi(
          t,
          n,
          l,
          a,
          e
        )), null;
      case 27:
        if (Mn(t), e = w.current, n = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== a && Jt(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(o(166));
            return bl(t), null;
          }
          l = C.current, ia(t) ? Mh(t) : (l = Ps(n, a, e), t.stateNode = l, Jt(t));
        }
        return bl(t), null;
      case 5:
        if (Mn(t), n = t.type, l !== null && t.stateNode != null)
          l.memoizedProps !== a && Jt(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(o(166));
            return bl(t), null;
          }
          if (u = C.current, ia(t))
            Mh(t);
          else {
            var c = Du(
              w.current
            );
            switch (u) {
              case 1:
                u = c.createElementNS(
                  "http://www.w3.org/2000/svg",
                  n
                );
                break;
              case 2:
                u = c.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  n
                );
                break;
              default:
                switch (n) {
                  case "svg":
                    u = c.createElementNS(
                      "http://www.w3.org/2000/svg",
                      n
                    );
                    break;
                  case "math":
                    u = c.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      n
                    );
                    break;
                  case "script":
                    u = c.createElement("div"), u.innerHTML = "<script><\/script>", u = u.removeChild(
                      u.firstChild
                    );
                    break;
                  case "select":
                    u = typeof a.is == "string" ? c.createElement("select", {
                      is: a.is
                    }) : c.createElement("select"), a.multiple ? u.multiple = !0 : a.size && (u.size = a.size);
                    break;
                  default:
                    u = typeof a.is == "string" ? c.createElement(n, { is: a.is }) : c.createElement(n);
                }
            }
            u[Xl] = t, u[Pl] = a;
            l: for (c = t.child; c !== null; ) {
              if (c.tag === 5 || c.tag === 6)
                u.appendChild(c.stateNode);
              else if (c.tag !== 4 && c.tag !== 27 && c.child !== null) {
                c.child.return = c, c = c.child;
                continue;
              }
              if (c === t) break l;
              for (; c.sibling === null; ) {
                if (c.return === null || c.return === t)
                  break l;
                c = c.return;
              }
              c.sibling.return = c.return, c = c.sibling;
            }
            t.stateNode = u;
            l: switch (Vl(u, n, a), n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break l;
              case "img":
                a = !0;
                break l;
              default:
                a = !1;
            }
            a && Jt(t);
          }
        }
        return bl(t), pi(
          t,
          t.type,
          l === null ? null : l.memoizedProps,
          t.pendingProps,
          e
        ), null;
      case 6:
        if (l && t.stateNode != null)
          l.memoizedProps !== a && Jt(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(o(166));
          if (l = w.current, ia(t)) {
            if (l = t.stateNode, e = t.memoizedProps, a = null, n = Ql, n !== null)
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            l[Xl] = t, l = !!(l.nodeValue === e || a !== null && a.suppressHydrationWarning === !0 || js(l.nodeValue, e)), l || ce(t, !0);
          } else
            l = Du(l).createTextNode(
              a
            ), l[Xl] = t, t.stateNode = l;
        }
        return bl(t), null;
      case 31:
        if (e = t.memoizedState, l === null || l.memoizedState !== null) {
          if (a = ia(t), e !== null) {
            if (l === null) {
              if (!a) throw Error(o(318));
              if (l = t.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(o(557));
              l[Xl] = t;
            } else
              Be(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            bl(t), l = !1;
          } else
            e = Cc(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = e), l = !0;
          if (!l)
            return t.flags & 256 ? (rt(t), t) : (rt(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(o(558));
        }
        return bl(t), null;
      case 13:
        if (a = t.memoizedState, l === null || l.memoizedState !== null && l.memoizedState.dehydrated !== null) {
          if (n = ia(t), a !== null && a.dehydrated !== null) {
            if (l === null) {
              if (!n) throw Error(o(318));
              if (n = t.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(o(317));
              n[Xl] = t;
            } else
              Be(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            bl(t), n = !1;
          } else
            n = Cc(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = n), n = !0;
          if (!n)
            return t.flags & 256 ? (rt(t), t) : (rt(t), null);
        }
        return rt(t), (t.flags & 128) !== 0 ? (t.lanes = e, t) : (e = a !== null, l = l !== null && l.memoizedState !== null, e && (a = t.child, n = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (n = a.alternate.memoizedState.cachePool.pool), u = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (u = a.memoizedState.cachePool.pool), u !== n && (a.flags |= 2048)), e !== l && e && (t.child.flags |= 8192), du(t, t.updateQueue), bl(t), null);
      case 4:
        return Ol(), l === null && Zi(t.stateNode.containerInfo), bl(t), null;
      case 10:
        return jt(t.type), bl(t), null;
      case 19:
        if (A(Dl), a = t.memoizedState, a === null) return bl(t), null;
        if (n = (t.flags & 128) !== 0, u = a.rendering, u === null)
          if (n) un(a, !1);
          else {
            if (Al !== 0 || l !== null && (l.flags & 128) !== 0)
              for (l = t.child; l !== null; ) {
                if (u = tu(l), u !== null) {
                  for (t.flags |= 128, un(a, !1), l = u.updateQueue, t.updateQueue = l, du(t, l), t.subtreeFlags = 0, l = e, e = t.child; e !== null; )
                    Sh(e, l), e = e.sibling;
                  return O(
                    Dl,
                    Dl.current & 1 | 2
                  ), ll && Xt(t, a.treeForkCount), t.child;
                }
                l = l.sibling;
              }
            a.tail !== null && ct() > bu && (t.flags |= 128, n = !0, un(a, !1), t.lanes = 4194304);
          }
        else {
          if (!n)
            if (l = tu(u), l !== null) {
              if (t.flags |= 128, n = !0, l = l.updateQueue, t.updateQueue = l, du(t, l), un(a, !0), a.tail === null && a.tailMode === "hidden" && !u.alternate && !ll)
                return bl(t), null;
            } else
              2 * ct() - a.renderingStartTime > bu && e !== 536870912 && (t.flags |= 128, n = !0, un(a, !1), t.lanes = 4194304);
          a.isBackwards ? (u.sibling = t.child, t.child = u) : (l = a.last, l !== null ? l.sibling = u : t.child = u, a.last = u);
        }
        return a.tail !== null ? (l = a.tail, a.rendering = l, a.tail = l.sibling, a.renderingStartTime = ct(), l.sibling = null, e = Dl.current, O(
          Dl,
          n ? e & 1 | 2 : e & 1
        ), ll && Xt(t, a.treeForkCount), l) : (bl(t), null);
      case 22:
      case 23:
        return rt(t), Vc(), a = t.memoizedState !== null, l !== null ? l.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (e & 536870912) !== 0 && (t.flags & 128) === 0 && (bl(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : bl(t), e = t.updateQueue, e !== null && du(t, e.retryQueue), e = null, l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (e = l.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== e && (t.flags |= 2048), l !== null && A(Ge), null;
      case 24:
        return e = null, l !== null && (e = l.memoizedState.cache), t.memoizedState.cache !== e && (t.flags |= 2048), jt(Cl), bl(t), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function d0(l, t) {
    switch (Dc(t), t.tag) {
      case 1:
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 3:
        return jt(Cl), Ol(), l = t.flags, (l & 65536) !== 0 && (l & 128) === 0 ? (t.flags = l & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return Mn(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (rt(t), t.alternate === null)
            throw Error(o(340));
          Be();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 13:
        if (rt(t), l = t.memoizedState, l !== null && l.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(o(340));
          Be();
        }
        return l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 19:
        return A(Dl), null;
      case 4:
        return Ol(), null;
      case 10:
        return jt(t.type), null;
      case 22:
      case 23:
        return rt(t), Vc(), l !== null && A(Ge), l = t.flags, l & 65536 ? (t.flags = l & -65537 | 128, t) : null;
      case 24:
        return jt(Cl), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function km(l, t) {
    switch (Dc(t), t.tag) {
      case 3:
        jt(Cl), Ol();
        break;
      case 26:
      case 27:
      case 5:
        Mn(t);
        break;
      case 4:
        Ol();
        break;
      case 31:
        t.memoizedState !== null && rt(t);
        break;
      case 13:
        rt(t);
        break;
      case 19:
        A(Dl);
        break;
      case 10:
        jt(t.type);
        break;
      case 22:
      case 23:
        rt(t), Vc(), l !== null && A(Ge);
        break;
      case 24:
        jt(Cl);
    }
  }
  function cn(l, t) {
    try {
      var e = t.updateQueue, a = e !== null ? e.lastEffect : null;
      if (a !== null) {
        var n = a.next;
        e = n;
        do {
          if ((e.tag & l) === l) {
            a = void 0;
            var u = e.create, c = e.inst;
            a = u(), c.destroy = a;
          }
          e = e.next;
        } while (e !== n);
      }
    } catch (f) {
      il(t, t.return, f);
    }
  }
  function oe(l, t, e) {
    try {
      var a = t.updateQueue, n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var u = n.next;
        a = u;
        do {
          if ((a.tag & l) === l) {
            var c = a.inst, f = c.destroy;
            if (f !== void 0) {
              c.destroy = void 0, n = t;
              var h = e, y = f;
              try {
                y();
              } catch (b) {
                il(
                  n,
                  h,
                  b
                );
              }
            }
          }
          a = a.next;
        } while (a !== u);
      }
    } catch (b) {
      il(t, t.return, b);
    }
  }
  function wm(l) {
    var t = l.updateQueue;
    if (t !== null) {
      var e = l.stateNode;
      try {
        xh(t, e);
      } catch (a) {
        il(l, l.return, a);
      }
    }
  }
  function Fm(l, t, e) {
    e.props = je(
      l.type,
      l.memoizedProps
    ), e.state = l.memoizedState;
    try {
      e.componentWillUnmount();
    } catch (a) {
      il(l, t, a);
    }
  }
  function fn(l, t) {
    try {
      var e = l.ref;
      if (e !== null) {
        switch (l.tag) {
          case 26:
          case 27:
          case 5:
            var a = l.stateNode;
            break;
          case 30:
            a = l.stateNode;
            break;
          default:
            a = l.stateNode;
        }
        typeof e == "function" ? l.refCleanup = e(a) : e.current = a;
      }
    } catch (n) {
      il(l, t, n);
    }
  }
  function qt(l, t) {
    var e = l.ref, a = l.refCleanup;
    if (e !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          il(l, t, n);
        } finally {
          l.refCleanup = null, l = l.alternate, l != null && (l.refCleanup = null);
        }
      else if (typeof e == "function")
        try {
          e(null);
        } catch (n) {
          il(l, t, n);
        }
      else e.current = null;
  }
  function Wm(l) {
    var t = l.type, e = l.memoizedProps, a = l.stateNode;
    try {
      l: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          e.autoFocus && a.focus();
          break l;
        case "img":
          e.src ? a.src = e.src : e.srcSet && (a.srcset = e.srcSet);
      }
    } catch (n) {
      il(l, l.return, n);
    }
  }
  function zi(l, t, e) {
    try {
      var a = l.stateNode;
      Y0(a, l.type, e, t), a[Pl] = t;
    } catch (n) {
      il(l, l.return, n);
    }
  }
  function $m(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 26 || l.tag === 27 && Se(l.type) || l.tag === 4;
  }
  function Ti(l) {
    l: for (; ; ) {
      for (; l.sibling === null; ) {
        if (l.return === null || $m(l.return)) return null;
        l = l.return;
      }
      for (l.sibling.return = l.return, l = l.sibling; l.tag !== 5 && l.tag !== 6 && l.tag !== 18; ) {
        if (l.tag === 27 && Se(l.type) || l.flags & 2 || l.child === null || l.tag === 4) continue l;
        l.child.return = l, l = l.child;
      }
      if (!(l.flags & 2)) return l.stateNode;
    }
  }
  function Ai(l, t, e) {
    var a = l.tag;
    if (a === 5 || a === 6)
      l = l.stateNode, t ? (e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e).insertBefore(l, t) : (t = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, t.appendChild(l), e = e._reactRootContainer, e != null || t.onclick !== null || (t.onclick = Gt));
    else if (a !== 4 && (a === 27 && Se(l.type) && (e = l.stateNode, t = null), l = l.child, l !== null))
      for (Ai(l, t, e), l = l.sibling; l !== null; )
        Ai(l, t, e), l = l.sibling;
  }
  function vu(l, t, e) {
    var a = l.tag;
    if (a === 5 || a === 6)
      l = l.stateNode, t ? e.insertBefore(l, t) : e.appendChild(l);
    else if (a !== 4 && (a === 27 && Se(l.type) && (e = l.stateNode), l = l.child, l !== null))
      for (vu(l, t, e), l = l.sibling; l !== null; )
        vu(l, t, e), l = l.sibling;
  }
  function Im(l) {
    var t = l.stateNode, e = l.memoizedProps;
    try {
      for (var a = l.type, n = t.attributes; n.length; )
        t.removeAttributeNode(n[0]);
      Vl(t, a, e), t[Xl] = l, t[Pl] = e;
    } catch (u) {
      il(l, l.return, u);
    }
  }
  var kt = !1, Bl = !1, Mi = !1, Pm = typeof WeakSet == "function" ? WeakSet : Set, Ll = null;
  function v0(l, t) {
    if (l = l.containerInfo, Ji = Yu, l = sh(l), Ec(l)) {
      if ("selectionStart" in l)
        var e = {
          start: l.selectionStart,
          end: l.selectionEnd
        };
      else
        l: {
          e = (e = l.ownerDocument) && e.defaultView || window;
          var a = e.getSelection && e.getSelection();
          if (a && a.rangeCount !== 0) {
            e = a.anchorNode;
            var n = a.anchorOffset, u = a.focusNode;
            a = a.focusOffset;
            try {
              e.nodeType, u.nodeType;
            } catch {
              e = null;
              break l;
            }
            var c = 0, f = -1, h = -1, y = 0, b = 0, T = l, g = null;
            t: for (; ; ) {
              for (var E; T !== e || n !== 0 && T.nodeType !== 3 || (f = c + n), T !== u || a !== 0 && T.nodeType !== 3 || (h = c + a), T.nodeType === 3 && (c += T.nodeValue.length), (E = T.firstChild) !== null; )
                g = T, T = E;
              for (; ; ) {
                if (T === l) break t;
                if (g === e && ++y === n && (f = c), g === u && ++b === a && (h = c), (E = T.nextSibling) !== null) break;
                T = g, g = T.parentNode;
              }
              T = E;
            }
            e = f === -1 || h === -1 ? null : { start: f, end: h };
          } else e = null;
        }
      e = e || { start: 0, end: 0 };
    } else e = null;
    for (ki = { focusedElem: l, selectionRange: e }, Yu = !1, Ll = t; Ll !== null; )
      if (t = Ll, l = t.child, (t.subtreeFlags & 1028) !== 0 && l !== null)
        l.return = t, Ll = l;
      else
        for (; Ll !== null; ) {
          switch (t = Ll, u = t.alternate, l = t.flags, t.tag) {
            case 0:
              if ((l & 4) !== 0 && (l = t.updateQueue, l = l !== null ? l.events : null, l !== null))
                for (e = 0; e < l.length; e++)
                  n = l[e], n.ref.impl = n.nextImpl;
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((l & 1024) !== 0 && u !== null) {
                l = void 0, e = t, n = u.memoizedProps, u = u.memoizedState, a = e.stateNode;
                try {
                  var D = je(
                    e.type,
                    n
                  );
                  l = a.getSnapshotBeforeUpdate(
                    D,
                    u
                  ), a.__reactInternalSnapshotBeforeUpdate = l;
                } catch (G) {
                  il(
                    e,
                    e.return,
                    G
                  );
                }
              }
              break;
            case 3:
              if ((l & 1024) !== 0) {
                if (l = t.stateNode.containerInfo, e = l.nodeType, e === 9)
                  Wi(l);
                else if (e === 1)
                  switch (l.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Wi(l);
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
            l.return = t.return, Ll = l;
            break;
          }
          Ll = t.return;
        }
  }
  function ls(l, t, e) {
    var a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Ft(l, e), a & 4 && cn(5, e);
        break;
      case 1:
        if (Ft(l, e), a & 4)
          if (l = e.stateNode, t === null)
            try {
              l.componentDidMount();
            } catch (c) {
              il(e, e.return, c);
            }
          else {
            var n = je(
              e.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              l.componentDidUpdate(
                n,
                t,
                l.__reactInternalSnapshotBeforeUpdate
              );
            } catch (c) {
              il(
                e,
                e.return,
                c
              );
            }
          }
        a & 64 && wm(e), a & 512 && fn(e, e.return);
        break;
      case 3:
        if (Ft(l, e), a & 64 && (l = e.updateQueue, l !== null)) {
          if (t = null, e.child !== null)
            switch (e.child.tag) {
              case 27:
              case 5:
                t = e.child.stateNode;
                break;
              case 1:
                t = e.child.stateNode;
            }
          try {
            xh(l, t);
          } catch (c) {
            il(e, e.return, c);
          }
        }
        break;
      case 27:
        t === null && a & 4 && Im(e);
      case 26:
      case 5:
        Ft(l, e), t === null && a & 4 && Wm(e), a & 512 && fn(e, e.return);
        break;
      case 12:
        Ft(l, e);
        break;
      case 31:
        Ft(l, e), a & 4 && as(l, e);
        break;
      case 13:
        Ft(l, e), a & 4 && ns(l, e), a & 64 && (l = e.memoizedState, l !== null && (l = l.dehydrated, l !== null && (e = A0.bind(
          null,
          e
        ), V0(l, e))));
        break;
      case 22:
        if (a = e.memoizedState !== null || kt, !a) {
          t = t !== null && t.memoizedState !== null || Bl, n = kt;
          var u = Bl;
          kt = a, (Bl = t) && !u ? Wt(
            l,
            e,
            (e.subtreeFlags & 8772) !== 0
          ) : Ft(l, e), kt = n, Bl = u;
        }
        break;
      case 30:
        break;
      default:
        Ft(l, e);
    }
  }
  function ts(l) {
    var t = l.alternate;
    t !== null && (l.alternate = null, ts(t)), l.child = null, l.deletions = null, l.sibling = null, l.tag === 5 && (t = l.stateNode, t !== null && tc(t)), l.stateNode = null, l.return = null, l.dependencies = null, l.memoizedProps = null, l.memoizedState = null, l.pendingProps = null, l.stateNode = null, l.updateQueue = null;
  }
  var Sl = null, tt = !1;
  function wt(l, t, e) {
    for (e = e.child; e !== null; )
      es(l, t, e), e = e.sibling;
  }
  function es(l, t, e) {
    if (it && typeof it.onCommitFiberUnmount == "function")
      try {
        it.onCommitFiberUnmount(Ca, e);
      } catch {
      }
    switch (e.tag) {
      case 26:
        Bl || qt(e, t), wt(
          l,
          t,
          e
        ), e.memoizedState ? e.memoizedState.count-- : e.stateNode && (e = e.stateNode, e.parentNode.removeChild(e));
        break;
      case 27:
        Bl || qt(e, t);
        var a = Sl, n = tt;
        Se(e.type) && (Sl = e.stateNode, tt = !1), wt(
          l,
          t,
          e
        ), gn(e.stateNode), Sl = a, tt = n;
        break;
      case 5:
        Bl || qt(e, t);
      case 6:
        if (a = Sl, n = tt, Sl = null, wt(
          l,
          t,
          e
        ), Sl = a, tt = n, Sl !== null)
          if (tt)
            try {
              (Sl.nodeType === 9 ? Sl.body : Sl.nodeName === "HTML" ? Sl.ownerDocument.body : Sl).removeChild(e.stateNode);
            } catch (u) {
              il(
                e,
                t,
                u
              );
            }
          else
            try {
              Sl.removeChild(e.stateNode);
            } catch (u) {
              il(
                e,
                t,
                u
              );
            }
        break;
      case 18:
        Sl !== null && (tt ? (l = Sl, ws(
          l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l,
          e.stateNode
        ), Oa(l)) : ws(Sl, e.stateNode));
        break;
      case 4:
        a = Sl, n = tt, Sl = e.stateNode.containerInfo, tt = !0, wt(
          l,
          t,
          e
        ), Sl = a, tt = n;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        oe(2, e, t), Bl || oe(4, e, t), wt(
          l,
          t,
          e
        );
        break;
      case 1:
        Bl || (qt(e, t), a = e.stateNode, typeof a.componentWillUnmount == "function" && Fm(
          e,
          t,
          a
        )), wt(
          l,
          t,
          e
        );
        break;
      case 21:
        wt(
          l,
          t,
          e
        );
        break;
      case 22:
        Bl = (a = Bl) || e.memoizedState !== null, wt(
          l,
          t,
          e
        ), Bl = a;
        break;
      default:
        wt(
          l,
          t,
          e
        );
    }
  }
  function as(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null))) {
      l = l.dehydrated;
      try {
        Oa(l);
      } catch (e) {
        il(t, t.return, e);
      }
    }
  }
  function ns(l, t) {
    if (t.memoizedState === null && (l = t.alternate, l !== null && (l = l.memoizedState, l !== null && (l = l.dehydrated, l !== null))))
      try {
        Oa(l);
      } catch (e) {
        il(t, t.return, e);
      }
  }
  function y0(l) {
    switch (l.tag) {
      case 31:
      case 13:
      case 19:
        var t = l.stateNode;
        return t === null && (t = l.stateNode = new Pm()), t;
      case 22:
        return l = l.stateNode, t = l._retryCache, t === null && (t = l._retryCache = new Pm()), t;
      default:
        throw Error(o(435, l.tag));
    }
  }
  function yu(l, t) {
    var e = y0(l);
    t.forEach(function(a) {
      if (!e.has(a)) {
        e.add(a);
        var n = M0.bind(null, l, a);
        a.then(n, n);
      }
    });
  }
  function et(l, t) {
    var e = t.deletions;
    if (e !== null)
      for (var a = 0; a < e.length; a++) {
        var n = e[a], u = l, c = t, f = c;
        l: for (; f !== null; ) {
          switch (f.tag) {
            case 27:
              if (Se(f.type)) {
                Sl = f.stateNode, tt = !1;
                break l;
              }
              break;
            case 5:
              Sl = f.stateNode, tt = !1;
              break l;
            case 3:
            case 4:
              Sl = f.stateNode.containerInfo, tt = !0;
              break l;
          }
          f = f.return;
        }
        if (Sl === null) throw Error(o(160));
        es(u, c, n), Sl = null, tt = !1, u = n.alternate, u !== null && (u.return = null), n.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        us(t, l), t = t.sibling;
  }
  var Dt = null;
  function us(l, t) {
    var e = l.alternate, a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        et(t, l), at(l), a & 4 && (oe(3, l, l.return), cn(3, l), oe(5, l, l.return));
        break;
      case 1:
        et(t, l), at(l), a & 512 && (Bl || e === null || qt(e, e.return)), a & 64 && kt && (l = l.updateQueue, l !== null && (a = l.callbacks, a !== null && (e = l.shared.hiddenCallbacks, l.shared.hiddenCallbacks = e === null ? a : e.concat(a))));
        break;
      case 26:
        var n = Dt;
        if (et(t, l), at(l), a & 512 && (Bl || e === null || qt(e, e.return)), a & 4) {
          var u = e !== null ? e.memoizedState : null;
          if (a = l.memoizedState, e === null)
            if (a === null)
              if (l.stateNode === null) {
                l: {
                  a = l.type, e = l.memoizedProps, n = n.ownerDocument || n;
                  t: switch (a) {
                    case "title":
                      u = n.getElementsByTagName("title")[0], (!u || u[Ba] || u[Xl] || u.namespaceURI === "http://www.w3.org/2000/svg" || u.hasAttribute("itemprop")) && (u = n.createElement(a), n.head.insertBefore(
                        u,
                        n.querySelector("head > title")
                      )), Vl(u, a, e), u[Xl] = l, xl(u), a = u;
                      break l;
                    case "link":
                      var c = ur(
                        "link",
                        "href",
                        n
                      ).get(a + (e.href || ""));
                      if (c) {
                        for (var f = 0; f < c.length; f++)
                          if (u = c[f], u.getAttribute("href") === (e.href == null || e.href === "" ? null : e.href) && u.getAttribute("rel") === (e.rel == null ? null : e.rel) && u.getAttribute("title") === (e.title == null ? null : e.title) && u.getAttribute("crossorigin") === (e.crossOrigin == null ? null : e.crossOrigin)) {
                            c.splice(f, 1);
                            break t;
                          }
                      }
                      u = n.createElement(a), Vl(u, a, e), n.head.appendChild(u);
                      break;
                    case "meta":
                      if (c = ur(
                        "meta",
                        "content",
                        n
                      ).get(a + (e.content || ""))) {
                        for (f = 0; f < c.length; f++)
                          if (u = c[f], u.getAttribute("content") === (e.content == null ? null : "" + e.content) && u.getAttribute("name") === (e.name == null ? null : e.name) && u.getAttribute("property") === (e.property == null ? null : e.property) && u.getAttribute("http-equiv") === (e.httpEquiv == null ? null : e.httpEquiv) && u.getAttribute("charset") === (e.charSet == null ? null : e.charSet)) {
                            c.splice(f, 1);
                            break t;
                          }
                      }
                      u = n.createElement(a), Vl(u, a, e), n.head.appendChild(u);
                      break;
                    default:
                      throw Error(o(468, a));
                  }
                  u[Xl] = l, xl(u), a = u;
                }
                l.stateNode = a;
              } else
                cr(
                  n,
                  l.type,
                  l.stateNode
                );
            else
              l.stateNode = nr(
                n,
                a,
                l.memoizedProps
              );
          else
            u !== a ? (u === null ? e.stateNode !== null && (e = e.stateNode, e.parentNode.removeChild(e)) : u.count--, a === null ? cr(
              n,
              l.type,
              l.stateNode
            ) : nr(
              n,
              a,
              l.memoizedProps
            )) : a === null && l.stateNode !== null && zi(
              l,
              l.memoizedProps,
              e.memoizedProps
            );
        }
        break;
      case 27:
        et(t, l), at(l), a & 512 && (Bl || e === null || qt(e, e.return)), e !== null && a & 4 && zi(
          l,
          l.memoizedProps,
          e.memoizedProps
        );
        break;
      case 5:
        if (et(t, l), at(l), a & 512 && (Bl || e === null || qt(e, e.return)), l.flags & 32) {
          n = l.stateNode;
          try {
            $e(n, "");
          } catch (D) {
            il(l, l.return, D);
          }
        }
        a & 4 && l.stateNode != null && (n = l.memoizedProps, zi(
          l,
          n,
          e !== null ? e.memoizedProps : n
        )), a & 1024 && (Mi = !0);
        break;
      case 6:
        if (et(t, l), at(l), a & 4) {
          if (l.stateNode === null)
            throw Error(o(162));
          a = l.memoizedProps, e = l.stateNode;
          try {
            e.nodeValue = a;
          } catch (D) {
            il(l, l.return, D);
          }
        }
        break;
      case 3:
        if (Hu = null, n = Dt, Dt = Uu(t.containerInfo), et(t, l), Dt = n, at(l), a & 4 && e !== null && e.memoizedState.isDehydrated)
          try {
            Oa(t.containerInfo);
          } catch (D) {
            il(l, l.return, D);
          }
        Mi && (Mi = !1, cs(l));
        break;
      case 4:
        a = Dt, Dt = Uu(
          l.stateNode.containerInfo
        ), et(t, l), at(l), Dt = a;
        break;
      case 12:
        et(t, l), at(l);
        break;
      case 31:
        et(t, l), at(l), a & 4 && (a = l.updateQueue, a !== null && (l.updateQueue = null, yu(l, a)));
        break;
      case 13:
        et(t, l), at(l), l.child.flags & 8192 && l.memoizedState !== null != (e !== null && e.memoizedState !== null) && (Eu = ct()), a & 4 && (a = l.updateQueue, a !== null && (l.updateQueue = null, yu(l, a)));
        break;
      case 22:
        n = l.memoizedState !== null;
        var h = e !== null && e.memoizedState !== null, y = kt, b = Bl;
        if (kt = y || n, Bl = b || h, et(t, l), Bl = b, kt = y, at(l), a & 8192)
          l: for (t = l.stateNode, t._visibility = n ? t._visibility & -2 : t._visibility | 1, n && (e === null || h || kt || Bl || Ze(l)), e = null, t = l; ; ) {
            if (t.tag === 5 || t.tag === 26) {
              if (e === null) {
                h = e = t;
                try {
                  if (u = h.stateNode, n)
                    c = u.style, typeof c.setProperty == "function" ? c.setProperty("display", "none", "important") : c.display = "none";
                  else {
                    f = h.stateNode;
                    var T = h.memoizedProps.style, g = T != null && T.hasOwnProperty("display") ? T.display : null;
                    f.style.display = g == null || typeof g == "boolean" ? "" : ("" + g).trim();
                  }
                } catch (D) {
                  il(h, h.return, D);
                }
              }
            } else if (t.tag === 6) {
              if (e === null) {
                h = t;
                try {
                  h.stateNode.nodeValue = n ? "" : h.memoizedProps;
                } catch (D) {
                  il(h, h.return, D);
                }
              }
            } else if (t.tag === 18) {
              if (e === null) {
                h = t;
                try {
                  var E = h.stateNode;
                  n ? Fs(E, !0) : Fs(h.stateNode, !1);
                } catch (D) {
                  il(h, h.return, D);
                }
              }
            } else if ((t.tag !== 22 && t.tag !== 23 || t.memoizedState === null || t === l) && t.child !== null) {
              t.child.return = t, t = t.child;
              continue;
            }
            if (t === l) break l;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === l) break l;
              e === t && (e = null), t = t.return;
            }
            e === t && (e = null), t.sibling.return = t.return, t = t.sibling;
          }
        a & 4 && (a = l.updateQueue, a !== null && (e = a.retryQueue, e !== null && (a.retryQueue = null, yu(l, e))));
        break;
      case 19:
        et(t, l), at(l), a & 4 && (a = l.updateQueue, a !== null && (l.updateQueue = null, yu(l, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        et(t, l), at(l);
    }
  }
  function at(l) {
    var t = l.flags;
    if (t & 2) {
      try {
        for (var e, a = l.return; a !== null; ) {
          if ($m(a)) {
            e = a;
            break;
          }
          a = a.return;
        }
        if (e == null) throw Error(o(160));
        switch (e.tag) {
          case 27:
            var n = e.stateNode, u = Ti(l);
            vu(l, u, n);
            break;
          case 5:
            var c = e.stateNode;
            e.flags & 32 && ($e(c, ""), e.flags &= -33);
            var f = Ti(l);
            vu(l, f, c);
            break;
          case 3:
          case 4:
            var h = e.stateNode.containerInfo, y = Ti(l);
            Ai(
              l,
              y,
              h
            );
            break;
          default:
            throw Error(o(161));
        }
      } catch (b) {
        il(l, l.return, b);
      }
      l.flags &= -3;
    }
    t & 4096 && (l.flags &= -4097);
  }
  function cs(l) {
    if (l.subtreeFlags & 1024)
      for (l = l.child; l !== null; ) {
        var t = l;
        cs(t), t.tag === 5 && t.flags & 1024 && t.stateNode.reset(), l = l.sibling;
      }
  }
  function Ft(l, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        ls(l, t.alternate, t), t = t.sibling;
  }
  function Ze(l) {
    for (l = l.child; l !== null; ) {
      var t = l;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          oe(4, t, t.return), Ze(t);
          break;
        case 1:
          qt(t, t.return);
          var e = t.stateNode;
          typeof e.componentWillUnmount == "function" && Fm(
            t,
            t.return,
            e
          ), Ze(t);
          break;
        case 27:
          gn(t.stateNode);
        case 26:
        case 5:
          qt(t, t.return), Ze(t);
          break;
        case 22:
          t.memoizedState === null && Ze(t);
          break;
        case 30:
          Ze(t);
          break;
        default:
          Ze(t);
      }
      l = l.sibling;
    }
  }
  function Wt(l, t, e) {
    for (e = e && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var a = t.alternate, n = l, u = t, c = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          Wt(
            n,
            u,
            e
          ), cn(4, u);
          break;
        case 1:
          if (Wt(
            n,
            u,
            e
          ), a = u, n = a.stateNode, typeof n.componentDidMount == "function")
            try {
              n.componentDidMount();
            } catch (y) {
              il(a, a.return, y);
            }
          if (a = u, n = a.updateQueue, n !== null) {
            var f = a.stateNode;
            try {
              var h = n.shared.hiddenCallbacks;
              if (h !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < h.length; n++)
                  Gh(h[n], f);
            } catch (y) {
              il(a, a.return, y);
            }
          }
          e && c & 64 && wm(u), fn(u, u.return);
          break;
        case 27:
          Im(u);
        case 26:
        case 5:
          Wt(
            n,
            u,
            e
          ), e && a === null && c & 4 && Wm(u), fn(u, u.return);
          break;
        case 12:
          Wt(
            n,
            u,
            e
          );
          break;
        case 31:
          Wt(
            n,
            u,
            e
          ), e && c & 4 && as(n, u);
          break;
        case 13:
          Wt(
            n,
            u,
            e
          ), e && c & 4 && ns(n, u);
          break;
        case 22:
          u.memoizedState === null && Wt(
            n,
            u,
            e
          ), fn(u, u.return);
          break;
        case 30:
          break;
        default:
          Wt(
            n,
            u,
            e
          );
      }
      t = t.sibling;
    }
  }
  function Ni(l, t) {
    var e = null;
    l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (e = l.memoizedState.cachePool.pool), l = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (l = t.memoizedState.cachePool.pool), l !== e && (l != null && l.refCount++, e != null && ka(e));
  }
  function _i(l, t) {
    l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && ka(l));
  }
  function Ut(l, t, e, a) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        is(
          l,
          t,
          e,
          a
        ), t = t.sibling;
  }
  function is(l, t, e, a) {
    var n = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Ut(
          l,
          t,
          e,
          a
        ), n & 2048 && cn(9, t);
        break;
      case 1:
        Ut(
          l,
          t,
          e,
          a
        );
        break;
      case 3:
        Ut(
          l,
          t,
          e,
          a
        ), n & 2048 && (l = null, t.alternate !== null && (l = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== l && (t.refCount++, l != null && ka(l)));
        break;
      case 12:
        if (n & 2048) {
          Ut(
            l,
            t,
            e,
            a
          ), l = t.stateNode;
          try {
            var u = t.memoizedProps, c = u.id, f = u.onPostCommit;
            typeof f == "function" && f(
              c,
              t.alternate === null ? "mount" : "update",
              l.passiveEffectDuration,
              -0
            );
          } catch (h) {
            il(t, t.return, h);
          }
        } else
          Ut(
            l,
            t,
            e,
            a
          );
        break;
      case 31:
        Ut(
          l,
          t,
          e,
          a
        );
        break;
      case 13:
        Ut(
          l,
          t,
          e,
          a
        );
        break;
      case 23:
        break;
      case 22:
        u = t.stateNode, c = t.alternate, t.memoizedState !== null ? u._visibility & 2 ? Ut(
          l,
          t,
          e,
          a
        ) : hn(l, t) : u._visibility & 2 ? Ut(
          l,
          t,
          e,
          a
        ) : (u._visibility |= 2, ga(
          l,
          t,
          e,
          a,
          (t.subtreeFlags & 10256) !== 0 || !1
        )), n & 2048 && Ni(c, t);
        break;
      case 24:
        Ut(
          l,
          t,
          e,
          a
        ), n & 2048 && _i(t.alternate, t);
        break;
      default:
        Ut(
          l,
          t,
          e,
          a
        );
    }
  }
  function ga(l, t, e, a, n) {
    for (n = n && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var u = l, c = t, f = e, h = a, y = c.flags;
      switch (c.tag) {
        case 0:
        case 11:
        case 15:
          ga(
            u,
            c,
            f,
            h,
            n
          ), cn(8, c);
          break;
        case 23:
          break;
        case 22:
          var b = c.stateNode;
          c.memoizedState !== null ? b._visibility & 2 ? ga(
            u,
            c,
            f,
            h,
            n
          ) : hn(
            u,
            c
          ) : (b._visibility |= 2, ga(
            u,
            c,
            f,
            h,
            n
          )), n && y & 2048 && Ni(
            c.alternate,
            c
          );
          break;
        case 24:
          ga(
            u,
            c,
            f,
            h,
            n
          ), n && y & 2048 && _i(c.alternate, c);
          break;
        default:
          ga(
            u,
            c,
            f,
            h,
            n
          );
      }
      t = t.sibling;
    }
  }
  function hn(l, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var e = l, a = t, n = a.flags;
        switch (a.tag) {
          case 22:
            hn(e, a), n & 2048 && Ni(
              a.alternate,
              a
            );
            break;
          case 24:
            hn(e, a), n & 2048 && _i(a.alternate, a);
            break;
          default:
            hn(e, a);
        }
        t = t.sibling;
      }
  }
  var mn = 8192;
  function Ea(l, t, e) {
    if (l.subtreeFlags & mn)
      for (l = l.child; l !== null; )
        fs(
          l,
          t,
          e
        ), l = l.sibling;
  }
  function fs(l, t, e) {
    switch (l.tag) {
      case 26:
        Ea(
          l,
          t,
          e
        ), l.flags & mn && l.memoizedState !== null && ed(
          e,
          Dt,
          l.memoizedState,
          l.memoizedProps
        );
        break;
      case 5:
        Ea(
          l,
          t,
          e
        );
        break;
      case 3:
      case 4:
        var a = Dt;
        Dt = Uu(l.stateNode.containerInfo), Ea(
          l,
          t,
          e
        ), Dt = a;
        break;
      case 22:
        l.memoizedState === null && (a = l.alternate, a !== null && a.memoizedState !== null ? (a = mn, mn = 16777216, Ea(
          l,
          t,
          e
        ), mn = a) : Ea(
          l,
          t,
          e
        ));
        break;
      default:
        Ea(
          l,
          t,
          e
        );
    }
  }
  function hs(l) {
    var t = l.alternate;
    if (t !== null && (l = t.child, l !== null)) {
      t.child = null;
      do
        t = l.sibling, l.sibling = null, l = t;
      while (l !== null);
    }
  }
  function sn(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var e = 0; e < t.length; e++) {
          var a = t[e];
          Ll = a, ss(
            a,
            l
          );
        }
      hs(l);
    }
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; )
        ms(l), l = l.sibling;
  }
  function ms(l) {
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        sn(l), l.flags & 2048 && oe(9, l, l.return);
        break;
      case 3:
        sn(l);
        break;
      case 12:
        sn(l);
        break;
      case 22:
        var t = l.stateNode;
        l.memoizedState !== null && t._visibility & 2 && (l.return === null || l.return.tag !== 13) ? (t._visibility &= -3, gu(l)) : sn(l);
        break;
      default:
        sn(l);
    }
  }
  function gu(l) {
    var t = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (t !== null)
        for (var e = 0; e < t.length; e++) {
          var a = t[e];
          Ll = a, ss(
            a,
            l
          );
        }
      hs(l);
    }
    for (l = l.child; l !== null; ) {
      switch (t = l, t.tag) {
        case 0:
        case 11:
        case 15:
          oe(8, t, t.return), gu(t);
          break;
        case 22:
          e = t.stateNode, e._visibility & 2 && (e._visibility &= -3, gu(t));
          break;
        default:
          gu(t);
      }
      l = l.sibling;
    }
  }
  function ss(l, t) {
    for (; Ll !== null; ) {
      var e = Ll;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          oe(8, e, t);
          break;
        case 23:
        case 22:
          if (e.memoizedState !== null && e.memoizedState.cachePool !== null) {
            var a = e.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          ka(e.memoizedState.cache);
      }
      if (a = e.child, a !== null) a.return = e, Ll = a;
      else
        l: for (e = l; Ll !== null; ) {
          a = Ll;
          var n = a.sibling, u = a.return;
          if (ts(a), a === e) {
            Ll = null;
            break l;
          }
          if (n !== null) {
            n.return = u, Ll = n;
            break l;
          }
          Ll = u;
        }
    }
  }
  var g0 = {
    getCacheForType: function(l) {
      var t = jl(Cl), e = t.data.get(l);
      return e === void 0 && (e = l(), t.data.set(l, e)), e;
    },
    cacheSignal: function() {
      return jl(Cl).controller.signal;
    }
  }, E0 = typeof WeakMap == "function" ? WeakMap : Map, nl = 0, dl = null, F = null, $ = 0, cl = 0, ot = null, de = !1, ba = !1, Oi = !1, $t = 0, Al = 0, ve = 0, Ve = 0, Di = 0, dt = 0, Sa = 0, rn = null, nt = null, Ui = !1, Eu = 0, rs = 0, bu = 1 / 0, Su = null, ye = null, Yl = 0, ge = null, pa = null, It = 0, Ci = 0, Hi = null, os = null, on = 0, qi = null;
  function vt() {
    return (nl & 2) !== 0 && $ !== 0 ? $ & -$ : S.T !== null ? Li() : Df();
  }
  function ds() {
    if (dt === 0)
      if (($ & 536870912) === 0 || ll) {
        var l = On;
        On <<= 1, (On & 3932160) === 0 && (On = 262144), dt = l;
      } else dt = 536870912;
    return l = st.current, l !== null && (l.flags |= 32), dt;
  }
  function ut(l, t, e) {
    (l === dl && (cl === 2 || cl === 9) || l.cancelPendingCommit !== null) && (za(l, 0), Ee(
      l,
      $,
      dt,
      !1
    )), qa(l, e), ((nl & 2) === 0 || l !== dl) && (l === dl && ((nl & 2) === 0 && (Ve |= e), Al === 4 && Ee(
      l,
      $,
      dt,
      !1
    )), Bt(l));
  }
  function vs(l, t, e) {
    if ((nl & 6) !== 0) throw Error(o(327));
    var a = !e && (t & 127) === 0 && (t & l.expiredLanes) === 0 || Ha(l, t), n = a ? p0(l, t) : Ri(l, t, !0), u = a;
    do {
      if (n === 0) {
        ba && !a && Ee(l, t, 0, !1);
        break;
      } else {
        if (e = l.current.alternate, u && !b0(e)) {
          n = Ri(l, t, !1), u = !1;
          continue;
        }
        if (n === 2) {
          if (u = t, l.errorRecoveryDisabledLanes & u)
            var c = 0;
          else
            c = l.pendingLanes & -536870913, c = c !== 0 ? c : c & 536870912 ? 536870912 : 0;
          if (c !== 0) {
            t = c;
            l: {
              var f = l;
              n = rn;
              var h = f.current.memoizedState.isDehydrated;
              if (h && (za(f, c).flags |= 256), c = Ri(
                f,
                c,
                !1
              ), c !== 2) {
                if (Oi && !h) {
                  f.errorRecoveryDisabledLanes |= u, Ve |= u, n = 4;
                  break l;
                }
                u = nt, nt = n, u !== null && (nt === null ? nt = u : nt.push.apply(
                  nt,
                  u
                ));
              }
              n = c;
            }
            if (u = !1, n !== 2) continue;
          }
        }
        if (n === 1) {
          za(l, 0), Ee(l, t, 0, !0);
          break;
        }
        l: {
          switch (a = l, u = n, u) {
            case 0:
            case 1:
              throw Error(o(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              Ee(
                a,
                t,
                dt,
                !de
              );
              break l;
            case 2:
              nt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && (n = Eu + 300 - ct(), 10 < n)) {
            if (Ee(
              a,
              t,
              dt,
              !de
            ), Un(a, 0, !0) !== 0) break l;
            It = t, a.timeoutHandle = Js(
              ys.bind(
                null,
                a,
                e,
                nt,
                Su,
                Ui,
                t,
                dt,
                Ve,
                Sa,
                de,
                u,
                "Throttled",
                -0,
                0
              ),
              n
            );
            break l;
          }
          ys(
            a,
            e,
            nt,
            Su,
            Ui,
            t,
            dt,
            Ve,
            Sa,
            de,
            u,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Bt(l);
  }
  function ys(l, t, e, a, n, u, c, f, h, y, b, T, g, E) {
    if (l.timeoutHandle = -1, T = t.subtreeFlags, T & 8192 || (T & 16785408) === 16785408) {
      T = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Gt
      }, fs(
        t,
        u,
        T
      );
      var D = (u & 62914560) === u ? Eu - ct() : (u & 4194048) === u ? rs - ct() : 0;
      if (D = ad(
        T,
        D
      ), D !== null) {
        It = u, l.cancelPendingCommit = D(
          As.bind(
            null,
            l,
            t,
            u,
            e,
            a,
            n,
            c,
            f,
            h,
            b,
            T,
            null,
            g,
            E
          )
        ), Ee(l, u, c, !y);
        return;
      }
    }
    As(
      l,
      t,
      u,
      e,
      a,
      n,
      c,
      f,
      h
    );
  }
  function b0(l) {
    for (var t = l; ; ) {
      var e = t.tag;
      if ((e === 0 || e === 11 || e === 15) && t.flags & 16384 && (e = t.updateQueue, e !== null && (e = e.stores, e !== null)))
        for (var a = 0; a < e.length; a++) {
          var n = e[a], u = n.getSnapshot;
          n = n.value;
          try {
            if (!ht(u(), n)) return !1;
          } catch {
            return !1;
          }
        }
      if (e = t.child, t.subtreeFlags & 16384 && e !== null)
        e.return = t, t = e;
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
  function Ee(l, t, e, a) {
    t &= ~Di, t &= ~Ve, l.suspendedLanes |= t, l.pingedLanes &= ~t, a && (l.warmLanes |= t), a = l.expirationTimes;
    for (var n = t; 0 < n; ) {
      var u = 31 - ft(n), c = 1 << u;
      a[u] = -1, n &= ~c;
    }
    e !== 0 && Nf(l, e, t);
  }
  function pu() {
    return (nl & 6) === 0 ? (dn(0), !1) : !0;
  }
  function Bi() {
    if (F !== null) {
      if (cl === 0)
        var l = F.return;
      else
        l = F, Qt = Re = null, Wc(l), ra = null, Fa = 0, l = F;
      for (; l !== null; )
        km(l.alternate, l), l = l.return;
      F = null;
    }
  }
  function za(l, t) {
    var e = l.timeoutHandle;
    e !== -1 && (l.timeoutHandle = -1, L0(e)), e = l.cancelPendingCommit, e !== null && (l.cancelPendingCommit = null, e()), It = 0, Bi(), dl = l, F = e = Lt(l.current, null), $ = t, cl = 0, ot = null, de = !1, ba = Ha(l, t), Oi = !1, Sa = dt = Di = Ve = ve = Al = 0, nt = rn = null, Ui = !1, (t & 8) !== 0 && (t |= t & 32);
    var a = l.entangledLanes;
    if (a !== 0)
      for (l = l.entanglements, a &= t; 0 < a; ) {
        var n = 31 - ft(a), u = 1 << n;
        t |= l[n], a &= ~u;
      }
    return $t = t, jn(), e;
  }
  function gs(l, t) {
    V = null, S.H = an, t === sa || t === Wn ? (t = qh(), cl = 3) : t === xc ? (t = qh(), cl = 4) : cl = t === ri ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, ot = t, F === null && (Al = 1, mu(
      l,
      bt(t, l.current)
    ));
  }
  function Es() {
    var l = st.current;
    return l === null ? !0 : ($ & 4194048) === $ ? Tt === null : ($ & 62914560) === $ || ($ & 536870912) !== 0 ? l === Tt : !1;
  }
  function bs() {
    var l = S.H;
    return S.H = an, l === null ? an : l;
  }
  function Ss() {
    var l = S.A;
    return S.A = g0, l;
  }
  function zu() {
    Al = 4, de || ($ & 4194048) !== $ && st.current !== null || (ba = !0), (ve & 134217727) === 0 && (Ve & 134217727) === 0 || dl === null || Ee(
      dl,
      $,
      dt,
      !1
    );
  }
  function Ri(l, t, e) {
    var a = nl;
    nl |= 2;
    var n = bs(), u = Ss();
    (dl !== l || $ !== t) && (Su = null, za(l, t)), t = !1;
    var c = Al;
    l: do
      try {
        if (cl !== 0 && F !== null) {
          var f = F, h = ot;
          switch (cl) {
            case 8:
              Bi(), c = 6;
              break l;
            case 3:
            case 2:
            case 9:
            case 6:
              st.current === null && (t = !0);
              var y = cl;
              if (cl = 0, ot = null, Ta(l, f, h, y), e && ba) {
                c = 0;
                break l;
              }
              break;
            default:
              y = cl, cl = 0, ot = null, Ta(l, f, h, y);
          }
        }
        S0(), c = Al;
        break;
      } catch (b) {
        gs(l, b);
      }
    while (!0);
    return t && l.shellSuspendCounter++, Qt = Re = null, nl = a, S.H = n, S.A = u, F === null && (dl = null, $ = 0, jn()), c;
  }
  function S0() {
    for (; F !== null; ) ps(F);
  }
  function p0(l, t) {
    var e = nl;
    nl |= 2;
    var a = bs(), n = Ss();
    dl !== l || $ !== t ? (Su = null, bu = ct() + 500, za(l, t)) : ba = Ha(
      l,
      t
    );
    l: do
      try {
        if (cl !== 0 && F !== null) {
          t = F;
          var u = ot;
          t: switch (cl) {
            case 1:
              cl = 0, ot = null, Ta(l, t, u, 1);
              break;
            case 2:
            case 9:
              if (Ch(u)) {
                cl = 0, ot = null, zs(t);
                break;
              }
              t = function() {
                cl !== 2 && cl !== 9 || dl !== l || (cl = 7), Bt(l);
              }, u.then(t, t);
              break l;
            case 3:
              cl = 7;
              break l;
            case 4:
              cl = 5;
              break l;
            case 7:
              Ch(u) ? (cl = 0, ot = null, zs(t)) : (cl = 0, ot = null, Ta(l, t, u, 7));
              break;
            case 5:
              var c = null;
              switch (F.tag) {
                case 26:
                  c = F.memoizedState;
                case 5:
                case 27:
                  var f = F;
                  if (c ? ir(c) : f.stateNode.complete) {
                    cl = 0, ot = null;
                    var h = f.sibling;
                    if (h !== null) F = h;
                    else {
                      var y = f.return;
                      y !== null ? (F = y, Tu(y)) : F = null;
                    }
                    break t;
                  }
              }
              cl = 0, ot = null, Ta(l, t, u, 5);
              break;
            case 6:
              cl = 0, ot = null, Ta(l, t, u, 6);
              break;
            case 8:
              Bi(), Al = 6;
              break l;
            default:
              throw Error(o(462));
          }
        }
        z0();
        break;
      } catch (b) {
        gs(l, b);
      }
    while (!0);
    return Qt = Re = null, S.H = a, S.A = n, nl = e, F !== null ? 0 : (dl = null, $ = 0, jn(), Al);
  }
  function z0() {
    for (; F !== null && !Vr(); )
      ps(F);
  }
  function ps(l) {
    var t = Km(l.alternate, l, $t);
    l.memoizedProps = l.pendingProps, t === null ? Tu(l) : F = t;
  }
  function zs(l) {
    var t = l, e = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Lm(
          e,
          t,
          t.pendingProps,
          t.type,
          void 0,
          $
        );
        break;
      case 11:
        t = Lm(
          e,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          $
        );
        break;
      case 5:
        Wc(t);
      default:
        km(e, t), t = F = Sh(t, $t), t = Km(e, t, $t);
    }
    l.memoizedProps = l.pendingProps, t === null ? Tu(l) : F = t;
  }
  function Ta(l, t, e, a) {
    Qt = Re = null, Wc(t), ra = null, Fa = 0;
    var n = t.return;
    try {
      if (m0(
        l,
        n,
        t,
        e,
        $
      )) {
        Al = 1, mu(
          l,
          bt(e, l.current)
        ), F = null;
        return;
      }
    } catch (u) {
      if (n !== null) throw F = n, u;
      Al = 1, mu(
        l,
        bt(e, l.current)
      ), F = null;
      return;
    }
    t.flags & 32768 ? (ll || a === 1 ? l = !0 : ba || ($ & 536870912) !== 0 ? l = !1 : (de = l = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = st.current, a !== null && a.tag === 13 && (a.flags |= 16384))), Ts(t, l)) : Tu(t);
  }
  function Tu(l) {
    var t = l;
    do {
      if ((t.flags & 32768) !== 0) {
        Ts(
          t,
          de
        );
        return;
      }
      l = t.return;
      var e = o0(
        t.alternate,
        t,
        $t
      );
      if (e !== null) {
        F = e;
        return;
      }
      if (t = t.sibling, t !== null) {
        F = t;
        return;
      }
      F = t = l;
    } while (t !== null);
    Al === 0 && (Al = 5);
  }
  function Ts(l, t) {
    do {
      var e = d0(l.alternate, l);
      if (e !== null) {
        e.flags &= 32767, F = e;
        return;
      }
      if (e = l.return, e !== null && (e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null), !t && (l = l.sibling, l !== null)) {
        F = l;
        return;
      }
      F = l = e;
    } while (l !== null);
    Al = 6, F = null;
  }
  function As(l, t, e, a, n, u, c, f, h) {
    l.cancelPendingCommit = null;
    do
      Au();
    while (Yl !== 0);
    if ((nl & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === l.current) throw Error(o(177));
      if (u = t.lanes | t.childLanes, u |= Tc, lo(
        l,
        e,
        u,
        c,
        f,
        h
      ), l === dl && (F = dl = null, $ = 0), pa = t, ge = l, It = e, Ci = u, Hi = n, os = a, (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? (l.callbackNode = null, l.callbackPriority = 0, N0(Nn, function() {
        return Ds(), null;
      })) : (l.callbackNode = null, l.callbackPriority = 0), a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
        a = S.T, S.T = null, n = _.p, _.p = 2, c = nl, nl |= 4;
        try {
          v0(l, t, e);
        } finally {
          nl = c, _.p = n, S.T = a;
        }
      }
      Yl = 1, Ms(), Ns(), _s();
    }
  }
  function Ms() {
    if (Yl === 1) {
      Yl = 0;
      var l = ge, t = pa, e = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || e) {
        e = S.T, S.T = null;
        var a = _.p;
        _.p = 2;
        var n = nl;
        nl |= 4;
        try {
          us(t, l);
          var u = ki, c = sh(l.containerInfo), f = u.focusedElem, h = u.selectionRange;
          if (c !== f && f && f.ownerDocument && mh(
            f.ownerDocument.documentElement,
            f
          )) {
            if (h !== null && Ec(f)) {
              var y = h.start, b = h.end;
              if (b === void 0 && (b = y), "selectionStart" in f)
                f.selectionStart = y, f.selectionEnd = Math.min(
                  b,
                  f.value.length
                );
              else {
                var T = f.ownerDocument || document, g = T && T.defaultView || window;
                if (g.getSelection) {
                  var E = g.getSelection(), D = f.textContent.length, G = Math.min(h.start, D), rl = h.end === void 0 ? G : Math.min(h.end, D);
                  !E.extend && G > rl && (c = rl, rl = G, G = c);
                  var d = hh(
                    f,
                    G
                  ), m = hh(
                    f,
                    rl
                  );
                  if (d && m && (E.rangeCount !== 1 || E.anchorNode !== d.node || E.anchorOffset !== d.offset || E.focusNode !== m.node || E.focusOffset !== m.offset)) {
                    var v = T.createRange();
                    v.setStart(d.node, d.offset), E.removeAllRanges(), G > rl ? (E.addRange(v), E.extend(m.node, m.offset)) : (v.setEnd(m.node, m.offset), E.addRange(v));
                  }
                }
              }
            }
            for (T = [], E = f; E = E.parentNode; )
              E.nodeType === 1 && T.push({
                element: E,
                left: E.scrollLeft,
                top: E.scrollTop
              });
            for (typeof f.focus == "function" && f.focus(), f = 0; f < T.length; f++) {
              var p = T[f];
              p.element.scrollLeft = p.left, p.element.scrollTop = p.top;
            }
          }
          Yu = !!Ji, ki = Ji = null;
        } finally {
          nl = n, _.p = a, S.T = e;
        }
      }
      l.current = t, Yl = 2;
    }
  }
  function Ns() {
    if (Yl === 2) {
      Yl = 0;
      var l = ge, t = pa, e = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || e) {
        e = S.T, S.T = null;
        var a = _.p;
        _.p = 2;
        var n = nl;
        nl |= 4;
        try {
          ls(l, t.alternate, t);
        } finally {
          nl = n, _.p = a, S.T = e;
        }
      }
      Yl = 3;
    }
  }
  function _s() {
    if (Yl === 4 || Yl === 3) {
      Yl = 0, Kr();
      var l = ge, t = pa, e = It, a = os;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0 ? Yl = 5 : (Yl = 0, pa = ge = null, Os(l, l.pendingLanes));
      var n = l.pendingLanes;
      if (n === 0 && (ye = null), Pu(e), t = t.stateNode, it && typeof it.onCommitFiberRoot == "function")
        try {
          it.onCommitFiberRoot(
            Ca,
            t,
            void 0,
            (t.current.flags & 128) === 128
          );
        } catch {
        }
      if (a !== null) {
        t = S.T, n = _.p, _.p = 2, S.T = null;
        try {
          for (var u = l.onRecoverableError, c = 0; c < a.length; c++) {
            var f = a[c];
            u(f.value, {
              componentStack: f.stack
            });
          }
        } finally {
          S.T = t, _.p = n;
        }
      }
      (It & 3) !== 0 && Au(), Bt(l), n = l.pendingLanes, (e & 261930) !== 0 && (n & 42) !== 0 ? l === qi ? on++ : (on = 0, qi = l) : on = 0, dn(0);
    }
  }
  function Os(l, t) {
    (l.pooledCacheLanes &= t) === 0 && (t = l.pooledCache, t != null && (l.pooledCache = null, ka(t)));
  }
  function Au() {
    return Ms(), Ns(), _s(), Ds();
  }
  function Ds() {
    if (Yl !== 5) return !1;
    var l = ge, t = Ci;
    Ci = 0;
    var e = Pu(It), a = S.T, n = _.p;
    try {
      _.p = 32 > e ? 32 : e, S.T = null, e = Hi, Hi = null;
      var u = ge, c = It;
      if (Yl = 0, pa = ge = null, It = 0, (nl & 6) !== 0) throw Error(o(331));
      var f = nl;
      if (nl |= 4, ms(u.current), is(
        u,
        u.current,
        c,
        e
      ), nl = f, dn(0, !1), it && typeof it.onPostCommitFiberRoot == "function")
        try {
          it.onPostCommitFiberRoot(Ca, u);
        } catch {
        }
      return !0;
    } finally {
      _.p = n, S.T = a, Os(l, t);
    }
  }
  function Us(l, t, e) {
    t = bt(e, t), t = si(l.stateNode, t, 2), l = me(l, t, 2), l !== null && (qa(l, 2), Bt(l));
  }
  function il(l, t, e) {
    if (l.tag === 3)
      Us(l, l, e);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Us(
            t,
            l,
            e
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (ye === null || !ye.has(a))) {
            l = bt(e, l), e = Cm(2), a = me(t, e, 2), a !== null && (Hm(
              e,
              a,
              t,
              l
            ), qa(a, 2), Bt(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function Yi(l, t, e) {
    var a = l.pingCache;
    if (a === null) {
      a = l.pingCache = new E0();
      var n = /* @__PURE__ */ new Set();
      a.set(t, n);
    } else
      n = a.get(t), n === void 0 && (n = /* @__PURE__ */ new Set(), a.set(t, n));
    n.has(e) || (Oi = !0, n.add(e), l = T0.bind(null, l, t, e), t.then(l, l));
  }
  function T0(l, t, e) {
    var a = l.pingCache;
    a !== null && a.delete(t), l.pingedLanes |= l.suspendedLanes & e, l.warmLanes &= ~e, dl === l && ($ & e) === e && (Al === 4 || Al === 3 && ($ & 62914560) === $ && 300 > ct() - Eu ? (nl & 2) === 0 && za(l, 0) : Di |= e, Sa === $ && (Sa = 0)), Bt(l);
  }
  function Cs(l, t) {
    t === 0 && (t = Mf()), l = He(l, t), l !== null && (qa(l, t), Bt(l));
  }
  function A0(l) {
    var t = l.memoizedState, e = 0;
    t !== null && (e = t.retryLane), Cs(l, e);
  }
  function M0(l, t) {
    var e = 0;
    switch (l.tag) {
      case 31:
      case 13:
        var a = l.stateNode, n = l.memoizedState;
        n !== null && (e = n.retryLane);
        break;
      case 19:
        a = l.stateNode;
        break;
      case 22:
        a = l.stateNode._retryCache;
        break;
      default:
        throw Error(o(314));
    }
    a !== null && a.delete(t), Cs(l, e);
  }
  function N0(l, t) {
    return Fu(l, t);
  }
  var Mu = null, Aa = null, Gi = !1, Nu = !1, xi = !1, be = 0;
  function Bt(l) {
    l !== Aa && l.next === null && (Aa === null ? Mu = Aa = l : Aa = Aa.next = l), Nu = !0, Gi || (Gi = !0, O0());
  }
  function dn(l, t) {
    if (!xi && Nu) {
      xi = !0;
      do
        for (var e = !1, a = Mu; a !== null; ) {
          if (l !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var u = 0;
            else {
              var c = a.suspendedLanes, f = a.pingedLanes;
              u = (1 << 31 - ft(42 | l) + 1) - 1, u &= n & ~(c & ~f), u = u & 201326741 ? u & 201326741 | 1 : u ? u | 2 : 0;
            }
            u !== 0 && (e = !0, Rs(a, u));
          } else
            u = $, u = Un(
              a,
              a === dl ? u : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (u & 3) === 0 || Ha(a, u) || (e = !0, Rs(a, u));
          a = a.next;
        }
      while (e);
      xi = !1;
    }
  }
  function _0() {
    Hs();
  }
  function Hs() {
    Nu = Gi = !1;
    var l = 0;
    be !== 0 && x0() && (l = be);
    for (var t = ct(), e = null, a = Mu; a !== null; ) {
      var n = a.next, u = qs(a, t);
      u === 0 ? (a.next = null, e === null ? Mu = n : e.next = n, n === null && (Aa = e)) : (e = a, (l !== 0 || (u & 3) !== 0) && (Nu = !0)), a = n;
    }
    Yl !== 0 && Yl !== 5 || dn(l), be !== 0 && (be = 0);
  }
  function qs(l, t) {
    for (var e = l.suspendedLanes, a = l.pingedLanes, n = l.expirationTimes, u = l.pendingLanes & -62914561; 0 < u; ) {
      var c = 31 - ft(u), f = 1 << c, h = n[c];
      h === -1 ? ((f & e) === 0 || (f & a) !== 0) && (n[c] = Pr(f, t)) : h <= t && (l.expiredLanes |= f), u &= ~f;
    }
    if (t = dl, e = $, e = Un(
      l,
      l === t ? e : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), a = l.callbackNode, e === 0 || l === t && (cl === 2 || cl === 9) || l.cancelPendingCommit !== null)
      return a !== null && a !== null && Wu(a), l.callbackNode = null, l.callbackPriority = 0;
    if ((e & 3) === 0 || Ha(l, e)) {
      if (t = e & -e, t === l.callbackPriority) return t;
      switch (a !== null && Wu(a), Pu(e)) {
        case 2:
        case 8:
          e = Tf;
          break;
        case 32:
          e = Nn;
          break;
        case 268435456:
          e = Af;
          break;
        default:
          e = Nn;
      }
      return a = Bs.bind(null, l), e = Fu(e, a), l.callbackPriority = t, l.callbackNode = e, t;
    }
    return a !== null && a !== null && Wu(a), l.callbackPriority = 2, l.callbackNode = null, 2;
  }
  function Bs(l, t) {
    if (Yl !== 0 && Yl !== 5)
      return l.callbackNode = null, l.callbackPriority = 0, null;
    var e = l.callbackNode;
    if (Au() && l.callbackNode !== e)
      return null;
    var a = $;
    return a = Un(
      l,
      l === dl ? a : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), a === 0 ? null : (vs(l, a, t), qs(l, ct()), l.callbackNode != null && l.callbackNode === e ? Bs.bind(null, l) : null);
  }
  function Rs(l, t) {
    if (Au()) return null;
    vs(l, t, !0);
  }
  function O0() {
    X0(function() {
      (nl & 6) !== 0 ? Fu(
        zf,
        _0
      ) : Hs();
    });
  }
  function Li() {
    if (be === 0) {
      var l = ha;
      l === 0 && (l = _n, _n <<= 1, (_n & 261888) === 0 && (_n = 256)), be = l;
    }
    return be;
  }
  function Ys(l) {
    return l == null || typeof l == "symbol" || typeof l == "boolean" ? null : typeof l == "function" ? l : Bn("" + l);
  }
  function Gs(l, t) {
    var e = t.ownerDocument.createElement("input");
    return e.name = t.name, e.value = t.value, l.id && e.setAttribute("form", l.id), t.parentNode.insertBefore(e, t), l = new FormData(l), e.parentNode.removeChild(e), l;
  }
  function D0(l, t, e, a, n) {
    if (t === "submit" && e && e.stateNode === n) {
      var u = Ys(
        (n[Pl] || null).action
      ), c = a.submitter;
      c && (t = (t = c[Pl] || null) ? Ys(t.formAction) : c.getAttribute("formAction"), t !== null && (u = t, c = null));
      var f = new xn(
        "action",
        "action",
        null,
        a,
        n
      );
      l.push({
        event: f,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (be !== 0) {
                  var h = c ? Gs(n, c) : new FormData(n);
                  ui(
                    e,
                    {
                      pending: !0,
                      data: h,
                      method: n.method,
                      action: u
                    },
                    null,
                    h
                  );
                }
              } else
                typeof u == "function" && (f.preventDefault(), h = c ? Gs(n, c) : new FormData(n), ui(
                  e,
                  {
                    pending: !0,
                    data: h,
                    method: n.method,
                    action: u
                  },
                  u,
                  h
                ));
            },
            currentTarget: n
          }
        ]
      });
    }
  }
  for (var Xi = 0; Xi < zc.length; Xi++) {
    var Qi = zc[Xi], U0 = Qi.toLowerCase(), C0 = Qi[0].toUpperCase() + Qi.slice(1);
    Ot(
      U0,
      "on" + C0
    );
  }
  Ot(dh, "onAnimationEnd"), Ot(vh, "onAnimationIteration"), Ot(yh, "onAnimationStart"), Ot("dblclick", "onDoubleClick"), Ot("focusin", "onFocus"), Ot("focusout", "onBlur"), Ot(ko, "onTransitionRun"), Ot(wo, "onTransitionStart"), Ot(Fo, "onTransitionCancel"), Ot(gh, "onTransitionEnd"), Fe("onMouseEnter", ["mouseout", "mouseover"]), Fe("onMouseLeave", ["mouseout", "mouseover"]), Fe("onPointerEnter", ["pointerout", "pointerover"]), Fe("onPointerLeave", ["pointerout", "pointerover"]), Oe(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Oe(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Oe("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Oe(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Oe(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Oe(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var vn = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), H0 = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(vn)
  );
  function xs(l, t) {
    t = (t & 4) !== 0;
    for (var e = 0; e < l.length; e++) {
      var a = l[e], n = a.event;
      a = a.listeners;
      l: {
        var u = void 0;
        if (t)
          for (var c = a.length - 1; 0 <= c; c--) {
            var f = a[c], h = f.instance, y = f.currentTarget;
            if (f = f.listener, h !== u && n.isPropagationStopped())
              break l;
            u = f, n.currentTarget = y;
            try {
              u(n);
            } catch (b) {
              Qn(b);
            }
            n.currentTarget = null, u = h;
          }
        else
          for (c = 0; c < a.length; c++) {
            if (f = a[c], h = f.instance, y = f.currentTarget, f = f.listener, h !== u && n.isPropagationStopped())
              break l;
            u = f, n.currentTarget = y;
            try {
              u(n);
            } catch (b) {
              Qn(b);
            }
            n.currentTarget = null, u = h;
          }
      }
    }
  }
  function W(l, t) {
    var e = t[lc];
    e === void 0 && (e = t[lc] = /* @__PURE__ */ new Set());
    var a = l + "__bubble";
    e.has(a) || (Ls(t, l, 2, !1), e.add(a));
  }
  function ji(l, t, e) {
    var a = 0;
    t && (a |= 4), Ls(
      e,
      l,
      a,
      t
    );
  }
  var _u = "_reactListening" + Math.random().toString(36).slice(2);
  function Zi(l) {
    if (!l[_u]) {
      l[_u] = !0, Hf.forEach(function(e) {
        e !== "selectionchange" && (H0.has(e) || ji(e, !1, l), ji(e, !0, l));
      });
      var t = l.nodeType === 9 ? l : l.ownerDocument;
      t === null || t[_u] || (t[_u] = !0, ji("selectionchange", !1, t));
    }
  }
  function Ls(l, t, e, a) {
    switch (dr(t)) {
      case 2:
        var n = cd;
        break;
      case 8:
        n = id;
        break;
      default:
        n = nf;
    }
    e = n.bind(
      null,
      t,
      e,
      l
    ), n = void 0, !hc || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (n = !0), a ? n !== void 0 ? l.addEventListener(t, e, {
      capture: !0,
      passive: n
    }) : l.addEventListener(t, e, !0) : n !== void 0 ? l.addEventListener(t, e, {
      passive: n
    }) : l.addEventListener(t, e, !1);
  }
  function Vi(l, t, e, a, n) {
    var u = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      l: for (; ; ) {
        if (a === null) return;
        var c = a.tag;
        if (c === 3 || c === 4) {
          var f = a.stateNode.containerInfo;
          if (f === n) break;
          if (c === 4)
            for (c = a.return; c !== null; ) {
              var h = c.tag;
              if ((h === 3 || h === 4) && c.stateNode.containerInfo === n)
                return;
              c = c.return;
            }
          for (; f !== null; ) {
            if (c = Je(f), c === null) return;
            if (h = c.tag, h === 5 || h === 6 || h === 26 || h === 27) {
              a = u = c;
              continue l;
            }
            f = f.parentNode;
          }
        }
        a = a.return;
      }
    Vf(function() {
      var y = u, b = ic(e), T = [];
      l: {
        var g = Eh.get(l);
        if (g !== void 0) {
          var E = xn, D = l;
          switch (l) {
            case "keypress":
              if (Yn(e) === 0) break l;
            case "keydown":
            case "keyup":
              E = Mo;
              break;
            case "focusin":
              D = "focus", E = oc;
              break;
            case "focusout":
              D = "blur", E = oc;
              break;
            case "beforeblur":
            case "afterblur":
              E = oc;
              break;
            case "click":
              if (e.button === 2) break l;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              E = kf;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              E = ro;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              E = Oo;
              break;
            case dh:
            case vh:
            case yh:
              E = yo;
              break;
            case gh:
              E = Uo;
              break;
            case "scroll":
            case "scrollend":
              E = mo;
              break;
            case "wheel":
              E = Ho;
              break;
            case "copy":
            case "cut":
            case "paste":
              E = Eo;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              E = Ff;
              break;
            case "toggle":
            case "beforetoggle":
              E = Bo;
          }
          var G = (t & 4) !== 0, rl = !G && (l === "scroll" || l === "scrollend"), d = G ? g !== null ? g + "Capture" : null : g;
          G = [];
          for (var m = y, v; m !== null; ) {
            var p = m;
            if (v = p.stateNode, p = p.tag, p !== 5 && p !== 26 && p !== 27 || v === null || d === null || (p = Ya(m, d), p != null && G.push(
              yn(m, p, v)
            )), rl) break;
            m = m.return;
          }
          0 < G.length && (g = new E(
            g,
            D,
            null,
            e,
            b
          ), T.push({ event: g, listeners: G }));
        }
      }
      if ((t & 7) === 0) {
        l: {
          if (g = l === "mouseover" || l === "pointerover", E = l === "mouseout" || l === "pointerout", g && e !== cc && (D = e.relatedTarget || e.fromElement) && (Je(D) || D[Ke]))
            break l;
          if ((E || g) && (g = b.window === b ? b : (g = b.ownerDocument) ? g.defaultView || g.parentWindow : window, E ? (D = e.relatedTarget || e.toElement, E = y, D = D ? Je(D) : null, D !== null && (rl = R(D), G = D.tag, D !== rl || G !== 5 && G !== 27 && G !== 6) && (D = null)) : (E = null, D = y), E !== D)) {
            if (G = kf, p = "onMouseLeave", d = "onMouseEnter", m = "mouse", (l === "pointerout" || l === "pointerover") && (G = Ff, p = "onPointerLeave", d = "onPointerEnter", m = "pointer"), rl = E == null ? g : Ra(E), v = D == null ? g : Ra(D), g = new G(
              p,
              m + "leave",
              E,
              e,
              b
            ), g.target = rl, g.relatedTarget = v, p = null, Je(b) === y && (G = new G(
              d,
              m + "enter",
              D,
              e,
              b
            ), G.target = v, G.relatedTarget = rl, p = G), rl = p, E && D)
              t: {
                for (G = q0, d = E, m = D, v = 0, p = d; p; p = G(p))
                  v++;
                p = 0;
                for (var B = m; B; B = G(B))
                  p++;
                for (; 0 < v - p; )
                  d = G(d), v--;
                for (; 0 < p - v; )
                  m = G(m), p--;
                for (; v--; ) {
                  if (d === m || m !== null && d === m.alternate) {
                    G = d;
                    break t;
                  }
                  d = G(d), m = G(m);
                }
                G = null;
              }
            else G = null;
            E !== null && Xs(
              T,
              g,
              E,
              G,
              !1
            ), D !== null && rl !== null && Xs(
              T,
              rl,
              D,
              G,
              !0
            );
          }
        }
        l: {
          if (g = y ? Ra(y) : window, E = g.nodeName && g.nodeName.toLowerCase(), E === "select" || E === "input" && g.type === "file")
            var el = ah;
          else if (th(g))
            if (nh)
              el = Vo;
            else {
              el = jo;
              var H = Qo;
            }
          else
            E = g.nodeName, !E || E.toLowerCase() !== "input" || g.type !== "checkbox" && g.type !== "radio" ? y && uc(y.elementType) && (el = ah) : el = Zo;
          if (el && (el = el(l, y))) {
            eh(
              T,
              el,
              e,
              b
            );
            break l;
          }
          H && H(l, g, y), l === "focusout" && y && g.type === "number" && y.memoizedProps.value != null && nc(g, "number", g.value);
        }
        switch (H = y ? Ra(y) : window, l) {
          case "focusin":
            (th(H) || H.contentEditable === "true") && (ta = H, bc = y, Va = null);
            break;
          case "focusout":
            Va = bc = ta = null;
            break;
          case "mousedown":
            Sc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Sc = !1, rh(T, e, b);
            break;
          case "selectionchange":
            if (Jo) break;
          case "keydown":
          case "keyup":
            rh(T, e, b);
        }
        var K;
        if (vc)
          l: {
            switch (l) {
              case "compositionstart":
                var I = "onCompositionStart";
                break l;
              case "compositionend":
                I = "onCompositionEnd";
                break l;
              case "compositionupdate":
                I = "onCompositionUpdate";
                break l;
            }
            I = void 0;
          }
        else
          la ? Pf(l, e) && (I = "onCompositionEnd") : l === "keydown" && e.keyCode === 229 && (I = "onCompositionStart");
        I && (Wf && e.locale !== "ko" && (la || I !== "onCompositionStart" ? I === "onCompositionEnd" && la && (K = Kf()) : (ae = b, mc = "value" in ae ? ae.value : ae.textContent, la = !0)), H = Ou(y, I), 0 < H.length && (I = new wf(
          I,
          l,
          null,
          e,
          b
        ), T.push({ event: I, listeners: H }), K ? I.data = K : (K = lh(e), K !== null && (I.data = K)))), (K = Yo ? Go(l, e) : xo(l, e)) && (I = Ou(y, "onBeforeInput"), 0 < I.length && (H = new wf(
          "onBeforeInput",
          "beforeinput",
          null,
          e,
          b
        ), T.push({
          event: H,
          listeners: I
        }), H.data = K)), D0(
          T,
          l,
          y,
          e,
          b
        );
      }
      xs(T, t);
    });
  }
  function yn(l, t, e) {
    return {
      instance: l,
      listener: t,
      currentTarget: e
    };
  }
  function Ou(l, t) {
    for (var e = t + "Capture", a = []; l !== null; ) {
      var n = l, u = n.stateNode;
      if (n = n.tag, n !== 5 && n !== 26 && n !== 27 || u === null || (n = Ya(l, e), n != null && a.unshift(
        yn(l, n, u)
      ), n = Ya(l, t), n != null && a.push(
        yn(l, n, u)
      )), l.tag === 3) return a;
      l = l.return;
    }
    return [];
  }
  function q0(l) {
    if (l === null) return null;
    do
      l = l.return;
    while (l && l.tag !== 5 && l.tag !== 27);
    return l || null;
  }
  function Xs(l, t, e, a, n) {
    for (var u = t._reactName, c = []; e !== null && e !== a; ) {
      var f = e, h = f.alternate, y = f.stateNode;
      if (f = f.tag, h !== null && h === a) break;
      f !== 5 && f !== 26 && f !== 27 || y === null || (h = y, n ? (y = Ya(e, u), y != null && c.unshift(
        yn(e, y, h)
      )) : n || (y = Ya(e, u), y != null && c.push(
        yn(e, y, h)
      ))), e = e.return;
    }
    c.length !== 0 && l.push({ event: t, listeners: c });
  }
  var B0 = /\r\n?/g, R0 = /\u0000|\uFFFD/g;
  function Qs(l) {
    return (typeof l == "string" ? l : "" + l).replace(B0, `
`).replace(R0, "");
  }
  function js(l, t) {
    return t = Qs(t), Qs(l) === t;
  }
  function sl(l, t, e, a, n, u) {
    switch (e) {
      case "children":
        typeof a == "string" ? t === "body" || t === "textarea" && a === "" || $e(l, a) : (typeof a == "number" || typeof a == "bigint") && t !== "body" && $e(l, "" + a);
        break;
      case "className":
        Hn(l, "class", a);
        break;
      case "tabIndex":
        Hn(l, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Hn(l, e, a);
        break;
      case "style":
        jf(l, a, u);
        break;
      case "data":
        if (t !== "object") {
          Hn(l, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (t !== "a" || e !== "href")) {
          l.removeAttribute(e);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          l.removeAttribute(e);
          break;
        }
        a = Bn("" + a), l.setAttribute(e, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          l.setAttribute(
            e,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof u == "function" && (e === "formAction" ? (t !== "input" && sl(l, t, "name", n.name, n, null), sl(
            l,
            t,
            "formEncType",
            n.formEncType,
            n,
            null
          ), sl(
            l,
            t,
            "formMethod",
            n.formMethod,
            n,
            null
          ), sl(
            l,
            t,
            "formTarget",
            n.formTarget,
            n,
            null
          )) : (sl(l, t, "encType", n.encType, n, null), sl(l, t, "method", n.method, n, null), sl(l, t, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          l.removeAttribute(e);
          break;
        }
        a = Bn("" + a), l.setAttribute(e, a);
        break;
      case "onClick":
        a != null && (l.onclick = Gt);
        break;
      case "onScroll":
        a != null && W("scroll", l);
        break;
      case "onScrollEnd":
        a != null && W("scrollend", l);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(o(61));
          if (e = a.__html, e != null) {
            if (n.children != null) throw Error(o(60));
            l.innerHTML = e;
          }
        }
        break;
      case "multiple":
        l.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        l.muted = a && typeof a != "function" && typeof a != "symbol";
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
          l.removeAttribute("xlink:href");
          break;
        }
        e = Bn("" + a), l.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          e
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
        a != null && typeof a != "function" && typeof a != "symbol" ? l.setAttribute(e, "" + a) : l.removeAttribute(e);
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
        a && typeof a != "function" && typeof a != "symbol" ? l.setAttribute(e, "") : l.removeAttribute(e);
        break;
      case "capture":
      case "download":
        a === !0 ? l.setAttribute(e, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? l.setAttribute(e, a) : l.removeAttribute(e);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? l.setAttribute(e, a) : l.removeAttribute(e);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? l.removeAttribute(e) : l.setAttribute(e, a);
        break;
      case "popover":
        W("beforetoggle", l), W("toggle", l), Cn(l, "popover", a);
        break;
      case "xlinkActuate":
        Yt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        Yt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        Yt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        Yt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        Yt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        Yt(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        Yt(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        Yt(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        Yt(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        Cn(l, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < e.length) || e[0] !== "o" && e[0] !== "O" || e[1] !== "n" && e[1] !== "N") && (e = fo.get(e) || e, Cn(l, e, a));
    }
  }
  function Ki(l, t, e, a, n, u) {
    switch (e) {
      case "style":
        jf(l, a, u);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(o(61));
          if (e = a.__html, e != null) {
            if (n.children != null) throw Error(o(60));
            l.innerHTML = e;
          }
        }
        break;
      case "children":
        typeof a == "string" ? $e(l, a) : (typeof a == "number" || typeof a == "bigint") && $e(l, "" + a);
        break;
      case "onScroll":
        a != null && W("scroll", l);
        break;
      case "onScrollEnd":
        a != null && W("scrollend", l);
        break;
      case "onClick":
        a != null && (l.onclick = Gt);
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
        if (!qf.hasOwnProperty(e))
          l: {
            if (e[0] === "o" && e[1] === "n" && (n = e.endsWith("Capture"), t = e.slice(2, n ? e.length - 7 : void 0), u = l[Pl] || null, u = u != null ? u[e] : null, typeof u == "function" && l.removeEventListener(t, u, n), typeof a == "function")) {
              typeof u != "function" && u !== null && (e in l ? l[e] = null : l.hasAttribute(e) && l.removeAttribute(e)), l.addEventListener(t, a, n);
              break l;
            }
            e in l ? l[e] = a : a === !0 ? l.setAttribute(e, "") : Cn(l, e, a);
          }
    }
  }
  function Vl(l, t, e) {
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
        W("error", l), W("load", l);
        var a = !1, n = !1, u;
        for (u in e)
          if (e.hasOwnProperty(u)) {
            var c = e[u];
            if (c != null)
              switch (u) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  n = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(o(137, t));
                default:
                  sl(l, t, u, c, e, null);
              }
          }
        n && sl(l, t, "srcSet", e.srcSet, e, null), a && sl(l, t, "src", e.src, e, null);
        return;
      case "input":
        W("invalid", l);
        var f = u = c = n = null, h = null, y = null;
        for (a in e)
          if (e.hasOwnProperty(a)) {
            var b = e[a];
            if (b != null)
              switch (a) {
                case "name":
                  n = b;
                  break;
                case "type":
                  c = b;
                  break;
                case "checked":
                  h = b;
                  break;
                case "defaultChecked":
                  y = b;
                  break;
                case "value":
                  u = b;
                  break;
                case "defaultValue":
                  f = b;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (b != null)
                    throw Error(o(137, t));
                  break;
                default:
                  sl(l, t, a, b, e, null);
              }
          }
        xf(
          l,
          u,
          f,
          h,
          y,
          c,
          n,
          !1
        );
        return;
      case "select":
        W("invalid", l), a = c = u = null;
        for (n in e)
          if (e.hasOwnProperty(n) && (f = e[n], f != null))
            switch (n) {
              case "value":
                u = f;
                break;
              case "defaultValue":
                c = f;
                break;
              case "multiple":
                a = f;
              default:
                sl(l, t, n, f, e, null);
            }
        t = u, e = c, l.multiple = !!a, t != null ? We(l, !!a, t, !1) : e != null && We(l, !!a, e, !0);
        return;
      case "textarea":
        W("invalid", l), u = n = a = null;
        for (c in e)
          if (e.hasOwnProperty(c) && (f = e[c], f != null))
            switch (c) {
              case "value":
                a = f;
                break;
              case "defaultValue":
                n = f;
                break;
              case "children":
                u = f;
                break;
              case "dangerouslySetInnerHTML":
                if (f != null) throw Error(o(91));
                break;
              default:
                sl(l, t, c, f, e, null);
            }
        Xf(l, a, n, u);
        return;
      case "option":
        for (h in e)
          if (e.hasOwnProperty(h) && (a = e[h], a != null))
            switch (h) {
              case "selected":
                l.selected = a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                sl(l, t, h, a, e, null);
            }
        return;
      case "dialog":
        W("beforetoggle", l), W("toggle", l), W("cancel", l), W("close", l);
        break;
      case "iframe":
      case "object":
        W("load", l);
        break;
      case "video":
      case "audio":
        for (a = 0; a < vn.length; a++)
          W(vn[a], l);
        break;
      case "image":
        W("error", l), W("load", l);
        break;
      case "details":
        W("toggle", l);
        break;
      case "embed":
      case "source":
      case "link":
        W("error", l), W("load", l);
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
        for (y in e)
          if (e.hasOwnProperty(y) && (a = e[y], a != null))
            switch (y) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, t));
              default:
                sl(l, t, y, a, e, null);
            }
        return;
      default:
        if (uc(t)) {
          for (b in e)
            e.hasOwnProperty(b) && (a = e[b], a !== void 0 && Ki(
              l,
              t,
              b,
              a,
              e,
              void 0
            ));
          return;
        }
    }
    for (f in e)
      e.hasOwnProperty(f) && (a = e[f], a != null && sl(l, t, f, a, e, null));
  }
  function Y0(l, t, e, a) {
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
        var n = null, u = null, c = null, f = null, h = null, y = null, b = null;
        for (E in e) {
          var T = e[E];
          if (e.hasOwnProperty(E) && T != null)
            switch (E) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                h = T;
              default:
                a.hasOwnProperty(E) || sl(l, t, E, null, a, T);
            }
        }
        for (var g in a) {
          var E = a[g];
          if (T = e[g], a.hasOwnProperty(g) && (E != null || T != null))
            switch (g) {
              case "type":
                u = E;
                break;
              case "name":
                n = E;
                break;
              case "checked":
                y = E;
                break;
              case "defaultChecked":
                b = E;
                break;
              case "value":
                c = E;
                break;
              case "defaultValue":
                f = E;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (E != null)
                  throw Error(o(137, t));
                break;
              default:
                E !== T && sl(
                  l,
                  t,
                  g,
                  E,
                  a,
                  T
                );
            }
        }
        ac(
          l,
          c,
          f,
          h,
          y,
          b,
          u,
          n
        );
        return;
      case "select":
        E = c = f = g = null;
        for (u in e)
          if (h = e[u], e.hasOwnProperty(u) && h != null)
            switch (u) {
              case "value":
                break;
              case "multiple":
                E = h;
              default:
                a.hasOwnProperty(u) || sl(
                  l,
                  t,
                  u,
                  null,
                  a,
                  h
                );
            }
        for (n in a)
          if (u = a[n], h = e[n], a.hasOwnProperty(n) && (u != null || h != null))
            switch (n) {
              case "value":
                g = u;
                break;
              case "defaultValue":
                f = u;
                break;
              case "multiple":
                c = u;
              default:
                u !== h && sl(
                  l,
                  t,
                  n,
                  u,
                  a,
                  h
                );
            }
        t = f, e = c, a = E, g != null ? We(l, !!e, g, !1) : !!a != !!e && (t != null ? We(l, !!e, t, !0) : We(l, !!e, e ? [] : "", !1));
        return;
      case "textarea":
        E = g = null;
        for (f in e)
          if (n = e[f], e.hasOwnProperty(f) && n != null && !a.hasOwnProperty(f))
            switch (f) {
              case "value":
                break;
              case "children":
                break;
              default:
                sl(l, t, f, null, a, n);
            }
        for (c in a)
          if (n = a[c], u = e[c], a.hasOwnProperty(c) && (n != null || u != null))
            switch (c) {
              case "value":
                g = n;
                break;
              case "defaultValue":
                E = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(o(91));
                break;
              default:
                n !== u && sl(l, t, c, n, a, u);
            }
        Lf(l, g, E);
        return;
      case "option":
        for (var D in e)
          if (g = e[D], e.hasOwnProperty(D) && g != null && !a.hasOwnProperty(D))
            switch (D) {
              case "selected":
                l.selected = !1;
                break;
              default:
                sl(
                  l,
                  t,
                  D,
                  null,
                  a,
                  g
                );
            }
        for (h in a)
          if (g = a[h], E = e[h], a.hasOwnProperty(h) && g !== E && (g != null || E != null))
            switch (h) {
              case "selected":
                l.selected = g && typeof g != "function" && typeof g != "symbol";
                break;
              default:
                sl(
                  l,
                  t,
                  h,
                  g,
                  a,
                  E
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
        for (var G in e)
          g = e[G], e.hasOwnProperty(G) && g != null && !a.hasOwnProperty(G) && sl(l, t, G, null, a, g);
        for (y in a)
          if (g = a[y], E = e[y], a.hasOwnProperty(y) && g !== E && (g != null || E != null))
            switch (y) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (g != null)
                  throw Error(o(137, t));
                break;
              default:
                sl(
                  l,
                  t,
                  y,
                  g,
                  a,
                  E
                );
            }
        return;
      default:
        if (uc(t)) {
          for (var rl in e)
            g = e[rl], e.hasOwnProperty(rl) && g !== void 0 && !a.hasOwnProperty(rl) && Ki(
              l,
              t,
              rl,
              void 0,
              a,
              g
            );
          for (b in a)
            g = a[b], E = e[b], !a.hasOwnProperty(b) || g === E || g === void 0 && E === void 0 || Ki(
              l,
              t,
              b,
              g,
              a,
              E
            );
          return;
        }
    }
    for (var d in e)
      g = e[d], e.hasOwnProperty(d) && g != null && !a.hasOwnProperty(d) && sl(l, t, d, null, a, g);
    for (T in a)
      g = a[T], E = e[T], !a.hasOwnProperty(T) || g === E || g == null && E == null || sl(l, t, T, g, a, E);
  }
  function Zs(l) {
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
  function G0() {
    if (typeof performance.getEntriesByType == "function") {
      for (var l = 0, t = 0, e = performance.getEntriesByType("resource"), a = 0; a < e.length; a++) {
        var n = e[a], u = n.transferSize, c = n.initiatorType, f = n.duration;
        if (u && f && Zs(c)) {
          for (c = 0, f = n.responseEnd, a += 1; a < e.length; a++) {
            var h = e[a], y = h.startTime;
            if (y > f) break;
            var b = h.transferSize, T = h.initiatorType;
            b && Zs(T) && (h = h.responseEnd, c += b * (h < f ? 1 : (f - y) / (h - y)));
          }
          if (--a, t += 8 * (u + c) / (n.duration / 1e3), l++, 10 < l) break;
        }
      }
      if (0 < l) return t / l / 1e6;
    }
    return navigator.connection && (l = navigator.connection.downlink, typeof l == "number") ? l : 5;
  }
  var Ji = null, ki = null;
  function Du(l) {
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  function Vs(l) {
    switch (l) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Ks(l, t) {
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
  function wi(l, t) {
    return l === "textarea" || l === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Fi = null;
  function x0() {
    var l = window.event;
    return l && l.type === "popstate" ? l === Fi ? !1 : (Fi = l, !0) : (Fi = null, !1);
  }
  var Js = typeof setTimeout == "function" ? setTimeout : void 0, L0 = typeof clearTimeout == "function" ? clearTimeout : void 0, ks = typeof Promise == "function" ? Promise : void 0, X0 = typeof queueMicrotask == "function" ? queueMicrotask : typeof ks < "u" ? function(l) {
    return ks.resolve(null).then(l).catch(Q0);
  } : Js;
  function Q0(l) {
    setTimeout(function() {
      throw l;
    });
  }
  function Se(l) {
    return l === "head";
  }
  function ws(l, t) {
    var e = t, a = 0;
    do {
      var n = e.nextSibling;
      if (l.removeChild(e), n && n.nodeType === 8)
        if (e = n.data, e === "/$" || e === "/&") {
          if (a === 0) {
            l.removeChild(n), Oa(t);
            return;
          }
          a--;
        } else if (e === "$" || e === "$?" || e === "$~" || e === "$!" || e === "&")
          a++;
        else if (e === "html")
          gn(l.ownerDocument.documentElement);
        else if (e === "head") {
          e = l.ownerDocument.head, gn(e);
          for (var u = e.firstChild; u; ) {
            var c = u.nextSibling, f = u.nodeName;
            u[Ba] || f === "SCRIPT" || f === "STYLE" || f === "LINK" && u.rel.toLowerCase() === "stylesheet" || e.removeChild(u), u = c;
          }
        } else
          e === "body" && gn(l.ownerDocument.body);
      e = n;
    } while (e);
    Oa(t);
  }
  function Fs(l, t) {
    var e = l;
    l = 0;
    do {
      var a = e.nextSibling;
      if (e.nodeType === 1 ? t ? (e._stashedDisplay = e.style.display, e.style.display = "none") : (e.style.display = e._stashedDisplay || "", e.getAttribute("style") === "" && e.removeAttribute("style")) : e.nodeType === 3 && (t ? (e._stashedText = e.nodeValue, e.nodeValue = "") : e.nodeValue = e._stashedText || ""), a && a.nodeType === 8)
        if (e = a.data, e === "/$") {
          if (l === 0) break;
          l--;
        } else
          e !== "$" && e !== "$?" && e !== "$~" && e !== "$!" || l++;
      e = a;
    } while (e);
  }
  function Wi(l) {
    var t = l.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var e = t;
      switch (t = t.nextSibling, e.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Wi(e), tc(e);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (e.rel.toLowerCase() === "stylesheet") continue;
      }
      l.removeChild(e);
    }
  }
  function j0(l, t, e, a) {
    for (; l.nodeType === 1; ) {
      var n = e;
      if (l.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (l.nodeName !== "INPUT" || l.type !== "hidden"))
          break;
      } else if (a) {
        if (!l[Ba])
          switch (t) {
            case "meta":
              if (!l.hasAttribute("itemprop")) break;
              return l;
            case "link":
              if (u = l.getAttribute("rel"), u === "stylesheet" && l.hasAttribute("data-precedence"))
                break;
              if (u !== n.rel || l.getAttribute("href") !== (n.href == null || n.href === "" ? null : n.href) || l.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin) || l.getAttribute("title") !== (n.title == null ? null : n.title))
                break;
              return l;
            case "style":
              if (l.hasAttribute("data-precedence")) break;
              return l;
            case "script":
              if (u = l.getAttribute("src"), (u !== (n.src == null ? null : n.src) || l.getAttribute("type") !== (n.type == null ? null : n.type) || l.getAttribute("crossorigin") !== (n.crossOrigin == null ? null : n.crossOrigin)) && u && l.hasAttribute("async") && !l.hasAttribute("itemprop"))
                break;
              return l;
            default:
              return l;
          }
      } else if (t === "input" && l.type === "hidden") {
        var u = n.name == null ? null : "" + n.name;
        if (n.type === "hidden" && l.getAttribute("name") === u)
          return l;
      } else return l;
      if (l = At(l.nextSibling), l === null) break;
    }
    return null;
  }
  function Z0(l, t, e) {
    if (t === "") return null;
    for (; l.nodeType !== 3; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !e || (l = At(l.nextSibling), l === null)) return null;
    return l;
  }
  function Ws(l, t) {
    for (; l.nodeType !== 8; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !t || (l = At(l.nextSibling), l === null)) return null;
    return l;
  }
  function $i(l) {
    return l.data === "$?" || l.data === "$~";
  }
  function Ii(l) {
    return l.data === "$!" || l.data === "$?" && l.ownerDocument.readyState !== "loading";
  }
  function V0(l, t) {
    var e = l.ownerDocument;
    if (l.data === "$~") l._reactRetry = t;
    else if (l.data !== "$?" || e.readyState !== "loading")
      t();
    else {
      var a = function() {
        t(), e.removeEventListener("DOMContentLoaded", a);
      };
      e.addEventListener("DOMContentLoaded", a), l._reactRetry = a;
    }
  }
  function At(l) {
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
  var Pi = null;
  function $s(l) {
    l = l.nextSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var e = l.data;
        if (e === "/$" || e === "/&") {
          if (t === 0)
            return At(l.nextSibling);
          t--;
        } else
          e !== "$" && e !== "$!" && e !== "$?" && e !== "$~" && e !== "&" || t++;
      }
      l = l.nextSibling;
    }
    return null;
  }
  function Is(l) {
    l = l.previousSibling;
    for (var t = 0; l; ) {
      if (l.nodeType === 8) {
        var e = l.data;
        if (e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&") {
          if (t === 0) return l;
          t--;
        } else e !== "/$" && e !== "/&" || t++;
      }
      l = l.previousSibling;
    }
    return null;
  }
  function Ps(l, t, e) {
    switch (t = Du(e), l) {
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
  function gn(l) {
    for (var t = l.attributes; t.length; )
      l.removeAttributeNode(t[0]);
    tc(l);
  }
  var Mt = /* @__PURE__ */ new Map(), lr = /* @__PURE__ */ new Set();
  function Uu(l) {
    return typeof l.getRootNode == "function" ? l.getRootNode() : l.nodeType === 9 ? l : l.ownerDocument;
  }
  var Pt = _.d;
  _.d = {
    f: K0,
    r: J0,
    D: k0,
    C: w0,
    L: F0,
    m: W0,
    X: I0,
    S: $0,
    M: P0
  };
  function K0() {
    var l = Pt.f(), t = pu();
    return l || t;
  }
  function J0(l) {
    var t = ke(l);
    t !== null && t.tag === 5 && t.type === "form" ? gm(t) : Pt.r(l);
  }
  var Ma = typeof document > "u" ? null : document;
  function tr(l, t, e) {
    var a = Ma;
    if (a && typeof t == "string" && t) {
      var n = gt(t);
      n = 'link[rel="' + l + '"][href="' + n + '"]', typeof e == "string" && (n += '[crossorigin="' + e + '"]'), lr.has(n) || (lr.add(n), l = { rel: l, crossOrigin: e, href: t }, a.querySelector(n) === null && (t = a.createElement("link"), Vl(t, "link", l), xl(t), a.head.appendChild(t)));
    }
  }
  function k0(l) {
    Pt.D(l), tr("dns-prefetch", l, null);
  }
  function w0(l, t) {
    Pt.C(l, t), tr("preconnect", l, t);
  }
  function F0(l, t, e) {
    Pt.L(l, t, e);
    var a = Ma;
    if (a && l && t) {
      var n = 'link[rel="preload"][as="' + gt(t) + '"]';
      t === "image" && e && e.imageSrcSet ? (n += '[imagesrcset="' + gt(
        e.imageSrcSet
      ) + '"]', typeof e.imageSizes == "string" && (n += '[imagesizes="' + gt(
        e.imageSizes
      ) + '"]')) : n += '[href="' + gt(l) + '"]';
      var u = n;
      switch (t) {
        case "style":
          u = Na(l);
          break;
        case "script":
          u = _a(l);
      }
      Mt.has(u) || (l = q(
        {
          rel: "preload",
          href: t === "image" && e && e.imageSrcSet ? void 0 : l,
          as: t
        },
        e
      ), Mt.set(u, l), a.querySelector(n) !== null || t === "style" && a.querySelector(En(u)) || t === "script" && a.querySelector(bn(u)) || (t = a.createElement("link"), Vl(t, "link", l), xl(t), a.head.appendChild(t)));
    }
  }
  function W0(l, t) {
    Pt.m(l, t);
    var e = Ma;
    if (e && l) {
      var a = t && typeof t.as == "string" ? t.as : "script", n = 'link[rel="modulepreload"][as="' + gt(a) + '"][href="' + gt(l) + '"]', u = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = _a(l);
      }
      if (!Mt.has(u) && (l = q({ rel: "modulepreload", href: l }, t), Mt.set(u, l), e.querySelector(n) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (e.querySelector(bn(u)))
              return;
        }
        a = e.createElement("link"), Vl(a, "link", l), xl(a), e.head.appendChild(a);
      }
    }
  }
  function $0(l, t, e) {
    Pt.S(l, t, e);
    var a = Ma;
    if (a && l) {
      var n = we(a).hoistableStyles, u = Na(l);
      t = t || "default";
      var c = n.get(u);
      if (!c) {
        var f = { loading: 0, preload: null };
        if (c = a.querySelector(
          En(u)
        ))
          f.loading = 5;
        else {
          l = q(
            { rel: "stylesheet", href: l, "data-precedence": t },
            e
          ), (e = Mt.get(u)) && lf(l, e);
          var h = c = a.createElement("link");
          xl(h), Vl(h, "link", l), h._p = new Promise(function(y, b) {
            h.onload = y, h.onerror = b;
          }), h.addEventListener("load", function() {
            f.loading |= 1;
          }), h.addEventListener("error", function() {
            f.loading |= 2;
          }), f.loading |= 4, Cu(c, t, a);
        }
        c = {
          type: "stylesheet",
          instance: c,
          count: 1,
          state: f
        }, n.set(u, c);
      }
    }
  }
  function I0(l, t) {
    Pt.X(l, t);
    var e = Ma;
    if (e && l) {
      var a = we(e).hoistableScripts, n = _a(l), u = a.get(n);
      u || (u = e.querySelector(bn(n)), u || (l = q({ src: l, async: !0 }, t), (t = Mt.get(n)) && tf(l, t), u = e.createElement("script"), xl(u), Vl(u, "link", l), e.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, a.set(n, u));
    }
  }
  function P0(l, t) {
    Pt.M(l, t);
    var e = Ma;
    if (e && l) {
      var a = we(e).hoistableScripts, n = _a(l), u = a.get(n);
      u || (u = e.querySelector(bn(n)), u || (l = q({ src: l, async: !0, type: "module" }, t), (t = Mt.get(n)) && tf(l, t), u = e.createElement("script"), xl(u), Vl(u, "link", l), e.head.appendChild(u)), u = {
        type: "script",
        instance: u,
        count: 1,
        state: null
      }, a.set(n, u));
    }
  }
  function er(l, t, e, a) {
    var n = (n = w.current) ? Uu(n) : null;
    if (!n) throw Error(o(446));
    switch (l) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof e.precedence == "string" && typeof e.href == "string" ? (t = Na(e.href), e = we(
          n
        ).hoistableStyles, a = e.get(t), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, e.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (e.rel === "stylesheet" && typeof e.href == "string" && typeof e.precedence == "string") {
          l = Na(e.href);
          var u = we(
            n
          ).hoistableStyles, c = u.get(l);
          if (c || (n = n.ownerDocument || n, c = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, u.set(l, c), (u = n.querySelector(
            En(l)
          )) && !u._p && (c.instance = u, c.state.loading = 5), Mt.has(l) || (e = {
            rel: "preload",
            as: "style",
            href: e.href,
            crossOrigin: e.crossOrigin,
            integrity: e.integrity,
            media: e.media,
            hrefLang: e.hrefLang,
            referrerPolicy: e.referrerPolicy
          }, Mt.set(l, e), u || ld(
            n,
            l,
            e,
            c.state
          ))), t && a === null)
            throw Error(o(528, ""));
          return c;
        }
        if (t && a !== null)
          throw Error(o(529, ""));
        return null;
      case "script":
        return t = e.async, e = e.src, typeof e == "string" && t && typeof t != "function" && typeof t != "symbol" ? (t = _a(e), e = we(
          n
        ).hoistableScripts, a = e.get(t), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, e.set(t, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(o(444, l));
    }
  }
  function Na(l) {
    return 'href="' + gt(l) + '"';
  }
  function En(l) {
    return 'link[rel="stylesheet"][' + l + "]";
  }
  function ar(l) {
    return q({}, l, {
      "data-precedence": l.precedence,
      precedence: null
    });
  }
  function ld(l, t, e, a) {
    l.querySelector('link[rel="preload"][as="style"][' + t + "]") ? a.loading = 1 : (t = l.createElement("link"), a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    }), Vl(t, "link", e), xl(t), l.head.appendChild(t));
  }
  function _a(l) {
    return '[src="' + gt(l) + '"]';
  }
  function bn(l) {
    return "script[async]" + l;
  }
  function nr(l, t, e) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = l.querySelector(
            'style[data-href~="' + gt(e.href) + '"]'
          );
          if (a)
            return t.instance = a, xl(a), a;
          var n = q({}, e, {
            "data-href": e.href,
            "data-precedence": e.precedence,
            href: null,
            precedence: null
          });
          return a = (l.ownerDocument || l).createElement(
            "style"
          ), xl(a), Vl(a, "style", n), Cu(a, e.precedence, l), t.instance = a;
        case "stylesheet":
          n = Na(e.href);
          var u = l.querySelector(
            En(n)
          );
          if (u)
            return t.state.loading |= 4, t.instance = u, xl(u), u;
          a = ar(e), (n = Mt.get(n)) && lf(a, n), u = (l.ownerDocument || l).createElement("link"), xl(u);
          var c = u;
          return c._p = new Promise(function(f, h) {
            c.onload = f, c.onerror = h;
          }), Vl(u, "link", a), t.state.loading |= 4, Cu(u, e.precedence, l), t.instance = u;
        case "script":
          return u = _a(e.src), (n = l.querySelector(
            bn(u)
          )) ? (t.instance = n, xl(n), n) : (a = e, (n = Mt.get(u)) && (a = q({}, e), tf(a, n)), l = l.ownerDocument || l, n = l.createElement("script"), xl(n), Vl(n, "link", a), l.head.appendChild(n), t.instance = n);
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, Cu(a, e.precedence, l));
    return t.instance;
  }
  function Cu(l, t, e) {
    for (var a = e.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), n = a.length ? a[a.length - 1] : null, u = n, c = 0; c < a.length; c++) {
      var f = a[c];
      if (f.dataset.precedence === t) u = f;
      else if (u !== n) break;
    }
    u ? u.parentNode.insertBefore(l, u.nextSibling) : (t = e.nodeType === 9 ? e.head : e, t.insertBefore(l, t.firstChild));
  }
  function lf(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.title == null && (l.title = t.title);
  }
  function tf(l, t) {
    l.crossOrigin == null && (l.crossOrigin = t.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = t.referrerPolicy), l.integrity == null && (l.integrity = t.integrity);
  }
  var Hu = null;
  function ur(l, t, e) {
    if (Hu === null) {
      var a = /* @__PURE__ */ new Map(), n = Hu = /* @__PURE__ */ new Map();
      n.set(e, a);
    } else
      n = Hu, a = n.get(e), a || (a = /* @__PURE__ */ new Map(), n.set(e, a));
    if (a.has(l)) return a;
    for (a.set(l, null), e = e.getElementsByTagName(l), n = 0; n < e.length; n++) {
      var u = e[n];
      if (!(u[Ba] || u[Xl] || l === "link" && u.getAttribute("rel") === "stylesheet") && u.namespaceURI !== "http://www.w3.org/2000/svg") {
        var c = u.getAttribute(t) || "";
        c = l + c;
        var f = a.get(c);
        f ? f.push(u) : a.set(c, [u]);
      }
    }
    return a;
  }
  function cr(l, t, e) {
    l = l.ownerDocument || l, l.head.insertBefore(
      e,
      t === "title" ? l.querySelector("head > title") : null
    );
  }
  function td(l, t, e) {
    if (e === 1 || t.itemProp != null) return !1;
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
  function ir(l) {
    return !(l.type === "stylesheet" && (l.state.loading & 3) === 0);
  }
  function ed(l, t, e, a) {
    if (e.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (e.state.loading & 4) === 0) {
      if (e.instance === null) {
        var n = Na(a.href), u = t.querySelector(
          En(n)
        );
        if (u) {
          t = u._p, t !== null && typeof t == "object" && typeof t.then == "function" && (l.count++, l = qu.bind(l), t.then(l, l)), e.state.loading |= 4, e.instance = u, xl(u);
          return;
        }
        u = t.ownerDocument || t, a = ar(a), (n = Mt.get(n)) && lf(a, n), u = u.createElement("link"), xl(u);
        var c = u;
        c._p = new Promise(function(f, h) {
          c.onload = f, c.onerror = h;
        }), Vl(u, "link", a), e.instance = u;
      }
      l.stylesheets === null && (l.stylesheets = /* @__PURE__ */ new Map()), l.stylesheets.set(e, t), (t = e.state.preload) && (e.state.loading & 3) === 0 && (l.count++, e = qu.bind(l), t.addEventListener("load", e), t.addEventListener("error", e));
    }
  }
  var ef = 0;
  function ad(l, t) {
    return l.stylesheets && l.count === 0 && Ru(l, l.stylesheets), 0 < l.count || 0 < l.imgCount ? function(e) {
      var a = setTimeout(function() {
        if (l.stylesheets && Ru(l, l.stylesheets), l.unsuspend) {
          var u = l.unsuspend;
          l.unsuspend = null, u();
        }
      }, 6e4 + t);
      0 < l.imgBytes && ef === 0 && (ef = 62500 * G0());
      var n = setTimeout(
        function() {
          if (l.waitingForImages = !1, l.count === 0 && (l.stylesheets && Ru(l, l.stylesheets), l.unsuspend)) {
            var u = l.unsuspend;
            l.unsuspend = null, u();
          }
        },
        (l.imgBytes > ef ? 50 : 800) + t
      );
      return l.unsuspend = e, function() {
        l.unsuspend = null, clearTimeout(a), clearTimeout(n);
      };
    } : null;
  }
  function qu() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) Ru(this, this.stylesheets);
      else if (this.unsuspend) {
        var l = this.unsuspend;
        this.unsuspend = null, l();
      }
    }
  }
  var Bu = null;
  function Ru(l, t) {
    l.stylesheets = null, l.unsuspend !== null && (l.count++, Bu = /* @__PURE__ */ new Map(), t.forEach(nd, l), Bu = null, qu.call(l));
  }
  function nd(l, t) {
    if (!(t.state.loading & 4)) {
      var e = Bu.get(l);
      if (e) var a = e.get(null);
      else {
        e = /* @__PURE__ */ new Map(), Bu.set(l, e);
        for (var n = l.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), u = 0; u < n.length; u++) {
          var c = n[u];
          (c.nodeName === "LINK" || c.getAttribute("media") !== "not all") && (e.set(c.dataset.precedence, c), a = c);
        }
        a && e.set(null, a);
      }
      n = t.instance, c = n.getAttribute("data-precedence"), u = e.get(c) || a, u === a && e.set(null, n), e.set(c, n), this.count++, a = qu.bind(this), n.addEventListener("load", a), n.addEventListener("error", a), u ? u.parentNode.insertBefore(n, u.nextSibling) : (l = l.nodeType === 9 ? l.head : l, l.insertBefore(n, l.firstChild)), t.state.loading |= 4;
    }
  }
  var Sn = {
    $$typeof: pl,
    Provider: null,
    Consumer: null,
    _currentValue: L,
    _currentValue2: L,
    _threadCount: 0
  };
  function ud(l, t, e, a, n, u, c, f, h) {
    this.tag = 1, this.containerInfo = l, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = $u(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = $u(0), this.hiddenUpdates = $u(null), this.identifierPrefix = a, this.onUncaughtError = n, this.onCaughtError = u, this.onRecoverableError = c, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = h, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function fr(l, t, e, a, n, u, c, f, h, y, b, T) {
    return l = new ud(
      l,
      t,
      e,
      c,
      h,
      y,
      b,
      T,
      f
    ), t = 1, u === !0 && (t |= 24), u = mt(3, null, null, t), l.current = u, u.stateNode = l, t = Rc(), t.refCount++, l.pooledCache = t, t.refCount++, u.memoizedState = {
      element: a,
      isDehydrated: e,
      cache: t
    }, Lc(u), l;
  }
  function hr(l) {
    return l ? (l = na, l) : na;
  }
  function mr(l, t, e, a, n, u) {
    n = hr(n), a.context === null ? a.context = n : a.pendingContext = n, a = he(t), a.payload = { element: e }, u = u === void 0 ? null : u, u !== null && (a.callback = u), e = me(l, a, t), e !== null && (ut(e, l, t), $a(e, l, t));
  }
  function sr(l, t) {
    if (l = l.memoizedState, l !== null && l.dehydrated !== null) {
      var e = l.retryLane;
      l.retryLane = e !== 0 && e < t ? e : t;
    }
  }
  function af(l, t) {
    sr(l, t), (l = l.alternate) && sr(l, t);
  }
  function rr(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = He(l, 67108864);
      t !== null && ut(t, l, 67108864), af(l, 67108864);
    }
  }
  function or(l) {
    if (l.tag === 13 || l.tag === 31) {
      var t = vt();
      t = Iu(t);
      var e = He(l, t);
      e !== null && ut(e, l, t), af(l, t);
    }
  }
  var Yu = !0;
  function cd(l, t, e, a) {
    var n = S.T;
    S.T = null;
    var u = _.p;
    try {
      _.p = 2, nf(l, t, e, a);
    } finally {
      _.p = u, S.T = n;
    }
  }
  function id(l, t, e, a) {
    var n = S.T;
    S.T = null;
    var u = _.p;
    try {
      _.p = 8, nf(l, t, e, a);
    } finally {
      _.p = u, S.T = n;
    }
  }
  function nf(l, t, e, a) {
    if (Yu) {
      var n = uf(a);
      if (n === null)
        Vi(
          l,
          t,
          a,
          Gu,
          e
        ), vr(l, a);
      else if (hd(
        n,
        l,
        t,
        e,
        a
      ))
        a.stopPropagation();
      else if (vr(l, a), t & 4 && -1 < fd.indexOf(l)) {
        for (; n !== null; ) {
          var u = ke(n);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (u = u.stateNode, u.current.memoizedState.isDehydrated) {
                  var c = _e(u.pendingLanes);
                  if (c !== 0) {
                    var f = u;
                    for (f.pendingLanes |= 2, f.entangledLanes |= 2; c; ) {
                      var h = 1 << 31 - ft(c);
                      f.entanglements[1] |= h, c &= ~h;
                    }
                    Bt(u), (nl & 6) === 0 && (bu = ct() + 500, dn(0));
                  }
                }
                break;
              case 31:
              case 13:
                f = He(u, 2), f !== null && ut(f, u, 2), pu(), af(u, 2);
            }
          if (u = uf(a), u === null && Vi(
            l,
            t,
            a,
            Gu,
            e
          ), u === n) break;
          n = u;
        }
        n !== null && a.stopPropagation();
      } else
        Vi(
          l,
          t,
          a,
          null,
          e
        );
    }
  }
  function uf(l) {
    return l = ic(l), cf(l);
  }
  var Gu = null;
  function cf(l) {
    if (Gu = null, l = Je(l), l !== null) {
      var t = R(l);
      if (t === null) l = null;
      else {
        var e = t.tag;
        if (e === 13) {
          if (l = k(t), l !== null) return l;
          l = null;
        } else if (e === 31) {
          if (l = yl(t), l !== null) return l;
          l = null;
        } else if (e === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          l = null;
        } else t !== l && (l = null);
      }
    }
    return Gu = l, null;
  }
  function dr(l) {
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
        switch (Jr()) {
          case zf:
            return 2;
          case Tf:
            return 8;
          case Nn:
          case kr:
            return 32;
          case Af:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var ff = !1, pe = null, ze = null, Te = null, pn = /* @__PURE__ */ new Map(), zn = /* @__PURE__ */ new Map(), Ae = [], fd = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function vr(l, t) {
    switch (l) {
      case "focusin":
      case "focusout":
        pe = null;
        break;
      case "dragenter":
      case "dragleave":
        ze = null;
        break;
      case "mouseover":
      case "mouseout":
        Te = null;
        break;
      case "pointerover":
      case "pointerout":
        pn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        zn.delete(t.pointerId);
    }
  }
  function Tn(l, t, e, a, n, u) {
    return l === null || l.nativeEvent !== u ? (l = {
      blockedOn: t,
      domEventName: e,
      eventSystemFlags: a,
      nativeEvent: u,
      targetContainers: [n]
    }, t !== null && (t = ke(t), t !== null && rr(t)), l) : (l.eventSystemFlags |= a, t = l.targetContainers, n !== null && t.indexOf(n) === -1 && t.push(n), l);
  }
  function hd(l, t, e, a, n) {
    switch (t) {
      case "focusin":
        return pe = Tn(
          pe,
          l,
          t,
          e,
          a,
          n
        ), !0;
      case "dragenter":
        return ze = Tn(
          ze,
          l,
          t,
          e,
          a,
          n
        ), !0;
      case "mouseover":
        return Te = Tn(
          Te,
          l,
          t,
          e,
          a,
          n
        ), !0;
      case "pointerover":
        var u = n.pointerId;
        return pn.set(
          u,
          Tn(
            pn.get(u) || null,
            l,
            t,
            e,
            a,
            n
          )
        ), !0;
      case "gotpointercapture":
        return u = n.pointerId, zn.set(
          u,
          Tn(
            zn.get(u) || null,
            l,
            t,
            e,
            a,
            n
          )
        ), !0;
    }
    return !1;
  }
  function yr(l) {
    var t = Je(l.target);
    if (t !== null) {
      var e = R(t);
      if (e !== null) {
        if (t = e.tag, t === 13) {
          if (t = k(e), t !== null) {
            l.blockedOn = t, Uf(l.priority, function() {
              or(e);
            });
            return;
          }
        } else if (t === 31) {
          if (t = yl(e), t !== null) {
            l.blockedOn = t, Uf(l.priority, function() {
              or(e);
            });
            return;
          }
        } else if (t === 3 && e.stateNode.current.memoizedState.isDehydrated) {
          l.blockedOn = e.tag === 3 ? e.stateNode.containerInfo : null;
          return;
        }
      }
    }
    l.blockedOn = null;
  }
  function xu(l) {
    if (l.blockedOn !== null) return !1;
    for (var t = l.targetContainers; 0 < t.length; ) {
      var e = uf(l.nativeEvent);
      if (e === null) {
        e = l.nativeEvent;
        var a = new e.constructor(
          e.type,
          e
        );
        cc = a, e.target.dispatchEvent(a), cc = null;
      } else
        return t = ke(e), t !== null && rr(t), l.blockedOn = e, !1;
      t.shift();
    }
    return !0;
  }
  function gr(l, t, e) {
    xu(l) && e.delete(t);
  }
  function md() {
    ff = !1, pe !== null && xu(pe) && (pe = null), ze !== null && xu(ze) && (ze = null), Te !== null && xu(Te) && (Te = null), pn.forEach(gr), zn.forEach(gr);
  }
  function Lu(l, t) {
    l.blockedOn === t && (l.blockedOn = null, ff || (ff = !0, r.unstable_scheduleCallback(
      r.unstable_NormalPriority,
      md
    )));
  }
  var Xu = null;
  function Er(l) {
    Xu !== l && (Xu = l, r.unstable_scheduleCallback(
      r.unstable_NormalPriority,
      function() {
        Xu === l && (Xu = null);
        for (var t = 0; t < l.length; t += 3) {
          var e = l[t], a = l[t + 1], n = l[t + 2];
          if (typeof a != "function") {
            if (cf(a || e) === null)
              continue;
            break;
          }
          var u = ke(e);
          u !== null && (l.splice(t, 3), t -= 3, ui(
            u,
            {
              pending: !0,
              data: n,
              method: e.method,
              action: a
            },
            a,
            n
          ));
        }
      }
    ));
  }
  function Oa(l) {
    function t(h) {
      return Lu(h, l);
    }
    pe !== null && Lu(pe, l), ze !== null && Lu(ze, l), Te !== null && Lu(Te, l), pn.forEach(t), zn.forEach(t);
    for (var e = 0; e < Ae.length; e++) {
      var a = Ae[e];
      a.blockedOn === l && (a.blockedOn = null);
    }
    for (; 0 < Ae.length && (e = Ae[0], e.blockedOn === null); )
      yr(e), e.blockedOn === null && Ae.shift();
    if (e = (l.ownerDocument || l).$$reactFormReplay, e != null)
      for (a = 0; a < e.length; a += 3) {
        var n = e[a], u = e[a + 1], c = n[Pl] || null;
        if (typeof u == "function")
          c || Er(e);
        else if (c) {
          var f = null;
          if (u && u.hasAttribute("formAction")) {
            if (n = u, c = u[Pl] || null)
              f = c.formAction;
            else if (cf(n) !== null) continue;
          } else f = c.action;
          typeof f == "function" ? e[a + 1] = f : (e.splice(a, 3), a -= 3), Er(e);
        }
      }
  }
  function br() {
    function l(u) {
      u.canIntercept && u.info === "react-transition" && u.intercept({
        handler: function() {
          return new Promise(function(c) {
            return n = c;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      n !== null && (n(), n = null), a || setTimeout(e, 20);
    }
    function e() {
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
      return navigation.addEventListener("navigate", l), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(e, 100), function() {
        a = !0, navigation.removeEventListener("navigate", l), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), n !== null && (n(), n = null);
      };
    }
  }
  function hf(l) {
    this._internalRoot = l;
  }
  Qu.prototype.render = hf.prototype.render = function(l) {
    var t = this._internalRoot;
    if (t === null) throw Error(o(409));
    var e = t.current, a = vt();
    mr(e, a, l, t, null, null);
  }, Qu.prototype.unmount = hf.prototype.unmount = function() {
    var l = this._internalRoot;
    if (l !== null) {
      this._internalRoot = null;
      var t = l.containerInfo;
      mr(l.current, 2, null, l, null, null), pu(), t[Ke] = null;
    }
  };
  function Qu(l) {
    this._internalRoot = l;
  }
  Qu.prototype.unstable_scheduleHydration = function(l) {
    if (l) {
      var t = Df();
      l = { blockedOn: null, target: l, priority: t };
      for (var e = 0; e < Ae.length && t !== 0 && t < Ae[e].priority; e++) ;
      Ae.splice(e, 0, l), e === 0 && yr(l);
    }
  };
  var Sr = N.version;
  if (Sr !== "19.2.0")
    throw Error(
      o(
        527,
        Sr,
        "19.2.0"
      )
    );
  _.findDOMNode = function(l) {
    var t = l._reactInternals;
    if (t === void 0)
      throw typeof l.render == "function" ? Error(o(188)) : (l = Object.keys(l).join(","), Error(o(268, l)));
    return l = z(t), l = l !== null ? j(l) : null, l = l === null ? null : l.stateNode, l;
  };
  var sd = {
    bundleType: 0,
    version: "19.2.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: S,
    reconcilerVersion: "19.2.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var ju = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!ju.isDisabled && ju.supportsFiber)
      try {
        Ca = ju.inject(
          sd
        ), it = ju;
      } catch {
      }
  }
  return An.createRoot = function(l, t) {
    if (!X(l)) throw Error(o(299));
    var e = !1, a = "", n = _m, u = Om, c = Dm;
    return t != null && (t.unstable_strictMode === !0 && (e = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (n = t.onUncaughtError), t.onCaughtError !== void 0 && (u = t.onCaughtError), t.onRecoverableError !== void 0 && (c = t.onRecoverableError)), t = fr(
      l,
      1,
      !1,
      null,
      null,
      e,
      a,
      null,
      n,
      u,
      c,
      br
    ), l[Ke] = t.current, Zi(l), new hf(t);
  }, An.hydrateRoot = function(l, t, e) {
    if (!X(l)) throw Error(o(299));
    var a = !1, n = "", u = _m, c = Om, f = Dm, h = null;
    return e != null && (e.unstable_strictMode === !0 && (a = !0), e.identifierPrefix !== void 0 && (n = e.identifierPrefix), e.onUncaughtError !== void 0 && (u = e.onUncaughtError), e.onCaughtError !== void 0 && (c = e.onCaughtError), e.onRecoverableError !== void 0 && (f = e.onRecoverableError), e.formState !== void 0 && (h = e.formState)), t = fr(
      l,
      1,
      !0,
      t,
      e ?? null,
      a,
      n,
      h,
      u,
      c,
      f,
      br
    ), t.context = hr(null), e = t.current, a = vt(), a = Iu(a), n = he(a), n.callback = null, me(e, n, a), e = a, t.current.lanes = e, qa(t, e), Bt(t), l[Ke] = t.current, Zi(l), new Qu(t);
  }, An.version = "19.2.0", An;
}
var Or;
function Sd() {
  if (Or) return sf.exports;
  Or = 1;
  function r() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r);
      } catch (N) {
        console.error(N);
      }
  }
  return r(), sf.exports = bd(), sf.exports;
}
var pd = Sd();
function zd(r = "") {
  const M = String(r).replace(/^#/, "").split("?")[0].split("/").filter(Boolean).map((o) => {
    try {
      return decodeURIComponent(o);
    } catch {
      return o;
    }
  });
  if (!M.length) return { name: "intro" };
  if (M[0] === "login" || M[0] === "register") return { name: M[0] };
  if (M[0] === "learn") {
    if (M[1] === "experiments" && M[2]) return { name: "practice", id: M[2] };
    if (["overview", "experiments", "history"].includes(M[1])) return { name: M[1] };
    if (!M[1]) return { name: "overview" };
  }
  return { name: "intro", unknown: !0 };
}
const vl = {
  intro: "#/",
  login: "#/login",
  register: "#/register",
  overview: "#/learn/overview",
  experiments: "#/learn/experiments",
  history: "#/learn/history",
  practice: (r) => `#/learn/experiments/${encodeURIComponent(r)}`
}, Td = (r) => ["overview", "experiments", "history"].includes(r.name), P = "#243C32", vf = "#E9B994", Dr = "#3B2E28";
function Gr({ size: r = 40 }) {
  return /* @__PURE__ */ i.createElement("svg", { className: "hl-logo-mark", width: r, height: r, viewBox: "0 0 48 48", "aria-hidden": "true" }, /* @__PURE__ */ i.createElement("circle", { cx: "24", cy: "24", r: "23", fill: "#E7EEDC" }), /* @__PURE__ */ i.createElement("path", { d: "M19 9h10M21 9v11L12 36q-2 4 3 4h18q5 0 3-4l-9-16V9", fill: "#FFFFFF", stroke: P, strokeWidth: "2.4", strokeLinejoin: "round" }), /* @__PURE__ */ i.createElement("path", { d: "M15.5 31h17l2.5 5q1 2-1.5 2h-19q-2.5 0-1.5-2z", fill: "#9CC08F" }), /* @__PURE__ */ i.createElement("circle", { cx: "22", cy: "27", r: "1.8", fill: "#9CC08F" }), /* @__PURE__ */ i.createElement("circle", { cx: "27", cy: "23.5", r: "1.3", fill: "#9CC08F" }), /* @__PURE__ */ i.createElement("path", { d: "M31 14q5-6 10-3-3 6-10 3z", fill: "#527A50" }));
}
function Ad({ size: r = 44 }) {
  return /* @__PURE__ */ i.createElement("svg", { className: "hl-assistant", width: r, height: r, viewBox: "0 0 64 64", "aria-hidden": "true" }, /* @__PURE__ */ i.createElement("path", { d: "M32 30L14 46M32 30l18 16", stroke: P, strokeWidth: "3", strokeLinecap: "round" }), /* @__PURE__ */ i.createElement("circle", { cx: "14", cy: "47", r: "9", fill: "#D4E2B8", stroke: P, strokeWidth: "2.5" }), /* @__PURE__ */ i.createElement("circle", { cx: "50", cy: "47", r: "9", fill: "#F1D780", stroke: P, strokeWidth: "2.5" }), /* @__PURE__ */ i.createElement("circle", { cx: "32", cy: "26", r: "17", fill: "#FFFFFF", stroke: P, strokeWidth: "2.5" }), /* @__PURE__ */ i.createElement("circle", { cx: "26", cy: "25", r: "2.4", fill: P }), /* @__PURE__ */ i.createElement("circle", { cx: "38", cy: "25", r: "2.4", fill: P }), /* @__PURE__ */ i.createElement("path", { d: "M26 32q6 5 12 0", stroke: P, strokeWidth: "2.4", fill: "none", strokeLinecap: "round" }), /* @__PURE__ */ i.createElement("circle", { cx: "21.5", cy: "30", r: "2.2", fill: "#F4B9A8", opacity: ".8" }), /* @__PURE__ */ i.createElement("circle", { cx: "42.5", cy: "30", r: "2.2", fill: "#F4B9A8", opacity: ".8" }));
}
function Md() {
  return /* @__PURE__ */ i.createElement("svg", { className: "hl-hero-art", viewBox: "0 0 600 470", role: "img", "aria-label": "Minh họa: học sinh mặc áo blouse, đeo kính bảo hộ, cầm bình tam giác bên bàn thí nghiệm cùng trợ lý EGAD" }, /* @__PURE__ */ i.createElement("path", { d: "M70 150C90 60 220 20 330 40s240 40 250 150-40 230-190 250S90 430 60 330 50 240 70 150z", fill: "#E7EEDC" }), /* @__PURE__ */ i.createElement("circle", { cx: "505", cy: "78", r: "30", fill: "#F1D780" }), /* @__PURE__ */ i.createElement("g", { fill: "none", stroke: "#527A50", strokeWidth: "2.2", opacity: ".55" }, /* @__PURE__ */ i.createElement("circle", { cx: "120", cy: "96", r: "9" }), /* @__PURE__ */ i.createElement("circle", { cx: "146", cy: "80", r: "7" }), /* @__PURE__ */ i.createElement("path", { d: "M127 91l12-7" }), /* @__PURE__ */ i.createElement("circle", { cx: "470", cy: "190", r: "7" }), /* @__PURE__ */ i.createElement("circle", { cx: "492", cy: "206", r: "9" }), /* @__PURE__ */ i.createElement("path", { d: "M476 195l9 6" })), /* @__PURE__ */ i.createElement("rect", { x: "40", y: "380", width: "520", height: "22", rx: "10", fill: "#C9A77F" }), /* @__PURE__ */ i.createElement("rect", { x: "70", y: "402", width: "16", height: "56", rx: "4", fill: "#B08C63" }), /* @__PURE__ */ i.createElement("rect", { x: "514", y: "402", width: "16", height: "56", rx: "4", fill: "#B08C63" }), /* @__PURE__ */ i.createElement("path", { d: "M90 318h56l-5 58q0 6-6 6h-34q-6 0-6-6z", fill: "#FFFFFF", stroke: P, strokeWidth: "3", strokeLinejoin: "round" }), /* @__PURE__ */ i.createElement("path", { d: "M94 348h48l-3 28q0 3-4 3h-34q-4 0-4-3z", fill: "#A9D2EA" }), /* @__PURE__ */ i.createElement("rect", { x: "168", y: "352", width: "82", height: "10", rx: "4", fill: "#9CC08F" }), [0, 1, 2].map((r) => /* @__PURE__ */ i.createElement("g", { key: r }, /* @__PURE__ */ i.createElement("path", { d: `M${178 + r * 24} 316h12v54q0 7-6 7t-6-7z`, fill: "#FFFFFF", stroke: P, strokeWidth: "2.6" }), /* @__PURE__ */ i.createElement("path", { d: `M${180 + r * 24} 344h8v24q0 5-4 5t-4-5z`, fill: ["#F2B6CB", "#D4E2B8", "#F1D780"][r] }))), /* @__PURE__ */ i.createElement("path", { d: "M262 380q-6-110 38-128h72q44 18 38 128z", fill: "#FFFFFF", stroke: P, strokeWidth: "3", strokeLinejoin: "round" }), /* @__PURE__ */ i.createElement("path", { d: "M336 252l-14 52M336 252l14 52", stroke: "#D4E2B8", strokeWidth: "10", strokeLinecap: "round" }), /* @__PURE__ */ i.createElement("path", { d: "M318 252h36l-18 30z", fill: "#527A50" }), /* @__PURE__ */ i.createElement("rect", { x: "322", y: "214", width: "28", height: "40", rx: "12", fill: vf }), /* @__PURE__ */ i.createElement("ellipse", { cx: "336", cy: "180", rx: "44", ry: "48", fill: vf }), /* @__PURE__ */ i.createElement("path", { d: "M290 178q-4-62 50-64 48 2 46 58-12-24-40-28-30 2-56 34z", fill: Dr }), /* @__PURE__ */ i.createElement("path", { d: "M288 176q4 30 14 40", stroke: Dr, strokeWidth: "10", strokeLinecap: "round" }), /* @__PURE__ */ i.createElement("rect", { x: "300", y: "166", width: "72", height: "26", rx: "13", fill: "#D9EEF3", fillOpacity: ".85", stroke: P, strokeWidth: "3" }), /* @__PURE__ */ i.createElement("path", { d: "M336 166v26", stroke: P, strokeWidth: "2.5" }), /* @__PURE__ */ i.createElement("circle", { cx: "319", cy: "180", r: "3.2", fill: P }), /* @__PURE__ */ i.createElement("circle", { cx: "353", cy: "180", r: "3.2", fill: P }), /* @__PURE__ */ i.createElement("path", { d: "M326 207q10 7 20 0", stroke: P, strokeWidth: "3", fill: "none", strokeLinecap: "round" }), /* @__PURE__ */ i.createElement("path", { d: "M392 290q34 6 40 34", stroke: "#FFFFFF", strokeWidth: "22", strokeLinecap: "round" }), /* @__PURE__ */ i.createElement("path", { d: "M392 290q34 6 40 34", stroke: P, strokeWidth: "3", fill: "none", strokeLinecap: "round", opacity: ".35" }), /* @__PURE__ */ i.createElement("path", { d: "M426 300h28M430 300v30l-22 40q-4 9 6 9h52q10 0 6-9l-22-40v-30", fill: "#FFFFFF", stroke: P, strokeWidth: "3", strokeLinejoin: "round" }), /* @__PURE__ */ i.createElement("path", { d: "M418 352h50l10 20q2 5-4 5h-62q-6 0-4-5z", fill: "#9CC08F" }), /* @__PURE__ */ i.createElement("circle", { cx: "436", cy: "362", r: "4", fill: "#FFFFFF", opacity: ".9" }), /* @__PURE__ */ i.createElement("circle", { cx: "450", cy: "342", r: "3", fill: "#9CC08F" }), /* @__PURE__ */ i.createElement("circle", { cx: "444", cy: "322", r: "2.4", fill: "#9CC08F" }), /* @__PURE__ */ i.createElement("circle", { cx: "430", cy: "330", r: "12", fill: vf }), /* @__PURE__ */ i.createElement("g", { transform: "translate(470 222)" }, /* @__PURE__ */ i.createElement("path", { d: "M32 30L14 46M32 30l18 16", stroke: P, strokeWidth: "3", strokeLinecap: "round" }), /* @__PURE__ */ i.createElement("circle", { cx: "14", cy: "47", r: "9", fill: "#D4E2B8", stroke: P, strokeWidth: "2.5" }), /* @__PURE__ */ i.createElement("circle", { cx: "50", cy: "47", r: "9", fill: "#F1D780", stroke: P, strokeWidth: "2.5" }), /* @__PURE__ */ i.createElement("circle", { cx: "32", cy: "26", r: "17", fill: "#FFFFFF", stroke: P, strokeWidth: "2.5" }), /* @__PURE__ */ i.createElement("circle", { cx: "26", cy: "25", r: "2.4", fill: P }), /* @__PURE__ */ i.createElement("circle", { cx: "38", cy: "25", r: "2.4", fill: P }), /* @__PURE__ */ i.createElement("path", { d: "M26 32q6 5 12 0", stroke: P, strokeWidth: "2.4", fill: "none", strokeLinecap: "round" })), /* @__PURE__ */ i.createElement("path", { d: "M468 214q-10-30 18-40h56q14 0 14 14v18q0 14-14 14h-30l-14 12v-12z", fill: "#FFFFFF", stroke: P, strokeWidth: "2.5" }), /* @__PURE__ */ i.createElement("text", { x: "514", y: "200", textAnchor: "middle", fontFamily: "Lora, Georgia, serif", fontSize: "20", fill: P }, "Vì sao?"), /* @__PURE__ */ i.createElement("path", { d: "M560 376q-6-40 18-60 10 30-18 60z", fill: "#9CC08F" }), /* @__PURE__ */ i.createElement("path", { d: "M42 376q-2-36-24-52-6 30 24 52z", fill: "#527A50", opacity: ".8" }));
}
function Nd() {
  return /* @__PURE__ */ i.createElement("svg", { className: "hl-about-art", viewBox: "0 0 440 330", role: "img", "aria-label": "Minh họa: sổ ghi chép mở với phương trình phản ứng, mô hình phân tử và bong bóng hội thoại" }, /* @__PURE__ */ i.createElement("path", { d: "M40 120C60 40 180 20 270 40s160 70 150 160-110 120-220 110S20 200 40 120z", fill: "#E7EEDC" }), /* @__PURE__ */ i.createElement("path", { d: "M80 230l130 26V130L80 104z", fill: "#FFFFFF", stroke: P, strokeWidth: "3", strokeLinejoin: "round" }), /* @__PURE__ */ i.createElement("path", { d: "M340 230l-130 26V130l130-26z", fill: "#FFFFFF", stroke: P, strokeWidth: "3", strokeLinejoin: "round" }), /* @__PURE__ */ i.createElement("path", { d: "M100 134l88 17M100 154l70 13M100 174l84 16", stroke: "#9CC08F", strokeWidth: "5", strokeLinecap: "round" }), /* @__PURE__ */ i.createElement("text", { x: "274", y: "166", textAnchor: "middle", fontFamily: "Lora, Georgia, serif", fontSize: "14", fill: P, transform: "rotate(-11 274 166)" }, "Ag⁺ + Cl⁻ → AgCl↓"), /* @__PURE__ */ i.createElement("path", { d: "M232 196l88-17", stroke: "#F1D780", strokeWidth: "6", strokeLinecap: "round" }), /* @__PURE__ */ i.createElement("g", { stroke: P, strokeWidth: "3" }, /* @__PURE__ */ i.createElement("path", { d: "M330 70l30 24M330 70l-22 30" }), /* @__PURE__ */ i.createElement("circle", { cx: "330", cy: "70", r: "14", fill: "#F2B6CB" }), /* @__PURE__ */ i.createElement("circle", { cx: "362", cy: "96", r: "10", fill: "#FFFFFF" }), /* @__PURE__ */ i.createElement("circle", { cx: "306", cy: "102", r: "10", fill: "#FFFFFF" })), /* @__PURE__ */ i.createElement("path", { d: "M70 60q0-16 16-16h72q16 0 16 16v28q0 16-16 16h-46l-22 18v-18q-20 0-20-16z", fill: "#FFFFFF", stroke: P, strokeWidth: "3" }), /* @__PURE__ */ i.createElement("path", { d: "M92 66h56M92 82h38", stroke: "#527A50", strokeWidth: "5", strokeLinecap: "round" }), /* @__PURE__ */ i.createElement("path", { d: "M380 250q-4-36 20-56 8 30-20 56z", fill: "#9CC08F" }));
}
const Ur = ["#F7DDD1", "#E7EEDC", "#FBF0C9", "#DCECF4", "#ECE1F4"], Cr = ["#9CC08F", "#F2B6CB", "#A9D2EA", "#F1C76E", "#C6AEE6"];
function gf({ index: r = 0 }) {
  const N = Ur[r % Ur.length], M = Cr[r % Cr.length];
  return /* @__PURE__ */ i.createElement("svg", { className: "hl-thumb", viewBox: "0 0 96 72", "aria-hidden": "true" }, /* @__PURE__ */ i.createElement("rect", { width: "96", height: "72", rx: "16", fill: N }), /* @__PURE__ */ i.createElement("path", { d: "M18 18h12v34q0 7-6 7t-6-7z", fill: "#FFFFFF", stroke: P, strokeWidth: "2" }), /* @__PURE__ */ i.createElement("path", { d: "M20 40h8v12q0 4-4 4t-4-4z", fill: M }), /* @__PURE__ */ i.createElement("path", { d: "M44 14h10M46 14v13L36 50q-2 6 4 6h18q6 0 4-6L52 27V14", fill: "#FFFFFF", stroke: P, strokeWidth: "2", strokeLinejoin: "round" }), /* @__PURE__ */ i.createElement("path", { d: "M38 44h22l3 7q1 3-2 3H37q-3 0-2-3z", fill: M }), /* @__PURE__ */ i.createElement("path", { d: "M68 30h16l-2 24q0 3-3 3h-6q-3 0-3-3z", fill: "#FFFFFF", stroke: P, strokeWidth: "2", strokeLinejoin: "round" }), /* @__PURE__ */ i.createElement("path", { d: "M70 44h12l-1 9q0 2-2 2h-6q-2 0-2-2z", fill: M, opacity: ".85" }));
}
function _d() {
  return /* @__PURE__ */ i.createElement("svg", { className: "hl-empty-art", viewBox: "0 0 160 110", "aria-hidden": "true" }, /* @__PURE__ */ i.createElement("ellipse", { cx: "80", cy: "96", rx: "64", ry: "12", fill: "#E7EEDC" }), /* @__PURE__ */ i.createElement("path", { d: "M68 18h24M71 18v22L52 80q-3 10 8 10h40q11 0 8-10L89 40V18", fill: "#FFFFFF", stroke: P, strokeWidth: "3", strokeLinejoin: "round" }), /* @__PURE__ */ i.createElement("path", { d: "M58 72h44l4 9q1 4-4 4H58q-5 0-4-4z", fill: "#D4E2B8" }), /* @__PURE__ */ i.createElement("path", { d: "M116 40l3 7 7 3-7 3-3 7-3-7-7-3 7-3z", fill: "#F1D780" }));
}
function Nt({ children: r, label: N, size: M = 22 }) {
  return /* @__PURE__ */ i.createElement(
    "svg",
    {
      className: "hl-icon",
      width: M,
      height: M,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      role: N ? "img" : void 0,
      "aria-label": N,
      "aria-hidden": N ? void 0 : !0
    },
    r
  );
}
const Od = (r) => /* @__PURE__ */ i.createElement(Nt, { ...r }, /* @__PURE__ */ i.createElement("path", { d: "M4 11l8-7 8 7" }), /* @__PURE__ */ i.createElement("path", { d: "M6 10v9h12v-9" }), /* @__PURE__ */ i.createElement("path", { d: "M10 19v-5h4v5" })), xr = (r) => /* @__PURE__ */ i.createElement(Nt, { ...r }, /* @__PURE__ */ i.createElement("path", { d: "M9 3h6M10 3v6l-5 9q-1 3 2 3h10q3 0 2-3l-5-9V3" }), /* @__PURE__ */ i.createElement("path", { d: "M7.5 15h9" })), Lr = (r) => /* @__PURE__ */ i.createElement(Nt, { ...r }, /* @__PURE__ */ i.createElement("path", { d: "M3 12a9 9 0 1 0 3-6.7" }), /* @__PURE__ */ i.createElement("path", { d: "M3 4v4h4" }), /* @__PURE__ */ i.createElement("path", { d: "M12 8v4l3 2" })), Xr = (r) => /* @__PURE__ */ i.createElement(Nt, { ...r }, /* @__PURE__ */ i.createElement("path", { d: "M4 7h16M4 12h16M4 17h16" })), Qr = (r) => /* @__PURE__ */ i.createElement(Nt, { ...r }, /* @__PURE__ */ i.createElement("path", { d: "M6 6l12 12M18 6L6 18" })), Dd = (r) => /* @__PURE__ */ i.createElement(Nt, { ...r }, /* @__PURE__ */ i.createElement("path", { d: "M15 6l-6 6 6 6" })), Ud = (r) => /* @__PURE__ */ i.createElement(Nt, { ...r }, /* @__PURE__ */ i.createElement("path", { d: "M9 6l6 6-6 6" })), Cd = (r) => /* @__PURE__ */ i.createElement(Nt, { ...r }, /* @__PURE__ */ i.createElement("circle", { cx: "11", cy: "11", r: "6.5" }), /* @__PURE__ */ i.createElement("path", { d: "M20 20l-4.2-4.2" })), jr = (r) => /* @__PURE__ */ i.createElement(Nt, { ...r }, /* @__PURE__ */ i.createElement("path", { d: "M5 12h14M13 6l6 6-6 6" })), Hd = (r) => /* @__PURE__ */ i.createElement(Nt, { ...r }, /* @__PURE__ */ i.createElement("path", { d: "M8 13V6.5a1.5 1.5 0 0 1 3 0V12V4.5a1.5 1.5 0 0 1 3 0V12V6a1.5 1.5 0 0 1 3 0v8q0 6-6 7-4 0-6-4l-2-4q-1-2 1-2.5t3 1.5z" })), qd = (r) => /* @__PURE__ */ i.createElement(Nt, { ...r }, /* @__PURE__ */ i.createElement("path", { d: "M4 6q0-2 2-2h12q2 0 2 2v8q0 2-2 2h-7l-5 4v-4q-2 0-2-2z" }), /* @__PURE__ */ i.createElement("path", { d: "M8 9h8M8 12h5" })), Bd = (r) => /* @__PURE__ */ i.createElement(Nt, { ...r }, /* @__PURE__ */ i.createElement("rect", { x: "5", y: "10", width: "14", height: "10", rx: "2" }), /* @__PURE__ */ i.createElement("path", { d: "M8 10V7a4 4 0 0 1 8 0v3" })), Hr = "hololab-sidebar-collapsed", Rd = (r) => {
  try {
    return localStorage.getItem(r);
  } catch {
    return null;
  }
}, Yd = (r, N) => {
  try {
    localStorage.setItem(r, N);
  } catch {
  }
};
function Gd({ route: r }) {
  const [N, M] = fl.useState(!1), o = ["overview", "experiments", "history"].includes(r.name);
  fl.useEffect(() => M(!1), [r.name]), fl.useEffect(() => {
    if (!N) return;
    const R = (k) => k.key === "Escape" && M(!1);
    return addEventListener("keydown", R), () => removeEventListener("keydown", R);
  }, [N]);
  const X = (R, k, yl) => /* @__PURE__ */ i.createElement("a", { href: R, "aria-current": yl ? "page" : void 0 }, k);
  return /* @__PURE__ */ i.createElement("header", { className: "hl-topnav" }, /* @__PURE__ */ i.createElement("a", { className: "hl-brand", href: vl.intro, "aria-label": "HoloLab: trang giới thiệu" }, /* @__PURE__ */ i.createElement(Gr, null), /* @__PURE__ */ i.createElement("span", null, /* @__PURE__ */ i.createElement("strong", null, "HoloLab"), /* @__PURE__ */ i.createElement("small", null, "Phòng thí nghiệm Hóa học ảo"))), /* @__PURE__ */ i.createElement("nav", { className: "hl-topnav-main", "aria-label": "Điều hướng chính" }, X(vl.intro, "Giới thiệu", r.name === "intro"), X(vl.overview, "Học tập", o)), /* @__PURE__ */ i.createElement("div", { className: "hl-topnav-account" }, /* @__PURE__ */ i.createElement("a", { className: "hl-link-quiet", href: vl.login, "aria-current": r.name === "login" ? "page" : void 0 }, "Đăng nhập"), /* @__PURE__ */ i.createElement("a", { className: "hl-btn hl-btn-primary", href: vl.register, "aria-current": r.name === "register" ? "page" : void 0 }, "Đăng ký")), /* @__PURE__ */ i.createElement(
    "button",
    {
      type: "button",
      className: "hl-icon-btn hl-topnav-toggle",
      "aria-expanded": N,
      "aria-controls": "hl-topnav-menu",
      "aria-label": N ? "Đóng menu" : "Mở menu",
      onClick: () => M((R) => !R)
    },
    N ? /* @__PURE__ */ i.createElement(Qr, null) : /* @__PURE__ */ i.createElement(Xr, null)
  ), N && /* @__PURE__ */ i.createElement("div", { className: "hl-topnav-menu", id: "hl-topnav-menu" }, X(vl.intro, "Giới thiệu", r.name === "intro"), X(vl.overview, "Học tập", o), X(vl.login, "Đăng nhập", r.name === "login"), /* @__PURE__ */ i.createElement("a", { className: "hl-btn hl-btn-primary", href: vl.register }, "Đăng ký")));
}
const xd = [
  ["overview", "Tổng quan", Od, vl.overview],
  ["experiments", "Thư viện thí nghiệm", xr, vl.experiments],
  ["history", "Lịch sử học", Lr, vl.history]
];
function Ld({ route: r, children: N }) {
  const [M, o] = fl.useState(() => Rd(Hr) === "1"), [X, R] = fl.useState(!1), k = fl.useRef(null);
  fl.useEffect(() => R(!1), [r.name]), fl.useEffect(() => {
    if (!X) return;
    k.current?.querySelector("a")?.focus();
    const z = (j) => j.key === "Escape" && R(!1);
    return addEventListener("keydown", z), () => removeEventListener("keydown", z);
  }, [X]);
  const yl = () => o((z) => (Yd(Hr, z ? "0" : "1"), !z)), U = /* @__PURE__ */ i.createElement("nav", { "aria-label": "Khu học tập" }, xd.map(([z, j, q, tl]) => /* @__PURE__ */ i.createElement("a", { key: z, href: tl, className: "hl-side-link", "aria-current": r.name === z ? "page" : void 0, title: M ? j : void 0 }, /* @__PURE__ */ i.createElement(q, null), /* @__PURE__ */ i.createElement("span", null, j))));
  return /* @__PURE__ */ i.createElement("div", { className: "hl-learn" + (M ? " is-collapsed" : "") }, /* @__PURE__ */ i.createElement("aside", { className: "hl-sidebar", "aria-label": "Thanh bên" }, U, /* @__PURE__ */ i.createElement("button", { type: "button", className: "hl-side-collapse", onClick: yl, "aria-label": M ? "Mở rộng thanh bên" : "Thu gọn thanh bên" }, M ? /* @__PURE__ */ i.createElement(Ud, null) : /* @__PURE__ */ i.createElement(Dd, null), /* @__PURE__ */ i.createElement("span", null, "Thu gọn"))), X && /* @__PURE__ */ i.createElement("div", { className: "hl-drawer-scrim", onClick: () => R(!1) }), X && /* @__PURE__ */ i.createElement("aside", { className: "hl-drawer", ref: k, "aria-label": "Menu khu học tập" }, /* @__PURE__ */ i.createElement("button", { type: "button", className: "hl-icon-btn hl-drawer-close", onClick: () => R(!1), "aria-label": "Đóng menu" }, /* @__PURE__ */ i.createElement(Qr, null)), U), /* @__PURE__ */ i.createElement("div", { className: "hl-learn-main", id: "hl-content" }, /* @__PURE__ */ i.createElement("button", { type: "button", className: "hl-btn hl-btn-ghost hl-drawer-open", onClick: () => R(!0), "aria-label": "Mở menu khu học tập" }, /* @__PURE__ */ i.createElement(Xr, null), " Menu học tập"), N));
}
const Xd = [
  [Hd, "Thực hành trực quan", "Tương tác với dụng cụ và hóa chất 3D bằng chuột, hoặc bằng bàn tay trước webcam."],
  [qd, "Giải thích cùng EGAD", "Viết cách bạn hiểu hiện tượng, nhận câu hỏi gợi mở để làm rõ. Phản hồi là dự đoán của AI, chưa được giáo viên xác nhận."],
  [Lr, "Nhìn lại tiến trình", "Mở lại các phiên đã lưu và những gì bạn đã làm, để biết phần nào cần ôn thêm."]
], qr = ["Chọn thí nghiệm", "Thực hành", "Giải thích", "Vận dụng"];
function Br({ fill: r, className: N = "" }) {
  return /* @__PURE__ */ i.createElement("svg", { className: "hl-wave " + N, viewBox: "0 0 1440 80", preserveAspectRatio: "none", "aria-hidden": "true" }, /* @__PURE__ */ i.createElement("path", { d: "M0 46C200 6 380 4 580 36s360 44 560 10 240-30 300-14v102H0z", fill: r }));
}
function Qd({ lessonCount: r, onHelp: N }) {
  return /* @__PURE__ */ i.createElement("div", { className: "hl-intro" }, /* @__PURE__ */ i.createElement("section", { className: "hl-hero", "aria-labelledby": "hl-hero-title" }, /* @__PURE__ */ i.createElement("div", { className: "hl-hero-text" }, /* @__PURE__ */ i.createElement("p", { className: "hl-eyebrow" }, "Phòng thí nghiệm Hóa học ảo cho THPT"), /* @__PURE__ */ i.createElement("h1", { id: "hl-hero-title" }, "Tự tay khám phá.", /* @__PURE__ */ i.createElement("br", null), /* @__PURE__ */ i.createElement("span", null, "Tự mình hiểu sâu.")), /* @__PURE__ */ i.createElement("p", { className: "hl-lead" }, "Thực hành thí nghiệm 3D, giải thích hiện tượng cùng EGAD và nhìn lại quá trình học của bạn."), /* @__PURE__ */ i.createElement("div", { className: "hl-actions" }, /* @__PURE__ */ i.createElement("a", { className: "hl-btn hl-btn-primary hl-btn-lg", href: vl.overview }, "Bắt đầu học"), /* @__PURE__ */ i.createElement("a", { className: "hl-btn hl-btn-ghost hl-btn-lg", href: vl.experiments }, "Khám phá thí nghiệm")), r > 0 && /* @__PURE__ */ i.createElement("p", { className: "hl-hero-note" }, r, " bài thực hành lớp 10–12 · Chạy offline trên máy của bạn")), /* @__PURE__ */ i.createElement(Md, null)), /* @__PURE__ */ i.createElement(Br, { fill: "#E7EEDC" }), /* @__PURE__ */ i.createElement("section", { className: "hl-band hl-band-sage", "aria-labelledby": "hl-about-title" }, /* @__PURE__ */ i.createElement("div", { className: "hl-about" }, /* @__PURE__ */ i.createElement(Nd, null), /* @__PURE__ */ i.createElement("div", null, /* @__PURE__ */ i.createElement("h2", { id: "hl-about-title" }, "Một không gian để thử, hỏi và hiểu"), /* @__PURE__ */ i.createElement("p", null, "Ở HoloLab, bạn tự rót, trộn và quan sát: kết tủa xuất hiện, dung dịch đổi màu, khí thoát ra. Lượng chất được tính toán và bảo toàn, nên mỗi thao tác đều có hệ quả."), /* @__PURE__ */ i.createElement("p", null, "Sau khi quan sát, bạn viết lời giải thích của mình. EGAD không đưa đáp án ngay mà đặt câu hỏi gợi mở, giúp bạn tự nhận ra chỗ còn thiếu."), /* @__PURE__ */ i.createElement("p", { className: "hl-fineprint" }, "Đây là mô hình giáo dục có giới hạn, không thay thế thí nghiệm thật và hướng dẫn an toàn của giáo viên.")))), /* @__PURE__ */ i.createElement("section", { className: "hl-band hl-band-sage", "aria-labelledby": "hl-features-title" }, /* @__PURE__ */ i.createElement("h2", { id: "hl-features-title", className: "hl-center" }, "Học bằng cách làm, rồi tự giải thích"), /* @__PURE__ */ i.createElement("ul", { className: "hl-features" }, Xd.map(([M, o, X], R) => /* @__PURE__ */ i.createElement("li", { key: o }, /* @__PURE__ */ i.createElement("span", { className: "hl-feature-icon hl-tint-" + R }, /* @__PURE__ */ i.createElement(M, { size: 30 })), /* @__PURE__ */ i.createElement("h3", null, o), /* @__PURE__ */ i.createElement("p", null, X))))), /* @__PURE__ */ i.createElement(Br, { fill: "#FAF8F1", className: "hl-wave-on-sage" }), /* @__PURE__ */ i.createElement("section", { className: "hl-band", "aria-labelledby": "hl-steps-title" }, /* @__PURE__ */ i.createElement("h2", { id: "hl-steps-title", className: "hl-center" }, "Một bài thực hành diễn ra thế nào"), /* @__PURE__ */ i.createElement("ol", { className: "hl-steps" }, qr.map((M, o) => /* @__PURE__ */ i.createElement("li", { key: M }, /* @__PURE__ */ i.createElement("span", { className: "hl-step-num" }, o + 1), /* @__PURE__ */ i.createElement("strong", null, M), o < qr.length - 1 && /* @__PURE__ */ i.createElement(jr, { size: 20 }))))), /* @__PURE__ */ i.createElement("section", { className: "hl-band", "aria-labelledby": "hl-cta-title" }, /* @__PURE__ */ i.createElement("div", { className: "hl-cta" }, /* @__PURE__ */ i.createElement(Ad, { size: 72 }), /* @__PURE__ */ i.createElement("div", null, /* @__PURE__ */ i.createElement("h2", { id: "hl-cta-title" }, "Sẵn sàng bắt đầu thí nghiệm đầu tiên?"), /* @__PURE__ */ i.createElement("p", null, "Chọn một bài, đọc mục tiêu, rồi bắt tay vào làm.")), /* @__PURE__ */ i.createElement("a", { className: "hl-btn hl-btn-primary hl-btn-lg", href: vl.experiments }, "Vào thư viện thí nghiệm"))), /* @__PURE__ */ i.createElement("footer", { className: "hl-footer" }, /* @__PURE__ */ i.createElement("div", { className: "hl-footer-brand" }, /* @__PURE__ */ i.createElement("span", { className: "hl-brand" }, /* @__PURE__ */ i.createElement(Gr, null), /* @__PURE__ */ i.createElement("span", null, /* @__PURE__ */ i.createElement("strong", null, "HoloLab"), /* @__PURE__ */ i.createElement("small", null, "Phòng thí nghiệm Hóa học ảo"))), /* @__PURE__ */ i.createElement("p", null, "Thực hành an toàn, quan sát kỹ và tự giải thích hiện tượng.")), /* @__PURE__ */ i.createElement("nav", { "aria-label": "Liên kết chân trang" }, /* @__PURE__ */ i.createElement("h3", null, "Khám phá"), /* @__PURE__ */ i.createElement("a", { href: vl.intro }, "Giới thiệu"), /* @__PURE__ */ i.createElement("a", { href: vl.overview }, "Học tập"), /* @__PURE__ */ i.createElement("button", { type: "button", onClick: N }, "Hướng dẫn thao tác")), /* @__PURE__ */ i.createElement("div", null, /* @__PURE__ */ i.createElement("h3", null, "Quyền riêng tư"), /* @__PURE__ */ i.createElement("p", null, "Hình ảnh webcam chỉ được xử lý trên máy này, không lưu và không gửi đi. Phiên đã lưu nằm trong trình duyệt của bạn.")), /* @__PURE__ */ i.createElement("p", { className: "hl-copy" }, "© 2026 HoloLab")));
}
function Rr(r) {
  return String(r ?? "").normalize("NFKC").toLocaleLowerCase("vi").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/\s+/g, " ").trim();
}
function jd(r, N) {
  const M = new Map((N || []).map((X) => [X.id, X])), o = {};
  for (const X of r || [])
    o[X.id] = (X.setup || []).map((R) => M.get(R.stock)).filter(Boolean).map((R) => ({ name: R.name, formula: R.formula }));
  return o;
}
function Zd(r) {
  return [...new Set((r || []).map((N) => N.topic).filter(Boolean))].sort((N, M) => N.localeCompare(M, "vi"));
}
function Vd(r, { query: N = "", grade: M = "all", topic: o = "all" } = {}, X = {}) {
  const R = Rr(N);
  return (r || []).filter((k) => {
    if (k.status !== "ready" || M !== "all" && k.grade !== Number(M) || o !== "all" && k.topic !== o) return !1;
    if (!R) return !0;
    const yl = (X[k.id] || []).map((U) => `${U.name} ${U.formula}`).join(" ");
    return Rr(`${k.title} ${k.topic} ${k.objective || ""} ${yl}`).includes(R);
  });
}
function Ef(r) {
  const N = r?.data;
  return N?.schema === "hololab-lesson-1" && typeof N.model?.lesson == "string" ? N.model.lesson : null;
}
function Zu(r) {
  const N = r?.data?.model;
  return Ef(r) ? N?.complete ? "Đã làm hết các bước" : N?.observed ? "Đã quan sát hiện tượng" : "Đang làm dở" : "Bàn thí nghiệm tự do";
}
const Vu = "Lưu trên trình duyệt này";
function bf({ title: r, text: N, action: M }) {
  return /* @__PURE__ */ i.createElement("div", { className: "hl-empty" }, /* @__PURE__ */ i.createElement(_d, null), /* @__PURE__ */ i.createElement("h3", null, r), N && /* @__PURE__ */ i.createElement("p", null, N), M);
}
function Kd({ lessons: r, saved: N, onOpenSaved: M }) {
  const o = N[0], X = r.filter((R) => R.status === "ready");
  return /* @__PURE__ */ i.createElement("div", { className: "hl-page" }, /* @__PURE__ */ i.createElement("header", { className: "hl-page-head" }, /* @__PURE__ */ i.createElement("h1", null, "Chào bạn!"), /* @__PURE__ */ i.createElement("p", null, "Hôm nay bạn muốn thử thí nghiệm nào?")), /* @__PURE__ */ i.createElement("div", { className: "hl-overview" }, /* @__PURE__ */ i.createElement("section", { className: "hl-panel hl-continue", "aria-labelledby": "hl-continue-title" }, /* @__PURE__ */ i.createElement("h2", { id: "hl-continue-title" }, "Tiếp tục"), o ? /* @__PURE__ */ i.createElement("div", { className: "hl-continue-body" }, /* @__PURE__ */ i.createElement(gf, { index: Math.max(0, X.findIndex((R) => R.id === Ef(o))) }), /* @__PURE__ */ i.createElement("div", null, /* @__PURE__ */ i.createElement("strong", null, o.name), /* @__PURE__ */ i.createElement("span", { className: "hl-muted" }, Zu(o), " · ", o.date), /* @__PURE__ */ i.createElement("span", { className: "hl-chip hl-chip-quiet" }, Vu)), /* @__PURE__ */ i.createElement("button", { type: "button", className: "hl-btn hl-btn-primary", onClick: () => M(o) }, "Tiếp tục")) : /* @__PURE__ */ i.createElement(
    bf,
    {
      title: "Bạn chưa có phiên nào được lưu",
      text: "Khi thực hành, bấm “Lưu” để có thể quay lại làm tiếp.",
      action: /* @__PURE__ */ i.createElement("a", { className: "hl-btn hl-btn-primary", href: vl.experiments }, "Chọn thí nghiệm đầu tiên")
    }
  )), /* @__PURE__ */ i.createElement("section", { className: "hl-panel hl-shortcut", "aria-labelledby": "hl-shortcut-title" }, /* @__PURE__ */ i.createElement("span", { className: "hl-feature-icon hl-tint-1" }, /* @__PURE__ */ i.createElement(xr, { size: 28 })), /* @__PURE__ */ i.createElement("h2", { id: "hl-shortcut-title" }, "Thư viện thí nghiệm"), /* @__PURE__ */ i.createElement("p", null, X.length, " bài thực hành lớp 10–12, có mục tiêu và các bước cho từng bài."), /* @__PURE__ */ i.createElement("a", { className: "hl-btn hl-btn-ghost", href: vl.experiments }, "Mở thư viện ", /* @__PURE__ */ i.createElement(jr, { size: 18 }))), /* @__PURE__ */ i.createElement("section", { className: "hl-panel hl-recent", "aria-labelledby": "hl-recent-title" }, /* @__PURE__ */ i.createElement("div", { className: "hl-panel-head" }, /* @__PURE__ */ i.createElement("h2", { id: "hl-recent-title" }, "Hoạt động gần đây"), /* @__PURE__ */ i.createElement("span", { className: "hl-muted" }, Vu)), N.length ? /* @__PURE__ */ i.createElement("ul", { className: "hl-list" }, N.slice(0, 5).map((R, k) => /* @__PURE__ */ i.createElement("li", { key: k }, /* @__PURE__ */ i.createElement("div", null, /* @__PURE__ */ i.createElement("strong", null, R.name), /* @__PURE__ */ i.createElement("span", { className: "hl-muted" }, Zu(R), " · ", R.date)), /* @__PURE__ */ i.createElement("button", { type: "button", className: "hl-btn hl-btn-ghost hl-btn-sm", onClick: () => M(R) }, "Mở lại")))) : /* @__PURE__ */ i.createElement("p", { className: "hl-muted" }, "Chưa có hoạt động nào trên trình duyệt này."))));
}
function Jd({ lessons: r, stocks: N, saved: M, onPreview: o, onOpenSaved: X, onFree: R, notice: k }) {
  const [yl, U] = fl.useState(""), [z, j] = fl.useState("all"), [q, tl] = fl.useState("all"), Ml = !r.length, Nl = fl.useMemo(() => r.filter((x) => x.status === "ready"), [r]), gl = fl.useMemo(() => jd(r, N), [r, N]), kl = fl.useMemo(() => Zd(Nl), [Nl]), Rl = fl.useMemo(() => Vd(r, { query: yl, grade: z, topic: q }, gl), [r, yl, z, q, gl]), Il = yl.trim() !== "" || z !== "all" || q !== "all", pl = () => {
    U(""), j("all"), tl("all");
  }, Kl = (x) => M.find((zl) => Ef(zl) === x);
  return /* @__PURE__ */ i.createElement("div", { className: "hl-page" }, /* @__PURE__ */ i.createElement("header", { className: "hl-page-head hl-page-head-row" }, /* @__PURE__ */ i.createElement("div", null, /* @__PURE__ */ i.createElement("h1", null, "Thư viện thí nghiệm"), /* @__PURE__ */ i.createElement("p", null, "Chọn một bài để xem mục tiêu và các bước, rồi bắt đầu thực hành trên bàn thí nghiệm 3D.")), /* @__PURE__ */ i.createElement("button", { type: "button", className: "hl-btn hl-btn-ghost", onClick: R }, "＋ Bàn thí nghiệm mới")), k && /* @__PURE__ */ i.createElement("p", { className: "hl-notice", role: "status" }, k), M.length > 0 && /* @__PURE__ */ i.createElement("section", { className: "hl-saved-strip", "aria-labelledby": "hl-saved-title" }, /* @__PURE__ */ i.createElement("h2", { id: "hl-saved-title" }, "Tiếp tục phiên đã lưu ", /* @__PURE__ */ i.createElement("span", { className: "hl-muted" }, "· ", Vu)), /* @__PURE__ */ i.createElement("div", null, M.slice(0, 4).map((x, zl) => /* @__PURE__ */ i.createElement("button", { type: "button", className: "saved-session", key: zl, onClick: () => X(x) }, /* @__PURE__ */ i.createElement("strong", null, x.name), /* @__PURE__ */ i.createElement("small", null, Zu(x), " · ", x.date))))), /* @__PURE__ */ i.createElement("div", { className: "hl-filters", role: "search" }, /* @__PURE__ */ i.createElement("label", { className: "hl-search" }, /* @__PURE__ */ i.createElement(Cd, null), /* @__PURE__ */ i.createElement("input", { type: "search", "aria-label": "Tìm thí nghiệm", placeholder: "Tìm theo tên bài, chủ đề hoặc hóa chất…", value: yl, onChange: (x) => U(x.target.value) })), /* @__PURE__ */ i.createElement("select", { "aria-label": "Lọc lớp", value: z, onChange: (x) => j(x.target.value) }, /* @__PURE__ */ i.createElement("option", { value: "all" }, "Tất cả lớp"), [10, 11, 12].map((x) => /* @__PURE__ */ i.createElement("option", { key: x, value: x }, "Lớp ", x))), /* @__PURE__ */ i.createElement("select", { "aria-label": "Lọc chủ đề", value: q, onChange: (x) => tl(x.target.value) }, /* @__PURE__ */ i.createElement("option", { value: "all" }, "Tất cả chủ đề"), kl.map((x) => /* @__PURE__ */ i.createElement("option", { key: x, value: x }, x))), Il && /* @__PURE__ */ i.createElement("button", { type: "button", className: "hl-btn hl-btn-quiet", onClick: pl }, "Xóa bộ lọc")), !Ml && /* @__PURE__ */ i.createElement("p", { className: "hl-count", "aria-live": "polite" }, "Hiển thị ", Rl.length, "/", Nl.length, " bài"), Ml ? /* @__PURE__ */ i.createElement("ul", { className: "hl-rows", "aria-busy": "true", "aria-label": "Đang tải danh sách thí nghiệm" }, [0, 1, 2].map((x) => /* @__PURE__ */ i.createElement("li", { key: x, className: "hl-row hl-skeleton" }, /* @__PURE__ */ i.createElement("span", null), /* @__PURE__ */ i.createElement("span", null), /* @__PURE__ */ i.createElement("span", null)))) : Rl.length ? /* @__PURE__ */ i.createElement("ul", { className: "hl-rows" }, Rl.map((x) => {
    const zl = Nl.indexOf(x), J = Kl(x.id), _l = gl[x.id] || [];
    return /* @__PURE__ */ i.createElement("li", { key: x.id }, /* @__PURE__ */ i.createElement("article", { className: "hl-row experiment-card", onClick: (Gl) => {
      Gl.target.closest("button") || o(x);
    } }, /* @__PURE__ */ i.createElement(gf, { index: zl }), /* @__PURE__ */ i.createElement("div", { className: "hl-row-body" }, /* @__PURE__ */ i.createElement("h3", null, x.title), /* @__PURE__ */ i.createElement("p", { className: "hl-clamp" }, x.objective), /* @__PURE__ */ i.createElement("div", { className: "hl-tags" }, /* @__PURE__ */ i.createElement("span", { className: "hl-chip" }, "Lớp ", x.grade), /* @__PURE__ */ i.createElement("span", { className: "hl-chip hl-chip-quiet" }, x.topic), x.curriculum?.verified === !1 && /* @__PURE__ */ i.createElement("span", { className: "hl-chip hl-chip-warn" }, "Phân lớp đề xuất")), _l.length > 0 && /* @__PURE__ */ i.createElement("p", { className: "hl-chem" }, "Hóa chất: ", _l.map((Gl) => Gl.name).join(", "))), /* @__PURE__ */ i.createElement("div", { className: "hl-row-actions" }, J && /* @__PURE__ */ i.createElement("button", { type: "button", className: "hl-btn hl-btn-ghost hl-btn-sm", onClick: () => X(J) }, "Học tiếp"), /* @__PURE__ */ i.createElement("button", { type: "button", className: "hl-btn hl-btn-primary hl-btn-sm", onClick: () => o(x), "aria-label": `Bắt đầu: ${x.title}` }, "Bắt đầu"))));
  })) : /* @__PURE__ */ i.createElement(
    bf,
    {
      title: "Không tìm thấy thí nghiệm phù hợp",
      text: "Thử từ khóa khác, ví dụ tên một hóa chất như “NaOH” hoặc “bạc”.",
      action: /* @__PURE__ */ i.createElement("button", { type: "button", className: "hl-btn hl-btn-primary", onClick: pl }, "Xóa bộ lọc")
    }
  ));
}
function kd({ saved: r, onOpenSaved: N }) {
  return /* @__PURE__ */ i.createElement("div", { className: "hl-page" }, /* @__PURE__ */ i.createElement("header", { className: "hl-page-head" }, /* @__PURE__ */ i.createElement("h1", null, "Lịch sử học"), /* @__PURE__ */ i.createElement("p", null, "Các phiên thực hành bạn đã lưu. Dữ liệu chỉ nằm trên trình duyệt này; lưu trên máy chủ và hội thoại EGAD đầy đủ sẽ có khi máy chủ hỗ trợ phiên học.")), r.length ? /* @__PURE__ */ i.createElement("ul", { className: "hl-rows" }, r.map((M, o) => /* @__PURE__ */ i.createElement("li", { key: o }, /* @__PURE__ */ i.createElement("article", { className: "hl-row hl-history-row" }, /* @__PURE__ */ i.createElement("div", { className: "hl-row-body" }, /* @__PURE__ */ i.createElement("h3", null, M.name), /* @__PURE__ */ i.createElement("p", { className: "hl-muted" }, M.date), /* @__PURE__ */ i.createElement("div", { className: "hl-tags" }, /* @__PURE__ */ i.createElement("span", { className: "hl-chip" }, Zu(M)), /* @__PURE__ */ i.createElement("span", { className: "hl-chip hl-chip-quiet" }, Vu))), /* @__PURE__ */ i.createElement("div", { className: "hl-row-actions" }, /* @__PURE__ */ i.createElement("button", { type: "button", className: "hl-btn hl-btn-primary hl-btn-sm", onClick: () => N(M) }, "Xem lại")))))) : /* @__PURE__ */ i.createElement(
    bf,
    {
      title: "Chưa có lịch sử học",
      text: "Lịch sử xuất hiện khi bạn bấm “Lưu” trong lúc thực hành.",
      action: /* @__PURE__ */ i.createElement("a", { className: "hl-btn hl-btn-primary", href: vl.experiments }, "Chọn thí nghiệm đầu tiên")
    }
  ));
}
function wd({ mode: r }) {
  const N = r === "register" ? "Đăng ký tài khoản" : "Đăng nhập";
  return /* @__PURE__ */ i.createElement("div", { className: "hl-auth" }, /* @__PURE__ */ i.createElement("section", { className: "hl-panel hl-auth-card", "aria-labelledby": "hl-auth-title" }, /* @__PURE__ */ i.createElement("span", { className: "hl-feature-icon hl-tint-3" }, /* @__PURE__ */ i.createElement(Bd, { size: 28 })), /* @__PURE__ */ i.createElement("h1", { id: "hl-auth-title" }, N), /* @__PURE__ */ i.createElement("p", null, "Tài khoản chưa được kích hoạt trên máy chủ này, nên chưa thể ", r === "register" ? "đăng ký" : "đăng nhập", "."), /* @__PURE__ */ i.createElement("p", { className: "hl-muted" }, "Bạn vẫn dùng được mọi thí nghiệm mà không cần tài khoản. Phiên đã lưu nằm trong trình duyệt của bạn."), /* @__PURE__ */ i.createElement("a", { className: "hl-btn hl-btn-primary", href: vl.overview }, "Vào khu học tập")));
}
function Fd({ lesson: r, index: N = 0, onClose: M, onStart: o }) {
  return /* @__PURE__ */ i.createElement("div", { className: "preview-scrim", onClick: (X) => {
    X.target === X.currentTarget && M();
  } }, /* @__PURE__ */ i.createElement("section", { role: "dialog", "aria-modal": "true", "aria-label": "Xem trước thí nghiệm" }, /* @__PURE__ */ i.createElement("button", { type: "button", className: "preview-close", onClick: M }, "Đóng"), /* @__PURE__ */ i.createElement("div", { className: "hl-preview-head" }, /* @__PURE__ */ i.createElement(gf, { index: N }), /* @__PURE__ */ i.createElement("div", null, /* @__PURE__ */ i.createElement("p", { className: "hl-eyebrow" }, "Lớp ", r.grade, " · ", r.topic), /* @__PURE__ */ i.createElement("h2", null, r.title))), /* @__PURE__ */ i.createElement("h3", null, "Mục tiêu"), /* @__PURE__ */ i.createElement("p", null, r.objective), /* @__PURE__ */ i.createElement("h3", null, "Các bước"), /* @__PURE__ */ i.createElement("ol", null, r.steps.map((X, R) => /* @__PURE__ */ i.createElement("li", { key: R }, X.replaceAll("Gắp", "Nhấc").replaceAll("thả tay", "thả chuột")))), /* @__PURE__ */ i.createElement("button", { type: "button", className: "primary hl-btn hl-btn-primary hl-btn-lg", onClick: o }, "Bắt đầu thực hành")));
}
const Yr = "hololab-saved-v38", Wd = { intro: "Giới thiệu", login: "Đăng nhập", register: "Đăng ký", overview: "Tổng quan", experiments: "Thư viện thí nghiệm", history: "Lịch sử học" }, Da = (r) => {
  location.hash !== r && (location.hash = r);
};
function $d() {
  const [r, N] = fl.useState(location.hash);
  return fl.useEffect(() => {
    const M = () => N(location.hash);
    return addEventListener("hashchange", M), () => removeEventListener("hashchange", M);
  }, []), r;
}
function Id({ api: r }) {
  const N = new URLSearchParams(location.search).has("test"), M = $d(), o = zd(M), X = o.name === "practice" || N && !M, [R, k] = fl.useState(null), [yl, U] = fl.useState("move"), [z, j] = fl.useState(""), [q, tl] = fl.useState(""), [Ml, Nl] = fl.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(Yr) || "[]");
    } catch {
      return [];
    }
  }), gl = fl.useRef(null), kl = fl.useRef(null), Rl = fl.useRef(document.title), Il = r.lessons.filter((Y) => Y.status === "ready"), pl = () => {
    r.release(), Da(vl.experiments);
  };
  fl.useEffect(() => {
    const Y = document.getElementById("sidebar-toggle"), Fl = Y.onclick;
    return Y.onclick = pl, () => {
      Y.onclick = Fl;
    };
  }, []), fl.useEffect(() => {
    if (o.name !== "practice") {
      r.release();
      return;
    }
    const Y = o.id;
    if (gl.current !== Y) {
      if (Y === "session") {
        Da(vl.history);
        return;
      }
      if (Y === "free") {
        r.free(), gl.current = Y;
        return;
      }
      if (Il.some((Fl) => Fl.id === Y)) {
        r.start(Y), gl.current = Y;
        return;
      }
      tl(`Không tìm thấy bài thực hành “${Y}”. Hãy chọn một bài trong thư viện.`), Da(vl.experiments);
    }
  }, [o.name, o.id]), fl.useEffect(() => {
    kl.current && (kl.current.scrollTop = 0), document.title = X ? Rl.current : `${Wd[o.name] || "HoloLab"} · HoloLab`, o.name !== "experiments" && tl("");
  }, [o.name, X]);
  const Kl = (Y) => {
    r.setMode(Y), U(Y);
  }, x = (Y) => {
    r.start(Y), gl.current = Y, k(null), Da(vl.practice(Y));
  }, zl = () => {
    r.free(), gl.current = "free", Da(vl.practice("free"));
  }, J = () => {
    try {
      const Y = [{ name: r.title(), date: (/* @__PURE__ */ new Date()).toLocaleString("vi-VN"), data: r.snapshot() }, ...Ml].slice(0, 12);
      localStorage.setItem(Yr, JSON.stringify(Y)), Nl(Y), j("Đã lưu trên trình duyệt này.");
    } catch (Y) {
      j("Không lưu được: " + Y.message);
    }
  }, _l = async (Y) => {
    try {
      await Y();
    } catch (Fl) {
      j(Fl.message);
    }
  }, Gl = (Y) => _l(async () => {
    await r.restore(Y.data), gl.current = "session", Da(vl.practice("session"));
  }), le = () => document.getElementById("mouse-help").showModal();
  let wl = null;
  return o.name === "overview" && (wl = /* @__PURE__ */ i.createElement(Kd, { lessons: r.lessons, saved: Ml, onOpenSaved: Gl })), o.name === "experiments" && (wl = /* @__PURE__ */ i.createElement(Jd, { lessons: r.lessons, stocks: r.stocks || [], saved: Ml, onPreview: k, onOpenSaved: Gl, onFree: zl, notice: q })), o.name === "history" && (wl = /* @__PURE__ */ i.createElement(kd, { saved: Ml, onOpenSaved: Gl })), /* @__PURE__ */ i.createElement(i.Fragment, null, /* @__PURE__ */ i.createElement("nav", { className: "lab-mouse-toolbar", "aria-label": "Điều khiển bằng chuột" }, /* @__PURE__ */ i.createElement("button", { onClick: pl }, "‹ Thư viện"), /* @__PURE__ */ i.createElement("div", { className: "mode-switch" }, [["move", "Di chuyển"], ["rotate", "Nghiêng / rót"], ["depth", "Gần / xa"]].map(([Y, Fl]) => /* @__PURE__ */ i.createElement("button", { key: Y, "aria-pressed": yl === Y, onClick: () => Kl(Y) }, Fl))), /* @__PURE__ */ i.createElement("button", { onClick: () => r.upright() }, "Dựng thẳng"), /* @__PURE__ */ i.createElement("button", { onClick: () => {
    const Y = document.getElementById("learning-panel");
    Y.open = !0, Y.scrollIntoView({ behavior: "smooth", block: "start" });
  } }, "EGAD · Giải thích"), /* @__PURE__ */ i.createElement("button", { onClick: J }, "Lưu"), /* @__PURE__ */ i.createElement("button", { onClick: () => _l(r.undo) }, "Hoàn tác"), /* @__PURE__ */ i.createElement("button", { onClick: () => _l(r.redo) }, "Làm lại"), /* @__PURE__ */ i.createElement("button", { onClick: () => r.reset() }, "Bắt đầu lại"), /* @__PURE__ */ i.createElement("button", { onClick: () => r.remove() }, "Xóa vật"), /* @__PURE__ */ i.createElement("button", { onClick: () => document.getElementById("mouse-help").showModal() }, "?")), /* @__PURE__ */ i.createElement("div", { className: "mouse-hint" }, yl === "move" ? "Giữ chuột trái trên bình để kéo · Thả chuột: bình rơi" : yl === "rotate" ? "Giữ chuột và kéo ngang để nghiêng bình · Kéo dọc để xoay trước/sau" : "Giữ chuột và kéo lên/xuống để đổi chiều sâu", " · Chuột phải + kéo: nghiêng nhanh"), z && /* @__PURE__ */ i.createElement("div", { className: "mouse-notice", role: "status", onClick: () => j("") }, z, " ×"), /* @__PURE__ */ i.createElement("dialog", { id: "mouse-help" }, /* @__PURE__ */ i.createElement("h2", null, "Thực hành bằng chuột"), /* @__PURE__ */ i.createElement("p", null, "Chọn bài → chọn chế độ → giữ chuột trên dụng cụ."), /* @__PURE__ */ i.createElement("ul", null, /* @__PURE__ */ i.createElement("li", null, "Di chuyển: kéo bình đến vị trí mong muốn."), /* @__PURE__ */ i.createElement("li", null, "Nghiêng / rót: kéo ngang khoảng 350 px để dốc ngược. Giữ chuột để tiếp tục rót."), /* @__PURE__ */ i.createElement("li", null, "Gần / xa: kéo dọc để căn miệng bình theo chiều sâu."), /* @__PURE__ */ i.createElement("li", null, "Chỉ rót vào bình nhận khi dòng chảy đi qua miệng bình; lệch miệng sẽ đổ ra bàn."), /* @__PURE__ */ i.createElement("li", null, "Thả chuột trả vật về hệ vật lý. Camera không cần bật."), /* @__PURE__ */ i.createElement("li", null, "Lưu giữ phiên trong trình duyệt; xuất JSON trong bảng công cụ để chuyển máy.")), /* @__PURE__ */ i.createElement("button", { onClick: () => document.getElementById("mouse-help").close() }, "Đã hiểu")), !X && /* @__PURE__ */ i.createElement("div", { className: "hl-app", ref: kl }, /* @__PURE__ */ i.createElement(Gd, { route: o }), o.name === "intro" && /* @__PURE__ */ i.createElement(Qd, { lessonCount: Il.length, onHelp: le }), (o.name === "login" || o.name === "register") && /* @__PURE__ */ i.createElement(wd, { mode: o.name }), Td(o) && /* @__PURE__ */ i.createElement(Ld, { route: o }, wl)), R && /* @__PURE__ */ i.createElement(Fd, { lesson: R, index: Il.indexOf(R), onClose: () => k(null), onStart: () => x(R.id) }));
}
function Pd(r) {
  const N = document.createElement("div");
  N.id = "mouse-shell", document.querySelector("main").prepend(N), pd.createRoot(N).render(/* @__PURE__ */ i.createElement(Id, { api: r })), document.body.classList.add("mouse-first", "sidebar-closed");
}
export {
  Pd as initMouseShell
};
