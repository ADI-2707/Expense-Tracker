# Daily Expense Tracker — Frontend

This README documents the frontend application (React) for the Daily Expense Tracker project, how its features work, how components connect to the backend API, and how to run and test the app locally.

## Table of contents

- Overview
- How it works (high level)
- Key components and responsibilities
- Important frontend/backend interactions (examples)
- Local development (Windows PowerShell)
- Useful implementation notes & recommendations


## Overview

The frontend is a React single-page application located in `FrontEnd/frontend`. It provides UI to:

- Register and login users (signup, login)
- Add new expenses
- View and manage (list / edit / delete) existing expenses
- Search expenses and view reports (UI components present)

The app stores minimal session data in `localStorage` (user id and user name) and uses fetch() to call the Django backend API endpoints (served under `http://localhost:8000/api/`).


## How it works (high level)

1. User registers with the Signup form. The frontend sends a POST request to the backend `/api/signup/` endpoint.
2. After signup, user logs in using the Login form. The frontend sends a POST request to `/api/login/`.
3. On successful login the backend returns `{ message, userId, userName }`. The frontend stores `userId` and `userName` in `localStorage` and redirects to the dashboard.
4. From the dashboard the user can add expenses (POST `/api/add_expense/`) and manage expenses (GET `/api/manage_expense/{userId}/`, PUT to update, DELETE to remove).
5. The Manage / Report components fetch data from the backend and render it in tables and lists.


## Key components and responsibilities

Files live in `FrontEnd/frontend/src/components/`.

- `Signup.js` — registration form. Sends POST to `/api/signup/`. On success redirects to login.
- `Login.js` — login form. Sends POST to `/api/login/`. On success stores `userId` and `userName` in `localStorage` and redirects to the dashboard.
- `Dashboard.js` — simple landing page after login. Reads `userName` from `localStorage`.
- `AddExpense.js` — form to create an expense. Reads `userId` from `localStorage` and posts `{ ...formData, UserId: userId }` to `/api/add_expense/`.
- `ManageExpense.js` — lists user's expenses. Uses `fetch('http://localhost:8000/api/manage_expense/' + userId + '/')` to get the list and renders a table. Edit/delete buttons should call update/delete endpoints (implementations to wire in the UI).
- `ExpenseReport.js` — (present) used for search/reporting features (connect to `search_expense` endpoint when implemented).
- `ChangePassword.js` — (present) posts `{ Email, OldPassword, NewPassword }` to `/api/change_password/` (account endpoint).
- `Navbar.js`, `Home.js` — routing/layout components.


## Important frontend/backend interactions (examples)

Notes: the backend expects the API base under `http://localhost:8000/api/`.

1) Signup (example request sent by `Signup.js`)

POST http://localhost:8000/api/signup/

Request JSON:
```json
{
  "FullName": "John Doe",
  "Email": "john@example.com",
  "Password": "pass123"
}
```

Success response (example): HTTP 201
```json
{ "message": "User registered successfully" }
```

2) Login (example request sent by `Login.js`)

POST http://localhost:8000/api/login/

Request JSON:
```json
{
  "Email": "john@example.com",
  "Password": "pass123"
}
```

Successful response (example): HTTP 200
```json
{ "message": "Login successful", "userId": 1, "userName": "John Doe" }
```

Frontend behavior after login (in `Login.js`):
```js
localStorage.setItem('userId', userId);
localStorage.setItem('userName', userName);
// redirect to /dashboard
```

3) Add Expense (from `AddExpense.js`)

POST http://127.0.0.1:8000/api/add_expense/

Request JSON (the component adds `UserId` from localStorage):
```json
{
  "UserId": "1",
  "ExpenseDate": "2025-10-30",
  "ExpenseItem": "Groceries",
  "ExpenseCost": "1200.50"
}
```

Successful response (example): HTTP 201
```json
{ "message": "Expense added successfully" }
```

4) Manage Expense (list) — `ManageExpense.js` fetches list

GET http://localhost:8000/api/manage_expense/{userId}/

Response (example): HTTP 200
```json
[
  { "id": 3, "UserId_id": 1, "ExpenseDate": "2025-10-30", "ExpenseItem": "Groceries", "ExpenseCost": 1200.5, "NoteDate": "2025-10-30T12:34:56.789Z" },
  ...
]
```

5) Update Expense (what the UI should call when editing)

PUT http://localhost:8000/api/update_expense/{expenseId}/

Request JSON:
```json
{
  "ExpenseDate": "2025-11-01",
  "ExpenseItem": "Updated Groceries",
  "ExpenseCost": "1500.75"
}
```

6) Delete Expense (what the UI should call on delete)

DELETE http://localhost:8000/api/delete_expense/{expenseId}/

Response (example): HTTP 200
```json
{ "message": "Expense deleted successfully" }
```

7) Search Expense (example)

POST http://localhost:8000/api/search_expense/

Request JSON:
```json
{
  "UserId": "1",
  "query": "groceries",
  "startDate": "2025-10-01",
  "endDate": "2025-10-31"
}
```

Response: JSON array of expenses matching the criteria (same shape as the list output).


## Local development (Windows PowerShell)

Open PowerShell and run:

```powershell
# 1. Run backend (Django) in another terminal
# from project BackEnd folder
cd 'C:\Users\hp\Desktop\Daily Expense Tracker\BackEnd'
# make sure virtualenv activated if you use one, then:
python manage.py runserver

# 2. Start frontend
cd 'C:\Users\hp\Desktop\Daily Expense Tracker\FrontEnd\frontend'
npm install
npm start
```

This should open the React dev server (usually on http://localhost:3000). Make sure the Django backend is running on `http://localhost:8000/`.

Notes:
- If the frontend cannot call the backend because of CORS, add and configure `django-cors-headers` in the backend to allow `http://localhost:3000`.
- The frontend uses `fetch()` calls to `http://localhost:8000/api/...` or `http://127.0.0.1:8000/api/...` — unify this to a single base URL if needed.


## Environment and configuration suggestions

- Consider extracting the API base URL into an environment variable in the React app (`REACT_APP_API_BASE_URL`) and use it in fetch calls instead of hard-coded `http://localhost:8000/api/`.

Example usage in code:
```js
const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
fetch(`${API_BASE}/add_expense/`, { method: 'POST', ... });
```

- Enable CORS on the backend while developing:
  - `pip install django-cors-headers`
  - Add `corsheaders` to INSTALLED_APPS and `CorsMiddleware` to MIDDLEWARE, then set `CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]`.


## Frontend libraries observed

- react-toastify — used for success/error toasts (notifications)
- Bootstrap / Font Awesome classes used in markup (make sure CSS is loaded in `index.html` or `index.js`)


## Troubleshooting

- 401 / 400 errors on login: verify the backend is running and `Email`/`Password` fields are correct.
- `fetch` network errors: check that both servers are running and there are no CORS blocks.
- If the list is empty but expenses exist: check `userId` stored in `localStorage` matches the backend IDs.

## Connect with me
- **LinkedIn:** https://www.linkedin.com/in/devadi
- **GitHub:** https://github.com/ADI-2707
