import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import sunday from '../assets/img/sunday-logo.svg';
import { NON_PRODUCT_ROUTES } from '../constants';
import { useDispatch } from 'react-redux';
import { checkLogin } from '../store/actions/userAction';

export const HomeHeader = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const dispatch = useDispatch();
    const checkGuestLogin = () => {
        dispatch(checkLogin({ username: 'or-tab', password: '12345678' }));
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScroll = () => {
        if (
            window.scrollY > 0 &&
            NON_PRODUCT_ROUTES.indexOf(window.location.pathname) > 0
        ) {
            document.querySelector('.home-header-container').className =
                'flex home-header-container header-shadow';
        } else if (NON_PRODUCT_ROUTES.indexOf(window.location.pathname) > 0) {
            document.querySelector('.home-header-container').className =
                'flex home-header-container';
        }
    };

    const toggleMobileNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    return (
        <header className={`home-header-container flex`}>
            <Link to="/">
                {' '}
                <img src={sunday} alt="sunday logo" />{' '}
            </Link>
            <nav>
                <div
                    className={`hamburger ${isNavOpen ? 'open' : ''}`}
                    onClick={toggleMobileNav}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <ul className={`flex nav-list ${isNavOpen ? 'open-nav' : ''}`}>
                    <li>
                        <NavLink activeClassName="nav-active" to="/login">
                            Log in
                        </NavLink>
                    </li>
                    <li>
                        <NavLink activeClassName="nav-active" to="/signup">
                            Sign up
                        </NavLink>
                    </li>
                    <li>
                        <button
                            className="home-header-login-btn"
                            onClick={checkGuestLogin}
                        >
                            Try as guest
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    );
};
