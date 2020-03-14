import React from 'react';
import logo from './logo.svg';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
const routes = require ('./routes')
function App() {
  return (
    <Router>
        <div>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              component={route.component}
            />
          ))}
        </div>
      </Router>
  );
}

export default App;
