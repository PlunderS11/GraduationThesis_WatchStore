import classNames from 'classnames/bind';
import { CalendarToday, LocationSearching, MailOutline, PermIdentity, PhoneAndroid, Publish } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import styles from './User.module.scss';

const cx = classNames.bind(styles);

export default function User() {
    return (
        <div className={cx('user')}>
            <div className={cx('user-title-container')}>
                <h1 className={cx('user-title')}>Chỉnh sửa thông tin khách hàng</h1>
                <Link to="/newUser">
                    <button className={cx('user-add-button')}>Tạo mới</button>
                </Link>
            </div>
            <div className={cx('user-container')}>
                <div className={cx('user-show')}>
                    <div className={cx('user-show-top')}>
                        <img
                            src="https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                            alt=""
                            className={cx('user-show-img')}
                        />
                        <div className={cx('user-show-top-title')}>
                            <span className={cx('user-show-username')}>Anna Becker</span>
                            <span className={cx('user-show-user-title')}>Software Engineer</span>
                        </div>
                    </div>
                    <div className={cx('user-show-bottom')}>
                        <span className={cx('user-showtitle')}>Chi tiết tài khoản</span>
                        <div className={cx('user-show-info')}>
                            <PermIdentity className={cx('user-show-icon')} />
                            <span className={cx('user-show-info-title')}>annabeck99</span>
                        </div>
                        <div className={cx('user-show-info')}>
                            <CalendarToday className={cx('user-show-icon')} />
                            <span className={cx('user-show-info-title')}>10.12.1999</span>
                        </div>
                        <span className={cx('user-show-title')}>Chi tiết liên hệ</span>
                        <div className={cx('user-show-info')}>
                            <PhoneAndroid className={cx('user-show-icon')} />
                            <span className={cx('user-show-info-title')}>+1 123 456 67</span>
                        </div>
                        <div className={cx('user-show-info')}>
                            <MailOutline className={cx('user-show-icon')} />
                            <span className={cx('user-show-info-title')}>annabeck99@gmail.com</span>
                        </div>
                        <div className={cx('user-show-info')}>
                            <LocationSearching className={cx('user-show-icon')} />
                            <span className={cx('user-show-info-title')}>New York | USA</span>
                        </div>
                    </div>
                </div>
                <div className={cx('user-update')}>
                    <span className={cx('user-update-title')}>Chỉnh sửa</span>
                    <form className={cx('user-update-form')}>
                        <div className={cx('user-update-left')}>
                            <div className={cx('user-update-item')}>
                                <label>Username</label>
                                <input type="text" placeholder="annabeck99" className={cx('user-update-input')} />
                            </div>
                            <div className={cx('user-update-item')}>
                                <label>Họ tên đầy đủ</label>
                                <input type="text" placeholder="Anna Becker" className={cx('user-update-input')} />
                            </div>
                            <div className={cx('user-update-item')}>
                                <label>Email</label>
                                <input
                                    type="text"
                                    placeholder="annabeck99@gmail.com"
                                    className={cx('user-update-input')}
                                />
                            </div>
                            <div className={cx('user-update-item')}>
                                <label>Số điện thoại</label>
                                <input type="text" placeholder="+1 123 456 67" className={cx('user-update-input')} />
                            </div>
                            <div className={cx('user-update-item')}>
                                <label>Địa chỉ</label>
                                <input type="text" placeholder="New York | USA" className={cx('user-update-input')} />
                            </div>
                        </div>
                        <div className={cx('user-update-right')}>
                            <div className={cx('user-update-upload')}>
                                <img
                                    className={cx('user-update-img')}
                                    src="https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                                    alt=""
                                />
                                <label htmlFor="file">
                                    <Publish className={cx('user-update-icon')} />
                                </label>
                                <input type="file" id="file" style={{ display: 'none' }} />
                            </div>
                            <button className={cx('user-update-button')}>Cập nhật</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
