import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';

import style from './ScrollToTop.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(style);

const ScrollToTop = ({ children }) => {
    const [show, setShow] = useState(false);
    const loacation = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
        });
        document.body.style.overflow = 'unset';
    }, [loacation]);

    useEffect(() => {
        const handleShowScroll = () => {
            setShow(window.scrollY >= 600);
        };

        window.addEventListener('scroll', handleShowScroll);
        return () => {
            window.removeEventListener('scroll', handleShowScroll);
        };
    }, []);

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };
    return (
        <>
            {children}
            <div className={cx('scroll-top', { show })} onClick={handleScrollToTop}>
                <FontAwesomeIcon icon={faCaretUp} />
            </div>
        </>
    );
};

export default ScrollToTop;
