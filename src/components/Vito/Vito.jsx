import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

const topic = 'vito/tele/SENSOR';

export default function Vito() {
  // console.log('Vito');

  const [_message, setMessage] = useState();

  const mqttClient = useContext(MqttClientContext);

  useEffect(() => mqttSubscribe({mqttClient, topic, onMessage: ({message}) => setMessage(message)}),
    [mqttClient]);

  // console.log('Vito', {_message});

  const heizkreisPumpe = _message?.heizkreisPumpe || 0;
  const kesselLeistung = _message?.kesselLeistung || 0;
  const sparbetrieb = _message?.hk1BetriebsartSpar || 0;
  const zirkulationsPumpe = _message?.zirkulationsPumpe || 0;

  return (
    <table style={{padding: '0 30px 0 0'}}>
      <tbody>
        <tr>
          <td>Heizkreispumpe:</td>
          <td style={{whiteSpace: 'nowrap'}}>{`${heizkreisPumpe}`}</td>
        </tr>
        <tr>
          <td>kesselLeistung:</td>
          <td style={{whiteSpace: 'nowrap'}}>{`${kesselLeistung}`}</td>
        </tr>
        <tr>
          <td>sparbetrieb:</td>
          <td style={{whiteSpace: 'nowrap'}}>{`${sparbetrieb}`}</td>
        </tr>
        <tr>
          <td>zirkulationsPumpe:</td>
          <td style={{whiteSpace: 'nowrap'}}>{`${zirkulationsPumpe}`}</td>
        </tr>
      </tbody>
    </table>
  );
}
