import React from "react";
// import { useParams } from "react-router-dom";
import "./patient-profile-clinic-admin.Module.css";

const PatientProfileClinicAdmin = () => {
  // const { id } = useParams();

  const patientData = {
    id: 1,
    name: "Mr. John Doe",
    gender: "Male",
    email: "jhondoework@gmail.com",
    phone: "+10 123456789",
    dateOfBirth: "01/01/1990",
    address: "123 Main St, City, Country",
    occupation: "Accountant at XYZ Company",
  };

  return (
    <div className="page">
      <div className="sidebar">{/* Add your sidebar icons here */}</div>
 
      <div className="profile-assets">
        <div className="profile">
          <img src="/patient.png" alt="patient picture" />
          <div className="profile-info">
            <h2>{patientData.name}</h2>
            <p>{patientData.occupation}</p>
          </div>
          <div className="buttons">
            <button>Contact Patient</button>
            <button>Add Appointment</button>
          </div>
        </div>

        <div className="medical-info">
          <h3 className="section-title">Medical Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <h4>Schedule Appointment</h4>
              <p>10/10/2024 09:30 PM</p>
            </div>
            <div className="info-item">
              <h4>Special Notes</h4>
              <p>This Patient is deaf</p>
            </div>
            <div className="info-item">
              <h4>Diagnosed Conditions</h4>
              <p>No Conditions diagnosed</p>
            </div>
            <div className="info-item">
              <h4>Allergies</h4>
              <p>Allergic from XYZ</p>
            </div>
            <div className="info-item">
              <h4>Last Consultation With</h4>
              <p>Dr. John Doe</p>
            </div>
          </div>
        </div>

        <div className="disease-detection">
          <h3 className="section-title">Disease Detection</h3>
          <div className="info-grid">
            <div className="info-item">
              <h4>Detected Disease</h4>
              <p>Onychomycosis</p>
            </div>
            <div className="info-item">
              <h4>Scanned On</h4>
              <p>10/10/2024 09:30 AM</p>
            </div>
            <div className="info-item">
              <h4>Scanned By</h4>
              <p>Self-Scanned</p>
            </div>
            <div className="info-item">
              <h4>Area Affected</h4>
              <p>Thumb Nails</p>
            </div>
            <div className="info-item">
              <h4>Total Possible Conditions</h4>
              <p>3</p>
            </div>
          </div>
          <div className="progress-circles">
            <div className="progress-circle">98%</div>
            <div className="progress-circle">72%</div>
            <div className="progress-circle">42%</div>
          </div>
        </div>

        <div className="test-report">
          <h3 className="section-title">Test Reports</h3>
          <table>
            <thead>
              <tr>
                <th>Test Type</th>
                <th>Date Reported</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="test-info">
                    <h4>CBC Report</h4>
                    <p>By Tech. Jane Doe</p>
                  </div>
                </td>
                <td>10/10/2024</td>
                <td>
                  <button>View Report</button>
                </td>
              </tr>
              {/* Repeat for other reports */}
            </tbody>
          </table>
        </div>

        <div className="contact-info">
          <h3 className="section-title">Contact Information</h3>
          <div className="contact-grid">
            <div className="contact-item">
              <h4>Phone</h4>
              <p>{patientData.phone}</p>
            </div>
            <div className="contact-item">
              <h4>Email</h4>
              <p>{patientData.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileClinicAdmin;
