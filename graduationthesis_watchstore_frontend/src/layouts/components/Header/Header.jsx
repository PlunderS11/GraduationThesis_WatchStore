import classNames from 'classnames/bind';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { images } from '../../../assets/images';
import { menuHeader } from '../../../assets/datas';
import style from './Header.module.scss';
import i18n from '../../../i18n';
import Search from '../../../components/Search/Search';
import Cart from '../../../components/Cart/Cart';

const cx = classNames.bind(style);

const Header = () => {
    const headerRef = useRef(null);
    const location = useLocation();
    const { t } = useTranslation();
    const [shrink, setShrinke] = useState(false);
    useEffect(() => {
        const shrinkHeader = () => {
            if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
                setShrinke(true);
            } else {
                setShrinke(false);
            }
        };
        window.addEventListener('scroll', shrinkHeader);
        return () => {
            window.removeEventListener('scroll', shrinkHeader);
        };
    }, [location.pathname]);
    return (
        <div className={cx('header', { 'home-page': location.pathname === '/' }, { shrink: shrink })} ref={headerRef}>
            <div className={cx('topbar')}>
                <div className={cx('container')}>
                    <div className={cx('inner')}>
                        <div className={cx('topbar-left')}>
                            <Link to={'/'} className={cx('logo-home')}>
                                <img src={images.logoWhite} alt="Mynh" />
                            </Link>
                            <div className={cx('slogun')}>Tinh te vai lon</div>
                            <div className={cx('hotline')}>Hotline: 0123456789</div>
                        </div>
                        <div className={cx('topbar-right')}>
                            <div className={cx('options')}>
                                <Link to={'/login'} className={cx('right-item')}>
                                    {t('header.login')}
                                </Link>
                                <Link to={'/register'} className={cx('right-item')}>
                                    {t('header.register')}
                                </Link>
                            </div>
                            <div className={cx('right-item', 'flag')}>
                                {i18n.language === 'en' ? (
                                    <img
                                        src={images.flagVN}
                                        alt="Tiếng Việt"
                                        onClick={() => i18n.changeLanguage('vi')}
                                    />
                                ) : (
                                    <img src={images.flagEN} alt="English" onClick={() => i18n.changeLanguage('en')} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* main */}
            <div className={cx('header-main')}>
                <div className={cx('middle')}>
                    <div className={cx('container')}>
                        <div className={cx('inner')}>
                            <Search customClass={style} />
                            <Link to={'/'} className={cx('logo')}>
                                <img src={images.logoBlack} alt="Dyoss Logo" />
                            </Link>
                            <Cart customClass={style} />
                        </div>
                    </div>
                </div>

                <div className={cx('navigation')}>
                    <div className={cx('container')}>
                        <ul className={cx('inner')}>
                            {menuHeader.map((item, index) => (
                                <li
                                    key={index}
                                    className={cx('menu-item', {
                                        active: location.pathname === item.link,
                                    })}
                                >
                                    <Link to={item.link}>{t(`header.${item.title}`)}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
