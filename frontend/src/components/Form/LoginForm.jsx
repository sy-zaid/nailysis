import React from "react";
import styles from "./Form.module.css";
import SocialLogin from "../SocialLogin/SocialLogin";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { jwtDecode } from 'jwt-decode';
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

function LoginForm({route}){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async(e) => {
    setLoading(true);
    e.preventDefault();

    try{
      const response = await api.post( route, {email,password});
      const {access, refresh} = response.data;

      const decodedToken = jwtDecode(access);
      const curUserRole = decodedToken.role || decodedToken.user_role || null;

      console.log(curUserRole);

      // Save tokens and role to localStorage
      localStorage.setItem(ACCESS_TOKEN, access);
      localStorage.setItem(REFRESH_TOKEN, refresh);
      localStorage.setItem('role', curUserRole);

      if (curUserRole == "Patient"){
        navigate("/super-admin-dashboard");
      }
      else if (curUserRole == "Doctor"){
        navigate("/doctor-dashboard");
      }
      else {
        navigate("/patient-dashboard")
      }
    } catch (error){
        alert(error);
    } finally{
      setLoading(false);
    };
  };

  return <form onSubmit={handleSubmit} className="form-container">
        <h1>Login</h1>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" />
        <button type="submit">Login</button>
    </form>

}

export default LoginForm;