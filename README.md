# CropCare AI - Advanced Crop Management System

A comprehensive crop management application powered by AI/ML for plant disease detection, treatment recommendations, real-time weather monitoring, and market price tracking.

## 🌟 Latest Features (v2.1.0)

### 🌤️ **Real-Time Weather Integration**
- **Geolocation-based Weather**: Automatic location detection for accurate local weather
- **Live Weather Data**: Temperature, conditions, humidity, and wind speed
- **Weather Forecasting**: Hourly forecasts for treatment planning
- **Auto-refresh**: Updates every 10 minutes

### 💰 **Live Market Prices**
- **Government Mandi API**: Real-time crop prices from official Indian markets
- **Price Tracking**: Current rates per quintal with trend indicators
- **Market Information**: Location-based pricing from various mandis
- **Detailed Market View**: Comprehensive market rates page

### 📋 **Comprehensive Treatment Database**
- **45+ Disease Treatments**: Detailed treatment plans for major Indian crops
- **Bilingual Support**: Information in English and Hindi
- **Crop Coverage**: Rice, Wheat, Tomato, Cotton, and more
- **Treatment Categories**: Organic and chemical solutions with dosages

### 🔔 **Enhanced Reminder System**
- **Modern UI**: Redesigned reminder popup with better visibility
- **AI Scheduling**: Intelligent reminder timing based on treatment frequency
- **Custom Schedules**: User-defined reminder times
- **Clear Notifications**: Prominent confirmation messages

### 🎨 **Improved User Experience**
- **Side-by-Side Layout**: Weather and market data in equal-sized blocks
- **Responsive Design**: Perfect display across all devices
- **Modern Interface**: Clean, accessible design with AA compliance
- **Error Handling**: Graceful fallbacks for API failures

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+ (for ML service)
- MongoDB (local or cloud)
- OpenWeatherMap API key (for weather features)

### Environment Setup

1. **Backend Environment (.env)**
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   PYTHON_ML_URL=http://localhost:5000
   OPENWEATHER_API_KEY=your_openweather_api_key
   ```

2. **Frontend Environment (.env)**
   ```env
   PORT=3001
   REACT_APP_API_URL=http://localhost:5001
   ```

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/SuhaniSharma43434343/cropcare-assistant.git
   cd cropcare-assistant
   ```

2. **Install Dependencies**
   ```bash
   # Backend dependencies
   cd server
   npm install
   
   # Frontend dependencies
   cd ../User
   npm install
   
   # Python ML service dependencies
   cd ../python-ml-service
   pip install -r requirements.txt
   ```

3. **Start all services**
   ```bash
   # Backend (Port 5001)
   cd server && npm start
   
   # Frontend (Port 3001)
   cd User && npm start
   
   # ML Service (Port 5000)
   cd python-ml-service && python app.py
   ```

## 📁 Project Structure

```
cropcare-assistant/
├── User/                           # React Frontend (Port 3001)
│   ├── src/
│   │   ├── components/
│   │   │   ├── CurrentWeather.js   # Geolocation-based weather
│   │   │   ├── MandiPrices.js      # Government market prices
│   │   │   └── auth/               # Authentication components
│   │   ├── pages/
│   │   │   ├── Dashboard.js        # Main dashboard
│   │   │   └── TreatmentPlans.js   # Treatment guide
│   │   └── contexts/               # React contexts
├── server/                         # Node.js Backend (Port 5001)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js            # Authentication routes
│   │   │   ├── weather.js         # Weather API integration
│   │   │   └── mandi.js           # Market price API
│   │   ├── controllers/           # Route controllers
│   │   ├── models/               # Database models
│   │   └── middleware/           # Custom middleware
├── python-ml-service/             # Python ML Service (Port 5000)
└── README.md                      # This file
```

## 🌟 Core Features

### 🤖 **AI/ML Disease Detection**
- Pure AI disease identification through ML analysis
- Crop type detection from uploaded images
- ML-generated treatment recommendations
- Confidence scoring for all predictions

### 🌤️ **Smart Weather Integration**
- **Real-time Weather**: Current conditions with geolocation
- **Weather Forecasting**: Hourly predictions for treatment timing
- **Treatment Recommendations**: Weather-based application advice
- **Auto-location**: Automatic detection of user's location

### 💰 **Live Market Intelligence**
- **Government Data**: Official Mandi prices from data.gov.in
- **Real-time Rates**: Current crop prices per quintal
- **Market Trends**: Price change indicators and trends
- **Location-based**: Prices from user's region and nearby markets

### 📚 **Comprehensive Treatment Database**
- **45+ Diseases**: Detailed treatment plans for major crops
- **Bilingual Content**: English and Hindi support
- **Treatment Types**: Organic and chemical solutions
- **Dosage Information**: Precise application instructions

### 🔔 **Intelligent Reminders**
- **AI Scheduling**: Optimal timing based on treatment frequency
- **Custom Reminders**: User-defined notification times
- **Push Notifications**: Timely alerts for treatment application

## 🛠️ Technology Stack

### Frontend (Port 3001)
- React 18 + Tailwind CSS
- Real-time weather and market data integration
- Responsive design with modern UI components
- Geolocation API for automatic location detection

### Backend (Port 5001)
- Node.js + Express.js
- MongoDB for user authentication
- JWT Authentication
- Weather API integration (OpenWeatherMap)
- Proxy to ML service for disease detection

### ML Service (Port 5000)
- Python + FastAPI
- PIL for image processing
- AI disease detection engine
- Treatment recommendation system

## 🌐 API Endpoints

### Backend API (Port 5001)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/ml/predict` - Disease prediction endpoint
- `GET /api/weather/forecast/coords/:lat/:lon` - Weather by coordinates
- `GET /api/mandi/prices` - Market prices
- `GET /api/health` - Backend health check

### ML Service API (Port 5000)
- `POST /predict` - Disease prediction endpoint
- `GET /health` - ML service health check

### External APIs
- **OpenWeatherMap**: Real-time weather data
- **Government Mandi API**: Official crop market prices

## 📱 Complete User Journey

### 🔐 **Authentication Flow**
1. **Register/Login** - Secure user authentication
2. **Profile Setup** - Basic farmer information

### 🌤️ **Weather & Market Dashboard**
1. **Auto-location** - Automatic weather detection
2. **Live Weather** - Current conditions and forecasts
3. **Market Prices** - Real-time crop rates from government sources

### 🔍 **Disease Detection & Treatment**
1. **Image Capture** - Take photo of affected plant/leaf
2. **AI Analysis** - ML service analyzes image for diseases
3. **Results Display** - Disease identification with confidence scores
4. **Treatment Plans** - Comprehensive organic and chemical solutions
5. **Reminder Setup** - AI-scheduled or custom treatment reminders

## 🧪 Disease Detection Capabilities

### Supported Crops & Diseases
- **Rice**: Blast Disease, Brown Spot, Bacterial Blight
- **Wheat**: Rust Disease, Powdery Mildew, Leaf Blight
- **Tomato**: Late Blight, Early Blight, Bacterial Spot
- **Cotton**: Bollworm, Leaf Curl, Bacterial Blight
- **Potato**: Late Blight, Early Blight, Bacterial Wilt
- **Corn**: Leaf Blight, Rust, Smut
- **And 30+ more diseases** across major Indian crops

## 🔧 Configuration

### Backend (.env)
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PYTHON_ML_URL=http://localhost:5000
OPENWEATHER_API_KEY=your_openweather_api_key
```

### Frontend (.env)
```env
PORT=3001
REACT_APP_API_URL=http://localhost:5001
```

## 🚨 System Validation

### Verify Complete Setup
```bash
# Check all services
curl http://localhost:3001  # Frontend
curl http://localhost:5001/api/health  # Backend
curl http://localhost:5000/health  # ML Service

# Test weather API
curl "http://localhost:5001/api/weather/forecast/coords/19.0760/72.8777"

# Test ML prediction
curl -X POST http://localhost:5001/api/ml/predict \
  -H "Content-Type: application/json" \
  -d '{"crop":"tomato","imageBase64":"..."}'
```

### Expected Behavior
- ✅ Real-time weather data from user location
- ✅ Live market prices from government API
- ✅ AI disease detection with treatment recommendations
- ✅ Comprehensive treatment database with 45+ diseases
- ✅ Enhanced reminder system with modern UI
- ✅ Responsive design across all devices

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support:
- Create an issue on GitHub
- Check API keys are properly configured
- Ensure all services are running on correct ports

## 🔄 Service Status

After starting services, verify:
- **Frontend**: http://localhost:3001 - Main application interface
- **Backend**: http://localhost:5001/api/health - API gateway and authentication
- **ML Service**: http://localhost:5000/health - Disease detection engine
- **Weather API**: Integrated OpenWeatherMap service
- **Market API**: Government Mandi data integration

---

**🌾 CropCare AI - Empowering farmers with intelligent crop management solutions! 🌾**