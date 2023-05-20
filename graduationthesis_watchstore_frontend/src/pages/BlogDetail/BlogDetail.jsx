import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

import style from './BlogDetail.module.scss';
import classNames from 'classnames/bind';
import MyBreadcrumb from '../../components/Breadcrumb/MyBreadcrumb';
import { Image, Spin } from 'antd';

const cx = classNames.bind(style);

const BlogDetail = () => {
    const params = useParams();
    const [blog, setBlog] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleGetBlogInfo = async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get(`post/detail/${params.id}`);
                setBlog(res.data.detailPost);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };
        handleGetBlogInfo();
    }, [params.id]);

    return (
        <Spin spinning={loading}>
            <div className={cx('blogdetail-page')}>
                <div className={cx('container')}>
                    <MyBreadcrumb urlParams={blog?.title} detail />
                    <div className={cx('title')}>
                        <h1>Tin tức</h1>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className={cx('blog-body')}>
                    <Image src={blog?.image} width={'100%'} />

                    <div className={cx('blog-body__header')}>
                        <div className={cx('blog-body-title')}>{blog?.title}</div>
                        <div className={cx('blog-body-meta')}>
                            <div className={cx('blog-body-meta-item')}>
                                <span>{new Date(blog?.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className={cx('blog-body__content')}>
                        <div dangerouslySetInnerHTML={{ __html: `${blog?.content}` }}></div>
                    </div>
                </div>
            </div>
        </Spin>
    );
};

export default BlogDetail;
