from functools import wraps
from rest_framework.exceptions import PermissionDenied
from authapp.views import get_user_from_token

def check_authorization(func):
    '''This decorator checks if the user is authorized to perform the action'''
    @wraps(func)
    def wrapped(view, request, *args, **kwargs):
        if 'Authorization' not in request.headers:
            raise PermissionDenied('No token provided')
        
        access_token = request.headers['Authorization'][7:]
        user = get_user_from_token(access_token)  # Assuming this is a helper function to get user from token
        
        if not user:
            raise PermissionDenied('Invalid token')

        # Attach the user to the request object so that views can access it 
        request.user = user
        return func(view, request, *args, **kwargs)

    return wrapped


