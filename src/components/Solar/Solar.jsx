import _           from 'lodash';
import RingBuffer  from '@stheine/ringbufferjs';
import React, {
  useContext,
  useRef,
  useState,
} from 'react';

import AppContext  from '../../contexts/AppContext.js';
import MqttContext from '../../contexts/MqttContext.js';
import Value       from '../Value/Value.jsx';

const wattage = function(value) {
  return {
    color: value <    0 ? '#ff8080'      : null,
    value: value < 1000 ? _.round(value) : Number(_.round(value / 1000, 1).toFixed(1)),
    unit:  value < 1000 ? 'W'            : 'kW',
  };
};

export default function Solar() {
  // console.log('Solar');

  const {setAppDialog} = useContext(AppContext);
  const {messages} = useContext(MqttContext);
  const einkaufRing = useRef(new RingBuffer(3));
  const [_lastUpdateTime, setLastUpdateTime] = useState();

  const messageSensor = messages['Fronius/solar/tele/SENSOR'];
  const messageStatus = messages['Fronius/solar/tele/STATUS'];

  if(messageSensor || messageStatus) {
    // console.log('Solar', {messageSensor, messageStatus});
  }

  const akkuLadung              = messageSensor?.battery.powerIncoming  || 0;
  const solarErzeugung          = _.isNumber(messageSensor?.solar.powerOutgoing) ?
    messageSensor.solar.powerOutgoing :
    99999;
  const wechselrichterErzeugung = messageSensor?.inverter.powerOutgoing || 0;
  const einspeisung             = messageSensor?.meter.powerOutgoing    || 0;
  const einkauf                 = messageSensor?.meter.powerIncoming    || 0;
  const updateTime              = messageSensor?.time;

  const verbrauch               = wechselrichterErzeugung - einspeisung + einkauf;

  if(updateTime !== _lastUpdateTime) {
    setLastUpdateTime(updateTime);

    einkaufRing.current.enq(einkauf);
    // console.log(einkaufRing.current.size(), einkaufRing.current.dump());
  }

  return (
    <div
      className='solarDiv'
      onClick={() => setAppDialog({content: 'SolarForecast', header: 'PV Vorhersage', timeout: '30s'})}
    >
      <table className='solar'>
        <tbody>
          <tr>
            <td className='solar__label'>Solar:</td>
            <Value
              className='digitalism'
              unitOn='top'
              {...wattage(solarErzeugung)}
            />
          </tr>
          <tr>
            <td className='solar__label'>Verbrauch:</td>
            <Value
              className='digitalism'
              unitOn='top'
              {...wattage(verbrauch)}
            />
          </tr>
          <tr>
            <td className='solar__label'>Akkuladung:</td>
            <Value
              className='digitalism'
              unitOn='top'
              {...wattage(akkuLadung)}
            />
          </tr>
          <tr>
            <td className='solar__label'>{einspeisung ? 'Einspeisung' : 'Einkauf'}:</td>
            <Value
              className='digitalism'
              unitOn='top'
              {...wattage(einspeisung || (einkaufRing.current.size() ? -einkaufRing.current.avg() : 0))}
            />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
