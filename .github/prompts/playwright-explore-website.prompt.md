---
description: 'Playwright テスト生成の準備としてウェブサイトを探索・解析するガイド'
agent: 'agent'
---

# Playwright: Explore Website for Test Generation

You are tasked with exploring a website to understand its structure, user flows, and key interactions before generating Playwright tests. This exploration phase helps identify:

- Critical user journeys
- Important UI elements and their selectors
- Form fields and validation
- Navigation patterns
- Dynamic content and async operations

## Exploration Workflow

### 1. Initial Discovery

Start by understanding the website's purpose and main areas:

```bash
# Open the website in Playwright
npx playwright open <url>
```

**Questions to Answer:**
- What is the main purpose of this website?
- Who are the primary users?
- What are the critical user flows (e.g., signup, purchase, search)?

### 2. Identify Key Pages

Map out the main pages and their URLs:

**Example Structure:**
- Homepage: `/`
- Login: `/login`
- Dashboard: `/dashboard`
- Product Listing: `/products`
- Product Detail: `/products/:id`
- Checkout: `/checkout`

### 3. Analyze Each Page

For each page, document:

#### Navigation Elements
- Header links
- Footer links
- Sidebar menus
- Breadcrumbs

**Playwright Inspection:**
```javascript
// List all links
await page.locator('a').evaluateAll(links => 
  links.map(l => ({ text: l.textContent, href: l.href }))
);

// List all buttons
await page.locator('button').evaluateAll(buttons => 
  buttons.map(b => b.textContent)
);
```

#### Form Elements
- Input fields (text, email, password, etc.)
- Select dropdowns
- Checkboxes and radio buttons
- Submit buttons

**Playwright Inspection:**
```javascript
// Find all form fields
const formData = await page.evaluate(() => {
  const forms = document.querySelectorAll('form');
  return Array.from(forms).map(form => ({
    action: form.action,
    method: form.method,
    fields: Array.from(form.elements).map(el => ({
      type: el.type,
      name: el.name,
      id: el.id,
      label: el.labels?.[0]?.textContent,
      placeholder: el.placeholder,
    })),
  }));
});
```

#### Dynamic Content
- Loading states
- Error messages
- Success notifications
- Modal dialogs
- Tooltips

#### API Calls
Monitor network requests to understand data flow:

```javascript
// Listen to all network requests
page.on('request', request => {
  console.log('>>', request.method(), request.url());
});

page.on('response', response => {
  console.log('<<', response.status(), response.url());
});
```

### 4. Document Selectors

For each important element, identify the best selector:

**Priority Order:**
1. `getByRole` (most stable)
2. `getByLabel` (forms)
3. `getByPlaceholder` (inputs)
4. `getByText` (content)
5. `getByTestId` (if available)
6. CSS/XPath (last resort)

**Example Selector Documentation:**

| Element | Purpose | Selector | Notes |
|---------|---------|----------|-------|
| Login Button | Submit login form | `getByRole('button', { name: 'Log in' })` | Primary CTA |
| Email Input | Login email field | `getByLabel('Email address')` | Required field |
| Error Message | Login error display | `getByRole('alert')` | Shows on failed login |

### 5. Map User Flows

Identify and document critical user journeys:

#### Example: User Registration Flow

1. **Navigate to Signup**
   - Click "Sign up" link in header
   - URL changes to `/signup`

2. **Fill Form**
   - Enter email: `getByLabel('Email')`
   - Enter password: `getByLabel('Password')`
   - Confirm password: `getByLabel('Confirm password')`

3. **Submit**
   - Click submit: `getByRole('button', { name: 'Create account' })`
   - Wait for confirmation: `getByText('Account created successfully')`

4. **Verify**
   - Redirected to `/dashboard`
   - User avatar appears in header

#### Example: Purchase Flow

1. **Browse Products** → `/products`
2. **Select Product** → `/products/:id`
3. **Add to Cart** → Cart count updates
4. **Checkout** → `/checkout`
5. **Enter Payment** → Fill payment form
6. **Submit Order** → Confirmation page

### 6. Identify Edge Cases

Document scenarios that need special testing:

**Common Edge Cases:**
- Empty form submission
- Invalid input (bad email, short password)
- Network errors
- Session timeout
- Concurrent actions
- Mobile vs. desktop layouts
- Different user roles/permissions

### 7. Test Data Requirements

List what test data is needed:

**Example:**
- Valid user credentials
- Invalid user credentials
- Sample product IDs
- Test payment information
- Mock API responses
- File uploads (images, documents)

### 8. Authentication & Authorization

Understand authentication requirements:

- How to log in?
- How to log out?
- Session persistence?
- Role-based access?
- Protected routes?

**Playwright Auth Example:**
```javascript
// Save authenticated state
await page.goto('/login');
await page.getByLabel('Email').fill('user@example.com');
await page.getByLabel('Password').fill('password123');
await page.getByRole('button', { name: 'Log in' }).click();

// Save storage state
await page.context().storageState({ path: 'auth.json' });
```

### 9. Performance Considerations

Note any performance-related aspects:

- Slow-loading pages
- Heavy images/videos
- Lazy-loaded content
- Infinite scroll
- Pagination

## Exploration Checklist

### General
- [ ] Website purpose and target users identified
- [ ] Main pages and URLs mapped
- [ ] Navigation structure documented

### UI Elements
- [ ] All forms and their fields identified
- [ ] Buttons and CTAs cataloged
- [ ] Links and navigation elements listed
- [ ] Dynamic elements (modals, tooltips) noted

### User Flows
- [ ] Critical user journeys documented
- [ ] Happy paths mapped
- [ ] Edge cases identified
- [ ] Error states cataloged

### Technical
- [ ] API endpoints identified
- [ ] Authentication mechanism understood
- [ ] Test data requirements listed
- [ ] Selectors documented for key elements

### Accessibility
- [ ] ARIA roles present?
- [ ] Form labels properly associated?
- [ ] Keyboard navigation possible?
- [ ] Screen reader friendly?

## Output Template

Create a markdown document with your findings:

```markdown
# Website Exploration: [Site Name]

## Overview
- **URL**: https://example.com
- **Purpose**: E-commerce platform for books
- **Primary Users**: Book buyers and sellers

## Page Map
- Homepage: `/`
- Products: `/products`
- Product Detail: `/products/:id`
- Cart: `/cart`
- Checkout: `/checkout`
- Login: `/login`

## Critical User Flows

### 1. User Registration
1. Navigate to /signup
2. Fill form: email, password, confirm password
3. Submit form
4. Verify redirect to /dashboard
5. Confirm welcome message appears

**Selectors:**
- Email input: `getByLabel('Email address')`
- Password input: `getByLabel('Password')`
- Submit button: `getByRole('button', { name: 'Create account' })`

**Edge Cases:**
- Invalid email format
- Password too short
- Passwords don't match
- Email already exists

### 2. Product Purchase
[Document similarly]

## API Endpoints
- `POST /api/auth/login` - User login
- `GET /api/products` - List products
- `POST /api/orders` - Create order

## Test Data Needed
- Valid user: user@example.com / password123
- Invalid user: bad@example.com / wrongpass
- Product IDs: [1, 2, 3]
- Test credit card: 4242 4242 4242 4242

## Notes
- Products load via infinite scroll
- Cart state persists in localStorage
- Auth token stored in cookies (httpOnly)
```

## Next Steps

After exploration, use this documentation to:

1. **Generate Test Plan** - Prioritize which flows to test first
2. **Create Test Cases** - Write detailed test scenarios
3. **Implement Tests** - Use Playwright to automate the flows
4. **Add Assertions** - Verify expected outcomes
5. **Handle Edge Cases** - Test error states and validations

## Tips for Effective Exploration

- **Use Playwright Inspector**: `npx playwright open <url>` to interactively explore
- **Record Actions**: `npx playwright codegen <url>` to see generated code
- **Check Accessibility**: Use browser DevTools accessibility panel
- **Monitor Network**: Watch XHR/Fetch requests for API patterns
- **Test Mobile**: Explore with different device viewports
- **Note Timing**: Identify slow operations that need special waits

Remember: Thorough exploration leads to better, more reliable tests. Take time to understand the application before writing tests.
