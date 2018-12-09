import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'

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
          // disabled days are those leading and trailing days outside
          // of the current month - don't do anything on clicking them.
          // Sundays in the current month will be let through to be caught
          // in App.js and a help modal displayed.
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

CalendarDay.propTypes = {
  isToday: PropTypes.bool.isRequired,
  isBooked: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isSunday: PropTypes.bool.isRequired,
  mobile: PropTypes.bool.isRequired,
  date: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(moment)
  ]).isRequired,
  handleClicked: PropTypes.func.isRequired,

}
