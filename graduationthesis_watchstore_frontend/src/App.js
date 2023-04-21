import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import OneSignal from 'react-onesignal';

import ScrollToTop from './layouts/components/ScrollToTop/ScrollToTop';
import MasterLayout from './layouts/Masterlayout/MasterLayout';
import { publicRouter } from './routes';
import { fetchUserInfor } from './features/user';
import runOneSignal from './OneSignal';
import axiosClient from './api/axiosClient';

function App() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector(state => state.user.token);
    const [lastSessionLoaded, setLastSessionLoaded] = useState(false);
    //Check access token exists in local storage
    const accessToken = localStorage.getItem('mynhbake_token');
    useEffect(() => {
        if (accessToken) {
            //Check token expired
            const jwtPayload = jwt_decode(accessToken);

            if (!(jwtPayload.exp * 1000 < new Date().getTime())) {
                dispatch(fetchUserInfor());
            } else {
                //Hết hạn
            }
        }
        setLastSessionLoaded(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, accessToken]);

    useEffect(() => {
        runOneSignal();
    }, []);

    OneSignal.on('subscriptionChange', async function (isSubscribed) {
        isSubscribed
            ? await axiosClient.post('onesignal/sub', { oneSignalId: localStorage.getItem('oneSignalId') })
            : await axiosClient.delete('onesignal/unsub', { data: { oneSignalId: localStorage.getItem('oneSignalId') } });
    });
    useEffect(() => {
        location.pathname === '/home' && navigate('/');
        location.pathname === '/account' && navigate('/account/profile');
    }, [location, navigate]);
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
                        </Routes>
                    </MasterLayout>
                </ScrollToTop>
            )}
        </>
    );
}

export default App;
