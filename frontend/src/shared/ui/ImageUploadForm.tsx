import React from "react";

interface ImageUploadFormProps {
  label: string;
  imageUrl?: string | null;
  onFileChange: (file: File | null) => void;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ label, imageUrl, onFileChange }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <input
      className="form-input"
      type="file"
      accept="image/*"
      onChange={e => onFileChange(e.target.files?.[0] || null)}
    />
    {imageUrl && (
      <div style={{ marginTop: 8 }}>
        <img src={imageUrl} alt="Preview" style={{ maxWidth: 120, maxHeight: 80, borderRadius: 4 }} />
      </div>
    )}
  </div>
);

export default ImageUploadForm;