# Repo Manager

A powerful tool for managing repository access and contributors with time-limited permissions.

## Features

- **Time-Limited Access**: Set expiration dates for contributors and automatically revoke access when time is up.
- **Group Management**: Organize contributors into groups with shared permissions and expiration dates.
- **Invite Tokens**: Generate QR codes and shareable links for seamless GitHub integration.
- **GitHub Integration**: Users authenticate with their GitHub accounts for a streamlined experience.

## Use Cases

- **Educational Environments**: Give students access to repositories only for the duration of a course or assignment.
- **Temporary Collaborations**: Manage access for short-term contractors or external collaborators.
- **Team Projects**: Organize team members into logical groups with appropriate access levels.
- **Open Source Management**: Streamline contributor onboarding with self-service access via tokens.

## Setup

Make sure to install dependencies:

```bash
yarn install
```

## Environment 

Create a .env file from .env.example

## Prepare Prisma

Makes sure the database is initialized and hooks are created

```bash
yarn zen-push
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
yarn dev
```

## Production

Build the application for production:

```bash
yarn build
```

Locally preview production build:

```bash
yarn preview
```

## Technologies

- **Nuxt 3 & Vue 3**  
  Built with Nuxt.js, leveraging the power of Vue 3, for a modern, performant, and responsive user interface.

- **TypeScript**  
  Ensures robust, type-safe development across the entire codebase.

- **Pinia**  
  Provides state management optimized for Vue 3 applications.

- **Prisma ORM**  
  Manages database access with a type-safe and efficient ORM for Node.js and TypeScript.

- **ZenStack**  
  Offers advanced backend policy, data validation, and security layers on top of Prisma.

- **GitHub API (Octokit)**  
  Integrates authentication and repository management directly with the GitHub platform.

- **nuxt-auth-utils**  
  Simplifies authentication flows and secure user sessions.

- **@tanstack/vue-query**  
  Manages data fetching, caching, and synchronization between client and server.

- **Zod**  
  Provides schema-based data validation for API requests and responses.

- **Containerization (Docker Compose)**  
  Enables streamlined deployment and development using containerized services.

- **Croner**  
  Schedules and manages background jobs and periodic tasks.

- **Code Quality Tools**  
  Utilizes ESLint, Prettier, and Stylelint for consistent and maintainable code style and formatting.

- **SCSS/Sass & PostCSS**  
  Enhances and processes stylesheets for maintainable and scalable design.

- **Testing & Type Checking**  
  Employs vue-tsc and typescript-eslint for rigorous type safety and linting in development.

Check out the [Nuxt documentation](https://nuxt.com/docs/getting-started/deployment) for more deployment information.