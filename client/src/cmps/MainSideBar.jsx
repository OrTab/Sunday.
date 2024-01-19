import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import sundayIcon from "../assets/img/sunday-icon.svg"
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ReactTooltip from "react-tooltip";
import { UserNotifications } from "./user/UserNotifications.jsx"

export class MainSideBar extends Component {
    state = {
        isShowUserNotification: false
    }
    onToggleUserNotifications = () => {
        this.setState({ isShowUserNotification: !this.state.isShowUserNotification })
    }
    render() {
        const { onLogOut, user, onCleanNotifications, onUpdateNotifications } = this.props;
        const notifications = user.notifications?.filter(notification => !notification.isRead)

        return <div className="main-sidebar-container flex column relative">
            <div className="main-side-bar-top flex column align-center">
                <Link onClick={onLogOut} to="/">
                    <img className="sunday-icon" src={sundayIcon} alt="sunday-logo-icon" />
                </Link>
                <UserNotifications notifications={notifications} onCleanNotifications={onCleanNotifications} />
                {/* <div className="relative">
                    {user.notifications && <span className="count-notifications">{notifications.length}</span>}
                    <NotificationsNoneIcon data-tip data-for="notifications" onClick={this.onToggleUserNotifications} />
                </div> */}
                {/* {this.state.isShowUserNotification && <UserNotification notifications={user.notifications} onCleanNotifications={onCleanNotifications} user={user} onUpdateNotifications={onUpdateNotifications} onToggleUserNotifications={this.onToggleUserNotifications} />} */}

                <Link to={`/user/${user._id}/general`}>
                    <div className="greet-user">
                        <span>Hello {user.fullname}</span>
                    </div>
                </Link>
            </div>
            <div className="main-side-bar-bottom flex column align-center">
                <Link to={`/user/${user._id}/general`}>
                    <PersonOutlineIcon data-tip data-for="myAccount" />
                </Link>
                <ExitToAppIcon data-tip data-for="logOut" onClick={onLogOut} />
            </div>

            <ReactTooltip className="sunday-tooltip" id="myAccount" place="right" effect="solid">
                My Account
            </ReactTooltip>
            <ReactTooltip className="sunday-tooltip" id="logOut" place="right" effect="solid" >
                Log Out
            </ReactTooltip>
        </div >
    }
}
