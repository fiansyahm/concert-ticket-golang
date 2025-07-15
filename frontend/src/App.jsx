import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BookingPage from './pages/BookingPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginedUser, setLoginedUser] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      try {
        const user = JSON.parse(userString);
        setLoginedUser(user);
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        localStorage.removeItem('user'); // Clear invalid data
      }
    }
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setLoginedUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setLoginedUser(null);
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <nav style={{ padding: '10px', background: '#f0f0f0' }}>
        {!isLoggedIn ? (
          <Link to="/">Login</Link>
        ) : (
          <Link to="/" onClick={handleLogout}>Logout</Link>
        )}
        {isLoggedIn && (
          <>
            {' '}| <Link to="/dashboard">Dashboard</Link>
            {' '}| <Link to="/booking">Booking</Link>
          </>
        )}
        {!isLoggedIn && (
          <>
            {' '}| <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<LoginPage handleLogin={handleLogin} isLoggedIn={isLoggedIn} />} />
        <Route path="/dashboard" element={<DashboardPage handleLogout={handleLogout} loginedUser={loginedUser} />} />
        <Route path="/booking" element={<BookingPage loginedUser={loginedUser} />} />
        <Route path="/register" element={<RegisterPage isLoggedIn={isLoggedIn} />} />
      </Routes>
    </Router>
  );
}

export default App;