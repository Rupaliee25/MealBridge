from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from config import Config
from auth_routes import auth_bp, init_auth, bcrypt
from food_routes import food_bp, init_food_routes
from auth_middleware import role_required

app = Flask(__name__)
app.config.from_object(Config)

# Initialize Extensions
CORS(app)
jwt = JWTManager(app)
bcrypt.init_app(app)

# Initialize MongoClient using the URI from Config
client = MongoClient(app.config['MONGO_URI'])
db = client['MealBridge_DB']

# Pass database instance to route modules
init_auth(db)
init_food_routes(db)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(food_bp, url_prefix='/api')

# Sample protected route to test Role-Based Access Control
@app.route('/api/protected-test', methods=['GET'])
@role_required(['admin', 'vendor'])
def protected_test():
    return jsonify({'message': 'Access granted: You have a valid token with an authorized role!'})

@app.route('/')
def health_check():
    return jsonify({'status': 'MealBridge API running'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)