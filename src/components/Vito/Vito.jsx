import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

import OffColored        from '../../svg/sargam/OffColored.jsx';
import OnColored         from '../../svg/sargam/OnColored.jsx';
import OnOffUnknown      from '../../svg/sargam/OnOffUnknown.jsx';

const topic = 'vito/tele/SENSOR';

export default function Vito() {
  const [_message, setMessage] = useState();
  const [_sparbetrieb, setSparbetrieb] = useState();

  const mqttClient = useContext(MqttClientContext);

  useEffect(() => mqttSubscribe({mqttClient, topic, onMessage: ({message}) => setMessage(message)}),
    [mqttClient]);

  useEffect(() => setSparbetrieb(Boolean(Number(_message?.hk1BetriebsartSpar))),
    [_message?.hk1BetriebsartSpar]);

  const heizkreisPumpe    = Boolean(Number(_message?.heizkreisPumpe))     || false;
  const kesselLeistung    = Number(_message?.kesselLeistung)              || 0;
  const zirkulationsPumpe = Boolean(Number(_message?.zirkulationsPumpe))  || false;

  if(_message) {
  // console.log('Vito', {_message, _sparbetrieb});
  }

  const Sparbetrieb = function() {
    switch(_sparbetrieb) {
      case true:
        return (
          <OnColored
            dark={true}
            onClick={() => {
              setSparbetrieb();
              mqttClient.publish('vito/cmnd/setHK1BetriebsartSpar', '0');
            }}
          />
        );

      case false:
        return (
          <OffColored
            dark={true}
            onClick={() => {
              setSparbetrieb();
              mqttClient.publish('vito/cmnd/setHK1BetriebsartSpar', '1');
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
          <td>Heizkreispumpe:</td>
          <td style={{whiteSpace: 'nowrap'}}>{`${heizkreisPumpe}`}</td>
        </tr>
        <tr>
          <td>kesselLeistung:</td>
          <td style={{whiteSpace: 'nowrap'}}>{`${kesselLeistung}`}</td>
        </tr>
        <tr>
          <td>zirkulationsPumpe:</td>
          <td style={{whiteSpace: 'nowrap'}}>{`${zirkulationsPumpe}`}</td>
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
