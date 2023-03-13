import classNames from 'classnames/bind';
import styles from './NewUser.module.scss';

const cx = classNames.bind(styles);

export default function NewUser() {
    return (
        <div className={cx('new-user')}>
            <h1 className={cx('new-user-title')}>Tạo mới khách hàng</h1>
            <form className={cx('new-user-form')}>
                <div className={cx('new-user-item')}>
                    <label>Username</label>
                    <input type="text" placeholder="john" />
                </div>
                <div className={cx('new-user-item')}>
                    <label>Họ tên đầy đủ</label>
                    <input type="text" placeholder="John Smith" />
                </div>
                <div className={cx('new-user-item')}>
                    <label>Email</label>
                    <input type="email" placeholder="john@gmail.com" />
                </div>
                <div className={cx('new-user-item')}>
                    <label>Mật khẩu</label>
                    <input type="password" placeholder="password" />
                </div>
                <div className={cx('new-user-item')}>
                    <label>Số điện thoại</label>
                    <input type="text" placeholder="+1 123 456 78" />
                </div>
                <div className={cx('new-user-item')}>
                    <label>Địa chỉ</label>
                    <input type="text" placeholder="New York | USA" />
                </div>
                <div className={cx('new-user-item')}>
                    <label>Giới tính</label>
                    <div className={cx('new-user-gender')}>
                        <input type="radio" name="gender" id="male" value="male" />
                        <label for="male">Nam</label>
                        <input type="radio" name="gender" id="female" value="female" />
                        <label for="female">Nữ</label>
                        <input type="radio" name="gender" id="other" value="other" />
                        <label for="other">Khác</label>
                    </div>
                </div>
                <div className={cx('new-user-tem')}>
                    <label>Trạng thái</label>
                    <select className={cx('new-user-select')} name="active" id="active">
                        <option value="yes">Hoạt động</option>
                        <option value="no">Khóa</option>
                    </select>
                </div>
                <button className={cx('new-user-button')}>Thêm</button>
            </form>
        </div>
    );
}
