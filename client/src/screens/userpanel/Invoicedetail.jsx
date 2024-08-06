import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ColorRing } from 'react-loader-spinner'
import Usernav from './Usernav';
import Usernavbar from './Usernavbar';
// import 'react-multi-email/style.css';
import { ReactMultiEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css'
import html2pdf from 'html2pdf.js';
import CurrencySign from '../../components/CurrencySign ';
import Alertauthtoken from '../../components/Alertauthtoken';

export default function Invoicedetail() {
  const [loading, setloading] = useState(true);
  const [signupdata, setsignupdata] = useState([]);
  const [showSendEmailModal, setShowSendEmailModal] = useState(false);
  const modalRef = useRef(null);
  const modalRefemail = useRef(null);
  const [items, setitems] = useState([]);
  const location = useLocation();
  const [selectedinvoices, setselectedinvoices] = useState(null);
  const [invoiceData, setInvoiceData] = useState({
    customername: '', itemname: '', customeremail: '', customerphone: '', InvoiceNumber: '', purchaseorder: '',
    date: '', duedate: '', description: '', itemquantity: '', price: '', discount: '',
    amount: '', tax: '', taxpercentage: '', subtotal: '', total: '', amountdue: '', information: '',
  });
  const [editorData, setEditorData] = useState("<p></p>");
  const [paidamounterror, setpaidamounterror] = useState("");
  const [paiddateerror, setpaiddateerror] = useState("");
  const [methoderror, setmethoderror] = useState("");
  const [exceedpaymenterror, setexceedpaymenterror] = useState("");
  const invoiceid = location.state?.invoiceid;
  const [duedepositDate, setDueDepositDate] = useState('')
  const [savedDepositData, setsavedDepositData] = useState('')
  const [alertMessage, setAlertMessage] = useState('');
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
  const [depositpercentage, setdepositPercentage] = useState('');
  const [amount, setAmount] = useState('');
  const [pdfExportVisible, setPdfExportVisible] = useState(false);
  


  useEffect(() => {
    if (!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true") {
      navigate("/");
    }
    fetchsignupdata();
    if (invoiceid) {
      fetchinvoicedata();
      fetchdepositdata();
      fetchtransactiondata();
    }
  }, [invoiceid])

  useEffect(() => {
    console.log('Customer Email:', invoiceData.customeremail);
    if (invoiceData.customeremail) {
      setEmails([invoiceData.customeremail]);
    }
  }, [invoiceData.customeremail]);

  let navigate = useNavigate();

  const roundOff = (value) => {
    return Math.round(value * 100) / 100;
};

  const handlePercentageChange = (event) => {
    setdepositPercentage(event.target.value);
    calculateAmount(event.target.value);
  };

  const calculateAmount = (depositpercentage) => {
    let totalAmount = invoiceData.total - transactions.reduce((total, payment) => total + payment.paidamount, 0);
    let calculatedAmount = (totalAmount * depositpercentage) / 100;
    setAmount(calculatedAmount.toFixed(2));
  };


  const handleDateChange = (event) => {
    setDueDepositDate(event.target.value);
  };

  const handleMarkDeposit = async () => {
    const userid = localStorage.getItem("userid");
    const authToken = localStorage.getItem('authToken');
    // Add logic to save the deposit in the database
    const depositAmount = parseFloat(savedDepositData.depositamount);
    if (depositAmount > 0) {
      const totalPaidAmount = transactions.reduce((total, payment) => total + payment.paidamount, 0);
      const newPaidAmount = totalPaidAmount + depositAmount;

      // Add the deposit transaction to the transactions array
      const newTransaction = {
        paidamount: newPaidAmount,
        paiddate: new Date().toISOString(), // Assuming current date as the paid date
        method: 'Deposit', // Assuming the deposit is made directly to the system
        note: 'Deposit', // Note for the deposit transaction
      };

      try {
        const response = await fetch('https://grithomes.onrender.com/api/addpayment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken,
          },
          body: JSON.stringify({
            paidamount: depositAmount,
            paiddate: new Date().toISOString(),
            method: "deposit",
            note: "Deposit",
            userid: userid,
            invoiceid: invoiceid,
            depositid: savedDepositData._id,
          }),
        });

        if (response.status === 401) {
          const responseData = await response.json();
          setAlertMessage(responseData.message);
          setloading(false);
          window.scrollTo(0, 0);
          return; // Stop further execution
        }
        else {
          if (response.ok) {
            const responseData = await response.json();
            if (responseData.success) {
              setsavedDepositData('');
              const setamountDue = roundOff(invoiceData.total - transactions.reduce((total, payment) => total + payment.paidamount, 0) - responseData.transaction.paidamount)
              console.log("setamountDue Mark Depoist: ==============", setamountDue);
  
  
              const updatedData = { 
  
                ...invoiceData,  
                amountdue: setamountDue, 
                status: `${
                  setamountDue == 0
                  ?
                  "Paid"
                  :
                  "Partially Paid"
                }`
              
              
              }; // Update emailsent status
          await fetch(`https://grithomes.onrender.com/api/updateinvoicedata/${invoiceid}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authToken,
            },
            body: JSON.stringify(updatedData),
          });
  

              console.log('Payment added successfully!');
              // Fetch updated transaction data after payment addition
              await fetchtransactiondata();

              // Calculate total paid amount from transactions
              const totalPaidAmount = transactions.reduce((total, payment) => total + payment.paidamount, 0);

              // Update amount due by subtracting totalPaidAmount from total invoice amount
              const updatedAmountDue = invoiceData.total - totalPaidAmount;
              setInvoiceData({ ...invoiceData, amountdue: updatedAmountDue });
              
              // Close the modal after adding payment
              document.getElementById('closebutton').click();
              if (modalRef.current) {
                modalRef.current.hide();
              }
            } else {
              console.error('Failed to add payment.');
            }
          } else {
            console.error('Failed to add payment.');
          }
        }


      } catch (error) {
        console.error('Error adding payment:', error);
      }


      // Close the modal
      setShowModal(false);
    }
  };

  const handleSave = async () => {
    const userid = localStorage.getItem("userid");
    const authToken = localStorage.getItem('authToken');

    try {
      if ((savedDepositData != null || savedDepositData != "") && savedDepositData._id != undefined) {
        // If savedDepositData exists and has an ID, update the existing record
        const response = await fetch(`https://grithomes.onrender.com/api/updatedeposit/${savedDepositData._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken,
          },
          body: JSON.stringify({
            "depositamount": amount,
            "duedepositdate": duedepositDate,
            "depositpercentage": depositpercentage,
            "method": 'Pending',
            "userid": userid,
            "invoiceid": invoiceid,
          }),
        });

        if (response.status === 401) {
          const data = await response.json();
          setAlertMessage(data.message);
          setloading(false);
          window.scrollTo(0, 0);
          return; // Stop further execution
        }
        else {
          const data = await response.json();

          if (data.Success) {
            console.log('Deposit updated successfully:', data.deposit);
            const savedDepositResponse = await fetch(`https://grithomes.onrender.com/api/deposit/${data.deposit._id}`);
            const savedDepositDatad = await savedDepositResponse.json();
            setsavedDepositData(savedDepositDatad.deposit);
            // You may update the state here if required
          } else {
            console.error('Failed to update deposit:', data.error);
          }
        }


      } else {
        // If savedDepositData is empty or does not have an ID, add a new record
        const response = await fetch('https://grithomes.onrender.com/api/deposit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken,
          },
          body: JSON.stringify({
            "depositamount": amount,
            "duedepositdate": duedepositDate,
            "depositpercentage": depositpercentage,
            "method": 'Pending',
            "userid": userid,
            "invoiceid": invoiceid,
          }),
        });

        if (response.status === 401) {
          const data = await response.json();
          setAlertMessage(data.message);
          setloading(false);
          window.scrollTo(0, 0);
          return; // Stop further execution
        }
        else {
          const data = await response.json();
          if (data.success) {
            const savedDepositResponse = await fetch(`https://grithomes.onrender.com/api/deposit/${data.deposit._id}`, {
              headers: {
                'Authorization': authToken,
              }
            });
            if (response.status === 401) {
              const savedDepositDatad = await savedDepositResponse.json();
              setAlertMessage(savedDepositDatad.message);
              setloading(false);
              window.scrollTo(0, 0);
              return; // Stop further execution
            }
            else {
              const savedDepositDatad = await savedDepositResponse.json();
              setsavedDepositData(savedDepositDatad.deposit);
              console.log('New deposit added successfully:', data.deposit);
            }
          } else {
            console.error('Failed to add new deposit:', data.error);
          }
        }
      }
    } catch (error) {
      console.error('Error saving deposit:', error);
    }
  };

  const handleSaveAndSend = async () => {
    const userid = localStorage.getItem("userid");
    const authToken = localStorage.getItem('authToken');

    try {
      if ((savedDepositData != null || savedDepositData != "") && savedDepositData._id != undefined) {
        // If savedDepositData exists and has an ID, update the existing record
        const response = await fetch(`https://grithomes.onrender.com/api/updatedeposit/${savedDepositData._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken,
          },
          body: JSON.stringify({
            "depositamount": amount,
            "duedepositdate": duedepositDate,
            "depositpercentage": depositpercentage,
            "method": 'Pending',
            "userid": userid,
            "invoiceid": invoiceid,
          }),
        });

        if (response.status === 401) {
          const data = await response.json();
          setAlertMessage(data.message);
          setloading(false);
          window.scrollTo(0, 0);
          return; // Stop further execution
        }
        else {
          const data = await response.json();

          if (data.Success) {
            console.log('Deposit updated successfully:', data.deposit);
            const savedDepositResponse = await fetch(`https://grithomes.onrender.com/api/deposit/${data.deposit._id}`, {
              headers: {
                'Authorization': authToken,
              }
            });
            if (response.status === 401) {
              const savedDepositDatad = await savedDepositResponse.json();
              setAlertMessage(savedDepositDatad.message);
              setloading(false);
              window.scrollTo(0, 0);
              return; // Stop further execution
            }
            else {
              const savedDepositDatad = await savedDepositResponse.json();
              setsavedDepositData(savedDepositDatad.deposit);
              setShowSendEmailModal(true);
            }
          } else {
            console.error('Failed to update deposit:', data.error);
          }
        }
      } else {
        // If savedDepositData is empty or does not have an ID, add a new record
        const response = await fetch('https://grithomes.onrender.com/api/deposit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken,
          },
          body: JSON.stringify({
            "depositamount": amount,
            "duedepositdate": duedepositDate,
            "depositpercentage": depositpercentage,
            "method": 'Pending',
            "userid": userid,
            "invoiceid": invoiceid,
          }),
        });
        if (response.status === 401) {
          const data = await response.json();
          setAlertMessage(data.message);
          setloading(false);
          window.scrollTo(0, 0);
          return; // Stop further execution
        }
        else {
          const data = await response.json();
          if (data.success) {
            const savedDepositResponse = await fetch(`https://grithomes.onrender.com/api/deposit/${data.deposit._id}`, {
              headers: {
                'Authorization': authToken,
              }
            });
            if (response.status === 401) {
              const savedDepositDatad = await savedDepositResponse.json();
              setAlertMessage(savedDepositDatad.message);
              setloading(false);
              window.scrollTo(0, 0);
              return; // Stop further execution
            }
            else {
              const savedDepositDatad = await savedDepositResponse.json();
              setsavedDepositData(savedDepositDatad.deposit);
              console.log('New deposit added successfully:', data.deposit);
              setShowSendEmailModal(true);
            }
          } else {
            console.error('Failed to add new deposit:', data.error);
          }
        }


      }
    } catch (error) {
      console.error('Error saving deposit:', error);
    }
  };

  const handleEditModal = () => {

    const getEditData = savedDepositData;
    console.log(getEditData, "getEditData");
    setShowModal(true);
    setdepositPercentage(getEditData.depositpercentage)
    setAmount(getEditData.depositamount)
    setDueDepositDate(getEditData.duedepositdate)
  };


  const fetchinvoicedata = async () => {
    try {
      const userid = localStorage.getItem("userid");
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://grithomes.onrender.com/api/getinvoicedata/${invoiceid}`, {
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
        console.log("json:- >>>>", json);
        setInvoiceData(json);
        if (Array.isArray(json.items)) {
          setitems(json.items);
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const fetchdepositdata = async () => {
    try {
      const userid = localStorage.getItem("userid");
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://grithomes.onrender.com/api/getdepositdata/${userid}/${invoiceid}`, {
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
        setsavedDepositData(json);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const fetchtransactiondata = async () => {
    try {
      const userid = localStorage.getItem("userid");
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://grithomes.onrender.com/api/gettransactiondata/${invoiceid}`, {
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
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const fetchsignupdata = async () => {
    try {
      const userid = localStorage.getItem("userid");
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://grithomes.onrender.com/api/getsignupdata/${userid}`, {
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
        console.log(signupdata);
        // }
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const onchange = (event) => {
    setTransactionData({
      ...transactionData,
      [event.target.name]: event.target.value,
    });
  };

  const formatCustomDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const handleAddPayment = async () => {
    // const invoiceid = 'your-invoice-id'; 
    const userid = localStorage.getItem("userid");
    const authToken = localStorage.getItem('authToken');
    // Check for errors
    if (transactionData.paidamount === '') {
      setpaidamounterror("Fill detail");
      return; // Exit the function early if there's an error
    } else {
      setpaidamounterror(""); // Clear the error if the field is filled
    }

    if (transactionData.paiddate === '') {
      setpaiddateerror("Fill detail");
      return;
    } else {
      setpaiddateerror("");
    }

    if (transactionData.method === '') {
      setmethoderror("Fill detail");
      return;
    } else {
      setmethoderror("");
    }
    // Fetch updated transaction data after payment addition
    await fetchtransactiondata();

    // Calculate total paid amount from transactions
    // const totalPaidAmount = transactions.reduce((total, payment) => total + payment.paidamount, 0);
    const totalPaidAmount = transactions.reduce(
      (total, payment) => total + parseFloat(payment.paidamount),
      0
    );
    // Check if the paid amount exceeds the due amount
    const dueAmount = invoiceData.total - totalPaidAmount;
    const paymentAmount = parseFloat(transactionData.paidamount);

    if (paymentAmount > dueAmount) {
      console.error('Payment amount exceeds the due amount.');
      setexceedpaymenterror("Payment amount exceeds the amount.");
      return;
    } else {
      setexceedpaymenterror("");
    }
    try {
      const response = await fetch('https://grithomes.onrender.com/api/addpayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken,
        },
        body: JSON.stringify({
          paidamount: transactionData.paidamount,
          paiddate: transactionData.paiddate,
          method: transactionData.method,
          note: transactionData.note,
          userid: userid,
          invoiceid: invoiceid,
        }),
      });

      if (response.status === 401) {
        const responseData = await response.json();
        setAlertMessage(responseData.message);
        setloading(false);
        window.scrollTo(0, 0);
        return; // Stop further execution
      }
      else {
        if (response.ok) {
          const responseData = await response.json();
          if (responseData.success) {
            console.log(responseData, 'Payment added successfully!');
            console.log(roundOff(invoiceData.total - transactions.reduce((total, payment) => total + payment.paidamount, 0) - responseData.transaction.paidamount), 'invoiceData');
            // Fetch updated transaction data after payment addition

            const setamountDue = roundOff(invoiceData.total - transactions.reduce((total, payment) => total + payment.paidamount, 0) - responseData.transaction.paidamount)
            console.log("setamountDue: ==============", setamountDue);


            const updatedData = { 

              ...invoiceData,  
              amountdue: setamountDue, 
              status: `${
                setamountDue == 0
                ?
                "Paid"
                :
                "Partially Paid"
              }`
            
            
            }; // Update emailsent status
        await fetch(`https://grithomes.onrender.com/api/updateinvoicedata/${invoiceid}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken,
          },
          body: JSON.stringify(updatedData),
        });

        
            await fetchtransactiondata();

            // Calculate total paid amount from transactions
            const totalPaidAmount = transactions.reduce((total, payment) => total + payment.paidamount, 0);

            // Update amount due by subtracting totalPaidAmount from total invoice amount
            const updatedAmountDue = invoiceData.total - totalPaidAmount;
            setInvoiceData({ ...invoiceData, amountdue: updatedAmountDue });
            // Close the modal after adding payment
            document.getElementById('closebutton').click();
            if (modalRef.current) {
              modalRef.current.hide();
            }
          } else {
            console.error('Failed to add payment.');
          }
        } else {
          console.error('Failed to add payment.');
        }
      }


    } catch (error) {
      console.error('Error adding payment:', error);
    }
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

  const handleEditContent = (invoiceData) => {
    const totalPaidAmount = transactions.reduce((total, payment) => total + payment.paidamount, 0);

    if (totalPaidAmount === 0) {
      // If totalPaidAmount is 0, navigate to /userpanel/Createinvoice page
      setselectedinvoices(invoiceData);
      let invoiceid = invoiceData._id;
      console.log(invoiceid);
      navigate('/userpanel/Editinvoice', { state: { invoiceid } });
    } else {
      // If totalPaidAmount is not 0, show an alert
      setShowAlert(true);
    }
  };

  const handleDeleteTransClick = async (transactionid) => {
    try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`https://grithomes.onrender.com/api/deltransaction/${transactionid}`, {
            method: 'GET',
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
            if (json.Success) {
              console.log('Transaction removed successfully!');
              fetchtransactiondata();
            } else {
                console.error('Error deleting teammember:', json.message);
            }
        }
    } catch (error) {
        console.error('Error deleting teammember:', error);
    }
};

  const handleRemove = async (invoiceid) => {
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await fetch(`https://grithomes.onrender.com/api/deldata/${invoiceid}`, {
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
      }
      else {
        const json = await response.json();
        if (json.success) {
          console.log('Data removed successfully!');
          navigate('/userpanel/Invoice');
        } else {
          console.error('Error deleting Invoice:', json.message);
        }
      }
    } catch (error) {
      console.error('Error deleting Invoice:', error);
    }
  };


  const getStatus = () => {
    if (transactions.length === 0) {
      return "Saved";
    }

    const totalPaidAmount = transactions.reduce(
      (total, payment) => total + parseFloat(payment.paidamount),
      0
    );

    if (totalPaidAmount === 0) {
      return "Saved";
    } else if (totalPaidAmount > 0 && totalPaidAmount < invoiceData.total) {
      return "Partially Paid";
    } else if (totalPaidAmount === invoiceData.total) {
      return "Paid";
    } else {
      return "Payment Pending";
    }
  };

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
    const authToken = localStorage.getItem('authToken');
    const contentAsPdf = await generatePdfFromHtml();
    try {
      const finalContent = content.trim() || ``; // If content is empty, use default value
      const response = await fetch('https://grithomes.onrender.com/api/send-invoice-email', {
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
          customdate: formatCustomDate(invoiceData.date),
          duedate: formatCustomDate(invoiceData.duedate),
          InvoiceNumber: invoiceData.InvoiceNumber,
          amountdue: invoiceData.amountdue,
          currencyType: signupdata.CurrencyType,
          amountdue1: invoiceData.total - transactions.reduce((total, payment) => total + payment.paidamount, 0),
          pdfAttachment: contentAsPdf,
        }),
      });

      if (response.ok) {
        console.log(invoiceData, 'Email sent successfully!');
        // setShowModal(false);
        setShowEmailAlert(true);

        if(invoiceData.status == 'Paid' || invoiceData.status == 'Partially Paid')
        {
          const updatedData = {invoiceData }
          await fetch(`https://grithomes.onrender.com/api/updateinvoicedata/${invoiceid}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authToken,
            },
            body: JSON.stringify(updatedData),
          });
        }else {
          const updatedData = { ...invoiceData,status:"Send", emailsent: 'yes' }
          await fetch(`https://grithomes.onrender.com/api/updateinvoicedata/${invoiceid}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authToken,
            },
            body: JSON.stringify(updatedData),
          });
        }
        if (response.status === 401) {
          const json = await response.json();
          setAlertMessage(json.message);
          setloading(false);
          window.scrollTo(0, 0);
          return; // Stop further execution
        }
        else {
          fetchinvoicedata();
        }

        // Fetch updated invoice data

      } else {
        console.error('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleDepositFormSubmit = async (event) => {
    event.preventDefault();
    const authToken = localStorage.getItem('authToken');
    const contentAsPdf = await generatePdfFromHtml();
    try {
      const finalContent = content.trim() || ``; // If content is empty, use default value
      const response = await fetch('https://grithomes.onrender.com/api/send-deposit-email', {
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
          customdate: formatCustomDate(invoiceData.date),
          duedate: formatCustomDate(savedDepositData.duedepositDate),
          depositamount: savedDepositData.depositamount,
          InvoiceNumber: invoiceData.InvoiceNumber,
          currencyType: signupdata.CurrencyType,
          pdfAttachment: contentAsPdf,
        }),
      });

      if (response.ok) {
        console.log('Email sent successfully!');
        // setShowModal(false);
        setShowSendEmailModal(false)
        setShowEmailAlert(true);
        // Update the database with emailsent status
        if(invoiceData.status == 'Paid' || invoiceData.status == 'Partially Paid')
        {
          const updatedData = {invoiceData }
          await fetch(`https://grithomes.onrender.com/api/updateinvoicedata/${invoiceid}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authToken,
            },
            body: JSON.stringify(updatedData),
          });
        }else {
          const updatedData = { ...invoiceData,status:"Send", emailsent: 'yes' }
          await fetch(`https://grithomes.onrender.com/api/updateinvoicedata/${invoiceid}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': authToken,
            },
            body: JSON.stringify(updatedData),
          });
        }
        // const updatedData = { ...invoiceData, emailsent: 'yes' }; // Update emailsent status
        // await fetch(`https://grithomes.onrender.com/api/updateinvoicedata/${invoiceid}`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': authToken,
        //   },
        //   body: JSON.stringify(updatedData),
        // });
        if (response.status === 401) {
          const json = await response.json();
          setAlertMessage(json.message);
          setloading(false);
          window.scrollTo(0, 0);
          return; // Stop further execution
        }
        else {
          // Fetch updated invoice data
          fetchinvoicedata();
        }
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
        filename: 'myfile.pdf',
        margin: 0.2, // [top, bottom] margin in millimeters
        html2canvas: { scale: 1, useCORS: true }, // Increase scale for better resolution
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

  // const convertToPdf = () => {

  //   // await timeout(5000);
  //   const content = document.getElementById('invoiceContent').innerHTML;
  //   // console.log(content);
  //   const opt = {
  //     filename: 'invoice.pdf',
  //     html2canvas: { scale: 1, useCORS: true }, // Increase scale for better resolution
  //     image: { type: 'jpeg', quality: 0.98 },
  //     jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
  //     margin: { top: 20, bottom: 30 }, // Adjust top and bottom margin
  //     userUnit: 450 / 210
  //   };
  //   html2pdf().from(content).set(opt).save(); // Convert to PDF and save automatically
  // };
  const convertToPdf = () => {
    const content = document.getElementById('invoiceContent').innerHTML;
    const opt = {
      filename: 'invoice.pdf',
      html2canvas: { scale: 1, useCORS: true },
      enableLinks: true,
      image: { type: 'jpeg', quality: 0.98 },
      margin: 0.2,
      jsPDF: {
        unit: 'in',
        format: 'A4',
        orientation: 'portrait'
      },
      userUnit: 450 / 210
    };
    html2pdf().from(content).set(opt).save();
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
                        <p className='fs-35 fw-bold'>Invoice</p>
                        <nav aria-label="breadcrumb">
                          <ol class="breadcrumb mb-0">
                            <li class="breadcrumb-item"><a href="/Userpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                            <li class="breadcrumb-item active" aria-current="page">Invoicedetail</li>
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
                            <li><a className="dropdown-item" onClick={convertToPdf}>Pdf</a></li>
                            <li><a className="dropdown-item" onClick={() => handleEditContent(invoiceData)}>Edit</a></li>
                            <li><a className="dropdown-item" onClick={() => handleRemove(invoiceData._id)}>Remove</a></li>
                          </ul>
                        </div>

                      </div>
                      <div className="col-lg-1">
                        <a className='btn rounded-pill btn-danger text-white fw-bold' data-bs-toggle="modal" data-bs-target="#sendEmailModal">Send</a>
                      </div>
                    </div>
                    <div className='my-2'>
                      {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
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
                                  <img src={signupdata.companyImageUrl} className='w-50 logoimage' alt="testing imahe" /> :
                                  <p className='h4 fw-bold'>{signupdata.companyname}</p>
                                }
                              </div>
                              <div className='col-sm-12 col-md-6 text-md-end'>
                                <h1>Invoice</h1>
                                <div className='text-inverse mb-1'>
                                  <strong>{signupdata.companyname}</strong>
                                </div>
                                <address className='m-t-5 m-b-5'>
                                  <div className='mb-2'>
                                    <div className=''>{signupdata.address} </div>
                                      {signupdata.city ? JSON.parse(signupdata.city).name+',' : ' '}
                                      {signupdata.state ? JSON.parse(signupdata.state).name : ' '}
                                     {/* <div className=''>{JSON.parse(signupdata.city).name}, {JSON.parse(signupdata.state).name}</div>
                                    <div className=''>{JSON.parse(signupdata.country).emoji}</div> */}
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
                                  }
                                    
                                    
                                    </div>

                                </address>
                              </div>

                            </div>
                            <div class="clr"></div>
                          </div>
                          {console.log("invoiceData:-", invoiceData)}

                          <div className='invoice-header'>
                            <div className='row'>
                              <div className='invoice-to col-sm-12 col-md-6'>
                                <strong>Bill To</strong>
                                <div className='text-inverse mb-1'>
                                  {invoiceData.customername}
                                </div>
                                <address className='m-t-5 m-b-5'>
                                  <div>{invoiceData.customeremail}</div>
                                  <div>{invoiceData.customerphone || ''}</div>

                                </address>
                              </div>
                              <div className='invoice-date col-sm-12 col-md-6'>
                                <div className='row text-md-end'>
                                  <div className='col-6 col-md'>
                                    <strong>Invoice #</strong>
                                  </div>
                                  <div className='col-6 col-md invoice-detail-right'>{invoiceData.InvoiceNumber}</div>
                                </div>
                                <div className='row text-md-end'>
                                  <div className='col-6 col-md'>
                                    <strong>Date</strong>
                                  </div>
                                  <div className='col-6 col-md invoice-detail-right'>{formatCustomDate(invoiceData.date)}</div>
                                </div>
                                <div className='row text-md-end'>
                                  <div className='col-6 col-md'>
                                    <strong>Due date</strong>
                                  </div>
                                  <div className='col-6 col-md invoice-detail-right'>{formatCustomDate(invoiceData.duedate)}</div>
                                </div>
                                {/* <div className='row text-md-end'>
                                  <div className='col-6 col-md'>
                                    <strong>PO #</strong>
                                  </div>
                                  <div className='col-6 col-md invoice-detail-right'>{formatCustomDate(invoiceData.duedate)}</div>
                                </div> */}
                                

                                  {
                                    invoiceData.job == "" ||  invoiceData.job == null
                                    ?
                                    ""
                                    :
                                    <div className='row text-md-end'>
                                    <div className='col-6 col-md'>
                                    <strong>Job</strong>
                                  </div>
                                  <div className='col-6 col-md invoice-detail-right'>{invoiceData.job}</div>
                                  </div>
                                  }
                                 
                               

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
                                      <td className="text-end d-none d-md-table-cell">{roundOff(item.price)}</td>
                                      <td className='text-end'>{roundOff(item.amount)}</td>
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
                                      <td className='d-none d-md-table-cell' rowspan="10"></td>
                                      <td className='text-md-end' width="22%">Subtotal</td>
                                      <td className='text-end' width="22%"><CurrencySign />{roundOff(invoiceData.subtotal)}</td>
                                    </tr>
                                    {
                                      invoiceData.discountTotal > 0 
                                      ?
                                        <tr>
                                          <td className='text-md-end' width="22%">Discount</td>
                                          <td className='text-end' width="22%"><CurrencySign />{roundOff(invoiceData.discountTotal)}</td>
                                        </tr>
                                      :
                                        null
                                    }
                                    

                                     
                                      {
                                      signupdata.taxPercentage == 0 
                                      ?
                                      <tr></tr>
                                      :
                                      <tr>
                                      <td className='text-md-end' width="22%">
                                      {signupdata.TaxName} ({signupdata.taxPercentage}%)
                                      
                                      </td>
                                      <td className='text-end' width="22%"><CurrencySign />{roundOff(invoiceData.tax)}</td>
                                      </tr>
                                      }
                                        
                                        
                                       
                                      
                                   
                                    <tr>

                                      <td className='text-md-end' width="22%" style={{ borderBottom: '1px solid #ddd' }}>Total</td>
                                      <td className='text-end' width="22%" style={{ borderBottom: '1px solid #ddd' }}><CurrencySign />{roundOff(invoiceData.total)}</td>
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
                              <span class="f-w-600 mt-3"><CurrencySign />{roundOff(invoiceData.total - transactions.reduce((total, payment) => total + payment.paidamount, 0))}</span>

                            </div>

                          </div>

                          <div className='invoice-body'>
                            <div className='mt-1'>
                              <span>{invoiceData.information == '' ? '' : 'Note:'}</span> <div dangerouslySetInnerHTML={{ __html: invoiceData.information }} />

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
                        <div className='box1 rounded adminborder px-4 py-5'>
                          <div className="row">
                            <div className="col-6">
                              <p>Total</p>
                              <p>Paid</p>
                            </div>
                            <div className="col-6 text-end">
                              <p><CurrencySign />{roundOff(invoiceData.total)}</p>
                              {console.log(transactions)}


                              <p><CurrencySign />{roundOff(transactions.reduce((total, payment) => total + payment.paidamount, 0))}</p>

                            </div>

                            {/* <!-- Button trigger modal --> */}
                            {!transactions.find(transaction => {
                              return transaction.method === "deposit";
                            }) ? savedDepositData == "" || parseFloat(savedDepositData.depositamount) === 0 ? (
                              <a className='greenclr pointer mb-3' data-bs-toggle="modal" data-bs-target="#exampleModaldeposit">
                                Request a deposit
                              </a>
                            ) : (
                              <p>
                                Request a deposit (<CurrencySign />{savedDepositData.depositamount})
                                <a className='greenclr pointer mb-3 text-decoration-none ms-2' data-bs-toggle="modal" data-bs-target="#exampleModaldeposit" onClick={handleEditModal}>Edit</a><br />
                                <a className='text-danger pointer mb-3 text-decoration-none' onClick={handleMarkDeposit}>Mark Deposit</a>
                              </p>
                            ) : null}
                            {/* <a className='greenclr pointer mb-3' data-bs-toggle="modal" data-bs-target="#exampleModaldeposit">
                                                  Request a deposit
                                              </a> */}
                            <a className='greenclr pointer mb-3' data-bs-toggle="modal" data-bs-target="#exampleModal1">
                              View Transactions
                            </a>
                            <a className='greenclr pointer' data-bs-toggle="modal" data-bs-target="#exampleModal">
                              Mark paid
                            </a>

                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
      }

      {/* payment modal  */}
      <form action="">
        <div class="modal fade" id="exampleModal" tabindex="-1" ref={modalRef} aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Mark paid</h1>
                <button type="button" class="btn-close" id="closebutton" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label for="amount" class="form-label">Amount<span class="text-danger">*</span></label>
                  <input type="number" class="form-control" name='paidamount' onChange={onchange} id="exampleFormControlInput1" placeholder="Amount" required />
                  {paidamounterror && <p className="text-danger">{paidamounterror}</p>}
                  {exceedpaymenterror && <p className="text-danger">{exceedpaymenterror}</p>}
                </div>
                <div class="mb-3">
                  <label for="date" class="form-label">Date<span class="text-danger">*</span></label>
                  <input type="date" class="form-control" name='paiddate' onChange={onchange} id="exampleFormControlInput2" placeholder="Date" required />
                  {paiddateerror && <p className="text-danger">{paiddateerror}</p>}
                </div>
                <div class="mb-3">
                  <label for="date" class="form-label">Method<span class="text-danger">*</span></label>
                  <select class="form-select" name='method' onChange={onchange} aria-label="Default select example" required>
                    <option selected disabled hidden>Method</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit">Credit</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Transfer">Transfer</option>
                  </select>
                  {methoderror && <p className="text-danger">{methoderror}</p>}
                </div>
                <div class="mb-3">
                  <label for="note" class="form-label">Note</label>
                  <input type="text" class="form-control" name='note' onChange={onchange} id="exampleFormControlInput4" placeholder="Note" />
                </div>
              </div>
              <div class="modal-footer">
                <a data-bs-dismiss="modal" className='pointer text-decoration-none text-dark'>Close</a>
                <a className='greenclr ms-2 text-decoration-none pointer' onClick={handleAddPayment}>Add Payment</a>
              </div>
            </div>
          </div>
        </div>
      </form>


      {/* transaction modal  */}

      <div class="modal fade" id="exampleModal1" tabindex="-1" ref={modalRef} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">View Transactions</h1>
              <button type="button" class="btn-close" id="closebutton" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div className="row px-2 text-center">
                <div className="col-3">
                  <p>DATE</p>
                </div>
                <div className="col-3">
                  <p>NOTE</p>
                </div>
                <div className="col-3">
                  <p>AMOUNT</p>
                </div>
                <div className="col-3">
                  <p>DELETE</p>
                </div>
              </div><hr />
              {transactions.map((transaction) => (
                <>
                  <div className='row px-2  text-center' key={transaction._id}>
                    <div className="col-3">
                      <p className='mb-0'> {formatCustomDate(transaction.paiddate)}</p>
                    </div>
                    <div className="col-3">
                      <p className='mb-0'>{transaction.note}</p>
                    </div>
                    <div className="col-3">
                      <p className='mb-0'><CurrencySign />{transaction.paidamount}</p>
                    </div>
                    <div className="col-3">
                      <button data-bs-dismiss="modal" type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteTransClick(transaction._id)}>
                          <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div><hr />
                </>
              ))}
            </div>
            <div class="modal-footer">
              <a data-bs-dismiss="modal" className='pointer text-decoration-none text-dark'>Close</a>
            </div>
          </div>
        </div>

      </div>

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
                  <textarea class="form-control" id="content" name="content" rows="5" value={content} onChange={handleContentChange}></textarea>
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

      {/* deposit modal  */}
      <form action="">
        <div class="modal fade" id="exampleModaldeposit" tabindex="-1" ref={modalRef} aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header p-4">
                <h1 class="modal-title fs-3 fw-bold" id="exampleModalLabel">Request a deposit</h1>
                <button type="button" class="btn-close" id="closebutton" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body p-4">
                <input type="hidden" id="deposit_uniqueid" value="uniqueid_here" />

                <div class="mb-3 row">
                  <div className="col-6 fw-bold fs-5">
                    <p>Total amount</p>
                  </div>
                  <div className="col-6 text-end fw-bold fs-5">
                    <p>
                      <CurrencySign />
                      {roundOff(
                        invoiceData.total -
                        transactions.reduce((total, payment) => total + payment.paidamount, 0) -
                        amount
                      )}
                    </p>
                  </div>
                </div>
                <div class="mb-3 row">
                  <div className="col-5">
                    <label for="number" class="form-label">Percentage</label>
                    <div className='input-group mb-4'>
                      <input type="number" className="form-control" id="depositpercentage" value={depositpercentage} onChange={handlePercentageChange} min="0" />
                      <span class="input-group-text">%</span>
                    </div>
                  </div>
                  <div className="col-2 fw-bold fs-5">
                    <p className='pt-3 fs-2 ps-5'>=</p>
                  </div>
                  <div className="col-5">
                    <label for="text" class="form-label">Amount</label>
                    <div className='input-group mb-4'>
                      <input type="text" className="form-control" id="amount" value={amount} readOnly />
                      <span class="input-group-text"><CurrencySign /></span>
                    </div>
                  </div>
                  <div className="col-5">
                    <label for="date" class="form-label" id='duedepositdate'>Due Date</label>
                    <input type="date" class="form-control" value={duedepositDate} onChange={handleDateChange} />
                  </div>
                </div>
              </div>
              <div class="modal-footer p-4">
                <a data-bs-dismiss="modal" className='pointer text-decoration-none text-dark'>Close</a>
                <a className='greenclr ms-2 text-decoration-none pointer' data-bs-dismiss="modal" onClick={handleSave}>Save</a>
                {(depositpercentage === '' || parseInt(depositpercentage) < 1) ? (
                  <button className='py-2 px-3 text-decoration-none bg-tertiary text-dark fw-bold rounded' disabled>Save & Send</button>
                ) : (
                  <a href="" className='py-2 px-3 text-decoration-none pointer bg-success text-white fw-bold rounded' data-bs-dismiss="modal" id='' onClick={handleSaveAndSend}>Save & Send</a>
                )}
                {/* <a href="" className='py-2 px-3 text-decoration-none pointer bg-success text-white fw-bold rounded'>Save & Send</a> */}
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Email modal-2 */}
      {showSendEmailModal ?
        <div class="modal fade show" id="sendEmailModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-modal="true" role="dialog" style={{ display: "block" }}>
          {/* <div class="modal fade" id="sendEmailModal2" tabindex="-1" ref={modalRef} aria-labelledby="exampleModalLabel" aria-hidden="true"> */}
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-4 fw-bold" id="exampleModalLabel">Send document</h1>
                <button type="button" class="btn-close" onClick={() => setShowSendEmailModal(false)}></button>
              </div>
              <div class="modal-body">
                <form onSubmit={handleDepositFormSubmit}>
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
                    <textarea class="form-control" id="content" name="content" rows="5" value={content} onChange={handleContentChange}></textarea>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowSendEmailModal(false)}>Close</button>
                    <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Send</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div> : null
      }
    </div>
  )
}
