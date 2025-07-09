# SmartBasket Backend

This is the backend for the SmartBasket e-commerce application. It provides authentication (user/admin), user management, and is ready for further e-commerce features.

## Tech Stack
- Node.js
- NestJS
- MongoDB (via Mongoose)
- JWT Authentication
- Swagger (OpenAPI) for API documentation

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB (local or remote instance)

### Installation
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd smartbasket-be
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the project root (see `.env.example` for required variables):
   ```env
   JWT_SECRET=your_jwt_secret
   MONGODB_URI=mongodb://localhost:27017/smartbasket
   JWT_EXPIRES_IN=1h
   ```

### Running the App
```sh
npm run start
```
The server will start on [http://localhost:3000](http://localhost:3000).

### API Documentation
Swagger UI is available at:
```
http://localhost:3000/api
```

### Building for Production
```sh
npm run build
```
The output will be in the `dist/` directory.

### Running Tests
```sh
npm run test
```

## Features
- User and admin registration/login
- JWT-based authentication
- Role-based access control
- User update and fetch endpoints
- Consistent error handling
- API documentation with Swagger

## License
MIT
