// import _  from 'lodash';
import ms from 'ms';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import AppContext  from '../../contexts/AppContext.js';
import MqttContext from '../../contexts/MqttContext.js';
import Pause       from '../../svg/sargam/Pause.jsx';
import Play        from '../../svg/sargam/Play.jsx';
import repeatEvery from '../Clock/repeatEvery.js';
import Value       from '../Value/Value.jsx';

const messagePrefix = 'vwsfriend/vehicles/WVWZZZE1ZPP505932';

let refreshInterval;

// Writeable
// vwsfriend/mqtt/weconnectForceUpdate_writetopic       => true
// vwsfriend/mqtt/weconnectUpdateInterval_s_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/controls/charging_writetopic      =>  start / stop
// vwsfriend/vehicles/WVWZZZE1ZPP505932/controls/climatisation_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/controls/wakeup_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/controls/windowheating_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/batteryChargingCare/chargingCareSettings/batteryCareMode_writetopic,

// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/charging/chargingCareSettings/batteryCareMode_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/charging/chargingSettings/autoUnlockPlugWhenChargedAC_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/charging/chargingSettings/autoUnlockPlugWhenCharged_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/charging/chargingSettings/maxChargeCurrentAC_writetopic
//   => maximum / reduced
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/charging/chargingSettings/targetSOC_pct_writetopic,

// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/climatisation/climatisationSettings/climatizationAtUnlock_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/climatisation/climatisationSettings/targetTemperature_C_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/climatisation/climatisationSettings/targetTemperature_F_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/climatisation/climatisationSettings/windowHeatingEnabled_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/climatisation/climatisationSettings/zoneFrontLeftEnabled_writetopic,
// vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/climatisation/climatisationSettings/zoneFrontRightEnabled_writetopic

export default function Auto() {
  // console.log('Auto');

  const {controlClient, setAppDialog} = useContext(AppContext);
  const {messages, mqttClient} = useContext(MqttContext);

  const [_now, setNow] = useState(new Date());

  useEffect(() => {
    // console.log('Clock:useEffect, mount');

    refreshInterval = repeatEvery(() => {
      // console.log('Clock, refresh');

      setNow(new Date());
    }, ms('1s'), 'Auto');

    return () => {
      // console.log('Clock:useEffect, dismount', {refreshInterval});

      if(refreshInterval) {
        // console.log('Clock, remove, disable refresh');
        clearInterval(refreshInterval);

        refreshInterval = null;
      }
    };
  }, []);

//  const connected      = messages['vwsfriend/mqtt/weconnectConnected'];
  const updated        = messages['vwsfriend/mqtt/weconnectUpdated'];
  const updatedSeconds = Math.round((_now - new Date(updated)) / 1000);

  const reichweite   = messages[`${messagePrefix}/domains/charging/batteryStatus/cruisingRangeElectric_km`];
  const ladelevel    = messages[`${messagePrefix}/domains/charging/batteryStatus/currentSOC_pct`];

  const ladeleistung = messages[`${messagePrefix}/domains/charging/chargingStatus/chargePower_kW`];
//  const ladetyp      = messages[`${messagePrefix}/domains/charging/chargingStatus/chargeType`];
  const ladestatus   = messages[`${messagePrefix}/domains/charging/chargingStatus/chargingState`];
//  const ladezeit   = messages[`${messagePrefix}/domains/charging/chargingStatus/remainingChargingTimeToComplete_min`];
  const ladeziel     = messages[`${messagePrefix}/domains/charging/chargingSettings/targetSOC_pct`];

  let ladestatusAction;
  let ladestatusAnzeige;

  // console.log(_.map(_.filter(_.keys(messages), topic => topic.startsWith('vwsfriend')), topic =>
  //   `${topic}: ${messages[topic]}`).join('\n'));

  switch(ladestatus) {
    case 'charging':
      ladestatusAnzeige = 'Lädt';
      ladestatusAction = (
        <div style={{width: '40px'}}>
          <Pause
            dark={true}
            onClick={async() => await mqttClient.publishAsync('auto/cmnd/stopCharging', null)}
          />
        </div>
      );
      break;

    case 'chargePurposeReachedAndNotConservationCharging':
      ladestatusAnzeige = 'Voll';
      break;

    case 'TODO error als Fehler zeigen: error':
      ladestatusAnzeige = 'Fehler';
      break;

    case 'notReadyForCharging':
      ladestatusAnzeige = 'Getrennt';
      break;

    case 'error':
    case 'readyForCharging':
      ladestatusAnzeige = 'Bereit';
      ladestatusAction = (
        <div style={{width: '40px'}}>
          <Play
            dark={true}
            onClick={async() => await mqttClient.publishAsync('auto/cmnd/startCharging', null)}
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
      <Value value={ladelevel} unit='%' />
    </tr>,
    <tr key='reichweite'>
      <td className='auto__label'>Reichweite:</td>
      <Value value={reichweite} unit='km' />
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
                {ladestatusAnzeige}
              </div>
              {ladestatusAction}
            </div>
          </td>
          <Value value={ladeleistung} unit='kW' />
        </tr>
      );
      if(ladeziel) {
        rows.push(
          <tr key='ziel'>
            <td className='auto__label'>Ziel:</td>
            <Value value={ladeziel} unit='%' />
          </tr>
        );
      }
//      rows.push(
//        <tr key='dauer'>
//          <td className='auto__label'>Dauer:</td>
//          <td className='auto__value'>{Math.trunc(ladezeit / 60)}:{_.padStart(ladezeit % 60, 2, '0')}</td>
//          <td className='auto__unit'>h</td>
//        </tr>
//      );
      break;

    case 'TODO error als Fehler zeigen: error':
      rows.push(
        <tr key='status'>
          <td className='auto__label'>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div
                style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10px 10px 0'}}
              >
                {ladestatusAnzeige}
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
          <td className='auto__value' colSpan={1} style={{fontSize: '60%', paddingBottom: '11px', paddingTop: '3px'}}>
            {ladestatusAnzeige}
          </td>
        </tr>
      );
      break;
  }

//  rows.push(
//    <tr key='connected'>
//      <td className='auto__label'>
//        <div
//          style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10px 10px 0'}}
//        >
//          Connected:
//        </div>
//      </td>
//      <td className='auto__value' colSpan={1} style={{fontSize: '80%', paddingBottom: '11px', paddingTop: '3px'}}>
//        {connected}
//      </td>
//    </tr>
//  );


  if(!controlClient) {
    rows.push(
      <tr key='updated'>
        <td className='auto__label'>
          <div
            style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10px 10px 0'}}
          >
            Updated:
          </div>
        </td>
        <Value value={updatedSeconds} unit='s' />
      </tr>
    );
  }

  return (
    <div
      className='autoDiv'
      onClick={() => setAppDialog({content: 'AutoLaden', header: 'Auto laden', timeout: '30s'})}
    >
      <table className='auto'>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  );
}
