import _ from 'lodash';
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
  const temperatur       = _message?.current.temp       === undefined ? 99 : _message.current.temp;
  const gefuehlt         = _message?.current.feels_like === undefined ? 99 : _message.current.feels_like;
  const bewoelkung       = _message?.current.clouds     === undefined ? 99 : _message.current.clouds;
  const luftfeuchtigkeit = _message?.current.humidity   === undefined ? 99 : _message.current.humidity;
  const warnungEvent     = _message ? _message?.alerts?.[0].event : 'none';
  // const warnungDesc      = _message?.alerts?.[0].description || '';
  // TODO Vorhersage

  const nacht = function() {
    return [
      <tr key='nightLabel'>
        <td colSpan={2} className='wetter__label'>Nacht</td>
      </tr>,
      <tr key='nightTemp'>
        <td>Temperatur:</td>
        <td className='wetter__value'>
          {_.round(_message?.nightMinTemp)}&deg; - {_.round(_message?.nightMaxTemp)}&deg;
        </td>
      </tr>,
      <tr key='nightWind'>
        <td>Max Wind:</td>
        <td className='wetter__value'>
          {_.round(_message?.nightMaxWind || 0 * 3.6)}&nbsp;<font className='wetter__value__unit'>km/h</font>
        </td>
      </tr>,
    ];
  };

  const tag = function() {
    return [
      <tr key='dayLabel'>
        <td colSpan={2} className='wetter__label'>Tag</td>
      </tr>,
      <tr key='dayTemp'>
        <td>Temperatur:</td>
        <td className='wetter__value'>
          {_.round(_message?.dayMinTemp)}&deg; - {_.round(_message?.dayMaxTemp)}&deg;
        </td>
      </tr>,
      <tr key='dayWind'>
        <td>Max Wind:</td>
        <td className='wetter__value'>
          {_.round(_message?.dayMaxWind || 0 * 3.6)}&nbsp;<font className='wetter__value__unit'>km/h</font>
        </td>
      </tr>,
    ];
  };

  return (
    <table className='wetter'>
      <tbody>
        <tr>
          <td colSpan={2}>{wetter}</td>
        </tr>
        <tr>
          <td>Bewölkung:</td>
          <td className='wetter__value'>{bewoelkung}&nbsp;<font className='wetter__value__unit'>%</font></td>
        </tr>
        <tr>
          <td>Temperatur:</td>
          <td className='wetter__value'>{temperatur}&deg;</td>
        </tr>
        <tr>
          <td>Gefühlt:</td>
          <td className='wetter__value'>{gefuehlt}&deg;</td>
        </tr>
        <tr>
          <td>Luftfeuchtigkeit:</td>
          <td className='wetter__value'>{luftfeuchtigkeit}&nbsp;<font className='wetter__value__unit'>%</font></td>
        </tr>
        {warnungEvent ?
          <tr>
            <td colSpan={2} className='wetter__warning'>{warnungEvent}</td>
          </tr> :
          null}
        {new Date().getHours() < 20 ?
          [...tag(), ...nacht()] :
          [...nacht(), ...tag()]}
      </tbody>
    </table>
  );
}
