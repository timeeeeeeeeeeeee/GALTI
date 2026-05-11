// ============================================
// Gal人生重开模拟器 - Game Engine
// ============================================

const LifeGame = (() => {
  // ---- State ----
  let state = {};
  let historyLog = [];
  let isGenerating = false;

  // ---- Preset API configs (free models) ----
  const API_PRESETS = [
    { name: '自定义API', url: '', model: '' },
    { name: 'DeepSeek', url: 'https://api.deepseek.com/v1/chat/completions', model: 'deepseek-chat' },
    { name: '智谱GLM（标准）', url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions', model: 'glm-4-flash' },
    { name: '智谱GLM（Coding）', url: 'https://open.bigmodel.cn/api/coding/paas/v4/chat/completions', model: 'glm-4-flash' },
    { name: '通义千问', url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', model: 'qwen-turbo' },
    { name: 'Moonshot', url: 'https://api.moonshot.cn/v1/chat/completions', model: 'moonshot-v1-8k' },
    { name: '零一万物', url: 'https://api.lingyiwanwu.com/v1/chat/completions', model: 'yi-lightning' },
  ];

  function getApiConfig() {
    const saved = localStorage.getItem('lifeRestart_apiConfig');
    if (saved) return JSON.parse(saved);
    return { presetIdx: 0, url: '', model: '', apiKey: '' };
  }

  function saveApiConfig(cfg) {
    localStorage.setItem('lifeRestart_apiConfig', JSON.stringify(cfg));
  }

  // ---- Name generator ----
  function genName(gender) {
    const sn = LIFE_SURNAMES[Math.floor(Math.random() * LIFE_SURNAMES.length)];
    const names = gender === '男' ? LIFE_MALE_NAMES : LIFE_FEMALE_NAMES;
    const fn = names[Math.floor(Math.random() * names.length)];
    return sn + fn;
  }

  // ---- Calculate death age ----
  function calcDeathAge() {
    const s = state.stats;
    const mod = LIFE_LIFESPAN_MOD;
    let base = 50;
    base += s.健康 * mod.hpBonus;
    base += s.智力 * mod.intBonus;
    base += s.颜值 * mod.looksBonus;
    base += s.财富 * mod.wealthBonus;
    base += s.快乐 * mod.happinessMod;
    // World-specific modifiers
    const world = LIFE_WORLDS[state.world];
    if (world) {
      if (state.world === '末世废土') base -= 15;
      if (state.world === '修仙世界') base += 20;
      if (state.world === '星际时代') base += 10;
      if (state.world === '地狱客栈') base += 30; // demons live long
    }
    base += Math.floor(Math.random() * 30) - 10;
    return Math.max(1, Math.min(120, Math.round(base)));
  }

  // ---- Calculate happiness ----
  function calcHappiness() {
    const world = LIFE_WORLDS[state.world];
    const identity = world?.identities.find(i => i.name === state.identity);
    const bp = state.birthplace;
    let min = 3, max = 8;
    min += (world?.happinessMod || 0);
    max += (world?.happinessMod || 0);
    min += (identity?.happinessMod || 0);
    max += (identity?.happinessMod || 0);
    // Birthplace modifier (simple)
    const bpIdx = world?.birthplaces?.indexOf(bp) || 0;
    const bpMod = bpIdx <= 1 ? 1 : bpIdx >= world.birthplaces.length - 2 ? -1 : 0;
    min += bpMod; max += bpMod;
    min = Math.max(1, Math.min(8, min));
    max = Math.max(min, Math.min(10, max));
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // ---- Initialize game ----
  function init(gender, world, identity, birthplace, stats, extras) {
    const worldData = LIFE_WORLDS[world];
    const idData = worldData?.identities.find(i => i.name === identity);
    // Apply identity bonuses
    if (idData) {
      if (idData.intBonus) stats.智力 = Math.min(10, stats.智力 + idData.intBonus);
      if (idData.hpBonus) stats.健康 = Math.min(10, stats.健康 + idData.hpBonus);
      if (idData.looksBonus) stats.颜值 = Math.min(10, stats.颜值 + idData.looksBonus);
      if (idData.wealthMod > 0) stats.财富 = Math.min(10, stats.财富 + idData.wealthMod);
      if (idData.wealthMod < 0) stats.财富 = Math.max(0, stats.财富 + idData.wealthMod);
    }
    state = {
      gender, world, identity, birthplace, extras: extras || {},
      stats: { ...stats },
      age: 0,
      deathAge: 0, // calculated after stats finalized
      name: genName(gender),
      alive: true,
      causeOfDeath: '',
    };
    state.stats.快乐 = calcHappiness();
    state.deathAge = calcDeathAge();
    historyLog = [{
      age: 0,
      text: `${state.name}出生了！是一个${state.gender}孩。在${world}的${birthplace}，作为${identity}开始了${state.gender === '男' ? '他' : '她'}的人生。`
    }];
    return state;
  }

  // ---- Get age category ----
  function getAgeCategory(age) {
    if (age <= 3) return 'baby';
    if (age <= 11) return 'child';
    if (age <= 17) return 'teen';
    if (age <= 30) return 'young';
    if (age <= 55) return 'mid';
    if (age <= 75) return 'old';
    return 'ancient';
  }

  // ---- Get time skip options ----
  function getTimeSkipOptions(age) {
    const opts = [{ text: '继续', years: 0, desc: '接着当前时刻' }];
    if (age < 5) {
      opts.push({ text: '下一天', years: 0, days: 1 });
      opts.push({ text: '下个月', years: 0, months: 1 });
    } else if (age < 18) {
      opts.push({ text: '下一天', years: 0, days: 1 });
      opts.push({ text: '下个月', years: 0, months: 1 });
      opts.push({ text: '下一年', years: 1 });
    } else {
      opts.push({ text: '下一天', years: 0, days: 1 });
      opts.push({ text: '下个月', years: 0, months: 1 });
      opts.push({ text: '下一年', years: 1 });
      opts.push({ text: '五年后', years: 5 });
      opts.push({ text: '十年后', years: 10 });
    }
    return opts;
  }

  // ---- Build context for AI ----
  function buildContext() {
    const cat = getAgeCategory(state.age);
    const catNames = { baby: '婴幼儿', child: '儿童', teen: '青少年', young: '青年', mid: '中年', old: '老年', ancient: '高龄' };
    const recentHistory = historyLog.slice(-5).map(h => `[${h.age}岁] ${h.text}`).join('\n');
    const world = LIFE_WORLDS[state.world];
    const extrasStr = Object.entries(state.extras).map(([k, v]) => `${k}: ${v}`).join(', ');
    return `你是一个人生模拟器的故事生成AI。请根据以下信息生成下一段人生事件。

【世界设定】${state.world} - ${world?.desc || ''}
【角色】${state.name}，${state.gender}性，当前${state.age}岁（${catNames[cat]}期）
【身份】${state.identity}
【出生地】${state.birthplace}
${extrasStr ? '【特殊属性】' + extrasStr : ''}
【当前属性】健康:${state.stats.健康} 颜值:${state.stats.颜值} 财富:${state.stats.财富} 智力:${state.stats.智力} 快乐:${state.stats.快乐}
【近期经历】
${recentHistory}

请严格按照以下JSON格式返回（不要包含其他文字，不要markdown代码块）：
{
  "narrative": "一段200字左右的叙述文字，描述这段时间发生的事情",
  "event": "当前面临的关键事件或选择（一句话）",
  "options": [
    {"text": "选项1描述", "effects": {"健康":0, "颜值":0, "财富":0, "智力":0, "快乐":0}},
    {"text": "选项2描述", "effects": {"健康":0, "颜值":0, "财富":0, "智力":0, "快乐":0}},
    {"text": "选项3描述", "effects": {"健康":0, "颜值":0, "财富":0, "智力":0, "快乐":0}}
  ],
  "isDeath": false,
  "deathCause": ""
}

注意：
1. 事件要贴合${state.world}的世界观和设定
2. effects中每个属性变化范围-3到+3，0表示无变化
3. 如果角色年龄已经很高或健康很低，可以设置isDeath为true并填写deathCause
4. 偶尔制造意外和转折，让故事有趣
5. 选项要有意义且导向不同结果
6. 不要让属性变化太极端，保持平衡`;
  }

  // ---- AI API call ----
  async function callAI(prompt) {
    const cfg = getApiConfig();
    if (!cfg.apiKey || !cfg.url) {
      throw new Error('请先配置AI API（点击右上角设置按钮）');
    }
    const resp = await fetch(cfg.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: cfg.model || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: '你是一个创意人生模拟器的故事生成器。只返回JSON，不要其他文字。' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.9,
        max_tokens: 800,
      })
    });
    if (!resp.ok) throw new Error(`API错误: ${resp.status} ${resp.statusText}`);
    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content || data.result || '';
    // Clean markdown code blocks if present
    let cleaned = content.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }
    return JSON.parse(cleaned);
  }

  // ---- Fallback: procedural event generation ----
  function generateFallbackEvent() {
    const cat = getAgeCategory(state.age);
    const s = state.stats;
    const g = state.gender;
    const w = state.world;
    const he = g === '男' ? '他' : '她';
    const events = [];

    // Random events based on world and age
    const randomEvents = {
      baby: [
        { text: `你${state.age}岁了，开始${state.age <= 1 ? '学走路' : '学说话'}。${s.智力 > 5 ? '你学得很快，父母很欣慰。' : '你慢慢地在进步。'}`,
          opts: [{text:'活泼好动地探索',fx:{健康:1,快乐:1}},{text:'安静地观察一切',fx:{智力:1}}] },
        { text: `你生了一场${s.健康 > 5 ? '小' : '严重的'}病，家人很担心。`,
          opts: [{text:'坚强地挺了过来',fx:{健康:1}},{text:'哭闹不止',fx:{快乐:-1,健康:-1}}] },
      ],
      child: [
        { text: `你在学校里${s.智力 > 6 ? '成绩优异，老师经常表扬你' : s.智力 > 3 ? '成绩中等，但你交了很多朋友' : '学习有些吃力，但你很努力'}。`,
          opts: [{text:'更加努力学习',fx:{智力:1,快乐:-1}},{text:'和朋友一起玩',fx:{快乐:1,颜值:0}},{text:'培养一个新爱好',fx:{智力:1,快乐:1}}] },
        { text: `你${state.age}岁了。${s.颜值 > 6 ? '你长得很可爱，大家都喜欢你。' : ''}${s.财富 > 6 ? '家里给你买了很多好东西。' : ''}你在${w}的${state.birthplace}度过了平凡的一天。`,
          opts: [{text:'帮助了一个需要帮助的人',fx:{快乐:1}},{text:'遇到了一件有趣的事',fx:{智力:0,快乐:1}},{text:'和家人度过了温馨的时光',fx:{快乐:2}}] },
      ],
      teen: [
        { text: `青春期来了！${s.颜值 > 6 ? '你变得越来越${g === "男" ? "帅" : "漂亮"}，吸引了很多目光。' : '你在慢慢成长。'}${w === '龙族' ? '你的血统开始觉醒...' : ''}${w === '火影忍者' ? '你在忍者学校开始学习忍术。' : ''}`,
          opts: [{text:'积极锻炼身体',fx:{健康:1,颜值:1}},{text:'沉浸在书本中',fx:{智力:2,快乐:-1}},{text:'享受青春时光',fx:{快乐:2}}] },
        { text: `你遇到了一个重要的人生选择。${s.智力 > 5 ? '以你的能力，你有多个选择。' : '前方的路似乎不太明朗。'}`,
          opts: [{text:'勇敢地迎接挑战',fx:{健康:-1,快乐:1,智力:1}},{text:'谨慎地思考后决定',fx:{智力:1}},{text:'听从内心的直觉',fx:{快乐:1}}] },
      ],
      young: [
        { text: `${state.age}岁的你正处于人生的黄金时期。${s.财富 > 6 ? '你事业有成，前途一片光明。' : s.财富 > 3 ? '你在努力打拼自己的未来。' : '虽然困难重重，但你没有放弃。'}`,
          opts: [{text:'全力以赴追求事业',fx:{财富:2,健康:-1,快乐:-1}},{text:'平衡工作与生活',fx:{快乐:1,财富:1}},{text:'追求自己的梦想',fx:{快乐:2,财富:-1}}] },
        { text: `一段感情出现在你的生命中。${s.颜值 > 5 ? '对方被你的魅力所吸引。' : '你们因为共同的语言而走到一起。'}`,
          opts: [{text:'勇敢地投入这段感情',fx:{快乐:2}},{text:'保持距离，先专注自己',fx:{智力:1,快乐:-1}},{text:'顺其自然',fx:{快乐:0}}] },
      ],
      mid: [
        { text: `步入中年，${he}开始回顾自己的人生。${s.财富 > 5 ? '生活还算富足。' : '经济压力不小。'}${s.健康 > 5 ? '身体状况良好。' : '身体开始出现一些问题。'}`,
          opts: [{text:'投资健康，开始锻炼',fx:{健康:2,财富:-1}},{text:'把精力放在家庭上',fx:{快乐:2}},{text:'开启一个新的事业',fx:{财富:1,快乐:1,健康:-1}}] },
        { text: `一个意想不到的机会出现了。这可能是改变人生的转折点。`,
          opts: [{text:'果断抓住机会',fx:{财富:1,快乐:1}},{text:'犹豫不决',fx:{快乐:-1}},{text:'果断放弃，安稳就好',fx:{快乐:0}}] },
      ],
      old: [
        { text: `老年生活${s.快乐 > 5 ? '还算幸福' : '有些孤独'}。${s.财富 > 5 ? '退休金足够生活。' : '生活有些拮据。'}${s.健康 > 5 ? '身体依然硬朗。' : '健康状况令人担忧。'}`,
          opts: [{text:'享受天伦之乐',fx:{快乐:2}},{text:'旅行看看这个世界',fx:{快乐:1,健康:-1,财富:-1}},{text:'写回忆录',fx:{智力:1,快乐:1}}] },
      ],
      ancient: [
        { text: `你已经活得比大多数人都要久了。每一天都是上天的恩赐。`,
          opts: [{text:'平静地度过每一天',fx:{快乐:1}},{text:'给年轻人讲述自己的故事',fx:{快乐:2}}] },
      ]
    };

    const pool = randomEvents[cat] || randomEvents.old;
    const chosen = pool[Math.floor(Math.random() * pool.length)];

    // Random accident chance (5%)
    const isAccident = Math.random() < 0.05 && state.age > 5;

    return {
      narrative: chosen.text,
      event: isAccident ? '一场突如其来的意外发生了！' : chosen.text,
      options: chosen.opts.map(o => ({
        text: o.text,
        effects: { 健康: o.fx.健康 || 0, 颜值: o.fx.颜值 || 0, 财富: o.fx.财富 || 0, 智力: o.fx.智力 || 0, 快乐: o.fx.快乐 || 0 }
      })),
      isDeath: false,
      deathCause: ''
    };
  }

  // ---- Process player choice ----
  function applyChoice(option) {
    if (option.effects) {
      for (const [k, v] of Object.entries(option.effects)) {
        if (state.stats[k] !== undefined) {
          state.stats[k] = Math.max(0, Math.min(10, state.stats[k] + v));
        }
      }
    }
    // Recalculate death age occasionally
    if (Math.random() < 0.2) {
      state.deathAge = calcDeathAge();
    }
  }

  // ---- Advance time ----
  function advanceTime(years, months, days) {
    const oldAge = state.age;
    if (years) state.age += years;
    else if (months) state.age += months / 12;
    else if (days) state.age += days / 365;
    else state.age += 0.001; // continue = same time

    // Age-appropriate stat decay
    if (Math.floor(state.age) > Math.floor(oldAge)) {
      if (state.age > 40) state.stats.健康 = Math.max(0, state.stats.健康 - 0.2);
      if (state.age > 60) {
        state.stats.颜值 = Math.max(0, state.stats.颜值 - 0.1);
        state.stats.健康 = Math.max(0, state.stats.健康 - 0.2);
      }
    }

    // Check death
    if (state.age >= state.deathAge) {
      state.alive = false;
      return true;
    }
    // Random death check for very low health
    if (state.stats.健康 <= 0) {
      state.alive = false;
      return true;
    }
    return false;
  }

  // ---- Generate life summary ----
  function generateSummary() {
    const s = state.stats;
    const age = Math.floor(state.age);
    const cat = getAgeCategory(age);
    const catNames = { baby: '短暂', child: '短暂', teen: '年轻', young: '壮丽', mid: '充实', old: '漫长', ancient: '传奇' };
    const he = state.gender === '男' ? '他' : '她';

    let quality = '';
    const avg = (s.健康 + s.颜值 + s.财富 + s.智力 + s.快乐) / 5;
    if (avg >= 8) quality = '传奇般的';
    else if (avg >= 6) quality = '精彩的';
    else if (avg >= 4) quality = '平凡的';
    else if (avg >= 2) quality = '坎坷的';
    else quality = '悲惨的';

    let causeOfDeath = state.causeOfDeath || '';
    if (!causeOfDeath) {
      if (age >= 90) causeOfDeath = '在睡梦中安详离世';
      else if (age >= 70) causeOfDeath = '因年老体衰而离世';
      else if (s.健康 <= 1) causeOfDeath = '因病去世';
      else causeOfDeath = '意外去世';
    }

    // Future events after death
    const futureEvents = [];
    if (state.world === '龙族') {
      futureEvents.push(`卡塞尔学院的档案室中，${state.name}的名字被登记在了纪念册上。`);
      futureEvents.push(`多年后，曾有${state.gender === '男' ? '他' : '她'}的学弟学妹在执行任务时，想起${state.name}曾说过的话。`);
    } else if (state.world === '火影忍者') {
      futureEvents.push(`${state.name}的名字被刻在了村里的慰灵碑上。`);
      futureEvents.push(`木叶村的忍者们在经过${state.birthplace}时，偶尔会提起${state.name}的故事。`);
    } else if (state.world === 'SCP基金会') {
      futureEvents.push(`关于${state.name}的档案被归档为Level-3机密。`);
      futureEvents.push(`某位研究员在整理旧文件时发现了${state.name}留下的笔记。`);
    } else {
      futureEvents.push(`${state.name}的亲友在${state.birthplace}为${he}举行了一场纪念仪式。`);
      futureEvents.push(`多年以后，人们偶尔会提起${state.name}的故事。`);
      futureEvents.push(`${he}的某些选择影响了很多人的生活。`);
    }

    return {
      name: state.name,
      age: age,
      quality,
      stats: { ...s },
      causeOfDeath,
      historyLength: historyLog.length,
      futureEvents,
      world: state.world,
      identity: state.identity,
      birthplace: state.birthplace,
    };
  }

  // ---- Test API connection ----
  async function testAPI() {
    const cfg = getApiConfig();
    if (!cfg.apiKey || !cfg.url) {
      return { ok: false, msg: '请先填写API地址和API Key' };
    }
    try {
      const t0 = Date.now();
      const resp = await fetch(cfg.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cfg.apiKey}`,
        },
        body: JSON.stringify({
          model: cfg.model || 'gpt-3.5-turbo',
          messages: [
            { role: 'user', content: '请回复"连接成功"四个字。' }
          ],
          temperature: 0,
          max_tokens: 20,
        })
      });
      const elapsed = Date.now() - t0;
      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        return { ok: false, msg: `HTTP ${resp.status}: ${errText.slice(0, 200)}` };
      }
      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content || data.result || JSON.stringify(data).slice(0, 100);
      return { ok: true, msg: `连接成功！(${elapsed}ms) 回复: ${content}` };
    } catch (e) {
      return { ok: false, msg: '连接失败: ' + e.message };
    }
  }

  // ---- Public API ----
  return {
    API_PRESETS,
    getApiConfig, saveApiConfig, testAPI,
    init, genName, calcDeathAge,
    buildContext, callAI,
    generateFallbackEvent,
    applyChoice, advanceTime,
    getTimeSkipOptions, getAgeCategory,
    generateSummary,
    get state() { return state; },
    get historyLog() { return historyLog; },
    set historyLog(v) { historyLog = v; },
    get isGenerating() { return isGenerating; },
    set isGenerating(v) { isGenerating = v; },
  };
})();