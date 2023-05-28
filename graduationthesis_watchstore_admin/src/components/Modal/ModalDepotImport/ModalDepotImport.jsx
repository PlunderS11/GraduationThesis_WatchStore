import classNames from 'classnames/bind';
import { Spin } from 'antd';
import styles from './ModalDepotImport.module.scss';
import { useState } from 'react';
import { Button, Col, Form, Input, message, Modal, Row, Select, Table } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import Column from 'antd/es/table/Column';
import InputField from '~/components/InputField/InputField';

const cx = classNames.bind(styles);

const ModalDepotImport = (props) => {
    const { open, onClose, status } = props;
    const [loading, setLoading] = useState(false);

    const handleCancel = () => {
        onClose(false);
    };
    console.log(status);
    //-------------------------------------------------------------
    const [form] = Form.useForm();

    return (
        <>
            <Modal
                destroyOnClose={true}
                onCancel={handleCancel}
                open={open}
                title="NHẬP KHO"
                width={800}
                centered
                footer={[]}
            >
                <Spin spinning={loading}>
                    <Form layout="vertical" form={form}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Kho" name="depotId">
                                    <Select>
                                        <Select.Option>test</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Mã phiếu nhập kho" name="code">
                                    <Input placeholder="" disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Ghi chú" name="note">
                                    <InputField showCount maxLength={255} placeholder="" style={{ height: 117 }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Người tạo" name="employeeName">
                                    <Input placeholder="" disabled />
                                </Form.Item>
                                <Form.Item label="Ngày tạo" name="createdDate">
                                    <Input placeholder="" disabled />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.List name="products">
                                    {(fields, { add, remove }) => (
                                        <Table
                                            tableLayout="auto"
                                            pagination={false}
                                            size="small"
                                            rowKey={(item) => item.key}
                                            dataSource={fields}
                                            footer={(fields) => {
                                                return (
                                                    <Button onClick={add}>
                                                        <PlusOutlined /> Thêm dòng
                                                    </Button>
                                                );
                                            }}
                                        >
                                            <Column
                                                title="Sản phẩm"
                                                dataIndex="pruduct"
                                                key="name"
                                                width={350}
                                                render={(text, record, index) => (
                                                    <Form.Item name={[index, 'productId']} className="m-0">
                                                        <Select
                                                            disabled={!form.getFieldsValue().depotId}
                                                            allowClear
                                                            showSearch
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) =>
                                                                (
                                                                    option?.label?.toString().toLowerCase() ?? ''
                                                                ).includes(input)
                                                            }
                                                            filterSort={(optionA, optionB) =>
                                                                (optionA?.label?.toString() ?? '')
                                                                    .toLowerCase()
                                                                    .localeCompare(
                                                                        (
                                                                            optionB?.label?.toString() ?? ''
                                                                        ).toLowerCase(),
                                                                    )
                                                            }
                                                            onClick={() => {
                                                                if (!form.getFieldsValue().depotId) {
                                                                    message.info('Chưa chọn kho');
                                                                }
                                                            }}
                                                            //     options={
                                                            //         productData?.products.map((item: Product) => ({
                                                            //         value: item.id,
                                                            //         label: item.name,
                                                            //         disabled:
                                                            //             form
                                                            //                 .getFieldsValue()
                                                            //                 .products.filter((p) => item.id == p.productId)
                                                            //                 .length > 0,
                                                            //     }))
                                                            // }
                                                        />
                                                    </Form.Item>
                                                )}
                                            />
                                            <Column
                                                title="Số lượng"
                                                dataIndex="quantity"
                                                key="quantity"
                                                align="right"
                                                render={(text, record, index) => (
                                                    <Form.Item name={[index, 'productQuantity']} className="m-0">
                                                        <InputField style={{ width: 80, textAlign: 'right' }} />
                                                    </Form.Item>
                                                )}
                                            />
                                            <Column
                                                title="Ghi chú sản phẩm"
                                                dataIndex="noteProduct"
                                                key="noteProduct"
                                                render={(text, record, index) => (
                                                    <Form.Item name={[index, 'productNote']} className="m-0">
                                                        <Input style={{ width: 150 }} />
                                                    </Form.Item>
                                                )}
                                            />
                                            <Column
                                                key="delProduct"
                                                render={(text, record, index) => (
                                                    <Form.Item className="m-0">
                                                        <Button
                                                            type="default"
                                                            icon={<CloseOutlined />}
                                                            disabled={fields.length === 1}
                                                            onClick={() => {
                                                                remove(index);
                                                            }}
                                                        />
                                                    </Form.Item>
                                                )}
                                            />
                                        </Table>
                                    )}
                                </Form.List>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
};
export default ModalDepotImport;
