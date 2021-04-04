import { Link } from 'react-router-dom'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getKeyById } from '../store/actions/boardAction.js'
import SunEditor /*{ buttonList }*/ from "suneditor-react";
import 'suneditor/dist/css/suneditor.min.css';
import { cloudinaryService } from '../services/cloudinary-service.js';
import { addCardUpdate } from '../store/actions/boardAction.js'
import { utilService } from '../services/utilService.js';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import moment from 'moment';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

class _CardUpdates extends Component {
    state = {
        card: null,
        cardUpdate: {
            byMember: null,
            type: 'txt',
            value: '',
            title: ''
        },
        isLoading: false
    }

    componentDidMount() {
        const { cardId } = this.props.match.params
        if (cardId) {
            this.getCard(cardId)
            this.setState({ isOpen: true })
        }
        // else <Redirect to="/bo/>

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params !== this.props.match.params) {
            const { cardId } = this.props.match.params
            this.getCard(cardId)
        }
    }

    getCard = async (cardId) => {
        const { boards, getKeyById } = this.props
        const card = await getKeyById(boards, cardId)
        this.setState({ card })
    }


    handleChange = (content) => {
        const copyUpdate = { ...this.state.cardUpdate }
        const regex = /(<([^>]+)>)/ig
        if (!content.replace(regex, '').length) {
            copyUpdate.value = ''
            this.setState({ cardUpdate: copyUpdate })
            return
        }
        copyUpdate.value = content
        this.setState({ cardUpdate: copyUpdate })
    }

    uploadImg = async (ev) => {
        const copyUpdate = { ...this.state.cardUpdate }
        if (!ev.target.files[0]) return
        copyUpdate.value = '<h1>Loading...</h1>'
        this.setState({ isLoading: true, cardUpdate: copyUpdate })
        const imgUrl = await cloudinaryService.uploadImg(ev.target.files[0]);
        copyUpdate.value = imgUrl
        copyUpdate.type = 'img'
        this.setState({ cardUpdate: copyUpdate, isLoading: false })
    }


    onImageUploadBefore = () => {
        const copyUpdate = { ...this.state.cardUpdate }
        copyUpdate.type = 'img'
        this.setState({ cardUpdate: copyUpdate })
        return true
    }

    onAddUpdate = (ev) => {
        ev.preventDefault()
        const regex = /(<([^>]+)>)/ig
        const copyUpdate = { ...this.state.cardUpdate }
        if (!copyUpdate.value.replace(regex, '').length) {
            copyUpdate.value = ''
            this.setState({ cardUpdate: copyUpdate })
            return
        }
        if (copyUpdate.type === 'img') {
            copyUpdate.value = copyUpdate.value.replace(regex, '')
        }

        copyUpdate.byMember = this.props.loggedInUser
        this.props.addCardUpdate(copyUpdate, this.props.board, this.state.card)
        this.setState({
            cardUpdate: {
                byMember: null,
                value: '',
                title: '',
                type: 'txt'

            },
            isOpen: false
        })
    }



    render() {
        const { board } = this.props
        const { card, cardUpdate } = this.state
        if (!card || !board) return null
        const htmlUpdates = card.updates.reduce((acc, update) => {
            if (update.type === 'txt') acc += `<div class="update txt-update">
                                                <div class="update-header flex space-between align-center">
                                                    <div class="update-writer flex align-center">
                                                        <span class="user-thumbnail">${utilService.getNameInitials(update.byMember.fullname)}</span>
                                                        <h5>${update.byMember.fullname}</h5>
                                                    </div>
                                                    <span class="created-at">${moment(update.createdAt).from(Date.now())}</span>
                                                </div>
                                                <div class="update-body">${update.value}</div>
                                               </div>`
            else if (update.type === 'img') acc += `<div class="update txt-update">
                                                <div class="update-header flex space-between align-center">
                                                 <div class="update-writer flex align-center">
                                                        <span class="user-thumbnail">${utilService.getNameInitials(update.byMember.fullname)}</span>
                                                        <h5>${update.byMember.fullname}</h5>
                                                    </div>
                                                    <span class="created-at">${moment(update.createdAt).from(Date.now())}</span>
                                                </div>
                                                <div class="update-body"><img class="img-update" src="${update.value}"/>
                                                </div></div>
                                            </div>`

            return acc

        }, '')
        return (
            <>
                <section className={`card-updates open   `}>
                    <Link className="back-arrow" to={`/board/${board._id}`} onClick={() => this.setState({ isOpen: false })}><ArrowBackIcon /></Link>
                    <div className="updates-card-header flex align-center space-between">
                        <h2 className="card-update-title">{this.state.card.title}</h2>
                        <span className="card-status" style={{ backgroundColor: card.status.color }}>{card.status.text}</span>
                    </div>
                    <div className="text-editor-wrapper">
                        <form onSubmit={this.onAddUpdate}>
                            <SunEditor placeholder="Write an update..."
                                onChange={this.handleChange}
                                onDrop={this.handleDrop}
                                setDefaultStyle=""
                                setOptions={{
                                    buttonList: [
                                        ['bold', 'underline', 'italic', 'strike', 'fontColor', 'fontSize', 'align', 'link', 'image'],],
                                    // ['formatBlock', 'font', 'fontSize',],
                                    // ['fontColor', 'hiliteColor', 'align',],
                                    // ['removeFormat'], ['table', 'link', 'image', 'video'], ['codeView', 'fullScreen'], ['print']],
                                    imageResizing: false

                                }}
                                // onImageUpload={this.uploadImg}
                                // onImageUploadBefore={this.onImageUploadBefore}
                                setContents={cardUpdate.value}

                            />
                            <div className="updates-bottom-btns flex space-between align-center">
                                <label className="upload-file-label"><CloudUploadIcon /> Upload image
                                    <input type="file" onChange={this.uploadImg} /></label>
                                <button className="card-update-btn add-item">Update</button>
                            </div>

                        </form>

                    </div>
                    <div className="updates-container">
                        <div dangerouslySetInnerHTML={{ __html: htmlUpdates }} />
                    </div>
                </section>
            </>
        )

    }
}



const mapGlobalStateToProps = (state) => {
    return {
        loggedInUser: state.userReducer.loggedInUser,
        boards: state.boardReducer.boards,
    }
}

const mapDispatchToProps = {
    getKeyById,
    addCardUpdate
}


export const CardUpdates = connect(mapGlobalStateToProps, mapDispatchToProps)(_CardUpdates);




