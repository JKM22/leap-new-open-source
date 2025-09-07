# Contributing to Leap.new Open Source

Thank you for your interest in contributing to Leap.new Open Source! This document provides comprehensive guidelines for contributing to the project.

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Encore CLI: `curl -L https://encore.dev/install.sh | bash`
- Git

### Development Setup

1. **Fork and clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/leap-new-open-source.git
cd leap-new-open-source
```

2. **Set up development environment**
```bash
make dev
```

3. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

## 🛠️ Development Guidelines

### Code Style

We use automated tools to maintain consistent code style:

- **TypeScript**: Strict TypeScript with proper type annotations
- **Prettier**: Automatic code formatting
- **ESLint**: Linting for TypeScript/JavaScript
- **Imports**: Use absolute imports where possible

#### Backend (Encore.ts)

- Each service should be self-contained with clear responsibilities
- Use proper error handling with `APIError`
- Include comprehensive JSDoc comments for all API endpoints
- Write database migrations instead of modifying existing ones
- Use TypeScript interfaces for all API request/response schemas

#### Frontend (React + TypeScript)

- Use functional components with hooks
- Implement proper error boundaries
- Use TypeScript for all components and utilities
- Follow component composition patterns
- Use Tailwind CSS for styling (avoid custom CSS when possible)
- Ensure accessibility with proper ARIA labels and keyboard navigation

### Testing Requirements

All contributions must include appropriate tests:

- **Unit Tests**: For all business logic
- **Integration Tests**: For API endpoints
- **Frontend Tests**: For React components
- **E2E Tests**: For critical user flows (when applicable)

#### Running Tests

```bash
# Run all tests
make test

# Backend tests only
encore test

# Frontend tests only
cd frontend && npm test

# Tests with coverage
npm run test:coverage
```

#### Writing Tests

**Backend Example:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createNote } from './create';

describe('createNote', () => {
  beforeEach(async () => {
    // Setup test data
  });

  it('should create a note successfully', async () => {
    const result = await createNote({
      title: 'Test Note',
      body: 'Test content'
    });
    
    expect(result.title).toBe('Test Note');
    expect(result.id).toBeDefined();
  });
});
```

**Frontend Example:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { PromptBox } from '../PromptBox';

describe('PromptBox', () => {
  it('should submit prompt on button click', () => {
    const onSubmit = vi.fn();
    render(<PromptBox onSubmit={onSubmit} />);
    
    fireEvent.click(screen.getByText('Generate App'));
    expect(onSubmit).toHaveBeenCalled();
  });
});
```

### Commit Message Standards

We follow [Conventional Commits](https://conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(codegen): add support for Vue.js templates
fix(notes): resolve database connection timeout
docs(api): update GraphQL schema documentation
test(auth): add unit tests for JWT validation
```

## 📝 Pull Request Process

### Before Submitting

1. **Update documentation** if you're changing functionality
2. **Add/update tests** for your changes
3. **Ensure CI passes** (tests, linting, type checking)
4. **Test locally** with `make test`
5. **Update CHANGELOG.md** if applicable

### PR Requirements

Your pull request should include:

- **Clear title and description** following our template
- **Link to related issues** if applicable
- **Screenshots/GIFs** for UI changes
- **Breaking changes** clearly documented
- **Performance impact** assessment for significant changes

### PR Template

```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] E2E tests pass (if applicable)

## Screenshots (if applicable)
Add screenshots or GIFs demonstrating the changes.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

## 🏗️ Architecture Guidelines

### Adding New Services

When adding a new microservice:

1. Create service directory: `backend/your-service/`
2. Add `encore.service.ts` file
3. Implement API endpoints in separate files
4. Add database migrations if needed
5. Update API Gateway routes
6. Add service to event bus if needed
7. Update frontend client integration
8. Add comprehensive tests
9. Update documentation

### Database Changes

- **Always create new migration files**
- **Never modify existing migrations**
- **Use descriptive migration names**
- **Test migrations on sample data**
- **Include both up and down migrations**

Example migration:
```sql
-- 001_add_user_preferences.up.sql
CREATE TABLE user_preferences (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  theme TEXT DEFAULT 'dark',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
```

### Event System

- Use pub/sub for loose coupling between services
- Design events with backward compatibility
- Include proper event versioning
- Document event schemas
- Handle event delivery failures gracefully

## 🐛 Bug Reports

When filing bug reports, please include:

- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Environment details** (OS, Node version, etc.)
- **Screenshots or logs** if applicable
- **Minimal reproduction case** when possible

### Bug Report Template

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. macOS, Linux, Windows]
 - Node Version: [e.g. 18.17.0]
 - Browser: [e.g. chrome, safari]
 - Version: [e.g. 1.0.0]

**Additional context**
Add any other context about the problem here.
```

## 💡 Feature Requests

For feature requests:

- **Describe the use case** and problem being solved
- **Provide examples** of how the feature would be used
- **Consider backward compatibility**
- **Discuss architectural impact**
- **Include mockups** for UI features

### Feature Request Template

```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.

**Implementation suggestions**
If you have ideas about how this could be implemented, please share them.
```

## 📚 Documentation

Help improve our documentation:

- **Fix typos and unclear explanations**
- **Add examples and use cases**
- **Update outdated information**
- **Translate documentation** (future feature)
- **Improve API documentation**

### Documentation Style Guide

- Use clear, concise language
- Include code examples
- Provide step-by-step instructions
- Use proper Markdown formatting
- Include screenshots for UI features

## 🎯 Good First Issues