import React from "react";
import './index.css';
import { Space } from 'antd';

export default function Topbar() {
  return (
    <div className="top-bar">
      <div className="item1">
        <Space>
          <img src='../img/ez.jpg' width={34} height={52}   />
          <label className="bar-tag"><a href="http://localhost:3000/login">物联网设备管理平台</a></label>
        </Space>
      </div>
    </div>
  )
}