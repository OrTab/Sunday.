import React from 'react'
import clouds from '../assets/img/clouds.svg'
export const NoResultsPlaceholder = ({msg}) => {
    return (
        <div className="no-results">
            <img src={clouds} alt="clouds" style={{ maxWidth: "200px" }} />
            <h2 style={{ fontWeight: "300" }}>{msg}</h2>
        </div>
    )
}
