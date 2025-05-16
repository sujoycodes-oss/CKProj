import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CloudAccountManager from './CloudAccountSelector';
import '../../../styles/EditUser.css';
import { useSelector } from 'react-redux';
import { getUsers } from "../../../services/api";
import { toast } from 'react-toastify';

const formConfig = [
    { label: "First Name", name: "firstName", placeholder: "Enter First Name", type: "text", required: true },
    { label: "Last Name", name: "lastName", placeholder: "Enter Last Name", type: "text", required: true },
    { label: "Email", name: "email", placeholder: "Enter Email ID", type: "email", required: true, readOnly: true },
    { label: "Password", name: "password", placeholder: "Enter New Password (optional)", type: "password", required: false },
];

const roles = ["ADMIN", "READ_ONLY", "CUSTOMER"];

const EditUser = () => {
    const authData = useSelector(state => state.auth);
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        roleName: "",
        cloudAccountIds: [], 
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const token = authData.token;
    
    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) {
                navigate('/');
                return;
            }
            
            setIsLoading(true);
            try {
                // Use the getUsers API to get all users
                const response = await getUsers();
                const users = response.data || [];
                
                // Find the user with the matching ID
                const userData = users.find(user => user.id === parseInt(id));
                
                if (!userData) {
                    throw new Error('User not found');
                }
                
               
                setFormData({
                    firstName: userData.firstName || "",
                    lastName: userData.lastName || "",
                    email: userData.email || "",
                    password: "",
                    roleName: userData.role || "",
                    cloudAccountIds: userData.assignedCloudAccountIds || [], 
                });
            } catch (error) {
                console.error('Error fetching user:', error);
                setErrors({
                    submit: error.message || 'Failed to load user data'
                });
                
                if (error.response?.status === 401) {
                    navigate('/');
                }
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUserData();
    }, [id, token, navigate]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };
    
    const handleCloudAccountsSelected = (selectedAccounts) => {
        setFormData(prev => ({ ...prev, cloudAccountIds: selectedAccounts }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        
        // Validate required fields
        formConfig.forEach(({ name, required }) => {
            if (required && !formData[name]) {
                newErrors[name] = `${name} is required`;
            }
        });
        
        if (!formData.roleName) {
            newErrors.roleName = "Role is required";
        }
        
        if (formData.roleName === "CUSTOMER" && 
            (!formData.cloudAccountIds || formData.cloudAccountIds.length === 0)) {
            newErrors.cloudAccountIds = "At least one cloud account must be selected for Customer role";
        }
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            try {
                const payload = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    roleName: formData.roleName,
                    cloudAccountIds: formData.cloudAccountIds,
                };
                
                if (formData.password && formData.password.trim() !== '') {
                    payload.password = formData.password;
                }
                
                await axios.put(`http://localhost:8080/auth/admin/users/${id}`,
                    payload,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                toast.success('User updated successfully');
                // navigate('/admin');
            } catch (error) {
                console.error('Error updating user:', error);
                setErrors({
                    submit: error.response?.data?.message || 'Failed to update user'
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (isLoading) {
        return <div className="loading">Loading user data...</div>;
    }

    return (
        <div className="edit-user-container">
            <h1>Edit User</h1>
            <div className="edit-form-container">
                <form onSubmit={handleSubmit} className="edit-form">
                    {formConfig.map(({ label, name, placeholder, type, required, readOnly }) => (
                        <div key={name} className="form-group">
                            <label htmlFor={name}>{label}</label>
                            <input
                                type={type}
                                id={name}
                                name={name}
                                value={formData[name]}
                                placeholder={placeholder}
                                className={errors[name] ? 'error' : ''}
                                onChange={handleChange}
                                required={required}
                                readOnly={readOnly}
                            />
                            {errors[name] && <span className="error-text">{errors[name]}</span>}
                        </div>
                    ))}

                    <div className="form-group">
                        <label htmlFor="roleName">Role</label>
                        <select
                            id="roleName"
                            name="roleName"
                            value={formData.roleName}
                            onChange={handleChange}
                            className={errors.roleName ? 'error' : ''}
                            required
                        >
                            <option value="">Select Role</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                        {errors.roleName && <span className="error-text">{errors.roleName}</span>}
                    </div>

                    <CloudAccountManager
                        selectedRole={formData.roleName}
                        onAccountsSelected={handleCloudAccountsSelected}
                        initialSelectedAccounts={formData.cloudAccountIds}
                    />
                    {errors.cloudAccountIds && <span className="error-text">{errors.cloudAccountIds}</span>}

                    {errors.submit && <div className="error-text">{errors.submit}</div>}

                    <div className="form-actions">
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Updating...' : 'Update User'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => navigate('/admin')} 
                            className="cancel-button"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;