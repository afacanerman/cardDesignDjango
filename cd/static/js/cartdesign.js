//fabric
var fabric = fabric || {
    version: "1.6.0-rc.1"
};
"undefined" != typeof exports && (exports.fabric = fabric), "undefined" != typeof document && "undefined" != typeof window ? (fabric.document = document, fabric.window = window, window.fabric = fabric) : (fabric.document = require("jsdom").jsdom("<!DOCTYPE html><html><head></head><body></body></html>"), fabric.document.createWindow ? fabric.window = fabric.document.createWindow() : fabric.window = fabric.document.parentWindow), fabric.isTouchSupported = "ontouchstart" in fabric.document.documentElement, fabric.isLikelyNode = "undefined" != typeof Buffer && "undefined" == typeof window, fabric.SHARED_ATTRIBUTES = ["display", "transform", "fill", "fill-opacity", "fill-rule", "opacity", "stroke", "stroke-dasharray", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "id"], fabric.DPI = 96, fabric.reNum = "(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:e[-+]?\\d+)?)", fabric.devicePixelRatio = fabric.window.devicePixelRatio || fabric.window.webkitDevicePixelRatio || fabric.window.mozDevicePixelRatio || 1,
    function() {
        function t(t, e) {
            this.__eventListeners[t] && (e ? fabric.util.removeFromArray(this.__eventListeners[t], e) : this.__eventListeners[t].length = 0)
        }

        function e(t, e) {
            if (this.__eventListeners || (this.__eventListeners = {}), 1 === arguments.length)
                for (var i in t) this.on(i, t[i]);
            else this.__eventListeners[t] || (this.__eventListeners[t] = []), this.__eventListeners[t].push(e);
            return this
        }

        function i(e, i) {
            if (this.__eventListeners) {
                if (0 === arguments.length) this.__eventListeners = {};
                else if (1 === arguments.length && "object" == typeof arguments[0])
                    for (var r in e) t.call(this, r, e[r]);
                else t.call(this, e, i);
                return this
            }
        }

        function r(t, e) {
            if (this.__eventListeners) {
                var i = this.__eventListeners[t];
                if (i) {
                    for (var r = 0, n = i.length; n > r; r++) i[r].call(this, e || {});
                    return this
                }
            }
        }
        fabric.Observable = {
            observe: e,
            stopObserving: i,
            fire: r,
            on: e,
            off: i,
            trigger: r
        }
    }(), fabric.Collection = {
        add: function() {
            this._objects.push.apply(this._objects, arguments);
            for (var t = 0, e = arguments.length; e > t; t++) this._onObjectAdded(arguments[t]);
            return this.renderOnAddRemove && this.renderAll(), this
        },
        insertAt: function(t, e, i) {
            var r = this.getObjects();
            return i ? r[e] = t : r.splice(e, 0, t), this._onObjectAdded(t), this.renderOnAddRemove && this.renderAll(), this
        },
        remove: function() {
            for (var t, e = this.getObjects(), i = 0, r = arguments.length; r > i; i++) t = e.indexOf(arguments[i]), -1 !== t && (e.splice(t, 1), this._onObjectRemoved(arguments[i]));
            return this.renderOnAddRemove && this.renderAll(), this
        },
        forEachObject: function(t, e) {
            for (var i = this.getObjects(), r = i.length; r--;) t.call(e, i[r], r, i);
            return this
        },
        getObjects: function(t) {
            return "undefined" == typeof t ? this._objects : this._objects.filter(function(e) {
                return e.type === t
            })
        },
        item: function(t) {
            return this.getObjects()[t]
        },
        isEmpty: function() {
            return 0 === this.getObjects().length
        },
        size: function() {
            return this.getObjects().length
        },
        contains: function(t) {
            return this.getObjects().indexOf(t) > -1
        },
        complexity: function() {
            return this.getObjects().reduce(function(t, e) {
                return t += e.complexity ? e.complexity() : 0
            }, 0)
        }
    },
    function(t) {
        var e = Math.sqrt,
            i = Math.atan2,
            r = Math.PI / 180;
        fabric.util = {
            removeFromArray: function(t, e) {
                var i = t.indexOf(e);
                return -1 !== i && t.splice(i, 1), t
            },
            getRandomInt: function(t, e) {
                return Math.floor(Math.random() * (e - t + 1)) + t
            },
            degreesToRadians: function(t) {
                return t * r
            },
            radiansToDegrees: function(t) {
                return t / r
            },
            rotatePoint: function(t, e, i) {
                t.subtractEquals(e);
                var r = Math.sin(i),
                    n = Math.cos(i),
                    s = t.x * n - t.y * r,
                    o = t.x * r + t.y * n;
                return new fabric.Point(s, o).addEquals(e)
            },
            transformPoint: function(t, e, i) {
                return i ? new fabric.Point(e[0] * t.x + e[2] * t.y, e[1] * t.x + e[3] * t.y) : new fabric.Point(e[0] * t.x + e[2] * t.y + e[4], e[1] * t.x + e[3] * t.y + e[5])
            },
            invertTransform: function(t) {
                var e = 1 / (t[0] * t[3] - t[1] * t[2]),
                    i = [e * t[3], -e * t[1], -e * t[2], e * t[0]],
                    r = fabric.util.transformPoint({
                        x: t[4],
                        y: t[5]
                    }, i, !0);
                return i[4] = -r.x, i[5] = -r.y, i
            },
            toFixed: function(t, e) {
                return parseFloat(Number(t).toFixed(e))
            },
            parseUnit: function(t, e) {
                var i = /\D{0,2}$/.exec(t),
                    r = parseFloat(t);
                switch (e || (e = fabric.Text.DEFAULT_SVG_FONT_SIZE), i[0]) {
                    case "mm":
                        return r * fabric.DPI / 25.4;
                    case "cm":
                        return r * fabric.DPI / 2.54;
                    case "in":
                        return r * fabric.DPI;
                    case "pt":
                        return r * fabric.DPI / 72;
                    case "pc":
                        return r * fabric.DPI / 72 * 12;
                    case "em":
                        return r * e;
                    default:
                        return r
                }
            },
            falseFunction: function() {
                return !1
            },
            getKlass: function(t, e) {
                return t = fabric.util.string.camelize(t.charAt(0).toUpperCase() + t.slice(1)), fabric.util.resolveNamespace(e)[t]
            },
            resolveNamespace: function(e) {
                if (!e) return fabric;
                for (var i = e.split("."), r = i.length, n = t || fabric.window, s = 0; r > s; ++s) n = n[i[s]];
                return n
            },
            loadImage: function(t, e, i, r) {
                if (!t) return void(e && e.call(i, t));
                var n = fabric.util.createImage();
                n.onload = function() {
                    e && e.call(i, n), n = n.onload = n.onerror = null
                }, n.onerror = function() {
                    fabric.log("Error loading " + n.src), e && e.call(i, null, !0), n = n.onload = n.onerror = null
                }, 0 !== t.indexOf("data") && "undefined" != typeof r && (n.crossOrigin = r), n.src = t
            },
            enlivenObjects: function(t, e, i, r) {
                function n() {
                    ++o === a && e && e(s)
                }
                t = t || [];
                var s = [],
                    o = 0,
                    a = t.length;
                return a ? void t.forEach(function(t, e) {
                    if (!t || !t.type) return void n();
                    var o = fabric.util.getKlass(t.type, i);
                    o.async ? o.fromObject(t, function(i, o) {
                        o || (s[e] = i, r && r(t, s[e])), n()
                    }) : (s[e] = o.fromObject(t), r && r(t, s[e]), n())
                }) : void(e && e(s))
            },
            groupSVGElements: function(t, e, i) {
                var r;
                return r = new fabric.PathGroup(t, e), "undefined" != typeof i && r.setSourcePath(i), r
            },
            populateWithProperties: function(t, e, i) {
                if (i && "[object Array]" === Object.prototype.toString.call(i))
                    for (var r = 0, n = i.length; n > r; r++) i[r] in t && (e[i[r]] = t[i[r]])
            },
            drawDashedLine: function(t, r, n, s, o, a) {
                var h = s - r,
                    c = o - n,
                    l = e(h * h + c * c),
                    u = i(c, h),
                    f = a.length,
                    d = 0,
                    g = !0;
                for (t.save(), t.translate(r, n), t.moveTo(0, 0), t.rotate(u), r = 0; l > r;) r += a[d++ % f], r > l && (r = l), t[g ? "lineTo" : "moveTo"](r, 0), g = !g;
                t.restore()
            },
            createCanvasElement: function(t) {
                return t || (t = fabric.document.createElement("canvas")), t.getContext || "undefined" == typeof G_vmlCanvasManager || G_vmlCanvasManager.initElement(t), t
            },
            createImage: function() {
                return fabric.isLikelyNode ? new(require("canvas").Image) : fabric.document.createElement("img")
            },
            createAccessors: function(t) {
                for (var e = t.prototype, i = e.stateProperties.length; i--;) {
                    var r = e.stateProperties[i],
                        n = r.charAt(0).toUpperCase() + r.slice(1),
                        s = "set" + n,
                        o = "get" + n;
                    e[o] || (e[o] = function(t) {
                        return new Function('return this.get("' + t + '")')
                    }(r)), e[s] || (e[s] = function(t) {
                        return new Function("value", 'return this.set("' + t + '", value)')
                    }(r))
                }
            },
            clipContext: function(t, e) {
                e.save(), e.beginPath(), t.clipTo(e), e.clip()
            },
            multiplyTransformMatrices: function(t, e) {
                return [t[0] * e[0] + t[2] * e[1], t[1] * e[0] + t[3] * e[1], t[0] * e[2] + t[2] * e[3], t[1] * e[2] + t[3] * e[3], t[0] * e[4] + t[2] * e[5] + t[4], t[1] * e[4] + t[3] * e[5] + t[5]]
            },
            getFunctionBody: function(t) {
                return (String(t).match(/function[^{]*\{([\s\S]*)\}/) || {})[1]
            },
            isTransparent: function(t, e, i, r) {
                r > 0 && (e > r ? e -= r : e = 0, i > r ? i -= r : i = 0);
                for (var n = !0, s = t.getImageData(e, i, 2 * r || 1, 2 * r || 1), o = 3, a = s.data.length; a > o; o += 4) {
                    var h = s.data[o];
                    if (n = 0 >= h, n === !1) break
                }
                return s = null, n
            },
            parsePreserveAspectRatioAttribute: function(t) {
                var e, i = "meet",
                    r = "Mid",
                    n = "Mid",
                    s = t.split(" ");
                return s && s.length && (i = s.pop(), "meet" !== i && "slice" !== i ? (e = i, i = "meet") : s.length && (e = s.pop())), r = "none" !== e ? e.slice(1, 4) : "none", n = "none" !== e ? e.slice(5, 8) : "none", {
                    meetOrSlice: i,
                    alignX: r,
                    alignY: n
                }
            }
        }
    }("undefined" != typeof exports ? exports : this),
    function() {
        function t(t, r, s, o, h, c, l) {
            var u = a.call(arguments);
            if (n[u]) return n[u];
            var f = Math.PI,
                d = l * f / 180,
                g = Math.sin(d),
                p = Math.cos(d),
                v = 0,
                b = 0;
            s = Math.abs(s), o = Math.abs(o);
            var m = -p * t * .5 - g * r * .5,
                y = -p * r * .5 + g * t * .5,
                _ = s * s,
                x = o * o,
                S = y * y,
                C = m * m,
                w = _ * x - _ * S - x * C,
                O = 0;
            if (0 > w) {
                var T = Math.sqrt(1 - w / (_ * x));
                s *= T, o *= T
            } else O = (h === c ? -1 : 1) * Math.sqrt(w / (_ * S + x * C));
            var k = O * s * y / o,
                j = -O * o * m / s,
                A = p * k - g * j + .5 * t,
                P = g * k + p * j + .5 * r,
                L = i(1, 0, (m - k) / s, (y - j) / o),
                M = i((m - k) / s, (y - j) / o, (-m - k) / s, (-y - j) / o);
            0 === c && M > 0 ? M -= 2 * f : 1 === c && 0 > M && (M += 2 * f);
            for (var I = Math.ceil(Math.abs(M / f * 2)), D = [], E = M / I, F = 8 / 3 * Math.sin(E / 4) * Math.sin(E / 4) / Math.sin(E / 2), R = L + E, B = 0; I > B; B++) D[B] = e(L, R, p, g, s, o, A, P, F, v, b), v = D[B][4], b = D[B][5], L = R, R += E;
            return n[u] = D, D
        }

        function e(t, e, i, r, n, o, h, c, l, u, f) {
            var d = a.call(arguments);
            if (s[d]) return s[d];
            var g = Math.cos(t),
                p = Math.sin(t),
                v = Math.cos(e),
                b = Math.sin(e),
                m = i * n * v - r * o * b + h,
                y = r * n * v + i * o * b + c,
                _ = u + l * (-i * n * p - r * o * g),
                x = f + l * (-r * n * p + i * o * g),
                S = m + l * (i * n * b + r * o * v),
                C = y + l * (r * n * b - i * o * v);
            return s[d] = [_, x, S, C, m, y], s[d]
        }

        function i(t, e, i, r) {
            var n = Math.atan2(e, t),
                s = Math.atan2(r, i);
            return s >= n ? s - n : 2 * Math.PI - (n - s)
        }

        function r(t, e, i, r, n, s, h, c) {
            var l = a.call(arguments);
            if (o[l]) return o[l];
            var u, f, d, g, p, v, b, m, y = Math.sqrt,
                _ = Math.min,
                x = Math.max,
                S = Math.abs,
                C = [],
                w = [
                    [],
                    []
                ];
            f = 6 * t - 12 * i + 6 * n, u = -3 * t + 9 * i - 9 * n + 3 * h, d = 3 * i - 3 * t;
            for (var O = 0; 2 > O; ++O)
                if (O > 0 && (f = 6 * e - 12 * r + 6 * s, u = -3 * e + 9 * r - 9 * s + 3 * c, d = 3 * r - 3 * e), S(u) < 1e-12) {
                    if (S(f) < 1e-12) continue;
                    g = -d / f, g > 0 && 1 > g && C.push(g)
                } else b = f * f - 4 * d * u, 0 > b || (m = y(b), p = (-f + m) / (2 * u), p > 0 && 1 > p && C.push(p), v = (-f - m) / (2 * u), v > 0 && 1 > v && C.push(v));
            for (var T, k, j, A = C.length, P = A; A--;) g = C[A], j = 1 - g, T = j * j * j * t + 3 * j * j * g * i + 3 * j * g * g * n + g * g * g * h, w[0][A] = T, k = j * j * j * e + 3 * j * j * g * r + 3 * j * g * g * s + g * g * g * c, w[1][A] = k;
            w[0][P] = t, w[1][P] = e, w[0][P + 1] = h, w[1][P + 1] = c;
            var L = [{
                x: _.apply(null, w[0]),
                y: _.apply(null, w[1])
            }, {
                x: x.apply(null, w[0]),
                y: x.apply(null, w[1])
            }];
            return o[l] = L, L
        }
        var n = {},
            s = {},
            o = {},
            a = Array.prototype.join;
        fabric.util.drawArc = function(e, i, r, n) {
            for (var s = n[0], o = n[1], a = n[2], h = n[3], c = n[4], l = n[5], u = n[6], f = [
                    [],
                    [],
                    [],
                    []
                ], d = t(l - i, u - r, s, o, h, c, a), g = 0, p = d.length; p > g; g++) f[g][0] = d[g][0] + i, f[g][1] = d[g][1] + r, f[g][2] = d[g][2] + i, f[g][3] = d[g][3] + r, f[g][4] = d[g][4] + i, f[g][5] = d[g][5] + r, e.bezierCurveTo.apply(e, f[g])
        }, fabric.util.getBoundsOfArc = function(e, i, n, s, o, a, h, c, l) {
            for (var u = 0, f = 0, d = [], g = [], p = t(c - e, l - i, n, s, a, h, o), v = [
                    [],
                    []
                ], b = 0, m = p.length; m > b; b++) d = r(u, f, p[b][0], p[b][1], p[b][2], p[b][3], p[b][4], p[b][5]), v[0].x = d[0].x + e, v[0].y = d[0].y + i, v[1].x = d[1].x + e, v[1].y = d[1].y + i, g.push(v[0]), g.push(v[1]), u = p[b][4], f = p[b][5];
            return g
        }, fabric.util.getBoundsOfCurve = r
    }(),
    function() {
        function t(t, e) {
            for (var i = n.call(arguments, 2), r = [], s = 0, o = t.length; o > s; s++) r[s] = i.length ? t[s][e].apply(t[s], i) : t[s][e].call(t[s]);
            return r
        }

        function e(t, e) {
            return r(t, e, function(t, e) {
                return t >= e
            })
        }

        function i(t, e) {
            return r(t, e, function(t, e) {
                return e > t
            })
        }

        function r(t, e, i) {
            if (t && 0 !== t.length) {
                var r = t.length - 1,
                    n = e ? t[r][e] : t[r];
                if (e)
                    for (; r--;) i(t[r][e], n) && (n = t[r][e]);
                else
                    for (; r--;) i(t[r], n) && (n = t[r]);
                return n
            }
        }
        var n = Array.prototype.slice;
        Array.prototype.indexOf || (Array.prototype.indexOf = function(t) {
            if (void 0 === this || null === this) throw new TypeError;
            var e = Object(this),
                i = e.length >>> 0;
            if (0 === i) return -1;
            var r = 0;
            if (arguments.length > 0 && (r = Number(arguments[1]), r !== r ? r = 0 : 0 !== r && r !== Number.POSITIVE_INFINITY && r !== Number.NEGATIVE_INFINITY && (r = (r > 0 || -1) * Math.floor(Math.abs(r)))), r >= i) return -1;
            for (var n = r >= 0 ? r : Math.max(i - Math.abs(r), 0); i > n; n++)
                if (n in e && e[n] === t) return n;
            return -1
        }), Array.prototype.forEach || (Array.prototype.forEach = function(t, e) {
            for (var i = 0, r = this.length >>> 0; r > i; i++) i in this && t.call(e, this[i], i, this)
        }), Array.prototype.map || (Array.prototype.map = function(t, e) {
            for (var i = [], r = 0, n = this.length >>> 0; n > r; r++) r in this && (i[r] = t.call(e, this[r], r, this));
            return i
        }), Array.prototype.every || (Array.prototype.every = function(t, e) {
            for (var i = 0, r = this.length >>> 0; r > i; i++)
                if (i in this && !t.call(e, this[i], i, this)) return !1;
            return !0
        }), Array.prototype.some || (Array.prototype.some = function(t, e) {
            for (var i = 0, r = this.length >>> 0; r > i; i++)
                if (i in this && t.call(e, this[i], i, this)) return !0;
            return !1
        }), Array.prototype.filter || (Array.prototype.filter = function(t, e) {
            for (var i, r = [], n = 0, s = this.length >>> 0; s > n; n++) n in this && (i = this[n], t.call(e, i, n, this) && r.push(i));
            return r
        }), Array.prototype.reduce || (Array.prototype.reduce = function(t) {
            var e, i = this.length >>> 0,
                r = 0;
            if (arguments.length > 1) e = arguments[1];
            else
                for (;;) {
                    if (r in this) {
                        e = this[r++];
                        break
                    }
                    if (++r >= i) throw new TypeError
                }
            for (; i > r; r++) r in this && (e = t.call(null, e, this[r], r, this));
            return e
        }), fabric.util.array = {
            invoke: t,
            min: i,
            max: e
        }
    }(),
    function() {
        function t(t, e) {
            for (var i in e) t[i] = e[i];
            return t
        }

        function e(e) {
            return t({}, e)
        }
        fabric.util.object = {
            extend: t,
            clone: e
        }
    }(),
    function() {
        function t(t) {
            return t.replace(/-+(.)?/g, function(t, e) {
                return e ? e.toUpperCase() : ""
            })
        }

        function e(t, e) {
            return t.charAt(0).toUpperCase() + (e ? t.slice(1) : t.slice(1).toLowerCase())
        }

        function i(t) {
            return t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }
        String.prototype.trim || (String.prototype.trim = function() {
            return this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "")
        }), fabric.util.string = {
            camelize: t,
            capitalize: e,
            escapeXml: i
        }
    }(),
    function() {
        var t = Array.prototype.slice,
            e = Function.prototype.apply,
            i = function() {};
        Function.prototype.bind || (Function.prototype.bind = function(r) {
            var n, s = this,
                o = t.call(arguments, 1);
            return n = o.length ? function() {
                return e.call(s, this instanceof i ? this : r, o.concat(t.call(arguments)))
            } : function() {
                return e.call(s, this instanceof i ? this : r, arguments)
            }, i.prototype = this.prototype, n.prototype = new i, n
        })
    }(),
    function() {
        function t() {}

        function e(t) {
            var e = this.constructor.superclass.prototype[t];
            return arguments.length > 1 ? e.apply(this, r.call(arguments, 1)) : e.call(this)
        }

        function i() {
            function i() {
                this.initialize.apply(this, arguments)
            }
            var s = null,
                a = r.call(arguments, 0);
            "function" == typeof a[0] && (s = a.shift()), i.superclass = s, i.subclasses = [], s && (t.prototype = s.prototype, i.prototype = new t, s.subclasses.push(i));
            for (var h = 0, c = a.length; c > h; h++) o(i, a[h], s);
            return i.prototype.initialize || (i.prototype.initialize = n), i.prototype.constructor = i, i.prototype.callSuper = e, i
        }
        var r = Array.prototype.slice,
            n = function() {},
            s = function() {
                for (var t in {
                        toString: 1
                    })
                    if ("toString" === t) return !1;
                return !0
            }(),
            o = function(t, e, i) {
                for (var r in e) r in t.prototype && "function" == typeof t.prototype[r] && (e[r] + "").indexOf("callSuper") > -1 ? t.prototype[r] = function(t) {
                    return function() {
                        var r = this.constructor.superclass;
                        this.constructor.superclass = i;
                        var n = e[t].apply(this, arguments);
                        return this.constructor.superclass = r, "initialize" !== t ? n : void 0
                    }
                }(r) : t.prototype[r] = e[r], s && (e.toString !== Object.prototype.toString && (t.prototype.toString = e.toString), e.valueOf !== Object.prototype.valueOf && (t.prototype.valueOf = e.valueOf))
            };
        fabric.util.createClass = i
    }(),
    function() {
        function t(t) {
            var e, i, r = Array.prototype.slice.call(arguments, 1),
                n = r.length;
            for (i = 0; n > i; i++)
                if (e = typeof t[r[i]], !/^(?:function|object|unknown)$/.test(e)) return !1;
            return !0
        }

        function e(t, e) {
            return {
                handler: e,
                wrappedHandler: i(t, e)
            }
        }

        function i(t, e) {
            return function(i) {
                e.call(o(t), i || fabric.window.event)
            }
        }

        function r(t, e) {
            return function(i) {
                if (p[t] && p[t][e])
                    for (var r = p[t][e], n = 0, s = r.length; s > n; n++) r[n].call(this, i || fabric.window.event)
            }
        }

        function n(t) {
            t || (t = fabric.window.event);
            var e = t.target || (typeof t.srcElement !== h ? t.srcElement : null),
                i = fabric.util.getScrollLeftTop(e);
            return {
                x: v(t) + i.left,
                y: b(t) + i.top
            }
        }

        function s(t, e, i) {
            var r = "touchend" === t.type ? "changedTouches" : "touches";
            return t[r] && t[r][0] ? t[r][0][e] - (t[r][0][e] - t[r][0][i]) || t[i] : t[i]
        }
        var o, a, h = "unknown",
            c = function() {
                var t = 0;
                return function(e) {
                    return e.__uniqueID || (e.__uniqueID = "uniqueID__" + t++)
                }
            }();
        ! function() {
            var t = {};
            o = function(e) {
                return t[e]
            }, a = function(e, i) {
                t[e] = i
            }
        }();
        var l, u, f = t(fabric.document.documentElement, "addEventListener", "removeEventListener") && t(fabric.window, "addEventListener", "removeEventListener"),
            d = t(fabric.document.documentElement, "attachEvent", "detachEvent") && t(fabric.window, "attachEvent", "detachEvent"),
            g = {},
            p = {};
        f ? (l = function(t, e, i) {
            t.addEventListener(e, i, !1)
        }, u = function(t, e, i) {
            t.removeEventListener(e, i, !1)
        }) : d ? (l = function(t, i, r) {
            var n = c(t);
            a(n, t), g[n] || (g[n] = {}), g[n][i] || (g[n][i] = []);
            var s = e(n, r);
            g[n][i].push(s), t.attachEvent("on" + i, s.wrappedHandler)
        }, u = function(t, e, i) {
            var r, n = c(t);
            if (g[n] && g[n][e])
                for (var s = 0, o = g[n][e].length; o > s; s++) r = g[n][e][s], r && r.handler === i && (t.detachEvent("on" + e, r.wrappedHandler), g[n][e][s] = null)
        }) : (l = function(t, e, i) {
            var n = c(t);
            if (p[n] || (p[n] = {}), !p[n][e]) {
                p[n][e] = [];
                var s = t["on" + e];
                s && p[n][e].push(s), t["on" + e] = r(n, e)
            }
            p[n][e].push(i)
        }, u = function(t, e, i) {
            var r = c(t);
            if (p[r] && p[r][e])
                for (var n = p[r][e], s = 0, o = n.length; o > s; s++) n[s] === i && n.splice(s, 1)
        }), fabric.util.addListener = l, fabric.util.removeListener = u;
        var v = function(t) {
                return typeof t.clientX !== h ? t.clientX : 0
            },
            b = function(t) {
                return typeof t.clientY !== h ? t.clientY : 0
            };
        fabric.isTouchSupported && (v = function(t) {
            return s(t, "pageX", "clientX")
        }, b = function(t) {
            return s(t, "pageY", "clientY")
        }), fabric.util.getPointer = n, fabric.util.object.extend(fabric.util, fabric.Observable)
    }(),
    function() {
        function t(t, e) {
            var i = t.style;
            if (!i) return t;
            if ("string" == typeof e) return t.style.cssText += ";" + e, e.indexOf("opacity") > -1 ? s(t, e.match(/opacity:\s*(\d?\.?\d*)/)[1]) : t;
            for (var r in e)
                if ("opacity" === r) s(t, e[r]);
                else {
                    var n = "float" === r || "cssFloat" === r ? "undefined" == typeof i.styleFloat ? "cssFloat" : "styleFloat" : r;
                    i[n] = e[r]
                }
            return t
        }
        var e = fabric.document.createElement("div"),
            i = "string" == typeof e.style.opacity,
            r = "string" == typeof e.style.filter,
            n = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/,
            s = function(t) {
                return t
            };
        i ? s = function(t, e) {
            return t.style.opacity = e, t
        } : r && (s = function(t, e) {
            var i = t.style;
            return t.currentStyle && !t.currentStyle.hasLayout && (i.zoom = 1), n.test(i.filter) ? (e = e >= .9999 ? "" : "alpha(opacity=" + 100 * e + ")", i.filter = i.filter.replace(n, e)) : i.filter += " alpha(opacity=" + 100 * e + ")", t
        }), fabric.util.setStyle = t
    }(),
    function() {
        function t(t) {
            return "string" == typeof t ? fabric.document.getElementById(t) : t
        }

        function e(t, e) {
            var i = fabric.document.createElement(t);
            for (var r in e) "class" === r ? i.className = e[r] : "for" === r ? i.htmlFor = e[r] : i.setAttribute(r, e[r]);
            return i
        }

        function i(t, e) {
            t && -1 === (" " + t.className + " ").indexOf(" " + e + " ") && (t.className += (t.className ? " " : "") + e)
        }

        function r(t, i, r) {
            return "string" == typeof i && (i = e(i, r)), t.parentNode && t.parentNode.replaceChild(i, t), i.appendChild(t), i
        }

        function n(t) {
            for (var e = 0, i = 0, r = fabric.document.documentElement, n = fabric.document.body || {
                    scrollLeft: 0,
                    scrollTop: 0
                }; t && t.parentNode && (t = t.parentNode, t === fabric.document ? (e = n.scrollLeft || r.scrollLeft || 0, i = n.scrollTop || r.scrollTop || 0) : (e += t.scrollLeft || 0, i += t.scrollTop || 0), 1 !== t.nodeType || "fixed" !== fabric.util.getElementStyle(t, "position")););
            return {
                left: e,
                top: i
            }
        }

        function s(t) {
            var e, i, r = t && t.ownerDocument,
                s = {
                    left: 0,
                    top: 0
                },
                o = {
                    left: 0,
                    top: 0
                },
                a = {
                    borderLeftWidth: "left",
                    borderTopWidth: "top",
                    paddingLeft: "left",
                    paddingTop: "top"
                };
            if (!r) return o;
            for (var h in a) o[a[h]] += parseInt(l(t, h), 10) || 0;
            return e = r.documentElement, "undefined" != typeof t.getBoundingClientRect && (s = t.getBoundingClientRect()), i = n(t), {
                left: s.left + i.left - (e.clientLeft || 0) + o.left,
                top: s.top + i.top - (e.clientTop || 0) + o.top
            }
        }
        var o, a = Array.prototype.slice,
            h = function(t) {
                return a.call(t, 0)
            };
        try {
            o = h(fabric.document.childNodes) instanceof Array
        } catch (c) {}
        o || (h = function(t) {
            for (var e = new Array(t.length), i = t.length; i--;) e[i] = t[i];
            return e
        });
        var l;
        l = fabric.document.defaultView && fabric.document.defaultView.getComputedStyle ? function(t, e) {
                var i = fabric.document.defaultView.getComputedStyle(t, null);
                return i ? i[e] : void 0
            } : function(t, e) {
                var i = t.style[e];
                return !i && t.currentStyle && (i = t.currentStyle[e]), i
            },
            function() {
                function t(t) {
                    return "undefined" != typeof t.onselectstart && (t.onselectstart = fabric.util.falseFunction), r ? t.style[r] = "none" : "string" == typeof t.unselectable && (t.unselectable = "on"), t
                }

                function e(t) {
                    return "undefined" != typeof t.onselectstart && (t.onselectstart = null), r ? t.style[r] = "" : "string" == typeof t.unselectable && (t.unselectable = ""), t
                }
                var i = fabric.document.documentElement.style,
                    r = "userSelect" in i ? "userSelect" : "MozUserSelect" in i ? "MozUserSelect" : "WebkitUserSelect" in i ? "WebkitUserSelect" : "KhtmlUserSelect" in i ? "KhtmlUserSelect" : "";
                fabric.util.makeElementUnselectable = t, fabric.util.makeElementSelectable = e
            }(),
            function() {
                function t(t, e) {
                    var i = fabric.document.getElementsByTagName("head")[0],
                        r = fabric.document.createElement("script"),
                        n = !0;
                    r.onload = r.onreadystatechange = function(t) {
                        if (n) {
                            if ("string" == typeof this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState) return;
                            n = !1, e(t || fabric.window.event), r = r.onload = r.onreadystatechange = null
                        }
                    }, r.src = t, i.appendChild(r)
                }
                fabric.util.getScript = t
            }(), fabric.util.getById = t, fabric.util.toArray = h, fabric.util.makeElement = e, fabric.util.addClass = i, fabric.util.wrapElement = r, fabric.util.getScrollLeftTop = n, fabric.util.getElementOffset = s, fabric.util.getElementStyle = l
    }(),
    function() {
        function t(t, e) {
            return t + (/\?/.test(t) ? "&" : "?") + e
        }

        function e() {}

        function i(i, n) {
            n || (n = {});
            var s, o = n.method ? n.method.toUpperCase() : "GET",
                a = n.onComplete || function() {},
                h = r();
            return h.onreadystatechange = function() {
                4 === h.readyState && (a(h), h.onreadystatechange = e)
            }, "GET" === o && (s = null, "string" == typeof n.parameters && (i = t(i, n.parameters))), h.open(o, i, !0), ("POST" === o || "PUT" === o) && h.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), h.send(s), h
        }
        var r = function() {
            for (var t = [function() {
                    return new ActiveXObject("Microsoft.XMLHTTP")
                }, function() {
                    return new ActiveXObject("Msxml2.XMLHTTP")
                }, function() {
                    return new ActiveXObject("Msxml2.XMLHTTP.3.0")
                }, function() {
                    return new XMLHttpRequest
                }], e = t.length; e--;) try {
                var i = t[e]();
                if (i) return t[e]
            } catch (r) {}
        }();
        fabric.util.request = i
    }(), fabric.log = function() {}, fabric.warn = function() {}, "undefined" != typeof console && ["log", "warn"].forEach(function(t) {
        "undefined" != typeof console[t] && "function" == typeof console[t].apply && (fabric[t] = function() {
            return console[t].apply(console, arguments)
        })
    }),
    function() {
        function t(t) {
            e(function(i) {
                t || (t = {});
                var r, n = i || +new Date,
                    s = t.duration || 500,
                    o = n + s,
                    a = t.onChange || function() {},
                    h = t.abort || function() {
                        return !1
                    },
                    c = t.easing || function(t, e, i, r) {
                        return -i * Math.cos(t / r * (Math.PI / 2)) + i + e
                    },
                    l = "startValue" in t ? t.startValue : 0,
                    u = "endValue" in t ? t.endValue : 100,
                    f = t.byValue || u - l;
                t.onStart && t.onStart(),
                    function d(i) {
                        r = i || +new Date;
                        var u = r > o ? s : r - n;
                        return h() ? void(t.onComplete && t.onComplete()) : (a(c(u, l, f, s)), r > o ? void(t.onComplete && t.onComplete()) : void e(d))
                    }(n)
            })
        }

        function e() {
            return i.apply(fabric.window, arguments)
        }
        var i = fabric.window.requestAnimationFrame || fabric.window.webkitRequestAnimationFrame || fabric.window.mozRequestAnimationFrame || fabric.window.oRequestAnimationFrame || fabric.window.msRequestAnimationFrame || function(t) {
            fabric.window.setTimeout(t, 1e3 / 60)
        };
        fabric.util.animate = t, fabric.util.requestAnimFrame = e
    }(),
    function() {
        function t(t, e, i, r) {
            return t < Math.abs(e) ? (t = e, r = i / 4) : r = i / (2 * Math.PI) * Math.asin(e / t), {
                a: t,
                c: e,
                p: i,
                s: r
            }
        }

        function e(t, e, i) {
            return t.a * Math.pow(2, 10 * (e -= 1)) * Math.sin((e * i - t.s) * (2 * Math.PI) / t.p)
        }

        function i(t, e, i, r) {
            return i * ((t = t / r - 1) * t * t + 1) + e
        }

        function r(t, e, i, r) {
            return t /= r / 2, 1 > t ? i / 2 * t * t * t + e : i / 2 * ((t -= 2) * t * t + 2) + e
        }

        function n(t, e, i, r) {
            return i * (t /= r) * t * t * t + e
        }

        function s(t, e, i, r) {
            return -i * ((t = t / r - 1) * t * t * t - 1) + e
        }

        function o(t, e, i, r) {
            return t /= r / 2, 1 > t ? i / 2 * t * t * t * t + e : -i / 2 * ((t -= 2) * t * t * t - 2) + e
        }

        function a(t, e, i, r) {
            return i * (t /= r) * t * t * t * t + e
        }

        function h(t, e, i, r) {
            return i * ((t = t / r - 1) * t * t * t * t + 1) + e
        }

        function c(t, e, i, r) {
            return t /= r / 2, 1 > t ? i / 2 * t * t * t * t * t + e : i / 2 * ((t -= 2) * t * t * t * t + 2) + e
        }

        function l(t, e, i, r) {
            return -i * Math.cos(t / r * (Math.PI / 2)) + i + e
        }

        function u(t, e, i, r) {
            return i * Math.sin(t / r * (Math.PI / 2)) + e
        }

        function f(t, e, i, r) {
            return -i / 2 * (Math.cos(Math.PI * t / r) - 1) + e
        }

        function d(t, e, i, r) {
            return 0 === t ? e : i * Math.pow(2, 10 * (t / r - 1)) + e
        }

        function g(t, e, i, r) {
            return t === r ? e + i : i * (-Math.pow(2, -10 * t / r) + 1) + e
        }

        function p(t, e, i, r) {
            return 0 === t ? e : t === r ? e + i : (t /= r / 2, 1 > t ? i / 2 * Math.pow(2, 10 * (t - 1)) + e : i / 2 * (-Math.pow(2, -10 * --t) + 2) + e)
        }

        function v(t, e, i, r) {
            return -i * (Math.sqrt(1 - (t /= r) * t) - 1) + e
        }

        function b(t, e, i, r) {
            return i * Math.sqrt(1 - (t = t / r - 1) * t) + e
        }

        function m(t, e, i, r) {
            return t /= r / 2, 1 > t ? -i / 2 * (Math.sqrt(1 - t * t) - 1) + e : i / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + e
        }

        function y(i, r, n, s) {
            var o = 1.70158,
                a = 0,
                h = n;
            if (0 === i) return r;
            if (i /= s, 1 === i) return r + n;
            a || (a = .3 * s);
            var c = t(h, n, a, o);
            return -e(c, i, s) + r
        }

        function _(e, i, r, n) {
            var s = 1.70158,
                o = 0,
                a = r;
            if (0 === e) return i;
            if (e /= n, 1 === e) return i + r;
            o || (o = .3 * n);
            var h = t(a, r, o, s);
            return h.a * Math.pow(2, -10 * e) * Math.sin((e * n - h.s) * (2 * Math.PI) / h.p) + h.c + i
        }

        function x(i, r, n, s) {
            var o = 1.70158,
                a = 0,
                h = n;
            if (0 === i) return r;
            if (i /= s / 2, 2 === i) return r + n;
            a || (a = s * (.3 * 1.5));
            var c = t(h, n, a, o);
            return 1 > i ? -.5 * e(c, i, s) + r : c.a * Math.pow(2, -10 * (i -= 1)) * Math.sin((i * s - c.s) * (2 * Math.PI) / c.p) * .5 + c.c + r
        }

        function S(t, e, i, r, n) {
            return void 0 === n && (n = 1.70158), i * (t /= r) * t * ((n + 1) * t - n) + e
        }

        function C(t, e, i, r, n) {
            return void 0 === n && (n = 1.70158), i * ((t = t / r - 1) * t * ((n + 1) * t + n) + 1) + e
        }

        function w(t, e, i, r, n) {
            return void 0 === n && (n = 1.70158), t /= r / 2, 1 > t ? i / 2 * (t * t * (((n *= 1.525) + 1) * t - n)) + e : i / 2 * ((t -= 2) * t * (((n *= 1.525) + 1) * t + n) + 2) + e
        }

        function O(t, e, i, r) {
            return i - T(r - t, 0, i, r) + e
        }

        function T(t, e, i, r) {
            return (t /= r) < 1 / 2.75 ? i * (7.5625 * t * t) + e : 2 / 2.75 > t ? i * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + e : 2.5 / 2.75 > t ? i * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + e : i * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + e
        }

        function k(t, e, i, r) {
            return r / 2 > t ? .5 * O(2 * t, 0, i, r) + e : .5 * T(2 * t - r, 0, i, r) + .5 * i + e
        }
        fabric.util.ease = {
            easeInQuad: function(t, e, i, r) {
                return i * (t /= r) * t + e
            },
            easeOutQuad: function(t, e, i, r) {
                return -i * (t /= r) * (t - 2) + e
            },
            easeInOutQuad: function(t, e, i, r) {
                return t /= r / 2, 1 > t ? i / 2 * t * t + e : -i / 2 * (--t * (t - 2) - 1) + e
            },
            easeInCubic: function(t, e, i, r) {
                return i * (t /= r) * t * t + e
            },
            easeOutCubic: i,
            easeInOutCubic: r,
            easeInQuart: n,
            easeOutQuart: s,
            easeInOutQuart: o,
            easeInQuint: a,
            easeOutQuint: h,
            easeInOutQuint: c,
            easeInSine: l,
            easeOutSine: u,
            easeInOutSine: f,
            easeInExpo: d,
            easeOutExpo: g,
            easeInOutExpo: p,
            easeInCirc: v,
            easeOutCirc: b,
            easeInOutCirc: m,
            easeInElastic: y,
            easeOutElastic: _,
            easeInOutElastic: x,
            easeInBack: S,
            easeOutBack: C,
            easeInOutBack: w,
            easeInBounce: O,
            easeOutBounce: T,
            easeInOutBounce: k
        }
    }(),
    function(t) {
        "use strict";

        function e(t) {
            return t in T ? T[t] : t
        }

        function i(t, e, i, r) {
            var n, s = "[object Array]" === Object.prototype.toString.call(e);
            return "fill" !== t && "stroke" !== t || "none" !== e ? "strokeDashArray" === t ? e = e.replace(/,/g, " ").split(/\s+/).map(function(t) {
                return parseFloat(t)
            }) : "transformMatrix" === t ? e = i && i.transformMatrix ? x(i.transformMatrix, p.parseTransformAttribute(e)) : p.parseTransformAttribute(e) : "visible" === t ? (e = "none" === e || "hidden" === e ? !1 : !0, i && i.visible === !1 && (e = !1)) : "originX" === t ? e = "start" === e ? "left" : "end" === e ? "right" : "center" : n = s ? e.map(_) : _(e, r) : e = "", !s && isNaN(n) ? e : n
        }

        function r(t) {
            for (var e in k)
                if (t[e] && "undefined" != typeof t[k[e]] && 0 !== t[e].indexOf("url(")) {
                    var i = new p.Color(t[e]);
                    t[e] = i.setAlpha(y(i.getAlpha() * t[k[e]], 2)).toRgba()
                }
            return t
        }

        function n(t, r) {
            var n, s;
            t.replace(/;\s*$/, "").split(";").forEach(function(t) {
                var o = t.split(":");
                n = e(o[0].trim().toLowerCase()), s = i(n, o[1].trim()), r[n] = s
            })
        }

        function s(t, r) {
            var n, s;
            for (var o in t) "undefined" != typeof t[o] && (n = e(o.toLowerCase()), s = i(n, t[o]), r[n] = s)
        }

        function o(t, e) {
            var i = {};
            for (var r in p.cssRules[e])
                if (a(t, r.split(" ")))
                    for (var n in p.cssRules[e][r]) i[n] = p.cssRules[e][r][n];
            return i
        }

        function a(t, e) {
            var i, r = !0;
            return i = c(t, e.pop()), i && e.length && (r = h(t, e)), i && r && 0 === e.length
        }

        function h(t, e) {
            for (var i, r = !0; t.parentNode && 1 === t.parentNode.nodeType && e.length;) r && (i = e.pop()), t = t.parentNode, r = c(t, i);
            return 0 === e.length
        }

        function c(t, e) {
            var i, r = t.nodeName,
                n = t.getAttribute("class"),
                s = t.getAttribute("id");
            if (i = new RegExp("^" + r, "i"), e = e.replace(i, ""), s && e.length && (i = new RegExp("#" + s + "(?![a-zA-Z\\-]+)", "i"), e = e.replace(i, "")), n && e.length) {
                n = n.split(" ");
                for (var o = n.length; o--;) i = new RegExp("\\." + n[o] + "(?![a-zA-Z\\-]+)", "i"), e = e.replace(i, "")
            }
            return 0 === e.length
        }

        function l(t, e) {
            var i;
            if (t.getElementById && (i = t.getElementById(e)), i) return i;
            var r, n, s, o = t.getElementsByTagName("*");
            for (n = 0; n < o.length; n++)
                if (r = o[n], s === r.getAttribute("id")) return r
        }

        function u(t) {
            for (var e = t.getElementsByTagName("use"), i = 0; e.length && i < e.length;) {
                var r, n, s, o, a, h = e[i],
                    c = h.getAttribute("xlink:href").substr(1),
                    u = h.getAttribute("x") || 0,
                    d = h.getAttribute("y") || 0,
                    g = l(t, c).cloneNode(!0),
                    p = (g.getAttribute("transform") || "") + " translate(" + u + ", " + d + ")",
                    v = e.length;
                if (f(g), /^svg$/i.test(g.nodeName)) {
                    var b = g.ownerDocument.createElement("g");
                    for (s = 0, o = g.attributes, a = o.length; a > s; s++) n = o.item(s), b.setAttribute(n.nodeName, n.nodeValue);
                    for (; null != g.firstChild;) b.appendChild(g.firstChild);
                    g = b
                }
                for (s = 0, o = h.attributes, a = o.length; a > s; s++) n = o.item(s), "x" !== n.nodeName && "y" !== n.nodeName && "xlink:href" !== n.nodeName && ("transform" === n.nodeName ? p = n.nodeValue + " " + p : g.setAttribute(n.nodeName, n.nodeValue));
                g.setAttribute("transform", p), g.setAttribute("instantiated_by_use", "1"), g.removeAttribute("id"), r = h.parentNode, r.replaceChild(g, h), e.length === v && i++
            }
        }

        function f(t) {
            var e, i, r, n, s = t.getAttribute("viewBox"),
                o = 1,
                a = 1,
                h = 0,
                c = 0,
                l = t.getAttribute("width"),
                u = t.getAttribute("height"),
                f = t.getAttribute("x") || 0,
                d = t.getAttribute("y") || 0,
                g = t.getAttribute("preserveAspectRatio") || "",
                v = !s || !C.test(t.tagName) || !(s = s.match(j)),
                b = !l || !u || "100%" === l || "100%" === u,
                m = v && b,
                y = {},
                x = "";
            if (y.width = 0, y.height = 0, y.toBeParsed = m, m) return y;
            if (v) return y.width = _(l), y.height = _(u), y;
            if (h = -parseFloat(s[1]), c = -parseFloat(s[2]), e = parseFloat(s[3]), i = parseFloat(s[4]), b ? (y.width = e, y.height = i) : (y.width = _(l), y.height = _(u), o = y.width / e, a = y.height / i), g = p.util.parsePreserveAspectRatioAttribute(g), "none" !== g.alignX && (a = o = o > a ? a : o), 1 === o && 1 === a && 0 === h && 0 === c && 0 === f && 0 === d) return y;
            if ((f || d) && (x = " translate(" + _(f) + " " + _(d) + ") "), r = x + " matrix(" + o + " 0 0 " + a + " " + h * o + " " + c * a + ") ", "svg" === t.tagName) {
                for (n = t.ownerDocument.createElement("g"); null != t.firstChild;) n.appendChild(t.firstChild);
                t.appendChild(n)
            } else n = t, r = n.getAttribute("transform") + r;
            return n.setAttribute("transform", r), y
        }

        function d(t) {
            var e = t.objects,
                i = t.options;
            return e = e.map(function(t) {
                return p[b(t.type)].fromObject(t)
            }), {
                objects: e,
                options: i
            }
        }

        function g(t, e, i) {
            e[i] && e[i].toSVG && t.push('  <pattern x="0" y="0" id="', i, 'Pattern" ', 'width="', e[i].source.width, '" height="', e[i].source.height, '" patternUnits="userSpaceOnUse">\n', '     <image x="0" y="0" ', 'width="', e[i].source.width, '" height="', e[i].source.height, '" xlink:href="', e[i].source.src, '"></image>\n  </pattern>\n')
        }
        var p = t.fabric || (t.fabric = {}),
            v = p.util.object.extend,
            b = p.util.string.capitalize,
            m = p.util.object.clone,
            y = p.util.toFixed,
            _ = p.util.parseUnit,
            x = p.util.multiplyTransformMatrices,
            S = /^(path|circle|polygon|polyline|ellipse|rect|line|image|text)$/i,
            C = /^(symbol|image|marker|pattern|view|svg)$/i,
            w = /^(?:pattern|defs|symbol|metadata)$/i,
            O = /^(symbol|g|a|svg)$/i,
            T = {
                cx: "left",
                x: "left",
                r: "radius",
                cy: "top",
                y: "top",
                display: "visible",
                visibility: "visible",
                transform: "transformMatrix",
                "fill-opacity": "fillOpacity",
                "fill-rule": "fillRule",
                "font-family": "fontFamily",
                "font-size": "fontSize",
                "font-style": "fontStyle",
                "font-weight": "fontWeight",
                "stroke-dasharray": "strokeDashArray",
                "stroke-linecap": "strokeLineCap",
                "stroke-linejoin": "strokeLineJoin",
                "stroke-miterlimit": "strokeMiterLimit",
                "stroke-opacity": "strokeOpacity",
                "stroke-width": "strokeWidth",
                "text-decoration": "textDecoration",
                "text-anchor": "originX"
            },
            k = {
                stroke: "strokeOpacity",
                fill: "fillOpacity"
            };
        p.cssRules = {}, p.gradientDefs = {}, p.parseTransformAttribute = function() {
            function t(t, e) {
                var i = e[0];
                t[0] = Math.cos(i), t[1] = Math.sin(i), t[2] = -Math.sin(i), t[3] = Math.cos(i)
            }

            function e(t, e) {
                var i = e[0],
                    r = 2 === e.length ? e[1] : e[0];
                t[0] = i, t[3] = r
            }

            function i(t, e) {
                t[2] = Math.tan(p.util.degreesToRadians(e[0]))
            }

            function r(t, e) {
                t[1] = Math.tan(p.util.degreesToRadians(e[0]))
            }

            function n(t, e) {
                t[4] = e[0], 2 === e.length && (t[5] = e[1])
            }
            var s = [1, 0, 0, 1, 0, 0],
                o = p.reNum,
                a = "(?:\\s+,?\\s*|,\\s*)",
                h = "(?:(skewX)\\s*\\(\\s*(" + o + ")\\s*\\))",
                c = "(?:(skewY)\\s*\\(\\s*(" + o + ")\\s*\\))",
                l = "(?:(rotate)\\s*\\(\\s*(" + o + ")(?:" + a + "(" + o + ")" + a + "(" + o + "))?\\s*\\))",
                u = "(?:(scale)\\s*\\(\\s*(" + o + ")(?:" + a + "(" + o + "))?\\s*\\))",
                f = "(?:(translate)\\s*\\(\\s*(" + o + ")(?:" + a + "(" + o + "))?\\s*\\))",
                d = "(?:(matrix)\\s*\\(\\s*(" + o + ")" + a + "(" + o + ")" + a + "(" + o + ")" + a + "(" + o + ")" + a + "(" + o + ")" + a + "(" + o + ")\\s*\\))",
                g = "(?:" + d + "|" + f + "|" + u + "|" + l + "|" + h + "|" + c + ")",
                v = "(?:" + g + "(?:" + a + g + ")*)",
                b = "^\\s*(?:" + v + "?)\\s*$",
                m = new RegExp(b),
                y = new RegExp(g, "g");
            return function(o) {
                var a = s.concat(),
                    h = [];
                if (!o || o && !m.test(o)) return a;
                o.replace(y, function(o) {
                    var c = new RegExp(g).exec(o).filter(function(t) {
                            return "" !== t && null != t
                        }),
                        l = c[1],
                        u = c.slice(2).map(parseFloat);
                    switch (l) {
                        case "translate":
                            n(a, u);
                            break;
                        case "rotate":
                            u[0] = p.util.degreesToRadians(u[0]), t(a, u);
                            break;
                        case "scale":
                            e(a, u);
                            break;
                        case "skewX":
                            i(a, u);
                            break;
                        case "skewY":
                            r(a, u);
                            break;
                        case "matrix":
                            a = u
                    }
                    h.push(a.concat()), a = s.concat()
                });
                for (var c = h[0]; h.length > 1;) h.shift(), c = p.util.multiplyTransformMatrices(c, h[0]);
                return c
            }
        }();
        var j = new RegExp("^\\s*(" + p.reNum + "+)\\s*,?\\s*(" + p.reNum + "+)\\s*,?\\s*(" + p.reNum + "+)\\s*,?\\s*(" + p.reNum + "+)\\s*$");
        p.parseSVGDocument = function() {
            function t(t, e) {
                for (; t && (t = t.parentNode);)
                    if (e.test(t.nodeName) && !t.getAttribute("instantiated_by_use")) return !0;
                return !1
            }
            return function(e, i, r) {
                if (e) {
                    u(e);
                    var n = new Date,
                        s = p.Object.__uid++,
                        o = f(e),
                        a = p.util.toArray(e.getElementsByTagName("*"));
                    if (o.svgUid = s, 0 === a.length && p.isLikelyNode) {
                        a = e.selectNodes('//*[name(.)!="svg"]');
                        for (var h = [], c = 0, l = a.length; l > c; c++) h[c] = a[c];
                        a = h
                    }
                    var d = a.filter(function(e) {
                        return f(e), S.test(e.tagName) && !t(e, w);
                    });
                    if (!d || d && !d.length) return void(i && i([], {}));
                    p.gradientDefs[s] = p.getGradientDefs(e), p.cssRules[s] = p.getCSSRules(e), p.parseElements(d, function(t) {
                        p.documentParsingTime = new Date - n, i && i(t, o)
                    }, m(o), r)
                }
            }
        }();
        var A = {
                has: function(t, e) {
                    e(!1)
                },
                get: function() {},
                set: function() {}
            },
            P = new RegExp("(normal|italic)?\\s*(normal|small-caps)?\\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*(" + p.reNum + "(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|" + p.reNum + "))?\\s+(.*)");
        v(p, {
            parseFontDeclaration: function(t, e) {
                var i = t.match(P);
                if (i) {
                    var r = i[1],
                        n = i[3],
                        s = i[4],
                        o = i[5],
                        a = i[6];
                    r && (e.fontStyle = r), n && (e.fontWeight = isNaN(parseFloat(n)) ? n : parseFloat(n)), s && (e.fontSize = _(s)), a && (e.fontFamily = a), o && (e.lineHeight = "normal" === o ? 1 : o)
                }
            },
            getGradientDefs: function(t) {
                var e, i, r, n, s = t.getElementsByTagName("linearGradient"),
                    o = t.getElementsByTagName("radialGradient"),
                    a = 0,
                    h = [],
                    c = {},
                    l = {};
                for (h.length = s.length + o.length, i = s.length; i--;) h[a++] = s[i];
                for (i = o.length; i--;) h[a++] = o[i];
                for (; a--;) e = h[a], n = e.getAttribute("xlink:href"), r = e.getAttribute("id"), n && (l[r] = n.substr(1)), c[r] = e;
                for (r in l) {
                    var u = c[l[r]].cloneNode(!0);
                    for (e = c[r]; u.firstChild;) e.appendChild(u.firstChild)
                }
                return c
            },
            parseAttributes: function(t, n, s) {
                if (t) {
                    var a, h, c = {};
                    "undefined" == typeof s && (s = t.getAttribute("svgUid")), t.parentNode && O.test(t.parentNode.nodeName) && (c = p.parseAttributes(t.parentNode, n, s)), h = c && c.fontSize || t.getAttribute("font-size") || p.Text.DEFAULT_SVG_FONT_SIZE;
                    var l = n.reduce(function(r, n) {
                        return a = t.getAttribute(n), a && (n = e(n), a = i(n, a, c, h), r[n] = a), r
                    }, {});
                    return l = v(l, v(o(t, s), p.parseStyleAttribute(t))), l.font && p.parseFontDeclaration(l.font, l), r(v(c, l))
                }
            },
            parseElements: function(t, e, i, r) {
                new p.ElementsParser(t, e, i, r).parse()
            },
            parseStyleAttribute: function(t) {
                var e = {},
                    i = t.getAttribute("style");
                return i ? ("string" == typeof i ? n(i, e) : s(i, e), e) : e
            },
            parsePointsAttribute: function(t) {
                if (!t) return null;
                t = t.replace(/,/g, " ").trim(), t = t.split(/\s+/);
                var e, i, r = [];
                for (e = 0, i = t.length; i > e; e += 2) r.push({
                    x: parseFloat(t[e]),
                    y: parseFloat(t[e + 1])
                });
                return r
            },
            getCSSRules: function(t) {
                for (var r, n = t.getElementsByTagName("style"), s = {}, o = 0, a = n.length; a > o; o++) {
                    var h = n[o].textContent;
                    h = h.replace(/\/\*[\s\S]*?\*\//g, ""), "" !== h.trim() && (r = h.match(/[^{]*\{[\s\S]*?\}/g), r = r.map(function(t) {
                        return t.trim()
                    }), r.forEach(function(t) {
                        for (var r = t.match(/([\s\S]*?)\s*\{([^}]*)\}/), n = {}, o = r[2].trim(), a = o.replace(/;$/, "").split(/\s*;\s*/), h = 0, c = a.length; c > h; h++) {
                            var l = a[h].split(/\s*:\s*/),
                                u = e(l[0]),
                                f = i(u, l[1], l[0]);
                            n[u] = f
                        }
                        t = r[1], t.split(",").forEach(function(t) {
                            t = t.replace(/^svg/i, "").trim(), "" !== t && (s[t] = p.util.object.clone(n))
                        })
                    }))
                }
                return s
            },
            loadSVGFromURL: function(t, e, i) {
                function r(r) {
                    var n = r.responseXML;
                    n && !n.documentElement && p.window.ActiveXObject && r.responseText && (n = new ActiveXObject("Microsoft.XMLDOM"), n.async = "false", n.loadXML(r.responseText.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, ""))), n && n.documentElement && p.parseSVGDocument(n.documentElement, function(i, r) {
                        A.set(t, {
                            objects: p.util.array.invoke(i, "toObject"),
                            options: r
                        }), e(i, r)
                    }, i)
                }
                t = t.replace(/^\n\s*/, "").trim(), A.has(t, function(i) {
                    i ? A.get(t, function(t) {
                        var i = d(t);
                        e(i.objects, i.options)
                    }) : new p.util.request(t, {
                        method: "get",
                        onComplete: r
                    })
                })
            },
            loadSVGFromString: function(t, e, i) {
                t = t.trim();
                var r;
                if ("undefined" != typeof DOMParser) {
                    var n = new DOMParser;
                    n && n.parseFromString && (r = n.parseFromString(t, "text/xml"))
                } else p.window.ActiveXObject && (r = new ActiveXObject("Microsoft.XMLDOM"), r.async = "false", r.loadXML(t.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i, "")));
                p.parseSVGDocument(r.documentElement, function(t, i) {
                    e(t, i)
                }, i)
            },
            createSVGFontFacesMarkup: function(t) {
                for (var e = "", i = 0, r = t.length; r > i; i++) "text" === t[i].type && t[i].path && (e += ["@font-face {", "font-family: ", t[i].fontFamily, "; ", "src: url('", t[i].path, "')", "}\n"].join(""));
                return e && (e = [' <style type="text/css">', "<![CDATA[", e, "]]>", "</style>\n"].join("")), e
            },
            createSVGRefElementsMarkup: function(t) {
                var e = [];
                return g(e, t, "backgroundColor"), g(e, t, "overlayColor"), e.join("")
            }
        })
    }("undefined" != typeof exports ? exports : this), fabric.ElementsParser = function(t, e, i, r) {
        this.elements = t, this.callback = e, this.options = i, this.reviver = r, this.svgUid = i && i.svgUid || 0
    }, fabric.ElementsParser.prototype.parse = function() {
        this.instances = new Array(this.elements.length), this.numElements = this.elements.length, this.createObjects()
    }, fabric.ElementsParser.prototype.createObjects = function() {
        for (var t = 0, e = this.elements.length; e > t; t++) this.elements[t].setAttribute("svgUid", this.svgUid),
            function(t, e) {
                setTimeout(function() {
                    t.createObject(t.elements[e], e)
                }, 0)
            }(this, t)
    }, fabric.ElementsParser.prototype.createObject = function(t, e) {
        var i = fabric[fabric.util.string.capitalize(t.tagName)];
        if (i && i.fromElement) try {
            this._createObject(i, t, e)
        } catch (r) {
            fabric.log(r)
        } else this.checkIfDone()
    }, fabric.ElementsParser.prototype._createObject = function(t, e, i) {
        if (t.async) t.fromElement(e, this.createCallback(i, e), this.options);
        else {
            var r = t.fromElement(e, this.options);
            this.resolveGradient(r, "fill"), this.resolveGradient(r, "stroke"), this.reviver && this.reviver(e, r), this.instances[i] = r, this.checkIfDone()
        }
    }, fabric.ElementsParser.prototype.createCallback = function(t, e) {
        var i = this;
        return function(r) {
            i.resolveGradient(r, "fill"), i.resolveGradient(r, "stroke"), i.reviver && i.reviver(e, r), i.instances[t] = r, i.checkIfDone()
        }
    }, fabric.ElementsParser.prototype.resolveGradient = function(t, e) {
        var i = t.get(e);
        if (/^url\(/.test(i)) {
            var r = i.slice(5, i.length - 1);
            fabric.gradientDefs[this.svgUid][r] && t.set(e, fabric.Gradient.fromElement(fabric.gradientDefs[this.svgUid][r], t))
        }
    }, fabric.ElementsParser.prototype.checkIfDone = function() {
        0 === --this.numElements && (this.instances = this.instances.filter(function(t) {
            return null != t
        }), this.callback(this.instances))
    },
    function(t) {
        "use strict";

        function e(t, e) {
            this.x = t, this.y = e
        }
        var i = t.fabric || (t.fabric = {});
        return i.Point ? void i.warn("fabric.Point is already defined") : (i.Point = e, void(e.prototype = {
            constructor: e,
            add: function(t) {
                return new e(this.x + t.x, this.y + t.y)
            },
            addEquals: function(t) {
                return this.x += t.x, this.y += t.y, this
            },
            scalarAdd: function(t) {
                return new e(this.x + t, this.y + t)
            },
            scalarAddEquals: function(t) {
                return this.x += t, this.y += t, this
            },
            subtract: function(t) {
                return new e(this.x - t.x, this.y - t.y)
            },
            subtractEquals: function(t) {
                return this.x -= t.x, this.y -= t.y, this
            },
            scalarSubtract: function(t) {
                return new e(this.x - t, this.y - t)
            },
            scalarSubtractEquals: function(t) {
                return this.x -= t, this.y -= t, this
            },
            multiply: function(t) {
                return new e(this.x * t, this.y * t)
            },
            multiplyEquals: function(t) {
                return this.x *= t, this.y *= t, this
            },
            divide: function(t) {
                return new e(this.x / t, this.y / t)
            },
            divideEquals: function(t) {
                return this.x /= t, this.y /= t, this
            },
            eq: function(t) {
                return this.x === t.x && this.y === t.y
            },
            lt: function(t) {
                return this.x < t.x && this.y < t.y
            },
            lte: function(t) {
                return this.x <= t.x && this.y <= t.y
            },
            gt: function(t) {
                return this.x > t.x && this.y > t.y
            },
            gte: function(t) {
                return this.x >= t.x && this.y >= t.y
            },
            lerp: function(t, i) {
                return new e(this.x + (t.x - this.x) * i, this.y + (t.y - this.y) * i)
            },
            distanceFrom: function(t) {
                var e = this.x - t.x,
                    i = this.y - t.y;
                return Math.sqrt(e * e + i * i)
            },
            midPointFrom: function(t) {
                return new e(this.x + (t.x - this.x) / 2, this.y + (t.y - this.y) / 2)
            },
            min: function(t) {
                return new e(Math.min(this.x, t.x), Math.min(this.y, t.y))
            },
            max: function(t) {
                return new e(Math.max(this.x, t.x), Math.max(this.y, t.y))
            },
            toString: function() {
                return this.x + "," + this.y
            },
            setXY: function(t, e) {
                this.x = t, this.y = e
            },
            setFromPoint: function(t) {
                this.x = t.x, this.y = t.y
            },
            swap: function(t) {
                var e = this.x,
                    i = this.y;
                this.x = t.x, this.y = t.y, t.x = e, t.y = i
            }
        }))
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";

        function e(t) {
            this.status = t, this.points = []
        }
        var i = t.fabric || (t.fabric = {});
        return i.Intersection ? void i.warn("fabric.Intersection is already defined") : (i.Intersection = e, i.Intersection.prototype = {
            appendPoint: function(t) {
                this.points.push(t)
            },
            appendPoints: function(t) {
                this.points = this.points.concat(t)
            }
        }, i.Intersection.intersectLineLine = function(t, r, n, s) {
            var o, a = (s.x - n.x) * (t.y - n.y) - (s.y - n.y) * (t.x - n.x),
                h = (r.x - t.x) * (t.y - n.y) - (r.y - t.y) * (t.x - n.x),
                c = (s.y - n.y) * (r.x - t.x) - (s.x - n.x) * (r.y - t.y);
            if (0 !== c) {
                var l = a / c,
                    u = h / c;
                l >= 0 && 1 >= l && u >= 0 && 1 >= u ? (o = new e("Intersection"), o.points.push(new i.Point(t.x + l * (r.x - t.x), t.y + l * (r.y - t.y)))) : o = new e
            } else o = new e(0 === a || 0 === h ? "Coincident" : "Parallel");
            return o
        }, i.Intersection.intersectLinePolygon = function(t, i, r) {
            for (var n = new e, s = r.length, o = 0; s > o; o++) {
                var a = r[o],
                    h = r[(o + 1) % s],
                    c = e.intersectLineLine(t, i, a, h);
                n.appendPoints(c.points)
            }
            return n.points.length > 0 && (n.status = "Intersection"), n
        }, i.Intersection.intersectPolygonPolygon = function(t, i) {
            for (var r = new e, n = t.length, s = 0; n > s; s++) {
                var o = t[s],
                    a = t[(s + 1) % n],
                    h = e.intersectLinePolygon(o, a, i);
                r.appendPoints(h.points)
            }
            return r.points.length > 0 && (r.status = "Intersection"), r
        }, void(i.Intersection.intersectPolygonRectangle = function(t, r, n) {
            var s = r.min(n),
                o = r.max(n),
                a = new i.Point(o.x, s.y),
                h = new i.Point(s.x, o.y),
                c = e.intersectLinePolygon(s, a, t),
                l = e.intersectLinePolygon(a, o, t),
                u = e.intersectLinePolygon(o, h, t),
                f = e.intersectLinePolygon(h, s, t),
                d = new e;
            return d.appendPoints(c.points), d.appendPoints(l.points), d.appendPoints(u.points), d.appendPoints(f.points), d.points.length > 0 && (d.status = "Intersection"), d
        }))
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";

        function e(t) {
            t ? this._tryParsingColor(t) : this.setSource([0, 0, 0, 1])
        }

        function i(t, e, i) {
            return 0 > i && (i += 1), i > 1 && (i -= 1), 1 / 6 > i ? t + 6 * (e - t) * i : .5 > i ? e : 2 / 3 > i ? t + (e - t) * (2 / 3 - i) * 6 : t
        }
        var r = t.fabric || (t.fabric = {});
        return r.Color ? void r.warn("fabric.Color is already defined.") : (r.Color = e, r.Color.prototype = {
            _tryParsingColor: function(t) {
                var i;
                return t in e.colorNameMap && (t = e.colorNameMap[t]), "transparent" === t ? void this.setSource([255, 255, 255, 0]) : (i = e.sourceFromHex(t), i || (i = e.sourceFromRgb(t)), i || (i = e.sourceFromHsl(t)), void(i && this.setSource(i)))
            },
            _rgbToHsl: function(t, e, i) {
                t /= 255, e /= 255, i /= 255;
                var n, s, o, a = r.util.array.max([t, e, i]),
                    h = r.util.array.min([t, e, i]);
                if (o = (a + h) / 2, a === h) n = s = 0;
                else {
                    var c = a - h;
                    switch (s = o > .5 ? c / (2 - a - h) : c / (a + h), a) {
                        case t:
                            n = (e - i) / c + (i > e ? 6 : 0);
                            break;
                        case e:
                            n = (i - t) / c + 2;
                            break;
                        case i:
                            n = (t - e) / c + 4
                    }
                    n /= 6
                }
                return [Math.round(360 * n), Math.round(100 * s), Math.round(100 * o)]
            },
            getSource: function() {
                return this._source
            },
            setSource: function(t) {
                this._source = t
            },
            toRgb: function() {
                var t = this.getSource();
                return "rgb(" + t[0] + "," + t[1] + "," + t[2] + ")"
            },
            toRgba: function() {
                var t = this.getSource();
                return "rgba(" + t[0] + "," + t[1] + "," + t[2] + "," + t[3] + ")"
            },
            toHsl: function() {
                var t = this.getSource(),
                    e = this._rgbToHsl(t[0], t[1], t[2]);
                return "hsl(" + e[0] + "," + e[1] + "%," + e[2] + "%)"
            },
            toHsla: function() {
                var t = this.getSource(),
                    e = this._rgbToHsl(t[0], t[1], t[2]);
                return "hsla(" + e[0] + "," + e[1] + "%," + e[2] + "%," + t[3] + ")"
            },
            toHex: function() {
                var t, e, i, r = this.getSource();
                return t = r[0].toString(16), t = 1 === t.length ? "0" + t : t, e = r[1].toString(16), e = 1 === e.length ? "0" + e : e, i = r[2].toString(16), i = 1 === i.length ? "0" + i : i, t.toUpperCase() + e.toUpperCase() + i.toUpperCase()
            },
            getAlpha: function() {
                return this.getSource()[3]
            },
            setAlpha: function(t) {
                var e = this.getSource();
                return e[3] = t, this.setSource(e), this
            },
            toGrayscale: function() {
                var t = this.getSource(),
                    e = parseInt((.3 * t[0] + .59 * t[1] + .11 * t[2]).toFixed(0), 10),
                    i = t[3];
                return this.setSource([e, e, e, i]), this
            },
            toBlackWhite: function(t) {
                var e = this.getSource(),
                    i = (.3 * e[0] + .59 * e[1] + .11 * e[2]).toFixed(0),
                    r = e[3];
                return t = t || 127, i = Number(i) < Number(t) ? 0 : 255, this.setSource([i, i, i, r]), this
            },
            overlayWith: function(t) {
                t instanceof e || (t = new e(t));
                for (var i = [], r = this.getAlpha(), n = .5, s = this.getSource(), o = t.getSource(), a = 0; 3 > a; a++) i.push(Math.round(s[a] * (1 - n) + o[a] * n));
                return i[3] = r, this.setSource(i), this
            }
        }, r.Color.reRGBa = /^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/, r.Color.reHSLa = /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/, r.Color.reHex = /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i, r.Color.colorNameMap = {
            aqua: "#00FFFF",
            black: "#000000",
            blue: "#0000FF",
            fuchsia: "#FF00FF",
            gray: "#808080",
            green: "#008000",
            lime: "#00FF00",
            maroon: "#800000",
            navy: "#000080",
            olive: "#808000",
            orange: "#FFA500",
            purple: "#800080",
            red: "#FF0000",
            silver: "#C0C0C0",
            teal: "#008080",
            white: "#FFFFFF",
            yellow: "#FFFF00"
        }, r.Color.fromRgb = function(t) {
            return e.fromSource(e.sourceFromRgb(t))
        }, r.Color.sourceFromRgb = function(t) {
            var i = t.match(e.reRGBa);
            if (i) {
                var r = parseInt(i[1], 10) / (/%$/.test(i[1]) ? 100 : 1) * (/%$/.test(i[1]) ? 255 : 1),
                    n = parseInt(i[2], 10) / (/%$/.test(i[2]) ? 100 : 1) * (/%$/.test(i[2]) ? 255 : 1),
                    s = parseInt(i[3], 10) / (/%$/.test(i[3]) ? 100 : 1) * (/%$/.test(i[3]) ? 255 : 1);
                return [parseInt(r, 10), parseInt(n, 10), parseInt(s, 10), i[4] ? parseFloat(i[4]) : 1]
            }
        }, r.Color.fromRgba = e.fromRgb, r.Color.fromHsl = function(t) {
            return e.fromSource(e.sourceFromHsl(t))
        }, r.Color.sourceFromHsl = function(t) {
            var r = t.match(e.reHSLa);
            if (r) {
                var n, s, o, a = (parseFloat(r[1]) % 360 + 360) % 360 / 360,
                    h = parseFloat(r[2]) / (/%$/.test(r[2]) ? 100 : 1),
                    c = parseFloat(r[3]) / (/%$/.test(r[3]) ? 100 : 1);
                if (0 === h) n = s = o = c;
                else {
                    var l = .5 >= c ? c * (h + 1) : c + h - c * h,
                        u = 2 * c - l;
                    n = i(u, l, a + 1 / 3), s = i(u, l, a), o = i(u, l, a - 1 / 3)
                }
                return [Math.round(255 * n), Math.round(255 * s), Math.round(255 * o), r[4] ? parseFloat(r[4]) : 1]
            }
        }, r.Color.fromHsla = e.fromHsl, r.Color.fromHex = function(t) {
            return e.fromSource(e.sourceFromHex(t))
        }, r.Color.sourceFromHex = function(t) {
            if (t.match(e.reHex)) {
                var i = t.slice(t.indexOf("#") + 1),
                    r = 3 === i.length,
                    n = r ? i.charAt(0) + i.charAt(0) : i.substring(0, 2),
                    s = r ? i.charAt(1) + i.charAt(1) : i.substring(2, 4),
                    o = r ? i.charAt(2) + i.charAt(2) : i.substring(4, 6);
                return [parseInt(n, 16), parseInt(s, 16), parseInt(o, 16), 1]
            }
        }, void(r.Color.fromSource = function(t) {
            var i = new e;
            return i.setSource(t), i
        }))
    }("undefined" != typeof exports ? exports : this),
    function() {
        function t(t) {
            var e, i, r, n = t.getAttribute("style"),
                s = t.getAttribute("offset") || 0;
            if (s = parseFloat(s) / (/%$/.test(s) ? 100 : 1), s = 0 > s ? 0 : s > 1 ? 1 : s, n) {
                var o = n.split(/\s*;\s*/);
                "" === o[o.length - 1] && o.pop();
                for (var a = o.length; a--;) {
                    var h = o[a].split(/\s*:\s*/),
                        c = h[0].trim(),
                        l = h[1].trim();
                    "stop-color" === c ? e = l : "stop-opacity" === c && (r = l)
                }
            }
            return e || (e = t.getAttribute("stop-color") || "rgb(0,0,0)"), r || (r = t.getAttribute("stop-opacity")), e = new fabric.Color(e), i = e.getAlpha(), r = isNaN(parseFloat(r)) ? 1 : parseFloat(r), r *= i, {
                offset: s,
                color: e.toRgb(),
                opacity: r
            }
        }

        function e(t) {
            return {
                x1: t.getAttribute("x1") || 0,
                y1: t.getAttribute("y1") || 0,
                x2: t.getAttribute("x2") || "100%",
                y2: t.getAttribute("y2") || 0
            }
        }

        function i(t) {
            return {
                x1: t.getAttribute("fx") || t.getAttribute("cx") || "50%",
                y1: t.getAttribute("fy") || t.getAttribute("cy") || "50%",
                r1: 0,
                x2: t.getAttribute("cx") || "50%",
                y2: t.getAttribute("cy") || "50%",
                r2: t.getAttribute("r") || "50%"
            }
        }

        function r(t, e, i) {
            var r, n = 0,
                s = 1,
                o = "";
            for (var a in e) r = parseFloat(e[a], 10), s = "string" == typeof e[a] && /^\d+%$/.test(e[a]) ? .01 : 1, "x1" === a || "x2" === a || "r2" === a ? (s *= "objectBoundingBox" === i ? t.width : 1, n = "objectBoundingBox" === i ? t.left || 0 : 0) : ("y1" === a || "y2" === a) && (s *= "objectBoundingBox" === i ? t.height : 1, n = "objectBoundingBox" === i ? t.top || 0 : 0), e[a] = r * s + n;
            if ("ellipse" === t.type && null !== e.r2 && "objectBoundingBox" === i && t.rx !== t.ry) {
                var h = t.ry / t.rx;
                o = " scale(1, " + h + ")", e.y1 && (e.y1 /= h), e.y2 && (e.y2 /= h)
            }
            return o
        }
        fabric.Gradient = fabric.util.createClass({
            offsetX: 0,
            offsetY: 0,
            initialize: function(t) {
                t || (t = {});
                var e = {};
                this.id = fabric.Object.__uid++, this.type = t.type || "linear", e = {
                    x1: t.coords.x1 || 0,
                    y1: t.coords.y1 || 0,
                    x2: t.coords.x2 || 0,
                    y2: t.coords.y2 || 0
                }, "radial" === this.type && (e.r1 = t.coords.r1 || 0, e.r2 = t.coords.r2 || 0), this.coords = e, this.colorStops = t.colorStops.slice(), t.gradientTransform && (this.gradientTransform = t.gradientTransform), this.offsetX = t.offsetX || this.offsetX, this.offsetY = t.offsetY || this.offsetY
            },
            addColorStop: function(t) {
                for (var e in t) {
                    var i = new fabric.Color(t[e]);
                    this.colorStops.push({
                        offset: e,
                        color: i.toRgb(),
                        opacity: i.getAlpha()
                    })
                }
                return this
            },
            toObject: function() {
                return {
                    type: this.type,
                    coords: this.coords,
                    colorStops: this.colorStops,
                    offsetX: this.offsetX,
                    offsetY: this.offsetY
                }
            },
            toSVG: function(t) {
                var e, i, r = fabric.util.object.clone(this.coords);
                if (this.colorStops.sort(function(t, e) {
                        return t.offset - e.offset
                    }), !t.group || "path-group" !== t.group.type)
                    for (var n in r) "x1" === n || "x2" === n || "r2" === n ? r[n] += this.offsetX - t.width / 2 : ("y1" === n || "y2" === n) && (r[n] += this.offsetY - t.height / 2);
                i = 'id="SVGID_' + this.id + '" gradientUnits="userSpaceOnUse"', this.gradientTransform && (i += ' gradientTransform="matrix(' + this.gradientTransform.join(" ") + ')" '), "linear" === this.type ? e = ["<linearGradient ", i, ' x1="', r.x1, '" y1="', r.y1, '" x2="', r.x2, '" y2="', r.y2, '">\n'] : "radial" === this.type && (e = ["<radialGradient ", i, ' cx="', r.x2, '" cy="', r.y2, '" r="', r.r2, '" fx="', r.x1, '" fy="', r.y1, '">\n']);
                for (var s = 0; s < this.colorStops.length; s++) e.push("<stop ", 'offset="', 100 * this.colorStops[s].offset + "%", '" style="stop-color:', this.colorStops[s].color, null != this.colorStops[s].opacity ? ";stop-opacity: " + this.colorStops[s].opacity : ";", '"/>\n');
                return e.push("linear" === this.type ? "</linearGradient>\n" : "</radialGradient>\n"), e.join("")
            },
            toLive: function(t, e) {
                var i, r, n = fabric.util.object.clone(this.coords);
                if (this.type) {
                    if (e.group && "path-group" === e.group.type)
                        for (r in n) "x1" === r || "x2" === r ? n[r] += -this.offsetX + e.width / 2 : ("y1" === r || "y2" === r) && (n[r] += -this.offsetY + e.height / 2);
                    "linear" === this.type ? i = t.createLinearGradient(n.x1, n.y1, n.x2, n.y2) : "radial" === this.type && (i = t.createRadialGradient(n.x1, n.y1, n.r1, n.x2, n.y2, n.r2));
                    for (var s = 0, o = this.colorStops.length; o > s; s++) {
                        var a = this.colorStops[s].color,
                            h = this.colorStops[s].opacity,
                            c = this.colorStops[s].offset;
                        "undefined" != typeof h && (a = new fabric.Color(a).setAlpha(h).toRgba()), i.addColorStop(parseFloat(c), a)
                    }
                    return i
                }
            }
        }), fabric.util.object.extend(fabric.Gradient, {
            fromElement: function(n, s) {
                var o, a = n.getElementsByTagName("stop"),
                    h = "linearGradient" === n.nodeName ? "linear" : "radial",
                    c = n.getAttribute("gradientUnits") || "objectBoundingBox",
                    l = n.getAttribute("gradientTransform"),
                    u = [],
                    f = {};
                "linear" === h ? f = e(n) : "radial" === h && (f = i(n));
                for (var d = a.length; d--;) u.push(t(a[d]));
                o = r(s, f, c);
                var g = new fabric.Gradient({
                    type: h,
                    coords: f,
                    colorStops: u,
                    offsetX: -s.left,
                    offsetY: -s.top
                });
                return (l || "" !== o) && (g.gradientTransform = fabric.parseTransformAttribute((l || "") + o)), g
            },
            forObject: function(t, e) {
                return e || (e = {}), r(t, e.coords, "userSpaceOnUse"), new fabric.Gradient(e)
            }
        })
    }(), fabric.Pattern = fabric.util.createClass({
        repeat: "repeat",
        offsetX: 0,
        offsetY: 0,
        initialize: function(t) {
            if (t || (t = {}), this.id = fabric.Object.__uid++, t.source)
                if ("string" == typeof t.source)
                    if ("undefined" != typeof fabric.util.getFunctionBody(t.source)) this.source = new Function(fabric.util.getFunctionBody(t.source));
                    else {
                        var e = this;
                        this.source = fabric.util.createImage(), fabric.util.loadImage(t.source, function(t) {
                            e.source = t
                        })
                    } else this.source = t.source;
            t.repeat && (this.repeat = t.repeat), t.offsetX && (this.offsetX = t.offsetX), t.offsetY && (this.offsetY = t.offsetY)
        },
        toObject: function() {
            var t;
            return "function" == typeof this.source ? t = String(this.source) : "string" == typeof this.source.src ? t = this.source.src : "object" == typeof this.source && this.source.toDataURL && (t = this.source.toDataURL()), {
                source: t,
                repeat: this.repeat,
                offsetX: this.offsetX,
                offsetY: this.offsetY
            }
        },
        toSVG: function(t) {
            var e = "function" == typeof this.source ? this.source() : this.source,
                i = e.width / t.getWidth(),
                r = e.height / t.getHeight(),
                n = this.offsetX / t.getWidth(),
                s = this.offsetY / t.getHeight(),
                o = "";
            return ("repeat-x" === this.repeat || "no-repeat" === this.repeat) && (r = 1), ("repeat-y" === this.repeat || "no-repeat" === this.repeat) && (i = 1), e.src ? o = e.src : e.toDataURL && (o = e.toDataURL()), '<pattern id="SVGID_' + this.id + '" x="' + n + '" y="' + s + '" width="' + i + '" height="' + r + '">\n<image x="0" y="0" width="' + e.width + '" height="' + e.height + '" xlink:href="' + o + '"></image>\n</pattern>\n'
        },
        toLive: function(t) {
            var e = "function" == typeof this.source ? this.source() : this.source;
            if (!e) return "";
            if ("undefined" != typeof e.src) {
                if (!e.complete) return "";
                if (0 === e.naturalWidth || 0 === e.naturalHeight) return ""
            }
            return t.createPattern(e, this.repeat)
        }
    }),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.toFixed;
        return e.Shadow ? void e.warn("fabric.Shadow is already defined.") : (e.Shadow = e.util.createClass({
            color: "rgb(0,0,0)",
            blur: 0,
            offsetX: 0,
            offsetY: 0,
            affectStroke: !1,
            includeDefaultValues: !0,
            initialize: function(t) {
                "string" == typeof t && (t = this._parseShadow(t));
                for (var i in t) this[i] = t[i];
                this.id = e.Object.__uid++
            },
            _parseShadow: function(t) {
                var i = t.trim(),
                    r = e.Shadow.reOffsetsAndBlur.exec(i) || [],
                    n = i.replace(e.Shadow.reOffsetsAndBlur, "") || "rgb(0,0,0)";
                return {
                    color: n.trim(),
                    offsetX: parseInt(r[1], 10) || 0,
                    offsetY: parseInt(r[2], 10) || 0,
                    blur: parseInt(r[3], 10) || 0
                }
            },
            toString: function() {
                return [this.offsetX, this.offsetY, this.blur, this.color].join("px ")
            },
            toSVG: function(t) {
                var e = 40,
                    r = 40;
                return t.width && t.height && (e = 100 * i((Math.abs(this.offsetX) + this.blur) / t.width, 2) + 20, r = 100 * i((Math.abs(this.offsetY) + this.blur) / t.height, 2) + 20), '<filter id="SVGID_' + this.id + '" y="-' + r + '%" height="' + (100 + 2 * r) + '%" x="-' + e + '%" width="' + (100 + 2 * e) + '%" >\n   <feGaussianBlur in="SourceAlpha" stdDeviation="' + i(this.blur ? this.blur / 2 : 0, 3) + '"></feGaussianBlur>\n <feOffset dx="' + this.offsetX + '" dy="' + this.offsetY + '" result="oBlur" ></feOffset>\n <feFlood flood-color="' + this.color + '"/>\n   <feComposite in2="oBlur" operator="in" />\n <feMerge>\n     <feMergeNode></feMergeNode>\n       <feMergeNode in="SourceGraphic"></feMergeNode>\n    </feMerge>\n</filter>\n'
            },
            toObject: function() {
                if (this.includeDefaultValues) return {
                    color: this.color,
                    blur: this.blur,
                    offsetX: this.offsetX,
                    offsetY: this.offsetY
                };
                var t = {},
                    i = e.Shadow.prototype;
                return this.color !== i.color && (t.color = this.color), this.blur !== i.blur && (t.blur = this.blur), this.offsetX !== i.offsetX && (t.offsetX = this.offsetX), this.offsetY !== i.offsetY && (t.offsetY = this.offsetY), t
            }
        }), void(e.Shadow.reOffsetsAndBlur = /(?:\s|^)(-?\d+(?:px)?(?:\s?|$))?(-?\d+(?:px)?(?:\s?|$))?(\d+(?:px)?)?(?:\s?|$)(?:$|\s)/))
    }("undefined" != typeof exports ? exports : this),
    function() {
        "use strict";
        if (fabric.StaticCanvas) return void fabric.warn("fabric.StaticCanvas is already defined.");
        var t = fabric.util.object.extend,
            e = fabric.util.getElementOffset,
            i = fabric.util.removeFromArray,
            r = new Error("Could not initialize `canvas` element");
        fabric.StaticCanvas = fabric.util.createClass({
            initialize: function(t, e) {
                e || (e = {}), this._initStatic(t, e), fabric.StaticCanvas.activeInstance = this
            },
            backgroundColor: "",
            backgroundImage: null,
            overlayColor: "",
            overlayImage: null,
            includeDefaultValues: !0,
            stateful: !0,
            renderOnAddRemove: !0,
            clipTo: null,
            controlsAboveOverlay: !1,
            allowTouchScrolling: !1,
            imageSmoothingEnabled: !0,
            preserveObjectStacking: !1,
            viewportTransform: [1, 0, 0, 1, 0, 0],
            onBeforeScaleRotate: function() {},
            enableRetinaScaling: !0,
            _initStatic: function(t, e) {
                this._objects = [], this._createLowerCanvas(t), this._initOptions(e), this._setImageSmoothing(), this.interactive || this._initRetinaScaling(), e.overlayImage && this.setOverlayImage(e.overlayImage, this.renderAll.bind(this)), e.backgroundImage && this.setBackgroundImage(e.backgroundImage, this.renderAll.bind(this)), e.backgroundColor && this.setBackgroundColor(e.backgroundColor, this.renderAll.bind(this)), e.overlayColor && this.setOverlayColor(e.overlayColor, this.renderAll.bind(this)), this.calcOffset()
            },
            _initRetinaScaling: function() {
                1 !== fabric.devicePixelRatio && this.enableRetinaScaling && (this.lowerCanvasEl.setAttribute("width", this.width * fabric.devicePixelRatio), this.lowerCanvasEl.setAttribute("height", this.height * fabric.devicePixelRatio), this.contextContainer.scale(fabric.devicePixelRatio, fabric.devicePixelRatio))
            },
            calcOffset: function() {
                return this._offset = e(this.lowerCanvasEl), this
            },
            setOverlayImage: function(t, e, i) {
                return this.__setBgOverlayImage("overlayImage", t, e, i)
            },
            setBackgroundImage: function(t, e, i) {
                return this.__setBgOverlayImage("backgroundImage", t, e, i)
            },
            setOverlayColor: function(t, e) {
                return this.__setBgOverlayColor("overlayColor", t, e)
            },
            setBackgroundColor: function(t, e) {
                return this.__setBgOverlayColor("backgroundColor", t, e)
            },
            _setImageSmoothing: function() {
                var t = this.getContext();
                return "undefined" != typeof t.imageSmoothingEnabled ? void(t.imageSmoothingEnabled = this.imageSmoothingEnabled) : (t.webkitImageSmoothingEnabled = this.imageSmoothingEnabled, t.mozImageSmoothingEnabled = this.imageSmoothingEnabled, t.msImageSmoothingEnabled = this.imageSmoothingEnabled, void(t.oImageSmoothingEnabled = this.imageSmoothingEnabled))
            },
            __setBgOverlayImage: function(t, e, i, r) {
                return "string" == typeof e ? fabric.util.loadImage(e, function(e) {
                    this[t] = new fabric.Image(e, r), i && i()
                }, this, r && r.crossOrigin) : (r && e.setOptions(r), this[t] = e, i && i()), this
            },
            __setBgOverlayColor: function(t, e, i) {
                if (e && e.source) {
                    var r = this;
                    fabric.util.loadImage(e.source, function(n) {
                        r[t] = new fabric.Pattern({
                            source: n,
                            repeat: e.repeat,
                            offsetX: e.offsetX,
                            offsetY: e.offsetY
                        }), i && i()
                    })
                } else this[t] = e, i && i();
                return this
            },
            _createCanvasElement: function() {
                var t = fabric.document.createElement("canvas");
                if (t.style || (t.style = {}), !t) throw r;
                return this._initCanvasElement(t), t
            },
            _initCanvasElement: function(t) {
                if (fabric.util.createCanvasElement(t), "undefined" == typeof t.getContext) throw r
            },
            _initOptions: function(t) {
                for (var e in t) this[e] = t[e];
                this.width = this.width || parseInt(this.lowerCanvasEl.width, 10) || 0, this.height = this.height || parseInt(this.lowerCanvasEl.height, 10) || 0, this.lowerCanvasEl.style && (this.lowerCanvasEl.width = this.width, this.lowerCanvasEl.height = this.height, this.lowerCanvasEl.style.width = this.width + "px", this.lowerCanvasEl.style.height = this.height + "px", this.viewportTransform = this.viewportTransform.slice())
            },
            _createLowerCanvas: function(t) {
                this.lowerCanvasEl = fabric.util.getById(t) || this._createCanvasElement(), this._initCanvasElement(this.lowerCanvasEl), fabric.util.addClass(this.lowerCanvasEl, "lower-canvas"), this.interactive && this._applyCanvasStyle(this.lowerCanvasEl), this.contextContainer = this.lowerCanvasEl.getContext("2d")
            },
            getWidth: function() {
                return this.width
            },
            getHeight: function() {
                return this.height
            },
            setWidth: function(t, e) {
                return this.setDimensions({
                    width: t
                }, e)
            },
            setHeight: function(t, e) {
                return this.setDimensions({
                    height: t
                }, e)
            },
            setDimensions: function(t, e) {
                var i;
                e = e || {};
                for (var r in t) i = t[r], e.cssOnly || (this._setBackstoreDimension(r, t[r]), i += "px"), e.backstoreOnly || this._setCssDimension(r, i);
                return this._setImageSmoothing(), this.calcOffset(), e.cssOnly || this.renderAll(), this
            },
            _setBackstoreDimension: function(t, e) {
                return this.lowerCanvasEl[t] = e, this.upperCanvasEl && (this.upperCanvasEl[t] = e), this.cacheCanvasEl && (this.cacheCanvasEl[t] = e), this[t] = e, this
            },
            _setCssDimension: function(t, e) {
                return this.lowerCanvasEl.style[t] = e, this.upperCanvasEl && (this.upperCanvasEl.style[t] = e), this.wrapperEl && (this.wrapperEl.style[t] = e), this
            },
            getZoom: function() {
                return Math.sqrt(this.viewportTransform[0] * this.viewportTransform[3])
            },
            setViewportTransform: function(t) {
                var e = this.getActiveGroup();
                this.viewportTransform = t, this.renderAll();
                for (var i = 0, r = this._objects.length; r > i; i++) this._objects[i].setCoords();
                return e && e.setCoords(), this
            },
            zoomToPoint: function(t, e) {
                var i = t;
                t = fabric.util.transformPoint(t, fabric.util.invertTransform(this.viewportTransform)), this.viewportTransform[0] = e, this.viewportTransform[3] = e;
                var r = fabric.util.transformPoint(t, this.viewportTransform);
                this.viewportTransform[4] += i.x - r.x, this.viewportTransform[5] += i.y - r.y, this.renderAll();
                for (var n = 0, s = this._objects.length; s > n; n++) this._objects[n].setCoords();
                return this
            },
            setZoom: function(t) {
                return this.zoomToPoint(new fabric.Point(0, 0), t), this
            },
            absolutePan: function(t) {
                this.viewportTransform[4] = -t.x, this.viewportTransform[5] = -t.y, this.renderAll();
                for (var e = 0, i = this._objects.length; i > e; e++) this._objects[e].setCoords();
                return this
            },
            relativePan: function(t) {
                return this.absolutePan(new fabric.Point(-t.x - this.viewportTransform[4], -t.y - this.viewportTransform[5]))
            },
            getElement: function() {
                return this.lowerCanvasEl
            },
            getActiveObject: function() {
                return null
            },
            getActiveGroup: function() {
                return null
            },
            _draw: function(t, e) {
                if (e) {
                    t.save();
                    var i = this.viewportTransform;
                    t.transform(i[0], i[1], i[2], i[3], i[4], i[5]), this._shouldRenderObject(e) && e.render(t), t.restore(), this.controlsAboveOverlay || e._renderControls(t)
                }
            },
            _shouldRenderObject: function(t) {
                return t ? t !== this.getActiveGroup() || !this.preserveObjectStacking : !1
            },
            _onObjectAdded: function(t) {
                this.stateful && t.setupState(), t._set("canvas", this), t.setCoords(), this.fire("object:added", {
                    target: t
                }), t.fire("added")
            },
            _onObjectRemoved: function(t) {
                this.getActiveObject() === t && (this.fire("before:selection:cleared", {
                    target: t
                }), this._discardActiveObject(), this.fire("selection:cleared")), this.fire("object:removed", {
                    target: t
                }), t.fire("removed")
            },
            clearContext: function(t) {
                return t.clearRect(0, 0, this.width, this.height), this
            },
            getContext: function() {
                return this.contextContainer
            },
            clear: function() {
                return this._objects.length = 0, this.discardActiveGroup && this.discardActiveGroup(), this.discardActiveObject && this.discardActiveObject(), this.clearContext(this.contextContainer), this.contextTop && this.clearContext(this.contextTop), this.fire("canvas:cleared"), this.renderAll(), this
            },
            renderAll: function(t) {
                var e = this[t === !0 && this.interactive ? "contextTop" : "contextContainer"],
                    i = this.getActiveGroup();
                return this.contextTop && this.selection && !this._groupSelector && this.clearContext(this.contextTop), t || this.clearContext(e), this.fire("before:render"), this.clipTo && fabric.util.clipContext(this, e), this._renderBackground(e), this._renderObjects(e, i), this._renderActiveGroup(e, i), this.clipTo && e.restore(), this._renderOverlay(e), this.controlsAboveOverlay && this.interactive && this.drawControls(e), this.fire("after:render"), this
            },
            _renderObjects: function(t, e) {
                var i, r;
                if (!e || this.preserveObjectStacking)
                    for (i = 0, r = this._objects.length; r > i; ++i) this._draw(t, this._objects[i]);
                else
                    for (i = 0, r = this._objects.length; r > i; ++i) this._objects[i] && !e.contains(this._objects[i]) && this._draw(t, this._objects[i])
            },
            _renderActiveGroup: function(t, e) {
                if (e) {
                    var i = [];
                    this.forEachObject(function(t) {
                        e.contains(t) && i.push(t)
                    }), e._set("_objects", i.reverse()), this._draw(t, e)
                }
            },
            _renderBackground: function(t) {
                this.backgroundColor && (t.fillStyle = this.backgroundColor.toLive ? this.backgroundColor.toLive(t) : this.backgroundColor, t.fillRect(this.backgroundColor.offsetX || 0, this.backgroundColor.offsetY || 0, this.width, this.height)), this.backgroundImage && this._draw(t, this.backgroundImage)
            },
            _renderOverlay: function(t) {
                this.overlayColor && (t.fillStyle = this.overlayColor.toLive ? this.overlayColor.toLive(t) : this.overlayColor, t.fillRect(this.overlayColor.offsetX || 0, this.overlayColor.offsetY || 0, this.width, this.height)), this.overlayImage && this._draw(t, this.overlayImage)
            },
            renderTop: function() {
                var t = this.contextTop || this.contextContainer;
                this.clearContext(t), this.selection && this._groupSelector && this._drawSelection();
                var e = this.getActiveGroup();
                return e && e.render(t), this._renderOverlay(t), this.fire("after:render"), this
            },
            getCenter: function() {
                return {
                    top: this.getHeight() / 2,
                    left: this.getWidth() / 2
                }
            },
            centerObjectH: function(t) {
                return this._centerObject(t, new fabric.Point(this.getCenter().left, t.getCenterPoint().y)), this.renderAll(), this
            },
            centerObjectV: function(t) {
                return this._centerObject(t, new fabric.Point(t.getCenterPoint().x, this.getCenter().top)), this.renderAll(), this
            },
            centerObject: function(t) {
                var e = this.getCenter();
                return this._centerObject(t, new fabric.Point(e.left, e.top)), this.renderAll(), this
            },
            _centerObject: function(t, e) {
                return t.setPositionByOrigin(e, "center", "center"), this
            },
            toDatalessJSON: function(t) {
                return this.toDatalessObject(t)
            },
            toObject: function(t) {
                return this._toObjectMethod("toObject", t)
            },
            toDatalessObject: function(t) {
                return this._toObjectMethod("toDatalessObject", t)
            },
            _toObjectMethod: function(e, i) {
                var r = {
                    objects: this._toObjects(e, i)
                };
                return t(r, this.__serializeBgOverlay()), fabric.util.populateWithProperties(this, r, i), r
            },
            _toObjects: function(t, e) {
                return this.getObjects().map(function(i) {
                    return this._toObject(i, t, e)
                }, this)
            },
            _toObject: function(t, e, i) {
                var r;
                this.includeDefaultValues || (r = t.includeDefaultValues, t.includeDefaultValues = !1);
                var n = this._realizeGroupTransformOnObject(t),
                    s = t[e](i);
                return this.includeDefaultValues || (t.includeDefaultValues = r), this._unwindGroupTransformOnObject(t, n), s
            },
            _realizeGroupTransformOnObject: function(t) {
                var e = ["angle", "flipX", "flipY", "height", "left", "scaleX", "scaleY", "top", "width"];
                if (t.group && t.group === this.getActiveGroup()) {
                    var i = {};
                    return e.forEach(function(e) {
                        i[e] = t[e]
                    }), this.getActiveGroup().realizeTransform(t), i
                }
                return null
            },
            _unwindGroupTransformOnObject: function(t, e) {
                e && t.set(e)
            },
            __serializeBgOverlay: function() {
                var t = {
                    background: this.backgroundColor && this.backgroundColor.toObject ? this.backgroundColor.toObject() : this.backgroundColor
                };
                return this.overlayColor && (t.overlay = this.overlayColor.toObject ? this.overlayColor.toObject() : this.overlayColor), this.backgroundImage && (t.backgroundImage = this.backgroundImage.toObject()),
                    this.overlayImage && (t.overlayImage = this.overlayImage.toObject()), t
            },
            svgViewportTransformation: !0,
            toSVG: function(t, e) {
                t || (t = {});
                var i = [];
                return this._setSVGPreamble(i, t), this._setSVGHeader(i, t), this._setSVGBgOverlayColor(i, "backgroundColor"), this._setSVGBgOverlayImage(i, "backgroundImage"), this._setSVGObjects(i, e), this._setSVGBgOverlayColor(i, "overlayColor"), this._setSVGBgOverlayImage(i, "overlayImage"), i.push("</svg>"), i.join("")
            },
            _setSVGPreamble: function(t, e) {
                e.suppressPreamble || t.push('<?xml version="1.0" encoding="', e.encoding || "UTF-8", '" standalone="no" ?>\n', '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ', '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n')
            },
            _setSVGHeader: function(t, e) {
                var i, r, n;
                e.viewBox ? (i = e.viewBox.width, r = e.viewBox.height) : (i = this.width, r = this.height, this.svgViewportTransformation || (n = this.viewportTransform, i /= n[0], r /= n[3])), t.push("<svg ", 'xmlns="http://www.w3.org/2000/svg" ', 'xmlns:xlink="http://www.w3.org/1999/xlink" ', 'version="1.1" ', 'width="', i, '" ', 'height="', r, '" ', this.backgroundColor && !this.backgroundColor.toLive ? 'style="background-color: ' + this.backgroundColor + '" ' : null, e.viewBox ? 'viewBox="' + e.viewBox.x + " " + e.viewBox.y + " " + e.viewBox.width + " " + e.viewBox.height + '" ' : null, 'xml:space="preserve">\n', "<desc>Created with Fabric.js ", fabric.version, "</desc>\n", "<defs>", fabric.createSVGFontFacesMarkup(this.getObjects()), fabric.createSVGRefElementsMarkup(this), "</defs>\n")
            },
            _setSVGObjects: function(t, e) {
                for (var i = 0, r = this.getObjects(), n = r.length; n > i; i++) {
                    var s = r[i],
                        o = this._realizeGroupTransformOnObject(s);
                    t.push(s.toSVG(e)), this._unwindGroupTransformOnObject(s, o)
                }
            },
            _setSVGBgOverlayImage: function(t, e) {
                this[e] && this[e].toSVG && t.push(this[e].toSVG())
            },
            _setSVGBgOverlayColor: function(t, e) {
                this[e] && this[e].source ? t.push('<rect x="', this[e].offsetX, '" y="', this[e].offsetY, '" ', 'width="', "repeat-y" === this[e].repeat || "no-repeat" === this[e].repeat ? this[e].source.width : this.width, '" height="', "repeat-x" === this[e].repeat || "no-repeat" === this[e].repeat ? this[e].source.height : this.height, '" fill="url(#' + e + 'Pattern)"', "></rect>\n") : this[e] && "overlayColor" === e && t.push('<rect x="0" y="0" ', 'width="', this.width, '" height="', this.height, '" fill="', this[e], '"', "></rect>\n")
            },
            sendToBack: function(t) {
                return i(this._objects, t), this._objects.unshift(t), this.renderAll && this.renderAll()
            },
            bringToFront: function(t) {
                return i(this._objects, t), this._objects.push(t), this.renderAll && this.renderAll()
            },
            sendBackwards: function(t, e) {
                var r = this._objects.indexOf(t);
                if (0 !== r) {
                    var n = this._findNewLowerIndex(t, r, e);
                    i(this._objects, t), this._objects.splice(n, 0, t), this.renderAll && this.renderAll()
                }
                return this
            },
            _findNewLowerIndex: function(t, e, i) {
                var r;
                if (i) {
                    r = e;
                    for (var n = e - 1; n >= 0; --n) {
                        var s = t.intersectsWithObject(this._objects[n]) || t.isContainedWithinObject(this._objects[n]) || this._objects[n].isContainedWithinObject(t);
                        if (s) {
                            r = n;
                            break
                        }
                    }
                } else r = e - 1;
                return r
            },
            bringForward: function(t, e) {
                var r = this._objects.indexOf(t);
                if (r !== this._objects.length - 1) {
                    var n = this._findNewUpperIndex(t, r, e);
                    i(this._objects, t), this._objects.splice(n, 0, t), this.renderAll && this.renderAll()
                }
                return this
            },
            _findNewUpperIndex: function(t, e, i) {
                var r;
                if (i) {
                    r = e;
                    for (var n = e + 1; n < this._objects.length; ++n) {
                        var s = t.intersectsWithObject(this._objects[n]) || t.isContainedWithinObject(this._objects[n]) || this._objects[n].isContainedWithinObject(t);
                        if (s) {
                            r = n;
                            break
                        }
                    }
                } else r = e + 1;
                return r
            },
            moveTo: function(t, e) {
                return i(this._objects, t), this._objects.splice(e, 0, t), this.renderAll && this.renderAll()
            },
            dispose: function() {
                return this.clear(), this.interactive && this.removeListeners(), this
            },
            toString: function() {
                return "#<fabric.Canvas (" + this.complexity() + "): { objects: " + this.getObjects().length + " }>"
            }
        }), t(fabric.StaticCanvas.prototype, fabric.Observable), t(fabric.StaticCanvas.prototype, fabric.Collection), t(fabric.StaticCanvas.prototype, fabric.DataURLExporter), t(fabric.StaticCanvas, {
            EMPTY_JSON: '{"objects": [], "background": "white"}',
            supports: function(t) {
                var e = fabric.util.createCanvasElement();
                if (!e || !e.getContext) return null;
                var i = e.getContext("2d");
                if (!i) return null;
                switch (t) {
                    case "getImageData":
                        return "undefined" != typeof i.getImageData;
                    case "setLineDash":
                        return "undefined" != typeof i.setLineDash;
                    case "toDataURL":
                        return "undefined" != typeof e.toDataURL;
                    case "toDataURLWithQuality":
                        try {
                            return e.toDataURL("image/jpeg", 0), !0
                        } catch (r) {}
                        return !1;
                    default:
                        return null
                }
            }
        }), fabric.StaticCanvas.prototype.toJSON = fabric.StaticCanvas.prototype.toObject
    }(), fabric.BaseBrush = fabric.util.createClass({
        color: "rgb(0, 0, 0)",
        width: 1,
        shadow: null,
        strokeLineCap: "round",
        strokeLineJoin: "round",
        strokeDashArray: null,
        setShadow: function(t) {
            return this.shadow = new fabric.Shadow(t), this
        },
        _setBrushStyles: function() {
            var t = this.canvas.contextTop;
            t.strokeStyle = this.color, t.lineWidth = this.width, t.lineCap = this.strokeLineCap, t.lineJoin = this.strokeLineJoin, this.strokeDashArray && fabric.StaticCanvas.supports("setLineDash") && t.setLineDash(this.strokeDashArray)
        },
        _setShadow: function() {
            if (this.shadow) {
                var t = this.canvas.contextTop;
                t.shadowColor = this.shadow.color, t.shadowBlur = this.shadow.blur, t.shadowOffsetX = this.shadow.offsetX, t.shadowOffsetY = this.shadow.offsetY
            }
        },
        _resetShadow: function() {
            var t = this.canvas.contextTop;
            t.shadowColor = "", t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0
        }
    }),
    function() {
        fabric.PencilBrush = fabric.util.createClass(fabric.BaseBrush, {
            initialize: function(t) {
                this.canvas = t, this._points = []
            },
            onMouseDown: function(t) {
                this._prepareForDrawing(t), this._captureDrawingPath(t), this._render()
            },
            onMouseMove: function(t) {
                this._captureDrawingPath(t), this.canvas.clearContext(this.canvas.contextTop), this._render()
            },
            onMouseUp: function() {
                this._finalizeAndAddPath()
            },
            _prepareForDrawing: function(t) {
                var e = new fabric.Point(t.x, t.y);
                this._reset(), this._addPoint(e), this.canvas.contextTop.moveTo(e.x, e.y)
            },
            _addPoint: function(t) {
                this._points.push(t)
            },
            _reset: function() {
                this._points.length = 0, this._setBrushStyles(), this._setShadow()
            },
            _captureDrawingPath: function(t) {
                var e = new fabric.Point(t.x, t.y);
                this._addPoint(e)
            },
            _render: function() {
                var t = this.canvas.contextTop,
                    e = this.canvas.viewportTransform,
                    i = this._points[0],
                    r = this._points[1];
                t.save(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5]), t.beginPath(), 2 === this._points.length && i.x === r.x && i.y === r.y && (i.x -= .5, r.x += .5), t.moveTo(i.x, i.y);
                for (var n = 1, s = this._points.length; s > n; n++) {
                    var o = i.midPointFrom(r);
                    t.quadraticCurveTo(i.x, i.y, o.x, o.y), i = this._points[n], r = this._points[n + 1]
                }
                t.lineTo(i.x, i.y), t.stroke(), t.restore()
            },
            convertPointsToSVGPath: function(t) {
                var e = [],
                    i = new fabric.Point(t[0].x, t[0].y),
                    r = new fabric.Point(t[1].x, t[1].y);
                e.push("M ", t[0].x, " ", t[0].y, " ");
                for (var n = 1, s = t.length; s > n; n++) {
                    var o = i.midPointFrom(r);
                    e.push("Q ", i.x, " ", i.y, " ", o.x, " ", o.y, " "), i = new fabric.Point(t[n].x, t[n].y), n + 1 < t.length && (r = new fabric.Point(t[n + 1].x, t[n + 1].y))
                }
                return e.push("L ", i.x, " ", i.y, " "), e
            },
            createPath: function(t) {
                var e = new fabric.Path(t, {
                    fill: null,
                    stroke: this.color,
                    strokeWidth: this.width,
                    strokeLineCap: this.strokeLineCap,
                    strokeLineJoin: this.strokeLineJoin,
                    strokeDashArray: this.strokeDashArray,
                    originX: "center",
                    originY: "center"
                });
                return this.shadow && (this.shadow.affectStroke = !0, e.setShadow(this.shadow)), e
            },
            _finalizeAndAddPath: function() {
                var t = this.canvas.contextTop;
                t.closePath();
                var e = this.convertPointsToSVGPath(this._points).join("");
                if ("M 0 0 Q 0 0 0 0 L 0 0" === e) return void this.canvas.renderAll();
                var i = this.createPath(e);
                this.canvas.add(i), i.setCoords(), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderAll(), this.canvas.fire("path:created", {
                    path: i
                })
            }
        })
    }(), fabric.CircleBrush = fabric.util.createClass(fabric.BaseBrush, {
        width: 10,
        initialize: function(t) {
            this.canvas = t, this.points = []
        },
        drawDot: function(t) {
            var e = this.addPoint(t),
                i = this.canvas.contextTop,
                r = this.canvas.viewportTransform;
            i.save(), i.transform(r[0], r[1], r[2], r[3], r[4], r[5]), i.fillStyle = e.fill, i.beginPath(), i.arc(e.x, e.y, e.radius, 0, 2 * Math.PI, !1), i.closePath(), i.fill(), i.restore()
        },
        onMouseDown: function(t) {
            this.points.length = 0, this.canvas.clearContext(this.canvas.contextTop), this._setShadow(), this.drawDot(t)
        },
        onMouseMove: function(t) {
            this.drawDot(t)
        },
        onMouseUp: function() {
            var t = this.canvas.renderOnAddRemove;
            this.canvas.renderOnAddRemove = !1;
            for (var e = [], i = 0, r = this.points.length; r > i; i++) {
                var n = this.points[i],
                    s = new fabric.Circle({
                        radius: n.radius,
                        left: n.x,
                        top: n.y,
                        originX: "center",
                        originY: "center",
                        fill: n.fill
                    });
                this.shadow && s.setShadow(this.shadow), e.push(s)
            }
            var o = new fabric.Group(e, {
                originX: "center",
                originY: "center"
            });
            o.canvas = this.canvas, this.canvas.add(o), this.canvas.fire("path:created", {
                path: o
            }), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderOnAddRemove = t, this.canvas.renderAll()
        },
        addPoint: function(t) {
            var e = new fabric.Point(t.x, t.y),
                i = fabric.util.getRandomInt(Math.max(0, this.width - 20), this.width + 20) / 2,
                r = new fabric.Color(this.color).setAlpha(fabric.util.getRandomInt(0, 100) / 100).toRgba();
            return e.radius = i, e.fill = r, this.points.push(e), e
        }
    }), fabric.SprayBrush = fabric.util.createClass(fabric.BaseBrush, {
        width: 10,
        density: 20,
        dotWidth: 1,
        dotWidthVariance: 1,
        randomOpacity: !1,
        optimizeOverlapping: !0,
        initialize: function(t) {
            this.canvas = t, this.sprayChunks = []
        },
        onMouseDown: function(t) {
            this.sprayChunks.length = 0, this.canvas.clearContext(this.canvas.contextTop), this._setShadow(), this.addSprayChunk(t), this.render()
        },
        onMouseMove: function(t) {
            this.addSprayChunk(t), this.render()
        },
        onMouseUp: function() {
            var t = this.canvas.renderOnAddRemove;
            this.canvas.renderOnAddRemove = !1;
            for (var e = [], i = 0, r = this.sprayChunks.length; r > i; i++)
                for (var n = this.sprayChunks[i], s = 0, o = n.length; o > s; s++) {
                    var a = new fabric.Rect({
                        width: n[s].width,
                        height: n[s].width,
                        left: n[s].x + 1,
                        top: n[s].y + 1,
                        originX: "center",
                        originY: "center",
                        fill: this.color
                    });
                    this.shadow && a.setShadow(this.shadow), e.push(a)
                }
            this.optimizeOverlapping && (e = this._getOptimizedRects(e));
            var h = new fabric.Group(e, {
                originX: "center",
                originY: "center"
            });
            h.canvas = this.canvas, this.canvas.add(h), this.canvas.fire("path:created", {
                path: h
            }), this.canvas.clearContext(this.canvas.contextTop), this._resetShadow(), this.canvas.renderOnAddRemove = t, this.canvas.renderAll()
        },
        _getOptimizedRects: function(t) {
            for (var e, i = {}, r = 0, n = t.length; n > r; r++) e = t[r].left + "" + t[r].top, i[e] || (i[e] = t[r]);
            var s = [];
            for (e in i) s.push(i[e]);
            return s
        },
        render: function() {
            var t = this.canvas.contextTop;
            t.fillStyle = this.color;
            var e = this.canvas.viewportTransform;
            t.save(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5]);
            for (var i = 0, r = this.sprayChunkPoints.length; r > i; i++) {
                var n = this.sprayChunkPoints[i];
                "undefined" != typeof n.opacity && (t.globalAlpha = n.opacity), t.fillRect(n.x, n.y, n.width, n.width)
            }
            t.restore()
        },
        addSprayChunk: function(t) {
            this.sprayChunkPoints = [];
            for (var e, i, r, n = this.width / 2, s = 0; s < this.density; s++) {
                e = fabric.util.getRandomInt(t.x - n, t.x + n), i = fabric.util.getRandomInt(t.y - n, t.y + n), r = this.dotWidthVariance ? fabric.util.getRandomInt(Math.max(1, this.dotWidth - this.dotWidthVariance), this.dotWidth + this.dotWidthVariance) : this.dotWidth;
                var o = new fabric.Point(e, i);
                o.width = r, this.randomOpacity && (o.opacity = fabric.util.getRandomInt(0, 100) / 100), this.sprayChunkPoints.push(o)
            }
            this.sprayChunks.push(this.sprayChunkPoints)
        }
    }), fabric.PatternBrush = fabric.util.createClass(fabric.PencilBrush, {
        getPatternSrc: function() {
            var t = 20,
                e = 5,
                i = fabric.document.createElement("canvas"),
                r = i.getContext("2d");
            return i.width = i.height = t + e, r.fillStyle = this.color, r.beginPath(), r.arc(t / 2, t / 2, t / 2, 0, 2 * Math.PI, !1), r.closePath(), r.fill(), i
        },
        getPatternSrcFunction: function() {
            return String(this.getPatternSrc).replace("this.color", '"' + this.color + '"')
        },
        getPattern: function() {
            return this.canvas.contextTop.createPattern(this.source || this.getPatternSrc(), "repeat")
        },
        _setBrushStyles: function() {
            this.callSuper("_setBrushStyles"), this.canvas.contextTop.strokeStyle = this.getPattern()
        },
        createPath: function(t) {
            var e = this.callSuper("createPath", t);
            return e.stroke = new fabric.Pattern({
                source: this.source || this.getPatternSrcFunction()
            }), e
        }
    }),
    function() {
        var t = fabric.util.getPointer,
            e = fabric.util.degreesToRadians,
            i = fabric.util.radiansToDegrees,
            r = Math.atan2,
            n = Math.abs,
            s = .5;
        fabric.Canvas = fabric.util.createClass(fabric.StaticCanvas, {
            initialize: function(t, e) {
                e || (e = {}), this._initStatic(t, e), this._initInteractive(), this._createCacheCanvas(), fabric.Canvas.activeInstance = this
            },
            uniScaleTransform: !1,
            centeredScaling: !1,
            centeredRotation: !1,
            interactive: !0,
            selection: !0,
            selectionColor: "rgba(100, 100, 255, 0.3)",
            selectionDashArray: [],
            selectionBorderColor: "rgba(255, 255, 255, 0.3)",
            selectionLineWidth: 1,
            hoverCursor: "move",
            moveCursor: "move",
            defaultCursor: "default",
            freeDrawingCursor: "crosshair",
            rotationCursor: "crosshair",
            containerClass: "canvas-container",
            perPixelTargetFind: !1,
            targetFindTolerance: 0,
            skipTargetFind: !1,
            isDrawingMode: !1,
            _initInteractive: function() {
                this._currentTransform = null, this._groupSelector = null, this._initWrapperElement(), this._createUpperCanvas(), this._initEventListeners(), this._initRetinaScaling(), this.freeDrawingBrush = fabric.PencilBrush && new fabric.PencilBrush(this), this.calcOffset()
            },
            _resetCurrentTransform: function(t) {
                var e = this._currentTransform;
                e.target.set({
                    scaleX: e.original.scaleX,
                    scaleY: e.original.scaleY,
                    left: e.original.left,
                    top: e.original.top
                }), this._shouldCenterTransform(t, e.target) ? "rotate" === e.action ? this._setOriginToCenter(e.target) : ("center" !== e.originX && ("right" === e.originX ? e.mouseXSign = -1 : e.mouseXSign = 1), "center" !== e.originY && ("bottom" === e.originY ? e.mouseYSign = -1 : e.mouseYSign = 1), e.originX = "center", e.originY = "center") : (e.originX = e.original.originX, e.originY = e.original.originY)
            },
            containsPoint: function(t, e) {
                var i = this.getPointer(t, !0),
                    r = this._normalizePointer(e, i);
                return e.containsPoint(r) || e._findTargetCorner(i)
            },
            _normalizePointer: function(t, e) {
                var i, r = this.getActiveGroup(),
                    n = e.x,
                    s = e.y,
                    o = r && "group" !== t.type && r.contains(t);
                return o && (i = fabric.util.transformPoint(r.getCenterPoint(), this.viewportTransform, !0), n -= i.x, s -= i.y, n /= r.scaleX, s /= r.scaleY), {
                    x: n,
                    y: s
                }
            },
            isTargetTransparent: function(t, e, i) {
                var r = t.hasBorders,
                    n = t.transparentCorners;
                t.hasBorders = t.transparentCorners = !1, this._draw(this.contextCache, t), t.hasBorders = r, t.transparentCorners = n;
                var s = fabric.util.isTransparent(this.contextCache, e, i, this.targetFindTolerance);
                return this.clearContext(this.contextCache), s
            },
            _shouldClearSelection: function(t, e) {
                var i = this.getActiveGroup(),
                    r = this.getActiveObject();
                return !e || e && i && !i.contains(e) && i !== e && !t.shiftKey || e && !e.evented || e && !e.selectable && r && r !== e
            },
            _shouldCenterTransform: function(t, e) {
                if (e) {
                    var i, r = this._currentTransform;
                    return "scale" === r.action || "scaleX" === r.action || "scaleY" === r.action ? i = this.centeredScaling || e.centeredScaling : "rotate" === r.action && (i = this.centeredRotation || e.centeredRotation), i ? !t.altKey : t.altKey
                }
            },
            _getOriginFromCorner: function(t, e) {
                var i = {
                    x: t.originX,
                    y: t.originY
                };
                return "ml" === e || "tl" === e || "bl" === e ? i.x = "right" : ("mr" === e || "tr" === e || "br" === e) && (i.x = "left"), "tl" === e || "mt" === e || "tr" === e ? i.y = "bottom" : ("bl" === e || "mb" === e || "br" === e) && (i.y = "top"), i
            },
            _getActionFromCorner: function(t, e) {
                var i = "drag";
                return e && (i = "ml" === e || "mr" === e ? "scaleX" : "mt" === e || "mb" === e ? "scaleY" : "mtr" === e ? "rotate" : "scale"), i
            },
            _setupCurrentTransform: function(t, i) {
                if (i) {
                    var r = this.getPointer(t),
                        n = i._findTargetCorner(this.getPointer(t, !0)),
                        s = this._getActionFromCorner(i, n),
                        o = this._getOriginFromCorner(i, n);
                    this._currentTransform = {
                        target: i,
                        action: s,
                        scaleX: i.scaleX,
                        scaleY: i.scaleY,
                        offsetX: r.x - i.left,
                        offsetY: r.y - i.top,
                        originX: o.x,
                        originY: o.y,
                        ex: r.x,
                        ey: r.y,
                        left: i.left,
                        top: i.top,
                        theta: e(i.angle),
                        width: i.width * i.scaleX,
                        mouseXSign: 1,
                        mouseYSign: 1
                    }, this._currentTransform.original = {
                        left: i.left,
                        top: i.top,
                        scaleX: i.scaleX,
                        scaleY: i.scaleY,
                        originX: o.x,
                        originY: o.y
                    }, this._resetCurrentTransform(t)
                }
            },
            _translateObject: function(t, e) {
                var i = this._currentTransform.target;
                i.get("lockMovementX") || i.set("left", t - this._currentTransform.offsetX), i.get("lockMovementY") || i.set("top", e - this._currentTransform.offsetY)
            },
            _scaleObject: function(t, e, i) {
                var r = this._currentTransform,
                    n = r.target,
                    s = n.get("lockScalingX"),
                    o = n.get("lockScalingY"),
                    a = n.get("lockScalingFlip");
                if (!s || !o) {
                    var h = n.translateToOriginPoint(n.getCenterPoint(), r.originX, r.originY),
                        c = n.toLocalPoint(new fabric.Point(t, e), r.originX, r.originY);
                    this._setLocalMouse(c, r), this._setObjectScale(c, r, s, o, i, a), n.setPositionByOrigin(h, r.originX, r.originY)
                }
            },
            _setObjectScale: function(t, e, i, r, n, s) {
                var o = e.target,
                    a = !1,
                    h = !1,
                    c = o._getNonTransformedDimensions();
                e.newScaleX = t.x / c.x, e.newScaleY = t.y / c.y, s && e.newScaleX <= 0 && e.newScaleX < o.scaleX && (a = !0), s && e.newScaleY <= 0 && e.newScaleY < o.scaleY && (h = !0), "equally" !== n || i || r ? n ? "x" !== n || o.get("lockUniScaling") ? "y" !== n || o.get("lockUniScaling") || h || r || o.set("scaleY", e.newScaleY) : a || i || o.set("scaleX", e.newScaleX) : (a || i || o.set("scaleX", e.newScaleX), h || r || o.set("scaleY", e.newScaleY)) : a || h || this._scaleObjectEqually(t, o, e), a || h || this._flipObject(e, n)
            },
            _scaleObjectEqually: function(t, e, i) {
                var r = t.y + t.x,
                    n = e._getNonTransformedDimensions(),
                    s = n.y * i.original.scaleY + n.x * i.original.scaleX;
                i.newScaleX = i.original.scaleX * r / s, i.newScaleY = i.original.scaleY * r / s, e.set("scaleX", i.newScaleX), e.set("scaleY", i.newScaleY)
            },
            _flipObject: function(t, e) {
                t.newScaleX < 0 && "y" !== e && ("left" === t.originX ? t.originX = "right" : "right" === t.originX && (t.originX = "left")), t.newScaleY < 0 && "x" !== e && ("top" === t.originY ? t.originY = "bottom" : "bottom" === t.originY && (t.originY = "top"))
            },
            _setLocalMouse: function(t, e) {
                var i = e.target;
                "right" === e.originX ? t.x *= -1 : "center" === e.originX && (t.x *= 2 * e.mouseXSign, t.x < 0 && (e.mouseXSign = -e.mouseXSign)), "bottom" === e.originY ? t.y *= -1 : "center" === e.originY && (t.y *= 2 * e.mouseYSign, t.y < 0 && (e.mouseYSign = -e.mouseYSign)), n(t.x) > i.padding ? t.x < 0 ? t.x += i.padding : t.x -= i.padding : t.x = 0, n(t.y) > i.padding ? t.y < 0 ? t.y += i.padding : t.y -= i.padding : t.y = 0
            },
            _rotateObject: function(t, e) {
                var n = this._currentTransform;
                if (!n.target.get("lockRotation")) {
                    var s = r(n.ey - n.top, n.ex - n.left),
                        o = r(e - n.top, t - n.left),
                        a = i(o - s + n.theta);
                    0 > a && (a = 360 + a), n.target.angle = a % 360
                }
            },
            setCursor: function(t) {
                this.upperCanvasEl.style.cursor = t
            },
            _resetObjectTransform: function(t) {
                t.scaleX = 1, t.scaleY = 1, t.setAngle(0)
            },
            _drawSelection: function() {
                var t = this.contextTop,
                    e = this._groupSelector,
                    i = e.left,
                    r = e.top,
                    o = n(i),
                    a = n(r);
                if (t.fillStyle = this.selectionColor, t.fillRect(e.ex - (i > 0 ? 0 : -i), e.ey - (r > 0 ? 0 : -r), o, a), t.lineWidth = this.selectionLineWidth, t.strokeStyle = this.selectionBorderColor, this.selectionDashArray.length > 1) {
                    var h = e.ex + s - (i > 0 ? 0 : o),
                        c = e.ey + s - (r > 0 ? 0 : a);
                    t.beginPath(), fabric.util.drawDashedLine(t, h, c, h + o, c, this.selectionDashArray), fabric.util.drawDashedLine(t, h, c + a - 1, h + o, c + a - 1, this.selectionDashArray), fabric.util.drawDashedLine(t, h, c, h, c + a, this.selectionDashArray), fabric.util.drawDashedLine(t, h + o - 1, c, h + o - 1, c + a, this.selectionDashArray), t.closePath(), t.stroke()
                } else t.strokeRect(e.ex + s - (i > 0 ? 0 : o), e.ey + s - (r > 0 ? 0 : a), o, a)
            },
            _isLastRenderedObject: function(t) {
                return this.controlsAboveOverlay && this.lastRenderedObjectWithControlsAboveOverlay && this.lastRenderedObjectWithControlsAboveOverlay.visible && this.containsPoint(t, this.lastRenderedObjectWithControlsAboveOverlay) && this.lastRenderedObjectWithControlsAboveOverlay._findTargetCorner(this.getPointer(t, !0))
            },
            findTarget: function(t, e) {
                if (!this.skipTargetFind) {
                    if (this._isLastRenderedObject(t)) return this.lastRenderedObjectWithControlsAboveOverlay;
                    var i = this.getActiveGroup();
                    if (i && !e && this.containsPoint(t, i)) return i;
                    var r = this._searchPossibleTargets(t, e);
                    return this._fireOverOutEvents(r, t), r
                }
            },
            _fireOverOutEvents: function(t, e) {
                t ? this._hoveredTarget !== t && (this._hoveredTarget && (this.fire("mouse:out", {
                    target: this._hoveredTarget,
                    e: e
                }), this._hoveredTarget.fire("mouseout")), this.fire("mouse:over", {
                    target: t,
                    e: e
                }), t.fire("mouseover"), this._hoveredTarget = t) : this._hoveredTarget && (this.fire("mouse:out", {
                    target: this._hoveredTarget,
                    e: e
                }), this._hoveredTarget.fire("mouseout"), this._hoveredTarget = null)
            },
            _checkTarget: function(t, e, i) {
                if (e && e.visible && e.evented && this.containsPoint(t, e)) {
                    if (!this.perPixelTargetFind && !e.perPixelTargetFind || e.isEditing) return !0;
                    var r = this.isTargetTransparent(e, i.x, i.y);
                    if (!r) return !0
                }
            },
            _searchPossibleTargets: function(t, e) {
                for (var i, r = this.getPointer(t, !0), n = this._objects.length; n--;)
                    if ((!this._objects[n].group || e) && this._checkTarget(t, this._objects[n], r)) {
                        this.relatedTarget = this._objects[n], i = this._objects[n];
                        break
                    }
                return i
            },
            getPointer: function(e, i, r) {
                r || (r = this.upperCanvasEl);
                var n, s = t(e),
                    o = r.getBoundingClientRect(),
                    a = o.width || 0,
                    h = o.height || 0;
                return a && h || ("top" in o && "bottom" in o && (h = Math.abs(o.top - o.bottom)), "right" in o && "left" in o && (a = Math.abs(o.right - o.left))), this.calcOffset(), s.x = s.x - this._offset.left, s.y = s.y - this._offset.top, i || (s = fabric.util.transformPoint(s, fabric.util.invertTransform(this.viewportTransform))), n = 0 === a || 0 === h ? {
                    width: 1,
                    height: 1
                } : {
                    width: r.width / a,
                    height: r.height / h
                }, {
                    x: s.x * n.width,
                    y: s.y * n.height
                }
            },
            _createUpperCanvas: function() {
                var t = this.lowerCanvasEl.className.replace(/\s*lower-canvas\s*/, "");
                this.upperCanvasEl = this._createCanvasElement(), fabric.util.addClass(this.upperCanvasEl, "upper-canvas " + t), this.wrapperEl.appendChild(this.upperCanvasEl), this._copyCanvasStyle(this.lowerCanvasEl, this.upperCanvasEl), this._applyCanvasStyle(this.upperCanvasEl), this.contextTop = this.upperCanvasEl.getContext("2d")
            },
            _createCacheCanvas: function() {
                this.cacheCanvasEl = this._createCanvasElement(), this.cacheCanvasEl.setAttribute("width", this.width), this.cacheCanvasEl.setAttribute("height", this.height), this.contextCache = this.cacheCanvasEl.getContext("2d")
            },
            _initWrapperElement: function() {
                this.wrapperEl = fabric.util.wrapElement(this.lowerCanvasEl, "div", {
                    "class": this.containerClass
                }), fabric.util.setStyle(this.wrapperEl, {
                    width: this.getWidth() + "px",
                    height: this.getHeight() + "px",
                    position: "relative"
                }), fabric.util.makeElementUnselectable(this.wrapperEl)
            },
            _applyCanvasStyle: function(t) {
                var e = this.getWidth() || t.width,
                    i = this.getHeight() || t.height;
                fabric.util.setStyle(t, {
                    position: "absolute",
                    width: e + "px",
                    height: i + "px",
                    left: 0,
                    top: 0
                }), t.width = e, t.height = i, fabric.util.makeElementUnselectable(t)
            },
            _copyCanvasStyle: function(t, e) {
                e.style.cssText = t.style.cssText
            },
            getSelectionContext: function() {
                return this.contextTop
            },
            getSelectionElement: function() {
                return this.upperCanvasEl
            },
            _setActiveObject: function(t) {
                this._activeObject && this._activeObject.set("active", !1), this._activeObject = t, t.set("active", !0)
            },
            setActiveObject: function(t, e) {
                return this._setActiveObject(t), this.renderAll(), this.fire("object:selected", {
                    target: t,
                    e: e
                }), t.fire("selected", {
                    e: e
                }), this
            },
            getActiveObject: function() {
                return this._activeObject
            },
            _discardActiveObject: function() {
                this._activeObject && this._activeObject.set("active", !1), this._activeObject = null
            },
            discardActiveObject: function(t) {
                return this._discardActiveObject(), this.renderAll(), this.fire("selection:cleared", {
                    e: t
                }), this
            },
            _setActiveGroup: function(t) {
                this._activeGroup = t, t && t.set("active", !0)
            },
            setActiveGroup: function(t, e) {
                return this._setActiveGroup(t), t && (this.fire("object:selected", {
                    target: t,
                    e: e
                }), t.fire("selected", {
                    e: e
                })), this
            },
            getActiveGroup: function() {
                return this._activeGroup
            },
            _discardActiveGroup: function() {
                var t = this.getActiveGroup();
                t && t.destroy(), this.setActiveGroup(null)
            },
            discardActiveGroup: function(t) {
                return this._discardActiveGroup(), this.fire("selection:cleared", {
                    e: t
                }), this
            },
            deactivateAll: function() {
                for (var t = this.getObjects(), e = 0, i = t.length; i > e; e++) t[e].set("active", !1);
                return this._discardActiveGroup(), this._discardActiveObject(), this
            },
            deactivateAllWithDispatch: function(t) {
                var e = this.getActiveGroup() || this.getActiveObject();
                return e && this.fire("before:selection:cleared", {
                    target: e,
                    e: t
                }), this.deactivateAll(), e && this.fire("selection:cleared", {
                    e: t
                }), this
            },
            drawControls: function(t) {
                var e = this.getActiveGroup();
                e ? this._drawGroupControls(t, e) : this._drawObjectsControls(t)
            },
            _drawGroupControls: function(t, e) {
                e._renderControls(t)
            },
            _drawObjectsControls: function(t) {
                for (var e = 0, i = this._objects.length; i > e; ++e) this._objects[e] && this._objects[e].active && (this._objects[e]._renderControls(t), this.lastRenderedObjectWithControlsAboveOverlay = this._objects[e])
            }
        });
        for (var o in fabric.StaticCanvas) "prototype" !== o && (fabric.Canvas[o] = fabric.StaticCanvas[o]);
        fabric.isTouchSupported && (fabric.Canvas.prototype._setCursorFromEvent = function() {}), fabric.Element = fabric.Canvas
    }(),
    function() {
        var t = {
                mt: 0,
                tr: 1,
                mr: 2,
                br: 3,
                mb: 4,
                bl: 5,
                ml: 6,
                tl: 7
            },
            e = fabric.util.addListener,
            i = fabric.util.removeListener;
        fabric.util.object.extend(fabric.Canvas.prototype, {
            cursorMap: ["n-resize", "ne-resize", "e-resize", "se-resize", "s-resize", "sw-resize", "w-resize", "nw-resize"],
            _initEventListeners: function() {
                this._bindEvents(), e(fabric.window, "resize", this._onResize), e(this.upperCanvasEl, "mousedown", this._onMouseDown), e(this.upperCanvasEl, "mousemove", this._onMouseMove), e(this.upperCanvasEl, "mousewheel", this._onMouseWheel), e(this.upperCanvasEl, "touchstart", this._onMouseDown), e(this.upperCanvasEl, "touchmove", this._onMouseMove), "undefined" != typeof eventjs && "add" in eventjs && (eventjs.add(this.upperCanvasEl, "gesture", this._onGesture), eventjs.add(this.upperCanvasEl, "drag", this._onDrag), eventjs.add(this.upperCanvasEl, "orientation", this._onOrientationChange), eventjs.add(this.upperCanvasEl, "shake", this._onShake), eventjs.add(this.upperCanvasEl, "longpress", this._onLongPress))
            },
            _bindEvents: function() {
                this._onMouseDown = this._onMouseDown.bind(this), this._onMouseMove = this._onMouseMove.bind(this), this._onMouseUp = this._onMouseUp.bind(this), this._onResize = this._onResize.bind(this), this._onGesture = this._onGesture.bind(this), this._onDrag = this._onDrag.bind(this), this._onShake = this._onShake.bind(this), this._onLongPress = this._onLongPress.bind(this), this._onOrientationChange = this._onOrientationChange.bind(this), this._onMouseWheel = this._onMouseWheel.bind(this)
            },
            removeListeners: function() {
                i(fabric.window, "resize", this._onResize), i(this.upperCanvasEl, "mousedown", this._onMouseDown), i(this.upperCanvasEl, "mousemove", this._onMouseMove), i(this.upperCanvasEl, "mousewheel", this._onMouseWheel), i(this.upperCanvasEl, "touchstart", this._onMouseDown), i(this.upperCanvasEl, "touchmove", this._onMouseMove), "undefined" != typeof eventjs && "remove" in eventjs && (eventjs.remove(this.upperCanvasEl, "gesture", this._onGesture), eventjs.remove(this.upperCanvasEl, "drag", this._onDrag), eventjs.remove(this.upperCanvasEl, "orientation", this._onOrientationChange), eventjs.remove(this.upperCanvasEl, "shake", this._onShake), eventjs.remove(this.upperCanvasEl, "longpress", this._onLongPress))
            },
            _onGesture: function(t, e) {
                this.__onTransformGesture && this.__onTransformGesture(t, e)
            },
            _onDrag: function(t, e) {
                this.__onDrag && this.__onDrag(t, e)
            },
            _onMouseWheel: function(t, e) {
                this.__onMouseWheel && this.__onMouseWheel(t, e)
            },
            _onOrientationChange: function(t, e) {
                this.__onOrientationChange && this.__onOrientationChange(t, e)
            },
            _onShake: function(t, e) {
                this.__onShake && this.__onShake(t, e)
            },
            _onLongPress: function(t, e) {
                this.__onLongPress && this.__onLongPress(t, e)
            },
            _onMouseDown: function(t) {
                this.__onMouseDown(t), e(fabric.document, "touchend", this._onMouseUp), e(fabric.document, "touchmove", this._onMouseMove), i(this.upperCanvasEl, "mousemove", this._onMouseMove), i(this.upperCanvasEl, "touchmove", this._onMouseMove), "touchstart" === t.type ? i(this.upperCanvasEl, "mousedown", this._onMouseDown) : (e(fabric.document, "mouseup", this._onMouseUp), e(fabric.document, "mousemove", this._onMouseMove))
            },
            _onMouseUp: function(t) {
                if (this.__onMouseUp(t), i(fabric.document, "mouseup", this._onMouseUp), i(fabric.document, "touchend", this._onMouseUp), i(fabric.document, "mousemove", this._onMouseMove), i(fabric.document, "touchmove", this._onMouseMove), e(this.upperCanvasEl, "mousemove", this._onMouseMove), e(this.upperCanvasEl, "touchmove", this._onMouseMove), "touchend" === t.type) {
                    var r = this;
                    setTimeout(function() {
                        e(r.upperCanvasEl, "mousedown", r._onMouseDown)
                    }, 400)
                }
            },
            _onMouseMove: function(t) {
                !this.allowTouchScrolling && t.preventDefault && t.preventDefault(), this.__onMouseMove(t)
            },
            _onResize: function() {
                this.calcOffset()
            },
            _shouldRender: function(t, e) {
                var i = this.getActiveGroup() || this.getActiveObject();
                return !!(t && (t.isMoving || t !== i) || !t && i || !t && !i && !this._groupSelector || e && this._previousPointer && this.selection && (e.x !== this._previousPointer.x || e.y !== this._previousPointer.y))
            },
            __onMouseUp: function(t) {
                var e;
                if (this.isDrawingMode && this._isCurrentlyDrawing) return void this._onMouseUpInDrawingMode(t);
                this._currentTransform ? (this._finalizeCurrentTransform(), e = this._currentTransform.target) : e = this.findTarget(t, !0);
                var i = this._shouldRender(e, this.getPointer(t));
                this._maybeGroupObjects(t), e && (e.isMoving = !1), i && this.renderAll(), this._handleCursorAndEvent(t, e)
            },
            _handleCursorAndEvent: function(t, e) {
                this._setCursorFromEvent(t, e);
                var i = this;
                setTimeout(function() {
                    i._setCursorFromEvent(t, e)
                }, 50), this.fire("mouse:up", {
                    target: e,
                    e: t
                }), e && e.fire("mouseup", {
                    e: t
                })
            },
            _finalizeCurrentTransform: function() {
                var t = this._currentTransform,
                    e = t.target;
                e._scaling && (e._scaling = !1), e.setCoords(), this.stateful && e.hasStateChanged() && (this.fire("object:modified", {
                    target: e
                }), e.fire("modified")), this._restoreOriginXY(e)
            },
            _restoreOriginXY: function(t) {
                if (this._previousOriginX && this._previousOriginY) {
                    var e = t.translateToOriginPoint(t.getCenterPoint(), this._previousOriginX, this._previousOriginY);
                    t.originX = this._previousOriginX, t.originY = this._previousOriginY, t.left = e.x, t.top = e.y, this._previousOriginX = null, this._previousOriginY = null
                }
            },
            _onMouseDownInDrawingMode: function(t) {
                this._isCurrentlyDrawing = !0, this.discardActiveObject(t).renderAll(), this.clipTo && fabric.util.clipContext(this, this.contextTop);
                var e = fabric.util.invertTransform(this.viewportTransform),
                    i = fabric.util.transformPoint(this.getPointer(t, !0), e);
                this.freeDrawingBrush.onMouseDown(i), this.fire("mouse:down", {
                    e: t
                });
                var r = this.findTarget(t);
                "undefined" != typeof r && r.fire("mousedown", {
                    e: t,
                    target: r
                })
            },
            _onMouseMoveInDrawingMode: function(t) {
                if (this._isCurrentlyDrawing) {
                    var e = fabric.util.invertTransform(this.viewportTransform),
                        i = fabric.util.transformPoint(this.getPointer(t, !0), e);
                    this.freeDrawingBrush.onMouseMove(i)
                }
                this.setCursor(this.freeDrawingCursor), this.fire("mouse:move", {
                    e: t
                });
                var r = this.findTarget(t);
                "undefined" != typeof r && r.fire("mousemove", {
                    e: t,
                    target: r
                })
            },
            _onMouseUpInDrawingMode: function(t) {
                this._isCurrentlyDrawing = !1, this.clipTo && this.contextTop.restore(), this.freeDrawingBrush.onMouseUp(), this.fire("mouse:up", {
                    e: t
                });
                var e = this.findTarget(t);
                "undefined" != typeof e && e.fire("mouseup", {
                    e: t,
                    target: e
                })
            },
            __onMouseDown: function(t) {
                var e = "which" in t ? 1 === t.which : 1 === t.button;
                if (e || fabric.isTouchSupported) {
                    if (this.isDrawingMode) return void this._onMouseDownInDrawingMode(t);
                    if (!this._currentTransform) {
                        var i = this.findTarget(t),
                            r = this.getPointer(t, !0);
                        this._previousPointer = r;
                        var n = this._shouldRender(i, r),
                            s = this._shouldGroup(t, i);
                        this._shouldClearSelection(t, i) ? this._clearSelection(t, i, r) : s && (this._handleGrouping(t, i), i = this.getActiveGroup()), i && i.selectable && !s && (this._beforeTransform(t, i), this._setupCurrentTransform(t, i)), n && this.renderAll(), this.fire("mouse:down", {
                            target: i,
                            e: t
                        }), i && i.fire("mousedown", {
                            e: t
                        })
                    }
                }
            },
            _beforeTransform: function(t, e) {
                this.stateful && e.saveState(), e._findTargetCorner(this.getPointer(t)) && this.onBeforeScaleRotate(e), e !== this.getActiveGroup() && e !== this.getActiveObject() && (this.deactivateAll(), this.setActiveObject(e, t))
            },
            _clearSelection: function(t, e, i) {
                this.deactivateAllWithDispatch(t), e && e.selectable ? this.setActiveObject(e, t) : this.selection && (this._groupSelector = {
                    ex: i.x,
                    ey: i.y,
                    top: 0,
                    left: 0
                })
            },
            _setOriginToCenter: function(t) {
                this._previousOriginX = this._currentTransform.target.originX, this._previousOriginY = this._currentTransform.target.originY;
                var e = t.getCenterPoint();
                t.originX = "center", t.originY = "center", t.left = e.x, t.top = e.y, this._currentTransform.left = t.left, this._currentTransform.top = t.top
            },
            _setCenterToOrigin: function(t) {
                var e = t.translateToOriginPoint(t.getCenterPoint(), this._previousOriginX, this._previousOriginY);
                t.originX = this._previousOriginX, t.originY = this._previousOriginY, t.left = e.x, t.top = e.y, this._previousOriginX = null, this._previousOriginY = null
            },
            __onMouseMove: function(t) {
                var e, i;
                if (this.isDrawingMode) return void this._onMouseMoveInDrawingMode(t);
                if (!("undefined" != typeof t.touches && t.touches.length > 1)) {
                    var r = this._groupSelector;
                    r ? (i = this.getPointer(t, !0), r.left = i.x - r.ex, r.top = i.y - r.ey, this.renderTop()) : this._currentTransform ? this._transformObject(t) : (e = this.findTarget(t), !e || e && !e.selectable ? this.setCursor(this.defaultCursor) : this._setCursorFromEvent(t, e)), this.fire("mouse:move", {
                        target: e,
                        e: t
                    }), e && e.fire("mousemove", {
                        e: t
                    })
                }
            },
            _transformObject: function(t) {
                var e = this.getPointer(t),
                    i = this._currentTransform;
                i.reset = !1, i.target.isMoving = !0, this._beforeScaleTransform(t, i), this._performTransformAction(t, i, e), this.renderAll()
            },
            _performTransformAction: function(t, e, i) {
                var r = i.x,
                    n = i.y,
                    s = e.target,
                    o = e.action;
                "rotate" === o ? (this._rotateObject(r, n), this._fire("rotating", s, t)) : "scale" === o ? (this._onScale(t, e, r, n), this._fire("scaling", s, t)) : "scaleX" === o ? (this._scaleObject(r, n, "x"), this._fire("scaling", s, t)) : "scaleY" === o ? (this._scaleObject(r, n, "y"), this._fire("scaling", s, t)) : (this._translateObject(r, n), this._fire("moving", s, t), this.setCursor(this.moveCursor))
            },
            _fire: function(t, e, i) {
                this.fire("object:" + t, {
                    target: e,
                    e: i
                }), e.fire(t, {
                    e: i
                })
            },
            _beforeScaleTransform: function(t, e) {
                if ("scale" === e.action || "scaleX" === e.action || "scaleY" === e.action) {
                    var i = this._shouldCenterTransform(t, e.target);
                    (i && ("center" !== e.originX || "center" !== e.originY) || !i && "center" === e.originX && "center" === e.originY) && (this._resetCurrentTransform(t), e.reset = !0)
                }
            },
            _onScale: function(t, e, i, r) {
                !t.shiftKey && !this.uniScaleTransform || e.target.get("lockUniScaling") ? (e.reset || "scale" !== e.currentAction || this._resetCurrentTransform(t, e.target), e.currentAction = "scaleEqually", this._scaleObject(i, r, "equally")) : (e.currentAction = "scale", this._scaleObject(i, r))
            },
            _setCursorFromEvent: function(t, e) {
                if (!e || !e.selectable) return this.setCursor(this.defaultCursor), !1;
                var i = this.getActiveGroup(),
                    r = e._findTargetCorner && (!i || !i.contains(e)) && e._findTargetCorner(this.getPointer(t, !0));
                return r ? this._setCornerCursor(r, e) : this.setCursor(e.hoverCursor || this.hoverCursor), !0
            },
            _setCornerCursor: function(e, i) {
                if (e in t) this.setCursor(this._getRotatedCornerCursor(e, i));
                else {
                    if ("mtr" !== e || !i.hasRotatingPoint) return this.setCursor(this.defaultCursor), !1;
                    this.setCursor(this.rotationCursor)
                }
            },
            _getRotatedCornerCursor: function(e, i) {
                var r = Math.round(i.getAngle() % 360 / 45);
                return 0 > r && (r += 8), r += t[e], r %= 8, this.cursorMap[r]
            }
        })
    }(),
    function() {
        var t = Math.min,
            e = Math.max;
        fabric.util.object.extend(fabric.Canvas.prototype, {
            _shouldGroup: function(t, e) {
                var i = this.getActiveObject();
                return t.shiftKey && (this.getActiveGroup() || i && i !== e) && this.selection
            },
            _handleGrouping: function(t, e) {
                (e !== this.getActiveGroup() || (e = this.findTarget(t, !0), e && !e.isType("group"))) && (this.getActiveGroup() ? this._updateActiveGroup(e, t) : this._createActiveGroup(e, t), this._activeGroup && this._activeGroup.saveCoords())
            },
            _updateActiveGroup: function(t, e) {
                var i = this.getActiveGroup();
                if (i.contains(t)) {
                    if (i.removeWithUpdate(t), this._resetObjectTransform(i), t.set("active", !1), 1 === i.size()) return this.discardActiveGroup(e), void this.setActiveObject(i.item(0))
                } else i.addWithUpdate(t), this._resetObjectTransform(i);
                this.fire("selection:created", {
                    target: i,
                    e: e
                }), i.set("active", !0)
            },
            _createActiveGroup: function(t, e) {
                if (this._activeObject && t !== this._activeObject) {
                    var i = this._createGroup(t);
                    i.addWithUpdate(), this.setActiveGroup(i), this._activeObject = null, this.fire("selection:created", {
                        target: i,
                        e: e
                    })
                }
                t.set("active", !0)
            },
            _createGroup: function(t) {
                var e = this.getObjects(),
                    i = e.indexOf(this._activeObject) < e.indexOf(t),
                    r = i ? [this._activeObject, t] : [t, this._activeObject];
                return new fabric.Group(r, {
                    canvas: this
                })
            },
            _groupSelectedObjects: function(t) {
                var e = this._collectObjects();
                1 === e.length ? this.setActiveObject(e[0], t) : e.length > 1 && (e = new fabric.Group(e.reverse(), {
                    canvas: this
                }), e.addWithUpdate(), this.setActiveGroup(e, t), e.saveCoords(), this.fire("selection:created", {
                    target: e
                }), this.renderAll())
            },
            _collectObjects: function() {
                for (var i, r = [], n = this._groupSelector.ex, s = this._groupSelector.ey, o = n + this._groupSelector.left, a = s + this._groupSelector.top, h = new fabric.Point(t(n, o), t(s, a)), c = new fabric.Point(e(n, o), e(s, a)), l = n === o && s === a, u = this._objects.length; u-- && (i = this._objects[u], !(i && i.selectable && i.visible && (i.intersectsWithRect(h, c) || i.isContainedWithinRect(h, c) || i.containsPoint(h) || i.containsPoint(c)) && (i.set("active", !0), r.push(i), l))););
                return r
            },
            _maybeGroupObjects: function(t) {
                this.selection && this._groupSelector && this._groupSelectedObjects(t);
                var e = this.getActiveGroup();
                e && (e.setObjectsCoords().setCoords(), e.isMoving = !1, this.setCursor(this.defaultCursor)), this._groupSelector = null, this._currentTransform = null
            }
        })
    }(), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        toDataURL: function(t) {
            t || (t = {});
            var e = t.format || "png",
                i = t.quality || 1,
                r = t.multiplier || 1,
                n = {
                    left: t.left,
                    top: t.top,
                    width: t.width,
                    height: t.height
                };
            return 1 !== r ? this.__toDataURLWithMultiplier(e, i, n, r) : this.__toDataURL(e, i, n)
        },
        __toDataURL: function(t, e, i) {
            this.renderAll(!0);
            var r = this.upperCanvasEl || this.lowerCanvasEl,
                n = this.__getCroppedCanvas(r, i);
            "jpg" === t && (t = "jpeg");
            var s = fabric.StaticCanvas.supports("toDataURLWithQuality") ? (n || r).toDataURL("image/" + t, e) : (n || r).toDataURL("image/" + t);
            return this.contextTop && this.clearContext(this.contextTop), this.renderAll(), n && (n = null), s
        },
        __getCroppedCanvas: function(t, e) {
            var i, r, n = "left" in e || "top" in e || "width" in e || "height" in e;
            return n && (i = fabric.util.createCanvasElement(), r = i.getContext("2d"), i.width = e.width || this.width, i.height = e.height || this.height, r.drawImage(t, -e.left || 0, -e.top || 0)), i
        },
        __toDataURLWithMultiplier: function(t, e, i, r) {
            var n = this.getWidth(),
                s = this.getHeight(),
                o = n * r,
                a = s * r,
                h = this.getActiveObject(),
                c = this.getActiveGroup(),
                l = this.contextTop || this.contextContainer;
            r > 1 && this.setWidth(o).setHeight(a), l.scale(r, r), i.left && (i.left *= r), i.top && (i.top *= r), i.width ? i.width *= r : 1 > r && (i.width = o), i.height ? i.height *= r : 1 > r && (i.height = a), c ? this._tempRemoveBordersControlsFromGroup(c) : h && this.deactivateAll && this.deactivateAll(), this.renderAll(!0);
            var u = this.__toDataURL(t, e, i);
            return this.width = n, this.height = s, l.scale(1 / r, 1 / r), this.setWidth(n).setHeight(s), c ? this._restoreBordersControlsOnGroup(c) : h && this.setActiveObject && this.setActiveObject(h), this.contextTop && this.clearContext(this.contextTop), this.renderAll(), u
        },
        toDataURLWithMultiplier: function(t, e, i) {
            return this.toDataURL({
                format: t,
                multiplier: e,
                quality: i
            })
        },
        _tempRemoveBordersControlsFromGroup: function(t) {
            t.origHasControls = t.hasControls, t.origBorderColor = t.borderColor, t.hasControls = !0, t.borderColor = "rgba(0,0,0,0)", t.forEachObject(function(t) {
                t.origBorderColor = t.borderColor, t.borderColor = "rgba(0,0,0,0)"
            })
        },
        _restoreBordersControlsOnGroup: function(t) {
            t.hideControls = t.origHideControls, t.borderColor = t.origBorderColor, t.forEachObject(function(t) {
                t.borderColor = t.origBorderColor, delete t.origBorderColor
            })
        }
    }), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        loadFromDatalessJSON: function(t, e, i) {
            return this.loadFromJSON(t, e, i)
        },
        loadFromJSON: function(t, e, i) {
            if (t) {
                var r = "string" == typeof t ? JSON.parse(t) : t;
                this.clear();
                var n = this;
                return this._enlivenObjects(r.objects, function() {
                    n._setBgOverlay(r, e)
                }, i), this
            }
        },
        _setBgOverlay: function(t, e) {
            var i = this,
                r = {
                    backgroundColor: !1,
                    overlayColor: !1,
                    backgroundImage: !1,
                    overlayImage: !1
                };
            if (!(t.backgroundImage || t.overlayImage || t.background || t.overlay)) return void(e && e());
            var n = function() {
                r.backgroundImage && r.overlayImage && r.backgroundColor && r.overlayColor && (i.renderAll(), e && e())
            };
            this.__setBgOverlay("backgroundImage", t.backgroundImage, r, n), this.__setBgOverlay("overlayImage", t.overlayImage, r, n), this.__setBgOverlay("backgroundColor", t.background, r, n), this.__setBgOverlay("overlayColor", t.overlay, r, n), n()
        },
        __setBgOverlay: function(t, e, i, r) {
            var n = this;
            return e ? void("backgroundImage" === t || "overlayImage" === t ? fabric.Image.fromObject(e, function(e) {
                n[t] = e, i[t] = !0, r && r()
            }) : this["set" + fabric.util.string.capitalize(t, !0)](e, function() {
                i[t] = !0, r && r()
            })) : void(i[t] = !0)
        },
        _enlivenObjects: function(t, e, i) {
            var r = this;
            if (!t || 0 === t.length) return void(e && e());
            var n = this.renderOnAddRemove;
            this.renderOnAddRemove = !1, fabric.util.enlivenObjects(t, function(t) {
                t.forEach(function(t, e) {
                    r.insertAt(t, e, !0)
                }), r.renderOnAddRemove = n, e && e()
            }, null, i)
        },
        _toDataURL: function(t, e) {
            this.clone(function(i) {
                e(i.toDataURL(t))
            })
        },
        _toDataURLWithMultiplier: function(t, e, i) {
            this.clone(function(r) {
                i(r.toDataURLWithMultiplier(t, e))
            })
        },
        clone: function(t, e) {
            var i = JSON.stringify(this.toJSON(e));
            this.cloneWithoutData(function(e) {
                e.loadFromJSON(i, function() {
                    t && t(e)
                })
            })
        },
        cloneWithoutData: function(t) {
            var e = fabric.document.createElement("canvas");
            e.width = this.getWidth(), e.height = this.getHeight();
            var i = new fabric.Canvas(e);
            i.clipTo = this.clipTo, this.backgroundImage ? (i.setBackgroundImage(this.backgroundImage.src, function() {
                i.renderAll(), t && t(i)
            }), i.backgroundImageOpacity = this.backgroundImageOpacity, i.backgroundImageStretch = this.backgroundImageStretch) : t && t(i)
        }
    }),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.util.toFixed,
            n = e.util.string.capitalize,
            s = e.util.degreesToRadians,
            o = e.StaticCanvas.supports("setLineDash");
        e.Object || (e.Object = e.util.createClass({
            type: "object",
            originX: "left",
            originY: "top",
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            scaleX: 1,
            scaleY: 1,
            flipX: !1,
            flipY: !1,
            opacity: 1,
            angle: 0,
            cornerSize: 12,
            transparentCorners: !0,
            hoverCursor: null,
            padding: 0,
            borderColor: "rgba(102,153,255,0.75)",
            cornerColor: "rgba(102,153,255,0.5)",
            centeredScaling: !1,
            centeredRotation: !0,
            fill: "rgb(0,0,0)",
            fillRule: "nonzero",
            globalCompositeOperation: "source-over",
            backgroundColor: "",
            stroke: null,
            strokeWidth: 1,
            strokeDashArray: null,
            strokeLineCap: "butt",
            strokeLineJoin: "miter",
            strokeMiterLimit: 10,
            shadow: null,
            borderOpacityWhenMoving: .4,
            borderScaleFactor: 1,
            transformMatrix: null,
            minScaleLimit: .01,
            selectable: !0,
            evented: !0,
            visible: !0,
            hasControls: !0,
            hasBorders: !0,
            hasRotatingPoint: !0,
            rotatingPointOffset: 40,
            perPixelTargetFind: !1,
            includeDefaultValues: !0,
            clipTo: null,
            lockMovementX: !1,
            lockMovementY: !1,
            lockRotation: !1,
            lockScalingX: !1,
            lockScalingY: !1,
            lockUniScaling: !1,
            lockScalingFlip: !1,
            stateProperties: "top left width height scaleX scaleY flipX flipY originX originY transformMatrix stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin strokeMiterLimit angle opacity fill fillRule globalCompositeOperation shadow clipTo visible backgroundColor alignX alignY meetOrSlice".split(" "),
            initialize: function(t) {
                t && this.setOptions(t)
            },
            _initGradient: function(t) {
                !t.fill || !t.fill.colorStops || t.fill instanceof e.Gradient || this.set("fill", new e.Gradient(t.fill)), !t.stroke || !t.stroke.colorStops || t.stroke instanceof e.Gradient || this.set("stroke", new e.Gradient(t.stroke))
            },
            _initPattern: function(t) {
                !t.fill || !t.fill.source || t.fill instanceof e.Pattern || this.set("fill", new e.Pattern(t.fill)), !t.stroke || !t.stroke.source || t.stroke instanceof e.Pattern || this.set("stroke", new e.Pattern(t.stroke))
            },
            _initClipping: function(t) {
                if (t.clipTo && "string" == typeof t.clipTo) {
                    var i = e.util.getFunctionBody(t.clipTo);
                    "undefined" != typeof i && (this.clipTo = new Function("ctx", i))
                }
            },
            setOptions: function(t) {
                for (var e in t) this.set(e, t[e]);
                this._initGradient(t), this._initPattern(t), this._initClipping(t)
            },
            transform: function(t, e) {
                this.group && this.canvas.preserveObjectStacking && this.group === this.canvas._activeGroup && this.group.transform(t);
                var i = e ? this._getLeftTopCoords() : this.getCenterPoint();
                t.translate(i.x, i.y), t.rotate(s(this.angle)), t.scale(this.scaleX * (this.flipX ? -1 : 1), this.scaleY * (this.flipY ? -1 : 1))
            },
            toObject: function(t) {
                var i = e.Object.NUM_FRACTION_DIGITS,
                    n = {
                        type: this.type,
                        originX: this.originX,
                        originY: this.originY,
                        left: r(this.left, i),
                        top: r(this.top, i),
                        width: r(this.width, i),
                        height: r(this.height, i),
                        fill: this.fill && this.fill.toObject ? this.fill.toObject() : this.fill,
                        stroke: this.stroke && this.stroke.toObject ? this.stroke.toObject() : this.stroke,
                        strokeWidth: r(this.strokeWidth, i),
                        strokeDashArray: this.strokeDashArray ? this.strokeDashArray.concat() : this.strokeDashArray,
                        strokeLineCap: this.strokeLineCap,
                        strokeLineJoin: this.strokeLineJoin,
                        strokeMiterLimit: r(this.strokeMiterLimit, i),
                        scaleX: r(this.scaleX, i),
                        scaleY: r(this.scaleY, i),
                        angle: r(this.getAngle(), i),
                        flipX: this.flipX,
                        flipY: this.flipY,
                        opacity: r(this.opacity, i),
                        shadow: this.shadow && this.shadow.toObject ? this.shadow.toObject() : this.shadow,
                        visible: this.visible,
                        clipTo: this.clipTo && String(this.clipTo),
                        backgroundColor: this.backgroundColor,
                        fillRule: this.fillRule,
                        globalCompositeOperation: this.globalCompositeOperation,
                        transformMatrix: this.transformMatrix ? this.transformMatrix.concat() : this.transformMatrix
                    };
                return this.includeDefaultValues || (n = this._removeDefaultValues(n)), e.util.populateWithProperties(this, n, t), n
            },
            toDatalessObject: function(t) {
                return this.toObject(t)
            },
            _removeDefaultValues: function(t) {
                var i = e.util.getKlass(t.type).prototype,
                    r = i.stateProperties;
                return r.forEach(function(e) {
                    t[e] === i[e] && delete t[e];
                    var r = "[object Array]" === Object.prototype.toString.call(t[e]) && "[object Array]" === Object.prototype.toString.call(i[e]);
                    r && 0 === t[e].length && 0 === i[e].length && delete t[e]
                }), t
            },
            toString: function() {
                return "#<fabric." + n(this.type) + ">"
            },
            get: function(t) {
                return this[t]
            },
            _setObject: function(t) {
                for (var e in t) this._set(e, t[e])
            },
            set: function(t, e) {
                return "object" == typeof t ? this._setObject(t) : "function" == typeof e && "clipTo" !== t ? this._set(t, e(this.get(t))) : this._set(t, e), this
            },
            _set: function(t, i) {
                var n = "scaleX" === t || "scaleY" === t;
                return n && (i = this._constrainScale(i)), "scaleX" === t && 0 > i ? (this.flipX = !this.flipX, i *= -1) : "scaleY" === t && 0 > i ? (this.flipY = !this.flipY, i *= -1) : "width" === t || "height" === t ? this.minScaleLimit = r(Math.min(.1, 1 / Math.max(this.width, this.height)), 2) : "shadow" !== t || !i || i instanceof e.Shadow || (i = new e.Shadow(i)), this[t] = i, this
            },
            setOnGroup: function() {},
            toggle: function(t) {
                var e = this.get(t);
                return "boolean" == typeof e && this.set(t, !e), this
            },
            setSourcePath: function(t) {
                return this.sourcePath = t, this
            },
            getViewportTransform: function() {
                return this.canvas && this.canvas.viewportTransform ? this.canvas.viewportTransform : [1, 0, 0, 1, 0, 0]
            },
            render: function(t, i) {
                0 === this.width && 0 === this.height || !this.visible || (t.save(), this._setupCompositeOperation(t), i || this.transform(t), this._setStrokeStyles(t), this._setFillStyles(t), this.transformMatrix && t.transform.apply(t, this.transformMatrix), this._setOpacity(t), this._setShadow(t), this.clipTo && e.util.clipContext(this, t), this._render(t, i), this.clipTo && t.restore(), t.restore())
            },
            _setOpacity: function(t) {
                this.group && this.group._setOpacity(t), t.globalAlpha *= this.opacity
            },
            _setStrokeStyles: function(t) {
                this.stroke && (t.lineWidth = this.strokeWidth, t.lineCap = this.strokeLineCap, t.lineJoin = this.strokeLineJoin, t.miterLimit = this.strokeMiterLimit, t.strokeStyle = this.stroke.toLive ? this.stroke.toLive(t, this) : this.stroke)
            },
            _setFillStyles: function(t) {
                this.fill && (t.fillStyle = this.fill.toLive ? this.fill.toLive(t, this) : this.fill)
            },
            _renderControls: function(t, i) {
                if (this.active && !i) {
                    var r = this.getViewportTransform();
                    t.save();
                    var n;
                    this.group && (n = e.util.transformPoint(this.group.getCenterPoint(), r), t.translate(n.x, n.y), t.rotate(s(this.group.angle))), n = e.util.transformPoint(this.getCenterPoint(), r, null != this.group), this.group && (n.x *= this.group.scaleX, n.y *= this.group.scaleY), t.translate(n.x, n.y), t.rotate(s(this.angle)), this.drawBorders(t), this.drawControls(t), t.restore()
                }
            },
            _setShadow: function(t) {
                if (this.shadow) {
                    var e = this.canvas && this.canvas.viewportTransform[0] || 1,
                        i = this.canvas && this.canvas.viewportTransform[3] || 1;
                    t.shadowColor = this.shadow.color, t.shadowBlur = this.shadow.blur * (e + i) * (this.scaleX + this.scaleY) / 4, t.shadowOffsetX = this.shadow.offsetX * e * this.scaleX, t.shadowOffsetY = this.shadow.offsetY * i * this.scaleY
                }
            },
            _removeShadow: function(t) {
                this.shadow && (t.shadowColor = "", t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0)
            },
            _renderFill: function(t) {
                if (this.fill) {
                    if (t.save(), this.fill.gradientTransform) {
                        var e = this.fill.gradientTransform;
                        t.transform.apply(t, e)
                    }
                    this.fill.toLive && t.translate(-this.width / 2 + this.fill.offsetX || 0, -this.height / 2 + this.fill.offsetY || 0), "evenodd" === this.fillRule ? t.fill("evenodd") : t.fill(), t.restore()
                }
            },
            _renderStroke: function(t) {
                if (this.stroke && 0 !== this.strokeWidth) {
                    if (this.shadow && !this.shadow.affectStroke && this._removeShadow(t), t.save(), this.strokeDashArray) 1 & this.strokeDashArray.length && this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray), o ? (t.setLineDash(this.strokeDashArray), this._stroke && this._stroke(t)) : this._renderDashedStroke && this._renderDashedStroke(t), t.stroke();
                    else {
                        if (this.stroke.gradientTransform) {
                            var e = this.stroke.gradientTransform;
                            t.transform.apply(t, e)
                        }
                        this._stroke ? this._stroke(t) : t.stroke()
                    }
                    t.restore()
                }
            },
            clone: function(t, i) {
                return this.constructor.fromObject ? this.constructor.fromObject(this.toObject(i), t) : new e.Object(this.toObject(i))
            },
            cloneAsImage: function(t) {
                var i = this.toDataURL();
                return e.util.loadImage(i, function(i) {
                    t && t(new e.Image(i))
                }), this
            },
            toDataURL: function(t) {
                t || (t = {});
                var i = e.util.createCanvasElement(),
                    r = this.getBoundingRect();
                i.width = r.width, i.height = r.height, e.util.wrapElement(i, "div");
                var n = new e.StaticCanvas(i);
                "jpg" === t.format && (t.format = "jpeg"), "jpeg" === t.format && (n.backgroundColor = "#fff");
                var s = {
                    active: this.get("active"),
                    left: this.getLeft(),
                    top: this.getTop()
                };
                this.set("active", !1), this.setPositionByOrigin(new e.Point(i.width / 2, i.height / 2), "center", "center");
                var o = this.canvas;
                n.add(this);
                var a = n.toDataURL(t);
                return this.set(s).setCoords(), this.canvas = o, n.dispose(), n = null, a
            },
            isType: function(t) {
                return this.type === t
            },
            complexity: function() {
                return 0
            },
            toJSON: function(t) {
                return this.toObject(t)
            },
            setGradient: function(t, i) {
                i || (i = {});
                var r = {
                    colorStops: []
                };
                r.type = i.type || (i.r1 || i.r2 ? "radial" : "linear"), r.coords = {
                    x1: i.x1,
                    y1: i.y1,
                    x2: i.x2,
                    y2: i.y2
                }, (i.r1 || i.r2) && (r.coords.r1 = i.r1, r.coords.r2 = i.r2), i.gradientTransform && (r.gradientTransform = i.gradientTransform);
                for (var n in i.colorStops) {
                    var s = new e.Color(i.colorStops[n]);
                    r.colorStops.push({
                        offset: n,
                        color: s.toRgb(),
                        opacity: s.getAlpha()
                    })
                }
                return this.set(t, e.Gradient.forObject(this, r))
            },
            setPatternFill: function(t) {
                return this.set("fill", new e.Pattern(t))
            },
            setShadow: function(t) {
                return this.set("shadow", t ? new e.Shadow(t) : null)
            },
            setColor: function(t) {
                return this.set("fill", t), this
            },
            setAngle: function(t) {
                var e = ("center" !== this.originX || "center" !== this.originY) && this.centeredRotation;
                return e && this._setOriginToCenter(), this.set("angle", t), e && this._resetOrigin(), this
            },
            centerH: function() {
                return this.canvas.centerObjectH(this), this
            },
            centerV: function() {
                return this.canvas.centerObjectV(this), this
            },
            center: function() {
                return this.canvas.centerObject(this), this
            },
            remove: function() {
                return this.canvas.remove(this), this
            },
            getLocalPointer: function(t, i) {
                i = i || this.canvas.getPointer(t);
                var r = new e.Point(i.x, i.y),
                    n = this._getLeftTopCoords();
                return this.angle && (r = e.util.rotatePoint(r, n, e.util.degreesToRadians(-this.angle))), {
                    x: r.x - n.x,
                    y: r.y - n.y
                }
            },
            _setupCompositeOperation: function(t) {
                this.globalCompositeOperation && (t.globalCompositeOperation = this.globalCompositeOperation)
            }
        }), e.util.createAccessors(e.Object), e.Object.prototype.rotate = e.Object.prototype.setAngle, i(e.Object.prototype, e.Observable), e.Object.NUM_FRACTION_DIGITS = 2, e.Object.__uid = 0)
    }("undefined" != typeof exports ? exports : this),
    function() {
        var t = fabric.util.degreesToRadians,
            e = {
                left: -.5,
                center: 0,
                right: .5
            },
            i = {
                top: -.5,
                center: 0,
                bottom: .5
            };
        fabric.util.object.extend(fabric.Object.prototype, {
            translateToGivenOrigin: function(t, r, n, s, o) {
                var a, h = t.x,
                    c = t.y,
                    l = e[s] - e[r],
                    u = i[o] - i[n];
                return (l || u) && (a = this._getTransformedDimensions(), h = t.x + l * a.x, c = t.y + u * a.y), new fabric.Point(h, c)
            },
            translateToCenterPoint: function(e, i, r) {
                var n = this.translateToGivenOrigin(e, i, r, "center", "center");
                return this.angle ? fabric.util.rotatePoint(n, e, t(this.angle)) : n
            },
            translateToOriginPoint: function(e, i, r) {
                var n = this.translateToGivenOrigin(e, "center", "center", i, r);
                return this.angle ? fabric.util.rotatePoint(n, e, t(this.angle)) : n
            },
            getCenterPoint: function() {
                var t = new fabric.Point(this.left, this.top);
                return this.translateToCenterPoint(t, this.originX, this.originY)
            },
            getPointByOrigin: function(t, e) {
                var i = this.getCenterPoint();
                return this.translateToOriginPoint(i, t, e)
            },
            toLocalPoint: function(e, i, r) {
                var n, s, o = this.getCenterPoint();
                return n = i && r ? this.translateToGivenOrigin(o, "center", "center", i, r) : new fabric.Point(this.left, this.top), s = new fabric.Point(e.x, e.y), this.angle && (s = fabric.util.rotatePoint(s, o, -t(this.angle))), s.subtractEquals(n)
            },
            setPositionByOrigin: function(t, e, i) {
                var r = this.translateToCenterPoint(t, e, i),
                    n = this.translateToOriginPoint(r, this.originX, this.originY);
                this.set("left", n.x), this.set("top", n.y)
            },
            adjustPosition: function(i) {
                var r = t(this.angle),
                    n = this.getWidth(),
                    s = Math.cos(r) * n,
                    o = Math.sin(r) * n;
                this.left += s * (e[i] - e[this.originX]), this.top += o * (e[i] - e[this.originX]), this.setCoords(), this.originX = i
            },
            _setOriginToCenter: function() {
                this._originalOriginX = this.originX, this._originalOriginY = this.originY;
                var t = this.getCenterPoint();
                this.originX = "center", this.originY = "center", this.left = t.x, this.top = t.y
            },
            _resetOrigin: function() {
                var t = this.translateToOriginPoint(this.getCenterPoint(), this._originalOriginX, this._originalOriginY);
                this.originX = this._originalOriginX, this.originY = this._originalOriginY, this.left = t.x, this.top = t.y, this._originalOriginX = null, this._originalOriginY = null
            },
            _getLeftTopCoords: function() {
                return this.translateToOriginPoint(this.getCenterPoint(), "left", "top")
            }
        })
    }(),
    function() {
        function t(t) {
            return [new fabric.Point(t.tl.x, t.tl.y), new fabric.Point(t.tr.x, t.tr.y), new fabric.Point(t.br.x, t.br.y), new fabric.Point(t.bl.x, t.bl.y)]
        }
        var e = fabric.util.degreesToRadians;
        fabric.util.object.extend(fabric.Object.prototype, {
            oCoords: null,
            intersectsWithRect: function(e, i) {
                var r = t(this.oCoords),
                    n = fabric.Intersection.intersectPolygonRectangle(r, e, i);
                return "Intersection" === n.status
            },
            intersectsWithObject: function(e) {
                var i = fabric.Intersection.intersectPolygonPolygon(t(this.oCoords), t(e.oCoords));
                return "Intersection" === i.status
            },
            isContainedWithinObject: function(t) {
                var e = t.getBoundingRect(),
                    i = new fabric.Point(e.left, e.top),
                    r = new fabric.Point(e.left + e.width, e.top + e.height);
                return this.isContainedWithinRect(i, r)
            },
            isContainedWithinRect: function(t, e) {
                var i = this.getBoundingRect();
                return i.left >= t.x && i.left + i.width <= e.x && i.top >= t.y && i.top + i.height <= e.y
            },
            containsPoint: function(t) {
                var e = this._getImageLines(this.oCoords),
                    i = this._findCrossPoints(t, e);
                return 0 !== i && i % 2 === 1
            },
            _getImageLines: function(t) {
                return {
                    topline: {
                        o: t.tl,
                        d: t.tr
                    },
                    rightline: {
                        o: t.tr,
                        d: t.br
                    },
                    bottomline: {
                        o: t.br,
                        d: t.bl
                    },
                    leftline: {
                        o: t.bl,
                        d: t.tl
                    }
                }
            },
            _findCrossPoints: function(t, e) {
                var i, r, n, s, o, a, h, c = 0;
                for (var l in e)
                    if (h = e[l], !(h.o.y < t.y && h.d.y < t.y || h.o.y >= t.y && h.d.y >= t.y || (h.o.x === h.d.x && h.o.x >= t.x ? (o = h.o.x, a = t.y) : (i = 0, r = (h.d.y - h.o.y) / (h.d.x - h.o.x), n = t.y - i * t.x, s = h.o.y - r * h.o.x, o = -(n - s) / (i - r), a = n + i * o), o >= t.x && (c += 1), 2 !== c))) break;
                return c
            },
            getBoundingRectWidth: function() {
                return this.getBoundingRect().width
            },
            getBoundingRectHeight: function() {
                return this.getBoundingRect().height
            },
            getBoundingRect: function() {
                this.oCoords || this.setCoords();
                var t = [this.oCoords.tl.x, this.oCoords.tr.x, this.oCoords.br.x, this.oCoords.bl.x],
                    e = fabric.util.array.min(t),
                    i = fabric.util.array.max(t),
                    r = Math.abs(e - i),
                    n = [this.oCoords.tl.y, this.oCoords.tr.y, this.oCoords.br.y, this.oCoords.bl.y],
                    s = fabric.util.array.min(n),
                    o = fabric.util.array.max(n),
                    a = Math.abs(s - o);
                return {
                    left: e,
                    top: s,
                    width: r,
                    height: a
                }
            },
            getWidth: function() {
                return this.width * this.scaleX
            },
            getHeight: function() {
                return this.height * this.scaleY
            },
            _constrainScale: function(t) {
                return Math.abs(t) < this.minScaleLimit ? 0 > t ? -this.minScaleLimit : this.minScaleLimit : t
            },
            scale: function(t) {
                return t = this._constrainScale(t), 0 > t && (this.flipX = !this.flipX, this.flipY = !this.flipY, t *= -1), this.scaleX = t, this.scaleY = t, this.setCoords(), this
            },
            scaleToWidth: function(t) {
                var e = this.getBoundingRect().width / this.getWidth();
                return this.scale(t / this.width / e)
            },
            scaleToHeight: function(t) {
                var e = this.getBoundingRect().height / this.getHeight();
                return this.scale(t / this.height / e)
            },
            setCoords: function() {
                var t = e(this.angle),
                    i = this.getViewportTransform(),
                    r = this._calculateCurrentDimensions(),
                    n = r.x,
                    s = r.y;
                0 > n && (n = Math.abs(n));
                var o = Math.sin(t),
                    a = Math.cos(t),
                    h = n > 0 ? Math.atan(s / n) : 0,
                    c = n / Math.cos(h) / 2,
                    l = Math.cos(h + t) * c,
                    u = Math.sin(h + t) * c,
                    f = fabric.util.transformPoint(this.getCenterPoint(), i),
                    d = new fabric.Point(f.x - l, f.y - u),
                    g = new fabric.Point(d.x + n * a, d.y + n * o),
                    p = new fabric.Point(d.x - s * o, d.y + s * a),
                    v = new fabric.Point(f.x + l, f.y + u),
                    b = new fabric.Point((d.x + p.x) / 2, (d.y + p.y) / 2),
                    m = new fabric.Point((g.x + d.x) / 2, (g.y + d.y) / 2),
                    y = new fabric.Point((v.x + g.x) / 2, (v.y + g.y) / 2),
                    _ = new fabric.Point((v.x + p.x) / 2, (v.y + p.y) / 2),
                    x = new fabric.Point(m.x + o * this.rotatingPointOffset, m.y - a * this.rotatingPointOffset);
                return this.oCoords = {
                    tl: d,
                    tr: g,
                    br: v,
                    bl: p,
                    ml: b,
                    mt: m,
                    mr: y,
                    mb: _,
                    mtr: x
                }, this._setCornerCoords && this._setCornerCoords(), this
            },
            _calcDimensionsTransformMatrix: function() {
                return [this.scaleX, 0, 0, this.scaleY, 0, 0]
            }
        })
    }(), fabric.util.object.extend(fabric.Object.prototype, {
        sendToBack: function() {
            return this.group ? fabric.StaticCanvas.prototype.sendToBack.call(this.group, this) : this.canvas.sendToBack(this), this
        },
        bringToFront: function() {
            return this.group ? fabric.StaticCanvas.prototype.bringToFront.call(this.group, this) : this.canvas.bringToFront(this), this
        },
        sendBackwards: function(t) {
            return this.group ? fabric.StaticCanvas.prototype.sendBackwards.call(this.group, this, t) : this.canvas.sendBackwards(this, t), this
        },
        bringForward: function(t) {
            return this.group ? fabric.StaticCanvas.prototype.bringForward.call(this.group, this, t) : this.canvas.bringForward(this, t), this
        },
        moveTo: function(t) {
            return this.group ? fabric.StaticCanvas.prototype.moveTo.call(this.group, this, t) : this.canvas.moveTo(this, t), this
        }
    }), fabric.util.object.extend(fabric.Object.prototype, {
        getSvgStyles: function() {
            var t = this.fill ? this.fill.toLive ? "url(#SVGID_" + this.fill.id + ")" : this.fill : "none",
                e = this.fillRule,
                i = this.stroke ? this.stroke.toLive ? "url(#SVGID_" + this.stroke.id + ")" : this.stroke : "none",
                r = this.strokeWidth ? this.strokeWidth : "0",
                n = this.strokeDashArray ? this.strokeDashArray.join(" ") : "none",
                s = this.strokeLineCap ? this.strokeLineCap : "butt",
                o = this.strokeLineJoin ? this.strokeLineJoin : "miter",
                a = this.strokeMiterLimit ? this.strokeMiterLimit : "4",
                h = "undefined" != typeof this.opacity ? this.opacity : "1",
                c = this.visible ? "" : " visibility: hidden;",
                l = this.getSvgFilter();
            return ["stroke: ", i, "; ", "stroke-width: ", r, "; ", "stroke-dasharray: ", n, "; ", "stroke-linecap: ", s, "; ", "stroke-linejoin: ", o, "; ", "stroke-miterlimit: ", a, "; ", "fill: ", t, "; ", "fill-rule: ", e, "; ", "opacity: ", h, ";", l, c].join("")
        },
        getSvgFilter: function() {
            return this.shadow ? "filter: url(#SVGID_" + this.shadow.id + ");" : ""
        },
        getSvgTransform: function() {
            if (this.group && "path-group" === this.group.type) return "";
            var t = fabric.util.toFixed,
                e = this.getAngle(),
                i = !this.canvas || this.canvas.svgViewportTransformation ? this.getViewportTransform() : [1, 0, 0, 1, 0, 0],
                r = fabric.util.transformPoint(this.getCenterPoint(), i),
                n = fabric.Object.NUM_FRACTION_DIGITS,
                s = "path-group" === this.type ? "" : "translate(" + t(r.x, n) + " " + t(r.y, n) + ")",
                o = 0 !== e ? " rotate(" + t(e, n) + ")" : "",
                a = 1 === this.scaleX && 1 === this.scaleY && 1 === i[0] && 1 === i[3] ? "" : " scale(" + t(this.scaleX * i[0], n) + " " + t(this.scaleY * i[3], n) + ")",
                h = "path-group" === this.type ? this.width * i[0] : 0,
                c = this.flipX ? " matrix(-1 0 0 1 " + h + " 0) " : "",
                l = "path-group" === this.type ? this.height * i[3] : 0,
                u = this.flipY ? " matrix(1 0 0 -1 0 " + l + ")" : "";
            return [s, o, a, c, u].join("")
        },
        getSvgTransformMatrix: function() {
            return this.transformMatrix ? " matrix(" + this.transformMatrix.join(" ") + ") " : ""
        },
        _createBaseSVGMarkup: function() {
            var t = [];
            return this.fill && this.fill.toLive && t.push(this.fill.toSVG(this, !1)), this.stroke && this.stroke.toLive && t.push(this.stroke.toSVG(this, !1)), this.shadow && t.push(this.shadow.toSVG(this)), t
        }
    }), fabric.util.object.extend(fabric.Object.prototype, {
        hasStateChanged: function() {
            return this.stateProperties.some(function(t) {
                return this.get(t) !== this.originalState[t]
            }, this)
        },
        saveState: function(t) {
            return this.stateProperties.forEach(function(t) {
                this.originalState[t] = this.get(t)
            }, this), t && t.stateProperties && t.stateProperties.forEach(function(t) {
                this.originalState[t] = this.get(t)
            }, this), this
        },
        setupState: function() {
            return this.originalState = {}, this.saveState(), this
        }
    }),
    function() {
        var t = fabric.util.degreesToRadians,
            e = function() {
                return "undefined" != typeof G_vmlCanvasManager
            };
        fabric.util.object.extend(fabric.Object.prototype, {
            _controlsVisibility: null,
            _findTargetCorner: function(t) {
                if (!this.hasControls || !this.active) return !1;
                var e, i, r = t.x,
                    n = t.y;
                this.__corner = 0;
                for (var s in this.oCoords)
                    if (this.isControlVisible(s) && ("mtr" !== s || this.hasRotatingPoint) && (!this.get("lockUniScaling") || "mt" !== s && "mr" !== s && "mb" !== s && "ml" !== s) && (i = this._getImageLines(this.oCoords[s].corner), e = this._findCrossPoints({
                            x: r,
                            y: n
                        }, i), 0 !== e && e % 2 === 1)) return this.__corner = s, s;
                return !1
            },
            _setCornerCoords: function() {
                var e, i, r = this.oCoords,
                    n = t(45 - this.angle),
                    s = .707106 * this.cornerSize,
                    o = s * Math.cos(n),
                    a = s * Math.sin(n);
                for (var h in r) e = r[h].x, i = r[h].y, r[h].corner = {
                    tl: {
                        x: e - a,
                        y: i - o
                    },
                    tr: {
                        x: e + o,
                        y: i - a
                    },
                    bl: {
                        x: e - o,
                        y: i + a
                    },
                    br: {
                        x: e + a,
                        y: i + o
                    }
                }
            },
            _getNonTransformedDimensions: function() {
                var t = this.strokeWidth,
                    e = this.width,
                    i = this.height,
                    r = !0,
                    n = !0;
                return "line" === this.type && "butt" === this.strokeLineCap && (n = e, r = i), n && (i += 0 > i ? -t : t), r && (e += 0 > e ? -t : t), {
                    x: e,
                    y: i
                }
            },
            _getTransformedDimensions: function(t) {
                t || (t = this._getNonTransformedDimensions());
                var e = this._calcDimensionsTransformMatrix();
                return fabric.util.transformPoint(t, e, !0)
            },
            _calculateCurrentDimensions: function() {
                var t = this.getViewportTransform(),
                    e = this._getTransformedDimensions(),
                    i = e.x,
                    r = e.y;
                return i += 2 * this.padding, r += 2 * this.padding, fabric.util.transformPoint(new fabric.Point(i, r), t, !0)
            },
            drawBorders: function(t) {
                if (!this.hasBorders) return this;
                t.save(), t.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1, t.strokeStyle = this.borderColor, t.lineWidth = 1 / this.borderScaleFactor;
                var e = this._calculateCurrentDimensions(),
                    i = e.x,
                    r = e.y;
                if (this.group && (i *= this.group.scaleX, r *= this.group.scaleY), t.strokeRect(~~-(i / 2) - .5, ~~-(r / 2) - .5, ~~i + 1, ~~r + 1), this.hasRotatingPoint && this.isControlVisible("mtr") && !this.get("lockRotation") && this.hasControls) {
                    var n = -r / 2;
                    t.beginPath(), t.moveTo(0, n), t.lineTo(0, n - this.rotatingPointOffset), t.closePath(), t.stroke()
                }
                return t.restore(), this
            },
            drawControls: function(t) {
                if (!this.hasControls) return this;
                var e = this._calculateCurrentDimensions(),
                    i = e.x,
                    r = e.y,
                    n = this.cornerSize / 2,
                    s = -(i / 2) - n,
                    o = -(r / 2) - n,
                    a = this.transparentCorners ? "strokeRect" : "fillRect";
                return t.save(), t.lineWidth = 1, t.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1, t.strokeStyle = t.fillStyle = this.cornerColor, this._drawControl("tl", t, a, s, o), this._drawControl("tr", t, a, s + i, o), this._drawControl("bl", t, a, s, o + r), this._drawControl("br", t, a, s + i, o + r), this.get("lockUniScaling") || (this._drawControl("mt", t, a, s + i / 2, o), this._drawControl("mb", t, a, s + i / 2, o + r), this._drawControl("mr", t, a, s + i, o + r / 2), this._drawControl("ml", t, a, s, o + r / 2)), this.hasRotatingPoint && this._drawControl("mtr", t, a, s + i / 2, o - this.rotatingPointOffset), t.restore(), this
            },
            _drawControl: function(t, i, r, n, s) {
                if (this.isControlVisible(t)) {
                    var o = this.cornerSize;
                    e() || this.transparentCorners || i.clearRect(n, s, o, o), i[r](n, s, o, o)
                }
            },
            isControlVisible: function(t) {
                return this._getControlsVisibility()[t]
            },
            setControlVisible: function(t, e) {
                return this._getControlsVisibility()[t] = e, this
            },
            setControlsVisibility: function(t) {
                t || (t = {});
                for (var e in t) this.setControlVisible(e, t[e]);
                return this
            },
            _getControlsVisibility: function() {
                return this._controlsVisibility || (this._controlsVisibility = {
                    tl: !0,
                    tr: !0,
                    br: !0,
                    bl: !0,
                    ml: !0,
                    mt: !0,
                    mr: !0,
                    mb: !0,
                    mtr: !0
                }), this._controlsVisibility
            }
        })
    }(), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        FX_DURATION: 500,
        fxCenterObjectH: function(t, e) {
            e = e || {};
            var i = function() {},
                r = e.onComplete || i,
                n = e.onChange || i,
                s = this;
            return fabric.util.animate({
                startValue: t.get("left"),
                endValue: this.getCenter().left,
                duration: this.FX_DURATION,
                onChange: function(e) {
                    t.set("left", e), s.renderAll(), n()
                },
                onComplete: function() {
                    t.setCoords(), r()
                }
            }), this
        },
        fxCenterObjectV: function(t, e) {
            e = e || {};
            var i = function() {},
                r = e.onComplete || i,
                n = e.onChange || i,
                s = this;
            return fabric.util.animate({
                startValue: t.get("top"),
                endValue: this.getCenter().top,
                duration: this.FX_DURATION,
                onChange: function(e) {
                    t.set("top", e), s.renderAll(), n()
                },
                onComplete: function() {
                    t.setCoords(), r()
                }
            }), this
        },
        fxRemove: function(t, e) {
            e = e || {};
            var i = function() {},
                r = e.onComplete || i,
                n = e.onChange || i,
                s = this;
            return fabric.util.animate({
                startValue: t.get("opacity"),
                endValue: 0,
                duration: this.FX_DURATION,
                onStart: function() {
                    t.set("active", !1)
                },
                onChange: function(e) {
                    t.set("opacity", e), s.renderAll(), n()
                },
                onComplete: function() {
                    s.remove(t), r()
                }
            }), this
        }
    }), fabric.util.object.extend(fabric.Object.prototype, {
        animate: function() {
            if (arguments[0] && "object" == typeof arguments[0]) {
                var t, e, i = [];
                for (t in arguments[0]) i.push(t);
                for (var r = 0, n = i.length; n > r; r++) t = i[r],
                    e = r !== n - 1, this._animate(t, arguments[0][t], arguments[1], e)
            } else this._animate.apply(this, arguments);
            return this
        },
        _animate: function(t, e, i, r) {
            var n, s = this;
            e = e.toString(), i = i ? fabric.util.object.clone(i) : {}, ~t.indexOf(".") && (n = t.split("."));
            var o = n ? this.get(n[0])[n[1]] : this.get(t);
            "from" in i || (i.from = o), e = ~e.indexOf("=") ? o + parseFloat(e.replace("=", "")) : parseFloat(e), fabric.util.animate({
                startValue: i.from,
                endValue: e,
                byValue: i.by,
                easing: i.easing,
                duration: i.duration,
                abort: i.abort && function() {
                    return i.abort.call(s)
                },
                onChange: function(e) {
                    n ? s[n[0]][n[1]] = e : s.set(t, e), r || i.onChange && i.onChange()
                },
                onComplete: function() {
                    r || (s.setCoords(), i.onComplete && i.onComplete())
                }
            })
        }
    }),
    function(t) {
        "use strict";

        function e(t, e) {
            var i = t.origin,
                r = t.axis1,
                n = t.axis2,
                s = t.dimension,
                o = e.nearest,
                a = e.center,
                h = e.farthest;
            return function() {
                switch (this.get(i)) {
                    case o:
                        return Math.min(this.get(r), this.get(n));
                    case a:
                        return Math.min(this.get(r), this.get(n)) + .5 * this.get(s);
                    case h:
                        return Math.max(this.get(r), this.get(n))
                }
            }
        }
        var i = t.fabric || (t.fabric = {}),
            r = i.util.object.extend,
            n = {
                x1: 1,
                x2: 1,
                y1: 1,
                y2: 1
            },
            s = i.StaticCanvas.supports("setLineDash");
        return i.Line ? void i.warn("fabric.Line is already defined") : (i.Line = i.util.createClass(i.Object, {
            type: "line",
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            initialize: function(t, e) {
                e = e || {}, t || (t = [0, 0, 0, 0]), this.callSuper("initialize", e), this.set("x1", t[0]), this.set("y1", t[1]), this.set("x2", t[2]), this.set("y2", t[3]), this._setWidthHeight(e)
            },
            _setWidthHeight: function(t) {
                t || (t = {}), this.width = Math.abs(this.x2 - this.x1), this.height = Math.abs(this.y2 - this.y1), this.left = "left" in t ? t.left : this._getLeftToOriginX(), this.top = "top" in t ? t.top : this._getTopToOriginY()
            },
            _set: function(t, e) {
                return this.callSuper("_set", t, e), "undefined" != typeof n[t] && this._setWidthHeight(), this
            },
            _getLeftToOriginX: e({
                origin: "originX",
                axis1: "x1",
                axis2: "x2",
                dimension: "width"
            }, {
                nearest: "left",
                center: "center",
                farthest: "right"
            }),
            _getTopToOriginY: e({
                origin: "originY",
                axis1: "y1",
                axis2: "y2",
                dimension: "height"
            }, {
                nearest: "top",
                center: "center",
                farthest: "bottom"
            }),
            _render: function(t, e) {
                if (t.beginPath(), e) {
                    var i = this.getCenterPoint();
                    t.translate(i.x - this.strokeWidth / 2, i.y - this.strokeWidth / 2)
                }
                if (!this.strokeDashArray || this.strokeDashArray && s) {
                    var r = this.calcLinePoints();
                    t.moveTo(r.x1, r.y1), t.lineTo(r.x2, r.y2)
                }
                t.lineWidth = this.strokeWidth;
                var n = t.strokeStyle;
                t.strokeStyle = this.stroke || t.fillStyle, this.stroke && this._renderStroke(t), t.strokeStyle = n
            },
            _renderDashedStroke: function(t) {
                var e = this.calcLinePoints();
                t.beginPath(), i.util.drawDashedLine(t, e.x1, e.y1, e.x2, e.y2, this.strokeDashArray), t.closePath()
            },
            toObject: function(t) {
                return r(this.callSuper("toObject", t), this.calcLinePoints())
            },
            calcLinePoints: function() {
                var t = this.x1 <= this.x2 ? -1 : 1,
                    e = this.y1 <= this.y2 ? -1 : 1,
                    i = t * this.width * .5,
                    r = e * this.height * .5,
                    n = t * this.width * -.5,
                    s = e * this.height * -.5;
                return {
                    x1: i,
                    x2: n,
                    y1: r,
                    y2: s
                }
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                    i = {
                        x1: this.x1,
                        x2: this.x2,
                        y1: this.y1,
                        y2: this.y2
                    };
                return this.group && "path-group" === this.group.type || (i = this.calcLinePoints()), e.push("<line ", 'x1="', i.x1, '" y1="', i.y1, '" x2="', i.x2, '" y2="', i.y2, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n'), t ? t(e.join("")) : e.join("")
            },
            complexity: function() {
                return 1
            }
        }), i.Line.ATTRIBUTE_NAMES = i.SHARED_ATTRIBUTES.concat("x1 y1 x2 y2".split(" ")), i.Line.fromElement = function(t, e) {
            var n = i.parseAttributes(t, i.Line.ATTRIBUTE_NAMES),
                s = [n.x1 || 0, n.y1 || 0, n.x2 || 0, n.y2 || 0];
            return new i.Line(s, r(n, e))
        }, void(i.Line.fromObject = function(t) {
            var e = [t.x1, t.y1, t.x2, t.y2];
            return new i.Line(e, t)
        }))
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";

        function e(t) {
            return "radius" in t && t.radius >= 0
        }
        var i = t.fabric || (t.fabric = {}),
            r = Math.PI,
            n = i.util.object.extend;
        return i.Circle ? void i.warn("fabric.Circle is already defined.") : (i.Circle = i.util.createClass(i.Object, {
            type: "circle",
            radius: 0,
            startAngle: 0,
            endAngle: 2 * r,
            initialize: function(t) {
                t = t || {}, this.callSuper("initialize", t), this.set("radius", t.radius || 0), this.startAngle = t.startAngle || this.startAngle, this.endAngle = t.endAngle || this.endAngle
            },
            _set: function(t, e) {
                return this.callSuper("_set", t, e), "radius" === t && this.setRadius(e), this
            },
            toObject: function(t) {
                return n(this.callSuper("toObject", t), {
                    radius: this.get("radius"),
                    startAngle: this.startAngle,
                    endAngle: this.endAngle
                })
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                    i = 0,
                    n = 0,
                    s = (this.endAngle - this.startAngle) % (2 * r);
                if (0 === s) this.group && "path-group" === this.group.type && (i = this.left + this.radius, n = this.top + this.radius), e.push("<circle ", 'cx="' + i + '" cy="' + n + '" ', 'r="', this.radius, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n');
                else {
                    var o = Math.cos(this.startAngle) * this.radius,
                        a = Math.sin(this.startAngle) * this.radius,
                        h = Math.cos(this.endAngle) * this.radius,
                        c = Math.sin(this.endAngle) * this.radius,
                        l = s > r ? "1" : "0";
                    e.push('<path d="M ' + o + " " + a, " A " + this.radius + " " + this.radius, " 0 ", +l + " 1", " " + h + " " + c, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n')
                }
                return t ? t(e.join("")) : e.join("")
            },
            _render: function(t, e) {
                t.beginPath(), t.arc(e ? this.left + this.radius : 0, e ? this.top + this.radius : 0, this.radius, this.startAngle, this.endAngle, !1), this._renderFill(t), this._renderStroke(t)
            },
            getRadiusX: function() {
                return this.get("radius") * this.get("scaleX")
            },
            getRadiusY: function() {
                return this.get("radius") * this.get("scaleY")
            },
            setRadius: function(t) {
                return this.radius = t, this.set("width", 2 * t).set("height", 2 * t)
            },
            complexity: function() {
                return 1
            }
        }), i.Circle.ATTRIBUTE_NAMES = i.SHARED_ATTRIBUTES.concat("cx cy r".split(" ")), i.Circle.fromElement = function(t, r) {
            r || (r = {});
            var s = i.parseAttributes(t, i.Circle.ATTRIBUTE_NAMES);
            if (!e(s)) throw new Error("value of `r` attribute is required and can not be negative");
            s.left = s.left || 0, s.top = s.top || 0;
            var o = new i.Circle(n(s, r));
            return o.left -= o.radius, o.top -= o.radius, o
        }, void(i.Circle.fromObject = function(t) {
            return new i.Circle(t)
        }))
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});
        return e.Triangle ? void e.warn("fabric.Triangle is already defined") : (e.Triangle = e.util.createClass(e.Object, {
            type: "triangle",
            initialize: function(t) {
                t = t || {}, this.callSuper("initialize", t), this.set("width", t.width || 100).set("height", t.height || 100)
            },
            _render: function(t) {
                var e = this.width / 2,
                    i = this.height / 2;
                t.beginPath(), t.moveTo(-e, i), t.lineTo(0, -i), t.lineTo(e, i), t.closePath(), this._renderFill(t), this._renderStroke(t)
            },
            _renderDashedStroke: function(t) {
                var i = this.width / 2,
                    r = this.height / 2;
                t.beginPath(), e.util.drawDashedLine(t, -i, r, 0, -r, this.strokeDashArray), e.util.drawDashedLine(t, 0, -r, i, r, this.strokeDashArray), e.util.drawDashedLine(t, i, r, -i, r, this.strokeDashArray), t.closePath()
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                    i = this.width / 2,
                    r = this.height / 2,
                    n = [-i + " " + r, "0 " + -r, i + " " + r].join(",");
                return e.push("<polygon ", 'points="', n, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), '"/>'), t ? t(e.join("")) : e.join("")
            },
            complexity: function() {
                return 1
            }
        }), void(e.Triangle.fromObject = function(t) {
            return new e.Triangle(t)
        }))
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = 2 * Math.PI,
            r = e.util.object.extend;
        return e.Ellipse ? void e.warn("fabric.Ellipse is already defined.") : (e.Ellipse = e.util.createClass(e.Object, {
            type: "ellipse",
            rx: 0,
            ry: 0,
            initialize: function(t) {
                t = t || {}, this.callSuper("initialize", t), this.set("rx", t.rx || 0), this.set("ry", t.ry || 0)
            },
            _set: function(t, e) {
                switch (this.callSuper("_set", t, e), t) {
                    case "rx":
                        this.rx = e, this.set("width", 2 * e);
                        break;
                    case "ry":
                        this.ry = e, this.set("height", 2 * e)
                }
                return this
            },
            getRx: function() {
                return this.get("rx") * this.get("scaleX")
            },
            getRy: function() {
                return this.get("ry") * this.get("scaleY")
            },
            toObject: function(t) {
                return r(this.callSuper("toObject", t), {
                    rx: this.get("rx"),
                    ry: this.get("ry")
                })
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                    i = 0,
                    r = 0;
                return this.group && "path-group" === this.group.type && (i = this.left + this.rx, r = this.top + this.ry), e.push("<ellipse ", 'cx="', i, '" cy="', r, '" ', 'rx="', this.rx, '" ry="', this.ry, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n'), t ? t(e.join("")) : e.join("")
            },
            _render: function(t, e) {
                t.beginPath(), t.save(), t.transform(1, 0, 0, this.ry / this.rx, 0, 0), t.arc(e ? this.left + this.rx : 0, e ? (this.top + this.ry) * this.rx / this.ry : 0, this.rx, 0, i, !1), t.restore(), this._renderFill(t), this._renderStroke(t)
            },
            complexity: function() {
                return 1
            }
        }), e.Ellipse.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("cx cy rx ry".split(" ")), e.Ellipse.fromElement = function(t, i) {
            i || (i = {});
            var n = e.parseAttributes(t, e.Ellipse.ATTRIBUTE_NAMES);
            n.left = n.left || 0, n.top = n.top || 0;
            var s = new e.Ellipse(r(n, i));
            return s.top -= s.ry, s.left -= s.rx, s
        }, void(e.Ellipse.fromObject = function(t) {
            return new e.Ellipse(t)
        }))
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        if (e.Rect) return void e.warn("fabric.Rect is already defined");
        var r = e.Object.prototype.stateProperties.concat();
        r.push("rx", "ry", "x", "y"), e.Rect = e.util.createClass(e.Object, {
            stateProperties: r,
            type: "rect",
            rx: 0,
            ry: 0,
            strokeDashArray: null,
            initialize: function(t) {
                t = t || {}, this.callSuper("initialize", t), this._initRxRy()
            },
            _initRxRy: function() {
                this.rx && !this.ry ? this.ry = this.rx : this.ry && !this.rx && (this.rx = this.ry)
            },
            _render: function(t, e) {
                if (1 === this.width && 1 === this.height) return void t.fillRect(0, 0, 1, 1);
                var i = this.rx ? Math.min(this.rx, this.width / 2) : 0,
                    r = this.ry ? Math.min(this.ry, this.height / 2) : 0,
                    n = this.width,
                    s = this.height,
                    o = e ? this.left : -this.width / 2,
                    a = e ? this.top : -this.height / 2,
                    h = 0 !== i || 0 !== r,
                    c = .4477152502;
                t.beginPath(), t.moveTo(o + i, a), t.lineTo(o + n - i, a), h && t.bezierCurveTo(o + n - c * i, a, o + n, a + c * r, o + n, a + r), t.lineTo(o + n, a + s - r), h && t.bezierCurveTo(o + n, a + s - c * r, o + n - c * i, a + s, o + n - i, a + s), t.lineTo(o + i, a + s), h && t.bezierCurveTo(o + c * i, a + s, o, a + s - c * r, o, a + s - r), t.lineTo(o, a + r), h && t.bezierCurveTo(o, a + c * r, o + c * i, a, o + i, a), t.closePath(), this._renderFill(t), this._renderStroke(t)
            },
            _renderDashedStroke: function(t) {
                var i = -this.width / 2,
                    r = -this.height / 2,
                    n = this.width,
                    s = this.height;
                t.beginPath(), e.util.drawDashedLine(t, i, r, i + n, r, this.strokeDashArray), e.util.drawDashedLine(t, i + n, r, i + n, r + s, this.strokeDashArray), e.util.drawDashedLine(t, i + n, r + s, i, r + s, this.strokeDashArray), e.util.drawDashedLine(t, i, r + s, i, r, this.strokeDashArray), t.closePath()
            },
            toObject: function(t) {
                var e = i(this.callSuper("toObject", t), {
                    rx: this.get("rx") || 0,
                    ry: this.get("ry") || 0
                });
                return this.includeDefaultValues || this._removeDefaultValues(e), e
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                    i = this.left,
                    r = this.top;
                return this.group && "path-group" === this.group.type || (i = -this.width / 2, r = -this.height / 2), e.push("<rect ", 'x="', i, '" y="', r, '" rx="', this.get("rx"), '" ry="', this.get("ry"), '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '"/>\n'), t ? t(e.join("")) : e.join("")
            },
            complexity: function() {
                return 1
            }
        }), e.Rect.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("x y rx ry width height".split(" ")), e.Rect.fromElement = function(t, r) {
            if (!t) return null;
            r = r || {};
            var n = e.parseAttributes(t, e.Rect.ATTRIBUTE_NAMES);
            n.left = n.left || 0, n.top = n.top || 0;
            var s = new e.Rect(i(r ? e.util.object.clone(r) : {}, n));
            return s.visible = s.width > 0 && s.height > 0, s
        }, e.Rect.fromObject = function(t) {
            return new e.Rect(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});
        return e.Polyline ? void e.warn("fabric.Polyline is already defined") : (e.Polyline = e.util.createClass(e.Object, {
            type: "polyline",
            points: null,
            minX: 0,
            minY: 0,
            initialize: function(t, i) {
                return e.Polygon.prototype.initialize.call(this, t, i)
            },
            _calcDimensions: function() {
                return e.Polygon.prototype._calcDimensions.call(this)
            },
            _applyPointOffset: function() {
                return e.Polygon.prototype._applyPointOffset.call(this)
            },
            toObject: function(t) {
                return e.Polygon.prototype.toObject.call(this, t)
            },
            toSVG: function(t) {
                return e.Polygon.prototype.toSVG.call(this, t)
            },
            _render: function(t) {
                e.Polygon.prototype.commonRender.call(this, t) && (this._renderFill(t), this._renderStroke(t))
            },
            _renderDashedStroke: function(t) {
                var i, r;
                t.beginPath();
                for (var n = 0, s = this.points.length; s > n; n++) i = this.points[n], r = this.points[n + 1] || i, e.util.drawDashedLine(t, i.x, i.y, r.x, r.y, this.strokeDashArray)
            },
            complexity: function() {
                return this.get("points").length
            }
        }), e.Polyline.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(), e.Polyline.fromElement = function(t, i) {
            if (!t) return null;
            i || (i = {});
            var r = e.parsePointsAttribute(t.getAttribute("points")),
                n = e.parseAttributes(t, e.Polyline.ATTRIBUTE_NAMES);
            return new e.Polyline(r, e.util.object.extend(n, i))
        }, void(e.Polyline.fromObject = function(t) {
            var i = t.points;
            return new e.Polyline(i, t, !0)
        }))
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.util.array.min,
            n = e.util.array.max,
            s = e.util.toFixed;
        return e.Polygon ? void e.warn("fabric.Polygon is already defined") : (e.Polygon = e.util.createClass(e.Object, {
            type: "polygon",
            points: null,
            minX: 0,
            minY: 0,
            initialize: function(t, e) {
                e = e || {}, this.points = t || [], this.callSuper("initialize", e), this._calcDimensions(), "top" in e || (this.top = this.minY), "left" in e || (this.left = this.minX)
            },
            _calcDimensions: function() {
                var t = this.points,
                    e = r(t, "x"),
                    i = r(t, "y"),
                    s = n(t, "x"),
                    o = n(t, "y");
                this.width = s - e || 0, this.height = o - i || 0, this.minX = e || 0, this.minY = i || 0
            },
            _applyPointOffset: function() {
                this.points.forEach(function(t) {
                    t.x -= this.minX + this.width / 2, t.y -= this.minY + this.height / 2
                }, this)
            },
            toObject: function(t) {
                return i(this.callSuper("toObject", t), {
                    points: this.points.concat()
                })
            },
            toSVG: function(t) {
                for (var e = [], i = this._createBaseSVGMarkup(), r = 0, n = this.points.length; n > r; r++) e.push(s(this.points[r].x, 2), ",", s(this.points[r].y, 2), " ");
                return i.push("<", this.type, " ", 'points="', e.join(""), '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), " ", this.getSvgTransformMatrix(), '"/>\n'), t ? t(i.join("")) : i.join("")
            },
            _render: function(t) {
                this.commonRender(t) && (this._renderFill(t), (this.stroke || this.strokeDashArray) && (t.closePath(), this._renderStroke(t)))
            },
            commonRender: function(t) {
                var e, i = this.points.length;
                if (!i || isNaN(this.points[i - 1].y)) return !1;
                t.beginPath(), this._applyPointOffset && (this.group && "path-group" === this.group.type || this._applyPointOffset(), this._applyPointOffset = null), t.moveTo(this.points[0].x, this.points[0].y);
                for (var r = 0; i > r; r++) e = this.points[r], t.lineTo(e.x, e.y);
                return !0
            },
            _renderDashedStroke: function(t) {
                e.Polyline.prototype._renderDashedStroke.call(this, t), t.closePath()
            },
            complexity: function() {
                return this.points.length
            }
        }), e.Polygon.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(), e.Polygon.fromElement = function(t, r) {
            if (!t) return null;
            r || (r = {});
            var n = e.parsePointsAttribute(t.getAttribute("points")),
                s = e.parseAttributes(t, e.Polygon.ATTRIBUTE_NAMES);
            return new e.Polygon(n, i(s, r))
        }, void(e.Polygon.fromObject = function(t) {
            return new e.Polygon(t.points, t, !0)
        }))
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.array.min,
            r = e.util.array.max,
            n = e.util.object.extend,
            s = Object.prototype.toString,
            o = e.util.drawArc,
            a = {
                m: 2,
                l: 2,
                h: 1,
                v: 1,
                c: 6,
                s: 4,
                q: 4,
                t: 2,
                a: 7
            },
            h = {
                m: "l",
                M: "L"
            };
        return e.Path ? void e.warn("fabric.Path is already defined") : (e.Path = e.util.createClass(e.Object, {
            type: "path",
            path: null,
            minX: 0,
            minY: 0,
            initialize: function(t, e) {
                e = e || {}, this.setOptions(e), t || (t = []);
                var i = "[object Array]" === s.call(t);
                this.path = i ? t : t.match && t.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi), this.path && (i || (this.path = this._parsePath()), this._setPositionDimensions(e), e.sourcePath && this.setSourcePath(e.sourcePath))
            },
            _setPositionDimensions: function(t) {
                var e = this._parseDimensions();
                this.minX = e.left, this.minY = e.top, this.width = e.width, this.height = e.height, "undefined" == typeof t.left && (this.left = e.left + ("center" === this.originX ? this.width / 2 : "right" === this.originX ? this.width : 0)), "undefined" == typeof t.top && (this.top = e.top + ("center" === this.originY ? this.height / 2 : "bottom" === this.originY ? this.height : 0)), this.pathOffset = this.pathOffset || {
                    x: this.minX + this.width / 2,
                    y: this.minY + this.height / 2
                }
            },
            _render: function(t) {
                var e, i, r, n = null,
                    s = 0,
                    a = 0,
                    h = 0,
                    c = 0,
                    l = 0,
                    u = 0,
                    f = -this.pathOffset.x,
                    d = -this.pathOffset.y;
                this.group && "path-group" === this.group.type && (f = 0, d = 0), t.beginPath();
                for (var g = 0, p = this.path.length; p > g; ++g) {
                    switch (e = this.path[g], e[0]) {
                        case "l":
                            h += e[1], c += e[2], t.lineTo(h + f, c + d);
                            break;
                        case "L":
                            h = e[1], c = e[2], t.lineTo(h + f, c + d);
                            break;
                        case "h":
                            h += e[1], t.lineTo(h + f, c + d);
                            break;
                        case "H":
                            h = e[1], t.lineTo(h + f, c + d);
                            break;
                        case "v":
                            c += e[1], t.lineTo(h + f, c + d);
                            break;
                        case "V":
                            c = e[1], t.lineTo(h + f, c + d);
                            break;
                        case "m":
                            h += e[1], c += e[2], s = h, a = c, t.moveTo(h + f, c + d);
                            break;
                        case "M":
                            h = e[1], c = e[2], s = h, a = c, t.moveTo(h + f, c + d);
                            break;
                        case "c":
                            i = h + e[5], r = c + e[6], l = h + e[3], u = c + e[4], t.bezierCurveTo(h + e[1] + f, c + e[2] + d, l + f, u + d, i + f, r + d), h = i, c = r;
                            break;
                        case "C":
                            h = e[5], c = e[6], l = e[3], u = e[4], t.bezierCurveTo(e[1] + f, e[2] + d, l + f, u + d, h + f, c + d);
                            break;
                        case "s":
                            i = h + e[3], r = c + e[4], null === n[0].match(/[CcSs]/) ? (l = h, u = c) : (l = 2 * h - l, u = 2 * c - u), t.bezierCurveTo(l + f, u + d, h + e[1] + f, c + e[2] + d, i + f, r + d), l = h + e[1], u = c + e[2], h = i, c = r;
                            break;
                        case "S":
                            i = e[3], r = e[4], null === n[0].match(/[CcSs]/) ? (l = h, u = c) : (l = 2 * h - l, u = 2 * c - u), t.bezierCurveTo(l + f, u + d, e[1] + f, e[2] + d, i + f, r + d), h = i, c = r, l = e[1], u = e[2];
                            break;
                        case "q":
                            i = h + e[3], r = c + e[4], l = h + e[1], u = c + e[2], t.quadraticCurveTo(l + f, u + d, i + f, r + d), h = i, c = r;
                            break;
                        case "Q":
                            i = e[3], r = e[4], t.quadraticCurveTo(e[1] + f, e[2] + d, i + f, r + d), h = i, c = r, l = e[1], u = e[2];
                            break;
                        case "t":
                            i = h + e[1], r = c + e[2], null === n[0].match(/[QqTt]/) ? (l = h, u = c) : (l = 2 * h - l, u = 2 * c - u), t.quadraticCurveTo(l + f, u + d, i + f, r + d), h = i, c = r;
                            break;
                        case "T":
                            i = e[1], r = e[2], null === n[0].match(/[QqTt]/) ? (l = h, u = c) : (l = 2 * h - l, u = 2 * c - u), t.quadraticCurveTo(l + f, u + d, i + f, r + d), h = i, c = r;
                            break;
                        case "a":
                            o(t, h + f, c + d, [e[1], e[2], e[3], e[4], e[5], e[6] + h + f, e[7] + c + d]), h += e[6], c += e[7];
                            break;
                        case "A":
                            o(t, h + f, c + d, [e[1], e[2], e[3], e[4], e[5], e[6] + f, e[7] + d]), h = e[6], c = e[7];
                            break;
                        case "z":
                        case "Z":
                            h = s, c = a, t.closePath()
                    }
                    n = e
                }
                this._renderFill(t), this._renderStroke(t)
            },
            toString: function() {
                return "#<fabric.Path (" + this.complexity() + '): { "top": ' + this.top + ', "left": ' + this.left + " }>"
            },
            toObject: function(t) {
                var e = n(this.callSuper("toObject", t), {
                    path: this.path.map(function(t) {
                        return t.slice()
                    }),
                    pathOffset: this.pathOffset
                });
                return this.sourcePath && (e.sourcePath = this.sourcePath), this.transformMatrix && (e.transformMatrix = this.transformMatrix), e
            },
            toDatalessObject: function(t) {
                var e = this.toObject(t);
                return this.sourcePath && (e.path = this.sourcePath), delete e.sourcePath, e
            },
            toSVG: function(t) {
                for (var e = [], i = this._createBaseSVGMarkup(), r = "", n = 0, s = this.path.length; s > n; n++) e.push(this.path[n].join(" "));
                var o = e.join(" ");
                return this.group && "path-group" === this.group.type || (r = " translate(" + -this.pathOffset.x + ", " + -this.pathOffset.y + ") "), i.push("<path ", 'd="', o, '" style="', this.getSvgStyles(), '" transform="', this.getSvgTransform(), r, this.getSvgTransformMatrix(), '" stroke-linecap="round" ', "/>\n"), t ? t(i.join("")) : i.join("")
            },
            complexity: function() {
                return this.path.length
            },
            _parsePath: function() {
                for (var t, e, i, r, n, s = [], o = [], c = /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:e[-+]?\d+)?)/gi, l = 0, u = this.path.length; u > l; l++) {
                    for (t = this.path[l], r = t.slice(1).trim(), o.length = 0; i = c.exec(r);) o.push(i[0]);
                    n = [t.charAt(0)];
                    for (var f = 0, d = o.length; d > f; f++) e = parseFloat(o[f]), isNaN(e) || n.push(e);
                    var g = n[0],
                        p = a[g.toLowerCase()],
                        v = h[g] || g;
                    if (n.length - 1 > p)
                        for (var b = 1, m = n.length; m > b; b += p) s.push([g].concat(n.slice(b, b + p))), g = v;
                    else s.push(n)
                }
                return s
            },
            _parseDimensions: function() {
                for (var t, n, s, o, a = [], h = [], c = null, l = 0, u = 0, f = 0, d = 0, g = 0, p = 0, v = 0, b = this.path.length; b > v; ++v) {
                    switch (t = this.path[v], t[0]) {
                        case "l":
                            f += t[1], d += t[2], o = [];
                            break;
                        case "L":
                            f = t[1], d = t[2], o = [];
                            break;
                        case "h":
                            f += t[1], o = [];
                            break;
                        case "H":
                            f = t[1], o = [];
                            break;
                        case "v":
                            d += t[1], o = [];
                            break;
                        case "V":
                            d = t[1], o = [];
                            break;
                        case "m":
                            f += t[1], d += t[2], l = f, u = d, o = [];
                            break;
                        case "M":
                            f = t[1], d = t[2], l = f, u = d, o = [];
                            break;
                        case "c":
                            n = f + t[5], s = d + t[6], g = f + t[3], p = d + t[4], o = e.util.getBoundsOfCurve(f, d, f + t[1], d + t[2], g, p, n, s), f = n, d = s;
                            break;
                        case "C":
                            f = t[5], d = t[6], g = t[3], p = t[4], o = e.util.getBoundsOfCurve(f, d, t[1], t[2], g, p, f, d);
                            break;
                        case "s":
                            n = f + t[3], s = d + t[4], null === c[0].match(/[CcSs]/) ? (g = f, p = d) : (g = 2 * f - g, p = 2 * d - p), o = e.util.getBoundsOfCurve(f, d, g, p, f + t[1], d + t[2], n, s), g = f + t[1], p = d + t[2], f = n, d = s;
                            break;
                        case "S":
                            n = t[3], s = t[4], null === c[0].match(/[CcSs]/) ? (g = f, p = d) : (g = 2 * f - g, p = 2 * d - p), o = e.util.getBoundsOfCurve(f, d, g, p, t[1], t[2], n, s), f = n, d = s, g = t[1], p = t[2];
                            break;
                        case "q":
                            n = f + t[3], s = d + t[4], g = f + t[1], p = d + t[2], o = e.util.getBoundsOfCurve(f, d, g, p, g, p, n, s), f = n, d = s;
                            break;
                        case "Q":
                            g = t[1], p = t[2], o = e.util.getBoundsOfCurve(f, d, g, p, g, p, t[3], t[4]), f = t[3], d = t[4];
                            break;
                        case "t":
                            n = f + t[1], s = d + t[2], null === c[0].match(/[QqTt]/) ? (g = f, p = d) : (g = 2 * f - g, p = 2 * d - p), o = e.util.getBoundsOfCurve(f, d, g, p, g, p, n, s), f = n, d = s;
                            break;
                        case "T":
                            n = t[1], s = t[2], null === c[0].match(/[QqTt]/) ? (g = f, p = d) : (g = 2 * f - g, p = 2 * d - p), o = e.util.getBoundsOfCurve(f, d, g, p, g, p, n, s), f = n, d = s;
                            break;
                        case "a":
                            o = e.util.getBoundsOfArc(f, d, t[1], t[2], t[3], t[4], t[5], t[6] + f, t[7] + d), f += t[6], d += t[7];
                            break;
                        case "A":
                            o = e.util.getBoundsOfArc(f, d, t[1], t[2], t[3], t[4], t[5], t[6], t[7]), f = t[6], d = t[7];
                            break;
                        case "z":
                        case "Z":
                            f = l, d = u
                    }
                    c = t, o.forEach(function(t) {
                        a.push(t.x), h.push(t.y)
                    }), a.push(f), h.push(d)
                }
                var m = i(a) || 0,
                    y = i(h) || 0,
                    _ = r(a) || 0,
                    x = r(h) || 0,
                    S = _ - m,
                    C = x - y,
                    w = {
                        left: m,
                        top: y,
                        width: S,
                        height: C
                    };
                return w
            }
        }), e.Path.fromObject = function(t, i) {
            "string" == typeof t.path ? e.loadSVGFromURL(t.path, function(r) {
                var n = r[0],
                    s = t.path;
                delete t.path, e.util.object.extend(n, t), n.setSourcePath(s), i(n)
            }) : i(new e.Path(t.path, t))
        }, e.Path.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(["d"]), e.Path.fromElement = function(t, i, r) {
            var s = e.parseAttributes(t, e.Path.ATTRIBUTE_NAMES);
            i && i(new e.Path(s.d, n(s, r)))
        }, void(e.Path.async = !0))
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.util.array.invoke,
            n = e.Object.prototype.toObject;
        return e.PathGroup ? void e.warn("fabric.PathGroup is already defined") : (e.PathGroup = e.util.createClass(e.Path, {
            type: "path-group",
            fill: "",
            initialize: function(t, e) {
                e = e || {}, this.paths = t || [];
                for (var i = this.paths.length; i--;) this.paths[i].group = this;
                e.toBeParsed && (this.parseDimensionsFromPaths(e), delete e.toBeParsed), this.setOptions(e), this.setCoords(), e.sourcePath && this.setSourcePath(e.sourcePath)
            },
            parseDimensionsFromPaths: function(t) {
                for (var i, r, n, s, o, a, h = [], c = [], l = this.paths.length; l--;) {
                    n = this.paths[l], s = n.height + n.strokeWidth, o = n.width + n.strokeWidth, i = [{
                        x: n.left,
                        y: n.top
                    }, {
                        x: n.left + o,
                        y: n.top
                    }, {
                        x: n.left,
                        y: n.top + s
                    }, {
                        x: n.left + o,
                        y: n.top + s
                    }], a = this.paths[l].transformMatrix;
                    for (var u = 0; u < i.length; u++) r = i[u], a && (r = e.util.transformPoint(r, a, !1)), h.push(r.x), c.push(r.y)
                }
                t.width = Math.max.apply(null, h), t.height = Math.max.apply(null, c)
            },
            render: function(t) {
                if (this.visible) {
                    t.save(), this.transformMatrix && t.transform.apply(t, this.transformMatrix), this.transform(t), this._setShadow(t), this.clipTo && e.util.clipContext(this, t), t.translate(-this.width / 2, -this.height / 2);
                    for (var i = 0, r = this.paths.length; r > i; ++i) this.paths[i].render(t, !0);
                    this.clipTo && t.restore(), t.restore()
                }
            },
            _set: function(t, e) {
                if ("fill" === t && e && this.isSameColor())
                    for (var i = this.paths.length; i--;) this.paths[i]._set(t, e);
                return this.callSuper("_set", t, e)
            },
            toObject: function(t) {
                var e = i(n.call(this, t), {
                    paths: r(this.getObjects(), "toObject", t)
                });
                return this.sourcePath && (e.sourcePath = this.sourcePath), e
            },
            toDatalessObject: function(t) {
                var e = this.toObject(t);
                return this.sourcePath && (e.paths = this.sourcePath), e
            },
            toSVG: function(t) {
                var e = this.getObjects(),
                    i = this.getPointByOrigin("left", "top"),
                    r = "translate(" + i.x + " " + i.y + ")",
                    n = this._createBaseSVGMarkup();
                n.push("<g ", 'style="', this.getSvgStyles(), '" ', 'transform="', this.getSvgTransformMatrix(), r, this.getSvgTransform(), '" ', ">\n");
                for (var s = 0, o = e.length; o > s; s++) n.push("  ", e[s].toSVG(t));
                return n.push("</g>\n"), t ? t(n.join("")) : n.join("")
            },
            toString: function() {
                return "#<fabric.PathGroup (" + this.complexity() + "): { top: " + this.top + ", left: " + this.left + " }>"
            },
            isSameColor: function() {
                var t = this.getObjects()[0].get("fill") || "";
                return "string" != typeof t ? !1 : (t = t.toLowerCase(), this.getObjects().every(function(e) {
                    var i = e.get("fill") || "";
                    return "string" == typeof i && i.toLowerCase() === t
                }))
            },
            complexity: function() {
                return this.paths.reduce(function(t, e) {
                    return t + (e && e.complexity ? e.complexity() : 0)
                }, 0)
            },
            getObjects: function() {
                return this.paths
            }
        }), e.PathGroup.fromObject = function(t, i) {
            "string" == typeof t.paths ? e.loadSVGFromURL(t.paths, function(r) {
                var n = t.paths;
                delete t.paths;
                var s = e.util.groupSVGElements(r, t, n);
                i(s)
            }) : e.util.enlivenObjects(t.paths, function(r) {
                delete t.paths, i(new e.PathGroup(r, t))
            })
        }, void(e.PathGroup.async = !0))
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.util.array.min,
            n = e.util.array.max,
            s = e.util.array.invoke;
        if (!e.Group) {
            var o = {
                lockMovementX: !0,
                lockMovementY: !0,
                lockRotation: !0,
                lockScalingX: !0,
                lockScalingY: !0,
                lockUniScaling: !0
            };
            e.Group = e.util.createClass(e.Object, e.Collection, {
                type: "group",
                strokeWidth: 0,
                initialize: function(t, e, i) {
                    e = e || {}, this._objects = [], i && this.callSuper("initialize", e), this._objects = t || [];
                    for (var r = this._objects.length; r--;) this._objects[r].group = this;
                    this.originalState = {}, e.originX && (this.originX = e.originX), e.originY && (this.originY = e.originY), i ? this._updateObjectsCoords(!0) : (this._calcBounds(), this._updateObjectsCoords(), this.callSuper("initialize", e)), this.setCoords(), this.saveCoords()
                },
                _updateObjectsCoords: function(t) {
                    for (var e = this._objects.length; e--;) this._updateObjectCoords(this._objects[e], t)
                },
                _updateObjectCoords: function(t, e) {
                    if (t.__origHasControls = t.hasControls, t.hasControls = !1, !e) {
                        var i = t.getLeft(),
                            r = t.getTop(),
                            n = this.getCenterPoint();
                        t.set({
                            originalLeft: i,
                            originalTop: r,
                            left: i - n.x,
                            top: r - n.y
                        }), t.setCoords()
                    }
                },
                toString: function() {
                    return "#<fabric.Group: (" + this.complexity() + ")>"
                },
                addWithUpdate: function(t) {
                    return this._restoreObjectsState(), t && (this._objects.push(t), t.group = this, t._set("canvas", this.canvas)), this.forEachObject(this._setObjectActive, this), this._calcBounds(), this._updateObjectsCoords(), this
                },
                _setObjectActive: function(t) {
                    t.set("active", !0), t.group = this
                },
                removeWithUpdate: function(t) {
                    return this._moveFlippedObject(t), this._restoreObjectsState(), this.forEachObject(this._setObjectActive, this), this.remove(t), this._calcBounds(), this._updateObjectsCoords(), this
                },
                _onObjectAdded: function(t) {
                    t.group = this, t._set("canvas", this.canvas)
                },
                _onObjectRemoved: function(t) {
                    delete t.group, t.set("active", !1)
                },
                delegatedProperties: {
                    fill: !0,
                    opacity: !0,
                    fontFamily: !0,
                    fontWeight: !0,
                    fontSize: !0,
                    fontStyle: !0,
                    lineHeight: !0,
                    textDecoration: !0,
                    textAlign: !0,
                    backgroundColor: !0
                },
                _set: function(t, e) {
                    var i = this._objects.length;
                    if (this.delegatedProperties[t] || "canvas" === t)
                        for (; i--;) this._objects[i].set(t, e);
                    else
                        for (; i--;) this._objects[i].setOnGroup(t, e);
                    this.callSuper("_set", t, e)
                },
                toObject: function(t) {
                    return i(this.callSuper("toObject", t), {
                        objects: s(this._objects, "toObject", t)
                    })
                },
                render: function(t) {
                    if (this.visible) {
                        t.save(), this.transformMatrix && t.transform.apply(t, this.transformMatrix), this.transform(t), this._setShadow(t), this.clipTo && e.util.clipContext(this, t);
                        for (var i = 0, r = this._objects.length; r > i; i++) this._renderObject(this._objects[i], t);
                        this.clipTo && t.restore(), t.restore()
                    }
                },
                _renderControls: function(t, e) {
                    this.callSuper("_renderControls", t, e);
                    for (var i = 0, r = this._objects.length; r > i; i++) this._objects[i]._renderControls(t)
                },
                _renderObject: function(t, e) {
                    if (t.visible) {
                        var i = t.hasRotatingPoint;
                        t.hasRotatingPoint = !1, t.render(e), t.hasRotatingPoint = i
                    }
                },
                _restoreObjectsState: function() {
                    return this._objects.forEach(this._restoreObjectState, this), this
                },
                realizeTransform: function(t) {
                    return this._moveFlippedObject(t), this._setObjectPosition(t), t
                },
                _moveFlippedObject: function(t) {
                    var e = t.get("originX"),
                        i = t.get("originY"),
                        r = t.getCenterPoint();
                    t.set({
                        originX: "center",
                        originY: "center",
                        left: r.x,
                        top: r.y
                    }), this._toggleFlipping(t);
                    var n = t.getPointByOrigin(e, i);
                    return t.set({
                        originX: e,
                        originY: i,
                        left: n.x,
                        top: n.y
                    }), this
                },
                _toggleFlipping: function(t) {
                    this.flipX && (t.toggle("flipX"), t.set("left", -t.get("left")), t.setAngle(-t.getAngle())), this.flipY && (t.toggle("flipY"), t.set("top", -t.get("top")), t.setAngle(-t.getAngle()))
                },
                _restoreObjectState: function(t) {
                    return this._setObjectPosition(t), t.setCoords(), t.hasControls = t.__origHasControls, delete t.__origHasControls, t.set("active", !1), t.setCoords(), delete t.group, this
                },
                _setObjectPosition: function(t) {
                    var e = this.getCenterPoint(),
                        i = this._getRotatedLeftTop(t);
                    t.set({
                        angle: t.getAngle() + this.getAngle(),
                        left: e.x + i.left,
                        top: e.y + i.top,
                        scaleX: t.get("scaleX") * this.get("scaleX"),
                        scaleY: t.get("scaleY") * this.get("scaleY")
                    })
                },
                _getRotatedLeftTop: function(t) {
                    var e = this.getAngle() * (Math.PI / 180);
                    return {
                        left: -Math.sin(e) * t.getTop() * this.get("scaleY") + Math.cos(e) * t.getLeft() * this.get("scaleX"),
                        top: Math.cos(e) * t.getTop() * this.get("scaleY") + Math.sin(e) * t.getLeft() * this.get("scaleX")
                    }
                },
                destroy: function() {
                    return this._objects.forEach(this._moveFlippedObject, this), this._restoreObjectsState()
                },
                saveCoords: function() {
                    return this._originalLeft = this.get("left"), this._originalTop = this.get("top"), this
                },
                hasMoved: function() {
                    return this._originalLeft !== this.get("left") || this._originalTop !== this.get("top")
                },
                setObjectsCoords: function() {
                    return this.forEachObject(function(t) {
                        t.setCoords()
                    }), this
                },
                _calcBounds: function(t) {
                    for (var e, i, r, n = [], s = [], o = ["tr", "br", "bl", "tl"], a = 0, h = this._objects.length, c = o.length; h > a; ++a)
                        for (e = this._objects[a], e.setCoords(), r = 0; c > r; r++) i = o[r], n.push(e.oCoords[i].x), s.push(e.oCoords[i].y);
                    this.set(this._getBounds(n, s, t))
                },
                _getBounds: function(t, i, s) {
                    var o = e.util.invertTransform(this.getViewportTransform()),
                        a = e.util.transformPoint(new e.Point(r(t), r(i)), o),
                        h = e.util.transformPoint(new e.Point(n(t), n(i)), o),
                        c = {
                            width: h.x - a.x || 0,
                            height: h.y - a.y || 0
                        };
                    return s || (c.left = a.x || 0, c.top = a.y || 0, "center" === this.originX && (c.left += c.width / 2), "right" === this.originX && (c.left += c.width), "center" === this.originY && (c.top += c.height / 2), "bottom" === this.originY && (c.top += c.height)), c
                },
                toSVG: function(t) {
                    var e = this._createBaseSVGMarkup();
                    e.push('<g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '" style="', this.getSvgFilter(), '">\n');
                    for (var i = 0, r = this._objects.length; r > i; i++) e.push("  ", this._objects[i].toSVG(t));
                    return e.push("</g>\n"), t ? t(e.join("")) : e.join("")
                },
                get: function(t) {
                    if (t in o) {
                        if (this[t]) return this[t];
                        for (var e = 0, i = this._objects.length; i > e; e++)
                            if (this._objects[e][t]) return !0;
                        return !1
                    }
                    return t in this.delegatedProperties ? this._objects[0] && this._objects[0].get(t) : this[t]
                }
            }), e.Group.fromObject = function(t, i) {
                e.util.enlivenObjects(t.objects, function(r) {
                    delete t.objects, i && i(new e.Group(r, t, !0))
                })
            }, e.Group.async = !0
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = fabric.util.object.extend;
        return t.fabric || (t.fabric = {}), t.fabric.Image ? void fabric.warn("fabric.Image is already defined.") : (fabric.Image = fabric.util.createClass(fabric.Object, {
            type: "image",
            crossOrigin: "",
            alignX: "none",
            alignY: "none",
            meetOrSlice: "meet",
            _lastScaleX: 1,
            _lastScaleY: 1,
            initialize: function(t, e) {
                e || (e = {}), this.filters = [], this.resizeFilters = [], this.callSuper("initialize", e), this._initElement(t, e)
            },
            getElement: function() {
                return this._element
            },
            setElement: function(t, e, i) {
                return this._element = t, this._originalElement = t, this._initConfig(i), 0 !== this.filters.length ? this.applyFilters(e) : e && e(), this
            },
            setCrossOrigin: function(t) {
                return this.crossOrigin = t, this._element.crossOrigin = t, this
            },
            getOriginalSize: function() {
                var t = this.getElement();
                return {
                    width: t.width,
                    height: t.height
                }
            },
            _stroke: function(t) {
                t.save(), this._setStrokeStyles(t), t.beginPath(), t.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height), t.closePath(), t.restore()
            },
            _renderDashedStroke: function(t) {
                var e = -this.width / 2,
                    i = -this.height / 2,
                    r = this.width,
                    n = this.height;
                t.save(), this._setStrokeStyles(t), t.beginPath(), fabric.util.drawDashedLine(t, e, i, e + r, i, this.strokeDashArray), fabric.util.drawDashedLine(t, e + r, i, e + r, i + n, this.strokeDashArray), fabric.util.drawDashedLine(t, e + r, i + n, e, i + n, this.strokeDashArray), fabric.util.drawDashedLine(t, e, i + n, e, i, this.strokeDashArray), t.closePath(), t.restore()
            },
            toObject: function(t) {
                var i = [];
                this.filters.forEach(function(t) {
                    t && i.push(t.toObject())
                });
                var r = e(this.callSuper("toObject", t), {
                    src: this._originalElement.src || this._originalElement._src,
                    filters: i,
                    crossOrigin: this.crossOrigin,
                    alignX: this.alignX,
                    alignY: this.alignY,
                    meetOrSlice: this.meetOrSlice
                });
                return this.resizeFilters.length > 0 && (r.resizeFilters = this.resizeFilters.map(function(t) {
                    return t && t.toObject()
                })), this.includeDefaultValues || this._removeDefaultValues(r), r
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                    i = -this.width / 2,
                    r = -this.height / 2,
                    n = "none";
                if (this.group && "path-group" === this.group.type && (i = this.left, r = this.top), "none" !== this.alignX && "none" !== this.alignY && (n = "x" + this.alignX + "Y" + this.alignY + " " + this.meetOrSlice), e.push('<g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '">\n', '<image xlink:href="', this.getSvgSrc(), '" x="', i, '" y="', r, '" style="', this.getSvgStyles(), '" width="', this.width, '" height="', this.height, '" preserveAspectRatio="', n, '"', "></image>\n"), this.stroke || this.strokeDashArray) {
                    var s = this.fill;
                    this.fill = null, e.push("<rect ", 'x="', i, '" y="', r, '" width="', this.width, '" height="', this.height, '" style="', this.getSvgStyles(), '"/>\n'), this.fill = s
                }
                return e.push("</g>\n"), t ? t(e.join("")) : e.join("")
            },
            getSrc: function() {
                return this.getElement() ? this.getElement().src || this.getElement()._src : void 0
            },
            setSrc: function(t, e, i) {
                fabric.util.loadImage(t, function(t) {
                    return this.setElement(t, e, i)
                }, this, i && i.crossOrigin)
            },
            toString: function() {
                return '#<fabric.Image: { src: "' + this.getSrc() + '" }>'
            },
            clone: function(t, e) {
                this.constructor.fromObject(this.toObject(e), t)
            },
            applyFilters: function(t, e, i, r) {
                if (e = e || this.filters, i = i || this._originalElement) {
                    var n = i,
                        s = fabric.util.createCanvasElement(),
                        o = fabric.util.createImage(),
                        a = this;
                    return s.width = n.width, s.height = n.height, s.getContext("2d").drawImage(n, 0, 0, n.width, n.height), 0 === e.length ? (this._element = i, t && t(), s) : (e.forEach(function(t) {
                        t && t.applyTo(s, t.scaleX || a.scaleX, t.scaleY || a.scaleY), !r && t && "Resize" === t.type && (a.width *= t.scaleX, a.height *= t.scaleY)
                    }), o.width = s.width, o.height = s.height, fabric.isLikelyNode ? (o.src = s.toBuffer(void 0, fabric.Image.pngCompression), a._element = o, !r && (a._filteredEl = o), t && t()) : (o.onload = function() {
                        a._element = o, !r && (a._filteredEl = o), t && t(), o.onload = s = n = null
                    }, o.src = s.toDataURL("image/png")), s)
                }
            },
            _render: function(t, e) {
                var i, r, n, s = this._findMargins();
                i = e ? this.left : -this.width / 2, r = e ? this.top : -this.height / 2, "slice" === this.meetOrSlice && (t.beginPath(), t.rect(i, r, this.width, this.height), t.clip()), this.isMoving === !1 && this.resizeFilters.length && this._needsResize() ? (this._lastScaleX = this.scaleX, this._lastScaleY = this.scaleY, n = this.applyFilters(null, this.resizeFilters, this._filteredEl || this._originalElement, !0)) : n = this._element, n && t.drawImage(n, i + s.marginX, r + s.marginY, s.width, s.height), this._renderStroke(t)
            },
            _needsResize: function() {
                return this.scaleX !== this._lastScaleX || this.scaleY !== this._lastScaleY
            },
            _findMargins: function() {
                var t, e, i = this.width,
                    r = this.height,
                    n = 0,
                    s = 0;
                return ("none" !== this.alignX || "none" !== this.alignY) && (t = [this.width / this._element.width, this.height / this._element.height], e = "meet" === this.meetOrSlice ? Math.min.apply(null, t) : Math.max.apply(null, t), i = this._element.width * e, r = this._element.height * e, "Mid" === this.alignX && (n = (this.width - i) / 2), "Max" === this.alignX && (n = this.width - i), "Mid" === this.alignY && (s = (this.height - r) / 2), "Max" === this.alignY && (s = this.height - r)), {
                    width: i,
                    height: r,
                    marginX: n,
                    marginY: s
                }
            },
            _resetWidthHeight: function() {
                var t = this.getElement();
                this.set("width", t.width), this.set("height", t.height)
            },
            _initElement: function(t, e) {
                this.setElement(fabric.util.getById(t), null, e), fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS)
            },
            _initConfig: function(t) {
                t || (t = {}), this.setOptions(t), this._setWidthHeight(t), this._element && this.crossOrigin && (this._element.crossOrigin = this.crossOrigin)
            },
            _initFilters: function(t, e) {
                t && t.length ? fabric.util.enlivenObjects(t, function(t) {
                    e && e(t)
                }, "fabric.Image.filters") : e && e()
            },
            _setWidthHeight: function(t) {
                this.width = "width" in t ? t.width : this.getElement() ? this.getElement().width || 0 : 0, this.height = "height" in t ? t.height : this.getElement() ? this.getElement().height || 0 : 0
            },
            complexity: function() {
                return 1
            }
        }), fabric.Image.CSS_CANVAS = "canvas-img", fabric.Image.prototype.getSvgSrc = fabric.Image.prototype.getSrc, fabric.Image.fromObject = function(t, e) {
            fabric.util.loadImage(t.src, function(i) {
                fabric.Image.prototype._initFilters.call(t, t.filters, function(r) {
                    t.filters = r || [], fabric.Image.prototype._initFilters.call(t, t.resizeFilters, function(r) {
                        t.resizeFilters = r || [];
                        var n = new fabric.Image(i, t);
                        e && e(n)
                    })
                })
            }, null, t.crossOrigin)
        }, fabric.Image.fromURL = function(t, e, i) {
            fabric.util.loadImage(t, function(t) {
                e && e(new fabric.Image(t, i))
            }, null, i && i.crossOrigin)
        }, fabric.Image.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat("x y width height preserveAspectRatio xlink:href".split(" ")), fabric.Image.fromElement = function(t, i, r) {
            var n, s = fabric.parseAttributes(t, fabric.Image.ATTRIBUTE_NAMES);
            s.preserveAspectRatio && (n = fabric.util.parsePreserveAspectRatioAttribute(s.preserveAspectRatio), e(s, n)), fabric.Image.fromURL(s["xlink:href"], i, e(r ? fabric.util.object.clone(r) : {}, s))
        }, fabric.Image.async = !0, void(fabric.Image.pngCompression = 1))
    }("undefined" != typeof exports ? exports : this), fabric.util.object.extend(fabric.Object.prototype, {
        _getAngleValueForStraighten: function() {
            var t = this.getAngle() % 360;
            return t > 0 ? 90 * Math.round((t - 1) / 90) : 90 * Math.round(t / 90)
        },
        straighten: function() {
            return this.setAngle(this._getAngleValueForStraighten()), this
        },
        fxStraighten: function(t) {
            t = t || {};
            var e = function() {},
                i = t.onComplete || e,
                r = t.onChange || e,
                n = this;
            return fabric.util.animate({
                startValue: this.get("angle"),
                endValue: this._getAngleValueForStraighten(),
                duration: this.FX_DURATION,
                onChange: function(t) {
                    n.setAngle(t), r()
                },
                onComplete: function() {
                    n.setCoords(), i()
                },
                onStart: function() {
                    n.set("active", !1)
                }
            }), this
        }
    }), fabric.util.object.extend(fabric.StaticCanvas.prototype, {
        straightenObject: function(t) {
            return t.straighten(), this.renderAll(), this
        },
        fxStraightenObject: function(t) {
            return t.fxStraighten({
                onChange: this.renderAll.bind(this)
            }), this
        }
    }), fabric.Image.filters = fabric.Image.filters || {}, fabric.Image.filters.BaseFilter = fabric.util.createClass({
        type: "BaseFilter",
        initialize: function(t) {
            t && this.setOptions(t)
        },
        setOptions: function(t) {
            for (var e in t) this[e] = t[e]
        },
        toObject: function() {
            return {
                type: this.type
            }
        },
        toJSON: function() {
            return this.toObject()
        }
    }),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Image.filters.Brightness = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Brightness",
            initialize: function(t) {
                t = t || {}, this.brightness = t.brightness || 0
            },
            applyTo: function(t) {
                for (var e = t.getContext("2d"), i = e.getImageData(0, 0, t.width, t.height), r = i.data, n = this.brightness, s = 0, o = r.length; o > s; s += 4) r[s] += n, r[s + 1] += n, r[s + 2] += n;
                e.putImageData(i, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    brightness: this.brightness
                })
            }
        }), e.Image.filters.Brightness.fromObject = function(t) {
            return new e.Image.filters.Brightness(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Image.filters.Convolute = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Convolute",
            initialize: function(t) {
                t = t || {}, this.opaque = t.opaque, this.matrix = t.matrix || [0, 0, 0, 0, 1, 0, 0, 0, 0];
                var i = e.util.createCanvasElement();
                this.tmpCtx = i.getContext("2d")
            },
            _createImageData: function(t, e) {
                return this.tmpCtx.createImageData(t, e)
            },
            applyTo: function(t) {
                for (var e = this.matrix, i = t.getContext("2d"), r = i.getImageData(0, 0, t.width, t.height), n = Math.round(Math.sqrt(e.length)), s = Math.floor(n / 2), o = r.data, a = r.width, h = r.height, c = a, l = h, u = this._createImageData(c, l), f = u.data, d = this.opaque ? 1 : 0, g = 0; l > g; g++)
                    for (var p = 0; c > p; p++) {
                        for (var v = g, b = p, m = 4 * (g * c + p), y = 0, _ = 0, x = 0, S = 0, C = 0; n > C; C++)
                            for (var w = 0; n > w; w++) {
                                var O = v + C - s,
                                    T = b + w - s;
                                if (!(0 > O || O > h || 0 > T || T > a)) {
                                    var k = 4 * (O * a + T),
                                        j = e[C * n + w];
                                    y += o[k] * j, _ += o[k + 1] * j, x += o[k + 2] * j, S += o[k + 3] * j
                                }
                            }
                        f[m] = y, f[m + 1] = _, f[m + 2] = x, f[m + 3] = S + d * (255 - S)
                    }
                i.putImageData(u, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    opaque: this.opaque,
                    matrix: this.matrix
                })
            }
        }), e.Image.filters.Convolute.fromObject = function(t) {
            return new e.Image.filters.Convolute(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Image.filters.GradientTransparency = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "GradientTransparency",
            initialize: function(t) {
                t = t || {}, this.threshold = t.threshold || 100
            },
            applyTo: function(t) {
                for (var e = t.getContext("2d"), i = e.getImageData(0, 0, t.width, t.height), r = i.data, n = this.threshold, s = r.length, o = 0, a = r.length; a > o; o += 4) r[o + 3] = n + 255 * (s - o) / s;
                e.putImageData(i, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    threshold: this.threshold
                })
            }
        }), e.Image.filters.GradientTransparency.fromObject = function(t) {
            return new e.Image.filters.GradientTransparency(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});
        e.Image.filters.Grayscale = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Grayscale",
            applyTo: function(t) {
                for (var e, i = t.getContext("2d"), r = i.getImageData(0, 0, t.width, t.height), n = r.data, s = r.width * r.height * 4, o = 0; s > o;) e = (n[o] + n[o + 1] + n[o + 2]) / 3, n[o] = e, n[o + 1] = e, n[o + 2] = e, o += 4;
                i.putImageData(r, 0, 0)
            }
        }), e.Image.filters.Grayscale.fromObject = function() {
            return new e.Image.filters.Grayscale
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});
        e.Image.filters.Invert = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Invert",
            applyTo: function(t) {
                var e, i = t.getContext("2d"),
                    r = i.getImageData(0, 0, t.width, t.height),
                    n = r.data,
                    s = n.length;
                for (e = 0; s > e; e += 4) n[e] = 255 - n[e], n[e + 1] = 255 - n[e + 1], n[e + 2] = 255 - n[e + 2];
                i.putImageData(r, 0, 0)
            }
        }), e.Image.filters.Invert.fromObject = function() {
            return new e.Image.filters.Invert
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Image.filters.Mask = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Mask",
            initialize: function(t) {
                t = t || {}, this.mask = t.mask, this.channel = [0, 1, 2, 3].indexOf(t.channel) > -1 ? t.channel : 0
            },
            applyTo: function(t) {
                if (this.mask) {
                    var i, r = t.getContext("2d"),
                        n = r.getImageData(0, 0, t.width, t.height),
                        s = n.data,
                        o = this.mask.getElement(),
                        a = e.util.createCanvasElement(),
                        h = this.channel,
                        c = n.width * n.height * 4;
                    a.width = o.width, a.height = o.height, a.getContext("2d").drawImage(o, 0, 0, o.width, o.height);
                    var l = a.getContext("2d").getImageData(0, 0, o.width, o.height),
                        u = l.data;
                    for (i = 0; c > i; i += 4) s[i + 3] = u[i + h];
                    r.putImageData(n, 0, 0)
                }
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    mask: this.mask.toObject(),
                    channel: this.channel
                })
            }
        }), e.Image.filters.Mask.fromObject = function(t, i) {
            e.util.loadImage(t.mask.src, function(r) {
                t.mask = new e.Image(r, t.mask), i && i(new e.Image.filters.Mask(t))
            })
        }, e.Image.filters.Mask.async = !0
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Image.filters.Noise = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Noise",
            initialize: function(t) {
                t = t || {}, this.noise = t.noise || 0
            },
            applyTo: function(t) {
                for (var e, i = t.getContext("2d"), r = i.getImageData(0, 0, t.width, t.height), n = r.data, s = this.noise, o = 0, a = n.length; a > o; o += 4) e = (.5 - Math.random()) * s, n[o] += e, n[o + 1] += e, n[o + 2] += e;
                i.putImageData(r, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    noise: this.noise
                })
            }
        }), e.Image.filters.Noise.fromObject = function(t) {
            return new e.Image.filters.Noise(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Image.filters.Pixelate = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Pixelate",
            initialize: function(t) {
                t = t || {}, this.blocksize = t.blocksize || 4
            },
            applyTo: function(t) {
                var e, i, r, n, s, o, a, h = t.getContext("2d"),
                    c = h.getImageData(0, 0, t.width, t.height),
                    l = c.data,
                    u = c.height,
                    f = c.width;
                for (i = 0; u > i; i += this.blocksize)
                    for (r = 0; f > r; r += this.blocksize) {
                        e = 4 * i * f + 4 * r, n = l[e], s = l[e + 1], o = l[e + 2], a = l[e + 3];
                        for (var d = i, g = i + this.blocksize; g > d; d++)
                            for (var p = r, v = r + this.blocksize; v > p; p++) e = 4 * d * f + 4 * p, l[e] = n, l[e + 1] = s, l[e + 2] = o, l[e + 3] = a
                    }
                h.putImageData(c, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    blocksize: this.blocksize
                })
            }
        }), e.Image.filters.Pixelate.fromObject = function(t) {
            return new e.Image.filters.Pixelate(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Image.filters.RemoveWhite = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "RemoveWhite",
            initialize: function(t) {
                t = t || {}, this.threshold = t.threshold || 30, this.distance = t.distance || 20
            },
            applyTo: function(t) {
                for (var e, i, r, n = t.getContext("2d"), s = n.getImageData(0, 0, t.width, t.height), o = s.data, a = this.threshold, h = this.distance, c = 255 - a, l = Math.abs, u = 0, f = o.length; f > u; u += 4) e = o[u], i = o[u + 1], r = o[u + 2], e > c && i > c && r > c && l(e - i) < h && l(e - r) < h && l(i - r) < h && (o[u + 3] = 1);
                n.putImageData(s, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    threshold: this.threshold,
                    distance: this.distance
                })
            }
        }), e.Image.filters.RemoveWhite.fromObject = function(t) {
            return new e.Image.filters.RemoveWhite(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});
        e.Image.filters.Sepia = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Sepia",
            applyTo: function(t) {
                var e, i, r = t.getContext("2d"),
                    n = r.getImageData(0, 0, t.width, t.height),
                    s = n.data,
                    o = s.length;
                for (e = 0; o > e; e += 4) i = .3 * s[e] + .59 * s[e + 1] + .11 * s[e + 2], s[e] = i + 100, s[e + 1] = i + 50, s[e + 2] = i + 255;
                r.putImageData(n, 0, 0)
            }
        }), e.Image.filters.Sepia.fromObject = function() {
            return new e.Image.filters.Sepia
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {});
        e.Image.filters.Sepia2 = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Sepia2",
            applyTo: function(t) {
                var e, i, r, n, s = t.getContext("2d"),
                    o = s.getImageData(0, 0, t.width, t.height),
                    a = o.data,
                    h = a.length;
                for (e = 0; h > e; e += 4) i = a[e], r = a[e + 1], n = a[e + 2], a[e] = (.393 * i + .769 * r + .189 * n) / 1.351, a[e + 1] = (.349 * i + .686 * r + .168 * n) / 1.203, a[e + 2] = (.272 * i + .534 * r + .131 * n) / 2.14;
                s.putImageData(o, 0, 0)
            }
        }), e.Image.filters.Sepia2.fromObject = function() {
            return new e.Image.filters.Sepia2
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Image.filters.Tint = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Tint",
            initialize: function(t) {
                t = t || {}, this.color = t.color || "#000000", this.opacity = "undefined" != typeof t.opacity ? t.opacity : new e.Color(this.color).getAlpha()
            },
            applyTo: function(t) {
                var i, r, n, s, o, a, h, c, l, u = t.getContext("2d"),
                    f = u.getImageData(0, 0, t.width, t.height),
                    d = f.data,
                    g = d.length;
                for (l = new e.Color(this.color).getSource(), r = l[0] * this.opacity, n = l[1] * this.opacity, s = l[2] * this.opacity, c = 1 - this.opacity, i = 0; g > i; i += 4) o = d[i], a = d[i + 1], h = d[i + 2], d[i] = r + o * c, d[i + 1] = n + a * c, d[i + 2] = s + h * c;
                u.putImageData(f, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    color: this.color,
                    opacity: this.opacity
                })
            }
        }), e.Image.filters.Tint.fromObject = function(t) {
            return new e.Image.filters.Tint(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend;
        e.Image.filters.Multiply = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Multiply",
            initialize: function(t) {
                t = t || {}, this.color = t.color || "#000000"
            },
            applyTo: function(t) {
                var i, r, n = t.getContext("2d"),
                    s = n.getImageData(0, 0, t.width, t.height),
                    o = s.data,
                    a = o.length;
                for (r = new e.Color(this.color).getSource(), i = 0; a > i; i += 4) o[i] *= r[0] / 255, o[i + 1] *= r[1] / 255, o[i + 2] *= r[2] / 255;
                n.putImageData(s, 0, 0)
            },
            toObject: function() {
                return i(this.callSuper("toObject"), {
                    color: this.color
                })
            }
        }), e.Image.filters.Multiply.fromObject = function(t) {
            return new e.Image.filters.Multiply(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric;
        e.Image.filters.Blend = e.util.createClass({
            type: "Blend",
            initialize: function(t) {
                t = t || {}, this.color = t.color || "#000", this.image = t.image || !1, this.mode = t.mode || "multiply", this.alpha = t.alpha || 1
            },
            applyTo: function(t) {
                var i, r, n, s, o, a, h, c, l, u, f = t.getContext("2d"),
                    d = f.getImageData(0, 0, t.width, t.height),
                    g = d.data,
                    p = !1;
                if (this.image) {
                    p = !0;
                    var v = e.util.createCanvasElement();
                    v.width = this.image.width, v.height = this.image.height;
                    var b = new e.StaticCanvas(v);
                    b.add(this.image);
                    var m = b.getContext("2d");
                    u = m.getImageData(0, 0, b.width, b.height).data
                } else u = new e.Color(this.color).getSource(), i = u[0] * this.alpha, r = u[1] * this.alpha, n = u[2] * this.alpha;
                for (var y = 0, _ = g.length; _ > y; y += 4) switch (s = g[y], o = g[y + 1], a = g[y + 2], p && (i = u[y] * this.alpha, r = u[y + 1] * this.alpha, n = u[y + 2] * this.alpha), this.mode) {
                    case "multiply":
                        g[y] = s * i / 255, g[y + 1] = o * r / 255, g[y + 2] = a * n / 255;
                        break;
                    case "screen":
                        g[y] = 1 - (1 - s) * (1 - i), g[y + 1] = 1 - (1 - o) * (1 - r), g[y + 2] = 1 - (1 - a) * (1 - n);
                        break;
                    case "add":
                        g[y] = Math.min(255, s + i), g[y + 1] = Math.min(255, o + r), g[y + 2] = Math.min(255, a + n);
                        break;
                    case "diff":
                    case "difference":
                        g[y] = Math.abs(s - i), g[y + 1] = Math.abs(o - r), g[y + 2] = Math.abs(a - n);
                        break;
                    case "subtract":
                        h = s - i, c = o - r, l = a - n, g[y] = 0 > h ? 0 : h, g[y + 1] = 0 > c ? 0 : c, g[y + 2] = 0 > l ? 0 : l;
                        break;
                    case "darken":
                        g[y] = Math.min(s, i), g[y + 1] = Math.min(o, r), g[y + 2] = Math.min(a, n);
                        break;
                    case "lighten":
                        g[y] = Math.max(s, i), g[y + 1] = Math.max(o, r), g[y + 2] = Math.max(a, n)
                }
                f.putImageData(d, 0, 0)
            },
            toObject: function() {
                return {
                    color: this.color,
                    image: this.image,
                    mode: this.mode,
                    alpha: this.alpha
                }
            }
        }), e.Image.filters.Blend.fromObject = function(t) {
            return new e.Image.filters.Blend(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = Math.pow,
            r = Math.floor,
            n = Math.sqrt,
            s = Math.abs,
            o = Math.max,
            a = Math.round,
            h = Math.sin,
            c = Math.ceil;
        e.Image.filters.Resize = e.util.createClass(e.Image.filters.BaseFilter, {
            type: "Resize",
            resizeType: "hermite",
            scaleX: 0,
            scaleY: 0,
            lanczosLobes: 3,
            applyTo: function(t, e, i) {
                this.rcpScaleX = 1 / e, this.rcpScaleY = 1 / i;
                var r, n = t.width,
                    s = t.height,
                    o = a(n * e),
                    h = a(s * i);
                "sliceHack" === this.resizeType && (r = this.sliceByTwo(t, n, s, o, h)), "hermite" === this.resizeType && (r = this.hermiteFastResize(t, n, s, o, h)), "bilinear" === this.resizeType && (r = this.bilinearFiltering(t, n, s, o, h)), "lanczos" === this.resizeType && (r = this.lanczosResize(t, n, s, o, h)), t.width = o, t.height = h, t.getContext("2d").putImageData(r, 0, 0)
            },
            sliceByTwo: function(t, i, n, s, a) {
                var h, c = t.getContext("2d"),
                    l = .5,
                    u = .5,
                    f = 1,
                    d = 1,
                    g = !1,
                    p = !1,
                    v = i,
                    b = n,
                    m = e.util.createCanvasElement(),
                    y = m.getContext("2d");
                for (s = r(s), a = r(a), m.width = o(s, i), m.height = o(a, n), s > i && (l = 2, f = -1), a > n && (u = 2, d = -1), h = c.getImageData(0, 0, i, n), t.width = o(s, i), t.height = o(a, n), c.putImageData(h, 0, 0); !g || !p;) i = v, n = b, s * f < r(v * l * f) ? v = r(v * l) : (v = s, g = !0), a * d < r(b * u * d) ? b = r(b * u) : (b = a, p = !0), h = c.getImageData(0, 0, i, n), y.putImageData(h, 0, 0), c.clearRect(0, 0, v, b), c.drawImage(m, 0, 0, i, n, 0, 0, v, b);
                return c.getImageData(0, 0, s, a)
            },
            lanczosResize: function(t, e, o, a, l) {
                function u(t) {
                    return function(e) {
                        if (e > t) return 0;
                        if (e *= Math.PI, s(e) < 1e-16) return 1;
                        var i = e / t;
                        return h(e) * h(i) / e / i
                    }
                }

                function f(t) {
                    var h, c, u, d, g, j, A, P, L, M, I;
                    for (T.x = (t + .5) * y, k.x = r(T.x), h = 0; l > h; h++) {
                        for (T.y = (h + .5) * _, k.y = r(T.y), g = 0, j = 0, A = 0, P = 0, L = 0, c = k.x - C; c <= k.x + C; c++)
                            if (!(0 > c || c >= e)) {
                                M = r(1e3 * s(c - T.x)), O[M] || (O[M] = {});
                                for (var D = k.y - w; D <= k.y + w; D++) 0 > D || D >= o || (I = r(1e3 * s(D - T.y)), O[M][I] || (O[M][I] = m(n(i(M * x, 2) + i(I * S, 2)) / 1e3)), u = O[M][I], u > 0 && (d = 4 * (D * e + c), g += u, j += u * v[d], A += u * v[d + 1], P += u * v[d + 2], L += u * v[d + 3]))
                            }
                        d = 4 * (h * a + t), b[d] = j / g, b[d + 1] = A / g, b[d + 2] = P / g, b[d + 3] = L / g
                    }
                    return ++t < a ? f(t) : p
                }
                var d = t.getContext("2d"),
                    g = d.getImageData(0, 0, e, o),
                    p = d.getImageData(0, 0, a, l),
                    v = g.data,
                    b = p.data,
                    m = u(this.lanczosLobes),
                    y = this.rcpScaleX,
                    _ = this.rcpScaleY,
                    x = 2 / this.rcpScaleX,
                    S = 2 / this.rcpScaleY,
                    C = c(y * this.lanczosLobes / 2),
                    w = c(_ * this.lanczosLobes / 2),
                    O = {},
                    T = {},
                    k = {};
                return f(0)
            },
            bilinearFiltering: function(t, e, i, n, s) {
                var o, a, h, c, l, u, f, d, g, p, v, b, m, y = 0,
                    _ = this.rcpScaleX,
                    x = this.rcpScaleY,
                    S = t.getContext("2d"),
                    C = 4 * (e - 1),
                    w = S.getImageData(0, 0, e, i),
                    O = w.data,
                    T = S.getImageData(0, 0, n, s),
                    k = T.data;
                for (f = 0; s > f; f++)
                    for (d = 0; n > d; d++)
                        for (l = r(_ * d), u = r(x * f), g = _ * d - l, p = x * f - u, m = 4 * (u * e + l), v = 0; 4 > v; v++) o = O[m + v], a = O[m + 4 + v], h = O[m + C + v], c = O[m + C + 4 + v], b = o * (1 - g) * (1 - p) + a * g * (1 - p) + h * p * (1 - g) + c * g * p, k[y++] = b;
                return T
            },
            hermiteFastResize: function(t, e, i, o, a) {
                for (var h = this.rcpScaleX, l = this.rcpScaleY, u = c(h / 2), f = c(l / 2), d = t.getContext("2d"), g = d.getImageData(0, 0, e, i), p = g.data, v = d.getImageData(0, 0, o, a), b = v.data, m = 0; a > m; m++)
                    for (var y = 0; o > y; y++) {
                        for (var _ = 4 * (y + m * o), x = 0, S = 0, C = 0, w = 0, O = 0, T = 0, k = 0, j = (m + .5) * l, A = r(m * l);
                            (m + 1) * l > A; A++)
                            for (var P = s(j - (A + .5)) / f, L = (y + .5) * h, M = P * P, I = r(y * h);
                                (y + 1) * h > I; I++) {
                                var D = s(L - (I + .5)) / u,
                                    E = n(M + D * D);
                                E > 1 && -1 > E || (x = 2 * E * E * E - 3 * E * E + 1, x > 0 && (D = 4 * (I + A * e), k += x * p[D + 3], C += x, p[D + 3] < 255 && (x = x * p[D + 3] / 250), w += x * p[D], O += x * p[D + 1], T += x * p[D + 2], S += x))
                            }
                        b[_] = w / S, b[_ + 1] = O / S, b[_ + 2] = T / S, b[_ + 3] = k / C
                    }
                return v
            },
            toObject: function() {
                return {
                    type: this.type,
                    scaleX: this.scaleX,
                    scaleY: this.scaleY,
                    resizeType: this.resizeType,
                    lanczosLobes: this.lanczosLobes
                }
            }
        }), e.Image.filters.Resize.fromObject = function(t) {
            return new e.Image.filters.Resize(t)
        }
    }("undefined" != typeof exports ? exports : this),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.extend,
            r = e.util.object.clone,
            n = e.util.toFixed,
            s = e.StaticCanvas.supports("setLineDash"),
            o = e.Object.NUM_FRACTION_DIGITS;
        if (e.Text) return void e.warn("fabric.Text is already defined");
        var a = e.Object.prototype.stateProperties.concat();
        a.push("fontFamily", "fontWeight", "fontSize", "text", "textDecoration", "textAlign", "fontStyle", "lineHeight", "textBackgroundColor"), e.Text = e.util.createClass(e.Object, {
            _dimensionAffectingProps: {
                fontSize: !0,
                fontWeight: !0,
                fontFamily: !0,
                fontStyle: !0,
                lineHeight: !0,
                stroke: !0,
                strokeWidth: !0,
                text: !0,
                textAlign: !0
            },
            _reNewline: /\r?\n/,
            _reSpacesAndTabs: /[ \t\r]+/g,
            type: "text",
            fontSize: 40,
            fontWeight: "normal",
            fontFamily: "Times New Roman",
            textDecoration: "",
            textAlign: "left",
            fontStyle: "",
            lineHeight: 1.16,
            textBackgroundColor: "",
            stateProperties: a,
            stroke: null,
            shadow: null,
            _fontSizeFraction: .25,
            _fontSizeMult: 1.13,
            initialize: function(t, e) {
                e = e || {}, this.text = t, this.__skipDimension = !0, this.setOptions(e), this.__skipDimension = !1, this._initDimensions()
            },
            _initDimensions: function(t) {
                this.__skipDimension || (t || (t = e.util.createCanvasElement().getContext("2d"), this._setTextStyles(t)), this._textLines = this._splitTextIntoLines(), this._clearCache(), this._cacheLinesWidth = "justify" !== this.textAlign, this.width = this._getTextWidth(t), this._cacheLinesWidth = !0, this.height = this._getTextHeight(t))
            },
            toString: function() {
                return "#<fabric.Text (" + this.complexity() + '): { "text": "' + this.text + '", "fontFamily": "' + this.fontFamily + '" }>'
            },
            _render: function(t) {
                this.clipTo && e.util.clipContext(this, t), this._setOpacity(t), this._setShadow(t), this._setupCompositeOperation(t), this._renderTextBackground(t), this._setStrokeStyles(t), this._setFillStyles(t), this._renderText(t), this._renderTextDecoration(t), this.clipTo && t.restore()
            },
            _renderText: function(t) {
                this._translateForTextAlign(t), this._renderTextFill(t), this._renderTextStroke(t), this._translateForTextAlign(t, !0)
            },
            _translateForTextAlign: function(t, e) {
                if ("left" !== this.textAlign && "justify" !== this.textAlign) {
                    var i = e ? -1 : 1;
                    t.translate("center" === this.textAlign ? i * this.width / 2 : i * this.width, 0)
                }
            },
            _setTextStyles: function(t) {
                t.textBaseline = "alphabetic", this.skipTextAlign || (t.textAlign = this.textAlign), t.font = this._getFontDeclaration()
            },
            _getTextHeight: function() {
                return this._textLines.length * this._getHeightOfLine()
            },
            _getTextWidth: function(t) {
                for (var e = this._getLineWidth(t, 0), i = 1, r = this._textLines.length; r > i; i++) {
                    var n = this._getLineWidth(t, i);
                    n > e && (e = n)
                }
                return e
            },
            _renderChars: function(t, e, i, r, n) {
                var s = t.slice(0, -4);
                if (this[s].toLive) {
                    var o = -this.width / 2 + this[s].offsetX || 0,
                        a = -this.height / 2 + this[s].offsetY || 0;
                    e.save(), e.translate(o, a), r -= o, n -= a
                }
                e[t](i, r, n), this[s].toLive && e.restore()
            },
            _renderTextLine: function(t, e, i, r, n, s) {
                n -= this.fontSize * this._fontSizeFraction;
                var o = this._getLineWidth(e, s);
                if ("justify" !== this.textAlign || this.width < o) return void this._renderChars(t, e, i, r, n, s);
                for (var a, h = i.split(/\s+/), c = this._getWidthOfWords(e, i, s), l = this.width - c, u = h.length - 1, f = u > 0 ? l / u : 0, d = 0, g = 0, p = 0, v = h.length; v > p; p++) {
                    for (;
                        " " === i[g] && g < i.length;) g++;
                    a = h[p], this._renderChars(t, e, a, r + d, n, s, g), d += e.measureText(a).width + f, g += a.length
                }
            },
            _getWidthOfWords: function(t, e) {
                return t.measureText(e.replace(/\s+/g, "")).width
            },
            _getLeftOffset: function() {
                return -this.width / 2
            },
            _getTopOffset: function() {
                return -this.height / 2
            },
            _renderTextFill: function(t) {
                if (this.fill || this._skipFillStrokeCheck)
                    for (var e = 0, i = 0, r = this._textLines.length; r > i; i++) {
                        var n = this._getHeightOfLine(t, i),
                            s = n / this.lineHeight;
                        this._renderTextLine("fillText", t, this._textLines[i], this._getLeftOffset(), this._getTopOffset() + e + s, i), e += n
                    }
            },
            _renderTextStroke: function(t) {
                if (this.stroke && 0 !== this.strokeWidth || this._skipFillStrokeCheck) {
                    var e = 0;
                    this.shadow && !this.shadow.affectStroke && this._removeShadow(t), t.save(), this.strokeDashArray && (1 & this.strokeDashArray.length && this.strokeDashArray.push.apply(this.strokeDashArray, this.strokeDashArray), s && t.setLineDash(this.strokeDashArray)), t.beginPath();
                    for (var i = 0, r = this._textLines.length; r > i; i++) {
                        var n = this._getHeightOfLine(t, i),
                            o = n / this.lineHeight;
                        this._renderTextLine("strokeText", t, this._textLines[i], this._getLeftOffset(), this._getTopOffset() + e + o, i), e += n
                    }
                    t.closePath(), t.restore()
                }
            },
            _getHeightOfLine: function() {
                return this.fontSize * this._fontSizeMult * this.lineHeight
            },
            _renderTextBackground: function(t) {
                this._renderTextBoxBackground(t), this._renderTextLinesBackground(t)
            },
            _renderTextBoxBackground: function(t) {
                this.backgroundColor && (t.fillStyle = this.backgroundColor, t.fillRect(this._getLeftOffset(), this._getTopOffset(), this.width, this.height))
            },
            _renderTextLinesBackground: function(t) {
                if (this.textBackgroundColor) {
                    var e, i, r = 0,
                        n = this._getHeightOfLine();
                    t.fillStyle = this.textBackgroundColor;
                    for (var s = 0, o = this._textLines.length; o > s; s++) "" !== this._textLines[s] && (e = this._getLineWidth(t, s), i = this._getLineLeftOffset(e), t.fillRect(this._getLeftOffset() + i, this._getTopOffset() + r, e, this.fontSize * this._fontSizeMult)), r += n
                }
            },
            _getLineLeftOffset: function(t) {
                return "center" === this.textAlign ? (this.width - t) / 2 : "right" === this.textAlign ? this.width - t : 0
            },
            _clearCache: function() {
                this.__lineWidths = [], this.__lineHeights = []
            },
            _shouldClearCache: function() {
                var t = !1;
                if (this._forceClearCache) return this._forceClearCache = !1, !0;
                for (var e in this._dimensionAffectingProps) this["__" + e] !== this[e] && (this["__" + e] = this[e], t = !0);
                return t
            },
            _getLineWidth: function(t, e) {
                if (this.__lineWidths[e]) return this.__lineWidths[e];
                var i, r, n = this._textLines[e];
                return "" === n ? i = 0 : "justify" === this.textAlign && this._cacheLinesWidth ? (r = n.split(" "), i = r.length > 1 ? this.width : t.measureText(n).width) : i = t.measureText(n).width, this._cacheLinesWidth && (this.__lineWidths[e] = i), i
            },
            _renderTextDecoration: function(t) {
                function e(e) {
                    var n, s, o, a, h, c, l, u = 0;
                    for (n = 0, s = r._textLines.length; s > n; n++) {
                        for (h = r._getLineWidth(t, n), c = r._getLineLeftOffset(h), l = r._getHeightOfLine(t, n), o = 0, a = e.length; a > o; o++) t.fillRect(r._getLeftOffset() + c, u + (r._fontSizeMult - 1 + e[o]) * r.fontSize - i, h, r.fontSize / 15);
                        u += l
                    }
                }
                if (this.textDecoration) {
                    var i = this.height / 2,
                        r = this,
                        n = [];
                    this.textDecoration.indexOf("underline") > -1 && n.push(.85), this.textDecoration.indexOf("line-through") > -1 && n.push(.43), this.textDecoration.indexOf("overline") > -1 && n.push(-.12), n.length > 0 && e(n)
                }
            },
            _getFontDeclaration: function() {
                return [e.isLikelyNode ? this.fontWeight : this.fontStyle, e.isLikelyNode ? this.fontStyle : this.fontWeight, this.fontSize + "px", e.isLikelyNode ? '"' + this.fontFamily + '"' : this.fontFamily].join(" ")
            },
            render: function(t, e) {
                this.visible && (t.save(), this._setTextStyles(t), this._shouldClearCache() && this._initDimensions(t), e || this.transform(t), this.transformMatrix && t.transform.apply(t, this.transformMatrix), this.group && "path-group" === this.group.type && t.translate(this.left, this.top), this._render(t), t.restore())
            },
            _splitTextIntoLines: function() {
                return this.text.split(this._reNewline)
            },
            toObject: function(t) {
                var e = i(this.callSuper("toObject", t), {
                    text: this.text,
                    fontSize: this.fontSize,
                    fontWeight: this.fontWeight,
                    fontFamily: this.fontFamily,
                    fontStyle: this.fontStyle,
                    lineHeight: this.lineHeight,
                    textDecoration: this.textDecoration,
                    textAlign: this.textAlign,
                    textBackgroundColor: this.textBackgroundColor
                });
                return this.includeDefaultValues || this._removeDefaultValues(e), e
            },
            toSVG: function(t) {
                var e = this._createBaseSVGMarkup(),
                    i = this._getSVGLeftTopOffsets(this.ctx),
                    r = this._getSVGTextAndBg(i.textTop, i.textLeft);
                return this._wrapSVGTextAndBg(e, r), t ? t(e.join("")) : e.join("")
            },
            _getSVGLeftTopOffsets: function(t) {
                var e = this._getHeightOfLine(t, 0),
                    i = -this.width / 2,
                    r = 0;
                return {
                    textLeft: i + (this.group && "path-group" === this.group.type ? this.left : 0),
                    textTop: r + (this.group && "path-group" === this.group.type ? -this.top : 0),
                    lineTop: e
                }
            },
            _wrapSVGTextAndBg: function(t, e) {
                t.push('    <g transform="', this.getSvgTransform(), this.getSvgTransformMatrix(), '">\n', e.textBgRects.join(""), "        <text ", this.fontFamily ? 'font-family="' + this.fontFamily.replace(/"/g, "'") + '" ' : "", this.fontSize ? 'font-size="' + this.fontSize + '" ' : "", this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : "", this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : "", this.textDecoration ? 'text-decoration="' + this.textDecoration + '" ' : "", 'style="', this.getSvgStyles(), '" >', e.textSpans.join(""), "</text>\n", " </g>\n")
            },
            _getSVGTextAndBg: function(t, e) {
                var i = [],
                    r = [],
                    n = 0;
                this._setSVGBg(r);
                for (var s = 0, o = this._textLines.length; o > s; s++) this.textBackgroundColor && this._setSVGTextLineBg(r, s, e, t, n), this._setSVGTextLineText(s, i, n, e, t, r), n += this._getHeightOfLine(this.ctx, s);
                return {
                    textSpans: i,
                    textBgRects: r
                }
            },
            _setSVGTextLineText: function(t, i, r, s, a) {
                var h = this.fontSize * (this._fontSizeMult - this._fontSizeFraction) - a + r - this.height / 2;
                i.push('<tspan x="', n(s + this._getLineLeftOffset(this._getLineWidth(this.ctx, t)), o), '" ', 'y="', n(h, o), '" ', this._getFillAttributes(this.fill), ">", e.util.string.escapeXml(this._textLines[t]), "</tspan>")
            },
            _setSVGTextLineBg: function(t, e, i, r, s) {
                t.push("        <rect ", this._getFillAttributes(this.textBackgroundColor), ' x="', n(i + this._getLineLeftOffset(this._getLineWidth(this.ctx, e)), o), '" y="', n(s - this.height / 2, o), '" width="', n(this._getLineWidth(this.ctx, e), o), '" height="', n(this._getHeightOfLine(this.ctx, e) / this.lineHeight, o), '"></rect>\n')
            },
            _setSVGBg: function(t) {
                this.backgroundColor && t.push("        <rect ", this._getFillAttributes(this.backgroundColor), ' x="', n(-this.width / 2, o), '" y="', n(-this.height / 2, o), '" width="', n(this.width, o), '" height="', n(this.height, o), '"></rect>\n')
            },
            _getFillAttributes: function(t) {
                var i = t && "string" == typeof t ? new e.Color(t) : "";
                return i && i.getSource() && 1 !== i.getAlpha() ? 'opacity="' + i.getAlpha() + '" fill="' + i.setAlpha(1).toRgb() + '"' : 'fill="' + t + '"'
            },
            _set: function(t, e) {
                this.callSuper("_set", t, e), t in this._dimensionAffectingProps && (this._initDimensions(), this.setCoords())
            },
            complexity: function() {
                return 1
            }
        }), e.Text.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat("x y dx dy font-family font-style font-weight font-size text-decoration text-anchor".split(" ")), e.Text.DEFAULT_SVG_FONT_SIZE = 16, e.Text.fromElement = function(t, i) {
            if (!t) return null;
            var r = e.parseAttributes(t, e.Text.ATTRIBUTE_NAMES);
            i = e.util.object.extend(i ? e.util.object.clone(i) : {}, r), i.top = i.top || 0, i.left = i.left || 0, "dx" in r && (i.left += r.dx), "dy" in r && (i.top += r.dy), "fontSize" in i || (i.fontSize = e.Text.DEFAULT_SVG_FONT_SIZE), i.originX || (i.originX = "left");
            var n = t.textContent.replace(/^\s+|\s+$|\n+/g, "").replace(/\s+/g, " "),
                s = new e.Text(n, i),
                o = 0;
            return "left" === s.originX && (o = s.getWidth() / 2), "right" === s.originX && (o = -s.getWidth() / 2), s.set({
                left: s.getLeft() + o,
                top: s.getTop() - s.getHeight() / 2 + s.fontSize * (.18 + s._fontSizeFraction)
            }), s
        }, e.Text.fromObject = function(t) {
            return new e.Text(t.text, r(t))
        }, e.util.createAccessors(e.Text)
    }("undefined" != typeof exports ? exports : this),
    function() {
        var t = fabric.util.object.clone;
        fabric.IText = fabric.util.createClass(fabric.Text, fabric.Observable, {
            type: "i-text",
            selectionStart: 0,
            selectionEnd: 0,
            selectionColor: "rgba(17,119,255,0.3)",
            isEditing: !1,
            editable: !0,
            editingBorderColor: "rgba(102,153,255,0.25)",
            cursorWidth: 2,
            cursorColor: "#333",
            cursorDelay: 1e3,
            cursorDuration: 600,
            styles: null,
            caching: !0,
            _skipFillStrokeCheck: !1,
            _reSpace: /\s|\n/,
            _currentCursorOpacity: 0,
            _selectionDirection: null,
            _abortCursorAnimation: !1,
            _charWidthsCache: {},
            initialize: function(t, e) {
                this.styles = e ? e.styles || {} : {}, this.callSuper("initialize", t, e), this.initBehavior()
            },
            _clearCache: function() {
                this.callSuper("_clearCache"), this.__maxFontHeights = [], this.__widthOfSpace = []
            },
            isEmptyStyles: function() {
                if (!this.styles) return !0;
                var t = this.styles;
                for (var e in t)
                    for (var i in t[e])
                        for (var r in t[e][i]) return !1;
                return !0
            },
            setSelectionStart: function(t) {
                t = Math.max(t, 0), this.selectionStart !== t && (this.fire("selection:changed"), this.canvas && this.canvas.fire("text:selection:changed", {
                    target: this
                }), this.selectionStart = t), this._updateTextarea()
            },
            setSelectionEnd: function(t) {
                t = Math.min(t, this.text.length), this.selectionEnd !== t && (this.fire("selection:changed"), this.canvas && this.canvas.fire("text:selection:changed", {
                    target: this
                }), this.selectionEnd = t), this._updateTextarea()
            },
            getSelectionStyles: function(t, e) {
                if (2 === arguments.length) {
                    for (var i = [], r = t; e > r; r++) i.push(this.getSelectionStyles(r));
                    return i
                }
                var n = this.get2DCursorLocation(t),
                    s = this._getStyleDeclaration(n.lineIndex, n.charIndex);
                return s || {}
            },
            setSelectionStyles: function(t) {
                if (this.selectionStart === this.selectionEnd) this._extendStyles(this.selectionStart, t);
                else
                    for (var e = this.selectionStart; e < this.selectionEnd; e++) this._extendStyles(e, t);
                return this._forceClearCache = !0, this
            },
            _extendStyles: function(t, e) {
                var i = this.get2DCursorLocation(t);
                this._getLineStyle(i.lineIndex) || this._setLineStyle(i.lineIndex, {}), this._getStyleDeclaration(i.lineIndex, i.charIndex) || this._setStyleDeclaration(i.lineIndex, i.charIndex, {}), fabric.util.object.extend(this._getStyleDeclaration(i.lineIndex, i.charIndex), e)
            },
            _render: function(t) {
                this.callSuper("_render", t), this.ctx = t, this.isEditing && this.renderCursorOrSelection()
            },
            renderCursorOrSelection: function() {
                if (this.active) {
                    var t, e, i = this.text.split("");
                    this.canvas.contextTop ? (e = this.canvas.contextTop, e.save(), e.transform.apply(e, this.canvas.viewportTransform), this.transform(e), this.transformMatrix && e.transform.apply(e, this.transformMatrix)) : (e = this.ctx, e.save()), this.selectionStart === this.selectionEnd ? (t = this._getCursorBoundaries(i, "cursor"), this.renderCursor(t, e)) : (t = this._getCursorBoundaries(i, "selection"), this.renderSelection(i, t, e)), e.restore()
                }
            },
            get2DCursorLocation: function(t) {
                "undefined" == typeof t && (t = this.selectionStart);
                for (var e = this._textLines.length, i = 0; e > i; i++) {
                    if (t <= this._textLines[i].length) return {
                        lineIndex: i,
                        charIndex: t
                    };
                    t -= this._textLines[i].length + 1
                }
                return {
                    lineIndex: i - 1,
                    charIndex: this._textLines[i - 1].length < t ? this._textLines[i - 1].length : t
                }
            },
            getCurrentCharStyle: function(t, e) {
                var i = this._getStyleDeclaration(t, 0 === e ? 0 : e - 1);
                return {
                    fontSize: i && i.fontSize || this.fontSize,
                    fill: i && i.fill || this.fill,
                    textBackgroundColor: i && i.textBackgroundColor || this.textBackgroundColor,
                    textDecoration: i && i.textDecoration || this.textDecoration,
                    fontFamily: i && i.fontFamily || this.fontFamily,
                    fontWeight: i && i.fontWeight || this.fontWeight,
                    fontStyle: i && i.fontStyle || this.fontStyle,
                    stroke: i && i.stroke || this.stroke,
                    strokeWidth: i && i.strokeWidth || this.strokeWidth
                }
            },
            getCurrentCharFontSize: function(t, e) {
                var i = this._getStyleDeclaration(t, 0 === e ? 0 : e - 1);
                return i && i.fontSize ? i.fontSize : this.fontSize
            },
            getCurrentCharColor: function(t, e) {
                var i = this._getStyleDeclaration(t, 0 === e ? 0 : e - 1);
                return i && i.fill ? i.fill : this.cursorColor
            },
            _getCursorBoundaries: function(t, e) {
                var i = Math.round(this._getLeftOffset()),
                    r = this._getTopOffset(),
                    n = this._getCursorBoundariesOffsets(t, e);
                return {
                    left: i,
                    top: r,
                    leftOffset: n.left + n.lineLeft,
                    topOffset: n.top
                }
            },
            _getCursorBoundariesOffsets: function(t, e) {
                for (var i = 0, r = 0, n = 0, s = 0, o = 0, a = 0; a < this.selectionStart; a++) "\n" === t[a] ? (o = 0, s += this._getHeightOfLine(this.ctx, r), r++, n = 0) : (o += this._getWidthOfChar(this.ctx, t[a], r, n), n++), i = this._getLineLeftOffset(this._getLineWidth(this.ctx, r));
                return "cursor" === e && (s += (1 - this._fontSizeFraction) * this._getHeightOfLine(this.ctx, r) / this.lineHeight - this.getCurrentCharFontSize(r, n) * (1 - this._fontSizeFraction)), {
                    top: s,
                    left: o,
                    lineLeft: i
                }
            },
            renderCursor: function(t, e) {
                var i = this.get2DCursorLocation(),
                    r = i.lineIndex,
                    n = i.charIndex,
                    s = this.getCurrentCharFontSize(r, n),
                    o = 0 === r && 0 === n ? this._getLineLeftOffset(this._getLineWidth(e, r)) : t.leftOffset;
                e.fillStyle = this.getCurrentCharColor(r, n), e.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity, e.fillRect(t.left + o, t.top + t.topOffset, this.cursorWidth / this.scaleX, s)
            },
            renderSelection: function(t, e, i) {
                i.fillStyle = this.selectionColor;
                for (var r = this.get2DCursorLocation(this.selectionStart), n = this.get2DCursorLocation(this.selectionEnd), s = r.lineIndex, o = n.lineIndex, a = s; o >= a; a++) {
                    var h = this._getLineLeftOffset(this._getLineWidth(i, a)) || 0,
                        c = this._getHeightOfLine(this.ctx, a),
                        l = 0,
                        u = this._textLines[a];
                    if (a === s)
                        for (var f = 0, d = u.length; d > f; f++) f >= r.charIndex && (a !== o || f < n.charIndex) && (l += this._getWidthOfChar(i, u[f], a, f)), f < r.charIndex && (h += this._getWidthOfChar(i, u[f], a, f));
                    else if (a > s && o > a) l += this._getLineWidth(i, a) || 5;
                    else if (a === o)
                        for (var g = 0, p = n.charIndex; p > g; g++) l += this._getWidthOfChar(i, u[g], a, g);
                    i.fillRect(e.left + h, e.top + e.topOffset, l, c), e.topOffset += c
                }
            },
            _renderChars: function(t, e, i, r, n, s, o) {
                if (this.isEmptyStyles()) return this._renderCharsFast(t, e, i, r, n);
                o = o || 0, this.skipTextAlign = !0, r -= "center" === this.textAlign ? this.width / 2 : "right" === this.textAlign ? this.width : 0;
                var a, h, c = this._getHeightOfLine(e, s),
                    l = this._getLineLeftOffset(this._getLineWidth(e, s)),
                    u = "";
                r += l || 0, e.save(), n -= c / this.lineHeight * this._fontSizeFraction;
                for (var f = o, d = i.length + o; d >= f; f++) a = a || this.getCurrentCharStyle(s, f), h = this.getCurrentCharStyle(s, f + 1), (this._hasStyleChanged(a, h) || f === d) && (this._renderChar(t, e, s, f - 1, u, r, n, c), u = "", a = h), u += i[f - o];
                e.restore()
            },
            _renderCharsFast: function(t, e, i, r, n) {
                this.skipTextAlign = !1, "fillText" === t && this.fill && this.callSuper("_renderChars", t, e, i, r, n), "strokeText" === t && (this.stroke && this.strokeWidth > 0 || this.skipFillStrokeCheck) && this.callSuper("_renderChars", t, e, i, r, n)
            },
            _renderChar: function(t, e, i, r, n, s, o, a) {
                var h, c, l = this._getStyleDeclaration(i, r),
                    u = this._fontSizeFraction * a / this.lineHeight;
                if (l) {
                    var f = l.stroke || this.stroke,
                        d = l.fill || this.fill;
                    e.save(), h = this._applyCharStylesGetWidth(e, n, i, r, l), c = this._getHeightOfChar(e, n, i, r), d && e.fillText(n, s, o), f && e.strokeText(n, s, o), this._renderCharDecoration(e, l, s, o, u, h, c), e.restore()
                } else "strokeText" === t && this.stroke && e[t](n, s, o), "fillText" === t && this.fill && e[t](n, s, o), h = this._applyCharStylesGetWidth(e, n, i, r), this._renderCharDecoration(e, null, s, o, u, h, this.fontSize);
                e.translate(h, 0)
            },
            _hasStyleChanged: function(t, e) {
                return t.fill !== e.fill || t.fontSize !== e.fontSize || t.textBackgroundColor !== e.textBackgroundColor || t.textDecoration !== e.textDecoration || t.fontFamily !== e.fontFamily || t.fontWeight !== e.fontWeight || t.fontStyle !== e.fontStyle || t.stroke !== e.stroke || t.strokeWidth !== e.strokeWidth
            },
            _renderCharDecoration: function(t, e, i, r, n, s, o) {
                var a = e ? e.textDecoration || this.textDecoration : this.textDecoration;
                a && (a.indexOf("underline") > -1 && t.fillRect(i, r + o / 10, s, o / 15), a.indexOf("line-through") > -1 && t.fillRect(i, r - o * (this._fontSizeFraction + this._fontSizeMult - 1) + o / 15, s, o / 15), a.indexOf("overline") > -1 && t.fillRect(i, r - (this._fontSizeMult - this._fontSizeFraction) * o, s, o / 15))
            },
            _renderTextLine: function(t, e, i, r, n, s) {
                this.isEmptyStyles() || (n += this.fontSize * (this._fontSizeFraction + .03)), this.callSuper("_renderTextLine", t, e, i, r, n, s)
            },
            _renderTextDecoration: function(t) {
                return this.isEmptyStyles() ? this.callSuper("_renderTextDecoration", t) : void 0
            },
            _renderTextLinesBackground: function(t) {
                if (this.textBackgroundColor || this.styles) {
                    t.save(), this.textBackgroundColor && (t.fillStyle = this.textBackgroundColor);
                    for (var e = 0, i = 0, r = this._textLines.length; r > i; i++) {
                        var n = this._getHeightOfLine(t, i);
                        if ("" !== this._textLines[i]) {
                            var s = this._getLineWidth(t, i),
                                o = this._getLineLeftOffset(s);
                            if (this.textBackgroundColor && (t.fillStyle = this.textBackgroundColor, t.fillRect(this._getLeftOffset() + o, this._getTopOffset() + e, s, n / this.lineHeight)), this._getLineStyle(i))
                                for (var a = 0, h = this._textLines[i].length; h > a; a++) {
                                    var c = this._getStyleDeclaration(i, a);
                                    if (c && c.textBackgroundColor) {
                                        var l = this._textLines[i][a];
                                        t.fillStyle = c.textBackgroundColor, t.fillRect(this._getLeftOffset() + o + this._getWidthOfCharsAt(t, i, a), this._getTopOffset() + e, this._getWidthOfChar(t, l, i, a) + 1, n / this.lineHeight)
                                    }
                                }
                            e += n
                        } else e += n
                    }
                    t.restore()
                }
            },
            _getCacheProp: function(t, e) {
                return t + e.fontFamily + e.fontSize + e.fontWeight + e.fontStyle + e.shadow
            },
            _applyCharStylesGetWidth: function(t, e, i, r, n) {
                var s = n || this._getStyleDeclaration(i, r, !0);
                this._applyFontStyles(s);
                var o = this._getCacheProp(e, s);
                if (this.isEmptyStyles() && this._charWidthsCache[o] && this.caching) return this._charWidthsCache[o];
                "string" == typeof s.shadow && (s.shadow = new fabric.Shadow(s.shadow));
                var a = s.fill || this.fill;
                return t.fillStyle = a.toLive ? a.toLive(t, this) : a, s.stroke && (t.strokeStyle = s.stroke && s.stroke.toLive ? s.stroke.toLive(t, this) : s.stroke), t.lineWidth = s.strokeWidth || this.strokeWidth, t.font = this._getFontDeclaration.call(s), this._setShadow.call(s, t), this.caching ? (this._charWidthsCache[o] || (this._charWidthsCache[o] = t.measureText(e).width), this._charWidthsCache[o]) : t.measureText(e).width
            },
            _applyFontStyles: function(t) {
                t.fontFamily || (t.fontFamily = this.fontFamily), t.fontSize || (t.fontSize = this.fontSize), t.fontWeight || (t.fontWeight = this.fontWeight), t.fontStyle || (t.fontStyle = this.fontStyle)
            },
            _getStyleDeclaration: function(e, i, r) {
                return r ? this.styles[e] && this.styles[e][i] ? t(this.styles[e][i]) : {} : this.styles[e] && this.styles[e][i] ? this.styles[e][i] : null
            },
            _setStyleDeclaration: function(t, e, i) {
                this.styles[t][e] = i
            },
            _deleteStyleDeclaration: function(t, e) {
                delete this.styles[t][e]
            },
            _getLineStyle: function(t) {
                return this.styles[t]
            },
            _setLineStyle: function(t, e) {
                this.styles[t] = e
            },
            _deleteLineStyle: function(t) {
                delete this.styles[t]
            },
            _getWidthOfChar: function(t, e, i, r) {
                if ("justify" === this.textAlign && this._reSpacesAndTabs.test(e)) return this._getWidthOfSpace(t, i);
                var n = this._getStyleDeclaration(i, r, !0);
                this._applyFontStyles(n);
                var s = this._getCacheProp(e, n);
                if (this._charWidthsCache[s] && this.caching) return this._charWidthsCache[s];
                if (t) {
                    t.save();
                    var o = this._applyCharStylesGetWidth(t, e, i, r);
                    return t.restore(), o
                }
            },
            _getHeightOfChar: function(t, e, i, r) {
                var n = this._getStyleDeclaration(i, r);
                return n && n.fontSize ? n.fontSize : this.fontSize
            },
            _getHeightOfCharAt: function(t, e, i) {
                var r = this._textLines[e][i];
                return this._getHeightOfChar(t, r, e, i)
            },
            _getWidthOfCharsAt: function(t, e, i) {
                var r, n, s = 0;
                for (r = 0; i > r; r++) n = this._textLines[e][r], s += this._getWidthOfChar(t, n, e, r);
                return s
            },
            _getLineWidth: function(t, e) {
                return this.__lineWidths[e] ? this.__lineWidths[e] : (this.__lineWidths[e] = this._getWidthOfCharsAt(t, e, this._textLines[e].length), this.__lineWidths[e])
            },
            _getWidthOfSpace: function(t, e) {
                if (this.__widthOfSpace[e]) return this.__widthOfSpace[e];
                var i = this._textLines[e],
                    r = this._getWidthOfWords(t, i, e),
                    n = this.width - r,
                    s = i.length - i.replace(this._reSpacesAndTabs, "").length,
                    o = n / s;
                return this.__widthOfSpace[e] = o, o
            },
            _getWidthOfWords: function(t, e, i) {
                for (var r = 0, n = 0; n < e.length; n++) {
                    var s = e[n];
                    s.match(/\s/) || (r += this._getWidthOfChar(t, s, i, n))
                }
                return r
            },
            _getHeightOfLine: function(t, e) {
                if (this.__lineHeights[e]) return this.__lineHeights[e];
                for (var i = this._textLines[e], r = this._getHeightOfChar(t, i[0], e, 0), n = 1, s = i.length; s > n; n++) {
                    var o = this._getHeightOfChar(t, i[n], e, n);
                    o > r && (r = o)
                }
                return this.__maxFontHeights[e] = r, this.__lineHeights[e] = r * this.lineHeight * this._fontSizeMult, this.__lineHeights[e]
            },
            _getTextHeight: function(t) {
                for (var e = 0, i = 0, r = this._textLines.length; r > i; i++) e += this._getHeightOfLine(t, i);
                return e
            },
            _renderTextBoxBackground: function(t) {
                this.backgroundColor && (t.save(), t.fillStyle = this.backgroundColor, t.fillRect(this._getLeftOffset(), this._getTopOffset(), this.width, this.height), t.restore())
            },
            toObject: function(e) {
                var i, r, n, s = {};
                for (i in this.styles) {
                    n = this.styles[i], s[i] = {};
                    for (r in n) s[i][r] = t(n[r])
                }
                return fabric.util.object.extend(this.callSuper("toObject", e), {
                    styles: s
                })
            }
        }), fabric.IText.fromObject = function(e) {
            return new fabric.IText(e.text, t(e))
        }
    }(),
    function() {
        var t = fabric.util.object.clone;
        fabric.util.object.extend(fabric.IText.prototype, {
            initBehavior: function() {
                this.initAddedHandler(), this.initRemovedHandler(), this.initCursorSelectionHandlers(), this.initDoubleClickSimulation()
            },
            initSelectedHandler: function() {
                this.on("selected", function() {
                    var t = this;
                    setTimeout(function() {
                        t.selected = !0
                    }, 100)
                })
            },
            initAddedHandler: function() {
                var t = this;
                this.on("added", function() {
                    this.canvas && !this.canvas._hasITextHandlers && (this.canvas._hasITextHandlers = !0, this._initCanvasHandlers()), t.canvas && (t.canvas._iTextInstances = t.canvas._iTextInstances || [], t.canvas._iTextInstances.push(t))
                })
            },
            initRemovedHandler: function() {
                var t = this;
                this.on("removed", function() {
                    t.canvas && (t.canvas._iTextInstances = t.canvas._iTextInstances || [], fabric.util.removeFromArray(t.canvas._iTextInstances, t))
                })
            },
            _initCanvasHandlers: function() {
                var t = this;
                this.canvas.on("selection:cleared", function() {
                    fabric.IText.prototype.exitEditingOnOthers(t.canvas)
                }), this.canvas.on("mouse:up", function() {
                    t.canvas._iTextInstances && t.canvas._iTextInstances.forEach(function(t) {
                        t.__isMousedown = !1
                    })
                }), this.canvas.on("object:selected", function() {
                    fabric.IText.prototype.exitEditingOnOthers(t.canvas)
                })
            },
            _tick: function() {
                this._currentTickState = this._animateCursor(this, 1, this.cursorDuration, "_onTickComplete")
            },
            _animateCursor: function(t, e, i, r) {
                var n;
                return n = {
                    isAborted: !1,
                    abort: function() {
                        this.isAborted = !0
                    }
                }, t.animate("_currentCursorOpacity", e, {
                    duration: i,
                    onComplete: function() {
                        n.isAborted || t[r]()
                    },
                    onChange: function() {
                        t.canvas && (t.canvas.clearContext(t.canvas.contextTop || t.ctx), t.renderCursorOrSelection())
                    },
                    abort: function() {
                        return n.isAborted
                    }
                }), n
            },
            _onTickComplete: function() {
                var t = this;
                this._cursorTimeout1 && clearTimeout(this._cursorTimeout1), this._cursorTimeout1 = setTimeout(function() {
                    t._currentTickCompleteState = t._animateCursor(t, 0, this.cursorDuration / 2, "_tick")
                }, 100)
            },
            initDelayedCursor: function(t) {
                var e = this,
                    i = t ? 0 : this.cursorDelay;
                this._currentTickState && this._currentTickState.abort(), this._currentTickCompleteState && this._currentTickCompleteState.abort(), clearTimeout(this._cursorTimeout1), this._currentCursorOpacity = 1, this.canvas && (this.canvas.clearContext(this.canvas.contextTop || this.ctx), this.renderCursorOrSelection()), this._cursorTimeout2 && clearTimeout(this._cursorTimeout2), this._cursorTimeout2 = setTimeout(function() {
                    e._tick()
                }, i)
            },
            abortCursorAnimation: function() {
                this._currentTickState && this._currentTickState.abort(), this._currentTickCompleteState && this._currentTickCompleteState.abort(), clearTimeout(this._cursorTimeout1), clearTimeout(this._cursorTimeout2), this._currentCursorOpacity = 0, this.canvas && this.canvas.clearContext(this.canvas.contextTop || this.ctx)
            },
            selectAll: function() {
                this.setSelectionStart(0), this.setSelectionEnd(this.text.length)
            },
            getSelectedText: function() {
                return this.text.slice(this.selectionStart, this.selectionEnd)
            },
            findWordBoundaryLeft: function(t) {
                var e = 0,
                    i = t - 1;
                if (this._reSpace.test(this.text.charAt(i)))
                    for (; this._reSpace.test(this.text.charAt(i));) e++, i--;
                for (;
                    /\S/.test(this.text.charAt(i)) && i > -1;) e++, i--;
                return t - e
            },
            findWordBoundaryRight: function(t) {
                var e = 0,
                    i = t;
                if (this._reSpace.test(this.text.charAt(i)))
                    for (; this._reSpace.test(this.text.charAt(i));) e++, i++;
                for (;
                    /\S/.test(this.text.charAt(i)) && i < this.text.length;) e++, i++;
                return t + e
            },
            findLineBoundaryLeft: function(t) {
                for (var e = 0, i = t - 1; !/\n/.test(this.text.charAt(i)) && i > -1;) e++, i--;
                return t - e
            },
            findLineBoundaryRight: function(t) {
                for (var e = 0, i = t; !/\n/.test(this.text.charAt(i)) && i < this.text.length;) e++, i++;
                return t + e
            },
            getNumNewLinesInSelectedText: function() {
                for (var t = this.getSelectedText(), e = 0, i = 0, r = t.length; r > i; i++) "\n" === t[i] && e++;
                return e
            },
            searchWordBoundary: function(t, e) {
                for (var i = this._reSpace.test(this.text.charAt(t)) ? t - 1 : t, r = this.text.charAt(i), n = /[ \n\.,;!\?\-]/; !n.test(r) && i > 0 && i < this.text.length;) i += e, r = this.text.charAt(i);
                return n.test(r) && "\n" !== r && (i += 1 === e ? 0 : 1), i
            },
            selectWord: function(t) {
                var e = this.searchWordBoundary(t, -1),
                    i = this.searchWordBoundary(t, 1);
                this.setSelectionStart(e), this.setSelectionEnd(i)
            },
            selectLine: function(t) {
                var e = this.findLineBoundaryLeft(t),
                    i = this.findLineBoundaryRight(t);
                this.setSelectionStart(e), this.setSelectionEnd(i)
            },
            enterEditing: function() {
                return !this.isEditing && this.editable ? (this.canvas && this.exitEditingOnOthers(this.canvas), this.isEditing = !0, this.initHiddenTextarea(), this.hiddenTextarea.focus(), this._updateTextarea(), this._saveEditingProps(), this._setEditingProps(), this._tick(), this.fire("editing:entered"), this.canvas ? (this.canvas.renderAll(), this.canvas.fire("text:editing:entered", {
                    target: this
                }), this.initMouseMoveHandler(), this) : this) : void 0
            },
            exitEditingOnOthers: function(t) {
                t._iTextInstances && t._iTextInstances.forEach(function(t) {
                    t.selected = !1, t.isEditing && t.exitEditing()
                })
            },
            initMouseMoveHandler: function() {
                var t = this;
                this.canvas.on("mouse:move", function(e) {
                    if (t.__isMousedown && t.isEditing) {
                        var i = t.getSelectionStartFromPointer(e.e);
                        i >= t.__selectionStartOnMouseDown ? (t.setSelectionStart(t.__selectionStartOnMouseDown), t.setSelectionEnd(i)) : (t.setSelectionStart(i), t.setSelectionEnd(t.__selectionStartOnMouseDown))
                    }
                })
            },
            _setEditingProps: function() {
                this.hoverCursor = "text", this.canvas && (this.canvas.defaultCursor = this.canvas.moveCursor = "text"), this.borderColor = this.editingBorderColor, this.hasControls = this.selectable = !1, this.lockMovementX = this.lockMovementY = !0
            },
            _updateTextarea: function() {
                this.hiddenTextarea && (this.hiddenTextarea.value = this.text, this.hiddenTextarea.selectionStart = this.selectionStart, this.hiddenTextarea.selectionEnd = this.selectionEnd)
            },
            _saveEditingProps: function() {
                this._savedProps = {
                    hasControls: this.hasControls,
                    borderColor: this.borderColor,
                    lockMovementX: this.lockMovementX,
                    lockMovementY: this.lockMovementY,
                    hoverCursor: this.hoverCursor,
                    defaultCursor: this.canvas && this.canvas.defaultCursor,
                    moveCursor: this.canvas && this.canvas.moveCursor
                }
            },
            _restoreEditingProps: function() {
                this._savedProps && (this.hoverCursor = this._savedProps.overCursor, this.hasControls = this._savedProps.hasControls, this.borderColor = this._savedProps.borderColor, this.lockMovementX = this._savedProps.lockMovementX, this.lockMovementY = this._savedProps.lockMovementY, this.canvas && (this.canvas.defaultCursor = this._savedProps.defaultCursor, this.canvas.moveCursor = this._savedProps.moveCursor))
            },
            exitEditing: function() {
                return this.selected = !1, this.isEditing = !1, this.selectable = !0, this.selectionEnd = this.selectionStart, this.hiddenTextarea && this.canvas && this.hiddenTextarea.parentNode.removeChild(this.hiddenTextarea), this.hiddenTextarea = null, this.abortCursorAnimation(), this._restoreEditingProps(), this._currentCursorOpacity = 0, this.fire("editing:exited"), this.canvas && this.canvas.fire("text:editing:exited", {
                    target: this
                }), this
            },
            _removeExtraneousStyles: function() {
                for (var t in this.styles) this._textLines[t] || delete this.styles[t]
            },
            _removeCharsFromTo: function(t, e) {
                for (; e !== t;) this._removeSingleCharAndStyle(t + 1), e--;
                this.setSelectionStart(t)
            },
            _removeSingleCharAndStyle: function(t) {
                var e = "\n" === this.text[t - 1],
                    i = e ? t : t - 1;
                this.removeStyleObject(e, i), this.text = this.text.slice(0, t - 1) + this.text.slice(t), this._textLines = this._splitTextIntoLines()
            },
            insertChars: function(t, e) {
                var i;
                this.selectionEnd - this.selectionStart > 1 && (this._removeCharsFromTo(this.selectionStart, this.selectionEnd), this.setSelectionEnd(this.selectionStart));
                for (var r = 0, n = t.length; n > r; r++) e && (i = fabric.copiedTextStyle[r]), this.insertChar(t[r], n - 1 > r, i)
            },
            insertChar: function(t, e, i) {
                var r = "\n" === this.text[this.selectionStart];
                this.text = this.text.slice(0, this.selectionStart) + t + this.text.slice(this.selectionEnd), this._textLines = this._splitTextIntoLines(), this.insertStyleObjects(t, r, i), this.selectionStart += 1, this.selectionEnd = this.selectionStart, e || (this._updateTextarea(), this.canvas && this.canvas.renderAll(), this.setCoords(), this.fire("changed"), this.canvas && this.canvas.fire("text:changed", {
                    target: this
                }))
            },
            insertNewlineStyleObject: function(e, i, r) {
                this.shiftLineStyles(e, 1), this.styles[e + 1] || (this.styles[e + 1] = {});
                var n = {},
                    s = {};
                if (this.styles[e] && this.styles[e][i - 1] && (n = this.styles[e][i - 1]), r) s[0] = t(n), this.styles[e + 1] = s;
                else {
                    for (var o in this.styles[e]) parseInt(o, 10) >= i && (s[parseInt(o, 10) - i] = this.styles[e][o], delete this.styles[e][o]);
                    this.styles[e + 1] = s
                }
                this._forceClearCache = !0
            },
            insertCharStyleObject: function(e, i, r) {
                var n = this.styles[e],
                    s = t(n);
                0 !== i || r || (i = 1);
                for (var o in s) {
                    var a = parseInt(o, 10);
                    a >= i && (n[a + 1] = s[a], s[a - 1] || delete n[a])
                }
                this.styles[e][i] = r || t(n[i - 1]), this._forceClearCache = !0
            },
            insertStyleObjects: function(t, e, i) {
                var r = this.get2DCursorLocation(),
                    n = r.lineIndex,
                    s = r.charIndex;
                this._getLineStyle(n) || this._setLineStyle(n, {}), "\n" === t ? this.insertNewlineStyleObject(n, s, e) : this.insertCharStyleObject(n, s, i)
            },
            shiftLineStyles: function(e, i) {
                var r = t(this.styles);
                for (var n in this.styles) {
                    var s = parseInt(n, 10);
                    s > e && (this.styles[s + i] = r[s], r[s - i] || delete this.styles[s])
                }
            },
            removeStyleObject: function(e, i) {
                var r = this.get2DCursorLocation(i),
                    n = r.lineIndex,
                    s = r.charIndex;
                if (e) {
                    var o = this._textLines[n - 1],
                        a = o ? o.length : 0;
                    this.styles[n - 1] || (this.styles[n - 1] = {});
                    for (s in this.styles[n]) this.styles[n - 1][parseInt(s, 10) + a] = this.styles[n][s];
                    this.shiftLineStyles(n, -1)
                } else {
                    var h = this.styles[n];
                    h && delete h[s];
                    var c = t(h);
                    for (var l in c) {
                        var u = parseInt(l, 10);
                        u >= s && 0 !== u && (h[u - 1] = c[u], delete h[u])
                    }
                }
            },
            insertNewline: function() {
                this.insertChars("\n")
            }
        })
    }(), fabric.util.object.extend(fabric.IText.prototype, {
        initDoubleClickSimulation: function() {
            this.__lastClickTime = +new Date, this.__lastLastClickTime = +new Date, this.__lastPointer = {}, this.on("mousedown", this.onMouseDown.bind(this))
        },
        onMouseDown: function(t) {
            this.__newClickTime = +new Date;
            var e = this.canvas.getPointer(t.e);
            this.isTripleClick(e) ? (this.fire("tripleclick", t), this._stopEvent(t.e)) : this.isDoubleClick(e) && (this.fire("dblclick", t), this._stopEvent(t.e)), this.__lastLastClickTime = this.__lastClickTime, this.__lastClickTime = this.__newClickTime, this.__lastPointer = e, this.__lastIsEditing = this.isEditing, this.__lastSelected = this.selected
        },
        isDoubleClick: function(t) {
            return this.__newClickTime - this.__lastClickTime < 500 && this.__lastPointer.x === t.x && this.__lastPointer.y === t.y && this.__lastIsEditing
        },
        isTripleClick: function(t) {
            return this.__newClickTime - this.__lastClickTime < 500 && this.__lastClickTime - this.__lastLastClickTime < 500 && this.__lastPointer.x === t.x && this.__lastPointer.y === t.y
        },
        _stopEvent: function(t) {
            t.preventDefault && t.preventDefault(), t.stopPropagation && t.stopPropagation()
        },
        initCursorSelectionHandlers: function() {
            this.initSelectedHandler(), this.initMousedownHandler(), this.initMouseupHandler(), this.initClicks()
        },
        initClicks: function() {
            this.on("dblclick", function(t) {
                this.selectWord(this.getSelectionStartFromPointer(t.e))
            }), this.on("tripleclick", function(t) {
                this.selectLine(this.getSelectionStartFromPointer(t.e))
            })
        },
        initMousedownHandler: function() {
            this.on("mousedown", function(t) {
                var e = this.canvas.getPointer(t.e);
                this.__mousedownX = e.x, this.__mousedownY = e.y, this.__isMousedown = !0, this.hiddenTextarea && this.canvas && this.canvas.wrapperEl.appendChild(this.hiddenTextarea), this.selected && this.setCursorByClick(t.e), this.isEditing && (this.__selectionStartOnMouseDown = this.selectionStart, this.initDelayedCursor(!0))
            })
        },
        _isObjectMoved: function(t) {
            var e = this.canvas.getPointer(t);
            return this.__mousedownX !== e.x || this.__mousedownY !== e.y
        },
        initMouseupHandler: function() {
            this.on("mouseup", function(t) {
                this.__isMousedown = !1, this._isObjectMoved(t.e) || (this.__lastSelected && !this.__corner && (this.enterEditing(), this.initDelayedCursor(!0)), this.selected = !0)
            })
        },
        setCursorByClick: function(t) {
            var e = this.getSelectionStartFromPointer(t);
            t.shiftKey ? e < this.selectionStart ? (this.setSelectionEnd(this.selectionStart), this.setSelectionStart(e)) : this.setSelectionEnd(e) : (this.setSelectionStart(e), this.setSelectionEnd(e))
        },
        getSelectionStartFromPointer: function(t) {
            for (var e, i, r = this.getLocalPointer(t), n = 0, s = 0, o = 0, a = 0, h = 0, c = this._textLines.length; c > h; h++) {
                i = this._textLines[h], o += this._getHeightOfLine(this.ctx, h) * this.scaleY;
                var l = this._getLineWidth(this.ctx, h),
                    u = this._getLineLeftOffset(l);
                s = u * this.scaleX, this.flipX && (this._textLines[h] = i.reverse().join(""));
                for (var f = 0, d = i.length; d > f; f++) {
                    if (n = s, s += this._getWidthOfChar(this.ctx, i[f], h, this.flipX ? d - f : f) * this.scaleX, !(o <= r.y || s <= r.x)) return this._getNewSelectionStartFromOffset(r, n, s, a + h, d);
                    a++
                }
                if (r.y < o) return this._getNewSelectionStartFromOffset(r, n, s, a + h - 1, d)
            }
            return "undefined" == typeof e ? this.text.length : void 0
        },
        _getNewSelectionStartFromOffset: function(t, e, i, r, n) {
            var s = t.x - e,
                o = i - t.x,
                a = o > s ? 0 : 1,
                h = r + a;
            return this.flipX && (h = n - h), h > this.text.length && (h = this.text.length), h
        }
    }), fabric.util.object.extend(fabric.IText.prototype, {
        initHiddenTextarea: function() {
            this.hiddenTextarea = fabric.document.createElement("textarea"), this.hiddenTextarea.setAttribute("autocapitalize", "off"), this.hiddenTextarea.style.cssText = "position: fixed; bottom: 20px; left: 0px; opacity: 0; width: 0px; height: 0px; z-index: -999;", fabric.document.body.appendChild(this.hiddenTextarea), fabric.util.addListener(this.hiddenTextarea, "keydown", this.onKeyDown.bind(this)), fabric.util.addListener(this.hiddenTextarea, "input", this.onInput.bind(this)), fabric.util.addListener(this.hiddenTextarea, "copy", this.copy.bind(this)), fabric.util.addListener(this.hiddenTextarea, "paste", this.paste.bind(this)), !this._clickHandlerInitialized && this.canvas && (fabric.util.addListener(this.canvas.upperCanvasEl, "click", this.onClick.bind(this)), this._clickHandlerInitialized = !0)
        },
        _keysMap: {
            8: "removeChars",
            9: "exitEditing",
            27: "exitEditing",
            13: "insertNewline",
            33: "moveCursorUp",
            34: "moveCursorDown",
            35: "moveCursorRight",
            36: "moveCursorLeft",
            37: "moveCursorLeft",
            38: "moveCursorUp",
            39: "moveCursorRight",
            40: "moveCursorDown",
            46: "forwardDelete"
        },
        _ctrlKeysMap: {
            65: "selectAll",
            88: "cut"
        },
        onClick: function() {
            this.hiddenTextarea && this.hiddenTextarea.focus()
        },
        onKeyDown: function(t) {
            if (this.isEditing) {
                if (t.keyCode in this._keysMap) this[this._keysMap[t.keyCode]](t);
                else {
                    if (!(t.keyCode in this._ctrlKeysMap && (t.ctrlKey || t.metaKey))) return;
                    this[this._ctrlKeysMap[t.keyCode]](t)
                }
                t.stopImmediatePropagation(), t.preventDefault(), this.canvas && this.canvas.renderAll()
            }
        },
        onInput: function(t) {
            if (!this.isEditing || this._cancelOnInput) return void(this._cancelOnInput = !1);
            var e = this.selectionStart || 0,
                i = this.text.length,
                r = this.hiddenTextarea.value.length,
                n = r - i,
                s = this.hiddenTextarea.value.slice(e, e + n);
            this.insertChars(s), t.stopPropagation()
        },
        forwardDelete: function(t) {
            if (this.selectionStart === this.selectionEnd) {
                if (this.selectionStart === this.text.length) return;
                this.moveCursorRight(t)
            }
            this.removeChars(t)
        },
        copy: function(t) {
            var e = this.getSelectedText(),
                i = this._getClipboardData(t);
            i && i.setData("text", e), fabric.copiedText = e, fabric.copiedTextStyle = this.getSelectionStyles(this.selectionStart, this.selectionEnd)
        },
        paste: function(t) {
            var e = null,
                i = this._getClipboardData(t),
                r = !0;
            i ? (e = i.getData("text").replace(/\r/g, ""), fabric.copiedTextStyle && fabric.copiedText === e || (r = !1)) : e = fabric.copiedText, e && this.insertChars(e, r), this._cancelOnInput = !0
        },
        cut: function(t) {
            this.selectionStart !== this.selectionEnd && (this.copy(), this.removeChars(t))
        },
        _getClipboardData: function(t) {
            return t && (t.clipboardData || fabric.window.clipboardData)
        },
        getDownCursorOffset: function(t, e) {
            var i, r, n = e ? this.selectionEnd : this.selectionStart,
                s = this.get2DCursorLocation(n),
                o = s.lineIndex,
                a = this._textLines[o].slice(0, s.charIndex),
                h = this._textLines[o].slice(s.charIndex),
                c = this._textLines[o + 1] || "";
            if (o === this._textLines.length - 1 || t.metaKey || 34 === t.keyCode) return this.text.length - n;
            var l = this._getLineWidth(this.ctx, o);
            r = this._getLineLeftOffset(l);
            for (var u = r, f = 0, d = a.length; d > f; f++) i = a[f], u += this._getWidthOfChar(this.ctx, i, o, f);
            var g = this._getIndexOnNextLine(s, c, u);
            return h.length + 1 + g
        },
        _getIndexOnNextLine: function(t, e, i) {
            for (var r, n = t.lineIndex + 1, s = this._getLineWidth(this.ctx, n), o = this._getLineLeftOffset(s), a = o, h = 0, c = 0, l = e.length; l > c; c++) {
                var u = e[c],
                    f = this._getWidthOfChar(this.ctx, u, n, c);
                if (a += f, a > i) {
                    r = !0;
                    var d = a - f,
                        g = a,
                        p = Math.abs(d - i),
                        v = Math.abs(g - i);
                    h = p > v ? c + 1 : c;
                    break
                }
            }
            return r || (h = e.length), h
        },
        moveCursorDown: function(t) {
            this.abortCursorAnimation(), this._currentCursorOpacity = 1;
            var e = this.getDownCursorOffset(t, "right" === this._selectionDirection);
            t.shiftKey ? this.moveCursorDownWithShift(e) : this.moveCursorDownWithoutShift(e), this.initDelayedCursor()
        },
        moveCursorDownWithoutShift: function(t) {
            this._selectionDirection = "right", this.setSelectionStart(this.selectionStart + t), this.setSelectionEnd(this.selectionStart)
        },
        swapSelectionPoints: function() {
            var t = this.selectionEnd;
            this.setSelectionEnd(this.selectionStart), this.setSelectionStart(t)
        },
        moveCursorDownWithShift: function(t) {
            this.selectionEnd === this.selectionStart && (this._selectionDirection = "right"), "right" === this._selectionDirection ? this.setSelectionEnd(this.selectionEnd + t) : this.setSelectionStart(this.selectionStart + t), this.selectionEnd < this.selectionStart && "left" === this._selectionDirection && (this.swapSelectionPoints(), this._selectionDirection = "right"), this.selectionEnd > this.text.length && this.setSelectionEnd(this.text.length)
        },
        getUpCursorOffset: function(t, e) {
            var i = e ? this.selectionEnd : this.selectionStart,
                r = this.get2DCursorLocation(i),
                n = r.lineIndex;
            if (0 === n || t.metaKey || 33 === t.keyCode) return i;
            for (var s, o = this._textLines[n].slice(0, r.charIndex), a = this._textLines[n - 1] || "", h = this._getLineWidth(this.ctx, r.lineIndex), c = this._getLineLeftOffset(h), l = c, u = 0, f = o.length; f > u; u++) s = o[u], l += this._getWidthOfChar(this.ctx, s, n, u);
            var d = this._getIndexOnPrevLine(r, a, l);
            return a.length - d + o.length
        },
        _getIndexOnPrevLine: function(t, e, i) {
            for (var r, n = t.lineIndex - 1, s = this._getLineWidth(this.ctx, n), o = this._getLineLeftOffset(s), a = o, h = 0, c = 0, l = e.length; l > c; c++) {
                var u = e[c],
                    f = this._getWidthOfChar(this.ctx, u, n, c);
                if (a += f, a > i) {
                    r = !0;
                    var d = a - f,
                        g = a,
                        p = Math.abs(d - i),
                        v = Math.abs(g - i);
                    h = p > v ? c : c - 1;
                    break
                }
            }
            return r || (h = e.length - 1), h
        },
        moveCursorUp: function(t) {
            this.abortCursorAnimation(), this._currentCursorOpacity = 1;
            var e = this.getUpCursorOffset(t, "right" === this._selectionDirection);
            t.shiftKey ? this.moveCursorUpWithShift(e) : this.moveCursorUpWithoutShift(e), this.initDelayedCursor()
        },
        moveCursorUpWithShift: function(t) {
            this.selectionEnd === this.selectionStart && (this._selectionDirection = "left"), "right" === this._selectionDirection ? this.setSelectionEnd(this.selectionEnd - t) : this.setSelectionStart(this.selectionStart - t), this.selectionEnd < this.selectionStart && "right" === this._selectionDirection && (this.swapSelectionPoints(), this._selectionDirection = "left")
        },
        moveCursorUpWithoutShift: function(t) {
            this.selectionStart === this.selectionEnd && this.setSelectionStart(this.selectionStart - t), this.setSelectionEnd(this.selectionStart), this._selectionDirection = "left"
        },
        moveCursorLeft: function(t) {
            (0 !== this.selectionStart || 0 !== this.selectionEnd) && (this.abortCursorAnimation(), this._currentCursorOpacity = 1, t.shiftKey ? this.moveCursorLeftWithShift(t) : this.moveCursorLeftWithoutShift(t), this.initDelayedCursor())
        },
        _move: function(t, e, i) {
            var r = "selectionStart" === e ? "setSelectionStart" : "setSelectionEnd";
            t.altKey ? this[r](this["findWordBoundary" + i](this[e])) : t.metaKey || 35 === t.keyCode || 36 === t.keyCode ? this[r](this["findLineBoundary" + i](this[e])) : this[r](this[e] + ("Left" === i ? -1 : 1))
        },
        _moveLeft: function(t, e) {
            this._move(t, e, "Left")
        },
        _moveRight: function(t, e) {
            this._move(t, e, "Right")
        },
        moveCursorLeftWithoutShift: function(t) {
            this._selectionDirection = "left", this.selectionEnd === this.selectionStart && this._moveLeft(t, "selectionStart"), this.setSelectionEnd(this.selectionStart)
        },
        moveCursorLeftWithShift: function(t) {
            "right" === this._selectionDirection && this.selectionStart !== this.selectionEnd ? this._moveLeft(t, "selectionEnd") : (this._selectionDirection = "left", this._moveLeft(t, "selectionStart"))
        },
        moveCursorRight: function(t) {
            this.selectionStart >= this.text.length && this.selectionEnd >= this.text.length || (this.abortCursorAnimation(), this._currentCursorOpacity = 1, t.shiftKey ? this.moveCursorRightWithShift(t) : this.moveCursorRightWithoutShift(t), this.initDelayedCursor())
        },
        moveCursorRightWithShift: function(t) {
            "left" === this._selectionDirection && this.selectionStart !== this.selectionEnd ? this._moveRight(t, "selectionStart") : (this._selectionDirection = "right", this._moveRight(t, "selectionEnd"))
        },
        moveCursorRightWithoutShift: function(t) {
            this._selectionDirection = "right", this.selectionStart === this.selectionEnd ? (this._moveRight(t, "selectionStart"), this.setSelectionEnd(this.selectionStart)) : (this.setSelectionEnd(this.selectionEnd + this.getNumNewLinesInSelectedText()), this.setSelectionStart(this.selectionEnd))
        },
        removeChars: function(t) {
            this.selectionStart === this.selectionEnd ? this._removeCharsNearCursor(t) : this._removeCharsFromTo(this.selectionStart, this.selectionEnd), this.setSelectionEnd(this.selectionStart), this._removeExtraneousStyles(), this.canvas && this.canvas.renderAll(), this.setCoords(), this.fire("changed"), this.canvas && this.canvas.fire("text:changed", {
                target: this
            })
        },
        _removeCharsNearCursor: function(t) {
            if (0 !== this.selectionStart)
                if (t.metaKey) {
                    var e = this.findLineBoundaryLeft(this.selectionStart);
                    this._removeCharsFromTo(e, this.selectionStart), this.setSelectionStart(e)
                } else if (t.altKey) {
                var i = this.findWordBoundaryLeft(this.selectionStart);
                this._removeCharsFromTo(i, this.selectionStart), this.setSelectionStart(i)
            } else this._removeSingleCharAndStyle(this.selectionStart), this.setSelectionStart(this.selectionStart - 1)
        }
    }),
    function() {
        var t = fabric.util.toFixed,
            e = fabric.Object.NUM_FRACTION_DIGITS;
        fabric.util.object.extend(fabric.IText.prototype, {
            _setSVGTextLineText: function(t, e, i, r, n, s) {
                this.styles[t] ? this._setSVGTextLineChars(t, e, i, r, s) : fabric.Text.prototype._setSVGTextLineText.call(this, t, e, i, r, n)
            },
            _setSVGTextLineChars: function(t, e, i, r, n) {
                for (var s = this._textLines[t], o = 0, a = this._getLineLeftOffset(this._getLineWidth(this.ctx, t)) - this.width / 2, h = this._getSVGLineTopOffset(t), c = this._getHeightOfLine(this.ctx, t), l = 0, u = s.length; u > l; l++) {
                    var f = this.styles[t][l] || {};
                    e.push(this._createTextCharSpan(s[l], f, a, h.lineTop + h.offset, o));
                    var d = this._getWidthOfChar(this.ctx, s[l], t, l);
                    f.textBackgroundColor && n.push(this._createTextCharBg(f, a, h.lineTop, c, d, o)), o += d
                }
            },
            _getSVGLineTopOffset: function(t) {
                for (var e = 0, i = 0, r = 0; t > r; r++) e += this._getHeightOfLine(this.ctx, r);
                return i = this._getHeightOfLine(this.ctx, r), {
                    lineTop: e,
                    offset: (this._fontSizeMult - this._fontSizeFraction) * i / (this.lineHeight * this._fontSizeMult)
                }
            },
            _createTextCharBg: function(i, r, n, s, o, a) {
                return ['<rect fill="', i.textBackgroundColor, '" x="', t(r + a, e), '" y="', t(n - this.height / 2, e), '" width="', t(o, e), '" height="', t(s / this.lineHeight, e), '"></rect>'].join("")
            },
            _createTextCharSpan: function(i, r, n, s, o) {
                var a = this.getSvgStyles.call(fabric.util.object.extend({
                    visible: !0,
                    fill: this.fill,
                    stroke: this.stroke,
                    type: "text"
                }, r));
                return ['<tspan x="', t(n + o, e), '" y="', t(s - this.height / 2, e), '" ', r.fontFamily ? 'font-family="' + r.fontFamily.replace(/"/g, "'") + '" ' : "", r.fontSize ? 'font-size="' + r.fontSize + '" ' : "", r.fontStyle ? 'font-style="' + r.fontStyle + '" ' : "", r.fontWeight ? 'font-weight="' + r.fontWeight + '" ' : "", r.textDecoration ? 'text-decoration="' + r.textDecoration + '" ' : "", 'style="', a, '">', fabric.util.string.escapeXml(i), "</tspan>"].join("")
            }
        })
    }(),
    function(t) {
        "use strict";
        var e = t.fabric || (t.fabric = {}),
            i = e.util.object.clone;
        e.Textbox = e.util.createClass(e.IText, e.Observable, {
            type: "textbox",
            minWidth: 20,
            dynamicMinWidth: 0,
            __cachedLines: null,
            initialize: function(t, i) {
                this.ctx = e.util.createCanvasElement().getContext("2d"), this.callSuper("initialize", t, i), this.set({
                    lockUniScaling: !1,
                    lockScalingY: !0,
                    lockScalingFlip: !0,
                    hasBorders: !0
                }), this.setControlsVisibility(e.Textbox.getTextboxControlVisibility()), this._dimensionAffectingProps.width = !0
            },
            _initDimensions: function(t) {
                this.__skipDimension || (t || (t = e.util.createCanvasElement().getContext("2d"), this._setTextStyles(t)), this.dynamicMinWidth = 0, this._textLines = this._splitTextIntoLines(), this.dynamicMinWidth > this.width && this._set("width", this.dynamicMinWidth), this._clearCache(), this.height = this._getTextHeight(t))
            },
            _generateStyleMap: function() {
                for (var t = 0, e = 0, i = 0, r = {}, n = 0; n < this._textLines.length; n++) "\n" === this.text[i] ? (e = 0, i++, t++) : " " === this.text[i] && (e++, i++), r[n] = {
                    line: t,
                    offset: e
                }, i += this._textLines[n].length, e += this._textLines[n].length;
                return r
            },
            _getStyleDeclaration: function(t, e, i) {
                if (this._styleMap) {
                    var r = this._styleMap[t];
                    t = r.line, e = r.offset + e
                }
                return this.callSuper("_getStyleDeclaration", t, e, i)
            },
            _setStyleDeclaration: function(t, e, i) {
                var r = this._styleMap[t];
                t = r.line, e = r.offset + e, this.styles[t][e] = i
            },
            _deleteStyleDeclaration: function(t, e) {
                var i = this._styleMap[t];
                t = i.line, e = i.offset + e, delete this.styles[t][e]
            },
            _getLineStyle: function(t) {
                var e = this._styleMap[t];
                return this.styles[e.line]
            },
            _setLineStyle: function(t, e) {
                var i = this._styleMap[t];
                this.styles[i.line] = e
            },
            _deleteLineStyle: function(t) {
                var e = this._styleMap[t];
                delete this.styles[e.line]
            },
            _wrapText: function(t, e) {
                var i, r = e.split(this._reNewline),
                    n = [];
                for (i = 0; i < r.length; i++) n = n.concat(this._wrapLine(t, r[i], i));
                return n
            },
            _measureText: function(t, e, i, r) {
                var n, s = 0;
                r = r || 0;
                for (var o = 0; o < e.length; o++) this.styles && this.styles[i] && (n = this.styles[i][o + r]) ? (t.save(), s += this._applyCharStylesGetWidth(t, e[o], i, o, n), t.restore()) : s += this._applyCharStylesGetWidth(t, e[o], i, o, {});
                return s
            },
            _wrapLine: function(t, e, i) {
                var r = this.width,
                    n = this._measureText(t, e, i, 0);
                if (r > n) return -1 === e.indexOf(" ") && n > this.dynamicMinWidth && (this.dynamicMinWidth = n), [e];
                for (var s = [], o = "", a = e.split(" "), h = 0, c = "", l = 0, u = 0; a.length > 0;) c = "" === o ? "" : " ", l = this._measureText(t, a[0], i, o.length + c.length + h), n = "" === o ? l : this._measureText(t, o + c + a[0], i, h), r > n || "" === o && l >= r ? o += c + a.shift() : (h += o.length + 1, s.push(o), o = ""), 0 === a.length && s.push(o), l > u && (u = l);
                return u > this.dynamicMinWidth && (this.dynamicMinWidth = u), s
            },
            _splitTextIntoLines: function() {
                this.ctx.save(), this._setTextStyles(this.ctx);
                var t = this._wrapText(this.ctx, this.text);
                return this.ctx.restore(), this._textLines = t, this._styleMap = this._generateStyleMap(), t
            },
            setOnGroup: function(t, e) {
                "scaleX" === t && (this.set("scaleX", Math.abs(1 / e)), this.set("width", this.get("width") * e / ("undefined" == typeof this.__oldScaleX ? 1 : this.__oldScaleX)), this.__oldScaleX = e)
            },
            get2DCursorLocation: function(t) {
                "undefined" == typeof t && (t = this.selectionStart);
                for (var e = this._textLines.length, i = 0, r = 0; e > r; r++) {
                    var n = this._textLines[r],
                        s = n.length;
                    if (i + s >= t) return {
                        lineIndex: r,
                        charIndex: t - i
                    };
                    i += s, ("\n" === this.text[i] || " " === this.text[i]) && i++
                }
                return {
                    lineIndex: e - 1,
                    charIndex: this._textLines[e - 1].length
                }
            },
            _getCursorBoundariesOffsets: function(t, e) {
                for (var i = 0, r = 0, n = this.get2DCursorLocation(), s = this._textLines[n.lineIndex].split(""), o = this._getLineLeftOffset(this._getLineWidth(this.ctx, n.lineIndex)), a = 0; a < n.charIndex; a++) r += this._getWidthOfChar(this.ctx, s[a], n.lineIndex, a);
                for (a = 0; a < n.lineIndex; a++) i += this._getHeightOfLine(this.ctx, a);
                return "cursor" === e && (i += (1 - this._fontSizeFraction) * this._getHeightOfLine(this.ctx, n.lineIndex) / this.lineHeight - this.getCurrentCharFontSize(n.lineIndex, n.charIndex) * (1 - this._fontSizeFraction)), {
                    top: i,
                    left: r,
                    lineLeft: o
                }
            },
            getMinWidth: function() {
                return Math.max(this.minWidth, this.dynamicMinWidth)
            },
            toObject: function(t) {
                return e.util.object.extend(this.callSuper("toObject", t), {
                    minWidth: this.minWidth
                })
            }
        }), e.Textbox.fromObject = function(t) {
            return new e.Textbox(t.text, i(t))
        }, e.Textbox.getTextboxControlVisibility = function() {
            return {
                tl: !1,
                tr: !1,
                br: !1,
                bl: !1,
                ml: !0,
                mt: !1,
                mr: !0,
                mb: !1,
                mtr: !0
            }
        }, e.Textbox.instances = []
    }("undefined" != typeof exports ? exports : this),
    function() {
        var t = fabric.Canvas.prototype._setObjectScale;
        fabric.Canvas.prototype._setObjectScale = function(e, i, r, n, s, o) {
            var a = i.target;
            if (a instanceof fabric.Textbox) {
                var h = a.width * (e.x / i.scaleX / (a.width + a.strokeWidth));
                h >= a.getMinWidth() && a.set("width", h)
            } else t.call(fabric.Canvas.prototype, e, i, r, n, s, o)
        }, fabric.Group.prototype._refreshControlsVisibility = function() {
            if ("undefined" != typeof fabric.Textbox)
                for (var t = this._objects.length; t--;)
                    if (this._objects[t] instanceof fabric.Textbox) return void this.setControlsVisibility(fabric.Textbox.getTextboxControlVisibility())
        };
        var e = fabric.util.object.clone;
        fabric.util.object.extend(fabric.Textbox.prototype, {
            _removeExtraneousStyles: function() {
                for (var t in this._styleMap) this._textLines[t] || delete this.styles[this._styleMap[t].line]
            },
            insertCharStyleObject: function(t, e, i) {
                var r = this._styleMap[t];
                t = r.line, e = r.offset + e, fabric.IText.prototype.insertCharStyleObject.apply(this, [t, e, i])
            },
            insertNewlineStyleObject: function(t, e, i) {
                var r = this._styleMap[t];
                t = r.line, e = r.offset + e, fabric.IText.prototype.insertNewlineStyleObject.apply(this, [t, e, i])
            },
            shiftLineStyles: function(t, i) {
                var r = e(this.styles),
                    n = this._styleMap[t];
                t = n.line;
                for (var s in this.styles) {
                    var o = parseInt(s, 10);
                    o > t && (this.styles[o + i] = r[o], r[o - i] || delete this.styles[o])
                }
            },
            _getTextOnPreviousLine: function(t) {
                for (var e = this._textLines[t - 1]; this._styleMap[t - 2] && this._styleMap[t - 2].line === this._styleMap[t - 1].line;) e = this._textLines[t - 2] + e, t--;
                return e
            },
            removeStyleObject: function(t, i) {
                var r = this.get2DCursorLocation(i),
                    n = this._styleMap[r.lineIndex],
                    s = n.line,
                    o = n.offset + r.charIndex;
                if (t) {
                    var a = this._getTextOnPreviousLine(r.lineIndex),
                        h = a ? a.length : 0;
                    this.styles[s - 1] || (this.styles[s - 1] = {});
                    for (o in this.styles[s]) this.styles[s - 1][parseInt(o, 10) + h] = this.styles[s][o];
                    this.shiftLineStyles(r.lineIndex, -1)
                } else {
                    var c = this.styles[s];
                    c && delete c[o];
                    var l = e(c);
                    for (var u in l) {
                        var f = parseInt(u, 10);
                        f >= o && 0 !== f && (c[f - 1] = l[f], delete c[f])
                    }
                }
            }
        })
    }(),
    function() {
        var t = fabric.IText.prototype._getNewSelectionStartFromOffset;
        fabric.IText.prototype._getNewSelectionStartFromOffset = function(e, i, r, n, s) {
            n = t.call(this, e, i, r, n, s);
            for (var o = 0, a = 0, h = 0; h < this._textLines.length && (o += this._textLines[h].length, !(o + a >= n)); h++)("\n" === this.text[o + a] || " " === this.text[o + a]) && a++;
            return n - h + a
        }
    }(),
    function() {
        function request(t, e, i) {
            var r = URL.parse(t);
            r.port || (r.port = 0 === r.protocol.indexOf("https:") ? 443 : 80);
            var n = 0 === r.protocol.indexOf("https:") ? HTTPS : HTTP,
                s = n.request({
                    hostname: r.hostname,
                    port: r.port,
                    path: r.path,
                    method: "GET"
                }, function(t) {
                    var r = "";
                    e && t.setEncoding(e), t.on("end", function() {
                        i(r)
                    }), t.on("data", function(e) {
                        200 === t.statusCode && (r += e)
                    })
                });
            s.on("error", function(t) {
                t.errno === process.ECONNREFUSED ? fabric.log("ECONNREFUSED: connection refused to " + r.hostname + ":" + r.port) : fabric.log(t.message), i(null)
            }), s.end()
        }

        function requestFs(t, e) {
            var i = require("fs");
            i.readFile(t, function(t, i) {
                if (t) throw fabric.log(t), t;
                e(i)
            })
        }
        if ("undefined" == typeof document || "undefined" == typeof window) {
            var DOMParser = require("xmldom").DOMParser,
                URL = require("url"),
                HTTP = require("http"),
                HTTPS = require("https"),
                Canvas = require("canvas"),
                Image = require("canvas").Image;
            fabric.util.loadImage = function(t, e, i) {
                function r(r) {
                    r ? (n.src = new Buffer(r, "binary"), n._src = t, e && e.call(i, n)) : (n = null, e && e.call(i, null, !0))
                }
                var n = new Image;
                t && (t instanceof Buffer || 0 === t.indexOf("data")) ? (n.src = n._src = t, e && e.call(i, n)) : t && 0 !== t.indexOf("http") ? requestFs(t, r) : t ? request(t, "binary", r) : e && e.call(i, t)
            }, fabric.loadSVGFromURL = function(t, e, i) {
                t = t.replace(/^\n\s*/, "").replace(/\?.*$/, "").trim(), 0 !== t.indexOf("http") ? requestFs(t, function(t) {
                    fabric.loadSVGFromString(t.toString(), e, i)
                }) : request(t, "", function(t) {
                    fabric.loadSVGFromString(t, e, i)
                })
            }, fabric.loadSVGFromString = function(t, e, i) {
                var r = (new DOMParser).parseFromString(t);
                fabric.parseSVGDocument(r.documentElement, function(t, i) {
                    e && e(t, i)
                }, i)
            }, fabric.util.getScript = function(url, callback) {
                request(url, "", function(body) {
                    eval(body), callback && callback()
                })
            }, fabric.Image.fromObject = function(t, e) {
                fabric.util.loadImage(t.src, function(i) {
                    var r = new fabric.Image(i);
                    r._initConfig(t), r._initFilters(t.filters, function(i) {
                        r.filters = i || [], r._initFilters(t.resizeFilters, function(t) {
                            r.resizeFilters = t || [], e && e(r)
                        })
                    })
                })
            }, fabric.createCanvasForNode = function(t, e, i, r) {
                r = r || i;
                var n = fabric.document.createElement("canvas"),
                    s = new Canvas(t || 600, e || 600, r);
                n.style = {}, n.width = s.width, n.height = s.height;
                var o = fabric.Canvas || fabric.StaticCanvas,
                    a = new o(n, i);
                return a.contextContainer = s.getContext("2d"), a.nodeCanvas = s, a.Font = Canvas.Font, a
            }, fabric.StaticCanvas.prototype.createPNGStream = function() {
                return this.nodeCanvas.createPNGStream()
            }, fabric.StaticCanvas.prototype.createJPEGStream = function(t) {
                return this.nodeCanvas.createJPEGStream(t)
            };
            var origSetWidth = fabric.StaticCanvas.prototype.setWidth;
            fabric.StaticCanvas.prototype.setWidth = function(t, e) {
                return origSetWidth.call(this, t, e), this.nodeCanvas.width = t, this
            }, fabric.Canvas && (fabric.Canvas.prototype.setWidth = fabric.StaticCanvas.prototype.setWidth);
            var origSetHeight = fabric.StaticCanvas.prototype.setHeight;
            fabric.StaticCanvas.prototype.setHeight = function(t, e) {
                return origSetHeight.call(this, t, e), this.nodeCanvas.height = t, this
            }, fabric.Canvas && (fabric.Canvas.prototype.setHeight = fabric.StaticCanvas.prototype.setHeight)
        }
    }();

//---------------------------------------------------------------------------------------------------


var CardDesign = (function() {
    "use strict";


    function CardDesign(options) {

        var self = this;

        this.canvasLine = '<i class="line-left"></i><i class="line-right"></i><i class="line-top"></i><i class="line-bottom"></i><ul id="rightClickMenu"><li class="if-image">Resmi Düzenle</li><li class="if-text">Metni Düzenle</li><li class="with-border">Sil</li><li>Kes</li><li>Kopyala</li><li>Yapıştır</li><li class="with-border">Kopyasını Ekle</li><li>En öne getir</li><li>En arkaya ekle</li></ul>';
        this.optionsBar = '<div class="option-area clearfix"><div class="content-area"><div class="options-left"><ul><li id="rotateFront"><button class="btn orange" title="Ön Yüz">Ön Yüz</button></li><li id="rotateBack"><button class="btn orange" title="Arka Yüz">Arka Yüz</button></li></ul></div><div class="options-right"><ul><li id="addText"><button title="Metin Ekle">Metin Ekle</button></li><li id="addShapes"><button title="Şekil Ekle">Şekil Ekle</button><ul id="shapeArea"><li><button id="addRectangle" title="Kare">Kare</button></li><li><button id="addCircle" title="Daire">Daire</button></li><li><button id="addTriangle" title="Üçgen">Üçgen</button></li><li><button id="addLine" title="Çizgi">Çizgi</button></li></ul></li><li id="AddImage"><button title="Resim Ekle">Resim Ekle</button></li></ul></div></div></div>';
        this.subOptionsBar = '<div class="sub-options"> <div class="content-area"> <div class="options-left"> <div id="globalOptions"> <ul> <li class="operations"> <select id="operations" class="slct"> <option value="" selected="">İşlemler</option> <option value="delete">Sil</option> <option value="cut">Kes</option> <option value="copy">Kopyala</option> <option value="paste">Yapıştır</option> <option value="addCopy">Kopyasını Ekle</option> <option value="moveToFront">En Öne Getir</option> <option value="moveToBack">En Arkaya Ekle</option> </select> </li><li id="copy-object" class="copy-object"><a class="icon" href="javascirpt:;"></a></li><li id="cut-object" class="cut-object"><a class="icon" href="javascirpt:;"></a></li><li id="paste-object" class="paste-object"><a class="icon" href="javascirpt:;"></a></li><li id="opacity"><input id="object-opacity" type="range" value="100"/></li><li id="delete" class="delete"><a class="icon" href="javascirpt:;"></a></li></ul> </div></div><div class="options-right"> <div id="textOptions"> <ul> <li class="family"> <select id="font-family" class="slct"> <option value="arial">Arial</option> <option value="helvetica" selected="">Helvetica</option> <option value="myriad pro">Myriad Pro</option> <option value="delicious">Delicious</option> <option value="verdana">Verdana</option> <option value="georgia">Georgia</option> <option value="courier">Courier</option> <option value="comic sans ms">Comic Sans MS</option> <option value="impact">Impact</option> <option value="monaco">Monaco</option> <option value="optima">Optima</option> <option value="hoefler text">Hoefler Text</option> <option value="plaster">Plaster</option> <option value="engagement">Engagement</option> </select> </li><li class="size"> <select id="font-size" class="slct"> <option value="10">10</option> <option value="12" selected="">12</option> <option value="14">14</option> <option value="16">16</option> <option value="18">18</option> <option value="24">24</option> <option value="36">36</option> <option value="48">48</option> <option value="72">72</option> <option value="120">120</option> <option value="150">150</option> <option value="180">180</option> <option value="200">200</option> <option value="250">250</option> </select> </li><li id="align-left" class="align-left"><a class="icon" href="javascirpt:;"></a></li><li id="align-center" class="align-center"><a class="icon" href="javascirpt:;"></a></li><li id="align-right" class="align-right"><a class="icon" href="javascirpt:;"></a></li><li id="text-bold" class="text-bold"><a class="icon" href="javascirpt:;"></a></li><li id="text-italic" class="text-italic"><a class="icon" href="javascirpt:;"></a></li><li id="text-underline" class="text-underline"><a class="icon" href="javascirpt:;"></a></li><li id="edit-text" class="edit-text"><a class="icon" href="javascirpt:;"></a></li></ul> </div><div id="colorArea"> <ul> <li id="color-area" class="color-area"> <a class="icon" href="javascirpt:;"></a> <ul id="color-palette"></ul> </li></ul> </div></div></div></div>';
        this.popup = '<div class="popup-content"> <div id="cardDesignPopup"> <span class="context">Metin Ekle</span> <textarea id="custom-text" placeholder="Metin Girin"></textarea> <div class="buttons"><button class="btn done" id="editCustomText">Düzenle</button><button class="btn done" id="addCustomText">Ekle</button><button class="btn warning" id="cancelAddCustomText">İptal</button></div></div><div id="cardDesignImagePopup"> <span class="context">Resim Ekle</span> <div id="svgContainer" class="images clearfix"></div><div class="buttons"><button class="btn done" id="addCustomImage">Ekle</button> </div> {imageUploadForm}</div><div id="previewPopup"><span class="context">Ön İzleme</span><div class="preview-image-area"><img src="" id="frontPreview"/><img src="" id="backPreview"/></div><div class="checkbox-area"><input type="checkbox" id="accept"/><span class="accept-text">Tasarımı Onaylıyorum.</span><span id="accept-result" class="accept-result"></span></div><div class="buttons"><button class="btn done" id="sendPreviewImage">Gönder</button><button class="btn warning" id="cancelPreviewImage">Düzenlemeye Devam Et</button></div></div></div>';
        this.imageUploadForm = '<div id="upload-area"><span class="context">Resim Seç</span><div id="uploadbox" onClick="singleupload_input.click();" class="singleupload">Resim Yükle</div><input type="file" id="singleupload_input" style="display:none;" name="img" value=""/><div class="buttons"><button class="btn done" id="addSelectedImage">Ekle</button><button class="btn warning" id="cancelAddCustomImage">İptal</button></div></div>'
        this.endButtons = '<div class="endButtons"><ul><li id="preview"><button class="btn orange">Bitti Ön izlemeyi Gör</button></li></li></ul></div>';
        this.options = options;
        this.copyArray = [];

        if (!options.urls.saveUrl) {
            alert('Kayit servis urli girilmelidir!');
            return;
        }

        //Append Popup
        document.body.innerHTML += this
            .popup
            .replace('{imageUploadForm}', this.imageUploadForm); // replace form 

        this.canvasTemplete = "<canvas id='{canvasId}'></canvas>"
            //generate canvas
        document.getElementById(options.canvasId).innerHTML = this.canvasLine;
        document.getElementById(options.canvasId).innerHTML += this.canvasTemplete.replace("{canvasId}", "frontCanvas");
        document.getElementById(options.canvasId).innerHTML += this.canvasTemplete.replace("{canvasId}", "backCanvas");
        this.front_canvas = new fabric.Canvas("frontCanvas", {
            width: this.options.width,
            height: this.options.height
        });
        this.back_canvas = new fabric.Canvas("backCanvas", {
            width: this.options.width,
            height: this.options.height
        });

        // bind canvas events
        this.front_canvas.on("mouse:up", self.activateConsole());
        this.back_canvas.on("mouse:up", self.activateConsole());

        this.front_canvas.on('mouse:over', function(e) {
            var rightClickMenu = document.getElementById("rightClickMenu");
            if (rightClickMenu.style.display == "none") {
                //self.front_canvas.setActiveObject(e.target);
                //self.front_canvas.renderAll();
            }
        });

        this.back_canvas.on('mouse:over', function(e) {
            var rightClickMenu = document.getElementById("rightClickMenu");
            if (rightClickMenu.style.display == "none") {
                //self.back_canvas.setActiveObject(e.target);
                //self.back_canvas.renderAll();
            }
        });

        this.front_canvas.on('mouse:up', function(e) {
            self.activateRightClick(e);
        });

        this.back_canvas.on('mouse:up', function(e) {
            self.activateRightClick(e);
        });

        this.injectGoogleFonts();
        this.injectJquery();

        //Init Settings Buttons
        this.putBuildInSvgImages();
        this.generateOptionsBar();
        this.generateSubOptionsBar();
        this.generateEndButtons();

        //Generate Data
        this.front_canvas.loadFromJSON(this.options.data.front, function() {
            self.front_canvas.renderAll();
        });
        this.back_canvas.loadFromJSON(this.options.data.back, function() {
            self.back_canvas.renderAll();
        });

        window.onload = this.pageLoaded();

        // Auto Save

        setInterval(self.autoSave.bind(this), 30000);
    }

    var consoleActivation = function() {
        var self = this;
        var activeCanvas = this.getActiveCanvas();
        var activeObject = activeCanvas.getActiveObject();

        if (activeObject) {
            self.subMenuProcess(activeObject.type);
        }
    };

    CardDesign.prototype.putBuildInSvgImages = function() {
        var svgContainer = document.getElementById('svgContainer');

        if (svgContainer && this.options.buildInImages && this.options.buildInImages.length > 0) {

            for (var i = 0; i < this.options.buildInImages.length; i++) {
                var element = document.createElement("img");
                element.setAttribute('src', this.options.buildInImages[i]);
                svgContainer.appendChild(element);
            };

        }

    };

    CardDesign.prototype.pageLoaded = function() {
        var self = this;
        return function() {
            self.setGoogleFonts(self.options.googleFontFamilies);
            self.fileUploadInit();
        };
    };

    CardDesign.prototype.injectJquery = function() {
        if (!window.$) {
            injectScript('https://code.jquery.com/jquery-1.11.3.min.js');
        }
    };

    CardDesign.prototype.injectGoogleFonts = function() {
        //http://fonts.googleapis.com/css?family=Ubuntu|Amatic SC
        injectScript('http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js');
    };

    CardDesign.prototype.activateRightClick = function(e) {
        var self = this;
        var rightClickMenu = document.getElementById("rightClickMenu");
        var isRightMB;
        e = e || window.event;
        e = e.e;

        if ((e.which == 3 || e.button == 2) && self.getActiveCanvas()._activeObject != null && e.target.style.cursor == "move") {
            e.preventDefault();
            var positionX = e.offsetX;
            var positionY = e.offsetY;

            isRightMB = true;
            rightClickMenu.style.left = positionX + "px";
            rightClickMenu.style.top = positionY + "px";
            rightClickMenu.style.display = "block";

            if (self.getActiveCanvas().getActiveObject().type == "text") {
                rightClickMenu.classList.add("text");
            } else {
                rightClickMenu.classList.remove("text");
            }

            rightClickMenu.onclick = function(e) {
                rightClickMenu.style.display = "none";
                switch (e.target.innerHTML) {
                    case "Metni Düzenle":
                        self.showPopup("edit");
                        break;

                    case "Sil":
                        self.cutObject();
                        break;

                    case "Kopyala":
                        self.copyObject();
                        break;

                    case "Yapıştır":
                        self.pasteObject();
                        break;

                    case "Kes":
                        self.cutObject();
                        break;

                    case "Kopyasını Ekle":
                        self.copyObject();
                        self.pasteObject();
                        break;

                    case "En öne getir":
                        self.bringToFront();
                        break;

                    case "En arkaya ekle":
                        self.sendToBack();
                        break;
                }
            }

        } // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        else {
            isRightMB = false;
            rightClickMenu.style.display = "none";
        } // IE, Opera     
    };

    var injectScript = function(src, intoBody) {
        var intoBody = intoBody || false;
        var selector = 'head';
        var container = document.getElementsByTagName(selector)[0];
        var s = document.createElement('script');
        s.setAttribute('src', src);

        if (intoBody) {
            selector = 'cardDesignerScript';
            container = document.getElementById(selector);
            container.parentNode.insertBefore(s, container);
        } else {
            container.appendChild(s);
        }
    };

    CardDesign.prototype.setGoogleFonts = function(googleFontFamilies) {
        if (!googleFontFamilies || typeof(googleFontFamilies) != "object") return;

        WebFont.load({
            google: {
                families: googleFontFamilies
            }
        });
    }

    CardDesign.prototype.activateConsole = function() {
        var self = this;
        return function() {
            consoleActivation.call(self);
        };
    };

    CardDesign.prototype.getSelected = function() {
        return this.getActiveCanvas().getActiveObject();
    };

    CardDesign.prototype.getActiveCanvas = function() {
        if (document.getElementById("frontCanvas").parentNode.style.display != "none") {
            return this.front_canvas;
        }
        return this.back_canvas;
    };

    CardDesign.prototype.getActiveStyle = function(styleName, object) {
        object = object || this.getActiveCanvas().getActiveObject();
        if (!object) return '';

        return (object.getSelectionStyles && object.isEditing) ? (object.getSelectionStyles()[styleName] || '') : (object[styleName] || '');
    };

    CardDesign.prototype.setActiveStyle = function(styleName, value, object) {
        object = object || this.getActiveCanvas().getActiveObject();
        if (!object) return;

        if (object.setSelectionStyles && object.isEditing) {
            var style = {};
            style[styleName] = value;
            object.setSelectionStyles(style);
            object.setCoords();
        } else {
            object[styleName] = value;
        }

        object.setCoords();
        this.getActiveCanvas().renderAll();
    };

    CardDesign.prototype.addImage = function(imageName, minScale, maxScale) {

        var self = this,
            coord = {
                left: 100,
                top: 100
            };

        fabric.Image.fromURL(imageName, function(image) {

            image.set({
                left: coord.left,
                top: coord.top,
                angle: getRandomInt(-10, 10)
            });

            self.getActiveCanvas().add(image);
        });
    };

    CardDesign.prototype.addShape = function(shapeName) {
        var self = this,
            coord = getRandomLeftTop();

        fabric.loadSVGFromURL('../assets/' + shapeName + '.svg', function(objects, options) {

            var loadedObject = fabric.util.groupSVGElements(objects, options);

            loadedObject.set({
                    left: coord.left,
                    top: coord.top,
                    angle: getRandomInt(-10, 10)
                })
                .setCoords();

            self.canvas.add(loadedObject);
        });
    };

    CardDesign.prototype.removeSelected = function() {
        var activeObject = this.getActiveCanvas().getActiveObject(),
            activeGroup = this.getActiveCanvas().getActiveGroup();

        if (activeGroup) {
            var objectsInGroup = activeGroup.getObjects();
            this.getActiveCanvas().discardActiveGroup();
            objectsInGroup.forEach(function(object) {
                this.getActiveCanvas().remove(object);
            });
        } else if (activeObject) {
            this.getActiveCanvas().remove(activeObject);
        }
    };

    CardDesign.prototype.addRect = function() {
        var self = this;

        var activeCanvas = self.getActiveCanvas();
        var coord = getRandomLeftTop();

        activeCanvas.add(new fabric.Rect({
            left: coord.left,
            top: coord.top,
            fill: '#' + getRandomColor(),
            width: 50,
            height: 50,
            opacity: 1
        }));
    };

    CardDesign.prototype.addCircle = function() {
        var self = this;

        var activeCanvas = self.getActiveCanvas();
        var coord = getRandomLeftTop();

        activeCanvas.add(new fabric.Circle({
            left: coord.left,
            top: coord.top,
            fill: '#' + getRandomColor(),
            radius: 50,
            opacity: 1
        }));
    };

    CardDesign.prototype.addTriangle = function() {
        var self = this;

        var activeCanvas = self.getActiveCanvas();
        var coord = getRandomLeftTop();

        activeCanvas.add(new fabric.Triangle({
            left: coord.left,
            top: coord.top,
            fill: '#' + getRandomColor(),
            width: 50,
            height: 50,
            opacity: 1
        }));
    };

    CardDesign.prototype.addLine = function() {
        var self = this;

        var activeCanvas = self.getActiveCanvas();
        var coord = getRandomLeftTop();

        activeCanvas.add(new fabric.Line([50, 100, 200, 200], {
            left: coord.left,
            top: coord.top,
            stroke: '#' + getRandomColor()
        }));
    };

    // --------------- IMAGE UPLOAD -----------------------

    CardDesign.prototype.fileUploadInit = function() {
        var self = this;
        try {
            (function($) {

                $.fn.singleupload = function(options) {

                    var $this = this;
                    var inputfile = null;

                    var settings = $.extend({
                        action: '#',
                        onSuccess: function(url, data) {},
                        onError: function(code) {},
                        OnProgress: function(loaded, total) {
                            var percent = Math.round(loaded * 100 / total);
                            $this.html(percent + '%');
                        },
                        name: 'img'
                    }, options);

                    $('#' + settings.inputId).bind('change', function() {
                        $this.css('backgroundImage', 'none');
                        var fd = new FormData();
                        fd.append($('#' + settings.inputId).attr('name'), $('#' + settings.inputId).get(0).files[0]);

                        var xhr = new XMLHttpRequest();
                        xhr.addEventListener("load", function(ev) {
                                $this.html('');
                                var res = eval("(" + ev.target.responseText + ")");

                                if (res.code != 0) {
                                    settings.onError(res.code);
                                    return;
                                }
                                var review = ('<img src="' + res.url + '" style="width:' + $this.width() + 'px;height:' + $this.height() + 'px;"/>');
                                $this.append(review);
                                settings.onSuccess(res.url, res.data);

                            },
                            false);
                        xhr.upload.addEventListener("progress", function(ev) {
                            settings.OnProgress(ev.loaded, ev.total);
                        }, false);

                        xhr.open("POST", settings.action, true);
                        xhr.send(fd);

                    });

                    return this;
                }


            }(jQuery));



            $('#uploadbox').singleupload({
                action: self.options.urls.saveUrl, //action: 'do_upload.php'
                inputId: 'singleupload_input',
                onError: function(code) {
                    console.debug('error code ' + res.code);
                },
                onSuccess: function(url, data) {
                        console.log(data);
                    }
                    /*,onProgress: function(loaded, total) {} */
            });
        } catch (err) {
            setTimeout(self.fileUploadInit, 500);
        }
    };


    //-------------- CARD OPTIONS -----------------

    CardDesign.prototype.generateOptionsBar = function() {
        var self = this;
        var elementId = this.options.optionAreaId;
        document.getElementById(elementId).innerHTML = this.optionsBar + this.subOptionsBar;

        var rotateFront = document.getElementById("rotateFront");
        var rotateBack = document.getElementById("rotateBack");
        var addText = document.getElementById("addText");
        var addTextDone = document.getElementById("addCustomText");
        var cancelAddText = document.getElementById("cancelAddCustomText");
        var addImage = document.getElementById("AddImage");
        var addRectangle = document.getElementById("addRectangle");
        var addCircle = document.getElementById("addCircle");
        var addTriangle = document.getElementById("addTriangle");
        var addLine = document.getElementById("addLine");
        var textArea = document.getElementById("custom-text");
        var imagePopup = document.getElementById("cardDesignImagePopup");
        var addCustomImage = document.getElementById("addCustomImage");
        var cancelAddCustomImage = document.getElementById("cancelAddCustomImage");
        var frontId = "frontCanvas";
        var backId = "backCanvas";

        rotateFront.onclick = function() {
            this.isFrontActive = true;
            document.getElementById(backId).parentNode.style.display = "none";
            document.getElementById(frontId).parentNode.style.display = "block";
        }

        rotateBack.onclick = function() {
            this.isFrontActive = false;
            document.getElementById(frontId).parentNode.style.display = "none";
            document.getElementById(backId).parentNode.style.display = "block";
        }

        addText.onclick = function() {
            textArea.value = "";
            self.showPopup("");
        }
        cancelAddText.onclick = function() {
            self.hidePopup();
        }
        addTextDone.onclick = function() {
            var activeCanvas = self.getActiveCanvas();
            var text = document.getElementById("custom-text").value;
            self.addText(activeCanvas, text);
        }
        addImage.onclick = function() {
            self.showPopup("image");
        }

        for (var i = 0; i < imagePopup.getElementsByTagName("img").length; i++) {
            imagePopup.getElementsByTagName("img")[i].onclick = function() {
                imagePopup.getElementsByClassName("active").length > 0 ? imagePopup.getElementsByClassName("active")[0].classList.remove("active") : "";
                this.classList.add("active");
            }
        }

        addCustomImage.onclick = function() {
            var imageSrc = "";
            if (imagePopup.getElementsByClassName("active").length > 0) {
                imageSrc = imagePopup.getElementsByClassName("active")[0].getAttribute("src");
                self.addImage(imageSrc);
                self.hidePopup();
            } else {
                alert("Lütfen bir resim seçiniz.")
            }
        }
        cancelAddCustomImage.onclick = function() {
            self.hidePopup();
        }
        addRectangle.onclick = function() {
            self.addRect();
        }
        addCircle.onclick = function() {
            self.addCircle();
        }
        addTriangle.onclick = function() {
            self.addTriangle();
        }
        addLine.onclick = function() {
            self.addLine();
        }
    }
    var addOptions = function(obj, families) {
        if (!obj || (!families && families.length === 0)) {
            return;
        }

        for (var i = 0; i < families.length; i++) {
            var option = document.createElement("option");
            option.text = families[i];
            option.value = families[i];
            obj.add(option);
        };
    };

    CardDesign.prototype.generateSubOptionsBar = function() {
        var self = this;
        var elementId = this.options.optionAreaId;

        var operations = document.getElementById("operations");
        var fontFamily = document.getElementById("font-family");
        addOptions(fontFamily, this.options.googleFontFamilies);

        var fontSize = document.getElementById("font-size");
        var alignLeft = document.getElementById("align-left");
        var alignCenter = document.getElementById("align-center");
        var alignRight = document.getElementById("align-right");
        var textBold = document.getElementById("text-bold");
        var textItalic = document.getElementById("text-italic");
        var textUnderline = document.getElementById("text-underline");
        var removeSelected = document.getElementById("delete");
        var editText = document.getElementById("edit-text");
        var editCustomText = document.getElementById("editCustomText");
        var textArea = document.getElementById("custom-text");
        var opacityArea = document.getElementById("object-opacity");
        var copyArea = document.getElementById("copy-object");
        var pasteArea = document.getElementById("paste-object");
        var cutArea = document.getElementById("cut-object");
        var colorArea = document.getElementById("color-area");
        var colorPalette = document.getElementById("color-palette");

        this.appendToColor();
        operations.onchange = function() {
            switch (operations.value) {
                case "delete":
                    self.cutObject();
                    break;

                case "copy":
                    self.copyObject();
                    break;

                case "paste":
                    self.pasteObject();
                    break;

                case "cut":
                    self.cutObject();
                    break;

                case "addCopy":
                    self.pasteObject();
                    break;

                case "moveToFront":
                    self.bringToFront();
                    break;

                case "moveToBack":
                    self.sendToBack();
                    break;
            }
        }
        fontFamily.onchange = function() {
            self.setFontFamily(fontFamily.value);
        }
        fontSize.onchange = function() {
            self.setFontSize(fontSize.value);
        }
        alignLeft.onclick = function() {
            self.setTextAlign("left");
        }
        alignCenter.onclick = function() {
            self.setTextAlign("center");
        }
        alignRight.onclick = function() {
            self.setTextAlign("right");
        }
        textBold.onclick = function() {
            self.toggleBold("bold");
        }
        textItalic.onclick = function() {
            self.toggleItalic("italic");
        }
        textUnderline.onclick = function() {
            self.toggleUnderline("uncerline");
        }
        editText.onclick = function() {
            self.showPopup("edit");
        }
        removeSelected.onclick = function() {
            self.removeSelected();
        }
        editCustomText.onclick = function() {
            self.editText(textArea.value);
            self.hidePopup();
        }
        opacityArea.onchange = function() {
            var opacity = opacityArea.value;
            self.setOpacity(opacity);
        }
        copyArea.onclick = function() {
            self.copyObject();
        }
        cutArea.onclick = function() {
            self.cutObject();
        }
        pasteArea.onclick = function() {
            self.pasteObject();
        }
        colorArea.getElementsByTagName("a")[0].onclick = function() {
            if (colorPalette.style.display != "block") {
                colorPalette.style.display = "block";
            } else {
                colorPalette.style.display = "none";
            }
        }
        for (var i = 0; i < colorPalette.getElementsByTagName("li").length; i++) {
            colorPalette.getElementsByTagName("li")[i].onclick = function() {
                self.setFill(this.style.backgroundColor);
                colorArea.style.backgroundColor = this.style.backgroundColor;
                colorPalette.style.display = "none";
            }
        }
    }

    CardDesign.prototype.subMenuProcess = function(type) {
        var self = this;
        var textOptions = document.getElementById("textOptions");
        var globalOptions = document.getElementById("globalOptions");
        var textArea = document.getElementById("custom-text");
        var colorOptions = document.getElementById("colorArea");
        var colorArea = document.getElementById("color-area");
        var opacityArea = document.getElementById("object-opacity");
        var fontSizeArea = document.getElementById("font-size");

        var selectedBgColor = this.getFill();
        var selectedOpacity = this.getOpacity();
        var selectedFontSize = this.getFontSize();

        colorArea.style.backgroundColor = selectedBgColor;
        opacityArea.value = selectedOpacity;
        fontSizeArea.value = selectedFontSize;

        switch (type) {
            case "text":
                textOptions.style.display = "inline-block";
                colorOptions.style.display = "inline-block";
                globalOptions.style.display = "block";
                textArea.value = self.getText();
                return;

            case "image":
            case "rect":
            case "circle":
            case "triangle":
            case "line":
                globalOptions.style.display = "block";
                colorOptions.style.display = "inline-block";
                textOptions.style.display = "none";
                return;

            default:
                globalOptions.style.display = "none";
                textOptions.style.display = "none";
                colorOptions.style.display = "none";
                return;
        }
    }

    CardDesign.prototype.generateEndButtons = function() {
        var self = this;
        var endButtonsArea = this.options.endButtonsId;
        var buttonsHtml = this.endButtons;

        document.getElementById(endButtonsArea).innerHTML = buttonsHtml;

        var preview = document.getElementById("preview");
        var cancelPreviewImage = document.getElementById("cancelPreviewImage");
        var sendPreviewImage = document.getElementById("sendPreviewImage");
        var acceptCheck = document.getElementById("accept");

        preview.onclick = function() {

            self.front_canvas.deactivateAll().renderAll();
            self.back_canvas.deactivateAll().renderAll();

            var frontImage = document.getElementById("frontPreview");
            var backImage = document.getElementById("backPreview");
            self.showPopup("preview");
            var imageUrlFront = self.rasterize("front");
            var imageUrlBack = self.rasterize("back");
            frontImage.src = imageUrlFront;
            backImage.src = imageUrlBack;
        }

        cancelPreviewImage.onclick = function() {
            self.hidePopup();
        }

        sendPreviewImage.onclick = function() {
            var acceptIsChecked = document.getElementById("accept").checked;
            var acceptResult = document.getElementById("accept-result");
            var json = "";
            if (acceptIsChecked) {
                acceptResult.style.display = "none";
                var imageUrlFront = self.rasterize("front");
                var imageUrlBack = self.rasterize("back");
                var imageUrls = {
                    "front": imageUrlFront,
                    "back": imageUrlBack
                }

                self.postData("POST", self.options.urls.uploadCartDesignUrl, imageUrls);
            } else {
                acceptResult.innerHTML = "Lütfen tasarımı onaylayınız.";
                acceptResult.style.display = "block";
                return false;
            }
        }
    };

    //-------------- CARD OPTIONS -----------------

    // ------------- TEXT OPERATIONS --------------

    CardDesign.prototype.getText = function() {
        return this.getActiveProp('text');
    };

    CardDesign.prototype.addText = function(activeCanvas, customText) {
        var text = customText;

        var textSample = new fabric.Text(text, {
            left: getRandomInt(100, 200),
            top: getRandomInt(100, 200),
            fontFamily: 'helvetica',
            fill: '#000', //getRandomColor(),
            scaleX: 0.5,
            scaleY: 0.5,
            fontWeight: '',
            originX: 'left',
            hasRotatingPoint: true,
            centerTransform: true
        });

        activeCanvas.add(textSample);
        this.hidePopup();
    };

    CardDesign.prototype.editText = function(input) {
        if (input && typeof(input) === "string") {
            var activeCanvas = this.getActiveCanvas();
            var activeObj = activeCanvas.getActiveObject();
            if (activeObj != undefined && activeObj.type === "text") {
                activeObj.set({
                    text: input
                });
                activeCanvas.renderAll();
            }
        }
    }

    CardDesign.prototype.changeColor = function(hexCode) {
        if (hexCode && typeof(hexCode) === "string") {
            this.setActiveProp('fill', hexCode)
        }
    }

    CardDesign.prototype.getTextAlign = function() {
        return this.getActiveCanvas().getActiveObject('textAlign');
    };

    CardDesign.prototype.setTextAlign = function(value) {
        setActiveProp('textAlign', value.toLowerCase());
    };

    CardDesign.prototype.getFontFamily = function() {
        return getActiveProp('fontFamily').toLowerCase();
    };

    CardDesign.prototype.setFontFamily = function(value) {
        this.setActiveProp('fontFamily', value.toLowerCase());
    };

    CardDesign.prototype.getFontSize = function() {
        return this.getActiveStyle('fontSize');
    };

    CardDesign.prototype.setFontSize = function(value) {
        this.setActiveStyle('fontSize', parseInt(value, 10));
    };

    CardDesign.prototype.getTextAlign = function() {
        return this.capitalize(this.getActiveCanvas().getActiveProp('textAlign'));
    };
    CardDesign.prototype.setTextAlign = function(value) {
        this.setActiveProp('textAlign', value.toLowerCase());
    };

    CardDesign.prototype.isBold = function() {
        return this.getActiveStyle('fontWeight') === 'bold';
    };
    CardDesign.prototype.toggleBold = function() {
        this.setActiveStyle('fontWeight',
            this.getActiveStyle('fontWeight') === 'bold' ? '' : 'bold');
    };
    CardDesign.prototype.isItalic = function() {
        return this.getActiveStyle('fontStyle') === 'italic';
    };
    CardDesign.prototype.toggleItalic = function() {
        this.setActiveStyle('fontStyle',
            this.getActiveStyle('fontStyle') === 'italic' ? '' : 'italic');
    };

    CardDesign.prototype.isUnderline = function() {
        return this.getActiveStyle('textDecoration').indexOf('underline') > -1;
    };
    CardDesign.prototype.toggleUnderline = function() {
        var value = this.isUnderline() ? this.getActiveStyle('textDecoration').replace('underline', '') : (this.getActiveStyle('textDecoration') + ' underline');

        this.setActiveStyle('textDecoration', value);
    };

    CardDesign.prototype.getOpacity = function() {
        return this.getActiveStyle('opacity') * 100;
    };
    CardDesign.prototype.setOpacity = function(value) {
        this.setActiveStyle('opacity', parseInt(value, 10) / 100);
    };
    // ---------- TEXT OPERATIONS END ---------------

    // ---------- GLOBAL OPERATIONS -----------------
    CardDesign.prototype.copyObject = function() {
        var activeCanvas = this.getActiveCanvas();
        var object = fabric.util.object.clone(activeCanvas.getActiveObject());
        this.copyArray[0] = object;
    }
    CardDesign.prototype.cutObject = function() {
        this.copyObject();
        this.removeSelected();
    }
    CardDesign.prototype.pasteObject = function() {
        var activeCanvas = this.getActiveCanvas();
        var object = this.copyArray[0];
        object.set("top", object.top + 5);
        object.set("left", object.left + 5);
        activeCanvas.add(object);
        this.copyObject();
    }
    CardDesign.prototype.getFill = function() {
        return this.getActiveStyle('fill');
    };
    CardDesign.prototype.setFill = function(value) {
        this.setActiveStyle('fill', value);
    };

    CardDesign.prototype.appendToColor = function() {
        var colors = this.options.colors;
        var colorArea = document.getElementById("color-area");
        var colorPalette = document.getElementById("color-palette");

        for (var i = 0; i < colors.length; i++) {
            var colorElement = document.createElement("li");
            colorElement.style.backgroundColor = colors[i];
            colorPalette.appendChild(colorElement);
        }
    }

    CardDesign.prototype.bringToFront = function() {
        var activeCanvas = this.getActiveCanvas();
        var activeObject = activeCanvas.getActiveObject();
        if (activeObject) {
            activeCanvas.bringToFront(activeObject);
        }
    };

    CardDesign.prototype.sendToBack = function() {
        var activeCanvas = this.getActiveCanvas();
        var activeObject = activeCanvas.getActiveObject();
        if (activeObject) {
            activeCanvas.sendToBack(activeObject);
        }
    };

    // ---------- GLOBAL OPERATIONS END -------------

    CardDesign.prototype.toJSON = function() {
        var model = {
            front: "",
            back: "",
            isConfirmed: false,
        };

        model.front = JSON.stringify(this.front_canvas);
        model.back = JSON.stringify(this.back_canvas);
        model.isConfirmed = false;

        return model;
    };

    CardDesign.prototype.rasterize = function(side) {
        var self = this;
        switch (side) {
            case "front":
                var activeCanvas = self.front_canvas;
                break;

            case "back":
                var activeCanvas = self.back_canvas;
                break;
        }

        if (!fabric.Canvas.supports('toDataURL')) {
            alert('This browser doesn\'t provide means to serialize canvas to an image');
        } else {
            return activeCanvas.toDataURL('png');
        }
    };

    CardDesign.prototype.rasterizeJSON = function() {
        var self = this;
        var activeJson = this.setConsoleJSON(JSON.stringify(self.front_canvas),
            JSON.stringify(self.back_canvas));
        return activeJson;
    };

    CardDesign.prototype.setConsoleJSON = function(frontValue, backValue) {
        var jsons = {
            "frontJson": frontValue,
            "backJson": backValue
        }
        return jsons;
    };



    function getRandomLeftTop() {
        var offset = 50;
        return {
            left: fabric.util.getRandomInt(0 + offset, 700 - offset),
            top: fabric.util.getRandomInt(0 + offset, 500 - offset)
        };
    }

    var getRandomInt = fabric.util.getRandomInt;

    function getRandomColor() {
        return (
            pad(getRandomInt(0, 255).toString(16), 2) +
            pad(getRandomInt(0, 255).toString(16), 2) +
            pad(getRandomInt(0, 255).toString(16), 2)
        );
    };

    function pad(str, length) {
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    };

    CardDesign.prototype.setActiveProp = function(name, value) {
        var canvas = this.getActiveCanvas();
        var object = canvas.getActiveObject();
        if (!object) return;

        object.set(name, value).setCoords();
        canvas.renderAll();
    }

    CardDesign.prototype.getActiveProp = function(name) {
        var object = this.getActiveCanvas().getActiveObject();
        if (!object) return '';

        return object[name] || '';
    }

    CardDesign.getText = function() {
        return getActiveProp('text');
    };

    //Popup

    CardDesign.prototype.showPopup = function(data) {
        var popup = document.getElementById("cardDesignPopup").parentNode;
        switch (data) {
            case "edit":
                popup.classList.remove("image");
                popup.classList.remove("preview");
                popup.classList.add("edit");
                break;

            case "image":
                popup.classList.remove("edit");
                popup.classList.remove("preview");
                popup.classList.add("image");
                break;

            case "preview":
                popup.classList.remove("edit");
                popup.classList.remove("image");
                popup.classList.add("preview");
                break;

            default:
                popup.classList.remove("edit");
                popup.classList.remove("image");
                popup.classList.remove("preview");
                break;
        }
        popup.style.display = "block";
    }

    CardDesign.prototype.postData = function(type, url, data) {
        $.ajax({
            type: type,
            url: url,
            data: data,
            beforeSend: function(xhr) {
                var csrfInput = $("input[name=csrfmiddlewaretoken]");
                if (csrfInput) {
                    xhr.setRequestHeader("X-CSRFToken", csrfInput.val());
                }
            },
            success: function(data) {
                console.log("Data has been sent");
            }
        });
    }

    CardDesign.prototype.hidePopup = function() {
        var popup = document.getElementById("cardDesignPopup").parentNode;
        popup.style.display = "none";
    }

    CardDesign.prototype.autoSave = function() {
        var self = this;
        var json = self.rasterizeJSON();
        this.postData("POST", self.options.urls.autoSave, json);
    }

    return CardDesign;
})();
