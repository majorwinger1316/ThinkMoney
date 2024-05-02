import React, { useState, useEffect } from 'react';
import "../Styles/Gold.css"
import axios from 'axios';

function Gold() {
  const [row, setRow] = useState({
    user_id: '',
    p_price: '',
    gram: '',
    c_price: '',
    value: ''
  });

  const handleInput = (event) => {
    setRow(prev => ({...prev, [event.target.name]: event.target.value}))
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://localhost:8080/gold', row)
        .then(res => console.log(res))
        .catch(err => console.error("Error:", err));
  };

  return (
    <div className='gold'>
      <h1>Gold Investment</h1>
      <p>Here you can log the info about your gold purchase so we can provide Advice</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <table className='gold-table'>
            <thead>
              <tr>
                <th>Date</th>
                <th>User ID</th>
                <th>Purchase Price</th>
                <th>Grams</th>
                <th>Invested Amount</th>
                <th>Current Price</th>
                <th>Current Value</th>
                <th>Returns</th>
              </tr>
            </thead>
            <tbody>
              <tr key={row.id}>
                <td>
                  <input
                    type="date"
                    name="date"
                    placeholder=" "
                    onChange={handleInput}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="user_id"
                    placeholder=" "
                    onChange={handleInput}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="p_price"
                    placeholder=" "
                    onChange={handleInput}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="gram"
                    placeholder=" "
                    onChange={handleInput}
                  />
                </td>
                <td>{row.p_price * row.gram}</td>
                <td>
                  <input
                    type="number"
                    name="c_price"
                    placeholder=" "
                    onChange={handleInput}
                  />
                </td>
                <td name="value">{row.c_price * row.gram}</td>
                <td>{(row.c_price * row.gram) - (row.p_price * row.gram)}</td>
              </tr>
              <tr>
                <td colSpan="6">Total Returns</td>
              </tr>
            </tbody>
          </table>
          <button className="addgold-button" onClick={handleSubmit}>Add</button>
        </div>
      </div>
    </div>
  )
}

export default Gold;
