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
  const [curMonTotalAmount, setCurMonTotalAmount] = useState(0);
  const [curMonPaidAmount, setCurMonPaidAmount] = useState(0);
  const [curMonUnpaidAmount, setCurMonUnpaidAmount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPaymentsReceived, setTotalPaymentsReceived] = useState(0);
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
  const [totalUnpaidAmount, setTotalUnpaidAmount] = useState(0);
  const entriesPerPage = 10;
  useEffect(() => {
    if (!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true") {
      navigate("/");
    }
    fetchsignupdata();
    fetchData();
    fetchCurMonReceivedAmount();
    fetchTotalPaymentsReceived();
    fetchOverdueInvoices();
    // setloading(true)

  }, [])
  let navigate = useNavigate();
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [signupdata, setsignupdata] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');
  const [userEntries, setUserEntries] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const currentDate = new Date(); // Get the current date

  const currentMonth = format(currentDate, 'MMMM');

  const roundOff = (value) => {
    return Math.round(value * 100) / 100;
};


  const handleAddinvoiceClick = () => {
    navigate('/userpanel/Createinvoice');
  }
  const handleAddestimateClick = () => {
    navigate('/userpanel/Createestimate');
  }
  const getFilteredInvoices = () => {
    if (filterStatus === 'All') {
      return invoices;
    }
    return invoices.filter(invoice => invoice.status === filterStatus);
  };

  const fetchsignupdata = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const userid = localStorage.getItem("userid");
      const response = await fetch(`https://grithomes.onrender.com/api/getsignupdata/${userid}`, {
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
      const response = await fetch(`https://grithomes.onrender.com/api/invoicedata/${userid}`, {
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
          const sortedInvoices = json.sort((a, b) => new Date(b.date) - new Date(a.date));
          setinvoices(sortedInvoices);

         
        }
        setloading(false);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchCurMonReceivedAmount = async () => {
    try {
      const userid = localStorage.getItem("userid");
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://grithomes.onrender.com/api/currentMonthReceivedAmount/${userid}`, {
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
      else {
        const json = await response.json();
        setCurMonTotalAmount(json.curMonTotalAmount);
        setCurMonPaidAmount(json.curMonPaidAmount);
        setCurMonUnpaidAmount(json.curMonUnpaidAmount);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchTotalPaymentsReceived = async () => {
    try {
        const authToken = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userid');
        const response = await fetch(`https://grithomes.onrender.com/api/totalPaymentReceived/${userId}`, {
            headers: {
                Authorization: authToken,
            },
        });
        if (response.status === 401) {
            const json = await response.json();
            console.error(json.message);
            return;
        }
        const json = await response.json();
        setTotalPaymentsReceived(json.totalPaymentReceived);
        setTotalInvoiceAmount(json.totalInvoiceAmount);
        setTotalUnpaidAmount(json.totalUnpaidAmount);
        setloading(false); // Consider if you need this here
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const fetchOverdueInvoices = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const userid = localStorage.getItem('userid');
    const response = await fetch(`https://grithomes.onrender.com/api/overdueInvoices/${userid}`, {
      headers: { 'Authorization': authToken },
    });
    if (response.status === 401) {
      const json = await response.json();
      setAlertMessage(json.message);
      setloading(false);
      window.scrollTo(0, 0);
      return;
    } else {
      const json = await response.json();
      setOverdueCount(json.overdueCount);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const handleOverdue = () => {
  navigate('/userpanel/Overdue');
};

  const getStatus = (invoice) => {
    // Filter transactions related to the current invoice
    const relatedTransactions = transactions.filter(transaction => transaction.invoiceId === invoice._id);

    console.log("relatedTransactions:", relatedTransactions);
    console.log("Transactions:", transactions);
    console.log("Invoices:", invoices);
    // Calculate the total paid amount for the current invoice
    const totalPaidAmount = relatedTransactions.reduce(
      (total, payment) => total + parseFloat(payment.paidamount),
      0
    );

    console.log("totalPaidAmount:", totalPaidAmount);
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
    const filteredInvoices = getFilteredInvoices();
    const startIndex = currentPage * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return filteredInvoices.slice(startIndex, startIndex + entriesPerPage);
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
                {console.log(signupdata, "signupdata")}
                <h2 className='fs-35 fw-bold'>Dashboard</h2>
                {signupdata.FirstName !=null && signupdata.FirstName !=undefined && signupdata.FirstName !='' 
                  ? <p>Hi, {signupdata.FirstName} ! &#128075;</p>
                  : ''
                }
                
                
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

              <div className="row">
                <div className='col-12 col-sm-4 col-md-4 col-lg-4'>
                  <div className='box1 rounded adminborder py-4 px-4 m-2 '>
                    <p className='fs-6 fw-bold'>PAYMENTS RECEIVED</p>
                    <p className='fs-3 fw-bold'><CurrencySign />{roundOff(totalInvoiceAmount)}</p>
                    {/* <p className='fs-3 fw-bold'><CurrencySign /></p> */}
                    <div className='d-flex'>
                      <p className='pe-3'><span className='text-primary'>Paid</span> <CurrencySign />{roundOff(totalPaymentsReceived)}</p>
                      <p><span className='text-warning'>Unpaid</span> <CurrencySign />{roundOff(totalUnpaidAmount)}</p>  
                      {/* <p className='pe-3'><span className='text-primary'>Paid</span> <CurrencySign /></p>
                      <p><span className='text-warning'>Unpaid</span> <CurrencySign /></p>   */}
                    </div>
                    <div className='d-flex'>
                      <p className='pe-3'><span className='text-danger'>Overdue </span>{overdueCount} <span className='pointer' onClick={handleOverdue}>Invoices</span></p>
                      {/* <p className='pe-3'><span className='text-danger'>Overdue </span><span>Invoices</span></p> */}
                    </div>
                  </div>
                </div>
                <div className='col-12 col-sm-4 col-md-4 col-lg-4'>
                  <div className='box1 rounded adminborder py-4 px-4 m-2'>
                    <p className='fs-6 fw-bold'>{currentMonth.toUpperCase()} INVOICE AMOUNT</p>
                    <p className='fs-3 fw-bold'><CurrencySign /> {roundOff(curMonTotalAmount)}</p>
                    <div className='d-flex'>
                      <p className='pe-3'><span className='text-primary'>Paid</span> <CurrencySign />{roundOff(curMonPaidAmount)}</p>
                      <p><span className='text-warning'>Unpaid</span> <CurrencySign />{roundOff(curMonUnpaidAmount)}</p>  
                    </div>
                  </div>
                </div>
              </div>

              
          
          <div className=''>
            {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
          </div>
              <div className="bg-white my-5 p-4 box">
              
            <div className='row mb-3'>
              <div className='col-3'>
                <select onChange={(e) => setFilterStatus(e.target.value)} className='form-select'>
                  <option value='All'>All</option>
                  <option value='Paid'>Paid</option>
                  <option value='Partially Paid'>Partially Paid</option>
                  <option value='Saved'>Saved</option>
                  <option value='Send'>Send</option>
                </select>
              </div>
            </div>

            <div className='row px-2 table-responsive'>
              <table className='table table-bordered'>
                <thead>
                  <tr>
                    <th scope='col'>INVOICE</th>
                    <th scope='col'>STATUS</th>
                    {/* <th scope='col'>Status</th> */}
                    <th scope='col'>DATE</th>
                    {/* <th scope='col'>EMAIL STATUS</th> */}
                    <th scope='col'>VIEW</th>
                    <th scope='col'>AMOUNT</th>
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
                      {/* <td>
                        <span className='clrtrxtstatus'>{getStatus(invoice)}</span>
                      </td> */}
                      
                        
                      <td>
  {invoice.status === 'Saved' ? (
    <span className='saved p-2 rounded-pill'>
    <i className="fa-solid fa-circle fs-12 me-2 grey-3"></i> 
    <span className='clrtrxtstatus fw-bold'>Saved</span>
  </span>
  ) : invoice.status === 'Send' ? (
    <span className='sent p-2 rounded-pill'>
      <i className="fa-solid fa-circle fs-12 me-2 text-primary"></i> 
      <span className='clrtrxtstatus fw-bold'>Send</span>
    </span>
  ) : invoice.status === 'Paid' ? (
    <span className='paid p-2 rounded-pill'>
      <i class="fa-solid fa-circle fs-12 me-2 "></i>
      <span className='clrtrxtstatus fw-bold'>Paid</span>
    </span>
  ) : invoice.status === 'Partially Paid' ? (
    <span className='paid p-2 rounded-pill'>
      <i class="fa-solid fa-circle fs-12 me-2"></i> 
      <span className='clrtrxtstatus fw-bold'>Partially Paid</span>
    </span>
  ) : (
    <>
      <i className="fa-solid fa-circle fs-12 me-2 unknown"></i> 
      <span className='clrtrxtstatus fw-bold'>Unknown Status</span>
    </>
  )}
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
                      {/* <td className='text-center'>
                        <p className='datetext'>{invoice.emailsent}</p>
                      </td> */}
                      <td className='text-center'>
                        <a role='button' className='text-black text-center' onClick={() => handleViewClick(invoice)}>
                          <i className='fa-solid fa-eye'></i>
                        </a>
                      </td>
                      <td><CurrencySign />{roundOff(invoice.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='row mt-3'>
              <div className='col-12'>
                <button onClick={handlePrevPage} className='me-2' disabled={currentPage === 0}>
                  Previous Page
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={(currentPage + 1) * entriesPerPage >= invoices.length}
                >
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
