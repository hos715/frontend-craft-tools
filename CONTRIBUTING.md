# Contributing

Thanks for considering contributing to [frontend-craft-tools](https://github.com/hos715/frontend-craft-tools)!

All tools run fully client-side in the browser — no build step, no backend.

## Quick start

1. Fork the repository and create a branch.
2. Make your changes locally (open `index.html` in a browser to test).
3. Open a Pull Request with a short description and, when possible, a screenshot or demo.

## Add a new tool

1. Create a folder under `tools/<tool-name>/`.
2. Add `<tool-name>.html` and `<tool-name>.js` (client-side only).
3. Add styles in `styles.css` or a local `<tool-name>.css` file.
4. Document the tool in `docs/<lang>/tools/<tool-name>.md` for each supported language.
5. Add a link on `index.html` and list the tool in `README.md`.

## Good first issues

Looking for an easy entry point? Check [open issues labeled `good first issue`](https://github.com/hos715/frontend-craft-tools/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

Ideas from the [roadmap](docs/en/ROADMAP.md) that are great for first-time contributors:

- CSS minifier
- Image converter (WebP/AVIF helper)
- RegEx tester
- API response formatter
- Improve docs or translations (FA / EN / ZH / HI)
- Fix UI bugs or add accessibility improvements to an existing tool

You can also open an issue to claim a task before starting work.

## Co-authored commits (Pair Extraordinaire)

To credit a co-author on a merged PR, add a trailer to the commit message:

```text
Co-authored-by: Full Name <email@example.com>
```

Multiple co-authors are supported — add one line per person. This works with GitHub Desktop, the CLI, and squash merges when the trailer is preserved.

## Pull request tips

- Keep PRs focused on one tool or one fix.
- Match the existing folder structure and i18n patterns in `script.js`.
- Update docs when behavior or UI changes.
- Screenshots help reviewers merge faster.

## Code of conduct

Be respectful and constructive. Questions are welcome — open a [Discussion](https://github.com/hos715/frontend-craft-tools/discussions) or an issue if you are unsure where to start.
