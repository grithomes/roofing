import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';
import Usernavbar from './userpanel/Usernavbar';
import Usernav from './userpanel/Usernav';
import Alertauthtoken from '../components/Alertauthtoken';

export default function Timeschemahistory() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [userEntries, setUserEntries] = useState([]);
  const [uniqueMonths, setUniqueMonths] = useState([]);
  const [currentPageByMonth, setCurrentPageByMonth] = useState({});
  const [entriesPerPage] = useState(10);
  const [alertMessage, setAlertMessage] = useState('');

  if (location == null || location.state == null || location.state.teamid == null) {
    navigate('/userpanel/Team');
  }
  const teamid = location.state?.teamid;

  useEffect(() => {
    if (!localStorage.getItem('authToken') || localStorage.getItem('isTeamMember') === 'true') {
      navigate('/');
    }
    fetchAllEntries();
  }, []);

  const fetchAllEntries = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://grithomes.onrender.com/api/userEntries/${teamid}`, {
        headers: {
          'Authorization': authToken,
        }
      });
  
      if (response.status === 401) {
        const data = await response.json();
        setAlertMessage(data.message);
        setLoading(false);
        window.scrollTo(0,0);
        return; // Stop further execution
      }
  
      const data = await response.json();
      const sortedEntries = data.userEntries.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      setUserEntries(sortedEntries);
  
      // Extract unique months from the sorted entries
      const months = [...new Set(sortedEntries.map((entry) => new Date(entry.startTime).getMonth()))];
      setUniqueMonths(months);
  
      const initialPageByMonth = {};
      months.forEach((monthIndex) => {
        initialPageByMonth[monthIndex] = 0;
      });
      setCurrentPageByMonth(initialPageByMonth);
  
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };
  
  // const fetchAllEntries = async () => {
  //   try {
  //     // Fetch all entries for the merchant's team (teamid)
  //   const authToken = localStorage.getItem('authToken');
  //     const response = await fetch(`https://grithomes.onrender.com/api/userEntries/${teamid}`, {
  //       headers: {
  //         'Authorization': authToken,
  //       }
  //     });
  //     if (response.status === 401) {
  //       const data = await response.json();
  //       setAlertMessage(data.message);
  //       setLoading(false);
  //       window.scrollTo(0,0);
  //       return; // Stop further execution
  //     }
  //     else{
  //         const data = await response.json();
    
  //         setUserEntries(data.userEntries);
  //         // Extract unique months from the entries
  //         const months = [...new Set(data.userEntries.map((entry) => new Date(entry.startTime).getMonth()))];
  //         setUniqueMonths(months);
      
  //         const initialPageByMonth = {};
  //         months.forEach((monthIndex) => {
  //           initialPageByMonth[monthIndex] = 0;
  //         });
  //         setCurrentPageByMonth(initialPageByMonth);
      
  //         setTimeout(() => {
  //           setLoading(false);
  //         }, 2000);
  //     }
      
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const fetchAllEntries = async () => {
  //   try {
  //     // Fetch all entries for the merchant's team (teamid)
  //     const response = await fetch(`https://grithomes.onrender.com/api/userEntries/${teamid}`);
  //     const data = await response.json();

  //     setUserEntries(data.userEntries);
  //     // Extract unique months from the entries
  //     const months = [...new Set(data.userEntries.map((entry) => new Date(entry.startTime).getMonth()))];
  //     setUniqueMonths(months);

  //     const initialPageByMonth = {};
  //     const initialMonthSubtotals = {};
  //     months.forEach((monthIndex) => {
  //       initialPageByMonth[monthIndex] = 0;
  //       initialMonthSubtotals[monthIndex] = 0;
  //     });
  //     setCurrentPageByMonth(initialPageByMonth);
  //     setMonthSubtotals(initialMonthSubtotals);

  //     // Calculate the subtotal for each month
  //     const calculatedSubtotals = {};
  //     data.userEntries.forEach((entry) => {
  //       const monthIndex = new Date(entry.startTime).getMonth();
  //       const totalTimeInSeconds = parseInt(entry.totalTime, 10); // Assuming totalTime is a string in seconds
  //       calculatedSubtotals[monthIndex] = (calculatedSubtotals[monthIndex] || 0) + totalTimeInSeconds;
  //     });
  //     setMonthSubtotals(calculatedSubtotals);

  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 2000);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const paginate = (items, page, pageSize) => {
    const startIndex = page * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  };

  const changePageForMonth = (monthIndex, nextPage) => {
    setCurrentPageByMonth({
      ...currentPageByMonth,
      [monthIndex]: nextPage,
    });
  };

  const formatTimeFromSeconds = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    return `${hours} hours ${minutes} minutes ${seconds} seconds`;
  };
  
  

  return (
    <div className='bg'>
      <div className='container-fluid'>
        {loading ? (
          <div className='row'>
            <ColorRing
              loading={loading}
              display='flex'
              justifyContent='center'
              alignItems='center'
              aria-label='Loading Spinner'
              data-testid='loader'
            />
          </div>
        ) : (
          <div className='row'>
            <div className='col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none'>
              <Usernavbar />
            </div>

            <div className='col-lg-10 col-md-9 col-12 mx-auto'>
              <div className='d-lg-none d-md-none d-block mt-2'>
                <Usernav />
              </div>
              <div className='mt-4 mx-4'>
                            {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
                        </div>
              <div className='row my-4 mx-3'>
                <div className='text'>
                  <p>History</p>
                </div>

                <div className='box1 rounded adminborder pt-3 text-center pb-3'>
                  {uniqueMonths.map((monthIndex, index) => {
                    const monthEntries = userEntries.filter(
                      (entry) => new Date(entry.startTime).getMonth() === monthIndex
                    );
                    const monthName = new Date(monthEntries[0].startTime).toLocaleDateString('default', {
                      month: 'long',
                    });
                    const paginatedEntries = paginate(
                      monthEntries,
                      currentPageByMonth[monthIndex],
                      entriesPerPage
                    );

                    return (
                      <React.Fragment key={monthName}>
                        {index > 0 && <hr />}
                        <div className='table-responsive'>
                          <h2>{monthName}</h2>
                          <p>
                            Total Time:{' '}
                            {formatTimeFromSeconds(
                              monthEntries.reduce((acc, curr) => {
                                const timeInSeconds = parseInt(curr.timeInSeconds);
                                return isNaN(timeInSeconds) ? acc : acc + timeInSeconds;
                              }, 0)
                            )}
                          </p>
                          <p></p>
                          <table className='table'>
                            <thead>
                              <tr>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Total Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedEntries.map((entry) => (
                                <tr key={entry._id}>
                                  
                                  <td>{new Date(entry.startTime).toLocaleTimeString()}</td>
                                  <td>{entry.endTime ? new Date(entry.endTime).toLocaleTimeString() : '--'}</td>
                                  <td>{new Date(entry.startTime).toLocaleDateString()}</td>
                                  <td>{entry.endTime ? new Date(entry.endTime).toLocaleDateString() : '--'}</td>
                                  <td>{entry.totalTime}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {monthEntries.length > entriesPerPage && (
                            <div>
                              <button
                                onClick={() => changePageForMonth(monthIndex, currentPageByMonth[monthIndex] - 1)}
                                disabled={currentPageByMonth[monthIndex] === 0}
                              >
                                Previous Page
                              </button>
                              <button
                                onClick={() => changePageForMonth(monthIndex, currentPageByMonth[monthIndex] + 1)}
                                disabled={
                                  (currentPageByMonth[monthIndex] + 1) * entriesPerPage >= monthEntries.length
                                }
                              >
                                Next Page
                              </button>
                            </div>
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
