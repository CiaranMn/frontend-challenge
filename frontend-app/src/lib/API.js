import moment from 'moment'

export default class API {

  static init() {
    this.baseUrl = "http://localhost:3000"
    this.getBookedDates = this.getBookedDates.bind(this)
    this.changeDateStatus = this.changeDateStatus.bind(this)
  }

  // expects requests for booked dates to enter via this method
  // to provide validation of dates before passing onwards
  static requestBookedDates(startDate, endDate) {
    if (!moment(startDate).isValid() || !startDate) {
      return Promise.reject('No valid start date for the request supplied.')
    } 
    else if (!moment(endDate).isValid() || !endDate) {
      return Promise.reject('No valid end date for the request supplied.')
    } 
    else {
      const start = moment(startDate).format('YYYY-MM-DD')
      const end = moment(endDate).format('YYYY-MM-DD')
      return this.getBookedDates({start, end})
    }
  }

  // called if validations pass - attempt a fetch and pass the response
  // to the generic response handler, with the function itself as callback
  // in case further attempts need to be made following server failure.
  // the arguments specific to this particular method are bundled in an object
  // to allow the response handler to be agnostic as to what is calling it.
  static getBookedDates(dates, attempt = 1) {
    const {start, end} = dates
    return fetch(this.baseUrl + `/reserved/${start}/${end}`)
      .then(response => 
        this.handleServerResponse(
          response, 
          this.getBookedDates, 
          dates, 
          attempt
        )
    ).catch(err => Promise.reject(this.parseError(err)))
  }

  // the same pattern is followed here - a validation and formatting gateway
  static requestChangeDateStatus(dateToChange, newStatus) {
    if (!moment(dateToChange).isValid()) {
      return Promise.reject('The date supplied is not valid.')
    } 
    else {
      const date = moment(dateToChange).format('YYYY-MM-DD')
      return this.changeDateStatus({
        date,
        newStatus
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
    ).catch(err => Promise.reject(this.parseError(err)))
  }

  // this deals with the responses for both the get and put methods
  static handleServerResponse(response, requestFunction, argsObject, attempt) {
    if (response.status === 500) {
      if (attempt >= 8) {
        // At a 10% expected failure rate there's a 1 in 10mil chance of
        // failing 7 times and user has been waiting 10s+ - give up for now.
        return Promise.reject({message: 'Too many attempts'})
      } else {
        return requestFunction(argsObject, attempt + 1)
      }
    }
    else if (response.status === 400) {
      // date validation should not fail unless requestX methods are bypassed
      return Promise.reject({message: 'Invalid date(s)'})
    }
    else {
      return Promise.resolve(response.json())
    }
  }

  // 
  static parseError(error) {
    if (error.message === 'Failed to fetch') {
      return "Unable to connect to the server at the moment - please check your connection or try again in a few minutes."
    } else if (error.message === 'Too many attempts') {
      return "The server is having some issues at the moment - please try again in a few minutes"
    } else if (error.message === 'Invalid date(s)') {
      return "Invalid dates were supplied to the server - if this keeps happening please contact support."
    } else {
      return "Something's gone wrong - please try again in a few minutes. If this happens again, please contact support."
    }
  }

}

API.init()