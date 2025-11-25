// FileUpload.jsx

import React, { useCallback, useState } from 'react';
// Assuming 'lucide-react' is installed for icons
import { Upload, AlertCircle } from 'lucide-react'; 

// IMPORTANT: Define MAX_FILE_SIZE_MB here or ensure it's imported
// For this clean JS example, we'll define a placeholder if the import is missing:
// import { MAX_FILE_SIZE_MB } from '../constants';
const MAX_FILE_SIZE_MB = 10; // Placeholder value for max size in MB

/**
 * FileUpload Component
 * A drag-and-drop enabled file uploader for PDF and TXT files.
 * @param {object} props
 * @param {function} props.onFileSelect - Callback function when a valid file is selected.
 */
const FileUpload = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateAndUpload = (file) => {
    setError(null);
    if (!file) return;

    const MAX_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    // Check size
    if (file.size > MAX_SIZE_BYTES) {
      setError(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    // Check type (PDF or Text)
    if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
      setError("Only PDF and TXT files are supported.");
      return;
    }

    // Success: Pass file up to parent component
    onFileSelect(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div 
        className={`relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-2xl transition-all duration-200 ease-in-out cursor-pointer
          ${dragActive ? 'border-academic-500 bg-academic-50' : 'border-slate-300 bg-white hover:bg-slate-50'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          // Note: `accept` attribute helps the native file picker filter files
          accept=".pdf,.txt"
        />
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <div className="p-4 bg-academic-50 rounded-full mb-4">
            <Upload className="w-10 h-10 text-academic-500" />
          </div>
          <p className="mb-2 text-xl font-semibold text-slate-700">
            Upload your Research Paper
          </p>
          <p className="mb-2 text-sm text-slate-500">
            Drag and drop or click to browse
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Supported formats: PDF, TXT (Max {MAX_FILE_SIZE_MB}MB)
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;