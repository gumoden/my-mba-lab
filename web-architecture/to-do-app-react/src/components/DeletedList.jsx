import { formatDate, isOverdue } from "../utils";

export default function DeletedList({ deleted, onRestore, onPurge }) {
    if (deleted.length === 0) return null;

    return (
        <div className="card deleted-card">
            <div className="deleted-header">
                <h2>Deleted</h2>
                <button onClick={onPurge}>Purge All</button>
            </div>
            <ul>
                {deleted.map((task, index) => {
                    const priority = task.priority || "Medium";
                    const overdue = isOverdue(task.dueDate);
                    return (
                        <li key={index}>
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
                                <button onClick={() => onRestore(index)}>Restore</button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
