import AboutUs from '../pages/AboutUs/AboutUs';
import AccountInfo from '../pages/AccountInfo/AccountInfo';
import Blogs from '../pages/Blogs/Blogs';
import BuySuccessPage from '../pages/BuySucces/BuySuccessPage';
import CartPage from '../pages/Cart/CartPage';
import Checkout from '../pages/Checkout/Checkout';
import Forgotpassword from '../pages/ForgotPassword/ForgotPassword';
import Gallery from '../pages/Gallery/Gallery';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import OrderHistoryPage from '../pages/OrderHistory/OrderHistoryPage';
import ProductCategory from '../pages/ProductCategory/ProductCategory';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import Register from '../pages/Register/Register';
import SearchResult from '../pages/SearchResult/SearchResult';

const publicRouter = [
    { path: '/', component: Home },
    { path: '/about-us', component: AboutUs },
    { path: '/blogs', component: Blogs },
    { path: '/cart', component: CartPage },
    { path: '/checkout', component: Checkout },
    { path: '/gallery', component: Gallery },
    { path: '/product/:slug', component: ProductDetail },
    { path: '/product-category/:type', component: ProductCategory },
    { path: '/search', component: SearchResult },
    { path: '/account/:category', component: AccountInfo },
    { path: '/buysuccess', component: BuySuccessPage },
    { path: '/account/order-history/:id', component: OrderHistoryPage },
];

const restrictRoutes = [
    { path: '/login', component: Login },
    { path: '/forgot-password', component: Forgotpassword },
    { path: '/register', component: Register },
];

export { publicRouter, restrictRoutes };
