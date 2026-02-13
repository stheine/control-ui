import _               from 'lodash';
import {connect}       from 'react-redux';
import ms              from 'ms';
import React, {
  useContext,
  useEffect,
  useRef,
} from 'react';
import {
  useNavigate,
  useParams,
} from 'react-router';

import AppContext      from '../../contexts/AppContext.js';
import MqttContext     from '../../contexts/MqttContext.js';

import Grid            from '../Grid/Grid.jsx';

import Auto            from '../Auto/Auto.jsx';
import Clock           from '../Clock/Clock.jsx';
import Dreame          from '../Dreame/Dreame.jsx';
import Dreame2         from '../Dreame2/Dreame2.jsx';
import Fenster         from '../Fenster/Fenster.jsx';
import Infrarotheizung from '../Infrarotheizung/Infrarotheizung.jsx';
import JalousieBuero   from '../JalousieBuero/JalousieBuero.jsx';
import JalousieWohnen  from '../JalousieWohnen/JalousieWohnen.jsx';
import Muell           from '../Muell/Muell.jsx';
import Music           from '../Music/Music.jsx';
import Solar           from '../Solar/Solar.jsx';
import Strom           from '../Strom/Strom.jsx';
import Temperatur      from '../Temperatur/Temperatur.jsx';
import Vito            from '../Vito/Vito.jsx';

let    clickTimeout;

const Control = function(props) {
  const {dispatch} = props;

  const navigate = useNavigate();

  const {controlClient}        = useContext(AppContext);
  const {messages, mqttClient} = useContext(MqttContext);

  const params = useParams();
  const displayPage = Number(params.page) || 1;

  const displayPageRef = useRef(displayPage);
  const musicState     = useRef();

  useEffect(() => {
    // Use the displayPageRef inside this effect to prevent
    // re-registering the event handler on every page change
    mqttClient.on('message', async(topic, messageBuffer) => {
      const messageRaw = messageBuffer.toString();

      try {
        let message;

        try {
          message = JSON.parse(messageRaw);
        } catch{
          // ignore
        }

        switch(topic) {
          case 'control-ui/cmnd/route':
            // Diese route kommt von Display.jsx und aus control-io/control-ui.js und setzt das
            // UI zurueck auf die Startseite.
            navigate(message);
            break;

          case 'music/STATE': {
            const {state} = message || {};

            if(state !== musicState.current) {
              musicState.current = state;

              if(['...', 'play'].includes(state) && displayPageRef.current !== 1) {
                navigate('/1');
              }
            }
            break;
          }

          default:
            break;
        }
      } catch(err) {
        // eslint-disable-next-line no-console
        console.log('mqtt handler failed', {topic, messageRaw, errMessage: err.message});
      }
    });
  }, [dispatch, mqttClient, navigate]);

  useEffect(() => {
    displayPageRef.current = displayPage;
  }, [displayPage]);

  const calcFenster = () => Boolean(_.filter(messages, (message, topic) => {
    if(!topic.startsWith('Zigbee/FensterSensor')) {
      return false;
    }

    // console.log(`${topic}: ${message.contact}`);

    if(controlClient && topic === 'Zigbee/FensterSensor Test') {
      return false;
    }

    if(message.contact !== false) {
      return false;
    }

    return true;
  }).length);

  const calcMuell = () => Boolean(_.filter(messages, (message, topic) =>
    topic === 'muell/leerung/morgen' && Boolean(message?.length)).length);

  const calcMusic = () => Boolean(_.filter(messages, (message, topic) =>
    topic === 'music/STATE' && ['...', 'play'].includes(message.state)).length);

  const calcDreame = () => Boolean(_.filter(messages, (message, topic) =>
    (topic === 'valetudo/dreame-d9/StatusStateAttribute/status' && message !== 'docked') ||
    (topic === 'valetudo/dreame-d9/StatusStateAttribute/error' && message?.severity.kind !== 'none')).length);

  const calcDreame2 = () => Boolean(_.filter(messages, (message, topic) =>
    (topic === 'valetudo/dreame-d9-2/StatusStateAttribute/status' && message !== 'docked') ||
    (topic === 'valetudo/dreame-d9-2/StatusStateAttribute/error' && message?.severity.kind !== 'none')).length);

  const items = [
    {id: 'tempVito',          priority: -204, width: 1,            content: <Temperatur site='Außen' />},
    controlClient ?
      {id: 'tempWohnen',      priority: -203, width: 1,            content: <Temperatur site='Wohnen' />} :
      {id: 'tempBüro',        priority: -203, width: 1,            content: <Temperatur site='Büro' />},
    {id: 'auto',              priority: -103, width: 1,            content: <Auto />}, // ,    calcPriority: calcAuto},
    {id: 'strom',             priority: -102, width: 1,            content: <Strom />},
    {id: 'solar',             priority: -101, width: 1,            content: <Solar />},
    {id: 'clock',             priority:  -60, width: 1, fit: true, content: <Clock />},

    {id: 'muell',             priority:    0, width: 1,            content: <Muell />,   calcPriority: calcMuell},
    {id: 'fenster',           priority:    1, width: 1, fit: true, content: <Fenster />, calcPriority: calcFenster},
    {id: 'music',             priority:    2, width: 1,            content: <Music />, calcPriority: calcMusic},
    {id: 'jalousieWohnen',    priority:    3, width: 1, fit: true, content: <JalousieWohnen />},
    {id: 'dreame',            priority:    4, width: 1, fit: true, content: <Dreame />,  calcPriority: calcDreame},
    {id: 'dreame2',           priority:    5, width: 1, fit: true, content: <Dreame2 />, calcPriority: calcDreame2},
    {id: 'vito',              priority:    6, width: 1, fit: true, content: <Vito />},
    {id: 'jalousieBuero',     priority:    7, width: 1, fit: true, content: <JalousieBuero />},

//  {id: 'tempAussen',                        width: 1, fit: true, content: <Temperatur site='AußenFunk' />},
//  {id: 'tempAussenTasmota',                 width: 1, fit: true, content: <Temperatur site='AußenTasmota' />},
//  {id: 'tempWohnenRaspi',                   width: 1, fit: true, content: <Temperatur site='WohnenRaspi' />},
//  {id: 'tempBuero',                         width: 1, fit: true, content: <Temperatur site='Büro' />},
    {id: 'infrarotheizungBuero',              width: 1, fit: true, content: <Infrarotheizung site='Büro' />},
    {id: 'infrarotheizungSchlafzimmer',       width: 1, fit: true, content: <Infrarotheizung site='Schlafzimmer' />},
  ];

  const itemsToPages = () => {
    const pages = [];

    const itemsByPriority = _.sortBy(_.map(items, (item, index) => {
      let priority = item.priority || index;

      if(item.calcPriority && item.calcPriority()) {
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

  return (
    <div
      className='control'
      onClick={() => {
        if(clickTimeout) {
          clearTimeout(clickTimeout);
          clickTimeout = undefined;
        }

        clickTimeout = setTimeout(() => {
          navigate('/1');
        }, ms('30s'));
      }}
    >
      <title>Control</title>
      <Grid route='' page={displayPage} items={pages[displayPage - 1]} maxPages={Number(_.keys(pages).length)} />
    </div>
  );
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(Control);
