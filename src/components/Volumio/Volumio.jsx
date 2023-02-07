import _                 from 'lodash';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

import Decrease              from '../../svg/sargam/Decrease.jsx';
import Dlf               from '../../svg/Dlf.jsx';
import Increase              from '../../svg/sargam/Increase.jsx';
import Pause         from '../../svg/sargam/Pause.jsx';
import Play         from '../../svg/sargam/Play.jsx';
import PlayPause         from '../../svg/sargam/PlayPause.jsx';
import Stop         from '../../svg/sargam/Stop.jsx';

const topic = 'Fronius/solar/tele/SENSOR';

export default function Solar() {
  // console.log('Solar');

  const [_message, setMessage] = useState();

  const mqttClient = useContext(MqttClientContext);

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    // console.log('Solar:useEffect, mqttClient');

    return mqttSubscribe({mqttClient, topic, setMessage});
  }, [mqttClient]);

  return (
    <table>
      <tbody>
        <tr>
          <td><Dlf dark={true} onClick={() => console.log('DLF')} /></td>
          <td><Increase dark={true} onClick={() => mqttClient.publish('volumio/cmnd/volume', '"+"')} /></td>
          <td><Play dark={true} onClick={() => mqttClient.publish('volumio/cmnd/play', '')} /></td>
        </tr>
        <tr>
          <td><Pause dark={true} onClick={() => mqttClient.publish('volumio/cmnd/pause', '')} /></td>
          <td><PlayPause dark={true} onClick={() => mqttClient.publish('volumio/cmnd/playPause', '')} /></td>
          <td><Decrease dark={true} onClick={() => mqttClient.publish('volumio/cmnd/volume', '"-"')} /></td>
        </tr>
        <tr>
          <td><Play dark={true} onClick={() => mqttClient.publish('volumio/cmnd/play', '')} /></td>
          <td><Stop dark={true} onClick={() => mqttClient.publish('volumio/cmnd/stop', '')} /></td>
        </tr>
      </tbody>
    </table>
  );
}
