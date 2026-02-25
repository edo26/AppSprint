# ⚡ AppSprint

**A shareware idea submission platform built with Next.js, Google OAuth, and Google Sheets as the database.**

---

## 🚀 Features

- **Google OAuth Login** — Sign in with Google required to submit
- **Idea Submission Form** — Title, description (500 char limit), target user, monetization
- **One Submission Per Email** — Free tier enforces 1 idea per account
- **User Dashboard** — View submission status (Pending, Approved, Rejected, In Progress, Completed)
- **Admin Dashboard** — Review all submissions, approve/reject, add rejection reasons
- **Settings Panel** — Toggle submissions, change char limit, update pricing
- **Google Sheets DB** — All data stored in Google Sheets via Apps Script Web App

---

## 🏗️ Architecture

```
AppSprint/
├── src/
│   ├── app/                    # Next.js App Router pages & API routes
│   │   ├── api/
│   │   │   ├── auth/           # NextAuth handler
│   │   │   ├── submissions/    # User submission API
│   │   │   ├── admin/          # Admin-only APIs (submissions + settings)
│   │   │   └── settings/       # Public settings API
│   │   ├── dashboard/          # User dashboard
│   │   ├── submit/             # Idea submission form
│   │   ├── admin/              # Admin dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Landing page
│   │   └── globals.css
│   ├── components/             # Shared UI components
│   ├── interfaces/             # TypeScript interfaces (ISP)
│   │   ├── repositories.ts
│   │   └── services.ts
│   ├── repositories/           # Data access layer (GAS API calls)
│   │   └── gasRepository.ts
│   ├── services/               # Business logic layer
│   │   ├── userService.ts
│   │   ├── submissionService.ts
│   │   └── settingsService.ts
│   ├── lib/
│   │   ├── constants.ts        # App-wide constants
│   │   └── container.ts        # DI container
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── auth.ts                 # NextAuth config
│   └── middleware.ts           # Route protection
├── gas/
│   └── Code.js                 # Google Apps Script backend
└── .env.example                # Environment variable template
```

### SOLID Principles Applied

| Principle | Implementation |
|-----------|---------------|
| **S**ingle Responsibility | Each service/repository handles one concern |
| **O**pen/Closed | Add endpoints by extending, not modifying base |
| **L**iskov Substitution | Repository impls satisfy their interfaces |
| **I**nterface Segregation | Separate interfaces for users, submissions, settings |
| **D**ependency Inversion | Services depend on interfaces, DI via container |

---

## ⚙️ Setup

### 1. Clone & Install

```bash
git clone <repo>
cd AppSprint
npm install
```

### 2. Google Sheets Setup

1. Create a new Google Sheets spreadsheet
2. Add 3 sheets named exactly:
   - **users** — columns: `id`, `name`, `email`, `created_at`
   - **submissions** — columns: `id`, `user_email`, `title`, `description`, `target_user`, `monetization`, `status`, `rejection_reason`, `created_at`, `updated_at`
   - **settings** — columns: `key`, `value`
3. Add these initial settings rows to the `settings` sheet:
   ```
   key                     | value
   accepting_submissions   | true
   char_limit              | 500
   max_free_submissions    | 1
   pricing_free            | Free
   pricing_pro             | $29/mo
   pricing_enterprise      | Custom
   ```

### 3. Google Apps Script Setup

1. In your Spreadsheet, go to **Extensions → Apps Script**
2. Replace the default code with the contents of `gas/Code.js`
3. Click **Deploy → New Deployment**
4. Type: **Web app**
5. Execute as: **Me**
6. Who has access: **Anyone**
7. Copy the deployment URL

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable **Google+ API** and **Google Identity**
4. Create OAuth 2.0 credentials (Web Application)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### 5. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
AUTH_SECRET=run-openssl-rand-base64-32
NEXT_PUBLIC_GAS_API_URL=your-apps-script-url
NEXT_PUBLIC_ADMIN_EMAILS=your-admin@email.com
NEXTAUTH_URL=http://localhost:3000
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🚢 Deploy to Vercel

1. Push to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Add all environment variables in Vercel project settings
4. Update `NEXTAUTH_URL` to your Vercel deployment URL
5. Update Google OAuth redirect URIs to include your Vercel domain

---

## 📊 Google Sheets Structure

### `users` sheet
| id | name | email | created_at |
|----|------|-------|------------|

### `submissions` sheet
| id | user_email | title | description | target_user | monetization | status | rejection_reason | created_at | updated_at |
|----|-----------|-------|-------------|-------------|--------------|--------|-----------------|------------|------------|

### `settings` sheet
| key | value |
|-----|-------|
| accepting_submissions | true |
| char_limit | 500 |
| max_free_submissions | 1 |
| pricing_free | Free |
| pricing_pro | $29/mo |
| pricing_enterprise | Custom |

---

## 🔒 Security

- Server-side session validation on all API routes
- Admin routes double-protected (middleware + ADMIN_EMAILS env)
- Email ownership enforced (users can only access their own submissions)
- Character limits enforced both client-side and server-side (GAS)

---

## 🤖 Future AI Integration

The architecture is designed for easy AI integration:
- Swap `SubmissionRepository` with an AI-backed repo in `container.ts`
- Add `AIReviewService` implementing `ISubmissionService`
- No changes required to UI or API layers

---

MIT License © 2025 AppSprint
