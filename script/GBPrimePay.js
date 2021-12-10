!(function (e) {
  var n = {};
  function t(o) {
    if (n[o]) return n[o].exports;
    var r = (n[o] = { i: o, l: !1, exports: {} });
    return e[o].call(r.exports, r, r.exports, t), (r.l = !0), r.exports;
  }
  (t.m = e),
    (t.c = n),
    (t.d = function (e, n, o) {
      t.o(e, n) || Object.defineProperty(e, n, { enumerable: !0, get: o });
    }),
    (t.r = function (e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (t.t = function (e, n) {
      if ((1 & n && (e = t(e)), 8 & n)) return e;
      if (4 & n && "object" == typeof e && e && e.__esModule) return e;
      var o = Object.create(null);
      if (
        (t.r(o),
        Object.defineProperty(o, "default", { enumerable: !0, value: e }),
        2 & n && "string" != typeof e)
      )
        for (var r in e)
          t.d(
            o,
            r,
            function (n) {
              return e[n];
            }.bind(null, r)
          );
      return o;
    }),
    (t.n = function (e) {
      var n =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return t.d(n, "a", n), n;
    }),
    (t.o = function (e, n) {
      return Object.prototype.hasOwnProperty.call(e, n);
    }),
    (t.p = ""),
    t((t.s = 3));
})([
  function (e, n, t) {
    "use strict";
    var o = (e) => {
      return {
        dev: { host: "http://localhost:8280/" },
        test: { host: "https://api.globalprimepay.com/" },
        prd: { host: "https://api.gbprimepay.com/" },
      }[e || "prd"];
    };
    t.d(n, "a", function () {
      return c;
    });
    const r = [
        "left: 0px",
        "top: 0px",
        "width: 100%",
        "height: 100%",
        "z-index: 2147483647",
        "padding: 0",
        "margin: 0",
        "border: 0 none transparent",
        "background-color: rgba(0, 0, 0, 0)",
        "overflow-x: hidden",
        "overflow-y: auto",
        "-webkit-tap-highlight-color: transparent",
      ],
      a = {
        iframe: "gbprimepay-iframe",
        token: "gbToken",
        rememberCard: "gbRememberCard",
      };
    class i {
      constructor(e) {
        return (
          i.instance ||
            ((this.publicKey = e.publicKey),
            (this.gbForm = e.gbForm),
            (this.merchantForm = e.merchantForm),
            (this.customStyle = e.customStyle),
            (this.amount = e.amount),
            (this._rpc = null),
            (this.iframe = null),
            (this.env = e.env),
            (this.host = o(this.env).host),
            this.createIframe(),
            this.createInputToken(),
            this.createInputRememberCard(),
            (i.instance = this)),
          i.instance
        );
      }
      setPublicKey(e) {
        return (this.publicKey = e), this.publicKey;
      }
      createIframe() {
        console.log(this.amount);
        let e = "";
        this.amount && (e = `?amount=${this.amount}`);
        const n = `${this.host}payment-customer-2${e}`;
        let t = document.createElement("iframe");
        (t.id = a.iframe),
          (t.src = n),
          t.setAttribute("style", r.join("; ")),
          (this.iframe = t),
          document.querySelector(this.gbForm).appendChild(t),
          ((
            t.contentDocument || t.contentWindow.document
          ).body.style.backgroundColor = "red");
      }
      createInputToken() {
        const e = document.createElement("input");
        (e.type = "hidden"),
          (e.name = a.token),
          document.querySelector(this.merchantForm).appendChild(e);
      }
      createInputRememberCard() {
        const e = document.createElement("input");
        (e.type = "hidden"),
          (e.name = a.rememberCard),
          document.querySelector(this.merchantForm).appendChild(e);
      }
      updateInputToken(e) {
        document.querySelector(`input[name='${a.token}']`).value = e;
      }
      updateInputRememberCard(e) {
        document.querySelector(`input[name='${a.rememberCard}']`).value = e;
      }
      initialStyleIframe() {
        if (
          void 0 !== this.customStyle &&
          void 0 !== this.customStyle.backgroundColor
        ) {
          const e = {
            type: "init-style",
            color: this.customStyle.backgroundColor,
          };
          document
            .querySelector(`#${a.iframe}`)
            .contentWindow.postMessage(JSON.stringify(e), "*");
        }
      }
      requestToken(e) {
        this.updateInputToken(), e("ok");
      }
      createToken(e = {}) {
        let n = this._rpc;
        n ||
          ((n = new easyXDM.Rpc(
            { remote: `${this.host}provider` },
            { remote: { request: {} } }
          )),
          (this._rpc = n));
        const t = e.expiry.split(" / ");
        n.request(
          {
            publicKey: this.publicKey,
            data: {
              rememberCard: e.rememberCard,
              card: {
                number: e.number,
                expirationMonth: t[0],
                expirationYear: t[1],
                securityCode: e.cvc,
                name: "",
              },
            },
          },
          function (e) {
            const n = new i();
            "00" !== e.resultCode
              ? n.handleErrorCreateToken(e)
              : (n.updateInputToken(e.card.token),
                n.updateInputRememberCard(e.rememberCard),
                document.querySelector(n.merchantForm).submit());
          },
          function (e) {
            new i().handleErrorCreateToken({ resultCode: "XX" });
          }
        );
      }
      handleErrorCreateToken(e) {
        let n = "";
        switch (e.resultCode) {
          case "02":
            n = "Invalid data";
            break;
          case "54":
            n = "Expired Card";
            break;
          default:
            n = "System error";
        }
        if (
          void 0 !== document.querySelector(`#${a.iframe}`) &&
          null !== document.querySelector(`#${a.iframe}`)
        ) {
          const e = { type: "createToken-error", errorMessage: n };
          document
            .querySelector(`#${a.iframe}`)
            .contentWindow.postMessage(JSON.stringify(e), "*");
        }
      }
    }
    n.b = i;
    const c = (e) => {
      try {
        const n = JSON.parse(e.data),
          t = new i();
        switch (n.type) {
          case "card-info":
            t.createToken(n);
            break;
          case "init-style-request":
            t.initialStyleIframe();
        }
      } catch (e) {}
    };
  },
  function (e, n) {
    !(function (e, n, t, o, r, a) {
      var i,
        c,
        s,
        u,
        l,
        p = this,
        d = Math.floor(1e4 * Math.random()),
        f = Function.prototype,
        m = /^((http.?:)\/\/([^:\/\s]+)(:\d+)*)/,
        h = /[\-\w]+\/\.\.\//,
        g = /([^:])\/\//g,
        y = "",
        v = {},
        b = e.easyXDM,
        w = "easyXDM_",
        k = !1;
      function _(e, n) {
        var t = typeof e[n];
        return "function" == t || !("object" != t || !e[n]) || "unknown" == t;
      }
      function x() {
        var e,
          n = "Shockwave Flash",
          t = "application/x-shockwave-flash";
        if (!I(navigator.plugins) && "object" == typeof navigator.plugins[n]) {
          var o = navigator.plugins[n].description;
          o &&
            !I(navigator.mimeTypes) &&
            navigator.mimeTypes[t] &&
            navigator.mimeTypes[t].enabledPlugin &&
            (c = o.match(/\d+/g));
        }
        if (!c)
          try {
            (e = new ActiveXObject("ShockwaveFlash.ShockwaveFlash")),
              (c = Array.prototype.slice.call(
                e.GetVariable("$version").match(/(\d+),(\d+),(\d+),(\d+)/),
                1
              )),
              (e = null);
          } catch (e) {}
        if (!c) return !1;
        var r = parseInt(c[0], 10),
          a = parseInt(c[1], 10);
        return (s = r > 9 && a > 0), !0;
      }
      if (_(e, "addEventListener"))
        (u = function (e, n, t) {
          e.addEventListener(n, t, !1);
        }),
          (l = function (e, n, t) {
            e.removeEventListener(n, t, !1);
          });
      else {
        if (!_(e, "attachEvent")) throw new Error("Browser not supported");
        (u = function (e, n, t) {
          e.attachEvent("on" + n, t);
        }),
          (l = function (e, n, t) {
            e.detachEvent("on" + n, t);
          });
      }
      var O,
        S = !1,
        C = [];
      function M() {
        if (!S) {
          S = !0;
          for (var e = 0; e < C.length; e++) C[e]();
          C.length = 0;
        }
      }
      if (
        ("readyState" in n
          ? ((O = n.readyState),
            (S =
              "complete" == O ||
              (~navigator.userAgent.indexOf("AppleWebKit/") &&
                ("loaded" == O || "interactive" == O))))
          : (S = !!n.body),
        !S)
      ) {
        if (_(e, "addEventListener")) u(n, "DOMContentLoaded", M);
        else if (
          (u(n, "readystatechange", function () {
            "complete" == n.readyState && M();
          }),
          n.documentElement.doScroll && e === top)
        ) {
          var T = function () {
            if (!S) {
              try {
                n.documentElement.doScroll("left");
              } catch (e) {
                return void o(T, 1);
              }
              M();
            }
          };
          T();
        }
        u(e, "load", M);
      }
      function E(e, n) {
        S
          ? e.call(n)
          : C.push(function () {
              e.call(n);
            });
      }
      function F(e) {
        return e.match(m)[3];
      }
      function P(e) {
        var n = e.toLowerCase().match(m),
          t = n[2],
          o = n[3],
          r = n[4] || "";
        return (
          (("http:" == t && ":80" == r) || ("https:" == t && ":443" == r)) &&
            (r = ""),
          t + "//" + o + r
        );
      }
      function R(e) {
        if (!(e = e.replace(g, "$1/")).match(/^(http||https):\/\//)) {
          var n = "/" === e.substring(0, 1) ? "" : t.pathname;
          "/" !== n.substring(n.length - 1) &&
            (n = n.substring(0, n.lastIndexOf("/") + 1)),
            (e = t.protocol + "//" + t.host + n + e);
        }
        for (; h.test(e); ) e = e.replace(h, "");
        return e;
      }
      function N(e, n) {
        var t = "",
          o = e.indexOf("#");
        -1 !== o && ((t = e.substring(o)), (e = e.substring(0, o)));
        var r = [];
        for (var i in n) n.hasOwnProperty(i) && r.push(i + "=" + a(n[i]));
        return (
          e + (k ? "#" : -1 == e.indexOf("?") ? "?" : "&") + r.join("&") + t
        );
      }
      var j = (function (e) {
        for (var n, t = {}, o = (e = e.substring(1).split("&")).length; o--; )
          t[(n = e[o].split("="))[0]] = r(n[1]);
        return t;
      })(/xdm_e=/.test(t.search) ? t.search : t.hash);
      function I(e) {
        return void 0 === e;
      }
      var D = function () {
        var e = {},
          n = { a: [1, 2, 3] },
          t = '{"a":[1,2,3]}';
        return "undefined" != typeof JSON &&
          "function" == typeof JSON.stringify &&
          JSON.stringify(n).replace(/\s/g, "") === t
          ? JSON
          : (Object.toJSON &&
              Object.toJSON(n).replace(/\s/g, "") === t &&
              (e.stringify = Object.toJSON),
            "function" == typeof String.prototype.evalJSON &&
              (n = t.evalJSON()).a &&
              3 === n.a.length &&
              3 === n.a[2] &&
              (e.parse = function (e) {
                return e.evalJSON();
              }),
            e.stringify && e.parse
              ? ((D = function () {
                  return e;
                }),
                e)
              : null);
      };
      function H(e, n, t) {
        var o;
        for (var r in n)
          n.hasOwnProperty(r) &&
            (r in e
              ? "object" == typeof (o = n[r])
                ? H(e[r], o, t)
                : t || (e[r] = n[r])
              : (e[r] = n[r]));
        return e;
      }
      function q(e) {
        var t;
        I(i) &&
          (function () {
            var e = n.body.appendChild(n.createElement("form")),
              t = e.appendChild(n.createElement("input"));
            (t.name = w + "TEST" + d),
              (i = t !== e.elements[t.name]),
              n.body.removeChild(e);
          })(),
          i
            ? (t = n.createElement('<iframe name="' + e.props.name + '"/>'))
            : ((t = n.createElement("IFRAME")).name = e.props.name),
          (t.id = t.name = e.props.name),
          delete e.props.name,
          "string" == typeof e.container &&
            (e.container = n.getElementById(e.container)),
          e.container ||
            (H(t.style, { position: "absolute", top: "-2000px", left: "0px" }),
            (e.container = n.body));
        var o = e.props.src;
        if (
          ((e.props.src = "javascript:false"),
          H(t, e.props),
          (t.border = t.frameBorder = 0),
          (t.allowTransparency = !0),
          e.container.appendChild(t),
          e.onLoad && u(t, "load", e.onLoad),
          e.usePost)
        ) {
          var r,
            a = e.container.appendChild(n.createElement("form"));
          if (
            ((a.target = t.name),
            (a.action = o),
            (a.method = "POST"),
            "object" == typeof e.usePost)
          )
            for (var c in e.usePost)
              e.usePost.hasOwnProperty(c) &&
                (i
                  ? (r = n.createElement('<input name="' + c + '"/>'))
                  : ((r = n.createElement("INPUT")).name = c),
                (r.value = e.usePost[c]),
                a.appendChild(r));
          a.submit(), a.parentNode.removeChild(a);
        } else t.src = o;
        return (e.props.src = o), t;
      }
      function B(o) {
        var r,
          a = o.protocol;
        if (
          ((o.isHost = o.isHost || I(j.xdm_p)),
          (k = o.hash || !1),
          o.props || (o.props = {}),
          o.isHost)
        )
          (o.remote = R(o.remote)),
            (o.channel = o.channel || "default" + d++),
            (o.secret = Math.random().toString(16).substring(2)),
            I(a) &&
              (a =
                P(t.href) == P(o.remote)
                  ? "4"
                  : _(e, "postMessage") || _(n, "postMessage")
                  ? "1"
                  : o.swf && _(e, "ActiveXObject") && x()
                  ? "6"
                  : "Gecko" === navigator.product &&
                    "frameElement" in e &&
                    -1 == navigator.userAgent.indexOf("WebKit")
                  ? "5"
                  : o.remoteHelper
                  ? "2"
                  : "0");
        else if (
          ((o.channel = j.xdm_c.replace(/["'<>\\]/g, "")),
          (o.secret = j.xdm_s),
          (o.remote = j.xdm_e.replace(/["'<>\\]/g, "")),
          (a = j.xdm_p),
          o.acl &&
            !(function (e, n) {
              "string" == typeof e && (e = [e]);
              for (var t, o = e.length; o--; )
                if (
                  ((t = e[o]),
                  (t = new RegExp(
                    "^" == t.substr(0, 1)
                      ? t
                      : "^" +
                        t.replace(/(\*)/g, ".$1").replace(/\?/g, ".") +
                        "$"
                  )).test(n))
                )
                  return !0;
              return !1;
            })(o.acl, o.remote))
        )
          throw new Error("Access denied for " + o.remote);
        switch (((o.protocol = a), a)) {
          case "0":
            if (
              (H(
                o,
                {
                  interval: 100,
                  delay: 2e3,
                  useResize: !0,
                  useParent: !1,
                  usePolling: !1,
                },
                !0
              ),
              o.isHost)
            ) {
              if (!o.local) {
                for (
                  var i,
                    s = t.protocol + "//" + t.host,
                    u = n.body.getElementsByTagName("img"),
                    l = u.length;
                  l--;

                )
                  if ((i = u[l]).src.substring(0, s.length) === s) {
                    o.local = i.src;
                    break;
                  }
                o.local || (o.local = e);
              }
              var p = { xdm_c: o.channel, xdm_p: 0 };
              o.local === e
                ? ((o.usePolling = !0),
                  (o.useParent = !0),
                  (o.local =
                    t.protocol + "//" + t.host + t.pathname + t.search),
                  (p.xdm_e = o.local),
                  (p.xdm_pa = 1))
                : (p.xdm_e = R(o.local)),
                o.container && ((o.useResize = !1), (p.xdm_po = 1)),
                (o.remote = N(o.remote, p));
            } else
              H(o, {
                useParent: !I(j.xdm_pa),
                usePolling: !I(j.xdm_po),
                useResize: !o.useParent && o.useResize,
              });
            r = [
              new v.stack.HashTransport(o),
              new v.stack.ReliableBehavior({}),
              new v.stack.QueueBehavior({
                encode: !0,
                maxLength: 4e3 - o.remote.length,
              }),
              new v.stack.VerifyBehavior({ initiate: o.isHost }),
            ];
            break;
          case "1":
            r = [new v.stack.PostMessageTransport(o)];
            break;
          case "2":
            o.isHost && (o.remoteHelper = R(o.remoteHelper)),
              (r = [
                new v.stack.NameTransport(o),
                new v.stack.QueueBehavior(),
                new v.stack.VerifyBehavior({ initiate: o.isHost }),
              ]);
            break;
          case "3":
            r = [new v.stack.NixTransport(o)];
            break;
          case "4":
            r = [new v.stack.SameOriginTransport(o)];
            break;
          case "5":
            r = [new v.stack.FrameElementTransport(o)];
            break;
          case "6":
            c || x(), (r = [new v.stack.FlashTransport(o)]);
        }
        return (
          r.push(new v.stack.QueueBehavior({ lazy: o.lazy, remove: !0 })), r
        );
      }
      function J(e) {
        for (
          var n,
            t = {
              incoming: function (e, n) {
                this.up.incoming(e, n);
              },
              outgoing: function (e, n) {
                this.down.outgoing(e, n);
              },
              callback: function (e) {
                this.up.callback(e);
              },
              init: function () {
                this.down.init();
              },
              destroy: function () {
                this.down.destroy();
              },
            },
            o = 0,
            r = e.length;
          o < r;
          o++
        )
          H((n = e[o]), t, !0),
            0 !== o && (n.down = e[o - 1]),
            o !== r - 1 && (n.up = e[o + 1]);
        return n;
      }
      H(v, {
        version: "2.4.20.7",
        query: j,
        stack: {},
        apply: H,
        getJSONObject: D,
        whenReady: E,
        noConflict: function (n) {
          return (
            (e.easyXDM = b),
            (y = n) && (w = "easyXDM_" + y.replace(".", "_") + "_"),
            v
          );
        },
      }),
        (v.DomHelper = {
          on: u,
          un: l,
          requiresJSON: function (t) {
            (function (e, n) {
              return !("object" != typeof e[n] || !e[n]);
            })(e, "JSON") ||
              n.write(
                '<script type="text/javascript" src="' + t + '"></script>'
              );
          },
        }),
        (function () {
          var e = {};
          v.Fn = {
            set: function (n, t) {
              e[n] = t;
            },
            get: function (n, t) {
              if (e.hasOwnProperty(n)) {
                var o = e[n];
                return t && delete e[n], o;
              }
            },
          };
        })(),
        (v.Socket = function (e) {
          var n = J(
              B(e).concat([
                {
                  incoming: function (n, t) {
                    e.onMessage(n, t);
                  },
                  callback: function (n) {
                    e.onReady && e.onReady(n);
                  },
                },
              ])
            ),
            t = P(e.remote);
          (this.origin = P(e.remote)),
            (this.destroy = function () {
              n.destroy();
            }),
            (this.postMessage = function (e) {
              n.outgoing(e, t);
            }),
            n.init();
        }),
        (v.Rpc = function (e, n) {
          if (n.local)
            for (var t in n.local)
              if (n.local.hasOwnProperty(t)) {
                var o = n.local[t];
                "function" == typeof o && (n.local[t] = { method: o });
              }
          var r = J(
            B(e).concat([
              new v.stack.RpcBehavior(this, n),
              {
                callback: function (n) {
                  e.onReady && e.onReady(n);
                },
              },
            ])
          );
          (this.origin = P(e.remote)),
            (this.destroy = function () {
              r.destroy();
            }),
            r.init();
        }),
        (v.stack.SameOriginTransport = function (e) {
          var n, r, a, i;
          return (n = {
            outgoing: function (e, n, t) {
              a(e), t && t();
            },
            destroy: function () {
              r && (r.parentNode.removeChild(r), (r = null));
            },
            onDOMReady: function () {
              (i = P(e.remote)),
                e.isHost
                  ? (H(e.props, {
                      src: N(e.remote, {
                        xdm_e: t.protocol + "//" + t.host + t.pathname,
                        xdm_c: e.channel,
                        xdm_p: 4,
                      }),
                      name: w + e.channel + "_provider",
                    }),
                    (r = q(e)),
                    v.Fn.set(e.channel, function (e) {
                      return (
                        (a = e),
                        o(function () {
                          n.up.callback(!0);
                        }, 0),
                        function (e) {
                          n.up.incoming(e, i);
                        }
                      );
                    }))
                  : ((a = (function () {
                      var e = parent;
                      if ("" !== y)
                        for (var n = 0, t = y.split("."); n < t.length; n++)
                          e = e[t[n]];
                      return e.easyXDM;
                    })().Fn.get(
                      e.channel,
                      !0
                    )(function (e) {
                      n.up.incoming(e, i);
                    })),
                    o(function () {
                      n.up.callback(!0);
                    }, 0));
            },
            init: function () {
              E(n.onDOMReady, n);
            },
          });
        }),
        (v.stack.FlashTransport = function (e) {
          var r, i, c, u, l;
          function d(e, n) {
            o(function () {
              r.up.incoming(e, c);
            }, 0);
          }
          function f(t) {
            var o = e.swf + "?host=" + e.isHost,
              r = "easyXDM_swf_" + Math.floor(1e4 * Math.random());
            v.Fn.set("flash_loaded" + t.replace(/[\-.]/g, "_"), function () {
              v.stack.FlashTransport[t].swf = u = l.firstChild;
              for (
                var e = v.stack.FlashTransport[t].queue, n = 0;
                n < e.length;
                n++
              )
                e[n]();
              e.length = 0;
            }),
              e.swfContainer
                ? (l =
                    "string" == typeof e.swfContainer
                      ? n.getElementById(e.swfContainer)
                      : e.swfContainer)
                : (H(
                    (l = n.createElement("div")).style,
                    s && e.swfNoThrottle
                      ? {
                          height: "20px",
                          width: "20px",
                          position: "fixed",
                          right: 0,
                          top: 0,
                        }
                      : {
                          height: "1px",
                          width: "1px",
                          position: "absolute",
                          overflow: "hidden",
                          right: 0,
                          top: 0,
                        }
                  ),
                  n.body.appendChild(l));
            var i =
              "callback=flash_loaded" +
              a(t.replace(/[\-.]/g, "_")) +
              "&proto=" +
              p.location.protocol +
              "&domain=" +
              a(F(p.location.href)) +
              "&port=" +
              a(
                (function (e) {
                  return e.match(m)[4] || "";
                })(p.location.href)
              ) +
              "&ns=" +
              a(y);
            l.innerHTML =
              "<object height='20' width='20' type='application/x-shockwave-flash' id='" +
              r +
              "' data='" +
              o +
              "'><param name='allowScriptAccess' value='always'></param><param name='wmode' value='transparent'><param name='movie' value='" +
              o +
              "'></param><param name='flashvars' value='" +
              i +
              "'></param><embed type='application/x-shockwave-flash' FlashVars='" +
              i +
              "' allowScriptAccess='always' wmode='transparent' src='" +
              o +
              "' height='1' width='1'></embed></object>";
          }
          return (r = {
            outgoing: function (n, t, o) {
              u.postMessage(e.channel, n.toString()), o && o();
            },
            destroy: function () {
              try {
                u.destroyChannel(e.channel);
              } catch (e) {}
              (u = null), i && (i.parentNode.removeChild(i), (i = null));
            },
            onDOMReady: function () {
              (c = e.remote),
                v.Fn.set("flash_" + e.channel + "_init", function () {
                  o(function () {
                    r.up.callback(!0);
                  });
                }),
                v.Fn.set("flash_" + e.channel + "_onMessage", d),
                (e.swf = R(e.swf));
              var n = F(e.swf),
                a = function () {
                  (v.stack.FlashTransport[n].init = !0),
                    (u = v.stack.FlashTransport[n].swf).createChannel(
                      e.channel,
                      e.secret,
                      P(e.remote),
                      e.isHost
                    ),
                    e.isHost &&
                      (s &&
                        e.swfNoThrottle &&
                        H(e.props, {
                          position: "fixed",
                          right: 0,
                          top: 0,
                          height: "20px",
                          width: "20px",
                        }),
                      H(e.props, {
                        src: N(e.remote, {
                          xdm_e: P(t.href),
                          xdm_c: e.channel,
                          xdm_p: 6,
                          xdm_s: e.secret,
                        }),
                        name: w + e.channel + "_provider",
                      }),
                      (i = q(e)));
                };
              v.stack.FlashTransport[n] && v.stack.FlashTransport[n].init
                ? a()
                : v.stack.FlashTransport[n]
                ? v.stack.FlashTransport[n].queue.push(a)
                : ((v.stack.FlashTransport[n] = { queue: [a] }), f(n));
            },
            init: function () {
              E(r.onDOMReady, r);
            },
          });
        }),
        (v.stack.PostMessageTransport = function (n) {
          var r, a, i, c;
          function s(e) {
            if ("string" == typeof e.data) {
              var o = (function (e) {
                if (e.origin) return P(e.origin);
                if (e.uri) return P(e.uri);
                if (e.domain) return t.protocol + "//" + e.domain;
                throw "Unable to retrieve the origin of the event";
              })(e);
              o == c &&
                e.data.substring(0, n.channel.length + 1) == n.channel + " " &&
                r.up.incoming(e.data.substring(n.channel.length + 1), o);
            }
          }
          function p(t) {
            t.data == n.channel + "-ready" &&
              ((i =
                "postMessage" in a.contentWindow
                  ? a.contentWindow
                  : a.contentWindow.document),
              l(e, "message", p),
              u(e, "message", s),
              o(function () {
                r.up.callback(!0);
              }, 0));
          }
          return (r = {
            outgoing: function (e, t, o) {
              i.postMessage(n.channel + " " + e, t || c), o && o();
            },
            destroy: function () {
              l(e, "message", p),
                l(e, "message", s),
                a && ((i = null), a.parentNode.removeChild(a), (a = null));
            },
            onDOMReady: function () {
              (c = P(n.remote)),
                n.isHost
                  ? (u(e, "message", p),
                    H(n.props, {
                      src: N(n.remote, {
                        xdm_e: P(t.href),
                        xdm_c: n.channel,
                        xdm_p: 1,
                      }),
                      name: w + n.channel + "_provider",
                    }),
                    (a = q(n)))
                  : (u(e, "message", s),
                    (i =
                      "postMessage" in e.parent
                        ? e.parent
                        : e.parent.document).postMessage(
                      n.channel + "-ready",
                      c
                    ),
                    o(function () {
                      r.up.callback(!0);
                    }, 0));
            },
            init: function () {
              E(r.onDOMReady, r);
            },
          });
        }),
        (v.stack.FrameElementTransport = function (r) {
          var a, i, c, s;
          return (a = {
            outgoing: function (e, n, t) {
              c.call(this, e), t && t();
            },
            destroy: function () {
              i && (i.parentNode.removeChild(i), (i = null));
            },
            onDOMReady: function () {
              (s = P(r.remote)),
                r.isHost
                  ? (H(r.props, {
                      src: N(r.remote, {
                        xdm_e: P(t.href),
                        xdm_c: r.channel,
                        xdm_p: 5,
                      }),
                      name: w + r.channel + "_provider",
                    }),
                    ((i = q(r)).fn = function (e) {
                      return (
                        delete i.fn,
                        (c = e),
                        o(function () {
                          a.up.callback(!0);
                        }, 0),
                        function (e) {
                          a.up.incoming(e, s);
                        }
                      );
                    }))
                  : (n.referrer &&
                      P(n.referrer) != j.xdm_e &&
                      (e.top.location = j.xdm_e),
                    (c = e.frameElement.fn(function (e) {
                      a.up.incoming(e, s);
                    })),
                    a.up.callback(!0));
            },
            init: function () {
              E(a.onDOMReady, a);
            },
          });
        }),
        (v.stack.NameTransport = function (e) {
          var n, t, r, a, i, c, s, u;
          function p(n) {
            var o = e.remoteHelper + (t ? "#_3" : "#_2") + e.channel;
            r.contentWindow.sendMessage(n, o);
          }
          function d() {
            t
              ? (2 != ++i && t) || n.up.callback(!0)
              : (p("ready"), n.up.callback(!0));
          }
          function f(e) {
            n.up.incoming(e, s);
          }
          function m() {
            c &&
              o(function () {
                c(!0);
              }, 0);
          }
          return (n = {
            outgoing: function (e, n, t) {
              (c = t), p(e);
            },
            destroy: function () {
              r.parentNode.removeChild(r),
                (r = null),
                t && (a.parentNode.removeChild(a), (a = null));
            },
            onDOMReady: function () {
              (t = e.isHost),
                (i = 0),
                (s = P(e.remote)),
                (e.local = R(e.local)),
                t
                  ? (v.Fn.set(e.channel, function (n) {
                      t && "ready" === n && (v.Fn.set(e.channel, f), d());
                    }),
                    (u = N(e.remote, {
                      xdm_e: e.local,
                      xdm_c: e.channel,
                      xdm_p: 2,
                    })),
                    H(e.props, {
                      src: u + "#" + e.channel,
                      name: w + e.channel + "_provider",
                    }),
                    (a = q(e)))
                  : ((e.remoteHelper = e.remote), v.Fn.set(e.channel, f));
              var n = function () {
                var t = r || this;
                l(t, "load", n),
                  v.Fn.set(e.channel + "_load", m),
                  (function e() {
                    "function" == typeof t.contentWindow.sendMessage
                      ? d()
                      : o(e, 50);
                  })();
              };
              r = q({ props: { src: e.local + "#_4" + e.channel }, onLoad: n });
            },
            init: function () {
              E(n.onDOMReady, n);
            },
          });
        }),
        (v.stack.HashTransport = function (n) {
          var t, r, a, i, c, s, u, l, p, d;
          function f() {
            if (u) {
              var e = u.location.href,
                n = "",
                o = e.indexOf("#");
              -1 != o && (n = e.substring(o)),
                n &&
                  n != c &&
                  (function (e) {
                    (c = e), t.up.incoming(c.substring(c.indexOf("_") + 1), d);
                  })(n);
            }
          }
          function m() {
            a = setInterval(f, i);
          }
          return (t = {
            outgoing: function (e, t) {
              !(function (e) {
                if (l) {
                  var t = n.remote + "#" + s++ + "_" + e;
                  (r || !p ? l.contentWindow : l).location = t;
                }
              })(e);
            },
            destroy: function () {
              e.clearInterval(a),
                (!r && p) || l.parentNode.removeChild(l),
                (l = null);
            },
            onDOMReady: function () {
              if (
                ((r = n.isHost),
                (i = n.interval),
                (c = "#" + n.channel),
                (s = 0),
                (p = n.useParent),
                (d = P(n.remote)),
                r)
              ) {
                if (
                  (H(n.props, {
                    src: n.remote,
                    name: w + n.channel + "_provider",
                  }),
                  p)
                )
                  n.onLoad = function () {
                    (u = e), m(), t.up.callback(!0);
                  };
                else {
                  var a = 0,
                    f = n.delay / 50;
                  !(function e() {
                    if (++a > f)
                      throw new Error("Unable to reference listenerwindow");
                    try {
                      u = l.contentWindow.frames[w + n.channel + "_consumer"];
                    } catch (e) {}
                    u ? (m(), t.up.callback(!0)) : o(e, 50);
                  })();
                }
                l = q(n);
              } else
                (u = e),
                  m(),
                  p
                    ? ((l = parent), t.up.callback(!0))
                    : (H(n, {
                        props: {
                          src: n.remote + "#" + n.channel + new Date(),
                          name: w + n.channel + "_consumer",
                        },
                        onLoad: function () {
                          t.up.callback(!0);
                        },
                      }),
                      (l = q(n)));
            },
            init: function () {
              E(t.onDOMReady, t);
            },
          });
        }),
        (v.stack.ReliableBehavior = function (e) {
          var n,
            t,
            o = 0,
            r = 0,
            a = "";
          return (n = {
            incoming: function (e, i) {
              var c = e.indexOf("_"),
                s = e.substring(0, c).split(",");
              (e = e.substring(c + 1)),
                s[0] == o && ((a = ""), t && t(!0)),
                e.length > 0 &&
                  (n.down.outgoing(s[1] + "," + o + "_" + a, i),
                  r != s[1] && ((r = s[1]), n.up.incoming(e, i)));
            },
            outgoing: function (e, i, c) {
              (a = e), (t = c), n.down.outgoing(r + "," + ++o + "_" + e, i);
            },
          });
        }),
        (v.stack.QueueBehavior = function (e) {
          var n,
            t,
            i = [],
            c = !0,
            s = "",
            u = 0,
            l = !1,
            p = !1;
          function d() {
            if (e.remove && 0 === i.length)
              !(function (e) {
                (e.up.down = e.down),
                  (e.down.up = e.up),
                  (e.up = e.down = null);
              })(n);
            else if (!c && 0 !== i.length && !t) {
              c = !0;
              var r = i.shift();
              n.down.outgoing(r.data, r.origin, function (e) {
                (c = !1),
                  r.callback &&
                    o(function () {
                      r.callback(e);
                    }, 0),
                  d();
              });
            }
          }
          return (n = {
            init: function () {
              I(e) && (e = {}),
                e.maxLength && ((u = e.maxLength), (p = !0)),
                e.lazy ? (l = !0) : n.down.init();
            },
            callback: function (e) {
              c = !1;
              var t = n.up;
              d(), t.callback(e);
            },
            incoming: function (t, o) {
              if (p) {
                var a = t.indexOf("_"),
                  i = parseInt(t.substring(0, a), 10);
                (s += t.substring(a + 1)),
                  0 === i &&
                    (e.encode && (s = r(s)), n.up.incoming(s, o), (s = ""));
              } else n.up.incoming(t, o);
            },
            outgoing: function (t, o, r) {
              e.encode && (t = a(t));
              var c,
                s = [];
              if (p) {
                for (; 0 !== t.length; )
                  (c = t.substring(0, u)),
                    (t = t.substring(c.length)),
                    s.push(c);
                for (; (c = s.shift()); )
                  i.push({
                    data: s.length + "_" + c,
                    origin: o,
                    callback: 0 === s.length ? r : null,
                  });
              } else i.push({ data: t, origin: o, callback: r });
              l ? n.down.init() : d();
            },
            destroy: function () {
              (t = !0), n.down.destroy();
            },
          });
        }),
        (v.stack.VerifyBehavior = function (e) {
          var n, t, o;
          function r() {
            (t = Math.random().toString(16).substring(2)), n.down.outgoing(t);
          }
          return (n = {
            incoming: function (a, i) {
              var c = a.indexOf("_");
              -1 === c
                ? a === t
                  ? n.up.callback(!0)
                  : o || ((o = a), e.initiate || r(), n.down.outgoing(a))
                : a.substring(0, c) === o &&
                  n.up.incoming(a.substring(c + 1), i);
            },
            outgoing: function (e, o, r) {
              n.down.outgoing(t + "_" + e, o, r);
            },
            callback: function (n) {
              e.initiate && r();
            },
          });
        }),
        (v.stack.RpcBehavior = function (e, n) {
          var t,
            o = n.serializer || D(),
            r = 0,
            a = {};
          function i(e) {
            (e.jsonrpc = "2.0"), t.down.outgoing(o.stringify(e));
          }
          function c(e, n) {
            var t = Array.prototype.slice;
            return function () {
              var o,
                c = arguments.length,
                s = { method: n };
              c > 0 && "function" == typeof arguments[c - 1]
                ? (c > 1 && "function" == typeof arguments[c - 2]
                    ? ((o = {
                        success: arguments[c - 2],
                        error: arguments[c - 1],
                      }),
                      (s.params = t.call(arguments, 0, c - 2)))
                    : ((o = { success: arguments[c - 1] }),
                      (s.params = t.call(arguments, 0, c - 1))),
                  (a["" + ++r] = o),
                  (s.id = r))
                : (s.params = t.call(arguments, 0)),
                e.namedParams &&
                  1 === s.params.length &&
                  (s.params = s.params[0]),
                i(s);
            };
          }
          function s(e, n, t, o) {
            if (t) {
              var r, a;
              n
                ? ((r = function (e) {
                    (r = f), i({ id: n, result: e });
                  }),
                  (a = function (e, t) {
                    a = f;
                    var o = { id: n, error: { code: -32099, message: e } };
                    t && (o.error.data = t), i(o);
                  }))
                : (r = a = f),
                (function (e) {
                  return "[object Array]" === Object.prototype.toString.call(e);
                })(o) || (o = [o]);
              try {
                var c = t.method.apply(t.scope, o.concat([r, a]));
                I(c) || r(c);
              } catch (e) {
                a(e.message);
              }
            } else
              n &&
                i({
                  id: n,
                  error: { code: -32601, message: "Procedure not found." },
                });
          }
          return (t = {
            incoming: function (e, t) {
              var r = o.parse(e);
              if (r.method)
                n.handle
                  ? n.handle(r, i)
                  : s(r.method, r.id, n.local[r.method], r.params);
              else {
                var c = a[r.id];
                r.error
                  ? c.error && c.error(r.error)
                  : c.success && c.success(r.result),
                  delete a[r.id];
              }
            },
            init: function () {
              if (n.remote)
                for (var o in n.remote)
                  n.remote.hasOwnProperty(o) && (e[o] = c(n.remote[o], o));
              t.down.init();
            },
            destroy: function () {
              for (var o in n.remote)
                n.remote.hasOwnProperty(o) &&
                  e.hasOwnProperty(o) &&
                  delete e[o];
              t.down.destroy();
            },
          });
        }),
        (p.easyXDM = v);
    })(
      window,
      document,
      location,
      window.setTimeout,
      decodeURIComponent,
      encodeURIComponent
    );
  },
  function (e, n) {
    var t;
    t = (function () {
      return this;
    })();
    try {
      t = t || Function("return this")() || (0, eval)("this");
    } catch (e) {
      "object" == typeof window && (t = window);
    }
    e.exports = t;
  },
  function (e, n, t) {
    "use strict";
    t.r(n),
      function (e) {
        t(1);
        var n = t(0);
        window.addEventListener("message", n.a, !1), (e.GBPrimePay = n.b);
      }.call(this, t(2));
  },
]);
