import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import Usernav from './Usernav';
import Alertauthtoken from '../../components/Alertauthtoken';
// import { ColorRing } from 'react-loader-spinner';

export default function Esign() {
  const [loading, setLoading] = useState(true);
  const [customerSignData, setCustomerSignData] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") === "true") {
      navigate("/");
    } else {
      fetchCustomerSignData();
    }
  }, []);

  const fetchCustomerSignData = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      const userid = localStorage.getItem("userid");
      // Adjust URL as needed
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://roofing-31jz.onrender.comapi/getesigncustomerdata/${userid}`, {
        method: 'GET',
        headers: {
          Authorization: authToken,
        }
      });

      if (response.status === 401) {
        const json = await response.json();
        setAlertMessage(json.message);
      } else {
        const data = await response.json();
        setCustomerSignData(data);
      }
    } catch (error) {
      console.error('Error fetching customer signatures:', error);
      setAlertMessage('Error fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const formatCustomDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className='bg'>
      <div className='container-fluid'>
        {
          loading ?
            <div className='row'>
              {/* Uncomment and use this if you have a spinner component */}
              {/* <ColorRing
                loading={loading}
                display="flex"
                justify-content="center"
                align-items="center"
                aria-label="Loading Spinner"
                data-testid="loader"
              /> */}
            </div> :
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
                <div className='mt-5 mx-4'>
                  {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
                </div>
                <div className="bg-white my-5 p-4 box mx-4">
                  <div className='row py-2'>
                    <div className="col-lg-4 col-md-6 col-sm-6 col-7 me-auto">
                      <p className='h5 fw-bold'>E-Sign</p>
                      <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                          <li className="breadcrumb-item"><a href="/Userpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                          <li className="breadcrumb-item active" aria-current="page">E-Sign</li>
                        </ol>
                      </nav>
                    </div>
                  </div><hr />

                  <div className="row px-2 table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th scope="col">Status</th>
                          <th scope="col">Document Name</th>
                          <th scope="col">Created</th>
                          <th scope="col">Last Updated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerSignData.length > 0 ? (
                          customerSignData.map((item, index) => (
                            <tr key={index}>
                              <td>{item.status}</td>
                              <td>{item.documentNumber}</td>
                              <td>{formatCustomDate(item.createdAt)}</td>
                              {item.lastupdated != '' && item.lastupdated != undefined && item.lastupdated != null 
                               ? <td>{item.lastupdated} By {item.customerName}</td> : <td></td>}
                              {/* <td>{item.lastupdated != '' ? item.lastupdated +"By": ''  }</td> */}
                              
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4">No data available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
        }
      </div>
    </div>
  );
}
