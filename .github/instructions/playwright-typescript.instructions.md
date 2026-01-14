---
description: 'Guidelines for Playwright with TypeScript development'
applyTo: '**/*.spec.ts, **/*.test.ts, **/e2e/**'
---

# Playwright with TypeScript Development Guidelines

> These instructions assume projects use Playwright for end-to-end testing with TypeScript. Follow these guidelines for writing robust, maintainable browser automation tests.

## Core Principles

- **User-Centric Testing**: Verify behavior from the user's perspective
- **Reliability First**: Write deterministic tests that don't flake
- **Strong Selectors**: Prefer accessibility-focused selectors over CSS
- **Auto-Waiting**: Leverage Playwright's built-in waiting mechanisms
- **Test Isolation**: Each test should be independent

## Project Structure

```
tests/
├── e2e/                  # End-to-end test files
│   ├── auth.spec.ts
│   ├── checkout.spec.ts
│   └── ...
├── fixtures/             # Custom fixtures
│   ├── auth.fixture.ts
│   └── ...
├── pages/                # Page Object Models
│   ├── login.page.ts
│   ├── dashboard.page.ts
│   └── ...
└── utils/                # Test utilities
    ├── test-data.ts
    └── ...
```

## Configuration Best Practices

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Selector Best Practices

### Priority Order (Most Stable → Least Stable)

1. **Role-based selectors** (most stable):
   ```typescript
   await page.getByRole('button', { name: 'Submit' });
   await page.getByRole('link', { name: 'About' });
   await page.getByRole('heading', { name: 'Welcome' });
   ```

2. **Label-based selectors**:
   ```typescript
   await page.getByLabel('Email address');
   await page.getByPlaceholder('Enter your email');
   await page.getByText('Welcome back');
   ```

3. **Test IDs** (when semantic selectors aren't available):
   ```typescript
   await page.getByTestId('submit-button');
   ```

4. **CSS selectors** (last resort):
   ```typescript
   // ❌ Avoid: Brittle and tied to implementation
   await page.locator('.btn-primary');
   ```

## Test Structure

### Basic Pattern

```typescript
import { test, expect } from '@playwright/test';

test('user can complete checkout', async ({ page }) => {
  // Arrange: Navigate and setup
  await page.goto('/checkout');
  
  // Act: Perform user actions
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByRole('button', { name: 'Continue' }).click();
  
  // Assert: Verify outcome
  await expect(page.getByText('Order confirmed')).toBeVisible();
});
```

### Test Organization

```typescript
test.describe('User Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('successful login', async ({ page }) => {
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();
    
    await expect(page).toHaveURL('/dashboard');
  });

  test('failed login shows error', async ({ page }) => {
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpass');
    await page.getByRole('button', { name: 'Log in' }).click();
    
    await expect(page.getByRole('alert')).toContainText('Invalid credentials');
  });
});
```

## Waiting and Assertions

### Auto-Waiting (Preferred)

Playwright automatically waits for elements to be:
- Attached to DOM
- Visible
- Stable (not animating)
- Enabled
- Receiving events

```typescript
// ✅ These automatically wait
await page.click('button');
await page.fill('input', 'text');
await expect(page.locator('div')).toBeVisible();
```

### Explicit Waits (When Needed)

```typescript
// Wait for network
await page.waitForLoadState('networkidle');

// Wait for API response
await page.waitForResponse(response => 
  response.url().includes('/api/users')
);

// Wait for element
await page.waitForSelector('[data-testid="results"]');
```

### Common Assertions

```typescript
// Visibility
await expect(page.getByText('Success')).toBeVisible();
await expect(page.getByText('Error')).not.toBeVisible();

// Text content
await expect(page.getByRole('heading')).toHaveText('Welcome');
await expect(page.getByRole('heading')).toContainText('Wel');

// Count
await expect(page.getByRole('listitem')).toHaveCount(5);

// URL
await expect(page).toHaveURL('/dashboard');
await expect(page).toHaveURL(/.*dashboard/);

// Attribute
await expect(page.getByRole('link')).toHaveAttribute('href', '/about');
```

## Page Object Model

```typescript
// pages/login.page.ts
import { type Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Log in' }).click();
  }

  async getErrorMessage() {
    return this.page.getByRole('alert').textContent();
  }
}

// Usage in test
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';

test('login with invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('bad@email.com', 'wrongpass');
  
  const error = await loginPage.getErrorMessage();
  expect(error).toContain('Invalid credentials');
});
```

## Custom Fixtures

```typescript
// fixtures/auth.fixture.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

type MyFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<MyFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Setup: Login before test
    await page.goto('/login');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();
    
    await use(page);
    
    // Teardown (if needed)
  },
});

// Usage
test('access protected page', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/dashboard');
  await expect(authenticatedPage.getByRole('heading')).toHaveText('Dashboard');
});
```

## API Mocking

```typescript
test('handles API error gracefully', async ({ page }) => {
  await page.route('**/api/users', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });
  });

  await page.goto('/users');
  await expect(page.getByText('Failed to load users')).toBeVisible();
});

test('shows loading state while fetching', async ({ page }) => {
  await page.route('**/api/users', async route => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    await route.fulfill({
      status: 200,
      body: JSON.stringify([{ id: 1, name: 'John' }]),
    });
  });

  await page.goto('/users');
  await expect(page.getByText('Loading...')).toBeVisible();
  await expect(page.getByText('John')).toBeVisible();
});
```

## Debugging

### Debug Mode

```bash
# Run in headed mode with debugger
npx playwright test --debug

# Debug specific test
npx playwright test login.spec.ts --debug
```

### Trace Viewer

```bash
# Generate trace
npx playwright test --trace on

# Open trace viewer
npx playwright show-trace trace.zip
```

### Pause Execution

```typescript
test('debug this test', async ({ page }) => {
  await page.goto('/');
  await page.pause(); // Opens Playwright Inspector
  await page.click('button');
});
```

## Anti-Patterns to Avoid

### ❌ Arbitrary Waits

```typescript
// Bad
await page.waitForTimeout(3000);
await page.click('button');
```

```typescript
// Good
await page.waitForLoadState('networkidle');
await page.click('button');
```

### ❌ Brittle CSS Selectors

```typescript
// Bad
await page.locator('.btn-primary.submit-btn').click();
```

```typescript
// Good
await page.getByRole('button', { name: 'Submit' }).click();
```

### ❌ Test Dependencies

```typescript
// Bad: Tests depend on order
test('create user', async ({ page }) => {
  // Creates user in database
});

test('login with created user', async ({ page }) => {
  // Depends on previous test
});
```

```typescript
// Good: Each test is independent
test('create and login', async ({ page }) => {
  // Create user
  // Login with that user
  // Clean up
});
```

### ❌ Testing Implementation Details

```typescript
// Bad
test('button has correct class', async ({ page }) => {
  const button = page.locator('.btn');
  expect(await button.getAttribute('class')).toContain('btn-primary');
});
```

```typescript
// Good
test('user can submit form', async ({ page }) => {
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Form submitted')).toBeVisible();
});
```

## Common Scenarios

### Form Submission

```typescript
test('user can submit contact form', async ({ page }) => {
  await page.goto('/contact');
  
  await page.getByLabel('Name').fill('John Doe');
  await page.getByLabel('Email').fill('john@example.com');
  await page.getByLabel('Message').fill('Hello!');
  await page.getByRole('button', { name: 'Send' }).click();
  
  await expect(page.getByText('Message sent successfully')).toBeVisible();
});
```

### File Upload

```typescript
test('user can upload file', async ({ page }) => {
  await page.goto('/upload');
  
  const fileInput = page.getByLabel('Choose file');
  await fileInput.setInputFiles('path/to/file.pdf');
  
  await page.getByRole('button', { name: 'Upload' }).click();
  await expect(page.getByText('File uploaded')).toBeVisible();
});
```

### Authentication State

```typescript
test('login persists across navigation', async ({ page, context }) => {
  await page.goto('/login');
  
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Log in' }).click();
  
  // Save auth state
  await context.storageState({ path: 'auth.json' });
  
  await page.goto('/dashboard');
  await expect(page.getByText('Welcome back')).toBeVisible();
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      
      - name: Run Playwright tests
        run: npx playwright test
      
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

## Best Practices Checklist

### Before Writing Tests
- [ ] Understand the user flow being tested
- [ ] Review existing tests for similar scenarios
- [ ] Determine which browsers/devices to test

### While Writing Tests
- [ ] Use strong, accessible selectors
- [ ] Ensure test independence
- [ ] Test user behavior, not implementation
- [ ] Avoid arbitrary waits

### After Writing Tests
- [ ] Verify tests pass consistently
- [ ] Use descriptive test names
- [ ] Clean up test data
- [ ] Add tests to CI pipeline

## Remember

- Tests are documentation of how the system works
- Flaky tests are bugs — fix them immediately
- Fast feedback matters — optimize for speed without sacrificing reliability
- User perspective wins — test what users can do
- Maintenance is ongoing — keep tests aligned with UI changes
