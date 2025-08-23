import React, { useState } from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { FaCarSide } from "react-icons/fa"; // ไอคอนรถจาก react-icons

const Navbar = () => {
  const {
    setShowLogin,
    user,
    logout,
    isOwner,
    axios,
    setIsOwner,
  } = useAppContext() || {};

  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const changeRole = async () => {
    try {
      if (!axios) return toast.error("Network error: axios not ready");

      const { data } = await axios.post("/api/owner/change-role");

      if (data?.success) {
        setIsOwner?.(true);
        toast.success(data?.message || "Role changed to Owner");
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-5 text-gray-600 border-b border-borderColor relative transition-all ${
        location.pathname === "/" ? "bg-white" : "bg-white"
      }`}
    >
      {/* Logo ใหม่ */}
      <Link to="/" className="flex items-center gap-2">
     
        <span className="font-medium text-3xl text-gray-800">CAR RENTAL </span>
      </Link>

      {/* Menu */}
      <div
        className={`
          max-sm:fixed max-sm:inset-0 max-sm:top-16 max-sm:h-[calc(100vh-64px)]
          max-sm:w-full max-sm:z-40 max-sm:bg-white
          flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 
          max-sm:p-8 transition-transform duration-300
          ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}
        `}
      >
        {Array.isArray(menuLinks) &&
          menuLinks.map((link, index) => (
            <Link key={index} to={link?.path || "#"}>
              {link?.name || "No name"}
            </Link>
          ))}

        {/* Search bar */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56">
          <input
            type="text"
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            placeholder="Search products"
          />
          <img src={assets?.search_icon} alt="search" />
        </div>

        {/* Right buttons */}
        <div className="flex max-sm:flex-col items-start sm:items-center gap-6">
          <button
            onClick={() => (isOwner ? navigate("/owner") : changeRole())}
            className="cursor-pointer"
          >
            {isOwner ? "Dashboard" : "List cars"}
          </button>

          <button
            onClick={() => (user ? logout?.() : setShowLogin?.(true))}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        className="sm:hidden cursor-pointer"
        aria-label="Menu"
        onClick={() => setOpen(!open)}
      >
        <img src={open ? assets?.close_icon : assets?.menu_icon} alt="menu" />
      </button>
    </div>
  );
};

export default Navbar;
