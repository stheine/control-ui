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

  useEffect(() => mqttSubscribe({mqttClient, topic, onMessage: ({message}) => setMessage(message)}),
    [mqttClient]);

  // console.log('Solar', {_message});

  const akkuLadelevel           = _message?.battery.stateOfCharge || 0;
  const akkuLadung              = _message?.battery.powerIncoming || 0;
  const solarErzeugung          = _message?.solar.powerOutgoing || 0;
  const wechselrichterErzeugung = _message?.inverter.powerOutgoing || 0;
  const einspeisung             = _message?.meter.powerOutgoing || 0;
  const einkauf                 = _message?.meter.powerIncoming || 0;

  return (
    <table style={{padding: '0 30px 0 0'}}>
      <tbody>
        <tr>
          <td>Solar:</td>
          <td style={{whiteSpace: 'nowrap'}}>{`${_.round(solarErzeugung / 1000, 1)} kW`}</td>
        </tr>
        <tr>
          <td>Verbrauch:</td>
          <td style={{whiteSpace: 'nowrap'}}>{`${_.round(wechselrichterErzeugung - einspeisung + einkauf)} W`}</td>
        </tr>
        <tr>
          <td>Akkuladung:</td>
          <td style={{whiteSpace: 'nowrap'}}>{`${_.round(akkuLadung / 1000, 1)} kW`}</td>
        </tr>
        <tr>
          <td>Einspeisung:</td>
          <td style={{whiteSpace: 'nowrap'}}>{`${_.round(einspeisung / 1000, 1)} kW`}</td>
        </tr>
        <tr>
          <td>Akku:</td>
          <td style={{whiteSpace: 'nowrap'}}>{`${_.round(akkuLadelevel * 100, 2)}%`}</td>
        </tr>
      </tbody>
    </table>
  );
}
//        <tr>
//          <td>Wechselrichter:</td>
//          <td style={{whiteSpace: 'nowrap'}}>{`${_.round(wechselrichterErzeugung / 1000, 1)} kW`}</td>
//        </tr>
