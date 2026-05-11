// GalTI App Logic
let currentQ = 0;
let scores = new Array(20).fill(0);
let selectedOpt = -1;
let answers = []; // Store answers for each question: {optIdx, scoreChanges}
let consentGiven = false;
let gameMode = 'deep'; // 'deep' or 'quick'
let sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2, 6);

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function setConsent(val) {
  consentGiven = val;
  const status = document.getElementById('consentStatus');
  const modeSel = document.getElementById('modeSelect');
  if (val) {
    status.textContent = '✓ 已同意数据收集，感谢支持！';
    status.style.color = 'var(--accent)';
  } else {
    status.textContent = '已拒绝数据收集，测试正常进行';
    status.style.color = 'var(--dim)';
  }
  modeSel.style.display = 'flex';
}

// ====== DATA COLLECTION ======
// 双通道数据收集：webhook.site（实时查看）+ jsonbin.io（永久存储）
// webhook.site：即使关闭页面，数据也会保存在服务器上，随时回来查看
var WEBHOOK_URL = 'https://webhook.site/ad9e8514-f6f4-4321-98fd-e2da87929f31';
var JSONBIN_URL = 'https://api.jsonbin.io/v3/b/69ff8844c0954111d8fd854c';

// 永久存储配置说明（jsonbin.io）：
// 1. 打开 https://jsonbin.io ，用邮箱免费注册
// 2. 创建一个 bin，粘贴 [] 作为初始内容
// 3. 复制 bin 的 API URL（类似 https://api.jsonbin.io/v3/b/xxxxx）
// 4. 把 URL 粘贴到上面 JSONBIN_URL 变量中
// 5. 在 jsonbin.io 的 Access Token 页面生成一个 token，粘贴到下面
var JSONBIN_TOKEN = '$2a$10$.4jsL6OZZfgATxF9JwpsYetQIxrJrWLhSxUUpibIVeefuzC2qPlZ.';

function collectAndSend(extraData) {
  if (!consentGiven) return;
  const payload = {
    sid: sessionId,
    ts: new Date().toISOString(),
    answers: answers.map((a, i) => ({q: i, o: a.optIdx})),
    scores: scores.slice(),
    ...extraData
  };
  // Store locally
  const stored = JSON.parse(localStorage.getItem('galti_data') || '[]');
  stored.push(payload);
  localStorage.setItem('galti_data', JSON.stringify(stored));

  // Channel 1: webhook.site（实时查看，关闭页面也能收到数据）
  if (WEBHOOK_URL) {
    try {
      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
        mode: 'no-cors'
      }).catch(function(){});
    } catch(e) {}
  }

  // Channel 2: jsonbin.io（永久存储，可选）
  if (JSONBIN_URL && JSONBIN_TOKEN) {
    try {
      // Append to existing bin
      fetch(JSONBIN_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_TOKEN,
          'X-Bin-Versioned': 'false'
        },
        body: JSON.stringify(stored)
      }).catch(function(){});
    } catch(e) {}
  }
}

function exportData() {
  const stored = JSON.parse(localStorage.getItem('galti_data') || '[]');
  if (stored.length === 0) { alert('暂无收集的数据'); return; }
  const blob = new Blob([JSON.stringify(stored, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'galti_data_' + new Date().toISOString().slice(0,10) + '.json';
  a.click(); URL.revokeObjectURL(url);
}

function clearData() {
  if (confirm('确定删除所有本地收集的数据？')) {
    localStorage.removeItem('galti_data');
    alert('已清除');
  }
}

function submitSurvey(rating) {
  const surveyData = {
    bestMatch: window._results ? window._results.matches[0].name : '',
    similarity: window._results ? window._results.matches[0].similarity : 0,
    rating: rating
  };
  // Highlight selected button
  document.querySelectorAll('.survey-btn').forEach(b => {
    b.style.borderColor = 'var(--border)';
    b.style.background = 'var(--bg)';
  });
  event.target.style.borderColor = 'var(--accent)';
  event.target.style.background = 'rgba(124,92,191,0.2)';
  document.getElementById('surveyThanks').style.display = 'block';
  document.getElementById('surveyOptions').style.pointerEvents = 'none';
  // Collect data with survey
  collectAndSend(surveyData);
}

function startQuiz(mode) {
  gameMode = mode || 'deep';
  currentQ = 0;
  scores = new Array(20).fill(0);
  selectedOpt = -1;
  answers = [];
  showPage('quizPage');
  renderQuestion();
}

function getQuestions() { return gameMode === 'quick' ? QUICK_QUESTIONS : QUESTIONS; }
function getCharacters() { return gameMode === 'quick' ? QUICK_CHARS : CHARACTERS; }

const VOLUME_NAMES = ['第一卷：叙事与审美','第二卷：道德与人性','第三卷：孤独与连接','第四卷：深渊与光明','第五卷：命运与选择'];

function renderQuestion() {
  const qs = getQuestions();
  const q = qs[currentQ];
  const total = qs.length;
  document.getElementById('progressFill').style.width = ((currentQ) / total * 100) + '%';
  if (gameMode === 'quick') {
    document.getElementById('progressText').textContent = `⚡ 轻松测试 · 问题 ${currentQ + 1}/${total}`;
  } else {
    const volIdx = Math.floor(currentQ / 10);
    document.getElementById('progressText').textContent = `${VOLUME_NAMES[volIdx]} · 问题 ${currentQ + 1}/${total}`;
  }
  // Show category tag
  const catEl = document.getElementById('questionCat');
  if (catEl) catEl.textContent = gameMode === 'quick' ? '⚡ 尖锐提问' : (q.cat || '');
  document.getElementById('questionText').textContent = q.q;
  const container = document.getElementById('optionsContainer');
  container.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt.text;
    // If previously answered, highlight the old choice
    if (answers[currentQ] && answers[currentQ].optIdx === i) {
      btn.classList.add('selected');
    }
    btn.onclick = () => selectOption(i);
    container.appendChild(btn);
  });
  // Show/hide back button
  document.getElementById('backBtn').style.display = currentQ > 0 ? 'inline-block' : 'none';
  selectedOpt = answers[currentQ] ? answers[currentQ].optIdx : -1;
  // Animate
  const card = document.getElementById('questionCard');
  card.classList.remove('fade-in');
  void card.offsetWidth;
  card.classList.add('fade-in');
}

function selectOption(idx) {
  const qs = getQuestions();
  // If this question was previously answered, undo old scores first
  if (answers[currentQ]) {
    const oldChanges = answers[currentQ].scoreChanges;
    oldChanges.forEach(([dim, val]) => {
      scores[dim] -= val;
    });
  }

  // Apply new scores
  const opts = qs[currentQ].opts[idx];
  const scoreChanges = opts.s.map(([dim, val]) => [dim, val]);
  scoreChanges.forEach(([dim, val]) => {
    scores[dim] += val;
  });

  // Save answer
  answers[currentQ] = { optIdx: idx, scoreChanges };

  // Highlight selected
  document.querySelectorAll('.option-btn').forEach((b, i) => {
    b.classList.toggle('selected', i === idx);
  });

  // Auto-advance after short delay
  setTimeout(() => {
    currentQ++;
    if (currentQ >= qs.length) {
      showResults();
    } else {
      renderQuestion();
    }
  }, 350);
}

function prevQuestion() {
  if (currentQ <= 0) return;
  currentQ--;
  renderQuestion();
}

function showResults() {
  showPage('loadingPage');
  setTimeout(() => {
    const qs = getQuestions();
    const chars = getCharacters();
    const isQuick = gameMode === 'quick';
    // Adaptive normalization: find per-dimension theoretical range
    const dimMin = new Array(20).fill(0);
    const dimMax = new Array(20).fill(0);
    qs.forEach(q => {
      // Find the most extreme positive and negative contributions for each dimension
      const dimScores = {};
      q.opts.forEach(opt => {
        opt.s.forEach(([d, v]) => {
          if (!dimScores[d]) dimScores[d] = [];
          dimScores[d].push(v);
        });
      });
      for (const d in dimScores) {
        const vals = dimScores[d];
        const maxV = Math.max(...vals);
        const minV = Math.min(...vals);
        dimMax[d] += maxV;
        dimMin[d] += minV;
      }
    });

    // Normalize each dimension to 0-100 based on its theoretical range
    const normalized = scores.map((s, i) => {
      const range = dimMax[i] - dimMin[i];
      if (range === 0) return 50;
      const norm = ((s - dimMin[i]) / range) * 100;
      return Math.max(0, Math.min(100, Math.round(norm)));
    });

    // Deduplicate characters by name
    const seen = new Set();
    const uniqueChars = chars.filter(ch => {
      const key = ch.name.replace(/\s*\(.*?\)\s*/g,'').trim();
      if(seen.has(key)) return false;
      seen.add(key); return true;
    });

    // Quick mode: weighted matching - character's defining traits get higher weight
    if (isQuick) {
      const userVec = normalized;
      const withDist = uniqueChars.map(ch => {
        let totalDist = 0;
        let totalWeight = 0;
        for (let i = 0; i < 20; i++) {
          // Character's defining trait weight: extreme values = high weight, average = low
          // |ch.t[i] - 50| ranges 0-50, normalized to 0-1
          const extremeness = Math.abs(ch.t[i] - 50) / 50;
          // Weight: 0.2 (irrelevant trait near 50) to 3.0 (core defining trait at 0 or 100)
          // Using squared extremeness to make the contrast sharper
          const weight = 0.2 + 2.8 * extremeness * extremeness;
          const diff = userVec[i] - ch.t[i];
          // Weighted squared distance
          totalDist += weight * diff * diff;
          totalWeight += weight;
        }
        // Normalize by total weight so distance is comparable across characters
        return { ...ch, rawDist: totalDist / totalWeight };
      }).sort((a, b) => a.rawDist - b.rawDist);

      // Steep decay: best ~90%, quickly drops
      const bestDist = withDist[0].rawDist;
      const worstDist = withDist[withDist.length - 1].rawDist;
      const range = worstDist - bestDist || 1;
      const matches = withDist.map((ch, rank) => {
        // Combination of rank-based and distance-based decay
        const distRatio = (ch.rawDist - bestDist) / range;
        // rank penalty: 0→0, 1→8, 2→16, ..., 39→78
        const rankPenalty = rank * 2.0;
        // distance penalty: 0→0, worst→30
        const distPenalty = distRatio * 35;
        const similarity = Math.max(3, Math.min(90, Math.round(90 - rankPenalty - distPenalty)));
        return { ...ch, similarity };
      });

      const POW_DISPLAY = 0.7;
      const displayNorm = normalized.map(v => {
        const dev = (v - 50) / 50;
        const newDev = Math.sign(dev) * Math.pow(Math.abs(dev), POW_DISPLAY);
        return Math.max(1, Math.min(99, Math.round(50 + newDev * 50)));
      });

      window._results = { normalized: displayNorm, matches };
      renderResultsQuick(displayNorm, matches);
      showPage('resultPage');
      return;
    }

    // STEP 1: Non-linear power curve to exaggerate character extremes
    // Maps: 30→18, 70→82, 80→92, 90→98, 20→8, 10→3
    // Moderate traits stay moderate, extreme traits become MORE extreme
    const POW = 0.55;
    const transformedChars = uniqueChars.map(ch => ({
      ...ch,
      t: ch.t.map(v => {
        const dev = (v - 50) / 50; // -1 to 1
        const newDev = Math.sign(dev) * Math.pow(Math.abs(dev), POW);
        return Math.max(1, Math.min(99, Math.round(50 + newDev * 50)));
      })
    }));

    // STEP 2: Filter bland characters (after transformation, stricter threshold)
    const MIN_VARIANCE = 1800;
    const distinctiveChars = transformedChars.filter(ch => {
      const variance = ch.t.reduce((s, v) => s + (v - 50) * (v - 50), 0);
      return variance >= MIN_VARIANCE;
    });

    // STEP 3: Weighted matching - character's defining traits get higher weight
    // Combined with cubic distance amplification and direction mismatch penalty
    const userVec = normalized;

    const withDist = distinctiveChars.map(ch => {
      const chVec = ch.t;
      let totalDist = 0;
      let totalWeight = 0;
      let topDimDist = 0;

      for (let i = 0; i < 20; i++) {
        const uVal = userVec[i];
        const cVal = chVec[i];
        const diff = uVal - cVal;
        const uExt = Math.abs(uVal - 50);
        const cExt = Math.abs(cVal - 50);
        const maxExt = Math.max(uExt, cExt);

        // Character-defining trait weight: extreme character values = high weight
        // Squared extremeness makes core traits dominate matching
        const charExtremeness = cExt / 50;
        const charWeight = 0.2 + 2.8 * charExtremeness * charExtremeness;

        // Combined importance: both user and character extremes matter
        const crossImportance = 1 + (maxExt * maxExt) / 500;

        // Final weight = character defining weight × cross importance
        const weight = charWeight * crossImportance;

        // Cubic distance: amplifies small differences between similar characters
        const dist = weight * Math.pow(Math.abs(diff), 3);
        totalDist += dist;
        totalWeight += weight;
        if (dist > topDimDist) topDimDist = dist;

        // Direction mismatch penalty: heavily penalize OPPOSITE personality on defining traits
        if ((uVal > 55 && cVal < 40) || (uVal < 45 && cVal > 60)) {
          totalDist += 400 * charWeight * (1 + maxExt / 25);
        }
      }
      // Normalize by total weight for comparability
      return { ...ch, rawDist: totalDist / totalWeight, topDimDist };
    }).sort((a, b) => a.rawDist - b.rawDist || a.topDimDist - b.topDimDist);

    // STEP 4: Similarity decay with rank + distance combined
    const bestDist = withDist[0].rawDist;
    const worstDist = withDist[withDist.length - 1].rawDist;
    const distRange = worstDist - bestDist || 1;
    const matches = withDist.map((ch, rank) => {
      const distRatio = (ch.rawDist - bestDist) / distRange;
      // Power decay for initial matches
      const relGap = (ch.rawDist - bestDist) / Math.max(bestDist, 1);
      const decay = Math.pow(relGap, 0.35);
      const baseSim = 97 - decay * 60;
      // Rank penalty for differentiation
      const rankPenalty = Math.min(30, rank * 0.8);
      const similarity = Math.max(8, Math.min(97, Math.round(baseSim - rankPenalty)));
      return { ...ch, similarity };
    });

    // Also transform user scores for display (matching the character exaggeration)
    const POW_DISPLAY = 0.7;
    const displayNorm = normalized.map(v => {
      const dev = (v - 50) / 50;
      const newDev = Math.sign(dev) * Math.pow(Math.abs(dev), POW_DISPLAY);
      return Math.max(1, Math.min(99, Math.round(50 + newDev * 50)));
    });

    window._results = { normalized: displayNorm, matches };
    renderResults(displayNorm, matches);
    showPage('resultPage');
  }, 1500);
}

function renderResults(norm, matches) {
  const best = matches[0];
  const story = (typeof CHAR_STORIES !== 'undefined' && CHAR_STORIES[best.name]) || '';
  // Best match
  document.getElementById('bestMatch').innerHTML = `
    <div class="char-avatar">${best.emoji}</div>
    <div class="char-name">${best.name}</div>
    <div class="char-game">来自：${best.game}</div>
    <p style="font-size:2em;color:var(--accent);margin:10px 0">匹配度 ${best.similarity}%</p>
    <p class="char-desc">${best.desc}</p>
    ${story ? `<div style="background:var(--bg);border-radius:10px;padding:15px;margin:15px 0;text-align:left;border-left:3px solid var(--accent)">
      <p style="color:var(--accent);font-size:.9em;margin-bottom:8px">📖 角色故事</p>
      <p style="color:var(--text);line-height:1.8;font-size:.95em">${story}</p>
    </div>` : ''}
    <p style="color:var(--dim);margin-top:15px;font-size:.9em">你的性格与这位角色最为相似！</p>
  `;

  // Set survey char name
  const surveyCharEl = document.getElementById('surveyCharName');
  if (surveyCharEl) surveyCharEl.textContent = best.name;

  // Radar chart
  drawRadar(norm);

  // Dim list
  const dimHtml = DIM_NAMES.map((name, i) => {
    const v = norm[i];
    const hue = (v / 100) * 270;
    return `<div class="dim-item">
      <span class="dim-name">${name}</span>
      <div class="dim-bar-bg"><div class="dim-bar" style="width:${v}%;background:hsl(${hue},70%,60%)"></div></div>
      <span class="dim-val">${v}</span>
    </div>`;
  }).join('');
  document.getElementById('dimList').innerHTML = dimHtml;

  // Summary
  const leftTraits = ['内向','理性','温柔','顺从','冷静','谨慎','乐观','依赖','含蓄','无私','天真','自律','严肃','传统','固执','敏感','浪漫','温和','忠诚','普通'];
  const rightTraits = ['外向','感性','冷酷','叛逆','冲动','大胆','悲观','独立','热情','自私','狡猾','散漫','玩闹','开放','灵活','坚强','务实','强势','善变','中二'];
  
  const topDims = norm.map((v, i) => ({i, v, diff: Math.abs(v - 50)})).sort((a, b) => b.diff - a.diff).slice(0, 5);
  const summaryParts = topDims.map(d => {
    const trait = d.v > 50 ? rightTraits[d.i] : leftTraits[d.i];
    const pct = d.v > 50 ? d.v : 100 - d.v;
    return `<strong>${DIM_NAMES[d.i]}</strong>维度上，你偏向<strong>${trait}</strong>（${pct}%）`;
  });

  const typeDesc = generateTypeDesc(norm, leftTraits, rightTraits);
  
  document.getElementById('summaryCard').innerHTML = `
    <h3>人格总结</h3>
    <p class="summary-text">${typeDesc}</p>
    <h3 style="margin-top:20px">核心特征</h3>
    <div class="summary-text">${summaryParts.join('。<br>')}。</div>
    <h3 style="margin-top:20px">TOP 3 匹配角色</h3>
    <div class="summary-text">
      ${matches.slice(0, 3).map((m, i) => `${i+1}. <strong>${m.name}</strong>（${m.game}）- 匹配度 ${m.similarity}%`).join('<br>')}
    </div>
  `;

  // Top 10
  const topHtml = matches.slice(0, 10).map((m, idx) => {
    const mStory = (typeof CHAR_STORIES !== 'undefined' && CHAR_STORIES[m.name]) || '';
    return `
    <div class="top-char-card" onclick="this.querySelector('.tc-story').style.display=this.querySelector('.tc-story').style.display==='none'?'block':'none'">
      <div class="mini-avatar">${m.emoji}</div>
      <div class="match-pct">${m.similarity}%</div>
      <div class="tc-name">${m.name}</div>
      <div class="tc-game">${m.game}</div>
      ${mStory ? `<div class="tc-story" style="display:none;text-align:left;margin-top:8px;font-size:.8em;color:var(--dim);line-height:1.6;border-top:1px solid var(--border);padding-top:8px">📖 ${mStory}</div>` : ''}
    </div>
  `}).join('');
  document.getElementById('topChars').innerHTML = topHtml;

  // Trigger bar animations
  setTimeout(() => {
    document.querySelectorAll('.dim-bar').forEach(b => { b.style.transition = 'width 1s'; });
  }, 100);
}

function generateTypeDesc(norm, lt, rt) {
  const top3 = norm.map((v, i) => ({i, v, diff: Math.abs(v - 50)})).sort((a, b) => b.diff - a.diff).slice(0, 3);
  const traits = top3.map(d => d.v > 50 ? rt[d.i] : lt[d.i]);
  
  const descs = {
    '内向': '你是一个安静深思的人，在独处中找到力量和灵感',
    '外向': '你是一个热情开朗的人，在与人交往中充满活力',
    '理性': '你善于用逻辑和分析来面对问题，不会轻易被情绪左右',
    '感性': '你拥有丰富的情感世界，能深刻地感受和共情',
    '温柔': '你待人温和体贴，总能给身边人带来温暖',
    '冷酷': '你做事果断直接，不会因情感而犹豫不决',
    '顺从': '你尊重规则和他人，善于配合和融入团队',
    '叛逆': '你不拘于常规，敢于挑战和突破',
    '冷静': '你在任何情况下都能保持镇定和理性',
    '冲动': '你行动力强，相信直觉和第一反应',
    '谨慎': '你做事周密计划，不会贸然行动',
    '大胆': '你勇于尝试和冒险，不怕未知',
    '乐观': '你总是看到事物积极的一面，充满希望',
    '悲观': '你对事物有更深层的忧虑和思考',
    '依赖': '你重视与他人的联系和羁绊',
    '独立': '你能够独自面对一切，享受自由',
    '含蓄': '你不善于表达情感，但内心丰富',
    '热情': '你毫不掩饰自己的情感，热情地对待一切',
    '无私': '你总是把他人的利益放在前面',
    '自私': '你清楚自己想要什么并勇于争取',
    '天真': '你保有纯真和善意，相信世界的美好',
    '狡猾': '你洞察人心，善于策略和谋划',
    '自律': '你严格要求自己，生活有规律',
    '散漫': '你随性自由，不喜欢被束缚',
    '严肃': '你对待事物认真负责，一丝不苟',
    '玩闹': '你喜欢轻松愉快的生活氛围',
    '传统': '你尊重传统价值观和秩序',
    '开放': '你接受新事物，思想前卫',
    '固执': '你坚持自己的信念不轻易改变',
    '灵活': '你善于适应变化，随机应变',
    '敏感': '你的感知力很强，容易受外界影响',
    '坚强': '你有强大的内心，不易被击倒',
    '浪漫': '你追求浪漫和理想，重视精神世界',
    '务实': '你脚踏实地，注重实际结果',
    '温和': '你待人和善，不喜欢冲突',
    '强势': '你有领导力，喜欢掌控局面',
    '忠诚': '你对承诺和羁绊无比珍视',
    '善变': '你灵活多变，不会被过去束缚',
    '普通': '你踏实平和，是一个温暖的存在',
    '中二': '你拥有独特的世界观和丰富的想象力'
  };

  return traits.map(t => descs[t] || '').filter(Boolean).join('。') + '。';
}

function drawRadar(values) {
  const canvas = document.getElementById('radarChart');
  const ctx = canvas.getContext('2d');
  const W = 500, H = 500;
  canvas.width = W; canvas.height = H;
  const cx = W / 2, cy = H / 2, R = 190;
  const n = 20;
  ctx.clearRect(0, 0, W, H);

  // Background rings
  for (let ring = 1; ring <= 4; ring++) {
    const r = R * ring / 4;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(100,100,150,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Axis lines and labels
  const shortNames = ['外向','感性','冷酷','叛逆','冲动','大胆','悲观','独立','热情','自私','狡猾','散漫','玩闹','开放','灵活','坚强','务实','强势','善变','中二'];
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle));
    ctx.strokeStyle = 'rgba(100,100,150,0.2)';
    ctx.stroke();
    // Label
    const lx = cx + (R + 25) * Math.cos(angle);
    const ly = cy + (R + 25) * Math.sin(angle);
    ctx.fillStyle = '#8888aa';
    ctx.font = '11px Microsoft YaHei';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(shortNames[i], lx, ly);
  }

  // Data polygon
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const idx = i % n;
    const angle = (Math.PI * 2 * idx / n) - Math.PI / 2;
    const v = values[idx] / 100;
    const x = cx + R * v * Math.cos(angle);
    const y = cy + R * v * Math.sin(angle);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.fillStyle = 'rgba(124,92,191,0.25)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(124,92,191,0.8)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Data points
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
    const v = values[i] / 100;
    const x = cx + R * v * Math.cos(angle);
    const y = cy + R * v * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#7c5cbf';
    ctx.fill();
  }
}

function showTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  ['matchTab', 'radarTab', 'summaryTab', 'topTab'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
  document.getElementById(tab + 'Tab').style.display = 'block';
  if (tab === 'radar' && window._results) {
    drawRadar(window._results.normalized);
  }
}

function renderResultsQuick(norm, matches) {
  const top2 = matches.slice(0, 2);
  const best = top2[0];
  const second = top2[1];

  // Best match
  document.getElementById('bestMatch').innerHTML = `
    <p style="color:var(--accent2);font-size:.9em;margin-bottom:10px">⚡ 轻松测试结果</p>
    <div class="char-avatar">${best.emoji}</div>
    <div class="char-name">${best.name}</div>
    <div class="char-game">来自：${best.game}</div>
    <p style="font-size:2em;color:var(--accent);margin:10px 0">匹配度 ${best.similarity}%</p>
    <p class="char-desc">${best.desc}</p>
    <div style="background:var(--bg);border-radius:10px;padding:15px;margin:15px 0;border-left:3px solid var(--accent2)">
      <p style="color:var(--accent2);font-size:.9em;margin-bottom:8px">🥈 第二匹配</p>
      <p style="font-size:1.2em;font-weight:bold">${second.emoji} ${second.name}</p>
      <p style="color:var(--dim);font-size:.9em">${second.game} · 匹配度 ${second.similarity}%</p>
      <p style="color:var(--dim);font-size:.85em;margin-top:5px">${second.desc}</p>
    </div>
    <p style="color:var(--dim);margin-top:15px;font-size:.9em">想要更详细的结果？试试 <strong style="color:var(--accent)">深度测试</strong>！</p>
  `;

  // Set survey char name
  const surveyCharEl = document.getElementById('surveyCharName');
  if (surveyCharEl) surveyCharEl.textContent = best.name;

  // Radar chart
  drawRadar(norm);

  // Dim list
  const dimHtml = DIM_NAMES.map((name, i) => {
    const v = norm[i];
    const hue = (v / 100) * 270;
    return `<div class="dim-item">
      <span class="dim-name">${name}</span>
      <div class="dim-bar-bg"><div class="dim-bar" style="width:${v}%;background:hsl(${hue},70%,60%)"></div></div>
      <span class="dim-val">${v}</span>
    </div>`;
  }).join('');
  document.getElementById('dimList').innerHTML = dimHtml;

  // Summary
  const leftTraits = ['内向','理性','温柔','顺从','冷静','谨慎','乐观','依赖','含蓄','无私','天真','自律','严肃','传统','固执','敏感','浪漫','温和','忠诚','普通'];
  const rightTraits = ['外向','感性','冷酷','叛逆','冲动','大胆','悲观','独立','热情','自私','狡猾','散漫','玩闹','开放','灵活','坚强','务实','强势','善变','中二'];
  const topDims = norm.map((v, i) => ({i, v, diff: Math.abs(v - 50)})).sort((a, b) => b.diff - a.diff).slice(0, 5);
  const summaryParts = topDims.map(d => {
    const trait = d.v > 50 ? rightTraits[d.i] : leftTraits[d.i];
    const pct = d.v > 50 ? d.v : 100 - d.v;
    return `<strong>${DIM_NAMES[d.i]}</strong>维度上，你偏向<strong>${trait}</strong>（${pct}%）`;
  });
  const typeDesc = generateTypeDesc(norm, leftTraits, rightTraits);
  document.getElementById('summaryCard').innerHTML = `
    <h3>人格总结</h3>
    <p class="summary-text">${typeDesc}</p>
    <h3 style="margin-top:20px">核心特征</h3>
    <div class="summary-text">${summaryParts.join('。<br>')}。</div>
  `;

  // Top chars (show all for quick mode)
  const topHtml = matches.slice(0, 10).map(m => `
    <div class="top-char-card">
      <div class="mini-avatar">${m.emoji}</div>
      <div class="match-pct">${m.similarity}%</div>
      <div class="tc-name">${m.name}</div>
      <div class="tc-game">${m.game}</div>
    </div>
  `).join('');
  document.getElementById('topChars').innerHTML = topHtml;

  setTimeout(() => {
    document.querySelectorAll('.dim-bar').forEach(b => { b.style.transition = 'width 1s'; });
  }, 100);
}

function restart() {
  showPage('startPage');
}

// Initialize
showPage('startPage');
