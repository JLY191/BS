import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AMapLoader from '@amap/amap-jsapi-loader';
import { Input, Button, List, Pagination, message } from 'antd';

const MapPage = () => {
    const [deviceId, setDeviceId] = useState('');
    const [deviceInfo, setDeviceInfo] = useState([]);
    const [trackPoints, setTrackPoints] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // 每页显示的条目数

    useEffect(() => {
        const loadMap = () => {
            window._AMapSecurityConfig = {
                securityJsCode: '27c0d87a183212d1ad6d4d9f84c68a6c',
            };
            AMapLoader.load({
                key: '7dcdf391b0e4473894a296fc0fd8d295',
                version: '2.0',
            }).then((AMap) => {
                // 创建地图实例
                const map = new AMap.Map('mapContainer', {
                    zoom: 13,
                    center: [120.176302, 30.277184],
                });

                // 绘制轨迹
                if (trackPoints.length > 0) {
                    const polyline = new AMap.Polyline({
                        path: trackPoints,
                        strokeColor: '#3366FF',
                        strokeOpacity: 1,
                        strokeWeight: 5,
                        map: map,
                    });

                    // 在每个轨迹点添加标签
                    trackPoints.forEach((point, index) => {
                        const marker = new AMap.Marker({
                            position: point,
                            map: map,
                        });

                        // 自定义标签内容
                        const label = new AMap.Text({
                            position: point,
                            text: `轨迹点 ${index + 1}`, // 标签文本
                            offset: new AMap.Pixel(0, -20), // 偏移位置
                            style: {
                                backgroundColor: '#fff',
                                border: '1px solid #ccc',
                                padding: '5px',
                                borderRadius: '5px',
                            },
                        });

                        // 在地图上添加标签
                        label.setMap(map);

                    });

                    // 缩放地图，使整个轨迹可见
                    map.setFitView();
                }
            });
        };

        // 调用加载地图的函数
        loadMap();
    }, [trackPoints]);

    const handleSearch = () => {
        // 发起查询请求
        axios.get('/message/all', { deviceId })
            .then(response => {
                const allMessages = response.data.Data.flat();
                const filteredMessages = allMessages.filter(message => message.clientId === deviceId);
                if (filteredMessages.length === 0) {
                    message.error("未查到设备信息，请检查设备ID输入是否有误！");
                    return;
                }
                // console.log(filteredMessages);
                message.success("查询成功！")
                setDeviceInfo(filteredMessages);

                // 从查询结果中提取经纬度信息
                const points = filteredMessages.map(message => [message.lng, message.lat]);
                // console.log(points);
                setTrackPoints(points);
                setCurrentPage(1);
            })
            .catch(error => {
                console.error('查询设备信息失败:', error);
            });
    };

    const currentDeviceData = deviceInfo.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <Input
                    style={{width: '200px', marginRight: '16px', marginTop: '16px'}}
                    placeholder="输入设备ID"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                />
                <Button type="primary" onClick={handleSearch} style={{marginTop: '16px'}}>查询</Button>
            </div>
            <div id="mapContainer" style={{width: '100%', height: '400px', marginTop: '20px'}}></div>
            <div>
                <h3>设备信息：</h3>
                <List
                    dataSource={currentDeviceData}
                    renderItem={(message, index) => (
                        <List.Item
                            key={index}>{`轨迹点: ${index + 1 + (currentPage-1)*10}, Device ID: ${message.clientId}, Time: ${new Date(message.timestamp).toLocaleString()}, Value: ${message.value}`}</List.Item>
                    )}
                />
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={deviceInfo.length}
                    onChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
};

export default MapPage;

