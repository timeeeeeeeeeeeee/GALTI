// Gal人生重开模拟器 - UI Controller

let lifeStep = 0;
let lifeChoices = {};
let lifePoints = { 健康: 0, 颜值: 0, 财富: 0, 智力: 0 };
let lifeTotalPoints = 20;
let currentEvent = null;

function startLifeRestart() {
  lifeStep = 0; lifeChoices = {};
  lifePoints = { 健康: 0, 颜值: 0, 财富: 0, 智力: 0 };
  currentEvent = null;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('lifeSetupPage').classList.add('active');
  renderLifeSetup();
}

function renderLifeSetup() {
  const c = document.getElementById('lifeSetupContent');
  const steps = ['性别','世界','身份','出生地','特殊属性','分配属性'];
  let h = `<div class="ls-steps">${steps.map((s,i)=>`<span class="ls-step ${i<=lifeStep?'active':''}">${i+1}.${s}</span>`).join('→')}</div>`;

  if (lifeStep === 0) {
    h += `<h3>选择性别</h3><div class="ls-grid2">
      <button class="ls-btn" onclick="lifePick('gender','男')">👦 男生</button>
      <button class="ls-btn" onclick="lifePick('gender','女')">👧 女生</button></div>`;
  } else if (lifeStep === 1) {
    h += `<h3>选择世界</h3><div class="ls-world-grid">`;
    for (const [n,w] of Object.entries(LIFE_WORLDS)) {
      h += `<button class="ls-btn ls-world" onclick="lifePick('world','${n}')">
        <span style="font-size:1.5em">${w.icon}</span><strong>${n}</strong><small>${w.desc}</small></button>`;
    }
    h += `</div><button class="ls-back" onclick="lifeStep--;renderLifeSetup()">← 返回</button>`;
  } else if (lifeStep === 2) {
    const w = LIFE_WORLDS[lifeChoices.world];
    h += `<h3>${w.icon} 选择身份</h3><div class="ls-grid2">`;
    w.identities.forEach(id => {
      h += `<button class="ls-btn" onclick="lifePick('identity','${id.name}')"><strong>${id.name}</strong><br><small>${id.desc}</small></button>`;
    });
    h += `</div><button class="ls-back" onclick="lifeStep--;renderLifeSetup()">← 返回</button>`;
  } else if (lifeStep === 3) {
    const w = LIFE_WORLDS[lifeChoices.world];
    h += `<h3>选择出生地</h3><div class="ls-grid2">`;
    w.birthplaces.forEach(bp => {
      h += `<button class="ls-btn" onclick="lifePick('birthplace','${bp}')">📍 ${bp}</button>`;
    });
    h += `</div><button class="ls-back" onclick="lifeStep--;renderLifeSetup()">← 返回</button>`;
  } else if (lifeStep === 4) {
    const w = LIFE_WORLDS[lifeChoices.world];
    if (w.extraChoices && w.extraChoices.length > 0) {
      const ec = w.extraChoices[0];
      h += `<h3>${ec.title}</h3><div class="ls-grid2">`;
      ec.options.forEach(o => {
        h += `<button class="ls-btn" onclick="lifePickExtra('${ec.key}','${o}')">${o}</button>`;
      });
      h += `</div>`;
    } else { lifeChoices.extras = {}; lifeStep++; renderLifeSetup(); return; }
    h += `<button class="ls-back" onclick="lifeStep--;renderLifeSetup()">← 返回</button>`;
  } else if (lifeStep === 5) {
    const rem = lifeTotalPoints - lifePoints.健康 - lifePoints.颜值 - lifePoints.财富 - lifePoints.智力;
    const ic = {健康:'❤️',颜值:'✨',财富:'💰',智力:'🧠'};
    h += `<h3>分配属性（${lifeTotalPoints}点，剩余${rem}点）</h3><div class="ls-stat-alloc">`;
    ['健康','颜值','财富','智力'].forEach(a => {
      h += `<div class="ls-stat-row">
        <span>${ic[a]} ${a}</span>
        <button class="ls-pm" onclick="lifeAdj('${a}',-1)">-</button>
        <span style="min-width:30px;text-align:center">${lifePoints[a]}</span>
        <button class="ls-pm" onclick="lifeAdj('${a}',1)">+</button>
        <div class="ls-bar-bg"><div class="ls-bar" style="width:${lifePoints[a]*10}%"></div></div></div>`;
    });
    h += `</div>`;
    if (rem === 0) h += `<button class="ls-go" onclick="startLifeGame()">🎮 开始人生！</button>`;
    else h += `<p style="color:var(--accent)">还需分配${rem}点</p>`;
    h += `<button class="ls-back" onclick="lifeStep--;renderLifeSetup()">← 返回</button>`;
  }
  c.innerHTML = h;
}

function lifePick(k, v) { lifeChoices[k] = v; lifeStep++; renderLifeSetup(); }
function lifePickExtra(k, v) {
  if (!lifeChoices.extras) lifeChoices.extras = {};
  lifeChoices.extras[k] = v; lifeStep++; renderLifeSetup();
}
function lifeAdj(a, d) {
  const rem = lifeTotalPoints - lifePoints.健康 - lifePoints.颜值 - lifePoints.财富 - lifePoints.智力;
  if (d > 0 && rem <= 0) return;
  if (d < 0 && lifePoints[a] <= 0) return;
  lifePoints[a] += d; renderLifeSetup();
}

function startLifeGame() {
  LifeGame.init(lifeChoices.gender, lifeChoices.world, lifeChoices.identity, lifeChoices.birthplace, {...lifePoints}, lifeChoices.extras);
  lifeStep = 6;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('lifeGamePage').classList.add('active');
  renderLifeGame();
}

function renderLifeGame() {
  const s = LifeGame.state, st = s.stats;
  const ic = {健康:'❤️',颜值:'✨',财富:'💰',智力:'🧠',快乐:'😊'};
  const clr = {健康:'#4ecca3',颜值:'#e85898',财富:'#f5a623',智力:'#7c5cbf',快乐:'#f5c542'};
  let statsH = '<div class="lg-stats">';
  for (const [k,v] of Object.entries(st)) {
    statsH += `<div class="lg-stat"><span>${ic[k]}</span>
      <div class="lg-stat-bar"><div style="width:${v*10}%;background:${clr[k]}"></div></div>
      <small>${Math.floor(v)}</small></div>`;
  }
  statsH += '</div>';

  let logH = '<div class="lg-log">';
  LifeGame.historyLog.slice(-6).forEach(e => {
    logH += `<div class="lg-entry"><b>${Math.floor(e.age)}岁</b> ${e.text}</div>`;
  });
  logH += '</div>';

  let evtH = '';
  if (currentEvent) {
    evtH = `<div class="lg-event"><p>${currentEvent.narrative||currentEvent.event}</p>`;
    if (currentEvent.options) {
      evtH += '<div class="lg-opts">';
      currentEvent.options.forEach((o,i) => {
        let fx = '';
        if (o.effects) {
          const p = [];
          for (const [k,v] of Object.entries(o.effects)) if(v!==0) p.push(`${ic[k]||k}${v>0?'+':''}${v}`);
          if(p.length) fx = ` <small style="color:var(--dim)">[${p.join(' ')}]</small>`;
        }
        evtH += `<button class="lg-choice" onclick="lifeChoose(${i})">${o.text}${fx}</button>`;
      });
      evtH += '</div>';
    }
    evtH += '</div>';
  }

  const tOpts = LifeGame.getTimeSkipOptions(Math.floor(s.age));
  let tH = '<div class="lg-time"><span style="color:var(--dim);font-size:.85em">⏰</span>';
  tOpts.forEach(t => {
    tH += `<button class="lg-tbtn" onclick="lifeSkip(${t.years||0},${t.months||0},${t.days||0})">${t.text}</button>`;
  });
  tH += '</div>';

  document.getElementById('lifeGameContent').innerHTML = `
    <div class="lg-header"><h2>🎮 ${s.name}的人生</h2>
    <p style="color:var(--dim)">🌍${s.world} · 🎭${s.identity} · 📍${s.birthplace} · 📅${Math.floor(s.age)}岁</p>
    ${statsH}</div>${logH}${evtH}
    <div style="text-align:center;margin-top:12px">
      <div id="timeSkipArea">${tH}</div>
      <div id="genStatus" style="color:var(--dim);font-size:.9em;margin-top:8px;display:none">⏳ AI正在生成事件...</div>
    </div>`;
}

async function lifeGenEvent() {
  if (LifeGame.isGenerating) return;
  LifeGame.isGenerating = true;
  // Show loading state
  const skipArea = document.getElementById('timeSkipArea');
  const genStatus = document.getElementById('genStatus');
  if (skipArea) skipArea.style.display = 'none';
  if (genStatus) { genStatus.style.display = 'block'; genStatus.textContent = '⏳ AI正在生成事件...'; }
  try {
    const cfg = LifeGame.getApiConfig();
    if (cfg.apiKey && cfg.url) {
      const r = await LifeGame.callAI(LifeGame.buildContext());
      currentEvent = r;
      if (r.isDeath) { LifeGame.state.alive = false; LifeGame.state.causeOfDeath = r.deathCause||''; }
    } else { currentEvent = LifeGame.generateFallbackEvent(); }
  } catch(e) { console.warn('AI fail:', e); currentEvent = LifeGame.generateFallbackEvent(); }
  LifeGame.isGenerating = false;
  LifeGame.historyLog.push({age:Math.floor(LifeGame.state.age), text:currentEvent.narrative||currentEvent.event});
  // Check death after event
  if (!LifeGame.state.alive) { showLifeDeath(); return; }
  renderLifeGame();
}

function lifeChoose(i) {
  if (!currentEvent?.options) return;
  const o = currentEvent.options[i];
  LifeGame.applyChoice(o);
  LifeGame.historyLog.push({age:Math.floor(LifeGame.state.age), text:'→ '+o.text});
  currentEvent = null;
  // Check death after choice
  if (!LifeGame.state.alive) { showLifeDeath(); return; }
  renderLifeGame();
}

function lifeSkip(y,m,d) {
  const died = LifeGame.advanceTime(y,m,d);
  if (died || !LifeGame.state.alive) { LifeGame.state.alive = false; showLifeDeath(); return; }
  // Auto-generate event after time skip
  renderLifeGame();
  lifeGenEvent();
}

function showLifeDeath() {
  const sum = LifeGame.generateSummary();
  const ic = {健康:'❤️',颜值:'✨',财富:'💰',智力:'🧠',快乐:'😊'};
  let h = `<div class="ld-card"><h2>💀 ${sum.name}的一生</h2>
    <p style="font-size:1.3em;color:var(--accent);margin:12px 0">${sum.quality}人生 · 享年${sum.age}岁</p>
    <p style="color:var(--dim)">死因：${sum.causeOfDeath}</p><div class="ld-stats">`;
  for (const [k,v] of Object.entries(sum.stats)) {
    h += `<div class="ld-stat"><span>${ic[k]} ${k}</span>
      <div class="ls-bar-bg"><div class="ls-bar" style="width:${v*10}%"></div></div>
      <span>${Math.floor(v)}</span></div>`;
  }
  h += '</div><h3 style="margin-top:18px">📖 死后的世界</h3><div class="ld-future">';
  sum.futureEvents.forEach(e => { h += `<p>${e}</p>`; });
  h += '</div><h3 style="margin-top:18px">📜 人生回顾</h3><div class="ld-timeline">';
  LifeGame.historyLog.forEach(e => {
    h += `<div class="ld-entry"><b>${Math.floor(e.age)}岁</b> ${e.text}</div>`;
  });
  h += `</div><div style="display:flex;gap:12px;justify-content:center;margin-top:20px">
    <button class="ls-go" onclick="startLifeRestart()">🔄 重新开始</button></div></div>`;
  document.getElementById('lifeDeathContent').innerHTML = h;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('lifeDeathPage').classList.add('active');
}

function showApiModal() {
  const cfg = LifeGame.getApiConfig();
  let h = `<div class="lm-content">
    <h3>⚙️ AI API 设置</h3>
    <p style="color:var(--dim);font-size:.85em">不配置则使用内置随机事件系统</p>
    <label>预设</label><select id="lmPreset" onchange="lmPresetChange()">
      ${LifeGame.API_PRESETS.map((p,i)=>`<option value="${i}" ${cfg.presetIdx===i?'selected':''}>${p.name}</option>`).join('')}
    </select>
    <label>API地址</label><input id="lmUrl" value="${cfg.url||''}" placeholder="https://...">
    <label>模型</label><input id="lmModel" value="${cfg.model||''}" placeholder="model-name">
    <label>API Key</label><input id="lmKey" type="password" value="${cfg.apiKey||''}" placeholder="sk-...">
    <div id="lmTestResult" style="margin-top:8px;font-size:.85em;min-height:20px"></div>
    <div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap">
      <button class="ls-go" onclick="lmSaveAndTest()" style="flex:2">💾 保存并测试</button>
      <button class="ls-back" onclick="document.getElementById('apiModal').style.display='none'" style="flex:1">关闭</button>
    </div></div>`;
  document.getElementById('apiModal').innerHTML = h;
  document.getElementById('apiModal').style.display = 'flex';
}
function lmPresetChange() {
  const p = LifeGame.API_PRESETS[parseInt(document.getElementById('lmPreset').value)];
  document.getElementById('lmUrl').value = p.url;
  document.getElementById('lmModel').value = p.model;
}
function lmSave() {
  LifeGame.saveApiConfig({
    presetIdx: parseInt(document.getElementById('lmPreset').value),
    url: document.getElementById('lmUrl').value,
    model: document.getElementById('lmModel').value,
    apiKey: document.getElementById('lmKey').value,
  });
}

async function lmSaveAndTest() {
  lmSave();
  const r = document.getElementById('lmTestResult');
  if (!r) return;
  r.innerHTML = '⏳ 正在测试连接...';
  r.style.color = 'var(--dim)';
  try {
    const result = await LifeGame.testAPI();
    if (result.ok) {
      r.innerHTML = '✅ ' + result.msg;
      r.style.color = '#4ecca3';
    } else {
      r.innerHTML = '❌ ' + result.msg;
      r.style.color = '#e85898';
    }
  } catch(e) {
    r.innerHTML = '❌ 测试出错: ' + e.message;
    r.style.color = '#e85898';
  }
}
