import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase'; 
import './Login.css';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

const  handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        //store the token
        const token = await userCredential.user.getIdToken();
        localStorage.setItem('token', token);
        window.location.href = "/welcome"; // Redirect to the welcome page
    } catch (err) {
        alert("login failed: " + err.message);
        setError(err.message);
    }
}
    return (
      <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        
        <button type="submit">Login</button>
        <span className="forgot-link">Forgot password</span>
        
        <div className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </div>
      </form>
    </div>
    );
};

export default Login;