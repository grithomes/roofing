import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';
import Usernav from './Usernav';
import Alertauthtoken from '../../components/Alertauthtoken';

export default function Timeview() {
  const [loading, setloading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [userEntries, setUserEntries] = useState([]);
  const currentDate = new Date();
  const [alertMessage, setAlertMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [entriesPerPage] = useState(13); // Number of entries per page
if(location == null || location.state == null || location.state.teamid == null)
{
    navigate('/userpanel/Team')
}
const teamid = location.state?.teamid;
useEffect(() => {
    if (!localStorage.getItem('authToken') || localStorage.getItem("isTeamMember") == "true") {
      navigate('/');
    }
    fetchAllEntries();
  }, []);

  const fetchAllEntries = async () => {
    try {
      const currentMonthIndex = new Date().getMonth(); // Get the current month (0-indexed)
      const currentYear = new Date().getFullYear();
      const startOfMonth = new Date(currentYear, currentMonthIndex, 1, 0, 0, 0);
      const endOfMonth = new Date(currentYear, currentMonthIndex + 1, 0, 23, 59, 59);
      const authToken = localStorage.getItem('authToken');
  
      const response = await fetch(`https://roofing-31jz.onrender.com/api/userEntries/${teamid}`, {
        headers: {
          'Authorization': authToken,
        }
      });
  
      if (response.status === 401) {
        const data = await response.json();
        setAlertMessage(data.message);
        setloading(false);
        window.scrollTo(0, 0);
        return; // Stop further execution
      }
  
      const data = await response.json();
  
      // Filter userEntries to include only entries for the current month
      const filteredEntries = data.userEntries.filter((entry) => {
        const entryTime = new Date(entry.startTime).getTime();
        return entryTime >= startOfMonth.getTime() && entryTime <= endOfMonth.getTime();
      });
  
      // Sort the filtered entries by start time
      const sortedEntries = filteredEntries.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      setUserEntries(sortedEntries);
  
      setTimeout(() => {
        setloading(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };
  

const GoToHistory = () => {
  navigate('/Timeschemahistory', { state: { teamid } });
};

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the index of the first and last entry to display on the current page
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = userEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  

  return (
    <div className='bg'>
      <div className='container-fluid'>
      {loading ? (
        <div className="row">
          <ColorRing
            loading={loading}
            display="flex"
            justify-content="center"
            align-items="center"
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none">
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
            </div>
            <div className="row my-4 mx-4">
                <div className="col-lg-4 col-md-6 col-sm-6 col-7 me-auto">
                  <p className="h5 fw-bold">Current Month</p>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-4 col-5 text-right">
                  <button className="btn rounded-pill btnclr text-white fw-bold mb-2" onClick={GoToHistory}>
                    History
                  </button>
                </div>
              <hr />

              <div className="row px-0 table-responsive box1 rounded adminborder text-center">
                <table class="table table-bordered">
                    <thead>
                      <tr>
                          {/* <th scope="col">ID </th> */}
                          <th scope="col">Start Time</th>
                          <th scope="col">End Time</th>
                          <th scope="col">Start Date</th>
                          <th scope="col">End Date</th>
                          <th scope="col">Total Time</th>
                      </tr>
                    </thead>
                    <tbody>
                        {currentEntries.map((entry) => (
                              <tr key={entry._id}>
                                  {/* <th scope="row">{index + 1}</th> */}
                                  <td>{new Date(entry.startTime).toLocaleTimeString()}</td>
                                  <td>{entry.endTime ? new Date(entry.endTime).toLocaleTimeString() : '--'}</td>
                                  <td>{new Date(entry.startTime).toLocaleDateString()}</td>
                                  <td>{entry.endTime ? new Date(entry.endTime).toLocaleDateString() : '--'}</td>
                                  <td>{entry.totalTime}</td>
                              </tr>
                          ))}
                    </tbody>
                </table>
              </div>

              {/* <div className="box1 rounded adminborder pt-3 text-center">
                <div className="row pt-3">
                  <div className="col-2">
                    <p>Start Time</p>
                  </div>
                  <div className="col-2">
                    <p>End Time</p>
                  </div>
                  <div className="col-2">
                    <p>Start Date</p>
                  </div>
                  <div className="col-2">
                    <p>End Date</p>
                  </div>
                  <div className="col-4">
                    <p>Total Time</p>
                  </div>
                </div>

                {currentEntries.map((entry) => (
                  <div className="row" key={entry._id}>
                    <div className="col-2">
                      <p>{new Date(entry.startTime).toLocaleTimeString()}</p>
                    </div>
                    <div className="col-2">
                      <p>{entry.endTime ? new Date(entry.endTime).toLocaleTimeString() : '--'}</p>
                    </div>
                    <div className="col-2">
                      <p>{new Date(entry.startTime).toLocaleDateString()}</p>
                    </div>
                    <div className="col-2">
                      <p>{entry.endTime ? new Date(entry.endTime).toLocaleDateString() : '--'}</p>
                    </div>
                    <div className="col-4">
                      <p>{entry.totalTime}</p>
                    </div>
                  </div>
                ))}
              </div> */}

              {/* Pagination component */}
              <div className="pagination justify-content-end mt-3">
                {Array(Math.ceil(userEntries.length / entriesPerPage))
                  .fill(null)
                  .map((_, index) => (
                    <button key={index} className='mx-1' onClick={() => handlePageChange(index + 1)}>
                      {index + 1}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
