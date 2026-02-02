# 📚 API Documentation - Expense Tracker Pro

## Base URL

```
http://localhost:8080/api
```

## Authentication

All requests (except registration) require the user to be logged in. The frontend stores user ID in localStorage after successful login.

---

## 👤 User Endpoints

### Register User

Create a new user account.

**Request:**

```
POST /users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-02-02T10:30:00",
  "updatedAt": "2024-02-02T10:30:00"
}
```

**Errors:**

- `409 Conflict`: Email already exists

---

### Login User

Authenticate and get user information.

**Request:**

```
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Errors:**

- `401 Unauthorized`: Invalid credentials

---

### Get User Profile

Retrieve user information.

**Request:**

```
GET /users/{userId}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-02-02T10:30:00",
  "updatedAt": "2024-02-02T10:30:00"
}
```

---

### Update User Profile

Update user information.

**Request:**

```
PUT /users/{userId}
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response (200 OK):**

```json
{
  "id": 1,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "updatedAt": "2024-02-02T11:00:00"
}
```

---

### Delete User Account

Delete a user and all associated data.

**Request:**

```
DELETE /users/{userId}
```

**Response (204 No Content)**

---

## 💰 Expense Endpoints

### Add Expense

Create a new expense record.

**Request:**

```
POST /expenses/{userId}
Content-Type: application/json

{
  "description": "Coffee at Starbucks",
  "amount": 5.50,
  "category": "food",
  "date": "2024-02-02"
}
```

**Response (201 Created):**

```json
{
  "id": 101,
  "description": "Coffee at Starbucks",
  "amount": 5.5,
  "category": "food",
  "date": "2024-02-02",
  "createdAt": "2024-02-02T10:35:00",
  "updatedAt": "2024-02-02T10:35:00"
}
```

---

### Get All Expenses

Retrieve all expenses for a user.

**Request:**

```
GET /expenses/{userId}
```

**Response (200 OK):**

```json
[
  {
    "id": 101,
    "description": "Coffee",
    "amount": 5.5,
    "category": "food",
    "date": "2024-02-02",
    "createdAt": "2024-02-02T10:35:00"
  },
  {
    "id": 102,
    "description": "Gas",
    "amount": 40.0,
    "category": "transport",
    "date": "2024-02-02",
    "createdAt": "2024-02-02T11:00:00"
  }
]
```

---

### Get Expenses by Category

Filter expenses by specific category.

**Request:**

```
GET /expenses/{userId}/by-category/{category}
```

**Example:**

```
GET /expenses/1/by-category/food
```

**Response (200 OK):**

```json
[
  {
    "id": 101,
    "description": "Coffee",
    "amount": 5.5,
    "category": "food",
    "date": "2024-02-02"
  }
]
```

---

### Get Expenses by Date Range

Retrieve expenses within a date range.

**Request:**

```
GET /expenses/{userId}/date-range?startDate=2024-02-01&endDate=2024-02-28
```

**Response (200 OK):**

```json
[
  {
    "id": 101,
    "description": "Coffee",
    "amount": 5.5,
    "category": "food",
    "date": "2024-02-02"
  }
]
```

---

### Get Total Spending

Retrieve spending statistics.

**Request:**

```
GET /expenses/{userId}/total
```

**Response (200 OK):**

```json
{
  "total": 45.5,
  "count": 2,
  "average": 22.75
}
```

---

### Get Category Statistics

Get spending breakdown by category.

**Request:**

```
GET /expenses/{userId}/category-stats
```

**Response (200 OK):**

```json
{
  "food": {
    "total": 5.5,
    "count": 1
  },
  "transport": {
    "total": 40.0,
    "count": 1
  }
}
```

---

### Update Expense

Modify an expense record.

**Request:**

```
PUT /expenses/{userId}/{expenseId}
Content-Type: application/json

{
  "description": "Coffee at Costa",
  "amount": 6.00,
  "category": "food",
  "date": "2024-02-02"
}
```

**Response (200 OK):**

```json
{
  "id": 101,
  "description": "Coffee at Costa",
  "amount": 6.0,
  "category": "food",
  "date": "2024-02-02",
  "updatedAt": "2024-02-02T11:45:00"
}
```

---

### Delete Expense

Remove an expense record.

**Request:**

```
DELETE /expenses/{userId}/{expenseId}
```

**Response (204 No Content)**

---

### Delete All Expenses

Remove all expenses for a user.

**Request:**

```
DELETE /expenses/{userId}
```

**Response (204 No Content)**

---

## 💳 Budget Endpoints

### Set Budget

Create or update a budget for a category.

**Request:**

```
POST /budgets/{userId}
Content-Type: application/json

{
  "category": "food",
  "amount": 300.00
}
```

**Response (201 Created):**

```json
{
  "id": 201,
  "category": "food",
  "amount": 300.0,
  "createdAt": "2024-02-02T10:30:00",
  "updatedAt": "2024-02-02T10:30:00"
}
```

---

### Get All Budgets

Retrieve all budgets for a user.

**Request:**

```
GET /budgets/{userId}
```

**Response (200 OK):**

```json
[
  {
    "id": 201,
    "category": "food",
    "amount": 300.0,
    "createdAt": "2024-02-02T10:30:00"
  }
]
```

---

### Get Budgets with Spending

Get budgets with current spending information.

**Request:**

```
GET /budgets/{userId}/with-spending
```

**Response (200 OK):**

```json
[
  {
    "id": 201,
    "category": "food",
    "amount": 300.0,
    "spent": 125.5,
    "remaining": 174.5,
    "percentage": 41.83
  }
]
```

---

### Update Budget

Modify a budget amount.

**Request:**

```
PUT /budgets/{userId}/{budgetId}
Content-Type: application/json

{
  "amount": 350.00
}
```

**Response (200 OK):**

```json
{
  "id": 201,
  "category": "food",
  "amount": 350.0,
  "updatedAt": "2024-02-02T12:00:00"
}
```

---

### Delete Budget

Remove a budget.

**Request:**

```
DELETE /budgets/{userId}/{budgetId}
```

**Response (204 No Content)**

---

## 📋 Categories

Available expense categories:

```json
{
  "food": "Food & Dining",
  "transport": "Transport",
  "entertainment": "Entertainment",
  "shopping": "Shopping",
  "bills": "Bills & Utilities",
  "health": "Health",
  "other": "Other"
}
```

---

## ⚠️ Error Responses

### 400 Bad Request

```json
{
  "error": "Invalid input",
  "message": "Amount must be greater than 0"
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Invalid credentials"
}
```

### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "User not found"
}
```

### 409 Conflict

```json
{
  "error": "Conflict",
  "message": "Email already exists"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## 🔄 CORS Headers

All responses include CORS headers:

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: *
Access-Control-Max-Age: 3600
```

---

## 📝 Example Workflow

### 1. Register and Login

```bash
# Register
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass"}'

# Login
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass"}'
```

### 2. Add Expense

```bash
curl -X POST http://localhost:8080/api/expenses/1 \
  -H "Content-Type: application/json" \
  -d '{"description":"Lunch","amount":12.50,"category":"food","date":"2024-02-02"}'
```

### 3. Set Budget

```bash
curl -X POST http://localhost:8080/api/budgets/1 \
  -H "Content-Type: application/json" \
  -d '{"category":"food","amount":300.00}'
```

### 4. Get Statistics

```bash
curl http://localhost:8080/api/expenses/1/total
curl http://localhost:8080/api/budgets/1/with-spending
```

---

## 🎯 Response Time

All endpoints respond within 100-500ms (depending on database size)

---

## 📞 Support

For API issues or questions, check:

1. Server logs: Check terminal where backend is running
2. Browser console: Check frontend error messages
3. Database connection: Verify MySQL is running

---

**API Documentation Version: 1.0**
**Last Updated: February 2024**
