import { Component } from 'react';
import { connect } from 'react-redux';
import { signup } from '../store/actions/userAction.js'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link } from 'react-router-dom'
import TextField from '@material-ui/core/TextField';
import { utilService } from '../services/utilService.js';
import { VisibilityOff, Visibility } from '@material-ui/icons';
import { HomeHeader } from './HomeHeader.jsx';



class _SignUp extends Component {

    state = {
        msg: '',
        signupCred: {
            username: '',
            password: '',
            fullname: '',
            email: '',
            confirm: ''
        },
        isShowPassword: false
    }

    onSignUp = async (user) => {

        const { username, password, fullname, email } = user
        try {
            await this.props.signup({ username, password, fullname, email })
            this.setState(prevState => ({ signupCred: { ...prevState.signupCred, password: '', confirm: '', username: '', fullname: '', email: 'signupCred' } }))
            this.props.history.push('/board')
        } catch (err) {
            this.setState({ msg: 'Try again' })
        }

    }

    onTogglePassword = () => {
        this.setState(prevState => ({ ...prevState, isShowPassword: !this.state.isShowPassword }))
    }


    validate = (values) => {
        this.setState({ signupCred: values })
        const errors = {};
        if (!values.username) {
            errors.username = 'Required';
        }
        if (!values.fullname) {
            errors.fullname = 'Required';
        }
        if (!values.email) {
            errors.email = 'Required';
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
            errors.email = 'Invalid email address';
        }
        // if (!values.password) {
        //     // errors.password = 'Password is too short'
        //     errors.password = 'Required';
        // }else if(!/^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$/i.test(values.password))
        // {
        //     errors.password='Weak password'
        // }
        if (values.password !== values.confirm) errors.confirm = 'Password don`t match!!! '
        if (!values.confirm) errors.email = 'Required';
        return errors;
    }


    onGetRandomPassword = (ev) => {
        ev.preventDefault()
        const pass = utilService.getRandomPassword()
        this.setState(prevState => ({ signupCred: { ...prevState.signupCred, password: pass, confirm: pass } }))
    }


    render() {
        const { isShowPassword } = this.state
        const inputType = (isShowPassword) ? 'text' : 'password';
        return (
            <>
                <div className="main-login-signup-container">
                    <HomeHeader />
                    <div className="inner-login-signup-container">
                        <h2>Let's get started!</h2>
                        <h3>Sign up</h3>
                        <Formik
                            enableReinitialize={true}
                            initialValues={this.state.signupCred}
                            validate={this.validate}
                            onSubmit={this.onSignUp}>
                            {() => (
                                <Form className="sunday-form signup-fields-arranegment">
                                    <div>
                                        <Field placeholder="Username" autoFocus type="text" name="username" autoComplete="off" required as={TextField} />
                                        <ErrorMessage name="fullname" className="err-msg" />
                                    </div>
                                    <div>
                                        <Field required placeholder="Fullname" type="text" name="fullname" as={TextField} />
                                        <ErrorMessage name="fullname" className="err-msg" />
                                    </div>
                                    <div className="password-container">
                                        <div className="relative password-inner-container">
                                            <Field placeholder="Password" type={inputType} name="password" as={TextField} />
                                            <ErrorMessage name="password" className="err-msg" />
                                            {!isShowPassword && <Visibility onClick={() => this.onTogglePassword()} />}
                                            {isShowPassword && <VisibilityOff onClick={() => this.onTogglePassword()} />}
                                        </div>
                                        <div className="password-inner-container">
                                            <Field placeholder="Confirm password" type="password" name="confirm" as={TextField} />
                                            <ErrorMessage name="confirm" className="err-msg" />
                                        </div>
                                        <button onClick={(ev) => this.onGetRandomPassword(ev)}>
                                            Get strong password
                                    </button>
                                    </div>
                                    <div>
                                        <Field placeholder="Email" type="email" name="email" as={TextField} />
                                        <ErrorMessage name="email" className="err-msg" />
                                    </div>
                                    <button className="login-signup-btn" type="submit">Sign up</button>

                                </Form>
                            )
                            }
                        </Formik>
                        <Link to="/login">Already have an account? <b>Log in</b></Link>
                    </div>
                </div >
            </>
        );
    }

}


const mapGlobalStateToProps = (state) => {
    return {
    }
}
const mapDispatchToProps = {
    signup

}
export const SignUp = connect(mapGlobalStateToProps, mapDispatchToProps)(_SignUp)







