'use strict';
document.getElementById('yr').textContent = new Date().getFullYear();

// Highlight current section in nav
(function () {
  var links = document.querySelectorAll('nav a');
  if (!('IntersectionObserver' in window)) return;
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && map[e.target.id]) {
        links.forEach(function (l) { l.removeAttribute('aria-current'); });
        map[e.target.id].setAttribute('aria-current', 'true');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(map).forEach(function (id) {
    var el = document.getElementById(id); if (el) io.observe(el);
  });
})();

// Hero: simulated sensor trace with threshold + anomaly flags
(function () {
  var canvas = document.getElementById('scope');
  var ctx = canvas.getContext('2d');
  var statusEl = document.getElementById('scopeStatus');
  var countEl = document.getElementById('scopeCount');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var THRESH = 6.0, MAXV = 9, N = 240;
  var data = [], flags = [], t = 0, count = 0, w = 0, h = 0, dpr = 1, burst = 0;

  function css(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  function sample() {
    t += 1;
    var base = 3.2 + Math.sin(t / 14) * 0.5 + Math.sin(t / 5) * 0.25 + (Math.random() - .5) * .35;
    if (burst <= 0 && Math.random() < 0.008) burst = 26;
    var v = base;
    if (burst > 0) { v += (26 - burst) * 0.16 * (burst > 8 ? 1 : burst / 8) + Math.random() * .4; burst--; }
    return Math.max(0.3, v);
  }
  function push() {
    var v = sample();
    var f = v > THRESH;
    if (f && !(flags[flags.length - 1])) count++;
    data.push(v); flags.push(f);
    if (data.length > N) { data.shift(); flags.shift(); }
  }
  function resize() {
    dpr = window.devicePixelRatio || 1;
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function y(v) { return h - 16 - (v / MAXV) * (h - 32); }
  function draw() {
    var ink = css('--ink'), line = css('--line'), pipe = css('--pipe'), alert = css('--alert'), soft = css('--ink-soft');
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = line; ctx.lineWidth = 1;
    for (var i = 1; i < 5; i++) { var gy = Math.round(i * h / 5) + .5; ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
    // threshold
    ctx.setLineDash([6, 5]); ctx.strokeStyle = alert; ctx.lineWidth = 1.25;
    ctx.beginPath(); ctx.moveTo(0, y(THRESH)); ctx.lineTo(w, y(THRESH)); ctx.stroke(); ctx.setLineDash([]);
    // trace
    var step = w / (N - 1), off = (N - data.length) * step;
    ctx.lineWidth = 2; ctx.lineJoin = 'round';
    for (var k = 1; k < data.length; k++) {
      ctx.strokeStyle = flags[k] ? alert : pipe;
      ctx.beginPath();
      ctx.moveTo(off + (k - 1) * step, y(data[k - 1]));
      ctx.lineTo(off + k * step, y(data[k]));
      ctx.stroke();
    }
    // current point
    var last = data.length - 1;
    if (last >= 0) {
      ctx.fillStyle = flags[last] ? alert : ink;
      ctx.beginPath(); ctx.arc(off + last * step, y(data[last]), 4, 0, 6.283); ctx.fill();
    }
    var fault = flags[last];
    statusEl.textContent = fault ? 'Anomaly flagged' : 'Normal';
    statusEl.className = 'status' + (fault ? ' fault' : '');
    countEl.textContent = count;
  }

  resize();
  for (var i = 0; i < N; i++) push();
  // seed one visible anomaly so the static view shows the idea
  if (reduce) { burst = 26; for (var j = 0; j < 40; j++) push(); count = Math.max(count, 1); }
  draw();
  window.addEventListener('resize', function () { resize(); draw(); });
  if (reduce) return;

  var last = 0, visible = true;
  new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(canvas);
  function loop(ts) {
    if (visible && ts - last > 60) { push(); draw(); last = ts; }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
