import _                 from 'lodash';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

const topic = 'vito/tele/SENSOR';

export default function Temperature() {
  // console.log('Temperature');

  const [_message, setMessage] = useState();

  const mqttClient = useContext(MqttClientContext);

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    // console.log('Solar:useEffect, mqttClient');

    return mqttSubscribe({mqttClient, topic, setMessage});
  }, [mqttClient]);

  const {tempAussen} = _message || {};

  return <span>{_.round(tempAussen, 1)}&nbsp;°C</span>;
}
