# Chat App Monorepo

This is the monorepo for your chat app, managed with [pnpm workspaces](https://pnpm.io/workspaces) and [Nx](https://nx.dev/).

## Packages

- **api**: Node.js Express backend (`packages/api`)
- **web**: React frontend with Vite (`packages/web`)
- **shared-types**: Shared TypeScript types (`packages/shared-types`)

## Getting Started

1. **Install all dependencies:**
   ```sh
   pnpm install
   ```

2. **Run all apps in development mode (with hot reload):**
   ```sh
   pnpm dev
   ```

3. **Run only the API (hot reload):**
   ```sh
   pnpm dev:api
   ```

4. **Run only the Web frontend (hot reload):**
   ```sh
   pnpm dev:web
   ```

5. **Build all apps:**
   ```sh
   pnpm build
   ```

6. **Build only API or Web:**
   ```sh
   pnpm build:api
   pnpm build:web
   ```

7. **Preview production build of Web:**
   ```sh
   pnpm preview:web
   ```

8. **Lint Web app:**
   ```sh
   pnpm lint:web
   ```

## Installing Packages

- To add a package to a specific workspace:
  ```sh
  pnpm add <package> --filter ./packages/<workspace>
  ```
  Example:
  ```sh
  pnpm add axios --filter ./packages/web
  pnpm add cors --filter ./packages/api
  ```

- To add a devDependency:
  ```sh
  pnpm add -D <package> --filter ./packages/<workspace>
  ```

## Hot Reload

- **API**: Uses `ts-node-dev` for hot reload. Edit files in `packages/api/src` and the server will restart automatically.
- **Web**: Uses Vite's hot module replacement (HMR). Edit files in `packages/web/src` and the browser will update instantly.

## More Useful Commands

- **Install dependencies for a single package:**
  ```sh
  pnpm install --filter ./packages/api
  pnpm install --filter ./packages/web
  pnpm install --filter ./packages/shared-types
  ```

- **Add a package using root scripts:**
  ```sh
  PKG=axios pnpm run add:web
  PKG=cors pnpm run add:api
  ```

---

For more, see the scripts in the root `package.json` and each package's own scripts.
