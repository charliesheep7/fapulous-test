<h1 align="center">
  <img alt="logo" src="./assets/icon.png" width="124px" style="border-radius:10px"/><br/>
Mobile App </h1>

> This Project is based on [Obytes starter](https://starter.obytes.com)

## Requirements

- [React Native dev environment ](https://reactnative.dev/docs/environment-setup)
- [Node.js LTS release](https://nodejs.org/en/)
- [Git](https://git-scm.com/)
- [Watchman](https://facebook.github.io/watchman/docs/install#buildinstall), required only for macOS or Linux users
- [Pnpm](https://pnpm.io/installation)
- [Cursor](https://www.cursor.com/) or [VS Code Editor](https://code.visualstudio.com/download) ⚠️ Make sure to install all recommended extension from `.vscode/extensions.json`

## 👋 Quick start

Clone the repo to your machine and install deps :

```sh
git clone https://github.com/user/repo-name

cd ./repo-name

pnpm install
```

To run the app on ios

```sh
pnpm ios
```

To run the app on Android

```sh
pnpm android
```

## ✍️ Documentation

- [Rules and Conventions](https://starter.obytes.com/getting-started/rules-and-conventions/)
- [Project structure](https://starter.obytes.com/getting-started/project-structure)
- [Environment vars and config](https://starter.obytes.com/getting-started/environment-vars-config)
- [UI and Theming](https://starter.obytes.com/ui-and-theme/ui-theming)
- [Components](https://starter.obytes.com/ui-and-theme/components)
- [Forms](https://starter.obytes.com/ui-and-theme/Forms)
- [Data fetching](https://starter.obytes.com/guides/data-fetching)
- [Contribute to starter](https://starter.obytes.com/how-to-contribute/)

## 🔄 Development Workflow

This project uses **Husky Git Hooks** to enforce code quality and conventional commits. Follow this workflow for daily development:

### Daily Workflow

```bash
# 1. Start from main branch and get latest changes
git checkout main
git pull origin main

# 2. Create a new feature branch
git checkout -b feat/your-feature-name
# Examples:
# git checkout -b feat/user-authentication
# git checkout -b fix/login-bug
# git checkout -b docs/update-readme

# 3. Make your changes and stage them
git add .

# 4. Commit with conventional format (hooks will validate)
git commit -m "feat(auth): implement user login functionality"

# 5. Push your feature branch
git push -u origin feat/your-feature-name

# 6. Create a Pull Request on GitHub to merge into main
```

### Commit Message Format

**Required format**: `type(scope): description`

**Valid types:**

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Formatting, white-space, etc.
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes

**Examples:**

```bash
git commit -m "feat(ui): add loading spinner component"
git commit -m "fix(auth): resolve token refresh issue"
git commit -m "docs: update installation instructions"
git commit -m "refactor(api): simplify user endpoints"
git commit -m "test(utils): add unit tests for date helpers"
```

### Git Hooks (Powered by Husky)

The project automatically runs these hooks to ensure code quality:

#### Pre-commit Hook

- ✅ Prevents commits directly to `main` branch
- ✅ Runs `pnpm type-check` for TypeScript validation
- ✅ Runs `pnpm lint-staged` for code linting and formatting

#### Commit-msg Hook

- ✅ Validates commit message follows conventional format
- ✅ Blocks commits with invalid message format

#### Post-merge Hook

- ✅ Automatically runs `pnpm install` when `pnpm-lock.yaml` changes
- ✅ Suggests running `pnpm prebuild` if needed

### Branch Protection Rules

- **🚫 Never commit directly to `main`** - The pre-commit hook prevents this
- **✅ Always work on feature branches** - `feat/`, `fix/`, `docs/`, etc.
- **✅ Use descriptive branch names** - Include the type and brief description

### Troubleshooting

**If pre-commit fails:**

```bash
# Fix the issues shown in the output, then re-stage and commit
git add .
git commit -m "fix(ui): resolve typescript errors"
```

**If commit message fails:**

```bash
# Fix your commit message format and try again
git commit -m "feat(auth): implement login functionality"
```

**Emergency override (use sparingly):**

```bash
SKIP_BRANCH_PROTECTION=1 git commit -m "hotfix: critical production fix"
```
