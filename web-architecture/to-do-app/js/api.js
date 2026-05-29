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
