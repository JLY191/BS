import { Button, Form, Input, InputNumber, Popconfirm, Select, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";

const statusEnum = {
  0: {
    text: '否',
    status: 'Default'
  },
  1: {
    text: '是',
    status: 'Success'
  },
};

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const UsersList = () => {
  const [dataSource, setDataSource] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [filterValue, setFilterValue] = useState(null);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ isVip: '', isBlacklist: '', isInspector: '', isAdministrator: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      let url = "http://127.0.0.1:8080/api/module5/users";
      if (filterType === "VIP") {
        url = "http://127.0.0.1:8080/api/module5/vips";
      } else if (filterType === "Businessmen") {
        url = "http://127.0.0.1:8080/api/module5/Businessmen";
      }  else if (filterType === "Blacklist") {
        url = "http://127.0.0.1:8080/api/module5/blacklists";
      } else if (filterType === "Inspector") {
        url = "http://127.0.0.1:8080/api/module5/inspector";
      } else if (filterType === "Administrator") {
        url = "http://127.0.0.1:8080/api/module5/adminstrator";
      } else if (filterType === "ID" && filterValue) {
        url = `http://127.0.0.1:8080/api/module5/users/id/${filterValue}`;
      } else if (filterType === "Username" && filterValue) {
        url = `http://127.0.0.1:8080/api/module5/users/name/${filterValue}`;
      }

      const response = await axios.get(url);
      const data = response.data.data.map((user) => ({
        Account_ID: user.user_id,
        Account_Name: user.user_name,
        IC: user.IC,
        Password: user.pwd,
        Real_Name: user.Real_Name,
        isBusinessmen: user.is_businessmen,
        work_for: user.work_for,
        isVIP: user.is_VIP,
        total_pay: user.total_pay,
        isBlacklist: user.is_blacklist,
        isInspector: user.is_inspector,
        isAdministrator: user.is_administrator,
        key: user.user_id.toString(),
      }));
      setDataSource(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDataSource(newData);
        setEditingKey('');
        const rowdata = newData[index];
        try {
          await axios.get(`http://127.0.0.1:8080/api/module5/users/update/${rowdata.Account_ID}/${rowdata.isVIP}/${rowdata.isBusinessmen}/${rowdata.isBlacklist}/${rowdata.isInspector}/${rowdata.isAdministrator}`);
        } catch (error) {
          console.error("Error saving edit:", error);
        }
        window.location.reload()
      } else {
        newData.push(row);
        setDataSource(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleFilterChange = (value) => {
    setFilterType(value);
  };

  const handleFilterSubmit = () => {
    fetchUsers();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'Account_ID',
      key: 'Account_ID',
      editable: false,
    },
    {
      title: '用户名',
      dataIndex: 'Account_Name',
      editable: false,
    },
    {
      title: '密码',
      dataIndex: 'Password',
      editable: false,
    },
    {
      title: '已使用金额',
      dataIndex: 'total_pay',
      editable: false,
    },
    {
      title: '身份卡号',
      dataIndex: 'IC',
      editable: false,
    },
    {
      title: '真实姓名',
      dataIndex: 'Real_Name',
      editable: false,
    },
    {
      title: '所属',
      dataIndex: 'work_for',
      editable: false,
    },
    {
      title: 'VIP',
      dataIndex: 'isVIP',
      editable: true,
      render: (text) => {
        const statusConfig = statusEnum[text ? 1 : 0];
        return (
          <span className={`status-${statusConfig.status}`}>
            {statusConfig.text}
          </span>
        );
      },
    },
    {
      title: '卖家',
      dataIndex: 'isBusinessmen',
      editable: true,
      render: (text) => {
        const statusConfig = statusEnum[text ? 1 : 0];
        return (
          <span className={`status-${statusConfig.status}`}>
            {statusConfig.text}
          </span>
        );
      },
    },
    {
      title: '黑名单',
      dataIndex: 'isBlacklist',
      editable: true,
      render: (text) => {
        const statusConfig = statusEnum[text ? 1 : 0];
        return (
          <span className={`status-${statusConfig.status}`}>
            {statusConfig.text}
          </span>
        );
      },
    },
    {
      title: '审查员',
      dataIndex: 'isInspector',
      editable: true,
      render: (text) => {
        const statusConfig = statusEnum[text ? 1 : 0];
        return (
          <span className={`status-${statusConfig.status}`}>
            {statusConfig.text}
          </span>
        );
      },
    },
    {
      title: '管理员',
      dataIndex: 'isAdministrator',
      editable: true,
      render: (text) => {
        const statusConfig = statusEnum[text ? 1 : 0];
        return (
          <span className={`status-${statusConfig.status}`}>
            {statusConfig.text}
          </span>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div>
      <Select
        placeholder="Select filter type"
        style={{ width: 200, marginBottom: 16 }}
        onChange={handleFilterChange}
        value={filterType}
      >
        <Select.Option value="All">全部</Select.Option>
        <Select.Option value="VIP">VIP</Select.Option>
        <Select.Option value="Businessmen">卖家</Select.Option>
        <Select.Option value="Blacklist">黑名单</Select.Option>
        <Select.Option value="Inspector">审查员</Select.Option>
        <Select.Option value="Administrator">管理员</Select.Option>
        <Select.Option value="ID">ID</Select.Option>
        <Select.Option value="Username">用户名</Select.Option>
      </Select>
      {filterType === "ID" || filterType === "Username" ? (
        <Input
          placeholder="请输入筛选数值"
          style={{ width: 200, marginRight: 8 }}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
      ) : null}
      <Button type="primary" onClick={handleFilterSubmit}>
        筛选
      </Button>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={dataSource}
          columns={mergedColumns}
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </div>
  );
};

export default UsersList;

