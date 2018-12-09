import React from 'react'
import moment from 'moment'

import './App.css'

import API from './lib/API'
import {NavigationHeader} from './components/NavigationHeader'
import CalendarGrid from './components/CalendarGrid'

class App extends React.Component {

  constructor() {
    super()
    const today = new Date()

    const monthInView = today
    this.state = {
      today,
      monthInView
    }
  }

  componentDidMount() {
    const {today} = this.state
    const sixMonthsBack = this.nMonthsBack(today, 6)
    const sixMonthsForward = this.nMonthsForward(today, 6)

    // get a decent range in the first fetch - we will fetch
    // again when the user approaches the end of the range,
    // checking in the handleNextClick/prevClick methods
    API.requestBookedDates(sixMonthsBack, sixMonthsForward)
      .then(response => 
        this.setState({
          booked: response.payload,
          earliestDateChecked: sixMonthsBack,
          latestDateChecked: sixMonthsForward 
        })
      ).catch(errorMsg => console.log('Error at 35', errorMsg))
  }

  nMonthsBack = (date, n) => {
    return moment(date).subtract(n, 'month').startOf('month')
  }

  nMonthsForward = (date, n) => {
    return moment(date).add(n, 'month').endOf('month')
  }

  handlePrevClicked = () => {
    const monthInView = moment(this.state.monthInView).subtract(1, 'month')
    this.setState({ monthInView }, () => {
      if (moment(monthInView).subtract(3, 'month')
        .isBefore(this.state.earliestDateChecked)) {
          this.fetchSixMonthsBack()
      }
    })
  }

  fetchSixMonthsBack = () => {
    const { earliestDateChecked } = this.state
    const sixMonthsBack = this.nMonthsBack(earliestDateChecked, 6)
    API.requestBookedDates(sixMonthsBack, earliestDateChecked)
      .then(response => {
        this.setState({
          booked: [...response.payload, ...this.state.booked],
          earliestDateChecked: sixMonthsBack
        })
      }).catch(err => console.log(err))
  }

  handleNextClicked = () => {
    const monthInView = moment(this.state.monthInView).add(1, 'month')
    this.setState({ monthInView }, () => {
      if (moment(monthInView).add(3, 'month')
        .isAfter(this.state.latestDateChecked)) {
        this.fetchSixMonthsForward()
      }
    })
  }
  
  fetchSixMonthsForward = () => {
    const { latestDateChecked } = this.state
    const sixMonthsForward = this.nMonthsForward(latestDateChecked, 6)
    API.requestBookedDates(latestDateChecked, sixMonthsForward)
      .then(response => {
        this.setState({
          booked: [...this.state.booked, ...response.payload],
          latestDateChecked: sixMonthsForward
        })
      }).catch(err => console.log(err))
  }

  requestChangeDateStatus = (date, newBookedStatus )=> {
    API.requestChangeDateStatus(date, newBookedStatus)
      .then(resp => {
        if (!!resp.ok) {
          let booked = newBookedStatus ? 
            [...this.state.booked, date.format()]
            :
            this.state.booked.filter(d => !moment(d).isSame(date, 'day'))
          this.setState({
            booked
          })
        }
    }).catch(err => console.log(err))
  }

  render() {

    const {monthInView, booked, today} = this.state

    return (
      <div className="app">
        <header className="app-header">
          Spare Room
        </header>
        <div className="main-container">
          <NavigationHeader
            prevText={
              moment(monthInView).subtract(1, 'month').format('MMM YYYY')
            }
            centerText={
              moment(monthInView).format('MMMM YYYY')
            }
            nextText={
              moment(monthInView).add(1, 'month').format('MMM YYYY')
            }
            handlePrevClicked={this.handlePrevClicked}
            handleNextClicked={this.handleNextClicked}
          />
          <CalendarGrid 
            monthInView={monthInView}
            booked={booked}
            today={today}
            requestChangeDateStatus={this.requestChangeDateStatus}
          />
        </div>
      </div>

    )
  }
}

export default App