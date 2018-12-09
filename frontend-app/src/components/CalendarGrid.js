import React from 'react'
import moment from 'moment'

import CalendarDay from './CalendarDay'
import './CalendarGrid.css'

export default class CalendarGrid extends React.Component {

  constructor() {
    super()
    const mobile = window.matchMedia("(screen and max-width: 600px)").matches
    this.state = ({
      mobile
    })
  }

  componentDidMount() {
    this.setState({
      throttled: false
    })
    window.addEventListener('resize', () => {
      if (!this.state.throttled) {
        this.checkSize()
        this.setState({
          throttled: true
        }, () => setTimeout(() =>
          this.setState({throttled: false}),
          300
        ))
      }
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkSize)
  }

  checkSize = () => {
    const mobile = window.matchMedia("(max-width: 600px)").matches
    if (this.state.mobile !== mobile) {
      this.setState({
        mobile
      })
    }
  }

  renderWeekDayHeader = () => {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      .map(day =>
        <div className='week-day-header grid-cell'>
          {day}
        </div>
    )
  }

  mapAndRenderDates = () => {
    const {monthInView, booked, today} = this.props 
    const { mobile } = this.state
    let dates = []
    const monthStart = moment(monthInView).startOf('month')
    const monthEnd = moment(monthInView).endOf('month')
    const leadingSunday = moment(monthStart).startOf('week')
    const trailingSaturday = moment(monthEnd).endOf('week')
    for (
      let date = moment(leadingSunday);
      date.isBefore(trailingSaturday); 
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
        isBooked={booked && this.isDateBooked(date)}
        isToday={this.doDatesMatch(date, today)}
        isDisabled={
          moment(date).isBefore(monthStart) 
          || 
          moment(date).isAfter(monthEnd)
          ||
          date.day() === 0
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
      !this.isDateBooked(date)
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