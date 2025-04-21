import React from "react";
import { RiUserSettingsLine } from "react-icons/ri";    
import { FaAws } from "react-icons/fa";
import { MdOutlinePriceChange } from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../../styles/Sidebar.css"
const Sidebar = () => {
    return (
        <div className="menu">
            <div className="menu-list">
                <Link to="/admin" className="item">
                    <RiUserSettingsLine className="icon" />
                    Users
                </Link>
                <Link to="/admin/cost-explorer" className="item">
                    <MdOutlinePriceChange className="icon" />
                    Cost Explorer 
                </Link>
                <Link to="/admin/aws-services" className="item">
                    <FaAws className="icon" />
                    Aws Services Info
                </Link>
                <Link to="/admin/onboarding-dashboard" className="item">
                    <FaChalkboardTeacher className="icon" />
                    Onboarding
                </Link>
            </div>
        </div>
    )
}

export default Sidebar;
