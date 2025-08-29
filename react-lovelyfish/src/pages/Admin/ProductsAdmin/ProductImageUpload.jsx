// src/components/ProductImageUpload.jsx
import React, { useState } from "react";
import api from "../../../API/axios";

const IMAGE_BASE_URL = "https://localhost:7148/uploads/";

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
      // 返回 [{ fileName: "xxx.jpg" }]
      const uploadedFileNames = res.data.map(item => item.fileName);
      // ✅ 直接更新 imageUrls
      setImageUrls(prev => [...prev, ...uploadedFileNames]);

      console.log("上传后 imageUrls:", [...imageUrls, ...uploadedFileNames]);

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
    <div>
      <input type="file" multiple onChange={handleImageChange} disabled={uploading} />
      {uploading && <p>上传中...</p>}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        {Array.isArray(imageUrls) ? imageUrls.map((fileName, idx) => (
          <div key={idx} style={{ position: "relative" }}>
            <img
              src={IMAGE_BASE_URL + fileName}
              alt={`预览${idx}`}
              style={{ width: 80, height: 80, objectFit: "cover", border: "1px solid #ccc" }}
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              style={{ position: "absolute", top: 0, right: 0, background: "red", color: "#fff", border: "none", borderRadius: "50%", cursor: "pointer" }}
            >
              ×
            </button>
          </div>
        )) : null}
      </div>
    </div>
  );
}
