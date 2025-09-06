import React, { useState, useEffect } from "react";
import api from "../../API/axios";
import { useUser } from "../../contexts/UserContext";
import "./Profile.css";

export default function ProfilePage() {
  const { user, logout, updateUser } = useUser(); // Get user info & actions from context

  // Control visibility of Change Password form
  const [showChangePwdForm, setShowChangePwdForm] = useState(false);

  // Password-related state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changePwdMessage, setChangePwdMessage] = useState(null);
  const [changePwdError, setChangePwdError] = useState(null);
  const [loadingChangePwd, setLoadingChangePwd] = useState(false);

  // Profile form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileMessage, setProfileMessage] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Initialize form with user info
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  // Auto-hide success/error alerts after 3 seconds
  useEffect(() => {
    if (changePwdMessage || changePwdError || profileMessage || profileError) {
      const timer = setTimeout(() => {
        setChangePwdMessage(null);
        setChangePwdError(null);
        setProfileMessage(null);
        setProfileError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [changePwdMessage, changePwdError, profileMessage, profileError]);

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePwdMessage(null);
    setChangePwdError(null);

    // Check new password and confirmation
    if (newPassword !== confirmNewPassword) {
      setChangePwdError("New password and confirmation do not match");
      return;
    }

    // Password complexity: min 8 chars, uppercase, lowercase, number, special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setChangePwdError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      );
      return;
    }

    setLoadingChangePwd(true);
    try {
      await api.post("/account/change-password", {
        oldPassword,
        newPassword,
      });
      setChangePwdMessage("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowChangePwdForm(false);
    } catch (err) {
      setChangePwdError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoadingChangePwd(false);
    }
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileError(null);

    if (!name || !phone || !address) {
      setProfileError("Name, phone, and address cannot be empty");
      return;
    }

    setLoadingProfile(true);
    try {
      await api.post("/account/update-profile", { name, phone, address });
      setProfileMessage("Profile updated successfully");
      updateUser(); // Refresh UserContext immediately
    } catch (err) {
      setProfileError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>

      <div className="profile-info">
        {/* Profile Update Form */}
        <form
          onSubmit={handleUpdateProfile}
          className="profile-form"
          autoComplete="off"
        >
          {profileMessage && (
            <div className="alert alert-success">{profileMessage}</div>
          )}
          {profileError && (
            <div className="alert alert-danger">{profileError}</div>
          )}

          {/* Email (read-only) */}
          <div className="profile-field">
            <p>
              <strong>Email:</strong> {user?.email || "Loading..."}
            </p>
          </div>

          {/* Editable fields */}
          <div className="profile-field">
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="profile-field">
            <label>Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="profile-field">
            <label>Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loadingProfile}>
            {loadingProfile ? "Saving..." : "Save Profile"}
          </button>
        </form>

        {/* Change Password Section */}
        <section className="change-password-section">
          <button
            className="toggle-password-btn"
            onClick={() => setShowChangePwdForm(!showChangePwdForm)}
          >
            {showChangePwdForm ? "Cancel Change Password" : "Change Password"}
          </button>

          {/* Password messages */}
          {changePwdMessage && (
            <div className="alert alert-success mt-3">{changePwdMessage}</div>
          )}
          {changePwdError && (
            <div className="alert alert-danger mt-3">{changePwdError}</div>
          )}

          {/* Change Password Form */}
          {showChangePwdForm && (
            <form
              onSubmit={handleChangePassword}
              className="change-password-form"
              autoComplete="off"
            >
              <div className="password-requirements">
                Password must be at least 8 characters, include uppercase, lowercase, number, and special character
              </div>
              <input
                type="password"
                placeholder="Current Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
              <button
                className="change-password-button"
                type="submit"
                disabled={loadingChangePwd}
              >
                {loadingChangePwd ? "Submitting..." : "Submit Change"}
              </button>
            </form>
          )}
        </section>
      </div>

      {/* Logout Button */}
      <button className="logout-button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

/* Notes:
- Email is read-only and cannot be changed.
- Name, phone, and address are editable.
- "Save Profile" posts to /account/update-profile and updates UserContext.
- Change password requires old password and validates new password complexity.
- Alerts auto-hide after 3 seconds.
*/
