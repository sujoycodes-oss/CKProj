// import React, { useState } from "react";
// import "../../../styles/AddNewUser.css";

// const formConfig = [
//     { label: "First Name", name: "firstName", placeholder: "Enter First Name", type: "text", required: true },
//     { label: "Last Name", name: "lastName", placeholder: "Enter Last Name", type: "text", required: true },
//     { label: "Email", name: "email", placeholder: "Enter Email ID", type: "email", required: true },
//     { label: "Password", name: "password", placeholder: "Enter Password", type: "password", required: true },
//     // { label: "Cloud IDs (comma-separated)", name: "cloudIds", type: "text", required: false },
// ];

// const roles = ["admin", "read_only", "customer"];

// const AddNewUser = () => {
//     const [formData, setFormData] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         password: "",
//         roleName: "",
//         cloudIds: [],
//     });

//     const [errors, setErrors] = useState({});

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         if (name === "cloudIds") {
//             const cloudIdArray = value.split(",").map((id) => id.trim()).filter(Boolean);
//             setFormData((prev) => ({ ...prev, [name]: cloudIdArray }));
//         } else {
//             setFormData((prev) => ({ ...prev, [name]: value }));
//         }
//         setErrors((prev) => ({ ...prev, [name]: "" }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const newErrors = {};

//         formConfig.forEach(({ name, required }) => {
//             if (required && !formData[name]) {
//                 newErrors[name] = `${name} is required`;
//             }
//         });

//         if (!formData.roleName) {
//             newErrors.roleName = "Role is required";
//         }

//         setErrors(newErrors);

//         if (Object.keys(newErrors).length === 0) {
//             console.log("Form Data Submitted:", formData);
//             // submit logic here
//         }
//     };

//     return (
//         <>
//             <h1>Add New User</h1>
//             <div className="add-user-container">
//                 <div className="form-div">
//                     <form className="form-class" onSubmit={handleSubmit}>
//                         {formConfig.map(({ label, name, placeholder, type, required }) => (
//                             <div key={name}>
//                                 <label htmlFor={name}>{label}</label>
//                                 <input
//                                     type={type}
//                                     name={name}
//                                     placeholder={placeholder}
//                                     className={errors[name] ? "error-input" : ""}
//                                     onChange={handleChange}
//                                     required={required}
//                                 />
//                                 {errors[name] && <span className="error-text">{errors[name]}</span>}
//                             </div>
//                         ))}

//                         <label htmlFor="roleName">Role</label>
//                         <select
//                             name="roleName"
//                             value={formData.roleName}
//                             onChange={handleChange}
//                             className={errors.roleName ? "error-input" : ""}
//                             required
//                         >
//                             <option value="">Select Role</option>
//                             {roles.map((role) => (
//                                 <option key={role} value={role}>
//                                     {role}
//                                 </option>
//                             ))}
//                         </select>
//                         {errors.roleName && <span className="error-text">{errors.roleName}</span>}

//                         <button type="submit">Add User</button>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AddNewUser;

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../styles/AddNewUser.css";
import CloudAccountSelector from "./CloudAccountSelector";
import { toast } from "react-toastify";
import { useState } from "react";

const formConfig = [
    { label: "First Name", name: "firstName", placeholder: "Enter First Name", type: "text", required: true },
    { label: "Last Name", name: "lastName", placeholder: "Enter Last Name", type: "text", required: true },
    { label: "Email", name: "email", placeholder: "Enter Email ID", type: "email", required: true },
    { label: "Password", name: "password", placeholder: "Enter Password", type: "password", required: true },
];

const roles = ["ADMIN", "READ_ONLY", "CUSTOMER"];

const AddNewUser = () => {
    const navigate = useNavigate();
    const authData = useSelector(state => state.auth);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };
    
    const handleCloudAccountsSelected = (selectedAccounts) => {
        setFormData(prev => ({ ...prev, cloudIds: selectedAccounts }));
        // Clear any existing error for cloud accounts
        if (errors.cloudIds) {
            setErrors(prev => ({ ...prev, cloudIds: "" }));
        }
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
        
        // Validate that cloud accounts are selected if role is CUSTOMER
        if (formData.roleName.toLowerCase() === "customer" && formData.cloudIds.length === 0) {
            newErrors.cloudIds = "At least one cloud account must be selected for Customer role";
        }
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            setIsSubmitting(true);
            try {
                await axios.post('http://localhost:8080/auth/admin/register',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authData.token}`
                        }
                    }
                );
                
                toast.success("User created successfully!");
                navigate('/admin/users');
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Failed to create user';
                setErrors({
                    submit: errorMessage
                });
                toast.error(errorMessage);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="add-user-container">
            <h1>Add New User</h1>
            <div className="form-div">
                <form className="form-class" onSubmit={handleSubmit}>
                    {formConfig.map(({ label, name, placeholder, type, required }) => (
                        <div key={name} className="form-group">
                            <label htmlFor={name}>{label}</label>
                            <input
                                type={type}
                                id={name}
                                name={name}
                                placeholder={placeholder}
                                value={formData[name]}
                                className={errors[name] ? "error-input" : ""}
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
                            className={errors.roleName ? "error-input" : ""}
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
                    
                    <CloudAccountSelector 
                        selectedRole={formData.roleName}
                        onAccountsSelected={handleCloudAccountsSelected}
                    />
                    {errors.cloudIds && <span className="error-text accounts-error">{errors.cloudIds}</span>}
                    
                    {errors.submit && <div className="error-text submit-error">{errors.submit}</div>}
                    
                    <div className="form-actions">
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewUser;