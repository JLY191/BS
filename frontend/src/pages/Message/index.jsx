import { Button, Form, Input, Select, Table} from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Message = () => {
    const [dataSource, setDataSource] = useState([]);
    const [filterType, setFilterType] = useState("All");
    const [filterValue, setFilterValue] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchMessage();
    }, []);

    const flush = () => {
        window.location.reload()
    }

    const fetchMessage = async () => {
        try {
            const response = await axios.get('/message/all');
            let count = 1;
            const tmp = response.data.Data.flatMap(innerArray =>
                innerArray.map((entry, index) => ({
                    key: (count++).toString(),
                    Alert: entry.alert,
                    ClientId: entry.clientId,
                    Info: entry.info,
                    Lat: entry.lat,
                    Lng: entry.lng,
                    Time: entry.timestamp,
                    Value: entry.value,
                }))
            );
            const filteredData = tmp.filter(entry => {
                if (filterType === "All") {
                    return true; // 不进行任何筛选
                } else if (filterType === "ClientId") {
                    return entry.ClientId.toString() === filterValue.toString();
                } else if (filterType === "Value") {
                    return entry.Value.toString() === filterValue.toString();
                } else if (filterType === "Alert") {
                    // 如果 filterValue 是 "1" 或 "0" 则转换为整数进行匹配
                    const filterValueInt = parseInt(filterValue, 10);
                    return entry.Alert === filterValueInt;
                }
                return true; // 默认返回 true，即不进行任何筛选
            });
            setDataSource(filteredData);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };


    const handleFilterChange = (value) => {
        setFilterType(value);
    };

    const handleFilterSubmit = () => {
        fetchMessage();
    };

    const columns = [
        {
            title: '设备ID',
            dataIndex: 'ClientId',
            key: 'ClientId',
        },
        {
            title: '报警',
            dataIndex: 'Alert',
            key: 'Alert',
            render: (text, record) => {
                const alertText = record.Alert === 1 ? <span style={{ color: 'red' }}>1</span> : '0';
                return alertText;
            },
        },
        {
            title: '信息',
            dataIndex: 'Info',
            key: 'Info',
        },
        {
            title: '纬度',
            dataIndex: 'Lat',
            key: 'Lat',
        },
        {
            title: '经度',
            dataIndex: 'Lng',
            key: 'Lng',
        },
        {
            title: '时间戳',
            dataIndex: 'Time',
            key: 'Time',
        },
        {
            title: '值',
            dataIndex: 'Value',
            key: 'Value',
        },
    ];

    const mergedColumns = columns.map((col) => {
        return col;
    });

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
            <Select
                placeholder="Select filter type"
                style={{ width: 200, marginBottom: 16, marginTop:16 }}
                onChange={handleFilterChange}
                value={filterType}
            >
                <Select.Option value="All">全部</Select.Option>
                <Select.Option value="ClientId">设备ID</Select.Option>
                <Select.Option value="Alert">报警信息</Select.Option>
                <Select.Option value="Value">值</Select.Option>
            </Select>
                <Input
                    placeholder="请输入筛选数值"
                    style={{ width: 200, marginRight: 8 }}
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                />
            <Button type="primary" onClick={handleFilterSubmit}>
                筛选
            </Button>
            <Form form={form} component={false}>
                <Table
                    dataSource={dataSource}
                    columns={mergedColumns}
                />
            </Form>
        </div>
    );
};

export default Message;

