// eslint-disable-next-line import/no-unassigned-import
import                   './index.scss';

import {createRoot} from 'react-dom/client';
import React        from 'react';

import App          from './components/App/App.jsx';

// eslint-disable-next-line no-undef
const container = document.getElementById('app');
const app       = createRoot(container);

app.render(<App />);
