import React from 'react'
import moment from 'moment'

const CalendarDay = ({
  isToday, 
  isBooked, 
  isDisabled, 
  isSunday,
  date, 
  handleClicked,
  mobile
}) => {

  return (
    <div onClick={() => !isDisabled && handleClicked(date)}
      className={
        'calendar-day grid-cell '
        + (isToday && ' today ')
        + (isBooked && ' booked ')
        + (!isBooked && !isDisabled && !isSunday && ' unbooked ')
        + (isDisabled && ' disabled ')
        + (isSunday && ' sunday ')
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