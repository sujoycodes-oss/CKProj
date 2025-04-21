import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/OnboardingDashboard.css';
import FirstPage from './pages/FirstPage';
import SecondPage from './pages/SecondPage';
import ThirdPage from './pages/ThirdPage';
// import ThankYouPage from './ThankYou';

const OnboardingDashboard = () => {
    const [step, setStep] = useState(0);
    const navigate = useNavigate();

    const handleNext = () => {
        if (step < 3) {
            setStep(prev => prev + 1);
        } else {
            navigate('./thank-you')
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(prev => prev - 1);
        } else {
            navigate('/onboarding-dashboard');
        }
    };

    const handleCancel = () => {
        navigate('/admin');
    };

    const renderStepContent = () => {
        switch (step) {
            case 0:
                return (
                    <div className="step-content">
                        <h2>Welcome to the Onboarding Dashboard</h2>
                        <p>Click below to start setting up your IAM Role & Account.</p>
                    </div>
                );
            case 1:
                return <FirstPage />;
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
                    {step > 0 && <button className="cancel-button" onClick={handleCancel}>Cancel</button>}
                </div>
                <div className="nav-buttons">
                    {step > 0 && <button className="back-button" onClick={handleBack}>
                        {step === 1 ? 'Back'
                            : step === 2 ? 'Back - Create An IAM Role'
                                : step === 3 ? 'Back - Add Customer Managed Policies'
                                    : 'Back'}
                    </button>}
                    <button className="next-button" onClick={handleNext}>
                        {step === 1 ? 'Next - Add Customer Managed Policies'
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
