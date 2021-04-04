import React from 'react'
import { Link } from 'react-router-dom'
import { utilService } from '../services/utilService'
import moment from 'moment'
import SearchIcon from '@material-ui/icons/Search';

export const BoardActivities = (props) => {

    const { activityFilterText, activities, content, user, title, clear, handleChange } = props

    return <div>
        {title && <div className="activity-filter">
            <h2 className="activities-board-title"><span>{title}</span> Activities</h2>
            <div>
                <div className="search-field relative">
                    <SearchIcon />
                    <input
                        value={activityFilterText}
                        type="text"
                        name="activity"
                        placeholder="search"
                        autoComplete="off"
                        onChange={handleChange} />
                </div>
                <button onClick={clear}>Clear</button>
            </div>
        </div>}
        <span>{content}</span>
        <div className="activity-list">
            {activities.map(activity => {
                return <div key={activity.id} className="activity">
                    <div>
                        <Link to={`/user/${activity.byMember._id}`}>  {activity.byMember.imgUrl ? <img src={activity.byMember.imgUrl} className="user-thumbnail" alt="avatar" /> :
                            <div className="user-thumbnail">{
                                activity.byMember.imgUrl ? <img src={activity.byMember.imgUrl} alt="avatar"/> :
                                    utilService.getNameInitials(activity.byMember.fullname)
                            }</div>}</Link>
                        <div>
                            <h2>{activity.byMember.fullname}</h2>
                            <h4>{moment(activity.createdAt).from(Date.now())}</h4>
                        </div>
                    </div>
                    <div>
                        <h4 >{`${activity.byMember.fullname === user.fullname ? 'You' : activity.byMember.fullname} ${activity.txt}`}</h4>
                    </div>
                </div>
            })}
        </div>
    </div>
}
