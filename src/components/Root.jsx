/* eslint-disable react/prefer-stateless-function */

import {Provider}                from 'react-redux';
import React                     from 'react';
import {HistoryRouter as Router} from 'redux-first-history/rr6';
import {Route, Routes}           from 'react-router';

import Quixy                     from '../containers/Control/Control.jsx';
import {history, store}          from '../store/index.js';

class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Routes>
            <Route exact={true} path='/noauth' element={<div>No Auth</div>} />
            <Route path='*' element={<Quixy />} />
          </Routes>
        </Router>
      </Provider>
    );
  }
}

export default Root;
