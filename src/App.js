import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home'; // 👈 add this
import Blog from './pages/Blog';
import BlogList from './pages/BlogList';
import Navbar from './components/Navbar';
import Start from './pages/Start';


function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/navbar" element={<Navbar />}/>
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
