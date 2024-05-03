import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import validation from '../validation/LoginValidation.js';
import axios from 'axios';
import CryptoJS from 'crypto-js';

function Register() {

    const [values, setValues] = useState({
        username: '',
        user_id: '',
        email: '',
        password: ''
    })

    const handleInput = (event) => {
        setValues(prev => ({...prev, [event.target.name]: event.target.value}))
    }

    const navigate = useNavigate();
    const [errors, setErrors] = useState({})


    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Hash the password using SHA-256 algorith
    
        // Set errors and proceed with registration
        setErrors(validation(values));
        await axios.post('http://localhost:8080/register', values)
            .then(res => {
                if(res.data === "user_id and email"){
                    alert("The User ID or Email is taken.")
                }
                else if(res.data === "user_id"){
                    alert("User ID is taken.")
                }
                else if(res.data === "email"){
                    alert("Email is taken.")
                }
                else{
                    navigate('/login');
                }
            })
            .catch(err => console.error("Error:", err));
    };

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
                justifyContent: 'center',
                alignItems: 'center' ,
                backgroundColor: 'transparent', 
                padding: '20px', 
                borderRadius: '10px',
                height: "60vh",
                width: '50vh', 
                backdropFilter: 'blur(15px)',
                border: '2px solid black'
            }}>
                <Row className="justify-content-md-center">
                    <Col md={0}>
                    <Form action='' onSubmit={handleSubmit}>
                            <div style={{ padding: '10px', width: '35vh' }}>
                                <Form.Group controlId="formName">
                                    <div style={{fontFamily: "'Courier New', Courier, monospace", fontSize: "15px"}}>
                                    <span>User Name</span>
                                    </div>
                                    <Form.Control
                                        type="username"
                                        name='username'
                                        placeholder=" "
                                        onChange={handleInput}
                                    />
                                    {errors.name && <span className='text-danger'>{errors.name}</span>}
                                </Form.Group>
                            </div>
                            <div style={{ padding: '10px', width: '35vh' }}>
                                    <div style={{fontFamily: "'Courier New', Courier, monospace", fontSize: "15px"}}>
                                    <span>User ID</span>
                                    </div>
                                    <Form.Group controlId="formUserID">
                                    <Form.Control
                                        type="user_id"
                                        name='user_id'
                                        placeholder="ex: yournamexyz"
                                        onChange={handleInput}
                                    />
                                    {errors.user_id && <span className='text-danger'>{errors.user_id}</span>}
                                </Form.Group>
                            </div>
                            <div style={{ padding: '10px', width: '35vh' }}>
                                    <div style={{fontFamily: "'Courier New', Courier, monospace", fontSize: "15px"}}>
                                    <span>Email</span>
                                    </div>
                                    <Form.Group controlId="formEmail">
                                    <Form.Control
                                        type="email"
                                        name='email'
                                        placeholder="example@example.com"
                                        onChange={handleInput}
                                    />
                                    {errors.email && <span className='text-danger'>{errors.email}</span>}
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
                                <Button type='submit' variant="success" style={{ width: '100%', maxWidth: '200px', fontFamily:"'Courier New', Courier, monospace" }}>Register</Button>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'center', width:'35vh', fontSize: '13px', color: 'grey'}}>
                                <Link to="/login" style={{ color: 'grey', fontFamily:"'Courier New', Courier, monospace" }}>Already a User?</Link>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Register