import _ from 'lodash';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

import Alert             from '../../svg/sargam/Alert.jsx';

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

  const {eveningStartsHour} = _message || {};
  const wetter              = _message?.current.weather[0].description || '';
  const temperatur          = _message?.current.temp       === undefined ? 99 : _message.current.temp;
  const gefuehlt            = _message?.current.feels_like === undefined ? 99 : _message.current.feels_like;
  const bewoelkung          = _message?.current.clouds     === undefined ? 99 : _message.current.clouds;
  const luftfeuchtigkeit    = _message?.current.humidity   === undefined ? 99 : _message.current.humidity;
  const alerts              = _message ? _message?.alerts || [] : [{event: 'none'}];
  // TODO Vorhersage

  if(alerts.length > 1) {
    // console.log({alerts});
  }

  const renderNight = function() {
    return [
      <tr key='nightLabel'>
        <td colSpan={2} className='wetter__label'>Nacht</td>
      </tr>,
      <tr key='nightTemp'>
        <td>Temperatur:</td>
        <td>
          <font className='wetter__value'>
            {_.round(_message?.nightMinTemp)}
            <font className='wetter__value__unit'>&deg;C</font>
          </font>
          &nbsp;-&nbsp;
          <font className='wetter__value'>
            {_.round(_message?.nightMaxTemp)}
            <font className='wetter__value__unit'>&deg;C</font>
          </font>
        </td>
      </tr>,
      <tr key='nightWind'>
        <td>Max Wind:</td>
        <td className='wetter__value'>
          {_.round(_message?.nightMaxWind || 0 * 3.6)}
          <font className='wetter__value__unit'>km/h</font>
        </td>
      </tr>,
    ];
  };

  const renderDay = function() {
    return [
      <tr key='dayLabel'>
        <td colSpan={2} className='wetter__label'>Tag</td>
      </tr>,
      <tr key='dayTemp'>
        <td>Temperatur:</td>
        <td>
          <font className='wetter__value'>
            {_.round(_message?.dayMinTemp)}
            <font className='wetter__value__unit'>&deg;C</font>
          </font>
          &nbsp;-&nbsp;
          <font className='wetter__value'>
            {_.round(_message?.dayMaxTemp)}
            <font className='wetter__value__unit'>&deg;C</font>
          </font>
        </td>
      </tr>,
      <tr key='dayWind'>
        <td>Max Wind:</td>
        <td className='wetter__value'>
          {_.round(_message?.dayMaxWind || 0 * 3.6)}<font className='wetter__value__unit'>km/h</font>
        </td>
      </tr>,
    ];
  };

  const renderCurrent = function() {
    return [
      <tr key='wetter'>
        <td colSpan={2}>{wetter}</td>
      </tr>,
      <tr key='bewoelkung'>
        <td>Bewölkung:</td>
        <td className='wetter__value'>{bewoelkung}<font className='wetter__value__unit'>%</font></td>
      </tr>,
      <tr key='temperatur'>
        <td>Temperatur:</td>
        <td className='wetter__value'>
          {_.round(temperatur, 1)}
          <font className='wetter__value__unit'>&deg;C</font>
        </td>
      </tr>,
      <tr key='gefuehlt'>
        <td>Gefühlt:</td>
        <td className='wetter__value'>
          {_.round(gefuehlt, 1)}
          <font className='wetter__value__unit'>&deg;C</font>
        </td>
      </tr>,
      <tr key='luftfeuchtigkeit'>
        <td>Luftfeuchtigkeit:</td>
        <td className='wetter__value'>{luftfeuchtigkeit}<font className='wetter__value__unit'>%</font></td>
      </tr>,
    ];
  };

  return (
    <div className='wetter'>
      <table>
        <tbody>
          <tr>
            <td>
              <table>
                <tbody>
                  <tr>
                    <td className='wetter__label'>Aktuell</td>
                  </tr>
                  {renderCurrent()}
                </tbody>
              </table>
            </td>
            <td>
              <table>
                <tbody>
                  {new Date().getHours() < eveningStartsHour ?
                    [...renderDay(), ...renderNight()] :
                    [...renderNight(), ...renderDay()]}
                </tbody>
              </table>
            </td>
          </tr>
          {alerts.length ?
            <tr key='warnung'>
              <td colSpan={2} className='wetter__warning'>
                <div className='wetter__warning__text'>
                  {alerts[0].event}
                  {alerts.length > 1 ? ` (${alerts.length})` : null}
                </div>
                <div className='wetter__warning__icon'>
                  <Alert
                    dark={true}
                    onClick={() => mqttClient.publish(`control-ui/cmnd/dialog`, JSON.stringify({
                      header: 'Wetter Warnung',
                      data:   alerts.flatMap(alert => [alert.event, alert.description]),
                    }))}
                  />
                </div>
              </td>
            </tr> :
            null}
        </tbody>
      </table>
    </div>
  );
}
