import React, { useState } from 'react';
import { updateProfile } from "firebase/auth";
import { auth } from './firebase'; 
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Reusing your existing form styles

const UpdateProfile = () => {
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (auth.currentUser) {
        // Firebase API call to update user details
        await updateProfile(auth.currentUser, {
          displayName: displayName,
          photoURL: photoURL
        });
        
        alert("Profile Updated Successfully!");
        navigate('/welcome'); // Send them back to the welcome screen
      } else {
        setError("No user is logged in.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleUpdate}>
        <h2>Contact Details</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <input 
          type="text" 
          placeholder="Full Name" 
          value={displayName} 
          onChange={(e) => setDisplayName(e.target.value)} 
          required 
        />
        <input 
          type="url" 
          placeholder="Profile Photo URL" 
          value={photoURL} 
          onChange={(e) => setPhotoURL(e.target.value)} 
          required 
        />
        
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateProfile;