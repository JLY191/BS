import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Select, message } from 'antd';
import Topbar from '../Topbar';
import './index.css'

const Option = Select.Option;

function EmailLogin() {
  const navigate = useNavigate();

  const onFinish = (values) => {
      const { email, password } = values;
    axios.post('/user/login', {
      email,
      password,
    })
    .then(res => {
      const c = res.data.Code;
      if(c == 200) {
        message.success("登录成功！");
        sessionStorage.setItem("user", JSON.stringify(res.data.Data[0]));
        navigate('/dashboard');
      }
      else {
        message.error("登录失败，请检查您输入的信息是否有误！");
      }
    })
    .catch(err => {
      message.error(err.message);
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('请完善登录信息！');
  };

  return (
    <div>
      <Topbar />
      <div className='box'>
        <div className='login-box'>
          <div style={{ textAlign: 'center' }}>
            <h1 className='title'>用户登录</h1>
          </div>
          <Form
            name="basic"
            className='login-form'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
                name="email"
                rules={[{ required: true, message: '请输入邮箱！' }]}
            >
              <Input size='large' prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入邮箱" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码！' }]}
            >
              <Input size='large'
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="请输入密码"
              />
            </Form.Item>

            <Form.Item>
              <Link to="/login" className="login-form-user">
                用户名登录
              </Link>
              <Link to="/register" className="login-form-forgot">
                还没有账号？点击注册
              </Link>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>

        </div>

      </div>
    </div>

  );
}

export default EmailLogin;