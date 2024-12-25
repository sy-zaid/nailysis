import React from "react";
import Cards from "../../components/Dashboard/Cards/Cards";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import styles from "../../components/Dashboard/Dashboard.module.css";
import UpcomingTest from "../../components/Dashboard/UpcomingTest/UpcomingTest";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../constants";
import { jwtDecode } from "jwt-decode";

function ClinicAdminDashboard() {
  const token = localStorage.getItem(ACCESS_TOKEN);
  const decoded = jwtDecode(token);
  const userRole = decoded.role || null;

    return (
        <div>
          <Navbar />
          <Header curUserRole={"Clinic Admin Dashboard"} genderPrefix={"Mr."} />
          <div className={styles.main}>
            <Sidebar userRole={userRole}/>
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

export default ClinicAdminDashboard;