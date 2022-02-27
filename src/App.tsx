import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from './Home';
import PageNotFound from './pages/not-found/not-found';
import ContactPickerDemo from './demo/contact-picker/contact-picker';
import GeolocationDemo from './demo/geolocation/geolocation';
import DragDropDemo from './demo/drag-n-drop/drag-n-drop';
import ClipboardDemo from './demo/clipboard/clipboard';
import FullscreenDemo from './demo/fullscreen/fullscreen';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="contact-picker-demo" element={<ContactPickerDemo />} />
        <Route path="geolocation-demo" element={<GeolocationDemo />} />
        <Route path="drag-n-drop-demo" element={<DragDropDemo />} />
        <Route path="clipboard-demo" element={<ClipboardDemo />} />
        <Route path="fullscreen-demo" element={<FullscreenDemo />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
