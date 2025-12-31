# Contributing to Nasiry POS

First off, thank you for considering contributing to Nasiry POS! It's people like you that make this project such a great tool.

## 🌟 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🤔 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what you expected to see
- **Include screenshots or animated GIFs** if applicable
- **Include your environment details** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any similar features** in other applications if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding standards** used throughout the project
3. **Write clear, descriptive commit messages**
4. **Include comments** in your code where necessary
5. **Update documentation** if you're changing functionality
6. **Test your changes** thoroughly before submitting

## 🔧 Development Process

### Setting Up Your Development Environment

1. Fork and clone the repository:
```bash
git clone https://github.com/yourusername/nasiry-pos.git
cd nasiry-pos
```

2. Install dependencies for both frontend and backend:
```bash
# Backend
cd Backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Set up environment variables (see README.md for details)

4. Start the development servers:
```bash
# Backend (in Backend directory)
npm start

# Frontend (in frontend directory)
npm run dev
```

### Coding Standards

#### JavaScript/React
- Use **ES6+ syntax**
- Follow **functional programming** principles where applicable
- Use **meaningful variable and function names**
- Keep functions **small and focused** (single responsibility)
- Use **async/await** for asynchronous operations
- Add **JSDoc comments** for complex functions

#### React Components
- Use **functional components** with hooks
- Keep components **small and reusable**
- Use **proper prop types** or TypeScript
- Follow the **component structure**:
  ```jsx
  // 1. Imports
  // 2. Component definition
  // 3. Hooks
  // 4. Event handlers
  // 5. Render logic
  // 6. Export
  ```

#### CSS/Styling
- Use **Tailwind CSS** utility classes
- Follow **mobile-first** responsive design
- Keep custom CSS **minimal**
- Use **CSS variables** for theming

#### Backend
- Follow **RESTful API** conventions
- Use **async/await** for database operations
- Implement **proper error handling**
- Add **input validation**
- Write **descriptive API comments**

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(bills): add weekly payment tracking
fix(auth): resolve JWT token expiration issue
docs(readme): update installation instructions
```

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

## 🧪 Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Maintain or improve code coverage

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Documentation

- Update README.md if you change functionality
- Add JSDoc comments for new functions
- Update API documentation for new endpoints
- Include inline comments for complex logic

## 🔍 Code Review Process

1. **Submit your PR** with a clear description
2. **Link related issues** in the PR description
3. **Wait for review** from maintainers
4. **Address feedback** promptly
5. **Ensure CI/CD passes** all checks

## 📦 Release Process

Maintainers will handle releases following semantic versioning:
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

## 🎯 Project Priorities

Current focus areas:
1. **Performance optimization**
2. **Mobile responsiveness**
3. **Accessibility improvements**
4. **Test coverage**
5. **Documentation**

## 💡 Questions?

- Open an issue with the `question` label
- Reach out to maintainers
- Check existing documentation

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Nasiry POS! 🎉
