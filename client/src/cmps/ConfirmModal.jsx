import React, { Component } from 'react'
import { CSSTransition } from 'react-transition-group'
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

export class ConfirmModal extends Component {
  state = {
    mounted: false
  }
  componentDidMount() {
    this.setState({ mounted: true })
  }
  onClose = () => {
    this.setState({ mounted: false })
  }
  render() {
    const { mounted } = this.state
    const { title, type, id, arg } = this.props
    return (
      <div className="modal-wrapper" onClick={this.onClose}>
        <CSSTransition in={mounted} classNames="fade" timeout={200} onExited={this.props.close}>
          <div className="modal-content" onClick={ev => ev.stopPropagation()}>
            <h3>{`Are you sure You want to delete this ${type}?`}</h3>
            <p>{`(${title})`}</p>
            <div className="btn-confirm">

              <Button
                onClick={() => {
                  this.onClose()
                  this.props.delete(id, arg)
                }}
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
              >
                Delete
      </Button>
      <Button
      onClick={this.onClose}
        variant="contained"
        color="default"
      >
        Cancel
      </Button>
             
            </div>
          </div>
        </CSSTransition>
      </div>
    )
  }
}