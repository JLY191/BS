import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { Input, Checkbox,Space,Divider,Button,Tag,Table,Pagination,Radio,message,Typography} from 'antd';
import { Card } from 'antd';
const { Title, Paragraph, Text, Link } = Typography;
function OrderList() {
    const user = JSON.parse(sessionStorage.user);
    const navigate = useNavigate();
    const userid=user.user_id;
    const [pageId,setPageId] = useState(1);
    const [orderDate,setOrderDate] = useState([]);
    const [searchInfo,setSearchInfo] = useState("*");
    const [searchOrderState,setSearchOrderState] = useState([0]);
    const [searchTime,setSearchTime] = useState(0);
    const [orderNum,setOrderNum] = useState(0);

    const jump2info = (orderId)=>{
        navigate(`/orderinfo/${orderId}`);
    }

    useEffect(()=>{
        searchOrder();
    },[]);
    useEffect(()=>{
        searchOrder();
    },[searchTime,searchOrderState]);
//////////////////////////后端接口函数///////////////////////////////////
    const searchOrder = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/m2/searchorder/${userid}/${searchInfo}/${searchOrderState}/${searchTime}`); // 替换为实际的后端接口URL
            const data = await response.json();
            console.log(`http://127.0.0.1:8080/m2/searchorder/${1}/${searchInfo}/${searchOrderState}/${searchTime}`);
            setOrderNum(data.data.length);
            setOrderDate(data.data);
        } catch (error) {
            console.log('Error fetching number:', error);
        }
    };
    const sendOrder = async (orderId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/m2/sendout/${orderId}`); // 替换为实际的后端接口URL
            const data = await response.json();
            window.location.reload();
        } catch (error) {
            console.log('Error fetching number:', error);
        }
    };
    const receiveOrder = async (order_) => {
        try {
            const response1 = await fetch(`http://127.0.0.1:8080/m2/receive/${order_.order_id}`); // 替换为实际的后端接口URL
            const data1 = await response1.json();
            const response2 = await fetch(`http://127.0.0.1:8080/m1/searchUserInfo/${order_.seller_id}`) // 替换为实际的后端接口URL
            const data2 = await response2.json();
            console.log('A');
            console.log(data1.data);
            console.log(data2.data[0].bank_id);
            money2bank(data1.data, data2.data[0].bank_id);
            addpay(data1.data);
            window.location.reload();
        } catch (error) {
            console.log('Error', error);
        }
    };

    const addpay = async (amount) => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/m2/addpay/${userid}/${amount}`); // 替换为实际的后端接口URL
            //console.log(`http://127.0.0.1:8080/m2/addpay/${userid}/${amount}`);
            const data = await response.json();
        } catch (error) {
            console.log('Error', error);
        }
    }

    const offOrder = async (orderId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/m2/cancelorder/${orderId}`); // 替换为实际的后端接口URL
            const data = await response.json();
            window.location.reload();
        } catch (error) {
            console.log('Error fetching number:', error);
        }
    };
    const money2bank = async (money,bankId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/module5/verify/recharge/${bankId}/${money}`);
            const data = await response.json();
        } catch (error) {
            console.log('Error', error);
        }
    };
//////////////////////////后端接口函数///////////////////////////////////
    function outTime(time) {
        let d = new Date(time);
        var times=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        return times;
    }
    function orderitem(order_) {
        let state=['下单','待支付','待发货','待收货','已完成','订单已取消','退款中','退款已回复','投诉中','投诉已回复'];
        let color = ["green","cyan","blue","geekblue","green","purple","red","green","red","green"];
        //const order_=orderDate[orderId];
        function cardextra(type1,type2,type3,orderId) {
            let type=type1;
            if(type2==1) type=4;
            return (
                <>
                    {type2!=0? <><Tag color={color[5+type2]}>{state[5+type2]}</Tag>&ensp;</>:<></>}
                    {type3!=0? <><Tag color={color[7+type3]}>{state[7+type3]}</Tag>&ensp;</>:<></>}
                    {type2!=1? <><Tag color={color[1+type1]}>{state[1+type1]}</Tag>&ensp;</>:<></>}
                    <Button size="small"
                            type="primary"
                            shape="round"
                            href={`orderinfo/${orderId}`}
                            >查看详情</Button>
                </>
            )
        }

        function cardbutton(type1,type2,type3,orderId) {
            let userType = order_.seller_id===userid? 1:0;
            if (type1 === 0) {
                if (userType === 0)
                    return (<>
                        <Button type="primary" size='small' shape="round"
                                href={`payment/${orderId}`}>支付订单</Button>&emsp;
                        <Button type="primary" size='small' shape="round" danger
                                onClick={() => {offOrder(orderId);}}>取消订单</Button>&emsp;
                        <Button type="primary" size='small' shape="round" danger
                                href={`complaint/${orderId}`}>发起/查看投诉</Button>&emsp;
                    </>);
                else
                    return (<><Button type="primary" size='small' shape="round" danger
                                      href={`complaint/${orderId}`}>查看/处理投诉</Button>&emsp;</>);
            } else if (type1 === 1) {
                if(userType === 0)
                    return (<>
                        <Button type="primary" size='small' shape="round" danger href={`complaint/${orderId}`}>发起/查看投诉</Button>&emsp;
                        <Button type="primary" size='small' shape="round" danger href={`refund/${orderId}`}>发起/查看退款</Button>&emsp;
                    </>)
                else
                    return (<>
                        {type2 === 1 ? <></> : <><Button type="primary" size='small' shape="round"
                                                     onClick={()=>{sendOrder(orderId);} }>确认发货</Button>&emsp;</>}
                        <Button type="primary" size='small' shape="round" danger href={`complaint/${orderId}`}>查看/处理投诉</Button>&emsp;
                        <Button type="primary" size='small' shape="round" danger href={`refund/${orderId}`}>查看/处理退款</Button>&emsp;
                    </>);
            } else if (type1 === 2) {
                if(userType === 0)
                    return (<>
                        {type2 === 1 ? <></> : <><Button type="primary" size='small' shape="round"
                                                     onClick={()=>{receiveOrder(order_);} }>确认收货</Button>&emsp;</>}
                        <Button type="primary" size='small' shape="round" danger href={`complaint/${orderId}`}>发起/查看投诉</Button>&emsp;
                        <Button type="primary" size='small' shape="round" danger href={`refund/${orderId}`}>发起/查看退款</Button>&emsp;
                    </>);
                else
                    return (<>
                        <Button type="primary" size='small' shape="round" danger href={`complaint/${orderId}`}>查看/处理投诉</Button>&emsp;
                        <Button type="primary" size='small' shape="round" danger href={`refund/${orderId}`}>查看/处理退款</Button>&emsp;
                    </>);
            } else if (type1 === 3) {
                if(userType === 0)
                    return (<>
                        <Button type="primary" size='small' shape="round" danger href={`complaint/${orderId}`}>发起/查看投诉</Button>&emsp;
                    </>);
                else
                    return (<>
                        <Button type="primary" size='small' shape="round" danger href={`refund/${orderId}`}>查看/处理退款</Button>&emsp;
                    </>);
            } else if (type1 === 4) {
                if(userType === 0)
                    return (<>
                        <Button type="primary" size='small' shape="round" danger href={`complaint/${orderId}`}>发起/查看投诉</Button>&emsp;
                    </>);
                else
                    return (<>
                        <Button type="primary" size='small' shape="round" danger href={`refund/${orderId}`}>查看/处理退款</Button>&emsp;
                    </>);
            } else {
                return (<>
                </>);
            }
        }
        let text1=order_.goods_name;
        let text2=order_.creation_date;
        let text2sub1=text2.slice(0,10);
        let text2sub2=text2.slice(11,19);
        let text3=order_.amount;
        let userType=order_.buyer_id===userid? 0:1;
        let er_state=['买','卖'];
        let er_color = ["blue","orange"];
        return (
            <>
                <Card hoverable
                      title={<>订单单号：{order_.order_id}&emsp;<Tag color={er_color[userType]}>{er_state[userType]}</Tag></>}
                      extra={cardextra(order_.order_state,order_.refund,order_.complaint,order_.order_id)}
                >
                    <Table
                        pagination={false}
                        size='small'
                        rowKey='1'
                        columns={[
                            {
                                title: '商品信息',
                                dataIndex: '1',
                                key: '1',
                            },
                            {
                                title: '下单时间',
                                dataIndex: '2',
                                key: '2',
                            },
                            {
                                title: '商品总价',
                                dataIndex: '3',
                                key: '3',
                            },
                        ]}
                        dataSource={[
                            {
                                1: `${text1}`,
                                2: `${outTime(order_.creation_date)}`,
                                3: `${text3}￥`,
                            },
                        ]}
                    />
                    <br/>
                    <div style={{textAlign: 'right'}}>
                        {cardbutton(order_.order_state,order_.refund,order_.complaint,order_.order_id)}
                    </div>
                </Card>
                <Divider/>
            </>
        )
    }
    function getOrders() {
        let start=(pageId-1)*10;
        let end = start+10;
        if(end>orderNum) end=orderNum;
        const orders = [];

        for (let i = start; i < end; i++) {
            //orders.push(order(i));
            orders.push(orderitem(orderDate[i]));
        }
        return orders;
    }

    return (
        <>
            <Card hoverable>
                <br/>
                <div style={{textAlign: 'center'}}>
                    <Input.Search
                        placeholder="请输入订单信息"
                        enterButton="搜索"
                        size="large"
                        style={{maxWidth: 800, width: '60%'}}
                        onChange={(value)=>{
                            if(value.target.value.length===0)
                                setSearchInfo('*');
                            else
                                setSearchInfo(value.target.value);
                            }}
                        onSearch={()=>{searchOrder()}}
                    />
                </div>
                <br/>
                <br/>
                <Divider>{}</Divider>
                <div style={{textAlign: 'left'}}>
                    <Checkbox.Group style={{width: '100%'}} defaultValue={[0]} onChange={(state)=>{if(state.length!==0) setSearchOrderState(state); else setSearchOrderState([0]);}}>
                        <Space size={[0, 16]} wrap>
                        <Space size={[16, 16]} wrap>
                            <Text strong>订单状态：</Text>
                            <Space size={[24, 16]} wrap>
                                <Checkbox value={0}>不限&emsp;&emsp;</Checkbox>
                                <Checkbox value={1}>待支付&emsp;</Checkbox>
                                <Checkbox value={2}>待发货&emsp;</Checkbox>
                                <Checkbox value={3}>待收货&emsp;</Checkbox>
                                <Checkbox value={4}>已完成&emsp;</Checkbox>

                            </Space>
                        </Space>
                        &emsp;
                        <Space size={[24, 16]} wrap ><Text strong>退款投诉状态：</Text>
                            <Checkbox value={5}>退款中&emsp;</Checkbox>
                            <Checkbox value={6}>投诉中&emsp;</Checkbox>
                        </Space>
                        </Space>
                    </Checkbox.Group></div>
                <br/>
                <div style={{textAlign: 'left'}}>
                    <Radio.Group style={{width: '100%'}} defaultValue={0} onChange={(value)=>{setSearchTime(value.target.value);}}>
                        <Space size={[16, 16]} wrap>
                            <Text strong>订单时间：</Text>
                            <Radio value={0}>不限&emsp;&emsp;</Radio>
                            <Radio value={1}>今天&emsp;&emsp;</Radio>
                            <Radio value={2}>七天内&emsp;</Radio>
                            <Radio value={3}>一个月内</Radio>
                            <Radio value={4}>三个月内</Radio>
                            <Radio value={5}>今年&emsp;&emsp;</Radio>
                            <Radio value={6}>三年内&emsp;</Radio>
                        </Space>
                    </Radio.Group></div>
            </Card>
            <br/><br/><br/>
            <div>{getOrders()}</div>
            <br/>
            <Pagination style={{textAlign: 'center'}} defaultCurrent={1} total={orderNum} showSizeChanger={false} onChange={(page,pageSize)=>{setPageId(page)}}/>
        </>
    )
}

export default OrderList;
