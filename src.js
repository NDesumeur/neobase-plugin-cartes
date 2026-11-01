// Cartes : le jeu de cartes à collectionner de NeoBase, avec les 523 créatures de la base commune (la même que le Bestiaire).
// Un pack gratuit par jour, des packs à acheter avec des éclats, six raretés, vente des doublons, jalons de collection, historique des ouvertures.
// La collection et les éclats sont dans le dossier du plugin (sauvegardé et synchronisé par NeoBase). Chaque action est une transaction :
// le document est relu, modifié et réécrit en une fois, jamais deux à la fois — pas de carte ni d'éclat en double, même en cliquant très vite.
/*@CREATURES@*/
const CSS = `
.cd{display:flex;flex-direction:column;gap:12px;min-height:78vh}
.cd-top{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.cd-coins{display:flex;align-items:center;gap:8px;padding:6px 12px;background:var(--cb-card);box-shadow:0 0 0 2px var(--cb-line),0 3px 0 2px #05010b;font:11px var(--title,monospace);color:var(--cb-gold)}
.cd-coins i{width:14px;height:14px;background:var(--cb-gold);box-shadow:inset -3px -3px 0 #c98a1d,inset 3px 3px 0 #fff2c4;clip-path:polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%)}
.cd-shop{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px}
.cd-pack{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;padding:14px 12px}
.cd-art{width:112px;height:150px;position:relative;display:grid;place-items:center;box-shadow:0 0 0 3px #05010b,0 0 0 5px var(--pc),0 6px 0 5px #05010b;background:linear-gradient(160deg,color-mix(in srgb,var(--pc) 55%,#1a1040),#120a2c 70%);transition:transform .15s}
.cd-pack:hover .cd-art{transform:translateY(-4px) rotate(-2deg)}
.cd-art::before{content:"";position:absolute;inset:8px;border:2px dashed color-mix(in srgb,var(--pc) 70%,#fff);opacity:.6}
.cd-art b{font:10px var(--title,monospace);color:#fff;text-shadow:0 2px 0 #000;z-index:1;line-height:1.7}
.cd-art::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 35%,rgba(255,255,255,.22) 50%,transparent 65%);transform:translateX(-120%);animation:cdGlint 3.4s ease-in-out infinite}
@keyframes cdGlint{60%,100%{transform:translateX(120%)}}
.cd-pack h3{margin:2px 0 0;font:11px var(--title,monospace);line-height:1.6;color:#fff}
.cd-cost{font:11px var(--title,monospace);color:var(--cb-gold)}
.cd-sm{font-size:12px;color:var(--cb-sub);min-height:48px;line-height:1.35}
.cd-card{--rc:#b8b8c8;--c:#8a5cf0;position:relative;width:var(--w,176px);height:calc(var(--w,176px)*1.42);flex:none;display:flex;flex-direction:column;padding:6px;background:linear-gradient(170deg,color-mix(in srgb,var(--rc) 28%,#1a1040),#120a2c 75%);box-shadow:0 0 0 3px #05010b,0 0 0 5px var(--rc),0 7px 0 5px #05010b;text-align:left;user-select:none;font-size:calc(var(--w,176px)/176*13px);color:#fff}
.cd-card .hd{display:flex;justify-content:space-between;align-items:center;gap:4px;font-weight:800;line-height:1.1}
.cd-card .hd span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cd-card .hd small{font-size:.75em;color:var(--rc);flex:none;font-family:var(--title,monospace)}
.cd-card .im{flex:1;margin:5px 0;display:grid;place-items:center;position:relative;overflow:hidden;background:radial-gradient(ellipse at 50% 85%,color-mix(in srgb,var(--c) 55%,transparent),transparent 70%),repeating-linear-gradient(0deg,#120a2c 0 3px,#171040 3px 6px);box-shadow:inset 0 0 0 2px color-mix(in srgb,var(--rc) 60%,#000)}
.cd-card .im canvas,.cd-card .im img{width:80%;height:auto;image-rendering:pixelated}
.cd-card .tp{display:flex;gap:3px;margin-bottom:4px}
.cd-card .st{display:grid;grid-template-columns:repeat(5,1fr);gap:2px;font-size:.78em;text-align:center}
.cd-card .st span{background:#0a0418;padding:2px 0;box-shadow:inset 0 0 0 1px #3a2a6e}
.cd-card .st em{display:block;font-style:normal;color:var(--cb-sub);font-size:.8em}
.cd-card .n{position:absolute;right:-6px;top:-8px;background:#ff5ad9;color:#220a28;font:10px var(--title,monospace);padding:4px 6px;z-index:3;box-shadow:0 3px 0 #05010b}
.cd-card .nw{position:absolute;left:-6px;top:-8px;background:#ffd07a;color:#2a1600;font:8px var(--title,monospace);padding:4px 5px;z-index:3;box-shadow:0 3px 0 #05010b;animation:cdPop .6s steps(4) infinite alternate}
@keyframes cdPop{to{transform:translateY(-3px)}}
.cd-card.holo .im::after,.cd-card.holo::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.28) 45%,rgba(255,120,255,.18) 52%,transparent 66%);background-size:250% 100%;animation:cdHolo 3s linear infinite;mix-blend-mode:screen}
@keyframes cdHolo{from{background-position:130% 0}to{background-position:-130% 0}}
.cd-card.myth{animation:cbShine 1.8s linear infinite}
.cd-card.ghost{filter:grayscale(1) brightness(.35);opacity:.8}
.cd-card.ghost .im canvas,.cd-card.ghost .im img{filter:brightness(0)}
.cd-card button{all:unset}
.cd-flip{perspective:900px;cursor:var(--cp,pointer)}
.cd-flip .in{position:relative;transform-style:preserve-3d;transition:transform .55s cubic-bezier(.3,1.3,.5,1);width:var(--w,176px);height:calc(var(--w,176px)*1.42)}
.cd-flip.up .in{transform:rotateY(180deg)}
.cd-flip .f,.cd-flip .b{position:absolute;inset:0;backface-visibility:hidden}
.cd-flip .f{transform:rotateY(180deg)}
.cd-back{display:grid;place-items:center;background:repeating-linear-gradient(45deg,#2b2468 0 6px,#1b1238 6px 12px);box-shadow:0 0 0 3px #05010b,0 0 0 5px #8a5cf0,0 7px 0 5px #05010b}
.cd-back::after{content:"?";font:34px var(--title,monospace);color:#ff5ad9;text-shadow:0 4px 0 #000}
.cd-stage{display:flex;flex-wrap:wrap;gap:22px;justify-content:center;padding:22px 8px}
.cd-sum{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;align-items:center;margin:4px 0 8px}
.cd-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--cw,160px),max-content));gap:18px 14px;justify-content:center;max-height:calc(100vh - 270px);overflow:auto;padding:12px 8px 16px}
.cd-cell{position:relative;cursor:var(--cp,pointer)}
.cd-cell:hover .cd-card{transform:translateY(-4px)}
.cd-card{transition:transform .1s}
.cd-bar{height:14px;background:#0a0418;box-shadow:inset 0 0 0 2px var(--cb-line);position:relative}
.cd-bar b{position:absolute;inset:0 auto 0 0;background:repeating-linear-gradient(90deg,var(--c,#ff5ad9) 0 6px,color-mix(in srgb,var(--c,#ff5ad9) 70%,#000) 6px 8px);box-shadow:inset 0 3px 0 rgba(255,255,255,.3)}
.cd-two{display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:14px}
.cd-list{display:flex;flex-direction:column;gap:6px;max-height:calc(100vh - 300px);overflow:auto;padding-right:6px}
.cd-h{display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--cb-card2);box-shadow:inset 0 0 0 2px var(--cb-line);font-size:13px;flex-wrap:wrap}
.cd-h .mini{display:flex;gap:3px;flex-wrap:wrap}
.cd-h .mini i{width:14px;height:14px;box-shadow:inset 0 -3px 0 rgba(0,0,0,.35)}
.cd-ms{display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--cb-card2);box-shadow:inset 0 0 0 2px var(--cb-line);margin:6px 0;font-size:13px}
.cd-ms .cd-bar{flex:1}
.cd-mod{position:fixed;inset:0;z-index:300;background:rgba(5,1,12,.82);display:grid;place-items:center;padding:12px}
.cd-mod .box{display:flex;gap:22px;flex-wrap:wrap;align-items:flex-start;justify-content:center;max-height:92vh;overflow:auto;padding:22px;max-width:min(780px,96vw)}
.cd-mod .info{flex:1;min-width:230px}
.cd-note{color:var(--cb-sub);font-size:13px;line-height:1.4}
`;
const PACKS = [
  { id: 'jour', name: 'Pack du jour', cost: 0, n: 5, col: '#5be37d', sm: 'Gratuit, une fois par jour. Reviens demain pour le suivant.', daily: true },
  { id: 'std', name: 'Pack standard', cost: 150, n: 5, col: '#5cb8ff', sm: '5 cartes tirées dans toute la base.' },
  { id: 'prem', name: 'Pack premium', cost: 450, n: 5, col: '#c070ff', sm: '5 cartes, aucune commune, au moins une rare.', w: [0, 42, 35, 15, 7, 1], minRare: 1 },
  { id: 'elem', name: 'Pack élémentaire', cost: 300, n: 5, col: '#ff8a5c', sm: '5 cartes d\'un seul type, au choix.', elem: true },
];
const SELL_FACTOR = 0.4, PITY_AT = 20;
const MILESTONES = [[10, 100], [25, 200], [50, 400], [100, 900], [150, 1300], [200, 1800], [300, 3000], [400, 4500], [523, 10000]];
const dayKey = d => { const x = d || new Date(); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };
const randInt = n => { const a = new Uint32Array(1); const lim = 4294967296 - (4294967296 % n); let x; do { crypto.getRandomValues(a); x = a[0]; } while (x >= lim); return x % n; };   // unbiased, no modulo skew
const randF = () => { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] / 4294967296; };
const POOLS = {}; CR.RARITIES.forEach((r, i) => POOLS[i] = CREATURES.filter(c => c.r === r.k));
const rollRarity = (w, from = 0) => { let tot = 0; for (let i = from; i < w.length; i++) tot += w[i]; let x = randF() * tot; for (let i = from; i < w.length; i++) { x -= w[i]; if (x < 0) return i; } return w.length - 1; };
const sellValue = c => Math.max(1, Math.round(CR.RARITIES[CR.RK[c.r]].sell * SELL_FACTOR));
// the pack logic is pure (state in, result out): the economy can be tested without the screen
const BASE_W = CR.RARITIES.map(r => r.packW);
function rollPack(pack, elemType, st) {
  const w = pack.w || BASE_W, pool = r => elemType ? POOLS[r].filter(c => c.t === elemType || c.t2 === elemType) : POOLS[r];
  const picks = []; let hasHigh = false;
  for (let i = 0; i < pack.n; i++) {
    let r = rollRarity(w); while (!pool(r).length) r = rollRarity(w);
    picks.push(r);
  }
  if (pack.minRare && Math.max(...picks) < pack.minRare) { picks[picks.length - 1] = Math.max(pack.minRare, rollRarity(w, pack.minRare)); }
  const pity = (st.pity || 0) + 1;
  if (Math.max(...picks) >= 3) hasHigh = true;
  if (!hasHigh && pity >= PITY_AT) { let r = rollRarity(w, 3); while (!pool(r).length) r = rollRarity(w, 3); picks[picks.length - 1] = r; hasHigh = true; }
  const cards = picks.map(r => { const p = pool(r); return p[randInt(p.length)].id; });
  return { cards, pity: hasHigh ? 0 : pity };
}
const emptyDoc = () => ({ v: 1, rev: 0, coins: 200, col: {}, hist: [], daily: { last: '', streak: 0 }, stats: { opened: 0, spent: 0, sold: 0, earned: 0, best: '' }, pity: 0, claimed: [] });
const sane = d => {   // whatever is in the file, the game never starts from an impossible state
  const o = { ...emptyDoc(), ...(d || {}) }; o.daily = { last: '', streak: 0, ...(o.daily || {}) }; o.stats = { ...emptyDoc().stats, ...(o.stats || {}) };
  o.coins = Math.max(0, Math.floor(+o.coins || 0)); o.rev = Math.max(0, Math.floor(+o.rev || 0)); o.pity = Math.max(0, Math.floor(+o.pity || 0));
  const col = {}; for (const [k, v] of Object.entries(o.col || {})) if (CBYID[k] && v > 0) col[k] = Math.min(9999, Math.floor(v)); o.col = col;
  o.hist = Array.isArray(o.hist) ? o.hist.filter(h => h && h.id).slice(0, 200) : []; o.claimed = Array.isArray(o.claimed) ? o.claimed.filter(n => MILESTONES.some(m => m[0] === n)) : [];
  return o;
};
export default async function (ctx) {
  const view = ctx.view;
  const addStyle = css => (ctx.host?.addStyle ? ctx.host.addStyle(css) : (() => { const s = document.createElement('style'); s.textContent = css; document.head.append(s); })());
  CRUI.addStyle(); addStyle(CSS);
  const toast = (m, e) => (ctx.host?.toast || ctx.ui.toast)(m, e);
  const ask = async m => (ctx.host?.confirm ? ctx.host.confirm(m) : true);
  let doc = sane(await ctx.folder.read('cartes').catch(() => null));
  let queue = Promise.resolve();
  // one transaction at a time: read the file again, change, write, then keep the result in memory
  const tx = fn => (queue = queue.then(async () => {
    const fresh = sane(await ctx.folder.read('cartes').catch(() => null) ?? doc);
    if (fresh.rev < doc.rev) Object.assign(fresh, doc);   // never go back to an older save
    const res = fn(fresh); if (res === false) return false;
    fresh.rev++; await ctx.folder.write('cartes', fresh); doc = fresh; return res ?? true;
  }).catch(e => { console.error(e); toast('Sauvegarde impossible : ' + (e.message || e), true); return false; }));
  const S = { tab: 'packs', q: '', types: new Set(), rars: new Set(), show: 'all', sort: 'num', elem: 'feu', busy: false };
  view.innerHTML = '';
  const root = CRUI.el('div', 'cb cd'); view.append(root);
  const top = CRUI.el('div', 'cd-top'), main = CRUI.el('div');
  root.append(top, main);
  const uniq = () => Object.keys(doc.col).length, total = () => Object.values(doc.col).reduce((a, b) => a + b, 0);
  const cardEl = (c, o = {}) => {
    const R = CR.RARITIES[CR.RK[c.r]], d = CRUI.el('div', 'cd-card' + (CR.RK[c.r] >= 3 ? ' holo' : '') + (c.r === 'mythique' ? ' myth' : '') + (o.ghost ? ' ghost' : ''));
    d.style.setProperty('--rc', R.col); d.style.setProperty('--c', CRUI.typeCol(c.t)); if (o.w) d.style.setProperty('--w', o.w + 'px');
    d.innerHTML = `<div class="hd"><span>${o.ghost ? '???' : CRUI.esc(c.n)}</span><small>${c.id.slice(3)}</small></div><div class="im"></div><div class="tp">${o.ghost ? '' : CRUI.typeChips(c)} ${o.ghost ? '' : CRUI.rarBadge(c.r)}</div>` +
      `<div class="st">${CR.STATS.map(k => `<span><em>${CR.STAT_NAMES[k]}</em>${o.ghost ? '?' : c[k]}</span>`).join('')}</div>`;
    d.querySelector('.im').append(o.live ? CRUI.anim(c, 4) : CRUI.img(c, 4));
    if (o.count > 1) d.append(CRUI.el('span', 'n', '×' + o.count));
    if (o.isNew) d.append(CRUI.el('span', 'nw', 'NOUVEAU'));
    return d;
  };
  /* ---------- header ---------- */
  const renderTop = () => {
    top.innerHTML = '';
    const t = CRUI.el('div', 'cb-h', 'Cartes'), coins = CRUI.el('div', 'cd-coins', `<i></i><span>${doc.coins.toLocaleString('fr-FR')} éclats</span>`);
    const tabs = CRUI.el('div', 'cb-tabs'); [['packs', 'Packs'], ['col', 'Collection'], ['inv', 'Inventaire'], ['hist', 'Historique']].forEach(([k, n]) => { const b = CRUI.el('button', 'cb-btn' + (S.tab === k ? ' on' : ''), n); b.onclick = () => { if (S.busy) return; S.tab = k; render(); }; tabs.append(b); });
    const sp = CRUI.el('span'); sp.style.flex = '1';
    top.append(t, tabs, sp, CRUI.el('span', 'cb-sub', `${uniq()} / ${CREATURES.length} cartes`), coins);
  };
  /* ---------- packs ---------- */
  const dailyReady = () => doc.daily.last !== dayKey();
  const renderPacks = () => {
    main.innerHTML = ''; const shop = CRUI.el('div', 'cd-shop');
    PACKS.forEach(p => {
      const box = CRUI.el('div', 'cb-panel cd-pack'); const art = CRUI.el('div', 'cd-art', `<b>${CRUI.esc(p.name.replace('Pack ', 'PACK\n').toUpperCase()).replace('\n', '<br>')}</b>`); art.style.setProperty('--pc', p.col);
      const ready = p.daily ? dailyReady() : doc.coins >= p.cost;
      const btn = CRUI.el('button', 'cb-btn' + (ready ? ' main' : ''), p.daily ? (ready ? 'Ouvrir gratuitement' : 'Déjà ouvert aujourd\'hui') : 'Acheter et ouvrir');
      btn.disabled = !ready; btn.onclick = () => openPack(p);
      box.append(art, CRUI.el('h3', null, CRUI.esc(p.name)), CRUI.el('div', 'cd-cost', p.daily ? 'GRATUIT' : p.cost + ' éclats'), CRUI.el('div', 'cd-sm', CRUI.esc(p.sm)));
      if (p.elem) { const sel = CRUI.el('select', 'cb-in'); CR.TYPE_KEYS.forEach(k => { const o = document.createElement('option'); o.value = k; o.textContent = CR.TYPES[k].n; if (k === S.elem) o.selected = true; sel.append(o); }); sel.onchange = () => S.elem = sel.value; box.append(sel); }
      box.append(btn); if (p.daily && doc.daily.streak > 0) box.append(CRUI.el('div', 'cb-sub', 'Série : ' + doc.daily.streak + ' jour' + (doc.daily.streak > 1 ? 's' : '') + (doc.daily.streak % 7 === 6 ? ' — demain : bonus !' : '')));
      shop.append(box);
    });
    const note = CRUI.el('div', 'cd-note'); note.style.marginTop = '14px';
    note.innerHTML = `Rareté des cartes d'un pack standard : ${CR.RARITIES.map(r => `<b style="color:${r.col}">${r.n} ${r.packW}%</b>`).join(' · ')}.<br>Un pack garantit une carte épique ou mieux au plus tard tous les ${PITY_AT} packs (série en cours : ${doc.pity}). Les doublons se vendent ${Math.round(SELL_FACTOR * 100)} % de la valeur de leur rareté, dans la Collection.`;
    main.append(shop, note);
  };
  const openPack = async p => {
    if (S.busy) return; S.busy = true;
    const elem = p.elem ? S.elem : null; let result = null;
    const ok = await tx(d => {
      const today = dayKey();
      if (p.daily) { if (d.daily.last === today) return false; } else if (d.coins < p.cost) return false;
      const r = rollPack(p, elem, d); const fresh = {}; const seen = new Set(Object.keys(d.col));
      r.cards.forEach(id => { fresh[id] = !seen.has(id); seen.add(id); d.col[id] = (d.col[id] || 0) + 1; });
      let bonus = 0;
      if (p.daily) { const y = new Date(); y.setDate(y.getDate() - 1); d.daily.streak = d.daily.last === dayKey(y) ? d.daily.streak + 1 : 1; d.daily.last = today; if (d.daily.streak % 7 === 0) bonus = 150; }
      else { d.coins -= p.cost; d.stats.spent += p.cost; }
      if (bonus) { d.coins += bonus; d.stats.earned += bonus; }
      d.pity = r.pity; d.stats.opened++;
      const best = r.cards.map(id => CR.RK[CBYID[id].r]).reduce((a, b) => Math.max(a, b), 0); if (best >= (CR.RK[(CBYID[d.stats.best] || {}).r] ?? -1)) d.stats.best = r.cards.find(id => CR.RK[CBYID[id].r] === best);
      d.hist.unshift({ id: 'o' + Date.now().toString(36) + randInt(1e6).toString(36), t: Date.now(), k: p.id, e: elem, c: r.cards, nw: r.cards.filter(id => fresh[id]), bonus });
      d.hist = d.hist.slice(0, 200);
      result = { cards: r.cards, fresh, bonus, pack: p };
    });
    S.busy = false; if (!ok || !result) { render(); return; }
    renderTop(); reveal(result);
  };
  const reveal = res => {
    S.busy = true; main.innerHTML = ''; const stage = CRUI.el('div', 'cd-stage'), sum = CRUI.el('div', 'cd-sum'); let up = 0;
    const done = () => {
      S.busy = false; const nw = res.cards.filter(id => res.fresh[id]).length, dup = res.cards.length - nw, val = res.cards.filter(id => !res.fresh[id]).reduce((a, id) => a + sellValue(CBYID[id]), 0);
      sum.innerHTML = `<span><b>${nw}</b> nouvelle${nw > 1 ? 's' : ''} carte${nw > 1 ? 's' : ''}</span><span><b>${dup}</b> doublon${dup > 1 ? 's' : ''} <span class="cb-sub">(≈ ${val} éclats à la vente)</span></span>${res.bonus ? `<span style="color:#ffd07a">Bonus de série : +${res.bonus} éclats</span>` : ''}`;
      const again = CRUI.el('button', 'cb-btn main', 'Retour aux packs'); again.onclick = () => { S.busy = false; S.tab = 'packs'; render(); }; const col = CRUI.el('button', 'cb-btn', 'Voir la collection'); col.onclick = () => { S.tab = 'col'; render(); };
      sum.append(again, col);
    };
    res.cards.forEach((id, i) => {
      const c = CBYID[id], fl = CRUI.el('div', 'cd-flip'), inn = CRUI.el('div', 'in'), b = CRUI.el('div', 'b cd-back'), f = CRUI.el('div', 'f');
      f.append(cardEl(c, { isNew: res.fresh[id], live: false })); inn.append(b, f); fl.append(inn);
      const flip = () => { if (fl.classList.contains('up')) return; fl.classList.add('up'); up++; if (up === res.cards.length) done(); };
      fl.onclick = flip; fl._flip = flip; stage.append(fl);
    });
    const all = CRUI.el('button', 'cb-btn main', 'Tout révéler'); all.onclick = () => { [...stage.children].forEach((f, i) => setTimeout(() => f._flip(), i * 140)); all.remove(); };
    sum.append(CRUI.el('span', 'cb-sub', 'Clique chaque carte pour la retourner'), all);
    main.append(sum, stage);
  };
  /* ---------- collection ---------- */
  const sortFns = { num: (a, b) => a.id.localeCompare(b.id), nom: (a, b) => a.n.localeCompare(b.n, 'fr'), rar: (a, b) => CR.RK[b.r] - CR.RK[a.r] || a.id.localeCompare(b.id), pui: (a, b) => CR.total(b) - CR.total(a), qte: (a, b) => (doc.col[b.id] || 0) - (doc.col[a.id] || 0) };
  const renderCol = () => {
    main.innerHTML = ''; const bar = CRUI.el('div', 'cd-top'); bar.style.marginBottom = '6px';
    const q = CRUI.el('input', 'cb-in'); q.placeholder = 'Chercher…'; q.value = S.q; q.oninput = () => { S.q = q.value.toLowerCase(); grid(); };
    const sel = (opts, val, fn) => { const s = CRUI.el('select', 'cb-in'); opts.forEach(([v, t]) => { const o = document.createElement('option'); o.value = v; o.textContent = t; if (v === val) o.selected = true; s.append(o); }); s.onchange = () => fn(s.value); return s; };
    bar.append(q, sel([['', 'Tous les types'], ...CR.TYPE_KEYS.map(k => [k, CR.TYPES[k].n])], [...S.types][0] || '', v => { S.types.clear(); if (v) S.types.add(v); grid(); }),
      sel([['', 'Toutes les raretés'], ...CR.RARITIES.map(r => [r.k, r.n])], [...S.rars][0] || '', v => { S.rars.clear(); if (v) S.rars.add(v); grid(); }),
      sel([['all', 'Toutes les cartes'], ['own', 'Possédées'], ['miss', 'Manquantes'], ['dup', 'Doublons']], S.show, v => { S.show = v; grid(); }),
      sel([['num', 'Par numéro'], ['nom', 'Par nom'], ['rar', 'Par rareté'], ['pui', 'Par puissance'], ['qte', 'Par quantité']], S.sort, v => { S.sort = v; grid(); }));
    const dupAll = CRUI.el('button', 'cb-btn', 'Vendre tous les doublons'); dupAll.onclick = sellAllDup; bar.append(dupAll);
    const g = CRUI.el('div', 'cd-grid'); main.append(bar, g);
    const grid = () => {
      g.innerHTML = '';
      const l = CREATURES.filter(c => { const n = doc.col[c.id] || 0; return (!S.types.size || S.types.has(c.t) || S.types.has(c.t2)) && (!S.rars.size || S.rars.has(c.r)) && (S.show === 'all' || (S.show === 'own' && n) || (S.show === 'miss' && !n) || (S.show === 'dup' && n > 1)) && (!S.q || c.n.toLowerCase().includes(S.q) || c.id.includes(S.q)); }).sort(sortFns[S.sort]);
      if (!l.length) g.append(CRUI.el('div', 'cb-sub', 'Aucune carte à afficher.'));
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); const c = CBYID[e.target.dataset.id], n = doc.col[c.id] || 0; e.target.replaceChildren(cardEl(c, { ghost: !n, count: n, w: 150 })); } }), { root: g, rootMargin: '300px' });
      l.forEach(c => { const cell = CRUI.el('div', 'cd-cell'); cell.dataset.id = c.id; cell.style.width = '150px'; cell.style.height = (150 * 1.42 + 8) + 'px'; if (doc.col[c.id]) cell.onclick = () => detail(c); g.append(cell); io.observe(cell); });
    };
    grid();
  };
  const sellCards = async (list, label) => {   // list: [[id, qty]]
    const val = list.reduce((a, [id, n]) => a + sellValue(CBYID[id]) * n, 0), qty = list.reduce((a, [, n]) => a + n, 0);
    if (!qty || !(await ask(`${label} : ${qty} carte${qty > 1 ? 's' : ''} pour ${val} éclats ?`))) return false;
    let sold = 0;
    const ok = await tx(d => { let gain = 0, n = 0; for (const [id, q] of list) { const have = d.col[id] || 0, take = Math.min(q, have - 1); if (take > 0) { d.col[id] = have - take; gain += sellValue(CBYID[id]) * take; n += take; } } if (!n) return false; d.coins += gain; d.stats.sold += n; d.stats.earned += gain; d.hist.unshift({ id: 's' + Date.now().toString(36) + randInt(1e6).toString(36), t: Date.now(), k: 'vente', c: list.flatMap(([id, q]) => Array(Math.min(q, 6)).fill(id)).slice(0, 12), gain, n }); d.hist = d.hist.slice(0, 200); sold = gain; });
    if (ok) { toast('+' + sold + ' éclats'); renderTop(); } return ok;
  };
  const sellAllDup = async () => { const l = Object.entries(doc.col).filter(([, n]) => n > 1).map(([id, n]) => [id, n - 1]); if (!l.length) { toast('Aucun doublon à vendre.'); return; } if (await sellCards(l, 'Vendre tous les doublons (une carte de chaque est gardée)')) render(); };
  const detail = c => {
    const n = doc.col[c.id] || 0, mod = CRUI.el('div', 'cd-mod'), box = CRUI.el('div', 'cb-panel box cb'); mod.append(box); view.append(mod);
    const close = () => { mod.remove(); document.removeEventListener('keydown', k); }, k = e => e.key === 'Escape' && close(); document.addEventListener('keydown', k); mod.onclick = e => e.target === mod && close();
    const info = CRUI.el('div', 'info'); info.innerHTML = `<div class="cb-h" style="margin-bottom:8px">${CRUI.esc(c.n)}</div><div class="cb-sub">N° ${c.id.slice(3)} · Possédée ×${n}</div><p class="cd-note" style="margin:10px 0">${CRUI.esc(c.d)}</p>` + CRUI.bars(c) + `<div style="margin-top:8px">${c.ab.map(CRUI.abilityHtml).join('')}</div>`;
    const acts = CRUI.el('div'); acts.style.marginTop = '12px';
    if (n > 1) { const b1 = CRUI.el('button', 'cb-btn', `Vendre 1 doublon (+${sellValue(c)})`); b1.onclick = async () => { if (await sellCards([[c.id, 1]], 'Vendre 1 doublon')) { close(); render(); } }; acts.append(b1); if (n > 2) { const b2 = CRUI.el('button', 'cb-btn', `Vendre ${n - 1} doublons (+${sellValue(c) * (n - 1)})`); b2.onclick = async () => { if (await sellCards([[c.id, n - 1]], 'Vendre les doublons')) { close(); render(); } }; acts.append(b2); } }
    else acts.append(CRUI.el('div', 'cd-note', 'Une seule carte : elle est gardée (on ne vend que les doublons).'));
    const cl = CRUI.el('button', 'cb-btn', 'Fermer'); cl.onclick = close; acts.append(cl); info.append(acts);
    box.append(cardEl(c, { w: 220, live: true, count: n }), info);
  };
  /* ---------- inventory ---------- */
  const renderInv = () => {
    main.innerHTML = ''; const two = CRUI.el('div', 'cd-two');
    const dup = Object.values(doc.col).filter(n => n > 1).reduce((a, n) => a + n - 1, 0), val = Object.entries(doc.col).reduce((a, [id, n]) => a + (n > 1 ? sellValue(CBYID[id]) * (n - 1) : 0), 0);
    const p1 = CRUI.el('div', 'cb-panel'); p1.innerHTML = `<div class="cb-h" style="margin-bottom:10px">Résumé</div>
      <div class="cd-h"><span>Éclats</span><b style="margin-left:auto;color:#ffd07a">${doc.coins.toLocaleString('fr-FR')}</b></div>
      <div class="cd-h"><span>Cartes uniques</span><b style="margin-left:auto">${uniq()} / ${CREATURES.length}</b></div>
      <div class="cd-h"><span>Cartes au total</span><b style="margin-left:auto">${total()}</b></div>
      <div class="cd-h"><span>Doublons</span><b style="margin-left:auto">${dup} <span class="cb-sub">(≈ ${val} éclats)</span></b></div>
      <div class="cd-h"><span>Packs ouverts</span><b style="margin-left:auto">${doc.stats.opened}</b></div>
      <div class="cd-h"><span>Éclats dépensés / gagnés</span><b style="margin-left:auto">${doc.stats.spent} / ${doc.stats.earned}</b></div>
      <div class="cd-h"><span>Doublons vendus</span><b style="margin-left:auto">${doc.stats.sold}</b></div>
      <div class="cd-h"><span>Série du pack du jour</span><b style="margin-left:auto">${doc.daily.streak}</b></div>`;
    if (CBYID[doc.stats.best]) { const b = CRUI.el('div'); b.style.cssText = 'display:flex;justify-content:center;margin:16px 0 6px'; b.append(cardEl(CBYID[doc.stats.best], { w: 150 })); p1.append(CRUI.el('div', 'cb-sub', 'Ta plus belle carte :'), b); }
    const p2 = CRUI.el('div', 'cb-panel'); p2.append(CRUI.el('div', 'cb-h', 'Avancement'));
    const row = (name, have, tot, col) => { const d = CRUI.el('div'); d.style.margin = '9px 0'; d.innerHTML = `<div style="display:flex;justify-content:space-between;font-size:13px"><span>${name}</span><span class="cb-sub">${have} / ${tot}</span></div><div class="cd-bar" style="--c:${col}"><b style="width:${tot ? have / tot * 100 : 0}%"></b></div>`; return d; };
    p2.append(row('Collection complète', uniq(), CREATURES.length, '#ff5ad9'));
    CR.RARITIES.forEach(r => p2.append(row(r.n, CREATURES.filter(c => c.r === r.k && doc.col[c.id]).length, CREATURES.filter(c => c.r === r.k).length, r.col)));
    p2.append(CRUI.el('div', 'cb-h', 'Par type')).style.marginTop = '14px'; CR.TYPE_KEYS.forEach(t => p2.append(row(CR.TYPES[t].n, CREATURES.filter(c => c.t === t && doc.col[c.id]).length, CREATURES.filter(c => c.t === t).length, CRUI.typeCol(t))));
    const p3 = CRUI.el('div', 'cb-panel'); p3.append(CRUI.el('div', 'cb-h', 'Jalons de collection'));
    MILESTONES.forEach(([n, gain]) => { const got = doc.claimed.includes(n), can = uniq() >= n && !got, m = CRUI.el('div', 'cd-ms'); m.innerHTML = `<span style="min-width:96px">${n} cartes</span><div class="cd-bar" style="--c:${got ? '#5be37d' : '#ffd07a'}"><b style="width:${Math.min(100, uniq() / n * 100)}%"></b></div><span style="color:#ffd07a">+${gain}</span>`; const b = CRUI.el('button', 'cb-btn sm' + (can ? ' main' : ''), got ? 'Reçu' : 'Récupérer'); b.disabled = !can; b.onclick = async () => { if (await tx(d => { if (d.claimed.includes(n) || Object.keys(d.col).length < n) return false; d.claimed.push(n); d.coins += gain; d.stats.earned += gain; })) { toast('Jalon atteint : +' + gain + ' éclats'); renderTop(); render(); } }; m.append(b); p3.append(m); });
    two.append(p1, p2, p3); main.append(two);
  };
  /* ---------- history ---------- */
  const PN = { jour: 'Pack du jour', std: 'Pack standard', prem: 'Pack premium', elem: 'Pack élémentaire', vente: 'Vente de doublons' };
  const renderHist = () => {
    main.innerHTML = ''; const l = CRUI.el('div', 'cd-list');
    if (!doc.hist.length) l.append(CRUI.el('div', 'cb-sub', 'Rien pour l\'instant : ouvre ton premier pack !'));
    doc.hist.forEach(h => { const d = new Date(h.t), row = CRUI.el('div', 'cd-h'); const mini = CRUI.el('div', 'mini'); (h.c || []).forEach(id => { const c = CBYID[id]; if (c) { const i = CRUI.el('i'); i.style.background = CR.RARITIES[CR.RK[c.r]].col; i.title = c.n; mini.append(i); } });
      row.innerHTML = `<b style="min-width:150px">${PN[h.k] || h.k}${h.e ? ' · ' + CR.TYPES[h.e].n : ''}</b><span class="cb-sub" style="min-width:130px">${d.toLocaleDateString('fr-FR')} ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>`; row.append(mini);
      const ex = CRUI.el('span', 'cb-sub'); ex.style.marginLeft = 'auto'; ex.textContent = h.k === 'vente' ? '+' + h.gain + ' éclats · ' + h.n + ' carte' + (h.n > 1 ? 's' : '') : (h.nw?.length ? h.nw.length + ' nouvelle' + (h.nw.length > 1 ? 's' : '') : 'que des doublons') + (h.bonus ? ' · bonus +' + h.bonus : ''); row.append(ex); l.append(row); });
    main.append(l);
  };
  const render = () => { renderTop(); ({ packs: renderPacks, col: renderCol, inv: renderInv, hist: renderHist })[S.tab](); };
  if (globalThis.__cartesTest) globalThis.__cartesTest = { CBYID, rollPack, sellValue, sane, emptyDoc, tx, get doc() { return doc; }, openPack, S, PACKS, BASE_W, PITY_AT, SELL_FACTOR, dayKey };
  render();
}
