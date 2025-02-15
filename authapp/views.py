from rest_framework_simplejwt.views import TokenObtainPairView
from authapp.serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import status
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken , AccessToken
from django.contrib.auth.models import User

def get_user_from_token(token):
    """Helper method to extract and validate user from token."""
    try:
        # Decode the token
        access_token = AccessToken(token)
        user_id = access_token['user_id']
        
        # Fetch the user object
        user = User.objects.get(id=user_id)
        return user
    except Exception as e:
        print(f"Error: {e}")
        return None
    

class CustomTokenObtainPairView(TokenObtainPairView):    
    serializer_class = CustomTokenObtainPairSerializer

class LogoutView(APIView):          
   def post(self, request):
    try:               
        refresh_token = request.data["refresh"] 
        token = RefreshToken(refresh_token)               
        token.blacklist()              
        return Response(status=status.HTTP_205_RESET_CONTENT)          
    except Exception as e:               
        return Response({"error": e},status=status.HTTP_400_BAD_REQUEST)
    


class SignupView(APIView):
    def post(self, request):
        print(request.data)
        try:
            if User.objects.filter(username=request.data.get('username')).exists():
                return Response({"error": "A user with that username already exists"}, status=status.HTTP_400_BAD_REQUEST)

            # Include role in the data for validation
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                password = request.data.get("password")
                if not password:
                    return Response({"error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST)

                # Obtain token for the user
                token_serializer = TokenObtainPairSerializer(data={
                    "username": user.username,
                    "password": password
                })
                if token_serializer.is_valid():
                    # Here, you can return the role field as part of the response
                    user_data = serializer.data
                    user_data['role'] = request.data.get('role')
                    return Response({
                        "user": user_data,  # This will include the role field
                        "tokens": token_serializer.validated_data,
                    }, status=status.HTTP_201_CREATED)

                return Response({"error": "Token generation failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": f"An error occurred during signup: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class SignupView(APIView):
#     def post(self, request):
#         try:
#             # Check if the username already exists
#             username = request.data.get('username')
#             if not username:
#                 return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

#             if User.objects.filter(username=username).exists():
#                 return Response({"error": "A user with that username already exists"}, status=status.HTTP_400_BAD_REQUEST)

#             # Serialize the user data
#             serializer = UserSerializer(data=request.data)
#             if serializer.is_valid():
#                 # Save the new user
#                 user = serializer.save()

#                 # Generate token for the new user
#                 token_serializer = TokenObtainPairSerializer(data={
#                     "username": user.username,
#                     "password": request.data.get("password")  # Ensure password is in the request
#                 })

#                 if token_serializer.is_valid():
#                     tokens = token_serializer.validated_data
#                     return Response({
#                         "user": serializer.data,
#                         "tokens": tokens
#                     }, status=status.HTTP_201_CREATED)

#                 # If token generation fails
#                 return Response(
#                     {"error": "Failed to generate token", "details": token_serializer.errors},
#                     status=status.HTTP_500_INTERNAL_SERVER_ERROR
#                 )

#             # Handle validation errors for user creation
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#         except Exception as e:
#             # General error handling
#             return Response(
#                 {"error": "An error occurred during signup.", "details": str(e)},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )
