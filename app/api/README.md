# Hibiscus Health API Routes

This document outlines the expected backend functionality for the Hibiscus Health ecommerce platform. Use this as a guide when implementing the actual backend services.

## Authentication

### `/api/auth/[...nextauth]`
- Handles authentication using Auth.js v5
- Supports email/password and Google OAuth
- Manages user sessions and JWT tokens

### `/api/register`
- Creates new user accounts
- Validates user input
- Hashes passwords securely

## Products

### `/api/products`
- GET: Retrieves all products or a specific product by ID
- Expected response format:
\`\`\`json
{
  "id": "PROD001",
  "name": "Hibiscus Tablets (30 count)",
  "description": "One month supply of our premium hibiscus tablets for blood pressure support.",
  "price": 29.99,
  "images": ["/path/to/image.jpg"],
  "features": ["Feature 1", "Feature 2"],
  "stock": 150,
  "active": true
}
\`\`\`

## Subscriptions

### `/api/subscriptions`
- GET: Retrieves all subscription plans or a specific plan by ID
- Expected response format:
\`\`\`json
{
  "id": "PLAN001",
  "name": "Monthly",
  "description": "Perfect for trying out our products",
  "price": 29.99,
  "interval": "month",
  "stripePriceId": "price_monthly",
  "productId": "PROD001",
  "active": true
}
\`\`\`

### `/api/subscription`
- POST: Creates a new subscription for a user
- Integrates with Stripe for payment processing

## Orders

### `/api/checkout`
- POST: Creates a checkout session for one-time purchases
- Integrates with Stripe for payment processing

### `/api/user`
- GET: Retrieves user data including orders and subscriptions
- Expected response format:
\`\`\`json
{
  "subscription": {
    "id": "SUB001",
    "plan": "Monthly",
    "status": "active",
    "currentPeriodStart": "2024-05-01T00:00:00.000Z",
    "currentPeriodEnd": "2024-06-01T00:00:00.000Z",
    "nextBillingDate": "2024-06-01T00:00:00.000Z"
  },
  "orders": [
    {
      "id": "ORD001",
      "date": "2024-05-01T00:00:00.000Z",
      "status": "delivered",
      "total": 29.99,
      "items": [
        {
          "id": "PROD001",
          "name": "Hibiscus Tablets (30 count)",
          "quantity": 1,
          "price": 29.99
        }
      ]
    }
  ],
  "stats": {
    "totalSpent": 89.97,
    "totalOrders": 3,
    "memberSince": "2024-05-01T00:00:00.000Z"
  }
}
\`\`\`

## Admin

### `/api/admin/products`
- GET: Retrieves all products (admin only)
- POST: Creates a new product (admin only)
- PUT: Updates an existing product (admin only)
- DELETE: Deletes a product (admin only)

### `/api/admin/customers`
- GET: Retrieves all customers (admin only)
- Expected response format:
\`\`\`json
[
  {
    "id": "USR001",
    "name": "Sarah Johnson",
    "email": "sarah.j@example.com",
    "joinedAt": "2024-05-28T00:00:00.000Z",
    "plan": "Monthly",
    "totalSpent": 89.97,
    "orders": 3
  }
]
\`\`\`

### `/api/admin/orders`
- GET: Retrieves all orders (admin only)
- Expected response format:
\`\`\`json
[
  {
    "id": "ORD001",
    "customer": {
      "id": "USR001",
      "name": "Sarah Johnson",
      "email": "sarah.j@example.com"
    },
    "date": "2024-05-01T00:00:00.000Z",
    "status": "delivered",
    "total": 29.99,
    "items": [
      {
        "id": "PROD001",
        "name": "Hibiscus Tablets (30 count)",
        "quantity": 1,
        "price": 29.99
      }
    ]
  }
]
\`\`\`

### `/api/admin/analytics`
- GET: Retrieves analytics data (admin only)
- Expected response format:
\`\`\`json
{
  "revenue": {
    "total": 15231.89,
    "previousPeriod": 12680.45,
    "percentChange": 20.1
  },
  "subscriptions": {
    "total": 573,
    "previousPeriod": 372,
    "percentChange": 54.0,
    "breakdown": [
      { "name": "Monthly", "value": 573, "color": "#E11D8F" },
      { "name": "Quarterly", "value": 342, "color": "#9D174D" },
      { "name": "Annual", "value": 175, "color": "#500724" }
    ]
  },
  "orders": {
    "total": 1234,
    "previousPeriod": 1037,
    "percentChange": 19.0
  },
  "customers": {
    "total": 2350,
    "previousPeriod": 2170,
    "percentChange": 8.3,
    "new": 180
  },
  "revenueByMonth": [
    { "name": "Jan", "total": 1420.65 },
    { "name": "Feb", "total": 1530.85 },
    { "name": "Mar", "total": 1355.33 },
    { "name": "Apr", "total": 1921.55 },
    { "name": "May", "total": 2345.87 },
    { "name": "Jun", "total": 3201.89 }
  ],
  "topProducts": [
    { "id": "PROD001", "name": "Hibiscus Tablets (30 count)", "sales": 523, "revenue": 15684.77 },
    { "id": "PROD002", "name": "Hibiscus Tablets (90 count)", "sales": 312, "revenue": 24956.88 }
  ]
}
\`\`\`

## Webhooks

### `/api/webhooks/stripe`
- POST: Handles Stripe webhook events
- Processes subscription lifecycle events
- Updates order statuses

## Account

### `/api/account`
- PATCH: Updates user account information
- Expected request format:
\`\`\`json
{
  "name": "Updated Name",
  "image": "https://example.com/avatar.jpg"
}
\`\`\`

## Implementation Notes

1. All API routes should validate user authentication and authorization
2. Admin routes should check for admin role
3. Error handling should be consistent across all routes
4. Rate limiting should be implemented for security
5. Input validation should be performed using Zod schemas
6. Database operations should use Prisma client
7. Stripe integration should use the Stripe Node.js SDK
