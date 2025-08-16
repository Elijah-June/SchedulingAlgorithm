# Priority Scheduling Visualizer

A small React + Vite app that visualizes Priority Scheduling (preemptive & non-preemptive) with animated Gantt chart.

Setup

1. npm install
2. npm run dev

Running locally (Windows PowerShell)

1. Open PowerShell and navigate to the project folder:

```powershell
cd C:\Users\Elijah\Desktop\SchedulingAlgorithm
```

2. Install dependencies (if not already):

```powershell
npm install
```

3. Start the dev server:

```powershell
npm run dev
```

4. Vite will show a local URL like http://localhost:5173 — open it in your browser.

Troubleshooting

- If you get an ESM plugin error, ensure `vite.config.mjs` is present and `type` is set to `module` in `package.json` (already configured in this project).
- If the terminal shows the server but you can't reach localhost, check Windows Firewall or try a different port: `npm run dev -- --port 3000`.
- If Tailwind directives show unknown-at-rule in some editors, ensure PostCSS/Tailwind are installed and the build runs — the dev server will process them.


The app supports:
- Add processes with Arrival, Burst, Priority
- Toggle Preemptive/Non-preemptive
- Animated Gantt chart (Framer Motion)
- Export results to CSV
- Responsive layout
