import Kt, { Fragment as Bt, useState as ht, useRef as qt, useEffect as Me } from "react";
import { createRoot as Gt } from "react-dom/client";
var oe = { exports: {} }, K = {};
var We;
function Xt() {
  if (We) return K;
  We = 1;
  var e = /* @__PURE__ */ Symbol.for("react.transitional.element"), t = /* @__PURE__ */ Symbol.for("react.fragment");
  function n(r, o, i) {
    var s = null;
    if (i !== void 0 && (s = "" + i), o.key !== void 0 && (s = "" + o.key), "key" in o) {
      i = {};
      for (var c in o)
        c !== "key" && (i[c] = o[c]);
    } else i = o;
    return o = i.ref, {
      $$typeof: e,
      type: r,
      key: s,
      ref: o !== void 0 ? o : null,
      props: i
    };
  }
  return K.Fragment = t, K.jsx = n, K.jsxs = n, K;
}
var B = {}, Ve;
function Ht() {
  if (Ve) return B;
  Ve = 1;
  var e = {};
  return e.NODE_ENV !== "production" && (function() {
    function t(l) {
      if (l == null) return null;
      if (typeof l == "function")
        return l.$$typeof === Wt ? null : l.displayName || l.name || null;
      if (typeof l == "string") return l;
      switch (l) {
        case U:
          return "Fragment";
        case A:
          return "Profiler";
        case ge:
          return "StrictMode";
        case ne:
          return "Suspense";
        case ve:
          return "SuspenseList";
        case Mt:
          return "Activity";
      }
      if (typeof l == "object")
        switch (typeof l.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), l.$$typeof) {
          case Z:
            return "Portal";
          case O:
            return l.displayName || "Context";
          case b:
            return (l._context.displayName || "Context") + ".Consumer";
          case te:
            var g = l.render;
            return l = l.displayName, l || (l = g.displayName || g.name || "", l = l !== "" ? "ForwardRef(" + l + ")" : "ForwardRef"), l;
          case Lt:
            return g = l.displayName || null, g !== null ? g : t(l.type) || "Memo";
          case we:
            g = l._payload, l = l._init;
            try {
              return t(l(g));
            } catch {
            }
        }
      return null;
    }
    function n(l) {
      return "" + l;
    }
    function r(l) {
      try {
        n(l);
        var g = !1;
      } catch {
        g = !0;
      }
      if (g) {
        g = console;
        var $ = g.error, S = typeof Symbol == "function" && Symbol.toStringTag && l[Symbol.toStringTag] || l.constructor.name || "Object";
        return $.call(
          g,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          S
        ), n(l);
      }
    }
    function o(l) {
      if (l === U) return "<>";
      if (typeof l == "object" && l !== null && l.$$typeof === we)
        return "<...>";
      try {
        var g = t(l);
        return g ? "<" + g + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function i() {
      var l = ye.A;
      return l === null ? null : l.getOwner();
    }
    function s() {
      return Error("react-stack-top-frame");
    }
    function c(l) {
      if (De.call(l, "key")) {
        var g = Object.getOwnPropertyDescriptor(l, "key").get;
        if (g && g.isReactWarning) return !1;
      }
      return l.key !== void 0;
    }
    function a(l, g) {
      function $() {
        xe || (xe = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          g
        ));
      }
      $.isReactWarning = !0, Object.defineProperty(l, "key", {
        get: $,
        configurable: !0
      });
    }
    function f() {
      var l = t(this.type);
      return Ue[l] || (Ue[l] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), l = this.props.ref, l !== void 0 ? l : null;
    }
    function d(l, g, $, S, re, ze) {
      var E = $.ref;
      return l = {
        $$typeof: N,
        type: l,
        key: g,
        props: $,
        _owner: S
      }, (E !== void 0 ? E : null) !== null ? Object.defineProperty(l, "ref", {
        enumerable: !1,
        get: f
      }) : Object.defineProperty(l, "ref", { enumerable: !1, value: null }), l._store = {}, Object.defineProperty(l._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(l, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(l, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: re
      }), Object.defineProperty(l, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: ze
      }), Object.freeze && (Object.freeze(l.props), Object.freeze(l)), l;
    }
    function _(l, g, $, S, re, ze) {
      var E = g.children;
      if (E !== void 0)
        if (S)
          if (Vt(E)) {
            for (S = 0; S < E.length; S++)
              m(E[S]);
            Object.freeze && Object.freeze(E);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else m(E);
      if (De.call(g, "key")) {
        E = t(l);
        var M = Object.keys(g).filter(function(Yt) {
          return Yt !== "key";
        });
        S = 0 < M.length ? "{key: someKey, " + M.join(": ..., ") + ": ...}" : "{key: someKey}", Le[E + S] || (M = 0 < M.length ? "{" + M.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          S,
          E,
          M,
          E
        ), Le[E + S] = !0);
      }
      if (E = null, $ !== void 0 && (r($), E = "" + $), c(g) && (r(g.key), E = "" + g.key), "key" in g) {
        $ = {};
        for (var ke in g)
          ke !== "key" && ($[ke] = g[ke]);
      } else $ = g;
      return E && a(
        $,
        typeof l == "function" ? l.displayName || l.name || "Unknown" : l
      ), d(
        l,
        E,
        $,
        i(),
        re,
        ze
      );
    }
    function m(l) {
      p(l) ? l._store && (l._store.validated = 1) : typeof l == "object" && l !== null && l.$$typeof === we && (l._payload.status === "fulfilled" ? p(l._payload.value) && l._payload.value._store && (l._payload.value._store.validated = 1) : l._store && (l._store.validated = 1));
    }
    function p(l) {
      return typeof l == "object" && l !== null && l.$$typeof === N;
    }
    var v = Kt, N = /* @__PURE__ */ Symbol.for("react.transitional.element"), Z = /* @__PURE__ */ Symbol.for("react.portal"), U = /* @__PURE__ */ Symbol.for("react.fragment"), ge = /* @__PURE__ */ Symbol.for("react.strict_mode"), A = /* @__PURE__ */ Symbol.for("react.profiler"), b = /* @__PURE__ */ Symbol.for("react.consumer"), O = /* @__PURE__ */ Symbol.for("react.context"), te = /* @__PURE__ */ Symbol.for("react.forward_ref"), ne = /* @__PURE__ */ Symbol.for("react.suspense"), ve = /* @__PURE__ */ Symbol.for("react.suspense_list"), Lt = /* @__PURE__ */ Symbol.for("react.memo"), we = /* @__PURE__ */ Symbol.for("react.lazy"), Mt = /* @__PURE__ */ Symbol.for("react.activity"), Wt = /* @__PURE__ */ Symbol.for("react.client.reference"), ye = v.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, De = Object.prototype.hasOwnProperty, Vt = Array.isArray, be = console.createTask ? console.createTask : function() {
      return null;
    };
    v = {
      react_stack_bottom_frame: function(l) {
        return l();
      }
    };
    var xe, Ue = {}, Fe = v.react_stack_bottom_frame.bind(
      v,
      s
    )(), Je = be(o(s)), Le = {};
    B.Fragment = U, B.jsx = function(l, g, $) {
      var S = 1e4 > ye.recentlyCreatedOwnerStacks++;
      return _(
        l,
        g,
        $,
        !1,
        S ? Error("react-stack-top-frame") : Fe,
        S ? be(o(l)) : Je
      );
    }, B.jsxs = function(l, g, $) {
      var S = 1e4 > ye.recentlyCreatedOwnerStacks++;
      return _(
        l,
        g,
        $,
        !0,
        S ? Error("react-stack-top-frame") : Fe,
        S ? be(o(l)) : Je
      );
    };
  })(), B;
}
var Ye;
function Qt() {
  if (Ye) return oe.exports;
  Ye = 1;
  var e = {};
  return e.NODE_ENV === "production" ? oe.exports = Xt() : oe.exports = Ht(), oe.exports;
}
var y = Qt(), Ke;
function u(e, t, n) {
  function r(c, a) {
    if (c._zod || Object.defineProperty(c, "_zod", {
      value: {
        def: a,
        constr: s,
        traits: /* @__PURE__ */ new Set()
      },
      enumerable: !1
    }), c._zod.traits.has(e))
      return;
    c._zod.traits.add(e), t(c, a);
    const f = s.prototype, d = Object.keys(f);
    for (let _ = 0; _ < d.length; _++) {
      const m = d[_];
      m in c || (c[m] = f[m].bind(c));
    }
  }
  const o = n?.Parent ?? Object;
  class i extends o {
  }
  Object.defineProperty(i, "name", { value: e });
  function s(c) {
    var a;
    const f = n?.Parent ? new i() : this;
    r(f, c), (a = f._zod).deferred ?? (a.deferred = []);
    for (const d of f._zod.deferred)
      d();
    return f;
  }
  return Object.defineProperty(s, "init", { value: r }), Object.defineProperty(s, Symbol.hasInstance, {
    value: (c) => n?.Parent && c instanceof n.Parent ? !0 : c?._zod?.traits?.has(e)
  }), Object.defineProperty(s, "name", { value: e }), s;
}
class V extends Error {
  constructor() {
    super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
  }
}
class mt extends Error {
  constructor(t) {
    super(`Encountered unidirectional transform during encode: ${t}`), this.name = "ZodEncodeError";
  }
}
(Ke = globalThis).__zod_globalConfig ?? (Ke.__zod_globalConfig = {});
const Te = globalThis.__zod_globalConfig;
function F(e) {
  return Te;
}
function _t(e) {
  const t = Object.values(e).filter((r) => typeof r == "number");
  return Object.entries(e).filter(([r, o]) => t.indexOf(+r) === -1).map(([r, o]) => o);
}
function Ze(e, t) {
  return typeof t == "bigint" ? t.toString() : t;
}
function Pe(e) {
  return {
    get value() {
      {
        const t = e();
        return Object.defineProperty(this, "value", { value: t }), t;
      }
    }
  };
}
function je(e) {
  return e == null;
}
function Re(e) {
  const t = e.startsWith("^") ? 1 : 0, n = e.endsWith("$") ? e.length - 1 : e.length;
  return e.slice(t, n);
}
const Be = /* @__PURE__ */ Symbol("evaluating");
function w(e, t, n) {
  let r;
  Object.defineProperty(e, t, {
    get() {
      if (r !== Be)
        return r === void 0 && (r = Be, r = n()), r;
    },
    set(o) {
      Object.defineProperty(e, t, {
        value: o
        // configurable: true,
      });
    },
    configurable: !0
  });
}
function L(e, t, n) {
  Object.defineProperty(e, t, {
    value: n,
    writable: !0,
    enumerable: !0,
    configurable: !0
  });
}
function D(...e) {
  const t = {};
  for (const n of e) {
    const r = Object.getOwnPropertyDescriptors(n);
    Object.assign(t, r);
  }
  return Object.defineProperties({}, t);
}
function qe(e) {
  return JSON.stringify(e);
}
function en(e) {
  return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
const gt = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {
};
function ae(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
const tn = /* @__PURE__ */ Pe(() => {
  if (Te.jitless || typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare"))
    return !1;
  try {
    const e = Function;
    return new e(""), !0;
  } catch {
    return !1;
  }
});
function H(e) {
  if (ae(e) === !1)
    return !1;
  const t = e.constructor;
  if (t === void 0 || typeof t != "function")
    return !0;
  const n = t.prototype;
  return !(ae(n) === !1 || Object.prototype.hasOwnProperty.call(n, "isPrototypeOf") === !1);
}
function vt(e) {
  return H(e) ? { ...e } : Array.isArray(e) ? [...e] : e instanceof Map ? new Map(e) : e instanceof Set ? new Set(e) : e;
}
const nn = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
function de(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function x(e, t, n) {
  const r = new e._zod.constr(t ?? e._zod.def);
  return (!t || n?.parent) && (r._zod.parent = e), r;
}
function h(e) {
  const t = e;
  if (!t)
    return {};
  if (typeof t == "string")
    return { error: () => t };
  if (t?.message !== void 0) {
    if (t?.error !== void 0)
      throw new Error("Cannot specify both `message` and `error` params");
    t.error = t.message;
  }
  return delete t.message, typeof t.error == "string" ? { ...t, error: () => t.error } : t;
}
function rn(e) {
  return Object.keys(e).filter((t) => e[t]._zod.optin === "optional" && e[t]._zod.optout === "optional");
}
function on(e, t) {
  const n = e._zod.def, r = n.checks;
  if (r && r.length > 0)
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  const i = D(e._zod.def, {
    get shape() {
      const s = {};
      for (const c in t) {
        if (!(c in n.shape))
          throw new Error(`Unrecognized key: "${c}"`);
        t[c] && (s[c] = n.shape[c]);
      }
      return L(this, "shape", s), s;
    },
    checks: []
  });
  return x(e, i);
}
function sn(e, t) {
  const n = e._zod.def, r = n.checks;
  if (r && r.length > 0)
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  const i = D(e._zod.def, {
    get shape() {
      const s = { ...e._zod.def.shape };
      for (const c in t) {
        if (!(c in n.shape))
          throw new Error(`Unrecognized key: "${c}"`);
        t[c] && delete s[c];
      }
      return L(this, "shape", s), s;
    },
    checks: []
  });
  return x(e, i);
}
function cn(e, t) {
  if (!H(t))
    throw new Error("Invalid input to extend: expected a plain object");
  const n = e._zod.def.checks;
  if (n && n.length > 0) {
    const i = e._zod.def.shape;
    for (const s in t)
      if (Object.getOwnPropertyDescriptor(i, s) !== void 0)
        throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
  }
  const o = D(e._zod.def, {
    get shape() {
      const i = { ...e._zod.def.shape, ...t };
      return L(this, "shape", i), i;
    }
  });
  return x(e, o);
}
function an(e, t) {
  if (!H(t))
    throw new Error("Invalid input to safeExtend: expected a plain object");
  const n = D(e._zod.def, {
    get shape() {
      const r = { ...e._zod.def.shape, ...t };
      return L(this, "shape", r), r;
    }
  });
  return x(e, n);
}
function un(e, t) {
  if (e._zod.def.checks?.length)
    throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
  const n = D(e._zod.def, {
    get shape() {
      const r = { ...e._zod.def.shape, ...t._zod.def.shape };
      return L(this, "shape", r), r;
    },
    get catchall() {
      return t._zod.def.catchall;
    },
    checks: t._zod.def.checks ?? []
  });
  return x(e, n);
}
function fn(e, t, n) {
  const o = t._zod.def.checks;
  if (o && o.length > 0)
    throw new Error(".partial() cannot be used on object schemas containing refinements");
  const s = D(t._zod.def, {
    get shape() {
      const c = t._zod.def.shape, a = { ...c };
      if (n)
        for (const f in n) {
          if (!(f in c))
            throw new Error(`Unrecognized key: "${f}"`);
          n[f] && (a[f] = e ? new e({
            type: "optional",
            innerType: c[f]
          }) : c[f]);
        }
      else
        for (const f in c)
          a[f] = e ? new e({
            type: "optional",
            innerType: c[f]
          }) : c[f];
      return L(this, "shape", a), a;
    },
    checks: []
  });
  return x(t, s);
}
function ln(e, t, n) {
  const r = D(t._zod.def, {
    get shape() {
      const o = t._zod.def.shape, i = { ...o };
      if (n)
        for (const s in n) {
          if (!(s in i))
            throw new Error(`Unrecognized key: "${s}"`);
          n[s] && (i[s] = new e({
            type: "nonoptional",
            innerType: o[s]
          }));
        }
      else
        for (const s in o)
          i[s] = new e({
            type: "nonoptional",
            innerType: o[s]
          });
      return L(this, "shape", i), i;
    }
  });
  return x(t, r);
}
function W(e, t = 0) {
  if (e.aborted === !0)
    return !0;
  for (let n = t; n < e.issues.length; n++)
    if (e.issues[n]?.continue !== !0)
      return !0;
  return !1;
}
function dn(e, t = 0) {
  if (e.aborted === !0)
    return !0;
  for (let n = t; n < e.issues.length; n++)
    if (e.issues[n]?.continue === !1)
      return !0;
  return !1;
}
function wt(e, t) {
  return t.map((n) => {
    var r;
    return (r = n).path ?? (r.path = []), n.path.unshift(e), n;
  });
}
function se(e) {
  return typeof e == "string" ? e : e?.message;
}
function J(e, t, n) {
  const r = e.message ? e.message : se(e.inst?._zod.def?.error?.(e)) ?? se(t?.error?.(e)) ?? se(n.customError?.(e)) ?? se(n.localeError?.(e)) ?? "Invalid input", { inst: o, continue: i, input: s, ...c } = e;
  return c.path ?? (c.path = []), c.message = r, t?.reportInput && (c.input = s), c;
}
function Ae(e) {
  return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function Q(...e) {
  const [t, n, r] = e;
  return typeof t == "string" ? {
    message: t,
    code: "custom",
    input: n,
    inst: r
  } : { ...t };
}
const yt = (e, t) => {
  e.name = "$ZodError", Object.defineProperty(e, "_zod", {
    value: e._zod,
    enumerable: !1
  }), Object.defineProperty(e, "issues", {
    value: t,
    enumerable: !1
  }), e.message = JSON.stringify(t, Ze, 2), Object.defineProperty(e, "toString", {
    value: () => e.message,
    enumerable: !1
  });
}, bt = u("$ZodError", yt), zt = u("$ZodError", yt, { Parent: Error });
function pn(e, t = (n) => n.message) {
  const n = {}, r = [];
  for (const o of e.issues)
    o.path.length > 0 ? (n[o.path[0]] = n[o.path[0]] || [], n[o.path[0]].push(t(o))) : r.push(t(o));
  return { formErrors: r, fieldErrors: n };
}
function hn(e, t = (n) => n.message) {
  const n = { _errors: [] }, r = (o, i = []) => {
    for (const s of o.issues)
      if (s.code === "invalid_union" && s.errors.length)
        s.errors.map((c) => r({ issues: c }, [...i, ...s.path]));
      else if (s.code === "invalid_key")
        r({ issues: s.issues }, [...i, ...s.path]);
      else if (s.code === "invalid_element")
        r({ issues: s.issues }, [...i, ...s.path]);
      else {
        const c = [...i, ...s.path];
        if (c.length === 0)
          n._errors.push(t(s));
        else {
          let a = n, f = 0;
          for (; f < c.length; ) {
            const d = c[f];
            f === c.length - 1 ? (a[d] = a[d] || { _errors: [] }, a[d]._errors.push(t(s))) : a[d] = a[d] || { _errors: [] }, a = a[d], f++;
          }
        }
      }
  };
  return r(e), n;
}
const Ie = (e) => (t, n, r, o) => {
  const i = r ? { ...r, async: !1 } : { async: !1 }, s = t._zod.run({ value: n, issues: [] }, i);
  if (s instanceof Promise)
    throw new V();
  if (s.issues.length) {
    const c = new (o?.Err ?? e)(s.issues.map((a) => J(a, i, F())));
    throw gt(c, o?.callee), c;
  }
  return s.value;
}, Ce = (e) => async (t, n, r, o) => {
  const i = r ? { ...r, async: !0 } : { async: !0 };
  let s = t._zod.run({ value: n, issues: [] }, i);
  if (s instanceof Promise && (s = await s), s.issues.length) {
    const c = new (o?.Err ?? e)(s.issues.map((a) => J(a, i, F())));
    throw gt(c, o?.callee), c;
  }
  return s.value;
}, pe = (e) => (t, n, r) => {
  const o = r ? { ...r, async: !1 } : { async: !1 }, i = t._zod.run({ value: n, issues: [] }, o);
  if (i instanceof Promise)
    throw new V();
  return i.issues.length ? {
    success: !1,
    error: new (e ?? bt)(i.issues.map((s) => J(s, o, F())))
  } : { success: !0, data: i.value };
}, mn = /* @__PURE__ */ pe(zt), he = (e) => async (t, n, r) => {
  const o = r ? { ...r, async: !0 } : { async: !0 };
  let i = t._zod.run({ value: n, issues: [] }, o);
  return i instanceof Promise && (i = await i), i.issues.length ? {
    success: !1,
    error: new e(i.issues.map((s) => J(s, o, F())))
  } : { success: !0, data: i.value };
}, _n = /* @__PURE__ */ he(zt), gn = (e) => (t, n, r) => {
  const o = r ? { ...r, direction: "backward" } : { direction: "backward" };
  return Ie(e)(t, n, o);
}, vn = (e) => (t, n, r) => Ie(e)(t, n, r), wn = (e) => async (t, n, r) => {
  const o = r ? { ...r, direction: "backward" } : { direction: "backward" };
  return Ce(e)(t, n, o);
}, yn = (e) => async (t, n, r) => Ce(e)(t, n, r), bn = (e) => (t, n, r) => {
  const o = r ? { ...r, direction: "backward" } : { direction: "backward" };
  return pe(e)(t, n, o);
}, zn = (e) => (t, n, r) => pe(e)(t, n, r), kn = (e) => async (t, n, r) => {
  const o = r ? { ...r, direction: "backward" } : { direction: "backward" };
  return he(e)(t, n, o);
}, $n = (e) => async (t, n, r) => he(e)(t, n, r), Zn = /^[cC][0-9a-z]{6,}$/, On = /^[0-9a-z]+$/, Sn = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, En = /^[0-9a-vA-V]{20}$/, Tn = /^[A-Za-z0-9]{27}$/, Pn = /^[a-zA-Z0-9_-]{21}$/, jn = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, Rn = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, Ge = (e) => e ? new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, An = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, In = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
function Cn() {
  return new RegExp(In, "u");
}
const Nn = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Dn = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, xn = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, Un = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Fn = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, kt = /^[A-Za-z0-9_-]*$/, Jn = /^https?$/, Ln = /^\+[1-9]\d{6,14}$/, $t = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", Mn = /* @__PURE__ */ new RegExp(`^${$t}$`);
function Zt(e) {
  const t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
  return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function Wn(e) {
  return new RegExp(`^${Zt(e)}$`);
}
function Vn(e) {
  const t = Zt({ precision: e.precision }), n = ["Z"];
  e.local && n.push(""), e.offset && n.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
  const r = `${t}(?:${n.join("|")})`;
  return new RegExp(`^${$t}T(?:${r})$`);
}
const Yn = (e) => {
  const t = e ? `[\\s\\S]{${e?.minimum ?? 0},${e?.maximum ?? ""}}` : "[\\s\\S]*";
  return new RegExp(`^${t}$`);
}, Kn = /^[^A-Z]*$/, Bn = /^[^a-z]*$/, C = /* @__PURE__ */ u("$ZodCheck", (e, t) => {
  var n;
  e._zod ?? (e._zod = {}), e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
}), qn = /* @__PURE__ */ u("$ZodCheckMaxLength", (e, t) => {
  var n;
  C.init(e, t), (n = e._zod.def).when ?? (n.when = (r) => {
    const o = r.value;
    return !je(o) && o.length !== void 0;
  }), e._zod.onattach.push((r) => {
    const o = r._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
    t.maximum < o && (r._zod.bag.maximum = t.maximum);
  }), e._zod.check = (r) => {
    const o = r.value;
    if (o.length <= t.maximum)
      return;
    const s = Ae(o);
    r.issues.push({
      origin: s,
      code: "too_big",
      maximum: t.maximum,
      inclusive: !0,
      input: o,
      inst: e,
      continue: !t.abort
    });
  };
}), Gn = /* @__PURE__ */ u("$ZodCheckMinLength", (e, t) => {
  var n;
  C.init(e, t), (n = e._zod.def).when ?? (n.when = (r) => {
    const o = r.value;
    return !je(o) && o.length !== void 0;
  }), e._zod.onattach.push((r) => {
    const o = r._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
    t.minimum > o && (r._zod.bag.minimum = t.minimum);
  }), e._zod.check = (r) => {
    const o = r.value;
    if (o.length >= t.minimum)
      return;
    const s = Ae(o);
    r.issues.push({
      origin: s,
      code: "too_small",
      minimum: t.minimum,
      inclusive: !0,
      input: o,
      inst: e,
      continue: !t.abort
    });
  };
}), Xn = /* @__PURE__ */ u("$ZodCheckLengthEquals", (e, t) => {
  var n;
  C.init(e, t), (n = e._zod.def).when ?? (n.when = (r) => {
    const o = r.value;
    return !je(o) && o.length !== void 0;
  }), e._zod.onattach.push((r) => {
    const o = r._zod.bag;
    o.minimum = t.length, o.maximum = t.length, o.length = t.length;
  }), e._zod.check = (r) => {
    const o = r.value, i = o.length;
    if (i === t.length)
      return;
    const s = Ae(o), c = i > t.length;
    r.issues.push({
      origin: s,
      ...c ? { code: "too_big", maximum: t.length } : { code: "too_small", minimum: t.length },
      inclusive: !0,
      exact: !0,
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), me = /* @__PURE__ */ u("$ZodCheckStringFormat", (e, t) => {
  var n, r;
  C.init(e, t), e._zod.onattach.push((o) => {
    const i = o._zod.bag;
    i.format = t.format, t.pattern && (i.patterns ?? (i.patterns = /* @__PURE__ */ new Set()), i.patterns.add(t.pattern));
  }), t.pattern ? (n = e._zod).check ?? (n.check = (o) => {
    t.pattern.lastIndex = 0, !t.pattern.test(o.value) && o.issues.push({
      origin: "string",
      code: "invalid_format",
      format: t.format,
      input: o.value,
      ...t.pattern ? { pattern: t.pattern.toString() } : {},
      inst: e,
      continue: !t.abort
    });
  }) : (r = e._zod).check ?? (r.check = () => {
  });
}), Hn = /* @__PURE__ */ u("$ZodCheckRegex", (e, t) => {
  me.init(e, t), e._zod.check = (n) => {
    t.pattern.lastIndex = 0, !t.pattern.test(n.value) && n.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: n.value,
      pattern: t.pattern.toString(),
      inst: e,
      continue: !t.abort
    });
  };
}), Qn = /* @__PURE__ */ u("$ZodCheckLowerCase", (e, t) => {
  t.pattern ?? (t.pattern = Kn), me.init(e, t);
}), er = /* @__PURE__ */ u("$ZodCheckUpperCase", (e, t) => {
  t.pattern ?? (t.pattern = Bn), me.init(e, t);
}), tr = /* @__PURE__ */ u("$ZodCheckIncludes", (e, t) => {
  C.init(e, t);
  const n = de(t.includes), r = new RegExp(typeof t.position == "number" ? `^.{${t.position}}${n}` : n);
  t.pattern = r, e._zod.onattach.push((o) => {
    const i = o._zod.bag;
    i.patterns ?? (i.patterns = /* @__PURE__ */ new Set()), i.patterns.add(r);
  }), e._zod.check = (o) => {
    o.value.includes(t.includes, t.position) || o.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: t.includes,
      input: o.value,
      inst: e,
      continue: !t.abort
    });
  };
}), nr = /* @__PURE__ */ u("$ZodCheckStartsWith", (e, t) => {
  C.init(e, t);
  const n = new RegExp(`^${de(t.prefix)}.*`);
  t.pattern ?? (t.pattern = n), e._zod.onattach.push((r) => {
    const o = r._zod.bag;
    o.patterns ?? (o.patterns = /* @__PURE__ */ new Set()), o.patterns.add(n);
  }), e._zod.check = (r) => {
    r.value.startsWith(t.prefix) || r.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: t.prefix,
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), rr = /* @__PURE__ */ u("$ZodCheckEndsWith", (e, t) => {
  C.init(e, t);
  const n = new RegExp(`.*${de(t.suffix)}$`);
  t.pattern ?? (t.pattern = n), e._zod.onattach.push((r) => {
    const o = r._zod.bag;
    o.patterns ?? (o.patterns = /* @__PURE__ */ new Set()), o.patterns.add(n);
  }), e._zod.check = (r) => {
    r.value.endsWith(t.suffix) || r.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: t.suffix,
      input: r.value,
      inst: e,
      continue: !t.abort
    });
  };
}), or = /* @__PURE__ */ u("$ZodCheckOverwrite", (e, t) => {
  C.init(e, t), e._zod.check = (n) => {
    n.value = t.tx(n.value);
  };
});
class sr {
  constructor(t = []) {
    this.content = [], this.indent = 0, this && (this.args = t);
  }
  indented(t) {
    this.indent += 1, t(this), this.indent -= 1;
  }
  write(t) {
    if (typeof t == "function") {
      t(this, { execution: "sync" }), t(this, { execution: "async" });
      return;
    }
    const r = t.split(`
`).filter((s) => s), o = Math.min(...r.map((s) => s.length - s.trimStart().length)), i = r.map((s) => s.slice(o)).map((s) => " ".repeat(this.indent * 2) + s);
    for (const s of i)
      this.content.push(s);
  }
  compile() {
    const t = Function, n = this?.args, o = [...(this?.content ?? [""]).map((i) => `  ${i}`)];
    return new t(...n, o.join(`
`));
  }
}
const ir = {
  major: 4,
  minor: 4,
  patch: 3
}, T = /* @__PURE__ */ u("$ZodType", (e, t) => {
  var n;
  e ?? (e = {}), e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = ir;
  const r = [...e._zod.def.checks ?? []];
  e._zod.traits.has("$ZodCheck") && r.unshift(e);
  for (const o of r)
    for (const i of o._zod.onattach)
      i(e);
  if (r.length === 0)
    (n = e._zod).deferred ?? (n.deferred = []), e._zod.deferred?.push(() => {
      e._zod.run = e._zod.parse;
    });
  else {
    const o = (s, c, a) => {
      let f = W(s), d;
      for (const _ of c) {
        if (_._zod.def.when) {
          if (dn(s) || !_._zod.def.when(s))
            continue;
        } else if (f)
          continue;
        const m = s.issues.length, p = _._zod.check(s);
        if (p instanceof Promise && a?.async === !1)
          throw new V();
        if (d || p instanceof Promise)
          d = (d ?? Promise.resolve()).then(async () => {
            await p, s.issues.length !== m && (f || (f = W(s, m)));
          });
        else {
          if (s.issues.length === m)
            continue;
          f || (f = W(s, m));
        }
      }
      return d ? d.then(() => s) : s;
    }, i = (s, c, a) => {
      if (W(s))
        return s.aborted = !0, s;
      const f = o(c, r, a);
      if (f instanceof Promise) {
        if (a.async === !1)
          throw new V();
        return f.then((d) => e._zod.parse(d, a));
      }
      return e._zod.parse(f, a);
    };
    e._zod.run = (s, c) => {
      if (c.skipChecks)
        return e._zod.parse(s, c);
      if (c.direction === "backward") {
        const f = e._zod.parse({ value: s.value, issues: [] }, { ...c, skipChecks: !0 });
        return f instanceof Promise ? f.then((d) => i(d, s, c)) : i(f, s, c);
      }
      const a = e._zod.parse(s, c);
      if (a instanceof Promise) {
        if (c.async === !1)
          throw new V();
        return a.then((f) => o(f, r, c));
      }
      return o(a, r, c);
    };
  }
  w(e, "~standard", () => ({
    validate: (o) => {
      try {
        const i = mn(e, o);
        return i.success ? { value: i.data } : { issues: i.error?.issues };
      } catch {
        return _n(e, o).then((s) => s.success ? { value: s.data } : { issues: s.error?.issues });
      }
    },
    vendor: "zod",
    version: 1
  }));
}), Ne = /* @__PURE__ */ u("$ZodString", (e, t) => {
  T.init(e, t), e._zod.pattern = [...e?._zod.bag?.patterns ?? []].pop() ?? Yn(e._zod.bag), e._zod.parse = (n, r) => {
    if (t.coerce)
      try {
        n.value = String(n.value);
      } catch {
      }
    return typeof n.value == "string" || n.issues.push({
      expected: "string",
      code: "invalid_type",
      input: n.value,
      inst: e
    }), n;
  };
}), z = /* @__PURE__ */ u("$ZodStringFormat", (e, t) => {
  me.init(e, t), Ne.init(e, t);
}), cr = /* @__PURE__ */ u("$ZodGUID", (e, t) => {
  t.pattern ?? (t.pattern = Rn), z.init(e, t);
}), ar = /* @__PURE__ */ u("$ZodUUID", (e, t) => {
  if (t.version) {
    const r = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    }[t.version];
    if (r === void 0)
      throw new Error(`Invalid UUID version: "${t.version}"`);
    t.pattern ?? (t.pattern = Ge(r));
  } else
    t.pattern ?? (t.pattern = Ge());
  z.init(e, t);
}), ur = /* @__PURE__ */ u("$ZodEmail", (e, t) => {
  t.pattern ?? (t.pattern = An), z.init(e, t);
}), fr = /* @__PURE__ */ u("$ZodURL", (e, t) => {
  z.init(e, t), e._zod.check = (n) => {
    try {
      const r = n.value.trim();
      if (!t.normalize && t.protocol?.source === Jn.source && !/^https?:\/\//i.test(r)) {
        n.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid URL format",
          input: n.value,
          inst: e,
          continue: !t.abort
        });
        return;
      }
      const o = new URL(r);
      t.hostname && (t.hostname.lastIndex = 0, t.hostname.test(o.hostname) || n.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid hostname",
        pattern: t.hostname.source,
        input: n.value,
        inst: e,
        continue: !t.abort
      })), t.protocol && (t.protocol.lastIndex = 0, t.protocol.test(o.protocol.endsWith(":") ? o.protocol.slice(0, -1) : o.protocol) || n.issues.push({
        code: "invalid_format",
        format: "url",
        note: "Invalid protocol",
        pattern: t.protocol.source,
        input: n.value,
        inst: e,
        continue: !t.abort
      })), t.normalize ? n.value = o.href : n.value = r;
      return;
    } catch {
      n.issues.push({
        code: "invalid_format",
        format: "url",
        input: n.value,
        inst: e,
        continue: !t.abort
      });
    }
  };
}), lr = /* @__PURE__ */ u("$ZodEmoji", (e, t) => {
  t.pattern ?? (t.pattern = Cn()), z.init(e, t);
}), dr = /* @__PURE__ */ u("$ZodNanoID", (e, t) => {
  t.pattern ?? (t.pattern = Pn), z.init(e, t);
}), pr = /* @__PURE__ */ u("$ZodCUID", (e, t) => {
  t.pattern ?? (t.pattern = Zn), z.init(e, t);
}), hr = /* @__PURE__ */ u("$ZodCUID2", (e, t) => {
  t.pattern ?? (t.pattern = On), z.init(e, t);
}), mr = /* @__PURE__ */ u("$ZodULID", (e, t) => {
  t.pattern ?? (t.pattern = Sn), z.init(e, t);
}), _r = /* @__PURE__ */ u("$ZodXID", (e, t) => {
  t.pattern ?? (t.pattern = En), z.init(e, t);
}), gr = /* @__PURE__ */ u("$ZodKSUID", (e, t) => {
  t.pattern ?? (t.pattern = Tn), z.init(e, t);
}), vr = /* @__PURE__ */ u("$ZodISODateTime", (e, t) => {
  t.pattern ?? (t.pattern = Vn(t)), z.init(e, t);
}), wr = /* @__PURE__ */ u("$ZodISODate", (e, t) => {
  t.pattern ?? (t.pattern = Mn), z.init(e, t);
}), yr = /* @__PURE__ */ u("$ZodISOTime", (e, t) => {
  t.pattern ?? (t.pattern = Wn(t)), z.init(e, t);
}), br = /* @__PURE__ */ u("$ZodISODuration", (e, t) => {
  t.pattern ?? (t.pattern = jn), z.init(e, t);
}), zr = /* @__PURE__ */ u("$ZodIPv4", (e, t) => {
  t.pattern ?? (t.pattern = Nn), z.init(e, t), e._zod.bag.format = "ipv4";
}), kr = /* @__PURE__ */ u("$ZodIPv6", (e, t) => {
  t.pattern ?? (t.pattern = Dn), z.init(e, t), e._zod.bag.format = "ipv6", e._zod.check = (n) => {
    try {
      new URL(`http://[${n.value}]`);
    } catch {
      n.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: n.value,
        inst: e,
        continue: !t.abort
      });
    }
  };
}), $r = /* @__PURE__ */ u("$ZodCIDRv4", (e, t) => {
  t.pattern ?? (t.pattern = xn), z.init(e, t);
}), Zr = /* @__PURE__ */ u("$ZodCIDRv6", (e, t) => {
  t.pattern ?? (t.pattern = Un), z.init(e, t), e._zod.check = (n) => {
    const r = n.value.split("/");
    try {
      if (r.length !== 2)
        throw new Error();
      const [o, i] = r;
      if (!i)
        throw new Error();
      const s = Number(i);
      if (`${s}` !== i)
        throw new Error();
      if (s < 0 || s > 128)
        throw new Error();
      new URL(`http://[${o}]`);
    } catch {
      n.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: n.value,
        inst: e,
        continue: !t.abort
      });
    }
  };
});
function Ot(e) {
  if (e === "")
    return !0;
  if (/\s/.test(e) || e.length % 4 !== 0)
    return !1;
  try {
    return atob(e), !0;
  } catch {
    return !1;
  }
}
const Or = /* @__PURE__ */ u("$ZodBase64", (e, t) => {
  t.pattern ?? (t.pattern = Fn), z.init(e, t), e._zod.bag.contentEncoding = "base64", e._zod.check = (n) => {
    Ot(n.value) || n.issues.push({
      code: "invalid_format",
      format: "base64",
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
});
function Sr(e) {
  if (!kt.test(e))
    return !1;
  const t = e.replace(/[-_]/g, (r) => r === "-" ? "+" : "/"), n = t.padEnd(Math.ceil(t.length / 4) * 4, "=");
  return Ot(n);
}
const Er = /* @__PURE__ */ u("$ZodBase64URL", (e, t) => {
  t.pattern ?? (t.pattern = kt), z.init(e, t), e._zod.bag.contentEncoding = "base64url", e._zod.check = (n) => {
    Sr(n.value) || n.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Tr = /* @__PURE__ */ u("$ZodE164", (e, t) => {
  t.pattern ?? (t.pattern = Ln), z.init(e, t);
});
function Pr(e, t = null) {
  try {
    const n = e.split(".");
    if (n.length !== 3)
      return !1;
    const [r] = n;
    if (!r)
      return !1;
    const o = JSON.parse(atob(r));
    return !("typ" in o && o?.typ !== "JWT" || !o.alg || t && (!("alg" in o) || o.alg !== t));
  } catch {
    return !1;
  }
}
const jr = /* @__PURE__ */ u("$ZodJWT", (e, t) => {
  z.init(e, t), e._zod.check = (n) => {
    Pr(n.value, t.alg) || n.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: n.value,
      inst: e,
      continue: !t.abort
    });
  };
}), Rr = /* @__PURE__ */ u("$ZodUnknown", (e, t) => {
  T.init(e, t), e._zod.parse = (n) => n;
}), Ar = /* @__PURE__ */ u("$ZodNever", (e, t) => {
  T.init(e, t), e._zod.parse = (n, r) => (n.issues.push({
    expected: "never",
    code: "invalid_type",
    input: n.value,
    inst: e
  }), n);
});
function Xe(e, t, n) {
  e.issues.length && t.issues.push(...wt(n, e.issues)), t.value[n] = e.value;
}
const Ir = /* @__PURE__ */ u("$ZodArray", (e, t) => {
  T.init(e, t), e._zod.parse = (n, r) => {
    const o = n.value;
    if (!Array.isArray(o))
      return n.issues.push({
        expected: "array",
        code: "invalid_type",
        input: o,
        inst: e
      }), n;
    n.value = Array(o.length);
    const i = [];
    for (let s = 0; s < o.length; s++) {
      const c = o[s], a = t.element._zod.run({
        value: c,
        issues: []
      }, r);
      a instanceof Promise ? i.push(a.then((f) => Xe(f, n, s))) : Xe(a, n, s);
    }
    return i.length ? Promise.all(i).then(() => n) : n;
  };
});
function ue(e, t, n, r, o, i) {
  const s = n in r;
  if (e.issues.length) {
    if (o && i && !s)
      return;
    t.issues.push(...wt(n, e.issues));
  }
  if (!s && !o) {
    e.issues.length || t.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: void 0,
      path: [n]
    });
    return;
  }
  e.value === void 0 ? s && (t.value[n] = void 0) : t.value[n] = e.value;
}
function St(e) {
  const t = Object.keys(e.shape);
  for (const r of t)
    if (!e.shape?.[r]?._zod?.traits?.has("$ZodType"))
      throw new Error(`Invalid element at key "${r}": expected a Zod schema`);
  const n = rn(e.shape);
  return {
    ...e,
    keys: t,
    keySet: new Set(t),
    numKeys: t.length,
    optionalKeys: new Set(n)
  };
}
function Et(e, t, n, r, o, i) {
  const s = [], c = o.keySet, a = o.catchall._zod, f = a.def.type, d = a.optin === "optional", _ = a.optout === "optional";
  for (const m in t) {
    if (m === "__proto__" || c.has(m))
      continue;
    if (f === "never") {
      s.push(m);
      continue;
    }
    const p = a.run({ value: t[m], issues: [] }, r);
    p instanceof Promise ? e.push(p.then((v) => ue(v, n, m, t, d, _))) : ue(p, n, m, t, d, _);
  }
  return s.length && n.issues.push({
    code: "unrecognized_keys",
    keys: s,
    input: t,
    inst: i
  }), e.length ? Promise.all(e).then(() => n) : n;
}
const Cr = /* @__PURE__ */ u("$ZodObject", (e, t) => {
  if (T.init(e, t), !Object.getOwnPropertyDescriptor(t, "shape")?.get) {
    const c = t.shape;
    Object.defineProperty(t, "shape", {
      get: () => {
        const a = { ...c };
        return Object.defineProperty(t, "shape", {
          value: a
        }), a;
      }
    });
  }
  const r = Pe(() => St(t));
  w(e._zod, "propValues", () => {
    const c = t.shape, a = {};
    for (const f in c) {
      const d = c[f]._zod;
      if (d.values) {
        a[f] ?? (a[f] = /* @__PURE__ */ new Set());
        for (const _ of d.values)
          a[f].add(_);
      }
    }
    return a;
  });
  const o = ae, i = t.catchall;
  let s;
  e._zod.parse = (c, a) => {
    s ?? (s = r.value);
    const f = c.value;
    if (!o(f))
      return c.issues.push({
        expected: "object",
        code: "invalid_type",
        input: f,
        inst: e
      }), c;
    c.value = {};
    const d = [], _ = s.shape;
    for (const m of s.keys) {
      const p = _[m], v = p._zod.optin === "optional", N = p._zod.optout === "optional", Z = p._zod.run({ value: f[m], issues: [] }, a);
      Z instanceof Promise ? d.push(Z.then((U) => ue(U, c, m, f, v, N))) : ue(Z, c, m, f, v, N);
    }
    return i ? Et(d, f, c, a, r.value, e) : d.length ? Promise.all(d).then(() => c) : c;
  };
}), Nr = /* @__PURE__ */ u("$ZodObjectJIT", (e, t) => {
  Cr.init(e, t);
  const n = e._zod.parse, r = Pe(() => St(t)), o = (m) => {
    const p = new sr(["shape", "payload", "ctx"]), v = r.value, N = (A) => {
      const b = qe(A);
      return `shape[${b}]._zod.run({ value: input[${b}], issues: [] }, ctx)`;
    };
    p.write("const input = payload.value;");
    const Z = /* @__PURE__ */ Object.create(null);
    let U = 0;
    for (const A of v.keys)
      Z[A] = `key_${U++}`;
    p.write("const newResult = {};");
    for (const A of v.keys) {
      const b = Z[A], O = qe(A), te = m[A], ne = te?._zod?.optin === "optional", ve = te?._zod?.optout === "optional";
      p.write(`const ${b} = ${N(A)};`), ne && ve ? p.write(`
        if (${b}.issues.length) {
          if (${O} in input) {
            payload.issues = payload.issues.concat(${b}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${O}, ...iss.path] : [${O}]
            })));
          }
        }
        
        if (${b}.value === undefined) {
          if (${O} in input) {
            newResult[${O}] = undefined;
          }
        } else {
          newResult[${O}] = ${b}.value;
        }
        
      `) : ne ? p.write(`
        if (${b}.issues.length) {
          payload.issues = payload.issues.concat(${b}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${O}, ...iss.path] : [${O}]
          })));
        }
        
        if (${b}.value === undefined) {
          if (${O} in input) {
            newResult[${O}] = undefined;
          }
        } else {
          newResult[${O}] = ${b}.value;
        }
        
      `) : p.write(`
        const ${b}_present = ${O} in input;
        if (${b}.issues.length) {
          payload.issues = payload.issues.concat(${b}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${O}, ...iss.path] : [${O}]
          })));
        }
        if (!${b}_present && !${b}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${O}]
          });
        }

        if (${b}_present) {
          if (${b}.value === undefined) {
            newResult[${O}] = undefined;
          } else {
            newResult[${O}] = ${b}.value;
          }
        }

      `);
    }
    p.write("payload.value = newResult;"), p.write("return payload;");
    const ge = p.compile();
    return (A, b) => ge(m, A, b);
  };
  let i;
  const s = ae, c = !Te.jitless, f = c && tn.value, d = t.catchall;
  let _;
  e._zod.parse = (m, p) => {
    _ ?? (_ = r.value);
    const v = m.value;
    return s(v) ? c && f && p?.async === !1 && p.jitless !== !0 ? (i || (i = o(t.shape)), m = i(m, p), d ? Et([], v, m, p, _, e) : m) : n(m, p) : (m.issues.push({
      expected: "object",
      code: "invalid_type",
      input: v,
      inst: e
    }), m);
  };
});
function He(e, t, n, r) {
  for (const i of e)
    if (i.issues.length === 0)
      return t.value = i.value, t;
  const o = e.filter((i) => !W(i));
  return o.length === 1 ? (t.value = o[0].value, o[0]) : (t.issues.push({
    code: "invalid_union",
    input: t.value,
    inst: n,
    errors: e.map((i) => i.issues.map((s) => J(s, r, F())))
  }), t);
}
const Dr = /* @__PURE__ */ u("$ZodUnion", (e, t) => {
  T.init(e, t), w(e._zod, "optin", () => t.options.some((r) => r._zod.optin === "optional") ? "optional" : void 0), w(e._zod, "optout", () => t.options.some((r) => r._zod.optout === "optional") ? "optional" : void 0), w(e._zod, "values", () => {
    if (t.options.every((r) => r._zod.values))
      return new Set(t.options.flatMap((r) => Array.from(r._zod.values)));
  }), w(e._zod, "pattern", () => {
    if (t.options.every((r) => r._zod.pattern)) {
      const r = t.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${r.map((o) => Re(o.source)).join("|")})$`);
    }
  });
  const n = t.options.length === 1 ? t.options[0]._zod.run : null;
  e._zod.parse = (r, o) => {
    if (n)
      return n(r, o);
    let i = !1;
    const s = [];
    for (const c of t.options) {
      const a = c._zod.run({
        value: r.value,
        issues: []
      }, o);
      if (a instanceof Promise)
        s.push(a), i = !0;
      else {
        if (a.issues.length === 0)
          return a;
        s.push(a);
      }
    }
    return i ? Promise.all(s).then((c) => He(c, r, e, o)) : He(s, r, e, o);
  };
}), xr = /* @__PURE__ */ u("$ZodIntersection", (e, t) => {
  T.init(e, t), e._zod.parse = (n, r) => {
    const o = n.value, i = t.left._zod.run({ value: o, issues: [] }, r), s = t.right._zod.run({ value: o, issues: [] }, r);
    return i instanceof Promise || s instanceof Promise ? Promise.all([i, s]).then(([a, f]) => Qe(n, a, f)) : Qe(n, i, s);
  };
});
function Oe(e, t) {
  if (e === t)
    return { valid: !0, data: e };
  if (e instanceof Date && t instanceof Date && +e == +t)
    return { valid: !0, data: e };
  if (H(e) && H(t)) {
    const n = Object.keys(t), r = Object.keys(e).filter((i) => n.indexOf(i) !== -1), o = { ...e, ...t };
    for (const i of r) {
      const s = Oe(e[i], t[i]);
      if (!s.valid)
        return {
          valid: !1,
          mergeErrorPath: [i, ...s.mergeErrorPath]
        };
      o[i] = s.data;
    }
    return { valid: !0, data: o };
  }
  if (Array.isArray(e) && Array.isArray(t)) {
    if (e.length !== t.length)
      return { valid: !1, mergeErrorPath: [] };
    const n = [];
    for (let r = 0; r < e.length; r++) {
      const o = e[r], i = t[r], s = Oe(o, i);
      if (!s.valid)
        return {
          valid: !1,
          mergeErrorPath: [r, ...s.mergeErrorPath]
        };
      n.push(s.data);
    }
    return { valid: !0, data: n };
  }
  return { valid: !1, mergeErrorPath: [] };
}
function Qe(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  let o;
  for (const c of t.issues)
    if (c.code === "unrecognized_keys") {
      o ?? (o = c);
      for (const a of c.keys)
        r.has(a) || r.set(a, {}), r.get(a).l = !0;
    } else
      e.issues.push(c);
  for (const c of n.issues)
    if (c.code === "unrecognized_keys")
      for (const a of c.keys)
        r.has(a) || r.set(a, {}), r.get(a).r = !0;
    else
      e.issues.push(c);
  const i = [...r].filter(([, c]) => c.l && c.r).map(([c]) => c);
  if (i.length && o && e.issues.push({ ...o, keys: i }), W(e))
    return e;
  const s = Oe(t.value, n.value);
  if (!s.valid)
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(s.mergeErrorPath)}`);
  return e.value = s.data, e;
}
const Ur = /* @__PURE__ */ u("$ZodEnum", (e, t) => {
  T.init(e, t);
  const n = _t(t.entries), r = new Set(n);
  e._zod.values = r, e._zod.pattern = new RegExp(`^(${n.filter((o) => nn.has(typeof o)).map((o) => typeof o == "string" ? de(o) : o.toString()).join("|")})$`), e._zod.parse = (o, i) => {
    const s = o.value;
    return r.has(s) || o.issues.push({
      code: "invalid_value",
      values: n,
      input: s,
      inst: e
    }), o;
  };
}), Fr = /* @__PURE__ */ u("$ZodTransform", (e, t) => {
  T.init(e, t), e._zod.optin = "optional", e._zod.parse = (n, r) => {
    if (r.direction === "backward")
      throw new mt(e.constructor.name);
    const o = t.transform(n.value, n);
    if (r.async)
      return (o instanceof Promise ? o : Promise.resolve(o)).then((s) => (n.value = s, n.fallback = !0, n));
    if (o instanceof Promise)
      throw new V();
    return n.value = o, n.fallback = !0, n;
  };
});
function et(e, t) {
  return t === void 0 && (e.issues.length || e.fallback) ? { issues: [], value: void 0 } : e;
}
const Tt = /* @__PURE__ */ u("$ZodOptional", (e, t) => {
  T.init(e, t), e._zod.optin = "optional", e._zod.optout = "optional", w(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, void 0]) : void 0), w(e._zod, "pattern", () => {
    const n = t.innerType._zod.pattern;
    return n ? new RegExp(`^(${Re(n.source)})?$`) : void 0;
  }), e._zod.parse = (n, r) => {
    if (t.innerType._zod.optin === "optional") {
      const o = n.value, i = t.innerType._zod.run(n, r);
      return i instanceof Promise ? i.then((s) => et(s, o)) : et(i, o);
    }
    return n.value === void 0 ? n : t.innerType._zod.run(n, r);
  };
}), Jr = /* @__PURE__ */ u("$ZodExactOptional", (e, t) => {
  Tt.init(e, t), w(e._zod, "values", () => t.innerType._zod.values), w(e._zod, "pattern", () => t.innerType._zod.pattern), e._zod.parse = (n, r) => t.innerType._zod.run(n, r);
}), Lr = /* @__PURE__ */ u("$ZodNullable", (e, t) => {
  T.init(e, t), w(e._zod, "optin", () => t.innerType._zod.optin), w(e._zod, "optout", () => t.innerType._zod.optout), w(e._zod, "pattern", () => {
    const n = t.innerType._zod.pattern;
    return n ? new RegExp(`^(${Re(n.source)}|null)$`) : void 0;
  }), w(e._zod, "values", () => t.innerType._zod.values ? /* @__PURE__ */ new Set([...t.innerType._zod.values, null]) : void 0), e._zod.parse = (n, r) => n.value === null ? n : t.innerType._zod.run(n, r);
}), Mr = /* @__PURE__ */ u("$ZodDefault", (e, t) => {
  T.init(e, t), e._zod.optin = "optional", w(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (n, r) => {
    if (r.direction === "backward")
      return t.innerType._zod.run(n, r);
    if (n.value === void 0)
      return n.value = t.defaultValue, n;
    const o = t.innerType._zod.run(n, r);
    return o instanceof Promise ? o.then((i) => tt(i, t)) : tt(o, t);
  };
});
function tt(e, t) {
  return e.value === void 0 && (e.value = t.defaultValue), e;
}
const Wr = /* @__PURE__ */ u("$ZodPrefault", (e, t) => {
  T.init(e, t), e._zod.optin = "optional", w(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (n, r) => (r.direction === "backward" || n.value === void 0 && (n.value = t.defaultValue), t.innerType._zod.run(n, r));
}), Vr = /* @__PURE__ */ u("$ZodNonOptional", (e, t) => {
  T.init(e, t), w(e._zod, "values", () => {
    const n = t.innerType._zod.values;
    return n ? new Set([...n].filter((r) => r !== void 0)) : void 0;
  }), e._zod.parse = (n, r) => {
    const o = t.innerType._zod.run(n, r);
    return o instanceof Promise ? o.then((i) => nt(i, e)) : nt(o, e);
  };
});
function nt(e, t) {
  return !e.issues.length && e.value === void 0 && e.issues.push({
    code: "invalid_type",
    expected: "nonoptional",
    input: e.value,
    inst: t
  }), e;
}
const Yr = /* @__PURE__ */ u("$ZodCatch", (e, t) => {
  T.init(e, t), e._zod.optin = "optional", w(e._zod, "optout", () => t.innerType._zod.optout), w(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (n, r) => {
    if (r.direction === "backward")
      return t.innerType._zod.run(n, r);
    const o = t.innerType._zod.run(n, r);
    return o instanceof Promise ? o.then((i) => (n.value = i.value, i.issues.length && (n.value = t.catchValue({
      ...n,
      error: {
        issues: i.issues.map((s) => J(s, r, F()))
      },
      input: n.value
    }), n.issues = [], n.fallback = !0), n)) : (n.value = o.value, o.issues.length && (n.value = t.catchValue({
      ...n,
      error: {
        issues: o.issues.map((i) => J(i, r, F()))
      },
      input: n.value
    }), n.issues = [], n.fallback = !0), n);
  };
}), Kr = /* @__PURE__ */ u("$ZodPipe", (e, t) => {
  T.init(e, t), w(e._zod, "values", () => t.in._zod.values), w(e._zod, "optin", () => t.in._zod.optin), w(e._zod, "optout", () => t.out._zod.optout), w(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (n, r) => {
    if (r.direction === "backward") {
      const i = t.out._zod.run(n, r);
      return i instanceof Promise ? i.then((s) => ie(s, t.in, r)) : ie(i, t.in, r);
    }
    const o = t.in._zod.run(n, r);
    return o instanceof Promise ? o.then((i) => ie(i, t.out, r)) : ie(o, t.out, r);
  };
});
function ie(e, t, n) {
  return e.issues.length ? (e.aborted = !0, e) : t._zod.run({ value: e.value, issues: e.issues, fallback: e.fallback }, n);
}
const Br = /* @__PURE__ */ u("$ZodReadonly", (e, t) => {
  T.init(e, t), w(e._zod, "propValues", () => t.innerType._zod.propValues), w(e._zod, "values", () => t.innerType._zod.values), w(e._zod, "optin", () => t.innerType?._zod?.optin), w(e._zod, "optout", () => t.innerType?._zod?.optout), e._zod.parse = (n, r) => {
    if (r.direction === "backward")
      return t.innerType._zod.run(n, r);
    const o = t.innerType._zod.run(n, r);
    return o instanceof Promise ? o.then(rt) : rt(o);
  };
});
function rt(e) {
  return e.value = Object.freeze(e.value), e;
}
const qr = /* @__PURE__ */ u("$ZodCustom", (e, t) => {
  C.init(e, t), T.init(e, t), e._zod.parse = (n, r) => n, e._zod.check = (n) => {
    const r = n.value, o = t.fn(r);
    if (o instanceof Promise)
      return o.then((i) => ot(i, n, r, e));
    ot(o, n, r, e);
  };
});
function ot(e, t, n, r) {
  if (!e) {
    const o = {
      code: "custom",
      input: n,
      inst: r,
      // incorporates params.error into issue reporting
      path: [...r._zod.def.path ?? []],
      // incorporates params.error into issue reporting
      continue: !r._zod.def.abort
      // params: inst._zod.def.params,
    };
    r._zod.def.params && (o.params = r._zod.def.params), t.issues.push(Q(o));
  }
}
var st;
class Gr {
  constructor() {
    this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
  }
  add(t, ...n) {
    const r = n[0];
    return this._map.set(t, r), r && typeof r == "object" && "id" in r && this._idmap.set(r.id, t), this;
  }
  clear() {
    return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
  }
  remove(t) {
    const n = this._map.get(t);
    return n && typeof n == "object" && "id" in n && this._idmap.delete(n.id), this._map.delete(t), this;
  }
  get(t) {
    const n = t._zod.parent;
    if (n) {
      const r = { ...this.get(n) ?? {} };
      delete r.id;
      const o = { ...r, ...this._map.get(t) };
      return Object.keys(o).length ? o : void 0;
    }
    return this._map.get(t);
  }
  has(t) {
    return this._map.has(t);
  }
}
function Xr() {
  return new Gr();
}
(st = globalThis).__zod_globalRegistry ?? (st.__zod_globalRegistry = Xr());
const G = globalThis.__zod_globalRegistry;
// @__NO_SIDE_EFFECTS__
function Hr(e, t) {
  return new e({
    type: "string",
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Qr(e, t) {
  return new e({
    type: "string",
    format: "email",
    check: "string_format",
    abort: !1,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function it(e, t) {
  return new e({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: !1,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function eo(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function to(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v4",
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function no(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v6",
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ro(e, t) {
  return new e({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: !1,
    version: "v7",
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function oo(e, t) {
  return new e({
    type: "string",
    format: "url",
    check: "string_format",
    abort: !1,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function so(e, t) {
  return new e({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: !1,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function io(e, t) {
  return new e({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: !1,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function co(e, t) {
  return new e({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: !1,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ao(e, t) {
  return new e({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: !1,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function uo(e, t) {
  return new e({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: !1,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function fo(e, t) {
  return new e({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: !1,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function lo(e, t) {
  return new e({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: !1,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function po(e, t) {
  return new e({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: !1,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ho(e, t) {
  return new e({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: !1,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function mo(e, t) {
  return new e({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: !1,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function _o(e, t) {
  return new e({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: !1,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function go(e, t) {
  return new e({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: !1,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function vo(e, t) {
  return new e({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: !1,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function wo(e, t) {
  return new e({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: !1,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function yo(e, t) {
  return new e({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: !1,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function bo(e, t) {
  return new e({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: !1,
    local: !1,
    precision: null,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function zo(e, t) {
  return new e({
    type: "string",
    format: "date",
    check: "string_format",
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function ko(e, t) {
  return new e({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function $o(e, t) {
  return new e({
    type: "string",
    format: "duration",
    check: "string_format",
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Zo(e) {
  return new e({
    type: "unknown"
  });
}
// @__NO_SIDE_EFFECTS__
function Oo(e, t) {
  return new e({
    type: "never",
    ...h(t)
  });
}
// @__NO_SIDE_EFFECTS__
function Pt(e, t) {
  return new qn({
    check: "max_length",
    ...h(t),
    maximum: e
  });
}
// @__NO_SIDE_EFFECTS__
function fe(e, t) {
  return new Gn({
    check: "min_length",
    ...h(t),
    minimum: e
  });
}
// @__NO_SIDE_EFFECTS__
function jt(e, t) {
  return new Xn({
    check: "length_equals",
    ...h(t),
    length: e
  });
}
// @__NO_SIDE_EFFECTS__
function So(e, t) {
  return new Hn({
    check: "string_format",
    format: "regex",
    ...h(t),
    pattern: e
  });
}
// @__NO_SIDE_EFFECTS__
function Eo(e) {
  return new Qn({
    check: "string_format",
    format: "lowercase",
    ...h(e)
  });
}
// @__NO_SIDE_EFFECTS__
function To(e) {
  return new er({
    check: "string_format",
    format: "uppercase",
    ...h(e)
  });
}
// @__NO_SIDE_EFFECTS__
function Po(e, t) {
  return new tr({
    check: "string_format",
    format: "includes",
    ...h(t),
    includes: e
  });
}
// @__NO_SIDE_EFFECTS__
function jo(e, t) {
  return new nr({
    check: "string_format",
    format: "starts_with",
    ...h(t),
    prefix: e
  });
}
// @__NO_SIDE_EFFECTS__
function Ro(e, t) {
  return new rr({
    check: "string_format",
    format: "ends_with",
    ...h(t),
    suffix: e
  });
}
// @__NO_SIDE_EFFECTS__
function Y(e) {
  return new or({
    check: "overwrite",
    tx: e
  });
}
// @__NO_SIDE_EFFECTS__
function Ao(e) {
  return /* @__PURE__ */ Y((t) => t.normalize(e));
}
// @__NO_SIDE_EFFECTS__
function Io() {
  return /* @__PURE__ */ Y((e) => e.trim());
}
// @__NO_SIDE_EFFECTS__
function Co() {
  return /* @__PURE__ */ Y((e) => e.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function No() {
  return /* @__PURE__ */ Y((e) => e.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function Do() {
  return /* @__PURE__ */ Y((e) => en(e));
}
// @__NO_SIDE_EFFECTS__
function xo(e, t, n) {
  return new e({
    type: "array",
    element: t,
    // get element() {
    //   return element;
    // },
    ...h(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Uo(e, t, n) {
  return new e({
    type: "custom",
    check: "custom",
    fn: t,
    ...h(n)
  });
}
// @__NO_SIDE_EFFECTS__
function Fo(e, t) {
  const n = /* @__PURE__ */ Jo((r) => (r.addIssue = (o) => {
    if (typeof o == "string")
      r.issues.push(Q(o, r.value, n._zod.def));
    else {
      const i = o;
      i.fatal && (i.continue = !1), i.code ?? (i.code = "custom"), i.input ?? (i.input = r.value), i.inst ?? (i.inst = n), i.continue ?? (i.continue = !n._zod.def.abort), r.issues.push(Q(i));
    }
  }, e(r.value, r)), t);
  return n;
}
// @__NO_SIDE_EFFECTS__
function Jo(e, t) {
  const n = new C({
    check: "custom",
    ...h(t)
  });
  return n._zod.check = e, n;
}
function Rt(e) {
  let t = e?.target ?? "draft-2020-12";
  return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), {
    processors: e.processors ?? {},
    metadataRegistry: e?.metadata ?? G,
    target: t,
    unrepresentable: e?.unrepresentable ?? "throw",
    override: e?.override ?? (() => {
    }),
    io: e?.io ?? "output",
    counter: 0,
    seen: /* @__PURE__ */ new Map(),
    cycles: e?.cycles ?? "ref",
    reused: e?.reused ?? "inline",
    external: e?.external ?? void 0
  };
}
function j(e, t, n = { path: [], schemaPath: [] }) {
  var r;
  const o = e._zod.def, i = t.seen.get(e);
  if (i)
    return i.count++, n.schemaPath.includes(e) && (i.cycle = n.path), i.schema;
  const s = { schema: {}, count: 1, cycle: void 0, path: n.path };
  t.seen.set(e, s);
  const c = e._zod.toJSONSchema?.();
  if (c)
    s.schema = c;
  else {
    const d = {
      ...n,
      schemaPath: [...n.schemaPath, e],
      path: n.path
    };
    if (e._zod.processJSONSchema)
      e._zod.processJSONSchema(t, s.schema, d);
    else {
      const m = s.schema, p = t.processors[o.type];
      if (!p)
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${o.type}`);
      p(e, t, m, d);
    }
    const _ = e._zod.parent;
    _ && (s.ref || (s.ref = _), j(_, t, d), t.seen.get(_).isParent = !0);
  }
  const a = t.metadataRegistry.get(e);
  return a && Object.assign(s.schema, a), t.io === "input" && R(e) && (delete s.schema.examples, delete s.schema.default), t.io === "input" && "_prefault" in s.schema && ((r = s.schema).default ?? (r.default = s.schema._prefault)), delete s.schema._prefault, t.seen.get(e).schema;
}
function At(e, t) {
  const n = e.seen.get(t);
  if (!n)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const r = /* @__PURE__ */ new Map();
  for (const s of e.seen.entries()) {
    const c = e.metadataRegistry.get(s[0])?.id;
    if (c) {
      const a = r.get(c);
      if (a && a !== s[0])
        throw new Error(`Duplicate schema id "${c}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      r.set(c, s[0]);
    }
  }
  const o = (s) => {
    const c = e.target === "draft-2020-12" ? "$defs" : "definitions";
    if (e.external) {
      const _ = e.external.registry.get(s[0])?.id, m = e.external.uri ?? ((v) => v);
      if (_)
        return { ref: m(_) };
      const p = s[1].defId ?? s[1].schema.id ?? `schema${e.counter++}`;
      return s[1].defId = p, { defId: p, ref: `${m("__shared")}#/${c}/${p}` };
    }
    if (s[1] === n)
      return { ref: "#" };
    const f = `#/${c}/`, d = s[1].schema.id ?? `__schema${e.counter++}`;
    return { defId: d, ref: f + d };
  }, i = (s) => {
    if (s[1].schema.$ref)
      return;
    const c = s[1], { ref: a, defId: f } = o(s);
    c.def = { ...c.schema }, f && (c.defId = f);
    const d = c.schema;
    for (const _ in d)
      delete d[_];
    d.$ref = a;
  };
  if (e.cycles === "throw")
    for (const s of e.seen.entries()) {
      const c = s[1];
      if (c.cycle)
        throw new Error(`Cycle detected: #/${c.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
    }
  for (const s of e.seen.entries()) {
    const c = s[1];
    if (t === s[0]) {
      i(s);
      continue;
    }
    if (e.external) {
      const f = e.external.registry.get(s[0])?.id;
      if (t !== s[0] && f) {
        i(s);
        continue;
      }
    }
    if (e.metadataRegistry.get(s[0])?.id) {
      i(s);
      continue;
    }
    if (c.cycle) {
      i(s);
      continue;
    }
    if (c.count > 1 && e.reused === "ref") {
      i(s);
      continue;
    }
  }
}
function It(e, t) {
  const n = e.seen.get(t);
  if (!n)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const r = (c) => {
    const a = e.seen.get(c);
    if (a.ref === null)
      return;
    const f = a.def ?? a.schema, d = { ...f }, _ = a.ref;
    if (a.ref = null, _) {
      r(_);
      const p = e.seen.get(_), v = p.schema;
      if (v.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (f.allOf = f.allOf ?? [], f.allOf.push(v)) : Object.assign(f, v), Object.assign(f, d), c._zod.parent === _)
        for (const Z in f)
          Z === "$ref" || Z === "allOf" || Z in d || delete f[Z];
      if (v.$ref && p.def)
        for (const Z in f)
          Z === "$ref" || Z === "allOf" || Z in p.def && JSON.stringify(f[Z]) === JSON.stringify(p.def[Z]) && delete f[Z];
    }
    const m = c._zod.parent;
    if (m && m !== _) {
      r(m);
      const p = e.seen.get(m);
      if (p?.schema.$ref && (f.$ref = p.schema.$ref, p.def))
        for (const v in f)
          v === "$ref" || v === "allOf" || v in p.def && JSON.stringify(f[v]) === JSON.stringify(p.def[v]) && delete f[v];
    }
    e.override({
      zodSchema: c,
      jsonSchema: f,
      path: a.path ?? []
    });
  };
  for (const c of [...e.seen.entries()].reverse())
    r(c[0]);
  const o = {};
  if (e.target === "draft-2020-12" ? o.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? o.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? o.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
    const c = e.external.registry.get(t)?.id;
    if (!c)
      throw new Error("Schema is missing an `id` property");
    o.$id = e.external.uri(c);
  }
  Object.assign(o, n.def ?? n.schema);
  const i = e.metadataRegistry.get(t)?.id;
  i !== void 0 && o.id === i && delete o.id;
  const s = e.external?.defs ?? {};
  for (const c of e.seen.entries()) {
    const a = c[1];
    a.def && a.defId && (a.def.id === a.defId && delete a.def.id, s[a.defId] = a.def);
  }
  e.external || Object.keys(s).length > 0 && (e.target === "draft-2020-12" ? o.$defs = s : o.definitions = s);
  try {
    const c = JSON.parse(JSON.stringify(o));
    return Object.defineProperty(c, "~standard", {
      value: {
        ...t["~standard"],
        jsonSchema: {
          input: le(t, "input", e.processors),
          output: le(t, "output", e.processors)
        }
      },
      enumerable: !1,
      writable: !1
    }), c;
  } catch {
    throw new Error("Error converting schema to JSON.");
  }
}
function R(e, t) {
  const n = t ?? { seen: /* @__PURE__ */ new Set() };
  if (n.seen.has(e))
    return !1;
  n.seen.add(e);
  const r = e._zod.def;
  if (r.type === "transform")
    return !0;
  if (r.type === "array")
    return R(r.element, n);
  if (r.type === "set")
    return R(r.valueType, n);
  if (r.type === "lazy")
    return R(r.getter(), n);
  if (r.type === "promise" || r.type === "optional" || r.type === "nonoptional" || r.type === "nullable" || r.type === "readonly" || r.type === "default" || r.type === "prefault")
    return R(r.innerType, n);
  if (r.type === "intersection")
    return R(r.left, n) || R(r.right, n);
  if (r.type === "record" || r.type === "map")
    return R(r.keyType, n) || R(r.valueType, n);
  if (r.type === "pipe")
    return e._zod.traits.has("$ZodCodec") ? !0 : R(r.in, n) || R(r.out, n);
  if (r.type === "object") {
    for (const o in r.shape)
      if (R(r.shape[o], n))
        return !0;
    return !1;
  }
  if (r.type === "union") {
    for (const o of r.options)
      if (R(o, n))
        return !0;
    return !1;
  }
  if (r.type === "tuple") {
    for (const o of r.items)
      if (R(o, n))
        return !0;
    return !!(r.rest && R(r.rest, n));
  }
  return !1;
}
const Lo = (e, t = {}) => (n) => {
  const r = Rt({ ...n, processors: t });
  return j(e, r), At(r, e), It(r, e);
}, le = (e, t, n = {}) => (r) => {
  const { libraryOptions: o, target: i } = r ?? {}, s = Rt({ ...o ?? {}, target: i, io: t, processors: n });
  return j(e, s), At(s, e), It(s, e);
}, Mo = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
  // do not set
}, Wo = (e, t, n, r) => {
  const o = n;
  o.type = "string";
  const { minimum: i, maximum: s, format: c, patterns: a, contentEncoding: f } = e._zod.bag;
  if (typeof i == "number" && (o.minLength = i), typeof s == "number" && (o.maxLength = s), c && (o.format = Mo[c] ?? c, o.format === "" && delete o.format, c === "time" && delete o.format), f && (o.contentEncoding = f), a && a.size > 0) {
    const d = [...a];
    d.length === 1 ? o.pattern = d[0].source : d.length > 1 && (o.allOf = [
      ...d.map((_) => ({
        ...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {},
        pattern: _.source
      }))
    ]);
  }
}, Vo = (e, t, n, r) => {
  n.not = {};
}, Yo = (e, t, n, r) => {
}, Ko = (e, t, n, r) => {
  const o = e._zod.def, i = _t(o.entries);
  i.every((s) => typeof s == "number") && (n.type = "number"), i.every((s) => typeof s == "string") && (n.type = "string"), n.enum = i;
}, Bo = (e, t, n, r) => {
  if (t.unrepresentable === "throw")
    throw new Error("Custom types cannot be represented in JSON Schema");
}, qo = (e, t, n, r) => {
  if (t.unrepresentable === "throw")
    throw new Error("Transforms cannot be represented in JSON Schema");
}, Go = (e, t, n, r) => {
  const o = n, i = e._zod.def, { minimum: s, maximum: c } = e._zod.bag;
  typeof s == "number" && (o.minItems = s), typeof c == "number" && (o.maxItems = c), o.type = "array", o.items = j(i.element, t, {
    ...r,
    path: [...r.path, "items"]
  });
}, Xo = (e, t, n, r) => {
  const o = n, i = e._zod.def;
  o.type = "object", o.properties = {};
  const s = i.shape;
  for (const f in s)
    o.properties[f] = j(s[f], t, {
      ...r,
      path: [...r.path, "properties", f]
    });
  const c = new Set(Object.keys(s)), a = new Set([...c].filter((f) => {
    const d = i.shape[f]._zod;
    return t.io === "input" ? d.optin === void 0 : d.optout === void 0;
  }));
  a.size > 0 && (o.required = Array.from(a)), i.catchall?._zod.def.type === "never" ? o.additionalProperties = !1 : i.catchall ? i.catchall && (o.additionalProperties = j(i.catchall, t, {
    ...r,
    path: [...r.path, "additionalProperties"]
  })) : t.io === "output" && (o.additionalProperties = !1);
}, Ho = (e, t, n, r) => {
  const o = e._zod.def, i = o.inclusive === !1, s = o.options.map((c, a) => j(c, t, {
    ...r,
    path: [...r.path, i ? "oneOf" : "anyOf", a]
  }));
  i ? n.oneOf = s : n.anyOf = s;
}, Qo = (e, t, n, r) => {
  const o = e._zod.def, i = j(o.left, t, {
    ...r,
    path: [...r.path, "allOf", 0]
  }), s = j(o.right, t, {
    ...r,
    path: [...r.path, "allOf", 1]
  }), c = (f) => "allOf" in f && Object.keys(f).length === 1, a = [
    ...c(i) ? i.allOf : [i],
    ...c(s) ? s.allOf : [s]
  ];
  n.allOf = a;
}, es = (e, t, n, r) => {
  const o = e._zod.def, i = j(o.innerType, t, r), s = t.seen.get(e);
  t.target === "openapi-3.0" ? (s.ref = o.innerType, n.nullable = !0) : n.anyOf = [i, { type: "null" }];
}, ts = (e, t, n, r) => {
  const o = e._zod.def;
  j(o.innerType, t, r);
  const i = t.seen.get(e);
  i.ref = o.innerType;
}, ns = (e, t, n, r) => {
  const o = e._zod.def;
  j(o.innerType, t, r);
  const i = t.seen.get(e);
  i.ref = o.innerType, n.default = JSON.parse(JSON.stringify(o.defaultValue));
}, rs = (e, t, n, r) => {
  const o = e._zod.def;
  j(o.innerType, t, r);
  const i = t.seen.get(e);
  i.ref = o.innerType, t.io === "input" && (n._prefault = JSON.parse(JSON.stringify(o.defaultValue)));
}, os = (e, t, n, r) => {
  const o = e._zod.def;
  j(o.innerType, t, r);
  const i = t.seen.get(e);
  i.ref = o.innerType;
  let s;
  try {
    s = o.catchValue(void 0);
  } catch {
    throw new Error("Dynamic catch values are not supported in JSON Schema");
  }
  n.default = s;
}, ss = (e, t, n, r) => {
  const o = e._zod.def, i = o.in._zod.traits.has("$ZodTransform"), s = t.io === "input" ? i ? o.out : o.in : o.out;
  j(s, t, r);
  const c = t.seen.get(e);
  c.ref = s;
}, is = (e, t, n, r) => {
  const o = e._zod.def;
  j(o.innerType, t, r);
  const i = t.seen.get(e);
  i.ref = o.innerType, n.readOnly = !0;
}, Ct = (e, t, n, r) => {
  const o = e._zod.def;
  j(o.innerType, t, r);
  const i = t.seen.get(e);
  i.ref = o.innerType;
}, cs = /* @__PURE__ */ u("ZodISODateTime", (e, t) => {
  vr.init(e, t), k.init(e, t);
});
function as(e) {
  return /* @__PURE__ */ bo(cs, e);
}
const us = /* @__PURE__ */ u("ZodISODate", (e, t) => {
  wr.init(e, t), k.init(e, t);
});
function fs(e) {
  return /* @__PURE__ */ zo(us, e);
}
const ls = /* @__PURE__ */ u("ZodISOTime", (e, t) => {
  yr.init(e, t), k.init(e, t);
});
function ds(e) {
  return /* @__PURE__ */ ko(ls, e);
}
const ps = /* @__PURE__ */ u("ZodISODuration", (e, t) => {
  br.init(e, t), k.init(e, t);
});
function hs(e) {
  return /* @__PURE__ */ $o(ps, e);
}
const ms = (e, t) => {
  bt.init(e, t), e.name = "ZodError", Object.defineProperties(e, {
    format: {
      value: (n) => hn(e, n)
      // enumerable: false,
    },
    flatten: {
      value: (n) => pn(e, n)
      // enumerable: false,
    },
    addIssue: {
      value: (n) => {
        e.issues.push(n), e.message = JSON.stringify(e.issues, Ze, 2);
      }
      // enumerable: false,
    },
    addIssues: {
      value: (n) => {
        e.issues.push(...n), e.message = JSON.stringify(e.issues, Ze, 2);
      }
      // enumerable: false,
    },
    isEmpty: {
      get() {
        return e.issues.length === 0;
      }
      // enumerable: false,
    }
  });
}, I = /* @__PURE__ */ u("ZodError", ms, {
  Parent: Error
}), _s = /* @__PURE__ */ Ie(I), gs = /* @__PURE__ */ Ce(I), vs = /* @__PURE__ */ pe(I), ws = /* @__PURE__ */ he(I), ys = /* @__PURE__ */ gn(I), bs = /* @__PURE__ */ vn(I), zs = /* @__PURE__ */ wn(I), ks = /* @__PURE__ */ yn(I), $s = /* @__PURE__ */ bn(I), Zs = /* @__PURE__ */ zn(I), Os = /* @__PURE__ */ kn(I), Ss = /* @__PURE__ */ $n(I), ct = /* @__PURE__ */ new WeakMap();
function _e(e, t, n) {
  const r = Object.getPrototypeOf(e);
  let o = ct.get(r);
  if (o || (o = /* @__PURE__ */ new Set(), ct.set(r, o)), !o.has(t)) {
    o.add(t);
    for (const i in n) {
      const s = n[i];
      Object.defineProperty(r, i, {
        configurable: !0,
        enumerable: !1,
        get() {
          const c = s.bind(this);
          return Object.defineProperty(this, i, {
            configurable: !0,
            writable: !0,
            enumerable: !0,
            value: c
          }), c;
        },
        set(c) {
          Object.defineProperty(this, i, {
            configurable: !0,
            writable: !0,
            enumerable: !0,
            value: c
          });
        }
      });
    }
  }
}
const P = /* @__PURE__ */ u("ZodType", (e, t) => (T.init(e, t), Object.assign(e["~standard"], {
  jsonSchema: {
    input: le(e, "input"),
    output: le(e, "output")
  }
}), e.toJSONSchema = Lo(e, {}), e.def = t, e.type = t.type, Object.defineProperty(e, "_def", { value: t }), e.parse = (n, r) => _s(e, n, r, { callee: e.parse }), e.safeParse = (n, r) => vs(e, n, r), e.parseAsync = async (n, r) => gs(e, n, r, { callee: e.parseAsync }), e.safeParseAsync = async (n, r) => ws(e, n, r), e.spa = e.safeParseAsync, e.encode = (n, r) => ys(e, n, r), e.decode = (n, r) => bs(e, n, r), e.encodeAsync = async (n, r) => zs(e, n, r), e.decodeAsync = async (n, r) => ks(e, n, r), e.safeEncode = (n, r) => $s(e, n, r), e.safeDecode = (n, r) => Zs(e, n, r), e.safeEncodeAsync = async (n, r) => Os(e, n, r), e.safeDecodeAsync = async (n, r) => Ss(e, n, r), _e(e, "ZodType", {
  check(...n) {
    const r = this.def;
    return this.clone(D(r, {
      checks: [
        ...r.checks ?? [],
        ...n.map((o) => typeof o == "function" ? { _zod: { check: o, def: { check: "custom" }, onattach: [] } } : o)
      ]
    }), { parent: !0 });
  },
  with(...n) {
    return this.check(...n);
  },
  clone(n, r) {
    return x(this, n, r);
  },
  brand() {
    return this;
  },
  register(n, r) {
    return n.add(this, r), this;
  },
  refine(n, r) {
    return this.check(vi(n, r));
  },
  superRefine(n, r) {
    return this.check(wi(n, r));
  },
  overwrite(n) {
    return this.check(/* @__PURE__ */ Y(n));
  },
  optional() {
    return ft(this);
  },
  exactOptional() {
    return si(this);
  },
  nullable() {
    return lt(this);
  },
  nullish() {
    return ft(lt(this));
  },
  nonoptional(n) {
    return li(this, n);
  },
  array() {
    return Dt(this);
  },
  or(n) {
    return Qs([this, n]);
  },
  and(n) {
    return ti(this, n);
  },
  transform(n) {
    return dt(this, ri(n));
  },
  default(n) {
    return ai(this, n);
  },
  prefault(n) {
    return fi(this, n);
  },
  catch(n) {
    return pi(this, n);
  },
  pipe(n) {
    return dt(this, n);
  },
  readonly() {
    return _i(this);
  },
  describe(n) {
    const r = this.clone();
    return G.add(r, { description: n }), r;
  },
  meta(...n) {
    if (n.length === 0)
      return G.get(this);
    const r = this.clone();
    return G.add(r, n[0]), r;
  },
  isOptional() {
    return this.safeParse(void 0).success;
  },
  isNullable() {
    return this.safeParse(null).success;
  },
  apply(n) {
    return n(this);
  }
}), Object.defineProperty(e, "description", {
  get() {
    return G.get(e)?.description;
  },
  configurable: !0
}), e)), Nt = /* @__PURE__ */ u("_ZodString", (e, t) => {
  Ne.init(e, t), P.init(e, t), e._zod.processJSONSchema = (r, o, i) => Wo(e, r, o);
  const n = e._zod.bag;
  e.format = n.format ?? null, e.minLength = n.minimum ?? null, e.maxLength = n.maximum ?? null, _e(e, "_ZodString", {
    regex(...r) {
      return this.check(/* @__PURE__ */ So(...r));
    },
    includes(...r) {
      return this.check(/* @__PURE__ */ Po(...r));
    },
    startsWith(...r) {
      return this.check(/* @__PURE__ */ jo(...r));
    },
    endsWith(...r) {
      return this.check(/* @__PURE__ */ Ro(...r));
    },
    min(...r) {
      return this.check(/* @__PURE__ */ fe(...r));
    },
    max(...r) {
      return this.check(/* @__PURE__ */ Pt(...r));
    },
    length(...r) {
      return this.check(/* @__PURE__ */ jt(...r));
    },
    nonempty(...r) {
      return this.check(/* @__PURE__ */ fe(1, ...r));
    },
    lowercase(r) {
      return this.check(/* @__PURE__ */ Eo(r));
    },
    uppercase(r) {
      return this.check(/* @__PURE__ */ To(r));
    },
    trim() {
      return this.check(/* @__PURE__ */ Io());
    },
    normalize(...r) {
      return this.check(/* @__PURE__ */ Ao(...r));
    },
    toLowerCase() {
      return this.check(/* @__PURE__ */ Co());
    },
    toUpperCase() {
      return this.check(/* @__PURE__ */ No());
    },
    slugify() {
      return this.check(/* @__PURE__ */ Do());
    }
  });
}), Es = /* @__PURE__ */ u("ZodString", (e, t) => {
  Ne.init(e, t), Nt.init(e, t), e.email = (n) => e.check(/* @__PURE__ */ Qr(Ps, n)), e.url = (n) => e.check(/* @__PURE__ */ oo(js, n)), e.jwt = (n) => e.check(/* @__PURE__ */ yo(Ys, n)), e.emoji = (n) => e.check(/* @__PURE__ */ so(Rs, n)), e.guid = (n) => e.check(/* @__PURE__ */ it(at, n)), e.uuid = (n) => e.check(/* @__PURE__ */ eo(ce, n)), e.uuidv4 = (n) => e.check(/* @__PURE__ */ to(ce, n)), e.uuidv6 = (n) => e.check(/* @__PURE__ */ no(ce, n)), e.uuidv7 = (n) => e.check(/* @__PURE__ */ ro(ce, n)), e.nanoid = (n) => e.check(/* @__PURE__ */ io(As, n)), e.guid = (n) => e.check(/* @__PURE__ */ it(at, n)), e.cuid = (n) => e.check(/* @__PURE__ */ co(Is, n)), e.cuid2 = (n) => e.check(/* @__PURE__ */ ao(Cs, n)), e.ulid = (n) => e.check(/* @__PURE__ */ uo(Ns, n)), e.base64 = (n) => e.check(/* @__PURE__ */ go(Ms, n)), e.base64url = (n) => e.check(/* @__PURE__ */ vo(Ws, n)), e.xid = (n) => e.check(/* @__PURE__ */ fo(Ds, n)), e.ksuid = (n) => e.check(/* @__PURE__ */ lo(xs, n)), e.ipv4 = (n) => e.check(/* @__PURE__ */ po(Us, n)), e.ipv6 = (n) => e.check(/* @__PURE__ */ ho(Fs, n)), e.cidrv4 = (n) => e.check(/* @__PURE__ */ mo(Js, n)), e.cidrv6 = (n) => e.check(/* @__PURE__ */ _o(Ls, n)), e.e164 = (n) => e.check(/* @__PURE__ */ wo(Vs, n)), e.datetime = (n) => e.check(as(n)), e.date = (n) => e.check(fs(n)), e.time = (n) => e.check(ds(n)), e.duration = (n) => e.check(hs(n));
});
function Ts(e) {
  return /* @__PURE__ */ Hr(Es, e);
}
const k = /* @__PURE__ */ u("ZodStringFormat", (e, t) => {
  z.init(e, t), Nt.init(e, t);
}), Ps = /* @__PURE__ */ u("ZodEmail", (e, t) => {
  ur.init(e, t), k.init(e, t);
}), at = /* @__PURE__ */ u("ZodGUID", (e, t) => {
  cr.init(e, t), k.init(e, t);
}), ce = /* @__PURE__ */ u("ZodUUID", (e, t) => {
  ar.init(e, t), k.init(e, t);
}), js = /* @__PURE__ */ u("ZodURL", (e, t) => {
  fr.init(e, t), k.init(e, t);
}), Rs = /* @__PURE__ */ u("ZodEmoji", (e, t) => {
  lr.init(e, t), k.init(e, t);
}), As = /* @__PURE__ */ u("ZodNanoID", (e, t) => {
  dr.init(e, t), k.init(e, t);
}), Is = /* @__PURE__ */ u("ZodCUID", (e, t) => {
  pr.init(e, t), k.init(e, t);
}), Cs = /* @__PURE__ */ u("ZodCUID2", (e, t) => {
  hr.init(e, t), k.init(e, t);
}), Ns = /* @__PURE__ */ u("ZodULID", (e, t) => {
  mr.init(e, t), k.init(e, t);
}), Ds = /* @__PURE__ */ u("ZodXID", (e, t) => {
  _r.init(e, t), k.init(e, t);
}), xs = /* @__PURE__ */ u("ZodKSUID", (e, t) => {
  gr.init(e, t), k.init(e, t);
}), Us = /* @__PURE__ */ u("ZodIPv4", (e, t) => {
  zr.init(e, t), k.init(e, t);
}), Fs = /* @__PURE__ */ u("ZodIPv6", (e, t) => {
  kr.init(e, t), k.init(e, t);
}), Js = /* @__PURE__ */ u("ZodCIDRv4", (e, t) => {
  $r.init(e, t), k.init(e, t);
}), Ls = /* @__PURE__ */ u("ZodCIDRv6", (e, t) => {
  Zr.init(e, t), k.init(e, t);
}), Ms = /* @__PURE__ */ u("ZodBase64", (e, t) => {
  Or.init(e, t), k.init(e, t);
}), Ws = /* @__PURE__ */ u("ZodBase64URL", (e, t) => {
  Er.init(e, t), k.init(e, t);
}), Vs = /* @__PURE__ */ u("ZodE164", (e, t) => {
  Tr.init(e, t), k.init(e, t);
}), Ys = /* @__PURE__ */ u("ZodJWT", (e, t) => {
  jr.init(e, t), k.init(e, t);
}), Ks = /* @__PURE__ */ u("ZodUnknown", (e, t) => {
  Rr.init(e, t), P.init(e, t), e._zod.processJSONSchema = (n, r, o) => Yo();
});
function ut() {
  return /* @__PURE__ */ Zo(Ks);
}
const Bs = /* @__PURE__ */ u("ZodNever", (e, t) => {
  Ar.init(e, t), P.init(e, t), e._zod.processJSONSchema = (n, r, o) => Vo(e, n, r);
});
function qs(e) {
  return /* @__PURE__ */ Oo(Bs, e);
}
const Gs = /* @__PURE__ */ u("ZodArray", (e, t) => {
  Ir.init(e, t), P.init(e, t), e._zod.processJSONSchema = (n, r, o) => Go(e, n, r, o), e.element = t.element, _e(e, "ZodArray", {
    min(n, r) {
      return this.check(/* @__PURE__ */ fe(n, r));
    },
    nonempty(n) {
      return this.check(/* @__PURE__ */ fe(1, n));
    },
    max(n, r) {
      return this.check(/* @__PURE__ */ Pt(n, r));
    },
    length(n, r) {
      return this.check(/* @__PURE__ */ jt(n, r));
    },
    unwrap() {
      return this.element;
    }
  });
});
function Dt(e, t) {
  return /* @__PURE__ */ xo(Gs, e, t);
}
const Xs = /* @__PURE__ */ u("ZodObject", (e, t) => {
  Nr.init(e, t), P.init(e, t), e._zod.processJSONSchema = (n, r, o) => Xo(e, n, r, o), w(e, "shape", () => t.shape), _e(e, "ZodObject", {
    keyof() {
      return X(Object.keys(this._zod.def.shape));
    },
    catchall(n) {
      return this.clone({ ...this._zod.def, catchall: n });
    },
    passthrough() {
      return this.clone({ ...this._zod.def, catchall: ut() });
    },
    loose() {
      return this.clone({ ...this._zod.def, catchall: ut() });
    },
    strict() {
      return this.clone({ ...this._zod.def, catchall: qs() });
    },
    strip() {
      return this.clone({ ...this._zod.def, catchall: void 0 });
    },
    extend(n) {
      return cn(this, n);
    },
    safeExtend(n) {
      return an(this, n);
    },
    merge(n) {
      return un(this, n);
    },
    pick(n) {
      return on(this, n);
    },
    omit(n) {
      return sn(this, n);
    },
    partial(...n) {
      return fn(xt, this, n[0]);
    },
    required(...n) {
      return ln(Ut, this, n[0]);
    }
  });
});
function q(e, t) {
  const n = {
    type: "object",
    shape: e ?? {},
    ...h(t)
  };
  return new Xs(n);
}
const Hs = /* @__PURE__ */ u("ZodUnion", (e, t) => {
  Dr.init(e, t), P.init(e, t), e._zod.processJSONSchema = (n, r, o) => Ho(e, n, r, o), e.options = t.options;
});
function Qs(e, t) {
  return new Hs({
    type: "union",
    options: e,
    ...h(t)
  });
}
const ei = /* @__PURE__ */ u("ZodIntersection", (e, t) => {
  xr.init(e, t), P.init(e, t), e._zod.processJSONSchema = (n, r, o) => Qo(e, n, r, o);
});
function ti(e, t) {
  return new ei({
    type: "intersection",
    left: e,
    right: t
  });
}
const Se = /* @__PURE__ */ u("ZodEnum", (e, t) => {
  Ur.init(e, t), P.init(e, t), e._zod.processJSONSchema = (r, o, i) => Ko(e, r, o), e.enum = t.entries, e.options = Object.values(t.entries);
  const n = new Set(Object.keys(t.entries));
  e.extract = (r, o) => {
    const i = {};
    for (const s of r)
      if (n.has(s))
        i[s] = t.entries[s];
      else
        throw new Error(`Key ${s} not found in enum`);
    return new Se({
      ...t,
      checks: [],
      ...h(o),
      entries: i
    });
  }, e.exclude = (r, o) => {
    const i = { ...t.entries };
    for (const s of r)
      if (n.has(s))
        delete i[s];
      else
        throw new Error(`Key ${s} not found in enum`);
    return new Se({
      ...t,
      checks: [],
      ...h(o),
      entries: i
    });
  };
});
function X(e, t) {
  const n = Array.isArray(e) ? Object.fromEntries(e.map((r) => [r, r])) : e;
  return new Se({
    type: "enum",
    entries: n,
    ...h(t)
  });
}
const ni = /* @__PURE__ */ u("ZodTransform", (e, t) => {
  Fr.init(e, t), P.init(e, t), e._zod.processJSONSchema = (n, r, o) => qo(e, n), e._zod.parse = (n, r) => {
    if (r.direction === "backward")
      throw new mt(e.constructor.name);
    n.addIssue = (i) => {
      if (typeof i == "string")
        n.issues.push(Q(i, n.value, t));
      else {
        const s = i;
        s.fatal && (s.continue = !1), s.code ?? (s.code = "custom"), s.input ?? (s.input = n.value), s.inst ?? (s.inst = e), n.issues.push(Q(s));
      }
    };
    const o = t.transform(n.value, n);
    return o instanceof Promise ? o.then((i) => (n.value = i, n.fallback = !0, n)) : (n.value = o, n.fallback = !0, n);
  };
});
function ri(e) {
  return new ni({
    type: "transform",
    transform: e
  });
}
const xt = /* @__PURE__ */ u("ZodOptional", (e, t) => {
  Tt.init(e, t), P.init(e, t), e._zod.processJSONSchema = (n, r, o) => Ct(e, n, r, o), e.unwrap = () => e._zod.def.innerType;
});
function ft(e) {
  return new xt({
    type: "optional",
    innerType: e
  });
}
const oi = /* @__PURE__ */ u("ZodExactOptional", (e, t) => {
  Jr.init(e, t), P.init(e, t), e._zod.processJSONSchema = (n, r, o) => Ct(e, n, r, o), e.unwrap = () => e._zod.def.innerType;
});
function si(e) {
  return new oi({
    type: "optional",
    innerType: e
  });
}
const ii = /* @__PURE__ */ u("ZodNullable", (e, t) => {
  Lr.init(e, t), P.init(e, t), e._zod.processJSONSchema = (n, r, o) => es(e, n, r, o), e.unwrap = () => e._zod.def.innerType;
});
function lt(e) {
  return new ii({
    type: "nullable",
    innerType: e
  });
}
const ci = /* @__PURE__ */ u("ZodDefault", (e, t) => {
  Mr.init(e, t), P.init(e, t), e._zod.processJSONSchema = (n, r, o) => ns(e, n, r, o), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function ai(e, t) {
  return new ci({
    type: "default",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : vt(t);
    }
  });
}
const ui = /* @__PURE__ */ u("ZodPrefault", (e, t) => {
  Wr.init(e, t), P.init(e, t), e._zod.processJSONSchema = (n, r, o) => rs(e, n, r, o), e.unwrap = () => e._zod.def.innerType;
});
function fi(e, t) {
  return new ui({
    type: "prefault",
    innerType: e,
    get defaultValue() {
      return typeof t == "function" ? t() : vt(t);
    }
  });
}
const Ut = /* @__PURE__ */ u("ZodNonOptional", (e, t) => {
  Vr.init(e, t), P.init(e, t), e._zod.processJSONSchema = (n, r, o) => ts(e, n, r, o), e.unwrap = () => e._zod.def.innerType;
});
function li(e, t) {
  return new Ut({
    type: "nonoptional",
    innerType: e,
    ...h(t)
  });
}
const di = /* @__PURE__ */ u("ZodCatch", (e, t) => {
  Yr.init(e, t), P.init(e, t), e._zod.processJSONSchema = (n, r, o) => os(e, n, r, o), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function pi(e, t) {
  return new di({
    type: "catch",
    innerType: e,
    catchValue: typeof t == "function" ? t : () => t
  });
}
const hi = /* @__PURE__ */ u("ZodPipe", (e, t) => {
  Kr.init(e, t), P.init(e, t), e._zod.processJSONSchema = (n, r, o) => ss(e, n, r, o), e.in = t.in, e.out = t.out;
});
function dt(e, t) {
  return new hi({
    type: "pipe",
    in: e,
    out: t
    // ...util.normalizeParams(params),
  });
}
const mi = /* @__PURE__ */ u("ZodReadonly", (e, t) => {
  Br.init(e, t), P.init(e, t), e._zod.processJSONSchema = (n, r, o) => is(e, n, r, o), e.unwrap = () => e._zod.def.innerType;
});
function _i(e) {
  return new mi({
    type: "readonly",
    innerType: e
  });
}
const gi = /* @__PURE__ */ u("ZodCustom", (e, t) => {
  qr.init(e, t), P.init(e, t), e._zod.processJSONSchema = (n, r, o) => Bo(e, n);
});
function vi(e, t = {}) {
  return /* @__PURE__ */ Uo(gi, e, t);
}
function wi(e, t) {
  return /* @__PURE__ */ Fo(e, t);
}
const yi = q({
  data: q({
    slides: Dt(
      q({
        text: Ts()
      }).strict()
    ).min(1)
  }).strict(),
  settings: q({
    mode: q({
      desktop: X(["static", "slider"]),
      tablet: X(["static", "slider"]),
      mobile: X(["static", "slider"])
    }).strict(),
    theme: X([
      "light",
      "dark",
      "promo"
    ]).default("light")
  }).strict()
}).strict();
function bi(e) {
  return yi.parse(e);
}
const ee = "usp";
function zi(e) {
  try {
    const t = bi(e);
    return Ee(
      "bootstrap",
      "Config resolved",
      t
    ), Object.freeze(t);
  } catch (t) {
    throw Ee(
      "bootstrap",
      "Invalid widget contract",
      t instanceof Error ? t.message : t,
      "error"
    ), t;
  }
}
const $e = ki();
function ki() {
  if (typeof window > "u")
    return [];
  const t = new URLSearchParams(window.location.search).get("re-debug");
  return t ? t === "1" || t === "all" ? ["all"] : t.split(",").map((n) => n.trim().toLowerCase()) : null;
}
const $i = () => $e && ($e.includes("all") || $e.includes(ee));
function Ee(e, t, n, r = "info") {
  if (!$i()) return;
  const o = {
    widget: `${ee}`,
    phase: e,
    message: t,
    data: n,
    ts: Date.now()
  }, i = `[${ee}] ${e}`;
  r === "error" ? console.error(i, o) : r === "warn" ? console.warn(i, o) : console.log(i, o);
}
const Ft = ({ slide: e, isActive: t }) => {
  const { text: n } = e;
  return /* @__PURE__ */ y.jsx(
    "div",
    {
      "data-usp-slide": !0,
      "data-usp-active": t || void 0,
      children: n
    }
  );
};
function Zi() {
  return /* @__PURE__ */ y.jsxs("div", { className: "usp-separator", children: [
    /* @__PURE__ */ y.jsx("span", {}),
    /* @__PURE__ */ y.jsx("span", {}),
    /* @__PURE__ */ y.jsx("span", {})
  ] });
}
function Oi({ slides: e, config: t }) {
  return /* @__PURE__ */ y.jsx("div", { className: `usp-static-bar ${t.theme || "light"}`, children: e.map((n, r) => /* @__PURE__ */ y.jsxs(Bt, { children: [
    /* @__PURE__ */ y.jsx(Ft, { slide: n, isActive: !1, tileMode: !0 }),
    r < e.length - 1 && /* @__PURE__ */ y.jsx(Zi, {})
  ] }, r)) });
}
function pt(e, t, n = ["Enter", " "]) {
  n.includes(e.key) && (e.preventDefault(), t());
}
function Si({ current: e, total: t, onChange: n }) {
  const r = () => n(e === 0 ? t - 1 : e - 1), o = () => n(e === t - 1 ? 0 : e + 1);
  return /* @__PURE__ */ y.jsxs("div", { className: "navigation-arrows", children: [
    /* @__PURE__ */ y.jsx("button", { className: "arrow-btn", onClick: r, onKeyDown: (i) => pt(i, r, ["ArrowLeft", "Enter", " "]), "data-usp-prev": !0, children: "‹" }),
    /* @__PURE__ */ y.jsx("button", { className: "arrow-btn", onClick: o, onKeyDown: (i) => pt(i, o, ["ArrowRight", "Enter", " "]), "data-usp-next": !0, children: "›" })
  ] });
}
function Ei({ slides: e, config: t }) {
  const [n, r] = ht(0);
  return /* @__PURE__ */ y.jsxs("div", { className: `usp-slider-bar ${t.theme || "light"}`, children: [
    /* @__PURE__ */ y.jsx(
      "div",
      {
        className: "usp-slider__inner",
        style: { transform: `translateX(-${n * 100}%)` },
        children: e.map((o, i) => /* @__PURE__ */ y.jsx(
          Ft,
          {
            slide: o,
            isActive: i === n,
            tileMode: !1
          },
          i
        ))
      }
    ),
    /* @__PURE__ */ y.jsx(
      Si,
      {
        current: n,
        total: e.length,
        onChange: r
      }
    )
  ] });
}
function Jt() {
  return /* @__PURE__ */ y.jsx("div", { style: { height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ y.jsx("span", { style: { opacity: 0.6 }, children: "Loading…" }) });
}
function Ti(e, t) {
  return e <= 480 ? t.settings.mode.mobile : e <= 768 ? t.settings.mode.tablet : t.settings.mode.desktop;
}
const Pi = ({ onStable: e, config: t }) => {
  const n = qt(null), [r, o] = ht(t.settings.mode.desktop);
  if (Me(() => {
    if (!n.current) return;
    const s = new ResizeObserver(([c]) => {
      const a = c.contentRect.width;
      o((f) => {
        const d = Ti(a, t);
        return f === d ? f : d;
      });
    });
    return s.observe(n.current), () => s.disconnect();
  }, [t]), Me(() => {
    const s = requestAnimationFrame(() => {
      e?.();
    });
    return () => cancelAnimationFrame(s);
  }, []), t.data.slides.length === 0)
    return /* @__PURE__ */ y.jsx(Jt, {});
  const i = r === "slider" ? /* @__PURE__ */ y.jsx(Ei, { slides: t.data.slides, config: t.settings }) : /* @__PURE__ */ y.jsx(Oi, { slides: t.data.slides, config: t.settings });
  return /* @__PURE__ */ y.jsx("div", { ref: n, children: i });
}, ji = ({ rawConfig: e, onStable: t }) => {
  const n = zi(e);
  return n ? n.data.slides.length === 0 ? /* @__PURE__ */ y.jsx(Jt, {}) : /* @__PURE__ */ y.jsx(Pi, { onStable: t, config: n }) : null;
};
function Ri(e) {
  return e.classList.add(`reactedge-${ee}`), e;
}
async function Ai(e, t) {
  const n = Ri(e);
  Ee("bootstrap", "Widget mounted", e);
  const r = /* @__PURE__ */ y.jsx(
    ji,
    {
      rawConfig: t
    }
  );
  Gt(n).render(r);
}
const Ii = async (e, t) => {
  await Ai(e, t);
}, Ci = { mount: Ii };
window[`ReactEdge_${ee}`] = Ci;
export {
  Ii as mount
};
