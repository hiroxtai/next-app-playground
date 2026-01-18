---
description: '.github/copilot-instructions.md とプロジェクト構造を解析して包括的な README.md を生成'
agent: 'agent'
---

# README Blueprint Generator

Generate a comprehensive, professional README.md for this project by analyzing the `.github/copilot-instructions.md` file and project structure.

## Input Sources

1. **`.github/copilot-instructions.md`**: Read this file to understand:
   - Tech stack and versions
   - Project architecture and patterns
   - Development guidelines
   - Testing approach
   - Code quality tools

2. **Project structure**: Scan the repository to identify:
   - Key directories and files
   - Configuration files
   - Scripts in `package.json`
   - Dependencies

## README Sections

Generate a README with the following sections:

### 1. Project Title and Description
- Extract project name from `package.json` or folder name
- Write a concise 1-2 sentence description of what the project does
- Add relevant badges (e.g., license, build status, version)

### 2. Tech Stack
- List all major technologies with versions (from `.github/copilot-instructions.md`)
- Include framework, language, styling, UI library, testing tools
- Format as a table or bullet list with icons/badges

### 3. Features
- Highlight key features of the project
- Extract from project purpose and capabilities
- Use bullet points for clarity

### 4. Prerequisites
- List required tools (Node.js version, package manager)
- Any system dependencies
- Environment setup requirements

### 5. Installation
```bash
# Clone the repository
git clone <repo-url>
cd <project-name>

# Install dependencies
pnpm install
# or npm install / yarn install
```

### 6. Usage
- Development server command (`pnpm dev`)
- Build command (`pnpm build`)
- Test command (`pnpm test`)
- Other important scripts from `package.json`

### 7. Project Structure
```
src/
├── app/          # Next.js App Router pages
├── components/   # Reusable components
├── lib/          # Utility functions
└── ...
```

### 8. Development Guidelines
- Code style (mention linter/formatter)
- Testing approach
- Git workflow (if applicable)
- Reference to `.github/copilot-instructions.md` for detailed guidelines

### 9. Scripts
Extract from `package.json` and explain each script:
- `dev`: Start development server
- `build`: Production build
- `test`: Run tests
- `lint`: Check code quality
- etc.

### 10. Environment Variables
- List required environment variables (if any)
- Example `.env.example` file

### 11. Testing
- Testing framework and tools
- How to run tests
- Coverage commands

### 12. Deployment
- Deployment platform (e.g., Vercel, Netlify)
- Build command and output directory
- Environment configuration

### 13. Contributing
- Link to CONTRIBUTING.md (if exists)
- Basic contribution guidelines
- Code review process

### 14. License
- Extract from `package.json` or LICENSE file
- Add license badge

### 15. Acknowledgments
- Credits for tools, libraries, or resources used

---

## Formatting Guidelines

- Use **Markdown** with proper headers, lists, and code blocks
- Add **badges** for build status, license, version (shields.io)
- Use **emoji** sparingly for visual hierarchy (✨, 🚀, 📦, 🧪)
- Keep it **concise** but comprehensive
- Use **tables** for structured data (tech stack, scripts)
- Add **code examples** where helpful

---

## Example Output Structure

```markdown
# Project Name

> Brief description of what the project does

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](package.json)

## ✨ Features

- Feature 1
- Feature 2
- Feature 3

## 🛠️ Tech Stack

| Category | Tools |
|----------|-------|
| Framework | Next.js 16 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI Library | shadcn/ui |
| Testing | Vitest, Playwright |
| Linting | Biome |

## 📦 Installation

...

## 🚀 Usage

...

## 📁 Project Structure

...

## 🧪 Testing

...

## 📝 License

MIT © [Author Name]
```

---

## Execution

1. Read `.github/copilot-instructions.md` completely
2. Read `package.json` for dependencies and scripts
3. Scan project structure for key directories
4. Generate README sections based on gathered information
5. Format with proper Markdown
6. Save as `README.md` in the project root

**Note**: If a README.md already exists, create `README-new.md` and ask if the user wants to replace the existing one.
