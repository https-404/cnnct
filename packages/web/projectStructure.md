# Vite + React + Redux Project Structure

```
/project-root
│
├── public/                  # Static assets (favicon, images, etc.)
│
├── src/
│   ├── assets/              # Images, fonts, static files
│   ├── components/          # Reusable UI components
│   ├── features/            # Redux feature folders (slice, components, logic per feature)
│   │   └── chat/
│   │       ├── ChatSlice.ts # Redux slice for chat
│   │       ├── Chat.tsx     # Feature-specific component
│   │       └── ...          
│   ├── app/
│   │   ├── store.ts         # Redux store setup
│   │   └── hooks.ts         # Typed Redux hooks (useAppDispatch, useAppSelector)
│   ├── pages/               # Top-level route components (pages)
│   ├── routes/              # Route definitions (React Router, etc.)
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions/helpers
│   ├── types/               # TypeScript types/interfaces
│   ├── styles/              # Global styles (CSS, SCSS, etc.)
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point (renders App)
│
├── .env                     # Environment variables
├── index.html               # Main HTML file
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

- Use `features/` for Redux slices and feature-specific logic/components.
- `app/store.ts` for store configuration, `app/hooks.ts` for typed hooks.
- `components/` for shared, reusable UI.
- `pages/` for route-level components.
- `routes/` for route definitions if using React Router.
- `hooks/` for custom hooks, `utils/` for helpers, `types/` for global types.
- Keep `App.tsx` and `main.tsx` minimal.
