import React from 'react'
import PropTypes from 'prop-types'

import './HelpModal.css'

const HelpModal = ({error, helpText, close}) => {

  return (
    <div className='modal'>

      <span className="close" onClick={close}>&times;</span>
      <div className='modal-content'>
        {helpText}
        {error && ' If this keeps happening, please contact support.'}
      </div>

    </div>
  )
}

export default HelpModal

HelpModal.propTypes = {
  helpText: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  error: PropTypes.bool,
}