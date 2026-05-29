const fs = require("fs");
const path = require("path");
const readline = require("readline");

const DB_FILE = path.join(__dirname, "tasks.json");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
    if (!fs.existsSync(DB_FILE)) {
        console.log("tasks.json not found.");
        rl.close();
        return;
    }

    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));

    console.log("\n=== Current Database State ===");
    console.log(`  Tasks:     ${(data.tasks     || []).length} items`);
    console.log(`  Completed: ${(data.completed || []).length} items`);
    console.log(`  Archived:  ${(data.archived  || []).length} items`);
    console.log(`  Deleted:   ${(data.deleted   || []).length} items`);

    console.log("\nWhat would you like to clean?");
    console.log("  1 - All (full reset)");
    console.log("  2 - Completed only");
    console.log("  3 - Archived only");
    console.log("  4 - Deleted only");
    console.log("  5 - Completed + Archived + Deleted (keep active tasks)");
    console.log("  0 - Cancel");

    const choice = await ask("\nEnter option: ");

    if (choice === "0") {
        console.log("Cancelled. No changes made.");
        rl.close();
        return;
    }

    const confirm = await ask("Are you sure? This cannot be undone. (yes/no): ");
    if (confirm.toLowerCase() !== "yes") {
        console.log("Cancelled. No changes made.");
        rl.close();
        return;
    }

    switch (choice) {
        case "1":
            data.tasks     = [];
            data.completed = [];
            data.archived  = [];
            data.deleted   = [];
            console.log("All sections cleared.");
            break;
        case "2":
            data.completed = [];
            console.log("Completed cleared.");
            break;
        case "3":
            data.archived = [];
            console.log("Archived cleared.");
            break;
        case "4":
            data.deleted = [];
            console.log("Deleted cleared.");
            break;
        case "5":
            data.completed = [];
            data.archived  = [];
            data.deleted   = [];
            console.log("Completed, Archived and Deleted cleared. Active tasks kept.");
            break;
        default:
            console.log("Invalid option. No changes made.");
            rl.close();
            return;
    }

    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    console.log("tasks.json updated successfully.\n");
    rl.close();
}

main();
