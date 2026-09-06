const searchInput = document.getElementById("search-input");
const statusText = document.getElementById("status");
const counter = document.getElementById("counter");
const todoList = document.getElementById("todo-list");

const form = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");

const filterDiv = document.getElementById("filters");

function showStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.classList.toggle("error", isError);
}

function clearInput() {}

function createTodoElement(todo, handlers) {
  const list = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-checkbox";
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", () => {
    handlers.onToggle(todo);
  });

  const text = document.createElement("span");
  text.className = "todo-text";
  text.textContent = todo.text;

  const savedBtn = document.createElement("button");
  savedBtn.className = "save-btn" + (todo.saved ? "saved" : "");
  savedBtn.type = "button";
  savedBtn.textContent = todo.saved ? "❤️" : "🤍";
  savedBtn.title = todo.saved ? "Remove from saved" : "Save this todo";
  savedBtn.addEventListener("click", () => {
    handlers.onSave(todo);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "delete-btn";
  deleteBtn.title = "Delete this todo";
  deleteBtn.textContent = "❌";
  deleteBtn.addEventListener("click", () => {
    handlers.onDelete(todo);
  });

  list.append(checkbox, text, savedBtn, deleteBtn);
  return list;
}

function renderTodos(todos, handlers) {
  todoList.innerHTML = "";

  if (todos.length === 0) {
    const empty = document.createElement("li");
    empty.className = "todo-item empty-state";
    empty.textContent = "Nothing here - Try a different search or filter.";
    todoList.append(empty);
  } else {
    todos.forEach((todo) => {
      todoList.appendChild(createTodoElement(todo, handlers));
    });
  }

  updateCounter(todos);
}

function updateCounter(todos) {
  const remaining = todos.filter((todo) => !todo.completed).length;
  counter.textContent = `${remaining} of ${todos.length} remaining`;
}

function setActiveFilterButton(filter) {
  const buttons = filterDiv.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });
}
