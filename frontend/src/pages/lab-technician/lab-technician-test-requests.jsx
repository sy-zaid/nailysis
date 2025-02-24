
import React, { useState, useRef, useEffect } from 'react';
import styles from "../../components/CSS Files/LabTechnician.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import Header from "../../components/Dashboard/Header/Header";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import Popup from "../../components/Popup/Popup.jsx";


const TestRequests = (props) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef(null);

  const [activeButton, setActiveButton] = useState(0); 

  const [testDetailsPopup, setTestDetailsPopup] = useState(false);

  const handleAddNewTest = () => {
    setTestDetailsPopup(true);
  };

  const data = [
    {
        id: 1,
        testID: "123456",
        patientName: "John",
        doctorName: "Dr. Carl",
        testType: "Urinalysis",
        requestDate: "11/11/2024",
        collectedOn: "11/11/2024",
        priority: "Urgent",
        price: "PKR. 500",
        payment: "Bank Al Habib",
        status: "Completed"
    },

    {
        id: 2,
        testID: "123456",
        patientName: "Doe",
        doctorName: "Dr. Carl",
        testType: "CBC",
        requestDate: "11/11/2024",
        collectedOn: "Pending",
        priority: "STAT",
        price: "PKR. 500",
        payment: "Bank Al Habib",
        status: "Cancelled"
    },
  ];


  const testParameters = {
    Hemoglobin: {
      normalRange: "13.5 - 17.5",
      unit: "g/dL",
    },
    WBC: {
      normalRange: "4,500 - 11,000",
      unit: "cells/mcL",
    },
    Platelets: {
      normalRange: "150,000 - 450,000",
      unit: "platelets/mcL",
    },
  };
  
  const [testEntries, setTestEntries] = useState([
    { parameter: "Hemoglobin", result: "" },
    { parameter: "WBC", result: "" },
    { parameter: "Platelets", result: "" },
    { parameter: "Hemoglobin", result: "" },
  ]);
  
  
    const handleParameterChange = (index, newParameter) => {
      setTestEntries((prevEntries) =>
        prevEntries.map((entry, i) =>
          i === index ? { ...entry, parameter: newParameter } : entry
        )
      );
    };
  
    const handleResultChange = (index, newResult) => {
      setTestEntries((prevEntries) =>
        prevEntries.map((entry, i) =>
          i === index ? { ...entry, result: newResult } : entry
        )
      );
    };

    const handleAddParameter = () => {
      setTestEntries((prevEntries) => [
        ...prevEntries,
        { parameter: "Hemoglobin", result: "" }, // Default new parameter
      ]);
    };

    const handleRemoveParameter = (index) => {
      setTestEntries((prevEntries) =>
        prevEntries.length > 1 ? prevEntries.filter((_, i) => i !== index) : prevEntries
      );
    };
    




  const handleFilterClick = (index) => {
    setActiveButton(index); // Set the active button when clicked
  };


  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return styles.consulted;
      case "Cancelled":
        return styles.cancelled;
      case "Scheduled":
        return styles.scheduled;
      case "Pending":
        return styles.scheduled;
      case "Urgent":
        return styles.cancelled;
      default:
        return {};
    }

  }
  
  const togglePopup = (event) => {
    const iconRect = event.target.getBoundingClientRect();
    setPopupPosition({
      top: iconRect.top + window.scrollY + iconRect.height + 5, // Adjust for scroll position
      left: iconRect.left + window.scrollX - 95, // Adjust for horizontal scroll
    });
    setPopupVisible(!popupVisible);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    
    <div className={styles.pageContainer}>


    {/* Enter Test Details Popup */}
    <Popup trigger={testDetailsPopup} setTrigger={setTestDetailsPopup}>
        <div className={styles.formContainer}>
          
          <div className={styles.tophead}>
              <div className={styles.header}>
                <h2>Enter Test Details For Patient: John Doe (Patient ID: 12345)</h2>
              </div>

              <div className={styles.subhead}>
                <h5 style={{margin: "10px 0"}}>
                  Enter the patient's test details to proceed with documentation and results.
                </h5>
              </div>

              <hr />
          </div>
          
          

          <p className={styles.newSubHeading}>
            <span className={styles.key}> Viewed By: </span>
            <span className={styles.locationValue}>Tech. Jane Doe</span>
            <span className={styles.secKey}> Status: </span>
            <span className={getStatusClass("Pending")}>In-Progress</span>
          </p>
          
          <p className={styles.newSubHeading}>
            <span className={styles.key}> Issuance Date & Time: </span>
            <span className={styles.locationValue}>10/10/2024 09:30 AM</span>
          </p>

          <hr style={{margin: "20px 0 0 0"}}/>

          <div className={styles.formSection} style={{margin: "-20px 0 0 0"}}>
              <br />
                    <h3><i class="fa-solid fa-circle fa-2xs" style={{color: "#007bff", marginRight: "10px"}}></i> Test Details</h3>
                    <div className={styles.newFormGroup}>
                      <div>
                        <label>Report ID</label>
                        <p className={styles.subHeading}>123456</p>
                      </div>

                      <div>
                        <label>Technician</label>
                        <p className={styles.subHeading}>John Doe</p>
                      </div>

                      <div>
                        <label>Blood Type</label>
                        <p className={styles.subHeading}>Blood Test</p>
                      </div>

                      <div>
                        <label>Sample Type</label>
                          <select className={styles.patientSelect}>
                            <option>Blood</option>
                          </select>
                      </div>

                      <div>
                        <label>Date & Time of Test</label>
                        <p className={styles.subHeading}>12/9/2024 05:30 PM</p>
                      </div>

                      <div>
                        <label>Status</label>
                          <select className={`${styles.patientSelect} ${getStatusClass("Completed")}`}>
                            <option>Completed</option>
                          </select>
                      </div>

                      <div>
                        <label>Test Fee</label>
                        <p className={styles.subHeading}>RS/- 5000</p>
                      </div>

                    </div>
            </div>

            <hr />

            <div className={styles.formSection}>
                    <h3><i class="fa-solid fa-circle fa-2xs" style={{color: "#007bff", marginRight: "10px"}}></i> Test Result Entry</h3>
                    {testEntries.map((entry, index) => (
        <div key={index} className={styles.testParamFormGroup}>
          <div>
            <label>Parameter Name</label>
            <select
              className={styles.patientSelect}
              value={entry.parameter}
              onChange={(e) => handleParameterChange(index, e.target.value)}
            >
              {Object.keys(testParameters).map((param) => (
                <option key={param} value={param}>
                  {param}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Normal Range</label>
            <select>
              <option>{testParameters[entry.parameter].normalRange}</option>
            </select>
          </div>

          <div>
            <label>Results</label>
            <input
              type="text"
              placeholder="Enter result"
              value={entry.result}
              onChange={(e) => handleResultChange(index, e.target.value)}
            />
          </div>

          <div>
            <label>Units</label>
            <select>
              <option>{testParameters[entry.parameter].unit}</option>
            </select>
          </div>

          {/* Remove Button */}
          <div>
            <button className={styles.cancelButton} onClick={() => handleRemoveParameter(index)}
              style={{marginTop: "20px"}}>
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
        <button className={styles.addButton} onClick={handleAddParameter} style={{zIndex: "100"}}>
          <i class='bx bx-plus-circle'></i> Add More Parameters
        </button>
      </div>

      <hr style={{borderColor: "#007bff", marginTop: "-18px", zIndex: "50" }}/>
    </div>


          <hr  style={{marginTop: "50px"}}/>

          <div className={styles.commentsFormSection}>
            <h3><i class="fa-solid fa-circle fa-2xs" style={{color: "#007bff", marginRight: "10px"}}></i> Comments/Observations</h3>
            <div className={styles.documentFormGroup}>
              <div>
                <textarea defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit"></textarea>
              </div>
            </div>
          </div>


          <div className={styles.formSection}>
            <h3><i class="fa-solid fa-circle fa-2xs" style={{color: "#007bff", marginRight: "10px"}}></i> Verification</h3>
            <div className={styles.documentFormGroup}  style={{marginRight: "65px"}}>
              <div>
                <p style={{color: "#737070", fontWeight: "600"}}>Consent</p>
                <p style={{fontStyle: "italic", fontSize: "14px"}}>Tech. Naeem Iqbal</p>
                <p style={{fontStyle: "italic", color: "#737070", fontSize: "14px"}}>MBBS, FCPS</p>
              </div>
              <div>
                <p style={{color: "#737070", fontWeight: "600"}}>Date of Verification</p>
                <p style={{fontStyle: "italic", fontSize: "14px"}}>12/09/2024</p>
              </div>
            </div>
            
            <div className={styles.verificationConfirmation}>
              <p><input type="checkbox" /> <span>I confirm that the results entered are accurate and complete to the best of my knowledge.</span> </p> 
            </div>

            <br />
            <br />

            <p className={styles.computerReportMessage}>This is a computer generated report and does not require any signatures.</p>
            <hr />

            <br />

          </div>


          <div className={styles.newActions}>
            <button className={styles.addButton} >
              <i class="fa-regular fa-file-pdf"></i> Download PDF
            </button>
            <button className={styles.addButton}>
              <i class="fa-regular fa-floppy-disk"></i> Save Results
            </button>
          </div>
        </div>
    </Popup>



      <div className={styles.pageTop}>
        <Navbar />
        <Header 
            mainHeading={'Test Requests'}
            subHeading={'Here are all the test requests from doctors'}
          />
      </div>
      <div className={styles.mainContent}>

        <div className={styles.appointmentsContainer}>
          <div className={styles.filters}>
          <button
              className={`${styles.filterButton} ${activeButton === 0 ? styles.active : ''}`}
              onClick={() => handleFilterClick(0)}
            >
              All
            </button>
            <button
              className={`${styles.filterButton} ${activeButton === 1 ? styles.active : ''}`}
              onClick={() => handleFilterClick(1)}
            >
              Pending
            </button>
            <button
              className={`${styles.filterButton} ${activeButton === 2 ? styles.active : ''}`}
              onClick={() => handleFilterClick(2)}
            >
              Completed
            </button>
            <button
              className={`${styles.filterButton} ${activeButton === 3 ? styles.active : ''}`}
              onClick={() => handleFilterClick(3)}
            >
              Cancelled
            </button>
            <p>50 completed, 4 pending</p>
            
            <button className={styles.addButton} onClick={handleAddNewTest}>
              <i class='bx bx-plus-circle'></i> Add New Test
            </button>

          </div>
          
          <div className={styles.tableContainer}>
            <div className={styles.controls}>
              <select className={styles.bulkAction}>
                <option>Bulk Action: Delete</option>
              </select>
              <select className={styles.sortBy}>
                <option>Sort By: Ordered Today</option>
              </select>
              <input
                className={styles.search}
                type="text"
                placeholder="Search By Patient Name" 
              /> 
            </div>
            <hr />
            <br />
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>#</th>
                  <th >testID</th>
                  <th>Patient Name</th>
                  <th>Doctor Name</th>
                  <th>Test Type</th>
                  <th>Request Date</th>
                  <th>Collected On</th>
                  <th>Priority</th>
                  <th>Price</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td data-label="#">{row.id}</td>
                    <td data-label="Test ID">{row.testID}</td>
                    <td data-label="Patient Name">{row.patientName}</td>
                    <td data-label="Doctor Name">{row.doctorName}</td>
                    <td data-label="Test Type">{row.testType}</td>
                    <td data-label="Request Date">{row.requestDate}</td>
                    <td data-label="Collected On" className={getStatusClass(row.collectedOn)}>{row.collectedOn}</td>
                    <td data-label="Priority" className={getStatusClass(row.priority)}>{row.priority}</td>
                    <td data-label="Price">{row.price}</td>
                    <td data-label="Payment">{row.payment}</td>
                    
                    <td data-label="Status" className={getStatusClass(row.status)}>{row.status}</td>

                    <td style={{ position: "relative" }}>
                      <i
                        className="bx bx-dots-vertical-rounded"
                        style={{ cursor: "pointer"}}
                        onClick={togglePopup}
                      ></i>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Popup */}
      {popupVisible && (
        <div
          ref={popupRef}
          style={{
            position: "absolute",
            top: popupPosition.top,
            left: popupPosition.left,
            background: "white",
            border: "1px solid #ccc",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            padding: "10px",
            borderRadius: "10px",
            zIndex: 1000,
          }}
        >
          <p
            style={{ margin: "10px 0", cursor: "pointer" }}
          >
            <i class="fa-solid fa-repeat" style={{margin: "0 5px 0 0"}}></i> Change Priority
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            <i class="fa-solid fa-pen" style={{margin: "0 5px 0 0"}}></i> Edit Details
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            <i class="fa-regular fa-circle-xmark" style={{ color: "red", margin: "0 5px 0 0"}}></i> Delete
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            <i class="fa-regular fa-file-pdf" style={{margin: "0 5px 0 0"}}></i> Download as PDF
          </p>
          <p style={{ margin: "10px 0", cursor: "pointer" }}>
            <i class="bx bx-qr-scan" style={{margin: "0 5px 0 0"}}></i> Print Code
          </p>

        </div>
      )}
    </div>
    
  );
};

export default TestRequests;
