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

export default function Internet(props) {
  const {messages, mqttClient} = useContext(MqttContext);

  const [_pulseTime, setPulseTime] = useState();
  const [_pulseTimeInterval, setPulseTimeInterval] = useState();

  const message = messages['dns/failed'];
  const ok = !message;

  return (
    <table className='internet'>
      <tbody>
        <tr>
          <td>
            <div className='header'>
              Internet
            </div>
          </td>
        </tr>
        <tr>
          <td className='content'>
            <div className={`content__value ${ok ? 'ok' : 'failed'}`}>
              {ok ? 'OK' : message}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
