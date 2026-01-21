import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';

const ImageUploadTest = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.type, file.size);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        console.log('File read successfully, data length:', result?.length);
        setUploadedImage(result);
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Image Upload Test</h3>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <Button onClick={() => fileInputRef.current?.click()}>
        Select Image
      </Button>
      
      {uploadedImage && (
        <div className="mt-4">
          <p className="text-sm text-green-600 mb-2">✅ Image uploaded successfully!</p>
          <img 
            src={uploadedImage} 
            alt="Uploaded" 
            className="max-w-xs max-h-48 object-cover rounded-lg border"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploadTest;