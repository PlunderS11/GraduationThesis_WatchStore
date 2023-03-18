import classNames from 'classnames/bind';
import styles from './ProductList.module.scss';
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

export default function ProductList() {
    const { confirm } = Modal;
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            const res = await axiosClient.get('product/');
            setProducts(res.data.products);
        };
        getProducts();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axiosClient.delete('product/delete/' + id);
            setProducts(products.filter((item) => item._id !== id));

            toast.success('Xóa thành công');
        } catch (error) {
            toast.error(error);
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

    const columns = [
        {
            field: 'product',
            headerName: 'Hình ảnh',
            width: 135,
            renderCell: (params) => {
                return (
                    <div className={cx('product-list-item')}>
                        <img
                            className={cx('product-list-img')}
                            src={
                                params.row.images === ''
                                    ? 'data:image/jpeg;base64,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'
                                    : JSON.parse(params.row.images)[0]
                            }
                            alt=""
                        />
                    </div>
                );
            },
        },
        { field: 'name', headerName: 'Tên sản phẩm', width: 230 },
        { field: 'type', headerName: 'Loại', width: 120 },
        { field: 'collectionName', headerName: 'Danh mục', width: 145 },

        { field: 'stock', headerName: 'Tồn', width: 105 },
        {
            field: 'price',
            headerName: 'Giá',
            width: 130,
        },
        {
            field: 'createdAt',
            headerName: 'Ngày tạo',
            width: 135,
            renderCell: (params) => {
                return <div>{new Date(params.row.createdAt).toLocaleDateString()}</div>;
            },
        },
        {
            field: 'updatedAt',
            headerName: 'Ngày cập nhật',
            width: 170,
            renderCell: (params) => {
                return <div>{new Date(params.row.updatedAt).toLocaleDateString()}</div>;
            },
        },
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
            <Link to="/newproduct">
                <Button customClass={styles}>Thêm sản phẩm</Button>
            </Link>
            <div className={cx('grid')}>
                <DataGrid
                    rows={products}
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
