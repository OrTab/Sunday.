import { useState } from "react"
import DeleteIcon from '@material-ui/icons/Delete';
import { ConfirmModal } from "./ConfirmModal";

export function Label({ label, onDeleteLabel, labelGroup, setCurrLabel, isEditLabel, labelType }) {
    const [isInDeleteMode, setIsInDeleteMode] = useState(false)
    return (
        <div
            className="labels-menu-item"
            onClick={() => setCurrLabel(label, labelGroup, labelType)}
            // onMouseEnter={() => setIsShowOpt(true)}
            // onMouseLeave={() => {
            //     setIsShowOpt(false)
            // }}
            style={{ backgroundColor: label.color }}
        >
            {label.text}
            {isEditLabel &&
                < DeleteIcon className="opt-icon"
                    onClick={(ev) => {
                        ev.stopPropagation()
                        if (label.isActive) setIsInDeleteMode(true)
                        else onDeleteLabel(label.id, { labelGroup, labelType })
                    }}
                />}

            {isInDeleteMode &&
                <ConfirmModal
                    id={label.id}
                    arg={{ labelGroup, labelType }}
                    onApprove={onDeleteLabel}
                    close={() => setIsInDeleteMode(false)}
                    isInDeleteMode={isInDeleteMode}
                    title={label.text}
                    isDeleteLabel={true}
                />}
        </div>

    )
}
