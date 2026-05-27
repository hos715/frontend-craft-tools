# frontend-craft-tools

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/hos715/frontend-craft-tools)](https://github.com/hos715/frontend-craft-tools)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fhos715.github.io%2Ffrontend-craft-tools)](https://hos715.github.io/frontend-craft-tools)

A small collection of lightweight, client-side front-end developer tools — no server required.

Tools included in this initial version:
- JSON Minifier — client-side JSON minification with size comparison
- Lottie Color Switcher — extract and replace colors inside Lottie JSON files

This repository is structured so new tools can be added under `public/tools/`.

## Overview

This project provides a static set of HTML and JavaScript tools that run entirely in the browser.

## Features

- Drag-and-drop JSON file support
- File selection fallback
- Size comparison before and after minification
- Download minified JSON output
- Lottie color replacement tool support
- Fully client-side with no backend required
- Supports Persian, English, Chinese, and Hindi via language selector

## Project structure

- `index.html` — landing page for project tools
- `json-minifier.html` — JSON minifier tool page
- `lottie-color-switcher.html` — Lottie color replacement tool page
- `styles.css` — styling for the pages
- `script.js` — shared language and translation logic for all pages
- `json-minifier.js` — page-specific JavaScript for JSON minifier
- `lottie-color-switcher.js` — page-specific JavaScript for Lottie color switcher
- `README.md` — English documentation
- `README.FA.md` — Persian documentation
- `README.ZH.md` — Chinese documentation
- `README.HI.md` — Hindi documentation
- `LICENSE` — MIT license
- `CONTRIBUTING.md` — contribution guidelines

## Docs

Read project docs in your preferred language:

- [English roadmap](docs/en/ROADMAP.md)
- [English JSON Minifier docs](docs/en/tools/json-minifier.md)
- [English Lottie Color Switcher docs](docs/en/tools/lottie-color-switcher.md)

## Languages

- [فارسی](README.FA.md)
- [中文](README.ZH.md)
- [हिन्दी](README.HI.md)

## GitHub Pages

To host this project on GitHub Pages:

1. Push the repository to GitHub.
2. Enable GitHub Pages in the repository settings.
3. The project will be available at `https://hos715.github.io/frontend-craft-tools/`.

## License

This project is licensed under the MIT License.
