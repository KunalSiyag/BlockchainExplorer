import React from 'react';
import BlockList from './Components/BlockList.jsx';
import './App.css';
function App() {
  return (
    <div className ="Main">
    <div className = "App">
    <ul className="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
    </ul>
    <div>
      <BlockList/>
    </div>
    </div>
    </div>
  );
}

export default App;
