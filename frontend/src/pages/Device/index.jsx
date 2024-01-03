import {Button, Form, Input, InputNumber, message, Popconfirm, Modal, Table, Typography} from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AddDeviceForm from "../../components/AddDeviceForm";
import "./index.css";

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

const Device = () => {
    const [dataSource, setDataSource] = useState([]);
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({ Name: '', Type: '', Alert: '', Info: '', Lat: '', Lng: '', Value: '', ...record });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
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
                // console.log(newData);
                // console.log(index);
                // console.log(newData[index]);
                try {
                    await axios.post(`/device/modify`, {
                        name: newData[index].Name,
                        type: newData[index].Type,
                        alert: newData[index].Alert,
                        info: newData[index].Info,
                        lat: newData[index].Lat,
                        lng: newData[index].Lng,
                        value: newData[index].Value,
                        clientId: newData[index].ClientId,
                        timestamp: newData[index].Time,
                    });
                } catch (error) {
                    message.error("Error saving edit:", error);
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

    const handleDelete = async (key, clientId) => {
        try {
            await axios.post(`/device/delete`, {
                clientId: clientId
            });
            const newData = dataSource.filter((item) => item.key !== key);
            setDataSource(newData);
            message.success('删除成功');
            window.location.reload()
        } catch (error) {
            console.error('Error deleting device:', error);
            message.error('删除失败');
        }
    };

    const formRef = React.useRef();

    const [isModalVisible, setModalVisible] = useState(false);

    const showModal = () => {
        setModalVisible(true);
    };

    const handleOk = () => {
        // 在这里调用表单的 submit 方法
        formRef.current.submit();
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const onFinish = (values) => {
        // 在这里处理确认按钮点击后的逻辑
        console.log('确认按钮点击，表单数据：', values);
        try {
            axios.post(`/device/add`, {
                clientId: values.clientId,
                lat: parseFloat(values.lat),
                lng: parseFloat(values.lng),
                name: values.name,
                type: parseInt(values.type),
                value: parseInt(values.value),
            });
            message.success('增加成功');
            window.location.reload()
        } catch (error) {
            console.error('Error deleting device:', error);
            message.error('增加失败');
        }
        setModalVisible(false);
    };

    const flush = () => {
        window.location.reload()
    }



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/device/all');
                let count = 1;
                const tmp = response.data.Data.flatMap(innerArray =>
                    innerArray.map((entry, index) => ({
                        key: (count++).toString(),
                        Name: entry.name,
                        Type: entry.type,
                        Alert: entry.alert,
                        ClientId: entry.clientId,
                        Info: entry.info,
                        Lat: entry.lat,
                        Lng: entry.lng,
                        Time: entry.timestamp,
                        Value: entry.value,
                    }))
                );
                setDataSource(tmp);
                // console.log(tmp)
            } catch (err) {
                message.error(err.message);
            }
        };

        fetchData();
    }, []);


    const columns = [
        {
            title: '设备名',
            dataIndex: 'Name',
            key: 'Name',
            editable: true,
        },
        {
            title: '类型',
            dataIndex: 'Type',
            key: 'Type',
            editable: true,
        },
        {
            title: '报警',
            dataIndex: 'Alert',
            key: 'Alert',
            editable: true,
            render: (text, record) => {
                const alertText = record.Alert === 1 ? <span style={{ color: 'red' }}>1</span> : '0';
                return alertText;
            },
        },
        {
            title: '设备ID',
            dataIndex: 'ClientId',
            key: 'ClientId',
            editable: false,
        },
        {
            title: '信息',
            dataIndex: 'Info',
            key: 'Info',
            editable: true,
        },
        {
            title: '纬度',
            dataIndex: 'Lat',
            key: 'Lat',
            editable: true,
        },
        {
            title: '经度',
            dataIndex: 'Lng',
            key: 'Lng',
            editable: true,
        },
        {
            title: '时间戳',
            dataIndex: 'Time',
            key: 'Time',
            editable: false,
        },
        {
            title: '值',
            dataIndex: 'Value',
            key: 'Value',
            editable: true,
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
        {
            title: '操作',
            dataIndex: 'operation',
            render: (_, record) => (
                <Popconfirm
                    title="确认删除?"
                    onConfirm={() => handleDelete(record.key, record.ClientId)}
                    okText="确认"
                    cancelText="取消"
                >
                    <a>Delete</a>
                </Popconfirm>
            ),
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
                inputType: (col.dataIndex === 'Name' || col.dataIndex === 'Info') ? 'text' : 'number',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });


    return (
        <div>
            <Button
                type="primary"
                className="add-button"
                onClick={showModal}
                style={{marginTop: 16, marginBottom:16}}
            >
                新增设备
            </Button>
            <Button
                type="primary"
                className="flush-button"
                onClick={flush}
                style={{marginBottom:16, float:"right", marginTop:16}}
            >
                刷新页面
            </Button>
            <Modal
                title="新增设备"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <AddDeviceForm formRef={formRef} onFinish={onFinish} />
            </Modal>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={dataSource}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: cancel,
                    }}
                />
            </Form>
        </div>
    );
};

export default Device;

