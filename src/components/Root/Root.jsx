import {Provider} from 'react-redux';
import React      from 'react';
import {store}    from '../../store/index.js';

import App        from '../App/App.jsx';

const Root = function() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default Root;
