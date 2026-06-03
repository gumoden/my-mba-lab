import { useState } from "react";

function formatMonth(key) {
    const [y, m] = key.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function MonthTabs({ months, activeMonth, onSwitch, onAdd, onDelete, onCopy }) {
    const [copyFrom, setCopyFrom] = useState(null);
    const [copyTarget, setCopyTarget] = useState("");
    const [resetPending, setResetPending] = useState(true);

    const keys = Object.keys(months).sort();

    function handleDelete(key) {
        if (keys.length <= 1) {
            alert("Cannot delete the last month.");
            return;
        }
        if (window.confirm(`Delete ${formatMonth(key)}? This cannot be undone.`)) {
            onDelete(key);
        }
    }

    function openCopy(key) {
        const sortedKeys = Object.keys(months).sort();
        const last = sortedKeys[sortedKeys.length - 1];
        const [y, m] = last.split("-").map(Number);
        const next = new Date(y, m, 1);
        const suggested = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
        setCopyFrom(key);
        setCopyTarget(suggested);
        setResetPending(true);
    }

    function handleCopy() {
        if (!copyTarget) return;
        if (months[copyTarget]) {
            alert(`${formatMonth(copyTarget)} already exists. Choose a different month.`);
            return;
        }
        onCopy(copyFrom, copyTarget, resetPending);
        setCopyFrom(null);
    }

    return (
        <>
            {/* Desktop: tab bar */}
            <div className="month-tabs">
                {keys.map(key => (
                    <div key={key} className={`month-tab-group ${key === activeMonth ? "active" : ""}`}>
                        <button className="month-tab-label" onClick={() => onSwitch(key)}>
                            {formatMonth(key)}
                        </button>
                        <button className="tab-icon-btn" onClick={() => openCopy(key)} title="Copy month">⧉</button>
                        <button className="tab-icon-btn tab-delete-btn" onClick={() => handleDelete(key)} title="Delete month">✕</button>
                    </div>
                ))}
                <button className="month-add-btn" onClick={onAdd}>+ Add Month</button>
            </div>

            {/* Mobile: dropdown */}
            <div className="month-dropdown-bar">
                <select
                    className="month-select"
                    value={activeMonth}
                    onChange={e => onSwitch(e.target.value)}
                >
                    {keys.map(key => (
                        <option key={key} value={key}>{formatMonth(key)}</option>
                    ))}
                </select>
                <div className="month-dropdown-actions">
                    <button className="month-add-btn" onClick={onAdd}>+ Add</button>
                    <button className="tab-icon-btn" onClick={() => openCopy(activeMonth)} title="Copy month">⧉ Copy</button>
                    <button className="tab-icon-btn tab-delete-btn" onClick={() => handleDelete(activeMonth)} title="Delete month">✕ Delete</button>
                </div>
            </div>

            {copyFrom && (
                <div className="copy-modal-overlay" onClick={() => setCopyFrom(null)}>
                    <div className="copy-modal" onClick={e => e.stopPropagation()}>
                        <h3>Copy {formatMonth(copyFrom)} to</h3>
                        <input
                            type="month"
                            value={copyTarget}
                            onChange={e => setCopyTarget(e.target.value)}
                        />
                        <label className="copy-reset-label">
                            <input
                                type="checkbox"
                                checked={resetPending}
                                onChange={e => setResetPending(e.target.checked)}
                            />
                            Reset all income &amp; expenses to Pending
                        </label>
                        <div className="copy-modal-actions">
                            <button className="save-btn" onClick={handleCopy}>Copy</button>
                            <button className="cancel-btn" onClick={() => setCopyFrom(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
