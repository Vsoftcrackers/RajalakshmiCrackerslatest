import React, { useState } from "react";
import { RiMenu2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close sidebar after navigation
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button className="custom-sidebar-toggle" onClick={toggleSidebar}>
        <RiMenu2Line />
      </button>

      {/* Sidebar */}
      <div className={`custom-sidebar ${isOpen ? "open" : ""}`}>
        <div className="custom-sidebar-header">
      
          <button className="custom-sidebar-close" onClick={toggleSidebar}>
            ✖
          </button>
        </div>
        <nav className="custom-sidebar-nav">
          <ul>
          <li  style={{fontWeight:"bold"}}onClick={() => handleNavigation("/about")}>ABOUT US</li>
         
            
          
          
            
          
            <li onClick={() => handleNavigation("/products")} style={{fontWeight:"bold"}}>Products</li>
        
            <li onClick={() => handleNavigation("/enquiry")}>Contact Us</li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
