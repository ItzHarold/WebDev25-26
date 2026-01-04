import React from "react";

interface ImageUploadFormProps {
  label: string;
  imageUrl?: string | null;
  onFileChange: (file: File | null) => void;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ label, onFileChange }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <input
      className="form-input"
      type="file"
      accept="image/*"
      onChange={e => onFileChange(e.target.files?.[0] || null)}
    />
  </div>
);

export default ImageUploadForm;