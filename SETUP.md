# TPCTS News - Web Application

A modern, serverless news platform built with Next.js, React, TypeScript, and Firebase. Designed for real-time news delivery with authentication, article management, and responsive UI.

## Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- Firebase account with Firestore and Authentication enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tpctsnews-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Copy `.env.local.example` to `.env.local`
   - Add your Firebase configuration values:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── providers.tsx      # Context providers
│   ├── auth/
│   │   ├── login/         # Login page
│   │   └── signup/        # Registration page
│   ├── articles/
│   │   ├── page.tsx       # Articles listing
│   │   └── [id]/          # Individual article view
│   └── dashboard/         # User dashboard
├── lib/
│   └── firebase.ts        # Firebase initialization
├── services/
│   └── articleService.ts  # Article CRUD operations
├── store/
│   └── authStore.ts       # Auth state management (Zustand)
└── styles/
    └── globals.css        # Global styles with Tailwind
```

## Key Features

### Authentication
- Email/password signup and login
- Firebase Authentication integration
- Protected routes for authenticated users
- Session persistence

### Article Management
- Real-time article fetching from Firestore
- Article creation, update, and deletion
- Article categorization and tagging
- View count tracking
- Image upload support via Cloud Storage

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Fully responsive layouts
- Optimized for all screen sizes

### State Management
- Zustand for global state (Auth)
- React hooks for local state
- Real-time Firebase listeners

## Architecture

### Technology Stack
- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Deployment**: Firebase Hosting
- **CI/CD**: GitHub Actions

### Data Flow

```
User Interface
     ↓
React Components
     ↓
Zustand Store / Service Layer
     ↓
Firebase SDK
     ↓
Firebase Services (Auth, Firestore, Storage)
```

## Firebase Collections Schema

### articles
```typescript
{
  id: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  imageUrl: string;
  category: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  views: number;
  featured: boolean;
}
```

### users (managed by Firebase Auth)
```typescript
{
  uid: string;
  email: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
}
```

## Deployment

### Prerequisites for Deployment
1. Firebase project with Firestore and Authentication enabled
2. GitHub repository with secrets configured
3. Firebase CLI installed locally

### GitHub Secrets Required
```
FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN
FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID
FIREBASE_APP_ID
FIREBASE_SERVICE_ACCOUNT (JSON key)
```

### Deploy to Firebase Hosting

1. **Initialize Firebase in your project**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   firebase deploy
   ```

### Automated Deployment with GitHub Actions

The CI/CD pipeline automatically:
- Runs linter on every push
- Type-checks the codebase
- Builds the application
- Deploys to Firebase Hosting on push to `main` branch

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Type check TypeScript

## Environment Variables

### Development
Copy `.env.local.example` to `.env.local` and fill in your Firebase credentials.

### Production
Set GitHub secrets with the same variable names (without `NEXT_PUBLIC_` prefix for sensitive values).

## Security Best Practices

1. **Firestore Security Rules**
   ```
   match /articles/{document=**} {
     allow read: if request.auth != null;
     allow create, update, delete: if request.auth.uid == resource.data.authorId;
   }
   
   match /users/{uid} {
     allow read, update: if request.auth.uid == uid;
     allow create: if request.auth != null;
   }
   ```

2. **Environment Variables**
   - Never commit `.env.local`
   - Use GitHub secrets for sensitive data
   - Public Firebase config is safe (client-side only)

3. **Authentication**
   - Protect all authenticated routes
   - Validate user permissions server-side
   - Use secure session management

## Performance Optimization

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- CSS-in-JS with Tailwind (optimized)
- Firebase indexes for fast queries
- Browser caching strategies

## Troubleshooting

### Firebase Connection Issues
- Verify `.env.local` configuration
- Check Firebase project permissions
- Ensure Firestore and Auth are enabled

### Build Failures
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `npm ci`
- Check TypeScript errors: `npm run type-check`

### Deployment Issues
- Check GitHub Actions logs
- Verify Firebase credentials in secrets
- Ensure Firebase project has enough quota

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linter and tests
4. Submit a pull request

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
