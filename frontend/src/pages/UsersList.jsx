import {Button, Form, Input, InputNumber, message, Popconfirm, Select, Table, Typography} from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";

const UsersList = () => {
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/user/info');
                let count = 1;
                const tmp = response.data.Data.flatMap(innerArray =>
                    innerArray.map((entry, index) => ({
                        Key: (count++).toString(),
                        Time: entry.time,
                        Action: entry.action,
                    }))
                );
                setDataSource(tmp);
            } catch (err) {
                message.error(err.message);
            }
        };

        fetchData();
    }, []);


  const columns = [
    {
      title: '时间',
      dataIndex: 'Time',
      key: 'Time'
    },
    {
      title: '操作',
      dataIndex: 'Action',
      key: 'Action'
    }
  ];


  return (
    <div>
      <Form form={form} component={false}>
        <Table
          dataSource={dataSource}
          columns={columns}
          scroll={{ x: 1000, scrollToFirstRowOnChange: true }}
        />
      </Form>
    </div>
  );
};

export default UsersList;

