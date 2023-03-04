/* eslint-disable unicorn/prefer-at */

import _           from 'lodash';
import React       from 'react';
import {useParams} from 'react-router-dom';

import Grid        from '../Grid/Grid.jsx';

import Fenster     from '../Fenster/Fenster.jsx';
import Jalousie    from '../Jalousie/Jalousie.jsx';
import Solar       from '../Solar/Solar.jsx';
import Temperatur  from '../Temperatur/Temperatur.jsx';
import Vito        from '../Vito/Vito.jsx';
import Volumio     from '../Volumio/Volumio.jsx';
import Wetter      from '../Wetter/Wetter.jsx';

const pages = {
  1: [
    {width: 1, fit: true, content: <Temperatur site='aussen' />},
    {width: 1, fit: true, content: <Temperatur site='wohnen' />},
    {width: 1, fit: true, content: <Temperatur site='buero' />},
    {width: 1, fit: true, content: <Wetter />},
    {width: 1, fit: true, content: <Solar />},
    {width: 1, fit: true, content: <Fenster />},
  ],
  2: [
    {width: 1, fit: true, content: <Vito />},
    {width: 2,            content: <Volumio />},
    {width: 1, fit: true, content: <Solar />},
    {width: 1, fit: true, content: <Wetter />},
    {width: 1, fit: true, content: <Jalousie />},
  ],
};

export default function Control() {
  const params = useParams();
  const page = Number(params.page) || 1;

  // console.log('Control', {page, params});

  return <Grid page={page} items={pages[page]} maxPages={Number(_.last(_.keys(pages)))} />;
}
