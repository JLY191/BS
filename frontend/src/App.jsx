import { useState } from 'react';
import axios from 'axios';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  TeamOutlined,
  SettingOutlined,
  UserOutlined,
  IdcardOutlined,
  CreditCardOutlined,
  CreditCardFilled,
  InfoCircleOutlined,
  ScheduleOutlined,
  PieChartOutlined,
  CaretDownFilled,
  LogoutOutlined,
  FileTextOutlined,
  ContainerOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Dropdown, Space, message, Avatar } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

const item = [
  {
    key: '/module3/book',
    icon: <ScheduleOutlined />,
    label: <NavLink to='book'>商品预定</NavLink>,
  },
  {
    key: '/module3/orderlist',
    icon: <FileTextOutlined />,
    label: <NavLink to='/orderlist'>历史订单</NavLink>,
  },
  {
    key: '/module3/userinfo',
    icon: <UserOutlined />,
    label: <NavLink to='user/info'>个人信息</NavLink>,
  },
]

const items = [
  {
    key: '/dashboard/device',
    icon: <SettingOutlined />,
    label: <NavLink to='device'>设备管理</NavLink>,
  },
  {
    key: '/dashboard/message',
    icon: <InfoCircleOutlined />,
    label: <NavLink to='/dashboard/message'>设备信息</NavLink>,
  },
  {
    key: '/dashboard/statistics',
    icon: <BarChartOutlined />,
    label: <NavLink to='/dashboard/statistics'>统计信息</NavLink>,
  },
  {
    key: '/module3/userinfo',
    icon: <UserOutlined />,
    label: <NavLink to='/module3/userinfo'>个人信息</NavLink>,
  },
]

/* 商家 */
const items2 = [
  {
    key: '/module3/book',
    icon: <ScheduleOutlined />,
    label: <NavLink to='book'>商品预定</NavLink>,
  },
  {
    key: '/module3/admin',
    icon: <SettingOutlined />,
    label: <NavLink to='admin '>后台管理</NavLink>,
  },
  {
    key: '/module3/userinfo',
    icon: <UserOutlined />,
    label: <NavLink to='/module3/userinfo'>个人信息</NavLink>,
  },
  {
    key: '/module3/orderlist',
    icon: <FileTextOutlined />,
    label: <NavLink to='/module3/orderlist'>历史订单</NavLink>,
  },
];

/* 审计员 */
const items3 = [
  {
    key: '/module3/audit',
    icon: <PieChartOutlined />,
    label: <NavLink to='/module3/audit'>对账审核</NavLink>,
    children: [
      // {label:<NavLink to='/audit'>登录验证</NavLink>, key:"/audit/"},
      {label:<NavLink to='/module3/audit/settings'>对账处理</NavLink>, key:"/module3/audit/settings"},
      {label:<NavLink to='/module3/audit/manage'>审核管理</NavLink>, key:"/module3/audit/manage"},
    ],
  },
  {
    key: '/module3/userinfo',
    icon: <UserOutlined />,
    label: <NavLink to='/module3/userinfo'>个人信息</NavLink>,
  },
  {
    key: '/module3/orderlist',
    icon: <FileTextOutlined />,
    label: <NavLink to='/module3/orderlist'>历史订单</NavLink>,
  },
];

/* 系统管理员 */
const items4 = [
  {
    key: '/module3/user',
    icon: <IdcardOutlined />,
    label: <NavLink to='/module3/user'>用户信息管理</NavLink>,
  },
  {
    key: '/module3/ic',
    icon: <IdcardOutlined />,
    label: <NavLink to='/module3/ic'>IC卡信息管理</NavLink>,
  },
  {
    key: '/module3/bankcard',
    icon: <CreditCardOutlined />,
    label: <NavLink to='/module3/bankcard'>银行卡信息管理</NavLink>,
  },
  {
    key: '/module3/prepaid',
    icon: <CreditCardFilled />,
    label: <NavLink to='/module3/prepaid'>预付卡信息管理</NavLink>,
  },
  {
    key: '/module3/userinfo',
    icon: <UserOutlined />,
    label: <NavLink to='/module3/userinfo'>个人信息</NavLink>,
  },
];

const obj = [
  {
    label: '个人信息',
    key: '1',
    icon: <TeamOutlined />,
  },
  {
    label: '退出登录',
    key: '2',
    icon: <LogoutOutlined />,
  },
];

const App = () => {
  const [collapsed, setCollapsed] = useState(true);
  const {token: { colorBgContainer },} = theme.useToken();
  const navigate = useNavigate();
  if (sessionStorage.user === undefined) {
    message.error("请先登录！");
  }
  const user = sessionStorage.user === undefined ? "未登录" : JSON.parse(sessionStorage.user);
  const { pathname } = useLocation(); // 使用 useLocation() 获取当前访问界面的 url
  const [current, setCurrent] = useState(pathname); // 将侧边导航栏的选中选项与当前 url 同步

  const onClick = (e) => {
    setCurrent(e.key);
  }

  const handleDropDown = ({ key }) => { // 下拉菜单处理事件
    if(key === '1') { // 个人信息
      setCurrent('/dashboard/user/info');
      navigate('/dashboard/user/info');
    }
    else {
       // 退出登录
        axios.get('/user/logout')
        .then(res => {
          message.success('退出成功！');
          sessionStorage.removeItem('user');
          navigate('/login');
        })
        .catch(err => {
          message.error(err.message);
        })
      }

  };

  return (
    <Layout>
      {/* 头部信息 */}
      <Header>
        <div style={{ display: 'inline-block' }}>
          <Space>
            <img src='../img/ez.jpg' style={{marginTop:8}} width={34} height={52} />
            <span style={{color:'white', fontSize: 25, fontFamily: 'sans-serif'}}>物联网设备管理平台</span>
          </Space>
        </div>
        <div style={{ float: 'right', marginRight: 25 }}>
          <Space>
            <Avatar size="large" src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${user.charCodeAt(0)%10+1}`} />
            <Dropdown menu={{ items: obj, onClick: handleDropDown, }}>
                <Space style={{color: 'white'}}>
                  欢迎您，尊敬的 {`${user}`} 用户
                  <CaretDownFilled />
                </Space>
            </Dropdown>
          </Space>
        </div>
      </Header>
    <Layout style={{minHeight: '100vh'}}>
      {/* 侧边栏信息 */}
      <Sider theme='light' width={250} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <Menu selectedKeys={[current]} mode="inline" onClick={onClick} 
          items={
            items
          } />
      </Sider>
        {/* Content 为内容展示区域 */}
        <Layout>
        <Content style={{ margin: '0 16px', padding: '0 16px'}}>
          <>
            <Breadcrumb
              style={{margin: '16px 0', display: 'inline-block'}}
              items={[
                {
                  href: 'http://localhost:3000/dashboard',
                  title: (
                    <>
                      <HomeOutlined />
                      <span>Home</span>
                    </>
                  ),
                }
              ]}
            />
          </>
          {/* 主要信息展示区域 */}
          <div
              style={{
                minHeight: '100vh',
                background: colorBgContainer,
              }}
            >
                <div style={{width:'95%', margin:'0 auto'}}>
                    <Outlet />
                </div>
              
          </div>
        </Content>

        <Footer style={{ textAlign: 'center',}}>
          物联网设备管理平台 ©2023-2024 Created by JLY
        </Footer>
        </Layout>

      </Layout>
    </Layout>
  );
};
export default App;