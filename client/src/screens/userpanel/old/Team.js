import React, { useState, useEffect }  from 'react'
import Usernavbar from './Usernavbar';
import { useNavigate } from 'react-router-dom';
import { ColorRing } from  'react-loader-spinner'
import { format } from 'date-fns';
import Usernav from './Usernav';
import Alertauthtoken from '../../components/Alertauthtoken';

export default function Team() {

    const [teammembers, setTeammembers] = useState([]);
    const [selectedteammembers, setselectedteammembers] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [ loading, setloading ] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [alertMessage, setAlertMessage] = useState('');
    const entriesPerPage = 10;
    
    const navigate = useNavigate();

    const handleAddClick = () => {
        navigate('/userpanel/Addteam');
    }

    useEffect(() => {
        if(!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true")
        {
          navigate("/");
        }
        // setloading(true)
        fetchdata();
    }, [])

    // useEffect(() => {
    //     fetchdata();
    // }, []);

    const handleTimeViewClick = (team) => {
        let teamid = team._id;
        navigate('/userpanel/Timeview', { state: { teamid } });
    };


    const fetchdata = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://roofing-31jz.onrender.com/api/teammemberdata/${userid}`, {
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
            
                if (Array.isArray(json)) {
                    setTeammembers(json);
                }
                setloading(false);
              }
            
        } catch (error) {
            console.error('Error fetching data:', error);
            setloading(false);
        }
    }

    const handleEditClick = (team) => {
        setselectedteammembers(team);
        let teamid = team._id;
        navigate('/userpanel/Editteam', { state: { teamid } });
    };

    const handleDeleteClick = async (teamid) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://roofing-31jz.onrender.com/api/delteammember/${teamid}`, {
                method: 'GET',
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
                    fetchdata(); // Refresh the teams list
                } else {
                    console.error('Error deleting teammember:', json.message);
                }
            }
        } catch (error) {
            console.error('Error deleting teammember:', error);
        }
    };

     // Filtering function
     const filteredTeamMembers = teammembers.filter(team =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getPageCount = () => Math.ceil(teammembers.length / entriesPerPage);

  const getCurrentPageItems = () => {
    const startIndex = currentPage * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return teammembers.slice(startIndex, endIndex);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * entriesPerPage < teammembers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className='bg'>
        <div className='container-fluid'>
            
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
                <div className='col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none'>
                    <div  >
                    <Usernavbar/>
                    </div>
                </div>

                <div className="col-lg-10 col-md-9 col-12 mx-auto">
                    <div className='d-lg-none d-md-none d-block mt-2'>
                        <Usernav/>
                    </div>
                    <div className='mt-5 mx-4'>
                        {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
                    </div>
                    <div className="bg-white my-5 p-4 box mx-4">
                        <div className='row py-2'>
                            <div className="col-lg-4 col-md-6 col-sm-6 col-7 me-auto">
                                <p className='h5 fw-bold'>Team</p>
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb mb-0">
                                        <li class="breadcrumb-item"><a href="/Userpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                                        <li class="breadcrumb-item active" aria-current="page">Team</li>
                                    </ol>
                                </nav>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-4 col-5 text-right">
                                <button className='btn rounded-pill btn-danger text-white fw-bold' onClick={handleAddClick}>+ Create</button>
                            </div>
                        </div><hr />

                        <div className='row my-2'>
                            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Search by name"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row px-2 table-responsive">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">ID </th>
                                        <th scope="col"> Name </th>
                                        <th scope="col">Email </th>
                                        <th scope="col">Phone Number  </th>
                                        <th scope="col">View </th>
                                        <th scope="col">Edit/Delete </th>
                                    </tr>
                                </thead>
                                <tbody>
                                            {getCurrentPageItems().map((team, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{team.name}</td>
                                                    <td>{team.email}</td>
                                                    <td>{team.number}</td>
                                                    <td className='text-center'>
                                                        <a role="button" className='text-black text-center' onClick={() => handleTimeViewClick(team)}>
                                                            <i className="fa-solid fa-eye"></i>
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <a role='button' className="btn btn-success btn-sm me-2 text-white" onClick={() => handleEditClick(team)}>
                                                                <i className="fa-solid fa-pen"></i>
                                                            </a>
                                                            <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteClick(team._id)}>
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {/* {filteredTeamMembers.map((team, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{team.name}</td>
                                                    <td>{team.email}</td>
                                                    <td>{team.number}</td>
                                                    <td className='text-center'>
                                                        <a role="button" className='text-black text-center' onClick={() => handleTimeViewClick(team)}>
                                                            <i className="fa-solid fa-eye"></i>
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <a role='button' className="btn btn-success btn-sm me-2 text-white" onClick={() => handleEditClick(team)}>
                                                                <i className="fa-solid fa-pen"></i>
                                                            </a>
                                                            <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteClick(team._id)}>
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))} */}
                                        </tbody>
                                {/* <tbody>
                                        {teammembers.map((team, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{team.name}</td>
                                                <td>{team.email}</td>
                                                <td>{team.number}</td> 
                                                <td className='text-center'>
                                                    <a role="button" className='text-black text-center' onClick={ () => handleTimeViewClick(team)}>
                                                        <i class="fa-solid fa-eye"></i>
                                                    </a>
                                                </td>
                                                <td>
                                                    <div className="d-flex">
                                                        <a role='button' className="btn btn-success btn-sm me-2 text-white" onClick={ () => handleEditClick(team)}>
                                                                    <i className="fa-solid fa-pen"></i>
                                                                </a>
                                                                <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteClick(team._id)}>
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody> */}
                            </table>

                        </div>
                         {/* Pagination buttons */}
            <div className='col-12'>
              <button onClick={handlePrevPage} className='me-2' disabled={currentPage === 0}>
                Previous Page
              </button>
              <button
                onClick={handleNextPage}
                disabled={(currentPage + 1) * entriesPerPage >= teammembers.length}
              >
                Next Page
              </button>
            </div>
                    </div>
                </div>
            </div>
}
        </div>
    </div>
  )
}
