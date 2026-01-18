---
description: 'Guidelines for creating custom agent files for GitHub Copilot'
applyTo: '**/*.agent.md'
---

# Custom Agent File Guidelines

Instructions for creating effective and maintainable custom agent files that provide specialized expertise for specific development tasks in GitHub Copilot.

## Project Context

- Target audience: Developers creating custom agents for GitHub Copilot
- File format: Markdown with YAML frontmatter
- File naming convention: lowercase with hyphens (e.g., `test-specialist.agent.md`)
- Location: `.github/agents/` directory (repository-level) or `agents/` directory (organization/enterprise-level)
- Purpose: Define specialized agents with tailored expertise, tools, and instructions for specific tasks
- Official documentation: https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents

## Required Frontmatter

Every agent file must include YAML frontmatter with the following fields:

```yaml
---
description: 'Brief description of the agent purpose and capabilities'
name: 'Agent Display Name'
tools: ['read', 'edit', 'search']
model: 'Claude Sonnet 4.5'
target: 'vscode'
infer: true
---
```

### Core Frontmatter Properties

#### **description** (REQUIRED)
- Single-quoted string, clearly stating the agent's purpose and domain expertise
- Should be concise (50-150 characters) and actionable
- Example: `'Focuses on test coverage, quality, and testing best practices'`

#### **name** (OPTIONAL)
- Display name for the agent in the UI
- If omitted, defaults to filename (without `.md` or `.agent.md`)
- Use title case and be descriptive
- Example: `'Testing Specialist'`

#### **tools** (OPTIONAL)
- List of tool names or aliases the agent can use
- Supports comma-separated string or YAML array format
- If omitted, agent has access to all available tools
- See "Tool Configuration" section below for details

#### **model** (STRONGLY RECOMMENDED)
- Specifies which AI model the agent should use
- Supported in VS Code, JetBrains IDEs, Eclipse, and Xcode
- Example: `'Claude Sonnet 4.5'`, `'gpt-4'`, `'gpt-4o'`
- Choose based on agent complexity and required capabilities

#### **target** (OPTIONAL)
- Specifies target environment: `'vscode'` or `'github-copilot'`
- If omitted, agent is available in both environments
- Use when agent has environment-specific features

#### **infer** (OPTIONAL)
- Boolean controlling whether Copilot can automatically use this agent based on context
- Default: `true` if omitted
- Set to `false` to require manual agent selection

#### **metadata** (OPTIONAL, GitHub.com only)
- Object with name-value pairs for agent annotation
- Example: `metadata: { category: 'testing', version: '1.0' }`
- Not supported in VS Code

#### **mcp-servers** (OPTIONAL, Organization/Enterprise only)
- Configure MCP servers available only to this agent
- Only supported for organization/enterprise level agents
- See "MCP Server Configuration" section below

#### **handoffs** (OPTIONAL, VS Code only)
- Enable guided sequential workflows that transition between agents with suggested next steps
- List of handoff configurations, each specifying a target agent and optional prompt
- After a chat response completes, handoff buttons appear allowing users to move to the next agent
- Only supported in VS Code (version 1.106+)
- See "Handoffs Configuration" section below for details

## Handoffs Configuration

Handoffs enable you to create guided sequential workflows that transition seamlessly between custom agents. This is useful for orchestrating multi-step development workflows where users can review and approve each step before moving to the next one.

### Common Handoff Patterns

- **Planning → Implementation**: Generate a plan in a planning agent, then hand off to an implementation agent to start coding
- **Implementation → Review**: Complete implementation, then switch to a code review agent to check for quality and security issues
- **Write Failing Tests → Write Passing Tests**: Generate failing tests, then hand off to implement the code that makes those tests pass
- **Research → Documentation**: Research a topic, then transition to a documentation agent to write guides

### Handoff Frontmatter Structure

Define handoffs in the agent file's YAML frontmatter using the `handoffs` field:

```yaml
---
description: 'Brief description of the agent'
name: 'Agent Name'
tools: ['search', 'read']
handoffs:
  - label: Start Implementation
    agent: implementation
    prompt: 'Now implement the plan outlined above.'
    send: false
  - label: Code Review
    agent: code-review
    prompt: 'Please review the implementation for quality and security issues.'
    send: false
---
```

### Handoff Properties

Each handoff in the list must include the following properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `label` | string | Yes | The display text shown on the handoff button in the chat interface |
| `agent` | string | Yes | The target agent identifier to switch to (name or filename without `.agent.md`) |
| `prompt` | string | No | The prompt text to pre-fill in the target agent's chat input |
| `send` | boolean | No | If `true`, automatically submits the prompt to the target agent (default: `false`) |

### Handoff Behavior

- **Button Display**: Handoff buttons appear as interactive suggestions after a chat response completes
- **Context Preservation**: When users select a handoff button, they switch to the target agent with conversation context maintained
- **Pre-filled Prompt**: If a `prompt` is specified, it appears pre-filled in the target agent's chat input
- **Manual vs Auto**: When `send: false`, users must review and manually send the pre-filled prompt; when `send: true`, the prompt is automatically submitted

### Handoff Configuration Guidelines

#### When to Use Handoffs

- **Multi-step workflows**: Breaking down complex tasks across specialized agents
- **Quality gates**: Ensuring review steps between implementation phases
- **Guided processes**: Directing users through a structured development process
- **Skill transitions**: Moving from planning/design to implementation/testing specialists

#### Best Practices

- **Clear Labels**: Use action-oriented labels that clearly indicate the next step
  - ✅ Good: "Start Implementation", "Review for Security", "Write Tests"
  - ❌ Avoid: "Next", "Go to agent", "Do something"

- **Relevant Prompts**: Provide context-aware prompts that reference the completed work
  - ✅ Good: `'Now implement the plan outlined above.'`
  - ❌ Avoid: Generic prompts without context

- **Selective Use**: Don't create handoffs to every possible agent; focus on logical workflow transitions
  - Limit to 2-3 most relevant next steps per agent
  - Only add handoffs for agents that naturally follow in the workflow

- **Agent Dependencies**: Ensure target agents exist before creating handoffs
  - Handoffs to non-existent agents will be silently ignored
  - Test handoffs to verify they work as expected

- **Prompt Content**: Keep prompts concise and actionable
  - Refer to work from the current agent without duplicating content
  - Provide any necessary context the target agent might need

### Example: Complete Workflow

Here's an example of three agents with handoffs creating a complete workflow:

**Planning Agent** (`planner.agent.md`):
```yaml
---
description: 'Generate an implementation plan for new features or refactoring'
name: 'Planner'
tools: ['search', 'read']
handoffs:
  - label: Implement Plan
    agent: implementer
    prompt: 'Implement the plan outlined above.'
    send: false
---
# Planner Agent
You are a planning specialist. Your task is to:
1. Analyze the requirements
2. Break down the work into logical steps
3. Generate a detailed implementation plan
4. Identify testing requirements

Do not write any code - focus only on planning.
```

**Implementation Agent** (`implementer.agent.md`):
```yaml
---
description: 'Implement code based on a plan or specification'
name: 'Implementer'
tools: ['read', 'edit', 'search', 'execute']
handoffs:
  - label: Review Implementation
    agent: reviewer
    prompt: 'Please review this implementation for code quality, security, and adherence to best practices.'
    send: false
---
# Implementer Agent
You are an implementation specialist. Your task is to:
1. Follow the provided plan or specification
2. Write clean, maintainable code
3. Include appropriate comments and documentation
4. Follow project coding standards

Implement the solution completely and thoroughly.
```

**Review Agent** (`reviewer.agent.md`):
```yaml
---
description: 'Review code for quality, security, and best practices'
name: 'Reviewer'
tools: ['read', 'search']
handoffs:
  - label: Back to Planning
    agent: planner
    prompt: 'Review the feedback above and determine if a new plan is needed.'
    send: false
---
# Code Review Agent
You are a code review specialist. Your task is to:
1. Check code quality and maintainability
2. Identify security issues and vulnerabilities
3. Verify adherence to project standards
4. Suggest improvements

Provide constructive feedback on the implementation.
```

This workflow allows a developer to:
1. Start with the Planner agent to create a detailed plan
2. Hand off to the Implementer agent to write code based on the plan
3. Hand off to the Reviewer agent to check the implementation
4. Optionally hand off back to planning if significant issues are found

### Version Compatibility

- **VS Code**: Handoffs are supported in VS Code 1.106 and later
- **GitHub.com**: Not currently supported; agent transition workflows use different mechanisms
- **Other IDEs**: Limited or no support; focus on VS Code implementations for maximum compatibility

## Tool Configuration

### Tool Specification Strategies

**Enable all tools** (default):
```yaml
# Omit tools property entirely, or use:
tools: ['*']
```

**Enable specific tools**:
```yaml
tools: ['read', 'edit', 'search', 'execute']
```

**Enable MCP server tools**:
```yaml
tools: ['read', 'edit', 'github/*', 'playwright/navigate']
```

**Disable all tools**:
```yaml
tools: []
```

### Standard Tool Aliases

All aliases are case-insensitive:

| Alias | Alternative Names | Category | Description |
|-------|------------------|----------|-------------|
| `execute` | shell, Bash, powershell | Shell execution | Execute commands in appropriate shell |
| `read` | Read, NotebookRead, view | File reading | Read file contents |
| `edit` | Edit, MultiEdit, Write, NotebookEdit | File editing | Edit and modify files |
| `search` | Grep, Glob, search | Code search | Search for files or text in files |
| `agent` | custom-agent, Task | Agent invocation | Invoke other custom agents |
| `web` | WebSearch, WebFetch | Web access | Fetch web content and search |
| `todo` | TodoWrite | Task management | Create and manage task lists (VS Code only) |

### Built-in MCP Server Tools

**GitHub MCP Server**:
```yaml
tools: ['github/*']  # All GitHub tools
tools: ['github/get_file_contents', 'github/search_repositories']  # Specific tools
```
- All read-only tools available by default
- Token scoped to source repository

**Playwright MCP Server**:
```yaml
tools: ['playwright/*']  # All Playwright tools
tools: ['playwright/navigate', 'playwright/screenshot']  # Specific tools
```
- Configured to access localhost only
- Useful for browser automation and testing

### Tool Selection Best Practices

- **Principle of Least Privilege**: Only enable tools necessary for the agent's purpose
- **Security**: Limit `execute` access unless explicitly required
- **Focus**: Fewer tools = clearer agent purpose and better performance
- **Documentation**: Comment why specific tools are required for complex configurations

## Agent Prompt Structure

The markdown content below the frontmatter defines the agent's behavior, expertise, and instructions. Well-structured prompts typically include:

1. **Agent Identity and Role**: Who the agent is and its primary role
2. **Core Responsibilities**: What specific tasks the agent performs
3. **Approach and Methodology**: How the agent works to accomplish tasks
4. **Guidelines and Constraints**: What to do/avoid and quality standards
5. **Output Expectations**: Expected output format and quality

### Prompt Writing Best Practices

- **Be Specific and Direct**: Use imperative mood ("Analyze", "Generate"); avoid vague terms
- **Define Boundaries**: Clearly state scope limits and constraints
- **Include Context**: Explain domain expertise and reference relevant frameworks
- **Focus on Behavior**: Describe how the agent should think and work
- **Use Structured Format**: Headers, bullets, and lists make prompts scannable

## Agent Creation Checklist

### Frontmatter
- [ ] `description` field present and descriptive (50-150 chars)
- [ ] `description` wrapped in single quotes
- [ ] `name` specified (optional but recommended)
- [ ] `tools` configured appropriately (or intentionally omitted)
- [ ] `model` specified for optimal performance
- [ ] `target` set if environment-specific
- [ ] `infer` set to `false` if manual selection required

### Prompt Content
- [ ] Clear agent identity and role defined
- [ ] Core responsibilities listed explicitly
- [ ] Approach and methodology explained
- [ ] Guidelines and constraints specified
- [ ] Output expectations documented
- [ ] Examples provided where helpful
- [ ] Instructions are specific and actionable
- [ ] Scope and boundaries clearly defined
- [ ] Total content under 30,000 characters

### File Structure
- [ ] Filename follows lowercase-with-hyphens convention
- [ ] File placed in correct directory (`.github/agents/` or `agents/`)
- [ ] Filename uses only allowed characters
- [ ] File extension is `.agent.md`

### Quality Assurance
- [ ] Agent purpose is unique and not duplicative
- [ ] Tools are minimal and necessary
- [ ] Instructions are clear and unambiguous
- [ ] Agent has been tested with representative tasks
- [ ] Documentation references are current
- [ ] Security considerations addressed (if applicable)

## Common Agent Patterns

### Testing Specialist
**Purpose**: Focus on test coverage and quality
**Tools**: All tools (for comprehensive test creation)
**Approach**: Analyze, identify gaps, write tests, avoid production code changes

### Implementation Planner
**Purpose**: Create detailed technical plans and specifications
**Tools**: Limited to `['read', 'search', 'edit']`
**Approach**: Analyze requirements, create documentation, avoid implementation

### Code Reviewer
**Purpose**: Review code quality and provide feedback
**Tools**: `['read', 'search']` only
**Approach**: Analyze, suggest improvements, no direct modifications

### Refactoring Specialist
**Purpose**: Improve code structure and maintainability
**Tools**: `['read', 'search', 'edit']`
**Approach**: Analyze patterns, propose refactorings, implement safely

### Security Auditor
**Purpose**: Identify security issues and vulnerabilities
**Tools**: `['read', 'search', 'web']`
**Approach**: Scan code, check against OWASP, report findings

## Additional Resources

### Official Documentation
- [Creating Custom Agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents)
- [Custom Agents Configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- [Custom Agents in VS Code](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [MCP Integration](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/extend-coding-agent-with-mcp)

### Community Resources
- [Awesome Copilot Agents Collection](https://github.com/github/awesome-copilot/tree/main/agents)
- [Customization Library Examples](https://docs.github.com/en/copilot/tutorials/customization-library/custom-agents)
- [Your First Custom Agent Tutorial](https://docs.github.com/en/copilot/tutorials/customization-library/custom-agents/your-first-custom-agent)

### Related Files
- [Prompt Files Guidelines](./prompt.instructions.md) - For creating prompt files
- [Instructions Guidelines](./instructions.instructions.md) - For creating instruction files
