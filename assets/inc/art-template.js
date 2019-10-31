/*! art-template@4.12.2 for browser | https://github.com/aui/art-template */ ! function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.template = t() : e.template = t()
}(this, function() {
    return function(e) {
        function t(r) {
            if (n[r]) return n[r].exports;
            var i = n[r] = {
                i: r,
                l: !1,
                exports: {}
            };
            return e[r].call(i.exports, i, i.exports, t), i.l = !0, i.exports
        }
        var n = {};
        return t.m = e, t.c = n, t.d = function(e, n, r) {
            t.o(e, n) || Object.defineProperty(e, n, {
                configurable: !1,
                enumerable: !0,
                get: r
            })
        }, t.n = function(e) {
            var n = e && e.__esModule ? function() {
                return e["default"]
            } : function() {
                return e
            };
            return t.d(n, "a", n), n
        }, t.o = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }, t.p = "", t(t.s = 6)
    }([function(e, t, n) {
        (function(t) {
            e.exports = !1;
            try {
                e.exports = "[object process]" === Object.prototype.toString.call(t.process)
            } catch (n) {}
        }).call(t, n(4))
    }, function(e, t, n) {
        "use strict";
        var r = n(8),
            i = n(3),
            o = n(23),
            s = function(e, t) {
                t.onerror(e, t);
                var n = function() {
                    return "{Template Error}"
                };
                return n.mappings = [], n.sourcesContent = [], n
            },
            a = function c(e) {
                var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                "string" != typeof e ? t = e : t.source = e, t = i.$extend(t), e = t.source, !0 === t.debug && (t.cache = !1, t.minimize = !1, t.compileDebug = !0), t.compileDebug && (t.minimize = !1), t.filename && (t.filename = t.resolveFilename(t.filename, t));
                var n = t.filename,
                    a = t.cache,
                    u = t.caches;
                if (a && n) {
                    var p = u.get(n);
                    if (p) return p
                }
                if (!e) try {
                    e = t.loader(n, t), t.source = e
                } catch (d) {
                    var l = new o({
                        name: "CompileError",
                        path: n,
                        message: "template not found: " + d.message,
                        stack: d.stack
                    });
                    if (t.bail) throw l;
                    return s(l, t)
                }
                var f = void 0,
                    h = new r(t);
                try {
                    f = h.build()
                } catch (l) {
                    if (l = new o(l), t.bail) throw l;
                    return s(l, t)
                }
                var m = function(e, n) {
                    try {
                        return f(e, n)
                    } catch (l) {
                        if (!t.compileDebug) return t.cache = !1, t.compileDebug = !0, c(t)(e, n);
                        if (l = new o(l), t.bail) throw l;
                        return s(l, t)()
                    }
                };
                return m.mappings = f.mappings, m.sourcesContent = f.sourcesContent, m.toString = function() {
                    return f.toString()
                }, a && n && u.set(n, m), m
            };
        a.Compiler = r, e.exports = a
    }, function(e, t) {
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t["default"] = /((['"])(?:(?!\2|\\).|\\(?:\r\n|[\s\S]))*(\2)?|`(?:[^`\\$]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{[^}]*\}?)*\}?)*(`)?)|(\/\/.*)|(\/\*(?:[^*]|\*(?!\/))*(\*\/)?)|(\/(?!\*)(?:\[(?:(?![\]\\]).|\\.)*\]|(?![\/\]\\]).|\\.)+\/(?:(?!\s*(?:\b|[\u0080-\uFFFF$\\'"~({]|[+\-!](?!=)|\.?\d))|[gmiyu]{1,5}\b(?![\u0080-\uFFFF$\\]|\s*(?:[+\-*%&|^<>!=?({]|\/(?![\/*])))))|(0[xX][\da-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?)|((?!\d)(?:(?!\s)[$\w\u0080-\uFFFF]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+)|(--|\+\+|&&|\|\||=>|\.{3}|(?:[+\-\/%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2})=?|[?~.,:;[\](){}])|(\s+)|(^$|[\s\S])/g, t.matchToToken = function(e) {
            var t = {
                type: "invalid",
                value: e[0]
            };
            return e[1] ? (t.type = "string", t.closed = !(!e[3] && !e[4])) : e[5] ? t.type = "comment" : e[6] ? (t.type = "comment", t.closed = !!e[7]) : e[8] ? t.type = "regex" : e[9] ? t.type = "number" : e[10] ? t.type = "name" : e[11] ? t.type = "punctuator" : e[12] && (t.type = "whitespace"), t
        }
    }, function(e, t, n) {
        "use strict";

        function r() {
            this.$extend = function(e) {
                return e = e || {}, s(e, e instanceof r ? e : this)
            }
        }
        var i = n(0),
            o = n(12),
            s = n(13),
            a = n(14),
            c = n(15),
            u = n(16),
            p = n(17),
            l = n(18),
            f = n(19),
            h = n(20),
            m = n(22),
            d = {
                source: null,
                filename: null,
                rules: [f, l],
                escape: !0,
                debug: !!i && "production" !== process.env.NODE_ENV,
                bail: !0,
                cache: !0,
                minimize: !0,
                compileDebug: !1,
                resolveFilename: m,
                include: a,
                htmlMinifier: h,
                htmlMinifierOptions: {
                    collapseWhitespace: !0,
                    minifyCSS: !0,
                    minifyJS: !0,
                    ignoreCustomFragments: []
                },
                onerror: c,
                loader: p,
                caches: u,
                root: "/",
                extname: ".art",
                ignore: [],
                imports: o
            };
        r.prototype = d, e.exports = new r
    }, function(e, t) {
        var n;
        n = function() {
            return this
        }();
        try {
            n = n || Function("return this")() || (0, eval)("this")
        } catch (r) {
            "object" == typeof window && (n = window)
        }
        e.exports = n
    }, function(e, t) {}, function(e, t, n) {
        "use strict";
        var r = n(7),
            i = n(1),
            o = n(24),
            s = function(e, t) {
                return t instanceof Object ? r({
                    filename: e
                }, t) : i({
                    filename: e,
                    source: t
                })
            };
        s.render = r, s.compile = i, s.defaults = o, e.exports = s
    }, function(e, t, n) {
        "use strict";
        var r = n(1),
            i = function(e, t, n) {
                return r(e, n)(t)
            };
        e.exports = i
    }, function(e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = n(9),
            o = n(11),
            s = "$data",
            a = "$imports",
            c = "print",
            u = "include",
            p = "extend",
            l = "block",
            f = "$$out",
            h = "$$line",
            m = "$$blocks",
            d = "$$slice",
            v = "$$from",
            g = "$$options",
            y = function(e, t) {
                return Object.hasOwnProperty.call(e, t)
            },
            b = JSON.stringify,
            x = function() {
                function e(t) {
                    var n, i, y = this;
                    r(this, e);
                    var b = t.source,
                        x = t.minimize,
                        w = t.htmlMinifier;
                    if (this.options = t, this.stacks = [], this.context = [], this.scripts = [], this.CONTEXT_MAP = {}, this.ignore = [s, a, g].concat(t.ignore), this.internal = (n = {}, n[f] = "''", n[h] = "[0,0]", n[m] = "arguments[1]||{}", n[v] = "null", n[c] = "function(){var s=''.concat.apply('',arguments);" + f + "+=s;return s}", n[u] = "function(src,data){var s=" + g + ".include(src,data||" + s + ",arguments[2]||" + m + "," + g + ");" + f + "+=s;return s}", n[p] = "function(from){" + v + "=from}", n[d] = "function(c,p,s){p=" + f + ";" + f + "='';c();s=" + f + ";" + f + "=p+s;return s}", n[l] = "function(){var a=arguments,s;if(typeof a[0]==='function'){return " + d + "(a[0])}else if(" + v + "){if(!" + m + "[a[0]]){" + m + "[a[0]]=" + d + "(a[1])}else{" + f + "+=" + m + "[a[0]]}}else{s=" + m + "[a[0]];if(typeof s==='string'){" + f + "+=s}else{s=" + d + "(a[1])}return s}}", n), this.dependencies = (i = {}, i[c] = [f], i[u] = [f, g, s, m], i[p] = [v, u], i[l] = [d, v, f, m], i), this.importContext(f), t.compileDebug && this.importContext(h), x) try {
                        b = w(b, t)
                    } catch (E) {}
                    this.source = b, this.getTplTokens(b, t.rules, this).forEach(function(e) {
                        e.type === o.TYPE_STRING ? y.parseString(e) : y.parseExpression(e)
                    })
                }
                return e.prototype.getTplTokens = function() {
                    return o.apply(undefined, arguments)
                }, e.prototype.getEsTokens = function(e) {
                    return i(e)
                }, e.prototype.getVariables = function(e) {
                    var t = !1;
                    return e.filter(function(e) {
                        return "whitespace" !== e.type && "comment" !== e.type
                    }).filter(function(e) {
                        return "name" === e.type && !t || (t = "punctuator" === e.type && "." === e.value, !1)
                    }).map(function(e) {
                        return e.value
                    })
                }, e.prototype.importContext = function(e) {
                    var t = this,
                        n = "",
                        r = this.internal,
                        i = this.dependencies,
                        o = this.ignore,
                        c = this.context,
                        u = this.options,
                        p = u.imports,
                        l = this.CONTEXT_MAP;
                    y(l, e) || -1 !== o.indexOf(e) || (y(r, e) ? (n = r[e], y(i, e) && i[e].forEach(function(e) {
                        return t.importContext(e)
                    })) : n = "$escape" === e || "$each" === e || y(p, e) ? a + "." + e : s + "." + e, l[e] = n, c.push({
                        name: e,
                        value: n
                    }))
                }, e.prototype.parseString = function(e) {
                    var t = e.value;
                    if (t) {
                        var n = f + "+=" + b(t);
                        this.scripts.push({
                            source: t,
                            tplToken: e,
                            code: n
                        })
                    }
                }, e.prototype.parseExpression = function(e) {
                    var t = this,
                        n = e.value,
                        r = e.script,
                        i = r.output,
                        s = this.options.escape,
                        a = r.code;
                    i && (a = !1 === s || i === o.TYPE_RAW ? f + "+=" + r.code : f + "+=$escape(" + r.code + ")");
                    var c = this.getEsTokens(a);
                    this.getVariables(c).forEach(function(e) {
                        return t.importContext(e)
                    }), this.scripts.push({
                        source: n,
                        tplToken: e,
                        code: a
                    })
                }, e.prototype.checkExpression = function(e) {
                    for (var t = [
                            [/^\s*}[\w\W]*?{?[\s;]*$/, ""],
                            [/(^[\w\W]*?\([\w\W]*?(?:=>|\([\w\W]*?\))\s*{[\s;]*$)/, "$1})"],
                            [/(^[\w\W]*?\([\w\W]*?\)\s*{[\s;]*$)/, "$1}"]
                        ], n = 0; n < t.length;) {
                        if (t[n][0].test(e)) {
                            var r;
                            e = (r = e).replace.apply(r, t[n]);
                            break
                        }
                        n++
                    }
                    try {
                        return new Function(e), !0
                    } catch (i) {
                        return !1
                    }
                }, e.prototype.build = function() {
                    var e = this.options,
                        t = this.context,
                        n = this.scripts,
                        r = this.stacks,
                        i = this.source,
                        c = e.filename,
                        l = e.imports,
                        d = [],
                        x = y(this.CONTEXT_MAP, p),
                        w = 0,
                        E = function(e, t) {
                            var n = t.line,
                                i = t.start,
                                o = {
                                    generated: {
                                        line: r.length + w + 1,
                                        column: 1
                                    },
                                    original: {
                                        line: n + 1,
                                        column: i + 1
                                    }
                                };
                            return w += e.split(/\n/).length - 1, o
                        },
                        k = function(e) {
                            return e.replace(/^[\t ]+|[\t ]$/g, "")
                        };
                    r.push("function(" + s + "){"), r.push("'use strict'"), r.push(s + "=" + s + "||{}"), r.push("var " + t.map(function(e) {
                        return e.name + "=" + e.value
                    }).join(",")), e.compileDebug ? (r.push("try{"), n.forEach(function(e) {
                        e.tplToken.type === o.TYPE_EXPRESSION && r.push(h + "=[" + [e.tplToken.line, e.tplToken.start].join(",") + "]"), d.push(E(e.code, e.tplToken)), r.push(k(e.code))
                    }), r.push("}catch(error){"), r.push("throw {" + ["name:'RuntimeError'", "path:" + b(c), "message:error.message", "line:" + h + "[0]+1", "column:" + h + "[1]+1", "source:" + b(i), "stack:error.stack"].join(",") + "}"), r.push("}")) : n.forEach(function(e) {
                        d.push(E(e.code, e.tplToken)), r.push(k(e.code))
                    }), x && (r.push(f + "=''"), r.push(u + "(" + v + "," + s + "," + m + ")")), r.push("return " + f), r.push("}");
                    var T = r.join("\n");
                    try {
                        var O = new Function(a, g, "return " + T)(l, e);
                        return O.mappings = d, O.sourcesContent = [i], O
                    } catch (F) {
                        for (var $ = 0, j = 0, S = 0, _ = void 0; $ < n.length;) {
                            var C = n[$];
                            if (!this.checkExpression(C.code)) {
                                j = C.tplToken.line, S = C.tplToken.start, _ = C.code;
                                break
                            }
                            $++
                        }
                        throw {
                            name: "CompileError",
                            path: c,
                            message: F.message,
                            line: j + 1,
                            column: S + 1,
                            source: i,
                            generated: _,
                            stack: F.stack
                        }
                    }
                }, e
            }();
        x.CONSTS = {
            DATA: s,
            IMPORTS: a,
            PRINT: c,
            INCLUDE: u,
            EXTEND: p,
            BLOCK: l,
            OPTIONS: g,
            OUT: f,
            LINE: h,
            BLOCKS: m,
            SLICE: d,
            FROM: v,
            ESCAPE: "$escape",
            EACH: "$each"
        }, e.exports = x
    }, function(e, t, n) {
        "use strict";
        var r = n(10),
            i = n(2)["default"],
            o = n(2).matchToToken,
            s = function(e) {
                return e.match(i).map(function(e) {
                    return i.lastIndex = 0, o(i.exec(e))
                }).map(function(e) {
                    return "name" === e.type && r(e.value) && (e.type = "keyword"), e
                })
            };
        e.exports = s
    }, function(e, t, n) {
        "use strict";
        var r = {
            "abstract": !0,
            await: !0,
            "boolean": !0,
            "break": !0,
            "byte": !0,
            "case": !0,
            "catch": !0,
            "char": !0,
            "class": !0,
            "const": !0,
            "continue": !0,
            "debugger": !0,
            "default": !0,
            "delete": !0,
            "do": !0,
            "double": !0,
            "else": !0,
            "enum": !0,
            "export": !0,
            "extends": !0,
            "false": !0,
            "final": !0,
            "finally": !0,
            "float": !0,
            "for": !0,
            "function": !0,
            "goto": !0,
            "if": !0,
            "implements": !0,
            "import": !0,
            "in": !0,
            "instanceof": !0,
            "int": !0,
            "interface": !0,
            "let": !0,
            "long": !0,
            "native": !0,
            "new": !0,
            "null": !0,
            "package": !0,
            "private": !0,
            "protected": !0,
            "public": !0,
            "return": !0,
            "short": !0,
            "static": !0,
            "super": !0,
            "switch": !0,
            "synchronized": !0,
            "this": !0,
            "throw": !0,
            "transient": !0,
            "true": !0,
            "try": !0,
            "typeof": !0,
            "var": !0,
            "void": !0,
            "volatile": !0,
            "while": !0,
            "with": !0,
            "yield": !0
        };
        e.exports = function(e) {
            return r.hasOwnProperty(e)
        }
    }, function(e, t, n) {
        "use strict";

        function r(e, t, n, r) {
            var i = new String(e);
            return i.line = t, i.start = n, i.end = r, i
        }
        var i = function(e, t) {
            for (var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}, i = [{
                    type: "string",
                    value: e,
                    line: 0,
                    start: 0,
                    end: e.length
                }], o = 0; o < t.length; o++) ! function(e) {
                for (var t = e.test.ignoreCase ? "ig" : "g", o = e.test.source + "|^$|[\\w\\W]", s = new RegExp(o, t), a = 0; a < i.length; a++)
                    if ("string" === i[a].type) {
                        for (var c = i[a].line, u = i[a].start, p = i[a].end, l = i[a].value.match(s), f = [], h = 0; h < l.length; h++) {
                            var m = l[h];
                            e.test.lastIndex = 0;
                            var d = e.test.exec(m),
                                v = d ? "expression" : "string",
                                g = f[f.length - 1],
                                y = g || i[a],
                                b = y.value;
                            u = y.line === c ? g ? g.end : u : b.length - b.lastIndexOf("\n") - 1, p = u + m.length;
                            var x = {
                                type: v,
                                value: m,
                                line: c,
                                start: u,
                                end: p
                            };
                            if ("string" === v) g && "string" === g.type ? (g.value += m, g.end += m.length) : f.push(x);
                            else {
                                d[0] = new r(d[0], c, u, p);
                                var w = e.use.apply(n, d);
                                x.script = w, f.push(x)
                            }
                            c += m.split(/\n/).length - 1
                        }
                        i.splice.apply(i, [a, 1].concat(f)), a += f.length - 1
                    }
            }(t[o]);
            return i
        };
        i.TYPE_STRING = "string", i.TYPE_EXPRESSION = "expression", i.TYPE_RAW = "raw", i.TYPE_ESCAPE = "escape", e.exports = i
    }, function(e, t, n) {
        "use strict";
        (function(t) {
            function r(e) {
                return "string" != typeof e && (e = e === undefined || null === e ? "" : "function" == typeof e ? r(e.call(e)) : JSON.stringify(e)), e
            }

            function i(e) {
                var t = "" + e,
                    n = a.exec(t);
                if (!n) return e;
                var r = "",
                    i = void 0,
                    o = void 0,
                    s = void 0;
                for (i = n.index, o = 0; i < t.length; i++) {
                    switch (t.charCodeAt(i)) {
                        case 34:
                            s = "&#34;";
                            break;
                        case 38:
                            s = "&#38;";
                            break;
                        case 39:
                            s = "&#39;";
                            break;
                        case 60:
                            s = "&#60;";
                            break;
                        case 62:
                            s = "&#62;";
                            break;
                        default:
                            continue
                    }
                    o !== i && (r += t.substring(o, i)), o = i + 1, r += s
                }
                return o !== i ? r + t.substring(o, i) : r
            } /*! art-template@runtime | https://github.com/aui/art-template */
            var o = n(0),
                s = Object.create(o ? t : window),
                a = /["&'<>]/;
            s.$escape = function(e) {
                return i(r(e))
            }, s.$each = function(e, t) {
                if (Array.isArray(e))
                    for (var n = 0, r = e.length; n < r; n++) t(e[n], n);
                else
                    for (var i in e) t(e[i], i)
            }, e.exports = s
        }).call(t, n(4))
    }, function(e, t, n) {
        "use strict";
        var r = Object.prototype.toString,
            i = function(e) {
                return null === e ? "Null" : r.call(e).slice(8, -1)
            },
            o = function s(e, t) {
                var n = void 0,
                    r = i(e);
                if ("Object" === r ? n = Object.create(t || {}) : "Array" === r && (n = [].concat(t || [])), n) {
                    for (var o in e) Object.hasOwnProperty.call(e, o) && (n[o] = s(e[o], n[o]));
                    return n
                }
                return e
            };
        e.exports = o
    }, function(e, t, n) {
        "use strict";
        var r = function(e, t, r, i) {
            var o = n(1);
            return i = i.$extend({
                filename: i.resolveFilename(e, i),
                bail: !0,
                source: null
            }), o(i)(t, r)
        };
        e.exports = r
    }, function(e, t, n) {
        "use strict";
        var r = function(e) {
            console.error(e.name, e.message)
        };
        e.exports = r
    }, function(e, t, n) {
        "use strict";
        var r = {
            __data: Object.create(null),
            set: function(e, t) {
                this.__data[e] = t
            },
            get: function(e) {
                return this.__data[e]
            },
            reset: function() {
                this.__data = {}
            }
        };
        e.exports = r
    }, function(e, t, n) {
        "use strict";
        var r = n(0),
            i = function(e) {
                if (r) {
                    return n(5).readFileSync(e, "utf8")
                }
                var t = document.getElementById(e);
                return t.value || t.innerHTML
            };
        e.exports = i
    }, function(e, t, n) {
        "use strict";
        var r = {
            test: /{{([@#]?)[ \t]*(\/?)([\w\W]*?)[ \t]*}}/,
            use: function(e, t, n, i) {
                var o = this,
                    s = o.options,
                    a = o.getEsTokens(i),
                    c = a.map(function(e) {
                        return e.value
                    }),
                    u = {},
                    p = void 0,
                    l = !!t && "raw",
                    f = n + c.shift(),
                    h = function(t, n) {
                        console.warn((s.filename || "anonymous") + ":" + (e.line + 1) + ":" + (e.start + 1) + "\nTemplate upgrade: {{" + t + "}} -> {{" + n + "}}")
                    };
                switch ("#" === t && h("#value", "@value"), f) {
                    case "set":
                        i = "var " + c.join("").trim();
                        break;
                    case "if":
                        i = "if(" + c.join("").trim() + "){";
                        break;
                    case "else":
                        var m = c.indexOf("if");
                        ~m ? (c.splice(0, m + 1), i = "}else if(" + c.join("").trim() + "){") : i = "}else{";
                        break;
                    case "/if":
                        i = "}";
                        break;
                    case "each":
                        p = r._split(a), p.shift(), "as" === p[1] && (h("each object as value index", "each object value index"), p.splice(1, 1));
                        i = "$each(" + (p[0] || "$data") + ",function(" + (p[1] || "$value") + "," + (p[2] || "$index") + "){";
                        break;
                    case "/each":
                        i = "})";
                        break;
                    case "block":
                        p = r._split(a), p.shift(), i = "block(" + p.join(",").trim() + ",function(){";
                        break;
                    case "/block":
                        i = "})";
                        break;
                    case "echo":
                        f = "print", h("echo value", "value");
                    case "print":
                    case "include":
                    case "extend":
                        if (0 !== c.join("").trim().indexOf("(")) {
                            p = r._split(a), p.shift(), i = f + "(" + p.join(",") + ")";
                            break
                        }
                    default:
                        if (~c.indexOf("|")) {
                            var d = a.reduce(function(e, t) {
                                var n = t.value,
                                    r = t.type;
                                return "|" === n ? e.push([]) : "whitespace" !== r && "comment" !== r && (e.length || e.push([]), ":" === n && 1 === e[e.length - 1].length ? h("value | filter: argv", "value | filter argv") : e[e.length - 1].push(t)), e
                            }, []).map(function(e) {
                                return r._split(e)
                            });
                            i = d.reduce(function(e, t) {
                                var n = t.shift();
                                return t.unshift(e), "$imports." + n + "(" + t.join(",") + ")"
                            }, d.shift().join(" ").trim())
                        }
                        l = l || "escape"
                }
                return u.code = i, u.output = l, u
            },
            _split: function(e) {
                e = e.filter(function(e) {
                    var t = e.type;
                    return "whitespace" !== t && "comment" !== t
                });
                for (var t = 0, n = e.shift(), r = /\]|\)/, i = [
                        [n]
                    ]; t < e.length;) {
                    var o = e[t];
                    "punctuator" === o.type || "punctuator" === n.type && !r.test(n.value) ? i[i.length - 1].push(o) : i.push([o]), n = o, t++
                }
                return i.map(function(e) {
                    return e.map(function(e) {
                        return e.value
                    }).join("")
                })
            }
        };
        e.exports = r
    }, function(e, t, n) {
        "use strict";
        var r = {
            test: /<%(#?)((?:==|=#|[=-])?)[ \t]*([\w\W]*?)[ \t]*(-?)%>/,
            use: function(e, t, n, r) {
                return n = {
                    "-": "raw",
                    "=": "escape",
                    "": !1,
                    "==": "raw",
                    "=#": "raw"
                }[n], t && (r = "/*" + r + "*/", n = !1), {
                    code: r,
                    output: n
                }
            }
        };
        e.exports = r
    }, function(e, t, n) {
        "use strict";
        var r = n(0),
            i = function(e, t) {
                if (r) {
                    var i, o = n(21).minify,
                        s = t.htmlMinifierOptions,
                        a = t.rules.map(function(e) {
                            return e.test
                        });
                    (i = s.ignoreCustomFragments).push.apply(i, a), e = o(e, s)
                }
                return e
            };
        e.exports = i
    }, function(e, t) {
        ! function(e) {
            e.noop = function() {}
        }("object" == typeof e && "object" == typeof e.exports ? e.exports : window)
    }, function(e, t, n) {
        "use strict";
        var r = n(0),
            i = /^\.+\//,
            o = function(e, t) {
                if (r) {
                    var o = n(5),
                        s = t.root,
                        a = t.extname;
                    if (i.test(e)) {
                        var c = t.filename,
                            u = !c || e === c,
                            p = u ? s : o.dirname(c);
                        e = o.resolve(p, e)
                    } else e = o.resolve(s, e);
                    o.extname(e) || (e += a)
                }
                return e
            };
        e.exports = o
    }, function(e, t, n) {
        "use strict";

        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        function s(e) {
            var t = e.name,
                n = e.source,
                r = e.path,
                i = e.line,
                o = e.column,
                s = e.generated,
                a = e.message;
            if (!n) return a;
            var c = n.split(/\n/),
                u = Math.max(i - 3, 0),
                p = Math.min(c.length, i + 3),
                l = c.slice(u, p).map(function(e, t) {
                    var n = t + u + 1;
                    return (n === i ? " >> " : "    ") + n + "| " + e
                }).join("\n");
            return (r || "anonymous") + ":" + i + ":" + o + "\n" + l + "\n\n" + t + ": " + a + (s ? "\n   generated: " + s : "")
        }
        var a = function(e) {
            function t(n) {
                r(this, t);
                var o = i(this, e.call(this, n.message));
                return o.name = "TemplateError", o.message = s(n), Error.captureStackTrace && Error.captureStackTrace(o, o.constructor), o
            }
            return o(t, e), t
        }(Error);
        e.exports = a
    }, function(e, t, n) {
        "use strict";
        e.exports = n(3)
    }])
});

//模块扩展
if (template) {
    template.defaults.escape = false;
    template.defaults.imports.getFullName = function(aid) {
            return Area.getFullName(aid);
        }
        //时间戳转时间对象
    template.defaults.imports.formatDate = function(timestamp, formats) {
            return app.formatDate(timestamp, formats);
        }
        //textarae
    template.defaults.imports.split = function(content) {
        content = content == null || content == "null" ? '' : content;
        content = content.replace(/\n/g, "<br/>");
        return content;
    }
    template.defaults.imports.OSS = function(url, type) {
        if (url && url.indexOf(",") > 0) {
            url = url.split(",")[0];
        }
        return Comm.OSS.getImgUrl(url, type)
    }
    template.defaults.imports.conunm = function(v, d) {
        return app.conunm(v, d)
    } 
    template.defaults.imports.format = function(v, d) {
        //   	 if (typeof(v) == typeof("")) {
        //          v = v.replace(/-/g, "/").replace(/\.0/g, "")
        //      }
        //      var myDate = v ? new Date(v) : new Date();
        //
        //      var year = myDate.getFullYear();
        return v;
    }
    template.defaults.imports.priceTp = function(pv) {
        return app.price(pv)
    }

    template.defaults.imports.addPrice = function(v1, v2) {
            var price = parseFloat(v1 || 0) + parseFloat(v2 || 0);
            return app.price(price);
        }
        //电话处理
    template.defaults.imports.phones = function(f) {
            var tel = f;
            tel = "" + tel;
            var reg = /(\d{3})\d{4}(\d{4})/;
            var tel1 = tel.replace(reg, "$1****$2")
            return tel1;
        }
        //千米转换
    template.defaults.imports.faraway = function(f) {
            if (f < 1000) {
                return f + 'm';
            } else {
                return (Math.round(f / 100) / 10).toFixed(1) + 'km'
            }
        }
//      //数字转换
//  template.defaults.imports.conunm = function(v, d) {
//          if (v == undefined) {
//              return 0;
//          }
//          if (v == 0) {
//              return v;
//          }
//          if (d == undefined) {
//              d = 3;
//          }
//          if (v > 10000) {
//              return (Number(v) / 10000).toFixed(d) + "万"
//          }
//          if (v != null && v != "" && v != undefined) {
//              if (v.toString().indexOf(".") >= 0) {
//                  //四舍五入
//                  return Number(v).toFixed(d);
//              } else {
//                  return v;
//              }
//          }
//      }
        //时间转换
    template.defaults.imports.sldate = function formatMsgTime(timespan) {
        if (timespan) {
            timespan = timespan.replace(/-/g, "/").replace(/\.0/g, "")
            var dateTime = new Date(timespan);

            var year = dateTime.getFullYear();
            var month = dateTime.getMonth() + 1;
            var day = dateTime.getDate();
            var hour = dateTime.getHours();
            var minute = dateTime.getMinutes();
            var second = dateTime.getSeconds();
            var now = new Date();
            var now_new = now.getTime(); //typescript转换写法

            var milliseconds = 0;
            var timeSpanStr;

            milliseconds = now_new - dateTime.getTime();
            if (milliseconds <= 1000 * 60 * 1) {
                timeSpanStr = '刚刚';
            } else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
                timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
            } else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
                timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
            } else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 7) {

                timeSpanStr = month + '-' + day;
            } else if (milliseconds > 1000 * 60 * 60 * 24 * 1 && year == now.getFullYear()) {
                timeSpanStr = month + '-' + day;

            } else {
                timeSpanStr = year + '-' + month + '-' + day;

            }

            return timeSpanStr;
        }
        return ''
    };
    //秒数转换
    template.defaults.imports.miaochange = function formatMsgTime(timespan) {
        var secondTime = parseInt(timespan); // 秒
        var minuteTime = 0; // 分
        var hourTime = 0; // 小时
        if (secondTime > 60) { //如果秒数大于60，将秒数转换成整数
            //获取分钟，除以60取整数，得到整数分钟
            minuteTime = parseInt(secondTime / 60);
            //获取秒数，秒数取佘，得到整数秒数
            secondTime = parseInt(secondTime % 60);
            //如果分钟大于60，将分钟转换成小时
            if (minuteTime > 60) {
                //获取小时，获取分钟除以60，得到整数小时
                hourTime = parseInt(minuteTime / 60);
                //获取小时后取佘的分，获取分钟除以60取佘的分
                minuteTime = parseInt(minuteTime % 60);
            }
        }
        var result = "00:" + parseInt(secondTime);

        if (minuteTime > 0) {
            result = "" + parseInt(minuteTime) + ":" + result;
        }
        if (hourTime > 0) {
            result = "" + parseInt(hourTime) + ":" + result;
        }
        return result;
    };

}

//标签
template.defaults.imports.sllabelName = function(s) {
    if (s) {
        s = s.split(',');
        var h = []
        if (s && s.length > 0) {
            for (var i = 0; i < s.length; i++) {
                h.push('<span>' + s[i] + '</span>')
            }
        }
        return h.join('');
    }
    return ''
}

template.defaults.imports.repcontent = function(con, id, bg) {

    var div = Comm.g('hidediv');
    if (!div) {
        div = document.createElement("div")
        div.id = "hidediv";
        div.style.visibility = "hidden";
        document.body.appendChild(div);
    }
    div.innerHTML = con.replace(/<div>|<\/div>/gi, "");
    if ($(div).height() >= 210) {
        var clon = $(div).clone();
        var hm = [];
        var len = 0;
        var siall = true;
        $(div).find('*').each(function(i, e) {
            len += $(e).text().length
            if (siall && $(e).text().length > 0 && (i > 10 || len > 150)) {
                if (i == 0) {
                    $(e).html($(e).html().substring(0, 150));
                }
                siall = false;
            } else if (i > 10 || len > 150) {
            	
                $(e).remove();
            }
           
        });
        var i = $(div).html().lastIndexOf("</div>");
        var ii = $(div).html().lastIndexOf("</p>");
		
        if (i == $(div).html().length - 6) {
            $(div).find('*').each(function(z, e) {
            	
                if ((z + 1) == $(div).find('*').length) {
                    $(div).append('<span>...</span><a onclick="Comm.go(\'articleDetail.html?newsId=' + id + '\');event.stopPropagation()" style="color: #098E75;">全部</a>');
                		
                }
            });
        } else if (ii == $(div).html().length - 4) {
            $(div).find('*').each(function(i, e) {
                if ((i + 1) == $(div).find('*').length) {
                    $(div).append('<span>...</span><a onclick="Comm.go(\'articleDetail.html?newsId=' + id + '\');event.stopPropagation()" style="color: #098E75;">全部</a>');
                }
            });
        } else {
        		$(div).html($(div).html().substring(0, 240))
            $(div).append('<span>...</span><a onclick="Comm.go(\'articleDetail.html?newsId=' + id + '\');event.stopPropagation()" style="color: #098E75;">全部</a>');
        }

        $(div).remove();
        var mor = "";
        console.log($(div).html());
        console.log('ssss'+id)
       return con = $(div).html();
//      return con = '<div style="position: relative;" class="conv_"><div class="" style="">' + $(div).html() + '</div>' + mor + '</div>';
    } else {
        $(div).remove();
        return con;
    }

    var con2 = "";
    if (con) {
        if (con.indexOf('<br/>') >= 0) {

            var con1 = con.split('<br/>');
            for (var i = 0; i < con1.length; i++) {
                if (con1[i] == undefined || con1[i] == "") {
                    con1.splice(i, 1);
                    i = i - 1; // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位，
                    // 这样才能真正去掉空元素,觉得这句可以删掉的连续为空试试，然后思考其中逻辑
                }
            }
            var num = 0;
            for (var k = 0; k < con1.length; k++) {
                if (num < 10) {
                    if (con1[k].length > 24) {
                        num += Math.ceil(con1[k].length / 24);
                    } else {
                        num++;
                    }
                }
                if (num >= 10) {
                    for (var l = 0; l < k + 1; l++) {
                        con2 += con1[l] + "<br/>"
                    }
                    if (con2.length > 240) {
                        con2 = con2.substring(0, 240) + '...<a onclick="Comm.go(\'articleDetail.html?newsId=' + id + '\');event.stopPropagation()" style="color: #098E75;">全部</a>';
                    } else {
                        con2 = con2.substring(0, con2.length - 5) + '...<a onclick="Comm.go(\'articleDetail.html?newsId=' + id + '\');event.stopPropagation()" style="color: #098E75;">全部</a>';
                    }
                    return con2;
                }
            }
            if (num = 0) {
                if (con1.length >= 10) {
                    con = con1[0] + '<br/>' + con1[1] + '<br/>' + con1[2] + '<br/>' + con1[3] + '<br/>' + con1[4] + '<br/>' + con1[5] + '<br/>' + con1[6] + '<br/>' + con1[7] + '<br/>' + con1[8] + '<br/>' + con1[9].substring(0, 60) + '...<a onclick="Comm.go(\'articleDetail.html?newsId=' + id + '\');event.stopPropagation()" style="color: #098E75;">全部</a>';
                }
            }

        } else if (con.replace(/<\/?.+?>/g, "").replace(/ /g, "").length / 10 > 24) {
            var atLen = con.split('@').length;
            console.log(atLen)
            con = con.substring(0, 240 + (atLen * 90)) + '...<a onclick="Comm.go(\'articleDetail.html?newsId=' + id + '\');event.stopPropagation()" style="color: #098E75;">全部</a>';
        }
    }
    return con;
}
template.defaults.imports.getClassName = function(year) {
    var classObj = app.getGradeByStudentYearAndTime(year);
    return classObj[0].rs;
}

template.defaults.imports.imgTpl = function(d, h, w) {
    return imgTpl ? imgTpl.init(d, h, w) : '您没有引用tpl.js';
}
template.defaults.imports.hotQues = function(d, c, k, mid) {
    var html = '';
    html += '<div class="mart10 lh20"  id="' + d.newsId + '">';
    if (c == 1 && k == 0) {
        html += '<img class="fl" style="margin-top: 2px;" src="img/index/w1.png" width="17" height="15" />';
    } else if (c == 1 && k == 1) {
        html += '<img class="fl" style="margin-top: 2px;" src="img/index/w2.png" width="17" height="15" />';
    } else if (c == 1 && k == 2) {
        html += '<img class="fl" style="margin-top: 2px;" src="img/index/w3.png" width="17" height="15" />';
    } else {
        html += '<div class="fl" style="width:16px;height:17px"></div>';
    }
    html += '<div style="width:80%;font-family: Arial;" class="fl color333 marl10 wordW">' + d.title + '</div><div style="width:10%"class="fl tright" onclick="showWindow1(' + (d.publishCustomerId == mid ? "1" : "2") + ');model.qh(' + d.newsId + ');event.stopPropagation();"><img src="img/index/more.png" width="18"/></div>';
    html += '<div class="clearfix"></div><div class="hotData"onclick="model.go(' + d.commentNumber + ',' + d.commentId + ',' + d.newsId + ')"><span class="item arrow-top"></span><div class="">';
    html += '<div class="fl f12 color999" style="width:80%">热门回答  ' + app.conunm(d.commentNumber) + '</div>';
    html += '</div><div class="clearfix"></div><div style="margin-top: 2px;"><div style="width:80%" class="fl flex">';
    html += '<span class="color038 wordW f12" style="display:inline-block;max-width:20%">' + d.customerName + '</span><span class="color038 f12">：</span><span class="color999 wordW f12" style="display:inline-block;max-width:76%;font-family: Arial;">' + d.content + '</span></div><div class="fr f12 center" style="width:20%"><img src="img/index/'+(d.isPraise==0?"zan":"dzan")+'.png" width="14" height="12" style="margin:-2px 0 0 0;object-fit: contain;"/><span style="margin-left:3px;" class="f12 color999">' + app.conunm(d.praiseNumber) + '</span></div>';
    html += '<div class="clearfix"></div></div><div class="clearfix"></div>' + imgTpl.init(d.newsImg.split(','), 1024) + '</div></div>';
    return html;
}