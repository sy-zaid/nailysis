import React, { useEffect, useState } from "react";
import Cards from "../../components/Dashboard/Cards/Cards";
import Header from "../../components/Dashboard/Header/Header";
import styles from "../../components/Dashboard/Dashboard.module.css";
import styles2 from "../../../src/pages/common/all-pages-styles.module.css";
import UpcomingTest from "../../components/Dashboard/UpcomingTest/UpcomingTest";
import useCurrentUserData from "../../useCurrentUserData.jsx";
import { getLabTechnicianAppointments } from "../../api/appointmentsApi.js";

function LabAdminDashboard() {
  const { data: curUser, isLoading, isError, error } = useCurrentUserData();
  const [appointments, setAppointments] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_appointments: [0, { percentage: 0, text: "" }],
    unique_patients: [0, { percentage: 0, text: "" }],
    total_payments: [0, { percentage: 0, text: "" }],
    cancelled_appointments: [0, { percentage: 0, text: "" }],
    upcoming_appointments: []
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getLabTechnicianAppointments();
        setAppointments(response.data);
        const analytics = getLabAdminAnalytics(response.data);
        setAnalytics(analytics);
      } catch (error) {
        console.log("Error fetching appointments", error);
      }
    };

    fetchAppointments();
  }, []);

  const getLabAdminAnalytics = (appointments) => {
    const analytics = {
      total_appointments: [
        0,
        {
          percentage: 0,
          text: "Total number of lab appointments in the system.",
        },
      ],
      unique_patients: [
        0,
        {
          percentage: 0,
          text: "Number of unique patients who used lab services.",
        },
      ],
      total_payments: [
        0,
        {
          percentage: 0,
          text: "Total revenue generated from completed lab tests.",
        },
      ],
      cancelled_appointments: [
        0,
        {
          percentage: 0,
          text: "Lab appointments that were cancelled.",
        },
      ],
      upcoming_appointments: []
    };

    const patientIds = new Set();
    let revenueGeneratingAppointments = 0;

    appointments.forEach((appt) => {
      // Count total appointments
      analytics.total_appointments[0] += 1;

      // Track unique patients
      if (appt.patient?.user?.user_id) {
        patientIds.add(appt.patient.user.user_id);
      }

      // Calculate payments from completed appointments
      if (appt.status === "Completed") {
        // Use appointment fee or sum of test prices if fee is 0
        let payment = parseFloat(appt.fee) || 0;
        if (payment === 0 && appt.test_orders) {
          payment = appt.test_orders.reduce((sum, order) => {
            return sum + (order.test_types?.reduce((tSum, test) => {
              return tSum + parseFloat(test.price || 0);
            }, 0) || 0);
          }, 0);
        }
        
        if (payment > 0) {
          revenueGeneratingAppointments += 1;
        }
        analytics.total_payments[0] += payment;
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
            "Manage lab operations and track financial performance."
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

        
      </div>
      <div className={styles.rightColumn}>
        <UpcomingTest
          heading="My Schedule"
          
          labAppointments={appointments}
          userRole={"lab_admin"} // "patient", "doctor", "lab_technician", etc.
        />
        {/* TEST REPORTS */}
      </div>
    </div>
  );
}

export default LabAdminDashboard;