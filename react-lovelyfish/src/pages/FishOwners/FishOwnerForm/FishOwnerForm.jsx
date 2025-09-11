import React, { useState } from "react";
import api from "../../../API/axios";
import "./FishOwnerForm.css";

function FishOwnerForm({ onAdded }) {
  const [formData, setFormData] = useState({
    userName: "",
    phone: "",
    email: "",
    location: "",
    fishName: "",
    isContactPublic: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Sending to API:", formData);

    try {
      await api.post("/FishOwners", formData);
      alert("Fish owner added successfully!");
      setFormData({
        userName: "",
        phone: "",
        email: "",
        location: "",
        fishName: "",
        isContactPublic: false,
      });
      if (onAdded) onAdded(); // refresh list if needed
    } catch (error) {
      console.error("Error adding fish owner:", error);
      alert("Failed to add fish owner.");
    }
  };

  return (
    <form className="fish-owner-form" onSubmit={handleSubmit}>
      <h2>Add Fish Owner Info</h2>

      <label>
        Name:
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Phone:
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>

      <label>
        Location:
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </label>

      <label>
        Fish Name:
        <input
          type="text"
          name="fishName"
          value={formData.fishName}
          onChange={handleChange}
        />
      </label>

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="isContactPublic"
          checked={formData.isContactPublic}
          onChange={handleChange}
        />
        Make contact information public
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}

export default FishOwnerForm;
