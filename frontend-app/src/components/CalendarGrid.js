import React from 'react'
import moment from 'moment'

import './CalendarGrid.css'

export default class CalendarGrid extends React.Component {

  constructor() {
    super()
    const mobile = window.matchMedia("(screen and max-width: 600px)").matches
    this.state = ({mobile})
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
          200
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

  buildDatesArrayThenRender = () => {
    const {currentView} = this.props 
    let dates = []
    const monthStart = moment(currentView).startOf('month')
    const monthEnd = moment(currentView).endOf('month')
    for (let m = moment(monthStart); m.isBefore(monthEnd); m.add(1, 'days')) {
      dates.push(moment(m))
    }
    return this.renderCalendarDates(dates)
  }

  renderCalendarDates = dates => {
    const {mobile} = this.state
    const {reserved, today} = this.props
    return dates.map(date => {
      const isReserved = reserved && this.isDateReserved(date)
      const isToday = this.doDatesMatch(date, today)
      return (
        <div className='calendar-day grid-cell'>
          <div className='reserved-text'>
            {isReserved && 'RESERVED'}
          </div>
          <div>
            {mobile 
              ? 
              moment(date).format('ddd D MMM YYYY') 
              : 
              moment(date).date() 
            }
          </div>
        </div>
      )
    })
  }

  doDatesMatch = (firstDate, secondDate) => {
    return moment(firstDate).isSame(secondDate, 'day')
  }

  isDateReserved = date => {
    const { reserved } = this.props
    return reserved.find(reservedDate =>
      this.doDatesMatch(reservedDate, date)
    )
  }

  render() {

    const {mobile} = this.state

    return (

      <div className='calendar-grid'>
        {!mobile ? this.renderWeekDayHeader() : null}
        {this.buildDatesArrayThenRender()}
      </div>

    )
  }
}