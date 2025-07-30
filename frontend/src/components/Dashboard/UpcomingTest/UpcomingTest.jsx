import React, { useState, useEffect } from "react";
import styles from "./UpcomingTest.module.css";

const UpcomingAppointments = ({ 
  heading = "My Schedule", 
  clinicAppointments = [], 
  labAppointments = [],
  userRole = "patient" 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [nextAppointment, setNextAppointment] = useState(null);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "2-digit",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).toLowerCase();
  };

  const formatWeekdayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  };

  const handlePrevDate = () => {
    const prevDate = new Date(currentDate);
    if (currentDate > new Date()) {
      prevDate.setDate(prevDate.getDate() - 1);
      setCurrentDate(prevDate);
    } else {
      setCurrentDate(new Date());
    }
  };

  const handleNextDate = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setCurrentDate(nextDate);
  };

  // Get professional name (doctor or lab technician)
  const getProfessionalName = (appointment) => {
    if (appointment.doctor) {
      return `Dr. ${appointment.doctor.user.first_name} ${appointment.doctor.user.last_name}`;
    } else if (appointment.lab_technician) {
      return `${appointment.lab_technician.user.first_name} ${appointment.lab_technician.user.last_name}`;
    }
    return "";
  };

  const processAppointments = () => {
    let appointments = [];
    
    if (userRole === "patient") {
      appointments = [...clinicAppointments, ...labAppointments];
    } else if (["doctor", "clinic_admin"].includes(userRole)) {
      appointments = [...clinicAppointments];
    } else if (["lab_technician", "lab_admin"].includes(userRole)) {
      appointments = [...labAppointments];
    }

    const filtered = appointments
      .filter(appt => appt.status !== "Cancelled")
      .filter(appt => {
        const apptDate = new Date(appt.checkin_datetime).toDateString();
        const currentDateStr = currentDate.toDateString();
        return apptDate === currentDateStr;
      })
      .sort((a, b) => {
        return new Date(a.checkin_datetime) - new Date(b.checkin_datetime);
      });

    setFilteredAppointments(filtered.slice(0, 3));
    
    const now = new Date();
    const upcoming = appointments
      .filter(appt => appt.status === "Scheduled")
      .filter(appt => new Date(appt.checkin_datetime) > now)
      .sort((a, b) => new Date(a.checkin_datetime) - new Date(b.checkin_datetime))[0];

    setNextAppointment(upcoming);
  };

  const getAppointmentDescription = (appointment) => {
    if (appointment.doctor) {
      return appointment.appointment_type || "Doctor Appointment";
    } else if (appointment.lab_technician) {
      const testNames = appointment.test_orders?.[0]?.test_types?.map(t => t.name).join(", ") || "Lab Tests";
      return testNames;
    }
    return "Appointment";
  };

  const getPatientName = (appointment) => {
    const patient = appointment.patient;
    const gender = patient.gender === "M" ? "Mr." : patient.gender === "F" ? "Miss." : "";
    return `${gender} ${patient.user.first_name} ${patient.user.last_name}`;
  };

  const getAppointmentTime = (appointment) => {
    if (appointment.time_slot) {
      return formatTime(appointment.time_slot.start_time);
    }
    const datetime = new Date(appointment.checkin_datetime);
    return datetime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).toLowerCase();
  };

  useEffect(() => {
    processAppointments();
  }, [currentDate, clinicAppointments, labAppointments, userRole]);

  return (
    <>
      <div className={styles.heading}>
        <div className={styles.blue}></div>
        <h4>{heading}</h4>
      </div>
      <div className={styles.contain}>
        <div className={styles.box}>
          <div className={styles.boxHeading}>
            <div className={styles.sec1}>
              <div className={styles.calendar}>
                <img src="/calendar.svg" alt="calendar icon" />
              </div>
              <div className={styles.topText}>
                <p>Next Checkup</p>
                <h5>
                  {nextAppointment ? 
                    formatWeekdayDate(nextAppointment.checkin_datetime) : 
                    "No upcoming"}
                </h5>
              </div>
            </div>

            <div className={styles.dateNav}>
              <button onClick={handlePrevDate} className={styles.navBtn}>
                <img src="/arrow-left.svg" alt="Previous date" />
              </button>
              <p>{formatDate(currentDate)}</p>
              <button onClick={handleNextDate} className={styles.navBtn}>
                <img src="/arrow-right.svg" alt="Next date" />
              </button>
            </div>

            <div className={styles.appointments}>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment, index) => (
                  <div key={index} className={styles.card}>
                    <img
                      src="profiles.png"
                      alt="profile"
                      className={styles.avatar}
                    />
                    <div>
                      <h6>{getPatientName(appointment)}</h6>
                      <p>
                        {getAppointmentTime(appointment)} |{" "}
                        {getAppointmentDescription(appointment)}
                      </p>
                      {/* Corrected condition for showing professional details */}
                      {(userRole === "patient" || userRole === "clinic_admin" || userRole === "lab_admin") && (
                        <p className={styles.professional}>
                          With: {getProfessionalName(appointment)}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.card}>
                  <p>No appointments scheduled for this date</p>
                </div>
              )}
            </div>

            {filteredAppointments.length > 0 && (
              <button className={styles.button}>
                {userRole === "patient" ? "View Details" : "Manage Appointments"}
                <img src="up.png" alt="arrow" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UpcomingAppointments;