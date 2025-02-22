import _           from 'lodash';
import RingBuffer  from '@stheine/ringbufferjs';
import React, {
  useContext,
  useRef,
  useState,
} from 'react';

import AppContext  from '../../contexts/AppContext.js';
import Close       from '../../svg/sargam/Close.jsx';
import Collect     from '../../svg/sargam/Collect.jsx';
import Max         from '../../svg/sargam/Max.jsx';
import MqttContext from '../../contexts/MqttContext.js';
import Value       from '../Value/Value.jsx';

//TODO button akku sparen (use grid)
//TODO button jetzt akku fuellen (bis x%)

export default function Strom() {
  // console.log('Strom');

  const {setAppDialog} = useContext(AppContext);
  const {messages, mqttClient} = useContext(MqttContext);
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
                      onClick={async event => {
                        event.stopPropagation();

                        await mqttClient.publishAsync('Fronius/solar/cmnd', JSON.stringify({chargeMax: null}));
                      }}
                    /> :
                    <Collect
                      dark={true}
                      onClick={async event => {
                        event.stopPropagation();

                        await mqttClient.publishAsync('Fronius/solar/cmnd', JSON.stringify({chargeMax: true}));
                      }}
                    />}
                </div>
                <div style={{width: '40px'}}>
                  {messageStatus?.chargeTo ?
                    <Close
                      dark={true}
                      onClick={async event => {
                        event.stopPropagation();

                        await mqttClient.publishAsync('Fronius/solar/cmnd', JSON.stringify({chargeTo: null}));
                      }}
                    /> :
                    <Max
                      dark={true}
                      onClick={async event => {
                        event.stopPropagation();

                        await mqttClient.publishAsync('Fronius/solar/cmnd', JSON.stringify({chargeTo: 100}));
                      }}
                    />}
                </div>
              </div>
            </td>
            <Value
              className='digitalism'
              value={_.round(akkuLadelevel * 100, 1)}
              unit='%'
              unitOn='bottom'
            />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
