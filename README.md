# CampusBite — PSGCAS Food Court

A responsive React frontend and Django demo backend for campus food ordering.

## Current flow
College homepage → Order Now → Student / Teacher / Kitchen / Admin → Login or Signup. Student and Teacher accounts continue to food categories, food items, cart, pickup time, UPI payment, bill and order tracking. Kitchen and Admin have separate dashboards.

The supplied campus photograph and CampusBite logo are included. Food category pages use a clean interface with search, Back and Cart controls.

## Run the frontend
Requires Node.js and npm.

```sh
cd CampusBite_PSGCAS/frontend
npm ci
npm run dev -- --host 127.0.0.1
```

Open http://127.0.0.1:5173. With VITE_API_URL unset, the app runs using local demo data. Environment templates are included; local environment files are excluded from Git.

```sh
npm run build
npm run preview
node --test tests/receipts.test.js
```

## Bills and UPI
The payment screen displays the supplied UPI QR image and payee details. Card and wallet options are removed. Users enter the displayed amount in their UPI app; the website does not initiate or verify a bank transfer.

Each new bill includes customer name, India-local date/time, food names, quantities, prices, totals, pickup slot and a unique CODE128 barcode. Bills remain pending payment verification. Print / Save PDF is supported.

Receipt history and kitchen barcode lookup are stored in the same browser. A keyboard-style barcode scanner can enter the bill ID into the kitchen search field. Shared cross-device lookup requires backend integration.

## Optional Django demo backend
See [backend setup](CampusBite_PSGCAS/README.md). Configure VITE_API_URL explicitly to connect it. The existing backend authentication is for demonstrations and must be replaced with verified authentication and role permissions before production use.

## Deploy the frontend demo
- Project root: `CampusBite_PSGCAS/frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Leave `VITE_API_URL` unset for a standalone demo.
- Vercel SPA rewrites and Netlify redirects are included.

Install dependencies from the lockfile and generate `dist` during deployment. Generated builds, dependencies, local databases, caches and environment files are not committed.

## Project files
- `CampusBite_PSGCAS/frontend`: app source, assets, receipt tests and deployment configuration.
- `CampusBite_PSGCAS/backend`: Django source and migrations.
- `CampusBite_PSGCAS/design-reference`: supplied reference and 14 extracted panels.
- [Local review notes](CampusBite_PSGCAS/LOCAL_REVIEW.md): implementation notes and manual checks.

This repository includes a personal UPI payment image supplied by the project owner. Payment verification, genuine server authentication, authorization and shared order persistence are required before taking real campus orders.
