import _ from 'lodash';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import AppContext        from '../../contexts/AppContext.js';
import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

import Alert             from '../../svg/sargam/Alert.jsx';

const topic = 'wetter/dwd/INFO';

const translateCode = function(code) {
  switch(code) {
    case 1:
      return 'Wolkenlos';
    case 2:
      return 'Heiter';
    case 3:
      return 'Bewölkt';
    case 4:
      return 'Bedeckt';
    case 5:
      return 'Nebel';
    case 6:
      return 'Nebel'; // gefrierender Nebel
    case 7:
      return 'Regen'; // leichter Regen
    case 8:
      return 'Regen';
    case 9:
      return 'Regen'; // kraeftiger Regen
    case 10:
      return 'Schneeregen'; // gefrierender Regen
    case 11:
      return 'Schneeregen'; // kraeftiger gefrierender Regen
    case 12:
      return 'Schneeregen';
    case 13:
      return 'Schneeregen'; // kraeftiger Schneeregen
    case 14:
      return 'Schneefall'; // leichter Schneefall
    case 15:
      return 'Schneefall';
    case 16:
      return 'Schneefall'; // kraeftiger Schneefall
    case 17:
      return 'Schneefall'; // Eiskoerner
    case 18:
      return 'Regenschauer';
    case 19:
      return 'Regenschauer'; // kraeftiger Regenschauer
    case 20:
      return 'Schneeregenschauer';
    case 21:
      return 'Schneeschauer'; // kraeftiger Schneeregenschauer
    case 22:
      return 'Schneeschauer';
    case 23:
      return 'Schneeschauer'; // kraeftiger Schneeschauer
    case 24:
      return 'Schneeschauer'; // Graupelschauer
    case 25:
      return 'Schneeschauer'; // kraeftiger Graupelschauer
    case 26:
      return 'Gewitter'; // Gewitter ohne Niederschlag
    case 27:
      return 'Gewitter';
    case 28:
      return 'Gewitter'; // kraeftiges Gewitter
    case 29:
      return 'Gewitter'; // Gewitter mit Hagel
    case 30:
      return 'Gewitter'; // kraeftiges Gewitter mit Hagel
    case 31:
      return 'Sturm'; // Boen

// 0           Clear sky
// 1, 2, 3     Mainly clear, partly cloudy, and overcast
// 45, 48      Fog and depositing rime fog
// 51, 53, 55  Drizzle: Light, moderate, and dense intensity
// 56, 57      Freezing Drizzle: Light and dense intensity
// 61, 63, 65  Rain: Slight, moderate and heavy intensity
// 66, 67      Freezing Rain: Light and heavy intensity
// 71, 73, 75  Snow fall: Slight, moderate, and heavy intensity
// 77          Snow grains
// 80, 81, 82  Rain showers: Slight, moderate, and violent
// 85, 86      Snow showers slight and heavy
// 95 *        Thunderstorm: Slight or moderate
// 96, 99 *    Thunderstorm with slight and heavy hail
    default:
      // eslint-disable-next-line no-console
      console.log('translateCode, unhandled', {code});

      return code;
  }
};

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
      <td className='wetter__value'>{niederschlag}<font className='wetter__value__unit'>%</font></td>
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

export default function WetterDwd() {
  // console.log('WetterDwd');

  const [_message, setMessage] = useState();

  const {clientId} = useContext(AppContext);
  const mqttClient = useContext(MqttClientContext);

  useEffect(() => mqttSubscribe({mqttClient, topic, onMessage: ({message}) => setMessage(message)}),
    [mqttClient]);

  if(_message) {
    // console.log('WetterDwd', {_message});
  }

  const heute      = _message?.days[0];
  const morgen     = _message?.days[1];
  const warnungen  = _message ? _message?.warnings || [] : [{event: 'none'}];
  const wetter     = translateCode(_message?.current_weather.weathercode);
  const temperatur = _message?.current_weather.temperature === undefined ? 99 : _message.current_weather.temperature;
  const wind       = _message?.current_weather.windspeed === undefined ? 99 : _message.current_weather.windspeed;

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
                  {_.map(warnungen, warnung => _.upperFirst(_.toLower(warnung.event))).join(', ')}
                </div>
                <div className='wetter__warning__icon'>
                  <Alert
                    dark={true}
                    onClick={() => mqttClient.publish(`control-ui/cmnd/dialog`, JSON.stringify({
                      clientId,
                      header:   'Wetter Warnung',
                      data:     warnungen.flatMap(alert => [alert.event, alert.description]),
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

//  const {eveningStartsHour} = _message || {};
//  const wetter              = _message?.current.weather[0].description || '';
//  const temperatur          = _message?.current.temp       === undefined ? 99 : _message.current.temp;
//  const gefuehlt            = _message?.current.feels_like === undefined ? 99 : _message.current.feels_like;
//  const bewoelkung          = _message?.current.clouds     === undefined ? 99 : _message.current.clouds;
//  const luftfeuchtigkeit    = _message?.current.humidity   === undefined ? 99 : _message.current.humidity;
//  const alerts              = _message ? _message?.alerts || [] : [{event: 'none'}];
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
//            {_.round(_message?.nightMinTemp)}
//            <font className='wetter__value__unit'>&deg;C</font>
//          </font>
//          &nbsp;-&nbsp;
//          <font className='wetter__value'>
//            {_.round(_message?.nightMaxTemp)}
//            <font className='wetter__value__unit'>&deg;C</font>
//          </font>
//        </td>
//      </tr>,
//      <tr key='nightWind'>
//        <td>Max Wind:</td>
//        <td className='wetter__value'>
//          {_.round(_message?.nightMaxWind || 0 * 3.6)}
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
//            {_.round(_message?.dayMinTemp)}
//            <font className='wetter__value__unit'>&deg;C</font>
//          </font>
//          &nbsp;-&nbsp;
//          <font className='wetter__value'>
//            {_.round(_message?.dayMaxTemp)}
//            <font className='wetter__value__unit'>&deg;C</font>
//          </font>
//        </td>
//      </tr>,
//      <tr key='dayWind'>
//        <td>Max Wind:</td>
//        <td className='wetter__value'>
//          {_.round(_message?.dayMaxWind || 0 * 3.6)}<font className='wetter__value__unit'>km/h</font>
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
//        </tbody>
//      </table>
//    </div>
//  );
}
