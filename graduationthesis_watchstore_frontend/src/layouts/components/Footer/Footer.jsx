import classNames from 'classnames/bind';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import i18n from '../../../i18n';
import { menuFooter, showrooms } from '../../../assets/datas';
import style from './Footer.module.scss';
// import NewsLetter from '../../../components/NewsLetter/NewsLetter';

const cx = classNames.bind(style);

const Footer = () => {
    const { t } = useTranslation();
    return (
        <div className={cx('footer')}>
            <div className={cx('container')}>
                {/* <NewsLetter /> */}
                <div className={cx('menu')}>
                    {menuFooter.map((menu, index) => (
                        <div className={cx('block')} key={index}>
                            <div className={cx('title')}>{menu[`title${i18n.language}`]}</div>
                            <ul className={cx('list-item')}>
                                {menu.list.map((item, index) => (
                                    <li key={index}>
                                        <Link to={item.link}>{item[`title${i18n.language}`]}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className={cx('showrooms')}>
                    {showrooms.map((item, index) => (
                        <div className={cx('showroom')} key={index}>
                            <div className={cx('name')}>{item[`name${i18n.language}`]}</div>
                            <div className={cx('address')}>
                                {t('footer.address')}: {item[`address${i18n.language}`]}
                            </div>
                        </div>
                    ))}
                </div>
                <div className={cx('copyright')}>
                    <p>{t('footer.copyright')}</p>
                    <div className={cx('link')}>
                        <a href="/">{t('footer.terms')}</a>
                        <a href="/">{t('footer.privacy')}</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
