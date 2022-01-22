import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from './Home';
import ContactPickerDemo from './demo/contact-picker/contact-picker';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="contact-picker-demo" element={<ContactPickerDemo />} />
      </Routes>
    </div>
  );
}

export default App;
