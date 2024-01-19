import React from "react";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import { Modal } from "./reuseable-basic-components/Modal";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  deleteBtn: {
    backgroundColor: "#fb275d",
    boxShadow: "none",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#ff4c79",
      boxShadow: "none",
    },
  },
}));

export const ConfirmModal = ({
  title,
  type,
  id,
  arg,
  close,
  onApprove,
  isInDeleteMode,
  isDeleteLabel,
}) => {
  const msg = !isDeleteLabel
    ? `Are you sure You want to delete this ${type}?`
    : "This label is active , are you sure you want to delete?";
  const classes = useStyles();
  return (
    <Modal open={isInDeleteMode} onClose={close}>
      <h3>{msg}</h3>
      <p>{`(${title})`}</p>
      <div className='btn-confirm'>
        <Button
          onClick={() => {
            onApprove(id, arg);
          }}
          variant='contained'
          className={classes.deleteBtn}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};
