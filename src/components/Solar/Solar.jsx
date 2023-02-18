import _                 from 'lodash';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import MqttClientContext from '../../contexts/MqttClient.js';
import mqttSubscribe     from '../../lib/mqttSubscribe.js';

const topic = 'Fronius/solar/tele/SENSOR';

const displayWattage = function(value) {
  return [
    <td key='value' className='solar__value'>
      {value < 1000 ? _.round(value) : _.round(value / 1000, 1).toFixed(1)}
    </td>,
    <td key='unit' className='solar__unit'>
      {value < 1000 ? 'W' : 'kW'}
    </td>,
  ];
};

export default function Solar() {
  // console.log('Solar');

  const [_message, setMessage] = useState();

  const mqttClient = useContext(MqttClientContext);

  useEffect(() => mqttSubscribe({mqttClient, topic, onMessage: ({message}) => setMessage(message)}),
    [mqttClient]);

  // console.log('Solar', {_message});

  const akkuLadelevel           = _message?.battery.stateOfCharge  || 0;
  const akkuLadung              = _message?.battery.powerIncoming  || 0;
  const solarErzeugung          = _.isNumber(_message?.solar.powerOutgoing) ? _message.solar.powerOutgoing : 99999;
  const wechselrichterErzeugung = _message?.inverter.powerOutgoing || 0;
  const einspeisung             = _message?.meter.powerOutgoing    || 0;
  const einkauf                 = _message?.meter.powerIncoming    || 0;

  const verbrauch               = wechselrichterErzeugung - einspeisung + einkauf;

  return (
    <table className='solar'>
      <tbody>
        <tr>
          <td className='solar__label'>Solar:</td>
          {displayWattage(solarErzeugung)}
        </tr>
        <tr>
          <td className='solar__label'>Verbrauch:</td>
          {displayWattage(verbrauch)}
        </tr>
        <tr>
          <td className='solar__label'>Akkuladung:</td>
          {displayWattage(akkuLadung)}
        </tr>
        <tr>
          <td className='solar__label'>Einspeisung:</td>
          {displayWattage(einspeisung)}
        </tr>
        <tr>
          <td className='solar__label'>Akku:</td>
          <td className='solar__value'>{_.round(akkuLadelevel * 100, 1)}</td>
          <td className='solar__unit'>%</td>
        </tr>
      </tbody>
    </table>
  );
}
