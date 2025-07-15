// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function DashboardPage({ handleLogout }) {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loginedUser, setLoginedUser] = useState(null); // New state for loginedUser

  // Load user from localStorage on component mount
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString && userString !== "undefined") {
      try {
        const user = JSON.parse(userString);
        setLoginedUser(user);
        console.log('DashboardPage loaded. loginedUser from localStorage:', user);
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        localStorage.removeItem('user'); // Clear invalid data
      }
    } else {
      localStorage.removeItem('user'); // Clear "undefined" or null data
      setLoginedUser(null);
    }
  }, []);

  // ✅ Fetch all concerts
  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/concerts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response Data:', data); // Log the data for debugging
        if (Array.isArray(data)) {
          setConcerts(data);
        } else {
          throw new Error('API response is not an array');
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchConcerts();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Dashboard</h2>
      <p className="lead">Welcome to the Concert Ticket Booking System!</p>

      <div className="card mb-4">
        <div className="card-header">
          Navigation
        </div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><Link to="/booking" className="btn btn-primary">Book Tickets</Link></li>
            {/* Add more navigation links as needed */}
          </ul>
        </div>
      </div>

      <h3>Available Concerts</h3>
      {loading && <p>Loading concerts...</p>}
      {error && <p className="text-danger">Error loading concerts: {error.message}</p>}
      {!loading && concerts.length === 0 && <p>No concerts available.</p>}
      {!loading && concerts.length > 0 && (
        <div className="row">
          {concerts.map((concert) => (
            <div key={concert.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{concert.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{concert.venue}</h6>
                  <p className="card-text">Date: {new Date(concert.date).toLocaleDateString()}</p>
                  <p className="card-text">Total Tickets: {concert.total_tickets}</p>
                  {/* You can add a button to book tickets for this concert here if needed */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;