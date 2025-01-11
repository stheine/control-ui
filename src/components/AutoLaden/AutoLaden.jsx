import _ from 'lodash';
import React, {
  useContext,
} from 'react';

import Button                  from '../Button/Button.jsx';
import MqttContext             from '../../contexts/MqttContext.js';
import Value                   from '../Value/Value.jsx';
import {wallboxStateToAnzeige} from '../Auto/Auto.jsx';

const buttonsLademodus = [
  'Überschuss',
  'Nachts',
  'Sofort',
  'Aus',
];
const buttonsLadestrom = [
  '-',
  '4kW',
  '11kW',
  '+',
];
const buttonsSocTarget = [
  70,
  80,
  90,
  100,
];
const messagePrefix = 'vwsfriend/vehicles/WVWZZZE1ZPP505932/domains/charging';

export default function AutoLaden() {
  const {messages, mqttClient} = useContext(MqttContext);

  const ladestrom       = messages['Wallbox/evse/external_current'].current;
  const reichweite      = messages[`${messagePrefix}/batteryStatus/cruisingRangeElectric_km`];
  const ladelevel       = messages[`${messagePrefix}/batteryStatus/currentSOC_pct`];
  const ladeleistung    = messages[`${messagePrefix}/chargingStatus/chargePower_kW`];
//  const ladetyp         = messages[`${messagePrefix}/chargingStatus/chargeType`];
  const ladezeit        = messages[`${messagePrefix}/chargingStatus/remainingChargingTimeToComplete_min`];
  const ladeziel        = messages[`${messagePrefix}/chargingSettings/targetSOC_pct`];
  const ladezielPending = messages['auto/cmnd/vwTargetSocPending'];
  const status          = messages['auto/tele/STATUS'];

  const {chargeMode: activeChargeMode, wallboxState} = status;
  const ladestatusAnzeige = wallboxStateToAnzeige(wallboxState);

  // console.log('AutoLaden', {status, ladestrom, ladeziel});

  const fields = _.compact([{
    label: 'Akku',
    value: ladelevel,
    unit:  '%',
  }, {
    label: 'Reichweite',
    value: reichweite,
    unit:  'km',
  }, {
    label: 'Status',
    value: ladestatusAnzeige,
  },
  ladestatusAnzeige === 'Lädt' ?
    {
      label: 'Ladeleistung (Wallbox)',
      value: _.round(ladestrom * 3 * 230 / 1000 / 1000, 1),
      unit:  'kW',
    } :
    null,
  ladestatusAnzeige === 'Lädt' ?
    {
      label: 'Ladeleistung (Auto)',
      value: ladeleistung,
      unit:  'kW',
    } :
    null,
// ladestatusAnzeige === 'Lädt' ?
// {
//    label: 'Ladetyp',
//    value: ladetyp,
// } :
// null,
  ladestatusAnzeige === 'Lädt' ?
    {
      label: 'Ladedauer',
      value: `${Math.trunc(ladezeit / 60)}:${_.padStart(ladezeit % 60, 2, '0')}`,
    } :
    null,
  {
    label: 'Ladeziel',
    value: ladeziel,
    unit:  '%',
  }]);

  return (
    <table className='autoLaden'>
      <tbody>
        {fields.map(field => (
          <tr key={field.label} className='daten'>
            <td style={{width: '100px'}}>
              {field.label}:
            </td>
            <Value value={field.value} unit={field.unit} />
          </tr>
        ))}
        <tr className='lademodus'>
          <td colSpan={3} className='buttons'>
            <div>
              {buttonsLademodus.map(button => (
                <Button
                  key={button}
                  className='button'
                  active={activeChargeMode === button}
                  onClick={async() => await mqttClient.publishAsync('auto/cmnd/setChargeMode', button)}
                >
                  {button}
                </Button>
              ))}
            </div>
          </td>
        </tr>
        {['Nachts', 'Sofort'].includes(activeChargeMode) ?
          <tr className='ladeziel'>
            <td colSpan={3} className='buttons'>
              <div>
                {buttonsSocTarget.map(button => {
                  let buttonText;

                  if(ladezielPending) {
                    if(button === ladezielPending) {
                      buttonText = `${button} (pending)`;
                    } else if(button === ladeziel) {
                      buttonText = `${button} (old)`;
                    } else {
                      buttonText = button;
                    }
                  } else {
                    buttonText = button;
                  }

                  return (
                    <Button
                      key={button}
                      className='button'
                      active={ladezielPending ? button === ladezielPending : button === ladeziel}
                      onClick={async() =>
                        await mqttClient.publishAsync(`auto/cmnd/vwTargetSocPending`, String(button), {retain: true})}
                    >
                      {buttonText}
                    </Button>
                  );
                })}
              </div>
            </td>
          </tr> :
          null
        }
        {activeChargeMode === 'Schnell' ?
          <tr className='ladestrom'>
            <td colSpan={3} className='buttons'>
              <div>
                {buttonsLadestrom.map(button => (
                  <Button
                    key={button}
                    className='button'
                    active={activeChargeMode === button}
                    onClick={async() =>
                      await mqttClient.publishAsync('auto/cmnd/setChargeCurrent', JSON.stringify(6000))}
                  >
                    {button}
                  </Button>
                ))}
              </div>
            </td>
          </tr> :
          null
        }
      </tbody>
    </table>
  );
}
