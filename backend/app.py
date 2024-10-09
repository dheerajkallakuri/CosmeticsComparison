import os
from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
from bson import ObjectId

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# MongoDB connection (update with your connection string)
mongodb_uri = os.environ.get('MONGODB_URI')
client = MongoClient(mongodb_uri)
db = client['cosmetics']  # Use test database
collection = db['cosmetics']  # Use cosmetics collection

# API endpoint to fetch all cosmetics data
@app.route('/api/cosmetics', methods=['GET'])
def get_cosmetics():
    cosmetics = list(collection.find({}, {'_id': 1, 'Label': 1, 'Brand': 1, 'Name': 1, 'Price': 1}))
    cosmetics = [
        {
            'id': str(cosmetic['_id']),  # Convert ObjectId to string
            'Label': cosmetic['Label'],
            'Brand': cosmetic['Brand'],
            'Name': cosmetic['Name'],
            'Price': cosmetic['Price']
        }
        for cosmetic in cosmetics
    ]
    # print(cosmetics)
    return jsonify(cosmetics)

# API endpoint to fetch ingredients of a specific cosmetic item
@app.route('/api/cosmetics/ingredients', methods=['GET'])
def get_ingredients():
    id_value = request.args.get('id')
    # print(id_value)
    object_id = ObjectId(id_value)
    
    if not object_id:
        return jsonify({'error': 'Name parameter is required'}), 400
    
    cosmetic_ingredients = collection.find_one({'_id': object_id}, {'_id': 0,'Name': 1, 'Ingredients': 1})
    if not cosmetic_ingredients:
        return jsonify({'error': 'Cosmetic not found'}), 404
    # print(cosmetic_ingredients)
    return jsonify(cosmetic_ingredients)

if __name__ == '__main__':
    app.run()
