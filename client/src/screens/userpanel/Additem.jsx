import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate } from 'react-router-dom';
import Usernav from './Usernav';
import { ColorRing } from  'react-loader-spinner';
import Alertauthtoken from '../../components/Alertauthtoken';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import Usernavbar from './Usernavbar';

export default function Additem() {
  const [ loading, setloading ] = useState(true);
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState('');
  const [credentials, setCredentials] = useState({
    itemname: '',
    description: '',
    price: '',
  });

  const [message, setMessage] = useState(false);
  const [alertShow, setAlertShow] = useState('');
  const [editorData, setEditorData] = useState("<p></p>");

  useEffect(() => {
    if(!localStorage.getItem("authToken") || localStorage.getItem("isTeamMember") == "true")
    {
      navigate("/");
    }
    setloading(false);
}, [])

  const handleSubmit = async (e) => {
    // e.preventDefault();
    let userid = localStorage.getItem('userid');
    const authToken = localStorage.getItem('authToken');
    const response = await fetch('https://roofing-31jz.onrender.comapi/additem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken,
      },
      body: JSON.stringify({
        userid: userid,
        itemname: credentials.itemname,
        description: editorData,
        price: credentials.price,
      }),
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
        console.log(json);

        if (json.Success) {
          setCredentials({
            itemname: '',
            description: '',
            price: '',
          });

          setMessage(true);
          setAlertShow(json.message);
          setloading(false);
          navigate('/userpanel/Itemlist');
        }
        else{
          console.log("else part")
        }
    }

    
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
};

  const onchange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };


  return (
    <div className="bg">
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
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2 col-md-3 b-shadow bg-white d-lg-block d-md-block d-none">
            <div>
              <Usernavbar />
            </div>
          </div>

          <div className="col-lg-10 col-md-9 col-12 mx-auto">
            <div className="d-lg-none d-md-none d-block mt-2">
              <Usernav/>
            </div>
            <div className='mt-4 mx-4'>
                            {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
                        </div>
              <div className="bg-white my-5 p-4 box mx-4">
                <div className="row">
                  <p className="h5 fw-bold">Item</p>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <a href="/userpanel/Userdashboard" className="txtclr text-decoration-none">
                          Dashboard
                        </a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Add a new Item
                      </li>
                    </ol>
                  </nav>
                </div>
                <hr />
                <div className="row">
                  <div className="">
                  {/* <div className="col-11 m-auto box shadow"> */}
                    <div className="p-3">
                      {/* <p className="h5">Customer details</p> */}
                      {/* <hr /> */}
                      <div className="row">
                        <div className="col-12 col-sm-6 col-lg-6">
                          <div className="mb-3">
                            <label htmlFor="itemname" className="form-label">
                            Item Name
                            </label>
                            <input
                              type="text"
                              name="itemname"
                              className="form-control"
                              onChange={onchange}
                              placeholder="Item Name"
                              id="itemname"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-6">
                          <div className="mb-3">
                            <label htmlFor="Number" className="form-label">
                              Price
                            </label>
                            <input
                              type="number"
                              name="price"
                              className="form-control"
                              onChange={onchange}
                              placeholder="Price"
                              id="price"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-12 col-lg-6">
                          <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                            Description
                            </label>
                            <div className='box1 rounded adminborder m-2'>
                            <CKEditor
                                editor={ClassicEditor}
                                data={editorData}
                                                    // onReady={ editor => {
                                                    //     console.log( 'Editor is ready to use!', editor );
                                                    // } }

                                onChange={handleEditorChange}
                                onBlur={(event, editor) => {
                                    console.log('Blur.', editor);
                                }}
                                onFocus={(event, editor) => {
                                    console.log('Focus.', editor);
                                }}
                            />
                          </div>
                            {/* <textarea
                              type="text"
                              className="form-control"
                              name="description"
                              onChange={onchange}
                              placeholder="Description"
                              id="description"
                              required
                            /> */}
                          </div>
                        </div>
                        {/* <label htmlFor="" className='fs-4 ms-2 mt-5'>Note</label> */}
                          {/* <div className='box1 rounded adminborder m-2'>
                            <CKEditor
                                editor={ClassicEditor}
                                data={editorData}
                                                    // onReady={ editor => {
                                                    //     console.log( 'Editor is ready to use!', editor );
                                                    // } }

                                onChange={handleEditorChange}
                                onBlur={(event, editor) => {
                                    console.log('Blur.', editor);
                                }}
                                onFocus={(event, editor) => {
                                    console.log('Focus.', editor);
                                }}
                            />
                          </div> */}

                        
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row pt-4 pe-2">
                  <div className="col-3 me-auto"></div>
                  <div className="col-4 col-sm-2">
                    <button onClick={(e)=> handleSubmit(e)} className="btn btnclr text-white">Next</button>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
}
    </div>
  );
}
