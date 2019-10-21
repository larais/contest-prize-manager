import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../logo.svg';

export default class Header extends React.Component<{}, {}> {
    render() {
        return (
            <div className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h2>Contest Prize Manager</h2>
                <div>       
                    <Link className="App-link" to="/">Home</Link>&nbsp;|&nbsp;
                    <Link className="App-link" to="/participants">Participants</Link>&nbsp;|&nbsp;
                    <Link className="App-link" to="/projects">Projects</Link>&nbsp;|&nbsp;
                    <Link className="App-link" to="/prizes">Prizes</Link>&nbsp;|&nbsp;
                    <Link className="App-link" to="/board">Board</Link>&nbsp;|&nbsp;
                    <Link className="App-link" to="/about">About</Link>
                </div>
            </div>
        );
    }
}