import React from 'react'
import moment from 'moment'

import './App.css'

import API from './lib/API'
import {NavigationHeader} from './components/NavigationHeader'

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
    // - assumes usage calls for looking forward more than back
    API.requestReservedDates(threeMonthsBack, sixMonthsForward)
      .then(reserved => this.setState({reserved}))
      .catch(errorMsg => alert(errorMsg))
  }

  nMonthsBack = (date, n) => {
    // the first day of the nth month before a given date
    return new Date(date.getFullYear(), date.getMonth() - n, 1)
  }

  nMonthsForward = (date, n) => {
    // the last day of the nth month after a given date
    return new Date(date.getFullYear(), date.getMonth() + (n + 1), 0)   
  }

  render() {

    const {today, currentView} = this.state

    return (
      <div className="App">
        <header className="App-header">
           Spare Room
        </header>
        <main className="calendar-container">
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
            handlePrevClicked={() => this.handlePrevClicked}
            handleNextClicked={() => this.handleNextClicked}
          />
        
        </main>
      </div>

    )
  }
}

export default App