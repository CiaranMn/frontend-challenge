import React from 'react'
import moment from 'moment'

import './App.css'
import spinner from './assets/spinner.gif'
import API from './lib/API'
import NavigationHeader from './components/NavigationHeader'
import HelpModal from './components/HelpModal'
import CalendarGrid from './components/CalendarGrid'

class App extends React.Component {

  constructor() {
    super()
    const today = new Date()
    const monthInView = today
    this.state = {
      today,
      monthInView,
      showHelpModal: false,
      loading: false,
      booked: []
    }
  }

  componentDidMount() {
    const {today} = this.state
    const sixMonthsBack = this.nMonthsBack(today, 6)
    const sixMonthsForward = this.nMonthsForward(today, 6)

    // get a decent range in the first fetch - we will fetch
    // again when the user approaches the end of the range,
    // checking in the handleNextClick/prevClick methods
    this.setState({ loading: true })
    API.requestBookedDates(sixMonthsBack, sixMonthsForward)
      .then(response => 
        this.setState({
          booked: response.payload,
          earliestDateChecked: sixMonthsBack,
          latestDateChecked: sixMonthsForward,
          loading: false 
        })
      )
      .catch(errMsg => this.showModalWithError(errMsg))
  }

  nMonthsBack = (date, n) => {
    return moment(date).subtract(n, 'month').startOf('month')
  }

  nMonthsForward = (date, n) => {
    return moment(date).add(n, 'month').endOf('month')
  }

  handlePrevClicked = () => {
    const { earliestDateChecked } = this.state
    const monthInView = moment(this.state.monthInView).subtract(1, 'month')

    // Check if user has overtaken data and show loading indicator if so
    const loading = moment(monthInView).isBefore(earliestDateChecked)
    this.setState({ 
      monthInView, 
      loading 
    }, () => {   // if user is approaching or beyond fetched data, get more
      if (moment(monthInView).subtract(3, 'month')
          .isBefore(earliestDateChecked)) {
            this.fetchSixMonthsBack()
        }
    })
  }

  fetchSixMonthsBack = () => {
    let { earliestDateChecked } = this.state
    if (!earliestDateChecked) {   // in case initial fetch failed
      earliestDateChecked = moment().endOf('month') 
    }
    const sixMonthsBack = this.nMonthsBack(earliestDateChecked, 6)
    API.requestBookedDates(sixMonthsBack, earliestDateChecked)
      .then(response => {
        this.setState({
          booked: [...response.payload, ...this.state.booked],
          earliestDateChecked: sixMonthsBack,
          loading: false  // we may have set loading true in handlePrevClicked
        })
      })
      .catch(errMsg => this.showModalWithError(errMsg))
  }

  handleNextClicked = () => {
    const { latestDateChecked }= this.state
    const monthInView = moment(this.state.monthInView).add(1, 'month')
    const loading = moment(monthInView).isAfter(latestDateChecked)
    this.setState({ 
      monthInView, 
      loading 
    }, () => {
      if (moment(monthInView).add(3, 'month').isAfter(latestDateChecked)) {
        this.fetchSixMonthsForward()
      }
    })
  }
  
  fetchSixMonthsForward = () => {
    let { latestDateChecked } = this.state
    if (!latestDateChecked) {   // in case initial fetch failed
      latestDateChecked = moment().endOf('month')
    }
    const sixMonthsForward = this.nMonthsForward(latestDateChecked, 6)
    API.requestBookedDates(latestDateChecked, sixMonthsForward)
      .then(response => {
        this.setState({
          booked: [...this.state.booked, ...response.payload],
          latestDateChecked: sixMonthsForward,
          loading: false
        })
      })
      .catch(errMsg => this.showModalWithError(errMsg))
  }

  requestChangeDateStatus = (date, newBookedStatus) => {
    if (date.day() === 0) { 
      return this.setState({
        showHelpModal: true,
        helpText: "Sorry, you aren't able to change the booking status of Sundays."
      })
    } 
    this.setState({ loading: true }, () => {
      API.requestChangeDateStatus(date, newBookedStatus)
        .then(resp => {
          if (!!resp.ok) {
            let booked = newBookedStatus ? // has it been booked or unbooked?
              [...this.state.booked, date.format()]
              :
              this.state.booked.filter(d => !moment(d).isSame(date, 'day'))
            this.setState({
              booked,
              loading: false
            })
          }
      }).catch(errMsg => this.showModalWithError(errMsg))
    })
  }

  showModalWithError = errMsg => {
    this.setState({
      showHelpModal: true,
      helpText: errMsg,
      loading: false,
    })
  }

  clearAndCloseModal = () => {
    this.setState({
      showHelpModal: false,
      helpText: ''
    })
  }

  render() {

    const {
      monthInView, 
      booked, 
      today, 
      loading,
      showHelpModal, 
      helpText
    } = this.state

    return (
      <div className="app">

        {showHelpModal && 
          <HelpModal 
            helpText={helpText}
            close={this.clearAndCloseModal}
          />
        }

        {loading && 
          <img src={spinner} className="spinner" alt="loading indicator"/>
        }

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