# Recommended Node.js Backend Project Structure

```
/project-root
│
├── src/
│   ├── config/         # Configuration files (env, db, etc.)
│   ├── controllers/    # Route controllers (business logic)
│   ├── routes/         # API route definitions
│   ├── models/         # Database models (ORM/ODM schemas)
│   ├── services/       # Business/domain services
│   ├── middlewares/    # Express/Koa middlewares
│   ├── utils/          # Utility/helper functions
│   ├── jobs/           # Scheduled jobs or workers
│   ├── app.js          # Express/Koa app setup
│   └── server.js       # Entry point (starts the server)
│
├── tests/              # Unit and integration tests
├── .env                # Environment variables
├── .gitignore
├── package.json
└── README.md
```

**Key points:**
- Keep business logic in `services/`, not controllers.
- Use `config/` for all configuration and secrets (never hardcode).
- Place reusable code in `utils/`.
- Separate route definitions from controllers.
- Use `models/` for database schemas (e.g., Mongoose, Prisma, Sequelize).
- Add `middlewares/` for authentication, error handling, etc.
- Keep the entry point (`server.js`) minimal.

This structure is flexible and works for most Node.js backends, including REST and GraphQL APIs.
