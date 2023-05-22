import { Modal, Spin } from 'antd';
import classNames from 'classnames/bind';
import styles from './ModalDebotHistory.module.scss';
import axiosClient from '~/api/axiosClient';
import { useEffect, useState } from 'react';
import Grid from '~/components/Grid/Grid';

const cx = classNames.bind(styles);

const ModalDebotHistory = (props) => {
    const { open, onClose, id, onResetId } = props;
    const [loading, setLoading] = useState(false);
    const handleCancel = () => {
        onResetId('');
        onClose(false);
    };

    //-------------------------------------------------------------

    const [depots, setDepots] = useState({});

    const fecthData = async () => {
        setLoading(true);
        try {
            if (id !== '') {
                const res = await axiosClient.get('depot/', {
                    params: { productId: id },
                });
                for (let i = 0; i < res.data.depots.length; i++) {
                    res.data.depots[i].productName = res.data.depots[i].product.name;
                }
                setDepots(res.data.depots);
            }
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fecthData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    function NumberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
    }

    const columns = [
        {
            field: 'productName',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên đồng hồ',
            width: 200,
        },
        {
            field: 'quantity',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Số lượng nhập',
            type: 'number',
            width: 150,
        },
        {
            field: 'importPrice',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Giá nhập mỗi sản phẩm',
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <div className={cx('price_cell')}>
                            <span className={cx('price_cell_value')}>
                                {NumberWithCommas(Number(params.row.importPrice))}
                            </span>
                        </div>
                    </>
                );
            },
        },
        {
            field: 'createdAt',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Ngày nhập',
            width: 200,
            type: 'date',
            valueFormatter: function (params) {
                return new Date(params.value).toLocaleString();
            },
        },
    ];

    return (
        <>
            <Modal
                destroyOnClose={true}
                onCancel={handleCancel}
                open={open}
                title="LỊCH SỬ NHẬP HÀNG"
                width={800}
                centered
                footer={[]}
            >
                <Spin spinning={loading}>
                    <div className={cx('grid')}>
                        <Grid headers={columns} datas={depots} rowHeight={63} pagesize={10} hideToolbar={false} />
                    </div>
                </Spin>
            </Modal>
        </>
    );
};
export default ModalDebotHistory;
