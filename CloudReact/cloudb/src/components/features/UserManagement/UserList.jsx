import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../../services/api";
import '../../../styles/UserList.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const auth = useSelector(state => state.auth);
    const navigate = useNavigate();
    
    // Get current user's role from Redux state
    const currentUserRole = auth.role;

    const capitalizeWord = (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    };

    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return 'Never';
        const date = new Date(dateTimeStr);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        const fetchUsers = async () => {
            if (!auth?.token) {
                navigate('/');
                return;
            }

            try {
                const response = await getUsers();
                setUsers(response.data || []);
                setError('');
            } catch (err) {
                console.error('Error fetching users:', err);
                const errorMessage = err.response?.data?.message || 'Failed to fetch users. Please try again.';
                setError(errorMessage);
                
                if (err.response?.status === 401) {
                    navigate('/');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [auth?.token, navigate]);

    // Function to determine if the current user can edit another user
    const canEditUser = (user) => {
        // READ_ONLY users cannot edit any users
        if (currentUserRole === 'READ_ONLY') {
            return false;
        }
        
        // Users cannot edit themselves
        if (user.email === auth.email) {
            return false;
        }
        
        // ADMIN users can edit everyone else
        return true;
    };

    if (loading) return <div className="loading-container">Loading users...</div>;
    if (error) return <div className="error-container">{error}</div>;

    return (
        <div className="user-table">
            <table className="main-table">
                <thead>
                    <tr>
                        <th>FirstName</th>
                        <th>LastName</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Last Login</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className="table-body">
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="no-users">No users found</td>
                        </tr>
                    ) : (
                        users.map(user => {
                            const isEditable = canEditUser(user);
                            
                            return (
                                <tr key={user.id}>
                                    <td className="item-list">{user.firstName}</td>
                                    <td className="item-list">{user.lastName}</td>
                                    <td className="item-list">{user.email}</td>
                                    <td className="item-list">
                                        <button className={`user-button role-${user.role?.toLowerCase()}`}>
                                            {capitalizeWord(user.role || '')}
                                        </button>
                                    </td>
                                    <td className="item-list">{formatDateTime(user.lastLogin)}</td>
                                    <td className="item-list">
                                        {isEditable ? (
                                            <EditIcon
                                                className="edit-icon"
                                                sx={{ color: '#072d80', cursor: 'pointer' }}
                                                onClick={() => navigate(`/admin/edit-user/${user.id}`)}
                                            />
                                        ) : (
                                            <span title={
                                                currentUserRole === 'READ_ONLY' 
                                                    ? "Read-only users cannot edit other users" 
                                                    : "You cannot edit your own account"
                                            }>
                                                <EditIcon
                                                    className="edit-icon-disabled"
                                                    sx={{ color: '#b0b0b0', cursor: 'not-allowed' }}
                                                />
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;