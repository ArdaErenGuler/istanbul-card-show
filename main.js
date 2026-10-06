const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// nav
const nav = $('#nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 30), { passive: true });
$('#burger').onclick = () => $('#links').classList.toggle('open');
$$('#links a').forEach(a => a.onclick = () => $('#links').classList.remove('open'));

// countdown
const target = new Date('2026-11-14T10:00:00+03:00');
const pad = n => String(n).padStart(2, '0');
function tick() {
  let t = Math.max(0, target - Date.now()) / 1000;
  $('#cd').textContent = pad(Math.floor(t / 86400));
  $('#ch').textContent = pad(Math.floor(t % 86400 / 3600));
  $('#cm').textContent = pad(Math.floor(t % 3600 / 60));
  $('#cs').textContent = pad(Math.floor(t % 60));
}
tick(); setInterval(tick, 1000);

// reveal + counters + chart
$$('.card,.stat,.split>*,.ticket,details,h2').forEach(e => e.classList.add('reveal'));
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  io.unobserve(e.target);
  if (e.target.id === 'chart') return;
  const c = $('[data-count]', e.target);
  if (c) countUp(c);
}), { threshold: .2 });
$$('.reveal,#chart').forEach(e => io.observe(e));
function countUp(el) {
  const end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now();
  (function f(t) {
    const p = Math.min(1, (t - t0) / 1400), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
    el.textContent = v.toLocaleString('tr-TR') + suf;
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}
// chart is observed via same io
$('#chart').classList.add('reveal');
new IntersectionObserver(([e], o) => { if (e.isIntersecting) { $('#chart').classList.add('in'); o.disconnect(); } }, { threshold: .3 }).observe($('#chart'));

// i18n
const en = {
  nav_event: 'Event', nav_growth: 'Growth', nav_venue: 'Venue', nav_join: 'Join', nav_faq: 'FAQ', nav_contact: 'Contact',
  buy: 'Buy Tickets', apply: 'Vendor Application', pill: 'Fall 2026 · Tickets coming soon',
  lead: 'Collecting, trading, tournaments, content creators and community — all under one roof.',
  d: 'Days', h: 'Hrs', m: 'Min', s: 'Sec',
  st1: 'Attendees', st2: 'Vendors', st3: 'Event Area', st4: 'Years of Growth',
  e1: 'What awaits you', t1: 'Card culture under one roof',
  f1t: 'Community', f1p: 'Collectors, players and fans from all over Turkey come together.',
  f2t: 'Vendors', f2p: 'From rare cards to sealed products, hundreds of items in a single hall.',
  f3t: 'Brands & Sponsors', f3p: 'Sponsorship packages that put your brand in front of thousands.',
  f4t: 'Content Creators', f4p: 'Dedicated spaces and collaborations for streamers and creators.',
  e2: 'Growth', t2: 'Bigger every season', note: '* Sample chart data; real figures to be updated.',
  e3: 'Venue', t3: 'Rumeli Hall',
  vp: 'A 4,000 m² single-block hall at Lütfi Kırdar Convention & Exhibition Center, with wide aisles, smooth flow and a stage visible from everywhere.',
  v1: 'Şişli, Istanbul · metro and parking access', v2: 'One hall, one seamless experience', v3: 'Tournament, stage and creator areas',
  e4: 'Join', t4: 'Be part of it',
  j1t: 'Vendor Application', j1p: 'Get a table and reach thousands of collectors.',
  j2t: 'Content Creator Application', j2p: 'Stream at the event and meet the community.',
  j3t: 'Accommodation', j3p: 'Partner hotels for visitors from out of town.',
  e5: 'Tickets', t5: 'Reserve your spot now', tp: 'Two days, one ticket. Perks for early birds.',
  e6: 'FAQ', t6: 'Frequently asked',
  q1: 'What are the event hours?', a1: 'Doors open at 10:00 each day. The full schedule will be announced closer to the event.',
  q2: 'Is entry free for children?', a2: 'To be confirmed with the organizers and updated.',
  q3: 'How do I join as a vendor?', a3: 'Fill out the Vendor Application form and our team will get in touch.',
  q4: 'What are the event rules?', a4: 'General participation rules will be published on the rules page.',
  fe: 'Event', fj: 'Participation'
};
const tr = {};
$$('[data-i18n]').forEach(e => tr[e.dataset.i18n] ??= e.textContent);
let lang = 'tr';
$('#lang').onclick = () => {
  lang = lang === 'tr' ? 'en' : 'tr';
  const dict = lang === 'en' ? en : tr;
  $$('[data-i18n]').forEach(e => { const v = dict[e.dataset.i18n]; if (v) e.textContent = v; });
  document.documentElement.lang = lang;
  $('#lang').textContent = lang === 'tr' ? 'EN' : 'TR';
};
