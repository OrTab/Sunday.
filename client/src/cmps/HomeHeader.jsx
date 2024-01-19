import React, { Component } from "react";
import { NavLink, withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import sunday from "../assets/img/sunday-logo.svg";
import {
  checkLogin,
  updateUserNotifications,
} from "../store/actions/userAction.js";
import { loadBoards } from "../store/actions/boardAction.js";
import { socketService } from "../services/socketService";

class _HomeHeader extends Component {
  state = {
    isNavOpen: false,
    isScrolled: false,
    scrollTop: 0,
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const excludedRoutes = ["/", "/login", "/signup"];
    if (
      window.scrollY > 0 &&
      excludedRoutes.indexOf(this.props.location.pathname) > 0
    ) {
      document.querySelector(".home-header-container").className =
        "flex home-header-container header-shadow";
    } else if (excludedRoutes.indexOf(this.props.location.pathname) > 0) {
      document.querySelector(".home-header-container").className =
        "flex home-header-container";
    }
  };

  toggleMobileNav = () => {
    const { isNavOpen } = this.state;
    this.setState({ isNavOpen: !isNavOpen });
  };

  render() {
    const { isNavOpen } = this.state;
    return (
      <header
        ref={this.scrollRef}
        onScroll={this.onScroll}
        className={`home-header-container flex`}
      >
        <Link to='/'>
          {" "}
          <img src={sunday} alt='sunday logo' />{" "}
        </Link>
        <nav>
          <div
            className={`hamburger ${isNavOpen ? "open" : ""}`}
            onClick={this.toggleMobileNav}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul className={`flex nav-list ${isNavOpen ? "open-nav" : ""}`}>
            <li>
              <NavLink activeClassName='nav-active' to='/login'>
                Log in
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName='nav-active' to='/signup'>
                Sign up
              </NavLink>
            </li>
            <li>
              <button
                className='home-header-login-btn'
                onClick={async () => {
                  try {
                    const user = await this.props.checkLogin({
                      username: "or-tab",
                      password: "12345678",
                    });
                    if (user) {
                      const boards = await this.props.loadBoards(user._id);
                      const path = boards.length
                        ? `/board/${boards[0]._id}`
                        : "/board";
                      this.props.history.push(path);
                    }
                  } catch (err) {
                    // console.log(err);
                  }
                }}
              >
                Try as guest
              </button>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

const mapGlobalStateToProps = (state) => {
  return {
    user: state.userReducer.user,
  };
};

const mapDispatchToProps = {
  checkLogin,
  loadBoards,
  updateUserNotifications,
};

export const HomeHeader = withRouter(
  connect(mapGlobalStateToProps, mapDispatchToProps)(_HomeHeader)
);
