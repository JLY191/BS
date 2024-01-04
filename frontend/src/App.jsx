import { useState, useEffect } from 'react';
import axios from 'axios';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeOutlined,
  TeamOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  CaretDownFilled,
  LogoutOutlined,
  BarChartOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Dropdown, Space, message, Avatar } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

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
    key: '/dashboard/map',
    icon: <EnvironmentOutlined />,
    label: <NavLink to='/dashboard/map'>查看地图</NavLink>,
  },
]

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

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 649);
    };

    // 组件挂载时和窗口大小变化时都会触发
    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化

    // 组件卸载时移除事件监听
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Layout>
      {/* 头部信息 */}
      <Header style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 16px' }}>
          {!isSmallScreen && (
              <div style={{ display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
                {/* 左侧部分 */}
                <img src='../img/ez.jpg' style={{ marginTop: 8 }} width={34} height={52} />
                <span style={{ color: 'white', fontSize: 25, fontFamily: 'sans-serif', marginLeft: '10px', display: 'block' }}>物联网设备管理平台</span>
              </div>
          )}
          {/* 右侧部分 */}
          <Space style={{ marginRight: 25, marginLeft: isSmallScreen ? 'auto' : '0' }}>
            <Avatar size="large" src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${user.charCodeAt(0) % 10 + 1}`} />
            <Dropdown menu={{ items: obj, onClick: handleDropDown }}>
              <Space style={{ color: 'white' }}>
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