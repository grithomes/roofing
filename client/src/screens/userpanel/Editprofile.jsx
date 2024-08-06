import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import Usernav from './Usernav';
import { useNavigate } from 'react-router-dom';
import { CountrySelect, StateSelect, CitySelect } from '@davzon/react-country-state-city';
import Alertauthtoken from '../../components/Alertauthtoken';

export default function Editprofile() {
const [signupdata, setsignupdata] = useState({});
const [alertMessage, setAlertMessage] = useState('');

const [countryid, setcountryid] = useState(false);
const [stateid, setstateid] = useState(false);
const [cityid, setcityid] = useState(false);

const [credentials, setCredentials] = useState({
    city: '',
    state: '',
    country: ''
});

let navigate = useNavigate();

useEffect(() => {
    if (!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") === "true") {
    navigate("/");
    }
    fetchsignupdata();
}, []);

const fetchsignupdata = async () => {
    try {
    const userid = localStorage.getItem("userid");
    const authToken = localStorage.getItem('authToken');
    const response = await fetch(`https://grithomes.onrender.com/api/getsignupdata/${userid}`, {
        headers: {
        'Authorization': authToken,
        }
    });
    if (response.status === 401) {
        const json = await response.json();
        setAlertMessage(json.message);
        window.scrollTo(0, 0);
        return;
    } else {
        const json = await response.json();
        setsignupdata(json);
        console.log(json, "fetch function");
        // Parse the stored JSON strings
        const parsedCountry = JSON.parse(json.country);
        const parsedState = JSON.parse(json.state);
        const parsedCity = JSON.parse(json.city);

        console.log("parsedCountry", parsedCountry.id);

        setcountryid(parsedCountry.id);
        setstateid(parsedState.id);
        setcityid(parsedCity.id);

        setCredentials({
            country: JSON.parse(json.country),
            state: JSON.parse(json.state),
            city: JSON.parse(json.city)
        });
    }
    } catch (error) {
    console.error('Error fetching data:', error);
    }
};

const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'city') {
        setsignupdata({ ...signupdata, [name]: JSON.parse(value) });
    } else {
        setsignupdata({ ...signupdata, [name]: value });
    }
};
const handleSaveClick = async () => {
    try {
    const userid = localStorage.getItem("userid");
    const authToken = localStorage.getItem('authToken');
    console.log("credentials:",credentials);
    const updatedsignupdata = {
        ...signupdata,
        country: JSON.stringify(credentials.country),
        state: JSON.stringify(credentials.state),
        city: JSON.stringify(credentials.city)
    };
    console.log("updatedsignupdata:->", updatedsignupdata);
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
        window.scrollTo(0, 0);
        return;
    } else {
        const json = await response.json();

        if (json.Success) {
        navigate('/userpanel/Userdashboard');
        localStorage.setItem("taxOptions", `[{"id":"${updatedsignupdata.TaxName}!${updatedsignupdata.taxPercentage}","name":"${updatedsignupdata.TaxName}","percentage":${updatedsignupdata.taxPercentage}}]`);
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
        <div>
            <Usernavbar />
        </div>
        </div>

        <div className="col-lg-10 col-md-9 col-12 mx-auto">
        <div className='d-lg-none d-md-none d-block mt-2'>
            <Usernav />
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
                    <div className="form-group pt-3">
                        <label className="label py-2" htmlFor="company_name">Company name</label>
                        <input type="text" className="form-control" name="companyname" value={signupdata.companyname} onChange={handleInputChange} placeholder="Company name" />
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
                    <div className="col-12 col-sm-6 col-lg-6">
                    <div className="mb-3">
                        <label htmlFor="Country" className="form-label">
                        Country {countryid} 
                        </label>
                        <CountrySelect
                        name="country"
                        defaultValue={credentials.country} // Ensure credentials.country is the entire country object
                        onChange={(val) => {
                            console.log(val);
                            setcountryid(val.id);
                            setCredentials({ ...credentials,  country: val });
                        }}
                        valueType="short"
                        className="form-control"
                        placeHolder="Select Country"
                        />
                    </div>
                    </div>

                    <div className="col-12 col-sm-6 col-lg-6">
                    <div className="mb-3">
                        <label htmlFor="State" className="form-label">
                        State
                        </label>
                        <StateSelect
                        name="state"
                        defaultValue={credentials.state}
                        countryid={countryid}
                        onChange={(val) => {
                            console.log(val);
                            setstateid(val.id);
                            setCredentials({ ...credentials, state: val});
                        }}
                        placeHolder="Select State"
                        />
                    </div>
                    </div>

                    <div className="col-12 col-sm-6 col-lg-6">
                    <div className="mb-3">
                        <label htmlFor="City" className="form-label">
                        City {console.log(credentials.city)}
                        </label>
                        <CitySelect
                        countryid={countryid}
                        defaultValue={credentials.city} 
                        stateid={stateid}
                        onChange={(val) => {
                            console.log(val);
                            setcityid(val.id);
                            setCredentials({ ...credentials, city: val  });
                        }}
                        placeHolder="Select City"
                        />
                    </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group pt-3">
                        <label className="label py-2" htmlFor="First_Name">First Name</label>
                        <input type="text" className="form-control" name="FirstName" value={signupdata.FirstName} onChange={handleInputChange} placeholder="First Name" />
                    </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group pt-3">
                        <label className="label py-2" htmlFor="Last_Name">Last Name</label>
                        <input type="text" className="form-control" name="LastName" value={signupdata.LastName} onChange={handleInputChange} placeholder="Last Name" />
                    </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group pt-3">
                        <label className="label py-2" htmlFor="User1_Mobile_Number">Number</label>
                        <input type="text" className="form-control" name="User1_Mobile_Number" value={signupdata.User1_Mobile_Number} onChange={handleInputChange} placeholder="Number" />
                    </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group pt-3">
                        <label className="label py-2" htmlFor="First_Name1">First Name</label>
                        <input type="text" className="form-control" name="User2FirstName" value={signupdata.User2FirstName} onChange={handleInputChange} placeholder="First Name" />
                    </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group pt-3">
                        <label className="label py-2" htmlFor="Last_Name">Last Name</label>
                        <input type="text" className="form-control" name="LastName" value={signupdata.User2LastName} onChange={handleInputChange} placeholder="Last Name" />
                    </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-4 col-lg-4">
                    <div className="form-group pt-3">
                        <label className="label py-2" htmlFor="User2_Mobile_Number">Number</label>
                        <input type="text" className="form-control" name="User2_Mobile_Number" value={signupdata.User2_Mobile_Number} onChange={handleInputChange} placeholder="Number" />
                    </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group mb-3 pt-3">
                        <label className="label py-2" htmlFor="email">Email</label>
                        <input type="text" className="form-control" name="email" value={signupdata.email} onChange={handleInputChange} placeholder="Email" />
                    </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group pt-3">
                        <label className="label py-2" htmlFor="gstNumber">Business Tax Number</label>
                        <input type="text" className="form-control" name="gstNumber" value={signupdata.gstNumber} onChange={handleInputChange} placeholder="Abn" />
                    </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group pt-3">
                        <label className="label py-2" htmlFor="TaxName">Business Tax Name</label>
                        <input type="text" className="form-control" name="TaxName" value={signupdata.TaxName || ''} onChange={handleInputChange} placeholder="Tax Name" />
                    </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                    <div className="form-group pt-3">
                        <label className="label py-2" htmlFor="taxPercentage">Tax in Percentage</label>
                        <input type="text" className="form-control" name="taxPercentage" value={signupdata.taxPercentage || 'No'} onChange={handleInputChange} placeholder="Tax Percentage (5%)" />
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
);
}
