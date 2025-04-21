import attachPolicy from '../../../assets/attachPolicy.png';
import cktuner from '../../../assets/ck-tuner-role.png';
import cost from '../../../assets/costAudit.png';
import inlinePolicy from '../../../assets/inlinePolicy.png';
import CopyableTextarea from '../../../components/common/CopyableTextarea';
import '../../../styles/SecondPage.css';
import { steps } from './textFiles/secondPage';

const SecondPage = () => {
    const images = {
        cktuner,
        attachPolicy,
        cost,
        inlinePolicy
    };

    return (
        <div className="second-page">
            <h1>Add Customer Managed Policies</h1>
            <p>Create an Inline policy for the role by following these steps</p>
            <div className="policy-card">
                <ul className="second-page-list">
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
}

export default SecondPage;

