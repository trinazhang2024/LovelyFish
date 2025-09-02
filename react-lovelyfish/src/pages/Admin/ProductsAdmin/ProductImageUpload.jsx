import React, { useState } from "react";
import api from "../../../API/axios";
import "./ProductImageUpload.css"; // 引入外部样式

export default function ProductImageUpload({ imageUrls, setImageUrls }) {
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    setUploading(true);
    try {
      const res = await api.post("/Upload", formData);
      const uploadedFileUrls = res.data.map(item => item.fileUrl);
      setImageUrls(prev => [...prev, ...uploadedFileUrls]);

      console.log("上传后 imageUrls:", [...imageUrls, ...uploadedFileUrls]);
    } catch (err) {
      console.error("上传失败", err);
      alert("上传失败");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImageUrls(prev => {
      const newArr = [...prev];
      newArr.splice(index, 1);
      return newArr;
    });
  };

  return (
    <div className="upload-container">
      <input type="file" multiple onChange={handleImageChange} disabled={uploading} />
      {uploading && <p className="uploading-text">上传中...</p>}
      <div className="image-list">
        {Array.isArray(imageUrls) ? imageUrls.map((url, idx) => (
          <div key={idx} className="image-wrapper">
            <img src={url} alt={`预览${idx}`} className="preview-image" />
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
