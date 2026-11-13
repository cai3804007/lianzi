(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var isHan = function (ch) { return /[㐀-鿿]/.test(ch); };

  /* ---------- 小部件：汉字按钮、四线格、控笔图 ---------- */
  function chips(str) {
    return '<div class="chips">' + Array.from(str).filter(isHan).map(function (c) {
      return '<button type="button" class="chip" data-hz="' + c + '" aria-label="查看「' + c + '」的笔顺">' + c + '</button>';
    }).join('') + '</div>';
  }

  var EN_FONTS = {
    print: { family: "'Edu SA Beginner', 'Bradley Hand', 'Segoe Print', cursive", xh: 0.5, asc: 0.86, desc: 0.32, size: 54 },
    cursive: { family: "'Playwrite US Trad', 'Snell Roundhand', 'Segoe Script', cursive", xh: 0.36, asc: 0.78, desc: 0.42, size: 46 }
  };
  // 一行四线格：基线位置精确，文字画在基线上
  function fourLine(text, opt) {
    opt = opt || {};
    var f = EN_FONTS[opt.font || 'print'], fs = f.size, base = 70, W = opt.width || 1000;
    var yA = base - f.asc * fs, yX = base - f.xh * fs, yD = base + f.desc * fs;
    return '<svg class="fl" viewBox="0 0 ' + W + ' 100" role="img" aria-label="' + esc(text || '空白四线格') + '">' +
      '<line x1="0" x2="' + W + '" y1="' + yA + '" y2="' + yA + '" stroke="#c9c1b3"/>' +
      '<line x1="0" x2="' + W + '" y1="' + yX + '" y2="' + yX + '" stroke="#c9c1b3" stroke-dasharray="6 5"/>' +
      '<line x1="0" x2="' + W + '" y1="' + base + '" y2="' + base + '" stroke="#b8322a" stroke-width="1.5"/>' +
      '<line x1="0" x2="' + W + '" y1="' + yD + '" y2="' + yD + '" stroke="#c9c1b3"/>' +
      (text ? '<text x="14" y="' + base + '" font-size="' + fs + '" fill="' + (opt.trace ? '#cfc8bc' : '#26221d') +
        '" style="font-family:' + f.family + '" xml:space="preserve">' + esc(text) + '</text>' : '') +
      '</svg>';
  }

  function drill(name, d) {
    return '<figure><svg viewBox="0 0 160 80" aria-hidden="true"><path d="' + d + '" fill="none" stroke="#26221d" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><figcaption>' + name + '</figcaption></figure>';
  }
  function range(n, fn) { var s = ''; for (var i = 0; i < n; i++) s += fn(i); return s; }
  function spiral(cx, cy, turns, r0, dr) {
    var d = '';
    for (var a = 0; a <= turns * 360; a += 12) {
      var r = r0 + dr * a / 360, t = a * Math.PI / 180;
      d += (a ? 'L' : 'M') + (cx + r * Math.cos(t)).toFixed(1) + ' ' + (cy + r * Math.sin(t)).toFixed(1);
    }
    return d;
  }
  var ZH_DRILLS = '<div class="drills">' +
    drill('等距横线', range(7, function (i) { return 'M15 ' + (10 + i * 10) + 'H145'; })) +
    drill('等距竖线', range(14, function (i) { return 'M' + (15 + i * 10) + ' 10V70'; })) +
    drill('斜线（撇、捺方向）', range(7, function (i) { return 'M' + (30 + i * 9) + ' 10L' + (10 + i * 9) + ' 70'; }) + range(7, function (i) { return 'M' + (85 + i * 9) + ' 10L' + (105 + i * 9) + ' 70'; })) +
    drill('折线', range(3, function (r) { return 'M12 ' + (16 + r * 24) + range(11, function (i) { return 'l6.5 ' + (i % 2 ? -14 : 14); }); })) +
    drill('波浪弧线', range(3, function (r) { return 'M12 ' + (20 + r * 22) + range(6, function () { return 'q5.5 -14 11 0t11 0'; }); })) +
    drill('回形线', 'M20 12H140V68H32V24H128V56H44V36H116V46H56') +
    drill('螺旋线', spiral(45, 40, 4, 2, 7) + spiral(115, 40, 4, 2, 7)) +
    drill('圆圈', range(2, function (r) { return range(5, function (i) { var x = 28 + i * 26, y = 24 + r * 32; return 'M' + (x - 11) + ' ' + y + 'a11 11 0 1 0 22 0a11 11 0 1 0 -22 0'; }); })) +
    '</div>';
  var EN_DRILLS = '<div class="drills">' +
    drill('斜线推拉 push-pull', range(22, function (i) { return 'M' + (22 + i * 6) + ' 15L' + (12 + i * 6) + ' 65'; })) +
    drill('连续椭圆 ovals', range(9, function (i) { var x = 30 + i * 12; return 'M' + (x + 8) + ' 16a12 24 14 1 0 1 0'; })) +
    drill('上拱 n 形', range(2, function (r) { return 'M12 ' + (36 + r * 34) + range(9, function () { return 'v-14a7.5 9 0 0 1 15 0v14'; }); })) +
    drill('下兜 u 形', range(2, function (r) { return 'M12 ' + (12 + r * 34) + range(9, function () { return 'v14a7.5 9 0 0 0 15 0v-14'; }); })) +
    drill('连续圈 l 形', range(2, function (r) { return 'M10 ' + (38 + r * 34) + range(8, function () { return 'c12 -4 16 -30 9 -30s-6 26 8 30'; }); })) +
    drill('波浪 waves', range(3, function (r) { return 'M12 ' + (20 + r * 22) + range(6, function () { return 'q5.5 -14 11 0t11 0'; }); })) +
    '</div>';

  function family(rows) {
    return '<div class="family">' + rows.map(function (r) {
      return '<div><b>' + r[0] + '<span>' + r[1] + '</span></b>' + fourLine(r[2], { width: 620 }) + '</div>';
    }).join('') + '</div>';
  }
  var CONTROL_TABLE = '<div class="tablewrap"><table class="ctl"><thead><tr><th>练什么</th><th>怎么练</th><th>每次的量</th><th>合格标准</th></tr></thead><tbody>' +
    LZ.control.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>'; }).join('') + '</tbody></table></div>';
  function list(items) { return '<ul>' + items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>'; }
  var TAP = '<p class="hint">点任意一个字，可以看笔顺动画并跟写。</p>';

  /* ---------- 课程内容 ---------- */
  var TRACKS = {
    zh: [
      { title: '控笔训练', sub: '先让笔听手的话', when: '第 1–2 周',
        goal: '线条能写直、写稳、写得等距。控笔不过关，后面笔画再怎么练都会抖、会歪。',
        how: ['前两周每天 20–30 分钟专门练控笔，按下表的方法和数量来；之后缩成每天 5 分钟的热身，一直保留。', '具体哪天练哪种线，见<a href="#plan">每日任务表</a>第 1–2 周。', '短线靠手指屈伸，长线靠手腕和小臂带动；手掌侧面轻贴桌面作支点。', '匀速、一笔到底，写坏了不描不补，直接写下一条。', '练的是“等距”和“平行”——眼睛盯着上一条线来定下一条的位置。'],
        extra: CONTROL_TABLE + ZH_DRILLS,
        check: ['10 条横线间距肉眼看基本相等', '线条两端干净，中段不抖不弯', '圆能首尾闭合，螺旋圈距均匀'],
        pit: ['画得飞快只求填满一页', '握笔太紧、手腕悬空', '觉得枯燥直接跳过这一步'] },
      { title: '基本笔画', sub: '点横竖撇捺提折钩', when: '第 2–4 周',
        goal: '写准 8 类基本笔画。每个笔画都有“起笔—行笔—收笔”三个动作，以及轻重变化。',
        how: ['每个笔画先单独写一行，再放进例字里写。', '起笔稍顿（轻轻按一下），行笔匀速，收笔要么顿住、要么出锋（由重到轻提笔）。', '横不是水平的：略向右上斜 5°–10°，字才精神；竖必须垂直。', '“永”字包含了大部分基本笔画，适合每天写一遍作为检验。'],
        extra: '<div class="tablewrap"><table><thead><tr><th>笔画</th><th>要领</th><th>例字</th></tr></thead><tbody>' + [
          ['点', '轻落笔，向右下按，稍顿即收。短而饱满，不要拖成短撇。', '主六小心'],
          ['横', '起笔轻顿，向右略上斜行笔，收笔轻顿。长横中段略细。', '一二三十'],
          ['竖', '垂露竖收笔顿住；悬针竖收笔渐提出尖。务必垂直。', '十中下千'],
          ['撇', '起笔顿，向左下由重到轻撇出，出锋要尖、不要甩。', '人八少月'],
          ['捺', '起笔轻，向右下逐渐加重，到捺脚处顿一下再向右平出。', '人大文之'],
          ['提', '起笔顿，向右上由重到轻快速提出。', '地打江冰'],
          ['折', '横到转折处稍顿再向下，折角方而不突，不要写成圆弧。', '口日四五'],
          ['钩', '到钩处先顿笔蓄力，再短促钩出，钩要小而尖。', '小水我心']
        ].map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + chips(r[2]) + '</td></tr>'; }).join('') + '</tbody></table></div>' + TAP,
        check: ['撇、捺、钩的出锋是尖的，没有“鼠尾”或“钉头”', '同一个笔画连写 5 个，长短和角度一致', '横的斜度在整行里保持一致'],
        pit: ['所有笔画一样粗、一个力度', '钩写得又大又长', '笔顺随意——笔顺错了结构很难对'] },
      { title: '偏旁部首', sub: '学会“让”和“变形”', when: '第 4–6 周',
        goal: '掌握最常用的十来个偏旁。汉字大多是合体字，偏旁写对了，一写就是一批字。',
        how: ['左偏旁要写<em>窄</em>，并且末笔变形给右边让位：横变提（土→地）、捺变点（木→林）。', '字头（宀、艹）宜扁宽，像帽子盖住下面；字底（心、灬）要托得住。', '走之底（辶）最后一捺要长而舒展，把上面的部分“托”起来。', '每次只练一个偏旁，配 3–5 个字，写完对比偏旁在不同字里是否一致。'],
        extra: '<div class="tablewrap"><table><tbody>' + [
          ['氵三点水', '江河海清'], ['亻单人旁', '你他们作'], ['扌提手旁', '打把找拉'], ['讠言字旁', '说话语请'],
          ['木 木字旁', '林村校样'], ['口 口字旁', '吃叫听唱'], ['宀 宝盖头', '家安字定'], ['艹 草字头', '花草英药'],
          ['辶 走之底', '这远道进'], ['心 心字底', '思想念意']
        ].map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + chips(r[1]) + '</td></tr>'; }).join('') + '</tbody></table></div>' + TAP,
        check: ['左右结构的字，左右两部分靠得紧而不打架', '同一偏旁在不同字里大小、斜度一致', '三点水的三个点呈弧形排列，不在一条直线上'],
        pit: ['偏旁和独体字写得一样大（“木”和“林”里的木不一样）', '左右两部分离得太远，一个字像两个字'] },
      { title: '间架结构', sub: '字好不好看，七成在结构', when: '第 6–10 周',
        goal: '掌握让字“立得住”的几条规律。这是整个练字过程中最重要、耗时最长的阶段。',
        how: ['<strong>横平竖直</strong>：横略上斜但整体平稳，竖垂直，字才端正。', '<strong>重心平稳</strong>：字的重心落在格子中线上，上下部件中心对齐（如“意”“章”）。', '<strong>中宫收紧</strong>：笔画往字的中心聚拢，中间紧、四周的长笔画舒展开。', '<strong>主笔突出</strong>：每个字只有一个最长最舒展的笔画（如“大”的捺、“中”的竖），其他笔画收着写。', '<strong>布白均匀</strong>：笔画之间的空白大小相等（如“三”“川”“目”）。', '<strong>穿插避让</strong>：左右部件的笔画伸进对方的空当里，而不是各占一半。', '按结构类型分组练：独体字 → 左右 → 上下 → 包围。每一类的具体比例和写法见下方的<a href="#structure">结构详解</a>和<a href="#tips">书写口诀</a>。'],
        extra: '<div class="tablewrap"><table><tbody>' + [
          ['布白均匀', '三川目重'], ['主笔突出', '大中之女'], ['重心对正', '意章京草'], ['左右结构', '明林的和'], ['上下结构', '春思息花'], ['包围结构', '国回同风']
        ].map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + chips(r[1]) + '</td></tr>'; }).join('') + '</tbody></table></div>' + TAP,
        check: ['把字倒过来看依然匀称（倒看能跳出“认字”，只看形状）', '每个字能指出主笔是哪一笔', '字不撑满格子，四周留有余地，约占格子七八成'],
        pit: ['所有笔画一样长，字显得呆板', '字写得太大，顶满格子', '只记“这个字怎么写”，不总结规律——规律才能迁移到没练过的字'] },
      { title: '临帖方法', sub: '读 · 摹 · 临 · 比 · 改 · 背', when: '贯穿全程',
        goal: '学会正确的练习动作。同样练一小时，方法对不对，效果差十倍。',
        how: ['<strong>读</strong>：下笔前看 10 秒。每一笔起点在格子的什么位置？多长？哪笔最长？', '<strong>摹</strong>：在描红上描 1–2 遍，感受笔画走向和比例。', '<strong>临</strong>：看着范字在空格里写。看一笔写一笔 → 看一个部件写一个部件 → 看一眼写整个字。', '<strong>比</strong>：写完立刻和范字对比，圈出<em>最不像的一处</em>。', '<strong>改</strong>：下一遍只改这一处。一个字 5–8 遍，每遍都应比上一遍好一点。', '<strong>背</strong>：盖住范字默写。能默写对，这个字才算真正属于你。'],
        check: ['每个字都能说出“这一遍比上一遍改了什么”', '隔天默写昨天的字，结构基本不走样'],
        pit: ['一个字机械地抄一整行，越写越像自己原来的字', '只描红不临写——描红练的是手，不练眼', '三天换一本字帖、换一种字体'] },
      { title: '篇章与日常应用', sub: '从格子走向横线和白纸', when: '第 10–12 周',
        goal: '让“练字的字”变成“平时的字”，一整页看起来整齐舒服。',
        how: ['逐步去掉辅助：米字格 → 田字格 → 方格 → 横线 → 白纸。', '字距要小于行距；字与字的重心连成一条直线。', '大小有别：笔画多的字略大，笔画少的字略小（“口”“日”要写小）。', '每天抄一小段话（50 字左右），内容用你真正会写的东西：笔记、日记、便签。', '日常写字时刻意放慢一点，用上练过的写法；速度会自己慢慢回来。'],
        check: ['一行字的底部（或中线）大致齐平，不上下起伏', '整页看过去字的大小和疏密均匀'],
        pit: ['练字时一个样，平时一着急全变回去——解决办法就是平时也慢一点写', '字写得太大、挤满行距'] },
      { title: '行楷提速', sub: '楷书稳了再学', when: '第 12 周以后',
        goal: '在不丢结构的前提下写得更快、更流畅。',
        how: ['行楷 = 楷书的结构 + 笔画之间的连带。结构规律完全不变。', '先学常用偏旁的行楷写法（氵、讠、纟、扌、辶 等），它们的简化最固定。', '连带分两种：实连（笔画真的连起来）和意连（笔断意连，有呼应的趋势）。初学以意连为主。', '可以跟一套系统的行楷课程（如参考资料里的吴玉生行楷视频）。'],
        check: ['提速后字的重心和主笔依然清楚', '连笔自然，不是为了连而连'],
        pit: ['楷书还没稳就急着写连笔，结果变成潦草'] }
    ],
    en: [
      { title: '热身线条', sub: 'Warm-up drills', when: '第 1 周',
        goal: '放松手臂，建立稳定的斜度、高度和间距。英文字母几乎全由斜线、椭圆和拱形组成。',
        how: ['握笔放松，让动作从小臂和肩膀发出，而不是只靠手指抠。想象是在“拉”笔而不是“推”笔。', '下面每种线条写两行，注意三件事：<em>斜度一致、高度一致、间距一致</em>。', '把纸向左转 20°–30°（右手），斜线会顺手得多。', '之后每次练习前都花 2–3 分钟做这组热身。'],
        extra: EN_DRILLS,
        check: ['一行斜线互相平行', '椭圆大小相同、首尾闭合', '写完手不酸——酸了说明握得太紧'],
        pit: ['手腕死死压在纸上不动', '画得太快，线条发飘'] },
      { title: '四线格与比例', sub: 'Baseline · x-height · ascender · descender', when: '第 1 周',
        goal: '搞清每个字母在四线格里“住哪一层”。大小不一致是英文难看的头号原因。',
        how: ['<strong>基线</strong>（红线）：所有字母都“坐”在这条线上。', '<strong>x 高度</strong>（虚线）：a c e m n o r s u v w x z 的高度正好到这里。', '<strong>上伸部</strong>：b d f h k l t 向上伸到顶线（t 稍矮一点）。', '<strong>下伸部</strong>：g j p q y 向下伸到底线。', '选定一个斜度（直立，或向右倾 5°–15°）并始终保持。'],
        extra: fourLine('x  a c e  b d h l  g p y  t f', { width: 760 }),
        check: ['小写字母的“身体”都一样高', '所有字母底部都落在基线上，不飘不沉'],
        pit: ['上伸部太短，h 和 n、d 和 a 分不清', '字母忽大忽小'] },
      { title: '小写字母：按字族练', sub: 'Lowercase by letter families', when: '第 2–3 周',
        goal: '小写字母占日常书写的 95%。不要按 a–z 顺序练，按<em>起笔动作相同</em>的字族练，一通百通。',
        how: ['每天一个字族。先把字族的“母形”练顺，再逐个写字母。', '每个字母写一行，对比范字，再把同族字母连起来写（如 adgq adgq）。', '注意起笔位置和方向：圆形字母从“1 点钟”位置逆时针起笔。'],
        extra: family([
          ['直线族', '一竖到底，最简单', 'i l t j u y'],
          ['逆时针圆族', '先写 c，再加笔画', 'c o a d g q e'],
          ['拱形族', '竖下去再原路弹回起拱', 'n m h r b p k'],
          ['斜线族', '斜度和夹角保持一致', 'v w x z'],
          ['特殊形', '单独多练', 's f']
        ]),
        check: ['a d g q 里的圆是同一个形状、同一个大小', 'n m h 的拱一样宽', '字母封口处闭合（a、o、d 不漏口）'],
        pit: ['圆形字母顺时针写', 'r 的肩膀太长，像 v', '按字母表顺序一口气抄 26 个'] },
      { title: '大写字母', sub: 'Capitals', when: '第 3–4 周',
        goal: '大写字母高度统一到顶线，宽度比例协调。',
        how: ['所有大写字母等高，顶到上伸部线，坐在基线上，不下伸。', '同样按形状分组练。', '注意宽窄：M、W 最宽；E、F、L、S 较窄；O、C、G、Q 接近正圆。'],
        extra: family([
          ['横竖组', '', 'E F H I L T'],
          ['斜线组', '', 'A K M N V W X Y Z'],
          ['圆弧组', '', 'C G O Q S'],
          ['竖加弧组', '', 'B D P R J U']
        ]),
        check: ['大写与小写上伸部同高', '大写不比小写粗重太多，放在单词开头不突兀'],
        pit: ['大写字母写得过大过宽', '在单词中间混用大写（如 R、N）'] },
      { title: '单词与字母间距', sub: 'Words & letter spacing', when: '第 4–5 周',
        goal: '把字母组合成疏密均匀的单词。',
        how: ['字母间距的标准：<em>字母之间的空白 ≈ 字母内部的空白</em>（如 n 两条腿之间的宽度）。', '先练由同族字母组成的词：minimum、hill、added、good。', '再练高频词：the and that with have this from。', '如果想写连笔：先练两种基本连接——从基线斜向上连（如 a→n），和从 x 高度横向连（如 o→n、v→e）。不想连笔完全没问题，整洁的印刷体同样漂亮。'],
        extra: fourLine('minimum  hill  good  the  and  with', { width: 760 }),
        check: ['把单词眯眼看，是一条均匀的灰带，没有特别挤或特别空的地方', '同一个词连写三遍，宽度基本相同'],
        pit: ['字母之间距离忽宽忽窄', '圆形字母之间离得太远（如 oo、od）'] },
      { title: '句子与一致性', sub: 'Sentences & consistency', when: '第 5–6 周',
        goal: '整行、整段保持一致。英文书写的美感来自四个“一致”。',
        how: ['词间距：正好放得下一个小写 o。', '每天抄一句全字母句（pangram），覆盖全部 26 个字母。', '写完用四个一致逐项检查：<strong>大小</strong>、<strong>斜度</strong>、<strong>间距</strong>、<strong>基线</strong>。每次只挑最差的一项下次重点改。', '画几条平行斜线垫在纸下，可以帮你保持斜度。'],
        extra: fourLine('The quick brown fox jumps over the lazy dog.', { width: 760 }),
        check: ['在竖笔上画延长线，它们互相平行', '行末的字和行首的字一样大（很多人越写越大或越小）'],
        pit: ['一次想同时改所有问题', '只在四线格上好看，一上横线纸就乱——下一阶段解决'] },
      { title: '提速与个人风格', sub: 'Speed & style', when: '第 6 周以后',
        goal: '脱离四线格，在正常速度下保持字形，并形成自己的风格。',
        how: ['过渡顺序：四线格 → 单横线 → 白纸。', '选定一种范本坚持下去：整洁印刷体（print）、意大利斜体（italic）或连笔圆体（cursive）。italic 兼顾速度与美观，很适合成年人。', '用真实内容练习：日记、读书摘抄、待办清单。', '提速要逐级来：慢速写对 → 中速写对 → 正常速度。一旦字形散了就退回上一级。'],
        check: ['正常速度写的笔记，自己和别人都能轻松读', '和第一天存档的那段话对比，有明显进步'],
        pit: ['追求花哨的装饰线而忽视一致性——整齐就是最大的好看'] }
    ]
  };

  /* ---------- 渲染与进度 ---------- */
  var KEY = 'lianzi-progress', state = {}, current = 'zh';
  try { state = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { state = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* 无存储也能用 */ } }
  var NUM = '一二三四五六七';

  function render(track) {
    $('#panel-' + track).innerHTML = TRACKS[track].map(function (s, i) {
      var id = track + i, done = !!state[id];
      return '<details name="stage-' + track + '" class="stage' + (done ? ' done' : '') + '" id="stage-' + id + '"' + (i === 0 ? ' open' : '') + '>' +
        '<summary><span class="num">' + NUM[i] + '</span><h3>' + s.title + '<small>' + s.sub + '</small></h3><span class="when">' + s.when + '</span></summary>' +
        '<div class="body"><p>' + s.goal + '</p><h4>怎么练</h4>' + list(s.how) + (s.extra || '') + stageBtn(track, i, s) +
        '<div class="cols"><div><h4>过关标准</h4>' + list(s.check) + '</div><div><h4>常见误区</h4>' + list(s.pit) + '</div></div>' +
        '<label class="done-check"><input type="checkbox" data-stage="' + id + '"' + (done ? ' checked' : '') + '> 我已完成这个阶段</label></div></details>';
    }).join('');
  }
  function progress() {
    var n = TRACKS[current].length, d = 0;
    for (var i = 0; i < n; i++) if (state[current + i]) d++;
    $('#progress-fill').style.width = (d / n * 100) + '%';
    $('#progress-text').textContent = '已完成 ' + d + ' / ' + n + ' 个阶段';
  }
  function show(track) {
    current = track;
    ['zh', 'en'].forEach(function (t) {
      $('#tab-' + t).setAttribute('aria-selected', String(t === track));
      $('#panel-' + t).hidden = t !== track;
    });
    progress();
  }
  render('zh'); render('en'); show(state.track === 'en' ? 'en' : 'zh');
  $('#tab-zh').onclick = function () { state.track = 'zh'; save(); show('zh'); };
  $('#tab-en').onclick = function () { state.track = 'en'; save(); show('en'); };
  document.addEventListener('change', function (e) {
    var id = e.target.dataset && e.target.dataset.stage;
    if (!id) return;
    state[id] = e.target.checked; save();
    $('#stage-' + id).classList.toggle('done', e.target.checked);
    progress();
  });

  /* ---------- 结构详解与口诀 ---------- */
  function diag(d) {
    if (!d) return '<span class="diag none"></span>';
    var m = function (v) { return (8 + v * 84).toFixed(1); }, out = '';
    (d.r || []).forEach(function (r, i) {
      out += '<rect x="' + m(r[0]) + '" y="' + m(r[1]) + '" width="' + (r[2] * 84).toFixed(1) + '" height="' + (r[3] * 84).toFixed(1) + '" rx="3" fill="' + (d.l ? '#ecd3ce' : ['#d99a92', '#ecd3ce', '#e3b5ae'][i % 3]) + '"/>';
    });
    if (d.l) out += '<polyline points="' + d.l.map(function (p) { return m(p[0]) + ',' + m(p[1]); }).join(' ') + '" fill="none" stroke="#b8322a" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>';
    return '<svg class="diag" viewBox="0 0 100 100" aria-hidden="true"><rect x="2" y="2" width="96" height="96" fill="none" stroke="#cfc5b4" stroke-dasharray="4 4"/>' + out + '</svg>';
  }
  function subnav(names) { return '<div class="weeks subnav">' + names.map(function (n, i) { return '<button type="button" data-sub="' + i + '" aria-pressed="' + (i === 0) + '">' + n + '</button>'; }).join('') + '</div>'; }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-sub]'); if (!b) return;
    var nav = b.parentNode, panels = nav.parentNode.querySelectorAll(':scope > .subpanel');
    nav.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    panels.forEach(function (p, i) { p.hidden = i !== +b.dataset.sub; });
  });
  $('#structure-list').innerHTML = subnav(LZ.structures.map(function (g) { return g.name; })) + LZ.structures.map(function (g, gi) {
    return '<article class="sgroup subpanel"' + (gi ? ' hidden' : '') + '><h3>' + g.name + '<button type="button" class="btn sm" data-print-box>打印字帖</button></h3><p class="sintro">' + g.intro + '</p>' + g.items.map(function (it) {
      return '<div class="sitem">' + diag(it.d) + '<div><h4>' + it.n + '</h4><p>' + it.rule + '</p>' +
        '<div class="bigs">' + (it.big || []).map(function (b) { return '<button type="button" class="big" data-hz="' + b[0] + '" data-mode="' + (it.m || g.mode) + '" data-split="' + esc(JSON.stringify(b[1])) + '" aria-label="查看「' + b[0] + '」的笔顺"><span class="bigc">' + b[0] + '</span></button>'; }).join('') + '</div>' +
        '<p class="hint more">更多例字</p>' + chips(it.ex) + '</div></div>';
    }).join('') + '</article>';
  }).join('');
  $('#tips-list').innerHTML = subnav(LZ.tips.map(function (g) { return g[0]; })) + LZ.tips.map(function (g, gi) {
    return '<div class="subpanel"' + (gi ? ' hidden' : '') + '><div class="tipgrid">' + g[1].map(function (t) {
      return '<div class="tip"><h4>' + t[0] + '</h4><p>' + t[1] + '</p>' + chips(t[2]) + '</div>';
    }).join('') + '</div></div>';
  }).join('');

  /* 笔顺数据：网站用到的字存在本地 hzdata/，其余的字才去 CDN 取 */
  function hzLoader(ch, onLoad, onError) {
    var get = function (url) { return fetch(url).then(function (r) { if (!r.ok) throw 0; return r.json(); }); };
    get('hzdata/' + ch.codePointAt(0).toString(16) + '.json')
      .catch(function () { return get('https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/' + encodeURIComponent(ch) + '.json'); })
      .then(onLoad, onError);
  }

  /* 大字示例：按部件分色，画出各部件的范围框并标注占比 */
  var PCOL = ['#b8322a', '#26221d', '#1f6f86'];
  var PNAME = { lr: [['左', '右'], ['左', '中', '右']], tb: [['上', '下'], ['上', '中', '下']] };
  function bbox(paths) {
    var b = [1e9, 1e9, -1e9, -1e9];
    paths.forEach(function (p) {
      var n = p.match(/-?\d+(\.\d+)?/g).map(Number);
      for (var i = 0; i + 1 < n.length; i += 2) { b[0] = Math.min(b[0], n[i]); b[2] = Math.max(b[2], n[i]); b[1] = Math.min(b[1], n[i + 1]); b[3] = Math.max(b[3], n[i + 1]); }
    });
    return b;
  }
  function drawBig(btn, data) {
    var split = JSON.parse(btn.dataset.split), mode = btn.dataset.mode, n = data.strokes.length, part = [], i;
    for (i = 0; i < n; i++) part[i] = 1;
    var nparts = 1, boxes = true;
    if (typeof split === 'number') { for (i = 0; i < split; i++) part[i] = 0; nparts = 2; }
    else if (Array.isArray(split)) { for (i = 0; i < n; i++) part[i] = i < split[0] ? 0 : i < split[1] ? 1 : 2; nparts = 3; }
    else if (split && split.f) { split.f.forEach(function (k) { part[k] = 0; }); nparts = 2; }
    else if (split && split.h) { split.h.forEach(function (k) { part[k] = 0; }); boxes = false; }
    else boxes = false;
    var S = 132, t = HanziWriter.getScalingTransform(S, S, 12), g = '', cap = '';
    data.strokes.forEach(function (p, k) { g += '<path d="' + p + '" fill="' + PCOL[part[k]] + '"/>'; });
    if (boxes) {
      var bs = [], total = 0;
      for (var q = 0; q < nparts; q++) {
        var b = bbox(data.strokes.filter(function (_, k) { return part[k] === q; })); bs.push(b);
        g += '<rect x="' + (b[0] - 12) + '" y="' + (b[1] - 12) + '" width="' + (b[2] - b[0] + 24) + '" height="' + (b[3] - b[1] + 24) + '" fill="' + PCOL[q] + '" fill-opacity=".07" stroke="' + PCOL[q] + '" stroke-width="2" stroke-dasharray="6 4" vector-effect="non-scaling-stroke"/>';
      }
      var key = mode === 'tbw' ? 'tb' : mode;
      if (PNAME[key]) {
        var ax = mode === 'lr' || mode === 'tbw' ? 0 : 1, sizes = bs.map(function (b) { return b[ax + 2] - b[ax]; }), mx = Math.max.apply(null, sizes);
        sizes.forEach(function (v) { total += v; });
        cap = PNAME[key][nparts - 2].map(function (nm, q) {
          return '<i style="color:' + PCOL[q] + '">' + nm + ' ' + (mode === 'tbw' ? Math.round(sizes[q] / mx * 100) : Math.round(sizes[q] / total * 100) + '%') + '</i>';
        }).join(mode === 'tbw' ? ' : ' : ' ');
        cap = (mode === 'lr' ? '宽 ' : mode === 'tbw' ? '宽度比 ' : '高 ') + cap;
      } else if (mode === 'enc') cap = '<i style="color:' + PCOL[0] + '">外框</i> <i style="color:' + PCOL[1] + '">里面</i>';
    } else if (split && split.h) cap = '<i style="color:' + PCOL[0] + '">红色为主笔</i>';
    btn.innerHTML = '<svg viewBox="0 0 ' + S + ' ' + S + '" aria-hidden="true"><rect x="1" y="1" width="' + (S - 2) + '" height="' + (S - 2) + '" fill="#fffdf8" stroke="#d9a8a1"/>' +
      '<path d="M' + S / 2 + ' 0V' + S + 'M0 ' + S / 2 + 'H' + S + '" stroke="#ecd3ce" stroke-dasharray="4 4"/>' +
      '<g transform="' + t.transform + '">' + g + '</g></svg><span class="cap">' + (cap || '&nbsp;') + '</span>';
  }
  if (typeof HanziWriter !== 'undefined') {
    document.querySelectorAll('.big').forEach(function (btn) {
      HanziWriter.loadCharacterData(btn.dataset.hz, { charDataLoader: hzLoader }).then(function (d) { drawBig(btn, d); }).catch(function () { /* 保留文字回退 */ });
    });
  }

  /* ---------- 每日任务表 ---------- */
  var pTrack = state.ptrack === 'en' ? 'en' : 'zh', pWeek = { zh: 0, en: 0 };
  ['zh', 'en'].forEach(function (t) { // 默认打开第一个没做完的周
    for (var w = 0; w < LZ.plan[t].length; w++) {
      var all = true; for (var d = 0; d < 7; d++) if (!state['p-' + t + '-' + w + '-' + d]) all = false;
      if (!all) { pWeek[t] = w; break; }
    }
  });
  function weekDone(t, w) { var n = 0; for (var d = 0; d < 7; d++) if (state['p-' + t + '-' + w + '-' + d]) n++; return n; }
  var pDay = {};
  function curDay() {
    var k = pTrack + pWeek[pTrack];
    if (pDay[k] == null) { pDay[k] = 0; for (var d = 0; d < 7; d++) if (!state['p-' + k.replace(/^(zh|en)/, '$1-') + '-' + d]) { pDay[k] = d; break; } }
    return pDay[k];
  }
  function step(name, min, body, cls) { return '<div class="' + (cls || '') + '"><dt>' + name + (min ? '<small>' + min + '</small>' : '') + '</dt><dd>' + body + '</dd></div>'; }
  function printList(d, track) {
    if (d.main.none) return '<p>今天不用打印，准备一张白纸即可。</p>';
    var rows = [['热身', specText(d.warm, track)], ['任务', specText(d.main, track)], ['应用', specText(d.app, track)]].filter(function (r) { return r[1]; });
    return '<ul>' + rows.map(function (r) { return '<li><b>' + r[0] + '</b>' + r[1] + '</li>'; }).join('') + '</ul>';
  }
  function dayCard(track, w, i) {
    var d = dayInfo(track, w, i), id = 'p-' + track + '-' + w + '-' + i;
    var ex = d.main.chars.length ? chips(d.main.chars.join('')) + (d.main.ref ? '<p class="hint">范字是楷书，只作结构参考；行楷的连写法请对照你的行楷字帖。</p>' : '')
      : d.main.lines.length ? '<p class="enl">' + d.main.lines.map(esc).join('<br>') + '</p>' : '';
    return '<div class="day' + (state[id] ? ' done' : '') + '"><div class="dayhead"><h4>第 ' + d.n + ' 天' + (i === 6 ? ' · 复习' : '') + '</h4>' +
      '<label><input type="checkbox" data-day="' + id + '"' + (state[id] ? ' checked' : '') + '> 今天已完成</label></div><dl class="steps">' +
      step('① 热身', '5 分钟', esc(d.wk.warm)) +
      step('② 任务', '20 分钟', '<ul>' + d.task.split('；').map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' + ex) +
      step('③ 应用', '5 分钟', esc(d.appText)) +
      step('今天打印', '', printList(d, track) + (d.main.none ? '' : '<button type="button" class="btn primary sm" data-print-day="' + w + '-' + i + '">打印今天的练习纸 / 存为 PDF</button>'), 'pr') +
      '</dl><div class="daynav"><button type="button" class="btn sm" data-go="-1"' + (d.n === 1 ? ' disabled' : '') + '>← 上一天</button>' +
      '<button type="button" class="btn sm" data-go="1"' + (d.n === LZ.plan[track].length * 7 ? ' disabled' : '') + '>下一天 →</button></div></div>';
  }
  function renderPlan() {
    var weeks = LZ.plan[pTrack], w = pWeek[pTrack], wk = weeks[w], di = curDay();
    ['zh', 'en'].forEach(function (t) { $('#ptab-' + t).setAttribute('aria-selected', String(t === pTrack)); });
    $('#weeks').innerHTML = weeks.map(function (x, i) {
      return '<button type="button" data-week="' + i + '" aria-pressed="' + (i === w) + '" class="' + (weekDone(pTrack, i) === 7 ? 'full' : '') + '">第 ' + (i + 1) + ' 周</button>';
    }).join('');
    var total = weeks.length * 7, fin = 0; weeks.forEach(function (_, i) { fin += weekDone(pTrack, i); });
    $('#plan-fill').style.width = (fin / total * 100) + '%'; $('#plan-text').textContent = '已完成 ' + fin + ' / ' + total + ' 天';
    $('#week-body').innerHTML = '<div class="week"><h3>第 ' + (w + 1) + ' 周 · ' + wk.t + '<button type="button" class="btn sm" data-print-week="' + w + '">打印本周 7 天练习纸</button></h3>' +
      '<div class="weeks daytabs">' + wk.days.map(function (_, i) {
        return '<button type="button" data-dayi="' + i + '" aria-pressed="' + (i === di) + '" class="' + (state['p-' + pTrack + '-' + w + '-' + i] ? 'full' : '') + '">第 ' + (w * 7 + i + 1) + ' 天' + (state['p-' + pTrack + '-' + w + '-' + i] ? ' ✓' : '') + '</button>';
      }).join('') + '</div>' + dayCard(pTrack, w, di) + '</div>';
    $('#plan-all').innerHTML = '<summary>全部 ' + weeks.length * 7 + ' 天一览表（任务 + 要打印的东西）</summary><div class="tablewrap"><table class="ptable"><thead><tr><th>天</th><th>任务</th><th>打印</th></tr></thead><tbody>' +
      weeks.map(function (x, wi) {
        return '<tr class="wkrow"><td colspan="3">第 ' + (wi + 1) + ' 周 · ' + x.t + '　<span>热身：' + esc(x.warm) + '</span></td></tr>' + x.days.map(function (_, i) {
          var d = dayInfo(pTrack, wi, i);
          return '<tr><td>' + d.n + '</td><td>' + esc(d.task) + (d.main.chars.length ? '<b class="kai">　' + d.main.chars.join(' ') + '</b>' : '') + '</td><td>' + (d.main.none ? '不用打印（白纸）' : specText(d.main, pTrack)) + '</td></tr>';
        }).join('');
      }).join('') + '</tbody></table></div>';
  }
  $('#ptab-zh').onclick = function () { pTrack = state.ptrack = 'zh'; save(); renderPlan(); };
  $('#ptab-en').onclick = function () { pTrack = state.ptrack = 'en'; save(); renderPlan(); };
  $('#weeks').addEventListener('click', function (e) {
    var b = e.target.closest('[data-week]'); if (!b) return;
    pWeek[pTrack] = +b.dataset.week; renderPlan();
  });
  $('#week-body').addEventListener('click', function (e) {
    var b = e.target.closest('[data-dayi]');
    if (b) { pDay[pTrack + pWeek[pTrack]] = +b.dataset.dayi; return renderPlan(); }
    b = e.target.closest('[data-go]');
    if (b) {
      var n = pWeek[pTrack] * 7 + curDay() + (+b.dataset.go);
      pWeek[pTrack] = Math.floor(n / 7); pDay[pTrack + pWeek[pTrack]] = n % 7; renderPlan();
      return $('#week-body').scrollIntoView();
    }
    b = e.target.closest('[data-print-day]');
    if (b) { var p = b.dataset.printDay.split('-'); return printArea(daySheet(pTrack, +p[0], +p[1])); }
    b = e.target.closest('[data-print-week]');
    if (b) printArea(range(7, function (i) { return dayInfo(pTrack, +b.dataset.printWeek, i).main.none ? '' : daySheet(pTrack, +b.dataset.printWeek, i); }));
  });
  document.addEventListener('change', function (e) {
    var id = e.target.dataset && e.target.dataset.day; if (!id) return;
    state[id] = e.target.checked; save(); renderPlan();
  });

  /* ---------- 笔顺演示 ---------- */
  var dlg = $('#hz-dialog'), msg = $('#hz-msg'), writer = null, queue = [], qi = 0, runId = 0;
  function load(ch) {
    $('#hz-title').textContent = '笔顺演示：' + ch + (queue.length > 1 ? '（' + (qi + 1) + '/' + queue.length + '）' : '');
    if (typeof HanziWriter === 'undefined') { msg.textContent = '笔顺库加载失败，请检查网络后刷新。'; return; }
    msg.textContent = '正在演示笔顺…';
    if (!writer) {
      writer = HanziWriter.create('hz-svg', ch, {
        charDataLoader: hzLoader,
        width: 280, height: 280, padding: 18, strokeColor: '#26221d', outlineColor: '#e4ddd0', drawingColor: '#b8322a',
        highlightColor: '#b8322a', strokeAnimationSpeed: 1, delayBetweenStrokes: 250, drawingWidth: 14,
        onLoadCharDataError: function () { msg.textContent = '没有找到这个字的笔顺数据。'; }
      });
    } else { writer.setCharacter(ch); }
    play();
  }
  function play() {
    if (!writer) return;
    var run = ++runId;
    msg.textContent = '正在演示笔顺…';
    writer.animateCharacter({ onComplete: function () { if (run === runId) msg.textContent = '看清了吗？点「跟写一遍」自己试试。'; } });
  }
  function openHz(str) {
    queue = Array.from(str).filter(isHan); qi = 0;
    if (!queue.length) return;
    if (!dlg.open) dlg.showModal();
    load(queue[0]);
  }
  $('#hz-play').onclick = play;
  $('#hz-close').onclick = function () { dlg.close(); };
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  $('#hz-quiz').onclick = function () {
    if (!writer) return;
    runId++;
    msg.textContent = '按笔顺在格子里写，写错三次会有提示。';
    writer.quiz({
      onMistake: function (d) { msg.textContent = '这一笔不对，再试一次（已错 ' + d.totalMistakes + ' 次）'; },
      onCorrectStroke: function (d) { msg.textContent = '对了，还剩 ' + d.strokesRemaining + ' 笔'; },
      onComplete: function (d) {
        msg.textContent = d.totalMistakes ? '完成，错了 ' + d.totalMistakes + ' 笔，再来一遍会更好。' : '全对！';
        if (qi < queue.length - 1) setTimeout(function () { if (dlg.open) { qi++; load(queue[qi]); } }, 1200);
      }
    });
  };
  document.addEventListener('click', function (e) {
    var c = e.target.closest && e.target.closest('[data-hz]');
    if (c) openHz(c.dataset.hz);
  });
  $('#lookup').onsubmit = function (e) { e.preventDefault(); openHz($('#lookup-input').value); };

  /* ---------- 字帖生成 ---------- */
  function zhSheet() {
    var grid = $('#zh-grid').value, trace = +$('#zh-trace').value;
    var chars = Array.from($('#zh-text').value).filter(isHan).slice(0, 40);
    $('#zh-sheet').innerHTML = chars.map(function (c) {
      return '<div class="zh-row">' + range(10, function (i) {
        return '<div class="cell ' + grid + (i ? ' trace' : '') + '">' + (i <= trace ? '<span>' + c + '</span>' : '') + '</div>';
      }) + '</div>';
    }).join('') || '<p class="hint">请输入汉字。</p>';
  }
  function wrap(line, max) {
    var out = [], cur = '';
    line.split(/\s+/).forEach(function (w) {
      if (cur && (cur + ' ' + w).length > max) { out.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w;
    });
    if (cur) out.push(cur);
    return out;
  }
  function enSheet() {
    var font = $('#en-font').value, blank = +$('#en-blank').value, max = font === 'cursive' ? 42 : 50;
    var lines = [];
    $('#en-text').value.split('\n').forEach(function (l) { if (l.trim()) lines = lines.concat(wrap(l.trim(), max)); });
    $('#en-sheet').innerHTML = lines.slice(0, 30).map(function (l) {
      return fourLine(l, { font: font, trace: true }) + range(blank, function () { return fourLine('', { font: font }); });
    }).join('') || '<p class="hint">请输入英文。</p>';
  }
  ['zh-text', 'zh-grid', 'zh-trace'].forEach(function (id) { $('#' + id).addEventListener('input', zhSheet); });
  ['en-text', 'en-font', 'en-blank'].forEach(function (id) { $('#' + id).addEventListener('input', enSheet); });
  zhSheet(); enSheet();


  /* ---------- 可打印练习纸 ---------- */
  var CW = 22, CH = 16, GAP = 4, COLS = 7, ROWH = 18, FULL = COLS * CW + (COLS - 1) * GAP; // 单位：毫米
  function waveRows(x, y) { return [5, 12].map(function (r) { return 'M' + (x + 2) + ' ' + (y + r) + range(3, function () { return 'q1.5 -4 3 0t3 0'; }); }).join(''); }
  var PAT = {
    heng: function (x, y) { return range(7, function (i) { return 'M' + (x + 2) + ' ' + (y + 2 + i * 2) + 'h18'; }); },
    shu: function (x, y) { return range(10, function (i) { return 'M' + (x + 2 + i * 2) + ' ' + (y + 2) + 'v12'; }); },
    chang: function (x, y, w) { return range(4, function (i) { return 'M' + (x + 2) + ' ' + (y + 2 + i * 4) + 'h' + (w - 4); }); },
    pie: function (x, y) { return range(8, function (i) { return 'M' + (x + 7 + i * 2) + ' ' + (y + 2) + 'l-6 12'; }); },
    na: function (x, y) { return range(8, function (i) { return 'M' + (x + 1 + i * 2) + ' ' + (y + 2) + 'l6 12'; }); },
    zhe: function (x, y) { return [2, 9].map(function (r) { return 'M' + (x + 2) + ' ' + (y + r) + range(9, function (i) { return 'l2 ' + (i % 2 ? -5 : 5); }); }).join(''); },
    hui: function (x, y) { return 'M' + (x + 2) + ' ' + (y + 2) + 'H' + (x + 20) + 'V' + (y + 14) + 'H' + (x + 4) + 'V' + (y + 4) + 'H' + (x + 18) + 'V' + (y + 12) + 'H' + (x + 6) + 'V' + (y + 6) + 'H' + (x + 16) + 'V' + (y + 10) + 'H' + (x + 8) + 'V' + (y + 8) + 'H' + (x + 14); },
    lang: waveRows,
    yuan: function (x, y) { var d = ''; [4.5, 11.5].forEach(function (cy) { [4.5, 11, 17.5].forEach(function (cx) { d += 'M' + (x + cx - 2.8) + ' ' + (y + cy) + 'a2.8 2.8 0 1 0 5.6 0a2.8 2.8 0 1 0 -5.6 0'; }); }); return d; },
    luo: function (x, y) { return spiral(x + 11, y + 8, 3.5, 0.5, 1.9); },
    tian: function (x, y) { return range(3, function (i) { var p = x + 3 + i * 3; return 'M' + (p - .7) + ' ' + (y + 2) + 'h1.4L' + (p - 1.6) + ' ' + (y + 14) + 'Z'; }) + range(3, function (i) { var p = x + 12 + i * 3; return 'M' + p + ' ' + (y + 2) + 'L' + (p + 2.4) + ' ' + (y + 14) + 'h-1.7Z'; }); },
    lian: function (x, y) { return 'M' + (x + 3) + ' ' + (y + 3) + 'L' + (x + 19) + ' ' + (y + 4) + 'M' + (x + 3) + ' ' + (y + 7.5) + 'L' + (x + 19) + ' ' + (y + 10.5) + 'M' + (x + 4) + ' ' + (y + 13.5) + 'L' + (x + 18) + ' ' + (y + 13); },
    push: function (x, y) { return range(9, function (i) { return 'M' + (x + 5 + i * 1.9) + ' ' + (y + 2) + 'l-3 12'; }); },
    oval: function (x, y) { return range(5, function (i) { return 'M' + (x + 6.5 + i * 3) + ' ' + (y + 2.3) + 'a2.6 5.8 14 1 0 .2 0'; }); },
    nn: function (x, y) { return 'M' + (x + 2) + ' ' + (y + 13) + range(3, function () { return 'v-7a3 3.5 0 0 1 6 0v7'; }); },
    uu: function (x, y) { return 'M' + (x + 2) + ' ' + (y + 3) + range(3, function () { return 'v7a3 3.5 0 0 0 6 0v-7'; }); },
    loop: function (x, y) { return 'M' + (x + 1.5) + ' ' + (y + 13.5) + range(4, function () { return 'c3.5 -1 4.5 -11.5 2.5 -11.5s-1.7 10 2.3 11.5'; }); }
  };
  var LIAN_DOTS = [[3, 3], [19, 4], [3, 7.5], [19, 10.5], [4, 13.5], [18, 13]];
  var DRILL_SETS = {
    zh: { title: '控笔练习纸', items: [
      ['heng', '等距横线', '靠手腕左右平移，匀速。看着上一条线定下一条的位置。'],
      ['shu', '等距竖线', '靠手指屈伸，从上到下。不要转纸。'],
      ['chang', '长线', '手指手腕不动，靠小臂平移，一笔到底。竖长线可以把纸横过来练。'],
      ['pie', '斜线 · 撇向', '右上到左下，角度一致。'],
      ['na', '斜线 · 捺向', '左上到右下，角度一致。'],
      ['zhe', '折线', '转折处停一下再转向，角要尖。'],
      ['hui', '回形线', '由外向内，转角方正，圈距相等。'],
      ['lang', '波浪线', '全程不停顿，转弯圆润，波峰一样高。'],
      ['yuan', '圆圈', '一笔闭合，首尾相接不错位。'],
      ['luo', '螺旋线', '由内向外、由外向内各练，圈距相等。'],
      ['tian', '提按线', '左三条由重到轻（落笔按下，边走边提）；右三条由轻到重。'],
      ['lian', '定点连线', '一笔把两个点连起来，线要直，准确落在第二个点上。'],
      ['ge', '格内定位', '在空格里画：十字中线、三等分横线、对角线。练眼睛对位置的判断。']
    ] },
    en: { title: 'English 线条练习纸', items: [
      ['push', '斜线推拉 push-pull', '斜度一致，互相平行。动作从小臂发出。'],
      ['oval', '连续椭圆 ovals', '逆时针，大小相同，首尾闭合。'],
      ['nn', '上拱 n 形', '竖下去再原路弹回起拱，每个拱一样宽。'],
      ['uu', '下兜 u 形', '底部圆润，竖笔平行。'],
      ['loop', '连续圈 l 形', '圈一样高、一样瘦，交叉点在同一高度。'],
      ['lang', '波浪 waves', '全程不停顿，起伏均匀。']
    ] }
  };
  function drillBlock(it, rows) {
    var key = it[0], body = ''; rows = key === 'ge' ? 2 : (rows || 4); var cols = key === 'chang' ? 1 : COLS, w = key === 'chang' ? FULL : CW;
    if (key === 'ge') {
      var S = 18, n = 9, g = (FULL - n * S) / (n - 1);
      for (var r = 0; r < 2; r++) for (var c = 0; c < n; c++) {
        var gx = c * (S + g), gy = r * (S + 2);
        body += '<rect x="' + gx + '" y="' + gy + '" width="' + S + '" height="' + S + '" fill="none" stroke="#b8322a" stroke-width=".3"/>';
        if (r === 0 && c < 3) body += '<path d="' + ['M' + (gx + 9) + ' ' + gy + 'v18M' + gx + ' ' + (gy + 9) + 'h18', 'M' + gx + ' ' + (gy + 6) + 'h18M' + gx + ' ' + (gy + 12) + 'h18', 'M' + gx + ' ' + gy + 'l18 18M' + (gx + 18) + ' ' + gy + 'l-18 18'][c] + '" fill="none" stroke="#26221d" stroke-width=".35"/>';
      }
      return wrapBlock(it, body, 2 * (S + 2));
    }
    for (var row = 0; row < rows; row++) for (var col = 0; col < cols; col++) {
      var x = col * (CW + GAP), y = row * ROWH, color = row === 0 ? '#26221d' : '#cdc5b8';
      body += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + CH + '" rx="1" fill="none" stroke="#ddd3c2" stroke-width=".25"/>';
      if (key === 'lian') LIAN_DOTS.forEach(function (p) { body += '<circle cx="' + (x + p[0]) + '" cy="' + (y + p[1]) + '" r=".55" fill="#26221d"/>'; });
      if ((row === 0 || (row === 1 && rows > 2)) && !(key === 'lian' && row === 1)) {
        body += key === 'tian' ? '<path d="' + PAT[key](x, y, w) + '" fill="' + color + '"/>'
          : '<path d="' + PAT[key](x, y, w) + '" fill="none" stroke="' + color + '" stroke-width=".4" stroke-linecap="round" stroke-linejoin="round"/>';
      }
    }
    return wrapBlock(it, body, rows * ROWH - 2);
  }
  function wrapBlock(it, body, h) {
    return '<div class="pblock"><h4>' + it[1] + '<span>' + it[2] + '</span></h4><svg viewBox="-0.5 -0.5 ' + (FULL + 1) + ' ' + (h + 1) + '">' + body + '</svg></div>';
  }
  function sheetHead(title, hint) { return '<header class="phead"><h1>' + esc(title) + '</h1><p>' + hint + '</p><span>日期 ________　用时 ____ 分钟</span></header>'; }
  function drillSheet(which) {
    var set = DRILL_SETS[which];
    return pday(which, '', sheetHead(set.title, '每组第一行是示范，第二行照着描，后两行自己写。慢、匀速、等距。') + set.items.map(function (it) { return drillBlock(it); }).join(''));
  }
  function charSheet(title, chars) {
    return pday('zh', chars.join(''), sheetHead(title + ' · 字帖', '每行：范字 → 描 3 遍 → 自己写。先读帖再下笔，每写一遍对比一次。') + chars.map(function (c) {
      return '<div class="zh-row">' + range(10, function (i) { return '<div class="cell mi' + (i ? ' trace' : '') + '">' + (i <= 3 ? '<span>' + c + '</span>' : '') + '</div>'; }) + '</div>';
    }).join(''));
  }
  function lineSheet(title, lines) {
    return pday('en', '', sheetHead(title + ' · Worksheet', '每行先描一遍，再在下面两行空格里自己写。注意大小、斜度、间距、基线四个一致。') + lines.map(function (l) {
      return '<div class="pline">' + fourLine(l, { trace: true }) + fourLine('') + fourLine('') + '</div>';
    }).join(''));
  }
  function pday(track, chars, body) { return '<div class="pday" data-track="' + track + '" data-chars="' + chars + '">' + body + '</div>'; }
  /* 把每张练习纸的最后一页用加练行补满，不浪费纸。按 A4、页边距 10mm 估算分页。 */
  var MM = 96 / 25.4, PAGE_H = (297 - 20 - 6) * MM;
  function sheetEnd(sheet) {
    var top = sheet.getBoundingClientRect().top, shift = 0, end = 0;
    sheet.querySelectorAll('.phead, .pt, .pblock, .zh-row, .pline, .hlines > div').forEach(function (el) {
      var r = el.getBoundingClientRect(), a = r.top - top + shift, b = a + r.height;
      if (r.height < PAGE_H && Math.floor(a / PAGE_H) !== Math.floor((b - 1) / PAGE_H)) { var push = (Math.floor(a / PAGE_H) + 1) * PAGE_H - a; shift += push; b += push; }
      end = Math.max(end, b);
    });
    return end;
  }
  function fillSheet(sheet) {
    var zh = sheet.dataset.track === 'zh', chars = Array.from(sheet.dataset.chars || ''), pages = Math.ceil(sheetEnd(sheet) / PAGE_H), n = 0;
    var box = document.createElement('div'); box.className = 'psec pfill';
    box.innerHTML = '<p class="pt"><b>加练区</b>' + (zh ? (chars.length ? '每行第一格是浅色范字，照着再写一行；' : '') + '把今天最不满意的线条或字重写几行。' : '把今天最不满意的字母或单词再写几行。') + '</p>';
    sheet.appendChild(box);
    for (var i = 0; i < 40; i++) {
      var row = document.createElement('div');
      if (zh) { row.className = 'zh-row'; row.innerHTML = range(10, function (k) { return '<div class="cell mi trace">' + (k === 0 && chars.length ? '<span>' + chars[i % chars.length] + '</span>' : '') + '</div>'; }); }
      else { row.className = 'pline'; row.innerHTML = fourLine(''); }
      box.appendChild(row);
      if (Math.ceil(sheetEnd(sheet) / PAGE_H) > pages) { box.removeChild(row); break; }
      n++;
    }
    if (!n) sheet.removeChild(box);
  }
  function printArea(html) {
    var area = $('#print-area');
    area.innerHTML = html;
    area.style.cssText = 'display:block;position:absolute;left:-9999px;top:0;width:190mm';
    area.querySelectorAll('.pday').forEach(fillSheet);
    area.style.cssText = '';
    document.body.classList.add('print-area');
    var done = function () { document.body.classList.remove('print-area'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    window.print();
  }
  /* 每天的练习纸：热身 + 当天任务 + 应用 */
  var BLANKS = { mi: ['空白米字格', 2], fang: ['空白田字格', 6], line: ['横线纸', 10], four: ['空白四线格', 6] };
  var APP = {
    zh: { c: ['盖住范字，把今天的字各默写 2 遍；对照范字圈出最不像的一个，再写 3 遍。', 'mi2'], d: ['用今天的线条手感，把自己的名字慢写 5 遍：横要平、竖要直、间距要匀。', 'line3'], p: ['圈出今天写得最差的 3 个字，查笔顺、读帖后各重写 3 遍。', 'mi1'] },
    en: { c: ['不看范本，把今天的内容再默写 2 行；对照范本圈出最差的一个字母，单独再写 1 行。', 'four3'], d: ['用今天的线条节奏，慢写自己的英文名 5 遍。', 'four2'], p: ['在今天的抄写里圈出最差的 3 个字母，各单独写 1 行。', 'four3'] }
  };
  function parseSpec(content, tokens, track) {
    var s = { chars: [], lines: [], drills: [], blanks: [], ref: false, none: false };
    content = (content || '').trim();
    if (content) { if (track === 'zh') s.chars = Array.from(content); else s.lines = content.split('/'); }
    (tokens || '').split(/\s+/).forEach(function (t) {
      if (!t) return;
      var m = /^(mi|fang|line|four)(\d*)$/.exec(t);
      if (m) s.blanks.push([m[1], +m[2] || BLANKS[m[1]][1]]);
      else if (t === 'ref') s.ref = true; else if (t === 'none') s.none = true; else s.drills.push(t);
    });
    return s;
  }
  function drillItem(key, track) {
    var f = null;
    [track, track === 'zh' ? 'en' : 'zh'].forEach(function (t) { DRILL_SETS[t].items.forEach(function (it) { if (!f && it[0] === key) f = it; }); });
    return f;
  }
  function dayInfo(track, w, i) {
    var wk = LZ.plan[track][w], p = wk.days[i].split('|'), wp = (wk.wp || '').split('|');
    var main = parseSpec(p[1], p[2], track), a = APP[track][(main.chars.length || main.lines.length) ? 'c' : main.drills.length ? 'd' : 'p'];
    return { n: w * 7 + i + 1, wk: wk, task: p[0], main: main, warm: parseSpec(wp[0], wp[1], track), appText: a[0], app: parseSpec('', main.none ? '' : a[1], track) };
  }
  function specText(s, track) {
    var out = [];
    if (s.drills.length) out.push((track === 'zh' ? '控笔练习：' : '线条练习：') + s.drills.map(function (k) { return drillItem(k, track)[1]; }).join('、'));
    if (s.chars.length) out.push((s.ref ? '米字格（只印范字）：' : '描红字帖：') + '<span class="kai">' + s.chars.join(' ') + '</span>');
    if (s.lines.length) out.push('四线格描红 ' + s.lines.length + ' 行');
    s.blanks.forEach(function (b) { out.push(BLANKS[b[0]][0] + ' ' + b[1] + ' 行'); });
    return out.join(' ＋ ');
  }
  function blankRows(kind, n) {
    if (kind === 'line') return '<div class="hlines">' + range(n, function () { return '<div></div>'; }) + '</div>';
    if (kind === 'four') return range(n, function () { return '<div class="pline">' + fourLine('') + '</div>'; });
    return range(n, function () { return '<div class="zh-row">' + range(10, function () { return '<div class="cell ' + (kind === 'mi' ? 'mi' : 'tian') + '"></div>'; }) + '</div>'; });
  }
  function specHtml(s, track, warm) {
    return s.drills.map(function (k) { return drillBlock(drillItem(k, track), warm ? 2 : s.drills.length > 4 ? 3 : 4); }).join('') +
      s.chars.map(function (c) { return '<div class="zh-row">' + range(10, function (i) { return '<div class="cell mi' + (i ? ' trace' : '') + '">' + (i === 0 || (!s.ref && i <= 3) ? '<span>' + c + '</span>' : '') + '</div>'; }) + '</div>'; }).join('') +
      s.lines.map(function (l) { return '<div class="pline">' + fourLine(l, { trace: true }) + fourLine('') + (warm ? '' : fourLine('')) + '</div>'; }).join('') +
      s.blanks.map(function (b) { return blankRows(b[0], b[1]); }).join('');
  }
  function daySheet(track, w, i) {
    var d = dayInfo(track, w, i);
    var sec = function (t, txt, body) { return '<div class="psec"><p class="pt"><b>' + t + '</b>' + esc(txt) + '</p>' + body + '</div>'; };
    return pday(track, d.main.ref ? '' : d.main.chars.concat(d.warm.chars).join(''), sheetHead((track === 'zh' ? '中文' : 'English') + ' · 第 ' + d.n + ' 天 · ' + d.wk.t, '第 ' + (w + 1) + ' 周第 ' + (i + 1) + ' 天。三段共 30 分钟，写完在右边记下日期和用时。') +
      sec('① 热身 · 5 分钟', d.wk.warm, specHtml(d.warm, track, true)) + sec('② 当天任务 · 20 分钟', d.task, specHtml(d.main, track)) + sec('③ 应用 · 5 分钟', d.appText, specHtml(d.app, track)));
  }
  renderPlan();

  var gm = $('#grip-marks');
  if (gm) gm.innerHTML = [[130, 330, 260, 424], [330, 600, 310, 486], [110, 560, 220, 480], [470, 90, 380, 170], [640, 190, 550, 290], [860, 300, 780, 420]].map(function (p, i) {
    return '<path d="M' + p[0] + ' ' + p[1] + 'L' + p[2] + ' ' + p[3] + '" stroke="#b8322a" stroke-width="3"/><circle cx="' + p[2] + '" cy="' + p[3] + '" r="5" fill="#b8322a"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="26" fill="#b8322a" stroke="#fff" stroke-width="3"/><text x="' + p[0] + '" y="' + (p[1] + 12) + '" fill="#fff">' + (i + 1) + '</text>';
  }).join('');

  /* ---------- 顶部栏目切换 ---------- */
  var PAGES = { home: ['principles', 'prep'], path: ['path'], structure: ['structure'], tips: ['tips'], plan: ['plan'], tools: ['tools'], sources: ['sources'] };
  function showPage() {
    var id = location.hash.slice(1), page = 'home';
    Object.keys(PAGES).forEach(function (k) { if (PAGES[k].indexOf(id) > -1) page = k; });
    document.querySelectorAll('main > section').forEach(function (s) { s.hidden = PAGES[page].indexOf(s.id) < 0; });
    document.body.classList.toggle('inner', page !== 'home');
    document.querySelectorAll('#topnav a').forEach(function (a) { a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + PAGES[page][0] || (page === 'home' && a.getAttribute('href') === '#home'))); });
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', showPage); showPage();

  function stageBtn(track, i, s) {
    if (i === 0) return '<p><button type="button" class="btn sm" data-print-drill="' + track + '">打印' + (track === 'zh' ? '控笔' : '线条') + '练习纸</button></p>';
    var x = s.extra || '';
    return (x.indexOf('data-hz') > -1 || x.indexOf('class="fl"') > -1) ? '<p><button type="button" class="btn sm" data-print-box>打印本阶段字帖</button></p>' : '';
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-print-drill],[data-print-box],[data-print-lines]');
    if (!t) return;
    if (t.dataset.printDrill) return printArea(drillSheet(t.dataset.printDrill));
    var box = t.closest('.stage, .sgroup, #tips, .week'), title = box.querySelector('h3, h2').firstChild.textContent.trim();
    if (t.dataset.printLines) return printArea(lineSheet(title, JSON.parse(t.dataset.printLines)));
    var chars = [], seen = {};
    box.querySelectorAll('[data-hz]').forEach(function (c) { if (!seen[c.dataset.hz]) { seen[c.dataset.hz] = 1; chars.push(c.dataset.hz); } });
    if (chars.length) return printArea(charSheet(title, chars));
    var lines = []; box.querySelectorAll('svg.fl').forEach(function (v) { lines.push(v.getAttribute('aria-label')); });
    printArea(lineSheet(title, lines));
  });
  function drillPreview() { $('#drill-preview').innerHTML = drillSheet($('#drill-set').value); }
  $('#drill-set').addEventListener('input', drillPreview); drillPreview();
  $('#drill-print').onclick = function () { printArea(drillSheet($('#drill-set').value)); };

  function printSheet(which) {
    var tool = $('#' + which + '-sheet').closest('.tool');
    tool.classList.add('printing'); document.body.classList.add('printing');
    var done = function () { tool.classList.remove('printing'); document.body.classList.remove('printing'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    window.print();
  }
  $('#zh-print').onclick = function () { printSheet('zh'); };
  $('#en-print').onclick = function () { printSheet('en'); };
})();
