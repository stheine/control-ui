import _ from 'lodash';
import React, {
  useContext,
} from 'react';

import AppContext  from '../../contexts/AppContext.js';
// import mqttConfig  from './mqttConfig.js';
import MqttContext from '../../contexts/MqttContext.js';

import Alert       from '../../svg/sargam/Alert.jsx';
import Value       from '../Value/Value.jsx';

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
        <Value value={_.round(messageOw?.nightMinTemp)} unit={<>&deg;C</>} />
        <td>&nbsp;-&nbsp;</td>
        <Value value={_.round(messageOw?.nightMaxTemp)} unit={<>&deg;C</>} />
      </tr>,
      <tr key='nightWind'>
        <td>Max Wind:</td>
        <Value value={_.round(messageOw?.nightMaxWind || 0 * 3.6)} unit='km/h' />
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
        <Value value={_.round(messageOw?.dayMinTemp)} unit={<>&deg;C</>} />
        <td>&nbsp;-&nbsp;</td>
        <Value value={_.round(messageOw?.dayMaxTemp)} unit={<>&deg;C</>} />
      </tr>,
      <tr key='dayWind'>
        <td>Max Wind:</td>
        <Value value={_.round(messageOw?.dayMaxWind || 0 * 3.6)} unit='km/h' />
      </tr>,
    ];
  };

  const renderCurrent = function() {
    return [
      <tr key='wetter'>
        <td>Wetter:</td>
        <Value value={wetter} />
      </tr>,
      <tr key='bewoelkung'>
        <td>Bewölkung:</td>
        <Value value={bewoelkung} unit='%' />
      </tr>,
      <tr key='temperatur'>
        <td>Temperatur:</td>
        <Value value={_.round(temperatur, 1)} unit={<>&deg;C</>} />
      </tr>,
      <tr key='gefuehlt'>
        <td>Gefühlt:</td>
        <Value value={_.round(gefuehlt, 1)} unit={<>&deg;C</>} />
      </tr>,
      <tr key='luftfeuchtigkeit'>
        <td>Luftfeuchtigkeit:</td>
        <Value value={luftfeuchtigkeit} unit='%' />
      </tr>,
    ];
  };

  const displayWarningDialog = async function() {
    await mqttClient.publishAsync(`control-ui/cmnd/dialog`, JSON.stringify({
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
            <td style={{width: '50px'}} />
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
              <td colSpan={3} className='wetter__warning'>
                <div
                  className='wetter__warning__text'
                  onClick={() => displayWarningDialog()}
                >
                  {_.map(_.uniqBy(warnungen, 'event'), warnung => renderWarningTitle(warnung)).join(', ')}
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
//                    onClick={async() => await mqttClient.publishAsync(`control-ui/cmnd/dialog`, JSON.stringify({
//                      clientId,
//                      header:   'Wetter Warnung',
//                      data:     alerts.flatMap(alert => [alert.event, alert.description]),
//                    }))}
//                  />
//                </div>
//              </td>
//            </tr> :
//            null}
