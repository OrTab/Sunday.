import React, { Component } from 'react'
import { utilService } from '../services/utilService'

export class ProgressBar extends Component {
    state = {

    }

    checkDueDate = (startDate, endDate) => {
        let progressVal;
        const start = new Date(startDate).getTime()
        const today = new Date().getTime()
        const end = new Date(endDate).getTime()
        if (startDate && endDate && start > today) return 0
        else if (!endDate && startDate && start > today) {
            const { createdAt } = this.props
            const timePassed = Math.abs(today - createdAt)
            progressVal = Math.round(timePassed * 100 / start)

            return progressVal
        }
        else if (!endDate && startDate && start < today) return 100

        const timePassed = Math.abs(today - start)
        const range = Math.abs(end - start)
        progressVal = Math.round(timePassed * 100 / range)
        return progressVal
    }

    render() {
        const { startDate, endDate, groupColor } = this.props
        const startMonth = new Date(startDate).getMonth()
        const startDay = new Date(startDate).getDate()
        const startDateForDisplay = utilService.getNameOfMonth(startMonth) + ' ' + startDay
        const endMonth = new Date(endDate).getMonth()
        const endDay = new Date(endDate).getDate()
        const endDateForDisplay = utilService.getNameOfMonth(endMonth) + ' ' + endDay
        let dateRange = endDate ? startDateForDisplay + ' - ' + endDateForDisplay : startDateForDisplay
        let width;
        
        if (!startDate && !endDate) {
            dateRange = 'Choose Date'
            width = 0
        } else width = this.checkDueDate(startDate, endDate)

        return (
            <div className="progressbar-container" style={{  backgroundColor: 'rgb(121 115 115)' }}>
                <div className="inner-progressbar"
                    style={{ backgroundColor: groupColor, width: width + '%' }}>
                    <span style={{color: groupColor === '#c7c1c1' ? ' #333333' : '#f9f9f9'}}>{dateRange}</span>
                </div>
            </div>
        )
    }
}
