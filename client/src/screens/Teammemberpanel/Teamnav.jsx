import React, { useEffect,useState } from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import './Teamstyle.css'

    const Teamnav = () => {
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
                    <li>
                      <Link to="/Teammemberpanel/Teammenberdashboard" className={`nav-link scrollto icones text-black ${location.pathname == '/Teammemberpanel/Teammenberdashboard' ? 'active' : ''}`}>
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
  </div>
</nav>
    </div>
  )
}

export default Teamnav
