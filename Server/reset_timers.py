import os
import random
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()
mongo_uri = os.getenv('MONGO_URI')

if not mongo_uri:
    print("Error: MONGO_URI not found in .env file.")
    exit(1)

client = MongoClient(mongo_uri)
db = client['MealBridge_DB']

now = datetime.now(timezone.utc)
updated_count = 0

for item in db.food_items.find():
    random_minutes = random.randint(30, 240)
    new_expiry = now + timedelta(minutes=random_minutes)
    
    # Format with explicit Z suffix for UTC
    expiry_str = new_expiry.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
    
    db.food_items.update_one(
        {'_id': item['_id']},
        {'$set': {
            'expiry_timer': expiry_str,
            'status': 'listed'
        }}
    )
    updated_count += 1

print(f"Successfully updated {updated_count} food item expiry timers with UTC strings!")