import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dropdown } from 'antd';

import { logOut } from '../../features/user/userSlice';

import style from './UserOption.module.scss';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(style);

function UserOption({ user }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const items = [
        {
            key: '1',
            label: <Link to={'/account/profile'}>{t('header.userOption.userInfo')}</Link>,
        },
        {
            key: '2',
            label: <Link to={'/account/orders'}>{t('header.userOption.orderInfo')}</Link>,
        },
        {
            key: '3',
            label: <Link to={'/account/notification'}>{t('header.userOption.notification')}</Link>,
        },
        {
            key: '4',
            label: <Link to={'/account/address'}>{t('header.userOption.addressInfo')}</Link>,
        },
        {
            key: '5',
            label: <Link to={'/account/voucher'}>{t('header.userOption.voucher')}</Link>,
        },
        {
            key: '6',
            label: <Link to={'/account/changePassword'}>{t('header.userOption.changePassword')}</Link>,
        },
        {
            type: 'divider',
        },
        {
            key: '7',
            label: (
                <Link to={'/login'} onClick={() => dispatch(logOut())}>
                    {t('header.userOption.logout')}
                </Link>
            ),
        },
    ];

    return (
        <div>
            <Dropdown
                placement="bottom"
                arrow
                trigger={['click']}
                menu={{
                    items,
                }}
            >
                <div className={cx('user-options')}>
                    <FontAwesomeIcon icon={faUser} className={cx('icon')} />
                    <span className={cx('name')}>{user?.username}</span>
                    <div className={cx('icon')}>
                        <img src={user.rank?.icon} alt="" />
                    </div>
                </div>
            </Dropdown>
        </div>
    );
}

export default UserOption;
