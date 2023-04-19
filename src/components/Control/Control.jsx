import _               from 'lodash';
import {useParams}     from 'react-router-dom';
import React, {
  useContext,
} from 'react';

import AppContext      from '../../contexts/AppContext.js';
import MqttContext     from '../../contexts/MqttContext.js';

import Grid            from '../Grid/Grid.jsx';

import Clock           from '../Clock/Clock.jsx';
import Dreame          from '../Dreame/Dreame.jsx';
import Fenster         from '../Fenster/Fenster.jsx';
import InfrarotHeizung from '../InfrarotHeizung/InfrarotHeizung.jsx';
import JalousieBuero   from '../JalousieBuero/JalousieBuero.jsx';
import JalousieWohnen  from '../JalousieWohnen/JalousieWohnen.jsx';
import Solar           from '../Solar/Solar.jsx';
import Temperatur      from '../Temperatur/Temperatur.jsx';
import Vito            from '../Vito/Vito.jsx';
import Volumio         from '../Volumio/Volumio.jsx';
import Wetter          from '../Wetter/Wetter.jsx';

// import WetterDwd   from '../WetterDwd/WetterDwd.jsx';
//  {width: 3,            content: <WetterDwd />},

export default function Control() {
  const {controlClient} = useContext(AppContext);
  const {messages}      = useContext(MqttContext);

  const params = useParams();
  const displayPage = Number(params.page) || 1;

  const calcFenster = () => Boolean(_.filter(messages, (message, topic) => {
    if(!topic.startsWith('Zigbee/FensterSensor')) {
      return false;
    }

    if(controlClient && topic === 'Zigbee/FensterSensor Sonoff 1') {
      return false;
    }

    if(message.contact) {
      return false;
    }

    return true;
  }).length);

  const calcVolumio = () => Boolean(_.filter(messages, (message, topic) =>
    topic === 'volumio/stat/pushState' && message.status === 'play').length);

  const calcDreame = () => Boolean(_.filter(messages, (message, topic) =>
    (topic === 'valetudo/dreame-d9/StatusStateAttribute/status' && message !== 'docked') ||
    (topic === 'valetudo/dreame-d9/StatusStateAttribute/error' && message?.severity.kind !== 'none')).length);

  const calcWetter = () => Boolean(_.filter(messages, (message, topic) =>
    topic === 'wetter/dwd/INFO' && message?.forecast.warnings.length).length);

  const items = [
    {id: 'tempAussen',        width: 1, fit: true, content: <Temperatur site='Außen' />},
    {id: 'tempWohnen',        width: 1, fit: true, content: <Temperatur site='Wohnen' />},
    {id: 'wetter',            width: 2,            content: <Wetter />,                      calcPriority: calcWetter},
    {id: 'solar',             width: 1, fit: true, content: <Solar />},
    {id: 'clock',             width: 1, fit: true, content: <Clock />},

    {id: 'fenster',           width: 1, fit: true, content: <Fenster />,                     calcPriority: calcFenster},
    {id: 'jalousieWohnen',    width: 1, fit: true, content: <JalousieWohnen />},
    {id: 'vito',              width: 1, fit: true, content: <Vito />},
    {id: 'volumio',           width: 2,            content: <Volumio />,                     calcPriority: calcVolumio},
    {id: 'dreame',            width: 1, fit: true, content: <Dreame />,                      calcPriority: calcDreame},

    {id: 'tempVito',          width: 1, fit: true, content: <Temperatur site='AußenVito' />},
    {id: 'tempAussenTasmota', width: 1, fit: true, content: <Temperatur site='AußenTasmota' />},
    {id: 'tempWohnenRaspi',   width: 1, fit: true, content: <Temperatur site='WohnenRaspi' />},
    {id: 'tempBuero',         width: 1, fit: true, content: <Temperatur site='Büro' />},
    {id: 'jalousieBuero',     width: 1, fit: true, content: <JalousieBuero />},
    {id: 'infrarotHeizung',   width: 1, fit: true, content: <InfrarotHeizung />},
  ];

  const itemsToPages = () => {
    const pages = [];

    const itemsByPriority = _.sortBy(_.map(items, (item, index) => {
      let priority = index;

      if(item.calcPriority && item.calcPriority({messages})) {
        priority -= 100;
      }

      return {...item, priority};
    }), ['priority']);

    for(const item of itemsByPriority) {
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

  const pages = itemsToPages({messages});

  // console.log('Control', {displayPage, params});

  return <Grid page={displayPage} items={pages[displayPage - 1]} maxPages={Number(_.keys(pages).length)} />;
}
