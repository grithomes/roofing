import React, { useEffect,useState } from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
// import './Userstyle.css'
import './Userstyle.css'

export default function Usernav() {
  
  let navigate = useNavigate();
  const [ teammember, setTeammember ] = useState("true");
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
  useEffect(()=>{
    const tam = localStorage.getItem('isTeamMember');
    if(tam != undefined && tam != null && tam != "")
    {
      setTeammember(tam.toString());
    }
  })

  return (

    
    <div>
      <nav class="navbar bg-body-tertiary d-block d-lg-none d-md-none">
  <div class="">
    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon text-black"></span>
    </button>
    <div class="offcanvas offcanvas-start text-black" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasNavbarLabel">IN<span className='clrblue'>VOICE</span></h5>
        <button type="button" class="btn-close " data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body nav">
      <ul>
                    <li className='text-center'>
                      <Link to="/Userpanel/Userdashboard" className={`nav-link scrollto icones text-black ${location.pathname == '/Userpanel/Userdashboard' ? 'active' : ''}`} >
                        <span>Dashboard</span>
                      </Link>
                    </li>
                    <li>
                      <p className='greyclr nav-link'>Documents</p>
                    </li>
                    <li>
                      <Link to="/userpanel/Invoice" className='nav-link scrollto icones text-black' >
                        <i class="fa-solid fa-house me-2 dashclr"></i> <span>Invoice</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/userpanel/Estimate" className='nav-link scrollto icones text-black' >
                        <i class="fa-solid fa-house me-2 dashclr"></i> <span>Estimate</span>
                      </Link>
                    </li>
                    <li>
                      <p className='greyclr nav-link'>Management</p>
                    </li>
                    <li>
                      <Link to="/userpanel/Customerlist" className={`nav-link scrollto icones text-black ${
                                  location.pathname == '/userpanel/Customerlist' || 
                                  location.pathname == '/userpanel/Addcustomer' || 
                                  location.pathname == '/userpanel/Editcustomer' ? 'active' : ''}`} >
                        <i class="fa-solid fa-house me-2 dashclr"></i> <span>Customer List</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/userpanel/Itemlist" className={`nav-link scrollto icones text-black ${
                                  location.pathname == '/userpanel/Itemlist' || 
                                  location.pathname == '/userpanel/Additem' || 
                                  location.pathname == '/userpanel/Edititem' ? 'active' : ''}`} >
                        <i class="fa-solid fa-house me-2 dashclr"></i> <span>Item List</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/userpanel/Team" className={`nav-link scrollto icones text-black ${
                                  location.pathname == '/userpanel/Team' || 
                                  location.pathname == '/userpanel/Addteam' || 
                                  location.pathname == '/userpanel/Editteam' ||
                                  location.pathname == '/userpanel/Timeview' ||
                                  location.pathname == '/Timeschemahistory' ? 'active' : ''}`} >
                        <i class="fa-solid fa-house me-2 dashclr"></i> <span>Team</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/userpanel/Imageupload" className='nav-link scrollto icones text-black' >
                        <i class="fa-solid fa-house me-2 dashclr"></i> <span>Logo Upload</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/userpanel/Editprofile" className='nav-link scrollto icones text-black' >
                        <i class="fa-solid fa-house me-2 dashclr"></i> <span>Profile</span>
                      </Link>
                    </li>
                    
                      <li>
                        <a onClick={handleLogout} className=" pointer nav-link scrollto icones text-black">
                          <i class="fa-solid fa-right-from-bracket me-2"></i>
                          <span>Logout</span>
                        </a>
                      </li>
                  </ul>
      </div>
    </div>
  </div>
</nav>
    </div>

    // <div>
    //   <div className="sidebar-offcanvas pl-0" id="sidebar" role="navigation" style={{ backgroundColor: '#fff' }}>
    //     <header className="header d-xl-block menu" id="menu">
    //       <div className="d-flex flex-column ">
    //         <div className="text-center pt-5 pb-3">
    //         <h1 className='text-center mb-5 fw-bold'>IN<span className='clrblue'>VOICE</span></h1>
    //         </div>

    //         <nav className="sb-sidenav accordion sb-sidenav-dark text-black" id="sidenavAccordion">
    //           <div className="sb-sidenav-menu">
    //             <div className="nav">
    //               <ul>
    //                 <li className='text-center'>
    //                   <Link to="/Userpanel/Userdashboard" className='nav-link scrollto icones text-black' >
    //                     <span>Dashboard</span>
    //                   </Link>
    //                 </li>
    //                 <li>
    //                   <p className='greyclr nav-link'>Documents</p>
    //                 </li>
    //                 <li>
    //                   <Link to="" className='nav-link scrollto icones text-black' >
    //                     <i class="fa-solid fa-house me-2 dashclr"></i> <span>Invoice</span>
    //                   </Link>
    //                 </li>
    //                 <li>
    //                   <Link to="" className='nav-link scrollto icones text-black' >
    //                     <i class="fa-solid fa-house me-2 dashclr"></i> <span>Estimate</span>
    //                   </Link>
    //                 </li>
    //                 <li>
    //                   <p className='greyclr nav-link'>Management</p>
    //                 </li>
    //                 <li>
    //                   <Link to="/userpanel/Customerlist" className='nav-link scrollto icones text-black' >
    //                     <i class="fa-solid fa-house me-2 dashclr"></i> <span>Customer List</span>
    //                   </Link>
    //                 </li>
    //                 <li>
    //                   <Link to="/userpanel/Itemlist" className='nav-link scrollto icones text-black' >
    //                     <i class="fa-solid fa-house me-2 dashclr"></i> <span>Item List</span>
    //                   </Link>
    //                 </li>
    //                 <li>
    //                   <Link to="/userpanel/Team" className='nav-link scrollto icones text-black' >
    //                     <i class="fa-solid fa-house me-2 dashclr"></i> <span>Team</span>
    //                   </Link>
    //                 </li>
                    
    //                   <li>
    //                     <a onClick={handleLogout} className=" pointer nav-link scrollto icones text-black">
    //                       <i class="fa-solid fa-right-from-bracket me-2"></i>
    //                       <span>Logout</span>
    //                     </a>
    //                   </li>
    //               </ul>
    //             </div>
    //           </div>
    //         </nav>
    //       </div>
    //     </header>
    //   </div>

    // </div>
  )
}
