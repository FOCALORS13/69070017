(function () {
  "use strict";

  const STORAGE_KEY = "todo_data";

  const input = document.getElementById("todo-input");
  const addBtn = document.getElementById("add-btn");
  const list = document.getElementById("todo-list");

  // Load saved todos from localStorage.
  function loadTodos() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null || raw === undefined) {
        return null;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (err) {
      return null;
    }
  }

  // Save todos to localStorage.
  function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  // Render the todo array into #todo-list.
  function render(todos) {
    list.innerHTML = "";

    todos.forEach(function (text, index) {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.textContent = text;

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.textContent = "Delete";

      deleteBtn.addEventListener("click", function () {
        const updated = todos.filter(function (_, i) {
          return i !== index;
        });
        saveTodos(updated);
        render(updated);
      });

      li.appendChild(span);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });
  }

  // Initialize: use saved data, otherwise seed from existing static HTML items.
  let todos = loadTodos();
  if (!todos) {
    todos = Array.from(list.querySelectorAll("li span"))
      .map(function (span) {
        return span.textContent.trim();
      })
      .filter(function (text) {
        return text !== "";
      });
  }
  saveTodos(todos);
  render(todos);

  // Add a new item when the Add button is clicked.
  addBtn.addEventListener("click", function () {
    const text = input.value.trim();
    if (text === "") {
      return;
    }

    const updated = todos.concat([text]);
    todos = updated;
    saveTodos(updated);
    render(updated);

    input.value = "";
    input.focus();
  });
})();
