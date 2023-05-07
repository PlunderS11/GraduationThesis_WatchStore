import classNames from 'classnames/bind';
import styles from './FeaturedInfo.module.scss';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useEffect, useState } from 'react';
import axiosClient from '~/api/axiosClient';
dayjs.extend(customParseFormat);

const cx = classNames.bind(styles);
const monthFormat = 'MM/YYYY';

export default function FeaturedInfo() {
    const currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1;
    if (currentMonth < 10) currentMonth = '0' + currentMonth;
    const currentYear = currentDate.getFullYear();

    const [income, setIncome] = useState();
    const [quantity, setQuantity] = useState();

    useEffect(() => {
        const getIncome = async () => {
            try {
                const res = await axiosClient.get(`/order/incomeorder?year=${currentYear}&month=${currentMonth}`);
                setIncome(res.data.income[0].total);
            } catch {}
        };
        getIncome();

        const getQuantity = async () => {
            try {
                const res = await axiosClient.get(`/order/incomequantity?year=${currentYear}&month=${currentMonth}`);
                setQuantity(res.data.income[0].total);
            } catch {}
        };
        getQuantity();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangeIncomeTime = async (value) => {
        const d = new Date(value);
        try {
            const res = await axiosClient.get(`/order/incomeorder?year=${d.getFullYear()}&month=${d.getMonth() + 1}`);
            if (JSON.stringify(res.data.income) !== '[]') {
                setIncome(res.data.income[0].total);
            } else {
                setIncome(0);
            }
        } catch {}
    };

    const handleChangeQuantityTime = async (value) => {
        const d = new Date(value);
        try {
            const res = await axiosClient.get(
                `/order/incomequantity?year=${d.getFullYear()}&month=${d.getMonth() + 1}`,
            );
            if (JSON.stringify(res.data.income) !== '[]') {
                setQuantity(res.data.income[0].total);
            } else {
                setQuantity(0);
            }
        } catch {}
    };

    function NumberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
    }

    return (
        <div className={cx('featured')}>
            <div className={cx('featured-item')}>
                <span className={cx('featured-title')}>Doanh thu</span>
                <DatePicker
                    style={{ width: '100px' }}
                    defaultValue={dayjs(`${currentMonth}/${currentYear}`, monthFormat)}
                    format={monthFormat}
                    picker="month"
                    onChange={handleChangeIncomeTime}
                />
                {income !== undefined && (
                    <div className={cx('featured-money-container')}>
                        <span className={cx('featured-money')}>{NumberWithCommas(income)} VNĐ</span>
                    </div>
                )}
            </div>
            <div className={cx('featured-item')}>
                <span className={cx('featured-title')}>Bán hàng</span>
                <DatePicker
                    style={{ width: '100px' }}
                    defaultValue={dayjs(`${currentMonth}/${currentYear}`, monthFormat)}
                    format={monthFormat}
                    picker="month"
                    onChange={handleChangeQuantityTime}
                />
                {quantity !== undefined && (
                    <div className={cx('featured-money-container')}>
                        <span className={cx('featured-money')}>{quantity} sản phẩm</span>
                    </div>
                )}
            </div>
        </div>
    );
}
