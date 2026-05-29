import { formatDate } from "../utils";

export default function CompletedList({ completed, onUncomplete, onArchive }) {
    if (completed.length === 0) return null;

    return (
        <div className="card completed-card">
            <div className="completed-header">
                <h2>Completed</h2>
                <button className="archive-btn" onClick={onArchive}>Archive All</button>
            </div>
            <ul>
                {completed.map((task, index) => {
                    const priority = task.priority || "Medium";
                    const dueDate = task.dueDate ? formatDate(task.dueDate) : "No due date";
                    return (
                        <li key={index}>
                            <div className="task-info">
                                <span className="task-text">{task.text}</span>
                                <div className="completed-meta">
                                    <span>Due: {dueDate}</span>
                                    <span>Completed: {formatDate(task.completedDate)}</span>
                                </div>
                            </div>
                            <div className="task-actions">
                                <span className={`priority-badge priority-${priority.toLowerCase()}`}>{priority}</span>
                                <button className="restore-btn" onClick={() => onUncomplete(index)}>↩ Undo</button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
