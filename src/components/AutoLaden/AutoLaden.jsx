import _ from 'lodash';
import React, {
  useContext,
} from 'react';

import Button      from '../Button/Button.jsx';
import MqttContext from '../../contexts/MqttContext.js';
import Value       from '../Value/Value.jsx';

const messagePrefix = 'vwsfriend/vehicles/WVWZZZE1ZPP505932';

export default function AutoLaden() {
  const {messages, mqttClient} = useContext(MqttContext);

  const ladestrom    = messages['Wallbox/evse/external_current'].current;
  const reichweite   = messages[`${messagePrefix}/domains/charging/batteryStatus/cruisingRangeElectric_km`];
  const ladelevel    = messages[`${messagePrefix}/domains/charging/batteryStatus/currentSOC_pct`];
  const ladeleistung = messages[`${messagePrefix}/domains/charging/chargingStatus/chargePower_kW`];
  const ladetyp      = messages[`${messagePrefix}/domains/charging/chargingStatus/chargeType`];
  const ladezeit     = messages[`${messagePrefix}/domains/charging/chargingStatus/remainingChargingTimeToComplete_min`];
  const ladeziel     = messages[`${messagePrefix}/domains/charging/chargingSettings/targetSOC_pct`];
  const status       = messages['auto/tele/STATUS'];

  const {chargeMode: activeChargeMode, wallboxState} = status;

  // console.log('AutoLaden', {status, ladestrom});

  const fields = [{
    label: 'Akku',
    value: ladelevel,
    unit:  '%',
  }, {
    label: 'Status',
    value: wallboxState,
  }, {
    label: 'Reichweite',
    value: reichweite,
    unit:  'km',
  }, {
    label: 'Ladeleisung (Wallbox)',
    value: ladestrom * 3 * 230 / 1000 / 1000,
    unit:  'kW',
  }, {
    label: 'Ladeleistung (Auto)',
    value: ladeleistung,
    unit:  'kW',
  }, {
    label: 'Ladetyp',
    value: ladetyp,
  }, {
    label: 'Ladedauer',
    value: `${Math.trunc(ladezeit / 60)}:${_.padStart(ladezeit % 60, 2, '0')}`,
  }, {
    label: 'Ladeziel',
    value: ladeziel,
    unit:  '%',
  }];

  const buttons = [
    'Überschuss',
    'Schnell',
    'Nachts',
    // 'NachtsTest',
    'Aus',
  ];

  return (
    <table>
      <tbody>
        <tr>
          <td colSpan={buttons.length}>
            <table>
              <tbody>
                {fields.map(field => (
                  <tr key={field.label}>
                    <td>
                      {field.label}:
                    </td>
                    <Value value={field.value} unit={field.unit} />
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          {buttons.map(button => (
            <td key={button}>
              <Button
                active={activeChargeMode === button}
                onClick={async() => await mqttClient.publishAsync('auto/cmnd/setChargeMode', button)}
              >
                {button}
              </Button>
            </td>
          ))}
        </tr>
        <tr>
          {buttons.map(button => (
            <td key={button}>
              <Button
                active={activeChargeMode === button}
                onClick={async() => await mqttClient.publishAsync('auto/cmnd/setChargeCurrent', JSON.stringify(6000))}
              >
                {button}
              </Button>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
