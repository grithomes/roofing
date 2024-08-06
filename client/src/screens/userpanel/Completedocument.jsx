import React from 'react';
import completedgif from './completed.gif'
import './Completedocument.css'; 

export default function Completedocument() {
  return (
    <div className="container text-center pt-5">
        <div className="row pt-5">
            <div className="col-6 m-auto">
                <div className="checkmark pt-5">
                    <img src={completedgif} alt="" className='img-fluid'/>
                </div>
                <p className="message">Document has been signed. You will receive a confirmation email with a link to your signed document.</p>
                <h2>Save and view your document</h2>
                <p className="submessage">Sign up for a <strong>Invoice account</strong> to access and create documents.</p>
                {/* <button className="save-button">Save document for free</button> */}
            </div>
            
        </div>
    </div>
  );
}
