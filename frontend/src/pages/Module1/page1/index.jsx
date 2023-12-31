import React, {useEffect, useState} from 'react';
import {Divider, Button, Tag, Steps, Empty, Timeline, message, Input, Modal, InputNumber} from 'antd';
import { Card } from 'antd';
import {useParams} from "react-router-dom";
import {tr} from "date-fns/locale";
function UserInfo() {
    const user = JSON.parse(sessionStorage.user);
    const [userInfo,setUserInfo]=useState({
        user_id:0,
        user_name:"",
        bank_id:0,
        is_verify:false,
    });
    const [bankBalance,setBankBalance]=useState(0);
    const [prePayCard,setPrePayCard]=useState(0);
    const [name,setName]=useState("*");
    const [IC,setIC]=useState("*");
    const [isModal1Open, setIsModal1Open] = useState(false);
    const [isModal2Open, setIsModal2Open] = useState(false);
    useEffect(()=>{
        getUserInfo();
        //getBalance();
    },[]);
    useEffect(()=>{
        //getUserInfo();
        if(userInfo.bank_id!==0)
            getBalance();
    },[userInfo]);
//////////////////////////后端接口函数///////////////////////////////////
    const getUserInfo = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/m1/searchUserInfo/${user.user_id}`); // 替换为实际的后端接口URL
            const data = await response.json();
            setUserInfo(data.data[0]);
        } catch (error) {
            console.log('Error', error);
        }
    };
    const getBalance = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/module5/get/BankCard/${userInfo.bank_id}`); // 替换为实际的后端接口URL
            console.log(`http://127.0.0.1:8080/api/module5/get/BankCard/${userInfo.bank_id}`);
            const data = await response.json();
            await setBankBalance(data.data[0].Balance);
        } catch (error) {
            console.log('Error', error);
        }
    };
    const testVerify  = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/module5/verify/realName/${IC}/${name}`); // 替换为实际的后端接口URL
            console.log(IC);
            console.log(name);
            console.log(`http://127.0.0.1:8080/api/module5/verify/realName/${IC}/${name}`);
            const data = await response.json();
            if(data.status===0) {
                await setVerify();
                await getUserInfo();
                info2(true);
            }
            else {
                info2(false);
            }
        } catch (error) {
            console.log('Error', error);
        }
    };
    const setVerify = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/m1/updateUserInfo/${user.user_id}/${1}`); // 替换为实际的后端接口URL
            const data = await response.json();
        } catch (error) {
            console.log('Error', error);
        }
    };
    const try2charge = async  () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/module5/get/PrepaidCard/${prePayCard}`); // 替换为实际的后端接口URL
            const data = await response.json();
            if(data.status===0) {
                await money2bank(data.data[0].Balance,userInfo.bank_id);
                await deleteCard(prePayCard);
                info1(true);
            }
            else {
                info1(false);
            }
        } catch (error) {
            console.log('Error', error);
        }
    }
    const deleteCard = async (cardId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/module5/drop/PrepaidCard/${cardId}`);
            const data = await response.json();
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

    function try2recharge () {
        //检查充值卡
        try2charge();
        /*
        if(1) {
            //充值
            info1(true);
        }
        else {
            info2(false);
        }*/
    }
    function try2verify () {
        //尝试验证
        testVerify();
        /*
        if(1) {
            setVerify();
            getUserInfo();
            info2(true);
        }
        else {
            info2(false);
        }*/
    }
    function info1 (flag) {
        if(flag)
            message.success(<>充值成功</>);
        else
            message.error(<>无效充值卡</>);
    }
    function info2 (flag) {
        if(flag)
            message.success(<>验证成功</>);
        else
            message.error(<>验证失败</>);
    }
    return (
        <>
            <Card hoverable title="个人信息">
                <p>用户ID：&emsp;&emsp; {user.user_id}</p>
                <p>用户名：&emsp;&emsp; {user.user_name}</p>
                <p>会员身份：&emsp; {user.isVIP?'是':'否'}</p>
                {user.is_businessmen? <p>工作单位：&emsp;{user.work_for}</p>:<></>}
                <p>真实姓名：&emsp; {}</p>
                <p>身份证号：&emsp; {}</p>
                <br></br>
                <p>身份验证：&emsp; {userInfo.is_verify? '已验证':'未验证'}&emsp;<Button disabled={userInfo.is_verify} onClick={()=>{setIsModal2Open(true)}}>身份验证</Button></p>
                <Modal title="余额充值"
                       open={isModal2Open}
                       okText="验证"
                       cancelText="取消"
                       onOk={()=>{
                           try2verify();
                           setIsModal2Open(false);
                       }}
                       onCancel={()=>{
                           setIsModal2Open(false)
                       }}
                >
                    <p>真实姓名：&emsp;
                        <Input controls={false}
                               placeholder="输入真实姓名"
                               style={{ width: 200 }}
                               onChange={(value)=>{
                                   if(value===null)
                                       setName("*");
                                   else
                                       setName(value.target.value);
                               }}
                        />
                    </p>
                    <p>身份证号：&emsp;
                        <Input controls={false}
                                     placeholder="输入身份证号"
                                     style={{ width: 200 }}
                                     onChange={(value)=>{
                                         if(value===null)
                                             setIC("*");
                                         else
                                             setIC(value.target.value);
                                     }}
                        />
                    </p>
                </Modal>

            </Card>
            <br/>
            <Card hoverable title="支付信息">
                <p>银行卡ID：&emsp; {userInfo.bank_id}</p>
                <p>余额：&emsp;&emsp;&emsp; {bankBalance}￥</p>
                <Button onClick={()=>{setIsModal1Open(true)}}>充值余额</Button>
                <Modal title="余额充值"
                       open={isModal1Open}
                       okText="充值"
                       cancelText="取消"
                       onOk={()=>{
                           try2recharge();
                           setIsModal1Open(false);
                       }}
                       onCancel={()=>{
                           setIsModal1Open(false)
                       }}
                >
                    <p>银行卡ID：&emsp; {userInfo.bank_id}</p>
                    <p>充值卡：&emsp;&emsp;
                        <InputNumber controls={false}
                                     placeholder="输入充值卡卡号"
                                     style={{ width: 200 }}
                                     onChange={(value)=>{
                                        if(value===null)
                                            setPrePayCard(0);
                                        else
                                            setPrePayCard(value);
                                     }}
                        />
                    </p>
                </Modal>
            </Card>
        </>
    )
}

export default UserInfo;
