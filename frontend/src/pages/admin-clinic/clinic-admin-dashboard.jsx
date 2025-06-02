import React from "react";
import Cards from "../../components/Dashboard/Cards/Cards";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import styles from "../../components/Dashboard/Dashboard.module.css";
import UpcomingTest from "../../components/Dashboard/UpcomingTest/UpcomingTest";
import CancellationRequestsList from "./cancellation-requests-list";
import useCurrentUserData from "../../useCurrentUserData";

function ClinicAdminDashboard() {

  const { data: curUser } = useCurrentUserData();

  // Fallbacks in case data isn't loaded yet
  const user = (curUser && curUser.length > 0) ? curUser[0] : {};
  const fullName = `${user.first_name || ""} ${user.last_name || ""}`;
  const role = user.role || "Clinic Admin";

  return (
    <div>
    <Navbar />
    
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <Header 
          mainHeading={`Welcome, ${fullName}`}
          subHeading={`${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`}
        />
        <select className={styles.dropdown}>
          <option value="oneMonth">One Month</option>
          <option value="threeMonths">Three Months</option>
          <option value="sixMonths">Six Months</option>
          
        </select>
      </div>
    </div>
      <div className={styles.main}>
        <div className={styles.cards}>
          <Cards heading="Patients" />
          <Cards heading="Requests" />
          <Cards heading="Payments" />
          <Cards heading="Reports" />
        </div>
        <UpcomingTest />
        {/* <CancellationRequestsList></CancellationRequestsList> */}
      </div>
    </div>
  );
}

export default ClinicAdminDashboard;
