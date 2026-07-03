import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from './firebase'; 

const Welcome = () => {
  // Check if user exists and if they have a displayName set
  const user = auth.currentUser;
  const isProfileComplete = user && user.displayName && user.photoURL;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Expense Tracker</h1>
      
      {/* Show this block ONLY if the profile is incomplete */}
      {!isProfileComplete && (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          padding: '15px', 
          borderRadius: '5px', 
          marginTop: '20px', 
          display: 'inline-block' 
        }}>
          <p style={{ color: '#856404', margin: '0 0 10px 0' }}>Your profile is incomplete.</p>
          <Link to="/update-profile">
            <button style={{ 
              padding: '8px 16px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Complete Profile
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Welcome;