import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { useParams } from 'react-router-dom';
import { Card, Col, Divider, Image, Modal, Row, Spin, Steps, Table } from 'antd';
import * as moment from 'moment';
import classNames from 'classnames/bind';
import { Trans, useTranslation } from 'react-i18next';

import { NumberWithCommas } from '../../functions';
import style from './OrderHistoryPage.module.scss';
import Button from '../../components/Button/Button';
import axiosClient from '../../api/axiosClient';
import MyBreadcrumb from '../../components/Breadcrumb/MyBreadcrumb';

Moment.globalFormat = 'DD/MM/YYYY';

const cx = classNames.bind(style);

const OrderHistoryPage = () => {
    const { t } = useTranslation();
    const params = useParams();

    const [modalOpen, setModalOpen] = useState(false);
    const [order, setOrder] = useState({});
    const [totalPrice, setTotalPrice] = useState();
    const [step, setStep] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        handleGetOrderHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGetOrderHistory = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get(`order/customer/${params.id}`);
            setOrder(res.data.order);
            setTotalPrice(`${NumberWithCommas(res.data.order?.finalPrice)} ₫`);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        switch (order.status?.state) {
            case 'PENDING':
                setStep(0);
                break;
            case 'PACKAGE':
                setStep(1);
                break;
            case 'DELIVERING':
                setStep(2);
                break;
            case 'COMPLETE':
                setStep(3);
                break;

            default:
                break;
        }
    }, [order.status]);

    const handleOrderCancel = async () => {
        try {
            setModalOpen(false);
            setLoading(true);
            await axiosClient.post('order/cancel/', { orderId: order._id });
            handleGetOrderHistory();
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: t('table.product'),
            dataIndex: 'product',
            align: 'center',
            render: (value, record, index) => (
                <div className={cx('cart-product')}>
                    <div key={value._id} className={cx('cart-product-image')}>
                        <img alt="" src={value.images[0]} />
                    </div>
                    <div key={value.id} className={cx('cart-product-info')}>
                        {value.name}
                    </div>
                </div>
            ),
        },

        {
            title: t('table.price'),
            dataIndex: 'product',
            align: 'right',
            render: (value, record, index) => (
                <div key={value.id} className={cx('cart-product-info')}>
                    {NumberWithCommas(record.finalPrice)}&nbsp;₫
                </div>
            ),
        },
        {
            title: t('table.quantity'),
            dataIndex: 'quantity',
            align: 'center',
            render: (value, record, index) => (
                <div key={index} className={cx('cart-product-info')}>
                    x{value}
                </div>
            ),
        },
        {
            title: t('table.total'),
            dataIndex: 'product',
            align: 'right',
            render: (value, record, index) => (
                <div key={value.id} className={cx('cart-product-info')}>
                    <span style={{ color: '#ff424e' }}>
                        {NumberWithCommas(record.finalPrice * record.quantity)}&nbsp;₫
                    </span>
                </div>
            ),
        },
    ];
    return (
        <div>
            <Modal
                title={t('breadcrumbs.notification')}
                centered
                cancelText={t('antd.popconfirm.cancelText')}
                okText={t('antd.popconfirm.okText')}
                // confirmLoading={historyStore.isLoadingHistoryOrders}
                className={cx('modal-style')}
                open={modalOpen}
                onOk={() => handleOrderCancel()}
                onCancel={() => setModalOpen(false)}
            >
                <p>{t('antd.popconfirm.title')}</p>
            </Modal>
            <Spin spinning={loading}>
                {order.finalPrice && (
                    <div className={cx('orderhistory-page')}>
                        <div className={cx('container')}>
                            <MyBreadcrumb detail urlParams={t('breadcrumbs.orderHistory')} />
                            <div className={cx('body')}>
                                <div className={cx('body__info')}>
                                    <div className={cx('body__info-header')}>
                                        <div className={cx('body__info-header-title')}>
                                            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M14.325 3.75h-4.65A3.754 3.754 0 0 1 6.75 6.675a244.274 244.274 0 0 0 0 .65 3.754 3.754 0 0 1 2.925 2.925h4.65a3.754 3.754 0 0 1 2.925-2.925v-.65a3.754 3.754 0 0 1-2.925-2.925zm.605-1.497c-.275-.003-.568-.003-.878-.003H9.948c-.31 0-.603 0-.878.003a.76.76 0 0 0-.163.003c-.453.008-.853.027-1.201.074-.628.084-1.195.27-1.65.725-.456.456-.642 1.023-.726 1.65-.047.349-.066.75-.074 1.202a.759.759 0 0 0-.003.163c-.003.275-.003.568-.003.878v.104c0 .31 0 .603.003.878a.757.757 0 0 0 .003.163c.008.453.027.853.074 1.201.084.628.27 1.195.725 1.65.456.456 1.023.642 1.65.726.349.047.75.066 1.202.074a.747.747 0 0 0 .163.003c.275.003.568.003.878.003h4.104c.31 0 .603 0 .878-.003a.746.746 0 0 0 .163-.003c.453-.008.853-.027 1.201-.074.628-.084 1.195-.27 1.65-.726.456-.455.642-1.022.726-1.65.047-.348.066-.748.074-1.201a.747.747 0 0 0 .003-.163c.003-.275.003-.568.003-.878v-.104c0-.31 0-.603-.003-.878a.747.747 0 0 0-.003-.163 10.661 10.661 0 0 0-.074-1.201c-.084-.628-.27-1.195-.726-1.65-.455-.456-1.022-.642-1.65-.726a10.673 10.673 0 0 0-1.201-.074.758.758 0 0 0-.163-.003zm.964 1.541a2.257 2.257 0 0 0 1.312 1.312 5.085 5.085 0 0 0-.023-.2c-.062-.462-.169-.66-.3-.79-.13-.13-.327-.237-.788-.3a4.933 4.933 0 0 0-.2-.022zm1.312 5.1a2.257 2.257 0 0 0-1.312 1.312c.07-.006.137-.014.2-.022.462-.063.66-.17.79-.3.13-.13.237-.328.3-.79.008-.063.015-.13.022-.2zm-9.1 1.312a2.257 2.257 0 0 0-1.312-1.312c.006.07.014.137.023.2.062.462.169.66.3.79.13.13.327.237.788.3.064.008.131.016.2.022zm-1.312-5.1a2.257 2.257 0 0 0 1.312-1.312c-.07.006-.137.014-.2.023-.462.062-.66.169-.79.3-.13.13-.237.327-.3.788-.008.064-.016.131-.022.2zM12 6.75a.25.25 0 1 0 0 .5.25.25 0 0 0 0-.5zM10.25 7a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0zm-1.566 7.448c1.866-.361 3.863-.28 5.48.684.226.135.439.304.625.512.376.423.57.947.579 1.473.191-.123.383-.26.577-.407l1.808-1.365a2.637 2.637 0 0 1 3.123 0c.836.63 1.17 1.763.571 2.723-.425.681-1.066 1.624-1.717 2.228-.66.61-1.597 1.124-2.306 1.466-.862.416-1.792.646-2.697.792-1.85.3-3.774.254-5.602-.123a14.275 14.275 0 0 0-2.865-.293H4a.75.75 0 0 1 0-1.5h2.26c1.062 0 2.134.111 3.168.324a14.1 14.1 0 0 0 5.06.111c.828-.134 1.602-.333 2.284-.662.683-.33 1.451-.764 1.938-1.215.493-.457 1.044-1.248 1.465-1.922.127-.204.109-.497-.202-.732-.37-.28-.947-.28-1.316 0l-1.808 1.365c-.72.545-1.609 1.128-2.71 1.303a8.69 8.69 0 0 1-.347.049 10.03 10.03 0 0 1-2.11.02.75.75 0 1 1 .14-1.493 8.531 8.531 0 0 0 1.697-.006.743.743 0 0 0 .15-1.138 1.152 1.152 0 0 0-.274-.222c-1.181-.705-2.759-.822-4.426-.5a12.124 12.124 0 0 0-4.535 1.935.75.75 0 0 1-.868-1.224 13.623 13.623 0 0 1 5.118-2.183z"
                                                    fill="#47991f"
                                                ></path>
                                            </svg>
                                            <Trans i18nKey="checkout.orderHistoryTitle">{{ totalPrice }}</Trans>
                                            <span style={{ fontWeight: '600' }}></span>
                                        </div>
                                        <div className={cx('body__info-header-btn')}>
                                            <Button customClass={style}>{t('button.contactStore')}</Button>
                                            {(order?.status.state === 'PENDING' ||
                                                order?.status.state === 'PACKAGE') && (
                                                <Button customClass={style} onclick={() => setModalOpen(true)}>
                                                    {t('button.orderCancel')}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <div className={cx('body__info-body')}>
                                        <Row>
                                            <Col
                                                span={window.innerWidth < 450 ? 24 : 10}
                                                style={{ padding: '0 0.5rem' }}
                                            >
                                                <div className={cx('body__info-body-address')}>
                                                    <h2 style={{ textAlign: 'center' }}>
                                                        {t('header.userOption.orderInfo')}
                                                    </h2>
                                                    <h3 style={{ margin: '10px 0 15px 0' }}>{order.name}</h3>
                                                    <div className={cx('body__info-body-address-title')}>
                                                        {t('checkout.address')}
                                                    </div>
                                                    <div className={cx('body__info-body-address-text')}>
                                                        {`${order.recipient.address}, ${order.recipient.addressWard?.WardName} ${order.recipient.addressDistrict?.DistrictName} ${order.recipient.addressProvince?.ProvinceName}`}
                                                    </div>
                                                    <div className={cx('body__info-body-address-title')}>
                                                        {t('checkout.phone')}
                                                    </div>
                                                    <div className={cx('body__info-body-address-text')}>
                                                        {order.recipient.phone}
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col span={window.innerWidth < 450 ? 24 : 14}>
                                                <div className={cx('body__info-body-process')}>
                                                    <div className={cx('body__info-body-process-step')}>
                                                        <Steps
                                                            progressDot
                                                            current={step}
                                                            direction="vertical"
                                                            items={
                                                                order?.status.state === 'CANCEL'
                                                                    ? [
                                                                          {
                                                                              title: t('cart.status.cancel'),
                                                                          },
                                                                      ]
                                                                    : [
                                                                          {
                                                                              title: t('cart.status.pending'),
                                                                              description: step === 0 && (
                                                                                  <span>
                                                                                      {moment(order.pendingDate).format(
                                                                                          'hh:mm, DD/MM/YYYY'
                                                                                      )}
                                                                                  </span>
                                                                              ),
                                                                          },
                                                                          {
                                                                              title: t('cart.status.package'),
                                                                              description: step === 1 && (
                                                                                  <span>
                                                                                      {moment(order.packageDate).format(
                                                                                          'hh:mm, DD/MM/YYYY'
                                                                                      )}
                                                                                  </span>
                                                                              ),
                                                                          },
                                                                          {
                                                                              title: t('cart.status.delivering'),
                                                                              description: step === 2 && (
                                                                                  <span>
                                                                                      {moment(
                                                                                          order.deliveringDate
                                                                                      ).format('hh:mm, DD/MM/YYYY')}
                                                                                  </span>
                                                                              ),
                                                                          },
                                                                          {
                                                                              title: t('cart.status.complete'),
                                                                              description: step === 3 && (
                                                                                  <span>
                                                                                      {moment(
                                                                                          order.completeDate
                                                                                      ).format('hh:mm, DD/MM/YYYY')}
                                                                                  </span>
                                                                              ),
                                                                          },
                                                                      ]
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className={cx('body__product')}>
                                    <div className={cx('body__info')}>
                                        {window.innerWidth < 450 ? (
                                            order.orderDetails.map((item, i) => (
                                                <div className={cx('product')}>
                                                    <div className={cx('product__thumbnail')}>
                                                        <Image width={64} src={item.product.images[0]} fallback="" />
                                                    </div>
                                                    <div className={cx('product__text')}>
                                                        <div className={cx('product__text-name')}>
                                                            {item.product.name}
                                                        </div>
                                                        <div className={cx('product__text-content')}>
                                                            <div className={cx('product__text-price')}>
                                                                {NumberWithCommas(item.finalPrice)}đ
                                                            </div>
                                                            <div className={cx('product__text-quantity')}>
                                                                x{item.quantity}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <Table
                                                rowKey={item => item._id}
                                                columns={columns}
                                                dataSource={order.orderDetails}
                                                pagination={{ position: [] }}
                                                className={cx('orderHistoryTable')}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className={cx('body__product')}>
                                    <div className={cx('body__info')}>
                                        <Card
                                            title={
                                                <div style={{ display: 'flex', gap: '9px' }}>
                                                    <svg
                                                        width="24"
                                                        height="24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M8.127 3.56a.943.943 0 0 0-1.254 0c-.885.788-2.2.822-3.123.103v16.674a2.444 2.444 0 0 1 3.123.102.943.943 0 0 0 1.254 0 2.443 2.443 0 0 1 3.246 0 .943.943 0 0 0 1.254 0 2.443 2.443 0 0 1 3.246 0 .943.943 0 0 0 1.254 0 2.444 2.444 0 0 1 3.123-.102V3.663a2.444 2.444 0 0 1-3.123-.103.943.943 0 0 0-1.254 0 2.443 2.443 0 0 1-3.246 0 .943.943 0 0 0-1.254 0 2.443 2.443 0 0 1-3.246 0zm-2.25-1.12a2.443 2.443 0 0 1 3.246 0 .943.943 0 0 0 1.254 0 2.443 2.443 0 0 1 3.246 0 .943.943 0 0 0 1.254 0 2.443 2.443 0 0 1 3.246 0 .943.943 0 0 0 1.254 0c.92-.818 2.373-.165 2.373 1.065v16.99c0 1.23-1.454 1.883-2.373 1.066a.943.943 0 0 0-1.254 0 2.444 2.444 0 0 1-3.246 0 .943.943 0 0 0-1.254 0 2.444 2.444 0 0 1-3.246 0 .943.943 0 0 0-1.254 0 2.444 2.444 0 0 1-3.246 0 .943.943 0 0 0-1.254 0c-.92.817-2.373.164-2.373-1.066V3.505c0-1.23 1.454-1.883 2.373-1.066a.943.943 0 0 0 1.254 0zM6.75 8.5a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75zm0 3.5a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75zm0 3.5a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75z"
                                                            fill="#47991f"
                                                        ></path>
                                                    </svg>
                                                    <h3>{t('checkout.checkout')}</h3>
                                                </div>
                                            }
                                            bordered={false}
                                            style={{
                                                width: '100%',
                                                padding: window.innerWidth < 450 ? '' : '15px 30px',
                                            }}
                                        >
                                            <div className={cx('body-cart-item')}>
                                                <div className={cx('body-cart-item-title')}>
                                                    {t('cart.totalProduct')}
                                                </div>
                                                <div className={cx('body-cart-item-price')}>
                                                    {NumberWithCommas(
                                                        order.orderDetails.reduce((acc, cur)=> {
                                                            acc += cur.finalPrice * cur.quantity
                                                            return acc
                                                        },0)
                                                   
                                                    )}&nbsp;₫
                                                </div>
                                            </div>
                                            <div className={cx('body-cart-item')}>
                                                <div className={cx('body-cart-item-title')}>
                                                    {t('cart.discountPrice')}
                                                </div>
                                                <div
                                                    className={cx('body-cart-item-price')}
                                                    style={{ color: '#47991f' }}
                                                >
                                                    - {NumberWithCommas(order.discountPrice)}&nbsp;₫
                                                </div>
                                            </div>
                                            <div className={cx('body-cart-item')}>
                                                <div className={cx('body-cart-item-title')}>
                                                    {t('cart.distancePrice')}
                                                </div>
                                                <div className={cx('body-cart-item-price')}>
                                                    {NumberWithCommas(order.shipPrice)}&nbsp;₫
                                                </div>
                                            </div>
                                            <div className={cx('body-cart-item')}>
                                                <div className={cx('body-cart-item-title')}>
                                                    {t('checkout.paymentMethod')}
                                                </div>
                                                <div className={cx('body-cart-item-price')}>
                                                    {order.paymentType === 'CASH'
                                                        ? t('checkout.descriptionCOD')
                                                        : t('checkout.descriptionOnl')}
                                                </div>
                                            </div>
                                            <Divider />
                                            <div className={cx('body-cart-item')}>
                                                <div className={cx('body-cart-item-total')}>{t('cart.totalPrice')}</div>
                                                <div className={cx('body-cart-item-totalp')}>
                                                    {NumberWithCommas(order.finalPrice)}&nbsp;₫
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Spin>
        </div>
    );
};

export default OrderHistoryPage;
