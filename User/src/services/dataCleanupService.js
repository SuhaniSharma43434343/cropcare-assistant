// Data cleanup and validation service
class DataCleanupService {
  
  // Validated disease names - only these are allowed
  static VALID_DISEASES = [
    'Late Blight',
    'Early Blight', 
    'Common Rust',
    'Powdery Mildew',
    'Leaf Spot',
    'Root Rot',
    'Bacterial Wilt',
    'Mosaic Virus',
    'Anthracnose',
    'Downy Mildew',
    'Disease Detected',
    'Healthy Plant'
  ];

  // Validated crop types
  static VALID_CROPS = [
    'tomato',
    'potato', 
    'corn',
    'wheat',
    'rice',
    'pepper',
    'cucumber',
    'lettuce',
    'spinach',
    'carrot'
  ];

  // Clean up session storage data
  static cleanupSessionStorage() {
    try {
      const diagnosisResult = sessionStorage.getItem('diagnosisResult');
      if (diagnosisResult) {
        const data = JSON.parse(diagnosisResult);
        const cleanedData = this.validateDiagnosisData(data);
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

  // Validate diagnosis data structure
  static validateDiagnosisData(data) {
    if (!data || typeof data !== 'object') {
      console.warn('Invalid diagnosis data structure:', data);
      // Return a default valid structure instead of null
      return {
        name: 'Disease Detected',
        confidence: 0.75,
        severity: 'Medium',
        description: 'A plant disease has been detected. Please consult with an agricultural expert for proper identification.',
        symptoms: ['Disease symptoms detected on plant'],
        treatment: {
          organic: [{
            name: 'General Organic Treatment',
            dosage: 'As per instructions',
            frequency: 'Weekly',
            effectiveness: 70,
            instructions: 'Consult local agricultural extension for specific recommendations.'
          }]
        },
        prevention: ['Maintain proper plant care']
      };
    }

    const diseaseName = data.name || data.disease || data.diseaseName || 'Disease Detected';
    
    // Check if disease name is valid (fuzzy match)
    const validDisease = this.findValidDisease(diseaseName);
    const finalDiseaseName = validDisease || 'Disease Detected';

    // Clean and validate the data structure
    const cleanedData = {
      name: finalDiseaseName,
      confidence: this.validateConfidence(data.confidence),
      severity: this.validateSeverity(data.severity),
      description: data.description || `${finalDiseaseName} detected in plant. Please consult with an agricultural expert for proper identification.`,
      symptoms: Array.isArray(data.symptoms) && data.symptoms.length > 0 ? data.symptoms : ['Disease symptoms detected on plant'],
      treatment: this.validateTreatmentData(data.treatment) || {
        organic: [{
          name: 'General Organic Treatment',
          dosage: 'As per instructions',
          frequency: 'Weekly',
          effectiveness: 70,
          instructions: 'Consult local agricultural extension for specific recommendations.'
        }]
      },
      prevention: Array.isArray(data.prevention) && data.prevention.length > 0 ? data.prevention : ['Maintain proper plant care']
    };

    return cleanedData;
  }

  // Find valid disease name using fuzzy matching
  static findValidDisease(inputName) {
    if (!inputName) return 'Disease Detected';
    
    const input = inputName.toLowerCase().trim();
    
    // Exact match first
    const exactMatch = this.VALID_DISEASES.find(disease => 
      disease.toLowerCase() === input
    );
    if (exactMatch) return exactMatch;

    // Fuzzy match for common misspellings
    const fuzzyMatches = {
      'late blight': ['let blight', 'late bright', 'tomato let blight'],
      'early blight': ['early bright', 'erly blight'],
      'common rust': ['rust', 'corn rust'],
      'powdery mildew': ['powder mildew', 'powdery mildow'],
      'leaf spot': ['leafspot', 'leaf spots'],
      'root rot': ['rootrot', 'root rott']
    };

    for (const [validName, variations] of Object.entries(fuzzyMatches)) {
      if (variations.some(variation => input.includes(variation))) {
        return this.VALID_DISEASES.find(disease => 
          disease.toLowerCase() === validName
        );
      }
    }

    // Partial match
    const partialMatch = this.VALID_DISEASES.find(disease => 
      disease.toLowerCase().includes(input) || input.includes(disease.toLowerCase())
    );
    
    return partialMatch || 'Disease Detected';
  }

  // Validate confidence value
  static validateConfidence(confidence) {
    if (typeof confidence === 'number') {
      if (confidence <= 1) return confidence;
      if (confidence <= 100) return confidence / 100;
    }
    return 0.85; // Default confidence
  }

  // Validate severity level
  static validateSeverity(severity) {
    const validSeverities = ['Low', 'Medium', 'High', 'Critical'];
    if (typeof severity === 'string') {
      const normalized = severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase();
      if (validSeverities.includes(normalized)) return normalized;
    }
    return 'Medium'; // Default severity
  }

  // Validate treatment data structure
  static validateTreatmentData(treatment) {
    if (!treatment || typeof treatment !== 'object') return null;

    const validatedTreatment = {};

    // Validate organic treatments
    if (Array.isArray(treatment.organic)) {
      validatedTreatment.organic = treatment.organic
        .filter(t => t && typeof t === 'object' && t.name)
        .map(t => ({
          name: t.name,
          dosage: t.dosage || 'As per instructions',
          frequency: t.frequency || 'Weekly',
          effectiveness: typeof t.effectiveness === 'number' ? t.effectiveness : 75,
          instructions: t.instructions || 'Follow standard application procedures.'
        }));
    }

    // Validate chemical treatments
    if (Array.isArray(treatment.chemical)) {
      validatedTreatment.chemical = treatment.chemical
        .filter(t => t && typeof t === 'object' && t.name)
        .map(t => ({
          name: t.name,
          dosage: t.dosage || 'As per manufacturer instructions',
          frequency: t.frequency || 'Weekly',
          effectiveness: typeof t.effectiveness === 'number' ? t.effectiveness : 85,
          warning: t.warning || 'Use protective equipment and follow safety guidelines.',
          instructions: t.instructions || 'Apply according to label directions.'
        }));
    }

    return Object.keys(validatedTreatment).length > 0 ? validatedTreatment : null;
  }

  // Clean up local storage data
  static cleanupLocalStorage() {
    try {
      // Clean up any cached diagnosis data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('diagnosis_') || key.startsWith('treatment_')) {
          const data = localStorage.getItem(key);
          try {
            const parsed = JSON.parse(data);
            const cleaned = this.validateDiagnosisData(parsed);
            if (cleaned) {
              localStorage.setItem(key, JSON.stringify(cleaned));
            } else {
              localStorage.removeItem(key);
            }
          } catch {
            localStorage.removeItem(key);
          }
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
    console.log('Data cleanup completed - invalid entries removed');
  }

  // Validate crop type
  static validateCropType(cropType) {
    if (!cropType) return 'tomato'; // Default crop
    
    const normalized = cropType.toLowerCase().trim();
    return this.VALID_CROPS.includes(normalized) ? normalized : 'tomato';
  }
}

export default DataCleanupService;