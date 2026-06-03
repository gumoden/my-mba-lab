import { useState, useEffect, useRef } from "react";
import IncomeList from "./components/IncomeList";
import ExpenseList from "./components/ExpenseList";
import CreditCardList from "./components/CreditCardList";
import AccountList from "./components/AccountList";
import SummaryPanel from "./components/SummaryPanel";
import MonthTabs from "./components/MonthTabs";

function currentMonthKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

const emptyMonth = () => ({ incomes: [], expenses: [], creditCards: [], accounts: [] });

export default function App() {
    const [months, setMonths] = useState({});
    const [activeMonth, setActiveMonth] = useState(currentMonthKey());
    const pendingSavesRef = useRef(0);
    const lastSaveCompleteRef = useRef(0);

    function applyServerData(data) {
        if (Object.keys(data).length === 0) {
            const key = currentMonthKey();
            setMonths({ [key]: emptyMonth() });
            setActiveMonth(key);
        } else {
            setMonths(data);
            const keys = Object.keys(data).sort();
            const cur = currentMonthKey();
            setActiveMonth(prev => data[prev] ? prev : (data[cur] ? cur : keys[keys.length - 1]));
        }
    }

    function loadBudget() {
        if (pendingSavesRef.current > 0) return;
        if (Date.now() - lastSaveCompleteRef.current < 5000) return;
        fetch("/budget")
            .then(res => res.json())
            .then(data => {
                if (pendingSavesRef.current > 0) return;
                if (Date.now() - lastSaveCompleteRef.current < 5000) return;
                applyServerData(data);
            });
    }

    useEffect(() => {
        loadBudget();
        function handleVisibility() {
            if (document.visibilityState === "visible") loadBudget();
        }
        document.addEventListener("visibilitychange", handleVisibility);
        const poll = setInterval(loadBudget, 30000);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
            clearInterval(poll);
        };
    }, []);

    function persist(updatedMonths) {
        pendingSavesRef.current++;
        setMonths(updatedMonths);
        fetch("/budget", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedMonths)
        })
        .then(res => {
            if (!res.ok) throw new Error("save failed");
            lastSaveCompleteRef.current = Date.now();
            pendingSavesRef.current--;
        })
        .catch(err => {
            console.error("Save failed:", err);
            pendingSavesRef.current--;
            // Save failed — reload actual state from server
            fetch("/budget").then(r => r.json()).then(applyServerData);
        });
    }

    function saveMonth(updates) {
        persist({
            ...months,
            [activeMonth]: { ...(months[activeMonth] || emptyMonth()), ...updates }
        });
    }

    function addMonth() {
        const keys = Object.keys(months).sort();
        const last = keys[keys.length - 1];
        const [y, m] = last.split("-").map(Number);
        // m is 1-based; new Date(y, m, 1) uses 0-based month index, so m = next month
        const next = new Date(y, m, 1);
        const nextKey = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
        if (months[nextKey]) return;
        persist({ ...months, [nextKey]: emptyMonth() });
        setActiveMonth(nextKey);
    }

    function deleteMonth(key) {
        const updated = { ...months };
        delete updated[key];
        persist(updated);
        if (activeMonth === key) {
            const remaining = Object.keys(updated).sort();
            setActiveMonth(remaining[remaining.length - 1]);
        }
    }

    function copyMonth(fromKey, toKey, resetPending) {
        const source = months[fromKey];
        const copied = {
            incomes:     source.incomes.map(i => ({ ...i, received: resetPending ? false : i.received })),
            expenses:    source.expenses.map(e => ({ ...e, paid: resetPending ? false : e.paid })),
            creditCards: source.creditCards.map(c => ({ ...c })),
            accounts:    (source.accounts || []).map(a => ({ ...a }))
        };
        persist({ ...months, [toKey]: copied });
        setActiveMonth(toKey);
    }

    const { incomes = [], expenses = [], creditCards = [], accounts = [] } = months[activeMonth] || {};

    function addIncome(description, amount) {
        saveMonth({ incomes: [...incomes, { description, amount, received: false }] });
    }
    function toggleReceived(index) {
        saveMonth({ incomes: incomes.map((item, i) => i === index ? { ...item, received: !item.received } : item) });
    }
    function editIncome(index, description, amount) {
        saveMonth({ incomes: incomes.map((item, i) => i === index ? { ...item, description, amount } : item) });
    }
    function deleteIncome(index) {
        saveMonth({ incomes: incomes.filter((_, i) => i !== index) });
    }

    function addExpense(description, amount) {
        saveMonth({ expenses: [...expenses, { description, amount, paid: false }] });
    }
    function togglePaid(index) {
        saveMonth({ expenses: expenses.map((item, i) => i === index ? { ...item, paid: !item.paid } : item) });
    }
    function editExpense(index, description, amount) {
        saveMonth({ expenses: expenses.map((item, i) => i === index ? { ...item, description, amount } : item) });
    }
    function deleteExpense(index) {
        saveMonth({ expenses: expenses.filter((_, i) => i !== index) });
    }

    function addCreditCard(description, apr, minimum, balance) {
        saveMonth({ creditCards: [...creditCards, { description, apr, minimum, balance }] });
    }
    function editCreditCard(index, description, apr, minimum, balance) {
        saveMonth({ creditCards: creditCards.map((item, i) => i === index ? { description, apr, minimum, balance } : item) });
    }
    function deleteCreditCard(index) {
        saveMonth({ creditCards: creditCards.filter((_, i) => i !== index) });
    }

    function addAccount(description, balance) {
        saveMonth({ accounts: [...accounts, { description, balance }] });
    }
    function editAccount(index, description, balance) {
        saveMonth({ accounts: accounts.map((item, i) => i === index ? { description, balance } : item) });
    }
    function deleteAccount(index) {
        saveMonth({ accounts: accounts.filter((_, i) => i !== index) });
    }

    return (
        <div className="wrapper">
            <MonthTabs
                months={months}
                activeMonth={activeMonth}
                onSwitch={setActiveMonth}
                onAdd={addMonth}
                onDelete={deleteMonth}
                onCopy={copyMonth}
            />
            <div className="main-row">
                <div className="left-column">
                    <IncomeList
                        key={activeMonth + "-income"}
                        incomes={incomes}
                        onAdd={addIncome}
                        onToggle={toggleReceived}
                        onEdit={editIncome}
                        onDelete={deleteIncome}
                    />
                    <AccountList
                        key={activeMonth + "-accounts"}
                        accounts={accounts}
                        onAdd={addAccount}
                        onEdit={editAccount}
                        onDelete={deleteAccount}
                    />
                </div>
                <ExpenseList
                    key={activeMonth + "-expenses"}
                    expenses={expenses}
                    onAdd={addExpense}
                    onToggle={togglePaid}
                    onEdit={editExpense}
                    onDelete={deleteExpense}
                />
                <CreditCardList
                    key={activeMonth + "-cc"}
                    creditCards={creditCards}
                    onAdd={addCreditCard}
                    onEdit={editCreditCard}
                    onDelete={deleteCreditCard}
                />
            </div>
            <SummaryPanel
                incomes={incomes}
                expenses={expenses}
                creditCards={creditCards}
                accounts={accounts}
            />
        </div>
    );
}
