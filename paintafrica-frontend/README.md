# PaintAfrica — Frontend

React + Vite + Tailwind CSS v4 frontend for the PaintAfrica print & design marketplace connecting customers, printing businesses, and designers across Africa.

## Stack

- React 19 + Vite
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- React Router v7
- Axios (talks to the Express backend via JWT auth)
- Supabase JS client (authentication)
- lucide-react (icons)

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your Supabase project URL + anon key + backend API URL
npm run dev
```

The app runs at `http://localhost:5173`.

## What's implemented

| Area | Status |
|---|---|
| Routing, layout, role-based route guards | ✅ Complete |
| Supabase auth (register/login/logout, JWT session) | ✅ Complete — requires `.env` with Supabase keys |
| Axios client + JWT interceptors | ✅ Complete — attaches JWT to all requests |
| API Integration | ✅ Complete with fallback to mock data |
| Customer: Catalog, Order Form, My Orders | ✅ Complete — connected to `servicesApi` & `ordersApi` |
| Business: Dashboard (incoming orders, quotes, status, PDF quote upload) | ✅ Complete — connected to `ordersApi` |
| Designer: Portfolio (profile, design requests) | ✅ Complete — connected to `designsApi` |
| Admin: User/Business Management | ✅ Complete — connected to `usersApi` |
| Home, How It Works, Not Found pages | ✅ Complete |
| Toast notification system | ✅ Complete — global error/success messaging |

All pages have real API integration with graceful fallback to mock data if the backend is unavailable.

## PDF quote flow

- Business users can attach a PDF quote from the Business Dashboard when responding to a pending order.
- The PDF is uploaded to Supabase Storage in a bucket named `quotes`.
- The app sends the uploaded file URL to the backend as `file_url` in `PATCH /orders/:id/quote`.
- Customers can open the uploaded PDF from `My Orders`.
- The Business Dashboard also shows a link to the uploaded PDF once the quote is sent.

Make sure the `quotes` bucket exists in Supabase and that uploads are allowed for your configured auth rules.

## Project structure

```
src/
├── api/              
│   ├── axiosClient.js          # Axios with JWT + error interceptors
│   └── endpoints/
│       ├── orders.api.js
│       ├── services.api.js
│       ├── designs.api.js
│       └── users.api.js
├── auth/             
│   ├── AuthContext.jsx         # Supabase auth provider
│   └── ProtectedRoute.jsx      # Role-based route protection
├── components/
│   ├── common/        # Button, Input, StatusBadge, CropCard
│   └── layout/        # Navbar, Footer, AppLayout
├── context/
│   └── ToastContext.jsx        # Global toast notifications
├── pages/
│   ├── customer/      # Catalog, OrderForm, MyOrders, Home, HowItWorks
│   ├── business/      # Dashboard
│   ├── designer/      # Portfolio
│   ├── admin/         # Users management
│   └── NotFound.jsx
├── lib/               # Supabase client, mock data (temporary)
├── pages/
│   ├── customer/       # Home, Catalog, OrderForm, MyOrders, auth pages
│   ├── business/        # Dashboard
│   ├── designer/         # Portfolio
│   └── admin/             # Users
└── routes/            # AppRoutes.jsx — all route definitions in one place
```

## Design system

Tokens live in `src/index.css` under `@theme`. The palette and type system
are drawn from the print-production world this product serves (ink,
uncoated stock, job tickets) — see the comments in that file before adding
new colors so new UI stays consistent with the rest of the app.

## Roles

Every account has a `role` (`customer`, `business`, `designer`, `admin`)
stored in Supabase's `user_metadata` at sign-up. `ProtectedRoute` reads this
to guard role-specific pages — see `src/routes/AppRoutes.jsx`.

## Next steps

1. Create a Supabase project, run the SQL migration from
   `docs/04-DATABASE-ERD.md`, and drop your project URL/anon key into `.env`.
2. Build the Express backend (Phase 3) following `docs/03-ARCHITECTURE.md`.
3. Update the backend quote endpoint to persist `file_url`/`quote_file_url`.
4. Replace the remaining mock data calls (see `// TODO:` comments) with real API calls.
