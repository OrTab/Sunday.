import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DayPickerRangeController } from 'react-dates';

import React, { Component } from 'react'

export class DatePicker extends Component {

  state = {
    startDate: null,
    endDate: null,
    focusedInput: 'startDate'
  }

  handleChange = () => {
    const { startDate, endDate, focusedInput } = this.state
    if (startDate?._d && endDate?._d) this.props.changeDates({ startDate: startDate?._d, endDate: endDate?._d })
    if (startDate?._d && !endDate?._d && !focusedInput) {
      this.props.changeDates({ startDate: startDate?._d, endDate: null })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { startDate, endDate, focusedInput } = this.state
    if (startDate?._d && !endDate?._d && !focusedInput) {
      this.props.changeDates({ startDate: startDate?._d, endDate: null })
    }
  }


  render() {
    const { /* startDate, endDate, cardId, */ closeDatePicker } = this.props
    return (
      <div className="datePicker">
          <DayPickerRangeController
            startDate={this.state.startDate} // momentPropTypes.momentObj or null,
            endDate={this.state.endDate} // momentPropTypes.momentObj or null,
            isOutsideRange={() => false}
            onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate }, this.handleChange)}
            focusedInput={this.state.focusedInput}
            hideKeyboardShortcutsPanel={true}
            onFocusChange={focusedInput => {
              this.setState({ focusedInput })
            }}
          />
          <button className="date-btn" onClick={()=>this.setState({focusedInput:null},closeDatePicker)}>Set</button>

      </div>
    )
  }
}
