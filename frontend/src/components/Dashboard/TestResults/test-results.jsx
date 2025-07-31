import React, { useState, useMemo } from "react";
import styles from "./test-results.module.css";
import { getRole } from "../../../utils/utils";
const TestResults = ({
  testOrders = [],

  currentPatientId = null,
}) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const userRole = getRole();
  // Filter test orders based on user role
  const filteredTestOrders = useMemo(() => {
    if (userRole === "lab_technician") {
      // Lab technician sees only pending test orders
      return testOrders.filter((order) => order.test_status === "Pending");
    } else if (userRole === "patient") {
      // Patient sees only their own orders where results are available or appointment is completed
      return testOrders.filter(
        (order) =>
          order.lab_technician_appointment.patient.user.user_id ===
            currentPatientId &&
          (order.results_available ||
            order.lab_technician_appointment.status === "Completed")
      );
    } else {
      // Other users see all orders that are completed or have results available
      return testOrders.filter(
        (order) =>
          order.results_available ||
          order.lab_technician_appointment.status === "Completed"
      );
    }
  }, [testOrders, userRole, currentPatientId]);

  // Get unique patients with their most recent test orders
  const recentPatients = useMemo(() => {
    // For lab technicians, show pending orders
    if (userRole === "lab_technician") {
      return filteredTestOrders
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3);
    }

    // For others, show completed orders or those with available results
    const relevantOrders = filteredTestOrders.filter(
      (order) =>
        order.lab_technician_appointment.status === "Completed" ||
        order.results_available
    );

    // Group by patient and get most recent order for each
    const patientsMap = relevantOrders.reduce((acc, order) => {
      const patientId = order.lab_technician_appointment.patient.user.user_id;
      const existing = acc.get(patientId);

      if (
        !existing ||
        new Date(order.updated_at) > new Date(existing.updated_at)
      ) {
        acc.set(patientId, order);
      }

      return acc;
    }, new Map());

    // Convert to array and sort by most recent
    return Array.from(patientsMap.values())
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 3); // Get top 3 most recent
  }, [filteredTestOrders, userRole]);

  // Rest of the component remains the same...
  // Get all reports for the selected patient
  const patientReports = selectedPatient
    ? filteredTestOrders.filter(
        (order) =>
          order.lab_technician_appointment.patient.user.user_id ===
            selectedPatient.lab_technician_appointment.patient.user.user_id &&
          (order.results_available ||
            order.lab_technician_appointment.status === "Completed")
      )
    : [];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getPatientName = (order) => {
    const patient = order.lab_technician_appointment.patient;
    const gender =
      patient.gender === "M" ? "Mr." : patient.gender === "F" ? "Miss." : "";
    return `${gender} ${patient.user.first_name} ${patient.user.last_name}`;
  };

  const getTestTypes = (order) => {
    return order.test_types.map((test) => test.label).join(", ");
  };

  const handleProfileClick = (patientOrder) => {
    setSelectedPatient(patientOrder);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedPatient(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <div className={styles.blue}></div>
        <h4>
          {userRole === "lab_technician"
            ? "Pending Tests"
            : "Recent Test Results"}
        </h4>
      </div>

      <div className={styles.profilesContainer}>
        {recentPatients.length > 0 ? (
          recentPatients.map((order, index) => (
            <div
              key={index}
              className={styles.profileCard}
              onClick={() => handleProfileClick(order)}
            >
              <img src="profiles.png" alt="profile" className={styles.avatar} />
              <div className={styles.profileInfo}>
                <h5>{getPatientName(order)}</h5>
                <p>{getTestTypes(order)}</p>
                <p className={styles.date}>
                  {userRole === "lab_technician" ? "Created" : "Updated"}:{" "}
                  {formatDate(order.updated_at)}
                </p>
                {userRole === "lab_technician" && (
                  <span
                    className={`${styles.status} ${
                      styles[order.test_status.toLowerCase().replace(" ", "-")]
                    }`}
                  >
                    {order.test_status}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noResults}>
            {userRole === "lab_technician"
              ? "No pending tests"
              : "No test results available"}
          </p>
        )}
      </div>

      {/* Popup for viewing all reports */}
      {showPopup && selectedPatient && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <div className={styles.popupHeader}>
              <h3>{getPatientName(selectedPatient)}'s Test Reports</h3>
              <button onClick={closePopup} className={styles.closeButton}>
                &times;
              </button>
            </div>

            <div className={styles.reportsList}>
              {patientReports.length > 0 ? (
                patientReports.map((report, index) => (
                  <div key={index} className={styles.reportItem}>
                    <div className={styles.reportHeader}>
                      <h4>{formatDate(report.updated_at)}</h4>
                      <span
                        className={`${styles.status} ${
                          styles[
                            report.test_status.toLowerCase().replace(" ", "-")
                          ]
                        }`}
                      >
                        {report.test_status}
                      </span>
                    </div>
                    <p>{getTestTypes(report)}</p>
                    <div className={styles.reportDetails}>
                      {report.test_types.map((test, i) => (
                        <div key={i} className={styles.testItem}>
                          <span>{test.label}</span>
                          <span>{test.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>No reports available for this patient</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestResults;
