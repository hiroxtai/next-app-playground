---
description: 'TypeScript 5.x development guidelines with ES2022+ features'
applyTo: '**/*.ts, **/*.tsx'
---

# TypeScript 5.x Development Guidelines

> Modern TypeScript development with ES2022+ features, type safety, and best practices

## TypeScript Version

- **Target**: TypeScript 5.x (5.0+)
- **ECMAScript Target**: ES2022
- **Strict Mode**: Always enabled

---

## Type Safety

### 1. Strict Type Checking

Always enable strict mode in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### 2. Avoid `any`

```typescript
// ❌ Bad: Loses type safety
function processData(data: any) {
  return data.someProperty;
}

// ✅ Good: Use specific types
interface UserData {
  id: string;
  name: string;
}

function processData(data: UserData) {
  return data.name;
}

// ✅ Good: Use `unknown` when type is truly unknown
function processUnknown(data: unknown) {
  if (typeof data === 'object' && data !== null && 'name' in data) {
    return (data as { name: string }).name;
  }
  throw new Error('Invalid data');
}
```

### 3. Prefer `type` over `interface` for Unions

```typescript
// ✅ Good: Use `type` for unions and intersections
type Status = 'pending' | 'success' | 'error';

type UserRole = 'admin' | 'user' | 'guest';

type Result = SuccessResult | ErrorResult;

// ✅ Good: Use `interface` for object shapes (can be extended)
interface User {
  id: string;
  name: string;
}

interface AdminUser extends User {
  permissions: string[];
}
```

---

## Modern TypeScript Features (TS 5.x)

### 1. `const` Type Parameters (TS 5.0)

```typescript
// ✅ Preserves literal types
function createConfig<const T extends readonly string[]>(values: T) {
  return values;
}

const config = createConfig(['a', 'b', 'c'] as const);
// Type: readonly ["a", "b", "c"] (not string[])
```

### 2. Decorators (TS 5.0)

```typescript
// ✅ Use modern decorators (Stage 3 proposal)
function log(target: any, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);
  
  return function (this: any, ...args: any[]) {
    console.log(`Calling ${methodName} with args:`, args);
    const result = target.call(this, ...args);
    console.log(`Result:`, result);
    return result;
  };
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b;
  }
}
```

### 3. `satisfies` Operator (TS 4.9+)

```typescript
// ✅ Good: Validate type while preserving specific type
type Color = 'red' | 'green' | 'blue';

const config = {
  primary: 'red',
  secondary: 'green',
} satisfies Record<string, Color>;

// Type is inferred as { primary: 'red'; secondary: 'green' }
// (not Record<string, Color>)

// ❌ Bad: Loses specific types
const config2: Record<string, Color> = {
  primary: 'red',
  secondary: 'green',
};
// Type is Record<string, Color> (loses 'red' and 'green' literals)
```

### 4. Template Literal Types

```typescript
// ✅ Good: Type-safe string patterns
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Endpoint = '/users' | '/posts';
type Route = `${HTTPMethod} ${Endpoint}`;

// Valid: 'GET /users', 'POST /posts', etc.
const route: Route = 'GET /users';

// Type-safe CSS properties
type CSSProperty = `--${string}`;
const customProp: CSSProperty = '--primary-color'; // ✅
// const invalid: CSSProperty = 'color'; // ❌ Error
```

---

## ES2022+ Features

### 1. Top-Level `await`

```typescript
// ✅ Good: Use top-level await in ES modules
const config = await fetch('/api/config').then(r => r.json());

export const API_KEY = config.apiKey;
```

### 2. Class Fields (Public & Private)

```typescript
class User {
  // ✅ Public field
  public name: string;
  
  // ✅ Private field (runtime privacy)
  #password: string;
  
  // ✅ Private TypeScript field (compile-time only)
  private email: string;
  
  constructor(name: string, password: string, email: string) {
    this.name = name;
    this.#password = password;
    this.email = email;
  }
  
  // ✅ Private method
  #hashPassword(password: string): string {
    return `hashed_${password}`;
  }
  
  verifyPassword(input: string): boolean {
    return this.#hashPassword(input) === this.#password;
  }
}
```

### 3. Nullish Coalescing (`??`)

```typescript
// ✅ Good: Use `??` for null/undefined checks
const port = process.env.PORT ?? 3000;

// ❌ Bad: `||` treats 0, '', false as falsy
const port2 = process.env.PORT || 3000; // Bug if PORT is '0'
```

### 4. Optional Chaining (`?.`)

```typescript
// ✅ Good: Safe property access
const userName = user?.profile?.name;

// ✅ Good: Safe method call
const result = obj.method?.();

// ✅ Good: Safe array access
const firstItem = array?.[0];
```

### 5. Logical Assignment (`&&=`, `||=`, `??=`)

```typescript
// ✅ Good: Assign only if falsy
let config = null;
config ??= getDefaultConfig();

// ✅ Good: Assign only if truthy
let cacheEnabled = true;
cacheEnabled &&= isProduction();

// ✅ Good: Assign if falsy (including 0, '')
let retries = 0;
retries ||= 3;
```

---

## Utility Types

### 1. Built-in Utility Types

```typescript
// ✅ Use TypeScript's built-in utilities

// Partial: Make all properties optional
type PartialUser = Partial<User>;

// Required: Make all properties required
type RequiredUser = Required<PartialUser>;

// Readonly: Make all properties read-only
type ReadonlyUser = Readonly<User>;

// Pick: Select specific properties
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit: Exclude specific properties
type UserWithoutPassword = Omit<User, 'password'>;

// Record: Create object type with specific keys and values
type UserRoles = Record<string, 'admin' | 'user'>;

// ReturnType: Extract function return type
type FetchResult = ReturnType<typeof fetchUser>;

// Parameters: Extract function parameter types
type FetchParams = Parameters<typeof fetchUser>;

// Awaited: Unwrap Promise type
type UserData = Awaited<ReturnType<typeof fetchUser>>;
```

### 2. Custom Utility Types

```typescript
// ✅ Good: Create reusable utility types

// Make specific properties optional
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type UserWithOptionalEmail = Optional<User, 'email'>;

// Deep Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Non-nullable
type NonNullable<T> = T extends null | undefined ? never : T;
```

---

## Generics

### 1. Generic Functions

```typescript
// ✅ Good: Generic function with constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: '123', name: 'Alice' };
const id = getProperty(user, 'id'); // Type: string

// ✅ Good: Multiple type parameters
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}
```

### 2. Generic Constraints

```typescript
// ✅ Good: Constrain generic to specific shape
interface Identifiable {
  id: string;
}

function findById<T extends Identifiable>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

// ✅ Good: Constrain to constructor
function create<T>(constructor: new () => T): T {
  return new constructor();
}
```

---

## Type Guards

### 1. User-Defined Type Guards

```typescript
// ✅ Good: Type guard function
interface User {
  type: 'user';
  name: string;
}

interface Admin {
  type: 'admin';
  name: string;
  permissions: string[];
}

type Person = User | Admin;

function isAdmin(person: Person): person is Admin {
  return person.type === 'admin';
}

function greet(person: Person) {
  if (isAdmin(person)) {
    console.log(`Admin ${person.name} has permissions:`, person.permissions);
  } else {
    console.log(`User ${person.name}`);
  }
}
```

### 2. Discriminated Unions

```typescript
// ✅ Good: Use discriminated unions for exhaustive checks
type ApiResponse =
  | { status: 'loading' }
  | { status: 'success'; data: string }
  | { status: 'error'; error: Error };

function handleResponse(response: ApiResponse) {
  switch (response.status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return response.data;
    case 'error':
      return response.error.message;
    default:
      // Exhaustiveness check
      const _exhaustive: never = response;
      return _exhaustive;
  }
}
```

---

## Best Practices

### 1. Avoid Type Assertions

```typescript
// ❌ Bad: Type assertion without validation
const user = data as User;

// ✅ Good: Validate before asserting
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    typeof data.id === 'string'
  );
}

if (isUser(data)) {
  const user = data; // Type: User
}
```

### 2. Immutable Data Structures

```typescript
// ✅ Good: Use readonly for immutable arrays
function sum(numbers: readonly number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

// ✅ Good: Use Readonly for immutable objects
function processConfig(config: Readonly<Config>) {
  // config.apiKey = 'new-key'; // ❌ Error: readonly
}

// ✅ Good: Use const assertions
const COLORS = ['red', 'green', 'blue'] as const;
type Color = typeof COLORS[number]; // 'red' | 'green' | 'blue'
```

### 3. Prefer `unknown` over `any`

```typescript
// ❌ Bad: `any` disables type checking
function parse(input: any) {
  return input.toUpperCase(); // No error even if input is a number
}

// ✅ Good: `unknown` requires type checking
function parse(input: unknown) {
  if (typeof input === 'string') {
    return input.toUpperCase();
  }
  throw new Error('Expected string');
}
```

---

## Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    // Language
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowJs": true,
    
    // Strict Type Checking
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    
    // Additional Checks
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    
    // Module Resolution
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    
    // Emit
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,
    "importHelpers": true,
    
    // Advanced
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

## Quick Reference

| Feature | Syntax | Use Case |
|---------|--------|----------|
| Type alias | `type Point = { x: number; y: number; }` | Unions, intersections, primitives |
| Interface | `interface User { id: string; }` | Object shapes, extendable |
| Union | `type Status = 'on' \| 'off'` | Multiple possible types |
| Intersection | `type AB = A & B` | Combine types |
| Generics | `function identity<T>(x: T): T` | Reusable, type-safe functions |
| Type guard | `function isString(x: any): x is string` | Runtime type checking |
| `satisfies` | `const x = {...} satisfies Type` | Validate + preserve type |
| `as const` | `const arr = [1, 2] as const` | Readonly literal types |
| `??` | `const x = a ?? b` | Nullish coalescing |
| `?.` | `const x = obj?.prop` | Optional chaining |

---

Follow these guidelines to write type-safe, maintainable TypeScript code that leverages the latest features.
