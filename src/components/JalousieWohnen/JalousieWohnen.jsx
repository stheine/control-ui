import _ from 'lodash';
import React, {
  useContext,
} from 'react';

import mqttConfig  from './mqttConfig.js';
import MqttContext from '../../contexts/MqttContext.js';

import BlindDown   from '../../svg/sargam/BlindDown.jsx';
import BlindShade  from '../../svg/sargam/BlindShade.jsx';
import BlindUp     from '../../svg/sargam/BlindUp.jsx';
import StopCircle  from '../../svg/sargam/StopCircle.jsx';

// https://tc39.es/ecma402/#table-datetimeformat-components
const dateTimeFormat = {
  // weekday: 'short',
  // day:     'numeric',
  // month:   'short',
  hour:    'numeric',
  minute:  'numeric',
};

export default function JalousieWohnen() {
  // console.log('JalousieWohnen');

  const date = new Date();

  date.setHours('08');
  date.setMinutes('00');
  date.setSeconds('00');

  // console.log({date});

  const {messages, mqttClient} = useContext(MqttContext);

  const siteConfig = _.first(mqttConfig);

  const message = messages[siteConfig.topic];

  if(message) {
    // console.log('JalousieWohnen', {message});
  }

  const downTime = new Date(message?.nightDownTime);

  return (
    <table>
      <tbody>
        <tr style={{fontSize: '200%'}}>
          <th colSpan={2}>
            Wohnzimmer
          </th>
        </tr>
        <tr>
          <td>
            <div style={{width: '100px'}}>
              <BlindUp dark={true} onClick={() => mqttClient.publish('Jalousie/cmnd/full_up', '')} />
            </div>
          </td>
          <td>
            <div style={{width: '100px'}}>
              <StopCircle
                dark={true}
                onClick={() => mqttClient.publish('Jalousie/cmnd/stop', '')}
              />
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div style={{width: '100px'}}>
              <BlindDown dark={true} onClick={() => mqttClient.publish('Jalousie/cmnd/full_down', '')} />
            </div>
          </td>
          <td>
            <div style={{width: '100px'}}>
              <BlindShade
                dark={true}
                onClick={() => {
                  mqttClient.publish('Jalousie/cmnd/turn', '');
                  // Jalousie/cmnd/shadow
                }}
              />
            </div>
          </td>
        </tr>
        <tr style={{fontSize: '200%'}}>
          <td style={{paddingLeft: '20px'}}>Runter:</td>
          <td style={{paddingLeft: '30px'}}>{downTime.toLocaleString('de-DE', dateTimeFormat)}</td>
        </tr>
      </tbody>
    </table>
  );
}
