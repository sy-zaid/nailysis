import React, { useState } from 'react';
import axios from 'axios';

const CancellationRequestForm = ({ appointmentId }) => {
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Please provide a reason for cancellation.');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/doctor_appointments/request_cancellation/`, 
        { reason },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}` // Assuming you are using token-based auth
          }
        }
      );
      setMessage(response.data.message); // Success message from the API
      setError('');
    } catch (err) {
      setError('Failed to submit cancellation request. Please try again.');
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Request Appointment Cancellation</h2>
      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="reason">Reason for Cancellation:</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Cancellation Request</button>
      </form>
    </div>
  );
};

export default CancellationRequestForm;
