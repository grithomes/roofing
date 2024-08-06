import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Usernavbar from './Usernavbar';
import Usernav from './Usernav';
import Alertauthtoken from '../../components/Alertauthtoken';
import CurrencySign from '../../components/CurrencySign ';
import { ColorRing } from 'react-loader-spinner';

const Overdue = () => {
  const [loading, setLoading] = useState(true);
  const [overdueInvoices, setOverdueInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');
  const entriesPerPage = 10;

  const location = useLocation();
  const invoiceId = location.state?.invoiceid;
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") === "true") {
      navigate("/");
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userid = localStorage.getItem("userid");
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://roofing-31jz.onrender.comapi/overdueInvoices/${userid}`, {
        headers: {
          'Authorization': authToken,
        }
      });

      if (response.status === 401) {
        const json = await response.json();
        setAlertMessage(json.message);
        setLoading(false);
        window.scrollTo(0, 0);
        return; // Stop further execution
      } else {
        const json = await response.json();
        if (Array.isArray(json.overdueInvoices)) {
          setOverdueInvoices(json.overdueInvoices);
        }
        setLoading(false);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
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
  const getPageCount = () => Math.ceil(overdueInvoices.length / entriesPerPage);

  const getCurrentPageInvoices = () => {
    const startIndex = currentPage * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return overdueInvoices.slice(startIndex, endIndex);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * entriesPerPage < overdueInvoices.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className='bg'>
      {loading ? (
        <div className='row'>
          <ColorRing
            loading={loading}
            display="flex"
            justifyContent="center"
            alignItems="center"
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
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
                    <p className='h5 fw-bold'>Overdue Invoices</p>
                  </div>
                </div>
                <hr />
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
                      {overdueInvoices.map((invoice, index) => (
                        <tr key={index}>
                          <td>
                            <p className='my-0 fw-bold clrtrxtstatus'>{invoice.customername}</p>
                            <p className='my-0'>{invoice.InvoiceNumber}</p>
                            <p className='my-0'>Job: {invoice.job}</p>
                          </td>
                          <td >
                            <span className='saved p-2 rounded-pill'>
                                <i className="fa-solid fa-circle fs-12 me-2 grey-3"></i> 
                                <span className='clrtrxtstatus fw-bold'>{invoice.status}</span>
                            </span>
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
                          <td><CurrencySign />{invoice.total}</td>
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
                      disabled={(currentPage + 1) * entriesPerPage >= overdueInvoices.length}
                    >
                      Next Page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overdue;
