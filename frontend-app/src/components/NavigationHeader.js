import React from 'react'
import PropTypes from 'prop-types'

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

NavigationHeader.propTypes = {
  prevText: PropTypes.string.isRequired,
  centerText: PropTypes.string.isRequired,
  nextText: PropTypes.string.isRequired,
  handlePrevClicked: PropTypes.func.isRequired,
  handleNextClicked: PropTypes.func.isRequired
}