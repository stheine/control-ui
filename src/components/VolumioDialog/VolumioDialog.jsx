// import _     from 'lodash';
import React, {
  useContext,
} from 'react';

import Dlf         from '../../svg/Dlf.jsx';
import MqttContext from '../../contexts/MqttContext.js';

export default function VolumioDialog() {
  const {mqttClient} = useContext(MqttContext);

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
