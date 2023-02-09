// eslint-disable-next-line import/no-unassigned-import
import                   './index.scss';

import {createRoot} from 'react-dom/client';
import React        from 'react';

import Root         from './components/Root.jsx';

// eslint-disable-next-line no-undef
const container = document.getElementById('root');
const root      = createRoot(container);

root.render(<Root />);
