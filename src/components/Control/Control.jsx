/* eslint-disable unicorn/prefer-at */

import _           from 'lodash';
import React       from 'react';
import {useParams} from 'react-router-dom';

import Grid        from '../Grid/Grid.jsx';

import Clock       from '../Clock/Clock.jsx';
import Dreame      from '../Dreame/Dreame.jsx';
import Fenster     from '../Fenster/Fenster.jsx';
import Jalousie    from '../Jalousie/Jalousie.jsx';
import Solar       from '../Solar/Solar.jsx';
import Temperatur  from '../Temperatur/Temperatur.jsx';
import Vito        from '../Vito/Vito.jsx';
import Volumio     from '../Volumio/Volumio.jsx';
import Wetter      from '../Wetter/Wetter.jsx';

// import WetterDwd   from '../WetterDwd/WetterDwd.jsx';
//  {width: 3,            content: <WetterDwd />},

const items = [
  {width: 1, fit: true, content: <Temperatur site='Außen' />},
  {width: 1, fit: true, content: <Temperatur site='Wohnen' />},
  {width: 2,            content: <Wetter />},
  {width: 1, fit: true, content: <Clock />},
  {width: 1, fit: true, content: <Solar />},
  {width: 1, fit: true, content: <Fenster />},
  {width: 1, fit: true, content: <Temperatur site='Büro' />},
  {width: 1, fit: true, content: <Temperatur site='AußenVito' />},
  {width: 1, fit: true, content: <Vito />},
  {width: 2,            content: <Volumio />},
  {width: 1, fit: true, content: <Jalousie />},
  {width: 2,            content: <Wetter />},
  {width: 1, fit: true, content: <Dreame />},
];

const itemsToPages = function() {
  const pages = [];

  for(const item of items) {
    let found = false;
    let page  = 0;

    do {
      if(_.sum(_.map(pages[page], 'width')) + item.width <= 6) {
        found = true;

        if(_.isArray(pages[page])) {
          pages[page].push(item);
        } else {
          pages[page] = [item];
        }
      } else {
        page++;
      }
    } while(!found);
  }

  return pages;
};

export default function Control() {
  const params = useParams();
  const page = Number(params.page) || 1;

  const pages = itemsToPages(); // TODO state/ effect

  // console.log('Control', {page, params});

  return <Grid page={page} items={pages[page - 1]} maxPages={Number(_.last(_.keys(pages)))} />;
}
