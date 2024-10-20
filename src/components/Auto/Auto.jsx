import _           from 'lodash';
import RingBuffer  from '@stheine/ringbufferjs';
import React, {
  useContext,
  useRef,
  useState,
} from 'react';

import Close       from '../../svg/sargam/Close.jsx';
import Collect     from '../../svg/sargam/Collect.jsx';
import Max         from '../../svg/sargam/Max.jsx';
import MqttContext from '../../contexts/MqttContext.js';
import Pause       from '../../svg/sargam/Pause.jsx';
import Play        from '../../svg/sargam/Play.jsx';

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
//  const einkaufRing = useRef(new RingBuffer(3));
  const [_lastUpdateTime, setLastUpdateTime] = useState();

  const ladelevel    = messages['vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/charging/batteryStatus/currentSOC_pct'];
  const reichweite   = messages['vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/charging/batteryStatus/cruisingRangeElectric_km'];

  const ladestatus   = messages['vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/charging/chargingStatus/chargingState'];
  const ladetyp      = messages['vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/charging/chargingStatus/chargeType'];
  const ladeleistung = messages['vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/charging/chargingStatus/chargePower_kW'];
  const ladeziel     = messages['vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/charging/chargingSettings/targetSOC_pct'];
  const ladezeit     = messages['vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/charging/chargingStatus/remainingChargingTimeToComplete_min'];

  let ladestatusAnzeige;

  switch(ladestatus) {
    case 'charging':
      ladestatusAnzeige = 'Lädt';
      break;

    case 'readyForCharging':
      ladestatusAnzeige = 'Bereit';
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

  if(ladestatus === 'charging') {
    rows.push(
      <tr key='status'>
        <td className='auto__label'>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <div
              style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10px 10px 0'}}
            >
              {ladestatusAnzeige}:
            </div>
            <div style={{width: '40px'}}>
              <Pause
                dark={true}
                onClick={async() => {
                  await mqttClient.publishAsync('vwsfriend/vehicles/WVWZZZE1ZPP505932/controls/charging_writetopic', 'stop');
                  await mqttClient.publishAsync('vwsfriend/mqtt/weconnectForceUpdate_writetopic', '1');
                }}
              />
            </div>
          </div>
        </td>
        <td className='auto__value'>{['ac', 'invalid'].includes(ladetyp) ? null : <span>{ladetyp?.toUpperCase()}} / </span>}{ladeleistung}</td>
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
        <td className='auto__value'>{~~(ladezeit / 60)}:{_.padStart(ladezeit % 60, 2, '0')}</td>
        <td className='auto__unit'>h</td>
      </tr>
    );
  } else {
    rows.push(
      <tr key='status'>
        <td className='auto__label'>
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <div
              style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10px 10px 0'}}
            >
              Status:
            </div>
            <div style={{width: '40px'}}>
              <Play
                dark={true}
                onClick={async() => {
                  await mqttClient.publishAsync('vwsfriend/vehicles/WVWZZZE1ZPP505932/controls/charging_writetopic', 'start');
                  await mqttClient.publishAsync('vwsfriend/mqtt/weconnectForceUpdate_writetopic', '1');
                }}
              />
            </div>
          </div>
        </td>
        <td className='auto__value' colSpan={1} style={{fontSize: '80%', paddingBottom: '11px', paddingTop: '3px'}}>{ladestatusAnzeige}</td>
      </tr>
    );
  }

  return (
    <table className='auto'>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}
