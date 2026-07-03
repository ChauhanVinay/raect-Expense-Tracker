import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_KEY = "AIzaSyCONfqWrXYm2ZF4goNOeAzquBy-lidEx8U";

const UpdateProfile = () => {
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch profile details when page loads
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idToken: token,
            }),
          }
        );

        const data = await response.json();

        if (data.users && data.users.length > 0) {
          setDisplayName(data.users[0].displayName || "");
          setPhotoURL(data.users[0].photoUrl || "");
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  // Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: token,
            displayName: displayName,
            photoUrl: photoURL,
            returnSecureToken: true,
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (data.error) {
        throw new Error(data.error.message);
      }

      alert("Profile Updated Successfully!");
      navigate("/welcome");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleUpdate}>
        <h2>Contact Details</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

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