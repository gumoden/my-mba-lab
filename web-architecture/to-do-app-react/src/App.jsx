import { useState, useEffect } from "react";
import { todayStr, formatDate, isOverdue } from "./utils";
import TaskList from "./components/TaskList";
import CompletedList from "./components/CompletedList";
import ArchivedSection from "./components/ArchivedSection";
import DeletedList from "./components/DeletedList";

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [deleted, setDeleted] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [archived, setArchived] = useState([]);
    const [archiveVisible, setArchiveVisible] = useState(false);

    useEffect(() => {
        fetch("/tasks")
            .then(res => res.json())
            .then(data => {
                setTasks(data.tasks || []);
                setDeleted(data.deleted || []);
                setCompleted(data.completed || []);
                setArchived(data.archived || []);
            });
    }, []);

    function save(updates) {
        const next = { tasks, deleted, completed, archived, ...updates };
        fetch("/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(next)
        });
        if (updates.tasks    !== undefined) setTasks(updates.tasks);
        if (updates.deleted  !== undefined) setDeleted(updates.deleted);
        if (updates.completed !== undefined) setCompleted(updates.completed);
        if (updates.archived !== undefined) setArchived(updates.archived);
    }

    function addTask(text, dueDate, priority) {
        const duplicate = tasks.some(t => t.text.toLowerCase() === text.toLowerCase());
        if (duplicate) { alert("A task with this name already exists."); return false; }
        if (isOverdue(dueDate)) {
            if (!confirm("The due date is in the past. Save anyway?")) return false;
        }
        save({ tasks: [...tasks, { text, dueDate: dueDate || null, priority }] });
        return true;
    }

    function completeTask(index) {
        const updated = [...tasks];
        const task = { ...updated.splice(index, 1)[0], completedDate: todayStr() };
        save({ tasks: updated, completed: [...completed, task] });
    }

    function uncompleteTask(index) {
        const updated = [...completed];
        const task = updated.splice(index, 1)[0];
        delete task.completedDate;
        save({ completed: updated, tasks: [...tasks, task] });
    }

    function deleteTask(index) {
        const updated = [...tasks];
        const removed = updated.splice(index, 1)[0];
        save({ tasks: updated, deleted: [...deleted, removed] });
    }

    function editTask(index, newText, newDate, newPriority) {
        const duplicate = tasks.some((t, i) => i !== index && t.text.toLowerCase() === newText.toLowerCase());
        if (duplicate) { alert("A task with this name already exists."); return false; }
        const updated = tasks.map((t, i) =>
            i === index ? { ...t, text: newText, dueDate: newDate || null, priority: newPriority } : t
        );
        save({ tasks: updated });
        return true;
    }

    function restoreTask(index) {
        const updated = [...deleted];
        const restored = updated.splice(index, 1)[0];
        save({ deleted: updated, tasks: [...tasks, restored] });
    }

    function purgeAll() {
        if (!confirm("Permanently delete all items?")) return;
        save({ deleted: [] });
    }

    function archiveCompleted() {
        if (!confirm("Archive all completed items?")) return;
        save({ archived: [...archived, ...completed], completed: [] });
    }

    function sendByEmail() {
        if (tasks.length === 0) { alert("Your to-do list is empty."); return; }
        const lines = tasks.map(t => {
            const date = t.dueDate ? ` — Due: ${formatDate(t.dueDate)}` : "";
            return `[Pending] ${t.text}${date} — Priority: ${t.priority || "Medium"}`;
        });
        const body = "Here is my current to-do list:\n\n" + lines.join("\n");
        window.location.href = `mailto:?subject=${encodeURIComponent("My To-Do List")}&body=${encodeURIComponent(body)}`;
    }

    return (
        <div className="wrapper">
            <div className="top-row">
                <TaskList
                    tasks={tasks}
                    onAdd={addTask}
                    onComplete={completeTask}
                    onDelete={deleteTask}
                    onEdit={editTask}
                    onEmail={sendByEmail}
                />
                <CompletedList
                    completed={completed}
                    onUncomplete={uncompleteTask}
                    onArchive={archiveCompleted}
                />
            </div>
            <ArchivedSection
                archived={archived}
                archiveVisible={archiveVisible}
                onToggle={() => setArchiveVisible(v => !v)}
            />
            <DeletedList
                deleted={deleted}
                onRestore={restoreTask}
                onPurge={purgeAll}
            />
        </div>
    );
}
