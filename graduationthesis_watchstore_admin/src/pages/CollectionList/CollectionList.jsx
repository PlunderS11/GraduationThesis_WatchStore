import classNames from 'classnames/bind';
import styles from './CollectionList.module.scss';
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';

import Button from '~/components/Button/Button';
import axiosClient from '~/api/axiosClient';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

export default function CollectionList() {
    const { confirm } = Modal;
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            const res = await axiosClient.get('collections/allCols/');
            setCollections(res.data.collections);
        };
        getProducts();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axiosClient.delete('collections/delete/' + id);
            setCollections(collections.filter((item) => item._id !== id));

            toast.success('Xóa thành công');
        } catch (error) {
            toast.error(error);
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

    const columns = [
        { field: 'name', headerName: 'Tên danh mục', width: 300 },
        { field: 'descriptionen', headerName: 'Mô tả tiếng Anh', width: 425 },
        { field: 'descriptionvi', headerName: 'Mô tả tiếng việt', width: 425 },
        {
            field: 'action',
            headerName: 'Hành động',
            width: 150,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={'/product/' + params.row._id}>
                            <button className={cx('product-list-edit')}>Chỉnh sửa</button>
                        </Link>
                        <DeleteOutline
                            className={cx('product-list-delete')}
                            onClick={() => showDeleteConfirm(params.row._id)}
                        />
                    </>
                );
            },
        },
    ];

    return (
        <div className={cx('product-list')}>
            <Link to="/newcollection">
                <Button customClass={styles}>Thêm danh mục</Button>
            </Link>
            <div className={cx('grid')}>
                <DataGrid
                    rows={collections}
                    disableSelectionOnClick
                    columns={columns}
                    getRowId={(row) => row._id}
                    pageSize={8}
                    checkboxSelection
                    rowsPerPageOptions={[8]}
                    rowHeight={55}
                />
            </div>
        </div>
    );
}
