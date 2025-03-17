import React, { useState, useEffect } from "react";
import axios from "axios";
import Popup from "../Popup.jsx";
import useCurrentUserData from "../../../useCurrentUserData.jsx";
import { getHeaders } from "../../../utils/utils.js";

const ManageSlotsPopup = () => {
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
      alert("Please enter all time fields.");
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
      alert("Please fill all fields.");
      return;
    }

    if (calculatedSlots.length === 0) {
      alert("Invalid slot configuration.");
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
      lab_tech_id: user?.user_id,
      start_date: startDate,
      end_date: endDate,
      time_slots: calculatedSlots,
      working_days: weekdays,
    };

    try {
      console.log("SENDING THIS TO MAKE SLOTS", payload);
      await axios.post(
        "http://127.0.0.1:8000/api/time_slots/",
        payload,
        getHeaders()
      );
      alert("Availability set successfully!");
    } catch (error) {
      console.error("Error setting availability:", error);
    }
  };

  return (
    <Popup trigger={popupTrigger} setTrigger={setPopupTrigger} onClose={onClose}>
      <div>
        <h2>Manage Availability</h2>
        <form onSubmit={handleSubmit}>
          <label>Select Month:</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          />

          <label>Select Consulting Days:</label>
          <div>
            {daysOfWeek.map((day) => (
              <button
                type="button"
                key={day}
                onClick={() => toggleDaySelection(day)}
                style={{
                  margin: "5px",
                  padding: "5px 10px",
                  backgroundColor: weekdays.includes(day) ? "green" : "gray",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {day}
              </button>
            ))}
          </div>

          <label>Start Time:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />

          <label>End Time:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />

          <label>Slot Duration (Minutes):</label>
          <input
            type="number"
            value={slotDuration}
            onChange={(e) => setSlotDuration(e.target.value)}
            min="5"
            required
          />

          <button type="button" onClick={generateSlots}>
            Generate Slots
          </button>

          {calculatedSlots.length > 0 && (
            <div>
              <h3>Generated Slots:</h3>
              <ul>
                {calculatedSlots.map((slot, index) => (
                  <li key={index}>
                    {slot.date} - {slot.start_time} to {slot.end_time}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button type="submit">Save Availability</button>
        </form>
      </div>
    </Popup>
  );
};

export default ManageSlotsPopup;
