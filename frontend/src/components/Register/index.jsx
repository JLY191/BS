import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { UserOutlined, LockOutlined, UsergroupAddOutlined, IdcardOutlined, ContainerOutlined, BankOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Result, Select } from 'antd';
import './index.css'
import Topbar from "../Topbar";

const Option = Select.Option;

function Register() {
  const navigate = useNavigate();
  const [result, setResult] = useState(false);

  const onFinish = (values) => {
    const { username, email, password, repeat_password  } = values;
    if(password !== repeat_password) {
      message.warning('两次输入密码不一致！');
      return;
    }
    if(password.length < 6) {
      message.warning('密码长度太小，请大于等于6个字符！');
      return;
    }
    axios.post('/user/register', {
      name: username,
      email: email,
      password: password,
    })
    .then(res => {
      const status = res.data;
      if(status.Code === 200) {  // 数据提交成功
        setResult(true);
        setTimeout(() => {
          message.success("跳转至登录界面！");
          navigate('/login');
          setResult(false);
        }, 3000);
      }
      else {
        if (res.data.Message === "Duplicate user name!") {
          message.error("注册失败！用户名重复！");
        } else if (res.data.Message === "Duplicate email!") {
          message.error("注册失败！邮箱重复！");
        }
      }
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.warning('请完善注册信息！');
  };

  return (
  <div>
    <Topbar />
    {
    result ? (
    <div className="box">
      <Result
        status="success"
        title="注册成功！"
        subTitle={`页面将在${3}秒后跳转`}
        className="result"
        extra={[
          <Button size='large' type="primary" key="console"
            onClick={() => {
              message.success('注册成功！');
              navigate('/login');
              setResult(false);
            }
            }
          >
            去往登录界面
          </Button>
        ]}
      />
    </div>

    ) : (
    <div className='box'>
      <div className='login-box'>
        <div style={{ textAlign: 'center' }}>
          <h1 className='title'>用户注册</h1>
        </div>
        <Form
          name="basic"
          className='register-form'
          initialValues={{ remember: true, }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input size='large' prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入用户名" />
          </Form.Item>

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

          <Form.Item
            name="repeat_password"
            rules={[{ required: true, message: '请再次输入密码！' }]}
          >
            <Input size='large'
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="请再次输入密码"
            />
          </Form.Item>

          <Form.Item>
            <Link to="/login" className="register-login-form-user">
              用户名登录
            </Link>
            <Link to="/email_login" className="register-login-form-email">
              邮箱登录
            </Link>
          </Form.Item>


          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              注册
            </Button>
          </Form.Item>
        </Form>

      </div>
    </div>
    )
  }
  </div>
  )
}

export default Register;