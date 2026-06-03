import { useState } from "react";
import { formatCurrency } from "../utils";

function AccountItem({ item, index, onEdit, onDelete }) {
    const [editing, setEditing] = useState(false);
    const [desc, setDesc] = useState(item.description);
    const [balance, setBalance] = useState(item.balance);

    function handleSave() {
        if (!desc.trim()) return;
        onEdit(index, desc.trim(), parseFloat(balance) || 0);
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
                        <input className="edit-amount" type="number" value={balance} onChange={e => setBalance(e.target.value)} onKeyDown={handleKeyDown} placeholder="Balance" />
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
                <span className="item-amount positive">{formatCurrency(item.balance)}</span>
            </div>
            <div className="item-actions">
                <button className="edit-btn" onClick={() => setEditing(true)}>✎</button>
                <button className="delete-btn" onClick={() => onDelete(index)}>✕</button>
            </div>
        </li>
    );
}

export default function AccountList({ accounts, onAdd, onEdit, onDelete }) {
    const [description, setDescription] = useState("");
    const [balance, setBalance] = useState("");

    function handleAdd() {
        if (!description.trim() || balance === "") return;
        onAdd(description.trim(), parseFloat(balance) || 0);
        setDescription("");
        setBalance("");
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") handleAdd();
    }

    const total = accounts.reduce((sum, a) => sum + a.balance, 0);

    return (
        <div className="card account-card">
            <h2>Accounts</h2>
            <div className="input-group">
                <input type="text" placeholder="Account name" value={description} onChange={e => setDescription(e.target.value)} onKeyDown={handleKeyDown} />
                <div className="input-row">
                    <input type="number" placeholder="US$ Balance" value={balance} onChange={e => setBalance(e.target.value)} onKeyDown={handleKeyDown} />
                    <button onClick={handleAdd}>Add</button>
                </div>
            </div>
            <ul>
                {accounts.map((item, index) => (
                    <AccountItem key={index} item={item} index={index} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </ul>
            {accounts.length > 0 && (
                <div className="card-totals">
                    <span className="positive">Total: <strong>{formatCurrency(total)}</strong></span>
                </div>
            )}
        </div>
    );
}
