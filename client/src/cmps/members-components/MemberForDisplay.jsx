import ReactTooltip from "react-tooltip";
import { utilService } from "../../services/utilService";

export function MemberForDisplay({ isFilterDisplay, member, backgroundColor }) {
  return (
    <>
      {member && member.imgUrl ? (
        <img src={member.imgUrl} className='user-thumbnail' alt='' />
      ) : (
        member && (
          <h5 style={{ backgroundColor }} className='user-thumbnail'>
            {utilService.getNameInitials(member.fullname).toUpperCase()}
          </h5>
        )
      )}
      {isFilterDisplay && member && (
        <>
          <span>{member.fullname}</span>
          <ReactTooltip
            className='sunday-tooltip'
            id={member._id}
            place='bottom'
            effect='solid'
          >
            {`Member is ${member.fullname}`}
          </ReactTooltip>
        </>
      )}
    </>
  );
}
