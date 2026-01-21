# CropCare Backend API

Backend API for the CropCare Assistant application built with Node.js, Express.js, and MongoDB.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env` file and update with your MongoDB connection string
   - Set your JWT secret key
   - Configure other environment variables as needed

3. **Database Setup**
   - Make sure MongoDB is running
   - Update `MONGODB_URI` in `.env` file with your connection string

4. **Run the Server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Crops
- `GET /api/crops` - Get user's crops (protected)
- `POST /api/crops` - Create new crop (protected)
- `PUT /api/crops/:id` - Update crop (protected)
- `DELETE /api/crops/:id` - Delete crop (protected)

### Diseases
- `GET /api/diseases` - Get all diseases
- `GET /api/diseases/:id` - Get disease by ID
- `POST /api/diseases` - Create new disease (protected)

### Diagnoses
- `GET /api/diagnoses` - Get user's diagnoses (protected)
- `POST /api/diagnoses` - Create new diagnosis (protected)
- `PUT /api/diagnoses/:id` - Update diagnosis (protected)

### Health Check
- `GET /api/health` - Server health check

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cropController.js
│   │   ├── diseaseController.js
│   │   └── diagnosisController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Crop.js
│   │   ├── Disease.js
│   │   └── Diagnosis.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── crops.js
│   │   ├── diseases.js
│   │   └── diagnoses.js
│   └── server.js
├── .env
├── .gitignore
└── package.json
```

## Environment Variables

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```