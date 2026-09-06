// ============================================================
// api.js
// Everything on this page about fetch() and async/await.
// This is the ONLY file that talks to the network. app.js calls
// these functions and doesn't need to know about URLs, headers,
// or JSON parsing — that's the point of separating concerns.
// See api.md for the full explanation with examples.
// ============================================================

// Our tiny backend (see server.js) runs on this URL.
const API_URL = "http://localhost:3000/todos";

/**
 * getTodos()
 * -----------------------------------------------------------
 * GET request. `await` pauses this function until the fetch
 * finishes, without blocking the rest of the page (compare this
 * to the old-school .then() version commented below).
 */
async function getTodos() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Failed to load todos (status ${response.status})`);
  }

  const data = await response.json(); // body -> JS array, also async!
  return data;
}

/*
  The same function written with .then() instead of async/await,
  for comparison in class — both do exactly the same thing:

  function getTodos() {
    return fetch(API_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load todos");
        return response.json();
      });
  }
*/

/**
 * createTodo(text)
 * -----------------------------------------------------------
 * POST request: sends a new todo to the server and returns the
 * saved todo (with the id the server assigned).
 */
async function createTodo(text) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, completed: false }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create todo (status ${response.status})`);
  }

  return response.json();
}

/**
 * updateTodo(id, changes)
 * -----------------------------------------------------------
 * PATCH request: sends only the fields that changed, e.g.
 * { completed: true }.
 */
async function updateTodo(id, changes) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });

  if (!response.ok) {
    throw new Error(`Failed to update todo (status ${response.status})`);
  }

  return response.json();
}

/**
 * deleteTodo(id)
 * -----------------------------------------------------------
 * DELETE request. No response body expected on success.
 */
async function deleteTodo(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete todo (status ${response.status})`);
  }
}
