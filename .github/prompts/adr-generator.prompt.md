---
agent: 'agent'
description: 'アーキテクチャ上の重要な意思決定を記録する ADR（Architecture Decision Record）を生成'
---

# ADR Generator

Generate a comprehensive Architectural Decision Record (ADR) to document an architectural decision made in the project.

## Purpose

ADRs capture the context, reasoning, and consequences of significant architectural decisions. They serve as a historical record for future developers and help maintain institutional knowledge.

---

## ADR Format

Use the following structure:

```markdown
# ADR-[NUMBER]: [Title]

**Status**: [Proposed | Accepted | Deprecated | Superseded by ADR-XXX]

**Date**: YYYY-MM-DD

**Deciders**: [List of people involved in the decision]

---

## Context

What is the issue we're trying to solve? What are the driving forces behind this decision?

- Technical constraints
- Business requirements
- Performance considerations
- Security concerns
- Developer experience
- etc.

---

## Decision

What is the change we're proposing or have agreed to implement?

Be specific and actionable. State clearly what will be done.

**Example:**
"We will use Prisma as our ORM instead of TypeORM."

---

## Rationale

Why did we choose this particular solution?

- What were the alternatives considered?
- What are the pros and cons of each option?
- What criteria did we use to evaluate options?
- What makes this the best choice given our constraints?

**Example evaluation table:**

| Criteria | Prisma | TypeORM | Drizzle |
|----------|--------|---------|---------|
| Type safety | Excellent | Good | Excellent |
| Migration tools | Good | Excellent | Fair |
| Performance | Good | Good | Excellent |
| Community support | Excellent | Good | Fair |
| Learning curve | Low | Medium | Medium |

---

## Consequences

What are the positive and negative outcomes of this decision?

### Positive Consequences
- Benefit 1
- Benefit 2
- Benefit 3

### Negative Consequences / Trade-offs
- Drawback 1
- Drawback 2
- Drawback 3

### Risks
- Risk 1 (and mitigation strategy)
- Risk 2 (and mitigation strategy)

---

## Implementation Notes

How will this decision be implemented?

- Steps to implement
- Timeline
- Dependencies
- Migration path (if applicable)

---

## References

- Links to related documentation
- GitHub issues or pull requests
- External articles or resources
- Related ADRs

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| YYYY-MM-DD | Initial version | Name |
| YYYY-MM-DD | Updated status to Accepted | Name |
```

---

## ADR Numbering

Use sequential numbering:
- ADR-001: First decision
- ADR-002: Second decision
- etc.

Store ADRs in `docs/adr/` directory:
```
docs/
└── adr/
    ├── ADR-001-use-prisma-orm.md
    ├── ADR-002-adopt-shadcn-ui.md
    └── ADR-003-switch-to-pnpm.md
```

---

## When to Write an ADR

Write an ADR for decisions that:

- ✅ Impact the overall architecture
- ✅ Are difficult or expensive to reverse
- ✅ Affect multiple teams or components
- ✅ Involve trade-offs between competing concerns
- ✅ Establish a pattern or convention for the project

**Examples:**
- Choosing a database (PostgreSQL vs. MongoDB)
- Selecting a state management library (Zustand vs. Redux)
- Adopting a new CSS framework (Tailwind vs. styled-components)
- Switching package managers (npm vs. pnpm)
- Implementing authentication strategy (JWT vs. sessions)

Don't write an ADR for:

- ❌ Minor code refactoring
- ❌ Bug fixes
- ❌ Trivial configuration changes
- ❌ Decisions that can easily be reversed

---

## ADR Status Lifecycle

1. **Proposed**: Decision is under discussion
2. **Accepted**: Decision has been agreed upon and will be implemented
3. **Deprecated**: Decision is no longer recommended but still in use
4. **Superseded by ADR-XXX**: Decision has been replaced by a newer ADR

---

## Example ADR

```markdown
# ADR-005: Adopt Biome for Linting and Formatting

**Status**: Accepted

**Date**: 2024-01-15

**Deciders**: Engineering Team

---

## Context

Our current setup uses ESLint for linting and Prettier for formatting. However, we face several challenges:

- **Performance**: Linting + formatting takes 30+ seconds on large codebases
- **Configuration complexity**: Maintaining separate ESLint and Prettier configs
- **Plugin ecosystem**: Need multiple plugins for TypeScript, React, import sorting
- **Developer friction**: Occasional conflicts between ESLint and Prettier rules

We need a faster, simpler alternative that maintains code quality standards.

---

## Decision

We will adopt **Biome** (v2.x) as our primary linting and formatting tool, replacing ESLint and Prettier.

---

## Rationale

### Alternatives Considered

1. **Status Quo (ESLint + Prettier)**
   - ✅ Pros: Mature, large ecosystem, well-known
   - ❌ Cons: Slow, complex config, occasional conflicts

2. **dprint (formatting only)**
   - ✅ Pros: Fast, written in Rust
   - ❌ Cons: Formatting only (still need ESLint for linting)

3. **Biome**
   - ✅ Pros: Fast (10-20x faster), all-in-one, compatible with Prettier/ESLint configs
   - ❌ Cons: Newer tool, smaller ecosystem

### Why Biome?

- **Performance**: 20x faster than ESLint+Prettier (benchmarked on our codebase)
- **Simplicity**: Single tool, single config file (`biome.json`)
- **Compatibility**: Drop-in replacement for most ESLint/Prettier rules
- **Built for modern JS/TS**: First-class TypeScript, JSX, JSON support
- **Active development**: Backed by Rome Tools team, growing community

---

## Consequences

### Positive Consequences
- **Faster CI/CD**: Linting time reduced from 30s to 2s
- **Simpler setup**: One config file instead of two
- **Better DX**: Instant feedback in editor
- **Consistent formatting**: No more ESLint/Prettier conflicts

### Negative Consequences / Trade-offs
- **Learning curve**: Team needs to learn new config format
- **Plugin migration**: Some ESLint plugins may not have Biome equivalents
- **Editor support**: Requires Biome VSCode extension (not default)

### Risks
- **Rule gaps**: Some ESLint rules may not exist in Biome
  - *Mitigation*: Audit existing rules, document exceptions
- **Breaking changes**: Biome is pre-1.0 (though stable since v2.0)
  - *Mitigation*: Pin to minor version, test updates before deploying

---

## Implementation Notes

### Migration Steps

1. Install Biome: `pnpm add -D @biomejs/biome`
2. Initialize config: `pnpm biome init`
3. Migrate ESLint rules to `biome.json`
4. Update `package.json` scripts:
   ```json
   {
     "scripts": {
       "lint": "biome check .",
       "format": "biome format --write ."
     }
   }
   ```
5. Update `.github/workflows` to use Biome
6. Install Biome VSCode extension
7. Remove ESLint/Prettier dependencies and configs

### Timeline
- Week 1: Setup and migration
- Week 2: Team training and rollout
- Week 3: Monitor and adjust

---

## References

- [Biome documentation](https://biomejs.dev/)
- [Biome vs. ESLint performance benchmarks](https://biomejs.dev/blog/biome-v1-8/)
- [GitHub Discussion: Biome adoption](https://github.com/example/repo/discussions/123)

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2024-01-15 | Initial proposal | @username |
| 2024-01-20 | Accepted after team review | @username |
```

---

## Execution

When generating an ADR:

1. Ask the user for the decision topic (if not provided)
2. Gather context about the decision (constraints, alternatives, criteria)
3. Generate the ADR following the format above
4. Determine the next ADR number by checking existing ADRs in `docs/adr/`
5. Save as `docs/adr/ADR-XXX-kebab-case-title.md`
6. Remind the user to update the ADR status when the decision is implemented

**Note**: If `docs/adr/` doesn't exist, create it first.
