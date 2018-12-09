import API from './API'

import fetchMock from 'fetch-mock'

const startDate = new Date(2018, 1, 1)
const endDate = new Date(2018, 12, 30)
const badDate = '2018-13-40'

const getUrl = /reserved\/\d{4}[-]\d{2}[-]\d{2}\/\d{4}[-]\d{2}[-]\d{2}/
const putUrl = /reserved\/\d{4}[-]\d{2}[-]\d{2}/

const payload = ["2018-02-14T00:00:00+00:00", "2018-02-28T00:00:00+00:00", "2018-03-15T00:00:00+00:00", "2018-03-16T00:00:00+00:00"] 

fetchMock
  .mock('*', { status: 500 }, { repeat: 3 } )
  .get(getUrl, { payload }, { sendAsJson: true })
  .put(putUrl, () => {
    const bodyObj = JSON.parse(fetchMock.lastOptions().body)
    if (!!bodyObj.reserved) {
      return { ok: true }
      }
    }, { sendAsJson: true }
    )

describe('the API deals with server issues', () => {

  test('the API retries when it receives a 500 status', () => {
    expect.assertions(1)
    return expect(API.requestBookedDates(startDate, endDate))
      .resolves.toEqual(expect.anything())
  })

})

describe('the API formats and passes requests correctly', () => {

  test('the API rejects invalid dates', () => {
    expect.assertions(1)
    return expect(API.requestBookedDates(badDate))
      .rejects.toEqual('No valid start date for the request supplied.')
  })

  test('the API formats the GET URL correctly', () => {
    expect.assertions(1)
    return API.requestBookedDates(startDate, endDate)
      .then(() => expect(fetchMock.called(getUrl)).toEqual(true)
    )
  })

  test('the API gets booked data from the server', () => {
    expect.assertions(1)
    return expect(API.requestBookedDates(startDate, endDate))
      .resolves.toEqual({ payload })
  })

  test('the API formats the PUT URL correctly', () => {
    expect.assertions(1)
    return API.requestChangeDateStatus(startDate, true)
      .then(() => expect(fetchMock.called(putUrl)).toEqual(true)
      )
  })

  test('the API puts data to the server correctly', () => {
    expect.assertions(1)
    return expect(API.requestChangeDateStatus(startDate, true))
      .resolves.toEqual({ ok: true })
  })
  
})

