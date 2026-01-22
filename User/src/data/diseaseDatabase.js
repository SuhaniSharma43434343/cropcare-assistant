export const INDIAN_CROP_DISEASES = [
  {
    "id": 1,
    "crop": "Rice",
    "cropHindi": "धान",
    "disease": "Blast Disease",
    "diseaseHindi": "ब्लास्ट रोग",
    "type": "Fungal",
    "severity": "High",
    "weatherRisk": "High humidity, moderate temperature",
    "earlySymptoms": ["Small brown spots on leaves", "Diamond-shaped lesions", "White centers with brown borders"],
    "advancedSymptoms": ["Neck blast", "Panicle blast", "Complete panicle death", "Yield loss up to 50%"],
    "causes": {
      "weather": "High humidity (>90%), temperature 25-28°C",
      "soil": "Nitrogen excess, poor drainage",
      "water": "Continuous flooding",
      "pest": "Magnaporthe oryzae fungus"
    },
    "prevention": {
      "seedTreatment": "Tricyclazole 75% WP @ 0.6g/kg seed",
      "cropRotation": "Rice-wheat-legume rotation",
      "fieldHygiene": "Remove infected stubble, balanced fertilization"
    },
    "treatment": {
      "organic": {
        "name": "Neem oil + Pseudomonas",
        "dosage": "5ml neem oil + 5g Pseudomonas per liter",
        "frequency": "Every 10 days"
      },
      "chemical": {
        "name": "Tricyclazole 75% WP",
        "dosage": "0.6g per liter",
        "frequency": "2-3 sprays at 15-day intervals"
      }
    },
    "bestTime": "Early morning or evening",
    "recoveryTime": "2-3 weeks",
    "expertConsult": "If >25% plants affected",
    "dos": ["Use resistant varieties", "Maintain proper spacing", "Apply silicon fertilizer"],
    "donts": ["Avoid excess nitrogen", "Don't spray during rain", "Avoid late planting"]
  },
  {
    "id": 2,
    "crop": "Rice",
    "cropHindi": "धान",
    "disease": "Brown Spot",
    "diseaseHindi": "भूरा धब्बा",
    "type": "Fungal",
    "severity": "Medium",
    "weatherRisk": "High humidity, nutrient deficiency",
    "earlySymptoms": ["Small brown spots on leaves", "Oval lesions with yellow halo"],
    "advancedSymptoms": ["Large brown patches", "Premature leaf death", "Poor grain filling"],
    "causes": {
      "weather": "High humidity, temperature 25-30°C",
      "soil": "Potassium deficiency, poor soil health",
      "water": "Water stress",
      "pest": "Bipolaris oryzae fungus"
    },
    "prevention": {
      "seedTreatment": "Carbendazim 50% WP @ 2g/kg seed",
      "cropRotation": "Include legumes",
      "fieldHygiene": "Balanced NPK fertilization"
    },
    "treatment": {
      "organic": {
        "name": "Copper oxychloride",
        "dosage": "3g per liter",
        "frequency": "Every 15 days"
      },
      "chemical": {
        "name": "Propiconazole 25% EC",
        "dosage": "1ml per liter",
        "frequency": "2 sprays at 15-day intervals"
      }
    },
    "bestTime": "Early morning",
    "recoveryTime": "2-3 weeks",
    "expertConsult": "If spreading rapidly",
    "dos": ["Apply potassium fertilizer", "Maintain field hygiene"],
    "donts": ["Avoid water stress", "Don't delay treatment"]
  },
  {
    "id": 3,
    "crop": "Wheat",
    "cropHindi": "गेहूं",
    "disease": "Rust Disease",
    "diseaseHindi": "रतुआ रोग",
    "type": "Fungal",
    "severity": "High",
    "weatherRisk": "Cool, humid weather",
    "earlySymptoms": ["Orange-red pustules on leaves", "Yellow streaks"],
    "advancedSymptoms": ["Severe leaf damage", "Reduced grain quality", "Yield loss"],
    "causes": {
      "weather": "Cool temperature 15-22°C, high humidity",
      "soil": "Any soil type",
      "water": "Excess moisture",
      "pest": "Puccinia species"
    },
    "prevention": {
      "seedTreatment": "Tebuconazole 2% DS @ 1.5g/kg seed",
      "cropRotation": "Avoid continuous wheat",
      "fieldHygiene": "Remove volunteer plants"
    },
    "treatment": {
      "organic": {
        "name": "Sulfur dust",
        "dosage": "25kg per hectare",
        "frequency": "2-3 applications"
      },
      "chemical": {
        "name": "Propiconazole 25% EC",
        "dosage": "500ml per hectare",
        "frequency": "2 sprays at 15-day intervals"
      }
    },
    "bestTime": "Early morning",
    "recoveryTime": "3-4 weeks",
    "expertConsult": "If disease spreads rapidly",
    "dos": ["Use resistant varieties", "Monitor weather"],
    "donts": ["Don't delay spraying", "Avoid overhead irrigation"]
  },
  {
    "id": 4,
    "crop": "Tomato",
    "cropHindi": "टमाटर",
    "disease": "Late Blight",
    "diseaseHindi": "पछेती अंगमारी",
    "type": "Fungal",
    "severity": "High",
    "weatherRisk": "Cool, wet conditions",
    "earlySymptoms": ["Water-soaked spots on leaves", "Brown lesions with white margins"],
    "advancedSymptoms": ["Rapid leaf death", "Fruit rot", "Plant collapse"],
    "causes": {
      "weather": "Cool temperature 15-20°C, high humidity",
      "soil": "Poor drainage",
      "water": "Overhead watering",
      "pest": "Phytophthora infestans"
    },
    "prevention": {
      "seedTreatment": "Metalaxyl + Mancozeb @ 2g/kg seed",
      "cropRotation": "3-year rotation",
      "fieldHygiene": "Remove infected debris"
    },
    "treatment": {
      "organic": {
        "name": "Copper fungicide",
        "dosage": "2-3g per liter",
        "frequency": "Every 7-10 days"
      },
      "chemical": {
        "name": "Mancozeb 75% WP",
        "dosage": "2.5g per liter",
        "frequency": "Every 7-10 days"
      }
    },
    "bestTime": "Early morning or evening",
    "recoveryTime": "2-3 weeks",
    "expertConsult": "If >20% plants affected",
    "dos": ["Improve air circulation", "Use drip irrigation"],
    "donts": ["Avoid overhead watering", "Don't work in wet fields"]
  },
  {
    "id": 5,
    "crop": "Cotton",
    "cropHindi": "कपास",
    "disease": "Bollworm",
    "diseaseHindi": "गुलाबी सुंडी",
    "type": "Pest",
    "severity": "High",
    "weatherRisk": "Warm, humid conditions",
    "earlySymptoms": ["Small holes in leaves", "Caterpillar presence"],
    "advancedSymptoms": ["Damaged bolls", "Reduced yield", "Pink larvae in bolls"],
    "causes": {
      "weather": "Temperature 25-35°C, moderate humidity",
      "soil": "Any soil type",
      "water": "Adequate moisture",
      "pest": "Pectinophora gossypiella"
    },
    "prevention": {
      "seedTreatment": "Imidacloprid 70% WS @ 5g/kg seed",
      "cropRotation": "Cotton-wheat-legume",
      "fieldHygiene": "Destroy crop residue"
    },
    "treatment": {
      "organic": {
        "name": "Bt spray + Neem oil",
        "dosage": "2ml Bt + 5ml neem per liter",
        "frequency": "Every 10-15 days"
      },
      "chemical": {
        "name": "Chlorpyrifos 20% EC",
        "dosage": "2ml per liter",
        "frequency": "2-3 sprays at 15-day intervals"
      }
    },
    "bestTime": "Evening",
    "recoveryTime": "1-2 weeks",
    "expertConsult": "If ETL crossed",
    "dos": ["Monitor regularly", "Use pheromone traps"],
    "donts": ["Don't spray during flowering", "Avoid repeated use of same insecticide"]
  }
];