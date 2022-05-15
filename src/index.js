import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import Register from './pages/Register';
import Navigation from './pages/Navigation';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <div className='App'>
    <Navigation/>
    <BrowserRouter>
    <Routes>
      <Route exact path='/' element={<Login />} />
      <Route exact path='/Dashboard' element={<Dashboard />} />
      <Route exact path='/Register' element={<Register />} />
      <Route exact path='/Cart' element={<Cart />} />
    </Routes>
    </BrowserRouter>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

reportWebVitals();
