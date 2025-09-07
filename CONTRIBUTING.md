# Contributing to Leap.new Open Source

Thank you for your interest in contributing to Leap.new Open Source! This document provides guidelines and instructions for contributing to the project.

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and constructive in all interactions.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/leap-new-open-source.git
   cd leap-new-open-source
   ```
3. **Set up the development environment** (see README.md)
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🛠️ Development Guidelines

### Code Style

- **TypeScript**: Use strict TypeScript with proper type annotations
- **Formatting**: Code is automatically formatted with Prettier
- **Linting**: Follow ESLint rules (run `npm run lint`)
- **Naming**: Use descriptive variable and function names

### Backend Services (Encore.ts)

- Each service should be self-contained with clear responsibilities
- Use proper error handling with `APIError`
- Include comprehensive JSDoc comments for all API endpoints
- Write database migrations instead of modifying existing ones
- Use TypeScript interfaces for all API request/response schemas

### Frontend (React + TypeScript)

- Use functional components with hooks
- Implement proper error boundaries
- Use TypeScript for all components and utilities
- Follow component composition patterns
- Use Tailwind CSS for styling (avoid custom CSS when possible)

### Testing

- Write unit tests for all business logic
- Include integration tests for API endpoints
- Add E2E tests for critical user flows
- Ensure all tests pass before submitting PR

## 📝 Pull Request Process

1. **Update documentation** if you're changing functionality
2. **Add/update tests** for your changes
3. **Ensure CI passes** (tests, linting, type checking)
4. **Write clear commit messages** following conventional commits:
   ```
   feat: add new code generation templates
   fix: resolve database connection timeout
   docs: update API documentation
   test: add unit tests for notes service
   ```
5. **Create a detailed PR description** including:
   - What changes were made
   - Why the changes were necessary
   - How to test the changes
   - Any breaking changes

## 🏗️ Architecture Considerations

### Adding New Services

When adding a new microservice:

1. Create service directory: `backend/your-service/`
2. Add `encore.service.ts` file
3. Implement API endpoints in separate files
4. Add database migrations if needed
5. Update API Gateway routes
6. Add service to event bus if needed
7. Update frontend client integration

### Database Changes

- Always create new migration files
- Never modify existing migrations
- Use descriptive migration names
- Test migrations on sample data

### Event System

- Use pub/sub for loose coupling between services
- Design events with backward compatibility
- Include proper event versioning
- Document event schemas

## 🐛 Bug Reports

When filing bug reports, please include:

- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Environment details** (OS, Node version, etc.)
- **Screenshots or logs** if applicable

## 💡 Feature Requests

For feature requests:

- **Describe the use case** and problem being solved
- **Provide examples** of how the feature would be used
- **Consider backward compatibility**
- **Discuss architectural impact**

## 🔧 Development Setup Issues

If you encounter setup issues:

1. Check that you have the required Node.js version
2. Ensure Encore CLI is properly installed
3. Verify environment variables are set correctly
4. Check our [GitHub Discussions](../../discussions) for common issues

## 📚 Documentation

Help improve our documentation:

- Fix typos and unclear explanations
- Add examples and use cases
- Update outdated information
- Translate documentation (future)

## 🎯 Good First Issues

Look for issues labeled `good first issue` or `help wanted` for beginner-friendly contributions.

## 📞 Getting Help

- **GitHub Discussions**: For questions and general discussion
- **GitHub Issues**: For bug reports and feature requests
- **Discord/Slack**: [Community chat link if available]

## 🙏 Recognition

Contributors will be recognized in:

- Project README
- Release notes
- Annual contributor highlights

Thank you for contributing to making Leap.new Open Source better! 🚀
