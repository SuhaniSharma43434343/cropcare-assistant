import React, { createContext, useContext, useState, useEffect } from 'react';

const DiseaseContext = createContext();

export const DiseaseProvider = ({ children }) => {
  const [recentDetections, setRecentDetections] = useState([]);
  const [latestDetection, setLatestDetection] = useState(null);

  // Load stored detections on mount
  useEffect(() => {
    const stored = localStorage.getItem('diseaseDetections');
    if (stored) {
      try {
        const detections = JSON.parse(stored);
        setRecentDetections(detections);
        if (detections.length > 0) {
          setLatestDetection(detections[0]);
        }
      } catch (error) {
        console.error('Error loading stored detections:', error);
      }
    }
  }, []);

  // Save detections to localStorage whenever they change
  useEffect(() => {
    if (recentDetections.length > 0) {
      localStorage.setItem('diseaseDetections', JSON.stringify(recentDetections));
    }
  }, [recentDetections]);

  const addDetection = (diagnosisResult, capturedImage) => {
    const detection = {
      id: Date.now(),
      name: diagnosisResult.name || 'Disease Detected',
      crop: diagnosisResult.analyzedCrop?.name || 'Unknown Crop',
      severity: diagnosisResult.severity || 'Medium',
      confidence: diagnosisResult.confidence || 0.75,
      date: new Date().toISOString(),
      treatment: diagnosisResult.treatment,
      symptoms: diagnosisResult.symptoms || [],
      description: diagnosisResult.description,
      image: capturedImage,
      status: 'detected'
    };

    setRecentDetections(prev => [detection, ...prev.slice(0, 9)]); // Keep last 10
    setLatestDetection(detection);
    
    // Trigger dashboard update event
    window.dispatchEvent(new CustomEvent('diseaseDetected', { 
      detail: detection 
    }));
    
    return detection;
  };

  const updateDetectionStatus = (id, status) => {
    setRecentDetections(prev => 
      prev.map(detection => 
        detection.id === id ? { ...detection, status } : detection
      )
    );
  };

  const getDetectionsByDisease = () => {
    const breakdown = {};
    recentDetections.forEach(detection => {
      const diseaseName = detection.name;
      breakdown[diseaseName] = (breakdown[diseaseName] || 0) + 1;
    });
    
    return Object.entries(breakdown).map(([name, count]) => ({
      name,
      count
    }));
  };

  const value = {
    recentDetections,
    latestDetection,
    addDetection,
    updateDetectionStatus,
    getDetectionsByDisease,
    hasDetections: recentDetections.length > 0
  };

  return (
    <DiseaseContext.Provider value={value}>
      {children}
    </DiseaseContext.Provider>
  );
};

export const useDisease = () => {
  const context = useContext(DiseaseContext);
  if (!context) {
    throw new Error('useDisease must be used within a DiseaseProvider');
  }
  return context;
};