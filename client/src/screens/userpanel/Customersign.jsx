import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams,useNavigate } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner'
import CurrencySign from '../../components/CurrencySign ';
import SignatureModal from '../../components/SignatureModal';
import html2pdf from 'html2pdf.js';

const Customersign = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const estimateId = searchParams.get('estimateId');
  const [estimateData, setEstimateData] = useState(null);
  const signatureButtonRef = useRef(null);
  const [loading, setloading] = useState(true);
  const [error, setError] = useState(null);
  const [signupdata, setsignupdata] = useState({
    Businesstype:"",
    CurrencyType:"",
    FirstName:"",
    LastName:"",
    TaxName:"",
    address:"",
    city:"",
    companyImageUrl:"",
    companyname:"",
    country:"",
    email:"",
    state:"",
    taxPercentage:"",
  });
  const [transactions, setTransactions] = useState([]);
  const [items, setitems] = useState([]);
  const [ownerData, setOwnerData] = useState(null);
  const [signatureData, setsignatureData] = useState(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isCompleteButtonVisible, setIsCompleteButtonVisible] = useState(false);
  const [showGoToSignButton, setShowGoToSignButton] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const shouldShowButton = showGoToSignButton && scrollPosition < window.innerHeight;
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!estimateId) {
      setError('Invalid Estimate ID');
      setloading(false);
      return;
    }
    fetchEstimateData();
    // fetchsignupdata();
    // fetchtransactiondata();
  }, [estimateId]);
  // useEffect(() => {
  //   fetchEstimateData();
  //   fetchsignupdata();
  //   fetchtransactiondata();
  // }, [estimateId]);

  useEffect(() => {
    if (estimateData) {
      fetchsignupdata();
      fetchtransactiondata();
      fetchOwnerData();
      

      if (estimateData.isAddSignature || estimateData.isCustomerSign) {
        checkCustomerSignature(estimateData._id);
      }
    }
  }, [estimateData]);

  useEffect(() => {
    const checkPageHeight = () => {
      if (window.innerHeight > 500) {
        setShowGoToSignButton(true);
      } else {
        setShowGoToSignButton(false);
      }
    };

    // Check page height on initial render
    checkPageHeight();

    // Add event listener for window resize and scroll
    window.addEventListener('resize', checkPageHeight);
    window.addEventListener('scroll', handleScroll);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('resize', checkPageHeight);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const generatePdfFromHtml = async () => {
    return new Promise((resolve, reject) => {
      const content = document.getElementById('invoiceContent').innerHTML;
      const opt = {
        margin: 0.2, 
        filename: 'myfile.pdf',
        html2canvas: { scale: 3, useCORS: true }, // Increase scale for better resolution
        jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
        userUnit: 450 / 210
      };

      html2pdf().from(content).set(opt).toPdf().get('pdf').then(function (pdf) {
        // pdf.setSelectableText(true);
        const pdfAsDataUri = pdf.output('datauristring', 'pdf');
        resolve(pdfAsDataUri);
      }).catch(function (error) {
        reject(error);
      });
    });
  };

  const handlePrintContent = async () => {
    const content = document.getElementById('invoiceContent').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Estimate</title>
        <style>
      
        .print-page{
          // width:80%;
          margin:auto
        }
        .adminborder{
        
          
          width:100%;
        }
        .row{
  
          width:100% !important;
          margin:auto;
        }
      .pt-30{
        padding-top:30px;
      }
      .pb-30{
        padding-bottom:30px;
      }
      .pb-90{
        padding-bottom: 66px;
        padding-top: 15px;
        padding-left: 10px;
        margin-top: 20px;
        margin-bottom: 30px;
      }

      .padding-20{
        padding-top:15px;
        padding-bottom:45px;
      }
        .col-6{
          width:50%;
          float:left
        }
        .col-md-6{
          width:50%;
          float:left
        }
        p, h1,h2,h3,h4,h5,h6 {
          margin:0
        }
        .clear{
          clear:both;
        }

        .invoice-contentcol-6{
          width:25% !important;
          float:left
        }

        .invoice-contentcol-2{
          width:25% !important;
          float:left;
        }
        
        .fw-bold{
          font-weight:bold;
        }

        .invoice-contentcol-12{
          width:100%;
        }

        .printcol-8{
          width:50%;
          float:left;
          text-align:right
        }
        .invoice-contentcol-8{
          width:50% !important;
          float:left;
          text-align:center;
        }

        .logoimage{
          width:50%;
        }

        .detailbg{
          background-color: #f0f3f4 !important;
        }

        .offset-8{
          width:25%;
        }

        .txt-center{
          text-align:left !important;
          }

        .text-left{
          text-align:left;
        }

        .text-right{
          text-align:right;
        }

        .right{
          text-align:right;
        }

        .padding{
          padding:20px
        }

        .flex{
          display: flex;
          justify-content: end;
        }

        .m-right{
          margin-right:100px;
        }
        
        /* Adjustments for better PDF rendering */
        body {
          font-size: 14px;
        }
        .invoice-content {
          page-break-inside: avoid;
        }
        .page-not-break {
          page-break-before: auto;
          page-break-after: auto;
          page-break-inside: avoid;
          reak-before: auto;
          break-after: auto;
          break-inside: avoid;
        }
        .invoice-price .invoice-price-right {
          width: 30%;
          background: #f0f3f4;
          color: black;
          border: 2px solid #f0f3f4;
          font-size: 28px;
          text-align: right;
          vertical-align: bottom;
          font-weight: 300;
          position: relative;
          right: 38px;
          padding: 28px 12px 16px;
        }
        .invoice-price .invoice-price-right span {
          display: block;
          font-weight: 400;
        }
        .invoice-price .invoice-price-right small {
          display: block;
          opacity: .7;
          position: absolute;
          top: 10px;
          left: 12px;
          font-size: 18px;
        }
        
        @media only screen and (max-width: 575.98px) {
              .invoice-price .invoice-price-right {
                  right: 18px;
              }
        
              .invoice-price-right{
                width: 290px !important;
                display: block !important;
              }
          }
        .invoice-price {
          /* background: #f0f3f4; */
          display: table;
          width: 100%;
        }
        .invoice-price .invoice-price-left, .invoice-price .invoice-price-right {
          display: table-cell;
          font-size: 20px;
          font-weight: 600;
          width: 70%;
          position: relative;
          vertical-align: middle;
        }
        .print {
          margin-top: 10px;
            max-width: 28cm;
            zoom: 0.8;
            box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.2);
            margin-right: auto;
            margin-left: auto;
            background: white !important;
            flex-direction: row; justify-content: space-between; margin-bottom: 10px;
        }
        .invoice-header {
          background: #f0f3f4;
          padding: 25px 50px;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
          }
          .invoice-header {
            background: #f0f3f4;
            padding: 25px 50px;
          }
          @page {
            /* Hide header and footer */
            margin: 0;
          }
          @page :first {
            /* Hide header on first page */
            header {
              display: none;
            }
          }
          @page {
            /* Hide footer on all pages */
            footer {
              display: none;
            }
          }
}
        .invoice-body {
          background: #fff;
          padding: 30px 50px;
        }
        .invoice-to {
          // padding-right: 20px;
        }
        .invoice-date {
          /* text-align: right; */
          // padding-left: 15px;
        }
        .table{
          width: 100%;
    margin-bottom: 1rem;
    color: #212529;
    vertical-align: top;
    border-color: #dee2e6;
        }
        .table>thead {
    vertical-align: bottom;
        border-color: inherit;
    border-style: solid;
    border-width: 0;
}

.col-12 {
  width: 100%;
}
thead{
  text-align:left;
}

.center{
  text-align:center;
}

.text-end {
  text-align: right;
}
        .invoice-table{
          padding: 20px 38px 10px;
        }
        .text-md-end {
          text-align: right;
        }
        .clr {
          clear: both;
        }

        .margin-top-sign{
          margin-top:20px
        }
        .col-md-6{
          width:50%;
          float: left;
        }
        .row {
    --bs-gutter-x: 1.5rem;
    --bs-gutter-y: 0;
    display: flex;
    flex-wrap: wrap;
    margin-top: calc(-1* var(--bs-gutter-y));
    margin-right: calc(-.5* var(--bs-gutter-x));
    margin-left: calc(-.5* var(--bs-gutter-x));
}
        
        .invoice-content {
          padding: 00px 38px 10px;
        }


        </style>
      </head>
      <body>
        <div class="print-page">
          ${content}
        </div>
      </body>
    </html>
  `);
    printWindow.document.close();
    await timeout(1000);
    printWindow.print();
  };
  function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
  }

  const fetchEstimateData = async () => {
    try {
      // const userid = localStorage.getItem("userid");
      // const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://grithomes.onrender.com/api/getemailestimatedata/${estimateId}`, {
        // headers: {
        //   'Authorization': authToken,
        // }
      });

      if (response.status === 401) {
        const json = await response.json();
        setAlertMessage(json.message);
        setloading(false);
        window.scrollTo(0, 0);
        return; // Stop further execution
      }
      else {
        const json = await response.json();
       

        setEstimateData(json);
        // fetchsignupdata();
        // fetchtransactiondata();
        //   fetchOwnerData(); 

      if (json.isAddSignature || json.isCustomerSign) {
        // Wait for estimateData to be set before checking customer signature
        setTimeout(() => {
          checkCustomerSignature(json._id);
        }, 0);
      }
        if (Array.isArray(json.items)) {
          setitems(json.items);
        }
      setloading(false);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setloading(false);
    }
  }

  const fetchsignupdata = async () => {
    try {
      const userId =  estimateData.userid;  // localStorage.getItem("userid");
      // const userid =   localStorage.getItem("userid");
      // const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://grithomes.onrender.com/api/getemailsignupdata/${userId}`, {
        // headers: {
        //   'Authorization': authToken,
        // }
      });

      if (response.status === 401) {
        const json = await response.json();
        setAlertMessage(json.message);
        setloading(false);
        window.scrollTo(0, 0);
        return; // Stop further execution
      }
      else {
        const json = await response.json();
        if(json != null){
        setsignupdata(json);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setloading(false);
    }
  }

  const fetchtransactiondata = async () => {
    try {
      // const userid = localStorage.getItem("userid");
      // const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://grithomes.onrender.com/api/getemailtransactiondata/${estimateId}`, {
        // headers: {
        //   'Authorization': authToken,
        // }
      });

      if (response.status === 401) {
        const json = await response.json();
        setAlertMessage(json.message);
        setloading(false);
        window.scrollTo(0, 0);
        return; // Stop further execution
      }
      else {
        const json = await response.json();

        // Check if the response contains paidamount
        if (Array.isArray(json)) {
          setTransactions(json);
          setloading(false);
          //   const totalPaidAmount = payments.reduce((total, payment) => total + payment.paidamount, 0);
        } else {
          console.error('Invalid data structure for transactions:', json);
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setloading(false);
    }
  }

  const fetchOwnerData = async () => {
    try {
      const ownerId = estimateData.userid;
      // const ownerId = localStorage.getItem('userid');
      // const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://grithomes.onrender.com/api/getemailownerdata/${ownerId}`, {
        // headers: {
        //   'Authorization': authToken,
        // }
      });

      if (response.status === 401) {
        const json = await response.json();
        setAlertMessage(json.message);
        setloading(false);
        window.scrollTo(0, 0);
        return; // Stop further execution
      } else {
        const json = await response.json();
        setOwnerData(json[0]); // Save all owner data
      }
    } catch (error) {
      console.error('Error fetching owner data:', error);
      setloading(false);
    }
  };

  const checkCustomerSignature = async (estimateIdpass) => {
    if (!estimateIdpass) {
      console.error('Customer estimateId is not defined');
      return;
    }
  
    try {
      const response = await fetch(`https://grithomes.onrender.com/api/checkcustomersignature/${encodeURIComponent(estimateIdpass)}`);
      const json = await response.json();
      console.log('Customer signature response:', json);
      console.log('Customer signature response:', response.ok);
      if (response.ok && json.hasSignature) {
        setsignatureData(json.signatureData); 
      } else {
        setsignatureData(null); 
      }
    } catch (error) {
      console.error('Error fetching customer signature:', error);
    }
  };

  const handleSignatureClick = async () => {
    setIsSignatureModalOpen(true);
    

    try {
      // Check if customer signature already exists
      const checkResponse = await fetch(`https://grithomes.onrender.com/api/checkcustomersignature/${encodeURIComponent(estimateData._id)}`);
      const checkJson = await checkResponse.json();
  
      if (checkJson.hasSignature) {
        // Update the existing customer signature
        const updateResponse = await fetch(`https://grithomes.onrender.com/api/updatecustomersignature/${encodeURIComponent(estimateData._id)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': authToken,
          },
          body: JSON.stringify({
            lastupdated: 'Viewed' || '',
          }),
        });
  
        // if (updateResponse.ok) {
        //   alert('Signature updated successfully');
        //   // checkCustomerSignature();
        // } else {
        //   alert('Error updating signature');
        // }
      } else {
        console.error('Error saving signature:', error);
      }
    } catch (error) {
      console.error('Error saving signature:', error);
      // alert('Error saving signature');
    } finally {
      // setIsSignatureModalOpen(false);
    }
  };
  
  const handleSaveSignature = async (signatureData) => {

    const authToken = localStorage.getItem('authToken');
    const userEmail = estimateData.userid;
    const ownerId= estimateData.userid;
  
    try {
      // Check if customer signature already exists
      const checkResponse = await fetch(`https://grithomes.onrender.com/api/checkcustomersignature/${encodeURIComponent(estimateData._id)}`);
      const checkJson = await checkResponse.json();
  
      // if (checkJson.ok) {
        // Update the existing customer signature
        const updateResponse = await fetch(`https://grithomes.onrender.com/api/updatecustomersignature/${encodeURIComponent(estimateData._id)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': authToken,
          },
          
          body: JSON.stringify({
            customersign: signatureData,
            estimateId: estimateId,
            userid: estimateData?.userid || '',
            customerName: estimateData?.customername || '',
            customerEmail: estimateData?.customeremail || '', 
            documentNumber: estimateData?.EstimateNumber || '', 
            lastupdated: 'Signed' || '',
            status: 'Signed', 
            completeButtonVisible: true,
          }),
        });
  
        if (updateResponse.ok) {
          alert('Signature updated successfully');
          checkCustomerSignature(estimateId);
          setIsCompleteButtonVisible(true)
        } else {
          alert('Error updating signature');
        }
      // } else {
      //   console.error('Error saving signature:', error);
      // }
    } catch (error) {
      console.error('Error saving signature:', error);
      alert('Error saving signature');
    } finally {
      // checkCustomerSignature();
      // setsignatureData(signatureData);
      setIsSignatureModalOpen(false);
    }
  };

  const handleGoToSignClick = () => {
    if (signatureButtonRef.current) {
      signatureButtonRef.current.scrollIntoView({ behavior: 'smooth' });
      // setShowGoToSignButton(false);
    }
  };

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    // clean up code
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
}, []);

console.log(offset); 
  const handleScroll = () => {
    setScrollPosition(window.pageYOffset);
    if (signatureButtonRef.current) {
      const { top } = signatureButtonRef.current.getBoundingClientRect();
      if (top < window.innerHeight && top > 0) {
        // User has reached the target element
        setShowGoToSignButton(false);
      } else {
        // User is not at the target element
        setShowGoToSignButton(true);
      }
    }
  };
  

  const roundOff = (value) => {
    return Math.round(value * 100) / 100;
};

  const formatCustomDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  // const handleDocumentComplete = () => {
  //   navigate(`/completedocument?estimateId=${estimateId}`); // Navigate to the new page
  // };

  const handleDocumentComplete = async () => {
    try {
      const ownerEmail = ownerData.email; // Fetch the owner email from ownerData
      if (!ownerEmail) {
        console.error('Owner email not found');
        return;
      }

      // Send email request to backend
      const response = await fetch('https://grithomes.onrender.com/api/send-estimate-signed-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: ownerEmail,
          estimateId: estimateData._id,
          ownerId: ownerData.ownerId,
          documentNumber: signatureData.documentNumber,
          customerName: signatureData.customerName,
        }),
      });

      if (response.ok) {
        console.log('Email sent successfully');
        navigate(`/completedocument?estimateId=${estimateId}`); 
      } else {
        console.error('Failed to send email');
      }
    } catch (error) {
      console.error('Error in handleDocumentComplete:', error);
    }
  };

  return (
    
    <div className='bg'>
    {
      loading ?
        <div className='row position-relative'>
          <ColorRing
            loading={loading}
            display="flex"
            justify-content="center"
            align-items="center"
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div> :
        <div className='container-fluid'>
            <div className="row">
                <div className='m-auto'>
                  <div className='text-center pt-5'>
                    <button className='pdfbtn text-center' onClick={handlePrintContent}><i class="fa-solid fa-print mx-2"></i>Pdf</button>
                  </div>

                    <div className="row py-4 px-2">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12" id="">
                        <div className='print' id='invoiceContent'>
                        <div className="invoice-body">
                            <div className='row'>
                              <div className='col-sm-12 col-md-6 mb-3 mb-md-0 pt-3'>
                                {signupdata != null ? signupdata.companyImageUrl != "" && signupdata.companyImageUrl != undefined && signupdata.companyImageUrl != null  ?
                                  <img src={signupdata.companyImageUrl} className='w-50 logoimage' alt="testing imahe" /> :
                                  <p className='h4 fw-bold'>{signupdata.companyname}</p>
                                  :""
                                }
                              </div>
                              <div className='col-sm-12 col-md-6 text-md-end'>
                                <h2>Estimate</h2>
                                <div className='text-inverse mb-1'>
                                  <strong>{signupdata != null ? signupdata.companyname : ""}</strong>
                                </div>
                              </div>

                            </div>
                            <div class="clr"></div>
                          </div>
                          <div className='invoice-header'>
                            <div className='row'>
                              <div className='invoice-to col-sm-12 col-md-6'>
                                <strong>Bill To</strong>
                                <div className='text-inverse mb-1'>
                                  {estimateData?.customername || ''}
                                </div>
                                <address className='m-t-5 m-b-5'>
                                  <div>{estimateData?.customeremail || ''}</div>
                                  <div>{estimateData?.customerphone || ''}</div>

                                </address>
                              </div>
                              <div className='invoice-date col-sm-12 col-md-6'>
                                <div className='row text-md-end'>
                                  <div className='col-6 col-md'>
                                    <strong>Estimate #</strong>
                                  </div>
                                  <div className='col-6 col-md invoice-detail-right'>{estimateData?.EstimateNumber || ''}</div>
                                </div>
                                <div className='row text-md-end'>
                                  <div className='col-6 col-md'>
                                    <strong>Date</strong>
                                  </div>
                                  <div className='col-6 col-md invoice-detail-right'>{formatCustomDate(estimateData?.date || '')}</div>
                                </div>
                                <div className='row text-md-end'>
                                  <div className='col-6 col-md'>
                                    <strong>Job</strong>
                                  </div>
                                  <div className='col-6 col-md invoice-detail-right'>{estimateData?.job || ''}</div>
                                </div>
                              </div>
                            </div>
                            <div class="clr"></div>
                          </div>

                          <div className='invoice-table'>
                            <div className='table-responsive'>
                              <table className='table table-invoice'>
                                <thead>
                                  <tr className='table table-invoice'>
                                    <th className='text-start'>Item</th>
                                    <th className='text-center d-none d-md-table-cell' width="15%">Quantity</th>
                                    <th className='text-end d-none d-md-table-cell' width="15%"> Price</th>
                                    <th className='text-end' width="15%"> Amount</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {items.map((item) => (
                                    <tr key={item._id}>
                                      <td>
                                        <div>
                                          <span><strong>{item.itemname}</strong></span>
                                          <div dangerouslySetInnerHTML={{ __html: item.description }} />
                                        </div>
                                      </td>
                                      <td className="text-center d-none d-md-table-cell">{item.itemquantity}</td>
                                      <td className="text-end d-none d-md-table-cell"><CurrencySign />{roundOff(item.price)}</td>
                                      <td className='text-end'><CurrencySign />{roundOff(item.amount)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <hr />
                            <div className='row'>
                              <div className='col-12'>
                                <table className='table table-borderless table-small'>
                                  <tbody>
                                    <tr>
                                      <td className='d-none d-md-table-cell' rowspan="5"></td>
                                      <td className='text-md-end' width="22%">Subtotal</td>
                                      <td className='text-end' width="22%"><CurrencySign />{roundOff(estimateData?.subtotal || '')}</td>
                                    </tr>
                                    {estimateData.discountTotal !=null && estimateData.discountTotal !=undefined && estimateData.discountTotal !='' ?
                                    
                                        estimateData.discountTotal > 0 
                                        ?
                                          <tr>
                                            <td className='text-md-end' width="22%">Discount</td>
                                            <td className='text-end' width="22%"><CurrencySign />{roundOff(estimateData.discountTotal)}</td>
                                          </tr>
                                        :
                                          null
                                       : ''
                                    }
                                    
                                    <tr>
                                    </tr>
                                    {transactions.map((transaction) => (
                                      <tr key={transaction._id}>
                                        <td className='text-md-end' width="22%">{transaction.method == "deposit" ? "Deposit" : "Paid"} on {formatCustomDate(transaction.paiddate)}</td>
                                        <td className='text-end' width="22%" style={{ borderBottom: '1px solid #ddd' }}><CurrencySign />{transaction.paidamount}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div class="clr"></div>
                          </div>

                          <div className='invoice-price page-not-break'>
                            <div className='invoice-price-left text-end'>
                              <div className='d-none d-md-block'></div>
                            </div>
                            <div className='invoice-price-right'>
                              <small>Amount Due</small>
                              <span class="f-w-600 mt-3"><CurrencySign />{roundOff(estimateData.total - transactions.reduce((total, payment) => total + payment.paidamount, 0))}</span>
                            </div>
                          </div>
                          {estimateData.isAddSignature || estimateData.isCustomerSign  ? 
                            <div className="invoice-body margin-top-sign">
                              <p>By signing this document, the customer agrees to the services and conditions described in this document.</p>
                              <div className="row ">
                                  <div className="col-6">
                                    {ownerData && (
                                      <div className="my-2">
                                        <div>
                                          <p className='text-center fw-bold fs-5 margin-top-sign txt-center center'>{ownerData.companyname}</p>
                                          <img src={ownerData.data} alt="Saved Signature" style={{ width: "100%" }} /><hr/>
                                          <p className='text-center txt-center center'>{formatCustomDate(ownerData.createdAt)}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="col-6">
                                    <div className="my-2">
                                      <div className='text-center txt-center center'>
                                        <p className='fw-bold fs-5 margin-top-sign txt-center center'>{estimateData.customername}</p>
                                        {console.log(signatureData, "signatureData ==========")}
                                        {signatureData != null ? 
                                        signatureData.customersign== ''?(
                                          <button className="signbtn" ref={signatureButtonRef} onClick={() => handleSignatureClick()}>Signature</button>
                                        ):(
                                            <div className="signature-section">
                                              <img src={`${signatureData.customersign}`} alt="Customer Signature" style={{ width: "100%" }} /><hr/>
                                              <p className='text-center txt-center center'>{formatCustomDate(signatureData.createdAt)}</p>
                                            </div>
                                        )
                                      : (
                                        ''
                                      )
                                        }
                                      </div>
                                    </div>
                                  </div>
                              </div>
                            </div>: ''
                          }
                          {isSignatureModalOpen.toString() == "true" && (
                              <SignatureModal
                                  onSave={handleSaveSignature}
                                  onClose={() => setIsSignatureModalOpen(false)}
                              />
                          )}
                          <div className='invoice-body'>
                            <div className='mt-1'>
                              <span>{estimateData.information == '' ? '' : 'Note:'}</span> <div dangerouslySetInnerHTML={{ __html: estimateData.information }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='text-center mb-4'>
                      {signatureData != null ? 
                        (signatureData.completeButtonVisible != "" && signatureData.completeButtonVisible != undefined && signatureData.completeButtonVisible != null ? 
                          <button className="btn btn-primary" onClick={handleDocumentComplete}>
                            Complete
                          </button>
                        : '')
                      : ('')}
                    </div>
                </div>
            </div>
        </div>
        }
    </div>
  );
};

export default Customersign;
