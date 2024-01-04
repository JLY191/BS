import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import './index.css';
import App from './App';
import Device from './pages/Device';
import Message from "./pages/Message";
import Statistics from "./pages/Statistics";
import MapPage from "./pages/Map";
import Login from './components/Login';
import EmailLogin from "./components/EmailLogin";
import Register from './components/Register';
import Index from "./components/Index";
import Page404 from "./pages/Page404";
import UsersList from './pages/UsersList'

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
            <Route path="/dashboard/map" element={<MapPage />} />
            <Route path="/dashboard/user/info" element={<UsersList />} />
          </Route>
        </Routes>
    </BrowserRouter>
);


reportWebVitals();