function withConfirmation(message, onConfirm) {
  if (window.confirm(message)) {
    onConfirm();
  }
}

function debounce(fun, delay = 300) {
  let timerId;
  return function debounced(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fun(...args);
    }, delay);
  };
}
