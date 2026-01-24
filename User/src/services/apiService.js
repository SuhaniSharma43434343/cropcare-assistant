const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class APIService {
  async get(endpoint, requireAuth = true) {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      if (requireAuth) {
        const token = localStorage.getItem('cropcare_token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
        headers
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  }

  async post(endpoint, data) {
    try {
      const token = localStorage.getItem('cropcare_token');
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  }

  async predictDisease(imageBase64, cropType) {
    try {
      // Validate inputs
      if (!imageBase64 || !cropType) {
        throw new Error('Image and crop type are required');
      }

      // Clean base64 string
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      
      // Validate base64 format
      if (!this.isValidBase64(cleanBase64)) {
        throw new Error('Invalid image format');
      }

      // For ML prediction, temporarily no auth required for development
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const response = await fetch(`${API_BASE_URL}/api/ml/predict`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          crop: cropType.toLowerCase(),
          imageBase64: cleanBase64
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Validate response structure
      if (!data.success || !data.mlResult) {
        throw new Error(data.message || 'Invalid response from AI service');
      }

      // Enhance result with additional metadata
      data.mlResult.processedAt = new Date().toISOString();
      data.mlResult.apiVersion = '2.1.0';
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Validate base64 string format
  isValidBase64(str) {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }

  async getDiseaseBreakdown() {
    return this.get('/dashboard/disease-breakdown', false);
  }

  async getDashboardSummary() {
    return this.get('/dashboard/summary', false);
  }

  async getHealthTrend() {
    return this.get('/dashboard/health-trend', false);
  }

  async getRecentDiagnoses() {
    return this.get('/dashboard/recent-diagnoses', false);
  }


}

export default new APIService();