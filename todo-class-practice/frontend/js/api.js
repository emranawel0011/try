const API_URL = "http://localhost:3000/todos";

async function getTodos() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Failed to load todos (status ${response.status})`);
  }
  const data = await response.json();
  return data;
}

async function createTodo(text) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, completed: false }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create todos (status ${response.status})`);
  }
  const data = await response.json();
  return data;
}

async function updateTodo(id, changes) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });

  if (!response.ok) {
    throw new Error(`Failed to create todos (status ${response.status})`);
  }
  const data = await response.json();
  return data;
}

async function deleteTodo(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to create todos (status ${response.status})`);
  }
  const data = await response.json();
  return data;
}
