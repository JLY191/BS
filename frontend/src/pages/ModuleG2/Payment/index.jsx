import React, {useEffect, useState} from 'react';
import {Divider, Button, Tag, Steps, Empty, Timeline, Input, InputNumber, message} from 'antd';
import { Card } from 'antd';
import {EyeInvisibleOutlined, EyeTwoTone} from "@ant-design/icons";
import {useNavigate, useParams} from "react-router-dom";
const { Step } = Steps;
//import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
const { TextArea } = Input;
function Payment() {
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
    const [passwd,setPasswd] = useState("*");

    useEffect(()=>{
        getOrder();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
///////通知与非法访问跳转///////
    useEffect(()=>{
        if(order.order_state!==6) {
            info();
            getUser();
        }
    },[order]);
    function getUser() {
        if(order.buyer_id!==userid)
            ifto404(null);
        else {
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
    const VerifyAndPay = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/module5/verify/pay/${buyerInfo.bank_id}/${passwd}/${order.amount}`); // 替换为实际的后端接口URL
            const data = await response.json();
            if(data.status===0) {
                addPayment();
                window.location.reload();
            } else if(data.status===3) {
                message.error("余额不足！");
            } else {
                message.error("密码错误！");
            }
        } catch (error) {
            console.log('Error', error);
        }
    };
    const addPayment = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/m2/payment/${orderId}/${passwd}/${order.amount}`); // 替换为实际的后端接口URL
            const data = await response.json();
            window.location.reload();
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
    function try2pay () {
        if(buyerInfo.is_verify || order.amount<=100) {
            VerifyAndPay();
            //addPayment();
        }
        else {
            message.error("未进行身份验证的用户不可进行大额交易。请前往个人中心进行身份验证。")
        }
    }
    let able = order.order_state===0;
    let state= ['待支付','已支付'];
    let color= ["green","blue"];
    let er_state=['买','卖'];
    let er_color = ["blue","orange"];
    return (
        <>
            <Card hoverable
                  title={<>订单信息&emsp;<Tag color={er_color[0]}>{er_state[0]}</Tag></>}
                  extra = {<Tag color={color[order.order_state===0? 0:1]} >{state[order.order_state===0? 0:1]}</Tag>}
            >
                <p>&emsp;订单单号:&emsp;&emsp;{orderId}</p>
                <p>&emsp;商品信息:&emsp;&emsp;{order.goods_name}</p>
                <p>&emsp;商品总价:&emsp;&emsp;{order.amount}￥</p>
                <p>&emsp;卖家:&emsp;&emsp;&emsp;&emsp;{sellerInfo.user_name}</p>
                <p>&emsp;买家:&emsp;&emsp;&emsp;&emsp;{buyerInfo.user_name}</p>
                <p>&emsp;下单时间:&emsp;&emsp;{outTime(order.creation_date)}</p>
            </Card>
            <br />
            <Card hoverable title="支付订单" >
                <h4>应付金额：</h4>
                <p style = {{textAlign: 'right', fontSize: 30,fontWeight: 'bold',color: 'orange'}}>{order.amount}￥</p>
                <Divider/>
                <div style={{textAlign: 'center'}}>
                    <h3>输入支付密码</h3>
                    <br/>
                    <Input.Password
                        style={{ textAlign: 'center', width: 200 }}
                        onChange={(value)=>{
                            if(value.target.value.length===0)
                                setPasswd('*');
                            else
                                setPasswd(value.target.value);
                        }}
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        placeholder="input password"
                    />
                </div>
                <br/><br/>
                <div style={{ textAlign: 'center'}}><Button type="primary" shape={"round"} size='large' disabled={order.order_state===0? false:true} onClick={()=>{try2pay()}}>确认支付</Button></div>
            </Card>
        </>
    )
};
export default Payment;
