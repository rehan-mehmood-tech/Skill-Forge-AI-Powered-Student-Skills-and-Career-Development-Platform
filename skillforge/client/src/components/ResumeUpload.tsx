import React, { useState, useRef } from 'react';
import { getAuthToken } from '../lib/auth';

interface ResumeUploadProps {
  onUploadSuccess?: (data: any) => void;
}

export default function ResumeUpload({ onUploadSuccess }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:5000/api';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    if (selectedFile.type !== 'application/pdf') {
      setError("Please upload a valid PDF file.");
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error("Authentication required. Please sign in.");
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_GATEWAY_URL}/ai/upload-cv`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || "Failed to process resume");
      }

      const data = await response.json();
      setResult(data);
      if (onUploadSuccess) onUploadSuccess(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-surface border border-border rounded-xl">
      <h3 className="font-sans font-semibold text-[18px] text-text-primary mb-2">Upload your Resume</h3>
      <p className="font-sans text-[13px] text-text-muted mb-4">
        We'll analyze your PDF resume to instantly extract your skills and experience.
      </p>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-accent bg-accent/10' : 'border-border bg-surface-hover'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf"
          className="hidden"
        />
        
        {file ? (
          <div className="flex flex-col items-center">
            <svg className="w-8 h-8 text-accent mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm font-medium text-text-primary">{file.name}</p>
            <p className="text-xs text-text-muted mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <div className="flex flex-col items-center cursor-pointer">
            <svg className="w-8 h-8 text-text-muted mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm font-medium text-text-primary">Click or drag PDF here to upload</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-sm font-medium text-green-500 mb-2">Resume parsed successfully!</p>
          <div className="flex flex-wrap gap-2">
            {result.extracted_skills?.map((skill: string, i: number) => (
              <span key={i} className="px-2 py-1 bg-surface border border-border rounded text-xs text-text-secondary">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="btn-cta mt-4 w-full h-10 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isUploading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Parsing Resume...
          </span>
        ) : (
          "Analyze Resume"
        )}
      </button>
    </div>
  );
}
