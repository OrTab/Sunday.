import React from 'react'
import { MemberPreview } from './MemberPreview'

export const MemberList = ({ members, onUpdateMembers, type }) => {
    return (
        <>
            {members.map(member => {
                return <MemberPreview
                    key={member._id}
                    member={member}
                    onUpdateMembers={onUpdateMembers}
                    type={type} />
            })}
        </>
    )
}
