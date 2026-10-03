from django.core.management.base import BaseCommand
from api.models import Category, Food

class Command(BaseCommand):
    help = 'Create CampusBite demo categories and food items.'

    def handle(self, *args, **options):
        demo = {
            'breakfast': [
                ('Idli', 'Soft steamed rice cakes', 30),
                ('Pongal', 'Traditional South Indian pongal', 50),
                ('Masala Dosa', 'Crispy dosa with potato masala', 60),
                ('Poori', 'Puffed poori with side dish', 50),
            ],
            'lunch': [
                ('Veg Meals', 'College-style vegetarian meals', 90),
                ('Sambar Rice', 'Traditional sambar rice', 60),
                ('Lemon Rice', 'Tangy lemon rice', 50),
                ('Curd Rice', 'Cooling curd rice', 50),
            ],
            'snacks': [
                ('Samosa', 'Crispy vegetable samosa', 20),
                ('Masala Vadai', 'Crispy masala lentil vadai', 15),
                ('Bajji', 'Hot South Indian bajji', 20),
            ],
            'juice': [
                ('Orange Juice', 'Fresh orange juice', 40),
                ('Watermelon Juice', 'Fresh watermelon juice', 40),
                ('Lime Juice', 'Refreshing lime juice', 25),
            ],
            'chat': [
                ('Pani Puri', 'Crispy pani puri', 40),
                ('Bhel Puri', 'Tangy bhel puri', 50),
                ('Masala Puri', 'Spicy masala puri', 50),
            ],
            'icecream': [
                ('Vanilla Ice Cream', 'Classic vanilla flavour', 40),
                ('Chocolate Ice Cream', 'Rich chocolate flavour', 50),
                ('Butterscotch Ice Cream', 'Crunchy butterscotch flavour', 60),
            ],
        }

        for key, items in demo.items():
            category, _ = Category.objects.get_or_create(name=key)
            for name, desc, price in items:
                Food.objects.get_or_create(
                    category=category,
                    name=name,
                    defaults={
                        'description': desc,
                        'price': price,
                        'preparation_time': 10,
                        'is_available': True,
                    }
                )

        from django.contrib.auth.models import User
        from api.models import UserProfile

        # Admin
        admin_user, _ = User.objects.get_or_create(
            username='admin',
            defaults={
                'first_name': 'Campus',
                'last_name': 'Admin',
                'email': 'admin@psgcas.ac.in',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin_user.set_password('admin123')
        admin_user.save()
        p1, _ = UserProfile.objects.get_or_create(user=admin_user)
        p1.role = 'admin'
        p1.save()

        # Kitchen
        kitchen_user, _ = User.objects.get_or_create(
            username='kitchen',
            defaults={
                'first_name': 'Head',
                'last_name': 'Chef',
                'email': 'kitchen@psgcas.ac.in',
                'is_staff': True,
            }
        )
        kitchen_user.set_password('kitchen123')
        kitchen_user.save()
        p2, _ = UserProfile.objects.get_or_create(user=kitchen_user)
        p2.role = 'kitchen'
        p2.save()

        # Student
        student_user, _ = User.objects.get_or_create(
            username='student',
            defaults={
                'first_name': 'Akash',
                'last_name': 'R',
                'email': 'student@psgcas.ac.in',
            }
        )
        student_user.set_password('student123')
        student_user.save()
        p3, _ = UserProfile.objects.get_or_create(user=student_user)
        p3.role = 'student'
        p3.roll_number = '23BCS042'
        p3.save()

        # Teacher
        teacher_user, _ = User.objects.get_or_create(
            username='teacher',
            defaults={
                'first_name': 'Dr. Priya',
                'last_name': 'V',
                'email': 'priya.cs@psgcas.ac.in',
            }
        )
        teacher_user.set_password('teacher123')
        teacher_user.save()
        p4, _ = UserProfile.objects.get_or_create(user=teacher_user)
        p4.role = 'teacher'
        p4.roll_number = 'FAC-8842'
        p4.save()

        self.stdout.write(self.style.SUCCESS('CampusBite demo data & user accounts (admin, kitchen, student, teacher) created.'))
