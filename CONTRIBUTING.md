# Contributing to Open Space Platform

Thanks for your interest in contributing to Open Space Platform! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/YOUR-USERNAME/open-space-platform.git
```
3. Install dependencies:
```bash
pnpm install
```
4. Create a `.env` file based on `.env.example`
5. Set up the database:
```bash
pnpm prisma migrate dev
```
6. Start the development server:
```bash
pnpm dev
```

## Pull Request Process

1. Create a new branch for your feature/fix
2. Make your changes
3. Write/update tests if needed
4. Ensure your code follows our style guidelines
5. Update documentation as needed
6. Submit a pull request

## Code Style

- Use TypeScript
- Format with Prettier
- Follow ESLint rules
- Write meaningful commit messages

## Need Help?

- Create an issue for bugs
- Ask questions in Discussions
- Follow our Code of Conduct
