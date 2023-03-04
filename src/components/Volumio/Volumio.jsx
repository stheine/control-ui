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
    <table className='volumio'>
      <tbody>
        <tr>
          <td className='volumio__control'>
            <Dlf dark={true} onClick={() => mqttClient.publish('volumio/cmnd/DLF', '')} />
          </td>
          <td rowSpan={3} className='volumio__title'>
            <div><span>{_message?.artist ? `${_message.artist} - ` : null}{_message?.title}</span></div>
          </td>
          <td rowSpan={3} className='volumio__volume'>
            <div>
              <Increase dark={true} onClick={() => mqttClient.publish('volumio/cmnd/volume', '"+"')} />
              <span>{_message?.volume}</span>
              <Decrease dark={true} onClick={() => mqttClient.publish('volumio/cmnd/volume', '"-"')} />
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <PlayPause dark={true} onClick={() => mqttClient.publish('volumio/cmnd/playPause', '')} />
          </td>
        </tr>
        <tr>
          <td className='volumio__status'>{_message?.status}</td>
        </tr>
      </tbody>
    </table>
  );
}
