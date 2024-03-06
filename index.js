import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './Register';
import Login from './Login';
import './css/style.css';
import Home from './Home';
import './css/home.css';
import Maincategory from './Maincategory';
import Subcategory from './Subcategory';
import Subdata from './Subdata';
import Editmain from './Editmain';
import Editsubcategory from './Editsubcategory';
import Editsubdata from './Editsubdata';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
    <Route path="/" element={ <Register/> } />
    <Route path="/login" element={ <Login/> } />
    <Route path="/Home" element={<Home/>} />
    <Route path="/Maincategory" element={<Maincategory/>} />
    <Route path="/Subcategory" element={<Subcategory/>} />
    <Route path="/Subdata" element={<Subdata/>} />
    <Route path="/Subdata" element={<Subdata/>} />
    <Route path="/Subdata" element={<Subdata/>} />
    <Route path="/edit/:id" element={<Editmain/>} />
    <Route path="/subcategoeyedit/:id" element={<Editsubcategory/>} />
    <Route path="/subdataedit/:id" element={<Editsubdata/>} />
    </Routes>
  </BrowserRouter>
);