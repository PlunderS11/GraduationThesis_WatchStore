import { Modal } from 'antd';
import classNames from 'classnames/bind';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { Spin } from 'antd';

import styles from './ModalNews.module.scss';
import axiosClient from '~/api/axiosClient';
import { useRef, useState } from 'react';
import Button from '~/components/Button/Button';
import InputField from '~/components/InputField/InputField';
import { useNavigate } from 'react-router-dom';
import { RichTextEditor } from '~/components/RichTextEditor/RichTextEditor';

const cx = classNames.bind(styles);

const ModalNews = (props) => {
    const { open, onClose } = props;
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState({ nd: '' });
    const contentRef = useRef();

    const handleCancel = () => {
        formik.values.title = '';
        formik.values.description = '';
        formik.values.image = [];
        formik.values.content = '';

        formik.errors.title = '';
        formik.errors.description = '';
        formik.errors.image = '';
        formik.errors.content = '';
        setImage([]);
        setDelImg([]);
        onClose(false);
    };

    //-------------------------------------------------------------

    const navigate = useNavigate();

    //input img
    //-----------------------------------------------------------
    const [image, setImage] = useState([]);
    const [delImg, setDelImg] = useState([]);

    const handleMultiFile = (e) => {
        setImage(e.target.files);
        setDelImg(Array.from(e.target.files));
    };

    const handleDelImg = (i) => {
        delImg.splice(i, 1);
        setDelImg([...delImg]);
        setImage([...delImg]);
    };
    //-----------------------------------------------------------

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: '',
            image: Array.prototype.slice.call(image),
            description: '',
            content: content.nd,
        },
        validationSchema: Yup.object().shape({
            title: Yup.string().required('Nhập tiêu đề bài viết'),
            image: Yup.array().min(1, 'Chọn hình ảnh bài viết'),
            description: Yup.string().required('Nhập tóm tắt'),
            // content: Yup.string().required('Nhập nội dung'),
        }),
        onSubmit: async (values) => {
            const { title, image, description, content } = values;

            const formData = new FormData();
            formData.append('image', image[0]);
            formData.append('title', title);
            formData.append('description', description);
            formData.append('content', content);
            // formData.append('isDelete', isDelete);

            setLoading(true);
            try {
                const res = await axiosClient.post('post/', formData);
                if (res) {
                    toast.success('Thêm thành công!');
                    handleCancel();
                    navigate('/news');
                }
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <>
            <Modal
                destroyOnClose={true}
                onCancel={handleCancel}
                open={open}
                title="THÊM MỚI BÀI VIẾT"
                width={800}
                centered
                footer={[]}
            >
                <Spin spinning={loading}>
                    <div className={cx('new-news')}>
                        <form onSubmit={formik.handleSubmit} className={cx('add-news-form')} spellCheck="false">
                            <div className={cx('add-news-item')}>
                                <label>Hình ảnh</label>
                                {/* <input type="file" id="image" /> */}
                                <label className={cx('input-image')} htmlFor="images">
                                    Chọn hình ảnh
                                </label>
                                <input
                                    type="file"
                                    id="images"
                                    name="images"
                                    accept="image/*"
                                    onChange={(e) => handleMultiFile(e)}
                                    hidden
                                />
                                <div className={cx('list-img')}>
                                    {delImg.map((img, i) => (
                                        <div className={cx('img')} key={i}>
                                            <img className={cx('item-img')} src={URL.createObjectURL(img)} alt="" />
                                            <i className={cx('btn-x')} onClick={() => handleDelImg(i)}>
                                                X
                                            </i>
                                        </div>
                                    ))}
                                </div>
                                {formik.errors.image && (
                                    <div className={cx('input-feedback')}>{formik.errors.image}</div>
                                )}
                            </div>

                            <div className={cx('add-news-item')}>
                                <label>Thông tin bài viết</label>
                            </div>
                            <div className={cx('add-news-item')}>
                                <InputField
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="."
                                    value={formik.values.title}
                                    label={'Tiêu đề'}
                                    require
                                    touched={formik.touched.title}
                                    error={formik.errors.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            <div className={cx('add-news-item')}>
                                <InputField
                                    type="textarea"
                                    id="description"
                                    name="description"
                                    placeholder="."
                                    value={formik.values.description}
                                    label={'Tóm tắt'}
                                    require
                                    touched={formik.touched.description}
                                    error={formik.errors.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            <div className={cx('add-news-item')}>
                                <RichTextEditor
                                    ref={contentRef}
                                    onChange={(e) => {
                                        content.nd = e;
                                    }}
                                />
                                {formik.errors.content && (
                                    <div className={cx('input-feedback')}>{formik.errors.content}</div>
                                )}
                            </div>
                            <Button type="submit" customClass={styles}>
                                Thêm
                            </Button>
                        </form>
                    </div>
                </Spin>
            </Modal>
        </>
    );
};
export default ModalNews;
