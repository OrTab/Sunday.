import React, { Component } from 'react'
import { cloudinaryService } from '../../services/cloudinary-service';
import { utilService } from '../../services/utilService';
import { updateUser } from '../../store/actions/userAction';
import { connect } from 'react-redux'

export class _UpdateProfile extends Component {

    state = {
        user: {
            _id: '',
            fullname: '',
            dateofbirth: '',
            imgUrl: '',
            tel: ''
        },
        triggerMsg: false
    }

    validatePhoneNumber = (tel) => {
        const isValid = /^(?:(?:(\+?972|\(\+?972\)|\+?\(972\))(?:\s|\.|-)?([1-9]\d?))|(0[23489]{1})|(0[57]{1}[0-9]))(?:\s|\.|-)?([^0\D]{1}\d{2}(?:\s|\.|-)?\d{4})$/gm.test(tel);
        return isValid;
    }

    componentDidMount() {
        const { user } = this.props;
        this.setState({ user });
    }

    handleChange = (ev) => {
        const { name, value } = ev.target
        const { user } = this.state;
        const userCopy = { ...user };
        userCopy[name] = value;
        this.setState({ user: userCopy })
    }

    onTriggerMsg = (txt) => {
        this.setState({ triggerMsg: txt }, () => {
            setTimeout(() => {
                this.setState({ triggerMsg: '' });
            }, 1500);
        });
    }

    uploadImg = async (ev) => {
        if (!ev.target.files[0]) return
        const imgUrl = await cloudinaryService.uploadImg(ev.target.files[0]);
        const { user } = this.state;
        const userCopy = { ...user };
        userCopy["imgUrl"] = imgUrl;
        this.setState({ user: userCopy });
    }

    onUpdateProfile = async (ev) => {
        ev.preventDefault();
        const { user } = this.state;
        if (!user.fullname || !user.email) {
            this.onTriggerMsg('Please fill required fields');
            return;
        }
        if (user.tel) {
            const isTelValid = this.validatePhoneNumber(user.tel)
            if (!isTelValid) {
                this.onTriggerMsg('Enter valid phone number');
                return;
            }
        }
        await this.props.updateUser(user);
        this.onTriggerMsg('Profile updated successfully!');
    }

    render() {
        const { user, triggerMsg } = this.state;
        return <div className="update-profile-container">
            <div className="update-profile-inner-container">
                <form onSubmit={this.onUpdateProfile}>
                    <div>
                        <label>{user.imgUrl ? <div className="user-hover relative">
                            <img className="user-thumbnail" src={user.imgUrl} alt="profile" />
                            <h3>{user.imgUrl ? 'Change' : 'Upload'}</h3>
                        </div> :
                            <span className="user-thumbnail">{utilService.getNameInitials(user.fullname)}</span>}
                            <input onChange={this.uploadImg} type="file" />
                        </label>
                        <h3>{user.imgUrl ? 'Change' : 'Upload'}</h3>
                    </div>
                    <div>
                        <label aria-required htmlFor="full-name">Full name</label>
                        <input value={user.fullname || ''} onChange={this.handleChange} type="text" placeholder="Full name" name="fullname" id="full-name" />
                    </div>
                    <div>
                        <label htmlFor="date-of-birth">Date of birth</label>
                        <input value={user.dateofbirth || ''} onChange={this.handleChange} type="date" name="dateOfBirth" id="date-of-birth" />
                    </div>
                    <div>
                        <label aria-required htmlFor="email">email</label>
                        <input value={user.email || ''} onChange={this.handleChange} type="email" placeholder="Email" name="email" id="email" />
                    </div>
                    <div>
                        <label htmlFor="tel">Phone number</label>
                        <input value={user.tel || ''} onChange={this.handleChange} type="tel" placeholder="Phone number" name="tel" id="tel" />
                    </div>
                    {triggerMsg && <h4>{triggerMsg}</h4>}
                    <button type="submit">Update profile</button>
                </form>
            </div>
        </div>
    }
}



const mapGlobalStateToProps = (state) => {
    return {
    }
}
const mapDispatchToProps = {
    updateUser
}


export const UpdateProfile = connect(mapGlobalStateToProps, mapDispatchToProps)(_UpdateProfile);



