import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CancellationRequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cancellation_requests/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}` // Assuming you're using token-based authentication
          }
        });
        setRequests(response.data);
      } catch (err) {
        setError('Failed to fetch cancellation requests.');
      }
    };

    fetchRequests();
  }, []);

  const handleReview = async (requestId, action) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cancellation_requests/${requestId}/review/`,
        { action },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access')}`
          }
        }
      );
      alert(response.data.message); // Notify admin of success
      // Optionally, refetch the cancellation requests list to reflect changes
      setRequests((prevRequests) => prevRequests.filter(request => request.id !== requestId));
    } catch (err) {
      setError('Failed to review cancellation request.');
    }
  };

  return (
    <div>
      <h2>Cancellation Requests</h2>
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Appointment</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.doctor}</td>
              <td>{request.appointment}</td>
              <td>{request.reason}</td>
              <td>{request.status}</td>
              <td>
                {request.status === 'Pending' && (
                  <div>
                    <button onClick={() => handleReview(request.id, 'approve')}>Approve</button>
                    <button onClick={() => handleReview(request.id, 'reject')}>Reject</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CancellationRequestsList;
