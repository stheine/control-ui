/* eslint-disable class-methods-use-this */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable react/prefer-stateless-function */

import {Provider}                from 'react-redux';
import React                     from 'react';
import {HistoryRouter as Router} from 'redux-first-history/rr6';
import {Route, Routes}           from 'react-router';

import Control                   from '../../containers/Control/Control.jsx';
import Icons                     from '../Icons/Icons.jsx';
import {history, store}          from '../../store/index.js';

class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Routes>
            <Route path='/noauth' element={<div>No Auth</div>} />
            <Route path='/icons'  element={<Icons />} />
            <Route path='/1'      element={<Control page={1} />} />
            <Route path='/2'      element={<Control page={2} />} />
            <Route path='/3'      element={<Control page={3} />} />
            <Route path='/4'      element={<Control page={4} />} />
            <Route path='*'       element={<Control page={1} />} />
          </Routes>
        </Router>
      </Provider>
    );
  }
}

export default Root;
