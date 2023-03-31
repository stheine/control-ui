import React, {
  useContext,
} from 'react';

import MqttContext from '../../contexts/MqttContext.js';

import BlindDown   from '../../svg/sargam/BlindDown.jsx';
import BlindShade  from '../../svg/sargam/BlindShade.jsx';
import BlindUp     from '../../svg/sargam/BlindUp.jsx';
import StopCircle  from '../../svg/sargam/StopCircle.jsx';

export default function JalousieWohnen() {
  // console.log('JalousieWohnen');

  const date = new Date();

  date.setHours('08');
  date.setMinutes('00');
  date.setSeconds('00');

  console.log({date});

  const {mqttClient} = useContext(MqttContext);

  // Power2 - Hoch
  // Power1 - Runter

  return (
    <table>
      <tbody>
        <tr>
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
      </tbody>
    </table>
  );
}
