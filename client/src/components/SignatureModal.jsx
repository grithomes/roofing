import React, { useRef, useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import './Signmodal.css';

const SignatureModal = ({ onSave, onClose }) => {
    const sigCanvas = useRef(null);
    const [canvasWidth, setCanvasWidth] = useState(630);

    const clear = (e) => {
        e.preventDefault();
        sigCanvas.current.clear();
    };

    const save = () => {
        const signatureData = sigCanvas.current.toDataURL();
        onSave(signatureData);
    };

    useEffect(() => {
        const updateCanvasWidth = () => {
            if (window.innerWidth < 768) {
                setCanvasWidth(window.innerWidth * 0.9); // 90% of screen width
            } else {
                setCanvasWidth(630);
            }
        };

        updateCanvasWidth(); // Initial call
        window.addEventListener('resize', updateCanvasWidth); // Update on resize

        return () => window.removeEventListener('resize', updateCanvasWidth);
    }, []);

    return (
        <div className="modal1">
            <div className="modal1-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Capture Signature</h2>
                <SignatureCanvas 
                    ref={sigCanvas} 
                    canvasProps={{
                        width: canvasWidth, 
                        height: 200, 
                        className: 'sigCanvas',
                    }} 
                />
                <div className='d-flex justify-content-center'>
                    <button onClick={(e) => clear(e)} className='btn btn-light'>Clear</button>
                    <button onClick={save} className='btn btn-light mx-2 text-primary'>Save</button>
                </div>
            </div>
        </div>
    );
};

export default SignatureModal;
