import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/OnboardingDashboard.css';
import FirstPage from './pages/FirstPage';
import SecondPage from './pages/SecondPage';
import ThirdPage from './pages/ThirdPage';
import { formFields } from '../../config/arnConfig';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const OnboardingDashboard = () => {
    const [step, setStep] = useState(1); 
    const [formData, setFormData] = useState({
        accountName: '',
        accountId: '',
        region: '',
        arn: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const token = useSelector(state => state.auth.token);

    const handleNext = () => {
        if (step === 1) {
            const newErrors = {};
            formFields.forEach(({ name, validate }) => {
                const error = validate(formData[name]);
                if (error) newErrors[name] = error;
            });

            setErrors(newErrors);
            if (Object.keys(newErrors).length > 0) {
                return;
            }
        }

        // Submit on last step
        if (step === 3) {
            handleSubmit();
            return;
        }

        // Go to next step
        setStep(prev => prev + 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await axios.post(
                'http://localhost:8080/auth/admin/cloudAccount',
                {
                    cloudAccountId: Number(formData.accountId),
                    cloudAccountName: formData.accountName,
                    region: formData.region,
                    arn: formData.arn
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                navigate('/admin/thank-you');
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(error.response?.data?.message || "Failed to submit form");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(prev => prev - 1);
        }
    };

    const handleCancel = () => {
        navigate('/admin');
    };

    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when field is updated
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <FirstPage 
                        formData={formData}
                        updateFormData={updateFormData}
                        errors={errors}
                    />
                );
            case 2:
                return <SecondPage />;
            case 3:
                return <ThirdPage />;
            default:
                return null;
        }
    };

    return (
        <>
            <div className='onboarding-container'>
                <div className='onboarding-content'>
                    {renderStepContent()}
                </div>
            </div>

            <div className="onboarding-footer">
                <div>
                    <button className="cancel-button" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
                <div className="nav-buttons">
                    {step > 1 && (
                        <button className="back-button" onClick={handleBack}>
                            {step === 2 ? 'Back - Create An IAM Role'
                                : step === 3 ? 'Back - Add Customer Managed Policies'
                                    : 'Back'}
                        </button>
                    )}
                    <button 
                        className="next-button" 
                        onClick={handleNext}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : 
                            step === 1 ? 'Next - Add Customer Managed Policies'
                            : step === 2 ? 'Next - Create S3 bucket'
                            : step === 3 ? 'Submit'
                            : 'Next'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default OnboardingDashboard;