# Coffee Shop Management System - Setup & Run Guide

## Prerequisites

- Node.js (v16+)
- MySQL Server running on `localhost:3306`
- Port 3000 (backend) and 5173 (frontend) available

## Database Setup

The database `coffee_db` is created automatically when the backend starts. If needed, manually initialize:

```bash
cd backend
node db-init.js
```

## Starting the Application

### Terminal 1: Start Backend

```bash
cd backend
npm install
npm run start:dev
```

Expected output:

```
Server running on http://localhost:3000
```

### Terminal 2: Start Frontend

```bash
cd frontend
npm install
npm start
```

Expected output:

```
VITE v5.x.x ready in XXX ms
➜  Local: http://localhost:5173/
```

## Access the Application

1. Open browser: http://localhost:5173
2. Login with default credentials:
   - Username: `admin`
   - Password: `admin123` (or value of `ADMIN_PASSWORD` env var)

## Connectivity Verification

Run the connectivity test:

```bash
node test-connection.js
```

This will verify:

- Backend is running on port 3000
- Frontend is running on port 5173
- Database is initialized
- CORS is enabled
- Login endpoint works

## Architecture

### Backend (NestJS)

- API runs on `http://localhost:3000`
- CORS enabled for `localhost:5173` and `localhost:5174`
- Database: MySQL (`coffee_db`)
- Authentication: JWT
- Modules:
  - **Auth**: JWT login
  - **Users**: User management (admin-only)
  - **Products**: Product catalog management
  - **Tables**: Table management
  - **Orders**: Order creation and tracking

### Frontend (React + Vite)

- UI runs on `http://localhost:5173`
- Uses fetch API with automatic Authorization header injection
- Routes:
  - `/login` - Login page
  - `/` or `/products` - Products page
  - `/orders` - Orders page
  - `/tables` - Tables page (admin/waiter)
  - `/users` - Users management (admin)
  - `/dashboard` - Role-based dashboard

## Features by Role

### Admin

- Create/update/delete users
- Create/update/delete products
- Create/update/delete tables
- View all orders, change order status
- Add/remove items from orders

### Waiter

- View tables
- Create orders
- Add items to orders
- Change order status (advance workflow)
- Change table status

### Cashier

- View orders
- Mark orders as completed (for billing)

## Environment Variables

Create/update `.env` in backend directory:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=coffee_db
JWT_SECRET=verysecretkey
JWT_EXPIRES_IN=3600s
PORT=3000
ADMIN_PASSWORD=admin123
```

## Troubleshooting

### Port already in use

- Kill process: `netstat -ano | find ":3000"` then `taskkill /PID <PID> /F`
- Or change port in `.env` (backend) or `vite.config.ts` (frontend)

### Database connection error

- Ensure MySQL is running: `netstat -ano | find ":3306"`
- Check `.env` credentials
- Run: `node db-init.js` to create database

### CORS errors in browser

- Check backend started with CORS enabled
- Verify Origin header matches allowed origins in `main.ts`
- Restart backend: `npm run start:dev`

### Frontend not loading

- Check Vite is running on correct port (5173 or next available)
- Clear browser cache
- Check browser console for errors

## API Endpoints

### Authentication

- `POST /auth/login` - Login (public)

### Users (admin-only)

- `POST /users` - Create user
- `GET /users/:id` - Get user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Products (public list, admin for CRUD)

- `GET /products` - List all products
- `POST /products` - Create product (admin)
- `DELETE /products/:id` - Delete product (admin)

### Tables (public list, admin/waiter for status)

- `GET /tables` - List all tables
- `POST /tables` - Create table (admin)
- `PUT /tables/:id/status` - Change table status (admin/waiter)

### Orders

- `GET /orders` - List all orders
- `POST /orders` - Create order
- `PATCH /orders/:id/status` - Change order status
- `POST /orders/:id/add-item` - Add item to order
- `PATCH /orders/:id/remove-item/:itemId` - Remove item from order

---

**Last Updated:** December 10, 2025
**Status:** ✅ Fully configured and tested
