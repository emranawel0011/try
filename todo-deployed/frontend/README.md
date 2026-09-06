# Todo List — Teaching Project

A small todo list app split into separate files so each topic can be
taught (and read) on its own: **DOM**, **fetch/async-await**, and
**callback functions**. A tiny Express backend is included so fetch calls
hit a real server instead of a mock.

## Folder structure

```
frontend/
├── html/
│   └── index.html         entry point, loads scripts in teaching order
├── css/
│   └── index.css          styling
└── js/
    ├── callbacks.js / .md  callback functions
    ├── dom.js / .md        DOM manipulation
    ├── api.js / .md        fetch + async/await
    └── app.js / .md        wires everything together

backend/
├── server.js               tiny in-memory Express API
└── package.json
```

Read the `.md` file next to each `.js` file for a full explanation of
that topic, with talking points/exercises for class.

**Suggested teaching order:** `callbacks.md` → `dom.md` → `api.md` →
`app.md`. That's also the order the `<script>` tags load in
`index.html`.

## Running it

**1. Start the backend** (serves the todo data on `localhost:3000`):

```bash
cd backend
npm install
npm run dev    # auto-restarts on save (nodemon) — use this while teaching
# npm start    # plain node, no auto-restart
```

**2. Open the frontend.** `index.html` uses `fetch` to talk to
`localhost:3000`, so it needs to be served over `http://`, not opened as
a `file://` path (browsers block or restrict fetch from `file://` in some
setups). Easiest options:

- VS Code "Live Server" extension → right-click `frontend/html/index.html`
  → "Open with Live Server", or
- `npx serve frontend/html` from the project root, then visit the printed
  URL.

You should see 18 starter todos loaded from the backend — enough to
actually see search, filtering, and scrolling do something. Try adding,
checking off, saving (heart), deleting, filtering, and searching — each
data action is a real HTTP request you can watch in the browser's Network
tab.

## What each feature demonstrates

| Feature                    | Concepts                                       |
|------------------------------|--------------------------------------------------|
| Load todos on page load      | `async/await`, `fetch` GET, DOM rendering         |
| Search box (top)             | `input` event, `debounce` callback, `Array.filter`|
| Add a todo (bottom form)     | form submit event (callback), `fetch` POST        |
| Toggle complete              | checkbox `change` event, `fetch` PATCH            |
| Save / favorite (heart icon) | click event, `fetch` PATCH, conditional class     |
| Delete a todo                | confirmation callback, `fetch` DELETE             |
| Filter (all/active/completed/saved) | event delegation, `Array.filter` callback |
| Error states                  | `try/catch`, `response.ok`, `.status`             |

## Notes

- The backend stores todos **in memory only** — restarting `server.js`
  resets to the 18 starter todos. No database needed for this exercise.
- Each todo has a `saved` boolean (like `completed`) toggled by the heart
  button next to the delete (`✕`) button — that's the "Saved" filter.
- `cors` is enabled on the backend so the frontend (served from a
  different port/origin) is allowed to fetch from it — a good moment to
  explain CORS if it comes up.
