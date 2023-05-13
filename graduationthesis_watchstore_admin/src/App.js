import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';
import './App.css';
import MasterLayout from './layouts/MasterLayout ';
import Topbar from './components/Topbar/Topbar';
import MenuSideBar from './components/Menu/MenuSideBar';
import { setCurrentUser } from '~/features/user/userSlice';
import Home from '~/pages/Home';
import Login from '~/pages/Login';
import UserList from '~/pages/UserList';
import ProductList from '~/pages/ProductList';
import CollectionList from './pages/CollectionList';
import PromotionList from './pages/PromotionList';
import OrderList from './pages/OrderList';
import UserRankList from './pages/UserRankList/UserRankList';
import StaffList from './pages/StaffList/StaffList';
import NewsList from './pages/NewsList/NewsList';
import runOneSignal from './oneSignal';
import OneSignal from 'react-onesignal';
import axiosClient from './api/axiosClient';
import NotificationList from './pages/NotificationList/NotificationList';
import MyErrorBoundary from './layouts/ErrorBoundary/ErrorBoundary';

function App() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const accessToken = localStorage.getItem('mynhbake_token');

    useEffect(() => {
        if (accessToken) {
            //Check token expired
            const jwtPayload = jwt_decode(accessToken);

            if (!(jwtPayload.exp * 1000 < new Date().getTime())) {
                dispatch(setCurrentUser(accessToken));
            } else {
                //Hết hạn
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        runOneSignal();
    }, []);

    OneSignal.on('subscriptionChange', async function (isSubscribed) {
        console.log(isSubscribed);
        isSubscribed
            ? await axiosClient.post('/onesignal/sub', { oneSignalId: localStorage.getItem('oneSignalId.bmd') })
            : await axiosClient.delete('/onesignal/unsub', {
                  data: { oneSignalId: localStorage.getItem('oneSignalId.bmd') },
              });
    });

    return (
        <MasterLayout>
            <Router>
                <MyErrorBoundary>
                    <Routes>
                        <Route
                            exact
                            path="/"
                            element={
                                user.user.role === 'admin' ? (
                                    <>
                                        <Topbar />
                                        <div className="container">
                                            <div className="sidebar">
                                                {/* <Sidebar /> */}
                                                <MenuSideBar />
                                            </div>
                                            <Home />
                                        </div>
                                    </>
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />
                        <Route
                            path="/login"
                            element={user.user.role === 'admin' ? <Navigate to="/" replace /> : <Login />}

                            // element={<Login />}
                        />
                        <Route
                            path="/users"
                            element={
                                <>
                                    <Topbar />
                                    <div className="container">
                                        <div className="sidebar">
                                            {/* <Sidebar /> */}
                                            <MenuSideBar />
                                        </div>
                                        <UserList />
                                    </div>
                                </>
                            }
                        />
                        <Route
                            path="/products"
                            element={
                                <>
                                    <Topbar />
                                    <div className="container">
                                        <div className="sidebar">
                                            {/* <Sidebar /> */}
                                            <MenuSideBar />
                                        </div>
                                        <ProductList />
                                    </div>
                                </>
                            }
                        />
                        <Route
                            path="/collections"
                            element={
                                <>
                                    <Topbar />
                                    <div className="container">
                                        <div className="sidebar">
                                            {/* <Sidebar /> */}
                                            <MenuSideBar />
                                        </div>
                                        <CollectionList />
                                    </div>
                                </>
                            }
                        />
                        <Route
                            path="/promotions"
                            element={
                                <>
                                    <Topbar />
                                    <div className="container">
                                        <div className="sidebar">
                                            {/* <Sidebar /> */}
                                            <MenuSideBar />
                                        </div>
                                        <PromotionList />
                                    </div>
                                </>
                            }
                        />
                        <Route
                            path="/orders"
                            element={
                                <>
                                    <Topbar />
                                    <div className="container">
                                        <div className="sidebar">
                                            {/* <Sidebar /> */}
                                            <MenuSideBar />
                                        </div>
                                        <OrderList />
                                    </div>
                                </>
                            }
                        />
                        <Route
                            path="/ranks"
                            element={
                                <>
                                    <Topbar />
                                    <div className="container">
                                        <div className="sidebar">
                                            {/* <Sidebar /> */}
                                            <MenuSideBar />
                                        </div>
                                        <UserRankList />
                                    </div>
                                </>
                            }
                        />
                        <Route
                            path="/staffs"
                            element={
                                <>
                                    <Topbar />
                                    <div className="container">
                                        <div className="sidebar">
                                            {/* <Sidebar /> */}
                                            <MenuSideBar />
                                        </div>
                                        <StaffList />
                                    </div>
                                </>
                            }
                        />
                        <Route
                            path="/news"
                            element={
                                <>
                                    <Topbar />
                                    <div className="container">
                                        <div className="sidebar">
                                            {/* <Sidebar /> */}
                                            <MenuSideBar />
                                        </div>
                                        <NewsList />
                                    </div>
                                </>
                            }
                        />
                        <Route
                            path="/notifications"
                            element={
                                <>
                                    <Topbar />
                                    <div className="container">
                                        <div className="sidebar">
                                            {/* <Sidebar /> */}
                                            <MenuSideBar />
                                        </div>
                                        <NotificationList />
                                    </div>
                                </>
                            }
                        />
                    </Routes>
                </MyErrorBoundary>
            </Router>
        </MasterLayout>
    );
}

export default App;
