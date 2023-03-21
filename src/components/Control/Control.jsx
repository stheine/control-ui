import _               from 'lodash';
import React           from 'react';
import {useParams}     from 'react-router-dom';

import Grid            from '../Grid/Grid.jsx';

import Clock           from '../Clock/Clock.jsx';
import Dreame          from '../Dreame/Dreame.jsx';
import Fenster         from '../Fenster/Fenster.jsx';
import InfrarotHeizung from '../InfrarotHeizung/InfrarotHeizung.jsx';
import Jalousie        from '../Jalousie/Jalousie.jsx';
import Solar           from '../Solar/Solar.jsx';
import Temperatur      from '../Temperatur/Temperatur.jsx';
import Vito            from '../Vito/Vito.jsx';
import Volumio         from '../Volumio/Volumio.jsx';
import Wetter          from '../Wetter/Wetter.jsx';

// import WetterDwd   from '../WetterDwd/WetterDwd.jsx';
//  {width: 3,            content: <WetterDwd />},

const items = [
  {id: 'tempAussen',      width: 1, fit: true, content: <Temperatur site='Außen' />},
  {id: 'tempWohnen',      width: 1, fit: true, content: <Temperatur site='Wohnen' />},
  {id: 'wetter',          width: 2,            content: <Wetter />},
  {id: 'clock',           width: 1, fit: true, content: <Clock />},
  {id: 'solar',           width: 1, fit: true, content: <Solar />},
  {id: 'fenster',         width: 1, fit: true, content: <Fenster />},
  {id: 'tempVito',        width: 1, fit: true, content: <Temperatur site='AußenVito' />},
  {id: 'vito',            width: 1, fit: true, content: <Vito />},
  {id: 'volumio',         width: 2,            content: <Volumio />},
  {id: 'tempBuero',       width: 1, fit: true, content: <Temperatur site='Büro' />},
  {id: 'jalousie',        width: 1, fit: true, content: <Jalousie />},
  {id: 'infrarotHeizung', width: 1, fit: true, content: <InfrarotHeizung />},
  {id: 'dreame',          width: 1, fit: true, content: <Dreame />},
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

  // console.log({pages});

  return pages;
};

export default function Control() {
  const params = useParams();
  const page = Number(params.page) || 1;

  const pages = itemsToPages(); // TODO state/ effect

  // console.log('Control', {page, params});

  return <Grid page={page} items={pages[page - 1]} maxPages={Number(_.keys(pages).length)} />;
}
