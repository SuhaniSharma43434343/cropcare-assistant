import { useState, useCallback } from 'react';
import { Calculator, RotateCcw, Beaker } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

/**
 * DosageCalculator Component
 * Calculates chemical dosage based on land area and treatment specifications
 */
const DosageCalculator = ({ treatment, isOpen, onClose }) => {
  const [landArea, setLandArea] = useState('');
  const [areaUnit, setAreaUnit] = useState('acres');
  const [cropType, setCropType] = useState('');
  const [calculatedDosage, setCalculatedDosage] = useState(null);
  const [error, setError] = useState('');

  // Memoized handlers to prevent re-renders
  const handleAreaChange = useCallback((value) => {
    setLandArea(value);
    setError('');
    if (calculatedDosage) setCalculatedDosage(null);
  }, [calculatedDosage]);

  const handleUnitChange = useCallback((unit) => {
    setAreaUnit(unit);
    if (calculatedDosage) setCalculatedDosage(null);
  }, [calculatedDosage]);

  const handleCropChange = useCallback((crop) => {
    setCropType(crop);
    if (calculatedDosage) setCalculatedDosage(null);
  }, [calculatedDosage]);

  // Reset calculator
  const resetCalculator = useCallback(() => {
    setLandArea('');
    setCropType('');
    setCalculatedDosage(null);
    setError('');
  }, []);

  // Calculate dosage based on treatment and area
  const calculateDosage = useCallback(() => {
    if (!landArea || parseFloat(landArea) <= 0) {
      setError('Please enter a valid land area');
      return;
    }

    const area = parseFloat(landArea);
    const areaInAcres = areaUnit === 'hectares' ? area * 2.47105 : area;
    
    // Extract base dosage from treatment (e.g., "2-3 ml/L" -> 2.5)
    const dosageMatch = treatment.dosage.match(/(\d+(?:\.\d+)?)-?(\d+(?:\.\d+)?)?/);
    let baseDosage = 2.5; // Default fallback
    
    if (dosageMatch) {
      const min = parseFloat(dosageMatch[1]);
      const max = dosageMatch[2] ? parseFloat(dosageMatch[2]) : min;
      baseDosage = (min + max) / 2;
    }

    // Standard calculation: base dosage per liter * liters per acre * area
    const litersPerAcre = 200; // Standard spray volume
    const totalVolume = areaInAcres * litersPerAcre;
    const totalDosage = (baseDosage * totalVolume) / 1000; // Convert ml to liters

    // Crop-specific adjustments
    const cropMultiplier = getCropMultiplier(cropType);
    const finalDosage = totalDosage * cropMultiplier;

    setCalculatedDosage({
      chemical: finalDosage.toFixed(2),
      water: totalVolume.toFixed(0),
      unit: finalDosage >= 1 ? 'L' : 'ml',
      displayDosage: finalDosage >= 1 ? finalDosage.toFixed(2) : (finalDosage * 1000).toFixed(0)
    });
    setError('');
  }, [landArea, areaUnit, cropType, treatment.dosage]);

  // Get crop-specific multiplier
  const getCropMultiplier = (crop) => {
    const multipliers = {
      'tomato': 1.2,
      'potato': 1.1,
      'wheat': 0.9,
      'rice': 1.0,
      'cotton': 1.3,
      'corn': 1.0
    };
    return multipliers[crop.toLowerCase()] || 1.0;
  };

  if (!isOpen) return null;

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-blue-600" />
        <h4 className="font-semibold text-blue-900">Dosage Calculator</h4>
      </div>

      <div className="space-y-4">
        {/* Land Area Input */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Land Area *
            </label>
            <Input
              type="number"
              value={landArea}
              onChange={(e) => handleAreaChange(e.target.value)}
              placeholder="Enter area"
              min="0"
              step="0.1"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select
              value={areaUnit}
              onChange={(e) => handleUnitChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="acres">Acres</option>
              <option value="hectares">Hectares</option>
            </select>
          </div>
        </div>

        {/* Crop Type Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Crop Type (Optional)
          </label>
          <Input
            type="text"
            value={cropType}
            onChange={(e) => handleCropChange(e.target.value)}
            placeholder="e.g., Tomato, Wheat, Rice"
            className="w-full"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
            {error}
          </div>
        )}

        {/* Calculated Result */}
        {calculatedDosage && (
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Beaker className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-900">Calculated Dosage</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Chemical Required:</span>
                <div className="font-bold text-lg text-blue-600">
                  {calculatedDosage.displayDosage} {calculatedDosage.unit}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Water Required:</span>
                <div className="font-bold text-lg text-gray-900">
                  {calculatedDosage.water} L
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Based on {treatment.name} for {landArea} {areaUnit}
              {cropType && ` (${cropType})`}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={calculateDosage}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Calculate
          </Button>
          <Button
            onClick={resetCalculator}
            variant="outline"
            size="sm"
            className="border-gray-300"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-600"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DosageCalculator;