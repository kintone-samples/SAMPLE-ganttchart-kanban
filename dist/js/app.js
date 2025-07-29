!(function () {
  var e,
    t = {
      79503: function (e, t, n) {
        "use strict";
        var r,
          a = n(88066),
          o = n.n(a),
          i = n(61577),
          l = n.n(i),
          c = n(67294),
          u = n(73935),
          d = n(13710),
          s = n(45567),
          p = n(11006),
          f = n.n(p),
          v = n(50047),
          m = n.n(v),
          w = n(53791),
          g =
            (n(45659),
            function (e) {
              var t = e.onViewModeChange;
              return c.createElement(
                c.Fragment,
                null,
                c.createElement(
                  d.ZP.Group,
                  {
                    defaultValue: w.w.Day,
                    buttonStyle: "solid",
                    onChange: function (e) {
                      return t(e.target.value);
                    },
                  },
                  c.createElement(
                    d.ZP.Button,
                    { value: w.w.QuarterDay },
                    w.w.QuarterDay
                  ),
                  c.createElement(
                    d.ZP.Button,
                    { value: w.w.HalfDay },
                    w.w.HalfDay
                  ),
                  c.createElement(d.ZP.Button, { value: w.w.Day }, w.w.Day),
                  c.createElement(d.ZP.Button, { value: w.w.Week }, w.w.Week),
                  c.createElement(d.ZP.Button, { value: w.w.Month }, w.w.Month)
                )
              );
            }),
          h = n(33938),
          E = n(90),
          y = n.n(E),
          k = n(89356),
          b = n.n(k),
          C = n(63109),
          Z = n.n(C),
          D = n(16904),
          S = n(55687),
          P = n.n(S),
          x = function (e) {
            return new D.KintoneRestAPIClient().record.getRecords({
              app: kintone.app.getId(),
              query: "".concat(e || "", " order by $id asc"),
            });
          },
          O = (function () {
            var e = (0, h.Z)(
              Z().mark(function e(t, n) {
                return Z().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          (e.next = 2),
                          new D.KintoneRestAPIClient().record.updateRecord({
                            app: kintone.app.getId(),
                            id: t,
                            record: { status: { value: n } },
                          })
                        );
                      case 2:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            );
            return function (t, n) {
              return e.apply(this, arguments);
            };
          })(),
          M = (function () {
            var e = (0, h.Z)(
              Z().mark(function e(t, n, r) {
                return Z().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          (e.next = 2),
                          new D.KintoneRestAPIClient().record.updateRecord({
                            app: kintone.app.getId(),
                            id: t,
                            record: {
                              startDate: { value: n },
                              endDate: { value: r },
                            },
                          })
                        );
                      case 2:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            );
            return function (t, n, r) {
              return e.apply(this, arguments);
            };
          })(),
          F = (function () {
            var e = (0, h.Z)(
              Z().mark(function e(t, n) {
                var r, a, o, i, l, c;
                return Z().wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        return (
                          (e.next = 2),
                          kintone.Promise.all([
                            new D.KintoneRestAPIClient().app.getFormFields({
                              app: kintone.app.getId(),
                            }),
                            x(n),
                          ])
                        );
                      case 2:
                        (r = e.sent),
                          (a = (0, s.Z)(r, 2)),
                          (o = a[0]),
                          (i = a[1]),
                          (l = new (y())()),
                          (c = new (y())()),
                          b()(o.properties.type.options).forEach(function (e) {
                            l.set(e, P()(e));
                          }),
                          b()(o.properties.status.options).forEach(function (
                            e
                          ) {
                            c.set(e, o.properties.status.options[e].index);
                          }),
                          t(i.records, c, l);
                      case 11:
                      case "end":
                        return e.stop();
                    }
                }, e);
              })
            );
            return function (t, n) {
              return e.apply(this, arguments);
            };
          })(),
          T = n(11382),
          B = n(74938),
          I = function (e) {
            var t = e.query,
              n = void 0 === t ? "" : t,
              r = c.useState(w.w.Day),
              a = (0, s.Z)(r, 2),
              o = a[0],
              i = a[1],
              l = c.useState(),
              u = (0, s.Z)(l, 2),
              d = u[0],
              p = u[1],
              v = c.useState(!0),
              h = (0, s.Z)(v, 2),
              E = h[0],
              y = h[1],
              k = 60;
            o === w.w.Month ? (k = 300) : o === w.w.Week && (k = 250);
            (0, c.useEffect)(function () {
              F(C, n);
            }, []);
            var b,
              C = function (e, t, n) {
                0 === e.length
                  ? y(!1)
                  : p(
                      m()(e).call(e, function (e) {
                        return {
                          id: e.$id.value,
                          name: e.summary.value,
                          start: new Date(
                            e.startDate.value + "T00:00:00.000+09:00"
                          ),
                          end: new Date(
                            e.endDate.value + "T23:59:59.000+09:00"
                          ),
                          progress: Math.ceil(
                            (100 * (t.get(e.status.value) || 0)) /
                              Math.max(t.size - 1, 1)
                          ),
                          styles: {
                            progressColor: n.get(e.type.value) || "#ff9e0d",
                            progressSelectedColor: "#ff9e0d",
                          },
                          dependencies: e.parent.value ? [e.parent.value] : [],
                        };
                      })
                    );
              };
            return (
              (b =
                d && d.length > 0
                  ? c.createElement(
                      "div",
                      null,
                      c.createElement(g, {
                        onViewModeChange: function (e) {
                          return i(e);
                        },
                      }),
                      c.createElement(w.A, {
                        tasks: d,
                        viewMode: o,
                        onDateChange: function (e) {
                          var t = new Date(
                              e.start.getTime() -
                                60 * e.start.getTimezoneOffset() * 1e3
                            )
                              .toISOString()
                              .split("T")[0],
                            n = new Date(
                              e.end.getTime() -
                                60 * e.end.getTimezoneOffset() * 1e3
                            )
                              .toISOString()
                              .split("T")[0];
                          M(e.id, t, n);
                        },
                        onDoubleClick: function (e) {
                          var t =
                            window.location.protocol +
                            "//" +
                            window.location.host +
                            window.location.pathname +
                            "show#record=" +
                            e.id;
                          window.location.assign(
                            f()(t).call(t, "showshow", "show")
                          );
                        },
                        listCellWidth: "155px",
                        columnWidth: k,
                        todayColor: "#FCFF19",
                      })
                    )
                  : E
                  ? c.createElement(
                      "div",
                      { className: "center" },
                      c.createElement(T.Z, { size: "large", tip: "Loading..." })
                    )
                  : c.createElement(B.ZP, { title: "No data" })),
              c.createElement(c.Fragment, null, b)
            );
          },
          z = n(79183),
          j = n(52675),
          A = n(29094),
          G = n(60331),
          $ = j.Z.Meta,
          H = function (e) {
            var t;
            return c.createElement(
              A.C.Group,
              {
                maxCount: 2,
                size: "large",
                maxStyle: { color: "#f56a00", backgroundColor: "#fde3cf" },
              },
              m()((t = e.assignee.value)).call(t, function (e) {
                return c.createElement(
                  A.C,
                  { style: { backgroundColor: "#15dad2" }, key: e.code },
                  e.name
                );
              })
            );
          },
          R = function (e) {
            var t;
            return c.createElement(
              j.Z,
              {
                extra: c.createElement(G.Z, { color: e.labelColor }, e.label),
                style: { width: 300 },
                title: e.title,
                onClick: e.onClick,
              },
              c.createElement($, {
                avatar: c.createElement(H, { assignee: e.assignee }),
                title: o()((t = "".concat(e.startDate.substring(5), "~"))).call(
                  t,
                  e.endDate.substring(5)
                ),
                description: e.description,
              })
            );
          },
          K = function () {
            var e = c.useState(),
              t = (0, s.Z)(e, 2),
              n = t[0],
              r = t[1],
              a = c.useState(!0),
              o = (0, s.Z)(a, 2),
              i = o[0],
              l = o[1],
              u = function (e, t, n) {
                if (0 === e.length) l(!1);
                else {
                  var a = new Array(t.size);
                  t.forEach(function (e, t) {
                    a[e] = { id: t, title: t, cards: new Array() };
                  }),
                    e.forEach(function (e) {
                      return a[t.get(e.status.value)].cards.push({
                        id: e.$id.value,
                        title: e.summary.value,
                        label: e.type.value,
                        labelColor: n.get(e.type.value),
                        description: e.detail.value,
                        assignee: e.assignee,
                        startDate: e.startDate.value,
                        endDate: e.endDate.value,
                      });
                    }),
                    r({ lanes: a });
                }
              };
            (0, c.useEffect)(function () {
              F(u, kintone.app.getQueryCondition() || void 0);
            }, []);
            var d;
            return (
              (d = n
                ? c.createElement(z.ZP, {
                    data: n,
                    draggable: !0,
                    onCardClick: function (e) {
                      var t =
                        window.location.protocol +
                        "//" +
                        window.location.host +
                        window.location.pathname +
                        "show#record=" +
                        e;
                      window.location.assign(t);
                    },
                    hideCardDeleteIcon: !0,
                    handleDragEnd: function (e, t, n) {
                      O(e, n);
                    },
                    style: { padding: "30px 20px", backgroundColor: "#5F9AF8" },
                    components: { Card: R },
                  })
                : i
                ? c.createElement(
                    "div",
                    { className: "center" },
                    c.createElement(T.Z, { size: "large", tip: "Loading..." })
                  )
                : c.createElement(B.ZP, { title: "No data" })),
              c.createElement(c.Fragment, null, d)
            );
          };
        !(function (e) {
          (e.Gantt = "Gantt"), (e.Board = "Kanban");
        })(r || (r = {}));
        var W = function () {
            return (
              (0, c.useEffect)(function () {
                u.render(
                  c.createElement(K, null),
                  kintone.app.getHeaderSpaceElement()
                );
              }, []),
              c.createElement(
                c.Fragment,
                null,
                c.createElement(
                  d.ZP.Group,
                  {
                    defaultValue: r.Board,
                    buttonStyle: "solid",
                    size: "large",
                    onChange: function (e) {
                      e.target.value === r.Gantt
                        ? u.render(
                            c.createElement(I, {
                              query: kintone.app.getQueryCondition() || void 0,
                            }),
                            kintone.app.getHeaderSpaceElement()
                          )
                        : u.render(
                            c.createElement(K, null),
                            kintone.app.getHeaderSpaceElement()
                          );
                    },
                  },
                  c.createElement(d.ZP.Button, { value: r.Gantt }, r.Gantt),
                  c.createElement(d.ZP.Button, { value: r.Board }, r.Board)
                )
              )
            );
          },
          q = n(88440),
          N = n(76222),
          Q = n(42579),
          V = function (e) {
            var t = e.id,
              n = void 0 === t ? "" : t;
            return c.createElement(
              q.Z,
              { title: "add sub task" },
              c.createElement(N.Z, {
                type: "primary",
                shape: "circle",
                icon: c.createElement(Q.Z, null),
                size: "large",
                onClick: function () {
                  if (n) {
                    var e =
                      window.location.protocol +
                      "//" +
                      window.location.host +
                      window.location.pathname +
                      "edit?pid=" +
                      n;
                    window.location.assign(f()(e).call(e, "showedit", "edit"));
                  }
                },
              })
            );
          };
        kintone.events.on("app.record.index.show", function (e) {
          return (
            u.render(
              c.createElement(W, null),
              kintone.app.getHeaderMenuSpaceElement()
            ),
            e
          );
        }),
          kintone.events.on("app.record.detail.show", function (e) {
            var t,
              n = o()(
                (t = "parent = ".concat(e.record.$id.value, " or $id= "))
              ).call(t, e.record.$id.value);
            return (
              e.record.parent.value &&
                (n += " or $id = ".concat(e.record.parent.value)),
              u.render(
                c.createElement(I, { query: n }),
                kintone.app.record.getHeaderMenuSpaceElement()
              ),
              u.render(
                c.createElement(V, { id: e.record.$id.value }),
                kintone.app.record.getSpaceElement("addSub")
              ),
              e
            );
          }),
          kintone.events.on("app.record.create.show", function (e) {
            var t = window.location.search,
              n = new (l())(t).get("pid");
            return n && (e.record.parent.value = n), e;
          });
      },
      24654: function () {},
    },
    n = {};
  function r(e) {
    var a = n[e];
    if (void 0 !== a) return a.exports;
    var o = (n[e] = { id: e, loaded: !1, exports: {} });
    return t[e].call(o.exports, o, o.exports, r), (o.loaded = !0), o.exports;
  }
  (r.m = t),
    (e = []),
    (r.O = function (t, n, a, o) {
      if (!n) {
        var i = 1 / 0;
        for (d = 0; d < e.length; d++) {
          (n = e[d][0]), (a = e[d][1]), (o = e[d][2]);
          for (var l = !0, c = 0; c < n.length; c++)
            (!1 & o || i >= o) &&
            Object.keys(r.O).every(function (e) {
              return r.O[e](n[c]);
            })
              ? n.splice(c--, 1)
              : ((l = !1), o < i && (i = o));
          if (l) {
            e.splice(d--, 1);
            var u = a();
            void 0 !== u && (t = u);
          }
        }
        return t;
      }
      o = o || 0;
      for (var d = e.length; d > 0 && e[d - 1][2] > o; d--) e[d] = e[d - 1];
      e[d] = [n, a, o];
    }),
    (r.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return r.d(t, { a: t }), t;
    }),
    (r.d = function (e, t) {
      for (var n in t)
        r.o(t, n) &&
          !r.o(e, n) &&
          Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
    }),
    (r.g = (function () {
      if ("object" == typeof globalThis) return globalThis;
      try {
        return this || new Function("return this")();
      } catch (e) {
        if ("object" == typeof window) return window;
      }
    })()),
    (r.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (r.r = function (e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (r.nmd = function (e) {
      return (e.paths = []), e.children || (e.children = []), e;
    }),
    (function () {
      var e = { 143: 0 };
      r.O.j = function (t) {
        return 0 === e[t];
      };
      var t = function (t, n) {
          var a,
            o,
            i = n[0],
            l = n[1],
            c = n[2],
            u = 0;
          if (
            i.some(function (t) {
              return 0 !== e[t];
            })
          ) {
            for (a in l) r.o(l, a) && (r.m[a] = l[a]);
            if (c) var d = c(r);
          }
          for (t && t(n); u < i.length; u++)
            (o = i[u]), r.o(e, o) && e[o] && e[o][0](), (e[o] = 0);
          return r.O(d);
        },
        n = (self.webpackChunkkpm = self.webpackChunkkpm || []);
      n.forEach(t.bind(null, 0)), (n.push = t.bind(null, n.push.bind(n)));
    })();
  var a = r.O(void 0, [351], function () {
    return r(79503);
  });
  a = r.O(a);
})();
