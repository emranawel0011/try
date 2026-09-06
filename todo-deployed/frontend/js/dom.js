// ============================================================
// dom.js
// Everything on this page about the DOM (Document Object Model).
// Reading elements, creating elements, updating the page, and
// wiring up event listeners.
// See dom.md for the full explanation with examples.
// ============================================================

// ---- 1. Grabbing references to elements already in index.html ----
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const searchInput = document.getElementById("search-input");
const list = document.getElementById("todo-list");
const statusEl = document.getElementById("status");
const counterEl = document.getElementById("counter");
const filtersEl = document.getElementById("filters");

/**
 * showStatus(message, isError)
 * -----------------------------------------------------------
 * Writes a message into the status paragraph. This is the
 * simplest form of DOM manipulation: element.textContent = "...".
 */
function showStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}

/**
 * clearInput()
 * -----------------------------------------------------------
 * Resets the text field after a todo is added.
 */
function clearInput() {
  input.value = "";
  input.focus();
}

/**
 * createTodoElement(todo, handlers)
 * -----------------------------------------------------------
 * Builds ONE <li> DOM node for a single todo object, e.g.
 *   { id: 1, text: "Buy milk", completed: false }
 *
 * `handlers` is an object of CALLBACK functions passed in by
 * app.js: { onToggle, onSave, onDelete }. This file doesn't know
 * HOW toggling/saving/deleting works (that involves fetch + API
 * calls) — it just calls the callback when the user clicks
 * something. That separation (DOM code vs. API code) is
 * intentional and worth pointing out to students.
 */
function createTodoElement(todo, handlers) {
  const li = document.createElement("li");
  li.className = "todo-item" + (todo.completed ? " completed" : "");
  li.dataset.id = todo.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-checkbox";
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", () => {
    handlers.onToggle(todo); // <-- callback, defined in app.js
  });

  const span = document.createElement("span");
  span.className = "todo-text";
  span.textContent = todo.text; // textContent, NOT innerHTML: avoids XSS

  const saveBtn = document.createElement("button");
  saveBtn.className = "save-btn" + (todo.saved ? " saved" : "");
  saveBtn.type = "button";
  saveBtn.title = todo.saved ? "Remove from Saved" : "Save this todo";
  saveBtn.textContent = todo.saved ? "♥" : "♡"; // ♥ / ♡
  saveBtn.addEventListener("click", () => {
    handlers.onSave(todo); // <-- callback, defined in app.js
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.type = "button";
  deleteBtn.title = "Delete this todo";
  deleteBtn.textContent = "✕"; // ✕
  deleteBtn.addEventListener("click", () => {
    handlers.onDelete(todo); // <-- callback, defined in app.js
  });

  li.append(checkbox, span, saveBtn, deleteBtn);
  return li;
}

/**
 * renderTodos(todos, handlers)
 * -----------------------------------------------------------
 * Clears the <ul> and rebuilds it from the given array of todos.
 * This "clear + rebuild" approach is the simplest mental model
 * for students; real frameworks (React, Vue) do this efficiently
 * under the hood, but the concept is the same.
 */
function renderTodos(todos, handlers) {
  list.innerHTML = ""; // clear existing children

  if (todos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "todo-item empty-state";
    empty.textContent = "Nothing here — try a different search or filter.";
    list.appendChild(empty);
  } else {
    todos.forEach((todo) => {
      // .forEach itself takes a CALLBACK — the arrow function below
      list.appendChild(createTodoElement(todo, handlers));
    });
  }

  updateCounter(todos);
}

/**
 * updateCounter(todos)
 * -----------------------------------------------------------
 * Small helper: shows "2 of 5 remaining" under the list.
 */
function updateCounter(todos) {
  const remaining = todos.filter((t) => !t.completed).length;
  counterEl.textContent = `${remaining} of ${todos.length} remaining`;
}

/**
 * setActiveFilterButton(filter)
 * -----------------------------------------------------------
 * Toggles the "active" class so the currently selected filter
 * button is visually highlighted.
 */
function setActiveFilterButton(filter) {
  const buttons = filtersEl.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });
}
