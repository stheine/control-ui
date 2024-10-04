import _           from 'lodash';
import RingBuffer  from '@stheine/ringbufferjs';
import React, {
  useContext,
  useRef,
  useState,
} from 'react';

import Close       from '../../svg/sargam/Close.jsx';
import Collect     from '../../svg/sargam/Collect.jsx';
import Max         from '../../svg/sargam/Max.jsx';
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

  const {messages, mqttClient} = useContext(MqttContext);
  const einkaufRing = useRef(new RingBuffer(3));
  const [_lastUpdateTime, setLastUpdateTime] = useState();

  const messageSensor = messages['Fronius/solar/tele/SENSOR'];
  const messageStatus = messages['Fronius/solar/tele/STATUS'];

  if(messageSensor || messageStatus) {
    // console.log('Solar', {messageSensor, messageStatus});
  }

  const akkuLadelevel           = messageSensor?.battery.stateOfCharge  || 0;
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
          <td className='solar__label'>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div
                style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10px 10px 0'}}
              >
                Akku:
              </div>
              <div style={{width: '40px'}}>
                {messageStatus?.chargeMax ?
                  <Close
                    dark={true}
                    onClick={async() => {
                      await mqttClient.publishAsync('Fronius/solar/cmnd', JSON.stringify({chargeMax: null}));
                    }}
                  /> :
                  <Collect
                    dark={true}
                    onClick={async() => {
                      await mqttClient.publishAsync('Fronius/solar/cmnd', JSON.stringify({chargeMax: true}));
                    }}
                  />}
              </div>
              <div style={{width: '40px'}}>
                {messageStatus?.chargeTo ?
                  <Close
                    dark={true}
                    onClick={async() => {
                      await mqttClient.publishAsync('Fronius/solar/cmnd', JSON.stringify({chargeTo: null}));
                    }}
                  /> :
                  <Max
                    dark={true}
                    onClick={async() => {
                      await mqttClient.publishAsync('Fronius/solar/cmnd', JSON.stringify({chargeTo: 100}));
                    }}
                  />}
              </div>
            </div>
          </td>
          <td className='solar__value'>{_.round(akkuLadelevel * 100, 1)}</td>
          <td className='solar__unit'>%</td>
        </tr>
      </tbody>
    </table>
  );
}
