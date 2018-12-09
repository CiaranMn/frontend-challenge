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
    const currentView = today
    this.state = {
      today,
      currentView
    }
  }

  componentDidMount() {
    const {today} = this.state
    const threeMonthsBack = this.nMonthsBack(today, 3)
    const sixMonthsForward = this.nMonthsForward(today, 6)

    // get a decent range in the first fetch so the client doesn't
    // have to wait for further fetches while browsing 
    // - assumes usage calls more for looking at future dates
    API.requestBookedDates(threeMonthsBack, sixMonthsForward)
      .then(response => 
        this.setState({
          booked: response.payload
        })
      ).catch(errorMsg => console.log('Error at 35', errorMsg))
  }

  nMonthsBack = (date, n) => {
    // the first day of the nth month before a given date
    return new Date(date.getFullYear(), date.getMonth() - n, 1)
  }

  nMonthsForward = (date, n) => {
    // the last day of the nth month after a given date
    return new Date(date.getFullYear(), date.getMonth() + (n + 1), 0)   
  }

  handlePrevClicked = () => {
    const currentView = moment(this.state.currentView).subtract(1, 'month')
    this.setState({
      currentView
    })
  }

  handleNextClicked = () => {
    const currentView = moment(this.state.currentView).add(1, 'month')
    this.setState({
      currentView
    })
  }

  render() {

    const {currentView, booked, today} = this.state

    return (
      <div className="app">
        <header className="app-header">
          Spare Room
        </header>
        <div className="main-container">
          <NavigationHeader
            prevText={
              moment(currentView).subtract(1, 'month').format('MMM YYYY')
            }
            centerText={
              moment(currentView).format('MMMM YYYY')
            }
            nextText={
              moment(currentView).add(1, 'month').format('MMM YYYY')
            }
            handlePrevClicked={this.handlePrevClicked}
            handleNextClicked={this.handleNextClicked}
          />
          <CalendarGrid 
            currentView={currentView}
            booked={booked}
            today={today}
          />
        </div>
      </div>

    )
  }
}

export default App