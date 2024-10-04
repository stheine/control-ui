/* eslint-disable arrow-body-style */
/* eslint-disable no-lonely-if */

import ms from 'ms';
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttContext  from '../../contexts/MqttContext.js';

import OffColored   from '../../svg/sargam/OffColored.jsx';
import OnColored    from '../../svg/sargam/OnColored.jsx';
import OnOffUnknown from '../../svg/sargam/OnOffUnknown.jsx';

export default function Infrarotheizung(props) {
  const {site, style} = props;
  const {messages, mqttClient} = useContext(MqttContext);

  const [_pulseTime, setPulseTime] = useState();
  const [_pulseTimeInterval, setPulseTimeInterval] = useState();

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

  const pulseTimeIntervalFunction = useCallback(async() => {
    // console.log('trigger PulseTime');
    await mqttClient.publishAsync(`tasmota/${topic}/cmnd/PulseTime`, '');
  }, [mqttClient, topic]);

  useEffect(() => {
    // console.log('Infrarotheizung:mount');

    return () => {
      // console.log('Infrarotheizung:dismount');

      if(_pulseTimeInterval) {
        // console.log('Infrarotheizung:dismount - clearInterval');
        clearInterval(_pulseTimeInterval);
      }
    };
  }, [_pulseTimeInterval]);

  useEffect(() => {
    if(messageResult?.PulseTime) {
      const remaining = messageResult.PulseTime.Remaining[0];

      setPulseTime(remaining > 111 ? remaining - 100 : remaining);
    }
  }, [messageResult]);

  useEffect(() => {
    if(messagePower === 'OFF') {
      setPulseTime(0);
    }
  }, [messagePower]);

  useEffect(() => {
    if(messagePower === 'ON') {
      if(!_pulseTimeInterval) {
        setPulseTimeInterval(setInterval(pulseTimeIntervalFunction, ms('1s')));
      }
    } else {
      if(_pulseTimeInterval) {
        clearInterval(_pulseTimeInterval);
        setPulseTimeInterval();
      }
    }
  }, [messagePower, _pulseTimeInterval, pulseTimeIntervalFunction]);

  if(messagePower) {
    // console.log('Infrarotheizung', {messagePower});
  }

  // console.log('Infrarotheizung', messages[`tasmota/${topic}/stat/RESULT`]);

  const Switch = function() {
    switch(messagePower) {
      case 'ON':
        return (
          <OnColored
            dark={true}
            onClick={async() => {
              await mqttClient.publishAsync(`tasmota/${topic}/cmnd/Power`, '0');
              if(_pulseTimeInterval) {
                clearInterval(_pulseTimeInterval);
                setPulseTimeInterval();
                setPulseTime();
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
              await mqttClient.publishAsync(`tasmota/${topic}/cmnd/PulseTime`, '');
              setPulseTimeInterval(setInterval(pulseTimeIntervalFunction, ms('1s')));
            }}
          />
        );

      default:
        return <OnOffUnknown dark={true} />;
    }
  };

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
                <Switch />
              </div>
            </div>
          </td>
        </tr>
        <tr>
          {_pulseTime ?
            [
              <td key='row1'>Timeout:</td>,
              <td key='row2' style={{whiteSpace: 'nowrap'}}>{_pulseTime}</td>,
            ] :
            <td>&nbsp;</td>}
        </tr>
      </tbody>
    </table>
  );
}
