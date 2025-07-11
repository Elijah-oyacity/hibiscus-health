import json
import os
import sys
import uuid
from datetime import datetime
sys.path.append('/opt/python/lib/python3.9/site-packages')
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from shared.dynamodb import db_client, TABLES

def lambda_handler(event, context):
    try:
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        
        # Validate required fields
        required_fields = ['name', 'slug', 'description', 'price', 'stockQuantity']
        for field in required_fields:
            if field not in body:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
                    },
                    'body': json.dumps({'error': f'Missing required field: {field}'})
                }
        
        # Check if slug already exists
        existing_products = db_client.query_items(
            TABLES['PRODUCTS'],
            'slug = :slug',
            {':slug': body['slug']}
        )
        
        if existing_products:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
                },
                'body': json.dumps({'error': 'Product with this slug already exists'})
            }
        
        # Create product
        product = {
            'id': f"prod_{uuid.uuid4().hex}",
            'name': body['name'],
            'slug': body['slug'],
            'description': body['description'],
            'longDescription': body.get('longDescription'),
            'benefits': body.get('benefits'),
            'ingredients': body.get('ingredients'),
            'dosage': body.get('dosage'),
            'price': int(body['price']),  # Store in cents
            'stockQuantity': int(body['stockQuantity']),
            'imageUrl': body.get('imageUrl'),
            'imageAdobeId': body.get('imageAdobeId'),
            'images': body.get('images'),
            'stripePriceId': body.get('stripePriceId'),
            'stripeProductId': body.get('stripeProductId'),
            'isFeatured': body.get('isFeatured', False),
            'createdAt': datetime.utcnow().isoformat(),
            'updatedAt': datetime.utcnow().isoformat()
        }
        
        result = db_client.create_item(TABLES['PRODUCTS'], product)
        
        if result['success']:
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
                },
                'body': json.dumps(product)
            }
        else:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
                },
                'body': json.dumps({'error': 'Failed to create product'})
            }
            
    except Exception as e:
        print(f"Error in create_product: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
            },
            'body': json.dumps({'error': 'Internal server error'})
        } 