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

  const akkuLadelevel           = _message?.battery.stateOfCharge  || 0;
  const akkuLadung              = _message?.battery.powerIncoming  || 0;
  const solarErzeugung          = _message?.solar.powerOutgoing    || 99999;
  const wechselrichterErzeugung = _message?.inverter.powerOutgoing || 0;
  const einspeisung             = _message?.meter.powerOutgoing    || 0;
  const einkauf                 = _message?.meter.powerIncoming    || 0;

  return (
    <table className='solar'>
      <tbody>
        <tr>
          <td className='solar__label'>Solar:</td>
          <td className='solar__value'>
            {solarErzeugung < 1000 ? _.round(solarErzeugung) : _.round(solarErzeugung / 1000, 1)}
          </td>
          <td className='solar__unit'>{solarErzeugung < 1000 ? 'W' : 'kW'}</td>
        </tr>
        <tr>
          <td className='solar__label'>Verbrauch:</td>
          <td className='solar__value'>{_.round(wechselrichterErzeugung - einspeisung + einkauf)}</td>
          <td className='solar__unit'>W</td>
        </tr>
        <tr>
          <td className='solar__label'>Akkuladung:</td>
          <td className='solar__value'>{_.round(akkuLadung / 1000, 1)}</td>
          <td className='solar__unit'>kW</td>
        </tr>
        <tr>
          <td className='solar__label'>Einspeisung:</td>
          <td className='solar__value'>{_.round(einspeisung / 1000, 1)}</td>
          <td className='solar__unit'>kW</td>
        </tr>
        <tr>
          <td className='solar__label'>Akku:</td>
          <td className='solar__value'>{_.round(akkuLadelevel * 100, 2)}</td>
          <td className='solar__unit'>%</td>
        </tr>
      </tbody>
    </table>
  );
}
//        <tr>
//          <td>Wechselrichter:</td>
//          <td style={{whiteSpace: 'nowrap'}}>{`${_.round(wechselrichterErzeugung / 1000, 1)} kW`}</td>
//        </tr>
