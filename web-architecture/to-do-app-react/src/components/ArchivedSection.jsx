import { formatDate } from "../utils";

export default function ArchivedSection({ archived, archiveVisible, onToggle }) {
    if (archived.length === 0) return null;

    return (
        <>
            <div id="viewArchiveRow" style={{ display: "flex", justifyContent: "center" }}>
                <button className="view-archive-btn" onClick={onToggle}>
                    {archiveVisible ? "Hide Archive" : `View Archive (${archived.length})`}
                </button>
            </div>

            {archiveVisible && (
                <div className="card archived-card">
                    <div className="deleted-header">
                        <h2>Archive</h2>
                        <button className="toggle-archive-btn" onClick={onToggle}>Hide</button>
                    </div>
                    <ul>
                        {archived.map((task, index) => {
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
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </>
    );
}
