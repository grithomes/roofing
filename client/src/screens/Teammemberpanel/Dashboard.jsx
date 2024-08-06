import React,{useState,useEffect} from 'react'
import { format } from 'date-fns';
import {useNavigate} from 'react-router-dom'
import { ColorRing } from  'react-loader-spinner';
import Alertauthtoken from '../../components/Alertauthtoken';
   
export default function Dashboard() {
  const [ loading, setloading ] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const entriesPerPage = 10; // Number of entries to display per page
      useEffect(() => {
        if(!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "false")
        {
          navigate("/");
        }
        // setloading(true)
        
    }, [])
    let navigate = useNavigate();
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [totalTime, setTotalTime] = useState(0);
    const [userEntries, setUserEntries] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const userid = localStorage.getItem('userid');
    const currentDate = new Date(); // Get the current date
  
    const currentMonth = format(currentDate, 'MMMM');

    const handleClockIn = async () => {
        try {
          let userid = localStorage.getItem('userid');
          let username = localStorage.getItem('username');
          let userEmail = localStorage.getItem('userEmail');
          let isTeamMember = localStorage.getItem('isTeamMember');
          const authToken = localStorage.getItem('authToken');

            const response = await fetch('https://roofing-31jz.onrender.com/api/clockin', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken,
              },
              body: JSON.stringify(
                {
                userid:userid,
                username:username,
                userEmail:userEmail,
                isTeamMember:isTeamMember
              }),
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
              setIsClockedIn(true);
              setStartTime(data.startTime);
              localStorage.setItem("startTime", data.startTime);
            }
            
          } catch (error) {
            console.error(error);
          }
        };

        const handleClockOut = async () => {
            try {
              let userid = localStorage.getItem('userid');
              let username = localStorage.getItem('username');
              let userEmail = localStorage.getItem('userEmail');
              let isTeamMember = localStorage.getItem('isTeamMember');
              const authToken = localStorage.getItem('authToken');
              const response = await fetch('https://roofing-31jz.onrender.com/api/clockout', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': authToken,
                },
                body: JSON.stringify(
                  {
                  userid:userid,
                  username:username,
                  userEmail:userEmail,
                  isTeamMember:isTeamMember
                }),
              });

              if (response.status === 401) {
                const json = await response.json();
                setAlertMessage(json.message);
                setloading(false);
                window.scrollTo(0,0);
                return; // Stop further execution
              }
              else{
                const data = await response.json();
                setIsClockedIn(false);
                localStorage.setItem("startTime", "");
          
                if (startTime) {
                  const startTimestamp = new Date(startTime).getTime();
                  const endTimestamp = new Date(data.endTime).getTime();
                  const timeDifference = endTimestamp - startTimestamp;
                  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
                  const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
                  const seconds = Math.floor((timeDifference / 1000) % 60);
                  setTotalTime(`${hours} hrs ${minutes} mins ${seconds} secs`);
                } 
              }
              
            } catch (error) {
              console.error(error);
              setloading(false);
            }
          };

          useEffect(() => {
            const localstarttime = localStorage.getItem("startTime");
            if(localstarttime != undefined && localstarttime != null && localstarttime != "")
            {
              setStartTime(localstarttime);
              setIsClockedIn(true);
            }

            if (isClockedIn && startTime) {
              const interval = setInterval(() => {
                const currentTimestamp = new Date().getTime();
                const startTimestamp = new Date(startTime).getTime();
                const timeDifference = currentTimestamp - startTimestamp;
                const hours = Math.floor(timeDifference / (1000 * 60 * 60));
                const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
                const seconds = Math.floor((timeDifference / 1000) % 60);
                setTotalTime(`${hours} hrs ${minutes} mins ${seconds} secs`);
              }, 1000);
        
              return () => clearInterval(interval);
            } 
            else {
              setTotalTime('0 hrs 0 mins 0 secs');
            }


            // Calculate the start and end timestamps for the current month
            const currentMonthIndex = currentDate.getMonth(); // Get the current month (0-indexed)
            const currentYear = currentDate.getFullYear();
            const startOfMonth = new Date(currentYear, currentMonthIndex, 1, 0, 0, 0);
            const endOfMonth = new Date(currentYear, currentMonthIndex + 1, 0, 23, 59, 59);

          fetchUserEntries(startOfMonth, endOfMonth);
          }, [isClockedIn, startTime]);



          const fetchUserEntries = async (start, end) => {
            try {
              const userid = localStorage.getItem('userid');
              const authToken = localStorage.getItem('authToken');
              const response = await fetch(`https://roofing-31jz.onrender.com/api/userEntries/${userid}`, {
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
        
                // Filter userEntries to include only entries for the current month
                const filteredEntries = data.userEntries.filter((entry) => {
                  const entryTime = new Date(entry.startTime).getTime();
                  return entryTime >= start.getTime() && entryTime <= end.getTime();
                });
          
                setUserEntries(filteredEntries);
                setloading(false);
              }
              

            } catch (error) {
              console.error(error);
              setloading(false);
            }
          };
        

// Regular expression to match hours, minutes, and seconds
const timePattern = /(\d+) hours (\d+) minutes (\d+) seconds/;

// Initialize variables for hours, minutes, and seconds
let totalHours = 0;
let totalMinutes = 0;
let totalSeconds = 0;

// Iterate through userEntries to extract and accumulate time
if(userEntries.length > 0){
userEntries.forEach((entry) => {
  if(entry.totalTime != undefined && entry.totalTime != null && entry.totalTime != ""){
  const matchs = entry.totalTime.match(timePattern);
  if (matchs) {
    totalHours += parseInt(matchs[1]);
    totalMinutes += parseInt(matchs[2]);
    totalSeconds += parseInt(matchs[3]);
  }
}
});
}

// Handle any overflow from seconds to minutes or minutes to hours
totalMinutes += Math.floor(totalSeconds / 60);
totalSeconds %= 60;
totalHours += Math.floor(totalMinutes / 60);
totalMinutes %= 60;


// Function to get the current page entries
const getCurrentPageEntries = () => {
  const startIndex = currentPage * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  return userEntries.slice(startIndex, endIndex);
};

// Function to handle the previous page
const handlePrevPage = () => {
  if (currentPage > 0) {
    setCurrentPage(currentPage - 1);
  }
};

// Function to handle the next page
const handleNextPage = () => {
  if ((currentPage + 1) * entriesPerPage < userEntries.length) {
    setCurrentPage(currentPage + 1);
  }
};

const GoToHistory = () => {
  navigate('/Teammemberpanel/History', { state: { userid } });
};

  return (
    <div>
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
      <div className='mx-4'>
        <div className='my-2'>
                    {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
                  </div>
        <div className=''>
          <div className='txt px-4 py-4'>
            <h2 className='fs-35 fw-bold'>Dashboard</h2>
          </div>
          <div className='row d-flex'>
            <div className='col-12 col-sm-6 col-md-6 col-lg-4 '>
              <div className='box1 rounded adminborder p-4 m-2'>
                <p className='mb-0'>22-Oct-2023</p>
                <p className='fs-25 fw-bold'>Clock In/Out</p>
                <div className="d-flex">
                {isClockedIn ? (
                    <button className="btn btn-danger text-white" onClick={handleClockOut}>Stop</button>
                    ) : (
                    <button className="btn btn-primary text-white mx-2" onClick={handleClockIn}>Start</button>
                    )}
                </div>

                <div className='pt-3'>
                    <p className='mb-0'>Time</p>
                    <p className='fs-3 fw-bold'>{totalTime}</p>
                </div>
              </div>
            </div>
            <div className='col-12 col-sm-6 col-md-6 col-lg-4'>
              <div className='box1 fw-bold rounded adminborder py-4 px-3 m-2'>
                <div>
                    <p className='mb-0'>Current month</p>
                    <p className='fs-25 fw-bold text-danger'>{currentMonth}</p>
                </div>
                <div className='pt-3'>
                    <p className='mb-0'>Total Time</p>
                    <p className='fs-3 fw-bold'>{totalHours} hrs {totalMinutes} mins {totalSeconds} secs</p>
                    {/* <p className='fs-3 fw-bold'>{totalMonthTime.hours} hrs {totalMonthTime.minutes} mins</p> */}

                </div>
              </div>
            </div>
          </div>

          <div className="row my-4">
            <div className="col-lg-4 col-md-6 col-sm-6 col-7 me-auto">
              <p className="h5 fw-bold">Current Month</p>
            </div>
            <div className="col-lg-3 col-md-4 col-sm-4 col-5 text-right d-flex justify-content-end">
              <button className="btn rounded-pill btnclr text-white fw-bold mb-2" onClick={GoToHistory}>
                History
              </button>
            </div>

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
                  {getCurrentPageEntries().map((entry) => (
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

            {userEntries.length > entriesPerPage && (
              <div className="row mt-3">
                <div className="col-12">
                  <button onClick={handlePrevPage} className='me-2' disabled={currentPage === 0}>
                    Previous Page
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={(currentPage + 1) * entriesPerPage >= userEntries.length}
                  >
                    Next Page
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
}
    </div>
  )
}
