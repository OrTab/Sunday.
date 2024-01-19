import React from 'react'
import ReactTooltip from 'react-tooltip'

export function FilterOptions({ labels, onSetFilterLabels, content }) {
    return (
        <div>
            {Object.keys(labels).map((key, idx) => {
                return < div key={idx} data-tip data-for={`${content}${key}`}
                    className={`item ${labels[key].isSelect ? 'selected' : ''}`} onClick={(ev) => onSetFilterLabels(content, key)}>
                    <span className="status-circle" style={{ background: labels[key].color }}></span>
                    <span>{key}</span>
                    <ReactTooltip className="sunday-tooltip" id={`${content}${key}`} place="bottom" effect="solid">
                        {`${content.charAt(0).toUpperCase()+content.substring(1)} is ${key}`}
                    </ReactTooltip>
                </div>
            })}
        </div>
    )
}

