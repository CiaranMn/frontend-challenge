import React from 'react'

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