import { formatCurrency } from "../utils";

export default function SummaryPanel({ incomes, expenses, creditCards, accounts }) {
    const totalPending   = incomes.filter(i => !i.received).reduce((sum, i) => sum + i.amount, 0);
    const totalReceived  = incomes.filter(i => i.received).reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses  = expenses.reduce((sum, i) => sum + i.amount, 0);
    const totalPaid      = expenses.filter(i => i.paid).reduce((sum, i) => sum + i.amount, 0);
    const totalUnpaid    = totalExpenses - totalPaid;
    const totalCCBalance = creditCards.reduce((sum, c) => sum + c.balance, 0);
    const totalCCMinimum = creditCards.reduce((sum, c) => sum + c.minimum, 0);
    const totalAccounts  = (accounts || []).reduce((sum, a) => sum + a.balance, 0);
    const surplus        = totalPending + totalAccounts - totalUnpaid;

    return (
        <div className="card summary-card">
            <h2>Summary</h2>
            <div className="summary-grid">
                <div className="summary-section summary-income">
                    <h3>Income</h3>
                    <div className="summary-row">
                        <span>Pending</span>
                        <strong>{formatCurrency(totalPending)}</strong>
                    </div>
                    <div className="summary-row">
                        <span>Received</span>
                        <strong className="summary-received">{formatCurrency(totalReceived)}</strong>
                    </div>
                </div>

                <div className="summary-section summary-expenses">
                    <h3>Expenses</h3>
                    <div className="summary-row">
                        <span>Total</span>
                        <strong>{formatCurrency(totalExpenses)}</strong>
                    </div>
                    <div className="summary-row">
                        <span>Paid</span>
                        <strong className="summary-received">{formatCurrency(totalPaid)}</strong>
                    </div>
                    <div className="summary-row">
                        <span>Remaining</span>
                        <strong className="negative">{formatCurrency(totalUnpaid)}</strong>
                    </div>
                </div>

                <div className="summary-section summary-cc">
                    <h3>Credit Cards</h3>
                    <div className="summary-row">
                        <span>Total Balance</span>
                        <strong className="negative">{formatCurrency(totalCCBalance)}</strong>
                    </div>
                    <div className="summary-row">
                        <span>Min. Payments</span>
                        <strong>{formatCurrency(totalCCMinimum)}</strong>
                    </div>
                </div>

                <div className="summary-section summary-accounts">
                    <h3>Accounts</h3>
                    <div className="summary-row">
                        <span>Total Balance</span>
                        <strong className="positive">{formatCurrency(totalAccounts)}</strong>
                    </div>
                </div>

                <div className="summary-section surplus-section">
                    <h3>Surplus</h3>
                    <div className="summary-row">
                        <span>Pending + Accounts − Remaining</span>
                        <strong className={surplus >= 0 ? "positive" : "negative"}>
                            {formatCurrency(surplus)}
                        </strong>
                    </div>
                </div>
            </div>
        </div>
    );
}
