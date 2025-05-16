// import { useState } from 'react';
// import { FaInfoCircle } from "react-icons/fa";
// import { FaRegCircleUser } from "react-icons/fa6";
// import { ImExit } from "react-icons/im";
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { performLogout } from './axiosConfig'; // Import centralized logout function
// import svgLogo from '../../../assets/newCklogo.png';
// import '../../../styles/Navbar.css';

// const Navbar = () => {
//     const navigate = useNavigate();
//     const user = useSelector(state => state.auth);
//     const [showRolePopup, setShowRolePopup] = useState(false);
    

//     const handleLogout = () => {
//         performLogout(navigate);
//     };

//     const displayName = user?.firstName && user?.lastName
//         ? `${user.firstName} ${user.lastName}`
//         : 'Guest';

//     const userRole = user?.role || 'CSTMR-Tuner Admin';

//     const toggleRolePopup = () => {
//         // Reset inactivity timer when user interacts with role popup
//         setShowRolePopup(!showRolePopup);
//     };

//     return (
//         <nav className='navbar'>
//             <div className='navbar-container'>
//                 <div className='navbar-left'>
//                     <img src={svgLogo} alt='Cloud Balance logo' className='logo' />
//                 </div>
//                 <div className='navbar-right'>
//                     <div className="user-profile-container">
//                         <div className="user-profile">
//                             <FaRegCircleUser className='profile-icon' />
//                             <div className='user-info'>
//                                 <span className='welcome-text'>Welcome,</span>
//                                 <span className='user-name'><br />{displayName}</span>
//                                 <span className='role-info' onClick={toggleRolePopup}>
//                                     <FaInfoCircle className="info-icon" />
//                                 </span>
//                                 {/* // Button for impersonation // */}
//                             </div>
//                         </div>

//                         {showRolePopup && (
//                             <div className="role-popup">
//                                 <div className="role-popup-content">
//                                     <FaRegCircleUser className="role-icon" />
//                                     <div className="role-details">
//                                         <span className="role-label">Role</span>
//                                         <span className="role-value">{userRole}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     <button className='logout-button' onClick={handleLogout} aria-label="Logout">
//                         <ImExit className='logout-icon' />
//                         <span>Logout</span>
//                     </button>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;


import { useState } from 'react';
import { FaInfoCircle } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { ImExit } from "react-icons/im";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { performLogout } from './axiosConfig'; // Import centralized logout function
import ImpersonationControls from './Impersonation'; // Import our new component
import svgLogo from '../../../assets/newCklogo.png';
import '../../../styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const user = useSelector(state => state.auth);
    const [showRolePopup, setShowRolePopup] = useState(false);
    
    const handleLogout = () => {
        performLogout(navigate);
    };

    const displayName = user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : 'Guest';

    // Show actual role if impersonating
    const userRole = user?.impersonating ? `${user.role} (Impersonating)` : user?.role || 'CSTMR-Tuner Admin';

    const toggleRolePopup = () => {
        // Reset inactivity timer when user interacts with role popup
        setShowRolePopup(!showRolePopup);
    };

    return (
        <nav className='navbar'>
            <div className='navbar-container'>
                <div className='navbar-left'>
                    <img src={svgLogo} alt='Cloud Balance logo' className='logo' />
                </div>
                <div className='navbar-right'>
                    <div className="user-profile-container">
                        <div className="user-profile">
                            <FaRegCircleUser className='profile-icon' />
                            <div className='user-info'>
                                <span className='welcome-text'>Welcome,</span>
                                <span className='user-name'><br />{displayName}</span>
                                <span className='role-info' onClick={toggleRolePopup}>
                                    <FaInfoCircle className="info-icon" />
                                </span>
                                {/* Add impersonation controls */}
                                <ImpersonationControls />
                            </div>
                        </div>

                        {showRolePopup && (
                            <div className="role-popup">
                                <div className="role-popup-content">
                                    <FaRegCircleUser className="role-icon" />
                                    <div className="role-details">
                                        <span className="role-label">Role</span>
                                        <span className="role-value">{userRole}</span>
                                        {user?.impersonating && (
                                            <>
                                                <span className="role-label">Original User</span>
                                                <span className="role-value">{user.impersonatedBy}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button className='logout-button' onClick={handleLogout} aria-label="Logout">
                        <ImExit className='logout-icon' />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;