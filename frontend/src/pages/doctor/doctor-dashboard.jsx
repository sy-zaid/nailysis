import React from "react";
import Cards from "../../components/Dashboard/Cards/Cards";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import styles from "../../components/Dashboard/Dashboard.module.css";
import UpcomingTest from "../../components/Dashboard/UpcomingTest/UpcomingTest";

function DoctorDashboard() {
    return (
        <div>
          <Navbar />
          <Header curUserRole={'Doctor'}/>
          <div className={styles.main}>
            
            <div className={styles.cards}>
              <Cards heading="Doctors" />
              <Cards heading="Requests" />
              <Cards heading="Payments" />
              <Cards heading="Reports" />
            </div>
            <UpcomingTest />
          </div>
        </div>
      );
}

export default DoctorDashboard;