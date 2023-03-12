import React, {
  useContext,
} from 'react';

// import mqttConfig  from './mqttConfig.js';
import MqttContext from '../../contexts/MqttContext.js';

import Moon        from '../../svg/sargam/Moon.jsx';
import ScreenOff   from '../../svg/sargam/ScreenOff.jsx';
import Sun         from '../../svg/sargam/Sun.jsx';

const Display = function() {
  const {messages, mqttClient} = useContext(MqttContext);

  // console.log('Display', _messages);

  const state = messages['control-io/display/STATE'];

  return (
    <table style={{padding: '0 30px 0 0'}}>
      <tbody>
        <tr>
          <td style={{fontSize: 50}}>{messages['control-io/brightness/STATE'] || 999}</td>
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
