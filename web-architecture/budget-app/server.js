const express = require("express");
const helmet = require("helmet");
const { CosmosClient } = require("@azure/cosmos");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const container = client.database("budgetdb").container("budgetdata");

app.use(helmet({
    referrerPolicy: { policy: "same-origin" }
}));
app.use(express.json());

app.get("/budget", async (req, res) => {
    res.set("Cache-Control", "no-store");
    try {
        const { resource } = await container.item("budget", "budget").read();
        res.json(resource ? resource.data : {});
    } catch (err) {
        if (err.code === 404) return res.json({});
        throw err;
    }
});

app.post("/budget", async (req, res) => {
    try {
        await container.items.upsert({ id: "budget", data: req.body });
        res.json({ success: true });
    } catch (err) {
        console.error("POST /budget error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// Serve built React app for all non-API routes
app.use(express.static(path.join(__dirname, "dist")));
app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT);
});
