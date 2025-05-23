import React, { useEffect, useState, useMemo } from "react";
import styles from "./patient-health-history.module.css";
import Navbar from "../../components/Dashboard/Navbar/Navbar";
import {
  formatMedicalHistoryEpisodes,
  toggleActionMenu,
  getRole,
} from "../../utils/utils.js";
import useCurrentUserData from "../../useCurrentUserData.jsx";
import { getMedicalHistory } from "../../api/ehrApi";
import Select from "react-select";
import { useAllPatients } from "../../api/usersApi.js";

const PatientHealthHistory = () => {
  const [menuOpen, setMenuOpen] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filter, setFilter] = useState("all");
  const curUserRole = getRole();
  const { data: curUser } = useCurrentUserData();
  const [selectedRows, setSelectedRows] = useState([]);
  const { data: patientsData, isLoading, error } = useAllPatients();

  const formattedPatients = useMemo(() => {
    return (
      patientsData?.map((patient) => ({
        value: patient.user.user_id,
        label: `${patient.user.first_name} ${patient.user.last_name}`,
        details: patient,
      })) || []
    );
  }, [patientsData]);

  const fetchData = async () => {
    try {
      let response;
      if (curUserRole === "doctor" || curUserRole === "clinic_admin") {
        response = await getMedicalHistory();
      } else if (curUserRole === "patient") {
        response = await getMedicalHistory(curUser[0].user_id);
      }

      // Access the data property of the Axios response
      const { formattedEpisodes, uniquePatients } =
        formatMedicalHistoryEpisodes(response.data);

      setEpisodes(formattedEpisodes);
      setPatients(uniquePatients);

      if (uniquePatients.length > 0 && !selectedPatient) {
        setSelectedPatient(uniquePatients[0].id);
      }
    } catch (error) {
      console.error("Error fetching medical history:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredEpisodes = episodes.filter((episode) => {
    const patientMatch = selectedPatient
      ? episode.patient_id === selectedPatient
      : true;
    const statusMatch =
      filter === "all"
        ? true
        : filter === "ongoing"
        ? episode.is_ongoing
        : filter === "resolved"
        ? !episode.is_ongoing
        : true;

    return patientMatch && statusMatch;
  });

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(filteredEpisodes.map((episode) => episode.id));
    } else {
      setSelectedRows([]);
    }
  };

  const toggleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const getEpisodeIcon = (type) => {
    const icons = {
      Condition: "🩺",
      Medication: "💊",
      Immunization: "💉",
      Allergy: "⚠️",
      Surgery: "🩹",
      Injury: "🤕",
      Family: "👪",
      Other: "📄",
    };
    return icons[type] || "📄";
  };

  const getStatusBadge = (isOngoing) => {
    return (
      <span
        className={`${styles.statusBadge} ${
          isOngoing ? styles.ongoing : styles.resolved
        }`}
      >
        {isOngoing ? "Ongoing" : "Resolved"}
      </span>
    );
  };

  const handlePatientChange = (selected) => {
    setSelectedPatient(selected?.value || null);
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.header}>
        <div>
          <h1>Patient Medical Episodes</h1>
          <p>View and manage patient medical history in episodic format</p>
        </div>
        <button className={styles.addButton}>+ Add New Episode</button>
      </div>

      <div className={styles.filtersContainer}>
        <div className={styles.patientFilter}>
          <label>Patient:</label>
          <div style={{ width: "300px" }}>
            <Select
              options={formattedPatients}
              isSearchable
              onChange={handlePatientChange}
              placeholder="Search & select patient"
              styles={{
                control: (base) => ({
                  ...base,
                  border: "none",
                  borderBottom: "2px solid #1E68F8",
                  borderRadius: "none",
                  padding: "0",
                  outline: "none",
                }),
                option: (base, state) => ({
                  ...base,
                  color: state.isSelected ? "white" : "black",
                  cursor: "pointer",
                  outline: "none",
                  padding: "5px",
                }),
              }}
            />
          </div>
        </div>

        <div className={styles.statusFilters}>
          <button
            className={`${styles.statusFilter} ${
              filter === "all" ? styles.active : ""
            }`}
            onClick={() => setFilter("all")}
          >
            All Episodes
          </button>
          <button
            className={`${styles.statusFilter} ${
              filter === "ongoing" ? styles.active : ""
            }`}
            onClick={() => setFilter("ongoing")}
          >
            Ongoing
          </button>
          <button
            className={`${styles.statusFilter} ${
              filter === "resolved" ? styles.active : ""
            }`}
            onClick={() => setFilter("resolved")}
          >
            Resolved
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.tableActions}>
          <div className={styles.bulkActions}>
            <label className={styles.checkboxContainer}>
              <input
                type="checkbox"
                onChange={toggleSelectAll}
                checked={
                  selectedRows.length === filteredEpisodes.length &&
                  filteredEpisodes.length > 0
                }
              />
              <span className={styles.checkmark}></span>
            </label>
            <span>
              Bulk Action:{" "}
              {selectedRows.length > 0
                ? `(${selectedRows.length} selected)`
                : ""}
            </span>
            {selectedRows.length > 0 && (
              <>
                <button className={styles.bulkButton}>Resolve Selected</button>
                <button className={styles.bulkButton}>Delete Selected</button>
              </>
            )}
          </div>
          <div className={styles.searchSort}>
            <div className={styles.sortBy}>
              <select>
                <option>Sort By: Start Date (Newest)</option>
                <option>Start Date (Oldest)</option>
                <option>Episode Type</option>
                <option>Patient Name</option>
              </select>
            </div>
            <div className={styles.search}>
              <input type="text" placeholder="Search episodes..." />
            </div>
          </div>
        </div>

        <div className={styles.episodesContainer}>
          {filteredEpisodes.length > 0 ? (
            <table className={styles.episodesTable}>
              <thead>
                <tr>
                  <th></th>
                  <th>Episode</th>
                  <th>Patient</th>
                  <th>Details</th>
                  <th>Dates</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEpisodes.map((episode) => (
                  <tr key={episode.id}>
                    <td>
                      <label className={styles.checkboxContainer}>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(episode.id)}
                          onChange={() => toggleRowSelect(episode.id)}
                        />
                        <span className={styles.checkmark}></span>
                      </label>
                    </td>
                    <td>
                      <div className={styles.episodeType}>
                        <span className={styles.episodeIcon}>
                          {getEpisodeIcon(episode.episode_type)}
                        </span>
                        <div>
                          <strong>{episode.episode_type}</strong>
                          <div>{episode.title}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.patientInfo}>
                        <strong>{episode.patient_name}</strong>
                        <div>ID: {episode.patient_id}</div>
                      </div>
                    </td>
                    <td>{episode.description || "No additional details"}</td>
                    <td>
                      <div className={styles.dateInfo}>
                        <div>
                          <strong>Start:</strong> {episode.start_date}
                        </div>
                        {episode.end_date && (
                          <div>
                            <strong>End:</strong> {episode.end_date}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{getStatusBadge(episode.is_ongoing)}</td>
                    <td>
                      {episode.added_from_ehr ? (
                        <span className={styles.ehrSource}>
                          EHR #{episode.added_from_ehr}
                        </span>
                      ) : (
                        "Manual Entry"
                      )}
                    </td>
                    <td>
                      <button
                        className={styles.menuButton}
                        onClick={() =>
                          setMenuOpen(
                            menuOpen === episode.id ? null : episode.id
                          )
                        }
                      >
                        ⋮
                      </button>
                      {menuOpen === episode.id && (
                        <div className={styles.actionMenu}>
                          <ul>
                            <li onClick={() => {}}>View Details</li>
                            <li onClick={() => {}}>Edit</li>
                            <li onClick={() => {}}>
                              {episode.is_ongoing ? "Mark Resolved" : "Reopen"}
                            </li>
                            <li
                              className={styles.deleteAction}
                              onClick={() => {}}
                            >
                              Delete
                            </li>
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.noEpisodes}>
              No medical episodes found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientHealthHistory;