import { useEffect } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import './assets/styles/main.scss';
import { Login } from './cmps/Login';
import { SignUp } from './cmps/SignUp';
import { BoardApp } from './pages/BoardApp';
import { Home } from './pages/Home';
import { UserProfile } from './pages/user/UserProfile';
import { socketService } from './services/socketService';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { NON_PRODUCT_ROUTES } from './constants';

const isInProduct = () =>
    !NON_PRODUCT_ROUTES.includes(window.location.pathname);

const Guards = () => {
    const { loggedInUser } = useSelector(state => state.userReducer);
    const history = useHistory();

    useEffect(() => {
        if (loggedInUser) {
            if (!isInProduct()) {
                history.push('/board');
            }
        } else {
            if (isInProduct()) {
                history.push('/');
            }
        }
        return () => {
            socketService.terminate();
        };
    }, [history, loggedInUser]);

    useEffect(() => {
        return () => {
            socketService.terminate();
        };
    }, []);

    return null;
};
export function App() {
    return (
        <div className="App">
            <Router>
                <Guards />
                <Switch>
                    <Route path="/board/:boardId" component={BoardApp} />
                    <Route path="/user/:userId" component={UserProfile} />
                    <Route path="/board" component={BoardApp} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/signUp" component={SignUp} />
                    <Route exact path="/" component={Home} />
                </Switch>
            </Router>
        </div>
    );
}
