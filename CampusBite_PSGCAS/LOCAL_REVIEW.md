# CampusBite original design — local review

## Run
From CampusBite_PSGCAS/frontend:

    npm ci
    npm run dev -- --host 127.0.0.1

Visit http://127.0.0.1:5173. The preview uses local demo data when VITE_API_URL is unset. Orders and the bag persist in this browser. No backend is needed for this review.

## Manual checks
- Home: original campus hero, Order Now, six category links, four campus portals.
- Menu: search, category filters, back/forward navigation, clear search, no results.
- Bag: add, increase, decrease, remove, reload and verify persistence.
- Checkout: select pickup time, simulate payment, inspect bill, view orders.
- Mobile: test at 390px width; inspect bottom navigation and floating cart.
- Portals: select student, teacher, admin and kitchen from the account menu.
- Accessibility: tab through links and controls; check visible focus.

## Build and static demo deployment
    npm run build
    npm run preview -- --host 127.0.0.1

Deploy frontend/dist as a STATIC DEMO. For Vercel use CampusBite_PSGCAS/frontend as root, npm run build as build command, and dist as output. SPA rewrites are included. Keep VITE_API_URL unset for the standalone demo.

## Before real campus operation
The existing Django backend trusts role headers and offers demo role login. It must not be exposed as a production ordering service. Replace demo authentication with server-validated sessions/tokens and role permissions; enforce ownership on orders; verify prices and availability on the server; integrate verified payment webhooks; configure secrets, HTTPS and production database; test these flows before taking real orders. The interface changes do not implement those backend requirements.

## Visual assets
The original navy-and-gold stylesheet, college logo, campus photograph, portal cards, navigation and device switcher are active again. Home and navigation were reconstructed from the original source inspected in this session; no untouched Git backup was available. The unused refresh.css and campus-feast.svg are retained but no longer referenced by the interface. Menu photographs are externally hosted and need internet access. Small retained changes fix currency symbols, category history/reset behavior, keyboard focus and unavailable item controls.

GitHub push deferred at your request until manual review.


## Latest homepage: hand-drawn outline
The homepage now follows outline.jpeg: logo and CampusBite at top left; Home and Login/Logout at top right; supplied college entrance photo; Order Now alongside the food heading; four Student, Teacher, Kitchen and Admin portal cards with separate login/signup links. On mobile the cards use two columns and the ordering section stacks.

The college photo is copied unchanged from images.jpg to frontend/public/psgcas-gateway.jpg. Portal links pass a validated role query to both auth pages. Logout now clears the current user. Authentication remains demo-only.

Validation: production build passed; desktop/mobile homepage visually checked; Teacher login and Kitchen signup role selection checked in browser.

## Latest ordering and billing changes
- Landing page: college photo and Order Now. Role selection is now a separate /portals page, followed by role-specific login/signup. Header Home/Login links removed.
- Payment: supplied upiiiii.jpeg copied unchanged to frontend/public/upi-payment.jpeg; only UPI offered. Check the payee shown in the image and manually enter the displayed bill total. No real transfer is initiated by the website.
- Bills: customer name, India-local date/time, pickup slot, food names, quantities, unit prices, line amounts, totals, payment reference and verification status. Each new bill has a cryptographically random UUID represented as CB plus decimal digits and encoded in CODE128.
- Print / Save PDF prints only the bill. Previous bills are retained in this browser, with individual /bill?id= links. Links do not transfer receipt data to another device.
- Kitchen: bill IDs match the queue. Use the barcode search input with a keyboard-wedge barcode scanner or type/paste the ID. Order status updates synchronize within the browser and across its tabs.
- Payments remain awaiting verification; selecting UPI or submitting the form does not mark the order paid. Django's order creation was also changed to preserve pending payment status.
- This is a local preview: receipts and barcode lookup are browser-local. Shared cross-device receipt lookup, genuine staff authorization and bank payment verification still require production backend work. No physical scanner validation or live payment was performed.
- Validation: production build; node --test tests/receipts.test.js (1000 unique IDs, CODE128 generation, saved bill/queue ID consistency, history preservation and status persistence).
