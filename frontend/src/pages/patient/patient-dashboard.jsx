import React, { useEffect, useState } from "react";
import Cards from "../../components/Dashboard/Cards/Cards";
import Header from "../../components/Dashboard/Header/Header";
import styles from "../../components/Dashboard/Dashboard.module.css";
import styles2 from "../../../src/pages/common/all-pages-styles.module.css";
import UpcomingAppointments from "../../components/Dashboard/UpcomingAppointments/UpcomingAppointments";
import useCurrentUserData from "../../useCurrentUserData.jsx";
import {
  getDoctorAppointments,
  getLabTechnicianAppointments,
} from "../../api/appointmentsApi.js";
import { AppointmentsTimelineChart } from "../../components/Dashboard/Charts/appointments-timeline-chart.jsx";
import TestResults from "../../components/Dashboard/TestResults/test-results.jsx";
import { getTestOrders } from "../../api/labsApi.js";
function PatientDashboard() {
  const { data: curUser, isLoading, isError, error } = useCurrentUserData();
  const [clinicAppointments, setClinicAppointments] = useState([]);
  const [labAppointments, setLabAppointments] = useState([]);
  const [analytics, setAnalytics] = useState({
    completed_clinic: [0, { percentage: 0, text: "" }],
    completed_lab: [0, { percentage: 0, text: "" }],
    total_payments: [0, { percentage: 0, text: "" }],
    cancelled_appointments: [0, { percentage: 0, text: "" }],
    upcoming_appointments: { clinic: [], lab: [] },
  });
  const [timePeriod, setTimePeriod] = useState("all");
  const [testOrders, setTestOrders] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const clinicResponse = await getDoctorAppointments();
        const labResponse = await getLabTechnicianAppointments();
        const test_orders = await getTestOrders();
        setTestOrders(test_orders.data);
        setClinicAppointments(clinicResponse.data);
        setLabAppointments(labResponse.data);

        const analytics = getPatientAnalytics(
          clinicResponse.data,
          labResponse.data,
          timePeriod
        );
        console.log("Calculated payments:", analytics.total_payments[0]); // Debug log
        setAnalytics(analytics);
      } catch (error) {
        console.log("Error fetching appointments", error);
      }
    };

    fetchAppointments();
  }, [timePeriod]);

  const filterByTimePeriod = (appointments, period) => {
    const now = new Date();
    const filtered = appointments.filter((appt) => {
      const apptDate = appt.checkin_datetime
        ? new Date(appt.checkin_datetime)
        : appt.time_slot?.slot_date
        ? new Date(appt.time_slot.slot_date)
        : null;

      if (!apptDate) return false;

      switch (period) {
        case "yearly":
          return apptDate >= new Date(now.getFullYear(), 0, 1);
        case "monthly":
          return apptDate >= new Date(now.getFullYear(), now.getMonth(), 1);
        case "weekly":
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return apptDate >= oneWeekAgo;
        default:
          return true;
      }
    });

    return filtered;
  };

  const getPatientAnalytics = (clinicAppts, labAppts, period) => {
    const filteredClinic = filterByTimePeriod(clinicAppts, period);
    const filteredLab = filterByTimePeriod(labAppts, period);

    const analytics = {
      completed_clinic: [
        0,
        {
          percentage: 0,
          text: "Completed clinic appointments with doctors.",
        },
      ],
      completed_lab: [
        0,
        {
          percentage: 0,
          text: "Completed lab tests and procedures.",
        },
      ],
      total_payments: [
        0, // Initialize with 0
        {
          percentage: 0,
          text: "Total amount you've spend on appointments till now.",
        },
      ],
      cancelled_appointments: [
        0,
        {
          percentage: 0,
          text: "Appointments that were cancelled by you or the facility.",
        },
      ],
      upcoming_appointments: {
        clinic: [],
        lab: [],
      },
    };

    // Process clinic appointments
    filteredClinic.forEach((appt) => {
      if (appt.status === "Completed") {
        analytics.completed_clinic[0] += 1;
        const fee = parseFloat(appt.fee) || 0;
        analytics.total_payments[0] += fee;
        console.log(
          `Adding clinic fee: ${fee}, Total now: ${analytics.total_payments[0]}`
        );
      } else if (appt.status === "Cancelled") {
        analytics.cancelled_appointments[0] += 1;
      }

      // Check if upcoming
      const slotDate = appt.time_slot?.slot_date
        ? new Date(appt.time_slot.slot_date)
        : appt.checkin_datetime
        ? new Date(appt.checkin_datetime)
        : null;
      if (slotDate && slotDate > new Date() && appt.status === "Scheduled") {
        analytics.upcoming_appointments.clinic.push(appt);
      }
    });

    // Process lab appointments
    filteredLab.forEach((appt) => {
      if (appt.status === "Completed") {
        analytics.completed_lab[0] += 1;

        // Calculate payment from fee or sum of test prices
        let payment = parseFloat(appt.fee) || 0;
        if (payment === 0 && appt.test_orders) {
          payment = appt.test_orders.reduce((sum, order) => {
            return (
              sum +
              (order.test_types?.reduce((tSum, test) => {
                return tSum + parseFloat(test.price || 0);
              }, 0) || 0)
            );
          }, 0);
        }

        analytics.total_payments[0] += payment;
        console.log(
          `Adding lab payment: ${payment}, Total now: ${analytics.total_payments[0]}`
        );
      } else if (appt.status === "Cancelled") {
        analytics.cancelled_appointments[0] += 1;
      }

      // Check if upcoming
      const slotDate = appt.time_slot?.slot_date
        ? new Date(appt.time_slot.slot_date)
        : appt.checkin_datetime
        ? new Date(appt.checkin_datetime)
        : null;
      if (slotDate && slotDate > new Date() && appt.status === "Scheduled") {
        analytics.upcoming_appointments.lab.push(appt);
      }
    });

    // Calculate percentages
    const totalAppointments =
      analytics.completed_clinic[0] +
      analytics.completed_lab[0] +
      analytics.cancelled_appointments[0];

    if (totalAppointments > 0) {
      analytics.completed_clinic[1].percentage = Math.round(
        (analytics.completed_clinic[0] / totalAppointments) * 100
      );
      analytics.completed_lab[1].percentage = Math.round(
        (analytics.completed_lab[0] / totalAppointments) * 100
      );
      analytics.cancelled_appointments[1].percentage = Math.round(
        (analytics.cancelled_appointments[0] / totalAppointments) * 100
      );

      // Payment percentage is based on completed appointments only
      const totalCompleted =
        analytics.completed_clinic[0] + analytics.completed_lab[0];
      if (totalCompleted > 0) {
        analytics.total_payments[1].percentage = 100;
      }
    }

    return analytics;
  };
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching user data</p>;
  }
  return (
    <div className={styles.analytics}>
      <div className={styles.leftColumn}>
        <Header
          mainHeading={"Welcome, " + (curUser?.[0]?.first_name || "User")}
          subHeading={
            "Your health journey matters to us — explore your records, appointments, and more right here."
          }
        />
        <div className={styles.cards}>
          <Cards
            heading="Clinic Visits"
            count={analytics.completed_clinic[0]}
            percentage={analytics.completed_clinic[1].percentage}
            text={analytics.completed_clinic[1].text}
          />
          <Cards
            heading="Lab Tests"
            count={analytics.completed_lab[0]}
            percentage={analytics.completed_lab[1].percentage}
            text={analytics.completed_lab[1].text}
          />
          <Cards
            heading="Total Amount"
            count={`${analytics.total_payments[0].toFixed(2)}`}
            percentage={analytics.total_payments[1].percentage}
            text={analytics.total_payments[1].text}
          />
          <Cards
            heading="Cancelled"
            count={analytics.cancelled_appointments[0]}
            percentage={analytics.cancelled_appointments[1].percentage}
            text={analytics.cancelled_appointments[1].text}
          />
        </div>
        <AppointmentsTimelineChart
          clinicAppointments={analytics.upcoming_appointments.clinic}
          labAppointments={analytics.upcoming_appointments.lab}
        />
      </div>
      <div className={styles.rightColumn}>
        <UpcomingAppointments
          heading="My Schedule"
          clinicAppointments={analytics.upcoming_appointments.clinic}
          labAppointments={analytics.upcoming_appointments.lab}
          userRole={"patient"} // "patient", "doctor", "lab_technician", etc.
        />
        <TestResults testOrders={testOrders} />
      </div>
    </div>
  );
}

export default PatientDashboard;
