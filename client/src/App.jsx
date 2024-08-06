import './App.css';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import Userdashboard from './screens/userpanel/Userdashboard';
import Team from './screens/userpanel/Team';
import Addteam from './screens/userpanel/Addteam';
import Timeview from './screens/userpanel/Timeview';
import Timeschemahistory from './screens/Timeschemahistory';
import Teammenberdashboard from './screens/Teammemberpanel/Teammenberdashboard';
import Customerlist from './screens/userpanel/Customerlist';
import Addcustomer from './screens/userpanel/Addcustomer';
import Editcustomer from './screens/userpanel/Editcustomer';
import Itemlist from './screens/userpanel/Itemlist';
import Additem from './screens/userpanel/Additem';
import Edititem from './screens/userpanel/Edititem';
import Editteam from './screens/userpanel/Editteam';
import Createinvoice from './screens/userpanel/Createinvoice';
import Invoicedetail from './screens/userpanel/Invoicedetail';
import Editinvoice from './screens/userpanel/Editinvoice';
import Invoice from './screens/userpanel/Invoice';
import Createestimate from './screens/userpanel/Createestimate';
import Estimatedetail from './screens/userpanel/Estimatedetail';
import Editestimate from './screens/userpanel/Editestimate';
import Estimate from './screens/userpanel/Estimate';
import Teamhistory from './screens/Teammemberpanel/Teamhistory';
import Imageupload from './screens/userpanel/Imageupload';
import Editprofile from './screens/userpanel/Editprofile';
import Overdue from './screens/userpanel/Overdue';
import Reports from './screens/userpanel/Reports';
import Customerwiseinvoice from './screens/userpanel/Customerwiseinvoice'
import Esign from './screens/userpanel/Esign';
import Customersign from './screens/userpanel/Customersign';
import Signature from './screens/userpanel/Signature';
import Completedocument from './screens/userpanel/Completedocument';
// import { InvoiceProvider } from './components/InvoiceContext';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    // <InvoiceProvider>
      <Router>
        <div>
          <Routes>
            <Route exact path='/' element={<Login/>} />
            <Route exact path='/signup' element={<SignUp/>} />
            <Route exact path='/ForgotPassword' element={<ForgotPassword/>} />
            <Route exact path='/reset-password/:token' element={<ResetPassword/>} />
            <Route exact path='/userpanel/Userdashboard' element={<Userdashboard/>} />
            <Route exact path='/userpanel/Team' element={<Team/>} />
            <Route exact path='/userpanel/Addteam' element={<Addteam/>} />
            <Route exact path='/userpanel/Editteam' element={<Editteam/>} />
            <Route exact path='/userpanel/Timeview' element={<Timeview/>} />
            <Route exact path='/userpanel/Customerlist' element={<Customerlist/>} />
            <Route exact path='/userpanel/Addcustomer' element={<Addcustomer/>} />
            <Route exact path='/userpanel/Editcustomer' element={<Editcustomer/>} />
            <Route exact path='/userpanel/Itemlist' element={<Itemlist/>} />
            <Route exact path='/userpanel/Additem' element={<Additem/>} />
            <Route exact path='/userpanel/Edititem' element={<Edititem/>} />
            <Route exact path='/userpanel/Createinvoice' element={<Createinvoice/>} />
            <Route exact path='/userpanel/Invoicedetail' element={<Invoicedetail/>} />
            <Route exact path='/userpanel/Invoice' element={<Invoice/>} />
            <Route exact path='/userpanel/Editinvoice' element={<Editinvoice/>} />
            <Route exact path='/userpanel/Createestimate' element={<Createestimate/>} />
            <Route exact path='/userpanel/Estimatedetail' element={<Estimatedetail/>} />
            <Route exact path='/userpanel/Editestimate' element={<Editestimate/>} />
            <Route exact path='/userpanel/Estimate' element={<Estimate/>} />
            <Route exact path='/userpanel/Imageupload' element={<Imageupload/>} />
            <Route exact path='/userpanel/Editprofile' element={<Editprofile/>} />
            <Route exact path='/userpanel/Overdue' element={<Overdue/>} />
            <Route exact path='/userpanel/Reports' element={<Reports/>} />
            <Route exact path='/userpanel/Customerwiseinvoice' element={<Customerwiseinvoice/>} />
            <Route exact path='/customersign' element={<Customersign/>} />
            <Route exact path='/completedocument' element={<Completedocument/>} />
            <Route exact path='/userpanel/E-sign' element={<Esign/>} />
            <Route exact path='/userpanel/Signature' element={<Signature/>} />
            <Route exact path='/Timeschemahistory' element={<Timeschemahistory/>} />
            <Route exact path='/Teammemberpanel/Teammenberdashboard' element={<Teammenberdashboard/>} />
            <Route exact path='/Teammemberpanel/History' element={<Teamhistory/>} />
          </Routes>
        </div>
      </Router>
    // {/* </InvoiceProvider> */}
  );
}

export default App;
