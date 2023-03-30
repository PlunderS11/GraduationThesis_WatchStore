import { Modal } from 'antd';
// import { useState } from 'react';

import classNames from 'classnames/bind';

import InputField from '~/components/InputField/InputField';
import styles from './ModalUserInfo.module.scss';
import axiosClient from '~/api/axiosClient';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

const ModalUserInfo = (props) => {
    const { open, onClose, id } = props;

    const handleCancel = () => {
        onClose(false);
    };

    //-------------------------------------------------------------

    const [user, setUser] = useState({});
    const [address, setAddress] = useState({});

    const fecthData = async () => {
        if (id !== '') {
            const getUser = async () => {
                const res = await axiosClient.get('user/find/' + String(id));
                setUser(res.data);
                setAddress(res.data.address);
            };
            getUser();
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
            <Modal onCancel={handleCancel} open={open} title="THÔNG TIN KHÁCH HÀNG" width={740} centered footer={[]}>
                <div className={cx('new-user')}>
                    {/* <h1 className={cx('add-product-title')}>Cập nhật danh mục</h1> */}
                    <form className={cx('add-user-form')} spellCheck="false">
                        <div className={cx('add-user-item')}>
                            <InputField
                                customClass={styles}
                                readonly={true}
                                type="text"
                                id="username"
                                name="username"
                                placeholder="."
                                value={String(user.username)}
                                label={'Tên khách hàng'}
                                require
                            />
                        </div>
                        <div className={cx('add-user-item')}>
                            <InputField
                                customClass={styles}
                                readonly={true}
                                type="text"
                                id="sex"
                                name="sex"
                                placeholder="."
                                value={String(user.sex === 'm' ? 'Nam' : 'Nữ')}
                                label={'Tên khách hàng'}
                                require
                            />
                        </div>

                        <div className={cx('add-user-item')}>
                            <InputField
                                customClass={styles}
                                readonly={true}
                                type="text"
                                id="email"
                                name="email"
                                value={String(user.email)}
                                placeholder="."
                                label={'Email'}
                                require
                            />
                        </div>
                        <div className={cx('add-user-item')}>
                            <InputField
                                customClass={styles}
                                readonly={true}
                                type="text"
                                id="phone"
                                name="phone"
                                placeholder="."
                                value={String(user.phone)}
                                label={'Số điện thoại'}
                                require
                            />
                        </div>
                        <div className={cx('add-user-item')}>
                            <InputField
                                customClass={styles}
                                readonly={true}
                                type="text"
                                id="created_at"
                                name="created_at"
                                placeholder="."
                                value={String(new Date(user.createdAt).toLocaleString())}
                                label={'Ngày tạo'}
                                require
                            />
                        </div>
                        {JSON.stringify(address) !== '{}' && (
                            <div className={cx('add-user-item')}>
                                <InputField
                                    customClass={styles}
                                    readonly={true}
                                    type="textarea"
                                    id="address"
                                    name="address"
                                    placeholder="."
                                    value={
                                        address.address +
                                        ', ' +
                                        address.ward.WardName +
                                        ', ' +
                                        address.district.DistrictName +
                                        ', ' +
                                        address.province.ProvinceName
                                    }
                                    label={'Địa chỉ'}
                                    require
                                    // onChange={formik.handleChange}
                                />
                            </div>
                        )}
                    </form>
                </div>
            </Modal>
        </>
    );
};
export default ModalUserInfo;
