import classNames from 'classnames/bind';
import styles from './ProductList.module.scss';

// import { DeleteOutline } from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';

import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, Spin, Tabs } from 'antd';

import Button from '~/components/Button/Button';
import axiosClient from '~/api/axiosClient';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Grid from '~/components/Grid/Grid';

import * as moment from 'moment';

const cx = classNames.bind(styles);

export default function ProductList() {
    const location = useLocation();
    const { confirm } = Modal;
    const [productsDeleted, setProductsDeleted] = useState([]);
    const [productsUneleted, setProductsUneleted] = useState([]);
    const [loading, setLoading] = useState(false);
    const [key, setKey] = useState(false);

    const fecthData = async () => {
        setLoading(true);
        const getProducts_deleted = async () => {
            const res = await axiosClient.get('product/deleted/');

            setProductsDeleted(res.data.products_deleted);
        };
        getProducts_deleted();
        const getProducts_undeleted = async () => {
            const res = await axiosClient.get('product/undeleted/');
            setProductsUneleted(res.data.products_undeleted);
        };
        getProducts_undeleted();
        setLoading(false);
    };

    // console.log(productsUneleted);

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
            const res = await axiosClient.put('product/delete/' + id);
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
            const res = await axiosClient.put('product/restore/' + id);
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
            title: 'XÓA SẢN PHẨM',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn chắc chắn muốn xóa sản phẩm?',
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
            title: 'KHÔI PHỤC SẢN PHẨM',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn chắc chắn muốn khôi phục sản phẩm?',
            okText: 'Khôi phục',
            okType: 'primary',
            cancelText: 'Trở lại',
            onOk() {
                handleReStore(id);
            },
            onCancel() {},
        });
    };
    function NumberWithCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
    }

    const columns_deleted = [
        {
            field: 'products',
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            headerName: 'Hình ảnh',
            width: 125,
            filterable: false,

            renderCell: (params) => {
                return (
                    <div className={cx('product-list-item')}>
                        <img src={params.row.images[0]} className={cx('product-list-img')} alt="img" />
                    </div>
                );
            },
        },
        {
            field: 'name',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên sản phẩm',
            width: 220,
        },
        {
            field: 'type',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Loại',
            width: 80,
        },
        {
            field: 'produts_collectionName',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Danh mục',
            width: 175,
            renderCell: (params) => {
                return (
                    <>
                        <div>{params.row.collectionObj.name}</div>
                    </>
                );
            },
        },
        {
            field: 'stock',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tồn',
            width: 55,
            type: 'number',
        },
        {
            field: 'produts_price',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Giá',
            width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <div className={cx('price_cell')}>
                            <span className={cx('price_cell_value')}>
                                {NumberWithCommas(Number(params.row.finalPrice))}
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
            headerName: 'Ngày tạo',
            width: 130,
            type: 'date',

            valueFormatter: function (params) {
                return moment(params.value).format('DD/MM/YYYY');
            },
        },
        {
            field: 'updatedAt',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Ngày cập nhật',
            width: 135,
            type: 'date',

            valueFormatter: function (params) {
                return moment(params.value).format('DD/MM/YYYY');
            },
        },
        {
            field: 'action',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Hành động',
            width: 200,
            filterable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={'/product/' + params.row._id}>
                            <button className={cx('product-list-edit')}>Chỉnh sửa</button>
                        </Link>

                        <Button
                            className={cx('product-list-restore-button')}
                            onClick={() => showRestoreConfirm(params.row._id)}
                        >
                            Khôi phục
                        </Button>
                    </>
                );
            },
        },
    ];

    const columns_undeleted = [
        {
            field: 'products',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Hình ảnh',
            width: 125,
            filterable: false,

            renderCell: (params) => {
                return (
                    <div className={cx('product-list-item')}>
                        <img src={params.row.images[0]} className={cx('product-list-img')} alt="img" />
                    </div>
                );
            },
        },
        {
            field: 'name',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên sản phẩm',
            width: 220,
        },
        {
            field: 'type',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Loại',
            width: 80,
        },
        {
            field: 'produts_collectionName',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Danh mục',
            width: 175,
            renderCell: (params) => {
                return (
                    <>
                        <div>{params.row.collectionObj.name}</div>
                    </>
                );
            },
        },
        {
            field: 'stock',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tồn',
            width: 55,
            type: 'number',
        },
        {
            field: 'produts_price',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Giá',
            width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <div className={cx('price_cell')}>
                            <span className={cx('price_cell_value')}>
                                {NumberWithCommas(Number(params.row.finalPrice))}
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
            headerName: 'Ngày tạo',
            width: 130,
            type: 'date',

            valueFormatter: function (params) {
                return moment(params.value).format('DD/MM/YYYY');
            },
        },
        {
            field: 'updatedAt',
            align: 'center',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Ngày cập nhật',
            width: 135,
            type: 'date',

            valueFormatter: function (params) {
                return moment(params.value).format('DD/MM/YYYY');
            },
        },

        {
            field: 'action',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Hành động',
            width: 200,
            filterable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={'/product/' + params.row._id}>
                            <button className={cx('product-list-edit')}>Chỉnh sửa</button>
                        </Link>

                        <Button
                            className={cx('product-list-delete-button')}
                            onClick={() => showDeleteConfirm(params.row._id)}
                        >
                            Xóa
                        </Button>
                    </>
                );
            },
        },
    ];

    const items = [
        {
            key: '1',
            label: `Sản phẩm`,
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
        <div className={cx('product-list')}>
            <Spin spinning={loading}>
                <label className={cx('label')}>DANH SÁCH DANH MỤC</label>
                <Link to="/newproduct">
                    <Button customClass={styles}>Thêm sản phẩm</Button>
                </Link>
                <div className={cx('grid')}>
                    <Tabs defaultActiveKey="1" items={items} onChange={tabItemClick} />
                    {key === false ? (
                        <Grid
                            headers={columns_undeleted}
                            datas={productsUneleted}
                            rowHeight={63}
                            pagesize={6}
                            hideToolbar={false}
                        />
                    ) : (
                        <Grid
                            headers={columns_deleted}
                            datas={productsDeleted}
                            rowHeight={63}
                            pagesize={6}
                            hideToolbar={false}
                        />
                    )}
                </div>
            </Spin>
        </div>
    );
}
