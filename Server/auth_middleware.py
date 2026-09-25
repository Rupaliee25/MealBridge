from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt

def role_required(allowed_roles):
    """
    Custom decorator to check if the authenticated user's role 
    is included in allowed_roles list.
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            # Verify JWT presence and validity
            verify_jwt_in_request()
            
            # Extract claims (payload) from JWT token
            claims = get_jwt()
            user_role = claims.get('role')

            if user_role not in allowed_roles:
                return jsonify({
                    'message': f'Access forbidden: requires one of the following roles: {allowed_roles}'
                }), 403

            return fn(*args, **kwargs)
        return wrapper
    return decorator