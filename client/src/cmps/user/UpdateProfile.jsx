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
        triggerMsg: false,
        isLoading: false
    }

    validatePhoneNumber = (tel) => {
        const isValid = /^(?:(?:(\+?972|\(\+?972\)|\+?\(972\))(?:\s|\.|-)?([1-9]\d?))|(0[23489]{1})|(0[57]{1}[0-9]))(?:\s|\.|-)?([^0\D]{1}\d{2}(?:\s|\.|-)?\d{4})$/gm.test(tel);
        return isValid;
    }

    componentDidMount() {
        const { user } = this.props;
        this.setState({ user });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.user !== this.props.user) this.setState({ user: this.props.user })

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

    uploadImg = (ev) => {
        if (!ev.target.files[0]) return
        this.setState({ isLoading: true }, async () => {
            const imgUrl = await cloudinaryService.uploadImg(ev.target.files[0]);
            const userCopy = { ...this.state.user };
            userCopy["imgUrl"] = imgUrl;
            this.setState({ user: userCopy, isLoading: false });
        })
    }

    onUpdateProfile = async (ev) => {
        ev.preventDefault();
        const { user, isLoading } = this.state;
        if (isLoading) return this.onTriggerMsg('Please wait for loading your image')
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
        await this.props.updateUser(user, 'updateDetails');
        this.onTriggerMsg('Profile updated successfully!');
    }
    //    {!isLoading ? <h3>{user.imgUrl ? 'Change' : 'Upload'}</h3>
    //                             : <h3>Loading</h3>}
    //                     </div>
    render() {
        const { user, triggerMsg, isLoading } = this.state;
        return <div className="update-profile-container">
            <div className="update-profile-inner-container">
                <form onSubmit={this.onUpdateProfile}>
                    {!isLoading ? <div className={isLoading ? 'loading-img' : ''}>
                        <label>{user.imgUrl ? <div className="user-hover relative">
                            <img className={`user-thumbnail ${isLoading ? 'loading-img' : ''}`} src={user.imgUrl} alt="profile" />
                            <h3 className={isLoading ? 'loading' : ''} >{isLoading ? 'Loading' : 'Change'} </h3>
                        </div> :

                            <div className="user-hover relative">
                                <span className={`user-thumbnail ${isLoading ? 'loading-img' : ''}`}>{utilService.getNameInitials(user.fullname)}</span>

                                <h3 className={isLoading && !user.imgUrl ? 'loading' : ''} >{isLoading ? 'Loading' : 'Upload'} </h3>
                            </div>
                        }
                            <input onChange={this.uploadImg} type="file" />


                        </label>
                    </div> :
                        <div className="user-thumbnail loader-img-container" style={{ filter: 'unset' }}>
                            <img className="loader-img" src="https://i.gifer.com/7SMw.gif" />
                        </div>}
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
        user: state.userReducer.loggedInUser,
    }
}
const mapDispatchToProps = {
    updateUser
}


export const UpdateProfile = connect(mapGlobalStateToProps, mapDispatchToProps)(_UpdateProfile);



