import React from 'react';
import { useNavigate } from 'react-router-dom';

const Alertauthtoken = ({ message }) => {
    const navigate = useNavigate();

    const handleLoginAgain = () => {
        navigate('/');
    }
  return (
    <div className="alert alert-warning fade show" role="alert">
        <div className="row">
            <div className='col-7 d-flex align-items-center'>
                {message}
            </div>
            <div className="col-5 d-flex justify-content-end">
                <button type="button" className="btn fw-bold rounded-pill btn-danger" onClick={handleLoginAgain}>Login Again</button>
            </div>
        </div>
    </div>
  );
};

export default Alertauthtoken;
