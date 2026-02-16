# Tiramola Microsite

Interactive microsite for selecting logo and identity direction (Routes A/B/C) for **Tiramola** nursery (Cyprus, 0-5).

## Run

Open `/Users/nick/tiramola-microsite/index.html` in a browser.

## Includes

- Landing, Quiz (9 questions), Result, Concepts, Compare, Export pages
- Deterministic scoring engine for routes A/B/C
- Tone sliders + dynamic theme generator (palette, typography, UI tokens)
- Tie handling with top matches and compare prompt
- Concept design packs (A/B/C) as structured data
- JSON export and shareable link (`?s=...`) with restored state

## Source of truth

The canonical data model and generators are in:

- `/Users/nick/tiramola-microsite/app.js`

Key objects:

- `baseState`
- `questions`
- `conceptPacks`
- `generateTheme(...)`
- `buildExportPayload()`
