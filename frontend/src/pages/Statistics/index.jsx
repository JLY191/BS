import React, { useEffect, useState } from "react";
import axios from "axios";
import {Button, Card, Col, Row} from "antd";
import { Bar, Pie, Column } from "@ant-design/charts";
import {de} from "date-fns/locale";



const Statistics = () => {
    const [deviceCount, setDeviceCount] = useState(0);
    const [alertCount, setAlertCount] = useState(0);
    const [messageCount, setMessageCount] = useState(0);
    const [alertMessageCount, setAlertMessageCount] = useState(0);
    const [nonAlertMessageCount, setNonAlertMessageCount] = useState(0);
    const [less, setLess] = useState(0);
    const [more, setMore] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const deviceResponse = await axios.get('/device/all');
            const messageResponse = await axios.get('/message/all');

            const totalDeviceCount = deviceResponse.data.Data.flat().length;
            const totalAlertCount = deviceResponse.data.Data.flat().filter(device => device.alert).length;
            const totalMessageCount = messageResponse.data.Data.flat().length;

            setAlertMessageCount(messageResponse.data.Data.flat().filter(message => message.alert === 1).length);

            // 计算非告警信息量
            setNonAlertMessageCount(messageResponse.data.Data.flat().filter(message => message.alert === 0).length);

            setDeviceCount(totalDeviceCount);
            setAlertCount(totalAlertCount);
            setMessageCount(totalMessageCount);
            const messages = messageResponse.data.Data;

            // 初始统计值
            let countLessThan120 = messages.flat().filter(message => message.lng <= 120).length;
            let countGreaterThan120 = messages.flat().filter(message => message.lng > 120).length;


            // 更新柱状图数据
            setLess(countLessThan120);
            setMore(countGreaterThan120);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const data = [
        { type: 'Alert', value: deviceCount },
        { type: 'Normal', value: deviceCount - alertCount },
    ];

    const pieConfig = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'spider',
            labelHeight: 28,
            content: '{percentage}',
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    };

    const barData = [
        { type: '消息总量', value: messageCount },
        { type: '告警消息量', value: alertMessageCount },
        { type: '非告警消息量', value: nonAlertMessageCount },
    ];

    const barConfig = {
        data: barData,
        xField: 'type',
        yField: 'value',
        legend: { position: 'top-left' },
        padding: 'auto',
        forceFit: true,
    };

    const colData = [
        { type: '经度小于等于120', value: less },
        { type: '经度大于120', value: more },
    ]

    const colConfig = {
        data: colData,
        xField: 'type',
        yField: 'value',
        legend: { position: 'top-left' },
    };

    const flush = () => {
        window.location.reload()
    }

    return (
        <div>
            <Button
                type="primary"
                className="flush-button"
                onClick={flush}
                style={{marginRight:16, float:"right", marginTop:16}}
            >
                刷新页面
            </Button>
            <br></br>
            <div>
                <br></br>
                <h1 align='middle'>设备总量</h1>
                <Pie {...pieConfig} />
                <h1 align='middle'>消息总量</h1>
                <Bar {...barConfig} />
                <h1 align='middle'>分经度信息总量</h1>
                <Column {...colConfig} />
            </div>
        </div>
    );
};

export default Statistics;
