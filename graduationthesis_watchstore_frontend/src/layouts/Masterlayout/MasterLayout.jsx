import { ToastContainer } from 'react-toastify';
import TopLoading from '../../components/TopLoading/TopLoading';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';

const MasterLayout = ({ children }) => {
    return (
        <>
            <Header />
            <TopLoading />
            {children}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Footer />
        </>
    );
};

export default MasterLayout;
