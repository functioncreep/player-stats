import React from 'react';
import './App.scss';
import Stats from './stats/Stats';

function App() {
  return (
    <div className="App">
      <div className="section is-paddingless">
        <div className="container">
          <Stats />
        </div>
      </div>
    </div>
  );
}

export default App;
