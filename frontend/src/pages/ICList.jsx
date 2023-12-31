import { Button, Input, Space, Table, Typography} from "antd";
import React, { useEffect, useState } from "react";
import axios from 'axios';

const ICList = () => {
    const [dataSource, setDataSource] = useState([]);
    const [ic, setIc] = useState("");
    const [realName, setRealName] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/api/module5/getall/IC');
            const data = response.data.data.map((icinfo) => ({
                IC: icinfo.IC,
                RealName: icinfo.RealName,
                key: icinfo.IC.toString(),
            }));
            setDataSource(data);
        } catch (error) {
            console.error("Error fetching ", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    
    const del = async (key) => {
        try {
          const newData = [...dataSource];
          const index = newData.findIndex((item) => key === item.key);
          if (index > -1) {
            const rowdata = newData[index];
            try {
              await axios.get(`http://127.0.0.1:8080/api/module5/drop/ICDatabase/${rowdata.IC}`);
            } catch (error) {
              console.error("Error saving edit:", error);
            }
            window.location.reload() 
          }
        } catch (errInfo) {
          console.log('Validate Failed:', errInfo);
        }
    };

    const submit = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8080/api/module5/insert/ICDatabase/${ic}/${realName}`);
            console.log(response);
            fetchUsers();
        } catch (error) {
            console.error("Error insert ", error);
        }
        console.log('submit');
    };

    const columns = [
        {
            title: 'IC卡号',
            dataIndex: 'IC',
            key: 'IC',
        },
        {
            title: '真实姓名',
            dataIndex: 'RealName',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          render: (_, record) => {
            return <Typography.Link onClick={() => del(record.key)} style={{ marginRight: 8 }}>
            删除
          </Typography.Link>
            
          }
        },
    ];

    return (
        <div>
            <Space>
                IC卡号
                <Input
                    placeholder="请输入IC卡号"
                    style={{ width: 200, marginRight: 8 }}
                    value={ic}
                    onChange={(e) => setIc(e.target.value)}
                />
                真实姓名
                <Input
                    placeholder="请输入真实姓名"
                    style={{ width: 200, marginRight: 8 }}
                    value={realName}
                    onChange={(e) => setRealName(e.target.value)}
                />
                <Button
                    type='primary'
                    onClick={submit}
                >
                    提交
                </Button>
            </Space>
            <Table
                dataSource={dataSource}
                columns={columns}
            />
        </div>
    );
};

export default ICList;
