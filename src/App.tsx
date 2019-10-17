import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
    <div className="App">
      <Header></Header>
      <div className="App-Content">
        <p>Here should be some content!</p>
      </div>
    </div>
    </Router>
  );
}

export default App;
