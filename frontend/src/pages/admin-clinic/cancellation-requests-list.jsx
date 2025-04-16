import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "../../components/Dashboard/Header/Header.jsx";
import styles from "./appointment-cancellation-request.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import { convertDjangoDateTime, getRole } from "../../utils/utils.js";

const CancellationRequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [activeButton, setActiveButton] = useState(0);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const popupRef = useRef(null);
  const curUserRole = getRole();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/cancellation_requests/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        console.log(response.data);
        setRequests(response.data);
      } catch (err) {
        setError("Failed to fetch cancellation requests.");
      }
    };

    fetchRequests();
    setRefresh(false);
  }, [refresh]);

  const handleReview = async (requestId, action) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/cancellation_requests/${requestId}/review/`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      alert(response.data.message);
      // setRequests((prevRequests) =>
      //   prevRequests.filter((request) => request.id !== requestId)
      // );
      setRefresh(true);
      setPopupVisible(false);
    } catch (err) {
      setError("Failed to review cancellation request.");
    }
  };

  const handleFilterClick = (index) => {
    setActiveButton(index);
  };

  const togglePopup = (event, requestId) => {
    const iconRect = event.target.getBoundingClientRect();
    setPopupPosition({
      top: iconRect.top + window.scrollY + iconRect.height + 5,
      left: iconRect.left + window.scrollX - 95,
    });
    setCurrentRequestId(requestId);
    setPopupVisible(!popupVisible);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return styles.resolved;
      case "Rejected":
        return styles.inProgress;
      case "Pending":
        return styles.pending;
      default:
        return styles.defaultColor;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Navbar />

      {/* Page Header */}
      <div className={styles.pageTop}>
        <Header
          mainHeading={"Cancellation Requests"}
          subHeading={
            "Here you can view and manage all the cancellation requests"
          }
        />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.appointmentsContainer}>
          {/* Filter buttons */}
          <div className={styles.filters}>
            <button
              className={`${styles.filterButton} ${
                activeButton === 0 ? styles.active : ""
              }`}
              onClick={() => handleFilterClick(0)}
            >
              All
            </button>
            <button
              className={`${styles.filterButton} ${
                activeButton === 1 ? styles.active : ""
              }`}
              onClick={() => handleFilterClick(1)}
            >
              Approved
            </button>
            <button
              className={`${styles.filterButton} ${
                activeButton === 2 ? styles.active : ""
              }`}
              onClick={() => handleFilterClick(2)}
            >
              Rejected
            </button>
            <button
              className={`${styles.filterButton} ${
                activeButton === 3 ? styles.active : ""
              }`}
              onClick={() => handleFilterClick(3)}
            >
              Pending
            </button>

            <p>Total Records: {requests.length}</p>
          </div>

          {/* Table Container */}
          <div className={styles.tableContainer}>
            {/* Sorting and Search Bar */}
            <div className={styles.controls}>
              <select className={styles.bulkAction}>
                <option>Bulk Action: Delete</option>
              </select>

              <select className={styles.sortBy}>
                <option value="">Sort By: None</option>
                <option value="doctor">Doctor</option>
                <option value="status">Status</option>
              </select>

              <input
                className={styles.search}
                type="text"
                placeholder="Search By Name or ID"
              />
            </div>

            <hr />
            <br />

            <div className={styles.tableWrapper}>
              {error && <div className={styles.error}>{error}</div>}
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" />
                    </th>
                    <th>#</th>
                    <th>Doctor ID</th>
                    <th>Doctor Name</th>
                    <th>Patient ID</th>
                    <th>Patient Name</th>
                    <th>Appointment ID</th>
                    <th>Appointment Date & Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    {curUserRole === "clinic_admin" && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request, index) => (
                    <tr key={request.id}>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>{index + 1}</td>
                      <td>{request.doctor}</td>
                      <td>
                        {request.appointment?.doctor?.user?.first_name}{" "}
                        {request.appointment?.doctor?.user?.last_name}
                      </td>
                      <td>{request.appointment?.patient?.user?.user_id}</td>
                      <td>
                        {request.appointment?.patient?.user?.first_name}{" "}
                        {request.appointment?.patient?.user?.last_name}
                      </td>
                      <td>{request.appointment?.appointment_id}</td>
                      <td>
                        {convertDjangoDateTime(
                          request.appointment?.checkin_datetime
                        )}
                      </td>
                      <td>{request.reason}</td>
                      <td className={getStatusClass(request.status)}>
                        {request.status}
                      </td>
                      {curUserRole === "clinic_admin" && (
                        <td>
                          {request.status === "Pending" && (
                            <div className={styles.actionButtons}>
                              <button
                                className={styles.approveButton}
                                onClick={() =>
                                  handleReview(request.id, "approve")
                                }
                              >
                                Approve
                              </button>
                              <button
                                className={styles.rejectButton}
                                onClick={() =>
                                  handleReview(request.id, "reject")
                                }
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationRequestsList;
