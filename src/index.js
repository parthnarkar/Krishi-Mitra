import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import './style.css'
import Desktop1 from './views/desktop1'
import Productframe from './views/productframe'
import Auth from './views/auth'
import Reg from './views/reg'
import NotFound from './views/not-found'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route component={Desktop1} exact path="/" />
        <Route component={Productframe} exact path="/productframe" />
        <Route component={Auth} exact path="/auth" />
        <Route component={Reg} exact path="/reg" />
        <Route component={NotFound} path="**" />
        <Redirect to="**" />
      </Switch>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
