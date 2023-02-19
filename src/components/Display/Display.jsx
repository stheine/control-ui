/* eslint-disable object-property-newline */

import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

import Moon              from '../../svg/sargam/Moon.jsx';
import ScreenOff         from '../../svg/sargam/ScreenOff.jsx';
import Sun               from '../../svg/sargam/Sun.jsx';

const topics = [
  `control-io/brightness/STATE`,
  `control-io/display/STATE`,
];

const Display = function() {
  const mqttClient = useContext(MqttClientContext);

  const [_messages, setMessages] = useState({});

  useEffect(() => mqttSubscribe({mqttClient, topics, onMessage: ({topic, message}) =>
    setMessages(prevMessages => ({...prevMessages, [topic]: message}))}), [mqttClient]);

  // console.log('Display', _messages);

  const state = _messages['control-io/display/STATE'];

  return (
    <table style={{padding: '0 30px 0 0'}}>
      <tbody>
        <tr>
          <td style={{fontSize: 50}}>{_messages['control-io/brightness/STATE'] || 999}</td>
          <td><Sun dark={true} onClick={() => mqttClient.publish(`control-io/cmnd/brightness`, '"-"')} /></td>
        </tr>
        <tr>
          <td style={{width: '50%'}}>
            <ScreenOff
              dark={true}
              onClick={() => {
                mqttClient.publish(`control-io/cmnd/display`, state ? '0' : '1');
                mqttClient.publish(`control-ui/cmnd/route`, '"/1"');
              }}
            />
          </td>
          <td><Moon dark={true} onClick={() => mqttClient.publish(`control-io/cmnd/brightness`, '"+"')} /></td>
        </tr>
      </tbody>
    </table>
  );
};

export default Display;
