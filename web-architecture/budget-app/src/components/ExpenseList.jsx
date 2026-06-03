import { useState } from "react";
import { formatCurrency } from "../utils";

function ExpenseItem({ item, index, onToggle, onEdit, onDelete }) {
    const [editing, setEditing] = useState(false);
    const [desc, setDesc] = useState(item.description);
    const [amount, setAmount] = useState(item.amount);

    function handleSave() {
        if (!desc.trim() || !amount) return;
        onEdit(index, desc.trim(), parseFloat(amount));
        setEditing(false);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") setEditing(false);
    }

    if (editing) {
        return (
            <li>
                <div className="edit-group">
                    <input className="edit-text" type="text" value={desc} onChange={e => setDesc(e.target.value)} onKeyDown={handleKeyDown} autoFocus />
                    <div className="edit-row">
                        <input className="edit-amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} onKeyDown={handleKeyDown} placeholder="Amount" />
                        <button className="save-btn" onClick={handleSave}>Save</button>
                        <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
                    </div>
                </div>
            </li>
        );
    }

    return (
        <li>
            <div className="item-info">
                <span className="item-description">{item.description}</span>
                <span className="item-amount">{formatCurrency(item.amount)}</span>
            </div>
            <div className="item-actions">
                <button className={`toggle-btn ${item.paid ? "paid" : ""}`} onClick={() => onToggle(index)}>
                    {item.paid ? "Paid" : "Pending"}
                </button>
                <button className="edit-btn" onClick={() => setEditing(true)}>✎</button>
                <button className="delete-btn" onClick={() => onDelete(index)}>✕</button>
            </div>
        </li>
    );
}

export default function ExpenseList({ expenses, onAdd, onToggle, onEdit, onDelete }) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");

    function handleAdd() {
        if (!description.trim() || !amount) return;
        onAdd(description.trim(), parseFloat(amount));
        setDescription("");
        setAmount("");
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") handleAdd();
    }

    const totalExpenses = expenses.reduce((sum, i) => sum + i.amount, 0);
    const totalPaid = expenses.filter(i => i.paid).reduce((sum, i) => sum + i.amount, 0);

    return (
        <div className="card expense-card">
            <h2>Expenses</h2>
            <div className="input-group">
                <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} onKeyDown={handleKeyDown} />
                <div className="input-row">
                    <input type="number" placeholder="US$ Amount" value={amount} onChange={e => setAmount(e.target.value)} onKeyDown={handleKeyDown} />
                    <button onClick={handleAdd}>Add</button>
                </div>
            </div>
            <ul>
                {expenses.map((item, index) => (
                    <ExpenseItem key={index} item={item} index={index} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </ul>
            {expenses.length > 0 && (
                <div className="card-totals">
                    <span>Total: <strong>{formatCurrency(totalExpenses)}</strong></span>
                    <span className="negative">Paid: <strong>{formatCurrency(totalPaid)}</strong></span>
                </div>
            )}
        </div>
    );
}
