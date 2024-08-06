import React, { useState,useEffect } from 'react'
import Usernavbar from './Usernavbar';
import Usernav from './Usernav';
import {useNavigate} from 'react-router-dom';
import Alertauthtoken from '../../components/Alertauthtoken';

export default function Imageupload() {
    
    const [signupdata, setsignupdata] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    let navigate = useNavigate();

    useEffect(() => {
        if(!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true")
        {
          navigate("/");
        }
        fetchsignupdata();
    },[])

    const imageupload = async () => {

        const data = new FormData();
      
        if (!imageFile) {
          alert("No image selected.")
          throw new Error("No image selected.");
        }
      // Check the file type
      const allowedTypes = ["image/png", "image/jpeg"];
      if (!allowedTypes.includes(imageFile.type)) {
        alert("Invalid file type. Please select a PNG or JPG file.")
        throw new Error("Invalid file type. Please select a PNG or JPG file.");
      }
      
      // Check the file size (in bytes)
      const maxSizeMB = 2; // Set the maximum file size in megabytes
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (imageFile.size > maxSizeBytes) {
        alert(`File size exceeds the maximum limit of ${maxSizeMB} MB.`)
        throw new Error(`File size exceeds the maximum limit of ${maxSizeMB} MB.`);
      }
      
      data.append("file", imageFile);
        data.append("upload_preset", "employeeApp");
        data.append("cloud_name", "dxwge5g8f");
      
        try {
          const cloudinaryResponse = await fetch(
            "https://api.cloudinary.com/v1_1/dxwge5g8f/image/upload",
            {
              method: "post",
              body: data,
            }
          );
      
          if (!cloudinaryResponse.ok) {
            console.error("Error uploading image to Cloudinary:", cloudinaryResponse.statusText);
            return;
          }
      
          const cloudinaryData = await cloudinaryResponse.json();
          console.log("Cloudinary URL:", cloudinaryData.url);
      
          return cloudinaryData.url;
        } catch (error) {
          console.error("Error uploading image to Cloudinary:", error.message);
          return null;
        }
      };
      
    const fetchsignupdata = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://roofing-31jz.onrender.com/api/getsignupdata/${userid}`, {
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
            // }
              }
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleInputChange = (event) => {
        const { name, value, files } = event.target;
        if (files) {
            setImageFile(files[0]);
            console.log(files[0], "");
            const imageUrl = URL.createObjectURL(files[0]);
            setsignupdata({ ...signupdata, [name]: imageUrl });
        } else {
            setsignupdata({ ...signupdata, [name]: value });
        }
    };

    const handleSaveClick = async () => {
        try {
            const userid = localStorage.getItem("userid");
            const authToken = localStorage.getItem('authToken');
            const imgurl = await imageupload();
    
            const formData = new FormData();
            formData.append("companyImageUrl", imgurl);
    
            // Append other form data properties
            Object.entries(signupdata).forEach(([key, value]) => {
                if (key !== "companyImageUrl") {
                    formData.append(key, value);
                }
            });
    
            const response = await fetch(`https://roofing-31jz.onrender.com/api/updatesignupdatadata/${userid}`, {
                method: 'POST',
                body: formData,
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
    
                if (json.Success) {
                    navigate('/userpanel/Userdashboard');
                } else {
                    console.error('Error updating Signupdata:', json.message);
                } 
            }
            
        } catch (error) {
            console.error('Error updating Signupdata:', error);
        }
    };
    
    // const handleSaveClick = async () => {
    //     try {
    //         const userid =  localStorage.getItem("userid");
    //         const updatedsignupdata = {
    //             ...signupdata
    //         };
    //         const response = await fetch(`https://roofing-31jz.onrender.com/api/updatesignupdatadata/${userid}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(updatedsignupdata)
    //         });

    //         const json = await response.json();

    //         if (json.Success) {
    //             navigate('/userpanel/Customerlist');
    //             console.log(updatedsignupdata);
    //         } else {
    //             console.error('Error updating Signupdata:', json.message);
    //         }
    //     } catch (error) {
    //         console.error('Error updating Signupdata:', error);
    //     }
    // };


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
                                                <label class="label py-2" for="company_image">Choose Company Image</label><br />
                                                <input type="file" name="companyImageUrl" onChange={handleInputChange} /> 
                                                <img src={signupdata.companyImageUrl} className='w-25'  alt=""  />
                                           </div>
                                        </div>

                                        {/* <div className="col-12 col-sm-12 col-md-6 col-lg-6">
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
                                            <div class="form-group pt-3">
                                                <label class="label py-2" for="First_Name">First Name</label>
                                                <input type="text" class="form-control" name="FirstName" value={signupdata.FirstName} onChange={handleInputChange} placeholder="First Name" />
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div class="form-group pt-3">
                                                <label class="label py-2" for="Last_Name">Last Name</label>
                                                <input type="text" class="form-control" name="LastName" value={signupdata.LastName} onChange={handleInputChange} placeholder="Last Name"  />
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div class="form-group mb-3 pt-3">
                                                <label class="label py-2" for="email">Email</label>
                                                <input type="text" class="form-control" name="email" value={signupdata.email} onChange={handleInputChange} placeholder="Email"  />
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                            <div className="form-group mb-3 pt-3">
                                                <label htmlFor="address" className="form-label">Address</label>
                                                <textarea type="message" className="form-control" name="address" value={signupdata.address} onChange={handleInputChange} placeholder="Address" id="exampleInputaddress" />
                                            </div>
                                        </div> */}
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
