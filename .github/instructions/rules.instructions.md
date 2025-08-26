---
applyTo: '**'
---
# Project Coding Guidelines

Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

1. **Project Structure**  
   - Organize files by feature/domain (e.g., `features/chat`, `features/auth`).
   - Separate components, services, types, and utilities into their respective folders.
   - Keep UI, business logic, and API logic isolated.

2. **Coding Standards**  
   - Follow consistent naming conventions and file organization.
   - Avoid magic numbers, hardcoded strings, and commented-out code.
   - Write clean, maintainable, and readable code.

3. **Type Safety**  
   - Use TypeScript everywhere; avoid using `any`.
   - Define pure, reusable types and interfaces in dedicated `types` files.
   - Ensure all API responses and Redux state are strongly typed.

4. **API Integration**  
   - Use Axios for all HTTP requests.
   - Centralize Axios configuration (base URL, interceptors, etc.) in a single file.
   - Implement JWT authentication with access and refresh tokens.
   - Store tokens securely (prefer HttpOnly cookies for refresh tokens).
   - For API structure reference Look in 'packages/api' folder.
   - Implement automatic token refresh logic using Axios interceptors.
   - Handle API errors gracefully and provide user feedback.

5. **State Management**  
   - Use Redux Toolkit (RTK) for global state management.
   - Structure slices by feature and colocate selectors, actions, and reducers.
   - Use RTK Query for API data fetching and caching.
   - Avoid legacy Redux patterns.

6. **Testing**  
   - Do not generate test files unless requested.
   - Ensure all new code is robust and maintainable.

7. **Documentation**  
   - Use code comments and JSDoc for public functions, components, and types.
   - Do not generate README files unless requested.
   - Comment complex logic for clarity.

8. **Collaboration**  
   - Communicate changes clearly in PRs and commit messages.
   - Seek feedback for significant changes or new patterns.
   - Follow code review best practices and address feedback promptly.

---
**Summary:**  
Maintain a clean, scalable, and type-safe codebase using RTK, Axios, and TypeScript. Prioritize security (JWT, refresh tokens), clean UI, and robust error handling. Avoid shortcuts and rough code; always write maintainable and well-documented code. Do not generate README or test files unless
