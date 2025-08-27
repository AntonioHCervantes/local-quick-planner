# Local Quick Planner

Local Quick Planner is a simple, fast, and free tool to organize your tasks and boost your productivity. It's a lightweight, Microsoft Planner-style board that runs entirely in your browser. 

Your privacy is paramount: all data is stored locally in your browser's `localStorage`, ensuring your tasks stay on your machine.

## ✨ Features

- **Two distinct views**: Manage your daily priorities with the **My Day** view (To Do, In Progress, Done) and organize your project workflow with the **My Tasks** Kanban board (Ideas, Backlog, In Progress, Done).
- **Drag & Drop**: Intuitively move tasks between columns.
- **Persistent State**: Your board is automatically saved, so your tasks are there when you come back.
- **Data Portability**: Easily export your entire board to a JSON file for backup or import it on another device.
- **Privacy-focused**: No sign-up required and all data stays on your local machine.

## 🛠️ Tech Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS for styling
- Zustand for lightweight state management
- dnd-kit for accessible drag and drop functionality

## 🚀 Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/local-quick-planner.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

Then open http://localhost:3000 in your browser.

## 📱 PWA Icons

Binary icons are omitted from the repository. Create the following PNG files in the `public/` directory before building to enable proper installation and splash screens:

- `icon-192.png` — 192×192, maskable
- `icon-512.png` — 512×512, maskable

The 192px icon also serves as the Apple touch icon. Both files are referenced by `public/manifest.webmanifest` and `app/layout.tsx`.

## 🤝 Contributing

Contributions are welcome! Please see the [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Code of Conduct

This project and everyone participating in it is governed by a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior.

