import React, { useState } from "react";
import api from "../../../API/axios";
import "./FishOwnerForm.css";

function FishOwnerForm({ onAdded }) {
  const [formData, setFormData] = useState({
    UserName: "",
    Phone: "",
    Email: "",
    Location: "",
    FishName: "",
    IsContactPublic: false,
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
        UserName: "",
        Phone: "",
        Email: "",
        Location: "",
        FishName: "",
        IsContactPublic: false,
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
          name="UserName"
          value={formData.UserName}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Phone:
        <input
          type="text"
          name="Phone"
          value={formData.Phone}
          onChange={handleChange}
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          name="Email"
          value={formData.Email}
          onChange={handleChange}
        />
      </label>

      <label>
        Location:
        <input
          type="text"
          name="Location"
          value={formData.Location}
          onChange={handleChange}
        />
      </label>

      <label>
        Fish Name:
        <input
          type="text"
          name="FishName"
          value={formData.FishName}
          onChange={handleChange}
        />
      </label>

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="IsContactPublic"
          checked={formData.IsContactPublic}
          onChange={handleChange}
        />
        Make contact information public
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}

export default FishOwnerForm;
