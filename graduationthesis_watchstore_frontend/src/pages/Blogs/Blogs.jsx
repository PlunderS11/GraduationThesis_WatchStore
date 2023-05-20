import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import Button from '../../components/Button/Button';

import axiosClient from '../../api/axiosClient';
import ImageCustom from '../../components/ImageCustom/ImageCustom';
import style from './Blog.module.scss';
import { Card, Descriptions, Space, Spin } from 'antd';
import MyBreadcrumb from '../../components/Breadcrumb/MyBreadcrumb';
import { useTranslation } from 'react-i18next';

const cx = classNames.bind(style);

const Blogs = () => {
    const { t } = useTranslation();
    const [posts, setPost] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleGetNews = async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get('post');
                setPost(res.data.post);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };
        handleGetNews();
    }, []);

    return (
        <Spin spinning={loading}>
            <div className={cx('blog-page')}>
                <div className={cx('container')}>
                    <MyBreadcrumb />
                    <div className={cx('title')}>
                        <h1>{t('header.blogs')}</h1>
                    </div>
                </div>
            </div>
            <div className={cx('container')}>
                <div className={cx('list-post')}>
                    <div className={cx('list-post__body')}>
                        <Space direction="vertical" size="large">
                            {posts.map((item, i) => (
                                <Card
                                    key={i}
                                    hoverable
                                    style={{ width: '100%' }}
                                    bodyStyle={{ padding: 0 }}
                                    cover={
                                        <div className={cx('cover')}>
                                            <ImageCustom src={item.image} />
                                            <div>
                                                <span>{new Date(item.createdAt).toLocaleString()}</span>
                                                <Descriptions
                                                    column={1}
                                                    title={
                                                        <div
                                                            style={{
                                                                fontSize: 25,
                                                                lineHeight: '30px',
                                                                whiteSpace: 'normal',
                                                            }}
                                                        >
                                                            {item.title}
                                                        </div>
                                                    }
                                                    contentStyle={{ fontSize: 16 }}
                                                    style={{ marginTop: 10 }}
                                                >
                                                    <Descriptions.Item>
                                                        <div className={cx('post-body-content')}>
                                                            {item.description}
                                                        </div>
                                                    </Descriptions.Item>
                                                    <Descriptions.Item
                                                        contentStyle={{
                                                            justifyContent: window.innerWidth < 450 ? 'center' : 'left',
                                                        }}
                                                    >
                                                        <Button customClass={style} to={`/blog/${item._id}`}>
                                                            {t('button.loadMore')}
                                                        </Button>
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            </div>
                                        </div>
                                    }
                                ></Card>
                            ))}
                        </Space>
                    </div>
                </div>
            </div>
        </Spin>
    );
};

export default Blogs;
