import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [cars, setCars] = useState([]);

  // ตั้งค่า Authorization header
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // ดึงข้อมูลรถทั้งหมด
  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      if (data.success) {
        setCars(data.cars);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  // ดึงข้อมูลผู้ใช้
  const fetchUser = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get("/api/user/data");
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
        return data.user;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ฟังก์ชัน login
  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`/api/user/login`, { email, password });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token); // useEffect จะจัดการ fetchUser ให้
        toast.success("ลงทะเบียนสําเร็จ");
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return false;
    }
  };

  // ฟังก์ชัน logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    setAuthToken(null);
    toast.success("ลงชื่อออก");
  };

  // ✅ ทุกครั้งที่ token เปลี่ยน → sync user ใหม่
  useEffect(() => {
    if (token) {
      setAuthToken(token);
      fetchUser();
    } else {
      setUser(null);
      setIsOwner(false);
    }
  }, [token]);

  // โหลดครั้งแรก
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
    fetchCars();
  }, []);

  return (
    <AppContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        isOwner,
        setIsOwner,
        login,
        logout,
        showLogin,
        setShowLogin,
        axios,
        fetchUser,
        cars,
        fetchCars,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
