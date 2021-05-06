import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './components/Home';
import Header from './components/Header';
import Login from './components/Login'
import './App.css';

function App() {
  return (
    <div className="App">
    <Router>
      <Header/>
      <Switch>
        <Route exact path="/">
          <Login/>
          </Route>
          <Route path = '/home'>
            <Home/>
          </Route>

      </Switch>
    </Router>
    </div>
  );
}

export default App;
