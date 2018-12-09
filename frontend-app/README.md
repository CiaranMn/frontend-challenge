# Front End Technical Challenge - Implementation (Ciaran Morinan)

## Installation

The soure code for the app is in `/frontend-app` with the public build in `/frontend-app/public`

To run in development mode type `npm start` or `yarn start` while in the `/frontend-app` directory.

To run tests `npm test` or `yarn test` while in the `/frontend-app` directory.

Open `index.html` in `/frontend-app/build` for the compiled version.
##
## Dependencies / tools

- React framework
- moment for formatting and querying dates
- ESLint as linter using the default `create-react-app` rules
- yarn as package manager
- jest as test runner with fetch-mock for mocking the server and enzyme for React component testing.

##
## Notes on specific points of implementation

*The server is unreliable and sometimes slow. There is a 10% chance of receiving a HTTP 500. The app should handle this and show a loading indicator whilst waiting for responses.*

- This is implemented, with a limit of 8 consecutive attempts before giving up and displaying a message to the user that the server is temporarily unavailable - at that point, the likelihood is that the server has (at least temporarily) become completely unable to resolve requests.

*Though the API will allow it, you should not be able to place bookings for Sunday nights.*
- The app will prevent the user altering the booking status of a Sunday night (and display a message to the user indicating they are unable to do so), but in the event that the server API provides data which includes a Sunday as being booked, it will be displayed as such to the user - and they will be unable to change it.
- This implementation seemed preferable to not marking a Sunday as being booked even if the server indicates it as being so - it may be that another client application or user is able to make Sunday bookings, and if so, this user would presumably want to be aware.

##
## Potential improvements / optimisations

- Once booked data is retrieved for a given date, it is never refreshed - if anyone else is likely to be altering the booked data at the same time as the client, a periodic refresh would be worthwhile.
- The API class expects requests to come to it via one of two methods so it can validate and format data correctly, but its other methods remain exposed - it could be made more robust by being refactored to an immediately-invoked function expression which only returns those two public functions.
- Although the app as it stands is not going to trouble anyone's bandwidth or memory, if it was to be scaled up (e.g. to manage thousands of spare rooms concurrently), it would be worth tailoring how fetches are made to ensure that unnecessary trips to the API are not being made. The app also makes heavy use of `moment` instances which come at a higher cost than `Date` and would be worth investigating for performance implications at scale.
- Better test coverage.
- Design!
