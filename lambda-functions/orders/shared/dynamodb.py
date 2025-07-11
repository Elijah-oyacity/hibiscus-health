import boto3
import json
import os
from typing import Dict, Any, List, Optional
from botocore.exceptions import ClientError

class DynamoDBClient:
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb')
        self.client = boto3.client('dynamodb')
        self.environment = os.environ.get('ENVIRONMENT', 'dev')
        
    def get_table_name(self, base_name: str) -> str:
        return f"hibiscus-{base_name}-{self.environment}"
    
    def get_table(self, table_name: str):
        return self.dynamodb.Table(table_name)
    
    def create_item(self, table_name: str, item: Dict[str, Any]) -> Dict[str, Any]:
        try:
            table = self.get_table(table_name)
            response = table.put_item(Item=item)
            return {"success": True, "data": item}
        except ClientError as e:
            return {"success": False, "error": str(e)}
    
    def get_item(self, table_name: str, key: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        try:
            table = self.get_table(table_name)
            response = table.get_item(Key=key)
            return response.get('Item')
        except ClientError as e:
            print(f"Error getting item: {e}")
            return None
    
    def query_items(self, table_name: str, key_condition_expression: str, 
                   expression_attribute_values: Dict[str, Any]) -> List[Dict[str, Any]]:
        try:
            table = self.get_table(table_name)
            response = table.query(
                KeyConditionExpression=key_condition_expression,
                ExpressionAttributeValues=expression_attribute_values
            )
            return response.get('Items', [])
        except ClientError as e:
            print(f"Error querying items: {e}")
            return []
    
    def scan_items(self, table_name: str, filter_expression: str = None, 
                  expression_attribute_values: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        try:
            table = self.get_table(table_name)
            scan_kwargs = {}
            
            if filter_expression and expression_attribute_values:
                scan_kwargs['FilterExpression'] = filter_expression
                scan_kwargs['ExpressionAttributeValues'] = expression_attribute_values
            
            response = table.scan(**scan_kwargs)
            return response.get('Items', [])
        except ClientError as e:
            print(f"Error scanning items: {e}")
            return []

    def update_item(self, table_name: str, key: Dict[str, Any], 
                   update_expression: str, expression_attribute_values: Dict[str, Any]) -> Dict[str, Any]:
        try:
            table = self.get_table(table_name)
            response = table.update_item(
                Key=key,
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values,
                ReturnValues="ALL_NEW"
            )
            return {"success": True, "data": response.get('Attributes')}
        except ClientError as e:
            return {"success": False, "error": str(e)}

# Initialize the client
db_client = DynamoDBClient()

# Table names
TABLES = {
    'USERS': db_client.get_table_name('users'),
    'PRODUCTS': db_client.get_table_name('products'),
    'ORDERS': db_client.get_table_name('orders'),
    'ORDER_ITEMS': db_client.get_table_name('order-items'),
    'SUBSCRIPTION_PLANS': db_client.get_table_name('subscription-plans'),
    'USER_SUBSCRIPTIONS': db_client.get_table_name('user-subscriptions'),
} 