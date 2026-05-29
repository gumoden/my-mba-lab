import { useState } from "react";
import { isOverdue } from "../utils";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onAdd, onComplete, onDelete, onEdit, onEmail }) {
    const [text, setText] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("Medium");

    function handleAdd() {
        if (text.trim() === "") return;
        const saved = onAdd(text.trim(), dueDate, priority);
        if (saved) {
            setText("");
            setDueDate("");
            setPriority("Medium");
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") handleAdd();
    }

    return (
        <div className="card">
            <h2>To-Do List</h2>

            <div className="input-group">
                <input
                    type="text"
                    placeholder="Add a new task..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <div className="input-row">
                    <input
                        type="date"
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <select
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                        onKeyDown={handleKeyDown}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <button onClick={handleAdd}>Add</button>
                </div>
            </div>

            <ul>
                {tasks.map((task, index) => (
                    <TaskItem
                        key={index}
                        task={task}
                        index={index}
                        onComplete={onComplete}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                ))}
            </ul>

            <button className="email-btn" onClick={onEmail}>Send list by Email</button>
        </div>
    );
}
