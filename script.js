// Task array — each task has id, description, and completed status
const tasks = [];

let id = 0;
let currentFilter = "all"; // "all", "active", or "done"

// Called when the dropdown changes
function setFilter(value) {
  currentFilter = value;
  displayTasks();
}

function addTask() {
  const taskDescription = document.getElementById("nameInput").value;

  if (taskDescription === "") {
    alert("Please enter a task description!");
  } else {
    const task = {
      id: id++,
      description: taskDescription,
      completed: false,
    };
    tasks.push(task);

    document.getElementById("nameInput").value = ""; // clear input
    displayTasks();
  }
}

function displayTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = ""; // reset list

  // Apply filter
  const filtered = tasks.filter((t) => {
    if (currentFilter === "active") return !t.completed;
    if (currentFilter === "done") return t.completed;
    return true; // "all"
  });

  for (let i = 0; i < filtered.length; i++) {
    const task = filtered[i];

    const taskElement = document.createElement("div");
    taskElement.textContent = task.description;
    taskList.appendChild(taskElement);

    // Toggle button
    const toggleButton = document.createElement("button");
    toggleButton.textContent = task.completed ? "Mark as Incomplete" : "Mark as Complete";
    toggleButton.addEventListener("click", function () {
      toggleTaskCompletion(task.id);
    });
    taskElement.appendChild(toggleButton);

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
      deleteTask(task.id);
    });
    taskElement.appendChild(deleteButton);
  }
}

function toggleTaskCompletion(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    displayTasks();
  }
}

function deleteTask(taskId) {
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    displayTasks();
  }
}


// ─── Pure helper functions (exported for testing) ─────────────────────────────

// Returns a new task object, or null if description is invalid
function createTaskObject(description, id) {
  if (!description || description.trim() === "") return null;
  return { id, description, completed: false };
}

// Returns a new array with the target task's completed status flipped
function toggleTask(tasks, taskId) {
  return tasks.map((t) => t.id === taskId ? { ...t, completed: !t.completed } : t);
}

// Returns a new array with the target task removed
function removeTaskById(tasks, taskId) {
  return tasks.filter((t) => t.id !== taskId);
}

// Export for Node / CI — ignored in the browser
if (typeof module !== "undefined") {
  module.exports = { createTaskObject, toggleTask, removeTaskById };
}