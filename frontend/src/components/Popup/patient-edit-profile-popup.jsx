import React from "react";
import styles from "./all-popups-styles.module.css";
import otherStyles from "./patient-edit-profile.module.css"
import Popup from "./Popup";
import { useState, useEffect  } from "react";
import { getStatusClass } from "../../utils/utils";

const PopupEditProfile = ({ onClose }) => {
    const [popupTrigger, setPopupTrigger] = useState(true);
    
    return (
        
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger} onClose={onClose} customClass="editProfilePopup">
        <div className={otherStyles.formContainer}>
          
            <div className={styles.headerSection}>

                <div className={styles.titleSection}>
                    <h2>Edit Profile</h2> 
                    <p>Update your profile details and save changes when done.</p>
                </div>

            </div>

        <hr />


        <div className={styles.popupBottom}>

            <div className={otherStyles.profileSection}>
              <img src="/background.png" 
                  alt="patient picture"
                  className={otherStyles.backgroundPicture} 
              />

              <i className={`fa-solid fa-pen ${otherStyles.editBanner}`}></i>

              <p className={`${styles.subHeading} ${otherStyles.email}`}>patient0@example.com</p>

              <div className={otherStyles.profilePictureWrapper}>
                <img src="/patient.png"
                    alt="patient picture"
                    className={otherStyles.profilePicture} 
                />
                  <div className={otherStyles.profileIcons}>
                    <i className="fa-solid fa-pen"></i>
                    <i class="fa-solid fa-trash"></i>
                  </div>
              </div>
            </div>

            <hr />

            <div className={styles.formSection}>
                <h3><i className="fa-solid fa-circle fa-2xs"></i> Edit Personal Details</h3>    
                    <div className={styles.formGroup}>
                      <div>
                        <label>First Name</label>
                        <input type="text" placeholder="Colleen" className={`${styles.subHeading} ${styles.inputField}`} />
                      </div>
                      <div>
                        <label>Last Name</label>
                        <input type="text"  placeholder="Hardin" className={`${styles.subHeading} ${styles.inputField}`} />
                      </div>
                      <div>
                        <label>Phone</label>
                        <input type="tel"  placeholder="0330-1234-123" className={`${styles.subHeading} ${styles.inputField}`} required  />
                      </div>
                      <div>
                        <label>Emergency Contact</label>
                        <input type="tel" placeholder="0330-1234-123" className={`${styles.subHeading} ${styles.inputField}`}/>
                      </div>
                      
                      <div>
                        <label>Date of Birth</label>
                        <input type="date" className={otherStyles.dateOfBirthField} required />
                      </div>
                      <div>
                        <label>Address</label>
                        <input type="text" placeholder="221B Baker Street" className={`${styles.subHeading} ${styles.inputField}`} />
                      </div>

                      <div>
                        <label>Gender</label>
                        <div className={otherStyles.radioGroup}>
                          <div className={otherStyles.radioRow}>
                            <label>
                              <input type="radio" name="gender" value="M" defaultChecked required />
                              Male
                            </label>
                            <label>
                              <input type="radio" name="gender" value="F" required />
                              Female
                            </label>
                            <label>
                              <input type="radio" name="gender" value="O" required />
                              Other
                            </label>
                          </div>

                          <div className={otherStyles.singleRadio}>
                            <label>
                              <input type="radio" name="gender" value="P" required />
                              Prefer Not to Say
                            </label>
                          </div>
                        </div>
                      </div>

                    </div>
            </div>

            <hr />

            <div className={styles.actions}>
              <button className={styles.cancelButton} onClick={onClose}>
                Cancel
              </button>
              <button className={styles.addButton}>
                Save Changes
              </button>
            </div>
          
        </div>
      </div>
    </Popup>


  );
};

export default PopupEditProfile;
