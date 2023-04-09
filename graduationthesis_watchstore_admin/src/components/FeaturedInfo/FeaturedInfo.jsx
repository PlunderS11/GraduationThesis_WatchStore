import classNames from 'classnames/bind';
// import { ArrowDownward, ArrowUpward } from '@material-ui/icons';
import styles from './FeaturedInfo.module.scss';

const cx = classNames.bind(styles);

export default function FeaturedInfo() {
    return (
        <div className={cx('featured')}>
            <div className={cx('featured-item')}>
                <span className={cx('featured-title')}>Doanh thu</span>
                <div className={cx('featured-money-container')}>
                    <span className={cx('featured-money')}>30,000,000 VNĐ</span>
                    {/* <span className={cx('featured-money-rate')}>
                        +2.4 <ArrowUpward className={cx('featured-icon')} />
                    </span> */}
                </div>
            </div>
            <div className={cx('featured-item')}>
                <span className={cx('featured-title')}>Bán hàng</span>
                <div className={cx('featured-money-container')}>
                    <span className={cx('featured-money')}>309 sản phẩm</span>
                    {/* <span className={cx('featured-money-rate')}>
                        -1.4 <ArrowDownward className={cx('featured-icon', 'negative')} />
                    </span> */}
                </div>
            </div>
            {/* <div className={cx('featured-item')}>
                <span className={cx('featured-title')}>Chi phí</span>
                <div className={cx('featured-money-container')}>
                    <span className={cx('featured-money')}>30,000,000đ</span>
                    <span className={cx('featured-money-rate')}>
                        +2.4 <ArrowUpward className={cx('featured-icon')} />
                    </span>
                </div>
            </div> */}
        </div>
    );
}
