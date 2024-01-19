import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import { utilService } from "../../services/utilService"
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import moment from 'moment'
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import ReactTooltip from 'react-tooltip';

const useStyles = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(2),
    },
}));

export function UserNotifications({ notifications, onCleanNotifications, onUpdateNotifications }) {

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'notifications-popover' : undefined;

    return (
        <div>
            <div className="relative">
                {notifications && <span className="count-notifications">{notifications.length}</span>}
                <NotificationsNoneIcon
                    data-tip data-for="notifications"
                    aria-describedby={id}
                    onClick={handleClick}
                />
            </div>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <section className="user-notifications">
                    <header className="flex space-between align-center">
                        {notifications?.length ?
                            (<>
                                <h1>Notifications</h1>
                                <DeleteOutlineOutlinedIcon onClick={onCleanNotifications} />
                            </>)
                            : (<h1>You have no notifications</h1>)}

                    </header>
                    {notifications?.length > 0 && (notifications.map((notification, idx) => {

                        return <div key={idx} className="notification-details">
                            <div className="flex">
                                {notification.byMember.imgUrl ? <img src={notification.byMember.imgUrl} className="user-thumbnail" alt="" /> :
                                    <span className="user-thumbnail">{utilService.getNameInitials(notification.byMember.fullname)}</span>
                                }
                                <p>{notification?.notificationTxt}</p>
                            </div>
                            <div className="time flex"> <AccessTimeIcon /><h4>{moment(notification.createdAt).from(Date.now())}</h4></div>
                        </div>
                    })
                    )}
                </section>
            </Popover>
            <ReactTooltip className="sunday-tooltip" id="notifications" place="right" effect="solid">
                Notifications
      </ReactTooltip>
        </div>
    );
}




export default function SimplePopover() {
}