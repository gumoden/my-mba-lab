import { useState } from "react";
import { formatCurrency } from "../utils";

function CreditCardItem({ item, index, onEdit, onDelete }) {
    const [editing, setEditing] = useState(false);
    const [desc, setDesc] = useState(item.description);
    const [apr, setApr] = useState(item.apr);
    const [minimum, setMinimum] = useState(item.minimum);
    const [balance, setBalance] = useState(item.balance);

    function handleSave() {
        if (!desc.trim()) return;
        onEdit(index, desc.trim(), parseFloat(apr), parseFloat(minimum), parseFloat(balance));
        setEditing(false);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") setEditing(false);
    }

    if (editing) {
        return (
            <li className="cc-item">
                <div className="edit-group">
                    <input className="edit-text" type="text" value={desc} onChange={e => setDesc(e.target.value)} onKeyDown={handleKeyDown} autoFocus placeholder="Description" />
                    <div className="edit-row">
                        <input className="edit-amount" type="number" value={apr} onChange={e => setApr(e.target.value)} onKeyDown={handleKeyDown} placeholder="APR %" />
                        <input className="edit-amount" type="number" value={minimum} onChange={e => setMinimum(e.target.value)} onKeyDown={handleKeyDown} placeholder="Minimum" />
                        <input className="edit-amount" type="number" value={balance} onChange={e => setBalance(e.target.value)} onKeyDown={handleKeyDown} placeholder="Balance" />
                    </div>
                    <div className="edit-row">
                        <button className="save-btn" onClick={handleSave}>Save</button>
                        <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
                    </div>
                </div>
            </li>
        );
    }

    return (
        <li className="cc-item">
            <div className="cc-info">
                <span className="item-description">{item.description}</span>
                <div className="cc-details">
                    <span>APR: <strong>{item.apr}%</strong></span>
                    <span>Min: <strong>{formatCurrency(item.minimum)}</strong></span>
                    <span>Balance: <strong className="negative">{formatCurrency(item.balance)}</strong></span>
                </div>
            </div>
            <div className="item-actions">
                <button className="edit-btn" onClick={() => setEditing(true)}>✎</button>
                <button className="delete-btn" onClick={() => onDelete(index)}>✕</button>
            </div>
        </li>
    );
}

export default function CreditCardList({ creditCards, onAdd, onEdit, onDelete }) {
    const [description, setDescription] = useState("");
    const [apr, setApr] = useState("");
    const [minimum, setMinimum] = useState("");
    const [balance, setBalance] = useState("");

    function handleAdd() {
        if (!description.trim() || !balance) return;
        onAdd(description.trim(), parseFloat(apr) || 0, parseFloat(minimum) || 0, parseFloat(balance));
        setDescription("");
        setApr("");
        setMinimum("");
        setBalance("");
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") handleAdd();
    }

    const totalBalance = creditCards.reduce((sum, c) => sum + c.balance, 0);
    const totalMinimum = creditCards.reduce((sum, c) => sum + c.minimum, 0);

    return (
        <div className="card cc-card">
            <h2>Credit Cards</h2>
            <div className="input-group">
                <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} onKeyDown={handleKeyDown} />
                <div className="input-row">
                    <input type="number" placeholder="APR %" value={apr} onChange={e => setApr(e.target.value)} onKeyDown={handleKeyDown} />
                    <input type="number" placeholder="Minimum" value={minimum} onChange={e => setMinimum(e.target.value)} onKeyDown={handleKeyDown} />
                </div>
                <div className="input-row">
                    <input type="number" placeholder="Balance" value={balance} onChange={e => setBalance(e.target.value)} onKeyDown={handleKeyDown} />
                    <button onClick={handleAdd}>Add</button>
                </div>
            </div>
            <ul>
                {creditCards.map((item, index) => (
                    <CreditCardItem key={index} item={item} index={index} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </ul>
            {creditCards.length > 0 && (
                <div className="card-totals">
                    <span className="negative">Balance: <strong>{formatCurrency(totalBalance)}</strong></span>
                    <span>Min. Payments: <strong>{formatCurrency(totalMinimum)}</strong></span>
                </div>
            )}
        </div>
    );
}
