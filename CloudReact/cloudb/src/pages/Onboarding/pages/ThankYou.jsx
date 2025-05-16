import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import '../../../styles/ThankYou.css';

const ThankYouPage = () => {
    const navigate = useNavigate();

    const handleGoToDashboard = () => {
        navigate('/admin');
    };

    return (
        <div className="thank-you-container">
            <div className="thank-you-card">
                <FaCheckCircle className="success-icon" />
                <h1>Onboarding Complete!</h1>
                <p>Your AWS IAM role and cloud account have been successfully configured.</p>
                
                <div className="info-section">
                    <h2>What's Next?</h2>
                    <ul>
                        <li>Your account is now being provisioned</li>
                        <li>You'll receive a confirmation email shortly</li>
                        <li>It may take a few minutes for all resources to be fully available</li>
                    </ul>
                </div>
                
                <div className="button-container">
                    <button 
                        className="dashboard-button"
                        onClick={handleGoToDashboard}
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ThankYouPage;