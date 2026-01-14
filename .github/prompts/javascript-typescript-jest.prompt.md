---
description: 'Guide for writing Jest or Vitest tests for JavaScript and TypeScript code'
---

# Writing Jest/Vitest Tests

You are tasked with creating comprehensive unit tests using Jest or Vitest for JavaScript or TypeScript code. Follow these guidelines to ensure high-quality, maintainable test coverage.

## Test Structure Best Practices

### Basic Test Pattern

```javascript
import { describe, it, expect } from 'vitest'; // or from '@jest/globals'
import { functionToTest } from './module';

describe('functionToTest', () => {
  it('should return expected value for valid input', () => {
    const result = functionToTest('validInput');
    expect(result).toBe('expectedOutput');
  });

  it('should handle edge case gracefully', () => {
    const result = functionToTest('');
    expect(result).toBe(null);
  });

  it('should throw error for invalid input', () => {
    expect(() => functionToTest(null)).toThrow('Invalid input');
  });
});
```

### AAA Pattern (Arrange, Act, Assert)

```javascript
it('should calculate total price with tax', () => {
  // Arrange: Set up test data
  const basePrice = 100;
  const taxRate = 0.1;

  // Act: Execute the function
  const result = calculateTotal(basePrice, taxRate);

  // Assert: Verify the outcome
  expect(result).toBe(110);
});
```

## Common Test Scenarios

### Testing Functions

```javascript
describe('sum', () => {
  it('should add two positive numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(sum(-2, 3)).toBe(1);
  });

  it('should return NaN for non-numeric input', () => {
    expect(sum('a', 'b')).toBeNaN();
  });
});
```

### Testing Async Functions

```javascript
describe('fetchUser', () => {
  it('should return user data', async () => {
    const user = await fetchUser(1);
    expect(user).toEqual({ id: 1, name: 'John' });
  });

  it('should throw error for invalid ID', async () => {
    await expect(fetchUser(-1)).rejects.toThrow('Invalid ID');
  });
});
```

### Testing Classes

```javascript
describe('Calculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  it('should add numbers correctly', () => {
    expect(calculator.add(2, 3)).toBe(5);
  });

  it('should maintain calculation history', () => {
    calculator.add(2, 3);
    calculator.add(5, 10);
    expect(calculator.history).toHaveLength(2);
  });
});
```

## Mocking

### Mocking Functions

```javascript
import { vi } from 'vitest'; // or jest.fn() for Jest

it('should call callback with result', () => {
  const callback = vi.fn();
  processData('input', callback);
  
  expect(callback).toHaveBeenCalledWith('processed: input');
  expect(callback).toHaveBeenCalledTimes(1);
});
```

### Mocking Modules

```javascript
// Vitest
vi.mock('./api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'mocked' })),
}));

// Jest
jest.mock('./api', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: 'mocked' })),
}));

it('should use mocked API', async () => {
  const result = await getData();
  expect(result).toEqual({ data: 'mocked' });
});
```

### Mocking Timers

```javascript
import { vi } from 'vitest';

it('should execute callback after delay', () => {
  vi.useFakeTimers();
  const callback = vi.fn();
  
  setTimeout(callback, 1000);
  vi.advanceTimersByTime(1000);
  
  expect(callback).toHaveBeenCalledTimes(1);
  vi.useRealTimers();
});
```

## Matchers

### Common Matchers

```javascript
// Equality
expect(value).toBe(4);              // Strict equality (===)
expect(value).toEqual({ a: 1 });    // Deep equality
expect(value).not.toBe(3);

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(3.5);
expect(value).toBeLessThan(5);
expect(value).toBeCloseTo(0.3);     // Floating point comparison

// Strings
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');

// Arrays
expect(array).toContain('item');
expect(array).toHaveLength(3);

// Objects
expect(object).toHaveProperty('key');
expect(object).toMatchObject({ a: 1 });

// Errors
expect(() => fn()).toThrow();
expect(() => fn()).toThrow(Error);
expect(() => fn()).toThrow('error message');
```

## Test Organization

### Grouping with describe

```javascript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', () => {
      // Test implementation
    });

    it('should reject invalid email', () => {
      // Test implementation
    });
  });

  describe('deleteUser', () => {
    it('should delete existing user', () => {
      // Test implementation
    });
  });
});
```

### Setup and Teardown

```javascript
describe('Database tests', () => {
  beforeAll(async () => {
    // Run once before all tests
    await connectDatabase();
  });

  afterAll(async () => {
    // Run once after all tests
    await disconnectDatabase();
  });

  beforeEach(() => {
    // Run before each test
    db.clear();
  });

  afterEach(() => {
    // Run after each test
    // Cleanup
  });

  it('should insert record', () => {
    // Test implementation
  });
});
```

## Testing React Components (with Vitest)

```javascript
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import Button from './Button';

it('should render button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});

it('should call onClick when clicked', async () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  await userEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Best Practices

1. **Test Naming**: Use descriptive names that explain what is being tested
   ```javascript
   // ❌ Bad
   it('test1', () => {});
   
   // ✅ Good
   it('should return null when input is empty string', () => {});
   ```

2. **One Assertion Per Test**: Keep tests focused
   ```javascript
   // ❌ Bad
   it('should handle user operations', () => {
     expect(createUser()).toBeTruthy();
     expect(deleteUser()).toBeTruthy();
     expect(updateUser()).toBeTruthy();
   });
   
   // ✅ Good
   it('should create user successfully', () => {
     expect(createUser()).toBeTruthy();
   });
   
   it('should delete user successfully', () => {
     expect(deleteUser()).toBeTruthy();
   });
   ```

3. **Avoid Test Interdependence**: Each test should be independent
   ```javascript
   // ❌ Bad
   let user;
   it('should create user', () => {
     user = createUser();
   });
   it('should update user', () => {
     updateUser(user); // Depends on previous test
   });
   
   // ✅ Good
   it('should update user', () => {
     const user = createUser();
     expect(updateUser(user)).toBeTruthy();
   });
   ```

4. **Use beforeEach for Common Setup**
   ```javascript
   describe('UserService', () => {
     let userService;
     
     beforeEach(() => {
       userService = new UserService();
     });
     
     it('should create user', () => {
       expect(userService.create({ name: 'John' })).toBeTruthy();
     });
   });
   ```

5. **Test Edge Cases and Error Conditions**
   ```javascript
   describe('divide', () => {
     it('should divide two numbers', () => {
       expect(divide(10, 2)).toBe(5);
     });
     
     it('should throw error when dividing by zero', () => {
       expect(() => divide(10, 0)).toThrow('Division by zero');
     });
     
     it('should handle negative numbers', () => {
       expect(divide(-10, 2)).toBe(-5);
     });
   });
   ```

## Coverage Goals

Aim for comprehensive coverage:
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

Run coverage reports:
```bash
# Vitest
npm run test -- --coverage

# Jest
npm run test -- --coverage
```

## Common Pitfalls to Avoid

1. ❌ **Testing implementation details instead of behavior**
2. ❌ **Writing tests that are too brittle**
3. ❌ **Not testing edge cases**
4. ❌ **Ignoring async/await properly**
5. ❌ **Not cleaning up mocks and timers**
6. ❌ **Having tests depend on execution order**

## Checklist

Before considering tests complete:
- [ ] All critical paths are tested
- [ ] Edge cases and error conditions are covered
- [ ] Tests are independent and can run in any order
- [ ] Test names are descriptive
- [ ] Mocks and spies are properly cleaned up
- [ ] Async operations are properly awaited
- [ ] Tests run fast (no unnecessary delays)
- [ ] Coverage meets project standards

## Example: Complete Test File

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from './UserService';
import { Database } from './Database';

// Mock the database
vi.mock('./Database');

describe('UserService', () => {
  let userService;
  let mockDb;

  beforeEach(() => {
    mockDb = new Database();
    userService = new UserService(mockDb);
  });

  describe('createUser', () => {
    it('should create user with valid data', async () => {
      const userData = { name: 'John', email: 'john@example.com' };
      mockDb.insert.mockResolvedValue({ id: 1, ...userData });

      const result = await userService.createUser(userData);

      expect(result).toEqual({ id: 1, ...userData });
      expect(mockDb.insert).toHaveBeenCalledWith('users', userData);
    });

    it('should throw error for invalid email', async () => {
      const userData = { name: 'John', email: 'invalid' };

      await expect(userService.createUser(userData))
        .rejects.toThrow('Invalid email format');
    });

    it('should throw error when name is missing', async () => {
      const userData = { email: 'john@example.com' };

      await expect(userService.createUser(userData))
        .rejects.toThrow('Name is required');
    });
  });

  describe('getUser', () => {
    it('should return user by ID', async () => {
      const mockUser = { id: 1, name: 'John', email: 'john@example.com' };
      mockDb.findById.mockResolvedValue(mockUser);

      const result = await userService.getUser(1);

      expect(result).toEqual(mockUser);
      expect(mockDb.findById).toHaveBeenCalledWith('users', 1);
    });

    it('should return null for non-existent user', async () => {
      mockDb.findById.mockResolvedValue(null);

      const result = await userService.getUser(999);

      expect(result).toBeNull();
    });
  });
});
```

Remember: Good tests are:
- **Fast**: Run quickly
- **Independent**: Don't depend on other tests
- **Repeatable**: Same results every time
- **Self-validating**: Pass or fail clearly
- **Timely**: Written alongside the code
