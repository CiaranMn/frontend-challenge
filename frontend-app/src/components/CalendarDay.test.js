import React from 'react'
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import { shallow } from 'enzyme'

import CalendarDay from './CalendarDay'

configure({ adapter: new Adapter() })

const date = new Date(2019, 0, 12)

const wrapper = shallow(
  <CalendarDay
    date={date}
    handleClicked={() => {}}
    isSunday={false}
    isBooked={true}
    isToday={false}
    isDisabled={false}
    mobile={true}
  />
)

describe('<CalendarDay> displays the status of different days', () => {

  it('Makes it obvious which days are booked', () => {
    wrapper.setProps({isBooked: true})
    expect(wrapper.find('div').hasClass('booked')).toEqual(true)
  })

  it('Makes it obvious which days are disabled for interaction', () => {
    wrapper.setProps({ isDisabled: true })
    expect(wrapper.find('div').hasClass('disabled')).toEqual(true)
  })


})