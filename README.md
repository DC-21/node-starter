### **Documentation**

#### **Setup Instructions**

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd node-starter
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the project root and configure the following variables:
   ```env
   DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
   JWT_SECRET=<your_jwt_secret>
   PORT=<server_port>
   ```
   Replace `<username>`, `<password>`, `<host>`, `<port>`, and `<database>` with your PostgreSQL database credentials.

4. **Set Up the Database**
   Use Prisma to initialize the database schema:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Run the Application**
   Start the development server:
   ```bash
   npm run dev
   ```

---

#### **Features**

1. **Authentication**
   - User registration with hashed password storage using bcrypt.
   - Secure login with JWT-based authentication.
   - Middleware for protecting routes with token validation.

2. **Database Management**
   - ORM functionality with Prisma.
   - Predefined schema for user management.

3. **API Structure**
   - Modular routes for scalability.
   - Standardized error handling.

---

#### **API Endpoints**

1. **Authentication**
   - **Register**  
     **POST** `/auth/register`  
     Request Body:  
     ```json
     {
       "email": "user@example.com",
       "password": "password123"
     }
     ```
     Response:  
     ```json
     {
       "message": "User registered successfully"
     }
     ```

   - **Login**  
     **POST** `/auth/login`  
     Request Body:  
     ```json
     {
       "email": "user@example.com",
       "password": "password123"
     }
     ```
     Response:  
     ```json
     {
       "token": "<jwt_token>"
     }
     ```

2. **Protected Route**  
   - **GET** `/protected`  
     Headers:  
     ```json
     {
       "Authorization": "Bearer <jwt_token>"
     }
     ```
     Response:  
     ```json
     {
       "message": "You have access to this protected route"
     }
     ```

---

#### **Project Structure**
```
node-starter/
├── prisma/
│   ├── schema.prisma  # Prisma schema definition
├── src/
│   ├── controllers/   # Route logic
│   ├── middleware/    # JWT and error handling
│   ├── routes/        # API route definitions
│   ├── utils/         # Utility functions (e.g., hash, token generation)
│   ├── app.ts         # Express app setup
│   └── server.ts      # Server entry point
├── .env               # Environment variables
├── package.json       # Project dependencies and scripts
```

---

#### **Scripts**
- **Start in Development Mode**:  
  ```bash
  npm run dev
  ```
- **Build for Production**:  
  ```bash
  npm run build
  ```
- **Run Tests**:  
  ```bash
  npm run test
  ```

---

#### **Technologies Used**
- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for handling API routes.
- **Prisma**: ORM for database interactions.
- **PostgreSQL**: Relational database.
- **bcrypt**: For hashing and verifying passwords.
- **JWT**: Secure user authentication.

This documentation should help you onboard quickly and utilize Node-Starter effectively for your next project. Let me know if you'd like to extend it further!
