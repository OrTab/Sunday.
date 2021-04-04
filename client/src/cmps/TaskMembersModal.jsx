import { Link } from 'react-router-dom'
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import { utilService } from '../services/utilService.js';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';


export function TaskMembersModal({ boardMembers, cardMembers, changeTaskMembers, onCloseModal}) {

    return (<ClickAwayListener onClickAway={onCloseModal}>
        <div className="members-modal-basic" >
            <div>
                <h3 className="members-modal-task-members-title">Task Members</h3>
                {cardMembers.map(member => {
                    return <div key={member._id} className="flex align-center space-between member-row">
                        <Link to={`/user/${member._id}/general`} >
                            <div className="flex align-center">
                                {member.imgUrl ? <img src={member.imgUrl} className="user-thumbnail" alt="" />
                                    : <h5 className="user-thumbnail ">
                                        {utilService.getNameInitials(member.fullname)}</h5>}
                                <span className="modal-user-full-name">{member.fullname}</span>
                            </div>
                        </Link>
                        < RemoveIcon onClick={() => changeTaskMembers(member._id, 'remove')} className="remove-icon" />
                    </div>
                })}
            </div>
            <div>
                <h3>Board Members</h3>
                {boardMembers.map(member => {
                    return <div key={member._id} className="flex align-center space-between member-row">
                        <Link to={`/user/${member._id}/general`} >
                            <div className="flex align-center">
                                {member.imgUrl ? <img src={member.imgUrl} className="user-thumbnail" alt="" />
                                    : <h5 className="user-thumbnail">
                                        {utilService.getNameInitials(member.fullname)}</h5>}
                                <span className="modal-user-full-name">{member.fullname}</span>
                            </div>
                        </Link>
                        <AddIcon onClick={() => changeTaskMembers(member._id,  'add' )} className="remove-icon" />
                    </div>
                })}
            </div>
        </div>
    </ClickAwayListener>
    )
}
