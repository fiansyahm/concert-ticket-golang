// src/pages/BookingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function BookingPage() {
  const [concerts, setConcerts] = useState([]);
  const [selectedConcert, setSelectedConcert] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [listTickets, setListTickets] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [userBookings, setUserBookings] = useState([]);
  const [payments, setPayments] = useState([]); // New state for payments
  const [loginedUser, setLoginedUser] = useState(null); // New state for loginedUser

  const navigate = useNavigate();

  // Load user from localStorage on component mount
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString && userString !== "undefined") {
      try {
        const user = JSON.parse(userString);
        setLoginedUser(user);
        console.log('BookingPage loaded. loginedUser from localStorage:', user);
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
        const data = await response.json();
        setConcerts(data);
      } catch (error) {
        console.error('Error fetching concerts:', error);
      }
    };
    fetchConcerts();
  }, []);

    // ✅ Fetch all tickets for listTickets
  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        const response = await fetch(`http://localhost:8082/api/tickets`);
        const data = await response.json();
        setListTickets(data);
      } catch (error) {
        console.error('Error fetching all tickets:', error);
      }
    };
    fetchAllTickets();
  }, []);

  // ✅ Fetch all payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`http://localhost:8083/api/payments`);
        const data = await response.json();
        setPayments(data);
        console.log('Fetched payments:', data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };
    fetchPayments();
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
          const response = await fetch(`http://localhost:8082/api/users/${loginedUser.id}/bookings`);
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

  // ✅ Payment function
  const handlePayment = async (booking) => {
    const ticket = listTickets.find(t => t.id === booking.ticket_id);
    if (!ticket) {
      alert('Ticket information not found for this booking.');
      return;
    }

    const amount = ticket.price * booking.quantity;

    try {
      const response = await fetch('http://localhost:8083/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: booking.id,
          amount: amount,
        }),
      });

      if (response.ok) {
        alert('Payment successful!');
        // Re-fetch bookings and payments to update UI
        const user_id = loginedUser?.id;
        if (user_id) {
          const updatedBookingsRes = await fetch(`http://localhost:8082/api/users/${user_id}/bookings`);
          const updatedBookingsData = await updatedBookingsRes.json();
          setUserBookings(updatedBookingsData);
        }
        const updatedPaymentsRes = await fetch(`http://localhost:8083/api/payments`);
        const updatedPaymentsData = await updatedPaymentsRes.json();
        setPayments(updatedPaymentsData);

      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Error during payment:', error);
      alert('An error occurred during payment. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Book Tickets</h2>
      <form onSubmit={handleBooking}>
        <div className="mb-3">
          <label htmlFor="concertSelect" className="form-label">Select Concert:</label>
          <select
            id="concertSelect"
            className="form-select"
            onChange={(e) => setSelectedConcert(JSON.parse(e.target.value))}
          >
            <option value="">-- Select a Concert --</option>
            {concerts.map((concert) => (
              <option key={concert.id} value={JSON.stringify(concert)}>
                {concert.name} - {concert.venue} ({new Date(concert.date).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        {selectedConcert && (
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title">{selectedConcert.name} Details:</h3>
              <p className="card-text">Venue: {selectedConcert.venue}</p>
              <p className="card-text">Date: {new Date(selectedConcert.date).toLocaleDateString()}</p>

              <div className="mb-3">
                <label htmlFor="ticketSelect" className="form-label">Select Ticket Type:</label>
                <select
                  id="ticketSelect"
                  className="form-select"
                  onChange={(e) => setSelectedTicket(JSON.parse(e.target.value))}
                >
                  <option value="">-- Select a Ticket Type --</option>
                  {tickets.map((ticket) => (
                    <option key={ticket.id} value={JSON.stringify(ticket)}>
                      {ticket.type} - Rp.{ticket.price}
                    </option>
                  ))}
                </select>
              </div>

              {selectedTicket && (
                <>
                  <p className="card-text">Price: Rp.{selectedTicket.price}</p>
                  <p className="card-text">Available Tickets: {selectedTicket.available_tickets}</p>
                  <div className="mb-3">
                    <label htmlFor="quantityInput" className="form-label">Quantity:</label>
                    <input
                      type="number"
                      id="quantityInput"
                      className="form-control"
                      min="1"
                      max={selectedTicket.available_tickets}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                    />
                  </div>
                </>
              )}
              <button type="submit" className="btn btn-primary">Confirm Booking</button>
            </div>
          </div>
        )}
      </form>

      <div className="mt-5">
        <h2>Your Bookings</h2>
        {userBookings.length > 0 ? (
          <ul className="list-group">
            {userBookings.map((booking) => {
              const ticket = listTickets.find(t => t.id === booking.ticket_id);
              const concert = concerts.find(c => c.id === ticket?.concert_id);

              return (
                <li key={booking.id} className="list-group-item">
                  <div><strong>Booking ID:</strong> {booking.id}</div>
                  <div><strong>Concert:</strong> {concert?.name || 'N/A'}</div>
                  <div><strong>Level:</strong> {ticket?.type || 'N/A'}</div>
                  <div><strong>Quantity:</strong> {booking.quantity}</div>
                  <div><strong>Total:</strong> {ticket ? ticket.price * booking.quantity : 'N/A'}</div>
                  <div><strong>Status:</strong> {booking.status}</div>
                  <div>
                    {payments.some(p => p.booking_id === booking.id && p.payment_status === "success") ? (
                      <span style={{ color: 'green' }}>Paid</span>
                    ) : (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handlePayment(booking)}
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

        ) : (
          <p>No bookings found for this user.</p>
        )}
      </div>
    </div>
  );
}

export default BookingPage;
