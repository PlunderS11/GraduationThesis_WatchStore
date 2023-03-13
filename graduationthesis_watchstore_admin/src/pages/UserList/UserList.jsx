import { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './UserList.module.scss';
import { DataGrid } from '@material-ui/data-grid';
import { DeleteOutline } from '@material-ui/icons';
import { userRows } from '../../data/dummyData.js';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

export default function UserList() {
    const [data, setData] = useState(userRows);

    const handleDelete = (id) => {
        setData(data.filter((item) => item.id !== id));
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        {
            field: 'user',
            headerName: 'Tên khách hàng',
            width: 300,
            renderCell: (params) => {
                return (
                    <div className={cx('user-list-user')}>
                        <img className={cx('user-list-img')} src={params.row.avatar} alt="" />
                        {params.row.username}
                    </div>
                );
            },
        },
        { field: 'email', headerName: 'Email', width: 200 },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 300,
        },
        {
            field: 'transaction',
            headerName: 'Khối lượng giao dịch',
            width: 250,
        },
        {
            field: 'action',
            headerName: 'Hành động',
            width: 160,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={'/user/' + params.row.id}>
                            <button className={cx('user-list-edit')}>Chỉnh sửa</button>
                        </Link>
                        <DeleteOutline className={cx('user-list-delete')} onClick={() => handleDelete(params.row.id)} />
                    </>
                );
            },
        },
    ];

    return (
        <div className={cx('user-list')}>
            <DataGrid rows={data} disableSelectionOnClick columns={columns} pageSize={10} checkboxSelection />
        </div>
    );
}
