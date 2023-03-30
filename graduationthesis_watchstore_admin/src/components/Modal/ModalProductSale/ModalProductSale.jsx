import { Modal } from 'antd';
import classNames from 'classnames/bind';

import { productData } from '~/data/dummyData.js';
import Chart from '~/components/Chart/Chart';
import styles from './ModalProductSale.module.scss';
import axiosClient from '~/api/axiosClient';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

const ModalProductSale = (props) => {
    const { open, onClose, id } = props;

    const handleCancel = () => {
        onClose(false);
    };

    //-------------------------------------------------------------

    // const [order, setOrder] = useState({});
    const [product, setProduct] = useState({});
    const [img, setImg] = useState();

    const fecthData = async () => {
        if (id !== '') {
            const getProduct = async () => {
                const res = await axiosClient.get('product/detail/' + id);
                setProduct(res.data.detailProduct);
                setImg(res.data.detailProduct.images[0]);
            };
            getProduct();
        }
    };

    useEffect(() => {
        try {
            fecthData();
        } finally {
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <>
            <Modal onCancel={handleCancel} open={open} title="DOANH SỐ SẢN PHẨM" width={1000} centered footer={[]}>
                <div className={cx('product')}>
                    <div className={cx('product-top')}>
                        <div className={cx('product-top-right')}>
                            <div className={cx('product-info-top')}>
                                <img src={img} alt="" className={cx('product-info-img')} />
                                <span className={cx('product-name')}>{product.name}</span>
                            </div>
                            <div className={cx('product-info-bottom')}>
                                <div className={cx('product-info-item')}>
                                    <span className={cx('product-info-key')}>Đã bán:</span>
                                    <span className={cx('product-info-value')}>{product.sold}</span>
                                </div>
                                <div className={cx('product-info-item')}>
                                    <span className={cx('product-info-key')}>Tồn kho:</span>
                                    <span className={cx('product-info-value')}>{product.stock}</span>
                                </div>
                            </div>
                        </div>
                        <div className={cx('product-top-left')}>
                            <Chart data={productData} dataKey="Sales" title="Hiệu suất bán hàng" />
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};
export default ModalProductSale;
