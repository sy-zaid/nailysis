import React, { useEffect, useState } from "react";
import Cards from "../../components/Dashboard/Cards/Cards";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import styles from "../../components/Dashboard/Dashboard.module.css";
import UpcomingTest from "../../components/Dashboard/UpcomingTest/UpcomingTest";
import useCurrentUserData from "../../useCurrentUserData.jsx";
import { getDoctorAppointments } from "../../api/appointmentsApi.js";
import api from "../../api.js";
function DoctorDashboard() {
  const { data: curUser } = useCurrentUserData(); // Fetch current User data
  console.log("CURRUSER", curUser);
  const [apiRes, setApiRes] = useState();
  const [appointmentAnalytics, setAppointmentAnalytics] = useState({});
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getDoctorAppointments();
        const appts = response.data;
        setApiRes(appts);

        const analytics = getDoctorAppointmentAnalytics(appts);
        setAppointmentAnalytics(analytics);
        console.log("ANALYTICS:", appts);
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
          text: "Total number of unique patients who had appointments with this doctor.",
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

  // Fallbacks in case data isn't loaded yet
  const user = (curUser && curUser.length > 0) ? curUser[0] : {};
  const fullName = `${user.first_name || ""} ${user.last_name || ""}`;
  const role = user.role || "Doctor";

  return (
    <div>
      <Navbar />
      <Header 
        mainHeading={`Welcome, ${fullName}`}
        subHeading={`${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`}
      />
      <div className={styles.main}>
        <div className={styles.cards}>
          {appointmentAnalytics.total_appointments &&
            appointmentAnalytics.total_appointments.length > 1 && (
              <>
                <Cards
                  heading="Total Appointments"
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
                  heading="Completed Appointments"
                  count={appointmentAnalytics.completed_appointments[0]}
                  percentage={
                    appointmentAnalytics.completed_appointments[1].percentage
                  }
                  text={appointmentAnalytics.completed_appointments[1].text}
                />
                <Cards
                  heading="Cancelled Appointments"
                  count={appointmentAnalytics.cancelled_appointments[0]}
                  percentage={
                    appointmentAnalytics.cancelled_appointments[1].percentage
                  }
                  text={appointmentAnalytics.cancelled_appointments[1].text}
                />
              </>
            )}
        </div>
        <UpcomingTest />
      </div>
    </div>
  );
}

export default DoctorDashboard;