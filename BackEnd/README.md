# Daily Expense Tracker Backend API Documentation

This document provides information about the backend API endpoints for the Daily Expense Tracker application.

## Base URL
The backend Django app is served at:

```
http://localhost:8000/api/
```

All API endpoints for the `expense` app are exposed under the `/api/` path in the project (for example `http://localhost:8000/api/signup/`).

## Authentication Endpoints

### 1. User Registration (Signup)

Register a new user in the system.

- **URL:** `/signup/`
- **Method:** `POST`
- **Request Body:**
```json
{
    "FullName": "John Doe",
    "Email": "john@example.com",
    "Password": "yourpassword"
}
```
- **Success Response:**
  - **Code:** 201
  - **Content:**
```json
{
    "message": "User registered successfully"
}
```
- **Error Response:**
  - When email already exists:
  - **Code:** 400
  - **Content:**
```json
{
    "error": "Email already registered"
}
```

- **Frontend Integration:**
  - Located in `FrontEnd/frontend/src/components/Signup.js`
  - Uses React state to manage form data
  - Sends POST request to the backend using fetch API
  - Redirects to login page on successful registration

### 2. User Login

Authenticate a user and get access to the system.

- **URL:** `/login/`
- **Method:** `POST`
- **Request Body:**
```json
{
    "Email": "john@example.com",
    "Password": "yourpassword"
}
```
- **Success Response:**
  - **Code:** 200
  - **Content:**
```json
{
    "message": "Login successful",
    "userId": "1"
}
```
- **Error Response:**
  - When credentials are invalid:
  - **Code:** 401
  - **Content:**
```json
{
    "error": "Invalid credentials"
}
```

- **Frontend Integration:**
  - Located in `FrontEnd/frontend/src/components/Login.js`
  - Uses React state to manage form data
  - Sends POST request to the backend using fetch API
  - Stores user information in localStorage on successful login
  - Redirects to dashboard on successful authentication

## Models

### UserDetails Model
```python
class UserDetails:
    FullName: string (max_length=100)
    Email: email (unique=True, max_length=100)
    Password: string (max_length=20)
    RegDate: datetime (auto_now_add=True)
```

### ExpenseDetails Model
```python
class ExpenseDetails:
    UserId: ForeignKey(UserDetails)
    ExpenseDate: date (optional)
    ExpenseItem: string (max_length=100, optional)
    ExpenseCost: float
    NoteDate: datetime (auto_now_add=True)
```

## Security
- CSRF protection is disabled for API endpoints using `@csrf_exempt` decorator
- Email uniqueness is enforced at the database level
- Password is stored as plain text (Note: This is not recommended for production. Consider using proper password hashing)

## Expense Endpoints

### 1. Add Expense

Create a new expense record for a user.

- **URL:** `/add_expense/` (full path usually `http://localhost:8000/api/add_expense/`)
- **Method:** `POST`
- **Request Body (JSON):**
```json
{
  "UserId": "1",
  "ExpenseDate": "2025-10-30",
  "ExpenseItem": "Groceries",
  "ExpenseCost": "1200.50"
}
```
- **Success Response:**
  - **Code:** 201
  - **Content:**
```json
{
  "message": "Expense added successfully"
}
```
- **Error Response:**
  - **Code:** 400
  - **Content:**
```json
{
  "message": "Something went wrong",
  "error": "<error details>"
}
```

- **Frontend Integration:**
  - Component: `FrontEnd/frontend/src/components/AddExpense.js`
  - The component reads `userId` from `localStorage` and sends the request body with `UserId` set to that value.
  - Example fetch call (from `AddExpense.js`):
    - POST to `http://127.0.0.1:8000/api/add_expense/` with `Content-Type: application/json` and body JSON as shown above.
  - On success the frontend shows a toast message and redirects to the dashboard.

### 2. Manage Expense (List user's expenses)

Retrieve all expense records for a given user.

- **URL:** `/manage_expense/<int:user_id>/` (full path usually `http://localhost:8000/api/manage_expense/<user_id>/`)
- **Method:** `GET`
- **URL Example:** `http://localhost:8000/api/manage_expense/1/`
- **Success Response:**
  - **Code:** 200
  - **Content:** JSON array of expense objects (an example returned value):
```json
[
  {
    "id": 3,
    "UserId_id": 1,
    "ExpenseDate": "2025-10-30",
    "ExpenseItem": "Groceries",
    "ExpenseCost": 1200.5,
    "NoteDate": "2025-10-30T12:34:56.789Z"
  },
  {
    "id": 4,
    "UserId_id": 1,
    "ExpenseDate": "2025-10-29",
    "ExpenseItem": "Taxi",
    "ExpenseCost": 250.0,
    "NoteDate": "2025-10-29T08:22:10.123Z"
  }
]
```

- **Frontend Integration:**
  - Component: `FrontEnd/frontend/src/components/ManageExpense.js`
  - The component reads `userId` from `localStorage` and issues a GET request to `http://localhost:8000/api/manage_expense/{userId}/`.
  - Example fetch (from `ManageExpense.js`):
    - `fetch('http://localhost:8000/api/manage_expense/' + userId + '/')`, then parse JSON and render the list in a table.

## Example: Full signup -> login -> add expense -> list expenses flow

1. Register a new user (POST `/api/signup/`):

```json
{ "FullName": "John Doe", "Email": "john@example.com", "Password": "pass123" }
```

Response: `{ "message": "User registered successfully" }` (201)

2. Login (POST `/api/login/`):

```json
{ "Email": "john@example.com", "Password": "pass123" }
```

Response example (200):

```json
{ "message": "Login successful", "userId": 1, "userName": "John Doe" }
```

Frontend (login component) stores `userId` and `userName` in `localStorage`:

```js
localStorage.setItem('userId', userId);
localStorage.setItem('userName', userName);
```

3. Add an expense (POST `/api/add_expense/`) using stored `userId`:

```json
{ "UserId": "1", "ExpenseDate": "2025-10-30", "ExpenseItem": "Groceries", "ExpenseCost": "1200.50" }
```

4. List expenses for user (GET `/api/manage_expense/1/`): returns JSON array of the user's expenses.