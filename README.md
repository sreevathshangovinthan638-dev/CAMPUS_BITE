# CampusBite — PSG College of Arts & Science Food Court

> **Good Food • Brighter Days**  
> *Order • Pay • Pickup • Enjoy*  
> *Same Campus, More Good Food*

An end-to-end food court pre-ordering, kitchen management, and digital invoice platform engineered for **PSG College of Arts & Science (PSGCAS)**. Compatible across **Laptop Websites** and **Mobile Devices**.

---

## 📱 14 Replicated Design System Screens

CampusBite features high-fidelity replicas of all 14 screens from the official design specification:

1. **01. Home Page** (`/`) — Majestic PSGCAS campus heritage hero, quick info pills (Fresh Food, Quick Pickup, Made for PSGCAS), "Delicious Food Happier Campus", Order Now CTA, and portal switchers.
2. **02. Role Signup** (`/signup`) — Interactive role selection cards for Student, Teacher, Admin, and Kitchen Staff.
3. **03. Role Login** (`/login`) — 4-tab role authentication with one-click demo logins and Google SSO integration.
4. **04. Student Dashboard** (`/student`) — Personalized greeting for Akash R., instant food search, "Fuel Your Day" promo banner, and circular categories.
5. **05. Menu / Categories** (`/menu`) — Rich category browser with authentic photos and descriptions.
6. **06. Food Items Page** (`/menu?cat=breakfast`) — Steamer/crispy South Indian delicacies (Idli Sambar ₹30, Masala Dosa ₹50, Pongal ₹40, Filter Coffee ₹25) with `- 1 +` counter.
7. **07. Cart Page** (`/cart`) — Dish review, quantity steppers, special cooking instructions, item breakdown, and subtotal.
8. **08. Pickup Time Selection** (`/pickup-time`) — Multi-day picker (Today, Tomorrow, Fri) with "Now (10-15 mins) Fastest" and scheduled slots.
9. **09. Payment Page (UPI / QR)** (`/payment`) — Dynamic UPI QR generator, one-click UPI ID copy (`campusbite@psg`), and payment verification.
10. **10. Pay-Bill / Invoice** (`/bill`) — Digital GST receipt (CGST 2.5%, SGST 2.5%), PSGCAS Food Court branding, print/PDF download, and share.
11. **11. Order Tracking** (`/orders`) — Live 4-stage stepper (Order Placed ➔ Preparing ➔ Ready for Pickup ➔ Completed) with estimated ready time.
12. **12. Teacher Dashboard** (`/teacher`) — Faculty exclusive lounge for Dr. Priya V., "A peaceful break for brighter ideas" coffee banner, and faculty express pickup.
13. **13. Admin Dashboard** (`/admin`) — 4 core metric cards (Total Orders 327 ▲12%, Total Revenue ₹24,560 ▲8%, Active Users 286 ▲5%, Avg Order Value ₹75 ▲6%), hourly trend chart, and live menu editor.
14. **14. Kitchen Dashboard (KDS)** (`/kitchen`) — Real-time kitchen display system with Pending (5), Preparing (3), Ready (2) tabs and one-click order progression.

---

## 🚀 Quick Start (Local Run)

### 1. Automatic One-Click Launcher (Windows)
Double-click `RUN_CAMPUSBITE.bat` from the root folder. It automatically starts Django on `http://127.0.0.1:8000` and Vite on `http://localhost:5173`.

### 2. Manual Start

#### Backend (Django REST Framework):
```bash
cd CampusBite_PSGCAS/backend
python manage.py migrate
python manage.py seed_campusbite
python manage.py runserver 127.0.0.1:8000
```

#### Frontend (React + Vite):
```bash
cd CampusBite_PSGCAS/frontend
npm install
npm run dev
```
Open **http://localhost:5173/** in your browser.

---

## 🔑 Demo Access Credentials

| Role | Username / Staff ID | Password | Portal Features |
|---|---|---|---|
| **Student** | `student` or `23BCS042` | `student123` | Browse menu, order food, UPI payment, live order tracking |
| **Teacher** | `teacher` or `FAC-8842` | `teacher123` | Faculty coffee lounge, express priority counter pickup |
| **Admin** | `admin` | `admin123` | Sales analytics, revenue trends, live food editor, stock toggle |
| **Kitchen Staff** | `kitchen` | `kitchen123` | Kitchen display system, real-time ticket progression |

*Tip: You can switch roles at any time using the role pill in the top navigation bar or the one-click demo buttons.*

---

## 🌐 Deployment Guide

### Frontend Deployment (Vercel / Netlify / Render)
1. Push repository to GitHub.
2. Link the repository on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Set **Root Directory** to `CampusBite_PSGCAS/frontend`.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com/api/` (Optional: frontend includes standalone fallback if backend is offline).

### Backend Deployment (Render / Railway)
1. Set **Root Directory** to `CampusBite_PSGCAS/backend`.
2. Build Command: `./build.sh` (or `pip install -r requirements.txt && python manage.py migrate && python manage.py seed_campusbite`)
3. Start Command: `gunicorn campusbite.wsgi:application`
4. Set Environment Variables:
   - `PYTHON_VERSION`: `3.12.0`
   - `DEBUG`: `False`
   - `SECRET_KEY`: `your-secure-secret-key`
   - `ALLOWED_HOSTS`: `.onrender.com,localhost,127.0.0.1`
