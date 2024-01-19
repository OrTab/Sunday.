import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DayPickerRangeController } from 'react-dates';

import { useEffect, useState } from 'react'

export const DatePicker = ({ closeDatePicker, changeDates }) => {

  const [dates, setDates] = useState({ startDate: null, endDate: null })
  const [focusedInput, setFocusedInput] = useState('startDate')
  const [isStartDateOnly, setIsStartDateOnly] = useState(false)

  const handleChange = () => {
    if (dates.startDate?._d && dates.endDate?._d) changeDates({ startDate: dates.startDate?._d, endDate: dates.endDate?._d })
    if (dates.startDate?._d && !dates.endDate?._d && !focusedInput) {
      changeDates({ startDate: dates.startDate?._d, endDate: null })
    }
  }

  useEffect(() => {
    if (dates.startDate?._d && !dates.endDate?._d && isStartDateOnly) {
      changeDates({ startDate: dates.startDate?._d, endDate: null })
      setIsStartDateOnly(false)
    }

    if (!focusedInput) closeDatePicker()

    handleChange()
    return () => {
    }
  }, [dates, focusedInput,isStartDateOnly])

  return (
    <div className="datePicker">
      <DayPickerRangeController
        startDate={dates.startDate} // momentPropTypes.momentObj or null,
        endDate={dates.endDate} // momentPropTypes.momentObj or null,
        isOutsideRange={() => false}
        onDatesChange={({ startDate, endDate }) => setDates({ startDate, endDate })}
        focusedInput={focusedInput}
        hideKeyboardShortcutsPanel={true}
        onFocusChange={focusedInput => {
          setFocusedInput(focusedInput)
        }}
      />
      <button className="date-btn" onClick={() => setIsStartDateOnly(true)}>Set</button>

    </div>
  )
}


