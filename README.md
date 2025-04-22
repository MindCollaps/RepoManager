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

- Built with Nuxt.js for a modern, responsive user interface
- Leverages GitHub API for authentication and repository management
- Features Apple-inspired design with smooth animations and parallax effects

Check out the [Nuxt documentation](https://nuxt.com/docs/getting-started/deployment) for more deployment information.
