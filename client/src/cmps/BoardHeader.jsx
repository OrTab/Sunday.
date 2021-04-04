
import { useMemo, useState } from 'react'
import { EditableElement } from './EditableElement';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import ReactTooltip from "react-tooltip";
import { BoardFilter } from './BoardFilter';
import { BoardMembers } from './BoardMembers';
import { BoardActivities } from './BoardActivities';
import { boardService } from '../services/boardService';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

export const BoardHeader = ({ board, onAddGroup, onChangeTitle, onChangeBoardMemebrs, onSetFilter, changeBoardView, user }) => {

    const [isShowBoardMember, setIsShowBoardMember] = useState(false)
    const [isShowActivities, setIsShowActivities] = useState(false)
    const [activityFilterText, setActivityFilterText] = useState('')

    const toggleMembersModal = () => {
        setIsShowBoardMember(!isShowBoardMember)
    }

    const showActivities = () => {
        setIsShowActivities(!isShowActivities)
        boardService.updateActivities(board)
    }

    const handleChange = (ev) => setActivityFilterText(ev.target.value)

    const activitiesForDisplay = useMemo(() => {
        const { activities } = board
        const filterRegex = new RegExp(activityFilterText, 'i');
        const filteredActivities = activities.filter(activity => {
            return filterRegex.test(activity.txt) || filterRegex.test(activity.byMember.fullname)
        })
        return filteredActivities
    },[board,activityFilterText])

    const unReadActivities = useMemo(() => activitiesForDisplay.filter(activity => !activity.isRead),[activitiesForDisplay])
    const activities = useMemo(() => activitiesForDisplay.filter(activity => activity.isRead),[activitiesForDisplay])
    if (!board) return <h1>Loading...</h1>

    return <section className="board-header flex column space-between">
        <div className="flex align-center board-header-top-section">
            <div className="board-name-and-owner">
                <h2><EditableElement onChangeTitle={onChangeTitle}>{board.title}</EditableElement></h2>
                <h4>{''}Owner :{board.createdBy.fullname}</h4>
            </div>
            <div className="flex space-between relative">
                <span className="board-member-status top-section-item" data-tip data-for="members"
                    onClick={toggleMembersModal}> <PeopleOutlineIcon />/{board.members.length}</span>
                {isShowBoardMember && <BoardMembers board={board}
                    onChangeBoardMemebrs={onChangeBoardMemebrs} onCloseModalMembers={toggleMembersModal} />}

                <span
                    className="activity-display top-section-item"
                    onClick={() => setIsShowActivities(true)}
                >
                    Activities
                         <span style={{ color: unReadActivities.length ? '#0085ff' : '' }}>
                        {unReadActivities.length}
                    </span>
                         /{board.activities.length}
                </span>

                <div className={`${isShowActivities ? 'close-Activities' : ''}`} onClick={showActivities}>
                </div>
                <div className={`activities ${isShowActivities ? 'open' : ''}`}>
                    <ArrowBackIcon onClick={showActivities} />
                    <BoardActivities activityFilterText={activityFilterText} handleChange={handleChange} activities={unReadActivities} user={user} clear={() => boardService.updateActivities(board, true)}
                        title={board.title} content={`New Activities: ${unReadActivities.length}`} />
                    <BoardActivities activities={activities} user={user} content={`Activities Read: ${activities.length}`} />
                </div>

            </div>
        </div>

        <div className=" flex space-between align-flex-end">
            <div className="switch-view" >
                <select onChange={changeBoardView} name="">
                    <option value="board">Board</option>
                    <option value="dashboard">DashBoard</option>
                </select>
            </div>
            <div className="board-options flex align-flex-end relative">
                <BoardFilter onSetFilter={onSetFilter} board={board} />
                <button className="add-item" onClick={() => onAddGroup()}>New group</button>
            </div>
        </div>
        <ReactTooltip className="sunday-tooltip" id="members" place="bottom" effect="solid">
            Who is on this board?
      </ReactTooltip>
    </section>
}


