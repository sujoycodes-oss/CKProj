import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CloudAccountManager from './CloudAccountSelector';
import '../../../styles/EditUser.css';
import { useSelector } from 'react-redux';


const formConfig = [
    { label: "First Name", name: "firstName", placeholder: "Enter First Name", type: "text", required: true },
    { label: "Last Name", name: "lastName", placeholder: "Enter Last Name", type: "text", required: true },
    { label: "Email", name: "email", placeholder: "Enter Email ID", type: "email", required: true },
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
        cloudIds: [],
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const token = authData.token;
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/auth/admin/users/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const userData = response.data.data;
                setFormData({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    password: "",
                    roleName: userData.role,
                    cloudIds: userData.cloudAccounts?.map(acc => acc.id) || [],
                });
            } catch (error) {
                console.error('Error fetching user:', error);
                navigate('/admin/users');
            }
        };
        
        fetchUser();
    }, [id, navigate, token]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };
    
    const handleCloudAccountsSelected = (selectedAccounts) => {
        setFormData(prev => ({ ...prev, cloudIds: selectedAccounts }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        
        formConfig.forEach(({ name, required }) => {
            if (required && !formData[name]) {
                newErrors[name] = `${name} is required`;
            }
        });
        
        if (!formData.roleName) {
            newErrors.roleName = "Role is required";
        }
        
        if (formData.roleName === "CUSTOMER" && formData.cloudIds.length === 0) {
            newErrors.cloudIds = "At least one cloud account must be selected for Customer role";
        }
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            try {
                await axios.put(`http://localhost:8080/auth/admin/users/${id}`,
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                navigate('/admin/users');
            } catch (error) {
                setErrors({
                    submit: error.response?.data?.message || 'Failed to update user'
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="edit-user-container">
            <h1>Edit User</h1>
            <div className="edit-form-container">
                <form onSubmit={handleSubmit} className="edit-form">
                    {formConfig.map(({ label, name, placeholder, type, required }) => (
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
                        initialSelectedAccounts={formData.cloudIds}
                    />
                    {errors.cloudIds && <span className="error-text">{errors.cloudIds}</span>}

                    {errors.submit && <div className="error-text">{errors.submit}</div>}

                    <div className="form-actions">
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Updating...' : 'Update User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;