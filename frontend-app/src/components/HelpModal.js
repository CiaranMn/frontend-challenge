import React from 'react'

import './HelpModal.css'

const HelpModal = ({error, helpText, close}) => {

  return (
    <div className='modal'>

      <span class="close" onClick={close}>&times;</span>

      
      <div className='modal-content'>
        {helpText}
      </div>

    </div>
  )
}

export default HelpModal