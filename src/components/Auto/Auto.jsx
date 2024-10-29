import _           from 'lodash';
import React, {
  useContext,
} from 'react';

import MqttContext from '../../contexts/MqttContext.js';
import Pause       from '../../svg/sargam/Pause.jsx';
import Play        from '../../svg/sargam/Play.jsx';

const messagePrefix = 'vwsfriend/vehicles/WVWZZZE1ZPP505932';

// Writeable
// vwsfriend/mqtt/weconnectForceUpdate_writetopic,
//   1 ?
// vwsfriend/mqtt/weconnectUpdateInterval_s_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/controls/charging_writetopic,
//   start / stop
// vwsfriend/vehicles/WVWZZZE1ZPP505932/controls/climatisation_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/controls/wakeup_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/controls/windowheating_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/batteryChargingCare/chargingCareSettings/batteryCareMode_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/charging/chargingCareSettings/batteryCareMode_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/charging/chargingSettings/autoUnlockPlugWhenChargedAC_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/charging/chargingSettings/autoUnlockPlugWhenCharged_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/charging/chargingSettings/maxChargeCurrentAC_writetopic,
//   maximum / reduced
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/charging/chargingSettings/targetSOC_pct_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/climatisation/climatisationSettings/climatizationAtUnlock_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/climatisation/climatisationSettings/targetTemperature_C_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/climatisation/climatisationSettings/targetTemperature_F_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/climatisation/climatisationSettings/windowHeatingEnabled_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/climatisation/climatisationSettings/zoneFrontLeftEnabled_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/climatisation/climatisationSettings/zoneFrontRightEnabled_writetopic


const displayValue = function(value, unit) {
  return [
    <td key='value' className={`auto__value${value < 0 ? ' negative' : ''}`}>
      {value < 1000 ? _.round(value) : _.round(value / 1000, 1).toFixed(1)}
    </td>,
    <td key='unit' className='auto__unit'>
      {unit}
    </td>,
  ];
};

export default function Auto() {
  // console.log('Auto');

  const {messages, mqttClient} = useContext(MqttContext);

  const connected    = messages['vwsfriend/mqtt/weconnectConnected'];

  const reichweite   = messages[`${messagePrefix}/domains/charging/batteryStatus/cruisingRangeElectric_km`];
  const ladelevel    = messages[`${messagePrefix}/domains/charging/batteryStatus/currentSOC_pct`];

  const ladeleistung = messages[`${messagePrefix}/domains/charging/chargingStatus/chargePower_kW`];
  const ladetyp      = messages[`${messagePrefix}/domains/charging/chargingStatus/chargeType`];
  const ladestatus   = messages[`${messagePrefix}/domains/charging/chargingStatus/chargingState`];
  const ladezeit     = messages[`${messagePrefix}/domains/charging/chargingStatus/remainingChargingTimeToComplete_min`];
  const ladeziel     = messages[`${messagePrefix}/domains/charging/chargingSettings/targetSOC_pct`];

  let ladestatusAction;
  let ladestatusAnzeige;

//  console.log(_.map(_.filter(_.keys(messages), topic => topic.startsWith('vwsfriend')), topic =>
//    `${topic}: ${messages[topic]}`).join('\n'));

  switch(ladestatus) {
    case 'charging':
      ladestatusAnzeige = 'Lädt';
      ladestatusAction = (
        <div style={{width: '40px'}}>
          <Pause
            dark={true}
            onClick={async() => {
              await mqttClient.publishAsync('vwsfriend/vehicles/WVWZZZE1ZPP505932/controls/charging_writetopic',
                'stop');
              await mqttClient.publishAsync('vwsfriend/mqtt/weconnectForceUpdate_writetopic', '1');
            }}
          />
        </div>
      );
      break;

    case 'error':
      ladestatusAnzeige = 'Fehler';
      break;

    case 'notReadyForCharging':
      ladestatusAnzeige = 'Frei';
      break;

    case 'readyForCharging':
      ladestatusAnzeige = 'Bereit';
      ladestatusAction = (
        <div style={{width: '40px'}}>
          <Play
            dark={true}
            onClick={async() => {
              await mqttClient.publishAsync('vwsfriend/vehicles/WVWZZZE1ZPP505932/controls/charging_writetopic',
                'start');
              await mqttClient.publishAsync('vwsfriend/mqtt/weconnectForceUpdate_writetopic', '1');
            }}
          />
        </div>
      );
      break;

    default:
      ladestatusAnzeige = ladestatus;
      break;
  }

  const rows = [
    <tr key='akku'>
      <td className='auto__label'>Akku:</td>
      {displayValue(ladelevel, '%')}
    </tr>,
    <tr key='reichweite'>
      <td className='auto__label'>Reichweite:</td>
      {displayValue(reichweite, 'km')}
    </tr>,
  ];

  switch(ladestatus) {
    case 'charging':
      rows.push(
        <tr key='status'>
          <td className='auto__label'>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div
                style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10px 10px 0'}}
              >
                {ladestatusAnzeige}:
              </div>
              {ladestatusAction}
            </div>
          </td>
          <td className='auto__value'>
            {['ac', 'invalid'].includes(ladetyp) ? null : <span>{ladetyp?.toUpperCase()} / </span>}{ladeleistung}
          </td>
          <td className='auto__unit'>kW</td>
        </tr>
      );
      rows.push(
        <tr key='ziel'>
          <td className='auto__label'>Ziel:</td>
          {displayValue(ladeziel, '%')}
        </tr>
      );
      rows.push(
        <tr key='dauer'>
          <td className='auto__label'>Dauer:</td>
          <td className='auto__value'>{Math.trunc(ladezeit / 60)}:{_.padStart(ladezeit % 60, 2, '0')}</td>
          <td className='auto__unit'>h</td>
        </tr>
      );
      break;

    case 'error':
      rows.push(
        <tr key='status'>
          <td className='auto__label'>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div
                style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10px 10px 0'}}
              >
                {ladestatusAnzeige}:
              </div>
              {ladestatusAction}
            </div>
          </td>
          <td className='auto__value' colSpan={2}
            style={{backgroundColor: '#ff0000', fontSize: '80%', paddingBottom: '11px', paddingTop: '3px'}}
          >
            Fehler
          </td>
        </tr>
      );
      break;

    default:
      rows.push(
        <tr key='status'>
          <td className='auto__label'>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div
                style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10px 10px 0'}}
              >
                Status:
              </div>
              {ladestatusAction}
            </div>
          </td>
          <td className='auto__value' colSpan={1} style={{fontSize: '80%', paddingBottom: '11px', paddingTop: '3px'}}>
            {ladestatusAnzeige}
          </td>
        </tr>
      );
      break;
  }

  rows.push(
    <tr key='connected'>
      <td className='auto__label'>
        <div
          style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10px 10px 0'}}
        >
          Connected:
        </div>
      </td>
      <td className='auto__value' colSpan={1} style={{fontSize: '80%', paddingBottom: '11px', paddingTop: '3px'}}>
        {connected}
      </td>
    </tr>
  );

  return (
    <table className='auto'>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}
