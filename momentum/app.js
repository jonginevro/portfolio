"use strict";

const state = {
  index: null,
  teams: null,
  games: [],      // filtered/sorted view
  current: null,  // loaded game object
  hoverIdx: null,
};

const $ = (s) => document.querySelector(s);

/* ---------- boot ---------- */
async function boot() {
  const [index, teams] = await Promise.all([
    fetch("data/index.json").then((r) => r.json()),
    fetch("data/teams.json").then((r) => r.json()),
  ]);
  state.index = index;
  state.teams = teams;
  $("#game-count").textContent = index.generated_games.toLocaleString();

  buildFeatured();
  wireControls();
  applyFilters();

  // default: the most recent game (deterministic — latest date, then latest id)
  const def = [...state.index.games].sort(
    (a, b) => b.date.localeCompare(a.date) || b.game_id - a.game_id)[0];
  if (def) loadGame(def.game_id);

  window.addEventListener("resize", () => {
    if (state.current) drawChart();
    syncHeights();
  });
}

// Cap the game list so the sidebar bottom lines up with the stage card (desktop only).
function syncHeights() {
  const stage = document.querySelector(".stage");
  const filters = document.querySelector(".filters");
  const list = document.querySelector("#game-list");
  if (!stage || !filters || !list) return;
  if (window.innerWidth > 900) {
    const h = stage.getBoundingClientRect().height - filters.getBoundingClientRect().height;
    list.style.maxHeight = Math.max(240, Math.floor(h)) + "px";
  } else {
    list.style.maxHeight = "420px";
  }
}

/* ---------- featured strip ---------- */
function buildFeatured() {
  const g = state.index.games;
  const recent = [...g].sort((a, b) => b.date.localeCompare(a.date) || b.game_id - a.game_id)[0];
  const comeback = [...g].sort((a, b) => b.comeback - a.comeback)[0];
  const leads = [...g].sort((a, b) => b.lead_changes - a.lead_changes)[0];
  const swing = [...g].sort((a, b) => b.swing - a.swing)[0];
  const cards = [
    ["Most recent", recent, recent.season_type],
    ["Biggest comeback", comeback, `${comeback.comeback}-pt comeback`],
    ["Most lead changes", leads, `${leads.lead_changes} lead changes`],
    ["Back-and-forth", swing, `${swing.swing} swings`],
  ];
  $("#featured").innerHTML = cards.map(([label, gm, val]) => `
    <div class="fcard" data-id="${gm.game_id}">
      <div class="flabel">${label}</div>
      <div class="fmatch">${gm.a} ${gm.as} @ ${gm.h} ${gm.hs}</div>
      <div class="fval">${val}</div>
      <div class="fdate">${fmtDate(gm.date)}</div>
    </div>`).join("");
  $("#featured").querySelectorAll(".fcard").forEach((el) =>
    el.addEventListener("click", () => loadGame(+el.dataset.id)));
}

/* ---------- filters / list ---------- */
function wireControls() {
  $("#search").addEventListener("input", applyFilters);
  $("#season-type").addEventListener("change", applyFilters);
  $("#sort").addEventListener("change", applyFilters);
}

function applyFilters() {
  const q = $("#search").value.trim().toLowerCase();
  const st = $("#season-type").value;
  const sort = $("#sort").value;
  let games = state.index.games.filter((g) => {
    if (st && g.season_type !== st) return false;
    if (!q) return true;
    const hay = `${g.h} ${g.a} ${teamName(g.hid)} ${teamName(g.aid)}`.toLowerCase();
    return hay.includes(q);
  });
  const cmp = {
    "date-desc": (a, b) => b.date.localeCompare(a.date) || b.game_id - a.game_id,
    "date-asc": (a, b) => a.date.localeCompare(b.date) || a.game_id - b.game_id,
    "lead_changes": (a, b) => b.lead_changes - a.lead_changes,
    "comeback": (a, b) => b.comeback - a.comeback,
    "swing": (a, b) => b.swing - a.swing,
  }[sort];
  games.sort(cmp);
  state.games = games;
  $("#result-count").textContent = `${games.length.toLocaleString()} game${games.length === 1 ? "" : "s"}`;
  renderList();
}

function renderList() {
  const cur = state.current ? state.current.game_id : null;
  const html = state.games.slice(0, 400).map((g) => {
    const homeWin = g.hs > g.as;
    return `<li data-id="${g.game_id}" class="${g.game_id === cur ? "active" : ""}">
      <div class="gl-teams">
        <div class="gl-line"><span class="ab ${homeWin ? "lose" : "win"}">${g.a}</span><span class="${homeWin ? "lose" : "win"}">${g.as}</span></div>
        <div class="gl-line"><span class="ab ${homeWin ? "win" : "lose"}">${g.h}</span><span class="${homeWin ? "win" : "lose"}">${g.hs}</span></div>
      </div>
      <div style="text-align:right">
        <div class="gl-date">${fmtDate(g.date)}</div>
        ${g.season_type !== "Regular Season" ? `<span class="gl-tag">${g.season_type}</span>` : ""}
        ${g.ot ? `<span class="gl-tag">OT</span>` : ""}
      </div>
    </li>`;
  }).join("");
  const list = $("#game-list");
  list.innerHTML = html;
  list.querySelectorAll("li").forEach((el) =>
    el.addEventListener("click", () => loadGame(+el.dataset.id)));
  if (state.games.length > 400) {
    const li = document.createElement("li");
    li.style.cssText = "color:var(--muted);justify-content:center;cursor:default";
    li.textContent = `+${state.games.length - 400} more — refine the filter`;
    list.appendChild(li);
  }
}

/* ---------- load & render a game ---------- */
async function loadGame(id) {
  const g = await fetch(`data/games/${id}.json`).then((r) => r.json());
  state.current = g;
  state.hoverIdx = null;
  renderList();
  renderScoreboard(g);
  renderLegend(g);
  renderKeyStats(g);
  drawChart();
  syncHeights();
}

function renderScoreboard(g) {
  const hLogo = state.teams[g.home.id]?.logo || "";
  const aLogo = state.teams[g.away.id]?.logo || "";
  const homeWin = g.home.score > g.away.score;
  $("#scoreboard").innerHTML = `
    <div class="sb-team">
      <img src="${aLogo}" alt="${g.away.abbrev}" />
      <div><div class="tn">${g.away.name}</div><div class="tr">Away</div></div>
    </div>
    <div class="sb-score ${homeWin ? "lose" : "win"}">${g.away.score}</div>
    <div class="sb-mid">
      <div class="at">@</div>
      <div class="meta">${fmtDate(g.date, true)}</div>
      <span class="tag">${g.season_type}${g.ot ? ` · ${g.ot}OT` : ""}</span>
    </div>
    <div class="sb-score ${homeWin ? "win" : "lose"}">${g.home.score}</div>
    <div class="sb-team">
      <img src="${hLogo}" alt="${g.home.abbrev}" />
      <div><div class="tn">${g.home.name}</div><div class="tr">Home</div></div>
    </div>`;
}

function renderLegend(g) {
  $("#chart-legend").innerHTML = `
    <div class="lg"><span class="sw" style="background:${teamColor(g.home)}"></span>${g.home.abbrev} momentum (above)</div>
    <div class="lg"><span class="sw" style="background:${teamColor(g.away)}"></span>${g.away.abbrev} momentum (below)</div>`;
}

function renderKeyStats(g) {
  const s = g.stats;
  const runTeam = s.biggest_run_team === "home" ? g.home.abbrev : g.away.abbrev;
  const cards = [
    [s.lead_changes, "Lead changes"],
    [s.times_tied, "Times tied"],
    [`${s.biggest_run_pts}-0`, `Biggest run · ${runTeam}`],
    [s.comeback ? `${s.comeback} pts` : "—", "Winner's deficit"],
  ];
  $("#keystats").innerHTML = cards.map(([v, l]) =>
    `<div class="kstat"><div class="kv">${v}</div><div class="kl">${l}</div></div>`).join("");
}

/* ---------- the chart ---------- */
function drawChart() {
  const g = state.current;
  const canvas = $("#chart");
  const wrap = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  const W = wrap.clientWidth, H = wrap.clientHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const padL = 16, padR = 16, padT = 14, padB = 22;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const midY = padT + plotH / 2;
  const total = g.total_seconds;
  const x = (t) => padL + (t / total) * plotW;
  const y = (m) => midY - (m / 100) * (plotH / 2);

  // period gridlines + labels
  ctx.font = "11px -apple-system,Segoe UI,Roboto,sans-serif";
  ctx.textAlign = "center";
  const bounds = [0, ...g.periods];
  for (let i = 0; i < g.periods.length; i++) {
    const px = x(g.periods[i]);
    ctx.strokeStyle = "#1b2536";
    ctx.beginPath(); ctx.moveTo(px, padT); ctx.lineTo(px, padT + plotH); ctx.stroke();
    const cx = (x(bounds[i]) + x(bounds[i + 1])) / 2;
    ctx.fillStyle = "#5f6c82";
    ctx.fillText(periodLabel(i, g.periods.length), cx, padT + plotH + 15);
  }

  // filled momentum area, split at the centerline (home color above, away below)
  const t = g.t, m = g.m;
  const hc = teamColor(g.home), ac = teamColor(g.away);
  fillArea(ctx, t, m, x, y, midY, true, hexA(hc, 0.6));
  fillArea(ctx, t, m, x, y, midY, false, hexA(ac, 0.6));

  // centerline
  ctx.strokeStyle = "#33415c";
  ctx.beginPath(); ctx.moveTo(padL, midY); ctx.lineTo(padL + plotW, midY); ctx.stroke();

  // momentum outline
  ctx.beginPath();
  for (let i = 0; i < t.length; i++) {
    const px = x(t[i]), py = y(m[i]);
    i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  }
  ctx.strokeStyle = "#c9d4e6"; ctx.lineWidth = 1.4; ctx.stroke();

  // axis team labels
  ctx.textAlign = "left"; ctx.fillStyle = hc;
  ctx.font = "700 12px -apple-system,Segoe UI,Roboto,sans-serif";
  ctx.fillText(g.home.abbrev + " ▲", padL + 2, padT + 12);
  ctx.fillStyle = ac;
  ctx.fillText(g.away.abbrev + " ▼", padL + 2, padT + plotH - 4);

  // hover marker
  if (state.hoverIdx != null) {
    const i = state.hoverIdx, px = x(t[i]), py = y(m[i]);
    ctx.strokeStyle = "#54627e"; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(px, padT); ctx.lineTo(px, padT + plotH); ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(px, py, 4.5, 0, 7); ctx.fillStyle = "#fff"; ctx.fill();
  }

  // store geometry for hover math
  canvas._geo = { padL, plotW, total, x };
  bindHover(canvas);
}

function fillArea(ctx, t, m, x, y, midY, above, color) {
  ctx.beginPath();
  ctx.moveTo(x(t[0]), midY);
  for (let i = 0; i < t.length; i++) {
    const v = above ? Math.max(0, m[i]) : Math.min(0, m[i]);
    ctx.lineTo(x(t[i]), y(v));
  }
  ctx.lineTo(x(t[t.length - 1]), midY);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function bindHover(canvas) {
  if (canvas._hooked) return;
  canvas._hooked = true;
  const tip = $("#tooltip");
  const move = (ev) => {
    const g = state.current; if (!g) return;
    const rect = canvas.getBoundingClientRect();
    const geo = canvas._geo;
    const mx = ev.clientX - rect.left;
    let frac = (mx - geo.padL) / geo.plotW;
    frac = Math.max(0, Math.min(1, frac));
    const targetT = frac * geo.total;
    // nearest sample
    let i = Math.round(targetT / g.grid_step);
    i = Math.max(0, Math.min(g.t.length - 1, i));
    state.hoverIdx = i;
    drawChart();
    // tooltip
    const leader = g.m[i] > 3 ? g.home : g.m[i] < -3 ? g.away : null;
    const strength = Math.abs(g.m[i]);
    tip.hidden = false;
    tip.style.left = geo.x(g.t[i]) + "px";
    tip.style.top = (rect.height / 2) + "px";
    tip.innerHTML = `
      <div class="tt-time">${clockLabel(g, g.t[i])}</div>
      <div class="tt-score"><span><span class="dotc" style="background:${teamColor(g.away)}"></span>${g.away.abbrev} ${g.as[i]}</span>
        <span>${g.home.abbrev} ${g.hs[i]}<span class="dotc" style="background:${teamColor(g.home)};margin-left:5px;margin-right:0"></span></span></div>
      <div class="tt-mom">${leader ? `<b style="color:${teamColor(leader)}">${leader.abbrev}</b> momentum · ${strength}` : "Even"}</div>`;
  };
  canvas.addEventListener("mousemove", move);
  canvas.addEventListener("mouseleave", () => {
    state.hoverIdx = null; $("#tooltip").hidden = true; drawChart();
  });
}

/* ---------- helpers ---------- */
function periodLabel(i, n) {
  return i < 4 ? "Q" + (i + 1) : (n - 4 === 1 ? "OT" : "OT" + (i - 3));
}
function clockLabel(g, elapsed) {
  const bounds = [0, ...g.periods];
  let p = 0;
  for (let i = 0; i < g.periods.length; i++) if (elapsed > bounds[i]) p = i;
  const plen = p < 4 ? 720 : 300;
  const into = elapsed - bounds[p];
  const rem = Math.max(0, plen - into);
  const mm = Math.floor(rem / 60), ss = Math.floor(rem % 60);
  return `${periodLabel(p, g.periods.length)} ${mm}:${ss.toString().padStart(2, "0")}`;
}
function teamName(id) { return state.teams[id]?.name || ""; }
function relLum(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
function lighten(hex, mix) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  const t = [201, 206, 216]; // silver
  const c = [r, g, b].map((v, i) => Math.round(v + (t[i] - v) * mix));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
// Team fill/label color that stays visible on a dark background: if the primary
// color is too dark (e.g. Spurs/Nets black), fall back to a light alt or lighten it.
function teamColor(team) {
  const c = team.color || "#1d428a";
  if (relLum(c) > 0.16) return c;
  const alt = state.teams[team.id]?.alt;
  if (alt && relLum(alt) > 0.16) return alt;
  return lighten(c, 0.72);
}
function fmtDate(d, long) {
  const [y, m, day] = d.split("-").map(Number);
  const mo = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m - 1];
  return long ? `${mo} ${day}, ${y}` : `${mo} ${day}`;
}
function hexA(hex, a) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

boot();
