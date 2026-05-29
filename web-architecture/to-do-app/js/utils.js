function formatDate(dateStr) {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
}

function todayStr() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function isOverdue(dateStr) {
    if (!dateStr) return false;
    return dateStr < todayStr();
}
