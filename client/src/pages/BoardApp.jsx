import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MainSideBar } from '../cmps/MainSideBar';
import { BoardSideBar } from '../cmps/BoardSideBar';
import { BoardPreview } from '../cmps/BoardPreview';
import {
    loadBoards,
    removeBoard,
    getBoardById,
    addBoard,
    updateBoards,
    setBoardMembers
} from '../store/actions/boardAction.js';
import {
    logOut,
    setMsg,
    updateReadNotifications,
    cleanNotifications,
    updateUserNotifications
} from '../store/actions/userAction.js';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { boardService } from '../services/boardService';
import { socketService } from '../services/socketService';
import { Route } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { CardUpdates } from '../cmps/CardUpdates';
import { Loader } from '../assets/img/Loader';
import { NoResultsPlaceholder } from '../cmps/NoResultsPlaceholder';
import { userService } from '../services/userService';

export const BoardApp = ({ match, history }) => {
    const [isBoardSideBarOpen, setIsBoardSideBarOpen] = useState(
        window.innerWidth >= 800
    );
    const [boardTitle, setBoardTitle] = useState('');
    const dispatch = useDispatch();
    const { msg, loggedInUser } = useSelector(state => state.userReducer);
    const { boards, board, isScroll, isLoading } = useSelector(
        state => state.boardReducer
    );
    const [action, setAction] = useState('');

    useEffect(() => {
        const { boardId } = match.params;
        if (!boardId) return;
        if (boardId !== board?._id) {
            dispatch({ type: 'SET_LOADING', isLoading: true });
        }
        if (window.innerWidth <= 800) {
            setIsBoardSideBarOpen(false);
        }
        if (boardTitle) {
            setBoardTitle('');
        }
        socketService.emit('joinBoard', boardId);
        dispatch(getBoardById(boardId));
    }, [match.params]);

    useEffect(() => {
        if (board) {
            initializeBoardMembers();
        }
    }, [board?.members]);

    useEffect(() => {
        if (isScroll) setIsBoardSideBarOpen(false);
    }, [isScroll]);

    useEffect(() => {
        initializeBoards();
        return () => {
            socketService.off('boardUpdate', updateBoardsInStore);
            // socketService.off('updateUser', updateUserInStore)
        };
    }, []);

    useEffect(() => {
        if (action === 'add') {
            history.push(`/board/${boards[boards.length - 1]._id}`);
            setAction('');
        } else if (action === 'load') {
            if (boards.length) {
                socketService.emit(
                    'setUserBoards',
                    boards.map(board => board._id)
                );
                if (!board) history.push(`/board/${boards[0]._id}`);
                else {
                    history.push(`/board/${board._id}`);
                    socketService.emit('boardId', board._id);
                    setAction('');
                }
            } else {
                dispatch({ type: 'SET_LOADING', isLoading: false });
            }
        }
    }, [boards.length]);

    const initializeBoards = async () => {
        if (!loggedInUser) {
            history.push('/');
            return;
        }
        dispatch({ type: 'SET_LOADING', isLoading: true });
        const { boardId } = match.params;
        socketService.setup();
        socketService.emit('userSocket', loggedInUser);
        socketService.emit(
            'setUserBoards',
            boards.map(board => board._id)
        );
        socketService.on('boardUpdate', updateBoardsInStore);
        socketService.on('updateUser', updateUserInStore);
        socketService.on('userDataUpdate', onUpdateUserData);
        socketService.on('updateAllBoards', updateBoardsGenerally);
        if (!boardId && !boards.length) {
            setAction('load');
            dispatch(loadBoards(loggedInUser._id));
        } else if (!boardId && boards.length) {
            history.push(`/board/${boards[0]._id}`);
        } else if (!boards.length && boardId) {
            setAction('load');
            dispatch(loadBoards(loggedInUser._id));
        } else if (boardId) {
            dispatch(getBoardById(boardId));
        }
    };

    const updateBoardsGenerally = board => {
        dispatch({ type: 'UPDATE_BOARDS_GENERALLY', board });
    };

    const onUpdateUserData = updatedUser => {
        dispatch({ type: 'UPDATE_BOARD_MEMBERS', updatedUser });
    };

    const initializeBoardMembers = async () => {
        // const members = await Promise.all(board?.members.map(async memberId => {
        //     return await userService.getUserById(memberId)
        // }))
        const members = await userService.getUsersById(board.members);
        dispatch(setBoardMembers(members));
        setTimeout(dispatch, 1800, { type: 'SET_LOADING', isLoading: false });
    };

    const updateBoardsInStore = board => {
        dispatch(updateBoards(board));
    };

    const updateUserInStore = data => {
        const { board, user, type } = data;
        dispatch(updateUserNotifications(user));
        if (board && type === 'add') dispatch({ type: 'ADD_BOARD', board });
        else if (board && type === 'remove')
            dispatch({ type: 'REMOVE_BOARD', boardId: board._id });
    };

    const onDeleteBoard = async (boardId, boardIdx) => {
        await dispatch(removeBoard(boardId));
        if (boardId === board._id) {
            const currBoardId = boardService.getBoardIdByIdx(boardIdx, boards);
            if (currBoardId) history.push(`/board/${currBoardId}`);
            else {
                dispatch({ type: 'SET_CURR_BOARD', board: null });
                history.push('/board');
            }
        }
        dispatch(setMsg('Board Successfully Deleted'));
    };

    const onAddBoard = async boardTitle => {
        setAction('add');
        await dispatch(addBoard(boardTitle, loggedInUser._id));
        dispatch(setMsg('Board Successfully Added'));
    };

    const getBoardsForDisplay = () => {
        const filterRegex = new RegExp(boardTitle, 'i');
        return boards.filter(board => filterRegex.test(board.title));
    };

    if (!loggedInUser) return <Redirect exact to="/" />;
    if (isLoading || action === 'add') return <Loader />;
    return (
        <div className="board-app-container">
            <MainSideBar
                onLogOut={() => dispatch(logOut())}
                user={loggedInUser}
                onCleanNotifications={() =>
                    dispatch(cleanNotifications(loggedInUser))
                }
                onUpdateNotifications={() =>
                    dispatch(updateReadNotifications(loggedInUser))
                }
            />
            <div className="flex board-and-sidebar-container">
                <div
                    className={`board-sidebar-container ${
                        !isBoardSideBarOpen ? 'closed' : ''
                    }`}
                >
                    <button
                        className="toggle-board-sidebar"
                        onClick={() =>
                            setIsBoardSideBarOpen(!isBoardSideBarOpen)
                        }
                    >
                        {isBoardSideBarOpen ? (
                            <ArrowBackIcon />
                        ) : (
                            <ArrowForwardIcon />
                        )}
                    </button>
                    <BoardSideBar
                        boards={getBoardsForDisplay()}
                        onDeleteBoard={onDeleteBoard}
                        onAddBoard={onAddBoard}
                        user={loggedInUser}
                        onSetFilter={boardTitle => setBoardTitle(boardTitle)}
                    />
                </div>
                {board ? (
                    <BoardPreview />
                ) : (
                    <NoResultsPlaceholder msg="Create your first board..." />
                )}
                <Route
                    path={`${match.path}/card/:cardId`}
                    render={props => {
                        return <CardUpdates board={board} {...props} />;
                    }}
                />
                {msg && <div className="snackbar slide-top">{msg}</div>}
            </div>
        </div>
    );
};
