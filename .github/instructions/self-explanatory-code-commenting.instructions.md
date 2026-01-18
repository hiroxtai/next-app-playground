---
description: 'Code commenting best practices and guidelines for self-documenting code'
applyTo: '**/*.ts, **/*.tsx, **/*.js, **/*.jsx'
---

# Self-Explanatory Code and Commenting Guidelines

> Write code that explains itself. When comments are necessary, make them count.

## Core Philosophy

**Good code doesn't need comments. Great comments explain why, not what.**

- **Self-Documenting Code**: Variable names, function names, and structure should explain what the code does
- **Comments for Context**: Comments should explain WHY, not WHAT
- **Code Over Comments**: If you need a comment to explain what code does, refactor the code first

---

## When NOT to Comment

### 1. Obvious Code

```typescript
// ❌ Bad: Comment states the obvious
// Increment counter by 1
counter++;

// ❌ Bad: Comment repeats function name
// Gets the user by ID
function getUserById(id: string) {
  return db.user.findUnique({ where: { id } });
}

// ✅ Good: No comment needed
counter++;
function getUserById(id: string) {
  return db.user.findUnique({ where: { id } });
}
```

### 2. Self-Explanatory Names

```typescript
// ❌ Bad: Need comment because names are unclear
// Check if user has permission
if (u.p.includes('admin')) {
  // ...
}

// ✅ Good: No comment needed
if (user.permissions.includes('admin')) {
  // ...
}

// ❌ Bad: Comment explains cryptic logic
// Check if the date is more than 30 days ago
if ((Date.now() - d) > 2592000000) {
  // ...
}

// ✅ Good: Extract to named function
const DAYS_IN_MS = 24 * 60 * 60 * 1000;
const THIRTY_DAYS_IN_MS = 30 * DAYS_IN_MS;

function isOlderThan30Days(date: Date): boolean {
  return Date.now() - date.getTime() > THIRTY_DAYS_IN_MS;
}

if (isOlderThan30Days(lastLoginDate)) {
  // ...
}
```

---

## When TO Comment

### 1. WHY, Not WHAT

```typescript
// ✅ Good: Explains business logic WHY
// Users expect prices in their local currency,
// but we store everything in USD for consistency
function convertToLocalCurrency(priceInUSD: number, currency: string) {
  return priceInUSD * getExchangeRate(currency);
}

// ✅ Good: Explains non-obvious decision
// We use a debounce instead of throttle here because we want
// to wait until the user stops typing before making an API call
const debouncedSearch = debounce(searchAPI, 300);

// ✅ Good: Explains workaround for bug
// HACK: Safari doesn't support ResizeObserver properly,
// so we use a polyfill. Remove when Safari 16+ is minimum version.
if (!('ResizeObserver' in window)) {
  await import('resize-observer-polyfill');
}
```

### 2. Complex Algorithms

```typescript
// ✅ Good: High-level algorithm explanation
/**
 * Implements the Knuth-Morris-Pratt string matching algorithm
 * for efficient substring search. Time complexity: O(n+m)
 * where n is the text length and m is the pattern length.
 */
function kmpSearch(text: string, pattern: string): number {
  // Build failure function for pattern
  const failureFunction = buildFailureFunction(pattern);
  
  // Search using failure function to skip unnecessary comparisons
  let textIndex = 0;
  let patternIndex = 0;
  
  while (textIndex < text.length) {
    if (text[textIndex] === pattern[patternIndex]) {
      if (patternIndex === pattern.length - 1) {
        return textIndex - patternIndex;
      }
      textIndex++;
      patternIndex++;
    } else if (patternIndex > 0) {
      patternIndex = failureFunction[patternIndex - 1];
    } else {
      textIndex++;
    }
  }
  
  return -1;
}
```

### 3. API Documentation (JSDoc)

```typescript
/**
 * Fetches user data from the API with optional caching.
 * 
 * @param userId - The unique identifier for the user
 * @param options - Configuration options
 * @param options.cache - Whether to use cached data if available
 * @param options.includeDeleted - Whether to include soft-deleted users
 * @returns Promise resolving to user data or null if not found
 * 
 * @throws {AuthenticationError} If the current user is not authenticated
 * @throws {AuthorizationError} If the current user lacks permission
 * 
 * @example
 * ```typescript
 * const user = await fetchUser('123', { cache: true });
 * if (user) {
 *   console.log(user.name);
 * }
 * ```
 */
async function fetchUser(
  userId: string,
  options: { cache?: boolean; includeDeleted?: boolean } = {}
): Promise<User | null> {
  // Implementation
}
```

### 4. TODOs and FIXMEs

```typescript
// TODO: Refactor this to use the new authentication service
// once it's deployed to production (ETA: Q2 2024)
function legacyAuth() {
  // ...
}

// FIXME: This has a race condition when multiple tabs are open
// Tracked in issue #123
let sharedState = {};

// HACK: Temporary workaround for IE11 compatibility
// Remove when IE11 support is dropped (2024-06-01)
if (isIE11()) {
  usePolyfill();
}

// PERF: This is O(n²), consider optimizing to O(n log n)
// if lists grow beyond 1000 items
function sortUsers(users: User[]) {
  // Bubble sort implementation
}

// SECURITY: Never log this in production - contains PII
console.log('User data:', userData);
```

### 5. Warnings and Gotchas

```typescript
// ⚠️ WARNING: Order matters! Don't rearrange these middleware
// Router must come before error handler, and auth before router
app.use(authMiddleware);
app.use(router);
app.use(errorHandler);

// ⚠️ NOTE: This mutation is intentional for performance reasons
// Creating new objects here would cause excessive GC pressure
function optimizedUpdate(data: Data[]) {
  for (let i = 0; i < data.length; i++) {
    data[i].processed = true; // Mutating for performance
  }
}

// ⚠️ IMPORTANT: Do not remove this seemingly unused import
// It registers the custom element globally
import './components/CustomElement'; // Side effect import
```

---

## Comment Annotations

### Standard Annotations

```typescript
// TODO: Task that should be done eventually
// TODO(username): Assign responsibility
// TODO: Implement pagination when we hit 10k users

// FIXME: Known bug that needs fixing
// FIXME: Race condition in concurrent updates

// HACK: Temporary workaround that should be refactored
// HACK: Works around bug in library v2.1.0

// NOTE: Additional context or explanation
// NOTE: This differs from the spec due to real-world constraints

// WARNING: Important warning to prevent mistakes
// WARNING: Changing this will break backward compatibility

// PERF: Performance consideration
// PERF: Caching here reduces DB calls by 90%

// SECURITY: Security-related comment
// SECURITY: Sanitize this before rendering to prevent XSS
```

---

## Code Structure as Documentation

### 1. Descriptive Names

```typescript
// ❌ Bad: Unclear names
function proc(u: any, d: any) {
  const r = u.id * d.t;
  return r > 100 ? 1 : 0;
}

// ✅ Good: Self-documenting
function calculateUserPriority(user: User, data: ActivityData): Priority {
  const activityScore = user.id * data.totalActions;
  const isHighPriority = activityScore > PRIORITY_THRESHOLD;
  return isHighPriority ? Priority.High : Priority.Low;
}
```

### 2. Small Functions

```typescript
// ❌ Bad: Large function doing too much
function processOrder(order: Order) {
  // 100 lines of validation
  // 50 lines of price calculation
  // 75 lines of inventory check
  // 60 lines of payment processing
}

// ✅ Good: Broken into focused functions
function processOrder(order: Order) {
  validateOrder(order);
  const total = calculateTotal(order);
  checkInventory(order.items);
  processPayment(order.customerId, total);
}
```

### 3. Guard Clauses

```typescript
// ❌ Bad: Nested ifs hide intent
function processUser(user: User | null) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission('write')) {
        // Do something
      }
    }
  }
}

// ✅ Good: Guard clauses make requirements clear
function processUser(user: User | null) {
  if (!user) return;
  if (!user.isActive) return;
  if (!user.hasPermission('write')) return;
  
  // Do something
}
```

### 4. Named Constants

```typescript
// ❌ Bad: Magic numbers
if (user.age < 13) {
  return 'Too young';
}

if (attempts > 3) {
  lockAccount();
}

// ✅ Good: Named constants
const MINIMUM_AGE = 13;
const MAX_LOGIN_ATTEMPTS = 3;

if (user.age < MINIMUM_AGE) {
  return 'Too young';
}

if (attempts > MAX_LOGIN_ATTEMPTS) {
  lockAccount();
}
```

---

## Anti-Patterns

### 1. Commented-Out Code

```typescript
// ❌ Bad: Don't leave commented-out code
function calculateTotal(items: Item[]) {
  // const tax = items.reduce((sum, item) => sum + item.price * 0.1, 0);
  // return items.reduce((sum, item) => sum + item.price, 0) + tax;
  
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Good: Use version control, delete old code
function calculateTotal(items: Item[]) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### 2. Redundant Comments

```typescript
// ❌ Bad: Comments that add no value
// This is a user interface
interface UserInterface {
  // User's first name
  firstName: string;
  // User's last name
  lastName: string;
}

// ✅ Good: Types document themselves
interface UserProfile {
  firstName: string;
  lastName: string;
}
```

### 3. Outdated Comments

```typescript
// ❌ Bad: Comment doesn't match code
// Return user's age in years
function getUserInfo(id: string) {
  return db.user.findUnique({
    where: { id },
    select: { name: true, email: true } // Returns name and email, not age!
  });
}

// ✅ Good: Comment matches code (or remove comment if obvious)
function getUserBasicInfo(id: string) {
  return db.user.findUnique({
    where: { id },
    select: { name: true, email: true }
  });
}
```

---

## Documentation Comments (JSDoc/TSDoc)

### Function Documentation

```typescript
/**
 * Calculates the total price including tax and shipping.
 * 
 * @param items - Array of items in the cart
 * @param shippingAddress - Delivery address for shipping calculation
 * @returns Object containing subtotal, tax, shipping, and total
 * 
 * @remarks
 * Tax rates vary by state. Shipping is free for orders over $50.
 * 
 * @example
 * ```typescript
 * const result = calculateOrderTotal(
 *   [{ id: '1', price: 29.99 }],
 *   { state: 'CA', zip: '90210' }
 * );
 * console.log(result.total); // 32.24
 * ```
 */
function calculateOrderTotal(
  items: CartItem[],
  shippingAddress: Address
): OrderTotal {
  // Implementation
}
```

### Type Documentation

```typescript
/**
 * Represents a user in the system.
 * 
 * @remarks
 * Users are soft-deleted by setting `deletedAt` timestamp.
 * Active users have `deletedAt` as null.
 */
interface User {
  /** Unique identifier generated by the database */
  id: string;
  
  /** User's email address (unique, used for login) */
  email: string;
  
  /** 
   * ISO 8601 timestamp of when user was soft-deleted.
   * Null for active users.
   */
  deletedAt: string | null;
}
```

---

## Best Practices

### 1. Comments Should Age Well

```typescript
// ❌ Bad: Will become outdated quickly
// As of January 2024, this is the recommended approach

// ✅ Good: Timeless reasoning
// We use POST instead of GET because the request body can exceed URL length limits
```

### 2. Explain Decisions, Not Implementations

```typescript
// ❌ Bad: Explains WHAT (redundant)
// Loop through all users
for (const user of users) {
  // ...
}

// ✅ Good: Explains WHY (valuable)
// We process users sequentially to avoid overwhelming the email service
// with concurrent requests
for (const user of users) {
  await sendEmail(user);
}
```

### 3. Link to External Resources

```typescript
// ✅ Good: Links to spec or docs
// Implements OAuth 2.0 PKCE flow as specified in RFC 7636
// https://datatracker.ietf.org/doc/html/rfc7636
function generatePKCEChallenge() {
  // ...
}

// ✅ Good: Links to issue tracker
// Workaround for upstream bug in library-name v2.1.0
// See: https://github.com/library/issues/123
if (needsWorkaround()) {
  // ...
}
```

---

## Review Checklist

Before committing code, review comments:

- [ ] Do comments explain WHY, not WHAT?
- [ ] Are variable/function names clear enough to remove comments?
- [ ] Are comments up-to-date with the code?
- [ ] Are there any commented-out code blocks? (Remove them)
- [ ] Are TODOs assigned and tracked?
- [ ] Do JSDoc comments match function signatures?
- [ ] Are complex algorithms explained at a high level?
- [ ] Are business logic decisions documented?

---

## Remember

- **Code is read 10x more than it's written** - optimize for readers
- **Comments lie, code doesn't** - keep comments in sync with code
- **Refactor before commenting** - if you need a comment, can you make the code clearer instead?
- **Comments are not a substitute for clean code** - write self-documenting code first
- **Good comments add context** - explain the "why" that code can't express
