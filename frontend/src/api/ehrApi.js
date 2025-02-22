// import api from "./axiosInstance";
import axios from "axios";
const token = localStorage.getItem("access");

export const getEHR = (ehrId) => api.get(`/api/ehr_records/${ehrId}/`);
export const updateEHR = (ehrId, data) =>
  api.patch(`/api/ehr_records/${ehrId}/`, data);
export const deleteEHR = (ehrId) => api.delete(`/api/ehr_records/${ehrId}/`);

export const createEHR = (formData) =>
  axios.post(
    `${import.meta.env.VITE_API_URL}/api/ehr_records/create_record/`,
    formData,
    {
      headers: { Authorization: `Bearer ${token}` },
     }
  );
// import { useEffect, useState } from "react";
// import { ehrApi } from "../api";

// const EHRComponent = ({ ehrId }) => {
//   const [ehrData, setEhrData] = useState(null);

//   useEffect(() => {
//     fetchEHR();
//   }, []);

//   const fetchEHR = async () => {
//     try {
//       const response = await ehrApi.getEHR(ehrId);
//       setEhrData(response.data);
//     } catch (error) {
//       console.error("Error fetching EHR:", error);
//     }
//   };

//   const handleUpdateEHR = async () => {
//     try {
//       await ehrApi.updateEHR(ehrId, { comments: "Updated comment" });
//       alert("EHR Updated Successfully");
//     } catch (error) {
//       console.error("Failed to update EHR:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>EHR Record</h2>
//       {ehrData ? <p>{ehrData.comments}</p> : <p>Loading...</p>}
//       <button onClick={handleUpdateEHR}>Update EHR</button>
//     </div>
//   );
// };

// export default EHRComponent;
