import React from 'react';
import './App.scss';
import Stats from './stats/Stats';
import PouchDB from 'pouchdb';

var db = new PouchDB('my_database');
console.log(db);

function App() {
  return (
    <div className="App">
      <div className="section">
        <div className="container">
          <Stats />
        </div>
      </div>
    </div>
  );
}

export default App;
