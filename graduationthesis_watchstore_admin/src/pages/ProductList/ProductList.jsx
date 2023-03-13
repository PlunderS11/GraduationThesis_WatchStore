import classNames from 'classnames/bind';
import styles from './ProductList.module.scss';
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline } from '@material-ui/icons';
import { productRows } from '../../data/dummyData.js';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

export default function ProductList() {
    const products = productRows;

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        {
            field: 'product',
            headerName: 'Tên sản phẩm',
            width: 470,
            renderCell: (params) => {
                return (
                    <div className={cx('product-list-item')}>
                        <img className={cx('product-list-img')} src={params.row.img} alt="" />
                        {params.row.name}
                    </div>
                );
            },
        },
        { field: 'stock', headerName: 'Số lượng tồn', width: 200 },
        {
            field: 'price',
            headerName: 'Giá',
            width: 350,
        },
        {
            field: 'action',
            headerName: 'Hành động',
            width: 160,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={'/product/' + params.row._id}>
                            <button className={cx('product-list-edit')}>Chỉnh sửa</button>
                        </Link>
                        <DeleteOutline
                            className={cx('product-list-delete')}
                            // onClick={() => handleDelete(params.row._id)}
                        />
                    </>
                );
            },
        },
    ];

    return (
        <div className={cx('product-list')}>
            <DataGrid
                rows={products}
                disableSelectionOnClick
                columns={columns}
                // getRowId={(row) => row._id}
                pageSize={10}
                checkboxSelection
            />
        </div>
    );
}
