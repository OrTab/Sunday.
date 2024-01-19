import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { utilService } from "../services/utilService.js";
import { ClickAwayListener } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { query } from "../store/actions/userAction";
import { SearchInput } from "./SearchInput.jsx";
import { MemberList } from "./members-components/MemberList.jsx";

export const _BoardMembers = ({
  changeBoardMemebrs,
  onCloseModalMembers,
  query,
  boardMembers,
}) => {
  const [users, setUsers] = useState([]);

  const onSetFilter = async (txt) => {
    if (!txt) {
      setUsers([]);
      return;
    }
    const users = await query(txt);
    const usersNotInBoard = users.filter((user) => {
      const mutualMember = boardMembers.find(
        (member) => member._id === user._id
      );
      if (mutualMember) return false;
      return true;
    });
    setUsers(usersNotInBoard);
  };

  const onChangeBoardMemebrs = (userToUpdate, sign) => {
    const updatedUsers = users.filter((user) => user._id !== userToUpdate._id);
    setUsers(updatedUsers);
    changeBoardMemebrs(userToUpdate, sign);
  };

  return (
    <ClickAwayListener
      onClickAway={(ev) => {
        if (
          ev.target.tagName === "svg" ||
          ev.target.className === "board-member-status top-section-item"
        )
          return;
        onCloseModalMembers();
      }}
    >
      <div className='members-modal-basic'>
        <div>
          <h3>Add users to this board</h3>
          <div>
            <SearchInput onSetFilter={onSetFilter} placeHolder='members' />
          </div>
          {users.map((user) => {
            return (
              <div
                key={user._id}
                className='flex align-center space-between member-row'
              >
                <Link to={`/user/${user._id}/general`}>
                  <div className='flex align-center space-between'>
                    {user.imgUrl ? (
                      <img
                        src={user.imgUrl}
                        className='user-thumbnail'
                        alt=''
                      />
                    ) : (
                      <span className='user-thumbnail'>
                        {utilService.getNameInitials(user.fullname)}
                      </span>
                    )}
                    <span className='modal-user-full-name'>
                      {user.fullname}
                    </span>
                  </div>
                </Link>
                <AddIcon
                  onClick={() => onChangeBoardMemebrs(user, "add")}
                  className='remove-icon'
                />
              </div>
            );
          })}
        </div>
        <div>
          <h3>Board Members</h3>
          <MemberList
            members={boardMembers}
            onUpdateMembers={onChangeBoardMemebrs}
            type='remove'
          />
        </div>
      </div>
    </ClickAwayListener>
  );
};

const mapGlobalStateToProps = (state) => {
  return {
    loggedInUser: state.userReducer.loggedInUser,
  };
};
const mapDispatchToProps = {
  query,
};

export const BoardMembers = connect(
  mapGlobalStateToProps,
  mapDispatchToProps
)(_BoardMembers);
