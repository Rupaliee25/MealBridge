from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth_bp', __name__)
bcrypt = Bcrypt()

def init_auth(db_instance):
    global db
    db = db_instance

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'donor')  # Default role if not provided
    name = data.get('name', '')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    # Check if user already exists
    if db.users.find_one({'email': email}):
        return jsonify({'message': 'User already exists'}), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Insert new user document into 'users' collection
    user_data = {
        'name': name,
        'email': email,
        'password': hashed_password,
        'role': role
    }
    result = db.users.insert_one(user_data)
    user_id = str(result.inserted_id)

    # Generate JWT access token with role custom claim
    access_token = create_access_token(
        identity=user_id,
        additional_claims={'role': role}
    )

    return jsonify({
        'message': 'User registered successfully',
        'access_token': access_token,
        'user': {
            'id': user_id,
            'name': name,
            'email': email,
            'role': role
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    user = db.users.find_one({'email': email})

    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid email or password'}), 401

    user_id = str(user['_id'])
    role = user.get('role', 'donor')

    # Generate JWT access token with role custom claim
    access_token = create_access_token(
        identity=user_id,
        additional_claims={'role': role}
    )

    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': {
            'id': user_id,
            'name': user.get('name', ''),
            'email': user['email'],
            'role': role
        }
    }), 200