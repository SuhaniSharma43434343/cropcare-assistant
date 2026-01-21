// Data cleanup service - now only validates ML service responses
class DataCleanupService {
  
  // Clean up session storage data - only validate ML service responses
  static cleanupSessionStorage() {
    try {
      const diagnosisResult = sessionStorage.getItem('diagnosisResult');
      if (diagnosisResult) {
        const data = JSON.parse(diagnosisResult);
        const cleanedData = this.validateMLResponse(data);
        if (cleanedData) {
          sessionStorage.setItem('diagnosisResult', JSON.stringify(cleanedData));
        } else {
          sessionStorage.removeItem('diagnosisResult');
        }
      }
    } catch (error) {
      console.warn('Error cleaning session storage:', error);
      sessionStorage.removeItem('diagnosisResult');
    }
  }

  // Validate ML service response structure only
  static validateDiagnosisData(data) {
    console.log('Validating diagnosis data:', data);
    if (!data || typeof data !== 'object') {
      console.warn('Invalid ML response structure:', data);
      return null;
    }

    // Only validate that required fields exist from ML service
    const requiredFields = ['name', 'confidence', 'treatment'];
    const hasRequiredFields = requiredFields.every(field => data.hasOwnProperty(field));
    
    if (!hasRequiredFields) {
      console.warn('ML response missing required fields:', data);
      return null;
    }

    // Return data as-is from ML service (no modification)
    console.log('Validation successful, returning:', data);
    return data;
  }

  // Validate confidence value from ML service
  static validateConfidence(confidence) {
    if (typeof confidence === 'number') {
      if (confidence <= 1) return confidence;
      if (confidence <= 100) return confidence / 100;
    }
    return null; // Don't provide fallback - ML service should handle this
  }

  // Clean up local storage data
  static cleanupLocalStorage() {
    try {
      // Remove any cached non-ML data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('diagnosis_') || key.startsWith('treatment_') || key.startsWith('crop_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Error cleaning local storage:', error);
    }
  }

  // Initialize cleanup on app start
  static initialize() {
    this.cleanupSessionStorage();
    this.cleanupLocalStorage();
    console.log('Data cleanup completed - only ML service data retained');
  }
}

export default DataCleanupService;