import { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './UserList.module.scss';
import { DeleteOutline } from '@material-ui/icons';
import { userRows } from '../../data/dummyData.js';
import { Link } from 'react-router-dom';
import Grid from '~/components/Grid/Grid';

const cx = classNames.bind(styles);

export default function UserList() {
    const [data, setData] = useState(userRows);

    const handleDelete = (id) => {
        setData(data.filter((item) => item.id !== id));
    };

    const columns = [
        { field: '_id', headerName: 'ID', width: 100 },
        {
            field: 'user',
            headerName: 'Tên khách hàng',
            width: 275,
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
            width: 275,
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
            <div className={cx('grid')}>
                {/* <DataGridPro
                    components={{ Toolbar: GridToolbar }}
                    rows={data}
                    disableRowSelectionOnClick
                    disableColumnResize
                    columns={columns}
                    // getRowId={(row) => row._id}
                    pagination
                    autoPageSize={true}
                    rowHeight={58}
                /> */}
                <Grid headers={columns} datas={userRows} rowHeight={54} />
            </div>
        </div>
    );
}
