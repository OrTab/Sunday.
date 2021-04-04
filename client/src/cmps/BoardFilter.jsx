import React, { Component } from 'react'
import SearchIcon from '@material-ui/icons/Search';
import { ClickAwayListener } from '@material-ui/core';
import { utilService } from '../services/utilService';
import ReactTooltip from "react-tooltip";
import { FilterOptions } from './FilterOptions';
import FilterListIcon from '@material-ui/icons/FilterList';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import MoreVertIcon from '@material-ui/icons/MoreVert';

export class BoardFilter extends Component {
    state = {
        filterBy: {
            txt: '',
            membersId: [],
            status: [],
            priority: [],
            sortBy: '',
            statusesForDisplay: null,
            priorityForDisplay: null
        },
        isShowMenuFilter: false,
        isMobileFiltersOpen: false
    }
    componentDidMount() {
        this.setStatuses()
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.board !== this.props.board) this.setStatuses()
    }
    handelChange = (ev) => {
        const value = ev.target.value
        const filterBy = { ...this.state.filterBy }
        filterBy[ev.target.name] = value;
        this.setState({ filterBy }, () => this.props.onSetFilter(this.state.filterBy));
    }
    cleanInput = () => {
        const copyFilter = { ...this.state.filterBy }
        copyFilter.txt = '';
        this.setState({ filterBy: copyFilter }, () => this.props.onSetFilter({ ...this.state.filterBy }))
    }
    onCloseFilterMenu = () => {
        this.setState({ isShowMenuFilter: !this.state.isShowMenuFilter })
    }
    onSetFilterLabels = (label, text) => {
        const copyFilter = { ...this.state.filterBy }
        if (copyFilter[label].includes(text)) {
            const newLabels = copyFilter[label].filter(label => label !== text)
            copyFilter[label] = newLabels
        }
        else copyFilter[label] = [...copyFilter[label], text]
        const copyStatusForDispaly = { ...this.state.statusesForDisplay }
        const copyPriorityForDisplay = { ...this.state.priorityForDisplay }
        if (label === 'status') copyStatusForDispaly[text].isSelect = !this.state.statusesForDisplay[text].isSelect
        if (label === 'priority') copyPriorityForDisplay[text].isSelect = !this.state.priorityForDisplay[text].isSelect
        this.setState({ filterBy: copyFilter, statusesForDisplay: copyStatusForDispaly, priorityForDisplay: copyPriorityForDisplay },
            () => this.props.onSetFilter({ ...this.state.filterBy }))
    }

    onSetFilter = (ev) => {
        const { value, name } = ev.target
        const filterBy = { ...this.state.filterBy }
        filterBy[name] = value;
        this.setState({ filterBy }, () => this.props.onSetFilter({ ...this.state.filterBy }));
    }

    onGetMember = (memberId) => {
        const copyFilter = { ...this.state.filterBy }
        if (copyFilter.membersId.includes(memberId)) {
            const newMmbers = copyFilter.membersId.filter(member => member !== memberId)
            copyFilter.membersId = newMmbers
        }
        else copyFilter.membersId = [...copyFilter.membersId, memberId]
        this.setState({ filterBy: copyFilter }, () => this.props.onSetFilter({ ...this.state.filterBy }))
    }

    toggleMobileFilters = () => {
        const { isMobileFiltersOpen } = this.state;
        this.setState({ isMobileFiltersOpen: !isMobileFiltersOpen });
    }


    setStatuses() {
        const { board } = this.props
        for (let i = 0; i < 2; i++) {
            var labels = {};
            let key = i === 0 ? 'statuses' : 'priorities'
            board.groups.forEach(group => {
                var currGroup = group[key].reduce((acc, status) => {
                    acc[status.text] = { color: status.color, isSelect: false };
                    return acc;
                }, {})
                labels = { ...labels, ...currGroup }
            })
            if (i === 0) this.setState({ statusesForDisplay: labels })
            else this.setState({ priorityForDisplay: labels })
        }
    }

    render() {
        const { isShowMenuFilter, statusesForDisplay, priorityForDisplay, isMobileFiltersOpen } = this.state
        if (!statusesForDisplay || !priorityForDisplay) return null
        const boardFilter = <section className="board-filter">
            <div className="search-field">
                <SearchIcon />
                <input type="text" placeholder="Search" name="txt" value={this.state.filterBy.txt} onChange={this.handelChange} autoComplete="off" />
                {/* <button className="clean-input-btn" onClick={() => this.cleanInput()}>x</button> */}
            </div>
            <span className="clickable-filter-category" onClick={this.onCloseFilterMenu}><FilterListIcon /> Filter</span>
            {isShowMenuFilter && <ClickAwayListener onClickAway={this.onCloseFilterMenu}>
                <div className="relative">
                    <section className="groups-filter">
                        <div className="status-filter">
                            <div className="option-continer">
                                <h3>Status</h3>
                                <FilterOptions onSetFilterLabels={this.onSetFilterLabels} content='status' labels={statusesForDisplay} />
                            </div>
                        </div>
                        <div className="member-filter">
                            <div className="option-continer">
                                <h3>Member</h3>
                                {this.props.board.members.map(member => {
                                    return <div className="item" key={member._id} onClick={() => this.onGetMember(member._id)} data-tip data-for={member.fullname}>
                                        {(member.imgUrl) ? <img className="user-thumbnail" src={member.imgUrl} alt="" /> : <h5 className="user-thumbnail">{(utilService.getNameInitials(member.fullname).toUpperCase())}</h5>}
                                        <span>{member.fullname}</span>
                                        <ReactTooltip className="sunday-tooltip" id={member.fullname} place="bottom" effect="solid">
                                            {`Member is ${member.fullname}`}
                                        </ReactTooltip>
                                    </div>
                                })}
                            </div>
                        </div>
                        <div className="priority-filter">
                            <div className="option-continer">
                                <h3>Priority</h3>
                                <FilterOptions onSetFilterLabels={this.onSetFilterLabels} content='priority' labels={priorityForDisplay} />
                            </div>
                        </div>
                    </section>
                </div>
            </ClickAwayListener>
            }
            <div className="clickable-filter-category select-with-icon">
                <select className="clickable-filter-category" onChange={this.onSetFilter} name="sortBy"  >
                    <option value="sort">Sort</option>
                    <option value="name">Name</option>
                    <option value="date">Date</option>
                </select>
                <SwapVertIcon />
            </div>
        </section>


        return <React.Fragment>
            <div className="board-filter-wrapper-desktop">
                {boardFilter}
            </div>
            {isMobileFiltersOpen && <ClickAwayListener onClickAway={this.toggleMobileFilters}>
                <div className="board-filter-wrapper-mobile">
                    {boardFilter}
                </div>
            </ClickAwayListener>
            }
            <div className="filter-menu-mobile">
                <MoreVertIcon onClick={this.toggleMobileFilters} />
            </div>

        </React.Fragment>
    }
}