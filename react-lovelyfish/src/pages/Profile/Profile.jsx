// src/pages/Profile.jsx
import React from 'react';
import './Profile.css'

const Profile = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Welcome to your profile page!</h2>
      <p>This is a protected route. Only logged-in users can see this.</p>
    </div>
  );
};

export default Profile;
