let tasks = [];
let deleted = [];

async function loadTasks() {
    const response = await fetch("/tasks");
    const data = await response.json();
    tasks = data.tasks;
    deleted = data.deleted;
    renderTasks();
    renderDeleted();
}

async function saveTasks() {
    await fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks, deleted })
    });
}

function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (text === "") return;

    const isDuplicate = tasks.some(task => task.text.toLowerCase() === text.toLowerCase());
    if (isDuplicate) {
        alert("A task with this name already exists.");
        return;
    }

    tasks.push({ text: text, done: false });
    input.value = "";
    saveTasks();
    renderTasks();
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    const removed = tasks.splice(index, 1)[0];
    deleted.push(removed);
    saveTasks();
    renderTasks();
    renderDeleted();
}

function purgeAll() {
    if (!confirm("Permanently delete all items?")) return;
    deleted = [];
    saveTasks();
    renderDeleted();
}

function restoreTask(index) {
    const restored = deleted.splice(index, 1)[0];
    tasks.push(restored);
    saveTasks();
    renderTasks();
    renderDeleted();
}

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = task.done ? "done" : "";

        li.innerHTML = `
            <span onclick="toggleTask(${index})">${task.text}</span>
            <button onclick="deleteTask(${index})">✕</button>
        `;

        list.appendChild(li);
    });
}

function renderDeleted() {
    const list = document.getElementById("deletedList");
    const section = document.getElementById("deletedSection");

    list.innerHTML = "";
    section.style.display = deleted.length === 0 ? "none" : "block";

    deleted.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = task.done ? "done" : "";

        li.innerHTML = `
            <span>${task.text}</span>
            <button onclick="restoreTask(${index})">Restore</button>
        `;

        list.appendChild(li);
    });
}

document.getElementById("taskInput").addEventListener("keydown", event => {
    if (event.key === "Enter") addTask();
});

loadTasks();
