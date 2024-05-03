import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Styles/Total.css"

function Total() {
    const [values, setValues] = useState({
        user_id: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [goldData, setGoldData] = useState(null); // Initialize with null
    const [equityData, setEquityData] = useState(null); // Initialize with null
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch investment data when user ID changes
        // Make sure to handle cases where user ID is empty or null
        if (values.user_id) {
            fetchInvestmentData(values.user_id);
        }
    }, [values.user_id]);

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
    
        // Validate form fields
        if (!values.user_id || !values.password) {
            setErrors({ message: "Please fill in both user ID and password fields." });
            return;
        }
    
        // Sending user credentials to the backend for authentication
        axios.post('http://localhost:8080/login', values)
            .then(res => {
                if (res.data === "Success") {
                    // If login successful, fetch investment data for the user
                    fetchInvestmentData(values.user_id);
                } else {
                    // If login fails, display an alert message
                    alert("Login failed. Please check your credentials.");
                }
            })
            .catch(err => console.error(err));
    }
    
    const fetchInvestmentData = (userId) => {
        axios.get(`http://localhost:8080/investment/${userId}`)
            .then(res => {
                console.log("Response from backend:", res.data);
                const { gold, equity } = res.data;
                setGoldData(gold);
                setEquityData(equity);
            })
            .catch(err => console.error("Error fetching investment data:", err));
    }
    

    return (
        <div className='total'>
            {/* Login Form Section */}
            <Row className="justify-content-md-center">
                <Col md={0}>
                    <Form onSubmit={handleSubmit}>
                        {/* User ID Input */}
                        <div style={{ padding: '10px', width: '35vh' }}>
                            <Form.Group controlId="formEmail">
                                <div style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: "15px" }}>
                                    <span>User ID</span>
                                </div>
                                <Form.Control
                                    type="text"
                                    name='user_id'
                                    placeholder="yourname+xyz"
                                    onChange={handleInput}
                                />
                                {errors.user_id && <span className='text-danger'>{errors.user_id}</span>}
                            </Form.Group>
                        </div>
                        {/* Password Input */}
                        <div style={{ padding: '10px', width: '35vh' }}>
                            <div style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: "15px" }}>
                                <span>Password</span>
                            </div>
                            <Form.Group controlId="formPassword">
                                <Form.Control
                                    type="password"
                                    name='password'
                                    placeholder="Password"
                                    onChange={handleInput}
                                />
                                {errors.password && <span className='text-danger'>{errors.password}</span>}
                            </Form.Group>
                        </div>
                        {/* Submit Button */}
                        <div style={{ display: 'flex', justifyContent: 'center', width: '35vh', border: "100%", padding: "10px" }}>
                            <Button type='submit' variant="success" style={{ width: '100%', maxWidth: '200px' }}>Login</Button>
                        </div>
                    </Form>
                </Col>
            </Row>

            {/* Gold Table Section */}
            {goldData && (
                <div className='table'>
                    <h2>Gold Investment</h2>
                    <table className='total-table'>
                        <thead>
                            <tr>
                                <th>Total Investment</th>
                                <th>Total Return</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input type="text" value={goldData.totalInvestment} readOnly /></td>
                                <td><input type="text" value={goldData.totalReturns} readOnly /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {/* Equity Table Section */}
            {equityData && (
                <div className='table'>
                    <h2>Equity Investment</h2>
                    <table className='total-table'>
                        <thead>
                            <tr>
                                <th>Total Investment</th>
                                <th>Total Return</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{equityData.totalInvestment}</td>
                                <td>{equityData.totalReturns}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Total;
