import React from 'react'
// import { configure } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16'
import { shallow } from 'enzyme'

import CalendarGrid from './CalendarGrid'
import CalendarDay from './CalendarDay'

configure({ adapter: new Adapter() })

const monthInView = new Date(2019,0,14)
const today = new Date(2019,0,1)
const booked = [
  new Date(2019, 0, 12), 
  new Date(2019, 0, 15), 
  new Date(2019, 0, 17),
  new Date(2019, 0, 20)  
]

Object.defineProperty(window, "matchMedia", {
  value: jest.fn(() => { return { matches: false } })
})

const wrapper = shallow(
  <CalendarGrid
    monthInView={monthInView}
    booked={booked}
    today={today}
    requestChangeDateStatus={() => { }} />
)

describe('<CalendarGrid> generates the calendar correctly', () => {

  it('Generates leading and trailing days on desktop', () => {
    wrapper.setState({mobile: false})
    expect(wrapper.find(CalendarDay)).toHaveLength(35)
  })

  it('Only generates days of the current month on mobile', () => {
    wrapper.setState({mobile: true})
    expect(wrapper.find(CalendarDay)).toHaveLength(31)
  })

  it('Correctly identifies booked dates', () => {
    expect(wrapper.find({isBooked: true})).toHaveLength(4)
  })


})