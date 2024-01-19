import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { MemberList } from "./members-components/MemberList.jsx";

export function TaskMembersModal({
  availableBoardMembers,
  cardMembers,
  changeTaskMembers,
  onCloseModal,
}) {
  return (
    <ClickAwayListener onClickAway={onCloseModal}>
      <div className='members-modal-basic'>
        <div>
          <h3 className='members-modal-task-members-title'>Task Members</h3>
          <MemberList
            members={cardMembers}
            onUpdateMembers={changeTaskMembers}
            type='remove'
          />
        </div>
        <div>
          <h3>Board Members</h3>
          <MemberList
            members={availableBoardMembers}
            onUpdateMembers={changeTaskMembers}
            type='add'
          />
        </div>
      </div>
    </ClickAwayListener>
  );
}
