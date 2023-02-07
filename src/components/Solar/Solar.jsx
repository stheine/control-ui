import _                 from 'lodash';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

const topic = 'Fronius/solar/tele/SENSOR';

export default function Solar() {
  // console.log('Solar');

  const [_message, setMessage] = useState();

  const mqttClient = useContext(MqttClientContext);

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    // console.log('Solar:useEffect, mqttClient');

    return mqttSubscribe({mqttClient, topic, setMessage});
  }, [mqttClient]);

  const stateOfCharge = _message?.battery.stateOfCharge || 0;
  const powerOutgoing = _message?.inverter.powerOutgoing || 0;

  return (
    <table style={{padding: '0 30px 0 0'}}>
      <tbody>
        <tr>
          <td>Akku:</td>
          <td style={{whiteSpace: 'nowrap'}}>{`${_.round(stateOfCharge * 100, 2)}%`}</td>
        </tr>
        <tr>
          <td>Leistung:</td>
          <td style={{whiteSpace: 'nowrap'}}>{`${_.round(powerOutgoing / 1000, 1)} kW`}</td>
        </tr>
      </tbody>
    </table>
  );
}
