import { useEffect } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import "./assets/styles/main.scss";
import { Login } from "./cmps/Login";
import { SignUp } from "./cmps/SignUp";
import { BoardApp } from "./pages/BoardApp";
import { Home } from "./pages/Home";
import { UserProfile } from "./pages/user/UserProfile";
import { socketService } from "./services/socketService";

export function App() {
  useEffect(() => {
    return () => {
      socketService.terminate();
    };
  }, []);
  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route path='/board/:boardId' component={BoardApp} />
          <Route path='/user/:userId' component={UserProfile} />
          <Route path='/board' component={BoardApp} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signUp' component={SignUp} />
          <Route exact path='/' component={Home} />
        </Switch>
      </Router>
    </div>
  );
}
