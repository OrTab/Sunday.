import React, { Component } from 'react'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { Colors } from './Colors';
import { Button, TextField } from '@material-ui/core';
import { Label } from './Label';


export class LabelMenu extends Component {

    state = {
        currLabel: null,
        isOpen: false,
        isAddLabelOpen: false,
        isColorPalletteOpen: false,
        showAddLabelError: false,
        newLabel: {
            text: '',
            color: null
        },
        isShowOpt: false,
        isEditLabel: false
    }

    chosenLabel = React.createRef();

    componentWillUnmount() {
        this.setState({ newLabel: { text: '', color: null } });
    }


    toggleMenu = () => {
        const { isOpen } = this.state;
        this.setState({ isOpen: !isOpen, isEditLabel: false });
        //    document.querySelector('.group-container').scrollHeight()
        // const elGroup = document.querySelector('.labels-menu')
        // elGroup.scrollBottom = elGroup.scrollHeight;
    }

    toggleAddNewLabel = () => {
        const { isAddLabelOpen } = this.state;
        this.setState({ isAddLabelOpen: !isAddLabelOpen, newLabel: { text: '', color: null } });
    }

    toggleAddLabelError = () => {
        this.setState({ showAddLabelError: true }, () => {
            setTimeout(() => {
                this.setState({ showAddLabelError: false });
            }, 1500);
        });
    }

    setCurrLabel = (newLabel, labelGroup, labelType) => {
        const { currLabel } = this.props
        if (currLabel.text === newLabel.text) {
            this.toggleMenu();
            return
        }
        this.setState({ currLabel: newLabel }, () => {
            this.props.onSaveLabel(newLabel, labelGroup, labelType);
            this.toggleMenu();
        });
    }

    setNewLabelColor = (color) => {
        this.setState({ newLabel: { ...this.state.newLabel, color } })
    }

    addLabel = (ev) => {
        ev.preventDefault();
        const { onAddLabel, labelGroup } = this.props;
        const { newLabel } = this.state;
        if (!newLabel.text || !newLabel.color) {
            this.toggleAddLabelError();
            return;
        }
        onAddLabel(newLabel, labelGroup);
        this.toggleAddNewLabel();
    }

    handleInput = (ev) => {
        const { name, value } = ev.target
        const { newLabel } = this.state;
        newLabel[name] = value;
        this.setState({ newLabel })
    }

    toggleEdit = () => {
        this.setState({ isEditLabel: !this.state.isEditLabel })
    }

    render() {
        const { labels, currLabel, onDeleteLabel, labelGroup, labelType, isLast, isScroll } = this.props;

        const { isAddLabelOpen, isOpen, showAddLabelError, newLabel, isEditLabel } = this.state;
        return <div className="labels-menu-container">
            <div
                ref={this.chosenLabel}
                className="labels-menu-chosen-item"
                onClick={this.toggleMenu}
                style={{ backgroundColor: currLabel.color }}
            >
                {currLabel.text}
                <span className="fold"></span>
            </div>
            {isOpen &&
                <ClickAwayListener onClickAway={(ev) => {
                    if (ev.target === this.chosenLabel.current) return
                    this.toggleMenu()
                }}>
                    <div

                        className={`labels-menu-floating-container${isLast ? ' last' : ''}`}
                    >
                        <div className="labels-grid">
                            {labels.map((label, idx) => {
                                return <Label
                                    isEditLabel={isEditLabel}
                                    label={label}
                                    key={idx}
                                    setCurrLabel={this.setCurrLabel}
                                    labelType={labelType}
                                    labelGroup={labelGroup}
                                    toggleMenu={this.toggleMenu}
                                    onDeleteLabel={onDeleteLabel} />
                            })}
                            <div
                                className="labels-menu-item new-label"
                                onClick={this.toggleAddNewLabel}
                            >
                                Add {this.props.labelType}
                            </div>
                        </div>
                        {isAddLabelOpen && <div className="add-new-label-container">
                            <div className="flex space-between">
                                <span onClick={this.toggleAddNewLabel}>Cancel</span>
                                <span onClick={this.addLabel}>Save</span>
                            </div>
                            <form onSubmit={this.addLabel} className="relative">
                                <span
                                    style={{ backgroundColor: `${newLabel.color ? newLabel.color : ''}` }}
                                    className="color-preview"></span>
                                <TextField
                                    name="text"
                                    autoComplete="off"
                                    placeholder={showAddLabelError ? "Please enter label + color" : "Enter label"}
                                    onChange={this.handleInput}
                                />
                            </form>
                            <Colors onChangeColor={this.setNewLabelColor} />
                        </div>}
                        <Button className="edit-label-btn" onClick={this.toggleEdit}>{isEditLabel ? 'Done' : 'Edit'}</Button>
                    </div>
                </ClickAwayListener>
            }
        </div>
    }
}


