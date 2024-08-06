import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Usernavbar from './Usernavbar';
import { ColorRing } from  'react-loader-spinner'
import Usernav from './Usernav';
import Alertauthtoken from '../../components/Alertauthtoken';

export default function Addteam() {
  const navigate = useNavigate();
  const [message, setMessage] = useState(false);
  const [alertShow, setAlertShow] = useState('');
  const [ loading, setloading ] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
  });

  useEffect(() => {
    if(!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true")
    {
      navigate("/");
    }
      setloading(true)
     setTimeout(()=>{
    setloading(false)
  
  },1000)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    let userid = localStorage.getItem('userid');
    const authToken = localStorage.getItem('authToken');
    const response = await fetch('https://roofing-31jz.onrender.comapi/addteammember', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken,
      },
      body: JSON.stringify({
        userid: userid,
        name: credentials.name,
        email: credentials.email,
        number: credentials.number,
        password: credentials.password,
      }),
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
      console.log(json);

      if (json.success) {
        setCredentials({
          name: '',
          email: '',
          number: '',
          password: '',
        });

        setMessage(true);
        setAlertShow(json.message);
        navigate('/userpanel/Team');
      
      } 

      else{
          alert("This Email already exist")
          setMessage(true)
          setAlertShow(json.message)
      }
    }

    
  };

  const onchange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <div className="bg">
      <div className="container-fluid">
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
        <div className="row">
          <div className="col-lg-2 col-md-3 b-shadow bg-white d-lg-block d-md-block d-none">
            <div>
              <Usernavbar />
            </div>
          </div>

          <div className="col-lg-10 col-md-9 col-12 mx-auto">
            <div className="d-lg-none d-md-none d-block mt-2">
              <Usernav/>
            </div>
            <div className='mt-4 mx-4'>
              {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
              <div className="col-12">
                          {message == true ? 
                            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                            <strong>{alertShow}</strong> 
                              <button type="button" class="btn-close" onClick={()=>{
                                setMessage(false);
                                setAlertShow("");
                              }}></button>
                              {/* <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button> */}

                            </div>
                            : 

                          ""}
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="bg-white my-5 p-4 box mx-4">
                <div className="row">
                  <p className="h5 fw-bold">Team</p>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <a href="/Userpanel/Userdashboard" className="txtclr text-decoration-none">
                          Dashboard
                        </a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Add a new Team Member
                      </li>
                    </ol>
                  </nav>
                </div>
                <hr />
                <div className="row">
                  <div className="col-11 m-auto box shadow">
                    <div className="p-3">
                      <p className="h5">Team Member details</p>
                      <hr />
                      <div className="row">
                        <div className="col-12 col-sm-6 col-lg-6">
                          <div className="mb-3">
                            <label htmlFor="exampleInputtext1" className="form-label">
                              Member Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              value={credentials.name}
                              onChange={onchange}
                              placeholder="Member Name"
                              id="exampleInputtext1"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-6">
                          <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">
                              Contact Email
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              name="email"
                              value={credentials.email}
                              onChange={onchange}
                              placeholder="Contact Email"
                              id="exampleInputEmail1"
                              aria-describedby="emailHelp"
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-6">
                          <div className="mb-3">
                            <label htmlFor="Number" className="form-label">
                              Phone Number
                            </label>
                            <input
                              type="number"
                              name="number"
                              className="form-control"
                              onChange={onchange}
                              placeholder="Phone Number"
                              id="phonenumber"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-12 col-sm-6 col-lg-6">
                          <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                              Password
                            </label>
                            <input
                              type="password"
                              name="password"
                              className="form-control"
                              onChange={onchange}
                              placeholder="Password"
                              id="password"
                              required
                            />
                          </div>
                        </div>
                        {/* <div className="col-12">
                          {message == true ? 
                            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                            <strong>{alertShow}</strong> 
                              <button type="button" class="btn-close" onClick={()=>{
                                setMessage(false);
                                setAlertShow("");
                              }}></button>
                            </div>
                            : 
                          ""}
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row pt-4 pe-2">
                  <div className="col-3 me-auto"></div>
                  <div className="col-4 col-sm-2">
                    <button className="btn btnclr text-white">Next</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
}
      </div>
    </div>
  );
}
