import React, { useEffect, useState } from "react";
import Cards from "../../components/Dashboard/Cards/Cards";
import Header from "../../components/Dashboard/Header/Header";
import styles from "../../components/Dashboard/Dashboard.module.css";
import styles2 from "../../../src/pages/common/all-pages-styles.module.css";
import UpcomingAppointments from "../../components/Dashboard/UpcomingAppointments/UpcomingAppointments.jsx";
import { AppointmentsTimelineChart } from "../../components/Dashboard/Charts/appointments-timeline-chart.jsx";
import useCurrentUserData from "../../useCurrentUserData.jsx";
import { getDoctorAppointments } from "../../api/appointmentsApi.js";
import { getTestOrders } from "../../api/labsApi.js";
import TestResults from "../../components/Dashboard/TestResults/test-results.jsx";

function ClinicAdminDashboard() {
  const { data: curUser, isLoading, isError, error } = useCurrentUserData();
  const [appointments, setAppointments] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_appointments: [0, { percentage: 0, text: "" }],
    unique_patients: [0, { percentage: 0, text: "" }],
    total_payments: [0, { percentage: 0, text: "" }],
    cancelled_appointments: [0, { percentage: 0, text: "" }],
    upcoming_appointments: [],
  });
  const [testOrders, setTestOrders] = useState([]);
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getDoctorAppointments();
        setAppointments(response.data);
        const analytics = getClinicAdminAnalytics(response.data);
        console.log("Analytics data:", analytics); // Debug log
        setAnalytics(analytics);
        const test_orders = getTestOrders();
        setTestOrders(test_orders.data);
      } catch (error) {
        console.log("Error fetching appointments", error);
      }
    };

    fetchAppointments();
  }, []);

  const getClinicAdminAnalytics = (appointments) => {
    const analytics = {
      total_appointments: [
        0,
        {
          percentage: 0,
          text: "Total number of clinic appointments in the system.",
        },
      ],
      unique_patients: [
        0,
        {
          percentage: 0,
          text: "Number of unique patients who visited the clinic.",
        },
      ],
      total_payments: [
        0,
        {
          percentage: 0,
          text: "Total revenue generated from completed appointments.",
        },
      ],
      cancelled_appointments: [
        0,
        {
          percentage: 0,
          text: "Clinic appointments that were cancelled.",
        },
      ],
      upcoming_appointments: [],
    };

    const patientIds = new Set();
    let revenueGeneratingAppointments = 0;
    let totalPayments = 0;

    appointments.forEach((appt) => {
      // Count total appointments
      analytics.total_appointments[0] += 1;

      // Track unique patients
      if (appt.patient?.user?.user_id) {
        patientIds.add(appt.patient.user.user_id);
      }

      // Calculate payments from completed appointments
      if (appt.status === "Completed") {
        let payment = 0;

        // Get payment from appointment fee
        if (appt.fee && !isNaN(parseFloat(appt.fee))) {
          payment = parseFloat(appt.fee);
        }

        console.log(`Appointment ${appt.appointment_id} payment:`, payment); // Debug log

        if (payment > 0) {
          revenueGeneratingAppointments += 1;
          totalPayments += payment;
        }
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

    // Set calculated values
    analytics.unique_patients[0] = patientIds.size;
    analytics.total_payments[0] = totalPayments;

    // Calculate percentages
    const total = analytics.total_appointments[0];
    if (total > 0) {
      analytics.cancelled_appointments[1].percentage = Math.round(
        (analytics.cancelled_appointments[0] / total) * 100
      );
      analytics.unique_patients[1].percentage = Math.round(
        (analytics.unique_patients[0] / total) * 100
      );

      // Payment percentage shows what portion of appointments generated revenue
      analytics.total_payments[1].percentage = Math.round(
        (revenueGeneratingAppointments / total) * 100
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
          mainHeading={"Welcome, " + (curUser?.[0]?.first_name || "Admin")}
          subHeading={
            "Manage clinic operations and track financial performance."
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
            heading="Total Payments"
            count={`${analytics.total_payments[0].toFixed(2)}`}
            percentage={analytics.total_payments[1].percentage}
            text={analytics.total_payments[1].text}
          />
          <Cards
            heading="Cancelled Appointments"
            count={analytics.cancelled_appointments[0]}
            percentage={analytics.cancelled_appointments[1].percentage}
            text={analytics.cancelled_appointments[1].text}
          />
        </div>
        <AppointmentsTimelineChart clinicAppointments={appointments} />
      </div>
      <div className={styles.rightColumn}>
        <UpcomingAppointments
          heading="My Schedule"
          clinicAppointments={appointments}
          userRole={"clinic_admin"} // "patient", "doctor", "lab_technician", etc.
        />
        <TestResults testOrders={testOrders} />
      </div>
    </div>
  );
}

export default ClinicAdminDashboard;
