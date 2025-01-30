import React from 'react';
import { Menu } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  MessageOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const SideBar = ({ collapsed, toggleCollapsed }) => {
  return (
    <div>
      <div className="logo" />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<UserOutlined />}>
          Private
        </Menu.Item>
        <Menu.Item key="2" icon={<TeamOutlined />}>
          Group
        </Menu.Item>
        <Menu.Item key="3" icon={<MessageOutlined />}>
          Broadcast
        </Menu.Item>
        <Menu.Item key="4" icon={<SettingOutlined />}>
          Settings
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default SideBar;