let tasks = [];
let deleted = [];
let completed = [];
let archived = [];
let archiveVisible = false;

async function loadTasks() {
    const response = await fetch("/tasks");
    const data = await response.json();
    tasks = data.tasks;
    deleted = data.deleted;
    completed = data.completed || [];
    archived = data.archived || [];
    renderTasks();
    renderCompleted();
    renderDeleted();
    renderArchived();
}

async function saveTasks() {
    await fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks, deleted, completed, archived })
    });
}

function formatDate(dateStr) {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
}

function todayStr() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function isOverdue(dateStr) {
    if (!dateStr) return false;
    return dateStr < todayStr();
}

function addTask() {
    const input = document.getElementById("taskInput");
    const dateInput = document.getElementById("taskDate");
    const priorityInput = document.getElementById("taskPriority");
    const text = input.value.trim();

    if (text === "") return;

    const isDuplicate = tasks.some(task => task.text.toLowerCase() === text.toLowerCase());
    if (isDuplicate) {
        alert("A task with this name already exists.");
        return;
    }

    if (isOverdue(dateInput.value)) {
        const proceed = confirm("The due date is in the past. Save anyway?");
        if (!proceed) return;
    }

    tasks.push({ text: text, dueDate: dateInput.value || null, priority: priorityInput.value });
    input.value = "";
    dateInput.value = "";
    priorityInput.value = "Medium";
    saveTasks();
    renderTasks();
}

function completeTask(index) {
    const task = tasks.splice(index, 1)[0];
    task.completedDate = todayStr();
    completed.push(task);
    saveTasks();
    renderTasks();
    renderCompleted();
}

function uncompleteTask(index) {
    const task = completed.splice(index, 1)[0];
    delete task.completedDate;
    tasks.push(task);
    saveTasks();
    renderTasks();
    renderCompleted();
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
        const overdue = isOverdue(task.dueDate);
        const dateLabel = task.dueDate
            ? `<span class="due-date ${overdue ? "overdue" : ""}">
                ${overdue ? "Overdue: " : "Due: "}${formatDate(task.dueDate)}
               </span>`
            : "";
        const priority = task.priority || "Medium";

        li.innerHTML = `
            <div class="task-info">
                <span class="task-text">${task.text}</span>
                ${dateLabel}
            </div>
            <div class="task-actions">
                <span class="priority-badge priority-${priority.toLowerCase()}">${priority}</span>
                <button class="complete-btn" onclick="completeTask(${index})" title="Mark as complete">✓</button>
                <button class="edit-btn" onclick="editTask(${index})">✎</button>
                <button onclick="deleteTask(${index})">✕</button>
            </div>
        `;

        list.appendChild(li);
    });
}

function renderCompleted() {
    const list = document.getElementById("completedList");
    const section = document.getElementById("completedSection");

    list.innerHTML = "";
    section.style.display = completed.length === 0 ? "none" : "block";

    completed.forEach((task, index) => {
        const priority = task.priority || "Medium";
        const dueDate = task.dueDate ? formatDate(task.dueDate) : "No due date";
        const completedDate = formatDate(task.completedDate);

        const li = document.createElement("li");
        li.innerHTML = `
            <div class="task-info">
                <span class="task-text">${task.text}</span>
                <div class="completed-meta">
                    <span>Due: ${dueDate}</span>
                    <span>Completed: ${completedDate}</span>
                </div>
            </div>
            <div class="task-actions">
                <span class="priority-badge priority-${priority.toLowerCase()}">${priority}</span>
                <button class="restore-btn" onclick="uncompleteTask(${index})">↩ Undo</button>
            </div>
        `;

        list.appendChild(li);
    });
}

function editTask(index) {
    const list = document.getElementById("taskList");
    const items = list.querySelectorAll("li");
    const li = items[index];
    const task = tasks[index];
    const priority = task.priority || "Medium";

    li.className = "";
    li.innerHTML = `
        <div class="edit-group">
            <input class="edit-text" type="text" value="${task.text}" />
            <div class="edit-row">
                <input class="edit-date" type="date" value="${task.dueDate || ""}" />
                <select class="edit-priority">
                    <option value="Low" ${priority === "Low" ? "selected" : ""}>Low</option>
                    <option value="Medium" ${priority === "Medium" ? "selected" : ""}>Medium</option>
                    <option value="High" ${priority === "High" ? "selected" : ""}>High</option>
                </select>
                <button class="save-btn" onclick="saveEdit(${index})">Save</button>
                <button class="cancel-btn" onclick="renderTasks()">Cancel</button>
            </div>
        </div>
    `;

    li.querySelector(".edit-text").focus();

    li.querySelectorAll(".edit-text, .edit-date, .edit-priority").forEach(field => {
        field.addEventListener("keydown", event => {
            if (event.key === "Enter") saveEdit(index);
            if (event.key === "Escape") renderTasks();
        });
    });
}

function saveEdit(index) {
    const list = document.getElementById("taskList");
    const items = list.querySelectorAll("li");
    const li = items[index];

    const newText = li.querySelector(".edit-text").value.trim();
    const newDate = li.querySelector(".edit-date").value;

    if (newText === "") return;

    const isDuplicate = tasks.some((task, i) =>
        i !== index && task.text.toLowerCase() === newText.toLowerCase()
    );
    if (isDuplicate) {
        alert("A task with this name already exists.");
        return;
    }

    tasks[index].text = newText;
    tasks[index].dueDate = newDate || null;
    tasks[index].priority = li.querySelector(".edit-priority").value;
    saveTasks();
    renderTasks();
}

function archiveCompleted() {
    if (completed.length === 0) return;
    if (!confirm("Archive all completed items?")) return;
    archived = archived.concat(completed);
    completed = [];
    saveTasks();
    renderCompleted();
    renderArchived();
}

function toggleArchive() {
    archiveVisible = !archiveVisible;
    renderArchived();
}

function renderArchived() {
    const section = document.getElementById("archivedSection");
    const list = document.getElementById("archivedList");
    const toggleBtn = section.querySelector(".toggle-archive-btn");
    const viewRow = document.getElementById("viewArchiveRow");

    if (archived.length === 0) {
        section.style.display = "none";
        viewRow.style.display = "none";
        return;
    }

    viewRow.style.display = "flex";
    viewRow.querySelector(".view-archive-btn").textContent =
        archiveVisible ? "Hide Archive" : `View Archive (${archived.length})`;

    section.style.display = archiveVisible ? "block" : "none";

    if (!archiveVisible) return;

    list.innerHTML = "";
    toggleBtn.textContent = "Hide";

    archived.forEach(task => {
        const priority = task.priority || "Medium";
        const dueDate = task.dueDate ? formatDate(task.dueDate) : "No due date";
        const completedDate = formatDate(task.completedDate);

        const li = document.createElement("li");
        li.innerHTML = `
            <div class="task-info">
                <span class="task-text">${task.text}</span>
                <div class="completed-meta">
                    <span>Due: ${dueDate}</span>
                    <span>Completed: ${completedDate}</span>
                </div>
            </div>
            <div class="task-actions">
                <span class="priority-badge priority-${priority.toLowerCase()}">${priority}</span>
            </div>
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
        const overdue = isOverdue(task.dueDate);
        const dateLabel = task.dueDate
            ? `<span class="due-date ${overdue ? "overdue" : ""}">
                ${overdue ? "Overdue: " : "Due: "}${formatDate(task.dueDate)}
               </span>`
            : "";
        const priority = task.priority || "Medium";

        const li = document.createElement("li");
        li.innerHTML = `
            <div class="task-info">
                <span class="task-text">${task.text}</span>
                ${dateLabel}
            </div>
            <div class="task-actions">
                <span class="priority-badge priority-${priority.toLowerCase()}">${priority}</span>
                <button onclick="restoreTask(${index})">Restore</button>
            </div>
        `;

        list.appendChild(li);
    });
}

function sendByEmail() {
    if (tasks.length === 0) {
        alert("Your to-do list is empty.");
        return;
    }

    const lines = tasks.map(task => {
        const date = task.dueDate ? ` — Due: ${formatDate(task.dueDate)}` : "";
        const priority = ` — Priority: ${task.priority || "Medium"}`;
        return `[Pending] ${task.text}${date}${priority}`;
    });

    const subject = "My To-Do List";
    const body = "Here is my current to-do list:\n\n" + lines.join("\n");

    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

document.getElementById("taskInput").addEventListener("keydown", event => {
    if (event.key === "Enter") addTask();
});

document.getElementById("taskDate").addEventListener("keydown", event => {
    if (event.key === "Enter") addTask();
});

document.getElementById("taskPriority").addEventListener("keydown", event => {
    if (event.key === "Enter") addTask();
});

loadTasks();
