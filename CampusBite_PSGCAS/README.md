# CampusBite — PSGCAS Food Court

A review-ready demo project based on the CampusBite UI/UX flow:

Menu → Category → Food → Cart → Pickup Time → QR/Cash Payment → Pay-Bill → Order Tracking

## Technology

- Frontend: React + Vite
- Backend: Django REST Framework
- Development database: SQLite
- QR: qrcode.react
- API: Axios

## 1. Backend setup

Open a terminal in `backend`.

### Windows

```bash
python -m venv env
env\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py seed_campusbite
python manage.py createsuperuser
python manage.py runserver
```

Backend:

- http://127.0.0.1:8000/
- Admin: http://127.0.0.1:8000/admin/
- API health: http://127.0.0.1:8000/api/health/
- Foods: http://127.0.0.1:8000/api/foods/

## 2. Frontend setup

Open another terminal in `frontend`.

```bash
npm install
npm run dev
```

Open:

http://localhost:5173/

## 3. Demo data

`python manage.py seed_campusbite` creates:

- Breakfast
- Lunch
- Snacks
- Juice
- Chat Items
- Ice Cream

and example food items.

## 4. Food images

You can add actual food images from Django Admin:

1. Open `/admin/`
2. Open Foods
3. Add/Edit food
4. Upload an image

Until then, the frontend uses placeholder images.

## 5. Payment note

The UPI QR in this project is for UI/manual verification only.

The `Payment Completed` button saves the order as paid for demo purposes. It does not independently verify a bank transaction.

For production, replace this with a real payment provider and server-side verification/webhooks.

## 6. Manual review checklist

1. Start Django backend.
2. Start React frontend.
3. Open CampusBite.
4. Switch between categories.
5. Add food to cart.
6. Change item quantity.
7. Choose pickup time.
8. Proceed to Payment.
9. View dynamic QR based on amount.
10. Complete demo payment.
11. Verify Pay-Bill.
12. Print Pay-Bill.
13. Open My Orders to see tracking.
14. Open Django Admin to review saved orders.
15. Change order status from Admin or API and refresh tracking.

## 7. Production deployment

Before public deployment:

- set `DEBUG = False`
- use environment variables for secret keys
- configure `ALLOWED_HOSTS`
- use PostgreSQL
- configure a production static/media service
- use HTTPS
- use a production WSGI server
- replace demo QR logic with verified payment integration
