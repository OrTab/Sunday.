import { Link } from "react-router-dom";
import { utilService } from "../../services/utilService";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

export const MemberPreview = ({ member, onUpdateMembers, type }) => {
  return (
    member && (
      <div className='flex align-center space-between member-row'>
        <Link to={`/user/${member._id}/general`}>
          <div className='flex align-center space-between'>
            {member.imgUrl ? (
              <img src={member.imgUrl} className='user-thumbnail' alt='' />
            ) : (
              <span className='user-thumbnail'>
                {utilService.getNameInitials(member.fullname)}
              </span>
            )}
            <span className='modal-user-full-name'>{member.fullname}</span>
          </div>
        </Link>
        {type === "remove" ? (
          <RemoveIcon
            onClick={(ev) => {
              ev.stopPropagation();
              onUpdateMembers(member, "remove");
            }}
            className='remove-icon'
          />
        ) : (
          <AddIcon
            onClick={(ev) => {
              ev.stopPropagation();
              onUpdateMembers(member, "add");
            }}
            className='remove-icon'
          />
        )}
      </div>
    )
  );
};
