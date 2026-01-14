---
description: 'Guide for generating Playwright tests based on website exploration'
---

# Playwright: Generate Tests from Exploration

You are tasked with creating comprehensive Playwright tests based on website exploration findings. Use the documentation from the exploration phase to generate robust, maintainable test suites.

## Prerequisites

Before generating tests, ensure you have:
- ✅ Website exploration document
- ✅ User flows mapped
- ✅ Selectors documented
- ✅ Test data requirements identified
- ✅ Edge cases cataloged

## Test Generation Workflow

### 1. Setup Test Project Structure

Create a well-organized test directory:

```
tests/
├── e2e/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   ├── signup.spec.ts
│   │   └── logout.spec.ts
│   ├── products/
│   │   ├── browse.spec.ts
│   │   ├── search.spec.ts
│   │   └── details.spec.ts
│   └── checkout/
│       ├── cart.spec.ts
│       └── purchase.spec.ts
├── fixtures/
│   ├── auth.fixture.ts
│   └── test-data.ts
├── pages/
│   ├── login.page.ts
│   ├── product.page.ts
│   └── checkout.page.ts
└── utils/
    └── helpers.ts
```

### 2. Create Page Objects

For each major page, create a Page Object Model:

```typescript
// pages/login.page.ts
import { type Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async fillEmail(email: string) {
    await this.page.getByLabel('Email address').fill(email);
  }

  async fillPassword(password: string) {
    await this.page.getByLabel('Password').fill(password);
  }

  async submit() {
    await this.page.getByRole('button', { name: 'Log in' }).click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  async getErrorMessage() {
    return this.page.getByRole('alert').textContent();
  }

  async isLoggedIn() {
    return this.page.getByRole('button', { name: 'Log out' }).isVisible();
  }
}
```

### 3. Create Test Data Fixtures

Centralize test data:

```typescript
// fixtures/test-data.ts
export const testUsers = {
  valid: {
    email: 'user@example.com',
    password: 'password123',
  },
  invalid: {
    email: 'bad@example.com',
    password: 'wrongpass',
  },
  admin: {
    email: 'admin@example.com',
    password: 'admin123',
  },
};

export const testProducts = {
  book1: { id: 1, title: 'Test Book', price: 19.99 },
  book2: { id: 2, title: 'Another Book', price: 29.99 },
};
```

### 4. Generate Tests from User Flows

For each documented user flow, create a test file:

#### Example: Login Tests

```typescript
// e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { testUsers } from '../../fixtures/test-data';

test.describe('User Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('successful login with valid credentials', async ({ page }) => {
    await loginPage.login(testUsers.valid.email, testUsers.valid.password);

    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Verify user is logged in
    await expect(page.getByRole('button', { name: 'Log out' })).toBeVisible();
    
    // Verify welcome message
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('failed login with invalid email', async () => {
    await loginPage.login('invalid@example.com', testUsers.valid.password);

    // Verify error message
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Invalid credentials');
    
    // Verify still on login page
    await expect(loginPage.page).toHaveURL('/login');
  });

  test('failed login with invalid password', async () => {
    await loginPage.login(testUsers.valid.email, 'wrongpassword');

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Invalid credentials');
  });

  test('failed login with empty fields', async () => {
    await loginPage.submit();

    // Verify validation messages
    await expect(loginPage.page.getByText('Email is required')).toBeVisible();
    await expect(loginPage.page.getByText('Password is required')).toBeVisible();
  });

  test('password field is masked', async ({ page }) => {
    const passwordInput = page.getByLabel('Password');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('remember me checkbox persists login', async ({ context, page }) => {
    await loginPage.login(testUsers.valid.email, testUsers.valid.password);
    
    // Save auth state
    await context.storageState({ path: 'auth.json' });

    // Open new page with saved state
    const newPage = await context.newPage();
    await newPage.goto('/dashboard');
    
    // Verify still logged in
    await expect(newPage.getByRole('button', { name: 'Log out' })).toBeVisible();
  });
});
```

#### Example: E-commerce Purchase Flow

```typescript
// e2e/checkout/purchase.spec.ts
import { test, expect } from '@playwright/test';
import { ProductPage } from '../../pages/product.page';
import { CartPage } from '../../pages/cart.page';
import { CheckoutPage } from '../../pages/checkout.page';
import { testProducts } from '../../fixtures/test-data';

test.describe('Product Purchase Flow', () => {
  test.use({ storageState: 'auth.json' }); // Use authenticated state

  test('complete purchase of single product', async ({ page }) => {
    // Step 1: Browse and select product
    const productPage = new ProductPage(page);
    await productPage.goto(testProducts.book1.id);
    
    await expect(page.getByRole('heading')).toHaveText(testProducts.book1.title);
    await expect(page.getByText(`$${testProducts.book1.price}`)).toBeVisible();
    
    // Step 2: Add to cart
    await productPage.addToCart();
    await expect(page.getByText('Added to cart')).toBeVisible();
    await expect(page.getByTestId('cart-count')).toHaveText('1');
    
    // Step 3: Go to cart
    const cartPage = new CartPage(page);
    await cartPage.goto();
    
    await expect(cartPage.getProductTitle()).toContainText(testProducts.book1.title);
    await expect(cartPage.getSubtotal()).toContainText(`$${testProducts.book1.price}`);
    
    // Step 4: Proceed to checkout
    await cartPage.proceedToCheckout();
    
    // Step 5: Fill shipping info
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillShippingInfo({
      name: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      zip: '10001',
    });
    
    // Step 6: Fill payment info
    await checkoutPage.fillPaymentInfo({
      cardNumber: '4242424242424242',
      expiry: '12/25',
      cvc: '123',
    });
    
    // Step 7: Submit order
    await checkoutPage.submitOrder();
    
    // Step 8: Verify confirmation
    await expect(page).toHaveURL(/.*\/order\/\d+/);
    await expect(page.getByRole('heading')).toHaveText('Order Confirmed');
    await expect(page.getByText('Thank you for your purchase')).toBeVisible();
    
    // Verify order details
    await expect(page.getByText(testProducts.book1.title)).toBeVisible();
    await expect(page.getByText(`Total: $${testProducts.book1.price}`)).toBeVisible();
  });

  test('cart persists across sessions', async ({ page, context }) => {
    const productPage = new ProductPage(page);
    await productPage.goto(testProducts.book1.id);
    await productPage.addToCart();
    
    // Close and reopen browser
    await page.close();
    const newPage = await context.newPage();
    
    // Verify cart count persisted
    await newPage.goto('/');
    await expect(newPage.getByTestId('cart-count')).toHaveText('1');
  });
});
```

### 5. Generate Tests for Edge Cases

For each documented edge case, create specific tests:

```typescript
test.describe('Form Validation', () => {
  test('rejects invalid email format', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    await loginPage.fillEmail('notanemail');
    await loginPage.fillPassword('password123');
    await loginPage.submit();
    
    await expect(page.getByText('Please enter a valid email')).toBeVisible();
  });

  test('rejects password shorter than 8 characters', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    await loginPage.fillEmail('user@example.com');
    await loginPage.fillPassword('pass');
    await loginPage.submit();
    
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
  });
});
```

### 6. Add API Mocking for Isolated Tests

For tests that need controlled API responses:

```typescript
test('handles server error gracefully', async ({ page }) => {
  // Mock API error
  await page.route('**/api/login', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });
  });

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(testUsers.valid.email, testUsers.valid.password);

  await expect(page.getByText('Something went wrong. Please try again.')).toBeVisible();
});

test('shows loading state during login', async ({ page }) => {
  // Delay API response
  await page.route('**/api/login', async route => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ token: 'abc123' }),
    });
  });

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(testUsers.valid.email, testUsers.valid.password);

  // Verify loading indicator
  await expect(page.getByTestId('loading-spinner')).toBeVisible();
  await expect(page.getByTestId('loading-spinner')).not.toBeVisible();
});
```

### 7. Create Custom Fixtures for Common Setup

```typescript
// fixtures/auth.fixture.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { testUsers } from './test-data';

type MyFixtures = {
  authenticatedPage: Page;
  adminPage: Page;
};

export const test = base.extend<MyFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.valid.email, testUsers.valid.password);
    await use(page);
  },

  adminPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.admin.email, testUsers.admin.password);
    await use(page);
  },
});

// Usage in tests
import { test } from '../fixtures/auth.fixture';

test('user can access dashboard', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/dashboard');
  await expect(authenticatedPage.getByRole('heading')).toHaveText('Dashboard');
});
```

## Test Generation Checklist

### For Each User Flow
- [ ] Page Object created
- [ ] Happy path test written
- [ ] Error cases tested
- [ ] Edge cases covered
- [ ] Assertions verify expected outcomes
- [ ] Test data externalized

### Code Quality
- [ ] Tests use strong selectors (role, label, etc.)
- [ ] Tests are independent (can run in any order)
- [ ] Tests are deterministic (no flakiness)
- [ ] Tests have descriptive names
- [ ] Page Objects follow DRY principle
- [ ] Test data is centralized

### Coverage
- [ ] All critical user flows tested
- [ ] Form validation tested
- [ ] Error states tested
- [ ] Authentication/authorization tested
- [ ] API errors handled
- [ ] Loading states verified

## Running Generated Tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test e2e/auth/login.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Run with specific browser
npx playwright test --project=chromium

# Generate HTML report
npx playwright test --reporter=html
```

## Maintenance Tips

1. **Keep Page Objects Up to Date**: When UI changes, update page objects first
2. **Update Test Data**: Keep test data relevant and realistic
3. **Review Selectors**: Prefer stable selectors over brittle ones
4. **Monitor Flakiness**: Fix flaky tests immediately
5. **Refactor Common Patterns**: Extract repeated logic to utilities
6. **Document Complex Flows**: Add comments for non-obvious test logic

## Example: Complete Test Suite Structure

```typescript
// Final test structure for a feature
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { testUsers } from '../../fixtures/test-data';

test.describe('User Authentication', () => {
  test.describe('Login', () => {
    test('successful login', async ({ page }) => { /* ... */ });
    test('failed login - invalid credentials', async ({ page }) => { /* ... */ });
    test('failed login - empty fields', async ({ page }) => { /* ... */ });
  });

  test.describe('Logout', () => {
    test.use({ storageState: 'auth.json' });
    
    test('user can logout', async ({ page }) => { /* ... */ });
  });

  test.describe('Password Reset', () => {
    test('user can request password reset', async ({ page }) => { /* ... */ });
    test('user can reset password with valid token', async ({ page }) => { /* ... */ });
  });
});
```

Remember: Good tests are:
- **Fast**: Complete quickly
- **Independent**: Don't rely on other tests
- **Repeatable**: Same results every time
- **Self-validating**: Clear pass/fail
- **Thorough**: Cover critical paths and edge cases
