import React, {
  useContext,
//   useEffect,
//   useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
// import mqttSubscribe     from '../../lib/mqttSubscribe.js';

import BlindDown         from '../../svg/sargam/BlindDown.jsx';
import BlindShade        from '../../svg/sargam/BlindShade.jsx';
import BlindUp           from '../../svg/sargam/BlindUp.jsx';
import StopCircle        from '../../svg/sargam/StopCircle.jsx';

// const topic = 'volumio/stat/pushState';

export default function Jalousie() {
  // console.log('Jalousie');

//  const [_message, setMessage] = useState();

  const mqttClient = useContext(MqttClientContext);

//  useEffect(() => mqttSubscribe({mqttClient, topic, onMessage: ({message}) => setMessage(message)}),
//    [mqttClient]);

//  if(_message) {
    // console.log('Jalousie', {_message});
//  }

  // Power2 - Hoch
  // Power1 - Runter

  return (
    <table style={{heigth: '100px'}}>
      <tbody>
        <tr>
          <td>
            <div style={{width: '100px'}}>
              <BlindUp dark={true} onClick={() => mqttClient.publish('tasmota/jalousieBuero/cmnd/Power2', '1')} />
            </div>
          </td>
          <td>
            <div style={{width: '100px'}}>
              <StopCircle
                dark={true}
                onClick={() => {
                  mqttClient.publish('tasmota/jalousieBuero/cmnd/Power1', '0');
                  mqttClient.publish('tasmota/jalousieBuero/cmnd/Power2', '0');
                }}
              />
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div style={{width: '100px'}}>
              <BlindDown dark={true} onClick={() => mqttClient.publish('tasmota/jalousieBuero/cmnd/Power1', '1')} />
            </div>
          </td>
          <td>
            <div style={{width: '100px'}}>
              <BlindShade
                dark={true}
                onClick={() => {
                  mqttClient.publish('tasmota/jalousieBuero/cmnd/Power2', '1');

                  setTimeout(() => mqttClient.publish('tasmota/jalousieBuero/cmnd/Power2', '0'), 650);
                }}
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
