import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import Usernav from './Usernav';
import Alertauthtoken from '../../components/Alertauthtoken';
import { ColorRing } from 'react-loader-spinner'
import CurrencySign from '../../components/CurrencySign ';

function Customerwiseinvoice() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const location = useLocation();
  const customerEmail = location.state?.customerEmail;
  const [currentPage, setCurrentPage] = useState(0);
  const entriesPerPage = 10;
  const [totalReceived, setTotalReceived] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalUnpaid, setTotalUnpaid] = useState(0);
  

  useEffect(() => {
    if (!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") === "true") {
      navigate("/");
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
    //   const customerEmail = localStorage.getItem('customerEmail');
      const response = await fetch(`https://roofing-31jz.onrender.comapi/customerwisedata/${customerEmail}`, {
        headers: {
          'Authorization': authToken,
        }
      });

      if (response.status === 401) {
        const json = await response.json();
        setAlertMessage(json.message);
        setLoading(false);
        window.scrollTo(0, 0);
        return;
      } else {
        const json = await response.json();
        if (Array.isArray(json)) {
          setInvoices(json);
          calculateTotals(json);
        }
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const calculateTotals = (invoices) => {
    let received = 0;
    let paid = 0;
    let unpaid = 0;
    console.log(invoices, "invoice Print");
    invoices.forEach(invoice => {
        received += invoice.total || 0;
      });
     // Filter invoices with status 'Paid' or 'Partially Paid'
  const paidInvoices = invoices.filter(invoice => invoice.status === 'Paid' || invoice.status === 'Partially Paid');
  console.log(paidInvoices, "paidInvoices");
  paidInvoices.forEach(invoice => {
    // received += invoice.total || 0;
    paid += (invoice.total - invoice.amountdue) || 0;
    unpaid += invoice.amountdue || 0;
  });
  
  
  
//   invoices.forEach(invoice => {
//       paid += invoice.total || 0;
//       unpaid += invoice.amountdue || 0;
//     });
    setTotalReceived(received);
    setTotalPaid(paid);
    setTotalUnpaid(unpaid);
  };

  const getFilteredInvoices = () => {
    let filtered = invoices;
    if (filterStatus !== 'All') {
      filtered = filtered.filter(invoice => invoice.status === filterStatus);
    }
    if (searchQuery) {
      filtered = filtered.filter(invoice =>
        (invoice.customername?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (invoice.job?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const roundOff = (value) => {
    return Math.round(value * 100) / 100;
  };

  const formatCustomDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const getPageCount = () => Math.ceil(getFilteredInvoices().length / entriesPerPage);

  const getCurrentPageInvoices = () => {
    const filteredInvoices = getFilteredInvoices();
    const startIndex = currentPage * entriesPerPage;
    return filteredInvoices.slice(startIndex, startIndex + entriesPerPage);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * entriesPerPage < getFilteredInvoices().length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleViewClick = (invoice) => {
    let invoiceid = invoice._id;
    navigate('/userpanel/Invoicedetail', { state: { invoiceid } });
  };

  return (
    <div className='bg'>
      {
        loading ?
          <div className='row'>
            <ColorRing
              width={200}
              loading={loading}
              size={500}
              display="flex"
              justify-content="center"
              align-items="center"
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div> :
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none'>
                <div>
                  <Usernavbar />
                </div>
              </div>

              <div className='col-lg-10 col-md-9 col-12 mx-auto'>
                <div className='d-lg-none d-md-none d-block mt-2'>
                  <Usernav />
                </div>
                <div className='bg-white my-5 p-4 box mx-4'>
                  <div className=''>
                    {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
                  </div>
                  <div className='row py-2'>
                    <div className='col-lg-4 col-md-6 col-sm-6 col-7 me-auto'>
                      <p className='h5 fw-bold'>Customer Invoices</p>
                    </div>
                  </div>
                  <hr />

                <div className='row mb-3'>
                    <div className='col-4'>
                        <p className='fw-bold'>Total: <CurrencySign />{roundOff(totalReceived)}</p>
                    </div>
                    <div className='col-4'>
                        <p className='fw-bold'>Total Paid: <CurrencySign />{roundOff(totalPaid)}</p>
                    </div>
                    <div className='col-4'>
                        <p className='fw-bold'>Total Unpaid: <CurrencySign />{roundOff(totalUnpaid)}</p>
                    </div>
                </div>
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
                    <div className='col-3'>
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Search by name or job"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className='row px-2 table-responsive'>
                    <table className='table table-bordered'>
                      <thead>
                        <tr>
                          <th scope='col'>INVOICE</th>
                          <th scope='col'>STATUS</th>
                          <th scope='col'>DATE</th>
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
                                  <i className="fa-solid fa-circle fs-12 me-2"></i>
                                  <span className='clrtrxtstatus fw-bold'>Paid</span>
                                </span>
                              ) : invoice.status === 'Partially Paid' ? (
                                <span className='paid p-2 rounded-pill'>
                                  <i className="fa-solid fa-circle fs-12 me-2"></i>
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
                        disabled={(currentPage + 1) * entriesPerPage >= getFilteredInvoices().length}
                      >
                        Next Page
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      }
    </div>
  )
}

export default Customerwiseinvoice;
