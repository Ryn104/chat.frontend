import React, { useState } from 'react';
import photos from "../assets/image.js";
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
      <div className="">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label htmlFor="my-drawer" className="btn btn-primary drawer-button">Open drawer</label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <div className='xl:px-5 flex justify-center border-r border-gray-700 xl:h-[100vh]'>
              <div className='flex flex-col justify-between'>
                <div className=''>
                  <div className="logo flex justify-center xl:my-4">
                    <div className="img flex">
                      <img src={photos.logo} alt="" className='self-center xl:w-10'/>
                    </div>
                    <h1 className='xl:font-semibold xl:text-5xl'>Sent</h1>
                  </div>
                  <div className='flex justify-center mt-10'>
                    <button className="xl:w-[7vw]">
                      <div className='flex pl-1'>
                        <img src={photos.privates} alt="" className='xl:h-[25px] self-center mr-2'/>
                        <h1 className='xl:text-2xl self-center font-semibold'>Private</h1>
                      </div>
                    </button>
                  </div>
                  <div className='flex justify-center mt-10'>
                    <button className="xl:w-[7vw]">
                      <div className='flex pl-1'>
                        <img src={photos.group} alt="" className='xl:h-[25px] self-center mr-2'/>
                        <h1 className='xl:text-2xl self-center font-semibold'>Group</h1>
                      </div>
                    </button>
                  </div>
                  <div className='flex justify-center mt-10'>
                    <button className="xl:w-[7vw]">
                      <div className='flex pl-1'>
                        <img src={photos.broadcast} alt="" className='xl:h-[25px] self-center mr-2'/>
                        <h1 className='xl:text-2xl self-center font-semibold'>Broadcast</h1>
                      </div>
                    </button>
                  </div>
                </div>
                <div className='mb-5'>
                  <div className='flex justify-center mb-5'>
                    <button className="xl:w-[7vw]">
                      <div className='flex pl-1'>
                        <img src={photos.broadcast} alt="" className='xl:h-[25px] self-center mr-2'/>
                        <h1 className='xl:text-2xl self-center font-semibold'>Setting</h1>
                      </div>
                    </button>
                  </div>
                  <div className='flex justify-center'>
                    <img src={photos.Riyan} alt="" className='xl:w-16 rounded-full'/>
                    <h1 className='text-xl font-semibold ml-2 self-center'>Riyan Handriyana</h1>
                  </div>
                </div>
              </div>
            </div>
            
          </ul>
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
