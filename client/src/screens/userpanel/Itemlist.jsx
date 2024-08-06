import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate } from 'react-router-dom';
import Usernav from './Usernav';
import { ColorRing } from  'react-loader-spinner'
import CurrencySign from '../../components/CurrencySign ';
import Alertauthtoken from '../../components/Alertauthtoken';
// import Nav from './Nav';

export default function Itemlist() {
    const [ loading, setloading ] = useState(true);
    const [items, setitems] = useState([]);
    const [selecteditems, setselecteditems] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const entriesPerPage = 10;

    useEffect(() => {
        if(!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true")
        {
          navigate("/");
        }
        fetchdata();
    }, [])

    const handleAddClick = () => {
        navigate('/userpanel/Additem');
    }

    const fetchdata = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://roofing-31jz.onrender.com/api/itemdata/${userid}`, {
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
                    setitems(json);
                }
                setloading(false);
              }
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleEditClick = (item) => {
        setselecteditems(item);
        let itemId = item._id;
        navigate('/userpanel/Edititem', { state: { itemId } });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
        
    };

    const handleDeleteClick = async (itemId) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://roofing-31jz.onrender.com/api/delitem/${itemId}`, {
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
                    fetchdata(); // Refresh the items list
                } else {
                    console.error('Error deleting item:', json.message);
                }  
            }
    
            
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    // Filtering function
    const filteredItems = items.filter(item =>
        item.itemname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination functions
    const getPageCount = () => Math.ceil(filteredItems.length / entriesPerPage);
  
    const getCurrentPageItems = () => {
      const startIndex = currentPage * entriesPerPage;
      const endIndex = startIndex + entriesPerPage;
      return filteredItems.slice(startIndex, endIndex);
    };
  
    const handlePrevPage = () => {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    };
  
    const handleNextPage = () => {
      if ((currentPage + 1) * entriesPerPage < items.length) {
        setCurrentPage(currentPage + 1);
      }
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
                    <div className='mt-4 mx-4'>
                        {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
                    </div>
                    <div className="bg-white my-5 p-4 box mx-4">
                        <div className='row py-2'>
                            <div className="col-lg-4 col-md-6 col-sm-6 col-7 me-auto">
                                <p className='h5 fw-bold'>Items</p>
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb mb-0">
                                        <li class="breadcrumb-item"><a href="/itempanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                                        <li class="breadcrumb-item active" aria-current="page">Items</li>
                                    </ol>
                                </nav>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-4 col-5 text-right">
                                <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleAddClick}>+ Create</button>
                            </div>
                        </div><hr />

                        <div className='row my-2'>
                            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Search by name"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row px-2 table-responsive">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">ID </th>
                                        <th scope="col">Item </th>
                                        <th scope="col">Amount </th>
                                        <th scope="col">Date </th>
                                        <th scope="col">Edit/Delete </th>
                                    </tr>
                                </thead>
                                <tbody>
                                            {getCurrentPageItems().map((item, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{item.itemname}</td>
                                                    <td><CurrencySign />{item.price}</td>
                                                    <td>{formatDate(item.createdAt)}</td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <a role='button' className="btn btn-success btn-sm me-2 text-white" onClick={() => handleEditClick(item)}>
                                                                <i className="fa-solid fa-pen"></i>
                                                            </a>
                                                            <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteClick(item._id)}>
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {/* {filteredItems.map((item, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{item.itemname}</td>
                                                    <td><CurrencySign />{item.price}</td>
                                                    <td>{formatDate(item.createdAt)}</td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <a role='button' className="btn btn-success btn-sm me-2 text-white" onClick={() => handleEditClick(item)}>
                                                                <i className="fa-solid fa-pen"></i>
                                                            </a>
                                                            <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteClick(item._id)}>
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))} */}
                                        </tbody>
                                {/* <tbody>
                                        {items.map((item, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{item.itemname}</td>
                                                <td><CurrencySign />{item.price}</td>
                                                <td>{formatDate(item.createdAt)}</td>
                                                <td>
                                                    <div className="d-flex">
                                                        <a role='button' className="btn btn-success btn-sm me-2 text-white" onClick={ () => handleEditClick(item)}>
                                                                    <i className="fa-solid fa-pen"></i>
                                                                </a>
                                                                <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteClick(item._id)}>
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody> */}
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
                      disabled={(currentPage + 1) * entriesPerPage >= items.length}
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
