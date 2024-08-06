import React, { useEffect,useState } from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
// import './Userstyle.css'
import './Teamstyle.css'

export default function Teamnavbar() {
  
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
                    <li>
                      <Link to="/Teammemberpanel/Teammenberdashboard" className={`nav-link scrollto icones text-black ${location.pathname == '/Teammemberpanel/Teammenberdashboard' ? 'active' : ''}`} >
                        <i class="fa-solid fa-house me-2 dashclr"></i> <span>Dashboard</span>
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
            </nav>
          </div>
        </header>
      </div>

    </div>
  )
}
