import { Button, Input, Space, Table, Typography} from "antd";
import React, { useEffect, useState } from "react";
import axios from 'axios';

const BankCardList = () => {
    const [dataSource, setDataSource] = useState([]);
    const [cardno, setCardno] = useState("");
    const [password, setPassword] = useState("");
    const [balance, setBalance] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8080/api/module5/getall/BankCard');
            const data = response.data.data.map((bankinfo) => ({
                Card_No: bankinfo.Card_No,
                Password: bankinfo.Password,
                Balance: bankinfo.Balance,
                key: bankinfo.Card_No.toString(),
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
              await axios.get(`http://127.0.0.1:8080/api/module5/drop/BankCard/${rowdata.Card_No}`);
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
            const response = await axios.get(`http://127.0.0.1:8080/api/module5/insert/BankCard/${cardno}/${password}/${balance}`);
            fetchUsers();
        } catch (error) {
            console.error("Error insert ", error);
        }
        console.log('submit');
    };

    const columns = [
        {
            title: '银行卡号',
            dataIndex: 'Card_No',
            key: 'Card_No',
        },
        {
            title: '密码',
            dataIndex: 'Password',
        },
        {
            title: '余额',
            dataIndex: 'Balance',
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
                银行卡号
                <Input
                    placeholder="请输入银行卡号"
                    style={{ width: 200, marginRight: 8 }}
                    value={cardno}
                    onChange={(e) => setCardno(e.target.value)}
                />
                密码
                <Input
                    placeholder="请输入密码"
                    style={{ width: 200, marginRight: 8 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                余额
                <Input
                    placeholder="请输入银行卡余额"
                    style={{ width: 200, marginRight: 8 }}
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
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

export default BankCardList;
