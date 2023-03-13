import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import jwt_decode from 'jwt-decode';
import './App.css';
import { publicRouter, restrictRoutes } from '~/routes';
import Topbar from './components/Topbar/Topbar';
import Sidebar from './components/Sidebar/Sidebar';
import { setCurrentUser } from '~/features/user/userSlice';
import axiosClient from './api/axiosClient';
import Login from './pages/Login';

function App() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const accessToken = localStorage.getItem('mynhbake_token');

    useEffect(() => {
        if (accessToken) {
            //Check token expired
            const jwtPayload = jwt_decode(accessToken);

            const getUserInfor = async () => {
                const res = await axiosClient.get('user/userInfo');
                dispatch(setCurrentUser(res.data));
            };
            if (!(jwtPayload.exp * 1000 < new Date().getTime())) {
                getUserInfor();
            } else {
                //Hết hạn
            }
        }
    }, []);
    const user1 = null;
    return (
        <Router>
            <div className="App">
            
                <div>
                    <Routes>
                        {/* {restrictRoutes.map((route, index) => {
                            const Page = route.component;
                            return <Route key={index} path={route.path} element={<Page />} />;
                        })} */}
                        {user.role !== 'admin' ? (
                            <Route path="/login" element={<Login />} />
                        ) : }
                        
                    </Routes>
                </div>
                
                    <>
                        <Topbar />
                        <div className="container">
                            <div className="sidebar">
                                <Sidebar />
                            </div>

                            <Routes>
                                {publicRouter.map((route, index) => {
                                    const Page = route.component;
                                    return <Route key={index} path={route.path} element={<Page />} />;
                                })}
                            </Routes>
                        </div>
                    </>
                
            </div>
        </Router>
    );
}

export default App;
