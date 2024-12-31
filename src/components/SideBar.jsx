import React, { useState } from 'react';
// import {
//   NotificationOutlined,
//   HistoryOutlined,
//   UsergroupDeleteOutlined,
//   SettingOutlined,
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
//   UserOutlined,
// } from '@ant-design/icons';
// import { Button, Menu } from 'antd';

// const mainItems = [
//   {
//     key: '1',
//     icon: <UserOutlined />,
//     label: 'Private',
//   },
//   {
//     key: '2',
//     icon: <UsergroupDeleteOutlined />,
//     label: 'Group',
//   },
//   {
//     key: '3',
//     icon: <NotificationOutlined />,
//     label: 'Broadcast',
//   },
//   {
//     key: '4',
//     icon: <HistoryOutlined />,
//     label: 'Status',
//   },
// ];

// const bottomItems = [
//   {
//     key: '5',
//     icon: <SettingOutlined />,
//     label: 'Setting',
//   },
//   {
//     key: '6',
//     icon: <UserOutlined />,
//     label: 'User Name',
//   }
// ];

const SideBar = () => {
  // const [collapsed, setCollapsed] = useState(false);
  // const toggleCollapsed = () => {
  //   setCollapsed(!collapsed);
  // };

  return (
    <>
      <div className='xl:px-5 flex justify-center border-r border-gray-700'>
        <div>
          <div className="logo flex justify-center">
            <div className="img">
              <img src="" alt="" />
            </div>
            Sent
          </div>
          <div className='flex justify-center'>
            <button className="btn btn-neutral xl:w-[7vw]">
            <i class="fi fi-br-user"></i>
              <h1>Private</h1>
            </button>
          </div>
          <div className='flex justify-center'>
            <button className="btn btn-neutral xl:w-[7vw]">
              <h1>Group</h1>
            </button>
          </div>
          <div className='flex justify-center'>
            <button className="btn btn-neutral xl:w-[7vw]">
              <h1>Broadcast</h1>
            </button>
          </div>
        </div>
      </div>
    </>

    // <div
    //   style={{
    //     display: 'flex',
    //     flexDirection: 'column',
    //     height: '100vh',
    //     padding: '1px',
    //     width: collapsed ? 60 : 223, // Conditional width based on collapsed state
    //     backgroundColor: '#001529', // Background color to match the Menu's dark theme
    //     transition: 'width 0.2s', // Smooth transition for width change
    //   }}
    // >
    //   <Button
    //     type="primary"
    //     onClick={toggleCollapsed}
    //     style={{
    //       marginBottom: 16,
    //     }}
    //   >
    //     {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    //   </Button>
    //   <Menu
    //     className='Menu'
    //     defaultSelectedKeys={['1']}
    //     mode="inline"
    //     theme="dark"
    //     inlineCollapsed={collapsed}
    //     items={mainItems}
    //     style={{ width: '100%' }} // Ensure Menu takes full width of the container
    //   />
    //   <div style={{ flexGrow: 1 }}></div>
    //   <Menu
    //     className='Menu'
    //     mode="inline"
    //     theme="dark"
    //     inlineCollapsed={collapsed}
    //     items={bottomItems}
    //     style={{ width: '100%' }} // Ensure Menu takes full width of the container
    //   />
    // </div>
  )
};

export default SideBar;
