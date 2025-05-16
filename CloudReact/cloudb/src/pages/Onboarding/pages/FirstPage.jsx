import cktuner from '../../../assets/ck-tuner-role.png';
import CopyableTextarea from '../../../components/common/CopyableTextarea';
import { formFields } from "../../../config/arnConfig.js";
import '../../../styles/Firstpage.css';
import '../../../styles/OnboardingDashboard.css';
import { steps } from "./textFiles/textConfig.js";

const FirstPage = ({ formData, updateFormData, errors }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData(name, value);
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
                                    <div className="form-row">
                                        {formFields.map(({ label, name, type, placeholder }) => (
                                            <div className="form-group" key={name}>
                                                <label htmlFor={name} className="form-label">{label}</label>
                                                <input
                                                    className={`form-input ${errors[name] ? 'error' : ''}`}
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
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FirstPage;