import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingProcess from './pages/BookingProcess';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path=/login element={<Login />} />
      <Route path=/register element={<Register />} />
      <Route path=/* element={<BookingProcess />} />
    </Routes>
  );
}

export default App;

