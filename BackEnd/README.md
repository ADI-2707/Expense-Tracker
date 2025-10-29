# Daily Expense Tracker Backend API Documentation

This document provides information about the backend API endpoints for the Daily Expense Tracker application.

## Base URL
```
http://localhost:8000/
```

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