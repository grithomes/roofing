import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Usernavbar from './Usernavbar';
import { CountrySelect, StateSelect, CitySelect } from '@davzon/react-country-state-city';
import "@davzon/react-country-state-city/dist/react-country-state-city.css";
import Usernav from './Usernav';
import Alertauthtoken from '../../components/Alertauthtoken';
import { ColorRing } from  'react-loader-spinner'

export default function Editcustomer() {
    const [ loading, setloading ] = useState(true);
    const location = useLocation();
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();
    
    const customerId = location.state.customerId;

    const [customer, setcustomer] = useState({
        name: '',
        email: '',
        number: '',
        citydata: '',
        statedata: '',
        countrydata: '',
        information: '',
        address1: '',
        address2: '',
        post: '',
    });

    useEffect(() => {
        if(!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true")
        {
          navigate("/");
        }
        fetchCustomerData();
    }, [])

    const fetchCustomerData = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://roofing-31jz.onrender.com/api/getcustomers/${customerId}`, {
                headers: {
                  'Authorization': authToken,
                }
              });

              if (response.status === 401) {
                const json = await response.json();
                setAlertMessage(json.message);
                setloading(false);
                window.scrollTo(0,0);
                return; // Stop further execution
              }
              else{
                const json = await response.json();
            
                if (json.Success) {
                    setcustomer(json.customer);
                } else {
                    console.error('Error fetching Customerdata:', json.message);
                }
                console.log(customer);
                setloading(false);
              }
            
        } catch (error) {
            console.error('Error fetching Customerdata:', error);
        }
    };

    const handleSaveClick = async () => {
        try {
            const updatedcustomerdata = {
                ...customer
            };
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://roofing-31jz.onrender.com/api/updatecostomerdata/${customerId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken,
                },
                body: JSON.stringify(updatedcustomerdata)
            });

            if (response.status === 401) {
              const json = await response.json();
              setAlertMessage(json.message);
              setloading(false);
              window.scrollTo(0,0);
              return; // Stop further execution
            }
            else{
              const json = await response.json();

                if (json.Success) {
                    navigate('/userpanel/Customerlist');
                    console.log(updatedcustomerdata);
                } else {
                    console.error('Error updating Customerdata:', json.message);
                }  
            }

            
        } catch (error) {
            console.error('Error updating Customerdata:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setcustomer({ ...customer, [name]: value });
    };

    return (
        <div className='bg'>
        {
          loading?
          <div className='row'>
            <ColorRing
          // width={200}
          loading={loading}
          // size={500}
          display="flex"
          justify-content= "center"
          align-items="center"
          aria-label="Loading Spinner"
          data-testid="loader"        
        />
          </div>:
            <div className='container-fluid'>
                <div className="row">
                    <div className='col-lg-2 col-md-3 vh-lg-100 vh-md-100 b-shadow bg-white d-lg-block d-md-block d-none'>
                        <div  >
                            <Usernavbar/>
                        </div>
                    </div>

                    <div className="col-lg-10 col-md-9 col-12 mx-auto">
                        <div className='d-lg-none d-md-none d-block mt-2'>
                            <Usernav/>
                        </div><div className='mt-4 mx-4'>
                            {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
                        </div>
                        <form>
                            <div className="bg-white my-5 p-4 box mx-4">
                                <div className='row'>
                                    <p className='h5 fw-bold'>Edit Customer</p>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb mb-0">
                                            <li className="breadcrumb-item">
                                                <a href="/userpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <a href="/userpanel/Customerlist" className='txtclr text-decoration-none'>Customer</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Edit Customer</li>
                                        </ol>
                                    </nav>
                                </div><hr />

                                <div className="row">
                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputtext1" className="form-label">
                                            Customer Name
                                            </label>
                                            <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={customer.name}
                                            onChange={handleInputChange}
                                            placeholder="Customer Name"
                                            id="exampleInputtext1"
                                            required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputEmail1" className="form-label">
                                            Contact Email
                                            </label>
                                            <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={customer.email}
                                            onChange={handleInputChange}
                                            placeholder="Contact Email"
                                            id="email"
                                            aria-describedby="emailHelp"
                                            required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="Number" className="form-label">
                                            Phone Number
                                            </label>
                                            <input
                                            type="number"
                                            name="number"
                                            value={customer.number}
                                            className="form-control"
                                            onChange={handleInputChange}
                                            placeholder="Phone Number"
                                            id="phonenumber"
                                            required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-12 col-lg-12">
                                        <div className="mb-3">
                                            <label htmlFor="information" className="form-label">
                                            Additional Information
                                            </label>
                                            <textarea
                                            type="text"
                                            className="form-control"
                                            value={customer.information}
                                            name="information"
                                            onChange={handleInputChange}
                                            placeholder="Information"
                                            id="information"
                                            required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-6">
                                        <div className="mb-3">
                                            <label htmlFor="Address1" className="form-label">
                                            Address 1
                                            </label>
                                            <input
                                            type="message"
                                            name="address1"
                                            value={customer.address1}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            placeholder="Address 1"
                                            id="Address1"
                                            required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-6">
                                        <div className="mb-3">
                                            <label htmlFor="Address2" className="form-label">
                                            Address 2
                                            </label>
                                            <input
                                            type="message"
                                            name="address2"
                                            value={customer.address2}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            placeholder="Address 2"
                                            id="Address2"
                                            required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-6">
                                        <div className="mb-3">
                                            <label htmlFor="Country" className="form-label">Country</label>
                                            <CountrySelect
                                                name="country"
                                               defaultValue={customer.countrydata != '' ? JSON.parse(customer.countrydata): null}
                                                onChange={(val) => {
                                                    setcustomer({...customer, country: val.name});
                                                    setcustomer({...customer, countryid: val.id});
                                                    setcustomer({...customer, countrydata: JSON.stringify(val)});
                                                }}
                                                
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-6">
                                        <div className="mb-3">
                                            <label htmlFor="State" className="form-label">State</label>
                                            <StateSelect
                                                name="state"
                                                countryid={customer.countryid != 0 ? customer.countryid : 0}
                                                defaultValue={customer.statedata != '' ? JSON.parse(customer.statedata): null}
                                                onChange={(val) => {
                                                    setcustomer({...customer, state: val.name});
                                                    setcustomer({...customer, stateid: val.id});
                                                    setcustomer({...customer, statedata: JSON.stringify(val)});
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-6">
                                        <div className="mb-3">
                                            <label htmlFor="City" className="form-label">City</label>
                                            <CitySelect
                                                countryid={customer ? customer.countryid : 0}
                                                stateid={customer ? customer.stateid : 0}
                                                defaultValue={customer.citydata != '' ? JSON.parse(customer.citydata): null}
                                                onChange={(val) => {
                                                    setcustomer({...customer, city: val.name});
                                                    setcustomer({...customer, cityid: val.id});
                                                    setcustomer({...customer, citydata: JSON.stringify(val)});
                                                }}
                                                placeHolder="Select City"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-6">
                                        <div className="mb-3">
                                            <label htmlFor="post" className="form-label">
                                            Post
                                            </label>
                                            <input
                                            type="text"
                                            name="post"
                                            value={customer.post}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            placeholder="post"
                                            id="post"
                                            required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button type="button" className='btn btnclr text-white me-2' onClick={handleSaveClick}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
}
        </div>
    );
}
