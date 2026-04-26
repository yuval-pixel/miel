# Miel

A premium real-time local deals app for Williamsburg, Greenpoint, and Bushwick.

## Importing to Lovable

1. Create a new GitHub repo (github.com → New → Repository)
2. Upload all files from this folder maintaining the exact structure:

```
miel/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── index.css
    └── App.jsx
```

3. Go to lovable.dev → New Project → Import from GitHub
4. Connect the repo — Lovable will detect the Vite + React structure automatically
5. Done. The app will build and run exactly as designed.

## Local development

```bash
npm install
npm run dev
```

## Stack

- React 18
- Vite
- Tailwind CSS 3
- lucide-react (icons)
- No other dependencies
