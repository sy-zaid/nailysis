import React, { useState, useEffect, useMemo } from "react";
import styles from "./UpcomingAppointments.module.css";

const UpcomingAppointments = ({ 
  heading = "My Schedule", 
  clinicAppointments = [], 
  labAppointments = [],
  userRole = "patient" 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Get the initial date based on upcoming appointments (for patients only)
  useEffect(() => {
    if (userRole === "patient") {
      const allAppointments = [...clinicAppointments, ...labAppointments];
      const now = new Date();
      
      // Find all upcoming appointments
      const upcomingAppointments = allAppointments
        .filter(appt => appt.status === "Scheduled")
        .filter(appt => appt.checkin_datetime && new Date(appt.checkin_datetime) > now)
        .sort((a, b) => {
          const dateA = new Date(a.checkin_datetime);
          const dateB = new Date(b.checkin_datetime);
          return dateA - dateB;
        });
      
      // If there are upcoming appointments, set the current date to the first one's date
      if (upcomingAppointments.length > 0) {
        const firstUpcomingDate = new Date(upcomingAppointments[0].checkin_datetime);
        setCurrentDate(new Date(firstUpcomingDate.setHours(0, 0, 0, 0)));
      }
    }
  }, [clinicAppointments, labAppointments, userRole]);

  // Memoize the processed appointments to avoid unnecessary recalculations
  const { filteredAppointments, nextAppointment } = useMemo(() => {
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
        const apptDate = appt.checkin_datetime ? new Date(appt.checkin_datetime).toDateString() : null;
        const currentDateStr = currentDate.toDateString();
        return apptDate === currentDateStr;
      })
      .sort((a, b) => {
        const dateA = a.checkin_datetime ? new Date(a.checkin_datetime) : 0;
        const dateB = b.checkin_datetime ? new Date(b.checkin_datetime) : 0;
        return dateA - dateB;
      });

    const now = new Date();
    const upcoming = appointments
      .filter(appt => appt.status === "Scheduled")
      .filter(appt => appt.checkin_datetime && new Date(appt.checkin_datetime) > now)
      .sort((a, b) => {
        const dateA = new Date(a.checkin_datetime);
        const dateB = new Date(b.checkin_datetime);
        return dateA - dateB;
      })[0];

    return {
      filteredAppointments: filtered.slice(0, 3),
      nextAppointment: upcoming
    };
  }, [currentDate, clinicAppointments, labAppointments, userRole]);

  // Rest of the component remains the same...
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
    if (!dateString) return "No upcoming";
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

  const getProfessionalName = (appointment) => {
    if (appointment.doctor) {
      return `Dr. ${appointment.doctor.user.first_name} ${appointment.doctor.user.last_name}`;
    } else if (appointment.lab_technician) {
      return `${appointment.lab_technician.user.first_name} ${appointment.lab_technician.user.last_name}`;
    }
    return "";
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
    if (!patient || !patient.user) return "Unknown Patient";
    const gender = patient.gender === "M" ? "Mr." : patient.gender === "F" ? "Miss." : "";
    return `${gender} ${patient.user.first_name} ${patient.user.last_name}`;
  };

  const getAppointmentTime = (appointment) => {
    if (appointment.time_slot) {
      return formatTime(appointment.time_slot.start_time);
    }
    if (!appointment.checkin_datetime) return "";
    const datetime = new Date(appointment.checkin_datetime);
    return datetime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).toLowerCase();
  };

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
                  {formatWeekdayDate(nextAppointment?.checkin_datetime)}
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