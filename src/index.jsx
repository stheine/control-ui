import                   './index.scss';

import {createRoot} from 'react-dom/client';
import React        from 'react';

import Root         from './components/Root/Root.jsx';

const container = document.getElementById('root');
const root      = createRoot(container);

root.render(<Root />);
