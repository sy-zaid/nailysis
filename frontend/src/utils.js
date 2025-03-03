// src/utils.js
export const getAccessToken =()=>{
    return localStorage.getItem("access")
  }
  
  export const calculateAge = (dob) => {
      const birthDate = new Date(dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      
      // Adjust age if birthday hasn't occurred yet this year
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1;
      }
      return age;
    };
    
    // You can add more functions below for reuse
    export const medicalConditionsOptions = [
      { value: "Diabetes", label: "Diabetes" },
      { value: "Hypertension", label: "Hypertension" },
      { value: "Heart Disease", label: "Heart Disease" },
      { value: "Asthma", label: "Asthma" },
    ];
    
    /**
     * Predefined category options for react-select.
     */
    export const categoryOptions = [
      { value: "Chronic", label: "Chronic" },
      { value: "Emergency", label: "Emergency" },
      { value: "Preventive", label: "Preventive" },
      { value: "General", label: "General" },
    ];
    
    /**
     * Predefined diagnosis options for react-select.
     */
    export const diagnosesOptions = [
      { value: "Anemia", label: "Anemia" },
      { value: "Diabetes", label: "Diabetes" },
      { value: "Hypertension", label: "Hypertension" },
      { value: "Fungal Infection", label: "Fungal Infection" },
    ];
  
    export const handleSelectChange = (setData) => (name, selectedOptions) => {
      setData((prevData) => ({
        ...prevData,
        [name]: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
      }));
    };