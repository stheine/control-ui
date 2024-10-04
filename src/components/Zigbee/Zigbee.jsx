import React, {
  useContext,
} from 'react';

import mqttConfig   from './mqttConfig.js';
import MqttContext  from '../../contexts/MqttContext.js';

import OffColored   from '../../svg/sargam/OffColored.jsx';
import OnColored    from '../../svg/sargam/OnColored.jsx';
import OnOffUnknown from '../../svg/sargam/OnOffUnknown.jsx';

export default function Zigbee() {
  const {messages, mqttClient} = useContext(MqttContext);

  const siteConfig = mqttConfig[0];

  const message = messages[siteConfig.topic];

  if(message) {
    // console.log('Zigbee', {message});
  }

  const permitJoin        = message?.permit_join;
  const permitJoinTimeout = message?.permit_join_timeout;
  const restartRequired   = message?.restart_required;
  const version           = message?.version;

  const PermitJoin = function() {
    switch(permitJoin) {
      case true:
        return (
          <OnColored
            dark={true}
            onClick={async() => {
              await mqttClient.publishAsync('Zigbee/bridge/request/permit_join',
                JSON.stringify({value: false}));
            }}
          />
        );

      case false:
        return (
          <OffColored
            dark={true}
            onClick={async() => {
              await mqttClient.publishAsync('Zigbee/bridge/request/permit_join',
                JSON.stringify({value: true, time: 120}));
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
          <td colSpan={2} style={{fontSize: '120%', paddingBottom: '20px'}}>zigbee2mqtt</td>
        </tr>
        <tr>
          <td>Version:</td>
          <td style={{whiteSpace: 'nowrap'}}>{`${version}`}</td>
        </tr>
        {restartRequired ?
          <tr>
            <td>Restart Required:</td>
            <td style={{whiteSpace: 'nowrap'}}>{`${restartRequired}`}</td>
          </tr> :
          null}
        <tr>
          <td colSpan={2}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div
                style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10px 10px 0'}}
              >
                Permit Join:
              </div>
              <div style={{width: '100px'}}>
                <PermitJoin />
              </div>
            </div>
          </td>
        </tr>
        {permitJoinTimeout ?
          <tr>
            <td>Timeout:</td>
            <td style={{whiteSpace: 'nowrap'}}>{`${permitJoinTimeout}`}</td>
          </tr> :
          null}
      </tbody>
    </table>
  );
}
