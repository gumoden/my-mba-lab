const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, "tasks.json");

// Serve static files (todo.html, todo.css, todo.js)
app.use(express.static(__dirname));

// Parse incoming JSON from the browser
app.use(express.json());

// GET /tasks — load tasks from file
app.get("/tasks", (req, res) => {
    if (!fs.existsSync(DB_FILE)) {
        return res.json([]);
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    res.json(JSON.parse(data));
});

// POST /tasks — save tasks to file
app.post("/tasks", (req, res) => {
    const tasks = req.body;
    fs.writeFileSync(DB_FILE, JSON.stringify(tasks, null, 2));
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT);
});
