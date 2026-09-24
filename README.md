# Mini Apps

Three tiny, single-file web apps. No install, no build — open the HTML file in a browser and use it. All state lives in your browser's `localStorage`.

## Apps

| App | File | What it does |
| --- | --- | --- |
| 📋 **1‑3‑5 Planner** | [`planner.html`](planner.html) | Plan a realistic day: one big task, three medium, five small. A progress ring tracks completion. Auto-saves. |
| 🌀 **Kaleido Pad** | [`kaleido.html`](kaleido.html) | Draw on a canvas and watch it mirror in N-fold symmetry. Adjustable slices, brush size, and hue drift. Export the result as PNG. |
| 🐍 **Snake** | [`snake.html`](snake.html) | The classic. Arrow keys / WASD / swipe to steer. Speeds up as you grow. High score is saved. |

Start from [`index.html`](index.html), which links to all three.

## Run locally

Just open any file directly:

```
start index.html
```

Or serve the folder if your browser restricts `file://` features:

```
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Tech

Plain HTML, CSS, and vanilla JavaScript — one self-contained file per app, no dependencies.
