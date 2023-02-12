import React, {
  useContext,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';

import Notification           from '../../svg/sargam/Notification.jsx';

export default function LedToggle() {
  const mqttClient = useContext(MqttClientContext);

  // console.log('LedToggle');

  return (
    <Notification dark={true} onClick={() => mqttClient.publish('control-io/cmnd/beep', '')} />
  );
}
