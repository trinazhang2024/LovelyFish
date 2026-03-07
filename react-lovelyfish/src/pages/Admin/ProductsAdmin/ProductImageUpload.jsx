import React, { useState, useRef, useEffect } from "react";
import api from "../../../API/axios";
import "./ProductImageUpload.css"; // External styles

/*
 ProductImageUpload Component
 Handles uploading and previewing multiple product images.
 Props:
   - imageUrls: array of image URLs
   - setImageUrls: function to update image URLs in parent component
 */
export default function ProductImageUpload({ imageUrls, setImageUrls }) {

  const UPLOADS_BASE_URL = process.env.REACT_APP_API_BASE_UPLOADS; // get from  .env 

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection and upload
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    setUploading(true);
    try {
      const res = await api.post("/Upload", formData);
      const uploadedFileUrls = res.data.map(item => item.fileUrl);

      // Remove duplicates + update state
      setImageUrls((prev) => [
        ...prev, 
        ...uploadedFileUrls.filter((url) => !prev.includes(url)),]);

      console.log("After upload, imageUrls:", [...imageUrls, ...uploadedFileUrls]);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    } finally {
      setUploading(false);

      //reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };


  // Remove image from the list
  const removeImage = async (index) => {
    const fileUrl = imageUrls[index];
  
    // Extract fileName from full URL
    const fileName = fileUrl.split("/").pop();
  
    try {
      // Call backend to delete file
      await api.delete(`/Upload/delete/${fileName}`);
  
      // Update local state
      setImageUrls(prev => {
        const newArr = [...prev];
        newArr.splice(index, 1);
        return newArr;
      });
  
      console.log("Deleted image:", fileName);
    } catch (err) {
      console.error("Failed to delete image:", err);
      alert("Failed to delete image from server");
    }
  };

  // Reset Input when parent clears inmages
  useEffect(()=> {
    if (imageUrls.length===0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [imageUrls]);

  return (
    <div className="upload-container">
      {/* File input */}
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleImageChange}
        disabled={uploading} />
      
      {/* Uploading indicator */}
      {uploading && <p className="uploading-text">Uploading...</p>}
      
      {/* Image preview list */}
      <div className="image-list">
        {Array.isArray(imageUrls) ? imageUrls.map((url, idx) => (
          <div key={idx} className="image-wrapper">
            <img
              src={url.startsWith("http") ? url : `${UPLOADS_BASE_URL}${url}`}
              alt={`Preview ${idx}`}
              className="preview-image" />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="remove-button"
            >
              ×
            </button>
          </div>
        )) : null}
      </div>
    </div>
  );
}
