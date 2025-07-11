import json
import os
import sys
sys.path.append('/opt/python/lib/python3.9/site-packages')
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from shared.dynamodb import db_client, TABLES

def lambda_handler(event, context):
    try:
        # Parse query parameters
        query_params = event.get('queryStringParameters', {}) or {}
        order_id = query_params.get('id')
        user_id = query_params.get('userId')
        
        if order_id:
            # Get specific order by ID
            order = db_client.get_item(TABLES['ORDERS'], {'id': order_id})
            if not order:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
                    },
                    'body': json.dumps({'error': 'Order not found'})
                }
            
            # Get order items
            order_items = db_client.query_items(
                TABLES['ORDER_ITEMS'],
                'orderId = :orderId',
                {':orderId': order_id}
            )
            
            order['items'] = order_items
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
                },
                'body': json.dumps(order)
            }
        
        if user_id:
            # Get orders for specific user
            orders = db_client.query_items(
                TABLES['ORDERS'],
                'userId = :userId',
                {':userId': user_id}
            )
            
            # Get items for each order
            for order in orders:
                order_items = db_client.query_items(
                    TABLES['ORDER_ITEMS'],
                    'orderId = :orderId',
                    {':orderId': order['id']}
                )
                order['items'] = order_items
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
                },
                'body': json.dumps(orders)
            }
        
        # Get all orders (admin only)
        orders = db_client.scan_items(TABLES['ORDERS'])
        
        # Get items for each order
        for order in orders:
            order_items = db_client.query_items(
                TABLES['ORDER_ITEMS'],
                'orderId = :orderId',
                {':orderId': order['id']}
            )
            order['items'] = order_items
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
            },
            'body': json.dumps(orders)
        }
        
    except Exception as e:
        print(f"Error in get_orders: {str(e)}")
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