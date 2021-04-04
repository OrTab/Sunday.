import { Login } from "./cmps/Login";
import { SignUp } from "./cmps/SignUp";
import { BoardApp } from "./pages/BoardApp";
import { Home } from "./pages/Home";
import { UserProfile } from "./pages/user/UserProfile";


export const routes = [
    // {
    //     path:'/board/edit/:boardId?',
    //     component:BoardEdit
    // },
    {
        path: '/board/:boardId',
        component: BoardApp
    },
    {
        path: '/user/:userId',
        component: UserProfile
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/board',
        component: BoardApp
    },
    {
        path: '/signup',
        component: SignUp
    },
    {
        path: '/',
        component: Home
    }

]
