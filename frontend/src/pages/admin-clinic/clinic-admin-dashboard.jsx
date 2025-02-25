import React from "react";
import Cards from "../../components/Dashboard/Cards/Cards";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import styles from "../../components/Dashboard/Dashboard.module.css";
import UpcomingTest from "../../components/Dashboard/UpcomingTest/UpcomingTest";
import CancellationRequestsList from "./cancellation-requests-list";
function ClinicAdminDashboard() {
  return (
    <div>
    <Navbar />
    
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <Header curUserRole={"Clinic Admin Dashboard"} genderPrefix={"Mr."}/>
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
        <CancellationRequestsList></CancellationRequestsList>
      </div>
    </div>
  );
}

export default ClinicAdminDashboard;
