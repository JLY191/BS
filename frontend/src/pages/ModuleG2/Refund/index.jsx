import React, {useEffect, useState} from 'react';
import {Divider, Button, Tag, Steps, Empty, Timeline, Input, InputNumber, Select, message} from 'antd';
import { Card } from 'antd';
import {useNavigate, useParams} from "react-router-dom";
const { Step } = Steps;
const { TextArea } = Input;

export default function Refund() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const user = JSON.parse(sessionStorage.user);
    const userid= user.user_id;
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
    const [refund,setRefund] = useState({
        refund_id:0,
        order_id:0,
        amount:0,
        refund_reason:"",
        refund_response:"",
        creation_date:""
    });

    const [refundNum,setRefundNum] = useState(0);
    const [refundText,setRefundText] = useState("空");
    const [refundReplay,setRefundReplay] = useState(0);

    useEffect(()=>{
        getOrder();
        getRefund();
    },[]);
///////通知与非法访问跳转///////
    useEffect(()=>{
        if(order.order_state!==6) {
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
            navigate(`../page404`);
    }
///////通知与非法访问跳转///////
//////////////////////////后端接口函数///////////////////////////////////

    const getRefund = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/m2/viewrefound/${orderId}`); // 替换为实际的后端接口URL
            const data = await response.json();
            setRefund(data.data[0]);
            //setOrderNum(orderDate.length);
        } catch (error) {
            console.log('Error getRefund:', error);
        }
    };
    const getOrder = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/m2/searchorderbyid/${orderId}`); // 替换为实际的后端接口URL
            const data = await response.json();
            setOrder(data.data[0]);
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
    const addRefund = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/m2/addRefund/${orderId}/${refundNum}/${refundText}`); // 替换为实际的后端接口URL
            const data = await response.json();
            window.location.reload();
        } catch (error) {
            console.log('Error', error);
        }
    };
    const respondRefund = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/m2/answerRefund/${orderId}/${refundReplay}/${refundText}/${refund.amount}`); // 替换为实际的后端接口URL
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
    function cardNewRefund() {
        return (
            <Card hoverable title="申请退款" >
                <h4>退款金额：</h4>
                <InputNumber prefix="￥" max={order.amount} controls={false} suffix="RMB" style={{ width: 200 }}
                             onChange={(value)=>{
                                if(value===null)
                                    setRefundNum(order.amount);
                                else
                                    setRefundNum(value);
                             }}/>
                <br/><br/>
                <h4>退款理由：</h4>
                <TextArea showCount rows={4} placeholder="请输入退款理由" maxLength={400} onChange={(value)=>{
                    if(value.target.value.length===0)
                        setRefundText('空');
                    else
                        setRefundText(value.target.value);
                }}/>
                <br/>
                <div style={{ textAlign: 'center' }}>
                    <Button type="primary" shape={"round"} size='large' onClick={()=>{
                        addRefund();
                    }}>申请退款</Button>
                </div>
            </Card>
        )
    }
    function cardShowRefund() {
        return (
            <Card hoverable title="已申请的退款" >
                <h4>退款金额：</h4>
                <p>{refund.amount}￥</p>
                <br/>
                <h4>退款理由：</h4>
                <p>{refund.refund_reason}</p>
            </Card>
        )
    }
    function cardReplyRefund() {
        return (
            <Card hoverable title="处理退款" >
                <h4>退款处理：</h4>
                <Select
                    defaultValue={0}
                    style={{ width: 200 }}
                    options={[
                        { value: 0, label: '接受退款' },
                        { value: 1, label: '拒绝退款' },
                    ]}
                    onChange={(value)=>{setRefundReplay(value)}}
                />
                <br/><br/>
                <h4>答复理由：</h4>
                <TextArea showCount rows={4} placeholder="请输入接受/拒绝退款理由" maxLength={400} onChange={(value)=>{
                    if(value.target.value.length===0)
                        setRefundText('空');
                    else
                        setRefundText(value.target.value);
                }}/>
                <br/>
                <div style={{ textAlign: 'center' }}>
                    <Button type="primary" shape={"round"} size='large' onClick={()=>{
                        if(refundReplay===0)
                           money2bank(refund.amount,buyerInfo.bank_id);
                        respondRefund();
                    }}>处理退款</Button>
                </div>
            </Card>
        )
    }

    function cardShowRefundReply() {
        const text=["接受退款","拒绝退款"]
        return (
            <Card hoverable title="退款结果" >
                <h4>退款结果：</h4>
                <p>{text[0]}</p>
                <br/>
                <h4>退款处理理由：</h4>
                <p>{refund.refund_response}</p>
            </Card>
        )
    }
    function refundCard(type) {
        if(type===0) {
            if(userType===1)
                return (<></>)
            else
                return (<>{cardNewRefund()}</>)
        }else if(type===1) {
            if(userType===1)
                return (<>{cardShowRefund()}<br/>{cardReplyRefund()}</>)
            else
                return (<>{cardShowRefund()}</>)
        }else{
            return (<>{cardShowRefund()}<br/>{cardShowRefundReply()}</>)
        }
    }
    let state= ['无退款记录','退款待回复','退款已处理'];
    let color= ["green","red","blue"];
    let er_state=['你是买家','你是卖家'];
    let er_color = ["blue","orange"];
    return (
        <>
            <Card hoverable
                  extra = {<Tag color={color[order.refund]} >{state[order.refund]}</Tag>}
                  title={<>订单信息&emsp;<Tag color={er_color[userType]}>{er_state[userType]}</Tag></>} >
                <p>&emsp;订单单号:&emsp;&emsp;{orderId}</p>
                <p>&emsp;商品信息:&emsp;&emsp;{order.goods_name}</p>
                <p>&emsp;商品总价:&emsp;&emsp;{order.amount}￥</p>
                <p>&emsp;卖家:&emsp;&emsp;&emsp;&emsp;{sellerInfo.user_name}</p>
                <p>&emsp;买家:&emsp;&emsp;&emsp;&emsp;{buyerInfo.user_name}</p>
                <p>&emsp;下单时间:&emsp;&emsp;{outTime(order.creation_date)}</p>
            </Card>
            <br />
            {refundCard(order.refund)}
            <Divider>{}</Divider>
        </>
    )
}