import { useState } from "react";
import { useSelector } from "react-redux";
import cktuner from '../../../assets/ck-tuner-role.png';
import CopyableTextarea from '../../../components/common/CopyableTextarea';
import { formFields } from "../../../config/arnConfig.js";
import '../../../styles/Firstpage.css';
import '../../../styles/OnboardingDashboard.css';
import { steps } from "./textFiles/textConfig.js";
import axios from "axios";
import { toast } from "react-toastify";

const FirstPage = () => {
    const [formData, setFormData] = useState({
        cloudAccountId: '',
        cloudAccountName: '',
        region: '',
        arn: '',
    });
    const [errors, setErrors] = useState({});
    
    const authData = useSelector(state => state.auth);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        formFields.forEach(({ name, validate }) => {
            const error = validate(formData[name]);
            if (error) newErrors[name] = error;
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const requestPayload = {
                    cloudAccountId: Number(formData.accountId),
                    cloudAccountName: formData.accountName,
                    region: formData.region,
                    arn: formData.arn
                };

                // console.log(requestPayload);    
                const token = authData.token;

                if (!token) {
                    toast.error("You are not logged in. Please log in to continue.");
                    return;
                }

                const response = await axios.post('http://localhost:8080/auth/admin/cloudAccount',
                    requestPayload,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (response.status === 200) {
                    toast.success("Cloud account created successfully!");
                    setFormData({
                        cloudAccountId: '',
                        cloudAccountName: '',
                        region: '',
                        arn: ''
                    });
                }
            } catch (error) {
                console.error("Error creating cloud account:", error);

                if (error.response?.status === 400 && error.response?.data?.message?.includes("already exists")) {
                    toast.error("Cloud account with this ID already exists");
                } else {
                    toast.error(error.response?.data?.message || "Failed to create cloud account");
                }
            }
        }
    };

    const imageSources = {
        cktuner: cktuner
    };

    return (
        <div className="onboarding-div">
            <h1>Create an IAM role</h1>
            <p>Create an IAM Role by following these steps</p>
            <div className="form-component">
                <ul className="onboarding-list">
                    {steps.map((step) => (
                        <li className="list-items" key={step.number}>
                            <div className="block-elements">
                                <span className="dot">{step.number}</span>
                                <span dangerouslySetInnerHTML={{ __html: step.instruction }} />
                            </div>

                            {step.hasCopyableText && (
                                <div className={`${step.textareaClass}-container`}>
                                    <CopyableTextarea
                                        text={step.copyableText}
                                        textareaClass={step.textareaClass}
                                        buttonClass={step.buttonClass}
                                    />
                                </div>
                            )}

                            {step.hasImage && (
                                <img
                                    src={imageSources[step.imageSrc]}
                                    alt={step.imageAlt}
                                    className={step.imageClass}
                                />
                            )}

                            {step.hasForm && (
                                <div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-row">
                                            {formFields.map(({ label, name, type, placeholder }) => (
                                                <div className="form-group" key={name}>
                                                    <label htmlFor={name} className="form-label">{label}</label>
                                                    <input
                                                        className="form-input"
                                                        name={name}
                                                        type={type}
                                                        value={formData[name]}
                                                        onChange={handleChange}
                                                        placeholder={placeholder}
                                                    />
                                                    {errors[name] && <span className="error-text">{errors[name]}</span>}
                                                </div>
                                            ))}
                                        </div>
                                        <button type="submit">Submit</button>
                                    </form>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default FirstPage;