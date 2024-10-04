import _ from 'lodash';
import React, {
  useContext,
} from 'react';

import AppContext    from '../../contexts/AppContext.js';
import mqttConfig    from './mqttConfig.js';
import MqttContext   from '../../contexts/MqttContext.js';

import Alert         from '../../svg/sargam/Alert.jsx';
import translateCode from './translateCode.js';

const renderDay = function(day) {
  const niederschlag = day?.precipitation;
  const tempMax      = day?.temperatureMax;
  const tempMin      = day?.temperatureMin;
  const wind         = day?.windSpeed;
  const boeen        = day?.windGust;

  return [
    <tr key='temperatur'>
      <td>Temperatur:</td>
      <td>
        <font className='wetter__value'>
          {_.round(tempMin / 10)}
          <font className='wetter__value__unit'>&deg;C</font>
        </font>
        &nbsp;-&nbsp;
        <font className='wetter__value'>
          {_.round(tempMax / 10)}
          <font className='wetter__value__unit'>&deg;C</font>
        </font>
      </td>
    </tr>,
    <tr key='niederschlag'>
      <td>Niederschlag:</td>
      <td className='wetter__value'>{niederschlag}<font className='wetter__value__unit'>mm</font></td>
    </tr>,

    <tr key='wind'>
      <td>Wind:</td>
      <td className='wetter__value'>{_.round(wind / 10)}<font className='wetter__value__unit'>km/h</font></td>
    </tr>,
    <tr key='boeen'>
      <td>Böen:</td>
      <td className='wetter__value'>{_.round(boeen / 10)}<font className='wetter__value__unit'>km/h</font></td>
    </tr>,
  ];
};

const renderWarningTitle = function(warning) {
  return _.map(_.toLower(warning.event).split(' '), word => _.upperFirst(word)).join(' ');
};

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

export default function WetterDwd() {
  const {clientId} = useContext(AppContext);
  const {messages, mqttClient} = useContext(MqttContext);

  const siteConfig = _.first(mqttConfig);

  const message = messages[siteConfig.topic];

  if(message) {
    // console.log('WetterDwd', {message});
  }

  const heute      = message?.forecast.days[0];
  const morgen     = message?.forecast.days[1];
  const warnungen  = message ? message?.forecast.warnings || [] : [{event: 'none'}];
  const wetter     = translateCode(message?.current.weathercode);
  const temperatur = message?.current.temperature === undefined ? 99 : message.current.temperature;
  const wind       = message?.current.windspeed === undefined ? 99 : message.current.windspeed;

  const renderCurrent = function() {
    return [
      <tr key='wetter'>
        <td colSpan={2}>{wetter}</td>
      </tr>,
      <tr key='temperatur'>
        <td>Temperatur:</td>
        <td className='wetter__value'>
          {_.round(temperatur, 1)}
          <font className='wetter__value__unit'>&deg;C</font>
        </td>
      </tr>,
      <tr key='wind'>
        <td>Wind:</td>
        <td className='wetter__value'>{wind}<font className='wetter__value__unit'>km/h</font></td>
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
                  <tr>
                    <td className='wetter__label'>Heute</td>
                  </tr>
                  {renderDay(heute)}
                </tbody>
              </table>
            </td>
            <td>
              <table>
                <tbody>
                  <tr>
                    <td className='wetter__label'>Morgen</td>
                  </tr>
                  {renderDay(morgen)}
                </tbody>
              </table>
            </td>
          </tr>
          {warnungen.length ?
            <tr key='warnung'>
              <td colSpan={2} className='wetter__warning'>
                <div className='wetter__warning__text'>
                  {_.map(warnungen, warnung => renderWarningTitle(warnung)).join(', ')}
                </div>
                <div className='wetter__warning__icon'>
                  <Alert
                    dark={true}
                    onClick={async() => await mqttClient.publishAsync(`control-ui/cmnd/dialog`, JSON.stringify({
                      clientId,
                      header:   'Wetter Warnung',
                      data:     warnungen.flatMap(warnung => [
                        warnung.event,
                        renderWarningTime(warnung),
                        warnung.description,
                      ]),
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

//  const {eveningStartsHour} = message || {};
//  const wetter              = message?.current.weather[0].description || '';
//  const temperatur          = message?.current.temp       === undefined ? 99 : message.current.temp;
//  const gefuehlt            = message?.current.feels_like === undefined ? 99 : message.current.feels_like;
//  const bewoelkung          = message?.current.clouds     === undefined ? 99 : message.current.clouds;
//  const luftfeuchtigkeit    = message?.current.humidity   === undefined ? 99 : message.current.humidity;
//  const alerts              = message ? message?.alerts || [] : [{event: 'none'}];
//  // TODO Vorhersage
//
//  if(alerts.length > 1) {
//    // console.log({alerts});
//  }
//
//  const renderNight = function() {
//    return [
//      <tr key='nightLabel'>
//        <td colSpan={2} className='wetter__label'>Nacht</td>
//      </tr>,
//      <tr key='nightTemp'>
//        <td>Temperatur:</td>
//        <td>
//          <font className='wetter__value'>
//            {_.round(message?.nightMinTemp)}
//            <font className='wetter__value__unit'>&deg;C</font>
//          </font>
//          &nbsp;-&nbsp;
//          <font className='wetter__value'>
//            {_.round(message?.nightMaxTemp)}
//            <font className='wetter__value__unit'>&deg;C</font>
//          </font>
//        </td>
//      </tr>,
//      <tr key='nightWind'>
//        <td>Max Wind:</td>
//        <td className='wetter__value'>
//          {_.round(message?.nightMaxWind || 0 * 3.6)}
//          <font className='wetter__value__unit'>km/h</font>
//        </td>
//      </tr>,
//    ];
//  };
//
//  const renderDay = function() {
//    return [
//      <tr key='dayLabel'>
//        <td colSpan={2} className='wetter__label'>Tag</td>
//      </tr>,
//      <tr key='dayTemp'>
//        <td>Temperatur:</td>
//        <td>
//          <font className='wetter__value'>
//            {_.round(message?.dayMinTemp)}
//            <font className='wetter__value__unit'>&deg;C</font>
//          </font>
//          &nbsp;-&nbsp;
//          <font className='wetter__value'>
//            {_.round(message?.dayMaxTemp)}
//            <font className='wetter__value__unit'>&deg;C</font>
//          </font>
//        </td>
//      </tr>,
//      <tr key='dayWind'>
//        <td>Max Wind:</td>
//        <td className='wetter__value'>
//          {_.round(message?.dayMaxWind || 0 * 3.6)}<font className='wetter__value__unit'>km/h</font>
//        </td>
//      </tr>,
//    ];
//  };
//
//  const renderCurrent = function() {
//    return [
//      <tr key='wetter'>
//        <td colSpan={2}>{wetter}</td>
//      </tr>,
//      <tr key='bewoelkung'>
//        <td>Bewölkung:</td>
//        <td className='wetter__value'>{bewoelkung}<font className='wetter__value__unit'>%</font></td>
//      </tr>,
//      <tr key='temperatur'>
//        <td>Temperatur:</td>
//        <td className='wetter__value'>
//          {_.round(temperatur, 1)}
//          <font className='wetter__value__unit'>&deg;C</font>
//        </td>
//      </tr>,
//      <tr key='gefuehlt'>
//        <td>Gefühlt:</td>
//        <td className='wetter__value'>
//          {_.round(gefuehlt, 1)}
//          <font className='wetter__value__unit'>&deg;C</font>
//        </td>
//      </tr>,
//      <tr key='luftfeuchtigkeit'>
//        <td>Luftfeuchtigkeit:</td>
//        <td className='wetter__value'>{luftfeuchtigkeit}<font className='wetter__value__unit'>%</font></td>
//      </tr>,
//    ];
//  };
//
//  return (
//    <div className='wetter'>
//      <table>
//        <tbody>
//          <tr>
//            <td>
//              <table>
//                <tbody>
//                  <tr>
//                    <td className='wetter__label'>Aktuell</td>
//                  </tr>
//                  {renderCurrent()}
//                </tbody>
//              </table>
//            </td>
//            <td>
//              <table>
//                <tbody>
//                  {new Date().getHours() < eveningStartsHour ?
//                    [...renderDay(), ...renderNight()] :
//                    [...renderNight(), ...renderDay()]}
//                </tbody>
//              </table>
//            </td>
//          </tr>
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
//        </tbody>
//      </table>
//    </div>
//  );
}
