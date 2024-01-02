// AddDeviceForm.jsx

import React from 'react';
import { Form, Input } from 'antd';

const AddDeviceForm = ({ onFinish, formRef }) => {
    const [form] = Form.useForm();

    React.useImperativeHandle(formRef, () => ({
        submit: form.submit,
    }));
    return (
        <Form form={form} onFinish={onFinish}>
            <Form.Item label="设备名" name="name" rules={[{ required: true, message: '请输入设备名' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="设备ID" name="clientId" rules={[{ required: true, message: '请输入设备ID，请以device+4位数字，如device1111' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="纬度" name="lat" rules={[{ required: true, message: '请输入纬度' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="经度" name="lng" rules={[{ required: true, message: '请输入经度' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="类型" name="type" rules={[{ required: true, message: '请输入类型，大于1的整数' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="值" name="value" rules={[{ required: true, message: '请输入值' }]}>
                <Input />
            </Form.Item>
        </Form>
    );
};

export default AddDeviceForm;
