import { useState } from 'react';
import { Layout } from 'antd';
import logo from './assets/react.svg';
import './App.css'
import SideBar from './components/SideBar';
import Kontak from './components/Kontak';
import Chat from './components/Chat'
import chatData from './assets/chatData';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';



const { Header, Sider } = Layout;
function App() {
  const [selectedContact, setSelectedContact] = useState("Nun")
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className='main'>
        <SideBar/>
        <Kontak onSelectContact={setSelectedContact} />
        <Chat contactId={selectedContact} chatData={chatData} />
    </div>
  )
}

export default App
