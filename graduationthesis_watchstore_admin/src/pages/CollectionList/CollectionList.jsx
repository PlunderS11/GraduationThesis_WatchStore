import classNames from 'classnames/bind';
import styles from './CollectionList.module.scss';
import { Link, useLocation } from 'react-router-dom';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal, Tabs, Spin } from 'antd';

import Button from '~/components/Button/Button';
import axiosClient from '~/api/axiosClient';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Grid from '~/components/Grid/Grid';

const cx = classNames.bind(styles);

export default function CollectionList() {
    const { confirm } = Modal;
    const location = useLocation();
    const [collectionsDeleted, setCollectionsDeleted] = useState([]);
    const [collectionsUndeleted, setCollectionsUndeleted] = useState([]);
    const [loading, setLoading] = useState(false);
    const [key, setKey] = useState(false);

    const fecthData = async () => {
        setLoading(true);
        const getProducts_undeleted = async () => {
            const res = await axiosClient.get('collections/undeleted/');
            setCollectionsUndeleted(res.data.collections_undeleted);
        };
        getProducts_undeleted();
        const getProducts_deleted = async () => {
            const res = await axiosClient.get('collections/deleted/');
            setCollectionsDeleted(res.data.collections_deleted);
        };
        getProducts_deleted();
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
            const res = await axiosClient.put('collections/delete/' + id);
            if (res) {
                toast.success('Xóa thành công');
                fecthData();
            }
        } finally {
            setLoading(false);
        }
    };
    const handleRestore = async (id) => {
        setLoading(true);

        try {
            const res = await axiosClient.put('collections/restore/' + id);
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
            title: 'XÓA DANH MỤC',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn chắc chắn muốn xóa danh mục?',
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
            title: 'KHÔI PHỤC DANH MỤC',
            icon: <ExclamationCircleFilled />,
            content: 'Bạn chắc chắn muốn khôi phục danh mục?',
            okText: 'Khôi phục',
            okType: 'primary',
            cancelText: 'Trở lại',
            onOk() {
                handleRestore(id);
            },
            onCancel() {},
        });
    };

    const columns_undeleted = [
        {
            field: 'name',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên danh mục',
            width: 320,
        },
        {
            field: 'descriptionen',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Mô tả tiếng Anh',
            width: 375,
        },
        {
            field: 'descriptionvi',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Mô tả tiếng việt',
            width: 375,
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
                        <Link to={'/collection/' + params.row._id}>
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

    const columns_deleted = [
        {
            field: 'name',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Tên danh mục',
            width: 320,
        },
        {
            field: 'descriptionen',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Mô tả tiếng Anh',
            width: 375,
        },
        {
            field: 'descriptionvi',
            headerAlign: 'center',
            headerClassName: 'super-app-theme--header',
            headerName: 'Mô tả tiếng việt',
            width: 375,
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
                        <Link to={'/collection/' + params.row._id}>
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

    const items = [
        {
            key: '1',
            label: `Danh mục`,
            children: ``,
        },
        {
            key: '2',
            label: `Đã xóa`,
            children: ``,
        },
    ];

    const tabItemClick = (key) => {
        // console.log('tab click', key);
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
                <Link to="/newcollection">
                    <Button customClass={styles}>Thêm danh mục</Button>
                </Link>
                <div className={cx('grid')}>
                    <Tabs defaultActiveKey="1" items={items} onChange={tabItemClick} />
                    {key === false ? (
                        <Grid
                            headers={columns_undeleted}
                            datas={collectionsUndeleted}
                            rowHeight={63}
                            pagesize={6}
                            hideToolbar={false}
                        />
                    ) : (
                        <Grid
                            headers={columns_deleted}
                            datas={collectionsDeleted}
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
