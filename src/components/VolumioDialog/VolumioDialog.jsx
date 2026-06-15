import {use}       from 'react';

import Dlf         from '../../svg/Dlf.jsx';
import MqttContext from '../../contexts/MqttContext.js';

export default function VolumioDialog() {
  const {mqttClient} = use(MqttContext);

  return (
    <Dlf
      dark={true}
      onClick={async event => {
        event.stopPropagation();

        await mqttClient.publishAsync('volumio/cmnd/DLF', '');
      }}
    />

  );
}
