# Estate Craft - Real Estate Management Platform

Estate Craft is a real estate management platform using the MERN stack. It supports admins, employees, sellers, and buyers. The platform is secure, responsive, and easy to use.

---

## Features

- Multi-User Roles: Buyer, Seller, Employee, Admin
- Authentication & Authorization (JWT & Redux)
- Secure Platform
- User Confidentiality
- Feedback System
- Advertisement Page for Seller
- Property Details & Images
- Dashboards (Seller, Employee, Admin)
- Admin Analytics
- Payment Integration (Stripe)
- Save Favourites
- Buy Properties (Land, House, Villa, Apartment)
- Responsive Design
- User-Friendly Interface

---

## Technology Stack

### FRONTEND (`/frontend`)
- React.js
- Redux
- HTML, CSS, JavaScript
- Axios
- React Router
- Styled Components
- Toast Notifications

### BACKEND (`/backend`)
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (Authentication)
- Multer (File Uploads)
- Stripe (Payments)
- Redis (Caching)
- Swagger (API Docs)
- dotenv (Environment Variables)
- bcrypt (Password Hashing)
- CORS

### DEVOPS & DEPLOYMENT
- Docker
- Docker Compose

---

## Project Structure

```
/backend         # Node.js/Express backend
/frontend        # React frontend
/docker-compose.yml
/README.md
```

---

## Installation

1. Download or clone the project.
2. Make sure you have **Node.js**, **npm**, and **Docker** installed.

---

## Running Locally (Without Docker)

Open two terminals.

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

---

## Running with Docker

Make sure Docker is running.

```bash
docker-compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

To stop:

```bash
docker-compose down
```

---

## Environment Variables

- Copy `.env.example` to `.env` in `/backend` and fill in your values (MongoDB URI, JWT secret, Stripe key, etc).

---

## Folder Details

### `/backend`
- `controllers/` - All backend logic (Buyer, Seller, Admin, Employee)
- `models/` - Mongoose models (User, Property, Advertisement, etc)
- `routes/` - API routes for all modules
- `middlewares/` - Auth, upload, cache etc.
- `utils/` - Redis, helpers
- `swagger/` - API documentation

### `/frontend`
- `src/components/` - All React components (BuyerPage, SellerPage, AdminPage, etc)
- `src/redux/` - Redux store and slices
- `src/services/` - API calls and auth
- `src/assets/` - Images and icons
- `src/styles/` - Styled components

---

## Notes

- Sellers can only advertise if previous request is rejected or not made.
- All main features are available from the dashboard.


