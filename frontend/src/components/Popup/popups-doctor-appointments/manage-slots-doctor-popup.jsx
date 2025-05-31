import React, { useState, useEffect } from "react";
import axios from "axios";
import Popup from "../Popup.jsx";
import useCurrentUserData from "../../../useCurrentUserData.jsx";
import { getHeaders, getTodayDate, } from "../../../utils/utils.js";
import styles from "./manage-slots-popup.module.css";
import { toast } from "react-toastify";

const ManageSlotsPopup = ({ onClose }) => {
  const [popupTrigger, setPopupTrigger] = useState(true);
  const { data: curUser } = useCurrentUserData();
  const [user, setUser] = useState();
  const [weekdays, setWeekdays] = useState([]);
  const [month, setMonth] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slotDuration, setSlotDuration] = useState("");
  const [calculatedSlots, setCalculatedSlots] = useState([]);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    if (curUser && curUser.length > 0) {
      setUser(curUser[0]);
    }
  }, [curUser]);

  const toggleDaySelection = (day) => {
    setWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const generateSlots = () => {
    if (!startTime || !endTime || !slotDuration) {
      toast.warning("Please enter all time fields.");
      return;
    }

    const slotDur = parseInt(slotDuration, 10);
    if (slotDur <= 0) {
      toast.warning("Slot duration must be greater than 0 minutes.");
      return;
    }

    const start = new Date();
    start.setHours(...startTime.split(":").map(Number), 0); // Set hours & minutes
    const end = new Date();
    end.setHours(...endTime.split(":").map(Number), 0);

    const duration = parseInt(slotDuration, 10);
    let slots = [];
    let currentTime = new Date(start);

    while (currentTime < end) {
      let nextTime = new Date(currentTime);
      nextTime.setMinutes(nextTime.getMinutes() + duration);

      if (nextTime <= end) {
        slots.push({
          start_time: currentTime.toTimeString().substring(0, 5),
          end_time: nextTime.toTimeString().substring(0, 5),
        });
      }

      currentTime = nextTime;
    }

    console.log("Generated Slots:", slots);
    setCalculatedSlots(slots);
    toast.success("Slots generated successfully!");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !month ||
      weekdays.length === 0 ||
      !startTime ||
      !endTime ||
      !slotDuration
    ) {
      toast.warning("Please fill all fields.");
      return;
    }

    if (calculatedSlots.length === 0) {
      toast.warning("Invalid slot configuration.");
      return;
    }

    // Extract year and month from input
    const [year, selectedMonth] = month.split("-").map(Number);

    // First and last day calculations (without .toISOString())
    const firstDay = new Date(year, selectedMonth - 1, 1);
    const lastDay = new Date(year, selectedMonth, 0);

    // Format as YYYY-MM-DD manually
    const formatDate = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;

    const startDate = formatDate(firstDay);
    const endDate = formatDate(lastDay);

    console.log("Selected Month:", month);
    console.log("Computed Start Date:", startDate);
    console.log("Computed End Date:", endDate);

    const payload = {
      doctor_id: user?.user_id,
      start_date: startDate,
      end_date: endDate,
      time_slots: calculatedSlots,
      working_days: weekdays,
    };

    try {
      console.log("SENDING THIS TO MAKE SLOTS", payload);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/time_slots/`,
        payload,
        getHeaders()
      );
      toast.success("Availability set successfully!", {className: "custom-toast",});
      onClose();
    } catch (error) {
      console.error("Error setting availability:", error);
      if (error.response) {
        toast.error(error.response.data.error || "Failed to book appointment", {
          className: "custom-toast",
        });
      } 
    }
  };

  const getMonthValue = (offset = 0) => {
    const now = new Date();
    now.setMonth(now.getMonth() + offset);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };
  
  const minMonth = getMonthValue(0); 
  const maxMonth = getMonthValue(2); 
  

  return (
    <Popup
      trigger={popupTrigger}
      setTrigger={setPopupTrigger}
      onClose={onClose}
    >
      <div className={styles.modalContent}>
        <h2>Manage Availability</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Select Month:</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
              className={styles.formInput}
              min={minMonth}
              max={maxMonth}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Select Consulting Days:</label>
            <div className={styles.daysContainer}>
              {daysOfWeek.map((day) => (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDaySelection(day)}
                  className={`${styles.dayButton} ${
                    weekdays.includes(day) ? styles.dayActive : ""
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.timeControls}>
            <div className={styles.formGroup}>
              <label>Start Time:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>End Time:</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Slot Duration (Minutes):</label>
              <input
                type="number"
                value={slotDuration}
                onChange={(e) => setSlotDuration(e.target.value)}
                min="5"
                required
                className={styles.formInput}
              />
            </div>
          </div>

          <div className={styles.generateButtonWrap}>
            <button
              type="button"
              onClick={generateSlots}
              className={styles.generateButton}
            >
              Generate Slots
            </button>
          </div>

          {calculatedSlots.length > 0 && (
            <div className={styles.slotsContainer}>
              <h3>Generated Slots:</h3>
              <ul className={styles.slotsList}>
                {calculatedSlots.map((slot, index) => (
                  <li key={index} className={styles.slotItem}>
                    {slot.start_time} to {slot.end_time}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {calculatedSlots.length > 0 && (
            <div className={styles.buttonWrap}>
              <button type="submit" className={styles.submitButton}>
                Save Availability
              </button>
            </div>
          )}
        </form>
      </div>
    </Popup>
  );
};

export default ManageSlotsPopup;
