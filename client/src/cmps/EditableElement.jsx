import React, { Component } from 'react'

export class EditableElement extends Component {


    state = {
        title: this.props.children,
        isEdit: true
    }
    handleChange = (ev) => {
        const title = ev.currentTarget.innerText
        this.setState({ title })
    }

    checkKey = async (ev) => {
        if ((ev.key === 'Enter' || ev.type === 'blur')/* &&this.state.title!==this.props.children */) {
            this.setState({ isEdit: false })
            const title = (this.state.title) ? this.state.title : 'New Title'
            setTimeout(() => {
                this.setState({ isEdit: true })
                this.props.onChangeTitle(title)
            }, 200)
        }
    }
    render() {
        const { isEdit } = this.state
        return (
            <>
                <div onKeyDown={this.checkKey}
                    className="editable-element"
                    onBlur={this.checkKey}
                    contentEditable={isEdit}
                    suppressContentEditableWarning={true}
                    spellCheck="false"
                    onInput={this.handleChange}
                >{this.props.children}</div>
            </>
        )
    }
}
