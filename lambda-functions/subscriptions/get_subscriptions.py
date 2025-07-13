import json
import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(BASE_DIR, 'shared'))

from dynamodb import db_client, TABLES

HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
}


def lambda_handler(event, context):
    try:
        query_params = event.get('queryStringParameters', {}) or {}
        plan_id = query_params.get('id')

        if plan_id:
            plan = db_client.get_item(TABLES['SUBSCRIPTION_PLANS'], {'id': plan_id})
            if not plan:
                return {'statusCode': 404, 'headers': HEADERS, 'body': json.dumps({'error': 'Subscription plan not found'})}
            return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps(plan)}

        plans = db_client.scan_items(TABLES['SUBSCRIPTION_PLANS'])
        return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps(plans)}
    except Exception as e:
        print(f"Error in get_subscriptions: {e}")
        return {'statusCode': 500, 'headers': HEADERS, 'body': json.dumps({'error': 'Internal server error'})}
