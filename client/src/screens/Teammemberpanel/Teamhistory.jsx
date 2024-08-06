import React, { useState, useEffect } from 'react'
import { ColorRing } from 'react-loader-spinner';
import Teamnav from './Teamnav'
import Teamnavbar from './Teamnavbar'
import { useNavigate, useLocation } from 'react-router-dom';
import Alertauthtoken from '../../components/Alertauthtoken';

export default function Teamhistory() {
    const [loading, setloading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const [userEntries, setUserEntries] = useState([]);
    const [uniqueMonths, setUniqueMonths] = useState([]); 
    const [currentPageByMonth, setCurrentPageByMonth] = useState({});
    const [entriesPerPage] = useState(10);
    const userid = location.state?.userid;
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        // if (!localStorage.getItem('authToken') || localStorage.getItem("isTeamMember") == "true") {
        //   navigate('/');
        // }
        fetchAllEntries();
      }, []);

    const fetchAllEntries = async () => {
        try {
            const teamid = localStorage.getItem('userid');
            const authToken = localStorage.getItem('authToken');
          const response = await fetch(`https://grithomes.onrender.com/api/userEntries/${teamid}`, {
            headers: {
              'Authorization': authToken,
            }
          });

          if (response.status === 401) {
            const data = await response.json();
            setAlertMessage(data.message);
            setloading(false);
            window.scrollTo(0,0);
            return; // Stop further execution
          }
          else{
  
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

          //   const data = await response.json();
    
          // setUserEntries(data.userEntries);
          // // Extract unique months from the entries
          // const months = [...new Set(data.userEntries.map((entry) => new Date(entry.startTime).getMonth()))];
          // setUniqueMonths(months);
    
          // const initialPageByMonth = {};
          // months.forEach((monthIndex) => {
          //   initialPageByMonth[monthIndex] = 0;
          // });
          // setCurrentPageByMonth(initialPageByMonth);
    
          setTimeout(() => {
            setloading(false);
          }, 2000);
          }
          
        } catch (error) {
          console.error(error);
        }
      };
    
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
      {/* {loading ? (
        <div className="row">
          <ColorRing
            // loading={loading}
            display="flex"
            justify-content="center"
            align-items="center"
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : ( */}
        <div className="row">
          <div className="col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none">
            <div>
              <Teamnavbar />
            </div>
          </div>
          <div className="col-lg-10 col-md-9 col-12 mx-auto">
            <div className="d-lg-none d-md-none d-block mt-2">
              <Teamnav/>
            </div>
            <div className='mt-4 mx-4'>
                            {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
                        </div>
            <div className="row my-4 mx-3">
              <div className="text">
                <p className='fs-4'>History</p>
              </div>
              <div className="box1 rounded adminborder pt-3 text-center pb-3">
  {uniqueMonths.map((monthIndex, index) => {
    const monthEntries = userEntries.filter(
      (entry) => new Date(entry.startTime).getMonth() === monthIndex
    );
    const monthName = new Date(monthEntries[0].startTime).toLocaleDateString('default', { month: 'long' });
    const paginatedEntries = paginate(monthEntries, currentPageByMonth[monthIndex], entriesPerPage);

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
          <table className="table">
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
                disabled={(currentPageByMonth[monthIndex] + 1) * entriesPerPage >= monthEntries.length}
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
{/* )} */}
    </div>
</div>
  )
}
