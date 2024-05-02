import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import validation from '../validation/LoginValidation.js';
import axios from 'axios';
import CryptoJS from 'crypto-js';

function Login() {
    const [values, setValues] = useState({
        user_id: '',
        password: ''
    })
    const navigate = useNavigate();
    const [errors, setErrors] = useState({})

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
    
        // Hash the password using SHA-256 algorithm
        const hashedPassword = CryptoJS.SHA256(values.password).toString(CryptoJS.enc.Hex);
        
        // Update the values with the hashed password
        const hashedValues = { ...values, password: hashedPassword };
    
        // Log the values with hashed password
        console.log("Values with hashed password:", { ...hashedValues, password: '******' });
    
        setErrors(validation(values));
        axios.post('http://localhost:8080/login', values)
            .then(res => {
                if(res.data === "Success"){
                    navigate('/');
                }
                else {
                    alert("No record exists");
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '87vh', 
            width: '100%', 
            backgroundSize: 'cover' 
        }}>
            <Container style={{ 
                display: 'flex', 
                alignItems: 'center' ,
                backgroundColor: 'transparent', 
                padding: '20px', 
                borderRadius: '10px',
                height: "40vh",
                width: '50vh', 
                backdropFilter: 'blur(15px)',
                border: '2px solid black'
            }}>
                <Row className="justify-content-md-center">
                    <Col md={8}>
                        <Form action='' onSubmit={handleSubmit}>
                            <div style={{ padding: '10px', width: '35vh' }}>
                                <Form.Group controlId="formEmail">
                                    <div style={{fontFamily: "'Courier New', Courier, monospace", fontSize: "15px"}}>
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
                            <div style={{ padding: '10px', width: '35vh' }}>
                                <div style={{fontFamily: "'Courier New', Courier, monospace", fontSize: "15px"}}>
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
                            <div style={{ display: 'flex', justifyContent: 'center', width: '35vh', border: "100%", padding: "10px" }}>
                                <Button type='submit' variant="success" style={{ width: '100%', maxWidth: '200px' }}>Login</Button>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'center', width:'35vh', fontSize: '13px', color: 'grey'}}>
                                <Link to="/register" style={{ color: 'grey', fontFamily: "'Courier New', Courier, monospace" }}>Click here to register</Link>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Login;
