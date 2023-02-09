import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

const topic = 'wetter/INFO';

export default function Wetter() {
  // console.log('Wetter');

  const [_message, setMessage] = useState();

  const mqttClient = useContext(MqttClientContext);

  useEffect(() => mqttSubscribe({mqttClient, topic, onMessage: ({message}) => setMessage(message)}),
    [mqttClient]);

  if(_message) {
    // console.log('Wetter', {_message});
  }

  const wetter           = _message?.current.weather[0].description || '';
  const temperatur       = _message?.current.temp || 99;
  const gefuehlt         = _message?.current.feels_like || 99;
  const bewoelkung       = _message?.current.clouds || 99;
  const luftfeuchtigkeit = _message?.current.humidity || 0;
  const warnungEvent     = _message?.alerts?.[0].event || '';
  // const warnungDesc      = _message?.alerts?.[0].description || '';
  // TODO Vorhersage

  return (
    <table style={{padding: '0 30px 0 0'}}>
      <tbody>
        <tr>
          <td colSpan={2} style={{whiteSpace: 'nowrap'}}>{wetter}</td>
        </tr>
        <tr>
          <td>Bewölkung:</td>
          <td style={{whiteSpace: 'nowrap'}}>{bewoelkung} %</td>
        </tr>
        <tr>
          <td>Temperatur:</td>
          <td style={{whiteSpace: 'nowrap'}}>{temperatur} °C</td>
        </tr>
        <tr>
          <td>Gefühlt:</td>
          <td style={{whiteSpace: 'nowrap'}}>{gefuehlt} °C</td>
        </tr>
        <tr>
          <td>Luftfeuchtigkeit:</td>
          <td style={{whiteSpace: 'nowrap'}}>{luftfeuchtigkeit} %rH</td>
        </tr>
        {warnungEvent ?
          <tr>
            <td colSpan={2} style={{backgroundColor: '#ff0000'}}>{warnungEvent}</td>
          </tr> :
          null}
      </tbody>
    </table>
  );
}
//        <tr>
//          <td>Wechselrichter:</td>
//          <td style={{whiteSpace: 'nowrap'}}>{`${_.round(wechselrichterErzeugung / 1000, 1)} kW`}</td>
//        </tr>
