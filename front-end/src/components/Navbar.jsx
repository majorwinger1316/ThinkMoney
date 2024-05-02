import React from 'react'
import "../Styles/Navbar.css";
import { Link } from 'react-router-dom';
import Logo from '../assets/thinklogo.png';

function Navbar() {
  return (
    <div className='header'>
        <div className="left_side">
        <img src={Logo}/>
            <Link to="/">
            <h1>ThinkMoney</h1>
            </Link>
        </div>
        <div className="right_side">
            <Link to="/">Home</Link>
            <Link to="/investment">Investment</Link>
            <Link to="/advice">Advice</Link>
            <Link to="/About">About</Link>
            <Link to="/login">Login</Link>
        </div>
    </div>
  )
}

export default Navbar
