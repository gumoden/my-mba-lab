let tasks = [];

// Load tasks from server when page opens
async function loadTasks() {
    const response = await fetch("/tasks");
    tasks = await response.json();
    renderTasks();
}

// Save tasks to server (writes to tasks.json on disk)
async function saveTasks() {
    await fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tasks)
    });
}

function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (text === "") return;

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
    tasks = tasks.filter((_, i) => i !== index);
    saveTasks();
    renderTasks();
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

document.getElementById("taskInput").addEventListener("keydown", event => {
    if (event.key === "Enter") addTask();
});

// Start by loading tasks from the server
loadTasks();
