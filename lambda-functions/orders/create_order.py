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
        if 'items' not in body or not body['items']:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
                },
                'body': json.dumps({'error': 'Order must contain at least one item'})
            }
        
        # Calculate total amount
        total_amount = 0
        order_items = []
        
        for item in body['items']:
            # Get product details
            product = db_client.get_item(TABLES['PRODUCTS'], {'id': item['productId']})
            if not product:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
                    },
                    'body': json.dumps({'error': f'Product not found: {item["productId"]}'})
                }
            
            if product['stockQuantity'] < item['quantity']:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
                    },
                    'body': json.dumps({'error': f'Insufficient stock for product: {product["name"]}'})
                }
            
            item_price = product['price'] * item['quantity']
            total_amount += item_price
            
            order_items.append({
                'id': f"item_{uuid.uuid4().hex}",
                'orderId': f"order_{uuid.uuid4().hex}",
                'productId': item['productId'],
                'quantity': item['quantity'],
                'price': product['price'],
                'productName': product['name']
            })
        
        # Create order
        order = {
            'id': order_items[0]['orderId'],
            'userId': body.get('userId', 'anonymous'),
            'totalAmount': total_amount,
            'status': 'PENDING',
            'stripePaymentIntentId': body.get('stripePaymentIntentId'),
            'shippingAddress': body.get('shippingAddress'),
            'billingAddress': body.get('billingAddress'),
            'createdAt': datetime.utcnow().isoformat(),
            'updatedAt': datetime.utcnow().isoformat()
        }
        
        # Create order in database
        order_result = db_client.create_item(TABLES['ORDERS'], order)
        if not order_result['success']:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
                },
                'body': json.dumps({'error': 'Failed to create order'})
            }
        
        # Create order items
        for item in order_items:
            item_result = db_client.create_item(TABLES['ORDER_ITEMS'], item)
            if not item_result['success']:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
                    },
                    'body': json.dumps({'error': 'Failed to create order items'})
                }
        
        # Update product stock
        for item in body['items']:
            product = db_client.get_item(TABLES['PRODUCTS'], {'id': item['productId']})
            new_stock = product['stockQuantity'] - item['quantity']
            
            update_result = db_client.update_item(
                TABLES['PRODUCTS'],
                {'id': item['productId']},
                'SET stockQuantity = :stock',
                {':stock': new_stock}
            )
            
            if not update_result['success']:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
                    },
                    'body': json.dumps({'error': 'Failed to update product stock'})
                }
        
        # Return order with items
        order['items'] = order_items
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
            },
            'body': json.dumps(order)
        }
        
    except Exception as e:
        print(f"Error in create_order: {str(e)}")
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