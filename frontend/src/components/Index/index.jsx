// Index.jsx

import React from 'react';
import './index.css';

const Index = () => {
    return (
        <div className="index-container">
            <h2 className="welcome-message">🥳 欢迎来到物联网设备管理平台 🥳</h2>
            <p className="description">💻 2023-2024 秋冬 B/S 体系软件设计 💻</p>
            <p className="description">By JLY</p>
            <div className="user-guide">
                <p className="guide-heading">用户指南：</p>
                <ul>
                    <li>↗️ 右上角是个人管理中心，点击可以查看用户历史和退出登录 ↗️</li>
                    <li>↖️ 本块是核心展示区，展示区左上角是定位栏 ↖️</li>
                    <li>⬅️ 左侧是功能导航栏，可以查看设备信息等 ⬅️</li>
                </ul>
            </div>
        </div>
    );
};

export default Index;
