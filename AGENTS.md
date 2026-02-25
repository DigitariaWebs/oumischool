# AGENTS.md - Mobile Development Guidelines

## Project Overview

This is an **Expo** React Native mobile application. The project uses **Bun** as the package manager.

## Build / Lint / Test Commands

```bash
# Development
bun run start           # Start Expo Metro bundler
bun run web            # Run in browser

# Platform-specific
bun run android        # Build/run on Android
bun run ios            # Build/run on iOS

# Linting & Formatting
bun run lint           # Run Expo lint
bun run format:check  # Check formatting without writing
```

> **Note:** Do not write tests unless explicitly requested by the user.

## Code Style Guidelines

### General Conventions

- **Package Manager**: Always use `bun` (not npm/yarn/pnpm)
- **No Comments**: Do not add comments unless explaining complex business logic
- **Strict TypeScript**: Enabled in tsconfig.json

### Imports

- Sort imports automatically via ESLint/Prettier
- Group order: React imports, external libs, internal imports

### Naming Conventions

- **Components**: PascalCase (e.g., `Button.tsx`, `HomeScreen.tsx`)
- **Hooks**: camelCase starting with `use` (e.g., `useAuth`, `useStudents`)
- **Files**: kebab-case for utilities (e.g., `api-client.ts`, `utils.ts`)
- **Interfaces/Types**: PascalCase
- **Variables/Functions**: camelCase

### Navigation

- Use `expo-router` (file-based routing)
- Configure navigation in `app/` directory

### State Management

- **Server State**: TanStack Query (`@tanstack/react-query`)
- **Client State**: Redux Toolkit (`@reduxjs/toolkit`)

### UI Components

- Use `lucide-react-native` for icons
- Use Expo ecosystem packages (expo-blur, expo-image, etc.)

### Error Handling

- Display errors via toast/alert components
- Use try/catch for async operations

### Project Structure

```
app/                   # expo-router pages
src/
├── components/        # Reusable components
├── hooks/            # Custom hooks
├── lib/              # Utilities and API client
├── store/            # Redux stores
└── types/            # TypeScript types
```
