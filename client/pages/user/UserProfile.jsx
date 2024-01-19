import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { Link, Redirect, Route } from "react-router-dom";
import { MainSideBar } from "../../cmps/MainSideBar";
import { GeneralUserInfo } from "../../cmps/user/GeneralUserInfo";
import { UpdateProfile } from "../../cmps/user/UpdateProfile";
import { utilService } from "../../services/utilService";
import { logOut } from "../../store/actions/userAction";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import { boardService } from "../../services/boardService";
import { useGetUser } from "../../src/custom-hooks/useGetUser";
import { Loader } from "../../assets/img/Loader";

export const _UserProfile = ({ logOut, loggedInUser, history, match }) => {
  let user = useGetUser(match.params.userId);
  const [boards, setBoards] = useState(null);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const board = useSelector((state) => state.boardReducer.board);

  useEffect(() => {
    if (!loggedInUser) {
      history.push("/");
      return;
    }
  }, []);

  useEffect(() => {
    (async function () {
      if (user) {
        const boards = await boardService.query(user._id);
        setBoards(boards);
        if (loggedInUser._id === user._id) setIsMyProfile(true);
      }
    })();
  }, [user]);

  if (!loggedInUser || !board) return <Redirect exact to='/' />;
  if (!user || !boards) return <Loader />;
  user = user._id === loggedInUser._id ? loggedInUser : user;
  return (
    <div>
      <div className='user-profile-main-container'>
        <MainSideBar onLogOut={logOut} user={loggedInUser} />
        <div className='user-profile-panel'>
          <div className='user-profile-header'>
            <Link to={`/board/${board._id}`} className='link'>
              <ArrowBackOutlinedIcon />
            </Link>
            <span className='user-profile-initials'>
              {user.imgUrl ? (
                <img src={user.imgUrl} alt='profile' />
              ) : (
                utilService.getNameInitials(user.fullname)
              )}
            </span>
            <h3>
              {`${isMyProfile ? "Hello," : ""}`} <b>{user.fullname}</b>
            </h3>
            {isMyProfile && (
              <div className='user-profile-tabs'>
                <Link to={`${match.url}/general`} className='link'>
                  General
                </Link>
                <Link to={`${match.url}/update_profile`} className='link'>
                  Update profile
                </Link>
              </div>
            )}
          </div>
          <div className='user-profile-content'>
            <Route
              path={`${match.path}/general`}
              render={(props) => {
                return <GeneralUserInfo user={user} {...props} />;
              }}
            />
            <Route
              path={`${match.path}/update_profile`}
              render={(props) => {
                return <UpdateProfile {...props} />;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapGlobalStateToProps = (state) => {
  return {
    loggedInUser: state.userReducer.loggedInUser,
  };
};
const mapDispatchToProps = {
  logOut,
};

export const UserProfile = connect(
  mapGlobalStateToProps,
  mapDispatchToProps
)(_UserProfile);
