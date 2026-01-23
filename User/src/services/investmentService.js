const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

class InvestmentService {
  // Farmer APIs
  async createFarmerRequest(requestData, token) {
    const response = await fetch(`${API_URL}/api/investment/farmer/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestData)
    });
    return response.json();
  }

  async getMyRequests(token) {
    const response = await fetch(`${API_URL}/api/investment/farmer/my-requests`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }

  async getMyInterests(token) {
    const response = await fetch(`${API_URL}/api/investment/farmer/interests`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }

  async updateInterestStatus(interestId, status, token) {
    const response = await fetch(`${API_URL}/api/investment/farmer/interest-status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ interestId, status })
    });
    return response.json();
  }

  // Public APIs
  async getFarmerRequests(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) queryParams.append(key, filters[key]);
    });
    
    const response = await fetch(`${API_URL}/api/investment/opportunities?${queryParams}`);
    return response.json();
  }

  // Investor APIs
  async expressInterest(farmerRequestId, message = '', token) {
    const response = await fetch(`${API_URL}/api/investment/investor/interest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ farmerRequestId, message })
    });
    return response.json();
  }

  // Investor Auth APIs
  async registerInvestor(investorData) {
    const response = await fetch(`${API_URL}/api/investor-auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(investorData)
    });
    return response.json();
  }

  async loginInvestor(credentials) {
    const response = await fetch(`${API_URL}/api/investor-auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    return response.json();
  }

  async getInvestorProfile(token) {
    const response = await fetch(`${API_URL}/api/investor-auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }
}

export default new InvestmentService();