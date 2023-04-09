import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import FeaturedInfo from '~/components/FeaturedInfo/FeaturedInfo';
// import NewMember from '~/components/NewMember/NewMember';
import LastestTransactions from '~/components/LastestTransactions/LastestTransactions';
import Chart from '~/components/Chart/Chart';
import { userData } from '../../data/dummyData.js';

const cx = classNames.bind(styles);

export default function Home() {
    return (
        <div className={cx('home')}>
            <FeaturedInfo />
            <Chart data={userData} title="Biểu đồ phân tích người dùng" grid dataKey="Active User" />
            <div className={cx('home-widgets')}>
                {/* <NewMember /> */}
                <LastestTransactions />
            </div>
        </div>
    );
}
