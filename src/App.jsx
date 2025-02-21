import { useState } from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Log from './page/login.jsx'
import Reg from './page/register.jsx'
import Private from './page/private.jsx'
import Group from './page/group.jsx'
import User from './page/user.jsx'
import Broadcast from './page/broadcast.jsx'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Log />} />
          <Route path='/login' element={<Log />} />
          <Route path='/register' element={<Reg />} />
          <Route path='/private' element={<Private />} />
          <Route path='/group' element={<Group />} />
          <Route path='/user' element={<User />} />
          <Route path='/broadcast' element={<Broadcast />} />
        </Routes>
    </Router>
    </>
  );
}

export default App;
