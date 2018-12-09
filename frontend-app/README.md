# Front End Technical Challenge - Implementation (Ciaran Morinan)

## Installation

The soure code for the app is in `/frontend-app` with the public build in `/frontend-app/public`

To run in development mode type `npm start` or `yarn start` while in the `/frontend-app` directory.

To run tests `npm test` or `yarn test` while in the `/frontend-app` directory.

Open `index.html` in `/frontend-app/build` for the compiled version
##
## Dependencies / tools

- React framework
- moment for formatting and querying dates
- ESLint as linter using the default `create-react-app` rules
- yarn as package manager
- jest as test runner with fetch-mock for mocking the server and enzyme for React component testing.

##
## Notes on requirements

1. The client should be able to check the calendar to see which nights are booked for any given month. Each day on the calendar should correspond to the night following that day, (eg. the 4th Feb represents the night from 4th-5th Feb).

2. It should be made obvious which days are reserved/free.

3. The client should be able to toggle the availability of a night by clicking/tapping that day.

4. The app should save and fetch changes to and from the attached server.

5. The server is unreliable and sometimes slow. There is a 10% chance of receiving a HTTP 500. The app should handle this and show a loading indicator whilst waiting for responses.

6. Though the API will allow it, you should not be able to place bookings for Sunday nights.

7. The app only needs to record which dates are booked, no other information is necessary.

8. The app should be responsive and loosely mirror the attached wireframes on desktop and mobile.

9. Please compile your JS so it works across modern browsers and use a linter.

##
## Potential improvements / optimisations

