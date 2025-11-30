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

export default function Strom() {
  // console.log('Strom');

  const {setAppDialog} = useContext(AppContext);
  const {messages} = useContext(MqttContext);
  const einkaufRing = useRef(new RingBuffer(3));
  const [_lastUpdateTime, setLastUpdateTime] = useState();

  const messageSensor = messages['Fronius/solar/tele/SENSOR'];
  const messageStatus = messages['Fronius/solar/tele/STATUS'];

  if(messageSensor || messageStatus) {
    // console.log('Strom', {messageSensor, messageStatus});
  }

  const akkuLadelevel           = messageSensor?.battery.stateOfCharge  || 0;
//  const akkuLadung              = messageSensor?.battery.powerIncoming  || 0;
//  const solarErzeugung          = _.isNumber(messageSensor?.solar.powerOutgoing) ?
//    messageSensor.solar.powerOutgoing :
//    99999;
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
      className='stromDiv'
      onClick={() => setAppDialog({content: 'Strompreise', header: 'Strompreise', timeout: '30s'})}
    >
      <table className='strom'>
        <tbody>
          <tr>
            <td className='strom__label'>Verbrauch:</td>
            <Value
              className='digitalism'
              value={verbrauch <= 1000 ? _.round(verbrauch) : Number(_.round(verbrauch / 1000, 1).toFixed(1))}
              unit={verbrauch <= 1000 ? 'W' : 'kW'}
              unitOn='top'
            />
          </tr>
          <tr>
            <td className='strom__label'>
              Akku:
            </td>
            <Value
              className='digitalism'
              value={_.round(akkuLadelevel * 100, 1)}
              unit='%'
              unitOn='bottom'
            />
          </tr>
          <tr>
            <td className='strom__label'>Status:</td>
            <Value
              className='small'
              value={messageStatus?.batteryStatus}
              unit={null}
            />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
