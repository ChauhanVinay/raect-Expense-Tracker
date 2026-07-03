import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Welcome from './components/Welcome';
import SignUp from './components/SignUp';
import UpdateProfile from './components/UpdateProfile'; 

function App() {
 

  return (
    <Router>
      <Routes>
   <Route path="/signup" element={<SignUp />} />
   <Route path="/login" element={<Login />} />
   <Route path="/welcome" element={<Welcome />} />
    <Route path="/update-profile" element={<UpdateProfile />} />
   {/* Redirect default path to Login */}
   <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App;
