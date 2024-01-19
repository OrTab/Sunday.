import React from 'react'
import SearchIcon from '@material-ui/icons/Search';
import { BoardActivitiesPreview } from './BoardActivitiesPreview';

// TODO: think of way to opti,ize activity calls
export const BoardActivitiesList = ({ activityFilterText, activities, content, user, title, clear, handleChange }) => {
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
            {activities.map(activity =>
                <BoardActivitiesPreview
                    key={activity.id}
                    activity={activity} user={user} />)}
        </div>
    </div>
}
