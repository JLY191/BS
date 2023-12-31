import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Divider, Button, Tag, Steps,Empty,Timeline,message } from 'antd';
import { Card } from 'antd';
import {useParams} from "react-router-dom";
function OrderInfo() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const userid=1;
    const [userType,setUserType]=useState(0);
    const { orderId } = useParams();
    const [sellerInfo,setSellerInfo]=useState({
        user_id:0, user_name:"", bank_id:0, is_verify:0
    })
    const [buyerInfo,setBuyerInfo]=useState({
        user_id:0, user_name:"", bank_id:0, is_verify:0
    })
    const [order,setOrder] = useState({
        order_id: 0,
        buyer_id: 0,
        seller_id: 0,
        commodity_id: 0,
        order_state: 6,
        amount: 0,
        refund: 0,
        complaint: 0,
        creation_date: "",
        goods_name: ""
    });
    const [timeRecords,setTimeRecords] = useState([{
        cur_time:"",
        order_state: 0
    }]);

    useEffect(()=>{
        getOrder();
        getTimeRecords();
        //info();
    },[]);
///////通知与非法访问跳转///////
    useEffect(()=>{
        if(order.order_state!==6){
            info();
            getUser();
        }
    },[order]);
    function getUser() {
        if(order.seller_id!==userid&&order.buyer_id!==userid)
            ifto404(null);
        else {
            if (order.seller_id === userid)
                setUserType(1);
            else
                setUserType(0);
            getUserInfo();
        }
    }
    function info(){
        if(order.order_state!==6){
            let state=['下单','待支付','待发货','待收货','已完成','订单已取消','退款中','退款已回复','投诉中','投诉已回复'];
            let color = ["green","cyan","blue","geekblue","green","purple","red","green","red","green"];
            let type1=order.order_state;
            let type2=order.refund;
            let type3=order.complaint;
            message.info(<>
                订单No.{orderId}&emsp;状态更新：
                {type2!=0? <><Tag color={color[5+type2]}>{state[5+type2]}</Tag>&ensp;</>:<></>}
                {type3!=0? <><Tag color={color[7+type3]}>{state[7+type3]}</Tag>&ensp;</>:<></>}
                {type2!=1? <><Tag color={color[1+type1]}>{state[1+type1]}</Tag>&ensp;</>:<></>}
            </>);
        }
    }
    function ifto404(item){
        if(item==null)
            navigate(`../page2`);
    }
///////通知与非法访问跳转///////
//////////////////////////后端接口函数///////////////////////////////////
    const getOrder = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/m2/searchorderbyid/${orderId}`); // 替换为实际的后端接口URL
            const data = await response.json();
            await setOrder(data.data[0]);
            ifto404(data.data[0]);
        } catch (error) {
            console.log('Error', error);
        }
    };
    const getUserInfo = async () =>{
        try {
            const response1 = await fetch(`http://127.0.0.1:8080/m1/searchUserInfo/${order.seller_id}`); // 替换为实际的后端接口URL
            const data1 = await response1.json();
            ifto404(data1.data[0]);
            setSellerInfo(data1.data[0]);
            const response2 = await fetch(`http://127.0.0.1:8080/m1/searchUserInfo/${order.buyer_id}`); // 替换为实际的后端接口URL
            const data2 = await response2.json();
            ifto404(data2.data[0]);
            setBuyerInfo(data2.data[0]);
        } catch (error) {
            console.log('Error', error);
        }
    }
    const getTimeRecords = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/m2/searchtimerecord/${orderId}`); // 替换为实际的后端接口URL
            const data = await response.json();
            setTimeRecords(data.data);
        } catch (error) {
            console.log('Error', error);
        }
    };
    const sendOrder = async (orderId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/m2/sendout/${orderId}`); // 替换为实际的后端接口URL
            const data = await response.json();
            window.location.reload();
        } catch (error) {
            console.log('Error', error);
        }
    };
    const receiveOrder = async (orderId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/m2/receive/${orderId}`); // 替换为实际的后端接口URL
            const data = await response.json();
            money2bank(data.data, sellerInfo.bank_id);
            addpay(data.data);
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
            console.log('Error', error);
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
    function orderStateCard(type1,type2,type3) {

        function cardbutton(type1,type2,type3) {

            if (type1 === 0) {
                if (userType === 0)
                    return (<>
                        <Button type="primary" shape="round"
                                href={`../payment/${orderId}`}>支付订单</Button>&emsp;
                        <Button type="primary" shape="round" danger
                                onClick={() => {offOrder(orderId);}}>取消订单</Button>&emsp;
                        <Button type="primary" shape="round" danger
                                href={`../complaint/${orderId}`}>发起/查看投诉</Button>&emsp;
                    </>);
                else
                    return (<><Button type="primary" shape="round" danger
                                      href={`../complaint/${orderId}`}>查看/处理投诉</Button>&emsp;</>);
            } else if (type1 === 1) {
                if(userType === 0)
                    return (<>
                        <Button type="primary" shape="round" danger href={`../complaint/${orderId}`}>发起/查看投诉</Button>&emsp;
                        <Button type="primary" shape="round" danger href={`../refund/${orderId}`}>发起/查看退款</Button>&emsp;
                    </>)
                else
                    return (<>
                        {type2 === 1 ? <></> : <><Button type="primary" shape="round"
                                                         onClick={()=>{sendOrder(orderId);} }>确认发货</Button>&emsp;</>}
                        <Button type="primary" shape="round" danger href={`../complaint/${orderId}`}>查看/处理投诉</Button>&emsp;
                        <Button type="primary" shape="round" danger href={`../refund/${orderId}`}>查看/处理退款</Button>&emsp;
                    </>);
            } else if (type1 === 2) {
                if(userType === 0)
                    return (<>
                        {type2 === 1 ? <></> : <><Button type="primary" shape="round"
                                                         onClick={()=>{receiveOrder(orderId);} }>确认收货</Button>&emsp;</>}
                        <Button type="primary" shape="round" danger href={`../complaint/${orderId}`}>发起/查看投诉</Button>&emsp;
                        <Button type="primary" shape="round" danger href={`../refund/${orderId}`}>发起/查看退款</Button>&emsp;
                    </>);
                else
                    return (<>
                        <Button type="primary" shape="round" danger href={`../complaint/${orderId}`}>查看/处理投诉</Button>&emsp;
                        <Button type="primary" shape="round" danger href={`../refund/${orderId}`}>查看/处理退款</Button>&emsp;
                    </>);
            } else if (type1 === 3) {
                if(userType === 0)
                    return (<>
                        <Button type="primary" shape="round" danger href={`../complaint/${orderId}`}>发起/查看投诉</Button>&emsp;
                    </>);
                else
                    return (<>
                        <Button type="primary" shape="round" danger href={`../refund/${orderId}`}>查看/处理退款</Button>&emsp;
                    </>);
            } else if (type1 === 4) {
                if(userType === 0)
                    return (<>
                        <Button type="primary" shape="round" danger href={`../complaint/${orderId}`}>发起/查看投诉</Button>&emsp;
                    </>);
                else
                    return (<>
                        <Button type="primary" shape="round" danger href={`../refund/${orderId}`}>查看/处理退款</Button>&emsp;
                    </>);
            } else {
                return (<>
                </>);
            }
        }

        let state=['下单','待支付','待发货','待收货','已完成','订单已取消','退款中','退款已回复','投诉中','投诉已回复'];
        let color = ["green","cyan","blue","geekblue","green","purple","red","green","red","green"];
        let type=type1;
        if(type2===1) type=5;
        let s_status="process";
        if((type2===1)||(type1===4)) s_status = "error";
        if(type1===3) s_status="finish"
        return (
            <Card hoverable
                title={<>订单状态</>}
                extra = {<>
                    {type2!=0? <><Tag color={color[5+type2]}>{state[5+type2]}</Tag>&ensp;</>:<></>}
                    {type3!=0? <><Tag color={color[7+type3]}>{state[7+type3]}</Tag>&ensp;</>:<></>}
                    {type2!=1? <><Tag color={color[1+type1]}>{state[1+type1]}</Tag>&ensp;</>:<></>}</>}
                style={{ marginBottom: 24 }}
            >
                <Steps
                    current={type1===4? 1:type1+1}
                    status ={s_status}
                    items={[
                        {
                            title: '发起订单', //description,
                        },
                        {
                            title: '待支付', //description,
                        },
                        {
                            title: '待发货', //description,//subTitle: 'Left 00:00:08',
                        },
                        {
                            title: '待收货', //description,
                        },
                        {
                            title: '订单完成', //description,
                        },
                    ]}
                />
                <Divider/>
                <div style={{ textAlign: 'center' }}>
                    {cardbutton(type1,type2,type3)}
                </div>
            </Card>
        )
    }
    function orderStep() {
        const steps = [];
        let text= ["创建订单","支付订单","订单发货","订单收货","取消订单","申请退款","退款回复","发起投诉","投诉回复"];

        for (let i = 0; i < timeRecords.length; i++) {
            steps.push(<Timeline.Item>{text[timeRecords[i].order_state]}&emsp;&emsp;{outTime(timeRecords[i].cur_time)}</Timeline.Item>);
        }
        return steps;
    }
    let er_state=['你是买家','你是卖家'];
    let er_color = ["blue","orange"];
    return (
        <>
            {}
            {orderStateCard(order.order_state,order.refund,order.complaint)}
            <Card hoverable title={<>订单信息&emsp;<Tag color={er_color[userType]}>{er_state[userType]}</Tag></>} >
                <p>&emsp;订单单号:&emsp;&emsp;{orderId}</p>
                <p>&emsp;商品信息:&emsp;&emsp;{order.goods_name}</p>
                <p>&emsp;商品总价:&emsp;&emsp;{order.amount}￥</p>
                <p>&emsp;卖家:&emsp;&emsp;&emsp;&emsp;{sellerInfo.user_name}</p>
                <p>&emsp;买家:&emsp;&emsp;&emsp;&emsp;{buyerInfo.user_name}</p>
                <p>&emsp;下单时间:&emsp;&emsp;{outTime(order.creation_date)}</p>
            </Card>
            <br />
            <Card hoverable title="交易流程" >
                <Timeline>
                    {orderStep()}
                </Timeline>
            </Card>
        </>
    )
}

export default OrderInfo;
