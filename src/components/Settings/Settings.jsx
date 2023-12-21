/* eslint-disable unicorn/prefer-at */

import _           from 'lodash';
import React       from 'react';
import {useParams} from 'react-router-dom';

import Grid        from '../Grid/Grid.jsx';
import Refresh     from '../../svg/sargam/Refresh.jsx';

import Beep        from '../Beep/Beep.jsx';
import Buttons     from '../Buttons/Buttons.jsx';
import Display     from '../Display/Display.jsx';
import Leds        from '../Leds/Leds.jsx';
import Zigbee      from '../Zigbee/Zigbee.jsx';

const reloadPage = function() {
  window.location.replace(window.location.pathname);
};

const pages = {
  1: [
    {width: 1, fit: true, content: <Display />},
    {width: 1, fit: true, content: <Beep />},
    {width: 1, fit: true, content: <Leds />},
    {width: 1, fit: true, content: <Buttons />},
    {width: 1, fit: true, content: <Refresh dark={true} onClick={() => reloadPage()} />},
    {width: 1, fit: true, content: <Zigbee />},
  ],
};

export default function Settings() {
  const params = useParams();
  const page = Number(params.page);

  // console.log('Settings', {params, page, pages});

  return (
    <div className='control'>
      <title>Settings</title>
      <Grid page={page} settings={true} items={pages[page]} maxPages={Number(_.last(_.keys(pages)))} />
    </div>
  );
}
