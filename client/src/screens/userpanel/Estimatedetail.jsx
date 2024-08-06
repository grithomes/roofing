import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ColorRing } from 'react-loader-spinner'
import Usernav from './Usernav';
import Usernavbar from './Usernavbar';
import { ReactMultiEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css'
import html2pdf from 'html2pdf.js';
// import he from 'he';
import CurrencySign from '../../components/CurrencySign ';
import Alertauthtoken from '../../components/Alertauthtoken';
// import { PDFViewer, pdf, PDFDownloadLink, Document, Image, Page, Text, Font, View, StyleSheet } from '@react-pdf/renderer';   

export default function Estimatedetail() {
  const [loading, setloading] = useState(true);
  const [signupdata, setsignupdata] = useState([]);
  const modalRef = useRef(null);
  const [items, setitems] = useState([]);
  const location = useLocation();
  const [selectedinvoices, setselectedinvoices] = useState(null);
  const [estimateData, setestimateData] = useState({
    customername: '', itemname: '', customeremail: '', EstimateNumber: '', purchaseorder: '',
    date: '', description: '', itemquantity: '', price: '', discount: '',
    amount: '', tax: '', taxpercentage: '', subtotal: '', total: '', amountdue: '', information: '',isAddSignature:''
  });

  const estimateid = location.state?.estimateid;
  const [transactionData, setTransactionData] = useState({
    paidamount: '',
    paiddate: '',
    method: '',
    note: ''
  });
  const [transactions, setTransactions] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [emails, setEmails] = useState([]);
  const [bccEmails, setBccEmails] = useState([]);
  const [content, setContent] = useState(``);
  const [showModal, setShowModal] = useState(false);
  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [ownerData, setOwnerData] = useState(null);
  const [signatureData, setsignatureData] = useState(null);

  
  const roundOff = (value) => {
    return Math.round(value * 100) / 100;
};
  
  useEffect(() => {

    console.log("estimateid ===========", estimateid);
    if (!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true") {
      navigate("/");
    }
    fetchsignupdata();
    if (estimateid) {
      fetchestimateData();
      fetchtransactiondata();
    }
  }, [estimateid])

  useEffect(() => {
    // console.log('Customer Email:', estimateData.customeremail);
    if (estimateData.customeremail) {
      setEmails([estimateData.customeremail]);
    }
  }, [estimateData.customeremail]);
  let navigate = useNavigate();

  const fetchestimateData = async () => {
    try {
      const userid = localStorage.getItem("userid");
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://roofing-31jz.onrender.com/api/getestimatedata/${estimateid}`, {
        headers: {
          'Authorization': authToken,
        }
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

        setestimateData(json);
        if (Array.isArray(json.items)) {
          setitems(json.items);
        }

        fetchOwnerData(); 

        if (json.isAddSignature || json.isCustomerSign) {
          // Wait for estimateData to be set before checking customer signature
          setTimeout(() => {
            
            checkCustomerSignature(json._id);
          }, 0);
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const checkCustomerSignature = async (estimateIdpass) => {
    if (!estimateIdpass) {
      console.error('Customer email is not defined');
      return;
    }
  
    try {
      const response = await fetch(`https://roofing-31jz.onrender.com/api/checkcustomersignature/${encodeURIComponent(estimateIdpass)}`);
      const json = await response.json();
      console.log('Customer signature response:', json);
      if (response.ok && json.hasSignature) {
        setsignatureData(json.signatureData); 
      } else {
        setsignatureData(null); 
      }
    } catch (error) {
      console.error('Error fetching customer signature:', error);
    }
  };

  const fetchOwnerData = async () => {
    try {
      const ownerId = localStorage.getItem('userid');
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://roofing-31jz.onrender.com/api/getownerdata/${ownerId}`, {
        headers: {
          'Authorization': authToken,
        }
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
    }
  };

  const fetchtransactiondata = async () => {
    try {
      const userid = localStorage.getItem("userid");
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://roofing-31jz.onrender.com/api/gettransactiondata/${estimateid}`, {
        headers: {
          'Authorization': authToken,
        }
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
          //   const totalPaidAmount = payments.reduce((total, payment) => total + payment.paidamount, 0);


        } else {
          console.error('Invalid data structure for transactions:', json);
        }
        setloading(false);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const fetchsignupdata = async () => {
    try {
      const userid = localStorage.getItem("userid");
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://roofing-31jz.onrender.com/api/getsignupdata/${userid}`, {
        headers: {
          'Authorization': authToken,
        }
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

        // if (Array.isArray(json)) {
        setsignupdata(json);
        // }
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  const formatCustomDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const handlePrintContent = async () => {
    const content = document.getElementById('invoiceContent').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Invoice</title>
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

  const handleEditContent = (estimateData) => {
    setselectedinvoices(estimateData);
    let estimateid = estimateData._id;
    console.log(estimateid);
    navigate('/userpanel/Editestimate', { state: { estimateid } });
  };

  const handleRemove = async (estimateid, estimateIdpass) => {
    try {
      // Check if there's a customer signature
      const signatureData = await checkCustomerSignature(estimateIdpass);
  
      // If a signature exists, delete it
      if (signatureData) {
        const authToken = localStorage.getItem('authToken');
        const deleteSignatureResponse = await fetch(`https://roofing-31jz.onrender.com/api/delcustomersignature/${encodeURIComponent(estimateIdpass)}`, {
          method: 'DELETE',
          headers: {
            'Authorization': authToken,
          }
        });
  
        if (!deleteSignatureResponse.ok) {
          const json = await deleteSignatureResponse.json();
          console.error('Error deleting customer signature:', json.message);
          return; // Stop further execution if deleting signature fails
        } else {
          console.log('Customer signature deleted successfully!');
        }
      }
  
      // Proceed with deleting the estimate data
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://roofing-31jz.onrender.com/api/delestimatedata/${estimateid}`, {
        method: 'GET',
        headers: {
          'Authorization': authToken,
        }
      });
  
      if (response.status === 401) {
        const json = await response.json();
        setAlertMessage(json.message);
        setloading(false);
        window.scrollTo(0, 0);
        return; // Stop further execution
      } else {
        const json = await response.json();
  
        if (json.success) {
          console.log('Data removed successfully!');
          navigate('/userpanel/Userdashboard');
        } else {
          console.error('Error deleting Invoice:', json.message);
        }
      }
  
    } catch (error) {
      console.error('Error deleting Invoice:', error);
    }
  };

  // const handleRemove = async (estimateid) => {
  //   try {
  //     const authToken = localStorage.getItem('authToken');
  //     const response = await fetch(`https://roofing-31jz.onrender.com/api/delestimatedata/${estimateid}`, {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': authToken,
  //       }
  //     });

  //     if (response.status === 401) {
  //       const json = await response.json();
  //       setAlertMessage(json.message);
  //       setloading(false);
  //       window.scrollTo(0, 0);
  //       return; // Stop further execution
  //     }
  //     else {
  //       const json = await response.json();

  //       if (json.success) {
  //         console.log('Data removed successfully!');
  //         navigate('/userpanel/Userdashboard');
  //       } else {
  //         console.error('Error deleting Invoice:', json.message);
  //       }
  //     }


  //   } catch (error) {
  //     console.error('Error deleting Invoice:', error);
  //   }
  // };

  // Function to handle changes in email input
  const handleEmailChange = (newEmails) => {
    setEmails(newEmails);
  };

  // Handler function to update the list of "BCC" emails
  const handleBccEmailsChange = (newEmails) => {
    setBccEmails(newEmails);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const contentAsPdf = await generatePdfFromHtml();
    const authToken = localStorage.getItem('authToken');
    const userid = estimateData.userid;

    // console.log(userEmail, "userEmail ============");
    try {
      const finalContent = content.trim() || ``; // If content is empty, use default value
      const response = await fetch('https://roofing-31jz.onrender.com/api/send-estimate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken,
        },
        body: JSON.stringify({
          to: emails,
          bcc: bccEmails,
          content: finalContent,
          companyName: signupdata.companyname,
          customdate: formatCustomDate(estimateData.date),
          // duedate: formatCustomDate(estimateData.duedate),
          EstimateNumber: estimateData.EstimateNumber,
          currencyType: signupdata.CurrencyType,
          amountdue: estimateData.amountdue,
          amountdue1: estimateData.total - transactions.reduce((total, payment) => total + payment.paidamount, 0),
          pdfAttachment: contentAsPdf,
          estimateId: estimateData._id,
          ownerId: ownerData.ownerId,
        }),
      });

      if (response.ok) {
        console.log('Email sent successfully!');
        // setShowModal(false);
        setShowEmailAlert(true);
        // Update the database with emailsent status
        const updatedData = { ...estimateData, emailsent: 'yes' }; // Update emailsent status
        await fetch(`https://roofing-31jz.onrender.com/api/updateestimateData/${estimateid}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken,
          },
          body: JSON.stringify(updatedData),
        });

        // Check if customer signature already exists
      const checkResponse = await fetch(`https://roofing-31jz.onrender.com/api/checkcustomersignature/${encodeURIComponent(estimateData._id)}`);
      const checkJson = await checkResponse.json();

      if (checkResponse.ok && !checkJson.hasSignature) {
        // Create new customer signature only if it doesn't exist
        await fetch('https://roofing-31jz.onrender.com/api/customersignature', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': authToken,
          },
          body: JSON.stringify({
            estimateId: estimateData._id,
            userid,
            // ownerEmail:ownerData.email,
            // ownerId:ownerData.ownerId,
            customerName: estimateData.customername,
            customerEmail: estimateData.customeremail,
            customersign: "",
            documentNumber: estimateData.EstimateNumber,
            lastupdated: '',
            completeButtonVisible: false,
          }), 
        });
      }

        // Fetch updated invoice data
        fetchestimateData();
      } else {
        console.error('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  const handleAlertClose = () => {
    setShowEmailAlert(false); // Close the alert
  };

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
            <div className="row">
              <div className='col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none'>
                <div  >
                  <Usernavbar />
                </div>
              </div>

              <div className="col-lg-10 col-md-9 col-12 mx-auto">
                <div className='d-lg-none d-md-none d-block mt-2'>
                  <Usernav />
                </div>
                <div className='mx-3'>
                  <form>
                    <div className='row py-4 px-2 breadcrumbclr'>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-7 me-auto">
                        <p className='fs-35 fw-bold'>Estimate</p>
                        <nav aria-label="breadcrumb">
                          <ol class="breadcrumb mb-0">
                            <li class="breadcrumb-item"><a href="/Userpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                            <li class="breadcrumb-item active" aria-current="page">Estimatedetail</li>
                          </ol>
                        </nav>
                      </div>
                      <div className="col-lg-1 col-md-4 col-sm-4 col-3 text-right">
                        <div className="dropdown">
                          <button
                            className="btn dropdown-toggle no-arrow" // Updated class here
                            type="button"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="fa-solid fa-ellipsis ellipse px-3 py-1" ></i>
                          </button>
                          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">


                            <li><a className="dropdown-item" onClick={handlePrintContent}>Print</a></li>
                            <li><a className="dropdown-item" onClick={() => handleEditContent(estimateData)}>Edit</a></li>
                            <li><a className="dropdown-item" onClick={() => handleRemove(estimateData._id, estimateData.customeremail)}>Remove</a></li>
                          </ul>
                        </div>

                      </div>
                      <div className="col-lg-1">
                        <a className='btn rounded-pill btn-danger text-white fw-bold' data-bs-toggle="modal" data-bs-target="#sendEmailModal">Send</a>
                      </div>
                      <div className='my-2'>
                        {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
                      </div>
                    </div>

                    {showAlert && (
                      <>
                        <div className="row">
                          <div className="col-lg-7 col-sm-5 col-3"></div>
                          <div className="col-9 col-sm-7 col-lg-5">
                            <div class="alert alert-warning d-flex" role="alert">
                              <svg xmlns="http://www.w3.org/2000/svg" class="alertwidth bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                              </svg>
                              <div>
                                You cannot edit a document that has already been partially paid. Please create a new document.
                              </div>
                              <button type="button" class="btn-close" onClick={() => {
                                // setmessage(false);
                                setShowAlert("");
                              }}></button>

                            </div>
                          </div>
                        </div>

                      </>

                    )}

                    <div className="row">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-8" id="">
                        <div className='print' id='invoiceContent'>
                        <div className="invoice-body">
                            <div className='row'>
                              <div className='col-sm-12 col-md-6 mb-3 mb-md-0 pt-3'>
                                {signupdata.companyImageUrl !== "" ?
                                  <img src={signupdata.companyImageUrl} className='w-100 logoimage' alt="testing imahe" /> :
                                  <p className='h4 fw-bold'>{signupdata.companyname}</p>
                                }
                              </div>
                              <div className='col-sm-12 col-md-6 text-md-end'>
                                <h1>Estimate</h1>
                                <div className='text-inverse mb-1'>
                                  <strong>{signupdata.companyname}</strong>
                                </div>
                                <address className='m-t-5 m-b-5'>
                                  <div className='mb-2'>
                                    <div className=''>{signupdata.address} </div>
                                      {signupdata.city ? JSON.parse(signupdata.city).name+',' : ' '}
                                      {signupdata.state ? JSON.parse(signupdata.state).name : ' '}
                                  </div>
                                  <div>{signupdata.FirstName} {signupdata.User1_Mobile_Number}</div>
                                  <div>{signupdata.User2FirstName} {signupdata.User2_Mobile_Number}</div>
                                  <div>{signupdata.email}</div>
                                  <div>
                                    {signupdata.gstNumber == ''
                                    ?
                                  ""
                                  :
                                  signupdata.gstNumber
                                  }</div>

                                </address>
                              </div>

                            </div>
                            <div class="clr"></div>
                          </div>
                          <div className='invoice-header'>
                            <div className='row'>
                              <div className='invoice-to col-sm-12 col-md-6'>
                                <strong>Bill To</strong>
                                <div className='text-inverse mb-1'>
                                  {estimateData.customername}
                                </div>
                                <address className='m-t-5 m-b-5'>
                                  <div>{estimateData.customeremail}</div>
                                  {/* <div>{estimateData.customerphone || ''}</div> */}

                                </address>
                              </div>
                              <div className='invoice-date col-sm-12 col-md-6'>
                                <div className='row text-md-end'>
                                  <div className='col-6 col-md'>
                                    <strong>Estimate #</strong>
                                  </div>
                                  <div className='col-6 col-md invoice-detail-right'>{estimateData.EstimateNumber}</div>
                                </div>
                                <div className='row text-md-end'>
                                  <div className='col-6 col-md'>
                                    <strong>Date</strong>
                                  </div>
                                  <div className='col-6 col-md invoice-detail-right'>{formatCustomDate(estimateData.date)}</div>
                                </div>
                                {/* <div className='row text-md-end'>
                                  <div className='col-6 col-md'>
                                    <strong>Due date</strong>
                                  </div>
                                  <div className='col-6 col-md invoice-detail-right'>{formatCustomDate(estimateData.duedate)}</div>
                                </div> */}
                                {/* <div className='row text-md-end'>
                                  <div className='col-6 col-md'>
                                    <strong>PO #</strong>
                                  </div>
                                  <div className='col-6 col-md invoice-detail-right'>{formatCustomDate(estimateData.duedate)}</div>
                                </div> */}
                                <div className='row text-md-end'>
                                  <div className='col-6 col-md'>
                                    <strong>Job</strong>
                                  </div>
                                  <div className='col-6 col-md invoice-detail-right'>{estimateData.job}</div>
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
                                          {/* <div>{item.description.replace(/<\/?[^>]+(>|$)/g, '')}</div> */}
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
                                      <td className='text-end' width="22%"><CurrencySign />{roundOff(estimateData.subtotal)}</td>
                                    </tr>
                                    {
                                      estimateData.tax > 0 
                                      ?
                                      <tr>
                                        <td className='text-md-end' width="22%">{signupdata.TaxName} ({signupdata.taxPercentage}%) </td>
                                        <td className='text-end' width="22%"><CurrencySign />{roundOff(estimateData.tax)}</td>
                                      </tr>
                                      :
                                        null
                                    }
                                    {
                                      estimateData.discountTotal > 0 
                                      ?
                                        <tr>
                                          <td className='text-md-end' width="22%">Discount</td>
                                          <td className='text-end' width="22%"><CurrencySign />{roundOff(estimateData.discountTotal)}</td>
                                        </tr>
                                      :
                                        null
                                    }
                                    {/* <tr>
                                      {console.log(estimateData, "estimateData")}

                                      <td className='text-md-end' width="22%">Discount</td>
                                      <td className='text-end' width="22%">${roundOff(estimateData.discountTotal)}</td>
                                    </tr> */}
                                    {/* <tr>

                                      <td className='text-md-end' width="22%">{signupdata.TaxName} ({signupdata.taxPercentage}%)</td>
                                      <td className='text-end' width="22%">${roundOff(estimateData.tax)}</td>
                                    </tr> */}
                                    <tr>

                                      <td className='text-md-end' width="22%" style={{ borderBottom: '1px solid #ddd' }}>Total</td>
                                      <td className='text-end' width="22%" style={{ borderBottom: '1px solid #ddd' }}><CurrencySign />{roundOff(estimateData.total)}</td>
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
                            <div className="invoice-body">
                              <p>By signing this document, the customer agrees to the services and conditions described in this document.</p>
                              <div className="row">
                                  
                                    {ownerData && estimateData.isAddSignature && (
                                      <div className="col-6">
                                      <div className="my-2">
                                        <div>
                                          <p className='text-center fw-bold fs-5'>{ownerData.companyname}</p>
                                          <img src={ownerData.data} alt="Saved Signature" style={{ width: "100%" }} /><hr/>
                                          <p className='text-center'>{formatCustomDate(ownerData.createdAt)}</p>
                                        </div>
                                      </div>
                                      </div>
                                    )}
                                  <div className="col-6">
                                    <div className="my-2">
                                      <div>
                                        <p className='text-center fw-bold fs-5'>{estimateData.customername}</p>
                                        {signatureData != null ? 
                                          signatureData.customersign== '' ? (''):
                                            (<div className="signature-section">
                                              <img src={`${signatureData.customersign}`} alt="Customer Signature" style={{ width: "100%" }} /><hr/>
                                              <p className='text-center'>{formatCustomDate(signatureData.createdAt)}</p>
                                            </div>):''}
                                        {/* {signatureData ? (
                                            <div className="signature-section">
                                              <img src={`${signatureData.customersign}`} alt="Customer Signature" style={{ width: "100%" }} /><hr/>
                                              <p className='text-center'>{formatCustomDate(signatureData.createdAt)}</p>
                                            </div>
                                          ) : (
                                            ''
                                          )} */}
                                      </div>
                                    </div>
                                  </div>
                              </div>
                              
                            </div>: ''
                          }
                          

                          <div className='invoice-body'>
                            <div className='mt-1'>
                              <span>{estimateData.information == '' ? '' : 'Note:'}</span> <div dangerouslySetInnerHTML={{ __html: estimateData.information }} />

                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-sm-12 col-md-12 col-lg-4">
                        <div className='mb-2'>
                          {showEmailAlert && (
                            <div className="alert alert-success row" role="alert">
                              <div className="col-11">
                                <p className='mb-0'>Email sent successfully!</p>
                              </div>
                              <button type="button" className="btn-close" aria-label="Close" onClick={handleAlertClose}></button>
                            </div>
                          )}
                        </div>
                        <div className='box1 rounded adminborder px-4 py-4'>
                          <div className="row">
                            <div className="col-6">
                              <p>Total</p>
                            </div>
                            <div className="col-6 text-end">
                              <p><CurrencySign />{estimateData.total}</p>
                            </div>

                          </div><hr />
                        </div>
                      </div>

                    </div>


                  </form>
                </div>
              </div>
            </div>
          </div>
      }

      {/* email model  */}
      <div class="modal fade" id="sendEmailModal" tabindex="-1" ref={modalRef} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-4 fw-bold" id="exampleModalLabel">Send document</h1>
              <button type="button" class="btn-close" id="closebutton" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form onSubmit={handleFormSubmit}>
                <div class="row mb-3">
                  <label for="to" class="col-sm-2 col-form-label">To</label>
                  <div class="col-sm-10">
                    {/* <input type="text" class="form-control" id="to" name="to" value={invoiceData.customeremail}/> */}
                    <ReactMultiEmail
                      emails={emails}
                      onChange={handleEmailChange}
                      getLabel={(
                        email,
                        index,
                        removeEmail
                      ) => (
                        <div data-tag="true" key={index}>
                          {email}
                          <span
                            data-tag-handle="true"
                            onClick={() => removeEmail(index)}
                          >
                            ×
                          </span>
                        </div>
                      )}
                      placeholder="Add more people..."
                      style={{
                        input: { width: '90%' },
                        emailsContainer: { border: '1px solid #ccc' },
                        emailInput: { backgroundColor: 'lightblue' },
                        invalidEmailInput: { backgroundColor: '#f9cfd0' },
                        container: { marginTop: '20px' },
                      }}

                    />
                  </div>
                </div>
                <div class="row mb-3">
                  <label for="bcc" class="col-sm-2 col-form-label">Bcc</label>
                  <div class="col-sm-10">
                    <ReactMultiEmail
                      emails={bccEmails}
                      onChange={handleBccEmailsChange}
                      getLabel={(
                        email,
                        index,
                        removeEmail
                      ) => (
                        <div data-tag="true" key={index}>
                          {email}
                          <span
                            data-tag-handle="true"
                            onClick={() => removeEmail(index)}
                          >
                            ×
                          </span>
                        </div>
                      )}
                      placeholder="Add BCC recipients..."
                      style={{
                        input: { width: '90%' },
                        emailsContainer: { border: '1px solid #ccc' },
                        emailInput: { backgroundColor: 'lightblue' },
                        invalidEmailInput: { backgroundColor: '#f9cfd0' },
                        container: { marginTop: '20px' },
                      }}
                    />
                  </div>
                </div>
                <div class="mb-3">
                  <label for="content" class="form-label">Content</label>
                  <textarea class="form-control" id="content" name="content" rows="5" defaultValue={content} onChange={handleContentChange}></textarea>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Send</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
