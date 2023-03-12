import React, {
  useContext,
} from 'react';

import MqttContext  from '../../contexts/MqttContext.js';

import Notification from '../../svg/sargam/Notification.jsx';

export default function LedToggle() {
  const {mqttClient} = useContext(MqttContext);

  // console.log('Beep');

  return (
    <Notification dark={true} onClick={() => mqttClient.publish('control-io/cmnd/beep', '')} />
  );
}
