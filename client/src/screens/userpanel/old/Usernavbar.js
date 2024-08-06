import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import dollar from '../../img/dollar.svg'
import pin from '../../img/pin.svg'
import logout from '../../img/logout.svg'
import customers from '../../img/customers.svg'
import items from '../../img/items.svg'
import user from '../../img/user.svg'
// import './Userstyle.css'
import './Userstyle.css'

export default function Usernavbar() {

  let navigate = useNavigate();
  const [teammember, setTeammember] = useState("true");
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isTeamMember');
    localStorage.removeItem('startTime');
    localStorage.removeItem('currencyType');
    navigate('/');
  };
  useEffect(() => {
    const tam = localStorage.getItem('isTeamMember');
    if (tam != undefined && tam != null && tam != "") {
      setTeammember(tam.toString());
    }
  })

  return (
    <div className='bg-white'>
      <div className="sidebar-offcanvas pl-0" id="sidebar" role="navigation" style={{ backgroundColor: '#fff' }}>
        <header className="header d-xl-block menu" id="menu">
          <div className="d-flex flex-column ">
            <div className="text-center pt-5 pb-3">
              <h1 className='text-center mb-5 fw-bold'>IN<span className='clrblue'>VOICE</span></h1>
            </div>

            <nav className="sb-sidenav accordion sb-sidenav-dark text-black" id="sidenavAccordion">
              <div className="sb-sidenav-menu">
                <div className="nav">
                  <ul>
                    <li className='text-center'>
                      <Link to="/Userpanel/Userdashboard" className={`nav-link scrollto w-100 icones text-black ${location.pathname == '/Userpanel/Userdashboard' ? 'active' : ''}`} >
                        <span >Dashboard</span>
                      </Link>
                    </li>
                    <li>
                      <p className='greyclr nav-link'>Documents</p>
                    </li>
                    <li>
                      <Link to="/userpanel/Invoice" className='nav-link scrollto icones w-100 text-black' >
                        <img src={dollar} width="24px" height='24px' /> <span className='ps-2'>Invoice</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/userpanel/Estimate" className='nav-link scrollto icones w-100 text-black' >
                        <img src={pin} width="24px" height='24px' /> <span className='ps-2'>Estimate</span>
                      </Link>
                    </li>
                    <li>
                      <p className='greyclr nav-link'>Management</p>
                    </li>
                    <li>
                      <Link to="/userpanel/Customerlist" className={`nav-link scrollto icones w-100 text-black ${location.pathname == '/userpanel/Customerlist' ||
                          location.pathname == '/userpanel/Addcustomer' ||
                          location.pathname == '/userpanel/Editcustomer' ? 'active' : ''}`} >
                        <img src={customers} width="24px" height='24px' /> <span className='ps-2'>Customer List</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/userpanel/Itemlist" className={`nav-link scrollto icones w-100 text-black ${location.pathname == '/userpanel/Itemlist' ||
                          location.pathname == '/userpanel/Additem' ||
                          location.pathname == '/userpanel/Edititem' ? 'active' : ''}`} >
                        <img src={items} width="24px" height='24px' /> <span className='ps-2'>Item List</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/userpanel/Team" className={`nav-link scrollto icones w-100 text-black ${location.pathname == '/userpanel/Team' ||
                          location.pathname == '/userpanel/Addteam' ||
                          location.pathname == '/userpanel/Editteam' ||
                          location.pathname == '/userpanel/Timeview' ||
                          location.pathname == '/Timeschemahistory' ? 'active' : ''}`} >
                        <img src={user} width="24px" height='24px' /> <span className='ps-2'>Team</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/userpanel/Imageupload" className='nav-link scrollto w-100 icones text-black' >
                        <img src={customers} width="24px" height='24px' /> <span className='ps-2'>Logo Upload</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/userpanel/Editprofile" className='nav-link scrollto w-100 icones text-black' >
                        <img src={customers} width="24px" height='24px' /> <span className='ps-2'>Profile</span>
                      </Link>
                    </li>

                    <li>
                      <a onClick={handleLogout} className=" pointer nav-link scrollto w-100 icones text-black">
                        <img src={logout} width="24px" height='24px' />
                        <span className='ps-2'>Logout</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </header>
      </div>

    </div>
  )
}
