import React from 'react'

import './NavigationHeader.css'

const NavigationHeader = ({
  prevText,
  centerText,
  nextText,
  handlePrevClicked,
  handleNextClicked
}) => {

  return (

    <div className='nav-header'>

      <div className='block-link prev' onClick={handlePrevClicked}>
        &lt; {prevText}
      </div>

      <div className='center'>
        {centerText}
      </div>

      <div className='block-link next' onClick={handleNextClicked}>
        {nextText} &gt;
      </div>
    
    </div>

  )
}

export default NavigationHeader