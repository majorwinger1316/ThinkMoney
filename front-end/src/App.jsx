import { useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from './pages/About';
import Register from './pages/Register';
import Investment from './pages/Investment';
import Advice from './pages/Advice';
import Gold from './pages/Gold';
import Equity from './pages/Equity';
import './App.css';

function App() {

  return (
    <div className="app">
      <Router>
        <Navbar />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path='/login' exact element={<Login />}/>
            <Route path='/about' exact element={<About/>}/>
            <Route path='/register' exact element={<Register/>}/>
            <Route path='/investment' exact element={<Investment/>}/>
            <Route path='/advice' exact element={<Advice/>}/>
            <Route path='/gold' exact element={<Gold/>}/>
            <Route path='/equity' exact element={<Equity/>}/>
          </Routes>
      </Router>
    </div>
  )
}

export default App
