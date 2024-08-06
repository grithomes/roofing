import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Usernavbar from './Usernavbar';
import Usernav from './Usernav';
import { ColorRing } from 'react-loader-spinner';
import CurrencySign from '../../components/CurrencySign ';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Reports() {
    const [loading, setLoading] = useState(true);
    const [totalReceivedAmount, setTotalReceivedAmount] = useState(0);
    const [startDate, setStartDate] = useState(moment().startOf('month').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment().endOf('month').format('YYYY-MM-DD'));
    const [receivedData, setReceivedData] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Payments Received by Month',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    });
    let navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('authToken') || localStorage.getItem('isTeamMember') === 'true') {
            navigate('/');
        } else {
            fetchTotalReceivedAmount();
        }
    }, [navigate]);

    const fetchTotalReceivedAmount = async () => {
        try {
            setLoading(true);
            const userid = localStorage.getItem('userid');
            const response = await fetch(`https://roofing-31jz.onrender.com/api/currentMonthReceivedAmount2/${userid}?startOfMonth=${moment(startDate).format('YYYY-MM-DD')}&endOfMonth=${moment(endDate).format('YYYY-MM-DD')}`);
            const data = await response.json();
            console.log('Received Data:', data);
            const totalAmount = data.reduce((acc, curr) => acc + curr.totalReceivedAmount, 0);
            setTotalReceivedAmount(totalAmount);
            setReceivedData(data);
            prepareChartData(data);
        } catch (error) {
            console.error('Error fetching total received amount:', error);
        } finally {
            setLoading(false);
        }
    };

    const prepareChartData = (data) => {
        const labels = data.map(entry => moment(entry._id).format('YYYY-MM'));
        const amounts = data.map(entry => entry.totalReceivedAmount);

        console.log('Labels:', labels);
        console.log('Amounts:', amounts);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Payments Received by Month',
                    data: amounts,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
            ],
        });
    };

    return (
        <div className='bg'>
            {loading ? (
                <div className='row'>
                    <ColorRing
                        width={200}
                        loading={loading}
                        size={500}
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                        aria-label='Loading Spinner'
                        data-testid='loader'
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
                                <div className='row py-2'>
                                    <div className='col-lg-4 col-md-6 col-sm-6 col-7 me-auto'>
                                        <p className='h3 fw-bold'>Report</p>
                                    </div>
                                </div>
                                <div className='row py-2'>
                                    <div className='col-lg-4'>
                                        <div className='mb-3'>
                                            <label htmlFor='startDate' className='form-label'>
                                                Start Date
                                            </label>
                                            <input
                                                type='date'
                                                name='startDate'
                                                className='form-control'
                                                id='startDate'
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-lg-4'>
                                        <div className='mb-3'>
                                            <label htmlFor='endDate' className='form-label'>
                                                End Date
                                            </label>
                                            <input
                                                type='date'
                                                name='endDate'
                                                className='form-control'
                                                id='endDate'
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className='col-lg-2'>
                                        <div className='mt-4 my-3'>
                                            <button className='btn btn-primary' onClick={fetchTotalReceivedAmount}>Show</button>
                                        </div>
                                    </div>
                                </div>
                                <div className='row py-2'>
                                    <div className='col-lg-4'>
                                        <p>Total Received Amount: <CurrencySign />{totalReceivedAmount}</p>
                                    </div>
                                </div>
                                <div className='row py-2'>
                                    <div className='col-lg-12'>
                                        <Bar data={chartData} />
                                    </div>
                                </div>
                                <div className='row py-2'>
                                    <div className='col-lg-12'>
                                        <h4>Data Details</h4>
                                        <table className='table table-striped'>
                                            <thead>
                                                <tr>
                                                    <th className='ps-4'>Date</th>
                                                    <th className='text-end pe-4'>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {receivedData.map((entry, index) => (
                                                    <tr key={index}>
                                                        <td className='ps-4'>{moment(entry._id).format('YYYY-MM-DD')}</td>
                                                        <td className='text-end pe-4'><CurrencySign />{entry.totalReceivedAmount}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );    
}
