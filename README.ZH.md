# JSON Minifier

一个简单的浏览器端工具，用于压缩 JSON 文件。

## 概述

此项目提供了一个静态 HTML 页面，允许用户拖放或选择 JSON 文件，然后下载经过压缩的版本，无需服务器。

## 功能

- 支持拖放 JSON 文件
- 点击选择文件作为备用方式
- 显示压缩前后的大小对比
- 下载压缩后的 JSON 输出
- 完全客户端运行，无需后端
- 支持多语言：波斯语、英语、中文和印地语
- 可直接托管在 GitHub Pages 上

## 使用方法

1. 在浏览器中打开 `index.html`。
2. 点击 JSON Minifier 工具链接。
3. 将 `.json` 文件拖到应用中，或点击文件区域进行选择。
4. 文件处理完成后，点击下载按钮。

## 项目结构

- `index.html` — 工具的着陆页
- `json-minifier.html` — JSON 压缩工具页面
- `lottie-color-switcher.html` — Lottie 颜色替换器页面
- `styles.css` — 样式表
- `script.js` — 共享语言和翻译逻辑
- `json-minifier.js` — JSON 压缩工具页面脚本
- `lottie-color-switcher.js` — Lottie 颜色替换器页面脚本
- `README.md` — 英文文档
- `README.FA.md` — 波斯文文档
- `README.ZH.md` — 中文文档
- `README.HI.md` — 印地语文档
- `LICENSE` — MIT 许可证

## GitHub Pages

将仓库推送到 GitHub 后：

1. 在仓库设置中启用 GitHub Pages。
2. 项目将可通过 `https://<username>.github.io/<repo>/` 访问。

## 许可证

本项目采用 MIT 许可证。