import React from 'react';
import undrawtask from '../assets/img/undrawtask.svg';
import { HomeHeader } from '../cmps/HomeHeader';
import { useDispatch } from 'react-redux';
import { checkLogin } from '../store/actions/userAction';

export function Home() {
    const dispatch = useDispatch();
    const checkGuestLogin = () => {
        dispatch(checkLogin({ username: 'or-tab', password: '12345678' }));
    };
    return (
        <div className="home-main-container">
            <HomeHeader checkGuestLogin={checkGuestLogin} />
            <div className="home-hero">
                <div className="home-hero-inner">
                    <div className="home-hero-titles flex">
                        <h2>
                            Join the <span>Sunday</span> revolution
                        </h2>
                        <h3>
                            Manage your project with the team, all in one
                            workspace
                        </h3>
                        <button onClick={checkGuestLogin}>Get started!</button>
                    </div>
                    <img src={undrawtask} alt="undraw task img" />
                </div>
            </div>
        </div>
    );
}
