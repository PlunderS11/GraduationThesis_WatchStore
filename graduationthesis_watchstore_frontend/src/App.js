import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import ScrollToTop from './layouts/components/ScrollToTop/ScrollToTop';
import MasterLayout from './layouts/Masterlayout/MasterLayout';
import { publicRouter, restrictRoutes } from './routes';
import { setCurrentUser } from './features/user/userSlice';
import axiosClient from './api/axiosClient';

function App() {
    const dispatch = useDispatch();
    const token = useSelector(state => state.user.token);
    const [lastSessionLoaded, setLastSessionLoaded] = useState(false);

    //Check access token exists in local storage
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
        setLastSessionLoaded(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);
    return (
        <>
            {lastSessionLoaded && (
                <ScrollToTop>
                    <MasterLayout>
                        <Routes>
                            {/* publicRouter */}
                            {publicRouter.map((router, i) => {
                                const Page = router.component;
                                return <Route key={i} path={router.path} element={<Page />} />;
                            })}
                            {/* restrictRoutes */}
                            {restrictRoutes.map((router, i) => {
                                const Page = router.component;
                                return <Route key={i} path={router.path} element={<Page />} />;
                            })}
                        </Routes>
                    </MasterLayout>
                </ScrollToTop>
            )}
        </>
    );
}

export default App;
