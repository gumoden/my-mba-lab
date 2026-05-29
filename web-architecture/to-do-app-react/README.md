# To-Do App (React)

A to-do list web application built with React and Node.js. This is the React version of the vanilla JS to-do app, with the same features but built using modern frontend architecture.

## Features

- Add tasks with a due date and priority (Low / Medium / High)
- Mark tasks as complete — they move to a Completed section
- Edit tasks inline
- Delete tasks — they move to a Deleted section and can be restored
- Archive completed tasks — viewable anytime via View Archive
- Overdue tasks are highlighted in red
- Send your task list by email
- Clean up the database via terminal script

---

## Requirements

You need **Node.js** installed on your computer.

### How to install Node.js

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS** version (recommended for most users)
3. Run the installer and follow the steps
4. Verify the installation by opening a terminal and running:

```bash
node --version
```

You should see a version number like `v20.x.x`.

---

## Getting started

### 1. Download or clone the project

If you have Git installed:

```bash
git clone https://github.com/gumoden/my-mba-lab.git
cd my-mba-lab/web-architecture/to-do-app-react
```

Or download the ZIP from GitHub and extract it.

### 2. Install dependencies

Inside the `to-do-app-react` folder, run:

```bash
npm install
```

This downloads Express, React, Vite and all other dependencies.

### 3. Start the app

This app requires **two terminals running at the same time**.

**Terminal 1 — start the API server:**

```bash
node server.js
```

You should see:

```
Server running at http://localhost:3000
```

**Terminal 2 — start the React frontend:**

```bash
npm run dev:ui
```

You should see something like:

```
VITE ready in 300ms
➜ Local: http://localhost:5173/
```

### 4. Open the app

Open your browser and go to:

```
http://localhost:5173
```

> Note: use port **5173**, not 3000. Port 3000 is the API only.

---

## How to use

| Action | How |
|---|---|
| Add a task | Type a name, pick a date and priority, click **Add** or press **Enter** |
| Complete a task | Click the **✓** button on the task |
| Edit a task | Click the **✎** button, make changes, press **Enter** or click **Save** |
| Delete a task | Click the **✕** button — task moves to Deleted |
| Restore a deleted task | Click **Restore** in the Deleted section |
| Purge deleted tasks | Click **Purge All** in the Deleted section |
| Archive completed tasks | Click **Archive All** in the Completed section |
| View archived tasks | Click **View Archive** |
| Send list by email | Click **Send list by Email** — opens your default email app |

---

## Stopping the app

- Press `Ctrl+C` in Terminal 1 to stop the API server
- Press `Ctrl+C` in Terminal 2 to stop the React frontend

---

## Cleaning the database

To clear tasks from the database without opening the app, run:

```bash
node clean-db.js
```

Follow the on-screen prompts to choose what to clear.

---

## Project structure

```
to-do-app-react/
├── server.js          — Express backend, handles API (port 3000)
├── clean-db.js        — Terminal script to clean the database
├── tasks.json         — Database file (auto-created on first save)
├── vite.config.js     — Vite configuration, proxies API to Express
├── index.html         — App entry point
└── src/
    ├── main.jsx       — Renders the React app into the page
    ├── App.jsx        — Root component, holds all state and data logic
    ├── utils.js       — Helper functions (date formatting, overdue check)
    ├── index.css      — Styling
    └── components/
        ├── TaskList.jsx        — To-do list and input form
        ├── TaskItem.jsx        — Individual task row with edit mode
        ├── CompletedList.jsx   — Completed tasks section
        ├── ArchivedSection.jsx — Archive viewer
        └── DeletedList.jsx     — Deleted tasks section
```

---

## Difference from the vanilla JS version

| Vanilla JS version | React version |
|---|---|
| All logic in plain `.js` files | UI split into reusable components |
| DOM updated manually | React updates the page automatically when data changes |
| Single server on port 3000 | API on port 3000 + Vite dev server on port 5173 |
| No build step needed | Requires `npm run dev:ui` to start the frontend |
