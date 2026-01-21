# CropCare Assistant

A comprehensive crop management and disease detection application with AI-powered diagnosis capabilities.

## Project Structure

```
cropcare-assistant/
├── User/          # Frontend React Application
├── server/        # Backend Node.js API
└── README.md      # This file
```

## Quick Start

### Backend Setup
```bash
cd server
npm install
# Configure .env with MongoDB connection string
npm run dev
```

### Frontend Setup
```bash
cd User
npm install
npm start
```

## Features

- 🌱 **Crop Management** - Track and manage your crops
- 🔍 **Disease Detection** - AI-powered plant disease diagnosis
- 📱 **Mobile-First Design** - Responsive interface for all devices
- 🔐 **User Authentication** - Secure login and user management
- 📊 **Dashboard** - Comprehensive crop health monitoring
- 🎯 **Treatment Recommendations** - Personalized treatment suggestions

## Technology Stack

### Frontend (User/)
- React 18
- Tailwind CSS
- shadcn/ui components
- React Router
- Framer Motion

### Backend (server/)
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/crops` - Get user crops
- `GET /api/diseases` - Get disease library
- `POST /api/diagnoses` - Create diagnosis

## Development

1. Clone the repository
2. Set up backend (see server/README.md)
3. Set up frontend (see User/README.md)
4. Configure environment variables
5. Start both servers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.