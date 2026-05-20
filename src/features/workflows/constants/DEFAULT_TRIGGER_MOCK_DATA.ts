import { WorkflowNodeType } from "../types/Workflow.types";

export const DEFAULT_TRIGGER_MOCK_DATA: Partial<Record<WorkflowNodeType, Record<string, unknown>>> = {
  "webhook-shopify": {
    "topic": "orders/create",
    "body": {
      "id": 123456,
      "email": "customer@example.com",
      "total_price": "89.99",
      "currency": "USD",
      "line_items": [
        {
          "id": 987654,
          "title": "Premium Coding T-Shirt",
          "price": "29.99",
          "quantity": 3
        }
      ],
      "shipping_address": {
        "first_name": "John",
        "last_name": "Doe",
        "city": "New York",
        "country": "United States"
      }
    },
    "headers": {
      "x-shopify-topic": "orders/create",
      "x-shopify-shop-domain": "my-store.myshopify.com"
    }
  },
  "webhook-lightfunnels": {
    "body": {
      "id": "lf_98765",
      "email": "buyer@example.com",
      "total": 45.50,
      "currency": "EUR",
      "items": [
        {
          "title": "Product A",
          "price": 45.50,
          "quantity": 1
        }
      ]
    },
    "headers": {}
  },
  "webhook-youcan": {
    "body": {
      "id": "yc_112233",
      "email": "customer@youcan.shop",
      "total": 120.00,
      "currency": "MAD",
      "customer": {
        "first_name": "Amine",
        "last_name": "Barry"
      }
    },
    "headers": {}
  },
  "webhook-custom": {
    "body": {
      "message": "Hello from custom webhook",
      "userId": "usr_998877",
      "score": 42
    },
    "headers": {
      "Content-Type": "application/json"
    },
    "query": {
      "source": "test-editor"
    }
  }
};
