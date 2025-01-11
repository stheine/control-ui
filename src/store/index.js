import {thunk}       from 'redux-thunk';
import {
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';

import * as reducers from '../reducers/index.js';

const middleware = () => [
  thunk,
];

export const store = configureStore({
  reducer: combineReducers({
    ...reducers,
  }),
  middleware,
});
