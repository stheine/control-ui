import _ from 'lodash';
import React, {
  useContext,
} from 'react';

import Button                  from '../Button/Button.jsx';
import MqttContext             from '../../contexts/MqttContext.js';
import Value                   from '../Value/Value.jsx';
import {vwId}                  from '../Auto/mqttConfig.js';
import {wallboxStateToAnzeige} from '../Auto/Auto.jsx';

const buttonsLademodus = [
  'Überschuss',
  'Überschuss+',
  'Nachts',
  'Sofort',
  'Sofort+',
  // 'Aus',
];
const buttonsLadestrom = {
  4:   6000,
  6:   8500,
  8:  11000,
  11: 16000,
};
const buttonsSocTarget = [
  50,
  60,
  70,
  80,
  90,
  100,
];

export default function AutoLaden() {
  const {messages, mqttClient} = useContext(MqttContext);

  const ladestrom       = messages['Wallbox/evse/external_current'].current;
  const reichweite      = messages[`carconnectivity/garage/${vwId}/drives/primary/range`];
  const ladelevel       = messages[`carconnectivity/garage/${vwId}/drives/primary/level`];
  const ladeziel        = messages[`carconnectivity/garage/${vwId}/charging/settings/target_level`];
  const ladezielPending = messages['auto/cmnd/vwTargetSocPending'];
  const autoStatus      = messages['auto/tele/STATUS'];

  const activeLadestromButton = _.findKey(buttonsLadestrom, buttonLadestrom => buttonLadestrom === ladestrom);
  const {atHome, chargeMode: activeChargeMode, wallboxState} = autoStatus;
  const ladestatusAnzeige = wallboxStateToAnzeige({atHome, wallboxState});

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
//  ladestatusAnzeige === 'Lädt' ?
//    {
//      label: 'Ladeleistung (Auto)',
//      value: ladeleistung,
//      unit:  'kW',
//    } :
//    null,
// ladestatusAnzeige === 'Lädt' ?
// {
//    label: 'Ladetyp',
//    value: ladetyp,
// } :
// null,
//  ladestatusAnzeige === 'Lädt' ?
//    {
//      label: 'Ladedauer',
//      value: `${Math.trunc(ladezeit / 60)}:${_.padStart(ladezeit % 60, 2, '0')}`,
//    } :
//    null,
//  {
//    label: 'Ladeziel',
//    value: ladeziel,
//    unit:  '%',
//  },
  ]);

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
        {['Sofort', 'Sofort+'].includes(activeChargeMode) ?
          <tr className='ladestrom'>
            <td colSpan={3} className='buttons'>
              <div>
                {Object.keys(buttonsLadestrom).map(button => (
                  <Button
                    key={button}
                    className='button'
                    active={button === activeLadestromButton}
                    onClick={async() => await mqttClient.publishAsync('auto/cmnd/setChargeCurrent',
                      JSON.stringify(buttonsLadestrom[button]))}
                  >
                    {button}kW
                  </Button>
                ))}
              </div>
            </td>
          </tr> :
          null
        }
        {['Nachts', 'Sofort', 'Sofort+', 'Überschuss', 'Überschuss+'].includes(activeChargeMode) ?
          <tr className='ladeziel'>
            <td colSpan={5} className='buttons'>
              <div>
                {buttonsSocTarget.map(button => {
                  let buttonText;

                  if(ladezielPending) {
                    if(button === ladezielPending) {
                      buttonText = `${button} % .`;
                    } else if(button === ladeziel) {
                      buttonText = `${button} % .`;
                    } else {
                      buttonText = `${button} %`;
                    }
                  } else {
                    buttonText = `${button} %`;
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
      </tbody>
    </table>
  );
}
