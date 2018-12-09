import React from 'react'
import PropTypes from 'prop-types'

import './HelpModal.css'

const HelpModal = ({helpText, close}) => {

  return (
    <div className='modal'>

      <span className="close" onClick={close}>&times;</span>
      <div className='modal-content'>
        {helpText}
      </div>

    </div>
  )
}

export default HelpModal

HelpModal.propTypes = {
  helpText: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired
}