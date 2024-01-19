import { Link } from "react-router-dom";
import { utilService } from "../../services/utilService";
import moment from "moment";
import { useGetUser } from "../../custom-hooks/useGetUser";

//check about name with eyal byMember || user
export function BoardActivitiesPreview({ activity, user }) {
  const byMember = useGetUser(activity.byMember);

  return (
    byMember && (
      <div className='activity'>
        <div>
          <Link to={`/user/${byMember._id}`}>
            {" "}
            {byMember.imgUrl ? (
              <img
                src={byMember.imgUrl}
                className='user-thumbnail'
                alt='avatar'
              />
            ) : (
              <div className='user-thumbnail'>
                {byMember.imgUrl ? (
                  <img src={byMember.imgUrl} alt='avatar' />
                ) : (
                  utilService.getNameInitials(byMember.fullname)
                )}
              </div>
            )}
          </Link>
          <div>
            <h2>{byMember.fullname}</h2>
            <h4>{moment(activity.createdAt).from(Date.now())}</h4>
          </div>
        </div>
        <div>
          <h4>{`${byMember._id === user._id ? "You" : byMember.fullname} ${
            activity.txt
          }`}</h4>
        </div>
      </div>
    )
  );
}
