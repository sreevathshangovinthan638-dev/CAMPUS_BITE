from rest_framework import serializers
from .models import Category, Food, Order, OrderItem


class CategorySerializer(serializers.ModelSerializer):
    label = serializers.CharField(source='get_name_display', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'label']


class FoodSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.get_name_display', read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Food
        fields = [
            'id',
            'category',
            'category_name',
            'name',
            'description',
            'price',
            'image',
            'image_url',
            'preparation_time',
            'is_available',
        ]

    def get_image(self, obj):
        if obj.image_url:
            return obj.image_url
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class OrderItemSerializer(serializers.ModelSerializer):
    food_name = serializers.CharField(source='food.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'food', 'food_name', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
