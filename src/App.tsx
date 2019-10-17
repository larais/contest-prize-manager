import React from 'react';
import Header from './components/layout/Header';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <Header></Header>
      <div className="App-Content">
        <p>Here should be some content!</p>
      </div>
    </div>
  );
}

export default App;
