import {use}        from 'react';

import MqttContext  from '../../contexts/MqttContext.js';

import Notification from '../../svg/sargam/Notification.jsx';

export default function LedToggle() {
  const {mqttClient} = use(MqttContext);

  // console.log('Beep');

  return (
    <Notification dark={true} onClick={async() => await mqttClient.publishAsync('control-io/cmnd/beep', '')} />
  );
}
