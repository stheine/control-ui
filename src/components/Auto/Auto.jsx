// import _  from 'lodash';
import ms from 'ms';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import AppContext  from '../../contexts/AppContext.js';
import MqttContext from '../../contexts/MqttContext.js';
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

export const wallboxStateToAnzeige = function(wallboxState) {
  switch(wallboxState) {
    case 'Lädt':
      return 'Lädt';

//    case 'chargePurposeReachedAndNotConservationCharging':
//      ladestatusAnzeige = 'Voll';
//      break;
//
//    case 'TODO error als Fehler zeigen: error':
//      ladestatusAnzeige = 'Fehler';
//      break;
//
    case 'Nicht verbunden':
      return 'Getrennt';

//    case 'error':
    case 'Warte auf Ladefreigabe':
      return 'Bereit';

    default:
      return wallboxState;
  }
};

export default function Auto() {
  // console.log('Auto');

  const {controlClient, setAppDialog} = useContext(AppContext);
  const {messages} = useContext(MqttContext);

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

//  const connected    = messages['vwsfriend/mqtt/weconnectConnected'];
  const updated        = messages['vwsfriend/mqtt/weconnectUpdated'];
  const updatedSeconds = Math.round((_now - new Date(updated)) / 1000);

  const reichweite     = messages[`${messagePrefix}/domains/charging/batteryStatus/cruisingRangeElectric_km`];
  const ladelevel      = messages[`${messagePrefix}/domains/charging/batteryStatus/currentSOC_pct`];

  const ladeleistung   = messages[`${messagePrefix}/domains/charging/chargingStatus/chargePower_kW`];
//  const ladetyp      = messages[`${messagePrefix}/domains/charging/chargingStatus/chargeType`];
//  const ladestatus   = messages[`${messagePrefix}/domains/charging/chargingStatus/chargingState`];
//  const ladezeit   = messages[`${messagePrefix}/domains/charging/chargingStatus/remainingChargingTimeToComplete_min`];
  const ladeziel       = messages[`${messagePrefix}/domains/charging/chargingSettings/targetSOC_pct`];
  const autoStatus     = messages['auto/tele/STATUS'];
  const pvSensor       = messages['Fronius/solar/tele/SENSOR'];

  if(!autoStatus || !pvSensor) {
    return;
  }

  const pvProductionKw = pvSensor.solar.powerOutgoing / 1000;

  const {atHome, chargeMode: activeChargeMode, wallboxState} = autoStatus;
  let   ladelevelColor;

  if(ladelevel >= 70) {
    // ladelevelColor = '#00ff00';
  } else if(ladelevel >= 50) {
    ladelevelColor = '#ffff00';
  } else if(ladelevel >= 30) {
    ladelevelColor = '#ffcc00';
  } else {
    ladelevelColor = '#ff0000';
  }

  const ladestatusAnzeige = wallboxStateToAnzeige(wallboxState);

  // console.log(_.map(_.filter(_.keys(messages), topic => topic.startsWith('vwsfriend')), topic =>
  //   `${topic}: ${messages[topic]}`).join('\n'));

  const rows = [
    <tr key='akku'>
      <td className='auto__label'>Akku:</td>
      <Value
        backgroundColor={ladelevelColor}
        className='digitalism'
        value={ladelevel}
        unit='%'
        unitOn='bottom'
      />
    </tr>,
    <tr key='reichweite'>
      <td className='auto__label'>Reichweite:</td>
      <Value
        value={reichweite}
        unit='km'
        unitOn='bottom'
      />
    </tr>,
  ];

  switch(wallboxState) {
    case 'Lädt':
      rows.push(
        <tr key='status'>
          <td className='auto__label'>
            {ladestatusAnzeige}:
          </td>
          <Value
            value={ladeleistung}
            unit='kW'
            unitOn='top'
          />
        </tr>
      );
      if(ladeziel) {
        rows.push(
          <tr key='ziel'>
            <td className='auto__label'>Ziel:</td>
            <Value
              value={ladeziel}
              unit='%'
              unitOn='bottom'
            />
          </tr>
        );
      }
      break;

    default: {
      let ladestatusClassName;

      if(atHome && ladelevel < 80 && ladestatusAnzeige === 'Getrennt' && pvProductionKw > 4) {
        ladestatusClassName = 'auto__value__highlight';
      }

      rows.push(
        <tr key='status'>
          <td className='auto__label twoLine'>
            Status:
          </td>
          <td className='auto__value'>
            <font className={ladestatusClassName}>
              {ladestatusAnzeige}
            </font>
            <br />
            <font className='auto__value__extra'>({activeChargeMode})</font>
          </td>
        </tr>
      );
      break;
    }
  }

  if(!controlClient) {
    rows.push(
      <tr key='updated'>
        <td className='auto__label'>
          Updated:
        </td>
        <Value
          value={updatedSeconds}
          unit='s'
          unitOn='bottom'
        />
      </tr>
    );
  }

  return (
    <div
      className='autoDiv'
      onClick={() => setAppDialog({content: 'AutoLaden', header: 'Auto laden', timeout: '30m'})}
    >
      <table className='auto'>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  );
}
