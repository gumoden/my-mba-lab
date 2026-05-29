# To-Do App

A simple to-do list web application built with HTML, CSS, JavaScript and Node.js. Tasks are saved to a local JSON file so they persist between sessions.

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
cd my-mba-lab/web-architecture/to-do-app
```

Or download the ZIP from GitHub and extract it.

### 2. Install dependencies

Inside the `to-do-app` folder, run:

```bash
npm install
```

This downloads Express, the only dependency the app needs.

### 3. Start the server

```bash
node server.js
```

You should see:

```
Server running at http://localhost:3000
```

### 4. Open the app

Open your browser and go to:

```
http://localhost:3000
```

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

## Stopping the server

Press `Ctrl+C` in the terminal where the server is running.

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
to-do-app/
├── server.js        — Express backend, handles API and serves the app
├── clean-db.js      — Terminal script to clean the database
├── tasks.json       — Database file (auto-created on first save)
├── index.html       — App layout
├── todo.css         — Styling
└── js/
    ├── utils.js     — Helper functions (date formatting, overdue check)
    ├── state.js     — Data arrays
    ├── api.js       — Communication with the server
    ├── render.js    — Draws the UI
    └── actions.js   — User actions (add, delete, complete, etc.)
```
