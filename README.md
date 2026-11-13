# 从零练字

一个纯静态网页，教你从零开始一步步把中文和英文写漂亮。

- **中文（硬笔楷书）**：控笔 → 基本笔画 → 偏旁部首 → 间架结构 → 临帖方法 → 篇章应用 → 行楷
- **英文**：热身线条 → 四线格比例 → 小写字族 → 大写 → 单词间距 → 句子一致性 → 提速与风格
- **结构详解与书写口诀**：八类结构各自的比例规律（左窄右宽、上宽下窄、各种包围……）和 19 条通用口诀，配例字
- **逐日任务表**：中文 12 周（84 天）、英文 6 周（42 天），每天 30 分钟。每一天都列出热身、任务、应用三段做什么，并配一张当天的练习纸，可单天或整周打印
- **可打印练习纸**：控笔 13 项、英文线条 6 项，以及每个阶段、每类结构、每周任务对应的字帖，点按钮即可打印或存为 PDF
- **工具**：汉字笔顺动画与跟写、米字格/田字格字帖生成、英文四线格字帖生成（可打印）

页面按栏目分成标签页（入门 / 分步路线 / 每日任务 / 结构详解 / 书写口诀 / 练习工具 / 参考资料），不用一路下滑。

## 使用

直接打开 `index.html`，或在本目录启动一个静态服务器：

```bash
python3 -m http.server 8765
```

笔顺库、英文手写字体和网站用到的 342 个汉字的笔顺数据都放在仓库里，不依赖外部 CDN。只有在“笔顺演示”里输入这 342 个字以外的字时，才会联网去取那个字的数据。

## 第三方资源

- `vendor/hanzi-writer.min.js`：[Hanzi Writer](https://hanziwriter.org/) 3.5.0，MIT 许可。
- `hzdata/`：[hanzi-writer-data](https://github.com/chanind/hanzi-writer-data) 2.0，源自 [Make Me a Hanzi](https://github.com/skishore/makemeahanzi)，字形数据为 Arphic Public License。
- `fonts/edu-sa-beginner.woff2`（Edu SA Beginner）、`fonts/playwrite-us-trad.woff2`（Playwrite US Trad）：均为 SIL Open Font License 1.1。

## 图片来源

- `img/grip.jpg`：[Hånd som skriver](https://commons.wikimedia.org/wiki/File:H%C3%A5nd_som_skriver._-_Fo30141603290075.jpg)，1954 年，作者不详，挪威国家档案馆（Riksarkivet），[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0)。经裁剪，页面上另加编号标注；修改后的图片同样以 CC BY-SA 4.0 提供。
- `img/grip-low.jpg`：[Tookapic](https://commons.wikimedia.org/wiki/File:Pen-writing-notes-studying.jpg)，CC0，经裁剪。
- 坐姿示意图为本站自绘。
