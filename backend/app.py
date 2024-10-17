import os
from flask import Flask, jsonify, request
from pymongo import MongoClient
from flask_cors import CORS
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# MongoDB connection (update with your connection string)
mongodb_uri = os.getenv("MONGODB_URI")
client = MongoClient(mongodb_uri)
db = client['cosmetics']  # Use test database
collection = db['cosmetics']  # Use cosmetics collection

@app.route('/api/cosmetics/types', methods=['GET'])
def get_cosmetic_types():
    # Get distinct values for the 'Label' field, which represents the type of cosmetic
    types = collection.distinct('Label')
    return jsonify(types)

@app.route('/api/cosmetics/brands', methods=['GET'])
def get_cosmetic_brands():
    # Get distinct values for the 'Label' field, which represents the brand of cosmetic
    brands = collection.distinct('Brand')
    return jsonify(brands)

# API endpoint to fetch all cosmetics data
@app.route('/api/cosmetics', methods=['GET'])
def get_cosmetics():

    def get_price_filter(pricestr):
        if pricestr[0] == 'price:pl=min_ph=25':
            return {'Price': {'$lte': 25}}
        elif pricestr[0] == 'price:pl=25_ph=50':
            return {'Price': {'$gte': 25, '$lte': 50}}
        elif pricestr[0] == 'price:pl=50_ph=100':
            return {'Price': {'$gte': 50, '$lte': 100}}
        elif pricestr[0] == 'price:pl=100_ph=max':
            return {'Price': {'$gte': 100}}
        else:
            return {}

    sort_option = request.args.get('sort', 'Affordance')  # Default sorting is 'affordance'
    label_types = request.args.getlist('type')
    skin_types = request.args.getlist('skintype')
    price_type = request.args.getlist('price')
    brand_types = request.args.getlist('brand')


    # Query the database
    query = {}
    if label_types:
        query['Label'] = {'$in': label_types}
    
    if brand_types:
        brand_types=[brand.replace('brand-', '') for brand in brand_types]
        query['Brand'] = {'$in': brand_types}
    
    if skin_types:
        # Create an array of conditions for the skin types
        skin_conditions = [{skin_type: 1} for skin_type in skin_types]
        
        query['$or'] = skin_conditions

    if price_type:
        query.update(get_price_filter(price_type))

    cosmetics = list(collection.find(query, {'_id': 1, 'Label': 1, 'Brand': 1, 'Name': 1, 'Price': 1, 'Affordance':1}))
    cosmetics = [
        {
            'id': str(cosmetic['_id']),  # Convert ObjectId to string
            'Label': cosmetic['Label'],
            'Brand': cosmetic['Brand'],
            'Name': cosmetic['Name'],
            'Price': int(cosmetic['Price']),
            'Affordance': float(cosmetic['Affordance']),
        }
        for cosmetic in cosmetics
    ]
    if sort_option == 'price_low_to_high':
        cosmetics = sorted(cosmetics, key=lambda x: x['Price'])
    elif sort_option == 'price_high_to_low':
        cosmetics = sorted(cosmetics, key=lambda x: x['Price'], reverse=True)
    else:
        cosmetics = sorted(cosmetics, key=lambda x: x['Affordance'], reverse=True)
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
