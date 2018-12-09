import React from 'react'
import moment from 'moment'

const CalendarDay = ({
  isToday, 
  isBooked, 
  isDisabled, 
  date, 
  handleClicked,
  mobile
}) => {

  return (
    <div onClick={date => handleClicked(date)}
      className={
        'calendar-day grid-cell '
        + (isToday && ' today ')
        + (isBooked && !isDisabled && ' booked ')
        + (!isBooked && !isDisabled && ' unbooked ')
        + (isDisabled && ' disabled ')
     }>
      {mobile
        ?
        moment(date).format('ddd D MMM YYYY')
        :
        moment(date).date()
      }
    </div>
  )
}

export default CalendarDay