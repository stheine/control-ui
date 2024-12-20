/* / eslint-disable no-constant-condition */

// import {logger}                    from 'redux-logger';
import {thunk}                     from 'redux-thunk';
import {
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';

import * as reducers               from '../reducers/index.js';

const middleware = () => [
  thunk,
];

// if(false && process.env.NODE_ENV !== 'production') {
//   middleware.push(logger);
// }

export const store = configureStore({
  reducer: combineReducers({
    ...reducers,
  }),
  middleware,
});
