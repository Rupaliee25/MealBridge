from flask import Blueprint, jsonify, request
from bson import ObjectId
from datetime import datetime, timedelta
import uuid
from flask_jwt_extended import jwt_required, get_jwt_identity

food_bp = Blueprint('food_bp', __name__)

def init_food_routes(db_instance):
    global db
    db = db_instance

def serialize_doc(doc):
    """Converts MongoDB BSON types (ObjectId, datetime) into JSON-serializable types."""
    if doc is None:
        return None
    
    # Convert ObjectId to string
    if '_id' in doc:
        doc['_id'] = str(doc['_id'])
    
    # Convert any datetime fields to ISO strings
    for key, value in doc.items():
        if isinstance(value, datetime):
            doc[key] = value.isoformat()
        elif isinstance(value, ObjectId):
            doc[key] = str(value)
            
    return doc

@food_bp.route('/food-items', methods=['GET'])
def get_food_items():
    try:
        # Fetch all food items regardless of status
        cursor = db.food_items.find({})
        food_list = [serialize_doc(item) for item in cursor]
        
        return jsonify({
            'success': True,
            'count': len(food_list),
            'data': food_list
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@food_bp.route('/food-items/<item_id>', methods=['GET'])
def get_single_food_item(item_id):
    try:
        # 1. Search by custom string item_id (e.g., "item_010")
        item = db.food_items.find_one({'item_id': item_id})

        # 2. Fallback: Search by MongoDB ObjectId if item_id is 24-char hex
        if not item and ObjectId.is_valid(item_id):
            item = db.food_items.find_one({'_id': ObjectId(item_id)})

        if not item:
            return jsonify({'success': False, 'message': 'Food item not found'}), 404

        return jsonify({
            'success': True,
            'data': serialize_doc(item)
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@food_bp.route('/orders', methods=['POST'])
@jwt_required()
def create_order():
    try:
        data = request.get_json()
        item_id = data.get('item_id')
        buyer_id = get_jwt_identity()  # comes from the JWT token, not the request body

        item = db.food_items.find_one({'item_id': item_id})
        
        # Fallback to search by ObjectId if custom item_id wasn't matched
        if not item and ObjectId.is_valid(item_id):
            item = db.food_items.find_one({'_id': ObjectId(item_id)})

        if not item:
            return jsonify({'success': False, 'message': 'Item not found'}), 404

        if item['status'] not in ['listed', 'pivoted_to_ngo']:
            return jsonify({'success': False, 'message': 'Item is no longer available'}), 400

        order_type = 'free_ngo_rescue' if item['status'] == 'pivoted_to_ngo' else 'paid_purchase'
        amount_paid = 0 if order_type == 'free_ngo_rescue' else item['current_price']

        qr_code = f"QR_MB_2026_{uuid.uuid4().hex[:6]}"

        order_doc = {
            'order_id': str(uuid.uuid4()),
            'item_id': item.get('item_id', str(item['_id'])),
            'buyer_id': buyer_id,
            'order_type': order_type,
            'amount_paid': amount_paid,
            'pickup_qr_code': qr_code,
            'claim_status': 'reserved'
        }

        db.orders.insert_one(order_doc)

        # Mark the item as reserved so it stops showing as available
        db.food_items.update_one({'_id': item['_id']}, {'$set': {'status': 'reserved'}})

        return jsonify({'success': True, 'data': serialize_doc(order_doc)}), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@food_bp.route('/orders/my', methods=['GET'])
@jwt_required()
def get_my_orders():
    try:
        user_id = get_jwt_identity()
        cursor = db.orders.find({'buyer_id': user_id})

        orders = []
        for order in cursor:
            order = serialize_doc(order)
            item = db.food_items.find_one({'item_id': order['item_id']})
            if not item and ObjectId.is_valid(order['item_id']):
                item = db.food_items.find_one({'_id': ObjectId(order['item_id'])})
                
            order['item_title'] = item['title'] if item else 'Unknown Item'
            orders.append(order)

        return jsonify({'success': True, 'data': orders}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@food_bp.route('/food-items/mine', methods=['GET'])
@jwt_required()
def get_my_listings():
    try:
        vendor_id = get_jwt_identity()
        cursor = db.food_items.find({'vendor_id': vendor_id})
        return jsonify({'success': True, 'data': [serialize_doc(i) for i in cursor]}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@food_bp.route('/receiver-profile/me', methods=['GET'])
@jwt_required()
def get_my_receiver_profile():
    try:
        user_id = get_jwt_identity()
        profile = db.receiver_profiles.find_one({'receiver_id': user_id})
        if not profile:
            return jsonify({'success': False, 'message': 'Profile not found'}), 404
        return jsonify({'success': True, 'data': serialize_doc(profile)}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@food_bp.route('/food-items', methods=['POST'])
@jwt_required()
def create_food_item():
    try:
        data = request.get_json()
        vendor_id = get_jwt_identity()
        prep_time = int(data.get('prep_time', 60))  # minutes

        item_doc = {
            'item_id': str(uuid.uuid4()),
            'vendor_id': vendor_id,
            'title': data['title'],
            'prep_time': prep_time,
            'original_price': float(data['original_price']),
            'current_price': float(data['original_price']),
            'status': 'listed',
            'expiry_timer': datetime.utcnow() + timedelta(hours=4),  # 4-hour safety window
            'category_tags': data.get('category_tags', [])
        }
        db.food_items.insert_one(item_doc)
        return jsonify({'success': True, 'data': serialize_doc(item_doc)}), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    