import React, { useEffect, useState } from "react";
import Cards from "../../components/Dashboard/Cards/Cards";
import Header from "../../components/Dashboard/Header/Header";
import styles from "../../components/Dashboard/Dashboard.module.css";
import styles2 from "../../../src/pages/common/all-pages-styles.module.css";
import UpcomingAppointments from "../../components/Dashboard/UpcomingAppointments/UpcomingAppointments.jsx";
import { AppointmentsTimelineChart } from "../../components/Dashboard/Charts/appointments-timeline-chart.jsx";
import useCurrentUserData from "../../useCurrentUserData.jsx";
import { getLabTechnicianAppointments } from "../../api/appointmentsApi.js";
import TestResults from "../../components/Dashboard/TestResults/test-results.jsx";
import { getTestOrders, getTestResults } from "../../api/labsApi.js";

function LabTechnicianDashboard() {
  const { data: curUser, isLoading, isError, error } = useCurrentUserData();
  const [appointments, setAppointments] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_appointments: [0, { percentage: 0, text: "" }],
    unique_patients: [0, { percentage: 0, text: "" }],
    completed_appointments: [0, { percentage: 0, text: "" }],
    cancelled_appointments: [0, { percentage: 0, text: "" }],
    upcoming_appointments: [],
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getLabTechnicianAppointments();
        setAppointments(response.data);
        const analytics = getLabTechnicianAnalytics(response.data);
        setAnalytics(analytics);
        const test_results = await getTestOrders();
        setTestResults(test_results.data);
        // console.log("TEST RESULTS FROM TECH DB", test_results.data);
      } catch (error) {
        // console.log("Error fetching appointments", error);
      }
    };

    fetchAppointments();
  }, []);

  const getLabTechnicianAnalytics = (appointments) => {
    const analytics = {
      total_appointments: [
        0,
        {
          percentage: 0,
          text: "Total number of appointments assigned to you.",
        },
      ],
      unique_patients: [
        0,
        {
          percentage: 0,
          text: "Number of unique patients you've served.",
        },
      ],
      completed_appointments: [
        0,
        {
          percentage: 0,
          text: "Appointments you've successfully completed.",
        },
      ],
      cancelled_appointments: [
        0,
        {
          percentage: 0,
          text: "Appointments that were cancelled.",
        },
      ],
      upcoming_appointments: [],
    };

    const patientIds = new Set();

    appointments.forEach((appt) => {
      // Count total appointments
      analytics.total_appointments[0] += 1;

      // Track unique patients
      if (appt.patient?.user?.user_id) {
        patientIds.add(appt.patient.user.user_id);
      }

      // Count completed appointments
      if (appt.status === "Completed") {
        analytics.completed_appointments[0] += 1;
      }

      // Count cancelled appointments
      if (appt.status === "Cancelled") {
        analytics.cancelled_appointments[0] += 1;
      }

      // Check if upcoming
      const slotDate = appt.time_slot?.slot_date
        ? new Date(appt.time_slot.slot_date)
        : appt.checkin_datetime
        ? new Date(appt.checkin_datetime)
        : null;
      if (slotDate && slotDate > new Date() && appt.status === "Scheduled") {
        analytics.upcoming_appointments.push(appt);
      }
    });

    // Set unique patients count
    analytics.unique_patients[0] = patientIds.size;

    // Calculate percentages
    const total = analytics.total_appointments[0];
    if (total > 0) {
      analytics.completed_appointments[1].percentage = Math.round(
        (analytics.completed_appointments[0] / total) * 100
      );
      analytics.cancelled_appointments[1].percentage = Math.round(
        (analytics.cancelled_appointments[0] / total) * 100
      );
      analytics.unique_patients[1].percentage = Math.round(
        (analytics.unique_patients[0] / total) * 100
      );
    }

    return analytics;
  };
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching user data</p>;
  }
  return (
    <div className={styles.analytics}>
      <div className={styles.leftColumn}>
        <Header
          mainHeading={"Welcome, " + (curUser?.[0]?.first_name || "Technician")}
          subHeading={
            "Track your lab appointments and patient interactions in one place."
          }
        />
        <div className={styles.cards}>
          <Cards
            heading="Total Appointments"
            count={analytics.total_appointments[0]}
            percentage={analytics.total_appointments[1].percentage}
            text={analytics.total_appointments[1].text}
          />
          <Cards
            heading="Unique Patients"
            count={analytics.unique_patients[0]}
            percentage={analytics.unique_patients[1].percentage}
            text={analytics.unique_patients[1].text}
          />
          <Cards
            heading="Completed Appointments"
            count={analytics.completed_appointments[0]}
            percentage={analytics.completed_appointments[1].percentage}
            text={analytics.completed_appointments[1].text}
          />
          <Cards
            heading="Cancelled Appointments"
            count={analytics.cancelled_appointments[0]}
            percentage={analytics.cancelled_appointments[1].percentage}
            text={analytics.cancelled_appointments[1].text}
          />
        </div>
        <AppointmentsTimelineChart labAppointments={appointments} />
      </div>

      <div className={styles.rightColumn}>
        <UpcomingAppointments
          heading="My Schedule"
          labAppointments={appointments}
          userRole={"lab_technician"} // "patient", "doctor", "lab_technician", etc.
        />
        <TestResults testOrders={testResults} />
      </div>
    </div>
  );
}

export default LabTechnicianDashboard;
