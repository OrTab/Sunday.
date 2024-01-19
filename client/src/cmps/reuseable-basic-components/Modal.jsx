import React from 'react'
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core';
import ReactDOM from 'react-dom';


const useStyles = makeStyles((theme) => ({
    wrapper: {
        position: "fixed",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 9999,
    },
    box: {
        backgroundColor: "#fff",
        textAlign: "center",
        position: "absolute",
        width: "90%",
        padding: "2px",
        [theme.breakpoints.up('sm')]: {
            width: "500px",
        },
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        color: "#323338",
        boxShadow: "0 4px 17px 6px rgba(0, 0, 0, 0.1)",
        "& .close-modal-section": {
            textAlign: "left"
        }
    },
    content: {
        padding: "1rem",
    }
}))

export const Modal = ({ open = false, withCloseBtn = true, children, onClose }) => {
    const classes = useStyles(withCloseBtn)
    const modalRoot = document.getElementById('modal-root')
    const modalTemplate = <div
        className={classes.wrapper}
        onClick={(ev) => {
            ev.stopPropagation()
            onClose()
        }
        }
    >
        <div className={classes.box}>
            {withCloseBtn && <div className="close-modal-section">
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </div>}
            <div className={classes.content}>
                {children}
            </div>
        </div>
    </div >
    return open ? ReactDOM.createPortal(modalTemplate, modalRoot) : null
}
