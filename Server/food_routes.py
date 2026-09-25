from flask import Blueprint, jsonify
from bson import ObjectId
from datetime import datetime

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