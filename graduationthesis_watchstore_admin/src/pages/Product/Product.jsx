import classNames from 'classnames/bind';
// import { Publish } from '@material-ui/icons';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { productData } from '../../data/dummyData.js';
import styles from './Product.module.scss';
import Chart from '~/components/Chart/Chart';
import axiosClient from '~/api/axiosClient';
import InputField from '~/components/InputField/InputField';
import Button from '~/components/Button/Button';

const cx = classNames.bind(styles);

export default function Product() {
    const navigate = useNavigate();
    const params = useParams();
    const [product, setProduct] = useState({});
    const [collectionObj, setcollectionObj] = useState({});
    const [img, setImg] = useState();
    const [collections, setCollections] = useState([]);
    const [rerender, setrerender] = useState([]);
    const productId = params.productId;

    useEffect(() => {
        const getCollections = async () => {
            const res = await axiosClient.get('collections/allCols/');

            setCollections(res.data.collections);
        };
        getCollections();
    }, []);

    useEffect(() => {
        const getProduct = async () => {
            const res = await axiosClient.get('product/detail/' + productId);
            setProduct(res.data.detailProduct);
            setImg(res.data.detailProduct.images[0]);
            setcollectionObj(res.data.detailProduct.collectionObj);
        };
        getProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rerender]);

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
            name: product.name + '',
            brand: product.brand + '',
            type: product.type + '',
            originalPrice: product.originalPrice,
            finalPrice: product.finalPrice,
            sex: product.sex + '',
            images: Array.prototype.slice.call(image),
            collectionObj: collectionObj._id + '',
            descriptionvi: product.descriptionvi + '',
            descriptionen: product.descriptionen + '',
            featuresvi: [].concat(product.featuresvi).join(';'),
            featuresen: [].concat(product.featuresen).join(';'),
            note: product.note + '',
            sold: product.sold,
            stock: product.stock,
            isDelete: product.isDelete,
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Nhập tên sản phẩm'),
            brand: Yup.string().required('Nhập hãng'),
            type: Yup.string().required('Chọn loại sản phẩm'),
            originalPrice: Yup.string().required('Nhập giá ban đầu'),
            finalPrice: Yup.string().required('Nhập giá cuối'),
            sex: Yup.string().required('Chọn gới tính'),
            // images: Yup.array().min(1, 'Chọn ảnh sản phẩm'),
            collectionObj: Yup.string().required('Chọn bộ sưu tập'),
            descriptionvi: Yup.string().required('Nhập mô tả tiếng Việt'),
            descriptionen: Yup.string().required('Nhập mô tả tiếng Anh'),
            featuresvi: Yup.string().required('Nhập tính năng tiếng Việt'),
            featuresen: Yup.string().required('Nhập tính năng tiếng Anh'),
            stock: Yup.string().required('Nhập tồn kho'),
        }),
        onSubmit: async (values) => {
            const {
                name,
                brand,
                type,
                originalPrice,
                finalPrice,
                sex,
                images,
                collectionObj,
                descriptionvi,
                descriptionen,
                featuresvi,
                featuresen,
                note,
                sold,
                stock,
                isDelete,
            } = values;
            // console.log(values);

            const formData = new FormData();
            if (image.length > 0) {
                for (let i = 0; i < images.length; i++) {
                    formData.append('images', images[i]);
                }
            }

            formData.append('name', name);
            formData.append('brand', brand);
            formData.append('type', type);
            formData.append('originalPrice', originalPrice);
            formData.append('finalPrice', finalPrice);
            formData.append('sex', sex);
            formData.append('collectionObj', collectionObj);
            formData.append('descriptionvi', descriptionvi);
            formData.append('descriptionen', descriptionen);
            formData.append('featuresvi', featuresvi.split(';'));
            formData.append('featuresen', featuresen.split(';'));
            formData.append('note', note);
            formData.append('sold', sold);
            formData.append('stock', stock);
            formData.append('isDelete', isDelete);

            // console.log(values);
            try {
                // await axiosClient.post('product/', {
                //     name: name,
                //     brand: brand,
                //     type: type,
                //     price: price,
                //     sex: sex,
                //     images: images,
                //     collectionName: collectionName,
                //     descriptionen: descriptionen,
                //     featuresen: featuresen.split(';'),
                //     sold: sold,
                //     stock: stock,
                //     createdAt: createdAt,
                //     updatedAt: updatedAt,
                //     descriptionvi: descriptionvi,
                //     featuresvi: featuresvi.split(';'),
                // });
                const res = await axiosClient.put('product/' + productId, formData);
                if (res) {
                    toast.success('Cập nhật thành công!');
                    // navigate('/products');
                    setDelImg([]);
                    setrerender(!rerender);
                }
            } catch (error) {
                toast.error(error);
            }
        },
    });

    return (
        <div className={cx('product')}>
            <div className={cx('product-title-container')}>
                <h1 className={cx('product-title')}>Thông tin sản phẩm</h1>
            </div>
            <div className={cx('product-top')}>
                <div className={cx('product-top-right')}>
                    <div className={cx('product-info-top')}>
                        <img src={img} alt="" className={cx('product-info-img')} />
                        <span className={cx('product-name')}>{product.name}</span>
                    </div>
                    <div className={cx('product-info-bottom')}>
                        <div className={cx('product-info-item')}>
                            <span className={cx('product-info-key')}>Đã bán:</span>
                            <span className={cx('product-info-value')}>{product.sold}</span>
                        </div>
                        <div className={cx('product-info-item')}>
                            <span className={cx('product-info-key')}>Tồn kho:</span>
                            <span className={cx('product-info-value')}>{product.stock}</span>
                        </div>
                    </div>
                </div>
                <div className={cx('product-top-left')}>
                    <Chart data={productData} dataKey="Sales" title="Hiệu suất bán hàng" />
                </div>
            </div>
            <div className={cx('product-bottom')}>
                {/* <form className={cx('product-form')}> */}
                {/* <div className={cx('product-form-left')}> */}

                <form onSubmit={formik.handleSubmit} className={cx('add-product-form')} spellCheck="false">
                    <div className={cx('add-product-item')}>
                        <label className={cx('lable-update')}>Hình ảnh hiện tại sản phẩm</label>

                        <div className={cx('list-img')}>
                            {product.images !== undefined &&
                                product.images.map((img, i) => (
                                    <div className={cx('img')} key={i}>
                                        <img className={cx('item-img')} src={img} alt="" />
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className={cx('add-product-item')}>
                        <label className={cx('lable-update')}>Cập nhật hình ảnh sản phẩm</label>
                        {/* <input type="file" id="image" /> */}
                        <label className={cx('input-image')} for="images">
                            Chọn hình ảnh
                        </label>
                        <input
                            type="file"
                            id="images"
                            name="images"
                            accept="image/*"
                            multiple
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
                        {formik.errors.images && <div className={cx('input-feedback')}>{formik.errors.images}</div>}
                    </div>

                    <label className={cx('lable-update')}>Thông tin sản phẩm</label>

                    <div className={cx('add-product-item')}>
                        <label>Loại</label>
                        <select
                            className={cx('select-item')}
                            id="type"
                            name="type"
                            value={formik.values.type}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value="" label="--Chọn loại sản phẩm--">
                                --Chọn loại sản phẩm--
                            </option>
                            <option value="watch" label="Watch">
                                Watch
                            </option>
                            <option value="strap" label="Strap">
                                Strap
                            </option>
                            <option value="bracelet" label="Bracelet">
                                Bracelet
                            </option>
                        </select>
                        {formik.errors.type && <div className={cx('input-feedback')}>{formik.errors.type}</div>}
                    </div>

                    <div className={cx('add-product-item')}>
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

                    <div className={cx('add-product-item')}>
                        <label>Danh mục</label>
                        <select
                            className={cx('select-item')}
                            id="collectionObj"
                            name="collectionObj"
                            value={formik.values.collectionObj}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value="" label="--Chọn danh mục--">
                                --Chọn danh mục--
                            </option>
                            {collections.map((col, index) => {
                                return (
                                    <option key={index} value={col._id} label={col.name}>
                                        {col.name}
                                    </option>
                                );
                            })}
                        </select>
                        {formik.errors.collectionObj && (
                            <div className={cx('input-feedback')}>{formik.errors.collectionObj}</div>
                        )}
                    </div>

                    <div className={cx('add-product-item')}>
                        <label>Thông tin sản phẩm</label>
                    </div>
                    <div className={cx('add-product-item')}>
                        <InputField
                            type="text"
                            id="name"
                            name="name"
                            placeholder="."
                            value={formik.values.name}
                            label={'Tên sản phẩm'}
                            require
                            touched={formik.touched.name}
                            error={formik.errors.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    <div className={cx('add-product-item')}>
                        <InputField
                            type="text"
                            id="brand"
                            name="brand"
                            placeholder="."
                            value={formik.values.brand}
                            label={'Hãng'}
                            require
                            touched={formik.touched.brand}
                            error={formik.errors.brand}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    <div className={cx('add-product-item')}>
                        <InputField
                            type="number"
                            id="originalPrice"
                            name="originalPrice"
                            placeholder="."
                            value={String(formik.values.originalPrice)}
                            label={'Giá ban đầu'}
                            require
                            touched={formik.touched.originalPrice}
                            error={formik.errors.originalPrice}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    <div className={cx('add-product-item')}>
                        <InputField
                            type="number"
                            id="finalPrice"
                            name="finalPrice"
                            placeholder="."
                            value={String(formik.values.finalPrice)}
                            label={'Giá cuối'}
                            require
                            touched={formik.touched.finalPrice}
                            error={formik.errors.finalPrice}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    <div className={cx('add-product-item')}>
                        <InputField
                            type="number"
                            id="stock"
                            name="stock"
                            placeholder="."
                            value={String(formik.values.stock)}
                            label={'Tồn kho'}
                            require
                            touched={formik.touched.stock}
                            error={formik.errors.stock}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    <div className={cx('add-product-item')}>
                        <InputField
                            type="textarea"
                            id="descriptionen"
                            name="descriptionen"
                            placeholder="."
                            value={formik.values.descriptionen}
                            label={'Mô tả tiếng Anh'}
                            require
                            touched={formik.touched.descriptionen}
                            error={formik.errors.descriptionen}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    <div className={cx('add-product-item')}>
                        <InputField
                            type="textarea"
                            id="descriptionvi"
                            name="descriptionvi"
                            placeholder="."
                            value={formik.values.descriptionvi}
                            label={'Mô tả tiếng Việt'}
                            require
                            touched={formik.touched.descriptionvi}
                            error={formik.errors.descriptionvi}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    <div className={cx('add-product-item')}>
                        <InputField
                            type="textarea"
                            id="featuresen"
                            name="featuresen"
                            placeholder="."
                            value={formik.values.featuresen}
                            label={'Tính năng tiếng Anh'}
                            require
                            touched={formik.touched.featuresen}
                            error={formik.errors.featuresen}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    <div className={cx('add-product-item')}>
                        <InputField
                            type="textarea"
                            id="featuresvi"
                            name="featuresvi"
                            placeholder="."
                            value={formik.values.featuresvi}
                            label={'Tính năng tiếng Việt'}
                            require
                            touched={formik.touched.featuresvi}
                            error={formik.errors.featuresvi}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    <div className={cx('add-product-item')}>
                        <InputField
                            type="textarea"
                            id="note"
                            name="note"
                            placeholder="."
                            value={formik.values.note}
                            label={'Ghi chú'}
                            require
                            touched={formik.touched.note}
                            error={formik.errors.note}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                    <Button type="submit" customClass={styles}>
                        Cập nhật
                    </Button>
                </form>
                {/* </div> */}
                {/* <div className={cx('product-form-right')}>
                    <div className={cx('product-upload')}>
                        <img
                            src="https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                            alt=""
                            className={cx('product-upload-img')}
                        />
                        <label>
                            <Publish />
                        </label>
                        <input type="file" id="file" style={{ display: 'none' }} />
                    </div>
                    <button className={cx('product-button')}>Cập nhật</button>
                </div> */}
                {/* </form> */}
            </div>
        </div>
    );
}
