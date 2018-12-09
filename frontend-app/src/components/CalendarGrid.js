import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'

import CalendarDay from './CalendarDay'
import './CalendarGrid.css'

export default class CalendarGrid extends React.Component {

  constructor() {
    super()
    const mobile = window.matchMedia("screen and (max-width: 600px)").matches
    this.state = ({ mobile })
  }

  componentDidMount() {
    window.addEventListener('resize', this.checkSize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkSize)
  }

  checkSize = () => {
    const mobile = window.matchMedia("screen and (max-width: 600px)").matches
    if (this.state.mobile !== mobile) {
      this.setState({
        mobile
      })
    }
  }

  renderWeekDayHeader = () => {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      .map(day =>
        <div className='week-day-header grid-cell' key={day}>
          {day}
        </div>
    )
  }

  mapAndRenderDates = () => {
    const {monthInView, today} = this.props 
    const { mobile } = this.state
    let dates = []

    const monthStart = moment(monthInView).startOf('month')
    const monthEnd = moment(monthInView).endOf('month')
    const leadingSunday = moment(monthStart).startOf('week')
    const trailingSaturday = moment(monthEnd).endOf('week')
    // we will only show the few days either side of the month
    // on a non-mobile browser
    for (
      let date = moment(mobile ? monthStart : leadingSunday);
      date.isBefore(mobile ? monthEnd : trailingSaturday); 
      date.add(1, 'days')
    ) {
      dates.push(moment(date))
    }
    return dates.map(date => 
      <CalendarDay 
        date={date}
        key={date}
        handleClicked={this.dateClicked}
        mobile={mobile}
        isSunday={date.day() === 0}
        isBooked={!!this.isDateBooked(date)}
        isToday={!!this.doDatesMatch(date, today)}
        isDisabled={
          moment(date).isBefore(monthStart) 
          || 
          moment(date).isAfter(monthEnd)
        }
       />
      )
  }

  doDatesMatch = (firstDate, secondDate) => {
    return moment(firstDate).isSame(secondDate, 'day')
  }

  isDateBooked = date => {
    const { booked } = this.props
    return booked.find(bookedDate =>
      this.doDatesMatch(bookedDate, date)
    )
  }

  dateClicked = date => {
    this.props.requestChangeDateStatus(
      date, 
      !this.isDateBooked(date)  // API expects true or false for new status
    )
  }

  render() {

    const {mobile} = this.state

    return (

      <div className='calendar-grid'>
        {!mobile ? this.renderWeekDayHeader() : null}
        {this.mapAndRenderDates()}
      </div>

    )
  }
}

CalendarGrid.propTypes = {
  monthInView: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(moment)
  ]).isRequired,
  today: PropTypes.oneOfType([
    PropTypes.instanceOf(Date), 
    PropTypes.instanceOf(moment)
  ]).isRequired,
  booked: PropTypes.array.isRequired,
  requestChangeDateStatus: PropTypes.func.isRequired
}