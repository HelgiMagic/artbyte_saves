/*!
 * jQuery Form Plugin
 * version: 4.2.1
 * Requires jQuery v1.7 or later
 * Copyright 2017 Kevin Morris
 * Copyright 2006 M. Alsup
 * Project repository: https://github.com/jquery-form/form
 * Dual licensed under the MIT and LGPLv3 licenses.
 * https://github.com/jquery-form/form#license
 */
!(function (a) {
  'function' == typeof define && define.amd
    ? define(['jquery'], a)
    : 'object' == typeof module && module.exports
    ? (module.exports = function (b, c) {
        return void 0 === c && (c = 'undefined' != typeof window ? require('jquery') : require('jquery')(b)), a(c), c;
      })
    : a(jQuery);
})(function (a) {
  'use strict';
  function b(b) {
    var c = b.data;
    b.isDefaultPrevented() || (b.preventDefault(), a(b.target).closest('form').ajaxSubmit(c));
  }
  function c(b) {
    var c = b.target,
      d = a(c);
    if (!d.is('[type=submit],[type=image]')) {
      var e = d.closest('[type=submit]');
      if (0 === e.length) return;
      c = e[0];
    }
    var f = c.form;
    if (((f.clk = c), 'image' === c.type))
      if (void 0 !== b.offsetX) (f.clk_x = b.offsetX), (f.clk_y = b.offsetY);
      else if ('function' == typeof a.fn.offset) {
        var g = d.offset();
        (f.clk_x = b.pageX - g.left), (f.clk_y = b.pageY - g.top);
      } else (f.clk_x = b.pageX - c.offsetLeft), (f.clk_y = b.pageY - c.offsetTop);
    setTimeout(function () {
      f.clk = f.clk_x = f.clk_y = null;
    }, 100);
  }
  function d() {
    if (a.fn.ajaxSubmit.debug) {
      var b = '[jquery.form] ' + Array.prototype.join.call(arguments, '');
      window.console && window.console.log ? window.console.log(b) : window.opera && window.opera.postError && window.opera.postError(b);
    }
  }
  var e = {};
  (e.fileapi = void 0 !== a('<input type="file">').get(0).files), (e.formdata = void 0 !== window.FormData);
  var f = !!a.fn.prop;
  (a.fn.attr2 = function () {
    if (!f) return this.attr.apply(this, arguments);
    var a = this.prop.apply(this, arguments);
    return (a && a.jquery) || 'string' == typeof a ? a : this.attr.apply(this, arguments);
  }),
    (a.fn.ajaxSubmit = function (b, c, g, h) {
      function i(c) {
        var d,
          e,
          f = a.param(c, b.traditional).split('&'),
          g = f.length,
          h = [];
        for (d = 0; d < g; d++)
          (f[d] = f[d].replace(/\+/g, ' ')), (e = f[d].split('=')), h.push([decodeURIComponent(e[0]), decodeURIComponent(e[1])]);
        return h;
      }
      function j(c) {
        for (var d = new FormData(), e = 0; e < c.length; e++) d.append(c[e].name, c[e].value);
        if (b.extraData) {
          var f = i(b.extraData);
          for (e = 0; e < f.length; e++) f[e] && d.append(f[e][0], f[e][1]);
        }
        b.data = null;
        var g = a.extend(!0, {}, a.ajaxSettings, b, { contentType: !1, processData: !1, cache: !1, type: l || 'POST' });
        b.uploadProgress &&
          (g.xhr = function () {
            var c = a.ajaxSettings.xhr();
            return (
              c.upload &&
                c.upload.addEventListener(
                  'progress',
                  function (a) {
                    var c = 0,
                      d = a.loaded || a.position,
                      e = a.total;
                    a.lengthComputable && (c = Math.ceil((d / e) * 100)), b.uploadProgress(a, d, e, c);
                  },
                  !1
                ),
              c
            );
          }),
          (g.data = null);
        var h = g.beforeSend;
        return (
          (g.beforeSend = function (a, c) {
            b.formData ? (c.data = b.formData) : (c.data = d), h && h.call(this, a, c);
          }),
          a.ajax(g)
        );
      }
      function k(c) {
        function e(a) {
          var b = null;
          try {
            a.contentWindow && (b = a.contentWindow.document);
          } catch (a) {
            d('cannot get iframe.contentWindow document: ' + a);
          }
          if (b) return b;
          try {
            b = a.contentDocument ? a.contentDocument : a.document;
          } catch (c) {
            d('cannot get iframe.contentDocument: ' + c), (b = a.document);
          }
          return b;
        }
        function g() {
          function b() {
            try {
              var a = e(q).readyState;
              d('state = ' + a), a && 'uninitialized' === a.toLowerCase() && setTimeout(b, 50);
            } catch (a) {
              d('Server abort: ', a, ' (', a.name, ')'), h(2), w && clearTimeout(w), (w = void 0);
            }
          }
          var c = o.attr2('target'),
            f = o.attr2('action'),
            g = o.attr('enctype') || o.attr('encoding') || 'multipart/form-data';
          x.setAttribute('target', n),
            (l && !/post/i.test(l)) || x.setAttribute('method', 'POST'),
            f !== k.url && x.setAttribute('action', k.url),
            k.skipEncodingOverride ||
              (l && !/post/i.test(l)) ||
              o.attr({ encoding: 'multipart/form-data', enctype: 'multipart/form-data' }),
            k.timeout &&
              (w = setTimeout(function () {
                (v = !0), h(1);
              }, k.timeout));
          var i = [];
          try {
            if (k.extraData)
              for (var j in k.extraData)
                k.extraData.hasOwnProperty(j) &&
                  (a.isPlainObject(k.extraData[j]) && k.extraData[j].hasOwnProperty('name') && k.extraData[j].hasOwnProperty('value')
                    ? i.push(
                        a('<input type="hidden" name="' + k.extraData[j].name + '">', z)
                          .val(k.extraData[j].value)
                          .appendTo(x)[0]
                      )
                    : i.push(
                        a('<input type="hidden" name="' + j + '">', z)
                          .val(k.extraData[j])
                          .appendTo(x)[0]
                      ));
            k.iframeTarget || p.appendTo(A),
              q.attachEvent ? q.attachEvent('onload', h) : q.addEventListener('load', h, !1),
              setTimeout(b, 15);
            try {
              x.submit();
            } catch (a) {
              var m = document.createElement('form').submit;
              m.apply(x);
            }
          } finally {
            x.setAttribute('action', f),
              x.setAttribute('enctype', g),
              c ? x.setAttribute('target', c) : o.removeAttr('target'),
              a(i).remove();
          }
        }
        function h(b) {
          if (!r.aborted && !F) {
            if (((E = e(q)), E || (d('cannot access response document'), (b = 2)), 1 === b && r))
              return r.abort('timeout'), void y.reject(r, 'timeout');
            if (2 === b && r) return r.abort('server abort'), void y.reject(r, 'error', 'server abort');
            if ((E && E.location.href !== k.iframeSrc) || v) {
              q.detachEvent ? q.detachEvent('onload', h) : q.removeEventListener('load', h, !1);
              var c,
                f = 'success';
              try {
                if (v) throw 'timeout';
                var g = 'xml' === k.dataType || E.XMLDocument || a.isXMLDoc(E);
                if ((d('isXml=' + g), !g && window.opera && (null === E.body || !E.body.innerHTML) && --G))
                  return d('requeing onLoad callback, DOM not available'), void setTimeout(h, 250);
                var i = E.body ? E.body : E.documentElement;
                (r.responseText = i ? i.innerHTML : null),
                  (r.responseXML = E.XMLDocument ? E.XMLDocument : E),
                  g && (k.dataType = 'xml'),
                  (r.getResponseHeader = function (a) {
                    return { 'content-type': k.dataType }[a.toLowerCase()];
                  }),
                  i &&
                    ((r.status = Number(i.getAttribute('status')) || r.status),
                    (r.statusText = i.getAttribute('statusText') || r.statusText));
                var j = (k.dataType || '').toLowerCase(),
                  l = /(json|script|text)/.test(j);
                if (l || k.textarea) {
                  var n = E.getElementsByTagName('textarea')[0];
                  if (n)
                    (r.responseText = n.value),
                      (r.status = Number(n.getAttribute('status')) || r.status),
                      (r.statusText = n.getAttribute('statusText') || r.statusText);
                  else if (l) {
                    var o = E.getElementsByTagName('pre')[0],
                      s = E.getElementsByTagName('body')[0];
                    o
                      ? (r.responseText = o.textContent ? o.textContent : o.innerText)
                      : s && (r.responseText = s.textContent ? s.textContent : s.innerText);
                  }
                } else 'xml' === j && !r.responseXML && r.responseText && (r.responseXML = H(r.responseText));
                try {
                  D = J(r, j, k);
                } catch (a) {
                  (f = 'parsererror'), (r.error = c = a || f);
                }
              } catch (a) {
                d('error caught: ', a), (f = 'error'), (r.error = c = a || f);
              }
              r.aborted && (d('upload aborted'), (f = null)),
                r.status && (f = (r.status >= 200 && r.status < 300) || 304 === r.status ? 'success' : 'error'),
                'success' === f
                  ? (k.success && k.success.call(k.context, D, 'success', r),
                    y.resolve(r.responseText, 'success', r),
                    m && a.event.trigger('ajaxSuccess', [r, k]))
                  : f &&
                    (void 0 === c && (c = r.statusText),
                    k.error && k.error.call(k.context, r, f, c),
                    y.reject(r, 'error', c),
                    m && a.event.trigger('ajaxError', [r, k, c])),
                m && a.event.trigger('ajaxComplete', [r, k]),
                m && !--a.active && a.event.trigger('ajaxStop'),
                k.complete && k.complete.call(k.context, r, f),
                (F = !0),
                k.timeout && clearTimeout(w),
                setTimeout(function () {
                  k.iframeTarget ? p.attr('src', k.iframeSrc) : p.remove(), (r.responseXML = null);
                }, 100);
            }
          }
        }
        var i,
          j,
          k,
          m,
          n,
          p,
          q,
          r,
          t,
          u,
          v,
          w,
          x = o[0],
          y = a.Deferred();
        if (
          ((y.abort = function (a) {
            r.abort(a);
          }),
          c)
        )
          for (j = 0; j < s.length; j++) (i = a(s[j])), f ? i.prop('disabled', !1) : i.removeAttr('disabled');
        (k = a.extend(!0, {}, a.ajaxSettings, b)), (k.context = k.context || k), (n = 'jqFormIO' + new Date().getTime());
        var z = x.ownerDocument,
          A = o.closest('body');
        if (
          (k.iframeTarget
            ? ((p = a(k.iframeTarget, z)), (u = p.attr2('name')), u ? (n = u) : p.attr2('name', n))
            : ((p = a('<iframe name="' + n + '" src="' + k.iframeSrc + '" />', z)),
              p.css({ position: 'absolute', top: '-1000px', left: '-1000px' })),
          (q = p[0]),
          (r = {
            aborted: 0,
            responseText: null,
            responseXML: null,
            status: 0,
            statusText: 'n/a',
            getAllResponseHeaders: function () {},
            getResponseHeader: function () {},
            setRequestHeader: function () {},
            abort: function (b) {
              var c = 'timeout' === b ? 'timeout' : 'aborted';
              d('aborting upload... ' + c), (this.aborted = 1);
              try {
                q.contentWindow.document.execCommand && q.contentWindow.document.execCommand('Stop');
              } catch (a) {}
              p.attr('src', k.iframeSrc),
                (r.error = c),
                k.error && k.error.call(k.context, r, c, b),
                m && a.event.trigger('ajaxError', [r, k, c]),
                k.complete && k.complete.call(k.context, r, c);
            },
          }),
          (m = k.global),
          m && 0 == a.active++ && a.event.trigger('ajaxStart'),
          m && a.event.trigger('ajaxSend', [r, k]),
          k.beforeSend && k.beforeSend.call(k.context, r, k) === !1)
        )
          return k.global && a.active--, y.reject(), y;
        if (r.aborted) return y.reject(), y;
        (t = x.clk) &&
          (u = t.name) &&
          !t.disabled &&
          ((k.extraData = k.extraData || {}),
          (k.extraData[u] = t.value),
          'image' === t.type && ((k.extraData[u + '.x'] = x.clk_x), (k.extraData[u + '.y'] = x.clk_y)));
        var B = a('meta[name=csrf-token]').attr('content'),
          C = a('meta[name=csrf-param]').attr('content');
        C && B && ((k.extraData = k.extraData || {}), (k.extraData[C] = B)), k.forceSync ? g() : setTimeout(g, 10);
        var D,
          E,
          F,
          G = 50,
          H =
            a.parseXML ||
            function (a, b) {
              return (
                window.ActiveXObject
                  ? ((b = new ActiveXObject('Microsoft.XMLDOM')), (b.async = 'false'), b.loadXML(a))
                  : (b = new DOMParser().parseFromString(a, 'text/xml')),
                b && b.documentElement && 'parsererror' !== b.documentElement.nodeName ? b : null
              );
            },
          I =
            a.parseJSON ||
            function (a) {
              return window.eval('(' + a + ')');
            },
          J = function (b, c, d) {
            var e = b.getResponseHeader('content-type') || '',
              f = ('xml' === c || !c) && e.indexOf('xml') >= 0,
              g = f ? b.responseXML : b.responseText;
            return (
              f && 'parsererror' === g.documentElement.nodeName && a.error && a.error('parsererror'),
              d && d.dataFilter && (g = d.dataFilter(g, c)),
              'string' == typeof g &&
                (('json' === c || !c) && e.indexOf('json') >= 0
                  ? (g = I(g))
                  : ('script' === c || !c) && e.indexOf('javascript') >= 0 && a.globalEval(g)),
              g
            );
          };
        return y;
      }
      if (!this.length) return d('ajaxSubmit: skipping submit process - no element selected'), this;
      var l,
        m,
        n,
        o = this;
      'function' == typeof b
        ? (b = { success: b })
        : 'string' == typeof b || (b === !1 && arguments.length > 0)
        ? ((b = { url: b, data: c, dataType: g }), 'function' == typeof h && (b.success = h))
        : void 0 === b && (b = {}),
        (l = b.method || b.type || this.attr2('method')),
        (m = b.url || this.attr2('action')),
        (n = 'string' == typeof m ? a.trim(m) : ''),
        (n = n || window.location.href || ''),
        n && (n = (n.match(/^([^#]+)/) || [])[1]),
        (b = a.extend(
          !0,
          {
            url: n,
            success: a.ajaxSettings.success,
            type: l || a.ajaxSettings.type,
            iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',
          },
          b
        ));
      var p = {};
      if ((this.trigger('form-pre-serialize', [this, b, p]), p.veto))
        return d('ajaxSubmit: submit vetoed via form-pre-serialize trigger'), this;
      if (b.beforeSerialize && b.beforeSerialize(this, b) === !1) return d('ajaxSubmit: submit aborted via beforeSerialize callback'), this;
      var q = b.traditional;
      void 0 === q && (q = a.ajaxSettings.traditional);
      var r,
        s = [],
        t = this.formToArray(b.semantic, s, b.filtering);
      if (b.data) {
        var u = a.isFunction(b.data) ? b.data(t) : b.data;
        (b.extraData = u), (r = a.param(u, q));
      }
      if (b.beforeSubmit && b.beforeSubmit(t, this, b) === !1) return d('ajaxSubmit: submit aborted via beforeSubmit callback'), this;
      if ((this.trigger('form-submit-validate', [t, this, b, p]), p.veto))
        return d('ajaxSubmit: submit vetoed via form-submit-validate trigger'), this;
      var v = a.param(t, q);
      r && (v = v ? v + '&' + r : r),
        'GET' === b.type.toUpperCase() ? ((b.url += (b.url.indexOf('?') >= 0 ? '&' : '?') + v), (b.data = null)) : (b.data = v);
      var w = [];
      if (
        (b.resetForm &&
          w.push(function () {
            o.resetForm();
          }),
        b.clearForm &&
          w.push(function () {
            o.clearForm(b.includeHidden);
          }),
        !b.dataType && b.target)
      ) {
        var x = b.success || function () {};
        w.push(function (c, d, e) {
          var f = arguments,
            g = b.replaceTarget ? 'replaceWith' : 'html';
          a(b.target)
            [g](c)
            .each(function () {
              x.apply(this, f);
            });
        });
      } else b.success && (a.isArray(b.success) ? a.merge(w, b.success) : w.push(b.success));
      if (
        ((b.success = function (a, c, d) {
          for (var e = b.context || this, f = 0, g = w.length; f < g; f++) w[f].apply(e, [a, c, d || o, o]);
        }),
        b.error)
      ) {
        var y = b.error;
        b.error = function (a, c, d) {
          var e = b.context || this;
          y.apply(e, [a, c, d, o]);
        };
      }
      if (b.complete) {
        var z = b.complete;
        b.complete = function (a, c) {
          var d = b.context || this;
          z.apply(d, [a, c, o]);
        };
      }
      var A = a('input[type=file]:enabled', this).filter(function () {
          return '' !== a(this).val();
        }),
        B = A.length > 0,
        C = 'multipart/form-data',
        D = o.attr('enctype') === C || o.attr('encoding') === C,
        E = e.fileapi && e.formdata;
      d('fileAPI :' + E);
      var F,
        G = (B || D) && !E;
      b.iframe !== !1 && (b.iframe || G)
        ? b.closeKeepAlive
          ? a.get(b.closeKeepAlive, function () {
              F = k(t);
            })
          : (F = k(t))
        : (F = (B || D) && E ? j(t) : a.ajax(b)),
        o.removeData('jqxhr').data('jqxhr', F);
      for (var H = 0; H < s.length; H++) s[H] = null;
      return this.trigger('form-submit-notify', [this, b]), this;
    }),
    (a.fn.ajaxForm = function (e, f, g, h) {
      if (
        (('string' == typeof e || (e === !1 && arguments.length > 0)) &&
          ((e = { url: e, data: f, dataType: g }), 'function' == typeof h && (e.success = h)),
        (e = e || {}),
        (e.delegation = e.delegation && a.isFunction(a.fn.on)),
        !e.delegation && 0 === this.length)
      ) {
        var i = { s: this.selector, c: this.context };
        return !a.isReady && i.s
          ? (d('DOM not ready, queuing ajaxForm'),
            a(function () {
              a(i.s, i.c).ajaxForm(e);
            }),
            this)
          : (d('terminating; zero elements found by selector' + (a.isReady ? '' : ' (DOM not ready)')), this);
      }
      return e.delegation
        ? (a(document)
            .off('submit.form-plugin', this.selector, b)
            .off('click.form-plugin', this.selector, c)
            .on('submit.form-plugin', this.selector, e, b)
            .on('click.form-plugin', this.selector, e, c),
          this)
        : this.ajaxFormUnbind().on('submit.form-plugin', e, b).on('click.form-plugin', e, c);
    }),
    (a.fn.ajaxFormUnbind = function () {
      return this.off('submit.form-plugin click.form-plugin');
    }),
    (a.fn.formToArray = function (b, c, d) {
      var f = [];
      if (0 === this.length) return f;
      var g,
        h = this[0],
        i = this.attr('id'),
        j = b || void 0 === h.elements ? h.getElementsByTagName('*') : h.elements;
      if (
        (j && (j = a.makeArray(j)),
        i &&
          (b || /(Edge|Trident)\//.test(navigator.userAgent)) &&
          ((g = a(':input[form="' + i + '"]').get()), g.length && (j = (j || []).concat(g))),
        !j || !j.length)
      )
        return f;
      a.isFunction(d) && (j = a.map(j, d));
      var k, l, m, n, o, p, q;
      for (k = 0, p = j.length; k < p; k++)
        if (((o = j[k]), (m = o.name) && !o.disabled))
          if (b && h.clk && 'image' === o.type)
            h.clk === o &&
              (f.push({ name: m, value: a(o).val(), type: o.type }),
              f.push({ name: m + '.x', value: h.clk_x }, { name: m + '.y', value: h.clk_y }));
          else if ((n = a.fieldValue(o, !0)) && n.constructor === Array)
            for (c && c.push(o), l = 0, q = n.length; l < q; l++) f.push({ name: m, value: n[l] });
          else if (e.fileapi && 'file' === o.type) {
            c && c.push(o);
            var r = o.files;
            if (r.length) for (l = 0; l < r.length; l++) f.push({ name: m, value: r[l], type: o.type });
            else f.push({ name: m, value: '', type: o.type });
          } else null !== n && void 0 !== n && (c && c.push(o), f.push({ name: m, value: n, type: o.type, required: o.required }));
      if (!b && h.clk) {
        var s = a(h.clk),
          t = s[0];
        (m = t.name),
          m &&
            !t.disabled &&
            'image' === t.type &&
            (f.push({ name: m, value: s.val() }), f.push({ name: m + '.x', value: h.clk_x }, { name: m + '.y', value: h.clk_y }));
      }
      return f;
    }),
    (a.fn.formSerialize = function (b) {
      return a.param(this.formToArray(b));
    }),
    (a.fn.fieldSerialize = function (b) {
      var c = [];
      return (
        this.each(function () {
          var d = this.name;
          if (d) {
            var e = a.fieldValue(this, b);
            if (e && e.constructor === Array) for (var f = 0, g = e.length; f < g; f++) c.push({ name: d, value: e[f] });
            else null !== e && void 0 !== e && c.push({ name: this.name, value: e });
          }
        }),
        a.param(c)
      );
    }),
    (a.fn.fieldValue = function (b) {
      for (var c = [], d = 0, e = this.length; d < e; d++) {
        var f = this[d],
          g = a.fieldValue(f, b);
        null === g || void 0 === g || (g.constructor === Array && !g.length) || (g.constructor === Array ? a.merge(c, g) : c.push(g));
      }
      return c;
    }),
    (a.fieldValue = function (b, c) {
      var d = b.name,
        e = b.type,
        f = b.tagName.toLowerCase();
      if (
        (void 0 === c && (c = !0),
        c &&
          (!d ||
            b.disabled ||
            'reset' === e ||
            'button' === e ||
            (('checkbox' === e || 'radio' === e) && !b.checked) ||
            (('submit' === e || 'image' === e) && b.form && b.form.clk !== b) ||
            ('select' === f && b.selectedIndex === -1)))
      )
        return null;
      if ('select' === f) {
        var g = b.selectedIndex;
        if (g < 0) return null;
        for (var h = [], i = b.options, j = 'select-one' === e, k = j ? g + 1 : i.length, l = j ? g : 0; l < k; l++) {
          var m = i[l];
          if (m.selected && !m.disabled) {
            var n = m.value;
            if ((n || (n = m.attributes && m.attributes.value && !m.attributes.value.specified ? m.text : m.value), j)) return n;
            h.push(n);
          }
        }
        return h;
      }
      return a(b).val().replace(/\r?\n/g, '\r\n');
    }),
    (a.fn.clearForm = function (b) {
      return this.each(function () {
        a('input,select,textarea', this).clearFields(b);
      });
    }),
    (a.fn.clearFields = a.fn.clearInputs =
      function (b) {
        var c = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
        return this.each(function () {
          var d = this.type,
            e = this.tagName.toLowerCase();
          c.test(d) || 'textarea' === e
            ? (this.value = '')
            : 'checkbox' === d || 'radio' === d
            ? (this.checked = !1)
            : 'select' === e
            ? (this.selectedIndex = -1)
            : 'file' === d
            ? /MSIE/.test(navigator.userAgent)
              ? a(this).replaceWith(a(this).clone(!0))
              : a(this).val('')
            : b && ((b === !0 && /hidden/.test(d)) || ('string' == typeof b && a(this).is(b))) && (this.value = '');
        });
      }),
    (a.fn.resetForm = function () {
      return this.each(function () {
        var b = a(this),
          c = this.tagName.toLowerCase();
        switch (c) {
          case 'input':
            this.checked = this.defaultChecked;
          case 'textarea':
            return (this.value = this.defaultValue), !0;
          case 'option':
          case 'optgroup':
            var d = b.parents('select');
            return (
              d.length && d[0].multiple
                ? 'option' === c
                  ? (this.selected = this.defaultSelected)
                  : b.find('option').resetForm()
                : d.resetForm(),
              !0
            );
          case 'select':
            return (
              b.find('option').each(function (a) {
                if (((this.selected = this.defaultSelected), this.defaultSelected && !b[0].multiple)) return (b[0].selectedIndex = a), !1;
              }),
              !0
            );
          case 'label':
            var e = a(b.attr('for')),
              f = b.find('input,select,textarea');
            return e[0] && f.unshift(e[0]), f.resetForm(), !0;
          case 'form':
            return ('function' == typeof this.reset || ('object' == typeof this.reset && !this.reset.nodeType)) && this.reset(), !0;
          default:
            return b.find('form,input,label,select,textarea').resetForm(), !0;
        }
      });
    }),
    (a.fn.enable = function (a) {
      return (
        void 0 === a && (a = !0),
        this.each(function () {
          this.disabled = !a;
        })
      );
    }),
    (a.fn.selected = function (b) {
      return (
        void 0 === b && (b = !0),
        this.each(function () {
          var c = this.type;
          if ('checkbox' === c || 'radio' === c) this.checked = b;
          else if ('option' === this.tagName.toLowerCase()) {
            var d = a(this).parent('select');
            b && d[0] && 'select-one' === d[0].type && d.find('option').selected(!1), (this.selected = b);
          }
        })
      );
    }),
    (a.fn.ajaxSubmit.debug = !1);
});

// ==================================================
// fancyBox v3.2.10
//
// Licensed GPLv3 for open source use
// or fancyBox Commercial License for commercial use
//
// http://fancyapps.com/fancybox/
// Copyright 2017 fancyApps
//
// ==================================================
!(function (t, e, n, o) {
  'use strict';
  function i(t) {
    var e = n(t.currentTarget),
      o = t.data ? t.data.options : {},
      i = e.attr('data-fancybox') || '',
      a = 0,
      s = [];
    t.isDefaultPrevented() ||
      (t.preventDefault(),
      i
        ? ((s = o.selector ? n(o.selector) : t.data ? t.data.items : []),
          (s = s.length ? s.filter('[data-fancybox="' + i + '"]') : n('[data-fancybox="' + i + '"]')),
          (a = s.index(e)),
          a < 0 && (a = 0))
        : (s = [e]),
      n.fancybox.open(s, o, a));
  }
  if (n) {
    if (n.fn.fancybox) return void ('console' in t && console.log('fancyBox already initialized'));
    var a = {
        loop: !1,
        margin: [44, 0],
        gutter: 50,
        keyboard: !0,
        arrows: !0,
        infobar: !0,
        toolbar: !0,
        buttons: ['slideShow', 'fullScreen', 'thumbs', 'share', 'close'],
        idleTime: 3,
        smallBtn: 'auto',
        protect: !1,
        modal: !1,
        image: { preload: 'auto' },
        ajax: { settings: { data: { fancybox: !0 } } },
        iframe: {
          tpl: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen allowtransparency="true" src=""></iframe>',
          preload: !0,
          css: {},
          attr: { scrolling: 'auto' },
        },
        defaultType: 'image',
        animationEffect: 'zoom',
        animationDuration: 500,
        zoomOpacity: 'auto',
        transitionEffect: 'fade',
        transitionDuration: 366,
        slideClass: '',
        baseClass: '',
        baseTpl:
          '<div class="fancybox-container" role="dialog" tabindex="-1"><div class="fancybox-bg"></div><div class="fancybox-inner"><div class="fancybox-infobar"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div><div class="fancybox-toolbar">{{buttons}}</div><div class="fancybox-navigation">{{arrows}}</div><div class="fancybox-stage"></div><div class="fancybox-caption-wrap"><div class="fancybox-caption"></div></div></div></div>',
        spinnerTpl: '<div class="fancybox-loading"></div>',
        errorTpl: '<div class="fancybox-error"><p>{{ERROR}}<p></div>',
        btnTpl: {
          download:
            '<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}"><svg viewBox="0 0 40 40"><path d="M20,23 L20,8 L20,23 L13,16 L20,23 L27,16 L20,23 M26,28 L13,28 L27,28 L14,28" /></svg></a>',
          zoom: '<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}"><svg viewBox="0 0 40 40"><path d="M 18,17 m-8,0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0 M25,23 L31,29 L25,23" /></svg></button>',
          close:
            '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"><svg viewBox="0 0 40 40"><path d="M10,10 L30,30 M30,10 L10,30" /></svg></button>',
          smallBtn: '<button data-fancybox-close class="fancybox-close-small" title="{{CLOSE}}"></button>',
          arrowLeft:
            '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}"><svg viewBox="0 0 40 40"><path d="M10,20 L30,20 L10,20 L18,28 L10,20 L18,12 L10,20"></path></svg></button>',
          arrowRight:
            '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}"><svg viewBox="0 0 40 40"><path d="M30,20 L10,20 L30,20 L22,28 L30,20 L22,12 L30,20"></path></svg></button>',
        },
        parentEl: 'body',
        autoFocus: !1,
        backFocus: !0,
        trapFocus: !0,
        fullScreen: { autoStart: !1 },
        touch: { vertical: !0, momentum: !0 },
        hash: null,
        media: {},
        slideShow: { autoStart: !1, speed: 4e3 },
        thumbs: { autoStart: !1, hideOnClose: !0, parentEl: '.fancybox-container', axis: 'y' },
        wheel: 'auto',
        onInit: n.noop,
        beforeLoad: n.noop,
        afterLoad: n.noop,
        beforeShow: n.noop,
        afterShow: n.noop,
        beforeClose: n.noop,
        afterClose: n.noop,
        onActivate: n.noop,
        onDeactivate: n.noop,
        clickContent: function (t, e) {
          return 'image' === t.type && 'zoom';
        },
        clickSlide: 'close',
        clickOutside: 'close',
        dblclickContent: !1,
        dblclickSlide: !1,
        dblclickOutside: !1,
        mobile: {
          idleTime: !1,
          margin: 0,
          clickContent: function (t, e) {
            return 'image' === t.type && 'toggleControls';
          },
          clickSlide: function (t, e) {
            return 'image' === t.type ? 'toggleControls' : 'close';
          },
          dblclickContent: function (t, e) {
            return 'image' === t.type && 'zoom';
          },
          dblclickSlide: function (t, e) {
            return 'image' === t.type && 'zoom';
          },
        },
        lang: 'en',
        i18n: {
          en: {
            CLOSE: 'Close',
            NEXT: 'Next',
            PREV: 'Previous',
            ERROR: 'The requested content cannot be loaded. <br/> Please try again later.',
            PLAY_START: 'Start slideshow',
            PLAY_STOP: 'Pause slideshow',
            FULL_SCREEN: 'Full screen',
            THUMBS: 'Thumbnails',
            DOWNLOAD: 'Download',
            SHARE: 'Share',
            ZOOM: 'Zoom',
          },
          de: {
            CLOSE: 'Schliessen',
            NEXT: 'Weiter',
            PREV: 'Zurück',
            ERROR: 'Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es später nochmal.',
            PLAY_START: 'Diaschau starten',
            PLAY_STOP: 'Diaschau beenden',
            FULL_SCREEN: 'Vollbild',
            THUMBS: 'Vorschaubilder',
            DOWNLOAD: 'Herunterladen',
            SHARE: 'Teilen',
            ZOOM: 'Maßstab',
          },
        },
      },
      s = n(t),
      r = n(e),
      c = 0,
      l = function (t) {
        return t && t.hasOwnProperty && t instanceof n;
      },
      u = (function () {
        return (
          t.requestAnimationFrame ||
          t.webkitRequestAnimationFrame ||
          t.mozRequestAnimationFrame ||
          t.oRequestAnimationFrame ||
          function (e) {
            return t.setTimeout(e, 1e3 / 60);
          }
        );
      })(),
      d = (function () {
        var t,
          n = e.createElement('fakeelement'),
          i = {
            transition: 'transitionend',
            OTransition: 'oTransitionEnd',
            MozTransition: 'transitionend',
            WebkitTransition: 'webkitTransitionEnd',
          };
        for (t in i) if (n.style[t] !== o) return i[t];
        return 'transitionend';
      })(),
      f = function (t) {
        return t && t.length && t[0].offsetHeight;
      },
      p = function (t, o, i) {
        var a = this;
        (a.opts = n.extend(!0, { index: i }, n.fancybox.defaults, o || {})),
          n.fancybox.isMobile && (a.opts = n.extend(!0, {}, a.opts, a.opts.mobile)),
          o && n.isArray(o.buttons) && (a.opts.buttons = o.buttons),
          (a.id = a.opts.id || ++c),
          (a.group = []),
          (a.currIndex = parseInt(a.opts.index, 10) || 0),
          (a.prevIndex = null),
          (a.prevPos = null),
          (a.currPos = 0),
          (a.firstRun = null),
          a.createGroup(t),
          a.group.length && ((a.$lastFocus = n(e.activeElement).blur()), (a.slides = {}), a.init());
      };
    n.extend(p.prototype, {
      init: function () {
        var i,
          a,
          s,
          c = this,
          l = c.group[c.currIndex],
          u = l.opts,
          d = n.fancybox.scrollbarWidth;
        (c.scrollTop = r.scrollTop()),
          (c.scrollLeft = r.scrollLeft()),
          n.fancybox.getInstance() ||
            (n('body').addClass('fancybox-active'),
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !t.MSStream
              ? 'image' !== l.type &&
                n('body')
                  .css('top', n('body').scrollTop() * -1)
                  .addClass('fancybox-iosfix')
              : !n.fancybox.isMobile &&
                e.body.scrollHeight > t.innerHeight &&
                (d === o &&
                  ((i = n('<div style="width:50px;height:50px;overflow:scroll;" />').appendTo('body')),
                  (d = n.fancybox.scrollbarWidth = i[0].offsetWidth - i[0].clientWidth),
                  i.remove()),
                n('head').append(
                  '<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar { margin-right: ' + d + 'px; }</style>'
                ),
                n('body').addClass('compensate-for-scrollbar'))),
          (s = ''),
          n.each(u.buttons, function (t, e) {
            s += u.btnTpl[e] || '';
          }),
          (a = n(c.translate(c, u.baseTpl.replace('{{buttons}}', s).replace('{{arrows}}', u.btnTpl.arrowLeft + u.btnTpl.arrowRight)))
            .attr('id', 'fancybox-container-' + c.id)
            .addClass('fancybox-is-hidden')
            .addClass(u.baseClass)
            .data('FancyBox', c)
            .appendTo(u.parentEl)),
          (c.$refs = { container: a }),
          ['bg', 'inner', 'infobar', 'toolbar', 'stage', 'caption', 'navigation'].forEach(function (t) {
            c.$refs[t] = a.find('.fancybox-' + t);
          }),
          c.trigger('onInit'),
          c.activate(),
          c.jumpTo(c.currIndex);
      },
      translate: function (t, e) {
        var n = t.opts.i18n[t.opts.lang];
        return e.replace(/\{\{(\w+)\}\}/g, function (t, e) {
          var i = n[e];
          return i === o ? t : i;
        });
      },
      createGroup: function (t) {
        var e = this,
          i = n.makeArray(t);
        n.each(i, function (t, i) {
          var a,
            s,
            r,
            c,
            l,
            u = {},
            d = {};
          n.isPlainObject(i)
            ? ((u = i), (d = i.opts || i))
            : 'object' === n.type(i) && n(i).length
            ? ((a = n(i)),
              (d = a.data()),
              (d = n.extend({}, d, d.options || {})),
              (d.$orig = a),
              (u.src = d.src || a.attr('href')),
              u.type || u.src || ((u.type = 'inline'), (u.src = i)))
            : (u = { type: 'html', src: i + '' }),
            (u.opts = n.extend(!0, {}, e.opts, d)),
            n.isArray(d.buttons) && (u.opts.buttons = d.buttons),
            (s = u.type || u.opts.type),
            (c = u.src || ''),
            !s &&
              c &&
              (c.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i)
                ? (s = 'image')
                : c.match(/\.(pdf)((\?|#).*)?$/i)
                ? (s = 'pdf')
                : (r = c.match(/\.(mp4|mov|ogv)((\?|#).*)?$/i))
                ? ((s = 'video'), u.opts.videoFormat || (u.opts.videoFormat = 'video/' + ('ogv' === r[1] ? 'ogg' : r[1])))
                : '#' === c.charAt(0) && (s = 'inline')),
            s ? (u.type = s) : e.trigger('objectNeedsType', u),
            (u.index = e.group.length),
            u.opts.$orig && !u.opts.$orig.length && delete u.opts.$orig,
            !u.opts.$thumb && u.opts.$orig && (u.opts.$thumb = u.opts.$orig.find('img:first')),
            u.opts.$thumb && !u.opts.$thumb.length && delete u.opts.$thumb,
            'function' === n.type(u.opts.caption) && (u.opts.caption = u.opts.caption.apply(i, [e, u])),
            'function' === n.type(e.opts.caption) && (u.opts.caption = e.opts.caption.apply(i, [e, u])),
            u.opts.caption instanceof n || (u.opts.caption = u.opts.caption === o ? '' : u.opts.caption + ''),
            'ajax' === s && ((l = c.split(/\s+/, 2)), l.length > 1 && ((u.src = l.shift()), (u.opts.filter = l.shift()))),
            'auto' == u.opts.smallBtn &&
              (n.inArray(s, ['html', 'inline', 'ajax']) > -1 ? ((u.opts.toolbar = !1), (u.opts.smallBtn = !0)) : (u.opts.smallBtn = !1)),
            'pdf' === s && ((u.type = 'iframe'), (u.opts.iframe.preload = !1)),
            u.opts.modal &&
              (u.opts = n.extend(!0, u.opts, {
                infobar: 0,
                toolbar: 0,
                smallBtn: 0,
                keyboard: 0,
                slideShow: 0,
                fullScreen: 0,
                thumbs: 0,
                touch: 0,
                clickContent: !1,
                clickSlide: !1,
                clickOutside: !1,
                dblclickContent: !1,
                dblclickSlide: !1,
                dblclickOutside: !1,
              })),
            e.group.push(u);
        });
      },
      addEvents: function () {
        var o = this;
        o.removeEvents(),
          o.$refs.container
            .on('click.fb-close', '[data-fancybox-close]', function (t) {
              t.stopPropagation(), t.preventDefault(), o.close(t);
            })
            .on('click.fb-prev touchend.fb-prev', '[data-fancybox-prev]', function (t) {
              t.stopPropagation(), t.preventDefault(), o.previous();
            })
            .on('click.fb-next touchend.fb-next', '[data-fancybox-next]', function (t) {
              t.stopPropagation(), t.preventDefault(), o.next();
            })
            .on('click.fb', '[data-fancybox-zoom]', function (t) {
              o[o.isScaledDown() ? 'scaleToActual' : 'scaleToFit']();
            }),
          s.on('orientationchange.fb resize.fb', function (t) {
            t && t.originalEvent && 'resize' === t.originalEvent.type
              ? u(function () {
                  o.update();
                })
              : (o.$refs.stage.hide(),
                setTimeout(function () {
                  o.$refs.stage.show(), o.update();
                }, 600));
          }),
          r.on('focusin.fb', function (t) {
            var i = n.fancybox ? n.fancybox.getInstance() : null;
            i.isClosing ||
              !i.current ||
              !i.current.opts.trapFocus ||
              n(t.target).hasClass('fancybox-container') ||
              n(t.target).is(e) ||
              (i &&
                'fixed' !== n(t.target).css('position') &&
                !i.$refs.container.has(t.target).length &&
                (t.stopPropagation(), i.focus(), s.scrollTop(o.scrollTop).scrollLeft(o.scrollLeft)));
          }),
          r.on('keydown.fb', function (t) {
            var e = o.current,
              i = t.keyCode || t.which;
            if (e && e.opts.keyboard && !n(t.target).is('input') && !n(t.target).is('textarea'))
              return 8 === i || 27 === i
                ? (t.preventDefault(), void o.close(t))
                : 37 === i || 38 === i
                ? (t.preventDefault(), void o.previous())
                : 39 === i || 40 === i
                ? (t.preventDefault(), void o.next())
                : void o.trigger('afterKeydown', t, i);
          }),
          o.group[o.currIndex].opts.idleTime &&
            ((o.idleSecondsCounter = 0),
            r.on(
              'mousemove.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle',
              function (t) {
                (o.idleSecondsCounter = 0), o.isIdle && o.showControls(), (o.isIdle = !1);
              }
            ),
            (o.idleInterval = t.setInterval(function () {
              o.idleSecondsCounter++,
                o.idleSecondsCounter >= o.group[o.currIndex].opts.idleTime &&
                  !o.isDragging &&
                  ((o.isIdle = !0), (o.idleSecondsCounter = 0), o.hideControls());
            }, 1e3)));
      },
      removeEvents: function () {
        var e = this;
        s.off('orientationchange.fb resize.fb'),
          r.off('focusin.fb keydown.fb .fb-idle'),
          this.$refs.container.off('.fb-close .fb-prev .fb-next'),
          e.idleInterval && (t.clearInterval(e.idleInterval), (e.idleInterval = null));
      },
      previous: function (t) {
        return this.jumpTo(this.currPos - 1, t);
      },
      next: function (t) {
        return this.jumpTo(this.currPos + 1, t);
      },
      jumpTo: function (t, e, i) {
        var a,
          s,
          r,
          c,
          l,
          u,
          d,
          p = this,
          h = p.group.length;
        if (!(p.isDragging || p.isClosing || (p.isAnimating && p.firstRun))) {
          if (((t = parseInt(t, 10)), (s = p.current ? p.current.opts.loop : p.opts.loop), !s && (t < 0 || t >= h))) return !1;
          if (((a = p.firstRun = null === p.firstRun), !(h < 2 && !a && p.isDragging))) {
            if (
              ((c = p.current),
              (p.prevIndex = p.currIndex),
              (p.prevPos = p.currPos),
              (r = p.createSlide(t)),
              h > 1 && ((s || r.index > 0) && p.createSlide(t - 1), (s || r.index < h - 1) && p.createSlide(t + 1)),
              (p.current = r),
              (p.currIndex = r.index),
              (p.currPos = r.pos),
              p.trigger('beforeShow', a),
              p.updateControls(),
              (u = n.fancybox.getTranslate(r.$slide)),
              (r.isMoved = (0 !== u.left || 0 !== u.top) && !r.$slide.hasClass('fancybox-animated')),
              (r.forcedDuration = o),
              n.isNumeric(e) ? (r.forcedDuration = e) : (e = r.opts[a ? 'animationDuration' : 'transitionDuration']),
              (e = parseInt(e, 10)),
              a)
            )
              return (
                r.opts.animationEffect && e && p.$refs.container.css('transition-duration', e + 'ms'),
                p.$refs.container.removeClass('fancybox-is-hidden'),
                f(p.$refs.container),
                p.$refs.container.addClass('fancybox-is-open'),
                r.$slide.addClass('fancybox-slide--current'),
                p.loadSlide(r),
                void p.preload('image')
              );
            n.each(p.slides, function (t, e) {
              n.fancybox.stop(e.$slide);
            }),
              r.$slide.removeClass('fancybox-slide--next fancybox-slide--previous').addClass('fancybox-slide--current'),
              r.isMoved
                ? ((l = Math.round(r.$slide.width())),
                  n.each(p.slides, function (t, o) {
                    var i = o.pos - r.pos;
                    n.fancybox.animate(o.$slide, { top: 0, left: i * l + i * o.opts.gutter }, e, function () {
                      o.$slide.removeAttr('style').removeClass('fancybox-slide--next fancybox-slide--previous'),
                        o.pos === p.currPos && ((r.isMoved = !1), p.complete());
                    });
                  }))
                : p.$refs.stage.children().removeAttr('style'),
              r.isLoaded ? p.revealContent(r) : p.loadSlide(r),
              p.preload('image'),
              c.pos !== r.pos &&
                ((d = 'fancybox-slide--' + (c.pos > r.pos ? 'next' : 'previous')),
                c.$slide.removeClass('fancybox-slide--complete fancybox-slide--current fancybox-slide--next fancybox-slide--previous'),
                (c.isComplete = !1),
                e &&
                  (r.isMoved || r.opts.transitionEffect) &&
                  (r.isMoved
                    ? c.$slide.addClass(d)
                    : ((d = 'fancybox-animated ' + d + ' fancybox-fx-' + r.opts.transitionEffect),
                      n.fancybox.animate(c.$slide, d, e, function () {
                        c.$slide.removeClass(d).removeAttr('style');
                      }))));
          }
        }
      },
      createSlide: function (t) {
        var e,
          o,
          i = this;
        return (
          (o = t % i.group.length),
          (o = o < 0 ? i.group.length + o : o),
          !i.slides[t] &&
            i.group[o] &&
            ((e = n('<div class="fancybox-slide"></div>').appendTo(i.$refs.stage)),
            (i.slides[t] = n.extend(!0, {}, i.group[o], { pos: t, $slide: e, isLoaded: !1 })),
            i.updateSlide(i.slides[t])),
          i.slides[t]
        );
      },
      scaleToActual: function (t, e, i) {
        var a,
          s,
          r,
          c,
          l,
          u = this,
          d = u.current,
          f = d.$content,
          p = parseInt(d.$slide.width(), 10),
          h = parseInt(d.$slide.height(), 10),
          g = d.width,
          b = d.height;
        'image' != d.type ||
          d.hasError ||
          !f ||
          u.isAnimating ||
          (n.fancybox.stop(f),
          (u.isAnimating = !0),
          (t = t === o ? 0.5 * p : t),
          (e = e === o ? 0.5 * h : e),
          (a = n.fancybox.getTranslate(f)),
          (c = g / a.width),
          (l = b / a.height),
          (s = 0.5 * p - 0.5 * g),
          (r = 0.5 * h - 0.5 * b),
          g > p && ((s = a.left * c - (t * c - t)), s > 0 && (s = 0), s < p - g && (s = p - g)),
          b > h && ((r = a.top * l - (e * l - e)), r > 0 && (r = 0), r < h - b && (r = h - b)),
          u.updateCursor(g, b),
          n.fancybox.animate(f, { top: r, left: s, scaleX: c, scaleY: l }, i || 330, function () {
            u.isAnimating = !1;
          }),
          u.SlideShow && u.SlideShow.isActive && u.SlideShow.stop());
      },
      scaleToFit: function (t) {
        var e,
          o = this,
          i = o.current,
          a = i.$content;
        'image' != i.type ||
          i.hasError ||
          !a ||
          o.isAnimating ||
          (n.fancybox.stop(a),
          (o.isAnimating = !0),
          (e = o.getFitPos(i)),
          o.updateCursor(e.width, e.height),
          n.fancybox.animate(
            a,
            { top: e.top, left: e.left, scaleX: e.width / a.width(), scaleY: e.height / a.height() },
            t || 330,
            function () {
              o.isAnimating = !1;
            }
          ));
      },
      getFitPos: function (t) {
        var e,
          o,
          i,
          a,
          s,
          r = this,
          c = t.$content,
          l = t.width,
          u = t.height,
          d = t.opts.margin;
        return (
          !(!c || !c.length || (!l && !u)) &&
          ('number' === n.type(d) && (d = [d, d]),
          2 == d.length && (d = [d[0], d[1], d[0], d[1]]),
          (e = parseInt(r.$refs.stage.width(), 10) - (d[1] + d[3])),
          (o = parseInt(r.$refs.stage.height(), 10) - (d[0] + d[2])),
          (i = Math.min(1, e / l, o / u)),
          (a = Math.floor(i * l)),
          (s = Math.floor(i * u)),
          { top: Math.floor(0.5 * (o - s)) + d[0], left: Math.floor(0.5 * (e - a)) + d[3], width: a, height: s })
        );
      },
      update: function () {
        var t = this;
        n.each(t.slides, function (e, n) {
          t.updateSlide(n);
        });
      },
      updateSlide: function (t, e) {
        var o = this,
          i = t && t.$content;
        i &&
          (t.width || t.height) &&
          ((o.isAnimating = !1), n.fancybox.stop(i), n.fancybox.setTranslate(i, o.getFitPos(t)), t.pos === o.currPos && o.updateCursor()),
          t.$slide.trigger('refresh'),
          o.trigger('onUpdate', t);
      },
      centerSlide: function (t, e) {
        var i,
          a,
          s = this;
        s.current &&
          ((i = Math.round(t.$slide.width())),
          (a = t.pos - s.current.pos),
          n.fancybox.animate(t.$slide, { top: 0, left: a * i + a * t.opts.gutter, opacity: 1 }, e === o ? 0 : e, null, !1));
      },
      updateCursor: function (t, e) {
        var n,
          i = this,
          a = i.$refs.container.removeClass('fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-drag fancybox-can-zoomOut');
        i.current &&
          !i.isClosing &&
          (i.isZoomable()
            ? (a.addClass('fancybox-is-zoomable'),
              (n = t !== o && e !== o ? t < i.current.width && e < i.current.height : i.isScaledDown()),
              n
                ? a.addClass('fancybox-can-zoomIn')
                : i.current.opts.touch
                ? a.addClass('fancybox-can-drag')
                : a.addClass('fancybox-can-zoomOut'))
            : i.current.opts.touch && a.addClass('fancybox-can-drag'));
      },
      isZoomable: function () {
        var t,
          e = this,
          o = e.current;
        if (o && !e.isClosing)
          return !!(
            'image' === o.type &&
            o.isLoaded &&
            !o.hasError &&
            ('zoom' === o.opts.clickContent || (n.isFunction(o.opts.clickContent) && 'zoom' === o.opts.clickContent(o))) &&
            ((t = e.getFitPos(o)), o.width > t.width || o.height > t.height)
          );
      },
      isScaledDown: function () {
        var t = this,
          e = t.current,
          o = e.$content,
          i = !1;
        return o && ((i = n.fancybox.getTranslate(o)), (i = i.width < e.width || i.height < e.height)), i;
      },
      canPan: function () {
        var t = this,
          e = t.current,
          n = e.$content,
          o = !1;
        return n && ((o = t.getFitPos(e)), (o = Math.abs(n.width() - o.width) > 1 || Math.abs(n.height() - o.height) > 1)), o;
      },
      loadSlide: function (t) {
        var e,
          o,
          i,
          a = this;
        if (!t.isLoading && !t.isLoaded) {
          switch (
            ((t.isLoading = !0),
            a.trigger('beforeLoad', t),
            (e = t.type),
            (o = t.$slide),
            o
              .off('refresh')
              .trigger('onReset')
              .addClass('fancybox-slide--' + (e || 'unknown'))
              .addClass(t.opts.slideClass),
            e)
          ) {
            case 'image':
              a.setImage(t);
              break;
            case 'iframe':
              a.setIframe(t);
              break;
            case 'html':
              a.setContent(t, t.src || t.content);
              break;
            case 'inline':
              n(t.src).length ? a.setContent(t, n(t.src)) : a.setError(t);
              break;
            case 'ajax':
              a.showLoading(t),
                (i = n.ajax(
                  n.extend({}, t.opts.ajax.settings, {
                    url: t.src,
                    success: function (e, n) {
                      'success' === n && a.setContent(t, e);
                    },
                    error: function (e, n) {
                      e && 'abort' !== n && a.setError(t);
                    },
                  })
                )),
                o.one('onReset', function () {
                  i.abort();
                });
              break;
            case 'video':
              a.setContent(
                t,
                '<video controls><source src="' +
                  t.src +
                  '" type="' +
                  t.opts.videoFormat +
                  '">Your browser doesn\'t support HTML5 video</video>'
              );
              break;
            default:
              a.setError(t);
          }
          return !0;
        }
      },
      setImage: function (e) {
        var o,
          i,
          a,
          s,
          r = this,
          c = e.opts.srcset || e.opts.image.srcset;
        if (c) {
          (a = t.devicePixelRatio || 1),
            (s = t.innerWidth * a),
            (i = c.split(',').map(function (t) {
              var e = {};
              return (
                t
                  .trim()
                  .split(/\s+/)
                  .forEach(function (t, n) {
                    var o = parseInt(t.substring(0, t.length - 1), 10);
                    return 0 === n ? (e.url = t) : void (o && ((e.value = o), (e.postfix = t[t.length - 1])));
                  }),
                e
              );
            })),
            i.sort(function (t, e) {
              return t.value - e.value;
            });
          for (var l = 0; l < i.length; l++) {
            var u = i[l];
            if (('w' === u.postfix && u.value >= s) || ('x' === u.postfix && u.value >= a)) {
              o = u;
              break;
            }
          }
          !o && i.length && (o = i[i.length - 1]),
            o &&
              ((e.src = o.url),
              e.width && e.height && 'w' == o.postfix && ((e.height = (e.width / e.height) * o.value), (e.width = o.value)));
        }
        (e.$content = n('<div class="fancybox-image-wrap"></div>').addClass('fancybox-is-hidden').appendTo(e.$slide)),
          e.opts.preload !== !1 && e.opts.width && e.opts.height && (e.opts.thumb || e.opts.$thumb)
            ? ((e.width = e.opts.width),
              (e.height = e.opts.height),
              (e.$ghost = n('<img />')
                .one('error', function () {
                  n(this).remove(), (e.$ghost = null), r.setBigImage(e);
                })
                .one('load', function () {
                  r.afterLoad(e), r.setBigImage(e);
                })
                .addClass('fancybox-image')
                .appendTo(e.$content)
                .attr('src', e.opts.thumb || e.opts.$thumb.attr('src'))))
            : r.setBigImage(e);
      },
      setBigImage: function (t) {
        var e = this,
          o = n('<img />');
        (t.$image = o
          .one('error', function () {
            e.setError(t);
          })
          .one('load', function () {
            clearTimeout(t.timouts),
              (t.timouts = null),
              e.isClosing ||
                ((t.width = t.opts.width || this.naturalWidth),
                (t.height = t.opts.height || this.naturalHeight),
                t.opts.image.srcset && o.attr('sizes', '100vw').attr('srcset', t.opts.image.srcset),
                e.hideLoading(t),
                t.$ghost
                  ? (t.timouts = setTimeout(function () {
                      (t.timouts = null), t.$ghost.hide();
                    }, Math.min(300, Math.max(1e3, t.height / 1600))))
                  : e.afterLoad(t));
          })
          .addClass('fancybox-image')
          .attr('src', t.src)
          .appendTo(t.$content)),
          (o[0].complete || 'complete' == o[0].readyState) && o[0].naturalWidth && o[0].naturalHeight
            ? o.trigger('load')
            : o[0].error
            ? o.trigger('error')
            : (t.timouts = setTimeout(function () {
                o[0].complete || t.hasError || e.showLoading(t);
              }, 100));
      },
      setIframe: function (t) {
        var e,
          i = this,
          a = t.opts.iframe,
          s = t.$slide;
        (t.$content = n('<div class="fancybox-content' + (a.preload ? ' fancybox-is-hidden' : '') + '"></div>')
          .css(a.css)
          .appendTo(s)),
          (e = n(a.tpl.replace(/\{rnd\}/g, new Date().getTime()))
            .attr(a.attr)
            .appendTo(t.$content)),
          a.preload
            ? (i.showLoading(t),
              e.on('load.fb error.fb', function (e) {
                (this.isReady = 1), t.$slide.trigger('refresh'), i.afterLoad(t);
              }),
              s.on('refresh.fb', function () {
                var n,
                  i,
                  s,
                  r = t.$content,
                  c = a.css.width,
                  l = a.css.height;
                if (1 === e[0].isReady) {
                  try {
                    (i = e.contents()), (s = i.find('body'));
                  } catch (t) {}
                  s &&
                    s.length &&
                    (c === o &&
                      ((n = e[0].contentWindow.document.documentElement.scrollWidth),
                      (c = Math.ceil(s.outerWidth(!0) + (r.width() - n))),
                      (c += r.outerWidth() - r.innerWidth())),
                    l === o && ((l = Math.ceil(s.outerHeight(!0))), (l += r.outerHeight() - r.innerHeight())),
                    c && r.width(c),
                    l && r.height(l)),
                    r.removeClass('fancybox-is-hidden');
                }
              }))
            : this.afterLoad(t),
          e.attr('src', t.src),
          t.opts.smallBtn === !0 && t.$content.prepend(i.translate(t, t.opts.btnTpl.smallBtn)),
          s.one('onReset', function () {
            try {
              n(this).find('iframe').hide().attr('src', '//about:blank');
            } catch (t) {}
            n(this).empty(), (t.isLoaded = !1);
          });
      },
      setContent: function (t, e) {
        var o = this;
        o.isClosing ||
          (o.hideLoading(t),
          t.$slide.empty(),
          l(e) && e.parent().length
            ? (e.parent('.fancybox-slide--inline').trigger('onReset'),
              (t.$placeholder = n('<div></div>').hide().insertAfter(e)),
              e.css('display', 'inline-block'))
            : t.hasError ||
              ('string' === n.type(e) && ((e = n('<div>').append(n.trim(e)).contents()), 3 === e[0].nodeType && (e = n('<div>').html(e))),
              t.opts.filter && (e = n('<div>').html(e).find(t.opts.filter))),
          t.$slide.one('onReset', function () {
            n(this).find('video,audio').trigger('pause'),
              t.$placeholder && (t.$placeholder.after(e.hide()).remove(), (t.$placeholder = null)),
              t.$smallBtn && (t.$smallBtn.remove(), (t.$smallBtn = null)),
              t.hasError || (n(this).empty(), (t.isLoaded = !1));
          }),
          (t.$content = n(e).appendTo(t.$slide)),
          this.afterLoad(t));
      },
      setError: function (t) {
        (t.hasError = !0), t.$slide.removeClass('fancybox-slide--' + t.type), this.setContent(t, this.translate(t, t.opts.errorTpl));
      },
      showLoading: function (t) {
        var e = this;
        (t = t || e.current), t && !t.$spinner && (t.$spinner = n(e.opts.spinnerTpl).appendTo(t.$slide));
      },
      hideLoading: function (t) {
        var e = this;
        (t = t || e.current), t && t.$spinner && (t.$spinner.remove(), delete t.$spinner);
      },
      afterLoad: function (t) {
        var e = this;
        e.isClosing ||
          ((t.isLoading = !1),
          (t.isLoaded = !0),
          e.trigger('afterLoad', t),
          e.hideLoading(t),
          t.opts.smallBtn &&
            !t.$smallBtn &&
            (t.$smallBtn = n(e.translate(t, t.opts.btnTpl.smallBtn)).appendTo(t.$content.filter('div,form').first())),
          t.opts.protect &&
            t.$content &&
            !t.hasError &&
            (t.$content.on('contextmenu.fb', function (t) {
              return 2 == t.button && t.preventDefault(), !0;
            }),
            'image' === t.type && n('<div class="fancybox-spaceball"></div>').appendTo(t.$content)),
          e.revealContent(t));
      },
      revealContent: function (t) {
        var e,
          i,
          a,
          s,
          r,
          c = this,
          l = t.$slide,
          u = !1;
        return (
          (e = t.opts[c.firstRun ? 'animationEffect' : 'transitionEffect']),
          (a = t.opts[c.firstRun ? 'animationDuration' : 'transitionDuration']),
          (a = parseInt(t.forcedDuration === o ? a : t.forcedDuration, 10)),
          (!t.isMoved && t.pos === c.currPos && a) || (e = !1),
          'zoom' !== e || (t.pos === c.currPos && a && 'image' === t.type && !t.hasError && (u = c.getThumbPos(t))) || (e = 'fade'),
          'zoom' === e
            ? ((r = c.getFitPos(t)),
              (r.scaleX = r.width / u.width),
              (r.scaleY = r.height / u.height),
              delete r.width,
              delete r.height,
              (s = t.opts.zoomOpacity),
              'auto' == s && (s = Math.abs(t.width / t.height - u.width / u.height) > 0.1),
              s && ((u.opacity = 0.1), (r.opacity = 1)),
              n.fancybox.setTranslate(t.$content.removeClass('fancybox-is-hidden'), u),
              f(t.$content),
              void n.fancybox.animate(t.$content, r, a, function () {
                c.complete();
              }))
            : (c.updateSlide(t),
              e
                ? (n.fancybox.stop(l),
                  (i = 'fancybox-animated fancybox-slide--' + (t.pos >= c.prevPos ? 'next' : 'previous') + ' fancybox-fx-' + e),
                  l.removeAttr('style').removeClass('fancybox-slide--current fancybox-slide--next fancybox-slide--previous').addClass(i),
                  t.$content.removeClass('fancybox-is-hidden'),
                  f(l),
                  void n.fancybox.animate(
                    l,
                    'fancybox-slide--current',
                    a,
                    function (e) {
                      l.removeClass(i).removeAttr('style'), t.pos === c.currPos && c.complete();
                    },
                    !0
                  ))
                : (f(l), t.$content.removeClass('fancybox-is-hidden'), void (t.pos === c.currPos && c.complete())))
        );
      },
      getThumbPos: function (o) {
        var i,
          a = this,
          s = !1,
          r = function (e) {
            for (var o, i = e[0], a = i.getBoundingClientRect(), s = []; null !== i.parentElement; )
              ('hidden' !== n(i.parentElement).css('overflow') && 'auto' !== n(i.parentElement).css('overflow')) ||
                s.push(i.parentElement.getBoundingClientRect()),
                (i = i.parentElement);
            return (
              (o = s.every(function (t) {
                var e = Math.min(a.right, t.right) - Math.max(a.left, t.left),
                  n = Math.min(a.bottom, t.bottom) - Math.max(a.top, t.top);
                return e > 0 && n > 0;
              })),
              o && a.bottom > 0 && a.right > 0 && a.left < n(t).width() && a.top < n(t).height()
            );
          },
          c = o.opts.$thumb,
          l = c ? c.offset() : 0;
        return (
          l &&
            c[0].ownerDocument === e &&
            r(c) &&
            ((i = a.$refs.stage.offset()),
            (s = {
              top: l.top - i.top + parseFloat(c.css('border-top-width') || 0),
              left: l.left - i.left + parseFloat(c.css('border-left-width') || 0),
              width: c.width(),
              height: c.height(),
              scaleX: 1,
              scaleY: 1,
            })),
          s
        );
      },
      complete: function () {
        var t = this,
          o = t.current,
          i = {};
        o.isMoved ||
          !o.isLoaded ||
          o.isComplete ||
          ((o.isComplete = !0),
          o.$slide.siblings().trigger('onReset'),
          t.preload('inline'),
          f(o.$slide),
          o.$slide.addClass('fancybox-slide--complete'),
          n.each(t.slides, function (e, o) {
            o.pos >= t.currPos - 1 && o.pos <= t.currPos + 1 ? (i[o.pos] = o) : o && (n.fancybox.stop(o.$slide), o.$slide.off().remove());
          }),
          (t.slides = i),
          t.updateCursor(),
          t.trigger('afterShow'),
          o.$slide.find('video,audio').first().trigger('play'),
          (n(e.activeElement).is('[disabled]') || (o.opts.autoFocus && 'image' != o.type && 'iframe' !== o.type)) && t.focus());
      },
      preload: function (t) {
        var e = this,
          n = e.slides[e.currPos + 1],
          o = e.slides[e.currPos - 1];
        n && n.type === t && e.loadSlide(n), o && o.type === t && e.loadSlide(o);
      },
      focus: function () {
        var t,
          e = this.current;
        this.isClosing ||
          (e &&
            e.isComplete &&
            ((t = e.$slide.find('input[autofocus]:enabled:visible:first')),
            t.length || (t = e.$slide.find('button,:input,[tabindex],a').filter(':enabled:visible:first'))),
          (t = t && t.length ? t : this.$refs.container),
          t.focus());
      },
      activate: function () {
        var t = this;
        n('.fancybox-container').each(function () {
          var e = n(this).data('FancyBox');
          e && e.id !== t.id && !e.isClosing && (e.trigger('onDeactivate'), e.removeEvents(), (e.isVisible = !1));
        }),
          (t.isVisible = !0),
          (t.current || t.isIdle) && (t.update(), t.updateControls()),
          t.trigger('onActivate'),
          t.addEvents();
      },
      close: function (t, e) {
        var o,
          i,
          a,
          s,
          r,
          c,
          l = this,
          p = l.current,
          h = function () {
            l.cleanUp(t);
          };
        return (
          !l.isClosing &&
          ((l.isClosing = !0),
          l.trigger('beforeClose', t) === !1
            ? ((l.isClosing = !1),
              u(function () {
                l.update();
              }),
              !1)
            : (l.removeEvents(),
              p.timouts && clearTimeout(p.timouts),
              (a = p.$content),
              (o = p.opts.animationEffect),
              (i = n.isNumeric(e) ? e : o ? p.opts.animationDuration : 0),
              p.$slide.off(d).removeClass('fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated'),
              p.$slide.siblings().trigger('onReset').remove(),
              i && l.$refs.container.removeClass('fancybox-is-open').addClass('fancybox-is-closing'),
              l.hideLoading(p),
              l.hideControls(),
              l.updateCursor(),
              'zoom' !== o || (t !== !0 && a && i && 'image' === p.type && !p.hasError && (c = l.getThumbPos(p))) || (o = 'fade'),
              'zoom' === o
                ? (n.fancybox.stop(a),
                  (r = n.fancybox.getTranslate(a)),
                  (r.width = r.width * r.scaleX),
                  (r.height = r.height * r.scaleY),
                  (s = p.opts.zoomOpacity),
                  'auto' == s && (s = Math.abs(p.width / p.height - c.width / c.height) > 0.1),
                  s && (c.opacity = 0),
                  (r.scaleX = r.width / c.width),
                  (r.scaleY = r.height / c.height),
                  (r.width = c.width),
                  (r.height = c.height),
                  n.fancybox.setTranslate(p.$content, r),
                  f(p.$content),
                  n.fancybox.animate(p.$content, c, i, h),
                  !0)
                : (o && i
                    ? t === !0
                      ? setTimeout(h, i)
                      : n.fancybox.animate(
                          p.$slide.removeClass('fancybox-slide--current'),
                          'fancybox-animated fancybox-slide--previous fancybox-fx-' + o,
                          i,
                          h
                        )
                    : h(),
                  !0)))
        );
      },
      cleanUp: function (t) {
        var o,
          i,
          a = this,
          r = n('body');
        a.current.$slide.trigger('onReset'),
          a.$refs.container.empty().remove(),
          a.trigger('afterClose', t),
          a.$lastFocus && a.current.opts.backFocus && a.$lastFocus.focus(),
          (a.current = null),
          (o = n.fancybox.getInstance()),
          o
            ? o.activate()
            : (s.scrollTop(a.scrollTop).scrollLeft(a.scrollLeft),
              r.removeClass('fancybox-active compensate-for-scrollbar'),
              r.hasClass('fancybox-iosfix') &&
                ((i = parseInt(e.body.style.top, 10)),
                r
                  .removeClass('fancybox-iosfix')
                  .css('top', '')
                  .scrollTop(i * -1)),
              n('#fancybox-style-noscroll').remove());
      },
      trigger: function (t, e) {
        var o,
          i = Array.prototype.slice.call(arguments, 1),
          a = this,
          s = e && e.opts ? e : a.current;
        return (
          s ? i.unshift(s) : (s = a),
          i.unshift(a),
          n.isFunction(s.opts[t]) && (o = s.opts[t].apply(s, i)),
          o === !1 ? o : void ('afterClose' !== t && a.$refs ? a.$refs.container.trigger(t + '.fb', i) : r.trigger(t + '.fb', i))
        );
      },
      updateControls: function (t) {
        var e = this,
          n = e.current,
          o = n.index,
          i = n.opts.caption,
          a = e.$refs.container,
          s = e.$refs.caption;
        n.$slide.trigger('refresh'),
          (e.$caption = i && i.length ? s.html(i) : null),
          e.isHiddenControls || e.isIdle || e.showControls(),
          a.find('[data-fancybox-count]').html(e.group.length),
          a.find('[data-fancybox-index]').html(o + 1),
          a.find('[data-fancybox-prev]').prop('disabled', !n.opts.loop && o <= 0),
          a.find('[data-fancybox-next]').prop('disabled', !n.opts.loop && o >= e.group.length - 1),
          'image' === n.type
            ? a
                .find('[data-fancybox-download]')
                .attr('href', n.opts.image.src || n.src)
                .show()
            : a.find('[data-fancybox-download],[data-fancybox-zoom]').hide();
      },
      hideControls: function () {
        (this.isHiddenControls = !0),
          this.$refs.container.removeClass('fancybox-show-infobar fancybox-show-toolbar fancybox-show-caption fancybox-show-nav');
      },
      showControls: function () {
        var t = this,
          e = t.current ? t.current.opts : t.opts,
          n = t.$refs.container;
        (t.isHiddenControls = !1),
          (t.idleSecondsCounter = 0),
          n
            .toggleClass('fancybox-show-toolbar', !(!e.toolbar || !e.buttons))
            .toggleClass('fancybox-show-infobar', !!(e.infobar && t.group.length > 1))
            .toggleClass('fancybox-show-nav', !!(e.arrows && t.group.length > 1))
            .toggleClass('fancybox-is-modal', !!e.modal),
          t.$caption ? n.addClass('fancybox-show-caption ') : n.removeClass('fancybox-show-caption');
      },
      toggleControls: function () {
        this.isHiddenControls ? this.showControls() : this.hideControls();
      },
    }),
      (n.fancybox = {
        version: '3.2.10',
        defaults: a,
        getInstance: function (t) {
          var e = n('.fancybox-container:not(".fancybox-is-closing"):last').data('FancyBox'),
            o = Array.prototype.slice.call(arguments, 1);
          return e instanceof p && ('string' === n.type(t) ? e[t].apply(e, o) : 'function' === n.type(t) && t.apply(e, o), e);
        },
        open: function (t, e, n) {
          return new p(t, e, n);
        },
        close: function (t) {
          var e = this.getInstance();
          e && (e.close(), t === !0 && this.close());
        },
        destroy: function () {
          this.close(!0), r.off('click.fb-start');
        },
        isMobile: e.createTouch !== o && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        use3d: (function () {
          var n = e.createElement('div');
          return t.getComputedStyle && t.getComputedStyle(n).getPropertyValue('transform') && !(e.documentMode && e.documentMode < 11);
        })(),
        getTranslate: function (t) {
          var e;
          if (!t || !t.length) return !1;
          if (
            ((e = t.eq(0).css('transform')),
            e && e.indexOf('matrix') !== -1 ? ((e = e.split('(')[1]), (e = e.split(')')[0]), (e = e.split(','))) : (e = []),
            e.length)
          )
            (e = e.length > 10 ? [e[13], e[12], e[0], e[5]] : [e[5], e[4], e[0], e[3]]), (e = e.map(parseFloat));
          else {
            e = [0, 0, 1, 1];
            var n = /\.*translate\((.*)px,(.*)px\)/i,
              o = n.exec(t.eq(0).attr('style'));
            o && ((e[0] = parseFloat(o[2])), (e[1] = parseFloat(o[1])));
          }
          return {
            top: e[0],
            left: e[1],
            scaleX: e[2],
            scaleY: e[3],
            opacity: parseFloat(t.css('opacity')),
            width: t.width(),
            height: t.height(),
          };
        },
        setTranslate: function (t, e) {
          var n = '',
            i = {};
          if (t && e)
            return (
              (e.left === o && e.top === o) ||
                ((n = (e.left === o ? t.position().left : e.left) + 'px, ' + (e.top === o ? t.position().top : e.top) + 'px'),
                (n = this.use3d ? 'translate3d(' + n + ', 0px)' : 'translate(' + n + ')')),
              e.scaleX !== o && e.scaleY !== o && (n = (n.length ? n + ' ' : '') + 'scale(' + e.scaleX + ', ' + e.scaleY + ')'),
              n.length && (i.transform = n),
              e.opacity !== o && (i.opacity = e.opacity),
              e.width !== o && (i.width = e.width),
              e.height !== o && (i.height = e.height),
              t.css(i)
            );
        },
        animate: function (t, e, i, a, s) {
          n.isFunction(i) && ((a = i), (i = null)),
            n.isPlainObject(e) || t.removeAttr('style'),
            t.on(d, function (i) {
              (!i || !i.originalEvent || (t.is(i.originalEvent.target) && 'z-index' != i.originalEvent.propertyName)) &&
                (n.fancybox.stop(t),
                n.isPlainObject(e)
                  ? (e.scaleX !== o &&
                      e.scaleY !== o &&
                      (t.css('transition-duration', ''),
                      (e.width = Math.round(t.width() * e.scaleX)),
                      (e.height = Math.round(t.height() * e.scaleY)),
                      (e.scaleX = 1),
                      (e.scaleY = 1),
                      n.fancybox.setTranslate(t, e)),
                    s === !1 && t.removeAttr('style'))
                  : s !== !0 && t.removeClass(e),
                n.isFunction(a) && a(i));
            }),
            n.isNumeric(i) && t.css('transition-duration', i + 'ms'),
            n.isPlainObject(e) ? n.fancybox.setTranslate(t, e) : t.addClass(e),
            e.scaleX && t.hasClass('fancybox-image-wrap') && t.parent().addClass('fancybox-is-scaling'),
            t.data(
              'timer',
              setTimeout(function () {
                t.trigger('transitionend');
              }, i + 16)
            );
        },
        stop: function (t) {
          clearTimeout(t.data('timer')),
            t.off('transitionend').css('transition-duration', ''),
            t.hasClass('fancybox-image-wrap') && t.parent().removeClass('fancybox-is-scaling');
        },
      }),
      (n.fn.fancybox = function (t) {
        var e;
        return (
          (t = t || {}),
          (e = t.selector || !1),
          e
            ? n('body').off('click.fb-start', e).on('click.fb-start', e, { options: t }, i)
            : this.off('click.fb-start').on('click.fb-start', { items: this, options: t }, i),
          this
        );
      }),
      r.on('click.fb-start', '[data-fancybox]', i);
  }
})(window, document, window.jQuery || jQuery),
  (function (t) {
    'use strict';
    var e = function (e, n, o) {
        if (e)
          return (
            (o = o || ''),
            'object' === t.type(o) && (o = t.param(o, !0)),
            t.each(n, function (t, n) {
              e = e.replace('$' + t, n || '');
            }),
            o.length && (e += (e.indexOf('?') > 0 ? '&' : '?') + o),
            e
          );
      },
      n = {
        youtube: {
          matcher:
            /(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,
          params: { autoplay: 1, autohide: 1, fs: 1, rel: 0, hd: 1, wmode: 'transparent', enablejsapi: 1, html5: 1 },
          paramPlace: 8,
          type: 'iframe',
          url: '//www.youtube.com/embed/$4',
          thumb: '//img.youtube.com/vi/$4/hqdefault.jpg',
        },
        vimeo: {
          matcher: /^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,
          params: { autoplay: 1, hd: 1, show_title: 1, show_byline: 1, show_portrait: 0, fullscreen: 1, api: 1 },
          paramPlace: 3,
          type: 'iframe',
          url: '//player.vimeo.com/video/$2',
        },
        metacafe: { matcher: /metacafe.com\/watch\/(\d+)\/(.*)?/, type: 'iframe', url: '//www.metacafe.com/embed/$1/?ap=1' },
        dailymotion: {
          matcher: /dailymotion.com\/video\/(.*)\/?(.*)/,
          params: { additionalInfos: 0, autoStart: 1 },
          type: 'iframe',
          url: '//www.dailymotion.com/embed/video/$1',
        },
        vine: { matcher: /vine.co\/v\/([a-zA-Z0-9\?\=\-]+)/, type: 'iframe', url: '//vine.co/v/$1/embed/simple' },
        instagram: { matcher: /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i, type: 'image', url: '//$1/p/$2/media/?size=l' },
        gmap_place: {
          matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,
          type: 'iframe',
          url: function (t) {
            return (
              '//maps.google.' +
              t[2] +
              '/?ll=' +
              (t[9] ? t[9] + '&z=' + Math.floor(t[10]) + (t[12] ? t[12].replace(/^\//, '&') : '') : t[12]) +
              '&output=' +
              (t[12] && t[12].indexOf('layer=c') > 0 ? 'svembed' : 'embed')
            );
          },
        },
        gmap_search: {
          matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i,
          type: 'iframe',
          url: function (t) {
            return '//maps.google.' + t[2] + '/maps?q=' + t[5].replace('query=', 'q=').replace('api=1', '') + '&output=embed';
          },
        },
      };
    t(document).on('objectNeedsType.fb', function (o, i, a) {
      var s,
        r,
        c,
        l,
        u,
        d,
        f,
        p = a.src || '',
        h = !1;
      (s = t.extend(!0, {}, n, a.opts.media)),
        t.each(s, function (n, o) {
          if ((c = p.match(o.matcher))) {
            if (((h = o.type), (d = {}), o.paramPlace && c[o.paramPlace])) {
              (u = c[o.paramPlace]), '?' == u[0] && (u = u.substring(1)), (u = u.split('&'));
              for (var i = 0; i < u.length; ++i) {
                var s = u[i].split('=', 2);
                2 == s.length && (d[s[0]] = decodeURIComponent(s[1].replace(/\+/g, ' ')));
              }
            }
            return (
              (l = t.extend(!0, {}, o.params, a.opts[n], d)),
              (p = 'function' === t.type(o.url) ? o.url.call(this, c, l, a) : e(o.url, c, l)),
              (r = 'function' === t.type(o.thumb) ? o.thumb.call(this, c, l, a) : e(o.thumb, c)),
              'vimeo' === n && (p = p.replace('&%23', '#')),
              !1
            );
          }
        }),
        h
          ? ((a.src = p),
            (a.type = h),
            a.opts.thumb || (a.opts.$thumb && a.opts.$thumb.length) || (a.opts.thumb = r),
            'iframe' === h &&
              (t.extend(!0, a.opts, { iframe: { preload: !1, attr: { scrolling: 'no' } } }),
              (a.contentProvider = f),
              (a.opts.slideClass += ' fancybox-slide--' + ('gmap_place' == f || 'gmap_search' == f ? 'map' : 'video'))))
          : p && (a.type = a.opts.defaultType);
    });
  })(window.jQuery || jQuery),
  (function (t, e, n) {
    'use strict';
    var o = (function () {
        return (
          t.requestAnimationFrame ||
          t.webkitRequestAnimationFrame ||
          t.mozRequestAnimationFrame ||
          t.oRequestAnimationFrame ||
          function (e) {
            return t.setTimeout(e, 1e3 / 60);
          }
        );
      })(),
      i = (function () {
        return (
          t.cancelAnimationFrame ||
          t.webkitCancelAnimationFrame ||
          t.mozCancelAnimationFrame ||
          t.oCancelAnimationFrame ||
          function (e) {
            t.clearTimeout(e);
          }
        );
      })(),
      a = function (e) {
        var n = [];
        (e = e.originalEvent || e || t.e),
          (e = e.touches && e.touches.length ? e.touches : e.changedTouches && e.changedTouches.length ? e.changedTouches : [e]);
        for (var o in e)
          e[o].pageX ? n.push({ x: e[o].pageX, y: e[o].pageY }) : e[o].clientX && n.push({ x: e[o].clientX, y: e[o].clientY });
        return n;
      },
      s = function (t, e, n) {
        return e && t ? ('x' === n ? t.x - e.x : 'y' === n ? t.y - e.y : Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2))) : 0;
      },
      r = function (t) {
        if (
          t.is('a,area,button,[role="button"],input,label,select,summary,textarea') ||
          n.isFunction(t.get(0).onclick) ||
          t.data('selectable')
        )
          return !0;
        for (var e = 0, o = t[0].attributes, i = o.length; e < i; e++) if ('data-fancybox-' === o[e].nodeName.substr(0, 14)) return !0;
        return !1;
      },
      c = function (e) {
        var n = t.getComputedStyle(e)['overflow-y'],
          o = t.getComputedStyle(e)['overflow-x'],
          i = ('scroll' === n || 'auto' === n) && e.scrollHeight > e.clientHeight,
          a = ('scroll' === o || 'auto' === o) && e.scrollWidth > e.clientWidth;
        return i || a;
      },
      l = function (t) {
        for (var e = !1; ; ) {
          if ((e = c(t.get(0)))) break;
          if (((t = t.parent()), !t.length || t.hasClass('fancybox-stage') || t.is('body'))) break;
        }
        return e;
      },
      u = function (t) {
        var e = this;
        (e.instance = t),
          (e.$bg = t.$refs.bg),
          (e.$stage = t.$refs.stage),
          (e.$container = t.$refs.container),
          e.destroy(),
          e.$container.on('touchstart.fb.touch mousedown.fb.touch', n.proxy(e, 'ontouchstart'));
      };
    (u.prototype.destroy = function () {
      this.$container.off('.fb.touch');
    }),
      (u.prototype.ontouchstart = function (o) {
        var i = this,
          c = n(o.target),
          u = i.instance,
          d = u.current,
          f = d.$content,
          p = 'touchstart' == o.type;
        if (
          (p && i.$container.off('mousedown.fb.touch'),
          (!o.originalEvent || 2 != o.originalEvent.button) &&
            c.length &&
            !r(c) &&
            !r(c.parent()) &&
            (c.is('img') || !(o.originalEvent.clientX > c[0].clientWidth + c.offset().left)))
        ) {
          if (!d || i.instance.isAnimating || i.instance.isClosing) return o.stopPropagation(), void o.preventDefault();
          if (((i.realPoints = i.startPoints = a(o)), i.startPoints)) {
            if (
              (o.stopPropagation(),
              (i.startEvent = o),
              (i.canTap = !0),
              (i.$target = c),
              (i.$content = f),
              (i.opts = d.opts.touch),
              (i.isPanning = !1),
              (i.isSwiping = !1),
              (i.isZooming = !1),
              (i.isScrolling = !1),
              (i.sliderStartPos = i.sliderLastPos || { top: 0, left: 0 }),
              (i.contentStartPos = n.fancybox.getTranslate(i.$content)),
              (i.contentLastPos = null),
              (i.startTime = new Date().getTime()),
              (i.distanceX = i.distanceY = i.distance = 0),
              (i.canvasWidth = Math.round(d.$slide[0].clientWidth)),
              (i.canvasHeight = Math.round(d.$slide[0].clientHeight)),
              n(e)
                .off('.fb.touch')
                .on(p ? 'touchend.fb.touch touchcancel.fb.touch' : 'mouseup.fb.touch mouseleave.fb.touch', n.proxy(i, 'ontouchend'))
                .on(p ? 'touchmove.fb.touch' : 'mousemove.fb.touch', n.proxy(i, 'ontouchmove')),
              n.fancybox.isMobile && e.addEventListener('scroll', i.onscroll, !0),
              (!i.opts && !u.canPan()) || (!c.is(i.$stage) && !i.$stage.find(c).length))
            )
              return void (c.is('img') && o.preventDefault());
            (n.fancybox.isMobile && (l(c) || l(c.parent()))) || o.preventDefault(),
              1 === i.startPoints.length &&
                ('image' === d.type && (i.contentStartPos.width > i.canvasWidth + 1 || i.contentStartPos.height > i.canvasHeight + 1)
                  ? (n.fancybox.stop(i.$content), i.$content.css('transition-duration', ''), (i.isPanning = !0))
                  : (i.isSwiping = !0),
                i.$container.addClass('fancybox-controls--isGrabbing')),
              2 !== i.startPoints.length ||
                u.isAnimating ||
                d.hasError ||
                'image' !== d.type ||
                (!d.isLoaded && !d.$ghost) ||
                ((i.canTap = !1),
                (i.isSwiping = !1),
                (i.isPanning = !1),
                (i.isZooming = !0),
                n.fancybox.stop(i.$content),
                i.$content.css('transition-duration', ''),
                (i.centerPointStartX = 0.5 * (i.startPoints[0].x + i.startPoints[1].x) - n(t).scrollLeft()),
                (i.centerPointStartY = 0.5 * (i.startPoints[0].y + i.startPoints[1].y) - n(t).scrollTop()),
                (i.percentageOfImageAtPinchPointX = (i.centerPointStartX - i.contentStartPos.left) / i.contentStartPos.width),
                (i.percentageOfImageAtPinchPointY = (i.centerPointStartY - i.contentStartPos.top) / i.contentStartPos.height),
                (i.startDistanceBetweenFingers = s(i.startPoints[0], i.startPoints[1])));
          }
        }
      }),
      (u.prototype.onscroll = function (t) {
        self.isScrolling = !0;
      }),
      (u.prototype.ontouchmove = function (t) {
        var e = this,
          o = n(t.target);
        return e.isScrolling || (!o.is(e.$stage) && !e.$stage.find(o).length)
          ? void (e.canTap = !1)
          : ((e.newPoints = a(t)),
            void (
              (e.opts || e.instance.canPan()) &&
              e.newPoints &&
              e.newPoints.length &&
              ((e.isSwiping && e.isSwiping === !0) || t.preventDefault(),
              (e.distanceX = s(e.newPoints[0], e.startPoints[0], 'x')),
              (e.distanceY = s(e.newPoints[0], e.startPoints[0], 'y')),
              (e.distance = s(e.newPoints[0], e.startPoints[0])),
              e.distance > 0 && (e.isSwiping ? e.onSwipe(t) : e.isPanning ? e.onPan() : e.isZooming && e.onZoom()))
            ));
      }),
      (u.prototype.onSwipe = function (e) {
        var a,
          s = this,
          r = s.isSwiping,
          c = s.sliderStartPos.left || 0;
        if (r !== !0)
          'x' == r &&
            (s.distanceX > 0 && (s.instance.group.length < 2 || (0 === s.instance.current.index && !s.instance.current.opts.loop))
              ? (c += Math.pow(s.distanceX, 0.8))
              : s.distanceX < 0 &&
                (s.instance.group.length < 2 || (s.instance.current.index === s.instance.group.length - 1 && !s.instance.current.opts.loop))
              ? (c -= Math.pow(-s.distanceX, 0.8))
              : (c += s.distanceX)),
            (s.sliderLastPos = { top: 'x' == r ? 0 : s.sliderStartPos.top + s.distanceY, left: c }),
            s.requestId && (i(s.requestId), (s.requestId = null)),
            (s.requestId = o(function () {
              s.sliderLastPos &&
                (n.each(s.instance.slides, function (t, e) {
                  var o = e.pos - s.instance.currPos;
                  n.fancybox.setTranslate(e.$slide, {
                    top: s.sliderLastPos.top,
                    left: s.sliderLastPos.left + o * s.canvasWidth + o * e.opts.gutter,
                  });
                }),
                s.$container.addClass('fancybox-is-sliding'));
            }));
        else if (Math.abs(s.distance) > 10) {
          if (
            ((s.canTap = !1),
            s.instance.group.length < 2 && s.opts.vertical
              ? (s.isSwiping = 'y')
              : s.instance.isDragging || s.opts.vertical === !1 || ('auto' === s.opts.vertical && n(t).width() > 800)
              ? (s.isSwiping = 'x')
              : ((a = Math.abs((180 * Math.atan2(s.distanceY, s.distanceX)) / Math.PI)), (s.isSwiping = a > 45 && a < 135 ? 'y' : 'x')),
            (s.canTap = !1),
            'y' === s.isSwiping && n.fancybox.isMobile && (l(s.$target) || l(s.$target.parent())))
          )
            return void (s.isScrolling = !0);
          (s.instance.isDragging = s.isSwiping),
            (s.startPoints = s.newPoints),
            n.each(s.instance.slides, function (t, e) {
              n.fancybox.stop(e.$slide),
                e.$slide.css('transition-duration', ''),
                (e.inTransition = !1),
                e.pos === s.instance.current.pos && (s.sliderStartPos.left = n.fancybox.getTranslate(e.$slide).left);
            }),
            s.instance.SlideShow && s.instance.SlideShow.isActive && s.instance.SlideShow.stop();
        }
      }),
      (u.prototype.onPan = function () {
        var t = this;
        return s(t.newPoints[0], t.realPoints[0]) < (n.fancybox.isMobile ? 10 : 5)
          ? void (t.startPoints = t.newPoints)
          : ((t.canTap = !1),
            (t.contentLastPos = t.limitMovement()),
            t.requestId && (i(t.requestId), (t.requestId = null)),
            void (t.requestId = o(function () {
              n.fancybox.setTranslate(t.$content, t.contentLastPos);
            })));
      }),
      (u.prototype.limitMovement = function () {
        var t,
          e,
          n,
          o,
          i,
          a,
          s = this,
          r = s.canvasWidth,
          c = s.canvasHeight,
          l = s.distanceX,
          u = s.distanceY,
          d = s.contentStartPos,
          f = d.left,
          p = d.top,
          h = d.width,
          g = d.height;
        return (
          (i = h > r ? f + l : f),
          (a = p + u),
          (t = Math.max(0, 0.5 * r - 0.5 * h)),
          (e = Math.max(0, 0.5 * c - 0.5 * g)),
          (n = Math.min(r - h, 0.5 * r - 0.5 * h)),
          (o = Math.min(c - g, 0.5 * c - 0.5 * g)),
          h > r &&
            (l > 0 && i > t && (i = t - 1 + Math.pow(-t + f + l, 0.8) || 0), l < 0 && i < n && (i = n + 1 - Math.pow(n - f - l, 0.8) || 0)),
          g > c &&
            (u > 0 && a > e && (a = e - 1 + Math.pow(-e + p + u, 0.8) || 0), u < 0 && a < o && (a = o + 1 - Math.pow(o - p - u, 0.8) || 0)),
          { top: a, left: i, scaleX: d.scaleX, scaleY: d.scaleY }
        );
      }),
      (u.prototype.limitPosition = function (t, e, n, o) {
        var i = this,
          a = i.canvasWidth,
          s = i.canvasHeight;
        return (
          n > a ? ((t = t > 0 ? 0 : t), (t = t < a - n ? a - n : t)) : (t = Math.max(0, a / 2 - n / 2)),
          o > s ? ((e = e > 0 ? 0 : e), (e = e < s - o ? s - o : e)) : (e = Math.max(0, s / 2 - o / 2)),
          { top: e, left: t }
        );
      }),
      (u.prototype.onZoom = function () {
        var e = this,
          a = e.contentStartPos.width,
          r = e.contentStartPos.height,
          c = e.contentStartPos.left,
          l = e.contentStartPos.top,
          u = s(e.newPoints[0], e.newPoints[1]),
          d = u / e.startDistanceBetweenFingers,
          f = Math.floor(a * d),
          p = Math.floor(r * d),
          h = (a - f) * e.percentageOfImageAtPinchPointX,
          g = (r - p) * e.percentageOfImageAtPinchPointY,
          b = (e.newPoints[0].x + e.newPoints[1].x) / 2 - n(t).scrollLeft(),
          m = (e.newPoints[0].y + e.newPoints[1].y) / 2 - n(t).scrollTop(),
          y = b - e.centerPointStartX,
          v = m - e.centerPointStartY,
          x = c + (h + y),
          w = l + (g + v),
          $ = { top: w, left: x, scaleX: e.contentStartPos.scaleX * d, scaleY: e.contentStartPos.scaleY * d };
        (e.canTap = !1),
          (e.newWidth = f),
          (e.newHeight = p),
          (e.contentLastPos = $),
          e.requestId && (i(e.requestId), (e.requestId = null)),
          (e.requestId = o(function () {
            n.fancybox.setTranslate(e.$content, e.contentLastPos);
          }));
      }),
      (u.prototype.ontouchend = function (t) {
        var o = this,
          s = Math.max(new Date().getTime() - o.startTime, 1),
          r = o.isSwiping,
          c = o.isPanning,
          l = o.isZooming,
          u = o.isScrolling;
        return (
          (o.endPoints = a(t)),
          o.$container.removeClass('fancybox-controls--isGrabbing'),
          n(e).off('.fb.touch'),
          e.removeEventListener('scroll', o.onscroll, !0),
          o.requestId && (i(o.requestId), (o.requestId = null)),
          (o.isSwiping = !1),
          (o.isPanning = !1),
          (o.isZooming = !1),
          (o.isScrolling = !1),
          (o.instance.isDragging = !1),
          o.canTap
            ? o.onTap(t)
            : ((o.speed = 366),
              (o.velocityX = (o.distanceX / s) * 0.5),
              (o.velocityY = (o.distanceY / s) * 0.5),
              (o.speedX = Math.max(0.5 * o.speed, Math.min(1.5 * o.speed, (1 / Math.abs(o.velocityX)) * o.speed))),
              void (c ? o.endPanning() : l ? o.endZooming() : o.endSwiping(r, u)))
        );
      }),
      (u.prototype.endSwiping = function (t, e) {
        var o = this,
          i = !1,
          a = o.instance.group.length;
        (o.sliderLastPos = null),
          'y' == t && !e && Math.abs(o.distanceY) > 50
            ? (n.fancybox.animate(
                o.instance.current.$slide,
                { top: o.sliderStartPos.top + o.distanceY + 150 * o.velocityY, opacity: 0 },
                150
              ),
              (i = o.instance.close(!0, 300)))
            : 'x' == t && o.distanceX > 50 && a > 1
            ? (i = o.instance.previous(o.speedX))
            : 'x' == t && o.distanceX < -50 && a > 1 && (i = o.instance.next(o.speedX)),
          i !== !1 ||
            ('x' != t && 'y' != t) ||
            (e || a < 2 ? o.instance.centerSlide(o.instance.current, 150) : o.instance.jumpTo(o.instance.current.index)),
          o.$container.removeClass('fancybox-is-sliding');
      }),
      (u.prototype.endPanning = function () {
        var t,
          e,
          o,
          i = this;
        i.contentLastPos &&
          (i.opts.momentum === !1
            ? ((t = i.contentLastPos.left), (e = i.contentLastPos.top))
            : ((t = i.contentLastPos.left + i.velocityX * i.speed), (e = i.contentLastPos.top + i.velocityY * i.speed)),
          (o = i.limitPosition(t, e, i.contentStartPos.width, i.contentStartPos.height)),
          (o.width = i.contentStartPos.width),
          (o.height = i.contentStartPos.height),
          n.fancybox.animate(i.$content, o, 330));
      }),
      (u.prototype.endZooming = function () {
        var t,
          e,
          o,
          i,
          a = this,
          s = a.instance.current,
          r = a.newWidth,
          c = a.newHeight;
        a.contentLastPos &&
          ((t = a.contentLastPos.left),
          (e = a.contentLastPos.top),
          (i = { top: e, left: t, width: r, height: c, scaleX: 1, scaleY: 1 }),
          n.fancybox.setTranslate(a.$content, i),
          r < a.canvasWidth && c < a.canvasHeight
            ? a.instance.scaleToFit(150)
            : r > s.width || c > s.height
            ? a.instance.scaleToActual(a.centerPointStartX, a.centerPointStartY, 150)
            : ((o = a.limitPosition(t, e, r, c)),
              n.fancybox.setTranslate(a.content, n.fancybox.getTranslate(a.$content)),
              n.fancybox.animate(a.$content, o, 150)));
      }),
      (u.prototype.onTap = function (t) {
        var e,
          o = this,
          i = n(t.target),
          s = o.instance,
          r = s.current,
          c = (t && a(t)) || o.startPoints,
          l = c[0] ? c[0].x - o.$stage.offset().left : 0,
          u = c[0] ? c[0].y - o.$stage.offset().top : 0,
          d = function (e) {
            var i = r.opts[e];
            if ((n.isFunction(i) && (i = i.apply(s, [r, t])), i))
              switch (i) {
                case 'close':
                  s.close(o.startEvent);
                  break;
                case 'toggleControls':
                  s.toggleControls(!0);
                  break;
                case 'next':
                  s.next();
                  break;
                case 'nextOrClose':
                  s.group.length > 1 ? s.next() : s.close(o.startEvent);
                  break;
                case 'zoom':
                  'image' == r.type &&
                    (r.isLoaded || r.$ghost) &&
                    (s.canPan() ? s.scaleToFit() : s.isScaledDown() ? s.scaleToActual(l, u) : s.group.length < 2 && s.close(o.startEvent));
              }
          };
        if ((!t.originalEvent || 2 != t.originalEvent.button) && (i.is('img') || !(l > i[0].clientWidth + i.offset().left))) {
          if (i.is('.fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container')) e = 'Outside';
          else if (i.is('.fancybox-slide')) e = 'Slide';
          else {
            if (!s.current.$content || !s.current.$content.find(i).addBack().filter(i).length) return;
            e = 'Content';
          }
          if (o.tapped) {
            if ((clearTimeout(o.tapped), (o.tapped = null), Math.abs(l - o.tapX) > 50 || Math.abs(u - o.tapY) > 50)) return this;
            d('dblclick' + e);
          } else
            (o.tapX = l),
              (o.tapY = u),
              r.opts['dblclick' + e] && r.opts['dblclick' + e] !== r.opts['click' + e]
                ? (o.tapped = setTimeout(function () {
                    (o.tapped = null), d('click' + e);
                  }, 500))
                : d('click' + e);
          return this;
        }
      }),
      n(e).on('onActivate.fb', function (t, e) {
        e && !e.Guestures && (e.Guestures = new u(e));
      });
  })(window, document, window.jQuery || jQuery),
  (function (t, e) {
    'use strict';
    e.extend(!0, e.fancybox.defaults, {
      btnTpl: {
        slideShow:
          '<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}"><svg viewBox="0 0 40 40"><path d="M13,12 L27,20 L13,27 Z" /><path d="M15,10 v19 M23,10 v19" /></svg></button>',
      },
      slideShow: { autoStart: !1, speed: 3e3 },
    });
    var n = function (t) {
      (this.instance = t), this.init();
    };
    e.extend(n.prototype, {
      timer: null,
      isActive: !1,
      $button: null,
      init: function () {
        var t = this;
        (t.$button = t.instance.$refs.toolbar.find('[data-fancybox-play]').on('click', function () {
          t.toggle();
        })),
          (t.instance.group.length < 2 || !t.instance.group[t.instance.currIndex].opts.slideShow) && t.$button.hide();
      },
      set: function (t) {
        var e = this;
        e.instance && e.instance.current && (t === !0 || e.instance.current.opts.loop || e.instance.currIndex < e.instance.group.length - 1)
          ? (e.timer = setTimeout(function () {
              e.isActive && e.instance.jumpTo((e.instance.currIndex + 1) % e.instance.group.length);
            }, e.instance.current.opts.slideShow.speed))
          : (e.stop(), (e.instance.idleSecondsCounter = 0), e.instance.showControls());
      },
      clear: function () {
        var t = this;
        clearTimeout(t.timer), (t.timer = null);
      },
      start: function () {
        var t = this,
          e = t.instance.current;
        e &&
          ((t.isActive = !0),
          t.$button
            .attr('title', e.opts.i18n[e.opts.lang].PLAY_STOP)
            .removeClass('fancybox-button--play')
            .addClass('fancybox-button--pause'),
          t.set(!0));
      },
      stop: function () {
        var t = this,
          e = t.instance.current;
        t.clear(),
          t.$button
            .attr('title', e.opts.i18n[e.opts.lang].PLAY_START)
            .removeClass('fancybox-button--pause')
            .addClass('fancybox-button--play'),
          (t.isActive = !1);
      },
      toggle: function () {
        var t = this;
        t.isActive ? t.stop() : t.start();
      },
    }),
      e(t).on({
        'onInit.fb': function (t, e) {
          e && !e.SlideShow && (e.SlideShow = new n(e));
        },
        'beforeShow.fb': function (t, e, n, o) {
          var i = e && e.SlideShow;
          o ? i && n.opts.slideShow.autoStart && i.start() : i && i.isActive && i.clear();
        },
        'afterShow.fb': function (t, e, n) {
          var o = e && e.SlideShow;
          o && o.isActive && o.set();
        },
        'afterKeydown.fb': function (n, o, i, a, s) {
          var r = o && o.SlideShow;
          !r || !i.opts.slideShow || (80 !== s && 32 !== s) || e(t.activeElement).is('button,a,input') || (a.preventDefault(), r.toggle());
        },
        'beforeClose.fb onDeactivate.fb': function (t, e) {
          var n = e && e.SlideShow;
          n && n.stop();
        },
      }),
      e(t).on('visibilitychange', function () {
        var n = e.fancybox.getInstance(),
          o = n && n.SlideShow;
        o && o.isActive && (t.hidden ? o.clear() : o.set());
      });
  })(document, window.jQuery || jQuery),
  (function (t, e) {
    'use strict';
    var n = (function () {
      var e,
        n,
        o,
        i = [
          ['requestFullscreen', 'exitFullscreen', 'fullscreenElement', 'fullscreenEnabled', 'fullscreenchange', 'fullscreenerror'],
          [
            'webkitRequestFullscreen',
            'webkitExitFullscreen',
            'webkitFullscreenElement',
            'webkitFullscreenEnabled',
            'webkitfullscreenchange',
            'webkitfullscreenerror',
          ],
          [
            'webkitRequestFullScreen',
            'webkitCancelFullScreen',
            'webkitCurrentFullScreenElement',
            'webkitCancelFullScreen',
            'webkitfullscreenchange',
            'webkitfullscreenerror',
          ],
          [
            'mozRequestFullScreen',
            'mozCancelFullScreen',
            'mozFullScreenElement',
            'mozFullScreenEnabled',
            'mozfullscreenchange',
            'mozfullscreenerror',
          ],
          [
            'msRequestFullscreen',
            'msExitFullscreen',
            'msFullscreenElement',
            'msFullscreenEnabled',
            'MSFullscreenChange',
            'MSFullscreenError',
          ],
        ],
        a = {};
      for (n = 0; n < i.length; n++)
        if (((e = i[n]), e && e[1] in t)) {
          for (o = 0; o < e.length; o++) a[i[0][o]] = e[o];
          return a;
        }
      return !1;
    })();
    if (!n) return void (e && e.fancybox && (e.fancybox.defaults.btnTpl.fullScreen = !1));
    var o = {
      request: function (e) {
        (e = e || t.documentElement), e[n.requestFullscreen](e.ALLOW_KEYBOARD_INPUT);
      },
      exit: function () {
        t[n.exitFullscreen]();
      },
      toggle: function (e) {
        (e = e || t.documentElement), this.isFullscreen() ? this.exit() : this.request(e);
      },
      isFullscreen: function () {
        return Boolean(t[n.fullscreenElement]);
      },
      enabled: function () {
        return Boolean(t[n.fullscreenEnabled]);
      },
    };
    e.extend(!0, e.fancybox.defaults, {
      btnTpl: {
        fullScreen:
          '<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fullscreen" title="{{FULL_SCREEN}}"><svg viewBox="0 0 40 40"><path d="M9,12 h22 v16 h-22 v-16 v16 h22 v-16 Z" /></svg></button>',
      },
      fullScreen: { autoStart: !1 },
    }),
      e(t).on({
        'onInit.fb': function (t, e) {
          var n;
          e && e.group[e.currIndex].opts.fullScreen
            ? ((n = e.$refs.container),
              n.on('click.fb-fullscreen', '[data-fancybox-fullscreen]', function (t) {
                t.stopPropagation(), t.preventDefault(), o.toggle(n[0]);
              }),
              e.opts.fullScreen && e.opts.fullScreen.autoStart === !0 && o.request(n[0]),
              (e.FullScreen = o))
            : e && e.$refs.toolbar.find('[data-fancybox-fullscreen]').hide();
        },
        'afterKeydown.fb': function (t, e, n, o, i) {
          e && e.FullScreen && 70 === i && (o.preventDefault(), e.FullScreen.toggle(e.$refs.container[0]));
        },
        'beforeClose.fb': function (t) {
          t && t.FullScreen && o.exit();
        },
      }),
      e(t).on(n.fullscreenchange, function () {
        var t = o.isFullscreen(),
          n = e.fancybox.getInstance();
        n &&
          (n.current &&
            'image' === n.current.type &&
            n.isAnimating &&
            (n.current.$content.css('transition', 'none'), (n.isAnimating = !1), n.update(!0, !0, 0)),
          n.trigger('onFullscreenChange', t),
          n.$refs.container.toggleClass('fancybox-is-fullscreen', t));
      });
  })(document, window.jQuery || jQuery),
  (function (t, e) {
    'use strict';
    e.fancybox.defaults = e.extend(
      !0,
      {
        btnTpl: {
          thumbs:
            '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}"><svg viewBox="0 0 120 120"><path d="M30,30 h14 v14 h-14 Z M50,30 h14 v14 h-14 Z M70,30 h14 v14 h-14 Z M30,50 h14 v14 h-14 Z M50,50 h14 v14 h-14 Z M70,50 h14 v14 h-14 Z M30,70 h14 v14 h-14 Z M50,70 h14 v14 h-14 Z M70,70 h14 v14 h-14 Z" /></svg></button>',
        },
        thumbs: { autoStart: !1, hideOnClose: !0, parentEl: '.fancybox-container', axis: 'y' },
      },
      e.fancybox.defaults
    );
    var n = function (t) {
      this.init(t);
    };
    e.extend(n.prototype, {
      $button: null,
      $grid: null,
      $list: null,
      isVisible: !1,
      isActive: !1,
      init: function (t) {
        var e = this;
        (e.instance = t), (t.Thumbs = e);
        var n = t.group[0],
          o = t.group[1];
        (e.opts = t.group[t.currIndex].opts.thumbs),
          (e.$button = t.$refs.toolbar.find('[data-fancybox-thumbs]')),
          e.opts && n && o && ('image' == n.type || n.opts.thumb || n.opts.$thumb) && ('image' == o.type || o.opts.thumb || o.opts.$thumb)
            ? (e.$button.show().on('click', function () {
                e.toggle();
              }),
              (e.isActive = !0))
            : e.$button.hide();
      },
      create: function () {
        var t,
          n,
          o = this,
          i = o.instance,
          a = o.opts.parentEl;
        (o.$grid = e('<div class="fancybox-thumbs fancybox-thumbs-' + o.opts.axis + '"></div>').appendTo(
          i.$refs.container.find(a).addBack().filter(a)
        )),
          (t = '<ul>'),
          e.each(i.group, function (e, o) {
            (n = o.opts.thumb || (o.opts.$thumb ? o.opts.$thumb.attr('src') : null)),
              n || 'image' !== o.type || (n = o.src),
              n &&
                n.length &&
                (t += '<li data-index="' + e + '"  tabindex="0" class="fancybox-thumbs-loading"><img data-src="' + n + '" /></li>');
          }),
          (t += '</ul>'),
          (o.$list = e(t)
            .appendTo(o.$grid)
            .on('click', 'li', function () {
              i.jumpTo(e(this).data('index'));
            })),
          o.$list
            .find('img')
            .hide()
            .one('load', function () {
              var t,
                n,
                o,
                i,
                a = e(this).parent().removeClass('fancybox-thumbs-loading'),
                s = a.outerWidth(),
                r = a.outerHeight();
              (t = this.naturalWidth || this.width),
                (n = this.naturalHeight || this.height),
                (o = t / s),
                (i = n / r),
                o >= 1 && i >= 1 && (o > i ? ((t /= i), (n = r)) : ((t = s), (n /= o))),
                e(this)
                  .css({
                    width: Math.floor(t),
                    height: Math.floor(n),
                    'margin-top': n > r ? Math.floor(0.3 * r - 0.3 * n) : Math.floor(0.5 * r - 0.5 * n),
                    'margin-left': Math.floor(0.5 * s - 0.5 * t),
                  })
                  .show();
            })
            .each(function () {
              this.src = e(this).data('src');
            }),
          'x' === o.opts.axis &&
            o.$list.width(parseInt(o.$grid.css('padding-right')) + i.group.length * o.$list.children().eq(0).outerWidth(!0) + 'px');
      },
      focus: function (t) {
        var e,
          n,
          o = this,
          i = o.$list;
        o.instance.current &&
          ((e = i
            .children()
            .removeClass('fancybox-thumbs-active')
            .filter('[data-index="' + o.instance.current.index + '"]')
            .addClass('fancybox-thumbs-active')),
          (n = e.position()),
          'y' === o.opts.axis && (n.top < 0 || n.top > i.height() - e.outerHeight())
            ? i.stop().animate({ scrollTop: i.scrollTop() + n.top }, t)
            : 'x' === o.opts.axis &&
              (n.left < i.parent().scrollLeft() || n.left > i.parent().scrollLeft() + (i.parent().width() - e.outerWidth())) &&
              i.parent().stop().animate({ scrollLeft: n.left }, t));
      },
      update: function () {
        this.instance.$refs.container.toggleClass('fancybox-show-thumbs', this.isVisible),
          this.isVisible
            ? (this.$grid || this.create(), this.instance.trigger('onThumbsShow'), this.focus(0))
            : this.$grid && this.instance.trigger('onThumbsHide'),
          this.instance.update();
      },
      hide: function () {
        (this.isVisible = !1), this.update();
      },
      show: function () {
        (this.isVisible = !0), this.update();
      },
      toggle: function () {
        (this.isVisible = !this.isVisible), this.update();
      },
    }),
      e(t).on({
        'onInit.fb': function (t, e) {
          var o;
          e && !e.Thumbs && ((o = new n(e)), o.isActive && o.opts.autoStart === !0 && o.show());
        },
        'beforeShow.fb': function (t, e, n, o) {
          var i = e && e.Thumbs;
          i && i.isVisible && i.focus(o ? 0 : 250);
        },
        'afterKeydown.fb': function (t, e, n, o, i) {
          var a = e && e.Thumbs;
          a && a.isActive && 71 === i && (o.preventDefault(), a.toggle());
        },
        'beforeClose.fb': function (t, e) {
          var n = e && e.Thumbs;
          n && n.isVisible && n.opts.hideOnClose !== !1 && n.$grid.hide();
        },
      });
  })(document, window.jQuery),
  (function (t, e) {
    'use strict';
    function n(t) {
      var e = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;' };
      return String(t).replace(/[&<>"'`=\/]/g, function (t) {
        return e[t];
      });
    }
    e.extend(!0, e.fancybox.defaults, {
      btnTpl: {
        share:
          '<button data-fancybox-share class="fancybox-button fancybox-button--share" title="{{SHARE}}"><svg viewBox="0 0 40 40"><path d="M6,30 C8,18 19,16 23,16 L23,16 L23,10 L33,20 L23,29 L23,24 C19,24 8,27 6,30 Z"></svg></button>',
      },
      share: {
        tpl: '<div class="fancybox-share"><h1>{{SHARE}}</h1><p class="fancybox-share__links"><a class="fancybox-share__button fancybox-share__button--fb" href="https://www.facebook.com/sharer/sharer.php?u={{url}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" /></svg><span>Facebook</span></a><a class="fancybox-share__button fancybox-share__button--pt" href="https://www.pinterest.com/pin/create/button/?url={{url}}&description={{descr}}&media={{media}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m265 56c-109 0-164 78-164 144 0 39 15 74 47 87 5 2 10 0 12-5l4-19c2-6 1-8-3-13-9-11-15-25-15-45 0-58 43-110 113-110 62 0 96 38 96 88 0 67-30 122-73 122-24 0-42-19-36-44 6-29 20-60 20-81 0-19-10-35-31-35-25 0-44 26-44 60 0 21 7 36 7 36l-30 125c-8 37-1 83 0 87 0 3 4 4 5 2 2-3 32-39 42-75l16-64c8 16 31 29 56 29 74 0 124-67 124-157 0-69-58-132-146-132z" fill="#fff"/></svg><span>Pinterest</span></a><a class="fancybox-share__button fancybox-share__button--tw" href="https://twitter.com/intent/tweet?url={{url}}&text={{descr}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" /></svg><span>Twitter</span></a></p><p><input class="fancybox-share__input" type="text" value="{{url_raw}}" /></p></div>',
      },
    }),
      e(t).on('click', '[data-fancybox-share]', function () {
        var t,
          o,
          i = e.fancybox.getInstance();
        i &&
          ((t = i.current.opts.hash === !1 ? i.current.src : window.location),
          (o = i.current.opts.share.tpl
            .replace(/\{\{media\}\}/g, 'image' === i.current.type ? encodeURIComponent(i.current.src) : '')
            .replace(/\{\{url\}\}/g, encodeURIComponent(t))
            .replace(/\{\{url_raw\}\}/g, n(t))
            .replace(/\{\{descr\}\}/g, i.$caption ? encodeURIComponent(i.$caption.text()) : '')),
          e.fancybox.open({
            src: i.translate(i, o),
            type: 'html',
            opts: {
              animationEffect: 'fade',
              animationDuration: 250,
              afterLoad: function (t, e) {
                e.$content.find('.fancybox-share__links a').click(function () {
                  return window.open(this.href, 'Share', 'width=550, height=450'), !1;
                });
              },
            },
          }));
      });
  })(document, window.jQuery || jQuery),
  (function (t, e, n) {
    'use strict';
    function o() {
      var t = e.location.hash.substr(1),
        n = t.split('-'),
        o = n.length > 1 && /^\+?\d+$/.test(n[n.length - 1]) ? parseInt(n.pop(-1), 10) || 1 : 1,
        i = n.join('-');
      return o < 1 && (o = 1), { hash: t, index: o, gallery: i };
    }
    function i(t) {
      var e;
      '' !== t.gallery &&
        ((e = n("[data-fancybox='" + n.escapeSelector(t.gallery) + "']").eq(t.index - 1)),
        e.length || (e = n('#' + n.escapeSelector(t.gallery))),
        e.length && ((s = !1), e.trigger('click')));
    }
    function a(t) {
      var e;
      return !!t && ((e = t.current ? t.current.opts : t.opts), e.hash || (e.$orig ? e.$orig.data('fancybox') : ''));
    }
    n.escapeSelector ||
      (n.escapeSelector = function (t) {
        var e = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,
          n = function (t, e) {
            return e ? ('\0' === t ? '�' : t.slice(0, -1) + '\\' + t.charCodeAt(t.length - 1).toString(16) + ' ') : '\\' + t;
          };
        return (t + '').replace(e, n);
      });
    var s = !0,
      r = null,
      c = null;
    n(function () {
      n.fancybox.defaults.hash !== !1 &&
        (n(t).on({
          'onInit.fb': function (t, e) {
            var n, i;
            e.group[e.currIndex].opts.hash !== !1 &&
              ((n = o()), (i = a(e)), i && n.gallery && i == n.gallery && (e.currIndex = n.index - 1));
          },
          'beforeShow.fb': function (n, o, i) {
            var l;
            i &&
              i.opts.hash !== !1 &&
              ((l = a(o)),
              l &&
                '' !== l &&
                (e.location.hash.indexOf(l) < 0 && (o.opts.origHash = e.location.hash),
                (r = l + (o.group.length > 1 ? '-' + (i.index + 1) : '')),
                'replaceState' in e.history
                  ? (c && clearTimeout(c),
                    (c = setTimeout(function () {
                      e.history[s ? 'pushState' : 'replaceState']({}, t.title, e.location.pathname + e.location.search + '#' + r),
                        (c = null),
                        (s = !1);
                    }, 300)))
                  : (e.location.hash = r)));
          },
          'beforeClose.fb': function (o, i, s) {
            var l, u;
            c && clearTimeout(c),
              s.opts.hash !== !1 &&
                ((l = a(i)),
                (u = i && i.opts.origHash ? i.opts.origHash : ''),
                l &&
                  '' !== l &&
                  ('replaceState' in history
                    ? e.history.replaceState({}, t.title, e.location.pathname + e.location.search + u)
                    : ((e.location.hash = u), n(e).scrollTop(i.scrollTop).scrollLeft(i.scrollLeft))),
                (r = null));
          },
        }),
        n(e).on('hashchange.fb', function () {
          var t = o();
          n.fancybox.getInstance()
            ? !r || r === t.gallery + '-' + t.index || (1 === t.index && r == t.gallery) || ((r = null), n.fancybox.close())
            : '' !== t.gallery && i(t);
        }),
        setTimeout(function () {
          i(o());
        }, 50));
    });
  })(document, window, window.jQuery || jQuery),
  (function (t, e) {
    'use strict';
    var n = new Date().getTime();
    e(t).on({
      'onInit.fb': function (t, e, o) {
        e.$refs.stage.on('mousewheel DOMMouseScroll wheel MozMousePixelScroll', function (t) {
          var o = e.current,
            i = new Date().getTime();
          e.group.length < 1 ||
            o.opts.wheel === !1 ||
            ('auto' === o.opts.wheel && 'image' !== o.type) ||
            (t.preventDefault(),
            t.stopPropagation(),
            o.$slide.hasClass('fancybox-animated') ||
              ((t = t.originalEvent || t),
              i - n < 250 || ((n = i), e[(-t.deltaY || -t.deltaX || t.wheelDelta || -t.detail) < 0 ? 'next' : 'previous']())));
        });
      },
    });
  })(document, window.jQuery || jQuery);

/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.6.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
!(function (a) {
  'use strict';
  'function' == typeof define && define.amd
    ? define(['jquery'], a)
    : 'undefined' != typeof exports
    ? (module.exports = a(require('jquery')))
    : a(jQuery);
})(function (a) {
  'use strict';
  var b = window.Slick || {};
  (b = (function () {
    function c(c, d) {
      var f,
        e = this;
      (e.defaults = {
        accessibility: !0,
        adaptiveHeight: !1,
        appendArrows: a(c),
        appendDots: a(c),
        arrows: !0,
        asNavFor: null,
        prevArrow:
          '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
        nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
        autoplay: !1,
        autoplaySpeed: 3e3,
        centerMode: !1,
        centerPadding: '50px',
        cssEase: 'ease',
        customPaging: function (b, c) {
          return a('<button type="button" data-role="none" role="button" tabindex="0" />').text(c + 1);
        },
        dots: !1,
        dotsClass: 'slick-dots',
        draggable: !0,
        easing: 'linear',
        edgeFriction: 0.35,
        fade: !1,
        focusOnSelect: !1,
        infinite: !0,
        initialSlide: 0,
        lazyLoad: 'ondemand',
        mobileFirst: !1,
        pauseOnHover: !0,
        pauseOnFocus: !0,
        pauseOnDotsHover: !1,
        respondTo: 'window',
        responsive: null,
        rows: 1,
        rtl: !1,
        slide: '',
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        swipe: !0,
        swipeToSlide: !1,
        touchMove: !0,
        touchThreshold: 5,
        useCSS: !0,
        useTransform: !0,
        variableWidth: !1,
        vertical: !1,
        verticalSwiping: !1,
        waitForAnimate: !0,
        zIndex: 1e3,
      }),
        (e.initials = {
          animating: !1,
          dragging: !1,
          autoPlayTimer: null,
          currentDirection: 0,
          currentLeft: null,
          currentSlide: 0,
          direction: 1,
          $dots: null,
          listWidth: null,
          listHeight: null,
          loadIndex: 0,
          $nextArrow: null,
          $prevArrow: null,
          slideCount: null,
          slideWidth: null,
          $slideTrack: null,
          $slides: null,
          sliding: !1,
          slideOffset: 0,
          swipeLeft: null,
          $list: null,
          touchObject: {},
          transformsEnabled: !1,
          unslicked: !1,
        }),
        a.extend(e, e.initials),
        (e.activeBreakpoint = null),
        (e.animType = null),
        (e.animProp = null),
        (e.breakpoints = []),
        (e.breakpointSettings = []),
        (e.cssTransitions = !1),
        (e.focussed = !1),
        (e.interrupted = !1),
        (e.hidden = 'hidden'),
        (e.paused = !0),
        (e.positionProp = null),
        (e.respondTo = null),
        (e.rowCount = 1),
        (e.shouldClick = !0),
        (e.$slider = a(c)),
        (e.$slidesCache = null),
        (e.transformType = null),
        (e.transitionType = null),
        (e.visibilityChange = 'visibilitychange'),
        (e.windowWidth = 0),
        (e.windowTimer = null),
        (f = a(c).data('slick') || {}),
        (e.options = a.extend({}, e.defaults, d, f)),
        (e.currentSlide = e.options.initialSlide),
        (e.originalSettings = e.options),
        'undefined' != typeof document.mozHidden
          ? ((e.hidden = 'mozHidden'), (e.visibilityChange = 'mozvisibilitychange'))
          : 'undefined' != typeof document.webkitHidden && ((e.hidden = 'webkitHidden'), (e.visibilityChange = 'webkitvisibilitychange')),
        (e.autoPlay = a.proxy(e.autoPlay, e)),
        (e.autoPlayClear = a.proxy(e.autoPlayClear, e)),
        (e.autoPlayIterator = a.proxy(e.autoPlayIterator, e)),
        (e.changeSlide = a.proxy(e.changeSlide, e)),
        (e.clickHandler = a.proxy(e.clickHandler, e)),
        (e.selectHandler = a.proxy(e.selectHandler, e)),
        (e.setPosition = a.proxy(e.setPosition, e)),
        (e.swipeHandler = a.proxy(e.swipeHandler, e)),
        (e.dragHandler = a.proxy(e.dragHandler, e)),
        (e.keyHandler = a.proxy(e.keyHandler, e)),
        (e.instanceUid = b++),
        (e.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/),
        e.registerBreakpoints(),
        e.init(!0);
    }
    var b = 0;
    return c;
  })()),
    (b.prototype.activateADA = function () {
      var a = this;
      a.$slideTrack.find('.slick-active').attr({ 'aria-hidden': 'false' }).find('a, input, button, select').attr({ tabindex: '0' });
    }),
    (b.prototype.addSlide = b.prototype.slickAdd =
      function (b, c, d) {
        var e = this;
        if ('boolean' == typeof c) (d = c), (c = null);
        else if (0 > c || c >= e.slideCount) return !1;
        e.unload(),
          'number' == typeof c
            ? 0 === c && 0 === e.$slides.length
              ? a(b).appendTo(e.$slideTrack)
              : d
              ? a(b).insertBefore(e.$slides.eq(c))
              : a(b).insertAfter(e.$slides.eq(c))
            : d === !0
            ? a(b).prependTo(e.$slideTrack)
            : a(b).appendTo(e.$slideTrack),
          (e.$slides = e.$slideTrack.children(this.options.slide)),
          e.$slideTrack.children(this.options.slide).detach(),
          e.$slideTrack.append(e.$slides),
          e.$slides.each(function (b, c) {
            a(c).attr('data-slick-index', b);
          }),
          (e.$slidesCache = e.$slides),
          e.reinit();
      }),
    (b.prototype.animateHeight = function () {
      var a = this;
      if (1 === a.options.slidesToShow && a.options.adaptiveHeight === !0 && a.options.vertical === !1) {
        var b = a.$slides.eq(a.currentSlide).outerHeight(!0);
        a.$list.animate({ height: b }, a.options.speed);
      }
    }),
    (b.prototype.animateSlide = function (b, c) {
      var d = {},
        e = this;
      e.animateHeight(),
        e.options.rtl === !0 && e.options.vertical === !1 && (b = -b),
        e.transformsEnabled === !1
          ? e.options.vertical === !1
            ? e.$slideTrack.animate({ left: b }, e.options.speed, e.options.easing, c)
            : e.$slideTrack.animate({ top: b }, e.options.speed, e.options.easing, c)
          : e.cssTransitions === !1
          ? (e.options.rtl === !0 && (e.currentLeft = -e.currentLeft),
            a({ animStart: e.currentLeft }).animate(
              { animStart: b },
              {
                duration: e.options.speed,
                easing: e.options.easing,
                step: function (a) {
                  (a = Math.ceil(a)),
                    e.options.vertical === !1
                      ? ((d[e.animType] = 'translate(' + a + 'px, 0px)'), e.$slideTrack.css(d))
                      : ((d[e.animType] = 'translate(0px,' + a + 'px)'), e.$slideTrack.css(d));
                },
                complete: function () {
                  c && c.call();
                },
              }
            ))
          : (e.applyTransition(),
            (b = Math.ceil(b)),
            e.options.vertical === !1
              ? (d[e.animType] = 'translate3d(' + b + 'px, 0px, 0px)')
              : (d[e.animType] = 'translate3d(0px,' + b + 'px, 0px)'),
            e.$slideTrack.css(d),
            c &&
              setTimeout(function () {
                e.disableTransition(), c.call();
              }, e.options.speed));
    }),
    (b.prototype.getNavTarget = function () {
      var b = this,
        c = b.options.asNavFor;
      return c && null !== c && (c = a(c).not(b.$slider)), c;
    }),
    (b.prototype.asNavFor = function (b) {
      var c = this,
        d = c.getNavTarget();
      null !== d &&
        'object' == typeof d &&
        d.each(function () {
          var c = a(this).slick('getSlick');
          c.unslicked || c.slideHandler(b, !0);
        });
    }),
    (b.prototype.applyTransition = function (a) {
      var b = this,
        c = {};
      b.options.fade === !1
        ? (c[b.transitionType] = b.transformType + ' ' + b.options.speed + 'ms ' + b.options.cssEase)
        : (c[b.transitionType] = 'opacity ' + b.options.speed + 'ms ' + b.options.cssEase),
        b.options.fade === !1 ? b.$slideTrack.css(c) : b.$slides.eq(a).css(c);
    }),
    (b.prototype.autoPlay = function () {
      var a = this;
      a.autoPlayClear(),
        a.slideCount > a.options.slidesToShow && (a.autoPlayTimer = setInterval(a.autoPlayIterator, a.options.autoplaySpeed));
    }),
    (b.prototype.autoPlayClear = function () {
      var a = this;
      a.autoPlayTimer && clearInterval(a.autoPlayTimer);
    }),
    (b.prototype.autoPlayIterator = function () {
      var a = this,
        b = a.currentSlide + a.options.slidesToScroll;
      a.paused ||
        a.interrupted ||
        a.focussed ||
        (a.options.infinite === !1 &&
          (1 === a.direction && a.currentSlide + 1 === a.slideCount - 1
            ? (a.direction = 0)
            : 0 === a.direction && ((b = a.currentSlide - a.options.slidesToScroll), a.currentSlide - 1 === 0 && (a.direction = 1))),
        a.slideHandler(b));
    }),
    (b.prototype.buildArrows = function () {
      var b = this;
      b.options.arrows === !0 &&
        ((b.$prevArrow = a(b.options.prevArrow).addClass('slick-arrow')),
        (b.$nextArrow = a(b.options.nextArrow).addClass('slick-arrow')),
        b.slideCount > b.options.slidesToShow
          ? (b.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex'),
            b.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex'),
            b.htmlExpr.test(b.options.prevArrow) && b.$prevArrow.prependTo(b.options.appendArrows),
            b.htmlExpr.test(b.options.nextArrow) && b.$nextArrow.appendTo(b.options.appendArrows),
            b.options.infinite !== !0 && b.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true'))
          : b.$prevArrow.add(b.$nextArrow).addClass('slick-hidden').attr({ 'aria-disabled': 'true', tabindex: '-1' }));
    }),
    (b.prototype.buildDots = function () {
      var c,
        d,
        b = this;
      if (b.options.dots === !0 && b.slideCount > b.options.slidesToShow) {
        for (b.$slider.addClass('slick-dotted'), d = a('<ul />').addClass(b.options.dotsClass), c = 0; c <= b.getDotCount(); c += 1)
          d.append(a('<li />').append(b.options.customPaging.call(this, b, c)));
        (b.$dots = d.appendTo(b.options.appendDots)), b.$dots.find('li').first().addClass('slick-active').attr('aria-hidden', 'false');
      }
    }),
    (b.prototype.buildOut = function () {
      var b = this;
      (b.$slides = b.$slider.children(b.options.slide + ':not(.slick-cloned)').addClass('slick-slide')),
        (b.slideCount = b.$slides.length),
        b.$slides.each(function (b, c) {
          a(c)
            .attr('data-slick-index', b)
            .data('originalStyling', a(c).attr('style') || '');
        }),
        b.$slider.addClass('slick-slider'),
        (b.$slideTrack =
          0 === b.slideCount
            ? a('<div class="slick-track"/>').appendTo(b.$slider)
            : b.$slides.wrapAll('<div class="slick-track"/>').parent()),
        (b.$list = b.$slideTrack.wrap('<div aria-live="polite" class="slick-list"/>').parent()),
        b.$slideTrack.css('opacity', 0),
        (b.options.centerMode === !0 || b.options.swipeToSlide === !0) && (b.options.slidesToScroll = 1),
        a('img[data-lazy]', b.$slider).not('[src]').addClass('slick-loading'),
        b.setupInfinite(),
        b.buildArrows(),
        b.buildDots(),
        b.updateDots(),
        b.setSlideClasses('number' == typeof b.currentSlide ? b.currentSlide : 0),
        b.options.draggable === !0 && b.$list.addClass('draggable');
    }),
    (b.prototype.buildRows = function () {
      var b,
        c,
        d,
        e,
        f,
        g,
        h,
        a = this;
      if (((e = document.createDocumentFragment()), (g = a.$slider.children()), a.options.rows > 1)) {
        for (h = a.options.slidesPerRow * a.options.rows, f = Math.ceil(g.length / h), b = 0; f > b; b++) {
          var i = document.createElement('div');
          for (c = 0; c < a.options.rows; c++) {
            var j = document.createElement('div');
            for (d = 0; d < a.options.slidesPerRow; d++) {
              var k = b * h + (c * a.options.slidesPerRow + d);
              g.get(k) && j.appendChild(g.get(k));
            }
            i.appendChild(j);
          }
          e.appendChild(i);
        }
        a.$slider.empty().append(e),
          a.$slider
            .children()
            .children()
            .children()
            .css({ width: 100 / a.options.slidesPerRow + '%', display: 'inline-block' });
      }
    }),
    (b.prototype.checkResponsive = function (b, c) {
      var e,
        f,
        g,
        d = this,
        h = !1,
        i = d.$slider.width(),
        j = window.innerWidth || a(window).width();
      if (
        ('window' === d.respondTo ? (g = j) : 'slider' === d.respondTo ? (g = i) : 'min' === d.respondTo && (g = Math.min(j, i)),
        d.options.responsive && d.options.responsive.length && null !== d.options.responsive)
      ) {
        f = null;
        for (e in d.breakpoints)
          d.breakpoints.hasOwnProperty(e) &&
            (d.originalSettings.mobileFirst === !1
              ? g < d.breakpoints[e] && (f = d.breakpoints[e])
              : g > d.breakpoints[e] && (f = d.breakpoints[e]));
        null !== f
          ? null !== d.activeBreakpoint
            ? (f !== d.activeBreakpoint || c) &&
              ((d.activeBreakpoint = f),
              'unslick' === d.breakpointSettings[f]
                ? d.unslick(f)
                : ((d.options = a.extend({}, d.originalSettings, d.breakpointSettings[f])),
                  b === !0 && (d.currentSlide = d.options.initialSlide),
                  d.refresh(b)),
              (h = f))
            : ((d.activeBreakpoint = f),
              'unslick' === d.breakpointSettings[f]
                ? d.unslick(f)
                : ((d.options = a.extend({}, d.originalSettings, d.breakpointSettings[f])),
                  b === !0 && (d.currentSlide = d.options.initialSlide),
                  d.refresh(b)),
              (h = f))
          : null !== d.activeBreakpoint &&
            ((d.activeBreakpoint = null),
            (d.options = d.originalSettings),
            b === !0 && (d.currentSlide = d.options.initialSlide),
            d.refresh(b),
            (h = f)),
          b || h === !1 || d.$slider.trigger('breakpoint', [d, h]);
      }
    }),
    (b.prototype.changeSlide = function (b, c) {
      var f,
        g,
        h,
        d = this,
        e = a(b.currentTarget);
      switch (
        (e.is('a') && b.preventDefault(),
        e.is('li') || (e = e.closest('li')),
        (h = d.slideCount % d.options.slidesToScroll !== 0),
        (f = h ? 0 : (d.slideCount - d.currentSlide) % d.options.slidesToScroll),
        b.data.message)
      ) {
        case 'previous':
          (g = 0 === f ? d.options.slidesToScroll : d.options.slidesToShow - f),
            d.slideCount > d.options.slidesToShow && d.slideHandler(d.currentSlide - g, !1, c);
          break;
        case 'next':
          (g = 0 === f ? d.options.slidesToScroll : f), d.slideCount > d.options.slidesToShow && d.slideHandler(d.currentSlide + g, !1, c);
          break;
        case 'index':
          var i = 0 === b.data.index ? 0 : b.data.index || e.index() * d.options.slidesToScroll;
          d.slideHandler(d.checkNavigable(i), !1, c), e.children().trigger('focus');
          break;
        default:
          return;
      }
    }),
    (b.prototype.checkNavigable = function (a) {
      var c,
        d,
        b = this;
      if (((c = b.getNavigableIndexes()), (d = 0), a > c[c.length - 1])) a = c[c.length - 1];
      else
        for (var e in c) {
          if (a < c[e]) {
            a = d;
            break;
          }
          d = c[e];
        }
      return a;
    }),
    (b.prototype.cleanUpEvents = function () {
      var b = this;
      b.options.dots &&
        null !== b.$dots &&
        a('li', b.$dots)
          .off('click.slick', b.changeSlide)
          .off('mouseenter.slick', a.proxy(b.interrupt, b, !0))
          .off('mouseleave.slick', a.proxy(b.interrupt, b, !1)),
        b.$slider.off('focus.slick blur.slick'),
        b.options.arrows === !0 &&
          b.slideCount > b.options.slidesToShow &&
          (b.$prevArrow && b.$prevArrow.off('click.slick', b.changeSlide), b.$nextArrow && b.$nextArrow.off('click.slick', b.changeSlide)),
        b.$list.off('touchstart.slick mousedown.slick', b.swipeHandler),
        b.$list.off('touchmove.slick mousemove.slick', b.swipeHandler),
        b.$list.off('touchend.slick mouseup.slick', b.swipeHandler),
        b.$list.off('touchcancel.slick mouseleave.slick', b.swipeHandler),
        b.$list.off('click.slick', b.clickHandler),
        a(document).off(b.visibilityChange, b.visibility),
        b.cleanUpSlideEvents(),
        b.options.accessibility === !0 && b.$list.off('keydown.slick', b.keyHandler),
        b.options.focusOnSelect === !0 && a(b.$slideTrack).children().off('click.slick', b.selectHandler),
        a(window).off('orientationchange.slick.slick-' + b.instanceUid, b.orientationChange),
        a(window).off('resize.slick.slick-' + b.instanceUid, b.resize),
        a('[draggable!=true]', b.$slideTrack).off('dragstart', b.preventDefault),
        a(window).off('load.slick.slick-' + b.instanceUid, b.setPosition),
        a(document).off('ready.slick.slick-' + b.instanceUid, b.setPosition);
    }),
    (b.prototype.cleanUpSlideEvents = function () {
      var b = this;
      b.$list.off('mouseenter.slick', a.proxy(b.interrupt, b, !0)), b.$list.off('mouseleave.slick', a.proxy(b.interrupt, b, !1));
    }),
    (b.prototype.cleanUpRows = function () {
      var b,
        a = this;
      a.options.rows > 1 && ((b = a.$slides.children().children()), b.removeAttr('style'), a.$slider.empty().append(b));
    }),
    (b.prototype.clickHandler = function (a) {
      var b = this;
      b.shouldClick === !1 && (a.stopImmediatePropagation(), a.stopPropagation(), a.preventDefault());
    }),
    (b.prototype.destroy = function (b) {
      var c = this;
      c.autoPlayClear(),
        (c.touchObject = {}),
        c.cleanUpEvents(),
        a('.slick-cloned', c.$slider).detach(),
        c.$dots && c.$dots.remove(),
        c.$prevArrow &&
          c.$prevArrow.length &&
          (c.$prevArrow
            .removeClass('slick-disabled slick-arrow slick-hidden')
            .removeAttr('aria-hidden aria-disabled tabindex')
            .css('display', ''),
          c.htmlExpr.test(c.options.prevArrow) && c.$prevArrow.remove()),
        c.$nextArrow &&
          c.$nextArrow.length &&
          (c.$nextArrow
            .removeClass('slick-disabled slick-arrow slick-hidden')
            .removeAttr('aria-hidden aria-disabled tabindex')
            .css('display', ''),
          c.htmlExpr.test(c.options.nextArrow) && c.$nextArrow.remove()),
        c.$slides &&
          (c.$slides
            .removeClass('slick-slide slick-active slick-center slick-visible slick-current')
            .removeAttr('aria-hidden')
            .removeAttr('data-slick-index')
            .each(function () {
              a(this).attr('style', a(this).data('originalStyling'));
            }),
          c.$slideTrack.children(this.options.slide).detach(),
          c.$slideTrack.detach(),
          c.$list.detach(),
          c.$slider.append(c.$slides)),
        c.cleanUpRows(),
        c.$slider.removeClass('slick-slider'),
        c.$slider.removeClass('slick-initialized'),
        c.$slider.removeClass('slick-dotted'),
        (c.unslicked = !0),
        b || c.$slider.trigger('destroy', [c]);
    }),
    (b.prototype.disableTransition = function (a) {
      var b = this,
        c = {};
      (c[b.transitionType] = ''), b.options.fade === !1 ? b.$slideTrack.css(c) : b.$slides.eq(a).css(c);
    }),
    (b.prototype.fadeSlide = function (a, b) {
      var c = this;
      c.cssTransitions === !1
        ? (c.$slides.eq(a).css({ zIndex: c.options.zIndex }), c.$slides.eq(a).animate({ opacity: 1 }, c.options.speed, c.options.easing, b))
        : (c.applyTransition(a),
          c.$slides.eq(a).css({ opacity: 1, zIndex: c.options.zIndex }),
          b &&
            setTimeout(function () {
              c.disableTransition(a), b.call();
            }, c.options.speed));
    }),
    (b.prototype.fadeSlideOut = function (a) {
      var b = this;
      b.cssTransitions === !1
        ? b.$slides.eq(a).animate({ opacity: 0, zIndex: b.options.zIndex - 2 }, b.options.speed, b.options.easing)
        : (b.applyTransition(a), b.$slides.eq(a).css({ opacity: 0, zIndex: b.options.zIndex - 2 }));
    }),
    (b.prototype.filterSlides = b.prototype.slickFilter =
      function (a) {
        var b = this;
        null !== a &&
          ((b.$slidesCache = b.$slides),
          b.unload(),
          b.$slideTrack.children(this.options.slide).detach(),
          b.$slidesCache.filter(a).appendTo(b.$slideTrack),
          b.reinit());
      }),
    (b.prototype.focusHandler = function () {
      var b = this;
      b.$slider.off('focus.slick blur.slick').on('focus.slick blur.slick', '*:not(.slick-arrow)', function (c) {
        c.stopImmediatePropagation();
        var d = a(this);
        setTimeout(function () {
          b.options.pauseOnFocus && ((b.focussed = d.is(':focus')), b.autoPlay());
        }, 0);
      });
    }),
    (b.prototype.getCurrent = b.prototype.slickCurrentSlide =
      function () {
        var a = this;
        return a.currentSlide;
      }),
    (b.prototype.getDotCount = function () {
      var a = this,
        b = 0,
        c = 0,
        d = 0;
      if (a.options.infinite === !0)
        for (; b < a.slideCount; )
          ++d,
            (b = c + a.options.slidesToScroll),
            (c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow);
      else if (a.options.centerMode === !0) d = a.slideCount;
      else if (a.options.asNavFor)
        for (; b < a.slideCount; )
          ++d,
            (b = c + a.options.slidesToScroll),
            (c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow);
      else d = 1 + Math.ceil((a.slideCount - a.options.slidesToShow) / a.options.slidesToScroll);
      return d - 1;
    }),
    (b.prototype.getLeft = function (a) {
      var c,
        d,
        f,
        b = this,
        e = 0;
      return (
        (b.slideOffset = 0),
        (d = b.$slides.first().outerHeight(!0)),
        b.options.infinite === !0
          ? (b.slideCount > b.options.slidesToShow &&
              ((b.slideOffset = b.slideWidth * b.options.slidesToShow * -1), (e = d * b.options.slidesToShow * -1)),
            b.slideCount % b.options.slidesToScroll !== 0 &&
              a + b.options.slidesToScroll > b.slideCount &&
              b.slideCount > b.options.slidesToShow &&
              (a > b.slideCount
                ? ((b.slideOffset = (b.options.slidesToShow - (a - b.slideCount)) * b.slideWidth * -1),
                  (e = (b.options.slidesToShow - (a - b.slideCount)) * d * -1))
                : ((b.slideOffset = (b.slideCount % b.options.slidesToScroll) * b.slideWidth * -1),
                  (e = (b.slideCount % b.options.slidesToScroll) * d * -1))))
          : a + b.options.slidesToShow > b.slideCount &&
            ((b.slideOffset = (a + b.options.slidesToShow - b.slideCount) * b.slideWidth),
            (e = (a + b.options.slidesToShow - b.slideCount) * d)),
        b.slideCount <= b.options.slidesToShow && ((b.slideOffset = 0), (e = 0)),
        b.options.centerMode === !0 && b.options.infinite === !0
          ? (b.slideOffset += b.slideWidth * Math.floor(b.options.slidesToShow / 2) - b.slideWidth)
          : b.options.centerMode === !0 && ((b.slideOffset = 0), (b.slideOffset += b.slideWidth * Math.floor(b.options.slidesToShow / 2))),
        (c = b.options.vertical === !1 ? a * b.slideWidth * -1 + b.slideOffset : a * d * -1 + e),
        b.options.variableWidth === !0 &&
          ((f =
            b.slideCount <= b.options.slidesToShow || b.options.infinite === !1
              ? b.$slideTrack.children('.slick-slide').eq(a)
              : b.$slideTrack.children('.slick-slide').eq(a + b.options.slidesToShow)),
          (c =
            b.options.rtl === !0
              ? f[0]
                ? -1 * (b.$slideTrack.width() - f[0].offsetLeft - f.width())
                : 0
              : f[0]
              ? -1 * f[0].offsetLeft
              : 0),
          b.options.centerMode === !0 &&
            ((f =
              b.slideCount <= b.options.slidesToShow || b.options.infinite === !1
                ? b.$slideTrack.children('.slick-slide').eq(a)
                : b.$slideTrack.children('.slick-slide').eq(a + b.options.slidesToShow + 1)),
            (c =
              b.options.rtl === !0
                ? f[0]
                  ? -1 * (b.$slideTrack.width() - f[0].offsetLeft - f.width())
                  : 0
                : f[0]
                ? -1 * f[0].offsetLeft
                : 0),
            (c += (b.$list.width() - f.outerWidth()) / 2))),
        c
      );
    }),
    (b.prototype.getOption = b.prototype.slickGetOption =
      function (a) {
        var b = this;
        return b.options[a];
      }),
    (b.prototype.getNavigableIndexes = function () {
      var e,
        a = this,
        b = 0,
        c = 0,
        d = [];
      for (
        a.options.infinite === !1
          ? (e = a.slideCount)
          : ((b = -1 * a.options.slidesToScroll), (c = -1 * a.options.slidesToScroll), (e = 2 * a.slideCount));
        e > b;

      )
        d.push(b),
          (b = c + a.options.slidesToScroll),
          (c += a.options.slidesToScroll <= a.options.slidesToShow ? a.options.slidesToScroll : a.options.slidesToShow);
      return d;
    }),
    (b.prototype.getSlick = function () {
      return this;
    }),
    (b.prototype.getSlideCount = function () {
      var c,
        d,
        e,
        b = this;
      return (
        (e = b.options.centerMode === !0 ? b.slideWidth * Math.floor(b.options.slidesToShow / 2) : 0),
        b.options.swipeToSlide === !0
          ? (b.$slideTrack.find('.slick-slide').each(function (c, f) {
              return f.offsetLeft - e + a(f).outerWidth() / 2 > -1 * b.swipeLeft ? ((d = f), !1) : void 0;
            }),
            (c = Math.abs(a(d).attr('data-slick-index') - b.currentSlide) || 1))
          : b.options.slidesToScroll
      );
    }),
    (b.prototype.goTo = b.prototype.slickGoTo =
      function (a, b) {
        var c = this;
        c.changeSlide({ data: { message: 'index', index: parseInt(a) } }, b);
      }),
    (b.prototype.init = function (b) {
      var c = this;
      a(c.$slider).hasClass('slick-initialized') ||
        (a(c.$slider).addClass('slick-initialized'),
        c.buildRows(),
        c.buildOut(),
        c.setProps(),
        c.startLoad(),
        c.loadSlider(),
        c.initializeEvents(),
        c.updateArrows(),
        c.updateDots(),
        c.checkResponsive(!0),
        c.focusHandler()),
        b && c.$slider.trigger('init', [c]),
        c.options.accessibility === !0 && c.initADA(),
        c.options.autoplay && ((c.paused = !1), c.autoPlay());
    }),
    (b.prototype.initADA = function () {
      var b = this;
      b.$slides
        .add(b.$slideTrack.find('.slick-cloned'))
        .attr({ 'aria-hidden': 'true', tabindex: '-1' })
        .find('a, input, button, select')
        .attr({ tabindex: '-1' }),
        b.$slideTrack.attr('role', 'listbox'),
        b.$slides.not(b.$slideTrack.find('.slick-cloned')).each(function (c) {
          a(this).attr({ role: 'option', 'aria-describedby': 'slick-slide' + b.instanceUid + c });
        }),
        null !== b.$dots &&
          b.$dots
            .attr('role', 'tablist')
            .find('li')
            .each(function (c) {
              a(this).attr({
                role: 'presentation',
                'aria-selected': 'false',
                'aria-controls': 'navigation' + b.instanceUid + c,
                id: 'slick-slide' + b.instanceUid + c,
              });
            })
            .first()
            .attr('aria-selected', 'true')
            .end()
            .find('button')
            .attr('role', 'button')
            .end()
            .closest('div')
            .attr('role', 'toolbar'),
        b.activateADA();
    }),
    (b.prototype.initArrowEvents = function () {
      var a = this;
      a.options.arrows === !0 &&
        a.slideCount > a.options.slidesToShow &&
        (a.$prevArrow.off('click.slick').on('click.slick', { message: 'previous' }, a.changeSlide),
        a.$nextArrow.off('click.slick').on('click.slick', { message: 'next' }, a.changeSlide));
    }),
    (b.prototype.initDotEvents = function () {
      var b = this;
      b.options.dots === !0 &&
        b.slideCount > b.options.slidesToShow &&
        a('li', b.$dots).on('click.slick', { message: 'index' }, b.changeSlide),
        b.options.dots === !0 &&
          b.options.pauseOnDotsHover === !0 &&
          a('li', b.$dots).on('mouseenter.slick', a.proxy(b.interrupt, b, !0)).on('mouseleave.slick', a.proxy(b.interrupt, b, !1));
    }),
    (b.prototype.initSlideEvents = function () {
      var b = this;
      b.options.pauseOnHover &&
        (b.$list.on('mouseenter.slick', a.proxy(b.interrupt, b, !0)), b.$list.on('mouseleave.slick', a.proxy(b.interrupt, b, !1)));
    }),
    (b.prototype.initializeEvents = function () {
      var b = this;
      b.initArrowEvents(),
        b.initDotEvents(),
        b.initSlideEvents(),
        b.$list.on('touchstart.slick mousedown.slick', { action: 'start' }, b.swipeHandler),
        b.$list.on('touchmove.slick mousemove.slick', { action: 'move' }, b.swipeHandler),
        b.$list.on('touchend.slick mouseup.slick', { action: 'end' }, b.swipeHandler),
        b.$list.on('touchcancel.slick mouseleave.slick', { action: 'end' }, b.swipeHandler),
        b.$list.on('click.slick', b.clickHandler),
        a(document).on(b.visibilityChange, a.proxy(b.visibility, b)),
        b.options.accessibility === !0 && b.$list.on('keydown.slick', b.keyHandler),
        b.options.focusOnSelect === !0 && a(b.$slideTrack).children().on('click.slick', b.selectHandler),
        a(window).on('orientationchange.slick.slick-' + b.instanceUid, a.proxy(b.orientationChange, b)),
        a(window).on('resize.slick.slick-' + b.instanceUid, a.proxy(b.resize, b)),
        a('[draggable!=true]', b.$slideTrack).on('dragstart', b.preventDefault),
        a(window).on('load.slick.slick-' + b.instanceUid, b.setPosition),
        a(document).on('ready.slick.slick-' + b.instanceUid, b.setPosition);
    }),
    (b.prototype.initUI = function () {
      var a = this;
      a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.show(), a.$nextArrow.show()),
        a.options.dots === !0 && a.slideCount > a.options.slidesToShow && a.$dots.show();
    }),
    (b.prototype.keyHandler = function (a) {
      var b = this;
      a.target.tagName.match('TEXTAREA|INPUT|SELECT') ||
        (37 === a.keyCode && b.options.accessibility === !0
          ? b.changeSlide({ data: { message: b.options.rtl === !0 ? 'next' : 'previous' } })
          : 39 === a.keyCode &&
            b.options.accessibility === !0 &&
            b.changeSlide({ data: { message: b.options.rtl === !0 ? 'previous' : 'next' } }));
    }),
    (b.prototype.lazyLoad = function () {
      function g(c) {
        a('img[data-lazy]', c).each(function () {
          var c = a(this),
            d = a(this).attr('data-lazy'),
            e = document.createElement('img');
          (e.onload = function () {
            c.animate({ opacity: 0 }, 100, function () {
              c.attr('src', d).animate({ opacity: 1 }, 200, function () {
                c.removeAttr('data-lazy').removeClass('slick-loading');
              }),
                b.$slider.trigger('lazyLoaded', [b, c, d]);
            });
          }),
            (e.onerror = function () {
              c.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error'),
                b.$slider.trigger('lazyLoadError', [b, c, d]);
            }),
            (e.src = d);
        });
      }
      var c,
        d,
        e,
        f,
        b = this;
      b.options.centerMode === !0
        ? b.options.infinite === !0
          ? ((e = b.currentSlide + (b.options.slidesToShow / 2 + 1)), (f = e + b.options.slidesToShow + 2))
          : ((e = Math.max(0, b.currentSlide - (b.options.slidesToShow / 2 + 1))),
            (f = 2 + (b.options.slidesToShow / 2 + 1) + b.currentSlide))
        : ((e = b.options.infinite ? b.options.slidesToShow + b.currentSlide : b.currentSlide),
          (f = Math.ceil(e + b.options.slidesToShow)),
          b.options.fade === !0 && (e > 0 && e--, f <= b.slideCount && f++)),
        (c = b.$slider.find('.slick-slide').slice(e, f)),
        g(c),
        b.slideCount <= b.options.slidesToShow
          ? ((d = b.$slider.find('.slick-slide')), g(d))
          : b.currentSlide >= b.slideCount - b.options.slidesToShow
          ? ((d = b.$slider.find('.slick-cloned').slice(0, b.options.slidesToShow)), g(d))
          : 0 === b.currentSlide && ((d = b.$slider.find('.slick-cloned').slice(-1 * b.options.slidesToShow)), g(d));
    }),
    (b.prototype.loadSlider = function () {
      var a = this;
      a.setPosition(),
        a.$slideTrack.css({ opacity: 1 }),
        a.$slider.removeClass('slick-loading'),
        a.initUI(),
        'progressive' === a.options.lazyLoad && a.progressiveLazyLoad();
    }),
    (b.prototype.next = b.prototype.slickNext =
      function () {
        var a = this;
        a.changeSlide({ data: { message: 'next' } });
      }),
    (b.prototype.orientationChange = function () {
      var a = this;
      a.checkResponsive(), a.setPosition();
    }),
    (b.prototype.pause = b.prototype.slickPause =
      function () {
        var a = this;
        a.autoPlayClear(), (a.paused = !0);
      }),
    (b.prototype.play = b.prototype.slickPlay =
      function () {
        var a = this;
        a.autoPlay(), (a.options.autoplay = !0), (a.paused = !1), (a.focussed = !1), (a.interrupted = !1);
      }),
    (b.prototype.postSlide = function (a) {
      var b = this;
      b.unslicked ||
        (b.$slider.trigger('afterChange', [b, a]),
        (b.animating = !1),
        b.setPosition(),
        (b.swipeLeft = null),
        b.options.autoplay && b.autoPlay(),
        b.options.accessibility === !0 && b.initADA());
    }),
    (b.prototype.prev = b.prototype.slickPrev =
      function () {
        var a = this;
        a.changeSlide({ data: { message: 'previous' } });
      }),
    (b.prototype.preventDefault = function (a) {
      a.preventDefault();
    }),
    (b.prototype.progressiveLazyLoad = function (b) {
      b = b || 1;
      var e,
        f,
        g,
        c = this,
        d = a('img[data-lazy]', c.$slider);
      d.length
        ? ((e = d.first()),
          (f = e.attr('data-lazy')),
          (g = document.createElement('img')),
          (g.onload = function () {
            e.attr('src', f).removeAttr('data-lazy').removeClass('slick-loading'),
              c.options.adaptiveHeight === !0 && c.setPosition(),
              c.$slider.trigger('lazyLoaded', [c, e, f]),
              c.progressiveLazyLoad();
          }),
          (g.onerror = function () {
            3 > b
              ? setTimeout(function () {
                  c.progressiveLazyLoad(b + 1);
                }, 500)
              : (e.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error'),
                c.$slider.trigger('lazyLoadError', [c, e, f]),
                c.progressiveLazyLoad());
          }),
          (g.src = f))
        : c.$slider.trigger('allImagesLoaded', [c]);
    }),
    (b.prototype.refresh = function (b) {
      var d,
        e,
        c = this;
      (e = c.slideCount - c.options.slidesToShow),
        !c.options.infinite && c.currentSlide > e && (c.currentSlide = e),
        c.slideCount <= c.options.slidesToShow && (c.currentSlide = 0),
        (d = c.currentSlide),
        c.destroy(!0),
        a.extend(c, c.initials, { currentSlide: d }),
        c.init(),
        b || c.changeSlide({ data: { message: 'index', index: d } }, !1);
    }),
    (b.prototype.registerBreakpoints = function () {
      var c,
        d,
        e,
        b = this,
        f = b.options.responsive || null;
      if ('array' === a.type(f) && f.length) {
        b.respondTo = b.options.respondTo || 'window';
        for (c in f)
          if (((e = b.breakpoints.length - 1), (d = f[c].breakpoint), f.hasOwnProperty(c))) {
            for (; e >= 0; ) b.breakpoints[e] && b.breakpoints[e] === d && b.breakpoints.splice(e, 1), e--;
            b.breakpoints.push(d), (b.breakpointSettings[d] = f[c].settings);
          }
        b.breakpoints.sort(function (a, c) {
          return b.options.mobileFirst ? a - c : c - a;
        });
      }
    }),
    (b.prototype.reinit = function () {
      var b = this;
      (b.$slides = b.$slideTrack.children(b.options.slide).addClass('slick-slide')),
        (b.slideCount = b.$slides.length),
        b.currentSlide >= b.slideCount && 0 !== b.currentSlide && (b.currentSlide = b.currentSlide - b.options.slidesToScroll),
        b.slideCount <= b.options.slidesToShow && (b.currentSlide = 0),
        b.registerBreakpoints(),
        b.setProps(),
        b.setupInfinite(),
        b.buildArrows(),
        b.updateArrows(),
        b.initArrowEvents(),
        b.buildDots(),
        b.updateDots(),
        b.initDotEvents(),
        b.cleanUpSlideEvents(),
        b.initSlideEvents(),
        b.checkResponsive(!1, !0),
        b.options.focusOnSelect === !0 && a(b.$slideTrack).children().on('click.slick', b.selectHandler),
        b.setSlideClasses('number' == typeof b.currentSlide ? b.currentSlide : 0),
        b.setPosition(),
        b.focusHandler(),
        (b.paused = !b.options.autoplay),
        b.autoPlay(),
        b.$slider.trigger('reInit', [b]);
    }),
    (b.prototype.resize = function () {
      var b = this;
      a(window).width() !== b.windowWidth &&
        (clearTimeout(b.windowDelay),
        (b.windowDelay = window.setTimeout(function () {
          (b.windowWidth = a(window).width()), b.checkResponsive(), b.unslicked || b.setPosition();
        }, 50)));
    }),
    (b.prototype.removeSlide = b.prototype.slickRemove =
      function (a, b, c) {
        var d = this;
        return (
          'boolean' == typeof a ? ((b = a), (a = b === !0 ? 0 : d.slideCount - 1)) : (a = b === !0 ? --a : a),
          d.slideCount < 1 || 0 > a || a > d.slideCount - 1
            ? !1
            : (d.unload(),
              c === !0 ? d.$slideTrack.children().remove() : d.$slideTrack.children(this.options.slide).eq(a).remove(),
              (d.$slides = d.$slideTrack.children(this.options.slide)),
              d.$slideTrack.children(this.options.slide).detach(),
              d.$slideTrack.append(d.$slides),
              (d.$slidesCache = d.$slides),
              void d.reinit())
        );
      }),
    (b.prototype.setCSS = function (a) {
      var d,
        e,
        b = this,
        c = {};
      b.options.rtl === !0 && (a = -a),
        (d = 'left' == b.positionProp ? Math.ceil(a) + 'px' : '0px'),
        (e = 'top' == b.positionProp ? Math.ceil(a) + 'px' : '0px'),
        (c[b.positionProp] = a),
        b.transformsEnabled === !1
          ? b.$slideTrack.css(c)
          : ((c = {}),
            b.cssTransitions === !1
              ? ((c[b.animType] = 'translate(' + d + ', ' + e + ')'), b.$slideTrack.css(c))
              : ((c[b.animType] = 'translate3d(' + d + ', ' + e + ', 0px)'), b.$slideTrack.css(c)));
    }),
    (b.prototype.setDimensions = function () {
      var a = this;
      a.options.vertical === !1
        ? a.options.centerMode === !0 && a.$list.css({ padding: '0px ' + a.options.centerPadding })
        : (a.$list.height(a.$slides.first().outerHeight(!0) * a.options.slidesToShow),
          a.options.centerMode === !0 && a.$list.css({ padding: a.options.centerPadding + ' 0px' })),
        (a.listWidth = a.$list.width()),
        (a.listHeight = a.$list.height()),
        a.options.vertical === !1 && a.options.variableWidth === !1
          ? ((a.slideWidth = Math.ceil(a.listWidth / a.options.slidesToShow)),
            a.$slideTrack.width(Math.ceil(a.slideWidth * a.$slideTrack.children('.slick-slide').length)))
          : a.options.variableWidth === !0
          ? a.$slideTrack.width(5e3 * a.slideCount)
          : ((a.slideWidth = Math.ceil(a.listWidth)),
            a.$slideTrack.height(Math.ceil(a.$slides.first().outerHeight(!0) * a.$slideTrack.children('.slick-slide').length)));
      var b = a.$slides.first().outerWidth(!0) - a.$slides.first().width();
      a.options.variableWidth === !1 && a.$slideTrack.children('.slick-slide').width(a.slideWidth - b);
    }),
    (b.prototype.setFade = function () {
      var c,
        b = this;
      b.$slides.each(function (d, e) {
        (c = b.slideWidth * d * -1),
          b.options.rtl === !0
            ? a(e).css({ position: 'relative', right: c, top: 0, zIndex: b.options.zIndex - 2, opacity: 0 })
            : a(e).css({ position: 'relative', left: c, top: 0, zIndex: b.options.zIndex - 2, opacity: 0 });
      }),
        b.$slides.eq(b.currentSlide).css({ zIndex: b.options.zIndex - 1, opacity: 1 });
    }),
    (b.prototype.setHeight = function () {
      var a = this;
      if (1 === a.options.slidesToShow && a.options.adaptiveHeight === !0 && a.options.vertical === !1) {
        var b = a.$slides.eq(a.currentSlide).outerHeight(!0);
        a.$list.css('height', b);
      }
    }),
    (b.prototype.setOption = b.prototype.slickSetOption =
      function () {
        var c,
          d,
          e,
          f,
          h,
          b = this,
          g = !1;
        if (
          ('object' === a.type(arguments[0])
            ? ((e = arguments[0]), (g = arguments[1]), (h = 'multiple'))
            : 'string' === a.type(arguments[0]) &&
              ((e = arguments[0]),
              (f = arguments[1]),
              (g = arguments[2]),
              'responsive' === arguments[0] && 'array' === a.type(arguments[1])
                ? (h = 'responsive')
                : 'undefined' != typeof arguments[1] && (h = 'single')),
          'single' === h)
        )
          b.options[e] = f;
        else if ('multiple' === h)
          a.each(e, function (a, c) {
            b.options[a] = c;
          });
        else if ('responsive' === h)
          for (d in f)
            if ('array' !== a.type(b.options.responsive)) b.options.responsive = [f[d]];
            else {
              for (c = b.options.responsive.length - 1; c >= 0; )
                b.options.responsive[c].breakpoint === f[d].breakpoint && b.options.responsive.splice(c, 1), c--;
              b.options.responsive.push(f[d]);
            }
        g && (b.unload(), b.reinit());
      }),
    (b.prototype.setPosition = function () {
      var a = this;
      a.setDimensions(),
        a.setHeight(),
        a.options.fade === !1 ? a.setCSS(a.getLeft(a.currentSlide)) : a.setFade(),
        a.$slider.trigger('setPosition', [a]);
    }),
    (b.prototype.setProps = function () {
      var a = this,
        b = document.body.style;
      (a.positionProp = a.options.vertical === !0 ? 'top' : 'left'),
        'top' === a.positionProp ? a.$slider.addClass('slick-vertical') : a.$slider.removeClass('slick-vertical'),
        (void 0 !== b.WebkitTransition || void 0 !== b.MozTransition || void 0 !== b.msTransition) &&
          a.options.useCSS === !0 &&
          (a.cssTransitions = !0),
        a.options.fade &&
          ('number' == typeof a.options.zIndex ? a.options.zIndex < 3 && (a.options.zIndex = 3) : (a.options.zIndex = a.defaults.zIndex)),
        void 0 !== b.OTransform &&
          ((a.animType = 'OTransform'),
          (a.transformType = '-o-transform'),
          (a.transitionType = 'OTransition'),
          void 0 === b.perspectiveProperty && void 0 === b.webkitPerspective && (a.animType = !1)),
        void 0 !== b.MozTransform &&
          ((a.animType = 'MozTransform'),
          (a.transformType = '-moz-transform'),
          (a.transitionType = 'MozTransition'),
          void 0 === b.perspectiveProperty && void 0 === b.MozPerspective && (a.animType = !1)),
        void 0 !== b.webkitTransform &&
          ((a.animType = 'webkitTransform'),
          (a.transformType = '-webkit-transform'),
          (a.transitionType = 'webkitTransition'),
          void 0 === b.perspectiveProperty && void 0 === b.webkitPerspective && (a.animType = !1)),
        void 0 !== b.msTransform &&
          ((a.animType = 'msTransform'),
          (a.transformType = '-ms-transform'),
          (a.transitionType = 'msTransition'),
          void 0 === b.msTransform && (a.animType = !1)),
        void 0 !== b.transform &&
          a.animType !== !1 &&
          ((a.animType = 'transform'), (a.transformType = 'transform'), (a.transitionType = 'transition')),
        (a.transformsEnabled = a.options.useTransform && null !== a.animType && a.animType !== !1);
    }),
    (b.prototype.setSlideClasses = function (a) {
      var c,
        d,
        e,
        f,
        b = this;
      (d = b.$slider.find('.slick-slide').removeClass('slick-active slick-center slick-current').attr('aria-hidden', 'true')),
        b.$slides.eq(a).addClass('slick-current'),
        b.options.centerMode === !0
          ? ((c = Math.floor(b.options.slidesToShow / 2)),
            b.options.infinite === !0 &&
              (a >= c && a <= b.slideCount - 1 - c
                ? b.$slides
                    .slice(a - c, a + c + 1)
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false')
                : ((e = b.options.slidesToShow + a),
                  d
                    .slice(e - c + 1, e + c + 2)
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false')),
              0 === a
                ? d.eq(d.length - 1 - b.options.slidesToShow).addClass('slick-center')
                : a === b.slideCount - 1 && d.eq(b.options.slidesToShow).addClass('slick-center')),
            b.$slides.eq(a).addClass('slick-center'))
          : a >= 0 && a <= b.slideCount - b.options.slidesToShow
          ? b.$slides
              .slice(a, a + b.options.slidesToShow)
              .addClass('slick-active')
              .attr('aria-hidden', 'false')
          : d.length <= b.options.slidesToShow
          ? d.addClass('slick-active').attr('aria-hidden', 'false')
          : ((f = b.slideCount % b.options.slidesToShow),
            (e = b.options.infinite === !0 ? b.options.slidesToShow + a : a),
            b.options.slidesToShow == b.options.slidesToScroll && b.slideCount - a < b.options.slidesToShow
              ? d
                  .slice(e - (b.options.slidesToShow - f), e + f)
                  .addClass('slick-active')
                  .attr('aria-hidden', 'false')
              : d
                  .slice(e, e + b.options.slidesToShow)
                  .addClass('slick-active')
                  .attr('aria-hidden', 'false')),
        'ondemand' === b.options.lazyLoad && b.lazyLoad();
    }),
    (b.prototype.setupInfinite = function () {
      var c,
        d,
        e,
        b = this;
      if (
        (b.options.fade === !0 && (b.options.centerMode = !1),
        b.options.infinite === !0 && b.options.fade === !1 && ((d = null), b.slideCount > b.options.slidesToShow))
      ) {
        for (
          e = b.options.centerMode === !0 ? b.options.slidesToShow + 1 : b.options.slidesToShow, c = b.slideCount;
          c > b.slideCount - e;
          c -= 1
        )
          (d = c - 1),
            a(b.$slides[d])
              .clone(!0)
              .attr('id', '')
              .attr('data-slick-index', d - b.slideCount)
              .prependTo(b.$slideTrack)
              .addClass('slick-cloned');
        for (c = 0; e > c; c += 1)
          (d = c),
            a(b.$slides[d])
              .clone(!0)
              .attr('id', '')
              .attr('data-slick-index', d + b.slideCount)
              .appendTo(b.$slideTrack)
              .addClass('slick-cloned');
        b.$slideTrack
          .find('.slick-cloned')
          .find('[id]')
          .each(function () {
            a(this).attr('id', '');
          });
      }
    }),
    (b.prototype.interrupt = function (a) {
      var b = this;
      a || b.autoPlay(), (b.interrupted = a);
    }),
    (b.prototype.selectHandler = function (b) {
      var c = this,
        d = a(b.target).is('.slick-slide') ? a(b.target) : a(b.target).parents('.slick-slide'),
        e = parseInt(d.attr('data-slick-index'));
      return e || (e = 0), c.slideCount <= c.options.slidesToShow ? (c.setSlideClasses(e), void c.asNavFor(e)) : void c.slideHandler(e);
    }),
    (b.prototype.slideHandler = function (a, b, c) {
      var d,
        e,
        f,
        g,
        j,
        h = null,
        i = this;
      return (
        (b = b || !1),
        (i.animating === !0 && i.options.waitForAnimate === !0) ||
        (i.options.fade === !0 && i.currentSlide === a) ||
        i.slideCount <= i.options.slidesToShow
          ? void 0
          : (b === !1 && i.asNavFor(a),
            (d = a),
            (h = i.getLeft(d)),
            (g = i.getLeft(i.currentSlide)),
            (i.currentLeft = null === i.swipeLeft ? g : i.swipeLeft),
            i.options.infinite === !1 && i.options.centerMode === !1 && (0 > a || a > i.getDotCount() * i.options.slidesToScroll)
              ? void (
                  i.options.fade === !1 &&
                  ((d = i.currentSlide),
                  c !== !0
                    ? i.animateSlide(g, function () {
                        i.postSlide(d);
                      })
                    : i.postSlide(d))
                )
              : i.options.infinite === !1 && i.options.centerMode === !0 && (0 > a || a > i.slideCount - i.options.slidesToScroll)
              ? void (
                  i.options.fade === !1 &&
                  ((d = i.currentSlide),
                  c !== !0
                    ? i.animateSlide(g, function () {
                        i.postSlide(d);
                      })
                    : i.postSlide(d))
                )
              : (i.options.autoplay && clearInterval(i.autoPlayTimer),
                (e =
                  0 > d
                    ? i.slideCount % i.options.slidesToScroll !== 0
                      ? i.slideCount - (i.slideCount % i.options.slidesToScroll)
                      : i.slideCount + d
                    : d >= i.slideCount
                    ? i.slideCount % i.options.slidesToScroll !== 0
                      ? 0
                      : d - i.slideCount
                    : d),
                (i.animating = !0),
                i.$slider.trigger('beforeChange', [i, i.currentSlide, e]),
                (f = i.currentSlide),
                (i.currentSlide = e),
                i.setSlideClasses(i.currentSlide),
                i.options.asNavFor &&
                  ((j = i.getNavTarget()),
                  (j = j.slick('getSlick')),
                  j.slideCount <= j.options.slidesToShow && j.setSlideClasses(i.currentSlide)),
                i.updateDots(),
                i.updateArrows(),
                i.options.fade === !0
                  ? (c !== !0
                      ? (i.fadeSlideOut(f),
                        i.fadeSlide(e, function () {
                          i.postSlide(e);
                        }))
                      : i.postSlide(e),
                    void i.animateHeight())
                  : void (c !== !0
                      ? i.animateSlide(h, function () {
                          i.postSlide(e);
                        })
                      : i.postSlide(e))))
      );
    }),
    (b.prototype.startLoad = function () {
      var a = this;
      a.options.arrows === !0 && a.slideCount > a.options.slidesToShow && (a.$prevArrow.hide(), a.$nextArrow.hide()),
        a.options.dots === !0 && a.slideCount > a.options.slidesToShow && a.$dots.hide(),
        a.$slider.addClass('slick-loading');
    }),
    (b.prototype.swipeDirection = function () {
      var a,
        b,
        c,
        d,
        e = this;
      return (
        (a = e.touchObject.startX - e.touchObject.curX),
        (b = e.touchObject.startY - e.touchObject.curY),
        (c = Math.atan2(b, a)),
        (d = Math.round((180 * c) / Math.PI)),
        0 > d && (d = 360 - Math.abs(d)),
        45 >= d && d >= 0
          ? e.options.rtl === !1
            ? 'left'
            : 'right'
          : 360 >= d && d >= 315
          ? e.options.rtl === !1
            ? 'left'
            : 'right'
          : d >= 135 && 225 >= d
          ? e.options.rtl === !1
            ? 'right'
            : 'left'
          : e.options.verticalSwiping === !0
          ? d >= 35 && 135 >= d
            ? 'down'
            : 'up'
          : 'vertical'
      );
    }),
    (b.prototype.swipeEnd = function (a) {
      var c,
        d,
        b = this;
      if (
        ((b.dragging = !1), (b.interrupted = !1), (b.shouldClick = b.touchObject.swipeLength > 10 ? !1 : !0), void 0 === b.touchObject.curX)
      )
        return !1;
      if (
        (b.touchObject.edgeHit === !0 && b.$slider.trigger('edge', [b, b.swipeDirection()]),
        b.touchObject.swipeLength >= b.touchObject.minSwipe)
      ) {
        switch ((d = b.swipeDirection())) {
          case 'left':
          case 'down':
            (c = b.options.swipeToSlide ? b.checkNavigable(b.currentSlide + b.getSlideCount()) : b.currentSlide + b.getSlideCount()),
              (b.currentDirection = 0);
            break;
          case 'right':
          case 'up':
            (c = b.options.swipeToSlide ? b.checkNavigable(b.currentSlide - b.getSlideCount()) : b.currentSlide - b.getSlideCount()),
              (b.currentDirection = 1);
        }
        'vertical' != d && (b.slideHandler(c), (b.touchObject = {}), b.$slider.trigger('swipe', [b, d]));
      } else b.touchObject.startX !== b.touchObject.curX && (b.slideHandler(b.currentSlide), (b.touchObject = {}));
    }),
    (b.prototype.swipeHandler = function (a) {
      var b = this;
      if (
        !(
          b.options.swipe === !1 ||
          ('ontouchend' in document && b.options.swipe === !1) ||
          (b.options.draggable === !1 && -1 !== a.type.indexOf('mouse'))
        )
      )
        switch (
          ((b.touchObject.fingerCount = a.originalEvent && void 0 !== a.originalEvent.touches ? a.originalEvent.touches.length : 1),
          (b.touchObject.minSwipe = b.listWidth / b.options.touchThreshold),
          b.options.verticalSwiping === !0 && (b.touchObject.minSwipe = b.listHeight / b.options.touchThreshold),
          a.data.action)
        ) {
          case 'start':
            b.swipeStart(a);
            break;
          case 'move':
            b.swipeMove(a);
            break;
          case 'end':
            b.swipeEnd(a);
        }
    }),
    (b.prototype.swipeMove = function (a) {
      var d,
        e,
        f,
        g,
        h,
        b = this;
      return (
        (h = void 0 !== a.originalEvent ? a.originalEvent.touches : null),
        !b.dragging || (h && 1 !== h.length)
          ? !1
          : ((d = b.getLeft(b.currentSlide)),
            (b.touchObject.curX = void 0 !== h ? h[0].pageX : a.clientX),
            (b.touchObject.curY = void 0 !== h ? h[0].pageY : a.clientY),
            (b.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(b.touchObject.curX - b.touchObject.startX, 2)))),
            b.options.verticalSwiping === !0 &&
              (b.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(b.touchObject.curY - b.touchObject.startY, 2)))),
            (e = b.swipeDirection()),
            'vertical' !== e
              ? (void 0 !== a.originalEvent && b.touchObject.swipeLength > 4 && a.preventDefault(),
                (g = (b.options.rtl === !1 ? 1 : -1) * (b.touchObject.curX > b.touchObject.startX ? 1 : -1)),
                b.options.verticalSwiping === !0 && (g = b.touchObject.curY > b.touchObject.startY ? 1 : -1),
                (f = b.touchObject.swipeLength),
                (b.touchObject.edgeHit = !1),
                b.options.infinite === !1 &&
                  ((0 === b.currentSlide && 'right' === e) || (b.currentSlide >= b.getDotCount() && 'left' === e)) &&
                  ((f = b.touchObject.swipeLength * b.options.edgeFriction), (b.touchObject.edgeHit = !0)),
                b.options.vertical === !1 ? (b.swipeLeft = d + f * g) : (b.swipeLeft = d + f * (b.$list.height() / b.listWidth) * g),
                b.options.verticalSwiping === !0 && (b.swipeLeft = d + f * g),
                b.options.fade === !0 || b.options.touchMove === !1
                  ? !1
                  : b.animating === !0
                  ? ((b.swipeLeft = null), !1)
                  : void b.setCSS(b.swipeLeft))
              : void 0)
      );
    }),
    (b.prototype.swipeStart = function (a) {
      var c,
        b = this;
      return (
        (b.interrupted = !0),
        1 !== b.touchObject.fingerCount || b.slideCount <= b.options.slidesToShow
          ? ((b.touchObject = {}), !1)
          : (void 0 !== a.originalEvent && void 0 !== a.originalEvent.touches && (c = a.originalEvent.touches[0]),
            (b.touchObject.startX = b.touchObject.curX = void 0 !== c ? c.pageX : a.clientX),
            (b.touchObject.startY = b.touchObject.curY = void 0 !== c ? c.pageY : a.clientY),
            void (b.dragging = !0))
      );
    }),
    (b.prototype.unfilterSlides = b.prototype.slickUnfilter =
      function () {
        var a = this;
        null !== a.$slidesCache &&
          (a.unload(), a.$slideTrack.children(this.options.slide).detach(), a.$slidesCache.appendTo(a.$slideTrack), a.reinit());
      }),
    (b.prototype.unload = function () {
      var b = this;
      a('.slick-cloned', b.$slider).remove(),
        b.$dots && b.$dots.remove(),
        b.$prevArrow && b.htmlExpr.test(b.options.prevArrow) && b.$prevArrow.remove(),
        b.$nextArrow && b.htmlExpr.test(b.options.nextArrow) && b.$nextArrow.remove(),
        b.$slides.removeClass('slick-slide slick-active slick-visible slick-current').attr('aria-hidden', 'true').css('width', '');
    }),
    (b.prototype.unslick = function (a) {
      var b = this;
      b.$slider.trigger('unslick', [b, a]), b.destroy();
    }),
    (b.prototype.updateArrows = function () {
      var b,
        a = this;
      (b = Math.floor(a.options.slidesToShow / 2)),
        a.options.arrows === !0 &&
          a.slideCount > a.options.slidesToShow &&
          !a.options.infinite &&
          (a.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false'),
          a.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false'),
          0 === a.currentSlide
            ? (a.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true'),
              a.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false'))
            : a.currentSlide >= a.slideCount - a.options.slidesToShow && a.options.centerMode === !1
            ? (a.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true'),
              a.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false'))
            : a.currentSlide >= a.slideCount - 1 &&
              a.options.centerMode === !0 &&
              (a.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true'),
              a.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false')));
    }),
    (b.prototype.updateDots = function () {
      var a = this;
      null !== a.$dots &&
        (a.$dots.find('li').removeClass('slick-active').attr('aria-hidden', 'true'),
        a.$dots
          .find('li')
          .eq(Math.floor(a.currentSlide / a.options.slidesToScroll))
          .addClass('slick-active')
          .attr('aria-hidden', 'false'));
    }),
    (b.prototype.visibility = function () {
      var a = this;
      a.options.autoplay && (document[a.hidden] ? (a.interrupted = !0) : (a.interrupted = !1));
    }),
    (a.fn.slick = function () {
      var f,
        g,
        a = this,
        c = arguments[0],
        d = Array.prototype.slice.call(arguments, 1),
        e = a.length;
      for (f = 0; e > f; f++)
        if (
          ('object' == typeof c || 'undefined' == typeof c ? (a[f].slick = new b(a[f], c)) : (g = a[f].slick[c].apply(a[f].slick, d)),
          'undefined' != typeof g)
        )
          return g;
      return a;
    });
});

/**
 * SimpleBar.js - v4.1.0
 * Scrollbars, simpler.
 * https://grsmto.github.io/simplebar/
 *
 * Made by Adrien Denat from a fork by Jonathan Nicol
 * Under MIT License
 */

!(function (t, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define(e)
    : ((t = t || self).SimpleBar = e());
})(this, function () {
  'use strict';
  var t = function (t) {
      if ('function' != typeof t) throw TypeError(String(t) + ' is not a function');
      return t;
    },
    e = function (t) {
      try {
        return !!t();
      } catch (t) {
        return !0;
      }
    },
    i = {}.toString,
    r = function (t) {
      return i.call(t).slice(8, -1);
    },
    n = ''.split,
    s = e(function () {
      return !Object('z').propertyIsEnumerable(0);
    })
      ? function (t) {
          return 'String' == r(t) ? n.call(t, '') : Object(t);
        }
      : Object,
    o = function (t) {
      if (null == t) throw TypeError("Can't call method on " + t);
      return t;
    },
    a = function (t) {
      return Object(o(t));
    },
    l = Math.ceil,
    c = Math.floor,
    u = function (t) {
      return isNaN((t = +t)) ? 0 : (t > 0 ? c : l)(t);
    },
    h = Math.min,
    f = function (t) {
      return t > 0 ? h(u(t), 9007199254740991) : 0;
    },
    d = function (t) {
      return 'object' == typeof t ? null !== t : 'function' == typeof t;
    },
    p =
      Array.isArray ||
      function (t) {
        return 'Array' == r(t);
      },
    v =
      'undefined' != typeof globalThis
        ? globalThis
        : 'undefined' != typeof window
        ? window
        : 'undefined' != typeof global
        ? global
        : 'undefined' != typeof self
        ? self
        : {};
  function g(t, e) {
    return t((e = { exports: {} }), e.exports), e.exports;
  }
  var b,
    m,
    y,
    x,
    E =
      'object' == typeof window && window && window.Math == Math
        ? window
        : 'object' == typeof self && self && self.Math == Math
        ? self
        : Function('return this')(),
    w = !e(function () {
      return (
        7 !=
        Object.defineProperty({}, 'a', {
          get: function () {
            return 7;
          },
        }).a
      );
    }),
    O = E.document,
    _ = d(O) && d(O.createElement),
    S =
      !w &&
      !e(function () {
        return (
          7 !=
          Object.defineProperty(((t = 'div'), _ ? O.createElement(t) : {}), 'a', {
            get: function () {
              return 7;
            },
          }).a
        );
        var t;
      }),
    L = function (t) {
      if (!d(t)) throw TypeError(String(t) + ' is not an object');
      return t;
    },
    A = function (t, e) {
      if (!d(t)) return t;
      var i, r;
      if (e && 'function' == typeof (i = t.toString) && !d((r = i.call(t)))) return r;
      if ('function' == typeof (i = t.valueOf) && !d((r = i.call(t)))) return r;
      if (!e && 'function' == typeof (i = t.toString) && !d((r = i.call(t)))) return r;
      throw TypeError("Can't convert object to primitive value");
    },
    k = Object.defineProperty,
    M = {
      f: w
        ? k
        : function (t, e, i) {
            if ((L(t), (e = A(e, !0)), L(i), S))
              try {
                return k(t, e, i);
              } catch (t) {}
            if ('get' in i || 'set' in i) throw TypeError('Accessors not supported');
            return 'value' in i && (t[e] = i.value), t;
          },
    },
    W = function (t, e) {
      return { enumerable: !(1 & t), configurable: !(2 & t), writable: !(4 & t), value: e };
    },
    T = w
      ? function (t, e, i) {
          return M.f(t, e, W(1, i));
        }
      : function (t, e, i) {
          return (t[e] = i), t;
        },
    R = function (t, e) {
      try {
        T(E, t, e);
      } catch (i) {
        E[t] = e;
      }
      return e;
    },
    j = g(function (t) {
      var e = E['__core-js_shared__'] || R('__core-js_shared__', {});
      (t.exports = function (t, i) {
        return e[t] || (e[t] = void 0 !== i ? i : {});
      })('versions', []).push({ version: '3.0.1', mode: 'global', copyright: '© 2019 Denis Pushkarev (zloirock.ru)' });
    }),
    C = 0,
    N = Math.random(),
    z = function (t) {
      return 'Symbol('.concat(void 0 === t ? '' : t, ')_', (++C + N).toString(36));
    },
    D = !e(function () {
      return !String(Symbol());
    }),
    V = j('wks'),
    B = E.Symbol,
    I = function (t) {
      return V[t] || (V[t] = (D && B[t]) || (D ? B : z)('Symbol.' + t));
    },
    P = I('species'),
    H = function (t, e) {
      var i;
      return (
        p(t) &&
          ('function' != typeof (i = t.constructor) || (i !== Array && !p(i.prototype))
            ? d(i) && null === (i = i[P]) && (i = void 0)
            : (i = void 0)),
        new (void 0 === i ? Array : i)(0 === e ? 0 : e)
      );
    },
    q = function (e, i) {
      var r = 1 == e,
        n = 2 == e,
        o = 3 == e,
        l = 4 == e,
        c = 6 == e,
        u = 5 == e || c,
        h = i || H;
      return function (i, d, p) {
        for (
          var v,
            g,
            b = a(i),
            m = s(b),
            y = (function (e, i, r) {
              if ((t(e), void 0 === i)) return e;
              switch (r) {
                case 0:
                  return function () {
                    return e.call(i);
                  };
                case 1:
                  return function (t) {
                    return e.call(i, t);
                  };
                case 2:
                  return function (t, r) {
                    return e.call(i, t, r);
                  };
                case 3:
                  return function (t, r, n) {
                    return e.call(i, t, r, n);
                  };
              }
              return function () {
                return e.apply(i, arguments);
              };
            })(d, p, 3),
            x = f(m.length),
            E = 0,
            w = r ? h(i, x) : n ? h(i, 0) : void 0;
          x > E;
          E++
        )
          if ((u || E in m) && ((g = y((v = m[E]), E, b)), e))
            if (r) w[E] = g;
            else if (g)
              switch (e) {
                case 3:
                  return !0;
                case 5:
                  return v;
                case 6:
                  return E;
                case 2:
                  w.push(v);
              }
            else if (l) return !1;
        return c ? -1 : o || l ? l : w;
      };
    },
    F = I('species'),
    $ = {}.propertyIsEnumerable,
    Y = Object.getOwnPropertyDescriptor,
    X = {
      f:
        Y && !$.call({ 1: 2 }, 1)
          ? function (t) {
              var e = Y(this, t);
              return !!e && e.enumerable;
            }
          : $,
    },
    G = function (t) {
      return s(o(t));
    },
    K = {}.hasOwnProperty,
    U = function (t, e) {
      return K.call(t, e);
    },
    J = Object.getOwnPropertyDescriptor,
    Q = {
      f: w
        ? J
        : function (t, e) {
            if (((t = G(t)), (e = A(e, !0)), S))
              try {
                return J(t, e);
              } catch (t) {}
            if (U(t, e)) return W(!X.f.call(t, e), t[e]);
          },
    },
    Z = j('native-function-to-string', Function.toString),
    tt = E.WeakMap,
    et = 'function' == typeof tt && /native code/.test(Z.call(tt)),
    it = j('keys'),
    rt = {},
    nt = E.WeakMap;
  if (et) {
    var st = new nt(),
      ot = st.get,
      at = st.has,
      lt = st.set;
    (b = function (t, e) {
      return lt.call(st, t, e), e;
    }),
      (m = function (t) {
        return ot.call(st, t) || {};
      }),
      (y = function (t) {
        return at.call(st, t);
      });
  } else {
    var ct = it[(x = 'state')] || (it[x] = z(x));
    (rt[ct] = !0),
      (b = function (t, e) {
        return T(t, ct, e), e;
      }),
      (m = function (t) {
        return U(t, ct) ? t[ct] : {};
      }),
      (y = function (t) {
        return U(t, ct);
      });
  }
  var ut,
    ht,
    ft = {
      set: b,
      get: m,
      has: y,
      enforce: function (t) {
        return y(t) ? m(t) : b(t, {});
      },
      getterFor: function (t) {
        return function (e) {
          var i;
          if (!d(e) || (i = m(e)).type !== t) throw TypeError('Incompatible receiver, ' + t + ' required');
          return i;
        };
      },
    },
    dt = g(function (t) {
      var e = ft.get,
        i = ft.enforce,
        r = String(Z).split('toString');
      j('inspectSource', function (t) {
        return Z.call(t);
      }),
        (t.exports = function (t, e, n, s) {
          var o = !!s && !!s.unsafe,
            a = !!s && !!s.enumerable,
            l = !!s && !!s.noTargetGet;
          'function' == typeof n &&
            ('string' != typeof e || U(n, 'name') || T(n, 'name', e), (i(n).source = r.join('string' == typeof e ? e : ''))),
            t !== E ? (o ? !l && t[e] && (a = !0) : delete t[e], a ? (t[e] = n) : T(t, e, n)) : a ? (t[e] = n) : R(e, n);
        })(Function.prototype, 'toString', function () {
          return ('function' == typeof this && e(this).source) || Z.call(this);
        });
    }),
    pt = Math.max,
    vt = Math.min,
    gt =
      ((ut = !1),
      function (t, e, i) {
        var r,
          n = G(t),
          s = f(n.length),
          o = (function (t, e) {
            var i = u(t);
            return i < 0 ? pt(i + e, 0) : vt(i, e);
          })(i, s);
        if (ut && e != e) {
          for (; s > o; ) if ((r = n[o++]) != r) return !0;
        } else for (; s > o; o++) if ((ut || o in n) && n[o] === e) return ut || o || 0;
        return !ut && -1;
      }),
    bt = function (t, e) {
      var i,
        r = G(t),
        n = 0,
        s = [];
      for (i in r) !U(rt, i) && U(r, i) && s.push(i);
      for (; e.length > n; ) U(r, (i = e[n++])) && (~gt(s, i) || s.push(i));
      return s;
    },
    mt = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'],
    yt = mt.concat('length', 'prototype'),
    xt = {
      f:
        Object.getOwnPropertyNames ||
        function (t) {
          return bt(t, yt);
        },
    },
    Et = { f: Object.getOwnPropertySymbols },
    wt = E.Reflect,
    Ot =
      (wt && wt.ownKeys) ||
      function (t) {
        var e = xt.f(L(t)),
          i = Et.f;
        return i ? e.concat(i(t)) : e;
      },
    _t = function (t, e) {
      for (var i = Ot(e), r = M.f, n = Q.f, s = 0; s < i.length; s++) {
        var o = i[s];
        U(t, o) || r(t, o, n(e, o));
      }
    },
    St = /#|\.prototype\./,
    Lt = function (t, i) {
      var r = kt[At(t)];
      return r == Wt || (r != Mt && ('function' == typeof i ? e(i) : !!i));
    },
    At = (Lt.normalize = function (t) {
      return String(t).replace(St, '.').toLowerCase();
    }),
    kt = (Lt.data = {}),
    Mt = (Lt.NATIVE = 'N'),
    Wt = (Lt.POLYFILL = 'P'),
    Tt = Lt,
    Rt = Q.f,
    jt = function (t, e) {
      var i,
        r,
        n,
        s,
        o,
        a = t.target,
        l = t.global,
        c = t.stat;
      if ((i = l ? E : c ? E[a] || R(a, {}) : (E[a] || {}).prototype))
        for (r in e) {
          if (
            ((s = e[r]),
            (n = t.noTargetGet ? (o = Rt(i, r)) && o.value : i[r]),
            !Tt(l ? r : a + (c ? '.' : '#') + r, t.forced) && void 0 !== n)
          ) {
            if (typeof s == typeof n) continue;
            _t(s, n);
          }
          (t.sham || (n && n.sham)) && T(s, 'sham', !0), dt(i, r, s, t);
        }
    },
    Ct = q(2);
  jt(
    {
      target: 'Array',
      proto: !0,
      forced: !((ht = 'filter'),
      !e(function () {
        var t = [];
        return (
          ((t.constructor = {})[F] = function () {
            return { foo: 1 };
          }),
          1 !== t[ht](Boolean).foo
        );
      })),
    },
    {
      filter: function (t) {
        return Ct(this, t, arguments[1]);
      },
    }
  );
  var Nt = function (t, i) {
      var r = [][t];
      return (
        !r ||
        !e(function () {
          r.call(
            null,
            i ||
              function () {
                throw 1;
              },
            1
          );
        })
      );
    },
    zt = [].forEach,
    Dt = q(0),
    Vt = Nt('forEach')
      ? function (t) {
          return Dt(this, t, arguments[1]);
        }
      : zt;
  jt({ target: 'Array', proto: !0, forced: [].forEach != Vt }, { forEach: Vt });
  jt(
    { target: 'Array', proto: !0, forced: Nt('reduce') },
    {
      reduce: function (e) {
        return (function (e, i, r, n, o) {
          t(i);
          var l = a(e),
            c = s(l),
            u = f(l.length),
            h = o ? u - 1 : 0,
            d = o ? -1 : 1;
          if (r < 2)
            for (;;) {
              if (h in c) {
                (n = c[h]), (h += d);
                break;
              }
              if (((h += d), o ? h < 0 : u <= h)) throw TypeError('Reduce of empty array with no initial value');
            }
          for (; o ? h >= 0 : u > h; h += d) h in c && (n = i(n, c[h], h, l));
          return n;
        })(this, e, arguments.length, arguments[1], !1);
      },
    }
  );
  var Bt = M.f,
    It = Function.prototype,
    Pt = It.toString,
    Ht = /^\s*function ([^ (]*)/;
  !w ||
    'name' in It ||
    Bt(It, 'name', {
      configurable: !0,
      get: function () {
        try {
          return Pt.call(this).match(Ht)[1];
        } catch (t) {
          return '';
        }
      },
    });
  var qt =
      Object.keys ||
      function (t) {
        return bt(t, mt);
      },
    Ft = Object.assign,
    $t =
      !Ft ||
      e(function () {
        var t = {},
          e = {},
          i = Symbol();
        return (
          (t[i] = 7),
          'abcdefghijklmnopqrst'.split('').forEach(function (t) {
            e[t] = t;
          }),
          7 != Ft({}, t)[i] || 'abcdefghijklmnopqrst' != qt(Ft({}, e)).join('')
        );
      })
        ? function (t, e) {
            for (var i = a(t), r = arguments.length, n = 1, o = Et.f, l = X.f; r > n; )
              for (var c, u = s(arguments[n++]), h = o ? qt(u).concat(o(u)) : qt(u), f = h.length, d = 0; f > d; )
                l.call(u, (c = h[d++])) && (i[c] = u[c]);
            return i;
          }
        : Ft;
  jt({ target: 'Object', stat: !0, forced: Object.assign !== $t }, { assign: $t });
  var Yt = '\t\n\v\f\r                　\u2028\u2029\ufeff',
    Xt = '[' + Yt + ']',
    Gt = RegExp('^' + Xt + Xt + '*'),
    Kt = RegExp(Xt + Xt + '*$'),
    Ut = E.parseInt,
    Jt = /^[-+]?0[xX]/,
    Qt =
      8 !== Ut(Yt + '08') || 22 !== Ut(Yt + '0x16')
        ? function (t, e) {
            var i = (function (t, e) {
              return (t = String(o(t))), 1 & e && (t = t.replace(Gt, '')), 2 & e && (t = t.replace(Kt, '')), t;
            })(String(t), 3);
            return Ut(i, e >>> 0 || (Jt.test(i) ? 16 : 10));
          }
        : Ut;
  jt({ global: !0, forced: parseInt != Qt }, { parseInt: Qt });
  var Zt,
    te,
    ee = RegExp.prototype.exec,
    ie = String.prototype.replace,
    re = ee,
    ne = ((Zt = /a/), (te = /b*/g), ee.call(Zt, 'a'), ee.call(te, 'a'), 0 !== Zt.lastIndex || 0 !== te.lastIndex),
    se = void 0 !== /()??/.exec('')[1];
  (ne || se) &&
    (re = function (t) {
      var e,
        i,
        r,
        n,
        s = this;
      return (
        se &&
          (i = new RegExp(
            '^' + s.source + '$(?!\\s)',
            function () {
              var t = L(this),
                e = '';
              return (
                t.global && (e += 'g'),
                t.ignoreCase && (e += 'i'),
                t.multiline && (e += 'm'),
                t.unicode && (e += 'u'),
                t.sticky && (e += 'y'),
                e
              );
            }.call(s)
          )),
        ne && (e = s.lastIndex),
        (r = ee.call(s, t)),
        ne && r && (s.lastIndex = s.global ? r.index + r[0].length : e),
        se &&
          r &&
          r.length > 1 &&
          ie.call(r[0], i, function () {
            for (n = 1; n < arguments.length - 2; n++) void 0 === arguments[n] && (r[n] = void 0);
          }),
        r
      );
    });
  var oe = re;
  jt({ target: 'RegExp', proto: !0, forced: /./.exec !== oe }, { exec: oe });
  var ae = function (t, e, i) {
      return (
        e +
        (i
          ? (function (t, e, i) {
              var r,
                n,
                s = String(o(t)),
                a = u(e),
                l = s.length;
              return a < 0 || a >= l
                ? i
                  ? ''
                  : void 0
                : (r = s.charCodeAt(a)) < 55296 || r > 56319 || a + 1 === l || (n = s.charCodeAt(a + 1)) < 56320 || n > 57343
                ? i
                  ? s.charAt(a)
                  : r
                : i
                ? s.slice(a, a + 2)
                : n - 56320 + ((r - 55296) << 10) + 65536;
            })(t, e, !0).length
          : 1)
      );
    },
    le = function (t, e) {
      var i = t.exec;
      if ('function' == typeof i) {
        var n = i.call(t, e);
        if ('object' != typeof n) throw TypeError('RegExp exec method returned something other than an Object or null');
        return n;
      }
      if ('RegExp' !== r(t)) throw TypeError('RegExp#exec called on incompatible receiver');
      return oe.call(t, e);
    },
    ce = I('species'),
    ue = !e(function () {
      var t = /./;
      return (
        (t.exec = function () {
          var t = [];
          return (t.groups = { a: '7' }), t;
        }),
        '7' !== ''.replace(t, '$<a>')
      );
    }),
    he = !e(function () {
      var t = /(?:)/,
        e = t.exec;
      t.exec = function () {
        return e.apply(this, arguments);
      };
      var i = 'ab'.split(t);
      return 2 !== i.length || 'a' !== i[0] || 'b' !== i[1];
    }),
    fe = function (t, i, r, n) {
      var s = I(t),
        o = !e(function () {
          var e = {};
          return (
            (e[s] = function () {
              return 7;
            }),
            7 != ''[t](e)
          );
        }),
        a =
          o &&
          !e(function () {
            var e = !1,
              i = /a/;
            return (
              (i.exec = function () {
                return (e = !0), null;
              }),
              'split' === t &&
                ((i.constructor = {}),
                (i.constructor[ce] = function () {
                  return i;
                })),
              i[s](''),
              !e
            );
          });
      if (!o || !a || ('replace' === t && !ue) || ('split' === t && !he)) {
        var l = /./[s],
          c = r(s, ''[t], function (t, e, i, r, n) {
            return e.exec === oe ? (o && !n ? { done: !0, value: l.call(e, i, r) } : { done: !0, value: t.call(i, e, r) }) : { done: !1 };
          }),
          u = c[0],
          h = c[1];
        dt(String.prototype, t, u),
          dt(
            RegExp.prototype,
            s,
            2 == i
              ? function (t, e) {
                  return h.call(t, this, e);
                }
              : function (t) {
                  return h.call(t, this);
                }
          ),
          n && T(RegExp.prototype[s], 'sham', !0);
      }
    };
  fe('match', 1, function (t, e, i) {
    return [
      function (e) {
        var i = o(this),
          r = null == e ? void 0 : e[t];
        return void 0 !== r ? r.call(e, i) : new RegExp(e)[t](String(i));
      },
      function (t) {
        var r = i(e, t, this);
        if (r.done) return r.value;
        var n = L(t),
          s = String(this);
        if (!n.global) return le(n, s);
        var o = n.unicode;
        n.lastIndex = 0;
        for (var a, l = [], c = 0; null !== (a = le(n, s)); ) {
          var u = String(a[0]);
          (l[c] = u), '' === u && (n.lastIndex = ae(s, f(n.lastIndex), o)), c++;
        }
        return 0 === c ? null : l;
      },
    ];
  });
  var de = Math.max,
    pe = Math.min,
    ve = Math.floor,
    ge = /\$([$&`']|\d\d?|<[^>]*>)/g,
    be = /\$([$&`']|\d\d?)/g;
  fe('replace', 2, function (t, e, i) {
    return [
      function (i, r) {
        var n = o(this),
          s = null == i ? void 0 : i[t];
        return void 0 !== s ? s.call(i, n, r) : e.call(String(n), i, r);
      },
      function (t, n) {
        var s = i(e, t, this, n);
        if (s.done) return s.value;
        var o = L(t),
          a = String(this),
          l = 'function' == typeof n;
        l || (n = String(n));
        var c = o.global;
        if (c) {
          var h = o.unicode;
          o.lastIndex = 0;
        }
        for (var d = []; ; ) {
          var p = le(o, a);
          if (null === p) break;
          if ((d.push(p), !c)) break;
          '' === String(p[0]) && (o.lastIndex = ae(a, f(o.lastIndex), h));
        }
        for (var v, g = '', b = 0, m = 0; m < d.length; m++) {
          p = d[m];
          for (var y = String(p[0]), x = de(pe(u(p.index), a.length), 0), E = [], w = 1; w < p.length; w++)
            E.push(void 0 === (v = p[w]) ? v : String(v));
          var O = p.groups;
          if (l) {
            var _ = [y].concat(E, x, a);
            void 0 !== O && _.push(O);
            var S = String(n.apply(void 0, _));
          } else S = r(y, a, x, E, O, n);
          x >= b && ((g += a.slice(b, x) + S), (b = x + y.length));
        }
        return g + a.slice(b);
      },
    ];
    function r(t, i, r, n, s, o) {
      var l = r + t.length,
        c = n.length,
        u = be;
      return (
        void 0 !== s && ((s = a(s)), (u = ge)),
        e.call(o, u, function (e, o) {
          var a;
          switch (o.charAt(0)) {
            case '$':
              return '$';
            case '&':
              return t;
            case '`':
              return i.slice(0, r);
            case "'":
              return i.slice(l);
            case '<':
              a = s[o.slice(1, -1)];
              break;
            default:
              var u = +o;
              if (0 === u) return e;
              if (u > c) {
                var h = ve(u / 10);
                return 0 === h ? e : h <= c ? (void 0 === n[h - 1] ? o.charAt(1) : n[h - 1] + o.charAt(1)) : e;
              }
              a = n[u - 1];
          }
          return void 0 === a ? '' : a;
        })
      );
    }
  });
  for (var me in {
    CSSRuleList: 0,
    CSSStyleDeclaration: 0,
    CSSValueList: 0,
    ClientRectList: 0,
    DOMRectList: 0,
    DOMStringList: 0,
    DOMTokenList: 1,
    DataTransferItemList: 0,
    FileList: 0,
    HTMLAllCollection: 0,
    HTMLCollection: 0,
    HTMLFormElement: 0,
    HTMLSelectElement: 0,
    MediaList: 0,
    MimeTypeArray: 0,
    NamedNodeMap: 0,
    NodeList: 1,
    PaintRequestList: 0,
    Plugin: 0,
    PluginArray: 0,
    SVGLengthList: 0,
    SVGNumberList: 0,
    SVGPathSegList: 0,
    SVGPointList: 0,
    SVGStringList: 0,
    SVGTransformList: 0,
    SourceBufferList: 0,
    StyleSheetList: 0,
    TextTrackCueList: 0,
    TextTrackList: 0,
    TouchList: 0,
  }) {
    var ye = E[me],
      xe = ye && ye.prototype;
    if (xe && xe.forEach !== Vt)
      try {
        T(xe, 'forEach', Vt);
      } catch (t) {
        xe.forEach = Vt;
      }
  }
  var Ee = 'Expected a function',
    we = NaN,
    Oe = '[object Symbol]',
    _e = /^\s+|\s+$/g,
    Se = /^[-+]0x[0-9a-f]+$/i,
    Le = /^0b[01]+$/i,
    Ae = /^0o[0-7]+$/i,
    ke = parseInt,
    Me = 'object' == typeof v && v && v.Object === Object && v,
    We = 'object' == typeof self && self && self.Object === Object && self,
    Te = Me || We || Function('return this')(),
    Re = Object.prototype.toString,
    je = Math.max,
    Ce = Math.min,
    Ne = function () {
      return Te.Date.now();
    };
  function ze(t, e, i) {
    var r,
      n,
      s,
      o,
      a,
      l,
      c = 0,
      u = !1,
      h = !1,
      f = !0;
    if ('function' != typeof t) throw new TypeError(Ee);
    function d(e) {
      var i = r,
        s = n;
      return (r = n = void 0), (c = e), (o = t.apply(s, i));
    }
    function p(t) {
      var i = t - l;
      return void 0 === l || i >= e || i < 0 || (h && t - c >= s);
    }
    function v() {
      var t = Ne();
      if (p(t)) return g(t);
      a = setTimeout(
        v,
        (function (t) {
          var i = e - (t - l);
          return h ? Ce(i, s - (t - c)) : i;
        })(t)
      );
    }
    function g(t) {
      return (a = void 0), f && r ? d(t) : ((r = n = void 0), o);
    }
    function b() {
      var t = Ne(),
        i = p(t);
      if (((r = arguments), (n = this), (l = t), i)) {
        if (void 0 === a)
          return (function (t) {
            return (c = t), (a = setTimeout(v, e)), u ? d(t) : o;
          })(l);
        if (h) return (a = setTimeout(v, e)), d(l);
      }
      return void 0 === a && (a = setTimeout(v, e)), o;
    }
    return (
      (e = Ve(e) || 0),
      De(i) && ((u = !!i.leading), (s = (h = 'maxWait' in i) ? je(Ve(i.maxWait) || 0, e) : s), (f = 'trailing' in i ? !!i.trailing : f)),
      (b.cancel = function () {
        void 0 !== a && clearTimeout(a), (c = 0), (r = l = n = a = void 0);
      }),
      (b.flush = function () {
        return void 0 === a ? o : g(Ne());
      }),
      b
    );
  }
  function De(t) {
    var e = typeof t;
    return !!t && ('object' == e || 'function' == e);
  }
  function Ve(t) {
    if ('number' == typeof t) return t;
    if (
      (function (t) {
        return (
          'symbol' == typeof t ||
          ((function (t) {
            return !!t && 'object' == typeof t;
          })(t) &&
            Re.call(t) == Oe)
        );
      })(t)
    )
      return we;
    if (De(t)) {
      var e = 'function' == typeof t.valueOf ? t.valueOf() : t;
      t = De(e) ? e + '' : e;
    }
    if ('string' != typeof t) return 0 === t ? t : +t;
    t = t.replace(_e, '');
    var i = Le.test(t);
    return i || Ae.test(t) ? ke(t.slice(2), i ? 2 : 8) : Se.test(t) ? we : +t;
  }
  var Be = function (t, e, i) {
      var r = !0,
        n = !0;
      if ('function' != typeof t) throw new TypeError(Ee);
      return (
        De(i) && ((r = 'leading' in i ? !!i.leading : r), (n = 'trailing' in i ? !!i.trailing : n)),
        ze(t, e, { leading: r, maxWait: e, trailing: n })
      );
    },
    Ie = 'Expected a function',
    Pe = NaN,
    He = '[object Symbol]',
    qe = /^\s+|\s+$/g,
    Fe = /^[-+]0x[0-9a-f]+$/i,
    $e = /^0b[01]+$/i,
    Ye = /^0o[0-7]+$/i,
    Xe = parseInt,
    Ge = 'object' == typeof v && v && v.Object === Object && v,
    Ke = 'object' == typeof self && self && self.Object === Object && self,
    Ue = Ge || Ke || Function('return this')(),
    Je = Object.prototype.toString,
    Qe = Math.max,
    Ze = Math.min,
    ti = function () {
      return Ue.Date.now();
    };
  function ei(t) {
    var e = typeof t;
    return !!t && ('object' == e || 'function' == e);
  }
  function ii(t) {
    if ('number' == typeof t) return t;
    if (
      (function (t) {
        return (
          'symbol' == typeof t ||
          ((function (t) {
            return !!t && 'object' == typeof t;
          })(t) &&
            Je.call(t) == He)
        );
      })(t)
    )
      return Pe;
    if (ei(t)) {
      var e = 'function' == typeof t.valueOf ? t.valueOf() : t;
      t = ei(e) ? e + '' : e;
    }
    if ('string' != typeof t) return 0 === t ? t : +t;
    t = t.replace(qe, '');
    var i = $e.test(t);
    return i || Ye.test(t) ? Xe(t.slice(2), i ? 2 : 8) : Fe.test(t) ? Pe : +t;
  }
  var ri = function (t, e, i) {
      var r,
        n,
        s,
        o,
        a,
        l,
        c = 0,
        u = !1,
        h = !1,
        f = !0;
      if ('function' != typeof t) throw new TypeError(Ie);
      function d(e) {
        var i = r,
          s = n;
        return (r = n = void 0), (c = e), (o = t.apply(s, i));
      }
      function p(t) {
        var i = t - l;
        return void 0 === l || i >= e || i < 0 || (h && t - c >= s);
      }
      function v() {
        var t = ti();
        if (p(t)) return g(t);
        a = setTimeout(
          v,
          (function (t) {
            var i = e - (t - l);
            return h ? Ze(i, s - (t - c)) : i;
          })(t)
        );
      }
      function g(t) {
        return (a = void 0), f && r ? d(t) : ((r = n = void 0), o);
      }
      function b() {
        var t = ti(),
          i = p(t);
        if (((r = arguments), (n = this), (l = t), i)) {
          if (void 0 === a)
            return (function (t) {
              return (c = t), (a = setTimeout(v, e)), u ? d(t) : o;
            })(l);
          if (h) return (a = setTimeout(v, e)), d(l);
        }
        return void 0 === a && (a = setTimeout(v, e)), o;
      }
      return (
        (e = ii(e) || 0),
        ei(i) && ((u = !!i.leading), (s = (h = 'maxWait' in i) ? Qe(ii(i.maxWait) || 0, e) : s), (f = 'trailing' in i ? !!i.trailing : f)),
        (b.cancel = function () {
          void 0 !== a && clearTimeout(a), (c = 0), (r = l = n = a = void 0);
        }),
        (b.flush = function () {
          return void 0 === a ? o : g(ti());
        }),
        b
      );
    },
    ni = 'Expected a function',
    si = '__lodash_hash_undefined__',
    oi = '[object Function]',
    ai = '[object GeneratorFunction]',
    li = /^\[object .+?Constructor\]$/,
    ci = 'object' == typeof v && v && v.Object === Object && v,
    ui = 'object' == typeof self && self && self.Object === Object && self,
    hi = ci || ui || Function('return this')();
  var fi = Array.prototype,
    di = Function.prototype,
    pi = Object.prototype,
    vi = hi['__core-js_shared__'],
    gi = (function () {
      var t = /[^.]+$/.exec((vi && vi.keys && vi.keys.IE_PROTO) || '');
      return t ? 'Symbol(src)_1.' + t : '';
    })(),
    bi = di.toString,
    mi = pi.hasOwnProperty,
    yi = pi.toString,
    xi = RegExp(
      '^' +
        bi
          .call(mi)
          .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
          .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
        '$'
    ),
    Ei = fi.splice,
    wi = Wi(hi, 'Map'),
    Oi = Wi(Object, 'create');
  function _i(t) {
    var e = -1,
      i = t ? t.length : 0;
    for (this.clear(); ++e < i; ) {
      var r = t[e];
      this.set(r[0], r[1]);
    }
  }
  function Si(t) {
    var e = -1,
      i = t ? t.length : 0;
    for (this.clear(); ++e < i; ) {
      var r = t[e];
      this.set(r[0], r[1]);
    }
  }
  function Li(t) {
    var e = -1,
      i = t ? t.length : 0;
    for (this.clear(); ++e < i; ) {
      var r = t[e];
      this.set(r[0], r[1]);
    }
  }
  function Ai(t, e) {
    for (var i, r, n = t.length; n--; ) if ((i = t[n][0]) === (r = e) || (i != i && r != r)) return n;
    return -1;
  }
  function ki(t) {
    return (
      !(!Ri(t) || ((e = t), gi && gi in e)) &&
      ((function (t) {
        var e = Ri(t) ? yi.call(t) : '';
        return e == oi || e == ai;
      })(t) ||
      (function (t) {
        var e = !1;
        if (null != t && 'function' != typeof t.toString)
          try {
            e = !!(t + '');
          } catch (t) {}
        return e;
      })(t)
        ? xi
        : li
      ).test(
        (function (t) {
          if (null != t) {
            try {
              return bi.call(t);
            } catch (t) {}
            try {
              return t + '';
            } catch (t) {}
          }
          return '';
        })(t)
      )
    );
    var e;
  }
  function Mi(t, e) {
    var i,
      r,
      n = t.__data__;
    return ('string' == (r = typeof (i = e)) || 'number' == r || 'symbol' == r || 'boolean' == r ? '__proto__' !== i : null === i)
      ? n['string' == typeof e ? 'string' : 'hash']
      : n.map;
  }
  function Wi(t, e) {
    var i = (function (t, e) {
      return null == t ? void 0 : t[e];
    })(t, e);
    return ki(i) ? i : void 0;
  }
  function Ti(t, e) {
    if ('function' != typeof t || (e && 'function' != typeof e)) throw new TypeError(ni);
    var i = function () {
      var r = arguments,
        n = e ? e.apply(this, r) : r[0],
        s = i.cache;
      if (s.has(n)) return s.get(n);
      var o = t.apply(this, r);
      return (i.cache = s.set(n, o)), o;
    };
    return (i.cache = new (Ti.Cache || Li)()), i;
  }
  function Ri(t) {
    var e = typeof t;
    return !!t && ('object' == e || 'function' == e);
  }
  (_i.prototype.clear = function () {
    this.__data__ = Oi ? Oi(null) : {};
  }),
    (_i.prototype.delete = function (t) {
      return this.has(t) && delete this.__data__[t];
    }),
    (_i.prototype.get = function (t) {
      var e = this.__data__;
      if (Oi) {
        var i = e[t];
        return i === si ? void 0 : i;
      }
      return mi.call(e, t) ? e[t] : void 0;
    }),
    (_i.prototype.has = function (t) {
      var e = this.__data__;
      return Oi ? void 0 !== e[t] : mi.call(e, t);
    }),
    (_i.prototype.set = function (t, e) {
      return (this.__data__[t] = Oi && void 0 === e ? si : e), this;
    }),
    (Si.prototype.clear = function () {
      this.__data__ = [];
    }),
    (Si.prototype.delete = function (t) {
      var e = this.__data__,
        i = Ai(e, t);
      return !(i < 0 || (i == e.length - 1 ? e.pop() : Ei.call(e, i, 1), 0));
    }),
    (Si.prototype.get = function (t) {
      var e = this.__data__,
        i = Ai(e, t);
      return i < 0 ? void 0 : e[i][1];
    }),
    (Si.prototype.has = function (t) {
      return Ai(this.__data__, t) > -1;
    }),
    (Si.prototype.set = function (t, e) {
      var i = this.__data__,
        r = Ai(i, t);
      return r < 0 ? i.push([t, e]) : (i[r][1] = e), this;
    }),
    (Li.prototype.clear = function () {
      this.__data__ = { hash: new _i(), map: new (wi || Si)(), string: new _i() };
    }),
    (Li.prototype.delete = function (t) {
      return Mi(this, t).delete(t);
    }),
    (Li.prototype.get = function (t) {
      return Mi(this, t).get(t);
    }),
    (Li.prototype.has = function (t) {
      return Mi(this, t).has(t);
    }),
    (Li.prototype.set = function (t, e) {
      return Mi(this, t).set(t, e), this;
    }),
    (Ti.Cache = Li);
  var ji = Ti,
    Ci = (function () {
      if ('undefined' != typeof Map) return Map;
      function t(t, e) {
        var i = -1;
        return (
          t.some(function (t, r) {
            return t[0] === e && ((i = r), !0);
          }),
          i
        );
      }
      return (function () {
        function e() {
          this.__entries__ = [];
        }
        return (
          Object.defineProperty(e.prototype, 'size', {
            get: function () {
              return this.__entries__.length;
            },
            enumerable: !0,
            configurable: !0,
          }),
          (e.prototype.get = function (e) {
            var i = t(this.__entries__, e),
              r = this.__entries__[i];
            return r && r[1];
          }),
          (e.prototype.set = function (e, i) {
            var r = t(this.__entries__, e);
            ~r ? (this.__entries__[r][1] = i) : this.__entries__.push([e, i]);
          }),
          (e.prototype.delete = function (e) {
            var i = this.__entries__,
              r = t(i, e);
            ~r && i.splice(r, 1);
          }),
          (e.prototype.has = function (e) {
            return !!~t(this.__entries__, e);
          }),
          (e.prototype.clear = function () {
            this.__entries__.splice(0);
          }),
          (e.prototype.forEach = function (t, e) {
            void 0 === e && (e = null);
            for (var i = 0, r = this.__entries__; i < r.length; i++) {
              var n = r[i];
              t.call(e, n[1], n[0]);
            }
          }),
          e
        );
      })();
    })(),
    Ni = 'undefined' != typeof window && 'undefined' != typeof document && window.document === document,
    zi =
      'undefined' != typeof global && global.Math === Math
        ? global
        : 'undefined' != typeof self && self.Math === Math
        ? self
        : 'undefined' != typeof window && window.Math === Math
        ? window
        : Function('return this')(),
    Di =
      'function' == typeof requestAnimationFrame
        ? requestAnimationFrame.bind(zi)
        : function (t) {
            return setTimeout(function () {
              return t(Date.now());
            }, 1e3 / 60);
          },
    Vi = 2;
  var Bi = 20,
    Ii = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'],
    Pi = 'undefined' != typeof MutationObserver,
    Hi = (function () {
      function t() {
        (this.connected_ = !1),
          (this.mutationEventsAdded_ = !1),
          (this.mutationsObserver_ = null),
          (this.observers_ = []),
          (this.onTransitionEnd_ = this.onTransitionEnd_.bind(this)),
          (this.refresh = (function (t, e) {
            var i = !1,
              r = !1,
              n = 0;
            function s() {
              i && ((i = !1), t()), r && a();
            }
            function o() {
              Di(s);
            }
            function a() {
              var t = Date.now();
              if (i) {
                if (t - n < Vi) return;
                r = !0;
              } else (i = !0), (r = !1), setTimeout(o, e);
              n = t;
            }
            return a;
          })(this.refresh.bind(this), Bi));
      }
      return (
        (t.prototype.addObserver = function (t) {
          ~this.observers_.indexOf(t) || this.observers_.push(t), this.connected_ || this.connect_();
        }),
        (t.prototype.removeObserver = function (t) {
          var e = this.observers_,
            i = e.indexOf(t);
          ~i && e.splice(i, 1), !e.length && this.connected_ && this.disconnect_();
        }),
        (t.prototype.refresh = function () {
          this.updateObservers_() && this.refresh();
        }),
        (t.prototype.updateObservers_ = function () {
          var t = this.observers_.filter(function (t) {
            return t.gatherActive(), t.hasActive();
          });
          return (
            t.forEach(function (t) {
              return t.broadcastActive();
            }),
            t.length > 0
          );
        }),
        (t.prototype.connect_ = function () {
          Ni &&
            !this.connected_ &&
            (document.addEventListener('transitionend', this.onTransitionEnd_),
            window.addEventListener('resize', this.refresh),
            Pi
              ? ((this.mutationsObserver_ = new MutationObserver(this.refresh)),
                this.mutationsObserver_.observe(document, { attributes: !0, childList: !0, characterData: !0, subtree: !0 }))
              : (document.addEventListener('DOMSubtreeModified', this.refresh), (this.mutationEventsAdded_ = !0)),
            (this.connected_ = !0));
        }),
        (t.prototype.disconnect_ = function () {
          Ni &&
            this.connected_ &&
            (document.removeEventListener('transitionend', this.onTransitionEnd_),
            window.removeEventListener('resize', this.refresh),
            this.mutationsObserver_ && this.mutationsObserver_.disconnect(),
            this.mutationEventsAdded_ && document.removeEventListener('DOMSubtreeModified', this.refresh),
            (this.mutationsObserver_ = null),
            (this.mutationEventsAdded_ = !1),
            (this.connected_ = !1));
        }),
        (t.prototype.onTransitionEnd_ = function (t) {
          var e = t.propertyName,
            i = void 0 === e ? '' : e;
          Ii.some(function (t) {
            return !!~i.indexOf(t);
          }) && this.refresh();
        }),
        (t.getInstance = function () {
          return this.instance_ || (this.instance_ = new t()), this.instance_;
        }),
        (t.instance_ = null),
        t
      );
    })(),
    qi = function (t, e) {
      for (var i = 0, r = Object.keys(e); i < r.length; i++) {
        var n = r[i];
        Object.defineProperty(t, n, { value: e[n], enumerable: !1, writable: !1, configurable: !0 });
      }
      return t;
    },
    Fi = function (t) {
      return (t && t.ownerDocument && t.ownerDocument.defaultView) || zi;
    },
    $i = Ji(0, 0, 0, 0);
  function Yi(t) {
    return parseFloat(t) || 0;
  }
  function Xi(t) {
    for (var e = [], i = 1; i < arguments.length; i++) e[i - 1] = arguments[i];
    return e.reduce(function (e, i) {
      return e + Yi(t['border-' + i + '-width']);
    }, 0);
  }
  function Gi(t) {
    var e = t.clientWidth,
      i = t.clientHeight;
    if (!e && !i) return $i;
    var r = Fi(t).getComputedStyle(t),
      n = (function (t) {
        for (var e = {}, i = 0, r = ['top', 'right', 'bottom', 'left']; i < r.length; i++) {
          var n = r[i],
            s = t['padding-' + n];
          e[n] = Yi(s);
        }
        return e;
      })(r),
      s = n.left + n.right,
      o = n.top + n.bottom,
      a = Yi(r.width),
      l = Yi(r.height);
    if (
      ('border-box' === r.boxSizing &&
        (Math.round(a + s) !== e && (a -= Xi(r, 'left', 'right') + s), Math.round(l + o) !== i && (l -= Xi(r, 'top', 'bottom') + o)),
      !(function (t) {
        return t === Fi(t).document.documentElement;
      })(t))
    ) {
      var c = Math.round(a + s) - e,
        u = Math.round(l + o) - i;
      1 !== Math.abs(c) && (a -= c), 1 !== Math.abs(u) && (l -= u);
    }
    return Ji(n.left, n.top, a, l);
  }
  var Ki =
    'undefined' != typeof SVGGraphicsElement
      ? function (t) {
          return t instanceof Fi(t).SVGGraphicsElement;
        }
      : function (t) {
          return t instanceof Fi(t).SVGElement && 'function' == typeof t.getBBox;
        };
  function Ui(t) {
    return Ni
      ? Ki(t)
        ? (function (t) {
            var e = t.getBBox();
            return Ji(0, 0, e.width, e.height);
          })(t)
        : Gi(t)
      : $i;
  }
  function Ji(t, e, i, r) {
    return { x: t, y: e, width: i, height: r };
  }
  var Qi = (function () {
      function t(t) {
        (this.broadcastWidth = 0), (this.broadcastHeight = 0), (this.contentRect_ = Ji(0, 0, 0, 0)), (this.target = t);
      }
      return (
        (t.prototype.isActive = function () {
          var t = Ui(this.target);
          return (this.contentRect_ = t), t.width !== this.broadcastWidth || t.height !== this.broadcastHeight;
        }),
        (t.prototype.broadcastRect = function () {
          var t = this.contentRect_;
          return (this.broadcastWidth = t.width), (this.broadcastHeight = t.height), t;
        }),
        t
      );
    })(),
    Zi = (function () {
      return function (t, e) {
        var i,
          r,
          n,
          s,
          o,
          a,
          l,
          c =
            ((r = (i = e).x),
            (n = i.y),
            (s = i.width),
            (o = i.height),
            (a = 'undefined' != typeof DOMRectReadOnly ? DOMRectReadOnly : Object),
            (l = Object.create(a.prototype)),
            qi(l, { x: r, y: n, width: s, height: o, top: n, right: r + s, bottom: o + n, left: r }),
            l);
        qi(this, { target: t, contentRect: c });
      };
    })(),
    tr = (function () {
      function t(t, e, i) {
        if (((this.activeObservations_ = []), (this.observations_ = new Ci()), 'function' != typeof t))
          throw new TypeError('The callback provided as parameter 1 is not a function.');
        (this.callback_ = t), (this.controller_ = e), (this.callbackCtx_ = i);
      }
      return (
        (t.prototype.observe = function (t) {
          if (!arguments.length) throw new TypeError('1 argument required, but only 0 present.');
          if ('undefined' != typeof Element && Element instanceof Object) {
            if (!(t instanceof Fi(t).Element)) throw new TypeError('parameter 1 is not of type "Element".');
            var e = this.observations_;
            e.has(t) || (e.set(t, new Qi(t)), this.controller_.addObserver(this), this.controller_.refresh());
          }
        }),
        (t.prototype.unobserve = function (t) {
          if (!arguments.length) throw new TypeError('1 argument required, but only 0 present.');
          if ('undefined' != typeof Element && Element instanceof Object) {
            if (!(t instanceof Fi(t).Element)) throw new TypeError('parameter 1 is not of type "Element".');
            var e = this.observations_;
            e.has(t) && (e.delete(t), e.size || this.controller_.removeObserver(this));
          }
        }),
        (t.prototype.disconnect = function () {
          this.clearActive(), this.observations_.clear(), this.controller_.removeObserver(this);
        }),
        (t.prototype.gatherActive = function () {
          var t = this;
          this.clearActive(),
            this.observations_.forEach(function (e) {
              e.isActive() && t.activeObservations_.push(e);
            });
        }),
        (t.prototype.broadcastActive = function () {
          if (this.hasActive()) {
            var t = this.callbackCtx_,
              e = this.activeObservations_.map(function (t) {
                return new Zi(t.target, t.broadcastRect());
              });
            this.callback_.call(t, e, t), this.clearActive();
          }
        }),
        (t.prototype.clearActive = function () {
          this.activeObservations_.splice(0);
        }),
        (t.prototype.hasActive = function () {
          return this.activeObservations_.length > 0;
        }),
        t
      );
    })(),
    er = 'undefined' != typeof WeakMap ? new WeakMap() : new Ci(),
    ir = (function () {
      return function t(e) {
        if (!(this instanceof t)) throw new TypeError('Cannot call a class as a function.');
        if (!arguments.length) throw new TypeError('1 argument required, but only 0 present.');
        var i = Hi.getInstance(),
          r = new tr(e, i, this);
        er.set(this, r);
      };
    })();
  ['observe', 'unobserve', 'disconnect'].forEach(function (t) {
    ir.prototype[t] = function () {
      var e;
      return (e = er.get(this))[t].apply(e, arguments);
    };
  });
  var rr = void 0 !== zi.ResizeObserver ? zi.ResizeObserver : ir,
    nr = !('undefined' == typeof window || !window.document || !window.document.createElement);
  function sr() {
    if ('undefined' == typeof document) return 0;
    var t = document.body,
      e = document.createElement('div'),
      i = e.style;
    (i.position = 'fixed'), (i.left = 0), (i.visibility = 'hidden'), (i.overflowY = 'scroll'), t.appendChild(e);
    var r = e.getBoundingClientRect().right;
    return t.removeChild(e), r;
  }
  var or = (function () {
    function t(e, i) {
      var r = this;
      (this.onScroll = function () {
        r.scrollXTicking || (window.requestAnimationFrame(r.scrollX), (r.scrollXTicking = !0)),
          r.scrollYTicking || (window.requestAnimationFrame(r.scrollY), (r.scrollYTicking = !0));
      }),
        (this.scrollX = function () {
          r.axis.x.isOverflowing && (r.showScrollbar('x'), r.positionScrollbar('x')), (r.scrollXTicking = !1);
        }),
        (this.scrollY = function () {
          r.axis.y.isOverflowing && (r.showScrollbar('y'), r.positionScrollbar('y')), (r.scrollYTicking = !1);
        }),
        (this.onMouseEnter = function () {
          r.showScrollbar('x'), r.showScrollbar('y');
        }),
        (this.onMouseMove = function (t) {
          (r.mouseX = t.clientX),
            (r.mouseY = t.clientY),
            (r.axis.x.isOverflowing || r.axis.x.forceVisible) && r.onMouseMoveForAxis('x'),
            (r.axis.y.isOverflowing || r.axis.y.forceVisible) && r.onMouseMoveForAxis('y');
        }),
        (this.onMouseLeave = function () {
          r.onMouseMove.cancel(),
            (r.axis.x.isOverflowing || r.axis.x.forceVisible) && r.onMouseLeaveForAxis('x'),
            (r.axis.y.isOverflowing || r.axis.y.forceVisible) && r.onMouseLeaveForAxis('y'),
            (r.mouseX = -1),
            (r.mouseY = -1);
        }),
        (this.onWindowResize = function () {
          (r.scrollbarWidth = sr()), r.hideNativeScrollbar();
        }),
        (this.hideScrollbars = function () {
          (r.axis.x.track.rect = r.axis.x.track.el.getBoundingClientRect()),
            (r.axis.y.track.rect = r.axis.y.track.el.getBoundingClientRect()),
            r.isWithinBounds(r.axis.y.track.rect) ||
              (r.axis.y.scrollbar.el.classList.remove(r.classNames.visible), (r.axis.y.isVisible = !1)),
            r.isWithinBounds(r.axis.x.track.rect) ||
              (r.axis.x.scrollbar.el.classList.remove(r.classNames.visible), (r.axis.x.isVisible = !1));
        }),
        (this.onPointerEvent = function (t) {
          var e, i;
          (r.axis.x.scrollbar.rect = r.axis.x.scrollbar.el.getBoundingClientRect()),
            (r.axis.y.scrollbar.rect = r.axis.y.scrollbar.el.getBoundingClientRect()),
            (r.axis.x.isOverflowing || r.axis.x.forceVisible) && (i = r.isWithinBounds(r.axis.x.scrollbar.rect)),
            (r.axis.y.isOverflowing || r.axis.y.forceVisible) && (e = r.isWithinBounds(r.axis.y.scrollbar.rect)),
            (e || i) &&
              (t.preventDefault(), t.stopPropagation(), 'mousedown' === t.type && (e && r.onDragStart(t, 'y'), i && r.onDragStart(t, 'x')));
        }),
        (this.drag = function (e) {
          var i = r.axis[r.draggedAxis].track,
            n = i.rect[r.axis[r.draggedAxis].sizeAttr],
            s = r.axis[r.draggedAxis].scrollbar;
          e.preventDefault(), e.stopPropagation();
          var o =
            ((('y' === r.draggedAxis ? e.pageY : e.pageX) - i.rect[r.axis[r.draggedAxis].offsetAttr] - r.axis[r.draggedAxis].dragOffset) /
              i.rect[r.axis[r.draggedAxis].sizeAttr]) *
            r.contentWrapperEl[r.axis[r.draggedAxis].scrollSizeAttr];
          'x' === r.draggedAxis &&
            ((o = r.isRtl && t.getRtlHelpers().isRtlScrollbarInverted ? o - (n + s.size) : o),
            (o = r.isRtl && t.getRtlHelpers().isRtlScrollingInverted ? -o : o)),
            (r.contentWrapperEl[r.axis[r.draggedAxis].scrollOffsetAttr] = o);
        }),
        (this.onEndDrag = function (t) {
          t.preventDefault(),
            t.stopPropagation(),
            r.el.classList.remove(r.classNames.dragging),
            document.removeEventListener('mousemove', r.drag, !0),
            document.removeEventListener('mouseup', r.onEndDrag, !0),
            (r.removePreventClickId = window.setTimeout(function () {
              document.removeEventListener('click', r.preventClick, !0),
                document.removeEventListener('dblclick', r.preventClick, !0),
                (r.removePreventClickId = null);
            }));
        }),
        (this.preventClick = function (t) {
          t.preventDefault(), t.stopPropagation();
        }),
        (this.el = e),
        this.flashTimeout,
        this.contentEl,
        this.contentWrapperEl,
        this.offsetEl,
        this.maskEl,
        this.globalObserver,
        this.mutationObserver,
        this.resizeObserver,
        this.scrollbarWidth,
        (this.minScrollbarWidth = 20),
        (this.options = Object.assign({}, t.defaultOptions, i)),
        (this.classNames = Object.assign({}, t.defaultOptions.classNames, this.options.classNames)),
        this.isRtl,
        (this.axis = {
          x: {
            scrollOffsetAttr: 'scrollLeft',
            sizeAttr: 'width',
            scrollSizeAttr: 'scrollWidth',
            offsetAttr: 'left',
            overflowAttr: 'overflowX',
            dragOffset: 0,
            isOverflowing: !0,
            isVisible: !1,
            forceVisible: !1,
            track: {},
            scrollbar: {},
          },
          y: {
            scrollOffsetAttr: 'scrollTop',
            sizeAttr: 'height',
            scrollSizeAttr: 'scrollHeight',
            offsetAttr: 'top',
            overflowAttr: 'overflowY',
            dragOffset: 0,
            isOverflowing: !0,
            isVisible: !1,
            forceVisible: !1,
            track: {},
            scrollbar: {},
          },
        }),
        (this.removePreventClickId = null),
        this.el.SimpleBar ||
          ((this.recalculate = Be(this.recalculate.bind(this), 64)),
          (this.onMouseMove = Be(this.onMouseMove.bind(this), 64)),
          (this.hideScrollbars = ri(this.hideScrollbars.bind(this), this.options.timeout)),
          (this.onWindowResize = ri(this.onWindowResize.bind(this), 64, { leading: !0 })),
          (t.getRtlHelpers = ji(t.getRtlHelpers)),
          this.init());
    }
    (t.getRtlHelpers = function () {
      var e = document.createElement('div');
      e.innerHTML = '<div class="hs-dummy-scrollbar-size"><div style="height: 200%; width: 200%; margin: 10px 0;"></div></div>';
      var i = e.firstElementChild;
      document.body.appendChild(i);
      var r = i.firstElementChild;
      i.scrollLeft = 0;
      var n = t.getOffset(i),
        s = t.getOffset(r);
      i.scrollLeft = 999;
      var o = t.getOffset(r);
      return { isRtlScrollingInverted: n.left !== s.left && s.left - o.left != 0, isRtlScrollbarInverted: n.left !== s.left };
    }),
      (t.initHtmlApi = function () {
        (this.initDOMLoadedElements = this.initDOMLoadedElements.bind(this)),
          'undefined' != typeof MutationObserver &&
            ((this.globalObserver = new MutationObserver(function (e) {
              e.forEach(function (e) {
                Array.prototype.forEach.call(e.addedNodes, function (e) {
                  1 === e.nodeType &&
                    (e.hasAttribute('data-simplebar')
                      ? !e.SimpleBar && new t(e, t.getElOptions(e))
                      : Array.prototype.forEach.call(e.querySelectorAll('[data-simplebar]'), function (e) {
                          !e.SimpleBar && new t(e, t.getElOptions(e));
                        }));
                }),
                  Array.prototype.forEach.call(e.removedNodes, function (t) {
                    1 === t.nodeType &&
                      (t.hasAttribute('data-simplebar')
                        ? t.SimpleBar && t.SimpleBar.unMount()
                        : Array.prototype.forEach.call(t.querySelectorAll('[data-simplebar]'), function (t) {
                            t.SimpleBar && t.SimpleBar.unMount();
                          }));
                  });
              });
            })),
            this.globalObserver.observe(document, { childList: !0, subtree: !0 })),
          'complete' === document.readyState || ('loading' !== document.readyState && !document.documentElement.doScroll)
            ? window.setTimeout(this.initDOMLoadedElements)
            : (document.addEventListener('DOMContentLoaded', this.initDOMLoadedElements),
              window.addEventListener('load', this.initDOMLoadedElements));
      }),
      (t.getElOptions = function (t) {
        return Array.prototype.reduce.call(
          t.attributes,
          function (t, e) {
            var i = e.name.match(/data-simplebar-(.+)/);
            if (i) {
              var r = i[1].replace(/\W+(.)/g, function (t, e) {
                return e.toUpperCase();
              });
              switch (e.value) {
                case 'true':
                  t[r] = !0;
                  break;
                case 'false':
                  t[r] = !1;
                  break;
                case void 0:
                  t[r] = !0;
                  break;
                default:
                  t[r] = e.value;
              }
            }
            return t;
          },
          {}
        );
      }),
      (t.removeObserver = function () {
        this.globalObserver.disconnect();
      }),
      (t.initDOMLoadedElements = function () {
        document.removeEventListener('DOMContentLoaded', this.initDOMLoadedElements),
          window.removeEventListener('load', this.initDOMLoadedElements),
          Array.prototype.forEach.call(document.querySelectorAll('[data-simplebar]'), function (e) {
            e.SimpleBar || new t(e, t.getElOptions(e));
          });
      }),
      (t.getOffset = function (t) {
        var e = t.getBoundingClientRect();
        return {
          top: e.top + (window.pageYOffset || document.documentElement.scrollTop),
          left: e.left + (window.pageXOffset || document.documentElement.scrollLeft),
        };
      });
    var e = t.prototype;
    return (
      (e.init = function () {
        (this.el.SimpleBar = this), nr && (this.initDOM(), (this.scrollbarWidth = sr()), this.recalculate(), this.initListeners());
      }),
      (e.initDOM = function () {
        var t = this;
        if (
          Array.prototype.filter.call(this.el.children, function (e) {
            return e.classList.contains(t.classNames.wrapper);
          }).length
        )
          (this.wrapperEl = this.el.querySelector('.' + this.classNames.wrapper)),
            (this.contentWrapperEl = this.el.querySelector('.' + this.classNames.contentWrapper)),
            (this.offsetEl = this.el.querySelector('.' + this.classNames.offset)),
            (this.maskEl = this.el.querySelector('.' + this.classNames.mask)),
            (this.contentEl = this.el.querySelector('.' + this.classNames.contentEl)),
            (this.placeholderEl = this.el.querySelector('.' + this.classNames.placeholder)),
            (this.heightAutoObserverWrapperEl = this.el.querySelector('.' + this.classNames.heightAutoObserverWrapperEl)),
            (this.heightAutoObserverEl = this.el.querySelector('.' + this.classNames.heightAutoObserverEl)),
            (this.axis.x.track.el = this.el.querySelector('.' + this.classNames.track + '.' + this.classNames.horizontal)),
            (this.axis.y.track.el = this.el.querySelector('.' + this.classNames.track + '.' + this.classNames.vertical));
        else {
          for (
            this.wrapperEl = document.createElement('div'),
              this.contentWrapperEl = document.createElement('div'),
              this.offsetEl = document.createElement('div'),
              this.maskEl = document.createElement('div'),
              this.contentEl = document.createElement('div'),
              this.placeholderEl = document.createElement('div'),
              this.heightAutoObserverWrapperEl = document.createElement('div'),
              this.heightAutoObserverEl = document.createElement('div'),
              this.wrapperEl.classList.add(this.classNames.wrapper),
              this.contentWrapperEl.classList.add(this.classNames.contentWrapper),
              this.offsetEl.classList.add(this.classNames.offset),
              this.maskEl.classList.add(this.classNames.mask),
              this.contentEl.classList.add(this.classNames.contentEl),
              this.placeholderEl.classList.add(this.classNames.placeholder),
              this.heightAutoObserverWrapperEl.classList.add(this.classNames.heightAutoObserverWrapperEl),
              this.heightAutoObserverEl.classList.add(this.classNames.heightAutoObserverEl);
            this.el.firstChild;

          )
            this.contentEl.appendChild(this.el.firstChild);
          this.contentWrapperEl.appendChild(this.contentEl),
            this.offsetEl.appendChild(this.contentWrapperEl),
            this.maskEl.appendChild(this.offsetEl),
            this.heightAutoObserverWrapperEl.appendChild(this.heightAutoObserverEl),
            this.wrapperEl.appendChild(this.heightAutoObserverWrapperEl),
            this.wrapperEl.appendChild(this.maskEl),
            this.wrapperEl.appendChild(this.placeholderEl),
            this.el.appendChild(this.wrapperEl);
        }
        if (!this.axis.x.track.el || !this.axis.y.track.el) {
          var e = document.createElement('div'),
            i = document.createElement('div');
          e.classList.add(this.classNames.track),
            i.classList.add(this.classNames.scrollbar),
            e.appendChild(i),
            (this.axis.x.track.el = e.cloneNode(!0)),
            this.axis.x.track.el.classList.add(this.classNames.horizontal),
            (this.axis.y.track.el = e.cloneNode(!0)),
            this.axis.y.track.el.classList.add(this.classNames.vertical),
            this.el.appendChild(this.axis.x.track.el),
            this.el.appendChild(this.axis.y.track.el);
        }
        (this.axis.x.scrollbar.el = this.axis.x.track.el.querySelector('.' + this.classNames.scrollbar)),
          (this.axis.y.scrollbar.el = this.axis.y.track.el.querySelector('.' + this.classNames.scrollbar)),
          this.options.autoHide ||
            (this.axis.x.scrollbar.el.classList.add(this.classNames.visible),
            this.axis.y.scrollbar.el.classList.add(this.classNames.visible)),
          this.el.setAttribute('data-simplebar', 'init');
      }),
      (e.initListeners = function () {
        var t = this;
        this.options.autoHide && this.el.addEventListener('mouseenter', this.onMouseEnter),
          ['mousedown', 'click', 'dblclick', 'touchstart', 'touchend', 'touchmove'].forEach(function (e) {
            t.el.addEventListener(e, t.onPointerEvent, !0);
          }),
          this.el.addEventListener('mousemove', this.onMouseMove),
          this.el.addEventListener('mouseleave', this.onMouseLeave),
          this.contentWrapperEl.addEventListener('scroll', this.onScroll),
          window.addEventListener('resize', this.onWindowResize),
          (this.resizeObserver = new rr(this.recalculate)),
          this.resizeObserver.observe(this.el),
          this.resizeObserver.observe(this.contentEl);
      }),
      (e.recalculate = function () {
        var t = this.heightAutoObserverEl.offsetHeight <= 1,
          e = this.heightAutoObserverEl.offsetWidth <= 1;
        (this.elStyles = window.getComputedStyle(this.el)),
          (this.isRtl = 'rtl' === this.elStyles.direction),
          (this.contentEl.style.padding =
            this.elStyles.paddingTop +
            ' ' +
            this.elStyles.paddingRight +
            ' ' +
            this.elStyles.paddingBottom +
            ' ' +
            this.elStyles.paddingLeft),
          (this.wrapperEl.style.margin =
            '-' +
            this.elStyles.paddingTop +
            ' -' +
            this.elStyles.paddingRight +
            ' -' +
            this.elStyles.paddingBottom +
            ' -' +
            this.elStyles.paddingLeft),
          (this.contentWrapperEl.style.height = t ? 'auto' : '100%'),
          (this.placeholderEl.style.width = e ? this.contentEl.offsetWidth + 'px' : 'auto'),
          (this.placeholderEl.style.height = this.contentEl.scrollHeight + 'px'),
          (this.axis.x.isOverflowing = this.contentWrapperEl.scrollWidth > this.contentWrapperEl.offsetWidth),
          (this.axis.y.isOverflowing = this.contentWrapperEl.scrollHeight > this.contentWrapperEl.offsetHeight),
          (this.axis.x.isOverflowing = 'hidden' !== this.elStyles.overflowX && this.axis.x.isOverflowing),
          (this.axis.y.isOverflowing = 'hidden' !== this.elStyles.overflowY && this.axis.y.isOverflowing),
          (this.axis.x.forceVisible = 'x' === this.options.forceVisible || !0 === this.options.forceVisible),
          (this.axis.y.forceVisible = 'y' === this.options.forceVisible || !0 === this.options.forceVisible),
          this.hideNativeScrollbar(),
          (this.axis.x.track.rect = this.axis.x.track.el.getBoundingClientRect()),
          (this.axis.y.track.rect = this.axis.y.track.el.getBoundingClientRect()),
          (this.axis.x.scrollbar.size = this.getScrollbarSize('x')),
          (this.axis.y.scrollbar.size = this.getScrollbarSize('y')),
          (this.axis.x.scrollbar.el.style.width = this.axis.x.scrollbar.size + 'px'),
          (this.axis.y.scrollbar.el.style.height = this.axis.y.scrollbar.size + 'px'),
          this.positionScrollbar('x'),
          this.positionScrollbar('y'),
          this.toggleTrackVisibility('x'),
          this.toggleTrackVisibility('y');
      }),
      (e.getScrollbarSize = function (t) {
        void 0 === t && (t = 'y');
        var e,
          i = this.scrollbarWidth
            ? this.contentWrapperEl[this.axis[t].scrollSizeAttr]
            : this.contentWrapperEl[this.axis[t].scrollSizeAttr] - this.minScrollbarWidth,
          r = this.axis[t].track.rect[this.axis[t].sizeAttr];
        if (this.axis[t].isOverflowing) {
          var n = r / i;
          return (
            (e = Math.max(~~(n * r), this.options.scrollbarMinSize)),
            this.options.scrollbarMaxSize && (e = Math.min(e, this.options.scrollbarMaxSize)),
            e
          );
        }
      }),
      (e.positionScrollbar = function (e) {
        void 0 === e && (e = 'y');
        var i = this.contentWrapperEl[this.axis[e].scrollSizeAttr],
          r = this.axis[e].track.rect[this.axis[e].sizeAttr],
          n = parseInt(this.elStyles[this.axis[e].sizeAttr], 10),
          s = this.axis[e].scrollbar,
          o = this.contentWrapperEl[this.axis[e].scrollOffsetAttr],
          a = (o = 'x' === e && this.isRtl && t.getRtlHelpers().isRtlScrollingInverted ? -o : o) / (i - n),
          l = ~~((r - s.size) * a);
        (l = 'x' === e && this.isRtl && t.getRtlHelpers().isRtlScrollbarInverted ? l + (r - s.size) : l),
          (s.el.style.transform = 'x' === e ? 'translate3d(' + l + 'px, 0, 0)' : 'translate3d(0, ' + l + 'px, 0)');
      }),
      (e.toggleTrackVisibility = function (t) {
        void 0 === t && (t = 'y');
        var e = this.axis[t].track.el,
          i = this.axis[t].scrollbar.el;
        this.axis[t].isOverflowing || this.axis[t].forceVisible
          ? ((e.style.visibility = 'visible'), (this.contentWrapperEl.style[this.axis[t].overflowAttr] = 'scroll'))
          : ((e.style.visibility = 'hidden'), (this.contentWrapperEl.style[this.axis[t].overflowAttr] = 'hidden')),
          this.axis[t].isOverflowing ? (i.style.display = 'block') : (i.style.display = 'none');
      }),
      (e.hideNativeScrollbar = function () {
        if (
          ((this.offsetEl.style[this.isRtl ? 'left' : 'right'] =
            this.axis.y.isOverflowing || this.axis.y.forceVisible ? '-' + (this.scrollbarWidth || this.minScrollbarWidth) + 'px' : 0),
          (this.offsetEl.style.bottom =
            this.axis.x.isOverflowing || this.axis.x.forceVisible ? '-' + (this.scrollbarWidth || this.minScrollbarWidth) + 'px' : 0),
          !this.scrollbarWidth)
        ) {
          var t = [this.isRtl ? 'paddingLeft' : 'paddingRight'];
          (this.contentWrapperEl.style[t] = this.axis.y.isOverflowing || this.axis.y.forceVisible ? this.minScrollbarWidth + 'px' : 0),
            (this.contentWrapperEl.style.paddingBottom =
              this.axis.x.isOverflowing || this.axis.x.forceVisible ? this.minScrollbarWidth + 'px' : 0);
        }
      }),
      (e.onMouseMoveForAxis = function (t) {
        void 0 === t && (t = 'y'),
          (this.axis[t].track.rect = this.axis[t].track.el.getBoundingClientRect()),
          (this.axis[t].scrollbar.rect = this.axis[t].scrollbar.el.getBoundingClientRect()),
          this.isWithinBounds(this.axis[t].scrollbar.rect)
            ? this.axis[t].scrollbar.el.classList.add(this.classNames.hover)
            : this.axis[t].scrollbar.el.classList.remove(this.classNames.hover),
          this.isWithinBounds(this.axis[t].track.rect)
            ? (this.showScrollbar(t), this.axis[t].track.el.classList.add(this.classNames.hover))
            : this.axis[t].track.el.classList.remove(this.classNames.hover);
      }),
      (e.onMouseLeaveForAxis = function (t) {
        void 0 === t && (t = 'y'),
          this.axis[t].track.el.classList.remove(this.classNames.hover),
          this.axis[t].scrollbar.el.classList.remove(this.classNames.hover);
      }),
      (e.showScrollbar = function (t) {
        void 0 === t && (t = 'y');
        var e = this.axis[t].scrollbar.el;
        this.axis[t].isVisible || (e.classList.add(this.classNames.visible), (this.axis[t].isVisible = !0)),
          this.options.autoHide && this.hideScrollbars();
      }),
      (e.onDragStart = function (t, e) {
        void 0 === e && (e = 'y');
        var i = this.axis[e].scrollbar.el,
          r = 'y' === e ? t.pageY : t.pageX;
        (this.axis[e].dragOffset = r - i.getBoundingClientRect()[this.axis[e].offsetAttr]),
          (this.draggedAxis = e),
          this.el.classList.add(this.classNames.dragging),
          document.addEventListener('mousemove', this.drag, !0),
          document.addEventListener('mouseup', this.onEndDrag, !0),
          null === this.removePreventClickId
            ? (document.addEventListener('click', this.preventClick, !0), document.addEventListener('dblclick', this.preventClick, !0))
            : (window.clearTimeout(this.removePreventClickId), (this.removePreventClickId = null));
      }),
      (e.getContentElement = function () {
        return this.contentEl;
      }),
      (e.getScrollElement = function () {
        return this.contentWrapperEl;
      }),
      (e.removeListeners = function () {
        var t = this;
        this.options.autoHide && this.el.removeEventListener('mouseenter', this.onMouseEnter),
          ['mousedown', 'click', 'dblclick', 'touchstart', 'touchend', 'touchmove'].forEach(function (e) {
            t.el.removeEventListener(e, t.onPointerEvent);
          }),
          this.el.removeEventListener('mousemove', this.onMouseMove),
          this.el.removeEventListener('mouseleave', this.onMouseLeave),
          this.contentWrapperEl.removeEventListener('scroll', this.onScroll),
          window.removeEventListener('resize', this.onWindowResize),
          this.mutationObserver && this.mutationObserver.disconnect(),
          this.resizeObserver.disconnect(),
          this.recalculate.cancel(),
          this.onMouseMove.cancel(),
          this.hideScrollbars.cancel(),
          this.onWindowResize.cancel();
      }),
      (e.unMount = function () {
        this.removeListeners(), (this.el.SimpleBar = null);
      }),
      (e.isChildNode = function (t) {
        return null !== t && (t === this.el || this.isChildNode(t.parentNode));
      }),
      (e.isWithinBounds = function (t) {
        return this.mouseX >= t.left && this.mouseX <= t.left + t.width && this.mouseY >= t.top && this.mouseY <= t.top + t.height;
      }),
      t
    );
  })();
  return (
    (or.defaultOptions = {
      autoHide: !0,
      forceVisible: !1,
      classNames: {
        contentEl: 'simplebar-content',
        contentWrapper: 'simplebar-content-wrapper',
        offset: 'simplebar-offset',
        mask: 'simplebar-mask',
        wrapper: 'simplebar-wrapper',
        placeholder: 'simplebar-placeholder',
        scrollbar: 'simplebar-scrollbar',
        track: 'simplebar-track',
        heightAutoObserverWrapperEl: 'simplebar-height-auto-observer-wrapper',
        heightAutoObserverEl: 'simplebar-height-auto-observer',
        visible: 'simplebar-visible',
        horizontal: 'simplebar-horizontal',
        vertical: 'simplebar-vertical',
        hover: 'simplebar-hover',
        dragging: 'simplebar-dragging',
      },
      scrollbarMinSize: 25,
      scrollbarMaxSize: 0,
      timeout: 1e3,
    }),
    nr && or.initHtmlApi(),
    or
  );
});

/*! tooltipster v4.2.6 */
!(function (a, b) {
  'function' == typeof define && define.amd
    ? define(['jquery'], function (a) {
        return b(a);
      })
    : 'object' == typeof exports
    ? (module.exports = b(require('jquery')))
    : b(jQuery);
})(this, function (a) {
  function b(a) {
    this.$container, (this.constraints = null), this.__$tooltip, this.__init(a);
  }
  function c(b, c) {
    var d = !0;
    return (
      a.each(b, function (a, e) {
        return void 0 === c[a] || b[a] !== c[a] ? ((d = !1), !1) : void 0;
      }),
      d
    );
  }
  function d(b) {
    var c = b.attr('id'),
      d = c ? h.window.document.getElementById(c) : null;
    return d ? d === b[0] : a.contains(h.window.document.body, b[0]);
  }
  function e() {
    if (!g) return !1;
    var a = g.document.body || g.document.documentElement,
      b = a.style,
      c = 'transition',
      d = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];
    if ('string' == typeof b[c]) return !0;
    c = c.charAt(0).toUpperCase() + c.substr(1);
    for (var e = 0; e < d.length; e++) if ('string' == typeof b[d[e] + c]) return !0;
    return !1;
  }
  var f = {
      animation: 'fade',
      animationDuration: 350,
      content: null,
      contentAsHTML: !1,
      contentCloning: !1,
      debug: !0,
      delay: 300,
      delayTouch: [300, 500],
      functionInit: null,
      functionBefore: null,
      functionReady: null,
      functionAfter: null,
      functionFormat: null,
      IEmin: 6,
      interactive: !1,
      multiple: !1,
      parent: null,
      plugins: ['sideTip'],
      repositionOnScroll: !1,
      restoration: 'none',
      selfDestruction: !0,
      theme: [],
      timer: 0,
      trackerInterval: 500,
      trackOrigin: !1,
      trackTooltip: !1,
      trigger: 'hover',
      triggerClose: { click: !1, mouseleave: !1, originClick: !1, scroll: !1, tap: !1, touchleave: !1 },
      triggerOpen: { click: !1, mouseenter: !1, tap: !1, touchstart: !1 },
      updateAnimation: 'rotate',
      zIndex: 9999999,
    },
    g = 'undefined' != typeof window ? window : null,
    h = {
      hasTouchCapability: !(
        !g || !('ontouchstart' in g || (g.DocumentTouch && g.document instanceof g.DocumentTouch) || g.navigator.maxTouchPoints)
      ),
      hasTransitions: e(),
      IE: !1,
      semVer: '4.2.6',
      window: g,
    },
    i = function () {
      (this.__$emitterPrivate = a({})),
        (this.__$emitterPublic = a({})),
        (this.__instancesLatestArr = []),
        (this.__plugins = {}),
        (this._env = h);
    };
  (i.prototype = {
    __bridge: function (b, c, d) {
      if (!c[d]) {
        var e = function () {};
        e.prototype = b;
        var g = new e();
        g.__init && g.__init(c),
          a.each(b, function (a, b) {
            0 != a.indexOf('__') &&
              (c[a]
                ? f.debug && console.log('The ' + a + ' method of the ' + d + ' plugin conflicts with another plugin or native methods')
                : ((c[a] = function () {
                    return g[a].apply(g, Array.prototype.slice.apply(arguments));
                  }),
                  (c[a].bridged = g)));
          }),
          (c[d] = g);
      }
      return this;
    },
    __setWindow: function (a) {
      return (h.window = a), this;
    },
    _getRuler: function (a) {
      return new b(a);
    },
    _off: function () {
      return this.__$emitterPrivate.off.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)), this;
    },
    _on: function () {
      return this.__$emitterPrivate.on.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)), this;
    },
    _one: function () {
      return this.__$emitterPrivate.one.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)), this;
    },
    _plugin: function (b) {
      var c = this;
      if ('string' == typeof b) {
        var d = b,
          e = null;
        return (
          d.indexOf('.') > 0
            ? (e = c.__plugins[d])
            : a.each(c.__plugins, function (a, b) {
                return b.name.substring(b.name.length - d.length - 1) == '.' + d ? ((e = b), !1) : void 0;
              }),
          e
        );
      }
      if (b.name.indexOf('.') < 0) throw new Error('Plugins must be namespaced');
      return (c.__plugins[b.name] = b), b.core && c.__bridge(b.core, c, b.name), this;
    },
    _trigger: function () {
      var a = Array.prototype.slice.apply(arguments);
      return (
        'string' == typeof a[0] && (a[0] = { type: a[0] }),
        this.__$emitterPrivate.trigger.apply(this.__$emitterPrivate, a),
        this.__$emitterPublic.trigger.apply(this.__$emitterPublic, a),
        this
      );
    },
    instances: function (b) {
      var c = [],
        d = b || '.tooltipstered';
      return (
        a(d).each(function () {
          var b = a(this),
            d = b.data('tooltipster-ns');
          d &&
            a.each(d, function (a, d) {
              c.push(b.data(d));
            });
        }),
        c
      );
    },
    instancesLatest: function () {
      return this.__instancesLatestArr;
    },
    off: function () {
      return this.__$emitterPublic.off.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this;
    },
    on: function () {
      return this.__$emitterPublic.on.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this;
    },
    one: function () {
      return this.__$emitterPublic.one.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this;
    },
    origins: function (b) {
      var c = b ? b + ' ' : '';
      return a(c + '.tooltipstered').toArray();
    },
    setDefaults: function (b) {
      return a.extend(f, b), this;
    },
    triggerHandler: function () {
      return this.__$emitterPublic.triggerHandler.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this;
    },
  }),
    (a.tooltipster = new i()),
    (a.Tooltipster = function (b, c) {
      (this.__callbacks = { close: [], open: [] }),
        this.__closingTime,
        this.__Content,
        this.__contentBcr,
        (this.__destroyed = !1),
        (this.__$emitterPrivate = a({})),
        (this.__$emitterPublic = a({})),
        (this.__enabled = !0),
        this.__garbageCollector,
        this.__Geometry,
        this.__lastPosition,
        (this.__namespace = 'tooltipster-' + Math.round(1e6 * Math.random())),
        this.__options,
        this.__$originParents,
        (this.__pointerIsOverOrigin = !1),
        (this.__previousThemes = []),
        (this.__state = 'closed'),
        (this.__timeouts = { close: [], open: null }),
        (this.__touchEvents = []),
        (this.__tracker = null),
        this._$origin,
        this._$tooltip,
        this.__init(b, c);
    }),
    (a.Tooltipster.prototype = {
      __init: function (b, c) {
        var d = this;
        if (((d._$origin = a(b)), (d.__options = a.extend(!0, {}, f, c)), d.__optionsFormat(), !h.IE || h.IE >= d.__options.IEmin)) {
          var e = null;
          if (
            (void 0 === d._$origin.data('tooltipster-initialTitle') &&
              ((e = d._$origin.attr('title')), void 0 === e && (e = null), d._$origin.data('tooltipster-initialTitle', e)),
            null !== d.__options.content)
          )
            d.__contentSet(d.__options.content);
          else {
            var g,
              i = d._$origin.attr('data-tooltip-content');
            i && (g = a(i)), g && g[0] ? d.__contentSet(g.first()) : d.__contentSet(e);
          }
          d._$origin.removeAttr('title').addClass('tooltipstered'),
            d.__prepareOrigin(),
            d.__prepareGC(),
            a.each(d.__options.plugins, function (a, b) {
              d._plug(b);
            }),
            h.hasTouchCapability &&
              a(h.window.document.body).on('touchmove.' + d.__namespace + '-triggerOpen', function (a) {
                d._touchRecordEvent(a);
              }),
            d
              ._on('created', function () {
                d.__prepareTooltip();
              })
              ._on('repositioned', function (a) {
                d.__lastPosition = a.position;
              });
        } else d.__options.disabled = !0;
      },
      __contentInsert: function () {
        var a = this,
          b = a._$tooltip.find('.tooltipster-content'),
          c = a.__Content,
          d = function (a) {
            c = a;
          };
        return (
          a._trigger({ type: 'format', content: a.__Content, format: d }),
          a.__options.functionFormat && (c = a.__options.functionFormat.call(a, a, { origin: a._$origin[0] }, a.__Content)),
          'string' != typeof c || a.__options.contentAsHTML ? b.empty().append(c) : b.text(c),
          a
        );
      },
      __contentSet: function (b) {
        return (
          b instanceof a && this.__options.contentCloning && (b = b.clone(!0)),
          (this.__Content = b),
          this._trigger({ type: 'updated', content: b }),
          this
        );
      },
      __destroyError: function () {
        throw new Error('This tooltip has been destroyed and cannot execute your method call.');
      },
      __geometry: function () {
        var b = this,
          c = b._$origin,
          d = b._$origin.is('area');
        if (d) {
          var e = b._$origin.parent().attr('name');
          c = a('img[usemap="#' + e + '"]');
        }
        var f = c[0].getBoundingClientRect(),
          g = a(h.window.document),
          i = a(h.window),
          j = c,
          k = {
            available: { document: null, window: null },
            document: { size: { height: g.height(), width: g.width() } },
            window: {
              scroll: {
                left: h.window.scrollX || h.window.document.documentElement.scrollLeft,
                top: h.window.scrollY || h.window.document.documentElement.scrollTop,
              },
              size: { height: i.height(), width: i.width() },
            },
            origin: {
              fixedLineage: !1,
              offset: {},
              size: { height: f.bottom - f.top, width: f.right - f.left },
              usemapImage: d ? c[0] : null,
              windowOffset: { bottom: f.bottom, left: f.left, right: f.right, top: f.top },
            },
          };
        if (d) {
          var l = b._$origin.attr('shape'),
            m = b._$origin.attr('coords');
          if (
            (m &&
              ((m = m.split(',')),
              a.map(m, function (a, b) {
                m[b] = parseInt(a);
              })),
            'default' != l)
          )
            switch (l) {
              case 'circle':
                var n = m[0],
                  o = m[1],
                  p = m[2],
                  q = o - p,
                  r = n - p;
                (k.origin.size.height = 2 * p),
                  (k.origin.size.width = k.origin.size.height),
                  (k.origin.windowOffset.left += r),
                  (k.origin.windowOffset.top += q);
                break;
              case 'rect':
                var s = m[0],
                  t = m[1],
                  u = m[2],
                  v = m[3];
                (k.origin.size.height = v - t),
                  (k.origin.size.width = u - s),
                  (k.origin.windowOffset.left += s),
                  (k.origin.windowOffset.top += t);
                break;
              case 'poly':
                for (var w = 0, x = 0, y = 0, z = 0, A = 'even', B = 0; B < m.length; B++) {
                  var C = m[B];
                  'even' == A
                    ? (C > y && ((y = C), 0 === B && (w = y)), w > C && (w = C), (A = 'odd'))
                    : (C > z && ((z = C), 1 == B && (x = z)), x > C && (x = C), (A = 'even'));
                }
                (k.origin.size.height = z - x),
                  (k.origin.size.width = y - w),
                  (k.origin.windowOffset.left += w),
                  (k.origin.windowOffset.top += x);
            }
        }
        var D = function (a) {
          (k.origin.size.height = a.height),
            (k.origin.windowOffset.left = a.left),
            (k.origin.windowOffset.top = a.top),
            (k.origin.size.width = a.width);
        };
        for (
          b._trigger({
            type: 'geometry',
            edit: D,
            geometry: {
              height: k.origin.size.height,
              left: k.origin.windowOffset.left,
              top: k.origin.windowOffset.top,
              width: k.origin.size.width,
            },
          }),
            k.origin.windowOffset.right = k.origin.windowOffset.left + k.origin.size.width,
            k.origin.windowOffset.bottom = k.origin.windowOffset.top + k.origin.size.height,
            k.origin.offset.left = k.origin.windowOffset.left + k.window.scroll.left,
            k.origin.offset.top = k.origin.windowOffset.top + k.window.scroll.top,
            k.origin.offset.bottom = k.origin.offset.top + k.origin.size.height,
            k.origin.offset.right = k.origin.offset.left + k.origin.size.width,
            k.available.document = {
              bottom: { height: k.document.size.height - k.origin.offset.bottom, width: k.document.size.width },
              left: { height: k.document.size.height, width: k.origin.offset.left },
              right: { height: k.document.size.height, width: k.document.size.width - k.origin.offset.right },
              top: { height: k.origin.offset.top, width: k.document.size.width },
            },
            k.available.window = {
              bottom: { height: Math.max(k.window.size.height - Math.max(k.origin.windowOffset.bottom, 0), 0), width: k.window.size.width },
              left: { height: k.window.size.height, width: Math.max(k.origin.windowOffset.left, 0) },
              right: { height: k.window.size.height, width: Math.max(k.window.size.width - Math.max(k.origin.windowOffset.right, 0), 0) },
              top: { height: Math.max(k.origin.windowOffset.top, 0), width: k.window.size.width },
            };
          'html' != j[0].tagName.toLowerCase();

        ) {
          if ('fixed' == j.css('position')) {
            k.origin.fixedLineage = !0;
            break;
          }
          j = j.parent();
        }
        return k;
      },
      __optionsFormat: function () {
        return (
          'number' == typeof this.__options.animationDuration &&
            (this.__options.animationDuration = [this.__options.animationDuration, this.__options.animationDuration]),
          'number' == typeof this.__options.delay && (this.__options.delay = [this.__options.delay, this.__options.delay]),
          'number' == typeof this.__options.delayTouch &&
            (this.__options.delayTouch = [this.__options.delayTouch, this.__options.delayTouch]),
          'string' == typeof this.__options.theme && (this.__options.theme = [this.__options.theme]),
          null === this.__options.parent
            ? (this.__options.parent = a(h.window.document.body))
            : 'string' == typeof this.__options.parent && (this.__options.parent = a(this.__options.parent)),
          'hover' == this.__options.trigger
            ? ((this.__options.triggerOpen = { mouseenter: !0, touchstart: !0 }),
              (this.__options.triggerClose = { mouseleave: !0, originClick: !0, touchleave: !0 }))
            : 'click' == this.__options.trigger &&
              ((this.__options.triggerOpen = { click: !0, tap: !0 }), (this.__options.triggerClose = { click: !0, tap: !0 })),
          this._trigger('options'),
          this
        );
      },
      __prepareGC: function () {
        var b = this;
        return (
          b.__options.selfDestruction
            ? (b.__garbageCollector = setInterval(function () {
                var c = new Date().getTime();
                (b.__touchEvents = a.grep(b.__touchEvents, function (a, b) {
                  return c - a.time > 6e4;
                })),
                  d(b._$origin) ||
                    b.close(function () {
                      b.destroy();
                    });
              }, 2e4))
            : clearInterval(b.__garbageCollector),
          b
        );
      },
      __prepareOrigin: function () {
        var a = this;
        if (
          (a._$origin.off('.' + a.__namespace + '-triggerOpen'),
          h.hasTouchCapability &&
            a._$origin.on(
              'touchstart.' +
                a.__namespace +
                '-triggerOpen touchend.' +
                a.__namespace +
                '-triggerOpen touchcancel.' +
                a.__namespace +
                '-triggerOpen',
              function (b) {
                a._touchRecordEvent(b);
              }
            ),
          a.__options.triggerOpen.click || (a.__options.triggerOpen.tap && h.hasTouchCapability))
        ) {
          var b = '';
          a.__options.triggerOpen.click && (b += 'click.' + a.__namespace + '-triggerOpen '),
            a.__options.triggerOpen.tap && h.hasTouchCapability && (b += 'touchend.' + a.__namespace + '-triggerOpen'),
            a._$origin.on(b, function (b) {
              a._touchIsMeaningfulEvent(b) && a._open(b);
            });
        }
        if (a.__options.triggerOpen.mouseenter || (a.__options.triggerOpen.touchstart && h.hasTouchCapability)) {
          var b = '';
          a.__options.triggerOpen.mouseenter && (b += 'mouseenter.' + a.__namespace + '-triggerOpen '),
            a.__options.triggerOpen.touchstart && h.hasTouchCapability && (b += 'touchstart.' + a.__namespace + '-triggerOpen'),
            a._$origin.on(b, function (b) {
              (!a._touchIsTouchEvent(b) && a._touchIsEmulatedEvent(b)) || ((a.__pointerIsOverOrigin = !0), a._openShortly(b));
            });
        }
        if (a.__options.triggerClose.mouseleave || (a.__options.triggerClose.touchleave && h.hasTouchCapability)) {
          var b = '';
          a.__options.triggerClose.mouseleave && (b += 'mouseleave.' + a.__namespace + '-triggerOpen '),
            a.__options.triggerClose.touchleave &&
              h.hasTouchCapability &&
              (b += 'touchend.' + a.__namespace + '-triggerOpen touchcancel.' + a.__namespace + '-triggerOpen'),
            a._$origin.on(b, function (b) {
              a._touchIsMeaningfulEvent(b) && (a.__pointerIsOverOrigin = !1);
            });
        }
        return a;
      },
      __prepareTooltip: function () {
        var b = this,
          c = b.__options.interactive ? 'auto' : '';
        return (
          b._$tooltip.attr('id', b.__namespace).css({ 'pointer-events': c, zIndex: b.__options.zIndex }),
          a.each(b.__previousThemes, function (a, c) {
            b._$tooltip.removeClass(c);
          }),
          a.each(b.__options.theme, function (a, c) {
            b._$tooltip.addClass(c);
          }),
          (b.__previousThemes = a.merge([], b.__options.theme)),
          b
        );
      },
      __scrollHandler: function (b) {
        var c = this;
        if (c.__options.triggerClose.scroll) c._close(b);
        else if (d(c._$origin) && d(c._$tooltip)) {
          var e = null;
          if (b.target === h.window.document) c.__Geometry.origin.fixedLineage || (c.__options.repositionOnScroll && c.reposition(b));
          else {
            e = c.__geometry();
            var f = !1;
            if (
              ('fixed' != c._$origin.css('position') &&
                c.__$originParents.each(function (b, c) {
                  var d = a(c),
                    g = d.css('overflow-x'),
                    h = d.css('overflow-y');
                  if ('visible' != g || 'visible' != h) {
                    var i = c.getBoundingClientRect();
                    if ('visible' != g && (e.origin.windowOffset.left < i.left || e.origin.windowOffset.right > i.right))
                      return (f = !0), !1;
                    if ('visible' != h && (e.origin.windowOffset.top < i.top || e.origin.windowOffset.bottom > i.bottom))
                      return (f = !0), !1;
                  }
                  return 'fixed' == d.css('position') ? !1 : void 0;
                }),
              f)
            )
              c._$tooltip.css('visibility', 'hidden');
            else if ((c._$tooltip.css('visibility', 'visible'), c.__options.repositionOnScroll)) c.reposition(b);
            else {
              var g = e.origin.offset.left - c.__Geometry.origin.offset.left,
                i = e.origin.offset.top - c.__Geometry.origin.offset.top;
              c._$tooltip.css({ left: c.__lastPosition.coord.left + g, top: c.__lastPosition.coord.top + i });
            }
          }
          c._trigger({ type: 'scroll', event: b, geo: e });
        }
        return c;
      },
      __stateSet: function (a) {
        return (this.__state = a), this._trigger({ type: 'state', state: a }), this;
      },
      __timeoutsClear: function () {
        return (
          clearTimeout(this.__timeouts.open),
          (this.__timeouts.open = null),
          a.each(this.__timeouts.close, function (a, b) {
            clearTimeout(b);
          }),
          (this.__timeouts.close = []),
          this
        );
      },
      __trackerStart: function () {
        var a = this,
          b = a._$tooltip.find('.tooltipster-content');
        return (
          a.__options.trackTooltip && (a.__contentBcr = b[0].getBoundingClientRect()),
          (a.__tracker = setInterval(function () {
            if (d(a._$origin) && d(a._$tooltip)) {
              if (a.__options.trackOrigin) {
                var e = a.__geometry(),
                  f = !1;
                c(e.origin.size, a.__Geometry.origin.size) &&
                  (a.__Geometry.origin.fixedLineage
                    ? c(e.origin.windowOffset, a.__Geometry.origin.windowOffset) && (f = !0)
                    : c(e.origin.offset, a.__Geometry.origin.offset) && (f = !0)),
                  f || (a.__options.triggerClose.mouseleave ? a._close() : a.reposition());
              }
              if (a.__options.trackTooltip) {
                var g = b[0].getBoundingClientRect();
                (g.height === a.__contentBcr.height && g.width === a.__contentBcr.width) || (a.reposition(), (a.__contentBcr = g));
              }
            } else a._close();
          }, a.__options.trackerInterval)),
          a
        );
      },
      _close: function (b, c, d) {
        var e = this,
          f = !0;
        if (
          (e._trigger({
            type: 'close',
            event: b,
            stop: function () {
              f = !1;
            },
          }),
          f || d)
        ) {
          c && e.__callbacks.close.push(c), (e.__callbacks.open = []), e.__timeoutsClear();
          var g = function () {
            a.each(e.__callbacks.close, function (a, c) {
              c.call(e, e, { event: b, origin: e._$origin[0] });
            }),
              (e.__callbacks.close = []);
          };
          if ('closed' != e.__state) {
            var i = !0,
              j = new Date(),
              k = j.getTime(),
              l = k + e.__options.animationDuration[1];
            if (('disappearing' == e.__state && l > e.__closingTime && e.__options.animationDuration[1] > 0 && (i = !1), i)) {
              (e.__closingTime = l), 'disappearing' != e.__state && e.__stateSet('disappearing');
              var m = function () {
                clearInterval(e.__tracker),
                  e._trigger({ type: 'closing', event: b }),
                  e._$tooltip.off('.' + e.__namespace + '-triggerClose').removeClass('tooltipster-dying'),
                  a(h.window).off('.' + e.__namespace + '-triggerClose'),
                  e.__$originParents.each(function (b, c) {
                    a(c).off('scroll.' + e.__namespace + '-triggerClose');
                  }),
                  (e.__$originParents = null),
                  a(h.window.document.body).off('.' + e.__namespace + '-triggerClose'),
                  e._$origin.off('.' + e.__namespace + '-triggerClose'),
                  e._off('dismissable'),
                  e.__stateSet('closed'),
                  e._trigger({ type: 'after', event: b }),
                  e.__options.functionAfter && e.__options.functionAfter.call(e, e, { event: b, origin: e._$origin[0] }),
                  g();
              };
              h.hasTransitions
                ? (e._$tooltip.css({
                    '-moz-animation-duration': e.__options.animationDuration[1] + 'ms',
                    '-ms-animation-duration': e.__options.animationDuration[1] + 'ms',
                    '-o-animation-duration': e.__options.animationDuration[1] + 'ms',
                    '-webkit-animation-duration': e.__options.animationDuration[1] + 'ms',
                    'animation-duration': e.__options.animationDuration[1] + 'ms',
                    'transition-duration': e.__options.animationDuration[1] + 'ms',
                  }),
                  e._$tooltip.clearQueue().removeClass('tooltipster-show').addClass('tooltipster-dying'),
                  e.__options.animationDuration[1] > 0 && e._$tooltip.delay(e.__options.animationDuration[1]),
                  e._$tooltip.queue(m))
                : e._$tooltip.stop().fadeOut(e.__options.animationDuration[1], m);
            }
          } else g();
        }
        return e;
      },
      _off: function () {
        return this.__$emitterPrivate.off.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)), this;
      },
      _on: function () {
        return this.__$emitterPrivate.on.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)), this;
      },
      _one: function () {
        return this.__$emitterPrivate.one.apply(this.__$emitterPrivate, Array.prototype.slice.apply(arguments)), this;
      },
      _open: function (b, c) {
        var e = this;
        if (!e.__destroying && d(e._$origin) && e.__enabled) {
          var f = !0;
          if (
            ('closed' == e.__state &&
              (e._trigger({
                type: 'before',
                event: b,
                stop: function () {
                  f = !1;
                },
              }),
              f && e.__options.functionBefore && (f = e.__options.functionBefore.call(e, e, { event: b, origin: e._$origin[0] }))),
            f !== !1 && null !== e.__Content)
          ) {
            c && e.__callbacks.open.push(c), (e.__callbacks.close = []), e.__timeoutsClear();
            var g,
              i = function () {
                'stable' != e.__state && e.__stateSet('stable'),
                  a.each(e.__callbacks.open, function (a, b) {
                    b.call(e, e, { origin: e._$origin[0], tooltip: e._$tooltip[0] });
                  }),
                  (e.__callbacks.open = []);
              };
            if ('closed' !== e.__state)
              (g = 0),
                'disappearing' === e.__state
                  ? (e.__stateSet('appearing'),
                    h.hasTransitions
                      ? (e._$tooltip.clearQueue().removeClass('tooltipster-dying').addClass('tooltipster-show'),
                        e.__options.animationDuration[0] > 0 && e._$tooltip.delay(e.__options.animationDuration[0]),
                        e._$tooltip.queue(i))
                      : e._$tooltip.stop().fadeIn(i))
                  : 'stable' == e.__state && i();
            else {
              if (
                (e.__stateSet('appearing'),
                (g = e.__options.animationDuration[0]),
                e.__contentInsert(),
                e.reposition(b, !0),
                h.hasTransitions
                  ? (e._$tooltip
                      .addClass('tooltipster-' + e.__options.animation)
                      .addClass('tooltipster-initial')
                      .css({
                        '-moz-animation-duration': e.__options.animationDuration[0] + 'ms',
                        '-ms-animation-duration': e.__options.animationDuration[0] + 'ms',
                        '-o-animation-duration': e.__options.animationDuration[0] + 'ms',
                        '-webkit-animation-duration': e.__options.animationDuration[0] + 'ms',
                        'animation-duration': e.__options.animationDuration[0] + 'ms',
                        'transition-duration': e.__options.animationDuration[0] + 'ms',
                      }),
                    setTimeout(function () {
                      'closed' != e.__state &&
                        (e._$tooltip.addClass('tooltipster-show').removeClass('tooltipster-initial'),
                        e.__options.animationDuration[0] > 0 && e._$tooltip.delay(e.__options.animationDuration[0]),
                        e._$tooltip.queue(i));
                    }, 0))
                  : e._$tooltip.css('display', 'none').fadeIn(e.__options.animationDuration[0], i),
                e.__trackerStart(),
                a(h.window)
                  .on('resize.' + e.__namespace + '-triggerClose', function (b) {
                    var c = a(document.activeElement);
                    ((c.is('input') || c.is('textarea')) && a.contains(e._$tooltip[0], c[0])) || e.reposition(b);
                  })
                  .on('scroll.' + e.__namespace + '-triggerClose', function (a) {
                    e.__scrollHandler(a);
                  }),
                (e.__$originParents = e._$origin.parents()),
                e.__$originParents.each(function (b, c) {
                  a(c).on('scroll.' + e.__namespace + '-triggerClose', function (a) {
                    e.__scrollHandler(a);
                  });
                }),
                e.__options.triggerClose.mouseleave || (e.__options.triggerClose.touchleave && h.hasTouchCapability))
              ) {
                e._on('dismissable', function (a) {
                  a.dismissable
                    ? a.delay
                      ? ((m = setTimeout(function () {
                          e._close(a.event);
                        }, a.delay)),
                        e.__timeouts.close.push(m))
                      : e._close(a)
                    : clearTimeout(m);
                });
                var j = e._$origin,
                  k = '',
                  l = '',
                  m = null;
                e.__options.interactive && (j = j.add(e._$tooltip)),
                  e.__options.triggerClose.mouseleave &&
                    ((k += 'mouseenter.' + e.__namespace + '-triggerClose '), (l += 'mouseleave.' + e.__namespace + '-triggerClose ')),
                  e.__options.triggerClose.touchleave &&
                    h.hasTouchCapability &&
                    ((k += 'touchstart.' + e.__namespace + '-triggerClose'),
                    (l += 'touchend.' + e.__namespace + '-triggerClose touchcancel.' + e.__namespace + '-triggerClose')),
                  j
                    .on(l, function (a) {
                      if (e._touchIsTouchEvent(a) || !e._touchIsEmulatedEvent(a)) {
                        var b = 'mouseleave' == a.type ? e.__options.delay : e.__options.delayTouch;
                        e._trigger({ delay: b[1], dismissable: !0, event: a, type: 'dismissable' });
                      }
                    })
                    .on(k, function (a) {
                      (!e._touchIsTouchEvent(a) && e._touchIsEmulatedEvent(a)) ||
                        e._trigger({ dismissable: !1, event: a, type: 'dismissable' });
                    });
              }
              e.__options.triggerClose.originClick &&
                e._$origin.on('click.' + e.__namespace + '-triggerClose', function (a) {
                  e._touchIsTouchEvent(a) || e._touchIsEmulatedEvent(a) || e._close(a);
                }),
                (e.__options.triggerClose.click || (e.__options.triggerClose.tap && h.hasTouchCapability)) &&
                  setTimeout(function () {
                    if ('closed' != e.__state) {
                      var b = '',
                        c = a(h.window.document.body);
                      e.__options.triggerClose.click && (b += 'click.' + e.__namespace + '-triggerClose '),
                        e.__options.triggerClose.tap && h.hasTouchCapability && (b += 'touchend.' + e.__namespace + '-triggerClose'),
                        c.on(b, function (b) {
                          e._touchIsMeaningfulEvent(b) &&
                            (e._touchRecordEvent(b), (e.__options.interactive && a.contains(e._$tooltip[0], b.target)) || e._close(b));
                        }),
                        e.__options.triggerClose.tap &&
                          h.hasTouchCapability &&
                          c.on('touchstart.' + e.__namespace + '-triggerClose', function (a) {
                            e._touchRecordEvent(a);
                          });
                    }
                  }, 0),
                e._trigger('ready'),
                e.__options.functionReady && e.__options.functionReady.call(e, e, { origin: e._$origin[0], tooltip: e._$tooltip[0] });
            }
            if (e.__options.timer > 0) {
              var m = setTimeout(function () {
                e._close();
              }, e.__options.timer + g);
              e.__timeouts.close.push(m);
            }
          }
        }
        return e;
      },
      _openShortly: function (a) {
        var b = this,
          c = !0;
        if (
          'stable' != b.__state &&
          'appearing' != b.__state &&
          !b.__timeouts.open &&
          (b._trigger({
            type: 'start',
            event: a,
            stop: function () {
              c = !1;
            },
          }),
          c)
        ) {
          var d = 0 == a.type.indexOf('touch') ? b.__options.delayTouch : b.__options.delay;
          d[0]
            ? (b.__timeouts.open = setTimeout(function () {
                (b.__timeouts.open = null),
                  b.__pointerIsOverOrigin && b._touchIsMeaningfulEvent(a)
                    ? (b._trigger('startend'), b._open(a))
                    : b._trigger('startcancel');
              }, d[0]))
            : (b._trigger('startend'), b._open(a));
        }
        return b;
      },
      _optionsExtract: function (b, c) {
        var d = this,
          e = a.extend(!0, {}, c),
          f = d.__options[b];
        return (
          f ||
            ((f = {}),
            a.each(c, function (a, b) {
              var c = d.__options[a];
              void 0 !== c && (f[a] = c);
            })),
          a.each(e, function (b, c) {
            void 0 !== f[b] &&
              ('object' != typeof c || c instanceof Array || null == c || 'object' != typeof f[b] || f[b] instanceof Array || null == f[b]
                ? (e[b] = f[b])
                : a.extend(e[b], f[b]));
          }),
          e
        );
      },
      _plug: function (b) {
        var c = a.tooltipster._plugin(b);
        if (!c) throw new Error('The "' + b + '" plugin is not defined');
        return c.instance && a.tooltipster.__bridge(c.instance, this, c.name), this;
      },
      _touchIsEmulatedEvent: function (a) {
        for (var b = !1, c = new Date().getTime(), d = this.__touchEvents.length - 1; d >= 0; d--) {
          var e = this.__touchEvents[d];
          if (!(c - e.time < 500)) break;
          e.target === a.target && (b = !0);
        }
        return b;
      },
      _touchIsMeaningfulEvent: function (a) {
        return (
          (this._touchIsTouchEvent(a) && !this._touchSwiped(a.target)) || (!this._touchIsTouchEvent(a) && !this._touchIsEmulatedEvent(a))
        );
      },
      _touchIsTouchEvent: function (a) {
        return 0 == a.type.indexOf('touch');
      },
      _touchRecordEvent: function (a) {
        return this._touchIsTouchEvent(a) && ((a.time = new Date().getTime()), this.__touchEvents.push(a)), this;
      },
      _touchSwiped: function (a) {
        for (var b = !1, c = this.__touchEvents.length - 1; c >= 0; c--) {
          var d = this.__touchEvents[c];
          if ('touchmove' == d.type) {
            b = !0;
            break;
          }
          if ('touchstart' == d.type && a === d.target) break;
        }
        return b;
      },
      _trigger: function () {
        var b = Array.prototype.slice.apply(arguments);
        return (
          'string' == typeof b[0] && (b[0] = { type: b[0] }),
          (b[0].instance = this),
          (b[0].origin = this._$origin ? this._$origin[0] : null),
          (b[0].tooltip = this._$tooltip ? this._$tooltip[0] : null),
          this.__$emitterPrivate.trigger.apply(this.__$emitterPrivate, b),
          a.tooltipster._trigger.apply(a.tooltipster, b),
          this.__$emitterPublic.trigger.apply(this.__$emitterPublic, b),
          this
        );
      },
      _unplug: function (b) {
        var c = this;
        if (c[b]) {
          var d = a.tooltipster._plugin(b);
          d.instance &&
            a.each(d.instance, function (a, d) {
              c[a] && c[a].bridged === c[b] && delete c[a];
            }),
            c[b].__destroy && c[b].__destroy(),
            delete c[b];
        }
        return c;
      },
      close: function (a) {
        return this.__destroyed ? this.__destroyError() : this._close(null, a), this;
      },
      content: function (a) {
        var b = this;
        if (void 0 === a) return b.__Content;
        if (b.__destroyed) b.__destroyError();
        else if ((b.__contentSet(a), null !== b.__Content)) {
          if ('closed' !== b.__state && (b.__contentInsert(), b.reposition(), b.__options.updateAnimation))
            if (h.hasTransitions) {
              var c = b.__options.updateAnimation;
              b._$tooltip.addClass('tooltipster-update-' + c),
                setTimeout(function () {
                  'closed' != b.__state && b._$tooltip.removeClass('tooltipster-update-' + c);
                }, 1e3);
            } else
              b._$tooltip.fadeTo(200, 0.5, function () {
                'closed' != b.__state && b._$tooltip.fadeTo(200, 1);
              });
        } else b._close();
        return b;
      },
      destroy: function () {
        var b = this;
        if (b.__destroyed) b.__destroyError();
        else {
          'closed' != b.__state ? b.option('animationDuration', 0)._close(null, null, !0) : b.__timeoutsClear(),
            b._trigger('destroy'),
            (b.__destroyed = !0),
            b._$origin.removeData(b.__namespace).off('.' + b.__namespace + '-triggerOpen'),
            a(h.window.document.body).off('.' + b.__namespace + '-triggerOpen');
          var c = b._$origin.data('tooltipster-ns');
          if (c)
            if (1 === c.length) {
              var d = null;
              'previous' == b.__options.restoration
                ? (d = b._$origin.data('tooltipster-initialTitle'))
                : 'current' == b.__options.restoration &&
                  (d = 'string' == typeof b.__Content ? b.__Content : a('<div></div>').append(b.__Content).html()),
                d && b._$origin.attr('title', d),
                b._$origin.removeClass('tooltipstered'),
                b._$origin.removeData('tooltipster-ns').removeData('tooltipster-initialTitle');
            } else
              (c = a.grep(c, function (a, c) {
                return a !== b.__namespace;
              })),
                b._$origin.data('tooltipster-ns', c);
          b._trigger('destroyed'),
            b._off(),
            b.off(),
            (b.__Content = null),
            (b.__$emitterPrivate = null),
            (b.__$emitterPublic = null),
            (b.__options.parent = null),
            (b._$origin = null),
            (b._$tooltip = null),
            (a.tooltipster.__instancesLatestArr = a.grep(a.tooltipster.__instancesLatestArr, function (a, c) {
              return b !== a;
            })),
            clearInterval(b.__garbageCollector);
        }
        return b;
      },
      disable: function () {
        return this.__destroyed ? (this.__destroyError(), this) : (this._close(), (this.__enabled = !1), this);
      },
      elementOrigin: function () {
        return this.__destroyed ? void this.__destroyError() : this._$origin[0];
      },
      elementTooltip: function () {
        return this._$tooltip ? this._$tooltip[0] : null;
      },
      enable: function () {
        return (this.__enabled = !0), this;
      },
      hide: function (a) {
        return this.close(a);
      },
      instance: function () {
        return this;
      },
      off: function () {
        return this.__destroyed || this.__$emitterPublic.off.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)), this;
      },
      on: function () {
        return (
          this.__destroyed
            ? this.__destroyError()
            : this.__$emitterPublic.on.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)),
          this
        );
      },
      one: function () {
        return (
          this.__destroyed
            ? this.__destroyError()
            : this.__$emitterPublic.one.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)),
          this
        );
      },
      open: function (a) {
        return this.__destroyed ? this.__destroyError() : this._open(null, a), this;
      },
      option: function (b, c) {
        return void 0 === c
          ? this.__options[b]
          : (this.__destroyed
              ? this.__destroyError()
              : ((this.__options[b] = c),
                this.__optionsFormat(),
                a.inArray(b, ['trigger', 'triggerClose', 'triggerOpen']) >= 0 && this.__prepareOrigin(),
                'selfDestruction' === b && this.__prepareGC()),
            this);
      },
      reposition: function (a, b) {
        var c = this;
        return (
          c.__destroyed
            ? c.__destroyError()
            : 'closed' != c.__state &&
              d(c._$origin) &&
              (b || d(c._$tooltip)) &&
              (b || c._$tooltip.detach(),
              (c.__Geometry = c.__geometry()),
              c._trigger({ type: 'reposition', event: a, helper: { geo: c.__Geometry } })),
          c
        );
      },
      show: function (a) {
        return this.open(a);
      },
      status: function () {
        return { destroyed: this.__destroyed, enabled: this.__enabled, open: 'closed' !== this.__state, state: this.__state };
      },
      triggerHandler: function () {
        return (
          this.__destroyed
            ? this.__destroyError()
            : this.__$emitterPublic.triggerHandler.apply(this.__$emitterPublic, Array.prototype.slice.apply(arguments)),
          this
        );
      },
    }),
    (a.fn.tooltipster = function () {
      var b = Array.prototype.slice.apply(arguments),
        c =
          'You are using a single HTML element as content for several tooltips. You probably want to set the contentCloning option to TRUE.';
      if (0 === this.length) return this;
      if ('string' == typeof b[0]) {
        var d = '#*$~&';
        return (
          this.each(function () {
            var e = a(this).data('tooltipster-ns'),
              f = e ? a(this).data(e[0]) : null;
            if (!f) throw new Error('You called Tooltipster\'s "' + b[0] + '" method on an uninitialized element');
            if ('function' != typeof f[b[0]]) throw new Error('Unknown method "' + b[0] + '"');
            this.length > 1 &&
              'content' == b[0] &&
              (b[1] instanceof a || ('object' == typeof b[1] && null != b[1] && b[1].tagName)) &&
              !f.__options.contentCloning &&
              f.__options.debug &&
              console.log(c);
            var g = f[b[0]](b[1], b[2]);
            return g !== f || 'instance' === b[0] ? ((d = g), !1) : void 0;
          }),
          '#*$~&' !== d ? d : this
        );
      }
      a.tooltipster.__instancesLatestArr = [];
      var e = b[0] && void 0 !== b[0].multiple,
        g = (e && b[0].multiple) || (!e && f.multiple),
        h = b[0] && void 0 !== b[0].content,
        i = (h && b[0].content) || (!h && f.content),
        j = b[0] && void 0 !== b[0].contentCloning,
        k = (j && b[0].contentCloning) || (!j && f.contentCloning),
        l = b[0] && void 0 !== b[0].debug,
        m = (l && b[0].debug) || (!l && f.debug);
      return (
        this.length > 1 && (i instanceof a || ('object' == typeof i && null != i && i.tagName)) && !k && m && console.log(c),
        this.each(function () {
          var c = !1,
            d = a(this),
            e = d.data('tooltipster-ns'),
            f = null;
          e
            ? g
              ? (c = !0)
              : m &&
                (console.log('Tooltipster: one or more tooltips are already attached to the element below. Ignoring.'), console.log(this))
            : (c = !0),
            c &&
              ((f = new a.Tooltipster(this, b[0])),
              e || (e = []),
              e.push(f.__namespace),
              d.data('tooltipster-ns', e),
              d.data(f.__namespace, f),
              f.__options.functionInit && f.__options.functionInit.call(f, f, { origin: this }),
              f._trigger('init')),
            a.tooltipster.__instancesLatestArr.push(f);
        }),
        this
      );
    }),
    (b.prototype = {
      __init: function (b) {
        (this.__$tooltip = b),
          this.__$tooltip
            .css({ left: 0, overflow: 'hidden', position: 'absolute', top: 0 })
            .find('.tooltipster-content')
            .css('overflow', 'auto'),
          (this.$container = a('<div class="tooltipster-ruler"></div>').append(this.__$tooltip).appendTo(h.window.document.body));
      },
      __forceRedraw: function () {
        var a = this.__$tooltip.parent();
        this.__$tooltip.detach(), this.__$tooltip.appendTo(a);
      },
      constrain: function (a, b) {
        return (
          (this.constraints = { width: a, height: b }),
          this.__$tooltip.css({ display: 'block', height: '', overflow: 'auto', width: a }),
          this
        );
      },
      destroy: function () {
        this.__$tooltip.detach().find('.tooltipster-content').css({ display: '', overflow: '' }), this.$container.remove();
      },
      free: function () {
        return (this.constraints = null), this.__$tooltip.css({ display: '', height: '', overflow: 'visible', width: '' }), this;
      },
      measure: function () {
        this.__forceRedraw();
        var a = this.__$tooltip[0].getBoundingClientRect(),
          b = { size: { height: a.height || a.bottom - a.top, width: a.width || a.right - a.left } };
        if (this.constraints) {
          var c = this.__$tooltip.find('.tooltipster-content'),
            d = this.__$tooltip.outerHeight(),
            e = c[0].getBoundingClientRect(),
            f = { height: d <= this.constraints.height, width: a.width <= this.constraints.width && e.width >= c[0].scrollWidth - 1 };
          b.fits = f.height && f.width;
        }
        return (
          h.IE &&
            h.IE <= 11 &&
            b.size.width !== h.window.document.documentElement.clientWidth &&
            (b.size.width = Math.ceil(b.size.width) + 1),
          b
        );
      },
    });
  var j = navigator.userAgent.toLowerCase();
  -1 != j.indexOf('msie')
    ? (h.IE = parseInt(j.split('msie')[1]))
    : -1 !== j.toLowerCase().indexOf('trident') && -1 !== j.indexOf(' rv:11')
    ? (h.IE = 11)
    : -1 != j.toLowerCase().indexOf('edge/') && (h.IE = parseInt(j.toLowerCase().split('edge/')[1]));
  var k = 'tooltipster.sideTip';
  return (
    a.tooltipster._plugin({
      name: k,
      instance: {
        __defaults: function () {
          return {
            arrow: !0,
            distance: 6,
            functionPosition: null,
            maxWidth: null,
            minIntersection: 16,
            minWidth: 0,
            position: null,
            side: 'top',
            viewportAware: !0,
          };
        },
        __init: function (a) {
          var b = this;
          (b.__instance = a),
            (b.__namespace = 'tooltipster-sideTip-' + Math.round(1e6 * Math.random())),
            (b.__previousState = 'closed'),
            b.__options,
            b.__optionsFormat(),
            b.__instance._on('state.' + b.__namespace, function (a) {
              'closed' == a.state ? b.__close() : 'appearing' == a.state && 'closed' == b.__previousState && b.__create(),
                (b.__previousState = a.state);
            }),
            b.__instance._on('options.' + b.__namespace, function () {
              b.__optionsFormat();
            }),
            b.__instance._on('reposition.' + b.__namespace, function (a) {
              b.__reposition(a.event, a.helper);
            });
        },
        __close: function () {
          this.__instance.content() instanceof a && this.__instance.content().detach(),
            this.__instance._$tooltip.remove(),
            (this.__instance._$tooltip = null);
        },
        __create: function () {
          var b = a(
            '<div class="tooltipster-base tooltipster-sidetip"><div class="tooltipster-box"><div class="tooltipster-content"></div></div><div class="tooltipster-arrow"><div class="tooltipster-arrow-uncropped"><div class="tooltipster-arrow-border"></div><div class="tooltipster-arrow-background"></div></div></div></div>'
          );
          this.__options.arrow || b.find('.tooltipster-box').css('margin', 0).end().find('.tooltipster-arrow').hide(),
            this.__options.minWidth && b.css('min-width', this.__options.minWidth + 'px'),
            this.__options.maxWidth && b.css('max-width', this.__options.maxWidth + 'px'),
            (this.__instance._$tooltip = b),
            this.__instance._trigger('created');
        },
        __destroy: function () {
          this.__instance._off('.' + self.__namespace);
        },
        __optionsFormat: function () {
          var b = this;
          if (
            ((b.__options = b.__instance._optionsExtract(k, b.__defaults())),
            b.__options.position && (b.__options.side = b.__options.position),
            'object' != typeof b.__options.distance && (b.__options.distance = [b.__options.distance]),
            b.__options.distance.length < 4 &&
              (void 0 === b.__options.distance[1] && (b.__options.distance[1] = b.__options.distance[0]),
              void 0 === b.__options.distance[2] && (b.__options.distance[2] = b.__options.distance[0]),
              void 0 === b.__options.distance[3] && (b.__options.distance[3] = b.__options.distance[1]),
              (b.__options.distance = {
                top: b.__options.distance[0],
                right: b.__options.distance[1],
                bottom: b.__options.distance[2],
                left: b.__options.distance[3],
              })),
            'string' == typeof b.__options.side)
          ) {
            var c = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' };
            (b.__options.side = [b.__options.side, c[b.__options.side]]),
              'left' == b.__options.side[0] || 'right' == b.__options.side[0]
                ? b.__options.side.push('top', 'bottom')
                : b.__options.side.push('right', 'left');
          }
          6 === a.tooltipster._env.IE && b.__options.arrow !== !0 && (b.__options.arrow = !1);
        },
        __reposition: function (b, c) {
          var d,
            e = this,
            f = e.__targetFind(c),
            g = [];
          e.__instance._$tooltip.detach();
          var h = e.__instance._$tooltip.clone(),
            i = a.tooltipster._getRuler(h),
            j = !1,
            k = e.__instance.option('animation');
          switch (
            (k && h.removeClass('tooltipster-' + k),
            a.each(['window', 'document'], function (d, k) {
              var l = null;
              if (
                (e.__instance._trigger({
                  container: k,
                  helper: c,
                  satisfied: j,
                  takeTest: function (a) {
                    l = a;
                  },
                  results: g,
                  type: 'positionTest',
                }),
                1 == l || (0 != l && 0 == j && ('window' != k || e.__options.viewportAware)))
              )
                for (var d = 0; d < e.__options.side.length; d++) {
                  var m = { horizontal: 0, vertical: 0 },
                    n = e.__options.side[d];
                  'top' == n || 'bottom' == n ? (m.vertical = e.__options.distance[n]) : (m.horizontal = e.__options.distance[n]),
                    e.__sideChange(h, n),
                    a.each(['natural', 'constrained'], function (a, d) {
                      if (
                        ((l = null),
                        e.__instance._trigger({
                          container: k,
                          event: b,
                          helper: c,
                          mode: d,
                          results: g,
                          satisfied: j,
                          side: n,
                          takeTest: function (a) {
                            l = a;
                          },
                          type: 'positionTest',
                        }),
                        1 == l || (0 != l && 0 == j))
                      ) {
                        var h = {
                            container: k,
                            distance: m,
                            fits: null,
                            mode: d,
                            outerSize: null,
                            side: n,
                            size: null,
                            target: f[n],
                            whole: null,
                          },
                          o =
                            'natural' == d
                              ? i.free()
                              : i.constrain(c.geo.available[k][n].width - m.horizontal, c.geo.available[k][n].height - m.vertical),
                          p = o.measure();
                        if (
                          ((h.size = p.size),
                          (h.outerSize = { height: p.size.height + m.vertical, width: p.size.width + m.horizontal }),
                          'natural' == d
                            ? c.geo.available[k][n].width >= h.outerSize.width && c.geo.available[k][n].height >= h.outerSize.height
                              ? (h.fits = !0)
                              : (h.fits = !1)
                            : (h.fits = p.fits),
                          'window' == k &&
                            (h.fits
                              ? 'top' == n || 'bottom' == n
                                ? (h.whole =
                                    c.geo.origin.windowOffset.right >= e.__options.minIntersection &&
                                    c.geo.window.size.width - c.geo.origin.windowOffset.left >= e.__options.minIntersection)
                                : (h.whole =
                                    c.geo.origin.windowOffset.bottom >= e.__options.minIntersection &&
                                    c.geo.window.size.height - c.geo.origin.windowOffset.top >= e.__options.minIntersection)
                              : (h.whole = !1)),
                          g.push(h),
                          h.whole)
                        )
                          j = !0;
                        else if ('natural' == h.mode && (h.fits || h.size.width <= c.geo.available[k][n].width)) return !1;
                      }
                    });
                }
            }),
            e.__instance._trigger({
              edit: function (a) {
                g = a;
              },
              event: b,
              helper: c,
              results: g,
              type: 'positionTested',
            }),
            g.sort(function (a, b) {
              if (a.whole && !b.whole) return -1;
              if (!a.whole && b.whole) return 1;
              if (a.whole && b.whole) {
                var c = e.__options.side.indexOf(a.side),
                  d = e.__options.side.indexOf(b.side);
                return d > c ? -1 : c > d ? 1 : 'natural' == a.mode ? -1 : 1;
              }
              if (a.fits && !b.fits) return -1;
              if (!a.fits && b.fits) return 1;
              if (a.fits && b.fits) {
                var c = e.__options.side.indexOf(a.side),
                  d = e.__options.side.indexOf(b.side);
                return d > c ? -1 : c > d ? 1 : 'natural' == a.mode ? -1 : 1;
              }
              return 'document' == a.container && 'bottom' == a.side && 'natural' == a.mode ? -1 : 1;
            }),
            (d = g[0]),
            (d.coord = {}),
            d.side)
          ) {
            case 'left':
            case 'right':
              d.coord.top = Math.floor(d.target - d.size.height / 2);
              break;
            case 'bottom':
            case 'top':
              d.coord.left = Math.floor(d.target - d.size.width / 2);
          }
          switch (d.side) {
            case 'left':
              d.coord.left = c.geo.origin.windowOffset.left - d.outerSize.width;
              break;
            case 'right':
              d.coord.left = c.geo.origin.windowOffset.right + d.distance.horizontal;
              break;
            case 'top':
              d.coord.top = c.geo.origin.windowOffset.top - d.outerSize.height;
              break;
            case 'bottom':
              d.coord.top = c.geo.origin.windowOffset.bottom + d.distance.vertical;
          }
          'window' == d.container
            ? 'top' == d.side || 'bottom' == d.side
              ? d.coord.left < 0
                ? c.geo.origin.windowOffset.right - this.__options.minIntersection >= 0
                  ? (d.coord.left = 0)
                  : (d.coord.left = c.geo.origin.windowOffset.right - this.__options.minIntersection - 1)
                : d.coord.left > c.geo.window.size.width - d.size.width &&
                  (c.geo.origin.windowOffset.left + this.__options.minIntersection <= c.geo.window.size.width
                    ? (d.coord.left = c.geo.window.size.width - d.size.width)
                    : (d.coord.left = c.geo.origin.windowOffset.left + this.__options.minIntersection + 1 - d.size.width))
              : d.coord.top < 0
              ? c.geo.origin.windowOffset.bottom - this.__options.minIntersection >= 0
                ? (d.coord.top = 0)
                : (d.coord.top = c.geo.origin.windowOffset.bottom - this.__options.minIntersection - 1)
              : d.coord.top > c.geo.window.size.height - d.size.height &&
                (c.geo.origin.windowOffset.top + this.__options.minIntersection <= c.geo.window.size.height
                  ? (d.coord.top = c.geo.window.size.height - d.size.height)
                  : (d.coord.top = c.geo.origin.windowOffset.top + this.__options.minIntersection + 1 - d.size.height))
            : (d.coord.left > c.geo.window.size.width - d.size.width && (d.coord.left = c.geo.window.size.width - d.size.width),
              d.coord.left < 0 && (d.coord.left = 0)),
            e.__sideChange(h, d.side),
            (c.tooltipClone = h[0]),
            (c.tooltipParent = e.__instance.option('parent').parent[0]),
            (c.mode = d.mode),
            (c.whole = d.whole),
            (c.origin = e.__instance._$origin[0]),
            (c.tooltip = e.__instance._$tooltip[0]),
            delete d.container,
            delete d.fits,
            delete d.mode,
            delete d.outerSize,
            delete d.whole,
            (d.distance = d.distance.horizontal || d.distance.vertical);
          var l = a.extend(!0, {}, d);
          if (
            (e.__instance._trigger({
              edit: function (a) {
                d = a;
              },
              event: b,
              helper: c,
              position: l,
              type: 'position',
            }),
            e.__options.functionPosition)
          ) {
            var m = e.__options.functionPosition.call(e, e.__instance, c, l);
            m && (d = m);
          }
          i.destroy();
          var n, o;
          'top' == d.side || 'bottom' == d.side
            ? ((n = { prop: 'left', val: d.target - d.coord.left }), (o = d.size.width - this.__options.minIntersection))
            : ((n = { prop: 'top', val: d.target - d.coord.top }), (o = d.size.height - this.__options.minIntersection)),
            n.val < this.__options.minIntersection ? (n.val = this.__options.minIntersection) : n.val > o && (n.val = o);
          var p;
          (p = c.geo.origin.fixedLineage
            ? c.geo.origin.windowOffset
            : {
                left: c.geo.origin.windowOffset.left + c.geo.window.scroll.left,
                top: c.geo.origin.windowOffset.top + c.geo.window.scroll.top,
              }),
            (d.coord = {
              left: p.left + (d.coord.left - c.geo.origin.windowOffset.left),
              top: p.top + (d.coord.top - c.geo.origin.windowOffset.top),
            }),
            e.__sideChange(e.__instance._$tooltip, d.side),
            c.geo.origin.fixedLineage ? e.__instance._$tooltip.css('position', 'fixed') : e.__instance._$tooltip.css('position', ''),
            e.__instance._$tooltip
              .css({ left: d.coord.left, top: d.coord.top, height: d.size.height, width: d.size.width })
              .find('.tooltipster-arrow')
              .css({ left: '', top: '' })
              .css(n.prop, n.val),
            e.__instance._$tooltip.appendTo(e.__instance.option('parent')),
            e.__instance._trigger({ type: 'repositioned', event: b, position: d });
        },
        __sideChange: function (a, b) {
          a.removeClass('tooltipster-bottom')
            .removeClass('tooltipster-left')
            .removeClass('tooltipster-right')
            .removeClass('tooltipster-top')
            .addClass('tooltipster-' + b);
        },
        __targetFind: function (a) {
          var b = {},
            c = this.__instance._$origin[0].getClientRects();
          if (c.length > 1) {
            var d = this.__instance._$origin.css('opacity');
            1 == d &&
              (this.__instance._$origin.css('opacity', 0.99),
              (c = this.__instance._$origin[0].getClientRects()),
              this.__instance._$origin.css('opacity', 1));
          }
          if (c.length < 2)
            (b.top = Math.floor(a.geo.origin.windowOffset.left + a.geo.origin.size.width / 2)),
              (b.bottom = b.top),
              (b.left = Math.floor(a.geo.origin.windowOffset.top + a.geo.origin.size.height / 2)),
              (b.right = b.left);
          else {
            var e = c[0];
            (b.top = Math.floor(e.left + (e.right - e.left) / 2)),
              (e = c.length > 2 ? c[Math.ceil(c.length / 2) - 1] : c[0]),
              (b.right = Math.floor(e.top + (e.bottom - e.top) / 2)),
              (e = c[c.length - 1]),
              (b.bottom = Math.floor(e.left + (e.right - e.left) / 2)),
              (e = c.length > 2 ? c[Math.ceil((c.length + 1) / 2) - 1] : c[c.length - 1]),
              (b.left = Math.floor(e.top + (e.bottom - e.top) / 2));
          }
          return b;
        },
      },
    }),
    a
  );
});

/*! jQuery UI - v1.12.1 - 2019-07-15
 * http://jqueryui.com
 * Includes: widget.js, keycode.js, widgets/mouse.js, widgets/slider.js
 * Copyright jQuery Foundation and other contributors; Licensed MIT */

(function (t) {
  'function' == typeof define && define.amd ? define(['jquery'], t) : t(jQuery);
})(function (t) {
  (t.ui = t.ui || {}), (t.ui.version = '1.12.1');
  var e = 0,
    i = Array.prototype.slice;
  (t.cleanData = (function (e) {
    return function (i) {
      var s, n, o;
      for (o = 0; null != (n = i[o]); o++)
        try {
          (s = t._data(n, 'events')), s && s.remove && t(n).triggerHandler('remove');
        } catch (a) {}
      e(i);
    };
  })(t.cleanData)),
    (t.widget = function (e, i, s) {
      var n,
        o,
        a,
        r = {},
        h = e.split('.')[0];
      e = e.split('.')[1];
      var l = h + '-' + e;
      return (
        s || ((s = i), (i = t.Widget)),
        t.isArray(s) && (s = t.extend.apply(null, [{}].concat(s))),
        (t.expr[':'][l.toLowerCase()] = function (e) {
          return !!t.data(e, l);
        }),
        (t[h] = t[h] || {}),
        (n = t[h][e]),
        (o = t[h][e] =
          function (t, e) {
            return this._createWidget ? (arguments.length && this._createWidget(t, e), void 0) : new o(t, e);
          }),
        t.extend(o, n, { version: s.version, _proto: t.extend({}, s), _childConstructors: [] }),
        (a = new i()),
        (a.options = t.widget.extend({}, a.options)),
        t.each(s, function (e, s) {
          return t.isFunction(s)
            ? ((r[e] = (function () {
                function t() {
                  return i.prototype[e].apply(this, arguments);
                }
                function n(t) {
                  return i.prototype[e].apply(this, t);
                }
                return function () {
                  var e,
                    i = this._super,
                    o = this._superApply;
                  return (
                    (this._super = t), (this._superApply = n), (e = s.apply(this, arguments)), (this._super = i), (this._superApply = o), e
                  );
                };
              })()),
              void 0)
            : ((r[e] = s), void 0);
        }),
        (o.prototype = t.widget.extend(a, { widgetEventPrefix: n ? a.widgetEventPrefix || e : e }, r, {
          constructor: o,
          namespace: h,
          widgetName: e,
          widgetFullName: l,
        })),
        n
          ? (t.each(n._childConstructors, function (e, i) {
              var s = i.prototype;
              t.widget(s.namespace + '.' + s.widgetName, o, i._proto);
            }),
            delete n._childConstructors)
          : i._childConstructors.push(o),
        t.widget.bridge(e, o),
        o
      );
    }),
    (t.widget.extend = function (e) {
      for (var s, n, o = i.call(arguments, 1), a = 0, r = o.length; r > a; a++)
        for (s in o[a])
          (n = o[a][s]),
            o[a].hasOwnProperty(s) &&
              void 0 !== n &&
              (e[s] = t.isPlainObject(n) ? (t.isPlainObject(e[s]) ? t.widget.extend({}, e[s], n) : t.widget.extend({}, n)) : n);
      return e;
    }),
    (t.widget.bridge = function (e, s) {
      var n = s.prototype.widgetFullName || e;
      t.fn[e] = function (o) {
        var a = 'string' == typeof o,
          r = i.call(arguments, 1),
          h = this;
        return (
          a
            ? this.length || 'instance' !== o
              ? this.each(function () {
                  var i,
                    s = t.data(this, n);
                  return 'instance' === o
                    ? ((h = s), !1)
                    : s
                    ? t.isFunction(s[o]) && '_' !== o.charAt(0)
                      ? ((i = s[o].apply(s, r)), i !== s && void 0 !== i ? ((h = i && i.jquery ? h.pushStack(i.get()) : i), !1) : void 0)
                      : t.error("no such method '" + o + "' for " + e + ' widget instance')
                    : t.error('cannot call methods on ' + e + ' prior to initialization; ' + "attempted to call method '" + o + "'");
                })
              : (h = void 0)
            : (r.length && (o = t.widget.extend.apply(null, [o].concat(r))),
              this.each(function () {
                var e = t.data(this, n);
                e ? (e.option(o || {}), e._init && e._init()) : t.data(this, n, new s(o, this));
              })),
          h
        );
      };
    }),
    (t.Widget = function () {}),
    (t.Widget._childConstructors = []),
    (t.Widget.prototype = {
      widgetName: 'widget',
      widgetEventPrefix: '',
      defaultElement: '<div>',
      options: { classes: {}, disabled: !1, create: null },
      _createWidget: function (i, s) {
        (s = t(s || this.defaultElement || this)[0]),
          (this.element = t(s)),
          (this.uuid = e++),
          (this.eventNamespace = '.' + this.widgetName + this.uuid),
          (this.bindings = t()),
          (this.hoverable = t()),
          (this.focusable = t()),
          (this.classesElementLookup = {}),
          s !== this &&
            (t.data(s, this.widgetFullName, this),
            this._on(!0, this.element, {
              remove: function (t) {
                t.target === s && this.destroy();
              },
            }),
            (this.document = t(s.style ? s.ownerDocument : s.document || s)),
            (this.window = t(this.document[0].defaultView || this.document[0].parentWindow))),
          (this.options = t.widget.extend({}, this.options, this._getCreateOptions(), i)),
          this._create(),
          this.options.disabled && this._setOptionDisabled(this.options.disabled),
          this._trigger('create', null, this._getCreateEventData()),
          this._init();
      },
      _getCreateOptions: function () {
        return {};
      },
      _getCreateEventData: t.noop,
      _create: t.noop,
      _init: t.noop,
      destroy: function () {
        var e = this;
        this._destroy(),
          t.each(this.classesElementLookup, function (t, i) {
            e._removeClass(i, t);
          }),
          this.element.off(this.eventNamespace).removeData(this.widgetFullName),
          this.widget().off(this.eventNamespace).removeAttr('aria-disabled'),
          this.bindings.off(this.eventNamespace);
      },
      _destroy: t.noop,
      widget: function () {
        return this.element;
      },
      option: function (e, i) {
        var s,
          n,
          o,
          a = e;
        if (0 === arguments.length) return t.widget.extend({}, this.options);
        if ('string' == typeof e)
          if (((a = {}), (s = e.split('.')), (e = s.shift()), s.length)) {
            for (n = a[e] = t.widget.extend({}, this.options[e]), o = 0; s.length - 1 > o; o++) (n[s[o]] = n[s[o]] || {}), (n = n[s[o]]);
            if (((e = s.pop()), 1 === arguments.length)) return void 0 === n[e] ? null : n[e];
            n[e] = i;
          } else {
            if (1 === arguments.length) return void 0 === this.options[e] ? null : this.options[e];
            a[e] = i;
          }
        return this._setOptions(a), this;
      },
      _setOptions: function (t) {
        var e;
        for (e in t) this._setOption(e, t[e]);
        return this;
      },
      _setOption: function (t, e) {
        return 'classes' === t && this._setOptionClasses(e), (this.options[t] = e), 'disabled' === t && this._setOptionDisabled(e), this;
      },
      _setOptionClasses: function (e) {
        var i, s, n;
        for (i in e)
          (n = this.classesElementLookup[i]),
            e[i] !== this.options.classes[i] &&
              n &&
              n.length &&
              ((s = t(n.get())), this._removeClass(n, i), s.addClass(this._classes({ element: s, keys: i, classes: e, add: !0 })));
      },
      _setOptionDisabled: function (t) {
        this._toggleClass(this.widget(), this.widgetFullName + '-disabled', null, !!t),
          t && (this._removeClass(this.hoverable, null, 'ui-state-hover'), this._removeClass(this.focusable, null, 'ui-state-focus'));
      },
      enable: function () {
        return this._setOptions({ disabled: !1 });
      },
      disable: function () {
        return this._setOptions({ disabled: !0 });
      },
      _classes: function (e) {
        function i(i, o) {
          var a, r;
          for (r = 0; i.length > r; r++)
            (a = n.classesElementLookup[i[r]] || t()),
              (a = e.add ? t(t.unique(a.get().concat(e.element.get()))) : t(a.not(e.element).get())),
              (n.classesElementLookup[i[r]] = a),
              s.push(i[r]),
              o && e.classes[i[r]] && s.push(e.classes[i[r]]);
        }
        var s = [],
          n = this;
        return (
          (e = t.extend({ element: this.element, classes: this.options.classes || {} }, e)),
          this._on(e.element, { remove: '_untrackClassesElement' }),
          e.keys && i(e.keys.match(/\S+/g) || [], !0),
          e.extra && i(e.extra.match(/\S+/g) || []),
          s.join(' ')
        );
      },
      _untrackClassesElement: function (e) {
        var i = this;
        t.each(i.classesElementLookup, function (s, n) {
          -1 !== t.inArray(e.target, n) && (i.classesElementLookup[s] = t(n.not(e.target).get()));
        });
      },
      _removeClass: function (t, e, i) {
        return this._toggleClass(t, e, i, !1);
      },
      _addClass: function (t, e, i) {
        return this._toggleClass(t, e, i, !0);
      },
      _toggleClass: function (t, e, i, s) {
        s = 'boolean' == typeof s ? s : i;
        var n = 'string' == typeof t || null === t,
          o = { extra: n ? e : i, keys: n ? t : e, element: n ? this.element : t, add: s };
        return o.element.toggleClass(this._classes(o), s), this;
      },
      _on: function (e, i, s) {
        var n,
          o = this;
        'boolean' != typeof e && ((s = i), (i = e), (e = !1)),
          s ? ((i = n = t(i)), (this.bindings = this.bindings.add(i))) : ((s = i), (i = this.element), (n = this.widget())),
          t.each(s, function (s, a) {
            function r() {
              return e || (o.options.disabled !== !0 && !t(this).hasClass('ui-state-disabled'))
                ? ('string' == typeof a ? o[a] : a).apply(o, arguments)
                : void 0;
            }
            'string' != typeof a && (r.guid = a.guid = a.guid || r.guid || t.guid++);
            var h = s.match(/^([\w:-]*)\s*(.*)$/),
              l = h[1] + o.eventNamespace,
              c = h[2];
            c ? n.on(l, c, r) : i.on(l, r);
          });
      },
      _off: function (e, i) {
        (i = (i || '').split(' ').join(this.eventNamespace + ' ') + this.eventNamespace),
          e.off(i).off(i),
          (this.bindings = t(this.bindings.not(e).get())),
          (this.focusable = t(this.focusable.not(e).get())),
          (this.hoverable = t(this.hoverable.not(e).get()));
      },
      _delay: function (t, e) {
        function i() {
          return ('string' == typeof t ? s[t] : t).apply(s, arguments);
        }
        var s = this;
        return setTimeout(i, e || 0);
      },
      _hoverable: function (e) {
        (this.hoverable = this.hoverable.add(e)),
          this._on(e, {
            mouseenter: function (e) {
              this._addClass(t(e.currentTarget), null, 'ui-state-hover');
            },
            mouseleave: function (e) {
              this._removeClass(t(e.currentTarget), null, 'ui-state-hover');
            },
          });
      },
      _focusable: function (e) {
        (this.focusable = this.focusable.add(e)),
          this._on(e, {
            focusin: function (e) {
              this._addClass(t(e.currentTarget), null, 'ui-state-focus');
            },
            focusout: function (e) {
              this._removeClass(t(e.currentTarget), null, 'ui-state-focus');
            },
          });
      },
      _trigger: function (e, i, s) {
        var n,
          o,
          a = this.options[e];
        if (
          ((s = s || {}),
          (i = t.Event(i)),
          (i.type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase()),
          (i.target = this.element[0]),
          (o = i.originalEvent))
        )
          for (n in o) n in i || (i[n] = o[n]);
        return this.element.trigger(i, s), !((t.isFunction(a) && a.apply(this.element[0], [i].concat(s)) === !1) || i.isDefaultPrevented());
      },
    }),
    t.each({ show: 'fadeIn', hide: 'fadeOut' }, function (e, i) {
      t.Widget.prototype['_' + e] = function (s, n, o) {
        'string' == typeof n && (n = { effect: n });
        var a,
          r = n ? (n === !0 || 'number' == typeof n ? i : n.effect || i) : e;
        (n = n || {}),
          'number' == typeof n && (n = { duration: n }),
          (a = !t.isEmptyObject(n)),
          (n.complete = o),
          n.delay && s.delay(n.delay),
          a && t.effects && t.effects.effect[r]
            ? s[e](n)
            : r !== e && s[r]
            ? s[r](n.duration, n.easing, o)
            : s.queue(function (i) {
                t(this)[e](), o && o.call(s[0]), i();
              });
      };
    }),
    t.widget,
    (t.ui.keyCode = {
      BACKSPACE: 8,
      COMMA: 188,
      DELETE: 46,
      DOWN: 40,
      END: 35,
      ENTER: 13,
      ESCAPE: 27,
      HOME: 36,
      LEFT: 37,
      PAGE_DOWN: 34,
      PAGE_UP: 33,
      PERIOD: 190,
      RIGHT: 39,
      SPACE: 32,
      TAB: 9,
      UP: 38,
    }),
    (t.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()));
  var s = !1;
  t(document).on('mouseup', function () {
    s = !1;
  }),
    t.widget('ui.mouse', {
      version: '1.12.1',
      options: { cancel: 'input, textarea, button, select, option', distance: 1, delay: 0 },
      _mouseInit: function () {
        var e = this;
        this.element
          .on('mousedown.' + this.widgetName, function (t) {
            return e._mouseDown(t);
          })
          .on('click.' + this.widgetName, function (i) {
            return !0 === t.data(i.target, e.widgetName + '.preventClickEvent')
              ? (t.removeData(i.target, e.widgetName + '.preventClickEvent'), i.stopImmediatePropagation(), !1)
              : void 0;
          }),
          (this.started = !1);
      },
      _mouseDestroy: function () {
        this.element.off('.' + this.widgetName),
          this._mouseMoveDelegate &&
            this.document
              .off('mousemove.' + this.widgetName, this._mouseMoveDelegate)
              .off('mouseup.' + this.widgetName, this._mouseUpDelegate);
      },
      _mouseDown: function (e) {
        if (!s) {
          (this._mouseMoved = !1), this._mouseStarted && this._mouseUp(e), (this._mouseDownEvent = e);
          var i = this,
            n = 1 === e.which,
            o = 'string' == typeof this.options.cancel && e.target.nodeName ? t(e.target).closest(this.options.cancel).length : !1;
          return n && !o && this._mouseCapture(e)
            ? ((this.mouseDelayMet = !this.options.delay),
              this.mouseDelayMet ||
                (this._mouseDelayTimer = setTimeout(function () {
                  i.mouseDelayMet = !0;
                }, this.options.delay)),
              this._mouseDistanceMet(e) &&
              this._mouseDelayMet(e) &&
              ((this._mouseStarted = this._mouseStart(e) !== !1), !this._mouseStarted)
                ? (e.preventDefault(), !0)
                : (!0 === t.data(e.target, this.widgetName + '.preventClickEvent') &&
                    t.removeData(e.target, this.widgetName + '.preventClickEvent'),
                  (this._mouseMoveDelegate = function (t) {
                    return i._mouseMove(t);
                  }),
                  (this._mouseUpDelegate = function (t) {
                    return i._mouseUp(t);
                  }),
                  this.document
                    .on('mousemove.' + this.widgetName, this._mouseMoveDelegate)
                    .on('mouseup.' + this.widgetName, this._mouseUpDelegate),
                  e.preventDefault(),
                  (s = !0),
                  !0))
            : !0;
        }
      },
      _mouseMove: function (e) {
        if (this._mouseMoved) {
          if (t.ui.ie && (!document.documentMode || 9 > document.documentMode) && !e.button) return this._mouseUp(e);
          if (!e.which)
            if (e.originalEvent.altKey || e.originalEvent.ctrlKey || e.originalEvent.metaKey || e.originalEvent.shiftKey)
              this.ignoreMissingWhich = !0;
            else if (!this.ignoreMissingWhich) return this._mouseUp(e);
        }
        return (
          (e.which || e.button) && (this._mouseMoved = !0),
          this._mouseStarted
            ? (this._mouseDrag(e), e.preventDefault())
            : (this._mouseDistanceMet(e) &&
                this._mouseDelayMet(e) &&
                ((this._mouseStarted = this._mouseStart(this._mouseDownEvent, e) !== !1),
                this._mouseStarted ? this._mouseDrag(e) : this._mouseUp(e)),
              !this._mouseStarted)
        );
      },
      _mouseUp: function (e) {
        this.document.off('mousemove.' + this.widgetName, this._mouseMoveDelegate).off('mouseup.' + this.widgetName, this._mouseUpDelegate),
          this._mouseStarted &&
            ((this._mouseStarted = !1),
            e.target === this._mouseDownEvent.target && t.data(e.target, this.widgetName + '.preventClickEvent', !0),
            this._mouseStop(e)),
          this._mouseDelayTimer && (clearTimeout(this._mouseDelayTimer), delete this._mouseDelayTimer),
          (this.ignoreMissingWhich = !1),
          (s = !1),
          e.preventDefault();
      },
      _mouseDistanceMet: function (t) {
        return (
          Math.max(Math.abs(this._mouseDownEvent.pageX - t.pageX), Math.abs(this._mouseDownEvent.pageY - t.pageY)) >= this.options.distance
        );
      },
      _mouseDelayMet: function () {
        return this.mouseDelayMet;
      },
      _mouseStart: function () {},
      _mouseDrag: function () {},
      _mouseStop: function () {},
      _mouseCapture: function () {
        return !0;
      },
    }),
    t.widget('ui.slider', t.ui.mouse, {
      version: '1.12.1',
      widgetEventPrefix: 'slide',
      options: {
        animate: !1,
        classes: { 'ui-slider': 'ui-corner-all', 'ui-slider-handle': 'ui-corner-all', 'ui-slider-range': 'ui-corner-all ui-widget-header' },
        distance: 0,
        max: 100,
        min: 0,
        orientation: 'horizontal',
        range: !1,
        step: 1,
        value: 0,
        values: null,
        change: null,
        slide: null,
        start: null,
        stop: null,
      },
      numPages: 5,
      _create: function () {
        (this._keySliding = !1),
          (this._mouseSliding = !1),
          (this._animateOff = !0),
          (this._handleIndex = null),
          this._detectOrientation(),
          this._mouseInit(),
          this._calculateNewMax(),
          this._addClass('ui-slider ui-slider-' + this.orientation, 'ui-widget ui-widget-content'),
          this._refresh(),
          (this._animateOff = !1);
      },
      _refresh: function () {
        this._createRange(), this._createHandles(), this._setupEvents(), this._refreshValue();
      },
      _createHandles: function () {
        var e,
          i,
          s = this.options,
          n = this.element.find('.ui-slider-handle'),
          o = "<span tabindex='0'></span>",
          a = [];
        for (i = (s.values && s.values.length) || 1, n.length > i && (n.slice(i).remove(), (n = n.slice(0, i))), e = n.length; i > e; e++)
          a.push(o);
        (this.handles = n.add(t(a.join('')).appendTo(this.element))),
          this._addClass(this.handles, 'ui-slider-handle', 'ui-state-default'),
          (this.handle = this.handles.eq(0)),
          this.handles.each(function (e) {
            t(this).data('ui-slider-handle-index', e).attr('tabIndex', 0);
          });
      },
      _createRange: function () {
        var e = this.options;
        e.range
          ? (e.range === !0 &&
              (e.values
                ? e.values.length && 2 !== e.values.length
                  ? (e.values = [e.values[0], e.values[0]])
                  : t.isArray(e.values) && (e.values = e.values.slice(0))
                : (e.values = [this._valueMin(), this._valueMin()])),
            this.range && this.range.length
              ? (this._removeClass(this.range, 'ui-slider-range-min ui-slider-range-max'), this.range.css({ left: '', bottom: '' }))
              : ((this.range = t('<div>').appendTo(this.element)), this._addClass(this.range, 'ui-slider-range')),
            ('min' === e.range || 'max' === e.range) && this._addClass(this.range, 'ui-slider-range-' + e.range))
          : (this.range && this.range.remove(), (this.range = null));
      },
      _setupEvents: function () {
        this._off(this.handles), this._on(this.handles, this._handleEvents), this._hoverable(this.handles), this._focusable(this.handles);
      },
      _destroy: function () {
        this.handles.remove(), this.range && this.range.remove(), this._mouseDestroy();
      },
      _mouseCapture: function (e) {
        var i,
          s,
          n,
          o,
          a,
          r,
          h,
          l,
          c = this,
          u = this.options;
        return u.disabled
          ? !1
          : ((this.elementSize = { width: this.element.outerWidth(), height: this.element.outerHeight() }),
            (this.elementOffset = this.element.offset()),
            (i = { x: e.pageX, y: e.pageY }),
            (s = this._normValueFromMouse(i)),
            (n = this._valueMax() - this._valueMin() + 1),
            this.handles.each(function (e) {
              var i = Math.abs(s - c.values(e));
              (n > i || (n === i && (e === c._lastChangedValue || c.values(e) === u.min))) && ((n = i), (o = t(this)), (a = e));
            }),
            (r = this._start(e, a)),
            r === !1
              ? !1
              : ((this._mouseSliding = !0),
                (this._handleIndex = a),
                this._addClass(o, null, 'ui-state-active'),
                o.trigger('focus'),
                (h = o.offset()),
                (l = !t(e.target).parents().addBack().is('.ui-slider-handle')),
                (this._clickOffset = l
                  ? { left: 0, top: 0 }
                  : {
                      left: e.pageX - h.left - o.width() / 2,
                      top:
                        e.pageY -
                        h.top -
                        o.height() / 2 -
                        (parseInt(o.css('borderTopWidth'), 10) || 0) -
                        (parseInt(o.css('borderBottomWidth'), 10) || 0) +
                        (parseInt(o.css('marginTop'), 10) || 0),
                    }),
                this.handles.hasClass('ui-state-hover') || this._slide(e, a, s),
                (this._animateOff = !0),
                !0));
      },
      _mouseStart: function () {
        return !0;
      },
      _mouseDrag: function (t) {
        var e = { x: t.pageX, y: t.pageY },
          i = this._normValueFromMouse(e);
        return this._slide(t, this._handleIndex, i), !1;
      },
      _mouseStop: function (t) {
        return (
          this._removeClass(this.handles, null, 'ui-state-active'),
          (this._mouseSliding = !1),
          this._stop(t, this._handleIndex),
          this._change(t, this._handleIndex),
          (this._handleIndex = null),
          (this._clickOffset = null),
          (this._animateOff = !1),
          !1
        );
      },
      _detectOrientation: function () {
        this.orientation = 'vertical' === this.options.orientation ? 'vertical' : 'horizontal';
      },
      _normValueFromMouse: function (t) {
        var e, i, s, n, o;
        return (
          'horizontal' === this.orientation
            ? ((e = this.elementSize.width), (i = t.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)))
            : ((e = this.elementSize.height), (i = t.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0))),
          (s = i / e),
          s > 1 && (s = 1),
          0 > s && (s = 0),
          'vertical' === this.orientation && (s = 1 - s),
          (n = this._valueMax() - this._valueMin()),
          (o = this._valueMin() + s * n),
          this._trimAlignValue(o)
        );
      },
      _uiHash: function (t, e, i) {
        var s = { handle: this.handles[t], handleIndex: t, value: void 0 !== e ? e : this.value() };
        return this._hasMultipleValues() && ((s.value = void 0 !== e ? e : this.values(t)), (s.values = i || this.values())), s;
      },
      _hasMultipleValues: function () {
        return this.options.values && this.options.values.length;
      },
      _start: function (t, e) {
        return this._trigger('start', t, this._uiHash(e));
      },
      _slide: function (t, e, i) {
        var s,
          n,
          o = this.value(),
          a = this.values();
        this._hasMultipleValues() &&
          ((n = this.values(e ? 0 : 1)),
          (o = this.values(e)),
          2 === this.options.values.length && this.options.range === !0 && (i = 0 === e ? Math.min(n, i) : Math.max(n, i)),
          (a[e] = i)),
          i !== o &&
            ((s = this._trigger('slide', t, this._uiHash(e, i, a))),
            s !== !1 && (this._hasMultipleValues() ? this.values(e, i) : this.value(i)));
      },
      _stop: function (t, e) {
        this._trigger('stop', t, this._uiHash(e));
      },
      _change: function (t, e) {
        this._keySliding || this._mouseSliding || ((this._lastChangedValue = e), this._trigger('change', t, this._uiHash(e)));
      },
      value: function (t) {
        return arguments.length
          ? ((this.options.value = this._trimAlignValue(t)), this._refreshValue(), this._change(null, 0), void 0)
          : this._value();
      },
      values: function (e, i) {
        var s, n, o;
        if (arguments.length > 1)
          return (this.options.values[e] = this._trimAlignValue(i)), this._refreshValue(), this._change(null, e), void 0;
        if (!arguments.length) return this._values();
        if (!t.isArray(arguments[0])) return this._hasMultipleValues() ? this._values(e) : this.value();
        for (s = this.options.values, n = arguments[0], o = 0; s.length > o; o += 1)
          (s[o] = this._trimAlignValue(n[o])), this._change(null, o);
        this._refreshValue();
      },
      _setOption: function (e, i) {
        var s,
          n = 0;
        switch (
          ('range' === e &&
            this.options.range === !0 &&
            ('min' === i
              ? ((this.options.value = this._values(0)), (this.options.values = null))
              : 'max' === i && ((this.options.value = this._values(this.options.values.length - 1)), (this.options.values = null))),
          t.isArray(this.options.values) && (n = this.options.values.length),
          this._super(e, i),
          e)
        ) {
          case 'orientation':
            this._detectOrientation(),
              this._removeClass('ui-slider-horizontal ui-slider-vertical')._addClass('ui-slider-' + this.orientation),
              this._refreshValue(),
              this.options.range && this._refreshRange(i),
              this.handles.css('horizontal' === i ? 'bottom' : 'left', '');
            break;
          case 'value':
            (this._animateOff = !0), this._refreshValue(), this._change(null, 0), (this._animateOff = !1);
            break;
          case 'values':
            for (this._animateOff = !0, this._refreshValue(), s = n - 1; s >= 0; s--) this._change(null, s);
            this._animateOff = !1;
            break;
          case 'step':
          case 'min':
          case 'max':
            (this._animateOff = !0), this._calculateNewMax(), this._refreshValue(), (this._animateOff = !1);
            break;
          case 'range':
            (this._animateOff = !0), this._refresh(), (this._animateOff = !1);
        }
      },
      _setOptionDisabled: function (t) {
        this._super(t), this._toggleClass(null, 'ui-state-disabled', !!t);
      },
      _value: function () {
        var t = this.options.value;
        return (t = this._trimAlignValue(t));
      },
      _values: function (t) {
        var e, i, s;
        if (arguments.length) return (e = this.options.values[t]), (e = this._trimAlignValue(e));
        if (this._hasMultipleValues()) {
          for (i = this.options.values.slice(), s = 0; i.length > s; s += 1) i[s] = this._trimAlignValue(i[s]);
          return i;
        }
        return [];
      },
      _trimAlignValue: function (t) {
        if (this._valueMin() >= t) return this._valueMin();
        if (t >= this._valueMax()) return this._valueMax();
        var e = this.options.step > 0 ? this.options.step : 1,
          i = (t - this._valueMin()) % e,
          s = t - i;
        return 2 * Math.abs(i) >= e && (s += i > 0 ? e : -e), parseFloat(s.toFixed(5));
      },
      _calculateNewMax: function () {
        var t = this.options.max,
          e = this._valueMin(),
          i = this.options.step,
          s = Math.round((t - e) / i) * i;
        (t = s + e), t > this.options.max && (t -= i), (this.max = parseFloat(t.toFixed(this._precision())));
      },
      _precision: function () {
        var t = this._precisionOf(this.options.step);
        return null !== this.options.min && (t = Math.max(t, this._precisionOf(this.options.min))), t;
      },
      _precisionOf: function (t) {
        var e = '' + t,
          i = e.indexOf('.');
        return -1 === i ? 0 : e.length - i - 1;
      },
      _valueMin: function () {
        return this.options.min;
      },
      _valueMax: function () {
        return this.max;
      },
      _refreshRange: function (t) {
        'vertical' === t && this.range.css({ width: '', left: '' }), 'horizontal' === t && this.range.css({ height: '', bottom: '' });
      },
      _refreshValue: function () {
        var e,
          i,
          s,
          n,
          o,
          a = this.options.range,
          r = this.options,
          h = this,
          l = this._animateOff ? !1 : r.animate,
          c = {};
        this._hasMultipleValues()
          ? this.handles.each(function (s) {
              (i = 100 * ((h.values(s) - h._valueMin()) / (h._valueMax() - h._valueMin()))),
                (c['horizontal' === h.orientation ? 'left' : 'bottom'] = i + '%'),
                t(this).stop(1, 1)[l ? 'animate' : 'css'](c, r.animate),
                h.options.range === !0 &&
                  ('horizontal' === h.orientation
                    ? (0 === s && h.range.stop(1, 1)[l ? 'animate' : 'css']({ left: i + '%' }, r.animate),
                      1 === s && h.range[l ? 'animate' : 'css']({ width: i - e + '%' }, { queue: !1, duration: r.animate }))
                    : (0 === s && h.range.stop(1, 1)[l ? 'animate' : 'css']({ bottom: i + '%' }, r.animate),
                      1 === s && h.range[l ? 'animate' : 'css']({ height: i - e + '%' }, { queue: !1, duration: r.animate }))),
                (e = i);
            })
          : ((s = this.value()),
            (n = this._valueMin()),
            (o = this._valueMax()),
            (i = o !== n ? 100 * ((s - n) / (o - n)) : 0),
            (c['horizontal' === this.orientation ? 'left' : 'bottom'] = i + '%'),
            this.handle.stop(1, 1)[l ? 'animate' : 'css'](c, r.animate),
            'min' === a && 'horizontal' === this.orientation && this.range.stop(1, 1)[l ? 'animate' : 'css']({ width: i + '%' }, r.animate),
            'max' === a &&
              'horizontal' === this.orientation &&
              this.range.stop(1, 1)[l ? 'animate' : 'css']({ width: 100 - i + '%' }, r.animate),
            'min' === a && 'vertical' === this.orientation && this.range.stop(1, 1)[l ? 'animate' : 'css']({ height: i + '%' }, r.animate),
            'max' === a &&
              'vertical' === this.orientation &&
              this.range.stop(1, 1)[l ? 'animate' : 'css']({ height: 100 - i + '%' }, r.animate));
      },
      _handleEvents: {
        keydown: function (e) {
          var i,
            s,
            n,
            o,
            a = t(e.target).data('ui-slider-handle-index');
          switch (e.keyCode) {
            case t.ui.keyCode.HOME:
            case t.ui.keyCode.END:
            case t.ui.keyCode.PAGE_UP:
            case t.ui.keyCode.PAGE_DOWN:
            case t.ui.keyCode.UP:
            case t.ui.keyCode.RIGHT:
            case t.ui.keyCode.DOWN:
            case t.ui.keyCode.LEFT:
              if (
                (e.preventDefault(),
                !this._keySliding &&
                  ((this._keySliding = !0), this._addClass(t(e.target), null, 'ui-state-active'), (i = this._start(e, a)), i === !1))
              )
                return;
          }
          switch (((o = this.options.step), (s = n = this._hasMultipleValues() ? this.values(a) : this.value()), e.keyCode)) {
            case t.ui.keyCode.HOME:
              n = this._valueMin();
              break;
            case t.ui.keyCode.END:
              n = this._valueMax();
              break;
            case t.ui.keyCode.PAGE_UP:
              n = this._trimAlignValue(s + (this._valueMax() - this._valueMin()) / this.numPages);
              break;
            case t.ui.keyCode.PAGE_DOWN:
              n = this._trimAlignValue(s - (this._valueMax() - this._valueMin()) / this.numPages);
              break;
            case t.ui.keyCode.UP:
            case t.ui.keyCode.RIGHT:
              if (s === this._valueMax()) return;
              n = this._trimAlignValue(s + o);
              break;
            case t.ui.keyCode.DOWN:
            case t.ui.keyCode.LEFT:
              if (s === this._valueMin()) return;
              n = this._trimAlignValue(s - o);
          }
          this._slide(e, a, n);
        },
        keyup: function (e) {
          var i = t(e.target).data('ui-slider-handle-index');
          this._keySliding &&
            ((this._keySliding = !1), this._stop(e, i), this._change(e, i), this._removeClass(t(e.target), null, 'ui-state-active'));
        },
      },
    });
});
!(function (a) {
  function f(a, b) {
    if (!(a.originalEvent.touches.length > 1)) {
      a.preventDefault();
      var c = a.originalEvent.changedTouches[0],
        d = document.createEvent('MouseEvents');
      d.initMouseEvent(b, !0, !0, window, 1, c.screenX, c.screenY, c.clientX, c.clientY, !1, !1, !1, !1, 0, null),
        a.target.dispatchEvent(d);
    }
  }
  if (((a.support.touch = 'ontouchend' in document), a.support.touch)) {
    var e,
      b = a.ui.mouse.prototype,
      c = b._mouseInit,
      d = b._mouseDestroy;
    (b._touchStart = function (a) {
      var b = this;
      !e &&
        b._mouseCapture(a.originalEvent.changedTouches[0]) &&
        ((e = !0), (b._touchMoved = !1), f(a, 'mouseover'), f(a, 'mousemove'), f(a, 'mousedown'));
    }),
      (b._touchMove = function (a) {
        e && ((this._touchMoved = !0), f(a, 'mousemove'));
      }),
      (b._touchEnd = function (a) {
        e && (f(a, 'mouseup'), f(a, 'mouseout'), this._touchMoved || f(a, 'click'), (e = !1));
      }),
      (b._mouseInit = function () {
        var b = this;
        b.element.bind({ touchstart: a.proxy(b, '_touchStart'), touchmove: a.proxy(b, '_touchMove'), touchend: a.proxy(b, '_touchEnd') }),
          c.call(b);
      }),
      (b._mouseDestroy = function () {
        var b = this;
        b.element.unbind({ touchstart: a.proxy(b, '_touchStart'), touchmove: a.proxy(b, '_touchMove'), touchend: a.proxy(b, '_touchEnd') }),
          d.call(b);
      });
  }
})(jQuery);

/*
 * jQuery-Simple-Timer
 *
 * Creates a countdown timer.
 *
 * Example:
 *   $('.timer').startTimer();
 *
 */
!(function (t) {
  'object' == typeof module && 'object' == typeof module.exports
    ? (module.exports = function (e) {
        t(e, window, document);
      })
    : t(jQuery, window, document);
})(function (t, e, n, o) {
  var s;
  Number.isFinite =
    Number.isFinite ||
    function (t) {
      return 'number' == typeof t && isFinite(t);
    };
  var i = function (t) {
    return (this._options = {}), (this.targetElement = t), this;
  };
  (i.start = function (t, e) {
    return (
      (function (t, e) {
        (e = e || {}), (t._options.elementContainer = e.elementContainer || 'div');
        var n = e.classNames || {};
        (t._options.classNameSeconds = n.seconds || 'jst-seconds'),
          (t._options.classNameMinutes = n.minutes || 'jst-minutes'),
          (t._options.classNameHours = n.hours || 'jst-hours'),
          (t._options.classNameClearDiv = n.clearDiv || 'jst-clearDiv'),
          (t._options.classNameTimeout = n.timeout || 'jst-timeout');
      })((s = new i(e)), t),
      s.start(t)
    );
  }),
    (i.prototype.start = function (e) {
      var o = this,
        i = function (t) {
          var e = n.createElement(o._options.elementContainer);
          e.className = o._options.classNameSeconds;
          var s = n.createElement(o._options.elementContainer);
          s.className = o._options.classNameMinutes;
          var i = n.createElement(o._options.elementContainer);
          i.className = o._options.classNameHours;
          var r = n.createElement(o._options.elementContainer);
          return (r.className = o._options.classNameClearDiv), t.append(i).append(s).append(e).append(r);
        };
      this.targetElement.each(
        function (n, o) {
          var r = this,
            a = t(o),
            u = a.attr('class');
          return (
            a.on('complete', function () {
              clearInterval(a.intervalId);
            }),
            a.on('complete', function () {
              a.onComplete(a);
            }),
            a.on('complete', function () {
              a.addClass(r._options.classNameTimeout);
            }),
            a.on('complete', function () {
              e && !0 === e.loop && s.resetTimer(a, e, u);
            }),
            a.on('pause', function () {
              clearInterval(a.intervalId), (a.paused = !0);
            }),
            a.on('resume', function () {
              (a.paused = !1), r.startCountdown(a, { secondsLeft: a.data('timeLeft') });
            }),
            i(a),
            this.startCountdown(a, e)
          );
        }.bind(this)
      );
    }),
    (i.prototype.resetTimer = function (t, e, n) {
      var o = 0;
      e.loopInterval && (o = 1e3 * parseInt(e.loopInterval, 10)),
        setTimeout(function () {
          t.trigger('reset'), t.attr('class', n + ' loop'), s.startCountdown(t, e);
        }, o);
    }),
    (i.prototype.fetchSecondsLeft = function (t) {
      var e = t.data('seconds-left'),
        n = t.data('minutes-left');
      if (Number.isFinite(e)) return parseInt(e, 10);
      if (Number.isFinite(n)) return 60 * parseFloat(n);
      throw 'Missing time data';
    }),
    (i.prototype.startCountdown = function (t, e) {
      e = e || {};
      var n = null,
        o = function () {
          return clearInterval(n), this.clearTimer(t);
        }.bind(this);
      (t.onComplete = e.onComplete || o),
        (t.allowPause = e.allowPause || !1),
        t.allowPause &&
          t.on('click', function () {
            t.paused ? t.trigger('resume') : t.trigger('pause');
          });
      var s = e.secondsLeft || this.fetchSecondsLeft(t),
        i = e.refreshRate || 1e3,
        r = s + this.currentTime(),
        a = r - this.currentTime();
      this.setFinalValue(this.formatTimeLeft(a), t),
        (n = setInterval(
          function () {
            (a = r - this.currentTime()) < 0 && (a = 0), t.data('timeLeft', a), this.setFinalValue(this.formatTimeLeft(a), t);
          }.bind(this),
          i
        )),
        (t.intervalId = n);
    }),
    (i.prototype.clearTimer = function (t) {
      t.find('.jst-seconds').text('00'), t.find('.jst-minutes').text('00:'), t.find('.jst-hours').text('00:');
    }),
    (i.prototype.currentTime = function () {
      return Math.round(new Date().getTime() / 1e3);
    }),
    (i.prototype.formatTimeLeft = function (t) {
      var e = function (t, e) {
          return (t += '').length >= (e = e || 2) ? t : Array(e - t.length + 1).join(0) + t;
        },
        n = Math.floor(t / 3600);
      t -= 3600 * n;
      var o = Math.floor(t / 60);
      t -= 60 * o;
      var s = parseInt(t % 60, 10);
      return 0 == +n && 0 == +o && 0 == +s ? [] : [e(n), e(o), e(s)];
    }),
    (i.prototype.setFinalValue = function (t, e) {
      if (0 === t.length) return this.clearTimer(e), e.trigger('complete'), !1;
      e.find('.' + this._options.classNameSeconds).text(t.pop()),
        e.find('.' + this._options.classNameMinutes).text(t.pop() + ':'),
        e.find('.' + this._options.classNameHours).text(t.pop() + ':');
    }),
    (t.fn.startTimer = function (t) {
      return (this.TimerObject = i), i.start(t, this), this;
    });
});

/*
    jQuery Masked Input Plugin
    Copyright (c) 2007 - 2015 Josh Bush (digitalbush.com)
    Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
    Version: 1.4.1
*/
!(function (a) {
  'function' == typeof define && define.amd ? define(['jquery'], a) : a('object' == typeof exports ? require('jquery') : jQuery);
})(function (a) {
  var b,
    c = navigator.userAgent,
    d = /iphone/i.test(c),
    e = /chrome/i.test(c),
    f = /android/i.test(c);
  (a.mask = { definitions: { 9: '[0-9]', a: '[A-Za-z]', '*': '[A-Za-z0-9]' }, autoclear: !0, dataName: 'rawMaskFn', placeholder: '_' }),
    a.fn.extend({
      caret: function (a, b) {
        var c;
        if (0 !== this.length && !this.is(':hidden'))
          return 'number' == typeof a
            ? ((b = 'number' == typeof b ? b : a),
              this.each(function () {
                this.setSelectionRange
                  ? this.setSelectionRange(a, b)
                  : this.createTextRange &&
                    ((c = this.createTextRange()), c.collapse(!0), c.moveEnd('character', b), c.moveStart('character', a), c.select());
              }))
            : (this[0].setSelectionRange
                ? ((a = this[0].selectionStart), (b = this[0].selectionEnd))
                : document.selection &&
                  document.selection.createRange &&
                  ((c = document.selection.createRange()), (a = 0 - c.duplicate().moveStart('character', -1e5)), (b = a + c.text.length)),
              { begin: a, end: b });
      },
      unmask: function () {
        return this.trigger('unmask');
      },
      mask: function (c, g) {
        var h, i, j, k, l, m, n, o;
        if (!c && this.length > 0) {
          h = a(this[0]);
          var p = h.data(a.mask.dataName);
          return p ? p() : void 0;
        }
        return (
          (g = a.extend({ autoclear: a.mask.autoclear, placeholder: a.mask.placeholder, completed: null }, g)),
          (i = a.mask.definitions),
          (j = []),
          (k = n = c.length),
          (l = null),
          a.each(c.split(''), function (a, b) {
            '?' == b
              ? (n--, (k = a))
              : i[b]
              ? (j.push(new RegExp(i[b])), null === l && (l = j.length - 1), k > a && (m = j.length - 1))
              : j.push(null);
          }),
          this.trigger('unmask').each(function () {
            function h() {
              if (g.completed) {
                for (var a = l; m >= a; a++) if (j[a] && C[a] === p(a)) return;
                g.completed.call(B);
              }
            }
            function p(a) {
              return g.placeholder.charAt(a < g.placeholder.length ? a : 0);
            }
            function q(a) {
              for (; ++a < n && !j[a]; );
              return a;
            }
            function r(a) {
              for (; --a >= 0 && !j[a]; );
              return a;
            }
            function s(a, b) {
              var c, d;
              if (!(0 > a)) {
                for (c = a, d = q(b); n > c; c++)
                  if (j[c]) {
                    if (!(n > d && j[c].test(C[d]))) break;
                    (C[c] = C[d]), (C[d] = p(d)), (d = q(d));
                  }
                z(), B.caret(Math.max(l, a));
              }
            }
            function t(a) {
              var b, c, d, e;
              for (b = a, c = p(a); n > b; b++)
                if (j[b]) {
                  if (((d = q(b)), (e = C[b]), (C[b] = c), !(n > d && j[d].test(e)))) break;
                  c = e;
                }
            }
            function u() {
              var a = B.val(),
                b = B.caret();
              if (o && o.length && o.length > a.length) {
                for (A(!0); b.begin > 0 && !j[b.begin - 1]; ) b.begin--;
                if (0 === b.begin) for (; b.begin < l && !j[b.begin]; ) b.begin++;
                B.caret(b.begin, b.begin);
              } else {
                for (A(!0); b.begin < n && !j[b.begin]; ) b.begin++;
                B.caret(b.begin, b.begin);
              }
              h();
            }
            function v() {
              A(), B.val() != E && B.change();
            }
            function w(a) {
              if (!B.prop('readonly')) {
                var b,
                  c,
                  e,
                  f = a.which || a.keyCode;
                (o = B.val()),
                  8 === f || 46 === f || (d && 127 === f)
                    ? ((b = B.caret()),
                      (c = b.begin),
                      (e = b.end),
                      e - c === 0 && ((c = 46 !== f ? r(c) : (e = q(c - 1))), (e = 46 === f ? q(e) : e)),
                      y(c, e),
                      s(c, e - 1),
                      a.preventDefault())
                    : 13 === f
                    ? v.call(this, a)
                    : 27 === f && (B.val(E), B.caret(0, A()), a.preventDefault());
              }
            }
            function x(b) {
              if (!B.prop('readonly')) {
                var c,
                  d,
                  e,
                  g = b.which || b.keyCode,
                  i = B.caret();
                if (!(b.ctrlKey || b.altKey || b.metaKey || 32 > g) && g && 13 !== g) {
                  if (
                    (i.end - i.begin !== 0 && (y(i.begin, i.end), s(i.begin, i.end - 1)),
                    (c = q(i.begin - 1)),
                    n > c && ((d = String.fromCharCode(g)), j[c].test(d)))
                  ) {
                    if ((t(c), (C[c] = d), z(), (e = q(c)), f)) {
                      var k = function () {
                        a.proxy(a.fn.caret, B, e)();
                      };
                      setTimeout(k, 0);
                    } else B.caret(e);
                    i.begin <= m && h();
                  }
                  b.preventDefault();
                }
              }
            }
            function y(a, b) {
              var c;
              for (c = a; b > c && n > c; c++) j[c] && (C[c] = p(c));
            }
            function z() {
              B.val(C.join(''));
            }
            function A(a) {
              var b,
                c,
                d,
                e = B.val(),
                f = -1;
              for (b = 0, d = 0; n > b; b++)
                if (j[b]) {
                  for (C[b] = p(b); d++ < e.length; )
                    if (((c = e.charAt(d - 1)), j[b].test(c))) {
                      (C[b] = c), (f = b);
                      break;
                    }
                  if (d > e.length) {
                    y(b + 1, n);
                    break;
                  }
                } else C[b] === e.charAt(d) && d++, k > b && (f = b);
              return (
                a
                  ? z()
                  : k > f + 1
                  ? g.autoclear || C.join('') === D
                    ? (B.val() && B.val(''), y(0, n))
                    : z()
                  : (z(), B.val(B.val().substring(0, f + 1))),
                k ? b : l
              );
            }
            var B = a(this),
              C = a.map(c.split(''), function (a, b) {
                return '?' != a ? (i[a] ? p(b) : a) : void 0;
              }),
              D = C.join(''),
              E = B.val();
            B.data(a.mask.dataName, function () {
              return a
                .map(C, function (a, b) {
                  return j[b] && a != p(b) ? a : null;
                })
                .join('');
            }),
              B.one('unmask', function () {
                B.off('.mask').removeData(a.mask.dataName);
              })
                .on('focus.mask', function () {
                  if (!B.prop('readonly')) {
                    clearTimeout(b);
                    var a;
                    (E = B.val()),
                      (a = A()),
                      (b = setTimeout(function () {
                        B.get(0) === document.activeElement && (z(), a == c.replace('?', '').length ? B.caret(0, a) : B.caret(a));
                      }, 10));
                  }
                })
                .on('blur.mask', v)
                .on('keydown.mask', w)
                .on('keypress.mask', x)
                .on('input.mask paste.mask', function () {
                  B.prop('readonly') ||
                    setTimeout(function () {
                      var a = A(!0);
                      B.caret(a), h();
                    }, 0);
                }),
              e && f && B.off('input.mask').on('input.mask', u),
              A();
          })
        );
      },
    });
});
('use strict');
/* header-menu */

$(document).on('click', '.header-nav-open', function (event) {
  $('html').addClass('header-nav-opened header-nav-is-open');
  return false;
});
$(document).on('click', function (event) {
  if (event.isTrigger) return;
  if ($(event.target).closest('.header-nav-open, .header-nav .container').length) return;
  if (!$('html').hasClass('header-nav-opened')) return;
  if ($('#modal-delivery').hasClass('open')) return;
  closeHeaderMenu();
});
$(document).on('click', '.header-nav-close', function () {
  closeHeaderMenu();
  return false;
});

function closeHeaderMenu() {
  $('html').removeClass('header-nav-is-open');
  setTimeout(function () {
    $('html').removeClass('header-nav-open-opened');
  }, 600);
}

$(document).on('click', '.header-nav-is-open .catalog-menu-open', function () {
  $(this).toggleClass('active');
  $('.catalog-menu').fadeToggle(400);
});
$(document).on('click', '.header-nav-is-open .catalog-menu .catalog-menu-item-has-children>a', function (event) {
  var li = $(this).closest('li');

  if (li.hasClass('active')) {
    closeMenu();
  } else {
    closeMenu();
    li.addClass('active');
    li.children('.catalog-submenu').fadeIn(400);
  }

  function closeMenu() {
    li.parent().children('.catalog-menu-item-has-children').removeClass('active');
    li.parent()
      .children('.catalog-menu-item-has-children')
      .children('.catalog-submenu')
      .fadeOut(400, function () {
        $('.header-nav .container')
          .stop()
          .animate(
            {
              scrollTop: li.position().top + 20,
            },
            400
          );
      });
  }

  return false;
});
/* form */

$(document).on('focus', '[required]', function () {
  var t = $(this);
  t.closest('.form-block').removeClass('alert valid');
  t.attr('placeholder', t.data('placeholder'));
});
$(document).on('input', '[required]', function () {
  var t = $(this);
  if (t.hasClass('header-search-input')) return;
  t.closest('.form-block').addClass('valid');
});
$(document).on('blur', '[required]', function () {
  var t = $(this);
  if (t.hasClass('header-search-input')) return;
  if (t.hasClass('skip-valid')) return;
  var valid = true;
  setTimeout(function () {
    if (!t.val()) valid = false;

    if (t.attr('type') == 'email') {
      if (!validateEmail(t.val())) valid = false;
    }

    if (t.hasClass('confirm-password')) {
      var passwordInput = t.closest('.form').find('[data-confirm]');

      if (!passwordInput[0]) {
        passwordInput = t.closest('.form').find('[type="password"]:not(.confirm-password)');
      }

      console.log(passwordInput);
      if (t.val() !== passwordInput.val()) valid = false;
    }

    if (t.attr('min')) {
      if (+t.attr('min') < t.val().length) {
        t.val('');
        valid = false;
      }
    }

    if (t.attr('max')) {
      if (+t.attr('max') > t.val().length) {
        t.val('');
        valid = false;
      }
    }

    if (!valid) {
      t.closest('.form-block').removeClass('valid');
      t.closest('.form-block').addClass('alert');
      t.attr('placeholder', t.data('alert'));
    } else {
      t.closest('.form-block').removeClass('alert');
      t.closest('.form-block').addClass('valid');
      t.attr('placeholder', t.data('placeholder'));
    }
  }, 200);
});
$(document).on('submit', '.form', function () {
  var t = $(this);
  var validForm = true;
  var formId = t.parents('.modal').attr('id');

  t.find('[required]').each(function () {
    var t = $(this);
    if (t.hasClass('skip-valid')) return;
    var valid = true;
    if (!t.val()) valid = false;

    if (t.attr('type') == 'email') {
      if (!validateEmail(t.val())) valid = false;
    }

    if (t.hasClass('confirm-password')) {
      var passwordInput = t.closest('.form').find('[data-confirm]');

      if (!passwordInput[0]) {
        passwordInput = t.closest('.form').find('[type="password"]:not(.confirm-password)');
      }

      console.log(passwordInput);
      if (t.val() !== passwordInput.val()) valid = false;
    }

    if (t.attr('min')) {
      if (+t.attr('min') < t.val().length) {
        t.val('');
        valid = false;
      }
    }

    if (t.attr('max')) {
      if (+t.attr('max') > t.val().length) {
        t.val('');
        valid = false;
      }
    }
    if (t.hasClass('rating-input')) {
      if (t.val() == '0') {
        valid = false;
      }
    }

    if (!valid) {
      t.closest('.form-block').removeClass('valid');
      t.closest('.form-block').addClass('alert');
      t.attr('placeholder', t.data('alert'));
      validForm = false;
    } else {
      t.closest('.form-block').removeClass('alert');
      t.closest('.form-block').addClass('valid');
      t.attr('placeholder', t.data('placeholder'));
    }
  });
  if (!validForm) return false;
  if (t.hasClass('ajax-form')) {
    t.find('.submit').attr('disabled', true);
    t.ajaxSubmit({
      clearForm: true,
      success: function (answer) {
        if (formId == 'modal-addotziv') {
          console.log('feedback_send_form');
          window.dataLayer = window.dataLayer || [];
          dataLayer.push({
            event: 'feedback_send_form',
          });
        }

        if (formId == 'modal-addvopros') {
          console.log('question_send_form');
          window.dataLayer = window.dataLayer || [];
          dataLayer.push({
            event: 'question_send_form',
          });
        }

        t.find('.submit').removeAttr('disabled');
        $('#modal-sent .modal-title').text(answer);
        openModal('#modal-sent');
      },
    });
    return false;
  }
});

function validateEmail(email) {
  var re =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  return re.test(email);
}
/* sliders */

var prevSliderArrow = '<button type="button" class="slick-prev"><svg><use xlink:href="#icon-arrow-small"></use></svg></button>';
var nextSliderArrow = '<button type="button" class="slick-next"><svg><use xlink:href="#icon-arrow-small"></use></svg></button>';
$('.main-slider').slick({
  accessibility: false,
  fade: true,
  speed: 1000,
  autoplay: true,
  autoplaySpeed: 6000,
  appendArrows: $('.main-slider-arrows'),
  prevArrow: prevSliderArrow,
  nextArrow: nextSliderArrow,
});
$('.main-catalog-slider').slick({
  accessibility: false,
  speed: 600,
  slidesToShow: 3,
  slidesToScroll: 3,
  dots: true,
  appendDots: $('.main-catalog-slider-dots'),
  appendArrows: $('.main-catalog-slider-wrapp'),
  prevArrow: prevSliderArrow,
  nextArrow: nextSliderArrow,
  responsive: [
    {
      breakpoint: 1023,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 479,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
});

$('.brands-slider').slick({
  accessibility: false,
  speed: 600,
  slidesToShow: 6,
  slidesToScroll: 6,
  dots: true,
  appendDots: $('.brands-slider-dots'),
  appendArrows: $('.brands-slider-wrapp'),
  prevArrow: prevSliderArrow,
  nextArrow: nextSliderArrow,
  responsive: [
    {
      breakpoint: 1023,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 479,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
  ],
});

$('.items-slider').each(function () {
  var t = $(this);
  t.slick({
    accessibility: false,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 4,
    dots: true,
    appendDots: t.closest('.items-section').find('.items-slider-dots'),
    appendArrows: t.closest('.items-section').find('.items-slider-wrapp'),
    prevArrow: prevSliderArrow,
    nextArrow: nextSliderArrow,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 619,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
});

$('.items-slider.items-slider-komplect-more-wrapp').each(function () {
  var t = $(this);
  t.slick('unslick');
});

$('.items-slider.items-slider-analog-more').each(function () {
  var t = $(this);
  t.slick('unslick');
});

$('.item-img-slider').each(function () {
  var t = $(this);
  var video = t.data('item-video');
  if (t.find('.item-img-slide').length < 2 && !video) return;
  var options = {
    accessibility: false,
    prevArrow: prevSliderArrow,
    nextArrow: nextSliderArrow,
    dots: true,
  };

  if (video) {
    t.on('init reInit', function (event, slick) {
      if (slick.slideCount == 1) {
        console.log(t);
        t.append(
          '<ul class="slick-dots"><li><a href="' +
            video +
            '" target="_blank" class="item-video-link"><svg><use xlink:href="#icon-video"></use></svg></a></li></ul>'
        );
        return;
      }
      t.find('.slick-dots').append(
        '<li><a href="' + video + '" target="_blank" class="item-video-link"><svg><use xlink:href="#icon-video"></use></svg></a></li>'
      );
    });
  }

  t.slick(options);
  var resize;
  $(window).on('resize', function () {
    if (t.hasClass('slick-initialized')) {
      t.slick('unslick');
    }

    clearTimeout(resize);
    resize = setTimeout(function () {
      if (!t.hasClass('slick-initialized')) {
        t.slick(options);
      }
    }, 250);
  });
});
$('.about-slider').slick({
  accessibility: false,
  speed: 600,
  slidesToShow: 3,
  slidesToScroll: 3,
  dots: true,
  appendDots: $('.about-slider-dots'),
  appendArrows: $('.about-slider-wrapp'),
  prevArrow: prevSliderArrow,
  nextArrow: nextSliderArrow,
  responsive: [
    {
      breakpoint: 1023,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
});
$('.category-item-img-slider').each(function () {
  $(this).slick({
    accessibility: false,
    prevArrow: prevSliderArrow,
    nextArrow: nextSliderArrow,
    dots: true,
  });
});
$('.product-main-slider').slick({
  accessibility: false,
  // arrows: false,
  asNavFor: $('.product-nav-slider'),
  speed: 400,
});
$('.product-nav-slider').slick({
  accessibility: false,
  prevArrow: prevSliderArrow,
  nextArrow: nextSliderArrow,
  speed: 400,
  slidesToShow: 3,
  appendArrows: $('.product-nav-slider-wrapp'),
  focusOnSelect: true,
  asNavFor: $('.product-main-slider'),
  responsive: [
    {
      breakpoint: 1023,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 479,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
});
/* rating */

$('.rating').each(function () {
  var t = $(this),
    maxRating = 5,
    rating = +t.data('rating') || 0;

  for (var i = 0; i < maxRating; i++) {
    t.append('<svg><use xlink:href="#icon-star"></use></svg>');
    t.find('.rating-state').append('<svg><use xlink:href="#icon-star"></use></svg>');
  }

  t.find('.rating-state').css({
    width: (rating * t.width()) / maxRating,
  });
  var wrapp = t.closest('.rating-select');
  if (!wrapp.length) return;
  var input = wrapp.find('.rating-input');
  input.val(rating);
  var desc = ['Очень плохо', 'Плохо', 'Нормально', 'Хорошо', 'Очень хорошо'];
  $('.rating-desc').text(desc[rating - 1]);
  t.on('mousemove', function (event) {
    var x = event.clientX,
      offset = $(this).offset().left,
      position = x - offset,
      starWidth = t.width() / maxRating;

    function setRating(star) {
      t.find('.rating-state').width(starWidth * star);
      input.val(star);
      $('.rating-desc').text(desc[star - 1]);
    }

    if (position <= starWidth) {
      setRating(1);
    }

    if (position <= starWidth * 2 && position > starWidth) {
      setRating(2);
    }

    if (position <= starWidth * 3 && position > starWidth * 2) {
      setRating(3);
    }

    if (position <= starWidth * 4 && position > starWidth * 3) {
      setRating(4);
    }

    if (position > starWidth * 4) {
      setRating(5);
    }
  });
});
/* tooltip */

$('.item-state-info-link').each(function () {
  var t = $(this);
  var content = t.closest('.item-state-info').find('.item-state-tooltip-body');
  t.tooltipster({
    theme: 'tooltipster-light',
    animationDuration: 300,
    delay: 100,
    contentAsHTML: true,
    content: content,
    contentCloning: true,
    interactive: false,
    functionBefore: function functionBefore(instance, helper) {
      var t = $(helper.origin);
      t.closest('.item').addClass('hover');
    },
    functionAfter: function functionAfter(instance, helper) {
      var t = $(helper.origin);
      t.closest('.item').removeClass('hover');
    },
  });
});
$('.tooltip-link').each(function () {
  var t = $(this);
  var content = t.closest('.tooltip').find('.tooltip-content-body');
  t.tooltipster({
    theme: 'tooltipster-light',
    animationDuration: 300,
    delay: 100,
    contentAsHTML: true,
    content: content,
    contentCloning: true,
    interactive: false,
    maxWidth: 250,
  });
});
/* select-number */

(function () {
  $(document).on('click', '.select-number-btn', function (event) {
    if ($(this).hasClass('in_basket')) return;
    event.preventDefault();
    var t = $(this),
      input = t.closest('.select-number').find('.select-number-input'),
      val = input.val(),
      //min = input.attr('data-min'),
      min = 0,
      max = input.data('max') || Infinity,
      desc = input.data('desc');
    //val = val.replace(desc, '');
    val = val.replace(/[^0-9]/gim, '');
    val = +val;

    if (t.hasClass('select-number-btn-minus')) {
      var newval = val - parseInt(input.attr('data-step'));
      if (newval < min) newval = min;
      input.val(newval + ' ' + desc);
      input.attr('value', newval + ' ' + desc);
    } else {
      var newval = val + parseInt(input.attr('data-step'));
      //if (newval >= max) newval = max;
      input.val(newval + ' ' + desc);
      input.attr('value', newval + ' ' + desc);
    }
    var id = input.data('id');
    var quantity = input.val();
    $.ajax({
      method: 'GET',
      url: '/ajax/changebasket.php',
      data: {
        id: id,
        quantity: quantity,
      },
    }).done(function (answer) {
      console.log(answer);
    });
  });
  var value;
  $(document).on('focus', '.select-number-input', function () {
    value = $(this).val();
    $(this).val('');
  });
  $(document).on('blur', '.select-number-input', function () {
    var t = $(this),
      val = t.val(),
      min = t.data('min') || 0,
      max = t.data('max') || Infinity,
      desc = t.data('desc');
    val = val.replace(desc, '');
    val = +val;

    if (!val) {
      t.val(value);
      return;
    }

    if (val < min) {
      t.val(min + ' ' + desc);
      return;
    }

    /* if (val > max) {
      t.val(max + " " + desc);
      return;
    }*/

    t.val(val + ' ' + desc);
  });

  $(document).on('keypress', '.select-number-input', function (event) {
    var key, keyChar;
    if (event.keyCode) key = event.keyCode;
    else if (event.which) key = event.which;
    if (key == null || key == 0 || key == 8 || key == 13 || key == 9 || key == 39) return true;
    keyChar = String.fromCharCode(key);
    if (!/[0-9]/.test(keyChar)) return false;
  });
})();

$(document).on('click', '.item-basket-btn', function () {
  $(this).css('display', 'none');
  $(this).parent().children('.select-number').css('display', 'block');
});
$('.multiplicity').change(function () {
  var currentVal = parseInt($(this).parent().parent().children('.select-number-input').val());
  var quantityMax = parseInt($(this).parent().parent().children('.select-number-input').data('max'));
  var multiplicity = parseInt($(this).attr('multiplicity'));
  var edenica = $(this).parent().parent().children('.select-number-input').attr('data-desc');
  var newVal = 0;
  if ($(this).is(':checked')) {
    if (currentVal % multiplicity === 0) {
      newVal = currentVal;
    } else {
      var del = currentVal / multiplicity;
      newVal = (parseInt(del) + 1) * multiplicity;
    }
    /*if(newVal > quantityMax)
      newVal = quantityMax;*/
    $(this)
      .parent()
      .parent()
      .children('.select-number-input')
      .val(newVal + ' ' + edenica);
    $(this).parent().parent().children('.select-number-input').attr({
      'data-min': multiplicity,
      'data-step': multiplicity,
    });
  } else {
    $(this).parent().parent().children('.select-number-input').attr({
      'data-min': 1,
      'data-step': 1,
    });
  }
  var id = $(this).parent().parent().children('.select-number-input').data('id');
  var quantity = $(this).parent().parent().children('.select-number-input').val();
  console.log(id);
  console.log(quantity);
  $.ajax({
    method: 'GET',
    url: '/ajax/changebasket.php',
    data: {
      id: id,
      quantity: quantity,
    },
  }).done(function (answer) {
    console.log(answer);
  });
});
$('.select-number-input').change(function () {
  var currentVal = parseInt($(this).val());
  var multiplicity = parseInt($(this).parent().children('label').children('.multiplicity').attr('multiplicity'));
  var edenica = $(this).attr('data-desc');
  var newVal = 0;
  var quantityMax = $(this).data('max');
  if ($(this).parent().children('label').children('input').is(':checked')) {
    if (currentVal % multiplicity === 0) {
      /*if(currentVal > quantityMax)
      {
        newVal = quantityMax;
      }
      else
      {*/
      newVal = currentVal;
      /*}*/
    } else {
      /*if(currentVal > quantityMax)
      {
        newVal = quantityMax;
      }
      else
      {*/
      var del = currentVal / multiplicity;
      newVal = (parseInt(del) + 1) * multiplicity;

      console.log(currentVal);
      console.log(multiplicity);

      // }
    }

    $(this).val(newVal + edenica);
  }
  var id = $(this).data('id');
  var quantity = parseInt($(this).val());
  var maxquant = $(this).data('max');

  // console.log(quantity);
  $.ajax({
    method: 'GET',
    url: '/ajax/changebasket.php',
    data: {
      id: id,
      quantity: quantity,
    },
  }).done(function (answer) {
    //console.log(answer);
  });
});

/* item */

$(document).on('click', '.item-basket-btn', function () {
  $(this).toggleClass('active');
  return false;
});

/*
$('.item-compare-link').each(function(){
	var t = $(this);
	var id = t.data('id');
  t.on('click', function () {
	  if(t.hasClass('active')){
		t.tooltipster('destroy')
	  }else{
		  t.tooltipster({
			 theme: 'tooltipster-light',
			 animationDuration: 300,
			 delay: 100,
			 interactive: false,
			 maxWidth: 250,
			 trigger: 'click',
			 side: 'bottom',
			 timer: 1000,
			 content: t.data('title')
		  });
		t.tooltipster('open')
	  }
	  $.ajax({
			method: 'GET',
			url: '/ajax/addcompare.php',
			data: {
				id: id
			}
		})
	  if(t.closest('.item, .cabinet-order-item').length){
		t.closest('.item, .cabinet-order-item').find('.item-compare-link').toggleClass('active');
	  }else{
		t.toggleClass('active')
	  }

	  return false;
	});
})
*/

/*
$('.item-favorites-link').each(function(){
	var t = $(this);
	var id = t.data('id');
  t.on('click', function () {
	  if(t.hasClass('active')){
		t.tooltipster('destroy')
	  }else{
		  t.tooltipster({
			 theme: 'tooltipster-light',
			 animationDuration: 300,
			 delay: 100,
			 interactive: false,
			 maxWidth: 250,
			 trigger: 'click',
			 side: 'bottom',
			 timer: 1000,
			 content: t.data('title')
		  });
		t.tooltipster('open')
	  }
	  $.ajax({
			method: 'GET',
			url: '/ajax/addfavorites.php',
			data: {
				id: id
			}
		})
	  if(t.closest('.item, .cabinet-order-item').length){
		 t.closest('.item, .cabinet-order-item').find('.item-favorites-link').toggleClass('active');
	  }else{
		t.toggleClass('active')
	  }

	  return false;
	});
})
*/

/* sitemap-menu */

$(document).on('click', '.sitemap-submenu-open', function (event) {
  event.preventDefault();
  event.stopPropagation();
  var li = $(this).closest('li');

  if (li.hasClass('active')) {
    closeMenu();
  } else {
    closeMenu();
    li.addClass('active');
    li.children('.sitemap-submenu').slideDown(400);
  }

  function closeMenu() {
    li.parent().children('li').removeClass('active');
    li.parent().children('li').children('.sitemap-submenu').slideUp(400);
  }

  return false;
});
/* select */

$('.select').on('click', function () {
  var t = $(this);

  if ($(t).hasClass('active')) {
    $('.select').removeClass('active');
  } else {
    $('.select').removeClass('active');
    t.addClass('active');
  }
});
$('.select-list li a').on('click', function () {
  var t = $(this);
  var value = t.data('value') ? t.data('value') : t.html();
  $('.select').removeClass('active');
  t.closest('.select').find('.select-list li').removeClass('active');
  t.parent().addClass('active');
  t.closest('.select').find('.select-title').html(t.html());
  t.closest('.select').find('input').val(value).trigger('change');
  return false;
});
$(document).on('click', function (event) {
  if ($(event.target).closest('.select').length) return;
  $('.select').removeClass('active');
});
/* checkbox */

$('.checkbox:checked').closest('label').addClass('active');
$(document).on('change', '.checkbox', function () {
  var t = $(this);

  if (t.prop('checked')) {
    t.closest('label').addClass('active');
  } else {
    t.closest('label').removeClass('active');
  }
});
/* radio */

$('.radio:checked').closest('label').addClass('active');
$(document).on('change', '.radio', function () {
  var t = $(this),
    name = t.attr('name');
  $('[name="' + name + '"]')
    .closest('label')
    .removeClass('active');

  if (t.prop('checked')) {
    t.closest('label').addClass('active');
  } else {
    t.closest('label').removeClass('active');
  }
});
/* range-slider */

$('.range-slider').each(function () {
  var t = $(this);
  var min = t.data('min');
  var max = t.data('max');
  var valueFrom = t.data('value-from');
  var valueTo = t.data('value-to');
  var step = t.data('step') || 1;
  t.slider({
    min: min,
    max: max,
    values: [valueFrom, valueTo],
    range: true,
    step: step,
    create: function create() {
      t.find('.ui-slider-handle:first')
        .addClass('ui-slider-handle-from')
        .append('<span class="ui-slider-handle-info">от ' + formatPrice(valueFrom) + '</span>');
      t.find('.ui-slider-handle:last')
        .addClass('ui-slider-handle-to')
        .append('<span class="ui-slider-handle-info">до ' + formatPrice(valueTo) + '</span>');
      t.closest('.range-slider-wrapp').find('.min-price').val(valueFrom);
      t.closest('.range-slider-wrapp').find('.max-price').val(valueTo);
    },
    slide: function slide(event, ui) {
      t.find('.ui-slider-handle:first .ui-slider-handle-info').text('от ' + formatPrice(ui.values[0]));
      t.find('.ui-slider-handle:last .ui-slider-handle-info').text('до ' + formatPrice(ui.values[1]));
      t.closest('.range-slider-wrapp').find('.min-price').val(ui.values[0]);
      t.closest('.range-slider-wrapp').find('.max-price').val(ui.values[1]);
      $('.submitstart').click(); //старт фильтра
    },
  });
});

function formatPrice(str) {
  var strNew = str.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
  strNew = strNew.replace('.', ',');
  return strNew;
}
/* items-view-change-link */

$(document).on('click', '.items-view-change-link', function () {
  var t = $(this);
  var view = t.data('view');
  $('.items-view-change-list li').removeClass('active');
  t.parent().addClass('active');

  if (view === 'list') {
    $('.items-row').addClass('items-row-list');
    localStorage.setItem('items-row-list', true);
  } else {
    $('.items-row').removeClass('items-row-list');
    localStorage.removeItem('items-row-list');
  }

  $('.item-img-slider').each(function () {
    var t = $(this);

    if (t.hasClass('slick-initialized')) {
      $(this).slick('slickSetOption', 'speed', 300, true);
    }
  });
  return false;
});

if (localStorage.getItem('items-row-list')) {
  $('.items-view-change-link[data-view="list"]').trigger('click');
}
/* products-sidebar-item */

$(document).on('click', '.products-sidebar-item-title', function () {
  var t = $(this);
  t.toggleClass('active');
  t.closest('.products-sidebar-item').find('.products-sidebar-item-list-wrapp').slideToggle(400);
  return false;
});
/* products-sidebar-filter */

$(document).on('click', '.products-sidebar-filter-open', function (event) {
  $('html').addClass('products-sidebar-filter-opened products-sidebar-filter-is-open');
  return false;
});
$(document).on('click', function (event) {
  if (event.isTrigger) return;
  if ($(event.target).closest('.products-sidebar-filter-open, .products-sidebar-filter-body').length) return;
  if (!$('html').hasClass('header-nav-opened')) return;
  closeSidebarFilter();
});
$(document).on('click', '.products-sidebar-filter-close', function () {
  closeSidebarFilter();
  return false;
});

function closeSidebarFilter() {
  $('html').removeClass('products-sidebar-filter-is-open');
  setTimeout(function () {
    $('html').removeClass('products-sidebar-filter-open-opened');
  }, 600);
}
/* scroll */

$('.scroll-to-btn').on('click', function () {
  var to = $(this).attr('href') || $(this).data('href');
  scrollToBlock(to, 1000, $('.header').innerHeight());
  return false;
});

function scrollToBlock(to, speed, offset) {
  if (typeof to === 'string') to = $(to);
  if (!to[0]) return;
  offset = offset || 0;
  speed = speed || 1000;
  $('html, body')
    .stop()
    .animate(
      {
        scrollTop: to.offset().top - offset,
      },
      speed
    );
}
/* tabs */

$(document).on('click', '.tabs-nav a', function (event) {
  event.preventDefault();
  var t = $(this),
    li = t.parent(),
    tab = t.attr('href'),
    tabs = t.closest('.tabs-nav').data('tabs');
  if (li.hasClass('active')) return;
  t.closest('.tabs-nav').find('li').removeClass('active');
  $(tabs).find('.tab-block').removeClass('active');
  li.addClass('active');
  $(tab).addClass('active');
  $(tabs).find('.tab-block [required]').removeAttr('required');
  $(tab).find('[data-required]').attr('required', true);
});
/* reviews-series-btn */

$(document).on('click', '.reviews-series-btn', function () {
  var t = $(this);
  t.closest('.product-section').find('.reviews-series').addClass('active');
  t.remove();
  return false;
});
/* file */

/*  //вынесено в partSupportVacancyForm.js
$(document).on('change', '.file', function (event) {
  var t = $(this),
      label = t.closest('.file-label'),
      info = label.find('.file-label-info'),
      fileName = '';

  if (t.hasClass('input-user-img')) {
    if (t[0].files) {
      var file = t[0].files[0];
      var type = file.type;
      var validTypes = ['image/png', 'image/jpeg', 'image/gif'];
      var reader = new FileReader();
      var valid = validTypes.some(function (el) {
        return el == type;
      });

      if (!valid) {
        label.removeClass('active');
        return;
      }

      reader.readAsDataURL(file);

      reader.onload = function () {
        label.find('.file-user-img-upload').html('');
        var img = '<img src="' + reader.result + '" alt="">';
        label.find('.file-user-img-upload').append(img);
        label.addClass('active');
      };
    } else {
      label.removeClass('active');
      return;
    }
  }

  if (label.hasClass('file-label-multiple')) {
    if (!t[0].files) return;
    fileName = event.target.value.split('\\').pop();
    t.closest('.form-block').prepend('<label class="file-label file-label-multiple">' + label.html() + '</label>');
    label.addClass('disabled');
    t.attr('disabled', true);
    info.html('<span>' + fileName + '</span><a href="#" class="file-del"></a>');
    return;
  }

  if (t[0].files && t[0].files.length > 1) {
    fileName = t[0].files.length + ' files';
  } else {
    fileName = event.target.value.split('\\').pop();
  }

  if (fileName) {
    info.text(fileName);
  } else {
    info.text('');
  }
});
$(document).on('click', '.file-del', function () {
  var label = $(this).closest('.file-label');
  label.addClass('del');
  setTimeout(function () {
    label.remove();
  }, 400);
  return false;
});
*/

/* item-del */
/*
$(document).on('click', '.item-del', function () {
  var col = $(this).closest('.items-col');
  col.addClass('del');
  setTimeout(function () {
    col.remove();
  }, 400);
  return false;
});
*/

/* compare in catalog.js */

/* basket
//.basket-link-postpone
$(document).on('click', '.basket-link-compare,  .basket-link-favorites', function () {
  $(this).toggleClass('active');
  return false;
});
*/

/*
$(document).on('click', '.basket-link-del', function () {
  var tr = $(this).closest('tr');
  tr.addClass('del');
  setTimeout(function () {
    tr.remove();
    if (!$('.basket-table tbody tr')[0]) {
      $('.basket-table').remove();
    }
  }, 400);
  return false;
});
*/

/* counterparty */

$(document).on('click', '.counterparty-link', function () {
  var t = $(this);
  t.closest('.counterparty').toggleClass('active');
  t.closest('.counterparty').find('.counterparty-body').slideToggle(400);
  return false;
});
$(document).on('click', '.counterparty-del', function () {
  var block = $(this).closest('.counterparty');
  block.addClass('del');
  setTimeout(function () {
    block.remove();
  }, 400);
  return false;
});
/* modals */

var isOpenModal = false;
$(document).on('click', '.modal-open-btn', function () {
  var t = $(this),
    modal = t.data('modal') || t.attr('href'),
    title = t.data('title');

  if (modal == '#modal-addotziv') {
    console.log('feedback_click_button');
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      event: 'feedback_click_button',
    });
  }

  if (modal == '#modal-addvopros') {
    console.log('question_сlick_button');
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      event: 'question_сlick_button',
    });
  }

  if (title) {
    $(modal).find('[name="title"]').val(title);
  }
  if (t.hasClass('item-stock-btn')) {
    $('#descntid').val(t.data('id'));
  }
  if (t.hasClass('svyazmanager')) {
    $('#managertid').val(t.data('id'));
  }
  if (t.hasClass('zaprosprice')) {
    $('#zaprospricetid').val(t.data('id'));
  }
  if (t.hasClass('reviews-add-btn')) {
    $('#reviewtid').val(t.data('id'));
  }
  if (t.hasClass('reviews-add-btn2')) {
    $('#voprostid').val(t.data('id'));
  }
  if (t.hasClass('section-read-more-link')) {
    $('#opisanietid').val(t.data('id'));
  }
  if (t.hasClass('managersvyaz2')) {
    $('#manager2sid').val(t.data('sid'));
  }

  openModal(modal);
  return false;
});
$(document).on('click', '.modal-close-btn, .modal-close-link', function () {
  $.fancybox.close(true);
  return false;
});

function openModal(modal, callback) {
  var timeout = 0;
  if ($('html').hasClass('fancybox-is-open')) isOpenModal = true;
  if (isOpenModal) timeout = 350;
  $.fancybox.close(true);
  setTimeout(function () {
    $.fancybox.open({
      src: modal,
      type: 'inline',
      opts: getFancyboxModalOpts(modal, callback),
    });
    setTimeout(function () {
      isOpenModal = false;
    }, 400);
  }, timeout);
}

function getScrollbarWidth() {
  var outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  document.body.appendChild(outer);
  var widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';
  var inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);
  var widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);

  if ($('html').height() <= $(window).height()) {
    return 0;
  }

  return widthNoScroll - widthWithScroll;
}

function getFancyboxModalOpts(modal, callback) {
  var scrollbarWidth = getScrollbarWidth();
  return {
    smallBtn: false,
    toolbar: false,
    touch: false,
    animationDuration: 400,
    beforeLoad: function beforeLoad() {
      $('html').addClass('fancybox-is-open').css({
        marginRight: scrollbarWidth,
      });
      $('.header').css({
        marginRight: scrollbarWidth,
      });
    },
    afterLoad: function afterLoad() {
      setTimeout(function () {
        $(modal).addClass('active');
      }, 0);
      if (callback) callback();
    },
    beforeClose: function beforeClose() {
      $(modal).addClass('close');
      setTimeout(function () {
        $(modal).removeClass('active close');
      }, 400);
    },
    afterClose: function afterClose() {
      isOpenResults = false;
      if (isOpenModal) return;
      $('html').removeClass('fancybox-is-open').css({
        marginRight: 0,
      });
      $('.header').css({
        marginRight: 0,
      });
    },
    onUpdate: function onUpdate(instance, current) {
      if (current.src == '#modal-map') {
        set16x9(current);
      }
    },
  };
}
/* fancybox */

$('[data-fancybox]').fancybox({
  hash: false,
  buttons: ['thumbs', 'close'],
  parentEl: 'html',
  onUpdate: function onUpdate(instance, current) {
    if (current.type !== 'iframe') return;
    set16x9(current);
  },
});

function set16x9(current) {
  var width,
    height,
    ratio = 16 / 9,
    video = current.$content;

  if (video) {
    video.hide();
    width = current.$slide.width();
    height = current.$slide.height() - 100;

    if (height * ratio > width) {
      height = width / ratio;
    } else {
      width = height * ratio;
    }

    video
      .css({
        width: width,
        height: height,
      })
      .show();
  }
}
/* payment-card-input */

$(document).on('input', '.payment-card-input', function () {
  var input = $(this);

  if (input.val().length == +input.attr('max')) {
    input
      .closest('.payment-card-section')
      .find('.payment-card-input')
      .each(function () {
        var t = $(this);

        if (!t.val() || t.val().length < +t.attr('max')) {
          t.trigger('focus');
          return false;
        }
      });
  }

  input.val(input.val().substr(0, +input.attr('max')));
});
/* timer */

$('.timer').startTimer();
/* address-table */

$(document).on('click', '.address-link-del', function () {
  var tr = $(this).closest('tr');
  tr.addClass('del');
  setTimeout(function () {
    tr.remove();

    if (!$('.address-table tbody tr')[0]) {
      $('.address-table').remove();
    }
  }, 400);
  return false;
});
/* mask */

$('[type="tel"]').mask('+7 (999) 999-99-99');

/* catalog-item-img */

$(document).on('mouseenter', '.catalog-item-links a', function () {
  var t = $(this);
  var img = t.data('img');
  if (img) {
    t.closest('.catalog-item').find('.catalog-item-img img').attr('src', img);
  }
});

/* catalog-submenu-img */

$(document).on('mouseenter', '.catalog-submenu-category a', function () {
  var t = $(this);
  var img = t.data('img') || t.closest('.catalog-submenu-category').find('.catalog-submenu-category-title a').data('img');
  if (img) {
    t.closest('.catalog-submenu').find('.catalog-submenu-img img').attr('src', img);
  }
});

$(document).on('mouseleave', '.catalog-submenu-category a', function () {
  var t = $(this);
  var img = t.closest('.catalog-menu').find('.catalog-menu-item-has-children').data('img');
  if (img) {
    t.closest('.catalog-submenu').find('.catalog-submenu-img img').attr('src', img);
  }
});

/* panel */

fixedAdminPanel();

$(window).on('resize', fixedAdminPanel);

function fixedAdminPanel() {
  var panel = $('#panel');
  if (!$('#panel')[0]) return;
  var panelHeight = panel.innerHeight();
  $('body').removeAttr('style');
  $('body').css('padding-top', parseInt($('body').css('padding-top')) + panelHeight);
  $('header').css('margin-top', panelHeight);
  $('.catalog-submenu-img').css('margin-top', panelHeight);
}

/* main-catalog-item-read-more */

$(document).on('click', '.main-catalog-item-read-more', function () {
  var t = $(this);
  if (t.hasClass('active')) {
    t.find('span').text(t.data('text'));
  } else {
    t.find('span').text(t.data('text-active'));
  }
  t.toggleClass('active');
  t.closest('.main-catalog-item').find('.main-catalog-item-links-more').toggleClass('active');
  return false;
});

/* sort */
$('.select-list li a').on('click', function () {
  var t = $(this);
  var sort = t.data('sort');
  var pageval = $('#tekpage').val();
  $('.sortval').val(sort);
  $('.pageval').val(pageval);
  $('.hiddensort').submit();
});

/* modal-add-to-basket */

$(document).on('click', '.item-basket-btn', function () {
  //console.log('aaa');
  if ($(this).hasClass('in_basket')) {
    location.href = $(this).attr('href');
    return true;
  }

  var t = $(this);
  var id = t.data('id');
  var quantity = t.closest('.item').find('.select-number-input').val();
  if (!quantity) quantity = t.closest('.product').find('.select-number-input').val();
  $.ajax({
    method: 'GET',
    url: '/ajax/addbasket.php',
    data: {
      id: id,
      quantity: quantity,
    },
  }).done(function (answer) {
    // $('.modal-add-to-basket-body').html(answer);
    // openModal('#modal-add-to-basket');
    cartload();
    cartload2();

    console.log('into_a_basket_click_button');
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      event: 'into_a_basket_click_button',
    });
  });
  return false;
});

/* pdf */

$(document).on('click', '.product-save-link', function () {
  $.getScript('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.60/pdfmake.min.js', () => {
    $.getScript('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.20/vfs_fonts.js', () => {
      var id = $('.product').data('id');
      var image = $('.product-main-img img')[0];
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var dataURL;
      canvas.height = image.naturalHeight;
      canvas.width = image.naturalWidth;
      ctx.drawImage(image, 0, 0);
      dataURL = canvas.toDataURL();
      var title = $('.product .section-title').text();
      var priceCurrent = parseInt($('.product .item-price-current').text()) + ' руб.';
      var stok = $('.product .item-price-stok-info').text();
      var priceOld = parseInt($('.product .item-price-old').text()) + ' руб.';
      var code = $('.product .product-code').text();
      var desc = $('.product-desc').text();
      var specifications = [];
      var url = location.href;
      $('.product-specifications-table tr').each(function () {
        var t = $(this);
        specifications.push([{ text: t.find('td:first-child').text().trim() }, { text: t.find('td:last-child').text().trim() }]);
      });
      var documentDefinition = {
        content: [
          {
            image: dataURL,
            width: 300,
            style: 'img',
          },
          {
            text: title,
            style: 'productTitle',
          },
          {
            text: code,
            style: 'code',
          },
          {
            text: 'Цена:',
            style: 'title',
          },
          {
            text: priceCurrent,
            style: 'priceCurrent',
          },
          {
            text: priceOld,
            style: 'priceOld',
          },
          {
            text: stok,
            style: 'stok',
          },
          {
            text: 'Описание:',
            style: 'title',
          },
          {
            text: desc,
          },
          {
            text: 'Характеристики:',
            style: 'title',
          },
          {
            table: {
              widths: ['*', '*'],
              alignment: 'center',
              dontBreakRows: true,
              margin: [0, 20, 0, 20],
              body: specifications,
            },
          },
          {
            text: 'Ссылка:',
            style: 'title',
          },
          {
            text: url,
            link: url,
          },
        ],
        styles: {
          img: {
            alignment: 'center',
            margin: [0, 0, 0, 10],
          },
          productTitle: {
            fontSize: 24,
            bold: true,
            margin: [0, 10, 0, 10],
            alignment: 'center',
          },
          code: {
            fontSize: 14,
            color: 'gray',
            alignment: 'center',
            margin: [0, 10, 0, 10],
          },
          priceCurrent: {
            fontSize: 18,
            bold: true,
            alignment: 'center',
            margin: [0, 5, 0, 5],
          },
          priceOld: {
            decoration: 'lineThrough',
            decorationStyle: 'solid',
            decorationColor: 'gray',
            fontSize: 12,
            alignment: 'center',
            color: 'gray',
          },
          stok: {
            fontSize: 12,
            alignment: 'center',
            color: 'red',
          },
          title: {
            fontSize: 18,
            bold: true,
            margin: [0, 10, 0, 10],
            alignment: 'center',
          },
        },
      };
      pdfMake.createPdf(documentDefinition).download(title + ' - ' + id + '.pdf');
    });
  });
  return false;
});

/* share-tooltip-link */

$(document).on('click', '.share-tooltip-link', function () {
  $(this).closest('.share-tooltip').toggleClass('active');
  return false;
});

$(document).on('click', function (event) {
  if ($(event.target).closest('.share-tooltip').length) return;
  $('.share-tooltip').removeClass('active');
});

/* product-print-link */

$('.product-print-link').on('click', function () {
  window.print();
  return false;
});

/* modal-fast-buy-open */

$(document).on('click', '.modal-fast-buy-open', function () {
  var id = $(this).data('id');
  $.ajax({
    method: 'GET',
    url: '/ajax/fast_buy.php',
    data: {
      id: id,
    },
  }).done(function (answer) {
    $('.modal-fast-buy-body').html(answer);
    $('.modal-fast-buy-body [type="tel"]').mask('+7 (999) 999-99-99');
    openModal('#modal-fast-buy');
  });
  return false;
});

/* smallcart */

function cartload() {
  $.ajax({
    method: 'GET',
    url: '/ajax/smallcart.php',
  }).done(function (smallcart) {
    $('#smallcart').html(smallcart);
  });
}

function cartload2() {
  $.ajax({
    method: 'GET',
    url: '/ajax/smallcart2.php',
  }).done(function (smallcart) {
    $('#smallcart2').html(smallcart);
  });
}

/* filter load */
$('.startfiltersearch').change(function () {
  $('.submitstart').click();
});

/* golosovanie */
$(document).on('click', '.startgolos', function () {
  var t = $(this);
  var id = t.data('id');
  var tip = t.data('tip');
  var znak = t.data('znak');
  $.ajax({
    method: 'GET',
    url: '/ajax/addgolos.php',
    data: {
      id: id,
      tip: tip,
      znak: znak,
    },
  }).done(function (otvet) {
    alert(otvet);
    //загружаем счетчик
    $.ajax({
      method: 'GET',
      url: '/ajax/loadgolos.php',
      data: {
        id: id,
        tip: tip,
        znak: znak,
      },
    }).done(function (cngolosov) {
      //alert(cngolosov);
      t.find('span').text(cngolosov);
    });
    //$('.modal-add-to-basket-body').html(answer);
    //openModal('#modal-add-to-basket');
    //cartload();
  });
  return false;
});

window.addEventListener('DOMContentLoaded', () => {
  let multiplicityList = document.querySelectorAll('.multiplicity-wrap');

  multiplicityList.forEach((multiplicityItem) => {
    if (multiplicityItem && getComputedStyle(multiplicityItem).display !== 'none') {
      multiplicityItem.parentElement.classList.add('has-multiplicity');
    }
  });
});

/* item-state */
$(document).on('mouseenter', '.item-state', function () {
  var t = $(this);
  var tooltip = $(this).find('.item-state-tooltip');
  var itemID = t.closest('.item').data('id');
  var formData = new FormData();
  if (itemID) {
    formData.append('id', itemID);
    if (tooltip.is(':empty')) {
      $.ajax({
        url: '/ajax/deliveryinfo.php',
        type: 'POST',
        processData: false,
        contentType: false,
        data: formData,
        success: function (answer) {
          tooltip.html(answer);
          t.addClass('active');
        },
      });
    } else {
      t.addClass('active');
    }
  }
});

$(document).on('mouseleave', '.item-state', function () {
  $(this).removeClass('active');
});

$(document).on('click', 'a', function () {
  if ($(this).attr('href').match(/^tel:/)) {
    console.log('phone_click_button');
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      event: 'phone_click_button',
    });
  }
  if (
    $(this)
      .attr('href')
      .match(/^mailto:/)
  ) {
    console.log('mail_click_button');
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      event: 'mail_click_button',
    });
  }
  if (
    $(this)
      .attr('href')
      .match(/^\/personal\/cart\/$/)
  ) {
    console.log('basket_click_button');
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      event: 'basket_click_button',
    });
  }
  if (
    $(this)
      .attr('href')
      .match(/^\/personal\/order\/make\/$/)
  ) {
    console.log('start_order_click_button');
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      event: 'start_order_click_button',
    });
  }
  if ($(this).text() == 'Реквизиты в PDF') {
    console.log('requisites_click_button');
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      event: 'requisites_click_button',
    });
  }
  if ($(this).parents('.brand-lins') && window.location.pathname.match(/brands/)) {
    console.log('price_click_button');
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      event: 'price_click_button',
    });
  }
});

/* email change */
(function () {
  var referrer = document.referrer;
  var params = new URL(document.location).searchParams;
  var email = '';

  if (getCookie('email') && getCookie('email') !== 'undefined') {
    email = getCookie('email');
  } else {
    email = $('#emaildef').val();

    if (params.get('utm_source') === 'direct') {
      email = $('#emailyandexdirect').val();
    } else if (params.get('utm_medium') === 'promo') {
      email = $('#emailpostpromo').val();
    } else if (params.get('utm_medium') === 'vendor') {
      email = $('#emailpostvendor').val();
    } else if (referrer.includes('https://www.google.ru/')) {
      email = $('#emailgoogle').val();
    } else if (referrer.includes('https://yandex.ru/')) {
      email = $('#emailyandex').val();
    }

    setCookie('email', email);
  }

  $('.header-link[href^="mailto"]')
    .attr('href', 'mailto:' + email)
    .find('span')
    .text(email);
  $('.contact-block-data [href^="mailto"]')
    .attr('href', 'mailto:' + email)
    .text(email);
  $('.footer-link[href^="mailto"]')
    .attr('href', 'mailto:' + email)
    .text(email);
  $('[name="promores"]').val(email);
})();

/* cookie */
function setCookie(name, value) {
  var options =
    arguments.length > 2 && arguments[2] !== undefined
      ? arguments[2]
      : {
          expires: 3 * 24 * 60 * 60,
          path: '/',
        };
  var expires = options.expires;

  if (expires && typeof expires == 'number') {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }

  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);
  var updatedCookie = name + '=' + value;

  for (var propName in options) {
    updatedCookie += '; ' + propName;
    var propValue = options[propName];

    if (propValue !== true) {
      updatedCookie += '=' + propValue;
    }
  }

  document.cookie = updatedCookie;
}

function getCookie(name) {
  var matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function deleteCookie(name) {
  setCookie(name, '', {
    expires: -1,
    path: '/',
  });
}

/* попап авторизации */
console.log('test');
$(document).on('click', '.header-link', async function (e) {
  // если пользователь авторизован, делаем return

  e.preventDefault();
  console.log('click');

  const response = await fetch('/ajax/auth.php');
  const html = await response.text();
  const newDiv = document.createElement('div');
  newDiv.innerHTML = html;
  document.body.appendChild(newDiv);
});
