import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';
import './App.css';
import MasterLayout from './layouts/MasterLayout ';
import Topbar from './components/Topbar/Topbar';
import Sidebar from './components/Sidebar/Sidebar';
import { setCurrentUser } from '~/features/user/userSlice';
import Home from '~/pages/Home';
import Login from '~/pages/Login';
import UserList from '~/pages/UserList';
import User from '~/pages/User';
import NewUser from '~/pages/NewUser';
import ProductList from '~/pages/ProductList';
import Product from '~/pages/Product';
import NewProduct from '~/pages/NewProduct';
import CollectionList from './pages/CollectionList';
import NewCollection from './pages/NewCollection';

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

    return (
        <MasterLayout>
            <Router>
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
                                            <Sidebar />
                                        </div>
                                        <Home />
                                    </div>
                                </>
                            ) : (
                                <Navigate to="login" replace />
                            )
                        }
                    />
                    <Route
                        path="/login"
                        element={user.user.role === 'admin' ? <Navigate to="/" replace /> : <Login />}
                    />
                    <Route
                        path="/users"
                        element={
                            <>
                                <Topbar />
                                <div className="container">
                                    <div className="sidebar">
                                        <Sidebar />
                                    </div>
                                    <UserList />
                                </div>
                            </>
                        }
                    />
                    <Route
                        path="/user/:userId"
                        element={
                            <>
                                <Topbar />
                                <div className="container">
                                    <div className="sidebar">
                                        <Sidebar />
                                    </div>
                                    <User />
                                </div>
                            </>
                        }
                    />
                    <Route
                        path="/newUser"
                        element={
                            <>
                                <Topbar />
                                <div className="container">
                                    <div className="sidebar">
                                        <Sidebar />
                                    </div>
                                    <NewUser />
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
                                        <Sidebar />
                                    </div>
                                    <ProductList />
                                </div>
                            </>
                        }
                    />
                    <Route
                        path="/product/:productId"
                        element={
                            <>
                                <Topbar />
                                <div className="container">
                                    <div className="sidebar">
                                        <Sidebar />
                                    </div>
                                    <Product />
                                </div>
                            </>
                        }
                    />
                    <Route
                        path="/newproduct"
                        element={
                            <>
                                <Topbar />
                                <div className="container">
                                    <div className="sidebar">
                                        <Sidebar />
                                    </div>
                                    <NewProduct />
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
                                        <Sidebar />
                                    </div>
                                    <CollectionList />
                                </div>
                            </>
                        }
                    />
                    <Route
                        path="/newcollection"
                        element={
                            <>
                                <Topbar />
                                <div className="container">
                                    <div className="sidebar">
                                        <Sidebar />
                                    </div>
                                    <NewCollection />
                                </div>
                            </>
                        }
                    />
                </Routes>
            </Router>
        </MasterLayout>
    );
}

export default App;
