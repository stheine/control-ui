import _           from 'lodash';
import RingBuffer  from '@stheine/ringbufferjs';
import React, {
  useContext,
  useRef,
  useState,
} from 'react';

import mqttConfig  from './mqttConfig.js';
import MqttContext from '../../contexts/MqttContext.js';

const displayWattage = function(value) {
  return [
    <td key='value' className={`solar__value${value < 0 ? ' negative' : ''}`}>
      {value < 1000 ? _.round(value) : _.round(value / 1000, 1).toFixed(1)}
    </td>,
    <td key='unit' className='solar__unit'>
      {value < 1000 ? 'W' : 'kW'}
    </td>,
  ];
};

export default function Solar() {
  // console.log('Solar');

  const {messages} = useContext(MqttContext);
  const einkaufRing = useRef(new RingBuffer(3));
  const [_lastUpdateTime, setLastUpdateTime] = useState();

  const siteConfig = _.first(mqttConfig);

  const message = messages[siteConfig.topic];

  if(message) {
    // console.log('Solar', {message});
  }

  const akkuLadelevel           = message?.battery.stateOfCharge  || 0;
  const akkuLadung              = message?.battery.powerIncoming  || 0;
  const solarErzeugung          = _.isNumber(message?.solar.powerOutgoing) ? message.solar.powerOutgoing : 99999;
  const wechselrichterErzeugung = message?.inverter.powerOutgoing || 0;
  const einspeisung             = message?.meter.powerOutgoing    || 0;
  const einkauf                 = message?.meter.powerIncoming    || 0;
  const updateTime              = message?.time;

  const verbrauch               = wechselrichterErzeugung - einspeisung + einkauf;

  if(updateTime !== _lastUpdateTime) {
    setLastUpdateTime(updateTime);

    einkaufRing.current.enq(einkauf);
    // console.log(einkaufRing.current.size(), einkaufRing.current.dump());
  }

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
          <td className='solar__label'>{einspeisung ? 'Einspeisung' : 'Einkauf'}:</td>
          {displayWattage(einspeisung || (einkaufRing.current.size() ? -einkaufRing.current.avg() : 0))}
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
