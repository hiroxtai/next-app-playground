---
description: 'Comprehensive performance optimization guide for web applications'
applyTo: '**/*.ts, **/*.tsx, **/*.js, **/*.jsx, **/*.css'
---

# Performance Optimization Guidelines

> Best practices for optimizing web application performance across frontend, backend, and database layers.

## Frontend Performance

### 1. Rendering Optimization

#### Code Splitting

```typescript
// ✅ Dynamic imports for code splitting
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable SSR if not needed
});

// ✅ Route-based splitting (automatic in Next.js)
// pages/about.tsx - automatically code-split

// ✅ Component-based splitting
const Modal = dynamic(() => import('./Modal'));

function Page() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowModal(true)}>Open Modal</button>
      {showModal && <Modal />} {/* Loaded only when needed */}
    </>
  );
}
```

#### Lazy Loading

```tsx
// ✅ Lazy load images
import Image from 'next/image';

<Image
  src="/large-image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy" // Browser native lazy loading
/>

// ✅ Intersection Observer for custom lazy loading
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' } // Start loading 100px before visible
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : undefined}
      alt={alt}
      loading="lazy"
    />
  );
}
```

#### React Performance

```tsx
// ✅ Memoization
import { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  return <div>{/* Render data */}</div>;
});

function Parent() {
  // ✅ Memoize expensive calculations
  const processedData = useMemo(() => {
    return heavyCalculation(rawData);
  }, [rawData]);

  // ✅ Memoize callbacks
  const handleClick = useCallback(() => {
    doSomething();
  }, []);

  return <ExpensiveComponent data={processedData} onClick={handleClick} />;
}

// ❌ Re-creating objects/functions on every render
function Bad() {
  return <ExpensiveComponent data={{ value: 1 }} />; // New object every render!
}
```

#### Virtual Scrolling

```tsx
// ✅ Use virtual scrolling for long lists
import { FixedSizeList } from 'react-window';

function LongList({ items }: { items: string[] }) {
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>{items[index]}</div>
      )}
    </FixedSizeList>
  );
}

// ❌ Rendering thousands of items at once
function BadList({ items }: { items: string[] }) {
  return (
    <div>
      {items.map(item => <div key={item}>{item}</div>)} {/* All 10,000 items! */}
    </div>
  );
}
```

### 2. Asset Optimization

#### Images

```tsx
// ✅ Use Next.js Image component
import Image from 'next/image';

<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  quality={75} // 75-85 is good balance
  priority // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/..." // Or use imported image
/>

// ✅ Responsive images
<Image
  src="/photo.jpg"
  alt="Photo"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// ✅ WebP/AVIF format (Next.js handles automatically)
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};
```

#### Fonts

```tsx
// ✅ Use next/font for optimal font loading
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevent flash of invisible text
  preload: true,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}

// ✅ Preload critical fonts
<link
  rel="preload"
  href="/fonts/custom-font.woff2"
  as="font"
  type="font/woff2"
  crossOrigin="anonymous"
/>
```

#### CSS

```css
/* ✅ Critical CSS inline in head */
/* Use tools like critical-css or Next.js automatic optimization */

/* ✅ Minimize unused CSS with Tailwind purge */
/* tailwind.config.js */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
};

/* ✅ Use CSS containment for isolated components */
.card {
  contain: layout style paint;
}

/* ✅ Avoid expensive CSS selectors */
/* ❌ Bad */
* {
  box-sizing: border-box;
}

/* ✅ Better */
html {
  box-sizing: border-box;
}
*, *::before, *::after {
  box-sizing: inherit;
}
```

### 3. JavaScript Performance

#### Bundle Size

```bash
# Analyze bundle size
npm install --save-dev @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // config
});

# Run analysis
ANALYZE=true npm run build
```

```typescript
// ✅ Tree-shaking friendly imports
import { debounce } from 'lodash-es'; // ES modules
// or
import debounce from 'lodash/debounce'; // Individual function

// ❌ Imports entire library
import _ from 'lodash';
```

#### Avoid Blocking Operations

```typescript
// ✅ Defer non-critical work
function App() {
  useEffect(() => {
    // Defer analytics initialization
    requestIdleCallback(() => {
      initAnalytics();
    });
  }, []);
}

// ✅ Use Web Workers for heavy computation
// worker.ts
self.onmessage = (e) => {
  const result = heavyCalculation(e.data);
  self.postMessage(result);
};

// main.ts
const worker = new Worker(new URL('./worker.ts', import.meta.url));
worker.postMessage(data);
worker.onmessage = (e) => {
  console.log(e.data);
};
```

### 4. Network Optimization

#### HTTP/2 and HTTP/3

```typescript
// ✅ Use HTTP/2 Server Push (in production)
// Automatic in most hosting platforms

// ✅ Preconnect to external domains
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://api.example.com" />

// ✅ DNS prefetch for third-party resources
<link rel="dns-prefetch" href="https://analytics.example.com" />
```

#### Resource Hints

```tsx
// ✅ Prefetch next page resources
import Link from 'next/link';

<Link href="/next-page" prefetch={true}>
  Next Page
</Link>

// ✅ Preload critical resources
<link rel="preload" href="/critical.js" as="script" />
<link rel="preload" href="/hero-image.jpg" as="image" />

// ✅ Modulepreload for ES modules
<link rel="modulepreload" href="/app.js" />
```

#### Compression

```typescript
// ✅ Enable compression (Gzip/Brotli)
// next.config.js
module.exports = {
  compress: true, // Enabled by default in production
};

// ✅ Verify compression headers
// response headers should include:
// content-encoding: br (Brotli) or gzip
```

---

## Backend Performance

### 1. Database Optimization

#### Query Optimization

```typescript
// ✅ Use indexes
// prisma/schema.prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique // Automatically indexed
  name  String
  posts Post[]
  
  @@index([name]) // Manual index
}

// ✅ Select only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});

// ❌ Fetch all fields unnecessarily
const users = await prisma.user.findMany(); // Includes all relations!

// ✅ Use pagination
const users = await prisma.user.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
});

// ✅ Batch queries with dataloader
import DataLoader from 'dataloader';

const userLoader = new DataLoader(async (ids: number[]) => {
  const users = await prisma.user.findMany({
    where: { id: { in: ids } },
  });
  
  return ids.map(id => users.find(user => user.id === id));
});

// Automatically batches and deduplicates
const user1 = await userLoader.load(1);
const user2 = await userLoader.load(2);
```

#### N+1 Problem

```typescript
// ❌ N+1 queries
const posts = await prisma.post.findMany();
for (const post of posts) {
  const author = await prisma.user.findUnique({
    where: { id: post.authorId },
  }); // Separate query for each post!
}

// ✅ Use include/join
const posts = await prisma.post.findMany({
  include: {
    author: true, // Single query with join
  },
});

// ✅ Or use select for specific fields
const posts = await prisma.post.findMany({
  include: {
    author: {
      select: {
        id: true,
        name: true,
      },
    },
  },
});
```

### 2. Caching

#### In-Memory Caching

```typescript
// ✅ Use LRU cache for hot data
import LRU from 'lru-cache';

const cache = new LRU<string, any>({
  max: 500, // Max items
  ttl: 1000 * 60 * 5, // 5 minutes
});

async function getUser(id: string) {
  const cached = cache.get(`user:${id}`);
  if (cached) return cached;
  
  const user = await db.user.findUnique({ where: { id } });
  cache.set(`user:${id}`, user);
  return user;
}

// ✅ Next.js data cache
export const revalidate = 3600; // Revalidate every hour

export async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 },
  });
  return res.json();
}
```

#### Redis Caching

```typescript
// ✅ Use Redis for distributed caching
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

async function getCachedData(key: string) {
  const cached = await redis.get(key);
  if (cached) return cached;
  
  const data = await fetchData();
  await redis.set(key, data, { ex: 3600 }); // Expire in 1 hour
  return data;
}

// ✅ Cache invalidation
async function updateUser(id: string, data: UserData) {
  await db.user.update({ where: { id }, data });
  await redis.del(`user:${id}`); // Invalidate cache
}
```

#### CDN Caching

```typescript
// ✅ Set cache headers for static assets
export async function GET(request: Request) {
  return new Response(data, {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'image/jpeg',
    },
  });
}

// ✅ Stale-while-revalidate
export async function GET(request: Request) {
  return new Response(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
```

### 3. API Optimization

#### Response Compression

```typescript
// ✅ Compress API responses
import { gzip } from 'zlib';
import { promisify } from 'util';

const gzipAsync = promisify(gzip);

export async function GET(request: Request) {
  const data = JSON.stringify(largeData);
  const compressed = await gzipAsync(data);
  
  return new Response(compressed, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Encoding': 'gzip',
    },
  });
}
```

#### Request Batching

```typescript
// ✅ GraphQL for flexible data fetching
// Allows clients to request exactly what they need

// ✅ tRPC for type-safe batching
import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const appRouter = t.router({
  getUser: t.procedure.input(z.number()).query(({ input }) => {
    return db.user.findUnique({ where: { id: input } });
  }),
  getPosts: t.procedure.query(() => {
    return db.post.findMany();
  }),
});

// Client automatically batches parallel calls
const [user, posts] = await Promise.all([
  trpc.getUser.query(1),
  trpc.getPosts.query(),
]);
```

#### Rate Limiting

```typescript
// ✅ Implement rate limiting
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }
  
  // Process request
}
```

---

## Monitoring and Profiling

### 1. Performance Metrics

```typescript
// ✅ Core Web Vitals
export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric);
  
  // Send to analytics
  switch (metric.name) {
    case 'FCP':
      // First Contentful Paint
      break;
    case 'LCP':
      // Largest Contentful Paint
      break;
    case 'CLS':
      // Cumulative Layout Shift
      break;
    case 'FID':
      // First Input Delay
      break;
    case 'TTFB':
      // Time to First Byte
      break;
  }
}
```

### 2. React Profiler

```tsx
// ✅ Profile component render performance
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
) {
  console.log(`${id} (${phase}): ${actualDuration}ms`);
}

<Profiler id="App" onRender={onRenderCallback}>
  <App />
</Profiler>
```

### 3. Performance API

```typescript
// ✅ Custom performance marks
performance.mark('data-fetch-start');
await fetchData();
performance.mark('data-fetch-end');

performance.measure('data-fetch', 'data-fetch-start', 'data-fetch-end');

const measure = performance.getEntriesByName('data-fetch')[0];
console.log(`Data fetch took ${measure.duration}ms`);
```

---

## Performance Budget

### Recommended Targets

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms
- **Time to Interactive (TTI)**: < 3.8s
- **Total Blocking Time (TBT)**: < 200ms

### Bundle Size Targets

- **JavaScript (initial)**: < 150KB (gzipped)
- **CSS**: < 50KB (gzipped)
- **Images per page**: < 200KB (optimized)

---

## Performance Checklist

### Frontend
- [ ] Code splitting implemented
- [ ] Images optimized (WebP/AVIF, lazy loading)
- [ ] Fonts optimized (preload, font-display)
- [ ] CSS optimized (purged, critical CSS)
- [ ] JavaScript minified and tree-shaken
- [ ] Resource hints used (preconnect, prefetch)
- [ ] Long lists virtualized
- [ ] React components memoized where needed

### Backend
- [ ] Database queries optimized (indexes, select fields)
- [ ] N+1 queries eliminated
- [ ] Caching implemented (memory, Redis, CDN)
- [ ] API responses compressed
- [ ] Rate limiting in place
- [ ] Connection pooling configured

### Monitoring
- [ ] Performance metrics tracked
- [ ] Core Web Vitals monitored
- [ ] Error monitoring configured
- [ ] Slow query logging enabled

---

## Tools

### Analysis
- **Lighthouse**: Overall performance audit
- **WebPageTest**: Detailed waterfall analysis
- **Chrome DevTools Performance**: Runtime profiling
- **React DevTools Profiler**: Component render profiling
- **Next.js Bundle Analyzer**: Bundle size analysis

### Monitoring
- **Vercel Analytics**: Next.js specific metrics
- **Google Analytics**: Core Web Vitals
- **Sentry**: Error and performance monitoring
- **DataDog**: Infrastructure monitoring

---

## Resources

- **Web.dev**: https://web.dev/
- **MDN Performance**: https://developer.mozilla.org/en-US/docs/Web/Performance
- **Next.js Performance**: https://nextjs.org/docs/app/building-your-application/optimizing

---

## Remember

Performance optimization is:
- **Continuous**: Not a one-time task
- **Measurable**: Use metrics and budgets
- **User-focused**: Optimize for real-world conditions
- **Iterative**: Measure, optimize, measure again
- **Balanced**: Don't sacrifice maintainability for micro-optimizations
