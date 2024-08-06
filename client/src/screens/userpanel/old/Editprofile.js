import React, { useState,useEffect } from 'react'
import Usernavbar from './Usernavbar';
import Usernav from './Usernav';
import {useNavigate} from 'react-router-dom';
import Alertauthtoken from '../../components/Alertauthtoken';

export default function Editprofile() {
    
    const [signupdata, setsignupdata] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    let navigate = useNavigate();

    useEffect(() => {
        if(!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true")
        {
          navigate("/");
        }
        fetchsignupdata();
    },[])
      
    const fetchsignupdata = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://grithomes.onrender.com/api/getsignupdata/${userid}`, {
                headers: {
                  'Authorization': authToken,
                }
              });
              if (response.status === 401) {
                const json = await response.json();
                setAlertMessage(json.message);
                // setloading(false);
                window.scrollTo(0,0);
                return; // Stop further execution
              }
              else{
                const json = await response.json();
            
            // if (Array.isArray(json)) {
                setsignupdata(json);
              }
            
            // }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setsignupdata({ ...signupdata, [name]: value });
    };

    // const handleSaveClick = async () => {
    //     try {
    //         const userid = localStorage.getItem("userid");
    
    //         const response = await fetch(`https://grithomes.onrender.com/api/updatesignupdata/${userid}`, {
    //             method: 'POST',
    //             body: formData,
    //         });
    
    //         const json = await response.json();
    
    //         if (json.Success) {
    //             navigate('/userpanel/Customerlist');
    //         } else {
    //             console.error('Error updating Signupdata:', json.message);
    //         }
    //     } catch (error) {
    //         console.error('Error updating Signupdata:', error);
    //     }
    // };
    
    const handleSaveClick = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const authToken = localStorage.getItem('authToken');
            const updatedsignupdata = {
                ...signupdata
            };
            const response = await fetch(`https://grithomes.onrender.com/api/updatesignupdata/${userid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken,
                },
                body: JSON.stringify(updatedsignupdata)
            });

            if (response.status === 401) {
              const json = await response.json();
              setAlertMessage(json.message);
            //   setloading(false);
              window.scrollTo(0,0);
              return; // Stop further execution
            }
            else{
                const json = await response.json();

                if (json.Success) {
                    navigate('/userpanel/Userdashboard');
                    console.log(updatedsignupdata);
                } else {
                    console.error('Error updating Signupdata:', json.message);
                }
            }

            
        } catch (error) {
            console.error('Error updating Signupdata:', error);
        }
    };


  return (
    <div className='container-fluid'>
            <div className="row">
                <div className='col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none'>
                    <div  >
                    <Usernavbar/>
                    </div>
                </div>

                <div className="col-lg-10 col-md-9 col-12 mx-auto">
                    <div className='d-lg-none d-md-none d-block mt-2'>
                        <Usernav/>
                    </div>
                    <div className='mx-4 my-5'>
                        <div className='my-2'>
                            {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
                        </div>
                        <section className='box1 rounded adminborder p-4 m-2 mb-5'>
                            <form>
                                <div className=' p-5 pb-4 mt-3'>
                                    <p className='h4 fw-bold'>Edit Profile</p>
                                    {console.log(signupdata, "signupdata")}

                                    <div className="row">

                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div class="form-group pt-3">
                                                <label class="label py-2" for="company_name">Company name</label>
                                                <input type="text" class="form-control" name="companyname" value={signupdata.companyname} onChange={handleInputChange} placeholder="Company name" />
                                            </div>
                                        </div>

                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div className="form-group pt-3">
                                                <label htmlFor="exampleInputtext2" className="form-label py-1">Business Type</label>
                                                <select
                                                className="form-select"
                                                name="Businesstype"
                                                value={signupdata.Businesstype}
                                                onChange={handleInputChange}
                                                aria-label="Default select example"
                                                >
                                                    <option value="">Select Business Type</option>
                                                    <option value="Art, Photography & Creative Services">Art, Photography & Creative Services</option>
                                                    <option value="Construction & Trades">Construction & Trades</option>
                                                    <option value="Cleaning & Property Maintenance">Cleaning & Property Maintenance</option>
                                                    <option value="Consulting & Professional Services">Consulting & Professional Services</option>
                                                    <option value="Hair, Spa & Beauty">Hair, Spa & Beauty</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div className="form-group pt-3">
                                                <label htmlFor="exampleInputtext3" className="form-label py-1">Currency Type</label>
                                                <select
                                                className="form-select"
                                                name="CurrencyType"
                                                value={signupdata.CurrencyType}
                                                onChange={handleInputChange}
                                                aria-label="Default select example"
                                                >
                                                    <option value="">Select Currency Type</option>
                                                    <option value="AUD"> AUD - Australian Dollar </option>
                                                    <option value="CAD"> CAD - Canadian Dollar </option>
                                                    <option value="INR"> INR - Indian Rupee </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div className="form-group mb-3 pt-3">
                                                <label htmlFor="address" className="form-label">Address</label>
                                                <textarea type="message" className="form-control" name="address" value={signupdata.address} onChange={handleInputChange} placeholder="Address" id="exampleInputaddress" />
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                            <div class="form-group pt-3">
                                                <label class="label py-2" for="First_Name">First Name</label>
                                                <input type="text" class="form-control" name="FirstName" value={signupdata.FirstName} onChange={handleInputChange} placeholder="First Name" />
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                            <div class="form-group pt-3">
                                                <label class="label py-2" for="Last_Name">Last Name</label>
                                                <input type="text" class="form-control" name="LastName" value={signupdata.LastName} onChange={handleInputChange} placeholder="Last Name"  />
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                            <div class="form-group pt-3">
                                                <label class="label py-2" for="User1_Mobile_Number">Number</label>
                                                <input type="text" class="form-control" name="User1_Mobile_Number" value={signupdata.User1_Mobile_Number} onChange={handleInputChange} placeholder="Number"  />
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                            <div class="form-group pt-3">
                                                <label class="label py-2" for="First_Name1">First Name</label>
                                                <input type="text" class="form-control" name="User2FirstName" value={signupdata.User2FirstName} onChange={handleInputChange} placeholder="First Name" />
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                            <div class="form-group pt-3">
                                                <label class="label py-2" for="Last_Name">Last Name</label>
                                                <input type="text" class="form-control" name="LastName" value={signupdata.User2LastName} onChange={handleInputChange} placeholder="Last Name"  />
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                                            <div class="form-group pt-3">
                                                <label class="label py-2" for="User2_Mobile_Number">Number</label>
                                                <input type="text" class="form-control" name="User2_Mobile_Number" value={signupdata.User2_Mobile_Number} onChange={handleInputChange} placeholder="Number"  />
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div class="form-group mb-3 pt-3">
                                                <label class="label py-2" for="email">Email</label>
                                                <input type="text" class="form-control" name="email" value={signupdata.email} onChange={handleInputChange} placeholder="Email"  />
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div class="form-group pt-3">
                                                <label class="label py-2" for="gstNumber">Business Tax Number</label>
                                                <input type="text" class="form-control" name="gstNumber" value={signupdata.gstNumber} onChange={handleInputChange} placeholder="Abn" />
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div class="form-group pt-3">
                                                <label class="label py-2" for="TaxName">Business Tax Name</label>
                                                <input type="text" class="form-control" name="TaxName" value={signupdata.TaxName || ''} onChange={handleInputChange} placeholder="Tax Name" />
                                            </div>
                                        </div>
                                        

                                    </div>
                                <button type="button" className='btn btnclr text-white me-2' onClick={handleSaveClick}>Save</button>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </div>
  )
}
