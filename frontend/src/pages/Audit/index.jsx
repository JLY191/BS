import React, { useState } from 'react'
import axios from 'axios'
import request from '../../utils/request';
import { Button, Checkbox, Form, Input, Alert, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

const onFinish = (values) => {   console.log('Success:', values); }; 
const onFinishFailed = (errorInfo) => {   console.log('Failed:', errorInfo); };

export default function Audit() {
  let history = useNavigate();
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const Handleloginsubmit = () => {
    axios.post('/m3/auditlogin/login', {
      username: username,
      password: password
    }).then(res => {
      console.log(res)
      if(res.data.message === 'Login successful'){
        history('/audit/manage')
      }
      else{
        showModal()
      }
    })
  }

  return (
    <Form
    name="basic"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="Username"
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input 
        value = {username}
        onChange={e => setUsername(e.currentTarget.value)}
      />
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password 
        value = {password}
        onChange={e => setPassword(e.currentTarget.value)}
      />
    </Form.Item>

    <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
      <Checkbox>Remember me</Checkbox>
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit" onClick={Handleloginsubmit}>
        Login
      </Button>
      <Modal title="Tips:" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>账号不存在或密码错误</p>
      </Modal>
    </Form.Item>
  </Form>
  )
}
