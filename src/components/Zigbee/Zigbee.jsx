import dayjs        from 'dayjs';
import {use}        from 'react';

import mqttConfig   from './mqttConfig.js';
import MqttContext  from '../../contexts/MqttContext.js';

import OffColored   from '../../svg/sargam/OffColored.jsx';
import OnColored    from '../../svg/sargam/OnColored.jsx';
import OnOffUnknown from '../../svg/sargam/OnOffUnknown.jsx';

const PermitJoin = function(props) {
  const {permitJoin} = props;
  const {mqttClient} = use(MqttContext);

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

export default function Zigbee() {
  const {messages} = use(MqttContext);

  const siteConfig = mqttConfig[0];

  const message = messages[siteConfig.topic];

  if(message) {
    // console.log('Zigbee', {message});
  }

  const permitJoin      = message?.permit_join;
  const permitJoinEnd   = message?.permit_join_end;
  const restartRequired = message?.restart_required;
  const version         = message?.version;

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
                style={{
                  display:        'flex',
                  flexDirection:  'column',
                  justifyContent: 'center',
                  padding:        '0 10px 10px 0',
                  whiteSpace:     'nowrap',
                }}
              >
                Permit Join:
              </div>
              <div style={{width: '100px'}}>
                <PermitJoin permitJoin={permitJoin} />
              </div>
            </div>
          </td>
        </tr>
        {permitJoinEnd ?
          <tr>
            <td>Until:</td>
            <td style={{whiteSpace: 'nowrap'}}>{`${dayjs(permitJoinEnd).format('HH:mm:ss')}`}</td>
          </tr> :
          null}
      </tbody>
    </table>
  );
}
