import _ from 'lodash';
import React, {
  useContext,
} from 'react';

import AppContext  from '../../contexts/AppContext.js';
// import mqttConfig  from './mqttConfig.js';
import MqttContext from '../../contexts/MqttContext.js';

import Alert       from '../../svg/sargam/Alert.jsx';

// https://tc39.es/ecma402/#table-datetimeformat-components
const dateTimeFormat = {
  weekday: 'short',
  day:     'numeric',
  month:   'short',
  hour:    'numeric',
  minute:  'numeric',
};

const renderWarningTime = function(warning) {
  const start = new Date(warning.start);
  const end   = new Date(warning.end);

  // return `${start.toLocaleString('de-DE', {dateStyle: 'short', timeStyle: 'short'})} - ${end.toLocaleString()}`;
  return `${start.toLocaleString('de-DE', dateTimeFormat)} - ${end.toLocaleString('de-DE', dateTimeFormat)}`;
};

const renderWarningTitle = function(warning) {
  return _.map(_.toLower(warning.event).split(' '), word => _.upperFirst(word)).join(' ');
};

export default function Wetter() {
  const {clientId} = useContext(AppContext);
  const {messages, mqttClient} = useContext(MqttContext);

  const messageDwd = messages['wetter/dwd/INFO'];
  const messageOw  = messages['wetter/openweather/INFO'];

  if(messageDwd && messageOw) {
    // console.log('Wetter', {messageDwd, messageOw});
  }

  const {eveningStartsHour} = messageOw || {};
  const wetter              = messageOw?.current.weather[0].description || '';
  const temperatur          = messageOw?.current.temp       === undefined ? 99 : messageOw.current.temp;
  const gefuehlt            = messageOw?.current.feels_like === undefined ? 99 : messageOw.current.feels_like;
  const bewoelkung          = messageOw?.current.clouds     === undefined ? 99 : messageOw.current.clouds;
  const luftfeuchtigkeit    = messageOw?.current.humidity   === undefined ? 99 : messageOw.current.humidity;
  const warnungen           = messageDwd ? messageDwd?.forecast.warnings || [] : [{event: 'none'}];

  // TODO Vorhersage

  const renderNight = function() {
    return [
      <tr key='nightLabel'>
        <td colSpan={2} className='wetter__label'>Nacht</td>
      </tr>,
      <tr key='nightTemp'>
        <td>Temperatur:</td>
        <td>
          <font className='wetter__value'>
            {_.round(messageOw?.nightMinTemp)}
            <font className='wetter__value__unit'>&deg;C</font>
          </font>
          &nbsp;-&nbsp;
          <font className='wetter__value'>
            {_.round(messageOw?.nightMaxTemp)}
            <font className='wetter__value__unit'>&deg;C</font>
          </font>
        </td>
      </tr>,
      <tr key='nightWind'>
        <td>Max Wind:</td>
        <td className='wetter__value'>
          {_.round(messageOw?.nightMaxWind || 0 * 3.6)}
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
            {_.round(messageOw?.dayMinTemp)}
            <font className='wetter__value__unit'>&deg;C</font>
          </font>
          &nbsp;-&nbsp;
          <font className='wetter__value'>
            {_.round(messageOw?.dayMaxTemp)}
            <font className='wetter__value__unit'>&deg;C</font>
          </font>
        </td>
      </tr>,
      <tr key='dayWind'>
        <td>Max Wind:</td>
        <td className='wetter__value'>
          {_.round(messageOw?.dayMaxWind || 0 * 3.6)}<font className='wetter__value__unit'>km/h</font>
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

  const displayWarningDialog = function() {
    mqttClient.publish(`control-ui/cmnd/dialog`, JSON.stringify({
      clientId,
      header:   'Wetter Warnung',
      data:     warnungen.flatMap(warnung => [
        warnung.event,
        renderWarningTime(warnung),
        warnung.description,
      ]),
    }));
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
          {warnungen.length ?
            <tr key='warnung'>
              <td colSpan={2} className='wetter__warning'>
                <div
                  className='wetter__warning__text'
                  onClick={() => displayWarningDialog()}
                >
                  {_.map(warnungen, warnung => renderWarningTitle(warnung)).join(', ')}
                </div>
                <div className='wetter__warning__icon'>
                  <Alert
                    dark={true}
                    onClick={() => displayWarningDialog()}
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

// OpenWeather alerts
//  const alerts              = messageOw ? messageOw?.alerts || [] : [{event: 'none'}];
//  if(alerts.length > 1) {
//    // console.log({alerts});
//  }
//          {alerts.length ?
//            <tr key='warnung'>
//              <td colSpan={2} className='wetter__warning'>
//                <div className='wetter__warning__text'>
//                  {alerts[0].event}
//                  {alerts.length > 1 ? ` (${alerts.length})` : null}
//                </div>
//                <div className='wetter__warning__icon'>
//                  <Alert
//                    dark={true}
//                    onClick={() => mqttClient.publish(`control-ui/cmnd/dialog`, JSON.stringify({
//                      clientId,
//                      header:   'Wetter Warnung',
//                      data:     alerts.flatMap(alert => [alert.event, alert.description]),
//                    }))}
//                  />
//                </div>
//              </td>
//            </tr> :
//            null}
