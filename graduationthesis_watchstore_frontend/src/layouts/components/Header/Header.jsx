import classNames from 'classnames/bind';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { MenuUnfoldOutlined } from '@ant-design/icons';

import { images } from '../../../assets/images';
import { menuHeader } from '../../../assets/datas';
import i18n from '../../../i18n';
import Search from '../../../components/Search/Search';
import Cart from '../../../components/Cart/Cart';
import UserOption from '../../../components/UserOption/UserOption';
import style from './Header.module.scss';
import { Popover } from 'antd';

const cx = classNames.bind(style);

const Header = () => {
    const headerRef = useRef(null);
    const location = useLocation();
    const { t } = useTranslation();
    const [shrink, setShrinke] = useState(false);
    const [show, setShow] = useState(false);
    const [visiblePopover, setVisiblePopover] = useState(false);

    const userLogin = useSelector(state => state.user);

    useEffect(() => {
        setShow(false);
        setVisiblePopover(false);
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

    // handle scroll to close popover notification
    useEffect(() => {
        const handleClosePopover = () => {
            setVisiblePopover(() => window.scrollY <= 50 && false);
        };
        window.addEventListener('scroll', handleClosePopover);
        return () => {
            window.removeEventListener('scroll', handleClosePopover);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [document.body.scrollTop]);
    const handleOpenChange = newOpen => {
        setVisiblePopover(newOpen);
    };

    return (
        <div className={cx('header', { 'home-page': location.pathname === '/' }, { shrink: shrink })} ref={headerRef}>
            <div className={cx('topbar')}>
                <div className={cx('container')}>
                    <div className={cx('inner')}>
                        <div className={cx('topbar-left')}>
                            <>
                                <MenuUnfoldOutlined className={cx('menu-reponsive')} onClick={() => setShow(true)} />
                                <div className={cx('menu-options-reponsive', { show: show })}>
                                    <div className={cx('menu-options-list')}>
                                        {menuHeader.map((item, index) => (
                                            <li key={index} className={cx('menu-options-item')}>
                                                <Link to={item.link}>{t(`header.${item.title}`)}</Link>
                                            </li>
                                        ))}
                                    </div>
                                    <div className={cx('menu-options-close')} onClick={() => setShow(false)}>
                                        X
                                    </div>
                                </div>
                            </>
                            <Link to={'/'} className={cx('logo-home')}>
                                <img src={images.logoWhite} alt="Mynh" />
                            </Link>
                            <div className={cx('slogun')}>{t('header.slogan')}</div>
                            <div className={cx('hotline')}>Hotline: 0888 244 212</div>
                        </div>
                        <div className={cx('topbar-right')}>
                            {!userLogin.isLogin ? (
                                <div className={cx('login-options')}>
                                    <Link to={'/login'} className={cx('right-item')}>
                                        {t('header.login')}
                                    </Link>
                                    <Link to={'/register'} className={cx('right-item')}>
                                        {t('header.register')}
                                    </Link>
                                </div>
                            ) : (
                                <UserOption user={userLogin.user} />
                            )}
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
                            <Popover
                                trigger={'click'}
                                placement="bottomLeft"
                                open={visiblePopover}
                                onOpenChange={handleOpenChange}
                                overlayClassName={cx('headerPopover')}
                                content={<Search customClass={style} />}
                            >
                                <div className={cx('searchIconMobile')}></div>
                            </Popover>
                            <Link to={'/'} className={cx('logo')}>
                                <img src={images.logoBlack} alt="Dyoss Logo" />
                            </Link>
                            <Cart customClass={style} open={shrink} />
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
