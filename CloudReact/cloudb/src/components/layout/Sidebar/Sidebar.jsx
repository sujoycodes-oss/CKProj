import React from "react";
import { RiUserSettingsLine } from "react-icons/ri";    
import { FaAws } from "react-icons/fa";
import { MdOutlinePriceChange } from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../../styles/Sidebar.css"
import { useSelector } from "react-redux";

const Sidebar = () => {
    const { role } = useSelector(state => state.auth);
    
    const getBasePath = () => {
        switch (role) {
            case 'ADMIN':
                return '/admin';
            case 'READ_ONLY':
                return '/readonly';
            case 'CUSTOMER':
                return '/customer';
            default:
                return '/';
        }
    };

    const menuItems = [
        {
            path: `${getBasePath()}`,
            icon: <RiUserSettingsLine className="icon" />,
            text: 'Users',
            roles: ['ADMIN','READ_ONLY']
        },
        // Cost Explorer - available to all roles
        {
            path: `${getBasePath()}/cost-explorer`,
            icon: <MdOutlinePriceChange className="icon" />,
            text: 'Cost Explorer',
            roles: ['ADMIN', 'READ_ONLY', 'CUSTOMER']
        },
        // AWS Services - available to all roles
        {
            path: `${getBasePath()}/aws-services`,
            icon: <FaAws className="icon" />,
            text: 'AWS Services',
            roles: ['ADMIN', 'READ_ONLY', 'CUSTOMER']
        },
        {
            path: '/admin/onboarding-dashboard',
            icon: <FaChalkboardTeacher className="icon" />,
            text: 'Onboarding',
            roles: ['ADMIN']
        }
    ];

    const filteredMenuItems = menuItems.filter(item => item.roles.includes(role));

    return (
        <div className="menu">
            <div className="menu-list">
                {filteredMenuItems.map((item, index) => (
                    <Link key={index} to={item.path} className="item">
                        {item.icon}
                        {item.text}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
