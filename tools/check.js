#!/usr/bin/env node
/* 维护自检脚本。改完数据或代码后运行：
 *   node tools/check.js          只检查，有问题会列出来并以非 0 退出
 *   node tools/check.js --fetch  检查，并把缺少的汉字笔顺数据下载到 hzdata/
 * 需要 Node 18 以上（用到内置 fetch）。
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const errors = [];
const err = m => errors.push(m);

// 1. 语法
for (const f of ['app.js', 'data.js']) {
  try { execFileSync(process.execPath, ['--check', path.join(root, f)], { stdio: 'pipe' }); }
  catch (e) { err(f + ' 有语法错误：\n' + String(e.stderr)); }
}

// 2. 读数据
global.window = {};
try { require(path.join(root, 'data.js')); } catch (e) { err('data.js 无法加载：' + e.message); }
const LZ = global.window.LZ || {};
const app = read('app.js');
const html = read('index.html');

// 3. 每日任务表格式
const DRILL = { zh: ['heng', 'shu', 'chang', 'pie', 'na', 'zhe', 'hui', 'lang', 'yuan', 'luo', 'tian', 'lian', 'ge'], en: ['push', 'oval', 'nn', 'uu', 'loop', 'lang'] };
const ALL_DRILLS = DRILL.zh.concat(DRILL.en);
const checkTokens = (where, tokens) => (tokens || '').split(/\s+/).filter(Boolean).forEach(t => {
  if (/^(mi|fang|line|four)\d*$/.test(t) || t === 'ref' || t === 'none' || ALL_DRILLS.includes(t)) return;
  err(where + ' 有不认识的打印标记 "' + t + '"');
});
const isHan = c => /[一-鿿]/.test(c);
for (const track of ['zh', 'en']) {
  const weeks = (LZ.plan || {})[track] || [];
  if (!weeks.length) err('plan.' + track + ' 是空的');
  weeks.forEach((w, wi) => {
    const at = track + ' 第 ' + (wi + 1) + ' 周';
    if (!w.t || !w.warm) err(at + ' 缺少 t 或 warm');
    if (!Array.isArray(w.days) || w.days.length !== 7) err(at + ' 的 days 必须正好 7 条，现在是 ' + (w.days || []).length);
    const wp = (w.wp || '').split('|');
    if (wp.length > 2) err(at + ' 的 wp 最多两段（内容|标记）');
    checkTokens(at + ' 的 wp', wp[1]);
    (w.days || []).forEach((d, di) => {
      const p = d.split('|'), day = at + ' 第 ' + (di + 1) + ' 天';
      if (p.length > 3) err(day + ' 用了超过两个 "|"');
      if (!p[0].trim()) err(day + ' 没有任务文字');
      if (track === 'zh' && p[1] && ![...p[1]].every(isHan)) err(day + ' 的例字段只能是汉字，不能有空格或标点：' + p[1]);
      checkTokens(day, p[2]);
    });
  });
}

// 4. 结构详解格式
const MODES = ['one', 'lr', 'tb', 'enc', 'pin'];
(LZ.structures || []).forEach(g => {
  if (!MODES.includes(g.mode)) err('结构「' + g.name + '」的 mode 不合法：' + g.mode);
  (g.items || []).forEach(it => {
    if (!it.n || !it.rule || !it.ex) err('结构「' + g.name + '」里有条目缺少 n / rule / ex');
    (it.big || []).forEach(b => { if (!Array.isArray(b) || [...b[0]].length !== 1) err('结构「' + g.name + ' / ' + it.n + '」的 big 每项必须是 [单个汉字, 拆分方式]'); });
  });
});

// 5. 版本号一致
const vers = [...html.matchAll(/(?:style\.css|data\.js|app\.js)\?v=(\d+)/g)].map(m => m[1]);
if (vers.length !== 3 || new Set(vers).size !== 1) err('index.html 里 style.css / data.js / app.js 的 ?v= 版本号必须三个都有且相同，现在是 ' + vers.join(', '));

// 6. 不允许重新引入外部资源（笔顺数据的 CDN 回退除外）
for (const f of ['index.html', 'style.css']) {
  if (/fonts\.googleapis|fonts\.gstatic|cdn\.jsdelivr|unpkg\.com/.test(read(f))) err(f + ' 里引用了外部 CDN，字体和库必须用仓库里的本地文件');
}
if ((app.match(/https?:\/\//g) || []).length > 1) err('app.js 里出现了新的外部网址，只允许保留 hzLoader 里那一个 CDN 回退地址');

// 7. 用到的汉字都要有本地笔顺数据
const chars = new Set();
const add = s => { for (const c of s || '') if (isHan(c)) chars.add(c); };
(LZ.structures || []).forEach(g => (g.items || []).forEach(it => { (it.big || []).forEach(b => add(b[0])); add(it.ex); }));
(LZ.tips || []).forEach(g => g[1].forEach(t => add(t[2])));
((LZ.plan || {}).zh || []).forEach(w => { add((w.wp || '').split('|')[0]); (w.days || []).forEach(d => add(d.split('|')[1])); });
const a = app.indexOf('var TRACKS'), b = app.indexOf('function render(track)');
for (const m of app.slice(a, b).matchAll(/'([一-鿿]{1,12})'/g)) add(m[1]);
add((html.match(/id="zh-text"[^>]*value="([^"]*)"/) || [])[1]);
add((html.match(/id="lookup-input"[^>]*value="([^"]*)"/) || [])[1]);
const file = c => path.join(root, 'hzdata', c.codePointAt(0).toString(16) + '.json');
const missing = [...chars].filter(c => !fs.existsSync(file(c)));

(async () => {
  if (missing.length && process.argv.includes('--fetch')) {
    for (const c of missing) {
      try {
        const r = await fetch('https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/' + encodeURIComponent(c) + '.json');
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const d = await r.json();
        if (!d.strokes || !d.strokes.length) throw new Error('数据为空');
        fs.writeFileSync(file(c), JSON.stringify(d));
        console.log('已下载 ' + c);
      } catch (e) { err('「' + c + '」的笔顺数据下载失败（' + e.message + '）。这个字可能不在数据集里，请换一个例字。'); }
    }
  } else if (missing.length) {
    err('这些字缺少本地笔顺数据：' + missing.join('') + '\n  运行 node tools/check.js --fetch 下载');
  }
  if (errors.length) { console.error('发现 ' + errors.length + ' 个问题：\n- ' + errors.join('\n- ')); process.exit(1); }
  console.log('检查通过：' + chars.size + ' 个例字都有本地笔顺数据，任务表和结构数据格式正确。');
})();
