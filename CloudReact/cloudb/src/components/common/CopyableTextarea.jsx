import { useRef } from 'react';
import { toast } from 'react-toastify';
import copy from 'copy-to-clipboard';
import { IoCopyOutline } from 'react-icons/io5';

const CopyableTextarea = ({ text, textareaClass = "", buttonClass = "" }) => {
    const textRef = useRef(null);

    const copyToClipboard = () => {
        const copyText = textRef.current?.value;
        const isCopy = copy(copyText);
        if (isCopy) {
            toast.success("Copied to clipboard");
        }
    };

    return (
        <>
            <textarea
                ref={textRef}
                className={textareaClass}
                readOnly
                value={text}
                onClick={copyToClipboard}
            />
            <button className={buttonClass} onClick={copyToClipboard}>
                <IoCopyOutline />
            </button>
        </>
    );
};

export default CopyableTextarea;