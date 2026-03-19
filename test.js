// Works in both Node (CI) and browser
if (typeof window === "undefined") {
  global.window = {};
}
window.alert = () => {};

if (typeof require !== "undefined") {
  const imported = require("./script.js");
  var createTaskObject = imported.createTaskObject;
  var toggleTask = imported.toggleTask;
  var removeTaskById = imported.removeTaskById;
}

// ─── Simple test runner ───────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name}`);
    console.log(`     ${e.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || "Assertion failed");
}

function assertEqual(a, b) {
  if (a !== b) throw new Error(`Expected ${JSON.stringify(a)} to equal ${JSON.stringify(b)}`);
}

// ─── createTaskObject ─────────────────────────────────────────────────────────

console.log("\ncreateTaskObject");

test("returns a task with correct id and description", () => {
  const task = createTaskObject("Buy milk", 1);
  assertEqual(task.id, 1);
  assertEqual(task.description, "Buy milk");
});

test("sets completed to false by default", () => {
  const task = createTaskObject("Buy milk", 1);
  assertEqual(task.completed, false);
});

test("returns null for empty string", () => {
  const task = createTaskObject("", 1);
  assertEqual(task, null);
});

test("returns null for whitespace-only string", () => {
  const task = createTaskObject("   ", 1);
  assertEqual(task, null);
});

test("returns null for missing description", () => {
  const task = createTaskObject(undefined, 1);
  assertEqual(task, null);
});

// ─── tasks array manipulation ─────────────────────────────────────────────────

console.log("\ntasks array");

test("push adds a task to the array", () => {
  const tasks = [];
  tasks.push(createTaskObject("Task A", 0));
  assertEqual(tasks.length, 1);
  assertEqual(tasks[0].description, "Task A");
});

test("removeTaskById removes the correct task", () => {
  const tasks = [createTaskObject("Task A", 0), createTaskObject("Task B", 1)];
  const result = removeTaskById(tasks, 0);
  assertEqual(result.length, 1);
  assertEqual(result[0].description, "Task B");
});

test("removeTaskById does nothing for missing id", () => {
  const tasks = [createTaskObject("Task A", 0)];
  const result = removeTaskById(tasks, 99);
  assertEqual(result.length, 1);
});

test("find returns the correct task by id", () => {
  const tasks = [createTaskObject("Task A", 0), createTaskObject("Task B", 1)];
  const task = tasks.find((t) => t.id === 1);
  assertEqual(task.description, "Task B");
});

test("find returns undefined for a missing id", () => {
  const tasks = [createTaskObject("Task A", 0)];
  const task = tasks.find((t) => t.id === 99);
  assertEqual(task, undefined);
});

// ─── toggleTask logic ─────────────────────────────────────────────────────────

console.log("\ntoggleTask");

test("toggles completed from false to true", () => {
  const tasks = [createTaskObject("Task A", 0)];
  const result = toggleTask(tasks, 0);
  assertEqual(result.find((t) => t.id === 0).completed, true);
});

test("toggles completed from true to false", () => {
  const tasks = [{ ...createTaskObject("Task A", 0), completed: true }];
  const result = toggleTask(tasks, 0);
  assertEqual(result.find((t) => t.id === 0).completed, false);
});

test("does nothing when task id is not found", () => {
  const tasks = [createTaskObject("Task A", 0)];
  const result = toggleTask(tasks, 99);
  assertEqual(result.length, 1);
  assertEqual(result[0].completed, false);
});

// ─── filter logic ─────────────────────────────────────────────────────────────

console.log("\nfilter logic");

test('"all" filter returns every task', () => {
  const tasks = [
    { ...createTaskObject("Task A", 0), completed: false },
    { ...createTaskObject("Task B", 1), completed: true },
  ];
  const result = tasks.filter(() => true);
  assertEqual(result.length, 2);
});

test('"active" filter returns only incomplete tasks', () => {
  const tasks = [
    { ...createTaskObject("Task A", 0), completed: false },
    { ...createTaskObject("Task B", 1), completed: true },
  ];
  const result = tasks.filter((t) => !t.completed);
  assertEqual(result.length, 1);
  assertEqual(result[0].description, "Task A");
});

test('"done" filter returns only completed tasks', () => {
  const tasks = [
    { ...createTaskObject("Task A", 0), completed: false },
    { ...createTaskObject("Task B", 1), completed: true },
  ];
  const result = tasks.filter((t) => t.completed);
  assertEqual(result.length, 1);
  assertEqual(result[0].description, "Task B");
});

test('"done" filter returns empty array when no tasks are complete', () => {
  const tasks = [createTaskObject("Task A", 0), createTaskObject("Task B", 1)];
  const result = tasks.filter((t) => t.completed);
  assertEqual(result.length, 0);
});

// ─── Summary ──────────────────────────────────────────────────────────────────

const total = passed + failed;
console.log(`\n${total} tests: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1); // fail the CI build if any test fails