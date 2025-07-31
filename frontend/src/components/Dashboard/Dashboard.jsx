import React from "react";
import Cards from "./Cards/Cards";
import Navbar from "./Navbar/Navbar";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import styles from "./Dashboard.module.css";
import UpcomingAppointments from "./UpcomingAppointments/UpcomingAppointments";

const Dashboard = () => {
  return (
    <div>
    <Navbar />
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <Header />
        <select className={styles.dropdown}>
          <option value="oneMonth">One Month</option>
          <option value="threeMonths">Three Months</option>
          <option value="sixMonths">Six Months</option>
        </select>
      </div>
    </div>
      <div className={styles.main}>
        <Sidebar />
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
};

export default Dashboard;
