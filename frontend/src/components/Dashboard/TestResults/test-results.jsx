import React, { useState, useMemo } from "react";
import styles from "./test-results.module.css";
import { getRole } from "../../../utils/utils";
import PopupAllReportsList from "../../Popup/popups-labs/all-reports-list-popup";

const TestResults = ({ testOrders = [], currentPatientId = null }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const userRole = getRole();
  console.log("TEST RESULTS", testOrders);
  // Filter test orders based on user role
  const filteredTestOrders = useMemo(() => {
    if (!Array.isArray(testOrders)) return [];

    // For patients, the backend already filters their orders, so we just need to filter by status
    if (userRole === "patient") {
      return testOrders.filter(
        (order) => order.results_available || order.test_status === "Completed"
      );
    }

    // For lab technicians, show only pending orders
    if (userRole === "lab_technician") {
      return testOrders.filter((order) => order.test_status === "Pending");
    }

    // For other users, show completed orders or those with available results
    return testOrders.filter(
      (order) => order.results_available || order.test_status === "Completed"
    );
  }, [testOrders, userRole]);

  // Get recent patients or orders to display
  const recentPatients = useMemo(() => {
    if (!Array.isArray(filteredTestOrders)) return [];

    // For patients, just show their most recent 3 orders
    if (userRole === "patient") {
      return filteredTestOrders
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 3);
    }

    // For lab technicians, show the 3 most recent pending orders
    if (userRole === "lab_technician") {
      return filteredTestOrders
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3);
    }

    // For other users, group by patient and get most recent order for each
    const patientsMap = filteredTestOrders.reduce((acc, order) => {
      const patientId =
        order.lab_technician_appointment?.patient?.user?.user_id;
      if (!patientId) return acc;

      const existing = acc.get(patientId);
      if (
        !existing ||
        new Date(order.updated_at) > new Date(existing.updated_at)
      ) {
        acc.set(patientId, order);
      }
      return acc;
    }, new Map());

    return Array.from(patientsMap.values())
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 3);
  }, [filteredTestOrders, userRole]);

  // Get all reports for the selected patient
  const patientReports = useMemo(() => {
    if (!selectedPatient || !Array.isArray(filteredTestOrders)) return [];

    const patientId =
      userRole === "patient"
        ? currentPatientId
        : selectedPatient.lab_technician_appointment?.patient?.user?.user_id;

    if (!patientId) return [];

    return filteredTestOrders.filter(
      (order) =>
        (userRole === "patient" ||
          order.lab_technician_appointment?.patient?.user?.user_id ===
            patientId) &&
        (order.results_available || order.test_status === "Completed")
    );
  }, [selectedPatient, filteredTestOrders, userRole, currentPatientId]);

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
    const patient = order.lab_technician_appointment?.patient;
    if (!patient) return "Unknown Patient";

    const gender =
      patient.gender === "M" ? "Mr." : patient.gender === "F" ? "Miss." : "";
    return `${gender} ${patient.user.first_name} ${patient.user.last_name}`;
  };

  const getTestTypes = (order) => {
    if (!order.test_types || !Array.isArray(order.test_types))
      return "No tests specified";
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
  // console.log(patientOrder);
  // console.log("selectedPatient" + selectedPatient.id);
  return (
    <>
      <div className={styles.heading}>
        <div className={styles.blue}></div>
        <h4>
          {userRole === "lab_technician"
            ? "Pending Tests"
            : "Recent Test Results"}
        </h4>
      </div>
      <div className={styles.container}>
        <div className={styles.profilesContainer}>
          {recentPatients.length > 0 ? (
            recentPatients.map((order, index) => (
              <div
                key={index}
                className={styles.profileCard}
                onClick={() => handleProfileClick(order)}
              >
                {userRole !== "patient" && (
                  <img
                    src={
                      `${import.meta.env.VITE_API_URL}` +
                      order.lab_technician_appointment?.patient?.user
                        ?.profile_picture
                    }
                    alt="profile"
                    className={styles.avatar}
                  />
                )}
                <div className={styles.profileInfo}>
                  {userRole !== "patient" && <h5>{getPatientName(order)}</h5>}
                  <p className={styles.truncated}>{getTestTypes(order)}</p>
                  <p className={styles.date}>
                    {userRole === "lab_technician" ? "Created" : "Updated"}:{" "}
                    {formatDate(order.updated_at)}
                  </p>
                  {userRole === "lab_technician" && (
                    <span
                      className={`${styles.status} ${
                        styles[
                          order.test_status.toLowerCase().replace(" ", "-")
                        ]
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
      </div>
      {showPopup && selectedPatient && (
        <PopupAllReportsList
          patient_id={
            selectedPatient.lab_technician_appointment?.patient?.user?.user_id
          }
          onClose={closePopup}
        />
      )}
    </>
  );
};

export default TestResults;
