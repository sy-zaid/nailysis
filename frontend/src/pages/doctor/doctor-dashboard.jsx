import React, { useEffect, useState } from "react";
import Cards from "../../components/Dashboard/Cards/Cards";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import styles from "../../components/Dashboard/Dashboard.module.css";
import styles2 from "../../../src/pages/common/all-pages-styles.module.css";
import UpcomingAppointments from "../../components/Dashboard/UpcomingAppointments/UpcomingAppointments.jsx";
import useCurrentUserData from "../../useCurrentUserData.jsx";
import { getDoctorAppointments } from "../../api/appointmentsApi.js";
import api from "../../api.js";
import { AppointmentsTimelineChart } from "../../components/Dashboard/Charts/appointments-timeline-chart.jsx";
import TestResults from "../../components/Dashboard/TestResults/test-results.jsx";

import { getTestOrders } from "../../api/labsApi.js";

function DoctorDashboard() {
  const { data: curUser } = useCurrentUserData(); // Fetch current User data
  console.log("CURRUSER", curUser);
  const [apiRes, setApiRes] = useState();
  const [appointmentAnalytics, setAppointmentAnalytics] = useState({});
  const [testOrders, setTestOrders] = useState([]);
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getDoctorAppointments();
        const appts = response.data;
        setApiRes(appts);

        const analytics = getDoctorAppointmentAnalytics(appts);
        setAppointmentAnalytics(analytics);
        console.log("ANALYTICS:", appts);

        const test_orders = await getTestOrders();
        setTestOrders(test_orders.data);
        console.log;
      } catch (error) {
        console.log("error fetching appointments", error);
      }
    };

    fetchAppointments();
  }, []);

  const getDoctorAppointmentAnalytics = (appointments) => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    const analytics = {
      total_appointments: [
        0,
        {
          percentage: 0,
          text: "Total number of appointments made by this doctor.",
        },
      ],
      upcoming_appointments: [
        0,
        {
          percentage: 0,
          text: "Appointments scheduled within the next 7 days.",
        },
      ],
      completed_appointments: [
        0,
        {
          percentage: 0,
          text: "Appointments that were checked-in and checked-out.",
        },
      ],
      cancelled_appointments: [
        0,
        {
          percentage: 0,
          text: "Appointments that were cancelled by the patient or clinic.",
        },
      ],
      total_patients: [
        0,
        {
          percentage: 0,
          text: "Total number of unique patients who had appointments with you.",
        },
      ],
      appointment_type_distribution: {},
      weekly_trend: {},
    };

    const patientIds = new Set();

    appointments.forEach((appt) => {
      const checkin = appt.checkin_datetime
        ? new Date(appt.checkin_datetime)
        : null;
      const checkout = appt.checkout_datetime
        ? new Date(appt.checkout_datetime)
        : null;
      const slotDate = appt.time_slot?.slot_date
        ? new Date(appt.time_slot.slot_date)
        : checkin;

      // Count total appointments
      analytics.total_appointments[0] += 1;

      // Track unique patients
      if (appt.patient?.user?.user_id) {
        patientIds.add(appt.patient.user.user_id);
      }

      // Upcoming within 7 days
      if (
        slotDate &&
        slotDate > now &&
        slotDate <= nextWeek &&
        appt.status === "Scheduled"
      ) {
        analytics.upcoming_appointments[0] += 1;
      }

      // Completed appointments
      if (checkin && checkout) {
        analytics.completed_appointments[0] += 1;
      }

      // Cancelled appointments
      if (appt.status === "Cancelled") {
        analytics.cancelled_appointments[0] += 1;
      }

      // Type distribution
      const type = appt.appointment_type || "Unknown";
      if (!analytics.appointment_type_distribution[type]) {
        analytics.appointment_type_distribution[type] = 0;
      }
      analytics.appointment_type_distribution[type] += 1;

      // Weekly trend
      const dayKey = slotDate?.toISOString().slice(0, 10);
      if (dayKey) {
        if (!analytics.weekly_trend[dayKey]) {
          analytics.weekly_trend[dayKey] = 0;
        }
        analytics.weekly_trend[dayKey] += 1;
      }
    });

    // Set total patients count
    analytics.total_patients[0] = patientIds.size;

    // Compute percentages
    const total = analytics.total_appointments[0];
    if (total > 0) {
      analytics.upcoming_appointments[1].percentage = Math.round(
        (analytics.upcoming_appointments[0] / total) * 100
      );
      analytics.completed_appointments[1].percentage = Math.round(
        (analytics.completed_appointments[0] / total) * 100
      );
      analytics.cancelled_appointments[1].percentage = Math.round(
        (analytics.cancelled_appointments[0] / total) * 100
      );
      analytics.total_patients[1].percentage = Math.round(
        (analytics.total_patients[0] / total) * 100
      );
    }

    return analytics;
  };

  return (
    <div className={styles.analytics}>
      <div className={styles.leftColumn}>
        <Header
          mainHeading={"Welcome, Dr. " + (curUser?.[0]?.first_name || "User")}
          subHeading={
            "Manage your patients, review diagnostics, and streamline your clinical workflow with ease."
          }
        />
        <div className={styles.cards}>
          {appointmentAnalytics.total_appointments &&
            appointmentAnalytics.total_appointments.length > 1 && (
              <>
                <Cards
                  heading="Appointments"
                  count={appointmentAnalytics.total_appointments[0]}
                  percentage={
                    appointmentAnalytics.total_appointments[1].percentage
                  }
                  text={appointmentAnalytics.total_appointments[1].text}
                />
                <Cards
                  heading="Patients"
                  count={appointmentAnalytics.total_patients?.[0]}
                  percentage={
                    appointmentAnalytics.total_patients?.[1]?.percentage
                  }
                  text={appointmentAnalytics.total_patients?.[1]?.text}
                />
                <Cards
                  heading="Completed"
                  count={appointmentAnalytics.completed_appointments[0]}
                  percentage={
                    appointmentAnalytics.completed_appointments[1].percentage
                  }
                  text={appointmentAnalytics.completed_appointments[1].text}
                />
                <Cards
                  heading="Cancelled"
                  count={appointmentAnalytics.cancelled_appointments[0]}
                  percentage={
                    appointmentAnalytics.cancelled_appointments[1].percentage
                  }
                  text={appointmentAnalytics.cancelled_appointments[1].text}
                />
              </>
            )}
        </div>
        <AppointmentsTimelineChart clinicAppointments={apiRes} />
      </div>
      <div className={styles.rightColumn}>
        <UpcomingAppointments
          heading="My Schedule"
          clinicAppointments={apiRes}
          userRole={"doctor"} // "patient", "doctor", "lab_technician", etc.
        />

        <TestResults testOrders={testOrders} />
      </div>
    </div>
  );
}

export default DoctorDashboard;
