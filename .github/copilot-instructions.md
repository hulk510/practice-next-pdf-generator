
# Project Documentation

## 1. Current Tech Stack

- **Frontend**: React (Next.js, App Router)
- **Server-side**: Next.js Server Actions, API Routes
- **Deployment**: Vercel
- **Styling**: Tailwind CSS and shadcn/ui
- **Package Manager**: pnpm
- **Test**: Vitest and testing-library/react
- **CI/CD**: GitHub Actions
- **Form Handling**: React Hook Form

*Version is always the latest stable version.*

---

## 2. Component and Code Guidelines

- Always add code comments.

### a. React Component Guidelines

- Use TypeScript for all components.
- Avoid using the `any` type.
- Do not type components as `React.FC`.
- Use `function` instead of `const` when defining components.
- Follow the **Composable Pattern** of React for flexibility and reusability.

### b. Hooks and State Management

- Minimize the use of `useState` and `useEffect`.
- Prefer computed state or encapsulated logic through custom hooks.
- Use `useMemo` and `useCallback` to prevent unnecessary renders when appropriate.
- Create custom hooks to encapsulate grouped logic.
- For reusable components and components deemed generic, please separate them into their own components.
- Additionally, for shared components that can be used in other projects, define them as components within the /packages folder.

### c. Server and Data Handling

- Use server components where possible; otherwise, create client components.
- Use Suspense and streaming for improved loading performance.
- For data mutation:
  - Accept server actions as props where feasible.
  - Otherwise, use `fetch` and an API route handler.
  - Use `useActionState` where possible to manage server state.
- Validate inputs using `zod` in server actions and API endpoints.

### d. Higher-Order Components

- Use higher-order components (HOCs) for adding functionalities that are decoupled from the core component.

### f. File Organization

- Combine related components, hooks, and utility functions in the same file when it makes sense for better reusability and distribution.

### g. Text Content

- Always HTML-escape text content to prevent XSS vulnerabilities.

---

## 3. Constraints and Expected Format

### a. Technology-Specific Requirements

- Use Next.js Server Actions for server-side logic, and API Routes for handling API requests.
- Follow Tailwind CSS and shadcn/ui conventions for styling.
- Use Tailwind CSS and shadcn/ui for styling all UI components.
- Ensure designs are responsive and follow accessibility best practices.

### b. Separation of Business Logic

- All business logic should be extracted into the `services` directory to keep the server-side code maintainable and modular.
- Organize each business domain into separate files (e.g., `userService.ts`, `productService.ts`) and encapsulate related logic.
- Keep business logic reusable and testable by minimizing dependencies:
  - Accept only necessary data as function arguments.
  - Avoid directly handling request/response objects inside business logic.

### c. Test

- Use placeholder data where necessary to simulate functionality.
- Use Vitest and testing-library/react for testing.
- Write tests for all components, hooks, and server actions.
- Ensure tests cover all possible use cases and edge cases.
