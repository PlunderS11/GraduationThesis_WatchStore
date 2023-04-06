import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useLocation } from 'react-router-dom';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, Spin, Tabs } from 'antd';

import styles from './PromotionList.module.scss';
import Button from '~/components/Button/Button';
import axiosClient from '~/api/axiosClient';
import { toast } from 'react-toastify';
import Grid from '~/components/Grid/Grid';

import * as moment from 'moment';
import ModalPromotion from '~/components/Modal/ModalPromotion/ModalPromotion';
import ModalPromotionNew from '~/components/Modal/ModalPromotionNew/ModalPromotionNew';

const cx = classNames.bind(styles);

export default function PromotionList() {
    const location = useLocation();

    const { confirm } = Modal;
    const [promotionsDeleted, setPromotionsDeleted] = useState([]);
    const [promotionsUneleted, setPromotionsUneleted] = useState([]);
    const [loading, setLoading] = useState(false);
    const [key, setKey] = useState(false);

    const [id, setId] = useState('');
    const [open, setOpen] = useState(false);
    const [openNew, setOpenNew] = useState(false);

    const fecthData = async () => {
        setLoading(true);

        const getPromotions_deleted = async () => {
            const res = await axiosClient.get('promotion/deleted/');
            setPromotionsDeleted(res.data.promotions_deleted);
        };
        getPromotions_deleted();

        const getPromotions_undeleted = async () => {
            const res = await axiosClient.get('promotion/undeleted/');
            setPromotionsUneleted(res.data.promotions_undeleted);
        };
        getPromotions_undeleted();

        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        try {
            fecthData();
        } finally {
            setLoading(false);
        }
    }, [location]);

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            const res = await axiosClient.put('promotion/delete/' + id);
            if (res) {
                toast.success('Xóa thành công');
                fecthData();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReStore = async (id) => {
        setLoading(true);
        try {
            const res = await axiosClient.put('promotion/restore/' + id);

            if (res) {
                toast.success('Khôi phục thành công');
                fecthData();
            }
        } finally {
            setLoading(false);
        }
    };

    const showDeleteConfirm = (id) => {
        confirm({
            title: 'XÓA KHUYẾN MÃI',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn chắc chắn muốn xóa khuyến mãi?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Trở lại',
            onOk() {
                handleDelete(id);
            },
            onCancel() {},
        });
    };

    const showRestoreConfirm = (id) => {
        confirm({
            title: 'KHÔI PHỤC KHUYẾN MÃI',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn chắc chắn muốn khôi phục khuyển mãi?',
            okText: 'Khôi phục',
            okType: 'primary',
            cancelText: 'Trở lại',
            onOk() {
                handleReStore(id);
            },
            onCancel() {},
        });
    };

    const columns_deleted = [
        {
            field: 'titlevi',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên tiếng Việt',
            width: 200,
        },
        {
            field: 'titleen',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên tiếng Anh',
            width: 200,
        },
        {
            field: 'code',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Mã khuyến mãi',
            width: 250,
        },
        {
            field: 'value',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Giá trị',
            width: 100,
            type: 'number',
            renderCell: (params) => {
                return <div className={cx('product-list-item')}>{params.row.value}%</div>;
            },
        },

        {
            field: 'startDate',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Ngày bắt đầu',
            width: 160,
            type: 'date',

            valueFormatter: function (params) {
                return moment(params.value).format('DD/MM/YYYY');
            },
        },
        {
            field: 'endDate',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Ngày kết thúc',
            width: 160,
            type: 'date',

            valueFormatter: function (params) {
                return moment(params.value).format('DD/MM/YYYY');
            },
        },
        {
            field: 'action',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Hành động',
            width: 200,
            filterable: false,
            renderCell: (params) => {
                return (
                    <>
                        <button
                            className={cx('product-list-edit')}
                            onClick={() => {
                                setOpen(true);
                                setId(params.row._id);
                            }}
                        >
                            Chỉnh sửa
                        </button>

                        <button
                            className={cx('product-list-restore-button')}
                            onClick={() => showRestoreConfirm(params.row._id)}
                        >
                            Khôi phục
                        </button>
                    </>
                );
            },
        },
    ];

    const columns_undeleted = [
        {
            field: 'titlevi',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên tiếng Việt',
            width: 200,
        },
        {
            field: 'titleen',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên tiếng Anh',
            width: 200,
        },
        {
            field: 'code',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Mã khuyến mãi',
            width: 250,
        },
        {
            field: 'value',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Giá trị',
            width: 100,
            type: 'number',
            renderCell: (params) => {
                return <div className={cx('product-list-item')}>{params.row.value}%</div>;
            },
        },

        {
            field: 'startDate',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Ngày bắt đầu',
            width: 160,
            type: 'date',

            valueFormatter: function (params) {
                return moment(params.value).format('DD/MM/YYYY');
            },
        },
        {
            field: 'endDate',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Ngày kết thúc',
            width: 160,
            type: 'date',

            valueFormatter: function (params) {
                return moment(params.value).format('DD/MM/YYYY');
            },
        },

        {
            field: 'action',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Hành động',
            width: 200,
            filterable: false,
            renderCell: (params) => {
                return (
                    <>
                        <button
                            className={cx('product-list-edit')}
                            onClick={() => {
                                setOpen(true);
                                setId(params.row._id);
                            }}
                        >
                            Chỉnh sửa
                        </button>

                        <button
                            className={cx('product-list-delete-button')}
                            onClick={() => showDeleteConfirm(params.row._id)}
                        >
                            Xóa
                        </button>
                    </>
                );
            },
        },
    ];

    const items = [
        {
            key: '1',
            label: `Khuyến mãi`,
            children: ``,
        },
        {
            key: '2',
            label: `Đã xóa`,
            children: ``,
        },
    ];

    const tabItemClick = (key) => {
        if (key === '1') {
            setKey(false);
        } else if (key === '2') {
            setKey(true);
        }
    };

    return (
        <>
            <div className={cx('product-list')}>
                <Spin spinning={loading}>
                    <label className={cx('label')}>DANH SÁCH KHUYẾN MÃI</label>
                    <div style={{ height: 10 }}></div>
                    {/* <Link to="/newpromotion"> */}
                    <Button
                        customClass={styles}
                        onClick={() => {
                            setOpenNew(true);
                        }}
                    >
                        Thêm khuyến mãi
                    </Button>
                    {/* </Link> */}
                    <div className={cx('grid')}>
                        <Tabs type="card" defaultActiveKey="1" items={items} onChange={tabItemClick} />
                        {key === false ? (
                            <Grid
                                headers={columns_undeleted}
                                datas={promotionsUneleted}
                                rowHeight={63}
                                pagesize={6}
                                hideToolbar={false}
                            />
                        ) : (
                            <Grid
                                headers={columns_deleted}
                                datas={promotionsDeleted}
                                rowHeight={64}
                                pagesize={6}
                                hideToolbar={false}
                            />
                        )}
                    </div>
                </Spin>
            </div>
            {id !== '' && <ModalPromotion open={open} onClose={() => setOpen(false)} id={id}></ModalPromotion>}
            <ModalPromotionNew open={openNew} onClose={() => setOpenNew(false)}></ModalPromotionNew>
        </>
    );
}
