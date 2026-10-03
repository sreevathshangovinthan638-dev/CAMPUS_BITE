from decimal import Decimal
from django.utils import timezone
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction

from .models import Category, Food, Order, OrderItem, Payment, UserProfile
from .serializers import CategorySerializer, FoodSerializer, OrderSerializer


def get_user_role(request):
    """Determine role from header or user object."""
    role_header = request.headers.get('X-Role') or request.headers.get('x-role')
    if role_header in ['admin', 'kitchen', 'student', 'teacher']:
        return role_header
    if request.user.is_authenticated:
        if request.user.is_superuser or request.user.is_staff:
            return 'admin'
        try:
            return request.user.profile.role
        except Exception:
            return 'student'
    return 'student'


@api_view(['GET'])
def health(request):
    return Response({'status': 'ok', 'app': 'CampusBite'})


# ==========================================
# AUTHENTICATION (STUDENT, TEACHER, ADMIN, KITCHEN)
# ==========================================

@api_view(['POST'])
def auth_login(request):
    payload = request.data
    role = payload.get('role')
    username = payload.get('username', '').strip()
    password = payload.get('password', '').strip()

    # Fast demo quick-login by role
    if role in ['admin', 'kitchen', 'student', 'teacher'] and not username:
        if role == 'admin':
            user, _ = User.objects.get_or_create(username='admin', defaults={'first_name': 'Campus', 'last_name': 'Admin', 'email': 'admin@psgcas.ac.in', 'is_staff': True, 'is_superuser': True})
            if not user.password:
                user.set_password('admin123')
                user.save()
        elif role == 'kitchen':
            user, _ = User.objects.get_or_create(username='kitchen', defaults={'first_name': 'Head', 'last_name': 'Chef', 'email': 'kitchen@psgcas.ac.in'})
            if not user.password:
                user.set_password('kitchen123')
                user.save()
        elif role == 'teacher':
            user, _ = User.objects.get_or_create(username='teacher', defaults={'first_name': 'Dr. Priya', 'last_name': 'V', 'email': 'priya.cs@psgcas.ac.in'})
            if not user.password:
                user.set_password('teacher123')
                user.save()
        else:
            user, _ = User.objects.get_or_create(username='student', defaults={'first_name': 'Akash', 'last_name': 'R', 'email': 'student@psgcas.ac.in'})
            if not user.password:
                user.set_password('student123')
                user.save()

        profile, _ = UserProfile.objects.get_or_create(user=user, defaults={'role': role})
        profile.role = role
        if role == 'teacher' and not profile.roll_number:
            profile.roll_number = 'FAC-8842'
        profile.save()

        return Response({
            'token': f'cb-token-{user.id}-{role}',
            'user': {
                'id': user.id,
                'username': user.username,
                'fullName': f'{user.first_name} {user.last_name}'.strip() or user.username,
                'email': user.email,
                'role': role,
                'rollNumber': profile.roll_number,
            }
        })

    # Standard credential login
    if not username:
        return Response({'detail': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if not user:
        # Fallback for demo users
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

    profile, _ = UserProfile.objects.get_or_create(
        user=user,
        defaults={'role': 'admin' if user.is_superuser or user.is_staff else 'student'}
    )

    user_role = profile.role
    if user.is_superuser:
        user_role = 'admin'

    return Response({
        'token': f'cb-token-{user.id}-{user_role}',
        'user': {
            'id': user.id,
            'username': user.username,
            'fullName': f'{user.first_name} {user.last_name}'.strip() or user.username,
            'email': user.email,
            'role': user_role,
            'rollNumber': profile.roll_number,
        }
    })


@api_view(['POST'])
def auth_register(request):
    payload = request.data
    username = payload.get('username', '').strip()
    password = payload.get('password', '').strip()
    full_name = payload.get('full_name', '').strip()
    roll_number = payload.get('roll_number', '').strip()
    email = payload.get('email', '').strip()
    role = payload.get('role', 'student')

    if not username or not password:
        return Response({'detail': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'detail': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    first_name = full_name.split()[0] if full_name else username
    last_name = " ".join(full_name.split()[1:]) if len(full_name.split()) > 1 else ""

    user = User.objects.create_user(
        username=username,
        password=password,
        email=email,
        first_name=first_name,
        last_name=last_name
    )
    profile = UserProfile.objects.create(
        user=user,
        role=role,
        roll_number=roll_number
    )

    return Response({
        'token': f'cb-token-{user.id}-{role}',
        'user': {
            'id': user.id,
            'username': user.username,
            'fullName': full_name or user.username,
            'email': user.email,
            'role': role,
            'rollNumber': profile.roll_number,
        }
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def auth_me(request):
    role = get_user_role(request)
    return Response({
        'status': 'ok',
        'role': role,
        'authenticated': True
    })


# ==========================================
# CATEGORIES & FOODS
# ==========================================

@api_view(['GET'])
def categories(request):
    data = Category.objects.all().order_by('id')
    return Response(CategorySerializer(data, many=True).data)


@api_view(['GET'])
def foods(request):
    category = request.GET.get('category')
    include_all = request.GET.get('all') == 'true'

    if include_all:
        data = Food.objects.all().select_related('category')
    else:
        data = Food.objects.filter(is_available=True).select_related('category')

    if category and category != 'all':
        data = data.filter(category__name=category)

    serializer = FoodSerializer(data, many=True, context={'request': request})
    return Response(serializer.data)


# ==========================================
# ADMIN FOOD MANAGEMENT (ADD, EDIT, PHOTO, DELETE)
# ==========================================

@api_view(['POST'])
def create_food(request):
    role = get_user_role(request)
    if role != 'admin':
        return Response({'detail': 'Admin permission required.'}, status=status.HTTP_403_FORBIDDEN)

    payload = request.data
    name = payload.get('name')
    price = payload.get('price')
    category_id = payload.get('category')
    description = payload.get('description', '')
    prep_time = payload.get('preparation_time', 10)
    image_url = payload.get('image_url', '')
    is_available = payload.get('is_available', True)

    if not name or not price:
        return Response({'detail': 'Food name and price are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        if isinstance(category_id, str) and not category_id.isdigit():
            category = Category.objects.filter(name=category_id).first()
        else:
            category = Category.objects.filter(id=category_id).first()

        if not category:
            category = Category.objects.first()
    except Exception:
        category = Category.objects.first()

    food = Food.objects.create(
        category=category,
        name=name,
        price=Decimal(str(price)),
        description=description,
        preparation_time=int(prep_time),
        image_url=image_url,
        is_available=bool(is_available),
    )

    if 'image' in request.FILES:
        food.image = request.FILES['image']
        food.save()

    return Response(FoodSerializer(food, context={'request': request}).data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def food_detail(request, food_id):
    try:
        food = Food.objects.select_related('category').get(id=food_id)
    except Food.DoesNotExist:
        return Response({'detail': 'Food item not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(FoodSerializer(food, context={'request': request}).data)

    role = get_user_role(request)
    if role != 'admin':
        return Response({'detail': 'Admin permission required.'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'DELETE':
        food.delete()
        return Response({'detail': 'Food item deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

    # PUT or PATCH
    payload = request.data
    if 'name' in payload:
        food.name = payload['name']
    if 'price' in payload:
        food.price = Decimal(str(payload['price']))
    if 'description' in payload:
        food.description = payload['description']
    if 'preparation_time' in payload:
        food.preparation_time = int(payload['preparation_time'])
    if 'image_url' in payload:
        food.image_url = payload['image_url']
    if 'is_available' in payload:
        food.is_available = str(payload['is_available']).lower() in ['true', '1']
    if 'category' in payload:
        cat_val = payload['category']
        if isinstance(cat_val, str) and not cat_val.isdigit():
            c = Category.objects.filter(name=cat_val).first()
        else:
            c = Category.objects.filter(id=cat_val).first()
        if c:
            food.category = c

    if 'image' in request.FILES:
        food.image = request.FILES['image']

    food.save()
    return Response(FoodSerializer(food, context={'request': request}).data)


# ==========================================
# ORDER PLACEMENT & TRACKING
# ==========================================

@api_view(['POST'])
def place_order(request):
    payload = request.data
    items = payload.get('items', [])
    pickup_time = payload.get('pickup_time')
    payment_method = payload.get('payment_method', 'upi')
    customer_name = payload.get('customer_name', 'Student')

    if not items:
        return Response(
            {'detail': 'Cart is empty.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not pickup_time:
        return Response(
            {'detail': 'Pickup time is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    valid_methods = dict(Order.PAYMENT_METHODS)
    if payment_method not in valid_methods:
        return Response(
            {'detail': 'Invalid payment method.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    total = Decimal('0.00')
    order_lines = []

    for item in items:
        try:
            food = Food.objects.get(id=item['food_id'], is_available=True)
            qty = int(item.get('quantity', 1))
            if qty < 1:
                raise ValueError
        except (Food.DoesNotExist, KeyError, ValueError, TypeError):
            return Response(
                {'detail': 'One or more cart items are invalid.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        line_total = food.price * qty
        total += line_total
        order_lines.append((food, qty))

    with transaction.atomic():
        order = Order.objects.create(
            customer_name=customer_name,
            total_amount=total,
            pickup_time=pickup_time,
            payment_method=payment_method,
            payment_status=False,
        )

        for food, qty in order_lines:
            OrderItem.objects.create(
                order=order,
                food=food,
                quantity=qty,
                price=food.price,
            )

        Payment.objects.create(
            order=order,
            amount=total,
            method=payment_method,
            status='pending',
            paid_at=None,
        )

    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def order_detail(request, order_id):
    try:
        order = Order.objects.prefetch_related('items__food').get(id=order_id)
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

    return Response(OrderSerializer(order).data)


@api_view(['GET'])
def all_orders(request):
    role = get_user_role(request)
    if role not in ['admin', 'kitchen'] and not request.user.is_staff:
        return Response({'detail': 'Admin or Kitchen access required.'}, status=status.HTTP_403_FORBIDDEN)

    orders = Order.objects.prefetch_related('items__food').order_by('-created_at')
    status_filter = request.GET.get('status')
    if status_filter and status_filter != 'all':
        orders = orders.filter(status=status_filter)

    return Response(OrderSerializer(orders, many=True).data)


@api_view(['PATCH'])
def update_order_status(request, order_id):
    role = get_user_role(request)
    if role not in ['admin', 'kitchen'] and not request.user.is_staff:
        return Response({'detail': 'Admin or Kitchen access required.'}, status=status.HTTP_403_FORBIDDEN)

    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status')
    valid_statuses = dict(Order.STATUS_CHOICES)

    if new_status not in valid_statuses:
        return Response({'detail': 'Invalid order status.'}, status=status.HTTP_400_BAD_REQUEST)

    order.status = new_status
    order.save(update_fields=['status'])
    return Response(OrderSerializer(order).data)
