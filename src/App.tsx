import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Board from './components/Board';
import About from './components/pages/About';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
    <div className="App">
      <Header></Header>
      <div className="App-Content">
        <Route
          exact
          path='/'
          render={(props) => (
            <p>Content goes here!</p>
          )}
				/>
        <Route path='/board' component={Board} />
        <Route path='/about' component={About} />
      </div>
    </div>
    </Router>
  );
}

export default App;
