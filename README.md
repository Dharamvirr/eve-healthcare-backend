# EVE Healthcare - Backend Engineering Assignment

This is a backend service for diagnostic test bookings and simulated payments, built using the **MERN Stack** (Node.js, Express, MongoDB). 

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed locally or MongoDB Atlas cluster (Optional: The app will run an in-memory MongoDB automatically if no URI is provided!)

### Steps to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dharamvirr/eve-healthcare-backend.git
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the `backend` directory based on the `.env.example` file.
   ```
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=your_jwt_secret
   # MONGO_URI=your_mongodb_connection_string (Leave empty to use zero-config in-memory MongoDB)
   ```

4. **Start the server**
   ```bash
   # Run in development mode
   npm run dev
   
   # Or run normally
   node server.js
   ```

## Assumptions Made
1. **Centres and Tests Setup:** It is assumed that diagnostic centres and their available tests are pre-populated by an administrator. An open `POST /api/centres` endpoint is included for ease of setup and testing.
2. **Payments:** The payment simulation uses a simple randomizer (80% success rate) to generate mock payment outcomes. A third-party provider is simulated to send back a webhook payload. 
3. **Idempotency:** Webhook idempotency is achieved by storing unique `transactionId`s in a `WebhookEvent` collection. If the same `transactionId` is received again, the system recognizes it and ignores duplicate processing.
4. **Data Modeling:** The tests are embedded as subdocuments inside the `Centre` model since each centre might have specific tests and differing prices.

## API Endpoints

### 1. Authentication
- `POST /api/auth/signup` - Register a new user
  - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
- `POST /api/auth/login` - Login user and get JWT
  - Body: `{ "email": "john@example.com", "password": "password123" }`

### 2. Diagnostic Centres
- `GET /api/centres` - List all centres
- `GET /api/centres/:id` - Get a specific centre
- `POST /api/centres` - Create a centre (Admin purpose)
  - Body: 
    ```json
    {
      "name": "EVE Lab",
      "location": "Mumbai",
      "tests": [
        { "name": "Blood Test", "price": 500 },
        { "name": "MRI", "price": 5000 }
      ]
    }
    ```

### 3. Bookings
- `POST /api/bookings` - Create a booking (Requires Bearer Token)
  - Body: 
    ```json
    {
      "centreId": "<centre_object_id>",
      "testName": "Blood Test",
      "appointmentDate": "2023-11-20T10:00:00.000Z"
    }
    ```
- `GET /api/bookings` - Get user's bookings (Requires Bearer Token)
- `GET /api/bookings/:id` - Get specific booking (Requires Bearer Token)

### 4. Payments
- `POST /api/payments` - Simulate payment processing (Requires Bearer Token)
  - Body: `{ "bookingId": "<booking_object_id>" }`
- `POST /api/payments/webhook` - Webhook to accept payment status updates
  - Body: 
    ```json
    {
      "transactionId": "txn_123456789",
      "bookingId": "<booking_object_id>",
      "status": "SUCCESS"
    }
    ```

## Future Improvements (If had more time)
- **Validation:** Use a validation library like `Joi` or `express-validator` for stricter request payload validation.
- **Testing:** Write comprehensive unit and integration tests using Jest and Supertest for all endpoints.
- **Dockerization:** Add a `Dockerfile` and `docker-compose.yml` for seamless containerized deployment.
- **Role-based Access Control (RBAC):** Implement proper Admin roles for creating/updating Centres and viewing all bookings.
- **Pagination & Filtering:** Add pagination and query filters for getting centres and bookings.
