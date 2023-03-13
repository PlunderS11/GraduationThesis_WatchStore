import Home from '~/pages/Home';
import Login from '~/pages/Login';
import UserList from '~/pages/UserList';
import User from '~/pages/User';
import NewUser from '~/pages/NewUser';
import ProductList from '~/pages/ProductList';
import Product from '~/pages/Product';
import NewProduct from '~/pages/NewProduct';

const publicRouter = [
    { path: '/', component: Home },

    { path: '/users', component: UserList },
    { path: '/user/:userId', component: User },
    { path: '/newUser', component: NewUser },
    { path: '/products', component: ProductList },
    { path: '/product/:productId', component: Product },
    { path: '/newproduct', component: NewProduct },
];

const restrictRoutes = [{ path: '/login', component: Login }];

export { publicRouter, restrictRoutes };
