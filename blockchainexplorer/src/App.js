import React from 'react';
import BlockList from './Components/BlockList.jsx';
import './App.css';

function App() {
  return (
    <div className ="App">
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
      <h1>Blockchain Explorer</h1>
      <BlockList/>
    </div>
  );
}

export default App;
