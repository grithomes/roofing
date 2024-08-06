import React, { useEffect, useRef, useState } from 'react';
import Usernavbar from './Usernavbar';
import Usernav from './Usernav';
import SignatureCanvas from 'react-signature-canvas';
import { useNavigate } from 'react-router-dom';

export default function Signature() {
    const sigCanvas = useRef(null);
    const [hasSignature, setHasSignature] = useState(false);
    const [signatureData, setSignatureData] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [signupdata, setsignupdata] = useState({
      Businesstype:"",
      CurrencyType:"",
      FirstName:"",
      LastName:"",
      TaxName:"",
      address:"",
      city:"",
      companyImageUrl:"",
      companyname:"",
      country:"",
      email:"",
      state:"",
      taxPercentage:"",
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('authToken') || localStorage.getItem('isTeamMember') === 'true') {
            navigate('/');
        }
        fetchsignupdata();
    }, [navigate]);

    const fetchsignupdata = async () => {
        try {
          const userid =   localStorage.getItem("userid");
          const authToken = localStorage.getItem('authToken');
          const response = await fetch(`https://roofing-31jz.onrender.com/api/getsignupdata/${userid}`, {
            headers: {
              'Authorization': authToken,
            }
          });
    
          if (response.status === 401) {
            const json = await response.json();
            setAlertMessage(json.message);
            setloading(false);
            window.scrollTo(0, 0);
            return; // Stop further execution
          }
          else {
            const json = await response.json();
            if(json != null){
            setsignupdata(json);
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setloading(false);
        }
      }

    const fetchSignatureData = async () => {
        try {
            const ownerId = localStorage.getItem('userid'); // Retrieve the ownerId
            const authToken = localStorage.getItem('authToken'); // Retrieve the auth token

            const response = await fetch(`https://roofing-31jz.onrender.com/api/check-signature/${ownerId}`, {
                headers: {
                    'Authorization': authToken,
                }
            });

            if (response.status === 401) {
                const json = await response.json();
                console.error(json.message); // Handle unauthorized access
                return; // Stop further execution
            }

            const json = await response.json();

            if (json.hasSignature) {
                setHasSignature(true);
                setSignatureData(json.signatureData);
            }

        } catch (error) {
            console.error('Error fetching signature:', error);
        }
    };

    useEffect(() => {
        fetchSignatureData();
    }, []);

    useEffect(() => {
        if (hasSignature && sigCanvas.current) {
            const canvas = sigCanvas.current.getCanvas();
            const ctx = canvas.getContext('2d');
            const img = new Image();
            // Ensure to handle if signatureData already has the 'data:image/png;base64,' prefix
            img.src = signatureData.startsWith('data:image/png;base64,') ? signatureData : `data:image/png;base64,${signatureData}`;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
                ctx.drawImage(img, 0, 0); // Draw the image on the canvas
            };
        }
    }, [hasSignature, signatureData]);

    const clear = () => sigCanvas.current.clear();

    const saveSignature = async () => {
        if (!sigCanvas.current.isEmpty()) {
            setIsSubmitting(true);
    
            const signature = sigCanvas.current.toDataURL(); // Get signature data URL
            const ownerId = localStorage.getItem('userid');
            const email = localStorage.getItem('userEmail'); // Assuming email is stored in localStorage
            // const companyname = localStorage.getItem('companyName'); // Assuming company name is stored in localStorage
    
            try {
                const response = await fetch(`https://roofing-31jz.onrender.com/api/check-signature/${ownerId}`, {
                    headers: {
                        'Authorization': localStorage.getItem('authToken'),
                    },
                });
    
                const json = await response.json();
    
                if (json.hasSignature) {
                    // If signature exists, update it
                    const updateResponse = await fetch('https://roofing-31jz.onrender.com/api/update-ownersignature', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('authToken'),
                        },
                        body: JSON.stringify({ 
                            signature, 
                            ownerId, 
                            email, 
                            companyname: signupdata.companyname
                        }),
                    });
    
                    const updateJson = await updateResponse.json();
                    if (updateResponse.ok) {
                        console.log('Signature updated:', updateJson);
                    } else {
                        console.error('Error updating signature:', updateJson.message);
                    }
                } else {
                    // If no signature exists, create a new one
                    const createResponse = await fetch('https://roofing-31jz.onrender.com/api/ownersignature', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('authToken'),
                        },
                        body: JSON.stringify({ 
                            signature,
                            ownerId, 
                            email, 
                            companyname: signupdata?.companyname || '',
                            }),
                    });
    
                    const createJson = await createResponse.json();
                    if (createResponse.ok) {
                        console.log('Signature saved:', createJson);
                    } else {
                        console.error('Error saving signature:', createJson.message);
                    }
                }
            } catch (error) {
                console.error('Error handling signature:', error);
            } finally {
                setIsSubmitting(false);
            }
        } else {
            console.log('Signature is empty');
        }
    };
       

    return (
        <div className="bg">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none">
                        <div>
                            <Usernavbar />
                        </div>
                    </div>
                    <div className="col-lg-10 col-md-9 col-12 mx-auto">
                        <div className="d-lg-none d-md-none d-block mt-2">
                            <Usernav />
                        </div>
                        <div className="bg-white my-5 p-4 box mx-4">
                            <div className="row py-2">
                                <div className="col-lg-4 col-md-6 col-sm-6 col-7 me-auto">
                                    <p className="h5 fw-bold">E-Sign</p>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb mb-0">
                                            <li className="breadcrumb-item">
                                                <a href="/Userpanel/Userdashboard" className="txtclr text-decoration-none">
                                                    Dashboard
                                                </a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">
                                                E-Sign
                                            </li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                            <hr />
                            <div className="row my-2">
                                <div>
                                    <SignatureCanvas
                                        ref={sigCanvas}
                                        canvasProps={{ width: 500, height: 200, className: 'sigCanvassig' }}
                                    /><br />
                                    <button onClick={clear} className='btn btn-light'>Clear</button>
                                    <button className='btn btn-light mx-2 text-primary' onClick={saveSignature} disabled={isSubmitting}>
                                        {isSubmitting ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
