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

  const pulseTimeIntervalFunction = useCallback(() => {
    // console.log('trigger PulseTime');
    mqttClient.publish(`tasmota/${topic}/cmnd/PulseTime`, '');
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
      setPulseTime(messageResult.PulseTime.Remaining[0] - 100);
    }
  }, [messageResult]);

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

  const power = messagePower;

  const PermitJoin = function() {
    switch(power) {
      case 'ON':
        return (
          <OnColored
            dark={true}
            onClick={() => {
              mqttClient.publish(`tasmota/${topic}/cmnd/Power`, '0');
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
            onClick={() => {
              mqttClient.publish(`tasmota/${topic}/cmnd/Power`, '1');
              mqttClient.publish(`tasmota/${topic}/cmnd/PulseTime`, '');
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
                style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10px 10px 0'}}
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
                <PermitJoin />
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
