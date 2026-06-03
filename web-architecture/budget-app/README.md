# Monthly Budget App

A personal monthly budget tracker built with React and Node.js, deployed on Azure Container Apps.

Track income, expenses, credit cards, and account balances across multiple months. Changes sync automatically across devices.

---

## Live App

**URL:** https://`<your-custom-domain>`

Access is restricted to authorized Microsoft accounts via Azure Easy Auth (Entra ID).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 (JSX components, built with Vite) |
| Backend | Node.js + Express 5 |
| Database | Azure Cosmos DB (NoSQL, free tier) |
| Hosting | Azure Container Apps |
| Auth | Azure Easy Auth (Entra ID / Microsoft login) |
| Container Registry | Azure Container Registry (ACR) |

---

## Azure Infrastructure

Create the following resources in your Azure subscription:

| Resource | Suggested Name | Purpose |
|---|---|---|
| Resource Group | `<your-resource-group>` | Contains all resources |
| Container App | `<your-container-app>` | Runs the Docker container |
| Container App Environment | `<your-env>` | Networking environment |
| Container Registry | `<your-registry>` | Stores Docker images |
| Cosmos DB Account | `<your-cosmos-account>` | Stores budget data (free tier) |
| Custom Domain | `<your-domain>` (optional) | Public URL |

---

## Project Structure

```
budget-app/
├── server.js              — Express backend: serves the app and handles /budget API
├── Dockerfile             — Multi-stage build: compiles React, then runs Express
├── vite.config.js         — Vite build configuration
├── package.json           — Dependencies and scripts
├── index.html             — Single HTML page (React mounts here)
└── src/
    ├── main.jsx           — React entry point
    ├── App.jsx            — Root component: state management, API calls
    ├── utils.js           — Shared helpers (formatCurrency)
    ├── index.css          — All styling, including responsive breakpoints
    └── components/
        ├── IncomeList.jsx      — Income card
        ├── ExpenseList.jsx     — Expenses card
        ├── CreditCardList.jsx  — Credit cards card
        ├── AccountList.jsx     — Accounts card
        ├── SummaryPanel.jsx    — Summary bar (totals and surplus)
        └── MonthTabs.jsx       — Month navigation (tabs on desktop, dropdown on mobile)
```

---

## Running Locally

### Requirements

- Node.js installed
- An Azure Cosmos DB connection string (free tier account is sufficient)

### Setup

Set the Cosmos DB connection string as an environment variable before starting:

```bash
export COSMOS_CONNECTION_STRING="AccountEndpoint=https://...;AccountKey=...;"
```

Then install and start:

```bash
npm install
npm run dev
```

The app runs at **http://localhost:3000** (single server, no second terminal needed).

> Note: Easy Auth is not active locally. The app runs without authentication.

---

## Deploying to Azure

### Build and push a new Docker image

```bash
az acr build --registry <your-registry> --image monthly-budget-app:vX .
```

Replace `vX` with the next version number (e.g. `v2`).

### Update the running container

```bash
az containerapp update \
  --name <your-container-app> \
  --resource-group <your-resource-group> \
  --image <your-registry>.azurecr.io/monthly-budget-app:vX
```

---

## How the App Works

```
Browser
  ↓  loads the page
Express (server.js)  →  serves the built React app (dist/)
  ↓  React runs in browser
React (App.jsx)  →  GET /budget  →  Express  →  Cosmos DB  (load data)
React (App.jsx)  →  POST /budget →  Express  →  Cosmos DB  (save changes)
```

Data is stored as a single JSON document in Cosmos DB, keyed by `id: "budget"`. All months are stored together in that one document.

---

## Key Notes

- **Helmet** is configured with `referrerPolicy: { policy: "same-origin" }` — required for Azure Easy Auth to accept POST requests (default `no-referrer` causes 403 errors)
- **Cosmos DB free tier**: 1000 RU/s, 25 GB — sufficient for personal use
- **Auto-sync**: the app polls Cosmos DB every 30 seconds and on tab visibility change, so changes made on one device appear on another without a manual refresh
