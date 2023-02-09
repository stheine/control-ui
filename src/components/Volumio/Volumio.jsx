import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

import Decrease          from '../../svg/sargam/Decrease.jsx';
import Dlf               from '../../svg/Dlf.jsx';
import Increase          from '../../svg/sargam/Increase.jsx';
// import Pause             from '../../svg/sargam/Pause.jsx';
// import Play              from '../../svg/sargam/Play.jsx';
import PlayPause         from '../../svg/sargam/PlayPause.jsx';
// import Stop              from '../../svg/sargam/Stop.jsx';

const topic = 'volumio/stat/pushState';

export default function Volumio() {
  // console.log('Volumio');

  const [_message, setMessage] = useState();

  const mqttClient = useContext(MqttClientContext);

  useEffect(() => mqttSubscribe({mqttClient, topic, onMessage: ({message}) => setMessage(message)}),
    [mqttClient]);

  if(_message) {
    // console.log('Volumio', {_message});
  }

  return (
    <table>
      <tbody>
        <tr>
          <td colSpan={3}>{_message?.status} {_message?.title}</td>
        </tr>
        <tr>
          <td><Dlf dark={true} onClick={() => mqttClient.publish('volumio/cmnd/browseLibrary', '')} /></td>
          <td><Increase dark={true} onClick={() => mqttClient.publish('volumio/cmnd/volume', '"+"')} /></td>
        </tr>
        <tr>
          <td><PlayPause dark={true} onClick={() => mqttClient.publish('volumio/cmnd/playPause', '')} /></td>
          <td><Decrease dark={true} onClick={() => mqttClient.publish('volumio/cmnd/volume', '"-"')} /></td>
        </tr>
      </tbody>
    </table>
  );
}
