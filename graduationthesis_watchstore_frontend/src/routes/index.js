import AboutUs from '../pages/AboutUs/AboutUs';
import AccountInfo from '../pages/AccountInfo/AccountInfo';
import BlogDetail from '../pages/BlogDetail/BlogDetail';
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
    { path: '/', component: Home, breadcrumb: 'home' },
    { path: '/about-us', component: AboutUs, breadcrumb: 'home/aboutUs' },
    { path: '/blogs', component: Blogs, breadcrumb: 'home/blogs' },
    { path: '/blog/:id', component: BlogDetail, breadcrumb: 'home/blogs' },
    { path: '/cart', component: CartPage, breadcrumb: 'home/cart' },
    { path: '/checkout', component: Checkout, breadcrumb: 'home/checkout' },
    { path: '/gallery', component: Gallery, breadcrumb: 'home/gallery' },
    { path: '/product/:slug', component: ProductDetail, breadcrumb: 'home' },
    { path: '/product-category/:type', component: ProductCategory, breadcrumb: 'home' },
    { path: '/search', component: SearchResult, breadcrumb: 'home/search' },
    { path: '/account/:category', component: AccountInfo, breadcrumb: 'home/account' },
    { path: '/buysuccess', component: BuySuccessPage, breadcrumb: 'home/buysuccess' },
    { path: '/account/order-history/:id', component: OrderHistoryPage, breadcrumb: 'home/orderHistory' },
    { path: '/login', component: Login, breadcrumb: 'home/login' },
    { path: '/forgot-password', component: Forgotpassword, breadcrumb: 'home/forgotPassword' },
    { path: '/register', component: Register, breadcrumb: 'home/register' },
];

export { publicRouter };
