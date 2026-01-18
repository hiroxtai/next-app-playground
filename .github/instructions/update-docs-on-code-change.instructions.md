---
description: 'Automatically update README.md and documentation files when application code changes require documentation updates'
applyTo: '**/*.{md,js,mjs,cjs,ts,tsx,jsx,py,java,cs,go,rb,php,rs,cpp,c,h,hpp}'
---

# Update Documentation on Code Change

## Overview

Ensure documentation stays synchronized with code changes by automatically detecting when README.md,
API documentation, configuration guides, and other documentation files need updates based on code
modifications.

## When to Update Documentation

### Trigger Conditions

Automatically check if documentation updates are needed when:

- New features or functionality are added
- API endpoints, methods, or interfaces change
- Breaking changes are introduced
- Dependencies or requirements change
- Configuration options or environment variables are modified
- Installation or setup procedures change
- Command-line interfaces or scripts are updated
- Code examples in documentation become outdated

## Documentation Update Rules

### README.md Updates

**Always update README.md when:**

- Adding new features or capabilities
  - Add feature description to "Features" section
  - Include usage examples if applicable
  - Update table of contents if present

- Modifying installation or setup process
  - Update "Installation" or "Getting Started" section
  - Revise dependency requirements
  - Update prerequisite lists

- Adding new CLI commands or options
  - Document command syntax and examples
  - Include option descriptions and default values
  - Add usage examples

- Changing configuration options
  - Update configuration examples
  - Document new environment variables
  - Update config file templates

### API Documentation Updates

**Sync API documentation when:**

- New endpoints are added
  - Document HTTP method, path, parameters
  - Include request/response examples
  - Update OpenAPI/Swagger specs

- Endpoint signatures change
  - Update parameter lists
  - Revise response schemas
  - Document breaking changes

- Authentication or authorization changes
  - Update authentication examples
  - Revise security requirements
  - Update API key/token documentation

### Code Example Synchronization

**Verify and update code examples when:**

- Function signatures change
  - Update all code snippets using the function
  - Verify examples still compile/run
  - Update import statements if needed

- API interfaces change
  - Update example requests and responses
  - Revise client code examples
  - Update SDK usage examples

- Best practices evolve
  - Replace outdated patterns in examples
  - Update to use current recommended approaches
  - Add deprecation notices for old patterns

### Configuration Documentation

**Update configuration docs when:**

- New environment variables are added
  - Add to .env.example file
  - Document in README.md or docs/configuration.md
  - Include default values and descriptions

- Config file structure changes
  - Update example config files
  - Document new options
  - Mark deprecated options

- Deployment configuration changes
  - Update Docker/Kubernetes configs
  - Revise deployment guides
  - Update infrastructure-as-code examples

### Migration and Breaking Changes

**Create migration guides when:**

- Breaking API changes occur
  - Document what changed
  - Provide before/after examples
  - Include step-by-step migration instructions

- Major version updates
  - List all breaking changes
  - Provide upgrade checklist
  - Include common migration issues and solutions

- Deprecating features
  - Mark deprecated features clearly
  - Suggest alternative approaches
  - Include timeline for removal

## Documentation File Structure

### Standard Documentation Files

Maintain these documentation files and update as needed:

- **README.md**: Project overview, quick start, basic usage
- **CHANGELOG.md**: Version history and user-facing changes
- **docs/**: Detailed documentation
  - `installation.md`: Setup and installation guide
  - `configuration.md`: Configuration options and examples
  - `api.md`: API reference documentation
  - `contributing.md`: Contribution guidelines
  - `migration-guides/`: Version migration guides
- **examples/**: Working code examples and tutorials

### Changelog Management

**Add changelog entries for:**

- New features (under "Added" section)
- Bug fixes (under "Fixed" section)
- Breaking changes (under "Changed" section with **BREAKING** prefix)
- Deprecated features (under "Deprecated" section)
- Removed features (under "Removed" section)
- Security fixes (under "Security" section)

**Changelog format:**

```markdown
## [Version] - YYYY-MM-DD

### Added
- New feature description with reference to PR/issue

### Changed
- **BREAKING**: Description of breaking change
- Other changes

### Fixed
- Bug fix description
```

## Documentation Verification

### Before Applying Changes

**Check documentation completeness:**

1. All new public APIs are documented
2. Code examples compile and run
3. Links in documentation are valid
4. Configuration examples are accurate
5. Installation steps are current
6. README.md reflects current state

### Documentation Tests

**Include documentation validation:**

```bash
# Example validation commands
npm run docs:check         # Verify docs build
npm run docs:test-examples # Test code examples
npm run docs:lint         # Check for issues
```

## Documentation Quality Standards

### Writing Guidelines

- Use clear, concise language
- Include working code examples
- Provide both basic and advanced examples
- Use consistent terminology
- Include error handling examples
- Document edge cases and limitations

### Code Example Format

```markdown
### Example: [Clear description of what example demonstrates]

\`\`\`language
// Include necessary imports/setup
import { function } from 'package';

// Complete, runnable example
const result = function(parameter);
console.log(result);
\`\`\`

**Output:**
\`\`\`
expected output
\`\`\`
```

### API Documentation Format

```markdown
### `functionName(param1, param2)`

Brief description of what the function does.

**Parameters:**
- `param1` (type): Description of parameter
- `param2` (type, optional): Description with default value

**Returns:**
- `type`: Description of return value

**Example:**
\`\`\`language
const result = functionName('value', 42);
\`\`\`

**Throws:**
- `ErrorType`: When and why error is thrown
```

## Best Practices

### Do's

- ✅ Update documentation in the same commit as code changes
- ✅ Include before/after examples for changes
- ✅ Test code examples before committing
- ✅ Use consistent formatting and terminology
- ✅ Document limitations and edge cases
- ✅ Provide migration paths for breaking changes
- ✅ Keep documentation DRY (link instead of duplicating)

### Don'ts

- ❌ Commit code changes without updating documentation
- ❌ Leave outdated examples in documentation
- ❌ Document features that don't exist yet
- ❌ Use vague or ambiguous language
- ❌ Forget to update changelog
- ❌ Ignore broken links or failing examples
- ❌ Document implementation details users don't need

## Review Checklist

Before considering documentation complete:

- [ ] README.md reflects current project state
- [ ] All new features are documented
- [ ] Code examples are tested and work
- [ ] API documentation is complete and accurate
- [ ] Configuration examples are up to date
- [ ] Breaking changes are documented with migration guide
- [ ] CHANGELOG.md is updated
- [ ] Links are valid and not broken
- [ ] Installation instructions are current
- [ ] Environment variables are documented

## Key Principles

- Keep documentation close to code when possible
- Use documentation generators for API reference
- Maintain living documentation that evolves with code
- Consider documentation as part of feature completeness
- Review documentation in code reviews
- Make documentation easy to find and navigate
