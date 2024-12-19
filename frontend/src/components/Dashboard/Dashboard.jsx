import React from "react";
import Cards from "./Cards/Cards";
import Navbar from "./Navbar/Navbar";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import styles from "./Dashboard.module.css";
import UpcomingTest from "./UpcomingTest/UpcomingTest";

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <Header />
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
