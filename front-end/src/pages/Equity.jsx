import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/Equity.css';

function Equity() {
  const [stockNames, setStockNames] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [row, setRow] = useState({
    user_id: '',
    stock_name: '',
    p_price: '',
    quantity: '',
    c_price: '',
    invest_amt: '',
    curr_val:'',
    returns: ''
  });

  useEffect(() => {
    // Fetch stock names from MySQL database
    axios.get('http://localhost:8080/stock')
      .then(response => {
        // Assuming response.data is an array of objects with a 'stock_name' property
        const names = response.data.map(stock => stock.stock_name);
        setStockNames(names);
      })
      .catch(error => {
        console.error('Error fetching stock names:', error);
      });
  }, []);

   useEffect(() => {
    if (selectedStock) {
      axios.get(`http://localhost:8080/currentPrice/${selectedStock}`)
        .then(response => {
          setRow(prev => ({ ...prev, c_price: response.data.currentPrice }));
        })
        .catch(error => {
          console.error(`Error fetching current price for ${selectedStock}:`, error);
        });
    }
  }, [selectedStock]);

  const handleSubmit = (event) => {
    event.preventDefault();
  
    // Calculate invest_amt, curr_val, and returns based on existing values
    const invest_amt = row.p_price * row.quantity;
    const curr_val = row.c_price * row.quantity;
    const returns = (row.c_price * row.quantity) - (row.p_price * row.quantity);
  
    // Create a new object with updated values
    const updatedRow = {
      ...row,
      stock_name: selectedStock,
      invest_amt: invest_amt,
      curr_val: curr_val,
      returns: returns
    };
  
    // Make the POST request with the updatedRow
    axios.post('http://localhost:8080/equity', updatedRow)
      .then(res => {
        console.log(res);
        // Reset the form or show a success message
      })
      .catch(err => console.error("Error:", err));
  };
   

  const handleInput = (event) => {
    const { name, value } = event.target;
    setRow(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className='equity'>
      <h1>Equity</h1>
      <p>Equity represents ownership in a company through shares of stock. Investors buy equity with the expectation of capital appreciation and potential dividends.</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <table className='gold-table'>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Stock Name</th>
                <th>Purchase Price($)</th>
                <th>Quantity</th>
                <th>Current Price($)</th>
                <th>Invested Amount($)</th>
                <th>Current Value($)</th>
                <th>Returns($)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="text"
                    name="user_id"
                    placeholder=" "
                    onChange={handleInput}
                  />
                </td>
                <td>
                <select
  name="stock_name"
  onChange={(event) => setSelectedStock(event.target.value)}
  value={selectedStock}
>
  <option value="">Select an option</option>
  {stockNames.map((stockName, index) => (
    <option key={index} value={stockName}>{stockName}</option>
  ))}
</select>

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
                    name="quantity"
                    placeholder=" "
                    onChange={handleInput}
                  />
                </td>
                <td name="c_price">{isNaN(row.c_price) ? '' : row.c_price}</td>


                <td name="invest_amt">{row.p_price * row.quantity}</td>
                <td name="curr_val">{row.c_price * row.quantity}</td>
                <td name="returns">{(row.c_price * row.quantity) - (row.p_price * row.quantity)}</td>
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
  );
}

export default Equity;
