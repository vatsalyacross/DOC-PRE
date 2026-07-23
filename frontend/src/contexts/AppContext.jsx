import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {

  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ================= STATES =================
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]); // ✅ NEW
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(null);

  // ================= GET DOCTORS =================
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/list"
      );

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error(error);
    }
  };

  // ================= LOAD USER PROFILE =================
  const loadUserProfileData = async () => {
    try {

      const { data } = await axios.get(
        backendUrl + "/api/user/get-profile",
        {
          headers: {
            authorization: token,
          },
        }
      );

      console.log("Profile Data:", data);

      if (data.success) {
        setUserData(data.userData);
      }

    } catch (error) {
      console.log(error);
    }
  };

  // ================= UPDATE USER PROFILE =================
  const updateUserProfileData = async (formData) => {
    try {

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        {
          headers: {
            authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("Profile updated");
        loadUserProfileData();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  // ================= GET USER APPOINTMENTS =================
  const getUserAppointments = async () => {
    try {

      const { data } = await axios.get(
        backendUrl + "/api/user/appointments",
        {
          headers: {
            authorization: token,
          },
        }
      );

      console.log("Appointments Data:", data.appointments);

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
    }
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    getDoctorsData();
  }, []);

  // ================= LOAD USER DATA WHEN TOKEN CHANGES =================
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);

      loadUserProfileData();
      getUserAppointments(); // ✅ AUTO LOAD APPOINTMENTS

    } else {
      localStorage.removeItem("token");

      setUserData(null);
      setAppointments([]);
    }
  }, [token]);

  // ================= CONTEXT VALUE =================
  const value = {
    doctors,
    getDoctorsData,

    appointments,          // ✅ NEW
    getUserAppointments,   // ✅ NEW

    currencySymbol,
    backendUrl,

    token,
    setToken,

    userData,
    setUserData,

    loadUserProfileData,
    updateUserProfileData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
