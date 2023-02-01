import {createRoot} from 'react-dom/client';
import React        from 'react';

import                   './index.scss';
import Root         from './components/Root.jsx';

const container = document.getElementById('root');
const root      = createRoot(container);

root.render(<Root />);
