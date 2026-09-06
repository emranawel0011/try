// It wires all the other three .js(dom, api, callback) files.

let todos = [];
let currentFilter = "all";
let searchQuery = "";

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
      todo.text.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  return result;
}

async function loadTodos() {
  showStatus("Loading todos");

  try {
    todos = await getTodos(); // we populated our todos here.
    showStatus("");
    refresh();
  } catch (error) {
    showStatus(
      `${error.message}. Is the backend running? (see server.js)`,
      true,
    );
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  const text = todoInput.value.trim();
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

async function handleToggle(todo) {
  try {
    const updated = await updateTodo(todo.id, { completed: !todo.completed });
    todos = todos.map((t) => (t.id === todo.id ? updated : t));
    refresh();
  } catch (error) {
    showStatus(error.message, true);
  }
}

async function handleSave(todo) {
  try {
    const updated = await updateTodo(todo.id, { saved: !todo.saved });
    todos = todos.map((t) => (t.id === todo.id ? updated : t));
    refresh();
  } catch (error) {
    showStatus(error.message, true);
  }
}

function handleDelete(todo) {
  withConfirmation(`Delete "${todo.text}" ?`, async () => {
    try {
      await deleteTodo(todo.id);
      todos = todos.filter((t) => t.id !== todo.id);
      refresh();
    } catch (error) {
      showStatus(error.message, true);
    }
  });
}

function refresh() {
  renderTodos(getVisibleTodos(), {
    onToggle: handleToggle,
    onSave: handleSave,
    onDelete: handleDelete,
  });
}

function handleFilterClick(event) {
  const button = event.target.closest(".filter-btn");
  if (!button) return;

  currentFilter = button.dataset.filter;
  setActiveFilterButton(currentFilter);
  refresh();
}

function handleSearch(event) {
  searchQuery = event.target.value.trim();
  refresh();
}

form.addEventListener("submit", handleSubmit);
filterDiv.addEventListener("click", handleFilterClick);
searchInput.addEventListener("input", debounce(handleSearch, 300));

loadTodos();
