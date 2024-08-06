import React,{useEffect} from 'react'
import Usernavbar from './Usernavbar'
import Dashboard from './Dashboard'
import Usernav from './Usernav'

export default function Userdashboard() { 
  return (
    <div className='bg'>
        <div className='container-fluid'>
            <div className="row">
                <div className='col-lg-2 col-md-3 ps-0 d-lg-block d-md-block d-none' >
                    <Usernavbar/>
                </div>
                <div className="col-lg-10 col-md-9 col-12 mx-auto">
                    <div className='d-lg-none d-md-none d-block mt-2'>
                        {/* <Nav/> */}
                        <Usernav/>
                    </div>
                    <Dashboard/>
                </div>
            </div>
        </div>
    </div>
  )
}
