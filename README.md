# LoanPilot — Loan Management System

A full-stack lending platform where borrowers apply for loans through a multi-step portal and internal executives manage those loans through their lifecycle via a role-guarded operations dashboard.

## Tech Stack

| Layer        | Technology                                      |
| ------------ | ----------------------------------------------- |
| Frontend     | Next.js (App Router), TypeScript, Tailwind CSS, TanStack Query |
| Backend      | Node.js, Express.js, TypeScript                 |
| Database     | MongoDB Atlas, Mongoose                         |
| Auth         | JWT, bcrypt                                     |
| File storage | Cloudinary (salary slips)                       |

## Project Structure

```
.
├── api/                      Express + TypeScript backend
│   └── src/
│       ├── config/           Environment, database and Cloudinary setup
│       ├── constants/        Roles, loan statuses, limits, PAN regex
│       ├── controllers/      Route handlers (auth, borrower, operations)
│       ├── middlewares/      Auth (JWT), RBAC, upload (multer), error handler
│       ├── models/           Mongoose schemas (User, Loan, Payment)
│       ├── routes/           Express routers
│       ├── seed/             Seed script for role accounts
│       ├── services/         Business Rule Engine, interest calc, Cloudinary upload
│       ├── utils/            ApiError, asyncHandler, JWT helpers
│       └── validators/       Zod request schemas
└── web/                      Next.js frontend
    └── src/
        ├── app/              Routes — each has a server page.tsx (SEO metadata)
        │                     and a client view.tsx (TanStack Query)
        ├── components/       Reusable UI, apply wizard steps, dashboard pieces
        ├── hooks/            useCurrentUser (query-backed)
        ├── lib/              Axios client, query functions + keys, auth, formatters
        ├── types/            Shared TypeScript types
        └── middleware.ts     Cookie-based route protection per role
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB connection string (Atlas or local)
- A Cloudinary account (cloud name, API key, API secret)

### 1. Backend

```bash
cd api
npm install
copy .env.example .env   # cp on macOS/Linux — fill in DB_URL, Cloudinary keys, JWT_SECRET
npm run seed             # creates one account per role
npm run dev              # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd web
npm install
copy .env.example .env   # cp on macOS/Linux
npm run dev              # starts on http://localhost:3000
```

### Environment Variables

**api/.env**

| Variable | Purpose |
| -------- | ------- |
| `PORT` | API port (default 5000) |
| `DB_URL` | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials for salary slip uploads |
| `JWT_SECRET` | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | Token lifetime (default 7d) |
| `CLIENT_URL` | Allowed CORS origin |

**web/.env**

| Variable | Purpose |
| -------- | ------- |
| `NEXT_PUBLIC_API_URL` | Backend base URL |
| `NEXT_PUBLIC_APP_URL` | Public site URL (SEO metadata base) |

## Seeded Login Credentials

| Role         | Email                | Password     |
| ------------ | -------------------- | ------------ |
| Admin        | admin@lms.com        | Admin@123    |
| Sales        | sales@lms.com        | Sales@123    |
| Sanction     | sanction@lms.com     | Sanction@123 |
| Disbursement | disbursement@lms.com | Disburse@123 |
| Collection   | collection@lms.com   | Collect@123  |
| Borrower     | borrower@lms.com     | Borrower@123 |

## Borrower Journey

1. **Sign up / login** — JWT issued on success, passwords hashed with bcrypt.
2. **Personal details** — full name, PAN, date of birth, monthly salary, employment mode. A server-side Business Rule Engine rejects the application if:
   - Age is not between 23 and 50
   - Monthly salary is below ₹25,000
   - PAN does not match `^[A-Z]{5}[0-9]{4}[A-Z]$`
   - Employment mode is Unemployed
3. **Salary slip upload** — PDF/JPG/PNG, max 5 MB, uploaded to Cloudinary and linked to the application.
4. **Loan configuration** — amount (₹50K–₹5L) and tenure (30–365 days) via sliders with a live simple-interest panel at a fixed 12% p.a.:
   - `SI = (P × R × T) / (365 × 100)` where T is tenure in days
   - `Total Repayment = P + SI`

The BRE runs on the server as the source of truth (client-side checks exist only for faster feedback — client validation can always be bypassed), and runs again at apply time in case rules changed between steps.

## Loan Status Lifecycle

```
applied ──approve──> sanctioned ──disburse──> disbursed ──fully repaid──> closed
   │
   └────reject────> rejected
```

| Transition            | Triggered by            |
| --------------------- | ----------------------- |
| applied → sanctioned  | Sanction exec / Admin   |
| applied → rejected    | Sanction exec / Admin (reason required) |
| sanctioned → disbursed| Disbursement exec / Admin |
| disbursed → closed    | Automatic, when total paid equals total repayment |

## Operations Dashboard

| Module       | Who sees it           | What it does                                        |
| ------------ | --------------------- | --------------------------------------------------- |
| Sales        | Sales, Admin          | Leads — registered borrowers who haven't applied    |
| Sanction     | Sanction, Admin       | Reviews applied loans; approve or reject with reason |
| Disbursement | Disbursement, Admin   | Marks sanctioned loans as disbursed                 |
| Collection   | Collection, Admin     | Records payments (unique UTR, amount, date); auto-closes fully repaid loans |

### RBAC

- Roles are stored on the user document and embedded in the JWT.
- Backend: `authenticate` middleware verifies the JWT, `authorize(...roles)` checks the role (admin always passes). `401` for missing/invalid tokens, `403` for insufficient role.
- Frontend: Next.js middleware reads the role cookie and redirects users away from routes they cannot access; the sidebar only renders permitted modules. Hiding UI is never relied upon — every API route re-checks on the server.

## Frontend Notes

- **TanStack Query** powers all data fetching and mutations — typed query functions and centralised query keys live in `web/src/lib/queries.ts`, with cache invalidation across modules (e.g. approving a loan refreshes the disbursement queue).
- **SEO** — every route exports metadata from a server `page.tsx` (title template, descriptions, Open Graph); authenticated pages are marked `noindex`.
- **Responsive** — mobile-first layouts: collapsible dashboard navigation on small screens, horizontally scrollable tables, stacked forms and summary grids.

## API Overview

| Method | Route | Access | Purpose |
| ------ | ----- | ------ | ------- |
| POST | `/api/auth/register` | Public | Create borrower account |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Authenticated | Current user |
| PUT | `/api/borrower/personal-details` | Borrower | Save details, runs BRE (422 with failed rules) |
| POST | `/api/borrower/salary-slip` | Borrower | Upload salary slip to Cloudinary (multipart) |
| POST | `/api/borrower/loans` | Borrower | Apply for a loan (status `applied`) |
| GET | `/api/borrower/loans` | Borrower | Own loans with payments |
| GET | `/api/operations/sales/leads` | Sales, Admin | Borrowers without applications |
| GET | `/api/operations/sanction/loans` | Sanction, Admin | Applied loans |
| PATCH | `/api/operations/sanction/loans/:id` | Sanction, Admin | Approve / reject with reason |
| GET | `/api/operations/disbursement/loans` | Disbursement, Admin | Sanctioned loans |
| PATCH | `/api/operations/disbursement/loans/:id/disburse` | Disbursement, Admin | Mark disbursed |
| GET | `/api/operations/collection/loans` | Collection, Admin | Disbursed + closed loans |
| GET | `/api/operations/collection/loans/:id/payments` | Collection, Admin | Payments for a loan |
| POST | `/api/operations/collection/loans/:id/payments` | Collection, Admin | Record payment |

All responses share the envelope `{ success, data }` on success and `{ success, message, details? }` on failure.

### API optimisations

- `gzip` compression on all responses.
- Read endpoints use lean Mongoose queries (plain objects, no hydration overhead) with field projection on populated borrower data.
- Indexes on `loans.borrower`, `loans.status` and a unique index on `payments.utr`.
- JSON body size capped at 1 MB; file uploads stream to Cloudinary from memory (no disk writes).

### Payment validations

- UTR is unique across all payments (enforced both in the handler and by a unique index).
- Amount must be positive and cannot exceed the outstanding balance.
- Payment date cannot be in the future.
- When total paid reaches total repayment the loan auto-closes.

## Data Model

**users** — `name`, `email` (unique), `password` (bcrypt, excluded by default), `role`, `personalDetails { fullName, pan, dateOfBirth, monthlySalary, employmentMode }`, `salarySlip` (Cloudinary URL)

**loans** — `borrower → users`, `amount`, `tenureDays`, `interestRate`, `interest`, `totalRepayment`, `amountPaid`, `status`, `salarySlip`, `rejectionReason`, `sanctionedBy/At`, `disbursedBy/At`, `closedAt`

**payments** — `loan → loans`, `utr` (unique), `amount`, `paidAt`, `recordedBy → users`
