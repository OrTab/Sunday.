import { useState } from 'react';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { HomeHeader } from '../cmps/HomeHeader.jsx';
import { useDispatch } from 'react-redux';
import { checkLogin } from '../store/actions/userAction.js';

export const Login = () => {
    const [msg, setMsg] = useState('');
    const [loginCred, setLoginCred] = useState({
        username: '',
        password: ''
    });
    const dispatch = useDispatch();
    const loginHandleChange = ev => {
        const { name, value } = ev.target;
        setLoginCred(prev => ({ ...prev, [name]: value }));
    };

    const doLogin = async ev => {
        ev.preventDefault();
        const { username, password } = loginCred;
        if (!username || !password) {
            setMsg('Please enter username/password');
            return;
        }
        try {
            dispatch(checkLogin(loginCred));
        } catch (err) {
            setMsg('Wrong username/password');
        }
    };

    return (
        <div className="main-login-signup-container">
            <HomeHeader />
            <div className="inner-login-signup-container">
                <div>
                    <h2>Welcome back</h2>
                    <h3>Log in</h3>
                </div>
                <form onSubmit={doLogin} className="sunday-form">
                    <TextField
                        margin="normal"
                        name="username"
                        placeholder="Username"
                        autoFocus
                        onChange={loginHandleChange}
                    />
                    <TextField
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={loginHandleChange}
                    />
                    <h3>{msg}</h3>
                    <button className="login-signup-btn" type="submit">
                        Sign in
                    </button>
                </form>
                <Link to="/signup">
                    Don't have an account? <b>Sign Up</b>
                </Link>
            </div>
        </div>
    );
};
