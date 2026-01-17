---
description: 'Security best practices based on OWASP Top 10 and secure coding standards'
applyTo: '**/*.ts, **/*.tsx, **/*.js, **/*.jsx'
---

# Security and OWASP Guidelines

> Follow these guidelines to prevent common security vulnerabilities based on OWASP Top 10 and secure coding practices.

## OWASP Top 10 (2021)

### A01: Broken Access Control

**Risk**: Users acting outside of their intended permissions

**Prevention**:
- Enforce access control checks on server-side
- Deny by default
- Implement proper role-based access control (RBAC)
- Disable directory listing
- Log access control failures

```typescript
// ✅ Server-side access control
export async function GET(request: Request) {
  const session = await getSession(request);
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  if (!hasPermission(session.user, 'read:data')) {
    return new Response('Forbidden', { status: 403 });
  }
  
  // Proceed with authorized request
}

// ❌ Client-side only access control
function AdminPanel() {
  const { user } = useAuth();
  
  // This can be bypassed by modifying client code
  if (!user.isAdmin) {
    return <div>Access denied</div>;
  }
  
  return <div>Admin controls</div>;
}
```

**Server-Side Request Forgery (SSRF) Prevention**:

```typescript
// ✅ Validate and sanitize URLs
function isAllowedUrl(url: string): boolean {
  const allowed = ['https://api.example.com', 'https://cdn.example.com'];
  return allowed.some(base => url.startsWith(base));
}

export async function POST(request: Request) {
  const { url } = await request.json();
  
  if (!isAllowedUrl(url)) {
    return new Response('Invalid URL', { status: 400 });
  }
  
  const response = await fetch(url);
  return response;
}

// ❌ Unvalidated user-supplied URLs
export async function POST(request: Request) {
  const { url } = await request.json();
  const response = await fetch(url); // Can access internal services!
  return response;
}
```

---

### A02: Cryptographic Failures

**Risk**: Exposure of sensitive data due to weak or missing encryption

**Prevention**:
- Use strong encryption algorithms (AES-256, RSA-2048+)
- Use HTTPS everywhere
- Don't store sensitive data unnecessarily
- Use proper key management
- Hash passwords with bcrypt, Argon2, or PBKDF2

```typescript
// ✅ Proper password hashing
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ❌ Weak hashing
import crypto from 'crypto';

function weakHash(password: string): string {
  return crypto.createHash('md5').update(password).digest('hex'); // MD5 is broken!
}

// ✅ Encrypt sensitive data at rest
import { encrypt, decrypt } from './crypto-utils';

async function storeApiKey(userId: string, apiKey: string) {
  const encrypted = await encrypt(apiKey, process.env.ENCRYPTION_KEY);
  await db.apiKeys.create({ userId, encryptedKey: encrypted });
}

// ❌ Store sensitive data in plain text
async function storeApiKey(userId: string, apiKey: string) {
  await db.apiKeys.create({ userId, apiKey }); // Plain text!
}
```

**Secure Random Generation**:

```typescript
// ✅ Cryptographically secure random
import { randomBytes } from 'crypto';

function generateToken(): string {
  return randomBytes(32).toString('hex');
}

// ❌ Weak random (Math.random)
function weakToken(): string {
  return Math.random().toString(36).substring(2); // Predictable!
}
```

---

### A03: Injection

**Risk**: Untrusted data sent to interpreter as part of a command or query

**SQL Injection Prevention**:

```typescript
// ✅ Parameterized queries (Prisma)
const user = await prisma.user.findFirst({
  where: { email: userInput }
});

// ✅ Parameterized queries (raw SQL)
const users = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [userInput]
);

// ❌ String concatenation
const users = await db.query(
  `SELECT * FROM users WHERE email = '${userInput}'` // SQL injection!
);
```

**Command Injection Prevention**:

```typescript
// ✅ Avoid shell execution when possible
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Better: Use libraries instead of shell commands
import sharp from 'sharp';

await sharp(inputPath).resize(300, 300).toFile(outputPath);

// If shell is necessary, validate input
function isValidFilename(filename: string): boolean {
  return /^[a-zA-Z0-9_-]+\.[a-zA-Z]{3,4}$/.test(filename);
}

async function processFile(filename: string) {
  if (!isValidFilename(filename)) {
    throw new Error('Invalid filename');
  }
  
  // Still risky! Use spawn with array instead
  await execAsync(`convert ${filename} output.png`);
}

// ✅ Better: Use spawn with array
import { spawn } from 'child_process';

function processFile(filename: string) {
  return new Promise((resolve, reject) => {
    const process = spawn('convert', [filename, 'output.png']);
    process.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Process exited with code ${code}`));
    });
  });
}
```

**Cross-Site Scripting (XSS) Prevention**:

```tsx
// ✅ React auto-escapes by default
function UserProfile({ username }: { username: string }) {
  return <div>Welcome, {username}</div>; // Escaped
}

// ❌ dangerouslySetInnerHTML without sanitization
function UserBio({ bio }: { bio: string }) {
  return <div dangerouslySetInnerHTML={{ __html: bio }} />; // XSS!
}

// ✅ Sanitize HTML before rendering
import DOMPurify from 'isomorphic-dompurify';

function UserBio({ bio }: { bio: string }) {
  const sanitized = DOMPurify.sanitize(bio);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// ✅ Server-side: Set proper headers
export const headers = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
};
```

---

### A04: Insecure Design

**Risk**: Missing or ineffective security controls

**Prevention**:
- Implement secure development lifecycle
- Use threat modeling
- Validate all inputs
- Implement rate limiting
- Use security patterns and libraries

```typescript
// ✅ Rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
});

app.use('/api/', limiter);

// ✅ Input validation with schema
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  age: z.number().min(13).max(120),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = userSchema.parse(body);
    // Proceed with validated data
  } catch (error) {
    return new Response('Invalid input', { status: 400 });
  }
}

// ✅ Secure by default
const config = {
  requireAuth: true,  // Default to secure
  allowPublicAccess: false,
  csrfProtection: true,
};
```

---

### A05: Security Misconfiguration

**Risk**: Insecure default configurations, incomplete setups, open cloud storage

**Prevention**:
- Remove default accounts and passwords
- Disable unnecessary features
- Keep software up to date
- Use security headers
- Configure CORS properly

```typescript
// ✅ Secure headers (Next.js)
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },
};

// ✅ Proper CORS configuration
const allowedOrigins = ['https://example.com', 'https://app.example.com'];

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  
  if (!origin || !allowedOrigins.includes(origin)) {
    return new Response(null, { status: 403 });
  }
  
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// ❌ Overly permissive CORS
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*', // Too permissive!
      'Access-Control-Allow-Methods': '*',
    },
  });
}
```

**Environment Variables**:

```typescript
// ✅ Validate environment variables
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().min(32),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

const env = envSchema.parse(process.env);

// ❌ Direct access without validation
const apiKey = process.env.API_KEY; // Might be undefined!

// ✅ Never commit secrets
// .env.example (committed)
DATABASE_URL=postgresql://localhost:5432/db
API_KEY=your_api_key_here

// .env (gitignored)
DATABASE_URL=postgresql://real-db-url
API_KEY=real_secret_key

// .gitignore
.env
.env.local
```

---

### A06: Vulnerable and Outdated Components

**Risk**: Using components with known vulnerabilities

**Prevention**:
- Remove unused dependencies
- Only obtain components from official sources
- Monitor for vulnerabilities
- Keep dependencies updated

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update

# Check for outdated packages
npm outdated

# Use Dependabot or Renovate for automated updates
```

```json
// package.json - Pin versions for production
{
  "dependencies": {
    "next": "14.0.0",  // ✅ Exact version
    "react": "^18.2.0" // ⚠️ Caret allows minor updates
  },
  "devDependencies": {
    "@types/node": "^20.0.0"
  }
}
```

---

### A07: Identification and Authentication Failures

**Risk**: Weak authentication mechanisms

**Prevention**:
- Implement multi-factor authentication (MFA)
- Use secure session management
- Implement account lockout
- Use strong password policies
- Protect against automated attacks

```typescript
// ✅ Secure session management
import { SignJWT, jwtVerify } from 'jose';

async function createSession(userId: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
  
  return token;
}

async function verifySession(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

// ✅ Account lockout after failed attempts
const failedAttempts = new Map<string, number>();

async function login(email: string, password: string) {
  const attempts = failedAttempts.get(email) || 0;
  
  if (attempts >= 5) {
    throw new Error('Account locked. Try again later.');
  }
  
  const user = await verifyCredentials(email, password);
  
  if (!user) {
    failedAttempts.set(email, attempts + 1);
    throw new Error('Invalid credentials');
  }
  
  failedAttempts.delete(email);
  return user;
}

// ✅ Password strength validation
import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain special character');
```

---

### A08: Software and Data Integrity Failures

**Risk**: Code or infrastructure without integrity verification

**Prevention**:
- Use signed commits
- Verify package integrity
- Use Subresource Integrity (SRI)
- Implement CI/CD pipeline security

```html
<!-- ✅ Use SRI for CDN resources -->
<script
  src="https://cdn.example.com/library.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/ux..."
  crossorigin="anonymous"
></script>

<!-- ❌ No integrity check -->
<script src="https://cdn.example.com/library.js"></script>
```

```bash
# Verify package integrity
npm audit signatures

# Use lock files
# package-lock.json (npm)
# yarn.lock (yarn)
# pnpm-lock.yaml (pnpm)

# Verify checksums
npm install --package-lock-only
```

---

### A09: Security Logging and Monitoring Failures

**Risk**: Insufficient logging and monitoring

**Prevention**:
- Log all authentication attempts
- Log access control failures
- Monitor for suspicious activity
- Implement alerting
- Ensure logs are tamper-proof

```typescript
// ✅ Structured logging
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['password', 'token', 'apiKey'], // Redact sensitive data
});

// Log security events
logger.info({ userId, action: 'login', ip: request.ip }, 'User login');
logger.warn({ userId, resource: '/admin', ip: request.ip }, 'Unauthorized access attempt');
logger.error({ error, userId }, 'Authentication failed');

// ❌ No logging
async function login(email: string, password: string) {
  const user = await verifyCredentials(email, password);
  if (!user) {
    throw new Error('Invalid credentials'); // Silent failure!
  }
  return user;
}

// ✅ Audit log
interface AuditLog {
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  ip: string;
  userAgent: string;
}

async function createAuditLog(log: AuditLog) {
  await db.auditLogs.create({ data: log });
}
```

---

### A10: Server-Side Request Forgery (SSRF)

**Risk**: Application fetches remote resource without validating URL

**Prevention**:
- Validate and sanitize all URLs
- Use allowlist of allowed domains
- Disable redirects or validate redirect targets
- Use network segmentation

```typescript
// ✅ URL validation
function isAllowedDomain(url: string): boolean {
  try {
    const parsed = new URL(url);
    const allowedDomains = ['api.example.com', 'cdn.example.com'];
    return allowedDomains.includes(parsed.hostname);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const { url } = await request.json();
  
  if (!isAllowedDomain(url)) {
    return new Response('Invalid URL', { status: 400 });
  }
  
  const response = await fetch(url, {
    redirect: 'error', // Prevent redirect attacks
  });
  
  return response;
}

// ❌ Unrestricted URL fetching
export async function POST(request: Request) {
  const { url } = await request.json();
  const response = await fetch(url); // Can access internal services!
  return response;
}
```

---

## Additional Security Best Practices

### Secrets Management

```typescript
// ✅ Use secret management service
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

async function getSecret(secretName: string) {
  const client = new SecretsManager({ region: 'us-east-1' });
  const response = await client.getSecretValue({ SecretId: secretName });
  return JSON.parse(response.SecretString);
}

// ❌ Hardcoded secrets
const API_KEY = 'sk-1234567890abcdef'; // Never do this!
```

### Input Sanitization

```typescript
// ✅ Sanitize and validate all inputs
import validator from 'validator';
import { z } from 'zod';

const userInputSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/),
  website: z.string().url().optional(),
});

function sanitizeInput(input: string): string {
  return validator.escape(input); // Escape HTML entities
}
```

### Secure File Uploads

```typescript
// ✅ Validate file uploads
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxFileSize = 5 * 1024 * 1024; // 5MB

async function handleFileUpload(file: File) {
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  
  if (file.size > maxFileSize) {
    throw new Error('File too large');
  }
  
  // Generate safe filename
  const ext = file.name.split('.').pop();
  const filename = `${crypto.randomUUID()}.${ext}`;
  
  // Store file
  await storeFile(filename, file);
}
```

---

## Security Testing

### Automated Security Testing

```bash
# Static analysis
npm install --save-dev eslint-plugin-security

# Dependency scanning
npm audit
npm install --save-dev snyk
npx snyk test

# SAST (Static Application Security Testing)
npm install --save-dev @microsoft/eslint-plugin-sdl
```

### Manual Security Review Checklist

- [ ] All user inputs validated and sanitized
- [ ] Authentication and authorization properly implemented
- [ ] Sensitive data encrypted at rest and in transit
- [ ] Security headers configured
- [ ] CORS configured securely
- [ ] Rate limiting implemented
- [ ] Logging and monitoring in place
- [ ] Dependencies up to date
- [ ] Secrets not committed to repository
- [ ] Error messages don't leak sensitive information

---

## Resources

- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **OWASP Cheat Sheet Series**: https://cheatsheetseries.owasp.org/
- **CWE Top 25**: https://cwe.mitre.org/top25/
- **NIST Cybersecurity Framework**: https://www.nist.gov/cyberframework

---

## Remember

Security is:
- **Layered**: Defense in depth
- **Continuous**: Not a one-time effort
- **Everyone's responsibility**: Not just security team
- **Proactive**: Find and fix before attackers do
- **Evolving**: New threats emerge constantly
