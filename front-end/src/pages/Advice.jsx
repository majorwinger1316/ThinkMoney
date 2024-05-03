import React from 'react'
import Typewriter from 'typewriter-effect';
import "../Styles/Advice.css"

function Advice() {
  return (
    <div className='advice'>
<Typewriter
  options={{
    strings: ['Coming Soon.', 'Cooking The correct way!'],
    autoStart: true,
    loop: true,
    wrapperClassName: 'typer',
    cursorClassName: 'cursor'

  }}
/>
    </div>
  )
}

export default Advice
