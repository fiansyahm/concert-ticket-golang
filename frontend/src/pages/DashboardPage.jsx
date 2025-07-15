// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function DashboardPage({ handleLogout, loginedUser }) {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div style={{ padding: '20px' }}>
      <h2>Dashboard</h2>
      <p>Welcome to the Concert Ticket Booking System!</p>
      <nav>
        <ul>
          <li><Link to="/booking">Book Tickets</Link></li>
          {/* Add more navigation links as needed */}
        </ul>
      </nav>

      <h3>Available Concerts</h3>
      {loading && <p>Loading concerts...</p>}
      {error && <p>Error loading concerts: {error.message}</p>}
      {!loading && concerts.length === 0 && <p>No concerts available.</p>}
      {!loading && concerts.length > 0 && (
        <ul>
          {concerts.map((concert) => (
            <li key={concert.id}>
              <strong>{concert.name}</strong> - {concert.venue} ({new Date(concert.date).toLocaleDateString()})
              <br />
              Total Tickets: {concert.total_tickets}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DashboardPage;
