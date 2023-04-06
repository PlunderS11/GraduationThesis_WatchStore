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
            label: <Link to={'/account/order'}>{t('header.userOption.orderInfo')}</Link>,
        },
        {
            key: '3',
            label: <Link to={'/account/address'}>{t('header.userOption.addressInfo')}</Link>,
        },
        {
            type: 'divider',
        },
        {
            key: '4',
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
                    <p className={cx('name')}>{user.username}</p>
                    <div className={cx('icon')}>
                        <img src={user.rank.icon} alt="" />
                    </div>
                </div>
            </Dropdown>
        </div>
    );
}

export default UserOption;
