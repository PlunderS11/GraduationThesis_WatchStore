import classNames from 'classnames/bind';
import styles from './LastestTransactions.module.scss';
import { lastPersonOder } from '../../data/dummyData.js';

const cx = classNames.bind(styles);

export default function WidgetLg() {
    const Button = ({ type }) => {
        return <button className={cx('widget-lg-button', type)}>{type}</button>;
    };

    const orders = lastPersonOder;

    return (
        <div className={cx('widget-lg')}>
            <h3 className={cx('widget-lg-title')}>Giao dịch mới nhất</h3>
            <table className={cx('widget-lg-table')}>
                <tr className={cx('widget-lg-tr')}>
                    <th className={cx('widget-lg-th')}>Khách hàng</th>
                    <th className={cx('widget-lg-th')}>Ngày</th>
                    <th className={cx('widget-lg-th')}>Giá trị giao dịch</th>
                    <th className={cx('widget-lg-th')}>Trạng thái</th>
                </tr>
                {orders.map((order) => (
                    <tr className={cx('widget-lg-tr')} key={order.id}>
                        <td className={cx('widget-lg-user')}>
                            <img
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWfR3mjXTW23p7u178vl_RQ3LqbrGzotq_YQ&usqp=CAU"
                                alt=""
                                className={cx('widget-lg-img')}
                            />
                            <span className={cx('widget-lg-name')}>{order.username}</span>
                        </td>
                        <td className={cx('widget-lg-date')}>{order.createdAt}</td>
                        <td className={cx('widget-lg-amount')}>{order.amount}đ</td>
                        <td className={cx('widget-lg-status')}>
                            <Button type={order.status} />
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    );
}
