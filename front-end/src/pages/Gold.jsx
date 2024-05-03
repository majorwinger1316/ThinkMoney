import React, { useState, useEffect } from 'react';
import "../Styles/Gold.css"
import axios from 'axios';

function Gold() {
  const [row, setRow] = useState({
    user_id: '',
    p_price: '',
    gram: '',
    c_price: '',
    value: '',
    returns: ''
  });

  useEffect(() => {
    axios.get('https://api.metalpriceapi.com/v1/latest?api_key=0b05ad1cbf937439120798ea84c35c97&base=USD&currencies=EUR,XAU,XAG')
      .then(response => {
        const rates = response.data.rates;
        if (rates && rates.XAU) {
          // Assuming the API response contains the current gold price in USD per ounce
          const currentGoldPriceUSDPerOunce = rates.XAU;
          const goldpriceinusd = 1/currentGoldPriceUSDPerOunce; 
          const currentGoldPriceUSDPerGram = goldpriceinusd / 31.1035; // Convert price from USD per ounce to USD per gram
          setRow(prev => ({ ...prev, c_price: currentGoldPriceUSDPerGram.toFixed(2) })); // Round to 2 decimal places
        } else {
          console.error('Error: No gold price data found in the response');
        }
      })
      .catch(error => {
        console.error('Error fetching current gold price:', error);
      });
  }, []);
  

  const handleSubmit = (event) => {
    event.preventDefault();
  
    axios.get('https://api.metalpriceapi.com/v1/latest?api_key=0b05ad1cbf937439120798ea84c35c97&base=USD&currencies=EUR,XAU,XAG')
      .then(response => {
        const rates = response.data.rates;
        if (rates && rates.XAU) {
          const currentGoldPriceUSDPerOunce = rates.XAU;
          const goldpriceinusd = 1 / currentGoldPriceUSDPerOunce;
          const currentGoldPriceUSDPerGram = goldpriceinusd / 31.1035;
  
          const value = currentGoldPriceUSDPerGram * row.gram;
          const returns = (currentGoldPriceUSDPerGram * row.gram) - (row.p_price * row.gram);
  
          const updatedRow = {
            ...row,
            c_price: currentGoldPriceUSDPerGram.toFixed(2),
            value: value.toFixed(2),
            returns: returns.toFixed(2),
          };
  
          axios.post('http://localhost:8080/gold', updatedRow)
            .then(res => console.log(res))
            .catch(err => console.error("Error:", err));
        } else {
          console.error('Error: No gold price data found in the response');
        }
      })
      .catch(error => {
        console.error('Error fetching current gold price:', error);
      });
  };
  const handleInput = (event) => {
    const { name, value } = event.target;
    setRow(prev => ({ ...prev, [name]: value }));
    if (name === 'user_id') {
      setRow(prev => ({ ...prev, user_id: value }));
    }
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
                <th>User ID</th>
                <th>Purchase Price($)</th>
                <th>Grams</th>
                <th>Invested Amount($)</th>
                <th>Current Price($/g)</th>
                <th>Current Value($)</th>
                <th>Returns($)</th>
              </tr>
            </thead>
            <tbody>
              <tr key={row.id}>
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
                <td>{row.c_price}</td>
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
