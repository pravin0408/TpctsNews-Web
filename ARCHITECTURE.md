# TPCTS News - System Architecture & Design

## System Overview

TPCTS News is a modern, serverless multi-platform news application built with:
- **Web**: Next.js + React + TypeScript
- **Android**: Kotlin + Jetpack Compose (planned)
- **iOS**: Swift + SwiftUI (planned)
- **Backend**: Firebase (Firestore, Auth, Storage, Cloud Functions)
- **Deployment**: GitHub Actions + Firebase Hosting

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                              │
├──────────────────┬──────────────────┬──────────────────┐
│   Android App    │    iOS App       │    Web App        │
│   (Kotlin)       │    (Swift)       │    (Next.js)      │
│   Jetpack        │    SwiftUI       │    React + TS     │
│   Compose        │                  │    TailwindCSS    │
└──────────────────┴──────────────────┴──────────────────┘
           ↓              ↓                    ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FIREBASE SDK LAYER                             │
│  (Shared authentication, data sync, storage)                     │
└─────────────────────────────────────────────────────────────────┘
           ↓              ↓                    ↓
┌─────────────────────────────────────────────────────────────────┐
│                  FIREBASE SERVICES                                │
├──────────────────┬──────────────────┬──────────────────┐
│ Authentication   │  Cloud Firestore │  Cloud Storage   │
│ (Email/Password) │  (NoSQL DB)      │  (Images/Media)  │
└──────────────────┴──────────────────┴──────────────────┘
           ↓              ↓                    ↓
┌─────────────────────────────────────────────────────────────────┐
│                 CI/CD & DEPLOYMENT                                │
│              GitHub Actions + Firebase Hosting                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram (Level 1)

### User Authentication Flow
```
┌──────────────┐
│    User      │
└──────────────┘
       │
       ├─→ [Sign Up] ─→ ┌──────────────────────┐
       │                │ Firebase Auth        │
       └─→ [Login]  ─→  │ Validate Credentials │
                        └──────────────────────┘
                               │
                               ├─→ [Valid] ─→ Create Session
                               │
                               └─→ [Invalid] ─→ Return Error
                                      │
                                      └─→ Redirect to Login
```

### Article Reading Flow
```
┌─────────────┐
│   Reader    │
└─────────────┘
       │
       ├─→ [Browse] ─→ ┌──────────────────────┐
       │                │ Fetch Articles List  │
       ├─→ [Search] ─→  │ from Firestore       │
       │                └──────────────────────┘
       └─→ [Filter]          │
                             └─→ Display Results
                                    │
                                    └─→ [Click Article]
                                         │
                                         ├─→ Fetch Full Article
                                         ├─→ Load Images
                                         └─→ Increment View Count
                                              │
                                              └─→ Save to Firestore
```

### Content Publishing Flow
```
┌─────────────┐
│  Journalist │
└─────────────┘
       │
       ├─→ [Write Article] ─→ ┌──────────────────────┐
       │                       │ Content Editor       │
       ├─→ [Upload Image]  ─→  │ Media Management     │
       │                       └──────────────────────┘
       └─→ [Publish]                   │
                                       ├─→ Cloud Storage (Images)
                                       │
                                       ├─→ Firestore (Article Data)
                                       │
                                       └─→ Trigger Notifications
```

## Complete Data Flow Diagram (DFD Level 2)

```
External Entities:
  [Users] ←→ [Admin]

Processes:
  (1) Authentication & Authorization
  (2) Article Management
  (3) User Profile Management
  (4) Media Storage
  (5) Analytics & Tracking

Data Stores:
  D1: Firebase Auth (User Credentials)
  D2: Firestore (Articles, Comments, User Profiles)
  D3: Cloud Storage (Images & Media)
  D4: Firestore Cache (Local/Device)

Data Flows:

User Authentication:
  [User] → (1) Auth Process → D1 Firebase Auth
         ← Session Token ← D1

Article Reading:
  [User] → (2) Fetch Articles → D2 Firestore
         ← Article List ← D2
         → Increment Views → D2
         ← Updated Views ← D2

Image Loading:
  [User] → (4) Fetch Images → D3 Cloud Storage
         ← Image Data ← D3

Article Publishing:
  [Admin] → (2) Create/Update → D2 Firestore
          → Upload Images → D3 Cloud Storage
          ← Confirmation ← D2

Profile Management:
  [User] → (3) Update Profile → D2 User Collection
         ← Profile Data ← D2

Analytics:
  (5) Track Views, Engagement → D2 Analytics Collection
```

## Component Architecture

### Web Application (Next.js)

```
tpctsnews-web/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home page
│   │   ├── layout.tsx                  # Root layout
│   │   ├── auth/
│   │   │   ├── login/page.tsx         # Login page
│   │   │   ├── signup/page.tsx        # Registration page
│   │   │   └── logout/route.ts        # Logout endpoint
│   │   ├── articles/
│   │   │   ├── page.tsx               # Article list
│   │   │   └── [id]/page.tsx          # Article detail
│   │   ├── dashboard/
│   │   │   ├── page.tsx               # User dashboard
│   │   │   ├── profile/page.tsx       # Profile settings
│   │   │   └── saved/page.tsx         # Saved articles
│   │   ├── admin/                     # Admin section
│   │   │   ├── articles/page.tsx      # Manage articles
│   │   │   └── users/page.tsx         # Manage users
│   │   └── api/                       # API routes
│   │       └── webhooks/              # Firebase webhooks
│   ├── components/
│   │   ├── ArticleCard.tsx            # Article card
│   │   ├── Navbar.tsx                 # Navigation
│   │   ├── Footer.tsx                 # Footer
│   │   ├── Loading.tsx                # Loading spinner
│   │   └── ErrorBoundary.tsx          # Error handling
│   ├── lib/
│   │   ├── firebase.ts                # Firebase config
│   │   └── utils.ts                   # Utilities
│   ├── services/
│   │   ├── articleService.ts          # Article operations
│   │   ├── authService.ts             # Auth operations
│   │   └── storageService.ts          # Media operations
│   ├── store/
│   │   ├── authStore.ts               # Auth state (Zustand)
│   │   ├── articleStore.ts            # Article state
│   │   └── userStore.ts               # User state
│   ├── types/
│   │   ├── index.ts                   # Type definitions
│   │   └── models.ts                  # Data models
│   ├── styles/
│   │   └── globals.css                # Global styles
│   └── middleware.ts                  # Auth middleware
├── .github/
│   └── workflows/
│       ├── deploy.yml                 # Deploy workflow
│       ├── test.yml                   # Test workflow
│       └── lint.yml                   # Lint workflow
├── public/
│   ├── images/                        # Static images
│   ├── icons/                         # App icons
│   └── logo.svg                       # Logo
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript config
├── tailwind.config.ts                 # Tailwind config
├── next.config.ts                     # Next.js config
└── .env.local.example                 # Env template
```

## Firestore Database Schema

### Collections & Documents

#### articles
```
articles/
├── {articleId}/
│   ├── id: string                     # Unique identifier
│   ├── title: string                  # Article title
│   ├── content: string                # Full article content
│   ├── summary: string                # Article summary
│   ├── author: Reference              # Author user reference
│   ├── authorId: string               # Author user ID
│   ├── authorName: string             # Author display name
│   ├── imageUrl: string               # Featured image URL
│   ├── category: string               # Category (News, Tech, etc.)
│   ├── tags: array<string>            # Article tags
│   ├── views: number                  # View count
│   ├── featured: boolean              # Featured article flag
│   ├── published: boolean             # Publication status
│   ├── createdAt: Timestamp           # Creation timestamp
│   ├── updatedAt: Timestamp           # Last update timestamp
│   ├── comments: subcollection        # User comments
│   └── likes: subcollection           # User likes
```

#### users
```
users/
├── {userId}/
│   ├── uid: string                    # Firebase Auth ID
│   ├── email: string                  # User email
│   ├── displayName: string            # User full name
│   ├── photoUrl: string               # Profile picture URL
│   ├── bio: string                    # User bio
│   ├── role: string                   # Role (user, journalist, admin)
│   ├── verified: boolean              # Email verification status
│   ├── createdAt: Timestamp           # Account creation date
│   ├── lastLogin: Timestamp           # Last login timestamp
│   ├── preferences: map               # User preferences
│   │   ├── theme: string              # Light/Dark mode
│   │   ├── notifications: boolean
│   │   └── newsletter: boolean
│   ├── stats: map                     # User statistics
│   │   ├── articlesRead: number
│   │   ├── commentsCount: number
│   │   └── savedArticles: number
│   └── savedArticles: subcollection   # User's saved articles
```

#### comments
```
articles/{articleId}/comments/
├── {commentId}/
│   ├── id: string
│   ├── content: string                # Comment text
│   ├── author: Reference              # Commenter reference
│   ├── authorId: string               # Commenter ID
│   ├── likes: number                  # Like count
│   ├── createdAt: Timestamp
│   ├── updatedAt: Timestamp
│   └── replies: subcollection         # Nested replies
```

#### categories
```
categories/
├── {categoryId}/
│   ├── id: string
│   ├── name: string                   # Category name
│   ├── description: string
│   ├── icon: string                   # Category icon URL
│   ├── color: string                  # Category color
│   └── order: number                  # Display order
```

## Security Architecture

### Firebase Security Rules

```javascript
// Firestore Security Rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin(uid) {
      return get(/databases/$(database)/documents/users/$(uid)).data.role == 'admin';
    }
    
    function isAuthor(uid, authorId) {
      return uid == authorId;
    }

    // Public read access to published articles
    match /articles/{articleId} {
      allow read: if resource.data.published == true;
      allow create: if isSignedIn() && (isAdmin(request.auth.uid) || request.auth.uid == request.resource.data.authorId);
      allow update: if isSignedIn() && isAuthor(request.auth.uid, resource.data.authorId);
      allow delete: if isSignedIn() && (isAdmin(request.auth.uid) || isAuthor(request.auth.uid, resource.data.authorId));
      
      // Comments subcollection
      match /comments/{commentId} {
        allow read: if parent::parent().data.published == true;
        allow create: if isSignedIn();
        allow update, delete: if isSignedIn() && isAuthor(request.auth.uid, resource.data.authorId);
      }
      
      // Likes subcollection
      match /likes/{userId} {
        allow read, write: if isSignedIn() && request.auth.uid == userId;
      }
    }

    // User data access
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update, delete: if isSignedIn() && request.auth.uid == userId;
      
      // Saved articles subcollection
      match /savedArticles/{articleId} {
        allow read, write: if isSignedIn() && request.auth.uid == userId;
      }
    }

    // Categories public read
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if isSignedIn() && isAdmin(request.auth.uid);
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Authentication Flow

```
1. User Registration/Login
   ├─ Email validation
   ├─ Password strength check
   └─ Firebase Auth handles credential storage

2. Session Management
   ├─ Firebase Auth tokens
   ├─ Automatic token refresh
   └─ Secure token storage

3. Protected Routes
   ├─ Middleware checks auth state
   ├─ Redirects to login if not authenticated
   └─ Role-based access control

4. Logout
   ├─ Clear session
   ├─ Remove cached data
   └─ Redirect to homepage
```

## Deployment Architecture

### GitHub Actions CI/CD Pipeline

```
┌─────────────────────┐
│  GitHub Repository  │
│  (Push/PR Event)    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────┐
│  GitHub Actions Workflow        │
├─────────────────────────────────┤
│ 1. Checkout Code                │
│ 2. Setup Node.js                │
│ 3. Install Dependencies         │
│ 4. Run Linter (ESLint)          │
│ 5. Type Check (TypeScript)      │
│ 6. Build Application (Next.js)  │
└──────────┬──────────────────────┘
           │
           ▼
    ┌──────────────┐
    │  Tests Pass? │
    └──┬───────────┘
       │
       ├─ NO ─→ Fail & Notify
       │
       ├─ YES & main branch
       │
       ▼
┌──────────────────────────┐
│  Deploy to Firebase      │
│  - Build artifacts       │
│  - Upload to Hosting     │
│  - Configure DNS         │
└──────────────────────────┘
           │
           ▼
┌──────────────────────────┐
│  Production Live         │
│  https://tpctsnews.web   │
└──────────────────────────┘
```

### Environment Configuration

```
Development:
├─ Local Firebase emulator
├─ Development Firestore database
└─ localhost:3000

Staging (develop branch):
├─ Firebase project (staging)
├─ Staging database
└─ staging.tpctsnews.web

Production (main branch):
├─ Firebase project (production)
├─ Production database
└─ tpctsnews.web
```

## Performance Optimization

### Frontend Optimization
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Server-side rendering (SSR) for SEO
- Static generation (SSG) for articles
- CSS optimization with Tailwind
- JavaScript bundling with SWC

### Backend Optimization
- Firestore composite indexes
- Document references for relationships
- Pagination for large datasets
- Caching strategies
- Cloud Functions for complex operations

### Caching Strategy
```
Static Assets (Images/CSS)
├─ Browser cache: 1 year
├─ CDN cache: 30 days
└─ Next.js static optimization

Dynamic Content (Articles)
├─ ISR (Incremental Static Regeneration): 1 hour
└─ Real-time updates for authenticated users

User Data
├─ Client-side cache: Session duration
└─ Server validation on each request
```

## Error Handling & Logging

### Error Categories
1. **Authentication Errors**: Login/signup failures
2. **Data Errors**: Firestore read/write failures
3. **Network Errors**: Connection timeouts
4. **Validation Errors**: Input validation failures
5. **Server Errors**: Firebase function errors

### Logging Strategy
```
Development
├─ Console logs for debugging
├─ Stack traces for errors
└─ Performance metrics

Production
├─ Error reporting to monitoring service
├─ User-friendly error messages
├─ Analytics tracking
└─ Audit logs for admin actions
```

## Monitoring & Analytics

### Metrics to Track
1. **User Metrics**
   - Total users
   - Active users (DAU/MAU)
   - Sign-up/login conversion
   - User retention

2. **Article Metrics**
   - Total articles
   - Articles published per day
   - Average views per article
   - Most popular categories

3. **Performance Metrics**
   - Page load time
   - Time to interactive (TTI)
   - Core Web Vitals
   - API response times

4. **Business Metrics**
   - Engagement rate
   - Session duration
   - Bounce rate
   - User feedback/ratings

## Disaster Recovery

### Backup Strategy
```
Firestore Data
├─ Automated daily backups
├─ 30-day retention
└─ Point-in-time recovery

Cloud Storage (Images)
├─ Multi-region replication
├─ Versioning enabled
└─ Cross-region backup

Database Export
├─ Monthly exports to GCS
├─ Long-term archival
└─ Compliance requirements
```

### Recovery Procedures
1. **Data Loss**: Restore from automated backups
2. **Outage**: Failover to backup region
3. **Security Breach**: Incident response plan
4. **Service Degradation**: Scale resources

## Scalability

### Horizontal Scaling
- Firebase auto-scaling
- Cloud Functions scaling
- CDN distribution
- Load balancing

### Vertical Scaling
- Firestore capacity
- Cloud Storage quotas
- Bandwidth limits
- API rate limits

## Next Steps for Full Implementation

1. **Android Application**
   - Kotlin + Jetpack Compose setup
   - Firebase integration
   - Offline-first architecture

2. **iOS Application**
   - Swift + SwiftUI setup
   - Firebase integration
   - Apple-specific features

3. **Cloud Functions**
   - Image resizing/optimization
   - Content moderation
   - Push notifications
   - Email newsletters

4. **Advanced Features**
   - Real-time collaboration
   - Advanced search
   - Personalization engine
   - Social features (follow, share)

5. **Analytics & Monitoring**
   - Google Analytics 4
   - Sentry for error tracking
   - Firebase Performance Monitoring
   - Custom dashboards
