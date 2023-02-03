import { Route, Routes } from 'react-router-dom';
import ScrollToTop from './layouts/components/ScrollToTop/ScrollToTop';
import MasterLayout from './layouts/Masterlayout/MasterLayout';
import { publicRouter, restrictRoutes } from './routes';

function App() {
    return (
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
    );
}

export default App;
