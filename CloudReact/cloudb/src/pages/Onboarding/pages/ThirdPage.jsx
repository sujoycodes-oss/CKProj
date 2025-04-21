import delivery2 from '../../../assets/delivery.png';
import delivery from '../../../assets/deliveryOptions.png';
import report from '../../../assets/reportDetails.png';
import CopyableTextarea from '../../../components/common/CopyableTextarea';
import '../../../styles/ThirdPage.css';
import { steps } from './textFiles/thirdPage.js';

const ThirdPage = () => {
    const images = {
        report,
        delivery,
        delivery2
    };

    return (
        <div className="second-page">
            <h1>Create Cost & Usage Report</h1>
            <p>Create a Cost & Usage Report by following these steps</p>
            <div className="policy-card">
                <ul className="third-page-list">
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
                            
                            {step.hasNote && (
                                <span style={{ fontSize: '0.8rem', color: 'gray' }}>{step.noteText}</span>
                            )}
                            
                            {step.hasCheckbox && (
                                <div className="checkbox-container">
                                    <label>
                                        <input 
                                            type="checkbox"
                                            style={{ marginLeft: '35px' }} 
                                        />
                                        {step.checkboxLabel}
                                    </label>
                                </div>
                            )}
                            
                            {step.hasAdditionalText && (
                                <span dangerouslySetInnerHTML={{ __html: step.additionalText }} />
                            )}
                            
                            {step.hasImage && (
                                <img 
                                    src={images[step.imageSrc]} 
                                    alt={step.imageAlt}
                                    className={step.imageClass} 
                                />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ThirdPage;