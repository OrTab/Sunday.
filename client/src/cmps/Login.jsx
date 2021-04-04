import { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { checkLogin } from '../store/actions/userAction.js'
import { loadBoards } from '../store/actions/boardAction.js'
import TextField from '@material-ui/core/TextField';
import { updateUserNotifications } from '../store/actions/userAction.js'





import { HomeHeader } from '../cmps/HomeHeader.jsx';

class _Login extends Component {

    state = {
        msg: '',
        loggedinUser: '',
        loginCred: {
            username: '',
            password: '',
        }
    }

    loginHandleChange = ev => {
        const { name, value } = ev.target
        this.setState(prevState => ({
            loginCred: {
                ...prevState.loginCred,
                [name]: value
            }
        }))
    }

    doLogin = async ev => {
        ev.preventDefault()
        const { username, password } = this.state.loginCred
        if (!username || !password) {
            this.setState({ msg: 'Please enter username/password' })
            return
        } try {
            
            const user = await this.props.checkLogin({ ...this.state.loginCred })
            if (user) {              
                const boards = await this.props.loadBoards(user._id)
                const path = (boards.length) ? `/board/${boards[0]._id}` : '/board'
                this.props.history.push(path)
            }
        } catch (err) {
            this.setState({ msg: 'Wrong username/password' })
        }

    }

    render() {
        return (
            <div className="main-login-signup-container">
                <HomeHeader/>
                <div className="inner-login-signup-container">
                    <div>
                        <h2>Welcome back</h2>
                        <h3>Log in</h3>
                    </div>
                    <form onSubmit={this.doLogin} className="sunday-form">
                        <TextField margin="normal" required name="username" placeholder="Username" autoFocus
                            onChange={this.loginHandleChange} />
                        <TextField
                            required
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={this.loginHandleChange}
                        />
                        <h3>{this.state.msg}</h3>
                        <button className="login-signup-btn" type="submit">Sign in</button>
                    </form>
                    <Link to="/signup">Don't have an account? <b>Sign Up</b></Link>
                </div>
            </div>
        );
    }

}

const mapGlobalStateToProps = (state) => {
    return {
        boards: state.boardReducer.boards,
    }
}
const mapDispatchToProps = {
    checkLogin,
    loadBoards,
    updateUserNotifications
}
export const Login = connect(mapGlobalStateToProps, mapDispatchToProps)(_Login)

