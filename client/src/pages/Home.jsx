import React from 'react'
import undrawtask from '../assets/img/undrawtask.svg';
import { HomeHeader } from '../cmps/HomeHeader';
import { connect, useDispatch } from 'react-redux';
import { checkLogin, updateUserNotifications } from '../store/actions/userAction.js'
import { loadBoards } from '../store/actions/boardAction.js'
import { useEffect } from 'react';

export function _Home(props) {
   
    return <div className="home-main-container">
        <HomeHeader />
        <div className="home-hero">
            <div className="home-hero-inner" >
                <div className="home-hero-titles flex">
                    <h2>Join the <span>Sunday</span> revolution</h2>
                    <h3>Manage your project with the team, all in one workspace</h3>
                    <button onClick={async () => {
                        try {
                            const user = await props.checkLogin({
                                username: "guest",
                                password: "12345678"
                            })
                            if (user) {
                                const boards = await props.loadBoards(user._id)
                                const path = (boards.length) ? `/board/${boards[0]._id}` : '/board'
                                props.history.push(path)
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }}>Get started!</button>
                </div>
                <img src={undrawtask} alt="undraw task img" />
            </div>
        </div>
    </div>
}


const mapGlobalStateToProps = (state) => {
    return {}
}
const mapDispatchToProps = {
    checkLogin,
    loadBoards,
    updateUserNotifications
}
export const Home = connect(mapGlobalStateToProps, mapDispatchToProps)(_Home)

