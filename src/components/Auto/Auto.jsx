// import _  from 'lodash';
import ms from 'ms';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import AppContext      from '../../contexts/AppContext.js';
import {messagePrefix} from './mqttConfig.js';
import MqttContext     from '../../contexts/MqttContext.js';
import repeatEvery     from '../Clock/repeatEvery.js';
import Value           from '../Value/Value.jsx';

let refreshInterval;

export const wallboxStateToAnzeige = function({atHome, wallboxState}) {
  switch(wallboxState) {
    case 'Lädt':
      return 'Lädt';

    case 'Nicht verbunden':
      if(atHome) {
        return 'Getrennt';
      }

      return 'Unterwegs';

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

//  const ladeleistung   = messages[`${messagePrefix}/domains/charging/chargingStatus/chargePower_kW`];
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

  const {atHome, chargeMode: activeChargeMode, ladeleistungKw, wallboxState} = autoStatus;
  let   ladelevelColor;

  if(ladelevel >= 70) {
    // ladelevelColor = '#00ff00';
  } else if(ladelevel >= 50) {
    ladelevelColor = '#ffff00';
  } else if(ladelevel >= 30) {
    ladelevelColor = '#ffcc00';
  } else if(ladelevel) {
    ladelevelColor = '#ff0000';
  }

  const ladestatusAnzeige = wallboxStateToAnzeige({atHome, wallboxState});

  // console.log(_.map(_.filter(_.keys(messages), topic => topic.startsWith('vwsfriend')), topic =>
  //   `${topic}: ${messages[topic]}`).join('\n'));

  const rows = [
    <tr key='akku'>
      <td className='auto__label'>Akku:</td>
      <Value
        backgroundColor={ladelevelColor}
        className={ladelevel ? 'digitalism' : null}
        value={ladelevel || '?'}
        unit='%'
        unitOn='bottom'
      />
    </tr>,
    <tr key='reichweite'>
      <td className='auto__label'>Reichweite:</td>
      <Value
        value={reichweite || '?'}
        unit='km'
        unitOn='bottom'
      />
    </tr>,
  ];

  if(wallboxState === 'Lädt') {
    rows.push(
      <tr key='status'>
        <td className='auto__label'>
          <div className='auto__label__multi'>
            {ladestatusAnzeige} <div className='auto__label__small'>{ladeziel}%</div>:
          </div>
        </td>
        <Value
          value={ladeleistungKw}
          unit='kW'
          unitOn='top'
        />
      </tr>
    );
    rows.push(
      <tr key='mode'>
        <td className='auto__label'>
          Mode:
        </td>
        <Value
          className='small'
          value={activeChargeMode}
          unit={null}
        />
      </tr>
    );
//    if(ladeziel) {
//      rows.push(
//        <tr key='ziel'>
//          <td className='auto__label'>Ziel:</td>
//          <Value
//            value={ladeziel}
//            unit='%'
//            unitOn='bottom'
//          />
//        </tr>
//      );
//    }
  } else {
    let ladestatusBackgroundColor;

    if(atHome && ladelevel < 80 && ladestatusAnzeige === 'Getrennt' && pvProductionKw > 4) {
      ladestatusBackgroundColor = '#ffff00';
    }

    rows.push(
      <tr key='status'>
        <td className='auto__label'>
          Status:
        </td>
        <Value
          backgroundColor={ladestatusBackgroundColor}
          className='small'
          value={ladestatusAnzeige}
          unit={null}
        />
      </tr>
    );
    if(atHome) {
      rows.push(
        <tr key='mode'>
          <td className='auto__label'>
            Mode:
          </td>
          <Value
            className='small'
            value={activeChargeMode}
            unit={null}
          />
        </tr>
      );
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
