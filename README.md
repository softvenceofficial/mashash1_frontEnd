# React TypeScript Vite Boilerplate

A professional, production-ready boilerplate for building modern React applications with TypeScript and Vite. This template provides an optimized development environment with hot module replacement, strict TypeScript checking, and best practices for code organization.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Building for Production](#building-for-production)
- [Technology Stack](#technology-stack)
- [Available Scripts](#available-scripts)
- [ESLint Configuration](#eslint-configuration)
- [Folder Structure](#folder-structure)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Routing](#routing)
- [Styling](#styling)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- ⚡ **Lightning Fast HMR**: Instant feedback with Vite's Hot Module Replacement
- 📦 **Optimized Build**: Production-ready builds with automatic optimizations
- 🎯 **Type Safety**: Full TypeScript support with strict type checking
- 🧪 **Testing Ready**: Preconfigured testing environment
- 🎨 **Modern Styling**: CSS-in-JS or CSS Modules ready
- 📱 **Responsive Design**: Mobile-first approach
- 🔧 **Developer Experience**: ESLint, Prettier, and VS Code settings preconfigured
- 🌙 **Dark Mode**: Built-in theme switching capabilities
- 📈 **Performance**: Code splitting, lazy loading, and optimization techniques
- 🛡️ **Security**: Best practices for secure React development

## Project Structure

```
src/
├── assets/           # Static assets (images, icons, svgs)
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── layouts/          # Page layouts and templates
├── lib/              # Utility functions and libraries
├── pages/            # Page components
├── providers/        # React context providers
├── redux/            # Redux store, slices, and API endpoints
├── routes/           # Application routing configuration
├── theme/            # Theme configuration and constants
├── types/            # TypeScript type definitions
└── utils/            # Helper functions
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn or pnpm or bun package manager

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-name>
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn add
   # or
   pnpm install
   # or
   bun install
   ```

### Development

Start the development server with hot reloading:

```bash
npm run dev
# or
yarn dev
# or
yarn dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` by default.

### Building for Production

Create a production build:

```bash
npm run build
# or
yarn build
# or
pnpm run build
# or
bun run build
```

Preview the production build locally:

```bash
npm run preview
# or
yarn preview
# or
pnpm run preview
# or
bun run preview
```

## Technology Stack

- **React 18**: Latest React features including hooks and concurrent mode
- **TypeScript**: Strongly typed programming language that builds on JavaScript
- **Vite**: Next generation frontend tooling with fast cold starts
- **React Router v6**: Declarative routing for React applications
- **Redux Toolkit**: Opinionated Redux setup with best practices
- **Tailwind CSS** (if applicable): Utility-first CSS framework
- **ESLint**: Pluggable JavaScript linter
- **Prettier**: Opinionated code formatter
- **Vitest**: Blazing fast unit test framework powered by Vite

## Available Scripts

- `dev`: Starts the development server
- `build`: Creates a production build
- `preview`: Previews the production build locally
- `lint`: Runs ESLint on the codebase
- `lint:fix`: Runs ESLint and automatically fixes issues
- `format`: Formats code with Prettier
- `test`: Runs unit tests
- `test:watch`: Runs unit tests in watch mode

## ESLint Configuration

This boilerplate comes with a comprehensive ESLint configuration that includes TypeScript-aware linting rules. The configuration is set up to provide:

- Type-aware lint rules for better TypeScript integration
- React-specific linting rules
- Stylistic rules for consistent code formatting

### Enabling Strict Type Checking

For production applications, we recommend enabling strict type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
```

### React-Specific Lint Rules

Install additional plugins for React-specific linting:

```bash
npm install eslint-plugin-react-x eslint-plugin-react-dom --save-dev
```

Then configure in your `eslint.config.js`:

```js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
```

## Folder Structure

### `src/assets/`

Contains all static assets including images, icons, and SVG files. Assets are organized in subdirectories for better maintainability.

### `src/components/`

Reusable UI components that can be used across different parts of the application. Components are organized by functionality.

### `src/hooks/`

Custom React hooks that encapsulate reusable logic and state management patterns.

### `src/layouts/`

Page layout components that define the overall structure of different sections of the application.

### `src/lib/`

Utility libraries and helper functions that are used across the application.

### `src/pages/`

Page-level components that represent individual routes in the application. Each page component is responsible for rendering the content of a specific route.

### `src/providers/`

React context providers that manage global state and provide it to components down the tree.

### `src/redux/`

Redux store configuration, slices for state management, and API endpoints for data fetching.

### `src/routes/`

Application routing configuration that defines the mapping between URLs and components.

### `src/theme/`

Theme configuration including color palettes, typography, and other design system variables.

### `src/types/`

TypeScript type definitions that are used across the application.

### `src/utils/`

Helper functions and utility modules that provide common functionality.

## Component Architecture

The boilerplate follows a component-driven architecture with the following principles:

1. **Atomic Design**: Components are organized from atoms to molecules to organisms
2. **Reusability**: Components are designed to be reusable across the application
3. **Composition**: Complex components are built by composing simpler ones
4. **Separation of Concerns**: Logic, presentation, and styling are separated appropriately

## State Management

State management is handled through a combination of:

1. **React Context API**: For global state that doesn't require complex logic
2. **Redux Toolkit**: For complex state management needs with predictable state transitions
3. **React Hooks**: For local component state

## Routing

The application uses React Router v6 for client-side routing. Routes are defined in the `src/routes/` directory and follow the latest best practices for route configuration.

## Styling

Styling approaches can include:

1. **CSS Modules**: For component-scoped styling
2. **Tailwind CSS**: For utility-first styling (if configured)
3. **Styled Components**: For CSS-in-JS approach (if configured)
4. **Traditional CSS**: With proper naming conventions

## Testing

The boilerplate is configured with Vitest for unit testing. Tests should be colocated with the components they test and follow the naming convention `*.test.tsx`.

## Deployment

The application can be deployed to various platforms:

- **Vercel**: Direct deployment with zero configuration
- **Netlify**: Drag and drop or Git integration
- **GitHub Pages**: Using the gh-pages package
- **Traditional Hosting**: Upload the `dist/` folder to any static hosting service

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using React, TypeScript, and Vite
