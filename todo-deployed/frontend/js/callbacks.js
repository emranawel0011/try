// ============================================================
// callbacks.js
// Everything on this page about CALLBACK FUNCTIONS.
// A callback is just: "a function you pass into another function,
// so that other function can run it later, at the right moment."
// See callbacks.md for the full explanation with examples.
// ============================================================

/**
 * debounce(fn, delay)
 * -----------------------------------------------------------
 * A classic real-world use of callbacks: we don't want to filter
 * the list on EVERY keystroke, so we wait until the user stops
 * typing for `delay` ms before calling `fn`.
 *
 * `fn` is the callback: debounce doesn't know (or care) what fn
 * does, it just promises to call it later.
 */
function debounce(fn, delay = 300) {
  let timerId;
  return function debounced(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn(...args); // <-- calling the callback
    }, delay);
  };
}

/**
 * withConfirmation(message, onConfirm)
 * -----------------------------------------------------------
 * Another callback pattern: "do this action, but only after
 * something else finishes". Here it's a browser confirm dialog;
 * in app.js we use this before deleting a todo.
 *
 * onConfirm is a callback that only runs if the user clicks OK.
 */
function withConfirmation(message, onConfirm) {
  if (window.confirm(message)) {
    onConfirm(); // <-- calling the callback
  }
}

/**
 * logStep(label, callback)
 * -----------------------------------------------------------
 * The simplest possible callback demo. Pass any function in,
 * this wrapper logs before/after calling it. Useful in class to
 * show that a function is just a value you can pass around.
 *
 * Example:
 *   logStep('add todo', () => console.log('todo added!'));
 */
function logStep(label, callback) {
  console.log(`[start] ${label}`);
  const result = callback(); // <-- calling the callback
  console.log(`[end]   ${label}`);
  return result;
}

// Note: addEventListener itself is ALSO a callback pattern —
// see dom.js and app.js, e.g. form.addEventListener('submit', handleSubmit)
// "handleSubmit" is a callback the browser calls for you, later,
// whenever the user actually submits the form.
