// ============================================================
// app.js
// The "controller": wires dom.js + api.js + callbacks.js together.
// This is the file students read LAST, once they understand the
// three pieces it's built from.
// See app.md for the full explanation.
// ============================================================

// In-memory copy of whatever the server last told us. We keep this
// so filtering/searching doesn't need a new fetch every time.
let todos = [];
let currentFilter = "all";
let searchQuery = "";

/**
 * getVisibleTodos()
 * -----------------------------------------------------------
 * Applies the current filter AND the current search query to the
 * in-memory todos array. Array.filter() takes a CALLBACK: a
 * function that runs once per item and returns true/false to
 * keep/drop it. Chaining two .filter() calls is a common pattern
 * once you have more than one condition to apply.
 */
function getVisibleTodos() {
  let result = todos;

  if (currentFilter === "active") {
    result = result.filter((todo) => !todo.completed);
  } else if (currentFilter === "completed") {
    result = result.filter((todo) => todo.completed);
  } else if (currentFilter === "saved") {
    result = result.filter((todo) => todo.saved);
  }

  if (searchQuery) {
    result = result.filter((todo) =>
      todo.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return result;
}

/**
 * refresh()
 * -----------------------------------------------------------
 * Re-renders the list from the current in-memory `todos`, using
 * the DOM helper from dom.js. We pass it an object of callbacks
 * so dom.js can tell app.js "the user clicked toggle/save/delete
 * on THIS todo" without dom.js needing to know about fetch at all.
 */
function refresh() {
  renderTodos(getVisibleTodos(), {
    onToggle: handleToggle,
    onSave: handleSave,
    onDelete: handleDelete,
  });
}

/**
 * loadTodos()
 * -----------------------------------------------------------
 * async/await + try/catch: the standard pattern for "fetch some
 * data, show a loading message, handle errors gracefully."
 */
async function loadTodos() {
  showStatus("Loading todos...");
  try {
    todos = await getTodos(); // pauses here until the server responds
    showStatus("");
    refresh();
  } catch (error) {
    showStatus(
      `${error.message}. Is the backend running? (see server.js)`,
      true
    );
  }
}

/**
 * handleSubmit(event)
 * -----------------------------------------------------------
 * Callback passed to form.addEventListener('submit', ...) below.
 * Notice this function is itself `async`, so we can `await`
 * createTodo() inside an event handler.
 */
async function handleSubmit(event) {
  event.preventDefault(); // stop the browser from reloading the page
  const text = input.value.trim();
  if (!text) return;

  try {
    const newTodo = await createTodo(text);
    todos.push(newTodo);
    clearInput();
    refresh();
  } catch (error) {
    showStatus(error.message, true);
  }
}

/**
 * handleToggle(todo)
 * -----------------------------------------------------------
 * Called by dom.js when a checkbox changes. Optimistically flips
 * the state locally, then confirms with the server.
 */
async function handleToggle(todo) {
  try {
    const updated = await updateTodo(todo.id, { completed: !todo.completed });
    todos = todos.map((t) => (t.id === todo.id ? updated : t));
    refresh();
  } catch (error) {
    showStatus(error.message, true);
  }
}

/**
 * handleSave(todo)
 * -----------------------------------------------------------
 * Called by dom.js when the heart/save button is clicked. Same
 * shape as handleToggle — flip one field, PATCH it, re-render.
 */
async function handleSave(todo) {
  try {
    const updated = await updateTodo(todo.id, { saved: !todo.saved });
    todos = todos.map((t) => (t.id === todo.id ? updated : t));
    refresh();
  } catch (error) {
    showStatus(error.message, true);
  }
}

/**
 * handleDelete(todo)
 * -----------------------------------------------------------
 * Uses withConfirmation() from callbacks.js: the actual delete
 * logic is itself passed in as a callback, and only runs if the
 * user confirms.
 */
function handleDelete(todo) {
  withConfirmation(`Delete "${todo.text}"?`, async () => {
    try {
      await deleteTodo(todo.id);
      todos = todos.filter((t) => t.id !== todo.id);
      refresh();
    } catch (error) {
      showStatus(error.message, true);
    }
  });
}

/**
 * handleFilterClick(event)
 * -----------------------------------------------------------
 * Event delegation: ONE listener on the whole filters container
 * instead of one per button. event.target tells us exactly which
 * button was clicked.
 */
function handleFilterClick(event) {
  const button = event.target.closest(".filter-btn");
  if (!button) return;

  currentFilter = button.dataset.filter;
  setActiveFilterButton(currentFilter);
  refresh();
}

/**
 * handleSearch(event)
 * -----------------------------------------------------------
 * Reads the search box and re-renders. This is wired up below
 * through debounce() from callbacks.js, so it only actually runs
 * ~300ms after the user stops typing — not on every keystroke.
 */
function handleSearch(event) {
  searchQuery = event.target.value.trim();
  refresh();
}

// ---- Wire up event listeners (each one is a callback) ----
form.addEventListener("submit", handleSubmit);
filtersEl.addEventListener("click", handleFilterClick);
searchInput.addEventListener("input", debounce(handleSearch, 300));

// ---- Kick things off ----
loadTodos();
