# CropCare Assistant - Frontend

React-based frontend application for the CropCare Assistant platform.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Update `.env` file with backend API URL
   - Configure other environment variables as needed

3. **Run the Application**
   ```bash
   # Development mode
   npm start
   
   # Build for production
   npm run build
   ```

## Features

- 🌱 **Crop Management Interface** - Add, edit, and track crops
- 📸 **Image Capture** - Camera integration for plant photos
- 🔍 **Disease Diagnosis** - Upload images for AI analysis
- 📊 **Dashboard** - Visual crop health monitoring
- 🔐 **Authentication** - Login and user profile management
- 📱 **Mobile Responsive** - Optimized for mobile devices

## Technology Stack

- **React 18** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

## Project Structure

```
User/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── camera/        # Camera functionality
│   │   ├── layout/        # Layout components
│   │   └── ui/            # Reusable UI components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components
│   ├── App.js             # Main app component
│   └── index.js           # Entry point
├── package.json
└── tailwind.config.js
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## API Integration

The frontend connects to the backend API running on `http://localhost:5000` by default.

### Key API Endpoints Used:
- Authentication: `/api/auth/*`
- Crops: `/api/crops/*`
- Diseases: `/api/diseases/*`
- Diagnoses: `/api/diagnoses/*`

## Environment Variables

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_APP_NAME=CropCare Assistant
```

## Deployment

1. Build the application: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Configure environment variables for production