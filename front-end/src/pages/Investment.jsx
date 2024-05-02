import React from 'react'
import "../Styles/Investment.css"
import { Link } from 'react-router-dom'

function Investment() {
  return (
    <div className='investment'>
        <div className='quesans'>
            <p>Ques. What is Investment?</p>
            <p>
Ans. Investment is the allocation of money or resources into assets with the expectation of generating income or profit. It involves the purchase of financial instruments such as stocks, bonds, or real estate, with the goal of achieving future financial returns. Investors analyze risks and potential rewards to make informed decisions, aiming to grow their wealth over time through strategic allocation and management of their assets. Effective investment strategies often involve diversification and long-term planning to mitigate risks and maximize returns.</p>
        </div>
        <div className='offer'>
            <h1>Our Website offers Two Types of Investment:-</h1>
            <div className='investbutt'>
                <Link to="/equity">
                <button>Equity</button>
                </Link>
                <Link to="/gold">
                <button>Gold</button>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default Investment
