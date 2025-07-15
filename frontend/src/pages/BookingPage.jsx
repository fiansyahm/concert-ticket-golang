// src/pages/BookingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function BookingPage({ loginedUser, handleLogin }) {
  const [concerts, setConcerts] = useState([]);
  const [selectedConcert, setSelectedConcert] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [userBookings, setUserBookings] = useState([]);

  const navigate = useNavigate();

  // 🧠 Log user saat komponen di-render
  useEffect(() => {
    console.log('BookingPage loaded. loginedUser:', loginedUser);
  }, []);

  // ✅ Fetch all concerts
  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await fetch('http://localhost:8082/api/concerts');
        const data = await response.json();
        setConcerts(data);
      } catch (error) {
        console.error('Error fetching concerts:', error);
      }
    };
    fetchConcerts();
  }, []);

  // ✅ Fetch tickets based on selected concert
  useEffect(() => {
    if (selectedConcert) {
      const fetchTickets = async () => {
        try {
          const response = await fetch(`http://localhost:8082/api/tickets/concerts/${selectedConcert.id}`);
          const data = await response.json();
          setTickets(data);
        } catch (error) {
          console.error('Error fetching tickets:', error);
        }
      };
      fetchTickets();
    }
  }, [selectedConcert]);

  // ✅ Fetch user's bookings after login
  useEffect(() => {
    const fetchUserBookings = async () => {
      if (loginedUser && loginedUser.id) {
        console.log("Fetching bookings for user:", loginedUser.id);
        try {
          const response = await fetch(`http://localhost:8082/api/users/1/bookings`);
          if (response.ok) {
            const data = await response.json();
            setUserBookings(data);
          } else {
            console.error('Error fetching user bookings:', response.statusText);
            setUserBookings([]);
          }
        } catch (error) {
          console.error('Error fetching user bookings:', error);
          setUserBookings([]);
        }
      } else {
        setUserBookings([]); // Clear if user not logged in
      }
    };

    fetchUserBookings();
  }, [loginedUser]);

  // ✅ Booking function
  const handleBooking = async (e) => {
    e.preventDefault();

    if (!selectedConcert || !selectedTicket) {
      alert('Please select a concert and a ticket type.');
      return;
    }

    const user_id = loginedUser?.id;
    const ticket_id = selectedTicket.id;

    if (!user_id) {
      alert('User not logged in');
      return;
    }

    try {
      const response = await fetch('http://localhost:8082/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Tambahkan Authorization jika dibutuhkan:
          // 'Authorization': `Bearer ${loginedUser.token}`
        },
        body: JSON.stringify({ user_id, ticket_id, quantity }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Booked ${quantity} ${selectedTicket.type} tickets for ${selectedConcert.name}`);

        

        // ✅ Re-fetch bookings
        const updatedRes = await fetch(`http://localhost:8082/api/users/${user_id}/bookings`);
        const updatedData = await updatedRes.json();
        setUserBookings(updatedData);

        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Error during booking:', error);
      alert('An error occurred during booking. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Book Tickets</h2>
      <form onSubmit={handleBooking}>
        <div>
          <label>Select Concert:</label>
          <select onChange={(e) => setSelectedConcert(JSON.parse(e.target.value))}>
            <option value="">-- Select a Concert --</option>
            {concerts.map((concert) => (
              <option key={concert.id} value={JSON.stringify(concert)}>
                {concert.name} - {concert.venue} ({new Date(concert.date).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        {selectedConcert && (
          <>
            <h3>{selectedConcert.name} Details:</h3>
            <p>Venue: {selectedConcert.venue}</p>
            <p>Date: {new Date(selectedConcert.date).toLocaleDateString()}</p>

            <div>
              <label>Select Ticket Type:</label>
              <select onChange={(e) => setSelectedTicket(JSON.parse(e.target.value))}>
                <option value="">-- Select a Ticket Type --</option>
                {tickets.map((ticket) => (
                  <option key={ticket.id} value={JSON.stringify(ticket)}>
                    {ticket.type} - ${ticket.price} (Available: {ticket.available_tickets})
                  </option>
                ))}
              </select>
            </div>

            {selectedTicket && (
              <>
                <p>Price: ${selectedTicket.price}</p>
                <p>Available Tickets: {selectedTicket.available_tickets}</p>
                <div>
                  <label>Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedTicket.available_tickets}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                  />
                </div>
              </>
            )}
            <button type="submit">Confirm Booking</button>
          </>
        )}
      </form>

      {/* ✅ User Bookings Section */}
      <div style={{ marginTop: '40px' }}>
        <h2>Your Bookings</h2>
        {userBookings.length > 0 ? (
          <ul>
            {userBookings.map((booking) => (
              <li key={booking.id}>
                Booking ID: {booking.id} - Concert: {booking.concert_name} - Ticket: {booking.ticket_type} - Quantity: {booking.quantity} - Total: ${booking.total_price}
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings found for this user.</p>
        )}
      </div>
    </div>
  );
}

export default BookingPage;
