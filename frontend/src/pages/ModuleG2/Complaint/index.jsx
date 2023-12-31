import React, {useEffect, useState} from 'react';
import {Divider, Button, Tag, Steps, Empty, Timeline, Input, Select, message} from 'antd';
import { Card } from 'antd';
import {useNavigate, useParams} from "react-router-dom";
const { Step } = Steps;
const { TextArea } = Input;
function Complaint() {
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
    const [complaint,setComplaint] = useState({
        complain_id:"0",
        order_id:"0",
        type:"0",
        complain_reason:"",
        complain_response:"",
        creation_date: "",
    });

    const [comText,setComText] = useState("");
    const [comType,setComType] = useState(0);

    useEffect(()=>{
        getOrder();
        getComplaint();
    },[]);
///////通知与非法访问跳转///////
    useEffect(()=>{
        if(order.order_state!==6) {
            info();
            getUser();
        }
    },[order]);
    function getUser() {
        if (order.seller_id !== userid && order.buyer_id !== userid)
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
    const getComplaint = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/m2/searchcomplaint/${orderId}`); // 替换为实际的后端接口URL
            const data = await response.json();
            //console.log(`http://127.0.0.1:8080/m2/searchcomplaint/${orderId}`);
            setComplaint(data.data[0]);
            //setOrderNum(orderDate.length);
        } catch (error) {
            console.log('Error', error);
        }
    };
    const getOrder = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/m2/searchorderbyid/${orderId}`); // 替换为实际的后端接口URL
            const data = await response.json();
            //console.log(`http://127.0.0.1:8080/m2/searchorder/${1}/${orderId}/${[0]}/${0}`);
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
    const addComplain = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/m2/addComplaint/${orderId}/${comType}/${comText}`); // 替换为实际的后端接口URL
            const data = await response.json();
            window.location.reload();
        } catch (error) {
            console.log('Error', error);
        }
    };

    const respondComplaint = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/m2/respondComplaint/${orderId}/${comText}`); // 替换为实际的后端接口URL
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
    function newComplaintCard() {
        return (
            <Card hoverable bordered={false} title="发起投诉" >
                <h4>投诉类型：</h4>
                <Select
                    defaultValue="1"
                    style={{ width: 200 }}
                    options={[
                        { value: '1', label: '服务态度恶劣' },
                        { value: '2', label: '欺诈个人财产' },
                        { value: '3', label: '发货问题' },
                        { value: '4', label: '退款问题' },
                        { value: '5', label: '产品质量问题' },
                    ]}
                    onChange={(value)=>{setComType(value)}}
                />
                <br/>
                <h4>投诉理由：</h4>
                <TextArea showCount rows={4} maxLength={400}  onChange={(value)=>{
                    if(value.target.value.length===0)
                        setComText('空');
                    else
                        setComText(value.target.value);
                }}/>
                <br/>
                <div style={{ textAlign: 'center' }}><Button shape={"round"} type="primary" size='large' onClick={()=>{addComplain()}}>发起投诉</Button></div>
            </Card>
        )
    }
    function showComplaintCard() {
        const text=["服务态度恶劣","欺诈个人财产","发货问题","退款问题","产品质量问题"];
        return (
            <Card hoverable title="已发起的投诉" >
                <h4>投诉类型：</h4>
                <p>{text[complaint.type-1]}</p>
                <br/>
                <h4>投诉理由：</h4>
                <p>{complaint.complain_reason}</p>
            </Card>
        )
    }
    function replayComplaintCard() {
        return (
            <Card hoverable title="处理投诉" >
                <h4>回复投诉：</h4>
                <TextArea showCount rows={4} maxLength={400}  onChange={(value)=>{
                    if(value.target.value.length===0)
                        setComText('空');
                    else
                        setComText(value.target.value);
                }}/>
                <br/>
                <div style={{ textAlign: 'center' }}><Button shape={"round"} type="primary" size='large' onClick={()=>{respondComplaint()}}>回复投诉</Button></div>
            </Card>
        )
    }
    function showReplayComplaintCard() {
        return (
            <Card hoverable title="投诉回复" >
                <h4>回复内容：</h4>
                <p>{complaint.complain_response}</p>
            </Card>
        )
    }
    function complaintCard(type) {
        if(type===0) {
            if(userType===1)
                return (<></>)
            else
                return (<>{newComplaintCard()}</>)
        }else if(type===1) {
            if(userType===1)
                return (<>{showComplaintCard()}<br/>{replayComplaintCard()}</>)
            else
                return (<>{showComplaintCard()}</>)
        }else{
            return (<>{showComplaintCard()}<br/>{showReplayComplaintCard()}</>)
        }
    }
    let state= ['无投诉记录','投诉待回复','投诉已回复'];
    let color= ["green","red","blue"];
    let er_state=['你是买家','你是卖家'];
    let er_color = ["blue","orange"];
    return (
        <>
            <Card hoverable
                  extra = {<Tag color={color[order.complaint]} >{state[order.complaint]}</Tag>}
                  title={<>订单信息&emsp;<Tag color={er_color[userType]}>{er_state[userType]}</Tag></>} >
                <p>&emsp;订单单号:&emsp;&emsp;{orderId}</p>
                <p>&emsp;商品信息:&emsp;&emsp;{order.goods_name}</p>
                <p>&emsp;商品总价:&emsp;&emsp;{order.amount}￥</p>
                <p>&emsp;卖家:&emsp;&emsp;&emsp;&emsp;{sellerInfo.user_name}</p>
                <p>&emsp;买家:&emsp;&emsp;&emsp;&emsp;{buyerInfo.user_name}</p>
                <p>&emsp;下单时间:&emsp;&emsp;{outTime(order.creation_date)}</p>
            </Card>
            <br />
            {complaintCard(order.complaint)}
        </>
    )
};

export default Complaint;
