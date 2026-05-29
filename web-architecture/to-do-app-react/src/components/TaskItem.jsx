import { useState } from "react";
import { formatDate, isOverdue } from "../utils";

export default function TaskItem({ task, index, onComplete, onDelete, onEdit }) {
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);
    const [editDate, setEditDate] = useState(task.dueDate || "");
    const [editPriority, setEditPriority] = useState(task.priority || "Medium");

    function handleSave() {
        if (editText.trim() === "") return;
        const saved = onEdit(index, editText.trim(), editDate, editPriority);
        if (saved) setEditing(false);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") setEditing(false);
    }

    const overdue = isOverdue(task.dueDate);
    const priority = task.priority || "Medium";

    if (editing) {
        return (
            <li>
                <div className="edit-group">
                    <input
                        className="edit-text"
                        type="text"
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                    <div className="edit-row">
                        <input
                            className="edit-date"
                            type="date"
                            value={editDate}
                            onChange={e => setEditDate(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <select
                            className="edit-priority"
                            value={editPriority}
                            onChange={e => setEditPriority(e.target.value)}
                            onKeyDown={handleKeyDown}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        <button className="save-btn" onClick={handleSave}>Save</button>
                        <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
                    </div>
                </div>
            </li>
        );
    }

    return (
        <li>
            <div className="task-info">
                <span className="task-text">{task.text}</span>
                {task.dueDate && (
                    <span className={`due-date ${overdue ? "overdue" : ""}`}>
                        {overdue ? "Overdue: " : "Due: "}{formatDate(task.dueDate)}
                    </span>
                )}
            </div>
            <div className="task-actions">
                <span className={`priority-badge priority-${priority.toLowerCase()}`}>{priority}</span>
                <button className="complete-btn" onClick={() => onComplete(index)} title="Mark as complete">✓</button>
                <button className="edit-btn" onClick={() => setEditing(true)}>✎</button>
                <button onClick={() => onDelete(index)}>✕</button>
            </div>
        </li>
    );
}
