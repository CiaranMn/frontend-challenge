import moment from 'moment'

export default class API {

  static init() {
    this.baseUrl = "http://localhost:3000"
    this.getReservedDates = this.getReservedDates.bind(this)
    this.changeDateStatus = this.changeDateStatus.bind(this)
  }

  // expects requests for reserved dates to enter via this method
  // to provide validation of dates before passing onwards
  static requestReservedDates(startDate, endDate) {
    if (!moment(startDate).isValid()) {
      return Promise.reject('The start date supplied is not valid.')
    } 
    else if (!moment(endDate).isValid()) {
      return Promise.reject('The end date supplied is not valid.')
    } 
    else {
      const start = moment(startDate).format('YYYY-MM-DD')
      const end = moment(endDate).format('YYYY-MM-DD')
      return this.getReservedDates({start, end})
    }
  }

  // called if validations pass - attempt a fetch and pass the response
  // to the generic response handler, with the function iteslf as callback
  // in case further attempts need to be made following server failure
  static getReservedDates(dates, attempt = 1) {
    const {start, end} = dates
    return fetch(this.baseUrl + `/reserved/${start}/${end}`)
      .then(response => 
        this.handleServerResponse(
          response, 
          this.getReservedDates, 
          dates, 
          attempt
        )
    ).catch(() => Promise.reject("The server can't be reached at the moment - please try again in a few minutes."))
  }

  static requestChangeDateStatus(dateToChange, newStatus) {
    if (!moment(dateToChange).isValid()) {
      return Promise.reject('The date supplied is not valid.')
    } 
    else {
      const date = moment(dateToChange).format('YYYY-MM-DD')
      return this.changeDateStatus({
        date, reservation: newStatus
      })
    }
  }

  static changeDateStatus(reservationData, attempt = 1) {
    const {date, newStatus} = reservationData
    return fetch(this.baseUrl + `/reserved/${date}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reserved: newStatus
      })
    }).then(response =>
        this.handleServerResponse(
          response,
          this.changeDateStatus,
          reservationData,
          attempt
       )
    ).catch(() => Promise.reject("The server can't be reached at the moment - please try again in a few minutes."))
  }

  static handleServerResponse(response, requestFunction, argsObject, attempt) {
    if (response.status === 500) {
      if (attempt >= 8) {
        // At a 10% expected failure rate there's a 1 in 10mil chance of
        // failing 7 times and user has been waiting 10s+ - give up for now.
        return Promise.reject("The server is experiencing issues at the moment - please try again in a few minutes.")
      } else {
        return requestFunction(argsObject, attempt + 1)
      }
    }
    else if (response.status === 400) {
      // date validation should not fail unless requestX methods are bypassed
      return Promise.reject('Invalid date(s) supplied to server.')
    }
    else {
      return Promise.resolve(response.json())
    }
  }

}

API.init()