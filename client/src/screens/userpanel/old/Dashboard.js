import React, { useState, useEffect } from 'react'
import { format } from 'date-fns';
import { useNavigate, useLocation } from 'react-router-dom'
import { ColorRing } from 'react-loader-spinner'
import CurrencySign from '../../components/CurrencySign ';
import Alertauthtoken from '../../components/Alertauthtoken';

export default function Dashboard() {
  const [loading, setloading] = useState(true);
  const [invoices, setinvoices] = useState([]);
  const location = useLocation();
  const invoiceid = location.state?.invoiceid;
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const entriesPerPage = 10;
  const status = 'Saved';
  useEffect(() => {
    if (!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true") {
      navigate("/");
    }
    fetchsignupdata();
    fetchData(status);
    // setloading(true)

  }, [])
  let navigate = useNavigate();
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [signupdata, setsignupdata] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');
  const [userEntries, setUserEntries] = useState([]);
  const currentDate = new Date(); // Get the current date

  const currentMonth = format(currentDate, 'MMMM');


  // useEffect(() => {
  //   const localstarttime = localStorage.getItem("startTime");
  //   if (localstarttime != undefined && localstarttime != null && localstarttime != "") {
  //     setStartTime(localstarttime);
  //     setIsClockedIn(true);
  //   }

  //   if (isClockedIn && startTime) {
  //     const interval = setInterval(() => {
  //       const currentTimestamp = new Date().getTime();
  //       const startTimestamp = new Date(startTime).getTime();
  //       const timeDifference = currentTimestamp - startTimestamp;
  //       const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  //       const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
  //       const seconds = Math.floor((timeDifference / 1000) % 60);
  //       setTotalTime(`${hours} hrs ${minutes} mins ${seconds} secs`);
  //     }, 1000);

  //     return () => clearInterval(interval);
  //   }
  //   else {
  //     setTotalTime('0 hrs 0 mins 0 secs');
  //   }
  //   // Calculate the start and end timestamps for the current month
  //   const currentMonthIndex = currentDate.getMonth(); // Get the current month (0-indexed)
  //   const currentYear = currentDate.getFullYear();
  //   const startOfMonth = new Date(currentYear, currentMonthIndex, 1, 0, 0, 0);
  //   const endOfMonth = new Date(currentYear, currentMonthIndex + 1, 0, 23, 59, 59);

  //   fetchUserEntries(startOfMonth, endOfMonth);
  // }, [isClockedIn, startTime]);

  // const fetchUserEntries = async (start, end) => {
  //   try {
  //     const userid = localStorage.getItem('userid');
  //     const response = await fetch(`https://roofing-31jz.onrender.com/api/userEntries/${userid}`);
  //     const data = await response.json();

  //     // Filter userEntries to include only entries for the current month
  //     const filteredEntries = data.userEntries.filter((entry) => {
  //       const entryTime = new Date(entry.startTime).getTime();
  //       return entryTime >= start.getTime() && entryTime <= end.getTime();
  //     });

  //     setUserEntries(filteredEntries);

  //     setTimeout(() => {
  //       setloading(false);
  //     }, 2000);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleAddinvoiceClick = () => {
    navigate('/userpanel/Createinvoice');
  }
  const handleAddestimateClick = () => {
    navigate('/userpanel/Createestimate');
  }

  const fetchsignupdata = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const userid = localStorage.getItem("userid");
      const response = await fetch(`https://roofing-31jz.onrender.com/api/getsignupdata/${userid}`, {
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

        // if (Array.isArray(json)) {
        setsignupdata(json);
        // }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const fetchData = async () => {
    try {
      const userid = localStorage.getItem("userid");
      const authToken = localStorage.getItem('authToken');
      let url = `https://roofing-31jz.onrender.com/api/invoicedata/${userid}`;
     // Add the status query parameter if provided
     if (status) {
      url += `?status=${encodeURIComponent(status)}`;
    }
    console.log("Status:->", status);
    

    const response = await fetch(url, {
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
        console.log("json:->===============",json);
      if (Array.isArray(json)) {
       setinvoices(json);

        const transactionPromises = json.map(async (invoice) => {
          const response = await fetch(`https://roofing-31jz.onrender.com/api/gettransactiondata/${invoice._id}`, {
            headers: {
              'Authorization': authToken,
            }
          });

          if (response.status === 401) {
            const transactionJson = await response.json();
            setAlertMessage(transactionJson.message);
            setloading(false);
            window.scrollTo(0,0);
            return; // Stop further execution
          }
          else{
            const transactionJson = await response.json();
            return transactionJson.map(transaction => ({
              ...transaction,
              invoiceId: invoice._id // Attach invoiceId to each transaction
            }));
          }
        });

        const transactionsData = await Promise.all(transactionPromises);
        const flattenedTransactions = transactionsData.flat(); // Flatten the transactions array
        setTransactions(flattenedTransactions);
      }
      setloading(false);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getStatus = (invoice) => {
    // Filter transactions related to the current invoice
    const relatedTransactions = transactions.filter(transaction => transaction.invoiceId === invoice._id);

    // console.log("relatedTransactions:", relatedTransactions);
    // console.log("Transactions:", transactions);
    // console.log("Invoices:", invoices);
    // Calculate the total paid amount for the current invoice
    const totalPaidAmount = relatedTransactions.reduce(
      (total, payment) => total + parseFloat(payment.paidamount),
      0
    );

    // console.log("totalPaidAmount:", totalPaidAmount);
    if (totalPaidAmount === 0) {
      return (
        <strong>
          <i class="fa-solid fa-circle fs-12 mx-2 saved"></i> Saved
        </strong>
      )
    } else if (totalPaidAmount > 0 && totalPaidAmount < invoice.total) {
      return (
        <strong>
          <i class="fa-solid fa-circle fs-12 mx-2 partiallypaid"></i> Partially Paid
        </strong>
      )
    } else if (totalPaidAmount === invoice.total) {
      return (
        <strong>
          <i class="fa-solid fa-circle fs-12 mx-2 paid"></i> Paid
        </strong>
      )
    } else {
      return "Payment Pending";
    }
  };

  const formatCustomDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const handleViewClick = (invoice) => {
    let invoiceid = invoice._id;
    navigate('/userpanel/Invoicedetail', { state: { invoiceid } });
  };

  // Pagination functions
  const getPageCount = () => Math.ceil(invoices.length / entriesPerPage);

  const getCurrentPageInvoices = () => {
    const startIndex = currentPage * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return invoices.slice(startIndex, endIndex);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * entriesPerPage < invoices.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      {
        loading ?
          <div className='row'>
            <ColorRing
              // width={200}
              loading={loading}
              // size={500}
              display="flex"
              justify-content="center"
              align-items="center"
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div> :
          <div className='mx-4'>

            <div className=''>
              <div className='txt px-4 py-4'>
                <h2 className='fs-35 fw-bold'>Dashboard</h2>
                 <p>Hi, {signupdata.companyname} ! &#128075;</p>
              </div>
              <div className='row'>
                <div className='col-12 col-sm-12 col-md-8 col-lg-8 '>
                  <div className='box1 rounded adminborder p-4 m-2'>
                    <p className='fs-6 fw-bold'>CREATE DOCUMENT</p>
                    <div className="row">
                      <div className="col-6 ">
                        <div className='px-4 py-4 dashbox pointer' onClick={handleAddinvoiceClick}>
                          <i class="fa-solid fa-receipt text-primary pe-3 fs-4"></i><span className='fs-6 fw-bold'>Create Invoice</span>
                        </div>
                      </div>
                      <div className="col-6 ">
                        <div className='px-4 py-4 dashbox pointer' onClick={handleAddestimateClick}>
                          <i class="fa-solid fa-receipt text-primary pe-3 fs-4"></i><span className='fs-6 fw-bold'>Create Estimate</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-12  col-sm-4 col-md-4 col-lg-4'>
                  <div className='box1 fw-bold rounded adminborder py-4 px-3 m-2'>
                  </div>
                </div>
              </div>

              {/* <div className="row">
                <div className='col-12 col-sm-4 col-md-4 col-lg-4'>
                  <div className='box1 fw-bold rounded adminborder py-4 px-3 m-2 text-center'>
                    <p className='fs-6 fw-bold'>TOTAL PAYMENTS RECEIVED</p>
                    <p className='fs-3 fw-bold'></p>
                  </div>
                </div>
                <div className='col-12 col-sm-4 col-md-4 col-lg-4'>
                  <div className='box1 fw-bold rounded adminborder py-4 px-3 m-2 text-center'>
                    <p className='fs-6 fw-bold'>OCTOBER INVOICE AMOUNT</p>
                    <p className='fs-3 fw-bold'></p>
                  </div>
                </div>
              </div> */}

              {/* <div className="row">
            <div className='col-12 col-sm-8 col-md-8 col-lg-8'>
              <div className='box1 fw-bold rounded adminborder py-4 px-3 m-2'>
                <div className="row">
                  <div className="col-3 greyclr">
                    <p>INVOICE</p>
                  </div>
                  <div className="col-3 greyclr">
                    <p>STATUS</p>
                  </div>
                  <div className="col-3 greyclr">
                    <p>DATE</p>
                  </div>
                  <div className="col-3 greyclr">
                    <p>AMOUNT</p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          
          <div className=''>
            {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
          </div>
              <div className="bg-white my-5 p-4 box">
                <div className="row px-2 table-responsive">
                <table className='table table-bordered'>
                      <thead>
                        <tr>
                          <th scope='col'>INVOICE </th>
                          <th scope='col'>STATUS </th>
                          <th scope='col'>DATE </th>
                          <th scope='col'>EMAIL STATUS </th>
                          <th scope='col'>VIEW </th>
                          <th scope='col'>AMOUNT </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getCurrentPageInvoices().map((invoice, index) => (
                          <tr key={index}>
                            <td>
                              <p className='my-0 fw-bold clrtrxtstatus'>{invoice.customername}</p>
                              <p className='my-0'>{invoice.InvoiceNumber}</p>
                              <p className='my-0'>Job: {invoice.job}</p>
                            </td>
                            <td>
                              <span className='clrtrxtstatus'>{getStatus(invoice)}</span>
                            </td>
                            <td>
                              <div className=''>
                                <div className='d-flex'>
                                  <p className='issue px-1 my-1'>Issued</p>
                                  <p className='datetext my-1'>{formatCustomDate(invoice.date)}</p>
                                </div>
                                <div className='d-flex'>
                                  <p className='due px-1'>Due</p>
                                  <p className='datetext'>{formatCustomDate(invoice.duedate)}</p>
                                </div>
                              </div>
                            </td>
                            <td className='text-center'>
                              <p className='datetext'>{invoice.emailsent}</p>
                            </td>
                            <td className='text-center'>
                              <a role='button' className='text-black text-center' onClick={() => handleViewClick(invoice)}>
                                <i className='fa-solid fa-eye'></i>
                              </a>
                            </td>
                            <td><CurrencySign />{invoice.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>

                {/* Pagination buttons */}
                <div className='row mt-3'>
                  <div className='col-12'>
                    <button onClick={handlePrevPage} className='me-2' disabled={currentPage === 0}>
                      Previous Page
                    </button>
                    <button onClick={handleNextPage} disabled={(currentPage + 1) * entriesPerPage >= invoices.length}>
                      Next Page
                    </button>
                  </div>
                </div>
              </div>



            </div>
          </div>
      }
    </div>
  )
}
