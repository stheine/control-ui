/* eslint-disable arrow-body-style */
/* eslint-disable no-lonely-if */

import ms from 'ms';
import {
  use,
//   useCallback,
  useEffect,
  useMemo,
//   useState,
} from 'react';

import MqttContext  from '../../contexts/MqttContext.js';

import OffColored   from '../../svg/sargam/OffColored.jsx';
import OnColored    from '../../svg/sargam/OnColored.jsx';
import OnOffUnknown from '../../svg/sargam/OnOffUnknown.jsx';

const refreshIntervals = {};

const Switch = props => {
  const {messagePower, topic} = props;
  const {mqttClient} = use(MqttContext);

  switch(messagePower) {
    case 'ON':
      return (
        <OnColored
          dark={true}
          onClick={async() => {
            await mqttClient.publishAsync(`tasmota/${topic}/cmnd/Power`, '0');
            // console.log(`Infrarotheizung(${topic}):off`);
            if(refreshIntervals[topic]) {
              // console.log(`Infrarotheizung(${topic}):off - clearInterval`);
              clearInterval(refreshIntervals[topic]);
              Reflect.deleteProperty(refreshIntervals, topic);
            }
          }}
        />
      );

    case 'OFF':
      return (
        <OffColored
          dark={true}
          onClick={async() => {
            await mqttClient.publishAsync(`tasmota/${topic}/cmnd/Power`, '1');
            // console.log(`Infrarotheizung(${topic}):on - setInterval`);
            refreshIntervals[topic] = setInterval(() => mqttClient.publishAsync(`tasmota/${topic}/cmnd/PulseTime`, ''),
              ms('1s'));
          }}
        />
      );

    default:
      return <OnOffUnknown dark={true} />;
  }
};

export default function Infrarotheizung(props) {
  const {site, style} = props;
  const {messages, mqttClient} = use(MqttContext);

  let topic;

  switch(site) {
    case 'Büro':
      topic = 'infrarotheizung-buero';
      break;

    case 'Schlafzimmer':
      topic = 'infrarotheizung-schlafzimmer';
      break;

    default:
      throw new Error(`Unhandled site='${site}'`);
  }

  const messagePower  = messages[`tasmota/${topic}/stat/POWER`];
  const messageResult = messages[`tasmota/${topic}/stat/RESULT`];
  const messageLWT    = messages[`tasmota/${topic}/tele/LWT`];

  // if(topic === 'infrarotheizung-buero') console.log({messagePower, messageResult});

  useEffect(() => {
    // console.log(`Infrarotheizung(${topic}):mount`);

    return () => {
      // console.log(`Infrarotheizung(${topic}):dismount`, {refreshIntervals});

      if(refreshIntervals[topic]) {
        // console.log(`Infrarotheizung(${topic}):dismount - clearInterval`);
        clearInterval(refreshIntervals[topic]);
        Reflect.deleteProperty(refreshIntervals, topic);
      }
    };
  }, [topic]);

  const pulseTime = useMemo(() => {
    if(messagePower === 'OFF') {
      return 0;
    }

    if(messageResult?.PulseTime) {
      const remaining = messageResult.PulseTime.Remaining[0];

      return remaining > 111 ? remaining - 100 : remaining;
    }
  }, [messagePower, messageResult]);

  useEffect(() => {
    if(messagePower === 'ON') {
      if(!refreshIntervals[topic]) {
        // console.log(`Infrarotheizung(${topic}):effect:on - setInterval`, {refreshIntervals});
        refreshIntervals[topic] = setInterval(() => mqttClient.publishAsync(`tasmota/${topic}/cmnd/PulseTime`, ''),
          ms('1s'));
      }
    } else {
      // console.log(`Infrarotheizung(${topic}):effect:off`, {refreshIntervals});
      if(refreshIntervals[topic]) {
        // console.log(`Infrarotheizung(${topic}):effect:off - clearInterval`);
        clearInterval(refreshIntervals[topic]);
        Reflect.deleteProperty(refreshIntervals, topic);
      }
    }
  }, [messagePower, mqttClient, topic]);

  if(messagePower) {
    // console.log(`Infrarotheizung(${topic})`, {messagePower});
  }

  // console.log(`Infrarotheizung(${topic})`, messages[`tasmota/${topic}/stat/RESULT`]);

  return (
    <table style={style}>
      <tbody>
        <tr>
          <td colSpan={2}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div
                style={{
                  display:        'flex',
                  flexDirection:  'column',
                  justifyContent: 'center',
                  padding:        '0 10px 10px 0',
                  textDecoration: messageLWT === 'Online' ? null : 'line-through',
                }}
              >
                Infrarotheizung
                <br />
                {site}
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div style={{width: '100px'}}>
                <Switch messagePower={messagePower} topic={topic} />
              </div>
            </div>
          </td>
        </tr>
        <tr>
          {pulseTime ?
            [
              <td key='row1'>Timeout:</td>,
              <td key='row2' style={{whiteSpace: 'nowrap'}}>{pulseTime}</td>,
            ] :
            <td>&nbsp;</td>}
        </tr>
      </tbody>
    </table>
  );
}
