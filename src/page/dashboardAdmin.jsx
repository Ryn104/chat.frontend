import { useState } from 'react';
import '../App.css';
import Sidebar from '../components/SideBar';
import Navbar from '../components/NavBarAdmin';
import Members from '../components/Members';

const Dashboard = () => {

  return (
    <div className="main">
      <div className="flex">
        <div className="z-40">
          <Sidebar />
        </div>
        <div className='xl:w-[95vw]'>
          <div>
            <Navbar />
          </div>
          <div>
            <Members />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
