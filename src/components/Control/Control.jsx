/* eslint-disable unicorn/prefer-at */

import _           from 'lodash';
import React       from 'react';
import {useParams} from 'react-router-dom';

import Grid        from '../Grid/Grid.jsx';

import Fenster     from '../Fenster/Fenster.jsx';
import Solar       from '../Solar/Solar.jsx';
import Temperatur  from '../Temperatur/Temperatur.jsx';
import Vito        from '../Vito/Vito.jsx';
import Volumio     from '../Volumio/Volumio.jsx';
import Wetter      from '../Wetter/Wetter.jsx';

const pages = {
  1: {
    lo: <Temperatur site='aussen' />,
    mo: <Temperatur site='wohnen' />,
    ro: <Temperatur site='buero' />,
    lu: <Wetter />,
    mu: <Solar />,
    ru: <Fenster />,
  },
  2: {
    mo: <Volumio />,
    lu: <Vito />,
  },
};

export default function Control() {
  const params = useParams();
  const page = Number(params.page) || 1;

  // console.log('Control', {page});

  return <Grid page={page} {...pages[page]} maxPages={Number(_.last(_.keys(pages)))} />;
}
