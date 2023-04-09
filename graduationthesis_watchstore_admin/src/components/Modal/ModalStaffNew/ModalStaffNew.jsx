import { Modal } from 'antd';
import classNames from 'classnames/bind';
import InputField from '~/components/InputField/InputField';
import styles from './ModalStaffNew.module.scss';
import axiosClient from '~/api/axiosClient';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Button from '~/components/Button/Button';

const cx = classNames.bind(styles);

const ModalStaffNew = (props) => {
    const { open, onClose } = props;

    const handleCancel = () => {
        formik.values.username = '';
        formik.values.email = '';
        formik.values.phone = '';
        formik.values.sex = '';
        formik.errors.sex = '';
        onClose(false);
    };

    //-------------------------------------------------------------
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '12345678',
            phone: '',
            sex: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Nhập tên nhân viên'),
            email: Yup.string().required('Nhập email nhân viên'),
            phone: Yup.string().required('Nhập số điện thoại nhân viên'),
            sex: Yup.string().required('Chọn giới tính'),
        }),
        onSubmit: async (values) => {
            const { username, email, password, phone, sex } = values;

            try {
                const res = await axiosClient.post('user/addStaff', {
                    username: username,
                    email: email,
                    password: password,
                    phone: phone,
                    sex: sex,
                });
                if (res) {
                    toast.success('Thêm thành công!');
                    handleCancel();
                    navigate('/staffs');
                }
            } catch (error) {
                toast.error(error);
            }
        },
    });

    return (
        <>
            <Modal
                destroyOnClose
                onCancel={handleCancel}
                open={open}
                title="THÔNG TIN NHÂN VIÊN"
                width={740}
                centered
                footer={[]}
            >
                <div className={cx('new-user')}>
                    {/* <h1 className={cx('add-product-title')}>Cập nhật danh mục</h1> */}
                    <form onSubmit={formik.handleSubmit} className={cx('add-user-form')} spellCheck="false">
                        <div className={cx('add-user-item')}>
                            <label>Thông tin nhân viên</label>
                        </div>
                        <div className={cx('add-user-item')}>
                            <InputField
                                type="text"
                                id="username"
                                name="username"
                                placeholder="."
                                value={formik.values.username}
                                label={'Tên nhân viên'}
                                require
                                touched={formik.touched.username}
                                error={formik.errors.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        <div className={cx('add-user-item')}>
                            <InputField
                                type="text"
                                id="email"
                                name="email"
                                placeholder="."
                                value={formik.values.email}
                                label={'Email nhân viên'}
                                require
                                touched={formik.touched.email}
                                error={formik.errors.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        <div className={cx('add-user-item')}>
                            <InputField
                                type="text"
                                id="phone"
                                name="phone"
                                placeholder="."
                                value={formik.values.phone}
                                label={'Số điện thoại nhân viên'}
                                require
                                touched={formik.touched.phone}
                                error={formik.errors.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        <div className={cx('add-user-item')}>
                            <label>Giới tính</label>
                            <select
                                className={cx('select-item')}
                                id="sex"
                                name="sex"
                                value={formik.values.sex}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="" label="--Chọn giới tính--">
                                    --Chọn giới tính--
                                </option>
                                <option value="m" label="Nam">
                                    {' '}
                                    Nam
                                </option>
                                <option value="w" label="Nữ">
                                    Nữ
                                </option>
                            </select>
                            {formik.errors.sex && <div className={cx('input-feedback')}>{formik.errors.sex}</div>}
                        </div>
                        <Button type="submit" customClass={styles}>
                            Thêm
                        </Button>
                    </form>
                </div>
            </Modal>
        </>
    );
};
export default ModalStaffNew;