import Home from '~/pages/Home';
import Login from '~/pages/Login';

const publicRouter = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
];

const restrictRoutes = [];

export { publicRouter, restrictRoutes };
