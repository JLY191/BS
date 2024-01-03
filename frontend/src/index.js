import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import './index.css';
import App from './App';
import Device from './pages/Device';
import Message from "./pages/Message";
import Statistics from "./pages/Statistics";
import Admin from './pages/module3/Admin';
import Login from './components/Login';
import EmailLogin from "./components/EmailLogin";
import Register from './components/Register';
import Index from "./components/Index";
import Audit from './pages/Audit';
import Auditsettings from './components/Auditsettings.jsx';
import Auditmanage from './components/Auditmanage.jsx';
import OrderList from './pages/ModuleG2/OrderList';
import Refund from './pages/ModuleG2/Refund';
import Payment from './pages/ModuleG2/Payment';
import Complaint from './pages/ModuleG2/Complaint';
import OrderInfo from './pages/ModuleG2/OrderInfo';
import UserInfo from './pages/Module1/page1';
import Page404 from "./pages/Page404";
import UsersList from './pages/UsersList'
import ICList from './pages/ICList'
import BankCardList from './pages/BankCardList'
import PrepaidList from './pages/PrepaidList'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/email_login" element={<EmailLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/page404" element={<Page404 />} />
          <Route path="/dashboard" element={<App />}>
            <Route index element={<Index />} />
            <Route path="/dashboard/device" element={<Device />} />
            <Route path="/dashboard/message" element={<Message />} />
            <Route path="/dashboard/statistics" element={<Statistics />} />
              <Route path="/dashboard/audit" element={<Audit />} />
              <Route path="/dashboard/audit/settings" element={<Auditsettings />}/>
              <Route path="/dashboard/audit/manage" element={<Auditmanage />}/>
              <Route path="/dashboard/orderlist" element={<OrderList />} />
              <Route path="/dashboard/refund/:orderId" element={<Refund />} />
              <Route path="/dashboard/payment/:orderId" element={<Payment />} />
              <Route path="/dashboard/complaint/:orderId" element={<Complaint/>} />
              <Route path="/dashboard/orderinfo/:orderId" element={<OrderInfo/>} />
              <Route path="/dashboard/userinfo" element={<UserInfo />} />

            <Route path="/dashboard/user/info" element={<UsersList />} />
            <Route path="/dashboard/ic" element={<ICList />} />
            <Route path="/dashboard/bankcard" element={<BankCardList />} />
            <Route path="/dashboard/prepaid" element={<PrepaidList />} />
          </Route>
          
        </Routes>
    </BrowserRouter>
);


reportWebVitals();