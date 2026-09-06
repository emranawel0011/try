// ============================================================
// server.js
// A tiny in-memory backend for the todo app, so students can see
// a real request/response cycle instead of a fake/mock API.
// Data resets every time you restart the server (no database).
//
// Run:
//   npm install
//   npm start
// Then open index.html in the browser (e.g. via VS Code Live Server).
// ============================================================

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors()); // allow requests from index.html (different origin)
app.use(express.json()); // parse JSON request bodies into req.body

// ---- "Database": just an array in memory ----
// Lots of seed todos on purpose: with only 2-3 items, filtering,
// searching, and scrolling all look the same — a bigger list makes
// those features actually visible in class.
let todos = [
  { id: 1, text: "Learn the DOM", completed: true, saved: false },
  {
    id: 2,
    text: "Practice fetch + async/await",
    completed: false,
    saved: true,
  },
  {
    id: 3,
    text: "Understand callback functions",
    completed: false,
    saved: false,
  },
  {
    id: 4,
    text: "Style the todo list with CSS",
    completed: true,
    saved: false,
  },
  { id: 5, text: "Build the search input", completed: false, saved: true },
  { id: 6, text: "Add a save/favorite button", completed: false, saved: false },
  { id: 7, text: "Wire up the delete button", completed: true, saved: false },
  {
    id: 8,
    text: "Try the filter buttons (All/Active/Completed/Saved)",
    completed: false,
    saved: false,
  },
  { id: 9, text: "Read dom.md", completed: true, saved: false },
  { id: 10, text: "Read callbacks.md", completed: true, saved: true },
  { id: 11, text: "Read api.md", completed: false, saved: false },
  { id: 12, text: "Read app.md", completed: false, saved: false },
  { id: 13, text: "Debounce the search input", completed: false, saved: false },
  {
    id: 14,
    text: "Explain event delegation to a classmate",
    completed: false,
    saved: false,
  },
  {
    id: 15,
    text: "Explain async/await to a classmate",
    completed: false,
    saved: false,
  },
  {
    id: 16,
    text: "Add a 'Clear completed' button",
    completed: false,
    saved: false,
  },
  {
    id: 17,
    text: "Handle a failed fetch gracefully",
    completed: false,
    saved: false,
  },
  {
    id: 18,
    text: "Push the project to GitHub",
    completed: false,
    saved: false,
  },
];
let nextId = 19;

// Get / route  (http://localhost:3000/)
app.get("/", (req, res) => {
  res.json("Server is running");
});

// GET /todos -> list everything
app.get("/todos", (req, res) => {
  res.json(todos);
});

// POST /todos -> create one, body: { text, completed, saved }
app.post("/todos", (req, res) => {
  const { text, completed = false, saved = false } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "text is required" });
  }

  const todo = { id: nextId++, text, completed, saved };
  todos.push(todo);
  res.status(201).json(todo);
});

// PATCH /todos/:id -> update one, body: any subset of { text, completed, saved }
app.patch("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: "todo not found" });
  }

  Object.assign(todo, req.body);
  res.json(todo);
});

// DELETE /todos/:id -> remove one
app.delete("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = todos.some((t) => t.id === id);

  if (!exists) {
    return res.status(404).json({ error: "todo not found" });
  }

  todos = todos.filter((t) => t.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Todo API running at http://localhost:${PORT}`);
});
