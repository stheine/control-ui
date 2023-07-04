// import _ from 'lodash';
import React, {
  useContext,
} from 'react';

import MqttContext from '../../contexts/MqttContext.js';

import BlindDown   from '../../svg/sargam/BlindDown.jsx';
import BlindShade  from '../../svg/sargam/BlindShade.jsx';
import BlindUp     from '../../svg/sargam/BlindUp.jsx';
import Close       from '../../svg/sargam/Close.jsx';
import Next        from '../../svg/sargam/Next.jsx';
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

  const messageStatus = messages['JalousieBackend/tele/STATUS'];
  const messageTimes  = messages['JalousieBackend/tele/TIMES'];

  if(messageStatus || messageTimes) {
    // console.log('JalousieWohnen', {messageStatus, messageTimes});
  }

  const downTime = new Date(messageTimes?.nightDownTime);

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
            <div style={{width: '90px'}}>
              <BlindUp dark={true} onClick={() => mqttClient.publish('Jalousie/cmnd/full_up', '')} />
            </div>
          </td>
          <td>
            <div style={{width: '90px'}}>
              <StopCircle
                dark={true}
                onClick={() => mqttClient.publish('Jalousie/cmnd/stop', '')}
              />
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div style={{width: '90px'}}>
              <BlindDown dark={true} onClick={() => mqttClient.publish('Jalousie/cmnd/full_down', '')} />
            </div>
          </td>
          <td>
            <div style={{width: '90px'}}>
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
          <td>
            <div style={{padding: '0 0 10px 10px'}}>
              Runter:
            </div>
          </td>
          <td style={{paddingLeft: '30px'}}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div
                style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10px 10px 0'}}
              >
                {downTime.toLocaleString('de-DE', dateTimeFormat)}
              </div>
              <div style={{width: '40px'}}>
                {messageStatus?.skipNext ?
                  <Next
                    dark={true}
                    onClick={() => {
                      mqttClient.publish('JalousieBackend/cmnd', JSON.stringify({skipNext: false}));
                    }}
                  /> :
                  <Close
                    dark={true}
                    onClick={() => {
                      mqttClient.publish('JalousieBackend/cmnd', JSON.stringify({skipNext: true}));
                    }}
                  />}
              </div>
            </div>

          </td>
        </tr>
      </tbody>
    </table>
  );
}
