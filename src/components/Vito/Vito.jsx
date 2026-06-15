import {
  use,
  useMemo,
} from 'react';

import MqttContext  from '../../contexts/MqttContext.js';

import OffColored   from '../../svg/sargam/OffColored.jsx';
import OnColored    from '../../svg/sargam/OnColored.jsx';
import OnOffUnknown from '../../svg/sargam/OnOffUnknown.jsx';

const Sparbetrieb = function(props) {
  const {mqttClient} = use(MqttContext);

  const {sparbetrieb} = props;

  switch(sparbetrieb) {
    case true:
      return (
        <OnColored
          dark={true}
          onClick={async() => {
            // TODO pending setSparbetrieb();
            await mqttClient.publishAsync('vito/cmnd/setHK1BetriebsartSpar', '0');
          }}
        />
      );

    case false:
      return (
        <OffColored
          dark={true}
          onClick={async() => {
            // TODO pending setSparbetrieb();
            await mqttClient.publishAsync('vito/cmnd/setHK1BetriebsartSpar', '1');
          }}
        />
      );

    default:
      return <OnOffUnknown dark={true} />;
  }
};

export default function Vito() {
  const {messages} = use(MqttContext);

  const hk1BetriebsartSpar = messages['vito/tele/SENSOR']?.hk1BetriebsartSpar;
  // const messageTimestamp   = messages['vito/tele/SENSOR']?.timestamp;
  const heizkreisPumpe     = Boolean(Number(messages['vito/tele/SENSOR']?.heizkreisPumpe))     || false;
  const kesselLeistung     = Number(messages['vito/tele/SENSOR']?.kesselLeistung)              || 0;
  const zirkulationsPumpe  = Boolean(Number(messages['vito/tele/SENSOR']?.zirkulationsPumpe))  || false;
  const vorrat             = messages['vito/tele/STATS']?.vorrat;

  const sparbetrieb = useMemo(() => Boolean(Number(hk1BetriebsartSpar)),
    [hk1BetriebsartSpar]);

  if(messages['vito/tele/SENSOR']) {
    // console.log('Vito', {SENSOR: messages['vito/tele/SENSOR'], sparbetrieb, STATS: messages['vito/tele/STATS']});
  }

  return (
    <table>
      <tbody>
        <tr>
          <td>Vorrat:</td>
          <td style={{whiteSpace: 'nowrap'}}>{vorrat} kg</td>
        </tr>
        <tr>
          <td>Heizkreispumpe:</td>
          <td style={{whiteSpace: 'nowrap'}}>{String(heizkreisPumpe)}</td>
        </tr>
        <tr>
          <td>kesselLeistung:</td>
          <td style={{whiteSpace: 'nowrap'}}>{kesselLeistung}</td>
        </tr>
        <tr>
          <td>zirkulationsPumpe:</td>
          <td style={{whiteSpace: 'nowrap'}}>{String(zirkulationsPumpe)}</td>
        </tr>
        <tr>
          <td colSpan={2}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div
                style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10px 10px 0'}}
              >
                sparbetrieb:
              </div>
              <div style={{width: '100px'}}>
                <Sparbetrieb sparbetrieb={sparbetrieb} />
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
