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
