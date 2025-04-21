import axios from 'axios';
import { useState } from 'react';
import { FaInfoCircle } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { ImExit } from "react-icons/im";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CLEAR_AUTH_DATA } from '../../../redux/actions/authActions';
import svgLogo from '../../../assets/newCklogo.png';
import '../../../styles/Navbar.css';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.auth);
    const [showRolePopup, setShowRolePopup] = useState(false);

    const handleLogout = async () => {
        try {
            const token = user.token;

            if (token) {
                const response = await axios.post(
                    'http://localhost:8080/auth/logout',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.status === 200) {
                    console.log('Logged out successfully on server');
                } else {
                    console.error('Error logging out on server');
                }
            }
            dispatch({ type: CLEAR_AUTH_DATA});
            localStorage.clear();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };


    const displayName = user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : 'Guest';

    const userRole = user?.role || 'CSTMR-Tuner Admin';

    const toggleRolePopup = () => {
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
                            </div>
                        </div>

                        {showRolePopup && (
                            <div className="role-popup">
                                <div className="role-popup-content">
                                    <FaRegCircleUser className="role-icon" />
                                    <div className="role-details">
                                        <span className="role-label">Role</span>
                                        <span className="role-value">{userRole}</span>
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