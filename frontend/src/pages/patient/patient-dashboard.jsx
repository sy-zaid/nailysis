import React from "react";
import Cards from "../../components/Dashboard/Cards/Cards";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import styles from "../../components/Dashboard/Dashboard.module.css";
import UpcomingTest from "../../components/Dashboard/UpcomingTest/UpcomingTest";
import useCurrentUserData from "../../useCurrentUserData";


function PatientDashboard() {
  const { data: curUser } = useCurrentUserData();

  // Fallbacks in case data isn't loaded yet
  const user = (curUser && curUser.length > 0) ? curUser[0] : {};
  const fullName = `${user.first_name || ""} ${user.last_name || ""}`;
  const role = user.role || "Patient";

  return (
    <div>
      <Navbar />
      <Header 
        mainHeading={`Welcome, ${fullName}`}
        subHeading={`${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`}
      />
      <div className={styles.main}>
        <div className={styles.cards}>
          <Cards heading="Patients" />
          <Cards heading="Requests" />
          <Cards heading="Payments" />
          <Cards heading="Reports" />
        </div>
        <UpcomingTest />
      </div>
    </div>
  );
}

export default PatientDashboard;
