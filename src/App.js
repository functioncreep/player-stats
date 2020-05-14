import React from 'react';
import './App.scss';
import StatsBoard from './stats/StatsBoard';

function App() {
  return (
    <div className="App">
      <div className="section">
        <div className="container">
          <StatsBoard />
        </div>
      </div>
    </div>
  );
}

export default App;
