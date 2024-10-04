import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttContext  from '../../contexts/MqttContext.js';

import OffColored   from '../../svg/sargam/OffColored.jsx';
import OnColored    from '../../svg/sargam/OnColored.jsx';
import OnOffUnknown from '../../svg/sargam/OnOffUnknown.jsx';

export default function Vito() {
  const [_sparbetrieb, setSparbetrieb] = useState();

  const {messages, mqttClient} = useContext(MqttContext);

  const hk1BetriebsartSpar = messages['vito/tele/SENSOR']?.hk1BetriebsartSpar;
  const messageTimestamp    = messages['vito/tele/SENSOR']?.timestamp;

  useEffect(() => setSparbetrieb(Boolean(Number(hk1BetriebsartSpar))),
    [messageTimestamp, hk1BetriebsartSpar]);

  const heizkreisPumpe    = Boolean(Number(messages['vito/tele/SENSOR']?.heizkreisPumpe))     || false;
  const kesselLeistung    = Number(messages['vito/tele/SENSOR']?.kesselLeistung)              || 0;
  const zirkulationsPumpe = Boolean(Number(messages['vito/tele/SENSOR']?.zirkulationsPumpe))  || false;
  const vorrat            = messages['vito/tele/STATS']?.vorrat;

  if(messages['vito/tele/SENSOR']) {
    // console.log('Vito', {SENSOR: messages['vito/tele/SENSOR'], _sparbetrieb, STATS: messages['vito/tele/STATS']});
  }

  const Sparbetrieb = function() {
    switch(_sparbetrieb) {
      case true:
        return (
          <OnColored
            dark={true}
            onClick={async() => {
              setSparbetrieb();
              await mqttClient.publishAsync('vito/cmnd/setHK1BetriebsartSpar', '0');
            }}
          />
        );

      case false:
        return (
          <OffColored
            dark={true}
            onClick={async() => {
              setSparbetrieb();
              await mqttClient.publishAsync('vito/cmnd/setHK1BetriebsartSpar', '1');
            }}
          />
        );

      default:
        return <OnOffUnknown dark={true} />;
    }
  };

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
                <Sparbetrieb />
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
