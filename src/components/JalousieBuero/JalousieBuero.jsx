import React, {
  useContext,
} from 'react';

import MqttContext from '../../contexts/MqttContext.js';

import BlindDown   from '../../svg/sargam/BlindDown.jsx';
import BlindUp     from '../../svg/sargam/BlindUp.jsx';
import Down        from '../../svg/sargam/Down.jsx';
import StopCircle  from '../../svg/sargam/StopCircle.jsx';
import Up          from '../../svg/sargam/Up.jsx';

export default function JalousieBuero() {
  // console.log('JalousieBuero');

  const {mqttClient} = useContext(MqttContext);

  // Power2 - Hoch
  // Power1 - Runter

  return (
    <table>
      <tbody>
        <tr>
          <th colSpan={3}>
            Büro
          </th>
        </tr>
        <tr>
          <td>
            <div style={{width: '100px'}}>
              <BlindUp
                dark={true}
                onClick={async() => await mqttClient.publishAsync('tasmota/jalousieBuero/cmnd/Power2', '1')}
              />
            </div>
          </td>
          <td colSpan={2}>
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
              <BlindDown
                dark={true}
                onClick={async() => await mqttClient.publishAsync('tasmota/jalousieBuero/cmnd/Power1', '1')}
              />
            </div>
          </td>
          <td>
            <div style={{width: '90px'}}>
              <Up
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
          <td>
            <div style={{width: '90px'}}>
              <Down
                dark={true}
                onClick={async() => {
                  await mqttClient.publishAsync('tasmota/jalousieBuero/cmnd/PulseTime1', '1');
                  await mqttClient.publishAsync('tasmota/jalousieBuero/cmnd/Power1', '1');

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
