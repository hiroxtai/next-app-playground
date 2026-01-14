---
description: 'Node.js and JavaScript development standards with Vitest testing framework'
applyTo: '**/*.js, **/*.ts, **/*.test.js, **/*.test.ts'
---

# Node.js + JavaScript + Vitest Development Standards

> Modern Node.js development with JavaScript/TypeScript and Vitest for testing

## Runtime Environment

- **Node.js**: 20.x LTS or higher
- **Package Manager**: pnpm (preferred), npm, or yarn
- **Module System**: ES Modules (`.mjs` or `"type": "module"`)
- **TypeScript**: Optional but recommended

---

## JavaScript/TypeScript Basics

### 1. Modern JavaScript (ES2022+)

```javascript
// ✅ Use ES Modules
import { readFile } from 'node:fs/promises';
import express from 'express';

export async function loadConfig() {
  const data = await readFile('./config.json', 'utf-8');
  return JSON.parse(data);
}

// ✅ Use async/await
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// ✅ Use destructuring
const { name, email } = user;
const [first, second, ...rest] = array;

// ✅ Use spread operator
const merged = { ...defaults, ...userConfig };
const combined = [...array1, ...array2];

// ✅ Use template literals
const message = `Hello, ${user.name}!`;

// ✅ Use arrow functions
const double = (x) => x * 2;
const sum = (a, b) => a + b;
```

### 2. Node.js Built-in Modules

```javascript
// ✅ Use `node:` protocol for built-ins (Node 16+)
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { exec as execCallback } from 'node:child_process';

const exec = promisify(execCallback);

// ✅ Use promise-based APIs
const data = await readFile('./file.txt', 'utf-8');
await writeFile('./output.txt', data);

// ✅ Use path.join for cross-platform paths
const filePath = join(__dirname, 'data', 'config.json');
```

---

## Error Handling

### 1. Try-Catch for Async Code

```javascript
// ✅ Good: Handle async errors
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error; // Re-throw or handle gracefully
  }
}
```

### 2. Custom Error Classes

```javascript
// ✅ Good: Custom error for better error handling
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

function validateEmail(email) {
  if (!email.includes('@')) {
    throw new ValidationError('Invalid email format', 'email');
  }
}

// Usage
try {
  validateEmail('invalid');
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`Validation failed for ${error.field}:`, error.message);
  }
}
```

---

## Vitest Testing

### 1. Test File Structure

```javascript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { sum, fetchUser } from './math.js';

/**
 * Test suite for math utilities
 */
describe('sum', () => {
  /**
   * Basic addition test
   */
  it('should add two numbers correctly', () => {
    expect(sum(2, 3)).toBe(5);
  });

  /**
   * Test with negative numbers
   */
  it('should handle negative numbers', () => {
    expect(sum(-1, -2)).toBe(-3);
  });

  /**
   * Test with zero
   */
  it('should handle zero', () => {
    expect(sum(0, 5)).toBe(5);
  });
});
```

### 2. Test Patterns

```javascript
// ✅ Good: Use descriptive test names
it('should return user data when ID is valid', async () => {
  const user = await fetchUser('123');
  expect(user).toEqual({ id: '123', name: 'Alice' });
});

// ✅ Good: Use table-driven tests
it.each([
  [2, 3, 5],
  [0, 0, 0],
  [-1, 1, 0],
  [10, -5, 5],
])('sum(%i, %i) should equal %i', (a, b, expected) => {
  expect(sum(a, b)).toBe(expected);
});

// ✅ Good: Test error cases
it('should throw error for invalid input', () => {
  expect(() => divide(10, 0)).toThrow('Division by zero');
});
```

### 3. Mocking with `vi`

```javascript
import { vi } from 'vitest';

// ✅ Good: Mock modules
vi.mock('node:fs/promises', () => ({
  readFile: vi.fn().mockResolvedValue('file content'),
  writeFile: vi.fn().mockResolvedValue(undefined),
}));

// ✅ Good: Mock functions
const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ id: '123', name: 'Alice' }),
});

global.fetch = mockFetch;

it('should fetch user data', async () => {
  const user = await fetchUser('123');
  
  expect(mockFetch).toHaveBeenCalledWith('/api/users/123');
  expect(user).toEqual({ id: '123', name: 'Alice' });
});

// ✅ Good: Spy on functions
const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

it('should log error on failure', async () => {
  await fetchData('invalid-url');
  expect(consoleSpy).toHaveBeenCalled();
});

// Clean up
consoleSpy.mockRestore();
```

### 4. Setup and Teardown

```javascript
import { beforeEach, afterEach, beforeAll, afterAll } from 'vitest';

// ✅ Run before each test
beforeEach(() => {
  // Reset mocks, clear database, etc.
  vi.clearAllMocks();
});

// ✅ Run after each test
afterEach(() => {
  // Clean up resources
});

// ✅ Run once before all tests
beforeAll(async () => {
  // Setup database, start server, etc.
  await setupTestDatabase();
});

// ✅ Run once after all tests
afterAll(async () => {
  // Teardown database, stop server, etc.
  await teardownTestDatabase();
});
```

### 5. Async Testing

```javascript
// ✅ Good: Test async functions
it('should fetch user data', async () => {
  const user = await fetchUser('123');
  expect(user.id).toBe('123');
});

// ✅ Good: Test promises
it('should resolve with user data', () => {
  return fetchUser('123').then(user => {
    expect(user.id).toBe('123');
  });
});

// ✅ Good: Test rejections
it('should reject with error', async () => {
  await expect(fetchUser('invalid')).rejects.toThrow('User not found');
});
```

---

## Vitest Configuration

### `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Globals (optional, for Jest-like API)
    globals: true,
    
    // Environment
    environment: 'node', // or 'jsdom' for DOM tests
    
    // Setup files
    setupFiles: ['./vitest.setup.ts'],
    
    // Coverage
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.config.ts',
      ],
    },
    
    // Include/Exclude
    include: ['**/*.test.ts', '**/*.spec.ts'],
    exclude: ['node_modules/', 'dist/'],
    
    // Timeouts
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
```

---

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Best Practices

### 1. Use Strict Mode

```javascript
'use strict'; // For CommonJS modules

// Or use ES modules (strict by default)
export function myFunction() {
  // ...
}
```

### 2. Avoid `var`, Use `const` and `let`

```javascript
// ❌ Bad: `var` has function scope
var count = 0;

// ✅ Good: `const` for immutable bindings
const MAX_RETRIES = 3;

// ✅ Good: `let` for mutable bindings
let counter = 0;
```

### 3. Prefer `async/await` over Callbacks

```javascript
// ❌ Bad: Callback hell
readFile('./file.txt', (err, data) => {
  if (err) throw err;
  processData(data, (err, result) => {
    if (err) throw err;
    saveResult(result, (err) => {
      if (err) throw err;
      console.log('Done');
    });
  });
});

// ✅ Good: Async/await
try {
  const data = await readFile('./file.txt', 'utf-8');
  const result = await processData(data);
  await saveResult(result);
  console.log('Done');
} catch (error) {
  console.error('Error:', error);
}
```

### 4. Use Environment Variables

```javascript
// ✅ Good: Use `dotenv` for development
import 'dotenv/config';

const PORT = process.env.PORT ?? 3000;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}
```

### 5. Validate Input

```javascript
// ✅ Good: Validate and sanitize input
function createUser(data) {
  if (!data.email || !data.email.includes('@')) {
    throw new ValidationError('Invalid email');
  }
  
  if (!data.password || data.password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters');
  }
  
  // Sanitize
  const user = {
    email: data.email.toLowerCase().trim(),
    password: hashPassword(data.password),
  };
  
  return user;
}
```

---

## Testing Checklist

- [ ] Test happy path (normal cases)
- [ ] Test edge cases (empty arrays, null, undefined, 0)
- [ ] Test error cases (invalid input, network failures)
- [ ] Test async behavior (promises, timeouts)
- [ ] Mock external dependencies (API calls, database)
- [ ] Clean up after tests (reset mocks, close connections)
- [ ] Use descriptive test names
- [ ] Avoid test interdependencies

---

## Quick Reference

| Task | Command |
|------|---------|
| Run tests | `pnpm test` or `npm test` |
| Run tests in watch mode | `pnpm test` (default) |
| Run tests once | `pnpm test:run` |
| Run with UI | `pnpm test:ui` |
| Generate coverage | `pnpm test:coverage` |
| Type check | `pnpm type-check` |

---

Follow these standards to write clean, testable Node.js/JavaScript code with Vitest.
