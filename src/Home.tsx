import React from 'react';
import { Link } from "react-router-dom";
import './Home.css';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="App-title">Web APIs Demo</div>
        <br />
        <div>
          <Link className="App-link" to="/notifications-demo">Notifications API Demo</Link><br />
          <Link className="App-link" to="/fullscreen-demo">Fullscreen API Demo</Link><br />
          <Link className="App-link" to="/clipboard-demo">Clipboard API Demo</Link><br />
          <Link className="App-link" to="/drag-n-drop-demo">Drag and Drop API Demo</Link><br />
          <Link className="App-link" to="/geolocation-demo">Geolocation API Demo</Link><br />
          <Link className="App-link" to="/contact-picker-demo">Contact Picker API Demo</Link><br />
        </div>
      </header>
    </div>
  );
}

export default Home;
