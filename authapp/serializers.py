
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.timezone import now
from django.contrib.auth.models import Group, User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role = validated_data.pop('role', None)
        password = validated_data.pop('password', None)
        # Create the user instance
        instance = self.Meta.model(**validated_data)
        if password:
            instance.set_password(password)
        instance.save()
        if role:
            group, _ = Group.objects.get_or_create(name=role)
            instance.groups.add(group)
        return instance



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    '''This custom serializer for return user data when obtain tokens (refresh and access)'''
    def validate(self, attrs):
        # Get the validated data (tokens)
        data = super().validate(attrs)
        # Update last_login for the user
        self.user.last_login = now()
        self.user.save(update_fields=['last_login'])
        
        # Add user info to the response
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'role' : self.user.groups.first().name
            # Add more fields if needed
        }
        return data
