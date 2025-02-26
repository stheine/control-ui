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
import Fenster         from '../Fenster/Fenster.jsx';
import Infrarotheizung from '../Infrarotheizung/Infrarotheizung.jsx';
import JalousieBuero   from '../JalousieBuero/JalousieBuero.jsx';
import JalousieWohnen  from '../JalousieWohnen/JalousieWohnen.jsx';
import Muell           from '../Muell/Muell.jsx';
import Solar           from '../Solar/Solar.jsx';
import Strom           from '../Strom/Strom.jsx';
import Temperatur      from '../Temperatur/Temperatur.jsx';
import Vito            from '../Vito/Vito.jsx';
import Volumio         from '../Volumio/Volumio.jsx';

let    clickTimeout;

const Control = function(props) {
  const {dispatch} = props;

  const navigate = useNavigate();

  const {controlClient}        = useContext(AppContext);
  const {messages, mqttClient} = useContext(MqttContext);

  const params = useParams();
  const displayPage = Number(params.page) || 1;

  const displayPageRef = useRef(displayPage);
  const volumioStatus  = useRef();

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

          case 'volumio/stat/pushState': {
            const {status} = message || {};

            if(status !== volumioStatus.current) {
              volumioStatus.current = status;

              if(status === 'play' && displayPageRef.current !== 1) {
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

    if(controlClient && topic === 'Zigbee/FensterSensor Sonoff 1') {
      return false;
    }

    if(message.contact) {
      return false;
    }

    return true;
  }).length);

  const calcMuell = () => Boolean(_.filter(messages, (message, topic) =>
    topic === 'muell/leerung/morgen' && Boolean(message?.length)).length);

  const calcVolumio = () => Boolean(_.filter(messages, (message, topic) =>
    topic === 'volumio/stat/pushState' && ['...', 'play'].includes(message.status)).length);

  const calcDreame = () => Boolean(_.filter(messages, (message, topic) =>
    (topic === 'valetudo/dreame-d9/StatusStateAttribute/status' && message !== 'docked') ||
    (topic === 'valetudo/dreame-d9/StatusStateAttribute/error' && message?.severity.kind !== 'none')).length);

  // const calcAuto = () => Boolean(_.filter(messages, (message, topic) =>
  //   topic === 'vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/charging/chargingStatus/chargingState' &&
  //   message === 'charging').length);

  const items = [
    {id: 'tempAussen',        priority: -204, width: 1,            content: <Temperatur site='Außen' />},
    {id: 'tempWohnen',        priority: -203, width: 1,            content: <Temperatur site='Wohnen' />},
    {id: 'auto',              priority: -103, width: 1,            content: <Auto />}, // ,    calcPriority: calcAuto},
    {id: 'strom',             priority: -102, width: 1,            content: <Strom />},
    {id: 'solar',             priority: -101, width: 1,            content: <Solar />},
    {id: 'clock',             priority:  -60, width: 1, fit: true, content: <Clock />},

    {id: 'muell',             priority:    0, width: 1,            content: <Muell />,   calcPriority: calcMuell},
    {id: 'fenster',           priority:    0, width: 1, fit: true, content: <Fenster />, calcPriority: calcFenster},
    {id: 'volumio',           priority:    0, width: 1,            content: <Volumio />, calcPriority: calcVolumio},
    {id: 'vito',              priority:    0, width: 1, fit: true, content: <Vito />},
    {id: 'jalousieWohnen',    priority:    0, width: 1, fit: true, content: <JalousieWohnen />},

    {id: 'tempVito',                          width: 1, fit: true, content: <Temperatur site='AußenVito' />},
//  {id: 'tempAussenTasmota',                 width: 1, fit: true, content: <Temperatur site='AußenTasmota' />},
    {id: 'tempWohnenRaspi',                   width: 1, fit: true, content: <Temperatur site='WohnenRaspi' />},
    {id: 'tempBuero',                         width: 1, fit: true, content: <Temperatur site='Büro' />},
    {id: 'dreame',                            width: 1, fit: true, content: <Dreame />,  calcPriority: calcDreame},
    {id: 'jalousieBuero',                     width: 1, fit: true, content: <JalousieBuero />},
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
      <Grid page={displayPage} items={pages[displayPage - 1]} maxPages={Number(_.keys(pages).length)} />
    </div>
  );
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(Control);
