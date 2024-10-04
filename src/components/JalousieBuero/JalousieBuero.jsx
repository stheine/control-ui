import React, {
  useContext,
} from 'react';

import MqttContext from '../../contexts/MqttContext.js';

import BlindDown   from '../../svg/sargam/BlindDown.jsx';
import BlindShade  from '../../svg/sargam/BlindShade.jsx';
import BlindUp     from '../../svg/sargam/BlindUp.jsx';
import StopCircle  from '../../svg/sargam/StopCircle.jsx';

export default function JalousieBuero() {
  // console.log('JalousieBuero');

  const {mqttClient} = useContext(MqttContext);

  // Power2 - Hoch
  // Power1 - Runter

  return (
    <table>
      <tbody>
        <tr>
          <th colSpan={2}>
            Büro
          </th>
        </tr>
        <tr>
          <td>
            <div style={{width: '100px'}}>
              <BlindUp dark={true} onClick={async() =>
                await mqttClient.publishAsync('tasmota/jalousieBuero/cmnd/Power2', '1')} />
            </div>
          </td>
          <td>
            <div style={{width: '100px'}}>
              <StopCircle
                dark={true}
                onClick={async() => {
                  await mqttClient.publishAsync('tasmota/jalousieBuero/cmnd/Power1', '0');
                  await mqttClient.publishAsync('tasmota/jalousieBuero/cmnd/Power2', '0');
                }}
              />
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div style={{width: '100px'}}>
              <BlindDown dark={true} onClick={async() =>
                await mqttClient.publishAsync('tasmota/jalousieBuero/cmnd/Power1', '1')} />
            </div>
          </td>
          <td>
            <div style={{width: '100px'}}>
              <BlindShade
                dark={true}
                onClick={async() => {
                  await mqttClient.publishAsync('tasmota/jalousieBuero/cmnd/PulseTime2', '1');
                  await mqttClient.publishAsync('tasmota/jalousieBuero/cmnd/Power2', '1');

                  setTimeout(async() => {
                    await mqttClient.publishAsync('tasmota/jalousieBuero/cmnd/PulseTime1', '220');
                    await mqttClient.publishAsync('tasmota/jalousieBuero/cmnd/PulseTime2', '220');
                  }, 500);
                }}
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
