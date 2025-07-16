import React, { useState, useEffect } from 'react';
import './theme.css';
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
    if (userString && userString !== "undefined") {
      try {
        const user = JSON.parse(userString);
        setLoginedUser(user);
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        localStorage.removeItem('user'); // Clear invalid data
      }
    } else {
      localStorage.removeItem('user'); // Clear "undefined" or null data
      setLoginedUser(null);
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    console.log('App loaded. loginedUser from localStorage:', user);
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
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Concert Tickets</Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {!isLoggedIn ? (
                <li className="nav-item">
                  <Link className="nav-link" to="/">Login</Link>
                </li>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={handleLogout}>Logout</Link>
                </li>
              )}
              {isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/booking">Booking</Link>
                  </li>
                </>
              )}
              {!isLoggedIn && (
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<LoginPage handleLogin={handleLogin} isLoggedIn={isLoggedIn} />} />
        <Route path="/dashboard" element={<DashboardPage handleLogout={handleLogout} />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/register" element={<RegisterPage isLoggedIn={isLoggedIn} />} />
      </Routes>
    </Router>
  );
}

export default App;