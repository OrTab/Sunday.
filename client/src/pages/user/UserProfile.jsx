import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect, Route } from 'react-router-dom'
import { MainSideBar } from '../../cmps/MainSideBar'
import { GeneralUserInfo } from '../../cmps/user/GeneralUserInfo'
import { UpdateProfile } from '../../cmps/user/UpdateProfile'
import { utilService } from '../../services/utilService'
import { logOut, getUserById } from '../../store/actions/userAction'
import { getBoardsByUserId } from '../../store/actions/boardAction'
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined';

export class _UserProfile extends Component {

    state = {
        user: null,
        boards: null,
        isMyProfile: false
    }

    onLogOut = async () => {
        await this.props.logOut()
    }

    async componentDidMount() {
        const { loggedInUser, getBoardsByUserId, getUserById } = this.props
        if (!loggedInUser) {
            this.props.history.push('/')
            return
        }
        const { userId } = this.props.match.params
        const user = await getUserById(userId);
        const boards = await getBoardsByUserId(userId);
        this.setState({ user, boards }, () => {
            if (loggedInUser._id === this.state.user._id) {
                this.setState({ isMyProfile: true });
            }
        });
    }

    render() {
        const { user, isMyProfile, boards } = this.state
        const { match, loggedInUser } = this.props
        if (!loggedInUser) return <Redirect exact to="/" />
        if (!user || !boards) return null

        return <div>
            <div className="main-sidebar-container mobile">
                <MainSideBar onLogOut={this.onLogOut} user={loggedInUser} />
            </div>
            <div className="user-profile-main-container">
                <div className="main-sidebar-container desktop">
                    <MainSideBar onLogOut={this.onLogOut} user={loggedInUser} />
                </div>
                <div className="user-profile-panel">
                    <div className="user-profile-header">
                        <Link to={'/board'} className="link"><ArrowBackOutlinedIcon /></Link>
                        <span className="user-profile-initials">
                            {
                                user.imgUrl ? <img src={user.imgUrl} alt="profile" /> :
                                    utilService.getNameInitials(user.fullname)
                            }
                        </span>
                        <h3>{`${isMyProfile ? 'Hello,' : ''}`} <b>{user.fullname}</b></h3>
                        {isMyProfile && <div className="user-profile-tabs">
                            <Link to={`${match.url}/general`} className="link">General</Link>
                            <Link to={`${match.url}/update_profile`} className="link">Update profile</Link>
                        </div>}
                    </div>
                    <div className="user-profile-content">
                        <Route path={`${match.path}/general`} render={(props) => {
                            return <GeneralUserInfo user={user} {...props} />
                        }} />
                        <Route path={`${match.path}/update_profile`} render={(props) => {
                            return <UpdateProfile user={user} {...props} />
                        }} />
                    </div>
                </div>
            </div>
        </div>
    }
}

const mapGlobalStateToProps = (state) => {
    return {
        loggedInUser: state.userReducer.loggedInUser,
    }
}
const mapDispatchToProps = {
    logOut,
    getUserById,
    getBoardsByUserId
}


export const UserProfile = connect(mapGlobalStateToProps, mapDispatchToProps)(_UserProfile);



