import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import Usernav from './Usernav';
import { ColorRing } from 'react-loader-spinner'
import CurrencySign from '../../components/CurrencySign ';
import Alertauthtoken from '../../components/Alertauthtoken';
// import Nav from './Nav';

export default function Invoice() {
  const [loading, setloading] = useState(true);
  const [invoices, setinvoices] = useState([]);
  const [selectedinvoices, setselectedinvoices] = useState(null);
  const location = useLocation();
  const invoiceid = location.state?.invoiceid;
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');
  const entriesPerPage = 10;

  useEffect(() => {
    if (!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true") {
      navigate("/");
    }
    fetchData();
  }, [])

  const fetchData = async () => {
    try {
      const userid = localStorage.getItem("userid");
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://roofing-31jz.onrender.comapi/invoicedata/${userid}`, {
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
          const response = await fetch(`https://roofing-31jz.onrender.comapi/gettransactiondata/${invoice._id}`, {
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

  const handleViewClick = (invoice) => {
    let invoiceid = invoice._id;
    navigate('/userpanel/Invoicedetail', { state: { invoiceid } });
  };

  const formatCustomDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const handleAddClick = () => {
    navigate('/userpanel/Createinvoice');
  }

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
    <div className='bg'>
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
                      <p className='h5 fw-bold'>Invoice</p>
                    </div>
                    <div className='col-lg-3 col-md-4 col-sm-4 col-5 text-lg-end text-md-end text-sm-end text-end'>
                      <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleAddClick}>
                        + Add New
                      </button>
                    </div>
                  </div>
                  <hr />

                  <div className='row px-2 table-responsive'>
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
          </div>
      }
    </div>
  )
}
