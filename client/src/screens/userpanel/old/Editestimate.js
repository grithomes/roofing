import React,{useState,useEffect} from 'react'
import { format } from 'date-fns';
import {useNavigate,useLocation} from 'react-router-dom'
import { ColorRing } from  'react-loader-spinner'
import Usernav from './Usernav';
import Usernavbar from './Usernavbar';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import VirtualizedSelect from 'react-virtualized-select';
import 'react-virtualized-select/styles.css';
import 'react-virtualized/styles.css'
import CurrencySign from '../../components/CurrencySign ';
import Alertauthtoken from '../../components/Alertauthtoken';

export default function Editestimate() {
    
    const [ loading, setloading ] = useState(true);
    const [customers, setcustomers] = useState([]);
    const [selectedCustomerDetails, setSelectedCustomerDetails] = useState({
        name: '', email: ''});
    const [searchcustomerResults, setSearchcustomerResults] = useState([]);
    const [isCustomerSelected, setIsCustomerSelected] = useState(false);
    const [items, setitems] = useState([]);
    const [searchitemResults, setSearchitemResults] = useState([]);
    const [quantityMap, setQuantityMap] = useState({});
    const [discountMap, setDiscountMap] = useState({});
    const [discountTotal, setdiscountTotal] = useState(0);
    const [taxPercentage, setTaxPercentage] = useState(0);
    const [estimateData, setestimateData] = useState({
        _id: '', customername: '',itemname: '',customeremail: '',EstimateNumber: '',purchaseorder: '',
        date: new Date(),description: '',itemquantity: '', price: '',discount: '',
        amount: '',tax: '',taxpercentage:'',subtotal: '',total: '',amountdue: '',information: '', items:[]
    });
    const location = useLocation();
    const estimateid = location.state?.estimateid;
    const [editorData, setEditorData] = useState("<p></p>");
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        if(!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true")
        {
          navigate("/");
        }
        if (estimateid) {
            fetchdata();
            fetchcustomerdata();
            fetchitemdata();
        }
        if (isNaN(discountTotal)) {
            setdiscountTotal(0);
        }
    }, [estimateid])
    let navigate = useNavigate();

    const fetchdata = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://roofing-31jz.onrender.comapi/geteditestimateData/${estimateid}`, {
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
                    setestimateData(json.estimates);
                    setdiscountTotal(json.estimates.discountTotal);
                } else {
                    console.error('Error fetching estimateData:', json.message);
                }
                console.log(estimateData);  
            }
            
        } catch (error) {
            console.error('Error fetching estimateData:', error);
        }
    };

    const fetchcustomerdata = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://roofing-31jz.onrender.comapi/customers/${userid}`, {
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
                    setcustomers(json);
                }
              }
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const onChangecustomer = (event) => {
        const selectedCustomerId = event.value;
        const selectedCustomer = customers.find((customer) => customer._id === selectedCustomerId);

        if (selectedCustomer) {
            setestimateData({
                ...estimateData,
                customername: selectedCustomer.name,
                customeremail: selectedCustomer.email,
            });
    
            setSelectedCustomerDetails({
                name: selectedCustomer.name,
                email: selectedCustomer.email
            });
            setIsCustomerSelected(true); 
        }

        setSearchcustomerResults([...searchcustomerResults, event]);
    };

    const fetchitemdata = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://roofing-31jz.onrender.comapi/itemdata/${userid}`, {
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
            console.log("Josn:", json);
                if (Array.isArray(json)) {
                    setitems(json);
                }
                setloading(false);
              }
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleSaveClick = async () => {
        try {
            const updatedestimateData = {
                ...estimateData,
                subtotal: calculateSubtotal(), // Update subtotal
                total: calculateTotal(), // Update total
                amountdue: calculateTotal(), // Update amountdue
                items: estimateData.items, // Include estimateData.items
                // searchitemResults: searchitemResults 
                tax: calculateTaxAmount(), 
                discountTotal: discountTotal,
            };
            const authToken = localStorage.getItem('authToken');
    
            const response = await fetch(`https://roofing-31jz.onrender.comapi/updateestimateData/${estimateid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken,
                },
                body: JSON.stringify(updatedestimateData)
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
                    navigate('/userpanel/Estimatedetail', { state: { estimateid } });
                    console.log(updatedestimateData);
                } else {
                    console.error('Error updating  estimate data:', json.message);
                }   
            }
    
            
        } catch (error) {
            console.error('Error updating  estimate data:', error);
        }
    };

    const addSelectedItemToEstimate = (selectedItem) => {
        const { value, label } = selectedItem;
        // Check if the item is already present in estimateData.items
        const itemExists = estimateData.items.some((item) => item.itemId === value);
    
        if (!itemExists) {
            const selectedPrice = items.find((i) => i._id === value)?.price || 0;
            const selectedDescription = items.find((i) => i._id === value)?.description || "";
            const newItem = {
                itemId: value,
                itemname: label,
                price: selectedPrice,
                itemquantity: 1, // Set default quantity or whatever value you prefer
                discount: 0, // Set default discount or whatever value you prefer
                amount: selectedPrice, // Initially set amount same as price
                description: selectedDescription, // Set the description if needed
            };
            // Add the selected item to estimateData.items
            setestimateData({
                ...estimateData,
                items: [...estimateData.items, newItem],
            });
        } else {
            console.log('Item already added to the estimate');
        }
    };

    const onChangeitem = (selectedItem) => {
        addSelectedItemToEstimate(selectedItem);
    };

    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setestimateData({ ...estimateData, information: data });
    };
    const handledescChange = (event, editor) => {
        const data = editor.getData();
        setestimateData({ ...estimateData, description: data });
    };
    

    const handleQuantityChange = (event, itemId) => {
        const { value } = event.target;
        const updatedItems = estimateData.items.map((item) => {
          if (item.itemId === itemId) {
            const newQuantity = parseFloat(value) >= 0 ? parseFloat(value) : 0;
            const newAmount = calculateDiscountedAmount(item.price, newQuantity, item.discount);
            
            return {
              ...item,
              itemquantity: newQuantity,
              amount: newAmount,
            };
          }
          return item;
        });
      
        setestimateData({ ...estimateData, items: updatedItems });
      };
      
    const onChangeQuantity = (event, itemId) => {
        let newQuantity = event.target.value ? parseFloat(event.target.value) : 1;
        newQuantity = Math.max(newQuantity, 0); // Ensure quantity is not negative
      
        setQuantityMap((prevMap) => ({
          ...prevMap,
          [itemId]: newQuantity,
        }));
      };

    const onDeleteItem = (itemIdToDelete) => {
        setSearchitemResults((prevResults) => {
            return prevResults.filter((item) => item.value !== itemIdToDelete);
        });
    };

    const handleDeleteClick = async (itemId) => {
        try {
            if (!itemId) {
                console.error('Item ID is undefined or null');
                return;
            }
    
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://roofing-31jz.onrender.comapi/delestimateitem/${estimateData._id}/${itemId}`, {
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
                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(`Failed to delete item: ${errorMessage}`);
                }
        
                fetchdata(); 
            }
    
            
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };
    
    const calculateDiscountedAmount = (price, quantity, discount) => {
        const totalAmount = price * quantity;
        const discountedAmount = totalAmount - Math.max(discount, 0); // Ensure discount is not negative
        return discountedAmount > 0 ? discountedAmount : 0;
      };
      
      const onDiscountpreitemChange = (event, itemId) => {
        const { value } = event.target;
        const regex = /^\d*\.?\d{0,2}$/; // Regex to allow up to two decimal places
    
        // Check if the input matches the allowed format
        if (regex.test(value)) {
            const newDiscount = value !== '' ? parseFloat(value) : 0;
    
            // Update only the discount for the specific item with the matching itemId
            const updatedItems = estimateData.items.map((item) => {
                if (item.itemId === itemId) {
                    const quantity = item.itemquantity || 1;
                    const discountedAmount = calculateDiscountedAmount(item.price, quantity, newDiscount);
    
                    return {
                        ...item,
                        discount: newDiscount,
                        amount: discountedAmount,
                    };
                }
                return item;
            });
    
            // Set the updated items in the state
            setestimateData({
                ...estimateData,
                items: updatedItems,
            });
        } else {
            // Handle invalid input (e.g., show a message to the user)
            console.log('Invalid input for discount');
        }
    };
    
    const onDiscountChange = (event, itemId) => {
        const discountValue = event.target.value;
        const regex = /^\d*\.?\d{0,2}$/; // Regex to allow up to two decimal places
    
        // Check if the input matches the allowed format
        if (regex.test(discountValue)) {
            const newDiscount = discountValue !== '' ? parseFloat(discountValue) : 0;
            const selectedPrice = items.find((i) => i._id === itemId)?.price || 0;
            const quantity = quantityMap[itemId] || 1;
            const totalAmount = selectedPrice * quantity;
    
            const discountedAmount = totalAmount - (totalAmount * newDiscount) / 100;
    
            setDiscountMap((prevMap) => ({
                ...prevMap,
                [itemId]: newDiscount,
            }));
    
            // Use discountedAmount in your code where needed
            // console.log('Discounted Amount:', discountedAmount.toFixed(2)); // Output the discounted amount
        } else {
            // Handle invalid input (e.g., show a message to the user)
            console.log('Invalid input for discount');
        }
    };

    const calculateSubtotal = () => {
        let subtotal = 0;
      
        // Calculate subtotal for estimateData.items
        if (estimateData.items && Array.isArray(estimateData.items)) {
            estimateData.items.forEach((item) => {
              const itemPrice = item.price || 0;
              const quantity = item.itemquantity || 1;
              const discount = item.discount || 0;
        
              const discountedAmount = calculateDiscountedAmount(itemPrice, quantity, discount);
        
              subtotal += discountedAmount;
            });
          }
      
        // Calculate subtotal for searchitemResults
        searchitemResults.forEach((item) => {
          const selectedItem = items.find((i) => i._id === item.value);
          const itemPrice = selectedItem?.price || 0;
          const itemId = item.value;
          const quantity = quantityMap[itemId] || 1;
          const discount = discountMap[itemId] || 0;
      
          const discountedAmount = calculateDiscountedAmount(itemPrice, quantity, discount);
      
          subtotal += discountedAmount;
        });
      
        return subtotal;
      };
      

      // Function to handle tax change
      const handleTaxChange = (event) => {
        let enteredTax = event.target.value;
        // Restrict input to two digits after the decimal point
        const regex = /^\d*\.?\d{0,2}$/; // Regex to allow up to two decimal places
        if (regex.test(enteredTax)) {
            // Ensure that the entered value is a valid number
            enteredTax = parseFloat(enteredTax);
            setTaxPercentage(enteredTax);
            setestimateData({ ...estimateData, taxpercentage: enteredTax }); 
        }
    };
    
    // Function to calculate tax amount
    const calculateTaxAmount = () => {
        const subtotal = calculateSubtotal();
        const totalDiscountedAmount = subtotal - discountTotal; 
        const taxAmount = (totalDiscountedAmount * estimateData.taxpercentage) / 100;
        return taxAmount;
    };
    

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const taxAmount = calculateTaxAmount();
        const discountAmount = discountTotal;
        // console.log(discountAmount,"- discountAmount");
        const totalAmount = (subtotal- discountAmount) + taxAmount ;
        return totalAmount;
      };

    const onchange = (event) => {
        const { name, value } = event.target;
        setestimateData({ ...estimateData, [name]: value });
    };

    const handlePriceChange = (event, itemId) => {
        const { value } = event.target;
        const updatedItems = estimateData.items.map((item) => {
            if (item.itemId === itemId) {
                const newPrice = parseFloat(value);
                const quantity = item.itemquantity || 1;
                const discount = item.discount || 0;
                const discountedAmount = calculateDiscountedAmount(newPrice, quantity, discount);
                return { ...item, price: newPrice, amount: discountedAmount };
            }
            return item;
        });
        setestimateData({ ...estimateData, items: updatedItems });
    };
    
    const handleDescriptionChange = (editor, itemId) => {
        const value = editor.getData();
        const updatedItems = estimateData.items.map((item) => {
            if (item.itemId === itemId) {
                return { ...item, description: value };
            }
            return item;
        });
        setestimateData({ ...estimateData, items: updatedItems });
    };
    
    const handleDiscountChange = (event) => {
        const value = event.target.value;
        // If the input is empty or NaN, set the value to 0
        const newValue = value === '' || isNaN(parseFloat(value)) ? 0 : parseFloat(value);
        setdiscountTotal(newValue);
    };


  return (
    <div className='bg'>
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
        <div className='container-fluid'>
            <div className="row">
                <div className='col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none'>
                    <div  >
                    <Usernavbar/>
                    </div>
                </div>

                <div className="col-lg-10 col-md-9 col-12 mx-auto">
                    <div className='d-lg-none d-md-none d-block mt-2'>
                        <Usernav/>
                    </div>
                    <div className='mx-4'>
        
                        {/* <form> */}
                        <div className='row py-4 px-2 breadcrumbclr'>
                            <div className="col-lg-4 col-md-6 col-sm-6 col-7 me-auto">
                                <p className='fs-35 fw-bold'>Estimate</p>
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb mb-0">
                                        <li class="breadcrumb-item"><a href="/Userpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                                        <li class="breadcrumb-item"><a href="/Userpanel/Userdashboard" className='txtclr text-decoration-none'>Estimate</a></li>
                                        <li class="breadcrumb-item active" aria-current="page">Edit Estimate</li>
                                    </ol>
                                </nav>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-4 col-5 text-right">
                                <button className='btn rounded-pill btn-danger text-white fw-bold' type="submit" onClick={handleSaveClick}>Save</button>
                            </div>
                            <div className='mt-2'>
                                {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
                            </div>
                        </div>
                        <div className='box1 rounded adminborder p-4 m-2 mb-5'>
                            <div className='row me-2'>
                                <div className="col-5">
                                        <div className="customerdetail p-3">
                                            <ul>
                                                <li className='fw-bold fs-4'>{estimateData.customername}</li>
                                            </ul>
                                            <p>{estimateData.customeremail}</p>
                                        </div>
                                </div>    
                                <div className="col-7">
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="mb-3">
                                                <label htmlFor="invoicenumbr" className="form-label">
                                                Estimate Number
                                                </label>
                                                <input
                                                type="text"
                                                name="EstimateNumber"
                                                className="form-control"
                                                value={estimateData.EstimateNumber} 
                                                onChange={onchange}
                                                // placeholder="Invoice Number"
                                                id="invoicenumbr"
                                                required
                                                disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="mb-3">
                                                <label htmlFor="purchaseoder" className="form-label">
                                                    Purchase Order (PO) #
                                                </label>
                                                <input
                                                type="text"
                                                name="purchaseorder"
                                                className="form-control"
                                                value={estimateData.purchaseorder}
                                                onChange={onchange}
                                                id="purchaseoder"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="mb-3">
                                                <label htmlFor="Date" className="form-label">
                                                Date
                                                </label>
                                                <input
                                                type="date"
                                                name="date"
                                                className="form-control"
                                                value={new Date(estimateData.date).toISOString().split('T')[0]} 
                                                onChange={onchange}
                                                // placeholder="Date"
                                                id="Date"
                                                required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="mb-3">
                                                <label htmlFor="job" className="form-label">
                                                Job
                                                </label>
                                                <input
                                                type="text"
                                                name="job"
                                                className="form-control"
                                                value={estimateData.job} 
                                                onChange={onchange}
                                                // placeholder="Date"
                                                id="job"
                                                required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>    
                            </div>

                            <div className='box1 rounded adminborder p-4 m-2'>
                                <div className="row pt-3">
                                    <div className="col-6">
                                        <p>ITEM</p>
                                    </div>
                                    <div className="col-2">
                                        <p>QUANTITY</p>
                                    </div>
                                    <div className="col-2">
                                        <p>PRICE</p>
                                    </div>
                                    {/* <div className="col-2">
                                        <p>DISCOUNT</p>
                                    </div> */}
                                    <div className="col-2">
                                        <p>AMOUNT</p>
                                    </div>
                                </div>

                                <div>
                                {estimateData.items && estimateData.items.map((item) => (
                                    <div className='row' key={item.itemId}>
                                    <div className="col-6 ">
                                        <div className="mb-3 d-flex align-items-baseline justify-content-between">
                                            <p>{item.itemname}</p>
                                            <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteClick(item.itemId)}>
                                            {/* <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteClick(estimateData.itemId)}> */}
 
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-2">
                                        <div className="mb-3">
                                        <input
                                            type="number"
                                            name="quantity"
                                            className="form-control"
                                            value={item.itemquantity}
                                            onChange={(event) => handleQuantityChange (event, item.itemId)}
                                            id={`quantity-${item.itemId}`}
                                            required
                                        />
                                        </div>
                                    </div>
                                    <div className="col-2">
                                        <div className="mb-3">
                                            {/* <input
                                                type="number"
                                                name="price"
                                                className="form-control"
                                                value={item.price}
                                                id="price"
                                                required
                                                readOnly
                                            /> */}
                                            <input
                                                type="number"
                                                name="price"
                                                className="form-control"
                                                value={item.price}
                                                onChange={(event) => handlePriceChange(event, item.itemId)} // Add onChange handler
                                                id={`price-${item.itemId}`}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="col-2">
                                        <p><CurrencySign />{item.discount}</p>
                                    </div> */}
                                    <div className="col-2">
                                        <p><CurrencySign />{item.amount}</p>
                                    </div>
                                    {/* <div className="col-5">
                                                <div class="mb-3">
                                                    <label htmlFor="description" className="form-label">Description</label>
                                                    <textarea
                                                        class="form-control"
                                                        name='description'
                                                        id='description'
                                                        placeholder='Item Description'
                                                        value={item.description}
                                                        rows="3"
                                                        readOnly
                                                    >
                                                    </textarea>
                                                </div>
                                    </div> */}
                                    <div className="col-6">
                                        <div className="mb-3">
                                            <label htmlFor={`description-${item.itemId}`} className="form-label">Description</label>
                                            {/* <textarea
                                                className="form-control"
                                                name={`description-${item.itemId}`}
                                                id={`description-${item.itemId}`}
                                                placeholder="Item Description"
                                                value={item.description}
                                                onChange={(event) => handleDescriptionChange(event, item.itemId)} // Add onChange handler
                                                rows="3"
                                            /> */}
                                            <CKEditor
                                                        editor={ ClassicEditor }
                                                        data={item.description}
                                                        // onReady={ editor => {
                                                        //     console.log( 'Editor is ready to use!', editor );
                                                        // } }
                                                        
                                                        onChange={( event, editor ) => {
                                                            handleDescriptionChange(editor, item.itemId);
                                                        }
                                                        }
                                                        onBlur={ ( event, editor ) => {
                                                            console.log( 'Blur.', editor );
                                                        } }
                                                        onFocus={ ( event, editor ) => {
                                                            console.log( 'Focus.', editor );
                                                        } }
                                                    />
                                        </div>
                                    </div>
                                            
                                            {/* <div className="col-3">
                                                <div class="mb-3">
                                                    <label htmlFor="Discount" className="form-label">Discount</label>
                                                    <input
                                                        type='number'
                                                        name='discount'
                                                        className='form-control'
                                                        value={item.discount}
                                                        onChange={(event) => onDiscountpreitemChange(event, item.itemId)}
                                                        placeholder='Discount'
                                                        id={`discount-${item.itemId}`}
                                                        min="0"
                                                    />
                                                </div>
                                            </div> */}
                                    
                                    </div>
                                        ))}
                                {searchitemResults.map((item) => {
                                    const selectedItem = items.find((i) => i._id === item.value);
                                    const itemPrice = selectedItem?.price || 0;
                                    const itemId = item.value;
                                    const quantity = quantityMap[itemId] || 1;
                                    const discount = discountMap[itemId] || 0;
                                    const discountedAmount = calculateDiscountedAmount(itemPrice, quantity, discount);
                                    const formattedTotalAmount = Number(discountedAmount).toLocaleString('en-IN', {
                                    // style: 'currency',
                                    // currency: 'INR',
                                    });

                                    return (
                                        <div className='row'  key={item.itemId}>
                                            <div className="col-6 ">
                                                <div className="mb-3 d-flex align-items-baseline justify-content-between">
                                                    <p>{item.label}</p>
                                                    <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => onDeleteItem(item.value)}>
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-2">
                                                <div className="mb-3">
                                                <input
                                                    type="number"
                                                    name={`quantity-${itemId}`}
                                                    className="form-control"
                                                    value={quantity}
                                                    onChange={(event) => onChangeQuantity(event, itemId)}
                                                    id={`quantity-${itemId}`}
                                                    required
                                                />
                                                </div>
                                            </div>
                                            <div className="col-2">
                                                <div className="mb-3">
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        className="form-control"
                                                        value={itemPrice}
                                                        id="price"
                                                        required
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                            {/* <div className="col-2 text-center">
                                                <p><CurrencySign />{discount.toFixed(2)}</p>
                                            </div> */}
                                            <div className="col-2 text-center">
                                                <p><CurrencySign />{formattedTotalAmount}</p>
                                            </div>
                                            <div className="col-6">
                                                <div class="mb-3">
                                                    <label htmlFor="description" className="form-label">Description</label>
                                                    {/* <textarea
                                                        class="form-control"
                                                        name='description'
                                                        id={`item-description-${itemId}`}
                                                        placeholder='Item Description'
                                                        rows="3"
                                                        value={selectedItem?.description || ''}
                                                        readOnly
                                                    >
                                                    </textarea> */}
                                                    <CKEditor
                                                        editor={ ClassicEditor }
                                                        data={estimateData.description}
                                                        // onReady={ editor => {
                                                        //     console.log( 'Editor is ready to use!', editor );
                                                        // } }
                                                        
                                                        onChange={handledescChange}
                                                        onBlur={ ( event, editor ) => {
                                                            console.log( 'Blur.', editor );
                                                        } }
                                                        onFocus={ ( event, editor ) => {
                                                            console.log( 'Focus.', editor );
                                                        } }
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* <div className="col-3">
                                                <div class="mb-3">
                                                    <label htmlFor="Discount" className="form-label">Discount</label>
                                                    <input
                                                        type='number'
                                                        name={`discount-${itemId}`}
                                                        className='form-control'
                                                        value={discount}
                                                        onChange={(event) => onDiscountChange(event, itemId)}
                                                        placeholder='Discount'
                                                        id={`discount-${itemId}`}
                                                        min="0"
                                                    />
                                                </div>
                                            </div> */}
                                        </div>
        );
      })}
                                </div>
                                <hr />

                                <div className="row pt-3">
                                    <div className="col-7">
                                        <div className="search-container forms">
                                            <p className='fs-20 mb-0'>Select Item</p>
                                            <VirtualizedSelect
                                                id="searchitems" 
                                                name="itemname"
                                                className="form-control zindex op pl-0"
                                                placeholder=""
                                                onChange={onChangeitem}
                                                options={ items.map((item,index)=>
                                                    ({label: item.itemname, value: item._id})
                                                        
                                                )}

                                                >
                                            </VirtualizedSelect> 
                                        </div>
                                    </div>
                                    <div className="col-5">
                                        <div className="row">
                                            <div className="col-6">
                                                <p>Subtotal</p>
                                                <p className="mb-4">Discount</p>
                                                <p>GST {estimateData.taxpercentage}%</p>
                                                <p>Total</p>
                                            </div>
                                            <div className="col-6">
                                                <p><CurrencySign />{calculateSubtotal().toLocaleString('en-IN', {
                                                    // style: 'currency',
                                                    // currency: 'INR',
                                                })}</p>
                                                <div className="col-6">
                                                
                                            </div>
                                            <div className="mb-3">
                                                    <input
                                                        type="number"
                                                        name="totaldiscount"
                                                        className="form-control"
                                                        value={discountTotal}
                                                        onChange={handleDiscountChange} // Ensure proper event binding
                                                        placeholder="Enter Discount Total"
                                                        id="discountInput"
                                                        min="0"
                                                    />
                                                </div>
                                                <p><CurrencySign />{calculateTaxAmount().toLocaleString('en-IN', {
                                                    // style: 'currency',
                                                    // currency: 'INR',
                                                })}</p>
                                                
                                                
                                                <p><CurrencySign />{calculateTotal().toLocaleString('en-IN', {
                                                    // style: 'currency',
                                                    // currency: 'INR',
                                                    })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div className="row pt-3">
                                    <div className="col-7"></div>
                                    <div className="col-5">
                                        <div className="row">
                                            <div className="col-6">
                                                <p>Amount due</p>
                                            </div>
                                            <div className="col-6">
                                                <p><CurrencySign />{calculateTotal().toLocaleString('en-IN', {
                                                    // style: 'currency',
                                                    // currency: 'INR',
                                                    })}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='box1 rounded adminborder m-2 mt-5'>
                                <CKEditor
                                    editor={ ClassicEditor }
                                    data={estimateData.information}
                                    // onReady={ editor => {
                                    //     console.log( 'Editor is ready to use!', editor );
                                    // } }
                                    
                                    onChange={handleEditorChange}
                                    onBlur={ ( event, editor ) => {
                                        console.log( 'Blur.', editor );
                                    } }
                                    onFocus={ ( event, editor ) => {
                                        console.log( 'Focus.', editor );
                                    } }
                                />
                            </div>
                        </div>

                        {/* </form> */}
                    </div>
                </div>
            </div>
        </div>
}
    </div>
  )
}