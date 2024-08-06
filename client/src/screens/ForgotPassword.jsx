import React, { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    try {
      const response = await fetch('https://roofing-31jz.onrender.com/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }) // Ensure 'email' is the correct variable containing the email address
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage('Your email was not found in our records');
      }
    } catch (error) {
      setMessage('Failed to reset password');
    }
  };
  

  return (
    <div className='py-3'>
        <h1 className='text-center my-5 fw-bold'>IN<span className='clrblue'>VOICE</span></h1>
        <section className='d-flex justify-content-center align-items-center'>
            <div className='signin-form loginbox p-5 pb-4 mt-3'>
                <p className='h4 fw-bold'>Forgot Password</p>

                <div class="form-group mb-4 pt-3">
                    <label class="label mb-1" for="email">Enter Email</label>
                    <input type="email" class="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" />
                </div>

                <div class=" d-flex justify-content-center">
                    <button class="form-control w-75 btn btnblur text-white mb-1" onClick={handleResetPassword}>Reset Password</button>
                </div>
                {message && <p className='text-danger text-center fw-bold'>{message}</p>}
            </div>
        </section>
      {/* <h2>Forgot Password</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
      <button onClick={handleResetPassword}>Reset Password</button>
      {message && <p>{message}</p>} */}
    </div>
  );
}
