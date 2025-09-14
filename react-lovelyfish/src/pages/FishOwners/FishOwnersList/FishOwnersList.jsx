import React, { useCallback, useEffect, useState } from "react";
import api from "../../../API/axios";
import { useUser } from '../../../contexts/UserContext'
import "./FishOwnersList.css";

function FishOwnersList({ refresh }) {
  const { user, isAdmin, loading: userLoading } = useUser();
  const [owners, setOwners] = useState([]);
  const [ownersLoading, setOwnersLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // Currently Editing OwnerID
  const [editData, setEditData] = useState({});   // Edit Form Data

  // Fetch owners
  const fetchOwners = useCallback(async () => {
    setOwnersLoading(true);
    try {
      const res = await api.get("/FishOwners");
      setOwners(res.data);
    } catch (error) {
      console.error("Error fetching fish owners:", error);
    }
    setOwnersLoading(false);
  }, []);

  useEffect(() => {
    fetchOwners();
  }, [fetchOwners, refresh]); //Refetch data when refresh changes.

  //delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await api.delete(`/FishOwners/${id}`);
      fetchOwners(); // refresh data after deleting
    } catch (error) {
      console.error("Error deleting fish owner:", error);
    }
  };

  //edit info
  const startEdit = (owner) => {
    setEditingId(owner.ownerID);
    setEditData({
      userName: owner.userName,
      phone: owner.phone || "",
      email: owner.email || "",
      location: owner.location || "",
      fishName: owner.fishName || "",
      isContactPublic: owner.isContactPublic,
    });
  };

  //cancel editing 
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };


  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData({
      ...editData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submitEdit = async (id) => {
    try {
      await api.put(`/FishOwners/${id}`, { ...editData, ownerID: id });
      setEditingId(null);
      fetchOwners(); // refresh data after submitting
    } catch (error) {
      console.error("Error updating fish owner:", error);
    }
  };


  if (userLoading || ownersLoading) return <p>Loading...</p>;

  // Optional: hide page if not logged in
  // if (!user) return <p>Please log in to view fish owners.</p>;

  console.log("Current user:", user);
  console.log("Owner record:", owner);

  return (
    <div className="fish-owners-container">
      <h2 className="fish-owners-title">Fish Owners</h2>
      {owners.length === 0 ? (
        <p>No records found</p>
      ) : (
        <div className="fish-owners-grid">
          {owners.map((owner) => (
            <div key={owner.ownerID} className="fish-owner-card">
              {editingId === owner.ownerID ? (
                <>
                  <input
                    type="text"
                    name="userName"
                    value={editData.userName}
                    onChange={handleEditChange}
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={editData.phone}
                    onChange={handleEditChange}
                    placeholder="Phone"
                  />
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    name="location"
                    value={editData.location}
                    onChange={handleEditChange}
                    placeholder="Location"
                  />
                  <input
                    type="text"
                    name="fishName"
                    value={editData.fishName}
                    onChange={handleEditChange}
                    placeholder="Fish Name"
                  />
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isContactPublic"
                      checked={editData.isContactPublic}
                      onChange={handleEditChange}
                    />
                    Make contact info public
                  </label>
                  <div className="fish-owner-card-buttons">
                    <button onClick={() => submitEdit(owner.ownerID)}>Save</button>
                    <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
                  </div>
                </>
              ) : (
                <>

                  <h3 className="fish-owner-name">{owner.userName}</h3>
                  <p className="fish-owner-meta">
                    Location: {owner.location || "Not specified"}
                  </p>
                  <p className="fish-owner-meta">
                    Fish: {owner.fishName || "Not specified"}
                  </p>

                  <div className="fish-owner-contact">
                    <p>📞 {owner.isContactPublic ? owner.phone || "N/A" : "Hidden,contact seller"}</p>
                    <p>📧 {owner.isContactPublic ? owner.email || "N/A" : "Hidden,contact seller"}</p>
                  </div>

                  {/* Only admin and record owner can edit/delete  */}
                  {(isAdmin || user.id === owner.userId) && (
                    <div className="fish-owner-card-buttons">
                      <button onClick={() => startEdit(owner)}>Edit</button>
                      <button
                        onClick={() => handleDelete(owner.ownerID)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FishOwnersList;
