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

### 3. Change Password

Change the password for an existing user account.

- **URL:** `/change_password/` (full path usually `http://localhost:8000/api/change_password/`)
- **Method:** `POST`
- **Request Body (JSON):**
```json
{
  "Email": "john@example.com",
  "OldPassword": "oldpass123",
  "NewPassword": "newpass456"
}
```
- **Success Response:**
  - **Code:** 200
  - **Content:**
```json
{
  "message": "Password changed successfully"
}
```
- **Error Response:**
  - **Code:** 400
  - **Content:**
```json
{
  "message": "Error changing password",
  "error": "<error details>"
}
```

- **Frontend Integration:**
  - Component: `FrontEnd/frontend/src/components/ChangePassword.js` (if present)
  - The component should collect the user's email, old password and new password and POST them to this endpoint.
  - On success show a confirmation toast and optionally redirect the user to login.

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
  

### 3. Update Expense

Update an existing expense record.

- **URL:** `/update_expense/<int:expense_id>/` (full path usually `http://localhost:8000/api/update_expense/<expense_id>/`)
- **Method:** `PUT`
- **URL Example:** `http://localhost:8000/api/update_expense/1/`
- **Request Body (JSON):**
```json
{
  "ExpenseDate": "2025-11-01",
  "ExpenseItem": "Updated Groceries",
  "ExpenseCost": "1500.75"
}
```
- **Success Response:**
  - **Code:** 200
  - **Content:**
```json
{
  "message": "Expense updated successfully"
}
```
- **Error Response:**
  - **Code:** 400
  - **Content:**
```json
{
  "message": "Error updating expense",
  "error": "<error details>"
}
```

- **Frontend Integration:**
  - Component: `FrontEnd/frontend/src/components/ManageExpense.js`
  - Updates are triggered from the edit button in the expense list
  - Uses fetch with PUT method to update the expense record
  - Shows success/error toast messages after update

### 4. Delete Expense

Delete an existing expense record.

- **URL:** `/delete_expense/<int:expense_id>/` (full path usually `http://localhost:8000/api/delete_expense/<expense_id>/`)
- **Method:** `DELETE`
- **URL Example:** `http://localhost:8000/api/delete_expense/1/`
- **Success Response:**
  - **Code:** 200
  - **Content:**
```json
{
  "message": "Expense deleted successfully"
}
```
- **Error Response:**
  - **Code:** 400
  - **Content:**
```json
{
  "message": "Error deleting expense",
  "error": "<error details>"
}
```

- **Frontend Integration:**
  - Component: `FrontEnd/frontend/src/components/ManageExpense.js`
  - Delete is triggered from the delete button in the expense list
  - Uses fetch with DELETE method to remove the expense record
  - Shows success/error toast messages after deletion

### 5. Search Expense

Search expenses for a user by date, item name or a keyword.

- **URL:** `/search_expense/` (full path usually `http://localhost:8000/api/search_expense/`)
- **Method:** `POST` (or GET if implemented differently)
- **Request Body (JSON) example:**
```json
{
  "UserId": "1",
  "query": "groceries",
  "startDate": "2025-10-01",
  "endDate": "2025-10-31"
}
```
- **Behavior:**
  - The backend should filter `ExpenseDetails` for `UserId` and match `ExpenseItem` or other searchable fields against `query` and/or `ExpenseDate` within the date range when provided.
- **Success Response:**
  - **Code:** 200
  - **Content:** JSON array of expense objects matching the search criteria (same shape as `manage_expense` list output).
- **Error Response:**
  - **Code:** 400
  - **Content:**
```json
{
  "message": "Error searching expenses",
  "error": "<error details>"
}
```

- **Frontend Integration:**
  - Component: (could be `ExpenseReport.js` or a search bar inside `ManageExpense.js`)
  - The frontend should send the search request (POST with JSON) including `UserId` and any filters. It then renders the returned array just like the manage list.

> Note: `search_expense` is the last endpoint in the `expense` endpoints group.

## Example: Full Signup -> Login -> Add Expense -> List Expenses Flow -> Manage Expense

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

4. List expenses (GET `/api/manage_expense/1/`):
Returns list of all expenses for the user.

5. Update expense (PUT `/api/update_expense/3/`):
```json
{
  "ExpenseDate": "2025-11-01",
  "ExpenseItem": "Monthly Groceries",
  "ExpenseCost": "1500.75"
}
```
Response: `{ "message": "Expense updated successfully" }` (200)

6. Delete expense (DELETE `/api/delete_expense/3/`):
```json
No request body needed.
```
Response: `{ "message": "Expense deleted successfully" }` (200)

7. Search expense (GET `/api/search_expense/1/`):
```json
{
  "UserId": "1",
  "query": "groceries",
  "startDate": "2025-10-01",
  "endDate": "2025-10-31"
}
```

## Connect with me
- **LinkedIn:** https://www.linkedin.com/in/devadi
- **GitHub:** https://github.com/ADI-2707
