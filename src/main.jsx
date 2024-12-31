import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Log from './page/login.jsx'
import Reg from './page/register.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='login' element={<Log />} />
        <Route path='register' element={<Reg />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)
